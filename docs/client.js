const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let touchX = null, touchY = null;

const world = {
  width: 6000,
  height: 6000,
  pellets: [],
  ejected: [],
  player: null,
  bots: []
};

// ----- CLASSES -----
class Cell {
  constructor(x, y, radius, color, name = "Player") {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.name = name;
    this.speed = 3;
  }
  draw(ctx, camX, camY) {
    // Gradiente radial estilo Agar.io
    const grad = ctx.createRadialGradient(this.x - camX, this.y - camY, this.radius * 0.1, this.x - camX, this.y - camY, this.radius);
    grad.addColorStop(0, this.color);
    grad.addColorStop(1, "#00000000");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x - camX, this.y - camY, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Borda branca suave
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Nome do jogador
    ctx.fillStyle = 'white';
    ctx.font = `${Math.max(12, this.radius / 2)}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText(this.name, this.x - camX, this.y - camY + 4);
  }
  move(dx, dy) {
    const len = Math.hypot(dx, dy);
    if (len > 0) {
      dx /= len; dy /= len;
      this.x += dx * this.speed * (50 / this.radius);
      this.y += dy * this.speed * (50 / this.radius);
    }
    this.x = Math.max(this.radius, Math.min(world.width - this.radius, this.x));
    this.y = Math.max(this.radius, Math.min(world.height - this.radius, this.y));
  }
  eat(target) {
    const dist = Math.hypot(this.x - target.x, this.y - target.y);
    if (dist < this.radius + target.radius) {
      this.radius += target.radius * 0.2;
      return true;
    }
    return false;
  }
}

class Pellet {
  constructor(x, y, radius = 5) {
    this.x = x; this.y = y; this.radius = radius;
    const colors = ["#ff7f50","#ffdb58","#7fffd4","#87cefa","#dda0dd"];
    this.color = colors[Math.floor(Math.random()*colors.length)];
  }
  draw(ctx, camX, camY) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x - camX, this.y - camY, this.radius, 0, Math.PI*2);
    ctx.fill();
  }
}

class Ejected {
  constructor(x, y, radius = 5, color = "#0f0", dx = 0, dy = 0) {
    this.x = x; this.y = y; this.radius = radius; this.color = color; this.dx = dx; this.dy = dy;
  }
  draw(ctx, camX, camY) {
    ctx.beginPath(); ctx.fillStyle = this.color; ctx.arc(this.x - camX, this.y - camY, this.radius, 0, Math.PI*2); ctx.fill();
  }
  move() { this.x += this.dx; this.y += this.dy; this.dx *= 0.95; this.dy *= 0.95; }
}

// ----- BOT MULTI-CELL -----
class BotMultiCell {
  constructor(name, color, x, y, radius) {
    this.name = name; this.color = color;
    this.cells = [new Cell(x, y, radius, color, name)];
    this.splitCooldown = 0; this.ejectCooldown = 0;
  }
  ai() {
    this.splitCooldown = Math.max(0, this.splitCooldown - 1);
    this.ejectCooldown = Math.max(0, this.ejectCooldown - 1);
    this.cells.forEach(cell => {
      let target = null;

      // Ameaças
      const threats = [...world.bots.flatMap(b => b.cells), ...world.player.cells]
        .filter(c => c !== cell && c.radius > cell.radius*1.1);
      if(threats.length>0){
        const threat = threats.reduce((a,b)=>Math.hypot(cell.x-a.x,cell.y-a.y)<Math.hypot(cell.x-b.x,cell.y-b.y)?a:b);
        const dx = cell.x - threat.x; const dy = cell.y - threat.y;
        cell.move(dx,dy); return;
      }

      // Presas
      const prey = [...world.bots.flatMap(b => b.cells), ...world.player.cells]
        .filter(c => c!==cell && c.radius*1.1<cell.radius);
      if(prey.length>0) target = prey.reduce((a,b)=>Math.hypot(cell.x-a.x,cell.y-a.y)<Math.hypot(cell.x-b.x,cell.y-b.y)?a:b);

      if(!target && world.pellets.length>0) target = world.pellets.reduce((a,b)=>Math.hypot(cell.x-a.x,cell.y-a.y)<Math.hypot(cell.x-b.x,cell.y-b.y)?a:b);

      if(target){
        let dx = target.x-cell.x, dy = target.y-cell.y; const dist = Math.hypot(dx,dy);
        if(dist>0){dx/=dist; dy/=dist;}
        let speedFactor = (prey.length>0 && target.radius<cell.radius/1.5)?2:1;
        cell.move(dx*speedFactor,dy*speedFactor);

        if(prey.length>0 && this.splitCooldown===0 && target.radius<cell.radius/2 && dist<cell.radius*3){
          this.splitCell(cell,target); this.splitCooldown=100;
        }
        if(this.ejectCooldown===0 && Math.random()<0.05){ ejectMass(cell,dx,dy); this.ejectCooldown=50; }
      }
    });
    this.cells.forEach(c=>{c.x=Math.max(c.radius,Math.min(world.width-c.radius,c.x)); c.y=Math.max(c.radius,Math.min(world.height-c.radius,c.y));});
  }
  splitCell(cell,target=null){
    if(cell.radius<20) return;
    const r=cell.radius/2; cell.radius=r;
    const angle=target?Math.atan2(target.y-cell.y,target.x-cell.x):Math.random()*Math.PI*2;
    const newCell=new Cell(cell.x+Math.cos(angle)*r*2, cell.y+Math.sin(angle)*r*2,r,this.color,this.name);
    this.cells.push(newCell);
  }
}

// ----- PLAYER MULTI-CELL -----
class PlayerMultiCell {
  constructor(name,color,x,y,radius){
    this.name=name; this.color=color; this.cells=[new Cell(x,y,radius,color,name)];
  }
  move(dx,dy){this.cells.forEach(c=>c.move(dx,dy));}
  split(){
    const newCells=[];
    this.cells.forEach(c=>{
      if(c.radius<20) return;
      const r=c.radius/2; c.radius=r;
      const angle=Math.random()*Math.PI*2;
      newCells.push(new Cell(c.x+Math.cos(angle)*r*2,c.y+Math.sin(angle)*r*2,r,this.color,this.name));
    });
    this.cells.push(...newCells);
  }
}

// ----- INIT -----
function init(){
  world.player=new PlayerMultiCell("Você","#00f",world.width/2,world.height/2,30);
  world.pellets=[];
  for(let i=0;i<2000;i++) world.pellets.push(new Pellet(Math.random()*world.width,Math.random()*world.height,5+Math.random()*3));
  world.bots=[];
  for(let i=0;i<40;i++){
    const radius=30+Math.random()*20;
    world.bots.push(new BotMultiCell("Bot"+(i+1),"#f00",Math.random()*world.width,Math.random()*world.height,radius));
  }
  world.ejected=[];
}

// ----- UPDATE -----
function update(){
  let dx=0,dy=0;
  if(touchX!==null && touchY!==null){ dx=touchX-canvas.width/2; dy=touchY-canvas.height/2; }
  world.player.move(dx,dy);
  world.bots.forEach(bot=>bot.ai());

  // Comer pellets
  world.pellets=world.pellets.filter(p=>![...world.player.cells,...world.bots.flatMap(b=>b.cells)].some(c=>c.eat(p)));

  // Ejected
  world.ejected.forEach(e=>{ [...world.player.cells,...world.bots.flatMap(b=>b.cells)].forEach(c=>{if(c.eat(e)) e.radius=0;}); e.move(); });
  world.ejected = world.ejected.filter(e=>e.radius>0);

  // Colisão entre células
  const allCells=[...world.player.cells,...world.bots.flatMap(b=>b.cells)];
  allCells.forEach(c1=>allCells.forEach(c2=>{if(c1!==c2 && c1.radius>c2.radius*1.1){ const dist=Math.hypot(c1.x-c2.x,c1.y-c2.y); if(dist<c1.radius){c1.radius+=c2.radius*0.9; c2.radius=0;}}}));
  world.bots.forEach(bot=>bot.cells=bot.cells.filter(c=>c.radius>0));
  world.player.cells=world.player.cells.filter(c=>c.radius>0);
}

// ----- DRAW -----
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  const playerSize=Math.max(...world.player.cells.map(c=>c.radius));
  const zoom=Math.min(1,50/playerSize);
  ctx.save(); ctx.scale(zoom,zoom);

  const camX=world.player.cells[0].x-canvas.width/2/zoom;
  const camY=world.player.cells[0].y-canvas.height/2/zoom;

  // Background simples
  ctx.fillStyle="#f2f2f2"; ctx.fillRect(0,0,world.width,world.height);

  world.pellets.forEach(p=>p.draw(ctx,camX,camY));
  world.ejected.forEach(e=>e.draw(ctx,camX,camY));
  [...world.player.cells,...world.bots.flatMap(b=>b.cells)].forEach(c=>c.draw(ctx,camX,camY));

  const leaders=document.getElementById('leaders'); leaders.innerHTML='';
  [...world.player.cells,...world.bots.flatMap(b=>b.cells)].sort((a,b)=>b.radius-a.radius).slice(0,10).forEach(c=>{const li=document.createElement('li'); li.textContent=`${c.name} (${Math.round(c.radius)})`; leaders.appendChild(li);});

  ctx.restore();
}

// ----- LOOP -----
function loop(){update(); draw(); requestAnimationFrame(loop);}
init(); loop();

// ----- TOUCH CONTROLS -----
canvas.addEventListener('touchstart', e=>{touchX=e.touches[0].clientX; touchY=e.touches[0].clientY;});
canvas.addEventListener('touchmove', e=>{ e.preventDefault(); touchX=e.touches[0].clientX; touchY=e.touches[0].clientY; });
canvas.addEventListener('touchend', e=>{ touchX=null; touchY=null; });

// ----- BUTTONS -----
document.getElementById('splitBtn').addEventListener('touchstart',()=>world.player.split());
document.getElementById('shootBtn').addEventListener('touchstart',()=>world.player.cells.forEach(c=>ejectMass(c)));

// ----- EJECT -----
function ejectMass(cell,dx=null,dy=null){
  let angle=Math.random()*Math.PI*2;
  if(dx!==null && dy!==null) angle=Math.atan2(dy,dx);
  const speed=5;
  const vx=Math.cos(angle)*speed;
  const vy=Math.sin(angle)*speed;
  world.ejected.push(new Ejected(cell.x+vx*2,cell.y+vy*2,5,"#0f0",vx,vy));
  cell.radius=Math.max(10,cell.radius-5);
}

// ----- RESIZE -----
window.addEventListener('resize',()=>{canvas.width=window.innerWidth; canvas.height=window.innerHeight;});

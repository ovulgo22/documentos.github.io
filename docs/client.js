const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let touchX=null, touchY=null;

const world = {
  width:3000,
  height:3000,
  pellets:[],
  ejected:[],
  player:null,
  bots:[]
};

// ----- CLASSES -----
class Cell{
  constructor(x,y,radius,color,name="Player"){this.x=x;this.y=y;this.radius=radius;this.color=color;this.name=name;this.speed=3;}
  draw(){ctx.beginPath();ctx.fillStyle=this.color;ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='white';ctx.font=`${Math.max(12,this.radius/2)}px Arial`;ctx.textAlign='center';ctx.fillText(this.name,this.x,this.y+4);}
  move(dx,dy){const len=Math.hypot(dx,dy);if(len>0){dx/=len;dy/=len;this.x+=dx*this.speed*(50/this.radius);this.y+=dy*this.speed*(50/this.radius);}
    this.x=Math.max(this.radius,Math.min(world.width-this.radius,this.x));
    this.y=Math.max(this.radius,Math.min(world.height-this.radius,this.y));}
  eat(target){const dist=Math.hypot(this.x-target.x,this.y-target.y);if(dist<this.radius+target.radius){this.radius+=target.radius*0.2;return true;}return false;}
}

class Pellet{constructor(x,y,radius,color="#ff0"){this.x=x;this.y=y;this.radius=radius;this.color=color;}draw(){ctx.beginPath();ctx.fillStyle=this.color;ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);ctx.fill();}}

class Ejected{constructor(x,y,radius,color="#0f0",dx,dy){this.x=x;this.y=y;this.radius=radius;this.color=color;this.dx=dx;this.dy=dy;}draw(){ctx.beginPath();ctx.fillStyle=this.color;ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);ctx.fill();}move(){this.x+=this.dx;this.y+=this.dy;this.dx*=0.95;this.dy*=0.95;}}

class Bot extends Cell{
  constructor(x,y,radius,color,name="Bot"){super(x,y,radius,color,name);}
  ai(){
    if(world.pellets.length>0){
      let target=world.pellets.reduce((a,b)=>Math.hypot(this.x-a.x,this.y-a.y)<Math.hypot(this.x-b.x,this.y-b.y)?a:b);
      let dx=target.x-this.x, dy=target.y-this.y;
      const dist=Math.hypot(dx,dy); dx/=dist; dy/=dist; this.x+=dx*this.speed*(50/this.radius); this.y+=dy*this.speed*(50/this.radius);
    }
  }
}

// ----- INIT -----
function init(){
  world.player=new Cell(world.width/2,world.height/2,30,"#00f","Você");
  for(let i=0;i<500;i++) world.pellets.push(new Pellet(Math.random()*world.width,Math.random()*world.height,5));
  for(let i=0;i<5;i++) world.bots.push(new Bot(Math.random()*world.width,Math.random()*world.height,20,"#f00","Bot"+(i+1)));
}

// ----- UPDATE -----
function update(){
  // Player move
  let dx=0,dy=0;if(touchX!==null && touchY!==null){dx=touchX-canvas.width/2; dy=touchY-canvas.height/2;}
  world.player.move(dx,dy);

  // Bots
  world.bots.forEach(bot=>bot.ai());

  // Eat pellets
  world.pellets=world.pellets.filter(p=>![world.player,...world.bots].some(c=>c.eat(p)));

  // Eat ejected
  world.ejected.forEach(e=>{[world.player,...world.bots].forEach(c=>{if(c.eat(e)){e.radius=0;}}); e.move();});
  world.ejected=world.ejected.filter(e=>e.radius>0);

  // Bots vs Player
  [...world.bots,world.player].forEach(c1=>{
    [...world.bots,world.player].forEach(c2=>{
      if(c1!==c2 && c1.radius>c2.radius*1.1){
        const dist=Math.hypot(c1.x-c2.x,c1.y-c2.y);
        if(dist<c1.radius){c1.radius+=c2.radius*0.9;c2.radius=0;}
      }
    });
  });

  world.bots=world.bots.filter(b=>b.radius>0);
}

// ----- DRAW -----
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const camX=world.player.x-canvas.width/2;
  const camY=world.player.y-canvas.height/2;

  world.pellets.forEach(p=>{ctx.save();ctx.translate(-camX,-camY);p.draw();ctx.restore();});
  world.ejected.forEach(e=>{ctx.save();ctx.translate(-camX,-camY);e.draw();ctx.restore();});
  [world.player,...world.bots].forEach(c=>{ctx.save();ctx.translate(-camX,-camY);c.draw();ctx.restore();});

  // Leaderboard
  const leaders=document.getElementById('leaders');leaders.innerHTML='';
  [world.player,...world.bots].sort((a,b)=>b.radius-a.radius).slice(0,5).forEach(c=>{
    let li=document.createElement('li');li.textContent=`${c.name} (${Math.round(c.radius)})`;leaders.appendChild(li);
  });
}

// ----- GAME LOOP -----
function loop(){update();draw();requestAnimationFrame(loop);}
init(); loop();

// ----- TOUCH -----
canvas.addEventListener('touchstart',e=>{touchX=e.touches[0].clientX;touchY=e.touches[0].clientY;});
canvas.addEventListener('touchmove',e=>{e.preventDefault();touchX=e.touches[0].clientX;touchY=e.touches[0].clientY;});
canvas.addEventListener('touchend',e=>{touchX=null;touchY=null;});

// ----- BUTTONS -----
document.getElementById('splitBtn').addEventListener('touchstart',()=>{splitCell(world.player);});
document.getElementById('shootBtn').addEventListener('touchstart',()=>{ejectMass(world.player);});

// ----- SPLIT & EJECT -----
function splitCell(cell){if(cell.radius<20) return; const r=cell.radius/2; cell.radius=r;
  const angle=Math.random()*Math.PI*2;
  const newCell=new Cell(cell.x+Math.cos(angle)*r*2,cell.y+Math.sin(angle)*r*2,r,cell.color,cell.name);
  world.bots.push(newCell); // Pode adicionar aos bots para simular nova célula
}

function ejectMass(cell){const angle=Math.random()*Math.PI*2; const dx=Math.cos(angle)*5; const dy=Math.sin(angle)*5;
  world.ejected.push(new Ejected(cell.x+dx*2,cell.y+dy*2,5,"#0f0",dx,dy));
  cell.radius=Math.max(10,cell.radius-5);
}

// ----- RESIZE -----
window.addEventListener('resize',()=>{canvas.width=window.innerWidth; canvas.height=window.innerHeight;});

const canvas = document.getElementById('spaceCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
for(let i=0;i<300;i++){
    stars.push({x:Math.random()*canvas.width, y:Math.random()*canvas.height, r:Math.random()*1.5, dx:(Math.random()-0.5)/2, dy:(Math.random()-0.5)/2});
}

let meteors = [];

function spawnMeteor(){
    meteors.push({
        x: Math.random()*canvas.width,
        y: -20,
        dx: (Math.random()-0.5)*2,
        dy: Math.random()*3+2,
        r: Math.random()*3+2
    });
}

// A cada 3 segundos chance de meteoros
setInterval(()=>{
    if(Math.random()<0.7) spawnMeteor();
},3000);

function animateSpace(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // estrelas
    stars.forEach(s=>{
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
        ctx.fillStyle = 'white';
        ctx.fill();
        s.x += s.dx;
        s.y += s.dy;
        if(s.x<0)s.x=canvas.width;
        if(s.x>canvas.width)s.x=0;
        if(s.y<0)s.y=canvas.height;
        if(s.y>canvas.height)s.y=0;
    });

    // meteoros
    meteors.forEach((m,i)=>{
        ctx.beginPath();
        ctx.arc(m.x,m.y,m.r,0,Math.PI*2);
        ctx.fillStyle='orange';
        ctx.fill();
        m.x += m.dx;
        m.y += m.dy;
        if(m.y>canvas.height) meteors.splice(i,1);
    });

    requestAnimationFrame(animateSpace);
}

animateSpace();
window.addEventListener('resize',()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

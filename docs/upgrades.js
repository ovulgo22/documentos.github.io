let autoClickers = 0;
const orbitalContainer = document.getElementById('orbitalUpgrades');

const upgrades = [
    {id:'upgrade1', name:'x2', cost:100, effect:()=>multiplier*=2, angle:0, radius:80},
    {id:'autoClick1', name:'AC I', cost:500, effect:()=>autoClickers++, angle:90, radius:120},
    {id:'upgrade2', name:'x5', cost:1000, effect:()=>multiplier*=5, angle:180, radius:160},
    {id:'autoClick2', name:'AC II', cost:5000, effect:()=>autoClickers+=5, angle:270, radius:200}
];

function renderOrbitalUpgrades(){
    orbitalContainer.innerHTML='';
    upgrades.forEach(u=>{
        const btn = document.createElement('button');
        btn.className='upgrade-btn';
        btn.innerText=`${u.name} (${u.cost})`;
        orbitalContainer.appendChild(btn);

        let centerX = clickButton.offsetLeft + clickButton.offsetWidth/2;
        let centerY = clickButton.offsetTop + clickButton.offsetHeight/2;

        function updatePosition(){
            const rad = u.angle * Math.PI/180;
            btn.style.position='absolute';
            btn.style.left = `${centerX + u.radius*Math.cos(rad) - btn.offsetWidth/2}px`;
            btn.style.top = `${centerY + u.radius*Math.sin(rad) - btn.offsetHeight/2}px`;
            u.angle+=0.5; // velocidade de rotação
            requestAnimationFrame(updatePosition);
        }
        updatePosition();

        btn.addEventListener('click',()=>{
            if(points>=u.cost){
                points-=u.cost;
                u.effect();
                updatePoints();
                btn.style.background='#00ffcc';
                setTimeout(()=>btn.style.background='#ff7f50',500);
            } else alert('Energia insuficiente!');
        });
    });
}

renderOrbitalUpgrades();

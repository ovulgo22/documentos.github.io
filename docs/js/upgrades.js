
let autoClickers = 0;
const orbitalContainer = document.getElementById('orbitalUpgrades');
const upgrades = [
{id:'upgrade1',name:'x2',cost:100,effect:()=>multiplier*=2},
{id:'autoClick1',name:'AC I',cost:500,effect:()=>autoClickers++}
];
upgrades.forEach(u=>{
    const btn = document.createElement('button');
    btn.innerText=`${u.name} (${u.cost})`;
    orbitalContainer.appendChild(btn);
    btn.addEventListener('click', ()=>{
        if(points>=u.cost){points-=u.cost; u.effect(); pointsDisplay.innerText='Energia Cósmica: '+points;}
    });
});

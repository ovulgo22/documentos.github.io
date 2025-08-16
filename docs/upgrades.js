let autoClickers = 0;

const upgrades = [
    {id:'upgrade1', name:'Multiplicador x2', cost:100, effect:()=>multiplier*=2},
    {id:'autoClick1', name:'AutoClicker I', cost:500, effect:()=>autoClickers++},
    {id:'upgrade2', name:'Multiplicador x5', cost:1000, effect:()=>multiplier*=5},
    {id:'autoClick2', name:'AutoClicker II', cost:5000, effect:()=>autoClickers+=5},
    {id:'upgrade3', name:'Multiplicador x10', cost:20000, effect:()=>multiplier*=10}
];

function renderUpgrades(){
    const container = document.getElementById('upgradeList');
    upgrades.forEach(u=>{
        const btn = document.createElement('button');
        btn.className='upgrade-btn';
        btn.id=u.id;
        btn.innerText = `${u.name} (${u.cost})`;
        btn.addEventListener('click',()=>{
            if(points >= u.cost){
                points -= u.cost;
                u.effect();
                updatePoints();
                alert(`${u.name} comprado!`);
            } else alert('Energia insuficiente!');
        });
        container.appendChild(btn);
    });
}

renderUpgrades();

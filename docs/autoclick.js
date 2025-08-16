let activeBoosts = [];

const boostsList = [
    {id:'boost1', name:'Boost x2 (30s)', duration:30000, multiplier:2},
    {id:'boost2', name:'Boost x5 (15s)', duration:15000, multiplier:5}
];

function renderBoosts(){
    const container = document.getElementById('boosts');
    boostsList.forEach(b=>{
        const btn = document.createElement('button');
        btn.className='boost-btn';
        btn.id=b.id;
        btn.innerText = b.name;
        btn.addEventListener('click', ()=>activateBoost(b));
        container.appendChild(btn);
    });
}

function activateBoost(boost){
    if(activeBoosts.includes(boost.id)) return;
    activeBoosts.push(boost.id);
    multiplier *= boost.multiplier;
    const boostSound = document.getElementById('boostSound');
    boostSound.play();
    setTimeout(()=>{
        multiplier /= boost.multiplier;
        activeBoosts = activeBoosts.filter(b=>b!==boost.id);
    }, boost.duration);
}

setInterval(()=>{
    if(autoClickers>0){
        points += autoClickers*multiplier;
        updatePoints();
    }
},1000);

renderBoosts();

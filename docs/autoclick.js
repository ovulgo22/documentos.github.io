let activeBoosts = [];
const boostsList = [
    {id:'boost1', name:'x2 (30s)', duration:30000, multiplier:2},
    {id:'boost2', name:'x5 (15s)', duration:15000, multiplier:5},
    {id:'boost3', name:'x10 (10s)', duration:10000, multiplier:10}
];

const boostContainer = document.getElementById('boosts');

function renderBoosts(){
    boostContainer.innerHTML='';
    boostsList.forEach(b=>{
        const btn = document.createElement('button');
        btn.className='boost-btn';
        btn.innerText=b.name;
        btn.addEventListener('click',()=>activateBoost(b,btn));
        boostContainer.appendChild(btn);
    });
}

function activateBoost(boost,btn){
    if(activeBoosts.includes(boost.id)) return;
    activeBoosts.push(boost.id);
    multiplier *= boost.multiplier;
    btn.style.boxShadow='0 0 50px #0ff, 0 0 100px #0ff';
    const boostSound = document.getElementById('boostSound');
    boostSound.play();
    setTimeout(()=>{
        multiplier /= boost.multiplier;
        activeBoosts = activeBoosts.filter(id=>id!==boost.id);
        btn.style.boxShadow='0 0 10px #ff7f50';
    },boost.duration);
}

// AutoClickers
setInterval(()=>{
    if(autoClickers>0){
        points += autoClickers*multiplier;
        updatePoints();
    }
},1000);

renderBoosts();

let points = 0;
let multiplier = 1;

const clickButton = document.getElementById('clickButton');
const pointsDisplay = document.getElementById('points');
const coinSound = document.getElementById('coinSound');

clickButton.addEventListener('click', (e)=>{
    points += multiplier;
    updatePoints();
    spawnCoin(e.clientX - 15, e.clientY - 15);
    spawnParticles(e.clientX, e.clientY, 5);
});

function updatePoints(){
    pointsDisplay.innerText = `Energia Cósmica: ${points}`;
    localStorage.setItem('points', points);
}

function spawnCoin(x, y){
    const coin = document.createElement('div');
    coin.className = 'coin';
    coin.style.left = `${x}px`;
    coin.style.top = `${y}px`;
    document.body.appendChild(coin);
    coinSound.play();
    setTimeout(()=>coin.remove(),1000);
}

function spawnParticles(x, y, amount){
    for(let i=0;i<amount;i++){
        const p = document.createElement('div');
        p.className='particle';
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.style.setProperty('--randX', Math.random());
        p.style.setProperty('--randY', Math.random());
        document.body.appendChild(p);
        setTimeout(()=>p.remove(),800);
    }
}

// Carregar progresso
if(localStorage.getItem('points')){
    points = parseInt(localStorage.getItem('points'));
    updatePoints();
}

// Variáveis principais
let points = 0;
let multiplier = 1;
let autoClickers = 0;
let achievements = [];
let eventsActive = false;

// Configuração dos upgrades
const upgrades = [
  {id:'upgrade1', name:'Multiplicador x2', cost:100, effect:()=>multiplier*=2},
  {id:'autoClick', name:'AutoClicker', cost:500, effect:()=>autoClickers++},
  {id:'upgrade2', name:'Multiplicador x5', cost:1000, effect:()=>multiplier*=5},
  {id:'autoClick2', name:'Super AutoClicker', cost:5000, effect:()=>autoClickers+=5}
];

// Sons
const coinSound = document.getElementById('coinSound');

// Funções principais
function updatePoints() {
  document.getElementById('points').innerText = `Moedas: ${points}`;
  localStorage.setItem('clickerPoints', points);
  localStorage.setItem('clickerMultiplier', multiplier);
  localStorage.setItem('clickerAuto', autoClickers);
  localStorage.setItem('clickerAchievements', JSON.stringify(achievements));
}

function spawnCoin(x,y){
  const coin = document.createElement('div');
  coin.className='coin';
  coin.style.left=`${x}px`;
  coin.style.top=`${y}px`;
  document.body.appendChild(coin);
  setTimeout(()=>coin.remove(),1000);
  coinSound.play();
}

function checkAchievements(){
  const milestones=[
    {points:100,text:'100 moedas!'},
    {points:500,text:'500 moedas!'},
    {points:1000,text:'1000 moedas!'},
    {points:5000,text:'5k moedas!'}
  ];
  milestones.forEach(m=>{
    if(points>=m.points && !achievements.includes(m.text)){
      achievements.push(m.text);
      alert(`Conquista desbloqueada: ${m.text}`);
      renderAchievements();
    }
  });
}

function renderAchievements(){
  const list=document.getElementById('achievementsList');
  list.innerHTML='';
  achievements.forEach(a=>{
    const li=document.createElement('li');
    li.textContent=a;
    list.appendChild(li);
  });
}

function renderUpgrades(){
  const container=document.getElementById('upgradeList');
  upgrades.forEach(u=>{
    const btn=document.createElement('button');
    btn.className='upgrade-btn';
    btn.id=u.id;
    btn.innerText=`${u.name} (${u.cost} moedas)`;
    btn.addEventListener('click',()=>{
      if(points>=u.cost){
        points-=u.cost;
        u.effect();
        updatePoints();
        alert(`${u.name} comprado!`);
      } else alert('Moedas insuficientes!');
    });
    container.appendChild(btn);
  });
}

// Clique manual
document.getElementById('clickButton').addEventListener('click',(e)=>{
  points+=multiplier;
  spawnCoin(e.clientX-15,e.clientY-15);
  updatePoints();
  checkAchievements();
});

// AutoClicker
setInterval(()=>{
  if(autoClickers>0){
    points+=autoClickers*multiplier;
    updatePoints();
    checkAchievements();
  }
},1000);

// Eventos aleatórios
function triggerEvent(){
  if(eventsActive) return;
  eventsActive=true;
  const eventMsg=document.getElementById('eventMessage');
  const bonus=Math.floor(Math.random()*100)+50;
  eventMsg.innerText=`Evento especial! +${bonus} moedas!`;
  points+=bonus;
  updatePoints();
  setTimeout(()=>{
    eventMsg.innerText='Nenhum evento ativo';
    eventsActive=false;
  },5000);
}
setInterval(()=>{ if(Math.random()<0.05) triggerEvent(); },5000);

// Carregar progresso
if(localStorage.getItem('clickerPoints')){
  points=parseInt(localStorage.getItem('clickerPoints'));
  multiplier=parseInt(localStorage.getItem('clickerMultiplier'));
  autoClickers=parseInt(localStorage.getItem('clickerAuto'));
  achievements=JSON.parse(localStorage.getItem('clickerAchievements'))||[];
  updatePoints();
  renderAchievements();
}

// Inicializar upgrades
renderUpgrades();

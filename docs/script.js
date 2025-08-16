let points = 0;
let multiplier = 1;
let autoClicker = 0;
let achievements = [];

// Salvar e carregar progresso
if(localStorage.getItem('clickerPoints')) {
  points = parseInt(localStorage.getItem('clickerPoints'));
  multiplier = parseInt(localStorage.getItem('clickerMultiplier'));
  autoClicker = parseInt(localStorage.getItem('clickerAuto'));
  achievements = JSON.parse(localStorage.getItem('clickerAchievements')) || [];
  updatePoints();
  renderAchievements();
}

// Atualizar display de pontos
function updatePoints() {
  document.getElementById('points').innerText = `Moedas: ${points}`;
  localStorage.setItem('clickerPoints', points);
  localStorage.setItem('clickerMultiplier', multiplier);
  localStorage.setItem('clickerAuto', autoClicker);
}

// Criar animação de moedas
function spawnCoin(x, y) {
  const coin = document.createElement('div');
  coin.className = 'coin';
  coin.style.left = x + 'px';
  coin.style.top = y + 'px';
  document.body.appendChild(coin);
  setTimeout(() => coin.remove(), 1000);
}

// Sistema de conquistas
function checkAchievements() {
  const milestones = [
    {points: 100, text: "100 moedas!"},
    {points: 500, text: "500 moedas!"},
    {points: 1000, text: "1000 moedas!"}
  ];

  milestones.forEach(m => {
    if(points >= m.points && !achievements.includes(m.text)) {
      achievements.push(m.text);
      alert(`Conquista desbloqueada: ${m.text}`);
      renderAchievements();
      saveAchievements();
    }
  });
}

function renderAchievements() {
  const list = document.getElementById('achievementsList');
  list.innerHTML = '';
  achievements.forEach(a => {
    const li = document.createElement('li');
    li.textContent = a;
    list.appendChild(li);
  });
}

function saveAchievements() {
  localStorage.setItem('clickerAchievements', JSON.stringify(achievements));
}

// Clique manual
document.getElementById('clickButton').addEventListener('click', (e) => {
  points += multiplier;
  spawnCoin(e.clientX - 15, e.clientY - 15);
  updatePoints();
  checkAchievements();
});

// Upgrade x2
document.getElementById('upgrade1').addEventListener('click', () => {
  if(points >= 100) {
    points -= 100;
    multiplier *= 2;
    updatePoints();
    alert('Multiplicador x2 adquirido!');
  } else {
    alert('Moedas insuficientes!');
  }
});

// AutoClicker
document.getElementById('autoClick').addEventListener('click', () => {
  if(points >= 500) {
    points -= 500;
    autoClicker++;
    updatePoints();
    alert('AutoClicker comprado!');
  } else {
    alert('Moedas insuficientes!');
  }
});

// AutoClicker loop
setInterval(() => {
  if(autoClicker > 0) {
    points += autoClicker * multiplier;
    updatePoints();
    checkAchievements();
  }
}, 1000);

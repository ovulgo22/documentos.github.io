let prestigeCount = 0;
const prestigeBtn = document.getElementById('prestigeBtn');

prestigeBtn.addEventListener('click', ()=>{
    if(points >= 10000){
        prestigeCount++;
        points=0;
        multiplier=1;
        autoClickers=0;
        achievements=[];
        alert('✨ Prestígio Cósmico concedido! Multiplicadores permanentes aplicados.');
        updatePoints();
        renderAchievements();
    } else {
        alert('Você precisa de 10.000 energia para Prestígio Cósmico!');
    }
});

// Carregar prestígio do localStorage
if(localStorage.getItem('prestigeCount')){
    prestigeCount = parseInt(localStorage.getItem('prestigeCount'));
}

let prestigeCount = 0;
const prestigeBtn = document.getElementById('prestigeBtn');

prestigeBtn.addEventListener('click', ()=>{
    if(points >= 10000){
        prestigeCount++;
        points=0;
        multiplier=1 + prestigeCount*0.5; // bônus permanente
        autoClickers=0;
        achievements=[];
        renderAchievements();
        alert(`✨ Prestígio Cósmico concedido! Multiplicador permanente: x${(1+prestigeCount*0.5).toFixed(1)}`);
        spawnParticles(clickButton.offsetLeft+100,clickButton.offsetTop+100,50);
        updatePoints();
        const prestigeSound = new Audio('https://www.soundjay.com/button/sounds/button-09.mp3');
        prestigeSound.play();
    } else {
        alert('Você precisa de 10.000 energia para Prestígio Cósmico!');
    }
});

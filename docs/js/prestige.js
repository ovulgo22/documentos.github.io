
const prestigeBtn = document.getElementById('prestigeBtn');
let prestigeCount = 0;
prestigeBtn.addEventListener('click', ()=>{
    if(points>=10000){prestigeCount++; points=0; multiplier=1+prestigeCount*0.5; autoClickers=0; achievementsList.innerHTML=''; pointsDisplay.innerText='Energia Cósmica: 0'; alert('Prestígio concedido! x'+multiplier);}
    else alert('Precisa de 10.000 energia para prestígio!');
});

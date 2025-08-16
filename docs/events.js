let eventsActive = false;

function triggerEvent(){
    if(eventsActive) return;
    eventsActive = true;
    const eventMsg = document.getElementById('eventMessage');
    const bonus = Math.floor(Math.random()*500)+100;
    eventMsg.innerText = `☄️ Evento Espacial! +${bonus} energia!`;

    points += bonus;
    updatePoints();

    const eventSound = document.getElementById('eventSound');
    eventSound.play();

    // Criar meteoros clicáveis
    let clicksRequired = 5;
    const meteorListener = (e)=>{
        clicksRequired--;
        spawnParticles(e.clientX,e.clientY,10);
        if(clicksRequired<=0){
            points += bonus;
            updatePoints();
            alert('Mini-jogo completado! Bônus duplicado!');
            document.removeEventListener('click', meteorListener);
        }
    };

    document.addEventListener('click', meteorListener);

    setTimeout(()=>{
        eventMsg.innerText='Nenhum evento ativo';
        eventsActive=false;
        document.removeEventListener('click', meteorListener);
    },10000);
}

// Probabilidade de 5% a cada 5 segundos
setInterval(()=>{
    if(Math.random()<0.05) triggerEvent();
},5000);

let eventsActive = false;

function triggerEvent(){
    if(eventsActive) return;
    eventsActive = true;
    const eventMsg = document.getElementById('eventMessage');
    const bonus = Math.floor(Math.random()*300)+50;
    eventMsg.innerText = `✨ Evento Espacial! +${bonus} energia!`;
    points += bonus;
    updatePoints();
    const eventSound = document.getElementById('eventSound');
    eventSound.play();
    setTimeout(()=>{
        eventMsg.innerText='Nenhum evento ativo';
        eventsActive=false;
    },5000);
}

// 5% de chance a cada 5s
setInterval(()=>{
    if(Math.random()<0.05) triggerEvent();
},5000);

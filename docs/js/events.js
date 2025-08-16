
setInterval(()=>{
    if(Math.random()<0.05){
        const bonus = Math.floor(Math.random()*500)+100;
        points+=bonus;
        pointsDisplay.innerText='Energia Cósmica: '+points;
        alert('Evento Espacial! +'+bonus+' energia!');
    }
},5000);


const achievementsList = document.getElementById('achievementsList');
const milestones = [100,500,1000,5000];
setInterval(()=>{
    milestones.forEach(m=>{if(points>=m && !achievementsList.innerText.includes(m)){const li=document.createElement('li'); li.innerText='Conquista '+m; achievementsList.appendChild(li);}});
},1000);

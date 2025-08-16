let achievements = [];

const milestones = [
    {points:100, text:'100 Energia Cósmica!'},
    {points:500, text:'500 Energia Cósmica!'},
    {points:1000, text:'1000 Energia Cósmica!'},
    {points:5000, text:'5k Energia Cósmica!'},
    {points:20000, text:'20k Energia Cósmica!'}
];

function checkAchievements(){
    milestones.forEach(m=>{
        if(points>=m.points && !achievements.includes(m.text)){
            achievements.push(m.text);
            alert(`🏆 Conquista desbloqueada: ${m.text}`);
            spawnParticles(clickButton.offsetLeft+100,clickButton.offsetTop+100,20);
            renderAchievements();
        }
    });
}

function renderAchievements(){
    const list = document.getElementById('achievementsList');
    list.innerHTML = '';
    achievements.forEach(a=>{
        const li = document.createElement('li');
        li.textContent = a;
        list.appendChild(li);
    });
}

setInterval(checkAchievements,1000);

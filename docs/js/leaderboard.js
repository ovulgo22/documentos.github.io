
const leaderboardContainer = document.getElementById('leaderboardContainer');
let leaderboard = [];
function generateFakePlayers(){
    const names=['StarPilot','NebulaX','CosmicNova','GalaxyRider','MeteorKing'];
    leaderboard = [];
    for(let i=0;i<10;i++){
        leaderboard.push({name:names[Math.floor(Math.random()*names.length)]+Math.floor(Math.random()*100),score:Math.floor(Math.random()*10000)});
    }
    leaderboard.sort((a,b)=>b.score-a.score);
}
function showLeaderboard(){
    leaderboardContainer.style.display='block';
    leaderboardContainer.innerHTML='<h3>Leaderboard</h3>';
    leaderboard.forEach((p,i)=>{
        const div=document.createElement('div');
        div.innerText=`${i+1}. ${p.name}: ${p.score}`;
        leaderboardContainer.appendChild(div);
    });
}
generateFakePlayers();

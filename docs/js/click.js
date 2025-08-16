
let points = 0;
let multiplier = 1;
const clickButton = document.getElementById('clickButton');
const pointsDisplay = document.getElementById('points');
clickButton.addEventListener('click', (e)=>{
    points += multiplier;
    pointsDisplay.innerText = 'Energia Cósmica: '+points;
});

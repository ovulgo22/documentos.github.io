// Todos os efeitos de som já carregados no index.html
// click.js → coinSound
// autoclick.js → boostSound
// events.js → eventSound

// Aqui você poderia adicionar sons extras, como:
// Prestígio
const prestigeSound = new Audio('https://www.soundjay.com/button/sounds/button-09.mp3');
prestigeBtn.addEventListener('click', ()=>prestigeSound.play());

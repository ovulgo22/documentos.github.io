
let equippedItem = null;
const equippedDisplay = document.getElementById('equippedItem');
const items = [
{name:'Comet Button',type:'button',rarity:'Raro',multiplierBonus:2,color:'#00ffcc'},
{name:'Star Button',type:'button',rarity:'Épico',multiplierBonus:3,color:'#ff00ff'}
];
function equipItem(item){
    equippedItem=item;
    multiplier = 1+item.multiplierBonus;
    equippedDisplay.innerText='Item Equipado: '+item.name+' ('+item.rarity+')';
}

var onWin = function () {
    console.log('Yay!');
    text.innerHTML = '<b>Click or press \'r\' to go to the next level.</b>';
    currentMap ++;
    if (currentMap > maps.length) {
	text.innerHTML = "<b>You're done! Congrats!</b>";
	currentMap --;
    }
};
var onDie = function() {
    console.log('Boo.');
    text.innerHTML = '<b>Click to restart.</b>';
};

var onReset = function() {
    text.innerHTML = '&nbsp;';
    level.innerHTML = "<h2>Layzors Level: " + currentMap + "</h2>";
};

var text = document.getElementById('text');
var level = document.getElementById('level');
var currentMap = 2;

var game = new Editor();
window.addEventListener('keydown', function (e) { game.handleKeyPress(e);}, false);
var map = new Map();
map.loadFromJsonData(maps[currentMap-1]);
console.log(map);

game.setOnWin(onWin);
game.setOnDie(onDie);
game.setOnReset(onReset);
game.loadMap(map);
game.start();
console.log("What are you doing looking at the console? Your actions have been logged, and we know where you live. Back to the game with you!");
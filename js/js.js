var onFinish = function (won) {
    if (won) {
        console.log('Yay!');
        //text.innerHTML = '<b>Click or press \'r\' to go to the next level.</b>';
        text.innerHTML = '<a href="../' + nextMap + '">Click or press \'f\' to go to the next level (' + nextMap + ').</a>';
        gameWon = true;
        //currentMap ++;
        if (currentMap > maps.length) {
            //text.innerHTML = "<b>You're done! Congrats!</b>";
            //currentMap --;
        }
    } else {
        console.log('Boo.');
        text.innerHTML = '<b>Click to restart.</b>';
    }
};

var helpFunc = function(helpText) {
    var help = document.getElementById("help");
    help.innerHTML = helpText;
    help.style.display = "block";
}

var start = function() {
    game.init(maps[currentMap-1], onFinish, helpFunc);
    gameWon = false;
    text.innerHTML = '&nbsp;';
    level.innerHTML = "<h2>Layzors Level: " + currentMap + "</h2>";
};
var text = document.getElementById('text');
var level = document.getElementById('level');
//var currentMap = 1;
window.addEventListener('keydown', makeOnKeyPress(game), false);
var gameWon = false;
start();
console.log("What are you doing looking at the console? Your actions have been logged, and we know where you live. Back to the game with you!");
var Game = function() {
    this.active = false;

    this.canvas = document.getElementById("canvas");

    this.field = new Field();
    this.mapView = new MapView();

    this.onReset = function() {};
    this.onDieFunc = function() {};
    this.onWinFunc = function() {};
};

Game.prototype.loadMap = function(map) {
    this.initialMap = map.clone();
    this.map = map;
    this.field.loadMap(map);
    this.mapView.initCanvas(this.canvas);
    this.mapView.init(map);
}

Game.prototype.resetGame = function() {
    this.active = true;
    this.loadMap(this.initialMap);
};

Game.prototype.setOnReset = function(onReset) {
    this.onReset = onReset;
};

Game.prototype.setOnWin = function(onWin) {
    this.onWinFunc = onWin;
};

Game.prototype.setOnDie = function(onDie) {
    this.onDieFunc = onDie;
};

Game.prototype.onWin = function() {
    this.onWinFunc();
};

Game.prototype.onDie = function() {
    this.active = false;
    this.onDieFunc();
};

Game.prototype.gotoNextLevel = function() {
    window.location = "../" + nextMap;
};

Game.prototype.onResetGameButton = function() {
    this.resetGame();
    this.updateDisplay();
};

Game.prototype.onNextLevelButton = function() {
    if (this.field.gameWon()) {
	alert ("not sure what next level means");
	this.gotoNextLevel();
    }
    this.updateDisplay();
};

Game.prototype.onDirectionButton = function(direction) {
    if (this.active) {
	this.field.attemptPlayerMove(direction);
    }
    this.updateDisplay();
};

// Redirect on a key-by-key basis
Game.prototype.handleKeyPress = function(e) {
    var key = e.keyCode;
    switch(key) {
    case 82: // r
	this.onResetGameButton();
	break;
    case 70: // f
	this.onNextLevelButton();
	break;
    case 37: // left
    case 65: // a
	this.onDirectionButton(DIRECTION.LEFT);
	break;
    case 38: // up
    case 87: // w
	this.onDirectionButton(DIRECTION.UP);
	break;
    case 39: // right
    case 68: // d
	this.onDirectionButton(DIRECTION.RIGHT);
	break;
    case 40: // left
    case 83: // s
	this.onDirectionButton(DIRECTION.DOWN);
	break;
    }
};

Game.prototype.updateDisplay = function() {
    this.mapView.draw();
    if (this.field.gameWon()) {
	this.onWin();
    } else if (this.field.isPlayerDead()) {
	this.onDie();
    }
};

Game.prototype.start = function() {
    this.active = true;
    this.updateDisplay();
};

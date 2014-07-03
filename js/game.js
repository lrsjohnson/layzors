var Game = function() {
    this.active = false;

    this.canvas = document.getElementById("canvas");

    this.field = new Field();
    this.fieldView = new FieldView();
};

Game.prototype.loadMap = function(map) {
    this.map = map;
    this.field.loadMap(map);
    this.fieldView.init(this.field, this.canvas);
}

Game.prototype.resetGame = function() {
    this.field.loadMap(this.map);
};

Game.prototype.setOnReset = function(onReset) {
    this.onReset = onReset;
};

Game.prototype.setOnWin = function(onWin) {
    this.onWin = onWin;
};

Game.prototype.setOnDie = function(onDie) {
    this.onDie = onDie;
};

Game.prototype.gotoNextLevel = function() {
    window.location = "../" + nextMap;
};

Game.prototype.onResetGameButton = function() {
    this.resetGame();
};

Game.prototype.onNextLevelButton = function() {
    if (this.field.gameWon()) {
	this.gotoNextLevel();
    }
};

Game.prototype.onLeftButton = function(e) {
    if (this.active) {
	this.field.attemptPlayerMove(DIRECTION.LEFT);
    }
};

Game.prototype.onRightButton = function(e) {
    if (this.active) {
	this.field.attemptPlayerMove(DIRECTION.RIGHT);
    }
};

Game.prototype.onUpButton = function(e) {
    if (this.active) {
	this.field.attemptPlayerMove(DIRECTION.UP);
    }
};

Game.prototype.onDownButton = function(e) {
    if (this.active) {
	this.field.attemptPlayerMove(DIRECTION.DOWN);
    }
};

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
	this.onLeftButton();
	break;
    case 38: // up
    case 87: // w
	this.onUpButton();
	break;
    case 39: // right
    case 68: // d
	this.onRightButton();
	break;
    case 40: // left
    case 83: // s
	this.onDownButton();
	break;
    }
    this.updateDisplay();
};

Game.prototype.updateDisplay = function() {
    this.fieldView.draw();
    if (this.field.gameWon()) {
	this.active = false;
	this.onWin();
    } else if (this.field.isPlayerDead()) {
	this.active = false;
	this.onDie();
    }
};

Game.prototype.start = function() {
    this.active = true;
    this.updateDisplay();
};

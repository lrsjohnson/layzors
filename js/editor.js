// Inherits from Game
var Editor = function() {
    Game.call(this);
    this.currentTool = undefined;
};
Editor.prototype = Object.create(Game.prototype);
Editor.prototype.constructor = Game;

// Redirect on a key-by-key basis.
Editor.prototype.handleKeyPress = function(e) {
    var key = e.keyCode;
    console.log(key);
    switch(key) {
    case 32: // space
	break;
    default:
	return Game.prototype.handleKeyPress.call(this, e);
    }
};



/* The Field manages the dynamic state of the game field and handles
 * the logic to move various elements on the field and determines when
 * state (laser path, door, etc.) needs to be updated.
 *
 * A Field is given a map object which stores the configuration of
 * objects on the field.
 *
 * The FieldView object is used to draw the current state of a field.
 */
var Field = function() {
};

Field.prototype.loadMap = function(map) {
    this.map = map;
    this.refreshState();
};

/* Can be called to refresh the dynamic state given the current map */
Field.prototype.refreshState = function() {
    this.runLaserUpdate();
};

Field.prototype.isCellEmpty = function(pos) {
    return this.map.itemAt(pos).isEmpty();
};

Field.prototype.isButtonPushed = function(button) {
    var buttonPos = button;
    return (equal_position(buttonPos, this.map.player.pos) || ! this.isCellEmpty(buttonPos));
};

// After all items on the board are in their new places, this will
// determine if the laser is on and update any attributes that
// result from the laser's path.
Field.prototype.runLaserUpdate = function() {

    // buttonNotPushed is a button that isn't pushed or undefined
    var allButtonsPushed = _.all(this.map.buttons, _.bind(this.isButtonPushed, this));
    var isLaserOn = allButtonsPushed;

    var laserPath = []
    var laserReachedTarget = false;
    if (isLaserOn) {
	var laserComputationResults = simulate_laser(this.map.laserSource, this.map.laserTarget);
	laserPath = laserComputationResults.laserPath;
	laserReachedTarget = laserComputationResults.laserReachedTarget;
    }

    this.map.doorOpen = laserReachedTarget;
    this.map.laserPath = laserPath;

    this.playerDead = this.laserIntersectsPlayer(laserPath);

};

Field.prototype.isPlayerDead = function() {
    return this.playerDead;
};

Field.prototype.flipMirrors = function() {
    for (var x = 0; x < this.map.width; x++) {
        for (var y = 0; y < this.map.height; y++) {
	    var pos = create_position(x, y);
	    var item = this.map.itemAt(pos);
	    if (item.type == ITEM_TYPE.FORWARD_FLIP) {
		item.type =  ITEM_TYPE.BACKWARD_FLIP;
	    } else if (item.type == ITEM_TYPE.BACKWARD_FLIP) {
		item.type =  ITEM_TYPE.FORWARD_FLIP;
	    }
        }
    }
};

Field.prototype.laserIntersectsPlayer = function(laserPath) {
    for (var i = 0; i < laserPath.length; i++) {
	var laserPos = laserPath[i];
	if (equal_position(laserPos, this.map.player.pos)) {
            return true;
        }
    }
    return false;
};

Field.prototype.gameWon = function() {
    return this.map.doorOpen && equal_position(this.map.player.pos, this.map.door);
};

Field.prototype.inBounds = function(pos) {
    return !(pos.x < 0 || pos.x >= this.map.width ||
	     pos.y < 0 || pos.y >= this.map.height);
};


Field.prototype.isSliderCell = function(pos) {
    return _.any(this.map.sliders, function(sliderPos) { return equal_position(pos, sliderPos);});
};

/* Player Motion */

Field.prototype.attemptPlayerMove = function(direction) {
    var playerMoved = this.attemptToMoveItem(this.map.player, direction);
    if (playerMoved) {
	this.flipMirrors();
	this.runLaserUpdate();
    }
};

/* Called once moving the item at itemPos to newPos is known to be a
 * valid move. Will make the initial move in the direction and then
 * carry out any further effects that move may have (slider cell
 * trying to push it farther, etc.) */
Field.prototype.moveItem = function(item, direction) {
    var origItemPos = item.pos;
    var newPos = step_dir(origItemPos, direction);
    if (!this.isCellEmpty(newPos)) {
	throw "Invalid move executed";
    }
    tmp = this.map.itemAt(newPos);
    this.map.setItemAt(origItemPos, tmp);
    this.map.setItemAt(newPos, item);

    if (this.isSliderCell(newPos)) {
	this.attemptToMoveItem(item, direction);
    }
};

/* Attempts to move the item in the indicated direction. Returns
 * true or false based on whether the move was successful */
Field.prototype.attemptToMoveItem = function(item, direction) {
    var itemPos = item.pos;
    var itemType = item.type;
    var newPos = step_dir(itemPos, direction);
    if (!this.inBounds(newPos)) {
	return false;
    }
    if (this.isCellEmpty(newPos)) {
        console.log('cell empty');        
	this.moveItem(item, direction);
	return true;
    }
    var itemToConsiderPushing = this.map.itemAt(newPos);
    console.log(itemType);
    if (itemType == ITEM_TYPE.PLAYER && itemToConsiderPushing.isPushable()) {
	var pushSuccessful = this.attemptToMoveItem(itemToConsiderPushing, direction);
	if (pushSuccessful) {
	    // If we pushed the item at newPos, move our original item
	    // over to newPos
	    this.moveItem(item, direction);
	    return true;
	} else {
	    return false;
	}
    } else {
	// Non-pushable item found
	return false;
    }
};

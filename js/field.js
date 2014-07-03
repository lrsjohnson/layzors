var Field = function() {
};

Field.prototype.loadMap = function(map) {
    this.laserPath = [];
    this.doorOpen = false;

    // Field of items
    this.width = map.getWidth();
    this.height = map.getHeight();

    this.items = map.getItemsMap();

    this.player = map.getPlayer();
    this.setItemAt(this.player.pos, this.player);

    this.buttons = map.getButtons();
    this.sliders = map.getSliders();
    this.source = map.getLaserSource();
    this.target = map.getLaserTarget();
    console.log(this);
    this.door = map.getDoor();

    this.runLaserUpdate();
};

Field.prototype.getLaserPathCoordinates = function() {
    return this.laserPath;
};

Field.prototype.isDoorOpen = function() {
    return this.doorOpen;
};

Field.prototype.itemAt = function(pos) {
    return this.items[pos.y][pos.x];
};


Field.prototype.setItemAt = function(pos, item) {
    item.pos = pos;
    this.items[pos.y][pos.x] = item;
};

Field.prototype.isCellEmpty = function(pos) {
    return this.itemAt(pos).isEmpty();
};

Field.prototype.isButtonPushed = function(button) {
    var buttonPos = button;
    return (equal_position(buttonPos, this.player.pos) || ! this.isCellEmpty(buttonPos));
};

// After all items on the board are in their new places, this will
// determine if the laser is on and update any attributes that
// result from the laser's path.
Field.prototype.runLaserUpdate = function() {
    var numButtonsPushed = 0;
    for (var i = 0; i < this.buttons.length; i++) {
        var button = this.buttons[i];
	if (this.isButtonPushed(button)) {
	    numButtonsPushed += 1;
	}
    }
    var isLaserOn = false;
    if (numButtonsPushed == this.buttons.length) {
	isLaserOn = true;
    }

    var laserPath = []
    var laserReachedTarget = false;
    if (isLaserOn) {
	var laserComputationResults = simulate_laser(this.source, this.target);
	laserPath = laserComputationResults.laserPath;
	laserReachedTarget = laserComputationResults.laserReachedTarget;
    }

    this.doorOpen = laserReachedTarget;
    this.laserPath = laserPath;

    this.playerDead = this.laserIntersectsPlayer(laserPath);

};

Field.prototype.isPlayerDead = function() {
    return this.playerDead;
};

Field.prototype.flipMirrors = function() {
    for (var x = 0; x < this.width; x++) {
        for (var y = 0; y < this.height; y++) {
	    var pos = create_position(x, y);
	    var item = this.itemAt(pos);
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
	if (equal_position(laserPos, this.player.pos)) {
            return true;
        }
    }
    return false;
};

Field.prototype.gameWon = function() {
    return this.doorOpen && equal_position(this.player.pos, this.door);
};

Field.prototype.inBounds = function(pos) {
    return !(pos.x < 0 || pos.x >= this.width ||
	     pos.y < 0 || pos.y >= this.height);
};


Field.prototype.isSliderCell = function(pos) {
    for (var i = 0; i < this.sliders.length; i++) {
	var sliderPos = this.sliders[i];
        if (equal_position(pos, sliderPos)) {
	    return true;
        }
    }
    return false;
};

/* Player Motion */

Field.prototype.attemptPlayerMove = function(direction) {
    var playerMoved = this.attemptToMoveItem(this.player, direction);
    if (playerMoved) {
	this.flipMirrors();
	this.runLaserUpdate();
    }
};

/* Moving the item at itemPos to newPos is a valid move. */
Field.prototype.moveItem = function(item, direction) {
    console.log("moving item...", item);
    var origItemPos = item.pos;
    var newPos = step_dir(origItemPos, direction);
    if (!this.isCellEmpty(newPos)) {
	throw "Invalid move executed";
    }
    tmp = this.itemAt(newPos);
    this.setItemAt(origItemPos, tmp);
    this.setItemAt(newPos, item);

    if (this.isSliderCell(newPos)) {
	this.attemptToMoveItem(newPos, direction);
    }
};

/* Attempts to move the player in the indicated direction. Returns
 * true or false based on whether the move was successful */
Field.prototype.attemptToMoveItem = function(item, direction) {
    var itemPos = item.pos;
    var itemType = item.type;
    var newPos = step_dir(itemPos, direction);
    if (!this.inBounds(newPos)) {
	return false;
    }
    if (this.isCellEmpty(newPos)) {
	this.moveItem(item, direction);
	return true;
    }
    var itemToConsiderPushing = this.itemAt(newPos);
    if (itemToConsiderPushing.isPushable()) {
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

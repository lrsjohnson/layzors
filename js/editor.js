// Inherits from Game
var Editor = function() {
    Game.call(this);
    this.currentTool = undefined;

    this.dir = DIRECTION.UP;

    this.mapView = new EditorView();
    this.mapView.registerCellClickDelegate(_.bind(this.onClickCell, this));

    this.wallBtn = $("#wall");
    this.wallBtn.click();
};
Editor.prototype = Object.create(Game.prototype);
Editor.prototype.constructor = Game;

// Redirect on a key-by-key basis.
Editor.prototype.handleKeyPress = function(e) {
    var key = e.keyCode;
    console.log(key);
    switch(key) {
    case 48: // 0
	this.currentTool = TOOL_TYPE.ITEM;
	this.currentItemType = ITEM_TYPE.EMPTY;
	break;
    case 49: // 1
	this.currentTool = TOOL_TYPE.ITEM;
	this.currentItemType = ITEM_TYPE.FORWARD;
	break;
    case 50: // 2
	this.currentTool = TOOL_TYPE.ITEM;
	this.currentItemType = ITEM_TYPE.BACKWARD;
	break;
    case 51: // 3
	this.currentTool = TOOL_TYPE.SOURCE;
	break;
    case 52: // 4
	this.currentTool = TOOL_TYPE.TARGET;
	break;
    case 53: // 5
	this.currentTool = TOOL_TYPE.BUTTON;
	break;
    case 54: // 6
	this.currentTool = TOOL_TYPE.ITEM;
	this.currentItemType = ITEM_TYPE.FORWARD_FLIP;
	break;
    case 55: // 7
	this.currentTool = TOOL_TYPE.ITEM;
	this.currentItemType = ITEM_TYPE.BACKWARD_FLIP;
	break;
    case 56: // 8
	this.currentTool = TOOL_TYPE.SLIDER;
	break;
    case 57: // 9
	this.currentTool = TOOL_TYPE.ITEM;
	this.currentItemType = ITEM_TYPE.WALL;
	break;
    case 192: // `
	this.currentTool = TOOL_TYPE.DOOR;
	break;
    case 187: // +
	this.map.addRow();
	this.mapView.init(map, this.canvas);
	this.field.refreshState();
	this.updateDisplay();
	break;
    case 189: // -
	this.map.removeRow();
	this.mapView.init(map, this.canvas);
	this.field.refreshState();
	this.updateDisplay();
	break;
    case 221: // ]
	this.map.addCol();
	this.mapView.init(map, this.canvas);
	this.field.refreshState();
	this.updateDisplay();
	break;
    case 219: // [
	this.map.removeCol();
	this.mapView.init(map, this.canvas);
	this.field.refreshState();
	this.updateDisplay();
	break;
    case 32: // space
	this.initialMap = this.map.clone();
	break;
    default:
	return Game.prototype.handleKeyPress.call(this, e);
    }
};

Editor.prototype.onClickCell = function(pos) {
    console.log(pos);
    if (this.currentTool == TOOL_TYPE.ITEM) {
	console.log(pos);
	var itemType = this.currentItemType;
	var newItem = new Item(pos, itemType);
	this.map.setItemAt(pos, newItem);
    } else if (this.currentTool == TOOL_TYPE.BUTTON) {
	var otherButtons = _.reject(this.map.buttons, function (b) { return equal_position(b, pos);});
	if (otherButtons.length == this.map.buttons.length) {
	    otherButtons.push(pos);
	}
	this.map.buttons = otherButtons;
    } else if (this.currentTool == TOOL_TYPE.SLIDER) {
	var otherSliders = _.reject(this.map.sliders, function (s) { return equal_position(s, pos);});
	if (otherSliders.length == this.map.sliders.length) {
	    otherSliders.push(pos);
	}
	this.map.sliders = otherSliders;
    } else if (this.currentTool == TOOL_TYPE.SOURCE) {
	this.map.laserSource = new LaserSource(pos, this.dir);
	this.dir = turn_right(this.dir);
    } else if (this.currentTool == TOOL_TYPE.TARGET) {
	this.map.laserTarget = new LaserTarget(pos, this.dir);
	this.dir = turn_right(this.dir);
    } else if (this.currentTool == TOOL_TYPE.DOOR) {
	this.map.door = pos;
    }
    this.field.refreshState();
    this.updateDisplay();
};



var TOOL_TYPE = {
    ITEM: 0,
    BUTTON: 1,
    SOURCE: 2,
    TARGET: 3,
    DOOR:   4,
    SLIDER: 5,
};
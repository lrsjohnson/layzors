var ITEM_TYPE = {
    EMPTY: " ",
    PLAYER: "p",
    WALL: "0",
    FORWARD: "f",
    BACKWARD: "b",
    FORWARD_FLIP: "F",
    BACKWARD_FLIP: "B",
    //    BUTTON: ".",
    //    SOURCE: "@",
    //    GOAL: "!",
    //    DOOR: "d",
    //    SLIDER: "s"
};

var Item = function(pos, type) {
    this.pos = pos;
    this.type = type;
};

Item.prototype.isEmpty = function() {
    return this.type == ITEM_TYPE.EMPTY;
};

Item.prototype.isPushable = function() {
    return _.contains([ITEM_TYPE.FORWARD,
		       ITEM_TYPE.FORWARD_FLIP,
		       ITEM_TYPE.BACKWARD,
		       ITEM_TYPE.BACKWARD_FLIP,
		       ],
		     this.type);
};

Item.prototype.clone = function() {
    return new Item(this.pos, this.type);
};
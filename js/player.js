var Player = function(pos) {
    Item.call(this, pos, ITEM_TYPE.PLAYER);
};
Player.prototype = Object.create(Item.prototype);
Player.prototype.constructor = Player;

Player.prototype.clone = function() {
    return new Player(this.pos);
};

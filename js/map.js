/* A map represents a mutable structure that is used to
 * store the configuration of a level's objects.
 */
var Map = function() {
    // Field of items
    this.width = 0;
    this.height = 0;

    this.items = undefined;
    this.player = undefined;

    this.buttons = [];
    this.sliders = [];
    this.laserSoure = undefined;
    this.laserTarget = undefined;
    this.door = undefined;

    this.laserPath = [];
    this.doorOpen = false;
};

Map.prototype.clone = function() {
    var m = new Map();
    m.width = this.width;
    m.height = this.height;

    var mItems = [];
    for (var y = 0; y < this.height; y++) {
	mItems.push([]);
	for (var x = 0; x < this.width; x++) {
	    mItems[y].push(this.items[y][x].clone());
	}
    }
    m.items = mItems;

    m.player = this.player.clone();
    m.setItemAt(m.player.pos, m.player);

    m.buttons = _.clone(this.buttons);
    m.sliders = _.clone(this.sliders);

    m.laserSource = this.laserSource;
    m.laserTarget = this.laserTarget;
    m.door = this.door;

    return m;
};

Map.prototype.setLaserPath = function(laserPath) {
    this.laserPath = laserPath;
};

Map.prototype.getLaserPathCoordinates = function() {
    return this.laserPath;
};

Map.prototype.isDoorOpen = function() {
    return this.doorOpen;
};

Map.prototype.setDoorOpen = function(doorOpenState) {
    this.doorOpen = doorOpenState;
};

Map.prototype.getWidth = function() {
    return this.width;
};

Map.prototype.getHeight = function() {
    return this.height;
};

Map.prototype.itemAt = function(pos) {
    return this.items[pos.y][pos.x];
};

Map.prototype.setItemAt = function(pos, item) {
    item.pos = pos;
    this.items[pos.y][pos.x] = item;
};




Map.prototype.getPlayer = function() {
    return this.player.clone();
};

Map.prototype.getButtons = function() {
    return this.buttons; // Immutable
};

Map.prototype.getSliders = function() {
    return this.sliders; // Immutable
};

Map.prototype.getDoor = function() {
    return this.door;  // Immutable
};

Map.prototype.loadFromJsonData = function(jsonData) {

    // Items from field array
    var fieldArray = jsonData['field'];
    this.height = fieldArray.length;
    this.width = fieldArray[0].length;

    var itemsArray = [];
    for (var y = 0; y < this.height; y++) {
	itemsArray.push([]);
	for (var x = 0; x < this.width; x++) {
	    var itemSymbol = fieldArray[y][x];
	    var itemPos = create_position(x, y);
	    var item = new Item(itemPos, itemSymbol);
	    itemsArray[y].push(item);
	}
    }
    this.items = itemsArray;

    // Player
    var playerPos = this.decodePositionInfo(jsonData['player'])
    this.player = new Player(playerPos);
    this.setItemAt(this.player.pos, this.player);


    // Buttons
    var buttonsInfo = jsonData['buttons'] || [];
    this.buttons = _.map(buttonsInfo, this.decodePositionInfo);

    // Sliders
    var slidersInfo = jsonData['sliders'] || [];
    this.sliders = _.map(slidersInfo, this.decodePositionInfo);

    // Laser Source
    var sourceInfo = jsonData['source'];
    var sourcePos = create_position(sourceInfo[0], sourceInfo[1]);
    var sourceDir = sourceInfo[2];
    this.laserSource = new LaserSource(sourcePos, sourceDir);

    // Laser Target
    var targetInfo = jsonData['goal'];
    var targetPos = create_position(targetInfo[0], targetInfo[1]);
    var targetDir = targetInfo[2];
    this.laserTarget = new LaserTarget(targetPos, targetDir);

    // Door
    this.door = this.decodePositionInfo(jsonData['door']);
};

Map.prototype.decodePositionInfo = function(posInfo) {
    return create_position(posInfo[0], posInfo[1]);
};

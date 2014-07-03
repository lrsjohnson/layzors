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
};

Map.prototype.getWidth = function() {
    return this.width;
};

Map.prototype.getHeight = function() {
    return this.height;
};

Map.prototype.getItemsMap = function() {
    console.log(this.items);
    var newMap = [];
    for (var y = 0; y < this.height; y++) {
	newMap.push([]);
	for (var x = 0; x < this.width; x++) {
	    newMap[y].push(this.items[y][x].clone());
	}
    }
    return newMap;
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
Map.prototype.getLaserSource = function() {
    return this.laserSource; // Immutable
};

Map.prototype.getLaserTarget = function() {
    return this.laserTarget; // Immutable
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

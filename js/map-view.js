var MapView = function() {
    this.initGraphicsConstants();
};

MapView.prototype.initGraphicsConstants = function() {
    this.cellWidth = 30;
    this.cellHeight = 30;
    this.lineWidth = 2;
    this.cellWidth += this.lineWidth;
    this.cellHeight += this.lineWidth;
    this.scale = 2;
    this.cellWidth *= this.scale;
    this.cellHeight *= this.scale;
};

MapView.prototype.init = function(map, canvas) {
    this.map = map;
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');

    this.canvas.width = this.map.width * this.cellWidth + this.lineWidth-1;
    this.canvas.height = this.map.height * this.cellHeight + this.lineWidth-1;
};

MapView.prototype.draw = function() {
    var laserCoords = this.map.getLaserPathCoordinates();
    var doorOpen = this.map.isDoorOpen();

    this.canvas.width = this.canvas.width;
    this.context.lineWidth = this.lineWidth;
    this.context.beginPath();
    for (var i = 0; i <= this.map.width; i++) { // drawing x gridlines
        this.context.moveTo(i*this.cellWidth, 0);
        this.context.lineTo(i*this.cellHeight, this.canvas.height);
    }
    for (var j = 0; j <= this.map.height; j++) { // drawing y gridlines
        this.context.moveTo(0, j*this.cellWidth);
        this.context.lineTo(this.canvas.width, j*this.cellHeight);
    }
    for (var i = 0; i < this.map.width; i++) { // drawing field
        for (var j = 0; j < this.map.height; j++) {
            var item = this.map.itemAt(create_position(i, j));
	    var itemType = item.type;
            var x = this.ftcX(i);
            var y = this.ftcY(j);
            if (itemType === ITEM_TYPE.FORWARD || itemType === ITEM_TYPE.FORWARD_FLIP) {
                this.context.moveTo(x + 11*this.scale, y + 22*this.scale);
                this.context.lineTo(x + 22*this.scale, y + 11*this.scale);
            } else if (itemType === ITEM_TYPE.BACKWARD || itemType == ITEM_TYPE.BACKWARD_FLIP){
                this.context.moveTo(x + 11*this.scale, y + 11*this.scale);
                this.context.lineTo(x + 21*this.scale, y + 21*this.scale);
            } else if (itemType === ITEM_TYPE.WALL) {
		this.context.fillRect(x, y, this.cellWidth, this.cellHeight);
            }
            if (itemType === ITEM_TYPE.FORWARD_FLIP || itemType === ITEM_TYPE.BACKWARD_FLIP) {
                var centerX = x + this.cellWidth / 2 - 2*this.scale;
                var centerY = y + this.cellHeight / 2 - 2*this.scale;
                this.context.fillRect(centerX, centerY, 5*this.scale, 5*this.scale);
            }

        }
    }
    this.context.stroke();
    var source = this.map.laserSource;
    var sourcePos = this.fotc(this.map.laserSource);
    for (var r = 0; r < 5*this.scale; r++) {
        this.context.beginPath();
        this.context.arc(sourcePos[0], sourcePos[1], r, Math.PI/2 * (source.dir), Math.PI/2 * (source.dir + 2));
        this.context.stroke();
    }
    var goalPos = this.fotc(this.map.laserTarget); // drawing goal
    var w = 5*this.scale;
    var h = 8*this.scale;
    var goalL1 = [[-w, 0], [0, -w], [-w, 0], [0, -w]];
    var goalL2 = [[-w, h], [-h, -w], [-w, -h], [h, -w]];
    var goalR1 = [[w, 0], [0, w], [w, 0], [0, w]];
    var goalR2 = [[w, h], [-h, w], [w, -h], [h, w]];
    var goalM = [[0, h], [-h, 0], [0, -h], [h, 0]];
    this.context.beginPath();
    var y = this.map.laserTarget.dir;
    this.context.moveTo(goalPos[0] + goalL1[y][0], goalPos[1] + goalL1[y][1]);
    this.context.lineTo(goalPos[0] + goalL2[y][0], goalPos[1] + goalL2[y][1]);
    this.context.moveTo(goalPos[0] + goalR1[y][0], goalPos[1] + goalR1[y][1]);
    this.context.lineTo(goalPos[0] + goalR2[y][0], goalPos[1] + goalR2[y][1]);
    this.context.stroke();
    this.context.beginPath();
    this.context.arc(goalPos[0] + goalM[y][0], goalPos[1] + goalM[y][1], w, Math.PI/2 * (y+2), Math.PI/2 * (y+4));
    this.context.stroke();
    for (var i = 0; i < this.map.buttons.length; i++) { // drawing buttons
        var button = this.map.buttons[i];
        var buttonX = this.ftcX(button.x);
        var buttonY = this.ftcY(button.y);
        this.context.strokeRect(buttonX + 6*this.scale, buttonY + 14*this.scale, 20*this.scale, 4*this.scale);
    }
    this.context.beginPath(); // drawing player
    var playerX = this.ftcX(this.map.player.pos.x) + this.cellWidth / 2;
    var playerY = this.ftcY(this.map.player.pos.y) + this.cellHeight / 2;
    this.context.arc(playerX, playerY, 6*this.scale, 0, Math.PI * 2);
    this.context.fillStyle = 'white';
    this.context.fill();
    this.context.fillStyle = 'black';
    this.context.stroke();
    var door = this.map.door;
    if (door !== undefined) { // drawing door
        var doorX = this.ftcX(door.x) + this.cellWidth / 2;
        var doorY = this.ftcY(door.y) + this.cellHeight / 2;
        if (doorOpen) {
            this.context.moveTo(doorX, doorY - 6*this.scale);
            this.context.lineTo(doorX + 4*this.scale, doorY + 8*this.scale);
            this.context.lineTo(doorX - 6*this.scale, doorY - 1*this.scale);
            this.context.lineTo(doorX + 6*this.scale, doorY - 1*this.scale);
            this.context.lineTo(doorX - 4*this.scale, doorY + 8*this.scale);
            this.context.lineTo(doorX, doorY - 6*this.scale);
        } else {
            this.context.moveTo(doorX, doorY);
            this.context.arc(doorX, doorY - 4*this.scale, 4*this.scale, Math.PI/2, 3*Math.PI/2 - .2, true);
            this.context.moveTo(doorX, doorY);
            this.context.lineTo(doorX, doorY + 5*this.scale);
            this.context.moveTo(doorX, doorY + 9*this.scale);
            this.context.arc(doorX, doorY + 9*this.scale, 1, 0, Math.PI * 2);

        }
        this.context.stroke();
    }
    var sliders = this.map.sliders;
    for (var i = 0; i < sliders.length; i++) { // drawing sliders
        var sliderX = this.ftcX(this.map.sliders[i].x) + this.cellWidth/2;
        var sliderY = this.ftcY(this.map.sliders[i].y) + this.cellHeight/2;
        var s = this.scale;
        this.context.moveTo(sliderX, sliderY + 10*s);
        this.context.lineTo(sliderX + 4*s, sliderY + 6*s);
        this.context.lineTo(sliderX + 2*s, sliderY + 6*s);
        this.context.lineTo(sliderX + 2*s, sliderY + 2*s);
        this.context.lineTo(sliderX + 6*s, sliderY + 2*s);
        this.context.lineTo(sliderX + 6*s, sliderY + 4*s);
        this.context.lineTo(sliderX + 10*s, sliderY);
        this.context.lineTo(sliderX + 6*s, sliderY - 4*s);
        this.context.lineTo(sliderX + 6*s, sliderY - 2*s);
        this.context.lineTo(sliderX + 2*s, sliderY - 2*s);
        this.context.lineTo(sliderX + 2*s, sliderY - 6*s);
        this.context.lineTo(sliderX + 4*s, sliderY - 6*s);
        this.context.lineTo(sliderX, sliderY - 10*s);
        this.context.lineTo(sliderX - 4*s, sliderY - 6*s);
        this.context.lineTo(sliderX - 2*s, sliderY - 6*s);
        this.context.lineTo(sliderX - 2*s, sliderY - 2*s);
        this.context.lineTo(sliderX - 6*s, sliderY - 2*s);
        this.context.lineTo(sliderX - 6*s, sliderY - 4*s);
        this.context.lineTo(sliderX - 10*s, sliderY);
        this.context.lineTo(sliderX - 6*s, sliderY + 4*s);
        this.context.lineTo(sliderX - 6*s, sliderY + 2*s);
        this.context.lineTo(sliderX - 2*s, sliderY + 2*s);
        this.context.lineTo(sliderX - 2*s, sliderY + 6*s);
        this.context.lineTo(sliderX - 4*s, sliderY + 6*s);
        this.context.lineTo(sliderX, sliderY + 10*s);
    }
    this.context.stroke();

    this.drawLaser(laserCoords);
};

MapView.prototype.drawLaser = function(laserCoords) {
    if (laserCoords === undefined || laserCoords.length === 0) {
        return;
    }
    this.context.strokeStyle = 'red';
    var source = this.map.laserSource;
    var firstPos = this.fotc(source);
    this.context.beginPath();
    this.context.moveTo(firstPos[0], firstPos[1]);
    for (var i = 0; i < laserCoords.length; i++) {
        var x = this.ftcX(laserCoords[i].x) + this.cellWidth / 2;
        var y = this.ftcY(laserCoords[i].y) + this.cellHeight / 2;
        this.context.lineTo(x, y);
    }
    this.context.stroke();
    this.context.strokeStyle = 'black';
    if (laserCoords.length > 1) {
        var x = this.ftcX(laserCoords[laserCoords.length-1].x);
        var y = this.ftcY(laserCoords[laserCoords.length-1].y);
        this.context.fillRect(x, y, this.cellWidth, this.cellHeight);
    }
};

// Applies to source or goal
// TODO
MapView.prototype.fotc = function(sourceDir) {
    var pos = sourceDir.pos;
    var dir = sourceDir.dir;
    var xChanges = [this.cellWidth / 2, this.cellWidth, this.cellWidth / 2, 0];
    var yChanges = [0, this.cellHeight / 2, this.cellHeight, this.cellHeight / 2];
    var canvX = this.ftcX(pos.x) + xChanges[dir];
    var canvY = this.ftcY(pos.y) + yChanges[dir];
    return [canvX, canvY];
}

// field to canvas x
MapView.prototype.ftcX = function(x) {
    return x * this.cellWidth;
};

// field to canvas y
MapView.prototype.ftcY = function(y) {
    return y * this.cellHeight;
};

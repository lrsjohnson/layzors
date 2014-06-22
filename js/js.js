var TYPE = {
    EMPTY: " ",
    PLAYER: "p",
    WALL: "0",
    FORWARD: "/",
    BACKWARD: "\\",
    BUTTON: ".",
    SOURCE: "@",
    GOAL: "!"
};

var game = {};

game.init = function(map) {
    this.cellWidth = 30;
    this.cellHeight = 30;
    this.lineWidth = 2;
    this.cellWidth += this.lineWidth;
    this.cellHeight += this.lineWidth;
    this.scale = 2;
    this.cellWidth *= this.scale;
    this.cellHeight *= this.scale;

    this.canvas = document.getElementById('canvas');
    this.context = canvas.getContext('2d');
    this.field = map.field;
    this.width = this.field.length;
    this.height = this.field[0].length;
    this.player = map.player; // {x, y}
    this.buttons = map.buttons; // [{x1, y1}, ..., {xn, yn}]
    this.source = map.source; // {x, y}
    this.goal = map.goal; // {x, y}
    this.canvas.width = this.width * this.cellWidth + this.lineWidth;
    this.canvas.height = this.height * this.cellHeight + this.lineWidth;

    window.addEventListener('keydown', this.onKeyPress, false);
    
    this.draw();
};

game.onKeyPress = function(e) {
    var key = e.keyCode;
    if (key == 37 || key == 65) { // left
        console.log("left");
    } else if (key == 38 || key == 87) { // up
        console.log("up");
    } else if (key == 39 || key == 68) { // right
        console.log("right");
    } else if (key == 40 || key == 83) { // down
        console.log("down");
    }
    var coords = test_from_allen_code();
    console.log(coords);
    game.drawLaser(coords);
};

game.draw = function() {
    this.context.lineWidth = this.lineWidth;
    this.context.beginPath();
    for (var i = 0; i <= this.width; i++) { // drawing x gridlines
        this.context.moveTo(i*this.cellWidth, 0);
        this.context.lineTo(i*this.cellHeight, this.canvas.height);
    }
    for (var j = 0; j <= this.height; j++) { // drawing y gridlines
        this.context.moveTo(0, j*this.cellWidth);
        this.context.lineTo(this.canvas.width, j*this.cellHeight);
    }
    for (var i = 0; i < this.width; i++) { // drawing field
        for (var j = 0; j < this.height; j++) {
            var element = this.field[i][j];
            var x = this.ftcX(i);
            var y = this.ftcY(j);
            if (element === TYPE.FORWARD) {
                this.context.moveTo(x + 11*this.scale, y + 22*this.scale);
                this.context.lineTo(x + 22*this.scale, y + 11*this.scale);
            } else if (element === TYPE.BACKWARD){
                this.context.moveTo(x + 11*this.scale, y + 11*this.scale);
                this.context.lineTo(x + 21*this.scale, y + 21*this.scale);
            } else if (element === TYPE.WALL) {
                this.context.fillRect(x, y, 32*this.scale, 32*this.scale);
            }
        }
    }
    this.context.stroke();
    this.context.beginPath(); // drawing player
    var playerX = this.ftcX(this.player[0]) + this.cellWidth / 2;
    var playerY = this.ftcY(this.player[1]) + this.cellHeight / 2;
    this.context.arc(playerX, playerY, 6*this.scale, 0, Math.PI * 2);
    this.context.stroke();
    var xChanges = [this.cellWidth / 2, this.cellWidth, this.cellWidth / 2, 0];
    var yChanges = [0, this.cellHeight / 2, this.cellHeight, this.cellHeight / 2];
    var sourceX = this.ftcX(this.source[0]) + xChanges[this.source[2]]; // drawing source
    var sourceY = this.ftcY(this.source[1]) + yChanges[this.source[2]];
    for (var r = 0; r < 5*this.scale; r++) {
        this.context.beginPath();
        this.context.arc(sourceX, sourceY, r, Math.PI/2 * (this.source[2]), Math.PI/2 * (this.source[2] + 2));
        this.context.stroke();
    }
    var goalX = this.ftcX(this.goal[0]) + xChanges[this.source[2]]; // drawing goal
    var goalY = this.ftcY(this.goal[1]) + yChanges[this.source[2]];
    
};

game.drawLaser = function(laserCoords) {
    if (laserCoords.length === 0) {
        return;
    }
    this.context.strokeStyle = 'red';
    var lastX = this.ftcX(laserCoords[0].x) + this.cellWidth / 2;
    var lastY = this.ftcY(laserCoords[0].y) + this.cellHeight / 2;
    this.context.beginPath();
    this.context.moveTo(lastX, lastY);
    for (var i = 1; i < laserCoords.length; i++) {
        var x = this.ftcX(laserCoords[i].x) + this.cellWidth / 2;
        var y = this.ftcY(laserCoords[i].y) + this.cellHeight / 2;
        this.context.lineTo(x, y);
    }
    this.context.stroke();
}

// field to canvas x
game.ftcX = function(x) {
    return x * this.cellWidth;
};

// field to canvas y
game.ftcY = function(y) {
    return y * this.cellHeight;
};

game.init(map1);
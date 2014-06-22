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

var deepCopy = function(x) {
    if (x instanceof Array) {
        var y = [];
        for (var i = 0; i < x.length; i++) {
            y.push(deepCopy(x[i]));
        }
        return y;
    } else {
        return x;
    }
};

var game = {};

game.init = function(map, toDoOnFinish) {
    this.active = true;
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
    this.field = deepCopy(map.field);
    this.width = this.field.length;
    this.height = this.field[0].length;
    this.player = deepCopy(map.player); // {x, y}
    this.buttons = deepCopy(map.buttons); // [{x1, y1}, ..., {xn, yn}]
    this.source = deepCopy(map.source); // {x, y}
    this.goal = deepCopy(map.goal); // {x, y}
    this.canvas.width = this.width * this.cellWidth + this.lineWidth-1;
    this.canvas.height = this.height * this.cellHeight + this.lineWidth-1;
    this.onFinish = toDoOnFinish;

    
    this.draw();
};

var makeOnKeyPress = function(x) {
    return function(e) {x.handleKeyPress(e);};
};

game.handleKeyPress = function(e) {
    if (!this.active) {
        return;
    }
    var key = e.keyCode;
    var newPos;
    if (key == 37 || key == 65) { // left
        newPos = [this.player[0] - 1, this.player[1]];
    } else if (key == 38 || key == 87) { // up
        newPos = [this.player[0], this.player[1] - 1];
    } else if (key == 39 || key == 68) { // right
        newPos = [this.player[0] + 1, this.player[1]];
    } else if (key == 40 || key == 83) { // down
        newPos = [this.player[0], this.player[1] + 1];
    } else { // only want to do stuff from valid key presses
        return;
    }
    if (!this.moveIfCan(newPos)) {
        return; // can't move
    }
    var coords;
    var win = false;
    for (var i = 0; i < this.buttons.length; i++) {
        var button = this.buttons[i];
        if (eq(button, this.player) || this.field[button[0]][button[1]] !== TYPE.EMPTY) {
            var results = test_from_allen_code();
            coords = results.coords;
            win = results.win;
            break;
        }
    }
    this.draw(coords);
    if (coords !== undefined && this.died(coords)) {
        this.active = false;
        this.onFinish(false);
    } else if (win) {
        this.active = false;
        this.onFinish(true);
    }
};

game.died = function(coords) {
    for (var i = 0; i < coords.length; i++) {
        if (coords[i].x == this.player[0] && coords[i].y == this.player[1]) {
            return true;
        }
    }
    return false;
};

var eq = function(x, y) {
    return x[0] === y[0] && x[1] === y[1];
};

game.inBounds = function(newPos) {
    return !(newPos[0] < 0 || newPos[0] >= game.width ||
           newPos[1] < 0 || newPos[1] >= game.height);
};

game.moveIfCan = function(newPos) {
    if (!this.inBounds(newPos)) {
        return false;
    }
    var ele = this.field[newPos[0]][newPos[1]];
    if (ele == TYPE.EMPTY) {
        this.player = newPos;
        return true;
    } else if (ele == TYPE.WALL) {
        return false;
    } else if (ele == TYPE.FORWARD || ele == TYPE.BACKWARD) {
        var change = [newPos[0] - this.player[0], newPos[1] - this.player[1]];
        var oneMore = [newPos[0] + change[0], newPos[1] + change[1]];
        if (!this.inBounds(oneMore)) {
            return false;
        }
        var oneMoreEle = this.field[oneMore[0]][oneMore[1]];
        if (oneMoreEle == TYPE.EMPTY) {
            this.field[oneMore[0]][oneMore[1]] = ele;
            this.field[newPos[0]][newPos[1]] = TYPE.EMPTY;
            this.player = newPos;
            return true;
        }
    }
    return false;
};

game.draw = function(laserCoords) {
    this.canvas.width = this.canvas.width;
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
                this.context.fillRect(x, y, this.cellWidth, this.cellHeight);
            }
        }
    }
    this.context.stroke();
    this.context.beginPath(); // drawing player
    var playerX = this.ftcX(this.player[0]) + this.cellWidth / 2;
    var playerY = this.ftcY(this.player[1]) + this.cellHeight / 2;
    this.context.arc(playerX, playerY, 6*this.scale, 0, Math.PI * 2);
    this.context.stroke();
    var sourcePos = this.fotc(this.source);
    for (var r = 0; r < 5*this.scale; r++) {
        this.context.beginPath();
        this.context.arc(sourcePos[0], sourcePos[1], r, Math.PI/2 * (this.source[2]), Math.PI/2 * (this.source[2] + 2));
        this.context.stroke();
    }
    var goalPos = this.fotc(this.goal);

    
    game.drawLaser(laserCoords);
};

game.drawLaser = function(laserCoords) {
    if (laserCoords === undefined || laserCoords.length === 0) {
        return;
    }
    this.context.strokeStyle = 'red';
    var firstPos = this.fotc(this.source);
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

game.fotc = function(pos) {
    var xChanges = [this.cellWidth / 2, this.cellWidth, this.cellWidth / 2, 0];
    var yChanges = [0, this.cellHeight / 2, this.cellHeight, this.cellHeight / 2];
    var canvX = this.ftcX(pos[0]) + xChanges[pos[2]];
    var canvY = this.ftcY(pos[1]) + yChanges[pos[2]];
    return [canvX, canvY];
}

// field to canvas x
game.ftcX = function(x) {
    return x * this.cellWidth;
};

// field to canvas y
game.ftcY = function(y) {
    return y * this.cellHeight;
};

var onFinish = function (won) {
    if (won) {
        console.log('Yay!');
        text.innerHTML = '<b>Click to go to the next level.</b>';
        currentMap ++;
    } else {
        console.log('Boo.');
        text.innerHTML = '<b>Click to restart.</b>';
    }
};

var start = function() {game.init(maps[currentMap], onFinish); text.innerHTML = '&nbsp;';};
var text = document.getElementById('text');
var maps = [map1];//, map2, map3];
var currentMap = 0;
window.addEventListener('keydown', makeOnKeyPress(game), false);
start();
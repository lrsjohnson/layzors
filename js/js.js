var TYPE = {
    EMPTY: " ",
    PLAYER: "p",
    WALL: "0",
    FORWARD: "/",
    BACKWARD: "\\",
    FORWARD_FLIP: "f",
    BACKWARD_FLIP: "b",
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
    if (this.buttons === undefined) {
        this.buttons = [];
    }
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
    var key = e.keyCode;
    if (key == 82) {
        start();
        return;
    }
    if (!this.active) {
        return;
    }
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
    this.flipMirrors();
    var coords;
    var win = false;
    for (var i = 0; i < this.buttons.length; i++) {
        var button = this.buttons[i];
        if (eq(button, this.player) || this.field[button[0]][button[1]] !== TYPE.EMPTY) {
            var results = test_from_allen_code(this);
            coords = results.coords;
            win = results.win;
            break;
        }
    }
    if (this.buttons.length == 0) {
        var results = test_from_allen_code(this);
        coords = results.coords;
        win = results.win;
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

game.flipMirrors = function() {
    for (var i = 0; i < this.width; i++) {
        for (var j = 0; j < this.height; j++) {
            if (this.field[i][j] == TYPE.FORWARD_FLIP) {
                this.field[i][j] = TYPE.BACKWARD_FLIP;
            } else if (this.field[i][j] == TYPE.BACKWARD_FLIP) {
                this.field[i][j] = TYPE.FORWARD_FLIP;
            }
        }
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
    } else if (ele == TYPE.FORWARD || ele == TYPE.BACKWARD || ele == TYPE.FORWARD_FLIP || ele == TYPE.BACKWARD_FLIP) {
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
            if (element === TYPE.FORWARD || element === TYPE.FORWARD_FLIP) {
                this.context.moveTo(x + 11*this.scale, y + 22*this.scale);
                this.context.lineTo(x + 22*this.scale, y + 11*this.scale);
            } else if (element === TYPE.BACKWARD || element == TYPE.BACKWARD_FLIP){
                this.context.moveTo(x + 11*this.scale, y + 11*this.scale);
                this.context.lineTo(x + 21*this.scale, y + 21*this.scale);
            } else if (element === TYPE.WALL) {
                this.context.fillRect(x, y, this.cellWidth, this.cellHeight);
            }
            if (element === TYPE.FORWARD_FLIP || element === TYPE.BACKWARD_FLIP) {
                var centerX = x + this.cellWidth / 2 - 2*this.scale;
                var centerY = y + this.cellHeight / 2 - 2*this.scale;
                this.context.fillRect(centerX, centerY, 5*this.scale, 5*this.scale);
            }
            
        }
    }
    this.context.stroke();
    var sourcePos = this.fotc(this.source);
    for (var r = 0; r < 5*this.scale; r++) {
        this.context.beginPath();
        this.context.arc(sourcePos[0], sourcePos[1], r, Math.PI/2 * (this.source[2]), Math.PI/2 * (this.source[2] + 2));
        this.context.stroke();
    }
    var goalPos = this.fotc(this.goal); // drawing goal
    var w = 5*this.scale;
    var h = 7*this.scale;
    var goalL1 = [[-w, 0], [0, -w], [-w, 0], [0, -w]];
    var goalL2 = [[-w, h], [-h, -w], [-w, -h], [h, -w]];
    var goalR1 = [[w, 0], [0, w], [w, 0], [0, w]];
    var goalR2 = [[w, h], [-h, w], [w, -h], [h, w]];
    var goalM = [[0, h], [-h, 0], [0, -h], [h, 0]];
    this.context.beginPath();
    var y = this.goal[2];
    this.context.moveTo(goalPos[0] + goalL1[y][0], goalPos[1] + goalL1[y][1]);
    this.context.lineTo(goalPos[0] + goalL2[y][0], goalPos[1] + goalL2[y][1]);
    this.context.moveTo(goalPos[0] + goalR1[y][0], goalPos[1] + goalR1[y][1]);
    this.context.lineTo(goalPos[0] + goalR2[y][0], goalPos[1] + goalR2[y][1]);
    this.context.stroke();
    this.context.beginPath();
    this.context.arc(goalPos[0] + goalM[y][0], goalPos[1] + goalM[y][1], w, Math.PI/2 * (y+2), Math.PI/2 * (y+4));
    this.context.stroke();
    for (var i = 0; i < this.buttons.length; i++) { // drawing buttons
        var button = this.buttons[i];
        var buttonX = this.ftcX(button[0]);
        var buttonY = this.ftcY(button[1]);
        this.context.strokeRect(buttonX + 6*this.scale, buttonY + 14*this.scale, 20*this.scale, 4*this.scale);
    }
    this.context.beginPath(); // drawing player
    var playerX = this.ftcX(this.player[0]) + this.cellWidth / 2;
    var playerY = this.ftcY(this.player[1]) + this.cellHeight / 2;
    this.context.arc(playerX, playerY, 6*this.scale, 0, Math.PI * 2);
    this.context.fillStyle = 'white';
    this.context.fill();
    this.context.fillStyle = 'black';
    this.context.stroke();
    
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
        text.innerHTML = '<b>Click or press \'r\' to go to the next level.</b>';
        currentMap ++;
        if (currentMap > maps.length) {
            text.innerHTML = "<b>You're done! Congrats!</b>";
            currentMap --;
        }
    } else {
        console.log('Boo.');
        text.innerHTML = '<b>Click to restart.</b>';
    }
};

var start = function() {
    game.init(maps[currentMap-1], onFinish);
    text.innerHTML = '&nbsp;';
    level.innerHTML = "<h2>Level: " + currentMap + "</h2>";
};
var text = document.getElementById('text');
var level = document.getElementById('level');
var currentMap = 1;
window.addEventListener('keydown', makeOnKeyPress(game), false);
start();
console.log("What are you doing looking at the console? Your actions have been logged, and we know where you live. Back to the game with you!");
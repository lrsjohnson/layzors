// Dir is the direction of the cell that the element is on Thus, an UP
// laser source is a laser that comes from the top and an UP laser
// target expects a laser to go towards the top.

var LaserSource = function(pos, dir) {
    this.pos = pos;
    this.dir = dir;
};

var LaserTarget = function(pos, dir) {
    this.pos = pos;
    this.dir = dir;
};
/* Position */

function create_position(x, y) {
    var pos = Object();
    pos.x = x;
    pos.y = y;
    return pos;
};

function position_x(pos) {
    return pos.x;
};

function position_y(pos) {
    return pos.y;
};

function equal_position(pos1, pos2) {
    return (position_x(pos1) == position_x(pos2) &&
            position_y(pos1) == position_y(pos2));
};

function clone_pos(pos) {
    return create_position(pos.x, pos.y);
};

/* Vector */

function create_vec(dx, dy) {
    var vec = Object();
    vec.dx = dx;
    vec.dy = dy;
    return vec;
};

function vec_dx(vec) {
    return vec.dx;
};

function vec_dy(vec) {
    return vec.dy;
};

function add_pos_vec(pos, vec) {
    return create_position(position_x(pos) + vec_dx(vec),
                           position_y(pos) + vec_dy(vec));
};


/* Directions */

var DIRECTION = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3
};

function equal_dir(dir1, dir2) {
    return dir1 == dir2;
};


function is_vertical_dir(dir) {
    return dir == DIRECTION.UP || dir == DIRECTION.DOWN;
};

function is_horizontal_dir(dir) {
    return dir == DIRECTION.LEFT || dir == DIRECTION.RIGHT;
};


function turn_right(dir) {
    return (dir + 1) % 4;
};

function turn_left(dir) {
    return (dir + 3) % 4;
};

function reverse_dir(dir) {
    return (dir + 2) % 4;
};

/* + Coordinate System */
/* Assumes (0, 0) is in the top-left corner */

var DIR_VECS = [create_vec(0, -1), // UP
                create_vec(1, 0), // RIGHT
                create_vec(0, 1), // DOWN
                create_vec(-1, 0)]; // LEFT

function dir_vec(dir) {
    return DIR_VECS[dir];
};

/* -> pos */
function step_dir(pos, dir) {
    return add_pos_vec(pos, dir_vec(dir));
};


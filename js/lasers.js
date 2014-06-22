var laser_source;
var laser_location;
var laser_dir;

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

var DIR_UP = 0;
var DIR_RIGHT = 1;
var DIR_DOWN = 2;
var DIR_LEFT = 3;

function equal_dir(dir1, dir2) {
    return dir1 == dir2;
};


function is_vertical_dir(dir) {
    return dir == DIR_UP || dir == DIR_DOWN;
};

function is_horizontal_dir(dir) {
    return dir == DIR_LEFT || dir == DIR_RIGHT;
};


function turn_right(dir) {
    return (dir + 1) % 4;
};

function turn_left(dir) {
    return (dir + 3) % 4;
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

/* Laser State */

function create_laser_state(live, position, direction) {
    var s = Object();
    s.live = live;
    s.position = position;
    s.direction = direction;
    return s;
};
function create_live_laser_state(position, direction) {
    return create_laser_state(true,
                              position,
                              direction);
};
function create_dead_laser_state(pos, dir) {
    return create_laser_state(false,
                              pos,
                              dir);
};

function laser_state_live(laser_state) {
    return laser_state.live;
};
function laser_state_pos(laser_state) {
    return laser_state.position;
};
function laser_state_dir(laser_state) {
    return laser_state.direction;
};

/* Reflective Cell Info */

var OPEN = 0;
var WALL = 1;
var MIRROR_FORWARD = 2;  //   /
var MIRROR_BACKWARD = 3; //   \

function get_laser_effect(pos) {
    var x = position_x(pos);
    var y = position_y(pos);
    if (x < 0 || y < 0 || x >= game.width || y >= game.height) {
        return WALL;
    }
    var field_cell = game.field[x][y];
    
    if (field_cell == TYPE.FORWARD) {
        return MIRROR_FORWARD;
    } else if (field_cell == TYPE.BACKWARD) {
        return MIRROR_BACKWARD;
    } else if (field_cell == TYPE.WALL) {
        return WALL;
    } else {
        return OPEN;
    }
};

function absorbs(laser_effect) {
    return laser_effect == WALL;
};

function reflects(laser_effect) {
    return laser_effect == MIRROR_FORWARD ||
        laser_effect == MIRROR_BACKWARD;
};

function apply_laser_effect_reflection(dir, laser_effect) {
    if (laser_effect == MIRROR_FORWARD) {
        if (is_vertical_dir(dir)) {
            return turn_right(dir);
        } else {
            return turn_left(dir);
        }
    } else if (laser_effect == MIRROR_BACKWARD) {
        if (is_vertical_dir(dir)) {
            return turn_left(dir);
        } else {
            return turn_right(dir);
        } 
   }
    throw "Bad reflection effect";
};

/* Simulation Stuff */

function create_laser_destination(dest_pos, dest_dir) {
    // Change to the internal representation of a destination being
    // entering a cell with a given direction by stepping once in the
    // given direction.

    return create_live_laser_state(step_dir(dest_pos, dest_dir),
                                   dest_dir);
};

function at_destination(laser_state, laser_destination) {
    return (equal_position(laser_state_pos(laser_state),
                           laser_state_pos(laser_destination)) &&
            equal_dir(laser_state_dir(laser_state),
                       laser_state_dir(laser_destination)));
};


function step_laser_state(init_laser_state) {
    var init_live = laser_state_live(init_laser_state);
    if (!init_live) {
        throw "Stepping dead laser";
    }
    var init_pos = laser_state_pos(init_laser_state);
    var init_dir = laser_state_dir(init_laser_state);

    var new_pos = step_dir(init_pos, init_dir);
    var laser_effect = get_laser_effect(new_pos);

    var new_dir = init_dir;
    if (absorbs(laser_effect)) {
        return create_dead_laser_state(new_pos, new_dir);
    } else if (reflects(laser_effect)) {
        var new_dir = apply_laser_effect_reflection(init_dir, laser_effect);
    }
    return create_live_laser_state(new_pos, new_dir);
};

function simulate_laser(laser_source, laser_destination) {
    var laser_coords = [];
    var laser_state = laser_source;
    while (laser_state_live(laser_state) &&
           !at_destination(laser_state, laser_destination)) {
        laser_coords.push(laser_state_pos(laser_state));
        var new_laser_state = step_laser_state(laser_state);
        //render_laser_step(laser_state, new_laser_state);
        laser_state = new_laser_state;
    }
    laser_coords.push(laser_state_pos(laser_state));
    return {coords: laser_coords, win: at_destination(laser_state, laser_destination)};
};


function test_from_allen_code() {
    /* Start with the laser entering the start_pos from the
     * start_dir */
    var laser_start_pos = create_position(0, 3);
    var laser_start_dir = DIR_RIGHT;
    var laser_source = create_live_laser_state(laser_start_pos,
                                               laser_start_dir);
    /* Succeed when the laser is leaving the destination_pos
     * towards desination_dir */
    var destination_pos = create_position(2, 1);
    var destination_dir = DIR_RIGHT;
    var destination = create_laser_destination(destination_pos,
                                               destination_dir);

    return simulate_laser(laser_source, destination);
}


/* Sprite-based rendering stuff */

/* Renders the effect of turn to the new_laser_state direction. This
 * turn happens at the position of new_laser_state */

var DIES_LASER_GRAPHIC = 'l-dies';

function get_laser_graphic_dir_id(dir) {
    switch (dir) {
    case DIR_UP:
        return 'up';
    case DIR_RIGHT:
        return 'right';
    case DIR_DOWN:
        return 'down';
    case DIR_LEFT:
        return 'left';
    }
};

function get_laser_change_graphic(init_dir, new_dir, new_live) {
    if (!new_live) {
        return DIES_LASER_GRAPHIC;
    }
    return 'l-' + get_laser_graphic_dir_id(init_dir) + '_' +
        get_laser_graphic_dir_id(new_dir);
};

function render_laser_step(init_laser_state,
                           new_laser_state) {
    var graphic_coords = laser_state_pos(new_laser_state);

    var init_dir = laser_state_dir(init_laser_state);
    var new_live = laser_state_live(new_laser_state);
    var new_dir = laser_state_dir(new_laser_state);

    var graphic_id = get_laser_change_graphic(init_dir, new_dir, new_live);

    render_sprite(graphic_id, graphic_coords);
};

var laser_source;
var laser_location;
var laser_dir;

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
    if (x < 0 || y < 0 || x >= game.field.width || y >= game.field.height) {
        return WALL;
    }
    var item_type = game.field.itemAt(pos).type;

    if (item_type == ITEM_TYPE.FORWARD || item_type == ITEM_TYPE.FORWARD_FLIP) {
        return MIRROR_FORWARD;
    } else if (item_type == ITEM_TYPE.BACKWARD || item_type == ITEM_TYPE.BACKWARD_FLIP) {
        return MIRROR_BACKWARD;
    } else if (item_type == ITEM_TYPE.WALL) {
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

function create_laser_destination_state(dest_pos, dest_dir) {
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

    var laser_effect = get_laser_effect(init_pos);

    console.log(laser_effect);

    var new_dir = init_dir;
    if (absorbs(laser_effect)) {
        return create_dead_laser_state(init_pos, init_dir);
    } else if (reflects(laser_effect)) {
        var new_dir = apply_laser_effect_reflection(init_dir, laser_effect);
    }
    var new_pos = step_dir(init_pos, new_dir);
    return create_live_laser_state(new_pos, new_dir);
};

function simulate_laser(laserSource, laserTarget) {
    laser_source_state = create_live_laser_state(laserSource.pos,
						 reverse_dir(laserSource.dir));
    laser_destination_state = create_laser_destination_state(laserTarget.pos,
							     laserTarget.dir);
    var laser_coords = [];
    var laser_state = laser_source_state;
    var count = 0;
    while (laser_state_live(laser_state) &&
           !at_destination(laser_state, laser_destination_state)) {
        laser_coords.push(laser_state_pos(laser_state));
        var new_laser_state = step_laser_state(laser_state);
        //render_laser_step(laser_state, new_laser_state);
        laser_state = new_laser_state;
	count += 1;
	if (count > 100) {
	    throw "Simulation failed";
	}
    }

    laser_coords.push(laser_state_pos(laser_state));
    console.log('atd', at_destination(laser_state, laser_destination_state));
    return {laserPath: laser_coords, laserReachedTarget: at_destination(laser_state, laser_destination_state)};
};


function test_from_allen_code() {
    /* Start with the laser entering the start_pos going in the
     * start_dir */
    var laser_start_pos = create_position(data.source[0], data.source[1]);
    var laser_start_dir = allen_dir_to_lars_dir(data.source[2]);
    var laser_source = create_live_laser_state(laser_start_pos,
                                               laser_start_dir);
    /* Succeed when the laser is leaving the destination_pos
     * towards desination_dir */
    var destination_pos = create_position(data.goal[0], data.goal[1]);
    var destination_dir = data.goal[2];
    var destination = create_laser_destination(destination_pos,
                                               destination_dir);

    return simulate_laser(laser_source, destination);
};

function allen_dir_to_lars_dir(dir) {
    return (dir + 2) % 4;
};


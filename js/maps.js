var maps = {};

maps[1] = {
    field: [['/', '\\', '0', ' ', ' '],
            [' ', ' ', '\\', '\\', ' '],
            [' ', ' ', ' ', ' ', ' '],
            [' ', '0', ' ', '0', ' '],
            [' ', '/', '\\', ' ', ' '],
            [' ', ' ', ' ', ' ', '0']],
    player: [0, 3],
    buttons: [[1, 4]],
    source: [0, 3, 3],
    goal: [2, 1, 1]
};

maps[2] = {
    field: [[' ', ' ', '0',  ' '],
            ['\\', ' ', '\\', '\\'],
            ['0', ' ',  ' ',  ' '],
            [' ', ' ',  ' ',  '/'],
            [' ', '\\',  '0',  ' '],
            [' ', ' ', '\\',  ' '],            
            [' ', ' ',  ' ',  ' ']],
    player: [0, 0],
    buttons: [[1, 1]],
    source: [6, 0, 0],
    goal: [0, 0, 1]
};




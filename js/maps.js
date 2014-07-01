var maps = [];

maps.push({ // door
    help: "Welcome to Layzors! Feel free to experiment on this map and learn your way around. Use WASD or the arrow keys to move. When you're ready, go for the star!",
    field: [[' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' '],
            [' ', ' ', 'b', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ']],
    player: [1, 1],
    source: [0, 2, 3],
    goal: [3, 4, 2],
    door: [4, 3]
});

maps.push({ // door, button
    help: "Go for the star! But wait: what's that button???",
    field: [[' ', ' ', ' ', '0', '0'],
            [' ', ' ', 'b', ' ', '0'],
            [' ', ' ', ' ', '0', '0'],
            [' ', ' ', ' ', '0', '0']],
    player: [1, 3],
    buttons: [[1, 2]],
    source: [3, 1, 1],
    goal: [0, 1, 3],
    door: [3, 2]
});

maps.push({ // door, button
    help: "Is it safe?",
    field: [[' ', 'f', ' ', '0'],
            [' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ']],
    player: [0, 2],
    buttons: [[0, 2]],
    source: [1, 3, 2],
    goal: [1, 0, 0],
    door: [0, 0]
});

maps.push({ // door
    help: "Remember, this is a puzzle. Use your head.",
    field: [[' ', 'f', ' ', ' ', ' ', ' ', ' ', 'b'],
            [' ', ' ', 'f', ' ', ' ', ' ', 'b', ' '],
            [' ', ' ', ' ', 'f', ' ', 'b', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', '0', 'b', ' ', ' ', ' '],
            [' ', ' ', 'b', ' ', ' ', 'f', ' ', ' '],
            [' ', 'b', ' ', ' ', ' ', ' ', 'f', ' '],
            ['b', ' ', ' ', ' ', ' ', ' ', ' ', 'f']],
    player: [3, 4],
    source: [0, 0, 3],
    goal: [7, 1, 1],
    door: [0, 2]
});

maps.push({ // door, button
    help: "And a bit harder...",
    field: [['0', ' ', '0', '0', ' '],
            [' ', 'b', ' ', ' ', ' '],
            ['f', ' ', ' ', 'b', ' '],
            [' ', ' ', ' ', ' ', 'f']],
    player: [0, 1],
    buttons: [[2, 1]],
    source: [3, 0, 1],
    goal: [1, 2, 3],
    door: [2, 1]
});

maps.push({ // door, button
    help: "Where do you want the laser to go? And is it possible?",
    field: [[' ', ' ', '0',  ' '],
            ['b', ' ', 'b', 'b'],
            ['0', ' ',  ' ',  ' '],
            [' ', ' ',  'f',  ' '],
            [' ', 'b',  '0',  ' '],
            [' ', ' ', 'b',  ' '],            
            [' ', ' ',  ' ',  '0']],
    player: [0, 0],
    buttons: [[1, 1]],
    source: [5, 0, 0],
    goal: [0, 0, 0],
    door: [3, 0]
});

maps.push({ // door, button
    help: "Don't make any missteps!",
    field: [['0', '0', '0', '0', ' ', ' '],
            ['f', 'b', ' ', 'b', 'b', ' '],
            [' ', ' ', ' ', ' ', ' ', ' '],
            [' ', '0', ' ', '0', '0', ' '],
            [' ', 'f', 'b', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', '0']],
    player: [0, 4],
    buttons: [[1, 5]],
    source: [0, 4, 3],
    goal: [2, 1, 1],
    door: [3, 2]
});

maps.push({ // door, switcher
    help: "What is this switcher thing?",
    field: [[' ', ' ', ' ', ' ', ' '],
            [' ', 'B', ' ', 'b', ' '],
            [' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', '0']],
    player: [0, 0],
    buttons: [],
    source: [3, 2, 1],
    goal: [2, 4, 1],
    door: [3, 0]
});

maps.push({ // door, button, slider, switcher
    help: "And what is this slider thing?",
    field: [[' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' '],
            [' ', 'b', ' ', 'f', ' '],
            [' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' '],
            ['0', ' ', ' ', ' ', '0'],
            [' ', 'B', ' ', ' ', ' '],
            [' ', ' ', ' ', '0', '0']],
    player: [6, 4],
    buttons: [[2, 4]],
    sliders: [[6, 3]],
    source: [0, 3, 3],
    goal: [7, 1, 1],
    door: [1, 2]
});

maps.push({ // door, button, slider, switcher
    help: "Allen says to replace this one.",
    field: [['f', 'b', '0', ' ', ' '],
            [' ', ' ', 'F', 'b', ' '],
            [' ', ' ', ' ', ' ', ' '],
            [' ', '0', ' ', '0', ' '],
            [' ', 'f', 'b', ' ', ' '],
            [' ', ' ', ' ', ' ', '0']],
    player: [0, 3],
    buttons: [[1, 4]],
    sliders: [[5, 1]],
    source: [0, 3, 3],
    goal: [2, 1, 1],
    door: [3, 2]
});

maps.push({ // door, slider, switchers
    help: "This is still a puzzle. Where's the laser going and where do you want it to go?",
    field: [[' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', 'f', ' ', 'F', ' ', ' ', 'b'],
            [' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', 'F', ' ', 'F', ' ', '0', 'F'],
            [' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', 'b', ' ', 'F', ' ', ' ', 'f'],
            [' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ']],
    player: [0, 3],
    sliders: [[5, 1]],
    source: [3, 4, 2],
    goal: [7, 1, 1],
    door: [0, 2]
});

maps.push({ // door, slider, switcher, two buttons
    help: "Good luck!",
    field: [[' ', ' ', ' ', '0', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', '0', ' ', 'b', ' ', ' '],
            [' ', 'B', ' ', '0', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', '0', '0', '0'],
            ['0', '0', '0', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', '0', ' ', 'b', ' '],
            [' ', ' ', 'f', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', '0', ' ', ' ', ' ']],
    player: [3, 4],
    source: [5, 0, 3],
    buttons: [[7, 3], [4, 6]],
    sliders: [[6, 4]],
    goal: [7, 6, 1],
    door: [7, 5]
});
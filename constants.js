const CELL_SIZE = 20; // Size of each cell in pixels
const WALL_COLOR = '#2121ff';
const DOT_COLOR = '#ffffff';
const PELLET_COLOR = '#ffb8ff';

const PACMAN_SPEED = 2;
const GHOST_SPEED = 1.5;
const GHOST_SCARED_SPEED = 1;
const POWER_PELLET_DURATION = 10000; // 10 seconds

const POINTS = {
    DOT: 10,
    POWER_PELLET: 50,
    GHOST: 200
};

// Game states
const GAME_STATES = {
    READY: 'ready',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'gameOver'
};

// Direction vectors
const DIRECTIONS = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 }
};

// Key mappings
const KEYS = {
    UP: ['ArrowUp', 'w', 'W'],
    DOWN: ['ArrowDown', 's', 'S'],
    LEFT: ['ArrowLeft', 'a', 'A'],
    RIGHT: ['ArrowRight', 'd', 'D'],
    PAUSE: ['p', 'P', 'Escape']
};

// Cell types in the maze
const CELL_TYPE = {
    EMPTY: 0,
    WALL: 1,
    DOT: 2,
    POWER_PELLET: 3,
    GHOST_HOUSE: 4
}; 
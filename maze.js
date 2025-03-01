class Maze {
    constructor(ctx) {
        this.ctx = ctx;
        this.layout = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
            [1,3,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,3,1],
            [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
            [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
            [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
            [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
            [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
            [1,1,1,1,1,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,1,1,1,1,1],
            [1,1,1,1,1,1,2,1,1,0,1,1,1,4,4,1,1,1,0,1,1,2,1,1,1,1,1,1],
            [1,1,1,1,1,1,2,1,1,0,1,0,0,0,0,0,0,1,0,1,1,2,1,1,1,1,1,1],
            [0,0,0,0,0,0,2,0,0,0,1,0,0,0,0,0,0,1,0,0,0,2,0,0,0,0,0,0],
            [1,1,1,1,1,1,2,1,1,0,1,0,0,0,0,0,0,1,0,1,1,2,1,1,1,1,1,1],
            [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
            [1,1,1,1,1,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,1,1,1,1,1],
            [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
            [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
            [1,3,2,2,1,1,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,1,1,2,2,3,1],
            [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
            [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
            [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
            [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
            [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];
        this.dotCount = this.countDots();
    }

    countDots() {
        let count = 0;
        for (let row of this.layout) {
            for (let cell of row) {
                if (cell === CELL_TYPE.DOT || cell === CELL_TYPE.POWER_PELLET) {
                    count++;
                }
            }
        }
        return count;
    }

    draw() {
        for (let row = 0; row < this.layout.length; row++) {
            for (let col = 0; col < this.layout[row].length; col++) {
                const cell = this.layout[row][col];
                const x = col * CELL_SIZE;
                const y = row * CELL_SIZE;

                switch (cell) {
                    case CELL_TYPE.WALL:
                        this.drawWall(x, y);
                        break;
                    case CELL_TYPE.DOT:
                        this.drawDot(x, y);
                        break;
                    case CELL_TYPE.POWER_PELLET:
                        this.drawPowerPellet(x, y);
                        break;
                }
            }
        }
    }

    drawWall(x, y) {
        this.ctx.fillStyle = WALL_COLOR;
        this.ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
    }

    drawDot(x, y) {
        this.ctx.fillStyle = DOT_COLOR;
        this.ctx.beginPath();
        this.ctx.arc(
            x + CELL_SIZE / 2,
            y + CELL_SIZE / 2,
            2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
    }

    drawPowerPellet(x, y) {
        this.ctx.fillStyle = PELLET_COLOR;
        this.ctx.beginPath();
        this.ctx.arc(
            x + CELL_SIZE / 2,
            y + CELL_SIZE / 2,
            6,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
    }

    isWall(x, y) {
        const col = Math.floor(x / CELL_SIZE);
        const row = Math.floor(y / CELL_SIZE);
        return this.layout[row][col] === CELL_TYPE.WALL;
    }

    eatDot(x, y) {
        const col = Math.floor(x / CELL_SIZE);
        const row = Math.floor(y / CELL_SIZE);
        if (this.layout[row][col] === CELL_TYPE.DOT) {
            this.layout[row][col] = CELL_TYPE.EMPTY;
            this.dotCount--;
            return POINTS.DOT;
        }
        return 0;
    }

    eatPowerPellet(x, y) {
        const col = Math.floor(x / CELL_SIZE);
        const row = Math.floor(y / CELL_SIZE);
        if (this.layout[row][col] === CELL_TYPE.POWER_PELLET) {
            this.layout[row][col] = CELL_TYPE.EMPTY;
            this.dotCount--;
            return POINTS.POWER_PELLET;
        }
        return 0;
    }

    reset() {
        // Reset the maze to its initial state
        this.layout = JSON.parse(JSON.stringify(this.layout));
        this.dotCount = this.countDots();
    }
} 
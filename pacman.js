class Pacman {
    constructor(ctx, maze) {
        this.ctx = ctx;
        this.maze = maze;
        this.reset();
    }

    reset() {
        // Starting position (center of the maze)
        this.x = 14 * CELL_SIZE;
        this.y = 23 * CELL_SIZE;
        this.direction = DIRECTIONS.RIGHT;
        this.nextDirection = DIRECTIONS.RIGHT;
        this.mouthAngle = 0.2;
        this.mouthOpen = true;
        this.animationSpeed = 0.1;
    }

    update() {
        // Update mouth animation
        this.mouthAngle = 0.2 + Math.abs(Math.sin(Date.now() * this.animationSpeed)) * 0.3;

        // Try to change direction if there's a queued direction
        if (this.nextDirection !== this.direction) {
            const nextX = this.x + this.nextDirection.x * PACMAN_SPEED;
            const nextY = this.y + this.nextDirection.y * PACMAN_SPEED;
            
            if (!this.maze.isWall(nextX, nextY)) {
                this.direction = this.nextDirection;
            }
        }

        // Move in current direction
        const nextX = this.x + this.direction.x * PACMAN_SPEED;
        const nextY = this.y + this.direction.y * PACMAN_SPEED;

        // Check for wall collision
        if (!this.maze.isWall(nextX, nextY)) {
            this.x = nextX;
            this.y = nextY;
        }

        // Handle tunnel wrapping
        if (this.x < 0) {
            this.x = this.ctx.canvas.width - CELL_SIZE;
        } else if (this.x >= this.ctx.canvas.width) {
            this.x = 0;
        }
    }

    draw() {
        this.ctx.save();
        this.ctx.translate(this.x + CELL_SIZE/2, this.y + CELL_SIZE/2);

        // Rotate based on direction
        const angle = {
            [DIRECTIONS.RIGHT.x + ',' + DIRECTIONS.RIGHT.y]: 0,
            [DIRECTIONS.DOWN.x + ',' + DIRECTIONS.DOWN.y]: Math.PI/2,
            [DIRECTIONS.LEFT.x + ',' + DIRECTIONS.LEFT.y]: Math.PI,
            [DIRECTIONS.UP.x + ',' + DIRECTIONS.UP.y]: -Math.PI/2
        }[this.direction.x + ',' + this.direction.y];

        this.ctx.rotate(angle);

        // Draw Pacman
        this.ctx.beginPath();
        this.ctx.arc(0, 0, CELL_SIZE/2, this.mouthAngle, -this.mouthAngle);
        this.ctx.lineTo(0, 0);
        this.ctx.fillStyle = '#FFFF00';
        this.ctx.fill();

        this.ctx.restore();
    }

    setDirection(direction) {
        this.nextDirection = direction;
    }

    getGridPosition() {
        return {
            x: Math.floor(this.x / CELL_SIZE),
            y: Math.floor(this.y / CELL_SIZE)
        };
    }

    checkCollision(ghost) {
        const distance = Math.hypot(ghost.x - this.x, ghost.y - this.y);
        return distance < CELL_SIZE;
    }
} 
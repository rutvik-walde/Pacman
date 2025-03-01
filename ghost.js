class Ghost {
    constructor(ctx, maze, startX, startY, color) {
        this.ctx = ctx;
        this.maze = maze;
        this.startX = startX;
        this.startY = startY;
        this.color = color;
        this.reset();
    }

    reset() {
        this.x = this.startX * CELL_SIZE;
        this.y = this.startY * CELL_SIZE;
        this.direction = DIRECTIONS.LEFT;
        this.isVulnerable = false;
        this.isEaten = false;
        this.speed = GHOST_SPEED;
    }

    update(pacmanX, pacmanY) {
        if (this.isEaten) {
            // Return to ghost house
            const homeX = 14 * CELL_SIZE;
            const homeY = 14 * CELL_SIZE;
            this.moveTowards(homeX, homeY);
            if (Math.abs(this.x - homeX) < 1 && Math.abs(this.y - homeY) < 1) {
                this.isEaten = false;
                this.isVulnerable = false;
            }
            return;
        }

        this.speed = this.isVulnerable ? GHOST_SCARED_SPEED : GHOST_SPEED;

        if (this.isVulnerable) {
            // Run away from Pacman
            this.moveRandomly();
        } else {
            // Chase Pacman
            const shouldChase = Math.random() < 0.7; // 70% chance to chase
            if (shouldChase) {
                this.moveTowards(pacmanX, pacmanY);
            } else {
                this.moveRandomly();
            }
        }
    }

    moveTowards(targetX, targetY) {
        const possibleDirections = this.getPossibleDirections();
        if (possibleDirections.length === 0) return;

        let bestDirection = possibleDirections[0];
        let shortestDistance = Infinity;

        for (const direction of possibleDirections) {
            const nextX = this.x + direction.x * this.speed;
            const nextY = this.y + direction.y * this.speed;
            const distance = Math.hypot(targetX - nextX, targetY - nextY);

            if (distance < shortestDistance) {
                shortestDistance = distance;
                bestDirection = direction;
            }
        }

        this.direction = bestDirection;
        this.move();
    }

    moveRandomly() {
        const possibleDirections = this.getPossibleDirections();
        if (possibleDirections.length === 0) return;

        // Don't reverse direction unless it's the only option
        const nonReverseDirs = possibleDirections.filter(dir => 
            !(dir.x === -this.direction.x && dir.y === -this.direction.y)
        );

        this.direction = nonReverseDirs.length > 0 
            ? nonReverseDirs[Math.floor(Math.random() * nonReverseDirs.length)]
            : possibleDirections[Math.floor(Math.random() * possibleDirections.length)];

        this.move();
    }

    move() {
        const nextX = this.x + this.direction.x * this.speed;
        const nextY = this.y + this.direction.y * this.speed;

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

    getPossibleDirections() {
        const directions = [];
        for (const dir of Object.values(DIRECTIONS)) {
            const nextX = this.x + dir.x * this.speed;
            const nextY = this.y + dir.y * this.speed;
            if (!this.maze.isWall(nextX, nextY)) {
                directions.push(dir);
            }
        }
        return directions;
    }

    draw() {
        this.ctx.save();
        this.ctx.translate(this.x + CELL_SIZE/2, this.y + CELL_SIZE/2);

        // Ghost body color
        this.ctx.fillStyle = this.isVulnerable 
            ? (Math.floor(Date.now() / 200) % 2 === 0 ? '#2121ff' : '#ffffff')
            : this.color;

        // Draw ghost body
        this.ctx.beginPath();
        this.ctx.arc(0, -2, CELL_SIZE/2, Math.PI, 0, false);
        this.ctx.lineTo(CELL_SIZE/2, CELL_SIZE/2);
        
        // Draw wavy bottom
        const waveHeight = 4;
        for (let i = 0; i < 3; i++) {
            const x = CELL_SIZE/2 - (i * CELL_SIZE/3);
            this.ctx.lineTo(x, CELL_SIZE/2);
            this.ctx.lineTo(x - CELL_SIZE/6, CELL_SIZE/2 - waveHeight);
        }
        
        this.ctx.lineTo(-CELL_SIZE/2, CELL_SIZE/2);
        this.ctx.closePath();
        this.ctx.fill();

        if (!this.isVulnerable) {
            // Draw eyes
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(-5, -5, 3, 0, Math.PI * 2);
            this.ctx.arc(5, -5, 3, 0, Math.PI * 2);
            this.ctx.fill();

            // Draw pupils
            this.ctx.fillStyle = '#000000';
            const pupilOffset = {
                [DIRECTIONS.RIGHT.x + ',' + DIRECTIONS.RIGHT.y]: [1, 0],
                [DIRECTIONS.DOWN.x + ',' + DIRECTIONS.DOWN.y]: [0, 1],
                [DIRECTIONS.LEFT.x + ',' + DIRECTIONS.LEFT.y]: [-1, 0],
                [DIRECTIONS.UP.x + ',' + DIRECTIONS.UP.y]: [0, -1]
            }[this.direction.x + ',' + this.direction.y] || [0, 0];

            this.ctx.beginPath();
            this.ctx.arc(-5 + pupilOffset[0] * 2, -5 + pupilOffset[1] * 2, 1.5, 0, Math.PI * 2);
            this.ctx.arc(5 + pupilOffset[0] * 2, -5 + pupilOffset[1] * 2, 1.5, 0, Math.PI * 2);
            this.ctx.fill();
        } else {
            // Draw scared face
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 1;
            
            // Eyes
            this.ctx.beginPath();
            this.ctx.moveTo(-5, -5);
            this.ctx.lineTo(-2, -2);
            this.ctx.moveTo(-2, -5);
            this.ctx.lineTo(-5, -2);
            
            this.ctx.moveTo(5, -5);
            this.ctx.lineTo(2, -2);
            this.ctx.moveTo(2, -5);
            this.ctx.lineTo(5, -2);
            
            // Mouth
            this.ctx.moveTo(-6, 2);
            this.ctx.lineTo(-4, 4);
            this.ctx.lineTo(-2, 2);
            this.ctx.lineTo(0, 4);
            this.ctx.lineTo(2, 2);
            this.ctx.lineTo(4, 4);
            this.ctx.lineTo(6, 2);
            
            this.ctx.stroke();
        }

        this.ctx.restore();
    }

    makeVulnerable() {
        this.isVulnerable = true;
        this.speed = GHOST_SCARED_SPEED;
    }

    eat() {
        this.isEaten = true;
        this.isVulnerable = false;
    }
} 
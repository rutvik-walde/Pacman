class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size based on maze dimensions
        this.canvas.width = 28 * CELL_SIZE;
        this.canvas.height = 31 * CELL_SIZE;
        
        this.score = 0;
        this.highScore = localStorage.getItem('pacmanHighScore') || 0;
        this.level = 1;
        this.lives = 3;
        this.gameState = GAME_STATES.READY;
        
        // Initialize game objects
        this.maze = new Maze(this.ctx);
        this.pacman = new Pacman(this.ctx, this.maze);
        this.ghosts = [
            new Ghost(this.ctx, this.maze, 14, 14, '#FF0000'), // Red
            new Ghost(this.ctx, this.maze, 14, 14, '#FFA500'), // Orange
            new Ghost(this.ctx, this.maze, 14, 14, '#FFB8FF'), // Pink
            new Ghost(this.ctx, this.maze, 14, 14, '#00FFFF')  // Cyan
        ];
        
        this.soundManager = new SoundManager();
        this.powerPelletTimer = null;
        
        this.setupEventListeners();
        this.showWelcomeScreen();
    }

    setupEventListeners() {
        // Handle keyboard input
        document.addEventListener('keydown', (e) => {
            if (this.gameState !== GAME_STATES.PLAYING) return;

            // Prevent default behavior for game controls
            if (KEYS.UP.includes(e.key) || KEYS.DOWN.includes(e.key) ||
                KEYS.LEFT.includes(e.key) || KEYS.RIGHT.includes(e.key) ||
                KEYS.PAUSE.includes(e.key)) {
                e.preventDefault();
            }

            if (KEYS.UP.includes(e.key)) this.pacman.setDirection(DIRECTIONS.UP);
            if (KEYS.DOWN.includes(e.key)) this.pacman.setDirection(DIRECTIONS.DOWN);
            if (KEYS.LEFT.includes(e.key)) this.pacman.setDirection(DIRECTIONS.LEFT);
            if (KEYS.RIGHT.includes(e.key)) this.pacman.setDirection(DIRECTIONS.RIGHT);
            if (KEYS.PAUSE.includes(e.key)) this.togglePause();
        });

        // Handle start button
        document.getElementById('start-button').addEventListener('click', () => {
            const playerName = document.getElementById('player-name').value.trim();
            if (playerName) {
                document.getElementById('player-name-display').textContent = playerName;
                this.startGame();
            } else {
                alert('Please enter your name!');
            }
        });

        // Handle restart button
        document.getElementById('restart-button').addEventListener('click', () => {
            this.resetGame();
            this.startGame();
        });
    }

    showWelcomeScreen() {
        document.getElementById('welcome-screen').classList.remove('hidden');
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('game-over-screen').classList.add('hidden');
    }

    showGameScreen() {
        document.getElementById('welcome-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
        document.getElementById('game-over-screen').classList.add('hidden');
    }

    showGameOverScreen() {
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('game-over-screen').classList.remove('hidden');
        document.getElementById('final-score').textContent = this.score;
    }

    startGame() {
        this.showGameScreen();
        this.gameState = GAME_STATES.PLAYING;
        this.soundManager.play('start');
        this.gameLoop();
    }

    resetGame() {
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.maze.reset();
        this.pacman.reset();
        this.ghosts.forEach(ghost => ghost.reset());
        this.updateUI();
    }

    gameLoop() {
        if (this.gameState !== GAME_STATES.PLAYING) return;

        // Clear canvas
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Update game objects
        this.update();

        // Draw game objects
        this.draw();

        // Request next frame
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        if (this.gameState !== GAME_STATES.PLAYING) return;

        // Update Pacman
        this.pacman.update();

        // Check for dot collection
        const points = this.maze.eatDot(this.pacman.x, this.pacman.y);
        if (points > 0) {
            this.score += points;
            this.soundManager.play('chomp');
        }

        // Check for power pellet collection
        const pelletPoints = this.maze.eatPowerPellet(this.pacman.x, this.pacman.y);
        if (pelletPoints > 0) {
            this.score += pelletPoints;
            this.soundManager.play('powerPellet');
            this.activatePowerPellet();
        }

        // Update ghosts
        this.ghosts.forEach(ghost => {
            ghost.update(this.pacman.x, this.pacman.y);

            // Check for collisions with ghosts
            if (this.pacman.checkCollision(ghost)) {
                if (ghost.isVulnerable) {
                    ghost.eat();
                    this.score += POINTS.GHOST;
                    this.soundManager.play('eatGhost');
                } else if (!ghost.isEaten) {
                    this.die();
                }
            }
        });

        // Check if level is complete
        if (this.maze.dotCount === 0) {
            this.levelComplete();
        }

        this.updateUI();
    }

    draw() {
        // Draw maze
        this.maze.draw();

        // Draw ghosts
        this.ghosts.forEach(ghost => ghost.draw());

        // Draw Pacman
        this.pacman.draw();

        // Draw lives
        this.drawLives();
    }

    drawLives() {
        const livesContainer = document.getElementById('lives');
        livesContainer.innerHTML = '';
        for (let i = 0; i < this.lives; i++) {
            const life = document.createElement('div');
            life.className = 'life';
            livesContainer.appendChild(life);
        }
    }

    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('pacmanHighScore', this.highScore);
        }
        document.getElementById('high-score').textContent = this.highScore;
    }

    activatePowerPellet() {
        this.ghosts.forEach(ghost => ghost.makeVulnerable());
        
        if (this.powerPelletTimer) {
            clearTimeout(this.powerPelletTimer);
        }
        
        this.powerPelletTimer = setTimeout(() => {
            this.ghosts.forEach(ghost => {
                if (!ghost.isEaten) ghost.isVulnerable = false;
            });
        }, POWER_PELLET_DURATION);
    }

    die() {
        this.soundManager.play('death');
        this.lives--;
        
        if (this.lives <= 0) {
            this.gameOver();
        } else {
            this.pacman.reset();
            this.ghosts.forEach(ghost => ghost.reset());
        }
    }

    gameOver() {
        this.gameState = GAME_STATES.GAME_OVER;
        this.soundManager.play('gameOver');
        this.showGameOverScreen();
    }

    levelComplete() {
        this.level++;
        this.maze.reset();
        this.pacman.reset();
        this.ghosts.forEach(ghost => {
            ghost.reset();
            ghost.speed += 0.1; // Increase ghost speed with each level
        });
    }

    togglePause() {
        if (this.gameState === GAME_STATES.PLAYING) {
            this.gameState = GAME_STATES.PAUSED;
            // Draw pause screen
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#FFD700';
            this.ctx.font = '40px "Press Start 2P"';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PAUSED', this.canvas.width/2, this.canvas.height/2);
        } else if (this.gameState === GAME_STATES.PAUSED) {
            this.gameState = GAME_STATES.PLAYING;
            this.gameLoop();
        }
    }
}

// Start the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Game();
}); 
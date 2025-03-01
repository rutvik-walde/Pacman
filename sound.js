class SoundManager {
    constructor() {
        this.sounds = {
            start: new Audio('assets/start.wav'),
            chomp: new Audio('assets/chomp.wav'),
            death: new Audio('assets/death.wav'),
            eatGhost: new Audio('assets/eat-ghost.wav'),
            powerPellet: new Audio('assets/power-pellet.wav'),
            gameOver: new Audio('assets/game-over.wav')
        };

        // Set volume for all sounds
        Object.values(this.sounds).forEach(sound => {
            sound.volume = 0.5;
        });

        // Preload all sounds
        this.preloadSounds();
    }

    preloadSounds() {
        Object.values(this.sounds).forEach(sound => {
            sound.load();
        });
    }

    play(soundName) {
        const sound = this.sounds[soundName];
        if (sound) {
            sound.currentTime = 0; // Reset the sound to start
            sound.play().catch(error => {
                console.log('Sound play failed:', error);
            });
        }
    }

    stop(soundName) {
        const sound = this.sounds[soundName];
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
        }
    }

    stopAll() {
        Object.values(this.sounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    }
} 
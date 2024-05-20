export class Opening extends Phaser.Scene {
    constructor() {
        super("Opening");
        this.enemyImg = null;
        this.playerImg = null;
        this.earthImg = null;
        this.messages = [
            "You: What a beautiful planet, I should take it over!",
            "Gargoth: Hey,HEY! That's my planet I am already in the process of conquering it!",
            "You: Oh? but you have not conquered it yet?",
            "Gargoth: Don't even think about it!",
            "You: I'm not thinking about it, I've decided!",
            "Gargoth: You know what fine, I'll let you conquer that planet but only if you defeat me. I'll even give you time to capture some humans for battle.",
            "You: I got this.",
            "Gargoth: but if you lose you can't return...",
            "I never lose.",
            "Neither do I ...",
        ];
        this.currentMessageIndex = 0;
        this.typingEvent = null;
        this.textBox = null;
        this.typingSpeed = 40;
        this.isTyping = false;
        this.enterKey = null;
        this.enterKeyActive = true;
        this.coordinates = [
            { x: 370, y: 700 },
            { x: 300, y: 300 },
        ];
        this.currentCoordinateIndex = 0;
        this.currentCoordinateIndex = 0;
    }

    preload() {
        this.load.audio(
            "bugsInTheAttic",
            import.meta.env.BASE_URL +
                "assets/sound/bugs-in-the-attic-matt-stewart-evans-main-version-14921-02-09.mp3"
        );

        this.load.image(
            "stars-bg",
            import.meta.env.BASE_URL + "assets/stars-bg.jpg"
        );
        this.load.image("earth", import.meta.env.BASE_URL + "assets/earth.png");
        this.load.image(
            "enemy-alien",
            import.meta.env.BASE_URL +
                "assets/characters/alien-imgs/alien-char-6.png"
        );
        this.load.image(
            "enemy-alien-2",
            import.meta.env.BASE_URL +
                "assets/characters/alien-imgs/alien-char-2.png"
        );
        this.load.image(
            "player-alien",
            import.meta.env.BASE_URL +
                "assets/characters/alien-imgs/alien-char-4.png"
        );
    }

    create() {
        const enemyAlienStartX = -300;
        let playerAlienStartX = 1000;

        this.music = this.sound.add("bugsInTheAttic");
        this.music.play();
        this.music.setLoop(true);

        this.add.image(400, 400, "stars-bg");
        this.earthImg = this.add.image(120, 640, "earth");
        this.enemyImg = this.add.image(enemyAlienStartX, 200, "enemy-alien");
        this.playerImg = this.add
            .image(playerAlienStartX, 550, "player-alien")
            .setFlipX(true);

        this.tweens.add({
            targets: this.playerImg,
            x: 600,
            duration: 1000,
            ease: "Power2",
            delay: 1500,
            onComplete: () => {
                playerAlienStartX = 600;
            },
        });

        this.tweens.add({
            targets: this.enemyImg,
            x: 200,
            duration: 1000,
            ease: "Power2",
            delay: 5000,
        });

        this.textBox = this.add.text(
            this.coordinates[this.currentCoordinateIndex].x,
            this.coordinates[this.currentCoordinateIndex].y,
            "",
            {
                fontSize: "24px",
                fill: "#ffffff",
                wordWrap: { width: 400 },
            }
        );

        // Set up Enter key input
        this.enterKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ENTER
        );

        setTimeout(() => {
            this.typeMessage();
        }, 3000);

        const skipButton = this.add.text(700, 50, "Skip", {
            fontSize: "32px",
            fill: "#ffffff",
        });

        skipButton.setInteractive();
        skipButton.on("pointerdown", () => {
            this.scene.start("Game");
        });
    }

    typeMessage() {
        if (this.currentMessageIndex >= this.messages.length) {
            return;
        }

        const message = this.messages[this.currentMessageIndex];
        this.textBox.setText("");
        let charIndex = 0;

        // Update text box coordinates
        this.textBox.setPosition(
            this.coordinates[this.currentCoordinateIndex].x,
            this.coordinates[this.currentCoordinateIndex].y
        );

        // Switch to the next coordinate set
        this.currentCoordinateIndex =
            (this.currentCoordinateIndex + 1) % this.coordinates.length;

        this.isTyping = true;
        this.enterKeyActive = false; // Disable Enter key

        if (this.currentMessageIndex === 5) {
            this.enemyImg.destroy();
            this.enemyImg = this.add.image(-300, 200, "enemy-alien-2");

            this.tweens.add({
                targets: this.enemyImg,
                x: 200,
                duration: 1000,
                ease: "Power2",
                delay: 0,
            });
        }

        setTimeout(() => {}, 2000);
        this.typingEvent = this.time.addEvent({
            delay: this.typingSpeed,
            callback: () => {
                if (charIndex < message.length) {
                    this.textBox.setText(
                        this.textBox.text + message[charIndex]
                    );
                    charIndex++;
                } else {
                    this.isTyping = false;
                    this.enterKeyActive = true; // Enable Enter key
                    this.typingEvent.remove();
                }
            },
            loop: true,
        });

        if (this.currentMessageIndex >= this.messages.length - 1) {
            const bounceDelay = 1500;
            const fallDelay = 2000;
            const destroyImagesDelay = 3000;
            const textFadeDelay = 3500;
            const textDestroyDelay = 4500;
            const startNextSceneDelay = 5700;

            this.tweens.add({
                targets: this.playerImg,
                y: "-=100",
                duration: 1000,
                yoyo: true,
                repeat: 0,
                delay: bounceDelay,
            });

            // Bounce animation for enemy alien
            this.tweens.add({
                targets: this.enemyImg,
                y: "-=100",
                duration: 1000,
                yoyo: true,
                repeat: 0,
                delay: bounceDelay,
            });

            // Bounce animation for earth
            this.tweens.add({
                targets: this.earthImg,
                y: "-=100",
                duration: 1000,
                yoyo: true,
                repeat: 0,
                delay: bounceDelay,
            });

            this.tweens.add({
                targets: this.playerImg,
                y: 1000,
                ease: "Power2",
                duration: 1000,
                delay: fallDelay,
            });

            // Bounce animation for enemy alien
            this.tweens.add({
                targets: this.enemyImg,
                y: 1000,
                ease: "Power2",
                duration: 1000,
                delay: fallDelay,
            });

            // Bounce animation for earth
            this.tweens.add({
                targets: this.earthImg,
                y: 1000,
                ease: "Power2",
                duration: 1000,
                delay: fallDelay,
            });

            setTimeout(() => {
                this.enemyImg.destroy();
                this.playerImg.destroy();
                this.earthImg.destroy();
            }, destroyImagesDelay);

            this.tweens.add({
                targets: this.textBox,
                alpha: 0, // Fade out to invisible
                duration: 1000, // Duration of fade out
                delay: textFadeDelay,
                onComplete: () => {
                    this.textBox.setAlpha(1);
                },
            });

            setTimeout(() => {
                this.textBox.destroy();
            }, textDestroyDelay);

            setTimeout(() => {
                this.scene.start("Game");
            }, startNextSceneDelay);
        }
    }

    update(time, delta) {
        if (this.earthImg) {
            this.earthImg.rotation += 0.01; // Adjust the rotation speed as needed
        }

        if (
            this.enterKeyActive &&
            Phaser.Input.Keyboard.JustDown(this.enterKey) &&
            !this.isTyping
        ) {
            this.currentMessageIndex++;
            this.typeMessage();
        }
    }

    // endScene() {
    //     this.tweens.add({
    //         targets: this.playerImg,
    //         y: "-=50", // Move up by 50 pixels
    //         duration: 500, // Duration of the upward movement
    //         yoyo: true, // Yoyo effect, moves back to the original position
    //         repeat: 0, // Repeat 0 times (plays only once)
    //     });

    //     // Bounce animation for enemy alien
    //     this.tweens.add({
    //         targets: this.enemyImg,
    //         y: "-=50", // Move up by 50 pixels
    //         duration: 500, // Duration of the upward movement
    //         yoyo: true, // Yoyo effect, moves back to the original position
    //         repeat: 0, // Repeat 0 times (plays only once)
    //     });

    //     // Bounce animation for earth
    //     this.tweens.add({
    //         targets: this.earthImg,
    //         y: "-=50", // Move up by 50 pixels
    //         duration: 500, // Duration of the upward movement
    //         yoyo: true, // Yoyo effect, moves back to the original position
    //         repeat: 0, // Repeat 0 times (plays only once)
    //     });
    // }
}

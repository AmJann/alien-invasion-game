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
        this.messageComplete = false;
        this.coordinates = [
            { x: 370, y: 700 },
            { x: 300, y: 300 },
        ];
        this.currentCoordinateIndex = 0;
        this.music = null;
        this.skipButton = null;
        this.closingAnimationTriggered = false;
        this.newGameButton = null;
        this.resumeButton = null;
        this.newGame = false;
        this.newGameButtonBackground = null;
        this.resumeButtonBackground = null;
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
        this.add.image(400, 400, "stars-bg");
        this.earthImg = this.add.image(120, 640, "earth");

        this.showButtons();

        this.enterKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ANY
        );

        this.enterKeyActive = true;
    }

    showButtons() {
        let playerData = localStorage.getItem("playerData");
        if (playerData) {
            this.resumeButtonBackground = this.add.graphics();
            this.resumeButtonBackground.fillStyle(0x000120, 0.5);
            this.resumeButtonBackground.fillRect(300, 377, 200, 50);

            this.resumeButton = this.add
                .text(400, 400, "Resume", {
                    fontSize: "32px",
                    fill: "#ffffff",
                })
                .setOrigin(0.5)
                .setAlpha(0);

            this.tweens.add({
                targets: this.resumeButton,
                alpha: 1,
                duration: 1000,
                ease: "Power2",
                delay: 200,
            });

            this.resumeButton.setInteractive();
            this.resumeButton.on("pointerdown", () => {
                this.scene.start("Game");
            });
            this.resumeButton
                .on("pointerover", () => {
                    this.resumeButton
                        .setStyle({ fill: "#ff0000" })
                        .setStroke("#ff0000", 2);
                })
                .setStroke("#ffffff", 2);
            this.resumeButton.on("pointerout", () => {
                this.resumeButton
                    .setStyle({ fill: "#ffffff" })
                    .setStroke("#ffffff", 2);
            });
        }

        this.newGameButtonBackground = this.add.graphics();
        this.newGameButtonBackground.fillStyle(0x000120, 0.5);
        this.newGameButtonBackground.fillRect(300, 277, 200, 50);

        this.newGameButton = this.add
            .text(400, 300, "New Game", {
                fontSize: "32px",
                fill: "#ffffff",
            })
            .setOrigin(0.5)
            .setAlpha(0)
            .setStroke("#ffffff", 1);

        this.tweens.add({
            targets: this.newGameButton,
            alpha: 1,
            duration: 1000,
            ease: "Power2",
        });

        this.newGameButton.setInteractive();
        this.newGameButton.on("pointerdown", () => {
            localStorage.clear();
            this.newGame = true;
            this.startOpeningSequence();
        });
        this.newGameButton
            .on("pointerover", () => {
                this.newGameButton
                    .setStyle({ fill: "#ff0000" })
                    .setStroke("#ff0000", 2);
            })
            .setStroke("#ffffff", 2);
        this.newGameButton.on("pointerout", () => {
            this.newGameButton
                .setStyle({ fill: "#ffffff" })
                .setStroke("#ffffff", 2);
        });
    }

    startOpeningSequence() {
        this.tweens.add({
            targets: this.newGameButton,
            alpha: 0,
            duration: 1500,
            delay: 0,
        });

        if (this.resumeButton) {
            this.tweens.add({
                targets: this.resumeButton,
                alpha: 0,
                duration: 1500,
                delay: 0,
            });
            this.resumeButtonBackground.clear();
        }

        this.newGameButtonBackground.clear();

        const enemyAlienStartX = -300;
        let playerAlienStartX = 1000;

        this.enemyImg = this.add.image(enemyAlienStartX, 200, "enemy-alien");
        this.playerImg = this.add
            .image(playerAlienStartX, 550, "player-alien")
            .setFlipX(true);

        this.music = this.sound.add("bugsInTheAttic");
        this.music.play();
        this.music.setLoop(true);

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

        this.textBackground = this.add.graphics();

        this.textBox = this.add.text(
            this.coordinates[this.currentCoordinateIndex].x,
            this.coordinates[this.currentCoordinateIndex].y,
            "",
            {
                fontSize: "20px",
                fill: "#ffffff",
                fontFamily: "Courier",
                wordWrap: { width: 400 },
            }
        );

        this.input.keyboard.on("keydown", (event) => {
            if (this.enterKeyActive && !this.isTyping) {
                this.currentMessageIndex++;
                this.typeMessage();
            }
        });
        this.enterKeyActive = false;
        setTimeout(() => {
            this.typeMessage();

            this.messageComplete = false;
        }, 3000);

        this.skipButton = this.add.text(700, 50, "Skip", {
            fontSize: "32px",
            fill: "#ffffff",
        });

        this.skipButton.setInteractive();
        this.skipButton.on("pointerdown", () => {
            this.triggerClosingAnimations();
        });
    }

    typeMessage() {
        if (this.currentMessageIndex >= this.messages.length) {
            this.triggerClosingAnimations();
            return;
        }

        const message = this.messages[this.currentMessageIndex];
        this.textBox.setText("");
        let charIndex = 0;

        const textPosition = this.coordinates[this.currentCoordinateIndex];
        this.textBox.setPosition(textPosition.x, textPosition.y);

        const textWidth = 400;
        const textHeight = 100;

        if (!this.textBackground) {
            this.textBackground = this.add.graphics();
        }

        this.textBackground.clear();

        this.textBackground.fillStyle(0x000000, 0.5);

        this.textBackground.fillRect(
            textPosition.x - 10,
            textPosition.y - 10,
            textWidth + 20,
            textHeight + 20
        );

        this.currentCoordinateIndex =
            (this.currentCoordinateIndex + 1) % this.coordinates.length;

        this.isTyping = true;
        this.enterKeyActive = false;

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
                    this.enterKeyActive = true;
                    this.typingEvent.remove();
                }
            },
            loop: true,
            onComplete: (this.messageComplete = true),
        });
    }

    triggerClosingAnimations() {
        if (this.closingAnimationTriggered) {
            return;
        }
        this.closingAnimationTriggered = true;
        this.closingAnimations();
    }

    closingAnimations() {
        const bounceDelay = 1500;
        const fallDelay = 2000;
        const destroyImagesDelay = 3000;
        const textFadeDelay = 3500;
        const textDestroyDelay = 4500;
        const startNextSceneDelay = 5700;

        this.tweens.add({
            targets: this.textBackground,
            alpha: 0,
            duration: 1000,
            ease: "Power2",
        });

        this.tweens.add({
            targets: this.skipButton,
            alpha: 0,
            duration: 1000,
            ease: "Power2",
        });

        this.tweens.add({
            targets: this.playerImg,
            y: "-=100",
            duration: 1000,
            yoyo: true,
            repeat: 0,
            delay: bounceDelay,
        });

        this.tweens.add({
            targets: this.enemyImg,
            y: "-=100",
            duration: 1000,
            yoyo: true,
            repeat: 0,
            delay: bounceDelay,
        });

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

        this.tweens.add({
            targets: this.enemyImg,
            y: 1000,
            ease: "Power2",
            duration: 1000,
            delay: fallDelay,
        });

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
            alpha: 0,
            duration: 1000,
            delay: textFadeDelay,
            onComplete: () => {
                this.textBox.setAlpha(1);
            },
        });

        setTimeout(() => {
            this.textBox.destroy();
        }, textDestroyDelay);

        setTimeout(() => {
            this.music.destroy();
            this.scene.start("Game");
        }, startNextSceneDelay);
    }

    update() {
        if (this.earthImg) {
            this.earthImg.rotation += 0.01;
        }

        if (
            this.newGame &&
            this.enterKeyActive &&
            Phaser.Input.Keyboard.JustDown(this.enterKey) &&
            !this.isTyping
        ) {
            this.currentMessageIndex++;
            this.typeMessage();
        }
    }
}

export class Fight extends Phaser.Scene {
    constructor() {
        super("Fight");
    }

    preload() {
        // Preload images
        this.load.image(
            "water_field_bg",
            import.meta.env.BASE_URL + "assets/water_field_bg.jpg"
        );
        this.load.image(
            "clown",
            import.meta.env.BASE_URL +
                "assets/characters/humans/no-bg-imgs/clown-char-14-250.png"
        );
        this.load.image(
            "scientist",
            import.meta.env.BASE_URL +
                "assets/characters/humans/no-bg-imgs/scientist-char-4-250.png"
        );
    }

    init(data) {
        // Access the passed data object here
        this.playerPosition = data.playerPosition;
    }

    create() {
        // Add background image
        this.add.image(400, 400, "water_field_bg");

        //container for player stats (health, name)
        this.playerInfoContainer = this.add.container(150, 670);

        // health bar
        this.playerHealthBar = this.add.graphics();
        this.playerHealthBar.fillStyle(0xff0000, 1);
        this.playerHealthBar.fillRect(0, 0, 200, 20);

        // text and styling for players name
        this.playerNameText = this.add.text(0, 25, "Scientist", {
            font: "courier",
            fontSize: "24px",
            fontStyle: "strong",
            fill: "#000000",
            strokeThickness: "3",
        });
        this.playerNameText.setFontStyle("bold");
        this.playerNameText.setFontSize("20px");

        // add health bar and name to container
        this.playerInfoContainer.add([
            this.playerNameText,
            this.playerHealthBar,
        ]);

        //next blocks of code are the same as player healthbar and name but for enemy.
        // Only coordinates are different

        this.enemyInfoContainer = this.add.container(450, 100);

        this.enemyHealthBar = this.add.graphics();
        this.enemyHealthBar.fillStyle(0xff0000, 1);
        this.enemyHealthBar.fillRect(0, 0, 200, 20);
        this.enemyHealthBar.fill;

        this.enemyNameText = this.add.text(0, 25, "Clown", {
            font: "courier",
            fontSize: "24px",
            fontStyle: "strong",
            fill: "#000000",
            strokeThickness: "3",
        });

        this.enemyNameText.setFontStyle("bold");
        this.enemyNameText.setFontSize("20px");

        this.enemyInfoContainer.add([this.enemyNameText, this.enemyHealthBar]);

        const clownStartX = -300;
        const scientistStartX = 1100;
        const startYClown = 290;
        const startYScientist = 520;

        // Add human images at starting positions
        const clown = this.add.image(clownStartX, startYClown, "clown", 0);
        const scientist = this.add.image(
            scientistStartX,
            startYScientist,
            "scientist",
            0
        );

        // Tween animations for character movement
        this.tweens.add({
            targets: clown,
            x: 550,
            duration: 1000,
            ease: "Power2",
            delay: 1000,
        });

        this.tweens.add({
            targets: scientist,
            x: 250,
            duration: 1000,
            ease: "Power2",
            delay: 1500,
            onComplete: () => {
                // we can put game logic here after the human images finish transition
            },
        });
        this.time.delayedCall(6000, () => {
            this.returnToGameScene();
        });
    }

    returnToGameScene() {
        // Fade out the camera
        this.cameras.main.fadeOut(1200, 0, 0, 0, (camera, progress) => {
            if (progress === 1) {
                // Retrieve player position from the data object
                const playerX = this.playerPosition.x;
                const playerY = this.playerPosition.y;

                // Set player position in the Game scene
                const gameScene = this.scene.get("Game");
                if (gameScene && gameScene.player) {
                    gameScene.player.setPosition(playerX, playerY);
                } else {
                    console.error("Game scene or player not found.");
                }

                // Transition back to the Game scene
                this.scene.start("Game", {
                    playerPosition: this.playerPosition,
                });
            }
        });
    }
}

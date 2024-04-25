import humans from "../humans.js";

export class Fight extends Phaser.Scene {
    constructor() {
        super("Fight");
        this.humans = humans;
        this.enemy = null;
    }

    preload() {
        let randomNum = Math.floor(Math.random() * humans.length);
        this.enemy = humans[randomNum];
        console.log(import.meta.env.BASE_URL + this.enemy.mainImage);

        // Preload images
        this.load.image(
            "water_field_bg",
            import.meta.env.BASE_URL + "assets/water_field_bg.jpg"
        );
        this.load.image(
            this.enemy.name,
            import.meta.env.BASE_URL + this.enemy.mainImage
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
        console.log("here", this.humans);

        const playerNameHealthBackground = this.add.rectangle(
            280,
            210,
            250,
            80,
            0x000000,
            0.5
        );

        const enemyNameHealthBackground = this.add.rectangle(
            550,
            560,
            250,
            80,
            0x000000,
            0.5
        );

        const buttonBackground = this.add.rectangle(
            400,
            720,
            600,
            200,
            0x000000,
            0.3
        );

        //container for player stats (health, name)
        this.playerInfoContainer = this.add.container(450, 540);

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

        //next blocks of code are the same as player healthbar and name but for enemy. Only coordinates are different
        this.enemyInfoContainer = this.add.container(170, 190);

        this.enemyHealthBar = this.add.graphics();
        this.enemyHealthBar.fillStyle(0xff0000, 1);
        this.enemyHealthBar.fillRect(0, 0, 200, 20);

        this.enemyNameText = this.add.text(0, 25, this.enemy.name, {
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
        const startYScientist = 480;

        // Add human images at starting positions
        const enemy = this.add.image(
            clownStartX,
            startYClown,
            this.enemy.name,
            0
        );
        const scientist = this.add.image(
            scientistStartX,
            startYScientist,
            "scientist",
            0
        );

        // Tween animations for character movement
        this.tweens.add({
            targets: enemy,
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
        this.time.delayedCall(60000, () => {
            this.returnToGameScene();
        });

        this.createActionButton("Attack", 250, 660, () => this.attack());
        this.createActionButton("Switch Human", 500, 660, () =>
            this.switchHuman()
        );
        this.createActionButton("Item", 250, 735, () => this.useItem());
        this.createActionButton("Run", 500, 735, () => this.run());
    }

    createActionButton(text, x, y, callback) {
        // Create a text button for an action
        const button = this.add
            .text(x, y, text, { fill: "#ffffff" })
            .setInteractive()
            .on("pointerdown", callback);

        // Style the button
        button.setPadding(15, 10, 15, 10);
        button.setBackgroundColor("#333333");
        button.setStroke("#ffffff", 2);

        // Center the button's origin
        button.setOrigin(0.5);

        // Add hover effect
        button.on("pointerover", () => button.setBackgroundColor("#555555"));
        button.on("pointerout", () => button.setBackgroundColor("#333333"));

        return button;
    }

    attack() {
        // attack logic here
    }

    switchHuman() {
        //switch out human here
    }

    useItem() {
        // use item logic here
    }

    run() {
        let randomNum = Math.floor(Math.random() * 11);
        if (randomNum > 5) {
            this.returnToGameScene();
        } else {
            console.log("miss");
        }
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

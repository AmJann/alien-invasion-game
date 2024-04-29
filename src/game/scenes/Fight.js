import humans from "../humans";
import { Player } from "../sprites/Player.js";

export class Fight extends Phaser.Scene {
    constructor() {
        super("Fight");
        this.humans = humans;
        this.enemy = null;
        this.player = null;
        this.attackTween = null;
        this.playerImg = null;
        this.enemyImg = null;
        this.playerTurn = true;
        this.playerCurrentHuman = null;
        this.currentPlayerAttack = null;
    }

    init(data) {
        // Access the passed data object here
        this.playerPosition = data.playerPosition;
        this.player = data.player;
    }

    preload() {
        let randomNum = Math.floor(Math.random() * humans.length);
        this.enemy = humans[randomNum];
        console.log("preload enemy", this.enemy);
        console.log(import.meta.env.BASE_URL + this.enemy.mainImage);
        this.playerCurrentHuman = this.player.inventory[0];
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
            this.player.inventory[0].name,
            import.meta.env.BASE_URL + this.player.inventory[0]["mainImage"]
        );
    }

    create() {
        console.log(this.player);
        // Add background image
        this.add.image(400, 400, "water_field_bg");

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
        this.playerNameText = this.add.text(
            0,
            25,
            this.player.inventory[0]["name"],
            {
                font: "courier",
                fontSize: "24px",
                fontStyle: "strong",
                fill: "#000000",
                strokeThickness: "3",
            }
        );
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

        const enemyStartX = -300;
        let playerStartX = 1100;
        const enemyStartY = 290;
        const playerStartY = 480;

        // Add human images at starting positions
        this.enemyImg = this.add.image(
            enemyStartX,
            enemyStartY,
            this.enemy.name,
            0
        );
        this.playerImg = this.add
            .image(
                playerStartX,
                playerStartY,
                this.player.inventory[0]["name"],
                0
            )
            .setFlipX(true);

        // Tween animations for character movement
        this.tweens.add({
            targets: this.enemyImg,
            x: 550,
            duration: 1000,
            ease: "Power2",
            delay: 1000,
        });

        // Create a tween for the sprite

        this.tweens.add({
            targets: this.playerImg,
            x: 250,
            duration: 1000,
            ease: "Power2",
            delay: 1500,
            onComplete: () => {
                playerStartX = 250;
            },
        });

        this.time.delayedCall(60000, () => {
            this.returnToGameScene();
        });

        this.createActionButton("Attack", 400, 660, () => this.attack());
        this.createActionButton("Switch Human", 570, 660, () =>
            this.switchHuman()
        );
        this.createActionButton("Item", 400, 735, () => this.useItem());
        this.createActionButton("Run", 570, 735, () => this.run());
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

    battle() {
        let playerTurn = true;
        if (playerTurn === true) {
        } else {
            button.off();
        }
    }

    computerAttack() {
        //computer attacks after player with 3 second delay
        this.attackTween = this.tweens.add({
            targets: this.enemyImg,
            x: 340,
            y: 450,
            delay: 3000,
            duration: 150,
            ease: "Linear",
            yoyo: true,
            repeat: 0,
            onComplete: () => {},
        });
    }

    createAttackMenu() {
        // Create a container for the attack menu
        this.attackMenuContainer = this.add.container(223, 695);

        // Add background for the attack menu
        const menuBackground = this.add.rectangle(0, 0, 210, 150, 0x333333);
        this.attackMenuContainer.add(menuBackground);

        // Add attack options
        const attack1 = this.createAttackOption(
            0,
            -40,
            this.playerCurrentHuman.attack1["name"]
        );
        const attack2 = this.createAttackOption(
            0,
            0,
            this.playerCurrentHuman.attack2["name"]
        );
        const special = this.createAttackOption(
            0,
            40,
            this.playerCurrentHuman.special["name"]
        );

        // Add attack options to the container
        this.attackMenuContainer.add([attack1, attack2, special]);

        attack1.setInteractive();
        attack2.setInteractive();
        special.setInteractive();

        //sets current attack to be able to apply damage
        attack1.on("pointerdown", () =>
            this.performAttack(
                (this.currentPlayerAttack = this.player.inventory[0].attack1)
            )
        );
        attack2.on("pointerdown", () =>
            this.performAttack(
                (this.currentPlayerAttack = this.player.inventory[0].attack2)
            )
        );
        special.on("pointerdown", () =>
            this.performAttack(
                (this.currentPlayerAttack = this.player.inventory[0].special)
            )
        );

        // Add the attack menu to the scene
        this.add.existing(this.attackMenuContainer);
    }

    createAttackOption(x, y, text) {
        const attackOption = this.add.text(x, y, text, { fill: "#ffffff" });

        attackOption.setPadding(10, 5, 10, 5);

        attackOption.setOrigin(0.5);

        attackOption.on("pointerover", () =>
            attackOption.setBackgroundColor("#555555")
        );
        attackOption.on("pointerout", () =>
            attackOption.setBackgroundColor("#333333")
        );

        return attackOption;
    }

    attack() {
        // Create and show the attack menu
        this.createAttackMenu();
    }

    performAttack(attackName) {
        this.playerImg.x = 250;
        //hide/destroy attack menu
        this.attackMenuContainer.destroy();

        this.attackTween = this.tweens.add({
            targets: this.playerImg,
            x: 530,
            y: 270,
            duration: 150,
            ease: "Linear",
            yoyo: true,
            repeat: 0,
            onComplete: () => {
                const damage = this.currentPlayerAttack.damage;
                this.reduceEnemyHealth(damage);

                if (this.enemy.health <= 0) {
                    // Handle enemy defeat
                } else {
                    this.computerAttack();
                }
            },
        });
    }

    reduceEnemyHealth(damage) {
        // Reduce enemy health

        console.log("attack enemy", this.enemy);
        this.enemy.health -= damage;

        // Update enemy health bar display
        const newWidth = (this.enemy.health / this.enemy.maxHealth) * 200;
        this.enemyHealthBar.clear();
        this.enemyHealthBar.fillStyle(0xff0000, 1);
        this.enemyHealthBar.fillRect(0, 0, newWidth, 20);
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

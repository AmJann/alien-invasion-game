import {
    Human,
    Clown,
    Scientist,
    Firefighter,
    Farmer,
    NuckChorris,
} from "../humans";
import { Player } from "../sprites/Player.js";
let hurtAnimationRan = false;
let hurtAnimationPlayerRan = false;
const humans = [
    new Clown(),
    new Scientist(),
    new Firefighter(),
    new Farmer(),
    new NuckChorris(),
];

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
        this.music = null;
        this.switchHumanContainer = null;
        this.attackMenuContainer = null;
        this.itemMenuContainer = null;
    }

    init(data) {
        // Access the passed data object here
        this.playerPosition = data.playerPosition;
        this.player = data.player;
    }

    debug() {
        console.log("hello");
        console.log(this);
    }

    preload() {
        this.load.audio(
            "runRiot",
            import.meta.env.BASE_URL +
                "assets/sound/run-riot-matt-stewart-evans-main-version-02-03-14904.mp3"
        );

        let randomNum = Math.floor(Math.random() * humans.length);
        this.enemy = humans[randomNum];

        if (this.enemy.health < this.enemy.maxHealth) {
            this.enemy.health = this.enemy.maxHealth;
            // console.log(this.enemy.health);
        }

        const classMapping = {
            Clown: Clown,
            Scientist: Scientist,
            Firefighter: Firefighter,
            Farmer: Farmer,
            NuckChorris: NuckChorris,
        };

        // Retrieve player data from local storage
        const playerData = this.player.loadPlayerData();

        if (playerData) {
            // Iterate over the saved inventory and recreate the humans
            this.player.inventory = playerData.map((humanData) => {
                // Use the mapping object to retrieve the class object based on the class name
                const HumanClass = classMapping[humanData.name];
                // Check if the class object exists in the mapping
                if (HumanClass) {
                    // Instantiate the class object
                    return new HumanClass();
                } else {
                    // Handle case where class object is not found
                    console.error(
                        `Class object not found for class name: ${humanData.name}`
                    );
                    return null; // or handle differently based on your application's logic
                }
            });
        }
        this.playerCurrentHuman = this.player.inventory[0];
        if (this.playerCurrentHuman.health <= 0) {
            this.playerCurrentHuman.health = this.playerCurrentHuman.maxHealth;
            // console.log(this.playerCurrentHuman.health);
        }

        if (this.enemy.health <= 0) {
            this.enemy.health = this.enemy.maxHealth;
            // console.log(this.enemy.health);
        }
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
            this.enemy.defeatImage.name,
            import.meta.env.BASE_URL + this.enemy.defeatImage.path
        );
        this.load.image(
            this.enemy.hurtImage.name,
            import.meta.env.BASE_URL + this.enemy.hurtImage.path
        );
        this.load.image(
            this.playerCurrentHuman.hurtImage.name,
            import.meta.env.BASE_URL + this.playerCurrentHuman.hurtImage.path
        );
        this.load.image(
            this.playerCurrentHuman.defeatImage.name,
            import.meta.env.BASE_URL + this.playerCurrentHuman.defeatImage.path
        );
        this.load.image(
            this.playerCurrentHuman.name,
            import.meta.env.BASE_URL + this.playerCurrentHuman["mainImage"]
        );
    }

    create() {
        console.log(this.player);
        // Add background image
        this.add.image(400, 400, "water_field_bg");

        this.music = this.sound.add("runRiot");
        this.music.play();
        this.music.setLoop(true);

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

        this.updatePlayerHealth();
        // text and styling for players name
        this.playerNameText = this.add.text(
            0,
            25,
            this.playerCurrentHuman["name"],
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
        let playerStartX = 800;
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
                this.playerCurrentHuman["name"],
                0
            )
            .setFlipX(true);

        // Tween animations for character movement
        this.tweens.add({
            targets: this.enemyImg,
            x: 550,
            duration: 1000,
            ease: "Power2",
            delay: 500,
        });

        // Create a tween for the sprite

        this.tweens.add({
            targets: this.playerImg,
            x: 250,
            duration: 1000,
            ease: "Power2",
            delay: 0,
            onComplete: () => {
                playerStartX = 250;
            },
        });

        this.attackButton = this.createActionButton("Attack", 400, 660, () =>
            this.attack()
        );
        this.switchButton = this.createActionButton(
            "Switch Human",
            570,
            660,
            () => this.switch()
        );
        this.itemButton = this.createActionButton("Item", 400, 735, () =>
            this.createItemMenu()
        );
        this.runButton = this.createActionButton("Run", 570, 735, () =>
            this.run()
        );
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
        // Disable buttons at the start of the enemy's turn
        this.disableButtons();

        // Example enemy turn logic
        setTimeout(() => {
            // Perform enemy's attack logic here

            // Re-enable buttons at the end of the enemy's turn
            this.enableButtons();
        }, 3000); // Adjust delay as needed
    }

    disableButtons() {
        // Disable all action buttons
        this.attackButton.disableInteractive();
        this.switchButton.disableInteractive();
        this.itemButton.disableInteractive();
        this.runButton.disableInteractive();
        this.attackButton.setBackgroundColor("#555555");
        this.switchButton.setBackgroundColor("#555555");
        this.itemButton.setBackgroundColor("#555555");
        this.runButton.setBackgroundColor("#555555");
    }

    enableButtons() {
        // Enable all action buttons
        this.attackButton.setInteractive();
        this.switchButton.setInteractive();
        this.itemButton.setInteractive();
        this.runButton.setInteractive();
        this.attackButton.setBackgroundColor("#333333");
        this.switchButton.setBackgroundColor("#333333");
        this.itemButton.setBackgroundColor("#333333");
        this.runButton.setBackgroundColor("#333333");
    }
    randomCompAttack() {
        const attacks = [
            this.enemy.attack1,
            this.enemy.attack2,
            this.enemy.special,
        ];
        const randomAttackIndex = Math.floor(Math.random() * 3);
        // console.log(attacks);
        const selectedAttack = attacks[randomAttackIndex];
        return selectedAttack;
    }

    computerAttack() {
        //computer attacks after player with 3 second delay
        // Disable all action buttons
        this.disableButtons();

        this.attackTween = this.tweens.add({
            targets: this.enemyImg,
            x: 340,
            y: 450,
            delay: 2000,
            duration: 150,
            ease: "Linear",
            yoyo: true,
            repeat: 0,
            onComplete: () => {
                this.enableButtons();
                let attack = this.randomCompAttack();
                this.reducePlayerHealth(attack["damage"]);
            },
        });
    }

    // reducePlayerHealth(damage) {
    //     // console.log("enemy", this.enemy);
    //     // console.log("player", this.playerCurrentHuman.health);
    //     // Reduce player health
    //     this.playerCurrentHuman.health -= damage;

    //     // Update player health bar display
    //     const newWidth =
    //         (this.playerCurrentHuman.health /
    //             this.playerCurrentHuman.maxHealth) *
    //         200;
    //     this.playerHealthBar.clear();
    //     this.playerHealthBar.fillStyle(0xff0000, 1);
    //     if (this.playerCurrentHuman.health >= 0) {
    //         this.playerHealthBar.fillRect(0, 0, newWidth, 20);
    //     }
    //     // console.log("playerCurrentHuman", this.playerCurrentHuman.health);
    // }

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
                (this.currentPlayerAttack = this.playerCurrentHuman.attack1)
            )
        );

        attack2.on("pointerdown", () =>
            this.performAttack(
                (this.currentPlayerAttack = this.playerCurrentHuman.attack2)
            )
        );
        special.on("pointerdown", () =>
            this.performAttack(
                (this.currentPlayerAttack = this.playerCurrentHuman.special)
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
        if (this.attackMenuContainer) {
            this.attackMenuContainer.destroy();
            this.attackMenuContainer = null;
        } else {
            this.createAttackMenu();
        }

        if (this.switchHumanContainer) {
            this.switchHumanContainer.destroy();
            this.switchHumanContainer = null;
        }

        if (this.itemMenuContainer) {
            this.itemMenuContainer.destroy();
            this.itemMenuContainer = null;
        }
    }

    performAttack() {
        this.debug();
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
                // console.log("damage before reduce health", damage);
                this.reduceEnemyHealth(damage);
                const halfHealth = this.enemy.maxHealth / 2;

                if (
                    this.enemy.health > 0 &&
                    this.enemy.health < halfHealth &&
                    !hurtAnimationRan
                ) {
                    hurtAnimationRan = true;
                    // Remove the current enemy image
                    this.enemyImg.destroy();
                    // Add the defeated enemy image
                    this.enemyImg = this.add.image(
                        800,
                        290,
                        this.enemy.hurtImage.name
                    );
                    this.tweens.add({
                        targets: this.enemyImg,
                        x: 550,
                        duration: 500,
                        ease: "Power2",
                        delay: 0,
                    });
                }
                if (this.enemy.health < 1) {
                    // Remove the current enemy image
                    this.enemyImg.destroy();
                    // Add the defeated enemy image
                    this.enemyImg = this.add.image(
                        800,
                        290,
                        this.enemy.defeatImage.name
                    );
                    this.tweens.add({
                        targets: this.enemyImg,
                        x: 550,
                        duration: 500,
                        ease: "Power2",
                        delay: 0,
                    });
                    setTimeout(() => {
                        hurtAnimationRan = false;
                        this.returnToGameScene();
                    }, 2500);
                } else {
                    this.computerAttack();
                }
            },
        });
        this.debug();
    }

    reduceEnemyHealth(damage) {
        // Reduce enemy health
        this.enemy.health -= damage;

        // Update enemy health bar display
        const newWidth = (this.enemy.health / this.enemy.maxHealth) * 200;
        this.enemyHealthBar.clear();
        this.enemyHealthBar.fillStyle(0xff0000, 1);
        if (this.enemy.health >= 0) {
            this.enemyHealthBar.fillRect(0, 0, newWidth, 20);
        }
    }

    switchHuman() {
        // Check if the player has more than one human in the inventory
        if (this.player.inventory.length > 1) {
            // Define the dimensions of the container
            const containerWidth = 220;
            const containerHeight = 150;

            // Create a container to hold the list of humans
            this.switchHumanContainer = this.add.container(228, 694);

            // Background for the list
            const background = this.add.rectangle(
                0,
                0,
                containerWidth,
                containerHeight,
                0x333333
            );
            this.switchHumanContainer.add(background);

            const verticalSpacing = 27;

            const maxNames = Math.floor(containerHeight / verticalSpacing);

            this.player.inventory.slice(0, maxNames).forEach((human, index) => {
                // Calculate the y-coordinate for the current text element
                const yPos =
                    -containerHeight / 2 +
                    verticalSpacing / 2 +
                    index * verticalSpacing;

                // Check if the human's health is zero
                const isDisabled = human.health <= 0;

                const humanText = this.add
                    .text(-100, yPos, `${human.name} HP: ${human.health}`, {
                        fill: isDisabled ? "#666666" : "#ffffff",
                    })
                    .setInteractive();

                if (isDisabled) {
                    humanText.disableInteractive();
                }
                humanText.on("pointerdown", () => {
                    this.playerCurrentHuman = human;

                    this.switchHumanContainer.destroy();

                    this.loadHumanImage(human);

                    this.playerNameText.setText(human.name);

                    this.updatePlayerHealth();

                    this.computerAttack();
                });

                this.switchHumanContainer.add(humanText);
            });
        } else {
            console.log("You have only one human in your inventory.");
        }
    }

    switch() {
        if (this.switchHumanContainer) {
            this.switchHumanContainer.destroy();
            this.switchHumanContainer = null;
        } else {
            this.switchHuman();
        }
        if (this.attackMenuContainer) {
            this.attackMenuContainer.destroy();
            this.attackMenuContainer = null;
        }

        if (this.itemMenuContainer) {
            this.itemMenuContainer.destroy();
            this.itemMenuContainer = null;
        }
    }

    reducePlayerHealth(damage) {
        // Reduce player health
        this.playerCurrentHuman.health -= damage;

        // Check if health is less than or equal to 0
        if (this.playerCurrentHuman.health <= 0) {
            // Set health to 0
            this.playerCurrentHuman.health = 0;

            // Remove the current player image
            this.playerImg.destroy();

            // Add the defeated player image
            this.playerImg = this.add.image(
                800,
                480,
                this.playerCurrentHuman.defeatImage.name
            );

            // Transition the defeated player image
            this.tweens.add({
                targets: this.playerImg,
                x: 250,
                duration: 500,
                ease: "Power2",
                delay: 0,
                onComplete: () => {
                    const remainingHumans = this.player.inventory.filter(
                        (human) => human.health > 0
                    );
                    if (remainingHumans.length === 0) {
                        this.showMessage("All your humans are defeated!");

                        setTimeout(() => {
                            this.returnToGameScene();
                        }, 2000);
                    } else {
                        this.createSwitchHumanMenu();
                    }
                },
            });
        }

        // Update player health bar display
        this.updatePlayerHealth();
    }

    createSwitchHumanMenu() {
        // Create a container for the switch human menu with 0.5 opacity
        this.switchHumanMenuContainer = this.add.container(0, 0);
        // Set opacity to 0.5

        // Background for the menu with 0.5 opacity
        const background = this.add.rectangle(300, 450, 800, 800, 0x000000);
        background.setAlpha(0.5); // Set opacity to 0.5
        this.switchHumanMenuContainer.add(background);

        // Add text for informing the player about the defeated human
        this.defeatedText = this.add.text(
            170,
            25,
            "YOUR HUMAN HAS BEEN DEFEATED",
            {
                font: "courier",
                fontSize: "24px",
                fontStyle: "strong",
                fill: "#ff0000",
                strokeThickness: 3,
            }
        );

        this.defeatedText.setFontStyle("bold");
        this.defeatedText.setFontSize("24px");

        this.switchHumanMenuContainer.add(this.defeatedText);

        // Iterate over the inventory to display options for switching humans
        this.player.inventory.forEach((human, index) => {
            // Calculate the y-coordinate for the current option
            const yPos = 200 + index * 75;
            // Create a text option for the human if their health is greater than 0
            if (human.health > 0) {
                const optionText = this.add.text(
                    400,
                    yPos,
                    `${human.name} HP: ${human.health}`,
                    {
                        fill: "#ffffff", // Fixed color format
                        fontSize: "20px",
                    }
                );
                optionText.setInteractive();
                optionText.setOrigin(0.5);
                // Add click event to switch to the selected human
                optionText.on("pointerdown", () => {
                    this.playerCurrentHuman = human;

                    // Destroy the defeatedText
                    this.defeatedText.destroy();

                    // Load new human image
                    this.loadHumanImage(human);

                    // Update player name text
                    this.playerNameText.setText(human.name);

                    // Update player health and health bar
                    this.updatePlayerHealth();

                    this.switchHumanMenuContainer.destroy();
                    this.computerAttack();
                });

                this.switchHumanMenuContainer.add(optionText);
            }
        });

        // Add the switch human menu container to the scene
        this.add.existing(this.switchHumanMenuContainer);
    }

    loadHumanImage(human) {
        this.load.image(human.name, import.meta.env.BASE_URL + human.mainImage);

        this.load.once("complete", () => {
            this.playerImg.setTexture(human.name);
        });

        this.load.start();
    }

    updatePlayerHealth() {
        const newWidth =
            (this.playerCurrentHuman.health /
                this.playerCurrentHuman.maxHealth) *
            200;
        this.playerHealthBar.clear();
        this.playerHealthBar.fillStyle(0xff0000, 1);
        if (this.playerCurrentHuman.health >= 0) {
            this.playerHealthBar.fillRect(0, 0, newWidth, 20);
        }
    }

    useItem() {
        const captureProbability = this.calculateCaptureProbability();
        this.disableButtons();
        const randomNum = Math.random();

        if (randomNum < captureProbability) {
            this.captureHuman(this.enemy);
        } else {
            this.flashGreenPulse();

            setTimeout(() => {
                this.showMessage("Failed to capture the human.");
            }, 6500);

            setTimeout(() => {
                this.computerAttack();
            }, 8000);
        }
        // this.itemMenuContainer.destroy();
        this.disableButtons;
    }

    createItemMenu() {
        if (this.switchHumanContainer) {
            this.switchHumanContainer.destroy();
            this.switchHumanContainer = null;
        }

        if (this.itemMenuContainer) {
            this.itemMenuContainer.destroy();
            this.itemMenuContainer = null;
        } else {
            this.itemMenuContainer = this.add.container(223, 695);
            const menuBackground = this.add.rectangle(0, 0, 210, 150, 0x333333);
            this.itemMenuContainer.add(menuBackground);

            this.renderItemButtons();
        }

        if (this.attackMenuContainer) {
            this.attackMenuContainer.destroy();
            this.attackMenuContainer = null;
        }
    }

    renderItemButtons() {
        this.player.items.forEach((item, index) => {
            const verticalSpacing = 30;
            const yPos =
                -100 / 2 + verticalSpacing / 2 + index * verticalSpacing;

            console.log("item", item);
            let text = item.name;
            if (item.name === "HypnoRay") {
                text = `${item.name}: ${item.charge}`;
            }
            const button = this.createItemOption(0, yPos, text, () =>
                this.useItem(item)
            );
            this.itemMenuContainer.add(button);
        });
    }

    createItemOption(x, y, text, callback) {
        const button = this.add
            .text(x, y, text, { fill: "#ffffff" })
            .setInteractive()
            .on("pointerdown", callback);

        // Style the button
        button.setPadding(15, 10, 15, 10);
        button.setBackgroundColor("#333333");
        button.setStroke("#ffffff", 1);

        // Center the button's origin
        button.setOrigin(0.5);

        // Add hover effect
        button.on("pointerover", () => button.setBackgroundColor("#555555"));
        button.on("pointerout", () => button.setBackgroundColor("#333333"));

        return button;
    }

    calculateCaptureProbability() {
        const maxHealth = this.enemy.maxHealth;
        const remainingHealth = this.enemy.health;
        const captureProbability = 1 - remainingHealth / maxHealth;

        const maxProbability = 0.8;
        return Math.min(captureProbability, maxProbability);
    }

    showMessage(message) {
        const text = this.add
            .text(400, 100, message, { fontSize: "32px", fill: "#000000" })
            .setOrigin(0.5)
            .setDepth(1000);
        this.tweens.add({
            targets: text,
            alpha: { from: 1, to: 0 },
            duration: 1000,
            ease: "Linear",
            delay: 2000,
            onComplete: () => {
                text.destroy();
            },
        });
    }

    captureHuman() {
        this.flashGreenPulse();

        const item = this.player.items[0];
        console.log("item", item);

        if (item.name === "HypnoRay") {
            if (item.charge >= 5) {
                if (this.player.inventory.length < 5) {
                    console.log("human captured");

                    setTimeout(() => {
                        this.enemyImg = this.add.image(
                            550,
                            290,
                            this.enemy.name,
                            0
                        );
                    }, 6000);

                    item.captureHuman(this.enemy, this.player);
                    setTimeout(() => {
                        this.showMessage("Human captured successfully!");
                    }, 6500);
                    setTimeout(() => {
                        this.returnToGameScene();
                    }, 10000);
                } else {
                    setTimeout(() => {
                        this.showMessage("You already have 5 humans");
                    }, 6500);
                    setTimeout(() => {
                        this.returnToGameScene();
                    }, 10000);
                }
            } else {
                this.showMessage("Hypno Ray is out of charges!!");
            }
        } else {
            setTimeout(() => {
                this.showMessage("Failed to capture the human.");
            }, 6500);

            this.computerAttack();
        }
    }

    flashGreenPulse() {
        const flash = this.add
            .rectangle(400, 400, 800, 800, 0x00ff00)
            .setAlpha(0)
            .setDepth(1000); // Ensure it's above everything else
        this.tweens.add({
            targets: flash,
            alpha: { from: 1, to: 0 },
            duration: 1000,
            ease: "Linear",
            repeat: 2,
            yoyo: true,
            onComplete: () => {
                flash.destroy();
            },
        });
    }

    run() {
        this.disableButtons();
        let randomNum = Math.floor(Math.random() * 11);
        if (randomNum > 5) {
            this.showMessage("You fled ...");
            setTimeout(() => {
                this.returnToGameScene();
            }, 2500);
        } else {
            this.showMessage("Failed to escape");
            setTimeout(() => {
                this.computerAttack();
            }, 2500);
        }
    }

    returnToGameScene() {
        // Fade out the camera
        this.player.savePlayerData();
        this.cameras.main.fadeOut(1200, 0, 0, 0, (camera, progress) => {
            if (progress === 1) {
                // Retrieve player position from the data object
                const playerX = this.playerPosition.x;
                const playerY = this.playerPosition.y;

                // Set player position in the Game scene
                const gameScene = this.scene.get("Game");
                if (gameScene && gameScene.player) {
                    gameScene.player.setPosition(playerX, playerY);
                    gameScene.player.currentState = "walking";
                } else {
                    console.error("Game scene or player not found.");
                }
                this.music.stop();
                // Transition back to the Game scene
                this.scene.start("Game", {
                    playerPosition: this.playerPosition,
                });
            }
        });
    }
}

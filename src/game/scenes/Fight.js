import {
    Human,
    Clown,
    Scientist,
    Firefighter,
    Farmer,
    NuckChorris,
} from "../humans";
import { loadAudio } from "./fightHelpers/loadAudio";
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
        this.playerPosition = data.playerPosition;
        this.player = data.player;
        this.worldData = data.worldData;
        this.npcObjects = data.npcObjects;
    }

    debug() {
        console.log("hello");
        console.log(this);
    }

    preload() {
        loadAudio(this);
        this.selectRandomEnemy();
        this.initializePlayerData();
        this.checkPlayerCurrentHuman();
        this.preloadImages();
    }

    create() {
        this.setupBackground();
        this.playMusic();
        this.createInfoContainers();
        this.createCharacters();
        this.createActionButtons();
    }

    selectRandomEnemy() {
        let randomNum = Math.floor(Math.random() * humans.length);
        this.enemy = humans[randomNum];

        if (this.enemy.health < this.enemy.maxHealth) {
            this.enemy.health = this.enemy.maxHealth;
        }
    }

    initializePlayerData() {
        const playerData = this.player.loadPlayerData();
        if (playerData) {
            this.player.inventory = playerData;
            console.log("Player inventory:", this.player.inventory);

            this.playerCurrentHuman =
                this.player.inventory.find((human) => human.health > 0) ||
                this.player.inventory[0];

            const hypnoRayItem = this.player.items.find(
                (item) => item.name === "HypnoRay"
            );
            if (hypnoRayItem) {
                hypnoRayItem.charge = playerData.hypnoRayCharge || 0;
            }
        }
    }

    checkPlayerCurrentHuman() {
        for (const human of this.player.inventory) {
            if (human.health > 0) {
                this.playerCurrentHuman = human;
                break;
            }
        }
        if (this.playerCurrentHuman.health <= 0) {
            const remainingHumans = this.player.inventory.filter(
                (human) => human.health > 0
            );
            if (remainingHumans.length === 0) {
                this.showMessage("Humans are defeated, you flee");

                setTimeout(() => {
                    this.returnToGameScene();
                }, 4000);
            }
        }
        if (this.enemy.health <= 0) {
            this.enemy.health = this.enemy.maxHealth;
        }
    }

    preloadImages() {
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
        this.player.inventory.forEach((human) => {
            this.load.image(
                human.name,
                import.meta.env.BASE_URL + human.mainImage
            );
            this.load.image(
                human.defeatImage.name,
                import.meta.env.BASE_URL + human.defeatImage.path
            );
            this.load.image(
                human.hurtImage.name,
                import.meta.env.BASE_URL + human.hurtImage.path
            );
        });
    }

    setupBackground() {
        this.add.image(400, 400, "water_field_bg");
    }

    playMusic() {
        this.music = this.sound.add("runRiot");
        this.music.play();
        this.music.setLoop(true);
    }

    createInfoContainers() {
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
        this.createPlayerInfoContainer();
        this.createEnemyInfoContainer();
    }

    createPlayerInfoContainer() {
        this.playerInfoContainer = this.add.container(450, 540);

        this.playerHealthBar = this.add.graphics();
        this.playerHealthBar.fillStyle(0xff0000, 1);
        this.playerHealthBar.fillRect(0, 0, 200, 20);

        this.updatePlayerHealth();
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

        this.playerInfoContainer.add([
            this.playerNameText,
            this.playerHealthBar,
        ]);
    }

    createEnemyInfoContainer() {
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
    }

    createCharacters() {
        const enemyStartX = -300;
        let playerStartX = 800;
        const enemyStartY = 290;
        const playerStartY = 480;

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

        this.tweens.add({
            targets: this.enemyImg,
            x: 550,
            duration: 1000,
            ease: "Power2",
            delay: 500,
        });

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
    }

    createActionButtons() {
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
        const button = this.add
            .text(x, y, text, { fill: "#ffffff" })
            .setInteractive()
            .on("pointerdown", callback);

        button.setPadding(15, 10, 15, 10);
        button.setBackgroundColor("#333333");
        button.setStroke("#ffffff", 2);

        button.setOrigin(0.5);

        button.on("pointerover", () => button.setBackgroundColor("#555555"));
        button.on("pointerout", () => button.setBackgroundColor("#333333"));

        return button;
    }

    disableButtons() {
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
        const selectedAttack = attacks[randomAttackIndex];
        return selectedAttack;
    }

    computerAttack() {
        this.disableButtons();

        this.attackTween = this.tweens.add({
            targets: this.enemyImg,
            x: 340,
            y: 450,
            delay: 1000,
            duration: 150,
            ease: "Linear",
            yoyo: true,
            repeat: 0,
            onComplete: () => {
                this.sound.play("attackSound");
                this.enableButtons();
                let attack = this.randomCompAttack();
                this.reducePlayerHealth(attack["damage"]);
                this.player.savePlayerData();
            },
        });
    }

    createAttackMenu() {
        this.attackMenuContainer = this.add.container(223, 695);

        const menuBackground = this.add.rectangle(0, 0, 210, 150, 0x333333);
        this.attackMenuContainer.add(menuBackground);

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

        this.attackMenuContainer.add([attack1, attack2, special]);

        attack1.setInteractive();
        attack2.setInteractive();
        special.setInteractive();

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
        this.attackMenuContainer.destroy();

        this.sound.play("attackSound");

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
                const halfHealth = this.enemy.maxHealth / 2;

                if (
                    this.enemy.health > 0 &&
                    this.enemy.health < halfHealth &&
                    !hurtAnimationRan
                ) {
                    hurtAnimationRan = true;
                    this.enemyImg.destroy();
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
                    this.enemyImg.destroy();
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
                    this.worldData.removeHumanNPC = true;
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
        this.enemy.health -= damage;
        const newWidth = (this.enemy.health / this.enemy.maxHealth) * 200;
        this.enemyHealthBar.clear();
        this.enemyHealthBar.fillStyle(0xff0000, 1);
        if (this.enemy.health >= 0) {
            this.enemyHealthBar.fillRect(0, 0, newWidth, 20);
        }
    }

    switchHuman() {
        if (this.player.inventory.length > 1) {
            const containerWidth = 220;
            const containerHeight = 150;

            this.switchHumanContainer = this.add.container(228, 694);
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
                const yPos =
                    -containerHeight / 2 +
                    verticalSpacing / 2 +
                    index * verticalSpacing;
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
                    console.log("switch", this.playerCurrentHuman, human);

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
        this.playerCurrentHuman.health -= damage;

        if (this.playerCurrentHuman.health <= 0) {
            this.playerCurrentHuman.health = 0;
            this.playerImg.destroy();
            this.playerImg = this.add.image(
                800,
                480,
                this.playerCurrentHuman.defeatImage.name
            );
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

        this.updatePlayerHealth();
    }

    createSwitchHumanMenu() {
        this.disableButtons();
        this.switchHumanMenuContainer = this.add.container(0, 0);
        const background = this.add.rectangle(300, 450, 800, 800, 0x000000);
        background.setAlpha(0.5);
        this.switchHumanMenuContainer.add(background);

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

        this.player.inventory.forEach((human, index) => {
            const yPos = 200 + index * 75;
            if (human.health > 0) {
                const optionText = this.add.text(
                    400,
                    yPos,
                    `${human.name} HP: ${human.health}`,
                    {
                        fill: "#ffffff",
                        fontSize: "20px",
                    }
                );
                optionText.setInteractive();
                optionText.setOrigin(0.5);

                optionText.on("pointerdown", () => {
                    this.playerCurrentHuman = human;

                    this.defeatedText.destroy();

                    this.loadHumanImage(human);

                    this.playerNameText.setText(human.name);

                    this.updatePlayerHealth();

                    this.switchHumanMenuContainer.destroy();
                    this.computerAttack();
                });

                this.switchHumanMenuContainer.add(optionText);
            }
        });

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
                const hypnoRayItem = this.player.items.find(
                    (item) => item.name === "HypnoRay"
                );
                if (hypnoRayItem) {
                    hypnoRayItem.charge -= 5;
                }
                this.computerAttack();
            }, 8000);
        }
        console.log(this);

        this.itemMenuContainer.destroy();
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
                    this.worldData.removeHumanNPC = true;

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
            .setDepth(1000);
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
        console.log(this.worldData.removeHumanNPC);
        this.player.savePlayerData();
        this.cameras.main.fadeOut(1200, 0, 0, 0, (camera, progress) => {
            if (progress === 1) {
                const playerX = this.playerPosition.x;
                const playerY = this.playerPosition.y;
                const gameScene = this.scene.get("Game");

                if (gameScene && gameScene.player) {
                    gameScene.player.setPosition(playerX, playerY);
                    gameScene.player.currentState = "walking";
                } else {
                    console.error("Game scene or player not found.");
                }
                // for (let npc in this.npcObjects) {
                //     let currentNPC = gameScene.registry.get(npc)
                //     currentNPC.setPosition(npc.xPos, npc.yPos)
                // }
                this.music.stop();
                this.scene.start("Game", {
                    playerPosition: this.playerPosition,
                    worldData: this.worldData,
                    npcObjects: this.npcObjects,
                });
            }
        });
    }
}

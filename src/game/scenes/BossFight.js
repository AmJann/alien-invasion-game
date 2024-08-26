import { Clown, Scientist, Firefighter, Farmer, NuckChorris } from "../humans";

const humans = [
    new Clown(),
    new Scientist(),
    new Firefighter(),
    new Farmer(),
    new NuckChorris(),
];

export class BossFight extends Phaser.Scene {
    constructor() {
        super("BossFight");
        this.player = null;
        this.humans = humans;
        this.playerImg = null;
    }

    init(data) {
        this.playerPosition = data.playerPosition;
        this.player = data.player;
        this.worldData = data.worldData;
        this.npcObjects = data.npcObjects;
    }

    preload() {
        console.log("player", this.player);
        this.preloadImages();
        this.initializePlayerData();
        this.checkPlayerCurrentHuman();
    }

    create() {
        this.setupBackground();
    }
    preloadImages() {
        this.load.image(
            "bossBG",
            import.meta.env.BASE_URL + "assets/bossBG.jpg"
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

        this.load.image(
            "playerAlien",
            import.meta.env.BASE_URL +
                "assets/characters/alien-imgs/alien-char-4.png"
        );
    }

    create() {
        this.setupBackground();
        this.createCharacters();
    }

    initializePlayerData() {
        const playerData = this.player.loadPlayerData();
        console.log("playerData", playerData);
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
        // if (this.enemy.health <= 0) {
        //     this.enemy.health = this.enemy.maxHealth;
        // }
    }

    setupBackground() {
        this.add.image(400, 400, "bossBG");
    }

    createCharacters() {
        const enemyStartX = -300;
        let playerStartX = 900;
        const enemyStartY = 290;
        const playerStartY = 600;

        // this.enemyImg = this.add.image(
        //     enemyStartX,
        //     enemyStartY,
        //     this.enemy.name,
        //     0
        // );
        this.playerImg = this.add.image(
            playerStartX,
            playerStartY,
            "playerAlien",
            0
        );

        // this.tweens.add({
        //     targets: this.enemyImg,
        //     x: 550,
        //     duration: 1000,
        //     ease: "Power2",
        //     delay: 500,
        // });

        this.tweens.add({
            targets: this.playerImg,
            x: 250,
            duration: 1000,
            ease: "Power2",
            delay: 0,
            onComplete: () => {
                playerStartX = 250;
                setTimeout(() => {
                    this.returnToGameScene();
                }, 3000);
            },
        });
    }

    returnToGameScene() {
        this.scene.start("Game", {
            playerPosition: this.playerPosition,
            worldData: this.worldData,
            npcObjects: this.npcObjects,
        });
    }
}

import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import AnimatedTiles from "phaser-animated-tiles-phaser3.5/dist/AnimatedTiles.min.js";

export class Game extends Scene {
    constructor() {
        super("Game");
    }
    preload() {
        this.load.image(
            "embeddedTiles",
            import.meta.env.BASE_URL + "assets/embeddedTiles.png"
        );
        this.load.tilemapTiledJSON(
            "alienGameMap3",
            import.meta.env.BASE_URL + "assets/alienGameMap3.tmj"
        );
        this.load.scenePlugin(
            "animatedTiles",
            AnimatedTiles,
            "animatedTiles",
            "animatedTiles"
        );
    }

    create() {
        // this.cameras.main.setBackgroundColor(0x00ff00);

        // this.add.image(512, 384, "background").setAlpha(0.5);

        // this.add
        //     .text(
        //         512,
        //         384,
        //         "Make something fun!\nand share it with us:\nsupport@phaser.io",
        //         {
        //             fontFamily: "Arial Black",
        //             fontSize: 38,
        //             color: "#ffffff",
        //             stroke: "#000000",
        //             strokeThickness: 8,
        //             align: "center",
        //         }
        //     )
        //     .setOrigin(0.5)
        //     .setDepth(100);
        const map = this.make.tilemap({
            key: "alienGameMap3",
            tileWidth: 16,
            tileHeight: 16,
        });
        this.sys.animatedTiles.init(map);
        const tileset = map.addTilesetImage("embeddedTiles", "embeddedTiles");
        const groundLayer1 = map.createLayer("groundLayer1", tileset, 0, 0);
        const groundLayer2 = map.createLayer("groundLayer2", tileset, 0, 0);
        const groundLayer3 = map.createLayer("groundLayer3", tileset, 0, 0);
        const layer2 = map.createLayer("TileLayer2", tileset, 0, 0);
        const layer3 = map.createLayer("TileLayer3", tileset, 0, 0);
        const layer4 = map.createLayer("TileLayer4", tileset, 0, 0);
        this.animatedTiles.init(map);

        const player = this.add.sprite(16, 15, "player", "goblin_walk_1.png");
        const player2 = this.add.sprite(
            500,
            650,
            "player",
            "goblin_hurt_1.png"
        );
        this.anims.create({
            key: "player-walk-right",
            frames: this.anims.generateFrameNames("player", {
                start: 1,
                end: 8,
                prefix: "goblin_walk_",
                suffix: ".png",
            }),
            repeat: -1,
            frameRate: 12,
        });
        this.anims.create({
            key: "player-idle-right",
            frames: this.anims.generateFrameNames("player", {
                start: 1,
                end: 8,
                prefix: "goblin_idle_",
                suffix: ".png",
            }),
            repeat: -1,
            frameRate: 12,
        });
        this.anims.create({
            key: "player-hurt-right",
            frames: this.anims.generateFrameNames("player", {
                start: 1,
                end: 8,
                prefix: "goblin_hurt_",
                suffix: ".png",
            }),
            repeat: -1,
            frameRate: 12,
        });
        player.anims.play("player-walk-right");
        player2.anims.play("player-hurt-right");

        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}

import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class Game extends Scene {
    constructor() {
        super("Game");
    }
    preload() {
        this.load.image(
            "embeddedTiles",
            "../../../public/assets/embeddedTiles.png"
        );
        this.load.tilemapTiledJSON(
            "alienGameMap1",
            "../../../assets/alienGameMap1.tmj"
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
            key: "alienGameMap1",
            tileWidth: 16,
            tileHeight: 16,
        });
        const tileset = map.addTilesetImage("embeddedTiles", "embeddedTiles");
        const layer1 = map.createLayer("groundLayer1", tileset, 0, 0);
        const layer2 = map.createLayer("TileLayer2", tileset, 0, 0);
        const layer3 = map.createLayer("TileLayer3", tileset, 0, 0);
        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}

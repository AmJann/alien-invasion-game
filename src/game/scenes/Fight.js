import { Scene } from "phaser";
import { Game } from "./Game";

export class Fight extends Phaser.Scene {
    constructor() {
        super("Fight");
    }

    preload() {
        this.load.image(
            "water_field_bg",
            import.meta.env.BASE_URL + "assets/water_field_bg.jpg"
        );
    }

    create() {
        this.add.image(400, 400, "water_field_bg");
        //fadesin from game scene
        this.cameras.main.fadeIn(500);
        //returns to game scene after 3 seconds
        this.time.delayedCall(3000, () => {
            this.scene.start("Game");
        });
    }

    returnToGameScene() {
        this.cameras.main.fadeOut(500, 0, 0, 0, (camera, progress) => {
            if (progress === 1) {
                // transition back to the Game scene
                this.scene.start("Game");

                // player set to previous position in the Game scene
                console.log("playerpostition", playerPosition);
                const gameScene = this.scene.get("Game");
                gameScene.player.setPosition(
                    gameScene.playerPosition.x,
                    gameScene.playerPosition.y
                );
            }
        });
    }
}

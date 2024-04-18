import { Scene } from "phaser";

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

        // this.time.delayedCall(3000, () => {
        //     this.scene.start("Game");
        // });
    }
}

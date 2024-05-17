import { Physics, Math } from "phaser";

export class powerUpSprite extends Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
        scene.physics.add.existing(this);
        scene.physics.world.enableBody(this);
        this.setSize(10, 10);
        this.setPushable(false);
        this.setCollideWorldBounds(true);
        this.body.onCollide = true;
        scene.physics.add.collider(this, scene.player, () => {
            // heal the humans in inventory
            // power boost the hypno-ray
            // teleport to another spot on the map
        },
            undefined,
        scene
    );
    }
    preUpdate(t, dt) {
        super.preUpdate(t, dt)
        // this.anims.play('shroom-powerup')
    }
}
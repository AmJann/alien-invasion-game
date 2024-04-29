import humans from "./humans";

export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.inventory = [humans[1]];
    }

    addHumanToInventory(human) {
        if (this.inventory.length <= 5) {
            this.inventory.push(human);
        }
    }

    removeHumanFromInventory(human) {
        const index = this.inventory.indexOf(human);
        if (index !== -1) {
            this.inventory.splice(index, 1);
        }
    }

    hasHuman(human) {
        return this.inventory.includes(human);
    }

    humanList() {
        return this.inventory;
    }
}

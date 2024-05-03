import {
    Human,
    Clown,
    Scientist,
    Firefighter,
    Farmer,
    NuckChorris,
    humans,
} from "../humans";

export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.inventory = [
            new Clown(),
            new Scientist(),
            new Firefighter(),
            new Farmer(),
            new NuckChorris(),
        ];
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

    savePlayerData() {
        localStorage.setItem("playerData", JSON.stringify(this.inventory));
    }

    loadPlayerData() {
        const data = localStorage.getItem("playerData");
        return data ? JSON.parse(data) : null;
    }
}

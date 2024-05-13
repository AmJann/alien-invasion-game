// Define a new class for the capture item
import { Player } from "./Player";

export class HypnoRay {
    constructor() {
        this.name = "HypnoRay";
        this.charge = 100;
    }

    captureHuman(human, player) {
        player.addHumanToInventory(human);
        console.log(`Captured ${human.name}!`);
        this.charge -= 5;
        console.log("charge", this.charge);
    }
}

export class HypnoRay {
    constructor() {
        this.name = "HypnoRay";
        this.charge = 25;
        this.maxCharge = 25;
    }

    captureHuman(human, player) {
        player.addHumanToInventory(human);
        console.log(`Captured ${human.name}!`);
        this.charge -= 5;
        console.log("charge", this.charge);
    }
}

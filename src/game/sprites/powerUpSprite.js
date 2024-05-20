import { Physics } from "phaser";

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
        this.spawnZones = Object.values(scene.npcStartPositions);

        // player/powerup collision
        scene.physics.add.collider(
            this,
            scene.player,
            () => {
                const storage = localStorage.getItem("playerData");
                const playerData = JSON.parse(storage);

                // teleport to another spot on the map
                if (playerData && playerData.inventory) {
                    
                    // heal the humans in inventory

                    for (let obj in playerData.inventory) {
                        playerData.inventory[obj].health =
                            playerData.inventory[obj].maxHealth;
                    }
                    // power boost the hypno-ray
                    const hypnoRayObject = scene.player.items.find(
                        (item) => item.name === "HypnoRay"
                    );
                    playerData["hypnoRayCharge"] = Math.min(
                        hypnoRayObject.maxCharge,
                        playerData["hypnoRayCharge"] + 10
                    );
                    localStorage.setItem(
                        "playerData",
                        JSON.stringify(playerData)
                    );
                }
                this.playerCollision();
            },
            undefined,
            scene
        );
    }
    playerCollision() {
        // teleport to another part of the map when consumed by player

        this.randomZone = Math.floor(
            Math.random() * (this.spawnZones.length - 1) + 1
        );
        this.x = this.spawnZones[this.randomZone][0];
        this.y = this.spawnZones[this.randomZone][1];
    }
    preUpdate(t, dt) {
        super.preUpdate(t, dt);
        // this.anims.play('shroom-powerup')
    }
}

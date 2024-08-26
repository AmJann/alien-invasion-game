import { Physics, Math } from "phaser";

export class bossSprite extends Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, id) {
        super(scene, x, y, texture, frame);

        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);

        this.facing = "right";
        this.currentState = "walking";
        this.playSoundEffect = true;
        this.flag = true;

        this.setScale(1.25);
        scene.physics.add.existing(this);
        scene.physics.world.enableBody(this);
        //this.setImmovable(true);

        this.setSize(12, 15);
        this.setPushable(false);
        this.setCollideWorldBounds(true);
        this.body.onCollide = true;
        scene.physics.world.on(
            Physics.Arcade.Events.COLLIDE,
            this.handleCollision,
            this
        );
        //scene.physics.world.on('collision', this.handleCollision, this);

        scene.physics.add.collider(
            this,
            scene.waterLayer,
            this.handleCollision,
            undefined,
            scene
        );
        scene.physics.add.collider(
            this,
            scene.houseLayer1,
            this.handleCollision,
            undefined,
            scene
        );
        scene.physics.add.collider(
            this,
            scene.houseLayer2,
            this.handleCollision,
            undefined,
            scene
        );
        scene.physics.add.collider(
            this,
            scene.treeLayer,
            this.handleCollision,
            undefined,
            scene
        );
        scene.physics.add.collider(
            this,
            scene.moundsRocks,
            this.handleCollision,
            undefined,
            scene
        );
        scene.physics.add.collider(
            this,
            scene.fenceLayer,
            this.handleCollision,
            undefined,
            scene
        );
        scene.physics.add.collider(
            this,
            scene.scenecrops,
            this.handleCollision,
            undefined,
            scene
        );
        scene.physics.add.collider(
            this,
            scene.elevatedGroundLayer,
            this.handleCollision,
            undefined,
            scene
        );
        scene.physics.add.collider(
            this,
            scene.bridgePosts,
            this.handleCollision,
            undefined,
            scene
        );
        scene.physics.add.collider(
            this,
            scene.player,
            this.handleCollision,
            undefined,
            scene
        );
        // Transition to boss fight scene?
        scene.physics.add.collider(this, scene.player.weapon, () => {
            this.setVelocity(0, 0);
            this.currentState = "smacked";
            this.killNPC();

            //fadeout to fight scene
            scene.time.delayedCall(800, () => {
                scene.player.currentState = "BossFight";
                scene.cameras.main.fadeOut(800, 0, 0, 0, (camera, progress) => {
                    if (progress === 1) {
                        //passes reference to fight scene and fixes blue border issue with fight scene
                        scene.music.stop();
                        scene.scene.start("BossFight", {
                            playerPosition: scene.playerPosition,
                            player: scene.player,
                            worldData: scene.worldData,
                            npcObjects: scene.npcObjects,
                        });
                    }
                });
            });
        });
    }
    destroy(fromScene) {
        if (this.moveEvent) {
            this.moveEvent.destroy();
        }
        
        super.destroy(fromScene);
    }

    // let's have our NPCs move around at random - None of this is working
    killNPC() {
        if (this.playSoundEffect) {
            this.currentState = "smacked";

            this.setVelocity(0, 0);

            if (this.facing == "right") {
                this.anims.play("player-hurt-right");
            } else {
                this.anims.play("player-hurt-left");
            }
            // this.playSoundEffect = false
            // this.scene.time.delayedCall(200, () => this.soundEffectManager())
            //this.scene.sound.play('npcHurt')
        }
    }
    changeDirection() {
        if (this.direction === "right") {
            this.direction = "left";
            this.facing = "left";
        } else {
            this.direction = "right";
            this.facing = "right";
        }
    }

    handleCollision() {
        if (this.currentState != "walking") {
            return;
        }

        let newDir = Math.Between(0, 3);

        while (newDir == this.direction) {
            newDir = Math.Between(0, 3);
        }
        return newDir;
    }
    preUpdate(t, dt) {
        super.preUpdate(t, dt);
        if (this.currentState != "walking") {
            return;
        }

        const velocity = 20;
        let xVel = this.body.velocity.x;
        let yVel = this.body.velocity.y;

        if (this.facing === "left") {
            this.anims.play("player-walk-left", true);
            xVel = -velocity;
        } else {
            this.anims.play("player-walk-right", true);
            xVel = velocity;
        }
        //}

        this.setVelocity(xVel, yVel);
    }
    // soundEffectManager() {
    //     this.scene.sound.play('npcHurt')

    // }
    // updatePosition(scene) {
    //     scene.worldData[this.id].xPos =  this.x
    //     scene.worldData[this.id].yPos = this.y
    //     scene.worldData[this.id].currentState = this.currentState
    // }
}

import { Physics, Math } from "phaser";

export class humanSprite extends Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, id) {
        super(scene, x, y, texture, frame);

        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
        this.direction = 1;
        this.id = id
        this.facing = "right";
        this.currentState = 'walking';
        this.playSoundEffect = true
        this.projectile = this.scene.physics.add.sprite(-50, -50);
        this.projectile.setSize(8, 8);
        this.projectile.setActive(true).setVisible(true);

        //this.setScale(2);
        scene.physics.add.existing(this);
        scene.physics.world.enableBody(this);
        //this.setImmovable(true);
        this.moveEvent = scene.time.addEvent({
            delay: Math.Between(500, 2500),
            callback: () => {
                this.direction = this.changeDirection();
            },
            loop: true,
        });
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
        scene.physics.add.collider(this, scene.player.weapon, () => {
            console.log("A HIT A HIT");
            
            this.setVelocity(0, 0);
            this.currentState = "smacked";
            this.killNPC();
            
            //fadeout to fight scene
            scene.time.delayedCall(800, () => {
                scene.player.currentState = 'fightScene'
                scene.cameras.main.fadeOut(
                    800,
                    0,
                    0,
                    0,
                    (camera, progress) => {
                        if (progress === 1) {
                            //passes reference to fight scene and fixes blue border issue with fight scene
                            scene.music.stop()
                            scene.scene.start("Fight", {
                                playerPosition: scene.playerPosition,
                                player: scene.player,
                                worldData: scene.worldData,
                                npcObjects: scene.npcObjects
                            });
                        }
                    }
                );
            });
        });
    }
    destroy(fromScene) {
        this.moveEvent.destroy();
        super.destroy(fromScene);
    }

    // let's have our NPCs move around at random - None of this is working
    killNPC() {
        if (this.playSoundEffect) {
            this.currentState = 'smacked'
            console.log(this.currentState)
            this.setVelocity(0, 0)
        
            if (this.facing == "right") {
                this.anims.play("human-hurt-right");
            
            } else {
                this.anims.play("human-hurt-left");
            }
            this.playSoundEffect = false
            this.scene.time.delayedCall(200, () => this.soundEffectManager())
            //this.scene.sound.play('npcHurt')
        }
    }
    changeDirection() {
        if (this.currentState != 'walking') {
            console.log( this)
            this.setVelocity(0, 0)
            return
        }

        let xVel = this.body.velocity.x;
        let yVel = this.body.velocity.y;
        if (this.direction == 0) {
            yVel = -yVel;
        } else if (this.direction == 1) {
            this.facing = "left";

            xVel = -xVel;
        } else if (this.direction == 2) {
            yVel = -yVel;
        } else {
            this.facing = "right";

            xVel = -xVel;
        }
        // play the correct animation
        if (xVel === 0 && yVel === 0) {
            if (this.facing === "left") {
                
                this.anims.play("human-idle-left", true);
            } else {
                this.anims.play("human-idle-right", true);
            }
        } else {
            if (this.facing === "left") {
                
                this.anims.play("human-walk-left", true);
            } else {
                this.anims.play("human-walk-right", true);
            }
        }
        this.setVelocity(xVel, yVel);
        // this.body.velocity.x = xVel
        // this.body.velocity.y = yVel

        return Math.Between(0, 3);
    }

    handleCollision() {
        if (this.currentState != 'walking') {
            
            
            return
        }

        let newDir = Math.Between(0, 3);

        while (newDir == this.direction) {
            newDir = Math.Between(0, 3);
        }
        return newDir;
    }
    preUpdate(t, dt) {
        super.preUpdate(t, dt);
        if (this.currentState != 'walking') {
            return
        }

        const velocity = Math.Between(30, 150);
        let xVel = this.body.velocity.x;
        let yVel = this.body.velocity.y;
        if (this.direction === 0) {
            yVel = -velocity;
        } else if (this.direction === 1) {
            this.facing = "right";

            xVel = velocity;
        } else if (this.direction === 2) {
            yVel = velocity;
        } else {
            this.facing = "left";

            xVel = -velocity;
        }
        // play the correct animation
        if (xVel === 0 && yVel === 0) {
            if (this.facing === "left") {
                this.anims.play("human-idle-left", true);
            } else {
                this.anims.play("human-idle-right", true);
            }
        } else {
            if (this.facing === "left") {
                this.anims.play("human-walk-left", true);
            } else {
                this.anims.play("human-walk-right", true);
            }
        }
        
        this.setVelocity(xVel, yVel);
    }
    soundEffectManager() {
        this.scene.sound.play('npcHurt')
        
        
    }
    updatePosition(scene) {
        scene.worldData[this.id].xPos =  this.x   
        scene.worldData[this.id].yPos = this.y
        scene.worldData[this.id].currentState = this.currentState
    }
    
}

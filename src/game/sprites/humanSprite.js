import { Physics, Math } from "phaser";

export class humanSprite extends Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
        this.direction = 1;
        this.facing = "right";
        this.currentState = 'walking';

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
        scene.physics.world.on(
            Physics.Arcade.Events.COLLIDE,
            this.handleCollision,
            this
        );
        //scene.physics.world.on('collision', this.handleCollision, this);
    }
    destroy(fromScene) {
        this.moveEvent.destroy();
        super.destroy(fromScene);
    }

    // let's have our NPCs move around at random - None of this is working
    killNPC() {
        
        this.currentState = 'smacked'
        this.setVelocity(0, 0)
        
        if (this.facing == "right") {
            this.anims.play("human-hurt-right");
        } else {
            this.anims.play("human-hurt-left");
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
                this.anims.play("human-idle-left");
            } else {
                this.anims.play("human-idle-right");
            }
        } else {
            if (this.facing === "left") {
                this.anims.play("human-walk-left");
            } else {
                this.anims.play("human-walk-right");
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
                this.anims.play("human-idle-left");
            } else {
                this.anims.play("human-idle-right");
            }
        } else {
            if (this.facing === "left") {
                this.anims.play("human-walk-left");
            } else {
                this.anims.play("human-walk-right");
            }
        }
        
        this.setVelocity(xVel, yVel);
    }
}

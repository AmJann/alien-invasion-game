import humans from "../humans";

export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.inventory = [humans[1]];
        this.currentDirection = "right";
        this.currentState = "walking";
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.speed = 150;
        this.weapon = this.scene.physics.add.sprite(-50, -50);
        this.weapon.setSize(30, 15);
        this.weapon.setActive(false).setVisible(false);
    }

    addHumanToInventory(human) {
        if (this.inventory.length <= 5) {
            this.inventory.push(human);
        }
    }

    removeItemFromInventory(human) {
        const index = this.inventory.indexOf(human);
        if (index !== -1) {
            this.inventory.splice(index, 1);
        }
    }
    swingWeapon(direction) {
        if (direction == "right") {
            this.anims.play("player-attack-right", true);
        } else {
            this.anims.play("player-attack-left", true);
        }
    }
    hasHuman(human) {
        return this.inventory.includes(human);
    }

    humanList() {
        return this.inventory;
    }
    drawWeapon(x, y, obj) {
        obj.setActive(true);
        obj.setVisible(true);

        obj.setPosition(x, y);

        //setTimeout(this.sheathWeapon, 250, obj)
        this.scene.time.delayedCall(300, this.sheathWeapon, [obj]);
    }
    sheathWeapon(obj) {
        obj.setPosition(-50, -50);
    }
    animsManager(direction, state, xVel, yVel) {
        if (state === "attacking") {
            if (direction == "left") {
                this.anims.play("player-attack-left", true);
            } else {
                this.anims.play("player-attack-right", true);
            }
        } else if ((state === "walking" && xVel != 0) || yVel != 0) {
            if (direction == "left") {
                this.anims.play("player-walk-left", true);
            } else {
                this.anims.play("player-walk-right", true);
            }
        } else {
            if (direction == "left") {
                this.anims.play("player-idle-left", true);
            } else {
                this.anims.play("player-idle-right", true);
            }
        }
    }
    preUpdate(t, dt) {
        super.preUpdate(t, dt);
        //player walk right
        let velX = 0;
        let velY = 0;
        // player walk right
        if (this.cursors.right.isDown) {
            velX = this.speed;
            this.currentDirection = "right";
        }

        // player walk left
        if (this.cursors.left.isDown) {
            velX = -this.speed;
            this.currentDirection = "left";
        }

        // player walk up with character facing left or right based on current direction
        if (this.cursors.up.isDown && this.currentDirection === "left") {
            velY = -this.speed;
        } else if (
            this.cursors.up.isDown &&
            this.currentDirection === "right"
        ) {
            velY = -this.speed;
        }

        //player walk down with character facing left or right based on current direction
        if (this.cursors.down.isDown && this.currentDirection === "left") {
            velY = this.speed;
        } else if (
            this.cursors.down.isDown &&
            this.currentDirection === "right"
        ) {
            velY = this.speed;
        }

        // player attack right
        if (this.cursors.space.isDown) {
            this.currentState = "attacking";
            this.swingWeapon(this.currentDirection);
            this.scene.time.delayedCall(350, () => {
                const xPos = this.body.x;
                const yPos = this.body.y;
                if (this.currentDirection === "left") {
                    this.drawWeapon(xPos - 12, yPos - 2, this.weapon);
                } else {
                    this.drawWeapon(xPos + 12, yPos - 2, this.weapon);
                }
            });
            this.scene.time.delayedCall(750, () => {
                this.currentState = "walking";
            });
        }

        this.setVelocity(velX, velY);
        this.animsManager(this.currentDirection, this.currentState, velX, velY);
    }
    update() {
        super.update();
    }
}

import humans from "../humans";

export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.inventory = [humans[1]];
        this.currentDirection = 'right'
        this.currentState = 'walking'
        this.cursors = this.scene.input.keyboard.createCursorKeys()
        this.speed = 150
        this.currentDirection = 'right'
        this.weapon = this.scene.add.sprite(-50, -50)
        this.weapon.setSize(25, 10);
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
    swingWeapon() {
        if (this.currentDirection == 'right') {
            this.anims.play('player-attack-right', true)
        } else {
            this.anims.play('player-attack-left', true)
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
    preUpdate(t, dt) {
        super.preUpdate(t, dt);
        //player walk right
        let velX = 0;
        let velY = 0;
        //if(this.currentState == 'walking'){
        if (this.cursors.right.isDown) {
            velX = this.speed;
            this.anims.play("player-walk-right");
            this.currentDirection = "right";
            this.currentDirection = 'right'
        }

        //player walk left
        if (this.cursors.left.isDown) {
            velX = -this.speed;
            this.anims.play("player-walk-left");
            this.currentDirection = "left";
            this.currentDirection = 'left'
        }

        //player walk up with character facing left or right based on current direction
        if (this.cursors.up.isDown && this.currentDirection === "left") {
            velY = -this.speed;

            this.anims.play("player-walk-left");
        } else if (this.cursors.up.isDown && this.currentDirection === "right") {
            velY = -this.speed;

            this.anims.play("player-walk-right");
        }

        //player walk down with character facing left or right based on current direction
        if (this.cursors.down.isDown && this.currentDirection === "left") {
            velY = this.speed;

            this.anims.play("player-walk-left");
        } else if (this.cursors.down.isDown && this.currentDirection === "right") {
            velY = this.speed;
            this.anims.play("player-walk-right");
        }

        //player idle left or right based on current direction
        if (velX === 0 && velY === 0 && this.currentDirection === "left") {
            this.anims.play("player-idle-left");
        } else if (velX === 0 && velY === 0 && this.currentDirection === "right") {
            this.anims.play("player-idle-right");
        }
    //}
        // player attack right
        if (this.cursors.space.isDown) {
            // we'll need some method on the player sprite
            const xPos = this.x;
            const yPos = this.y;
            this.currentState = 'attacking'
            if (this.currentDirection === "left") {
                this.currentDirection = 'left'
                this.swingWeapon()
                this.drawWeapon(xPos - 8, yPos - 5, this.weapon);
            } else {
                this.currentDirection = 'right'
                this.swingWeapon()
                this.drawWeapon(xPos + 8, yPos - 5, this.weapon);
            }
            this.scene.time.delayedCall(600, ()=> {this.currentState = 'walking'})
        }
        //keeps player from continuing to move after pressing key
        this.setVelocity(velX, velY);

    }
}

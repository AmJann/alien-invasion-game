import Phaser from "phaser";

export class humanSprite extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)

        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
        this.direction = 1
        //this.setScale(2);
        scene.physics.world.enableBody(this);
        //this.setImmovable(true);
        // this.moveEvent = scene.time.addEvent({
        //     delay: 500,
        //     callback: () => {
        //         this.direction = this.changeDirection(this.direction)
        //     },
        //     loop: true
        // })   
       
    }

    // let's have our NPCs move around at random

    changeDirection(direction) {
        let newDirection = Phaser.Math.Between(0, 3)
        while (newDirection === direction) {
            newDirection - Phaser.Math.Between(0,3)
        }

    }
    // handleCollision(obj, tile) {
    //     if (obj !== tile) {
    //         return
    //     }
    //     this.direction = this.changeDirection(this.direction)
    // }
    preUpdate(t, dt){
        super.preUpdate(t, dt)
        
        const velocity = 50
        let xVel = 0
        let yVel = 0
        if (this.direction === 0) {
            yVel = -velocity
        } else if(this.direction === 1){
            xVel = velocity
        } else if(this.direction === 2){
            yVel = velocity
        } else {
            xVel = -velocity
        }
        this.setVelocity(xVel, yVel)
    }
}
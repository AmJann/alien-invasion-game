import { Math, Physics } from "phaser";



export class humanSprite extends Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)

        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
        this.direction = 1
        this.facing = 'right'
        //this.setScale(2);
        scene.physics.world.enableBody(this);
        //this.setImmovable(true);
        this.moveEvent = scene.time.addEvent({
            delay: Math.Between(500,2500),
            callback: () => {
                this.direction = this.changeDirection(this.direction)
            },
            loop: true
        })   
        scene.physics.world.on(Physics.Arcade.Events.COLLIDE, this.handleCollision, this)
       
    }
    destroy(fromScene) {
        this.moveEvent.destroy()
        super.destroy(fromScene)
    }

    // let's have our NPCs move around at random - None of this is working

    changeDirection(direction) {
        let newDirection = Math.Between(0, 3)
        // while (newDirection === direction) {
        //     newDirection = Math.Between(0,3)
        // }
        return newDirection

    }
    
    handleCollision() {
        
        this.direction = () => {
            let newDir = Math.Between(0, 3)
            while (newDir === this.direction) {
                newDir = Math.Between(0, 3)
            }
            return newDir       
        }

        
        
        
        
    }
    preUpdate(t, dt){
        super.preUpdate(t, dt)
        
        const velocity = Math.RND.between(0,55)
        let xVel = 0
        let yVel = 0
        if (this.direction === 0) {
            yVel -= velocity
        } else if (this.direction === 1) {
            this.facing = 'right'
            
            xVel += velocity
        } else if(this.direction === 2){
            yVel += velocity
        } else {

            this.facing = 'left'
            
            xVel -= velocity
        }
        // play the correct animation
        if (xVel === 0 && yVel === 0) {
            
            if (this.facing === 'left') {
                
                this.anims.play('human-idle-left')
            } else {
                this.anims.play('human-idle-right')
            }
        } else {
            if (this.facing === 'left') {
                this.anims.play('human-walk-left')
            } else {
                this.anims.play('human-walk-right')
            }
        }
        this.setVelocity(xVel, yVel)
        
    }
}
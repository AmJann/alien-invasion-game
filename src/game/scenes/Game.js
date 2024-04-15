import { EventBus } from "../EventBus";
import { Input, Scene } from "phaser";
import AnimatedTiles from "phaser-animated-tiles-phaser3.5/dist/AnimatedTiles.min.js";
//sets players current direction
let currentDirection = "right";
//sets player movement speed
let speed = 150;

export class Game extends Scene {
    constructor() {
        super("Game");
        this.player;
        this.human
    }
    preload() {
        this.load.image(
            "embeddedTiles",
            import.meta.env.BASE_URL + "assets/embeddedTiles.png"
        );
        this.load.tilemapTiledJSON(
            "alienGameMap3",
            import.meta.env.BASE_URL + "assets/alienGameMap3.tmj"
        );
        this.load.scenePlugin(
            "animatedTiles",
            AnimatedTiles,
            "animatedTiles",
            "animatedTiles"
        );

        this.load.spritesheet(
            "player",
            import.meta.env.BASE_URL + "assets/goblin_spritesheet.png",
            { frameWidth: 16, frameHeight: 16 }
        );
    }

    create() {
        const map = this.make.tilemap({
            key: "alienGameMap3",
            tileWidth: 16,
            tileHeight: 16,
        });
        this.sys.animatedTiles.init(map);
        const tileset = map.addTilesetImage("embeddedTiles", "embeddedTiles");
        const groundLayer1 = map.createLayer("groundLayer1", tileset, 0, 0);
        const groundLayer2 = map.createLayer("groundLayer2", tileset, 0, 0);
        const groundLayer3 = map.createLayer("groundLayer3", tileset, 0, 0);
        const layer2 = map.createLayer("TileLayer2", tileset, 0, 0);
        const layer3 = map.createLayer("TileLayer3", tileset, 0, 0);
        const layer4 = map.createLayer("TileLayer4", tileset, 0, 0);
        this.animatedTiles.init(map);
        //adds player with physics
        const player = (this.player = this.physics.add.sprite(
            300,
            400,
            "player",
            "goblin_idle_1.png"
        ));
        //sets size of collision box for player
        this.player.body.setSize(8, 10);
        const player2 = (this.player2 = this.physics.add.sprite(
            350,
            400,
            "player",
            "goblin_hurt_1.png"
        ));
        this.player2.body.setSize(12,16)
        const human = (this.human = this.physics.add.sprite(
            400,
            400,
            'human',
            'base_idle_1.png'
        ));
        this.human.body.setSize(22,26)
        //creates keys for movement to be used in update funcion further down
        this.cursors = this.input.keyboard.createCursorKeys();

        //sets collisions for player and human amongst these layers
        this.physics.add.collider(this.player, layer2);
        this.physics.add.collider(this.player, layer4);
        this.physics.add.collider(this.player, groundLayer1);
        this.physics.add.collider(this.player2, layer2);
        this.physics.add.collider(this.player2, layer4);
        this.physics.add.collider(this.player2, groundLayer1);
        this.physics.add.collider(this.human, layer2);
        this.physics.add.collider(this.human, layer4);
        this.physics.add.collider(this.human, groundLayer1);
        
        // set collisions for player and NPC
        this.physics.add.collider(this.player, this.human, )
        this.physics.add.collider(this.player, this.player2)
        //sets collisions by tile id in layers
        layer2.setCollisionBetween(1, 3000);
        layer4.setCollisionBetween(1, 357);
        layer4.setCollisionBetween(359, 3000);
        groundLayer1.setCollisionBetween(162, 167);
        groundLayer1.setCollisionBetween(1226, 1231);
        groundLayer1.setCollisionBetween(1290, 1295);
        groundLayer1.setCollisionBetween(1354, 1359);

        this.cameras.main.startFollow(player);
        this.cameras.main.setZoom(3, 3);

        this.anims.create({
            key: "player-walk-right",
            frames: this.anims.generateFrameNames("player", {
                start: 1,
                end: 8,
                prefix: "goblin_walk_",
                suffix: ".png",
            }),
            repeat: -1,
            frameRate: 12,
        });
        this.anims.create({
            key: "player-walk-left",
            frames: this.anims.generateFrameNames("player", {
                start: 1,
                end: 8,
                prefix: "goblin_walk_left_",
                suffix: ".png",
            }),
            repeat: -1,
            frameRate: 12,
        });

        this.anims.create({
            key: "player-idle-right",
            frames: this.anims.generateFrameNames("player", {
                start: 1,
                end: 8,
                prefix: "goblin_idle_",
                suffix: ".png",
            }),
            repeat: -1,
            frameRate: 12,
        });

        this.anims.create({
            key: "player-idle-left",
            frames: this.anims.generateFrameNames("player", {
                start: 1,
                end: 8,
                prefix: "goblin_idle_left_",
                suffix: ".png",
            }),
            repeat: -1,
            frameRate: 12,
        });
        this.anims.create({
            key: "player-hurt-right",
            frames: this.anims.generateFrameNames("player", {
                start: 1,
                end: 8,
                prefix: "goblin_hurt_",
                suffix: ".png",
            }),
            frameRate: 12,
        });
        this.anims.create({
            key: "player-hurt-left",
            frames: this.anims.generateFrameNames("player", {
                start: 1,
                end: 8,
                prefix: "goblin_hurt_left_",
                suffix: ".png",
            }),
            frameRate: 12,
        });
        this.anims.create({
            key: "player-attack-right",
            frames: this.anims.generateFrameNames("player", {
                start: 1,
                end: 9,
                prefix: "goblin_attack_",
                suffix: ".png",
            }),
            repeat: -1,
            frameRate: 12,
        });
        this.anims.create({
            key: "player-attack-left",
            frames: this.anims.generateFrameNames("player", {
                start: 1,
                end: 8,
                prefix: "goblin_attack_left_",
                suffix: ".png",
            }),
            repeat: -1,
            frameRate: 12,
        });


        // Human Animations
        this.anims.create({
            key: "human-idle-right",
            frames: this.anims.generateFrameNames("human", {
                start: 1,
                end: 9,
                prefix: "base_idle_",
                suffix: ".png",
            }),
            repeat: -1,
            frameRate: 12,
        });

        this.anims.create({
            key: "human-idle-left",
            frames: this.anims.generateFrameNames("human", {
                start: 1,
                end: 9,
                prefix: "base_idle_left_",
                suffix: ".png",
            }),
            repeat: -1,
            frameRate: 12,
        });


        player.anims.play("player-walk-right");
        player2.anims.play("player-hurt-right");
        human.anims.play('human-idle-right')
        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        this.scene.start("GameOver");
    }
    something(direction) {
        if (direction === 'left'){
            this.player.anims.play("player-attack-left", true);
        }
        else {
            this.player.anims.play("player-attack-right", true);
        }
    }
    update() {
        // keeps players and NPCs from moving when they collide
        this.human.setVelocityX(0)
        this.human.setVelocityY(0)
        this.player2.setVelocityX(0)
        this.player2.setVelocityY(0)

        //keeps player from continuing to move after pressing key
        this.player.setVelocityX(0);
        this.player.setVelocityY(0);
       


        //player walk right
        if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed);
            this.player.anims.play("player-walk-right", true);
            currentDirection = "right";
        }

        //player walk left
        else if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed);
            this.player.anims.play("player-walk-left", true);
            currentDirection = "left";
        }

        //player walk up with character facing left or right based on current direction
        else if (this.cursors.up.isDown && currentDirection === "left") {
            this.player.setVelocityY(-speed);
            this.player.anims.play("player-walk-left", true);
        } else if (this.cursors.up.isDown && currentDirection === "right") {
            this.player.setVelocityY(-speed);
            this.player.anims.play("player-walk-right", true);
        }

        //player walk down with character facing left or right based on current direction
        else if (this.cursors.down.isDown && currentDirection === "left") {
            this.player.setVelocityY(speed);
            this.player.anims.play("player-walk-left", true);
        } else if (this.cursors.down.isDown && currentDirection === "right") {
            this.player.setVelocityY(speed);
            this.player.anims.play("player-walk-right", true);
        }

        //player idle left or right based on current direction
        else if (currentDirection === "left") {
            this.player.setVelocityX(0);
            this.player.anims.play("player-idle-left", true);
        } else if (currentDirection === "right") {
            this.player.setVelocityX(0);
            this.player.anims.play("player-idle-right", true);
        }
        // player attack right
        if (Input.Keyboard.JustDown(this.cursors.space) && currentDirection == 'right') {
            // we'll need some method on the player sprite
            this.something('right')
            
        }
        // player attack left
        if (this.cursors.space.isDown && currentDirection == 'left') {
            // we'll need some method on the player sprite
            this.something('left')
            
            
        }
    }
}

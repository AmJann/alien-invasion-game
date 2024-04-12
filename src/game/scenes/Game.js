import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import AnimatedTiles from "phaser-animated-tiles-phaser3.5/dist/AnimatedTiles.min.js";
//sets players current direction
let currentDirection = "right";
//sets player movement speed
let speed = 150;

export class Game extends Scene {
    constructor() {
        super("Game");
        this.player;
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
        this.textures.addSpriteSheetFromAtlas('npc',
            {
                frameWidth: 16, frameHeight: 16, atlas: 'humans', frame: 'base_idle_1.png'
            })
        this.textures.addSpriteSheetFromAtlas('npc_longhair',
        {
            frameWidth: 16, frameHeight: 16, atlas: 'humans', frame: 'longhair_idle_1.png'
        })
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
        this.player.body.setSize(8, 6);
        const player2 = this.add.sprite(
            350,
            400,
            "player",
            "goblin_hurt_1.png"
        );
        
        //creates keys for movement to be used in update funcion further down
        this.cursors = this.input.keyboard.createCursorKeys();

        //sets collisions for player amongst these layers
        this.physics.add.collider(this.player, layer2);
        this.physics.add.collider(this.player, layer4);
        this.physics.add.collider(this.player, groundLayer1);

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
            repeat: -1,
            frameRate: 12,
        });

        // human animations
        this.anims.create({
            key: 'human-walk-right',
            frames: this.anims.generateFrameNames('humans', { start: 1, end: 8, prefix: 'base_walking_', suffix: '.png' }), 
            repeat: -1,
            frameRate: 12
        })
        this.anims.create({
            key: 'human-idle-right',
            frames: this.anims.generateFrameNames('humans', { start: 1, end: 9, prefix: 'base_idle_', suffix: '.png' }), 
            repeat: -1,
            frameRate: 12
        })
        this.anims.create({
            key: 'human-hurt-right',
            frames: this.anims.generateFrameNames('humans', { start: 1, end: 8, prefix: 'base_hurt_', suffix: '.png' }), 
            repeat: -1,
            frameRate: 12
        })

        
        this.anims.create({
            key: 'human-longhair-hurt-right',
            frames: this.anims.generateFrameNames('humans', { start: 1, end: 8, prefix: 'longhair_hurt_', suffix: '.png' }), 
            repeat: -1,
            frameRate: 12
        })
        this.anims.create({
            key: 'human-longhair-idle-right',
            frames: this.anims.generateFrameNames('humans', { start: 1, end: 9, prefix: 'longhair_idle_', suffix: '.png' }), 
            repeat: -1,
            frameRate: 12
        })
        // create human NPC
        //const human3 = this.add.container(400, 400, [this.add.sprite(0,0, 'npc'), this.add.sprite(0,0, 'npc_longhair')])
        let human4 = this.add.sprite(350, 450, 'npc')
        
        let longhair = this.add.sprite(350, 450, 'npc_longhair')
        
        this.human3 = this.add.container(350, 450, [human4, longhair])
        player.anims.play("player-walk-right");
        player2.anims.play("player-hurt-right");
        this.human3.list[0].play('human-idle-right')
        this.human3.list[1].play('human-longhair-idle-right')
        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        this.scene.start("GameOver");
    }

    update() {
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
    }
}

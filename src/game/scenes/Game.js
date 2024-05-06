import { EventBus } from "../EventBus";
import { Scene, Math } from "phaser";
import AnimatedTiles from "phaser-animated-tiles-phaser3.5/dist/AnimatedTiles.min.js";
import { Player } from "../sprites/Player";
import { humanSprite } from "../sprites/humanSprite";
import { createAnimations } from "../animations";

//sets players current direction
let currentDirection = "right";
//sets player movement speed
let speed = 150;

export class Game extends Scene {
    constructor() {
        super("Game");
        this.player;
        this.human;
        this.playerPosition = { x: 300, y: 400 };
        this.weapon;
    }
    preload() {
        this.load.image(
            "gameTiles",
            import.meta.env.BASE_URL + "assets/gameTiles.png"
        );
        this.load.tilemapTiledJSON(
            "alienMap",
            import.meta.env.BASE_URL + "assets/alienMap.json"
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
        this.load.spritesheet(
            "humans",
            import.meta.env.BASE_URL + " assets/humans_phaser3.png",
            { frameWidth: 16, frameHeight: 16 }
        );
        this.textures.addSpriteSheetFromAtlas("npc", {
            frameWidth: 16,
            frameHeight: 16,
            atlas: "humans",
            frame: "base_idle_1.png",
        });
        this.textures.addSpriteSheetFromAtlas("npc_longhair", {
            frameWidth: 16,
            frameHeight: 16,
            atlas: "humans",
            frame: "longhair_idle_1.png",
        });
    }

    create() {
        this.add.image(
            "gameTiles",
            import.meta.env.BASE_URL + "assets/gameTiles.png"
        );

        const map = this.make.tilemap({
            key: "alienMap",
            tileWidth: 16,
            tileHeight: 16,
        });
        this.sys.animatedTiles.init(map);

        const tileset = map.addTilesetImage("gameTiles", "gameTiles");
        //const groundLayer =
        map.createLayer("groundLayer", tileset, 0, 0);
        const waterLayer = map.createLayer("waterLayer", tileset, 0, 0);
        //const groundEdgesLayer =
        map.createLayer("groundEdgesLayer", tileset, 0, 0);
        const moundsRocks = map.createLayer("moundsRocks", tileset, 0, 0);
        const elevatedGroundLayer = map.createLayer(
            "elevatedGroundLayer",
            tileset,
            0,
            0
        );
        // const bridgeLadder =
        map.createLayer("bridgeLadder", tileset, 0, 0);
        const bridgePosts = map.createLayer("bridgePosts", tileset, 0, 0);
        const crops = map.createLayer("crops", tileset, 0, 0);
        const houseLayer1 = map.createLayer("houseLayer1", tileset, 0, 0);
        const houseLayer2 = map.createLayer("houseLayer2", tileset, 0, 0);
        const treeLayer = map.createLayer("treeLayer", tileset, 0, 0);
        const fenceLayer = map.createLayer("fenceLayer", tileset, 0, 0);
        //const flowers =
        map.createLayer("flowers", tileset, 0, 0);

        this.animatedTiles.init(map);
        const human = (this.human = this.physics.add.sprite(
            400,
            400,
            "humans",
            "base_idle_1.png"
        ));

        this.human.body.setSize(22, 20);
        human.setPushable(false);
        //adds player with physics

        const player = (this.player = new Player(
            this,
            this.playerPosition.x,
            this.playerPosition.y,
            "player",
            "goblin_idle_1.png"
        ));
        //add player position from constructor
        this.player.setPosition(this.playerPosition.x, this.playerPosition.y);

        //sets size of collision box for player
        this.player.body.setSize(8, 10);
        this.player.setPushable(false);
        const weapon = (this.weapon = this.physics.add.sprite(-50, -50));
        weapon.setSize(25, 10);
        weapon.setActive(false).setVisible(false);
        // this.weapon = this.add.group({
        //     defaultKey: 'weapon', maxSize: 10,
        //     createCallback: function hulkSmash(weapon) {
        //         weapon.setName(`drawSword`)
        //         // console.log('created', weapon.name)
        //     },
        //     removeCallback: function hulkSleep(weapon) {
        //         // console.log('weapon go away??', weapon.name)
        //     },

        // })

        const player2 = (this.player2 = this.physics.add.sprite(
            350,
            400,
            "player",
            "goblin_hurt_1.png"
        ));
        this.player2.body.setSize(12, 16);

        //creates keys for movement to be used in update funcion further down
        this.cursors = this.input.keyboard.createCursorKeys();

        //sets collisions for player amongst these layers
        this.physics.add.collider(this.player, waterLayer);
        this.physics.add.collider(this.player, houseLayer1);
        this.physics.add.collider(this.player, houseLayer2);
        this.physics.add.collider(this.player, treeLayer);
        this.physics.add.collider(this.player, moundsRocks);
        this.physics.add.collider(this.player, fenceLayer);
        this.physics.add.collider(this.player, crops);
        this.physics.add.collider(this.player, elevatedGroundLayer);
        this.physics.add.collider(this.player, bridgePosts);

        this.physics.add.collider(this.human, waterLayer);
        this.physics.add.collider(this.human, houseLayer1);
        this.physics.add.collider(this.human, houseLayer2);
        this.physics.add.collider(this.human, treeLayer);
        this.physics.add.collider(this.human, moundsRocks);
        this.physics.add.collider(this.human, fenceLayer);
        this.physics.add.collider(this.human, crops);
        this.physics.add.collider(this.human, elevatedGroundLayer);
        this.physics.add.collider(this.human, bridgePosts);

        // set collisions between NPC and player + world
        this.physics.add.collider(this.player);
        this.physics.add.collider(this.human, this.weapon, () => {
            // console.log("A HIT A HIT");
            this.weapon.setPosition(-50, -50);

            this.human.anims.play("human-hurt-right");

            this.playerPosition = { x: this.player.x, y: this.player.y };
            // console.log(this.playerPosition);

            //fadeout to fight scene
            this.cameras.main.fadeOut(800, 0, 0, 0, (camera, progress) => {
                if (progress === 1) {
                    //passes reference to fight scene and fixes blue border issue with fight scene
                    this.scene.launch("Fight", {
                        playerPosition: this.playerPosition,
                        player: this.player,
                    });
                }
            });
        });

        this.physics.add.collider(this.human, waterLayer);
        this.physics.add.collider(this.human, houseLayer1);
        this.physics.add.collider(this.human, houseLayer2);
        this.physics.add.collider(this.human, treeLayer);
        this.physics.add.collider(this.human, moundsRocks);
        this.physics.add.collider(this.human, fenceLayer);
        this.physics.add.collider(this.human, crops);
        this.physics.add.collider(this.human, elevatedGroundLayer);
        this.physics.add.collider(this.human, bridgePosts);

        //sets collisions by tile id in layers
        waterLayer.setCollisionBetween(1, 3000);
        houseLayer1.setCollisionBetween(1, 3000);
        houseLayer2.setCollisionBetween(1, 3000);
        treeLayer.setCollisionBetween(1, 3000);
        moundsRocks.setCollisionBetween(1, 3000);
        elevatedGroundLayer.setCollisionBetween(1, 3000);
        fenceLayer.setCollisionBetween(1, 3000);
        crops.setCollisionBetween(1, 3000);
        bridgePosts.setCollisionBetween(1, 3000);

        // sets camera and world bounds
        this.cameras.main.setBounds(
            0,
            0,
            map.widthInPixels,
            map.heightInPixels
        );
        this.cameras.main.startFollow(player);
        this.cameras.main.setZoom(2.5, 2.5);
        // supposedly might help us hide tile borders/gaps?
        this.cameras.main.roundPixels = true;
        // prevent player from walking off of the map
        player.setCollideWorldBounds(true);

        createAnimations(this.anims);

        //player.anims.play("player-attack-right");
        player2.anims.play("player-hurt-right");
        human.anims.play("human-walk-right");
        this.cameras.main.shake(900, 0.0007);
        //this.cameras.flash(300);
        //this.cameras.fade(300);

        /////////////
        // Working NPC Code
        ///////////

        for (var i = 0; i < 12; i++) {
            var x = Math.RND.between(0, map.widthInPixels);
            var y = Math.RND.between(0, map.heightInPixels);
            // parameters are x, y, width, height
            //this.spawns.create(x, y, 65, 65);
            let enemy = (this.enemy = new humanSprite(
                this,
                x,
                y,
                "humans",
                "base_idle_1.png"
            ));
            enemy.setSize(12, 15);
            enemy.setPushable(false);
            enemy.setCollideWorldBounds(true);
            this.physics.add.existing(enemy);
            if (enemy.facing === "left") {
                enemy.anims.play("human-walk-left");
            } else {
                enemy.anims.play("human-walk-right");
            }
            enemy.body.onCollide = true;
            this.physics.add.collider(
                enemy,
                waterLayer,
                enemy.handleCollision,
                undefined,
                this
            );
            this.physics.add.collider(
                enemy,
                houseLayer1,
                enemy.handleCollision,
                undefined,
                this
            );
            this.physics.add.collider(
                enemy,
                houseLayer2,
                enemy.handleCollision,
                undefined,
                this
            );
            this.physics.add.collider(
                enemy,
                treeLayer,
                enemy.handleCollision,
                undefined,
                this
            );
            this.physics.add.collider(
                enemy,
                moundsRocks,
                enemy.handleCollision,
                undefined,
                this
            );
            this.physics.add.collider(
                enemy,
                fenceLayer,
                enemy.handleCollision,
                undefined,
                this
            );
            this.physics.add.collider(
                enemy,
                crops,
                enemy.handleCollision,
                undefined,
                this
            );
            this.physics.add.collider(
                enemy,
                elevatedGroundLayer,
                enemy.handleCollision,
                undefined,
                this
            );
            this.physics.add.collider(
                enemy,
                bridgePosts,
                enemy.handleCollision,
                undefined,
                this
            );
            this.physics.add.collider(
                enemy,
                this.player,
                enemy.handleCollision,
                undefined,
                this
            );
            this.physics.add.collider(enemy, this.weapon, () => {
                // console.log("A HIT A HIT");
                this.weapon.setPosition(-50, -50);
                enemy.setVelocity(0, 0);
                //enemy.takeDamage()
                enemy.anims.play("human-hurt-right");

                this.playerPosition = { x: this.player.x, y: this.player.y };

                // console.log(this.playerPosition);

                //fadeout to fight scene
                this.cameras.main.fadeOut(800, 0, 0, 0, (camera, progress) => {
                    if (progress === 1) {
                        //passes reference to fight scene and fixes blue border issue with fight scene
                        this.scene.launch("Fight", {
                            playerPosition: this.playerPosition,
                            player: this.player,
                        });
                    }
                });
            });
        }
        // this.physics.add.overlap(player, this.spawns, this.onNPCZoneEnter, false, this);

        // let npcGroup = this.physics.add.group({
        //     key: 'humans',
        //     maxSize: 12,
        // })
        // for (let z = 0; z < 12; z++){
        //     let x = Math.RND.between(0, map.widthInPixels);
        //     let y = Math.RND.between(0, map.heightInPixels);
        //     let npc = npcGroup.get(x, y)

        // }

        // supposed to listen to the attack animations and wait for them to complete
        //player.on(Phaser.Animations.Events.ANIMA + 'player-attack-right', () => // console.log('did it!'), this)
        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        this.scene.start("GameOver");
    }

    spawnNPCZones() {}
    onNPCZoneEnter() {
        // what happens when player enters NPC Zone
        // shake the world
        //this.cameras.main.shake(300);
        this.cameras.main.flash(300);
        // this.cameras.fade(300);
        let playerX = this.player.x;
        let playerY = this.player.y;
        this.zoneHuman = new humanSprite(
            this,
            playerX + 25,
            playerY,
            "humans",
            "base_idle_1.png"
        );
        this.zoneHuman.body.setSize(22, 20);
        this.zoneHuman.setPushable(false);
    }
    drawWeapon(x, y, obj) {
        obj.setActive(true);
        obj.setVisible(true);

        obj.setPosition(x, y);
        //setTimeout(this.sheathWeapon, 250, obj)
        this.time.delayedCall(300, this.sheathWeapon, [obj]);
    }
    sheathWeapon(obj) {
        obj.setPosition(-50, -50);
    }
    something(direction) {
        if (direction === "left") {
            this.player.anims.play("player-attack-left", true);
        } else {
            this.player.anims.play("player-attack-right", true);
        }
    }

    // changeScene() {
    //     this.scene.start("GameOver");
    // }

    update() {
        //setting player position refernce for transition back from fight scene
        this.playerPosition = { x: this.player.x, y: this.player.y };

        // keeps players and NPCs from moving when they collide
        this.human.setVelocityX(0);
        this.human.setVelocityY(0);
        this.player2.setVelocityX(0);
        this.player2.setVelocityY(0);

        //player walk right
        let velX = 0;
        let velY = 0;
        if (this.cursors.right.isDown) {
            velX = speed;
            this.player.anims.play("player-walk-right", true);
            currentDirection = "right";
        }

        //player walk left
        if (this.cursors.left.isDown) {
            velX = -speed;
            this.player.anims.play("player-walk-left", true);
            currentDirection = "left";
        }

        //player walk up with character facing left or right based on current direction
        if (this.cursors.up.isDown && currentDirection === "left") {
            velY = -speed;

            this.player.anims.play("player-walk-left", true);
        } else if (this.cursors.up.isDown && currentDirection === "right") {
            velY = -speed;

            this.player.anims.play("player-walk-right", true);
        }

        //player walk down with character facing left or right based on current direction
        if (this.cursors.down.isDown && currentDirection === "left") {
            velY = speed;

            this.player.anims.play("player-walk-left", true);
        } else if (this.cursors.down.isDown && currentDirection === "right") {
            velY = speed;
            this.player.anims.play("player-walk-right", true);
        }

        //player idle left or right based on current direction
        if (velX === 0 && velY === 0 && currentDirection === "left") {
            this.player.anims.play("player-idle-left", true);
        } else if (velX === 0 && velY === 0 && currentDirection === "right") {
            this.player.anims.play("player-idle-right", true);
        }
        // player attack right
        if (this.cursors.space.isDown) {
            // we'll need some method on the player sprite
            const xPos = this.player.x;
            const yPos = this.player.y;

            if (currentDirection === "left") {
                //this.player.anims.play('player-attack-left', true)
                this.something(currentDirection);
                this.drawWeapon(xPos - 8, yPos - 5, this.weapon);
            } else {
                this.player.anims.play("player-attack-right", true);
                this.drawWeapon(xPos + 8, yPos - 5, this.weapon);
            }
        }
        //keeps player from continuing to move after pressing key
        this.player.setVelocity(velX, velY);

        // this.time.delayedCall(25000, () => {
        //     this.scene.start("Fight");
        // });

        //this.sheathWeapon(this.weapon)
    }
}

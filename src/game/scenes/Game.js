import { EventBus } from "../EventBus";
import { Scene, Math } from "phaser";
import AnimatedTiles from "phaser-animated-tiles-phaser3.5/dist/AnimatedTiles.min.js";
import { Player } from "../sprites/Player";
import { humanSprite } from "../sprites/humanSprite";
import { createAnimations } from "../animations";

export class Game extends Scene {
    constructor() {
        super("Game");
        this.player;
        this.human;
        this.playerPosition = { x: 300, y: 400 };
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
        this.physics.add.collider(this.human, fenceLayer),
            () => {
                console.log("hit the fence");
            };
        this.physics.add.collider(this.human, crops);
        this.physics.add.collider(this.human, elevatedGroundLayer);
        this.physics.add.collider(this.human, bridgePosts);

        // set collisions between NPC and player + world

        this.physics.add.collider(this.human, this.player.weapon, () => {
            console.log("A HIT A HIT");
            this.player.weapon.setPosition(-50, -50);

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

        // create all player, NPC animations
        createAnimations(this.anims);

        player2.anims.play("player-hurt-right");
        human.anims.play("human-walk-right");
        this.cameras.main.shake(900, 0.0007);

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

            this.physics.add.collider(enemy, this.player.weapon, () => {
                console.log("A HIT A HIT");

                enemy.setVelocity(0, 0);
                enemy.currentState = "smacked";
                enemy.killNPC();

                //fadeout to fight scene
                this.time.delayedCall(800, () => {
                    this.player.currentState = "fightScene";
                    this.cameras.main.fadeOut(
                        800,
                        0,
                        0,
                        0,
                        (camera, progress) => {
                            if (progress === 1) {
                                //passes reference to fight scene and fixes blue border issue with fight scene
                                this.scene.launch("Fight", {
                                    playerPosition: this.playerPosition,
                                    player: this.player,
                                });
                            }
                        }
                    );
                });
            });
        }

        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        this.scene.start("GameOver");
    }

    // Not currently used but an option
    onNPCZoneEnter() {
        // what happens when player enters NPC Zone
        // shake the world

        this.cameras.main.flash(300);

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

        // this.time.delayedCall(25000, () => {
        //     this.scene.start("Fight");
        // });
    }
}

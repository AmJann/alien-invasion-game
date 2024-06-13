import { EventBus } from "../EventBus";
import { Scene, Math } from "phaser";
import AnimatedTiles from "phaser-animated-tiles-phaser3.5/dist/AnimatedTiles.min.js";
import { Player } from "../sprites/Player";
import { humanSprite } from "../sprites/humanSprite";
import { powerUpSprite } from "../sprites/powerUpSprite";
import { createAnimations } from "../animations";
import { bossSprite } from "../sprites/bossSprite";

export class Game extends Scene {
    constructor() {
        super("Game");
        this.player;
        this.playerPosition = { x: 300, y: 400 };
        (this.npcStartPositions = {
            farmer: [Math.RND.between(213, 363), Math.RND.between(276, 363)],
            houseNPC: [Math.RND.between(196, 318), Math.RND.between(117, 131)],
            fieldNPC: [Math.RND.between(110, 360), Math.RND.between(450, 660)],
            forestNPC: [Math.RND.between(650, 795), Math.RND.between(465, 650)],
            lakeNPC: [Math.RND.between(510, 758), Math.RND.between(340, 386)],
            roadNPC: [Math.RND.between(25, 382), Math.RND.between(395, 440)],
            northRoadNPC: [
                Math.RND.between(388, 430),
                Math.RND.between(130, 390),
            ],
            southRoadNPC: [
                Math.RND.between(380, 430),
                Math.RND.between(380, 715),
            ],
        }),
            (this.worldData = {
                removeHumanNPC: false,
            });
        this.npcObjects = {};
        this.createInitialNPCPositions = true;
        //////////////////////
        // debugging variables
        this.flag = true;
        this.counter = 0;
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

        // this.load.spritesheet(
        //     "player",
        //     import.meta.env.BASE_URL + "assets/goblin_spritesheet.png",
        //     { frameWidth: 16, frameHeight: 16 }
        // );
        // this.load.spritesheet(
        //     "humans",
        //     import.meta.env.BASE_URL + " assets/humans_phaser3.png",
        //     { frameWidth: 16, frameHeight: 16 }
        // );
        // this.textures.addSpriteSheetFromAtlas("npc", {
        //     frameWidth: 16,
        //     frameHeight: 16,
        //     atlas: "humans",
        //     frame: "base_idle_1.png",
        // });
        // this.textures.addSpriteSheetFromAtlas("npc_longhair", {
        //     frameWidth: 16,
        //     frameHeight: 16,
        //     atlas: "humans",
        //     frame: "longhair_idle_1.png",
        // });
        // player attack sound effect
        this.load.audio(
            "music",
            import.meta.env.BASE_URL +
                "assets/sound/funny-chase-matt-stewart-evans-main-version-02-12-14899.mp3"
        );
        this.load.audio(
            "playerAttack",
            import.meta.env.BASE_URL + "assets/sound/17_orc_atk_sword_2.wav"
        );
        // npc sound effect
        this.load.audio(
            "npcHurt",
            import.meta.env.BASE_URL + "assets/sound/owie_.wav"
        );
    }

    create() {
        this.music = this.sound.add("music");
        this.music.play();
        this.music.setLoop(true);
        this.add.image(
            "gameTiles",
            import.meta.env.BASE_URL + "assets/gameTiles.png"
        );
        this.sound.add("playerAttack");
        const map = this.make.tilemap({
            key: "alienMap",
            tileWidth: 16,
            tileHeight: 16,
        });
        this.sys.animatedTiles.init(map);

        const tileset = (this.tileset = map.addTilesetImage(
            "gameTiles",
            "gameTiles"
        ));
        //const groundLayer =
        map.createLayer("groundLayer", tileset, 0, 0);
        const waterLayer = (this.waterLayer = map.createLayer(
            "waterLayer",
            tileset,
            0,
            0
        ));
        //const groundEdgesLayer =
        map.createLayer("groundEdgesLayer", tileset, 0, 0);
        const moundsRocks = (this.moundsRocks = map.createLayer(
            "moundsRocks",
            tileset,
            0,
            0
        ));
        const elevatedGroundLayer = (this.elevatedGroundLayer = map.createLayer(
            "elevatedGroundLayer",
            tileset,
            0,
            0
        ));
        // const bridgeLadder =
        map.createLayer("bridgeLadder", tileset, 0, 0);
        const bridgePosts = (this.bridgePosts = map.createLayer(
            "bridgePosts",
            tileset,
            0,
            0
        ));
        const crops = (this.crops = map.createLayer("crops", tileset, 0, 0));
        const houseLayer1 = (this.houseLayer1 = map.createLayer(
            "houseLayer1",
            tileset,
            0,
            0
        ));
        const houseLayer2 = (this.houseLayer2 = map.createLayer(
            "houseLayer2",
            tileset,
            0,
            0
        ));
        const treeLayer = (this.treeLayer = map.createLayer(
            "treeLayer",
            tileset,
            0,
            0
        ));
        const fenceLayer = (this.fenceLayer = map.createLayer(
            "fenceLayer",
            tileset,
            0,
            0
        ));
        //const flowers =
        map.createLayer("flowers", tileset, 0, 0);

        this.animatedTiles.init(map);
        createAnimations(this.anims);

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

        const boss = (this.bossSprite = new bossSprite(
            this,
            645,
            135,
            "player",
            "goblin_idle_1.png"
        ));
        // create powerup
        let shroomCoords = Object.values(this.npcStartPositions);
        const shroomLocationIndex = Math.RND.between(
            0,
            shroomCoords.length - 1
        );
        const powerUp = (this.shroom = new powerUpSprite(
            this,
            shroomCoords[shroomLocationIndex][0],
            shroomCoords[shroomLocationIndex][1],
            "powerup",
            "tile000.png"
        ));
        powerUp.anims.play("shroom-powerup");

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

        this.cameras.main.shake(900, 0.0007);

        /////////////
        // Working NPC Code
        ///////////

        const npcSprites = {
            farmer: this.farmer,
            houseNPC: this.houseNPC,
            fieldNPC: this.fieldNPC,
            forestNPC: this.forestNPC,
            lakeNPC: this.lakeNPC,
            roadNPC: this.roadNPC,
            northRoadNPC: this.northRoadNPC,
            southRoadNPC: this.southRoadNPC,
        };
        // create NPCs once on startup
        if (this.createInitialNPCPositions) {
            this.createInitialNPCPositions = false;
            for (let key in npcSprites) {
                this.worldData[key] = {
                    xPos: this.npcStartPositions[key][0],
                    yPos: this.npcStartPositions[key][1],
                    currentState: "walking",
                    active: "active",
                };

                this.npcObjects[key] = npcSprites[key] = new humanSprite(
                    this,
                    this.npcStartPositions[key][0],
                    this.npcStartPositions[key][1],
                    "humans",
                    "base_idle_1.png",
                    key
                );
            }
        } else {
            this.npcObjects = {};
            for (let key in npcSprites) {
                if (
                    this.worldData[key].currentState === "walking" ||
                    this.worldData.removeHumanNPC == false
                ) {
                    this.npcObjects[key] = npcSprites[key] = new humanSprite(
                        this,
                        this.worldData[key].xPos,
                        this.worldData[key].yPos,
                        "humans",
                        "base_idle_1.png",
                        key
                    );
                } else {
                    this.worldData.removeHumanNPC == false;
                }
            }
        }

        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        this.scene.start("GameOver");
    }

    filterNPCs() {}

    // changeScene() {
    //     this.scene.start("GameOver");
    // }

    update() {
        //setting player position refernce for transition back from fight scene
        this.playerPosition = { x: this.player.x, y: this.player.y };

        // updates the position of every NPC for transition to/from fight scene
        for (let npc in this.npcObjects) {
            this.npcObjects[npc].updatePosition(this);
        }
        if (this.bossSprite.flag) {
            this.bossSprite.flag = false;
            this.time.delayedCall(2500, () => {
                this.bossSprite.flag = true;
                this.bossSprite.changeDirection();
            });
        }
    }
}

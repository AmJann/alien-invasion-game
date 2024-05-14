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
        this.playerPosition = { x: 300, y: 400 };
        this.npcPositions = {}
        this.npcArray = []
        this.createInitialNPCPositions = true
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

        const tileset = this.tileset = map.addTilesetImage("gameTiles", "gameTiles");
        //const groundLayer =
        map.createLayer("groundLayer", tileset, 0, 0);
        const waterLayer = this.waterLayer = map.createLayer("waterLayer", tileset, 0, 0);
        //const groundEdgesLayer =
        map.createLayer("groundEdgesLayer", tileset, 0, 0);
        const moundsRocks = this.moundsRocks = map.createLayer("moundsRocks", tileset, 0, 0);
        const elevatedGroundLayer = this.elevatedGroundLayer = map.createLayer(
            "elevatedGroundLayer",
            tileset,
            0,
            0
        );
        // const bridgeLadder =
        map.createLayer("bridgeLadder", tileset, 0, 0);
        const bridgePosts = this.bridgePosts = map.createLayer("bridgePosts", tileset, 0, 0);
        const crops = this.crops =  map.createLayer("crops", tileset, 0, 0);
        const houseLayer1 = this.houseLayer1 = map.createLayer("houseLayer1", tileset, 0, 0);
        const houseLayer2 = this.houseLayer2 = map.createLayer("houseLayer2", tileset, 0, 0);
        const treeLayer = this.treeLayer = map.createLayer("treeLayer", tileset, 0, 0);
        const fenceLayer = this.fenceLayer = map.createLayer("fenceLayer", tileset, 0, 0);
        //const flowers =
        map.createLayer("flowers", tileset, 0, 0);

        this.animatedTiles.init(map);
        
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
        createAnimations(this.anims);

       
        this.cameras.main.shake(900, 0.0007);

        /////////////
        // Working NPC Code
        ///////////
        
        console.log(this.npcPositions)
        const initialNPCPositions = [
            ['farmer' ,Math.RND.between(213, 363), Math.RND.between(276, 363)],
            ['houseNPC' ,Math.RND.between(196, 318), Math.RND.between(117, 131)],
            ['fieldNPC' ,Math.RND.between(110, 360), Math.RND.between(450, 660)],
            ['forestNPC' ,Math.RND.between(650, 795), Math.RND.between(465, 650)],
            ['lakeNPC' ,Math.RND.between(510, 758), Math.RND.between(340, 386)],
            ['roadNPC' ,Math.RND.between(25, 382), Math.RND.between(395, 440)],
            ['northRoadNPC' ,Math.RND.between(388, 430), Math.RND.between(130, 390)],
            ['southRoadNPC' ,Math.RND.between(380, 430), Math.RND.between(380, 715)],
        ]
        if (this.createInitialNPCPositions) {
            this.createInitialNPCPositions = false
            
            for (let index = 0; index < initialNPCPositions.length; index++){
                
                this.npcPositions[initialNPCPositions[index][0]] = {xPos :initialNPCPositions[index][1], yPos:initialNPCPositions[index][2]}
                
            }
            console.log(this.npcPositions)
        }
        this.npcArray = [
            this.farmer = new humanSprite(this, this.npcPositions['farmer'].xPos, this.npcPositions['farmer'].yPos, "humans",
            "base_idle_1.png", 'farmer'
            ),
            this.houseNPC = new humanSprite(this, this.npcPositions['houseNPC'].xPos, this.npcPositions['houseNPC'].yPos, "humans",
                "base_idle_1.png", 'houseNPC'
            ),
            this.fieldNPC = new humanSprite(this, this.npcPositions['fieldNPC'].xPos, this.npcPositions['fieldNPC'].yPos, "humans",
                "base_idle_1.png", 'fieldNPC'
            ),
            this.forestNPC = new humanSprite(this, this.npcPositions['forestNPC'].xPos, this.npcPositions['forestNPC'].yPos, "humans",
                "base_idle_1.png", 'forestNPC'
            ),
            this.lakeNPC = new humanSprite(this, this.npcPositions['lakeNPC'].xPos, this.npcPositions['lakeNPC'].yPos, "humans",
                "base_idle_1.png", 'lakeNPC'
            ),
            this.roadNPC = new humanSprite(this, this.npcPositions['roadNPC'].xPos, this.npcPositions['roadNPC'].yPos, "humans",
                "base_idle_1.png", 'roadNPC'
            ),
            this.northRoadNPC = new humanSprite(this, this.npcPositions['northRoadNPC'].xPos, this.npcPositions['northRoadNPC'].yPos, "humans",
                "base_idle_1.png", 'northRoadNPC'
            ),
            this.southRoadNPC = new humanSprite(this, this.npcPositions['southRoadNPC'].xPos, this.npcPositions['southRoadNPC'].yPos, "humans",
                "base_idle_1.png", 'southRoadNPC'
            ),
        ]
        

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
       
        // updates the position of every NPC for transition to/from fight scene
        this.npcArray.forEach((npc) => {
            npc.updatePosition(this)
            
        });
        if (this.flag) {
            console.log(this.npcPositions)
            this.flag = false
        }
        // console.log(this.npcPositions)

        // this.time.delayedCall(25000, () => {
        //     this.scene.start("Fight");
        // });
    }
}

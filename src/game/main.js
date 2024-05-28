import { Boot } from "./scenes/Boot";
import { Game } from "./scenes/Game";
import { GameOver } from "./scenes/GameOver";
import { MainMenu } from "./scenes/MainMenu";
import Phaser from "phaser";
import { Preloader } from "./scenes/Preloader";
import { Fight } from "./scenes/Fight";
import { Opening } from "./scenes/Opening";
import { Start } from "./scenes/Start";

// Find out more information about the Game Config at:
// https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    scale: {
        width: 800,
        height: 768,
    },
    pixelArt: true,
    parent: "game-container",
    backgroundColor: "#00000",
    scene: [Boot, Preloader, MainMenu, Start, Opening, Game, Fight, GameOver],
    physics: {
        default: "arcade",
        arcade: {
            debug: true, // swapping false for true to see if we get some helpful debug output
        },
    },
};

const StartGame = (parent) => {
    return new Phaser.Game({ ...config, parent });
};

export default StartGame;

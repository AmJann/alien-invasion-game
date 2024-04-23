import { Boot } from "./scenes/Boot";
import { Game } from "./scenes/Game";
import { GameOver } from "./scenes/GameOver";
import { MainMenu } from "./scenes/MainMenu";
import Phaser from "phaser";
import { Preloader } from "./scenes/Preloader";
import { Fight } from "./scenes/Fight";

// Find out more information about the Game Config at:
// https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    // width: 1024,
    width: 800,
    height: 768,
    pixelArt: true,
    parent: "game-container",
    backgroundColor: "#028af8",
    scene: [Boot, Preloader, MainMenu, Game, Fight, GameOver],
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

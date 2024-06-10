import Phaser from "phaser";
import PropTypes from 'prop-types';
import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import { EventBus } from '../game/EventBus';
import { Boot } from "../game/scenes/Boot"
import { Preloader  } from "../game/scenes/Preloader"
import { MainMenu } from "../game/scenes/MainMenu"
import { Start } from "../game/scenes/Start"
import {  Opening } from "../game/scenes/Opening"
import { Game } from "../game/scenes/Game"
import { Fight } from "../game/scenes/Fight"
import { GameOver } from "../game/scenes/GameOver"



const testConfig = {
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

const startTestGame = (parent) => { return new Phaser.Game({ ...testConfig, parent }) };


export const TestPhaserGame = forwardRef(function PhaserGame ({ currentActiveScene }, ref)
{
const game = useRef();
if (testConfig.debug) {
    window.WINDOW_GAME_REF = game
}
// DEBUGGING - added leaky reference to the game instance to the window object
// window.GAME_REF = game
// Create the game inside a useLayoutEffect hook to avoid the game being created outside the DOM
useLayoutEffect(() => {
    
    if (game.current === undefined)
    {
        game.current = startTestGame("game-container");
        
        if (ref !== null)
        {
            ref.current = { game: game.current, scene: null };
        }
    }

    return () => {

        if (game.current)
        {
        
            game.current.destroy(true);
            game.current = undefined;
        }

    }
}, [ref]);

useEffect(() => {

    EventBus.on('current-scene-ready', (currentScene) => {

        if (currentActiveScene instanceof Function)
        {
            currentActiveScene(currentScene);
        }
        ref.current.scene = currentScene;
        
    });

    return () => {

        EventBus.removeListener('current-scene-ready');

    }
    
}, [currentActiveScene, ref])

return (
    <div id="game-container"></div>
);

});

// Props definitions
TestPhaserGame.propTypes = {
currentActiveScene: PropTypes.func 
}
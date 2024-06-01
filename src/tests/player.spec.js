import { expect, test, jest } from '@jest/globals'
import { Player } from '../game/sprites/Player'

// const GameSandbox = 

// const testPlayer = 


test('swingWeapon', () => {
    const newScene = jest.fn((sceneName) => { })
    const newTexture = jest.fn((textureString)=>{})
    let player = new Player(newScene, 0, 0, newTexture)
    const anims = jest.fn((attackName, attackBool) => 0)
    const clock = jest.fn((timer, funct) => 0)
    const direction = 'left' 
    player.swingWeapon(direction, anims, clock)
    expect(anims.calls).toEqual([['player-attack-left', true]])
    expect(clock.calls).toEqual([[200, ()=> 'dont break']])
})
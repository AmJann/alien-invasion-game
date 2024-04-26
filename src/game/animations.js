import { Animations } from "phaser";


export function createAnimations(anims = Animations.anims) {
    


    // Animations
    anims.create({
        key: "player-walk-right",
        frames: anims.generateFrameNames("player", {
            start: 1,
            end: 8,
            prefix: "goblin_walk_",
            suffix: ".png",
        }),
        repeat: -1,
        frameRate: 12,
    });
    anims.create({
        key: "player-walk-left",
        frames: anims.generateFrameNames("player", {
            start: 1,
            end: 8,
            prefix: "goblin_walk_left_",
            suffix: ".png",
        }),
        repeat: -1,
        frameRate: 12,
    });

    anims.create({
        key: "player-idle-right",
        frames: anims.generateFrameNames("player", {
            start: 1,
            end: 8,
            prefix: "goblin_idle_",
            suffix: ".png",
        }),
        repeat: -1,
        frameRate: 12,
    });

    anims.create({
        key: "player-idle-left",
        frames: anims.generateFrameNames("player", {
            start: 1,
            end: 8,
            prefix: "goblin_idle_left_",
            suffix: ".png",
        }),
        repeat: -1,
        frameRate: 12,
    });
    anims.create({
        key: "player-hurt-right",
        frames: anims.generateFrameNames("player", {
            start: 1,
            end: 8,
            prefix: "goblin_hurt_",
            suffix: ".png",
        }),
        frameRate: 12,
    });
    anims.create({
        key: "player-hurt-left",
        frames: anims.generateFrameNames("player", {
            start: 1,
            end: 8,
            prefix: "goblin_hurt_left_",
            suffix: ".png",
        }),
        frameRate: 12,
    });
    anims.create({
        key: "player-attack-right",
        frames: anims.generateFrameNames("player", {
            start: 1,
            end: 9,
            prefix: "goblin_attack_",
            suffix: ".png",
        }),
        repeat: 1,
        frameRate: 12,
    });
    anims.create({
        key: "player-attack-left",
        frames: anims.generateFrameNames("player", {
            start: 1,
            end: 8,
            prefix: "goblin_attack_left_",
            suffix: ".png",
        }),
        repeat: 1,
        frameRate: 12,
    });

    // Human Animations
    anims.create({
        key: "human-idle-right",
        frames: anims.generateFrameNames("humans", {
            start: 1,
            end: 9,
            prefix: "base_idle_",
            suffix: ".png",
        }),
        repeat: -1,
        frameRate: 12,
    });

    anims.create({
        key: "human-idle-left",
        frames: anims.generateFrameNames("humans", {
            start: 1,
            end: 9,
            prefix: "base_idle_left_",
            suffix: ".png",
        }),
        repeat: -1,
        frameRate: 12,
    });
    anims.create({
        key: "human-hurt-right",
        frames: anims.generateFrameNames("humans", {
            start: 1,
            end: 8,
            prefix: "base_hurt_",
            suffix: ".png",
        }),
        repeat: 1,
        frameRate: 12,
    });
    anims.create({
        key: "human-walk-right",
        frames: anims.generateFrameNames("humans", {
            start: 1,
            end: 8,
            prefix: "base_walking_",
            suffix: ".png",
        }),
        repeat: -1,
        frameRate: 12,
    });
    anims.create({
        key: "human-walk-left",
        frames: anims.generateFrameNames("humans", {
            start: 1,
            end: 8,
            prefix: "base_walking_left_",
            suffix: ".png",
        }),
        repeat: -1,
        frameRate: 12,
    });



}
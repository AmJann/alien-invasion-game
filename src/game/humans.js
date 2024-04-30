const humans = [
    {
        name: "Clown",
        health: 100,
        maxHealth: 100,
        attack1: {
            name: "Slash",
            damage: 20,
        },
        attack2: {
            name: "Stab",
            damage: 15,
        },
        special: {
            name: "Glitter Strike",
            damage: 30,
        },
        mainImage:
            "assets/characters/humans/no-bg-imgs/clown-char/clown-char-14.png",
        hurtImage: {
            name: "hurtClown",
            path: "assets/characters/humans/no-bg-imgs/clown-char/clown-char-16.png",
        },
        defeatImage: {
            name: "defeatClown",
            path: "assets/characters/humans/no-bg-imgs/clown-char/clown-char-03.png",
        },
    },
    {
        name: "Scientist",
        health: 90,
        maxHealth: 90,
        attack1: {
            name: "Mutagen Meltdown",
            damage: 20,
        },
        attack2: {
            name: "Periodic Pummel",
            damage: 15,
        },
        special: {
            name: "Flask Explosion",
            damage: 35,
        },
        mainImage:
            "assets/characters/humans/no-bg-imgs/scientist-char/4-scientist-char.png",
        hurtImage: {
            name: "hurtScientist",
            path: "assets/characters/humans/no-bg-imgs/scientist-char/1-scientist-char.png",
        },
        defeatImage: {
            name: "defeatScientist",
            path: "assets/characters/humans/no-bg-imgs/scientist-char/2-scientist-char.png",
        },
    },
    {
        name: "Firefighter",
        health: 110,
        maxHealth: 110,
        attack1: {
            name: "Scorch",
            damage: 20,
        },
        attack2: {
            name: "Extinguish Punch",
            damage: 15,
        },
        special: {
            name: "Water Cannon",
            damage: 30,
        },
        mainImage:
            "assets/characters/humans/no-bg-imgs/firefighter-char/8-firefighter-char.png",
        hurtImage: {
            name: "hurtFirefighter",
            path: "assets/characters/humans/no-bg-imgs/firefighter-char/7-firefighter-char.png",
        },
        defeatImage: {
            name: "defeatFirefighter",
            path: "assets/characters/humans/no-bg-imgs/firefighter-char/2-firefighter-char.png",
        },
    },
    {
        name: "Farmer",
        health: 80,
        maxHealth: 80,
        attack1: {
            name: "Pitchfork Punch",
            damage: 20,
        },
        attack2: {
            name: "Hoe Smack",
            damage: 15,
        },
        special: {
            name: "Farm Animal Stampede",
            damage: 35,
        },
        mainImage:
            "assets/characters/humans/no-bg-imgs/farmer-char/8-farmer-char.png",
        hurtImage: {
            name: "hurtFarmer",
            path: "assets/characters/humans/no-bg-imgs/farmer-char/5-farmer-char.png",
        },
        defeatImage: {
            name: "defeatFarmer",
            path: "assets/characters/humans/no-bg-imgs/farmer-char/3-farmer-char.png",
        },
    },
    {
        name: "Nuck Chorris",
        health: 130,
        maxHealth: 130,
        attack1: {
            name: "Roundhouse Kick",
            damage: 25,
        },
        attack2: {
            name: "Uppercut",
            damage: 20,
        },
        special: {
            name: "1000 fists of fury",
            damage: 40,
        },
        mainImage:
            "assets/characters/humans/no-bg-imgs/chuck-char/4-chuck-char.png",
        hurtImage: {
            name: "hurtChuck",
            path: "assets/characters/humans/no-bg-imgs/chuck-char/8-chuck-char.png",
        },
        defeatImage: {
            name: "defeatChuck",
            path: "assets/characters/humans/no-bg-imgs/chuck-char/1-chuck-char.png",
        },
    },
];

export default humans;

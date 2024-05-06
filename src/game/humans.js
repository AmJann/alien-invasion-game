class Human {
    constructor(
        name,
        health,
        maxHealth,
        attack1,
        attack2,
        special,
        mainImage,
        hurtImage,
        defeatImage
    ) {
        this.name = name;
        this.health = health;
        this.maxHealth = maxHealth;
        this.attack1 = attack1;
        this.attack2 = attack2;
        this.special = special;
        this.mainImage = mainImage;
        this.hurtImage = hurtImage;
        this.defeatImage = defeatImage;
    }
}

class Clown extends Human {
    constructor() {
        super(
            "Clown",
            100,
            100,
            { name: "Slash", damage: 20 },
            { name: "Stab", damage: 15 },
            { name: "Glitter Strike", damage: 30 },
            "assets/characters/humans/no-bg-imgs/clown-char/clown-char-14.png",
            {
                name: "hurtClown",
                path: "assets/characters/humans/no-bg-imgs/clown-char/clown-char-16.png",
            },
            {
                name: "defeatClown",
                path: "assets/characters/humans/no-bg-imgs/clown-char/clown-char-03.png",
            }
        );
    }
}

class Scientist extends Human {
    constructor() {
        super(
            "Scientist",
            90,
            90,
            { name: "Mutagen Meltdown", damage: 20 },
            { name: "Periodic Pummel", damage: 15 },
            { name: "Flask Explosion", damage: 35 },
            "assets/characters/humans/no-bg-imgs/scientist-char/4-scientist-char.png",
            {
                name: "hurtScientist",
                path: "assets/characters/humans/no-bg-imgs/scientist-char/1-scientist-char.png",
            },
            {
                name: "defeatScientist",
                path: "assets/characters/humans/no-bg-imgs/scientist-char/2-scientist-char.png",
            }
        );
    }
}

class Firefighter extends Human {
    constructor() {
        super(
            "Firefighter",
            110,
            110,
            { name: "Scorch", damage: 20 },
            { name: "Extinguish Punch", damage: 15 },
            { name: "Water Cannon", damage: 30 },
            "assets/characters/humans/no-bg-imgs/firefighter-char/8-firefighter-char.png",
            {
                name: "hurtFirefighter",
                path: "assets/characters/humans/no-bg-imgs/firefighter-char/7-firefighter-char.png",
            },
            {
                name: "defeatFirefighter",
                path: "assets/characters/humans/no-bg-imgs/firefighter-char/2-firefighter-char.png",
            }
        );
    }
}

class Farmer extends Human {
    constructor() {
        super(
            "Farmer",
            80,
            80,
            { name: "Pitchfork Punch", damage: 20 },
            { name: "Hoe Smack", damage: 15 },
            { name: "Farm Animal Stampede", damage: 35 },
            "assets/characters/humans/no-bg-imgs/farmer-char/8-farmer-char.png",
            {
                name: "hurtFarmer",
                path: "assets/characters/humans/no-bg-imgs/farmer-char/5-farmer-char.png",
            },
            {
                name: "defeatFarmer",
                path: "assets/characters/humans/no-bg-imgs/farmer-char/3-farmer-char.png",
            }
        );
    }
}

class NuckChorris extends Human {
    constructor() {
        super(
            "NuckChorris",
            130,
            130,
            { name: "Roundhouse Kick", damage: 25 },
            { name: "Uppercut", damage: 20 },
            { name: "1000 fists of fury", damage: 40 },
            "assets/characters/humans/no-bg-imgs/chuck-char/4-chuck-char.png",
            {
                name: "hurtChuck",
                path: "assets/characters/humans/no-bg-imgs/chuck-char/8-chuck-char.png",
            },
            {
                name: "defeatChuck",
                path: "assets/characters/humans/no-bg-imgs/chuck-char/1-chuck-char.png",
            }
        );
    }
}

// Add other subclasses similarly

const humans = [
    new Clown(),
    new Scientist(),
    new Firefighter(),
    new Farmer(),
    new NuckChorris(),
];

export { Human, Clown, Scientist, Firefighter, Farmer, NuckChorris, humans };

import {
    Human,
    Clown,
    Scientist,
    Firefighter,
    Farmer,
    NuckChorris,
} from "../../humans";

const humans = [
    new Clown(),
    new Scientist(),
    new Firefighter(),
    new Farmer(),
    new NuckChorris(),
];
let enemy = null;

export function selectRandomEnemy() {
    let randomNum = Math.floor(Math.random() * humans.length);
    enemy = humans[randomNum];

    if (enemy.health < enemy.maxHealth) {
        enemy.health = enemy.maxHealth;
    }
    return enemy;
}

export function playerImages() {
    this.player.inventory.forEach((human) => {
        this.load.image(human.name, import.meta.env.BASE_URL + human.mainImage);
        this.load.image(
            human.defeatImage.name,
            import.meta.env.BASE_URL + human.defeatImage.path
        );
        this.load.image(
            human.hurtImage.name,
            import.meta.env.BASE_URL + human.hurtImage.path
        );
    });
}

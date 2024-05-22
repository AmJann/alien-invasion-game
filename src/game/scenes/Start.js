export class Start extends Phaser.Scene {
    constructor() {
        super("Start");
    }

    preload() {
        this.load.image(
            "stars-bg",
            import.meta.env.BASE_URL + "assets/stars-bg.jpg"
        );
        this.load.image("earth", import.meta.env.BASE_URL + "assets/earth.png");
    }
    create() {
        this.add.image(400, 400, "stars-bg");
        this.earthImg = this.add.image(120, 640, "earth");
        this.showButtons();
    }

    showButtons() {
        let playerData = localStorage.getItem("playerData");
        if (playerData) {
            const resumeButton = this.add
                .text(400, 400, "Resume", {
                    fontSize: "32px",
                    fill: "#ffffff",
                })
                .setOrigin(0.5)
                .setAlpha(0);

            this.tweens.add({
                targets: resumeButton,
                alpha: 1,
                duration: 1000,
                ease: "Power2",
                delay: 200,
            });

            resumeButton.setInteractive();
            resumeButton.on("pointerdown", () => {
                this.scene.start("Opening");
            });
            resumeButton.on("pointerover", () => {
                resumeButton.setStyle({ fill: "#ff0000" });
            });
            resumeButton.on("pointerout", () => {
                resumeButton.setStyle({ fill: "#ffffff" });
            });
        }

        const newGameButton = this.add
            .text(400, 300, "New Game", {
                fontSize: "32px",
                fill: "#ffffff",
            })
            .setOrigin(0.5)
            .setAlpha(0);

        this.tweens.add({
            targets: newGameButton,
            alpha: 1,
            duration: 1000,
            ease: "Power2",
        });

        newGameButton.setInteractive();
        newGameButton.on("pointerdown", () => {
            localStorage.clear();
            this.scene.start("Opening");
        });
        newGameButton.on("pointerover", () => {
            newGameButton.setStyle({ fill: "#ff0000" });
        });
        newGameButton.on("pointerout", () => {
            newGameButton.setStyle({ fill: "#ffffff" });
        });
    }

    update() {
        if (this.earthImg) {
            this.earthImg.rotation += 0.01;
        }
    }
}

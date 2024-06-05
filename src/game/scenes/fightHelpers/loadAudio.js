export function loadAudio(scene) {
    scene.load.audio(
        "runRiot",
        import.meta.env.BASE_URL +
            "assets/sound/run-riot-matt-stewart-evans-main-version-02-03-14904.mp3"
    );

    scene.load.audio(
        "attackSound",
        import.meta.env.BASE_URL + "assets/sound/punch-6.mp3"
    );
}

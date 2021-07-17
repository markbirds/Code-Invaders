class HowToPlayScene extends Phaser.Scene {
  constructor() {
    super({ key: "howToPlayScene" });
  }

  create() {
    // add background
    this.background = this.add
      .tileSprite(0, 0, 0, 0, "background")
      .setDisplaySize(
        config.general.windowWidth,
        config.general.windowWidth * config.game.backgroundRatio
      )
      .setSize(config.general.windowWidth, config.general.windowHeight)
      .setOrigin(0);

    // switch scene with fade
    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
      (cam, effect) => {
        this.scene.stop("howToPlayScene").launch(this.switchSceneTo);
      }
    );

    // html component
    let container = this.add
      .dom(config.general.windowWidth / 2, config.general.windowHeight / 2)
      .createElement("article", config.styles.container, "")
      .setHTML(
        `
      <section class="wrapper">
        <button class="back-button">
          <img src="assets/images/back.png" class="back-button" width="50px">
        </button>
        <div class="how-to-play-content">
          <h2>How to Play</h2>
          <section>
            <h3>Debug Mode</h3>
            <ul>
              <li>Debug mode allows the player to evaluate his or her programming skills through debugging source codes which takes place in each level.</li>
              <li>The levels in this mode will be based on the essential topics of computer programming such as conditional statements and loops.</li>
              <li>Each level will be completed when the player correctly identified the line in which the error occurs. This debugging question will pop up every 2,000 points.</li>
              <li>Unable to kill bugs decreases your current score.</li>
            </ul>
          </section>
          <section style="margin-top:40px">
            <h3>Endless Mode</h3>
            <ul>
              <li>As this mode says, it's ENDLESS! Go play and set your highest score! </li>
            </ul>
          </section>
        </div>
      </section>
      `
      );

    // events
    container.addListener("click");
    container.on("click", (event) => {
      // clicked back button
      if (event.target.className === "back-button") {
        this.game.scene.scenes[0].selectSound.play();
        setTimeout(() => {
          this.tweens.add({
            targets: container,
            duration: 10,
            repeat: 0,
            onComplete: function () {
              container.setAlpha(0);
            },
            callbackScope: this,
          });
          this.switchSceneTo = "menuScene";
          this.cameras.main.fadeOut(250, 0, 0, 0);
        }, 100);
      }
    });
  }

  update() {
    this.background.tilePositionY -= 0.5;
  }
}

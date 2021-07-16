class AboutScene extends Phaser.Scene {
  constructor() {
    super({ key: "aboutScene" });
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
        this.scene.stop("aboutScene").launch(this.switchSceneTo);
      }
    );

    // embedding html
    let container = this.add
      .dom(config.general.windowWidth / 2, config.general.windowHeight / 2)
      .createElement("article", config.styles.container, "")
      .setHTML(
        `
        <section class="wrapper">
          <button class="back-button">
            <img src="assets/images/back.png" class="back-button" width="50px">
          </button>
          <div class="about-content">
            <h2>About</h2>
            <div>Code Invaders is a mobile application that helps users to improve their programming knowledge, especially debugging, in an entertaining and exciting way. This game has a similar gameplay to "Space Invaders" but spaceships will have a look based on the logos of programming languages and the enemies will be bugs. The current available spaceships / programming languages are C++, Java and Python. This game was developed using Cordova and Phaser 3.</div>
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

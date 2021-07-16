class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "menuScene" });
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

    // html component - main menu
    let container = this.add
      .dom(config.general.windowWidth / 2, config.general.windowHeight / 2)
      .createElement("article", config.styles.container, "")
      .setHTML(
        `
        <section class="wrapper">
          <button class="back-button">
            <img src="assets/images/back.png" class="back-button" width="50px">
          </button>
          <button class="button-menu debug-mode">
            <img src="assets/images/texts/debug-mode.png" class="debug-mode" width="80%">
          </button>
          <button class="button-menu endless-mode">
            <img src="assets/images/texts/endless-mode.png" class="endless-mode" width="93%">
          </button>
          <button class="button-menu how-to-play">
            <img src="assets/images/texts/how-to-play.png" class="how-to-play" width="82%">
          </button>
          <button class="button-menu read-tutorials">
            <img src="assets/images/texts/read-tutorials.png" class="read-tutorials" width="100%">
          </button>
          <button class="button-menu about">
            <img src="assets/images/texts/about.png" class="about" width="40%">
          </button>
        </section>
      `
      );

    // switch scenes with fade
    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
      (cam, effect) => {
        // when user selected endless
        if (this.switchSceneTo === "selectScene") {
          // load saved game if there's any
          if (localStorage.getItem("savedScene") !== null) {
            this.scene.stop("menuScene").launch("gameScene", {
              mode: "endless",
              ship: JSON.parse(localStorage.getItem("savedScene"))["player"][
                "ship"
              ],
            });
          }
          // proceed to select scene
          else {
            this.scene
              .stop("menuScene")
              .launch(this.switchSceneTo, { mode: "endless" });
          }
        } else {
          this.scene.stop("menuScene").launch(this.switchSceneTo);
        }
      }
    );

    // events
    container.addListener("click");
    container.on("click", (event) => {
      // clicked back button
      // changing scenes
      if (event.target.className.includes("back-button")) {
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
          this.switchSceneTo = "startScene";
          this.cameras.main.fadeOut(250, 0, 0, 0);
        }, 100);
      } else if (event.target.className.includes("debug-mode")) {
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
          this.switchSceneTo = "topicScene";
          this.cameras.main.fadeOut(250, 0, 0, 0);
        }, 100);
      } else if (event.target.className.includes("endless-mode")) {
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
          this.switchSceneTo = "selectScene";
          this.cameras.main.fadeOut(250, 0, 0, 0);
        }, 100);
      } else if (event.target.className.includes("how-to-play")) {
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
          this.switchSceneTo = "howToPlayScene";
          this.cameras.main.fadeOut(250, 0, 0, 0);
        }, 100);
      } else if (event.target.className.includes("read-tutorials")) {
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
          this.switchSceneTo = "readTutorialScene";
          this.cameras.main.fadeOut(250, 0, 0, 0);
        }, 100);
      } else if (event.target.className.includes("about")) {
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
          this.switchSceneTo = "aboutScene";
          this.cameras.main.fadeOut(250, 0, 0, 0);
        }, 100);
      }
    });
  }

  update() {
    this.background.tilePositionY -= 0.5;
  }
}

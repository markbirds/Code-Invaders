class TopicScene extends Phaser.Scene {
  constructor() {
    super({ key: "topicScene" });
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

    // html component - topics
    let container = this.add
      .dom(config.general.windowWidth / 2, config.general.windowHeight / 2)
      .createElement("article", config.styles.container, "")
      .setHTML(
        `
      <section class="wrapper">
        <button class="back-button">
          <img src="assets/images/back.png" class="back-button" width="50px">
        </button>
        <button class="input-output topics button-menu">
          <img src="assets/images/texts/input-output.png" class="input-output topics" width="98%">
        </button>
        <button class="variables topics button-menu">
          <img src="assets/images/texts/variables.png" class="variables topics" width="76%">
        </button>
        <button class="if-statements topics button-menu">
          <img src="assets/images/texts/if-statements.png" class="if-statements topics" width="100%">
        </button>
        <button class="while-loop topics button-menu">
          <img src="assets/images/texts/while-loop.png" class="while-loop topics" width="82%">
        </button>
        <button class="for-loop topics button-menu">
          <img src="assets/images/texts/for-loop.png" class="for-loop topics" width="65%">
        </button>
        <button class="arrays topics button-menu">
          <img src="assets/images/texts/arrays.png" class="arrays topics" width="50%">
        </button>
        <button class="functions topics button-menu">
          <img src="assets/images/texts/functions.png" class="functions topics" width="65%">
        </button>
        <button class="classes topics button-menu">
          <img src="assets/images/texts/classes.png" class="classes topics" width="60%">
        </button>
      </section>
      `
      );

    // switch scene with fade
    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
      (cam, effect) => {
        this.scene
          .stop("topicScene")
          .launch(this.switchSceneTo, { mode: this.topic });
      }
    );

    // events
    container.addListener("click");
    container.on("click", (event) => {
      // clicked back button
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
          this.switchSceneTo = "menuScene";
          this.cameras.main.fadeOut(250, 0, 0, 0);
        }, 100);
      } else if (event.target.className.includes("topics")) {
        this.game.scene.scenes[0].selectSound.play();
        // available levels for now
        let available = ["input-output", "variables", "if-statements"];
        let topic = event.target.className.split(" ")[0];
        if (available.includes(topic)) {
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
            this.topic = topic;
            this.switchSceneTo = "selectScene";
            this.cameras.main.fadeOut(250, 0, 0, 0);
          }, 100);
        }
      }
    });
  }

  update() {
    this.background.tilePositionY -= 0.5;
  }
}

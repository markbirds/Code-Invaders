class ReadTutorialScene extends Phaser.Scene {
  constructor() {
    super({ key: "readTutorialScene" });
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
        this.scene.stop("readTutorialScene").launch(this.switchSceneTo);
      }
    );

    // html container
    let container = this.add
      .dom(config.general.windowWidth / 2, config.general.windowHeight / 2)
      .createElement("article", config.styles.container, "")
      .setHTML(
        `
        <section class="wrapper">
          <button class="back-button">
            <img src="assets/images/back.png" class="back-button" width="50px">
          </button>
          <div class="read-tutorial-content">
            <h2>Tutorial Links</h2>
            <section>
              <div>
                <h3>C++</h3>
                <ul>
                  <li><a href="https://www.w3schools.com/cpp/" target="_blank">https://www.w3schools.com/cpp/</a></li>
                  <li><a href="https://www.cplusplus.com/doc/tutorial/" target="_blank">https://www.cplusplus.com/doc/tutorial/</a></li>
                  <li><a href="https://www.tutorialspoint.com/cplusplus/index.htm" target="_blank">https://www.tutorialspoint.com/cplusplus/index.htm</a></li>
                </ul>     
              </div>
              <div>
                <h3>Java</h3>
                <ul>
                  <li><a href="https://www.w3schools.com/java/default.asp" target="_blank">https://www.w3schools.com/java/default.asp</a></li>
                  <li><a href="https://docs.oracle.com/javase/tutorial/" target="_blank">https://docs.oracle.com/javase/tutorial/</a></li>
                  <li><a href="https://www.tutorialspoint.com/java/index.htm" target="_blank">https://www.tutorialspoint.com/java/index.htm</a></li>
                </ul>     
              </div>
              <div>
                <h3>Python</h3>
                <ul>
                  <li><a href="https://www.w3schools.com/python/default.asp" target="_blank">https://www.w3schools.com/python/default.asp</a></li>
                  <li><a href="https://docs.python.org/3/tutorial/" target="_blank">https://docs.python.org/3/tutorial/</a></li>
                  <li><a href="https://www.tutorialspoint.com/python/index.htm" target="_blank">https://www.tutorialspoint.com/python/index.htm</a></li>
                </ul>     
              </div>
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

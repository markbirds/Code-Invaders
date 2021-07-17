class SelectScene extends Phaser.Scene {
  constructor() {
    super({ key: "selectScene" });
  }

  init(data) {
    this.mode = data.mode;
    // default selection - cpp with initial x and y
    this.selectBoxX = config.general.windowWidth / 4 - 70;
    this.selectBoxY = config.general.windowHeight / 2 - 65;
    this.selected = "cpp";
    this.selectedShip = "cpp-sprite";

    // x and y of each ships
    this.selectCpp = config.general.windowWidth / 4 - 70 - this.selectBoxX;
    this.selectJava = config.general.windowWidth / 2 - 50 - this.selectBoxX;
    this.selectPython =
      (config.general.windowWidth * 3) / 4 - 30 - this.selectBoxX;
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

    // hmtl
    let container = this.add
      .dom(
        config.general.windowWidth / 2,
        config.general.windowHeight / 2 + 100
      )
      .createElement("div", "", "")
      .setHTML(
        `
        <button class="back-button">
          <img src="assets/images/back.png" class="back-button" width="50px">
        </button>
        <button class="check">
          <img src="assets/images/check.png" class="check" width="50px">
        </button>
      `
      );

    // switch scene with fade
    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
      (cam, effect) => {
        this.scene.stop("selectScene").launch(this.switchSceneTo, {
          mode: this.mode,
          ship: this.selectedShip,
        });
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
      } else if (event.target.className.includes("check")) {
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
          this.switchSceneTo = "gameScene";
          this.cameras.main.fadeOut(250, 0, 0, 0);
        }, 100);
      }
    });

    // label
    this.spaceships = this.add
      .sprite(
        config.general.windowWidth / 2,
        config.general.windowHeight / 2 - 120,
        "spaceships"
      )
      .setScale(0.6);

    // box around the ship
    this.selectBox = this.add.graphics();
    this.selectBox.lineStyle(5, 0x222222, 1);
    this.selectBox.fillStyle(0x343a40, 0.8);
    this.selectBox.fillRect(this.selectBoxX, this.selectBoxY, 100, 120);
    this.selectBox.strokeRect(this.selectBoxX, this.selectBoxY, 100, 120);

    // add ships to the scene
    this.cppSprite = this.physics.add
      .sprite(
        config.general.windowWidth / 4 - 20,
        config.general.windowHeight / 2 - 20,
        "cpp-sprite"
      )
      .setScale(2);
    this.cppSprite.play("cpp-sprite-thrust");
    this.cppSprite.setInteractive();
    // change selection
    this.cppSprite.on("pointerdown", function (pointer) {
      this.scene.changeSelection("cpp");
    });

    this.javaSprite = this.physics.add
      .sprite(
        config.general.windowWidth / 2,
        config.general.windowHeight / 2 - 20,
        "java-sprite"
      )
      .setScale(2);
    this.javaSprite.play("java-sprite-thrust");
    this.javaSprite.setInteractive();
    // change selection
    this.javaSprite.on("pointerdown", function (pointer) {
      this.scene.changeSelection("java");
    });

    this.pythonSprite = this.physics.add
      .sprite(
        (config.general.windowWidth * 3) / 4 + 20,
        config.general.windowHeight / 2 - 20,
        "python-sprite"
      )
      .setScale(2);
    this.pythonSprite.play("python-sprite-thrust");
    this.pythonSprite.setInteractive();
    // change selection
    this.pythonSprite.on("pointerdown", function (pointer) {
      this.scene.changeSelection("python");
    });

    // ship names
    this.cppName = this.add
      .bitmapText(
        config.general.windowWidth / 4 - 20,
        config.general.windowHeight / 2 + 30,
        "pixelFont",
        "C++",
        32
      )
      .setOrigin(0.5, 0.5);
    this.cppName.setInteractive();
    // change selection
    this.cppName.on("pointerdown", function (pointer) {
      this.scene.changeSelection("cpp");
    });

    this.javaName = this.add
      .bitmapText(
        config.general.windowWidth / 2,
        config.general.windowHeight / 2 + 30,
        "pixelFont",
        "Java",
        32
      )
      .setOrigin(0.5, 0.5);
    this.javaName.setInteractive();
    // change selection
    this.javaName.on("pointerdown", function (pointer) {
      this.scene.changeSelection("java");
    });

    this.pythonName = this.add
      .bitmapText(
        (config.general.windowWidth * 3) / 4 + 20,
        config.general.windowHeight / 2 + 30,
        "pixelFont",
        "Python",
        32
      )
      .setOrigin(0.5, 0.5);
    this.pythonName.setInteractive();
    // change selection
    this.pythonName.on("pointerdown", function (pointer) {
      this.scene.changeSelection("python");
    });
  }

  update() {
    this.background.tilePositionY -= 0.5;

    // update position of box
    this.updateBoxPosition(this.selectBox, this.selected);
  }

  changeSelection(language) {
    this.game.scene.scenes[0].selectSound.play();
    this.selected = language;
    this.selectedShip = `${language}-sprite`;
  }

  updateBoxPosition(selectBox, language) {
    let languagesMap = {
      cpp: this.selectCpp,
      java: this.selectJava,
      python: this.selectPython,
    };
    let currentLanguage = languagesMap[language];
    // if newly selected is on the right of the current selection
    if (selectBox.x > currentLanguage) {
      selectBox.x -= 10;
      if (Math.abs(selectBox.x - currentLanguage) < 10) {
        selectBox.x = currentLanguage;
      }
    }
    // if newly selected is on the left of the current selection
    if (selectBox.x < currentLanguage) {
      selectBox.x += 10;
      if (Math.abs(this.selectBox.x - currentLanguage) < 10) {
        selectBox.x = currentLanguage;
      }
    }
  }
}

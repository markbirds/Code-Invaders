class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "gameScene" });
  }

  init(data) {
    // endless mode or debug mode
    this.mode = data.mode;
    this.ship = data.ship;

    // debug mode - show debugging question every 2000 points
    if (this.mode !== "endless") {
      this.debuggingPoints = [2000, 4000, 6000];
      this.debuggingNum = 0;
    }

    this.score = 0;

    // groups
    this.beams = this.add.group();
    this.enemies = this.add.group();
    this.bombsPowerups = this.add.group();

    // number of beams
    this.beamNum = 1;
    // address clicking settings button once opened
    this.settingsDisplayed = false;

    // set this to false when game over
    this.playing = true;
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

    // rectangle background for score
    let graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 0.5);
    graphics.beginPath();
    graphics.moveTo(10, 10);
    graphics.lineTo(220, 10);
    graphics.lineTo(220, 55);
    graphics.lineTo(10, 55);
    graphics.lineTo(10, 10);
    graphics.closePath();
    graphics.fillPath();
    graphics.setDepth(2);

    // zero padding for score
    let scoreFormated = this.zeroPad(this.score, 6);
    // score
    this.scoreLabel = this.add
      .bitmapText(20, 20, "pixelFont", "SCORE " + scoreFormated, 40)
      .setDepth(2);

    // switch to menuScene with fade
    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
      (cam, effect) => {
        this.scene.stop("gameScene").launch("menuScene");
      }
    );

    // settings button
    let button = this.add
      .dom(config.general.windowWidth - 35, 17)
      .createElement("div", "", "")
      .setHTML(
        `
          <button class="settings-button">
            <img src="../../assets/images/settings.png" class="settings-button" width="40px">
          </button>
        `
      );

    button.addListener("click");
    button.on("click", (event) => {
      // clicked settings button
      if (
        event.target.className.includes("settings-button") &&
        this.settingsDisplayed === false
      ) {
        // pause the scene and set settingsDisplayed to true
        this.game.scene.scenes[0].selectSound.play();
        this.scene.pause();
        this.settingsDisplayed = true;

        // get highscore from local storage
        let highScore =
          localStorage.getItem("highScore") !== null
            ? +localStorage.getItem("highScore")
            : 0;

        // add settings html component
        let settings = this.add
          .dom(config.general.windowWidth / 2, config.general.windowHeight / 2)
          .createElement("article", config.styles.settings, "")
          .setHTML(
            `
            <section class="wrapper">
              <div class="score-content">
                <h2>Your highscore</h2>
                <h2>${highScore}</h2>
              </div>
              <button class="button-menu save">
                <img src="../../assets/images/texts/save.png" class="save" width="35%">
              </button>
              <button class="button-menu resume">
                <img src="../../assets/images/texts/resume.png" class="resume" width="52%">
              </button>
              <button class="button-menu restart">
                <img src="../../assets/images/texts/restart.png" class="restart" width="58%">
              </button>
              <button class="button-menu main-menu">
                <img src="../../assets/images/texts/main-menu.png" class="main-menu" width="72%">
              </button>
            </section>
          `
          );

        // setting events
        settings.addListener("click");
        settings.on("click", (event) => {
          if (event.target.className.includes("save")) {
            this.game.scene.scenes[0].selectSound.play();
            setTimeout(() => {
              this.saveScene();
            }, 100);
          } else if (event.target.className.includes("resume")) {
            this.game.scene.scenes[0].selectSound.play();
            setTimeout(() => {
              settings.destroy();
              this.scene.resume();
              this.settingsDisplayed = false;
            }, 100);
          } else if (event.target.className.includes("restart")) {
            this.game.scene.scenes[0].selectSound.play();
            setTimeout(() => {
              this.scene.restart();
              localStorage.removeItem("savedScene");
            }, 100);
          } else if (event.target.className.includes("main-menu")) {
            this.game.scene.scenes[0].selectSound.play();
            setTimeout(() => {
              this.tweens.add({
                targets: settings,
                duration: 10,
                repeat: 0,
                onComplete: function () {
                  settings.setAlpha(0);
                },
                callbackScope: this,
              });
              this.scene.resume();
              this.saveScene();
              this.cameras.main.fadeOut(250, 0, 0, 0);
            }, 100);
          }
        });
      }
    });

    // add player to the scene , play ship animation, set collide with world
    this.player = this.physics.add
      .sprite(
        config.general.windowWidth / 2,
        config.general.windowHeight - 64,
        this.ship
      )
      .setScale(2);
    this.player.play(`${this.ship}-thrust`);
    this.player.setCollideWorldBounds(true);

    // bug wave every 3 seconds
    this.bugWaveLoop = this.time.addEvent({
      delay: 3000,
      callback: this.createBugWave,
      callbackScope: this,
      loop: true,
    });

    // infinite shooting
    this.beamLoop = this.time.addEvent({
      delay: 250,
      callback: this.shootBeam,
      callbackScope: this,
      loop: true,
    });

    // overlaps between game objects
    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.hurtPlayer,
      null,
      this
    );
    this.physics.add.overlap(
      this.beams,
      this.enemies,
      this.hitEnemy,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.bombsPowerups,
      this.pickBombPowerup,
      null,
      this
    );

    // load save scene if there's any
    if (
      localStorage.getItem("savedScene") !== null &&
      this.mode === "endless"
    ) {
      let savedScene = JSON.parse(localStorage.getItem("savedScene"));
      // load score
      this.score = savedScene["score"];
      // load player coordinates
      this.player.x = savedScene.player["x"];
      this.player.y = savedScene.player["y"];
      // set number of beams
      this.beamNum = savedScene.beamNum;
      // add beams to the scene
      savedScene.beams.forEach((projectile) => {
        let beam = new Beam(this, projectile["x"], projectile["y"]);
      });
      // add enemies to the scene
      savedScene.enemies.forEach((bugs) => {
        let enemy = new Enemy(
          this,
          bugs["x"],
          bugs["y"],
          bugs.isHoming ? "homing" : bugs.sprite
        );
      });
      // add bombs/powerups to the scene
      savedScene.bombsPowerups.forEach((bombsPowerup) => {
        let bomb = new BombPowerup(
          this,
          bombsPowerup["x"],
          bombsPowerup["y"],
          bombsPowerup.isBomb ? "bomb" : "power"
        );
      });
    }
  }

  update() {
    // update background
    this.background.tilePositionY -= 0.5;

    // move spaceship on touch
    this.input.on("pointerdown", function (pointer) {
      let touchX = pointer.x;
      if (touchX > config.general.windowWidth / 2) {
        this.scene.player.setVelocityX(200);
      } else {
        this.scene.player.setVelocityX(-200);
      }
    });
    this.input.on("pointerup", function (pointer) {
      this.scene.player.setVelocityX(0);
    });

    // call update function in Beam class
    for (let i = 0; i < this.beams.getChildren().length; i++) {
      let beam = this.beams.getChildren()[i];
      beam.update();
    }

    // call update function in Enemy class
    for (let i = 0; i < this.enemies.getChildren().length; i++) {
      let enemy = this.enemies.getChildren()[i];
      enemy.update(this);
    }

    // call update function in BombPowerup class
    for (let i = 0; i < this.bombsPowerups.getChildren().length; i++) {
      let bombsPowerups = this.bombsPowerups.getChildren()[i];
      bombsPowerups.update();
    }

    // show debugging question every 2,000 points
    if (this.debuggingNum !== undefined && this.playing) {
      if (this.score >= this.debuggingPoints[this.debuggingNum]) {
        this.showDebuggingQuestion();
      }
    }
  }

  shootBeam() {
    // x and y of beams based on its number
    let beamConfig = [
      {
        x: [this.player.x],
      },
      { x: [this.player.x - 15, this.player.x + 15] },
      { x: [this.player.x - 30, this.player.x, this.player.x + 30] },
    ];
    for (let i = 0; i < this.beamNum; i++) {
      let beam = new Beam(
        this,
        beamConfig[this.beamNum - 1]["x"][i],
        this.player.y - 16
      );
    }

    this.game.scene.scenes[0].beamSound.play();
  }

  hurtPlayer(player, enemy) {
    let explosion = new Explosion(this, player.x, player.y);
    player.disableBody(true, true);

    this.time.addEvent({
      delay: 100,
      callback: this.gameOver,
      callbackScope: this,
      loop: false,
    });

    this.game.scene.scenes[0].explosionSound.play();
  }

  hitEnemy(projectile, enemy) {
    let explosion = new Explosion(this, enemy.x, enemy.y);

    projectile.destroy();
    enemy.destroy();
    this.score += 25;

    // update score
    let scoreFormated = this.zeroPad(this.score, 6);
    this.scoreLabel.text = "SCORE " + scoreFormated;

    this.game.scene.scenes[0].explosionSound.play();
  }

  pickBombPowerup(player, bombPowerup) {
    // check if it is a bomb or power up
    if (bombPowerup.isBomb) {
      this.hurtPlayer(player, bombPowerup);
    } else {
      this.game.scene.scenes[0].pickupSound.play();
      bombPowerup.destroy();
      if (this.beamNum < 3) {
        this.beamNum++;
      }
    }
  }

  zeroPad(number, size) {
    let stringNumber = String(number);
    while (stringNumber.length < (size || 2)) {
      stringNumber = "0" + stringNumber;
    }
    return stringNumber;
  }

  createBugWave() {
    // random type of bug wave
    let num = Phaser.Math.Between(0, 2);
    num === 0
      ? this.createOneDiagonalWave()
      : num === 1
      ? this.createRowWave()
      : this.createHomingBugs();
    // chance to drop bomb or powerup
    let chance = Phaser.Math.Between(0, 9);
    // 40% chance to drop powerup else bomb , drops if beamNum is less than 3
    if (chance < 4 && this.beamNum < 3) {
      let power = new BombPowerup(
        this,
        Phaser.Math.Between(50, config.general.windowWidth - 50),
        0,
        "power"
      );
    } else {
      let bomb = new BombPowerup(
        this,
        Phaser.Math.Between(50, config.general.windowWidth - 50),
        0,
        "bomb"
      );
    }
  }

  // creates a bug1 or bug2 diagonal wave
  createOneDiagonalWave() {
    let bugsConfig = [
      {
        key: "bug1",
        x: config.general.windowWidth / 6,
        y: 0,
        stepX: config.general.windowWidth / 6,
        stepY: -50,
      },
      {
        key: "bug2",
        x: config.general.windowWidth / 6,
        y: -200,
        stepX: config.general.windowWidth / 6,
        stepY: 50,
      },
    ];
    let num = Phaser.Math.Between(0, 1);
    for (let i = 0; i < 5; i++) {
      let enemy = new Enemy(
        this,
        bugsConfig[num]["x"],
        bugsConfig[num]["y"],
        bugsConfig[num]["key"]
      );
      bugsConfig[num]["x"] += bugsConfig[num]["stepX"];
      bugsConfig[num]["y"] += bugsConfig[num]["stepY"];
    }
  }

  // creates bug1 or bug2 row wave
  createRowWave() {
    let bugsConfig = [
      {
        key: "bug1",
        x: config.general.windowWidth / 6,
        stepX: config.general.windowWidth / 6,
      },
      {
        key: "bug2",
        x: config.general.windowWidth / 6,
        stepX: config.general.windowWidth / 6,
      },
    ];
    let num = Phaser.Math.Between(0, 1);
    for (let x = 1; x < 5; x++) {
      for (let y = 0; y < 5; y++) {
        let enemy = new Enemy(
          this,
          bugsConfig[num]["x"],
          -(x * 70),
          bugsConfig[num]["key"]
        );
        bugsConfig[num]["x"] += bugsConfig[num]["stepX"];
      }
      bugsConfig[num]["x"] = config.general.windowWidth / 6;
    }
  }

  // creates homing bugs
  createHomingBugs() {
    for (let i = 0; i < 16; i++) {
      let enemy = new Enemy(
        this,
        [0, config.general.windowWidth][Phaser.Math.Between(0, 1)],
        Phaser.Math.Between(0, config.general.windowHeight / 2),
        "homing"
      );
    }
  }

  // debugging question every 2000 points
  showDebuggingQuestion() {
    // pause the scene and set settingsDisplayed to true
    this.scene.pause();
    this.settingsDisplayed = true;

    // gets the details of question from config.js
    let error = debugging[this.mode][this.ship][this.debuggingNum]["error"];
    let src = debugging[this.mode][this.ship][this.debuggingNum]["src"];
    let answer = debugging[this.mode][this.ship][this.debuggingNum]["answer"];

    // add debugging html component
    let debuggingComponent = this.add
      .dom(config.general.windowWidth / 2, config.general.windowHeight / 2)
      .createElement("article", config.styles.debugging, "")
      .setHTML(createContent(error, src));

    // setting events
    debuggingComponent.addListener("click");
    debuggingComponent.on("click", (event) => {
      // clicked the check button
      if (
        event.target.className.includes("check") &&
        !event.target.className.includes("disabled")
      ) {
        this.game.scene.scenes[0].selectSound.play();
        // resumes if correct otherwise gameover
        if (debuggingComponent.getChildByID("answer").value === answer) {
          debuggingComponent.setHTML(createContent(error, src, true));
          setTimeout(() => {
            this.scene.resume();
            this.settingsDisplayed = false;
            this.debuggingNum++;
            debuggingComponent.destroy();
            // call game over with text level completed
            if (this.score >= 6000) {
              this.gameOver(true);
            }
          }, 2000);
        } else {
          debuggingComponent.setHTML(createContent(error, src, false));
          setTimeout(() => {
            debuggingComponent.destroy();
            this.gameOver();
          }, 2000);
        }
      }
    });

    // replaces current content with caption correct and incorrect - called after clicking check button
    function createContent(error, src, isCorrect = undefined) {
      let disabled = isCorrect !== undefined ? "disabled" : "";
      return `
      <section class="wrapper">
        <div class="debugging-content">
          <h3>${error}</h3>
          <img src="${src}" width="100%">
          <label for="answer">Enter the line that causes the error:</label>
          <div class="debugging-input">
            <input type="number" id="answer" placeholder="Enter line of error"/>
            <div>
              <button class="check ${disabled}">
                <img src="../../assets/images/check.png" class="check ${disabled}" width="40px">
              </button>
            </div>
          </div>
          ${
            isCorrect !== undefined
              ? isCorrect
                ? '<p class="debug-correct">Correct</p>'
                : '<p class="debug-incorrect">Incorrect</p>'
              : ""
          }
        <div>
      </section>
     `;
    }
  }

  // pops up a window showing score/new highscore, main menu and restart
  // called when overlapped with bomb or enemy
  gameOver(data = undefined) {
    this.scene.pause();
    let gameOver = this.add
      .dom(config.general.windowWidth / 2, config.general.windowHeight / 3)
      .createElement("article", config.styles.gameOver, "");

    // get highscore from local storage to compare
    let highScore =
      localStorage.getItem("highScore") !== null
        ? +localStorage.getItem("highScore")
        : 0;
    let text;
    // text to display - new highscore or current score
    // if new highscore, set the text and save to local storage
    if (this.score > highScore) {
      text = `
      <h2>New Highscore</h2>
      <h2>${this.score}</h2>
      `;
      localStorage.setItem("highScore", `${this.score}`);
    } else {
      text = `
      <h2>Your score</h2>
      <h2>${this.score}</h2>
      `;
    }
    if (data) {
      text = `
      <h2>Level completed</h2>
      <h2>${this.score}</h2>
      `;
    }

    // inner html
    gameOver.setHTML(
      `
      <section class="game-over-wrapper">
      <div class="score-content">
        ${text}
      </div>
      <button class="main-menu">
        <img src="../../assets/images/main-menu.png" class="main-menu" width="40px">
      </button>
      <button class="restart-button">
        <img src="../../assets/images/restart.png" class="restart-button" width="40px">
      </button>
      </section>
      `
    );
    gameOver.addListener("click");
    gameOver.on("click", (event) => {
      // clicked back button
      if (event.target.className.includes("main-menu")) {
        this.game.scene.scenes[0].selectSound.play();
        setTimeout(() => {
          this.tweens.add({
            targets: gameOver,
            duration: 10,
            repeat: 0,
            onComplete: function () {
              gameOver.setAlpha(0);
            },
            callbackScope: this,
          });
          this.playing = false;
          this.scene.resume();
          this.cameras.main.fadeOut(250, 0, 0, 0);
        }, 100);
      } else if (event.target.className.includes("restart")) {
        this.game.scene.scenes[0].selectSound.play();
        setTimeout(() => {
          this.scene.restart();
        }, 100);
      }
    });
    localStorage.removeItem("savedScene");
    this.settingsDisplayed = true;
  }

  // saving the scene to localstorage - current score, player coordinates, ship, beams, enemies, bomb or powerups
  saveScene() {
    if (this.mode === "endless") {
      let saveScene = {
        score: this.score,
        player: { x: this.player.x, y: this.player.y, ship: this.ship },
        beamNum: this.beamNum,
        beams: [],
        enemies: [],
        bombsPowerups: [],
      };
      // save all coordinates of beams
      for (let i = 0; i < this.beams.getChildren().length; i++) {
        let beam = this.beams.getChildren()[i];
        saveScene.beams.push({ x: beam.x, y: beam.y });
      }
      // call update function in Enemy class
      for (let i = 0; i < this.enemies.getChildren().length; i++) {
        let enemy = this.enemies.getChildren()[i];
        saveScene.enemies.push({
          x: enemy.x,
          y: enemy.y,
          sprite: enemy.sprite,
          isHoming: enemy.spriteType,
        });
      }
      // call update function in Enemy class
      for (let i = 0; i < this.bombsPowerups.getChildren().length; i++) {
        let bombsPowerups = this.bombsPowerups.getChildren()[i];
        saveScene.bombsPowerups.push({
          x: bombsPowerups.x,
          y: bombsPowerups.y,
          isBomb: bombsPowerups.isBomb,
        });
      }
      localStorage.setItem("savedScene", JSON.stringify(saveScene));
    }
  }
}

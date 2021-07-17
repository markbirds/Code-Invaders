class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: "startScene" });
  }

  preload() {
    this.load.image("background", "../../assets/images/background-looped.png");

    this.load.image("clouds", "../../assets/images/clouds.png");

    this.load.image("spaceships", "../../assets/images/texts/spaceships.png");

    this.load.image(
      "clouds-transparent",
      "../../assets/images/clouds-transparent.png"
    );

    this.load.spritesheet(
      "cpp-sprite",
      "../../assets/spritesheets/cpp-sprite.png",
      {
        frameWidth: 32,
        frameHeight: 16,
      }
    );
    this.load.spritesheet(
      "java-sprite",
      "../../assets/spritesheets/java-sprite.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
    this.load.spritesheet(
      "python-sprite",
      "../../assets/spritesheets/python-sprite.png",
      {
        frameWidth: 16,
        frameHeight: 24,
      }
    );

    this.load.spritesheet("bug1", "../../assets/spritesheets/bug1.png", {
      frameWidth: 38,
      frameHeight: 38,
    });
    this.load.spritesheet("bug2", "../../assets/spritesheets/bug2.png", {
      frameWidth: 38,
      frameHeight: 38,
    });

    this.load.spritesheet(
      "explosion",
      "../../assets/spritesheets/explosion.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      }
    );

    this.load.spritesheet(
      "title",
      "../../assets/spritesheets/title-spritesheet.png",
      {
        frameWidth: 320,
        frameHeight: 80,
      }
    );

    this.load.spritesheet("start", "../../assets/spritesheets/start.png", {
      frameWidth: 120,
      frameHeight: 24,
    });

    this.load.spritesheet(
      "power-bomb",
      "../../assets/spritesheets/power-bomb.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      }
    );

    this.load.spritesheet("beam", "../../assets/spritesheets/beam.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.bitmapFont(
      "pixelFont",
      "assets/font/font.png",
      "assets/font/font.xml"
    );

    // 1.1 load sounds in both formats mp3 and ogg
    this.load.audio("audio_beam", [
      "assets/sounds/beam.ogg",
      "assets/sounds/beam.mp3",
    ]);
    this.load.audio("audio_explosion", [
      "assets/sounds/explosion.ogg",
      "assets/sounds/explosion.mp3",
    ]);
    this.load.audio("audio_pickup", [
      "assets/sounds/pickup.ogg",
      "assets/sounds/pickup.mp3",
    ]);
    this.load.audio("audio_select", [
      "assets/sounds/select.ogg",
      "assets/sounds/select.mp3",
    ]);

    this.load.audio("music", [
      "assets/sounds/sci-fi_platformer12.ogg",
      "assets/sounds/sci-fi_platformer12.mp3",
    ]);
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

    // responsive clouds
    this.clouds = this.physics.add
      .sprite(0, -400, "clouds")
      .setDisplaySize(
        config.general.windowWidth,
        config.general.windowWidth * config.game.cloudRatio
      )
      .setDepth(2)
      .setOrigin(0);

    this.cloudsTransparent = this.physics.add
      .sprite(0, -200, "clouds-transparent")
      .setDisplaySize(
        config.general.windowWidth,
        config.general.windowWidth * config.game.cloudRatio
      )
      .setDepth(2)
      .setOrigin(0);

    // animations
    this.anims.create({
      key: "titleAnim",
      frames: this.anims.generateFrameNumbers("title"),
      frameRate: 1,
      repeat: -1,
    });

    this.anims.create({
      key: "cpp-sprite-thrust",
      frames: this.anims.generateFrameNumbers("cpp-sprite"),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: "java-sprite-thrust",
      frames: this.anims.generateFrameNumbers("java-sprite"),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: "python-sprite-thrust",
      frames: this.anims.generateFrameNumbers("python-sprite"),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: "flying1",
      frames: this.anims.generateFrameNumbers("bug1"),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "flying2",
      frames: this.anims.generateFrameNumbers("bug2"),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "explode",
      frames: this.anims.generateFrameNumbers("explosion"),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true,
    });

    this.anims.create({
      key: "startAnim",
      frames: this.anims.generateFrameNumbers("start"),
      frameRate: 2,
      repeat: -1,
    });

    this.anims.create({
      key: "power-up",
      frames: this.anims.generateFrameNumbers("power-bomb", {
        start: 0,
        end: 1,
      }),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: "bomb",
      frames: this.anims.generateFrameNumbers("power-bomb", {
        start: 2,
        end: 3,
      }),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: "beam_anim",
      frames: this.anims.generateFrameNumbers("beam"),
      frameRate: 20,
      repeat: -1,
    });

    // floating sprites group
    this.floatSpriteLoop = this.time.addEvent({
      delay: 500,
      callback: this.floatSprites,
      callbackScope: this,
      loop: true,
    });
    this.floatingSprites = this.add.group();

    // title code invaders
    this.title = this.physics.add
      .sprite(config.general.windowWidth / 2, 200, "title")
      .setDepth(3);
    this.title.play("titleAnim");

    // start game
    this.startGame = this.physics.add
      .sprite(
        config.general.windowWidth / 2,
        config.general.windowHeight - 100,
        "start"
      )
      .setDepth(3);
    this.startGame.play("startAnim");

    // switch scene on start with fade
    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
      (cam, effect) => {
        this.scene.stop("startScene").launch("menuScene");
      }
    );

    this.startGame.setInteractive();
    this.startGame.on("pointerdown", function (pointer) {
      this.scene.cameras.main.fadeOut(250, 0, 0, 0);
      this.scene.selectSound.play();
    });

    // collision
    this.physics.add.overlap(
      this.floatingSprites,
      this.floatingSprites,
      this.explodeSprite,
      null,
      this
    );

    // add sprites
    this.floatSprites();
    this.floatSprites();
    this.floatSprites();

    // create the sounds to be used
    this.beamSound = this.sound.add("audio_beam");
    this.explosionSound = this.sound.add("audio_explosion");
    this.pickupSound = this.sound.add("audio_pickup");
    this.selectSound = this.sound.add("audio_select");

    // create music
    this.music = this.sound.add("music");

    var musicConfig = {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0,
    };

    this.music.play(musicConfig);
  }

  update() {
    // update sprites
    this.background.tilePositionY -= 0.5;

    this.clouds.setVelocityY(75);
    this.cloudsTransparent.setVelocityY(100);

    // call update function in FloatSprite class
    for (var i = 0; i < this.floatingSprites.getChildren().length; i++) {
      var sprite = this.floatingSprites.getChildren()[i];
      sprite.update();
      sprite.rotation += 0.01;
    }

    if (this.clouds.y > config.general.windowHeight) {
      this.clouds.y = -300;
    }
    if (this.cloudsTransparent.y > config.general.windowHeight) {
      this.cloudsTransparent.y = -300;
    }
  }

  // add floating sprites
  floatSprites() {
    let spritesList = [
      "bug1",
      "bug2",
      "cpp-sprite",
      "java-sprite",
      "python-sprite",
      "power-bomb",
    ];
    var sprite = new FloatSprite(this, spritesList[Phaser.Math.Between(0, 5)]);
  }

  explodeSprite(sprite1, sprite2) {
    var explosion1 = new Explosion(this, sprite1.x, sprite1.y);
    var explosion2 = new Explosion(this, sprite2.x, sprite2.y);

    sprite1.destroy();
    sprite2.destroy();

    // 1.4 play sounds
    this.explosionSound.play();
  }
}

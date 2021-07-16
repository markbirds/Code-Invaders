class FloatSprite extends Phaser.GameObjects.Sprite {
  constructor(scene, sprite) {
    // set random spawn between x and y
    let spawnX = Phaser.Math.Between(0, 1);
    let x, y, xSpeed, ySpeed;
    // spawn on top/bottom
    if (spawnX === 1) {
      let randomX = Phaser.Math.Between(0, config.general.windowWidth);
      x = randomX;
      // set random spawn between sides of x (top, bottom)
      let randomY = Phaser.Math.Between(0, 1);
      // if randomY = 0 ? spawn on top : spawn on bottom
      y = randomY === 0 ? 0 : config.general.windowHeight;
      // set speed
      // if x is on the left side, float the object to the right vice versa
      xSpeed = randomX < config.general.windowWidth ? -100 : 100;
      // if sprite will spawn on top, float the object down
      ySpeed = y === 0 ? 100 : -100;
    } else {
      // spawn on left/right side
      // set random spawn between sides of y (left, right)
      let randomX = Phaser.Math.Between(0, 1);
      // if randomX = 0 ? spawn on left : spawn on right
      x = randomX === 0 ? 0 : config.general.windowWidth;
      let randomY = Phaser.Math.Between(0, config.general.windowHeight);
      y = randomY;
      // set speed
      // if sprite will spawn on left, float the object to the right
      xSpeed = x === 0 ? 100 : -100;
      // if sprite will spawn above the middle, float the object down
      ySpeed = randomY < config.general.windowHeight ? -100 : 100;
    }

    super(scene, x, y, sprite).setScale(2).setDepth(1);
    scene.add.existing(this);

    scene.physics.world.enableBody(this);
    scene.floatingSprites.add(this);

    this.body.velocity.x = xSpeed;
    this.body.velocity.y = ySpeed;

    let spritesAnimation = {
      "python-sprite": "python-sprite-thrust",
      bug1: "flying1",
      bug2: "flying2",
      "cpp-sprite": "cpp-sprite-thrust",
      "java-sprite": "java-sprite-thrust",
      "power-bomb": ["power-up", "bomb"][Phaser.Math.Between(0, 1)],
    };

    this.play(spritesAnimation[sprite]);
  }

  // destroy if out of the screen
  update() {
    if (
      this.x < 0 ||
      this.x > config.general.windowWidth ||
      this.y < 0 ||
      this.y > config.general.windowHeight
    ) {
      this.destroy();
    }
  }
}

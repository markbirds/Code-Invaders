class Enemy extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, sprite) {
    // check if the sprite is homing then set the bug type (1 or 2)
    let isHoming = sprite === "homing";
    if (isHoming) {
      sprite = Phaser.Math.Between(0, 1) === 0 ? "bug1" : "bug2";
    }
    // add sprite to the scene
    super(scene, x, y, sprite).setScale(1.5).setDepth(1);
    scene.add.existing(this);

    // sprite will be used in loading saved game
    this.sprite = sprite;
    // spriteType will be used in update function
    this.spriteType = isHoming;

    scene.physics.world.enableBody(this);

    scene.enemies.add(this);
    this.body.velocity.y = 120;

    // animations
    let spritesAnimation = {
      bug1: "flying1",
      bug2: "flying2",
    };

    this.play(spritesAnimation[sprite]);
  }

  // destroy if out of the screen
  update(scene) {
    // homing
    if (this.spriteType) {
      if (this.x > scene.player.x) {
        this.body.velocity.x = -100;
      } else {
        this.body.velocity.x = 100;
      }
    }
    if (this.y > config.general.windowHeight) {
      this.y = 0;

      // decrease score
      if (scene.score > 0) {
        if (scene.score === 25) {
          scene.score = 0;
        } else {
          scene.score -= 50;
        }
        let scoreFormated = scene.zeroPad(scene.score, 6);
        scene.scoreLabel.text = "SCORE " + scoreFormated;
      }
    }
  }
}

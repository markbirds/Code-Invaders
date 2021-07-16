class BombPowerup extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, sprite) {
    super(scene, x, y, sprite).setScale(2);
    this.isBomb = sprite === "bomb";
    scene.add.existing(this);

    scene.physics.world.enableBody(this);

    scene.bombsPowerups.add(this);
    this.body.velocity.y = 200;

    // animations
    let animation = {
      power: "power-up",
      bomb: "bomb",
    };

    this.play(animation[sprite]);
  }

  // destroy if out of the screen
  update() {
    if (this.y > config.general.windowHeight) {
      this.destroy();
    }
  }
}

class Beam extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "beam").setScale(2);

    scene.add.existing(this);

    this.play("beam_anim");
    scene.physics.world.enableBody(this);
    this.body.velocity.y = -500;

    scene.beams.add(this);
  }

  update() {
    if (this.y < 80) {
      this.destroy();
    }
  }
}

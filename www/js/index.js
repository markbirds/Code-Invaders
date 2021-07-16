document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
  // initialize scenes
  let startScene = new StartScene();
  let menuScene = new MenuScene();
  let topicScene = new TopicScene();
  let selectScene = new SelectScene();
  let gameScene = new GameScene();
  let howToPlayScene = new HowToPlayScene();
  let readTutorialScene = new ReadTutorialScene();
  let aboutScene = new AboutScene();

  let phaserConfig = {
    type: Phaser.WEBGL,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: config.general.windowWidth,
    height: config.general.windowHeight,
    parent: "html-content",
    dom: {
      createContainer: true,
    },
    scene: [
      startScene,
      menuScene,
      topicScene,
      selectScene,
      gameScene,
      howToPlayScene,
      readTutorialScene,
      aboutScene,
    ],
    pixelArt: true,
    physics: {
      default: "arcade",
      arcade: {
        debug: false,
        debugShowVelocity: false,
      },
    },
  };

  let game = new Phaser.Game(phaserConfig);
  // start game
  game.scene.start("startScene");
}

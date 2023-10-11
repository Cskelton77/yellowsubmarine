import Phaser from "phaser";

class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    this.load.image("background", "./assets/Wavy-Background-Texture.png");
    this.load.image("waves", "./assets/Waves.png");
    this.load.image("submarine", "./assets/Submarine.png");
    this.load.image("explosion", "./assets/Explode.png");

    this.load.spritesheet("pipes", "./assets/Pipes.png", {
      frameWidth: 60,
      frameHeight: 480,
    });

    this.load.image("pause", "./assets/pause.png");
    this.load.image("back", "./assets/back.png");
  }

  create() {
    this.scene.start("MenuScene");
  }
}

export default PreloadScene;

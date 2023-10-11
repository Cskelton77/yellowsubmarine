import Phaser from "phaser";

class BaseScene extends Phaser.Scene {
  constructor(data) {
    const { sceneName, config } = data;
    super(sceneName);
    this.config = config;
    this.fontSize = config.fontSize;
    this.fill = config.fill;
    this.hoverFill = config.hoverFill;

    this.fontOptions = {
      fontSize: `${this.fontSize}px`,
      fill: this.fill,
    };

    this.screenCenter = { x: config.width / 2, y: config.height / 2 };

    this.bgSpeed = 1;
    this.waveTimer = 0;
    this.waveInterval = 100;
  }

  create() {
    this.background = this.add.image(0, 0, "background").setOrigin(0);
    this.loopLimit = this.background.width;
    this.backgroundLoop = this.add
      .image(this.loopLimit, 0, "background")
      .setOrigin(0);

    this.waves = this.add
      .image(this.config.width / 2, this.config.height - 114, "waves")
      .setOrigin(0.5, 0);

    if (this.config.canGoBack) {
      const backBtn = this.add
        .image(this.config.width - 50, this.config.height - 50, "back")
        .setOrigin(0)
        .setScale(2)
        .setInteractive();

      backBtn.on("pointerup", () => {
        this.scene.start("MenuScene");
      });
    }
  }

  posOrNeg = () => (Math.random() < 0.5 ? 1 : -1);

  update(time, delta) {
    this.moveBackground();
    this.waveWaves(delta);
  }

  moveBackground() {
    if (this.background.x <= -this.loopLimit) {
      this.background.x = 0;
      this.backgroundLoop.x = this.loopLimit;
    }
    this.background.x -= this.bgSpeed;
    this.backgroundLoop.x -= this.bgSpeed;
  }

  waveWaves(delta) {
    if (this.waveTimer >= this.waveInterval) {
      const wavesModifierX = this.posOrNeg() * Math.random() * 15;
      const wavesModifierY = 85 + Math.random() * 15;
      this.waves.x = this.config.width / 2 + wavesModifierX;
      this.waves.y = this.config.height - wavesModifierY;
      this.waveTimer = 0;
    } else {
      this.waveTimer += delta;
    }
  }

  createMenu(menu) {
    const startingPoint =
      this.screenCenter.y - (this.fontSize * menu.length) / 2;

    menu.forEach((menuItem, i) => {
      const spacer = i * this.fontSize * 2;

      menuItem.interactive = this.add
        .text(
          this.screenCenter.x,
          startingPoint + spacer,
          menuItem.text,
          this.fontOptions
        )
        .setOrigin(0.5, 0.5)
        .setInteractive();
      this.setupMenuEvents(menuItem);
    });
  }

  configureButton(button, onClick) {
    button.setOrigin(0.5, 0.5);
    button.setInteractive();
    console.log(this.hoverFill);
    console.log(this.fill);

    button.on("pointerover", () => {
      button.setStyle({
        fill: this.hoverFill,
      });
    });
    button.on("pointerout", () => {
      button.setStyle({
        fill: this.fill,
      });
    });
    button.on("pointerup", () => onClick());
  }
}

export default BaseScene;

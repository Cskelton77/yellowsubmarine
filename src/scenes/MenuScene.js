import BaseScene from "./BaseScene";
class MenuScene extends BaseScene {
  constructor(config) {
    super({ config, sceneName: "MenuScene" });

    this.menu = [
      { scene: "PlayScene", text: "Play" },
      { scene: "ScoreScene", text: "Score" },
      { scene: null, text: "Exit" },
    ];
  }

  create() {
    super.create();
    this.createMenu(this.menu, () => this.setupMenuEvents);
    this.printVersion();
  }

  printVersion() {
    this.add
      .text(this.config.width - 10, 10, `Version ${this.config.version}`)
      .setOrigin(1, 0);
  }

  setupMenuEvents(menuItem) {
    super.configureButton(menuItem.interactive, () => {
      menuItem.scene && this.scene.start(menuItem.scene);

      if (menuItem.text === "Exit") {
        this.game.destroy(true);
      }
    });
  }
}

export default MenuScene;

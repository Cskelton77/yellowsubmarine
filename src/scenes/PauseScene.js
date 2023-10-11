import BaseScene from "./BaseScene";

class PauseScene extends BaseScene {
  constructor(config) {
    super({ config, sceneName: "PauseScene" });

    this.menu = [
      { scene: "UserInterface", text: "Continue" },
      { scene: "MenuScene", text: "Exit" },
    ];
  }

  create() {
    super.create();
    this.createMenu(this.menu, () => this.setupMenuEvents);
  }

  setupMenuEvents(menuItem) {
    super.configureButton(menuItem.interactive, () => {
      if (menuItem.scene && menuItem.text === "Continue") {
        this.scene.stop();
        this.scene.resume("UserInterface");
        this.scene.resume("PlayScene");
      } else {
        this.scene.stop("UserInterface");
        this.scene.stop("PlayScene");
        this.scene.start("MenuScene");
      }
    });
  }
}

export default PauseScene;

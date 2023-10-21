import { SharedConfig } from "..";
import { MenuItem } from "../types/MenuItem";
import { BaseSceneWithMenu } from "./BaseScene";

class PauseScene extends BaseSceneWithMenu {
        menu: Array<MenuItem>;
  constructor(config: SharedConfig) {
        super({ config, sceneName: "PauseScene" });

        this.menu = [
            { scene: "UserInterface", text: "Continue" },
            { scene: "MenuScene", text: "Exit" },
        ];
  }

    create() {
        super.create();
        this.createMenu(this.menu);
    }

    setupMenuEvents(menuItem: MenuItem) {
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

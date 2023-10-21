import { SharedConfig } from "..";
import { MenuItem } from "../types/MenuItem";
import { BaseSceneWithMenu } from "./BaseScene";

class MenuScene extends BaseSceneWithMenu {

    menu: Array<MenuItem>

    constructor(config: SharedConfig) {
        super({ config, sceneName: "MenuScene" });

        this.menu = [
            { scene: "PlayScene", text: "Play" },
            { scene: "ScoreScene", text: "Score" },
            { scene: null, text: "Exit" },
        ];
    }

    create() {
        super.create();
        this.createMenu(this.menu);
        this.printVersionNumber();
    }

    printVersionNumber() {
        this.add
        .text(this.config.width - 10, 10, `Version ${this.config.version}`)
        .setOrigin(1, 0);
    }

    setupMenuEvents(menuItem: MenuItem) {
        console.log('setupMenuEvents')
        super.configureButton(menuItem.interactive, () => {
            menuItem.scene && this.scene.start(menuItem.scene);

            if (menuItem.text === "Exit") {
                this.game.destroy(true);
            }
        });
    }
}

export default MenuScene;

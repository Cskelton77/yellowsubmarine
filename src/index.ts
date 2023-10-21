import Phaser from "phaser";
import PreloadScene from "./scenes/PreloadScene";
import PlayScene from "./scenes/PlayScene";
import ScoreScene from "./scenes/ScoreScene";
import MenuScene from "./scenes/MenuScene";
import PauseScene from "./scenes/PauseScene";
import UserInterfaceScene from "./scenes/UserInterfaceScene";

const sharedConfig = {
    version: "1.1.0",
    height: 600,
    width: window.innerWidth > 900 ? 900 : window.innerWidth,
    fontSize: 32,
    fill: "#FFF",
    hoverFill: "#FF0000",
};

export interface SharedConfig { 
    version: string,
    height: number,
    width: number,
    fontSize: number,
    fill: string,
    hoverFill: string
    canGoBack?: boolean
 }

const scenes = [
    PreloadScene,
    MenuScene,
    ScoreScene,
    PlayScene,
    UserInterfaceScene,
    PauseScene,
];

const initScenes = () => scenes.map((scene) => new scene(sharedConfig));

const config = {
    ...sharedConfig,
    type: Phaser.AUTO,
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: { },
    },
    scene: initScenes(),
};

new Phaser.Game(config);

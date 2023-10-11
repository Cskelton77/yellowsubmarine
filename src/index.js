import Phaser from "phaser";
import PreloadScene from "./scenes/PreloadScene.js";
import PlayScene from "./scenes/PlayScene.js";
import ScoreScene from "./scenes/ScoreScene.js";
import MenuScene from "./scenes/MenuScene.js";
import PauseScene from "./scenes/PauseScene.js";
import UserInterfaceScene from "./scenes/UserInterfaceScene.js";

const sharedConfig = {
  version: "1.0.0",
  height: 600,
  width: window.innerWidth > 900 ? 900 : window.innerWidth,
  fontSize: 32,
  fill: "#FFF",
  hoverFill: "#FF0000",
};

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
    arcade: {
      //   debug: true,
    },
  },
  scene: initScenes(),
};

new Phaser.Game(config);

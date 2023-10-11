import BaseScene from "./BaseScene";

class ScoreScene extends BaseScene {
  constructor(config) {
    super({
      sceneName: "ScoreScene",
      config: {
        ...config,
        canGoBack: true,
      },
    });
  }

  create() {
    super.create();

    this.drawBestScore();
    this.drawBackBtn();
    this.drawResetScoreBtn();
  }

  drawBestScore() {
    const bestScore = localStorage.getItem("bestScore") || 0;
    this.add
      .text(
        this.screenCenter.x,
        this.screenCenter.y - this.fontSize * 2,
        `Best Score: ${bestScore}`,
        this.fontOptions
      )
      .setOrigin(0.5, 0.5);
  }

  drawBackBtn() {
    const backBtn = this.add.text(
      this.screenCenter.x,
      this.screenCenter.y + this.fontSize,
      `Back`,
      {
        fontSize: `16px`,
        fill: this.fill,
      }
    );

    super.configureButton(backBtn, () => {
      this.scene.start("MenuScene");
    });
  }

  drawResetScoreBtn() {
    const resetBtn = this.add.text(
      this.screenCenter.x,
      this.screenCenter.y,
      `Reset High Score`,
      {
        fontSize: `18px`,
        fill: this.fill,
      }
    );

    super.configureButton(resetBtn, () => {
      localStorage.setItem("bestScore", 0);
      this.scene.restart("MenuScene");
    });
  }
}

export default ScoreScene;

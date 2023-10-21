import { SharedConfig } from "..";
import PlayScene from "./PlayScene";

export interface UserInterface extends Phaser.Scene{
    score: number
    increaseScore(): void
    saveBestScore(): void
    handleResume(): void
}

class UserInterfaceScene extends Phaser.Scene implements UserInterface{
    screenCenter: {
        x: number,
        y: number,
    };
    fontOptions: {
        fontSize: string,
        fill: string,
    };

    PlayScene: PlayScene;

    score = 0
    scoreText: Phaser.GameObjects.Text;
    bestScoreText: Phaser.GameObjects.Text;
    isGamePaused : boolean
    timedEvent: Phaser.Time.TimerEvent;

    initialTime = 3;
    resumeText: Phaser.GameObjects.Text;
 

    constructor(public config: SharedConfig) {
        super("UserInterface");

        this.screenCenter = { x: this.config.width / 2, y: this.config.height / 2 };
        this.fontOptions = {
            fontSize: `${this.config.fontSize}px`,
            fill: this.config.fill,
        };
        // this.score = 0;
        // this.scoreText = "";
    }

    create(): void {
        this.createScore();
        this.createPauseButton();
        this.PlayScene = this.scene.get("PlayScene") as PlayScene;
    }

    createPauseButton(): void {
        const pauseButton = this.add.sprite(
            this.config.width - 30,
            this.config.height - 30,
            "pause"
        );
        pauseButton.setScale(3);
        pauseButton.setInteractive();
        if (!this.isGamePaused) {
            pauseButton.on("pointerdown", () => this.handlePause());
        }
    }

    handlePause(): void {
        this.PlayScene.physics.pause();
        this.PlayScene.scene.pause();
        this.PlayScene.isGamePaused = true;
        this.scene.launch("PauseScene");
    }

  handleResume(): void {
    // this.initialTime = 3;

    this.resumeText = this.add
      .text(
        this.screenCenter.x,
        this.screenCenter.y,
        "Resume " + this.initialTime,
        this.fontOptions
      )
      .setOrigin(0.5);

    this.timedEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.initialTime--;
        this.resumeText.setText("Resume " + this.initialTime);
        if (this.initialTime <= 0) {
          this.resumeText.setText("");
          this.PlayScene.isGamePaused = false;
          this.PlayScene.physics.resume();
          this.timedEvent.remove();
        }
      },
      callbackScope: this,
      loop: true,
    });
  }

    createScore(): void {
        this.score = 0;
        const bestScore = localStorage.getItem("bestScore");
        this.scoreText = this.add.text(25, 25, `Score: ${this.score}`);
        this.bestScoreText = this.add.text(25, 50, `Best Score: ${bestScore || 0}`);
    }

    increaseScore(): void {
        this.score++;
        this.scoreText.setText(`Score: ${this.score}`);
        this.saveBestScore();
    }

    saveBestScore(): void {
        const bestScoreText = localStorage.getItem("bestScore");
        const bestScore = bestScoreText && parseInt(bestScoreText);
        if (!bestScore || this.score >= bestScore) {
            localStorage.setItem("bestScore", this.score.toString());
            this.bestScoreText.setText(`Best Score: ${this.score}`);
        }
    }
}

export default UserInterfaceScene;

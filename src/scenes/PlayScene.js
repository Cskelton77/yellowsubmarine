import Phaser from "phaser";
import BaseScene from "./BaseScene";

class PlayScene extends BaseScene {
  constructor(config) {
    super({ config, sceneName: "PlayScene" });

    this.submarine = null;
    this.initialPosition = {
      x: this.config.width / 6.5,
      y: this.config.height / 2,
    };

    this.currentPipeInterval = 2500;

    this.difficulties = {
      easy: {
        pipeIntervalRange: [750, 1750],
        pipeGap: [150, 275],
        pipeVelocity: -350,
      },
      normal: {
        pipeIntervalRange: [500, 1200],
        pipeGap: [100, 230],
        pipeVelocity: -450,
      },
      hard: {
        pipeIntervalRange: [350, 900],
        pipeGap: [80, 200],
        pipeVelocity: -550,
      },
    };
  }
  init() {
    this.isGamePaused = false;
    this.allPipes = [];
    this.pipeTimer = 0;
    this.allPipes.forEach((pipe) => {
      pipe.clear(true, true);
    });
    this.allPipes = [];
    this.pipeTimer = 0;
    this.currentDifficulty = "easy";
  }

  create() {
    super.create();
    this.scene.launch("UserInterface", this.config);
    this.UI = this.scene.get("UserInterface");
    this.createPlayer();
    this.handleInputs();
    this.createPipePair();
    this.listenToEvents();
  }

  update(time, delta) {
    super.update(time, delta);
    if (!this.isGamePaused) {
      this.addNewPipes(delta);
      this.deleteOldPipes();
      this.checkPlayerOutOfBounds();
      this.rotatePlayer();
    }
  }

  listenToEvents() {
    if (this.pauseEvent) {
      return;
    }
    this.pauseEvent = this.events.on("resume", () => {
      this.UI.handleResume();
    });
  }

  handleInputs() {
    this.input.on("pointerdown", () => this.movePlayer());
    this.input.keyboard.on("keydown-SPACE", () => this.movePlayer());
  }

  createPlayer() {
    this.submarine = this.physics.add.sprite(
      this.initialPosition.x,
      this.initialPosition.y,
      "submarine"
    );

    this.config.width < 900 && this.submarine.setScale(0.75);
    this.submarine.body.gravity.y = 400;
    this.submarine
      .setBodySize(this.submarine.width / 2, this.submarine.height / 3)
      .setOffset(50);
    this.submarine.setCollideWorldBounds(true);
  }

  rotatePlayer() {
    const vel = this.submarine.body.velocity.y;
    const speed = 0.5;
    const currentAngle = Phaser.Math.DegToRad(this.submarine.angle);
    const desiredAngle = -Phaser.Math.DegToRad(45);
    if (vel < 0) {
      this.submarine.setRotation(
        Phaser.Math.Angle.RotateTo(currentAngle, desiredAngle, speed)
      );
    } else {
      this.submarine.setRotation(
        Phaser.Math.Angle.RotateTo(currentAngle, 0, speed)
      );
    }
  }

  movePlayer() {
    if (!this.isGamePaused) {
      this.submarine.body.velocity.y = -250;
    }
  }

  checkPlayerOutOfBounds() {
    const playerTooLow =
      this.submarine.y >= this.config.height - this.submarine.height / 2;
    const playerTooHigh =
      Math.round(this.submarine.y) <= this.submarine.height / 2;
    if (playerTooHigh || playerTooLow) {
      this.handleRestartOnLoss();
    }
  }

  handleRestartOnLoss() {
    this.submarine.setTexture("explosion");
    this.isGamePaused = true;
    this.physics.pause();
    this.UI.saveBestScore();
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.submarine.setTexture("submarine");
        this.submarine.setX(this.initialPosition.x);
        this.submarine.setY(this.initialPosition.y);
        this.physics.resume();
        this.scene.restart();
      },
      loop: false,
    });
  }

  getNumberBetween(lower, upper) {
    return Math.min(upper, Math.round(Math.random() * upper) + lower);
  }

  addNewPipes(delta) {
    if (this.pipeTimer >= this.currentPipeInterval) {
      const lowerBound =
        this.difficulties[this.currentDifficulty].pipeIntervalRange[0];
      const upperBound =
        this.difficulties[this.currentDifficulty].pipeIntervalRange[1];
      this.createPipePair();
      this.currentPipeInterval = this.getNumberBetween(lowerBound, upperBound);
      this.pipeTimer = 0;
    } else {
      this.pipeTimer += delta;
    }
  }

  createPipePair() {
    const lowerBound = this.difficulties[this.currentDifficulty].pipeGap[0];
    const upperBound = this.difficulties[this.currentDifficulty].pipeGap[1];
    const pipeAlignment = 180;
    const pipeWidth = 60;
    const pipeGap = this.getNumberBetween(lowerBound, upperBound) / 2;
    const offsetFromCentre =
      Math.round(Math.random() * 150) * (Math.round(Math.random()) ? 1 : -1);

    const pipeX = this.config.width + pipeWidth;

    const topPipeY = 0 - pipeAlignment - pipeGap + offsetFromCentre;
    const bottomPipeY =
      this.config.height + pipeAlignment + pipeGap + offsetFromCentre;

    const pipes = this.physics.add.group();
    const randomPipeColour = Math.round(Math.random() * 4);

    pipes
      .create(pipeX, topPipeY, "pipes", randomPipeColour)
      .setOrigin(0.5, 0)
      .setFlipY(true);

    pipes
      .create(pipeX, bottomPipeY, "pipes", randomPipeColour)
      .setOrigin(0.5, 1);
    pipes.setVelocityX(this.difficulties[this.currentDifficulty].pipeVelocity);
    console.log("vel", this.difficulties[this.currentDifficulty].pipeVelocity);
    this.physics.add.collider(this.submarine, pipes, () =>
      this.handleRestartOnLoss()
    );
    this.allPipes.push(pipes);
  }

  deleteOldPipes() {
    if (this.allPipes.length > 1) {
      if (this.allPipes[0].getChildren()[0].x <= 0) {
        this.UI.increaseScore();
        this.checkForDifficultyIncrease();
        this.allPipes[0].clear();
        this.allPipes.splice(0, 1);
      }
    }
  }

  checkForDifficultyIncrease() {
    if (this.UI.score == 3) {
      this.currentDifficulty = "normal";
      this.bgSpeed = 3;
    }
    if (this.UI.score == 15) {
      this.currentDifficulty = "hard";
      this.bgSpeed = 5;
    }
  }
}

export default PlayScene;

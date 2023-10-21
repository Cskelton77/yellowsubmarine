import Phaser from "phaser";
import { BaseScene } from "./BaseScene";
import { SharedConfig } from "..";
import { UserInterface } from "./UserInterfaceScene";
import { Submarine } from "../entities/Submarine";
import { PipePair } from "../entities/PipePair";
import { DifficultyConfig, DifficultyLevel } from "../types/Difficulty";
import { difficulties } from "../difficulty.config";

class PlayScene extends BaseScene {
    submarine: Submarine
    UI: UserInterface;

    pauseEvent: Phaser.Events.EventEmitter;
    initialPosition: {
        x: number;
        y: number;
    }

    difficultyValues: DifficultyConfig = difficulties
     
    isGamePaused = false;

    allPipes: Array<Phaser.Physics.Arcade.Group>;
    pipeTimer = 0;
    currentPipeInterval = 2500
    currentDifficulty = DifficultyLevel.EASY;

    constructor(config: SharedConfig) {
        super({ config, sceneName: "PlayScene" });

        this.initialPosition = {
            x: this.config.width / 6.5,
            y: this.config.height / 2,
        };
    }

    init() {
        this.isGamePaused = false;
        this.allPipes = [];
        this.pipeTimer = 0;
        this.allPipes.forEach((pipe) => {
            pipe.clear(true, true);
        });
        this.currentDifficulty = DifficultyLevel.EASY;
    }

    create() {
        super.create();
        this.scene.launch("UserInterface", this.config);
        this.UI = this.scene.get("UserInterface") as UserInterface;
        this.createPlayer();
        this.listenToEvents();
    }

    update(time: number, delta: number) {
        super.update(time, delta);
        if (!this.isGamePaused) {
            this.addNewPipes(delta);
            this.deleteOldPipes();
            this.submarine.checkForInBounds(() => this.handleRestartOnLoss());
            this.submarine.rotate();
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

    createPlayer() {
        this.submarine = new Submarine(this, this.initialPosition.x, this.initialPosition.y);
        this.config.width < 900 && this.submarine.setScale(0.75);
    }

    handleRestartOnLoss() {
        this.submarine.explode();
        this.isGamePaused = true;
        this.physics.pause();
        this.UI.saveBestScore();
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.submarine.reset(this.initialPosition.x, this.initialPosition.y);
                this.physics.resume();
                this.scene.restart();
            },
            loop: false,
        });
    }

    addNewPipes(delta: number) {
        if (this.pipeTimer >= this.currentPipeInterval) {
            const { pipeIntervalRange, pipeGapRange, pipeVelocity } = this.difficultyValues[this.currentDifficulty];
            const pipeGap = Phaser.Math.Between(...pipeGapRange) / 2;
            const pipes = new PipePair(this, this.config.width, this.config.height, pipeGap, pipeVelocity)
            this.physics.add.collider(this.submarine, pipes, () =>
                this.handleRestartOnLoss()
            );
            this.allPipes.push(pipes);
            this.currentPipeInterval = Phaser.Math.Between(...pipeIntervalRange);
            this.pipeTimer = 0;
        } else {
            this.pipeTimer += delta;
        }
    }

    deleteOldPipes() {
        if (this.allPipes.length > 1) {
            if((this.allPipes[0].getChildren()[0] as Phaser.GameObjects.Image).x <= 0) {
                this.UI.increaseScore();
                this.checkForDifficultyIncrease();
                this.allPipes[0].clear();
                this.allPipes.splice(0, 1);
            }
        }
    }

    checkForDifficultyIncrease() {
        if (this.UI.score == 3) {
            this.currentDifficulty = DifficultyLevel.NORMAL;
            this.bgSpeed = 3;
        }
        if (this.UI.score == 15) {
            this.currentDifficulty = DifficultyLevel.HARD;
            this.bgSpeed = 5;
        }
    }
}

export default PlayScene;

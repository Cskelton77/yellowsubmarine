export class Submarine extends Phaser.Physics.Arcade.Sprite {

    constructor(scene: Phaser.Scene, x: number, y: number){
        super(scene, x, y, 'submarine');
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.gravity.y = 400;
        this.setBodySize(this.width / 2, this.height / 3)
        this.setOffset(50);
        this.setCollideWorldBounds(true);
        this.registerInputs();
    }

    registerInputs() {
        this.scene.input.on("pointerdown", () => this.move());
        this.scene.input.keyboard.on("keydown-SPACE", () => this.move());
    }

    move() {
        this.body.velocity.y = -250;
    }

    rotate() {
        const vel = this.body.velocity.y;
        const speed = 0.5;
        const currentAngle = Phaser.Math.DegToRad(this.angle);
        const desiredAngle = -Phaser.Math.DegToRad(45);
        if (vel < 0) {
            this.setRotation( Phaser.Math.Angle.RotateTo(currentAngle, desiredAngle, speed));
        } else {
            this.setRotation(Phaser.Math.Angle.RotateTo(currentAngle, 0, speed));
        }
    }

    checkForInBounds(callback: () => void) {
        const gameHeight = this.scene.game.config.height as number;
        const playerTooLow =  this.y >= gameHeight - this.height / 2;
        const playerTooHigh = Math.round(this.y) <= this.height / 2;
        if (playerTooHigh || playerTooLow) {
            callback();
        }
    }

    explode(){
        this.setTexture("explosion");
    }

    reset(x: number, y: number){
        this.setTexture("submarine");
        this.setX(x);
        this.setY(y);
    }
}

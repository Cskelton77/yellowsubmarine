export class PipePair extends Phaser.Physics.Arcade.Group {
    
    constructor(scene: Phaser.Scene, width: number, height: number, pipeGap: number, velocity: number){
        super(scene.physics.world, scene);
        this.scene.physics.add.group();

        const pipeAlignment = 180;
        const pipeWidth = 60;
        const offsetFromCentre = Math.round(Math.random() * 150) * (Math.round(Math.random()) ? 1 : -1);

        const pipeX = width + pipeWidth;
        const topPipeY = 0 - pipeAlignment - pipeGap + offsetFromCentre;
        const bottomPipeY = height + pipeAlignment + pipeGap + offsetFromCentre;
        const randomPipeColour = Math.round(Math.random() * 4);

        this.create(pipeX, topPipeY, "pipes", randomPipeColour)
            .setOrigin(0.5, 0)
            .setFlipY(true);
            
        this.create(pipeX, bottomPipeY, "pipes", randomPipeColour)
            .setOrigin(0.5, 1);

        this.setVelocityX(velocity);
    }
}

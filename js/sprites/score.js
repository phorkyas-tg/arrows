class Score extends Phaser.Physics.Arcade.Sprite
{
    constructor (scene, x, y)
    {
        super(scene, x, y, 'number');
    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);
    }
}

class ScoreNumbers extends Phaser.Physics.Arcade.Group
{
    constructor (scene)
    {
        super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: 5,
            key: 'number',
            active: true,
            visible: true,
            classType: Score,
            setXY: { x: 182, y: 34, stepX: 8 }
        });
    }
}
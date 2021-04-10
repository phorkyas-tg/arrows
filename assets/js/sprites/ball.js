class Ball extends Phaser.Physics.Arcade.Sprite
{
    constructor (scene, x, y)
    {
        super(scene, x, y, 'ball');
    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);
    }

    hit(tipX, tipY)
    {
        if (tipX > this.x){
            this.disableBody(true, true);
            return false
        }
        return true
    }
}

class Balls extends Phaser.Physics.Arcade.Group
{
    constructor (scene)
    {
        super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: 10,
            key: 'ball',
            active: true,
            visible: true,
            classType: Ball,
            setXY: { x: CANVAS_WIDTH - 180, y: CANVAS_HEIGHT - 100, stepX: 17 }
        });
    }
}
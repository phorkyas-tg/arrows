class Laser extends Phaser.Physics.Arcade.Sprite
{
    constructor (scene, x, y)
    {
        super(scene, x, y, 'laser');
    }

    fire (x, y)
    {
        this.body.reset(x, y);

        this.setActive(true);
        this.setVisible(true);
        this.setVelocityX(80);
    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);

        if (this.x >= CANVAS_WIDTH - 32)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }

    getTip()
    {
        var tipX = this.x + this.width;
        var tipY = this.y + (this.height / 2);
        return [tipX, tipY]
    }
}

class Lasers extends Phaser.Physics.Arcade.Group
{
    constructor (scene)
    {
        super(scene.physics.world, scene);

        scene.anims.create({
            key: ANIM_LASER,
            frames: scene.anims.generateFrameNumbers('laser', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1,
        });

        this.createMultiple({
            frameQuantity: 5,
            key: 'laser',
            active: false,
            visible: false,
            classType: Laser
        });
    }

    fireLaser (x, y)
    {
        let laser = this.getFirstDead(false);

        if (laser)
        {
            laser.fire(x, y);
            laser.anims.play(ANIM_LASER)
        }
    }
}

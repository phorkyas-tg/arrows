class Mower extends Phaser.Physics.Arcade.Sprite
{
    constructor (scene, x, y, key="mower")
    {
        super(scene, x, y, key);
        this.isHit = false
    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);
    }

    hit(tipX, tipY)
    {
        if (this.inHitBox(tipX, tipY) && this.isHit == false)
        {
            this.setVelocityX(0);
            this.isHit = true;
            this.disableBody(true, true);
            return true;
        }
        return false;
    }

    inHitBox(x, y)
    {
        return true
    }

    getBaseScore()
    {
        return 20;
    }

    getEnergyDrain()
    {
        return 0;
    }

    initExplosionEvent()
    {

    }
}

class Mowers extends Phaser.Physics.Arcade.Group
{
    constructor (scene, key="mower", cl=Mower, mowerCount=1, minVelocity=40, maxVelocity=40)
    {
        super(scene.physics.world, scene);

        this.mowerCount = mowerCount;

        scene.anims.create({
           key: ANIM_MOWER_IDLE,
           frames: scene.anims.generateFrameNumbers(key, { start: 0, end: 1 }),
           frameRate: 10,
           repeat: -1,
        });

        this.createMultiple({
            frameQuantity: this.mowerCount,
            key: key,
            active: true,
            visible: true,
            classType: cl,
            setXY: { x: CANVAS_WIDTH + 100, y: CANVAS_HEIGHT - 100, stepX: Phaser.Math.Between(65, 100)}
        });

        this.children.iterate(function (target) {
           target.setVelocityX(Phaser.Math.Between(-minVelocity, -maxVelocity));
           target.setOrigin(0, 0);
           target.y = Phaser.Math.Between(65, 170);
           target.anims.play(ANIM_MOWER_IDLE);
           target.initExplosionEvent();
        });
    }

    countHitTargets()
    {
        var count = 0
        this.children.iterate(function (disc) {
           if (disc.isHit)
           {
                count++;
           }
        });
        return count
    }

    isEmpty()
    {
        if (this.countHitTargets() === this.mowerCount)
        {
            return true
        }
        return false
    }
}
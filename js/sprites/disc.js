class Disc extends Phaser.Physics.Arcade.Sprite
{
    constructor (scene, x, y, key="disc")
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
            this.setVelocityY(0);
            this.isHit = true;
            return true;
        }
        return false;
    }

    inHitBox(x, y)
    {
        let centerX = this.x + 8;
        let centerY = this.y + 14;
        let centerXWidth = 2;
        let centerYHeight = 4;

        if (x >= centerX && x <= (centerX + centerXWidth) &&
            y >= centerY && y <= centerY + centerYHeight)
        {
            return true;
        }
        return false;
    }

    getBaseScore()
    {
        return 100;
    }

    getEnergyDrain()
    {
        return 0;
    }

    initExplosionEvent()
    {

    }
}

class Discs extends Phaser.Physics.Arcade.Group
{
    constructor (scene, key="disc", cl=Disc, discCount=1, minVelocity=40, maxVelocity=40)
    {
        super(scene.physics.world, scene);

        this.discCount = discCount;

        this.createMultiple({
            frameQuantity: this.discCount,
            key: key,
            active: true,
            visible: true,
            classType: cl,
            setXY: { x: CANVAS_WIDTH - 50, y: CANVAS_HEIGHT - 100, stepX: -17 }
        });

        this.children.iterate(function (target) {
           target.setVelocityY(Phaser.Math.Between(minVelocity, maxVelocity));
           target.setCollideWorldBounds(true);
           target.setBounce(1);
           target.setOrigin(0, 0);
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
        if (this.countHitTargets() === this.discCount)
        {
            return true
        }
        return false
    }
}
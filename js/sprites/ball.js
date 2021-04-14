class Ball extends Phaser.Physics.Arcade.Sprite
{
    constructor (scene, x, y)
    {
        super(scene, x, y, 'ball');

        this.isHit = false
    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);
    }

    hit(tipX, tipY)
    {
        if (tipX > this.x && !this.isHit){
            this.setVelocityY(0);
            this.isHit = true;
            this.anims.play(ANIM_BALL_EXPLOSION);
            return true;
        }
        return false;
    }

    getBaseScore()
    {
        return 5;
    }

    initExplosionEvent()
    {
        this.on('animationcomplete', function(animation, frame) {
           if(animation.key === ANIM_BALL_EXPLOSION) {
               this.disableBody(true, true);
           }
       }, this);
    }
}

class Balls extends Phaser.Physics.Arcade.Group
{
    constructor (scene)
    {
        super(scene.physics.world, scene);

        this.ballCount = 10;

        this.createMultiple({
            frameQuantity: this.ballCount,
            key: 'ball',
            active: true,
            visible: true,
            classType: Ball,
            setXY: { x: CANVAS_WIDTH - 180, y: CANVAS_HEIGHT - 100, stepX: 17 }
        });
    }

    countHitTargets()
    {
        var count = 0
        this.children.iterate(function (ball) {
           if (ball.isHit)
           {
                count++;
           }
        });
        return count
    }

    isEmpty()
    {
        if (this.countHitTargets() === this.ballCount)
        {
            return true
        }
        return false
    }
}
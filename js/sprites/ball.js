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
        if (tipX < (this.x + this.width/2) &&
                tipX > (this.x + 3) &&
                tipY > (this.y + 1) &&
                tipY < (this.y + this.height - 1)  &&
                !this.isHit)
        {
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

class EnemyBall extends Phaser.Physics.Arcade.Sprite
{
    constructor (scene, x, y)
    {
        super(scene, x, y, 'enemyBall');

        this.isHit = false
    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);
    }

    hit(tipX, tipY)
    {
        if (tipX < (this.x + this.width/2) &&
                tipX > (this.x + 3) &&
                tipY > (this.y + 1) &&
                tipY < (this.y + this.height - 1)  &&
                !this.isHit)
        {
            this.setVelocityY(0);
            this.isHit = true;
            this.anims.play(ANIM_ENEMY_BALL_EXPLOSION);
            return true;
        }
        return false;
    }

    getEnergyDrain()
    {
        return 3;
    }

    initExplosionEvent()
    {
        this.on('animationcomplete', function(animation, frame) {
           if(animation.key === ANIM_ENEMY_BALL_EXPLOSION) {
               this.disableBody(true, true);
           }
       }, this);
    }
}

class Balls extends Phaser.Physics.Arcade.Group
{
    constructor (scene, ballCount=10)
    {
        super(scene.physics.world, scene);

        this.ballCount = ballCount;

        this.createMultiple({
            frameQuantity: this.ballCount,
            key: 'ball',
            active: true,
            visible: true,
            classType: Ball,
            setXY: { x: CANVAS_WIDTH - 190, y: CANVAS_HEIGHT - 100, stepX: 17 }
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

class EnemyBalls extends Phaser.Physics.Arcade.Group
{
    constructor (scene, ballCount=3)
    {
        super(scene.physics.world, scene);

        this.ballCount = ballCount;

        this.createMultiple({
            frameQuantity: this.ballCount,
            key: 'enemyBall',
            active: true,
            visible: true,
            classType: EnemyBall,
            setXY: { x: CANVAS_WIDTH - 190, y: CANVAS_HEIGHT - 50, stepX: 17 }
        });
    }
}
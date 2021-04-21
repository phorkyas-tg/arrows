class Ball extends Phaser.Physics.Arcade.Sprite
{
    constructor (scene, x, y, key="ball")
    {
        super(scene, x, y, key);
        this.isHit = false

        this.radius = this.width / 2
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
            this.playExplosionAnim();
            return true;
        }
        return false;
    }

    playExplosionAnim()
    {
        this.anims.play(ANIM_BALL_EXPLOSION);
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

class EnemyBall extends Ball
{
    constructor (scene, x, y, key=enemyBall)
    {
        super(scene, x, y, 'enemyBall');
    }

    playExplosionAnim()
    {
        this.anims.play(ANIM_ENEMY_BALL_EXPLOSION);
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
    constructor (scene, key="ball", cl=Ball, animKey=ANIM_BALL_EXPLOSION, ballCount=10, minVelocity=40, maxVelocity=40)
    {
        super(scene.physics.world, scene);

        this.ballCount = ballCount;

        this.createMultiple({
            frameQuantity: this.ballCount,
            key: key,
            active: true,
            visible: true,
            classType: cl,
            setXY: { x: CANVAS_WIDTH - 190, y: CANVAS_HEIGHT - 100, stepX: 17 }
        });

        this.children.iterate(function (target) {
           target.setVelocityY(Phaser.Math.Between(minVelocity, maxVelocity));
           target.setCollideWorldBounds(true);
           target.setBounce(1);
           target.setOrigin(0, 0);
           target.initExplosionEvent()
        });

        scene.anims.create({
           key: animKey,
           frames: scene.anims.generateFrameNumbers(key, { start: 1, end: 6 }),
           frameRate: 10,
           repeat: 0,
        });
    }

    distributeAAB()
    {
        let step = 0;
        let i = 0
        this.children.iterate(function (target) {
            if (i % 2 == 0 && i != 0)
            {
                step += target.width + 1
            }
            target.x += step;
            i++;
        });
    }

    distributeBBA()
    {
        let step = 0;
        let i = 0
        this.children.iterate(function (target) {
            step += 2 * (target.width + 1)
            target.x += step;
            i++;
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

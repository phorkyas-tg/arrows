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
            this.setVelocityY(0);
            this.anims.play(ANIM_BALL_EXPLOSION);
            return true
        }
        return false
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
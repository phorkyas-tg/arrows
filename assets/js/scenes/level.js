class Level extends Phaser.Scene
{
    constructor (key)
    {
        super({ "key": key });

        this.player = null;
        this.cursors = null;
        this.idle = true;
        this.isBusy = false
        this.lasers;
        this.targets;
    }

    preload ()
    {
        this.load.spritesheet('hero', 'assets/sprites/4c_32_32_hero.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('border', 'assets/sprites/4c_256_224_border.png');
        this.load.spritesheet('ball', 'assets/sprites/4c_16_16_ball.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('laser', 'assets/sprites/4c_8_8_laser.png', { frameWidth: 8, frameHeight: 8 });
    }

    create ()
    {
        // set border and world bound
        this.add.image(128, 112, 'border');
        this.physics.world.setBounds(15, 60, 224, 148)

        // override this method to generate specific targets
        this.createTargets()

        // create laser groups
        this.lasers = new Lasers(this);

        // add collider for lasers and targets
        this.physics.add.overlap(this.lasers, this.targets, this.hitTarget, null, this);

        // The player and its settings
        this.player = this.physics.add.sprite(32, 100, 'hero');
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: ANIM_IDLE,
            frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: ANIM_SHOOT,
            frames: this.anims.generateFrameNumbers('hero', { start: 8, end: 15 }),
            frameRate: 10,
            repeat: 0,
        });

        this.player.on('animationcomplete', function(animation, frame) {
            if(animation.key === ANIM_SHOOT) {
                this.idle = true;
                this.isBusy = false
            }
        }, this);

        this.player.on('animationupdate', function(animation, frame) {
          if(animation.key === ANIM_SHOOT && frame.index === 4) {
              this.lasers.fireLaser(this.player.x + 17, this.player.y - 2);
          }
        }, this);

        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    createTargets()
    {

    }

    hitTarget(laser, target)
    {
        var tip = laser.getTip()
        var isHit = target.hit(tip[0], tip[1])

        // check if all balls are popped
        if (this.targets.countActive(true) === 0)
        {
            this.win()
        }
    }

    gameOver()
    {
        this.scene.start("EndScreen", {
            "message": "Game Over",
            "nextLevel": 1
        });
    }

    win()
    {
        this.scene.start("EndScreen", {
            "message": "WIN",
            "nextLevel": 2
        });
    }

    update ()
    {
        if (!this.isBusy)
        {
            if (this.cursors.space.isDown)
            {
                this.idle = false
                this.isBusy = true
                this.player.anims.play(ANIM_SHOOT);
            }
            else if (this.cursors.up.isDown)
            {
                this.player.y -= 2;
            }
            else if (this.cursors.down.isDown)
                {
                    this.player.y += 2;
                }
            else if (this.cursors.shift.isDown)
            {
                this.gameOver()
            }
            if (this.idle)
            {
                this.player.anims.play(ANIM_IDLE, true);
            }
        }
    }
}

class LevelOne extends Level
{
    createTargets()
    {
       // create target group
       this.targets = new Balls(this)
       this.targets.children.iterate(function (target) {
           target.setVelocityY(40);
           target.setCollideWorldBounds(true);
           target.setBounce(1);
       });
    }
}

class LevelTwo extends Level
{
    createTargets()
    {
       // create target group
       this.targets = new Balls(this)
       this.targets.children.iterate(function (target) {
           target.setVelocityY(80);
           target.setCollideWorldBounds(true);
           target.setBounce(1);
       });
    }
}
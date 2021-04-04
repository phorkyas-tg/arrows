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
    }

    preload ()
    {
        this.load.spritesheet('hero', 'assets/sprites/4c_32_32_hero.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('border', 'assets/sprites/4c_256_224_border.png');
        this.load.spritesheet('laser', 'assets/sprites/4c_8_8_laser.png', { frameWidth: 8, frameHeight: 8 });
        this.load.spritesheet('ball', 'assets/sprites/4c_16_16_ball.png', { frameWidth: 16, frameHeight: 16 });
    }

    create ()
    {
        // set border and world bound
        this.add.image(128, 112, 'border');
        this.physics.world.setBounds(15, 60, 224, 148)

        // create bullet groups
        this.lasers = new Lasers(this);

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
                this.scene.start("EndScreen", {
                    "message": "Game Over"
                });
            }
            if (this.idle)
            {
                this.player.anims.play(ANIM_IDLE, true);
            }
        }
    }
}
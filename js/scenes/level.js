class Level extends Phaser.Scene
{
    constructor (key)
    {
        super({ "key": key });

        this.player = null;
        this.cursors = null;
        this.idle;
        this.isBusy;
        this.lasers;
        this.targets;

        this.energyLevel;
        this.energy;
    }

    init (data)
    {
        if (data.energyLevel == undefined)
        {
            this.energyLevel = 25
        }
        else
        {
            this.energyLevel = data.energyLevel;
        }

    }

    preload ()
    {
        this.load.spritesheet('hero', 'assets/sprites/4c_32_32_hero.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('border', 'assets/sprites/4c_256_224_border.png');
        this.load.image('bg', 'assets/sprites/4c_224_144_headquarter.png');
        this.load.spritesheet('energy', 'assets/sprites/4c_96_32_energy.png', { frameWidth: 96, frameHeight: 32 });
        this.load.spritesheet('ball', 'assets/sprites/4c_16_16_ball.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('laser', 'assets/sprites/4c_8_8_laser.png', { frameWidth: 8, frameHeight: 8 });
    }

    create ()
    {
        // set border and world bound
        this.add.image(128, 112, 'border');
        var bg = this.add.image(16, 64, 'bg');
        bg.setOrigin(0, 0)
        this.physics.world.setBounds(15, 60, 224, 148)

        // override this method to generate specific targets
        this.createTargets()

        // create laser groups
        this.lasers = new Lasers(this);

        // add collider for lasers and targets
        this.physics.add.overlap(this.lasers, this.targets, this.hitTarget, null, this);

        // The player and its settings
        this.createPlayer()

        // energy
        this.createEnergy()

        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    setEnergyLevel (currentEnergyLevel, boost)
    {
        if (currentEnergyLevel == undefined)
        {
            this.energyLevel = boost
        }
        else
        {
            this.energyLevel = currentEnergyLevel + boost;
            if (this.energyLevel > 25)
            {
                this.energyLevel = 25;
            }
        }
    }

    createEnergy()
    {
        this.energy = this.physics.add.sprite(55, 10, 'energy');
        // x and y is in the upper left corner
        this.energy.setOrigin(0, 0)

        for (var i = 0; i < 12; i += 2)
        {
            this.anims.create({
                key: ANIM_ENERGY + (i/2),
                frames: this.anims.generateFrameNumbers('energy', { start: i, end: i+1 }),
                frameRate: 1,
                repeat: -1,
            });
        };

        for (var i = 12; i < 32; i ++)
        {
            this.anims.create({
                key: ANIM_ENERGY + (i - 6),
                frames: this.anims.generateFrameNumbers('energy', { start: i, end: i }),
                frameRate: 1,
                repeat: -1,
            });
        };

        this.energy.anims.play(ANIM_ENERGY + this.energyLevel);
    }

    createPlayer()
    {
        this.idle = true;
        this.isBusy = false;
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
    }

    createTargets()
    {

    }

    hitTarget(laser, target)
    {
        var tip = laser.getTip()
        var isHit = target.hit(tip[0], tip[1])
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
            "nextLevel": 2,
            "energyLevel": this.energyLevel
        });
    }

    update ()
    {
        // check if all targets are disabled
        if (this.targets.countActive(true) === 0)
        {
            this.win()
        }

        if (!this.isBusy)
        {
            if (this.cursors.space.isDown)
            {
                this.energyLevel -= 1;
                if (this.energyLevel < 0)
                {
                    this.gameOver()
                }
                else
                {
                    this.energy.anims.play(ANIM_ENERGY + this.energyLevel);
                }

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
    init (data)
    {
        this.setEnergyLevel(data.energyLevel, 8)
    }

    createTargets()
    {
       // create target group
       this.targets = new Balls(this)
       this.targets.children.iterate(function (target) {
           target.setVelocityY(40);
           target.setCollideWorldBounds(true);
           target.setBounce(1);
           target.initExplosionEvent()
       });

       this.anims.create({
           key: ANIM_BALL_EXPLOSION,
           frames: this.anims.generateFrameNumbers('ball', { start: 1, end: 6 }),
           frameRate: 10,
           repeat: 0,
       });

    }
}

class LevelTwo extends Level
{
    init (data)
    {
        this.setEnergyLevel(data.energyLevel, 7)
    }

    createTargets()
    {
       // create target group
       this.targets = new Balls(this)
       this.targets.children.iterate(function (target) {
           target.setVelocityY(Phaser.Math.Between(20, 60));
           target.setCollideWorldBounds(true);
           target.setBounce(1);
           target.initExplosionEvent()
       });

       this.anims.create({
          key: ANIM_BALL_EXPLOSION,
          frames: this.anims.generateFrameNumbers('ball', { start: 1, end: 6 }),
          frameRate: 10,
          repeat: 0,
       });
    }
}
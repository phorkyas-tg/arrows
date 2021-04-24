class Level extends Phaser.Scene
{
    constructor (key)
    {
        super({ "key": key });

        this.levelNumber;
        this.player;
        this.portrait;
        this.cursors;
        this.isBusy;
        this.lasers;
        this.targets;
        this.enemys;
        this.energyLevel;
        this.energy;
        this.won;
        this.score;
        this.comboCounter;
        this.scoreBoard;
        this.clock;
        this.numbers;

        this.helpKey;
    }

    init (data)
    {

    }

    preload ()
    {
        this.load.spritesheet('hero', 'assets/sprites/4c_32_32_hero.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('border', 'assets/sprites/4c_256_224_border.png');
        this.load.image('bg', 'assets/sprites/4c_224_144_headquarter.png');
        this.load.spritesheet('energy', 'assets/sprites/4c_96_32_energy.png', { frameWidth: 96, frameHeight: 32 });
        this.load.spritesheet('ball', 'assets/sprites/4c_16_16_ball.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('enemyBall', 'assets/sprites/4c_16_16_green_ball.png', { frameWidth: 16, frameHeight: 16 });
        this.load.image('disc', 'assets/sprites/4c_16_32_disc.png');
        this.load.spritesheet('laser', 'assets/sprites/4c_8_8_laser.png', { frameWidth: 8, frameHeight: 8 });
        this.load.spritesheet('portrait', 'assets/sprites/4c_32_32_portrait.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('score', 'assets/sprites/4c_55_32_score.png', { frameWidth: 55, frameHeight: 32 });
        this.load.spritesheet('clock', 'assets/sprites/4c_10_10_clock.png', { frameWidth: 10, frameHeight: 10 });
        this.load.spritesheet('number', 'assets/sprites/4c_7_17_number.png', { frameWidth: 7, frameHeight: 17 });
    }

    create ()
    {
        // set win time to -1
        this.won = -1

        // set up score system
        this.createScore()

        // set border and world bound
        this.add.image(128, 112, 'border');
        var bg = this.add.image(16, 64, 'bg');
        bg.setOrigin(0, 0)
        this.physics.world.setBounds(15, 60, 224, 148)

        // override this method to generate specific targets
        this.createTargets()

        // create laser groups
        this.lasers = new Lasers(this);
        this.lasers.children.iterate(function (laser) {
           laser.setOrigin(0, 0);
        });

        // add collider for lasers and targets
        this.physics.add.overlap(this.lasers, this.targets, this.hitTarget, null, this);
        // Add collider for enemy
        if (this.enemys != undefined)
        {
            this.physics.add.overlap(this.lasers, this.enemys, this.hitEnemy, null, this);
        }

        // The player and its settings
        this.createPlayer()

        // create portrait in upper left corner
        this.createPortrait()

        // energy
        this.createEnergy()

        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();
        this.helpKey = this.input.keyboard.addKey('H');
        this.pauseKey = this.input.keyboard.addKey('P');
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

    initScore (currentScore)
    {
        if (currentScore == undefined)
        {
            this.score = 0
        }
        else
        {
            this.score = currentScore
        }
    }

    updateScore()
    {
        let i = 10000;
        let scoreTemp = this.score
        this.numbers.children.iterate(function (number) {
            let n = (scoreTemp - (scoreTemp % i)) / i;
            scoreTemp = scoreTemp - (n * i)
            number.anims.play(ANIM_SCORE_NUMBER + n)
            i = i / 10;
        }, this);
    }

    updateComboMultiplier()
    {
        let n = 0;
        if (this.comboCounter === 2){
            n = 1;
        }
        else if (this.comboCounter === 4){
            n = 2;
        }
        else if (this.comboCounter === 8){
            n = 3;
        }
        else if (this.comboCounter === 16){
            n = 4;
        }
        else if (this.comboCounter > 16){
            n = 5;
        }
        this.scoreBoard.anims.play(ANIM_SCORE_MULTIPLIER + n)
    }

    createScore()
    {
        this.comboCounter = 1;

        this.scoreBoard = this.physics.add.sprite(181, 21, 'score');
        this.scoreBoard.setOrigin(0, 0);

        this.clock = this.physics.add.sprite(224, 22, 'clock');
        this.clock.setOrigin(0, 0);

        // create numbers group
        this.numbers = new ScoreNumbers(this)
        this.numbers.children.iterate(function (number) {
            number.setOrigin(0, 0);
        });

        for (var i = 0; i < 10; i += 1)
        {
            this.anims.create({
                key: ANIM_SCORE_NUMBER + i,
                frames: this.anims.generateFrameNumbers('number', { start: i, end: i }),
                frameRate: 1,
                repeat: -1,
            });
        };

        for (var i = 0; i < 6; i += 1)
        {
            this.anims.create({
                key: ANIM_SCORE_MULTIPLIER + i,
                frames: this.anims.generateFrameNumbers('score', { start: i, end: i }),
                frameRate: 1,
                repeat: -1,
            });
        };

        this.anims.create({
            key: ANIM_SCORE_CLOCK_IDLE,
            frames: this.anims.generateFrameNumbers('clock', { start: 0, end: 0 }),
            frameRate: 1,
            repeat: -1,
        });

        this.anims.create({
            key: ANIM_SCORE_CLOCK_RUN,
            frames: this.anims.generateFrameNumbers('clock', { start: 1, end: 4 }),
            frameRate: 2,
            repeat: 0,
        });

        this.clock.on('animationcomplete', function(animation, frame) {
            if(animation.key === ANIM_SCORE_CLOCK_RUN) {
                this.comboCounter = this.comboCounter / 2;
                this.updateComboMultiplier()
                if(this.comboCounter === 1)
                {
                    this.clock.anims.play(ANIM_SCORE_CLOCK_IDLE);
                }
                else
                {
                    this.clock.anims.play(ANIM_SCORE_CLOCK_RUN);
                }
            }
        }, this);

        this.updateScore()
    }

    createPortrait()
    {
        this.portrait = this.physics.add.sprite(20, 21, 'portrait');
        this.portrait.setOrigin(0, 0);

        var animList = [ANIM_PORTRAIT_IDLE, ANIM_PORTRAIT_EXHAUSTED, ANIM_PORTRAIT_DEAD,
                        ANIM_PORTRAIT_HAPPY, ANIM_PORTRAIT_SHOOT]
        for (var i = 0; i < 5; i ++)
        {
            this.anims.create({
                key: animList[i],
                frames: this.anims.generateFrameNumbers('portrait', { start: i, end: i }),
                frameRate: 1,
                repeat: 0,
            });
        };

        // always play idle if another animation is complete
        this.portrait.on('animationcomplete', function(animation, frame) {
            if (this.energyLevel <= 5)
            {
                this.portrait.anims.play(ANIM_PORTRAIT_EXHAUSTED)
            }
            else if (this.won >= 0)
            {
                this.portrait.anims.play(ANIM_PORTRAIT_HAPPY)
            }
            else
            {
                this.portrait.anims.play(ANIM_PORTRAIT_IDLE)
            }
        }, this);
    }

    createEnergy()
    {
        this.energy = this.physics.add.sprite(68, 21, 'energy');
        // x and y is in the upper left corner
        this.energy.setOrigin(0, 0);

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
        this.isBusy = false;
        this.player = this.physics.add.sprite(32, 100, 'hero');
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: ANIM_IDLE,
            frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1,
        });
        this.player.anims.play(ANIM_IDLE, true);

        this.anims.create({
            key: ANIM_SHOOT,
            frames: this.anims.generateFrameNumbers('hero', { start: 8, end: 15 }),
            frameRate: 10,
            repeat: 0,
        });

        this.player.on('animationcomplete', function(animation, frame) {
            if(animation.key === ANIM_SHOOT) {
                this.isBusy = false
            }
            // play after any other animation is complete idle animation after its complete
            if(animation.key != ANIM_IDLE)
            {
                this.player.anims.play(ANIM_IDLE, true);
            }
        }, this);

        this.player.on('animationupdate', function(animation, frame) {
          if(animation.key === ANIM_SHOOT && frame.index === 4) {
              this.lasers.fireLaser(this.player.x + 17, this.player.y - 6);
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
        if (isHit)
        {
            this.portrait.anims.play(ANIM_PORTRAIT_HAPPY);
            // add to score
            this.score += this.comboCounter * target.getBaseScore();
            // add to ComboCounter
            if (this.comboCounter < 32)
            {
                this.comboCounter *= 2
            }
            this.clock.anims.play(ANIM_SCORE_CLOCK_RUN);

            this.updateScore();
            this.updateComboMultiplier();
        }
    }

    hitEnemy(laser, target)
    {
        var tip = laser.getTip()
        var isHit = target.hit(tip[0], tip[1])
        if (isHit)
        {
            this.portrait.anims.play(ANIM_PORTRAIT_DEAD);
            // drain Energy
            this.energyLevel -= target.getEnergyDrain();
            if (this.energyLevel < 0)
            {
                this.gameOver()
            }
            else
            {
                this.energy.anims.play(ANIM_ENERGY + this.energyLevel);
            }
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
            "nextLevel": this.levelNumber + 1,
            "energyLevel": this.energyLevel,
            "score": this.score
        });
    }

    update (time, delta)
    {
        // check if all targets are hit
        if (this.targets.isEmpty() && this.won < 0)
        {
            this.portrait.anims.play(ANIM_PORTRAIT_HAPPY)
            this.won = time
        }
        // play win after 1000 ms
        if (this.won > 0 && this.won + 1000 < time)
        {
            this.win()
        }

        // Movement
        if (this.cursors.up.isDown)
        {
            this.player.y -= 2;
        }
        else if (this.cursors.down.isDown)
        {
            this.player.y += 2;
        }
        // restart (for debugging)
        else if (this.cursors.shift.isDown)
        {
            this.win()
        }

        // everything around shooting
        if (!this.isBusy && this.won < 0)
        {
            // Check game over condition
            // if there is no active laser in the air and you have no
            // energy you lose and you are not busy
            if (this.energyLevel <= 0 && this.lasers.countActive(true) === 0)
            {
                this.gameOver();
            }
            else if (this.cursors.space.isDown)
            {
                // you can only shoot if energyLevel > 0
                if (this.energyLevel > 0)
                {
                    this.energyLevel -= 1;
                    this.energy.anims.play(ANIM_ENERGY + this.energyLevel);
                    this.isBusy = true
                    this.player.anims.play(ANIM_SHOOT);
                    this.portrait.anims.play(ANIM_PORTRAIT_SHOOT)
                }
            }
        }

        if (this.helpKey.isDown || this.pauseKey.isDown)
        {
            this.scene.pause();
            this.scene.launch('help', {
                "currentLevel": "Level" + this.levelNumber,
            });
        }
    }
}

class LevelOne extends Level
{
    init (data)
    {
        this.setEnergyLevel(data.energyLevel, 5)
        this.initScore(data.score);
        this.levelNumber = 1;
    }

    createTargets()
    {
       // create target group
       this.targets = new Balls(this, "ball", Ball, ANIM_BALL_EXPLOSION, 10, 40, 40)
    }
}

class LevelTwo extends Level
{
    init (data)
    {
        this.setEnergyLevel(data.energyLevel, 7);
        this.initScore(data.score);
        this.levelNumber = 2;
    }

    createTargets()
    {
       // create target group
       this.targets = new Balls(this, "ball", Ball, ANIM_BALL_EXPLOSION, 10, 20, 60)
    }
}

class LevelThree extends Level
{
    init (data)
    {
        this.setEnergyLevel(data.energyLevel, 7);
        this.initScore(data.score);
        this.levelNumber = 3;
    }

    createTargets()
    {
        // create target group
        this.targets = new Balls(this, "ball", Ball, ANIM_BALL_EXPLOSION, 7, 20, 60)
        this.enemys = new Balls(this, "enemyBall", EnemyBall, ANIM_ENEMY_BALL_EXPLOSION, 3, 10, 15)

        this.targets.distributeAAB()
        this.enemys.distributeBBA()
    }
}

class LevelFour extends Level
{
    init (data)
    {
        this.setEnergyLevel(data.energyLevel, 7);
        this.initScore(data.score);
        // ToDo set this to 4 if there is a level 5
        this.levelNumber = 3;
    }

    createTargets()
    {
        // create target group
        this.targets = new Discs(this, "disc", Disc, 1, 40, 40)
    }
}

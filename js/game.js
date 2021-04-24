const ANIM_SHOOT = 'player-shoot';
const ANIM_IDLE = "player-idle";
const ANIM_ENERGY = "energy-level-"
const ANIM_LASER = "laser-idle"
const ANIM_BALL_EXPLOSION = "ball-explosion"
const ANIM_ENEMY_BALL_EXPLOSION = "enemy-ball-explosion"
const ANIM_DISC_EXPLOSION = "disc-explosion"
const ANIM_MOWER_IDLE = "mower-idle"
const ANIM_PORTRAIT_IDLE = "portrait-idle"
const ANIM_PORTRAIT_SHOOT = "portrait-shoot"
const ANIM_PORTRAIT_HAPPY = "portrait-happy"
const ANIM_PORTRAIT_DEAD = "portrait-dead"
const ANIM_PORTRAIT_EXHAUSTED = "portrait-exhausted"
const ANIM_SCORE_NUMBER = "score-number-"
const ANIM_SCORE_MULTIPLIER = "score-multiplier-"
const ANIM_SCORE_CLOCK_IDLE = "score-clock-idle"
const ANIM_SCORE_CLOCK_RUN = "score-clock-run"
const CANVAS_WIDTH = 256
const CANVAS_HEIGHT = 224

var level1 = new LevelOne("Level1");
var level2 = new LevelTwo("Level2");
var level3 = new LevelThree("Level3");
var level4 = new LevelFour("Level4");
var level5 = new LevelFive("Level5");

var endScreen = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { "key": "EndScreen" });
    },
    init: function(data) {
        this.message = data.message;
        this.nextLevel = data.nextLevel;
        this.energyLevel = data.energyLevel;
        this.score = data.score;
    },
    preload: function() {},
    create: function() {
        var text = this.add.text(
            50,
            50,
            this.message,
            {
                fontSize: 10,
                color: "#000000",
                fontStyle: "bold"
            }
        ).setOrigin(0.5);

        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();
    },

    update: function() {
        // ToDo to something for the transition
        //if (this.cursors.space.isDown)

        this.scene.start("Level" + this.nextLevel, {
            "energyLevel": this.energyLevel,
            "score": this.score
        });

    }
});

var startScreen = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { "key": "StartScreen" });
    },
    preload: function() {
        this.load.spritesheet('start', 'assets/sprites/4c_256_224_Start.png', { frameWidth: 256, frameHeight: 224 });
    },
    create: function() {
        this.start = this.physics.add.sprite(0, 0, 'start').setOrigin(0, 0);

        this.anims.create({
            key: "start-idle",
            frames: this.anims.generateFrameNumbers('start', { start: 0, end: 1 }),
            frameRate: 4,
            repeat: -1,
        });
        this.start.anims.play("start-idle", true);

        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();
    },

    update: function() {
        if (this.cursors.space.isDown)
        {
            this.scene.pause();
            this.scene.start("Level1", {
                "energyLevel": 5,
                "score": 0
            });
        }
    }
});


var help = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize:

    function help ()
    {
        Phaser.Scene.call(this, { key: 'help' });
    },

    init: function(data) {
        this.currentLevel = data.currentLevel;
    },
    preload: function ()
    {
        this.load.image('help', 'assets/sprites/4c_192_128_help.png');
        this.load.spritesheet('hero', 'assets/sprites/4c_32_32_hero.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('space', 'assets/sprites/4c_26_12_key_space.png', { frameWidth: 26, frameHeight: 12 });
        this.load.spritesheet('up', 'assets/sprites/4c_11_12_key_up.png', { frameWidth: 11, frameHeight: 12 });
        this.load.spritesheet('down', 'assets/sprites/4c_11_12_key_down.png', { frameWidth: 11, frameHeight: 12 });
    },

    create: function ()
    {
        this.add.image(32, 64, 'help').setOrigin(0, 0);
        this.playerIdle = this.physics.add.sprite(45, 142, 'hero').setOrigin(0, 0);
        this.playerShoot = this.physics.add.sprite(125, 139, 'hero').setOrigin(0, 0);

        this.anims.create({
            key: "help-idle",
            frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1,
        });
        this.playerIdle.anims.play("help-idle", true);

        this.anims.create({
            key: "help-shoot",
            frames: this.anims.generateFrameNumbers('hero', { start: 8, end: 15 }),
            frameRate: 10,
            repeat: -1,
        });
        this.playerShoot.anims.play("help-shoot", true);

        this.space = this.physics.add.sprite(125, 173, 'space').setOrigin(0, 0);
        this.anims.create({
            key: "help-space",
            frames: this.anims.generateFrameNumbers('space', { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1,
        });
        this.space.anims.play("help-space", true);

        this.up = this.physics.add.sprite(80, 148, 'up').setOrigin(0, 0);
        this.anims.create({
            key: "help-up",
            frames: this.anims.generateFrameNumbers('up', { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1,
        });
        this.up.anims.play("help-up", true);

        this.down = this.physics.add.sprite(80, 162, 'down').setOrigin(0, 0);
        this.anims.create({
            key: "help-down",
            frames: this.anims.generateFrameNumbers('down', { start: 1, end: 0 }),
            frameRate: 2,
            repeat: -1,
        });
        this.down.anims.play("help-down", true);

        this.cursors = this.input.keyboard.createCursorKeys();
    },

    update: function ()
    {
        if (this.cursors.space.isDown)
        {
            this.scene.resume(this.currentLevel);
            this.scene.stop();
        }
    }

});

var config = {
    type: Phaser.AUTO,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    backgroundColor: "#FFFFFF",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [ startScreen, level1, level2, level3, level4, level5, endScreen, help]
};

var game = new Phaser.Game(config);


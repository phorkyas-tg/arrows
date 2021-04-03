const ANIM_SHOOT = 'player-shoot';
const ANIM_IDLE = "player-idle";

var LevelOne = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { "key": "LevelOne" });
    },

    init: function() {
        this.player = null;
        this.cursors = null;
        this.idle = true;
    },

    preload: function() {
        this.load.spritesheet('hero', 'assets/sprites/4c_32_32_hero.png', { frameWidth: 32, frameHeight: 32 });
    },

    create: function() {
        // The player and its settings
        this.player = this.physics.add.sprite(50, 50, 'hero');

        //  Player physics properties. Give the little guy a slight bounce.
        this.player.setCollideWorldBounds(true);

        //  Our player animations, turning, walking left and walking right.
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
            }
        }, this);

        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();
    },

    update: function() {
        if (this.cursors.space.isDown)
        {
            this.idle = false
            this.player.anims.play(ANIM_SHOOT);
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
});

var EndScreen = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { "key": "EndScreen" });
    },
    init: function(data) {
        this.message = data.message;
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
        if (this.cursors.shift.isDown)
        {
            this.scene.start("LevelOne");
        }
    }
});

var config = {
    type: Phaser.AUTO,
    width: 400,
    height: 200,
    backgroundColor: "#5DACD8",
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
    scene: [ LevelOne, EndScreen ]
};

var game = new Phaser.Game(config);


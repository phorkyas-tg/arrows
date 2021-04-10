const ANIM_SHOOT = 'player-shoot';
const ANIM_IDLE = "player-idle";
const CANVAS_WIDTH = 256
const CANVAS_HEIGHT = 224

var level1 = new LevelOne("Level1")
var level2 = new LevelTwo("Level2")

var endScreen = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { "key": "EndScreen" });
    },
    init: function(data) {
        this.message = data.message;
        this.nextLevel = data.nextLevel;
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
            this.scene.start("Level" + this.nextLevel);
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
    scene: [ level1, level2, endScreen ]
};

var game = new Phaser.Game(config);


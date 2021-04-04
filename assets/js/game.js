const ANIM_SHOOT = 'player-shoot';
const ANIM_IDLE = "player-idle";
const CANVAS_WIDTH = 256
const CANVAS_HEIGHT = 224

var LevelOne = new Level("LevelOne")

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
    scene: [ LevelOne, EndScreen ]
};

var game = new Phaser.Game(config);


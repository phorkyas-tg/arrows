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
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var cursors;
var score = 0;
var idle = true

var game = new Phaser.Game(config);

const ANIM_SHOOT = 'player-shoot';
const ANIM_IDLE = "player-idle"

function preload ()
{
    this.load.spritesheet('hero', 'assets/sprites/4c_32_32_hero.png', { frameWidth: 32, frameHeight: 32 });
}

function create ()
{
    // The player and its settings
    player = this.physics.add.sprite(50, 50, 'hero');

    //  Player physics properties. Give the little guy a slight bounce.
    player.setCollideWorldBounds(true);

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

    player.on('animationcomplete', function(animation, frame) {
        if(animation.key === ANIM_SHOOT) {
           idle = true;
        }
    }, this);

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

}

function update ()
{
    if (cursors.space.isDown)
    {
        idle = false
        player.anims.play(ANIM_SHOOT);
    }
    if (idle)
    {
        player.anims.play(ANIM_IDLE, true);
    }
}


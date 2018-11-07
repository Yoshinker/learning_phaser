var config = 
{
    type: Phaser.AUTO,
    width: 320,
    height: 320,
    pixelArt: true,
    physics: 
    {
        default: "arcade",
        arcade: 
        {
            debug: true,
            gravity: { y: 0 }
        }
    },
    scene: 
    {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config); 

let player, keys;
let music, music_config;

function preload()
{
    this.load.image('tiles', 'assets/tileset/gfx/Overworld.png');
    this.load.tilemapTiledJSON("map", "assets/tilemap/map.json");
    this.load.spritesheet("heroe", "assets/spritesheet/heroes.png", {frameWidth: 16, frameHeight: 16});
    this.load.audio('music', ['music/overworld.mp3']);
}

function create()
{
    // ############################
    // 
    //      TILEMAP
    //
    // ############################

    // MAP
    var map = this.make.tilemap({key: "map"});

    // TILESET
    // Premier paramètre = nom du tileset dans Tiled
    var tileset = map.addTilesetImage("Overworld", "tiles");

    // LAYERS
    // Premier paramètre = nom de la couche dans Tiled
    var solLayer = map.createStaticLayer("Sol", tileset, 0, 0);
    var batimentsLayer = map.createStaticLayer("Batiments", tileset, 0, 0);
    var deriereLayer = map.createStaticLayer("Deriere", tileset, 0, 0);
    var obstacleLayer = map.createStaticLayer("Obstacle", tileset, 0, 0);
    
    batimentsLayer.setCollisionByProperty({collides: true});
    obstacleLayer.setCollisionByProperty({collides: true});
    
    // Avant plan des batiments
    deriereLayer.setDepth(10);

    // ############################
    //
    //      PLAYER
    //
    // ############################

    // PLAYER
    player = this.physics.add.sprite(10, 300, 'heroe');
    player.setCollideWorldBounds(true);

    // COLISIONS
    this.physics.add.collider(player, batimentsLayer);
    this.physics.add.collider(player, obstacleLayer);

    // ############################
    //
    //      PLAYER ANIMATIONS
    //
    // ############################

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('heroe', 
            {start: 12, end: 15}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('heroe', 
            {start: 4, end: 7}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('heroe', 
            {start: 8, end: 11}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('heroe', 
            {start: 0, end: 3}),
        frameRate: 10,
        repeat: -1
    });

    // ############################
    //
    //      SOUND
    //
    // ############################

    // BACKGROUND MUSIC
    music_config = {
        mute: false,
        volume: 0.5,
        rate: 1,
        detune: 0,
        seek: 0,
        loop: false,
        delay: 0
    }
    music = this.sound.add("music", music_config);
    music.play();

    // ############################
    //
    //      OTHERS
    //
    // ############################

    // CAMERA
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(player);
    this.cameras.main.followOffset.set(0,0);
    this.cameras.main.setZoom(1.5);

    // TOUCHES
    keys = this.input.keyboard.addKeys("Z,Q,S,D");

}

function update()
{
    // VELOCITY
    player.body.setVelocity(0);
    
    // Vertical movement
    if (keys.D.isDown && keys.Q.isDown)
    {
        staticPlayer();
    }
    else
    {
        if (keys.D.isDown)
        {
            player.body.setVelocityX(50);
        }
        else if (keys.Q.isDown)
        {
            player.body.setVelocityX(-50);
        }   
    }

    // Horizontal movement
    if (keys.Z.isDown && keys.S.isDown)
    {
        staticPlayer();
    }
    else
    {
        if (keys.Z.isDown)
        {
            player.body.setVelocityY(-50);
        }
        else if (keys.S.isDown)
        {
            player.body.setVelocityY(50);
        }

    }

    player.body.velocity.normalize().scale(50);

    // ANIMATION
    if (keys.Z.isDown)
    {
        player.anims.play('up', true);
    }
    else if (keys.Q.isDown)
    {
        player.anims.play('left', true);
    }
    else if (keys.S.isDown)
    {
        player.anims.play('down', true);
    }
    else if (keys.D.isDown)
    {
        player.anims.play('right', true);
    }
    else
    {
        player.anims.stop();
    }
}

function staticPlayer()
{
    player.body.setVelocity(0);
    player.anims.stop();
}
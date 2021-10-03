const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: {
                y: 1000
            },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const playerConfigs = {
    jump: -500,
    speed: 250
}

const floorWidth = 128
const startFloor = 1
const lastFloor = 4
const setCollideWorldBounds = false
let mushroomsCollected = 0
let mushroomsCollectedText
let platforms; 
let player

const game = new Phaser.Game(config);

function preload (){
    this.load.image("bg", "./assets/tileset/BG/BG.png")
    this.load.spritesheet('char', 
        './assets/char/spritesheet.png',
        { frameWidth: 669, frameHeight: 490 }
    );
    this.load.image("floorTop", "./assets/tileset/Tiles/2.png")
    this.load.image("floorTopLeft", "./assets/tileset/Tiles/1.png")
    this.load.image("floorTopRight", "./assets/tileset/Tiles/3.png")
    this.load.image("mushroom", "./assets/tileset/Object/Mushroom_1.png")
}

function create (){
    this.add.image(0, 0, "bg").setOrigin(0,0)
    /*
    =============================================================
    Player
    =============================================================                   
    */
    player = this.physics.add.sprite(100, 350, "char").setOrigin(0,0).setScale(.2)
    player.setBounce(0.2)
    player.setCollideWorldBounds(setCollideWorldBounds)

    this.anims.create({
        key: "run",
        frames: this.anims.generateFrameNumbers("char", {start: 0, end: 8}),
        frameRate: 20,
        repeat: -1
    })

    this.anims.create({
        key: 'stop',
        frames: [ { key: 'char', frame: 0 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'jump',
        frames: [ { key: 'char', frame: 2 } ],
        frameRate: 20
    });

    /*
    =============================================================
    Platforms
    =============================================================                   
    */

    platforms = this.physics.add.staticGroup()
    platforms.create((floorWidth * 0), 500, "floorTopLeft").setOrigin(0,0).refreshBody();
    platforms.create((floorWidth * 1), 500, "floorTop").setOrigin(0,0).refreshBody();
    platforms.create((floorWidth * 2), 500, "floorTopRight").setOrigin(0,0).refreshBody();
    platforms.create((floorWidth * 4), 500, "floorTopLeft").setOrigin(0,0).refreshBody();
    platforms.create((floorWidth * 5), 500, "floorTop").setOrigin(0,0).refreshBody();
    platforms.create((floorWidth * 6), 500, "floorTop").setOrigin(0,0).refreshBody();

    cursors = this.input.keyboard.createCursorKeys();

    /*
    =============================================================
    Mushrooms
    =============================================================                   
    */
    mushrooms = this.physics.add.staticGroup()
    mushrooms.create(425, 300, "mushroom").setOrigin(0,0)

    /*
    =============================================================
    Colisions
    =============================================================                   
    */
    this.physics.add.collider(player, platforms);
    this.physics.add.overlap(player, mushrooms, collectMushrooms, null, this);

    /*
    =============================================================
    Score
    =============================================================                   
    */
    mushroomsCollectedText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
}

function update (){
    /*
    =============================================================
    Player movments
    =============================================================                   
    */
    if (cursors.left.isDown){
        player.flipX = true
        player.setVelocityX(-playerConfigs.speed);
        player.anims.play('run', true);
    }
    else if (cursors.right.isDown){
        player.flipX = false
        player.setVelocityX(playerConfigs.speed);
        player.anims.play('run', true);
    }
    else{
        player.setVelocityX(0);
        player.anims.play('stop');
    }

    if (cursors.up.isDown && player.body.touching.down){
        player.setVelocityY(playerConfigs.jump);
    }

    if(!player.body.touching.down){
        player.anims.play('jump');
    }
}

function collectMushrooms(player, mushroom){
    mushroom.disableBody(true, true);
    mushroomsCollected += 1
    mushroomsCollectedText.setText('Score: ' + score);
}
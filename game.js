const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
    default: 'arcade',
    arcade: { debug: false }
  },
  scene: { preload, create, update }
};

const game = new Phaser.Game(config);
let player, cursors, debrisGroup, itemsGroup, aliensGroup, booksGroup, background, healthText, inventoryText, ventsGroup, puddlesGroup, bodiesGroup, damagedSectionsGroup;
let playerHealth = 100;
let inventory = [];
let lastAlienMoveTime = 0;

function preload() {
  this.load.image('player', 'path/to/player.png');
  this.load.image('background', 'path/to/background.png');
  this.load.image('debris', 'path/to/debris.png');
  this.load.image('item', 'path/to/item.png');
  this.load.image('alien', 'path/to/scarier_alien.png'); // Replace with scarier alien image
  this.load.image('vent', 'path/to/vent.png');
  this.load.image('puddle', 'path/to/puddle.png');
  this.load.image('blood', 'path/to/blood.png');
  this.load.image('body', 'path/to/body.png');
  this.load.image('damagedSection', 'path/to/damagedSection.png');
  this.load.image('book', 'path/to/book.png'); // Add books
}

function create() {
  background = this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(2);
  player = this.physics.add.sprite(config.width / 2, config.height / 2, 'player');
  player.setCollideWorldBounds(true);
  cursors = this.input.keyboard.createCursorKeys();

  createDebris(this);
  createItems(this);
  createAliens(this);
  createVents(this);
  createPuddles(this);
  createBodies(this);
  createDamagedSections(this);
  createBooks(this); // Add books creation

  this.physics.add.collider(player, debrisGroup);
  this.physics.add.collider(player, itemsGroup);
  this.physics.add.collider(player, ventsGroup);
  this.physics.add.collider(player, puddlesGroup);
  this.physics.add.collider(player, bodiesGroup);
  this.physics.add.collider(player, damagedSectionsGroup);
  this.physics.add.collider(player, booksGroup, readBook, null, this); // Add book interaction
  this.physics.add.collider(player, aliensGroup, encounterAlien, null, this);

  healthText = this.add.text(10, 10, `Health: ${playerHealth}`, { fontSize: '16px', fill: '#fff' });
  inventoryText = this.add.text(10, 30, `Inventory: ${inventory.join(', ')}`, { fontSize: '16px', fill: '#fff' });

  createLights(this);
}

function createDebris(scene) {
  debrisGroup = scene.physics.add.group({
    immovable: true
  });
  for (let i = 0; i < 10; i++) {
    let x = Phaser.Math.Between(100, config.width - 100);
    let y = Phaser.Math.Between(100, config.height - 100);
    debrisGroup.create(x, y, 'debris');
  }
}

function createItems(scene) {
  itemsGroup = scene.physics.add.group();
  for (let i = 0; i < 5; i++) {
    let x = Phaser.Math.Between(100, config.width - 100);
    let y = Phaser.Math.Between(100, config.height - 100);
    itemsGroup.create(x, y, 'item');
  }
}

function createAliens(scene) {
  aliensGroup = scene.physics.add.group();
  for (let i = 0; i < 1; i++) {
    let x = Phaser.Math.Between(100, config.width - 100);
    let y = Phaser.Math.Between(100, config.height - 100);
    let alien = aliensGroup.create(x, y, 'alien');
    alien.setCollideWorldBounds(true);
    alien.setBounce(1);
  }
}

function createVents(scene) {
  ventsGroup = scene.physics.add.staticGroup();
  for (let i = 0; i < 5; i++) {
    let x = Phaser.Math.Between(100, config.width - 100);
    let y = Phaser.Math.Between(100, config.height - 100);
    ventsGroup.create(x, y, 'vent');
  }
}

function createPuddles(scene) {
  puddlesGroup = scene.physics.add.staticGroup();
  for (let i = 0; i < 5; i++) {
    let x = Phaser.Math.Between(100, config.width - 100);
    let y = Phaser.Math.Between(100, config.height - 100);
    let puddle = puddlesGroup.create(x, y, 'puddle');
    puddle.setAlpha(0.5);
  }
}

function createBodies(scene) {
  bodiesGroup = scene.physics.add.staticGroup();
  for (let i = 0; i < 3; i++) {
    let x = Phaser.Math.Between(100, config.width - 100);
    let y = Phaser.Math.Between(100, config.height - 100);
    bodiesGroup.create(x, y, 'body');
  }
}

function createDamagedSections(scene) {
  damagedSectionsGroup = scene.physics.add.staticGroup();
  for (let i = 0; i < 3; i++) {
    let x = Phaser.Math.Between(100, config.width - 100);
    let y = Phaser.Math.Between(100, config.height - 100);
    let damagedSection = damagedSectionsGroup.create(x, y, 'damagedSection');
    damagedSection.setAlpha(0.8);
  }
}

function createBooks(scene) {
  booksGroup = scene.physics.add.staticGroup();
  for (let i = 0; i < 3; i++) {
    let x = Phaser.Math.Between(100, config.width - 100);
    let y = Phaser.Math.Between(100, config.height - 100);
    booksGroup.create(x, y, 'book');
  }
}

function collectItem(player, item) {
  item.destroy();
  inventory.push('Item');
  updateInventory();
}

function encounterAlien(player, alien) {
  playerHealth -= 10;
  this.cameras.main.shake(500); // Add camera shake for impact
  updateHealth();
  const angle = Phaser.Math.Angle.Between(alien.x, alien.y, player.x, player.y);
  this.physics.moveToObject(alien, player, 100);
}

function readBook(player, book) {
  console.log("Reading book...");
  // Implement book reading logic
}

function updateHealth() {
  healthText.setText(`Health: ${playerHealth}`);
  if (playerHealth <= 0) {
    console.log("You died!");
    this.scene.restart();
  }
}

function updateInventory() {
  inventoryText.setText(`Inventory: ${inventory.join(', ')}`);
}

function createLights(scene) {
  const flickerLight = scene.add.sprite(200, 150, 'light');
  scene.time.addEvent({ delay: 500, callback: flickerEffect, callbackScope: scene, loop: true, args: [flickerLight] });

  const staticLight = scene.add.sprite(400, 300, 'light');
  staticLight.setAlpha(0.8);

  const offLight = scene.add.sprite(600, 450, 'light');
  offLight.setAlpha(0);
}

function flickerEffect(light) {
  light.setAlpha(Math.random() > 0.5 ? 0.8 : 0);
}

function update() {
  player.setVelocity(0);

  if (cursors.left.isDown) player.setVelocityX(-200);
  if (cursors.right.isDown) player.setVelocityX(200);
  if (cursors.up.isDown) player.setVelocityY(-200);
  if (cursors.down.isDown) player.setVelocityY(200);

  // Alien stalking logic
  const now = this.time.now;
  if (now - lastAlienMoveTime > 1000) { // Move the alien every second
    lastAlienMoveTime = now;
    aliensGroup.children.each(alien => {
      const angle = Phaser.Math.Angle.Between(alien.x, alien.y, player.x, player.y);
      this.physics.moveToObject(alien, player, 100);
    }, this);
  }
}

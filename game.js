let camera, scene, renderer;
let controls;
let player, alien, items = [], water;
let clock = new THREE.Clock();

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Lights
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 10, 10);
  scene.add(light);

  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  // Floor
  const floorGeometry = new THREE.PlaneGeometry(50, 50);
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = - Math.PI / 2;
  scene.add(floor);

  // Player
  const playerGeometry = new THREE.CapsuleGeometry(0.5, 1.5, 32);
  const playerMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  player = new THREE.Mesh(playerGeometry, playerMaterial);
  player.position.set(0, 1, 5);
  scene.add(player);

  // Alien
  const alienGeometry = new THREE.CapsuleGeometry(0.5, 2, 32);
  const alienMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  alien = new THREE.Mesh(alienGeometry, alienMaterial);
  alien.position.set(5, 1, 5);
  scene.add(alien);

  // Items
  const itemGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const itemMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
  for (let i = 0; i < 5; i++) {
    let item = new THREE.Mesh(itemGeometry, itemMaterial);
    item.position.set(Math.random() * 10 - 5, 0.5, Math.random() * 10 - 5);
    items.push(item);
    scene.add(item);
  }

  // Water puddles
  const waterGeometry = new THREE.CircleGeometry(1, 32);
  const waterMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x006994,
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide,
    reflectivity: 1
  });
  water = new THREE.Mesh(waterGeometry, waterMaterial);
  water.rotation.x = - Math.PI / 2;
  water.position.set(2, 0.01, 2); // Slightly above the floor to avoid z-fighting
  scene.add(water);

  // Controls
  controls = new THREE.PointerLockControls(camera, document.body);
  document.addEventListener('click', () => {
    controls.lock();
  });

  controls.addEventListener('lock', () => {
    console.log('Pointer locked');
  });

  controls.addEventListener('unlock', () => {
    console.log('Pointer unlocked');
  });

  window.addEventListener('resize', onWindowResize);

  // Set initial camera position
  camera.position.set(0, 1.5, 10);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  if (controls.isLocked) {
    // Movement
    let moveForward = false;
    let moveBackward = false;
    let moveLeft = false;
    let moveRight = false;

    document.addEventListener('keydown', function (event) {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          moveForward = true;
          break;

        case 'ArrowLeft':
        case 'KeyA':
          moveLeft = true;
          break;

        case 'ArrowDown':
        case 'KeyS':
          moveBackward = true;
          break;

        case 'ArrowRight':
        case 'KeyD':
          moveRight = true;
          break;
      }
    });

    document.addEventListener('keyup', function (event) {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          moveForward = false;
          break;

        case 'ArrowLeft':
        case 'KeyA':
          moveLeft = false;
          break;

        case 'ArrowDown':
        case 'KeyS':
          moveBackward = false;
          break;

        case 'ArrowRight':
        case 'KeyD':
          moveRight = false;
          break;
      }
    });

    if (moveForward) controls.moveForward(10 * delta);
    if (moveBackward) controls.moveBackward(10 * delta);
    if (moveLeft) controls.moveRight(-10 * delta);
    if (moveRight) controls.moveRight(10 * delta);

    // Alien Stalking
    alien.lookAt(player.position);
    alien.translateZ(-5 * delta); // Speed of the alien stalking the player
  }

  renderer.render(scene, camera);
}

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let camera, scene, renderer, controls;
let spaceship;

init();
animate();

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, 15);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Lights
  const light = new THREE.DirectionalLight(0xffffff, 5);
  light.position.set(10, 10, 10);
  light.castShadow = true;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  scene.add(light);

  const ambientLight = new THREE.AmbientLight(0x404040, 2);
  scene.add(ambientLight);

  // Spaceship Interior
  const spaceshipGroup = new THREE.Group();

  // Main Corridor
  const mainCorridorGeometry = new THREE.BoxGeometry(50, 10, 10);
  const mainCorridorMaterial = new THREE.MeshStandardMaterial({
    color: 0x222222,
    metalness: 0.7,
    roughness: 0.4,
    normalMap: generateNormalMap(),
  });
  const mainCorridor = new THREE.Mesh(mainCorridorGeometry, mainCorridorMaterial);
  mainCorridor.position.set(0, 5, 0);
  mainCorridor.receiveShadow = true;
  spaceshipGroup.add(mainCorridor);

  // Rooms
  const roomGeometry = new THREE.BoxGeometry(10, 10, 10);
  const roomMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    metalness: 0.7,
    roughness: 0.4,
    normalMap: generateNormalMap(),
  });

  const room1 = new THREE.Mesh(roomGeometry, roomMaterial);
  room1.position.set(-30, 5, 0);
  spaceshipGroup.add(room1);

  const room2 = new THREE.Mesh(roomGeometry, roomMaterial);
  room2.position.set(30, 5, 0);
  spaceshipGroup.add(room2);

  // Procedural Cracked Texture
  const crackedTexture = generateCrackedTexture();
  const detailedWallMaterial = new THREE.MeshStandardMaterial({
    map: crackedTexture,
    metalness: 0.6,
    roughness: 0.9,
    normalMap: generateNormalMap(),
  });

  const detailedWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), detailedWallMaterial);
  detailedWall.position.set(0, 5, -24.5);
  spaceshipGroup.add(detailedWall);

  // Procedural Rust Texture
  const rustTexture = generateRustTexture();
  const rustMaterial = new THREE.MeshStandardMaterial({
    map: rustTexture,
    metalness: 0.8,
    roughness: 0.7,
    normalMap: generateNormalMap(),
  });

  const rustedPart = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), rustMaterial);
  rustedPart.position.set(0, 2.5, -15);
  spaceshipGroup.add(rustedPart);

  // Cracked Glass
  const glassGeometry = new THREE.PlaneGeometry(10, 10);
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.1,
    transmission: 0.9,
    transparent: true,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    normalMap: generateNormalMap(),
  });
  const crackedGlass = new THREE.Mesh(glassGeometry, glassMaterial);
  crackedGlass.position.set(0, 5, -10);
  crackedGlass.rotation.y = Math.PI / 4;
  spaceshipGroup.add(crackedGlass);

  // Exploded Parts
  const explodeGeometry = new THREE.SphereGeometry(0.5, 32, 32);
  const explodeMaterial = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    emissive: 0x550000,
    metalness: 0.7,
    roughness: 0.2,
    normalMap: generateNormalMap(),
  });
  for (let i = 0; i < 5; i++) {
    const explodedPart = new THREE.Mesh(explodeGeometry, explodeMaterial);
    explodedPart.position.set(Math.random() * 40 - 20, Math.random() * 5, Math.random() * 40 - 20);
    spaceshipGroup.add(explodedPart);
  }

  scene.add(spaceshipGroup);

  window.addEventListener('resize', onWindowResize);

  spaceship = spaceshipGroup;
}

function generateCrackedTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');

  context.fillStyle = '#555555';
  context.fillRect(0, 0, size, size);

  context.strokeStyle = '#ffffff';
  context.lineWidth = 2;
  for (let i = 0; i < 100; i++) {
    context.beginPath();
    context.moveTo(Math.random() * size, Math.random() * size);
    context.lineTo(Math.random() * size, Math.random() * size);
    context.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

function generateRustTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');

  context.fillStyle = '#7f7f7f';
  context.fillRect(0, 0, size, size);

  context.fillStyle = '#ff4500';
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = Math.random() * 30 + 10;
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

function generateNormalMap() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');

  // Generate normal map pattern
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const value = Math.random() * 255;
      context.fillStyle = `rgb(${value}, ${value}, ${value})`;
      context.fillRect(i, j, 1, 1);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

export { spaceship };

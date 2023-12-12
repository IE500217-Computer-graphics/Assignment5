import "./style.css";
import * as dat from "dat.gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Water } from "three/examples/jsm/objects/Water.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

//Debug
const gui = new dat.GUI();

//Scene & renderer
const scene = new THREE.Scene();
//scene.background = new THREE.Color(0x87ceeb);
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const skyboxLoader = new THREE.CubeTextureLoader();
const skybox = skyboxLoader.load([
  "public/skybox/right.bmp",
  "public/skybox/left.bmp",
  "public/skybox/top.bmp",
  "public/skybox/bottom.bmp",
  "public/skybox/front.bmp",
  "public/skybox/back.bmp",
]);
scene.background = skybox;

const gltfLoader = new GLTFLoader();

// Load the GLTF file
let boat;

gltfLoader.load(
  "public/wooden_boat-gltf/scene.gltf",
  function (gltf) {
    // Removed the arrow function syntax here
    scene.add(gltf.scene);
    gltf.scene.scale.set(0.04, 0.04, 0.04); //Scale down boat
    gltf.scene.position.set(22, 0, -30);
    boat = gltf.scene;
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.log("An error happened: " + error);
  }
);

//Ambient sound
const listener = new THREE.AudioListener();
camera.add(listener);
const sound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();
audioLoader.load("sound/ambient.mp3", (buffer) => {
  sound.setBuffer(buffer);
  sound.setVolume(0);
  sound.play();
});

const soundSettings = {
  volume: 0,
};

const soundFolder = gui.addFolder("Sound");
soundFolder
  .add(soundSettings, "volume", 0, 1)
  .name("Volume")
  .onChange((value) => {
    sound.setVolume(value);
  });

//Objects
const BoxGeometry = new THREE.BoxGeometry(100, 5, 100, 32, 32, 32);
const houseGeometry = new THREE.BoxGeometry(3, 10, 3);
const roofGeometry = new THREE.ConeGeometry(3, 5, 4);
const roadGeometry = new THREE.PlaneGeometry(4, 100); //OK
const roadGeometry2 = new THREE.PlaneGeometry(4, 42);
const roadGeometry3 = new THREE.PlaneGeometry(4, 0);
const waterGeometry = new THREE.BoxGeometry(30, 45, 5);

//Materials
const textureLoader = new THREE.TextureLoader();
const grassTexture = textureLoader.load("public/grass_texture.jpg");
const grassMaterial = new THREE.MeshStandardMaterial({
  map: grassTexture,
});
const houseMaterial = new THREE.MeshStandardMaterial({
  color: "grey",
});
const roofMaterial = new THREE.MeshStandardMaterial({
  color: "grey",
});

const roadMaterial = new THREE.MeshStandardMaterial({
  color: "darkgrey",
});

//Mesh
const box = new THREE.Mesh(BoxGeometry, grassMaterial);
box.position.set(0, -2.6, 0);
box.receiveShadow = true;
scene.add(box);

const house = new THREE.Mesh(houseGeometry, houseMaterial);
house.castShadow = true;
house.receiveShadow = true;
house.position.set(-20, 4, -18);
scene.add(house);

const roof = new THREE.Mesh(roofGeometry, roofMaterial);
roof.position.set(-20, 11, -18);
roof.rotation.y = 45 * (Math.PI / 180);
scene.add(roof);

const road = new THREE.Mesh(roadGeometry, roadMaterial);
road.rotation.x = -Math.PI / 2; // Rotate to lay flat
road.position.set(-10, 0.1, 0);
scene.add(road);

const road2 = new THREE.Mesh(roadGeometry, roadMaterial);
road2.rotation.x = -Math.PI / 2; // Rotate to lay flat
road2.rotation.z = Math.PI / 2;
road2.position.set(0, 0.1, 10);
scene.add(road2);

const road3 = new THREE.Mesh(roadGeometry2, roadMaterial);
road3.rotation.x = -Math.PI / 2; // Rotate to lay flat
road3.rotation.z = Math.PI / 2;
road3.position.set(-29, 0.1, -7);
scene.add(road3);

const road4 = new THREE.Mesh(roadGeometry3, roadMaterial);
road4.rotation.x = -Math.PI / 2; // Rotate to lay flat
road4.position.set(10, 0.1, -7);
scene.add(road4);

const water = new Water(waterGeometry, {
  textureWidth: 1024,
  textureHeight: 1024,
  waterNormals: new THREE.TextureLoader().load(
    "public/water-normal.jpg",
    function (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    }
  ),
  alpha: 1.0,
  sunDirection: new THREE.Vector3(),
  sunColor: 0xffffff,
  waterColor: 0x00008b,
  distortionScale: 3.7,
  fog: scene.fog !== undefined,
});

water.position.set(30, -2.5, -20);
water.rotation.x = -Math.PI / 2;
scene.add(water);

// Lighting
const lightningFolder = gui.addFolder("Lighting");
const pointLightFolder = lightningFolder.addFolder("Pointlight");
const ambientLightFolder = lightningFolder.addFolder("Ambientlight");

const pointLight = new THREE.PointLight(0xffffff, 2);
pointLight.castShadow = true;
pointLight.position.x = -7.6;
pointLight.position.y = 28;
pointLight.position.z = 6;
pointLight.intensity = 0;
scene.add(pointLight);

pointLightFolder.add(pointLight.position, "x");
pointLightFolder.add(pointLight.position, "y");
pointLightFolder.add(pointLight.position, "z");
pointLightFolder.add(pointLight, "intensity", 0, 100);

const ambientLight = new THREE.AmbientLight(0xffffff, 0);
scene.add(ambientLight);
ambientLightFolder.add(ambientLight, "intensity", 0, 5);

//Camera position
camera.position.z = 20;
camera.position.y = 15;
camera.position.x = 1;

//Fog
const fogSettings = {
  enableFog: false,
  fogNear: 1,
  fogFar: 100,
};

function updateFog() {
  if (fogSettings.enableFog) {
    scene.fog = new THREE.Fog(
      0x87ceeb,
      fogSettings.fogNear,
      fogSettings.fogFar
    ); //Linear fog
  } else {
    scene.fog = null;
  }
}

const fogFolder = gui.addFolder("Fog");
fogFolder.add(fogSettings, "enableFog").name("Enable Fog").onChange(updateFog);
fogFolder
  .add(fogSettings, "fogNear", 1, 50)
  .name("Fog Near")
  .onChange(updateFog);
fogFolder
  .add(fogSettings, "fogFar", 50, 200)
  .name("Fog Far")
  .onChange(updateFog);
updateFog();

//Rain
const raindropCount = 200000;
const rainGeometry = new THREE.BufferGeometry();
const raindropPositions = new Float32Array(raindropCount * 3); // x, y, z for each raindrop

const rainSettings = {
  enableRain: false,
};

function updateRainVisibility() {
  rain.visible = rainSettings.enableRain;
}

for (let i = 0; i < raindropCount; i++) {
  raindropPositions[i * 3 + 0] = Math.random() * 400 - 200; // x
  raindropPositions[i * 3 + 1] = Math.random() * 500 - 250; // y
  raindropPositions[i * 3 + 2] = Math.random() * 400 - 200; // z
}

rainGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(raindropPositions, 3)
);

const rainMaterial = new THREE.PointsMaterial({
  color: 0xaaaaaa,
  size: 0.1,
  transparent: true,
});

const rain = new THREE.Points(rainGeometry, rainMaterial);
const rainFolder = gui.addFolder("Rain");
rainFolder
  .add(rainSettings, "enableRain")
  .name("Enable Rain")
  .onChange(updateRainVisibility);
scene.add(rain);
updateRainVisibility();

//Sun
const sunLight = new THREE.PointLight(0xffffff, 1000);
sunLight.position.set(22, 62, 16);
sunLight.castShadow = true;
scene.add(sunLight);

const sunGeometry = new THREE.SphereGeometry(10, 64, 64);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
sunMesh.position.copy(sunLight.position);
scene.add(sunMesh);

const sunSettings = {
  sunIntensity: 1500,
  sunPositionX: 22,
  sunPositionY: 62,
  sunPositionZ: 16,
};

const sunFolder = lightningFolder.addFolder("Sun");
sunFolder
  .add(sunSettings, "sunIntensity", 0, 5000)
  .name("Intensity")
  .onChange((value) => {
    sunLight.intensity = value;
  });
sunFolder
  .add(sunSettings, "sunPositionX", -100, 100)
  .name("Position X")
  .onChange((value) => {
    sunLight.position.x = value;
    sunMesh.position.x = value; // Update sphere position
  });
sunFolder
  .add(sunSettings, "sunPositionY", -100, 100)
  .name("Position Y")
  .onChange((value) => {
    sunLight.position.y = value;
    sunMesh.position.y = value; // Update sphere position
  });
sunFolder
  .add(sunSettings, "sunPositionZ", -100, 100)
  .name("Position Z")
  .onChange((value) => {
    sunLight.position.z = value;
    sunMesh.position.z = value; // Update sphere position
  });

//Orbitcontrols
const controls = new OrbitControls(camera, renderer.domElement);

//Animate boat
const points = [
  new THREE.Vector3(20, 0, -15),
  new THREE.Vector3(25, 0, -7),
  new THREE.Vector3(38, 0, -7),
  new THREE.Vector3(38, 0, -30),
  new THREE.Vector3(22, 0, -30),
];

let currentPointIndex = 0;
let lerpFactor = 0.01; // Adjust this for speed
const threshold = 0.1;

function animateBoat() {
  if (boat.position.distanceTo(points[currentPointIndex]) < threshold) {
    currentPointIndex = (currentPointIndex + 1) % points.length;
  }

  // Calculate the direction vector
  let direction = points[currentPointIndex]
    .clone()
    .sub(boat.position)
    .normalize();

  // Update boat position
  boat.position.lerp(points[currentPointIndex], lerpFactor);

  // Update boat rotation
  updateBoatRotation(direction);
}

function updateBoatRotation(direction) {
  // Create a new target position for the boat to look at
  let targetPosition = boat.position.clone().add(direction);
  boat.lookAt(targetPosition);
}

function animate() {
  requestAnimationFrame(animate);
  animateBoat();

  water.material.uniforms["time"].value += 1.0 / 500.0;

  // Make the raindrops fall
  let positions = rain.geometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    positions[i + 1] -= 1; // Move each raindrop down on the y-axis

    if (positions[i + 1] < -200) {
      // Reset the raindrop's position when it goes off screen
      positions[i + 1] = 200;
    }
  }
  rain.geometry.attributes.position.needsUpdate = true; // Required for updating the geometry
  renderer.render(scene, camera);
}

animate();

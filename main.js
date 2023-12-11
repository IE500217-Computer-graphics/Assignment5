import "./style.css";
import * as dat from "dat.gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { textureLoad } from "three/nodes";

//Debug
const gui = new dat.GUI();

//Scene & renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
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

// Ambient sound
const listener = new THREE.AudioListener();
camera.add(listener);
const sound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();
audioLoader.load("sound/ambient.mp3", (buffer) => {
  sound.setBuffer(buffer);
  sound.setVolume(0);
  sound.play();
});

const soundParams = {
  volume: 0,
};

const soundFolder = gui.addFolder("Sound");
soundFolder
  .add(soundParams, "volume", 0, 1)
  .name("Volume")
  .onChange((value) => {
    sound.setVolume(value);
  });

//Objects
const planeGeometry = new THREE.PlaneGeometry(50, 50);
const houseGeometry = new THREE.BoxGeometry(3, 10, 3);
const roofGeometry = new THREE.ConeGeometry(3, 6, 4);

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

//Mesh
const plane = new THREE.Mesh(planeGeometry, grassMaterial);
scene.add(plane);
plane.receiveShadow = true;
plane.rotation.x = -1.6;

const house = new THREE.Mesh(houseGeometry, houseMaterial);
house.castShadow = true;
house.receiveShadow = true;
house.position.x = 10;
house.position.y = 4;
house.position.z = -10;
scene.add(house);

const roof = new THREE.Mesh(roofGeometry, roofMaterial);
roof.position.x = 10;
roof.position.y = 12;
roof.position.z = -10;
roof.rotation.y = 45 * (Math.PI / 180);
scene.add(roof);

// Lighting
const lightningFolder = gui.addFolder("Lighting");
const pointLightFolder = lightningFolder.addFolder("Pointlight");
const ambientLightFolder = lightningFolder.addFolder("Ambientlight");

const pointLight = new THREE.PointLight(0xffffff, 2);
pointLight.castShadow = true;
pointLight.position.x = -7.6;
pointLight.position.y = 28;
pointLight.position.z = 6;
pointLight.intensity = 72;
scene.add(pointLight);

pointLightFolder.add(pointLight.position, "x");
pointLightFolder.add(pointLight.position, "y");
pointLightFolder.add(pointLight.position, "z");
pointLightFolder.add(pointLight, "intensity", 0, 100);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
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
sunLight.position.set(22, 35, 16);
sunLight.castShadow = true;
scene.add(sunLight);

const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
sunMesh.position.copy(sunLight.position);
scene.add(sunMesh);

const sunSettings = {
  sunIntensity: 1000,
  sunPositionX: 22,
  sunPositionY: 35,
  sunPositionZ: 16,
};

const sunFolder = lightningFolder.addFolder("Sun");
sunFolder
  .add(sunSettings, "sunIntensity", 0, 2000)
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

function animate() {
  requestAnimationFrame(animate);

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

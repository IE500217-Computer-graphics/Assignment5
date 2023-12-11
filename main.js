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
plane.rotation.x = -1.6;

const house = new THREE.Mesh(houseGeometry, houseMaterial);
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
pointLight.position.x = 0.7;
pointLight.position.y = 2.8;
pointLight.position.z = 0;
pointLight.intensity = 10;
scene.add(pointLight);

pointLightFolder.add(pointLight.position, "x");
pointLightFolder.add(pointLight.position, "y");
pointLightFolder.add(pointLight.position, "z");
pointLightFolder.add(pointLight, "intensity", 0, 50);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
ambientLightFolder.add(ambientLight, "intensity", 0, 5);

//Camera position
camera.position.z = 20;
camera.position.y = 15;
camera.position.x = 1;

//Orbitcontrols
const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

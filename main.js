import "./style.css";
import * as dat from "dat.gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Water } from "three/examples/jsm/objects/Water.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';



//Controller
const gui = new dat.GUI();
let isThirdPerson = true;

//Scene & renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  80,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Enable shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//Create skybox background
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

//Create GLTFLoader for gltf. file 3D object importing
const gltfLoader = new GLTFLoader();

//Boat
let boat;
gltfLoader.load(
  "public/wooden_boat-gltf/scene.gltf",
  function (gltf) {
    scene.add(gltf.scene);
    gltf.scene.scale.set(0.04, 0.04, 0.04); //Scale down boat
    gltf.scene.position.set(22, 0, -30);
    boat = gltf.scene;

    // Apply shadows, traverse through 3D object
    boat.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.log("An error happened: " + error);
  }
);

//Skyscrapers
let skyscraperModel1;
gltfLoader.load(
  "public/skyscrapers/skyscraper_2/scene.gltf",
  function (gltf) {
    skyscraperModel1 = gltf.scene;
    addSkyscraper(2, 8, 127, 0.5, skyscraperModel1);
    addSkyscraper(55, 8, 127, 0.5, skyscraperModel1);
    addSkyscraper(2, 8, 145, 0.5, skyscraperModel1);
    // addSkyscraper(0, 0, 10,1,skyscraperModel1);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.log("An error happened: " + error);
  }
);

let skyscraperModel2;
gltfLoader.load(
  "public/skyscrapers/skyscraper_3/scene.gltf",
  function (gltf) {
    skyscraperModel2 = gltf.scene;
    addSkyscraper(0, 0, 20, 0.1, skyscraperModel2);
    addSkyscraper(0, 0, 40, 0.1, skyscraperModel2);
    addSkyscraper(21, 0, 40, 0.1, skyscraperModel2);
    addSkyscraper(41, 0, 40, 0.1, skyscraperModel2);
    addSkyscraper(-23, 0, 1, 0.1, skyscraperModel2);
    addSkyscraper(-43, 0, 1, 0.1, skyscraperModel2);
    // addSkyscraper(0, 0, 10,1,skyscraperModel2);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.log("An error happened: " + error);
  }
);

function addSkyscraper(x, y, z, scale, model) {
  let skyscraper = model.clone();
  skyscraper.scale.set(1 * scale, 1 * scale, 1 * scale);
  skyscraper.position.set(x, y, z);

  // Apply shadows, traverse through 3D object
  skyscraper.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.add(skyscraper);
}

//Trees
let treeModel;
gltfLoader.load(
  "public/pine_tree/scene.gltf",
  function (gltf) {
    treeModel = gltf.scene;
    addTree(-4, 0, -28);
    addTree(-2, 0, -15);
    addTree(2, 0, 5);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.log("An error happened: " + error);
  }
);

function addTree(x, y, z) {
  let tree = treeModel.clone();
  tree.scale.set(4, 4, 4);
  tree.position.set(x, y, z);

  // Apply shadows, traverse through 3D object
  tree.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.add(tree);
}

//Bushes
let bushModel;
gltfLoader.load(
  "public/tall_bush/scene.gltf",
  function (gltf) {
    bushModel = gltf.scene;
    addBush(-2, 0, -35);
    addBush(4, 0, -20);
    addBush(-3, 0, -5);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.log("An error happened: " + error);
  }
);

function addBush(x, y, z) {
  let bush = bushModel.clone();
  bush.scale.set(0.3, 0.3, 0.3);
  bush.position.set(x, y, z);

  // Apply shadows, traverse through 3D object
  bush.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.add(bush);
}

//Bridge
let bridgeModel;
gltfLoader.load(
  "public/garden_bridge/scene.gltf",
  function (gltf) {
    bridgeModel = gltf.scene;
    addBridge(30, 7, -30);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.log("An error happened: " + error);
  }
);

function addBridge(x, y, z) {
  let bridge = bridgeModel.clone();
  bridge.scale.set(0.033, 0.03, 0.01);
  bridge.position.set(x, y, z);

  // Apply shadows, traverse through 3D object
  bridge.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.add(bridge);
}

//PlayGround
let playgroundModel;
gltfLoader.load(
  "public/playground/scene.gltf",
  function (gltf) {
    playgroundModel = gltf.scene;
    addPlayground(-30, 0, -35);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.log("An error happened: " + error);
  }
);

function addPlayground(x, y, z) {
  let playground = playgroundModel.clone();
  playground.scale.set(0.8, 0.5, 0.8);
  playground.position.set(x, y, z);

  // Apply shadows, traverse through 3D object
  playground.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.add(playground);
};

//Flowers
let grassModel;
gltfLoader.load(
  "public/grass_patch/scene.gltf",
  function (gltf) {
    grassModel = gltf.scene;
    addGrass(-3, 0, -23);
    addGrass(6, 0, -10);
    addGrass(8, 0, 5);
    addGrass(7, 0, -35);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.log("An error happened: " + error);
  }
);

function addGrass(x, y, z) {
  let grass = grassModel.clone();
  grass.scale.set(0.5, 0.5, 0.5);
  grass.position.set(x, y, z);

  // Apply shadows, traverse through 3D object
  grass.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.add(grass);
}

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

//Geometry
const BoxGeometry = new THREE.BoxGeometry(100, 5, 100, 32, 32, 32);
const houseGeometry = new THREE.BoxGeometry(6, 40, 6);
const roofGeometry = new THREE.ConeGeometry(4.3, 27, 4);
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
house.position.set(-20, 19.5, -18);
scene.add(house);

const roof = new THREE.Mesh(roofGeometry, roofMaterial);
roof.position.set(-20, 53, -18);
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

//Water
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
water.receiveShadow = true;
scene.add(water);

// Lighting
const lightningFolder = gui.addFolder("Lighting");
const pointLightFolder = lightningFolder.addFolder("Pointlight");
const ambientLightFolder = lightningFolder.addFolder("Ambientlight");

const pointLight = new THREE.PointLight(0xffffff, 2);
pointLight.castShadow = true;
pointLight.position.set(-7, 6, 28, 6);
pointLight.intensity = 0;
scene.add(pointLight);

pointLightFolder.add(pointLight.position, "x");
pointLightFolder.add(pointLight.position, "y");
pointLightFolder.add(pointLight.position, "z");
pointLightFolder.add(pointLight, "intensity", 0, 100);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
ambientLightFolder.add(ambientLight, "intensity", 0, 5);

//Camera position
camera.position.set(1, 73, 92);
const cameraFolder = gui.addFolder("Camera");
cameraFolder.add(camera.position, "x").name("X Position");
cameraFolder.add(camera.position, "y").name("Y Position");
cameraFolder.add(camera.position, "z").name("Z Position");

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

//Sun & pointlight
const sunLight = new THREE.PointLight(0xffffff, 2500);
sunLight.position.set(22, 150, 16);
sunLight.castShadow = true;
scene.add(sunLight);

const sunGeometry = new THREE.SphereGeometry(20, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
sunMesh.position.copy(sunLight.position);
scene.add(sunMesh);

const radius = 50;
const sunSpeed = 0.05;

function setSunOrbitRadius(newRadius) {
  radius = newRadius;
}

const sunSettings = {
  sunIntensity: 2500,
  sunPositionX: 22,
  sunPositionY: 150,
  sunPositionZ: 16,
};

const sunFolder = lightningFolder.addFolder("Sun");
sunFolder
  .add(sunSettings, "sunIntensity", 0, 10000)
  .name("Intensity")
  .onChange((value) => {
    sunLight.intensity = value;
  });
sunFolder
  .add(sunSettings, "sunPositionX")
  .name("Position X")
  .onChange((value) => {
    sunLight.position.x = value;
    sunMesh.position.x = value; // Update sphere position
  });
sunFolder
  .add(sunSettings, "sunPositionY")
  .name("Position Y")
  .onChange((value) => {
    sunLight.position.y = value;
    sunMesh.position.y = value; // Update sphere position
  });
sunFolder
  .add(sunSettings, "sunPositionZ")
  .name("Position Z")
  .onChange((value) => {
    sunLight.position.z = value;
    sunMesh.position.z = value; // Update sphere position
  });

//Orbitcontrols
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.maxDistance = 200;
controls.minDistance = 10;
controls.update();

//Animate boat
const spline = new THREE.CatmullRomCurve3([
  new THREE.Vector3(22, 0, -30),
  new THREE.Vector3(20, 0, -15),
  new THREE.Vector3(25, 0, -7),
  new THREE.Vector3(38, 0, -7),
  new THREE.Vector3(38, 0, -30),
  new THREE.Vector3(22, 0, -30),
]);

let t = 0;
const speed = 0.0002;

function animateBoat() {
  // Update t
  t = (t + speed) % 1;

  // Get the position on the spline
  let pos = spline.getPoint(t);

  // Update boat position
  boat.position.set(pos.x, pos.y, pos.z);

  // Calculate direction and update rotation
  let direction = spline.getTangent(t).normalize();
  updateBoatRotation(direction);
}

function updateBoatRotation(direction) {
  // Create a new target position for the boat to look at
  let targetPosition = boat.position.clone().add(direction);
  boat.lookAt(targetPosition);
}

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let playerOnGround = true;
let verticalVelocity = 0;
const gravity = -9.8; // Gravity could be adjusted
const jumpHeight = 6;
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

document.addEventListener('keydown', (event) => {
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
    // case "KeyQ":
    //   moveUp = true;
    //   break;
    // case "KeyE":
    //   moveDown = true;
    //   break;
    case 'Space':
      if (playerOnGround) {
        verticalVelocity = jumpHeight;
        playerOnGround = false;
      }
      break;

  }
});

document.addEventListener('keyup', (event) => {
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
    case "KeyQ":
      moveUp = false;
      break;
    case "KeyE":
      moveDown = false;
      break;
  }
});



const viewSettings = {
  toggle: false
};

const firstPerson = gui.addFolder("View Mode");
firstPerson
  .add(viewSettings, 'toggle')
  .name("1st person view")
  .onChange(toggleView);
    
const controls2 = new PointerLockControls(camera, document.body);
    
function toggleView() {
  if (isThirdPerson) {
    camera.position.set(0,2,0);
    controls.enabled = false; // Disable orbit controls
    controls2.lock(); // Lock PointerLockControls for first-person view
    console.log("Switched to First Person View");
  } else {
    controls2.unlock(); // Unlock PointerLockControls to switch back to orbit controls
    controls.enabled = true; // Enable orbit controls for third-person view
    console.log("Switched to Third Person View");
  }
  isThirdPerson = !isThirdPerson;
}

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  animateBoat();
  const delta = clock.getDelta();

  if (isThirdPerson) {
    controls.update();
  } else {
    if (controls2.isLocked === true) {
      if (!playerOnGround) {
        verticalVelocity += gravity * delta;
      }

      camera.position.y += verticalVelocity * delta;

      velocity.x -= velocity.x * 5.0 * delta;
      velocity.z -= velocity.z * 5.0 * delta;
      direction.z = Number(moveForward) - Number(moveBackward);
      direction.x = Number(moveRight) - Number(moveLeft);
      direction.normalize(); 

      if (moveForward || moveBackward) velocity.z -= direction.z * 50.0 * delta;
      if (moveLeft || moveRight) velocity.x -= direction.x * 50.0 * delta;
      
      if (camera.position.y <= 2) {
        verticalVelocity = 0;
        camera.position.y = 2;
        playerOnGround = true;
      }
    

      controls2.moveRight(-velocity.x * delta); 
      controls2.moveForward(-velocity.z * delta);
    }
  }

  let time = Date.now() * 0.001; // Current time in seconds
  sunMesh.position.x = Math.cos(time * sunSpeed) * radius;
  sunMesh.position.z = Math.sin(time * sunSpeed) * radius;
  sunLight.position.copy(sunMesh.position);

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
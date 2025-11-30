
// RELANCER VITE après importation des librairies

import "./style.scss"; // utilisation de Vite , pas importer css dans html

import { Howl } from "howler"; // Librairie Musique


import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js"; // charger rapidement les  fichiers 3D 


/*== Son ==n
const music_background = new Howl({
  src: ["/assets/music_death_note.ogg"],
  loop: true,
  volume: 1,
*/ 

  

// === Scene ===
const scene = new THREE.Scene();

// === Camera ===
const camera = new THREE.PerspectiveCamera(
  10,
  window.innerWidth / window.innerHeight,
  0.1,
  200
);

// === Renderer ===
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);


// === Controls autour du 3D GBL ===
const controls = new OrbitControls(camera, renderer.domElement);

//ergonomie utilisateur (souris)
controls.enableDamping = true;
controls.dampingFactor = 0.05;

//zoom souris
controls.minDistance = 2;   // zoom très proche
controls.maxDistance = 8;  // zoom raisonnable

controls.minDistance = 5;
controls.maxDistance = 45;

controls.minPolarAngle = 0;  
controls.maxPolarAngle = Math.PI /2;  

controls.minAzimuthAngle = 0 /2;  
controls.maxAzimuthAngle = Math.PI /2 ;   

controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.update();


// Camera positions ( que Ordi )
camera.position.set(15, 15, 15);
controls.target.set(0, 2, 0);



window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update Camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});


// === LIGHTS ===
scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.2));

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(10, 10, 10);
dirLight.castShadow = true;
scene.add(dirLight);


// --- Dégradé de lumière (fond ambiance)
scene.background = new THREE.Color("#f8c9a5"); // orange pastel lumineux

// --- Sol (plane)
 function createRadialGradientTexture() {
  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");

  const gradient = ctx.createRadialGradient(
    size / 2, size / 2, 10,      
    size / 2, size / 2, size / 2 
  );

  gradient.addColorStop(0, "#000000");    
  gradient.addColorStop(1, "#f2a97c");    

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  return texture;
}

    window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});


 
// === LOADER  ===
const loaderBar = document.getElementById("loader-bar");
const loaderPercent = document.getElementById("loader-percent");
const loaderWrapper = document.getElementById("loader-wrapper");

let trueProgress = 0;
let fakeProgress = 0;
let downloadDone = false;

function updateRealProgress(progress) {
  trueProgress = (progress.loaded / progress.total) * 100;
}

function animateFakeProgress() {
  if (!downloadDone) {
    fakeProgress += (trueProgress - fakeProgress) * 0.05;
  } else {
    fakeProgress += (100 - fakeProgress) * 0.02;
  }

  loaderBar.style.width = fakeProgress + "%";
  loaderPercent.textContent = fakeProgress.toFixed(0) + "%";

  if (downloadDone && fakeProgress > 99.5) {
    loaderWrapper.style.opacity = "0";
    setTimeout(() => (loaderWrapper.style.display = "none"), 600);
  } else {
    requestAnimationFrame(animateFakeProgress);
  }
}
animateFakeProgress();

// === DRACO LOADER ===
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/"); // fichier draco recuperer dans public

// === GLTF LOADER AVEC DRACO ===
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

// === CHARGEMENT RAPIDE DE TON MODELE DRACO ===
gltfLoader.load("./assets/3Dportofolio3.glb",  
  (gltf) => {

    //je supprime la camera de mon fichier blender 
    const gltfCamera = gltf.cameras?.[0];
    if (gltfCamera) {
      console.log("Camera Blender détectée → ignorée");
    }
    scene.add(gltf.scene);
    downloadDone = true;
  },
  (progress) => {
    if (progress.total > 0) updateRealProgress(progress);
  },
  (error) => console.error("Erreur DRACO:", error)
);


// === Animation loop ===
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);

}
animate();


// === Resize ===
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

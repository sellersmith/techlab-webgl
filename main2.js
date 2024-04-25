import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

import modelURL from "/tshirt.glb?url";
const canvas = document.getElementById("webgl");
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const cubes = []
const MAX_DISTANCE = 5
const DISTANCE_PER_FRAME = 0.03
let targetCube

!(async function main() {

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvas,
    width: canvas.width,
    height: canvas.height
  });


  const pmremGenerator = new THREE.PMREMGenerator(renderer);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  scene.environment = pmremGenerator.fromScene(new RoomEnvironment(renderer), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(40, canvas.width / canvas.height, 1, 100);
  // camera.position.set(9.5, 9.5, 30);
  // camera.rotation.set(0, 0, 0);
  camera.position.set(14.11487562807346,7.9637525642114575,19.313775687903878);
  camera.rotation.set(0.12046342877724084,0.27897121041436806,-0.03332068210059256)
  window.camera = camera

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(9.5, 9.5, 0.5);
  controls.update();
  controls.enablePan = true;
  controls.enableDamping = true;

  // const model = window.model = (await loadObject(modelURL)).scene;
  // model.position.set( 1, 1, 0 );`
  // model.scale.set( 0.01, 0.01, 0.01 );
  // scene.add(model)

  createCubes(scene)

  addEventListener('pointermove', e => {
    if (e.target.matches('canvas')) {
      pointer.x = (e.offsetX / canvas.width) * 2 - 1
      pointer.y = - (e.offsetY / canvas.height) * 2 + 1

      raycaster.setFromCamera(pointer, camera)
      const intersects = raycaster.intersectObjects(scene.children)
      targetCube = intersects[0]
    }
  })
  addEventListener('mouseout', e => {
    if (e.target.matches('canvas')) {
      targetCube = undefined
    }
  })

  requestAnimationFrame(function animate() {
    moveCubes()
    controls.update();
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
  });
})();

//
// Utilities functions
//
function moveCubes() {
  let needLower = true
  if (targetCube) {
    // targetCube.object.material.color.set(0xff0000);
    const { x: targetX, y: targetY } = targetCube.object.position
    for (let cube of cubes) {
      const { x, y } = cube.position
      const distanceX = (MAX_DISTANCE - Math.min(Math.abs(x - targetX), MAX_DISTANCE))
      const distanceY = (MAX_DISTANCE - Math.min(Math.abs(y - targetY), MAX_DISTANCE))

      const moveDistance = distanceX / 2
      if (distanceX > 0 && cube.position.z < moveDistance) {
        cube.position.z = Math.min(cube.position.z + DISTANCE_PER_FRAME, moveDistance)
      } else if (cube.position.z > 0) {
        cube.position.z = Math.max(cube.position.z - DISTANCE_PER_FRAME, 0)
      }
    }
  } else {
    for (let cube of cubes) {
      if (cube.position.z > 0) {
        cube.position.z = Math.max(cube.position.z - DISTANCE_PER_FRAME, 0)
      }
    }
  }
}
function createCubes(scene) {
  for (let x = 0; x < 20; x++) {
    for (let y = 0; y < 20; y++) {

      const R = hex(12 * x + 15)
      const G = '00'
      const B = hex(12 * y + 15)
      
      const geometry = new THREE.BoxGeometry(1, 1, 2);
      // const geometry = new THREE.SphereGeometry(0.8, 32, 16);
      const material = new THREE.MeshBasicMaterial({ color: `#${R + G + B}` });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.x = x
      cube.position.y = y
      cubes.push(cube)
      scene.add(cube);
    }
  }
}

function hex(num) {
  return Math.round(num).toString(16).padStart(2, '0').toUpperCase()
}

function loadObject(url) {
  return new Promise((resolve, reject) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/jsm/libs/draco/gltf/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    function progress(xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    }
    loader.load(url, resolve, progress, reject);
  });
}

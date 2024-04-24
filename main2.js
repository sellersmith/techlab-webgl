import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

import modelURL from "/tshirt.glb?url";
const canvas = document.getElementById("webgl");

!(async function main() {

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvas,
    width: canvas.width,
    height: canvas.height
  });


  const pmremGenerator = new THREE.PMREMGenerator( renderer );
  
  const scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xbfe3dd );
  scene.environment = pmremGenerator.fromScene( new RoomEnvironment( renderer ), 0.04 ).texture;

  const camera = new THREE.PerspectiveCamera( 40, canvas.width / canvas.height, 1, 100 );
  camera.position.set( 5, 2, 8 );

  const controls = new OrbitControls( camera, renderer.domElement );
  controls.target.set( 0, 0.5, 0 );
  controls.update();
  controls.enablePan = false;
  controls.enableDamping = true;

  const model = window.model = (await loadObject(modelURL)).scene;
  // model.position.set( 1, 1, 0 );
  // model.scale.set( 0.01, 0.01, 0.01 );

  scene.add(model)

  requestAnimationFrame(function animate() {
    controls.update();
    renderer.render( scene, camera );
    requestAnimationFrame(animate);
  });
})();

//
// Utilities functions
//
function loadObject(url) {
  return new Promise((resolve, reject) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/jsm/libs/draco/gltf/' );

    const loader = new GLTFLoader();
		loader.setDRACOLoader( dracoLoader );
    function progress(xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    } 
    loader.load(url, resolve, progress, reject);
  });
}

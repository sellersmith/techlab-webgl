import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import {
  CSS2DRenderer,
} from "three/addons/renderers/CSS2DRenderer.js";

import Model from "/tshirt.glb?url";
import TextureImage from "/checker.png";

let model, 
    canvas,
    canvasFront,
    canvasBack,
    camera, 
    renderer,
    scene,
    rotation = 0,
    dragging,
    lastX,
    inputs = {};

//
// Event Listeners
//

addEventListener("mousedown", (e) => {
  dragging = true;
  lastX = e.clientX;
});
addEventListener("mousemove", (e) => {
  if (dragging) {
    const deltaX = e.clientX - lastX;
    rotation -= deltaX / 100;
    lastX = e.clientX;
  }
});
addEventListener("mouseup", (e) => {
  dragging = false;
});

// addEventListener("resize", function onWindowResize() {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// });

addEventListener('change', e => {
  inputs[e.target.getAttribute('name')] = e.target.value
  clearCanvas(canvasFront, 1000, 1000)
  drawTextOnCanvas(canvasFront, inputs['front-top'], inputs['front-bottom'])
  drawTextOnCanvas(canvasBack, inputs['back-top'], inputs['back-bottom'])
  updateMaterial(canvas, model)
}, true)


//
// Main
//

!async function main() {
  //RENDERER
  const container = document.getElementById("canvasContainer");
  const threejsCanvas = document.getElementById("threejsCanvas");
  renderer = new THREE.WebGLRenderer({ antialias: true, canvas: threejsCanvas });
  renderer.setSize(container.clientWidth, container.clientHeight);

  // INIT SCENE
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa8def0);

  // CAMERA
  camera = (window.camera = new THREE.PerspectiveCamera(
    15,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  ));
  camera.aspect = 500 / 500;
  camera.position.set(0, 0, 1);

  //Light
  const {aLight, dLight} = createLights()
  scene.add(aLight)
  scene.add(dLight)


  // Load glb model
  const group = await loadObject(Model)
  model = group.children[0];
      
  canvas = createCanvas(1024, 1024)
  canvasFront = createCanvas(1000, 1000)
  canvasBack = createCanvas(1000, 1000)

  canvasFront.style.background = 'red'
  canvasBack.style.background = 'green'

  // const img = new Image();
  // const ctx = canvas.getContext("2d");
  // img.src = TextureImage;

  
  // img.onload = () => {
  //   ctx.drawImage(img, 0, 0);
  //   updateMaterial(canvas, model)
  // };

  window.model = model

  scene.add(group);
  renderer.render(scene, camera);

  requestAnimationFrame(function animate() {
    model.rotation.set(model.rotation.x, 0, rotation);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  })
  drawOnMainCanvas()
  updateMaterial(canvas, model)
}()



// Utilities functions

function clearCanvas(canvas, w, h) {
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, w, h)
}

function drawTextOnCanvas(canvas, text1, text2) {
  const ctx = canvas.getContext('2d')
  ctx.font = "bold 100px Arial";
  ctx.textAlign = 'center'
  ctx.fillText(text1 || '', canvas.width / 2, 200);
  ctx.fillText(text2 || '', canvas.width / 2, 800);
  drawOnMainCanvas()
}

function drawOnMainCanvas() {
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, 1024, 1024)
  ctx.rect(0, 0, 1024, 1024);
  ctx.fillStyle = inputs['color'] || 'white';
  ctx.fill();

  ctx.drawImage(canvasFront, 704, 256, 256, 256)
  ctx.drawImage(canvasBack, 320, 256, 256, 256)

}

function loadObject(url) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(url, (gltf) => {
        resolve(gltf.scene)
      },
      (xhr) => { console.log((xhr.loaded / xhr.total) * 100 + "% loaded"); },
      (e) => reject(e)
    )
  })
}

function createCanvas(width, height) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  document.body.appendChild(canvas)
  return canvas
}

function updateMaterial(canvas, model) {
  const texture = new THREE.Texture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.x = -1
  texture.repeat.y = -1
  texture.needsUpdate = true;
  const material = new THREE.MeshPhongMaterial({map: texture});
  model.material = material;
}

function createLights() {
  // LIGHTS
  const dLight = new THREE.DirectionalLight("white", 0.8);
  dLight.position.x = 20;
  dLight.position.y = 30;
  dLight.castShadow = true;
  dLight.shadow.mapSize.width = 4096;
  dLight.shadow.mapSize.height = 4096;
  const d = 35;
  dLight.shadow.camera.left = -d;
  dLight.shadow.camera.right = d;
  dLight.shadow.camera.top = d;
  dLight.shadow.camera.bottom = -d;

  const aLight = new THREE.AmbientLight("white", 0.5);

   return {
    dLight,
    aLight
   }
}

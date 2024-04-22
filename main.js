import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";

import Model from "/tshirt.glb?url";
import Texture from "/donut-base2.png";

let model;
let rotation = 0;
let dragging;
let lastX;

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

const clock = new THREE.Clock();
async function main() {
  //RENDERER
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // INIT SCENE
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa8def0);

  // CAMERA
  const camera = (window.camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  ));
  camera.position.set(0, 0, 0.4);

  //ORBIT_CONTROL
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.update();
  controls.addEventListener("change", () => {
    renderer.render(scene, camera);
  });
  window.controls = controls;

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
  scene.add(dLight);

  const aLight = new THREE.AmbientLight("white", 0.5);
  scene.add(aLight);

  // 2D text
  const labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.domElement.style.position = "absolute";
  labelRenderer.domElement.style.top = "0px";
  document.body.appendChild(labelRenderer.domElement);

  // Load glb model
  const loader = new GLTFLoader();
  loader.load(
    // resource URL
    Model,
    (gltf) => {
      const group = gltf.scene;
      window.group = group;
      model = group.children[0];
      const texture = new THREE.TextureLoader().load(Texture);

      model.material.map = texture;
      model.material.needsUpdate = true;

      model.layers.enableAll();

      const modelDiv = document.createElement("div");
      modelDiv.className = "label";
      modelDiv.textContent = "Page Fly";
      modelDiv.style.backgroundColor = "transparent";

      const modelLabel = new CSS2DObject(modelDiv);
      modelLabel.position.set(0, 0.2, 0);
      modelLabel.center.set(0, 2);
      model.add(modelLabel);
      modelLabel.layers.set(0);

      scene.add(group);
      renderer.render(scene, camera);

      function animate() {
        model.rotation.set(model.rotation.x, 0, rotation);
        const elapsed = clock.getElapsedTime();
        modelLabel.position.set(
          Math.sin(elapsed/2) / 10,
          modelLabel.position.y,
          Math.cos(elapsed/2) / 10
        );
        renderer.render(scene, camera);
        labelRenderer.render(scene, camera);
        controls.update();
        requestAnimationFrame(animate);
      }

      animate();
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    (err) => {
      console.log("An error happened", err);
    }
  );

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    labelRenderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener("resize", onWindowResize);
  // animate();
}

main();

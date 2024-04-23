import {
  BoxGeometry,
  MeshPhongMaterial,
  Mesh,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  ImageLoader,
  TextureLoader,
  Color,
  AmbientLight,
  DirectionalLight,
  HemisphereLight,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";

import PageFlyImageURl from "/pagefly.png";

async function main() {
  const { camera, scene, renderer, css2DObjectRenderer } = createScene();
  const { aLight, dLight, hLight } = createLight();
  scene.add(aLight);
  scene.add(dLight);
  scene.add(hLight);

  const geometry = new BoxGeometry(2, 2, 2);
  const texture = new TextureLoader().load(PageFlyImageURl);
  const material = new MeshPhongMaterial({ color: 0xffff });
  const cube = new Mesh(geometry, material);
  scene.add(cube);
  cube.layers.enableAll();

  const heading = document.createElement("h1");
  heading.className = "pf-heading";
  heading.textContent = "PAGEFLY";
  heading.style.backgroundColor = "transparent";

  const heading2DObject = new CSS2DObject(heading);
  heading2DObject.position.set(-6, 0, 0);
  heading2DObject.center.set(0, 1);
  scene.add(heading2DObject);
  heading2DObject.layers.set(0);

  // Start animation
  renderer.setAnimationLoop(function animate(time) {
    cube.rotation.x = time / 10000;
    cube.rotation.y = time / 10000;
    renderer.render(scene, camera);
    css2DObjectRenderer.render(scene, camera);
  });
}

function createScene() {
  const scene = new Scene();
  scene.background = new Color("skyblue");

  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const canvas = document.getElementById("canvas#1");
  const renderer = new WebGLRenderer({ antialias: true, canvas });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const css2DObjectRenderer = new CSS2DRenderer();
  css2DObjectRenderer.setSize(window.innerWidth, window.innerHeight);
  css2DObjectRenderer.domElement.style.position = "absolute";
  css2DObjectRenderer.domElement.style.top = "0px";
  document.body.appendChild(css2DObjectRenderer.domElement);


  const controls = new OrbitControls(camera, renderer.domElement);

  camera.position.z = 5;
  controls.update();

  return {
    scene,
    camera,
    renderer,
    css2DObjectRenderer
  };
}

function createCSS2DObjectRenderer() {
  
}

function createLight() {
  const aLight = new AmbientLight(0xffff);
  const dLight = new DirectionalLight(0xffffff, 3);
  const hLight = new HemisphereLight(0xffff, 0x404040, 1);
  return {
    aLight,
    dLight,
    hLight,
  };
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const loader = new ImageLoader();
    loader.load(
      url,
      (image) => {
        return resolve(image);
      },
      undefined,
      reject
    );
  });
}

main();

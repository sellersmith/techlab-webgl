import {
  BoxGeometry,
  MeshPhongMaterial,
  Mesh,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Color,
  AmbientLight,
  DirectionalLight,
  HemisphereLight,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const { camera, scene, renderer } = createScene();

async function main() {
  const { aLight, dLight, hLight } = createLight();
  scene.add(aLight);
  scene.add(dLight);
  scene.add(hLight);

  const geometry = new BoxGeometry(2, 2, 2);
  const material = new MeshPhongMaterial({ color: 0xffff });
  const cube = new Mesh(geometry, material);
  scene.add(cube);

  // Start animation
  renderer.setAnimationLoop(function animate(time) {
    cube.rotation.x = time / 10000;
    cube.rotation.y = time / 10000;
    renderer.render(scene, camera);
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

  const controls = new OrbitControls(camera, renderer.domElement);

  camera.position.z = 5;
  controls.update();

  return {
    scene,
    camera,
    renderer,
  };
}

function createLight() {
  const aLight = new AmbientLight(0xffff, Math.PI);
  const dLight = new DirectionalLight(0xffffff, Math.PI);
  dLight.position.set(1, 1, 1);
  const hLight = new HemisphereLight(0xffff, 0x404040, Math.PI);
  return {
    aLight,
    dLight,
    hLight,
  };
}

main();

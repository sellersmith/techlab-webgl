import {
  BoxGeometry,
  Mesh,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AmbientLight,
  DirectionalLight,
  HemisphereLight,
  Group,
  Raycaster,
  Vector2,
  MeshBasicMaterial,
  Color,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { CSS3DRenderer } from "three/addons/renderers/CSS3DRenderer.js";
import { solve as getSurroundPixels } from "./dangGetSurroundPixels";

const { camera, scene, controls, css3DRenderer, renderer } = createScene();
const { aLight, dLight, hLight } = createLight();
scene.add(aLight);
scene.add(dLight);
scene.add(hLight);
const raycaster = new Raycaster();
const pointer = new Vector2();
const objects = [];
let hoveredMesh = {};

const SPEED = 0.01,
  MAX_HEIGHT = 1,
  MIN_HEIGHT = 0;

async function main() {
  const group = new Group();
  // group.position.z = Math.PI;

  const boxes = [];
  const GAP = 1.5;
  //  const array = Array.from(() =)
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      const geometry = new BoxGeometry(1, 1, 1);
      const color = `#${Math.round((255 / 10) * x)
        .toString(16)
        .padStart(2, "0")}${Math.round((255 / 10) * y)
        .toString(16)
        .padStart(2, "0")}00`;
      console.log(color);
      const material = new MeshBasicMaterial({ color });
      const box = new Mesh(geometry, material);
      scene.add(box);
      box.position.x = x * GAP;
      box.position.z = y * GAP;
      box.name = `${x}-${y}`;
      box.x = x;
      box.y = y;
      if (!boxes[x]) boxes[x] = [];
      boxes[x][y] = box;
    }
  }

  console.log("boxes: ", boxes);

  // Start animation
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    css3DRenderer.render(scene, camera);
    if (hoveredMesh && hoveredMesh.position) {
      hoveredMesh.position.y = Math.min(hoveredMesh.position.y + 0.08, MAX_HEIGHT);

      const surroundPixels = getSurroundPixels(
        { x: hoveredMesh.x, y: hoveredMesh.y },
        boxes
      );
      for (let i = 0; i < 3 && i < surroundPixels.length; i++) {
        for (let j = 0; j < surroundPixels[i].length; j++) {
          const mesh = boxes[surroundPixels[i][j].x][surroundPixels[i][j].y];
          mesh.position.y = Math.min(mesh.position.y, hoveredMesh.position.y)  + 0.02 - 0.01*i;
        }
      }
    }

    controls.update();
  }

  function onPointerMove(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    // raycaster.layers.set(1)
    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
      hoveredMesh = intersects[0].object;
    }
  }

  window.addEventListener("pointermove", onPointerMove);

  animate();
}

function createScene() {
  const scene = new Scene();
  scene.background = new Color('#fff');

  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const canvas = document.getElementById("canvas#1");
  const renderer = new WebGLRenderer({ antialias: true, canvas });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const css3DRenderer = new CSS3DRenderer();
  css3DRenderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("css3d").appendChild(css3DRenderer.domElement);

  const controls = new OrbitControls(camera, css3DRenderer.domElement);

  camera.position.z = 40;
  camera.position.y = 5;
  camera.rotateX(Math.PI / 6);
  controls.update();

  return {
    scene,
    camera,
    controls,
    renderer,
    css3DRenderer,
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

import React, { useRef, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useTexture, AccumulativeShadows, RandomizedLight, Decal, Environment, Center } from '@react-three/drei'
import { Overlay } from "./components";
import { useSnapshot } from "valtio";
import { state } from "./store";
import { easing } from "maath";
import MODAl_CONFIGS from "./modelConfigs";
import { DragImage } from "./components/DragImage";
function App() {
  return (
    <DragImage>
      <Canvas gl={{ preserveDrawingBuffer: true }}>
        <Suspense fallback={null}>
          <Model />
          <Environment preset="sunset" />
          <Backdrop />
        </Suspense>
      </Canvas>
      <Overlay />
    </DragImage>
  );
}

function Backdrop() {
  const shadows = useRef()
  useFrame((state, delta) => easing.dampC(shadows.current.getMesh().material.color, state.color, 0.25, delta))
  return (
    <AccumulativeShadows ref={shadows} temporal frames={60} alphaTest={1} scale={10} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -1]}>
      <RandomizedLight amount={4} radius={9} intensity={0.55} ambient={0.25} position={[5, 5, -10]} />
      <RandomizedLight amount={4} radius={5} intensity={0.25} ambient={0.55} position={[-5, 5, -9]} />
    </AccumulativeShadows>
  )
}

function Model(props) {
  const modelURL = "/tshirt5.glb";
  const snap = useSnapshot(state);
  const meshRef = useRef();
  const groupRef = useRef();
  const decalRef = useRef();
  const { viewport } = useThree();
  const { nodes, materials } = useGLTF(modelURL);
  const texture = useTexture(
    snap.decal.includes("base64")
      ? snap.decal
      : `/${snap.decal}.${snap.decal === "pagefly" ? "png" : "webp"}`
  );

  const textTexture = useTexture(convertTextToImageBase64("Hello World"));

  const [meshPointerEnter, setMeshPointerEnter] = useState(false);

  useFrame((state, delta, xrFrame) => {
    const mouse = state.pointer;
    const groupY = (mouse.x * viewport.width) / 2;
    groupRef.current.rotation.set(
      groupRef.current.rotation.x,
      groupY,
      groupRef.current.rotation.z
    );

    // const meshY = meshRef.current.rotation.y + 0.01;
    // meshRef.current.rotation.set(
    //   meshRef.current.rotation.x,
    //   meshY,
    //   meshRef.current.rotation.z
    // );
    easing.dampC(
      materials[MODAl_CONFIGS[modelURL].material].color,
      snap.color,
      0.25,
      delta
    );
  });

  console.log({
    nodes,
    materials,
  });

  const [decalPosition, setDecalPosition] = useState([0, 1, 0.15]);
  console.log(convertTextToImageBase64("Hello world"));
  return (
    <group ref={groupRef} {...props} dispose={null}>
      <mesh
        scale={1}
        rotation={[0, 0, 0]}
        position={[0, 0, 0]}
        ref={meshRef}
        castShadow
        receiveShadow
        geometry={nodes[MODAl_CONFIGS[modelURL].geometry].geometry}
        material={materials[MODAl_CONFIGS[modelURL].material]}
        onPointerDown={(e) => {
          setMeshPointerEnter(true);
        }}
        onPointerUp={(e) => {
          setMeshPointerEnter(false);
        }}
        onPointerMove={(e) => {
          if (!meshPointerEnter) return;
          const { x, y, z } = e.point;
          setDecalPosition([x, y, decalPosition[2]]);
        }}
      >
        <Decal
          ref={decalRef}
          position={decalPosition}
          rotation={[0, 0, 0]}
          scale={1}
          map={texture}
          onPointerDown={(e) => {
            console.log("e", e);
          }}
        />
        <Decal
          ref={decalRef}
          position={decalPosition}
          rotation={[0, 0, 0]}
          scale={1}
          map={textTexture}
          onPointerDown={(e) => {
            console.log("e", e);
          }}
        />
      </mesh>
    </group>
  );
}

["/vibe.webp", "/pagefly.png", "/checkmate.webp"].forEach(useTexture.preload);

export default App;

function convertTextToImageBase64(text) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Set font and style
  ctx.font = "30px Arial";
  ctx.fillStyle = "black";

  const textWidth = ctx.measureText(text).width;

  // Draw the text
  ctx.fillText(text, 20, 40);

  // Get base64 encoded image data (including data URI prefix)
  const imageData = canvas.toDataURL("image/png");

  return imageData;
}

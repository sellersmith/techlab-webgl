import React, { useRef, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, useTexture, Decal } from "@react-three/drei";
import { Overlay } from "./components";
import { useSnapshot } from "valtio";
import { state } from "./store";
import { easing } from "maath";
import MODAl_CONFIGS from "./modelConfigs";
import { DragImage } from "./components/DragImage";
function App() {
  return (
    <DragImage>
      <Canvas>
        <Suspense fallback={null}>
          <Model />
          <Environment preset="sunset" background />
        </Suspense>
      </Canvas>
      <Overlay />
    </DragImage>
  );
}

function Model(props) {
  const modelURL = "/tshirt5.glb";
  const snap = useSnapshot(state);
  const meshRef = useRef();
  const groupRef = useRef();
  const { viewport } = useThree();
  const { nodes, materials } = useGLTF(modelURL);
  const texture = useTexture(
    snap.decal.includes("base64")
      ? snap.decal
      : `/${snap.decal}.${snap.decal === "pagefly" ? "png" : "webp"}`
  );

  useFrame((state, delta, xrFrame) => {
    const mouse = state.pointer;
    const groupY = (mouse.x * viewport.width) / 2;
    groupRef.current.rotation.set(
      groupRef.current.rotation.x,
      groupY,
      groupRef.current.rotation.z
    );

    const meshY = meshRef.current.rotation.y + 0.01;
    meshRef.current.rotation.set(
      meshRef.current.rotation.x,
      meshY,
      meshRef.current.rotation.z
    );
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
  return (
    <group ref={groupRef} {...props} dispose={null}>
      <mesh
        scale={1}
        rotation={[0, 0, 0]}
        ref={meshRef}
        castShadow
        receiveShadow
        geometry={nodes[MODAl_CONFIGS[modelURL].geometry].geometry}
        material={materials[MODAl_CONFIGS[modelURL].material]}
      >
        <Decal
          position={[0, 1, 0.15]}
          rotation={[0, 0, 0]}
          scale={1}
          map={texture}
        />
      </mesh>
    </group>
  );
}

["/vibe.webp", "/pagefly.png", "/checkmate.webp"].forEach(useTexture.preload);

export default App;

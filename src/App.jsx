import React, { useRef, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, useTexture, Decal } from "@react-three/drei";

function App() {
  return (
    <Canvas>
      <Suspense fallback={null}>
        <Model />
        <Environment preset="sunset" background />
      </Suspense>
    </Canvas>
  );
}

function Model(props) {
  const meshRef = useRef();
  const { viewport } = useThree();
  const { nodes, materials } = useGLTF("/tshirt5.glb");
  const texture = useTexture(`/pagefly.jpeg`);
  useFrame((state, delta, xrFrame) => {
    const mouse = state.pointer
    const z = (mouse.x * viewport.width) / 2
    meshRef.current.rotation.set(meshRef.current.rotation.x, z , meshRef.current.rotation.z)
  }
  )

  console.log({
    nodes,
    materials
  })
  return (
    <group {...props} dispose={null}>
      <mesh
        scale={1}
        rotation={[0, 0, 0]}
        ref={meshRef}
        castShadow
        receiveShadow
        geometry={nodes["Male_Tshirt"].geometry} material={materials['lambert.002']}
      >
        <Decal debug position={[0, 1, 0.15]} rotation={[0, 0, 0]} scale={1.5} map={texture}  />
      </mesh>
    </group>
  );
}

function Box(props) {
  // This reference will give us direct access to the mesh
  const meshRef = useRef();
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (meshRef.current.rotation.x += delta));
  // Return view, these are regular three.js elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}

["/vibe.webp", "/pagefly.jpeg", "/checkmate.webp", '/three2.png'].forEach(useTexture.preload);

export default App;

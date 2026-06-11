import { OrbitControls, Sparkles, Stars } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import MainStar from "./MainStar";
import StarCluster from "./StarCluster";

function CameraController({ selected }) {
  const { camera } = useThree();
  const initial = useRef(new THREE.Vector3(0, 2.4, 11.5));

  useFrame((_, delta) => {
    const target = selected ? new THREE.Vector3(0, 1.1, 7.2) : initial.current;
    camera.position.lerp(target, 1 - Math.exp(-delta * 2.6));
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function SceneContent({
  memories,
  manualRotation,
  focusedIndex,
  heldMemory,
  selectedMemory,
  onFocus,
  onSelect,
}) {
  const controls = useRef();

  useEffect(() => {
    if (selectedMemory) controls.current?.reset();
  }, [selectedMemory]);

  return (
    <>
      <color attach="background" args={["#060611"]} />
      <fog attach="fog" args={["#080816", 9, 23]} />
      <ambientLight intensity={0.28} color="#aca7ff" />
      <Stars radius={70} depth={38} count={2400} factor={3.2} saturation={0.15} fade speed={0.45} />
      <Sparkles count={95} scale={[15, 8, 15]} size={1.1} speed={0.22} opacity={0.35} color="#ffb5d0" />
      <MainStar />
      {memories.map((memory, index) => (
        <StarCluster
          key={memory.id}
          memory={memory}
          manualRotation={manualRotation}
          focused={focusedIndex === index}
          held={heldMemory?.id === memory.id}
          selected={selectedMemory?.id === memory.id}
          onFocus={onFocus}
          onSelect={onSelect}
        />
      ))}
      <CameraController selected={selectedMemory} />
      <OrbitControls
        ref={controls}
        enabled={!selectedMemory}
        enablePan={false}
        minDistance={7.5}
        maxDistance={15}
        minPolarAngle={Math.PI * 0.26}
        maxPolarAngle={Math.PI * 0.72}
        autoRotate={!selectedMemory}
        autoRotateSpeed={0.22}
        dampingFactor={0.06}
        enableDamping
      />
    </>
  );
}

export default function GalaxyScene(props) {
  return (
    <Canvas
      camera={{ position: [0, 2.4, 11.5], fov: 48 }}
      dpr={[1, 1.65]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
    >
      <SceneContent {...props} />
    </Canvas>
  );
}

import { Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function MainStar() {
  const core = useRef();
  const rings = useRef();

  useFrame((_, delta) => {
    core.current.rotation.y += delta * 0.22;
    core.current.rotation.x -= delta * 0.12;
    rings.current.rotation.z += delta * 0.08;
  });

  return (
    <group>
      <pointLight color="#ffd1e5" intensity={28} distance={10} decay={2} />
      <mesh ref={core}>
        <icosahedronGeometry args={[0.66, 3]} />
        <meshStandardMaterial
          color="#fff7f9"
          emissive="#ff6ca9"
          emissiveIntensity={2.2}
          roughness={0.32}
          metalness={0.08}
        />
      </mesh>
      <group ref={rings} rotation={[1.1, 0.2, 0.3]}>
        <mesh>
          <torusGeometry args={[1.2, 0.018, 8, 96]} />
          <meshBasicMaterial color="#ffafd2" transparent opacity={0.65} />
        </mesh>
        <mesh rotation={[0.8, 0.4, 0.2]}>
          <torusGeometry args={[1.55, 0.012, 8, 96]} />
          <meshBasicMaterial color="#a99dff" transparent opacity={0.42} />
        </mesh>
      </group>
      <Sparkles count={44} scale={3.2} size={2.4} speed={0.35} color="#ffd5e6" />
    </group>
  );
}

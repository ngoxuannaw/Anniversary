import { Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import HeartCore from "./HeartCore";
import { StellarGlow } from "./StellarParticles";

export default function MainStar() {
  const core = useRef();
  const corona = useRef();
  const rings = useRef();

  useFrame((state, delta) => {
    core.current.rotation.y += delta * 0.22;
    core.current.rotation.x -= delta * 0.12;
    corona.current.rotation.y -= delta * 0.08;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.8) * 0.045;
    corona.current.scale.setScalar(pulse);
    rings.current.rotation.z += delta * 0.08;
  });

  return (
    <group>
      <pointLight color="#ffbad4" intensity={35} distance={13} decay={2} />
      <StellarGlow color="#ff9fc5" scale={6.5} opacity={0.54} />
      <StellarGlow color="#fff0f6" scale={3.2} opacity={0.82} />
      <group ref={corona}>
        <mesh scale={1.1}>
          <sphereGeometry args={[0.72, 40, 40]} />
          <meshBasicMaterial
            color="#ff99c1"
            opacity={0.1}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            transparent
          />
        </mesh>
      </group>
      <group ref={core}>
        <HeartCore color="#ff6ca9" scale={0.78} />
      </group>
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
      <Sparkles count={82} scale={4.2} size={2.35} speed={0.48} color="#ffd5e6" />
    </group>
  );
}

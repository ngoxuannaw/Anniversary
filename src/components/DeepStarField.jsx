import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { StellarParticles } from "./StellarParticles";

function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function makeStarLayer(seed, count, radius, palette) {
  const random = seededRandom(seed);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count);

  for (let index = 0; index < count; index += 1) {
    const distance = radius * (0.48 + random() * 0.52);
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    const positionIndex = index * 3;
    const color = new THREE.Color(palette[Math.floor(random() * palette.length)]);

    positions[positionIndex] = distance * Math.sin(phi) * Math.cos(theta);
    positions[positionIndex + 1] = distance * Math.cos(phi) * 0.68;
    positions[positionIndex + 2] = distance * Math.sin(phi) * Math.sin(theta);
    colors[positionIndex] = color.r;
    colors[positionIndex + 1] = color.g;
    colors[positionIndex + 2] = color.b;
    sizes[index] = 0.34 + Math.pow(random(), 6) * 2.6;
    phases[index] = random();
  }

  return { positions, colors, sizes, phases };
}

export default function DeepStarField() {
  const nebula = useRef();
  const farStars = useMemo(
    () => makeStarLayer(23, 2100, 48, ["#ffffff", "#b9c9ff", "#ffd4e2", "#a9a1ff"]),
    [],
  );
  const nearStars = useMemo(
    () => makeStarLayer(91, 420, 23, ["#ffffff", "#ffe8b8", "#d8c5ff", "#b8e6ff"]),
    [],
  );

  useFrame((state, delta) => {
    nebula.current.rotation.z += delta * 0.003;
    nebula.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.025) * 0.06;
  });

  return (
    <group ref={nebula}>
      <StellarParticles {...farStars} scale={0.78} rotationSpeed={0.002} />
      <StellarParticles {...nearStars} scale={1.28} rotationSpeed={-0.004} />
      <mesh rotation={[Math.PI / 2.3, 0.12, -0.35]} scale={[16, 8, 1]}>
        <ringGeometry args={[0.34, 1, 96]} />
        <meshBasicMaterial
          color="#72518f"
          opacity={0.025}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          transparent
        />
      </mesh>
    </group>
  );
}

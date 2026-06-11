import { Html, Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { StellarGlow, StellarParticles } from "./StellarParticles";

function makeClusterParticles(seed, baseColor, count = 110) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count);
  const color = new THREE.Color(baseColor);
  let current = seed * 997 + 17;
  const random = () => {
    current = (current * 9301 + 49297) % 233280;
    return current / 233280;
  };

  for (let index = 0; index < count; index += 1) {
    const radius = 0.035 + Math.pow(random(), 2.05) * 0.42;
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    const positionIndex = index * 3;
    const starColor = color.clone().lerp(new THREE.Color("#ffffff"), 0.2 + random() * 0.7);

    positions[positionIndex] = radius * Math.sin(phi) * Math.cos(theta) * 0.82;
    positions[positionIndex + 1] = radius * Math.sin(phi) * Math.sin(theta) * 1.15;
    positions[positionIndex + 2] = radius * Math.cos(phi) * 0.72;
    colors[positionIndex] = starColor.r;
    colors[positionIndex + 1] = starColor.g;
    colors[positionIndex + 2] = starColor.b;
    sizes[index] = 0.32 + Math.pow(random(), 6) * 1.05;
    phases[index] = random();
  }

  return { positions, colors, sizes, phases };
}

export default function StarCluster({
  memory,
  manualRotation,
  focused,
  held,
  selected,
  onFocus,
  onSelect,
}) {
  const group = useRef();
  const cluster = useRef();
  const [hovered, setHovered] = useState(false);
  const particles = useMemo(
    () => makeClusterParticles(memory.id, memory.color),
    [memory.color, memory.id],
  );
  const target = useMemo(() => new THREE.Vector3(), []);
  const targetScale = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const angle = memory.angle + time * memory.orbitSpeed + manualRotation;
    target.set(
      Math.cos(angle) * memory.orbitRadius,
      memory.height + Math.sin(time * 0.45 + memory.id) * 0.16,
      Math.sin(angle) * memory.orbitRadius,
    );

    group.current.position.lerp(target, 1 - Math.exp(-delta * 5));
    cluster.current.rotation.y += delta * (held ? 0.4 : 1.05);
    const scaleValue = selected ? 1.15 : hovered || focused || held ? 0.86 : 0.7;
    targetScale.setScalar(scaleValue);
    cluster.current.scale.lerp(targetScale, 1 - Math.exp(-delta * 8));
  });

  return (
    <group ref={group} rotation={[memory.tilt, 0, 0]}>
      <group
        ref={cluster}
        scale={0.7}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(memory);
        }}
        onPointerEnter={(event) => {
          event.stopPropagation();
          setHovered(true);
          onFocus(memory.id - 1);
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = "default";
        }}
      >
        <StellarParticles {...particles} scale={0.9} rotationSpeed={0.15} />
        <StellarGlow
          color={memory.color}
          scale={focused || held || hovered ? 0.7 : 0.52}
          opacity={focused || held || hovered ? 0.56 : 0.32}
        />
        <mesh>
          <sphereGeometry args={[0.48, 16, 16]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.052, 24, 24]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive={memory.color}
            emissiveIntensity={focused || held ? 8 : 5.5}
            roughness={0.08}
          />
        </mesh>
        <pointLight color={memory.color} intensity={focused || held ? 3.5 : 1.4} distance={1.4} />
        <Sparkles count={18} scale={selected ? 1.2 : 0.72} size={1.1} speed={0.42} color={memory.color} />
        {(hovered || focused || held) && (
          <Html center distanceFactor={8} position={[0, 0.56, 0]}>
            <div className={`cluster-label ${held ? "is-held" : ""}`}>
              <small>{held ? "Đang giữ" : `Kỷ niệm ${String(memory.id).padStart(2, "0")}`}</small>
              <strong>{memory.title}</strong>
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}

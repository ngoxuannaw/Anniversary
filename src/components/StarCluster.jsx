import { Html, Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

function makeParticlePositions(seed, count = 18) {
  const values = [];
  let current = seed * 997 + 17;
  const random = () => {
    current = (current * 9301 + 49297) % 233280;
    return current / 233280;
  };

  for (let index = 0; index < count; index += 1) {
    const radius = 0.12 + random() * 0.46;
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    values.push(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi),
    );
  }
  return new Float32Array(values);
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
  const positions = useMemo(() => makeParticlePositions(memory.id), [memory.id]);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const angle = memory.angle + time * memory.orbitSpeed + manualRotation;
    const target = new THREE.Vector3(
      Math.cos(angle) * memory.orbitRadius,
      memory.height + Math.sin(time * 0.45 + memory.id) * 0.16,
      Math.sin(angle) * memory.orbitRadius,
    );

    group.current.position.lerp(target, 1 - Math.exp(-delta * 5));
    cluster.current.rotation.y += delta * (held ? 0.4 : 1.05);
    const targetScale = selected ? 2.25 : hovered || focused || held ? 1.42 : 1;
    cluster.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      1 - Math.exp(-delta * 8),
    );
  });

  return (
    <group ref={group} rotation={[memory.tilt, 0, 0]}>
      <group
        ref={cluster}
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
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[positions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            color={memory.color}
            size={0.105}
            sizeAttenuation
            transparent
            opacity={0.9}
            depthWrite={false}
          />
        </points>
        <mesh>
          <sphereGeometry args={[0.17, 24, 24]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive={memory.color}
            emissiveIntensity={focused || held ? 4.5 : 2.7}
          />
        </mesh>
        <pointLight color={memory.color} intensity={focused || held ? 5 : 2} distance={2.5} />
        <Sparkles count={12} scale={selected ? 2.2 : 1.25} size={2.5} speed={0.55} color={memory.color} />
        {(hovered || focused || held) && (
          <Html center distanceFactor={8} position={[0, 0.72, 0]}>
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

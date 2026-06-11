import { useEffect, useMemo } from "react";
import * as THREE from "three";

function createHeartShape() {
  const shape = new THREE.Shape();
  shape.moveTo(0, -0.48);
  shape.bezierCurveTo(-0.12, -0.35, -0.62, -0.05, -0.62, 0.34);
  shape.bezierCurveTo(-0.62, 0.68, -0.24, 0.82, 0, 0.5);
  shape.bezierCurveTo(0.24, 0.82, 0.62, 0.68, 0.62, 0.34);
  shape.bezierCurveTo(0.62, -0.05, 0.12, -0.35, 0, -0.48);
  return shape;
}

export default function HeartCore({ color = "#ff6ca9", scale = 1 }) {
  const geometry = useMemo(() => {
    const heartGeometry = new THREE.ExtrudeGeometry(createHeartShape(), {
      depth: 0.24,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.055,
      bevelThickness: 0.055,
      curveSegments: 24,
      steps: 1,
    });
    heartGeometry.center();
    return heartGeometry;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <group scale={scale}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color="#fff8fb"
          emissive={color}
          emissiveIntensity={6}
          metalness={0.05}
          roughness={0.16}
        />
      </mesh>
    </group>
  );
}

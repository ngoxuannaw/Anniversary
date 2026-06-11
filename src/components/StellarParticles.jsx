import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aPhase;

  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uScale;

  varying vec3 vColor;
  varying float vPulse;

  void main() {
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    float pulse = 0.82 + sin(uTime * (0.9 + aPhase * 0.45) + aPhase * 9.0) * 0.18;
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = clamp(
      aSize * uScale * uPixelRatio * pulse * (48.0 / max(1.0, -viewPosition.z)),
      1.0,
      9.0
    );
    vColor = aColor;
    vPulse = pulse;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vPulse;

  void main() {
    float distanceToCenter = length(gl_PointCoord - vec2(0.5));
    float softGlow = smoothstep(0.5, 0.04, distanceToCenter);
    float hotCore = smoothstep(0.11, 0.0, distanceToCenter);
    float alpha = softGlow * (0.24 + hotCore * 0.76) * vPulse;

    if (alpha < 0.035) discard;
    gl_FragColor = vec4(vColor * (1.0 + hotCore * 3.2), alpha);
  }
`;

export function StellarParticles({
  positions,
  colors,
  sizes,
  phases,
  scale = 1,
  rotationSpeed = 0,
  opacity = 1,
}) {
  const points = useRef();
  const material = useRef();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uScale: { value: scale },
    }),
    [scale],
  );

  useFrame((state, delta) => {
    material.current.uniforms.uTime.value = state.clock.elapsedTime;
    if (rotationSpeed) points.current.rotation.y += delta * rotationSpeed;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        transparent
        opacity={opacity}
      />
    </points>
  );
}

function createGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.08, "rgba(255,255,255,.96)");
  gradient.addColorStop(0.28, "rgba(255,255,255,.34)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

export function StellarGlow({ color = "#ffffff", scale = 2, opacity = 0.72 }) {
  const texture = useMemo(createGlowTexture, []);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <sprite scale={[scale, scale, 1]}>
      <spriteMaterial
        map={texture}
        color={color}
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        transparent
      />
    </sprite>
  );
}

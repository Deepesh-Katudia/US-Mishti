"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sparkles } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";
import { createCutGeometry } from "@/components/three/cutGeometry";
import { SHAPE_SPECS } from "@/components/three/shapeSpecs";
import { GemMaterial, Studio, createGlowTexture } from "@/components/three/studio";
import type { ShapeId } from "@/lib/content";

const RESTING_SPIN = 0.35;
const BURST_SPIN = 9;
/** Table turned toward the viewer: fancy shapes are recognised by their face-up outline. */
const FACE_UP_TILT = 0.95;

/**
 * Pops up edge-on with a spin burst, then turns its face to the viewer and settles
 * into a slow turn about its own axis (Euler XYZ spins the stone before tilting it).
 */
function Gem({ shape }: { shape: ShapeId }) {
  const group = useRef<THREE.Group>(null);
  const spin = useRef(BURST_SPIN);
  const geometry = useMemo(() => createCutGeometry(SHAPE_SPECS[shape]), [shape]);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    spin.current = THREE.MathUtils.damp(spin.current, RESTING_SPIN, 2.2, delta);
    g.rotation.y += delta * spin.current;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, FACE_UP_TILT, 2.5, delta);
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, 1.1, 5, delta));
    g.position.y = THREE.MathUtils.damp(g.position.y, 0, 4, delta);
  });

  return (
    <group ref={group} scale={0.001} position={[0, -1.2, 0]} rotation={[-0.2, 0, 0]}>
      <mesh geometry={geometry}>
        <GemMaterial />
      </mesh>
    </group>
  );
}

function Backdrop() {
  const texture = useMemo(() => createGlowTexture(0.95), []);
  return (
    <mesh position={[0, 0, -4]}>
      <planeGeometry args={[30, 30]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

export default function ShapeViewer({ shape }: { shape: ShapeId }) {
  return (
    <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0.9, 7], fov: 35 }} gl={{ antialias: true }}>
      <color attach="background" args={["#0b0e16"]} />
      <Studio overheadIntensity={1.2} />
      <Backdrop />
      {/* Keyed by shape so switching stones replays the pop-out. */}
      <Gem key={shape} shape={shape} />
      <Sparkles count={40} scale={[6, 4, 3]} size={2} speed={0.3} color="#f3e3b5" opacity={0.7} />
      <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.7} minPolarAngle={0.5} maxPolarAngle={2.4} />
      <EffectComposer>
        <Bloom intensity={0.5} luminanceThreshold={0.7} luminanceSmoothing={0.2} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}

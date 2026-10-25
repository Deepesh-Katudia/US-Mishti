"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { createCutGeometry } from "./cutGeometry";
import { SHAPE_SPECS } from "./shapeSpecs";
import { GemMaterial, Studio, createGlowTexture } from "./studio";

export interface HeroCanvasProps {
  /** 0 → 1 scroll progress through the hero, written by the Hero section. */
  progress: MutableRefObject<number>;
}

const BASE_SPIN = 0.18;

function Diamond({ progress }: HeroCanvasProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => createCutGeometry(SHAPE_SPECS.round), []);

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    const p = progress.current;
    m.rotation.y += delta * (BASE_SPIN + p * 1.6);
    // Tilt the stone toward the viewer and follow the pointer subtly.
    const targetX = 0.22 - p * 0.7 + state.pointer.y * 0.15;
    const targetZ = state.pointer.x * -0.12;
    m.rotation.x = THREE.MathUtils.damp(m.rotation.x, targetX, 3, delta);
    m.rotation.z = THREE.MathUtils.damp(m.rotation.z, targetZ, 3, delta);
    const isWide = state.viewport.aspect > 1.3;
    // Narrow screens: a smaller stone floating above the headline instead of behind it.
    const scale = (isWide ? 1.25 : 0.62) + p * 0.55;
    m.scale.setScalar(THREE.MathUtils.damp(m.scale.x, scale, 4, delta));
    const baseY = isWide ? 0.2 : state.viewport.height * 0.3;
    m.position.y = THREE.MathUtils.damp(m.position.y, baseY * (1 - p) - p * 0.4, 4, delta);
    // On wide screens the stone sits right of the headline, gliding to centre as you scroll.
    const baseX = isWide ? state.viewport.width * 0.2 : 0;
    m.position.x = THREE.MathUtils.damp(m.position.x, baseX * (1 - p), 4, delta);
  });

  return (
    <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.6}>
      <mesh ref={mesh} geometry={geometry}>
        <GemMaterial />
      </mesh>
    </Float>
  );
}

/** A warm halo behind the stone — gives the transmission something golden to refract. */
function Halo({ progress }: HeroCanvasProps) {
  const texture = useMemo(() => createGlowTexture(), []);
  const mesh = useRef<THREE.Mesh>(null);

  // Track the stone horizontally (scaled for the deeper z-plane) so it always refracts gold.
  useFrame((state) => {
    if (!mesh.current) return;
    const p = progress.current;
    const isWide = state.viewport.aspect > 1.3;
    const baseX = isWide ? state.viewport.width * 0.3 : 0;
    const baseY = isWide ? 0.3 : state.viewport.height * 0.45;
    mesh.current.position.x = baseX * (1 - p);
    mesh.current.position.y = baseY * (1 - p);
  });

  return (
    <mesh ref={mesh} position={[0, 0.2, -3]}>
      <planeGeometry args={[34, 34]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

interface HeroCanvasRootProps extends HeroCanvasProps {
  /** False once the hero is off-screen; stops the render loop to save GPU and battery. */
  isActive: boolean;
}

export default function HeroCanvas({ progress, isActive }: HeroCanvasRootProps) {
  return (
    <Canvas
      frameloop={isActive ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6], fov: 35 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      aria-hidden
    >
      <color attach="background" args={["#0b0e16"]} />
      <Studio />
      <Halo progress={progress} />
      <Diamond progress={progress} />
      <Sparkles count={70} scale={[9, 6, 4]} size={2.2} speed={0.25} color="#f3e3b5" opacity={0.7} />
      <EffectComposer>
        <Bloom intensity={0.9} luminanceThreshold={0.62} luminanceSmoothing={0.2} mipmapBlur />
        <Vignette offset={0.25} darkness={0.55} />
      </EffectComposer>
    </Canvas>
  );
}

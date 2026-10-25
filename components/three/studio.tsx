"use client";

import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

/** Refractive diamond material shared by the hero stone and the shape viewer. */
export function GemMaterial() {
  return (
    <meshPhysicalMaterial
      color="#ffffff"
      transmission={1}
      thickness={0.9}
      roughness={0}
      ior={2.42}
      dispersion={4}
      iridescence={0.35}
      iridescenceIOR={1.6}
      clearcoat={1}
      envMapIntensity={2.2}
      flatShading
    />
  );
}

/** Opaque gold glow on ink — transmission only refracts opaque geometry, so this is what the stone "sees". */
export function createGlowTexture(strength = 1): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#0b0e16";
  ctx.fillRect(0, 0, size, size);
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size * 0.32);
  g.addColorStop(0, `rgba(243,227,181,${0.8 * strength})`);
  g.addColorStop(0.3, `rgba(212,178,106,${0.45 * strength})`);
  g.addColorStop(0.65, "rgba(43,50,69,0.4)");
  g.addColorStop(1, "rgba(11,14,22,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

interface StudioProps {
  /** The overhead strip that the table facet mirrors; lower it for close-up views. */
  overheadIntensity?: number;
}

/** Procedural studio lighting — warm gold strips and cool fills, no HDR download. */
export function Studio({ overheadIntensity = 6 }: StudioProps) {
  return (
    <Environment resolution={512} frames={1}>
      <color attach="background" args={["#05060a"]} />
      {/* Thin, hard-edged strips create the crisp light/dark facet contrast real diamonds have. */}
      {[-4, -2, 0, 2, 4].map((x) => (
        <Lightformer key={x} form="rect" intensity={10} color="#ffffff" position={[x, 4, -3]} scale={[0.35, 6, 1]} />
      ))}
      <Lightformer form="rect" intensity={overheadIntensity} color="#f3e3b5" position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[8, 0.6, 1]} />
      <Lightformer form="rect" intensity={5} color="#d4b26a" position={[-6, 0, 2]} rotation-y={Math.PI / 2} scale={[0.5, 8, 1]} />
      <Lightformer form="rect" intensity={4} color="#aab3d1" position={[6, 0, 2]} rotation-y={-Math.PI / 2} scale={[0.5, 8, 1]} />
      <Lightformer form="ring" intensity={6} color="#ffffff" position={[0, 0, 7]} scale={2.5} />
      <Lightformer form="circle" intensity={12} color="#ffe9b8" position={[3, 4, 5]} scale={0.8} />
    </Environment>
  );
}

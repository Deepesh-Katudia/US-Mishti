import type { ShapeId } from "@/lib/content";
import type { CutSpec, Vec2 } from "./cutGeometry";

const TAU = Math.PI * 2;

const sample = (count: number, fn: (t: number) => Vec2): Vec2[] =>
  Array.from({ length: count }, (_, i) => fn((i / count) * TAU));

const ellipse = (rx: number, rz: number) => sample(96, (t) => [Math.cos(t) * rx, Math.sin(t) * rz]);

/** |x|^n + |z|^n = 1, a "squircle": n = 2 is an ellipse, larger n approaches a rectangle. */
const superellipse = (rx: number, rz: number, n: number) =>
  sample(96, (t) => {
    const c = Math.cos(t);
    const s = Math.sin(t);
    return [Math.sign(c) * Math.abs(c) ** (2 / n) * rx, Math.sign(s) * Math.abs(s) ** (2 / n) * rz];
  });

/** Rectangle with chamfered corners: the classic emerald/asscher/radiant footprint. */
const octagon = (hw: number, hd: number, cut: number): Vec2[] => [
  [hw, hd - cut],
  [hw - cut, hd],
  [-hw + cut, hd],
  [-hw, hd - cut],
  [-hw, -hd + cut],
  [-hw + cut, -hd],
  [hw - cut, -hd],
  [hw, -hd + cut],
];

// Pointed at both ends, like the hull of a boat.
const marquise = sample(96, (t) => [Math.cos(t), Math.sign(Math.sin(t)) * 0.48 * Math.abs(Math.sin(t)) ** 1.35]);

// Teardrop: rounded end at -x, point at +x, shifted so the origin sits inside the body.
const pear = sample(96, (t) => [Math.cos(t) + 0.2, 0.85 * Math.sin(t) * Math.sin(t / 2)]);

// Classic parametric heart, notch toward -x, centred so every ray from the origin exits once.
const heart = sample(128, (t) => {
  const x = 16 * Math.sin(t) ** 3;
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  return [(-y - 2.5) / 17, x / 17];
});

// Triangle with gently convex sides.
const trilliant = (() => {
  const corners = [0, 1, 2].map((k) => (k / 3) * TAU - Math.PI / 2);
  const points: Vec2[] = [];
  corners.forEach((a0, k) => {
    const a1 = corners[(k + 1) % 3];
    const p0: Vec2 = [Math.cos(a0), Math.sin(a0)];
    const p1: Vec2 = [Math.cos(a1), Math.sin(a1)];
    const mid = (a0 + a1 + (k === 2 ? TAU : 0)) / 2;
    const ctrl: Vec2 = [Math.cos(mid) * 0.72, Math.sin(mid) * 0.72];
    for (let i = 0; i < 24; i++) {
      const u = i / 24;
      const w0 = (1 - u) ** 2;
      const w1 = 2 * u * (1 - u);
      const w2 = u ** 2;
      points.push([w0 * p0[0] + w1 * ctrl[0] + w2 * p1[0], w0 * p0[1] + w1 * ctrl[1] + w2 * p1[1]]);
    }
  });
  return points;
})();

export const SHAPE_SPECS: Record<ShapeId, CutSpec> = {
  round: { outline: ellipse(1, 1), style: "brilliant", segments: 16 },
  princess: { outline: superellipse(1, 1, 12), style: "brilliant", segments: 16 },
  oval: { outline: ellipse(1, 0.72), style: "brilliant", segments: 20 },
  emerald: { outline: octagon(1, 0.7, 0.2), style: "step", segments: 8, sampling: "vertices" },
  cushion: { outline: superellipse(1, 0.92, 3.4), style: "brilliant", segments: 16 },
  pear: { outline: pear, style: "brilliant", segments: 24 },
  heart: { outline: heart, style: "brilliant", segments: 32 },
  marquise: { outline: marquise, style: "brilliant", segments: 24 },
  radiant: { outline: octagon(1, 0.76, 0.16), style: "brilliant", segments: 24 },
  asscher: { outline: octagon(1, 1, 0.3), style: "step", segments: 8, sampling: "vertices" },
  trilliant: { outline: trilliant, style: "brilliant", segments: 24 },
  baguette: { outline: octagon(1, 0.38, 0.04), style: "step", segments: 8, sampling: "vertices" },
};

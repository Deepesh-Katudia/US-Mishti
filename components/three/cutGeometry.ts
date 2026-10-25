import * as THREE from "three";

export type Vec2 = readonly [number, number];

export type CutStyle = "brilliant" | "step";

export interface CutSpec {
  /** Girdle outline in the (x, z) plane: a closed polygon, star-shaped around the origin. */
  outline: readonly Vec2[];
  style: CutStyle;
  /** Facets around the girdle. More segments trace curved outlines more faithfully. */
  segments: number;
  /**
   * "uniform" samples the outline at evenly spaced angles (curved outlines).
   * "vertices" places facet edges on the polygon's own corners, so each tier of a
   * step cut is a set of flat trapezoids. `segments` is ignored in that mode.
   */
  sampling?: "uniform" | "vertices";
}

interface Ring {
  /** Fraction of the girdle outline. */
  scale: number;
  y: number;
  /** Rotation offset in fractions of one segment, staggering facets between rings. */
  offset: number;
}

interface Profile {
  rings: readonly Ring[];
  tableY: number;
  culetY: number;
}

// Side profiles, table (top) to culet (bottom).
const PROFILES: Record<CutStyle, Profile> = {
  brilliant: {
    tableY: 0.42,
    culetY: -0.92,
    rings: [
      { scale: 0.56, y: 0.42, offset: 0 }, // table edge
      { scale: 0.84, y: 0.26, offset: 0.5 }, // star / upper girdle
      { scale: 1, y: 0.05, offset: 0 }, // girdle top
      { scale: 1, y: -0.05, offset: 0 }, // girdle bottom
      { scale: 0.55, y: -0.5, offset: 0.5 }, // lower pavilion
    ],
  },
  // Concentric "staircase" facets, as on emerald, asscher and baguette cuts.
  step: {
    tableY: 0.36,
    culetY: -0.8,
    rings: [
      { scale: 0.64, y: 0.36, offset: 0 },
      { scale: 0.8, y: 0.27, offset: 0 },
      { scale: 0.92, y: 0.16, offset: 0 },
      { scale: 1, y: 0.04, offset: 0 },
      { scale: 1, y: -0.04, offset: 0 },
      { scale: 0.78, y: -0.3, offset: 0 },
      { scale: 0.52, y: -0.55, offset: 0 },
      { scale: 0.26, y: -0.72, offset: 0 },
    ],
  },
};

/** Distance from the origin to the outline along angle `theta`. */
export function rayCastOutline(outline: readonly Vec2[], theta: number): number {
  const dx = Math.cos(theta);
  const dz = Math.sin(theta);
  let nearest = Infinity;
  for (let i = 0; i < outline.length; i++) {
    const [ax, az] = outline[i];
    const [bx, bz] = outline[(i + 1) % outline.length];
    const ex = bx - ax;
    const ez = bz - az;
    const denom = dx * ez - dz * ex;
    if (Math.abs(denom) < 1e-12) continue;
    const t = (ax * ez - az * ex) / denom; // distance along the ray
    const u = (ax * dz - az * dx) / denom; // position along the edge
    if (t > 1e-9 && u >= -1e-9 && u <= 1 + 1e-9) nearest = Math.min(nearest, t);
  }
  return Number.isFinite(nearest) ? nearest : 0;
}

/** Angles (ascending, within one turn) at which facet edges meet the girdle. */
function facetAngles(spec: CutSpec): number[] {
  if (spec.sampling === "vertices") {
    const TAU = Math.PI * 2;
    return spec.outline.map(([x, z]) => (Math.atan2(z, x) + TAU) % TAU).sort((a, b) => a - b);
  }
  return Array.from({ length: spec.segments }, (_, i) => (i / spec.segments) * Math.PI * 2);
}

/**
 * Builds a faceted, flat-shaded gemstone from a girdle outline and a cut style.
 * Triangles are oriented outward by testing against an interior point.
 */
export function createCutGeometry(spec: CutSpec): THREE.BufferGeometry {
  const { rings, tableY, culetY } = PROFILES[spec.style];
  const angles = facetAngles(spec);
  const n = angles.length;

  // Normalise so the widest girdle dimension spans 2 units, and recentre lopsided
  // outlines (pear, trilliant) so the stone turns around its visual centre.
  const xs = spec.outline.map(([x]) => x);
  const zs = spec.outline.map(([, z]) => z);
  const width = Math.max(...xs) - Math.min(...xs);
  const depth = Math.max(...zs) - Math.min(...zs);
  const norm = 2 / Math.max(width, depth);
  const cx = ((Math.max(...xs) + Math.min(...xs)) / 2) * norm;
  const cz = ((Math.max(...zs) + Math.min(...zs)) / 2) * norm;

  const point = (ring: Ring, i: number) => {
    const a0 = angles[i % n];
    const a1 = i + 1 < n ? angles[i + 1] : angles[0] + Math.PI * 2;
    const theta = a0 + (a1 - a0) * ring.offset;
    const r = rayCastOutline(spec.outline, theta) * norm * ring.scale;
    return new THREE.Vector3(Math.cos(theta) * r, ring.y, Math.sin(theta) * r);
  };

  const tableCenter = new THREE.Vector3(0, tableY, 0);
  const culet = new THREE.Vector3(0, culetY, 0);
  const triangles: THREE.Vector3[][] = [];

  for (let i = 0; i < n; i++) {
    const next = (i + 1) % n;
    triangles.push([tableCenter, point(rings[0], i), point(rings[0], next)]);
    triangles.push([culet, point(rings[rings.length - 1], i), point(rings[rings.length - 1], next)]);
    for (let r = 0; r < rings.length - 1; r++) {
      const a0 = point(rings[r], i);
      const a1 = point(rings[r], next);
      const b0 = point(rings[r + 1], i);
      const b1 = point(rings[r + 1], next);
      triangles.push([a0, b0, a1], [a1, b0, b1]);
    }
  }

  const interior = new THREE.Vector3(0, -0.05, 0);
  const positions: number[] = [];
  for (const [a, b, c] of triangles) {
    const normal = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(c, a));
    const centroid = new THREE.Vector3().add(a).add(b).add(c).divideScalar(3);
    const ordered = normal.dot(centroid.sub(interior)) >= 0 ? [a, b, c] : [a, c, b];
    ordered.forEach((v) => positions.push(v.x, v.y, v.z));
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.translate(-cx, 0, -cz);
  geometry.computeVertexNormals();
  return geometry;
}

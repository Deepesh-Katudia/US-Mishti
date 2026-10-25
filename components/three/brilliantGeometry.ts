import * as THREE from "three";

interface Ring {
  radius: number;
  y: number;
  /** Rotation offset in fractions of one segment, staggering facets between rings. */
  offset: number;
}

const SEGMENTS = 16;

// Profile of a round brilliant, top (table) to bottom (culet).
const TABLE_Y = 0.42;
const RINGS: readonly Ring[] = [
  { radius: 0.56, y: TABLE_Y, offset: 0 }, // table edge
  { radius: 0.84, y: 0.26, offset: 0.5 }, // star / upper-girdle
  { radius: 1.0, y: 0.05, offset: 0 }, // girdle top
  { radius: 1.0, y: -0.05, offset: 0 }, // girdle bottom
  { radius: 0.55, y: -0.5, offset: 0.5 }, // lower pavilion
];
const CULET_Y = -0.92;

const ringPoint = (ring: Ring, i: number) => {
  const theta = ((i + ring.offset) / SEGMENTS) * Math.PI * 2;
  return new THREE.Vector3(Math.cos(theta) * ring.radius, ring.y, Math.sin(theta) * ring.radius);
};

/**
 * Builds a faceted, flat-shaded round-brilliant diamond. Triangles are oriented
 * outward by testing against an interior point, so normals are always correct.
 */
export function createBrilliantGeometry(): THREE.BufferGeometry {
  const triangles: THREE.Vector3[][] = [];
  const tableCenter = new THREE.Vector3(0, TABLE_Y, 0);
  const culet = new THREE.Vector3(0, CULET_Y, 0);

  for (let i = 0; i < SEGMENTS; i++) {
    const next = (i + 1) % SEGMENTS;
    triangles.push([tableCenter, ringPoint(RINGS[0], i), ringPoint(RINGS[0], next)]);
    triangles.push([culet, ringPoint(RINGS[RINGS.length - 1], i), ringPoint(RINGS[RINGS.length - 1], next)]);

    for (let r = 0; r < RINGS.length - 1; r++) {
      const a0 = ringPoint(RINGS[r], i);
      const a1 = ringPoint(RINGS[r], next);
      const b0 = ringPoint(RINGS[r + 1], i);
      const b1 = ringPoint(RINGS[r + 1], next);
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
  geometry.computeVertexNormals();
  return geometry;
}

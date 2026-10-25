import { describe, expect, it } from "vitest";
import * as THREE from "three";
import { createCutGeometry, rayCastOutline, type CutSpec } from "./cutGeometry";
import { SHAPE_SPECS } from "./shapeSpecs";

const square: CutSpec["outline"] = [
  [1, 1],
  [-1, 1],
  [-1, -1],
  [1, -1],
];

/** Every triangle's normal must point away from the stone's centre line. */
function countInwardFaces(geometry: THREE.BufferGeometry, spec: CutSpec): number {
  // Undo the recentring so faces are tested against the axis they were built around.
  const xs = spec.outline.map(([x]) => x);
  const zs = spec.outline.map(([, z]) => z);
  const norm = 2 / Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...zs) - Math.min(...zs));
  const axis = new THREE.Vector3(
    -((Math.max(...xs) + Math.min(...xs)) / 2) * norm,
    -0.05,
    -((Math.max(...zs) + Math.min(...zs)) / 2) * norm,
  );
  const pos = geometry.getAttribute("position");
  let inward = 0;
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  for (let i = 0; i < pos.count; i += 3) {
    a.fromBufferAttribute(pos, i);
    b.fromBufferAttribute(pos, i + 1);
    c.fromBufferAttribute(pos, i + 2);
    const normal = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(c, a));
    const centroid = new THREE.Vector3().add(a).add(b).add(c).divideScalar(3);
    if (normal.dot(centroid.sub(axis)) < 0) inward++;
  }
  return inward;
}

describe("rayCastOutline", () => {
  it("returns the distance to a square's edge along an axis", () => {
    expect(rayCastOutline(square, 0)).toBeCloseTo(1);
  });

  it("returns the distance to a square's corner on the diagonal", () => {
    expect(rayCastOutline(square, Math.PI / 4)).toBeCloseTo(Math.SQRT2);
  });
});

describe("createCutGeometry", () => {
  it.each(Object.entries(SHAPE_SPECS))("builds a closed, outward-facing %s", (_id, spec) => {
    const geometry = createCutGeometry(spec);
    const pos = geometry.getAttribute("position");

    expect(pos.count % 3).toBe(0);
    expect(pos.count).toBeGreaterThan(0);
    expect(countInwardFaces(geometry, spec)).toBe(0);

    geometry.computeBoundingBox();
    const size = geometry.boundingBox!.getSize(new THREE.Vector3());
    // Normalised so the widest girdle dimension is 2 units.
    expect(Math.max(size.x, size.z)).toBeCloseTo(2, 1);
  });

  it("gives elongated shapes a matching footprint", () => {
    const geometry = createCutGeometry(SHAPE_SPECS.oval);
    geometry.computeBoundingBox();
    const size = geometry.boundingBox!.getSize(new THREE.Vector3());
    expect(size.x / size.z).toBeGreaterThan(1.2);
  });
});

describe("vertex sampling", () => {
  it("gives each step-cut tier exactly one flat facet per polygon side", () => {
    const spec = SHAPE_SPECS.emerald;
    const geometry = createCutGeometry(spec);
    const tiers = 8; // ring count of the step profile
    // table fan + culet fan + 2 triangles per side between each pair of rings
    const expectedTriangles = spec.outline.length * (2 + 2 * (tiers - 1));
    expect(geometry.getAttribute("position").count / 3).toBe(expectedTriangles);
  });
});

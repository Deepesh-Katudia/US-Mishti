// One-time copy of parent-company (DiaHearts) imagery into public/images.
// Usage: node scripts/fetch-assets.mjs
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ORIGIN = "https://diahearts.com/images";
const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images");

const SHAPES = [
  "round-1", "princess-1", "oval-1", "emerald-1", "cushion-1", "pear-1",
  "heart-1", "marquise-1", "radiant-1", "asscher-1", "trilliant", "baguette",
];

const ASSETS = [
  ...["natural-diamond", "lab-grown-diamond", "gemstone", "cutting", "polishing"].map(
    (name) => `homepage_image/${name}.webp`,
  ),
  ...SHAPES.map((name) => `shape_pic/${name}.webp`),
  ...["service1_2", "service2_1"].map((name) => `service/${name}.webp`),
];

async function download(path) {
  const res = await fetch(`${ORIGIN}/${path}`, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  const target = join(OUT_DIR, path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, Buffer.from(await res.arrayBuffer()));
  return path;
}

const results = await Promise.allSettled(ASSETS.map(download));
const failed = results.filter((r) => r.status === "rejected");
console.log(`Downloaded ${results.length - failed.length}/${ASSETS.length} assets`);
failed.forEach((r) => console.error(`  failed: ${r.reason.message}`));
process.exitCode = failed.length ? 1 : 0;

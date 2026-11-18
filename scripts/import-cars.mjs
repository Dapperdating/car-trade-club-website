#!/usr/bin/env node
// Import the CARVALLO car folders into this site.
//
//   node scripts/import-cars.mjs /path/to/carvallo_website/cars [--force]
//
// Reads <src>/cars.csv plus each car folder's NN.jpg photos and writes:
//   data/cars.json                     normalised records, one per car (committed)
//   public/cars/<slug>/NN.webp         1280px long side, EXIF stripped (generated, gitignored)
//   public/cars/<slug>/NN-thumb.webp   640px long side, for cards and thumbnails
//
// Raw source values are kept next to the cleaned ones (`raw`) so nothing is lost.
// Photos are re-encoded with ImageMagick (`magick`), auto-oriented and stripped of
// all metadata (GPS included). Existing outputs are skipped unless --force is passed.

import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { availableParallelism } from "node:os";
import { join, resolve } from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);
const ROOT = resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const SRC = args.find((a) => !a.startsWith("--"));
if (!SRC) {
  console.error("usage: node scripts/import-cars.mjs <path/to/cars> [--force]");
  process.exit(1);
}

const FULL = { size: 1280, quality: 72 };
const THUMB = { size: 640, quality: 66 };

// —— CSV ——————————————————————————————————————————————————————————————
function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { row.push(field); field = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field); rows.push(row); row = []; field = "";
    } else field += ch;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const [head, ...body] = rows.filter((r) => r.some((v) => v.trim()));
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h.trim(), (r[i] ?? "").trim()])));
}

// —— Normalisation ————————————————————————————————————————————————————
const MAKE_NAMES = {
  bmw: "BMW", mg: "MG", swm: "SWM", "dr automobiles": "DR", "ds automobiles": "DS",
  "mercedes-benz": "Mercedes-Benz", mercedes: "Mercedes-Benz", "land rover": "Land Rover",
  "range rover": "Land Rover", "alfa romeo": "Alfa Romeo", škoda: "Škoda", skoda: "Škoda",
};
// Rows where the make is missing and the model names it.
const MAKE_FROM_MODEL = [
  [/^polestar\b/i, "Polestar"], [/^ghibli\b/i, "Maserati"], [/^gran vitara\b/i, "Suzuki"],
];
const FUELS = {
  diesel: "Diesel", benzina: "Benzina", ibrido: "Ibrida", ibrida: "Ibrida", hybrid: "Ibrida",
  gpl: "GPL", metano: "Metano", elettrico: "Elettrica", elettrica: "Elettrica",
};
const STATUSES = {
  "closed": "closed", "agreed with seller": "agreed", "no agreement": "no_agreement",
  "not taken": "not_taken", "": "unknown",
};

const titleCase = (s) => s.replace(/\S+/g, (w) => w[0].toUpperCase() + w.slice(1));
const int = (v) => (v === "" || v == null ? null : Number.isFinite(Number(v)) ? Math.round(Number(v)) : null);

function normaliseMake(make, model) {
  const m = make.trim();
  if (!m) return MAKE_FROM_MODEL.find(([re]) => re.test(model))?.[1] ?? "";
  return MAKE_NAMES[m.toLowerCase()] ?? titleCase(m);
}
function normaliseModel(model, make, rawMake) {
  let m = model.trim();
  // "Jeep Jeep Compass", "Ford Ford Ranger": drop a repeated make prefix.
  for (const prefix of [rawMake, make].filter(Boolean)) {
    const re = new RegExp("^" + prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s+", "i");
    if (re.test(m) && m.length > prefix.length + 1) m = m.replace(re, "");
  }
  if (make === "Polestar") m = m.replace(/^polestar\s+/i, "");
  return titleCase(m);
}
function normaliseFuel(fuel) {
  const f = fuel.trim().toLowerCase();
  if (FUELS[f]) return FUELS[f];
  if (/hybrid|ibrid/.test(f)) return "Ibrida";
  return fuel ? titleCase(fuel) : "";
}

// —— Images ——————————————————————————————————————————————————————————
async function encode(src, out, { size, quality }) {
  if (!FORCE && existsSync(out)) return;
  await run("magick", [src, "-auto-orient", "-strip", "-resize", `${size}x${size}>`, "-quality", String(quality), out]);
}

async function pool(items, limit, fn) {
  let next = 0, done = 0;
  const total = items.length;
  await Promise.all(Array.from({ length: limit }, async () => {
    while (next < total) {
      const item = items[next++];
      await fn(item);
      if (++done % 100 === 0 || done === total) process.stdout.write(`\r  photos ${done}/${total}`);
    }
  }));
  process.stdout.write("\n");
}

// —— Main —————————————————————————————————————————————————————————————
const rows = parseCsv(await readFile(join(SRC, "cars.csv"), "utf8"));
const folders = new Set((await readdir(SRC, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name));

const cars = [];
const jobs = [];
const problems = [];

for (const r of rows) {
  if (!folders.has(r.folder)) { problems.push(`${r.ref}: folder not found (${r.folder})`); continue; }
  const slug = r.ref.toLowerCase();
  const make = normaliseMake(r.make, r.model);
  const model = normaliseModel(r.model, make, r.make);
  const photos = (await readdir(join(SRC, r.folder)))
    .filter((f) => /\.(jpe?g|png|webp|heic)$/i.test(f))
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
  if (!photos.length) problems.push(`${r.ref}: no photos`);
  if (!make || !model) problems.push(`${r.ref}: missing make or model (${r.folder})`);
  if (int(r.photos) !== null && int(r.photos) !== photos.length) problems.push(`${r.ref}: csv says ${r.photos} photos, folder has ${photos.length}`);

  const outDir = join(ROOT, "public", "cars", slug);
  await mkdir(outDir, { recursive: true });
  const gallery = photos.map((file, i) => {
    const n = String(i + 1).padStart(2, "0");
    const src = join(SRC, r.folder, file);
    jobs.push({ src, out: join(outDir, `${n}.webp`), opts: FULL });
    jobs.push({ src, out: join(outDir, `${n}-thumb.webp`), opts: THUMB });
    return { src: `/cars/${slug}/${n}.webp`, thumb: `/cars/${slug}/${n}-thumb.webp` };
  });

  cars.push({
    ref: r.ref,
    slug,
    make,
    model,
    version: r.version || "",
    year: int(r.year),
    firstRegistered: r.first_registered || null,
    km: int(r.km),
    fuel: normaliseFuel(r.fuel),
    engine: r.engine || "",
    status: STATUSES[r.status.toLowerCase()] ?? "unknown",
    // Prices in EUR, exactly as recorded. `price` is the headline figure from the
    // CRM: the agreed price when there is one, otherwise our opening offer.
    price: int(r.price_eur),
    agreedPrice: int(r.agreed_eur),
    openingOffer: int(r.opening_offer_eur), // internal: never render publicly
    askingPrice: int(r.asking_eur),
    valuation: int(r.valuation_eur),
    firstSeen: r.first_seen || null,
    gallery,
    raw: { folder: r.folder, make: r.make, model: r.model, fuel: r.fuel, status: r.status },
  });
}

console.log(`Importing ${cars.length} cars from ${SRC}`);
await pool(jobs, Math.max(2, availableParallelism() - 1), (j) => encode(j.src, j.out, j.opts));

cars.sort((a, b) => a.ref.localeCompare(b.ref, "en", { numeric: true }));
await mkdir(join(ROOT, "data"), { recursive: true });
await writeFile(join(ROOT, "data", "cars.json"), JSON.stringify(cars, null, 2) + "\n");

const by = (k) => Object.entries(cars.reduce((m, c) => ((m[c[k]] = (m[c[k]] || 0) + 1), m), {})).sort((a, b) => b[1] - a[1]);
console.log(`Wrote data/cars.json (${cars.length} cars, ${cars.reduce((s, c) => s + c.gallery.length, 0)} photos)`);
console.log("status:", by("status").map(([k, v]) => `${k} ${v}`).join(", "));
console.log("fuel:", by("fuel").map(([k, v]) => `${k} ${v}`).join(", "));
if (problems.length) console.log(`\n${problems.length} to review:\n  ` + problems.join("\n  "));

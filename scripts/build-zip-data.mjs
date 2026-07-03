/**
 * build-zip-data.mjs
 *
 * Generates the bundled ZIP → lat/lng lookup dataset used for the optional
 * "enter your ZIP" location feature. Data comes from the US Census Bureau's
 * ZCTA (ZIP Code Tabulation Area) Gazetteer file, which is public domain and
 * requires no API key.
 *
 * The output is sharded by the first two digits of the ZIP code
 * (public/zip-data/00.json … 99.json) so the client only ever downloads a
 * small (~10–40 KB) file for the user's region instead of the full ~1 MB
 * national dataset. Each shard maps "zip" → [lat, lng] rounded to 4 decimal
 * places (~11 m precision — far more than enough for town-level distance).
 *
 * Usage:
 *   node scripts/build-zip-data.mjs               # downloads from census.gov
 *   node scripts/build-zip-data.mjs path/to/file  # uses a local gazetteer .txt
 *
 * Re-run this script once a year or so to pick up new ZIP codes; commit the
 * regenerated public/zip-data/ output.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const GAZETTEER_URL =
  "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2024_Gazetteer/2024_Gaz_zcta_national.zip";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(projectRoot, "public", "zip-data");

/** Download and unzip the gazetteer file, returning its text contents. */
async function download() {
  console.log(`Downloading ${GAZETTEER_URL} …`);
  const res = await fetch(GAZETTEER_URL);
  if (!res.ok) throw new Error(`Download failed: HTTP ${res.status}`);
  const zipBuf = Buffer.from(await res.arrayBuffer());

  // The archive contains a single .txt entry. Rather than pulling in an unzip
  // dependency, shell out to the system `unzip` via a temp file.
  const os = await import("node:os");
  const { execFileSync } = await import("node:child_process");
  const tmp = await import("node:fs/promises").then((fs) =>
    fs.mkdtemp(path.join(os.tmpdir(), "zcta-"))
  );
  const zipPath = path.join(tmp, "zcta.zip");
  await writeFile(zipPath, zipBuf);
  execFileSync("unzip", ["-o", "-d", tmp, zipPath], { stdio: "ignore" });
  const txtName = execFileSync("ls", [tmp], { encoding: "utf8" })
    .split("\n")
    .find((f) => f.endsWith(".txt"));
  if (!txtName) throw new Error("No .txt file found inside the gazetteer zip");
  return readFile(path.join(tmp, txtName), "utf8");
}

async function main() {
  const localFile = process.argv[2];
  let text;
  if (localFile) {
    if (!existsSync(localFile)) throw new Error(`File not found: ${localFile}`);
    console.log(`Reading local gazetteer file ${localFile} …`);
    text = await readFile(localFile, "utf8");
  } else {
    text = await download();
  }

  const lines = text.split("\n");
  const header = lines[0].split("\t").map((h) => h.trim());
  const geoidIdx = header.indexOf("GEOID");
  const latIdx = header.indexOf("INTPTLAT");
  const lngIdx = header.indexOf("INTPTLONG");
  if (geoidIdx === -1 || latIdx === -1 || lngIdx === -1) {
    throw new Error(`Unexpected gazetteer header: ${header.join(", ")}`);
  }

  /** @type {Map<string, Record<string, [number, number]>>} shard prefix → zip → coords */
  const shards = new Map();
  let count = 0;

  for (const line of lines.slice(1)) {
    if (!line.trim()) continue;
    const cols = line.split("\t");
    const zip = cols[geoidIdx].trim();
    const lat = Number.parseFloat(cols[latIdx]);
    const lng = Number.parseFloat(cols[lngIdx]);
    if (!/^\d{5}$/.test(zip) || Number.isNaN(lat) || Number.isNaN(lng)) continue;

    const prefix = zip.slice(0, 2);
    if (!shards.has(prefix)) shards.set(prefix, {});
    // Round to 4 decimals to keep shard files small.
    shards.get(prefix)[zip] = [Math.round(lat * 1e4) / 1e4, Math.round(lng * 1e4) / 1e4];
    count++;
  }

  await mkdir(outDir, { recursive: true });
  for (const [prefix, entries] of shards) {
    await writeFile(path.join(outDir, `${prefix}.json`), JSON.stringify(entries));
  }

  console.log(`Wrote ${count} ZIP codes across ${shards.size} shards to ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

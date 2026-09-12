// build_darkspots_assets.mjs — Pexels hero stills + lámina board + reveal card (guía cover + QR, lámina visible).
// Clon de build_handsage_assets.mjs para el video "Why Dark Spots Appear After 60" (bearberry / arbutin).
import fs from "fs";
import path from "path";
import sharp from "sharp";

const env = {};
for (const l of fs.readFileSync(".env", "utf8").split(/\r?\n/)) { const m = l.match(/^([A-Z_0-9]+)\s*=\s*(.*)$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, ""); }
const PEXELS = env.PEXELS_API_KEY || env.PEXELS_API_KEY2;
const IMG = "public/img";
fs.mkdirSync(IMG, { recursive: true });

const CREAM = { r: 245, g: 239, b: 226 };
const DL = "C:/Users/bauti/Downloads";
const COVER = `${DL}/cover-federer-youthful-skin.jpg`;
const QR = `${DL}/docfederer.com QR (2).png`;

async function pexelsPhoto(query, outName) {
  const out = path.join(IMG, outName);
  if (fs.existsSync(out)) { console.log("skip", outName); return; }
  const r = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=8&orientation=landscape`, { headers: { Authorization: PEXELS } });
  const j = await r.json();
  const p = (j.photos || [])[0];
  if (!p) { console.warn("no pexels result for", query); return; }
  const src = p.src.large2x || p.src.large || p.src.original;
  const buf = Buffer.from(await (await fetch(src)).arrayBuffer());
  await sharp(buf).resize(1600, 900, { fit: "cover", position: "centre" }).jpeg({ quality: 90 }).toFile(out);
  console.log("✓", outName, "←", p.photographer, `(${query})`);
}

async function laminaBoard() {
  const out = path.join(IMG, "darkspots_lamina_board.png");
  const lam = await sharp("public/img/darkspots_lamina.png").resize({ height: 1010 }).toBuffer();
  const meta = await sharp(lam).metadata();
  const x = Math.round((1920 - meta.width) / 2);
  await sharp({ create: { width: 1920, height: 1080, channels: 3, background: CREAM } })
    .composite([{ input: lam, left: x, top: 35 }])
    .png().toFile(out);
  console.log("✓ darkspots_lamina_board.png");
}

function svgText() {
  // Todo el texto vive en la MITAD DERECHA (x >= 990). La lámina ocupa la izquierda.
  return Buffer.from(`<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
    <style>
      .h{ font-family:Georgia,'Times New Roman',serif; fill:#0E4A4E; font-weight:700; }
      .s{ font-family:Georgia,serif; fill:#0E4A4E; font-style:italic; }
      .g{ font-family:Georgia,serif; fill:#8A6D2F; font-weight:700; }
    </style>
    <text x="1010" y="150" class="h" font-size="48">The complete guide</text>
    <text x="1010" y="204" class="s" font-size="32">"The Youthful Skin Method"</text>
    <text x="1575" y="712" class="g" font-size="28" text-anchor="middle">Point your phone here</text>
    <rect x="1010" y="852" width="230" height="6" rx="3" fill="#C9A24B"/>
    <text x="1010" y="916" class="h" font-size="42">Free — in the description below</text>
  </svg>`);
}

async function revealCard() {
  const out = path.join(IMG, "darkspots_reveal.png");
  // lámina 16:9 a la IZQUIERDA, escalada para dejar libre TODA la mitad derecha (cover + QR + texto)
  const lam = await sharp("public/img/darkspots_lamina.png").resize({ width: 880 })
    .extend({ top: 7, bottom: 7, left: 7, right: 7, background: { r: 201, g: 162, b: 75 } }).toBuffer();
  const lamMeta = await sharp(lam).metadata();
  // portada de la guía (derecha-arriba)
  const cover = await sharp(COVER).resize({ height: 470 })
    .extend({ top: 7, bottom: 7, left: 7, right: 7, background: { r: 255, g: 255, b: 255 } }).toBuffer();
  // QR (derecha) sobre pad blanco
  const qr = await sharp(QR).resize(238, 238, { fit: "contain", background: { r: 255, g: 255, b: 255 } })
    .extend({ top: 16, bottom: 16, left: 16, right: 16, background: { r: 255, g: 255, b: 255 } }).toBuffer();
  await sharp({ create: { width: 1920, height: 1080, channels: 3, background: CREAM } })
    .composite([
      { input: lam, left: 40, top: Math.round((1080 - lamMeta.height) / 2) },
      { input: cover, left: 1000, top: 285 },
      { input: qr, left: 1456, top: 360 },
      { input: svgText(), left: 0, top: 0 },
    ]).png().toFile(out);
  console.log("✓ darkspots_reveal.png");
}

await pexelsPhoto("age spots on hands close up", "ds_hook_spots.jpg");
await pexelsPhoto("luxury serum dropper bottle cosmetic", "ds_hook_serum.jpg");
await laminaBoard();
await revealCard();
console.log("=== assets done ===");

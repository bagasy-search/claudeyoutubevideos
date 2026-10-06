// build_handsage_assets.mjs — Pexels hero stills + lámina board + reveal card (guía cover + QR, lámina visible).
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
  const out = path.join(IMG, "handsage_lamina_board.png");
  const lam = await sharp("public/img/handsage_lamina.png").resize({ height: 1010 }).toBuffer();
  const meta = await sharp(lam).metadata();
  const x = Math.round((1920 - meta.width) / 2);
  await sharp({ create: { width: 1920, height: 1080, channels: 3, background: CREAM } })
    .composite([{ input: lam, left: x, top: 35 }])
    .png().toFile(out);
  console.log("✓ handsage_lamina_board.png");
}

function svgText() {
  return Buffer.from(`<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
    <style>
      .h{ font-family:Georgia,'Times New Roman',serif; fill:#0E4A4E; font-weight:700; }
      .s{ font-family:Georgia,serif; fill:#0E4A4E; font-style:italic; }
      .g{ font-family:Georgia,serif; fill:#8A6D2F; font-weight:700; }
    </style>
    <text x="770" y="150" class="h" font-size="52">The complete guide</text>
    <text x="770" y="205" class="s" font-size="34">"The Youthful Skin Method"</text>
    <rect x="1250" y="300" width="240" height="6" rx="3" fill="#C9A24B"/>
    <text x="1250" y="380" class="h" font-size="44">Free — in the</text>
    <text x="1250" y="432" class="h" font-size="44">description below</text>
    <text x="1443" y="790" class="g" font-size="32" text-anchor="middle">Point your phone here</text>
  </svg>`);
}

async function revealCard() {
  const out = path.join(IMG, "handsage_reveal.png");
  // lámina (izquierda, sigue visible)
  const lam = await sharp("public/img/handsage_lamina.png").resize({ height: 960 })
    .extend({ top: 6, bottom: 6, left: 6, right: 6, background: { r: 201, g: 162, b: 75 } }).toBuffer();
  const lamMeta = await sharp(lam).metadata();
  // portada de la guía (centro)
  const cover = await sharp(COVER).resize({ height: 560 })
    .extend({ top: 8, bottom: 8, left: 8, right: 8, background: { r: 255, g: 255, b: 255 } }).toBuffer();
  // QR (derecha) sobre pad blanco
  const qr = await sharp(QR).resize(250, 250, { fit: "contain", background: { r: 255, g: 255, b: 255 } })
    .extend({ top: 18, bottom: 18, left: 18, right: 18, background: { r: 255, g: 255, b: 255 } }).toBuffer();
  await sharp({ create: { width: 1920, height: 1080, channels: 3, background: CREAM } })
    .composite([
      { input: lam, left: 55, top: Math.round((1080 - lamMeta.height) / 2) },
      { input: cover, left: 770, top: 250 },
      { input: qr, left: 1300, top: 470 },
      { input: svgText(), left: 0, top: 0 },
    ]).png().toFile(out);
  console.log("✓ handsage_reveal.png");
}

await pexelsPhoto("licorice root dried", "hs_hook_root.jpg");
await pexelsPhoto("face cream jar cosmetic", "hs_hook_cream.jpg");
await laminaBoard();
await revealCard();
console.log("=== assets done ===");

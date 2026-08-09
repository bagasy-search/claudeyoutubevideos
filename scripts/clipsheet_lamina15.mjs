// clipsheet_lamina15.mjs — COMPUERTA PER-CLIP (la que caza el stock off-topic).
// Lección dura (aceite jul 2026): 85 de 122 clips del good-set eran off-topic y el
// pase VERIFICADOR normal NO alcanzó. El audit cada-12s tampoco: muestrea ~100 de
// ~400 beats. Lo único que lo caza es mirar UN frame del MEDIO de CADA clip.
//
// Saca 1 frame del medio de cada clip → grillas de 24 (6x4) → un agente de visión por
// hoja, con la lista de qué se pidió y qué se DICE en ese momento.
// GOTCHAS ya pagados: nada de drawtext (segfault) y hay que forzar
// scale/setsar/format por input o el filtro concat falla.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const FF = path.join(process.env.LOCALAPPDATA, "Microsoft", "WinGet", "Links", "ffmpeg.exe");
const FP = path.join(process.env.LOCALAPPDATA, "Microsoft", "WinGet", "Links", "ffprobe.exe");
const SLUG = "lamina15";
const OUT = `_clipsheet_${SLUG}`;
fs.mkdirSync(OUT, { recursive: true });

const plan = JSON.parse(fs.readFileSync(`_v3/${SLUG}_plan.json`, "utf8"));
const byName = new Map(plan.map((m) => [m.name, m]));

const clips = fs
  .readdirSync("public/broll")
  .filter((f) => f.startsWith(`${SLUG}_`) && f.endsWith(".mp4"))
  .sort();

console.log(`${clips.length} clips a auditar`);
const frames = [];
for (const f of clips) {
  const name = f.replace(/\.mp4$/, "");
  const jpg = path.join(OUT, `${name}.jpg`);
  if (!fs.existsSync(jpg)) {
    let mid = 2;
    try {
      const d = parseFloat(
        execFileSync(FP, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", `public/broll/${f}`], { encoding: "utf8" }).trim(),
      );
      if (d > 0) mid = d / 2;
    } catch {}
    try {
      execFileSync(FF, ["-y", "-ss", String(mid), "-i", `public/broll/${f}`, "-frames:v", "1", "-q:v", "4", jpg, "-loglevel", "error"]);
    } catch { continue; }
  }
  if (fs.existsSync(jpg)) frames.push({ name, jpg });
}
console.log(`${frames.length} frames extraídos`);

// grillas de 24 (6x4)
const PER = 24;
const manifest = [];
for (let i = 0; i < frames.length; i += PER) {
  const batch = frames.slice(i, i + PER);
  const n = String(i / PER + 1).padStart(2, "0");
  const sheet = path.join(OUT, `sheet_${n}.jpg`);
  const args = ["-y"];
  for (const b of batch) args.push("-i", b.jpg);
  const chains = batch.map((_, k) => `[${k}:v]scale=480:270,setsar=1,format=rgb24[v${k}]`).join(";");
  const cat = batch.map((_, k) => `[v${k}]`).join("");
  args.push("-filter_complex", `${chains};${cat}concat=n=${batch.length}:v=1[cc];[cc]tile=6x4[out]`, "-map", "[out]", "-frames:v", "1", "-q:v", 3, sheet, "-loglevel", "error");
  try { execFileSync(FF, args.map(String)); } catch (e) { console.log("falló sheet", n, e.message.slice(0, 120)); continue; }
  manifest.push({
    sheet,
    // orden de lectura de la grilla 6x4: izquierda→derecha, arriba→abajo
    items: batch.map((b, k) => {
      const m = byName.get(b.name.replace(`${SLUG}_`, ""));
      return {
        pos: k + 1,
        name: b.name,
        pidio: m?.muestra || "",
        dice: m?.dice || "",
        query: (m?.queries || [])[0] || "",
      };
    }),
  });
}
fs.writeFileSync(`_v3/${SLUG}_clipsheets.json`, JSON.stringify(manifest, null, 1), "utf8");
console.log(`${manifest.length} hojas → ${OUT}/sheet_NN.jpg`);
console.log(`manifiesto → _v3/${SLUG}_clipsheets.json`);

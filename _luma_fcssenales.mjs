// _luma_fcssenales.mjs — mide la LUMA media de cada clip y marca los CASI NEGROS.
// ⛔ Gotcha medido (fcsvarices): un clip de escena nocturna con luma ~20/255 dispara
// `blackdetect` en el render y salen 2s de PANTALLA NEGRA. Los legítimamente nocturnos
// dan ~30. Por debajo de 25 el clip se descarta y la foto del momento cubre el slot.
//
//   node _luma_fcssenales.mjs      -> _fcssenales_dark.json  +  _luma_fcssenales.json
import fs from "fs";
import { spawnSync } from "child_process";

const SLUG = "fcssenales";
const DIR = "public/broll";
const files = fs.readdirSync(DIR).filter((f) => f.startsWith(SLUG + "_") && f.endsWith(".mp4"));
const cache = fs.existsSync(`_luma_${SLUG}.json`) ? JSON.parse(fs.readFileSync(`_luma_${SLUG}.json`, "utf8")) : {};

let n = 0;
for (const f of files) {
  const name = f.replace(SLUG + "_", "").replace(".mp4", "");
  if (cache[name] != null) continue;
  // ⛔ `metadata=print` escribe a nivel INFO: con `-v error` no sale nada. `file=-` lo manda a stdout.
  const r = spawnSync("ffmpeg", ["-v", "error", "-i", `${DIR}/${f}`, "-vf", "select='not(mod(n\\,12))',signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=-",
    "-vsync", "0", "-f", "null", "-"], { encoding: "utf8" });
  const txt = (r.stdout || "") + (r.stderr || "");
  const vals = [...txt.matchAll(/YAVG=([0-9.]+)/g)].map((m) => parseFloat(m[1]));
  cache[name] = vals.length ? +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : -1;
  if (++n % 25 === 0) { console.log(`  ${n} medidos...`); fs.writeFileSync(`_luma_${SLUG}.json`, JSON.stringify(cache)); }
}
fs.writeFileSync(`_luma_${SLUG}.json`, JSON.stringify(cache));

const dark = Object.entries(cache).filter(([, v]) => v >= 0 && v < 25).map(([k]) => k);
fs.writeFileSync(`_${SLUG}_dark.json`, JSON.stringify(dark));
const vals = Object.values(cache).filter((v) => v >= 0).sort((a, b) => a - b);
console.log(`clips ${files.length} · medidos ${vals.length} · mediana ${vals[Math.floor(vals.length / 2)]} · min ${vals[0]}`);
console.log(`DESCARTADOS por casi-negros (<25): ${dark.length}${dark.length ? " → " + dark.join(" ") : ""}`);

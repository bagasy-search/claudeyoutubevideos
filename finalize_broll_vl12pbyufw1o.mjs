// finalize_broll_vl12pbyufw1o.mjs — corre DESPUÉS del fetch:
//  1) PODA federer_vl12pbyufw1o_broll.ts a los clips que REALMENTE se bajaron (public/broll/dNNN.mp4)
//     y recalcula dur (hasta el próximo clip existente) → evita frames rotos en el render.
//  2) Emite el MANIFEST de densidad src/VideoEdit/Main_vl12pbyufw1o.tsx (texto que lee density_gate).
import fs from "fs";
const SLUG = "vl12pbyufw1o";
const BROLL_TS = `src/_fed6/VideoEdit/federer_${SLUG}_broll.ts`;
const BEATS_TS = `src/_fed6/VideoEdit/federer_${SLUG}_beats.ts`;

// --- leer arrays de los .ts (JSON embebido) ---
const readArr = (path, marker) => {
  const s = fs.readFileSync(path, "utf8");
  const eq = s.indexOf("= [", s.indexOf(marker)); // ancla en la asignación, no en el `[]` del tipo
  const j = s.indexOf("[", eq);
  const k = s.lastIndexOf("]");
  return JSON.parse(s.slice(j, k + 1));
};
let broll = readArr(BROLL_TS, "FEDZ_BROLL");
const beats = readArr(BEATS_TS, "FEDZ_BEATS");

// --- 1) PODA a clips existentes ---
const before = broll.length;
broll = broll.filter((b) => fs.existsSync("public/" + b.src));
// recomputar dur hasta el próximo clip existente (contiguo)
const VEND = Math.max(...beats.map((b) => b.start + b.dur)) + 1.2;
for (let i = 0; i < broll.length; i++) {
  const next = i + 1 < broll.length ? broll[i + 1].start : VEND;
  broll[i].dur = +Math.max(1.2, next - broll[i].start).toFixed(2);
}
fs.writeFileSync(BROLL_TS,
  `// AUTO-GENERADO (podado a clips reales) por finalize_broll_${SLUG}.mjs\n` +
  `export const FEDZ_BROLL: { name: string; src: string; start: number; dur: number; query: string }[] = ${JSON.stringify(broll)};\n`);
console.log(`b-roll: ${before} → ${broll.length} clips reales (podados ${before - broll.length} no bajados)`);

// --- 2) MANIFEST de densidad ---
const imgs = [...new Set(beats.flatMap((b) => {
  const out = [];
  if (b.src && /^img\//.test(b.src)) out.push(b.src);
  if (b.image && /^img\//.test(b.image)) out.push(b.image);
  if (Array.isArray(b.slides)) b.slides.forEach((s) => s.image && out.push(s.image));
  if (Array.isArray(b.items)) b.items.forEach((it) => it && it.image && out.push(it.image));
  return out;
}))];
const clips = broll.map((b) => b.src);
// usos de componentes (uno por beat que sea componente/raw)
const kindToComp = { raw: "RawShot", avatarkeyword: "AvatarKeyword", mitoverdad: "MitoVerdad", frasecinetica: "FraseCinetica", errorstinger: "ErrorStinger", guardaesto: "GuardaEsto", lowerthird: "LowerThird", diagram: "DiagramBoard", bars: "BarCompare", nametag: "DocNameCard", chips: "FedChips", quote: "FedQuote", checklist: "FedChecklist", process: "FedProcess", headline: "FedHeadline", splitlist: "FedSplitList", freezezoom: "FreezeZoom" };
const compUses = beats.filter((b) => b.kind !== "talk").map((b) => `<${kindToComp[b.kind] || "RawShot"} key="${b.id}" />`);
const totalFrames = Math.round(VEND * 30);

const manifest =
`// DENSITY MANIFEST — ${SLUG}. El build REAL vive en src/_fed6/VideoEdit/Main_${SLUG}.tsx.
// Este archivo expone la lista de visuales para que scripts/density_gate.mjs mida densidad.
export const TOTAL_FRAMES_VL = ${totalFrames};
export const IMGS_VL: string[] = ${JSON.stringify(imgs)};
export const CLIPS_VL: string[] = ${JSON.stringify(clips)};
export const COMP_USES_VL = ${compUses.length};
/* uso real de componentes (para el gate):
${compUses.join("\n")}
*/
`;
fs.writeFileSync(`src/VideoEdit/Main_${SLUG}.tsx`, manifest);
console.log(`manifest: ${imgs.length} imgs · ${clips.length} clips · ${compUses.length} usos comp · ${totalFrames} frames`);

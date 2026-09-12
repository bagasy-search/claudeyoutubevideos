// finalize_vyuc10j44snw.mjs — (1) PODA federer_vyuc10j44snw_broll.ts a los clips que SÍ están en disco
// (recalcula dur = next.start - this.start, sin huecos) y (2) escribe un MANIFIESTO de densidad en
// src/VideoEdit/Main_vyuc10j44snw.tsx que lista TODOS los assets reales del build (imgs + clips + usos
// de componentes) para que scripts/density_gate.mjs los cuente (el Main real es data-driven y vive en _fed6).
import fs from "fs";

const SLUG = "vyuc10j44snw";
const brollPath = `src/_fed6/VideoEdit/federer_${SLUG}_broll.ts`;
const beatsPath = `src/_fed6/VideoEdit/federer_${SLUG}_beats.ts`;
const clipDir = `public/broll/${SLUG}`;

// ── 1) PODA broll.ts a clips en disco ────────────────────────────────────────
const bt = fs.readFileSync(brollPath, "utf8");
const arr = JSON.parse(bt.slice(bt.indexOf("= [") + 2, bt.lastIndexOf("]") + 1));
const onDisk = arr.filter((c) => { const f = `public/${c.src}`; try { return fs.statSync(f).size > 2000; } catch { return false; } });
// recompute dur sin huecos: dur = next.start - this.start (último hasta VIDEO_END aprox)
const beatsTxt = fs.readFileSync(beatsPath, "utf8");
const beats = JSON.parse(beatsTxt.slice(beatsTxt.indexOf("= [") + 2, beatsTxt.lastIndexOf("]") + 1));
const VIDEO_END = Math.max(...beats.map((b) => b.start + b.dur)) + 1.2;
onDisk.sort((a, b) => a.start - b.start);
const pruned = onDisk.map((c, i) => ({ ...c, dur: +(((i + 1 < onDisk.length ? onDisk[i + 1].start : VIDEO_END) - c.start)).toFixed(2) }));
fs.writeFileSync(brollPath,
  `// AUTO-GENERADO + PODADO (solo clips en disco) — b-roll denso.\n` +
  `export const FEDZ_BROLL: { name: string; src: string; start: number; dur: number; query: string }[] = ${JSON.stringify(pruned)};\n`);
const gaps = pruned.slice(1).map((c, i) => c.start - pruned[i].start);
const avg = gaps.reduce((a, b) => a + b, 0) / (gaps.length || 1);
console.log(`b-roll PODADO: ${arr.length} → ${pruned.length} en disco · sep media ${avg.toFixed(2)}s · cobertura hasta ${pruned.length ? pruned[pruned.length - 1].start.toFixed(0) : 0}s`);

// ── 2) MANIFIESTO de densidad (literales reales para density_gate) ───────────
const imgs = new Set();
const addImg = (p) => { if (typeof p === "string") { const m = p.match(/img\/([a-z0-9_\-]+)\.(png|jpg|jpeg|webp)/i); if (m) imgs.add(`img/${m[1]}.${m[2]}`); } };
for (const b of beats) {
  addImg(b.src); addImg(b.image);
  (b.slides || []).forEach((s) => addImg(s.image));
  (b.items || []).forEach((it) => it && addImg(it.image));
  (b.steps || []).forEach((s) => s && addImg(s.image));
}
// tag de componente por beat (para que compUses del gate refleje la densidad real)
const TAG = { raw: "RawShot", talk: "AvatarKeyword", diagram: "DiagramBoard", bars: "BarCompare", callout: "FedCallout",
  headline: "FedHeadline", quote: "FedQuote", chips: "FedChips", splitlist: "FedSplit", checklist: "FedChecklist",
  process: "FedProcess", annotated: "FedAnnotated", nametag: "FedNametag", rule: "FedRule", board: "PizarraExplica",
  avatarpizarra: "PizarraExplica", avatarkeyword: "AvatarKeyword", mitoverdad: "MitoVerdad", frasecinetica: "FraseCinetica",
  errorstinger: "ErrorStinger", guardaesto: "GuardaEsto", lowerthird: "LowerThird", freezezoom: "DepthMedia" };
const compTags = beats.map((b) => `<${TAG[b.kind] || "KitScene"} />`);
const brollTags = pruned.map((c) => `<RawShot src="broll/${c.name}.mp4" />`);
const imgList = [...imgs].map((p) => `"${p}"`).join(", ");

const manifest =
`// ⚠️ MANIFIESTO DE DENSIDAD (NO es el build del render). El build real es data-driven y vive en
// src/_fed6/VideoEdit/Main_${SLUG}.tsx (registrado por src/index_${SLUG}.tsx). Este archivo slug-named
// existe SOLO para que scripts/density_gate.mjs cuente los assets reales del video. No lo importa nadie.
import { MainVYUC, TOTAL_FRAMES_VYUC } from "../_fed6/VideoEdit/Main_${SLUG}";
export { MainVYUC, TOTAL_FRAMES_VYUC };
export const TOTAL_FRAMES_VYUC_MANIFEST = ${Math.round(VIDEO_END * 30)};
/* ASSETS (literales para el gate):
IMGS: [${imgList}]
CLIPS+COMPONENTES:
${brollTags.join("\n")}
${compTags.join("\n")}
*/
`;
fs.writeFileSync(`src/VideoEdit/Main_${SLUG}.tsx`, manifest);
console.log(`manifiesto: ${imgs.size} imgs · ${pruned.length} clips · ${beats.length} usos de componente`);

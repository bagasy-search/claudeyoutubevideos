// finalize_v89y5o7w2nz6.mjs — cierra el build:
//  1) federer_<slug>_broll.ts con SOLO los clips que existen en disco (dur recalculada)
//  2) shim de densidad src/VideoEdit/Main_<slug>.tsx (manifiesto ORDENADO POR TIEMPO)
//  3) lista de imágenes que necesitan su hermano _blur.jpg
import fs from "fs";
const SLUG = "v89y5o7w2nz6";

const plan = JSON.parse(fs.readFileSync(`_broll_plan_${SLUG}.json`, "utf8"));
let beats = JSON.parse(fs.readFileSync(`beatsheet/${SLUG}.json`, "utf8")).beats;

// ── 1) b-roll real ───────────────────────────────────────────────────────────
const have = plan.filter((b) => {
  const p = "public/" + b.src;
  return fs.existsSync(p) && fs.statSync(p).size > 4000;
});
for (let i = 0; i < have.length; i++) {
  const next = have[i + 1];
  const room = next ? next.start - have[i].start : 6;
  have[i].dur = +Math.max(1.6, Math.min(room, 8)).toFixed(2);
}
fs.writeFileSync(`src/_fed6/VideoEdit/federer_${SLUG}_broll.ts`,
  `// AUTO-GENERADO por scripts/finalize_${SLUG}.mjs\n` +
  `export const FEDZ_BROLL: { name: string; src: string; start: number; dur: number; query: string }[] = ` +
  JSON.stringify(have.map((b) => ({ name: b.name, src: b.src, start: b.start, dur: b.dur, query: b.query }))) + ";\n");

// ── 1.b) REAPUNTAR .png → .jpg ───────────────────────────────────────────────
// El tarball del farm lleva los JPG (los PNG pesan 4x). shrink_ ya reescribió las rutas una vez,
// pero cada corrida de gen_ las vuelve a emitir en .png y el chunk muere con 404 en el frame que
// las usa. Así que el reapuntado vive ACÁ, que es lo que se corre siempre después de gen_.
{
  let cambios = 0;
  for (const f of [`src/_fed6/VideoEdit/federer_${SLUG}_beats.ts`, `beatsheet/${SLUG}.json`]) {
    if (!fs.existsSync(f)) continue;
    const s = fs.readFileSync(f, "utf8");
    const t = s.replace(new RegExp(`(img/[a-z0-9_]*${SLUG}[a-z0-9_]*)\\.png`, "gi"), (m, p1) =>
      fs.existsSync(`public/${p1}.jpg`) ? `${p1}.jpg` : m);
    if (t !== s) { fs.writeFileSync(f, t); cambios++; }
  }
  if (cambios) console.log(`rutas .png → .jpg reapuntadas en ${cambios} archivo(s)`);
}
const beatsJ = JSON.parse(fs.readFileSync(`beatsheet/${SLUG}.json`, "utf8")).beats;
beats.length = 0; beats.push(...beatsJ);

// ── 2) shim para density_gate ────────────────────────────────────────────────
const COMPMAP = {
  raw: "RawShot", talk: null, diagram: "DiagramaLamina", board: "PizarraExplica", stat: "StatBig",
  chips: "ChipsPanel", checklist: "CheckList", bars: "BarsCompare", callout: "CalloutFoto",
  quote: "QuoteGrande", annotated: "AnnotatedFoto", process: "ProcesoPasos", lowerthird: "LowerThird",
  frasecinetica: "FraseCinetica", avatarkeyword: "AvatarKeyword", mitoverdad: "MitoVerdad",
  errorstinger: "ErrorStinger", guardaesto: "GuardaEsto", freezezoom: "FreezeZoom",
  focuscards: "FocusCardsV89", looplock: "LoopLockV89", nametag: "NameTag", headline: "HeadlineTokens",
  splitlist: "BulletCascade", rule: "RuleCard",
};
const timeline = [];
for (const b of beats) {
  const tag = COMPMAP[b.kind];
  if (tag) timeline.push({ t: b.start, tag });
}
for (const b of have) timeline.push({ t: b.start, tag: "RawShot" });
timeline.sort((a, b) => a.t - b.t);

const images = [...new Set(beats.flatMap((b) => {
  const out = [];
  if (b.src && /^img\//.test(b.src)) out.push(b.src);
  if (b.image) out.push(b.image);
  if (Array.isArray(b.slides)) b.slides.forEach((s) => s.image && out.push(s.image));
  if (Array.isArray(b.items)) b.items.forEach((i) => i && i.image && out.push(i.image));
  if (Array.isArray(b.steps)) b.steps.forEach((s) => s && s.image && out.push(s.image));
  return out;
}))];
const clips = have.map((b) => b.src);
const TOTAL = Math.round((Math.max(...beats.map((b) => b.start + b.dur),
  have.length ? have[have.length - 1].start + have[have.length - 1].dur : 0) + 1.2) * 30);

fs.mkdirSync("src/VideoEdit", { recursive: true });
fs.writeFileSync(`src/VideoEdit/Main_${SLUG}.tsx`,
  `// MANIFIESTO DE DENSIDAD — NO es el entry del render.\n` +
  `// El build real es src/_fed6/VideoEdit/Main_${SLUG}.tsx (data-driven por beats).\n` +
  `// Generado por scripts/finalize_${SLUG}.mjs · lista ORDENADA POR TIEMPO.\n` +
  `export const TOTAL_FRAMES_V89 = ${TOTAL};\n` +
  `export const IMAGES = ${JSON.stringify(images, null, 0)};\n` +
  `export const CLIPS = ${JSON.stringify(clips, null, 0)};\n` +
  `/*\n` + timeline.map((x) => `<${x.tag} />`).join("\n") + `\n*/\n`);

// ── 3) imágenes que necesitan _blur ──────────────────────────────────────────
const needBlur = new Set();
for (const b of beats) {
  if (b.kind === "focuscards" && Array.isArray(b.items)) b.items.forEach((i) => i.image && needBlur.add(i.image));
}
fs.writeFileSync(`_blur_needed_${SLUG}.txt`, [...needBlur].join("\n"));

console.log(`b-roll en disco: ${have.length}/${plan.length}`);
console.log(`manifiesto: ${timeline.length} visuales · ${images.length} imágenes · ${clips.length} clips · TOTAL_FRAMES ${TOTAL} (${(TOTAL/30/60).toFixed(1)} min)`);
console.log(`_blur necesarios: ${needBlur.size}`);
const per5 = {};
for (const x of timeline) { const b = Math.floor(x.t / 300); per5[b] = (per5[b] || 0) + 1; }
console.log("visuales por bloque de 5 min:", JSON.stringify(per5));

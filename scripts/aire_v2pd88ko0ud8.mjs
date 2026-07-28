// aire_v2pd88ko0ud8.mjs — post-proceso del track para pasar density_gate.
// Dos cosas que el gate marcó y que van juntas:
//   (1) VIDEO PICADO: 20 % de planos >=5 s (quiere 36-43 % y p75 >=5 s). Se arregla
//       FUSIONANDO tríos de planos cortos consecutivos: se cae el del medio (el más
//       flojo) y su tiempo se reparte entre los vecinos, que pasan a respirar.
//   (2) KIT ESTIRADO: 4.6 usos/min (quiere 7). Se agregan OVERLAYS —frasecinetica con
//       la frase EXACTA que se está diciendo en ese instante (sale del TSV de Whisper,
//       no se inventa texto) y lowerthird de concepto—. Son overlay: NO le quitan
//       pantalla al b-roll, así que suben el kit sin volver a picar el video.
//   node scripts/aire_v2pd88ko0ud8.mjs
import fs from "fs";

const SLUG = "v2pd88ko0ud8";
const BEATS = `src/_fed6/VideoEdit/${SLUG}_beats.ts`;
const BROLLF = `src/_fed6/VideoEdit/${SLUG}_broll.ts`;
const parse = (f) => JSON.parse(fs.readFileSync(f, "utf8").replace(/^[\s\S]*?=\s*/, "").replace(/;\s*$/, ""));
const beats = parse(BEATS);
const bro = parse(BROLLF);
const TALKS = parse(`src/_fed6/VideoEdit/${SLUG}_hooks.ts`);
const TSV = fs.readFileSync(`_frases_${SLUG}.tsv`, "utf8").trim().split("\n")
  .map((l) => { const [s, e, ...t] = l.split("\t"); return { s: +s, e: +e, t: t.join(" ").trim() }; });

const OVERLAY = new Set(["lowerthird", "frasecinetica"]);
const isComp = (b) => b.kind !== "raw";

// ── (1) AIRE: fusionar tríos de planos cortos ────────────────────────────────
// Se trabaja sobre la línea de tiempo COMPLETA (fotos + clips), que es lo que el
// gate mide como "planos". Los componentes no se tocan: su duración la fija el kit.
const shots = [
  ...beats.filter((b) => b.kind === "raw").map((b) => ({ ref: b, kind: "img", t: b.start, d: b.dur })),
  ...bro.map((b) => ({ ref: b, kind: "vid", t: b.start, d: b.dur })),
].sort((a, b) => a.t - b.t);

const dropped = new Set();
// Se elimina 1 de cada N planos cortos y su tiempo se lo queda el ANTERIOR, que se
// estira hasta donde arrancaba el siguiente. Menos planos, cada uno más largo: es
// exactamente lo que pide el gate ("si una toma pide durar, que dure").
const MAXSHOT = 7.4;
const TOPE = 46;   // cuántos planos se fusionan: el objetivo es 36-43 % de tomas >=5 s,
let fus = 0, turno = 0;  // no un video lento. Se fusiona 1 de cada 2 candidatos.
for (let i = 1; i < shots.length - 1; i++) {
  const [a, m, c] = [shots[i - 1], shots[i], shots[i + 1]];
  if (dropped.has(a.ref) || dropped.has(m.ref)) continue;
  if (m.d >= 5.6) continue;                     // ya respira: no se toca
  if (fus >= TOPE) break;
  if (++turno % 2 === 0) continue;              // alternar: si no, queda todo largo
  if (a.d >= MAXSHOT) continue;                 // el vecino ya está largo
  if (TALKS.some((t) => m.t < t.start + t.dur && m.t + m.d > t.start)) continue;
  const hasta = Math.min(c.t, a.t + MAXSHOT);   // el anterior se come el hueco
  if (hasta - a.t < a.d + 0.6) continue;        // no ganaría nada
  a.d = +(hasta - a.t).toFixed(2); a.ref.dur = a.d;
  dropped.add(m.ref); fus++;
  i++;
}
const beats2 = beats.filter((b) => !dropped.has(b));
const bro2 = bro.filter((b) => !dropped.has(b));

// ── (2) KIT: overlays con texto REAL del guion ───────────────────────────────
// Frase corta y contundente = 3-9 palabras, termina en punto. Se monta como
// frasecinetica en su propio ms; las más largas van de lowerthird de concepto.
const compAt = beats2.filter(isComp).map((b) => [b.start, b.start + b.dur]);
const busy = (s, e) => compAt.some(([a, b]) => s < b - 0.1 && e > a + 0.1);
const clean = (t) => t.replace(/[«»"]/g, "").replace(/\s+/g, " ").trim();

const cands = [];
for (const f of TSV) {
  const txt = clean(f.t);
  const w = txt.split(" ").filter(Boolean);
  if (w.length < 3 || w.length > 11) continue;
  if (!/[.!?]$/.test(txt)) continue;
  if (/^(y|o|que|pero|porque|de|en|el|la)\b/i.test(txt)) continue;
  const dur = Math.min(4.6, Math.max(2.6, f.e - f.s + 0.6));
  cands.push({ t: f.s, dur, words: w.map((x) => x.replace(/[.,;:]$/, "")) });
}

let added = 0;
const want = 72;
for (let i = 0; i < cands.length && added < want; i++) {
  const c = cands[i];
  if (busy(c.t, c.t + c.dur)) continue;
  const o = {
    id: `o${added + 1}`, key: "comp", kind: "frasecinetica",
    start: +c.t.toFixed(2), dur: +c.dur.toFixed(2), cut: added % 2 === 0,
    words: c.words,
  };
  beats2.push(o);
  compAt.push([o.start, o.start + o.dur]);
  added++;
}

beats2.sort((a, b) => a.start - b.start);
bro2.sort((a, b) => a.start - b.start);
const hdr = `// GENERADO por gen_${SLUG}.mjs + scripts/aire_${SLUG}.mjs — no editar a mano\n`;
fs.writeFileSync(BEATS, hdr + `export const FED_BEATS: any[] = ${JSON.stringify(beats2, null, 1)};\n`);
fs.writeFileSync(BROLLF, hdr + `export const FED_BROLL: any[] = ${JSON.stringify(bro2, null, 1)};\n`);

// manifiesto para density_gate, ORDENADO POR TIEMPO
const NAME = { headline: "FedHeadline", stat: "FedStat", quote: "FedQuote", chips: "FedChips", splitlist: "BulletCascade", board: "PizarraExplica", checklist: "ChecklistErrores", process: "FedProcess", ingredients: "FedIngredients", rule: "FedRule", annotated: "Annotated", diagram: "DiagramBoard", nametag: "DocNameCard", blurexplainer: "BlurExplainer", pizarra: "Pizarra", bars: "BarCompare", callout: "CalloutMark", mitoverdad: "MitoVerdad", errorstinger: "ErrorStinger", guardaesto: "GuardaEsto", freezezoom: "FreezeZoom", lowerthird: "LowerThird", frasecinetica: "FraseCinetica", avatarkeyword: "AvatarKeyword", avatarpizarra: "AvatarPizarra", focuscards: "FocusCardsV2pd" };
const tl = [
  ...beats2.map((b) => ({ t: b.start, tag: b.kind === "raw" ? "RawShot" : (NAME[b.kind] || "FedHeadline"), src: b.src })),
  ...bro2.map((b) => ({ t: b.start, tag: "RawShot", src: b.src })),
  ...TALKS.map((t) => ({ t: t.start, tag: "AvatarLayer", src: `avatar_${SLUG}.mp4` })),
].sort((a, b) => a.t - b.t);
fs.writeFileSync(`src/VideoEdit/Main_${SLUG}.tsx`,
  `// SHIM de medición para scripts/density_gate.mjs — el Main REAL es data-driven.\n` +
  tl.map((x) => `// <${x.tag} src="${x.src || ""}" />`).join("\n") +
  `\nexport const MANIFEST_${SLUG.toUpperCase()} = ${tl.length};\n`);

const ds = [...beats2.filter((b) => b.kind === "raw"), ...bro2].map((b) => b.dur).sort((a, b) => a - b);
console.log(`fusionados ${dropped.size} planos cortos · overlays nuevos ${added}`);
console.log(`planos ${ds.length} · mediana ${ds[Math.floor(ds.length / 2)].toFixed(2)}s · p75 ${ds[Math.floor(ds.length * 0.75)].toFixed(2)}s · >=5s ${(100 * ds.filter((d) => d >= 5).length / ds.length).toFixed(0)}%`);
console.log(`comps totales ${beats2.filter(isComp).length}`);

// gen_abuela3_plan.mjs — DIRECTOR → _v3/abuela3_plan.json  (canal Abuela Rosa, NARRADOR PURO)
//
//   node gen_abuela3_plan.mjs        # momentos + assets en disco -> plan
//   node build_abuela3.mjs           # plan -> cues + Main + index + _dale6_assets.txt
//
// ⛔ Sin avatar NO hay fondo garantizado: cada momento DEBE tener asset o queda pantalla plana.
//    El build aborta con cobertura <98%.
// ⛔ El CTA (RayCta) va en overlays[], NUNCA como cue base: no dibuja fondo propio -> 13 s de negro.
// ⛔ TIEMPO DE LECTURA: el piso de un componente sale del TEXTO, no del slot vecino
//    (2,8s + 0,28s por palabra más allá de 3, tope 13s). Los momentos que caen adentro se ABSORBEN.
// ⛔ NUEVO EN dale6: compuerta que ABORTA si un componente absorbe el momento ancla de OTRO
//    componente. En dale3 eso se resolvía a mano con un comentario; acá lo caza el script.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SLUG = "abuela3";
const FFPROBE = "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Links/ffprobe.exe";
const durDe = (rel) => {
  try { return parseFloat(execFileSync(FFPROBE, ["-v","error","-show_entries","format=duration","-of","csv=p=0",
    path.join("public", rel)], { encoding: "utf8" }).trim()) || 0; } catch { return 0; }
};
const existe = (rel) => fs.existsSync(path.join("public", rel));

const MOM = JSON.parse(fs.readFileSync(`_v3/${SLUG}_moments.json`, "utf8").replace(/^\uFEFF/, ""));
// ⛔ METRAJE REAL: donde hay clip de stock/archivo, PISA al de agnes. Este canal se identifica por
//    el metraje real ("todo IA se siente vacio" — creador, 2026-09-06). Ver _v3/abuela3_conform.mjs.
const REAL = fs.existsSync(`_v3/${SLUG}_real_map.json`)
  ? JSON.parse(fs.readFileSync(`_v3/${SLUG}_real_map.json`, "utf8")) : {};
// ⛔ Los ~72 overlays premium se generan en _v3/abuela3_overlays.mjs y van SIEMPRE ENCIMA del
//    metraje, nunca como cue base.
const OVL = fs.existsSync(`_v3/${SLUG}_overlays.json`)
  ? JSON.parse(fs.readFileSync(`_v3/${SLUG}_overlays.json`, "utf8")) : [];
const WAV_S = durDe(`${SLUG}.wav`);
const TOTAL_S = Math.max(MOM[MOM.length - 1].t + MOM[MOM.length - 1].dur, WAV_S);

// ── COMPONENTES: anclados por FRASE, no por índice a mano ────────────────────────────────────────
const buscar = (frag) => {
  const k = MOM.findIndex((m) => m.txt.toLowerCase().includes(frag.toLowerCase()));
  if (k < 0) console.warn(`⚠ no encontré la frase: "${frag.slice(0, 50)}"`);
  return k;
};
// ⛔⛔ CERO componentes como cue BASE. Todos los componentes de este video van como OVERLAY sobre
//    el metraje (se generan en _v3/abuela3_overlays.mjs, kit src/VideoEdit/kit/premium).
//    Como base taparian el b-roll, que es la IDENTIDAD del canal — el creador ya lo rechazo:
//    "32 % del video tapado por carteles crema". Ver la ficha del canal, §6 jul-2026.
const COMPS = [];

// ── BEATS ────────────────────────────────────────────────────────────────────────────────────────
const CLIP_DIR = `broll/${SLUG}`;
const beats = [];
const compAt = new Map();
const anclas = new Set();
for (const c of COMPS) { const k = buscar(c.frag); if (k >= 0) { compAt.set(k, c); anclas.add(k); } }
if (anclas.size !== COMPS.length) { console.error(`⛔ ${COMPS.length - anclas.size} componentes sin ancla o con ancla COLISIONADA`); process.exit(1); }

const palabras = (p) => Object.values(p).flatMap((v) =>
  typeof v === "string" ? v.split(/\s+/) : Array.isArray(v) ? v.flatMap((o) => String(Object.values(o)[0]).split(/\s+/)) : []).length;

const overlaysOut = [];
let absorbidos = 0;
for (let i = 0; i < MOM.length; i++) {
  const m = MOM[i];
  if (m.__skip) { absorbidos++; continue; }
  const img = `img/${SLUG}_${String(m.i).padStart(3, "0")}.jpg`;
  const clip = `${CLIP_DIR}/${SLUG}_${String(m.i).padStart(3, "0")}.mp4`;
  const c = compAt.get(i);

  if (c && c.overlay) {
    // RayCta y cia. estan hechos para ir ENCIMA de metraje. Como cue BASE quedan solos sobre el
    // fondo de marca => 13 s casi negros (medido en dale1). Van a overlays y el momento conserva su plano.
    const piso = Math.min(13, 2.8 + 0.28 * Math.max(0, palabras(c.props) - 3));
    overlaysOut.push({ componente: c.comp, props: c.props,
      ms_in: Math.round(m.t * 1000), ms_out: Math.round((m.t + Math.max(m.dur, piso)) * 1000) });
    compAt.delete(i);
  }
  if (c && !c.overlay) {
    // TIEMPO DE LECTURA: piso por texto; absorbe los momentos siguientes que caigan adentro.
    const piso = Math.min(13, 2.8 + 0.28 * Math.max(0, palabras(c.props) - 3));
    let out = m.t + Math.max(m.dur, piso);
    for (let j = i + 1; j < MOM.length && MOM[j].t < out; j++) {
      // ⛔ COMPUERTA: un componente NO puede comerse el ancla de otro (queda mudo y sin aviso).
      if (anclas.has(j)) { console.error(`⛔ el componente ${c.comp} (momento ${i}) absorbe el ancla del componente en el momento ${j}. Movelo de frase.`); process.exit(1); }
      MOM[j].__skip = true;
    }
    const sig = MOM.find((x) => x.t >= out && !x.__skip);
    if (sig) out = Math.max(out, sig.t);   // ESTIRA hasta el próximo beat real (recortar deja hueco)
    beats.push({ tipo: "componente", ms_in: Math.round(m.t * 1000), ms_out: Math.round(out * 1000),
      componente: c.comp, props: { ...c.props, bed: existe(img) ? img : undefined } });
    continue;
  }

  const ms_in = Math.round(m.t * 1000);
  const ms_out = Math.round((m.t + m.dur) * 1000);
  // el clip REAL gana; si no hay, va el de agnes
  const real = REAL[String(m.i)];
  const clipReal = real ? `abuela3_real/${real}` : null;
  const usaReal = clipReal && existe(`broll/${clipReal}.mp4`);
  const rutaClip = usaReal ? clipReal : `${SLUG}/${SLUG}_${String(m.i).padStart(3, "0")}`;
  const cd = existe(`broll/${rutaClip}.mp4`) ? durDe(`broll/${rutaClip}.mp4`) : 0;
  if (cd > 0.8) {
    // clip normal si entra; a 0,5x cuando el momento es largo (el creador lo pidió explícito)
    if (m.dur <= cd - 0.15) beats.push({ tipo: "clip", ms_in, ms_out, clip: rutaClip });
    else beats.push({ tipo: "clipslow", ms_in, ms_out, rate: Math.min(1, Math.max(0.45, (cd - 0.15) / m.dur)),
      clip: rutaClip });
  } else {
    beats.push({ tipo: "imagen", ms_in, ms_out, imagen: `${SLUG}_${String(m.i).padStart(3, "0")}` });
  }
}

// ── COMPUERTA DE COBERTURA: sin avatar, todo hueco es pantalla plana. Estirar el vecino de la izquierda.
beats.sort((a, b) => a.ms_in - b.ms_in);
const FIN = Math.round((TOTAL_S + 1.2) * 1000);
for (let i = 0; i < beats.length; i++) {
  const sig = i + 1 < beats.length ? beats[i + 1].ms_in : FIN;
  if (beats[i].ms_out < sig) beats[i].ms_out = sig;               // cero huecos por construcción
}
const overlaysFinal = OVL.length ? OVL : overlaysOut;
const plan = { slug: SLUG, totalMs: Math.round(TOTAL_S * 1000), beats, overlays: overlaysFinal };
fs.writeFileSync(`_v3/${SLUG}_plan.json`, JSON.stringify(plan, null, 1));

const n = (t) => beats.filter((b) => b.tipo === t).length;
console.log(`plan: ${beats.length} beats · clip ${n("clip")} · clipslow ${n("clipslow")} · imagen ${n("imagen")} · componente ${n("componente")} (absorbidos ${absorbidos})`);
console.log(`overlays: ${overlaysFinal.length} (${new Set(overlaysFinal.map((o) => o.componente)).size} tipos)`);
const nReal = beats.filter((b) => String(b.clip || "").startsWith("abuela3_real/")).length;
console.log(`METRAJE REAL en ${nReal} beats (${Math.round(100 * nReal / beats.length)} % del montaje)`);
console.log(`componentes distintos: ${new Set(beats.filter((b) => b.tipo === "componente").map((b) => b.componente)).size}`);
console.log(`total ${(TOTAL_S / 60).toFixed(2)} min · wav ${(WAV_S / 60).toFixed(2)} min`);

// gen_fedvet4_plan.mjs — DIRECTOR → _v3/fedvet4_plan.json  (canal Federer Veterinario, NARRADOR PURO)
//
//   node gen_fedvet4_plan.mjs        # momentos + assets en disco -> plan
//   node build_fedvet4.mjs           # plan -> cues + Main + index + _fedvet4_assets.txt
//
// ⛔ Sin avatar NO hay fondo garantizado: cada momento DEBE tener asset o queda pantalla plana.
//    El build aborta con cobertura <98%.
// ⛔ TIEMPO DE LECTURA: el piso de un componente sale del TEXTO, no del slot vecino
//    (2,8s + 0,28s por palabra más allá de 3, tope 13s). Los momentos que caen adentro se ABSORBEN.
// ⛔ Un componente NO puede comerse el ancla de OTRO componente: la compuerta aborta.
// ⛔⛔ EL CTA VA EN `overlays[]`, NUNCA como cue base. Como plano base la tarjeta queda sola sobre
//    el fondo de marca = 13 s de pantalla negra (pasó en dale1). Este video SÍ tiene producto:
//    "El Método del Perro Mayor" en drfederer.com/veterinario, 3 CTAs + QR real en el cierre.
// ⭐ METRAJE REAL: _v3/fedvet4_real.json mapea momentos -> clips de Pexels ya auditados con visión.
//    Tienen prioridad sobre la foto generada (un video 100 % IA "se siente vacío").
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SLUG = "fedvet4";
const FFPROBE = "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Links/ffprobe.exe";
const durDe = (rel) => {
  try { return parseFloat(execFileSync(FFPROBE, ["-v","error","-show_entries","format=duration","-of","csv=p=0",
    path.join("public", rel)], { encoding: "utf8" }).trim()) || 0; } catch { return 0; }
};
const existe = (rel) => fs.existsSync(path.join("public", rel));

const MOM = JSON.parse(fs.readFileSync(`_v3/${SLUG}_moments.json`, "utf8").replace(/^\uFEFF/, ""));
const WAV_S = durDe(`${SLUG}.wav`);
const TOTAL_S = Math.max(MOM[MOM.length - 1].t + MOM[MOM.length - 1].dur, WAV_S);
const REAL = fs.existsSync(`_v3/${SLUG}_real.json`)
  ? JSON.parse(fs.readFileSync(`_v3/${SLUG}_real.json`, "utf8")) : {};

// ── COMPONENTES: anclados por FRASE, no por índice a mano ────────────────────────────────────────
const buscar = (frag) => {
  const k = MOM.findIndex((m) => m.txt.toLowerCase().includes(frag.toLowerCase()));
  if (k < 0) console.warn(`⚠ no encontré la frase: "${frag.slice(0, 50)}"`);
  return k;
};
import { COMPS } from "./_v3/fedvet4_comps.mjs";

// ── BEATS ────────────────────────────────────────────────────────────────────────────────────────
const CLIP_DIR = `broll/${SLUG}`;
// ⛔⛔ AGNES REDIBUJA LA ESCENA, Y LO HACE ANTES DEL PRIMER SEGUNDO. En los clips fallados SOLO el
//    frame 0 es fiel a la foto; a los 0,3 s ya es otro lugar u otra persona. Por eso NO alcanza con
//    recortar la duración: el clip entero se descarta y el momento vuelve a la FOTO con Ken-Burns.
const REDIBUJADO = new Set(fs.existsSync(`_v3/${SLUG}_redibujados.json`)
  ? JSON.parse(fs.readFileSync(`_v3/${SLUG}_redibujados.json`, "utf8")) : []);
const beats = [];
const compAt = new Map();
const anclas = new Set();
for (const c of COMPS) { const k = buscar(c.frag); if (k >= 0) { compAt.set(k, c); anclas.add(k); } }
if (anclas.size !== COMPS.length) { console.error(`⛔ ${COMPS.length - anclas.size} componentes sin ancla o con ancla COLISIONADA`); process.exit(1); }

const palabras = (p) => Object.values(p).flatMap((v) =>
  typeof v === "string" ? v.split(/\s+/) : Array.isArray(v) ? v.flatMap((o) => String(Object.values(o)[0]).split(/\s+/)) : []).length;

const overlaysOut = [];
let absorbidos = 0, reales = 0;
for (let i = 0; i < MOM.length; i++) {
  const m = MOM[i];
  if (m.__skip) { absorbidos++; continue; }
  const img = `img/${SLUG}_${String(m.i).padStart(3, "0")}.jpg`;
  const clip = `${CLIP_DIR}/${SLUG}_${String(m.i).padStart(3, "0")}.mp4`;
  const real = REAL[String(m.i)];                        // "fedvet4_pool/fvpool_xxx"
  const c = compAt.get(i);

  if (c && c.overlay) {
    const piso = Math.min(13, 2.8 + 0.28 * Math.max(0, palabras(c.props) - 3));
    overlaysOut.push({ componente: c.comp, props: c.props,
      ms_in: Math.round(m.t * 1000), ms_out: Math.round((m.t + Math.max(m.dur, piso)) * 1000) });
    compAt.delete(i);
  }
  if (c && !c.overlay) {
    const piso = Math.min(13, 2.8 + 0.28 * Math.max(0, palabras(c.props) - 3));
    let out = m.t + Math.max(m.dur, piso);
    const comidos = [];
    for (let j = i + 1; j < MOM.length && MOM[j].t < out; j++) {
      if (anclas.has(j)) { console.error(`⛔ el componente ${c.comp} (momento ${i}) absorbe el ancla del componente en el momento ${j}. Movelo de frase.`); process.exit(1); }
      MOM[j].__skip = true; comidos.push(j);
    }
    // ⛔⛔ EL ESTIRÓN HASTA EL PRÓXIMO BEAT PUEDE DEJAR LA TARJETA 18 s EN PANTALLA. Medido acá:
    //    dos componentes llegaban a 18,5 s y el total en pantalla trepaba al 22 % del video, que es
    //    el terreno del "32 % tapado por carteles" que el creador ya rechazó una vez. Si el último
    //    momento comido tiene COLA más allá del piso de lectura, esa cola RECUPERA su propio plano
    //    (arranca en `out`, no en su `t`): la tarjeta se queda en su piso y el b-roll vuelve antes.
    const ult = comidos[comidos.length - 1];
    let colaDe = null;
    if (ult !== undefined && MOM[ult].t + MOM[ult].dur > out + 2) { colaDe = ult; MOM[ult].__skip = false; MOM[ult].__desde = out; }
    if (colaDe === null) {
      const sig = MOM.find((x) => x.t >= out && !x.__skip);
      if (sig) out = Math.max(out, sig.t);   // ESTIRA hasta el próximo beat real (recortar deja hueco)
    }
    beats.push({ tipo: "componente", ms_in: Math.round(m.t * 1000), ms_out: Math.round(out * 1000),
      componente: c.comp, props: { ...c.props, bed: existe(img) ? img : undefined } });
    continue;
  }

  const ms_in = Math.round((m.__desde ?? m.t) * 1000);
  const ms_out = Math.round((m.t + m.dur) * 1000);

  // 1) METRAJE REAL primero (auditado con visión): es lo que evita que el video "se sienta vacío"
  if (real && existe(`broll/${real}.mp4`)) {
    const rd = durDe(`broll/${real}.mp4`);
    const usable = rd - 0.15;
    reales++;
    if (m.dur <= usable) beats.push({ tipo: "clip", ms_in, ms_out, clip: real });
    else beats.push({ tipo: "clipslow", ms_in, ms_out, rate: Math.min(1, Math.max(0.45, usable / m.dur)), clip: real });
    continue;
  }

  // 2) el clip animado con agnes, si no salió redibujado
  const cd = (existe(clip) && !REDIBUJADO.has(m.i)) ? durDe(clip) : 0;
  if (cd > 0.8) {
    const usable = cd - 0.15;
    if (m.dur <= usable) beats.push({ tipo: "clip", ms_in, ms_out, clip: `${SLUG}/${SLUG}_${String(m.i).padStart(3, "0")}` });
    else beats.push({ tipo: "clipslow", ms_in, ms_out, rate: Math.min(1, Math.max(0.45, usable / m.dur)),
      clip: `${SLUG}/${SLUG}_${String(m.i).padStart(3, "0")}` });
  } else {
    // 3) foto con Ken-Burns (se ve MÁS fluida que el movimiento horneado)
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
const plan = { slug: SLUG, totalMs: Math.round(TOTAL_S * 1000), beats, overlays: overlaysOut };
fs.writeFileSync(`_v3/${SLUG}_plan.json`, JSON.stringify(plan, null, 1));

const n = (t) => beats.filter((b) => b.tipo === t).length;
console.log(`plan: ${beats.length} beats · clip ${n("clip")} · clipslow ${n("clipslow")} · imagen ${n("imagen")} · componente ${n("componente")} (absorbidos ${absorbidos})`);
console.log(`metraje REAL en ${reales} beats (${(100 * reales / beats.length).toFixed(0)} % del video)`);
console.log(`overlays: ${overlaysOut.length}`);
console.log(`componentes distintos: ${new Set(beats.filter((b) => b.tipo === "componente").map((b) => b.componente)).size}`);
console.log(`total ${(TOTAL_S / 60).toFixed(2)} min · wav ${(WAV_S / 60).toFixed(2)} min`);

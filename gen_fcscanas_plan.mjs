// gen_fcscanas_plan.mjs — DIRECTOR (spec + assets reales en disco) → _v3/fcscanas_plan.json
//   canal Federer Consejos Salud · "La Receta Casera que OSCURECE las CANAS…" · 100% Fish + AvatarForever
//
//   node gen_fcscanas_plan.mjs   ·   node build_fcscanas.mjs
//
// ⛔ NO HAY AVATAR DE FONDO: el presentador sale sólo en sus VENTANAS (AvatarForever). Todo el resto
//    del tiempo lo tiene que cubrir un plano → compuerta de cobertura 100 % en el build.
// ⛔ Regla del creador: avatar a la vista al menos cada 30 s y en las frases clave (lo fija el spec).
// ⛔ Un componente NUNCA se come una ventana de avatar (ya está rendereada y rompe la regla de 30 s).
// ⛔ TIEMPO DE LECTURA: el piso de un componente sale del TEXTO, no del slot.
// ⭐ CTA: RayCta como OVERLAY con el QR REAL de drfederer.com. Sin precio.
import fs from "node:fs";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";

const SLUG = "fcscanas";
const FFPROBE = "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Links/ffprobe.exe";
const durDe = (rel) => { try { return parseFloat(execFileSync(FFPROBE, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path.join("public", rel)], { encoding: "utf8" }).trim()) || 0; } catch { return 0; } };
const existe = (rel) => fs.existsSync(path.join("public", rel));
const J = (p) => JSON.parse(fs.readFileSync(p, "utf8").replace(/^\uFEFF/, ""));

const MOM = J(`_v3/${SLUG}_moments.json`);
if (MOM.some((m) => m.t === undefined)) { console.error("⛔ momentos sin ms"); process.exit(1); }
const SPEC = Object.fromEntries(J(`_v3/${SLUG}_spec_all.json`).map((s) => [s.name, s]));
const STOCK = fs.existsSync(`_v3/${SLUG}_stock_res.json`) ? J(`_v3/${SLUG}_stock_res.json`) : {};
const { COMPS } = await import(`./_v3/${SLUG}_comps.mjs`);
const WINS = J(`_v3/${SLUG}_avatar_windows.json`);            // [{start,end}] en el orden de win-001..
const WAV_S = durDe(`${SLUG}.wav`);
const TOTAL_S = WAV_S + 0.5;

const QR = `img/${SLUG}_qrcard.png`, DOM = "drfederer.com";
const buscar = (frag) => { const k = MOM.findIndex((m) => m.txt.toLowerCase().includes(frag.toLowerCase())); if (k < 0) { console.error(`⛔ no encontré la frase: "${frag}"`); process.exit(1); } return k; };

// ── ventanas de AVATAR (bloquean: nada base puede taparlas)
// ⛔ RunPod metió CORTES de audio de ~0,3-0,4 s (medidos: voz −33/−41 dB en el original → −52 dB en su mp4) y ahí
//    la BOCA SE CONGELA. En el video el audio es el máster, así que se oiría la voz con la boca quieta. Se recorta la
//    ventana para que ese tramo no se vea: corte en la 2ª mitad → la ventana termina antes; en la 1ª → arranca después
//    (entrando al clip en ese segundo con startFrom, así el lipsync sigue atado).
const CORTES = fs.existsSync(`_v3/${SLUG}_cortes_runpod.json`) ? J(`_v3/${SLUG}_cortes_runpod.json`) : [];
// ⛔⛔ EL ORIGEN DEL CLIP NO ES EL INICIO DE LA VENTANA: `beatsheet_to_jobs.py --pad 0.15` cortó cada wav 0,15 s ANTES,
//    y el clip de avatar arranca en ese instante. Colocarlo en `w.start` atrasaba la boca 150 ms en TODO el video
//    (lo cazó la compuerta de cortes visibles: 8 de 13 seguían a la vista). El origen real es `timeline_start_s`
//    de _v3/fcscanas_avf_groups.json, y `en_ventana_s` de los cortes está medido desde ese mismo origen.
const SEGS = J(`_v3/${SLUG}_avf_groups.json`).flatMap((g) => g.segments);
if (SEGS.length !== WINS.length) { console.error(`⛔ ${SEGS.length} segmentos de avatar vs ${WINS.length} ventanas`); process.exit(1); }
let recortadas = 0, cortasTras = 0;
const WINS_EF = SEGS.map((sg, i) => {
  const name = sg.win;
  // ⛔ el largo pedido (`seconds`) puede ser MÁS que el clip real: win-122 topa con el final del máster y RunPod
  //    redondea cuadros → pedía 4,3 s y el clip da menos. Manda la duración REAL del archivo.
  const real = durDe(`broll/${SLUG}_av/${sg.win}.mp4`);
  const dur = Math.min(sg.seconds, real > 0 ? real - 0.05 : sg.seconds);
  const w = { start: sg.timeline_start_s, end: sg.timeline_start_s + dur };
  let a = 0, z = dur;
  for (const c of CORTES.filter((x) => x.ventana === name)) {
    if (c.en_ventana_s >= dur / 2) z = Math.min(z, c.en_ventana_s - 0.05);
    else a = Math.max(a, c.en_ventana_s + c.dur + 0.05);
  }
  if (a > 0 || z < dur) recortadas++;
  if (z - a < 1.2) cortasTras++;
  return { name, startFrom: +a.toFixed(3), start: w.start + a, end: w.start + Math.max(a + 0.5, z) };
});
console.log(`cortes de RunPod: ${CORTES.length} · ventanas recortadas ${recortadas} · quedaron < 1,2 s: ${cortasTras}`);
const avatarBeats = WINS_EF.map((w) => ({ tipo: "avatar", ms_in: Math.round(w.start * 1000), ms_out: Math.round(w.end * 1000),
  clip: `broll/${SLUG}_av/${w.name}.mp4`, ...(w.startFrom ? { startFrom: w.startFrom } : {}) }));
// tolerancia 0,25 s al final: con el origen real (pad 0,15 s) la ventana pisa el arranque del momento siguiente, y con
// −0,05 ese momento contaba como "dentro del avatar" y se tiraba su componente (medido: 39 → 33 sin aviso)
const enAvatar = (s) => WINS_EF.some((w) => s >= w.start - 0.05 && s < w.end - 0.25);
const proxAvatar = (s) => { const w = WINS_EF.find((x) => x.start >= s - 0.05); return w ? w.start : TOTAL_S; };

// ── asset de cada momento (sin avatar): pres (clip i2v > foto IA) · stock (clip > foto) · cama para comps
const bedDir = `img/${SLUG}`;
const frameBed = (clipRel, name) => {
  const out = `${bedDir}/${name}_bed.jpg`;
  if (!existe(out)) spawnSync("ffmpeg", ["-v", "error", "-y", "-ss", String(Math.max(0.2, durDe(clipRel) * 0.4)), "-i", path.join("public", clipRel), "-frames:v", "1", "-q:v", "3", path.join("public", out)]);
  return existe(out) ? out : undefined;
};
const assetDe = (m) => {
  const s = SPEC[m.name];
  if (s?.t === "pres") {
    const c = `broll/${SLUG}_pres/${m.name}.mp4`, f = `img/${m.name}.jpg`;
    if (existe(c)) return { tipo: "clip", src: c };
    if (existe(f)) return { tipo: "imagen", src: f };
  }
  const r = STOCK[m.name];
  if (r?.kind === "clip" && existe(r.file)) return { tipo: "clip", src: r.file };
  if (r?.kind === "photo" && existe(r.file)) return { tipo: "imagen", src: r.file };
  if (s?.t === "pres") return null;
  const f = `img/${m.name}.jpg`;                                // (pres que quedó como stock o viceversa)
  if (existe(f)) return { tipo: "imagen", src: f };
  return null;
};

const palabras = (p) => Object.values(p).flatMap((v) =>
  typeof v === "string" ? v.split(/\s+/) : Array.isArray(v) ? v.flatMap((o) => String(Object.values(o)[0]).split(/\s+/)) : []).length;

// ⛔ check_props: VetSenal declara `n?: string` y el spec traía números (1, 3, 5…) → 9 contratos rotos. Se normaliza
//    a string ACÁ, en la fuente del plan, para todo componente que tenga `n`.
for (const c of COMPS) if (c.props && typeof c.props.n === "number") c.props.n = String(c.props.n);
const compDe = Object.fromEntries(COMPS.map((c) => [c.name, c]));
const beats = [...avatarBeats];
const overlays = [];
let sinAsset = 0, recortados = 0, reales = 0, ia = 0;
const skip = new Set();

for (let i = 0; i < MOM.length; i++) {
  const m = MOM[i];
  if (SPEC[m.name]?.t === "avatar" || skip.has(i)) continue;
  const t0 = Math.max(m.t, 0), t1 = m.t + m.dur;
  if (enAvatar(t0 + 0.1)) continue;                              // el pad de una ventana ya lo cubre
  const c = compDe[m.name];
  const a = assetDe(m);
  if (a) { if (a.src.includes(`_pres`) || a.src.startsWith(`img/${SLUG}_`)) ia++; else reales++; }

  if (c && c.overlay) {
    const piso = Math.min(9, 2.8 + 0.28 * Math.max(0, palabras(c.props) - 3));
    overlays.push({ componente: c.comp, props: c.props, ms_in: Math.round(t0 * 1000), ms_out: Math.round(Math.min(t0 + Math.max(m.dur, piso), proxAvatar(t0)) * 1000) });
  }
  if (c && !c.overlay) {
    // techo 11 s: una tarjeta fija de 13-16 s se lee como plano muerto (medido en la corrida con stock completo)
    const piso = Math.min(11, 2.8 + 0.28 * Math.max(0, palabras(c.props) - 3));
    let out = Math.min(t0 + Math.min(11, Math.max(m.dur, piso)), proxAvatar(t0 + 0.1));
    if (out - t0 < piso - 0.05) recortados++;
    for (let j = i + 1; j < MOM.length && MOM[j].t < out - 0.3; j++) if (SPEC[MOM[j].name]?.t !== "avatar") skip.add(j);
    let bed;
    if (a?.tipo === "imagen") bed = a.src; else if (a?.tipo === "clip") bed = frameBed(a.src, m.name);
    // ⛔ cama OBLIGATORIA bajo todo componente (regla 2.quater): si el momento no tiene asset propio, se toma el del
    //    último plano no-avatar anterior (medido: 2 componentes salían sobre fondo plano)
    if (!bed) {
      const prev = [...beats].reverse().find((x) => x.tipo === "imagen" || x.tipo === "clip");
      if (prev) bed = prev.tipo === "imagen" ? prev.src : frameBed(prev.src, `${m.name}_prev`);
    }
    beats.push({ tipo: "componente", ms_in: Math.round(t0 * 1000), ms_out: Math.round(out * 1000), componente: c.comp, props: { ...c.props, ...(bed ? { bed } : {}) } });
    continue;
  }
  if (!a) { sinAsset++; continue; }
  beats.push({ tipo: a.tipo, ms_in: Math.round(t0 * 1000), ms_out: Math.round(Math.min(t1, proxAvatar(t0 + 0.1)) * 1000), src: a.src, name: m.name });
}

// ── CTA overlays (QR real). Frases del guion donde se manda a la descripción.
for (const [frag, props] of [
  ["las cantidades exactas, los gramos y las tazas", { eyebrow: "AHÍ ABAJO, EN LA DESCRIPCIÓN", title: "Las cantidades exactas de la receta",
    sub: "Cuánta salvia, cuánto té y cuánto café, escrito con letra grande para tenerlo en la cocina.", domain: DOM, qr: QR, showQr: true }],
  ["Te la dejo en la descripción del video", { eyebrow: "EN LA DESCRIPCIÓN", title: "El Método de las Canas y 190+ remedios caseros",
    sub: "Los 3 tipos de canas y qué hacer con cada uno, con las cantidades exactas. Parte del método completo del Dr. Federer.", domain: DOM, qr: QR, showQr: true }],
]) {
  const k = buscar(frag);
  overlays.push({ componente: "RayCta", props, ms_in: Math.round(MOM[k].t * 1000), ms_out: Math.round((MOM[k].t + 9) * 1000) });
}

// ── CIERRE DE HUECOS: sin avatar de fondo, TODO hueco se cierra.
// ⛔ Una ventana de AVATAR nunca se estira ni se corre (su clip dura lo que dura y el lipsync va atado a su
//    arranque). Bug medido en la corrida parcial: "el siguiente plano arranca antes" corría hacia atrás a la
//    SIGUIENTE ventana de avatar → un avatar de 34 s sobre un clip de 22 s (se habría congelado).
//    Regla: después de un avatar, el hueco lo cubre un plano de RELLENO con el asset de un momento del
//    propio hueco (o, si no hay, el último plano no-avatar anterior); nunca se toca la ventana.
beats.sort((a, b) => a.ms_in - b.ms_in);
let huecosCerrados = 0, maxHueco = 0, rellenos = 0;
const ultimoNoAvatar = (idx) => { for (let k = idx; k >= 0; k--) if (beats[k].tipo !== "avatar" && beats[k].src) return beats[k]; return null; };
const rellenoDe = (msA, msB, idx) => {
  for (const m of MOM) {
    if (m.t * 1000 < msA - 50 || m.t * 1000 >= msB) continue;
    if (SPEC[m.name]?.t === "avatar") continue;
    const a = assetDe(m);
    if (a) return { tipo: a.tipo, src: a.src, name: m.name };
  }
  const prev = ultimoNoAvatar(idx);
  return prev ? { tipo: prev.tipo, src: prev.src, name: prev.name } : null;
};
if (beats[0].ms_in > 0 && beats[0].tipo !== "avatar") beats[0].ms_in = 0;
for (let i = 0; i < beats.length; i++) {
  const sig = i + 1 < beats.length ? beats[i + 1].ms_in : Math.round(TOTAL_S * 1000);
  const h = sig - beats[i].ms_out;
  if (beats[i].tipo === "avatar") {
    if (h <= 0) { beats[i].ms_out = Math.min(beats[i].ms_out, sig); continue; }   // solape: recorta, no estira
    if (i + 1 < beats.length && beats[i + 1].tipo !== "avatar") {
      beats[i + 1].ms_in = beats[i].ms_out;                                        // el plano siguiente arranca antes
    } else {
      const r = rellenoDe(beats[i].ms_out, sig, i);
      if (r) { beats.splice(i + 1, 0, { ...r, ms_in: beats[i].ms_out, ms_out: sig, relleno: true }); rellenos++; }
    }
    huecosCerrados++; maxHueco = Math.max(maxHueco, h);
    continue;
  }
  // ⛔ un COMPONENTE no se estira sobre el hueco que dejaron los momentos que absorbió (medido: tarjetas de
  //    13-16 s pese al techo de 11 s). Ese hueco lo cubre el asset PROPIO de esos momentos.
  if (beats[i].tipo === "componente" && h > 800) {
    const r = rellenoDe(beats[i].ms_out, sig, i);
    if (r) { beats.splice(i + 1, 0, { ...r, ms_in: beats[i].ms_out, ms_out: sig, relleno: true }); rellenos++; huecosCerrados++; maxHueco = Math.max(maxHueco, h); continue; }
  }
  if (h > 0) { huecosCerrados++; maxHueco = Math.max(maxHueco, h); }
  beats[i].ms_out = Math.max(beats[i].ms_in + 1, sig);
}
console.log(`rellenos insertados (entre ventanas de avatar y tras componentes): ${rellenos}`);

// ── PACING: un momento = un plano de ~6 s es un METRÓNOMO lento (medido: mediana 6,24 · p75 7,64 · 68 % ≥5 s).
// Los planos de más de 7 s se parten en DOS cortes del MISMO asset (regla de contexto: nunca el objeto del
// vecino). Clip → el 2º corte sale de OTRO tramo del mismo video (startFrom). Foto → punch-in con otro encuadre.
{
  const out = [];
  let partidos = 0;
  for (const b of beats) {
    const d = (b.ms_out - b.ms_in) / 1000;
    if ((b.tipo === "clip" || b.tipo === "imagen") && d > 7 && !b.relleno) {
      const frac = 0.42 + 0.16 * (((b.ms_in / 1000) * 7.31) % 1);          // corte no siempre al medio
      const corte = b.ms_in + Math.round((b.ms_out - b.ms_in) * frac);
      const d1 = (corte - b.ms_in) / 1000, d2 = (b.ms_out - corte) / 1000;
      if (b.tipo === "clip") {
        const cd = durDe(b.src);
        const off = Math.max(0, Math.min(cd - d2 - 0.2, Math.max(d1 + 1.2, cd * 0.45)));
        out.push({ ...b, ms_out: corte }, { ...b, ms_in: corte, startFrom: +off.toFixed(2), parte: 2 });
      } else {
        out.push({ ...b, ms_out: corte }, { ...b, ms_in: corte, punch: true, parte: 2 });
      }
      partidos++;
    } else out.push(b);
  }
  beats.length = 0; beats.push(...out);
  console.log(`planos largos partidos en dos cortes del mismo asset: ${partidos}`);
}
// el último beat: si es avatar, no puede estirarse más allá de su clip → lo sigue su plano previo? se avisa
const ult = beats[beats.length - 1];
if (ult.tipo === "avatar" && TOTAL_S * 1000 - ult.ms_out > 600) console.log(`⚠️ el video termina ${((TOTAL_S * 1000 - ult.ms_out) / 1000).toFixed(1)} s después de la última ventana de avatar`);

fs.writeFileSync(`_v3/${SLUG}_plan.json`, JSON.stringify({ slug: SLUG, totalMs: Math.round(TOTAL_S * 1000), beats, overlays }, null, 1));
const n = (t) => beats.filter((b) => b.tipo === t).length;
console.log(`plan: ${beats.length} beats · avatar ${n("avatar")} · clip ${n("clip")} · imagen ${n("imagen")} · componente ${n("componente")} · overlays ${overlays.length}`);
console.log(`momentos sin asset ${sinAsset} (cubiertos estirando el vecino) · huecos cerrados ${huecosCerrados} (máx ${(maxHueco / 1000).toFixed(1)} s) · comps recortados por avatar ${recortados}`);
console.log(`material REAL ${reales} · IA presentador ${ia} · total ${(TOTAL_S / 60).toFixed(2)} min`);

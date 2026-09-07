// build_fedvet3.mjs — "La Psicología del Perro que Duerme en tu Cama (Lo que Te Está Diciendo)"
//   node build_fedvet3.mjs
//
// Avatar PISO permanente: tramo 1 = el mp4 real (11:57), cola = el MISMO mp4 en BUCLE muteado
// mientras suena la voz Fish clonada del propio avatar. El audio máster (public/fedvet3.wav) lo
// muxea el FARM en el stitch: el Main NO lleva <Audio>.
// b-roll = clips i2v (VetClip/OffthreadVideo) + fotos (VetPhoto Ken-Burns) + 7 componentes del kit.
import fs from "fs";

const SLUG = "fedvet3", COMP = "Fedvet3";
const T = JSON.parse(fs.readFileSync("_v3/fedvet3_tramos.json", "utf8"));
const AVATAR_FRAMES = Math.round(T.avatar_fin * 30);
const TOTAL = +T.total.toFixed(3);
const FPS = 30;
const F = (s) => Math.round(s * FPS);
const PARTIR = 7.2;   // umbral para partir un momento en clip + foto (anti-metrónomo)

const momentos = JSON.parse(fs.readFileSync("_v3/fedvet3_momentos.json", "utf8").replace(/^﻿/, ""));
const RECH = "_v3/fedvet3_clips_rechazados.json";
const RECHAZADOS = new Set(fs.existsSync(RECH) ? JSON.parse(fs.readFileSync(RECH, "utf8")) : []);
const byName = Object.fromEntries(momentos.map((m) => [m.name, m]));
// ⭐ METRAJE REAL: _v3/fedvet3_real.json mapea momentos -> clips de Pexels ya auditados con visión.
//    Tienen PRIORIDAD sobre el clip generado (un video 100 % IA "se siente vacío").
const REALP = "_v3/fedvet3_real.json";
const REAL = fs.existsSync(REALP) ? JSON.parse(fs.readFileSync(REALP, "utf8")) : {};
const img = (n) => `img/${n}.jpg`;
const jstr = (s) => JSON.stringify(s);

// ── COMPONENTES: anclados a la frase EXACTA donde el presentador lo nombra ────
// ⛔ Todo el texto va explícito acá. Ningún componente del kit tiene default: si me olvido una
//    prop, el componente sale VACÍO (se nota) en vez de salir con el texto de otro video (no se nota).
const LUGARES = [
  { titulo: "Pegado a tu cuerpo", img: img("fedvet3_072") },
  { titulo: "A los pies, atravesado", img: img("fedvet3_083") },
  { titulo: "En la orilla, de guardia", img: img("fedvet3_093") },
  { titulo: "Sobre la almohada", img: img("fedvet3_101") },
  { titulo: "Lejos, en el piso", img: img("fedvet3_109") },
];
const POSTURAS = [
  { titulo: "De costado, estirado", img: img("fedvet3_127") },
  { titulo: "Enroscado, en rosquilla", img: img("fedvet3_134") },
  { titulo: "Panza arriba", img: img("fedvet3_143") },
  { titulo: "La esfinge", img: img("fedvet3_150") },
  { titulo: "El codo y la cabeza colgando", img: img("fedvet3_161") },
];
// el orden REAL de las causas de dejar de subir (reloj = 4 marcas con foco)
const CAUSAS = [
  { hora: "Primero", que: "Dolor al saltar: caderas, rodillas o columna." },
  { hora: "Segundo", que: "Miedo: se resbaló una vez al bajar y lo recuerda." },
  { hora: "Tercero", que: "Ya no ve bien el borde y calcula mal el salto." },
  { hora: "Cuarto", que: "Corazón o respiración: arriba y tapado le da calor." },
];
const PASOS = [
  "Cuenta la respiración en reposo, dos noches",
  "Una foto del sitio, una vez por semana",
  "Mira cómo se sube a la cama, una vez",
  "Revisa el suelo y pon una alfombra donde aterriza",
];

const CMP = {
  // ── HOOK: el remate de la pregunta
  "003": { k: "frase", palabras: ["PREGÚNTAME", "DÓNDE", "SE", "ACUESTA"], resalta: 1, over: true },
  // ── MECANISMO: lo que manda debajo del cariño
  "054": { k: "pizarra", titulo: "Lo que manda debajo del cariño", pasos: [
    { texto: "El calor: no suda, regula por el contacto, y tu cuerpo es la estufa del cuarto.", img: img("fedvet3_055") },
    { texto: "La seguridad: dormido está indefenso, y pegado a otro cuerpo grande no lo está.", img: img("fedvet3_060") },
    { texto: "El olor: el olfato es el último sentido que se le va.", img: img("fedvet3_063") },
  ] },
  // ── EJE 1 · LOS CINCO LUGARES
  "072": { k: "zonas", set: "LUGARES", foco: 0, intro: true, rotulo: "Lugar 1 · pegado a tu cuerpo" },
  "083": { k: "zonas", set: "LUGARES", foco: 1, rotulo: "Lugar 2 · a los pies, atravesado" },
  "093": { k: "zonas", set: "LUGARES", foco: 2, rotulo: "Lugar 3 · en la orilla, de guardia" },
  "101": { k: "zonas", set: "LUGARES", foco: 3, rotulo: "Lugar 4 · sobre la almohada" },
  "109": { k: "zonas", set: "LUGARES", foco: 4, rotulo: "Lugar 5 · lejos, en el piso" },
  // ── EJE 2 · LAS CINCO POSTURAS
  "127": { k: "zonas", set: "POSTURAS", foco: 0, intro: true, rotulo: "Postura 1 · de costado, estirado" },
  "134": { k: "zonas", set: "POSTURAS", foco: 1, rotulo: "Postura 2 · enroscado, en rosquilla" },
  "143": { k: "zonas", set: "POSTURAS", foco: 2, rotulo: "Postura 3 · panza arriba" },
  "150": { k: "zonas", set: "POSTURAS", foco: 3, rotulo: "Postura 4 · la esfinge" },
  "161": { k: "zonas", set: "POSTURAS", foco: 4, rotulo: "Postura 5 · el codo y la cabeza colgando" },
  // ── el pivote del video
  "169": { k: "frase", palabras: ["TU", "PERRO", "DUERME", "COMO", "TU", "PERRO"], resalta: 5, over: true },
  // ── EJE 3 · LOS CUATRO CAMBIOS
  "179": { k: "senal", numero: 1, titulo: "Se levanta y no se acomoda", sub: "Baja, camina, vuelve, y a los diez minutos otra vez. No encuentra una posición sin dolor.", im: img("fedvet3_181") },
  "187": { k: "senal", numero: 2, titulo: "Respira distinto dormido", sub: "Más de treinta veces por minuto en reposo, dos noches seguidas, es motivo de consulta el mismo día.", im: img("fedvet3_190") },
  "201": { k: "senal", numero: 3, titulo: "Cambió de lugar y no volvió", sub: "Más de dos semanas en el sitio nuevo: ahí hay un motivo físico esperando.", im: img("fedvet3_203") },
  "210": { k: "senal", numero: 4, titulo: "Dejó de subir", sub: "El más peligroso de todos, y el único que la gente celebra.", im: img("fedvet3_205") },
  // ── LA PRUEBA (mecanismo, la herramienta que se regala)
  "191": { k: "pizarra", titulo: "La respiración en reposo", pasos: [
    { texto: "Con el perro dormido y tranquilo, en un lugar fresco.", img: img("fedvet3_192") },
    { texto: "Cuenta cuántas veces le sube y le baja el costado en quince segundos.", img: img("fedvet3_193") },
    { texto: "Multiplica por cuatro. Sano: entre quince y treinta por minuto.", img: img("fedvet3_195") },
  ] },
  // ── MITO / VERDAD
  "212": { k: "mito", etiquetaMito: "Lo que se celebra", mito: "Por fin aprendió a dormir en su cama",
    etiquetaVerdad: "Lo que pasa", verdad: "Dejar de subir no es una decisión: es una incapacidad",
    imgMito: img("fedvet3_212"), imgVerdad: img("fedvet3_214") },
  // ── EL ORDEN REAL DE LAS CAUSAS
  "216": { k: "reloj", foco: 0 },
  "217": { k: "reloj", foco: 1 },
  "218": { k: "reloj", foco: 2 },
  "219": { k: "reloj", foco: 3 },
  // ── LO PRÁCTICO
  "236": { k: "pasos", foco: 0, titulo: "Cuatro cosas para esta semana" },
  "239": { k: "pasos", foco: 1, titulo: "Cuatro cosas para esta semana" },
  "244": { k: "pasos", foco: 2, titulo: "Cuatro cosas para esta semana" },
  "248": { k: "pasos", foco: 3, titulo: "Cuatro cosas para esta semana" },
  // ── el remate
  "265": { k: "frase", palabras: ["LA", "EDAD", "NO", "ES", "UNA", "ENFERMEDAD"], resalta: 5, over: true },
};
const SETS = { LUGARES, POSTURAS };

// piso de tiempo de lectura: sale del TEXTO, no del slot (2,8s a pantalla completa + 0,28s por
// palabra más allá de 3). Los OVERLAY pueden pasarse del slot: flotan y no le roban tiempo a nadie.
const palabrasDe = (c) => {
  if (c.k === "frase") return c.palabras.length;
  if (c.k === "zonas") return c.rotulo.split(/\s+/).length + 4;
  if (c.k === "pizarra") return c.titulo.split(/\s+/).length + c.pasos.reduce((a, s) => a + s.texto.split(/\s+/).length, 0);
  if (c.k === "reloj") return 10;
  if (c.k === "senal") return c.titulo.split(/\s+/).length + c.sub.split(/\s+/).length;
  if (c.k === "mito") return (c.mito + " " + c.verdad).split(/\s+/).length + 4;
  if (c.k === "pasos") return PASOS[c.foco].split(/\s+/).length + 5;
  return 6;
};
const pisoLectura = (c) => Math.min(13, (c.over ? 2.0 : 2.8) + 0.28 * Math.max(0, palabrasDe(c) - 3));

// ── construcción de cues ─────────────────────────────────────────────────────
const cues = [], overlays = [];
const imgsUsed = new Set(), clipsUsed = new Set(), missing = [];
let imgIdx = 0;

// 1) los componentes primero: fijan su ventana y tapan los momentos que caen adentro
const compBeats = [];
for (const [suf, c] of Object.entries(CMP)) {
  const mo = byName[`${SLUG}_${suf}`];
  if (!mo) { missing.push(`MOMENTO INEXISTENTE para componente: ${suf}`); continue; }
  const piso = pisoLectura(c);
  const dur = Math.max(mo.dur, piso);
  compBeats.push({ suf, c, start: mo.ms, dur, over: !!c.over });
}
compBeats.sort((a, b) => a.start - b.start);
// un componente de pantalla completa NO puede comerse el ancla del siguiente
for (let i = 0; i < compBeats.length - 1; i++) {
  const a = compBeats[i], b = compBeats[i + 1];
  if (!a.over && a.start + a.dur > b.start - 0.1) a.dur = Math.max(0.8, b.start - a.start - 0.1);
}
const tapado = (ms) => compBeats.some((b) => !b.over && ms >= b.start - 0.001 && ms < b.start + b.dur - 0.15);

// 2) el b-roll de cada momento
for (const mo of momentos) {
  const suf = mo.name.replace(`${SLUG}_`, "");
  if (CMP[suf] && !CMP[suf].over) continue;          // ese momento lo dibuja el componente
  if (tapado(mo.ms)) continue;                        // cae dentro de un componente full-screen
  const clipReal = REAL[mo.name] ? `broll/${REAL[mo.name]}.mp4` : null;
  const clip = clipReal && fs.existsSync(`public/${clipReal}`) ? clipReal : `broll/${mo.name}.mp4`;
  const im = img(mo.name);
  const hayClip = fs.existsSync(`public/${clip}`) && !RECHAZADOS.has(mo.name);
  const hayFoto = fs.existsSync(`public/${im}`);
  const key = `${suf}_${Math.round(mo.ms * 1000)}`;
  const ponClip = (start, dur, k) => { clipsUsed.add(clip); cues.push({ key: k, start, dur, el: `(d) => <VetClip durationInFrames={d} src=${jstr(clip)} />` }); };
  const ponFoto = (start, dur, k) => { imgsUsed.add(im); cues.push({ key: k, start, dur, el: `(d) => <VetPhoto durationInFrames={d} img=${jstr(im)} i={${imgIdx++}} />` }); };

  // ⛔ ANTI-METRÓNOMO ESTRUCTURAL: los momentos de este video miden 5,4 s de mediana. Un plano por
  //    momento da mediana 5,4 y p75 6,5 — planos parejos y largos. Un momento largo se parte en DOS
  //    planos, y la 2ª parte repite SU MISMO asset en la otra forma (clip -> foto): mismo sujeto de
  //    ESA frase, otra lectura. ⛔ Nunca el asset del momento vecino.
  if (hayClip && hayFoto && mo.dur >= PARTIR) {
    const dClip = Math.min(4.2, mo.dur - 2.2);
    ponClip(mo.ms, dClip, key);
    ponFoto(mo.ms + dClip, mo.dur - dClip, `${key}b`);
  } else if (hayClip) {
    ponClip(mo.ms, mo.dur, key);
  } else if (hayFoto) {
    ponFoto(mo.ms, mo.dur, key);
  } else { missing.push(im); continue; }
}

// 3) los componentes como cues (y sus imágenes al tar) — con CAMA DE FOTO debajo
const camaDe = (start) => {
  const prev = [...momentos].reverse().find((m) => m.ms <= start && fs.existsSync(`public/${img(m.name)}`));
  return prev ? img(prev.name) : null;
};
for (const b of compBeats) {
  const c = b.c, key = `cmp_${b.suf}`;
  const cama = camaDe(b.start);
  if (cama) imgsUsed.add(cama);
  const camaP = cama ? ` cama=${jstr(cama)}` : "";
  let el;
  if (c.k === "frase") {
    el = `(d) => <VetFrase durationInFrames={d} palabras={${JSON.stringify(c.palabras)}} resalta={${c.resalta}} />`;
  } else if (c.k === "zonas") {
    SETS[c.set].forEach((z) => imgsUsed.add(z.img));
    el = `(d) => <VetZonas durationInFrames={d} cards={${c.set}} foco={${c.foco}} intro={${!!c.intro}} rotulo=${jstr(c.rotulo)}${camaP} />`;
  } else if (c.k === "pizarra") {
    c.pasos.forEach((s) => s.img && imgsUsed.add(s.img));
    el = `(d) => <VetPizarra durationInFrames={d} titulo=${jstr(c.titulo)} pasos={${JSON.stringify(c.pasos)}}${camaP} />`;
  } else if (c.k === "reloj") {
    el = `(d) => <VetReloj durationInFrames={d} marcas={CAUSAS} foco={${c.foco}}${camaP} />`;
  } else if (c.k === "senal") {
    imgsUsed.add(c.im);
    el = `(d) => <VetSenal durationInFrames={d} numero={${c.numero}} titulo=${jstr(c.titulo)} sub=${jstr(c.sub)} img=${jstr(c.im)}${camaP} />`;
  } else if (c.k === "mito") {
    imgsUsed.add(c.imgMito); imgsUsed.add(c.imgVerdad);
    el = `(d) => <VetMito durationInFrames={d} mito=${jstr(c.mito)} verdad=${jstr(c.verdad)} etiquetaMito=${jstr(c.etiquetaMito)} etiquetaVerdad=${jstr(c.etiquetaVerdad)} imgMito=${jstr(c.imgMito)} imgVerdad=${jstr(c.imgVerdad)}${camaP} />`;
  } else if (c.k === "pasos") {
    el = `(d) => <VetPasos durationInFrames={d} titulo=${jstr(c.titulo)} pasos={PASOS} foco={${c.foco}}${camaP} />`;
  }
  if (!el) { missing.push(`kind desconocido: ${c.k} en ${b.suf}`); continue; }
  (b.over ? overlays : cues).push({ key, start: b.start, dur: b.dur, el });
}

// ── CTA: QR en OVERLAY, en los 3 momentos donde el presentador nombra la guía ─
// ⛔ el CTA va en la capa `over`, NUNCA adentro de un componente de escena (si el componente deja
//    de montarse, el CTA se va con él y el video se entrega sin QR).
const QR = "med/fedvet3_qr.png", DOMINIO = "drfederer.com/veterinario";
for (const [suf, dur] of [["122", 13], ["232", 13], ["270", 16]]) {
  const mo = byName[`${SLUG}_${suf}`];
  if (!mo) { missing.push(`momento de CTA inexistente: ${suf}`); continue; }
  overlays.push({ key: `qr_${suf}`, start: mo.ms, dur: Math.min(dur, TOTAL - mo.ms - 0.2),
    el: `(d) => <VetQr durationInFrames={d} qr=${jstr(QR)} dominio=${jstr(DOMINIO)} pie=${jstr("Escanea para la guía")} />` });
}

// ── ALINEAR A FRAME: start y dur redondeados por separado dejan huecos de 1 frame que se ven
//    como un destello del fondo en cada transición.
const alinear = (arr) => {
  arr.sort((a, b) => a.start - b.start);
  for (let i = 0; i < arr.length; i++) {
    const f0 = F(arr[i].start);
    let f1 = F(arr[i].start + arr[i].dur);
    const sig = arr[i + 1];
    if (sig && Math.abs(F(sig.start) - f1) <= 1) f1 = F(sig.start);
    arr[i].start = f0 / FPS;
    arr[i].dur = Math.max(1, f1 - f0) / FPS;
  }
};
alinear(cues);
alinear(overlays);

// ── emitir ───────────────────────────────────────────────────────────────────
const TOTAL_FRAMES = Math.ceil(TOTAL * FPS);
const line = (c) => `  { key: ${jstr(c.key)}, start: ${c.start}, dur: ${c.dur}, el: ${c.el} },`;

fs.mkdirSync("src/fedvet3", { recursive: true });
fs.writeFileSync(`src/fedvet3/cues_${SLUG}.gen.tsx`, `// GENERADO por build_${SLUG}.mjs. NO editar a mano.
import { ReactNode } from "react";
import { VetPhoto, VetClip, VetFrase, VetZonas, VetPizarra, VetReloj, VetSenal, VetMito, VetPasos, VetQr } from "./VetPieces";

export type Cue = { key: string; start: number; dur: number; el: (d: number) => ReactNode };

const LUGARES = ${JSON.stringify(LUGARES, null, 1)};
const POSTURAS = ${JSON.stringify(POSTURAS, null, 1)};
const CAUSAS = ${JSON.stringify(CAUSAS, null, 1)};
const PASOS = ${JSON.stringify(PASOS, null, 1)};

export const CUES: Cue[] = [
${cues.map(line).join("\n")}
];

export const OVERLAYS: Cue[] = [
${overlays.map(line).join("\n")}
];
`);

fs.writeFileSync(`src/fedvet3/avatar_${SLUG}.gen.ts`, `// GENERADO. NO editar a mano.
export type AvatarWindow = { start: number; mode: "full" | "hidden" };
export const TOTAL_FEDVET3 = ${TOTAL};
export const TOTAL_FRAMES_FEDVET3 = ${TOTAL_FRAMES};
export const AVATAR_FRAMES_FEDVET3 = ${AVATAR_FRAMES};
// El avatar es el PISO GARANTIZADO de todo el video: base FULL, siempre. Cada cue lo tapa mientras
// dura y ni un instante queda sin fondo.
export const AVATAR_WINDOWS: AvatarWindow[] = [{ start: 0, mode: "full" }];
`);

fs.writeFileSync(`src/fedvet3/Main_${SLUG}.tsx`, `// GENERADO por build_${SLUG}.mjs. NO editar a mano.
import { AbsoluteFill, Sequence } from "remotion";
import { AvatarLayerLoopFcs } from "../_fed6/VideoEdit/scenes/AvatarLayerLoopFcs";
import { CUES, OVERLAYS } from "./cues_${SLUG}.gen";
import { AVATAR_WINDOWS, AVATAR_FRAMES_FEDVET3, TOTAL_FRAMES_FEDVET3 } from "./avatar_${SLUG}.gen";

const F = (s: number) => Math.round(s * 30);

export const Main${COMP}: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0F10" }}>
    <AvatarLayerLoopFcs src="${SLUG}_opt.mp4" windows={AVATAR_WINDOWS} avatarFrames={AVATAR_FRAMES_FEDVET3} accent="#0F4A42" avatarFocus={{ x: 0.5, y: 0.26 }} />

    {CUES.map((cue) => (
      <Sequence key={cue.key} from={F(cue.start)} durationInFrames={Math.max(1, F(cue.dur))}>
        {cue.el(Math.max(1, F(cue.dur)))}
      </Sequence>
    ))}
    {OVERLAYS.map((o) => (
      <Sequence key={o.key} from={F(o.start)} durationInFrames={Math.max(1, F(o.dur))}>
        {o.el(Math.max(1, F(o.dur)))}
      </Sequence>
    ))}
  </AbsoluteFill>
);

export { TOTAL_FRAMES_FEDVET3 };
`);

fs.writeFileSync(`src/index_${SLUG}.tsx`, `import "./index.css";
import { Composition, registerRoot } from "remotion";
import { Main${COMP}, TOTAL_FRAMES_FEDVET3 } from "./fedvet3/Main_${SLUG}";

const Root${COMP}: React.FC = () => (
  <Composition id="${COMP}" component={Main${COMP}} durationInFrames={TOTAL_FRAMES_FEDVET3} fps={30} width={1920} height={1080} />
);
registerRoot(Root${COMP});
`);

// ── assets para el farm ──────────────────────────────────────────────────────
const blurs = new Set(), faltan = [];
for (const im of imgsUsed) {
  if (!fs.existsSync(`public/${im}`)) faltan.push(im);
  const b = im.replace(/\.(png|jpe?g)$/i, "_blur.jpg");
  if (fs.existsSync(`public/${b}`)) blurs.add(b); else faltan.push(b);
}
if (!fs.existsSync(`public/${QR}`)) faltan.push(QR);
const assets = [...clipsUsed, ...imgsUsed, ...blurs, QR].sort();
fs.writeFileSync(`_${SLUG}_assets.txt`, assets.join("\n") + "\n");

// ── compuertas del build ─────────────────────────────────────────────────────
const ds = [...cues.map((c) => c.dur)].sort((a, b) => a - b);
const q = (p) => ds[Math.floor(p * (ds.length - 1))];
const kinds = new Set(Object.values(CMP).map((c) => c.k));
const cubierto = cues.reduce((a, c) => a + c.dur, 0);
const qrOk = overlays.filter((o) => o.key.startsWith("qr_")).length;
console.log(`cues ${cues.length} · overlays ${overlays.length} · componentes ${compBeats.length} en ${kinds.size} tipos DISTINTOS`);
// ⛔ contar clips DISTINTOS mide mal: los del pool se reusan hasta 2 veces, así que el Set los
//    colapsa y el porcentaje sale por la mitad. Se cuentan los PLANOS que muestran metraje real.
const nReal = cues.filter((c) => c.el.includes("_pool/")).length;
console.log(`clips ${clipsUsed.size} (${nReal} de METRAJE REAL = ${Math.round(100 * nReal / Math.max(1, cues.length))} % de los planos) · imgs ${imgsUsed.size} · blurs ${blurs.size} · QR en ${qrOk} momentos`);
console.log(`pacing · mediana ${q(.5).toFixed(2)}s · p75 ${q(.75).toFixed(2)}s · p90 ${q(.9).toFixed(2)}s · >=5s ${ds.filter((d) => d >= 5).length}/${ds.length} (${Math.round(100 * ds.filter((d) => d >= 5).length / ds.length)}%)`);
console.log(`cobertura de b-roll ${(100 * cubierto / TOTAL).toFixed(1)}% · TOTAL ${TOTAL}s = ${TOTAL_FRAMES} frames · avatar real hasta ${AVATAR_FRAMES} f`);
if (kinds.size < 6) { console.log(`⛔ solo ${kinds.size} tipos de componente distintos (mínimo 6)`); process.exit(1); }
if (qrOk < 3) { console.log(`⛔ el CTA tiene que aparecer 3 veces, hay ${qrOk}`); process.exit(1); }
if (missing.length) { console.log(`\n⛔ FALTAN ${missing.length}:`); missing.slice(0, 12).forEach((m) => console.log("   " + m)); process.exit(1); }
if (faltan.length) { console.log(`\n⛔ FALTAN ${faltan.length} imgs/_blur/qr:`); faltan.slice(0, 12).forEach((m) => console.log("   " + m)); process.exit(1); }
console.log(`assets -> _${SLUG}_assets.txt (${assets.length})`);

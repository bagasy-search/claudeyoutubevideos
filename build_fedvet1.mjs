// build_fedvet1.mjs — "Cuando tu Perro te LAME, Esto es lo que Realmente Significa (No es Cariño)"
//   node build_fedvet1.mjs
//
// Avatar PISO permanente: tramo 1 = el mp4 real (11:17), cola = el MISMO mp4 en BUCLE muteado
// mientras suena la voz Fish. El audio máster (public/fedvet1.wav) lo muxea el FARM en el stitch:
// el Main NO lleva <Audio>.
// b-roll = clips i2v (VetClip/OffthreadVideo) + fotos (VetPhoto Ken-Burns) + 7 componentes del kit.
import fs from "fs";

const SLUG = "fedvet1", COMP = "Fedvet1";
const T = JSON.parse(fs.readFileSync("_v3/fedvet1_tramos.json", "utf8"));
const AVATAR_FRAMES = Math.round(T.avatar_fin * 30);
const TOTAL = +T.total.toFixed(3);
const FPS = 30;
const F = (s) => Math.round(s * FPS);

const momentos = JSON.parse(fs.readFileSync("_v3/fedvet1_momentos.json", "utf8").replace(/^﻿/, ""));
const RECHAZADOS = new Set(JSON.parse(fs.readFileSync("_v3/fedvet1_clips_rechazados.json", "utf8")));
const byName = Object.fromEntries(momentos.map((m) => [m.name, m]));
const img = (n) => `img/${n}.jpg`;
const jstr = (s) => JSON.stringify(s);

// ── COMPONENTES: anclados a la frase EXACTA donde el presentador lo nombra ────
// ⛔ Todo el texto va explícito acá. Ningún componente del kit tiene default: si me olvido una
//    prop, el componente sale VACÍO (se nota) en vez de salir con el texto de otro video (no se nota).
const ZONAS = [
  { titulo: "Las manos", img: img("fedvet1_m02") },
  { titulo: "La cara y la boca", img: img("fedvet1_m20") },
  { titulo: "Los pies", img: img("fedvet1_m43") },
  { titulo: "Las orejas y el pelo", img: img("fedvet1_m56") },
  { titulo: "Una herida o una crema", img: img("fedvet1_m65") },
];
const RELOJ = [
  { hora: "Cuando llegas", que: "Reencuentro: te actualiza el archivo. Sano." },
  { hora: "Cuando estás mal", que: "Apaciguamiento: intenta calmarte." },
  { hora: "De madrugada", que: "Desorientación: puede ser la cabeza." },
  { hora: "Si lo tocas ahí", que: "Redirección: muchas veces es dolor." },
];
const PASOS = [
  "Nunca castigues un lametón",
  "Haz el mapa: dónde, cuándo, cuánto duró",
  "El recorrido de las caricias, una vez por semana",
  "Revisa lo que tú te pones en la piel",
  "Si algo cambió, no lo llames vejez",
];

const CMP = {
  h20: { k: "frase", palabras: ["LAMER", "NO", "ES", "UN", "BESO"], resalta: 1, over: true },
  o19: { k: "pizarra", titulo: "De dónde sale ese gesto", pasos: [
    { texto: "Nace ciego y sordo: lo único que funciona es el olfato y la boca.", img: img("fedvet1_o02") },
    { texto: "Le lame el hocico a la madre para pedirle comida.", img: img("fedvet1_o14") },
    { texto: "De adulto repite el mismo gesto, y ahora te lo hace a ti.", img: img("fedvet1_o28") },
  ] },
  m01: { k: "zonas", foco: 0, intro: true, rotulo: "Zona 1 · las manos" },
  m17: { k: "zonas", foco: 1, rotulo: "Zona 2 · la cara y la boca" },
  m36: { k: "zonas", foco: 2, rotulo: "Zona 3 · los pies" },
  m54: { k: "zonas", foco: 3, rotulo: "Zona 4 · las orejas y el pelo" },
  m64: { k: "zonas", foco: 4, rotulo: "Zona 5 · una herida o una crema" },
  m45: { k: "pizarra", titulo: "Por qué se calma lamiendo", pasos: [
    { texto: "El lamido repetido libera sustancias que le dan sensación de calma.", img: img("fedvet1_m45") },
    { texto: "Es autorregulación: el equivalente perruno de morderse las uñas.", img: img("fedvet1_m46") },
    { texto: "Si dura diez o quince minutos, ya no es cariño: es ansiedad.", img: img("fedvet1_m50") },
  ] },
  r03: { k: "reloj", foco: 0 },
  r10: { k: "reloj", foco: 1 },
  r24: { k: "reloj", foco: 2 },
  r47: { k: "reloj", foco: 3 },
  s03: { k: "senal", numero: 1, titulo: "Se lame las patas", sub: "El pelo entre los dedos manchado de marrón rojizo no es tierra.", im: img("fedvet1_s05") },
  s14: { k: "senal", numero: 2, titulo: "Lame el aire o el piso", sub: "Casi siempre hay un problema digestivo detrás.", im: img("fedvet1_s16") },
  s29: { k: "senal", numero: 3, titulo: "Se relame sin comida cerca", sub: "Es una señal de calma: estoy incómodo, dame espacio.", im: img("fedvet1_s29") },
  s35: { k: "senal", numero: 4, titulo: "El aliento y la encía", sub: "Una línea roja en la encía pasa factura al corazón y a los riñones.", im: img("fedvet1_s39") },
  s47: { k: "senal", numero: 5, titulo: "Cambió", sub: "En un perro mayor no importa lo que hace: importa lo que cambió.", im: img("fedvet1_s50") },
  s24: { k: "mito", etiquetaMito: "Lo que se cree", mito: "Es una manía del perro viejo",
    etiquetaVerdad: "Lo que pasa", verdad: "Casi siempre son náuseas",
    imgMito: img("fedvet1_s15"), imgVerdad: img("fedvet1_s20") },
  q03: { k: "pasos", foco: 0, titulo: "Qué hacer a partir de esta noche" },
  q16: { k: "pasos", foco: 1, titulo: "Qué hacer a partir de esta noche" },
  q22: { k: "pasos", foco: 2, titulo: "Qué hacer a partir de esta noche" },
  q28: { k: "pasos", foco: 3, titulo: "Qué hacer a partir de esta noche" },
  q31: { k: "pasos", foco: 4, titulo: "Qué hacer a partir de esta noche" },
  s48: { k: "frase", palabras: ["LO", "QUE", "IMPORTA", "ES", "LO", "QUE", "CAMBIÓ"], resalta: 6, over: true },
  c16: { k: "frase", palabras: ["ESO", "NO", "ES", "UN", "BESO"], resalta: 0, over: true },
};

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
const pisoLectura = (c) => (c.over ? 2.0 : 2.8) + 0.28 * Math.max(0, palabrasDe(c) - 3);

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
  const clip = `broll/${mo.name}.mp4`;
  const usaClip = fs.existsSync(`public/${clip}`) && !RECHAZADOS.has(mo.name);
  const key = `${suf}_${Math.round(mo.ms * 1000)}`;
  if (usaClip) {
    clipsUsed.add(clip);
    cues.push({ key, start: mo.ms, dur: mo.dur, el: `(d) => <VetClip durationInFrames={d} src=${jstr(clip)} />` });
  } else {
    const im = img(mo.name);
    if (!fs.existsSync(`public/${im}`)) { missing.push(im); continue; }
    imgsUsed.add(im);
    cues.push({ key, start: mo.ms, dur: mo.dur, el: `(d) => <VetPhoto durationInFrames={d} img=${jstr(im)} i={${imgIdx++}} />` });
  }
}

// 3) los componentes como cues (y sus imágenes al tar)
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
    ZONAS.forEach((z) => imgsUsed.add(z.img));
    el = `(d) => <VetZonas durationInFrames={d} cards={ZONAS} foco={${c.foco}} intro={${!!c.intro}} rotulo=${jstr(c.rotulo)}${camaP} />`;
  } else if (c.k === "pizarra") {
    c.pasos.forEach((s) => s.img && imgsUsed.add(s.img));
    el = `(d) => <VetPizarra durationInFrames={d} titulo=${jstr(c.titulo)} pasos={${JSON.stringify(c.pasos)}}${camaP} />`;
  } else if (c.k === "reloj") {
    el = `(d) => <VetReloj durationInFrames={d} marcas={RELOJ} foco={${c.foco}}${camaP} />`;
  } else if (c.k === "senal") {
    imgsUsed.add(c.im);
    el = `(d) => <VetSenal durationInFrames={d} numero={${c.numero}} titulo=${jstr(c.titulo)} sub=${jstr(c.sub)} img=${jstr(c.im)}${camaP} />`;
  } else if (c.k === "mito") {
    imgsUsed.add(c.imgMito); imgsUsed.add(c.imgVerdad);
    el = `(d) => <VetMito durationInFrames={d} mito=${jstr(c.mito)} verdad=${jstr(c.verdad)} etiquetaMito=${jstr(c.etiquetaMito)} etiquetaVerdad=${jstr(c.etiquetaVerdad)} imgMito=${jstr(c.imgMito)} imgVerdad=${jstr(c.imgVerdad)}${camaP} />`;
  } else if (c.k === "pasos") {
    el = `(d) => <VetPasos durationInFrames={d} titulo=${jstr(c.titulo)} pasos={PASOS} foco={${c.foco}}${camaP} />`;
  }
  (b.over ? overlays : cues).push({ key, start: b.start, dur: b.dur, el });
}

// ── CTA: QR en OVERLAY, en los 3 momentos donde el presentador nombra la guía ─
const QR = "med/fedvet1_qr.png", DOMINIO = "drfederer.com/veterinario";
for (const [suf, dur] of [["m86", 13], ["s61", 13], ["c28", 18]]) {
  const mo = byName[`${SLUG}_${suf}`];
  if (!mo) { missing.push(`momento de CTA inexistente: ${suf}`); continue; }
  overlays.push({ key: `qr_${suf}`, start: mo.ms, dur: Math.min(dur, TOTAL - mo.ms - 0.2),
    el: `(d) => <VetQr durationInFrames={d} qr=${jstr(QR)} dominio=${jstr(DOMINIO)} pie=${jstr("Escanea para la guía")} />` });
}

// ── ALINEAR A FRAME: start y dur redondeados por separado dejan huecos de 1 frame que se ven
//    como un destello del fondo en cada transición (46 fronteras medidas en otro video).
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

fs.mkdirSync("src/fedvet1", { recursive: true });
fs.writeFileSync(`src/fedvet1/cues_${SLUG}.gen.tsx`, `// GENERADO por build_${SLUG}.mjs. NO editar a mano.
import { ReactNode } from "react";
import { VetPhoto, VetClip, VetFrase, VetZonas, VetPizarra, VetReloj, VetSenal, VetMito, VetPasos, VetQr } from "./VetPieces";

export type Cue = { key: string; start: number; dur: number; el: (d: number) => ReactNode };

const ZONAS = ${JSON.stringify(ZONAS, null, 1)};
const RELOJ = ${JSON.stringify(RELOJ, null, 1)};
const PASOS = ${JSON.stringify(PASOS, null, 1)};

export const CUES: Cue[] = [
${cues.map(line).join("\n")}
];

export const OVERLAYS: Cue[] = [
${overlays.map(line).join("\n")}
];
`);

fs.writeFileSync(`src/fedvet1/avatar_${SLUG}.gen.ts`, `// GENERADO. NO editar a mano.
export type AvatarWindow = { start: number; mode: "full" | "hidden" };
export const TOTAL_FEDVET1 = ${TOTAL};
export const TOTAL_FRAMES_FEDVET1 = ${TOTAL_FRAMES};
export const AVATAR_FRAMES_FEDVET1 = ${AVATAR_FRAMES};
// El avatar es el PISO GARANTIZADO de todo el video: base FULL, siempre. Cada cue lo tapa mientras
// dura y ni un instante queda sin fondo. (La regla anti-hueco: base hidden + tope de duración deja
// ver el fondo muerto cuando la narración dwellea.)
export const AVATAR_WINDOWS: AvatarWindow[] = [{ start: 0, mode: "full" }];
`);

fs.writeFileSync(`src/fedvet1/Main_${SLUG}.tsx`, `// GENERADO por build_${SLUG}.mjs. NO editar a mano.
import { AbsoluteFill, Sequence } from "remotion";
import { AvatarLayerLoopFcs } from "../_fed6/VideoEdit/scenes/AvatarLayerLoopFcs";
import { CUES, OVERLAYS } from "./cues_${SLUG}.gen";
import { AVATAR_WINDOWS, AVATAR_FRAMES_FEDVET1, TOTAL_FRAMES_FEDVET1 } from "./avatar_${SLUG}.gen";

const F = (s: number) => Math.round(s * 30);

export const Main${COMP}: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0F10" }}>
    <AvatarLayerLoopFcs src="${SLUG}_opt.mp4" windows={AVATAR_WINDOWS} avatarFrames={AVATAR_FRAMES_FEDVET1} accent="#0F4A42" avatarFocus={{ x: 0.5, y: 0.26 }} />

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

export { TOTAL_FRAMES_FEDVET1 };
`);

fs.writeFileSync(`src/index_${SLUG}.tsx`, `import "./index.css";
import { Composition, registerRoot } from "remotion";
import { Main${COMP}, TOTAL_FRAMES_FEDVET1 } from "./fedvet1/Main_${SLUG}";

const Root${COMP}: React.FC = () => (
  <Composition id="${COMP}" component={Main${COMP}} durationInFrames={TOTAL_FRAMES_FEDVET1} fps={30} width={1920} height={1080} />
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
console.log(`cues ${cues.length} · overlays ${overlays.length} · componentes ${compBeats.length} en ${kinds.size} tipos DISTINTOS`);
console.log(`clips ${clipsUsed.size} · imgs ${imgsUsed.size} · blurs ${blurs.size}`);
console.log(`pacing · mediana ${q(.5).toFixed(2)}s · p75 ${q(.75).toFixed(2)}s · p90 ${q(.9).toFixed(2)}s · >=5s ${ds.filter((d) => d >= 5).length}/${ds.length} (${Math.round(100 * ds.filter((d) => d >= 5).length / ds.length)}%)`);
console.log(`cobertura de b-roll ${(100 * cubierto / TOTAL).toFixed(1)}% · TOTAL ${TOTAL}s = ${TOTAL_FRAMES} frames`);
if (kinds.size < 6) { console.log(`⛔ solo ${kinds.size} tipos de componente distintos (mínimo 6)`); process.exit(1); }
if (missing.length) { console.log(`\n⛔ FALTAN ${missing.length}:`); missing.slice(0, 12).forEach((m) => console.log("   " + m)); process.exit(1); }
if (faltan.length) { console.log(`\n⛔ FALTAN ${faltan.length} imgs/_blur/qr:`); faltan.slice(0, 12).forEach((m) => console.log("   " + m)); process.exit(1); }
console.log(`assets -> _${SLUG}_assets.txt (${assets.length})`);

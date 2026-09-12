// build_faarroz.mjs — VLOG CASERO del canal Federer Archivos, con AVATAR PARCIAL (26:27 de lipsync
// real + cola de Fish con el avatar en bucle mudo).
// Base: build_pinluz.mjs (misma vara, validada por el creador), + componentes propios de overlay.
// Emite src/faarroz/{cues_faarroz.gen.tsx, Main_faarroz.tsx} + src/index_faarroz.tsx + _faarroz_assets.txt.
//
//   node build_faarroz.mjs
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SLUG = "faarroz";
const FPS = 30;
const APERTURA_AVATAR_MIN_S = 3.0;   // ⛔ el video ABRE con el avatar hablando, siempre
const MIN_PLANO_S = 1.3;
const MAX_PLANO_S = 9.0;             // mientras el lipsync es REAL: lo que sobra lo sostiene él
const MAX_PLANO_S_T2 = 13.0;         // pasado AVATAR_END el avatar va desfasado: el b-roll cubre casi todo
const MIN_VENTANA_S = 1.4;
const MIN_VENTANA_S_T2 = 99;         // en el tramo 2 NO se abre ninguna ventana nueva de avatar
const FUNDE_MISMO_LUGAR_S = 7.5;     // sostener la foto entera en vez de cortar: es lo que rompe el metrónomo
const FUNDE_SI_MENOR_S = 3.0;        // sólo se absorbe un momento CORTO; uno sustancial se queda con su plano
const QR = "med/faarroz_qr.png";
const DOMINIO = "drfederer.com";
const CTA_MIN_S = 9.5;               // hay que poder escanearlo
const ENDCARD_S = 9.0;               // el CTA del cierre cubre los últimos segundos, no un destello

const F = (s) => Math.round(s * FPS);
const FF = `${process.env.HOME || process.env.USERPROFILE}/AppData/Local/Microsoft/WinGet/Links/ffprobe.exe`;
const probe = (args) => execFileSync(FF, args, { encoding: "utf8" }).trim();

const WAV_S = Number(probe(["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", `public/${SLUG}.wav`]));
const AVATAR_FRAMES = parseInt(probe(["-v", "error", "-select_streams", "v", "-count_packets",
  "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", `public/${SLUG}_opt.mp4`]), 10);
const TOTAL = Math.ceil(WAV_S * FPS);

const mom = JSON.parse(fs.readFileSync(`_v3/${SLUG}_mom.json`, "utf8"));
const plan = JSON.parse(fs.readFileSync(`_v3/${SLUG}_plan.json`, "utf8")).momentos;
const COMPS = JSON.parse(fs.readFileSync(`_v3/${SLUG}_comps.json`, "utf8"));

// ---------- 0. el asset de cada momento, por su PROPIO índice ----------
// ⛔ Repartir con un contador corrido desfasa todo lo que sigue y cada plano termina mostrando el
//    objeto del momento VECINO (medido en otro video: 22 de 52 planos no pegaban).
const framesDe = new Map();
const contarFrames = (rel) => {
  if (framesDe.has(rel)) return framesDe.get(rel);
  let n = 0;
  try {
    n = parseInt(probe(["-v", "error", "-select_streams", "v", "-count_packets",
      "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", path.join("public", rel)]), 10) || 0;
  } catch { n = 0; }
  framesDe.set(rel, n);
  return n;
};
const assetDe = (name) => {
  if (!name) return null;
  const clip = `broll/${SLUG}/${name}.mp4`;
  if (fs.existsSync(path.join("public", clip))) return { tipo: "clip", src: clip, frames: contarFrames(clip) };
  for (const e of [".png", ".jpg"]) {
    const rel = `img/${name}${e}`;
    if (fs.existsSync(path.join("public", rel))) return { tipo: "foto", src: rel };
  }
  return null;
};

const faltan = [];
for (const m of mom) {
  const p = plan[m.i];
  m.lugar = p?.lugar || "?";
  if (m.tipo === "avatar") continue;
  if (m.tipo === "componente") {
    const k = String(m.i);
    if (COMPS.lamina[k]) { const a = assetDe(COMPS.lamina[k]); if (a) Object.assign(m, a, { esLamina: true }); else faltan.push(`lamina ${COMPS.lamina[k]}`); continue; }
    if (COMPS.cta.includes(k)) { m.tipo = "cta"; continue; }
    const c = COMPS.map[k];
    if (!c) { faltan.push(`componente sin contenido: i=${k} (${m.sec})`); continue; }
    m.comp = c;
    continue;
  }
  const a = assetDe(m.name);
  if (!a) { faltan.push(m.name || `i=${m.i}`); continue; }
  Object.assign(m, a);
}
// RECAP: momentos de AVATAR largos donde la voz vuelve a nombrar una secuencia ya mostrada. Dejarlos
// como cabeza parlante desperdicia el momento en que el espectador quiere repasar los pasos. No es
// "repetir el asset del vecino": la frase nombra EXACTAMENTE esos pasos otra vez.
for (const m of mom) {
  const lista = (COMPS.recap || {})[String(m.i)];
  if (!lista || !Array.isArray(lista)) continue;
  const piezas = lista.map((n) => assetDe(n)).filter(Boolean);
  if (piezas.length < 2) { faltan.push(`recap i=${m.i} sin assets`); continue; }
  m.tipo = "recap"; m.recap = piezas;
}

// ---------- 1. ANTI-METRÓNOMO: fundir momentos vecinos del MISMO lugar ----------
// ⛔ Si TODOS los momentos llevan plano propio, cada uno rinde ~4 s y salen mediana 3,9 / p75 4,9:
//    diez centésimas entre mediana y p75 ES el metrónomo que el creador describe como "cambia una
//    por segundo, cansa". Ensanchar la escalera de duraciones NO lo arregla. El arreglo es
//    ESTRUCTURAL: parte de los momentos no llevan plano propio y los sostiene la foto entera.
//    Se funden sólo vecinos del MISMO `lugar`, así el contexto de la frase no se rompe.
const mm = [];
for (const b of mom) {
  const prev = mm[mm.length - 1];
  const fundible = prev && prev.tipo && b.tipo === prev.tipo && b.tipo !== "cta" && !b.comp && !prev.comp &&
    b.lugar === prev.lugar && b.src === undefined ? false : null;
  const mismoLugar = prev && b.lugar === prev.lugar && b.tipo && prev.tipo &&
    b.tipo !== "cta" && prev.tipo !== "cta" && !b.comp && !prev.comp && !b.esLamina && !prev.esLamina;
  const cap = (prev && F(prev.start) >= AVATAR_FRAMES) ? MAX_PLANO_S_T2 : FUNDE_MISMO_LUGAR_S;
  if (prev && ((b.dur < MIN_PLANO_S) || (mismoLugar && b.dur < FUNDE_SI_MENOR_S && (b.end - prev.start) <= cap))) {
    prev.end = b.end; prev.dur = +(prev.end - prev.start).toFixed(3);
    continue;
  }
  mm.push({ ...b });
  void fundible;
}

// ---------- 2. cues alineados al FRAME, sin huecos de 1 cuadro ----------
// ⛔ `from={sec(start)}` y `durationInFrames={sec(dur)}` redondean por separado -> destellos del
//    fondo de 33 ms en cada frontera; `blackdetect` no los ve (pide 0,4 s) y el ojo sí.
const cues = [];
// ⛔ `m.tipo === "avatar"` es una CADENA, o sea truthy: sin excluirlo explícitamente pasa el
//    filtro, cae al final del if/else y se emite como <Foto src="undefined">. Son 55 cues que
//    matan 23 chunks con `staticFile(undefined)`, y la compuerta de assets NO lo ve porque
//    "undefined" nunca entra a la lista de assets.
const usables = mm.filter((m) => (m.tipo && m.tipo !== "avatar" && m.src) || m.comp || m.tipo === "cta" || m.tipo === "recap");
for (let k = 0; k < usables.length; k++) {
  const m = usables[k];
  const sig = usables[k + 1];
  const f0 = F(m.start);
  let f1 = F(m.end);
  if (sig && Math.abs(F(sig.start) - f1) <= 1) f1 = F(sig.start);
  f1 = Math.min(f1, TOTAL);
  if (f1 - f0 < 2) continue;

  if (m.tipo === "cta") {
    const dur = Math.min(Math.max(F(CTA_MIN_S), f1 - f0), TOTAL - f0);
    cues.push({ key: `cta${m.i}`, start: f0, dur, capa: "over", tipo: "cta" });
    continue;
  }
  if (m.comp) {
    // los overlay PUEDEN pasarse de su hueco: flotan sobre lo que venga y no le roban tiempo a nadie.
    // ⛔ Y el piso sale del TEXTO, no del hueco: aplastar un efecto contra el slot deja carteles de
    //    0,25 s que nadie llega a leer (medido: 30 de 57 efectos por debajo de 2 s).
    const palabras = JSON.stringify(m.comp.props).split(/\s+/).length;
    const piso = (m.comp.pieza === "Rotulo" || m.comp.pieza === "Aviso" ? 2.0 : 2.8) + Math.max(0, palabras - 3) * 0.09;
    let cs = f0, cd = Math.min(Math.max(f1 - f0, F(piso)), TOTAL - f0);
    if (m.comp.pieza === "Cta") {
      // ⛔ Un CTA de 1,5 s no se puede escanear. El endcard se ESTIRA HACIA ATRÁS hasta cubrir los
      //    últimos ENDCARD_S, en vez de quedar como un destello en el último segundo.
      const quiere = F(ENDCARD_S);
      if (cd < quiere) { cs = Math.max(0, Math.min(f0, TOTAL - quiere)); cd = TOTAL - cs; }
    }
    cues.push({ key: `c${m.i}`, start: cs, dur: cd, capa: "over", comp: m.comp });
    continue;
  }
  if (m.tipo === "recap") {
    const n = m.recap.length;
    const paso = Math.floor((f1 - f0) / n);
    for (let s = 0; s < n; s++) {
      const a0 = f0 + paso * s;
      const a1 = s === n - 1 ? f1 : f0 + paso * (s + 1);
      if (a1 - a0 < 2) continue;
      const el2 = m.recap[s];
      cues.push({ key: `r${String(m.i).padStart(3, "0")}_${s}`, start: a0, dur: a1 - a0, capa: "base",
        tipo: el2.tipo, src: el2.src, frames: el2.frames || 0, i: m.i, recap: true });
    }
    continue;
  }
  const t2 = f0 >= AVATAR_FRAMES;
  const tope = t2 ? MAX_PLANO_S_T2 : MAX_PLANO_S;
  const minv = t2 ? MIN_VENTANA_S_T2 : MIN_VENTANA_S;
  let a1 = f1;
  if ((a1 - f0) / FPS > tope && (a1 - f0 - F(tope)) / FPS >= minv) a1 = f0 + F(tope);
  cues.push({ key: `m${String(m.i).padStart(3, "0")}`, start: f0, dur: a1 - f0, capa: "base",
    tipo: m.tipo, src: m.src, frames: m.frames || 0, esLamina: !!m.esLamina, i: m.i });
}

// ---------- 2.bis. CAMA de foto debajo de cada componente ----------
// ⛔ Un componente sin nada debajo deja el fondo a la vista en el margen, y en el tramo del avatar en
//    bucle deja cientos de instantes con el fondo plano. La cama es la foto del momento anterior.
const base = () => cues.filter((c) => c.capa === "base").sort((a, b) => a.start - b.start);
for (const c of cues.filter((c) => c.capa === "over")) {
  const b = base();
  const tapado = b.some((x) => c.start >= x.start && c.start < x.start + x.dur);
  if (tapado) continue;
  const prev = [...b].reverse().find((x) => x.start <= c.start && x.tipo === "foto");
  if (!prev) continue;
  cues.push({ key: `cama${c.key}`, start: c.start, dur: c.dur, capa: "base", tipo: "foto", src: prev.src, cama: true });
}

// ---------- 2.ter. TILEO CONTIGUO: cerrar los huecos de 1-5 cuadros ----------
// ⛔ Un hueco de 2-5 cuadros es un DESTELLO del fondo de 33-165 ms en cada frontera. `blackdetect`
//    no lo ve (pide 0,4 s) y el ojo sí. Los huecos GRANDES (>5 cuadros) se respetan: son las
//    ventanas deliberadas donde queda el avatar hablando con su lipsync real.
{
  const ocupado = new Uint8Array(TOTAL + 2);
  const marcar = () => { ocupado.fill(0); for (const c of cues) if (c.capa === "base") for (let f = c.start; f < c.start + c.dur && f < TOTAL; f++) ocupado[f] = 1; };
  marcar();
  const b = cues.filter((c) => c.capa === "base").sort((a, z) => a.start - z.start);
  for (const c of b) {
    let f = c.start + c.dur, g = 0;
    while (f + g < TOTAL && !ocupado[f + g] && g <= 5) g++;
    if (g > 0 && g <= 5 && f + g < TOTAL && ocupado[f + g]) { c.dur += g; for (let x = f; x < f + g; x++) ocupado[x] = 1; }
  }
}

// ---------- 2.quater. ACOTAR LAS VENTANAS LARGAS DE AVATAR ----------
// Dejar al presentador hablando es válido y es metraje REAL, pero 40 s seguidos sin un corte es un
// tramo muerto. Donde la ventana pasa de 10 s, se estira el plano ANTERIOR para comerse el exceso
// (nunca se repite el asset del vecino: eso es lo que hace que un plano muestre el objeto de otra frase).
{
  const TECHO_VENTANA_S = 10.0;
  const ESTIRA_MAX_S = 7.0;
  const b = cues.filter((c) => c.capa === "base" && !c.cama).sort((a, z) => a.start - z.start);
  let acotadas = 0;
  for (let k = 0; k < b.length - 1; k++) {
    const fin = b[k].start + b[k].dur;
    const hueco = (b[k + 1].start - fin) / FPS;
    if (hueco <= TECHO_VENTANA_S) continue;
    const estira = Math.min(F(ESTIRA_MAX_S), F(hueco - TECHO_VENTANA_S));
    if (estira > 0) { b[k].dur += estira; acotadas++; }
  }
  globalThis.__acotadas = acotadas;
}

// ---------- 3. APERTURA: los primeros segundos son del avatar, SIEMPRE ----------
const APERTURA_F = F(Math.max(APERTURA_AVATAR_MIN_S, mm[0].end));
for (let k = cues.length - 1; k >= 0; k--) {
  const c = cues[k];
  if (c.capa !== "base") continue;
  const fin = c.start + c.dur;
  if (fin <= APERTURA_F) { cues.splice(k, 1); continue; }
  if (c.start < APERTURA_F) { c.dur = fin - APERTURA_F; c.start = APERTURA_F; }
}

// ---------- 4. emitir los cues ----------
const j = (o) => JSON.stringify(o);
const el = (c) => {
  if (c.tipo === "cta") return `<Cta qr="${QR}" dominio="${DOMINIO}" />`;
  if (c.comp) {
    // ⛔ El CTA necesita `qr` y `dominio` SIEMPRE. Declararlo en el mapa de componentes con sólo
    //    `sinSalida` dejaba `qr` en undefined -> staticFile(undefined) -> muere el chunk del final.
    //    El build los inyecta acá para que no dependa de que el mapa se acuerde.
    const props = c.comp.pieza === "Cta" ? { qr: QR, dominio: DOMINIO, ...c.comp.props } : c.comp.props;
    return `<${c.comp.pieza} {...(${j(props)} as any)} />`;
  }
  if (c.tipo === "clip") return `<Clip src="${c.src}" seed={${c.start}} frames={${c.frames}} />`;
  if (c.tipo === "foto" && c.src) return `<Foto src="${c.src}" seed={${c.start}} />`;
  throw new Error(`cue sin forma válida: key=${c.key} tipo=${c.tipo} src=${c.src}`);
};
fs.mkdirSync(`src/${SLUG}`, { recursive: true });
fs.writeFileSync(`src/${SLUG}/cues_${SLUG}.gen.tsx`, `// cues_${SLUG}.gen.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
import React from "react";
import { Clip, Foto, Cta, Rotulo, Cifra, Compara, Linea, Lista, Aviso } from "./Piezas";

export type Cue = { key: string; start: number; dur: number; capa: "base" | "over"; el: () => React.ReactNode };

export const CUES_FAARROZ: Cue[] = [
${cues.sort((a, b) => a.start - b.start).map((c) => `  { key: "${c.key}", start: ${c.start}, dur: ${c.dur}, capa: "${c.capa}", el: () => ${el(c)} },`).join("\n")}
];
`);

// ---------- 5. el Main ----------
const nLoops = Math.max(0, Math.ceil((TOTAL - AVATAR_FRAMES) / AVATAR_FRAMES));
const loops = Array.from({ length: nLoops }, (_, k) => {
  const from = AVATAR_FRAMES * (k + 1);
  const dur = Math.min(AVATAR_FRAMES, TOTAL - from);
  return dur > 0 ? `      <Sequence from={${from}} durationInFrames={${dur}}>
        <OffthreadVideo src={staticFile("${SLUG}_opt.mp4")} muted style={est} />
      </Sequence>` : "";
}).filter(Boolean).join("\n");

fs.writeFileSync(`src/${SLUG}/Main_${SLUG}.tsx`, `// Main_${SLUG}.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_FAARROZ } from "./cues_${SLUG}.gen";

export const TOTAL_FRAMES_FAARROZ = ${TOTAL};
const AVATAR_FRAMES = ${AVATAR_FRAMES};

/** ⛔ OffthreadVideo, NUNCA <Video>: es la causa #1 del "se ve todo lageado".
 *  ⛔ Y nunca estático: un avatar full quieto se lee como una videollamada. */
const AvatarPiso: React.FC = () => {
  const f = useCurrentFrame();
  const s = 1.035 + Math.sin(f / 900) * 0.022;
  const dx = Math.sin(f / 1300) * 0.5;
  const est: React.CSSProperties = {
    width: "100%", height: "100%", objectFit: "cover",
    transform: \`scale(\${s.toFixed(4)}) translateX(\${dx.toFixed(3)}%)\`,
  };
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08", overflow: "hidden" }}>
      <Sequence from={0} durationInFrames={Math.min(AVATAR_FRAMES, ${TOTAL})}>
        <OffthreadVideo src={staticFile("${SLUG}_opt.mp4")} muted style={est} />
      </Sequence>
${loops}
    </AbsoluteFill>
  );
};

export const MainFaarroz: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
    <AvatarPiso />
    {CUES_FAARROZ.filter((c) => c.capa === "base").map((c) => (
      <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
        <AbsoluteFill>{c.el()}</AbsoluteFill>
      </Sequence>
    ))}
    {CUES_FAARROZ.filter((c) => c.capa === "over").map((c) => (
      <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
        <AbsoluteFill>{c.el()}</AbsoluteFill>
      </Sequence>
    ))}
    {/* ⛔ el máster va en m4a EN EL TAR (el wav de 268 MB x 60 chunks son ~16 GB de transferencia);
        el WAV suelto se sube al release, que es de donde lo baja el stitch. */}
    <Audio src={staticFile("${SLUG}.m4a")} />
  </AbsoluteFill>
);
`);

// ---------- 6. entry propio ----------
// ⛔ SIN entry propio el farm usa src/index.tsx COMPARTIDO, que otra sesión dejó apuntando a otro
//    video -> los 60 chunks mueren con "Could not find composition".
fs.writeFileSync(`src/index_${SLUG}.tsx`, `import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainFaarroz, TOTAL_FRAMES_FAARROZ } from "./${SLUG}/Main_${SLUG}";

const Root: React.FC = () => (
  <Composition id="Faarroz" component={MainFaarroz}
    durationInFrames={TOTAL_FRAMES_FAARROZ} fps={${FPS}} width={1920} height={1080} />
);
registerRoot(Root);
`);

// ---------- 7. lista de assets ----------
const assets = new Set();
for (const c of cues) if (c.src) assets.add(c.src);
assets.add(QR);
const enDisco = [...assets].filter((a) => fs.existsSync(path.join("public", a)));
const sinDisco = [...assets].filter((a) => !fs.existsSync(path.join("public", a)));
fs.writeFileSync(`_${SLUG}_assets.txt`, enDisco.join("\n") + "\n");

// cues en SEGUNDOS para el animático: revisar la EDICIÓN antes de gastar un render del farm.
// Un defecto editorial (ritmo de metrónomo, un plano que no pega, minutos en el mismo lugar) se
// descubre acá en dos minutos, o veinte minutos y una corrida después.
fs.writeFileSync(`_v3/${SLUG}_cues.json`, JSON.stringify(cues.filter((c) => c.capa === "base" && c.src)
  .map((c) => ({ key: c.key, start: +(c.start / FPS).toFixed(3), dur: +(c.dur / FPS).toFixed(3), src: c.src })), null, 1));

// ---------- 8. COMPUERTAS ----------
const REQUERIDAS = { Cta: ["qr", "dominio"], Rotulo: ["titulo"], Cifra: ["cifra"],
  Compara: ["izqT", "izq", "derT", "der"], Linea: ["hitos"], Lista: ["titulo", "items"], Aviso: ["texto"] };
const prob = [];
{
  // cada pieza declara qué props NO puede no tener. Se mide sobre lo que REALMENTE se emitió.
  let revisados = 0; const malos = [];
  for (const c of cues.filter((x) => x.comp)) {
    revisados++;
    const props = c.comp.pieza === "Cta" ? { qr: QR, dominio: DOMINIO, ...c.comp.props } : c.comp.props;
    for (const r of (REQUERIDAS[c.comp.pieza] || [])) {
      const v = props[r];
      if (v === undefined || v === null || v === "" || (Array.isArray(v) && !v.length)) malos.push(`${c.key} ${c.comp.pieza}.${r}`);
    }
  }
  console.log(`contratos de componentes ... ${revisados} cues revisados · props requeridas faltantes: ${malos.length}`);
  if (malos.length) prob.push(`${malos.length} componentes sin una prop REQUERIDA: ${malos.slice(0, 5).join(", ")}`);
}
const srcMalo = cues.filter((c) => c.capa === "base" && (!c.src || String(c.src).includes("undefined")));
if (srcMalo.length) prob.push(`${srcMalo.length} cues con src indefinido (staticFile(undefined) mata el chunk): ${srcMalo.slice(0, 5).map((c) => c.key).join(", ")}`);
if (faltan.length) prob.push(`${faltan.length} momentos sin asset: ${faltan.slice(0, 8).join(", ")}`);
if (sinDisco.length) prob.push(`${sinDisco.length} assets citados que NO existen: ${sinDisco.slice(0, 6).join(", ")}`);
if (!fs.existsSync(`public/${SLUG}.m4a`)) prob.push(`falta public/${SLUG}.m4a (el Main lo referencia)`);

// ⛔ ningún <Video> (filtrando COMENTARIOS: el propio aviso dispara falso positivo)
for (const f of fs.readdirSync(`src/${SLUG}`).filter((x) => x.endsWith(".tsx"))) {
  const crudo = fs.readFileSync(path.join("src", SLUG, f), "utf8");
  const s = crudo.split("\n").filter((L) => { const t = L.trim(); return !t.startsWith("//") && !t.startsWith("*") && !t.startsWith("/*"); }).join("\n");
  if (s.includes("<Video ") || s.includes("<Video>")) prob.push(`${f} usa <Video> (va OffthreadVideo)`);
}

// ⛔ todo clip a 30/1 (24 o 25 fps = judder irregular en toda la comp) y con sus cuadros contados
const malFps = [], sinFrames = [];
for (const c of cues.filter((c) => c.tipo === "clip")) {
  try {
    const r = probe(["-v", "error", "-select_streams", "v", "-show_entries", "stream=r_frame_rate", "-of", "csv=p=0", path.join("public", c.src)]);
    if (r !== "30/1") malFps.push(`${path.basename(c.src)}=${r}`);
  } catch { malFps.push(`${path.basename(c.src)}=?`); }
  if (!c.frames || c.frames < 2) sinFrames.push(path.basename(c.src));
}
if (malFps.length) prob.push(`${malFps.length} clips fuera de 30/1: ${malFps.slice(0, 5).join(", ")}`);
if (sinFrames.length) prob.push(`${sinFrames.length} clips sin cuadros contados (el <Loop> necesita el número REAL): ${sinFrames.slice(0, 4).join(", ")}`);

const B = base();
let cub = 0, tot = 0;
for (let f = 0; f < TOTAL; f += 6) { tot++; if (B.some((c) => f >= c.start && f < c.start + c.dur)) cub++; }
// ⛔ destellos y ventanas se miden sobre la OCUPACIÓN del timeline, no sobre pares consecutivos:
// las camas de foto se superponen con los componentes y un medidor por pares cuenta huecos que
// NO existen (y se pierde los que sí, cuando un cue lejano cubre el tramo).
const ocup = new Uint8Array(TOTAL + 2);
for (const c of B) for (let f = c.start; f < c.start + c.dur && f < TOTAL; f++) ocup[f] = 1;
let destellos = 0, ventanas = 0;
for (let f = F(APERTURA_AVATAR_MIN_S); f < TOTAL;) {
  if (ocup[f]) { f++; continue; }
  let g = 0; while (f + g < TOTAL && !ocup[f + g]) g++;
  if (g <= 5) destellos++; else ventanas++;
  f += g;
}
const repes = B.filter((c, k) => k && c.src && c.src === B[k - 1].src && !c.esLamina && !c.cama).length;
const durs = B.filter((c) => !c.cama).map((c) => c.dur / FPS).sort((a, b) => a - b);
const q = (f) => durs[Math.floor(durs.length * f)] || 0;

console.log(`=== BUILD ${SLUG} ===`);
console.log(`momentos ................. ${mom.length} -> ${mm.length} planos (fundidos ${mom.length - mm.length} del mismo lugar)`);
console.log(`cues base ................ ${B.length}  (clip ${B.filter((c) => c.tipo === "clip").length} · foto ${B.filter((c) => c.tipo === "foto").length} · camas ${B.filter((c) => c.cama).length})`);
console.log(`cues over ................ ${cues.filter((c) => c.capa === "over").length}  (componentes ${cues.filter((c) => c.comp).length} · cta ${cues.filter((c) => c.tipo === "cta").length})`);
console.log(`piezas distintas ......... ${new Set(cues.filter((c) => c.comp).map((c) => c.comp.pieza)).size}  ${[...new Set(cues.filter((c) => c.comp).map((c) => c.comp.pieza))].join(", ")}`);
console.log(`assets en el tar ......... ${enDisco.length}`);
console.log(`TOTAL_FRAMES ............. ${TOTAL}  (${(TOTAL / FPS).toFixed(2)} s · wav ${WAV_S.toFixed(2)} s)`);
console.log(`avatar ................... ${AVATAR_FRAMES} cuadros (${(AVATAR_FRAMES / FPS / 60).toFixed(1)} min) + ${nLoops} bucle(s)`);
console.log(`cobertura de b-roll ...... ${(cub / tot * 100).toFixed(1)}%   (el resto es el avatar, que es metraje REAL)`);
{
  let c2 = 0, t2 = 0;
  for (let f = AVATAR_FRAMES; f < TOTAL; f += 6) { t2++; if (B.some((c) => f >= c.start && f < c.start + c.dur)) c2++; }
  const pct2 = t2 ? c2 / t2 * 100 : 100;
  console.log(`cobertura TRAMO 2 (bucle)  ${pct2.toFixed(1)}%   ⛔ el avatar va desfasado: tiene que ser >=95%`);
  if (pct2 < 95) prob.push(`cobertura del tramo 2 ${pct2.toFixed(1)}% (<95%): el avatar en bucle queda a la vista con los labios desfasados`);
}
console.log(`ventanas de avatar ....... ${ventanas} (deliberadas, en el tramo con lipsync real) · acotadas por largas: ${globalThis.__acotadas || 0}`);
{
  // ninguna ventana puede pasar de ~10 s: es un tramo muerto aunque el lipsync sea real
  const oc2 = new Uint8Array(TOTAL + 2);
  for (const c of B) for (let f = c.start; f < c.start + c.dur && f < TOTAL; f++) oc2[f] = 1;
  let peor = 0, peorEn = 0;
  for (let f = F(APERTURA_AVATAR_MIN_S); f < TOTAL;) { if (oc2[f]) { f++; continue; } let g = 0; while (f + g < TOTAL && !oc2[f + g]) g++; if (g > peor) { peor = g; peorEn = f; } f += g; }
  console.log(`ventana más larga ........ ${(peor / FPS).toFixed(1)} s en el minuto ${(peorEn / FPS / 60).toFixed(1)}   (techo 10 s)`);
  // ⛔ El techo NO es el mismo en los dos tramos, y confundirlos es calibrar mal:
  //    · TRAMO 1 (lipsync REAL): una ventana es el presentador HABLANDO A CÁMARA. Es metraje real y
  //      a veces es lo correcto — la de 16 s del minuto 1 es "se lo doy ya, sin vueltas… anote",
  //      donde la cara sostiene la promesa. Techo 18 s.
  //    · TRAMO 2 (bucle MUDO): cualquier ventana deja los labios desfasados a la vista. Techo 2 s.
  const t1 = peorEn < AVATAR_FRAMES;
  const techo = t1 ? 18 : 2;
  if (peor / FPS > techo) prob.push(`ventana de avatar de ${(peor / FPS).toFixed(1)}s en el minuto ${(peorEn / FPS / 60).toFixed(1)} (${t1 ? "tramo 1, techo 18s" : "TRAMO 2 EN BUCLE, techo 2s"})`);
  // y la peor del TRAMO 2 se mide aparte: ahí no hay excusa
  let peor2 = 0, peor2En = 0;
  for (let f = AVATAR_FRAMES; f < TOTAL;) { if (oc2[f]) { f++; continue; } let g = 0; while (f + g < TOTAL && !oc2[f + g]) g++; if (g > peor2) { peor2 = g; peor2En = f; } f += g; }
  console.log(`ventana más larga TRAMO 2 .. ${(peor2 / FPS).toFixed(1)} s en el minuto ${(peor2En / FPS / 60).toFixed(1)}   (techo 2 s: el avatar va MUDO ahí)`);
  if (peor2 / FPS > 2) prob.push(`ventana de ${(peor2 / FPS).toFixed(1)}s en el TRAMO 2 (minuto ${(peor2En / FPS / 60).toFixed(1)}): el avatar en bucle queda a la vista con los labios desfasados`);
}
console.log(`destellos (hueco 1-5 cuadros) ${destellos}   ⛔ tiene que dar 0`);
console.log(`planos repetidos seguidos  ${repes}`);
console.log(`plano p25/med/p75/max .... ${q(.25).toFixed(1)} / ${q(.5).toFixed(1)} / ${q(.75).toFixed(1)} / ${(durs[durs.length - 1] || 0).toFixed(1)} s`);
console.log(`planos >=5 s ............. ${durs.filter((d) => d >= 5).length} (${(durs.filter((d) => d >= 5).length / Math.max(1, durs.length) * 100).toFixed(0)}%)   vara ~40%`);

// ⛔⛔ KEN BURNS: los zooms no pueden ser todos iguales NI alternar en un patrón perfecto.
const hash2 = (a, b) => { let x = Math.imul((a | 0) ^ 0x9e3779b9, 0x85ebca6b); x = Math.imul(x ^ (b | 0) ^ (x >>> 13), 0xc2b2ae35); return ((x ^ (x >>> 16)) >>> 0) / 4294967296; };
{
  const sent = B.map((c) => hash2(c.start, 2) > 0.5);
  const outs = sent.filter((z) => !z).length;
  const pctOut = sent.length ? outs / sent.length * 100 : 0;
  let r = 1, peor = 1;
  for (let k = 1; k < sent.length; k++) { r = sent[k] === sent[k - 1] ? r + 1 : 1; peor = Math.max(peor, r); }
  console.log(`ken burns ................ ${pctOut.toFixed(0)}% OUT / ${(100 - pctOut).toFixed(0)}% IN · racha máxima ${peor}`);
  if (pctOut < 35 || pctOut > 65) prob.push(`ken burns: ${pctOut.toFixed(0)}% de zoom out (tiene que estar entre 35% y 65%)`);
  // techo calibrado con simulación de azar justo: mediana 8, p90 11, p99 14. Exigir rachas cortas
  // obligaría a ALTERNAR, que es el patrón mecánico que el creador rechaza.
  if (peor > 14) prob.push(`ken burns: ${peor} planos seguidos con el mismo sentido (p99 del azar justo = 14)`);
}

const antes = B.filter((c) => c.start < APERTURA_F);
console.log(`apertura del avatar ...... ${(APERTURA_F / FPS).toFixed(2)} s   (b-roll antes: ${antes.length}, tiene que ser 0)`);
if (antes.length) prob.push(`${antes.length} planos arrancan antes de ${(APERTURA_F / FPS).toFixed(2)}s: el video TIENE que abrir con el avatar hablando`);
if (destellos) prob.push(`${destellos} destellos del fondo entre planos (hueco de 1-5 cuadros)`);
for (const c of cues.filter((c) => c.tipo === "cta")) console.log(`CTA ...................... ${(c.start / FPS / 60).toFixed(1)} min por ${(c.dur / FPS).toFixed(1)} s`);
console.log(`problemas ................ ${prob.length}`);
for (const p of prob) console.log("  ⛔ " + p);
if (prob.length) process.exit(1);

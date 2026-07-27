// gen_cues_vucm3bvd4u3k.mjs — plan de dirección + assets EN DISCO → cues_vucm3bvd4u3k.gen.tsx
//
// El render lee ESTE archivo generado, no el plan. Si editás el plan a mano hay que
// volver a correr este script o el arreglo no viaja (regla dura del pipeline).
//
// Cada cue emite JSX EXPLÍCITO (un elemento por beat): así la compuerta de densidad
// puede contar de verdad los usos de componente, y el diff muestra qué cambió.
//
//   node scripts/gen_cues_vucm3bvd4u3k.mjs
import fs from "fs";
import path from "path";

const SLUG = "vucm3bvd4u3k";
const FPS = 30;
const TOTAL_SEC = 1800; // = largo exacto del avatar (nunca menos que el wav)
const ACC = "#E9B44C";

let plan = JSON.parse(fs.readFileSync(`_v3/plan_${SLUG}.json`, "utf8"));

/* ── LA PIZARRA se come su tramo ───────────────────────────────────────────────
 * La escena de FedWhiteboard está autorada con tiempos ANCLADOS al ms de Whisper
 * (arranca en 280.2s, dura 47.7s: de "De día vos caminás" a "dejó de trabajar
 * hace dos horas"). Un cue de 5s mostraría sólo el primer trazo del diagrama, así
 * que la pizarra ocupa el tramo entero y los beats que cubre se descartan.
 * Es la ÚNICA escena larga del video, y está permitida porque es un visual CON
 * TEXTO que se está construyendo (la excepción a los 3s por plano). */
const WB_START = 280.2, WB_DUR = 47.7;
{
  const wbIdx = plan.findIndex((p) => p.comp === "FedWhiteboard");
  const tapados = plan.filter((p) => p.sec >= WB_START - 0.01 && p.sec < WB_START + WB_DUR);
  if (wbIdx >= 0 && tapados.length) {
    const wb = { ...plan[wbIdx], sec: WB_START, dur: WB_DUR, mode: "comp", comp: "FedWhiteboard", variant: "fold" };
    plan = plan.filter((p) => !(p.sec >= WB_START - 0.01 && p.sec < WB_START + WB_DUR));
    plan.push(wb);
    plan.sort((a, b) => a.sec - b.sec);
    console.log(`  pizarra: ${WB_START}s +${WB_DUR}s (reemplaza ${tapados.length} beats: ${tapados[0].name}→${tapados[tapados.length - 1].name})`);
  }
}

/* ── imágenes disponibles para los componentes del kit ────────────────────────
 * FedHero/FedStat/FedStep/FedQuote/FedMolecule/FedCta/FedBeforeAfter renderizan
 * un <Img> cuyo DEFAULT apunta a public/med/*.png (romero, piel, crema…), que es
 * material de otro video: off-topic. A cada componente le inyecto la imagen
 * generada más cercana EN EL TIEMPO, que es la que habla del mismo tema. */
const CON_IMAGEN = new Set(["FedHero", "FedStat", "FedStep", "FedQuote", "FedMolecule", "FedCta"]);
const imgTimeline = plan
  .filter((p) => p.mode === "shot" && p.asset !== "yt")
  .map((p) => ({ sec: p.sec, nm: p.img || `${SLUG}_${p.name}` }));
const imgCercana = (sec) => {
  let best = null, bd = Infinity;
  for (const it of imgTimeline) {
    const d = Math.abs(it.sec - sec);
    if (d < bd) { bd = d; best = it.nm; }
  }
  return best;
};

/* ── assets en disco ─────────────────────────────────────────────────────────── */
const BROLL_DIR = `public/broll/${SLUG}`;
const brollFiles = fs.existsSync(BROLL_DIR)
  ? fs.readdirSync(BROLL_DIR).filter((f) => /\.(mp4|webm|mov)$/i.test(f))
  : [];
// clips_<slug>_matched.json mapea beat → nombre de archivo
let matched = [];
for (const p of [`public/broll/clips_${SLUG}_matched.json`]) {
  if (fs.existsSync(p)) matched = JSON.parse(fs.readFileSync(p, "utf8"));
}
const clipDeBeat = new Map();
for (const m of matched) {
  const cand = brollFiles.find((f) => f.replace(/\.[^.]+$/, "") === m.name)
    || brollFiles.find((f) => f.startsWith(m.name));
  if (cand) clipDeBeat.set(m.name, cand);
}
// si el matched no trajo nombres, reparto los clips que HAYA en orden de beat
const imgExt = (nm) => ["jpg", "png", "jpeg", "webp"].find((e) => fs.existsSync(`public/img/${nm}.${e}`));

/* ── helpers de emisión ──────────────────────────────────────────────────────── */
const esc = (s) => String(s ?? "").replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\r?\n/g, " ").trim();
const jsxStr = (s) => `'${esc(s)}'`;
const jsxArr = (a) => `[${(a || []).map(jsxStr).join(", ")}]`;
const num = (n) => (Number.isFinite(+n) ? String(+n) : "0");

// props de componente → atributos JSX (sólo los que el kit acepta)
const PROPS_OK = {
  FedChapter: ["kicker", "index", "title", "sub"],
  FedHero: ["kicker", "title", "hot", "sub", "image", "side", "framed"],
  FedStat: ["kicker", "value", "prefix", "suffix", "decimals", "label", "sub"],
  FedQuote: ["kicker", "quote", "author", "role"],
  FedMolecule: ["kicker", "title", "hot", "sub", "centerLabel", "nodes"],
  FedStep: ["step", "total", "title", "hot", "sub"],
  FedBeforeAfter: ["kicker", "title", "hot", "labelA", "labelB", "imageA", "imageB"],
  FedLowerThird: ["name", "role", "topic"],
  FedChecklist: ["kicker", "title", "hot", "items"],
  FedCta: ["kicker", "title", "hot", "sub", "buttonLabel"],
};
const NUMPROPS = new Set(["value", "decimals", "step", "total"]);
const BOOLPROPS = new Set(["framed"]);

function attrs(comp, props = {}) {
  const ok = PROPS_OK[comp] || [];
  const out = [];
  for (const k of ok) {
    const v = props[k];
    if (v === undefined || v === null || v === "") continue;
    if (typeof v === "string" && v.startsWith("IMG:")) {
      // ruta de asset → staticFile(), no un string suelto
      out.push(`${k}={staticFile('${v.slice(4)}')}`);
    } else if (NUMPROPS.has(k)) out.push(`${k}={${num(v)}}`);
    else if (BOOLPROPS.has(k)) out.push(v ? `${k}` : `${k}={false}`);
    else if (Array.isArray(v)) {
      if (k === "nodes") out.push(`nodes={[${v.map((n) => `{label: ${jsxStr(typeof n === "string" ? n : n.label)}}`).join(", ")}]}`);
      else out.push(`${k}={${jsxArr(v)}}`);
    } else out.push(`${k}=${jsxStr(v)}`);
  }
  return out.join(" ");
}

const VARIANTS = ["whip", "lift", "iris", "fold"];
const overlay = (text, center, delay = 0.35) =>
  center
    ? `<AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: '9%'}}>\n        <KickerCenter text=${jsxStr(text)} accent={A} startSec={${delay}} />\n      </AbsoluteFill>`
    : `<AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'flex-start', padding: '0 7% 9%'}}>\n        <Kicker text=${jsxStr(text)} accent={A} startSec={${delay}} />\n      </AbsoluteFill>`;

/* ── construcción ────────────────────────────────────────────────────────────── */
const cues = [];
const usados = new Set();
let sinAsset = 0, nClips = 0, nImgs = 0, nComp = 0, nAvatar = 0, nFallbackImg = 0;
let prevVariant = null;
let centerToggle = false;

plan.forEach((p, i) => {
  const durF = Math.max(2, Math.round(p.dur * FPS));
  const id = p.name;

  // variante de transición: null = corte SECO. Nunca dos iguales seguidas.
  let variant = p.variant === null || p.variant === undefined ? null : String(p.variant);
  if (variant && !VARIANTS.includes(variant)) variant = "whip";
  if (variant && variant === prevVariant) variant = VARIANTS[(VARIANTS.indexOf(variant) + 1) % 4];
  if (variant) prevVariant = variant;

  if (p.mode === "avatar") {
    nAvatar++;
    const node = p.kicker
      ? overlay(p.kicker, true, 0.45)
      : "null";
    cues.push({ id, start: p.sec, dur: p.dur, avatar: true, node });
    return;
  }

  if (p.mode === "comp") {
    nComp++;
    const comp = p.comp;
    if (comp === "FedWhiteboard") {
      cues.push({ id, start: p.sec, dur: p.dur, avatar: false,
        node: `<FedWhiteboardVucm totalF={${durF}} />` });
      return;
    }
    if (!PROPS_OK[comp]) { // componente inexistente → no inventar: cae a avatar
      sinAsset++; nComp--; nAvatar++;
      cues.push({ id, start: p.sec, dur: p.dur, avatar: true, node: "null" });
      return;
    }
    // inyectar imagen on-topic donde el kit tiraría a los defaults de public/med
    const props = { ...(p.props || {}) };
    // ⛔ Los directores a veces escriben image/imageA/imageB como DESCRIPCIÓN de la
    // foto ("real phone photo of an older man walking…") en vez de una ruta. Eso
    // termina en <Img src="real phone photo…"> → asset roto y el frame NO renderiza
    // (lo cazó la cuadrícula del auditor en b158). Todo lo que no parezca ruta de
    // asset se descarta y se reemplaza por una imagen real de la biblioteca.
    const esRuta = (v) => typeof v === "string" && /^(IMG:|img\/|broll\/|med\/|real\/)/.test(v);
    for (const k of ["image", "imageA", "imageB"]) {
      if (props[k] !== undefined && !esRuta(props[k])) delete props[k];
    }
    if (CON_IMAGEN.has(comp) && !props.image) {
      const nm = imgCercana(p.sec);
      const e = nm && imgExt(nm);
      if (e) props.image = `IMG:img/${nm}.${e}`;
    }
    if (comp === "FedBeforeAfter") {
      for (const [k, off] of [["imageA", -1], ["imageB", 1]]) {
        if (props[k]) continue;
        const cand = imgTimeline
          .map((it) => ({ ...it, d: (it.sec - p.sec) * off }))
          .filter((it) => it.d > 0)
          .sort((x, y) => x.d - y.d)[0] || { nm: imgCercana(p.sec) };
        const e = cand.nm && imgExt(cand.nm);
        if (e) props[k] = `IMG:img/${cand.nm}.${e}`;
      }
    }
    const a = attrs(comp, props);
    // FedLowerThird es el único del kit que NO acepta `mood` (no tiene paleta de escena)
    const moodAttr = comp === "FedLowerThird" ? "" : ` mood=${jsxStr(props.mood || "science")}`;
    const inner = `<${comp} ${variant ? `variant='${variant}'` : "variant='whip'"} totalF={${variant ? durF : durF + 24}} ${a} accent={A}${moodAttr} />`;
    cues.push({ id, start: p.sec, dur: p.dur, avatar: false,
      node: variant ? inner : `<Sequence from={-12} layout='none'>${inner}</Sequence>` });
    return;
  }

  /* mode === 'shot' */
  // Cada asset pertenece a SU beat por nombre — nunca se reparte un clip ajeno.
  // El stock escribe public/broll/<slug>/<beat>.mp4 y gpt-image escribe
  // public/img/<slug>_<beat>[_bx].png, así que el match es exacto.
  let src = null, isVideo = false;
  if (p.asset === "yt") {
    const f = `${p.name}.mp4`;
    if (fs.existsSync(path.join(BROLL_DIR, f)) && !usados.has(f)) {
      usados.add(f); src = `broll/${SLUG}/${f}`; isVideo = true; nClips++;
    } else {
      // Pexels no lo tenía (tier free en 429) → la imagen generada de ESTE beat.
      const nm = `${SLUG}_${p.name}_bx`;
      const e = imgExt(nm);
      if (e && !usados.has(nm)) { usados.add(nm); src = `img/${nm}.${e}`; nImgs++; nFallbackImg++; }
    }
  } else {
    for (const nm of [p.img || `${SLUG}_${p.name}`, `${SLUG}_${p.name}_bx`]) {
      const e = imgExt(nm);
      if (e && !usados.has(nm)) { usados.add(nm); src = `img/${nm}.${e}`; nImgs++; break; }
    }
  }

  if (!src) { // GAP-FILL: sin asset va avatar FULL, nunca fondo pelado (regla del canal)
    sinAsset++; nAvatar++;
    cues.push({ id, start: p.sec, dur: p.dur, avatar: true,
      node: p.caption ? overlay(p.caption, true, 0.4) : "null" });
    return;
  }

  const ken = ["in", "out", "left", "right"].includes(p.ken) ? p.ken : (i % 2 ? "in" : "left");
  const shotInner = `<FedFullShot ${variant ? `variant='${variant}'` : "variant='whip'"} totalF={${variant ? durF : durF + 24}} src={staticFile('${src}')} ${isVideo ? "video " : ""}ken='${ken}' accent={A} mood='warmdark' />`;
  const shot = variant ? shotInner : `<Sequence from={-12} layout='none'>${shotInner}</Sequence>`;
  let node = shot;
  if (p.caption) {
    centerToggle = !centerToggle;
    node = `<>\n      ${shot}\n      ${overlay(p.caption, centerToggle)}\n    </>`;
  }
  cues.push({ id, start: p.sec, dur: p.dur, avatar: false, node });
});

/* ── emisión del archivo ─────────────────────────────────────────────────────── */
const body = cues
  .map((c) => `  {id: '${c.id}', start: ${c.start.toFixed(2)}, dur: ${c.dur.toFixed(2)}, avatar: ${c.avatar}, node: (\n    ${c.node}\n  )},`)
  .join("\n");

const out = `/* GENERADO por scripts/gen_cues_${SLUG}.mjs — NO editar a mano.
 * ${cues.length} cues anclados al ms de Whisper. Fuente: _v3/plan_${SLUG}.json
 * clips ${nClips} · imágenes ${nImgs} · componentes ${nComp} · avatar full ${nAvatar}
 */
import React from 'react';
import {AbsoluteFill, Sequence, staticFile} from 'remotion';
import {
  FedChapter, FedHero, FedStat, FedQuote, FedMolecule, FedStep,
  FedBeforeAfter, FedLowerThird, FedChecklist, FedCta, FedFullShot,
  Kicker, KickerCenter,
} from '../FedererKit';
import {FedWhiteboardVucm} from '../FedWhiteboard_${SLUG}';

const A = '${ACC}';

export type Cue = {
  id: string;
  start: number;
  dur: number;
  avatar: boolean;
  node: React.ReactNode;
};

export const TOTAL_FRAMES_${SLUG.toUpperCase()} = ${TOTAL_SEC * FPS};

export const CUES: Cue[] = [
${body}
];

export default CUES;
`;

fs.mkdirSync("src/VideoEdit", { recursive: true });
fs.writeFileSync(`src/VideoEdit/cues_${SLUG}.gen.tsx`, out);

const durs = cues.filter((c) => !c.avatar).map((c) => c.dur).sort((a, b) => a - b);
const q = (p) => durs[Math.floor(durs.length * p)] || 0;
console.log(`── CUES ${SLUG} ──`);
console.log(`  cues            : ${cues.length}`);
console.log(`  clips b-roll    : ${nClips}`);
console.log(`  imágenes IA     : ${nImgs}${nFallbackImg ? `  (${nFallbackImg} cubriendo beats que Pexels no tenía)` : ""}`);
console.log(`  componentes     : ${nComp}`);
console.log(`  avatar full     : ${nAvatar}${sinAsset ? `  (${sinAsset} por gap-fill, sin asset)` : ""}`);
console.log(`  ritmo visual    : mediana ${q(0.5).toFixed(2)}s · p90 ${q(0.9).toFixed(2)}s · ≥5s ${durs.filter((d) => d >= 5).length} (${Math.round((100 * durs.filter((d) => d >= 5).length) / (durs.length || 1))}%)`);
console.log(`→ src/VideoEdit/cues_${SLUG}.gen.tsx`);

// build_lamina15.mjs — "NO PRENDAS EL AIRE ESTE VERANO: LA LÁMINA TÉRMICA DE $15" (Constructor Libre)
// Barrera radiante: hoja de aluminio pulido bajo las vigas, con cámara de aire, que DEVUELVE el calor
// que el techo radia hacia la casa. Presentador constructor mexicano (avatar real) + 59 clips Pexels
// verificados frame a frame + 255 imágenes gpt-image-2 auditadas por visión + kit premium THEME_EARTH
// + 3 variantes propias en el hook (termografía, calibre, polvo).
// Salida: beatsheet/lamina15.json → node beatsheet.mjs beatsheet/lamina15.json
import fs from "fs";

const SLUG = "lamina15";
const AVATAR = `${SLUG}_opt.mp4`;

const beatsBase = JSON.parse(fs.readFileSync(`_v3/${SLUG}_beats.json`, "utf8").replace(/^﻿/, ""));
const plan = JSON.parse(fs.readFileSync(`_v3/${SLUG}_plan.json`, "utf8").replace(/^﻿/, ""));
const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const TOTAL = +((caps[caps.length - 1].endMs) / 1000 + 1.5).toFixed(2);

const exists = (p) => fs.existsSync("public/" + p);
const imgAsset = (n) => {
  // JPG PRIMERO: el tarball del farm tiene tope duro de 2 GB por asset y los PNG
  // de 1792x1008 pesaban 671 MB contra 52 MB en JPG q3. Los PNG originales NO se borran,
  // simplemente dejan de referenciarse (regla: nunca borrar assets generados).
  for (const e of ["jpg", "png", "jpeg", "webp"]) if (exists(`img/${SLUG}_${n}.${e}`)) return `img/${SLUG}_${n}.${e}`;
  return null;
};
const clipAsset = (n) => (exists(`broll/${SLUG}_${n}.mp4`) ? `broll/${SLUG}_${n}.mp4` : null);

// (usadas por fixPaths, más abajo — van acá arriba porque el bucle principal las llama
//  y un `const` declarado después queda en zona muerta temporal)
const PATHY = /^(image|photo|src|back|fore|leftImage|rightImage|beforeImage|afterImage)$/i;
const isRealAsset = (s) => typeof s === "string" && /^(img|broll|vid|real)\//.test(s) && exists(s);

// ── mis 3 variantes propias: traen su PROPIO plate (full-bleed), así que van como
//    cue —no como overlay— y reemplazan el plano en vez de superponerse.
const OWN = { thermalwipe: "ThermalWipe_lamina15", caliper: "CaliperReveal_lamina15", dustdecay: "DustDecay_lamina15" };

// ── agrupar los momentos del plan por su beat base (s_07 y s_07_b comparten span) ──
const byBase = new Map();
for (const m of plan) {
  const base = m.name.replace(/_[a-z]$/, "");
  if (!byBase.has(base)) byBase.set(base, []);
  byBase.get(base).push(m);
}

// ⚠️ GOTCHA ya pagado en este proyecto: los momentos NO son contiguos — entre el fin de
// uno y el arranque del siguiente está el silencio de la respiración. Si un plano termina
// en su última palabra, ese silencio queda sin beat y sin avatar = PANTALLA VACÍA.
// Por eso cada momento se extiende hasta el ARRANQUE del siguiente, no hasta su propio fin.
const rawBeats = [];
const compBeats = [];
const avatarSpans = [];
const compCount = {};
let nClip = 0, nImg = 0, nDropped = 0;

for (let i = 0; i < beatsBase.length; i++) {
  const b = beatsBase[i];
  const start = b.ms / 1000;
  const end = i + 1 < beatsBase.length ? beatsBase[i + 1].ms / 1000 : TOTAL;
  const span = Math.max(0.5, end - start);
  const subs = byBase.get(b.name) || [];
  if (!subs.length) { avatarSpans.push([start, end]); continue; }

  // repartir el span entre las sub-tomas, proporcional a lo que pidió el director
  const wsum = subs.reduce((a, s) => a + (Number(s.seg) || 1), 0);
  let t = start;
  for (let k = 0; k < subs.length; k++) {
    const m = subs[k];
    const w = (Number(m.seg) || 1) / wsum;
    const sEnd = k === subs.length - 1 ? end : +(t + span * w).toFixed(2);
    const dur = +(sEnd - t).toFixed(2);
    const id = `${SLUG}_${m.name}`;
    const clip = clipAsset(m.name);
    const img = imgAsset(m.name);
    const own = m.comp && OWN[m.comp.kind];

    if (own) {
      // variante propia: ES el plano (trae su plate). Le paso la imagen del momento.
      const props = { ...m.comp }; delete props.kind;
      compBeats.push({
        id, start: +t.toFixed(2), dur, kind: "premium", comp: own, theme: "earth", zone: "full",
        image: clip || img || undefined, ...castProps(fixPaths(props, img || clip)),
      });
      compCount[own] = (compCount[own] || 0) + 1;
    } else {
      // plano de fondo: clip real si sobrevivió a la compuerta, si no la imagen generada
      if (clip) { rawBeats.push({ id, start: +t.toFixed(2), dur, kind: "raw", src: clip, hue: "amber", darken: 0, noSplit: true }); nClip++; }
      else if (img) { rawBeats.push({ id, start: +t.toFixed(2), dur, kind: "raw", src: img, hue: "amber", darken: 0 }); nImg++; }
      else avatarSpans.push([t, sEnd]);

      if (m.comp && m.comp.kind) {
        const props = { ...m.comp }; let kind = props.kind; delete props.kind;
        // ⚠️ Visto en el render final: `MistakeCard` y `NextVideoEndcard` pintan una
        // PLACA NEGRA A PANTALLA COMPLETA con acentos ROJOS — son del look "alarma"
        // (finanzas/jubilados), no del terroso de este canal. Tapaban el b-roll y
        // dejaban ~25 s de pantalla negra y roja en un documental crema y madera
        // (el blackdetect los cazó como 2,8 s y 5,2 s de negro).
        // Se conserva el TEXTO y se cambia el envase por uno de la marca.
        if (kind === "mistake") {
          kind = "termcard";
          props.term = props.title;
          props.definition = props.desc || props.eyebrow;
          delete props.title; delete props.desc; delete props.number; delete props.eyebrow;
        } else if (kind === "nextvideo") {
          kind = "keyphrase";
          props.text = props.desc || props.title;
          props.fontSize = 74;
          delete props.title; delete props.desc;
        }
        // ⚠️ los componentes con `image` OPCIONAL dibujan un PLACEHOLDER vacío si no se
        // la pasás (degradado con un círculo) y en la cuadrícula se ve como caja sin
        // terminar. Auto-relleno con la imagen del PROPIO momento (habla de lo mismo).
        if (props.image === undefined && img) props.image = img;
        // ⚠️ Verificado en el 1er render mirando el beat al 85% (no al 9%, que era el
        // error de diagnóstico de otras veces): los chips SÍ se revelaban todos — lo
        // que fallaba era el ANCHO. ChipsCluster los pone en una fila y con 4 etiquetas
        // largas la primera y la última quedan cortadas por los bordes del cuadro.
        // Por eso el recorte va por CARACTERES, no por cantidad ni por duración:
        // "R-6 / R-8 / R-11" entran de a tres, "Distancia entre grapas" no.
        if (Array.isArray(props.chips)) {
          const MAXCH = 46;
          const keep = [];
          let acc = 0;
          for (const c of props.chips) {
            const L = String(c).length;
            if (keep.length >= 2 && acc + L > MAXCH) break;
            keep.push(c); acc += L;
          }
          props.chips = keep;
        }
        // ⚠️ Checklist dibuja el ✓ SOLO si el ítem trae state:"done" (`it.state ?? "todo"`).
        // Sin eso la casilla queda VACÍA todo el plano y se lee como componente a medio
        // hacer — que es exactamente lo que apareció en el render.
        if (kind === "checklist" && Array.isArray(props.items)) {
          props.items = props.items.slice(0, 3).map((it) => (typeof it === "string" ? { text: it, state: "done" } : { ...it, state: it.state || "done" }));
        }
        for (const lk of ["steps", "items"]) {
          if (kind !== "checklist" && Array.isArray(props[lk]) && props[lk].length > 3) props[lk] = props[lk].slice(0, 3);
        }
        const norm = normalizeComp(kind, fixPaths(props, img), img);
        if (norm) {
          compBeats.push({
            id: `ov_${kind}_${Math.round(t)}`, start: +t.toFixed(2),
            dur: +Math.min(dur, 8).toFixed(2), kind, overlay: true, hue: "amber", ...castProps(norm),
          });
          compCount[kind] = (compCount[kind] || 0) + 1;
        } else {
          nDropped++;
        }
      }
    }
    t = sEnd;
  }
}

// ⚠️ GOTCHA que tiró 20 chunks juntos: `beatsheet.mjs` emite los props de texto como
// `prop={JSON.stringify(v)}` SIN llaves, así que un número queda `total=6` → JSX
// inválido → no bundlea. Todo lo que no sea numérico de verdad va casteado a String.
// ⚠️ GOTCHA que tiró 9 chunks en otro video de este proyecto: hay props que TIPAN
// `string` pero son RUTAS DE IMAGEN (`image`, `src`, `back`, `fore`, `leftImage`…).
// Ni tsc ni esbuild los validan, y los directores les escriben la DESCRIPCIÓN de la
// escena ("tapanco en penumbra"). Remotion intenta cargar /public/tapanco%20en%20…,
// tira CancelledError y se cae el chunk. Acá: si no es una ruta que EXISTE en disco,
// se reemplaza por la imagen del propio momento; si no hay, se borra la prop.
function fixPaths(o, fallback) {
  if (o == null || typeof o !== "object") return o;
  if (Array.isArray(o)) return o.map((x) => fixPaths(x, fallback));
  const out = {};
  for (const [k, v] of Object.entries(o)) {
    if (PATHY.test(k) && typeof v === "string" && !isRealAsset(v)) {
      if (fallback) out[k] = fallback;               // la imagen del propio momento
      continue;                                       // si no hay, mejor sin prop que con ruta rota
    }
    out[k] = (v && typeof v === "object") ? fixPaths(v, fallback) : v;
  }
  return out;
}

// ⚠️ Varios emisores de `beatsheet.mjs` escriben ciertos props SIN condicional
// (`bg=${j(b.bg)}`), así que si el prop falta sale literal `bg=undefined` → JSX
// inválido → no bundlea → se caen los chunks. Además los directores usan los
// nombres de la tabla del brief, que no siempre son los del componente real.
// Acá se traduce al contrato de verdad y se rellenan los obligatorios.
// Devuelve null si el componente NO se puede renderizar sin inventar contenido.
function normalizeComp(kind, p, img) {
  const o = { ...p };
  if (kind === "termcard") {
    o.definition = o.definition ?? o.def ?? o.desc ?? o.sub;
    delete o.def; delete o.desc; delete o.sub;
    o.bg = isRealAsset(o.bg) ? o.bg : img;
    if (!o.term || !o.definition || !o.bg) return null;
  }
  if (kind === "numcard") {
    o.name = o.name ?? o.title ?? o.label;
    delete o.title; delete o.label;
    if (o.number != null) o.number = String(o.number);
    if (!o.number || !o.name) return null;
  }
  // los directores escribieron los props con los nombres de la tabla del brief; los
  // contratos REALES de estos cuatro son distintos (leídos del .tsx, no de memoria)
  if (kind === "headline") {
    // Token = { t, hl? } — no strings sueltos
    if (Array.isArray(o.tokens)) {
      o.tokens = o.tokens.map((x) => (typeof x === "string" ? { t: x } : x));
      // sin ninguna palabra marcada, el display queda todo del mismo gris y la
      // última (que es la que remata la frase) se pierde contra el fondo claro
      if (!o.tokens.some((x) => x.hl || x.danger || x.good)) o.tokens[o.tokens.length - 1].hl = true;
    }
    if (!o.tokens || !o.tokens.length) return null;
  }
  if (kind === "vs") {
    // VsSide = { label, value, sub?, good? } — el director mandó { title, desc }
    const side = (x) => (x && typeof x === "object")
      ? { label: String(x.label ?? x.title ?? ""), value: String(x.value ?? x.title ?? ""), ...(x.desc || x.sub ? { sub: String(x.desc ?? x.sub) } : {}), ...(x.good != null ? { good: !!x.good } : {}) }
      : null;
    o.left = side(o.left); o.right = side(o.right);
    if (!o.left || !o.right || !o.left.value || !o.right.value) return null;
  }
  if (kind === "costtally") {
    // Side = { label, note?, total (numérico) } — el director mandó { label, value }
    const side = (x) => {
      if (!x || typeof x !== "object") return null;
      const n = Number(x.total ?? x.value);
      if (!Number.isFinite(n)) return null;
      return { label: String(x.label ?? ""), total: n, ...(x.note ? { note: String(x.note) } : {}), ...(x.bad != null ? { bad: !!x.bad } : {}) };
    };
    o.left = side(o.left); o.right = side(o.right);
    if (!o.left || !o.right) return null;
  }
  if (kind === "timeline") {
    // { year, label } — el director mandó { year, text }
    if (Array.isArray(o.events)) o.events = o.events.map((e) => ({ year: String(e.year ?? ""), label: String(e.label ?? e.text ?? "") })).filter((e) => e.year && e.label);
    if (!o.events || o.events.length < 2) return null;
  }
  // cada tag acepta un subconjunto DISTINTO de esquinas (leído de overlays/*.tsx):
  // DocLabel sólo abajo, DateStamp sólo arriba. Un valor fuera del union no compila.
  const CORNERS = { doclabel: ["bl", "br"], datestamp: ["tl", "tr"], stattag: ["tl", "tr", "bl", "br"], metertag: ["tl", "tr", "bl", "br"] };
  if (CORNERS[kind] && o.corner && !CORNERS[kind].includes(o.corner)) {
    const flipV = { tl: "bl", tr: "br", bl: "tl", br: "tr" };
    o.corner = CORNERS[kind].includes(flipV[o.corner]) ? flipV[o.corner] : CORNERS[kind][0];
  }
  if (kind === "bars") {
    // BarCompare.value es NUMÉRICO; el director escribió rangos ("16–42"). Se toma el
    // extremo alto del rango (que es el que la voz enfatiza) y el rango va al label.
    if (Array.isArray(o.bars)) {
      o.bars = o.bars.map((x) => {
        const raw = String(x.value ?? "");
        const nums = raw.match(/\d+(?:[.,]\d+)?/g) || [];
        const n = nums.length ? Number(nums[nums.length - 1].replace(",", ".")) : NaN;
        if (!Number.isFinite(n)) return null;
        // el label NO lleva el rango: desborda el ancho de la barra y sale cortado
        // el label va FUERA de la barra y a la izquierda: si es largo, se sale
        // del cuadro (medido en el render: "…ncia de calor por el techo" cortado)
        const label = String(x.label ?? "").replace(/^Ganancia de calor por el techo$/, "Calor por el techo").replace(/^Gasto de enfriamiento$/, "Enfriamiento");
        return { label, value: n };
      }).filter(Boolean);
    }
    if (!o.bars || o.bars.length < 2) return null;
  }
  if (kind === "thennow") {
    // { src, label } — el director mandó { label, image }
    const side = (x) => (x && typeof x === "object" && isRealAsset(x.image ?? x.src))
      ? { src: x.image ?? x.src, ...(x.label ? { label: String(x.label) } : {}) } : null;
    o.before = side(o.before); o.after = side(o.after);
    if (!o.before || !o.after) return null;
  }
  if (kind === "keyphrase") {
    const OKPOS = ["center", "left", "right"];
    if (o.position && !OKPOS.includes(o.position)) delete o.position;
  }
  if (kind === "annotated") {
    // Annotation = { kind, x, y, label? } — el director mandó { x, y, text }
    if (Array.isArray(o.annotations)) {
      o.annotations = o.annotations
        .filter((a) => a && Number.isFinite(Number(a.x)) && Number.isFinite(Number(a.y)))
        .map((a) => ({ kind: a.kind || "circle", x: Number(a.x), y: Number(a.y), label: String(a.label ?? a.text ?? "") }))
        .filter((a) => a.label);
    }
    if (!o.annotations || !o.annotations.length) return null;
    o.image = isRealAsset(o.image) ? o.image : img;
    if (!o.image) return null;            // AnnotatedImage sin imagen no existe
  }
  return o;
}

function castProps(o) {
  const NUM = new Set(["value", "decimals", "fontSize", "size", "hitAt", "boom", "darken", "rank", "total", "fromPct", "toPct", "from", "to", "at", "decayDur", "sweepDur", "coolTo", "coolAt", "price", "stagger"]);
  const out = {};
  for (const [k, v] of Object.entries(o)) {
    if (v === undefined || v === null) continue;
    if (NUM.has(k)) { const n = Number(v); if (Number.isFinite(n)) { out[k] = n; continue; } }
    if (typeof v === "number") { out[k] = String(v); continue; }
    if (typeof v === "boolean") { out[k] = v; continue; }
    out[k] = v;
  }
  return out;
}

// ── AVATAR full: la regla del canal es full-o-visual-full, y el piso medido es 28% de
//    pantalla para el presentador. Como acá casi todo momento trae visual, hay que
//    ELEGIR los tramos de avatar en vez de esperar a que sobren huecos.
//    Se eligen: (a) los momentos de texto sobre el presentador (headline/keyphrase),
//    (b) uno de cada 3 momentos retóricos sin componente y sin clip real.
const AV_KINDS = new Set(["headline", "keyphrase"]);
let rot = 0;
const avatarPick = new Set();
for (const m of plan) {
  const k = m.comp && m.comp.kind;
  if (k && AV_KINDS.has(k)) { avatarPick.add(m.name); continue; }
  // 1 de cada 2 (con 1 de cada 3 daba 23% y el piso medido del canal es 28%)
  if (!k && !clipAsset(m.name)) { if (rot++ % 2 === 0) avatarPick.add(m.name); }
}
for (const b of [...rawBeats]) {
  const nm = b.id.replace(`${SLUG}_`, "");
  if (!avatarPick.has(nm)) continue;
  avatarSpans.push([b.start, +(b.start + b.dur).toFixed(2)]);
  rawBeats.splice(rawBeats.indexOf(b), 1);          // el avatar ES el plano
  if (b.src.endsWith(".mp4")) nClip--; else nImg--;
}

rawBeats.sort((a, b) => a.start - b.start);
compBeats.sort((a, b) => a.start - b.start);

// ── ventanas de avatar: full donde no hay plano de fondo, hidden donde sí ──
const cueSpans = [...rawBeats, ...compBeats.filter((b) => !b.overlay)].map((b) => [b.start, +(b.start + b.dur).toFixed(2)]);
const covered = (t) => cueSpans.some(([s, e]) => s <= t && e > t);
const STEP = 0.1;
const windows = [];
let cur = null;
for (let t = 0; t < TOTAL - 0.001; t = +(t + STEP).toFixed(2)) {
  const mode = covered(t) ? "hidden" : "full";
  if (mode !== cur) { windows.push({ start: +t.toFixed(2), mode }); cur = mode; }
}
if (!windows.length || windows[0].start > 0) windows.unshift({ start: 0, mode: covered(0) ? "hidden" : "full" });
windows.push({ start: +TOTAL.toFixed(2), mode: "hidden" });

const beats = [...rawBeats, ...compBeats].sort((a, b) => a.start - b.start);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: AVATAR, tutorial: true, beats }, null, 1));
fs.writeFileSync(`src/VideoEdit/avatar_${SLUG}.gen.ts`,
  `// avatar_${SLUG}.gen.ts — GENERADO. NO editar a mano.\nimport type { AvatarWindow } from "./scenes/AvatarLayer";\nexport const TOTAL_${SLUG.toUpperCase()} = ${TOTAL};\nexport const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};\n`);

const avSecs = windows.reduce((a, w, i) => a + (w.mode === "full" ? ((windows[i + 1]?.start ?? TOTAL) - w.start) : 0), 0);
console.log(`beats ${beats.length} · raw ${rawBeats.length} (clip ${nClip} / img ${nImg}) · componentes ${compBeats.length} (${Object.keys(compCount).length} tipos)`);
console.log(`avatar full ${avSecs.toFixed(0)}s / ${TOTAL.toFixed(0)}s = ${((avSecs / TOTAL) * 100).toFixed(0)}%  ·  dur ${(TOTAL / 60).toFixed(1)} min`);
if (nDropped) console.log(`⚠ ${nDropped} componentes descartados por props obligatorias faltantes (mejor sin componente que con JSX roto)`);
console.log("componentes:", JSON.stringify(compCount));

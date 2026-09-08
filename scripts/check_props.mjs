// check_props.mjs — COMPUERTA DE CONTRATOS: valida cada beat del beatsheet contra lo que el
// componente REALMENTE lee, ANTES de gastar una corrida del farm.
//
// Por que existe: en grvaseline los 7 chunks con `blurexplainer` murieron con
// "undefined was passed to staticFile()" porque BlurExplainer declara `clip: string`
// OBLIGATORIO (es el video borroso del fondo) y el beat solo traia `image`. tsc no lo ve
// —los beats son `any[]`— y el density_gate tampoco. Se descubre recien en el farm, con
// 60 chunks ya lanzados.
//
//   node scripts/check_props.mjs <slug>     exit 1 = no rendees
//
// Chequea las TRES familias de error del pipeline:
//   1. prop REQUERIDA ausente        -> crashea el chunk (esta al menos avisa)
//   2. FORMA equivocada              -> React lo renderiza como nada: componente VACIO en verde
//   3. ruta de imagen/clip inexistente -> EncodingError, chunk muerto
import fs from "fs";
import path from "path";

const SLUG = process.argv[2];
if (!SLUG) { console.error("uso: node scripts/check_props.mjs <slug>"); process.exit(1); }

// ═══════════════════════════════════════════════════════════════════════════════════════════
//  RAMA "PLAN" — videos cuyo DIRECTOR vive en `_v3/<slug>_plan.json` y usan componentes
//  PascalCase (canal Mike Dalton: mdmold/mdtoilet/mdtank/mdring/mdbleach...). No tienen
//  `beatsheet/<slug>.json`, asi que hasta ahora este script CRASHEABA con ENOENT.
//  Es ADITIVA: si el beatsheet existe no se ejecuta y el comportamiento viejo queda intacto.
//
//  Mismas CUATRO familias, leidas de la FIRMA REAL del componente (no de una tabla a mano):
//    1. toda prop REQUERIDA (sin `?` en la firma) tiene que estar en el beat/overlay
//    2. la FORMA de cada prop tiene que ser la que declara el tipo
//    3. toda ruta de asset citada tiene que existir EN DISCO (props + el cues generado)
//    4. el cues/Main tiene que REENVIAR cada prop del beat (si no, sale el default)
//    4.bis (canales EN) ninguna prop sin pisar puede caer a un default EN ESPANOL
// ═══════════════════════════════════════════════════════════════════════════════════════════
if (!fs.existsSync(`beatsheet/${SLUG}.json`) && fs.existsSync(`_v3/${SLUG}_plan.json`)) {
  const plan = JSON.parse(fs.readFileSync(`_v3/${SLUG}_plan.json`, "utf8").replace(/^﻿/, ""));
  const cuesPath = `src/VideoEdit/cues_${SLUG}.gen.tsx`;
  if (!fs.existsSync(cuesPath)) { console.error(`⛔ falta ${cuesPath} — corre primero node build_${SLUG}.mjs`); process.exit(1); }
  const cues = fs.readFileSync(cuesPath, "utf8");
  const mainPath = `src/VideoEdit/Main_${SLUG}.tsx`;
  const main = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, "utf8") : "";

  // ── donde vive cada componente: se busca la firma en los lugares del pipeline ────────────
  const DIRS = [`src/${SLUG}`, "src/mdtank", "src/mdmold", "src/mdtoilet", "src/mdring", "src/peroxide",
    "src/VideoEdit/kit/premium", "src/VideoEdit/scenes", "src/VideoEdit/components"];
  const FILES = [];
  // ── EL KIT REUSADO manda: canales que CLONAN un build (raydoor1 reusa src/rksafe) importan sus
  // componentes con `from "../<kit>/..."`. Esos archivos TIENEN PRIORIDAD sobre cualquier homónimo
  // del kit premium/scenes (MythTruth/CrossSection/PullQuote colisionan por nombre). Sin esto el
  // gate resolvía la firma equivocada y pedía props de OTRO componente.
  for (const m of cues.matchAll(/from\s+"\.\.\/([^"]+)"/g)) {
    const rel = `src/${m[1]}`;
    for (const cand of [`${rel}.tsx`, `${rel}.ts`]) if (fs.existsSync(cand) && !FILES.includes(cand)) FILES.push(cand);
  }
  for (const d of DIRS) {
    if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d)) if (/\.tsx?$/.test(f)) FILES.push(path.join(d, f));
  }
  const sigCache = {};
  const signature = (comp) => {
    if (comp in sigCache) return sigCache[comp];
    for (const f of FILES) {
      const src = fs.readFileSync(f, "utf8");
      const head = `export const ${comp}: React.FC<{`;
      const i = src.indexOf(head);
      if (i < 0) continue;
      const close = src.indexOf("}>", i);
      const props = {};
      for (const line of src.slice(i + head.length, close).split("\n")) {
        const m = line.replace(/\/\/.*$/, "").match(/^\s*([A-Za-z_][A-Za-z0-9_]*)(\??):\s*(.+?);?\s*$/);
        if (m) props[m[1]] = { opt: m[2] === "?", type: m[3].trim().replace(/;$/, "") };
      }
      // defaults del destructuring: `title = "Antes de empezar, tene esto",`
      const dstart = src.indexOf("({", close);
      const dend = src.indexOf("}) =>", dstart);
      const defaults = {};
      if (dstart > 0 && dend > dstart) {
        for (const line of src.slice(dstart, dend).split("\n")) {
          const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+?),?\s*$/);
          if (m && !m[2].startsWith("(")) defaults[m[1]] = m[2];
        }
      }
      return (sigCache[comp] = { file: f, props, defaults });
    }
    return (sigCache[comp] = null);
  };

  // forma de las props COMPUESTAS (alias de tipo que no se validan solos)
  const SHAPE = {
    "HookCaption.words": (v) => Array.isArray(v) && v.every((w) => w && typeof w.text === "string"),
    "BulletCascade.bullets": (v) => Array.isArray(v) && v.every((b) => b && typeof b.key === "string"),
    "ChapterTrailCard.number": (v) => typeof v === "string",   // number:6 crashea `number.match`
    "LightTrailCards.number": (v) => typeof v === "string",
  };
  const typeOk = (t, v) => {
    t = t.replace(/\s+/g, "");
    if (t === "string") return typeof v === "string";
    if (t === "number") return typeof v === "number";
    if (t === "boolean") return typeof v === "boolean";
    if (t === "string[]") return Array.isArray(v) && v.every((x) => typeof x === "string");
    if (t === "number[]") return Array.isArray(v) && v.every((x) => typeof x === "number");
    if (/^".+"(\|".+")*$/.test(t)) return typeof v === "string" && t.split("|").map((s) => s.slice(1, -1)).includes(v);
    if (t.endsWith("[]")) return Array.isArray(v);
    return true; // ReactNode, CSSProperties, alias sueltos → no se validan aca
  };
  // ⛔ canal EN: el kit nacio en los canales ES y varios componentes traen microcopy castellano
  const ES = /[áéíóúñ¿¡]|\b(el|la|los|las|un|una|unos|unas|del|que|para|con|sin|mas|más|esto|esta|está|tene|tené|antes|empezar|como|cómo|darte|cuenta|listo|nunca|siempre|mito|verdad|año|años|plata|dias|días|cada|todos|nadie|mejor|hacer|poner)\b/i;

  const err = [], warn = [];
  const isAsset = (v) => typeof v === "string" && /^(img|broll|sfx|med|avatar_clips)\/.+\.(jpe?g|png|webp|mp4|mp3|wav)$/i.test(v);

  const items = [
    ...plan.beats.filter((b) => b.tipo === "componente" || b.tipo === "movimiento")
      .map((b) => ({ comp: b.componente, props: b.props || {}, ms: b.ms_in, kind: b.tipo })),
    ...(plan.overlays || []).map((o) => ({ comp: o.componente, props: o.props || {}, ms: o.ms_in, kind: "overlay" })),
  ];

  for (const it of items) {
    const at = `${it.comp} @${it.ms}ms (${it.kind})`;
    const sig = signature(it.comp);
    if (!sig) { err.push(`${at}: no encuentro la firma \`export const ${it.comp}: React.FC<{\` en ningun lado`); continue; }
    // el build puede CORRER un overlay (guard de colision con un movimiento) → tambien busco por componente
    const lines = cues.split("\n").filter((l) => l.includes(`<${it.comp} `));
    const line = lines.find((l) => l.includes(`"${it.kind === "overlay" ? "ov_" : it.kind + "_"}${it.ms}"`)) || lines[0];

    // lo que RINDE es el cues, no el plan: el build puede completar microcopy que el plan
    // no manda (tabla EN_FILL). Se pregunta por lo EMITIDO, no por lo planeado.
    const emitida = (k) => (k in it.props) || !!(line && (line.includes(`"${k}"`) || line.includes(`${k}=`)));

    for (const [k, d] of Object.entries(sig.props)) {
      if (k === "durationInFrames" || k === "children" || k === "theme") continue;
      // 1. requerida
      if (!d.opt && !emitida(k)) { err.push(`${at}: falta la prop REQUERIDA "${k}: ${d.type}"`); continue; }
      // 4.bis default en espanol
      if (!emitida(k) && sig.defaults[k] && ES.test(sig.defaults[k]))
        err.push(`${at}: no pisa "${k}" → sale el DEFAULT EN ESPANOL ${sig.defaults[k].slice(0, 60)}`);
      if (!(k in it.props)) continue;
      // 2. forma
      const shape = SHAPE[`${it.comp}.${k}`];
      if (shape ? !shape(it.props[k]) : !typeOk(d.type, it.props[k]))
        err.push(`${at}: "${k}" con la FORMA equivocada (esperaba ${d.type}) → ${JSON.stringify(it.props[k]).slice(0, 60)}`);
    }
    for (const [k, v] of Object.entries(it.props)) {
      if (!(k in sig.props)) warn.push(`${at}: "${k}" no existe en la firma (${sig.file}) → se ignora`);
      // 3. asset en disco
      if (isAsset(v) && !fs.existsSync(path.join("public", v))) err.push(`${at}: "${k}" apunta a public/${v} que NO EXISTE`);
      // 4. reenvio
      if (!line) { err.push(`${at}: el cues generado NO monta <${it.comp} ...> en ningun lado`); break; }
      if (!line.includes(`"${k}"`) && !line.includes(`${k}=`) && !main.includes(`b.${k}`) && !main.includes(`beat.${k}`))
        err.push(`${at}: el cues NO reenvia "${k}" → el componente usa su DEFAULT y el chunk pasa en VERDE`);
    }
  }

  // 3.bis todo asset del plan y toda ruta citada en el cues generado
  for (const b of plan.beats) {
    if (b.tipo === "clip" && !fs.existsSync(`public/broll/${b.clip}.mp4`)) err.push(`clip @${b.ms_in}ms: falta public/broll/${b.clip}.mp4`);
    if (b.tipo === "imagen" && !fs.existsSync(`public/img/${b.imagen}.jpg`)) err.push(`imagen @${b.ms_in}ms: falta public/img/${b.imagen}.jpg`);
    if (b.tipo === "movimiento" && !signature(b.componente)) err.push(`movimiento @${b.ms_in}ms: no existe el componente ${b.componente}`);
  }
  for (const m of cues.matchAll(/(?:src|img|image|cover|qr)="((?:img|broll|sfx|med|avatar_clips)\/[^"]+)"/g))
    if (!fs.existsSync(path.join("public", m[1]))) err.push(`cues: ruta inexistente public/${m[1]}`);
  // el avatar es el fondo garantizado: su mp4 y su wav TIENEN que estar
  for (const a of [`${SLUG}_opt.mp4`, `${SLUG}.wav`]) if (!fs.existsSync(path.join("public", a))) err.push(`falta public/${a} (el avatar es el fondo garantizado)`);

  const comps = [...new Set(items.map((i) => i.comp))];
  console.log(`── CONTRATOS · ${SLUG} (formato PLAN) · ${plan.beats.length} beats · ${(plan.overlays || []).length} overlays`);
  console.log(`   componentes verificados (${comps.length}): ${comps.join(", ")}`);
  for (const w of [...new Set(warn)]) console.log("   ⚠ " + w);
  if (err.length) {
    console.log(`\n⛔ ${err.length} PROBLEMA(S) DE CONTRATO — NO RENDEES:`);
    for (const e of [...new Set(err)].slice(0, 30)) console.log("  · " + e);
    process.exit(1);
  }
  console.log("✅ contratos OK — props requeridas presentes, formas correctas, assets en disco y todo reenviado.");
  process.exit(0);
}

const beats = JSON.parse(fs.readFileSync(`beatsheet/${SLUG}.json`, "utf8").replace(/^﻿/, "")).beats;

// prop -> como tiene que venir. `req` = obligatoria. `items` describe la forma de cada elemento.
const CONTRACT = {
  blurexplainer: { req: ["clip", "image"], assets: ["clip", "image"] },
  freezezoom:    { req: ["image"], assets: ["image"] },
  chips:         { req: ["chips"], arrayOfString: ["chips"], assets: ["image"] },
  splitlist:     { req: ["items"], arrayOfString: ["items"] },
  checklist:     { req: ["items"], itemKey: { items: "text" } },
  process:       { req: ["steps"], itemKey: { steps: "title" } },
  ingredients:   { req: ["items"], itemKey: { items: "name" }, itemAssets: { items: "image" } },
  annotated:     { req: ["image", "annotations"], itemKey: { annotations: "label" }, assets: ["image"] },
  pricewar:      { req: ["leftImage", "rightImage"], assets: ["leftImage", "rightImage"] },
  ingredientduo: { req: ["leftImg", "rightImg"], assets: ["leftImg", "rightImg"] },
  frasecinetica: { req: ["words"], itemKey: { words: "t" } },
  headline:      { req: ["tokens"], itemKey: { tokens: "t" } },
  bars:          { req: ["bars"], itemKey: { bars: "label" } },
  stat:          { req: ["value"], numeric: ["value"] },
  hourdial:      { req: ["hour"], numeric: ["hour"] },
  nametag:       { assets: ["image"] },
  guardaesto:    { req: ["items"], arrayOfString: ["items"] },
  avatarpizarra: { req: ["items"], itemKey: { items: "card|image" } },
  // ⛔ los 12 kinds que antes salian "sin contrato declarado" y por eso NO se validaban.
  //    Ahi vivia el bug de pizarraexplica: emitia items:[{t}] y la escena lee it.title,
  //    => 5 tarjetas x ~13 s con las lineas VACIAS y ninguna compuerta lo vio.
  pizarraexplica:   { req: ["title", "items"], itemKey: { items: "title" } },
  listaflotante:    { req: ["items"], itemKey: { items: "text" } },
  comparaprof:      { req: ["bars"], itemKey: { bars: "label" } },
  skinlayer:        { req: ["stages"], itemKey: { stages: "label" } },
  splitcompare:     { req: ["left", "right"] },
  reprintscan:      { req: ["image"], assets: ["image"] },
  barcompare:       { req: ["bars"], itemKey: { bars: "label" } },
  checklisterrores: { req: ["items"], arrayOfString: ["items"] },
  datoimpacto:      { req: ["figure"] },
  whynight:         { req: ["dayTitle", "nightTitle"] },
  relojnoche:       { req: ["marks"], itemKey: { marks: "label" } },
  pizarraglicacion: {},
  mitoverdad:    { req: ["myth", "truth"] },   // _fed6/scenes/MitoVerdad.tsx usa myth/truth (el contrato viejo en ES era de otro kit)
  quote:         { req: ["text"] },
  callout:       { req: ["caption"] },
  rule:          { req: ["title"] },
  lowerthird:    { req: ["title"] },
  errorstinger:  { req: ["title"] },
  // ── escenas PREMIUM de _fed6 (fcssenales): anillo 3D, profundidad, mecanismos ──
  // ── contratos que FALTABAN y dejaron pasar `undefined was passed to staticFile()` (parpados60):
  //    los 5 kinds sin contrato eran justo donde vivia la familia de bugs.
  benefitlock:   { req: ["cards"], itemKey: { cards: "label" }, itemAssets: { cards: "img" } },
  avatarkeyword: { req: ["items"], itemKey: { items: "word" } },
  highlightdata: { req: ["highlight"] },
  citationcard:  { req: ["finding"], numeric: ["stat"] },
  carousel:      { req: ["cards"], itemKey: { cards: "name" }, itemAssets: { cards: "image" } },
  ring3d:        { req: ["cards", "focus"], itemKey: { cards: "name" }, itemAssets: { cards: "image" }, assets: ["bed"] },
  triptych:      { req: ["items"], itemKey: { items: "caption" }, itemAssets: { items: "image" }, assets: ["bed"] },
  depthphoto:    { req: ["image"], assets: ["image", "bed"] },
  glasstest:     { req: ["image"], assets: ["image", "bed"] },
  skinlayers:    { req: ["stages"], itemKey: { stages: "label" }, assets: ["bed"] },
  bodymap:       { req: ["stops"], itemKey: { stops: "label" }, assets: ["bed"] },
  plateorder:    { req: ["plates"], itemKey: { plates: "label" }, itemAssets: { plates: "image" }, assets: ["bed"] },
  beforeafter:   { req: ["before", "after"], assets: ["before", "after", "bed"] },
  guidecta:      { req: ["cover", "qr"], assets: ["cover", "qr"] },
  carrusel:      { req: ["items"], itemKey: { items: "title" }, itemAssets: { items: "image" } },
  recetaescena:  { req: ["steps"], itemKey: { steps: "title" }, itemAssets: { steps: "image" } },
  lineatiempo:   { req: ["marks"], itemKey: { marks: "label" }, itemAssets: { marks: "image" } },
  pliegue:       { assets: ["leftImage", "rightImage"] },
  malla:         {},
  colador:       {},
};

const errs = [];
const has = (v) => v !== undefined && v !== null && v !== "";

for (const b of beats) {
  const c = CONTRACT[b.kind];
  if (!c) continue;
  const at = `${b.kind} @${b.start}s (${b.id || "?"})`;

  for (const k of c.req || []) {
    if (!has(b[k])) errs.push(`${at}: falta la prop REQUERIDA \`${k}\` -> el chunk crashea`);
  }
  for (const k of c.numeric || []) {
    if (has(b[k]) && typeof b[k] !== "number")
      errs.push(`${at}: \`${k}\` debe ser NUMERO (le pasaste ${JSON.stringify(b[k])}) -> rinde "000" sin crashear`);
  }
  for (const k of c.arrayOfString || []) {
    const v = b[k];
    if (Array.isArray(v) && v.some((x) => typeof x !== "string"))
      errs.push(`${at}: \`${k}\` debe ser string[] (le pasaste objetos) -> React error #31`);
  }
  for (const [k, key] of Object.entries(c.itemKey || {})) {
    // la clave puede ser ALTERNATIVA: "card|image" = alcanza con una de las dos.
    // (AvatarPizarra: `isCard = !item.image && !!item.card` -> una lamina con `image`+`caption`
    //  renderiza imagen enmarcada + texto, NO sale vacia. Exigir `card` siempre era falso positivo.)
    const alts = String(key).split("|");
    for (const [i, it] of (b[k] || []).entries()) {
      if (it && typeof it === "object" && !alts.some((a) => has(it[a])))
        errs.push(`${at}: \`${k}[${i}]\` no tiene ${alts.map((a) => "\`" + a + "\`").join(" ni ")} -> el componente sale VACIO y el chunk pasa en VERDE`);
    }
  }
  for (const k of c.assets || []) {
    if (has(b[k]) && !fs.existsSync(path.join("public", b[k])))
      errs.push(`${at}: \`${k}\` apunta a public/${b[k]} y NO EXISTE -> EncodingError`);
  }
  for (const [k, ik] of Object.entries(c.itemAssets || {})) {
    for (const [i, it] of (b[k] || []).entries()) {
      if (it && has(it[ik]) && !fs.existsSync(path.join("public", it[ik])))
        errs.push(`${at}: \`${k}[${i}].${ik}\` -> public/${it[ik]} NO EXISTE`);
    }
  }
}

// 4) EL MAIN TIENE QUE REENVIAR CADA PROP DEL BEAT.
// Esta es la que caza el caso mas traicionero: el beat trae `mito`/`verdad` pero el
// componente lee `myth`/`truth` -> el Main nunca pasa nada, el componente sale VACIO y
// el chunk termina en VERDE. Se grepea el renderComp del Main por `b.<prop>`.
const MAIN = process.argv[3] || `src/_fed6/VideoEdit/Main_${SLUG[0].toUpperCase() + SLUG.slice(1)}.tsx`;
const mainPath = fs.existsSync(MAIN) ? MAIN : `src/_fed6/VideoEdit/Main_${SLUG}.tsx`;
// Ademas del Main hay que mirar los renderers compartidos: los kinds que resuelve
// `renderFederer2Comp(beat, d)` reciben el beat ENTERO y leen `beat.<prop>`, no `b.<prop>`.
const RENDERERS = ["src/_fed6/VideoEdit/FedererComponents.tsx", "src/_fed6/VideoEdit/FedererComponents2.tsx"];
if (fs.existsSync(mainPath)) {
  const main = [mainPath, ...RENDERERS].filter((f) => fs.existsSync(f))
    .map((f) => fs.readFileSync(f, "utf8")).join(String.fromCharCode(10));
  const IGNORAR = new Set(["id", "start", "dur", "key", "kind", "src", "medico"]);
  const vistos = new Set();
  for (const b of beats) {
    if (!b.kind || b.kind === "raw" || !CONTRACT[b.kind]) continue;
    for (const k of Object.keys(b)) {
      if (IGNORAR.has(k)) continue;
      const id = `${b.kind}.${k}`;
      if (vistos.has(id)) continue;
      vistos.add(id);
      if (!main.includes(`b.${k}`) && !main.includes(`beat.${k}`))
        errs.push(`${b.kind}: el beat trae \`${k}\` pero ${mainPath} NUNCA lo reenvia (no aparece \`b.${k}\`) -> el componente usa su DEFAULT o sale VACIO, y el chunk pasa en VERDE`);
    }
  }
} else {
  console.log(`  ⚠ no encontre el Main (${mainPath}) — salteo el chequeo de reenvio de props`);
}

const kinds = [...new Set(beats.filter((b) => b.kind && b.kind !== "raw").map((b) => b.kind))];
const sinContrato = kinds.filter((k) => !CONTRACT[k]);
console.log(`── CONTRATOS · ${SLUG} · ${beats.length} beats · ${kinds.length} kinds`);
if (sinContrato.length) console.log(`  ⚠ sin contrato declarado (no validados): ${sinContrato.join(", ")}`);

if (errs.length) {
  console.log(`\n⛔ ${errs.length} PROBLEMA(S) DE CONTRATO — NO RENDEES:`);
  for (const e of errs) console.log("  · " + e);
  process.exit(1);
}
console.log("✅ contratos OK — todas las props requeridas presentes y todos los assets existen.");

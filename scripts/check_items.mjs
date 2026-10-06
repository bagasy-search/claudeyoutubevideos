// check_items.mjs — COMPUERTA: los campos de los ELEMENTOS de cada array de props.
//
//   node scripts/check_items.mjs <slug> [kit]      # exit 1 = no rendees
//   node scripts/check_items.mjs <slug> [kit] --self   # CONTROL POSITIVO
//
// ⛔⛔⛔ CIERRA EL HUECO QUE DEJA `check_props`. Medido en fedvetdolor con control positivo:
//    inyectando `items: [{t}]` en vez de `items: [{text}]`, check_props pasó en VERDE.
//    Ésa es la falla MÁS CARA del pipeline (fedguante: 17 láminas a pantalla completa SIN TEXTO,
//    ~145 s en blanco, todas las compuertas verdes y el creador dijo "el video está perfecto"):
//    el componente NO crashea ni sale vacío-evidente — dibuja la tarjeta, el eyebrow, el título y
//    las viñetas numeradas, y adentro no hay nada. `tsc` tampoco lo ve (los beats son `any` y el
//    cues hace spread `as any`).
//
// Cómo mide: por cada componente del plan, lee su archivo REAL del kit, saca el nombre del
// parámetro con que desestructura cada array (`items = [...]`, `steps`, `spots`, `marks`…) y
// junta todos los accesos `<param>.<campo>` del JSX. Después exige que CADA elemento del array
// en el plan traiga esos campos.
import fs from "node:fs";
import path from "node:path";

const SLUG = process.argv[2];
const KIT = (process.argv[3] && !process.argv[3].startsWith("--")) ? process.argv[3] : "fedvet";
const SELF = process.argv.includes("--self");
if (!SLUG) { console.error("uso: node scripts/check_items.mjs <slug> [kit] [--self]"); process.exit(1); }

const plan = JSON.parse(fs.readFileSync(`_v3/${SLUG}_plan.json`, "utf8").replace(/^﻿/, ""));
const usos = [...(plan.beats || []).filter((b) => b.tipo === "componente"), ...(plan.overlays || [])]
  .map((b) => ({ comp: b.componente, props: b.props || {}, ms: b.ms_in }));

if (SELF) {                       // control POSITIVO: rompo a propósito
  const romper = (nombre, viejo, nuevo) => {
    const u = usos.find((x) => x.comp === nombre);
    if (!u) return false;
    const clon = JSON.parse(JSON.stringify(u.props));
    for (const k of Object.keys(clon)) {
      if (Array.isArray(clon[k]) && clon[k].length && typeof clon[k][0] === "object") {
        clon[k] = clon[k].map((el) => { const o = { ...el }; if (viejo in o) { o[nuevo] = o[viejo]; delete o[viejo]; } return o; });
      }
    }
    usos.push({ comp: nombre, props: clon, ms: -1 });
    return true;
  };
  // ⛔ el control tiene que apuntar a componentes que ESTE video usa: si no, no inyecta nada
  //    y el "control positivo fallo" es un falso negativo del propio control.
  const inyectados = [
    romper("RayChecklist", "text", "t"),
    romper("ProcessChips", "title", "t"),
    romper("WorstSpots", "label", "name"),
    romper("RouteFlow", "label", "text"),
    romper("SectionDiagram", "text", "t"),      // kit Amish
    romper("PaperChart", "label", "name"),      // kit Amish
    romper("PizarraExplica", "title", "t"),
  ].filter(Boolean).length;
  if (!inyectados) { console.error("⛔ CONTROL INVALIDO: ningun componente del plan pudo romperse"); process.exit(1); }
  console.log(`   control positivo: ${inyectados} componentes rotos a proposito`);
}

// ── firma real de cada componente ──────────────────────────────────────────────────────────────
const cache = new Map();
function contrato(comp) {
  if (cache.has(comp)) return cache.get(comp);
  // el kit _fed6 vive en src/_fed6/VideoEdit/{scenes,}/ — sin esto la compuerta mide 0 arrays
  const cand = [`src/${KIT}/${comp}.tsx`, `src/${KIT}/RayStage.tsx`, `src/${KIT}/AmishKit.tsx`,
                `src/${KIT}/VideoEdit/scenes/${comp}.tsx`, `src/${KIT}/VideoEdit/${comp}.tsx`,
                `src/${KIT}/VideoEdit/FedererComponents2.tsx`, `src/${KIT}/VideoEdit/FedererComponents.tsx`];
  let src = null, file = null;
  for (const f of cand) {
    if (!fs.existsSync(f)) continue;
    const t = fs.readFileSync(f, "utf8");
    if (new RegExp(`export const ${comp}\\s*:`).test(t)) { src = t; file = f; break; }
  }
  if (!src) { cache.set(comp, null); return null; }

  // ⛔⛔ UN KIT PUEDE TENER VARIOS COMPONENTES EN UN SOLO ARCHIVO (AmishKit.tsx tiene 9).
  //    Sin recortar al bloque DE ESE componente, la desestructuracion sale del PRIMERO del
  //    archivo y la compuerta mide 0 arrays: pasa en verde sin haber mirado nada.
  const full = src;
  {
    const i0 = full.search(new RegExp("export const " + comp + "\\s*:"));
    if (i0 >= 0) {
      const rest = full.slice(i0 + 10);
      const i1 = rest.search(/\nexport (const|function|type) /);
      src = full.slice(i0, i1 >= 0 ? i0 + 10 + i1 : full.length);
    }
  }
  const aliasDe = {};

  // el bloque de desestructuración: `}> = ({ ... }) => {`
  const m = src.match(/\}>\s*=\s*\(\{([\s\S]*?)\}\)\s*=>/);
  const destr = m ? m[1] : "";
  // props que son ARRAY (tienen default `[...]` o se declaran `nombre?: {..}[]`)
  const arrays = new Set();
  for (const mm of destr.matchAll(/(\w+)\s*=\s*\[/g)) arrays.add(mm[1]);
  for (const mm of src.matchAll(/(\w+)\?\s*:\s*\{[^}]*\}\[\]/g)) arrays.add(mm[1]);
  // ⛔ los tipos con ALIAS (`rows?: PaperRow[]`) tambien son arrays
  for (const mm of src.matchAll(/(\w+)\?\s*:\s*([A-Z]\w*)\[\]/g)) { arrays.add(mm[1]); aliasDe[mm[1]] = mm[2]; }

  // campos que el JSX lee de los elementos: `.map((x) => ... x.campo`
  const campos = {};
  const oblig = {};
  for (const nombre of arrays) {
    const set = new Set();
    // el parámetro del map sobre ESE array
    const rx = new RegExp(nombre + "\\.map\\(\\s*\\(?\\s*(\\w+)", "g");
    const params = [...src.matchAll(rx)].map((x) => x[1]);
    for (const p of params) {
      for (const mm of src.matchAll(new RegExp("\\b" + p + "\\.(\\w+)", "g"))) {
        const c = mm[1];
        if (["map", "length", "filter", "slice", "join", "forEach", "toFixed"].includes(c)) continue;
        set.add(c);
      }
    }
    // RESPALDO: si el JSX mapea sobre una variable intermedia (`const list = steps && ... ; list.map`)
    // los accesos no cuelgan del nombre del array. La FIRMA DE TIPOS es autoritativa igual:
    //   `steps?: { title: string }[]`  ->  campos = [title]
    if (!set.size) {
      const t = src.match(new RegExp(nombre + "\\?\\s*:\\s*\\{([^}]*)\\}\\[\\]"));
      if (t) for (const mm of t[1].matchAll(/(\w+)\s*[?]?\s*:/g)) set.add(mm[1]);
    }
    // RESPALDO 2: alias -> `export type PaperRow = { label: string; value: number; accent?: string }`
    if (!set.size && aliasDe[nombre]) {
      const t2 = full.match(new RegExp("type\\s+" + aliasDe[nombre] + "\\s*=\\s*\\{([^}]*)\\}"));
      if (t2) for (const mm of t2[1].matchAll(/(\w+)\s*[?]?\s*:/g)) set.add(mm[1]);
    }
    // ⛔⛔ QUE CAMPOS SON OBLIGATORIOS. Sin esto la regla es "que traiga ALGUNO", y basta con que
    //    sobrevivan `tx`/`ty` para que el TEXTO pueda faltar y el componente salga sin letras.
    //    Medido con el control positivo: SectionDiagram con steps[].t pasaba en verde.
    const tipoTxt = (aliasDe[nombre]
      ? (full.match(new RegExp("type\\s+" + aliasDe[nombre] + "\\s*=\\s*\\{([^}]*)\\}")) || [])[1]
      : (src.match(new RegExp(nombre + "\\?\\s*:\\s*\\{([^}]*)\\}\\[\\]")) || [])[1]) || "";
    if (tipoTxt) {
      const obl = [...tipoTxt.matchAll(/(\w+)(\??)\s*:/g)].filter((m) => m[2] !== "?").map((m) => m[1]);
      if (obl.length) oblig[nombre] = obl;
    }
    if (set.size) campos[nombre] = [...set];
  }
  const out = { file, arrays: [...arrays], campos, oblig };
  cache.set(comp, out);
  return out;
}

const problemas = [];
let arraysMedidos = 0, elementosMedidos = 0;
const comps = new Set(usos.map((u) => u.comp));
for (const u of usos) {
  const c = contrato(u.comp);
  if (!c) { problemas.push(`${u.comp}: no encontré el componente en src/${KIT}/`); continue; }
  for (const [prop, valor] of Object.entries(u.props)) {
    if (!Array.isArray(valor) || !valor.length || typeof valor[0] !== "object") continue;
    const esperados = c.campos[prop];
    if (!esperados) { problemas.push(`${u.comp} @${u.ms}ms: pasás el array "${prop}" y el componente NO lo lee`); continue; }
    arraysMedidos++;
    valor.forEach((el, k) => {
      elementosMedidos++;
      const trae = esperados.filter((campo) => el[campo] !== undefined && el[campo] !== "");
      if (!trae.length) {
        problemas.push(`${u.comp} @${u.ms}ms: ${prop}[${k}] tiene {${Object.keys(el).join(",")}} y el componente lee {${esperados.join(",")}} → SALE VACÍO Y PASA EN VERDE`);
        return;
      }
      // ⛔ y ademas TODOS los campos OBLIGATORIOS del tipo: que sobreviva `tx` no salva al `text`
      const req = (c.oblig || {})[prop] || [];
      const faltan = req.filter((campo) => el[campo] === undefined || el[campo] === "");
      if (faltan.length) {
        problemas.push(`${u.comp} @${u.ms}ms: ${prop}[${k}] NO trae {${faltan.join(",")}} (obligatorios del tipo) — tiene {${Object.keys(el).join(",")}}`);
      }
    });
  }
}

console.log(`── ITEMS · ${SLUG} · ${usos.length} usos de ${comps.size} componentes`);
for (const comp of [...comps].sort()) {
  const c = contrato(comp);
  if (c && Object.keys(c.campos).length) {
    console.log(`   ${comp}: ${Object.entries(c.campos).map(([a, b]) => `${a}[].{${b.join("|")}}`).join(" · ")}`);
  }
}
console.log(`   arrays medidos ${arraysMedidos} · elementos medidos ${elementosMedidos}`);
if (arraysMedidos < 3) { console.error("⛔ midió menos de 3 arrays — una compuerta que no mide NO es un OK"); process.exit(1); }

if (!problemas.length) {
  console.log("✅ los elementos de todos los arrays traen los campos que el componente LEE");
  if (SELF) { console.error("⛔ CONTROL POSITIVO FALLÓ: no vio las fallas inyectadas"); process.exit(1); }
  process.exit(0);
}
console.error(`\n⛔ ${problemas.length} PROBLEMA(S) — NO RENDEES:`);
problemas.slice(0, 30).forEach((p) => console.error("  · " + p));
if (SELF) { console.log(`(control positivo: detectó ${problemas.length} fallas inyectadas)`); process.exit(0); }
process.exit(1);

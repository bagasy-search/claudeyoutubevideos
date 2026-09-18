// kit.mjs — el MOTOR del montaje PREMIUM: catálogo verificado + planificador.
//
// Son dos cosas, y conviene no mezclarlas:
//   1. cargarKit(dirDelEstilo) → lee kit.json y VERIFICA contra el .tsx REAL que cada export existe.
//      Ésa es la promesa que hace la cabecera de Comp.tsx. Un kind que no está llega como `undefined`
//      y React tira el error #130 SIN decir cuál fue; el import es nombrado, así que `tsc` tampoco lo
//      marca. Leer el archivo y buscar el export es la ÚNICA defensa que existe.
//   2. planPremium(...) → planVlog (el motor de b-roll, intacto) + una CAPA de componentes encima.
//
// ⛔ NO se reimplementa nada de vlogplan.mjs. Ahí ya viven, medidos y corregidos: la fusión de
//    momentos cortos, el tope de un clip a su archivo, el cierre de huecos que no pisa ventanas de
//    avatar y la compuerta de avatar tapado cuadro a cuadro. Acá sólo se suma la capa de comps.
import fs from "node:fs";
import path from "node:path";
import { planVlog, DEFAULTS } from "./vlogplan.mjs";

export const PREMIUM_DEFAULTS = {
  // un componente más corto que esto sale A MEDIO DIBUJAR (staggers fijos en momento corto)
  compMinS: 2.2,
  // Tiempo de lectura. ⚠ NO es la velocidad de PROSA (2,6 pal/s): el texto de un componente son
  // ETIQUETAS cortas que el ojo barre en paralelo (los dos paneles de un VsCard se leen juntos), y
  // en los componentes escalonados el propio stagger ya marca el ritmo. Con 2,6 pal/s un
  // ProcessSteps de 3 pasos pedía 12 s de mínimo y se comía media sección: medido sobre los 57
  // componentes REALES de tfbsilicona + tfbduchapelo.
  palabrasPorSeg: 4.5, lecturaBaseS: 0.9, lecturaMaxS: 7,
  // hasta cuánto se puede ESTIRAR un comp para llegar a su mínimo (sigue atado a su frase)
  compEstiraMaxS: 3.0,
  // ⛔ el fade de salida del último componente SE COME EL CTA: se corta antes, con aire
  margenCtaS: 0.6,
  // máximo de palabras visibles por componente (un comp es un remate, no un párrafo)
  maxPalabrasComp: 12,
};

// ── 1. CATÁLOGO ──────────────────────────────────────────────────────────────

const esTipo = (t) => typeof t === "string";
const esEnum = (t) => !!t && typeof t === "object" && Array.isArray(t.val);
const esArray = (t) => !!t && typeof t === "object" && typeof t.array === "string";
const esObj = (t) => !!t && typeof t === "object" && typeof t.obj === "string";

/** ¿el archivo exporta REALMENTE ese nombre? (const / function / class / re-export de barrel) */
export function exportaDeVerdad(fuente, nombre) {
  const n = nombre.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(
    `export\\s+(?:const|let|var|function|async\\s+function|class)\\s+${n}\\b` +
    `|export\\s*\\{[^}]*\\b${n}\\b[^}]*\\}`,
    "m",
  ).test(fuente);
}

/**
 * cargarKit(dirDelEstilo) — así la llama la fábrica: cargarKit(ROOT/factory/styles/premium).
 * Lee kit.json, resuelve `dir` RELATIVO a esa carpeta y abre cada .tsx para confirmar el export.
 * @returns {{ dir, kinds, tipos, archivos, medido, problemas }}
 */
export function cargarKit(dirEstilo) {
  const jf = path.join(dirEstilo, "kit.json");
  if (!fs.existsSync(jf)) throw new Error(`falta el contrato del kit: ${jf}`);
  const kit = JSON.parse(fs.readFileSync(jf, "utf8").replace(/^﻿/, ""));
  const dir = path.resolve(dirEstilo, kit.dir);
  if (!fs.existsSync(dir)) throw new Error(`kit.json apunta a una carpeta que no existe: ${dir}`);

  const problemas = [];
  const archivos = new Map();
  const nombres = Object.keys(kit.kinds || {});
  if (!nombres.length) throw new Error("kit.json no declara ningún kind");

  let exportsVerificados = 0;
  for (const [kind, d] of Object.entries(kit.kinds)) {
    const abs = path.join(dir, d.file);
    if (!archivos.has(abs)) archivos.set(abs, fs.existsSync(abs) ? fs.readFileSync(abs, "utf8") : null);
    const src = archivos.get(abs);
    if (src === null) { problemas.push(`${kind}: no existe el archivo ${path.relative(dir, abs)}`); continue; }
    if (!exportaDeVerdad(src, d.export)) {
      problemas.push(`${kind}: ${path.relative(dir, abs)} NO exporta "${d.export}" (llegaría undefined → React #130, y tsc no lo marca)`);
      continue;
    }
    exportsVerificados++;
    // los tipos de array/obj tienen que existir en la sección `tipos`
    for (const [p, t] of Object.entries(d.props || {})) {
      const ref = esArray(t) ? t.array : esObj(t) ? t.obj : null;
      if (ref && !kit.tipos?.[ref]) problemas.push(`${kind}.${p}: kit.json usa el tipo "${ref}" que no está declarado en \`tipos\``);
    }
    for (const r of d.req || []) if (!(d.props || {})[r]) problemas.push(`${kind}: la prop requerida "${r}" no está declarada en \`props\``);
  }

  return {
    dir, kinds: kit.kinds, tipos: kit.tipos || {}, archivos: [...archivos.keys()],
    problemas,
    medido: { kindsDeclarados: nombres.length, exportsVerificados, archivosLeidos: archivos.size },
  };
}

// ── 2. NORMALIZACIÓN DE PROPS ────────────────────────────────────────────────

const PALABRAS = (v) => (typeof v === "string" ? (v.match(/\p{L}[\p{L}\p{N}'’-]*/gu) || []).length : 0);

/**
 * Normaliza y VALIDA las props que escribió el director contra lo que el componente ESPERA.
 * · enum fuera de la unión → se traduce por `alias`, o es PROBLEMA (no se degrada en silencio:
 *   una unión inválida deja el texto NEGRO sin tirar error).
 * · number/string/bool se coaccionan (el director escribe "3" tanto como 3).
 * · prop no declarada → aviso (el componente la ignora en silencio y el dato no se ve).
 * · las rutas `asset` se juntan aparte: TIENEN que entrar en la lista de assets del farm.
 */
export function normalizarProps(kind, entrada, kit, { ruta = kind } = {}) {
  const d = kit.kinds[kind];
  const problemas = [], avisos = [], assets = [];
  if (!d) { problemas.push(`${ruta}: kind desconocido "${kind}" (no está en kit.json)`); return { props: {}, assets, avisos, problemas }; }
  const props = normObjeto(entrada, { req: d.req || [], props: d.props || {} }, kit, ruta, { problemas, avisos, assets });
  return { props, assets, avisos, problemas, def: d };
}

function normObjeto(entrada, forma, kit, ruta, acc) {
  const out = {};
  const src = entrada && typeof entrada === "object" ? entrada : {};
  for (const r of forma.req) {
    const v = src[r];
    if (v === undefined || v === null || v === "" || (Array.isArray(v) && !v.length)) acc.problemas.push(`${ruta}: falta la prop REQUERIDA "${r}"`);
  }
  for (const [p, v] of Object.entries(src)) {
    const t = forma.props[p];
    if (t === undefined) { acc.avisos.push(`${ruta}: prop "${p}" no está en la firma del componente (se ignora en silencio)`); continue; }
    if (v === undefined || v === null) continue;
    const r = `${ruta}.${p}`;
    if (esEnum(t)) {
      const s = String(v);
      if (t.val.includes(s)) { out[p] = s; continue; }
      const a = (t.alias || {})[s];
      if (a && t.val.includes(a)) { out[p] = a; acc.avisos.push(`${r}: "${s}" → "${a}" (el componente no tiene ese valor)`); continue; }
      acc.problemas.push(`${r}: valor de unión INVÁLIDO "${s}" (acepta ${t.val.join("|")}) — dejaría el texto NEGRO sin tirar error`);
      continue;
    }
    if (esArray(t)) {
      if (!Array.isArray(v)) { acc.problemas.push(`${r}: tiene que ser una lista de ${t.array}`); continue; }
      const sub = kit.tipos[t.array];
      out[p] = v.map((x, i) => normObjeto(x, { req: sub.req || [], props: sub.props || {} }, kit, `${r}[${i}]`, acc));
      continue;
    }
    if (esObj(t)) {
      const sub = kit.tipos[t.obj];
      out[p] = normObjeto(v, { req: sub.req || [], props: sub.props || {} }, kit, r, acc);
      continue;
    }
    if (!esTipo(t)) { acc.problemas.push(`${r}: kit.json declara un tipo que no entiendo`); continue; }
    if (t === "number") {
      const n = typeof v === "number" ? v : Number(String(v).replace(",", "."));
      if (!Number.isFinite(n)) { acc.problemas.push(`${r}: "${v}" no es un número`); continue; }
      out[p] = n; continue;
    }
    if (t === "bool") { out[p] = !!v; continue; }
    if (t === "color") {
      const s = String(v);
      // ⛔ sin papel detrás, un color escrito a mano deja texto NEGRO SOBRE NEGRO. Se exige HEX/rgb
      // literal para que al menos sea un color de verdad y no una palabra del guion.
      if (!/^(#[0-9a-fA-F]{3,8}|rgba?\(|hsla?\()/.test(s)) { acc.problemas.push(`${r}: "${s}" no es un color literal (#RRGGBB / rgb() / rgba())`); continue; }
      out[p] = s; continue;
    }
    if (t === "asset") {
      const s = String(v).replace(/^\/+/, "");
      if (!s) continue;
      out[p] = s; acc.assets.push(s); continue;
    }
    out[p] = String(v); // string
  }
  return out;
}

/** Palabras VISIBLES de un componente (para el tiempo de lectura y el techo de 12). */
export function palabrasVisibles(props) {
  let n = 0, maxBloque = 0;
  const OCULTA = /^(src|image|color|accentColor|imageTint|font|bg|pin|side|hue|accent|tone|state|orientation|impactAccent)$/;
  const ver = (v) => {
    if (typeof v === "string") { const k = PALABRAS(v); n += k; if (k > maxBloque) maxBloque = k; }
    else if (Array.isArray(v)) v.forEach(ver);
    else if (v && typeof v === "object") Object.entries(v).forEach(([k, x]) => { if (!OCULTA.test(k)) ver(x); });
  };
  Object.entries(props).forEach(([k, v]) => { if (!OCULTA.test(k)) ver(v); });
  palabrasVisibles.bloqueMax = maxBloque;
  return n;
}

/** El bloque de texto MÁS LARGO del componente. "Un comp es un remate, no un párrafo" se mide acá:
 *  un VsCard con 20 palabras repartidas en 7 etiquetas cortas está bien; UNA etiqueta de 20, no. */
export function bloqueMax(props) { palabrasVisibles(props); return palabrasVisibles.bloqueMax; }

/**
 * El ESCALONADO tiene que escalar con la duración del cue.
 * Staggers FIJOS en un momento corto = componente a medio dibujar (mina medida). El director tiene
 * prohibido escribir startAt/stagger justamente por esto: los calcula la fábrica contra el hueco real.
 */
export function escalonar(def, props, durF, fps) {
  const e = def.escalona;
  if (!e) return { inicioF: 0, pasoF: 0, n: 0 };
  const n = Array.isArray(props[e.lista]) ? props[e.lista].length : 0;
  if (!n) return { inicioF: 0, pasoF: 0, n: 0 };
  const F = (s) => Math.round(s * fps);
  const inicioF = Math.min(F(0.9), Math.max(F(0.25), Math.round(durF * 0.06)));
  const disp = Math.max(1, durF - inicioF - F(e.colaS ?? 0.8));
  const pasoF = n > 1
    ? Math.min(F(e.pasoMaxS), Math.max(F(e.pasoMinS), Math.floor(disp / (n - 1))))
    : F(e.pasoMinS);
  if (e.inicio) props[e.inicio] = inicioF;
  if (e.paso) props[e.paso] = pasoF;
  return { inicioF, pasoF, n };
}

/** Segundos MÍNIMOS para que este componente se dibuje entero y se pueda leer. */
export function duracionMinimaS(def, props, O) {
  const pal = palabrasVisibles(props);
  const lectura = Math.min(O.lecturaMaxS, O.lecturaBaseS + pal / O.palabrasPorSeg);
  let escalonado = 0;
  if (def.escalona) {
    const n = Array.isArray(props[def.escalona.lista]) ? props[def.escalona.lista].length : 0;
    if (n) escalonado = 0.25 + (n - 1) * def.escalona.pasoMinS + (def.escalona.colaS ?? 0.8);
  }
  return Math.max(O.compMinS, lectura, escalonado);
}

// ── 3. PLANIFICADOR PREMIUM ──────────────────────────────────────────────────

/**
 * planPremium({ mom, plan, ventanasSec, wavSec, assetOf, framesOf, finFoto, cta, kit, opts })
 * Todo lo de planVlog, más:
 *   · `kit`   el catálogo YA verificado por cargarKit()
 *   · cada plano cuyo campo `k` traiga { kind, props, durS? } emite un cue de CAPA COMPONENTE
 *     ("over") encima del b-roll, con su start/dur y el escalonado calculado.
 * @returns lo mismo que planVlog + { compAssets, avisos } y `medido.comps*`
 */
export function planPremium({ mom, plan, ventanasSec, wavSec, assetOf, framesOf, finFoto, cta, kit, opts = {} }) {
  const O = { ...DEFAULTS, ...PREMIUM_DEFAULTS, ...opts };
  const fps = O.fps;
  const F = (s) => Math.round(s * fps);

  const base = planVlog({ mom, plan, ventanasSec, wavSec, assetOf, framesOf, finFoto, cta, opts });
  const TOTAL = base.total;
  const prob = base.problemas;
  const avisos = [];
  const compAssets = new Set();

  const planBy = new Map(plan.map((p) => [p.name, p]));
  const momBy = new Map(mom.map((m) => [m.name, m]));
  const conK = plan.filter((p) => p.k && p.k.kind);

  // 3.1 normalizar + validar cada componente contra el componente REAL
  const crudos = [];
  for (const p of conK) {
    const m = momBy.get(p.name);
    if (!m) { prob.push(`comp ${p.name}: el plano no es un momento (no se puede anclar)`); continue; }
    const r = normalizarProps(p.k.kind, p.k.props || {}, kit, { ruta: `${p.name}·${p.k.kind}` });
    prob.push(...r.problemas);
    avisos.push(...r.avisos);
    if (r.problemas.length || !r.def) continue;
    // ⛔ un componente que TAPA la pantalla en un momento de avatar cuenta como AVATAR TAPADO
    if (r.def.capa !== "overlay" && planBy.get(p.name)?.tipo === "avatar") {
      prob.push(`comp ${p.name}·${p.k.kind}: TAPA la pantalla en un momento de AVATAR (usá un kind OVERLAY o movelo de momento)`);
      continue;
    }
    const pal = palabrasVisibles(r.props);
    const bloque = palabrasVisibles.bloqueMax;
    if (bloque > O.maxPalabrasComp) avisos.push(`comp ${p.name}·${p.k.kind}: un bloque de ${bloque} palabras (máx ${O.maxPalabrasComp}) — un comp es un remate, no un párrafo`);
    for (const a of r.assets) compAssets.add(a);
    crudos.push({ name: p.name, kind: p.k.kind, def: r.def, props: r.props, i: m.i, m, durS: p.k.durS || null, palabras: pal, bloque });
  }
  crudos.sort((a, b) => a.i - b.i);

  // 3.2 anclar al ms, estirar hasta el mínimo y no pisar ni al vecino ni al CTA
  const ctaStarts = base.cues.filter((c) => c.kind === "cta").map((c) => c.start).sort((a, b) => a - b);
  const cortados = [], estirados = [];
  let solapados = 0;
  const comps = [];
  for (let k = 0; k < crudos.length; k++) {
    const c = crudos[k];
    const f0 = F(c.m.start);
    let f1 = c.durS ? f0 + F(c.durS) : Math.min(F(c.m.end), TOTAL);
    const minF = F(duracionMinimaS(c.def, c.props, O));

    // techo: el próximo componente, el próximo CTA (con aire: el fade del último se come el CTA), el final
    const sigComp = k + 1 < crudos.length ? F(momBy.get(crudos[k + 1].name).start) : Infinity;
    const sigCta = ctaStarts.find((s) => s > f0);
    const tope = Math.min(sigComp, sigCta === undefined ? Infinity : sigCta - F(O.margenCtaS), TOTAL);

    if (f1 > tope) { f1 = tope; cortados.push(`${c.name}·${c.kind}`); }
    if (f1 - f0 < minF) {
      const quiere = Math.min(f0 + minF, f1 + F(O.compEstiraMaxS), tope);
      if (quiere > f1) { estirados.push(`${c.name}·${c.kind}`); f1 = quiere; }
    }
    if (f1 - f0 < 2) { prob.push(`comp ${c.name}·${c.kind}: no le queda ni un cuadro (¿otro comp o el CTA justo encima?)`); continue; }
    if (f1 - f0 < minF) {
      prob.push(`comp ${c.name}·${c.kind}: ${((f1 - f0) / fps).toFixed(1)} s para ${c.palabras} palabras y ${c.def.escalona ? (c.props[c.def.escalona.lista] || []).length : 0} ítems (mínimo ${(minF / fps).toFixed(1)} s) — saldría A MEDIO DIBUJAR`);
      continue;
    }
    const anterior = comps[comps.length - 1];
    if (anterior && f0 < anterior.start + anterior.dur) solapados++;

    const props = { ...c.props };
    const esc = escalonar(c.def, props, f1 - f0, fps);
    comps.push({
      key: `k${String(c.i).padStart(3, "0")}`, start: f0, dur: f1 - f0, capa: "over",
      comp: c.kind, props, i: c.i, _esc: esc,
    });
  }

  if (solapados) prob.push(`${solapados} componentes se PISAN entre sí (uno por momento)`);
  if (cortados.length) avisos.push(`${cortados.length} comps recortados para no pisar al vecino ni al CTA: ${cortados.slice(0, 5).join(", ")}`);
  if (estirados.length) avisos.push(`${estirados.length} comps estirados para llegar a su mínimo: ${estirados.slice(0, 5).join(", ")}`);

  // 3.3 el CTA va SIEMPRE arriba de todo: los comps se insertan ANTES de los cues de CTA
  const cues = [...base.cues.filter((c) => c.kind !== "cta"), ...comps, ...base.cues.filter((c) => c.kind === "cta")];

  const dursComp = comps.map((c) => c.dur / fps).sort((a, b) => a - b);
  return {
    ...base,
    cues,
    problemas: prob,
    avisos,
    compAssets: [...compAssets],
    medido: {
      ...base.medido,
      compsPedidos: conK.length,
      compsEmitidos: comps.length,
      compsKinds: new Set(comps.map((c) => c.comp)).size,
      compsRecortados: cortados.length,
      compsEstirados: estirados.length,
      compAssets: compAssets.size,
      compPalabrasMax: comps.length ? Math.max(...crudos.map((c) => c.palabras)) : 0,
      compBloqueMax: comps.length ? Math.max(...crudos.map((c) => c.bloque)) : 0,
      compDurMinSec: +(dursComp[0] || 0).toFixed(2),
      compDurMedianaSec: +(dursComp[dursComp.length >> 1] || 0).toFixed(2),
      compsCadaNMomentos: comps.length ? Math.round(mom.length / comps.length) : 0,
    },
  };
}

// ── 4. DOCUMENTACIÓN PARA EL DIRECTOR ────────────────────────────────────────

const pinta = (t, kit) => {
  if (esEnum(t)) return `enum:${t.val.join("\\|")}`;
  if (esArray(t)) return `array:${t.array}`;
  if (esObj(t)) return `obj:${t.obj}`;
  return t;
};

/** Tabla de kinds + tipos, generada del MISMO kit.json que valida. Así el prompt no puede mentir. */
export function docKit(kit) {
  const L = ["| kind | | props |", "|---|---|---|"];
  for (const [kind, d] of Object.entries(kit.kinds)) {
    const req = new Set(d.req || []);
    const ps = Object.entries(d.props)
      .sort((a, b) => (req.has(b[0]) ? 1 : 0) - (req.has(a[0]) ? 1 : 0))
      .filter(([p]) => !(d.escalona && (p === d.escalona.inicio || p === d.escalona.paso)))
      .map(([p, t]) => `${p}${req.has(p) ? "" : "?"}: ${pinta(t, kit)}`);
    L.push(`| \`${kind}\` | ${d.capa === "overlay" ? "OVERLAY" : "tapa"} | ${ps.join(", ")} |`);
  }
  const tipos = Object.entries(kit.tipos).map(([n, d]) => {
    const req = new Set(d.req || []);
    return `\`${n}\` {${Object.entries(d.props).map(([p, t]) => `${p}${req.has(p) ? "" : "?"}: ${pinta(t, kit)}`).join(", ")}}`;
  });
  return L.join("\n") + "\n\nTipos de los arrays: " + tipos.join(" · ") + "\n";
}

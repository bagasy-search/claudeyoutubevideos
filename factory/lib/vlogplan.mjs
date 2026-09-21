// vlogplan.mjs — el MOTOR del montaje "vlog crudo con avatar por ventanas" (Taller de Claudio y afines).
// Función PURA: recibe momentos/plan/ventanas y callbacks de disco; devuelve cues + problemas.
// Nada de SLUG quemado, nada de rutas: lo específico entra por `opts`.
//
// Procedencia (trazada, no copiada a ciegas): build_tcfiltro.mjs (entregado limpio) + los DOS arreglos
// que nacieron en build_tcbriquetas.mjs después del auditor:
//   1. un clip NUNCA dura más que su archivo (el <Loop> repetía el movimiento: 86/236 planos)
//   2. el cierre de huecos NO estira un plano encima de una ventana de avatar ya empezada (92/177 s tapados)
// y un tercero nuevo, que ninguno tenía: COMPUERTA DURA de avatar tapado medida cuadro a cuadro.
import { medirTimeline } from "./timeline.mjs";

export const DEFAULTS = {
  fps: 30, minPlanoS: 1.2, partirS: 7.0, colaFotoS: 2.5, minCueF: 20, aperturaMinS: 3,
  // golpes (gráficos del hook): techo medido, no gusto. Ver §4.bis
  maxGolpes: 12, golpeSepMinS: 12, golpeDurS: 2.0, maxPalabrasFrase: 8, maxPalabrasSello: 4, maxPalabrasEtiqueta: 5,
  cerrarHuecoMaxS: 4.5, jcutProb: 0.55, lcutProb: 0.25, bordeVentanaF: 12,
  maxAvatarTapadoS: 1.0, maxPlacaVistaS: 1.5, minCoberturaPct: 99,
};

export const rnd = (n) => {
  let h = Math.imul((n | 0) ^ 0x9e3779b9, 0x85ebca6b);
  h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
};

/**
 * planVlog({ mom, plan, ventanasSec, wavSec, assetOf, framesOf, finFoto, cta, opts })
 *   mom:        [{ i, name, start, end, dur, texto }]
 *   plan:       [{ name, tipo: "avatar"|"imagen" }]
 *   ventanasSec:[{ k, start, end }]
 *   assetOf(name) → { tipo: "clip"|"foto", src } | null      (src relativo a public/)
 *   framesOf(src) → cuadros reales del clip (0 si no se puede medir)
 *   finFoto(name, clipSrc) → { tipo: "foto", src }            (último cuadro del clip como foto)
 *   cta: { regex, head, sub, qr?, durS? } o [ {...}, ... ]  (varios CTA; sin durS = hasta el final)
 */
export function planVlog({ mom, plan, ventanasSec, wavSec, assetOf, framesOf, finFoto, cta, opts = {} }) {
  const O = { ...DEFAULTS, ...opts };
  const F = (s) => Math.round(s * O.fps);
  const TOTAL = Math.ceil(wavSec * O.fps);
  const prob = [];
  if (!mom?.length) throw new Error("planVlog: mom vacío");
  if (!(TOTAL > 0)) throw new Error("planVlog: wavSec inválido");
  const planBy = new Map(plan.map((p) => [p.name, p]));
  const VENT = ventanasSec.map((w) => ({ ...w, f0: F(w.start), f1: Math.min(F(w.end), TOTAL) }));
  const enVentana = (f) => VENT.some((w) => f >= w.f0 && f < w.f1);

  // 1. fusionar momentos cortos (nunca a través de un avatar)
  const mm = [];
  for (const b of mom) {
    const prev = mm[mm.length - 1];
    if (prev && b.dur < O.minPlanoS && planBy.get(b.name)?.tipo !== "avatar" && planBy.get(prev.name)?.tipo !== "avatar") {
      prev.end = b.end; prev.dur = +(prev.end - prev.start).toFixed(3); continue;
    }
    mm.push({ ...b });
  }

  // 2. asset por NOMBRE propio
  const faltan = [];
  for (const m of mm) {
    const p = planBy.get(m.name);
    if (!p) { faltan.push(`${m.name} (sin plan)`); continue; }
    m.plan = p;
    if (p.tipo === "avatar") continue;
    const a = assetOf(m.name);
    if (!a) { faltan.push(m.name); continue; }
    Object.assign(m, a);
    const b = assetOf(`${m.name}x`);
    if (b) m.segundo = b;
  }

  const capDe = (el) => (el && el.tipo === "clip" ? Math.max(1, (framesOf(el.src) || 0) - 1) : Infinity);
  const COLA_FOTO_F = F(O.colaFotoS);
  const sinCobertura = [];
  const clipsSinCuadros = new Set();

  // 3. cues al cuadro, clips topados a su archivo
  const cues = [];
  const usables = mm.filter((m) => m.tipo);
  for (let k = 0; k < usables.length; k++) {
    const m = usables[k];
    const sig = usables[k + 1];
    const f0 = F(m.start);
    let f1 = Math.min(F(m.end), TOTAL);
    if (sig && Math.abs(F(sig.start) - f1) <= 1) f1 = F(sig.start);
    if (f1 - f0 < 2) continue;
    const len = f1 - f0;
    const uno = { tipo: m.tipo, src: m.src };
    for (const el of [uno, m.segundo]) if (el?.tipo === "clip" && !(framesOf(el.src) > 0)) clipsSinCuadros.add(el.src);
    const usar = (len <= capDe(uno) && len / O.fps <= O.partirS) || !m.segundo ? [uno] : [uno, m.segundo];
    let cortes = [f0, f1];
    if (usar.length === 2) {
      let c = f0 + Math.round(len * (0.32 + 0.36 * rnd(m.i * 7 + 3)));
      c = Math.max(c, f1 - capDe(usar[1]));
      c = Math.min(c, f0 + capDe(usar[0]));
      cortes = [f0, c, f1];
    }
    const tramos = [];
    for (let s = 0; s < usar.length; s++) {
      const a0 = cortes[s], a1 = cortes[s + 1], el = usar[s], cap = capDe(el);
      if (a1 - a0 <= cap) { tramos.push([a0, a1, el]); continue; }
      tramos.push([a0, a0 + cap, el]);
      const resto = a1 - (a0 + cap);
      if (resto > COLA_FOTO_F) sinCobertura.push(`${m.name}${s ? "x" : ""}: ${(resto / O.fps).toFixed(1)} s más largo que su clip (sumá un plano "${m.name}x")`);
      tramos.push([a0 + cap, a1, finFoto(`${m.name}${s ? "x" : ""}`, el.src)]);
    }
    tramos.forEach(([a0, a1, el], s) => {
      if (a1 - a0 < 1) return;
      cues.push({ key: `m${String(m.i).padStart(3, "0")}${s ? "abcdef"[s - 1] : ""}`, start: a0, dur: a1 - a0, capa: "base", tipo: el.tipo, src: el.src, i: m.i });
    });
  }

  // 3.ante apertura con el avatar hablando
  const aperturaS = Math.max(O.aperturaMinS, mm[0].end);
  {
    const f0 = F(aperturaS);
    for (let k = cues.length - 1; k >= 0; k--) {
      const c = cues[k];
      if (c.start >= f0) continue;
      const fin = c.start + c.dur;
      if (fin <= f0 + O.minCueF) { cues.splice(k, 1); continue; }
      c.dur = fin - f0; c.start = f0;
    }
  }

  // 3.bis J/L-cuts sin pasar clips de su archivo
  let nJ = 0, nL = 0;
  {
    const b = cues.filter((c) => c.capa === "base").sort((a, z) => a.start - z.start);
    for (let k = 1; k < b.length; k++) {
      const ant = b[k - 1], act = b[k];
      if (act.start !== ant.start + ant.dur) continue;
      const r = rnd(act.start * 13 + 101);
      let d = 0;
      if (r < O.jcutProb) d = -(4 + Math.round(rnd(act.start * 29 + 7) * 7));
      else if (r < O.jcutProb + O.lcutProb) d = 3 + Math.round(rnd(act.start * 31 + 11) * 5);
      else continue;
      if (ant.dur + d < O.minCueF || act.dur - d < O.minCueF || ant.dur + d > capDe(ant) || act.dur - d > capDe(act)) continue;
      ant.dur += d; act.start += d; act.dur -= d;
      if (d < 0) nJ++; else nL++;
    }
  }

  // 3.ter cerrar huecos FUERA de ventanas — nunca encima de una ventana (ni futura ni ya empezada)
  let cerrados = 0;
  {
    const b = cues.filter((c) => c.capa === "base").sort((a, z) => a.start - z.start);
    for (let k = 0; k < b.length; k++) {
      const fin = b[k].start + b[k].dur;
      if (VENT.some((v) => v.f0 < fin && v.f1 > fin)) continue;
      const prox = k + 1 < b.length ? b[k + 1].start : TOTAL;
      const w = VENT.map((v) => v.f0).filter((s) => s >= fin).sort((x, y) => x - y)[0];
      const tope = Math.min(prox, w === undefined ? TOTAL : w, b[k].start + capDe(b[k]));
      if (tope > fin && tope - fin <= F(O.cerrarHuecoMaxS)) { b[k].dur = tope - b[k].start; cerrados++; }
    }
  }

  // 4. CTA (capa over) atado a su frase
  // CTA: uno o varios. Los del medio duran `durS` (hay que poder escanear el QR); el último va al final.
  const ctas = !cta ? [] : Array.isArray(cta) ? cta : [cta];
  ctas.forEach((c, idx) => {
    const m = mm.find((x) => c.regex.test(x.texto));
    if (!m) { prob.push(`no encontré la frase del CTA ${idx + 1} (${c.regex}) en el guion`); return; }
    const f0 = F(m.start);
    const dur = c.durS ? Math.min(F(c.durS), TOTAL - f0) : TOTAL - f0;
    if (dur < F(3)) { prob.push(`el CTA ${idx + 1} dura ${(dur / O.fps).toFixed(1)} s: no alcanza para escanear el QR`); return; }
    cues.push({ key: `cta${idx + 1}`, start: f0, dur, capa: "over", kind: "cta", props: { head: c.head, sub: c.sub, ...(c.qr ? { qr: c.qr } : {}) } });
  });

  // 4.bis GOLPES (capa over): los gráficos del HOOK. El DIRECTOR marca el plano con
  //   `gr: { kind: "numero"|"sello"|"etiqueta"|"frase", props: {...}, durS }`.
  //   ⛔ `gr`, no `g`: `g` ya es "hay gente" en el contrato del DIRECTOR.
  // ⛔ Van en el hook y en los golpes, NO sobre el proceso: los ganadores de este molde son cámara
  //   fija, manos y cero gráficos. Por eso hay TECHO de densidad medido, no "a gusto del director":
  //   sin techo, el molde deja de calzar con la miniatura y se pierde la distribución, que es
  //   justamente lo que costó 2.116.600 vs 780 vistas.
  const golpes = [];
  const LIM = { frase: O.maxPalabrasFrase, sello: O.maxPalabrasSello, etiqueta: O.maxPalabrasEtiqueta, numero: 3 };
  for (const m of mm) {
    const g = m.plan?.gr;
    if (!g) continue;
    if (!LIM[g.kind]) { prob.push(`${m.name}: golpe de tipo desconocido "${g.kind}" (numero|sello|etiqueta|frase)`); continue; }
    const texto = String(g.props?.texto || g.props?.sub || g.props?.n || "");
    const pal = texto.trim().split(/\s+/).filter(Boolean).length;
    if (pal > LIM[g.kind]) { prob.push(`${m.name}: el golpe "${g.kind}" tiene ${pal} palabras (máx ${LIM[g.kind]}) — no se lee en pantalla`); continue; }
    const f0 = F(m.start);
    const dur = Math.min(F(g.durS || O.golpeDurS), F(m.end) - f0);
    if (dur < F(0.8)) { prob.push(`${m.name}: el golpe dura ${(dur / O.fps).toFixed(2)} s, no llega a leerse`); continue; }
    golpes.push({ key: `golpe_${m.name}`, start: f0, dur, capa: "over", kind: "golpe", golpe: g.kind, props: g.props || {} });
  }
  golpes.sort((a, b) => a.start - b.start);
  if (golpes.length > O.maxGolpes) prob.push(`${golpes.length} golpes (máx ${O.maxGolpes}): con este molde el gráfico de más rompe el calce con la miniatura`);
  for (let i = 1; i < golpes.length; i++) {
    const sep = (golpes[i].start - (golpes[i - 1].start + golpes[i - 1].dur)) / O.fps;
    if (sep < O.golpeSepMinS) prob.push(`golpes pegados: ${golpes[i - 1].key} y ${golpes[i].key} a ${sep.toFixed(1)} s (mín ${O.golpeSepMinS})`);
  }
  cues.push(...golpes);

  // 5. MEDICIÓN + problemas (todo con número)
  const base = cues.filter((c) => c.capa === "base").sort((a, b) => a.start - b.start);
  const ventanas = VENT.map((w) => ({ k: w.k, from: w.f0, dur: w.f1 - w.f0 }));
  const med = medirTimeline({ base, ventanas, total: TOTAL, fps: O.fps, bordeF: O.bordeVentanaF });

  if (faltan.length) prob.push(`${faltan.length} momentos sin asset: ${faltan.slice(0, 10).join(", ")}`);
  for (const s of sinCobertura) prob.push(s);
  if (clipsSinCuadros.size) prob.push(`${clipsSinCuadros.size} clips con 0 cuadros medidos (se congelarían): ${[...clipsSinCuadros].slice(0, 5).join(", ")}`);
  if (med.avatarTapadoInteriorSec > O.maxAvatarTapadoS) prob.push(`AVATAR TAPADO ${med.avatarTapadoInteriorSec} s (máx ${O.maxAvatarTapadoS}) · peores: ${med.peoresVentanas.slice(0, 4).map((w) => `w${w.k}@${w.desdeSec}s=${w.tapadoSec}s`).join(", ")}`);
  if (med.placaVistaSec > O.maxPlacaVistaS) prob.push(`${med.placaVistaSec} s con la PLACA quieta a la vista`);
  if (med.coberturaPct < O.minCoberturaPct) prob.push(`cobertura ${med.coberturaPct} % < ${O.minCoberturaPct} %`);
  if (med.destellos) prob.push(`${med.destellos} destellos (hueco 1-5 cuadros fuera de ventana)`);
  if (med.repesConsecutivos) prob.push(`${med.repesConsecutivos} pares consecutivos con el MISMO asset: ${(med.paresRepe || []).join(" | ")}`);
  const loops = base.filter((c) => c.tipo === "clip" && c.dur > capDe(c) + 1);
  if (loops.length) prob.push(`${loops.length} planos de clip más largos que su archivo: ${loops.slice(0, 5).map((c) => c.key).join(", ")}`);
  const uso = {};
  for (const c of base) if (c.tipo === "clip") uso[c.src] = (uso[c.src] || 0) + 1;
  const dobles = Object.entries(uso).filter(([, v]) => v > 1);
  if (dobles.length) prob.push(`${dobles.length} clips usados en más de un plano: ${dobles.slice(0, 5).map(([k]) => k).join(", ")}`);
  if (!VENT.length || VENT[0].start > 0.05 || base.some((c) => c.start < F(aperturaS))) prob.push("la apertura NO es el avatar hablando");

  const durs = base.map((c) => c.dur / O.fps).sort((a, b) => a - b);
  const q = (x) => +(durs[Math.floor(durs.length * x)] || 0).toFixed(2);
  return {
    total: TOTAL, cues, ventanas, problemas: prob,
    medido: {
      momentos: mom.length, fusionados: mm.length, cuesBase: base.length,
      clips: base.filter((c) => c.tipo === "clip").length, fotos: base.filter((c) => c.tipo === "foto").length,
      jcuts: nJ, lcuts: nL, huecosCerrados: cerrados, aperturaSec: +aperturaS.toFixed(2),
      golpes: golpes.length, golpeUltimoSec: golpes.length ? +(golpes[golpes.length - 1].start / O.fps).toFixed(1) : 0,
      planoP25: q(0.25), planoMediana: q(0.5), planoP75: q(0.75), planoMax: +(durs[durs.length - 1] || 0).toFixed(2),
      ...med,
    },
  };
}

// fxpack.mjs — PAQUETE DE EFECTOS del montaje premium: decide QUÉ efecto va DÓNDE, por reglas, sin
// dirección plano por plano. Lo dibuja factory/styles/premium/Piezas.tsx (FotoFx, FxOver, AvatarVentana).
// Se activa con `style.fx` (ej. ole-camp.json). Sin `style.fx`, 60_build no lo llama y nada cambia.
//
// Reglas de oficio (medidas y pedidas por el creador, 27-sep-2026):
//  · NADA quieto: toda foto se mueve (Ken-Burns o capas 2.5D) y los lugares tienen su atmósfera.
//  · Limpio gana a denso: como mucho DOS capas de efecto encima de un plano a la vez.
//  · Nunca nada sobre la cara: los efectos van sobre el b-roll; el avatar sólo recibe la "segunda cámara".
//  · Sonido: SÓLO grabaciones reales (public/sfx_ole, CC0), camas muy por debajo de la voz, y cada
//    efecto puntual con distancia mínima entre repeticiones (lo repetido molesta).
import fs from "node:fs";
import path from "node:path";

const F = (s) => Math.round(s * 30);
const rnd = (seed, salt = 0) => {
  let h = Math.imul(((seed | 0) + salt * 7919) ^ 0x9e3779b9, 0x85ebca6b);
  h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
};

const NUM = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
const MULT = { hundred: 100, thousand: 1000 };
const valorPalabra = (w) => {
  if (w in NUM) return NUM[w];
  const m = w.match(/^([a-z]+)-([a-z]+)$/);
  if (m && m[1] in NUM && m[2] in NUM && NUM[m[1]] >= 20 && NUM[m[2]] < 10) return NUM[m[1]] + NUM[m[2]];
  if (/^\d+$/.test(w)) return Number(w);
  return null;
};

/** Números que DICE el presentador, con unidad, anclados a la palabra (ms del ASR). */
export function numerosDichos(words, unidades) {
  const toks = words.map((w) => ({ t: String(w.text).trim().toLowerCase().replace(/[^a-z0-9'-]/g, ""), ms: w.startMs, raw: w.text }));
  const out = [];
  for (let i = 0; i < toks.length; i++) {
    let v = valorPalabra(toks[i].t);
    if (v == null) continue;
    if (i > 0 && /^(number|no)$/.test(toks[i - 1].t)) continue;          // "number twelve" = el ítem, no un dato
    let j = i + 1, total = v;
    while (j < toks.length) {
      const w = toks[j].t;
      if (w in MULT) { total *= MULT[w]; j++; continue; }
      const v2 = valorPalabra(w);
      if (v2 != null && v2 < 100 && total >= 100) { total += v2; j++; continue; }
      break;
    }
    const u = toks[j]?.t;
    if (u && unidades[u]) out.push({ n: total, unidad: unidades[u], ms: toks[i].ms, i });
    i = j - 1;
  }
  return out;
}

export function aplicarFx({ slug, style, cues, ventanas, plan, words, audioDesdeF, total, root, overlayKinds, log }) {
  const cfg = style.fx || {};
  const pub = (r) => path.join(root, "public", r);
  const planBy = new Map(plan.map((p) => [p.name, p]));
  const vintage = (style.vintage || "").slice(0, 28);
  const covFile = pub(`img/${slug}/px/_parallax_cov.json`);
  // carpeta de sonidos y camas POR CANAL (default = los de Ole, así sus videos no cambian)
  const SD = cfg.sfxDir || "sfx_ole";
  const AMB_IN = cfg.ambIn || "amb_fuego", AMB_OUT = cfg.ambOut || "amb_viento";
  const cov = fs.existsSync(covFile) ? JSON.parse(fs.readFileSync(covFile, "utf8")) : {};
  const assets = new Set(), eventos = [], medido = {};
  const exterior = new Set(cfg.exterior || []);
  const base = cues.filter((c) => c.capa === "base" && c.src && !c.kind).sort((a, b) => a.start - b.start);
  const comps = cues.filter((c) => c.comp).sort((a, b) => a.start - b.start);
  const tapas = comps.filter((c) => !overlayKinds.has(c.comp));
  const dentro = (f, arr, pad = 0) => arr.some((c) => f >= c.start - pad && f < c.start + c.dur + pad);
  const enVentana = (f) => ventanas.some((w) => f >= w.from && f < w.from + w.dur);

  // ── 1) capas por plano ──────────────────────────────────────────────────────────────────────
  const info = new Map();
  let nPx = 0, nAtm = {}, nGlint = 0, nEra = 0;
  for (const c of base) {
    const nombre = path.basename(c.src).replace(/\.(jpg|png|mp4)$/, "").replace(/_fin$/, "");
    const p = planBy.get(nombre);
    const pr = p?.prompt || "";
    const esV = !!vintage && pr.includes(vintage);
    const esFoto = c.tipo !== "clip";
    const fx = {};
    if (esV) { fx.era = "v"; nEra++; }
    const caliente = /\b(steam|steaming|sizzl|frying|fried|boil|simmer|fresh from the oven|bubbling)\w*/i.test(pr);
    if (esFoto && caliente && !esV) fx.atm = "vapor";
    else if (exterior.has(p?.lugar)) fx.atm = "nieve";
    else if (esFoto && /lit by two kerosene lanterns/i.test(pr) && !esV) fx.atm = "farol";
    else if (esFoto && !esV && rnd(c.start, 9) < 0.45) fx.atm = "polvo";
    if (fx.atm) nAtm[fx.atm] = (nAtm[fx.atm] || 0) + 1;
    if (esFoto && !esV && /\b(syrup|butter|glossy|gravy|molasses|grease|jam|sugar|golden)\b/i.test(pr)) { fx.glint = true; nGlint++; }
    const cv = cov[nombre];
    if (esFoto && c.dur >= 45 && cv >= 0.04 && cv <= 0.65 && fs.existsSync(pub(`img/${slug}/px/${nombre}_pf.webp`)) && fs.existsSync(pub(`img/${slug}/px/${nombre}_pb.jpg`))) {
      fx.pf = `img/${slug}/px/${nombre}_pf.webp`; fx.pb = `img/${slug}/px/${nombre}_pb.jpg`;
      assets.add(fx.pf); assets.add(fx.pb); nPx++;
    }
    info.set(c, { fx, esV, lugar: p?.lugar, caliente, esFoto, nombre });
  }
  medido.parallax = nPx; medido.planosB = base.length; medido.era = nEra; medido.glint = nGlint; medido.atm = nAtm;

  // ── 2) transiciones en los cortes (motivadas, espaciadas, nunca la misma dos veces seguidas) ──
  let ultEntrada = -1e9, ultBurn = -1e9, ultWhoosh = -1e9, ultProy = -1e9, ultKind = "";
  let prev = null, nEnt = {}, nWh = 0, nPr = 0;
  const cambios = [];
  for (const c of base) {
    const I = info.get(c);
    const tapadoPorComp = dentro(c.start + 2, tapas);
    const prevI = prev && prev.start + prev.dur >= c.start - 1 ? info.get(prev) : null;
    let e = null;
    if (!tapadoPorComp) {
      if (prevI && prevI.esV !== I.esV && c.start - ultBurn >= F(cfg.burnMinS ?? 12)) e = "burn";
      else if (c.start - ultEntrada >= F(cfg.entradaMinS ?? 4) && c.start > audioDesdeF + F(3)) {
        const ops = ["whip-l", "whip-r", "zoom"].filter((k) => k !== ultKind);
        e = ops[Math.floor(rnd(c.start, 17) * ops.length)];
      }
    }
    if (e) {
      I.fx.entra = e; ultEntrada = c.start; ultKind = e; nEnt[e] = (nEnt[e] || 0) + 1; cambios.push(c.start);
      if (e === "burn") {
        ultBurn = c.start;
        if (c.start - ultProy >= F(cfg.proyectorMinS ?? 40)) { eventos.push({ src: pub(`${SD}/${cfg.sfxProyector || "proyector"}.wav`), at: (c.start - audioDesdeF) / 30, dur: 1.4, vol: cfg.volProyector ?? 0.1, fi: 0.1, fo: 0.6 }); ultProy = c.start; nPr++; }
      } else if (e !== "zoom" && c.start - ultWhoosh >= F(cfg.whooshMinS ?? 14)) {
        eventos.push({ src: pub(`${SD}/whoosh_${rnd(c.start, 5) < 0.5 ? "a" : "b"}.wav`), at: (c.start - audioDesdeF) / 30 - 0.18, dur: 1.2, vol: cfg.volWhoosh ?? 0.13, fi: 0.02, fo: 0.3 });
        ultWhoosh = c.start; nWh++;
      }
    }
    prev = c;
  }
  medido.entradas = nEnt; medido.whooshes = nWh; medido.proyector = nPr;

  // ── 3) números dichos → contador en pantalla + micro-acercamiento del plano ─────────────────
  const nums = numerosDichos(words, cfg.unidades || {});
  let ultNum = -1e9; const overs = []; let nNum = 0;
  for (const x of nums) {
    const f = F(x.ms / 1000) + audioDesdeF;
    if (f - ultNum < F(cfg.numMinS ?? 16)) continue;
    if (enVentana(f) || dentro(f, comps, F(4))) continue;       // ni sobre la cara ni pisando un componente
    const c = base.find((b) => f >= b.start && f < b.start + b.dur);
    if (!c) continue;
    const dur = Math.min(F(2.6), c.start + c.dur - f + F(0.8));
    if (dur < F(1.6)) continue;
    const I = info.get(c);
    I.fx.punch = f - c.start;
    // tope de capas: el contador cuenta como una; se sacan primero el brillo y la atmósfera suave
    delete I.fx.glint; if (I.fx.era && I.fx.atm) delete I.fx.atm; if (["polvo", "farol"].includes(I.fx.atm)) delete I.fx.atm;
    overs.push({ key: `fxn${nNum}`, start: f, dur, capa: "over", kind: "fxover", fxkind: "num", props: { n: x.n, unidad: x.unidad } });
    cambios.push(f); ultNum = f; nNum++;
  }
  medido.numeros = nNum; medido.numerosDetectados = nums.length;

  // tope de DOS capas por plano (era, atm, brillo): se saca el brillo primero
  let recortes = 0;
  for (const [, I] of info) {
    const capas = [I.fx.era, I.fx.atm, I.fx.glint].filter(Boolean).length;
    if (capas > 2) { delete I.fx.glint; recortes++; }
  }
  medido.capasRecortadas = recortes;
  for (const c of base) { const fx = info.get(c).fx; if (Object.keys(fx).length) c.fx = fx; }

  // ── 4) "segunda cámara" del avatar: corte a un encuadre más cerrado en un remate ────────────
  let nZoom = 0;
  const finFrase = words.map((w, i) => ({ f: F(w.endMs / 1000) + audioDesdeF, fin: /[.!?]["']?$/.test(String(w.text).trim()), i })).filter((x) => x.fin);
  for (const w of ventanas) {
    if (w.dur < F(cfg.zoomMinVentanaS ?? 5.5)) continue;
    if (dentro(w.from + 5, comps.filter((c) => overlayKinds.has(c.comp)), 0) || comps.some((c) => overlayKinds.has(c.comp) && c.start < w.from + w.dur && c.start + c.dur > w.from)) continue;
    const cortes = finFrase.filter((x) => x.f > w.from + w.dur * 0.35 && x.f < w.from + w.dur - F(1.6));
    if (!cortes.length) continue;
    const a = cortes[0].f + 2 - w.from;                           // el corte cae entre dos frases
    const sig = finFrase.find((x) => x.f > cortes[0].f + F(1.4) && x.f <= w.from + w.dur);
    const d = (sig ? sig.f + 2 - w.from : w.dur) - a;
    if (d < F(1.4)) continue;
    w.zoom = [[a, d, cfg.zoomEscala ?? 1.13]]; nZoom++; cambios.push(w.from + a);
  }
  medido.segundaCamara = nZoom;

  // ── 5) riel "N.º X de 25" ───────────────────────────────────────────────────────────────────
  const cards = comps.filter((c) => c.comp === (cfg.railComp || "CampItemCard"));
  const cta = cues.find((c) => c.kind === "cta");
  if (cards.length) {
    const r0 = cards[0].start, r1 = cta ? cta.start : total;
    const ocultar = [...tapas.filter((c) => c.start + c.dur > r0 && c.start < r1).map((c) => [c.start - r0, c.start + c.dur - r0])];
    overs.push({ key: "fxriel", start: r0, dur: r1 - r0, capa: "over", kind: "fxover", fxkind: "riel", props: { marcas: cards.map((c) => c.start - r0), total: cfg.railTotal || cards.length, ocultar, label: cfg.railLabel || "No." } });
    medido.riel = cards.length;
    // triángulo de la cocina en cada ítem (suave: son ~25 en todo el video)
    for (const c of cards) eventos.push({ src: pub(`${SD}/${cfg.sfxItem || "triangulo"}.wav`), at: (c.start - audioDesdeF) / 30, dur: 3.0, vol: cfg.volTriangulo ?? 0.16, fi: 0, fo: 1.2 });
    for (const c of cards) cambios.push(c.start);
  }
  for (const c of comps) cambios.push(c.start);

  // ── 6) camas de ambiente (interior = fuego de la estufa, exterior = viento) y chisporroteo ──
  const clase = (f) => {
    if (enVentana(f)) return "in";
    const c = base.find((b) => f >= b.start && f < b.start + b.dur);
    return c && exterior.has(info.get(c)?.lugar) ? "out" : "in";
  };
  const segs = [];
  for (let f = audioDesdeF; f < total; f += 15) {
    const k = clase(f);
    if (segs.length && segs[segs.length - 1].k === k) segs[segs.length - 1].b = f + 15;
    else segs.push({ k, a: f, b: f + 15 });
  }
  for (let i = 1; i < segs.length; i++) if (segs[i].b - segs[i].a < F(4)) { segs[i - 1].b = segs[i].b; segs.splice(i, 1); i--; }
  for (let i = 1; i < segs.length; i++) if (segs[i].k === segs[i - 1].k) { segs[i - 1].b = segs[i].b; segs.splice(i, 1); i--; }
  for (const s of segs) {
    eventos.push({ src: pub(`${SD}/${s.k === "out" ? AMB_OUT : AMB_IN}.wav`), at: (s.a - audioDesdeF) / 30, dur: (s.b - s.a) / 30, vol: s.k === "out" ? (cfg.volViento ?? 0.55) : (cfg.volFuego ?? 0.45), fi: 1.5, fo: 1.5, loop: true });
  }
  let nSiz = 0;
  // ⛔ (05-oct, hlcasas) el chisporroteo es del kit de Lou (diner): en un canal sin `sizzle.wav` (Harlan) una foto
  //    con "frying/pork" en el prompt rompía 60_build con un faltante que el director no puede arreglar.
  const haySizzle = fs.existsSync(pub(`${SD}/sizzle.wav`));
  for (const c of haySizzle ? base : []) {
    const I = info.get(c);
    if (!I.esFoto || !I.caliente || I.esV || c.dur < F(2) || !/fry|fried|frying|sizzl|lard|bacon fat|pork/i.test(planBy.get(I.nombre)?.prompt || "")) continue;
    eventos.push({ src: pub(`${SD}/sizzle.wav`), at: (c.start - audioDesdeF) / 30, dur: c.dur / 30, vol: cfg.volSizzle ?? 0.35, fi: 0.25, fo: 0.35 });
    nSiz++;
  }
  medido.camas = segs.length; medido.chisporroteos = nSiz;
  // ── 6.bis) SONIDO DE CADA COMPONENTE (style.fx.compSfx) ─────────────────────────────────────
  //   { Kind: [[sfx, at, vol, dur?]] } — `at` en segundos desde el arranque del componente, o
  //   "end-1.2" (relativo a su final). La entrega sale del máster de MEZCLA, así que el golpe del
  //   componente (sello, campanita, ticket) tiene que vivir acá y no en un <Audio> de Remotion.
  let nCompSfx = 0;
  for (const c of comps) {
    const lista = (cfg.compSfx || {})[c.comp];
    if (!lista) continue;
    for (const [sfx, at, vol, dur] of lista) {
      const rel = typeof at === "string" && at.startsWith("end-") ? c.dur / 30 - Number(at.slice(4)) : Number(at);
      if (!(rel >= 0)) continue;
      const src = pub(`${SD}/${sfx}.wav`);
      if (!fs.existsSync(src)) { log?.(`  ⚠ compSfx: falta ${SD}/${sfx}.wav`); continue; }
      eventos.push({ src, at: (c.start - audioDesdeF) / 30 + rel, dur: dur ?? Math.min(4, c.dur / 30), vol: vol ?? 0.3, fi: 0.01, fo: 0.25 });
      nCompSfx++;
    }
  }
  medido.sonidosComponentes = nCompSfx;

  for (const e of eventos) assets.add(path.relative(pub(""), e.src).split(path.sep).join("/"));

  // ── 7) compuertas de oficio ─────────────────────────────────────────────────────────────────
  const hitos = [...new Set(cambios)].sort((a, b) => a - b).filter((f) => f >= audioDesdeF);
  let maxGap = 0, maxGapAt = 0;
  for (let i = 1; i < hitos.length; i++) if (hitos[i] - hitos[i - 1] > maxGap) { maxGap = hitos[i] - hitos[i - 1]; maxGapAt = hitos[i - 1]; }
  medido.hitosLlamativos = hitos.length;
  medido.maxHuecoSinHitoS = +(maxGap / 30).toFixed(1);
  medido.maxHuecoEnS = +(maxGapAt / 30).toFixed(1);
  const sobreCara = overs.filter((o) => o.fxkind === "num" && enVentana(o.start)).length;
  medido.efectosSobreCara = sobreCara;
  return { cues: [...cues, ...overs].sort((a, b) => a.start - b.start), ventanas, eventos, assets: [...assets], medido };
}

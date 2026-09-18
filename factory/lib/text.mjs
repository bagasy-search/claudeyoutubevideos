// text.mjs — guion → momentos, detector de bucles de TTS, compose de la dirección → plan.
// Procedencia: _v3/tcfiltro_frases.mjs, _v3/tcfiltro_compose.mjs, _v3/tcfiltro_secciones.mjs (sin slug quemado).

/** Parte el guion en MOMENTOS (una frase = un plano) con la tasa real del canal. */
export function frases(txt, { cps = 15.0, minChars = 55, maxSec = 9.0, objetivoSec = 5.5 } = {}) {
  const limpio = txt.replace(/^﻿/, "").split(/\r?\n/).filter((l) => !/^\s*(T[ÍI]TULO|CANAL)\s*:/i.test(l) && !/^\s*=+.*=*\s*$/.test(l)).join("\n")
    .replace(/\[[^\]]*\]/g, "").trim();
  const parr = limpio.split(/\n\s*\n+/).map((p) => p.replace(/\s+/g, " ").trim()).filter(Boolean);
  let mom = [];
  for (let pi = 0; pi < parr.length; pi++) {
    const fr = parr[pi].match(/[^.?!]+[.?!]+["»”)]*|[^.?!]+$/g) || [parr[pi]];
    for (const f of fr) {
      const t = f.trim();
      if (!t) continue;
      const prev = mom[mom.length - 1];
      if (prev && prev.p === pi && t.length < minChars) { prev.texto += " " + t; continue; }
      mom.push({ p: pi, texto: t });
    }
  }
  const partido = [];
  for (const m of mom) {
    const chars = m.texto.length;
    if (chars / cps <= maxSec) { partido.push(m); continue; }
    const n = Math.ceil(chars / cps / objetivoSec);
    const cortes = [];
    const re = /[,;:]\s+|\.\s+/g; let mm;
    while ((mm = re.exec(m.texto)) !== null) cortes.push(mm.index + mm[0].length);
    if (!cortes.length) { partido.push(m); continue; }
    let prev = 0;
    const usados = [];
    for (let k = 1; k < n; k++) {
      const o = (chars * k) / n;
      const c = cortes.filter((x) => x > prev + 30 && x < chars - 30).sort((a, b) => Math.abs(a - o) - Math.abs(b - o))[0];
      if (c && !usados.includes(c)) { usados.push(c); prev = c; }
    }
    let ini = 0;
    for (const c of usados.concat([chars])) { const t = m.texto.slice(ini, c).trim(); if (t) partido.push({ p: m.p, texto: t }); ini = c; }
  }
  mom = partido;
  for (let k = mom.length - 2; k >= 0; k--) if (mom[k].texto.length / cps < 0.8) { mom[k + 1].texto = mom[k].texto + " " + mom[k + 1].texto; mom.splice(k, 1); }
  let acc = 0;
  return mom.map((m, i) => {
    const chars = m.texto.length, dur = +(chars / cps).toFixed(2);
    const r = { p: m.p, texto: m.texto, chars, i, dur, start: +acc.toFixed(2), end: +(acc + dur).toFixed(2), name: `p${String(i).padStart(3, "0")}` };
    acc += dur;
    return r;
  });
}

const toks = (s) => (s.toLowerCase().match(/[\p{L}\p{N}]+/gu) || []);

/**
 * Detector de BUCLES del TTS (tcbriquetas: Fish metió "frase ×4" con bloques de 2500 chars).
 * Compara n-gramas del ASR contra el guion: un n-grama que aparece en el ASR MÁS veces que en el guion
 * (y ≥3) es un bucle. También mide la inflación de palabras (ASR/guion).
 */
export function detectarBucles(guion, asrTexto, { n = 6, minRep = 3 } = {}) {
  const g = toks(guion), a = toks(asrTexto);
  const cuenta = (arr) => { const m = new Map(); for (let i = 0; i + n <= arr.length; i++) { const k = arr.slice(i, i + n).join(" "); m.set(k, (m.get(k) || 0) + 1); } return m; };
  const cg = cuenta(g), ca = cuenta(a);
  const bucles = [];
  for (const [k, v] of ca) { const esp = cg.get(k) || 0; if (v >= minRep && v > esp + 1) bucles.push({ ngrama: k, asr: v, guion: esp }); }
  bucles.sort((x, y) => y.asr - x.asr);
  return { palabrasGuion: g.length, palabrasAsr: a.length, inflacionPct: g.length ? +((100 * (a.length - g.length)) / g.length).toFixed(1) : 0, bucles: bucles.slice(0, 20) };
}

/** Bordes de sección por frase-ancla. anclas = [[NOMBRE, "comienzo de frase"], ...] */
export function secciones(mom, anclas) {
  if (!anclas?.length) return [{ nombre: "TODO", desde: 0, hasta: mom.length - 1 }];
  const idx = anclas.map(([nombre, a]) => {
    const i = mom.findIndex((m) => m.texto.toLowerCase().startsWith(a.toLowerCase()));
    if (i < 0) throw new Error(`sección ${nombre}: no encontré la frase-ancla "${a}"`);
    return { nombre, i };
  }).sort((x, y) => x.i - y.i);
  idx[0].i = 0;
  return idx.map((s, k) => ({ nombre: s.nombre, desde: s.i, hasta: k + 1 < idx.length ? idx[k + 1].i - 1 : mom.length - 1 }));
}

/**
 * compose: tramos de DIRECCIÓN (lo creativo, escrito por Claude) → plan.json con prompts completos.
 * dir item: { n, t?: "avatar", m, c: 0|1, e: wide|medium|close, l: lugar, s: escena (usa TOKEN del presentador
 *            y claves del glosario), mo: movimiento, v?: vintage }
 */
export function compose({ mom, tramos, style, glosario = {}, secs }) {
  const byName = new Map(mom.map((m) => [m.name, m]));
  const secDe = (i) => (secs?.find((s) => i >= s.desde && i <= s.hasta)?.nombre) || "TODO";
  const TOKEN = style.presentadorToken || "PRESENTER";
  const ENC = (x) => ({ wide: "wide view showing the whole place around the subject, ", medium: "medium shot, ", close: /close view/.test(x.s) ? "" : "close view, " })[x.e];
  const errores = [];
  const prompt = (x) => {
    // se reportan TODOS los errores del plano, no sólo el primero
    if (x.c && !x.s.includes(TOKEN)) errores.push(`${x.n}: c=1 pero la escena no nombra a ${TOKEN}`);
    if (!x.c && x.s.includes(TOKEN)) errores.push(`${x.n}: c=0 pero la escena nombra a ${TOKEN}`);
    if (!style.lugares?.[x.l]) { errores.push(`${x.n}: lugar desconocido "${x.l}" (agregalo al estilo)`); return ""; }
    let esc = x.s.replaceAll(TOKEN, style.presentador + ",");
    for (const [k, v] of Object.entries(glosario)) esc = esc.replaceAll(k, v);
    const cuerpo = `${ENC(x)}${esc}, ${style.lugares[x.l]}`;
    return x.v ? `${cuerpo}, ${style.vintage}` : `candid photo taken on a modern smartphone, ${cuerpo}, ${style.formula}`;
  };
  const plan = [];
  const vistos = new Set();
  for (const x of tramos) {
    const baseName = x.n.replace(/x$/, "");
    const m = byName.get(baseName);
    if (!m) { errores.push(`${x.n}: no es un momento`); continue; }
    if (vistos.has(x.n)) { errores.push(`${x.n}: repetido`); continue; }
    vistos.add(x.n);
    // `k` (componente del kit premium) y `st` (consulta de metraje real) viajan TAL CUAL al plan:
    // 60_build y 45_stock los leen de ahí. ⛔ Si `compose` los descarta, el plan queda sin componentes
    // y el montaje premium emite un video mudo de comps sin decir nada (medido: plan.json con 0 `k`
    // mientras los dir_*.json tenían 57).
    const extra = { ...(x.k ? { k: x.k } : {}), ...(x.st ? { st: String(x.st) } : {}) };
    if (x.t === "avatar") { plan.push({ name: x.n, i: m.i, sec: secDe(m.i), dice: m.texto, tipo: "avatar", muestra: x.m || "presentador a cámara", ...extra }); continue; }
    if (!["wide", "medium", "close"].includes(x.e)) { errores.push(`${x.n}: encuadre inválido "${x.e}"`); continue; }
    if (!x.s || !x.mo) { errores.push(`${x.n}: falta escena (s) o movimiento (mo)`); continue; }
    if (/\bbreath|breathing|respir/i.test(x.mo)) errores.push(`${x.n}: el movimiento pide "respirar" (prohibido: agnes lo deforma)`);
    plan.push({ name: x.n, i: m.i, sec: secDe(m.i), dice: m.texto, tipo: "imagen", muestra: x.m, encuadre: x.e, motor: x.c ? "gpt" : "gptsin", lugar: x.l, prompt: prompt(x), motion: x.mo, persona: !!x.c, gente: !!x.g, ...extra });
  }
  plan.sort((a, b) => a.i - b.i || a.name.localeCompare(b.name));
  const faltan = mom.filter((m) => !vistos.has(m.name)).map((m) => m.name);
  const sinX = mom.filter((m) => m.dur > 7 && !vistos.has(m.name + "x") && plan.find((p) => p.name === m.name && p.tipo !== "avatar")).map((m) => m.name);
  const img = plan.filter((p) => p.tipo === "imagen");
  const pct = (n) => (img.length ? Math.round((100 * n) / img.length) : 0);
  let racha = 1, rachaMax = img.length ? 1 : 0;
  for (let k = 1; k < img.length; k++) { racha = img[k].lugar === img[k - 1].lugar ? racha + 1 : 1; rachaMax = Math.max(rachaMax, racha); }
  return {
    plan, errores, faltan, sinX,
    medido: { momentos: mom.length, cubiertos: mom.length - faltan.length, planosImagen: img.length, planosAvatar: plan.length - img.length,
      avatarPctMomentos: Math.round((100 * (plan.length - img.length)) / mom.length), presentadorPct: pct(img.filter((p) => p.motor === "gpt").length),
      closePct: pct(img.filter((p) => p.encuadre === "close").length), mediumPct: pct(img.filter((p) => p.encuadre === "medium").length),
      widePct: pct(img.filter((p) => p.encuadre === "wide").length), rachaMaxLugar: rachaMax },
  };
}

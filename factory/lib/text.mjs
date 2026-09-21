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
    // ⛔⛔ Si el plano NO lleva presentador (`c:0`) y no pidió gente (`g:1`), hay que PROHIBIR personas
    //    EXPLÍCITAMENTE. Sin esto el motor inventa gente que NO es el presentador y queda en el video:
    //    medido en fbmarmol (17-sep-2026) — un señor mayor atendiendo el mostrador de la ferretería, un
    //    hombre de remera oscura con una caja, alguien de buzo negro agachado junto al balde: 11 planos.
    //    La marca `gente` existía en el plan desde siempre pero NO llegaba al prompt.
    //    Las MANOS sí se permiten: media dirección son manos trabajando, y "no hands" rompería esos planos.
    const sinGente = !x.c && !x.g ? ", nobody in the picture, no people, no person, no face, no bystander, no figure in the background" : "";
    return x.v ? `${cuerpo}${sinGente}, ${style.vintage}` : `candid photo taken on a modern smartphone, ${cuerpo}${sinGente}, ${style.formula}`;
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
    // COMPUERTA DE LA FORMA DEL COMPONENTE (18-sep-2026). DOS de tres directores escribieron las props
    // al nivel de `k` en vez de dentro de `props` (fboxidoropa: 11 componentes emitidos 0; fbaislar: 9).
    // El montaje no falla, el render sale VERDE y el video llega sin UN SOLO componente en pantalla:
    // sale a la luz recien al contar `componentesEmitidos` despues de armar los cues, o peor, mirandolo.
    // No es torpeza del director: el formato invita al error. Se caza aca, en la direccion, que es
    // donde cuesta cero arreglarlo.
    if (x.k) {
      const kind = typeof x.k.kind === "string" ? x.k.kind : null;
      if (!kind) errores.push(`${x.n}: el componente no declara "kind"`);
      const sueltas = Object.keys(x.k).filter((kk) => !["kind", "props", "durS"].includes(kk));
      if (sueltas.length) {
        errores.push(`${x.n}: el componente "${kind || "?"}" tiene props SUELTAS al nivel de \`k\` (${sueltas.slice(0, 6).join(", ")}${sueltas.length > 6 ? ", …" : ""}) — van DENTRO de \`props\`: {"kind":"${kind || "X"}","props":{…}}. Así se emiten CERO componentes y el render igual da verde.`);
      } else if (!x.k.props || typeof x.k.props !== "object" || Array.isArray(x.k.props)) {
        errores.push(`${x.n}: el componente "${kind || "?"}" no trae \`props\` (si de verdad no lleva ninguna, poné "props": {})`);
      }
    }
    // `gr` = GOLPE (gráfico del hook: numero|sello|etiqueta|frase). Viaja TAL CUAL al plan igual que
    // `k` y `st`: lo lee planVlog §4.bis, que le mide palabras, duración y densidad.
    // ⛔ NO se llama `g`: esa letra YA es "hay gente" en el contrato (`gente: !!x.g`, línea de abajo),
    //    y reusarla habilitaría gente inventada en cada plano con gráfico.
    const extra = { ...(x.k ? { k: x.k } : {}), ...(x.st ? { st: String(x.st) } : {}), ...(x.gr && typeof x.gr === "object" ? { gr: x.gr } : {}) };
    if (x.t === "avatar") { plan.push({ name: x.n, i: m.i, sec: secDe(m.i), dice: m.texto, tipo: "avatar", muestra: x.m || "presentador a cámara", ...extra }); continue; }
    if (!["wide", "medium", "close"].includes(x.e)) { errores.push(`${x.n}: encuadre inválido "${x.e}"`); continue; }
    // REGLA DEL CREADOR (18-sep-2026): `"q": 1` = plano QUIETO. Se queda como FOTO (con su
    //    Ken-Burns) y NO se manda a agnes. Animar TODAS las fotos se ve robotico, y encima agnes
    //    redibuja ~14 %. Como mucho la MITAD de los planos de imagen se animan (compuerta
    //    `animadoPct` en 30_direct). Sin `q` el plano se anima: el default no cambia.
    if (!x.s || (!x.q && !x.mo)) { errores.push(`${x.n}: falta escena (s) o movimiento (mo) - si el plano va QUIETO pone "q":1`); continue; }
    if (x.q && x.mo) { errores.push(`${x.n}: tiene "q":1 (quieto) Y movimiento (mo) - elegi uno`); continue; }
    if (x.mo && /\bbreath|breathing|respir/i.test(x.mo)) errores.push(`${x.n}: el movimiento pide "respirar" (prohibido: agnes lo deforma)`);
    // ⛔⛔ "face" en un plano de OBJETO hace que el motor esculpa una CARA HUMANA. Medido en fbmarmol:
    //    el director escribió "a casting face" / "the rest of the face" queriendo decir la SUPERFICIE de
    //    la pieza, y salieron 6 clips con rostros esculpidos en un video de cemento (45 planos en riesgo
    //    acá, 26 en fbtelgopor y 20 en fbdeterg). Con presentador (`c:1`) "face" es legítimo: es su cara.
    if (!x.c && /(?<![a-z])faces?(?![a-z])/i.test(x.s)) {
      errores.push(`${x.n}: la escena dice "face" en un plano SIN presentador — el motor esculpe una CARA HUMANA. Si querés la superficie de la pieza, escribí "surface"`);
    }
    // ⛔⛔ REGLA DEL CREADOR (17-sep-2026): el movimiento tiene que ser lo MÁS SIMPLE POSIBLE, un
    //    movimiento de CÁMARA. "agnes es tonto y no piensa": si le pedís que un OBJETO haga algo, lo
    //    inventa y deforma la escena. Medido: 248 de 263 planos pedían acción de objeto, y de ahí
    //    salieron las losas que se vuelven rocas y la fuente estirada en columna. Pasarlos todos a
    //    cámara bajó el rechazo de clips de 28 a 0.
    //    Se permite sin cámara lo que agnes SÍ maneja y el QC no considera defecto: humo, vapor, agua,
    //    fuego y luz. Se activa por estilo (`"movimiento": "camara"`), NO global: otros canales tienen
    //    su propia regla medida (una sola cosa se mueve, la que una mano ya está tocando).
    if (style.movimiento === "camara" && x.mo
        && !/\bcamera\b/i.test(x.mo)
        && !/\b(steam|smoke|water|flame|fire|light|shadow|sunlight|daylight|ripple|vapour|vapor)\b/i.test(x.mo)) {
      errores.push(`${x.n}: el movimiento pide que un objeto ACTÚE ("${x.mo.slice(0, 44)}…"). agnes no lo entiende y deforma la escena: poné un movimiento de CÁMARA (ej. "the camera pushes in very slowly, nothing else moves")`);
    }
    plan.push({ name: x.n, i: m.i, sec: secDe(m.i), dice: m.texto, tipo: "imagen", muestra: x.m, encuadre: x.e, motor: x.c ? "gpt" : "gptsin", lugar: x.l, prompt: prompt(x), motion: x.mo, persona: !!x.c, gente: !!x.g, ...(x.q ? { quieto: true } : {}), ...extra });
  }
  plan.sort((a, b) => a.i - b.i || a.name.localeCompare(b.name));
  const faltan = mom.filter((m) => !vistos.has(m.name)).map((m) => m.name);
  // ⛔⛔ DOS FUENTES DE VERDAD PARA LA MISMA DURACIÓN (medido en tdcfreno, 21-sep-2026).
  //   Esta compuerta filtraba por `m.dur`, que es el ESTIMADO por cps del guion, mientras que
  //   `60_build` parte el plano por la duración ANCLADA del ASR. Con la voz nueva, p040 estimaba
  //   6,27 s y ancló en 7,04: la compuerta lo dio por corto, el build lo partió igual y las dos
  //   mitades se quedaron con la MISMA foto (3 pares repetidos, frenados recién por el chequeo de
  //   assets repetidos, que es el último eslabón). Se mide por lo ANCLADO, como el build.
  //   Y el techo no es sólo `partirS`: un plano ANIMADO no puede pasar de lo que cubre su clip
  //   (agnes da 4,03 s) más la cola de foto, así que ahí el segundo plano hace falta antes.
  const durAnclada = (m) => (Number.isFinite(m.end) && Number.isFinite(m.start) ? m.end - m.start : m.dur);
  const TECHO_ANIMADO = 4.03 + (style.vlog?.colaFotoS ?? 2.5);
  const sinX = mom.filter((m) => {
    const p = plan.find((p) => p.name === m.name && p.tipo !== "avatar");
    if (!p || vistos.has(m.name + "x")) return false;
    return durAnclada(m) > (p.quieto ? 7 : Math.min(7, TECHO_ANIMADO));
  }).map((m) => m.name);
  const img = plan.filter((p) => p.tipo === "imagen");
  const pct = (n) => (img.length ? Math.round((100 * n) / img.length) : 0);
  let racha = 1, rachaMax = img.length ? 1 : 0;
  for (let k = 1; k < img.length; k++) { racha = img[k].lugar === img[k - 1].lugar ? racha + 1 : 1; rachaMax = Math.max(rachaMax, racha); }
  return {
    plan, errores, faltan, sinX,
    medido: { momentos: mom.length, cubiertos: mom.length - faltan.length, planosImagen: img.length, planosAvatar: plan.length - img.length,
      avatarPctMomentos: Math.round((100 * (plan.length - img.length)) / mom.length), presentadorPct: pct(img.filter((p) => p.motor === "gpt").length),
      closePct: pct(img.filter((p) => p.encuadre === "close").length), mediumPct: pct(img.filter((p) => p.encuadre === "medium").length),
      widePct: pct(img.filter((p) => p.encuadre === "wide").length), rachaMaxLugar: rachaMax,
      animadoPct: pct(img.filter((p) => !p.quieto).length), quietos: img.filter((p) => p.quieto).length },
  };
}

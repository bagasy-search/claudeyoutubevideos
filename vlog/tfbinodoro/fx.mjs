// tfbinodoro — capa de motion graphics (DIRECTOR: un "wow" por minuto, anclado a la palabra dicha).
// buildFx(helpers) → [{kind, from, dur, foot?, p}] · kinds: zoom xray jets step stroke wipe freeze warn words qr.
// Además agrega SFX (impactos/risers/pops) al array `SFX` que mezcla mix.py. ≤12 palabras en pantalla, nada de subtítulos.
export function buildFx({ wordF, lineStartF, endF, footAt, ancImg, TL, SFX, FPS }) {
  const FX = [];
  const add = (kind, from, dur, p = {}, foot) => { FX.push({ kind, from: Math.round(from), dur: Math.max(8, Math.round(dur)), ...(foot ? { foot } : {}), p }); return from; };
  const sfx = (k, f, gain) => SFX.push({ k, at: f / FPS, ...(gain ? { gain } : {}) });
  const tcue = id => TL.find(c => c.t === id);
  const W = (...ws) => ws.map(w => (typeof w === "string" ? { t: w } : w));
  const hl = t => ({ t, hl: true });

  // ===== MINUTO 1 (tráiler) =====
  sfx("impact", tcue("t02").from + 30);                                   // se separan las mitades
  { const c = tcue("t03"); add("zoom", c.from, c.dur + tcue("t04").dur, { target: [{ f: 0, x: 0.5, y: 0.52 }], center: { x: 0.78, y: 0.5 }, radius: 250, zoom: 2.4, inAt: 4, hideBase: true }, { src: c.src, startFrom: 6 }); sfx("pop", c.from + 4); }
  { const f = wordF("s1_03", "sin"); add("words", f, endF("s1_03") - f - 4, { words: W("SE", "SACA", hl("SIN CAMBIAR"), "EL", hl("INODORO")), perWord: 4, pos: "low" }); sfx("hit", f); }
  { const c = tcue("t11"); add("stroke", c.from + 10, c.dur + tcue("t05").dur - 10, { kind: "circle", a: { x: 0.5, y: 0.52 }, b: { x: 0.2, y: 0.22 }, drawAt: 0, drawDur: 16, color: "#FFD21F", width: 12, seed: 3, label: "¿qué es esto?", labelAt: { x: 0.5, y: 0.2 } }); sfx("riser", c.from - 20); sfx("sub", c.from + c.dur + tcue("t05").dur - 4); }

  // ===== S2 · el arreglo base (antes del minuto 2) =====
  const steps = [["s2_01", "llave", "BAJA EL AGUA"], ["s2_03", "vinagre", "VINAGRE CALIENTE"], ["s2_04", "trabajar", "TIEMPO"], ["s2_05", "piedra", "PÓMEZ MOJADA"], ["s2_06", "alambre", "AGUJEROS DEL BORDE"]];
  steps.forEach(([id, w, label], i) => { const f = wordF(id, w); const nx = i < steps.length - 1 ? wordF(steps[i + 1][0], steps[i + 1][1]) : endF("s2_06"); add("step", f, nx - f - 2, { n: i + 1, total: 5, label }); sfx("tick", f); });
  { const f = wordF("s2_07", "listo"); add("wipe", f - 6, endF("s2_07") - f + 6, { beforeFoot: { img: ancImg("S2", "K0") }, afterFoot: { img: ancImg("S2", "K15") }, startAt: 4, dur: 36, hold: 10, labels: ["ANTES", "DESPUÉS"] }); sfx("shimmer", f + 20); }
  { const f = wordF("s2_07", "semana"); add("words", f - 8, endF("s2_07") - f + 8, { words: W("1 VASO", hl("POR SEMANA")), perWord: 5, pos: "high", size: 88 }); }

  // ===== S3 · las objeciones =====
  { const f = wordF("s3_03", "agua"); add("words", f, 60, { words: W("ES", hl("TU AGUA")), perWord: 4, pos: "high" }); sfx("hit", f); }
  { const f = wordF("s3_05", "guantes"); add("warn", f, endF("s3_05") - f, { items: [{ icon: "guantes", label: "GUANTES" }, { icon: "lentes", label: "LENTES" }, { icon: "ventana", label: "VENTILACIÓN" }], title: "SIEMPRE" }); sfx("pop", f); }
  { const f = wordF("s3_05", "cloro"); add("warn", f - 4, 75, { mode: "never", items: [{ icon: "acido", label: "ÁCIDO" }, { icon: "cloro", label: "CLORO" }] }); sfx("impact", f + 14); }
  { const f = wordF("s3_10", "anula"); add("words", f, endF("s3_11") - f > 150 ? 110 : endF("s3_11") - f, { words: W("SE", hl("ANULAN")), perWord: 4, tone: "warn", pos: "high" }); sfx("hit", f); }

  // ===== S4 · el descubrimiento (rayos X + agujeritos) =====
  { const s = lineStartF("s4_02"), e = endF("s4_03"); add("xray", s, e - s, { crust0: 0, crustFrom: 10, crustTo: Math.min(200, e - s - 60), crustMax: 0.55, jetsBlocked: [1, 2, 3, 5, 6], focus: "linea", focusAt: wordF("s4_03", "linea") - s, labels: { linea: "LÍNEA DE AGUA" }, title: "Corte del inodoro", exitAt: e - s }, footAt("s4_02")); sfx("whoosh_big", s - 3); sfx("scan", s + 6); }
  { const s = wordF("s4_06", "tapados"), e = endF("s4_06"); add("jets", s - 6, e - s + 6, { n: 16, blocked: [0, 1, 2, 4, 5, 6, 8, 9, 10, 12, 13, 15], step: 4, startAt: 6, legendFree: "LIBRE", legendBlocked: "TAPADO", exitAt: e - s + 6 }, footAt("s4_06")); sfx("tick", s); }
  { const s = lineStartF("s4_07"), e = endF("s4_08"); add("xray", s, e - s, { crust0: 0.55, crustFrom: 0, crustTo: 1, crustMax: 0.55, flushAt: 30, flushWeak: true, jetsBlocked: [1, 2, 3, 5, 6], focus: "sifon", focusAt: 20, labels: { sifon: "EL SIFÓN" }, title: "Corte del inodoro", exitAt: e - s }, footAt("s4_07")); sfx("whoosh_big", s - 3); sfx("flush", s + 30, 0.5); }

  // ===== S6 · los errores → ficha → QR =====
  [["s6_02", "llena", "TAZA LLENA"], ["s6_03", "impaciencia", "IMPACIENCIA"], ["s6_04", "seca", "PIEDRA SECA"]].forEach(([id, w, t], i) => { const f = wordF(id, w); add("words", f, Math.min(90, endF(id) - f), { words: [{ t: `ERROR ${i + 1}` }, { t, hl: true }], tone: "warn", perWord: 5, pos: "high", size: 92 }); sfx("hit", f); });
  { const f = lineStartF("s6_06"), e = endF("s6_06b"); add("qr", f, e - f, { line1: "LA COLECCIÓN", line2: "Escanéalo con tu teléfono" }); sfx("pop", f); }

  // ===== SC · cómo lo cortó =====
  { const f = wordF("sc_03", "diamantado"); add("warn", f, endF("sc_03") - f, { items: [{ icon: "disco", label: "DISCO DIAMANTADO" }], title: "PARA CORTAR LOZA" }); sfx("pop", f); }
  { const f = wordF("sc_04", "mascara"); add("warn", f, endF("sc_04") - f, { items: [{ icon: "mascara", label: "MÁSCARA" }, { icon: "lentes", label: "LENTES" }, { icon: "guantes", label: "GUANTES" }], title: "SÍ O SÍ" }); sfx("pop", f); }
  { const f = wordF("sc_06", "vidrio"); add("words", f - 6, 80, { words: W("CORTA COMO", hl("VIDRIO")), tone: "warn", perWord: 4, pos: "high" }); sfx("hit", f); }

  // ===== S5 · las pruebas =====
  { const f = wordF("s5_03", "caliente"); add("stroke", f, endF("s5_03") - f, { kind: "arrow", a: { x: 0.86, y: 0.2 }, b: { x: 0.64, y: 0.44 }, label: "caliente", labelAt: { x: 0.86, y: 0.13 }, seed: 5 }); sfx("draw", f); }
  { const f = wordF("s5_06", "rayas"); add("freeze", f, 66, { point: { x: 0.5, y: 0.5 }, r: { x: 0.16, y: 0.2 }, label: "ESMALTE RAYADO" }, footAt("s5_06", f - lineStartF("s5_06"))); sfx("freeze", f); }
  { const f = wordF("s5_06", "siempre"); add("words", f, endF("s5_06") - f, { words: W("SIEMPRE", hl("MOJADA")), perWord: 5, pos: "high" }); }
  { const f = wordF("s5_10", "tiempo"); add("words", f, endF("s5_10") - f, { words: [{ t: "TIEMPO", at: 0 }, { t: "REPETICIÓN", at: wordF("s5_10", "repeticion") - f }, { t: "PIEDRA MOJADA", hl: true, at: wordF("s5_10", "piedra") - f }], pos: "low", size: 84 }); }

  // ===== S8 · la mochila (CTA 2) =====
  { const f = wordF("s8_01", "raya"); add("stroke", f, endF("s8_01") - f, { kind: "underline", a: { x: 0.36, y: 0.52 }, b: { x: 0.38, y: 0.78 }, seed: 9, width: 14 }); sfx("draw", f); }
  { const f = wordF("s8_04", "veinte"); add("words", f, Math.min(90, endF("s8_04") - f), { words: W("ESPERA", hl("20 MINUTOS")), perWord: 4, pos: "high" }); sfx("tick", f); }
  { const f = wordF("s8_05c", "gas"); add("warn", f - 6, 70, { mode: "never", items: [{ icon: "cloro", label: "CLORO" }, { icon: "acido", label: "ÁCIDO" }] }); sfx("impact", f + 10); }
  { const f = lineStartF("s8_10"), e = endF("s8_10"); add("qr", f, e - f, { line1: "LA COLECCIÓN", line2: "El enlace está abajo" }); sfx("pop", f); }

  // ===== S7 · los detalles =====
  { const s = lineStartF("s7_02"), e = endF("s7_02"); add("xray", s, e - s, { crust0: 0.3, crustMax: 0.3, flushAt: 20, flushWeak: false, jetsBlocked: [], focus: "sifon", focusAt: 26, labels: { sifon: "EL SIFÓN CHUPA" }, title: "El truco del balde", exitAt: e - s }, footAt("s7_02")); sfx("flush", s + 20, 0.6); }
  { const f = wordF("s7_04", "litros"); add("words", f - 10, 75, { words: W("UNOS", hl("2 LITROS")), perWord: 4, pos: "high" }); sfx("hit", f - 10); }
  { const s = lineStartF("s7_10"), e = endF("s7_10"); add("jets", s, e - s, { n: 16, blocked: [0, 1, 2, 4, 5, 6, 8, 9, 10, 12, 13, 15], step: 3, startAt: 4, clearAt: 60, exitAt: e - s }, footAt("s7_10")); sfx("tick", s + 60); }
  { const f = wordF("s7_14", "descripcion"); add("words", f - 4, endF("s7_14") - f + 4, { words: W("EN LA", hl("DESCRIPCIÓN")), perWord: 4, pos: "high" }); sfx("pop", f); }

  // ===== S7b · límites =====
  { const f = wordF("s7b_01", "ventana"); add("warn", f, endF("s7b_01") - f, { items: [{ icon: "ventana", label: "VENTILACIÓN" }, { icon: "guantes", label: "GUANTES" }] }); sfx("pop", f); }
  { const f = wordF("s7b_05", "rajado"); add("words", f, endF("s7b_05") - f, { words: W("RAJADO", hl("= SE CAMBIA")), tone: "warn", perWord: 5, pos: "high" }); sfx("hit", f); }

  // ===== S9 · el escalón (se paga el loop) + cierre =====
  { const s = lineStartF("s9_05"), e = endF("s9_06"); add("xray", s, e - s, { crust0: 0.55, crustMax: 0.55, focus: "escalon", focusAt: 10, labels: { escalon: "EL ESCALÓN" }, title: "La curva de abajo", exitAt: e - s }, footAt("s9_05")); sfx("impact", s + 10); sfx("whoosh_big", s - 3); }
  { const f = lineStartF("s9_09"), e = endF("s9_09"); add("qr", f, e - f, { line1: "LA COLECCIÓN", line2: "El enlace está abajo" }); sfx("pop", f); }
  return FX;
}

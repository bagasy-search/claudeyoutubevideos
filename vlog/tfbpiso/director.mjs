// tfbpiso — §0 DIRECTOR de la capa de montaje: qué componente Tfb* va en qué PALABRA, inserts del minuto 1, cámara
// virtual, sonido. Un momento "wow" por minuto (marcado ★). ≤ 12 palabras en pantalla, nada de subtítulos corridos.
const LAYERS = [
  { key: "viejo", label: "Piso viejo, mojado", color: "#8c8578", h: 170, at: 4, cracked: true },
  { key: "agua", label: "Húmedo, sin charcos", color: "#6d7f8f", h: 10, at: 20, wet: true, thin: true },
  { key: "puente", label: "Lechada con cola", color: "#5f5a52", h: 26, at: 36 },
  { key: "carpeta", label: "Carpeta 1 : 3", color: "#a39d91", h: 120, at: 52, grain: true },
  { key: "rayado", label: "Rayado de escoba", color: "#b3ada2", h: 12, at: 70, grooves: true, thin: true },
];
export function direccion({ W, Lf, Le, TL, Tsrc, TOTAL, FPS }) {
  const OV = [], SFX = [], INSERTS = [], CAM = [];
  const ov = (c, from, dur, props = {}, sfx) => { OV.push({ c, from, dur, props }); if (sfx) SFX.push({ src: sfx, from: Math.max(0, from - 1), vol: 0.55 }); };
  const base = f => { const c = TL.find(x => x.kind === "vid" && x.from <= f && f < x.from + x.dur); return c ? { src: c.src, startFrom: (c.startFrom || 0) + (f - c.from) } : null; };
  const POP = "sfx/lib/pop_soft_2.mp3", HIT = "sfx/impacto_hit.mp3", SLAM = "sfx/text_slam.mp3", WH = "sfx/lib/whoosh_soft_1.mp3", DRAW = "sfx/line_draw.mp3", DEEP = "sfx/deep-cinematic-impact-1.mp3";
  // ===================== MINUTO 1 (tráiler) =====================
  // 0-4 s: la escoba (foley puro) — whoosh + golpe al primer corte
  SFX.push({ src: WH, from: 62, vol: 0.45 });
  // "Una hora." ★ golpe tipográfico
  ov("TfbTitleSlam", W("s1_01", "hora", 0, -0.35), 60, { lines: [{ t: "1 HORA", style: "yellow", size: 190 }], y: 30 }, SLAM);
  CAM.push({ at: W("s1_01", "muestro"), punch: 1.2, x: 0.5, y: 0.35 });
  // cortes del tráiler: whoosh suave en cada uno
  for (const c of TL.filter(x => x.trl && !["t01", "t02"].includes(x.trl))) SFX.push({ src: "sfx/lib/swish_" + (1 + (c.from % 8)) + ".mp3", from: c.from - 2, vol: 0.3 });
  // 40-55: la promesa, con inserts (ninguna toma > 4 s)
  const L2 = Lf("s1_02"), E4 = Le("s1_04");
  CAM.push({ at: L2 + 75, punch: 1.18, x: 0.5, y: 0.35 });
  ov("TfbWipeCompare", W("s1_02", "nuevo", 0, -0.6), 78, { before: { src: "img/tfbpiso/antes.jpg" }, after: { src: "img/tfbpiso/despues.jpg" }, sweepFrom: 4, sweepFrames: 26, rest: 0.55 }, DEEP);
  if (Tsrc.t12) { const f = W("s1_02", "resbala", 0, -0.4); INSERTS.push({ kind: "vid", insert: true, src: Tsrc.t12.v, from: f, dur: 64, startFrom: 20, rate: 0.6, foley: Tsrc.t12.a, foleyVol: 0.45 }); SFX.push({ src: "sfx/lib/splash_soft_2.mp3", from: f, vol: 0.4 }); }
  const L3 = Lf("s1_03");
  CAM.push({ at: L3, punch: 1, x: 0.5, y: 0.4 });
  if (Tsrc.t13) { const f = W("s1_03", "curado", 0, -0.2); INSERTS.push({ kind: "vid", insert: true, src: Tsrc.t13.v, from: f, dur: 72, startFrom: 10, foley: null }); }
  CAM.push({ at: Le("s1_03") - 40, punch: 1.22, x: 0.5, y: 0.33 });
  const L4 = Lf("s1_04");
  CAM.push({ at: L4, punch: 1, x: 0.5, y: 0.4 });
  CAM.push({ at: W("s1_04", "hace"), punch: 1.25, x: 0.5, y: 0.32 });
  CAM.push({ at: W("s1_04", "principio", 0, -0.3), punch: 1.45, x: 0.52, y: 0.3 });
  SFX.push({ src: "sfx/lib/riser_soft_3.mp3", from: L4 - 15, vol: 0.5 });
  ov("TfbTitleSlam", W("s1_04", "principio", 0, -0.2), E4 - W("s1_04", "principio", 0, -0.2) + 20, { lines: [{ t: "AL PRINCIPIO", style: "yellowbox", size: 120 }, { t: "NO AL FINAL", style: "white", size: 96 }], y: 72, stagger: 7 }, HIT);
  // ===================== 1-2: el proceso completo de corrido (contador de pasos) =====================
  const STEPS = [["s2_02", "Picar"], ["s2_03", "Barrer y lavar"], ["s2_04", "Mojar"], ["s2_05", "Lechada"], ["s2_06", "Carpeta"], ["s2_07", "Fratás"], ["s2_08", "Escoba"], ["s2_09", "Juntas y agua"]];
  STEPS.forEach(([id, t], i) => { const f = Lf(id), e = i < STEPS.length - 1 ? Lf(STEPS[i + 1][0]) : Le(id); ov("TfbStepCounter", f, e - f, { step: i + 1, total: 8, label: t }, i ? "sfx/lib/tick_3.mp3" : POP); });
  // ===================== 2-4: el antes/después y las preguntas =====================
  // ★ la mitad nueva al lado de la vieja: lupa sobre el rayado
  { const f = W("s3_01", "mano", 0, -0.2), b = base(f); if (b) ov("TfbZoomCircle", f, 110, { src: b.src, startFrom: b.startFrom, keys: [{ f: 0, x: 0.36, y: 0.8 }], zoom: 2.6, lens: { x: 0.75, y: 0.36 }, label: "áspero, no suelta nada" }, POP); }
  ov("TfbCheckList", W("s3_04", "polvo", 0, -0.4), 95, { title: "SOLO CEMENTO Y AGUA", rows: [{ t: "Se hace polvo", ok: false, at: 4 }, { t: "Salta en placas", ok: false, at: 16 }], side: "right" }, POP);
  // ★ el corte de capas: lo que SÍ aguanta
  { const f = W("s3_05", "carpeta", 0, -0.4); ov("TfbLayerCut", f, Math.max(150, Le("s3_05") - f + 30), { layers: LAYERS, title: "Lo que sí aguanta" }, DEEP); }
  // 1 : 3 con baldes
  { const f = W("s3_08", "medida", 0, -0.3); ov("TfbRatio", f, Le("s3_09") - f, { a: { n: 1, label: "CEMENTO", color: "#8e8a84" }, b: { n: 3, label: "ARENA", color: "#d6b98a", speck: "#a88b5c" }, title: "La carpeta", footer: "Siempre el mismo balde" }, SLAM); }
  ov("TfbTitleSlam", W("s3_10", "puño", 0, -0.3), 70, { lines: [{ t: "COMO TIERRA HÚMEDA", style: "white", size: 96 }, { t: "NO CHORREA", style: "yellowbox", size: 80 }], y: 78 }, POP);
  ov("TfbTitleSlam", W("s3b_02", "duro", 0, -0.4), 80, { lines: [{ t: "NO SE PISA", style: "redbox", size: 96 }, { t: "HASTA QUE ESTÉ DURO", style: "white", size: 84 }], y: 76 }, SLAM);
  // ★ el rayado dibujándose
  { const f = W("s3b_03", "rayado", 0, -0.5); ov("TfbBroomTexture", f, 120, { passFrom: 6, passFrames: 70, note: "antideslizante", noteAt: 70 }, "sfx/px_wipe.mp3"); }
  ov("TfbCheckList", W("s3b_05", "rodillo", 0, -0.3), Le("s3b_06") - W("s3b_05", "rodillo", 0, -0.3), { title: "NO VA", rows: [{ t: "Con rodillo", ok: false, at: 2 }, { t: "Sobre tierra", ok: false, at: Math.max(20, Lf("s3b_06") - W("s3b_05", "rodillo", 0, -0.3)) }], side: "right" }, POP);
  // ===================== 4-6: límites, martillo, seguridad =====================
  { const f = Lf("s4_02"), e = Le("s4_03"); ov("TfbCheckList", f, e - f, { title: "NO SIRVE SI", rows: [{ t: "Humedad que sube", ok: false, at: 10 }, { t: "Grietas que se mueven", ok: false, at: Lf("s4_03") - f + 8 }, { t: "El piso se hunde", ok: false, at: W("s4_03", "hunde") - f - 4 }] }, HIT); }
  { const f = W("s4_06", "hueco", 0, -0.3); ov("TfbScribble", f, 80, { marks: [{ kind: "circle", x: 0.5, y: 0.8, w: 0.22, h: 0.16, at: 0, note: "hueco = suelto", noteDy: -150 }] }, DRAW); }
  ov("TfbTitleSlam", W("s4_09", "guantes", 0, -0.2), 90, { lines: [{ t: "GUANTES", style: "white", size: 96 }, { t: "BOTAS", style: "white", size: 96 }, { t: "GAFAS", style: "yellowbox", size: 96 }], x: 80, y: 45, align: "right", stagger: 6 }, POP);
  ov("TfbCheckList", Lf("s4b_01"), Le("s4b_04") - Lf("s4b_01"), { title: "LO QUE NECESITAS", titleColor: "yellow", rows: [
    { t: "Cemento y arena", ok: true, at: 8 }, { t: "Cola vinílica", ok: true, at: W("s4b_01", "cola") - Lf("s4b_01") },
    { t: "Regla y fratás", ok: true, at: Lf("s4b_03") - Lf("s4b_01") }, { t: "Escoba de patio", ok: true, at: Lf("s4b_04") - Lf("s4b_01") + 20 }], side: "right" }, POP);
  // ===================== 6-7: LA LÁMINA + CTA 1 (QR real) =====================
  const L0 = Lf("LAM"), lw = (w, n = 0) => (W("LAM", w, n) - L0) / FPS + 0.25;
  const LAM = { keys: [[0, 0.5, 0.5, 1], [lw("arriba") + 0.2, 0.5, 0.36, 1.55], [lw("derecha") - 0.2, 0.76, 0.66, 1.75], [lw("abajo") - 0.2, 0.5, 0.9, 1.6], [lw("captura") - 0.3, 0.5, 0.5, 1]],
    marks: [{ from: lw("arriba") + 0.4, to: lw("derecha") - 0.5, x: 0.02, y: 0.26, w: 0.96, h: 0.2 }, { from: lw("derecha"), to: lw("abajo") - 0.5, x: 0.52, y: 0.49, w: 0.46, h: 0.34 },
      { from: lw("abajo"), to: lw("captura") - 0.4, x: 0.03, y: 0.84, w: 0.94, h: 0.14 }] };
  SFX.push({ src: "sfx/lib/page_flip_2.mp3", from: L0 - 6, vol: 0.6 });
  { const f = Lf("s5_03"), e = Le("s5_05"); ov("TfbQrCard", f, e - f + 15, { qr: "img/tfbpiso/qr_tfbpiso.png", cover: "img/tfbpiso/portada-coleccion.jpg", kicker: "Escanea con tu teléfono", line: "o el enlace en la descripción", url: "constructorlibre.com" }, POP); }
  // ===================== 7-9: preparación en detalle =====================
  const P2 = [["s6_02", 1, "Picar"], ["s6_05", 2, "Barrer y lavar"], ["s6_08", 3, "Mojar"], ["s6_09", 4, "Guías y pendiente"], ["s7_01", 5, "Mezcla 1 : 3"], ["s7_08", 6, "Lechada"], ["s8_02", 7, "Lechada al piso"], ["s8_03", 8, "Carpeta"], ["s8_05", 9, "Regla"], ["s8_08", 10, "Fratás"], ["s9_04", 11, "Escoba"], ["s9_06", 12, "Juntas"], ["s10_01", 13, "Curado"]];
  P2.forEach(([id, n, t]) => ov("TfbStepCounter", Lf(id), 110, { step: n, total: 13, label: t, corner: "tl" }, "sfx/lib/tick_2.mp3"));
  { const f = W("s6_03", "pedazo", 0, -0.2), b = base(f); if (b) ov("TfbZoomCircle", f, 100, { src: b.src, startFrom: b.startFrom, keys: [{ f: 0, x: 0.5, y: 0.62 }], zoom: 2.3, label: "suelto por abajo" }, POP); }
  ov("TfbScribble", W("s6_10", "desague", 0, -0.2), 85, { marks: [{ kind: "arrow", x: 0.35, y: 0.55, to: { x: 0.8, y: 0.85 }, at: 0, note: "hacia el desagüe", noteDy: -120 }] }, DRAW);
  ov("TfbTitleSlam", W("s6_08", "saltean", 0, -0.3), 75, { lines: [{ t: "EL PASO QUE", style: "white", size: 88 }, { t: "CASI TODOS SE SALTEAN", style: "yellowbox", size: 78 }], y: 76 }, "sfx/lib/riser_soft_2.mp3");
  // ===================== 9-11: mezclas + el error nº 2 =====================
  ov("TfbTitleSlam", W("s7_03", "poco", 0, -0.2), 60, { lines: [{ t: "EL AGUA, DE A POCO", style: "white", size: 88 }], y: 80 }, POP);
  ov("TfbTitleSlam", W("s7_09", "error", 0, -0.3), 80, { lines: [{ t: "ERROR Nº 2", style: "redbox", size: 120 }], y: 30 }, HIT);
  { const f = W("s7_10", "seca", 0, -0.3); ov("TfbLayerCut", f, Math.max(140, Le("s7_10") - f + 20), { layers: LAYERS.slice(0, 4).map(l => l.key === "puente" ? { ...l, label: "Lechada YA SECA" } : l.key === "agua" ? { ...l, label: "Piso mojado" } : l),
    mode: "absorb", absorbAt: 40, peelAt: 80, title: "Lechada seca = separa", badLabel: "no pega" }, DEEP); }
  ov("TfbTitleSlam", W("s7_11", "fresca", 0, -0.2), 70, { lines: [{ t: "FRESCA SOBRE FRESCA", style: "yellowbox", size: 104 }], y: 78 }, SLAM);
  // ===================== 11-13: aplicación, el grosor, la escoba en su punto =====================
  { const f = W("s8_04", "dedo", 0, -0.3); ov("TfbTitleSlam", f, 80, { lines: [{ t: "MÍNIMO:", style: "white", size: 80 }, { t: "UN DEDO", style: "yellowbox", size: 130 }], x: 78, y: 40 }, SLAM); }
  ov("TfbTitleSlam", W("s8_10", "hora", 0, -0.3), 70, { lines: [{ t: "LA HORA", style: "yellow", size: 140 }, { t: "QUE TE PROMETÍ", style: "white", size: 80 }], y: 30 }, SLAM);
  { const f = W("s9_02", "pronto", 0, -0.5); ov("TfbBroomTexture", f, Math.max(110, Le("s9_02") - f + 10), { early: true, passFrom: 4, passFrames: 50, note: "muy pronto: arranca", noteAt: 50 }, "sfx/px_wipe_alt1.mp3"); }
  // ★ el punto: congelado + nota
  { const f = W("s9_03", "punto", 0, -0.4), b = base(f); if (b) ov("TfbFreeze", f, 66, { src: b.src, frame: b.startFrom, note: "ESE ES EL PUNTO", noteY: 0.12 }, "sfx/universfield-camera-shutter-199580.mp3"); }
  { const f = W("s9_08", "ranura", 0, -0.3); ov("TfbScribble", f, 75, { marks: [{ kind: "underline", x: 0.5, y: 0.7, w: 0.5, at: 0, note: "se raja acá adentro", noteDy: -110 }] }, DRAW); }
  // ===================== 13-14: la historia (CTA 2 del relato) =====================
  ov("TfbTitleSlam", W("s9b_01", "marta", 0, -0.2), 80, { lines: [{ t: "MARTA", style: "yellow", size: 110 }, { t: "AREQUIPA, PERÚ", style: "white", size: 70 }], x: 22, y: 30, align: "left", tilt: -1 }, POP);
  // ===================== 14-16: el curado + EL PASO QUE CASI TODOS SE SALTEAN (se paga el loop) =====================
  { const f = Lf("s10_03"); ov("TfbCureCalendar", f, Le("s10_03") - f + 15, { days: ["DÍA 1", "DÍA 2", "DÍA 3", "…"], title: "Húmedo varios días", meter: "GANA FUERZA" }, "sfx/lib/droplet_3.mp3"); }
  ov("TfbTitleSlam", W("s10_04", "mojar", 0, -0.3), 70, { lines: [{ t: "MOJAR EL PISO VIEJO", style: "yellowbox", size: 104 }], y: 30 }, HIT);
  // ★ la esponja: el piso seco se chupa el agua de la lechada
  { const f = W("s10_06", "seco", 0, -0.4); ov("TfbLayerCut", f, Le("s10_07") - f + 10, { layers: LAYERS.slice(0, 4).map(l => l.key === "viejo" ? { ...l, label: "Piso viejo SECO" } : l.key === "agua" ? { ...l, label: "Sin agua", wet: false, color: "#8c8578" } : l),
    mode: "absorb", absorbAt: 30, peelAt: Math.max(80, Lf("s10_07") - f + 30), title: "Piso seco = esponja", badLabel: "¡se levanta en placas!" }, DEEP); }
  // ★ la prueba de la gota
  { const f = Lf("s10_09"); ov("TfbDropTest", f, Le("s10_10") - f + 10, { title: "La prueba de la gota", leftLabel: "TIENE SED: MOJA MÁS", rightLabel: "CERA O GRASA: NO PEGA" }, "sfx/lib/droplet_5.mp3"); }
  ov("TfbTitleSlam", W("s10_11", "oscuro", 0, -0.2), 80, { lines: [{ t: "HÚMEDO", style: "white", size: 120 }, { t: "NO INUNDADO", style: "redbox", size: 90 }], y: 74 }, POP);
  // ===================== 16-17: la prueba del vecino + cierre =====================
  { const f = Lf("s11_02"); ov("TfbWipeCompare", f, Math.min(150, Le("s11_02") - f), { before: { src: "img/tfbpiso/antes.jpg" }, after: { src: "img/tfbpiso/despues.jpg" }, sweepFrom: 3, sweepFrames: 30, rest: 1.25 }, DEEP); }
  { const f = Lf("s11_04"), e = Le("s11_04"); ov("TfbQrCard", f, e - f + 20, { qr: "img/tfbpiso/qr_tfbpiso.png", cover: "img/tfbpiso/portada-coleccion.jpg", kicker: "La colección del canal", line: "o el enlace en la descripción", url: "constructorlibre.com" }, POP); }
  { const f = Lf("s11_05"); ov("TfbTitleSlam", f, Le("s11_05") - f + 10, { lines: [{ t: "PICAR · LAVAR · MOJAR", style: "white", size: 76 }, { t: "LECHADA · CARPETA", style: "white", size: 76 }, { t: "ESCOBA · AGUA", style: "yellowbox", size: 86 }], y: 34, stagger: 12 }, POP); }
  return { OV, SFX, INSERTS, CAM, LAM, MUSIC_FROM: 180, MUSIC_LOW: 0.07, MUSIC_HIGH: 0.3 };
}

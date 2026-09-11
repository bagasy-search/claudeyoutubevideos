// build_vslcurso.mjs — VSL de la landing constructorlibre.com/curso
// Canal El Constructor Libre · presentador Tomás · máster 277,632 s.
//
// ═══ SEGUNDA RE-EDICIÓN ═══════════════════════════════════════════════════════════════════════
// El creador rechazó el primer montaje por tres cosas (avatar que no aparecía, push que lo
// desencuadraba, edición crema sobre crema), se arreglaron las tres, y sobre ESE corte pidió más:
//   *"siento que le falta dinamismo al video, que sea ultra inmersivo, con componentes
//    profesionales, que parezca editado por After Effects, componentes con 6-9 capas,
//    desenfoques, multiescenas, carruseles con tarjetas flotantes, 3D"*
// …sin perder lo anterior: *"debe ser limpia, muy limpia"*. No se contradicen: limpio NO es plano.
// El corte anterior era limpio y PLANO (tarjetas blancas sólidas, cero profundidad, cero 3D).
//
// LA RESPUESTA, y es un cambio de ARQUITECTURA, no de decoración:
//  · 6 MOVIMIENTOS continuos (`src/vslcurso/Mov*.tsx`) de 4-6 ACTOS cada uno, que cubren los 6
//    momentos más importantes del VSL. Cada movimiento es UN archivo con UNA atmósfera, UNA
//    cámara y materia que cruza cada frontera, así que la continuidad está garantizada por
//    construcción. La unidad de trabajo es el MOVIMIENTO, no el componente
//    (`video-pipeline/references/suites_premium.md` §2).
//  · UN ESCENARIO COMPARTIDO (`src/vslcurso/Escenario.tsx`) que TODOS consumen: la cámara es
//    función del frame GLOBAL del video, así que ningún acto ni ningún movimiento vuelve a 0 y la
//    unión ENTRE movimientos tampoco se nota (§7).
//  · Las piezas sueltas que quedan (`Piezas.tsx`) viven en el MISMO escenario: velo con el
//    hermano `_blur.jpg`, tarjetas con material real adentro, tilt 3D, sombra de contacto.
//
// ⛔ Y sigue en pie lo de la primera vuelta: el máster arranca con el audio ORIGINAL del avatar
// (0 → 5,80 s, lipsync real) y de 5,80 a 17,4026 s es la voz Fish con los comentarios REALES. El
// empalme es al sample y la duración total no cambió, así que ningún anclaje se movió.
// ⛔ El máster ahora lleva la CAMA MUSICAL horneada (cuatro movimientos de volumen, -30 LUFS de
// base, 15 LU bajo la voz). La voz no se tocó: `_v3/audio/vslcurso_master_SINMUSICA.wav`.
import fs from "fs";
import { execFileSync } from "child_process";

const SLUG = "vslcurso";
const FPS = 30;
const TOTAL = 277.632;
const AVATAR_ON_END = 6.00;      // hasta acá el avatar TIENE que verse (lipsync real)
const AVATAR_OFF_END = 17.4026;  // de 6,00 a acá el avatar NO puede verse (voz Fish)

const I = (n) => `img/${n}.png`;
const C = (n) => `broll/vslcurso_${String(n).padStart(3, "0")}.mp4`;
const F = (s) => Math.round(s * FPS);

// ── LOS 6 MOVIMIENTOS ─────────────────────────────────────────────────────────────────────────
// `f0`/`f1` en FRAMES (no en segundos): es la unidad en la que los escribió el director de cada
// movimiento, y `desde` (= f0) es lo que hace que la cámara sea continua en TODO el video.
const MOVS = [
  { comp: "Mov1Comentarios", f0: 180, f1: 525, que: "los dos comentarios REALES de YouTube" },
  { comp: "Mov2Numeros", f0: 872, f1: 1312, que: "80 · 150 · 300 — el carrusel 3D de precios" },
  { comp: "Mov3Cuenta", f0: 2163, f1: 2562, que: "la cuenta: 600 · 800 · 1.200 al mes" },
  { comp: "Mov4Origenes", f0: 3222, f1: 3762, que: "los tres orígenes del agua + el diagnóstico" },
  { comp: "Mov5Curso", f0: 5463, f1: 5985, que: "el curso por dentro: 16 clases + los documentos" },
  { comp: "Mov6Cierre", f0: 7599, f1: 8088, que: "garantía → las casas → alguien va a cobrar" },
];

// ── STORYBOARD: capa BASE ─────────────────────────────────────────────────────────────────────
// [desde, hasta, asset]. Donde no hay plano ni movimiento, el fondo es el avatar (base FULL).
// Los tramos que cubre un movimiento NO llevan planos: el movimiento ocupa el cuadro entero.
const BASE = [
  // 0,00 → 6,00   AVATAR FULL, lipsync real: "Quiero que mires este comentario…"
  // 6,00 → 17,50  ► MOV 1 (los comentarios)

  // "No tienes que inventar una necesidad, la necesidad ya existe."
  // ráfaga DELIBERADA de casas reales — es la única del video, y por eso funciona
  [17.50, 18.55, I("vslp01")], // señor señalando el techo de su cocina
  [18.55, 19.55, I("vslp03")], // baño con moho
  [19.55, 20.50, I("vslp04")], // mujer abriendo el placard húmedo
  [20.50, 21.60, C(1)],        // mancha circular en el techo

  // 21,60 → 25,35  AVATAR: "quiero que dejes de mirar esto como un curso sobre humedad"
  [25.35, 27.40, C(8)],        // manos con espátula = la habilidad
  [27.40, 29.07, I("vsls04")], // le pagan en la puerta = "que después puedes cobrar"

  // 29,07 → 43,73  ► MOV 2 (los números)
  // 43,73 → 49,00  AVATAR: "mira el precio que aparece debajo de este video"

  [49.00, 55.35, I("vslc03")], // cuaderno, calculadora y billetes (cama del Duelo)
  [55.35, 58.35, I("vsls04")], // "que puedes cobrar 150 dólares"

  // 58,35 → 62,15  AVATAR: "la pregunta importante es por qué no lo haces"
  [62.15, 67.90, C(31)],       // cuaderno abierto con lápiz

  // 67,90 → 72,10  AVATAR: "Haz esa cuenta ahora y después haz otra"
  // 72,10 → 85,40  ► MOV 3 (la cuenta)
  // 85,40 → 91,70  AVATAR: "No significa que vas a ganar eso automáticamente"

  [91.70, 95.80, I("vslm03")], // una clienta real señalando su pared

  // 95,80 → 98,85  AVATAR: "acá está la parte que mucha gente no entiende"
  [98.85, 103.00, I("vslm01")], // botellas, balde, brocha y guantes = el material de la ferretería
  [103.00, 105.30, I("vslx01")], // un hombre con la escoba mirando la pared, sin saber qué hacer
  [105.30, 107.40, C(37)],       // "una pared negra"

  // 107,40 → 125,40  ► MOV 4 (los tres orígenes + el diagnóstico)

  [125.40, 130.00, I("vsls01")], // camas de los Pasos
  [130.00, 134.30, I("vsls04")],
  [134.30, 140.00, I("vslx02")], // camas de la Lista: la visita…
  [140.00, 145.00, I("vslh01")], // …el presupuesto impreso…
  [145.00, 148.70, I("vslg01")], // …los documentos saliendo de la impresora

  // 148,70 → 155,90  AVATAR: "tu primer objetivo no es ganar mil dólares al mes"
  [155.90, 158.70, C(8)],        // "hacer un trabajo bien"
  [158.70, 165.00, I("vslk01")], // raspando la pared (cama del antes/después)
  [165.00, 168.40, I("vsls04")], // "recuperar lo que invertiste"
  [168.40, 175.40, I("vslc01")], // cama de la Escalera 4 · 6 · 8
  [175.40, 182.10, I("vslx02")], // cama de la Lista "quién guarda tu número"

  // 182,10 → 199,50  ► MOV 5 (el curso por dentro)
  // 199,50 → 202,20  AVATAR: "No estás comprando tres horas de videos"

  [202.20, 209.30, I("vslx01")], // cama del Duelo
  [209.30, 212.20, I("vsls04")], // "cobrar por resolverla"

  // 212,20 → 218,20  AVATAR: "vuelve a hacer la cuenta. Mira el precio de abajo"
  [218.20, 221.70, C(43)],       // "cuánto puede valer uno solo de estos trabajos"

  // 221,70 → 225,35  AVATAR: "qué prefieres tener dentro de seis meses"
  [225.35, 229.40, I("vslc03")],

  // 229,40 → 233,40  AVATAR: "No compres esto si buscas dinero fácil"
  [233.40, 237.00, I("vsls02")],
  [237.00, 240.20, I("vslk01")],
  [240.20, 243.20, C(13)],       // "un oficio concreto"
  [243.20, 245.70, C(37)],       // "un problema real"
  [245.70, 248.10, I("vslp01")], // "personas reales buscando quién se lo resuelva"
  [248.10, 250.40, I("vsls04")], // "servicios que pueden valer cientos de dólares"

  // 250,40 → 253,30  AVATAR: "deja de pensarlo como un gasto"
  // 253,30 → 269,60  ► MOV 6 (garantía → las casas → alguien va a cobrar)
  // 269,60 → 277,632 AVATAR FULL + la tarjeta de cierre flotando al costado
];

// ── STORYBOARD: capa OVER (las piezas sueltas) ────────────────────────────────────────────────
// `en` = los segundos ABSOLUTOS en los que cada elemento tiene que aparecer, para que el reveal
// caiga sobre la palabra. El build los pasa a frames relativos al cue.
// Los momentos que ahora resuelve un MOVIMIENTO ya no están acá.
const OVER = [
  { comp: "Frase", a: 19.35, z: 21.65, props: { lineas: ["La necesidad", "YA EXISTE."] } },

  { comp: "Rotulo", a: 44.60, z: 48.95, props: { texto: "El precio está justo debajo de este video", nota: "compáralo con esos números", flecha: true } },

  { comp: "Duelo", a: 49.05, z: 55.30, props: {
    eyebrow: "La comparación que importa",
    titulo: "No lo compares con otro curso",
    izq: { rotulo: "Otro curso", sub: "tres horas de video que nunca vas a usar", img: I("vslg02") },
    der: { rotulo: "Un trabajo cobrado", sub: "lo que te pagan por resolver una pared", img: I("vsls04") },
  } },

  { comp: "CifraGrande", a: 55.45, z: 58.30, props: { eyebrow: "Un servicio que puedes cobrar", valor: 150, sufijo: " dólares", apoyo: "Por resolver una sola pared." } },

  { comp: "Frase", a: 62.30, z: 67.85, props: { lineas: ["La pregunta no es cuánto cuesta.", "ES CUÁNTOS TRABAJOS."] } },

  { comp: "Frase", a: 91.80, z: 95.78, props: { lineas: ["No te prometo mil dólares.", "TE MUESTRO LA MATEMÁTICA."] } },

  { comp: "Rotulo", a: 99.50, z: 102.95, props: { texto: "Esto no es por lo que te pagan", nota: "el líquido que compras en la ferretería" } },

  { comp: "Pasos", a: 125.60, z: 134.20, en: [126.30, 128.20, 129.50, 131.00], props: {
    eyebrow: "El orden del oficio",
    titulo: "Lo que aprendes, en orden",
    pasos: [
      { rotulo: "Diagnosticar", sub: "qué le pasa a la pared", img: I("ic_diag") },
      { rotulo: "Tratar", sub: "qué comprar y cómo aplicarlo", img: I("ic_trat") },
      { rotulo: "Cobrar", sub: "cuánto cobrar y cómo", img: I("ic_pres") },
      { rotulo: "Conseguir", sub: "de dónde salen los clientes", img: I("ic_cobr") },
    ],
  } },

  { comp: "Lista", a: 134.30, z: 148.70, en: [134.90, 138.50, 139.70, 141.30, 144.40], props: {
    eyebrow: "También aprendes",
    titulo: "Lo que separa a un oficio de un favor",
    items: [
      "Qué trabajos aceptar y cuáles rechazar",
      "Cómo hacer la visita",
      "Cómo calcular un presupuesto",
      "Qué responder cuando te dicen que es caro",
      "De dónde salen tus primeros clientes",
    ],
  } },

  { comp: "AntesDespues", a: 158.80, z: 165.00, props: {
    eyebrow: "Tu primer objetivo",
    titulo: "Un trabajo bien hecho, una foto, una recomendación",
    antes: I("vslad_ad4_antes"), despues: I("vslad_ad4_despues"),
  } },

  { comp: "Escalera", a: 168.40, z: 175.30, en: [169.30, 170.80, 171.60], props: {
    eyebrow: "Después empiezas a construir",
    items: [{ valor: "4", nota: "trabajos al mes" }, { valor: "6", nota: "a mejores precios" }, { valor: "8", nota: "por recomendación" }],
  } },

  { comp: "Lista", a: 175.40, z: 182.00, en: [175.50, 176.20, 177.10], props: {
    eyebrow: "Quién guarda tu número",
    titulo: "Los que necesitan a alguien cuando aparece este problema",
    items: ["Pintores", "Plomeros", "Administradores de edificios"],
  } },

  { comp: "Duelo", a: 202.30, z: 209.20, props: {
    eyebrow: "Lo que cambia",
    titulo: "Estás comprando un sistema",
    izq: { rotulo: "Mirar la pared", sub: "y no saber qué hacer con ella", img: I("vslx01") },
    der: { rotulo: "Diagnosticarla y cobrarla", sub: "con el cuaderno y el medidor en la mano", img: I("vsls03") },
  } },

  { comp: "Rotulo", a: 215.30, z: 218.30, props: { texto: "Vuelve a mirar el precio de abajo", flecha: true } },

  { comp: "CifraGrande", a: 218.40, z: 221.60, props: { eyebrow: "Uno solo de estos trabajos", valor: 300, sufijo: " dólares", apoyo: "Los más grandes llegan ahí, según la zona y la dificultad." } },

  { comp: "Frase", a: 225.35, z: 229.40, props: { lineas: ["El dinero de hoy,", "O UNA HABILIDAD."] } },

  { comp: "Lista", a: 233.50, z: 240.10, en: [233.90, 235.60, 237.50], props: {
    eyebrow: "Antes de que decidas",
    titulo: "Esto no es dinero fácil",
    items: [
      "Vas a tener que aprender",
      "Vas a tener que trabajar bien",
      "Vas a tener que salir a buscar los primeros clientes",
    ],
  } },

  // ⛔ el CTA vive en su PROPIA capa, nunca adentro de un componente de escena, y sin precio:
  // el botón está justo debajo del video en la landing. El presentador habla FULL detrás.
  { comp: "Cierre", a: 272.00, z: TOTAL, props: {
    eyebrow: "El curso",
    titulo: "¿Vas a ser tú?",
    bullet: "16 clases, tres horas y los documentos que vas a usar en la casa del cliente",
    cta: "EL BOTÓN ESTÁ JUSTO DEBAJO",
    img: I("vslg02"),
  } },
];

// ── COMPROBACIONES DE ASSET + DURACIÓN REAL DE CADA CLIP ──────────────────────────────────────
const durCache = new Map();
const durOf = (p) => {
  if (!durCache.has(p)) {
    let v = 0;
    try { v = +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", p]).toString().trim(); } catch { v = 0; }
    durCache.set(p, v);
  }
  return durCache.get(p);
};

/** Saca TODOS los comentarios (bloque, JSX y de línea) para que las compuertas de código miren
 *  CÓDIGO. El filtro "líneas que empiezan con //" deja pasar los comentarios JSX y los de mitad
 *  de línea, y con eso acusó a TRES movimientos de usar `backdrop-filter` por tenerlo escrito en
 *  la línea del contrato que lo PROHÍBE. Una compuerta que acusa al inocente cuesta lo mismo que
 *  una que no mira. */
const soloCodigo = (txt) =>
  txt
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/(^|[^:"'`])\/\/[^\n]*/g, "$1 ");

/** Los textos que REALMENTE se dibujan: sólo los literales de string. Un `297` suelto en el
 *  código es un número de FRAME (en Mov3 es la frontera del acto 4), no un precio. */
const literales = (txt) => (soloCodigo(txt).match(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g) || []).join(" ");

let fatal = 0;
const err = (m) => { console.error("⛔ " + m); fatal++; };

const usados = new Set();
for (const [a, z, src] of BASE) {
  usados.add(src);
  if (!fs.existsSync("public/" + src)) err(`falta el asset ${src}`);
  else if (src.endsWith(".mp4")) {
    const real = durOf("public/" + src);
    if (z - a > real - 0.08) err(`el plano ${src} dura ${(z - a).toFixed(2)}s y el clip sólo ${real.toFixed(2)}s → se congelaría el último cuadro`);
  }
}
for (const o of OVER) {
  for (const v of JSON.stringify(o.props).matchAll(/"(img\/[^"]+)"/g)) {
    usados.add(v[1]);
    if (!fs.existsSync("public/" + v[1])) err(`falta la imagen ${v[1]} (componente ${o.comp})`);
  }
}

// ⛔⛔ LOS MOVIMIENTOS HARDCODEAN SUS RUTAS CON `staticFile(...)`, ASÍ QUE EL BUILD NO LAS VE POR
// PROPS. Si no se escanean los .tsx, el tar sale sin ellas y el farm tira 404 → chunk muerto, con
// los 50 runners ya encendidos (`suites_premium.md`: "consecuencia técnica").
{
  let n = 0;
  for (const f of fs.readdirSync("src/vslcurso").filter((x) => x.endsWith(".tsx"))) {
    const txt = fs.readFileSync(`src/vslcurso/${f}`, "utf8");
    for (const m of txt.matchAll(/"((?:img|broll|vid|med|sfx)\/[^"]+)"/g)) {
      n++;
      usados.add(m[1]);
      if (!fs.existsSync("public/" + m[1])) err(`${f} referencia public/${m[1]} y NO EXISTE → 404 en el farm`);
    }
    // una ruta armada con template literal no la ve ningún escaneo por texto: avisar
    for (const m of txt.matchAll(/`(?:img|broll|vid)\/[^`]*\$\{/g)) {
      console.warn(`⚠ ${f} arma una ruta con template literal (${m[0].slice(0, 40)}…): el escaneo no la ve, revisala a mano`);
    }
  }
  console.log(`assets hardcodeados en los .tsx de src/vslcurso: ${n} referencias`);
}

// ── ALINEAR AL FRAME (el "se pone oscuro entre transición") ───────────────────────────────────
// `from` y `durationInFrames` se redondean POR SEPARADO: 53,94 + 0,98 termina en el frame 1647 y
// el siguiente arranca en el 1648 → un destello del fondo de 33 ms que `blackdetect` no ve.
const base = BASE.map(([a, z, src]) => ({ a, z, src })).sort((x, y) => x.a - y.a);
for (let i = 0; i < base.length; i++) {
  const c = base[i], sig = base[i + 1];
  c.f0 = F(c.a);
  c.f1 = F(c.z);
  if (sig && Math.abs(F(sig.a) - c.f1) <= 2) c.f1 = F(sig.a);
  if (c.f1 <= c.f0) err(`plano vacío en ${c.a}s (${c.src})`);
}
const movs = MOVS.map((m) => ({ ...m, a: m.f0 / FPS, z: m.f1 / FPS }));

// cobertura: un instante está cubierto si lo tapa un plano O un movimiento
const cubierto = (t) =>
  base.some((c) => c.f0 / FPS <= t && c.f1 / FPS > t) || movs.some((m) => m.a <= t && m.z > t);

// ── la capa OVER: `blurSrc` del plano que tiene debajo, y `desde` para la cámara continua ─────
const over = OVER.map((o) => {
  const f0 = F(o.a), f1 = F(o.z);
  const bajo = base.find((c) => c.f0 <= f0 && c.f1 > f0);
  let blurSrc;
  if (bajo && bajo.src.endsWith(".png")) {
    const b = bajo.src.replace(/\.png$/, "_blur.jpg");
    if (fs.existsSync("public/" + b)) { blurSrc = b; usados.add(b); }
  }
  return { ...o, f0, f1, desde: f0, blurSrc, enRel: (o.en || []).map((s) => Math.max(0, F(s) - f0)) };
});

// ── COMPUERTAS ────────────────────────────────────────────────────────────────────────────────
const STEP = 0.1;

// 1) el avatar TIENE que verse en los primeros segundos (regla dura del creador)
{
  let vis = 0, n = 0;
  for (let t = 0; t < AVATAR_ON_END; t = +(t + STEP).toFixed(2)) { n++; if (!cubierto(t)) vis++; }
  const pct = (vis / n) * 100;
  console.log(`⛔ APERTURA (0-${AVATAR_ON_END}s): el avatar se ve el ${pct.toFixed(1)}% (piso 100%)`);
  if (pct < 99.9) err(`hay algo tapando al presentador en la apertura`);
}

// 2) de AVATAR_ON_END a AVATAR_OFF_END el avatar NO puede verse (voz Fish, labios desfasados)
{
  let tot = 0, cub = 0;
  for (let t = AVATAR_ON_END; t < AVATAR_OFF_END; t = +(t + STEP).toFixed(2)) { tot++; if (cubierto(t)) cub++; }
  const pct = (cub / tot) * 100;
  console.log(`⛔ VENTANA FISH (${AVATAR_ON_END}-${AVATAR_OFF_END}s): cubierta ${pct.toFixed(1)}% (piso 99%)`);
  if (pct < 99) err(`se vería la boca desfasada`);
}

// 3) ningún plano de la base puede caer DENTRO de un movimiento (se pisarían)
for (const c of base) {
  const m = movs.find((x) => c.f0 < x.f1 && c.f1 > x.f0);
  if (m) err(`el plano ${c.src} (${c.a}-${c.z}s) se solapa con ${m.comp} (${m.a.toFixed(2)}-${m.z.toFixed(2)}s)`);
}
for (let i = 1; i < movs.length; i++) if (movs[i].f0 < movs[i - 1].f1) err(`${movs[i].comp} se solapa con ${movs[i - 1].comp}`);

// ── VENTANAS DE AVATAR (base FULL: el avatar es el fondo garantizado) ─────────────────────────
const windows = [];
let cur = null;
for (let t = 0; t < TOTAL; t = +(t + STEP).toFixed(2)) {
  const dentroFish = t >= AVATAR_ON_END && t < AVATAR_OFF_END;
  const mode = cubierto(t) || dentroFish ? "hidden" : "full";
  if (mode !== cur) { windows.push({ start: t, mode }); cur = mode; }
}
if (!windows.length || windows[0].start > 0) windows.unshift({ start: 0, mode: "full" });

// 4) anti-hueco: cero instantes sin fondo
{
  const pozos = []; let gs = null;
  for (let t = 0; t < TOTAL; t = +(t + STEP).toFixed(2)) {
    const w = [...windows].reverse().find((x) => x.start <= t);
    const hay = cubierto(t) || w.mode === "full";
    if (!hay) { if (gs == null) gs = t; } else if (gs != null) { pozos.push([gs, t]); gs = null; }
  }
  if (gs != null) pozos.push([gs, TOTAL]);
  console.log(`anti-hueco: ${pozos.length} instantes sin fondo` + (pozos.length ? " → " + pozos.slice(0, 6).map(([a, b]) => `${a.toFixed(1)}-${b.toFixed(1)}s`).join(" ") : " ✓"));
  if (pozos.length) err("hay fondo muerto");
}

// 5) reparto: el presentador, los movimientos y el metraje real
const avSecs = windows.reduce((a, w, i) => a + (w.mode === "full" ? ((windows[i + 1]?.start ?? TOTAL) - w.start) : 0), 0);
const clipS = base.filter((c) => c.src.endsWith(".mp4")).reduce((a, c) => a + (c.f1 - c.f0) / FPS, 0);
const fotoS = base.filter((c) => !c.src.endsWith(".mp4")).reduce((a, c) => a + (c.f1 - c.f0) / FPS, 0);
const movS = movs.reduce((a, m) => a + (m.f1 - m.f0) / FPS, 0);
console.log(`reparto: avatar ${avSecs.toFixed(0)}s (${(avSecs / TOTAL * 100).toFixed(1)}%) · movimientos ${movS.toFixed(0)}s (${(movS / TOTAL * 100).toFixed(1)}%) · clips ${clipS.toFixed(0)}s (${(clipS / TOTAL * 100).toFixed(1)}%) · fotos ${fotoS.toFixed(0)}s (${(fotoS / TOTAL * 100).toFixed(1)}%)`);
if (avSecs / TOTAL < 0.15) err("el presentador se ve menos del 15% del video");
// los movimientos son PUNTUACIÓN, no la carga del video: si pasan del 45% se vuelven diapositivas
// premium encadenadas y desaparece la toma real (medido en `cmesodimac`: 57% de gráfico = rechazo).
if (movS / TOTAL > 0.45) err(`los movimientos ocupan el ${(movS / TOTAL * 100).toFixed(0)}% (techo 45%)`);

// 6) pacing de los planos sueltos: ni metrónomo ni planos muertos
{
  const D = base.map((c) => (c.f1 - c.f0) / FPS).sort((a, b) => a - b);
  const q = (x) => D[Math.min(D.length - 1, Math.floor(D.length * x))];
  const p5 = base.filter((c) => (c.f1 - c.f0) / FPS >= 5).length / D.length * 100;
  console.log(`pacing (planos sueltos): ${D.length} · mediana ${q(0.5).toFixed(2)}s · p75 ${q(0.75).toFixed(2)}s · ≥5s ${p5.toFixed(0)}% · max ${D[D.length - 1].toFixed(1)}s`);
  if (D[D.length - 1] > 12.5) err(`hay un plano de ${D[D.length - 1].toFixed(1)}s (techo 12s)`);
  if (Math.abs(q(0.75) - q(0.5)) < 0.5) err("p75 ≈ mediana: el corte es un metrónomo");
}

// 7) tiempo de LECTURA de cada pieza: el piso sale del TEXTO, no del hueco.
//    2,0 s (overlay que no tapa) / 2,8 s (pantalla completa) + 0,28 s por palabra más allá de 3.
{
  const OVERLAY = new Set(["Rotulo", "Cierre"]);
  let malos = 0;
  for (const o of over) {
    const txt = JSON.stringify(o.props).replace(/"img\/[^"]+"/g, " ").replace(/[^\p{L}\p{N} ]/gu, " ");
    const pal = txt.split(/\s+/).filter((w) => w.length > 1).length;
    const piso = (OVERLAY.has(o.comp) ? 2.0 : 2.8) + 0.28 * Math.max(0, pal - 3);
    const dur = (o.f1 - o.f0) / FPS;
    const techoUtil = o.enRel && o.enRel.length ? dur - (o.enRel[o.enRel.length - 1] / FPS) + 0.9 * (o.enRel.length) : dur;
    if (dur < Math.min(piso, 13) && techoUtil < 2.2) { console.error(`  · ${o.comp} @${o.a}s dura ${dur.toFixed(2)}s y necesita ${piso.toFixed(2)}s (${pal} palabras)`); malos++; }
  }
  console.log(`tiempo de lectura: ${over.length - malos}/${over.length} piezas con aire suficiente`);
  if (malos) err(`${malos} pieza(s) no se llegan a leer`);
}

// 8) variedad: tipos distintos y ningún par de planos contiguos con el mismo asset
{
  const tipos = new Set([...over.map((o) => o.comp), ...movs.map((m) => m.comp)]);
  console.log(`gráficos: ${over.length} piezas + ${movs.length} movimientos → ${tipos.size} tipos distintos`);
  if (tipos.size < 6) err("menos de 6 tipos distintos");
  let rep = 0;
  for (let i = 1; i < base.length; i++) if (base[i].src === base[i - 1].src && base[i].f0 - base[i - 1].f1 <= 1) { console.error(`  · plano repetido contiguo: ${base[i].src} @${base[i].a}s`); rep++; }
  if (rep) err(`${rep} par(es) de planos contiguos con el MISMO asset`);
  console.log(`assets distintos en el tar: ${usados.size}`);
}

// 9) el avatar y todos los clips tienen que estar a 30/1 CFR (si no, judder irregular)
{
  const fps = (p) => { try { return execFileSync("ffprobe", ["-v", "error", "-select_streams", "v", "-show_entries", "stream=r_frame_rate", "-of", "csv=p=0", p]).toString().trim(); } catch { return "?"; } };
  const archivos = [`public/${SLUG}_opt.mp4`, ...[...usados].filter((s) => s.endsWith(".mp4")).map((s) => "public/" + s)];
  const malos = archivos.filter((p) => fps(p) !== "30/1");
  console.log(`fps: ${archivos.length - malos.length}/${archivos.length} archivos a 30/1`);
  if (malos.length) err(`a 30/1 le faltan: ${malos.join(" ")}`);
}

// 10) el wav máster y la duración de la composición
{
  const wav = +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", `public/${SLUG}.wav`]).toString().trim();
  console.log(`duración: comp ${TOTAL}s · wav ${wav.toFixed(3)}s`);
  if (TOTAL + 0.05 < wav) err(`la comp dura menos que el wav: se corta la última frase`);
}

// 11) nada del precio del CURSO en pantalla (regla dura del canal)
//     ⛔ sólo el precio del CURSO. Las cifras del SERVICIO (80 · 150 · 300 · 600 · 1.200) SON el
//     argumento del VSL y tienen que estar: lo prohibido es que se vea lo que cuesta el curso.
{
  // ⛔ sólo los LITERALES DE STRING (lo que se dibuja). Antes se escaneaba el archivo ENTERO y
  // `\b297\b` matcheaba el FRAME 297, que es la frontera del acto 4 de Mov3: la compuerta frenó
  // un render por un número de frame.
  let txt = JSON.stringify(OVER).toLowerCase();
  for (const f of fs.readdirSync("src/vslcurso").filter((x) => x.startsWith("Mov"))) {
    txt += " " + literales(fs.readFileSync(`src/vslcurso/${f}`, "utf8")).toLowerCase();
  }
  const PRECIO_CURSO = [/us\s?\$\s?\d/, /\$\s?297/, /\b297\s*(d[oó]lares|usd)/, /\$\s?197/, /\b197\s*(d[oó]lares|usd)/];
  for (const pat of PRECIO_CURSO) if (pat.test(txt)) err(`aparece el precio del CURSO en pantalla (${pat})`);
}

// 12) LOS MOVIMIENTOS: existen, exportan su nombre y respetan el contrato técnico.
//     ⛔ un import nombrado que llega `undefined` tira React #130, que NO dice qué componente fue,
//     y mata los 50 chunks. `tsc` no lo ve si el archivo no existe todavía.
for (const m of MOVS) {
  const p = `src/vslcurso/${m.comp}.tsx`;
  if (!fs.existsSync(p)) { err(`falta ${p} (movimiento ${m.comp})`); continue; }
  const crudo = fs.readFileSync(p, "utf8");
  if (!new RegExp(`export\\s+const\\s+${m.comp}\\b`).test(crudo)) err(`${p} NO exporta \`${m.comp}\` (React #130 mata los 50 chunks)`);
  // ⛔ despellejar los COMENTARIOS antes de buscar: la línea del contrato técnico que PROHÍBE
  // `backdrop-filter` dispara la compuerta que lo busca, y el filtro por línea no alcanza (los
  // comentarios JSX `{/* … */}` y los de mitad de línea se le escapan). Ya acusó a tres
  // movimientos inocentes y frenó el render.
  const src = soloCodigo(crudo);
  if (/<Video[\s>]/.test(src)) err(`${p} usa <Video>: va OffthreadVideo (causa #1 del "se ve lageado")`);
  if (/Math\.random|Date\.now|new Date\(/.test(src)) err(`${p} usa Math.random/Date: el farm rinde en 50 chunks y cada uno daría algo distinto`);
  if (/backdropFilter\s*:|["'`]backdrop-filter["'`]/.test(src)) err(`${p} usa backdrop-filter: ×5 el tiempo de render`);
  if (/Easing\.quint/.test(src)) err(`${p} usa Easing.quint, que NO EXISTE → Easing.poly(5)`);
  // ⛔⛔ `interpolate` exige un inputRange ESTRICTAMENTE creciente y sólo revienta EN EL RENDER, en
  // el frame exacto donde se evalúa. Un `[0, 0, 96, 132]` —la forma natural de escribir "ya está
  // visible en el frame 0, sin fade de entrada"— mató 3 chunks de este video con los 50 runners
  // encendidos. `tsc` no lo ve: son números. Acá se revisan los rangos LITERALES.
  // ⚠️ Y la compuerta tiene que mirar SÓLO el inputRange: un outputRange legítimamente baja o
  // repite valores (`[0, 1, 1, 0]` es un fade in-hold-out perfectamente válido). La primera
  // versión miraba TODO array de números y escupió 28 falsos positivos.
  const creciente = (lit, donde) => {
    const n = lit.slice(1, -1).split(",").map((x) => Number(x.trim()));
    if (n.length < 2 || n.some((v) => !Number.isFinite(v))) return;
    if (n.some((v, k) => k > 0 && v <= n[k - 1])) {
      err(`${p} ${donde} ${lit} NO es estrictamente creciente → interpolate revienta EN EL RENDER`);
    }
  };
  // forma directa: interpolate(x, [ … ], …)
  for (const m of src.matchAll(/\binterpolate\s*\(\s*[^,()]*(?:\([^()]*\))?[^,()]*,\s*(\[[^\][]*\])/g)) {
    creciente(m[1], "pasa como inputRange");
  }
  // forma indirecta: el rango vive en una prop `r`/`rango`/`range` de una tabla y se pasa después
  // (así se colaron los `[0, 0, 96, 132]` del muro de Mov2, que mataron 3 chunks)
  for (const m of src.matchAll(/\b(?:r|rango|range|inRange)\s*:\s*(\[[^\][]*\])/g)) {
    creciente(m[1], "declara el rango");
  }
  if (/\bloop\b/.test(src.replace(/<Loop[\s>]/g, ""))) console.warn(`⚠ ${p} menciona \`loop\`: NO es prop de OffthreadVideo (cae en ...props y se ignora en silencio)`);
}

if (fatal) { console.error(`\n⛔ ${fatal} compuerta(s) fallaron — NO se rendea.`); process.exit(1); }

// ── EMITIR ────────────────────────────────────────────────────────────────────────────────────
const esc = (v) => JSON.stringify(v);
const props = (o) => {
  const p = { ...o.props };
  if (o.enRel && o.enRel.length) p.en = o.enRel;
  if (o.blurSrc) p.blurSrc = o.blurSrc;
  p.desde = o.desde;
  return Object.entries(p).map(([k, v]) => `${k}={${esc(v)}}`).join(" ");
};

const cues = base.map((c, i) => {
  const Pieza = c.src.endsWith(".mp4") ? "Clip" : "Foto";
  return `  { key: "b${String(i).padStart(3, "0")}", start: ${c.f0}, dur: ${c.f1 - c.f0}, el: () => <${Pieza} src=${esc(c.src)} seed={${c.f0}} /> },`;
}).join("\n");

const movCues = movs.map((m, i) =>
  `  { key: "m${i}", start: ${m.f0}, dur: ${m.f1 - m.f0}, el: () => <${m.comp} desde={${m.f0}} /> },   // ${m.que}`
).join("\n");

const overs = over.map((o, i) =>
  `  { key: "o${String(i).padStart(2, "0")}", start: ${o.f0}, dur: ${o.f1 - o.f0}, el: () => <${o.comp} ${props(o)} /> },`
).join("\n");

const piezas = [...new Set(over.map((o) => o.comp))].sort();
fs.writeFileSync(
  `src/VideoEdit/cues_${SLUG}.gen.tsx`,
  `// cues_${SLUG}.gen.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
import React from "react";
import { Clip, Foto, ${piezas.join(", ")} } from "../vslcurso/Piezas";
${MOVS.map((m) => `import { ${m.comp} } from "../vslcurso/${m.comp}";`).join("\n")}

export type Cue = { key: string; start: number; dur: number; el: () => React.ReactNode };

/** capa BASE — b-roll a sangre. Donde no hay cue, el fondo es el avatar (AVATAR_WINDOWS). */
export const CUES: Cue[] = [
${cues}
];

/** los 6 MOVIMIENTOS — cada uno es UNA escena continua de 4-6 actos, con su propia atmósfera y
 *  la cámara del Escenario (función del frame GLOBAL, así que no reinician nada). Van ENCIMA de
 *  la base y tapan el cuadro entero. */
export const MOVIMIENTOS: Cue[] = [
${movCues}
];

/** capa OVER — las piezas sueltas, siempre POR ENCIMA de todo. */
export const OVERLAYS: Cue[] = [
${overs}
];
`
);

fs.writeFileSync(
  `src/VideoEdit/avatar_${SLUG}.gen.ts`,
  `// generado por build_${SLUG}.mjs — NO editar a mano.
export const TOTAL_VSLCURSO = ${TOTAL};
export const AVATAR_WINDOWS = ${JSON.stringify(windows)} as const;
`
);

// lista de assets para el tar del farm (rutas relativas a public/), con los hermanos _blur.jpg
const assets = new Set([`${SLUG}_opt.mp4`, `${SLUG}.wav`]);
for (const s of usados) {
  assets.add(s);
  if (s.endsWith(".png")) {
    const b = s.replace(/\.png$/, "_blur.jpg");
    if (fs.existsSync("public/" + b)) assets.add(b);
  }
}
fs.writeFileSync(`_${SLUG}_assets.txt`, [...assets].sort().join("\n") + "\n");

console.log(`\n→ src/VideoEdit/cues_${SLUG}.gen.tsx (${base.length} planos · ${movs.length} movimientos · ${over.length} piezas)`);
console.log(`→ src/VideoEdit/avatar_${SLUG}.gen.ts (${windows.length} ventanas)`);
console.log(`→ _${SLUG}_assets.txt (${assets.size} assets)`);
console.log(`→ frames: ${Math.round(TOTAL * FPS)}`);

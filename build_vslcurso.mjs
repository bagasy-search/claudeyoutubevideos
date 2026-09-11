// build_vslcurso.mjs — VSL de la landing constructorlibre.com/curso
// Canal El Constructor Libre · presentador Tomás · máster 277,632 s.
//
// ═══ RE-EDICIÓN (el creador rechazó el primer montaje) ════════════════════════════════════════
// Sus tres palabras: *"siempre debe en los primeros segundos verse el avatar hablando"* ·
// *"le pusiste un movimiento al video del avatar horrendo que hace que se desencuadre"* ·
// *"más gráficos y edición estilo Remotion falta, limpia, moderna, es horrenda actualmente"*.
//
// 1. ARRANCA CON LA CARA. El máster se rehizo: 0 → 5,80 s es el audio ORIGINAL del avatar
//    ("Quiero que mires este comentario porque acá está todo el negocio resumido en una sola
//    frase"), 5,80 → 17,4026 s es la voz Fish con los comentarios REALES, y de 17,4026 s en
//    adelante el cuerpo quedó BIT A BIT intacto. Como el empalme es al sample y la duración
//    total no cambió (13.326.340 muestras), ningún anclaje del resto del video se movió.
//    ⛔ AVATAR_ON_END = 6,00 s: en el ORIGINAL la frase siguiente arranca a los 6,06 s, así que
//    a partir de ahí la boca ya no coincide con la voz Fish. Verificado sobre el video: a los
//    9,0-9,6 s la boca se mueve y el máster Fish ahí está en SILENCIO → el video del avatar
//    sigue al audio ORIGINAL, que es la premisa de todo esto.
// 2. SIN MOVIMIENTO EN EL AVATAR. `AvatarLayerSal` recibe `sinMovimiento` (prop nueva, default
//    false para no tocar los demás videos del canal).
// 3. KIT NUEVO, LIMPIO. `src/vslcurso/Piezas.tsx` — blanco puro sobre velo oscuro, Inter pesada,
//    tipografía grande, una idea por lámina. Reemplaza al `kit/premium` crema del canal, que
//    sobre b-roll oscuro se lee como un borrón beige.
//
// El storyboard de abajo está escrito PLANO POR PLANO contra las frases reales del máster
// (`_v3/vslcurso_frases.txt`): cada plano muestra lo que se dice EN ESE SEGUNDO.
import fs from "fs";
import { execFileSync } from "child_process";

const SLUG = "vslcurso";
const FPS = 30;
const TOTAL = 277.632;
const AVATAR_ON_END = 6.00;      // hasta acá el avatar TIENE que verse (lipsync real)
const AVATAR_OFF_END = 17.4026;  // de 6,00 a acá el avatar NO puede verse (voz Fish)

const I = (n) => `img/${n}.png`;
const C = (n) => `broll/vslcurso_${String(n).padStart(3, "0")}.mp4`;

// ── STORYBOARD: capa BASE ─────────────────────────────────────────────────────────────────────
// [desde, hasta, asset]. Donde no hay plano, el avatar es el fondo (base FULL: regla anti-hueco).
const BASE = [
  // 0,00 → 6,00  AVATAR FULL, lipsync real: "Quiero que mires este comentario…"

  // "Esta mujer mandó a reparar su pared tres veces. Tres. Y el daño volvió."
  [6.00, 9.55, C(37)],        // esquina de habitación con moho negro
  [9.55, 11.95, C(45)],       // pared con humedad y salitre
  // "Este hombre buscó una empresa que le hiciera el trabajo y no encontró a nadie."
  [11.95, 14.85, I("vslp02")], // un hombre parado frente a su pared con moho
  [14.85, 17.50, C(25)],      // habitación vacía = no encontró a nadie

  // "No tienes que inventar una necesidad, la necesidad ya existe."
  // ráfaga DELIBERADA de casas reales — es la única del video, y por eso funciona
  [17.50, 18.55, I("vslp01")], // señor señalando el techo de su cocina
  [18.55, 19.55, I("vslp03")], // baño con moho
  [19.55, 20.50, I("vslp04")], // mujer abriendo el placard húmedo
  [20.50, 21.60, C(1)],        // mancha circular en el techo

  // 21,60 → 25,35  AVATAR: "quiero que dejes de mirar esto como un curso sobre humedad"
  [25.35, 27.40, C(8)],        // manos con espátula = la habilidad
  [27.40, 29.05, I("vsls04")], // le pagan en la puerta = "que después puedes cobrar"

  // "80 dólares… 150… 200, 250 o 300" — la Escalera va encima, así que el fondo NO se corta
  // cada 3 s: dos camas largas y desenfocadas. Cortar debajo de un componente es ruido.
  [29.05, 34.50, C(16)],
  [34.50, 39.90, C(13)],
  [39.90, 43.70, I("vslm02")], // Tomás tocando la pared: "según la zona y la dificultad"

  // 43,70 → 49,00  AVATAR: "mira el precio que aparece debajo de este video"
  [49.00, 55.35, I("vslc03")], // cuaderno, calculadora y billetes (cama del Duelo)
  [55.35, 58.35, C(43)],       // balde con billetes: "que puedes cobrar 150 dólares"

  // 58,35 → 62,15  AVATAR: "la pregunta importante es por qué no lo haces"
  [62.15, 67.90, C(31)],       // cuaderno abierto con lápiz

  // 67,90 → 72,10  AVATAR: "Haz esa cuenta ahora y después haz otra"
  [72.10, 78.00, I("vslc02")], // la mano escribiendo la cuenta
  [78.00, 85.40, I("vslc03")],

  // 85,40 → 91,70  AVATAR: "No significa que vas a ganar eso automáticamente"
  [91.70, 95.80, I("vslm03")], // una clienta real señalando su pared

  // 95,80 → 98,85  AVATAR: "acá está la parte que mucha gente no entiende"
  [98.85, 103.00, I("vslm01")], // botellas, balde, brocha y guantes = el material de la ferretería
  [103.00, 105.30, I("vslx01")], // un hombre con la escoba mirando la pared, sin saber qué hacer
  [105.30, 107.40, C(37)],       // "una pared negra"
  [107.40, 109.60, I("vsls01")], // "Tú sí": Tomás agachado, midiendo

  [109.60, 114.00, C(3)],        // condensación con gotas (cama de las Tarjetas)

  // "qué material usar, cuánto aplicar, cómo reparar, cómo dejarlo terminado"
  [114.00, 116.60, C(8)],
  [116.60, 119.10, I("vsls02")], // aplicando el producto con la brocha
  [119.10, 121.40, I("vslk02")], // rodillo en el zócalo: terminado, no un parche
  [121.40, 125.40, I("vsls03")], // medidor de humedad + cuaderno = el diagnóstico

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
  [182.10, 186.70, I("vslg02")], // el curso abierto en la laptop: "16 clases"
  [186.70, 192.50, I("vslh02")], // camas de la Lista de documentos
  [192.50, 199.50, I("vslg01")],

  // 199,50 → 202,20  AVATAR: "No estás comprando tres horas de videos"
  [202.20, 209.30, I("vslx01")], // cama del Duelo
  [209.30, 212.20, I("vsls04")], // "cobrar por resolverla"

  // 212,20 → 218,20  AVATAR: "vuelve a hacer la cuenta. Mira el precio de abajo"
  [218.20, 221.70, C(43)],       // "cuánto puede valer uno solo de estos trabajos"

  // 221,70 → 225,35  AVATAR: "qué prefieres tener dentro de seis meses"
  [225.35, 229.40, I("vslc03")],

  // 229,40 → 233,40  AVATAR: "No compres esto si buscas dinero fácil"
  [233.40, 237.00, C(8)],
  [237.00, 240.20, I("vslk01")],
  [240.20, 243.20, I("vsls02")], // "un oficio concreto"
  [243.20, 245.70, C(37)],       // "un problema real"
  [245.70, 248.10, I("vslp01")], // "personas reales buscando quién se lo resuelva"
  [248.10, 250.40, I("vsls04")], // "servicios que pueden valer cientos de dólares"

  // 250,40 → 253,30  AVATAR: "deja de pensarlo como un gasto"
  [253.30, 258.20, I("vslg02")], // los 15 días de garantía, con el curso delante
  [258.20, 262.10, I("vslw01")], // "la humedad ya está en las casas"
  [262.10, 266.20, I("vslm03")], // vuelve el comentario del principio
  [266.20, 269.60, I("vsls04")], // "alguien va a cobrar por esos trabajos"

  // 269,60 → 277,632  AVATAR FULL + la tarjeta de cierre flotando al costado
];

// ── STORYBOARD: capa OVER (componentes) ───────────────────────────────────────────────────────
// `en` = los segundos ABSOLUTOS en los que cada elemento tiene que aparecer, para que el reveal
// caiga sobre la palabra. El build los pasa a frames relativos al cue.
const COM1 = "Tengo una pared con humedad, ya la he mandado a reparar 3 veces y nuevamente aparece el daño. Estoy desesperada.";
const OVER = [
  { comp: "Comentario", a: 6.05, z: 11.95, props: { texto: COM1, resalta: "reparar 3 veces", fuente: "Video de humedad · 3,8 M de vistas" } },
  { comp: "Comentario", a: 12.20, z: 17.45, props: { texto: "Buscando empresas que ofrecen ese servicio en mi país sólo encontré una.", resalta: "sólo encontré una", fuente: "Video de humedad · 2,9 M de vistas" } },
  { comp: "Frase", a: 19.35, z: 21.65, props: { lineas: ["La necesidad", "YA EXISTE."] } },

  { comp: "Escalera", a: 29.05, z: 39.90, en: [31.30, 34.00, 38.20], props: {
    eyebrow: "Lo que se cobra un trabajo",
    items: [{ valor: "$80", nota: "uno pequeño" }, { valor: "$150", nota: "uno mediano" }, { valor: "$300", nota: "los más grandes" }],
  } },

  { comp: "Rotulo", a: 44.60, z: 48.95, props: { texto: "El precio está justo debajo de este video", nota: "compáralo con esos números", flecha: true } },

  { comp: "Duelo", a: 49.05, z: 55.30, props: {
    eyebrow: "La comparación que importa",
    titulo: "No lo compares con otro curso",
    izq: { rotulo: "Otro curso", sub: "tres horas de video que nunca vas a usar", img: I("vslg02") },
    der: { rotulo: "Un trabajo cobrado", sub: "lo que te pagan por resolver una pared", img: I("vsls04") },
  } },

  { comp: "Cifra", a: 55.45, z: 58.30, props: { eyebrow: "Un servicio que puedes cobrar", valor: 150, sufijo: " dólares", apoyo: "Por resolver una sola pared." } },

  { comp: "Frase", a: 62.30, z: 67.85, props: { lineas: ["La pregunta no es cuánto cuesta.", "ES CUÁNTOS TRABAJOS."] } },

  { comp: "Cuenta", a: 72.30, z: 85.40, en: [74.90, 79.00, 83.20], props: {
    eyebrow: "Haz la cuenta",
    titulo: "Cuántos trabajos hacen falta",
    filas: [
      { trabajo: "1 trabajo por semana · $150", total: "$600 / mes" },
      { trabajo: "4 trabajos al mes · $200", total: "$800 / mes" },
      { trabajo: "2 por semana · $150", total: "$1.200 / mes" },
    ],
  } },

  { comp: "Frase", a: 91.80, z: 95.78, props: { lineas: ["No te prometo mil dólares.", "TE MUESTRO LA MATEMÁTICA."] } },

  { comp: "Rotulo", a: 99.50, z: 102.95, props: { texto: "Esto no es por lo que te pagan", nota: "el líquido que compras en la ferretería" } },

  { comp: "Tarjetas", a: 109.60, z: 114.00, en: [110.30, 110.90, 111.50], props: {
    eyebrow: "De dónde viene el agua",
    titulo: "Tres orígenes, tres tratamientos",
    items: [
      { rotulo: "Del aire", sub: "la pared fría junta el vapor", img: I("vsld01") },
      { rotulo: "De afuera", sub: "entra por una grieta o una gotera", img: I("vsld02") },
      { rotulo: "Del suelo", sub: "sube del suelo y deja salitre", img: I("vsld03") },
    ],
  } },

  { comp: "Frase", a: 121.40, z: 125.40, props: { lineas: ["No pagan el líquido.", "PAGAN EL DIAGNÓSTICO."] } },

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

  { comp: "Cifra", a: 182.20, z: 186.60, props: { eyebrow: "El curso por dentro", valor: 16, sufijo: " clases", apoyo: "Unas tres horas, ordenadas de principio a fin." } },

  { comp: "Lista", a: 186.70, z: 199.40, en: [190.20, 191.30, 192.40, 193.30, 194.40, 195.80], props: {
    eyebrow: "Además de las clases",
    titulo: "Los documentos que vas a usar de verdad",
    items: [
      "La hoja de diagnóstico",
      "El presupuesto",
      "La garantía por escrito",
      "El recibo",
      "La tabla de precios",
      "La lista de errores que revisas antes de cada trabajo",
    ],
  } },

  { comp: "Duelo", a: 202.30, z: 209.20, props: {
    eyebrow: "Lo que cambia",
    titulo: "Estás comprando un sistema",
    izq: { rotulo: "Mirar la pared", sub: "y no saber qué hacer con ella", img: I("vslx01") },
    der: { rotulo: "Diagnosticarla y cobrarla", sub: "con el cuaderno y el medidor en la mano", img: I("vsls03") },
  } },

  { comp: "Rotulo", a: 215.30, z: 218.30, props: { texto: "Vuelve a mirar el precio de abajo", flecha: true } },

  { comp: "Cifra", a: 218.40, z: 221.60, props: { eyebrow: "Uno solo de estos trabajos", valor: 300, sufijo: " dólares", apoyo: "Los más grandes llegan ahí, según la zona y la dificultad." } },

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

  { comp: "Sello", a: 253.40, z: 258.10, props: { dias: 15, titulo: "Días de garantía", apoyo: "Entras, lo ves completo y decides con el curso delante tuyo." } },

  // cierra el círculo: vuelve el comentario con el que abrió el video
  { comp: "Comentario", a: 262.10, z: 265.90, props: { texto: COM1, resalta: "reparar 3 veces", fuente: "Video de humedad · 3,8 M de vistas" } },

  { comp: "Frase", a: 265.95, z: 269.60, props: { lineas: ["Alguien va a cobrar", "ESOS TRABAJOS."] } },

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

// ── ALINEAR AL FRAME (el "se pone oscuro entre transición") ───────────────────────────────────
// `from` y `durationInFrames` se redondean POR SEPARADO: 53,94 + 0,98 termina en el frame 1647 y
// el siguiente arranca en el 1648 → un destello del fondo de 33 ms que `blackdetect` no ve.
// Se emiten los frames ya pegados.
const F = (s) => Math.round(s * FPS);
const base = BASE.map(([a, z, src]) => ({ a, z, src })).sort((x, y) => x.a - y.a);
for (let i = 0; i < base.length; i++) {
  const c = base[i], sig = base[i + 1];
  c.f0 = F(c.a);
  c.f1 = F(c.z);
  if (sig && Math.abs(F(sig.a) - c.f1) <= 2) c.f1 = F(sig.a);
  if (c.f1 <= c.f0) err(`plano vacío en ${c.a}s (${c.src})`);
}
const over = OVER.map((o) => {
  const f0 = F(o.a), f1 = F(o.z);
  return { ...o, f0, f1, enRel: (o.en || []).map((s) => Math.max(0, F(s) - f0)) };
});

// ── COMPUERTAS ────────────────────────────────────────────────────────────────────────────────
const STEP = 0.1;
const cubierto = (t) => base.some((c) => c.f0 / FPS <= t && c.f1 / FPS > t);

// 1) el avatar TIENE que verse en los primeros segundos (regla dura del creador)
{
  let vis = 0, n = 0;
  for (let t = 0; t < AVATAR_ON_END; t = +(t + STEP).toFixed(2)) { n++; if (!cubierto(t)) vis++; }
  const pct = (vis / n) * 100;
  console.log(`⛔ APERTURA (0-${AVATAR_ON_END}s): el avatar se ve el ${pct.toFixed(1)}% (piso 100%)`);
  if (pct < 99.9) err(`hay b-roll tapando al presentador en la apertura`);
}

// 2) de AVATAR_ON_END a AVATAR_OFF_END el avatar NO puede verse (voz Fish, labios desfasados)
{
  let tot = 0, cub = 0;
  for (let t = AVATAR_ON_END; t < AVATAR_OFF_END; t = +(t + STEP).toFixed(2)) { tot++; if (cubierto(t)) cub++; }
  const pct = (cub / tot) * 100;
  console.log(`⛔ VENTANA FISH (${AVATAR_ON_END}-${AVATAR_OFF_END}s): cubierta ${pct.toFixed(1)}% (piso 99%)`);
  if (pct < 99) err(`se vería la boca desfasada`);
}

// ── VENTANAS DE AVATAR (base FULL: el avatar es el fondo garantizado) ─────────────────────────
const windows = [];
let cur = null;
for (let t = 0; t < TOTAL; t = +(t + STEP).toFixed(2)) {
  const dentroFish = t >= AVATAR_ON_END && t < AVATAR_OFF_END;
  const mode = cubierto(t) || dentroFish ? "hidden" : "full";
  if (mode !== cur) { windows.push({ start: t, mode }); cur = mode; }
}
if (!windows.length || windows[0].start > 0) windows.unshift({ start: 0, mode: "full" });

// 3) anti-hueco: cero instantes sin fondo
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

// 4) reparto: metraje real (clips + avatar) y peso de los gráficos
const avSecs = windows.reduce((a, w, i) => a + (w.mode === "full" ? ((windows[i + 1]?.start ?? TOTAL) - w.start) : 0), 0);
const clipS = base.filter((c) => c.src.endsWith(".mp4")).reduce((a, c) => a + (c.f1 - c.f0) / FPS, 0);
const fotoS = base.filter((c) => !c.src.endsWith(".mp4")).reduce((a, c) => a + (c.f1 - c.f0) / FPS, 0);
const overS = over.reduce((a, o) => a + (o.f1 - o.f0) / FPS, 0);
console.log(`reparto: avatar ${avSecs.toFixed(0)}s (${(avSecs / TOTAL * 100).toFixed(1)}%) · clips ${clipS.toFixed(0)}s (${(clipS / TOTAL * 100).toFixed(1)}%) · fotos ${fotoS.toFixed(0)}s (${(fotoS / TOTAL * 100).toFixed(1)}%)`);
console.log(`metraje REAL (avatar + clips del canal) ${((avSecs + clipS) / TOTAL * 100).toFixed(1)}% (piso 25%)`);
if ((avSecs + clipS) / TOTAL < 0.25) err("menos de 25% de metraje real: todo IA se siente vacío");
if (avSecs / TOTAL < 0.15) err("el presentador se ve menos del 15% del video");

// 5) pacing: ni metrónomo ni planos muertos
{
  const D = base.map((c) => (c.f1 - c.f0) / FPS).sort((a, b) => a - b);
  const q = (x) => D[Math.min(D.length - 1, Math.floor(D.length * x))];
  const p5 = base.filter((c) => (c.f1 - c.f0) / FPS >= 5).length / D.length * 100;
  console.log(`pacing: ${D.length} planos · mediana ${q(0.5).toFixed(2)}s · p75 ${q(0.75).toFixed(2)}s · ≥5s ${p5.toFixed(0)}% · max ${D[D.length - 1].toFixed(1)}s`);
  if (D[D.length - 1] > 12.5) err(`hay un plano de ${D[D.length - 1].toFixed(1)}s (techo 12s)`);
  if (Math.abs(q(0.75) - q(0.5)) < 0.5) err("p75 ≈ mediana: el corte es un metrónomo");
}

// 6) tiempo de LECTURA de cada componente: el piso sale del TEXTO, no del hueco.
//    2,0 s (overlay que no tapa) / 2,8 s (pantalla completa) + 0,28 s por palabra más allá de 3.
{
  const OVERLAY = new Set(["Rotulo", "Cierre"]);
  let malos = 0;
  for (const o of over) {
    const txt = JSON.stringify(o.props).replace(/"img\/[^"]+"/g, " ").replace(/[^\p{L}\p{N} ]/gu, " ");
    const pal = txt.split(/\s+/).filter((w) => w.length > 1).length;
    const piso = (OVERLAY.has(o.comp) ? 2.0 : 2.8) + 0.28 * Math.max(0, pal - 3);
    const dur = (o.f1 - o.f0) / FPS;
    // los Cierre/Lista largos se leen mientras se revelan: el piso se mide contra el ÚLTIMO reveal
    const techoUtil = o.enRel && o.enRel.length ? dur - (o.enRel[o.enRel.length - 1] / FPS) + 0.9 * (o.enRel.length) : dur;
    if (dur < Math.min(piso, 13) && techoUtil < 2.2) { console.error(`  · ${o.comp} @${o.a}s dura ${dur.toFixed(2)}s y necesita ${piso.toFixed(2)}s (${pal} palabras)`); malos++; }
  }
  console.log(`tiempo de lectura: ${over.length - malos}/${over.length} componentes con aire suficiente`);
  if (malos) err(`${malos} componente(s) no se llegan a leer`);
}

// 7) variedad: ≥6 componentes DISTINTOS y ningún par de planos consecutivos con el mismo asset
{
  const tipos = new Set(over.map((o) => o.comp));
  console.log(`componentes: ${over.length} en ${tipos.size} tipos distintos → ${[...tipos].join(", ")}`);
  if (tipos.size < 6) err("menos de 6 componentes distintos");
  let rep = 0;
  for (let i = 1; i < base.length; i++) if (base[i].src === base[i - 1].src && base[i].f0 - base[i - 1].f1 <= 1) { console.error(`  · plano repetido consecutivo: ${base[i].src} @${base[i].a}s`); rep++; }
  if (rep) err(`${rep} par(es) de planos consecutivos con el MISMO asset`);
  console.log(`assets distintos en la base: ${usados.size}`);
}

// 8) el avatar y todos los clips tienen que estar a 30/1 CFR (si no, judder irregular)
{
  const fps = (p) => { try { return execFileSync("ffprobe", ["-v", "error", "-select_streams", "v", "-show_entries", "stream=r_frame_rate", "-of", "csv=p=0", p]).toString().trim(); } catch { return "?"; } };
  const archivos = [`public/${SLUG}_opt.mp4`, ...[...usados].filter((s) => s.endsWith(".mp4")).map((s) => "public/" + s)];
  const malos = archivos.filter((p) => fps(p) !== "30/1");
  console.log(`fps: ${archivos.length - malos.length}/${archivos.length} archivos a 30/1`);
  if (malos.length) err(`a 30/1 le faltan: ${malos.join(" ")}`);
}

// 9) el wav máster y la duración de la composición
{
  const wav = +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", `public/${SLUG}.wav`]).toString().trim();
  console.log(`duración: comp ${TOTAL}s · wav ${wav.toFixed(3)}s`);
  if (TOTAL + 0.05 < wav) err(`la comp dura menos que el wav: se corta la última frase`);
}

// 10) nada de precio en pantalla (regla dura del canal) ni nombre personal
{
  const txt = JSON.stringify(OVER).toLowerCase();
  // ⛔ sólo el precio del CURSO. Las cifras del SERVICIO (80 · 150 · 300 · 600 · 1.200) SON el
  // argumento del VSL y tienen que estar: lo prohibido es que se vea lo que cuesta el curso.
  for (const pat of [/us\$\s?\d/, /\b297\b/, /\b197\b/]) if (pat.test(txt)) err(`aparece el precio del CURSO en pantalla (${pat})`);
}

if (fatal) { console.error(`\n⛔ ${fatal} compuerta(s) fallaron — NO se rendea.`); process.exit(1); }

// ── EMITIR ────────────────────────────────────────────────────────────────────────────────────
const esc = (v) => JSON.stringify(v);
const props = (o) => {
  const p = { ...o.props };
  if (o.enRel && o.enRel.length) p.en = o.enRel;
  return Object.entries(p).map(([k, v]) => `${k}={${esc(v)}}`).join(" ");
};

const cues = base.map((c, i) => {
  const Pieza = c.src.endsWith(".mp4") ? "Clip" : "Foto";
  return `  { key: "b${String(i).padStart(3, "0")}", start: ${c.f0}, dur: ${c.f1 - c.f0}, el: () => <${Pieza} src=${esc(c.src)} seed={${c.f0}} /> },`;
}).join("\n");

const overs = over.map((o, i) =>
  `  { key: "o${String(i).padStart(2, "0")}", start: ${o.f0}, dur: ${o.f1 - o.f0}, el: () => <${o.comp} ${props(o)} /> },`
).join("\n");

const compsUsados = [...new Set(over.map((o) => o.comp))].sort();
fs.writeFileSync(
  `src/VideoEdit/cues_${SLUG}.gen.tsx`,
  `// cues_${SLUG}.gen.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
import React from "react";
import { Clip, Foto, ${compsUsados.join(", ")} } from "../vslcurso/Piezas";

export type Cue = { key: string; start: number; dur: number; el: () => React.ReactNode };

/** capa BASE — b-roll a sangre. Donde no hay cue, el fondo es el avatar (AVATAR_WINDOWS). */
export const CUES: Cue[] = [
${cues}
];

/** capa OVER — los componentes, siempre POR ENCIMA del b-roll y del avatar. */
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

console.log(`\n→ src/VideoEdit/cues_${SLUG}.gen.tsx (${base.length} planos + ${over.length} componentes)`);
console.log(`→ src/VideoEdit/avatar_${SLUG}.gen.ts (${windows.length} ventanas)`);
console.log(`→ _${SLUG}_assets.txt (${assets.size} assets)`);
console.log(`→ frames: ${Math.round(TOTAL * FPS)}`);

// MovTreintaDias.tsx — S5 · UN MOVIMIENTO CONTINUO de 50 s (1500 frames @30fps)
// «Treinta días de cuaderno: el número de verdad de un panel de cien vatios es doscientos cuarenta.»
//
// EL MOVIMIENTO DEL CLIMA. Un solo encuadre del patio — el mismo panel, la misma inclinación, el mismo
// pasto — y encima de él pasan TRES DÍAS DISTINTOS. Lo único que cambia entre acto y acto es LA LUZ y
// LA MATERIA (sol duro → nube alta → gris con agua). La cámara nunca vuelve a cero, la atmósfera se
// monta UNA vez, y LAS TREINTA COLUMNAS del cuaderno son la materia que cruza TODAS las fronteras:
// nacen sobre la hoja, se despegan y viajan arriba como cinta, van marcando el día que se ve abajo, y
// al final vuelven a posarse sobre la hoja con el promedio subrayado.
//
// ══════════════════════════════════════ TABLA DE HANDOFF ══════════════════════════════════════
// acto 1 · f0    ENTER  cám z≈-20, rotateX +8,5° (CENITAL, heredada de MovAngulo, casi quieta) · luz
//                       `volt` cenital sobre el papel · materia: LA HOJA DEL CUADERNO con sus treinta
//                       columnas (viene entera de MovAngulo).
//                EXIT   cám z≈+95, pan +34/-20, rotateX ya en 0° (horizonte de patio) · luz `white`
//                       de mediodía duro, key corrida a 0,52 · materia: EL PATIO A PLENO SOL dentro
//                       del marco (la columna del día 1 se volvió la ventana) + LA CINTA DE 30
//                       COLUMNAS arriba, encendida en el día 1.
//
// acto 2 · f392  ENTER  cám z≈+95 siguiendo su empuje (mismo encuadre, misma escala, MISMO marco) ·
//                       luz `white`→`sky`, intensidad bajando · materia: EL MISMO PATIO, con la sombra
//                       de la nube ya cruzando la toma + la cinta encendida en el día 21.
//                EXIT   cám z≈+135, pan +34/+6 · luz `sky` plena, difusa, sin dirección · materia:
//                       LA NUBE GRIS ocupando el cuadro entero.
//
// acto 3 · f748  ENTER  cám z≈+135 (la nube la tapa, la cámara no se entera y sigue) · luz `sky` baja ·
//                       materia: EL MISMO PATIO MOJADO detrás de la nube, todo apagado.
//                EXIT   cám z≈+197, pan -14/-10 empujando al 62%/56% del cuadro · luz `sky`→`concrete`
//                       (lo más apagado del movimiento) · materia: UNA GOTA en la cara del panel, con
//                       su reflejo blanco — entramos DENTRO de la gota.
//
// acto 4 · f1110 ENTER  cám saliendo de la gota z≈+47, rotateX +6,2° (vuelve el cenital del cuaderno) ·
//                       luz `concrete`→`volt` (el papel recupera el verde de lo medido) · materia: EL
//                       BLANCO DEL INTERIOR DE LA GOTA = LA HOJA DEL CUADERNO; la cinta de 30 columnas
//                       BAJA y se posa sobre la hoja, a tamaño de tabla.
//                EXIT   cám z≈+93, pan -236/+40, rotateX -1,2° (ALTURA DEL BANCO) · luz `amber`, key
//                       corrida a 0,84 a la derecha · materia: LA LÍNEA DEL PROMEDIO se enrolla y ES
//                       EL FILAMENTO ENCENDIDO de la lámpara del banco  → así arranca `MovEstacion`.
//
// ═══════════════════════════════════════ LAS COSTURAS ═════════════════════════════════════════
// f118  costura INTERNA del acto 1 : ESCALA — la columna del DÍA 1 (22×105 px sobre la hoja) crece
//                        hasta ser el marco de 1520×855 con el patio soleado adentro. Lo que era una
//                        rayita del cuaderno se vuelve el decorado. (cierra en f166)
// f392  frontera 1→2 : MATERIA — LA SOMBRA DE LA NUBE cruza el cuadro de izquierda a derecha y detrás
//                        de su borde la MISMA toma ya es la del día nublado (clip 1 → clip 2 revelado
//                        por `clipPath` en diagonal, jamás por opacidad) + polvo/vapor de
//                        `SeamWipeMatter` montado en el borde. (cierra en f436)
// f748  frontera 2→3 : OCLUSIÓN — `SeamOcclude` con `V.sky` (la nube gris), dur 18. Cobertura total en
//                        f755: ahí se cambia el material al patio mojado. NUNCA con el color del fondo.
// f1090 frontera 3→4 : PORTAL / ZOOM-THROUGH — `zoomThrough(g, 1090, 22, 62, 56)`: la cámara entra en
//                        la GOTA del panel y sale en el blanco de la hoja del cuaderno. (cierra f1112)
// f1372 costura de SALIDA : MORFO — la línea del promedio se retrae hacia la derecha y sus últimos
//                        centímetros se enrollan en el FILAMENTO de la lámpara, que se enciende.
// (ninguna se repite, ninguna es un fade)
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, eio, rnd, rgba, gcam, light,
  VoltAtmos, PadPlane, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, SeamWipeMatter, zoomThrough, SeamFlash,
  Kick, Head, Body, Bed,
} from "./VoltStage";

// ── utilidades locales (todo función pura de gFrame) ────────────────────────────────────────
const seg = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ez = (g: number, a: number, b: number) => eio(0, 1, seg(g, a, b));
/** ventana con rampa de entrada y de salida (0 → 1 → 0), pura y determinista */
const win = (g: number, a: number, b: number, c: number, d: number) =>
  Math.max(0, Math.min(ez(g, a, b), 1 - ez(g, c, d)));

// ── frames maestros ─────────────────────────────────────────────────────────────────────────
const SEAM_ESC = 118;    // ESCALA  (interna del acto 1)
const SEAM_MAT = 392;    // MATERIA (frontera 1→2) — la sombra de la nube cruza
const SEAM_OCC = 748;    // OCLUSIÓN (frontera 2→3) — la nube gris tapa el cuadro
const SWAP_A3 = 755;     // instante de cobertura total de la oclusión
const SEAM_POR = 1090;   // PORTAL  (frontera 3→4) — entramos en la gota
const SEAM_FIL = 1372;   // MORFO de salida — la línea del promedio se vuelve filamento

// ── EL CUADERNO DE 30 DÍAS (dato duro: suma 7.140 Wh, promedio exacto 238) ──────────────────
// día 1 = 312 (sol pleno) · día 21 = 190 (nubes altas) · día 23 = 41 (gris de verdad) · 2 días de lluvia
const DIAS = [
  312, 298, 305, 289, 276, 301, 268, 292, 284, 258,
  271, 246, 263, 255, 288, 240, 279, 233, 262, 251,
  190, 176, 41, 38, 205, 168, 221, 212, 198, 220,
];
const MAXV = 312;
const PROM = 238;

// ── LA CINTA DE LAS TREINTA COLUMNAS — la materia que cruza TODAS las fronteras ─────────────
// Es un GRÁFICO (estructura), no un objeto real disfrazado: el protagonista de cada acto es el clip.
const Columnas: React.FC<{
  g: number; x: number; y: number; w: number; h: number;
  on: number; reveal: number;
  avgA: number; avgB: number; avgT: number; avgColor: string; sub: number;
  hot: (i: number) => number;
  tags: { i: number; txt: string; on: number }[];
}> = ({ g, x, y, w, h, on, reveal, avgA, avgB, avgT, avgColor, sub, hot, tags }) => {
  if (on <= 0.002) return null;
  const n = DIAS.length;
  const step = w / n;
  const bw = Math.max(4, step * 0.56);
  const yAvg = h * (PROM / MAXV);
  const spanW = Math.max(0, (avgB - avgA) * (w + 14));
  return (
    <div style={{
      position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
      width: w, height: h, marginLeft: -w / 2, marginTop: -h / 2, opacity: on,
    }}>
      {/* piso de la tabla: la línea del renglón del cuaderno */}
      <div style={{
        position: "absolute", left: -7, right: -7, bottom: -2, height: 2,
        background: `linear-gradient(90deg, ${rgba(V.white, 0.04)} 0%, ${rgba(V.white, 0.34)} 10%, ${rgba(V.white, 0.34)} 90%, ${rgba(V.white, 0.04)} 100%)`,
      }} />
      {DIAS.map((v, i) => {
        const ap = clamp01(reveal * (n + 4) - i);
        if (ap <= 0.001) return null;
        const k = hot(i);
        const breathe = 1 + Math.sin(g / 29 + i * 0.73) * 0.009;
        const hh = h * (v / MAXV) * ap * breathe;
        const left = Math.round(i * step + (step - bw) / 2);
        const base = rgba(V.voltSoft, 0.30 + 0.28 * (v / MAXV));
        return (
          <div key={i} style={{
            position: "absolute", left, bottom: 0, width: bw, height: hh, borderRadius: 2,
            background: k > 0.01
              ? `linear-gradient(180deg, ${rgba(V.volt, 0.72 + 0.28 * k)} 0%, ${rgba(V.volt, 0.44 + 0.4 * k)} 100%)`
              : base,
            boxShadow: k > 0.01 ? `0 0 ${Math.round(9 + 24 * k)}px ${rgba(V.volt, 0.5 * k)}` : "none",
          }} />
        );
      })}
      {/* LA LÍNEA DEL PROMEDIO — 238 Wh/día. Nace en f331 (cuando él lo dice) y en el acto 4 engorda */}
      {spanW > 1 && (
        <>
          <div style={{
            position: "absolute", left: Math.round(-7 + avgA * (w + 14)), bottom: yAvg,
            width: spanW, height: Math.max(2, Math.round(avgT)),
            background: `linear-gradient(90deg, ${rgba(avgColor, 0.08)} 0%, ${avgColor} 10%, ${avgColor} 90%, ${rgba(avgColor, 0.08)} 100%)`,
            boxShadow: `0 0 ${Math.round(12 + 30 * clamp01(avgT / 7))}px ${rgba(avgColor, 0.5)}`,
          }} />
          {/* el SUBRAYADO del promedio (acto 4): el trazo del lápiz debajo del número de verdad */}
          {sub > 0.01 && (
            <div style={{
              position: "absolute", left: Math.round(-7 + avgA * (w + 14) + 10), bottom: yAvg - 13,
              width: Math.max(0, (spanW - 20) * sub), height: 3,
              background: rgba(avgColor, 0.6), borderRadius: 2,
              transform: "rotate(-0.35deg)", transformOrigin: "0% 50%",
            }} />
          )}
        </>
      )}
      {/* las etiquetas de los días que él va nombrando (estructura del gráfico, no titular) */}
      {tags.map((t, j) => {
        if (t.on <= 0.02) return null;
        const v = DIAS[t.i];
        return (
          <div key={j} style={{
            position: "absolute", left: Math.round(t.i * step + step / 2), bottom: h * (v / MAXV) + 13,
            transform: "translateX(-50%)", opacity: t.on, whiteSpace: "nowrap",
            fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 33, letterSpacing: 1.2,
            color: V.volt, textShadow: `0 3px 16px ${rgba(V.ink0, 0.95)}`,
          }}>{t.txt}</div>
        );
      })}
    </div>
  );
};

// ── EL FILAMENTO — la línea recta del promedio enrollándose dentro de la lámpara ────────────
// `t`=0 es la recta que traía la línea del promedio; `t`=1 es la bobina encendida.
const filPath = (t: number) => {
  const N = 27;
  let d = "";
  for (let i = 0; i < N; i++) {
    const u = i / (N - 1);
    // el estado RECTO calza al pixel con el último tramo de la línea del promedio: termina justo
    // en su punta derecha (viewBox x=150 = 74,8 % de pantalla) y a su misma altura (y=80 = 49 %).
    const xs = lerp(0, 150, u);
    const xc = lerp(112, 188, u);                                 // bobina comprimida al centro
    const ys = 80;
    const yb = 48 + Math.sin(u * Math.PI * 7) * 26 * Math.sin(Math.PI * clamp01(u * 1.02));
    d += (i === 0 ? "M " : "L ") + lerp(xs, xc, t).toFixed(1) + " " + lerp(ys, yb, t).toFixed(1) + " ";
  }
  return d.trim();
};

// ── TITULAR (una idea de texto por acto, sobre cama oscura) ──────────────────────────────────
const Titular: React.FC<{
  g: number; inF: number; outF: number; kick: string; head: string; sub?: string;
  size?: number; kickColor?: string;
}> = ({ g, inF, outF, kick, head, sub, size = 74, kickColor = V.volt }) => {
  const a = Math.min(ez(g, inF, inF + 16), 1 - ez(g, outF, outF + 18));
  if (a <= 0.001) return null;
  const dy = (1 - ez(g, inF, inF + 22)) * 26;
  return (
    <div style={{
      position: "absolute", left: 62, bottom: 150, maxWidth: 1040,
      opacity: a, transform: `translateY(${dy.toFixed(1)}px)`,
    }}>
      <Bed pad={28}>
        <div style={{ marginBottom: 10 }}><Kick color={kickColor}>{kick}</Kick></div>
        <Head size={size}>{head}</Head>
        {sub ? <div style={{ marginTop: 12 }}><Body size={31}>{sub}</Body></div> : null}
      </Bed>
    </div>
  );
};

// ── EL MOVIMIENTO ────────────────────────────────────────────────────────────────────────────
export const MovTreintaDias: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const frame = useCurrentFrame();
  // `acto` lo manda el build: red de seguridad si gFrame llegara sin arrancar.
  const gRaw = Math.max(0, gFrame);
  const g = gRaw > 0 ? gRaw : Math.max(0, (Math.min(Math.max(acto, 1), 4) - 1) * 372);
  // los helpers del Stage (`Readout`, `SeamOcclude`, `SeamFlash`, `sheenAt`) miden con
  // useCurrentFrame; `at()` los ancla EXACTAMENTE a MI frame global.
  const off = frame - g;
  const at = (f: number) => f + off;

  // ── LA CÁMARA: UNA sola, función de g, acumulativa. Ningún acto la reinicia ────────────────
  const base = gcam(g, { z0: -20, z1: 112, panX: -48, panY: -26, ry: -5.2, rx: 1.4, dur: 1450 });
  const zAcc =
    eio(0, 74, seg(g, SEAM_ESC, 210)) +          // la escala nos mete adentro del patio
    eio(0, 38, seg(g, SEAM_MAT, 500)) +          // la inercia no se entera de que se nubló
    eio(0, 62, seg(g, SEAM_OCC, 900)) +          // acercamiento a la gota
    eio(0, -150, seg(g, 1096, 1264)) +           // salimos del portal lejos y nos asentamos
    eio(0, 46, seg(g, SEAM_FIL, 1490));          // el último empuje hacia la lámpara
  const pxAcc =
    eio(0, 34, seg(g, SEAM_ESC, 232)) +
    eio(0, -48, seg(g, SEAM_OCC, 940)) +
    eio(0, 44, seg(g, 1096, 1300)) +
    eio(0, -236, seg(g, 1368, 1494));            // la lámpara entra al centro del cuadro
  const pyAcc =
    eio(0, -20, seg(g, SEAM_ESC, 232)) +
    eio(0, 26, seg(g, SEAM_MAT, 540)) +
    eio(0, -16, seg(g, SEAM_OCC, 940)) +
    eio(0, 20, seg(g, 1096, 1300)) +
    eio(0, 40, seg(g, 1368, 1494));              // bajamos a la altura del banco
  // el CENITAL de entrada (heredado de MovAngulo) se acuesta, vuelve para el cuaderno y se acuesta
  // definitivamente en la altura del banco de trabajo.
  const rxAcc =
    8.5 - eio(0, 8.5, seg(g, 54, 214)) +
    eio(0, 6.2, seg(g, 1096, 1268)) +
    eio(0, -7.4, seg(g, 1352, 1492));
  const cam =
    `${base.transform} translate3d(${pxAcc.toFixed(2)}px, ${pyAcc.toFixed(2)}px, ${zAcc.toFixed(2)}px) ` +
    `rotateX(${rxAcc.toFixed(3)}deg)`;

  // ── LA LUZ: EVOLUCIONA, nunca salta. volt (papel) → white (sol duro) → sky (nubes) →
  //    concrete (gris de verdad) → amber (el filamento). Cada tramo arranca donde terminó el anterior.
  const tintKey =
    g < 344 ? light(seg(g, 0, 206), "volt", "white")
      : g < 782 ? light(seg(g, 344, 706), "white", "sky")
        : g < 1142 ? light(seg(g, 782, 986), "sky", "concrete")
          : light(seg(g, 1142, 1436), "concrete", "amber");
  const tintWarm = light(seg(g, 1090, 1420), "orange", "amber");
  const keyFrom =
    0.30 + eio(0, 0.22, seg(g, 0, 226)) + eio(0, -0.10, seg(g, SEAM_MAT, 700))
    + eio(0, 0.06, seg(g, SEAM_OCC, 1000)) + eio(0, 0.36, seg(g, 1290, 1480));
  const intensity =
    0.86 + eio(0, 0.20, seg(g, 40, 300)) + eio(0, -0.30, seg(g, SEAM_MAT, 700))
    + eio(0, -0.14, seg(g, SEAM_OCC, 950)) + eio(0, 0.16, seg(g, 1096, 1290))
    + eio(0, 0.28, seg(g, 1380, 1492));

  // el SOL: duro en el acto 1, se apaga bajo las nubes, no vuelve. Después manda el filamento.
  const solP = clamp01(
    0.18 + eio(0, 0.86, seg(g, 24, 200)) + eio(0, -0.62, seg(g, SEAM_MAT, 520))
    + eio(0, -0.34, seg(g, SEAM_OCC, 880)),
  ) * (0.96 + Math.sin(g / 71) * 0.04);
  // el VELO GRIS: entra con las nubes y no se va hasta que volvemos al papel
  const veloP = clamp01(eio(0, 0.62, seg(g, SEAM_MAT, 560)) + eio(0, 0.30, seg(g, SEAM_OCC, 900))
    - eio(0, 0.86, seg(g, 1096, 1300)));
  const lluvia = win(g, 762, 840, 1058, 1096);

  // ── LA CINTA DE 30 COLUMNAS: nace sobre la hoja, sube a cinta, y en el acto 4 vuelve a la hoja ──
  const cm = ez(g, 104, 198);                                   // hoja → cinta
  const c4 = ez(g, 1116, 1222);                                 // cinta → tabla sobre el cuaderno
  const CX = lerp(lerp(50, 44, cm), 42, c4);
  const CY = lerp(lerp(50, 23, cm), 57, c4);
  const CW = lerp(lerp(980, 900, cm), 1260, c4);
  const CH = lerp(lerp(300, 112, cm), 330, c4);
  const colOn = ez(g, 92, 128);
  const reveal = ez(g, 96, 208);
  const avgB = ez(g, 331, 398);                                 // f331: «el promedio de los 30 días»
  const avgA = ez(g, SEAM_FIL, 1456);                           // se retrae hacia la derecha: MORFO
  const avgT = 2 + 5 * ez(g, 1150, 1236);
  const avgColor = light(seg(g, 1330, 1462), "volt", "amber");
  const subray = ez(g, 1206, 1290);
  const hot = (i: number) => {
    let a = 0;
    if (i === 0) a = Math.max(a, win(g, 58, 88, 366, 398));
    if (i === 20) a = Math.max(a, win(g, 157, 178, 230, 252), win(g, 398, 424, 720, 748));
    if (i === 22) a = Math.max(a, win(g, 249, 270, 314, 336), win(g, 760, 784, 1060, 1088));
    // acto 4: un barrido de luz recorre las treinta columnas, de la primera a la última
    a = Math.max(a, 0.55 * win(g, 1146 + i * 2.7, 1182 + i * 2.7, 1478, 1500));
    return clamp01(a);
  };
  const tags = [
    { i: 0, txt: "312", on: win(g, 62, 92, 360, 392) * (1 - c4) },
    { i: 20, txt: "190", on: Math.max(win(g, 160, 182, 228, 250), win(g, 402, 428, 718, 746)) * (1 - c4) },
    { i: 22, txt: "41", on: Math.max(win(g, 252, 274, 312, 334), win(g, 764, 788, 1058, 1086)) * (1 - c4) },
  ];

  // ── EL MATERIAL REAL: el MISMO encuadre del patio en los tres días ────────────────────────
  // La columna del día 1 (22×105 px sobre la hoja) CRECE hasta ser el marco. ESCALA, no un fade.
  const esc = ez(g, SEAM_ESC, 166);
  const cardW = Math.round(lerp(22, 1520, esc) * lerp(1, 1.09, ez(g, SEAM_OCC, 1000)));
  const cardH = Math.round(cardW * 0.5625);
  const cardX = lerp(29.6, 50, esc);
  const cardY = lerp(52, 47, esc);
  const cardRy = lerp(10, 0.4, ez(g, SEAM_ESC, 250)) + lerp(0, 4.2, ez(g, SEAM_OCC, 1020));
  // la cuña de la SOMBRA DE LA NUBE que cruza y revela el día nublado detrás de su borde
  // ⛔ el polígono tiene que ser un cuadrilátero SANO en todos los frames (un borde izquierdo fijo
  // fuera de cuadro y el derecho en diagonal): un polygon auto-cruzado clipea distinto por motor.
  const wp = lerp(-24, 128, ez(g, SEAM_MAT, 436));
  const wipeClip = g >= SEAM_MAT + 44
    ? "none"
    : `polygon(-40% 0%, ${wp.toFixed(2)}% 0%, ${(wp - 13).toFixed(2)}% 100%, -40% 100%)`;
  // el PORTAL: entramos en la gota del panel (62% / 56% del cuadro)
  const zt = zoomThrough(g, SEAM_POR, 22, 62, 56);
  const a1On = g < SEAM_MAT + 46;
  const a2On = g >= SEAM_MAT - 2 && g < SWAP_A3;
  const a3On = g >= SWAP_A3 && g < SEAM_POR + 24;
  const a4On = g >= 1096;
  const gota = win(g, 1006, 1064, SEAM_POR + 10, SEAM_POR + 18);

  // el cuaderno del final: la hoja entera con vida (el lápiz subrayando)
  const nbW = Math.round(lerp(1560, 1280, ez(g, SEAM_FIL, 1494)));
  const nbH = Math.round(nbW * 0.5625);
  const nbX = lerp(42, 32, ez(g, SEAM_FIL, 1494));
  const nbY = lerp(57, 66, ez(g, SEAM_FIL, 1494));

  // la LÁMPARA del banco: el filamento se enciende y es lo que le entrego a `MovEstacion`
  const filT = ez(g, 1392, 1482);
  const lampOn = ez(g, 1376, 1408);
  const lampSize = Math.round(lerp(148, 246, ez(g, 1376, 1490)));
  const glow = clamp01(ez(g, 1400, 1486)) * (0.9 + Math.sin(g / 9) * 0.1);

  // el plano profundo SIEMPRE tiene imagen (rutas como literal string: el build escanea por texto)
  const bgSrc =
    g < 158 ? "img/cmetemu/cmet_mv_dias4.jpg"
      : g < 436 ? "img/cmetemu/cmet_mv_dias1.jpg"
        : g < SWAP_A3 ? "img/cmetemu/cmet_mv_dias2.jpg"
          : g < 1096 ? "img/cmetemu/cmet_mv_dias3.jpg"
            : "img/cmetemu/cmet_mv_dias4.jpg";

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez y NUNCA se remonta entre actos ── */}
      <VoltAtmos tint={tintKey} tint2={tintWarm} keyFrom={keyFrom} intensity={intensity} floor={0.58} />

      <Layers cam={cam}>
        {/* P1 · el plano profundo: la misma escena, fuera de foco y apagada (parallax propio) */}
        <PhotoPlane
          src={bgSrc} kind="photo" z={-620} scale={1.32}
          dim={lerp(0.52, 0.78, ez(g, 200, SEAM_OCC))} tint={tintKey}
        />

        {/* P2 · LA LUZ DEL DÍA: el sol duro de la mañana y el velo gris que lo apaga */}
        <Plane z={-420}>
          <div style={{
            position: "absolute", left: "16%", top: "-14%", width: 1180, height: 1180,
            marginLeft: -590, borderRadius: "50%", mixBlendMode: "screen",
            background: `radial-gradient(circle, ${rgba(V.white, 0.30 * solP)} 0%, ${rgba(V.amber, 0.13 * solP)} 26%, rgba(0,0,0,0) 64%)`,
          }} />
          {/* el haz duro que entra en diagonal cuando el sol pega vertical */}
          <div style={{
            position: "absolute", left: "8%", top: "-8%", width: 1520, height: 980,
            transformOrigin: "0% 0%", transform: "rotate(31deg)", mixBlendMode: "screen",
            clipPath: "polygon(0% 42%, 100% 0%, 100% 100%, 0% 58%)",
            background: `linear-gradient(90deg, ${rgba(V.white, 0.14 * solP)} 0%, rgba(0,0,0,0) 72%)`,
          }} />
          {/* EL VELO: la luz sin dirección de un cielo cerrado */}
          <AbsoluteFill style={{
            background: `linear-gradient(184deg, ${rgba(V.sky, 0.22 * veloP)} 0%, ${rgba(V.sky, 0.07 * veloP)} 52%, rgba(0,0,0,0) 100%)`,
          }} />
        </Plane>

        {/* P3 · EL PISO DEL PATIO: el hormigón que corre del garaje al pasto */}
        <Plane z={-250}>
          <PadPlane y={79} w={1500} h={330} rx={63} lit={0.4 + 0.6 * clamp01(solP + 0.24)} z={-40} />
        </Plane>

        {/* P4 · EL MATERIAL REAL — el MISMO encuadre del patio, tres días distintos ── */}
        <Plane z={-40}>
          {/* ACTO 1 · el patio a pleno sol. Nace de la columna del día 1 (ESCALA) y se va bajo la nube */}
          {a1On && (
            <MediaCard
              src="broll/cmetemu/cmet_mv_dias1.mp4" kind="video"
              w={cardW} h={cardH} x={cardX} y={cardY} z={0}
              ry={cardRy} rx={lerp(-4, 0, esc)} radius={Math.round(lerp(3, 16, esc))}
              startFrom={5} lit={0.55 + 0.45 * ez(g, SEAM_ESC, 210)} litColor={tintKey}
              sheenAt={at(190)}
            />
          )}

          {/* ACTO 2 · MISMO marco, MISMA escala, MISMO encuadre: sólo cambió la luz.
              Lo revela el borde de la sombra de la nube, jamás una opacidad. */}
          {a2On && (
            <AbsoluteFill style={{ clipPath: wipeClip }}>
              <MediaCard
                src="broll/cmetemu/cmet_mv_dias2.mp4" kind="video"
                w={cardW} h={cardH} x={cardX} y={cardY} z={0}
                ry={cardRy} rx={0} radius={16}
                startFrom={7} lit={0.86 - 0.16 * ez(g, 470, SEAM_OCC)} litColor={tintKey}
                sheenAt={at(452)}
              />
            </AbsoluteFill>
          )}

          {/* ACTO 4 · salimos DENTRO de la gota y su blanco ES la hoja del cuaderno.
              ⛔ VA ANTES DEL ACTO 3 EN EL DOM: el portal atraviesa el acto 3, así que el 3 tiene que
              quedar POR DELANTE mientras se agranda y se va. */}
          {a4On && (
            <AbsoluteFill style={{
              transform: `scale(${lerp(2.9, 1, ez(g, 1096, 1200)).toFixed(3)})`,
              transformOrigin: "50% 46%",
            }}>
              <MediaCard
                src="broll/cmetemu/cmet_mv_dias4.mp4" kind="video"
                w={nbW} h={nbH} x={nbX} y={nbY} z={0}
                ry={lerp(-3.4, 2.6, ez(g, 1110, 1460))} rx={lerp(3, 0, ez(g, 1110, 1300))}
                radius={14} startFrom={6} lit={0.94} litColor={tintKey}
                sheenAt={at(1150)}
              />
            </AbsoluteFill>
          )}

          {/* ACTO 3 · el mismo patio, mojado y apagado. Sale por el PORTAL de la gota. */}
          {a3On && (
            <AbsoluteFill style={{
              transform: zt.out, opacity: clamp01(zt.opacity), transformOrigin: "62% 56%",
            }}>
              <MediaCard
                src="broll/cmetemu/cmet_mv_dias3.mp4" kind="video"
                w={cardW} h={cardH} x={cardX} y={cardY} z={0}
                ry={cardRy} rx={0} radius={16}
                startFrom={4} lit={0.62} litColor={tintKey}
                sheenAt={at(806)}
              />
              {/* LA GOTA: el punto por el que entra la cámara (es luz sobre el material, no un objeto) */}
              {gota > 0.01 && (
                <>
                  <div style={{
                    position: "absolute", left: "62%", top: "56%", width: 54, height: 54,
                    marginLeft: -27, marginTop: -27, borderRadius: "50%", opacity: gota,
                    background: `radial-gradient(circle at 36% 30%, ${rgba(V.white, 0.82)} 0%, ${rgba(V.sky, 0.30)} 34%, rgba(0,0,0,0) 72%)`,
                    boxShadow: `0 0 26px ${rgba(V.white, 0.34 * gota)}`,
                  }} />
                  <div style={{
                    position: "absolute", left: "62%", top: "56%", width: 210, height: 210,
                    marginLeft: -105, marginTop: -105, borderRadius: "50%", opacity: gota * 0.7,
                    background: `radial-gradient(circle, ${rgba(V.white, 0.14)} 0%, rgba(0,0,0,0) 66%)`,
                  }} />
                </>
              )}
            </AbsoluteFill>
          )}
        </Plane>

        {/* P5 · EL GRÁFICO: las treinta columnas que cruzan TODAS las fronteras + el filamento ── */}
        <Plane z={20}>
          <Columnas
            g={g} x={CX} y={CY} w={CW} h={CH}
            on={colOn * (1 - 0.55 * win(g, SEAM_POR, SEAM_POR + 16, SEAM_POR + 20, SEAM_POR + 40))}
            reveal={reveal}
            avgA={avgA} avgB={avgB} avgT={avgT} avgColor={avgColor} sub={subray}
            hot={hot} tags={tags}
          />

          {/* MORFO DE SALIDA: los últimos centímetros de la línea del promedio se enrollan y
              son EL FILAMENTO de la lámpara del banco, que se enciende en ámbar. */}
          {lampOn > 0.01 && (
            <>
              <div style={{
                position: "absolute", left: "74.8%", top: "49%", width: 520, height: 520,
                marginLeft: -260, marginTop: -260, borderRadius: "50%", mixBlendMode: "screen",
                background: `radial-gradient(circle, ${rgba(V.amber, 0.44 * glow)} 0%, ${rgba(V.amber, 0.14 * glow)} 32%, rgba(0,0,0,0) 68%)`,
              }} />
              <IconPng src="img/cmetemu/cmet_ic_lampara.png" x={74.8} y={49} size={lampSize}
                z={0} opacity={lampOn} glow={V.ink0} />
              <svg viewBox="0 0 300 160" style={{
                position: "absolute", left: "74.8%", top: "49%", width: 300, height: 160,
                marginLeft: -150, marginTop: -80, overflow: "visible", opacity: lampOn,
              }}>
                <path d={filPath(filT)} fill="none" stroke={rgba(avgColor, 0.26 + 0.4 * glow)}
                  strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
                <path d={filPath(filT)} fill="none" stroke={avgColor}
                  strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round"
                  style={{ filter: `drop-shadow(0 0 ${Math.round(6 + 16 * glow)}px ${rgba(V.amber, 0.85)})` }} />
              </svg>
            </>
          )}
        </Plane>

        {/* P6 · PRIMER PLANO: lo que hay en el aire de cada día (hold VIVO permanente) ── */}
        <Plane z={220}>
          {/* polvo del patio bajo el sol duro */}
          {Array.from({ length: 15 }, (_, i) => {
            const sp = 0.4 + rnd(i * 4.7) * 1.1;
            const yy = ((rnd(i * 8.3) * 130 - (g * sp) / 24) % 130 + 130) % 130 - 12;
            const s = 2 + rnd(i * 2.9) * 3.2;
            return (
              <div key={`d${i}`} style={{
                position: "absolute", left: `${(8 + rnd(i * 6.1) * 84).toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
                width: s, height: s, borderRadius: "50%",
                background: rgba(V.white, (0.08 + rnd(i * 3.7) * 0.2) * clamp01(solP)),
                boxShadow: `0 0 ${Math.round(5 + s * 3)}px ${rgba(V.white, 0.18 * clamp01(solP))}`,
              }} />
            );
          })}
          {/* la llovizna del día gris: cae delante del panel, delante de la cámara */}
          {lluvia > 0.01 && Array.from({ length: 26 }, (_, i) => {
            const sp = 7 + rnd(i * 4.1) * 8;
            const yy = ((rnd(i * 7.3) * 132 + (g * sp) / 9) % 132) - 16;
            const hgt = 22 + rnd(i * 9.4) * 40;
            return (
              <div key={`r${i}`} style={{
                position: "absolute", left: `${(2 + rnd(i * 5.9) * 96).toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
                width: 2, height: hgt, transform: "rotate(8deg)", borderRadius: 2,
                background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${rgba(V.sky, 0.34 * lluvia)} 50%, rgba(0,0,0,0) 100%)`,
              }} />
            );
          })}
        </Plane>
      </Layers>

      {/* ── LAS COSTURAS (encima de todo, ninguna es un fade) ── */}
      {/* f392 · MATERIA: el polvo/vapor que viaja en el borde de la sombra de la nube */}
      <SeamWipeMatter at={at(SEAM_MAT)} dur={44} tint={V.sky} />
      {/* f748 · OCLUSIÓN: la nube gris tapa el cuadro entero (color de la MATERIA, no del fondo) */}
      <SeamOcclude at={at(SEAM_OCC)} dur={18} color={V.sky} angle={-6} lit={0.3} />
      {/* f1090 · PORTAL: el destello óptico de atravesar la gota (6 frames, no un fundido) */}
      <SeamFlash at={at(SEAM_POR + 16)} color={V.white} dur={6} />
      {/* f1408 · la lámpara prende: es la luz del evento, no una costura */}
      <SeamFlash at={at(1408)} color={V.amber} dur={9} />

      {/* ── TIPOGRAFÍA Y CIFRAS: plano plano, fuera de la perspectiva, safe area 60 px ── */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {/* LAS CIFRAS DEL CUADERNO — siempre sobre material real, nunca sobre fondo plano */}
        {g >= 74 && g < 396 && (
          <div style={{ opacity: Math.min(1, 1 - ez(g, 360, 394)) }}>
            <Readout value="312" unit="Wh" label="DÍA 1 · SOL PLENO" at={at(76)}
              x={76} y={62} size={166} color={V.volt} />
          </div>
        )}
        {g >= 420 && g < 748 && (
          <div style={{ opacity: Math.min(1, 1 - ez(g, 712, 746)) }}>
            <Readout value="190" unit="Wh" label="DÍA 21 · NUBES ALTAS" at={at(422)}
              x={76} y={62} size={158} color={V.volt} />
          </div>
        )}
        {g >= 784 && g < 1088 && (
          <div style={{ opacity: Math.min(1, 1 - ez(g, 1054, 1086)) }}>
            <Readout value="41" unit="Wh" label="DÍA 23 · GRIS DE VERDAD" at={at(786)}
              x={76} y={62} size={180} color={V.volt} />
          </div>
        )}
        {g >= 1184 && g < 1410 && (
          <div style={{ opacity: Math.min(1, 1 - ez(g, 1374, 1408)) }}>
            <Readout value="238" unit="Wh/día" label="PROMEDIO DE 30 DÍAS" at={at(1186)}
              x={66} y={25} size={162} color={V.volt} />
          </div>
        )}

        <Titular g={g} inF={186} outF={352} kick="DÍA 1 · VERANO, BIEN INCLINADO"
          head="TRESCIENTOS DOCE" sub="Vatios hora en un día bueno." kickColor={V.amber} />
        <Titular g={g} inF={452} outF={704} kick="DÍA 21 · NUBES ALTAS"
          head="CIENTO NOVENTA" sub="Mismo patio, misma inclinación. Otra luz." />
        <Titular g={g} inF={806} outF={1030} kick="DÍA 23 · CIELO CERRADO"
          head="CUARENTA Y UNO" sub="El mismo panel, el mismo ángulo, un día gris." />
        <Titular g={g} inF={1200} outF={1436} kick="PROMEDIO DE 30 DÍAS"
          head="DOSCIENTOS TREINTA Y OCHO" size={62}
          sub="El número de verdad de un panel de 100 W." />

        {/* f1030 · «te la dejo anotada en la descripción» — nota discreta, ya sin titular en cuadro */}
        {g >= 1040 && g < 1110 && (
          <div style={{
            position: "absolute", right: 64, bottom: 84, width: 540, textAlign: "right",
            opacity: Math.min(ez(g, 1040, 1064), 1 - ez(g, 1088, 1110)),
          }}>
            <Bed pad={22}>
              <Kick color={V.amber}>HORAS DE SOL ÚTIL · ZONA POR ZONA</Kick>
              <div style={{ marginTop: 8 }}><Body size={30}>Te la dejo anotada en la descripción.</Body></div>
            </Bed>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// MovDinero.tsx — EL MOVIMIENTO DE LOS NÚMEROS · `clembudo` (El Constructor Libre)
// 873 frames @30fps (29,1 s) · desde_s 457,2 · luz 0,25 → 0,50 (día frío de ventana → ámbar de billete)
//
// IDEA RECTORA: los números son los protagonistas y ATERRIZAN. El 160 cae y golpea la mesa; el −20 y
// el −12 le ROMPEN un pedazo a la barra de dinero, el pedazo se cae del cuadro girando, y lo que
// queda se vuelve a estampar como 128. La resta es una OPERACIÓN FÍSICA, no texto que cambia.
//
// ═══ QUÉ CAMBIÓ EN LA REHECHURA (sep-2026) — este movimiento tenía CUATRO defectos ══════════════
//  D1 · TARJETAS APLASTADAS A UNA TIRA (480 s). CAUSA MEDIDA: la barra de dinero era un contenedor
//       de `794×206` (val × PPU de ancho, alto fijo) y adentro se le metía una FOTO con
//       `objectFit:cover`. Un 3,85:1 comiéndose material 16:9 recorta a una franja y corta cabezas.
//       REGLA NUEVA, y es estructural: **una barra es una barra** — materia sólida, cuero y oliva,
//       sin foto adentro. El material real vive en su propia `<Plate/>`, que deriva el alto del
//       ancho por 16:9 y no puede aplastarse. Las dos cosas conviven, ninguna deforma a la otra.
//  D3 · TEXTO CORTADO ("La visita dura 40 minutos" se leía "0 minutos"). El texto vivía DENTRO de
//       la cámara: con `scale(z)` > 1 la perspectiva lo agranda y el margen de mundo no es el
//       margen de pantalla. Ahora todo el texto va en `<Lower/>`, espacio de pantalla, anclado por
//       bottom/left en píxeles reales.
//  D4 · FANTASMA DE DOBLE EXPOSICIÓN. La profundidad se resolvía con `opacity` sobre tarjetas con
//       foto adentro → se veía el b-roll a través. Ahora `<Plate dim={}/>`: velo negro ADENTRO de
//       una tarjeta que siempre es opaca.
//  D6 · TARJETA PLACEHOLDER VACÍA (la tarjeta verde de WhatsApp con renglones vacíos, que se leía
//       como asset roto). Era una maqueta de chat dibujada en CSS. Ahora el teléfono es el material
//       REAL (s401: el teléfono en la mano con las fotos de la pared) y las dos fotos que manda el
//       vecino son las fotos de verdad (s435 y s421). ⛔ Ninguna tarjeta de este movimiento es
//       forma + texto: todas llevan foto o clip adentro.
//
// ════════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF  (enterFrom → exitTo por acto; el acto N arranca EXACTO donde terminó el N−1)
// ════════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 1 · f0–145 · "Eso es el trabajo. Ahora hablemos del dinero."          [AVATAR VISIBLE]
//   enterFrom cam {z 1.03, panX +14, panY  +8, ry +2.4, rx  0.0}  luz 0.250
//             materia: — (del MovCuatroPasos: el galpón, cuadro limpio)
//   exitTo    cam {z 1.05, panX  −4, panY  +5, ry +1.6, rx +0.2}  luz 0.272
//             materia: LA TARJETA DE LOS BILLETES (s405), abajo a la derecha, con su clip corriendo
//
//   ── FRONTERA 1 @f146 · MATCH-SHAPE ──────────────────────────────────────────────────────────
//   La MISMA tarjeta (un solo objeto, geometría continua, mismo 16:9) viaja al centro y crece
//   hasta ser la tarjeta del teléfono. El material de adentro se cambia con un WIPE DESCENDENTE
//   (f142–158) — una cortina de materia, ⛔ nunca un fade.
//
// ACTO 2 · f146–409 · "Entra por WhatsApp… cuatro preguntas y dos fotos… sin salir de tu casa."
//   enterFrom cam {z 1.05, panX  −4, panY  +5, ry +1.6, rx +0.2}  luz 0.272
//             materia: la tarjeta de los billetes, ya convertida en la del teléfono
//   exitTo    cam {z 1.10, panX −34, panY  −2, ry +0.8, rx −0.4}  luz 0.350
//             materia: LA FOTO DE LA MANCHA (s435) que mandó el vecino, ya en héroe
//
//   ── FRONTERA 2 @f410 · ZOOM-THROUGH ─────────────────────────────────────────────────────────
//   La cámara entra POR esa foto: la Plate escala ×7,5 y se va por el lente, y del otro lado está
//   la MISMA pared, pero real y con el medidor encima (s403). Foto dentro del teléfono → cuadro
//   completo. La materia que cruza es literalmente la misma pared.
//
// ACTO 3 · f410–504 · "La visita dura cuarenta minutos."
//   enterFrom cam {z 1.10, panX −34, panY  −2, ry +0.8, rx −0.4}  luz 0.350
//             materia: la pared manchada, ahora real, con el medidor
//   exitTo    cam {z 1.16, panX −34, panY  −6, ry +0.2, rx −0.8}  luz 0.392
//             materia: la mesa del presupuesto entrando por abajo (s436)
//
//   ── FRONTERA 3 @f505 · OCLUSIÓN ─────────────────────────────────────────────────────────────
//   El DELANTAL DE CUERO cruza el lente y tapa el 100 % ~5 frames, centrado en el frame del swap.
//   ⛔ La banda NO lleva el color del fondo (eso no ocluye: hace un fundido a negro). Es cuero
//   (#B5854F, luma ≈131) entre dos planos de luma media parecida: ni pozo ni flash.
//
// ACTO 4 · f505–758 · "Se cobró 160. Materiales 20, transporte 12. Quedaron 128 limpios."
//   enterFrom cam {z 1.16, panX −34, panY  −6, ry +0.2, rx −0.8}  luz 0.392
//             materia: el cuero deja la MESA DEL PRESUPUESTO y la barra de dinero apoyada encima
//   exitTo    cam {z 1.21, panX  +4, panY +20, ry −0.6, rx +0.8}  luz 0.470
//             materia: LA BARRA DE 128 (ya rota dos veces) y la tarjeta de los billetes en la palma
//
//   ── FRONTERA 4 @f759 · MATCH-MOVE ───────────────────────────────────────────────────────────
//   Nada corta: la cámara ya venía subiendo y abriéndose. La barra de 128 sigue ese mismo vector
//   hacia abajo-izquierda y se vuelve el escalón de abajo, mientras la de 290 entra desde la
//   derecha a la misma velocidad. La mesa NO se remonta: es el mismo plano, sólo más cálido.
//
// ACTO 5 · f759–872 · "El siguiente, con extractor incluido, doscientos noventa."
//   enterFrom cam {z 1.21, panX  +4, panY +20, ry −0.6, rx +0.8}  luz 0.470
//             materia: la barra de 128 bajando a escalón
//   exitTo    cam {z 1.12, panX −48, panY +90, ry −1.8, rx +0.2}  luz 0.500
//             materia: el escalón de arriba cortado por el borde superior ("y hay más arriba"),
//             que es con lo que abre el MovCaso35
//
// COSTURAS EN ORDEN: MATCH-SHAPE · ZOOM-THROUGH · OCLUSIÓN · MATCH-MOVE
// (⛔ ninguna es un fade · ⛔ no hay dos seguidas iguales)
//
// ⛔ Los clips duran 5,04 s (151 f): ninguna Sequence de clip pasa de 150 frames. Cero `loop`.
// ⛔ Math.random / Date.now: cero. ⛔ backdrop-filter: cero. ⛔ <Video>: cero.
// ════════════════════════════════════════════════════════════════════════════════════════════════
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  Atmos, Backplate, C, FONT, Ground, Ink, Kick, Lower, LowerBed, Mat, Occluder, Paper, Plate, fitCx,
  cam, camStyle, luz, rampIn, rng,
} from "./Stage";

const DUR = 873;

// ── frames de los actos (timestamps REALES de Whisper, ×30 desde 457,2 s) ───────────────────────
const A2 = 146;   // 462,06 "entra por WhatsApp de un grupo de vecinos"
const A3 = 410;   // 471,54 "la visita dura 40 minutos" (el texto entra en f432, con la frase)
const A4 = 505;   // 474,04 "ese se cobró 160"
const A5 = 759;   // 482,48 "el siguiente, con extractor incluido, 290"

const EZ = Easing.bezier(0.22, 0.61, 0.24, 1);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const ramp = (f: number, a: number, b: number, e = EZ) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });

type CamK = { z: number; panX: number; panY: number; ry: number; rx: number };
const LEGS: Array<[number, CamK]> = [
  [0,   { z: 1.03, panX:  14, panY:   8, ry:  2.4, rx:  0.0 }],
  [A2,  { z: 1.05, panX:  -4, panY:   5, ry:  1.6, rx:  0.2 }],
  [A3,  { z: 1.10, panX: -34, panY:  -2, ry:  0.8, rx: -0.4 }],
  [A4,  { z: 1.16, panX: -34, panY:  -6, ry:  0.2, rx: -0.8 }],
  [A5,  { z: 1.21, panX:   4, panY:  20, ry: -0.6, rx:  0.8 }],
  [DUR, { z: 1.12, panX: -48, panY:  90, ry: -1.8, rx:  0.2 }],
];
const camAt = (f: number): CamK => {
  let i = 0;
  for (let j = 0; j < LEGS.length - 1; j++) if (f >= LEGS[j][0]) i = j;
  const [fa, A] = LEGS[i];
  const [fb, B] = LEGS[i + 1];
  const k = ramp(f, fa, fb);
  const d = cam(f, DUR);
  return {
    z: lerp(A.z, B.z, k) * d.z,
    panX: lerp(A.panX, B.panX, k) + d.panX,
    panY: lerp(A.panY, B.panY, k) + d.panY,
    ry: lerp(A.ry, B.ry, k),
    rx: lerp(A.rx, B.rx, k),
  };
};

// ── LA BARRA DE DINERO ──────────────────────────────────────────────────────────────────────────
// ⛔⛔ UNA BARRA ES UNA BARRA: materia sólida (cuero y oliva, con el canto de los billetes), y NO
// lleva foto adentro. Ése fue el defecto D1 — un contenedor de 3,85:1 recortando material 16:9.
// El material real de este acto vive en su propia <Plate/>, al lado, con su 16:9 intacto.
const PPU = 3.55;              // px de mundo por dólar
const BAR_X = 296;             // borde izquierdo (mundo). El texto NO vive acá: vive en pantalla.
const BAR_Y = 636;
const BAR_H = 104;

const Barra: React.FC<{ w: number; y?: number; sc?: number; alto?: number }> = ({ w, y = BAR_Y, sc = 1, alto = BAR_H }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute", left: BAR_X, top: y, width: Math.max(2, w), height: alto * sc,
        transform: `translateZ(60px) scaleY(1)`, transformOrigin: "0% 100%",
        borderRadius: 7, overflow: "hidden",
        background: "linear-gradient(178deg, #C49A5F 0%, #A9794A 44%, #7E5730 100%)",
        boxShadow: "0 16px 40px rgba(22,15,8,0.54), inset 0 2px 0 rgba(255,240,206,0.55), inset 0 -3px 0 rgba(30,20,10,0.45)",
      }}
    >
      {/* el canto de los billetes apilados: ritmo de materia, no un degradé plano */}
      {new Array(46).fill(0).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute", left: 9 + i * 26, top: 0, bottom: 0, width: 1.5,
            background: `rgba(46,30,14,${(0.10 + rng(29, i) * 0.16).toFixed(3)})`,
          }}
        />
      ))}
      {/* brillo que respira: hold VIVO (nada quieto más de 1,5 s) */}
      <div
        style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(100deg, rgba(255,244,214,0) ${(((f % 132) / 132) * 240 - 50).toFixed(1)}%, rgba(255,244,214,0.22) ${(((f % 132) / 132) * 240 - 36).toFixed(1)}%, rgba(255,244,214,0) ${(((f % 132) / 132) * 240 - 22).toFixed(1)}%)`,
          mixBlendMode: "screen",
        }}
      />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 12, background: "linear-gradient(270deg, rgba(28,18,8,0.78), rgba(28,18,8,0))" }} />
    </div>
  );
};

// el pedazo que se ROMPE y se cae del cuadro girando (es cuero, la misma materia que la barra)
const Pedazo: React.FC<{ at: number; left: number; w: number }> = ({ at, left, w }) => {
  const f = useCurrentFrame();
  const d = f - at;
  if (d < 0 || d > 56) return null;
  const k = d / 56;
  return (
    <div
      style={{
        position: "absolute",
        left: left + 110 * k + 250 * k * k,
        top: BAR_Y - 26 * k + 980 * k * k,
        width: w, height: BAR_H,
        transform: `translateZ(66px) rotate(${(9 + 98 * k).toFixed(1)}deg)`,
        transformOrigin: "20% 40%",
        borderRadius: 6, overflow: "hidden",
        background: "linear-gradient(178deg, #B98F57 0%, #9B6E42 46%, #704E2B 100%)",
        boxShadow: "0 16px 40px rgba(22,15,8,0.5), inset 0 2px 0 rgba(255,240,206,0.4)",
      }}
    >
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 10, background: "linear-gradient(90deg, rgba(30,20,10,0.8), rgba(30,20,10,0))" }} />
    </div>
  );
};

// el número estampado, EN TINTA SOBRE PAPEL (D7: tinta oscura sobre cama oscura desaparece)
const Cifra: React.FC<{ at: number; x: number; y: number; texto: string; tag: string; size?: number; until?: number }> =
  ({ at, x, y, texto, tag, size = 128, until }) => {
    const f = useCurrentFrame();
    if (f < at - 6) return null;
    if (until !== undefined && f > until + 10) return null;
    // ⛔ dos cifras en el MISMO slot no pueden convivir: la de materiales se va cuando entra la de
    // transporte (salen por donde entraron, hacia arriba, no con un fundido en el lugar).
    const k = ramp(f, at, at + 16, Easing.out(Easing.poly(4))) * (until !== undefined ? 1 - ramp(f, until, until + 10, Easing.in(Easing.cubic)) : 1);
    const golpe = 1 + (1 - k) * 0.34;
    return (
      <div
        style={{
          position: "absolute", left: x, top: y,
          transform: `translateZ(120px) scale(${golpe.toFixed(3)})`,
          transformOrigin: "0% 100%", opacity: k,
        }}
      >
        <Paper pad={20} tilt={-0.8}>
          <div style={{ fontFamily: FONT, fontSize: size, fontWeight: 800, color: C.ink, lineHeight: 0.94, letterSpacing: -2 }}>{texto}</div>
          <div style={{ marginTop: 4 }}><Kick size={26} color={C.gold}>{tag}</Kick></div>
        </Paper>
      </div>
    );
  };

const IMP20 = 600;   // 476,42 "materiales 20"
const IMP12 = 646;   // 477,9  "transporte 12"
const EST128 = 682;  // 479,06 "quedaron 128 limpios"

// cuánto vale la barra en cada frame (160 → 140 → 128)
const barVal = (f: number) => (f >= IMP12 ? 128 : f >= IMP20 ? 140 : 160);

export const MovDinero: React.FC = () => {
  const f = useCurrentFrame();
  const K = camAt(f);
  const L = luz(f, DUR, 0.25, 0.50);
  const rin = rampIn(f, 14);

  // ── LA TARJETA CONTINUA: billetes (A1) → teléfono (A2) → se va por el lente (F2) ─────────────
  // Un SOLO objeto con geometría continua: mismo 16:9, misma inercia. Eso es el MATCH-SHAPE.
  const m1 = ramp(f, A2 - 4, A2 + 44, Easing.inOut(Easing.poly(3)));           // billetes → teléfono
  const zoomOut = ramp(f, A3 - 26, A3 + 8, Easing.in(Easing.poly(3)));         // ZOOM-THROUGH
  const wipe = ramp(f, 142, 158, Easing.inOut(Easing.cubic));                  // cortina de materia
  const card = {
    cx: lerp(lerp(1372, 986, m1), 960, zoomOut),
    cy: lerp(lerp(724, 486, m1), 540, zoomOut),
    w: lerp(lerp(440, 860, m1), 860 * 7.5, zoomOut),
    z: lerp(lerp(40, 150, m1), 900, zoomOut),
    ry: lerp(lerp(-13, -2.2, m1), 0, zoomOut),
  };

  // las dos fotos que manda el vecino: material REAL, cada una en su 16:9 (⛔ nada de renglones)
  const ph = ramp(f, 268, 320, Easing.out(Easing.poly(3)));
  const phOut = ramp(f, 372, A3 - 10, Easing.in(Easing.cubic));

  // la mesa del presupuesto entra desde abajo al final del acto 3 (objeto que sube, no un fade)
  const mesa = ramp(f, 470, 520, Easing.out(Easing.cubic));

  // ── ACTO 5 · MATCH-MOVE: la barra de 128 baja a escalón y la de 290 entra desde la derecha ───
  const step = ramp(f, A5, A5 + 52, Easing.inOut(Easing.poly(3)));
  const w128 = 128 * PPU;
  const w290 = 290 * PPU;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={camStyle(K)}>
        {/* D2 · el fondo es MATERIA, no un degradé: el galpón donde Claudio cuenta los billetes */}
        <Backplate img="clembudo_s400" clip="clembudo_s400" from={0} dur={150} rate={0.9} z={-600} scale={1.44} veil={0.66} />
        {/* el piso / la mesa — gira sobre su borde INFERIOR y hacia atrás (⛔ nunca se adelanta) */}
        <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `translateY(${((1 - mesa) * 980).toFixed(1)}px)` }}>
          <Ground img="clembudo_s436" y={1220} h={1380} z0={-210} tilt={63} veil={0.6} />
        </div>

        {/* ═══ A1+A2 · LA TARJETA CONTINUA ══════════════════════════════════════════════════════ */}
        {f < A3 + 12 ? (
          <Plate cx={card.cx} cy={card.cy} w={card.w} z={card.z} ry={card.ry} lift={1.3}>
            {/* WIPE POR MATERIA: la cortina baja y detrás ya está el otro material. ⛔ no un fade */}
            <div style={{ position: "absolute", inset: 0 }}>
              <Mat img="clembudo_s405" clip="clembudo_s405" from={10} dur={148} rate={0.9} kb={1.05} />
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: `${(wipe * 100).toFixed(2)}%`, overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: `${(100 / Math.max(wipe, 0.02)).toFixed(2)}%` }}>
                <Mat img="clembudo_s401" clip="clembudo_s401" from={A2 + 6} dur={148} rate={0.86} kb={1.04} />
              </div>
              {/* el canto de la cortina: un filo de luz, para que se lea como materia que baja */}
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 4, background: "rgba(255,240,208,0.7)" }} />
            </div>
          </Plate>
        ) : null}

        {/* ═══ A2 · LAS DOS FOTOS QUE MANDA EL VECINO — material real, nunca renglones vacíos ═══ */}
        {ph > 0.004 && phOut < 0.996 ? (
          <>
            <Plate
              cx={fitCx(lerp(340, 404, ph), lerp(300, 430, ph), lerp(-180, 226, ph), K)} cy={lerp(880, 786, ph)} w={lerp(300, 430, ph) * (1 - phOut * 0.7)}
              z={lerp(-180, 226, ph)} ry={lerp(-26, -14, ph)} dim={(1 - ph) * 0.7 + phOut * 0.5} lift={1.1}
            >
              <Mat img="clembudo_s435" kb={1.05 + ph * 0.04} />
            </Plate>
            <Plate
              cx={fitCx(lerp(1580, 1516, ph), lerp(300, 430, ph), lerp(-180, 200, ph), K)} cy={lerp(842, 758, ph)} w={lerp(300, 430, ph) * (1 - phOut * 0.7)}
              z={lerp(-180, 200, ph)} ry={lerp(24, 13, ph)} dim={(1 - ph) * 0.7 + phOut * 0.5} lift={1.1}
            >
              <Mat img="clembudo_s421" clip="clembudo_s421" from={280} dur={120} rate={1} kb={1.05} />
            </Plate>
          </>
        ) : null}

        {/* ═══ A3 · LA PARED REAL con el medidor — lo que hay del otro lado del ZOOM-THROUGH ════ */}
        {f >= A3 - 6 && f < A4 + 10 ? (
          <Plate
            cx={960} cy={478} w={lerp(1580, 1180, ramp(f, A3 + 30, A4, Easing.inOut(Easing.cubic)))}
            z={lerp(120, -30, ramp(f, A3, A4))} lift={1.4}
          >
            <Mat img="clembudo_s403" clip="clembudo_s403" from={A3 + 4} dur={150} rate={0.86} kb={1.05} />
          </Plate>
        ) : null}

        {/* ═══ A4 · LA BARRA DE DINERO (materia sólida) + SU MATERIAL, cada uno en lo suyo ══════ */}
        {f >= A4 - 4 && f < A5 + 4 ? (
          <>
            <Barra w={barVal(f) * PPU * (1 - step * 0.45)} />
            <Pedazo at={IMP20} left={BAR_X + 140 * PPU} w={20 * PPU} />
            <Pedazo at={IMP12} left={BAR_X + 128 * PPU} w={12 * PPU} />
            {/* el material de este acto va en su PROPIA Plate, con su 16:9 intacto (⛔ no adentro
                de la barra: ése era exactamente el defecto D1) */}
            {/* fitCx: con z 1,16-1,21 y translateZ 190 esta foto se salia por la derecha. Y baja
                a 540 px para no pisar la cifra de las restas. */}
            <Plate cx={fitCx(1400, 540, 190, K)} cy={332} w={540} z={190} ry={-7} lift={1.35}>
              <Mat img="clembudo_s416" clip="clembudo_s416" from={A4 + 8} dur={150} rate={0.86} kb={1.05} />
            </Plate>
            <Cifra at={A4 + 10} x={BAR_X} y={BAR_Y - 214} texto="$160" tag="LO QUE SE COBRÓ" />
            {/* las restas van DEBAJO de la barra, no a su derecha: ahi chocaban con la foto */}
            <Cifra at={IMP20 + 4} x={BAR_X + 30} y={BAR_Y + 150} texto="−20" tag="MATERIALES" size={92} until={IMP12 - 2} />
            <Cifra at={IMP12 + 4} x={BAR_X + 30} y={BAR_Y + 150} texto="−12" tag="TRANSPORTE" size={92} />
          </>
        ) : null}

        {/* ═══ A5 · MATCH-MOVE: 128 se vuelve el escalón de abajo y 290 entra desde la derecha ══ */}
        {f >= A5 - 30 ? (
          <>
            <Barra w={w128 * (1 - step * 0.45)} y={BAR_Y + step * 96} sc={1 - step * 0.34} />
            <div style={{ position: "absolute", left: lerp(2280, BAR_X, step), top: BAR_Y - 88, transform: "translateZ(70px)" }}>
              <div
                style={{
                  position: "relative",
                  width: Math.max(2, w290 * step), height: BAR_H,
                  borderRadius: 7, overflow: "hidden",
                  background: "linear-gradient(178deg, #CFA468 0%, #B5854F 44%, #86603A 100%)",
                  boxShadow: "0 18px 44px rgba(22,15,8,0.56), inset 0 2px 0 rgba(255,240,206,0.6), inset 0 -3px 0 rgba(30,20,10,0.45)",
                }}
              >
                {new Array(46).fill(0).map((_, i) => (
                  <div key={i} style={{ position: "absolute", left: 9 + i * 26, top: 0, bottom: 0, width: 1.5, background: `rgba(46,30,14,${(0.10 + rng(31, i) * 0.16).toFixed(3)})` }} />
                ))}
              </div>
            </div>
            {/* el extractor: el material que explica POR QUÉ el siguiente vale más */}
            <Plate cx={1452} cy={344} w={lerp(300, 640, step)} z={lerp(-120, 200, step)} ry={lerp(16, -6, step)} dim={(1 - step) * 0.7} lift={1.35}>
              <Mat img="clembudo_s406" clip="clembudo_s406" from={A5 + 10} dur={102} rate={0.9} kb={1.05} />
            </Plate>
          </>
        ) : null}
      </AbsoluteFill>

      {/* entrada del ambiente ≤15 f: un velo que se retira (⛔ nada de 2 s subiendo desde negro) */}
      {rin < 0.999 ? <AbsoluteFill style={{ background: "rgba(20,16,10,1)", opacity: 1 - rin, pointerEvents: "none" }} /> : null}

      {/* L5 · clave cálida que EVOLUCIONA con la luz del movimiento (día frío → ámbar de billete) */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(76% 60% at ${(30 + L * 14).toFixed(1)}% ${(20 + L * 8).toFixed(1)}%, rgba(255,208,132,${(0.05 + L * 0.20).toFixed(3)}) 0%, rgba(255,188,108,0) 62%)`,
          mixBlendMode: "screen", pointerEvents: "none",
        }}
      />

      {/* FRONTERA 3 · OCLUSIÓN — el cuero del delantal (⛔ nunca el color del fondo) */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Occluder at={A4} len={12} color="#B5854F" angle={9} />
      </AbsoluteFill>

      {/* ═══ L8 · TEXTO — 1 idea por acto, en espacio de PANTALLA, anclado por bottom/left ═══════ */}
      <LowerBed o={0.9} />
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Lower f={f} from={8}   to={96}  kick="ESO ES EL TRABAJO"  head="Ahora hablemos del dinero." />
        <Lower f={f} from={152} to={252} kick="CÓMO ENTRA"         head="Por el grupo del barrio." />
        <Lower f={f} from={272} to={396} kick="SIN SALIR DE CASA"  head="Cuatro preguntas y dos fotos." />
        {/* D3 · esta línea es la que salía "0 minutos": vivía dentro de la cámara y el zoom la cortaba */}
        <Lower f={f} from={432} to={496} kick="LA VISITA"          head="Cuarenta minutos en la casa." />
        <Lower f={f} from={514} to={592} kick="LO QUE SE COBRÓ"    head="Ciento sesenta dólares." />
        <Lower f={f} from={606} to={676} kick="LO QUE SE GASTÓ"    head="Materiales y transporte." />
        <Lower f={f} from={692} to={748} kick="LO QUE QUEDÓ"       head="Ciento veintiocho, en una tarde." />
        <Lower f={f} from={768} to={862} kick="EL SIGUIENTE"       head="Con extractor, doscientos noventa." />
      </AbsoluteFill>

      {/* el 128 estampado sobre papel, arriba a la derecha: en pantalla, lejos del texto de abajo */}
      {f >= EST128 ? (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute", right: 96, top: 104,
              opacity: ramp(f, EST128, EST128 + 14),
              transform: `scale(${(1 + (1 - ramp(f, EST128, EST128 + 18, Easing.out(Easing.poly(4)))) * 0.3).toFixed(3)})`,
              transformOrigin: "100% 0%",
            }}
          >
            <Paper pad={22} tilt={1.1}>
              <div style={{ textAlign: "right" }}>
                <Kick size={26} color={C.gold}>LIMPIOS, EN UNA TARDE</Kick>
                <div style={{ height: 6 }} />
                <Ink size={132}>$128</Ink>
              </div>
            </Paper>
          </div>
        </AbsoluteFill>
      ) : null}

      <Atmos t={L} dust={26} />
    </AbsoluteFill>
  );
};

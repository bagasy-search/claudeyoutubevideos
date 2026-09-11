// MovCaso35.tsx — clembudo · El Constructor Libre · 489,4 s → 540,0 s · 1518 frames @30fps
//
// EL CASO DE LOS 35 DÓLARES: el trabajo que NO tomó. El objeto protagonista del movimiento es EL
// CAÑO QUE PIERDE detrás de la pared — está desde el primer frame y no se va nunca: es lo que hace
// que los 200 fueran un fracaso, lo que arregla el plomero y lo que permite que el trabajo de 260
// salga perfecto. La materia que cruza todas las fronteras es ese caño.
//
// ═══ QUÉ CAMBIÓ EN LA REHECHURA (sep-2026) ═════════════════════════════════════════════════════
//  D1 · las tarjetas eran `<Glass w h/>` con el alto elegido a mano y material 16:9 adentro:
//       560×252 (2,22:1), 452×358 (1,26:1), 620×468 (1,32:1), 286×182. Con `objectFit:cover` el
//       material se recortaba y cortaba cabezas. AHORA todas son `<Plate/>`: el alto SALE del
//       ancho por 16:9 y no se puede pasar suelto.
//  D5 · las dos tarjetas de los vecinos medían 286 px con etiquetas a 19 px — abajo de todo y sin
//       leerse. AHORA miden 560 px y la etiqueta va en tinta sobre papel a 46 px: **o se ven o no
//       van**, y acá se ven, porque son el remate del movimiento.
//  D4 · la profundidad se pintaba con `opacity` (`opacity: 0.85` sobre una foto a cuadro completo)
//       → se veía el b-roll a través. AHORA `<Plate dim={}/>`: velo negro adentro de algo opaco.
//  D3 · el texto vivía DENTRO de la cámara. AHORA va en `<Lower/>`, espacio de pantalla, anclado
//       por bottom/left en píxeles reales.
//  D2 · los fondos eran degradés CSS. AHORA cada acto tiene su `<Backplate/>` de material real.
//
// ═══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF  (cada acto arranca EXACTAMENTE en el exitTo del anterior)
// ═══════════════════════════════════════════════════════════════════════════════════════════════
// A1 · EL CAÑO QUE PIERDE — "no es mi trabajo"                       f 0 → 199   (200 f · 6,7 s)
//    enterFrom cam {z 1.03, panX  16, panY   6, ry  2.6, rx  0.4} · luz 0.500
//              materia: (del MovDinero) el escalón de arriba, cortado por el borde superior
//    exitTo    cam {z 1.08, panX  -6, panY  -4, ry  0.8, rx  0.0} · luz 0.481
//              materia: EL CAÑO MOJADO goteando adentro del hueco (s410), en héroe
//    protagonista: s408 (agachado, descubre el caño) → s410 (macro del caño goteando)
//
//    ── FRONTERA 1 @f200 · MATCH-SHAPE ─────────────────────────────────────────────────────────
//    El rectángulo del hueco de la pared GIRA sobre su eje vertical (mismo 16:9, misma posición,
//    misma inercia) y del otro lado ya está la mano del dueño ofreciendo los billetes.
//
// A2 · LOS 200 QUE PODÍA TOMAR — y por qué habría fracasado         f 200 → 589 (390 f · 13,0 s)
//    enterFrom = exitTo A1                                           · luz 0.481
//              materia: el mismo rectángulo, ya dado vuelta
//    exitTo    cam {z 1.14, panX -44, panY -18, ry -2.2, rx -0.8} · luz 0.451
//              materia: LA MANCHA QUE VUELVE (s435) sobre la pintura nueva, en héroe
//    protagonista: s409 (frena con la palma) → s435 (la mancha vuelve en tres semanas)
//
//    ── FRONTERA 2 @f590 · OCLUSIÓN ────────────────────────────────────────────────────────────
//    El cuero del delantal cruza el cuadro (#B5854F, luma ≈131 — ⛔ NO el color del fondo, que
//    haría un fundido a negro) y detrás ya está el apretón de los 35 dólares. Cambio de tema
//    fuerte: del fracaso que no pasó a lo que sí cobró.
//
// A3 · LOS 35 DÓLARES: sólo el diagnóstico                           f 590 → 811 (222 f · 7,4 s)
//    enterFrom = exitTo A2                                           · luz 0.451
//              materia: el cuero se despeja sobre el apretón (s411)
//    exitTo    cam {z 1.18, panX  30, panY -34, ry  3.0, rx -1.4} · luz 0.424
//              materia: LA MANO SEÑALANDO EL ZÓCALO (s412) — la explicación que se lleva el cliente
//    protagonista: s411 (recibe pocos billetes y da la mano) → s412 (le explica y señala)
//
//    ── FRONTERA 3 @f812 · MATCH-MOVE ──────────────────────────────────────────────────────────
//    La cámara ya viene paneando hacia la derecha; el plomero entra por ese mismo vector y la
//    tarjeta de la explicación sale por el borde izquierdo. Nada arranca ni se detiene.
//
// A4 · EL PLOMERO Y LA VUELTA A LAS TRES SEMANAS                     f 812 → 1046 (235 f · 7,8 s)
//    enterFrom = exitTo A3                                           · luz 0.424
//              materia: el plomero trabajando el caño — el MISMO caño del acto 1
//    exitTo    cam {z 1.21, panX -10, panY -50, ry -1.0, rx -1.6} · luz 0.397
//              materia: LA BROCHA sobre la pared ya seca (s414)
//    protagonista: s413 (el plomero arregla el caño) → s414 (vuelve y pinta en seco)
//
//    ── FRONTERA 4 @f1047 · ZOOM-THROUGH ───────────────────────────────────────────────────────
//    La cámara ENTRA en la pared recién terminada y sale en el living arreglado, con la señora
//    poniéndole los billetes en la palma. Detalle → plano general, sin un frame de nada.
//
// A5 · TRABAJO COMPLETO · 260 DÓLARES · Y SALIÓ PERFECTO             f 1047 → 1231 (185 f · 6,2 s)
//    enterFrom = exitTo A4                                           · luz 0.397
//              materia: la pared terminada, ahora dentro del living
//    exitTo    cam {z 1.15, panX  26, panY -22, ry  2.4, rx -0.6} · luz 0.375
//              materia: LOS BILLETES en la palma (s416) — el plano hero del movimiento
//    protagonista: s416 (la señora le pone los billetes con las dos manos)
//    (f1090: el precio, nativo, en papel. ⛔ es el del TRABAJO, nunca el del curso.)
//
//    ── FRONTERA 5 @f1232 · WIPE POR MATERIA ───────────────────────────────────────────────────
//    El POLVO de la vereda cruza el cuadro (el mismo polvo que levanta una camioneta al arrancar)
//    y detrás ya está el cliente contándoles a los dos vecinos. ⛔ No es un fade: es materia.
//
// A6 · LO QUE CONTÓ NO FUE EL TRABAJO                                f 1232 → 1517 (286 f · 9,5 s)
//    enterFrom = exitTo A5                                           · luz 0.375
//              materia: el polvo de la vereda despejándose
//    exitTo    cam {z 1.06, panX -18, panY   4, ry -0.6, rx  0.0} · luz 0.350
//              materia: LAS DOS TARJETAS DE LOS VECINOS + la frase textual — y el galpón limpio,
//              que es con lo que sigue el avatar
//    protagonista: s415 (el cliente contándoles a dos vecinos, el gesto de "me dijo que no")
//
// COSTURAS EN ORDEN: MATCH-SHAPE · OCLUSIÓN · MATCH-MOVE · ZOOM-THROUGH · WIPE POR MATERIA
// (⛔ ninguna es un fade · ⛔ no hay dos seguidas iguales)
//
// ⛔ Los clips duran 5,04 s (151 f): ninguna Sequence pide más de 150 frames. Cero `loop`.
// ⛔ Math.random / Date.now: cero. ⛔ backdrop-filter: cero. ⛔ <Video>: cero.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  Atmos, Backplate, C, Ground, Ink, Kick, Lower, LowerBed, Mat, Occluder, Paper, Plate,
  cam, camStyle, luz, rampIn, rng,
} from "./Stage";

const DUR = 1518;

const A2 = 200;   // 496,06 "podía tomar los 200"
const A3 = 590;   // 509,08 "cobré 35 dólares sólo por el diagnóstico"
const A4 = 812;   // 516,46 "el plomero arregló el caño"
const A5 = 1047;  // 524,30 "y salió perfecto"
const A6 = 1232;  // 530,46 "el cliente les contó a dos vecinos"

const EZ = Easing.bezier(0.22, 0.61, 0.24, 1);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const ramp = (f: number, a: number, b: number, e = EZ) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });

type CamK = { z: number; panX: number; panY: number; ry: number; rx: number };
const LEGS: Array<[number, CamK]> = [
  [0,   { z: 1.03, panX:  16, panY:   6, ry:  2.6, rx:  0.4 }],
  [A2,  { z: 1.08, panX:  -6, panY:  -4, ry:  0.8, rx:  0.0 }],
  [A3,  { z: 1.14, panX: -44, panY: -18, ry: -2.2, rx: -0.8 }],
  [A4,  { z: 1.18, panX:  30, panY: -34, ry:  3.0, rx: -1.4 }],
  [A5,  { z: 1.21, panX: -10, panY: -50, ry: -1.0, rx: -1.6 }],
  [A6,  { z: 1.15, panX:  26, panY: -22, ry:  2.4, rx: -0.6 }],
  [DUR, { z: 1.06, panX: -18, panY:   4, ry: -0.6, rx:  0.0 }],
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

// los dos vecinos del remate: ⛔ 560 px, no 286 — o se ven o no van (D5)
const VECINOS = [
  { img: "clembudo_s415", lbl: "Le dijo que no", x: 540 },
  { img: "clembudo_s412", lbl: "Y eso fue lo que contó", x: 1380 },
];

export const MovCaso35: React.FC = () => {
  const f = useCurrentFrame();
  const K = camAt(f);
  const L = luz(f, DUR, 0.50, 0.35);
  const rin = rampIn(f, 14);

  // A1 → F1 · EL CAÑO. La tarjeta del hueco gira en la frontera 1 (MATCH-SHAPE): misma geometría.
  const cano = ramp(f, 70, 140, Easing.out(Easing.cubic));
  const giro = ramp(f, A2, A2 + 32, Easing.inOut(Easing.cubic)) * 180;
  const caraB = giro >= 90;
  const canoOut = ramp(f, 404, 452, Easing.in(Easing.cubic));

  // A2 · la mancha que vuelve sobre la pintura nueva, con su rojo seco
  const vuelve = ramp(f, 452, 520, Easing.out(Easing.cubic)) * (1 - ramp(f, A3 - 26, A3, Easing.in(Easing.cubic)));

  // A3 · la explicación: la mano señalando el zócalo. Sale por el borde en el MATCH-MOVE.
  const expl = ramp(f, 700, 756, Easing.out(Easing.cubic));
  const explOut = ramp(f, A4 - 14, A4 + 34, Easing.in(Easing.cubic));

  // A4 · el plomero entra por el mismo vector de la cámara (MATCH-MOVE) y después la pared seca
  const plomero = ramp(f, A4 - 10, A4 + 46, Easing.out(Easing.cubic)) * (1 - ramp(f, 946, 986, Easing.in(Easing.cubic)));
  const seca = ramp(f, 952, 1010, Easing.out(Easing.cubic));
  const secaZoom = ramp(f, A5 - 22, A5 + 14, Easing.in(Easing.poly(3)));   // ZOOM-THROUGH

  // A5 · el plano hero: los billetes a la palma, y el precio del TRABAJO en papel
  const hero = ramp(f, A5 + 8, A5 + 60, Easing.out(Easing.cubic)) * (1 - ramp(f, A6 - 30, A6, Easing.in(Easing.cubic)));
  const precio = ramp(f, 1090, 1128, Easing.out(Easing.poly(4))) * (1 - ramp(f, 1196, 1226, Easing.in(Easing.cubic)));

  // FRONTERA 5 · WIPE POR MATERIA: el polvo de la vereda
  const polvo = ramp(f, A6 - 22, A6 + 26, Easing.inOut(Easing.cubic));

  // A6 · la vereda y, al final, las dos tarjetas de los vecinos con la frase textual
  const vereda = ramp(f, A6 + 14, A6 + 70, Easing.out(Easing.cubic)) * (1 - ramp(f, 1368, 1404, Easing.in(Easing.cubic)));
  const dosVec = ramp(f, 1396, 1452, Easing.out(Easing.poly(3)));

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={camStyle(K)}>
        {/* D2 · cada acto tiene MATERIAL REAL de fondo, ⛔ nunca un degradé haciendo de pared */}
        {f < A2 + 26 ? <Backplate img="clembudo_s408" clip="clembudo_s408" from={8} dur={150} rate={0.86} z={-600} scale={1.42} veil={0.5} /> : null}
        {f >= A2 && f < A3 + 26 ? <Backplate img="clembudo_s409" clip="clembudo_s409" from={A2 + 4} dur={150} rate={0.86} z={-600} scale={1.4} veil={0.52} /> : null}
        {f >= A3 && f < A4 + 26 ? <Backplate img="clembudo_s411" clip="clembudo_s411" from={A3 + 4} dur={150} rate={0.86} z={-600} scale={1.4} veil={0.5} /> : null}
        {f >= A4 && f < A5 + 26 ? <Backplate img="clembudo_s414" clip="clembudo_s414" from={A4 + 4} dur={150} rate={0.86} z={-600} scale={1.4} veil={0.52} /> : null}
        {f >= A5 && f < A6 + 26 ? <Backplate img="clembudo_s416" clip="clembudo_s416" from={A5 + 4} dur={150} rate={0.86} z={-600} scale={1.4} veil={0.48} /> : null}
        {/* ⚠️ s415 NO TIENE CLIP i2v (está en las fotos del movimiento, no en los clips): pedirle el
            .mp4 daba 404 y mataba el chunk. Va la foto, y el movimiento lo pone la cámara. */}
        {f >= A6 ? <Backplate img="clembudo_s415" z={-600} scale={1.38} veil={0.5} /> : null}

        {/* el piso: gira sobre su borde INFERIOR y hacia atrás (⛔ jamás se adelanta a las Plates) */}
        <Ground y={1250} h={1300} z0={-250} tilt={63} veil={0.64} />

        {/* ═══ A1/A2 · EL HUECO DE LA PARED — un solo rectángulo que gira en la frontera 1 ══════ */}
        {cano > 0.004 && canoOut < 0.996 ? (
          <Plate
            cx={lerp(1320, 1000, cano)} cy={lerp(600, 496, cano)}
            w={lerp(440, 1020, cano) * (1 - canoOut * 0.5)}
            z={lerp(-240, 200, cano)} ry={lerp(-22, -3, cano) + giro}
            dim={(1 - cano) * 0.62 + canoOut * 0.5} lift={1.4}
          >
            {caraB ? (
              <Mat img="clembudo_s409" clip="clembudo_s409" from={A2 + 34} dur={150} rate={0.86} kb={1.05} mirror />
            ) : (
              <Mat img="clembudo_s410" clip="clembudo_s410" from={76} dur={124} rate={0.9} kb={1.05} />
            )}
          </Plate>
        ) : null}

        {/* ═══ A2 · LA MANCHA QUE VUELVE — lo que habría pasado si tomaba los 200 ══════════════ */}
        {vuelve > 0.004 ? (
          <Plate
            cx={lerp(540, 720, vuelve)} cy={lerp(660, 540, vuelve)} w={lerp(440, 960, vuelve)}
            z={lerp(-250, 190, vuelve)} ry={lerp(22, 5, vuelve)} dim={(1 - vuelve) * 0.62} lift={1.35}
          >
            <Mat img="clembudo_s435" kb={1.04 + vuelve * 0.06} />
          </Plate>
        ) : null}

        {/* ═══ A3 · LA EXPLICACIÓN — señala el zócalo; sale por el borde en el MATCH-MOVE ══════ */}
        {expl > 0.004 && explOut < 0.996 ? (
          <Plate
            cx={lerp(lerp(1400, 1180, expl), -420, explOut)} cy={lerp(620, 520, expl)}
            w={lerp(440, 900, expl)}
            z={lerp(-230, 180, expl)} ry={lerp(-20, -4, expl)} dim={(1 - expl) * 0.6} lift={1.3}
          >
            <Mat img="clembudo_s412" clip="clembudo_s412" from={706} dur={150} rate={0.86} kb={1.05} />
          </Plate>
        ) : null}

        {/* ═══ A4 · EL PLOMERO (entra por el vector de la cámara) y LA PARED YA SECA ═══════════ */}
        {plomero > 0.004 ? (
          <Plate
            cx={lerp(2240, 1120, plomero)} cy={lerp(560, 500, plomero)} w={lerp(560, 940, plomero)}
            z={lerp(-140, 180, plomero)} ry={lerp(16, -3, plomero)} dim={(1 - plomero) * 0.5} lift={1.3}
          >
            <Mat img="clembudo_s413" clip="clembudo_s413" from={A4 + 4} dur={134} rate={0.9} kb={1.05} />
          </Plate>
        ) : null}
        {seca > 0.004 && f < A5 + 16 ? (
          <Plate
            cx={lerp(lerp(560, 860, seca), 960, secaZoom)}
            cy={lerp(lerp(650, 520, seca), 540, secaZoom)}
            w={lerp(lerp(460, 1080, seca), 1080 * 6, secaZoom)}
            z={lerp(lerp(-220, 200, seca), 900, secaZoom)}
            ry={lerp(lerp(20, 3, seca), 0, secaZoom)}
            dim={(1 - seca) * 0.6} lift={1.4}
          >
            <Mat img="clembudo_s414" clip="clembudo_s414" from={958} dur={120} rate={0.9} kb={1.05} />
          </Plate>
        ) : null}

        {/* ═══ A5 · PLANO HERO — la señora poniéndole los billetes en la palma ═════════════════ */}
        {hero > 0.004 ? (
          <Plate
            cx={lerp(1080, 960, hero)} cy={lerp(560, 470, hero)} w={lerp(620, 1180, hero)}
            z={lerp(-160, 210, hero)} ry={lerp(-14, -2, hero)} dim={(1 - hero) * 0.55} lift={1.45}
          >
            <Mat img="clembudo_s416" clip="clembudo_s416" from={A5 + 14} dur={150} rate={0.86} kb={1.05} />
          </Plate>
        ) : null}

        {/* ═══ A6 · LA VEREDA — el cliente contándoles a los dos vecinos ═══════════════════════ */}
        {vereda > 0.004 ? (
          <Plate
            cx={lerp(880, 960, vereda)} cy={lerp(580, 486, vereda)} w={lerp(620, 1120, vereda)}
            z={lerp(-180, 190, vereda)} ry={lerp(14, 2, vereda)} dim={(1 - vereda) * 0.55} lift={1.4}
          >
            <Mat img="clembudo_s415" kb={1.04 + vereda * 0.07} />
          </Plate>
        ) : null}

        {/* ═══ A6 · EL REMATE — las dos tarjetas de los vecinos. ⛔ 560 px, no 286 (D5) ════════ */}
        {dosVec > 0.004
          ? VECINOS.map((v, i) => (
              <Plate
                key={v.img}
                cx={v.x} cy={lerp(1180, 486, dosVec)} w={560}
                z={lerp(-160, 150, dosVec)} ry={i === 0 ? 8 : -8} lift={1.25}
              >
                <Mat img={v.img} kb={1.05} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(20,16,10,0) 50%, rgba(20,16,10,0.82) 100%)" }} />
              </Plate>
            ))
          : null}
      </AbsoluteFill>

      {/* entrada del ambiente ≤15 f (⛔ nada de 2 s subiendo desde negro) */}
      {rin < 0.999 ? <AbsoluteFill style={{ background: "rgba(20,16,10,1)", opacity: 1 - rin, pointerEvents: "none" }} /> : null}

      {/* ═══ FRONTERA 5 · WIPE POR MATERIA — el polvo de la vereda cruza el cuadro ══════════════ */}
      {polvo > 0.002 && polvo < 0.998 ? (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute", top: -80, bottom: -80,
              left: `${(polvo * 152 - 44).toFixed(1)}%`, width: "46%",
              transform: "skewX(7deg)",
              background: "linear-gradient(90deg, rgba(212,190,152,0) 0%, rgba(220,200,164,0.52) 28%, rgba(232,214,180,0.70) 54%, rgba(212,190,152,0) 100%)",
            }}
          />
          {new Array(58).fill(0).map((_, i) => {
            const t = (rng(41, i) + polvo * 1.3) % 1;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${(t * 126 - 13).toFixed(2)}%`,
                  top: rng(67, i) * 1080,
                  width: 2 + rng(97, i) * 5,
                  height: 2 + rng(97, i) * 5,
                  borderRadius: "50%",
                  background: "rgba(240,226,196,0.86)",
                  opacity: Math.sin(Math.min(1, Math.max(0, polvo)) * Math.PI),
                }}
              />
            );
          })}
        </AbsoluteFill>
      ) : null}

      {/* L5 · clave que se va enfriando: el ámbar del billete baja al galpón de la tarde */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(74% 58% at ${(30 + L * 12).toFixed(1)}% ${(18 + L * 8).toFixed(1)}%, rgba(255,206,132,${(0.05 + L * 0.20).toFixed(3)}) 0%, rgba(255,188,108,0) 62%)`,
          mixBlendMode: "screen", pointerEvents: "none",
        }}
      />
      {/* rojo seco: sólo mientras se muestra el fracaso que NO pasó */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(96% 74% at 46% 50%, rgba(176,80,60,0) 42%, rgba(176,80,60,0.28) 100%)",
          mixBlendMode: "multiply", pointerEvents: "none", opacity: vuelve * 0.9,
        }}
      />

      {/* FRONTERA 2 · OCLUSIÓN — el cuero del delantal (⛔ nunca el color del fondo) */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Occluder at={A3} len={12} color="#B5854F" angle={-10} />
      </AbsoluteFill>

      {/* ═══ EL PRECIO DEL TRABAJO — nativo, en papel. ⛔ NO es el del curso: ése nunca se escribe ═ */}
      {precio > 0.004 ? (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute", right: 96, top: 112, opacity: precio,
              transform: `scale(${(1 + (1 - precio) * 0.22).toFixed(3)})`, transformOrigin: "100% 0%",
            }}
          >
            <Paper pad={22} tilt={1.1}>
              <div style={{ textAlign: "right" }}>
                <Kick size={27} color={C.gold}>TRABAJO COMPLETO</Kick>
                <div style={{ height: 6 }} />
                <Ink size={124}>$260</Ink>
                <div style={{ marginTop: 8, fontSize: 32, color: C.inkSoft }}>Con la causa ya cortada</div>
              </div>
            </Paper>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* las etiquetas de los dos vecinos: en papel, en pantalla, a 46 px (⛔ nunca a 19) */}
      {dosVec > 0.4 ? (
        <AbsoluteFill style={{ pointerEvents: "none", opacity: ramp(f, 1440, 1470) }}>
          {VECINOS.map((v, i) => (
            <div key={v.lbl} style={{ position: "absolute", left: v.x - 280, top: 812, width: 560, textAlign: "center" }}>
              <Paper pad={12} tilt={i === 0 ? -0.6 : 0.6}>
                <Ink size={46}>{v.lbl}</Ink>
              </Paper>
            </div>
          ))}
        </AbsoluteFill>
      ) : null}

      {/* ═══ L8 · TEXTO — 1 idea por acto, titular ≤7 palabras, anclado por bottom/left ═════════ */}
      <LowerBed o={dosVec > 0.5 ? 0.4 : 0.9} />
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Lower f={f} from={10}   to={180}  kick="LO QUE ENCONTRÉ"   head="Un caño que perdía en la pared." />
        <Lower f={f} from={210}  to={330}  kick="LO QUE ME OFRECÍAN" head="Doscientos dólares, y los tenía." />
        <Lower f={f} from={344}  to={438}  kick="POR QUÉ NO"        head="Porque el agua seguía entrando." />
        <Lower f={f} from={458}  to={572}  kick="EN TRES SEMANAS"   head="Volvía, con mi garantía firmada." />
        <Lower f={f} from={604}  to={688}  kick="LO QUE SÍ COBRÉ"   head="Treinta y cinco, por el diagnóstico." />
        <Lower f={f} from={706}  to={796}  kick="Y LE DIJE"         head="Llama primero a un plomero." />
        <Lower f={f} from={826}  to={940}  kick="EL PLOMERO"        head="Arregló el caño esa semana." />
        <Lower f={f} from={958}  to={1036} kick="TRES SEMANAS DESPUÉS" head="Me llamó él, de vuelta." />
        <Lower f={f} from={1056} to={1084} kick="TRABAJO COMPLETO"  head="Y esta vez salió perfecto." />
        <Lower f={f} from={1140} to={1216} kick="POR QUÉ"           head="Porque la causa estaba cortada." />
        <Lower f={f} from={1246} to={1380} kick="PERO LO MEJOR"     head="Se lo contó a dos vecinos." />
      </AbsoluteFill>

      {/* L9 · atmósfera — montada UNA sola vez para los 1518 frames, jamás se remonta */}
      <Atmos t={L} dust={28} />
    </AbsoluteFill>
  );
};

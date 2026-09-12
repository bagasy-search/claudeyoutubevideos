// MovCloroBorax.tsx — clembudo · El Constructor Libre · 305,5 s → 364,4 s · 1767 frames @30fps
//
// "El cloro no mata el moho de una pared." El objeto protagonista del movimiento es EL PORO: todo
// pasa adentro de ese agujero de la pared — el cloro se queda en el borde, el agua baja hasta la
// raíz, el bórax baja con ella y se queda cristalizado de guardia. La materia que cruza todas las
// fronteras es siempre la misma superficie, vista a distintas escalas.
//
// ═══ QUÉ CAMBIÓ EN LA REHECHURA (sep-2026) ═════════════════════════════════════════════════════
//  D1 · las tarjetas se armaban con `<Glass w h/>` y un alto elegido a mano (700×438 = 1,60:1,
//       300×300 = 1:1) con material 16:9 adentro en `objectFit:cover`: el material se recortaba.
//       AHORA todas son `<Plate/>`, que deriva el alto del ancho por 16:9 y no acepta un alto libre.
//  D3 · el texto vivía DENTRO de la cámara (`<Head>` adentro de `camStyle`), donde el `scale(z)` y
//       la perspectiva lo corren contra el borde. AHORA va en `<Lower/>`, espacio de pantalla.
//  D4 · la profundidad se pintaba con `opacity` (`opacity: 0.5 + t*0.5`, `opacity: 0.9` sobre una
//       foto a cuadro completo) → se veía el b-roll a través. AHORA `<Plate dim={}/>`.
//  D2 · los fondos eran degradés CSS haciendo de pared. AHORA cada acto tiene su `<Backplate/>`.
//  ⛔ Y el componente `BigStatReveal` del kit (342,7→347,5 · "EL KILO DE BÓRAX $5") caía ENTERO
//     adentro de este movimiento y se montaba encima: dos capas compitiendo por el mismo cuadro,
//     que es exactamente cómo nacía el fantasma de doble exposición. Ese precio ahora es NATIVO
//     del acto 4 (papel + tinta, ⛔ nunca el precio del CURSO: éste es el del kilo de bórax), y el
//     componente salió de `_v3/clembudo_comps.json`.
//
// ═══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF  (cada acto arranca EXACTAMENTE en el exitTo del anterior)
// ═══════════════════════════════════════════════════════════════════════════════════════════════
// A1 · EL CLORO NO MATA NADA                                         f 0 → 287   (288 f · 9,6 s)
//    enterFrom cam {z 1.02, panX  −8, panY  10, ry −3.0, rx  1.4} · luz 0.300
//              materia: — (del b-roll previo: el galpón y la pared enferma)
//    exitTo    cam {z 1.07, panX −30, panY   2, ry −1.0, rx  0.6} · luz 0.322
//              materia: LA SUPERFICIE DECOLORADA donde pasó el trapo (s303), en héroe
//    protagonista: s302 (vuelca la lavandina y niega a cámara) → s303 (el trapo aclara el borde)
//
//    ── FRONTERA 1 @f288 · ZOOM-THROUGH ────────────────────────────────────────────────────────
//    La cámara ENTRA por la mancha decolorada: la tarjeta crece y adentro ya está el macro del
//    poro con la gota bajando. Superficie → interior. Es literalmente el argumento del acto.
//
// A2 · EL PORO Y LA RAÍZ                                             f 288 → 689 (402 f · 13,4 s)
//    enterFrom = exitTo A1                                           · luz 0.322
//              materia: el poro, ya abierto a cuadro completo
//    exitTo    cam {z 1.13, panX  26, panY −16, ry  2.2, rx −0.8} · luz 0.352
//              materia: LA MANCHA QUE VOLVIÓ sobre el parche blanqueado (s306)
//    protagonista: s304 (la gota y las raíces del hongo) → s306 (volvió en el mismo lugar)
//
//    ── FRONTERA 2 @f690 · CORTE EN EL BEAT ────────────────────────────────────────────────────
//    Corte seco EXACTO en "y por eso el cliente ya te está esperando" (328,50 s · f690). Encuadre,
//    escala y luz calzan: la pared de A2 y la pared de A3 son el mismo plano y la misma clave.
//
// A3 · EL CLIENTE QUE YA LO INTENTÓ                                  f 690 → 915 (226 f · 7,5 s)
//    enterFrom = exitTo A2                                           · luz 0.352
//              materia: la mancha que volvió, ahora detrás de Claudio
//    exitTo    cam {z 1.16, panX  −6, panY −28, ry −1.4, rx −1.2} · luz 0.372
//              materia: EL BALDE humeante entrando por abajo — el arranque de la receta
//    protagonista: s301 (dedo en alto, advierte) → s305 (el trapo chorreando, fastidiado)
//
//    ── FRONTERA 3 @f916 · WIPE POR MATERIA ────────────────────────────────────────────────────
//    El POLVO BLANCO cae desde arriba del cuadro (la taza que se vuelca) y detrás ya está la
//    receta montada. Es materia real atravesando el plano, ⛔ no un fade.
//
// A4 · LA RECETA DEL BÓRAX                                           f 916 → 1279 (364 f · 12,1 s)
//    enterFrom = exitTo A3                                           · luz 0.372
//              materia: el polvo cayendo en el balde
//    exitTo    cam {z 1.21, panX  38, panY −44, ry  3.4, rx −1.6} · luz 0.408
//              materia: EL BALDE cargado — que en la frontera se vuelve la boca del poro
//    protagonista: s307/s308 (la taza colmada) → s309 (revuelve) → s310 (la fila de baldes)
//    (f1118: el precio del KILO, nativo, en papel: 2 a 5 dólares · 16 litros. ⛔ no es el curso.)
//
//    ── FRONTERA 4 @f1280 · MATCH-SHAPE ────────────────────────────────────────────────────────
//    El círculo del balde visto desde arriba se convierte en la boca del poro: el mismo círculo,
//    la misma posición, la misma inercia — cambia la escala, no la forma.
//
// A5 · EL MECANISMO: baja con el agua y se queda cristalizado        f 1280 → 1617 (338 f · 11,3 s)
//    enterFrom = exitTo A4                                           · luz 0.408
//              materia: la boca del poro
//    exitTo    cam {z 1.17, panX −24, panY −20, ry −2.0, rx −0.6} · luz 0.437
//              materia: LOS CRISTALES tapizando el poro seco (s312)
//    protagonista: s311 (la solución baja a la raíz) → s312 (el bórax cristalizado)
//
//    ── FRONTERA 5 @f1618 · OCLUSIÓN ───────────────────────────────────────────────────────────
//    El cuero del delantal cruza el cuadro (#B5854F, luma ≈131 — ⛔ NO el color del fondo) y
//    detrás ya está el careo final. Cambio de tema fuerte: del mecanismo al veredicto.
//
// A6 · CLORO SE VA · BÓRAX SE QUEDA DE GUARDIA                       f 1618 → 1766 (149 f · 5,0 s)
//    enterFrom = exitTo A5                                           · luz 0.437
//              materia: el cuero se despeja sobre las DOS manos de s313
//    exitTo    cam {z 1.10, panX  10, panY   0, ry  0.6, rx  0.0} · luz 0.450
//              materia: la taza en alto — el open loop de "la regla más rara del oficio"
//    protagonista: s313 (la botella vacía boca abajo vs la taza de polvo en alto)
//
// COSTURAS EN ORDEN: ZOOM-THROUGH · CORTE EN EL BEAT · WIPE POR MATERIA · MATCH-SHAPE · OCLUSIÓN
// (⛔ ninguna es un fade · ⛔ no hay dos seguidas iguales)
//
// ⛔ Los clips duran 5,04 s (151 f): ninguna Sequence pide más de 150 frames. Cero `loop`.
// ⛔ Math.random / Date.now: cero. ⛔ backdrop-filter: cero. ⛔ <Video>: cero.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  Atmos, Backplate, C, Ground, Ink, Kick, Lower, LowerBed, Mat, Occluder, Paper, Plate, fitCx,
  cam, camStyle, luz, rampIn, rng,
} from "./Stage";

const DUR = 1767;

const A2 = 288;   // 315,10 "pero el agua se mete en el poro"
const A3 = 690;   // 328,50 "y por eso el cliente ya te está esperando"
const A4 = 916;   // 336,02 "250 gramos, una taza bien llena, en 4 litros"
const A5 = 1280;  // 348,16 "penetra en el poro junto con el agua"
const A6 = 1618;  // 359,44 "el cloro se evapora entero y no deja nada"

const EZ = Easing.bezier(0.22, 0.61, 0.24, 1);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const ramp = (f: number, a: number, b: number, e = EZ) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });

type CamK = { z: number; panX: number; panY: number; ry: number; rx: number };
const LEGS: Array<[number, CamK]> = [
  [0,   { z: 1.02, panX:  -8, panY:  10, ry: -3.0, rx:  1.4 }],
  [A2,  { z: 1.07, panX: -30, panY:   2, ry: -1.0, rx:  0.6 }],
  [A3,  { z: 1.13, panX:  26, panY: -16, ry:  2.2, rx: -0.8 }],
  [A4,  { z: 1.16, panX:  -6, panY: -28, ry: -1.4, rx: -1.2 }],
  [A5,  { z: 1.21, panX:  38, panY: -44, ry:  3.4, rx: -1.6 }],
  [A6,  { z: 1.17, panX: -24, panY: -20, ry: -2.0, rx: -0.6 }],
  [DUR, { z: 1.10, panX:  10, panY:   0, ry:  0.6, rx:  0.0 }],
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

export const MovCloroBorax: React.FC = () => {
  const f = useCurrentFrame();
  const K = camAt(f);
  const L = luz(f, DUR, 0.30, 0.45);
  const rin = rampIn(f, 14);

  // A1 · la superficie decolorada, que es por donde entra la cámara en la frontera 1
  const sup = ramp(f, 110, 180, Easing.out(Easing.cubic));
  const supZoom = ramp(f, A2 - 34, A2 + 10, Easing.in(Easing.poly(3)));   // ZOOM-THROUGH

  // A2 · la mancha que volvió sobre el parche blanqueado
  const volvio = ramp(f, 612, 672, Easing.out(Easing.cubic)) * (1 - ramp(f, A3 + 60, A3 + 100, Easing.in(Easing.cubic)));

  // FRONTERA 3 · WIPE POR MATERIA: el polvo blanco cae y detrás ya está la receta
  const polvo = ramp(f, A4 - 22, A4 + 26, Easing.inOut(Easing.cubic));

  // A4 · la receta: la taza, el balde, la fila de baldes cargados
  // MEDIDO SOBRE EL RENDER: la taza se iba en f1118 y los baldes recien entraban en f1214, asi
  // que entre medio el acto se quedaba con el fondo y una tarjeta de texto: un acto VACIO, que es
  // el defecto D2. Las dos ventanas ahora SE SOLAPAN: nunca hay un frame sin objeto protagonista.
  const taza = ramp(f, A4 + 18, A4 + 74, Easing.out(Easing.cubic)) * (1 - ramp(f, 1186, 1226, Easing.in(Easing.cubic)));
  const baldes = ramp(f, 1150, 1206, Easing.out(Easing.cubic)) * (1 - ramp(f, A5 - 14, A5 + 10, Easing.in(Easing.cubic)));
  const precio = ramp(f, 1118, 1156, Easing.out(Easing.poly(4))) * (1 - ramp(f, 1244, 1276, Easing.in(Easing.cubic)));

  // A5 · el mecanismo. El balde (círculo) se vuelve la boca del poro: MATCH-SHAPE.
  const poro = ramp(f, A5 - 20, A5 + 40, Easing.inOut(Easing.poly(3)));
  const cristal = ramp(f, 1408, 1470, Easing.out(Easing.cubic)) * (1 - ramp(f, A6 - 20, A6, Easing.in(Easing.cubic)));

  // A6 · el careo final
  const careo = ramp(f, A6 + 6, A6 + 56, Easing.out(Easing.cubic));

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={camStyle(K)}>
        {/* D2 · cada acto tiene MATERIAL REAL de fondo, ⛔ nunca un degradé haciendo de pared */}
        {f < A2 + 26 ? <Backplate img="clembudo_s302" clip="clembudo_s302" from={8} dur={150} rate={0.86} z={-600} scale={1.42} veil={0.5} /> : null}
        {f >= A2 && f < A3 + 26 ? <Backplate img="clembudo_s304" clip="clembudo_s304" from={A2 + 4} dur={150} rate={0.84} z={-600} scale={1.4} veil={0.52} /> : null}
        {f >= A3 && f < A4 + 26 ? <Backplate img="clembudo_s301" clip="clembudo_s301" from={A3 + 4} dur={150} rate={0.86} z={-600} scale={1.4} veil={0.5} /> : null}
        {f >= A4 && f < A5 + 26 ? <Backplate img="clembudo_s309" clip="clembudo_s309" from={A4 + 4} dur={150} rate={0.86} z={-600} scale={1.4} veil={0.52} /> : null}
        {f >= A5 && f < A6 + 26 ? <Backplate img="clembudo_s311" clip="clembudo_s311" from={A5 + 4} dur={150} rate={0.84} z={-600} scale={1.4} veil={0.52} /> : null}
        {f >= A6 ? <Backplate img="clembudo_s313" clip="clembudo_s313" from={A6 + 4} dur={148} rate={0.9} z={-600} scale={1.38} veil={0.48} /> : null}

        {/* el piso del galpón: gira sobre su borde INFERIOR y hacia atrás (⛔ jamás se adelanta) */}
        <Ground y={1250} h={1300} z0={-250} tilt={63} veil={0.64} />

        {/* ═══ A1 → F1 · LA SUPERFICIE DECOLORADA, por donde ENTRA la cámara ═══════════════════ */}
        {f < A2 + 14 ? (
          <Plate
            cx={lerp(lerp(1340, 1010, sup), 960, supZoom)}
            cy={lerp(lerp(600, 512, sup), 540, supZoom)}
            w={lerp(lerp(440, 1000, sup), 1000 * 6.5, supZoom)}
            z={lerp(lerp(-240, 180, sup), 880, supZoom)}
            ry={lerp(lerp(-22, -5, sup), 0, supZoom)}
            dim={(1 - sup) * 0.62} lift={1.35}
          >
            <Mat img="clembudo_s303" clip="clembudo_s303" from={116} dur={150} rate={0.86} kb={1.05} />
          </Plate>
        ) : null}

        {/* ═══ A2 · LA MANCHA QUE VOLVIÓ EN EL MISMO LUGAR ═════════════════════════════════════ */}
        {volvio > 0.004 ? (
          <Plate
            cx={lerp(560, 700, volvio)} cy={lerp(640, 528, volvio)} w={lerp(440, 940, volvio)}
            z={lerp(-240, 190, volvio)} ry={lerp(20, 5, volvio)} dim={(1 - volvio) * 0.62} lift={1.35}
          >
            <Mat img="clembudo_s306" clip="clembudo_s306" from={618} dur={150} rate={0.86} kb={1.05} />
          </Plate>
        ) : null}

        {/* ═══ A4 · LA RECETA — la taza colmada y la fila de baldes, cada una en su 16:9 ═══════ */}
        {taza > 0.004 ? (
          <Plate
            cx={fitCx(lerp(1400, 1160, taza), lerp(440, 900, taza), lerp(-230, 190, taza), K)} cy={lerp(620, 520, taza)} w={lerp(440, 900, taza)}
            z={lerp(-230, 190, taza)} ry={lerp(-20, -4, taza)} dim={(1 - taza) * 0.6} lift={1.35}
          >
            <Mat img="clembudo_s308" clip="clembudo_s308" from={A4 + 24} dur={150} rate={0.86} kb={1.05} />
          </Plate>
        ) : null}
        {baldes > 0.004 ? (
          <Plate
            cx={fitCx(lerp(540, 720, baldes), lerp(420, 880, baldes), lerp(-250, 170, baldes), K)} cy={lerp(680, 560, baldes)} w={lerp(420, 880, baldes)}
            z={lerp(-250, 170, baldes)} ry={lerp(22, 6, baldes)} dim={(1 - baldes) * 0.6} lift={1.3}
          >
            <Mat img="clembudo_s310" clip="clembudo_s310" from={1220} dur={110} rate={0.9} kb={1.05} />
          </Plate>
        ) : null}

        {/* ═══ A5 · EL MECANISMO — la boca del poro (MATCH-SHAPE desde el círculo del balde) ═══ */}
        {poro > 0.004 && f < A6 + 10 ? (
          <div
            style={{
              position: "absolute",
              left: 960 - lerp(210, 760, poro), top: 520 - lerp(210, 760, poro),
              width: lerp(420, 1520, poro), height: lerp(420, 1520, poro),
              borderRadius: "50%", overflow: "hidden",
              transform: `translateZ(${lerp(-120, 150, poro).toFixed(1)}px)`,
              boxShadow: "0 26px 70px rgba(18,13,8,0.6), inset 0 0 90px rgba(14,10,6,0.75)",
              background: "#15110B",
            }}
          >
            <div style={{ position: "absolute", left: "-14%", top: "-14%", width: "128%", height: "128%" }}>
              <Mat img={cristal > 0.5 ? "clembudo_s312" : "clembudo_s311"} clip={cristal > 0.5 ? undefined : "clembudo_s311"} from={A5 + 10} dur={150} rate={0.84} kb={1.06} />
            </div>
            {/* el borde del poro: materia, no un anillo CSS suelto */}
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", boxShadow: "inset 0 0 0 10px rgba(52,40,24,0.7), inset 0 0 120px rgba(12,9,5,0.8)" }} />
          </div>
        ) : null}

        {/* ═══ A6 · EL CAREO — la botella vacía y la taza en alto, el mismo gesto, dos materias ═ */}
        {careo > 0.004 ? (
          <Plate
            cx={lerp(1100, 960, careo)} cy={lerp(560, 470, careo)} w={lerp(520, 1060, careo)}
            z={lerp(-200, 200, careo)} ry={lerp(-14, -2, careo)} dim={(1 - careo) * 0.6} lift={1.4}
          >
            <Mat img="clembudo_s313" clip="clembudo_s313" from={A6 + 12} dur={137} rate={0.9} kb={1.05} />
          </Plate>
        ) : null}
      </AbsoluteFill>

      {/* entrada del ambiente ≤15 f (⛔ nada de 2 s subiendo desde negro) */}
      {rin < 0.999 ? <AbsoluteFill style={{ background: "rgba(20,16,10,1)", opacity: 1 - rin, pointerEvents: "none" }} /> : null}

      {/* ═══ FRONTERA 3 · WIPE POR MATERIA — el polvo blanco cae y detrás ya está la receta ═════ */}
      {polvo > 0.002 && polvo < 0.998 ? (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute", left: -60, right: -60,
              top: `${(polvo * 168 - 64).toFixed(1)}%`, height: "58%",
              transform: "skewY(1.4deg)",
              background: "linear-gradient(180deg, rgba(246,242,230,0) 0%, rgba(248,245,234,0.62) 34%, rgba(252,250,242,0.80) 58%, rgba(246,242,230,0) 100%)",
            }}
          />
          {new Array(64).fill(0).map((_, i) => {
            const t = (rng(37, i) + polvo * 1.4) % 1;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: rng(59, i) * 1920,
                  top: `${(t * 130 - 16).toFixed(2)}%`,
                  width: 2 + rng(83, i) * 4,
                  height: 2 + rng(83, i) * 4,
                  borderRadius: "50%",
                  background: "rgba(255,253,246,0.92)",
                  opacity: Math.sin(Math.min(1, Math.max(0, polvo)) * Math.PI),
                }}
              />
            );
          })}
        </AbsoluteFill>
      ) : null}

      {/* L5 · clave que se templa a lo largo del movimiento (galpón frío → agua caliente) */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(74% 58% at ${(28 + L * 14).toFixed(1)}% ${(18 + L * 8).toFixed(1)}%, rgba(255,208,138,${(0.05 + L * 0.19).toFixed(3)}) 0%, rgba(255,190,112,0) 62%)`,
          mixBlendMode: "screen", pointerEvents: "none",
        }}
      />

      {/* FRONTERA 5 · OCLUSIÓN — el cuero del delantal (⛔ nunca el color del fondo) */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Occluder at={A6} len={12} color="#B5854F" angle={8} />
      </AbsoluteFill>

      {/* ═══ EL PRECIO DEL KILO DE BÓRAX — nativo, en papel, arriba a la derecha ════════════════
          ⛔ Esto NO es el precio del curso (ése no se escribe nunca): es el kilo de bórax, que es
          justo el argumento del acto. Antes lo ponía un `BigStatReveal` montado ENCIMA de este
          movimiento, y las dos capas se veían una a través de la otra. ══════════════════════════ */}
      {precio > 0.004 ? (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute", right: 96, top: 112, opacity: precio,
              transform: `scale(${(1 + (1 - precio) * 0.22).toFixed(3)})`, transformOrigin: "100% 0%",
            }}
          >
            <Paper pad={22} tilt={1.2}>
              <div style={{ textAlign: "right" }}>
                <Kick size={27} color={C.gold}>EL KILO DE BÓRAX</Kick>
                <div style={{ height: 6 }} />
                <Ink size={124}>$2 a $5</Ink>
                <div style={{ marginTop: 8, fontSize: 32, color: C.inkSoft }}>Rinde dieciséis litros</div>
              </div>
            </Paper>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* ═══ L8 · TEXTO — 1 idea por acto, titular ≤7 palabras, anclado por bottom/left ═════════ */}
      <LowerBed o={0.9} />
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Lower f={f} from={10}   to={220}  kick="LO QUE NO FUNCIONA"  head="El cloro no mata el moho." />
        <Lower f={f} from={238}  to={278}  kick="POR QUÉ PARECE"      head="Sólo decolora la superficie." />
        <Lower f={f} from={298}  to={412}  kick="LO QUE SÍ ENTRA"     head="El agua, hasta el fondo del poro." />
        <Lower f={f} from={430}  to={600}  kick="DONDE ESTÁ EL HONGO" head="La raíz vive adentro del poro." />
        <Lower f={f} from={618}  to={676}  kick="TRES SEMANAS"        head="Vuelve en el mismo lugar." />
        <Lower f={f} from={700}  to={900}  kick="POR ESO TE LLAMAN"   head="Ya lo intentó, y le falló." />
        <Lower f={f} from={926}  to={1090} kick="LO QUE SÍ FUNCIONA"  head="Bórax: una taza en cuatro litros." />
        <Lower f={f} from={1220} to={1266} kick="EL AGUA"             head="Lo más caliente que puedas." />
        <Lower f={f} from={1292} to={1390} kick="CÓMO ACTÚA"          head="Baja con el agua hasta la raíz." />
        <Lower f={f} from={1408} to={1600} kick="CUANDO SE EVAPORA"   head="Queda cristalizado adentro." />
        <Lower f={f} from={1632} to={1758} kick="LA DIFERENCIA"       head="El bórax se queda de guardia." />
      </AbsoluteFill>

      {/* L9 · atmósfera — montada UNA sola vez para los 1767 frames, jamás se remonta */}
      <Atmos t={L} dust={28} />
    </AbsoluteFill>
  );
};

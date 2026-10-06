// MovCuatroPasos.tsx — clembudo · El Constructor Libre · 373,5 s → 431,4 s · 1737 frames @30fps
//
// "El trabajo son CUATRO PASOS, y el orden importa." El objeto protagonista del movimiento es LA
// PARED: se moja, se raspa, se aplica y se deja secar. Los cuatro pasos son cuatro estados de la
// MISMA pared, no cuatro tarjetas distintas — por eso la materia cruza todas las fronteras.
//
// ═══ QUÉ CAMBIÓ EN LA REHECHURA (sep-2026) — este movimiento tenía DOS defectos ═════════════════
//  D5 · MINIATURAS HUÉRFANAS ILEGIBLES (390 s y 420 s: la tira Mojar / Raspar / Aplicar / Esperar).
//       Eran thumbnails de ~90 px pegados al borde inferior, a opacidad muy baja, con etiquetas
//       que no se leían y uno de ellos tapado por un balde del b-roll. La regla que sale de ahí es
//       dura: **o se ven o no van**. AHORA el índice de los cuatro pasos es un objeto REAL de la
//       escena — cuatro `<Plate/>` de 380 px (214 px de alto, su 16:9 intacto) con la etiqueta EN
//       TINTA SOBRE PAPEL debajo — y NO vive todo el movimiento: aparece en cada cambio de paso,
//       ~2 s, cuando es la información que importa, y se va. El paso activo se agranda y los otros
//       tres se hunden con `dim` (⛔ nunca con `opacity`, que es lo que hacía el fantasma).
//  D2 · ACTOS VACÍOS (420 s: un degradé plano y nada más). Cada acto tiene ahora su `<Backplate/>`
//       —material REAL a cuadro completo— y su objeto protagonista encima.
//
// ═══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF  (cada acto arranca EXACTAMENTE en el exitTo del anterior)
// ═══════════════════════════════════════════════════════════════════════════════════════════════
// A1 · LOS CUATRO PASOS                                              f 0 → 144   (145 f · 4,8 s)
//    enterFrom cam {z 1.02, panX  20, panY   6, ry  3.0, rx  0.6} · luz 0.450
//              materia: — (del MovCloroBorax: el galpón todavía cálido)
//    exitTo    cam {z 1.06, panX   0, panY   0, ry  1.2, rx  0.2} · luz 0.432
//              materia: EL ÍNDICE DE CUATRO, armado y con el paso 1 al frente
//    protagonista: s315 (cuatro dedos y las cuatro herramientas alineadas en el piso)
//
//    ── FRONTERA 1 @f145 · ZOOM-THROUGH ────────────────────────────────────────────────────────
//    La cámara ENTRA en la tarjeta del paso 1 del índice: esa tarjeta crece hasta dominar el
//    cuadro y adentro ya está el error (alguien lijando en seco). Índice → plano de producto.
//
// A2 · PASO 1 · EL ERROR: nunca cepilles en seco                     f 145 → 541 (397 f · 13,2 s)
//    enterFrom = exitTo A1                                           · luz 0.432
//              materia: la tarjeta del paso 1, ya agrandada
//    exitTo    cam {z 1.12, panX −52, panY −14, ry −1.6, rx −0.8} · luz 0.383
//              materia: LA NUBE DE ESPORAS a contraluz (s317), ocupando el aire del cuadro
//    protagonista: s316 (lijando en seco) → s317 (el haz de luz lleno de partículas)
//
//    ── FRONTERA 2 @f542 · WIPE POR MATERIA ────────────────────────────────────────────────────
//    El ROCÍO del pulverizador cruza el cuadro de izquierda a derecha y detrás ya está la pared
//    mojada. Es agua real atravesando el plano: la costura ES el paso 1 bien hecho.
//
// A3 · PASO 1 BIEN HECHO: primero rocías y esperas                   f 542 → 673 (132 f · 4,4 s)
//    enterFrom = exitTo A2                                           · luz 0.383
//              materia: el rocío pasando
//    exitTo    cam {z 1.15, panX −20, panY −30, ry  1.0, rx −1.2} · luz 0.366
//              materia: la pared YA MOJADA, oscura, en héroe
//    protagonista: s318 (rocía y la pared se va oscureciendo)
//
//    ── FRONTERA 3 @f674 · CORTE EN EL BEAT ────────────────────────────────────────────────────
//    Corte seco EXACTO en el "dos" (395,98 s · f674). Encuadre, escala y luz calzan: la pared
//    mojada de A3 y la pared mojada de A4 son el mismo plano, sólo que ahora entra la espátula.
//
// A4 · PASO 2 · RASPAR, Y EL MARGEN DE 30 cm                         f 674 → 1316 (643 f · 21,4 s)
//    enterFrom = exitTo A3                                           · luz 0.366
//              materia: la pared mojada; la espátula entra en cuadro
//    exitTo    cam {z 1.19, panX  44, panY −52, ry  4.2, rx −1.6} · luz 0.286
//              materia: EL ANILLO DE MOHO alrededor del parche (s321) — la garantía que se cae
//    protagonista: s319 (raspa) → s320 (mide el margen) → s321/s322 (el anillo)
//
//    ── FRONTERA 4 @f1317 · OCLUSIÓN ───────────────────────────────────────────────────────────
//    La BROCHA ANCHA cargada cruza el lente y tapa el 100 % ~5 frames (#8A6A3C, el pelo mojado de
//    la brocha — ⛔ NO el color del fondo, que haría un fundido a negro). Detrás ya está el paso 3.
//
// A5 · PASO 3 · APLICAS GENEROSO: la zona y el margen                f 1317 → 1444 (128 f · 4,3 s)
//    enterFrom = exitTo A4                                           · luz 0.286
//              materia: la brocha, que acaba de cruzar, ahora aplicando
//    exitTo    cam {z 1.14, panX  12, panY −24, ry  2.0, rx −0.6} · luz 0.272
//              materia: LA BANDA MOJADA chorreando por la pared
//    protagonista: s323 (la banda generosa, la solución chorreando)
//
//    ── FRONTERA 5 @f1445 · MATCH-MOVE ─────────────────────────────────────────────────────────
//    La cámara ya viene abriéndose hacia la derecha y la ventana lateral entra por ese mismo
//    vector: el contenido cambia DETRÁS del movimiento, nada arranca ni se detiene.
//
// A6 · PASO 4 · ESPERAR: 24 a 48 horas ventilando                    f 1445 → 1736 (292 f · 9,7 s)
//    enterFrom = exitTo A5                                           · luz 0.272
//              materia: la ventana abriéndose, la pared tratada secando
//    exitTo    cam {z 1.08, panX −30, panY  10, ry −1.0, rx  0.0} · luz 0.250
//              materia: EL RODILLO DETENIDO a centímetros de la pared húmeda (s325) — el open loop
//              que paga el componente `PullQuote` que viene justo después, en 436,9 s
//    protagonista: s324 (abre la ventana) → s325 (el rodillo que se frena)
//
// COSTURAS EN ORDEN: ZOOM-THROUGH · WIPE POR MATERIA · CORTE EN EL BEAT · OCLUSIÓN · MATCH-MOVE
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

const DUR = 1737;

const A2 = 145;   // 378,32 "nunca cepilles el moho en seco"
const A3 = 542;   // 391,58 "primero rocías"
const A4 = 674;   // 395,98 "dos"
const A5 = 1317;  // 417,40 "tres"
const A6 = 1445;  // 421,68 "y cuatro"

const EZ = Easing.bezier(0.22, 0.61, 0.24, 1);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const ramp = (f: number, a: number, b: number, e = EZ) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });

type CamK = { z: number; panX: number; panY: number; ry: number; rx: number };
const LEGS: Array<[number, CamK]> = [
  [0,   { z: 1.02, panX:  20, panY:   6, ry:  3.0, rx:  0.6 }],
  [A2,  { z: 1.06, panX:   0, panY:   0, ry:  1.2, rx:  0.2 }],
  [A3,  { z: 1.12, panX: -52, panY: -14, ry: -1.6, rx: -0.8 }],
  [A4,  { z: 1.15, panX: -20, panY: -30, ry:  1.0, rx: -1.2 }],
  [A5,  { z: 1.19, panX:  44, panY: -52, ry:  4.2, rx: -1.6 }],
  [A6,  { z: 1.14, panX:  12, panY: -24, ry:  2.0, rx: -0.6 }],
  [DUR, { z: 1.08, panX: -30, panY:  10, ry: -1.0, rx:  0.0 }],
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

// ── EL ÍNDICE DE LOS CUATRO PASOS ───────────────────────────────────────────────────────────────
// ⛔ D5: 380 px de ancho MÍNIMO (214 de alto, su 16:9 intacto) y la etiqueta en tinta sobre papel
// a 40 px. Nada de miniaturas de 90 px pegadas al borde: o se ven o no van. Y no vive todo el
// movimiento: se muestra en cada cambio de paso, cuando ES la información que importa.
const PASOS = [
  { img: "clembudo_s318", lbl: "Mojar" },
  { img: "clembudo_s319", lbl: "Raspar" },
  { img: "clembudo_s323", lbl: "Aplicar" },
  { img: "clembudo_s324", lbl: "Esperar" },
];
// ventanas del índice: [desde, hasta, paso activo]. Una por cambio de paso.
const VENTANAS: Array<[number, number, number]> = [
  [96, 200, 0],
  [546, 640, 0],
  [678, 790, 1],
  [1320, 1408, 2],
  [1448, 1552, 3],
];

const IND_W = 380;                       // ancho de cada tarjeta del índice (alto 214)
const IND_GAP = 42;
const IND_Y = 232;                       // banda superior, lejos del texto de abajo
const IND_X0 = (1920 - (IND_W * 4 + IND_GAP * 3)) / 2 + IND_W / 2;

export const MovCuatroPasos: React.FC = () => {
  const f = useCurrentFrame();
  const K = camAt(f);
  const L = luz(f, DUR, 0.45, 0.25);
  const rin = rampIn(f, 14);

  // ── ÍNDICE: en qué ventana estamos y con cuánta fuerza ───────────────────────────────────────
  let indK = 0, activo = 0;
  for (const [a, b, p] of VENTANAS) {
    const k = ramp(f, a, a + 16, Easing.out(Easing.cubic)) * (1 - ramp(f, b, b + 18, Easing.in(Easing.cubic)));
    if (k > indK) { indK = k; activo = p; }
  }

  // ── A2 · el error y su consecuencia: la nube de esporas que se posa en toda la casa ──────────
  const nube = ramp(f, 330, 400, Easing.out(Easing.cubic)) * (1 - ramp(f, A3 - 30, A3, Easing.in(Easing.cubic)));

  // ── FRONTERA 2 · WIPE POR MATERIA: el rocío cruza y detrás ya está la pared mojada ───────────
  const rocio = ramp(f, A3 - 18, A3 + 22, Easing.inOut(Easing.cubic));

  // ── A4 · el margen de 30 cm y el anillo que aparece si se trata justo el borde ───────────────
  const margen = ramp(f, 812, 872, Easing.out(Easing.cubic)) * (1 - ramp(f, 990, 1024, Easing.in(Easing.cubic)));
  const anillo = ramp(f, 1032, 1092, Easing.out(Easing.cubic)) * (1 - ramp(f, A5 - 40, A5 - 6, Easing.in(Easing.cubic)));

  // ── A6 · el rodillo que se frena (el open loop que paga el PullQuote de 436,9 s) ─────────────
  const rodillo = ramp(f, 1648, 1700, Easing.out(Easing.cubic));

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={camStyle(K)}>
        {/* D2 · el fondo de cada acto es MATERIAL REAL a cuadro completo, nunca un degradé plano */}
        {f < A2 + 26 ? <Backplate img="clembudo_s315" clip="clembudo_s315" from={6} dur={148} rate={0.9} z={-600} scale={1.42} veil={0.5} /> : null}
        {f >= A2 && f < A3 + 26 ? <Backplate img="clembudo_s316" clip="clembudo_s316" from={A2 + 4} dur={150} rate={0.86} z={-600} scale={1.4} veil={0.52} /> : null}
        {f >= A3 && f < A4 + 26 ? <Backplate img="clembudo_s318" clip="clembudo_s318" from={A3 + 4} dur={126} rate={0.9} z={-600} scale={1.4} veil={0.5} /> : null}
        {f >= A4 && f < A5 + 26 ? <Backplate img="clembudo_s319" clip="clembudo_s319" from={A4 + 4} dur={150} rate={0.84} z={-600} scale={1.4} veil={0.52} /> : null}
        {f >= A5 && f < A6 + 26 ? <Backplate img="clembudo_s323" clip="clembudo_s323" from={A5 + 4} dur={122} rate={0.9} z={-600} scale={1.4} veil={0.5} /> : null}
        {f >= A6 ? <Backplate img="clembudo_s324" clip="clembudo_s324" from={A6 + 4} dur={150} rate={0.86} z={-600} scale={1.38} veil={0.48} /> : null}

        {/* el piso del taller: gira sobre su borde INFERIOR y hacia atrás (⛔ jamás se adelanta) */}
        <Ground y={1250} h={1300} z0={-250} tilt={63} veil={0.64} />

        {/* ═══ A2 · LA NUBE DE ESPORAS — la consecuencia del error, en su propia tarjeta ═══════ */}
        {nube > 0.004 ? (
          <Plate
            cx={lerp(1400, 1200, nube)} cy={lerp(660, 560, nube)} w={lerp(420, 900, nube)}
            z={lerp(-260, 180, nube)} ry={lerp(-22, -5, nube)} dim={(1 - nube) * 0.65} lift={1.35}
          >
            <Mat img="clembudo_s317" clip="clembudo_s317" from={336} dur={150} rate={0.86} kb={1.05} />
          </Plate>
        ) : null}

        {/* ═══ A4 · EL MARGEN DE 30 cm — la mano midiendo más allá del borde de la mancha ══════ */}
        {margen > 0.004 ? (
          <Plate
            cx={lerp(520, 660, margen)} cy={lerp(640, 552, margen)} w={lerp(440, 880, margen)}
            z={lerp(-230, 170, margen)} ry={lerp(20, 6, margen)} dim={(1 - margen) * 0.62} lift={1.3}
          >
            <Mat img="clembudo_s320" clip="clembudo_s320" from={818} dur={150} rate={0.86} kb={1.05} />
          </Plate>
        ) : null}

        {/* ═══ A4 · EL ANILLO — el parche limpio rodeado de moho: la garantía que se cae ═══════ */}
        {anillo > 0.004 ? (
          <>
            <Plate
              cx={lerp(1240, 1080, anillo)} cy={lerp(600, 506, anillo)} w={lerp(460, 960, anillo)}
              z={lerp(-220, 200, anillo)} ry={lerp(-18, -4, anillo)} dim={(1 - anillo) * 0.62} lift={1.4}
            >
              <Mat img="clembudo_s321" kb={1.04 + anillo * 0.05} />
            </Plate>
            <Plate
              cx={fitCx(lerp(450, 500, anillo), lerp(300, 410, anillo), lerp(-300, -40, anillo), K)} cy={lerp(880, 806, anillo)} w={lerp(300, 410, anillo)}
              z={lerp(-300, -40, anillo)} ry={22} dim={0.2 + (1 - anillo) * 0.5} lift={1}
            >
              <Mat img="clembudo_s322" clip="clembudo_s322" from={1046} dur={140} rate={0.9} kb={1.05} />
            </Plate>
            {/* rojo seco: la consecuencia tiene su propia luz, y evoluciona con el acto */}
          </>
        ) : null}

        {/* ═══ A6 · EL RODILLO DETENIDO — el open loop del final del movimiento ════════════════ */}
        {rodillo > 0.004 ? (
          <Plate
            cx={lerp(1420, 1140, rodillo)} cy={lerp(640, 524, rodillo)} w={lerp(420, 1020, rodillo)}
            z={lerp(-240, 210, rodillo)} ry={lerp(-20, -3, rodillo)} dim={(1 - rodillo) * 0.65} lift={1.4}
          >
            <Mat img="clembudo_s325" clip="clembudo_s325" from={1654} dur={83} rate={0.9} kb={1.05} />
          </Plate>
        ) : null}
      </AbsoluteFill>

      {/* entrada del ambiente ≤15 f (⛔ nada de 2 s subiendo desde negro) */}
      {rin < 0.999 ? <AbsoluteFill style={{ background: "rgba(20,16,10,1)", opacity: 1 - rin, pointerEvents: "none" }} /> : null}

      {/* ═══ FRONTERA 2 · WIPE POR MATERIA — el rocío del pulverizador cruza el cuadro ══════════ */}
      {rocio > 0.002 && rocio < 0.998 ? (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute", top: -80, bottom: -80,
              left: `${(rocio * 150 - 42).toFixed(1)}%`, width: "44%",
              transform: "skewX(-9deg)",
              background: "linear-gradient(90deg, rgba(206,224,236,0) 0%, rgba(214,230,242,0.50) 26%, rgba(228,240,250,0.72) 52%, rgba(206,224,236,0) 100%)",
            }}
          />
          {new Array(56).fill(0).map((_, i) => {
            const t = (rng(53, i) + rocio * 1.35) % 1;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${(t * 128 - 14).toFixed(2)}%`,
                  top: rng(71, i) * 1080,
                  width: 2 + rng(89, i) * 3,
                  height: 2 + rng(89, i) * 3,
                  borderRadius: "50%",
                  background: "rgba(236,246,255,0.86)",
                  opacity: Math.sin(Math.min(1, Math.max(0, rocio)) * Math.PI),
                }}
              />
            );
          })}
        </AbsoluteFill>
      ) : null}

      {/* L5 · clave cálida que se va enfriando (la pared se moja y baja la temperatura del acto) */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(74% 58% at ${(30 + L * 12).toFixed(1)}% ${(18 + L * 8).toFixed(1)}%, rgba(255,206,132,${(0.05 + L * 0.19).toFixed(3)}) 0%, rgba(255,190,110,0) 62%)`,
          mixBlendMode: "screen", pointerEvents: "none",
        }}
      />
      {/* el rojo seco del anillo: la consecuencia tiene su propia luz */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(96% 74% at 54% 48%, rgba(176,80,60,0) 42%, rgba(176,80,60,0.28) 100%)",
          mixBlendMode: "multiply", pointerEvents: "none", opacity: anillo * 0.9,
        }}
      />

      {/* ═══ FRONTERA 4 · OCLUSIÓN — la brocha ancha cargada (⛔ nunca el color del fondo) ═══════ */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Occluder at={A5} len={12} color="#8A6A3C" angle={10} />
      </AbsoluteFill>

      {/* ═══ EL ÍNDICE DE LOS CUATRO PASOS — en espacio de PANTALLA, a tamaño legible ═══════════ */}
      {indK > 0.004 ? (
        <AbsoluteFill style={{ pointerEvents: "none", opacity: indK }}>
          <div style={{ position: "absolute", inset: 0, perspective: 1600 }}>
            <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
              {PASOS.map((p, i) => {
                const on = i === activo ? 1 : 0;
                const w = IND_W * (1 + on * 0.14);
                return (
                  <React.Fragment key={p.img}>
                    <Plate
                      cx={IND_X0 + i * (IND_W + IND_GAP)}
                      cy={IND_Y + (1 - indK) * 26 - on * 10}
                      w={w}
                      z={on * 120 - 40}
                      ry={(i - 1.5) * 3}
                      // ⛔ el hundido va con `dim`, no con opacity: una tarjeta semitransparente
                      // deja ver el b-roll de atrás y ése es el fantasma del D4.
                      dim={on ? 0 : 0.52}
                      lift={0.9 + on * 0.5}
                    >
                      {/* el índice lleva la FOTO (que es el frame 0 del clip): no hace falta decodificar
                          cuatro videos para una ventana de 2 s, y el cuadro es exactamente el mismo */}
                      <Mat img={p.img} kb={1.05 + on * 0.03} />
                    </Plate>
                    <div
                      style={{
                        position: "absolute",
                        left: IND_X0 + i * (IND_W + IND_GAP) - w / 2,
                        top: IND_Y + w / (16 / 9) / 2 + 24 + (1 - indK) * 26 - on * 10,
                        width: w, textAlign: "center",
                      }}
                    >
                      <Paper pad={10} tilt={(i % 2 ? 0.5 : -0.5)}>
                        <Ink size={48} color={on ? C.ink : C.inkSoft}>{`${i + 1}. ${p.lbl}`}</Ink>
                      </Paper>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* ═══ L8 · TEXTO — 1 idea por acto, titular ≤7 palabras, anclado por bottom/left ═════════ */}
      <LowerBed o={0.9} />
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Lower f={f} from={10}   to={120}  kick="EL TRABAJO"        head="Cuatro pasos, y el orden importa." />
        <Lower f={f} from={152}  to={300}  kick="UNO · NUNCA EN SECO" head="Si lijas moho seco, lo haces volar." />
        <Lower f={f} from={352}  to={524}  kick="LO QUE PASA"       head="Una nube de esporas por toda la casa." />
        <Lower f={f} from={592}  to={660}  kick="PRIMERO"           head="Rocías, mojas y esperas cinco minutos." />
        <Lower f={f} from={700}  to={790}  kick="DOS · RASPAR"      head="Con la superficie ya húmeda." />
        <Lower f={f} from={810}  to={960}  kick="EL MARGEN"         head="Treinta centímetros más allá." />
        <Lower f={f} from={1030} to={1180} kick="SI TRATAS EL BORDE" head="Te reaparece como un anillo." />
        <Lower f={f} from={1200} to={1300} kick="EN UN TRABAJO COBRADO" head="Esa es la garantía que se te cae." />
        <Lower f={f} from={1346} to={1436} kick="TRES · APLICAR"    head="Generoso: la zona y el margen." />
        <Lower f={f} from={1480} to={1620} kick="CUATRO · ESPERAR"  head="Es el que decide si el trabajo dura." />
        <Lower f={f} from={1644} to={1726} kick="VENTILANDO"        head="Veinticuatro a cuarenta y ocho horas." />
      </AbsoluteFill>

      {/* L9 · atmósfera — montada UNA sola vez para los 1737 frames, jamás se remonta */}
      <Atmos t={L} dust={30} />
    </AbsoluteFill>
  );
};

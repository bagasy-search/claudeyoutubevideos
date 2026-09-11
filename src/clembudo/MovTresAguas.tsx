// MovTresAguas.tsx — clembudo · El Constructor Libre · 199,5 s → 252,0 s · 1575 frames @30fps
//
// PICO DE VALOR DEL VIDEO: "el agua sólo puede venir de TRES lugares". Es el momento de LA LÁMINA:
// una página REAL del curso (`img/laminas/m02_03_tres_origenes.png`) y sus tres flechas
// (EL AIRE / DE AFUERA / EL SUELO) son el índice del movimiento entero.
//
// ═══ QUÉ CAMBIÓ EN LA REHECHURA (sep-2026) — este movimiento tenía TRES defectos ════════════════
//  D3 · TEXTO CORTADO POR EL BORDE (221 s: "10 a 15 litros" se leía "0 a 15 litros", y "EL AIRE"
//       de la lámina quedaba cortado contra el borde izquierdo).
//       CAUSA MEDIDA: la lámina vivía DENTRO de la cámara, en coordenadas de mundo. Con `lx = 70`
//       parecía respetar los 60 px de safe area, pero la cámara tenía `scale(z)` ≈ 1,09 y la
//       perspectiva AGRANDA: el borde izquierdo real terminaba en x ≈ 39 y, con el paneo, afuera.
//       AHORA: la lámina es `<Lamina/>`, que vive en ESPACIO DE PANTALLA y se clava con 60 px de
//       margen REAL. Además es lo que el canal pide: entera, nítida y QUIETA, sin tipografía
//       encima. Y todo el texto pasó a `<Lower/>`, anclado por bottom/left en píxeles de pantalla.
//  D4 · FANTASMA DE DOBLE EXPOSICIÓN (210 s). Dos causas, la misma raíz: la profundidad se pintaba
//       con `opacity` — la lámina tenía una prop `op` y la tira de materiales iba a
//       `opacity: 0.35 + dim*0.65`. Una foto semitransparente deja ver el b-roll de atrás y eso ES
//       el fantasma. AHORA: `<Plate dim={}/>` — la tarjeta es SIEMPRE opaca y lo que se hunde es
//       un velo NEGRO pintado adentro.
//  D2 · ACTOS VACÍOS (236 s: un degradé plano y nada más). El fondo del mundo eran tres divs con
//       `linear-gradient` haciendo de pared, viga y mesa. AHORA cada acto tiene su `<Backplate/>`
//       —material REAL a cuadro completo— y su objeto protagonista encima.
//
// ═══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF  (cada acto arranca EXACTAMENTE en el exitTo del anterior)
// ═══════════════════════════════════════════════════════════════════════════════════════════════
// A1 · LA PÁGINA DEL CURSO                                          f 0 → 207   (207 f · 6,9 s)
//    enterFrom cam {z 1.02, panX   0, panY  −8, ry −5.0, rx  5.0} · luz 0.150
//              materia: — (el movimiento entra; la mesa SUBE y ocluye al avatar)
//    exitTo    cam {z 1.03, panX −40, panY  14, ry −3.0, rx  3.4} · luz 0.170
//              materia: LA LÁMINA en héroe + el aro verde encendido sobre la flecha EL AIRE
//    protagonista: la lámina (pantalla) · fondo: s206 (Claudio levanta tres dedos)
//
//    ── FRONTERA 1 @f208 · ZOOM-THROUGH ────────────────────────────────────────────────────────
//    Un portal circular nace EXACTAMENTE en la flecha verde de la lámina y se abre hasta el cuadro
//    entero; adentro ya está el macro del vidrio empañado. General → macro, que es para lo que
//    sirve esta costura. ⛔ No hay fundido: lo que crece es un agujero en la lámina.
//
// A2 · EL VASO FRÍO — condensación                                  f 208 → 595 (388 f · 12,9 s)
//    enterFrom = exitTo A1                                          · luz 0.170
//              materia: el portal abierto sobre el vidrio empañado (s207)
//    exitTo    cam {z 1.05, panX  30, panY  −6, ry  0.0, rx  1.0} · luz 0.205
//              materia: LA TIRA DE MATERIALES ya andando hacia la izquierda
//    protagonista: el vaso que transpira (s208) · fondo: s207
//
//    ── FRONTERA 2 @f596 · MATCH-MOVE ──────────────────────────────────────────────────────────
//    La tira ya viene desplazándose: el material cambia DETRÁS del movimiento mientras la cámara
//    sigue su propio vector. Nada arranca ni se detiene en la costura.
//
// A3 · LA CASA QUE SUELTA LITROS — travelling de materiales         f 596 → 1050 (455 f · 15,2 s)
//    enterFrom = exitTo A2                                          · luz 0.205
//              materia: la tira, en marcha
//    exitTo    cam {z 1.07, panX −20, panY −24, ry  2.0, rx −1.0} · luz 0.250
//              materia: la tira + el cuero del delantal entrando por el borde
//    protagonista: la olla y el rincón frío (s210, s212, s213) · fondo: s209
//
//    ── FRONTERA 3 @f1051 · OCLUSIÓN ───────────────────────────────────────────────────────────
//    Cruza EL CUERO DEL DELANTAL (#B5854F, luma ≈131 — ⛔ NO el color del fondo, que haría un
//    fundido a negro). Cambio de tema fuerte: del aire al muro. Pide tapar, no fundir.
//
// A4 · DE AFUERA — muro, teja, canaleta, junta                      f 1051 → 1300 (250 f · 8,3 s)
//    enterFrom = exitTo A3                                          · luz 0.250
//              materia: LA LÁMINA vuelve a héroe, ahora con el aro ROJO sobre DE AFUERA
//    exitTo    cam {z 1.08, panX  40, panY −70, ry  3.0, rx −1.8} · luz 0.276
//              materia: la tarjeta de LA JUNTA ABIERTA, de frente
//    protagonista: la teja partida y la canaleta (s215, s216) · fondo: s214
//
//    ── FRONTERA 4 @f1301 · MATCH-SHAPE ────────────────────────────────────────────────────────
//    La tarjeta de la junta abierta GIRA sobre su eje vertical (mismo rectángulo, mismo 16:9,
//    misma posición) y del otro lado ya está el arranque del muro contra la tierra.
//
// A5 · DEL SUELO — capilaridad                                      f 1301 → 1469 (169 f · 5,6 s)
//    enterFrom = exitTo A4                                          · luz 0.276
//              materia: la MISMA tarjeta, dada vuelta
//    exitTo    cam {z 1.09, panX −10, panY −96, ry  4.0, rx −2.2} · luz 0.292
//              materia: la banda de salitre del zócalo, en héroe
//    protagonista: el zócalo y el polvo blanco (s222, s223) · fondo: s217
//
//    ── FRONTERA 5 @f1470 · ZOOM-THROUGH ───────────────────────────────────────────────────────
//    Se entra en la línea de agua del zócalo y se sale en el café trepando el terrón. No es
//    vecina de la F1, así que ninguna frontera repite a su vecina.
//
// A6 · EL TERRÓN Y LAS TRES MANCHAS                                 f 1470 → 1574 (105 f · 3,5 s)
//    enterFrom = exitTo A5                                          · luz 0.292
//              materia: el café que trepa el terrón = la pared
//    exitTo    cam {z 1.10, panX  20, panY −30, ry  4.0, rx −1.0} · luz 0.300
//              materia: las TRES manchas alineadas (s219 · s220 · s222) — el índice cerrado
//    protagonista: el terrón (s218) · fondo: s218
//
// COSTURAS EN ORDEN: ZOOM-THROUGH · MATCH-MOVE · OCLUSIÓN · MATCH-SHAPE · ZOOM-THROUGH
// (⛔ ninguna es un fade · ⛔ no hay dos seguidas iguales)
//
// EL AVATAR: visible sólo f 0→54, mientras el movimiento sube desde abajo y lo ocluye (entrada por
// materia, ⛔ no por fade). De f 54 a 1575 el movimiento tapa el cuadro entero.
//
// LAS DOS LÁMINAS SE MUESTRAN ENTERAS, NÍTIDAS Y QUIETAS, SIN TIPOGRAFÍA MÍA ENCIMA:
//   · m02_19_regla_tres    → f 56 → 176 (4,0 s), a la derecha. Entra apoyándose, no fundiéndose.
//   · m02_03_tres_origenes → héroe en f 100→260 y otra vez en f 1059→1220.
//
// CONTRATO: cero Math.random/Date · cero backdrop-filter · cero blur grande · OffthreadVideo
// (nunca <Video>, nunca loop) · clips de 5,04 s: ninguna Sequence pide más de 150 frames.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  AR, Atmos, Backplate, C, Ground, Kick, Lamina, Lower, LowerBed, Mat, Occluder, Paper, Plate, fitCx, fitCx,
  cam, camStyle, luz, rampIn, rng, Ink,
} from "./Stage";

const DUR = 1575;
const LAM_TRES = "img/laminas/m02_03_tres_origenes.png";
const LAM_REGLA = "img/laminas/m02_19_regla_tres.png";

const EZ = Easing.bezier(0.22, 0.61, 0.24, 1);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const ramp = (f: number, a: number, b: number, e = EZ) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
// interpolación multi-parada con easing inOut por segmento → velocidad 0 en cada parada: continua
// en posición Y en velocidad. Nunca hay un "reset" de cámara ni un tirón en una frontera.
const ip = (f: number, k: number[], v: number[]) =>
  interpolate(f, k, v, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });

const A2 = 208, A3 = 596, A4 = 1051, A5 = 1301, A6 = 1470;

type CamK = { z: number; panX: number; panY: number; ry: number; rx: number };
const LEGS: Array<[number, CamK]> = [
  [0,   { z: 1.02, panX:   0, panY:  -8, ry: -5.0, rx:  5.0 }],
  [A2,  { z: 1.03, panX: -40, panY:  14, ry: -3.0, rx:  3.4 }],
  [A3,  { z: 1.05, panX:  30, panY:  -6, ry:  0.0, rx:  1.0 }],
  [A4,  { z: 1.07, panX: -20, panY: -24, ry:  2.0, rx: -1.0 }],
  [A5,  { z: 1.08, panX:  40, panY: -70, ry:  3.0, rx: -1.8 }],
  [A6,  { z: 1.09, panX: -10, panY: -96, ry:  4.0, rx: -2.2 }],
  [DUR, { z: 1.10, panX:  20, panY: -30, ry:  4.0, rx: -1.0 }],
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

// ── LA TIRA DE MATERIALES (A2 + A3): un solo travelling. El índice de héroe es FRACCIONARIO, así
// que la tira nunca corta: se desliza y el material cambia detrás del movimiento. ───────────────
const TIRA: { n: string; clip: boolean; from: number }[] = [
  { n: "clembudo_s207", clip: true,  from: 214 },  // el vidrio interior empañado, gotas que bajan
  { n: "clembudo_s208", clip: true,  from: 358 },  // el vaso frío transpirando sobre la madera
  { n: "clembudo_s211", clip: true,  from: 506 },  // el vapor arrastrándose por el techo
  { n: "clembudo_s209", clip: true,  from: 600 },  // la palma apoyada en la pared fría
  { n: "clembudo_s210", clip: true,  from: 664 },  // la olla destapada y la ropa tendida adentro
  { n: "clembudo_s212", clip: true,  from: 842 },  // el rincón de dos paredes exteriores
  { n: "clembudo_s213", clip: true,  from: 992 },  // la pared negra detrás del ropero
];

// ── las tres manchas del cierre: cada acto deja la suya y al final suben las tres ──────────────
const CHIPS = [
  { n: "clembudo_s219", nace: 1002, lbl: "EL AIRE" },     // difusa, arriba, en puntitos
  { n: "clembudo_s220", nace: 1268, lbl: "DE AFUERA" },   // óvalo café de borde duro
  { n: "clembudo_s222", nace: 1436, lbl: "EL SUELO" },    // banda desde el piso, con polvo blanco
];

// las tres flechas, en coordenadas normalizadas de la lámina en héroe (⛔ de PANTALLA, no de mundo)
const LAM_HERO = { cx: 700, cy: 468, w: 1120 };
// Los aros siguen a la lamina: cuando la de tres origenes se corre y se achica para no tapar a la
// otra, las flechas se mueven con ella. Si se dejaran fijas, el aro verde quedaria en el aire.
const flecha = (fx: number, fy: number, cx: number, w: number) => ({
  x: cx - w / 2 + w * fx,
  y: LAM_HERO.cy - w / AR / 2 + (w / AR) * fy,
});

// ── el aro que marca una flecha. Es un ARO, no una mancha: no tapa la etiqueta de la lámina ────
const Aro: React.FC<{ f: number; x: number; y: number; r: number; color: string; k: number }> =
  ({ f, x, y, r, color, k }) => {
    if (k <= 0.004) return null;
    const pulse = 0.62 + Math.sin(f / 7.5) * 0.24;
    return (
      <div
        style={{
          position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2,
          borderRadius: "50%", opacity: k,
          border: `${Math.max(2, r * 0.055)}px solid ${color}`,
          boxShadow: `0 0 ${r * 0.7}px ${color}, inset 0 0 ${r * 0.5}px ${color}`,
          transform: `scale(${(0.92 + pulse * 0.12).toFixed(3)})`,
        }}
      />
    );
  };

// ── PORTAL circular en espacio de PANTALLA: la costura ZOOM-THROUGH. Nace en un punto exacto del
// cuadro y crece hasta taparlo; adentro ya está lo que viene. ⛔ No es un fade: es un agujero. ──
const Portal: React.FC<{ f: number; a: number; b: number; x: number; y: number; children: React.ReactNode }> =
  ({ f, a, b, x, y, children }) => {
    if (f < a) return null;
    const k = ramp(f, a, b, Easing.inOut(Easing.poly(3)));
    const r = lerp(38, 2400, k);
    const rad = lerp(999, 10, ramp(f, a, a + 26));
    return (
      <div
        style={{
          position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2,
          borderRadius: rad, overflow: "hidden",
          boxShadow: `0 0 ${(70 * (1 - k)).toFixed(0)}px rgba(255,244,214,${(0.5 * (1 - k)).toFixed(2)})`,
        }}
      >
        <div style={{ position: "absolute", left: r - 960, top: r - 540, width: 1920, height: 1080 }}>{children}</div>
      </div>
    );
  };

export const MovTresAguas: React.FC = () => {
  const f = useCurrentFrame();
  const K = camAt(f);
  const L = luz(f, DUR, 0.15, 0.30);
  const rin = rampIn(f, 14);

  // entrada por MATERIA: el movimiento sube desde abajo y ocluye al avatar (f 6 → 54)
  const sube = ramp(f, 6, 54, Easing.out(Easing.poly(3)));

  // ── LA TIRA: índice de héroe fraccionario (el travelling de A2 + A3) ─────────────────────────
  const hero = ip(
    f,
    [A2, 340, 366, 492, 516, 586, 610, 650, 672, 800, 824, 976, 1000, A4],
    [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6],
  );
  const PITCH = 1200;
  const tiraOn = f >= 240 && f < A4 + 10;
  const tiraOut = ramp(f, A4 - 26, A4 + 6, Easing.in(Easing.cubic));

  // ── A4/A5 · la tarjeta de LA JUNTA ABIERTA, que gira en la frontera 4 (MATCH-SHAPE) ──────────
  const junta = ramp(f, 1244, 1292, Easing.out(Easing.cubic));
  const giro = ramp(f, A5, A5 + 30, Easing.inOut(Easing.cubic)) * 180;
  const caraB = giro >= 90;
  const juntaOut = ramp(f, 1408, 1452, Easing.in(Easing.cubic));

  // La lámina en héroe: dos ventanas (el aire y de afuera). ⚠️ ENTRA COMO OBJETO — se apoya sobre
  // la mesa con un traslado y una escala, y la opacidad sólo acompaña 12 frames. Una hoja que
  // aparece fundiéndose durante un segundo es exactamente el fantasma del D4; una hoja que baja y
  // se apoya es una hoja. Mientras se lee está QUIETA y opaca.
  const heroA = ramp(f, 100, 118, Easing.out(Easing.poly(3))) * (1 - ramp(f, 244, 260, Easing.in(Easing.cubic)));
  const heroB = ramp(f, A4 + 8, A4 + 26, Easing.out(Easing.poly(3))) * (1 - ramp(f, 1200, 1220, Easing.in(Easing.cubic)));
  const lamHero = Math.max(heroA, heroB);
  const lamRegla = ramp(f, 56, 74, Easing.out(Easing.poly(3))) * (1 - ramp(f, 156, 176, Easing.in(Easing.cubic)));
  // MEDIDO SOBRE EL RENDER: entre f100 y f176 las DOS laminas estan en pantalla, y la de tres
  // origenes (dibujada despues, o sea encima) le tapaba los primeros 250 px a la de la regla:
  // se leia "LA DE LAS TRES FRASES" en vez de "LA REGLA DE LAS TRES FRASES". La regla del canal
  // es que las laminas van ENTERAS y sin tapar, asi que mientras conviven la de tres origenes se
  // corre a la izquierda y se achica, y recien cuando la otra se va crece a heroe.
  //   juntas: [120, 880] y [1020, 1780]  -> 140 px de aire entre las dos
  //   sola:   [140, 1260]
  // ⛔ NO puede depender de `lamRegla`: durante su fundido de salida (f156-176) la otra lamina ya
  // estaria creciendo mientras esta todavia se ve, y se vuelven a pisar 232 px. El crecimiento
  // arranca DESPUES de que la otra se fue del todo (f176).
  const juntas = 1 - ramp(f, 178, 206, Easing.inOut(Easing.cubic));
  const heroW = lerp(1120, 760, juntas);
  const heroCx = lerp(700, 500, juntas);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* el movimiento entra SUBIENDO: es un objeto que tapa al avatar, ⛔ no una opacity */}
      <div style={{ position: "absolute", left: 0, bottom: 0, width: 1920, height: Math.max(1, sube * 1080), overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, bottom: 0, width: 1920, height: 1080 }}>
          {/* ═══ EL MUNDO — UNA perspectiva, UNA cámara, montada una vez ═════════════════════════ */}
          <AbsoluteFill style={camStyle(K)}>
            {/* D2 · el fondo de cada acto es MATERIAL REAL, nunca un degradé plano ─────────────── */}
            {f < A2 + 30 ? <Backplate img="clembudo_s206" clip="clembudo_s206" from={8} dur={148} rate={0.9} z={-600} scale={1.42} veil={0.5} /> : null}
            {f >= A2 && f < A3 + 30 ? <Backplate img="clembudo_s207" clip="clembudo_s207" from={A2 + 4} dur={150} rate={0.86} z={-600} scale={1.4} veil={0.52} /> : null}
            {f >= A3 && f < A4 + 30 ? <Backplate img="clembudo_s209" clip="clembudo_s209" from={A3 + 4} dur={150} rate={0.86} z={-600} scale={1.4} veil={0.54} /> : null}
            {f >= A4 && f < A5 + 30 ? <Backplate img="clembudo_s214" clip="clembudo_s214" from={A4 + 4} dur={150} rate={0.86} z={-600} scale={1.4} veil={0.54} /> : null}
            {f >= A5 && f < A6 + 30 ? <Backplate img="clembudo_s217" clip="clembudo_s217" from={A5 + 4} dur={150} rate={0.86} z={-600} scale={1.4} veil={0.54} /> : null}
            {f >= A6 ? <Backplate img="clembudo_s218" clip="clembudo_s218" from={A6 + 4} dur={104} rate={0.9} z={-600} scale={1.38} veil={0.5} /> : null}

            {/* L1 · la mesa del galpón: gira sobre su borde INFERIOR y hacia atrás (⛔ jamás se
                adelanta a las tarjetas — ése fue el defecto que aplastaba las cartas en MovCierre) */}
            <Ground y={1240} h={1320} z0={-250} tilt={64} veil={0.66} />

            {/* ═══ L4 · LA TIRA (A2 + A3): siete materiales reales en UN solo travelling ════════ */}
            {tiraOn
              ? TIRA.map((p, i) => {
                  const d = i - hero;
                  const ad = Math.abs(d);
                  if (ad > 1.9) return null;
                  const prom = Math.max(0, 1 - ad);
                  return (
                    <Plate
                      key={p.n}
                      cx={960 + d * PITCH + Math.sin((f + i * 41) / 83) * 5}
                      cy={472 + ad * 26 - prom * 10 + Math.cos((f + i * 29) / 97) * 4}
                      w={(1160 - Math.min(ad, 2) * 190) * (1 - tiraOut * 0.6)}
                      z={210 * prom - 240 * Math.min(ad, 2)}
                      ry={-d * 13}
                      // D4 · la profundidad se PINTA (velo negro adentro), ⛔ nunca con opacity:
                      // una foto semitransparente deja ver el b-roll y ése era el fantasma.
                      dim={Math.min(0.66, ad * 0.34) + tiraOut * 0.5}
                      lift={1 + prom * 0.4}
                    >
                      <Mat img={p.n} clip={p.clip ? p.n : undefined} from={p.from} dur={150} rate={0.86} kb={1.05} />
                    </Plate>
                  );
                })
              : null}

            {/* ═══ A4/A5 · LA JUNTA ABIERTA → EL ARRANQUE DEL MURO (MATCH-SHAPE: gira, no corta) ═ */}
            {junta > 0.004 && juntaOut < 0.996 ? (
              <Plate
                cx={lerp(1380, 1010, junta)} cy={lerp(560, 470, junta)}
                w={lerp(420, 980, junta) * (1 - juntaOut * 0.55)}
                z={lerp(-200, 190, junta)} ry={lerp(-24, 0, junta) + giro}
                dim={(1 - junta) * 0.6 + juntaOut * 0.5} lift={1.35}
              >
                {caraB ? (
                  <Mat img="clembudo_s217" clip="clembudo_s217" from={A5 + 30} dur={148} rate={0.88} kb={1.05} mirror />
                ) : (
                  <Mat img="clembudo_s216" clip="clembudo_s216" from={1250} dur={148} rate={0.88} kb={1.05} />
                )}
              </Plate>
            ) : null}

            {/* ═══ A4 · la teja partida, en su propia tarjeta (1 objeto protagonista por acto, y
                éste es el que acompaña: entra y se hunde, no se queda compitiendo) ═════════════ */}
            {f >= 1160 && f < 1270 ? (
              <Plate
                cx={600} cy={720} w={lerp(340, 520, ramp(f, 1160, 1200, Easing.out(Easing.cubic)))}
                z={lerp(-260, 60, ramp(f, 1160, 1200))} ry={18}
                dim={0.1 + ramp(f, 1240, 1270) * 0.6} lift={1.1}
              >
                <Mat img="clembudo_s215" clip="clembudo_s215" from={1164} dur={104} rate={0.9} kb={1.05} />
              </Plate>
            ) : null}

            {/* ═══ A5 · el polvo blanco entre los dedos: el detalle que prueba la capilaridad ═══ */}
            {f >= 1386 && f < A6 + 6 ? (
              <Plate
                cx={1260} cy={706} w={lerp(360, 560, ramp(f, 1386, 1424, Easing.out(Easing.cubic)))}
                z={lerp(-240, 120, ramp(f, 1386, 1424))} ry={-14}
                dim={0.08 + ramp(f, A6 - 20, A6 + 6) * 0.6} lift={1.15}
              >
                <Mat img="clembudo_s223" clip="clembudo_s223" from={1390} dur={92} rate={0.94} kb={1.05} />
              </Plate>
            ) : null}

            {/* ═══ A6 · LAS TRES MANCHAS ALINEADAS — el índice del movimiento, ya cerrado ═══════ */}
            {f >= 1512
              ? CHIPS.map((c, i) => {
                  const k = ramp(f, 1512 + i * 9, 1548 + i * 9, Easing.out(Easing.poly(3)));
                  const zz = lerp(-120, 130, k);
                  return (
                    <Plate
                      // fitCx: en mundo estas tres estaban holgadas, pero la camara (z 1,10 mas la
                      // perspectiva) se comia la primera por la izquierda y la tercera por la derecha.
                      key={c.n} cx={fitCx(396 + i * 564, 476, zz, K)} cy={lerp(1180, 616, k)} w={476}
                      z={zz} ry={(i - 1) * 6} lift={1.2}
                    >
                      <Mat img={c.n} kb={1.05} />
                    </Plate>
                  );
                })
              : null}
          </AbsoluteFill>

          {/* ═══ ESPACIO DE PANTALLA — acá va todo lo que NO puede moverse ni recortarse ════════ */}

          {/* FRONTERA 1 · ZOOM-THROUGH: el portal nace en la flecha verde de la lámina */}
          {f >= A2 - 22 && f < A2 + 46 ? (
            <Portal f={f} a={A2 - 22} b={A2 + 40} x={flecha(0.262, 0.515, heroCx, heroW).x} y={flecha(0.262, 0.515, heroCx, heroW).y}>
              <Mat img="clembudo_s207" clip="clembudo_s207" from={A2 - 18} dur={150} rate={0.86} kb={1.06} />
            </Portal>
          ) : null}

          {/* FRONTERA 5 · ZOOM-THROUGH: se entra en la línea de agua del zócalo y sale en el terrón */}
          {f >= A6 - 24 && f < A6 + 44 ? (
            <Portal f={f} a={A6 - 24} b={A6 + 38} x={1220} y={704}>
              <Mat img="clembudo_s218" clip="clembudo_s218" from={A6 - 20} dur={140} rate={0.9} kb={1.06} />
            </Portal>
          ) : null}

          {/* LA LÁMINA — entera, nítida y QUIETA, con 60 px de margen REAL. ⛔ Nunca dentro de la
              cámara (ahí el zoom la cortaba: "EL AIRE" contra el borde izquierdo, medido). */}
          {lamRegla > 0.004 ? (
            <div
              style={{
                position: "absolute", inset: 0, opacity: Math.min(1, lamRegla * 2.2),
                transform: `translateY(${((1 - lamRegla) * 56).toFixed(1)}px) scale(${(0.965 + lamRegla * 0.035).toFixed(4)})`,
              }}
            >
              <Lamina src={LAM_REGLA} cx={1400} cy={468} w={760} tilt={0.8} />
            </div>
          ) : null}
          {lamHero > 0.004 ? (
            <div
              style={{
                position: "absolute", inset: 0, opacity: Math.min(1, lamHero * 2.2),
                transform: `translateY(${((1 - lamHero) * 62).toFixed(1)}px) scale(${(0.962 + lamHero * 0.038).toFixed(4)})`,
              }}
            >
              <Lamina src={LAM_TRES} cx={heroCx} cy={LAM_HERO.cy} w={heroW} tilt={-0.5} />
              <Aro f={f} x={flecha(0.262, 0.515, heroCx, heroW).x} y={flecha(0.262, 0.515, heroCx, heroW).y} r={heroW * 0.085} color="rgba(34,140,66,0.95)"
                   k={ip(f, [130, 152, 206, 226], [0, 1, 1, 0.3])} />
              <Aro f={f} x={flecha(0.715, 0.548, heroCx, heroW).x} y={flecha(0.715, 0.548, heroCx, heroW).y} r={heroW * 0.075} color="rgba(196,54,38,0.95)"
                   k={ip(f, [A4 + 30, A4 + 62, 1160, 1204], [0, 1, 1, 0.3])} />
              <Aro f={f} x={flecha(0.585, 0.835, heroCx, heroW).x} y={flecha(0.585, 0.835, heroCx, heroW).y} r={heroW * 0.075} color="rgba(34,140,66,0.95)"
                   k={ip(f, [1180, 1206, 1216, 1228], [0, 0.9, 0.9, 0])} />
            </div>
          ) : null}

          {/* las etiquetas de las tres manchas: en papel, en pantalla, debajo de cada tarjeta */}
          {f >= 1520 ? (
            <div style={{ position: "absolute", inset: 0, opacity: ramp(f, 1520, 1548) }}>
              {CHIPS.map((c, i) => (
                <div key={c.n} style={{ position: "absolute", left: 396 + i * 564 - 170, top: 800, width: 340, textAlign: "center" }}>
                  <Paper pad={12} tilt={i === 1 ? 0.6 : -0.6}>
                    <Ink size={48}>{c.lbl}</Ink>
                  </Paper>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* entrada del ambiente ≤15 f (⛔ nada de 2 s subiendo desde negro) */}
      {rin < 0.999 ? <AbsoluteFill style={{ background: "rgba(20,16,10,1)", opacity: (1 - rin) * sube, pointerEvents: "none" }} /> : null}

      {/* L5 · clave fría de ventana que se va templando con la luz del movimiento */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(74% 58% at ${(24 + L * 18).toFixed(1)}% ${(16 + L * 10).toFixed(1)}%, rgba(214,232,255,${(0.10 - L * 0.05).toFixed(3)}) 0%, rgba(255,212,150,${(L * 0.12).toFixed(3)}) 44%, rgba(0,0,0,0) 70%)`,
          mixBlendMode: "screen", pointerEvents: "none", opacity: sube,
        }}
      />

      {/* FRONTERA 3 · OCLUSIÓN — el cuero del delantal (⛔ nunca el color del fondo) */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Occluder at={A4} len={12} color="#B5854F" angle={-9} />
      </AbsoluteFill>

      {/* ═══ L8 · TEXTO — 1 idea por acto, titular ≤7 palabras, anclado por bottom/left ═════════ */}
      <LowerBed o={lamHero > 0.5 ? 0.42 : 0.9} />
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Lower f={f} from={150}  to={200}  kick="SOLO HAY TRES"     head="No existe un cuarto origen." />
        <Lower f={f} from={286}  to={402}  kick="UNO · EL AIRE"     head="Condensación: el aire de adentro." />
        <Lower f={f} from={412}  to={556}  kick="EL VASO FRÍO"      head="Esa agua no salió del vaso." />
        <Lower f={f} from={600}  to={790}  kick="LA PARED ES EL VASO" head="Diez a quince litros por día." />
        <Lower f={f} from={820}  to={1020} kick="DÓNDE APARECE"     head="En la superficie más fría." />
        <Lower f={f} from={1060} to={1230} kick="DOS · DE AFUERA"   head="Filtración: entra por el muro." />
        <Lower f={f} from={1246} to={1290} kick="POR DÓNDE"         head="Teja, canaleta o junta abierta." />
        <Lower f={f} from={1312} to={1440} kick="TRES · EL SUELO"   head="Capilaridad: sube de la tierra." />
        <Lower f={f} from={1478} to={1508} kick="COMO EL AZÚCAR"    head="El café trepa por el terrón." />
      </AbsoluteFill>

      {/* L9 · atmósfera — montada UNA sola vez para los 1575 frames, jamás se remonta */}
      <Atmos t={L} dust={28} />
    </AbsoluteFill>
  );
};

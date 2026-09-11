// MovCierre.tsx — `clembudo` · EL MOVIMIENTO DE CONVERSIÓN (653,00 s → 694,30 s · 1239 frames @30fps)
//
// "Con esto no te alcanza. Yo te acabo de dar el método. Para cobrarlo te faltan CUATRO COSAS."
// El objeto protagonista del movimiento entero es UNA BARAJA: la hoja del cuaderno del acto 1 se
// vuelve la primera carta, las otras tres salen de atrás de ella, el abanico gira una carta por
// carencia, y al final las cuatro colapsan en la pila de hojas impresas que ES el curso.
//
// ═══ QUÉ CAMBIÓ EN LA REHECHURA (sep-2026) — los tres defectos que tenía este movimiento ═══════
//  D1 · TARJETAS APLASTADAS A UNA TIRA (664 s, 674 s, 685 s).
//       CAUSA MEDIDA: el "banco de trabajo" era un plano de 1760 px con `rotateX(56deg)` y
//       `transformOrigin: 50% 0%`. Girando sobre su borde SUPERIOR, su borde cercano terminaba en
//       z = −190 + 1760·sin(56°) = **+1269**, o sea MUY por delante de las cartas (z ≈ +170): el
//       piso les tapaba la mitad de abajo y la carta se leía como una franja con las cabezas
//       cortadas. Ahora el piso es `<Ground/>`, que gira sobre su borde INFERIOR y hacia atrás.
//       Y las cartas son `<Plate/>`: la altura SALE del ancho por 16:9, nunca se pasa suelta.
//  D4 · FANTASMA DE DOBLE EXPOSICIÓN. Dos causas: (a) la profundidad se resolvía con `opacity`;
//       ahora va con `dim` (un velo NEGRO adentro de la tarjeta, que sigue siendo opaca).
//       (b) el componente `VsDuel` del kit se montaba ENCIMA de este movimiento (659,8→665,2 cae
//       entero adentro de 653→694,3) y se veía el abanico A TRAVÉS de él. Ese duelo ahora es
//       NATIVO del acto 2 — y el `VsDuel` salió de `_v3/clembudo_comps.json`.
//  D7 · TÍTULOS SIN CONTRASTE ("Lo que separa a uno del otro", tinta oscura sobre cama oscura).
//       Todo titular en tinta va sobre `<Paper/>`; el que va claro lleva `<LowerBed/>` detrás.
//
// ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
// │ TABLA DE HANDOFF — cada acto arranca EXACTAMENTE en el exitTo del anterior                      │
// ├────────────────────────────────────────────────────────────────────────────────────────────────┤
// │ ACTO 1 · f 0–116 · "Con esto no te alcanza / yo te acabo de dar el método"   (AVATAR VISIBLE)   │
// │   enterFrom cam {z 1.00, panX +86, panY +12, ry −6.0, rx +1.0} · luz 0.350                      │
// │             materia: (del MovCaso35) el galpón ya calentándose, cuadro limpio                   │
// │   exitTo    cam {z 1.04, panX +46, panY   0, ry −3.2, rx +0.8} · luz 0.371                      │
// │             materia: EL CUADERNO DEL OFICIO (s440) flotando en el tercio izquierdo              │
// │                                                                                                 │
// │ ── FRONTERA 1 @ f117 · MATCH-SHAPE ───────────────────────────────────────────────────────────  │
// │   La hoja NO se va: gira sobre su eje vertical (0°→180°) y en el instante en que está de canto  │
// │   —ancho cero, swap invisible— su otra cara ya es la CARTA 1 (el diagnóstico). Mientras gira,    │
// │   el piso del galpón sube desde abajo del cuadro (objeto físico, ⛔ no un fade) y las otras      │
// │   tres cartas salen de atrás de ella. Mismo rectángulo, misma posición, misma inercia.          │
// ├────────────────────────────────────────────────────────────────────────────────────────────────┤
// │ ACTO 2 · f 117–368 · "te faltan cuatro cosas / separan al que cobra 80 del que cobra 250"       │
// │   enterFrom cam {z 1.04, panX +46, panY   0, ry −3.2, rx +0.8} · luz 0.371                      │
// │             materia: la hoja, ya girando, convertida en la carta 1                              │
// │   exitTo    cam {z 1.10, panX   0, panY −10, ry +3.0, rx −1.0} · luz 0.418                      │
// │             materia: EL DUELO 80 vs 250 (s433 / s434) colapsando de vuelta al abanico           │
// │   (f203–f352: EL DUELO, nativo. Dos Plates 16:9 gemelas + el titular EN TINTA sobre papel.)     │
// │                                                                                                 │
// │ ── FRONTERA 2 @ f369 · ZOOM-THROUGH ──────────────────────────────────────────────────────────  │
// │   La cámara no corta: ENTRA en la carta 1. z 1.04→1.10 y la carta se agranda ×1.42 hasta        │
// │   dominar el plano; las otras tres quedan atrás, chicas y hundidas por `dim`. Se pasa de plano  │
// │   general del abanico a plano de producto de una sola carta sin un solo frame de nada.          │
// ├────────────────────────────────────────────────────────────────────────────────────────────────┤
// │ ACTO 3 · f 369–662 · CARENCIA 1: diagnosticar en 10 min + SU CONSECUENCIA (la garantía)         │
// │   enterFrom cam {z 1.10, panX   0, panY −10, ry +3.0, rx −1.0} · luz 0.418                      │
// │             materia: la carta 1 al frente con el clip del medidor delante del cliente (s434)    │
// │   exitTo    cam {z 1.18, panX −110, panY −20, ry +7.5, rx −1.6} · luz 0.472                     │
// │             materia: la MISMA carta, ya girada a su segunda cara: la mancha que vuelve (s435)   │
// │   (dentro del acto, f526: la carta vuelve a girar 180° — el gesto ES la consecuencia)           │
// │                                                                                                 │
// │ ── FRONTERA 3 @ f663 · OCLUSIÓN ──────────────────────────────────────────────────────────────  │
// │   El cuero del delantal de Claudio cruza el cuadro en diagonal (#B5854F — ⛔ NO el color del     │
// │   fondo: es la materia real que ya está en la escena) y detrás el abanico ya rotó una carta.    │
// │   Cambio de tema fuerte (de la garantía al dinero) → pide tapar, no fundir.                     │
// ├────────────────────────────────────────────────────────────────────────────────────────────────┤
// │ ACTO 4 · f 663–972 · CARENCIAS 2 y 3: cotizar (Luis en la vereda) · los primeros 10 clientes    │
// │   enterFrom cam {z 1.18, panX −110, panY −20, ry +7.5, rx −1.6} · luz 0.472                     │
// │             materia: el abanico, ya con la carta 2 al frente cuando se despeja el cuero         │
// │   exitTo    cam {z 1.14, panX −200, panY −10, ry +12.0, rx −1.4} · luz 0.535                    │
// │             materia: el abanico EN PLENA ROTACIÓN hacia la carta 4 (no se detiene en la costura)│
// │                                                                                                 │
// │ ── FRONTERA 4 @ f973 · MATCH-MOVE ────────────────────────────────────────────────────────────  │
// │   La cámara ya viene paneando (panX −110→−200) y el abanico ya viene rotando desde f956. El     │
// │   contenido cambia DETRÁS del movimiento: la carta 3 sale por el borde y la 4 entra, sin que    │
// │   nada arranque ni se detenga.                                                                  │
// ├────────────────────────────────────────────────────────────────────────────────────────────────┤
// │ ACTO 5 · f 973–1140 · CARENCIA 4: qué trabajos NO tomar + CALLBACK de los 35 dólares            │
// │   enterFrom cam {z 1.14, panX −200, panY −10, ry +12.0, rx −1.4} · luz 0.535                    │
// │             materia: la carta 4 llegando al frente (la palma del "ese no lo tomo", s438)        │
// │   exitTo    cam {z 1.08, panX −120, panY  +8, ry +6.0, rx −0.3} · luz 0.579                     │
// │             materia: las cuatro cartas juntas otra vez + la carta-recuerdo de los 35 dólares    │
// │   (f1054: vuelve desde el fondo el clip s411 — el apretón de los 35 dólares, el MISMO material  │
// │    del MovCaso35. Es el cierre del arco: la carencia 4 ES el caso que ya vio.)                  │
// │                                                                                                 │
// │ ── FRONTERA 5 @ f1141 · MATCH-SHAPE ──────────────────────────────────────────────────────────  │
// │   Cuatro rectángulos → UNO. Las cartas convergen y se apilan con desfase de unos milímetros     │
// │   (una pila real), y por delante sube la hoja de arriba: la palma de Claudio sobre la pila de   │
// │   hojas impresas (s439). No hay fundido: una carta se apoya sobre las otras cuatro.             │
// ├────────────────────────────────────────────────────────────────────────────────────────────────┤
// │ ACTO 6 · f 1141–1238 · "que el primer año no te fundas" → la pila. ESO ES EL CURSO.             │
// │   enterFrom cam {z 1.08, panX −120, panY  +8, ry +6.0, rx −0.3} · luz 0.579                     │
// │             materia: la baraja colapsando                                                       │
// │   exitTo    cam {z 1.03, panX  −60, panY +14, ry +2.4, rx  0.0} · luz 0.600 — ⚠️ QUIETA desde    │
// │             f1196 (from === to en la última pata: la cámara se detiene, no entrega movimiento)  │
// │             materia: LA PILA DE HOJAS, anclada a la izquierda. Tercio derecho (x>1290) limpio   │
// │             y con un velo cálido: la tarjeta de CTA se monta ahí, ⛔ acá NO se dibuja.           │
// └────────────────────────────────────────────────────────────────────────────────────────────────┘
//
// COSTURAS EN ORDEN: MATCH-SHAPE · ZOOM-THROUGH · OCLUSIÓN · MATCH-MOVE · MATCH-SHAPE
// (⛔ ninguna es un fade · ⛔ no hay dos seguidas iguales)
//
// LUZ: luz(f, 1239, 0.35, 0.60) — el tramo más cálido del video. Una sola rampa, sin saltos.
//
// AVATAR: sólo se ve en el ACTO 1 (fondo transparente, elementos en el tercio IZQUIERDO y en la
// franja inferior — ⛔ nunca boca ni mentón). Del acto 2 en adelante el piso sube y tapa el cuadro.
//
// ⛔ NO se escribe el precio del curso ni la URL: el QR y la portada los monta el build.
// ⛔ Math.random / Date.now: cero (todo sale de hash/rng de Stage y de useCurrentFrame).
// ⛔ backdrop-filter: cero. ⛔ blur full-screen: cero. ⛔ <Video>: cero (todo OffthreadVideo).
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  Atmos, Backplate, Ground, Kick, Lower, LowerBed, Mat, Occluder, Paper, Plate,
  cam, camStyle, luz, rampIn, rng, Ink, C,
} from "./Stage";

const DUR = 1239;

// ── frames de los actos (derivados de los timestamps REALES de Whisper) ─────────────────────────
const A2 = 117;   // 656,90 "para cobrarlo te faltan 4 cosas"
const A3 = 369;   // 665,32 "diagnosticar en 10 minutos delante del cliente"
const A4 = 663;   // 675,12 "cotizar, que es lo que a Luis le costó 20 minutos"
const A5 = 973;   // 685,46 "y saber qué trabajos no tomar"
const A6 = 1141;  // 691,06 "y es lo que evita que el primer año te fundas"

const EZ = Easing.bezier(0.22, 0.61, 0.24, 1);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const ramp = (f: number, a: number, b: number, e = EZ) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });

// ── UNA SOLA CÁMARA, CONTINUA: patas encadenadas (el from de cada una ES el to de la anterior) ───
// La deriva permanente (hold vivo) la aporta `cam()` de Stage con el frame GLOBAL, así que la fase
// del drift NO se reinicia en ninguna frontera.
type CamK = { z: number; panX: number; panY: number; ry: number; rx: number };
const LEGS: Array<[number, CamK]> = [
  [0,    { z: 1.00, panX:   86, panY:  12, ry:  -6.0, rx:  1.0 }],
  [A2,   { z: 1.04, panX:   46, panY:   0, ry:  -3.2, rx:  0.8 }],
  [A3,   { z: 1.10, panX:    0, panY: -10, ry:   3.0, rx: -1.0 }],
  [A4,   { z: 1.18, panX: -110, panY: -20, ry:   7.5, rx: -1.6 }],
  [A5,   { z: 1.14, panX: -200, panY: -10, ry:  12.0, rx: -1.4 }],
  [A6,   { z: 1.08, panX: -120, panY:   8, ry:   6.0, rx: -0.3 }],
  [1196, { z: 1.03, panX:  -60, panY:  14, ry:   2.4, rx:  0.0 }],
  [DUR,  { z: 1.03, panX:  -60, panY:  14, ry:   2.4, rx:  0.0 }], // QUIETA (from === to)
];

const camAt = (f: number): CamK => {
  let i = 0;
  for (let j = 0; j < LEGS.length - 1; j++) if (f >= LEGS[j][0]) i = j;
  const [fa, A] = LEGS[i];
  const [fb, B] = LEGS[i + 1];
  const k = ramp(f, fa, fb);
  const d = cam(f, DUR); // deriva global pura (z≈1±0.0025, pan ±1,6 px) — nunca reinicia
  return {
    z: lerp(A.z, B.z, k) * d.z,
    panX: lerp(A.panX, B.panX, k) + d.panX,
    panY: lerp(A.panY, B.panY, k) + d.panY,
    ry: lerp(A.ry, B.ry, k),
    rx: lerp(A.rx, B.rx, k),
  };
};

// ── LA BARAJA ───────────────────────────────────────────────────────────────────────────────────
// ⛔ NO hay `h`: la carta es una `Plate` y su alto SALE del ancho por 16:9 (D1). El "tamaño" de una
// carta es UN número — su ancho en píxeles de mundo — y todo lo demás se deriva.
const CARD_W = 620;                    // ancho base de carta (→ alto 349, el 16:9 del material)
const FAN_X = 940, FAN_Y = 520;        // centro del abanico en coordenadas de mundo
const UNO_X = 320, UNO_Y = 596;        // slot del acto 1: tercio IZQUIERDO (el avatar queda libre)
const DECK_X = 838, DECK_Y = 560;      // dónde se apila todo en el acto 6

type Slot = { x: number; y: number; z: number; w: number; ry: number; dim: number };

// Las CUATRO carencias. El PNG es literalmente el frame 0 del MP4 (los clips son i2v generados
// desde esa imagen), así que mostrar la foto mientras la carta está en el fondo y encender el clip
// cuando pasa al frente NO se ve: es el mismo cuadro. Y ahorra decodificar cuatro videos siempre.
const CARENCIAS = [
  { img: "clembudo_s434", clip: "clembudo_s434", from: 380, dur: 150, rate: 0.86, mirror: true },  // diagnosticar
  { img: "clembudo_s436", clip: "clembudo_s436", from: 672, dur: 150, rate: 0.88, mirror: false }, // cotizar
  { img: "clembudo_s437", clip: "clembudo_s437", from: 820, dur: 150, rate: 0.86, mirror: false }, // conseguir
  { img: "clembudo_s438", clip: "clembudo_s438", from: 986, dur: 150, rate: 0.84, mirror: false }, // no tomar
];

// ── polvo EN EL MUNDO (parallax propio, distinto del polvo de pantalla de <Atmos/>) ──────────────
const DustWorld: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: "absolute", inset: 0, transform: "translateZ(-90px)", pointerEvents: "none" }}>
    {new Array(16).fill(0).map((_, i) => {
      const x = rng(83, i) * 2400 - 240 + Math.sin((f + i * 53) / 71) * 34;
      const y = ((rng(97, i) * 1400 + f * (0.5 + rng(109, i) * 1.1)) % 1500) - 210;
      const r = 2 + rng(127, i) * 4.5;
      return (
        <div key={i} style={{
          position: "absolute", left: x, top: y, width: r, height: r, borderRadius: "50%",
          background: "#FFF3D6", opacity: 0.07 + rng(139, i) * 0.15,
        }} />
      );
    })}
  </div>
);

export const MovCierre: React.FC = () => {
  const f = useCurrentFrame();
  const K = camAt(f);
  const L = luz(f, DUR, 0.35, 0.60);          // 0.35 → 0.60: el tramo más cálido del video
  const rin = rampIn(f, 14);                   // entrada ≤15 frames (⛔ nada subiendo 2 s de negro)

  // El SET sube desde abajo del cuadro: es un objeto que entra, ⛔ no un fade.
  const setY = (1 - ramp(f, 106, 156, Easing.out(Easing.cubic))) * 2160;

  // Carta 0: migra del slot del acto 1 al frente del abanico mientras gira.
  const intro = 1 - ramp(f, 110, 172);
  // Giro acumulado de la carta 0: 0° (cuaderno) → 180° (diagnóstico) → 360° (la mancha que vuelve).
  const turn0 = ramp(f, A2, 162, Easing.inOut(Easing.cubic)) * 180 + ramp(f, 526, 550, Easing.inOut(Easing.cubic)) * 180;
  const face0 = turn0 < 90 ? 0 : turn0 < 270 ? 1 : 2;

  // Carta al frente. F3 es un SALTO duro tapado por el cuero; F4 es una rotación continua (match-move).
  const fr =
    (f >= A4 ? 1 : 0) +
    ramp(f, 798, 832, Easing.inOut(Easing.cubic)) +
    ramp(f, 956, 1002, Easing.inOut(Easing.cubic)) +
    // vaivén del abanico durante el acto 2 (hold VIVO: el abanico nunca queda quieto)
    (-0.40 * ramp(f, 150, 206) + 0.40 * ramp(f, 206, 362, Easing.inOut(Easing.sin)));

  const col = ramp(f, A6, 1198, Easing.out(Easing.poly(4)));   // colapso en la pila (frontera 5)

  // ── EL DUELO del acto 2 (nativo, ex-VsDuel). Las cuatro cartas se HUNDEN al fondo mientras dura,
  // así que no hay dos capas compitiendo por el mismo cuadro: hay una sola escena.
  const duelo = ramp(f, 203, 240, Easing.out(Easing.cubic)) * (1 - ramp(f, 330, 360, Easing.in(Easing.cubic)));

  // Slot del abanico puro (sin migración ni colapso)
  const fanSlot = (i: number): Slot => {
    const d = i - fr;
    const ad = Math.abs(d);
    const prom = Math.max(0, 1 - ad);                            // 1 = está al frente
    return {
      x: FAN_X + d * 352,
      y: FAN_Y + ad * 30 - prom * 14 + Math.sin((f + i * 47) / 61) * (3 + prom * 4),
      z: 180 * prom - 150 * Math.min(ad, 2.2),
      w: CARD_W * (1 - Math.min(ad, 3) * 0.15) * (1 + prom * 0.42),
      ry: -d * 15,
      // D4 · la profundidad se PINTA: la carta del fondo se hunde con un velo negro adentro, no
      // volviéndose transparente. Una tarjeta semitransparente deja ver el b-roll y es el fantasma.
      dim: Math.min(0.62, Math.min(ad, 2.4) * 0.26),
    };
  };
  const mix = (a: Slot, b: Slot, k: number): Slot => ({
    x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), z: lerp(a.z, b.z, k),
    w: lerp(a.w, b.w, k), ry: lerp(a.ry, b.ry, k), dim: lerp(a.dim, b.dim, k),
  });
  const toDeck = (s: Slot, i: number): Slot =>
    col > 0
      ? mix(s, { x: DECK_X + i * 9, y: DECK_Y - i * 7, z: -10 - i * 14, w: CARD_W * 0.86, ry: -4 + i * 2, dim: 0.18 + i * 0.06 }, col)
      : s;
  // durante el duelo las cuatro cartas se van al fondo (no compiten con el duelo por el cuadro)
  const toFondo = (s: Slot, i: number): Slot =>
    duelo > 0.004
      ? mix(s, { x: 300 + i * 470, y: 268, z: -520, w: CARD_W * 0.52, ry: (i - 1.5) * 7, dim: 0.74 }, duelo)
      : s;

  // CARTA 0 · viene del slot del acto 1 (tercio izquierdo, el avatar libre) y migra al frente.
  const s0 = toDeck(
    toFondo(
      intro > 0 ? mix(fanSlot(0), { x: UNO_X, y: UNO_Y, z: 40, w: CARD_W * 0.80, ry: -3, dim: 0 }, intro) : fanSlot(0),
      0,
    ),
    0,
  );
  // CARTAS 1-3 · ⛔ NO existen en el acto 1: nacen EXACTAMENTE debajo de la carta 0 (mismo x/y, un
  // pelo más chicas y más al fondo) y salen de atrás de ella. Si se las dejara en el centro del
  // abanico durante el acto 1 quedarían encima de la cara del avatar.
  // ⚠️ MEDIDO: mientras la carta 0 gira está DE CANTO (ancho cero) y deja al descubierto lo que tiene
  // detrás. Las otras tres no pueden existir hasta que la carta 0 vuelve a estar de frente (f162).
  const deckOn = f >= 160;
  const em = ramp(f, 166, 224);
  const behind = (i: number): Slot => ({ x: s0.x, y: s0.y + i * 5, z: s0.z - 26 - i * 20, w: s0.w * 0.97, ry: s0.ry, dim: 0.3 + i * 0.1 });
  const sN = (i: number) => toDeck(toFondo(mix(behind(i), fanSlot(i), em), i), i);
  const s1 = sN(1), s2 = sN(2), s3 = sN(3);

  // La hoja de arriba de la pila: sube por delante y se apoya sobre las otras cuatro (MATCH-SHAPE).
  const pk = ramp(f, 1146, 1202, Easing.out(Easing.poly(4)));
  const pile: Slot = {
    x: lerp(DECK_X + 46, DECK_X - 18, pk),
    y: lerp(DECK_Y + 690, DECK_Y - 26, pk),
    z: lerp(210, 22, pk),
    w: lerp(CARD_W * 1.24, CARD_W * 1.44, pk),
    ry: lerp(-13, -3, pk),
    dim: 0,
  };

  // Carta-recuerdo: los 35 dólares vuelven desde el fondo (MISMO material del MovCaso35) y, cuando
  // arranca el colapso, se HUNDEN detrás de la pila (salida física, ⛔ no un fade).
  const ck = ramp(f, 1054, 1104, Easing.out(Easing.cubic));
  const cOut = ramp(f, A6, 1176, Easing.in(Easing.cubic));
  const callback: Slot = {
    x: lerp(lerp(560, 470, ck), DECK_X - 40, cOut),
    y: lerp(lerp(760, 690, ck), DECK_Y + 150, cOut),
    z: lerp(lerp(-260, -30, ck), -430, cOut),
    w: lerp(lerp(CARD_W * 0.42, CARD_W * 0.62, ck), CARD_W * 0.18, cOut),
    ry: lerp(lerp(22, 13, ck), 26, cOut),
    dim: lerp(lerp(0.5, 0.1, ck), 0.7, cOut),
  };
  // Luis parado en la vereda: entra detrás de la carta de cotizar y se hunde cuando gira el abanico.
  const lk = ramp(f, 686, 736, Easing.out(Easing.cubic));
  const lOut = ramp(f, 796, 828, Easing.in(Easing.cubic));
  const luisS: Slot = {
    x: lerp(lerp(500, 424, lk), 320, lOut),
    y: lerp(lerp(742, 682, lk), 820, lOut),
    z: lerp(lerp(-250, -46, lk), -430, lOut),
    w: lerp(lerp(CARD_W * 0.40, CARD_W * 0.58, lk), CARD_W * 0.18, lOut),
    ry: lerp(lerp(-20, -12, lk), -26, lOut),
    dim: lerp(lerp(0.5, 0.08, lk), 0.7, lOut),
  };

  const carta = (s: Slot, i: number) => {
    const c = CARENCIAS[i];
    return (
      <Plate cx={s.x} cy={s.y} w={s.w} z={s.z} ry={s.ry} dim={s.dim} lift={1 + Math.max(0, s.z) / 260}>
        <Mat img={c.img} clip={c.clip} from={c.from} dur={c.dur} rate={c.rate} kb={1.05} mirror={c.mirror} />
      </Plate>
    );
  };

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* ═══ EL MUNDO — UNA sola perspectiva, UNA sola cámara, montada una vez ═══════════════════ */}
      <AbsoluteFill style={camStyle(K)}>
        {/* ── EL SET (sube entero en la frontera 1: objeto que entra, ⛔ no un fade) ───────────── */}
        <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `translateY(${setY.toFixed(1)}px)` }}>
          {/* D2 · L0 · el fondo NO es un degradé: es el galpón REAL (material, no CSS) */}
          <Backplate img="clembudo_s439" z={-620} scale={1.42} veil={0.58} />
          {/* L1 · EL PISO DEL GALPÓN — ⛔ gira sobre su borde INFERIOR y HACIA ATRÁS: nunca puede
              adelantarse a las cartas. Ésta es la corrección del D1 (antes: rotateX(56) sobre el
              borde superior, borde cercano en z=+1269, que se comía la mitad de abajo de la carta). */}
          <Ground img="clembudo_s440" y={1290} h={1460} z0={-230} tilt={64} veil={0.66} />
          {/* L6 · viga de madera en el borde derecho (primer plano: el que MÁS se mueve) */}
          <div
            style={{
              position: "absolute", left: 1700, top: -230, width: 150, height: 1560,
              transform: "translateZ(215px)",
              background: "linear-gradient(90deg, rgba(18,14,9,0.94) 0%, rgba(46,37,24,0.90) 46%, rgba(12,9,6,0.96) 100%)",
              boxShadow: "-30px 0 70px rgba(16,12,7,0.62)",
            }}
          />
          {/* L6 · el cuero del delantal cruzando abajo, fuera de plano (contacto y profundidad) */}
          <div
            style={{
              position: "absolute", left: -300, right: -300, bottom: -140, height: 240,
              transform: "translateZ(232px) rotate(-1.6deg)",
              background: `linear-gradient(180deg, rgba(24,17,10,0) 0%, rgba(58,38,21,0.72) 42%, ${C.ink} 100%)`,
            }}
          />
        </div>

        <DustWorld f={f} />

        {/* ── L3/L4 · LA BARAJA. Cada carta lleva MATERIAL REAL adentro y su propio desfase: la
            delantera vive a translateZ +180 y la de atrás a −330, así que bajo el mismo paneo la
            delantera se mueve ~1,45× más que la trasera (parallax real, no simulado).
            ⛔ Este contenedor va SIN `opacity` variable: la entrada del movimiento la resuelve el
            velo de rampa que está más abajo, en espacio de pantalla. Una `opacity` acá aplanaría el
            preserve-3d y volvería a mezclar planos (que es como nacía el fantasma). ───────────── */}
        <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
          {deckOn ? (
            <>
              {carta(s1, 1)}
              {carta(s2, 2)}
              {carta(s3, 3)}
            </>
          ) : null}

          {/* CARTA-RECUERDO · los 35 dólares: el MISMO clip del MovCaso35 volviendo desde el fondo */}
          {f >= 1046 && f < 1180 ? (
            <Plate cx={callback.x} cy={callback.y} w={callback.w} z={callback.z} ry={callback.ry} dim={callback.dim} lift={0.8}>
              <Mat img="clembudo_s411" clip="clembudo_s411" from={1054} dur={126} kb={1.06} />
            </Plate>
          ) : null}
          {/* CARTA-RECUERDO · Luis, veinte minutos parado en la vereda */}
          {f >= 678 && f < 832 ? (
            <Plate cx={luisS.x} cy={luisS.y} w={luisS.w} z={luisS.z} ry={luisS.ry} dim={luisS.dim} lift={0.8}>
              <Mat img="clembudo_s422" clip="clembudo_s422" from={686} dur={146} kb={1.06} />
            </Plate>
          ) : null}

          {/* CARTA 1 — la que viene del acto 1. Tres caras, y el swap ocurre SIEMPRE de canto:
              0 el cuaderno (el método que ya te di) · 1 el diagnóstico · 2 la mancha que vuelve. */}
          <Plate cx={s0.x} cy={s0.y} w={s0.w} z={s0.z} ry={s0.ry + turn0} dim={s0.dim} lift={1 + Math.max(0, s0.z) / 260}>
            {face0 === 0 ? (
              <Mat img="clembudo_s440" kb={1.06 + ramp(f, 0, A2) * 0.05} />
            ) : face0 === 1 ? (
              <Mat img="clembudo_s434" clip="clembudo_s434" from={380} dur={150} rate={0.86} kb={1.05} mirror />
            ) : (
              <Mat img="clembudo_s435" kb={1.04 + ramp(f, 540, A4 + 40) * 0.10} />
            )}
          </Plate>

          {/* ═══ ACTO 2 · EL DUELO, NATIVO (ex-VsDuel del kit, que se montaba ENCIMA y hacía el
              fantasma de doble exposición). Dos Plates gemelas, mismo ancho, mismo 16:9, material
              real adentro y el pilar de cuero en el medio. ⛔ El titular NO va acá: va en papel, en
              espacio de pantalla, más abajo. ═════════════════════════════════════════════════ */}
          {duelo > 0.004 ? (
            <>
              <Plate
                cx={lerp(430, 560, duelo)} cy={470} w={lerp(480, 590, duelo)}
                z={lerp(-180, 120, duelo)} ry={lerp(-22, -9, duelo)} dim={(1 - duelo) * 0.6} lift={1.2}
              >
                <Mat img="clembudo_s427" clip="clembudo_s427" from={206} dur={148} rate={0.9} kb={1.05} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(20,16,10,0) 46%, rgba(20,16,10,0.86) 100%)" }} />
              </Plate>
              <Plate
                cx={lerp(1490, 1360, duelo)} cy={470} w={lerp(480, 590, duelo)}
                z={lerp(-180, 120, duelo)} ry={lerp(22, 9, duelo)} dim={(1 - duelo) * 0.6} lift={1.2}
              >
                <Mat img="clembudo_s429" clip="clembudo_s429" from={214} dur={148} rate={0.9} kb={1.05} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(20,16,10,0) 46%, rgba(20,16,10,0.86) 100%)" }} />
              </Plate>
              {/* el pilar de cuero que separa los dos lados: materia de la escena, no una línea CSS */}
              <div
                style={{
                  position: "absolute", left: 944, top: 236, width: 32, height: 470,
                  transform: `translateZ(150px) scaleY(${duelo.toFixed(3)})`, transformOrigin: "50% 50%",
                  background: "linear-gradient(90deg, rgba(24,17,10,0.9) 0%, #8E6538 42%, #B5854F 62%, rgba(24,17,10,0.92) 100%)",
                  boxShadow: "0 18px 40px rgba(18,13,8,0.6)",
                }}
              />
            </>
          ) : null}

          {/* LA HOJA DE ARRIBA — la pila de hojas impresas: ESO es el curso. */}
          {f >= A6 ? (
            <Plate cx={pile.x} cy={pile.y} w={pile.w} z={pile.z} ry={pile.ry} lift={1.25}>
              <Mat img="clembudo_s439" clip="clembudo_s439" from={1146} dur={93} kb={1.04} />
            </Plate>
          ) : null}
        </div>
      </AbsoluteFill>

      {/* ═══ ENTRADA DEL AMBIENTE (≤15 f) — un velo que se retira, NO una opacity sobre el mundo ══ */}
      {rin < 0.999 ? (
        <AbsoluteFill style={{ background: "rgba(20,16,10,1)", opacity: 1 - rin, pointerEvents: "none" }} />
      ) : null}

      {/* ═══ L5 · CLAVE CÁLIDA — la luz que evoluciona 0,35 → 0,60 (ámbar de galpón al atardecer) ══ */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(72% 58% at ${(26 + L * 16).toFixed(1)}% ${(18 + L * 10).toFixed(1)}%, rgba(255,206,126,${(0.07 + L * 0.21).toFixed(3)}) 0%, rgba(255,186,104,0) 62%)`,
          mixBlendMode: "screen", pointerEvents: "none",
        }}
      />
      {/* rojo seco sólo en la consecuencia de la carencia 1 (la mancha que vuelve) */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(96% 74% at 56% 52%, rgba(176,80,60,0) 44%, rgba(176,80,60,0.30) 100%)`,
          mixBlendMode: "multiply", pointerEvents: "none",
          opacity: ramp(f, 528, 566) * (1 - ramp(f, 640, A4 + 10)),
        }}
      />

      {/* ═══ FRONTERA 3 · OCLUSIÓN — el CUERO del delantal, NUNCA el color del fondo ══════════════ */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Occluder at={A4} len={12} color="#B5854F" angle={-11} />
      </AbsoluteFill>

      {/* ═══ ACTO 2 · LAS ETIQUETAS DEL DUELO — en espacio de PANTALLA, ancladas en píxeles reales.
          ⛔ Nunca dentro de la cámara: ahí el zoom las corta contra el borde (D3). ═══════════════ */}
      {duelo > 0.004 ? (
        <AbsoluteFill style={{ pointerEvents: "none", opacity: duelo }}>
          {/* D7 · el titular va EN TINTA sobre PAPEL. Antes era tinta oscura sobre cama oscura y
              directamente desaparecía: "Lo que separa a uno del otro" no se leía. */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 96, display: "flex", justifyContent: "center" }}>
            <Paper pad={24} tilt={-0.5}>
              <div style={{ textAlign: "center" }}>
                <Kick size={28} color={C.gold}>LAS CUATRO COSAS QUE FALTAN</Kick>
                <div style={{ height: 10 }} />
                <Ink size={56}>Lo que separa a uno del otro</Ink>
              </div>
            </Paper>
          </div>
          <div style={{ position: "absolute", left: 210, top: 690, width: 500, textAlign: "center" }}>
            <Paper pad={18} tilt={0.6}>
              <Ink size={50}>Cobra 80</Ink>
              <div style={{ marginTop: 6, fontSize: 31, color: C.inkSoft, fontFamily: "inherit" }}>Trata la mancha y espera</div>
            </Paper>
          </div>
          <div style={{ position: "absolute", right: 210, top: 690, width: 500, textAlign: "center" }}>
            <Paper pad={18} tilt={-0.6}>
              <Ink size={50}>Cobra 250</Ink>
              <div style={{ marginTop: 6, fontSize: 31, color: C.inkSoft, fontFamily: "inherit" }}>Diagnostica y sabe decir que no</div>
            </Paper>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* ═══ ACTO 6 · el tercio derecho queda LIMPIO y velado: ahí se monta la tarjeta de CTA ═════ */}
      <AbsoluteFill
        style={{
          pointerEvents: "none", opacity: ramp(f, 1156, 1216),
          background: "linear-gradient(90deg, rgba(24,19,12,0) 60%, rgba(24,19,12,0.30) 78%, rgba(24,19,12,0.52) 100%)",
        }}
      />

      {/* ═══ L8 · TEXTO — 1 idea por acto. Todo en espacio de PANTALLA, anclado por bottom/left,
          con su cama oscura detrás para que el texto claro lea sobre cualquier material. ═════════ */}
      <LowerBed o={duelo > 0.5 ? 0.3 : 0.9} />
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Lower f={f} from={6}    to={104}  kick="EL MÉTODO YA ESTÁ"   head="Con esto todavía no te alcanza." />
        <Lower f={f} from={122}  to={192}  kick="TE FALTAN"           head="Cuatro cosas para poder cobrarlo." />
        <Lower f={f} from={378}  to={512}  kick="UNO · DIAGNOSTICAR"  head="Diez minutos delante del cliente." />
        <Lower f={f} from={532}  to={646}  kick="SI FALLAS AHÍ"       head="El trabajo vuelve y pierdes la garantía." />
        <Lower f={f} from={672}  to={790}  kick="DOS · COTIZAR"       head="Veinte minutos parado en la vereda." />
        <Lower f={f} from={820}  to={950}  kick="TRES · CONSEGUIR"    head="Diez clientes sin gastar un peso." />
        <Lower f={f} from={982}  to={1046} kick="CUATRO · QUÉ NO TOMAR" head="Saber qué trabajos no tomar." />
        <Lower f={f} from={1060} to={1128} kick="LOS TREINTA Y CINCO DÓLARES" head="Eso ya lo viste hace un rato." />
        <Lower f={f} from={1152} to={1200} kick="LA CONSECUENCIA"     head="Que el primer año no te fundas." />
        {/* El último acto aterriza acá. ⛔ Ni el precio ni la URL: el QR y la portada los monta el build. */}
        <Lower f={f} from={1210} to={DUR}  head="Eso es el curso." />
      </AbsoluteFill>

      {/* ═══ L9 · ATMÓSFERA — montada UNA sola vez para los 1239 frames, jamás se remonta ═════════ */}
      <Atmos t={L} dust={30} />
    </AbsoluteFill>
  );
};

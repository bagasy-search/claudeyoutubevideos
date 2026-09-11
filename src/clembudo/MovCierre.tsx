// MovCierre.tsx — `clembudo` · EL MOVIMIENTO DE CONVERSIÓN (653,00 s → 694,30 s · 1239 frames @30fps)
//
// "Con esto no te alcanza. Yo te acabo de dar el método. Para cobrarlo te faltan CUATRO COSAS."
// El objeto protagonista del movimiento entero es UNA BARAJA: la hoja del cuaderno del acto 1 se
// vuelve la primera carta, las otras tres salen de atrás de ella, el abanico gira una carta por
// carencia, y al final las cuatro colapsan en la pila de hojas impresas que ES el curso.
//
// ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
// │ TABLA DE HANDOFF — cada acto arranca EXACTAMENTE en el exitTo del anterior                      │
// ├────────────────────────────────────────────────────────────────────────────────────────────────┤
// │ ACTO 1 · f 0–116 · "Con esto no te alcanza / yo te acabo de dar el método"   (AVATAR VISIBLE)   │
// │   enterFrom cam {z 1.00, panX +86, panY +12, ry −6.0, rx +1.0} · luz 0.350                      │
// │             materia: (del MovCaso35) el galpón ya calentándose, cuadro limpio                   │
// │   exitTo    cam {z 1.04, panX +46, panY   0, ry −3.2, rx +0.8} · luz 0.371                      │
// │             materia: LA HOJA DEL CUADERNO (s440) flotando en el tercio izquierdo                │
// │                                                                                                 │
// │ ── FRONTERA 1 @ f117 · MATCH-SHAPE ───────────────────────────────────────────────────────────  │
// │   La hoja NO se va: gira sobre su eje vertical (0°→180°) y en el instante en que está de canto  │
// │   —ancho cero, swap invisible— su otra cara ya es la CARTA 1 (el diagnóstico). Mientras gira,    │
// │   el banco de trabajo sube desde abajo del cuadro (objeto físico, ⛔ no un fade) y las otras     │
// │   tres cartas salen de atrás de ella. Mismo rectángulo, misma posición, misma inercia.          │
// ├────────────────────────────────────────────────────────────────────────────────────────────────┤
// │ ACTO 2 · f 117–369 · "Te faltan cuatro cosas / separan al que cobra 80 del que cobra 250"       │
// │   enterFrom cam {z 1.04, panX +46, panY   0, ry −3.2, rx +0.8} · luz 0.371                      │
// │             materia: la hoja, ya girando, convertida en la carta 1                              │
// │   exitTo    cam {z 1.10, panX   0, panY −10, ry +3.0, rx −1.0} · luz 0.418                      │
// │             materia: EL ABANICO DE CUATRO CARTAS, armado y con la 1 al frente                   │
// │                                                                                                 │
// │ ── FRONTERA 2 @ f370 · ZOOM-THROUGH ──────────────────────────────────────────────────────────  │
// │   La cámara no corta: ENTRA en la carta 1. z 1.04→1.10 y la carta se agranda ×1.42 hasta        │
// │   dominar el plano; las otras tres quedan atrás, chicas y al borde. Se pasa de plano general    │
// │   del abanico a plano de producto de una sola carta sin un solo frame de nada.                  │
// ├────────────────────────────────────────────────────────────────────────────────────────────────┤
// │ ACTO 3 · f 370–663 · CARENCIA 1: diagnosticar en 10 min + SU CONSECUENCIA (la garantía)         │
// │   enterFrom cam {z 1.10, panX   0, panY −10, ry +3.0, rx −1.0} · luz 0.418                      │
// │             materia: la carta 1 al frente con el clip del medidor delante del cliente (s434)    │
// │   exitTo    cam {z 1.18, panX −110, panY −20, ry +7.5, rx −1.6} · luz 0.472                     │
// │             materia: la MISMA carta, ya girada a su segunda cara: la mancha que vuelve (s435)   │
// │   (dentro del acto, f526: la carta vuelve a girar 180° — el gesto es la consecuencia)           │
// │                                                                                                 │
// │ ── FRONTERA 3 @ f664 · OCLUSIÓN ──────────────────────────────────────────────────────────────  │
// │   El cuero del delantal de Claudio cruza el cuadro en diagonal (#B5854F — ⛔ NO el color del     │
// │   fondo: es la materia real que ya está en la escena) y detrás el abanico ya rotó una carta.    │
// │   Cambio de tema fuerte (de la garantía al dinero) → pide tapar, no fundir.                     │
// ├────────────────────────────────────────────────────────────────────────────────────────────────┤
// │ ACTO 4 · f 664–973 · CARENCIAS 2 y 3: cotizar (Luis en la vereda) · los primeros 10 clientes    │
// │   enterFrom cam {z 1.18, panX −110, panY −20, ry +7.5, rx −1.6} · luz 0.472                     │
// │             materia: el abanico, ya con la carta 2 al frente cuando se despeja el cuero         │
// │   exitTo    cam {z 1.14, panX −200, panY −10, ry +12.0, rx −1.4} · luz 0.535                    │
// │             materia: el abanico EN PLENA ROTACIÓN hacia la carta 4 (no se detiene en la costura)│
// │                                                                                                 │
// │ ── FRONTERA 4 @ f974 · MATCH-MOVE ────────────────────────────────────────────────────────────  │
// │   La cámara ya viene paneando a la derecha (panX −110→−200) y el abanico ya viene rotando       │
// │   desde f956. El contenido cambia DETRÁS del movimiento: la carta 3 sale por el borde y la 4    │
// │   entra, sin que nada arranque ni se detenga.                                                   │
// ├────────────────────────────────────────────────────────────────────────────────────────────────┤
// │ ACTO 5 · f 974–1141 · CARENCIA 4: qué trabajos NO tomar + CALLBACK de los 35 dólares            │
// │   enterFrom cam {z 1.14, panX −200, panY −10, ry +12.0, rx −1.4} · luz 0.535                    │
// │             materia: la carta 4 llegando al frente (la palma del "ese no lo tomo", s438)        │
// │   exitTo    cam {z 1.08, panX −120, panY  +8, ry +6.0, rx −0.3} · luz 0.579                     │
// │             materia: las cuatro cartas juntas otra vez + la carta-recuerdo de los 35 dólares    │
// │   (f1054: vuelve desde el fondo el clip s411 — el apretón de los 35 dólares, el MISMO material  │
// │    del MovCaso35. Es el cierre del arco: la carencia 4 ES el caso que ya vio.)                  │
// │                                                                                                 │
// │ ── FRONTERA 5 @ f1142 · MATCH-SHAPE ──────────────────────────────────────────────────────────  │
// │   Cuatro rectángulos → UNO. Las cartas convergen y se apilan con desfase de unos milímetros     │
// │   (una pila real), y por delante sube la hoja de arriba: la palma de Claudio sobre la pila de   │
// │   hojas impresas (s439). No hay fundido: una carta se apoya sobre las otras cuatro.             │
// ├────────────────────────────────────────────────────────────────────────────────────────────────┤
// │ ACTO 6 · f 1142–1238 · "que el primer año no te fundas" → la pila. ESO ES EL CURSO.             │
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
// LUZ: luz(f, 1239, 0.35, 0.60) — el tramo más cálido del video. Una sola rampa, sin saltos: el
// ámbar de galpón al atardecer entra por la clave cálida (L5) y por el tint de <Atmos/>.
//
// AVATAR: sólo se ve en el ACTO 1 (fondo transparente, elementos en el tercio IZQUIERDO y en la
// franja inferior — ⛔ nunca boca ni mentón). Del acto 2 en adelante el banco de trabajo sube y
// tapa el cuadro entero.
//
// ⛔ NO se escribe el precio del curso ni la URL: el QR y la portada los monta el build.
// ⛔ Math.random / Date.now: cero (todo sale de hash/rng de Stage y de useCurrentFrame).
// ⛔ backdrop-filter: cero. ⛔ blur full-screen: cero. ⛔ <Video>: cero (todo OffthreadVideo).
import React from "react";
import {
  AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame,
} from "remotion";
import { Atmos, C, Glass, Head, Kick, Occluder, cam, camStyle, luz, rampIn, rng } from "./Stage";

const DUR = 1239;

// ── frames de los actos (derivados de los timestamps REALES de Whisper) ─────────────────────────
const A2 = 117;   // 656,90 "para cobrarlo te faltan 4 cosas"
const A3 = 370;   // 665,32 "diagnosticar en 10 minutos delante del cliente"
const A4 = 664;   // 675,12 "cotizar, que es lo que a Luis le costó 20 minutos"
const A5 = 974;   // 685,46 "y saber qué trabajos no tomar"
const A6 = 1142;  // 691,06 "y es lo que evita que el primer año te fundas"

const EZ = Easing.bezier(0.22, 0.61, 0.24, 1);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const ramp = (f: number, a: number, b: number, e = EZ) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });

const IMG = (n: string) => staticFile(`img/clembudo/${n}.png`);
const CLIP = (n: string) => staticFile(`broll/clembudo/${n}.mp4`);

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
const CW = 620, CH = 349;              // 16:9, igual que el material (1792×1008)
const FAN_X = 940, FAN_Y = 520;        // centro del abanico en coordenadas de mundo
const UNO_X = 290, UNO_Y = 604;        // slot del acto 1: tercio IZQUIERDO (el avatar queda libre)
const DECK_X = 838, DECK_Y = 566;      // dónde se apila todo en el acto 6

type Slot = { x: number; y: number; z: number; sc: number; ry: number };

// ── MATERIAL REAL adentro de cada carta ─────────────────────────────────────────────────────────
// El PNG es literalmente el frame 0 del MP4 (los clips son i2v generados desde esa imagen), así que
// mostrar el PNG mientras la carta está en el fondo y encender el clip cuando pasa al frente NO se
// ve: es el mismo cuadro. Además ahorra decodificar cuatro videos todo el tiempo.
// ⛔ `loop` no es prop de OffthreadVideo y los clips duran 5,04 s: cada ventana se cubre con
//    `playbackRate` calibrado, nunca loopeando.
const Mat: React.FC<{
  png: string; vid?: { from: number; dur: number; rate: number }; kb?: number; mirror?: boolean;
}> = ({ png, vid, kb = 1.04, mirror = false }) => (
  <div style={{ position: "absolute", inset: 0, transform: mirror ? "scaleX(-1)" : undefined }}>
    <Img
      src={IMG(png)}
      style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${kb.toFixed(4)})` }}
    />
    {vid ? (
      <Sequence from={vid.from} durationInFrames={vid.dur}>
        <OffthreadVideo
          src={CLIP(png)}
          muted
          playbackRate={vid.rate}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Sequence>
    ) : null}
    {/* marco de la carta + hundido de los bordes (iluminación de producto, no un borde plano) */}
    <div
      style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        boxShadow: "inset 0 0 0 3px rgba(245,238,220,0.34), inset 0 0 70px rgba(42,38,32,0.44)",
      }}
    />
  </div>
);

const Card: React.FC<{ s: Slot; turn?: number; w?: number; h?: number; lift?: number; children: React.ReactNode }> =
  ({ s, turn = 0, w = CW, h = CH, lift = 1, children }) => (
    <div
      style={{
        position: "absolute", left: s.x, top: s.y, width: 0, height: 0,
        transformStyle: "preserve-3d",
        transform: `translateZ(${s.z.toFixed(2)}px) rotateY(${(s.ry + turn).toFixed(2)}deg) scale(${s.sc.toFixed(4)})`,
      }}
    >
      <Glass x={-w / 2} y={-h / 2} w={w} h={h} lift={lift}>{children}</Glass>
    </div>
  );

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

// ── TEXTO (L8, espacio de PANTALLA: no lo arrastra el paneo, siempre legible y siempre en safe) ──
// 1 idea por acto · titular ≤7 palabras · ⛔ sin precio del curso, ⛔ sin URL.
const Txt: React.FC<{ f: number; from: number; to: number; kick?: string; head?: string; kick2?: string; kickAt?: number }> =
  ({ f, from, to, kick, head, kick2, kickAt = 0 }) => {
    if (f < from - 2 || f > to + 10) return null;
    const a = ramp(f, from, from + 11) * (1 - ramp(f, to, to + 9, Easing.in(Easing.cubic)));
    const dy = (1 - ramp(f, from, from + 13)) * 20;
    // el rótulo puede cambiar dentro del acto (es una etiqueta, no una idea nueva)
    const swap = kick2 ? ramp(f, kickAt, kickAt + 9) : 0;
    return (
      <div
        style={{
          position: "absolute", left: 104, bottom: 124, width: 850,
          opacity: a, transform: `translateY(${dy.toFixed(2)}px)`,
        }}
      >
        <div style={{ marginBottom: 14, height: kick ? 38 : 0, position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, opacity: 1 - swap, transform: `translateY(${(-10 * swap).toFixed(2)}px)` }}>
            {kick ? <Kick size={29}>{kick}</Kick> : null}
          </div>
          {kick2 ? (
            <div style={{ position: "absolute", inset: 0, opacity: swap, transform: `translateY(${(12 * (1 - swap)).toFixed(2)}px)` }}>
              <Kick size={29}>{kick2}</Kick>
            </div>
          ) : null}
        </div>
        {head ? <Head size={57}>{head}</Head> : null}
      </div>
    );
  };

export const MovCierre: React.FC = () => {
  const f = useCurrentFrame();
  const K = camAt(f);
  const L = luz(f, DUR, 0.35, 0.60);          // 0.35 → 0.60: el tramo más cálido del video
  const rin = rampIn(f, 14);                   // entrada ≤15 frames (⛔ nada subiendo 2 s de negro)

  // El SET (pared, banco, viga, cuero) sube desde abajo del cuadro: es un objeto que entra, ⛔ no un fade.
  // ⚠️ MEDIDO: con 1240 px la pared (que arranca en y −700 y mide 2500) seguía asomando por la mitad
  // inferior del cuadro durante TODO el acto 1 y le tapaba el pecho al avatar. El recorrido tiene que
  // dejar el borde SUPERIOR de la pared (−700) por debajo de los 1080 px → mínimo 1780.
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

  // Slot del abanico puro (sin migración ni colapso)
  const fanSlot = (i: number): Slot => {
    const d = i - fr;
    const ad = Math.abs(d);
    const prom = Math.max(0, 1 - ad);                            // 1 = está al frente
    return {
      x: FAN_X + d * 352,
      y: FAN_Y + ad * 30 - prom * 14 + Math.sin((f + i * 47) / 61) * (3 + prom * 4),
      z: 180 * prom - 150 * Math.min(ad, 2.2),
      sc: (1 - Math.min(ad, 3) * 0.15) * (1 + prom * 0.42),
      ry: -d * 15,
    };
  };
  const mix = (a: Slot, b: Slot, k: number): Slot => ({
    x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), z: lerp(a.z, b.z, k),
    sc: lerp(a.sc, b.sc, k), ry: lerp(a.ry, b.ry, k),
  });
  const toDeck = (s: Slot, i: number): Slot =>
    col > 0
      ? mix(s, { x: DECK_X + i * 9, y: DECK_Y - i * 7, z: -10 - i * 14, sc: 0.86, ry: -4 + i * 2 }, col)
      : s;

  // CARTA 0 · viene del slot del acto 1 (tercio izquierdo, el avatar libre) y migra al frente.
  const s0 = toDeck(
    intro > 0
      ? mix(fanSlot(0), { x: UNO_X, y: UNO_Y, z: 40, sc: 0.80, ry: -3 }, intro)
      : fanSlot(0),
    0,
  );
  // CARTAS 1-3 · ⛔ NO existen en el acto 1: nacen EXACTAMENTE debajo de la carta 0 (mismo x/y, un
  // pelo más chicas y más al fondo) y salen de atrás de ella. Si se las dejara en el centro del
  // abanico durante el acto 1 quedarían encima de la cara del avatar.
  // ⚠️ MEDIDO: mientras la carta 0 gira está DE CANTO (ancho cero) y deja al descubierto lo que tiene
  // detrás. Las otras tres no pueden existir hasta que la carta 0 vuelve a estar de frente (f162).
  const deckOn = f >= 160;
  const em = ramp(f, 166, 224);
  const behind = (i: number): Slot => ({ x: s0.x, y: s0.y + i * 5, z: s0.z - 26 - i * 20, sc: s0.sc * 0.97, ry: s0.ry });
  const sN = (i: number) => toDeck(mix(behind(i), fanSlot(i), em), i);
  const s1 = sN(1), s2 = sN(2), s3 = sN(3);

  // La hoja de arriba de la pila: sube por delante y se apoya sobre las otras cuatro (MATCH-SHAPE).
  const pk = ramp(f, 1146, 1202, Easing.out(Easing.poly(4)));
  const pile: Slot = {
    x: lerp(DECK_X + 46, DECK_X - 18, pk),
    y: lerp(DECK_Y + 690, DECK_Y - 26, pk),
    z: lerp(210, 22, pk),
    sc: lerp(1.24, 1.44, pk),
    ry: lerp(-13, -3, pk),
  };

  // Carta-recuerdo: los 35 dólares vuelven desde el fondo (MISMO material del MovCaso35) y, cuando
  // arranca el colapso, se HUNDEN detrás de la pila (salida física, ⛔ no un fade).
  const ck = ramp(f, 1054, 1104, Easing.out(Easing.cubic));
  const cOut = ramp(f, A6, 1176, Easing.in(Easing.cubic));
  const callback: Slot = {
    x: lerp(lerp(560, 470, ck), DECK_X - 40, cOut),
    y: lerp(lerp(760, 690, ck), DECK_Y + 150, cOut),
    z: lerp(lerp(-260, -30, ck), -430, cOut),
    sc: lerp(lerp(0.42, 0.62, ck), 0.18, cOut),
    ry: lerp(lerp(22, 13, ck), 26, cOut),
  };
  // Luis parado en la vereda: entra detrás de la carta de cotizar y se hunde cuando gira el abanico.
  const lk = ramp(f, 686, 736, Easing.out(Easing.cubic));
  const lOut = ramp(f, 796, 828, Easing.in(Easing.cubic));
  const luisS: Slot = {
    x: lerp(lerp(500, 430, lk), 330, lOut),
    y: lerp(lerp(742, 686, lk), 820, lOut),
    z: lerp(lerp(-250, -46, lk), -430, lOut),
    sc: lerp(lerp(0.40, 0.58, lk), 0.18, lOut),
    ry: lerp(lerp(-20, -12, lk), -26, lOut),
  };

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* ═══ EL MUNDO — UNA sola perspectiva, UNA sola cámara, montada una vez ═══════════════════ */}
      <AbsoluteFill style={camStyle(K)}>
        {/* ── EL SET (sube entero en la frontera 1: objeto que entra, ⛔ no un fade) ───────────── */}
        <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `translateY(${setY.toFixed(1)}px)` }}>
          {/* L0 · pared de tablas del galpón (z −620: el plano que MENOS se mueve) */}
          <div
            style={{
              position: "absolute", left: -1180, top: -700, width: 4280, height: 2500,
              transform: "translateZ(-620px)",
              background: `linear-gradient(176deg, #2A2419 0%, #3B3222 38%, #4A3D27 72%, #2B2418 100%)`,
              backgroundImage: [
                "repeating-linear-gradient(90deg, rgba(0,0,0,0.24) 0 3px, rgba(0,0,0,0) 3px 146px)",
                "repeating-linear-gradient(90deg, rgba(255,228,176,0.05) 0 1px, rgba(0,0,0,0) 1px 146px)",
                `linear-gradient(176deg, #2A2419 0%, #3B3222 38%, #4A3D27 72%, #2B2418 100%)`,
              ].join(","),
            }}
          />
          {/* L1 · EL BANCO DE TRABAJO — es el cuaderno del oficio (s440) tumbado: la materia del
              acto 1 no se va, se vuelve el suelo sobre el que flota toda la baraja. */}
          <div
            style={{
              position: "absolute", left: -420, top: 250, width: 2760, height: 1760,
              transform: "translateZ(-190px) rotateX(56deg)",
              transformOrigin: "50% 0%",
              overflow: "hidden",
              boxShadow: "0 -26px 70px rgba(20,16,10,0.55)",
            }}
          >
            <Img src={IMG("clembudo_s440")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(30,25,16,0.30) 0%, rgba(30,25,16,0.74) 58%, rgba(24,20,13,0.94) 100%)" }} />
            {/* canto iluminado del banco: el borde que lidera la entrada del set */}
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 7, background: "linear-gradient(90deg, rgba(255,226,168,0) 0%, rgba(255,226,168,0.58) 26%, rgba(255,226,168,0.62) 74%, rgba(255,226,168,0) 100%)" }} />
          </div>
          {/* L6 · viga de madera en el borde derecho (primer plano: el que MÁS se mueve) */}
          <div
            style={{
              position: "absolute", left: 1680, top: -230, width: 150, height: 1560,
              transform: "translateZ(215px)",
              background: "linear-gradient(90deg, rgba(18,14,9,0.94) 0%, rgba(46,37,24,0.90) 46%, rgba(12,9,6,0.96) 100%)",
              boxShadow: "-30px 0 70px rgba(16,12,7,0.62)",
            }}
          />
          {/* L6 · el cuero del delantal cruzando abajo, fuera de plano (contacto y profundidad) */}
          <div
            style={{
              position: "absolute", left: -300, right: -300, bottom: -120, height: 250,
              transform: "translateZ(232px) rotate(-1.6deg)",
              background: `linear-gradient(180deg, rgba(24,17,10,0) 0%, rgba(58,38,21,0.72) 42%, ${C.ink} 100%)`,
            }}
          />
        </div>

        <DustWorld f={f} />

        {/* ── L3/L4 · LA BARAJA. Cada carta lleva MATERIAL REAL adentro y su propio desfase: la
            delantera vive a translateZ +180 y la de atrás a −330, así que bajo el mismo paneo la
            delantera se mueve ~1,45× más que la trasera (parallax real, no simulado). ───────── */}
        <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", opacity: rin }}>
          {deckOn ? (
            <>
              {/* CARTA 2 · COTIZAR — la mano escribiendo el número en la planilla */}
              <Card s={s1}>
                <Mat png="clembudo_s436" vid={{ from: 656, dur: 170, rate: 0.88 }} kb={1.05} />
              </Card>
              {/* CARTA 3 · CONSEGUIR — el apretón en la puerta de la casa */}
              <Card s={s2}>
                <Mat png="clembudo_s437" vid={{ from: 804, dur: 178, rate: 0.84 }} kb={1.05} />
              </Card>
              {/* CARTA 4 · NO TOMAR — la palma abierta del "ese no lo tomo" */}
              <Card s={s3}>
                <Mat png="clembudo_s438" vid={{ from: 964, dur: 186, rate: 0.81 }} kb={1.05} />
              </Card>
            </>
          ) : null}

          {/* CARTA-RECUERDO · los 35 dólares: el MISMO clip del MovCaso35 volviendo desde el fondo */}
          {f >= 1046 && f < 1180 ? (
            <Card s={callback} w={520} h={293} lift={0.8}>
              <Mat png="clembudo_s411" vid={{ from: 1054, dur: 96, rate: 1 }} kb={1.06} />
            </Card>
          ) : null}
          {/* CARTA-RECUERDO · Luis, veinte minutos parado en la vereda */}
          {f >= 678 && f < 832 ? (
            <Card s={luisS} w={520} h={293} lift={0.8}>
              <Mat png="clembudo_s422" vid={{ from: 686, dur: 128, rate: 1 }} kb={1.06} />
            </Card>
          ) : null}

          {/* CARTA 1 — la que viene del acto 1. Tres caras, y el swap ocurre SIEMPRE de canto:
              0 el cuaderno (el método que ya te di) · 1 el diagnóstico · 2 la mancha que vuelve. */}
          <Card s={s0} turn={turn0}>
            {face0 === 0 ? (
              <Mat png="clembudo_s440" kb={1.06 + ramp(f, 0, A2) * 0.05} />
            ) : face0 === 1 ? (
              <Mat png="clembudo_s434" vid={{ from: 364, dur: 178, rate: 0.84 }} kb={1.05} mirror />
            ) : (
              <Mat png="clembudo_s435" kb={1.04 + ramp(f, 540, A4 + 40) * 0.10} />
            )}
          </Card>

          {/* LA HOJA DE ARRIBA — la pila de hojas impresas: ESO es el curso. */}
          {f >= 1142 ? (
            <Card s={pile} w={640} h={360} lift={1.25}>
              <Mat png="clembudo_s439" vid={{ from: 1146, dur: 93, rate: 1 }} kb={1.04} />
            </Card>
          ) : null}
        </div>
      </AbsoluteFill>

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

      {/* ═══ ACTO 6 · el tercio derecho queda LIMPIO y velado: ahí se monta la tarjeta de CTA ═════ */}
      <AbsoluteFill
        style={{
          pointerEvents: "none", opacity: ramp(f, 1156, 1216),
          background: "linear-gradient(90deg, rgba(24,19,12,0) 60%, rgba(24,19,12,0.30) 78%, rgba(24,19,12,0.52) 100%)",
        }}
      />

      {/* ═══ L8 · TEXTO — 1 idea por acto, cama oscura abajo a la izquierda para legibilidad +60 ══ */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: "linear-gradient(22deg, rgba(22,17,11,0.80) 0%, rgba(22,17,11,0.42) 34%, rgba(22,17,11,0) 60%)",
          opacity: 0.92,
        }}
      />
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Txt f={f} from={6}    to={104}  kick="EL MÉTODO YA ESTÁ"        head="Con esto todavía no te alcanza." />
        <Txt f={f} from={122}  to={196}  kick="TE FALTAN"                head="Cuatro cosas para poder cobrarlo." />
        <Txt f={f} from={208}  to={356}  kick="LO QUE SEPARA"            head="De cobrar 80 a cobrar 250." />
        <Txt f={f} from={378}  to={512}  kick="UNO · DIAGNOSTICAR"       head="Diez minutos delante del cliente." />
        <Txt f={f} from={532}  to={648}  kick="SI FALLAS AHÍ"            head="El trabajo vuelve y pierdes la garantía." />
        <Txt f={f} from={672}  to={790}  kick="DOS · COTIZAR"            head="Veinte minutos parado en la vereda." />
        <Txt f={f} from={820}  to={950}  kick="TRES · CONSEGUIR"         head="Diez clientes sin gastar un peso." />
        <Txt
          f={f} from={982} to={1128}
          kick="CUATRO · QUÉ NO TOMAR" kick2="LOS TREINTA Y CINCO DÓLARES" kickAt={1062}
          head="Saber qué trabajos no tomar."
        />
        <Txt f={f} from={1152} to={1200} kick="LA CONSECUENCIA"          head="Que el primer año no te fundas." />
        {/* El último acto aterriza acá. ⛔ Ni el precio ni la URL: el QR y la portada los monta el build. */}
        <Txt f={f} from={1210} to={DUR}  head="Eso es el curso." />
      </AbsoluteFill>

      {/* ═══ L9 · ATMÓSFERA — montada UNA sola vez para los 1239 frames, jamás se remonta ═════════ */}
      <Atmos t={L} dust={30} />
    </AbsoluteFill>
  );
};

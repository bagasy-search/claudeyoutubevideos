// MovTresAguas.tsx — clembudo · El Constructor Libre · 199,5 s → 252,0 s · 1575 frames @30fps
//
// PICO DE VALOR DEL VIDEO: "el agua sólo puede venir de TRES lugares". Es el momento de LA LÁMINA:
// una página REAL del curso (`img/laminas/m02_03_tres_origenes.png`) que aparece como objeto físico
// sobre la mesa del galpón y NO se suelta más: queda de fondo durante los tres actos y sus tres
// flechas (EL AIRE / DE AFUERA / EL SUELO) son el índice del movimiento entero.
//
// ═══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF  (cam = {z, panX, panY, ry} del helper cam() + tramo continuo; luz = luz())
// ═══════════════════════════════════════════════════════════════════════════════════════════════
// A1  LA PÁGINA SOBRE LA MESA                                        f 0 → 208   (208 f · 6,9 s)
//     enterFrom cam{z 1.02, panX 0, panY -8, ry -5}   luz 0.150  materia: — (la mesa SUBE y ocluye al avatar)
//     exitTo    cam{z 1.03, panX -40, panY 14, ry -3} luz 0.170  materia: LA LÁMINA en héroe, flecha AIRE
// A2  EL VASO FRÍO — condensación                                    f 208 → 596 (388 f · 12,9 s)
//     enterFrom = exitTo A1                           luz 0.170  materia: la flecha verde → se entra EN ella
//     exitTo    cam{z 1.05, panX 30, panY -6, ry 0}   luz 0.205  materia: EL RECTÁNGULO HÉROE (980×551)
// A3  LA CASA QUE SUELTA LITROS — travelling de 7 materiales         f 596 → 1051 (455 f · 15,2 s)
//     enterFrom = exitTo A2                           luz 0.205  materia: el rectángulo héroe, ya agrandado
//     exitTo    cam{z 1.07, panX -20, panY -24, ry 2} luz 0.250  materia: la tira + el cuero del delantal
// A4  DE AFUERA — muro, teja, canaleta, junta                        f 1051 → 1301 (250 f · 8,3 s)
//     enterFrom = exitTo A3                           luz 0.250  materia: LA LÁMINA vuelve a héroe (flecha roja)
//     exitTo    cam{z 1.08, panX 40, panY -70, ry 3}  luz 0.276  materia: la tarjeta de LA JUNTA ABIERTA
// A5  DEL SUELO — capilaridad                                        f 1301 → 1470 (169 f · 5,6 s)
//     enterFrom = exitTo A4                           luz 0.276  materia: la MISMA tarjeta, dada vuelta
//     exitTo    cam{z 1.09, panX -10, panY -96, ry 4} luz 0.292  materia: la línea de agua del zócalo
// A6  EL TERRÓN Y LAS TRES MANCHAS                                   f 1470 → 1575 (105 f · 3,5 s)
//     enterFrom = exitTo A5                           luz 0.292  materia: el café que trepa = la pared
//     exitTo    cam{z 1.10, panX 20, panY -30, ry 4}  luz 0.300  materia: las 3 manchas alineadas + la lámina
//
// COSTURAS (ninguna es un fade; dos seguidas nunca repiten)
//   F1 @208  ZOOM-THROUGH   — la cámara se mete DENTRO de la flecha verde "EL AIRE" y sale en el macro
//                             del vidrio empañado. General → macro, que es para lo que sirve.
//   F2 @596  MATCH-MOVE     — la tira ya viene andando hacia la izquierda: el material cambia DETRÁS del
//                             movimiento mientras la grúa sube y agranda el rectángulo héroe.
//   F3 @1051 OCLUSIÓN       — cruza EL CUERO DEL DELANTAL (C.gold, luma ≈130 · NO el color del fondo, que
//                             haría un fundido a negro). Cambio de tema fuerte: del aire al muro.
//   F4 @1301 MATCH-SHAPE    — la tarjeta de la junta abierta GIRA sobre su eje (mismo rectángulo exacto,
//                             980×551 en 880,250) y del otro lado ya está el arranque del muro.
//   F5 @1470 ZOOM-THROUGH   — se entra en la línea de agua del zócalo y se sale en el café trepando el
//                             terrón. No es vecina de la F1, así que ninguna frontera repite a su vecina.
//   Aterrizaje interno @1549 — no es costura: las 3 manchas SUBEN de la bandeja y el terrón BAJA a ella.
//
// EL AVATAR: visible sólo f 0→54, mientras la mesa del galpón SUBE desde abajo y lo ocluye (entrada por
// materia, no por fade). De f 54 a 1575 el movimiento tapa el cuadro entero: es el pico de la lámina y
// el presentador vuelve en el movimiento siguiente (s224, "anotá estas tres frases").
//
// LAS DOS LÁMINAS SE MUESTRAN ENTERAS, NÍTIDAS Y QUIETAS, SIN TIPOGRAFÍA MÍA ENCIMA:
//   · m02_19_regla_tres    → f 54 → 150 (3,2 s) entera, junto a la otra, sobre la mesa.
//   · m02_03_tres_origenes → entera TODO el movimiento; en héroe f 150→262 y f 1051→1205.
//
// CONTRATO: cero Math.random/Date · cero backdrop-filter · cero blur grande · OffthreadVideo (nunca
// <Video>, nunca loop) · clips de 5,04 s dentro de <Sequence> para que arranquen en su frame 0 · debajo
// de cada clip está SU MISMA FOTO (el i2v salió de ella, así que montar el video no se ve) · Easing.poly
// en vez de quint · safe area 60 px sobre el rect ya calculado.
import React from "react";
import {
  AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate, Easing,
} from "remotion";
import { C, cam, camStyle, luz, Atmos, Glass, Head, Kick, Occluder, rng, rampIn } from "./Stage";

const DUR = 1575;
const PER = 1600; // la misma perspective que usa camStyle

const foto = (n: string) => staticFile(`img/clembudo/${n}.png`);
const video = (n: string) => staticFile(`broll/clembudo/${n}.mp4`);
const LAM_TRES = staticFile("img/laminas/m02_03_tres_origenes.png");
const LAM_REGLA = staticFile("img/laminas/m02_19_regla_tres.png");

// interpolación multi-parada con easing POR SEGMENTO en inOut → velocidad 0 en cada parada:
// continua en posición Y en velocidad. Nunca hay un "reset" de cámara ni un tirón en una frontera.
const E = Easing.inOut(Easing.cubic);
const ip = (f: number, k: number[], v: number[]) =>
  interpolate(f, k, v, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: E });

// un plano a profundidad z, compensando el encogimiento que le mete la perspectiva
const plane = (z: number, over = 1.0): React.CSSProperties => ({
  position: "absolute", inset: 0,
  transform: `translateZ(${z}px) scale(${((PER - z) / PER) * over})`,
  transformStyle: "preserve-3d",
});

// ── LA PÁGINA IMPRESA — material REAL (la página del curso) con marco y sombra de contacto ──────
const Page: React.FC<{ src: string; x: number; y: number; w: number; z?: number; rot?: number; op?: number }> =
  ({ src, x, y, w, z = -40, rot = 0, op = 1 }) => {
    const h = (w * 1008) / 1792;
    if (op <= 0.004) return null;
    return (
      <div
        style={{
          position: "absolute", left: x, top: y, width: w, height: h, opacity: op,
          transform: `translateZ(${z}px) rotate(${rot}deg)`,
          transformStyle: "preserve-3d",
          background: "#FCF8EE",
          padding: Math.max(6, w * 0.012),
          boxShadow: [
            `0 ${Math.round(w * 0.018)}px ${Math.round(w * 0.05)}px rgba(42,38,32,0.34)`,
            "0 3px 7px rgba(42,38,32,0.30)",
            "inset 0 1px 0 rgba(255,255,255,0.9)",
          ].join(","),
        }}
      >
        <Img src={src} style={{ width: "100%", height: "100%", objectFit: "fill", display: "block" }} />
        {/* luz de producto sobre el papel: key arriba-izquierda, suave, no toca la legibilidad */}
        <div
          style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background:
              "linear-gradient(128deg, rgba(255,250,232,0.20) 0%, rgba(255,250,232,0.00) 34%, rgba(42,38,32,0.00) 66%, rgba(42,38,32,0.11) 100%)",
          }}
        />
      </div>
    );
  };

// ── halo pulsante sobre una flecha de la lámina: es un ARO, no una mancha, así no tapa la etiqueta
const ArrowGlow: React.FC<{ cx: number; cy: number; r: number; color: string; k: number; f: number }> =
  ({ cx, cy, r, color, k, f }) => {
    if (k <= 0.004) return null;
    const pulse = 0.62 + Math.sin(f / 7.5) * 0.24;
    return (
      <div
        style={{
          position: "absolute", left: cx - r, top: cy - r, width: r * 2, height: r * 2,
          borderRadius: "50%", opacity: k,
          border: `${Math.max(2, r * 0.055)}px solid ${color}`,
          boxShadow: `0 0 ${r * 0.75}px ${color}, inset 0 0 ${r * 0.55}px ${color}`,
          transform: `translateZ(6px) scale(${0.92 + pulse * 0.12})`,
        }}
      />
    );
  };

// ── MATERIAL REAL adentro de cada tarjeta: la foto de base + su clip encima.
// El clip i2v nació DE esa foto, así que su frame 0 calza exacto: montar el video no se ve.
const Mat: React.FC<{ name: string; clipFrom?: number; clipDur?: number }> = ({ name, clipFrom, clipDur = 151 }) => (
  <>
    <Img src={foto(name)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    {clipFrom !== undefined ? (
      <Sequence from={clipFrom} durationInFrames={clipDur} layout="absolute-fill">
        <OffthreadVideo src={video(name)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </Sequence>
    ) : null}
    <div
      style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        boxShadow:
          "inset 0 0 78px rgba(42,38,32,0.40), inset 0 2px 0 rgba(255,248,230,0.34), inset 0 -2px 0 rgba(42,38,32,0.30)",
      }}
    />
  </>
);

// ── TIRA DE 7 MATERIALES (A2 + A3): un solo travelling de 28 s. El índice de héroe es fraccionario,
// así que la tira NUNCA corta: se desliza y el material cambia detrás del movimiento.
const TIRA: { n: string; from: number }[] = [
  { n: "clembudo_s207", from: 208 }, // vidrio interior empañado, gotas que bajan
  { n: "clembudo_s208", from: 352 }, // el vaso frío transpirando sobre la madera
  { n: "clembudo_s211", from: 503 }, // el vapor arrastrándose por el techo
  { n: "clembudo_s209", from: 596 }, // la palma apoyada en la pared fría
  { n: "clembudo_s210", from: 660 }, // la olla destapada y la ropa tendida adentro
  { n: "clembudo_s212", from: 838 }, // el rincón de dos paredes exteriores
  { n: "clembudo_s213", from: 989 }, // la pared negra detrás del ropero
];

const txtOpacity = (f: number, a: number, b: number) =>
  interpolate(f, [a, a + 11, b - 9, b], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const txtShift = (f: number, a: number) =>
  interpolate(f, [a, a + 14], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.poly(3)) });

export const MovTresAguas: React.FC = () => {
  const f = useCurrentFrame();
  const t = luz(f, DUR, 0.15, 0.30);

  // ── UNA SOLA CÁMARA, función del frame GLOBAL. El acto 5 hereda lo del 4. Jamás vuelve a 0. ──
  const base = cam(f, DUR, { z: 1.02, ry: -5, rx: 5 }, { z: 1.10, ry: 4, rx: -3 });
  const KC = [0, 208, 596, 1051, 1301, 1470, 1575];
  const c = {
    ...base,
    z: base.z + ip(f, KC, [0, 0.01, 0.03, 0.05, 0.06, 0.07, 0.08]),
    panX: base.panX + ip(f, KC, [0, -40, 30, -20, 40, -10, 20]),
    panY: base.panY + ip(f, KC, [-8, 14, -6, -24, -70, -96, -30]),
  };

  // ── LA LÁMINA (rect continuo). Nunca se recorta contra el borde, nunca lleva texto mío encima. ──
  const KL = [0, 150, 208, 262, 1040, 1075, 1150, 1205, 1301, 1400, 1470, 1538, 1575];
  const lx = ip(f, KL, [90, 90, 340, 70, 70, 300, 300, 70, 62, 60, 60, 460, 460]);
  const ly = ip(f, KL, [320, 320, 200, 300, 300, 190, 190, 300, 292, 210, 180, 90, 90]);
  const lw = ip(f, KL, [840, 840, 1320, 760, 760, 1240, 1240, 760, 760, 760, 760, 1000, 1000]);
  const lh = (lw * 1008) / 1792;
  // las tres flechas, en coordenadas normalizadas de la página
  const aireX = lx + lw * 0.262, aireY = ly + lh * 0.515;
  const afueX = lx + lw * 0.715, afueY = ly + lh * 0.548;
  const sueloX = lx + lw * 0.585, sueloY = ly + lh * 0.835;

  // la segunda página del curso: entera y quieta f 54→150, después se guarda hacia la derecha
  const rx2 = ip(f, [0, 150, 205], [990, 990, 2180]);
  const rop = interpolate(f, [150, 196], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── EL RECTÁNGULO HÉROE: la MATERIA QUE CRUZA el movimiento entero (980×551 anclado en 880,250) ──
  const hx = ip(f, [208, 588, 620, 1051], [880, 880, 700, 700]);
  const hy = ip(f, [208, 588, 620, 1051], [250, 250, 200, 200]);
  const hw = ip(f, [208, 588, 620, 1051], [980, 980, 1120, 1120]);
  const hh = (hw * 551) / 980;

  // ── TIRA: índice de héroe fraccionario (el travelling de A2 + A3) ──
  const hero = ip(
    f,
    [208, 340, 366, 492, 516, 586, 610, 650, 672, 800, 824, 976, 1000, 1051],
    [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6]
  );
  const pitch = hw + 64;

  // ── F1 ZOOM-THROUGH: el portal se mete en la flecha verde y sale en el macro de la ventana ──
  const p1w = ip(f, [186, 214, 262], [84, 3000, hw]);
  const p1h = (p1w * 551) / 980;
  const p1cx = ip(f, [186, 214, 262], [aireX, 960, hx + hw / 2]);
  const p1cy = ip(f, [186, 214, 262], [aireY, 540, hy + hh / 2]);
  const p1r = ip(f, [186, 206, 240], [999, 60, 18]);

  // ── F5 ZOOM-THROUGH: se entra en la línea de agua del zócalo y se sale en el terrón ──
  const wlX = 880 + 980 * 0.5, wlY = 250 + 551 * 0.74;
  const a6w = ip(f, [1448, 1478, 1522, 1549, 1575], [84, 2700, 1240, 620, 540]);
  const a6cx = ip(f, [1448, 1478, 1522, 1549, 1575], [wlX, 960, 960, 1300, 665]);
  const a6cy = ip(f, [1448, 1478, 1522, 1549, 1575], [wlY, 540, 489, 700, 942]);
  const a6h = f < 1522 ? (a6w * 551) / 980 : ip(f, [1522, 1549, 1575], [697, 349, 84]);
  const a6r = ip(f, [1448, 1468, 1500], [999, 60, 16]);

  // ── la bandeja de manchas: cada acto deja la suya y al final suben las tres ──
  const CHIPS = [
    { n: "clembudo_s219", born: 1002, slot: 0 }, // difusa, arriba, en puntitos — el aire
    { n: "clembudo_s220", born: 1268, slot: 1 }, // óvalo café de borde duro — de afuera
    { n: "clembudo_s222", born: 1436, slot: 2 }, // banda desde el piso con polvo blanco — el suelo
  ];

  // entrada por MATERIA: la mesa del galpón sube desde abajo y ocluye al avatar (f 6 → 54)
  const reveal = interpolate(f, [6, 54], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.poly(3)),
  });

  const key = 0.16 + t * 0.42; // la luz cálida del galpón, que EVOLUCIONA con luz()

  return (
    <AbsoluteFill>
      {/* ── la mesa sube y tapa: de acá para abajo ya no se ve el avatar ────────────────────── */}
      <div
        style={{
          position: "absolute", left: 0, bottom: 0, width: 1920,
          height: Math.max(1, reveal * 1104), overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", left: 0, bottom: 0, width: 1920, height: 1080 }}>
          <AbsoluteFill style={camStyle(c)}>
            {/* L0 — la pared del galpón */}
            <div
              style={{
                ...plane(-520, 1.14),
                background: "linear-gradient(179deg, #C8B894 0%, #A8956E 44%, #7E6C4C 100%)",
              }}
            />
            {/* L1 — la viga y el estante */}
            <div style={plane(-380, 1.1)}>
              <div
                style={{
                  position: "absolute", left: 0, top: 122, width: "100%", height: 58,
                  background: "linear-gradient(180deg, #7A6647 0%, #5A4A33 60%, #463926 100%)",
                  boxShadow: "0 16px 34px rgba(28,24,18,0.42)",
                }}
              />
              <div
                style={{
                  position: "absolute", left: 0, top: 0, width: "100%", height: 122,
                  background: "linear-gradient(180deg, rgba(28,24,18,0.34) 0%, rgba(28,24,18,0.06) 100%)",
                }}
              />
            </div>
            {/* L2 — la tabla del banco de trabajo */}
            <div style={plane(-180, 1.08)}>
              <div
                style={{
                  position: "absolute", left: 0, top: 214, width: "100%", height: 900,
                  background: "linear-gradient(184deg, #8A7250 0%, #6F5A3C 26%, #57462F 74%, #3E3222 100%)",
                }}
              />
              {new Array(9).fill(0).map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute", left: 0, top: 214 + i * 104 + rng(3, i) * 16,
                    width: "100%", height: 2,
                    background: `rgba(28,24,18,${0.16 + rng(9, i) * 0.16})`,
                  }}
                />
              ))}
              <div
                style={{
                  position: "absolute", left: 0, top: 200, width: "100%", height: 26,
                  background: "linear-gradient(180deg, rgba(255,244,214,0.30) 0%, rgba(255,244,214,0) 100%)",
                }}
              />
            </div>

            {/* L3 — LAS PÁGINAS DEL CURSO (material real, enteras y sin texto mío encima) */}
            <Page src={LAM_REGLA} x={rx2} y={332} w={840} z={-44} rot={1.1} op={rop} />
            <Page src={LAM_TRES} x={lx} y={ly} w={lw} z={-40} rot={-0.6} />
            <ArrowGlow
              f={f} cx={aireX} cy={aireY} r={lw * 0.085} color="rgba(34,140,66,0.95)"
              k={ip(f, [140, 160, 200, 214, 560, 600], [0, 1, 1, 0.35, 0.35, 0])}
            />
            <ArrowGlow
              f={f} cx={afueX} cy={afueY} r={lw * 0.075} color="rgba(196,54,38,0.95)"
              k={ip(f, [1044, 1078, 1160, 1210], [0, 1, 1, 0.3])}
            />
            <ArrowGlow
              f={f} cx={sueloX} cy={sueloY} r={lw * 0.075} color="rgba(34,140,66,0.95)"
              k={ip(f, [1292, 1326, 1420, 1466], [0, 1, 1, 0.3])}
            />

            {/* L4 — LA TIRA (A2 + A3): siete materiales reales en un solo travelling */}
            {f >= 258 && f < 1052
              ? TIRA.map((p, i) => {
                  const d = i - hero;
                  if (Math.abs(d) > 1.9) return null;
                  const zz = -Math.abs(d) * 120;
                  const x = hx + d * pitch + d * 14;
                  const dim = Math.min(1, Math.max(0, 1 - Math.abs(d) * 0.55));
                  return (
                    <div
                      key={p.n}
                      style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", opacity: 0.35 + dim * 0.65 }}
                    >
                      <Glass x={x} y={hy} w={hw} h={hh} z={40 + zz} ry={-d * 9} rx={1.2} radius={16} lift={0.7 + dim * 0.6}>
                        <Mat name={p.n} clipFrom={p.from} />
                      </Glass>
                    </div>
                  );
                })
              : null}

            {/* F1 — el portal: la cámara entra en la flecha verde y sale en el vidrio empañado */}
            {f >= 186 && f < 264 ? (
              <div
                style={{
                  position: "absolute", left: p1cx - p1w / 2, top: p1cy - p1h / 2,
                  width: p1w, height: p1h, borderRadius: p1r, overflow: "hidden",
                  transform: "translateZ(60px)",
                  boxShadow: "0 26px 60px rgba(42,38,32,0.45), inset 0 0 0 3px rgba(255,248,230,0.35)",
                }}
              >
                <Mat name="clembudo_s207" clipFrom={208} />
              </div>
            ) : null}

            {/* A4 — LA CASCADA DE AFUERA: tres tarjetas repartidas como cartas, cada una con su clip */}
            {f >= 1140 && f < 1316
              ? [
                  { n: "clembudo_s214", from: 1144 },
                  { n: "clembudo_s215", from: 1171 },
                  { n: "clembudo_s216", from: 1209 },
                ].map((cd, j) => {
                  if (j === 2 && f >= 1301) return null; // a partir del giro manda la tarjeta de A5
                  const IN = interpolate(f, [cd.from - 4, cd.from + 22], [0, 1], {
                    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.poly(4)),
                  });
                  const back = 2 - j; // 0 = la de adelante
                  const OUT = j === 2 ? 0 : interpolate(f, [1284, 1312], [0, 1], {
                    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: E,
                  });
                  const ox = 880 + (1 - IN) * 560 - back * 30;
                  const oy = 250 + (1 - IN) * 66 - back * 26 - OUT * 420;
                  return (
                    <div
                      key={cd.n}
                      style={{
                        position: "absolute", inset: 0, transformStyle: "preserve-3d",
                        opacity: (0.5 + IN * 0.5) * (1 - OUT * 0.9),
                      }}
                    >
                      <Glass
                        x={ox} y={oy} w={980} h={551} z={40 - back * 78}
                        ry={(1 - IN) * 14 - back * 2.4} rx={1} radius={16} lift={1 - back * 0.2}
                      >
                        <Mat name={cd.n} clipFrom={cd.from} />
                      </Glass>
                    </div>
                  );
                })
              : null}

            {/* F4 — MATCH-SHAPE: el MISMO rectángulo gira y del otro lado está el arranque del muro */}
            {f >= 1284 && f < 1478
              ? (() => {
                  const spin = ip(f, [1288, 1301, 1316], [0, 90, 180]);
                  const front = spin < 90;
                  return (
                    <div
                      style={{
                        position: "absolute", left: 880, top: 250, width: 980, height: 551,
                        transformStyle: "preserve-3d",
                        transform: `translateZ(40px) rotateY(${spin}deg)`,
                      }}
                    >
                      <div
                        style={{
                          position: "absolute", inset: 0, backfaceVisibility: "hidden",
                          borderRadius: 16, overflow: "hidden",
                          boxShadow: "0 22px 52px rgba(42,38,32,0.34), inset 0 1px 0 rgba(255,248,230,0.5)",
                        }}
                      >
                        {front ? <Mat name="clembudo_s216" clipFrom={1209} /> : null}
                      </div>
                      <div
                        style={{
                          position: "absolute", inset: 0, backfaceVisibility: "hidden",
                          transform: "rotateY(180deg)", borderRadius: 16, overflow: "hidden",
                          boxShadow: "0 22px 52px rgba(42,38,32,0.34), inset 0 1px 0 rgba(255,248,230,0.5)",
                        }}
                      >
                        {front ? null : <Mat name="clembudo_s217" clipFrom={1320} />}
                      </div>
                    </div>
                  );
                })()
              : null}

            {/* A5 — la línea de agua TREPA por el zócalo: oscurece el material real, no es un dibujo */}
            {f >= 1330 && f < 1476 ? (
              <div
                style={{
                  position: "absolute", left: 880, top: 250, width: 980, height: 551,
                  transform: "translateZ(42px)", borderRadius: 16, overflow: "hidden", pointerEvents: "none",
                }}
              >
                <div
                  style={{
                    position: "absolute", left: 0, bottom: 0, width: "100%",
                    height: `${ip(f, [1330, 1466], [12, 46])}%`,
                    background:
                      "linear-gradient(180deg, rgba(58,44,28,0.00) 0%, rgba(58,44,28,0.30) 38%, rgba(46,34,20,0.52) 100%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute", left: 0, bottom: `${ip(f, [1330, 1466], [12, 46])}%`,
                    width: "100%", height: 3, background: "rgba(255,243,214,0.45)",
                  }}
                />
              </div>
            ) : null}

            {/* F5 + A6 — el terrón: se entra en la línea de agua y sale el café trepando por adentro */}
            {f >= 1448 ? (
              <div
                style={{
                  position: "absolute", left: a6cx - a6w / 2, top: a6cy - a6h / 2,
                  width: a6w, height: a6h, borderRadius: a6r, overflow: "hidden",
                  transform: "translateZ(70px)",
                  boxShadow: "0 26px 62px rgba(42,38,32,0.44), inset 0 0 0 3px rgba(255,248,230,0.30)",
                }}
              >
                <Mat name="clembudo_s218" clipFrom={1470} clipDur={105} />
              </div>
            ) : null}

            {/* LA BANDEJA DE MANCHAS — cada acto deja la suya; en 1549 suben las tres a comparar */}
            {CHIPS.map((ch) => {
              if (f < ch.born - 2) return null;
              const IN = interpolate(f, [ch.born, ch.born + 16], [0, 1], {
                extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.poly(4)),
              });
              const up = ip(f, [1546 + ch.slot * 6, 1575], [0, 1]);
              const cx0 = 80 + ch.slot * 170;
              const cy0 = 900 + (1 - IN) * 96;
              const x = cx0 + (80 + ch.slot * 610 - cx0) * up;
              const y = cy0 + (680 - cy0) * up;
              const w = 150 + (540 - 150) * up;
              return (
                <div
                  key={ch.n}
                  style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", opacity: 0.45 + IN * 0.55 }}
                >
                  <Glass
                    x={x} y={y} w={w} h={(w * 304) / 540} z={160 - up * 100}
                    ry={-3 + up * 3} rx={2 - up * 2} radius={10 + up * 6} lift={0.55 + up * 0.5}
                  >
                    <Mat name={ch.n} />
                  </Glass>
                </div>
              );
            })}

            {/* L5 — primer plano: el borde del banco y del delantal, en sombra (parallax fuerte) */}
            <div
              style={{
                position: "absolute", inset: "-14%",
                transform: `translateZ(240px) scale(${(PER - 240) / PER})`, pointerEvents: "none",
              }}
            >
              <div
                style={{
                  position: "absolute", left: "-6%", bottom: "-10%", width: "42%", height: "26%",
                  borderRadius: "44% 56% 0 0",
                  background: "linear-gradient(20deg, rgba(28,22,14,0.66) 0%, rgba(28,22,14,0.00) 76%)",
                }}
              />
              <div
                style={{
                  position: "absolute", right: "-8%", top: "-8%", width: "34%", height: "30%",
                  borderRadius: "0 0 60% 40%",
                  background: "linear-gradient(200deg, rgba(28,22,14,0.50) 0%, rgba(28,22,14,0.00) 72%)",
                }}
              />
            </div>

            {/* L8 — TIPOGRAFÍA: una idea por acto, siempre sobre la madera oscura, jamás sobre la lámina */}
            <div
              style={{
                position: "absolute", left: 90, top: 862, width: 700,
                opacity: txtOpacity(f, 26, 150) * rampIn(f, 14),
                transform: `translateY(${txtShift(f, 26)}px)`,
              }}
            >
              <Kick size={32}>Lo más importante del video</Kick>
            </div>
            <div
              style={{
                position: "absolute", left: 90, top: 792, width: 560,
                opacity: txtOpacity(f, 322, 500), transform: `translateY(${txtShift(f, 322)}px)`,
              }}
            >
              <Head size={66}>Condensación</Head>
            </div>
            <div
              style={{
                position: "absolute", left: 90, top: 770, width: 520,
                opacity: txtOpacity(f, 656, 842), transform: `translateY(${txtShift(f, 656)}px)`,
              }}
            >
              <Head size={58}>10 a 15 litros por día</Head>
            </div>
            <div
              style={{
                position: "absolute", left: 90, top: 792, width: 560,
                opacity: txtOpacity(f, 1142, 1298), transform: `translateY(${txtShift(f, 1142)}px)`,
              }}
            >
              <Head size={66}>Filtración</Head>
            </div>
            <div
              style={{
                position: "absolute", left: 90, top: 690, width: 560,
                opacity: txtOpacity(f, 1378, 1466), transform: `translateY(${txtShift(f, 1378)}px)`,
              }}
            >
              <Head size={64}>Capilaridad</Head>
            </div>
            <div
              style={{
                position: "absolute", left: 80, top: 470, width: 360,
                opacity: txtOpacity(f, 1546, 1584), transform: `translateY(${txtShift(f, 1546)}px)`,
              }}
            >
              <Head size={54}>Cada una se ve distinta</Head>
            </div>

            {/* L2b — la luz cálida del galpón, que evoluciona con luz() (0,15 → 0,30) */}
            <AbsoluteFill
              style={{
                pointerEvents: "none",
                background: `radial-gradient(78% 62% at 26% 12%, rgba(255,238,198,${key * 0.34}) 0%, rgba(255,238,198,0) 62%)`,
                mixBlendMode: "screen",
              }}
            />
          </AbsoluteFill>
        </div>
      </div>

      {/* F3 — OCLUSIÓN: cruza EL CUERO DEL DELANTAL. ⛔ jamás el color del fondo (sería un fundido) */}
      <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
        <Occluder at={1051} len={8} color={C.gold} angle={-9} />
      </AbsoluteFill>

      {/* L9 — UNA sola atmósfera para todo el movimiento. Se monta acá y NUNCA se remonta. */}
      <Atmos t={t} dust={30} />
    </AbsoluteFill>
  );
};

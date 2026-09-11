// MovDinero.tsx — EL MOVIMIENTO DE LOS NÚMEROS · `clembudo` (El Constructor Libre)
// 873 frames @30fps (29,1 s) · desde_s 457.2 · luz 0.25 → 0.50 (día frío de ventana → ámbar de billete)
//
// IDEA RECTORA: los números son los protagonistas y ATERRIZAN. El 160 cae y golpea la mesa; el −20 y
// el −12 entran volando y le ROMPEN un pedazo a la barra de dinero (que tiene billetes corriendo
// adentro), el pedazo se cae del cuadro girando, y lo que queda se vuelve a estampar como 128.
// La resta es una OPERACIÓN FÍSICA sobre materia real, no texto que cambia.
//
// ════════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF  (enterFrom → exitTo por acto; el acto N arranca EXACTO donde terminó el N−1)
// ════════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 1 · f0–145 · "Eso es el trabajo. Ahora hablemos del dinero."          [AVATAR VISIBLE]
//   enterFrom cam {z 1.03, panX +14, panY +8, ry +2.4}  luz 0.25  materia: — (entra el movimiento)
//   exitTo    cam {z 1.05, panX  −4, panY  +5, ry +1.6}  luz 0.27  materia: LA TARJETA DE CUERO
//             (380×230, abajo-derecha, con el clip de los billetes adentro)
//
//   ── FRONTERA 1 @f146 · MATCH-SHAPE ──────────────────────────────────────────────────────────
//   La MISMA tarjeta (un solo objeto, geometría continua) rota y crece hasta volverse el teléfono
//   vertical. Adentro, el material se cambia con un wipe descendente (f142–150), nunca un fade.
//   Es MATCH-SHAPE porque los dos actos tienen el mismo rectángulo protagonista.
//
// ACTO 2 · f146–409 · "Entra por WhatsApp… 4 preguntas y 2 fotos… sin salir de tu casa."
//   enterFrom cam {z 1.05, panX −4}  luz 0.27  materia: la tarjeta → el teléfono
//   exitTo    cam {z 1.10, panX −34, ry +0.8}  luz 0.35  materia: LA FOTO DE LA MANCHA en la pantalla
//
//   ── FRONTERA 2 @f410 · ZOOM-THROUGH ─────────────────────────────────────────────────────────
//   La cámara entra POR la foto de la pared que está en la pantalla del teléfono (el plano del
//   teléfono escala ×8 y se va por el lente) y sale en la pared REAL con el medidor. La materia
//   que cruza es literalmente la misma pared: foto dentro del chat → clip a cuadro completo.
//
// ACTO 3 · f410–504 · "La visita dura 40 minutos."
//   enterFrom cam {z 1.10, panX −34}  luz 0.35  materia: la pared manchada (ahora real)
//   exitTo    cam {z 1.16, panX −34, panY −6}  luz 0.39  materia: LA PARED / el medidor
//
//   ── FRONTERA 3 @f505 · OCLUSIÓN ─────────────────────────────────────────────────────────────
//   El DELANTAL DE CUERO de Claudio cruza el lente y tapa el 100% ~5,6 frames (centro exacto en
//   f505, el frame del swap). ⛔ La banda NO lleva el color del fondo: es cuero (C.gold, luma ~131)
//   entre dos planos de luma media parecida → ni pozo negro ni flash. Lleva costura y remaches.
//
// ACTO 4 · f505–758 · "Se cobró 160. Materiales 20, transporte 12. Quedaron 128 limpios."
//   enterFrom cam {z 1.16, panY −6}  luz 0.39  materia: el cuero deja la MESA DEL PRESUPUESTO
//   exitTo    cam {z 1.21, panX +4, panY +20, rx +0.8}  luz 0.47  materia: LA BARRA DE 128
//
//   ── FRONTERA 4 @f759 · MATCH-MOVE ───────────────────────────────────────────────────────────
//   Nada corta: la cámara ya venía subiendo y abriéndose. La barra de 128 sigue ese mismo vector
//   hacia abajo-izquierda y se achica a 0,55 (se vuelve el escalón de abajo) mientras la barra de
//   290 entra desde la derecha a la misma velocidad y sube al escalón de arriba. La mesa (el bed)
//   NO se remonta: es el mismo plano del acto 4, sólo más cálido.
//
// ACTO 5 · f759–872 · "El siguiente, con extractor incluido, 290."
//   enterFrom cam {z 1.21, panY +20}  luz 0.47  materia: la barra de 128 → escalón inferior
//   exitTo    cam {z 1.12, panX −48, panY +90, ry −1.8}  luz 0.50  materia: el escalón vacío de
//             arriba, cortado por el borde superior ("y hay más arriba") → se lo deja al MovCaso35
//
// ════════════════════════════════════════════════════════════════════════════════════════════════
// ASSETS (todos verificados en disco)
//   clips  broll/clembudo/ : s405 (contando billetes) · s402 (tecleando el pulgar) ·
//                            s403 (el medidor en la mancha) · s406 (atornillando el extractor)
//   fotos  img/clembudo/   : s401 (el teléfono con las fotos) · s403 · s435 (macro de la mancha) ·
//                            s421 (el grupo de vecinos) · s436 (la planilla del presupuesto) ·
//                            s416 (los billetes a la palma) · s425 (el balde y la brocha) ·
//                            s418 (la camioneta de reparto)
// ⛔ Los clips duran 5,04 s (151 f): ninguna Sequence de clip pasa de 150 frames. Cero `loop`.
// ════════════════════════════════════════════════════════════════════════════════════════════════
import React from "react";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { C, FONT, Atmos, Glass, Head, Kick, Occluder, cam, camStyle, luz, rampIn, rng, type Cam } from "./Stage";

const DUR = 873;

// ── fronteras / beats anclados al guion (Whisper, menos desde_s 457.2, ×30) ──────────────────
const A2 = 146; // 462.06 "Un trabajo normal entra por whatsapp…"
const B_PREG = 261; // 465.90 "4 preguntas y 2 fotos…"
const A3 = 410; // 470.88 "…casa." → zoom-through
const B_40 = 430; // 471.54 "La visita dura 40 minutos."
const A4 = 505; // 474.04 "Ese se cobró 160."
const B_COSTOS = 577; // 476.42 "Materiales 20, transporte 12."
const B_LIMPIOS = 656; // 479.06 "Quedaron 128 limpios en una tarde."
const A5 = 759; // 482.48 "El siguiente, con extractor incluido, 290."

const IMP160 = A4 + 7; // 512 · el 160 golpea la mesa
const IMP20 = 589; // la ficha de materiales le rompe 20
const IMP12 = 619; // la ficha de transporte le rompe 12
const IMP128 = B_LIMPIOS + 4; // 660 · se re-estampa el resultado
const IMP290 = 797; // el 290 aterriza en el escalón de arriba

// ── helpers de continuidad ───────────────────────────────────────────────────────────────────
// rampa acumulativa: arranca en 0 y satura. Sumadas, la cámara NUNCA se reinicia.
const sstep = (f: number, s: number, l: number) =>
  interpolate(f, [s, s + l], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.3, 0.72, 0.2, 1),
  });

const seg = (f: number, s: number, e: number, a: number, b: number, easing = Easing.out(Easing.cubic)) =>
  interpolate(f, [s, e], [a, b], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

// golpe de cámara: vale 0 en el frame del impacto y decae a 0 → continuo por construcción
const kick = (f: number, at: number, amp: number) => {
  const d = f - at;
  if (d < 0 || d > 22) return 0;
  return amp * Math.exp(-d / 4.5) * Math.sin(d * 1.35);
};

// parallax propio por plano (hold vivo: nada quieto más de 1,5 s)
const par = (f: number, seed: number, ax: number, ay: number) => ({
  x: Math.sin(f / (68 + seed * 13) + seed) * ax,
  y: Math.cos(f / (81 + seed * 11) + seed * 2) * ay,
});

// ── UNA SOLA CÁMARA, función del frame GLOBAL ────────────────────────────────────────────────
const camAll = (f: number): Cam => {
  const b = cam(
    f,
    DUR,
    { z: 1.03, panX: 14, panY: 8, ry: 2.4, rx: -0.5 },
    { z: 1.10, panX: -18, panY: -10, ry: -1.8, rx: 0.7 }
  );
  return {
    z:
      b.z +
      0.05 * sstep(f, A2, 64) +
      0.06 * sstep(f, A3, 52) +
      0.05 * sstep(f, A4, 80) -
      0.09 * sstep(f, A5, 70),
    panX:
      b.panX -
      30 * sstep(f, A2, 64) +
      38 * sstep(f, A4, 90) -
      52 * sstep(f, A5, 84) +
      kick(f, IMP160, 4) +
      kick(f, IMP20, 3) +
      kick(f, IMP12, 3),
    panY:
      b.panY -
      14 * sstep(f, A3, 52) +
      26 * sstep(f, A4, 80) +
      72 * sstep(f, A5, 84) +
      kick(f, IMP160, 7) +
      kick(f, IMP20, 4.5) +
      kick(f, IMP12, 4.5) +
      kick(f, IMP128, 8) +
      kick(f, IMP290, 6),
    ry: b.ry - 1.6 * sstep(f, A2, 70) + 2.2 * sstep(f, A4, 80) - 1.4 * sstep(f, A5, 74),
    rx: b.rx + 0.8 * sstep(f, A4, 80) - 1.1 * sstep(f, A5, 74),
  };
};

// ── material real ────────────────────────────────────────────────────────────────────────────
const IMGS = (n: string) => staticFile(`img/clembudo/${n}.png`);
const VIDS = (n: string) => staticFile(`broll/clembudo/${n}.mp4`);

const Foto: React.FC<{ n: string; style?: React.CSSProperties; pos?: string; scale?: number; dx?: number; dy?: number }> = ({
  n,
  style,
  pos = "center",
  scale = 1,
  dx = 0,
  dy = 0,
}) => (
  <Img
    src={IMGS(n)}
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: pos,
      transform: `translate(${dx}px, ${dy}px) scale(${scale})`,
      ...style,
    }}
  />
);

// ⛔ OffthreadVideo, NUNCA <Video>. Sin `loop` (no es prop): ninguna ventana pasa de 150 frames.
const Clip: React.FC<{ n: string; from: number; dur: number; style?: React.CSSProperties; pos?: string }> = ({
  n,
  from,
  dur,
  style,
  pos = "center",
}) => (
  <Sequence from={from} durationInFrames={Math.min(dur, 150)} layout="none">
    <OffthreadVideo
      src={VIDS(n)}
      muted
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: pos,
        ...style,
      }}
    />
  </Sequence>
);

// grade de producto sobre cualquier material (key arriba-izq + hundido abajo-der)
const Grade: React.FC<{ t: number; strength?: number }> = ({ t, strength = 1 }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: `radial-gradient(78% 62% at 26% 18%, rgba(255,238,203,${0.16 * strength + t * 0.1}) 0%, rgba(255,238,203,0) 58%),
        linear-gradient(160deg, rgba(42,38,32,${0.06 * strength}) 0%, rgba(42,38,32,${0.42 * strength}) 100%)`,
    }}
  />
);

// ── EL DELANTAL DE CUERO que cruza el lente en la frontera 3 ─────────────────────────────────
// El `Occluder` de Stage da el barrido; esta capa le pone la MATERIA (costura + remaches) y
// garantiza la cobertura del 100% justo donde ocurre el swap (≈5,6 frames centrados en `at`).
const Delantal: React.FC<{ at: number; len?: number }> = ({ at, len = 9 }) => {
  const f = useCurrentFrame();
  if (f < at - len || f > at + len) return null;
  const k = interpolate(f, [at - len, at + len], [-165, 165], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <div
      style={{
        position: "absolute",
        left: `${k}%`,
        top: "-34%",
        width: "205%",
        height: "170%",
        transform: "rotate(-7deg)",
        background: `linear-gradient(92deg, rgba(90,60,34,1) 0%, ${C.gold} 8%, #B9895A 38%, ${C.gold} 62%, #7E5836 96%, rgba(70,46,26,1) 100%)`,
        boxShadow: "inset 0 40px 90px rgba(42,26,12,0.45), inset 0 -40px 90px rgba(42,26,12,0.5)",
      }}
    >
      {/* costura del cuero */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "34%",
          height: 0,
          borderTop: "5px dashed rgba(248,236,208,0.42)",
        }}
      />
      {/* remaches */}
      {new Array(7).fill(0).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${8 + i * 13}%`,
            top: "62%",
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "linear-gradient(150deg,#E7D7B4,#8A6A42)",
            boxShadow: "0 3px 6px rgba(30,18,8,0.55)",
          }}
        />
      ))}
    </div>
  );
};

// ── NUMERAL QUE ATERRIZA (⛔ nunca un fade: cae, golpea, aplasta y rebota) ───────────────────
const BigNum: React.FC<{
  at: number;
  size: number;
  children: React.ReactNode;
  color?: string;
  drop?: number;
  until?: number;
}> = ({ at, size, children, color = "#F8F2E0", drop = 340, until }) => {
  const f = useCurrentFrame();
  if (f < at - 9) return null;
  if (until !== undefined && f > until) return null;
  const y = seg(f, at - 9, at, -drop, 0, Easing.in(Easing.quad));
  const sy = f < at ? 1.22 : seg(f, at, at + 11, 0.78, 1, Easing.out(Easing.back(2.6)));
  const sx = f < at ? 0.9 : seg(f, at, at + 11, 1.16, 1, Easing.out(Easing.back(2.6)));
  return (
    <div
      style={{
        transform: `translateY(${y}px) scale(${sx}, ${sy})`,
        transformOrigin: "50% 100%",
        fontFamily: FONT,
        fontSize: size,
        fontWeight: 800,
        color,
        lineHeight: 0.92,
        letterSpacing: -4,
        textShadow: "0 3px 0 rgba(42,38,32,0.6), 0 18px 44px rgba(24,18,10,0.7)",
      }}
    >
      {children}
    </div>
  );
};

// polvo de impacto (determinístico) — el golpe levanta la mesa
const Polvo: React.FC<{ at: number; x: number; y: number; n?: number; spread?: number }> = ({
  at,
  x,
  y,
  n = 16,
  spread = 210,
}) => {
  const f = useCurrentFrame();
  const d = f - at;
  if (d < 0 || d > 30) return null;
  const k = d / 30;
  return (
    <>
      {new Array(n).fill(0).map((_, i) => {
        const a = (rng(91, i) - 0.5) * 2;
        const up = 0.4 + rng(113, i) * 1.0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + a * spread * k,
              top: y - up * 90 * k + 120 * k * k,
              width: 3 + rng(137, i) * 5,
              height: 3 + rng(137, i) * 5,
              borderRadius: "50%",
              background: "#F3E6C6",
              opacity: (1 - k) * 0.5,
            }}
          />
        );
      })}
    </>
  );
};

// ── LA BARRA DE DINERO (geometría: 1 dólar = 6.2 px; se rompe por el borde derecho) ─────────
const PPU = 6.2;
const BAR_X = 300;
const BAR_Y = 452;
const BAR_H = 206;

const barVal = (f: number) =>
  f < IMP20 ? 160 : f < IMP20 + 7 ? seg(f, IMP20, IMP20 + 7, 160, 140) : f < IMP12 ? 140 : seg(f, IMP12, IMP12 + 7, 140, 128);

const barLabel = (f: number) => (f < IMP20 ? 160 : f < IMP12 ? 140 : 128);

// pedazo que se ROMPE y se cae del cuadro girando
const Pedazo: React.FC<{ at: number; left: number; w: number; nFoto: string }> = ({ at, left, w, nFoto }) => {
  const f = useCurrentFrame();
  const d = f - at;
  if (d < 0 || d > 56) return null;
  const k = d / 56;
  const x = left + 120 * k + 260 * k * k;
  const y = BAR_Y - 30 * k + 980 * k * k;
  const rot = 8 + 96 * k;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: BAR_H,
        transform: `rotate(${rot}deg)`,
        transformOrigin: "20% 40%",
        overflow: "hidden",
        borderRadius: 8,
        boxShadow: "0 16px 40px rgba(24,16,8,0.5), inset 0 1px 0 rgba(255,248,230,0.4)",
        background: C.bg2,
      }}
    >
      <Foto n={nFoto} scale={1.5} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(42,38,32,0.05), rgba(42,38,32,0.45))" }} />
      {/* borde roto */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 10, background: "linear-gradient(90deg, rgba(30,20,10,0.75), rgba(30,20,10,0))" }} />
    </div>
  );
};

// ficha que entra volando y ROMPE la barra (lleva material real adentro)
const Ficha: React.FC<{ start: number; impact: number; nFoto: string; num: string; tag: string; yOff: number }> = ({
  start,
  impact,
  nFoto,
  num,
  tag,
  yOff,
}) => {
  const f = useCurrentFrame();
  if (f < start || f > impact + 30) return null;
  const W = 322;
  const H = 206;
  const hitX = BAR_X + barVal(impact - 1) * PPU - 46;
  const x =
    f <= impact
      ? seg(f, start, impact, 2060, hitX, Easing.in(Easing.poly(3)))
      : seg(f, impact, impact + 30, hitX, 2100, Easing.out(Easing.poly(3)));
  const rot = f <= impact ? seg(f, start, impact, -13, -3) : seg(f, impact, impact + 30, -3, 21);
  const p = par(f, 4, 4, 3);
  return (
    <div style={{ position: "absolute", left: x + p.x, top: BAR_Y + yOff + p.y, transform: `rotate(${rot}deg) translateZ(70px)`, transformStyle: "preserve-3d" }}>
      <div style={{ position: "relative", width: W, height: H }}>
        <Glass x={0} y={0} w={W} h={H} z={0} ry={-6} radius={14} lift={1.25}>
          <Foto n={nFoto} scale={1.22} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(42,38,32,0.10) 0%, rgba(24,18,10,0.72) 100%)" }} />
          <div style={{ position: "absolute", left: 16, right: 16, bottom: 10 }}>
            <div style={{ fontFamily: FONT, fontSize: 24, fontWeight: 700, letterSpacing: 3, color: C.accentSoft, textTransform: "uppercase" }}>{tag}</div>
          </div>
        </Glass>
        <div
          style={{
            position: "absolute",
            left: -6,
            top: 18,
            fontFamily: FONT,
            fontSize: 112,
            fontWeight: 800,
            color: "#F8F2E0",
            letterSpacing: -3,
            textShadow: "0 3px 0 rgba(42,38,32,0.65), 0 16px 36px rgba(24,18,10,0.75)",
          }}
        >
          {num}
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════════════════
export const MovDinero: React.FC = () => {
  const f = useCurrentFrame();
  const t = luz(f, DUR, 0.25, 0.5);
  const c = camAll(f);
  const amb = rampIn(f, 12);

  // ── ACTO 1→2 · LA TARJETA QUE SE VUELVE TELÉFONO (un solo objeto, geometría continua) ──────
  const m = seg(f, A2, A2 + 30, 0, 1, Easing.inOut(Easing.poly(3))); // morph MATCH-SHAPE
  const zt = seg(f, A3 - 18, A3 + 8, 1, 8.2, Easing.in(Easing.poly(3))); // ZOOM-THROUGH
  const card = {
    x: 1420 + (250 - 1420) * m,
    y: 780 + (118 - 780) * m,
    w: 380 + (470 - 380) * m,
    h: 230 + (832 - 230) * m,
    ry: -14 + (10 - -14) * m,
    rx: 4 + (0 - 4) * m,
  };
  const pCard = par(f, 3, 7, 5);

  // ── barra ────────────────────────────────────────────────────────────────────────────────
  const val = barVal(f);
  const barW = val * PPU;
  const barDrop = seg(f, A4, IMP160, -430, 0, Easing.in(Easing.quad));
  const barSq = f < IMP160 ? 1 : seg(f, IMP160, IMP160 + 12, 1.13, 1, Easing.out(Easing.back(2.2)));
  const stepK = sstep(f, A5, 46); // frontera 4 · MATCH-MOVE: la barra se vuelve el escalón de abajo
  const barScale = (1 - 0.45 * stepK) * barSq;
  const barDX = -8 * stepK;
  const barDY = barDrop + 352 * stepK;
  const PPU2 = PPU * 0.55; // misma escala que la barra ya achicada → la comparación 128 vs 290 es real
  const bar290W = 290 * PPU2;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ ...camStyle(c) }}>
        {/* ═══ L0 · BEDS. Uno por acto, y el del acto 4 NO se remonta en el 5 ═══════════════ */}
        {/* A2 — el teléfono en la mano: entra deslizando desde abajo (⛔ nunca un fade) */}
        {f >= A2 - 8 && f < A3 + 4 && (
          <div
            style={{
              position: "absolute",
              left: -190,
              top: -110,
              width: 2300,
              height: 1300,
              transform: `translate3d(${par(f, 1, 12, 7).x}px, ${seg(f, A2 - 6, A2 + 12, 1180, 0, Easing.out(Easing.poly(4))) + par(f, 1, 12, 7).y}px, -460px)`,
              overflow: "hidden",
            }}
          >
            <Foto n="clembudo_s401" scale={1.06 + 0.05 * sstep(f, A2, 240)} />
            <Grade t={t} strength={1.15} />
          </div>
        )}
        {/* A3 — la pared REAL con el medidor: sale del zoom-through ya en movimiento */}
        {f >= A3 && f < A4 + 6 && (
          <div
            style={{
              position: "absolute",
              left: -190,
              top: -110,
              width: 2300,
              height: 1300,
              transform: `translate3d(${par(f, 2, 10, 6).x}px, ${par(f, 2, 10, 6).y}px, -450px) scale(${seg(f, A3, A3 + 32, 2.55, 1.02, Easing.out(Easing.poly(4))) + 0.05 * sstep(f, A3 + 30, 70)})`,
              overflow: "hidden",
            }}
          >
            <Clip n="clembudo_s403" from={A3} dur={106} />
            <Grade t={t} strength={0.95} />
          </div>
        )}
        {/* A4+A5 — LA MESA DEL PRESUPUESTO. Se monta bajo el cuero y sobrevive la frontera 4 */}
        {f >= A4 - 7 && (
          <div
            style={{
              position: "absolute",
              left: -190,
              top: -110,
              width: 2300,
              height: 1300,
              transform: `translate3d(${par(f, 5, 13, 8).x}px, ${par(f, 5, 13, 8).y}px, -470px) scale(${1.18 - 0.12 * sstep(f, A4, 300)})`,
              overflow: "hidden",
            }}
          >
            <Foto n="clembudo_s436" pos="52% 58%" />
            <Grade t={t} strength={1.3} />
            {/* la luz ámbar que sube con la plata */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(60% 46% at 34% 62%, rgba(232,176,96,${0.1 + t * 0.34}) 0%, rgba(232,176,96,0) 70%)`,
                mixBlendMode: "screen",
              }}
            />
          </div>
        )}

        {/* ═══ L2 · PLANOS MEDIOS del acto 2 (profundidad, no protagonismo) ════════════════ */}
        {f >= A2 + 14 && f < A3 + 4 && (
          <div
            style={{
              position: "absolute",
              left: -120,
              top: 560,
              width: 430,
              height: 300,
              transform: `translate3d(${seg(f, A2 + 14, A2 + 40, -210, 0) + par(f, 6, 9, 6).x}px, ${par(f, 6, 9, 6).y}px, -320px) rotateY(16deg) scale(${zt * 0.55 + 0.45})`,
              transformStyle: "preserve-3d",
            }}
          >
            <Glass x={0} y={0} w={430} h={300} z={0} ry={0} radius={12} lift={0.8}>
              <Foto n="clembudo_s421" scale={1.15} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(24,18,10,0.55), rgba(24,18,10,0.15))" }} />
            </Glass>
          </div>
        )}
        {/* el pulgar que teclea — arranca EXACTO en "4 preguntas" */}
        {f >= B_PREG && f < A3 && (
          <div
            style={{
              position: "absolute",
              left: 1250,
              top: 640,
              width: 560,
              height: 350,
              transform: `translate3d(${seg(f, B_PREG, B_PREG + 26, 300, 0, Easing.out(Easing.poly(4))) + par(f, 7, 8, 5).x}px, ${par(f, 7, 8, 5).y}px, -200px) rotateY(-12deg) scale(${1 + (zt - 1) * 0.7})`,
              transformStyle: "preserve-3d",
            }}
          >
            <Glass x={0} y={0} w={560} h={350} z={0} ry={0} radius={14} lift={1}>
              <Clip n="clembudo_s402" from={B_PREG} dur={149} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(200deg, rgba(24,18,10,0.10), rgba(24,18,10,0.58))" }} />
            </Glass>
          </div>
        )}

        {/* ═══ L3 · LA TARJETA → EL TELÉFONO (frontera 1: MATCH-SHAPE) ════════════════════ */}
        {f < A3 + 10 && (
          <div
            style={{
              position: "absolute",
              left: card.x + pCard.x,
              top: card.y + pCard.y,
              width: card.w,
              height: card.h,
              transform: `translateZ(${-30 + 10 * m}px) rotateY(${card.ry}deg) rotateX(${card.rx}deg) scale(${zt})`,
              transformOrigin: "46% 62%",
              transformStyle: "preserve-3d",
              opacity: amb,
            }}
          >
            <Glass x={0} y={0} w={card.w} h={card.h} z={0} radius={14 + 14 * m} lift={1.2}>
              {/* respaldo de cuero: lo que queda debajo mientras el material se cambia con un wipe */}
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(150deg, #6B4B2C, ${C.gold})` }} />
              {/* MATERIA A — los billetes (acto 1, frío y chico) */}
              {f < 150 && (
                <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 ${seg(f, 142, 150, 0, 100)}% 0)` }}>
                  <Clip n="clembudo_s405" from={0} dur={150} pos="50% 46%" />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(60,72,92,0.30), rgba(24,26,34,0.55))" }} />
                </div>
              )}
              {/* MATERIA B — la pantalla del chat, entra empujando desde arriba */}
              {f >= 138 && (
                <div style={{ position: "absolute", inset: 0, transform: `translateY(${seg(f, 142, 150, -100, 0)}%)`, background: "linear-gradient(180deg,#EFE7D3,#DCD0B2)" }}>
                  {/* barra del grupo de vecinos (capa gráfica de estructura) */}
                  <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 74 * m + 20, background: C.accent, display: "flex", alignItems: "center", paddingLeft: 18 }}>
                    <div style={{ width: 34 * m + 8, height: 34 * m + 8, borderRadius: "50%", background: "rgba(255,248,230,0.85)" }} />
                    <div style={{ marginLeft: 12, opacity: m }}>
                      <div style={{ fontFamily: FONT, fontSize: 21, fontWeight: 800, color: "#F7F1DF" }}>Vecinos · Barrio Sur</div>
                      <div style={{ fontFamily: FONT, fontSize: 15, color: "rgba(247,241,223,0.7)" }}>en línea</div>
                    </div>
                  </div>
                  {/* LAS 4 PREGUNTAS — se escriben una por una */}
                  {new Array(4).fill(0).map((_, i) => {
                    const at = B_PREG + i * 15;
                    const w = seg(f, at, at + 9, 0, [78, 64, 86, 58][i], Easing.out(Easing.poly(4)));
                    const dy = seg(f, at, at + 9, 16, 0, Easing.out(Easing.back(2)));
                    return (
                      <div
                        key={i}
                        style={{
                          position: "absolute",
                          left: i % 2 === 0 ? 22 : undefined,
                          right: i % 2 === 0 ? undefined : 22,
                          top: 118 + i * 52,
                          width: `${w}%`,
                          height: 38,
                          transform: `translateY(${dy}px)`,
                          borderRadius: 12,
                          background: i % 2 === 0 ? "rgba(255,252,244,0.96)" : "rgba(206,222,178,0.96)",
                          boxShadow: "0 3px 8px rgba(42,38,32,0.22)",
                          overflow: "hidden",
                        }}
                      >
                        <div style={{ position: "absolute", left: 12, top: 15, right: 14, height: 5, borderRadius: 3, background: "rgba(42,38,32,0.22)" }} />
                      </div>
                    );
                  })}
                  {/* LAS 2 FOTOS — material real; la de abajo es por donde entra la cámara */}
                  {f >= B_PREG + 58 && (
                    <div
                      style={{
                        position: "absolute",
                        right: 22,
                        top: 336,
                        width: 210,
                        height: 118,
                        transform: `translateY(${seg(f, B_PREG + 58, B_PREG + 70, 90, 0, Easing.out(Easing.back(2.2)))}px) rotate(2deg)`,
                        borderRadius: 8,
                        overflow: "hidden",
                        boxShadow: "0 6px 16px rgba(42,38,32,0.35)",
                      }}
                    >
                      <Foto n="clembudo_s435" />
                    </div>
                  )}
                  {f >= B_PREG + 76 && (
                    <div
                      style={{
                        position: "absolute",
                        left: 22,
                        top: 478,
                        width: 340,
                        height: 191,
                        transform: `translateY(${seg(f, B_PREG + 76, B_PREG + 88, 110, 0, Easing.out(Easing.back(2.2)))}px) rotate(-1.4deg) scale(${seg(f, A3 - 18, A3, 1, 1.35, Easing.in(Easing.poly(3)))})`,
                        transformOrigin: "50% 50%",
                        borderRadius: 8,
                        overflow: "hidden",
                        boxShadow: "0 8px 20px rgba(42,38,32,0.4)",
                      }}
                    >
                      <Foto n="clembudo_s403" />
                    </div>
                  )}
                </div>
              )}
            </Glass>
          </div>
        )}

        {/* ═══ L4 · LOS NÚMEROS DEL ACTO 2 (4 preguntas · 2 fotos) ════════════════════════ */}
        {f >= B_PREG - 9 && f < A3 - 4 && (
          <div style={{ position: "absolute", left: 900, top: 250, transform: `translate3d(${par(f, 8, 6, 4).x}px, ${par(f, 8, 6, 4).y}px, 118px)`, display: "flex", gap: 74, alignItems: "flex-end" }}>
            <div style={{ textAlign: "center" }}>
              <BigNum at={B_PREG + 4} size={196}>4</BigNum>
              <div style={{ marginTop: 8, fontFamily: FONT, fontSize: 30, fontWeight: 700, letterSpacing: 6, color: C.accentSoft, textTransform: "uppercase", textShadow: "0 2px 10px rgba(42,38,32,0.7)" }}>Preguntas</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <BigNum at={B_PREG + 62} size={196}>2</BigNum>
              <div style={{ marginTop: 8, fontFamily: FONT, fontSize: 30, fontWeight: 700, letterSpacing: 6, color: C.accentSoft, textTransform: "uppercase", textShadow: "0 2px 10px rgba(42,38,32,0.7)" }}>Fotos</div>
            </div>
          </div>
        )}
        {f >= B_PREG - 9 && f < A3 - 4 && <Polvo at={B_PREG + 4} x={980} y={452} n={14} spread={150} />}
        {f >= B_PREG - 9 && f < A3 - 4 && <Polvo at={B_PREG + 62} x={1268} y={452} n={14} spread={150} />}
        {f >= B_PREG + 100 && f < A3 - 4 && (
          <div style={{ position: "absolute", right: 78, bottom: 96, transform: `translate3d(${seg(f, B_PREG + 100, B_PREG + 118, 120, 0, Easing.out(Easing.poly(4)))}px, 0, 96px)`, textAlign: "right" }}>
            <Kick>Sin salir de tu casa</Kick>
          </div>
        )}

        {/* ═══ ACTO 3 · 40 MINUTOS ════════════════════════════════════════════════════════ */}
        {f >= B_40 - 9 && f < A4 - 2 && (
          <>
            <div style={{ position: "absolute", left: 92, bottom: 128, transform: `translate3d(${par(f, 9, 5, 4).x}px, ${par(f, 9, 5, 4).y}px, 112px)`, display: "flex", alignItems: "flex-end", gap: 20 }}>
              <BigNum at={B_40 + 4} size={238}>40</BigNum>
              <div style={{ paddingBottom: 26 }}>
                <div style={{ fontFamily: FONT, fontSize: 44, fontWeight: 800, color: "#F8F2E0", letterSpacing: 2, textShadow: "0 2px 0 rgba(42,38,32,0.6), 0 12px 30px rgba(24,18,10,0.7)" }}>minutos</div>
                <div style={{ marginTop: 6 }}>
                  <Kick size={26}>La visita</Kick>
                </div>
              </div>
            </div>
            <Polvo at={B_40 + 4} x={210} y={952} n={18} spread={230} />
            {/* arco de reloj — capa gráfica de estructura, barre los 40 del reloj */}
            <svg width={220} height={220} style={{ position: "absolute", right: 96, top: 118, transform: "translateZ(90px)", opacity: 0.85 }}>
              <circle cx={110} cy={110} r={88} fill="none" stroke="rgba(247,241,223,0.28)" strokeWidth={7} />
              <circle
                cx={110}
                cy={110}
                r={88}
                fill="none"
                stroke={C.accentSoft}
                strokeWidth={9}
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 88}
                strokeDashoffset={2 * Math.PI * 88 * (1 - 0.667 * sstep(f, B_40, 54))}
                transform="rotate(-90 110 110)"
              />
            </svg>
          </>
        )}

        {/* ═══ ACTO 4 · LA RESTA FÍSICA ═══════════════════════════════════════════════════ */}
        {f >= A4 && (
          <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
            {/* sombra de contacto de la barra: aterriza de verdad */}
            <div
              style={{
                position: "absolute",
                left: BAR_X + 26 + barDX,
                top: BAR_Y + BAR_H * barScale + 6 + barDY,
                width: (barW - 40) * barScale,
                height: 40,
                borderRadius: "50%",
                background: "rgba(24,16,8,0.55)",
                opacity: seg(f, A4, IMP160, 0, 0.9) * (1 - 0.4 * stepK),
                transform: `translateZ(-40px) scaleX(${f < IMP160 ? 0.75 : seg(f, IMP160, IMP160 + 12, 1.15, 1)})`,
              }}
            />
            {/* LA BARRA: billetes REALES corriendo adentro; el numeral va sobre su parte fija */}
            <div
              style={{
                position: "absolute",
                left: BAR_X + barDX,
                top: BAR_Y + barDY,
                width: barW,
                height: BAR_H,
                transform: `translateZ(10px) scale(${barScale}, ${barScale * (f < IMP160 ? 1 : seg(f, IMP160, IMP160 + 12, 0.86, 1, Easing.out(Easing.back(2.2))))})`,
                transformOrigin: "0% 100%",
                transformStyle: "preserve-3d",
              }}
            >
              <Glass x={0} y={0} w={barW} h={BAR_H} z={0} radius={10} lift={1.4}>
                {/* ⛔ los clips duran 151 f: la barra encadena DOS ventanas y cambia de material
                    justo en un golpe (f619) y dentro del MATCH-MOVE (f769), nunca en un hueco */}
                {f < IMP12 && <Clip n="clembudo_s416" from={A4} dur={114} pos="50% 42%" />}
                {f >= IMP12 && f < A5 + 10 && <Clip n="clembudo_s405" from={IMP12} dur={150} pos="50% 46%" />}
                {f >= A5 + 10 && <Foto n="clembudo_s416" pos="50% 42%" scale={1.12} />}
                {/* cama oscura sobre el tercio izquierdo para que el numeral lea */}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(20,14,6,0.82) 0%, rgba(20,14,6,0.45) 38%, rgba(20,14,6,0.06) 62%)" }} />
                {/* borde roto a la derecha (queda vivo desde el primer golpe) */}
                {f >= IMP20 && <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 14, background: "linear-gradient(270deg, rgba(28,18,8,0.8), rgba(28,18,8,0))" }} />}
              </Glass>
              {/* EL NUMERAL: se re-estampa en cada golpe */}
              <div
                style={{
                  position: "absolute",
                  left: 26,
                  top: 14,
                  fontFamily: FONT,
                  fontSize: 168,
                  fontWeight: 800,
                  letterSpacing: -6,
                  lineHeight: 1,
                  color: "#F8F2E0",
                  textShadow: "0 3px 0 rgba(42,38,32,0.7), 0 18px 40px rgba(20,12,4,0.8)",
                  transform: `scale(${
                    f < IMP160
                      ? 1
                      : f < IMP20
                      ? seg(f, IMP160, IMP160 + 10, 1.3, 1, Easing.out(Easing.poly(5)))
                      : f < IMP12
                      ? seg(f, IMP20, IMP20 + 9, 1.22, 1, Easing.out(Easing.poly(5)))
                      : f < IMP128
                      ? seg(f, IMP12, IMP12 + 9, 1.22, 1, Easing.out(Easing.poly(5)))
                      : seg(f, IMP128, IMP128 + 12, 1.52, 1, Easing.out(Easing.poly(5)))
                  })`,
                  transformOrigin: "0% 60%",
                }}
              >
                {barLabel(f)}
              </div>
            </div>

            {/* los pedazos que se rompen y se van del cuadro */}
            <Pedazo at={IMP20} left={BAR_X + 140 * PPU} w={20 * PPU} nFoto="clembudo_s425" />
            <Pedazo at={IMP12} left={BAR_X + 128 * PPU} w={12 * PPU} nFoto="clembudo_s418" />

            {/* las fichas que golpean */}
            <Ficha start={B_COSTOS} impact={IMP20} nFoto="clembudo_s425" num="−20" tag="Materiales" yOff={-18} />
            <Ficha start={B_COSTOS + 28} impact={IMP12} nFoto="clembudo_s418" num="−12" tag="Transporte" yOff={34} />

            <Polvo at={IMP160} x={BAR_X + 300} y={BAR_Y + BAR_H} n={22} spread={330} />
            <Polvo at={IMP20} x={BAR_X + 140 * PPU} y={BAR_Y + BAR_H - 20} n={16} spread={190} />
            <Polvo at={IMP12} x={BAR_X + 128 * PPU} y={BAR_Y + BAR_H - 20} n={16} spread={190} />
            <Polvo at={IMP128} x={BAR_X + 200} y={BAR_Y + BAR_H} n={24} spread={300} />

            {/* la idea del acto, UNA sola, cuando el 128 ya está estampado */}
            {f >= IMP128 + 6 && f < A5 + 26 && (
              <div
                style={{
                  position: "absolute",
                  left: BAR_X + 26,
                  top: BAR_Y + BAR_H + 46,
                  transform: `translate3d(${seg(f, IMP128 + 6, IMP128 + 22, -70, 0, Easing.out(Easing.poly(4)))}px, ${352 * stepK}px, 96px)`,
                  opacity: 1 - stepK,
                }}
              >
                <Head size={58}>Limpios, en una tarde</Head>
              </div>
            )}
            {f >= A4 + 8 && f < IMP128 && (
              <div style={{ position: "absolute", left: BAR_X + 30, top: BAR_Y - 62, transform: "translateZ(90px)" }}>
                <Kick size={28}>Ese trabajo se cobró</Kick>
              </div>
            )}
          </div>
        )}

        {/* ═══ ACTO 5 · EL ESCALÓN (frontera 4: MATCH-MOVE, la cámara nunca se detiene) ════ */}
        {f >= A5 && (
          <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
            {/* repisa del escalón de abajo (el 128) */}
            <div
              style={{
                position: "absolute",
                left: BAR_X - 30,
                top: BAR_Y + 352 + BAR_H * 0.55 + 14,
                width: 128 * PPU2 + 96,
                height: 16,
                background: `linear-gradient(180deg, ${C.gold}, #6B4B2C)`,
                opacity: sstep(f, A5 + 10, 30),
                transform: "translateZ(-20px)",
                boxShadow: "0 10px 24px rgba(24,16,8,0.5)",
              }}
            />
            {/* LA BARRA DE 290 — sube al escalón de arriba con el extractor corriendo adentro */}
            <div
              style={{
                position: "absolute",
                left: seg(f, A5 + 3, IMP290, 980, 396, Easing.out(Easing.poly(4))),
                top: seg(f, A5 + 3, IMP290, 1010, 470, Easing.out(Easing.poly(4))),
                width: bar290W,
                height: 150,
                transform: `translateZ(40px) scale(${f < IMP290 ? 1 : seg(f, IMP290, IMP290 + 12, 1.07, 1, Easing.out(Easing.back(2)))}, ${f < IMP290 ? 1 : seg(f, IMP290, IMP290 + 12, 0.9, 1, Easing.out(Easing.back(2)))})`,
                transformOrigin: "0% 100%",
                transformStyle: "preserve-3d",
              }}
            >
              <Glass x={0} y={0} w={bar290W} h={150} z={0} radius={10} lift={1.5}>
                <Clip n="clembudo_s406" from={A5 + 3} dur={114} pos="50% 40%" />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(20,14,6,0.84) 0%, rgba(20,14,6,0.42) 40%, rgba(20,14,6,0.05) 64%)" }} />
              </Glass>
              <div
                style={{
                  position: "absolute",
                  left: 22,
                  top: 8,
                  fontFamily: FONT,
                  fontSize: 126,
                  fontWeight: 800,
                  letterSpacing: -5,
                  lineHeight: 1,
                  color: "#F8F2E0",
                  textShadow: "0 3px 0 rgba(42,38,32,0.7), 0 16px 36px rgba(20,12,4,0.8)",
                  transform: `scale(${f < IMP290 ? 1 : seg(f, IMP290, IMP290 + 12, 1.42, 1, Easing.out(Easing.poly(5)))})`,
                  transformOrigin: "0% 60%",
                }}
              >
                290
              </div>
            </div>
            {/* repisa del escalón de arriba */}
            <div
              style={{
                position: "absolute",
                left: 366,
                top: 620,
                width: bar290W + 96,
                height: 18,
                background: `linear-gradient(180deg, ${C.gold}, #6B4B2C)`,
                opacity: sstep(f, IMP290 - 12, 22),
                transform: "translateZ(20px)",
                boxShadow: "0 12px 28px rgba(24,16,8,0.55)",
              }}
            />
            <Polvo at={IMP290} x={640} y={622} n={22} spread={340} />
            {/* EL ESCALÓN VACÍO DE ARRIBA — cortado por el borde: "y hay más arriba" */}
            <div
              style={{
                position: "absolute",
                left: 470,
                top: 214,
                width: bar290W + 210,
                height: 16,
                border: `3px dashed rgba(247,241,223,${0.18 + 0.22 * sstep(f, IMP290, 40)})`,
                borderRadius: 4,
                transform: "translateZ(10px)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 470,
                top: 254,
                width: 0,
                height: 0,
                borderLeft: "20px solid transparent",
                borderRight: "20px solid transparent",
                borderBottom: `28px solid rgba(247,241,223,${0.22 + 0.3 * sstep(f, IMP290, 40)})`,
                transform: `translate3d(0, ${Math.sin(f / 14) * 7}px, 20px)`,
              }}
            />
            {f >= A5 + 16 && (
              <div style={{ position: "absolute", left: 396, top: 348, transform: `translate3d(${seg(f, A5 + 16, A5 + 34, 90, 0, Easing.out(Easing.poly(4)))}px, 0, 96px)` }}>
                <Kick size={30}>Con extractor incluido</Kick>
                <div style={{ marginTop: 10 }}>
                  <Head size={62}>El siguiente</Head>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ L5 · PRIMER PLANO: el borde del delantal contra el lente (sólo con el bed puesto) */}
        {f >= A2 + 4 && (
          <div
            style={{
              position: "absolute",
              left: -120,
              right: -120,
              bottom: -40,
              height: 150,
              transform: `translate3d(${par(f, 10, 16, 4).x}px, ${par(f, 10, 16, 4).y}px, 210px)`,
              background: `linear-gradient(0deg, rgba(38,24,12,0.92) 0%, rgba(60,40,20,0.55) 55%, rgba(60,40,20,0) 100%)`,
              opacity: 0.9,
            }}
          />
        )}

        {/* ═══ ACTO 1 · el avatar se ve; sólo kicker y regla en el tercio inferior izquierdo ══ */}
        {f < A2 + 22 && (
          <div
            style={{
              position: "absolute",
              left: 84,
              bottom: 104,
              transform: `translate3d(${seg(f, 4, 20, -90, 0, Easing.out(Easing.poly(4)))}px, ${120 * sstep(f, A2 + 2, 20)}px, 84px)`,
              opacity: amb * (1 - sstep(f, A2 + 4, 18)),
            }}
          >
            <Kick size={28}>A lo que viniste</Kick>
            <div style={{ marginTop: 10 }}>
              <Head size={72}>Ahora, el dinero</Head>
            </div>
            <div style={{ marginTop: 16, width: seg(f, 14, 46, 0, 420, Easing.out(Easing.poly(4))), height: 4, background: C.gold, boxShadow: "0 2px 8px rgba(24,16,8,0.6)" }} />
          </div>
        )}

        {/* ═══ FRONTERA 3 · OCLUSIÓN con el cuero (⛔ jamás el color del fondo) ═════════════ */}
        <Delantal at={A4} len={9} />
        <Occluder at={A4} len={11} color={C.gold} angle={-7} />
      </AbsoluteFill>

      {/* UNA sola atmósfera, montada UNA vez, nunca remontada entre actos */}
      <AbsoluteFill style={{ opacity: amb }}>
        <Atmos t={t} dust={24} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

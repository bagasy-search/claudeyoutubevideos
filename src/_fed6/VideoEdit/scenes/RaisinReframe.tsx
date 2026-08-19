import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ── RaisinReframe — la REFRAME insignia del video (Dr. Federer) ──────────────
// "La piel crepé NO es arrugas ni sequedad. Pensá en una UVA: llena de agua,
//  tersa. La dejás afuera y se vuelve PASA: no le crecieron arrugas, perdió el
//  agua y el cojín de adentro, y la piel se plegó. Eso es la piel crepé. Se
//  arregla volviendo a inundar el agua y el cojín."
//
// Escena cinematográfica 100% SVG + CSS (sin librerías, sin assets):
//   FASE 1  uva verde, tersa, brillante (piel joven)
//   FASE 2  se deshidrata → encoge, se apaga a marrón/púrpura y se PLIEGA en
//           pliegues finos (pasa / piel crepé)
//   FASE 3  ola teal de luz+agua desde la izquierda → se RE-hincha en uva tersa
//           que brilla suave (FLOOD + SEAL).
// Profundidad real: objeto, cartas, motas y viñeta en capas z de parallax
// distintas, con un drift de cámara lento. Todo respira siempre.
// 1920x1080 @ 30fps. Timing derivado de durationInFrames (prop).

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const FONT_SANS = "'Archivo', 'Inter', 'Helvetica Neue', Arial, sans-serif";
const FONT_SERIF = "Georgia, 'Times New Roman', serif";

// Paleta firma
const BG_CENTER = "#0E1D23";
const BG_EDGE = "#0A171C";
const TEAL = "#12B3AE";
const TEAL_GLOW = "#3FE0D6";
const GOLD = "#E8B96B";
const CREAM = "#F3ECDD";
const INK = "#10242A";
const RED = "#E0574B";

// Geometría de la uva (coords del viewBox 1920x1080)
const CX = 960;
const CY = 462;
const RX = 182;
const RY = 224;

/* ------------------------------- utilidades ----------------------------- */

const rgba = (hex: string, a: number): string => {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = Number.parseInt(full, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

// PRNG determinista (nunca Math.random, rompe el render)
const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpRGB = (a: number[], b: number[], t: number): string =>
  `rgb(${Math.round(lerp(a[0], b[0], t))}, ${Math.round(
    lerp(a[1], b[1], t)
  )}, ${Math.round(lerp(a[2], b[2], t))})`;

/* --------------------------------- motas -------------------------------- */

type Mote = {
  x: number;
  y0: number;
  size: number;
  speed: number;
  phase: number;
  opacity: number;
};

const makeMotes = (
  count: number,
  seed: number,
  sizeMin: number,
  sizeMax: number,
  spMin: number,
  spMax: number,
  oMin: number,
  oMax: number
): Mote[] => {
  const rng = mulberry32(seed);
  const out: Mote[] = [];
  for (let i = 0; i < count; i++) {
    out.push({
      x: rng() * 100,
      y0: rng(),
      size: sizeMin + rng() * (sizeMax - sizeMin),
      speed: spMin + rng() * (spMax - spMin),
      phase: rng() * Math.PI * 2,
      opacity: oMin + rng() * (oMax - oMin),
    });
  }
  return out;
};

const mod = (n: number, m: number) => ((n % m) + m) % m;

const MotesLayer: React.FC<{
  motes: Mote[];
  blur: number;
  tint: string;
}> = ({ motes, blur, tint }) => {
  const frame = useCurrentFrame();
  const RANGE = 120;
  return (
    <AbsoluteFill style={{ filter: `blur(${blur}px)`, pointerEvents: "none" }}>
      {motes.map((m, i) => {
        const y = mod(m.y0 * RANGE - frame * m.speed, RANGE) - 10;
        const x = m.x + Math.sin(frame * 0.02 + m.phase) * 1.6;
        const tw = 0.55 + 0.45 * Math.sin(frame * 0.045 + m.phase * 2);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: m.size,
              height: m.size,
              borderRadius: "50%",
              background: `rgba(${tint}, ${m.opacity * tw})`,
              boxShadow: `0 0 ${m.size * 2.2}px ${m.size * 0.55}px rgba(${tint}, ${
                m.opacity * 0.5 * tw
              })`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ------------------------------- parallax ------------------------------- */

const Layer: React.FC<{
  factor: number;
  z: number;
  px: number;
  py: number;
  children: React.ReactNode;
}> = ({ factor, z, px, py, children }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      zIndex: z,
      transform: `translate(${(px * factor).toFixed(2)}px, ${(py * factor).toFixed(
        2
      )}px)`,
      willChange: "transform",
    }}
  >
    {children}
  </div>
);

const GrainOverlay: React.FC = () => (
  <svg
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      opacity: 0.05,
      mixBlendMode: "overlay",
      zIndex: 40,
      pointerEvents: "none",
    }}
  >
    <filter id="rrGrain">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.85"
        numOctaves="2"
        stitchTiles="stitch"
      />
    </filter>
    <rect width="100%" height="100%" filter="url(#rrGrain)" />
  </svg>
);

/* ------------------------------ la fruta -------------------------------- */

type Crinkle = { d: string; stagger: number };

// Silueta de la uva/pasa: elipse suave que se pliega en lóbulos según `dry`.
const buildBlob = (
  dry: number,
  frame: number,
  ph1: number,
  ph2: number,
  ph3: number
): string => {
  const N = 72;
  // respiración diminuta (nunca queda quieto)
  const bre0 = Math.sin(frame * 0.05) * 0.004;
  let d = "";
  for (let k = 0; k <= N; k++) {
    const theta = (k / N) * Math.PI * 2 - Math.PI / 2;
    const wob =
      Math.sin(theta * 7 + ph1) * (dry * 0.052) +
      Math.sin(theta * 12 + ph2) * (dry * 0.03) +
      Math.sin(theta * 4 + ph3) * (dry * 0.02) +
      bre0 * Math.sin(theta * 3);
    const r = 1 + wob;
    const x = CX + RX * r * Math.cos(theta);
    const y = CY + RY * r * Math.sin(theta);
    d += (k === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1);
  }
  return d + "Z";
};

const makeCrinkles = (seed: number, count: number): Crinkle[] => {
  const rng = mulberry32(seed);
  const out: Crinkle[] = [];
  for (let i = 0; i < count; i++) {
    const fx = CX + ((i + 0.5) / count - 0.5) * 2 * RX * 0.82;
    const ratio = (fx - CX) / RX;
    const half = RY * Math.sqrt(Math.max(0, 1 - ratio * ratio)) * 0.82;
    const top = CY - half + 10;
    const bot = CY + half - 10;
    const amp = 5 + rng() * 9;
    const ph = rng() * Math.PI * 2;
    const freq = 1.6 + rng() * 1.4;
    const segs = 10;
    let d = "";
    for (let s = 0; s <= segs; s++) {
      const u = s / segs;
      const y = lerp(top, bot, u);
      const taper = Math.sin(u * Math.PI); // los pliegues se pinzan en las puntas
      const x = fx + Math.sin(u * freq * Math.PI + ph) * amp * taper;
      d += (s === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1);
    }
    out.push({ d, stagger: (i / count) * 0.34 });
  }
  return out;
};

const GRAPE_GREEN = [
  [156, 204, 92],
  [104, 176, 66],
  [46, 92, 36],
];
const RAISIN_BROWN = [
  [122, 82, 66],
  [86, 52, 46],
  [50, 28, 34],
];

const Grape: React.FC<{ dry: number }> = ({ dry }) => {
  const frame = useCurrentFrame();

  const ph = React.useMemo(() => {
    const rng = mulberry32(9137);
    return [
      rng() * Math.PI * 2,
      rng() * Math.PI * 2,
      rng() * Math.PI * 2,
    ] as const;
  }, []);
  const crinkles = React.useMemo(() => makeCrinkles(4471, 13), []);

  const bodyD = buildBlob(dry, frame, ph[0], ph[1], ph[2]);

  // encoge y se apelmaza al deshidratarse
  const gs = 1 - dry * 0.36;
  const gsy = 1 - dry * 0.4;
  const groupT = `translate(${CX} ${CY}) scale(${gs.toFixed(4)} ${gsy.toFixed(
    4
  )}) translate(${-CX} ${-CY})`;

  // color de los stops (verde → marrón)
  const c1 = lerpRGB(GRAPE_GREEN[0], RAISIN_BROWN[0], dry);
  const c2 = lerpRGB(GRAPE_GREEN[1], RAISIN_BROWN[1], dry);
  const c3 = lerpRGB(GRAPE_GREEN[2], RAISIN_BROWN[2], dry);

  const sheenOp = 0.55 * (1 - dry * 0.72);
  const dropOp = 1 - Math.min(1, dry * 1.4); // gotas se van al secarse
  const rimOp = 0.42 * (1 - dry * 0.55);
  const innerShadowOp = 0.28 + dry * 0.34;

  // brillo teal del contorno + apenas más apagado en pasa
  const glowPx = 34 + Math.sin(frame * 0.06) * 6;
  const grapeGlow = interpolate(dry, [0, 1], [0.6, 0.22], CLAMP);

  return (
    <svg
      viewBox="0 0 1920 1080"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "visible",
        filter: `drop-shadow(0 26px 44px rgba(2,10,12,0.6)) drop-shadow(0 0 ${glowPx.toFixed(
          1
        )}px ${rgba(TEAL_GLOW, grapeGlow)})`,
      }}
    >
      <defs>
        <radialGradient id="rrBody" cx="38%" cy="32%" r="78%">
          <stop offset="0%" stopColor={c1} />
          <stop offset="52%" stopColor={c2} />
          <stop offset="100%" stopColor={c3} />
        </radialGradient>
        <radialGradient id="rrInnerShadow" cx="50%" cy="46%" r="62%">
          <stop offset="55%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor={`rgba(12,6,10,${innerShadowOp})`} />
        </radialGradient>
        <clipPath id="rrClip">
          <path d={bodyD} />
        </clipPath>
      </defs>

      <g transform={groupT}>
        {/* cuerpo */}
        <path d={bodyD} fill="url(#rrBody)" />
        {/* sombra de volumen interna */}
        <path d={bodyD} fill="url(#rrInnerShadow)" />

        {/* pliegues (piel crepé) — se dibujan al secarse, se retiran al hincharse */}
        <g clipPath="url(#rrClip)">
          {crinkles.map((c, i) => {
            const prog = interpolate(
              dry,
              [c.stagger, c.stagger + 0.55],
              [0, 1],
              CLAMP
            );
            if (prog <= 0.001) return null;
            return (
              <g key={i} opacity={prog}>
                {/* realce (lado iluminado del pliegue) */}
                <path
                  d={c.d}
                  transform="translate(2 -2)"
                  fill="none"
                  stroke="rgba(255,240,214,0.16)"
                  strokeWidth={3}
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - prog}
                />
                {/* surco */}
                <path
                  d={c.d}
                  fill="none"
                  stroke="rgba(28,14,20,0.62)"
                  strokeWidth={3.4}
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - prog}
                />
              </g>
            );
          })}
        </g>

        {/* rim-light teal (arriba-izquierda) */}
        <ellipse
          cx={CX - 6}
          cy={CY - 6}
          rx={RX}
          ry={RY}
          fill="none"
          stroke={TEAL_GLOW}
          strokeWidth={5}
          opacity={rimOp}
          style={{ filter: "blur(2px)" }}
        />

        {/* sheen especular */}
        <ellipse
          cx={CX - 58}
          cy={CY - 92}
          rx={44}
          ry={70}
          fill="rgba(255,255,255,0.85)"
          opacity={sheenOp}
          transform={`rotate(-24 ${CX - 58} ${CY - 92})`}
          style={{ filter: "blur(6px)" }}
        />
        <ellipse
          cx={CX - 74}
          cy={CY - 70}
          rx={16}
          ry={24}
          fill="#ffffff"
          opacity={sheenOp * 1.1}
          transform={`rotate(-24 ${CX - 74} ${CY - 70})`}
          style={{ filter: "blur(1.5px)" }}
        />

        {/* gotas de agua (piel joven) */}
        {dropOp > 0.01 && (
          <g opacity={dropOp}>
            {[
              [CX + 66, CY + 30, 15],
              [CX + 24, CY + 116, 11],
            ].map((g, i) => (
              <g key={i}>
                <ellipse
                  cx={g[0]}
                  cy={g[1]}
                  rx={g[2]}
                  ry={g[2] * 1.25}
                  fill="rgba(210,255,250,0.30)"
                  stroke="rgba(63,224,214,0.55)"
                  strokeWidth={1.4}
                />
                <circle
                  cx={g[0] - g[2] * 0.32}
                  cy={g[1] - g[2] * 0.45}
                  r={g[2] * 0.32}
                  fill="rgba(255,255,255,0.9)"
                />
              </g>
            ))}
          </g>
        )}

        {/* tallo + hoja */}
        <path
          d={`M ${CX + 14} ${CY - RY + 8} C ${CX + 26} ${CY - RY - 34}, ${
            CX + 54
          } ${CY - RY - 44}, ${CX + 70} ${CY - RY - 66}`}
          fill="none"
          stroke="#6E4A29"
          strokeWidth={11}
          strokeLinecap="round"
        />
        <path
          d={`M ${CX + 70} ${CY - RY - 66} C ${CX + 108} ${CY - RY - 92}, ${
            CX + 150
          } ${CY - RY - 70}, ${CX + 150} ${CY - RY - 40} C ${CX + 120} ${
            CY - RY - 34
          }, ${CX + 84} ${CY - RY - 48}, ${CX + 70} ${CY - RY - 66} Z`}
          fill="#4F8F3A"
          stroke="#3C6E2C"
          strokeWidth={2}
        />
        <path
          d={`M ${CX + 78} ${CY - RY - 62} L ${CX + 140} ${CY - RY - 48}`}
          stroke="#376228"
          strokeWidth={2}
          fill="none"
        />
      </g>
    </svg>
  );
};

/* ----------------------------- carta caption ---------------------------- */

const cardState = (
  frame: number,
  fps: number,
  inF: number,
  outF: number | null
) => {
  const enter = spring({
    frame: frame - inF,
    fps,
    config: { damping: 22, stiffness: 90, mass: 0.9 },
  });
  const exit =
    outF === null
      ? 0
      : interpolate(
          frame,
          [outF - Math.round(0.4 * fps), outF],
          [0, 1],
          CLAMP
        );
  const op = interpolate(enter, [0, 1], [0, 1], CLAMP) * (1 - exit);
  const ty =
    interpolate(enter, [0, 1], [34, 0], CLAMP) + exit * 26;
  const blur =
    Math.max(0, interpolate(enter, [0, 1], [10, 0], CLAMP)) + exit * 9;
  // flotecito perpetuo
  const floatY = Math.sin(frame * 0.05) * 4;
  return { op, ty: ty + floatY, blur };
};

const CaptionCard: React.FC<{
  inF: number;
  outF: number | null;
  accent: string;
  main: React.ReactNode;
  y: number;
}> = ({ inF, outF, accent, main, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const st = cardState(frame, fps, inF, outF);
  if (st.op <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: y,
        transform: `translateX(-50%) translateY(${st.ty.toFixed(2)}px)`,
        opacity: st.op,
        filter: `blur(${st.blur.toFixed(2)}px)`,
        willChange: "transform, opacity, filter",
      }}
    >
      <div
        style={{
          position: "relative",
          background: CREAM,
          borderRadius: 18,
          padding: "26px 44px 28px 44px",
          boxShadow: `0 26px 70px rgba(0,0,0,0.5), 0 0 0 1px ${rgba(
            accent,
            0.35
          )}`,
          overflow: "hidden",
          maxWidth: 1180,
        }}
      >
        {/* filo de color arriba */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${accent}, ${rgba(
              accent,
              0.15
            )})`,
          }}
        />
        {/* regla dorada fina */}
        <div
          style={{
            width: 58,
            height: 3,
            borderRadius: 2,
            background: GOLD,
            marginBottom: 14,
            boxShadow: `0 0 12px ${rgba(GOLD, 0.6)}`,
          }}
        />
        {main}
      </div>
    </div>
  );
};

/* ------------------------------ componente ------------------------------ */

export const RaisinReframe: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = Math.max(1, durationInFrames);
  const t = frame / D;

  // escalar de deshidratación: 0 (uva) → 1 (pasa) → 0 (re-hinchada)
  const dry = interpolate(
    t,
    [0, 0.28, 0.6, 0.66, 0.92, 1],
    [0, 0, 1, 1, 0, 0],
    CLAMP
  );

  // drift de cámara (parallax base)
  const px = Math.sin(frame * 0.019) * 12 + interpolate(t, [0, 1], [-6, 6], CLAMP);
  const py = Math.cos(frame * 0.016) * 8;

  // respiración global de la fruta
  const breathe = 1 + Math.sin(frame * 0.05) * 0.013;
  const tilt = Math.sin(frame * 0.032) * 0.5;

  // ola teal de luz+agua (fase 3): barre desde la izquierda
  const waveP = interpolate(t, [0.62, 0.84], [0, 1], CLAMP);
  const waveActive = interpolate(t, [0.6, 0.66, 0.9, 0.98], [0, 1, 1, 0], CLAMP);
  const sweepX = interpolate(waveP, [0, 1], [-60, 140], CLAMP);

  // fade-in muy corto al inicio (no fade a negro al final: cerramos en la uva)
  const fadeIn = interpolate(frame, [0, Math.round(0.35 * fps)], [1, 0], CLAMP);

  const farMotes = React.useMemo(
    () => makeMotes(16, 101, 4, 10, 0.05, 0.1, 0.14, 0.34),
    []
  );
  const midMotes = React.useMemo(
    () => makeMotes(14, 202, 2, 5.5, 0.03, 0.075, 0.28, 0.6),
    []
  );
  const nearBokeh = React.useMemo(
    () => makeMotes(4, 303, 90, 200, 0.008, 0.02, 0.05, 0.1),
    []
  );

  return (
    <AbsoluteFill style={{ background: BG_EDGE, overflow: "hidden" }}>
      {/* CÁMARA */}
      <AbsoluteFill style={{ willChange: "transform" }}>
        {/* z0 · fondo radial + viñeta */}
        <Layer factor={0.12} z={0} px={px} py={py}>
          <AbsoluteFill
            style={{
              background: `radial-gradient(120% 100% at 50% 42%, ${BG_CENTER} 0%, ${BG_EDGE} 72%, #061014 100%)`,
              transform: "scale(1.14)",
            }}
          />
          <AbsoluteFill
            style={{
              background: `radial-gradient(80% 62% at 50% 44%, ${rgba(
                TEAL,
                0.1
              )} 0%, transparent 60%)`,
            }}
          />
        </Layer>

        {/* z1 · motas lejanas */}
        <Layer factor={0.3} z={1} px={px} py={py}>
          <MotesLayer motes={farMotes} blur={0} tint="120, 200, 190" />
        </Layer>

        {/* z2 · glow teal detrás de la fruta (respira) */}
        <Layer factor={0.5} z={2} px={px} py={py}>
          <AbsoluteFill
            style={{
              background: `radial-gradient(34% 40% at 50% 43%, ${rgba(
                TEAL_GLOW,
                0.22 + 0.06 * Math.sin(frame * 0.06)
              )} 0%, ${rgba(TEAL, 0.12)} 40%, transparent 66%)`,
              filter: "blur(8px)",
            }}
          />
        </Layer>

        {/* ola de agua/luz teal desde la izquierda (fase 3) */}
        {waveActive > 0.01 && (
          <Layer factor={0.6} z={3} px={px} py={py}>
            <AbsoluteFill
              style={{
                opacity: waveActive,
                background: `radial-gradient(60% 90% at ${interpolate(
                  waveP,
                  [0, 1],
                  [-20, 60],
                  CLAMP
                )}% 50%, ${rgba(TEAL_GLOW, 0.32)} 0%, ${rgba(
                  TEAL,
                  0.14
                )} 34%, transparent 62%)`,
                mixBlendMode: "screen",
              }}
            />
            {/* barrido dorado */}
            <div
              style={{
                position: "absolute",
                top: "-12%",
                bottom: "-12%",
                width: "44%",
                left: 0,
                opacity: waveActive * 0.9,
                transform: `translateX(${sweepX}%) skewX(-16deg)`,
                background: `linear-gradient(100deg, transparent 24%, ${rgba(
                  GOLD,
                  0.32
                )} 50%, transparent 76%)`,
                mixBlendMode: "screen",
              }}
            />
          </Layer>
        )}

        {/* z4 · LA FRUTA (héroe) */}
        <Layer factor={0.72} z={4} px={px} py={py}>
          <AbsoluteFill
            style={{
              transform: `scale(${breathe.toFixed(4)}) rotate(${tilt.toFixed(
                3
              )}deg)`,
              transformOrigin: "50% 44%",
              willChange: "transform",
            }}
          >
            <Grape dry={dry} />
          </AbsoluteFill>
        </Layer>

        {/* z5 · bokeh cercano delante */}
        <Layer factor={1.2} z={5} px={px} py={py}>
          <MotesLayer motes={nearBokeh} blur={10} tint="80, 220, 205" />
          <MotesLayer motes={midMotes} blur={1.6} tint="150, 210, 200" />
        </Layer>

        {/* z6 · CARTAS caption */}
        <Layer factor={0.9} z={6} px={px} py={py}>
          {/* FASE 1 — uva */}
          <CaptionCard
            inF={Math.round(0.08 * D)}
            outF={Math.round(0.29 * D)}
            accent={TEAL}
            y={772}
            main={
              <div
                style={{
                  fontFamily: FONT_SANS,
                  color: INK,
                  fontSize: 42,
                  fontWeight: 800,
                  lineHeight: 1.12,
                }}
              >
                A GRAPE
                <span style={{ color: rgba(INK, 0.62), fontWeight: 600 }}>
                  {" "}
                  — young skin: full, tight, smooth
                </span>
              </div>
            }
          />

          {/* FASE 2 — pasa */}
          <CaptionCard
            inF={Math.round(0.4 * D)}
            outF={Math.round(0.66 * D)}
            accent={RED}
            y={772}
            main={
              <div
                style={{
                  fontFamily: FONT_SANS,
                  color: INK,
                  fontSize: 42,
                  fontWeight: 800,
                  lineHeight: 1.12,
                }}
              >
                <span style={{ color: RED }}>A RAISIN</span>
                <span style={{ color: rgba(INK, 0.62), fontWeight: 600 }}>
                  {" "}
                  — crepey skin: lost its water + cushion
                </span>
              </div>
            }
          />

          {/* etiqueta dorada bajo la carta de pasa */}
          <GoldLabel
            inF={Math.round(0.47 * D)}
            outF={Math.round(0.66 * D)}
            y={890}
            text="same skin — just emptied out"
          />

          {/* FASE 3 — re-hinchada */}
          <CaptionCard
            inF={Math.round(0.72 * D)}
            outF={null}
            accent={TEAL_GLOW}
            y={772}
            main={
              <div
                style={{
                  fontFamily: FONT_SANS,
                  color: INK,
                  fontSize: 42,
                  fontWeight: 800,
                  lineHeight: 1.12,
                }}
              >
                <span style={{ color: TEAL }}>FLOOD + SEAL</span>
                <span style={{ color: rgba(INK, 0.62), fontWeight: 600 }}>
                  {" "}
                  → it fills back in
                </span>
              </div>
            }
          />
        </Layer>

        {/* viñeta / grade encima */}
        <AbsoluteFill
          style={{
            zIndex: 20,
            pointerEvents: "none",
            background: [
              "radial-gradient(125% 105% at 50% 44%, transparent 56%, rgba(2, 8, 12, 0.55) 100%)",
              "linear-gradient(to bottom, rgba(2,8,12,0.34), transparent 20%, transparent 80%, rgba(2,8,12,0.44))",
            ].join(", "),
          }}
        />
      </AbsoluteFill>

      <GrainOverlay />

      {/* fade-in inicial */}
      <AbsoluteFill
        style={{
          zIndex: 50,
          background: BG_EDGE,
          opacity: fadeIn,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

/* --------------------------- etiqueta dorada ---------------------------- */

const GoldLabel: React.FC<{
  inF: number;
  outF: number;
  y: number;
  text: string;
}> = ({ inF, outF, y, text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const st = cardState(frame, fps, inF, outF);
  if (st.op <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: y,
        transform: `translateX(-50%) translateY(${st.ty.toFixed(2)}px)`,
        opacity: st.op,
        filter: `blur(${st.blur.toFixed(2)}px)`,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "9px 22px",
        borderRadius: 999,
        border: `1px solid ${rgba(GOLD, 0.5)}`,
        background: "rgba(8, 20, 24, 0.6)",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: GOLD,
          boxShadow: `0 0 12px ${rgba(GOLD, 0.85)}`,
        }}
      />
      <span
        style={{
          fontFamily: FONT_SERIF,
          fontStyle: "italic",
          fontSize: 25,
          color: rgba(GOLD, 0.95),
          letterSpacing: "0.01em",
        }}
      >
        {text}
      </span>
    </div>
  );
};

export default RaisinReframe;

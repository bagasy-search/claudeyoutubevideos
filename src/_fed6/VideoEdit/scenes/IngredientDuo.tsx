import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ── IngredientDuo — el REVEAL del par (aloe + romero) ────────────────────────
// "Dos plantas, en equipo. El ALOE es la INUNDACIÓN (agua + señal de colágeno).
//  El aceite de ROMERO es el SELLO (lo encierra + protege el colágeno).
//  Uno inunda, uno sella: eso es el sérum de noche."
// Dos cards flotantes en capas de parallax con profundidad real, rack-focus
// A→B, un "+" que se dibuja, gotas de agua fluyendo del aloe y un arco dorado
// (la tapa) que cierra desde el romero, y un subrayado dorado al final.
// Self-contained: SOLO importa de 'remotion' y 'react'. NO importa de FedererFluid.

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const FONT_SANS = "'Archivo', 'Inter', 'Helvetica Neue', Arial, sans-serif";
const FONT_SERIF = "Georgia, 'Times New Roman', serif";

// paleta
const BG_A = "#0E1D23";
const BG_B = "#0A171C";
const TEAL = "#12B3AE";
const TEAL_HI = "#3FE0D6";
const GOLD = "#E8B96B";
const CREAM = "#F3ECDD";
const INK = "#10242A";

const mod = (n: number, m: number): number => ((n % m) + m) % m;

const rgba = (hex: string, alpha: number): string => {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = Number.parseInt(full.length === 6 ? full : "000000", 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// PRNG sembrado (mulberry32) — nunca Math.random() pelado
const mulberry32 = (seed: number): (() => number) => {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/* ------------------------------- motes ---------------------------------- */

type Mote = {
  x: number;
  y0: number;
  size: number;
  speed: number;
  phase: number;
  opacity: number;
};

const makeMotes = (count: number, seed: number): Mote[] => {
  const rnd = mulberry32(seed);
  const out: Mote[] = [];
  for (let i = 0; i < count; i++) {
    out.push({
      x: rnd() * 100,
      y0: rnd(),
      size: 2 + rnd() * 7,
      speed: 0.02 + rnd() * 0.07,
      phase: rnd() * Math.PI * 2,
      opacity: 0.1 + rnd() * 0.4,
    });
  }
  return out;
};

const MotesLayer: React.FC<{ motes: Mote[]; blur: number; scale: number; tint: string }> = ({
  motes,
  blur,
  scale,
  tint,
}) => {
  const frame = useCurrentFrame();
  const RANGE = 118;
  return (
    <AbsoluteFill style={{ filter: `blur(${blur}px)`, pointerEvents: "none" }}>
      {motes.map((m, i) => {
        const y = mod(m.y0 * RANGE - frame * m.speed, RANGE) - 9;
        const x = m.x + Math.sin(frame * 0.02 + m.phase) * 1.6;
        const tw = 0.55 + 0.45 * Math.sin(frame * 0.045 + m.phase * 2);
        const s = m.size * scale;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: s,
              height: s,
              borderRadius: "50%",
              background: `rgba(${tint}, ${m.opacity * tw})`,
              boxShadow: `0 0 ${s * 2.2}px ${s * 0.55}px rgba(${tint}, ${m.opacity * 0.5 * tw})`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const GrainOverlay: React.FC = () => (
  <svg
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      opacity: 0.045,
      mixBlendMode: "overlay",
      zIndex: 40,
      pointerEvents: "none",
    }}
  >
    <filter id="idGrain">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
    </filter>
    <rect width="100%" height="100%" filter="url(#idGrain)" />
  </svg>
);

/* ---------------------------- CARD (hero) ------------------------------- */

const Card: React.FC<{
  src: string;
  delayF: number;
  fromLeft: boolean;
  w: number;
  cx: number; // %
  cy: number; // %
  rot: number;
  floatSeed: number;
  accent: string;
  extraBlur: number; // rack-focus externo
  dim: number; // 0..1 apagado externo
  title: string;
  titleColor: string;
  subtitle: string;
  parX: number;
  parY: number;
  factor: number;
}> = ({
  src,
  delayF,
  fromLeft,
  w,
  cx,
  cy,
  rot,
  floatSeed,
  accent,
  extraBlur,
  dim,
  title,
  titleColor,
  subtitle,
  parX,
  parY,
  factor,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // entrada: whip/slide desde el costado + settle con spring
  const enter = spring({
    frame: frame - delayF,
    fps,
    config: { damping: 22, stiffness: 70, mass: 1 },
  });
  const over = Math.max(0, enter - 1);
  const slideFrom = (fromLeft ? -1 : 1) * width * 0.34;
  const enterX = interpolate(enter, [0, 1], [slideFrom, 0], CLAMP);
  const enterBlur = Math.max(0, interpolate(enter, [0, 1], [22, 0], CLAMP));
  const enterScale = interpolate(enter, [0, 1], [1.14, 1], CLAMP) * (1 + over * 0.09);
  const enterRot = interpolate(enter, [0, 1], [(fromLeft ? -1 : 1) * 7, 0], CLAMP);
  const opacity = interpolate(enter, [0, 0.3], [0, 1], CLAMP);

  // vida continua: float drift + micro-rotación
  const rnd = React.useMemo(() => mulberry32(floatSeed), [floatSeed]);
  const fs = React.useMemo(() => rnd() * Math.PI * 2, [rnd]);
  const floatY = Math.sin(frame * 0.05 + fs) * height * 0.008;
  const floatX = Math.cos(frame * 0.04 + fs * 1.7) * width * 0.003;
  const wobble = Math.sin(frame * 0.045 + fs) * 0.6;
  const glowPulse = 0.24 + 0.1 * Math.sin(frame * 0.07 + fs);

  // barrido de luz dorada (sheen) al asentar
  const sheenStart = delayF + Math.round(0.9 * fps);
  const sheenP = interpolate(frame, [sheenStart, sheenStart + Math.round(0.85 * fps)], [0, 1], CLAMP);
  const sheenX = interpolate(sheenP, [0, 1], [-130, 230], CLAMP);
  const sheenOp = interpolate(sheenP, [0, 0.15, 0.85, 1], [0, 0.85, 0.85, 0], CLAMP);

  // chip + subtítulo (aparecen tras la card)
  const chip = spring({
    frame: frame - (delayF + Math.round(0.55 * fps)),
    fps,
    config: { damping: 18, stiffness: 120, mass: 0.8 },
  });
  const chipO = interpolate(chip, [0, 1], [0, 1], CLAMP);
  const chipY = interpolate(chip, [0, 1], [16, 0], CLAMP);

  const focusBlur = enterBlur + extraBlur;
  const bright = 1 - dim * 0.4;
  const sat = 1 - dim * 0.28;

  return (
    <div
      style={{
        position: "absolute",
        left: `${cx}%`,
        top: `${cy}%`,
        width: w,
        transform: `translate(-50%, -50%) translate(${
          parX * factor + floatX + enterX
        }px, ${parY * factor + floatY}px) rotate(${rot + wobble + enterRot}deg) scale(${enterScale})`,
        opacity,
        willChange: "transform, filter, opacity",
      }}
    >
      <div style={{ position: "relative", width: "100%" }}>
        {/* glow teal detrás */}
        <div
          style={{
            position: "absolute",
            inset: "-20%",
            background: `radial-gradient(50% 50% at 50% 50%, ${rgba(accent, glowPulse * (1 - dim * 0.5))} 0%, ${rgba(
              accent,
              glowPulse * 0.3,
            )} 42%, transparent 72%)`,
            filter: "blur(34px)",
            zIndex: -1,
          }}
        />
        {/* marco redondeado con borde crema + sombra */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "4 / 5",
            borderRadius: 22,
            overflow: "hidden",
            border: `2px solid ${rgba(CREAM, 0.9)}`,
            background: INK,
            filter: `blur(${focusBlur}px) brightness(${bright}) saturate(${sat}) drop-shadow(0 ${
              height * 0.03
            }px ${height * 0.055}px rgba(1, 6, 10, 0.62))`,
          }}
        >
          <img
            src={src}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
            }}
          />
          {/* top highlight + inner shadow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, rgba(255,255,255,0.10), transparent 26%)",
              boxShadow: "inset 0 0 80px rgba(2, 8, 12, 0.45)",
            }}
          />
          {/* scrim inferior para legibilidad del chip */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: "42%",
              background: "linear-gradient(to top, rgba(6,16,20,0.9), transparent)",
            }}
          />
          {/* sheen dorado */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              width: "62%",
              transform: `translateX(${sheenX}%) skewX(-14deg)`,
              background: `linear-gradient(100deg, transparent 30%, ${rgba(GOLD, 0.35)} 50%, transparent 70%)`,
              mixBlendMode: "screen",
              opacity: sheenOp,
              pointerEvents: "none",
            }}
          />
          {/* chip + subtítulo sobre el scrim */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: "7%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              opacity: chipO,
              transform: `translateY(${chipY}px)`,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 26px",
                borderRadius: 999,
                border: `1px solid ${rgba(titleColor, 0.5)}`,
                background: "rgba(6, 16, 20, 0.55)",
              }}
            >
              <span
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: titleColor,
                  boxShadow: `0 0 14px ${rgba(titleColor, 0.85)}`,
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  fontFamily: FONT_SANS,
                  fontWeight: 800,
                  fontSize: Math.round(w * 0.13),
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: titleColor,
                  textShadow: `0 0 22px ${rgba(titleColor, 0.5)}, 0 2px 10px rgba(0,0,0,0.6)`,
                }}
              >
                {title}
              </span>
            </div>
            <span
              style={{
                fontFamily: FONT_SANS,
                fontWeight: 600,
                fontSize: Math.round(w * 0.062),
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: rgba(CREAM, 0.94),
                textShadow: "0 2px 12px rgba(0,0,0,0.7)",
                textAlign: "center",
                padding: "0 8%",
              }}
            >
              {subtitle}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --------------------- conectivas (+, gotas, tapa) ---------------------- */

const PlusMark: React.FC<{ startF: number; cx: number; cy: number; size: number }> = ({
  startF,
  cx,
  cy,
  size,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const draw = spring({
    frame: frame - startF,
    fps,
    config: { damping: 16, stiffness: 120, mass: 0.8 },
  });
  const hBar = interpolate(draw, [0, 1], [0, 1], CLAMP);
  const vBar = interpolate(draw, [0, 0.4, 1], [0, 0, 1], CLAMP);
  const glow = 0.5 + 0.2 * Math.sin(frame * 0.09);
  const bar = Math.max(6, size * 0.16);
  const common: React.CSSProperties = {
    position: "absolute",
    left: "50%",
    top: "50%",
    borderRadius: bar,
    background: `linear-gradient(90deg, ${TEAL}, ${GOLD})`,
    boxShadow: `0 0 26px ${rgba(TEAL_HI, glow)}`,
  };
  return (
    <div
      style={{
        position: "absolute",
        left: `${cx}%`,
        top: `${cy}%`,
        width: size,
        height: size,
        transform: "translate(-50%, -50%)",
        opacity: interpolate(draw, [0, 0.2], [0, 1], CLAMP),
      }}
    >
      {/* halo suave */}
      <div
        style={{
          position: "absolute",
          inset: "-30%",
          borderRadius: "50%",
          background: `radial-gradient(50% 50% at 50% 50%, ${rgba(TEAL, 0.28)} 0%, transparent 70%)`,
          filter: "blur(14px)",
        }}
      />
      <div
        style={{
          ...common,
          width: size,
          height: bar,
          transform: `translate(-50%, -50%) scaleX(${hBar})`,
        }}
      />
      <div
        style={{
          ...common,
          width: bar,
          height: size,
          transform: `translate(-50%, -50%) scaleY(${vBar})`,
        }}
      />
    </div>
  );
};

// gotas de agua (teal) que fluyen del aloe (izq) hacia el centro
const WaterFlow: React.FC<{ startF: number; fromX: number; toX: number; midY: number }> = ({
  startF,
  fromX,
  toX,
  midY,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drops = React.useMemo(() => {
    const rnd = mulberry32(9137);
    const out: { phase: number; speed: number; yoff: number; size: number }[] = [];
    for (let i = 0; i < 7; i++) {
      out.push({
        phase: rnd(),
        speed: 0.5 + rnd() * 0.4,
        yoff: (rnd() - 0.5) * 10,
        size: 8 + rnd() * 10,
      });
    }
    return out;
  }, []);
  const gate = interpolate(frame, [startF, startF + fps], [0, 1], CLAMP);
  const rel = (frame - startF) / fps;
  return (
    <>
      {drops.map((d, i) => {
        const t = mod(rel * d.speed + d.phase, 1);
        const x = interpolate(t, [0, 1], [fromX, toX], CLAMP);
        const arc = Math.sin(t * Math.PI) * 5;
        const y = midY + d.yoff - arc;
        const o = interpolate(t, [0, 0.15, 0.8, 1], [0, 1, 1, 0], CLAMP) * gate;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: d.size,
              height: d.size,
              transform: "translate(-50%, -50%)",
              borderRadius: "50% 50% 50% 0",
              background: `radial-gradient(circle at 35% 30%, ${TEAL_HI}, ${TEAL})`,
              boxShadow: `0 0 16px ${rgba(TEAL_HI, 0.7 * o)}`,
              opacity: o,
              rotate: "45deg",
            }}
          />
        );
      })}
    </>
  );
};

// arco dorado (la tapa) que cierra sobre el centro desde el romero (der)
const SealArc: React.FC<{ startF: number; cx: number; cy: number; rx: number }> = ({
  startF,
  cx,
  cy,
  rx,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const draw = interpolate(frame, [startF, startF + Math.round(1.0 * fps)], [0, 1], {
    ...CLAMP,
    easing: (t) => t * (2 - t),
  });
  const glow = 0.55 + 0.2 * Math.sin(frame * 0.08);
  const R = rx;
  const cxPx = 480; // viewBox space
  const cyPx = 240;
  // semicírculo superior (tapa)
  const path = `M ${cxPx - R} ${cyPx} A ${R} ${R * 0.62} 0 0 1 ${cxPx + R} ${cyPx}`;
  const len = Math.PI * R; // aprox
  return (
    <div
      style={{
        position: "absolute",
        left: `${cx}%`,
        top: `${cy}%`,
        width: "26%",
        transform: "translate(-50%, -50%)",
        opacity: interpolate(frame, [startF, startF + 6], [0, 1], CLAMP),
      }}
    >
      <svg viewBox="0 0 960 480" style={{ width: "100%", overflow: "visible" }}>
        <path
          d={path}
          fill="none"
          stroke={GOLD}
          strokeWidth={14}
          strokeLinecap="round"
          strokeDasharray={len}
          strokeDashoffset={len * (1 - draw)}
          style={{ filter: `drop-shadow(0 0 12px ${rgba(GOLD, glow)})` }}
        />
        {/* pequeño remache que baja al cerrar */}
        <circle
          cx={cxPx}
          cy={cyPx - R * 0.62 - 4}
          r={10}
          fill={GOLD}
          opacity={draw}
          style={{ filter: `drop-shadow(0 0 10px ${rgba(GOLD, glow)})` }}
        />
      </svg>
    </div>
  );
};

/* =============================== ESCENA ================================== */

export const IngredientDuo: React.FC<{
  durationInFrames: number;
  leftImg: string;
  rightImg: string;
  leftTitle?: string;
  leftSub?: string;
  rightTitle?: string;
  rightSub?: string;
}> = ({ durationInFrames, leftImg, rightImg,
  leftTitle = "ALOE", leftSub = "The flood — water + collagen signal",
  rightTitle = "ROSEMARY", rightSub = "The seal — locks it in + guards collagen" }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const D = durationInFrames;
  const leftSrc = staticFile(leftImg);
  const rightSrc = staticFile(rightImg);

  // parallax handheld global (cada card lo multiplica por su factor)
  const parX =
    Math.sin(frame * 0.03) * width * 0.004 + Math.sin(frame * 0.011 + 1.1) * width * 0.005;
  const parY = Math.cos(frame * 0.026 + 0.6) * height * 0.004;

  // respiración lenta del fondo (nada 100% estático)
  const bgScale = interpolate(frame, [0, D], [1.04, 1.09], CLAMP);

  // fade-in de escena
  const sceneIn = interpolate(frame, [0, Math.round(0.5 * fps)], [0, 1], CLAMP);

  // ── RACK-FOCUS A→B ──
  // fase 1: izq nítida / der borrosa+apagada
  // shift: el foco viaja a la der
  // settle: ambas nítidas
  const shiftStart = Math.round(2.1 * fps);
  const shiftEnd = Math.round(3.3 * fps);
  const settleStart = Math.round(3.7 * fps);
  const settleEnd = Math.round(4.5 * fps);
  const focus = interpolate(frame, [shiftStart, shiftEnd], [0, 1], CLAMP); // 0 izq, 1 der
  const settle = interpolate(frame, [settleStart, settleEnd], [0, 1], CLAMP);
  const MAXB = 12;
  const leftExtraBlur = focus * MAXB * (1 - settle);
  const rightExtraBlur = (1 - focus) * MAXB * (1 - settle);
  const leftDim = focus * (1 - settle);
  const rightDim = (1 - focus) * (1 - settle);

  // motes por capa
  const farMotes = React.useMemo(() => makeMotes(16, 4201), []);
  const midMotes = React.useMemo(() => makeMotes(13, 8803), []);
  const nearMotes = React.useMemo(() => makeMotes(6, 1559), []);

  // geometría cards
  const cardW = Math.min(width * 0.27, height * 0.42);
  const leftCx = 27;
  const rightCx = 73;
  const cardCy = 47;

  // conectivas (timeline)
  const plusStart = Math.round(1.5 * fps);
  const waterStart = Math.round(2.4 * fps);
  const sealStart = Math.round(3.0 * fps);

  // ── END: subrayado dorado + caption ──
  const capInF = D - Math.round(2.1 * fps);
  const capSp = spring({ frame: frame - capInF, fps, config: { damping: 20, stiffness: 100, mass: 0.9 } });
  const capO = interpolate(capSp, [0, 1], [0, 1], CLAMP);
  const capY = interpolate(capSp, [0, 1], [18, 0], CLAMP);
  const underStart = D - Math.round(1.6 * fps);
  const underDraw = interpolate(frame, [underStart, underStart + Math.round(0.85 * fps)], [0, 1], {
    ...CLAMP,
    easing: (t) => t * (2 - t),
  });

  const moteTint = "120, 200, 195";

  return (
    <AbsoluteFill style={{ fontFamily: FONT_SANS, backgroundColor: BG_B, overflow: "hidden" }}>
      {/* fondo: gradiente radial teal-negro + respiración */}
      <AbsoluteFill style={{ transform: `scale(${bgScale})`, willChange: "transform" }}>
        <AbsoluteFill
          style={{
            background: [
              `radial-gradient(80% 62% at 50% 40%, ${rgba(TEAL, 0.16)} 0%, transparent 58%)`,
              `radial-gradient(120% 100% at 50% 44%, ${BG_A} 0%, ${BG_B} 55%, #050d11 100%)`,
            ].join(", "),
          }}
        />
        {/* motes lejanos */}
        <MotesLayer motes={farMotes} blur={0} scale={height / 1080} tint={moteTint} />
      </AbsoluteFill>

      {/* motes medios (parallax leve) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${parX * 0.4}px, ${parY * 0.4}px)`,
          willChange: "transform",
        }}
      >
        <MotesLayer motes={midMotes} blur={1.4} scale={height / 1080} tint={moteTint} />
      </div>

      {/* CARD IZQ — ALOE (z detrás) */}
      <div style={{ position: "absolute", inset: 0, zIndex: 3 }}>
        <Card
          src={leftSrc}
          delayF={Math.round(0.1 * fps)}
          fromLeft
          w={cardW}
          cx={leftCx}
          cy={cardCy}
          rot={-2.2}
          floatSeed={71}
          accent={TEAL}
          extraBlur={leftExtraBlur}
          dim={leftDim}
          title={leftTitle}
          titleColor={TEAL_HI}
          subtitle={leftSub}
          parX={parX}
          parY={parY}
          factor={0.6}
        />
      </div>

      {/* conectivas entre cards (z medio) */}
      <div style={{ position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none" }}>
        <WaterFlow startF={waterStart} fromX={leftCx + 9} toX={50} midY={cardCy} />
        <SealArc startF={sealStart} cx={50} cy={cardCy - 9} rx={150} />
        <PlusMark startF={plusStart} cx={50} cy={cardCy} size={Math.round(width * 0.05)} />
      </div>

      {/* CARD DER — ROMERO (z delante) */}
      <div style={{ position: "absolute", inset: 0, zIndex: 5 }}>
        <Card
          src={rightSrc}
          delayF={Math.round(0.35 * fps)}
          fromLeft={false}
          w={cardW * 1.04}
          cx={rightCx}
          cy={cardCy}
          rot={2.4}
          floatSeed={204}
          accent={GOLD}
          extraBlur={rightExtraBlur}
          dim={rightDim}
          title={rightTitle}
          titleColor={GOLD}
          subtitle={rightSub}
          parX={parX}
          parY={parY}
          factor={0.78}
        />
      </div>

      {/* motes cercanos / bokeh delante */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 6,
          transform: `translate(${parX * 1.15}px, ${parY * 1.15}px)`,
          willChange: "transform",
        }}
      >
        <MotesLayer motes={nearMotes} blur={7} scale={(height / 1080) * 3.2} tint={moteTint} />
      </div>

      {/* CAPTION inferior + subrayado dorado */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: "6.5%",
          zIndex: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          opacity: capO,
          transform: `translateY(${capY}px)`,
        }}
      >
        <span
          style={{
            fontFamily: FONT_SERIF,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: Math.round(height * 0.034),
            color: rgba(CREAM, 0.95),
            textShadow: "0 2px 16px rgba(0,0,0,0.7)",
            whiteSpace: "nowrap",
          }}
        >
          one floods · one seals = the night serum
        </span>
        <div
          style={{
            width: interpolate(underDraw, [0, 1], [0, Math.round(width * 0.28)], CLAMP),
            height: 3,
            borderRadius: 2,
            background: `linear-gradient(90deg, ${TEAL}, ${GOLD})`,
            boxShadow: `0 0 16px ${rgba(GOLD, 0.6)}`,
          }}
        />
      </div>

      {/* viñeta global + grano */}
      <AbsoluteFill
        style={{
          zIndex: 30,
          pointerEvents: "none",
          background:
            "radial-gradient(120% 100% at 50% 46%, transparent 58%, rgba(2, 8, 12, 0.5) 100%)",
        }}
      />
      <GrainOverlay />

      {/* fade-in de escena */}
      <AbsoluteFill
        style={{
          zIndex: 50,
          background: BG_B,
          opacity: 1 - sceneIn,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

export default IngredientDuo;

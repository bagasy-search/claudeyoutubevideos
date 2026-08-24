import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * ============================================================================
 * WhyNightScene — la firma del canal Dr. Federer: "¿por qué de noche?"
 * ----------------------------------------------------------------------------
 * DÍA / DEFENSA  →  (whip + barrido dorado, sale la luna)  →  NOCHE / REPARACIÓN
 *
 *  PHASE 1 (día, más fría y clara): un SOL arriba-izq, la piel como un ESCUDO
 *  que aguanta impactos UV (flechitas que rebotan) y pierde agua (moléculas que
 *  suben). Etiqueta "DAY — DEFENSE".
 *  TRANSICIÓN: latigazo cinematográfico + light-sweep dorado; la LUNA sube y la
 *  paleta se hunde a teal-navy nocturno; las estrellas aparecen como motes.
 *  PHASE 2 (noche, profunda y luminosa): LUNA creciente + estrellas; abajo, un
 *  corte de piel que se RECONSTRUYE — fibras de colágeno se tejen, un glow teal
 *  sube de la dermis, chispas de reparación. Etiqueta "NIGHT — REPAIR".
 *  Un RELOJ DE 24H barre y se ENCIENDE en las horas nocturnas (oro). Cierre en
 *  tarjeta crema: "flood + seal at the hour your skin rebuilds".
 *
 * Autocontenido: reusa (sin importar de FedererFluid) los patrones ParallaxLayer,
 * MotesLayer, GrainOverlay, light-sweep dorado, glows y whip de transición.
 * 1920×1080 @ 30fps. Todo el timing sale de useCurrentFrame() + durationInFrames.
 * ============================================================================
 */

/* ============================== UTILIDADES =============================== */

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const FONT_SANS =
  "'Archivo', 'Inter', 'Helvetica Neue', Arial, sans-serif";

// paleta
const SUN = "#E8B96B"; // sol / horas nocturnas encendidas (oro)
const GOLD = "#E8B96B";
const TEAL = "#12B3AE";
const BRIGHT = "#3FE0D6";
const CREAM = "#F3ECDD";
const INK = "#10242A";
const NIGHT_1 = "#0A171C";
const NIGHT_2 = "#0E1D23";

const mod = (n: number, m: number): number => ((n % m) + m) % m;
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
const clamp01 = (n: number): number => Math.max(0, Math.min(1, n));

const rgba = (hex: string, alpha: number): string => {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = Number.parseInt(full.length === 6 ? full : "000000", 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// PRNG seeded — mulberry32 (nunca Math.random())
const mulberry32 = (seed: number): (() => number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/* ------------------------------ partículas ------------------------------ */

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
  const rnd = mulberry32(seed);
  return new Array(count).fill(0).map(() => ({
    x: rnd() * 100,
    y0: rnd(),
    size: sizeMin + rnd() * (sizeMax - sizeMin),
    speed: spMin + rnd() * (spMax - spMin),
    phase: rnd() * Math.PI * 2,
    opacity: oMin + rnd() * (oMax - oMin),
  }));
};

const MotesLayer: React.FC<{ motes: Mote[]; blur: number; tint: string }> = ({
  motes,
  blur,
  tint,
}) => {
  const frame = useCurrentFrame();
  const RANGE = 118;
  return (
    <AbsoluteFill style={{ filter: `blur(${blur}px)`, pointerEvents: "none" }}>
      {motes.map((m, i) => {
        const y = mod(m.y0 * RANGE - frame * m.speed, RANGE) - 9;
        const x = m.x + Math.sin(frame * 0.02 + m.phase) * 1.6;
        const tw = 0.5 + 0.5 * Math.sin(frame * 0.05 + m.phase * 2);
        const s = m.size;
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
              boxShadow: `0 0 ${s * 2.2}px ${s * 0.55}px rgba(${tint}, ${
                m.opacity * 0.5 * tw
              })`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const ParallaxLayer: React.FC<{
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
      transform: `translate(${px * factor}px, ${py * factor}px)`,
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
      zIndex: 60,
      pointerEvents: "none",
    }}
  >
    <filter id="wnGrain">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.85"
        numOctaves="2"
        stitchTiles="stitch"
      />
    </filter>
    <rect width="100%" height="100%" filter="url(#wnGrain)" />
  </svg>
);

/* ================================ SOL =================================== */

const Sun: React.FC = () => {
  const frame = useCurrentFrame();
  const rot = frame * 0.32;
  const pulse = 0.9 + 0.1 * Math.sin(frame * 0.07);
  const rays = Array.from({ length: 12 }, (_, i) => i);
  const S = 360;
  return (
    <div style={{ position: "relative", width: S, height: S }}>
      <div
        style={{
          position: "absolute",
          inset: "-42%",
          background: `radial-gradient(circle at 50% 50%, ${rgba(
            SUN,
            0.5
          )} 0%, ${rgba(SUN, 0.16)} 36%, transparent 66%)`,
          filter: "blur(14px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `rotate(${rot}deg) scale(${pulse})`,
          transformOrigin: "50% 50%",
        }}
      >
        <svg
          viewBox="0 0 200 200"
          style={{ width: "100%", height: "100%", overflow: "visible" }}
        >
          {rays.map((i) => {
            const a = (i / 12) * Math.PI * 2;
            const x1 = 100 + Math.cos(a) * 70;
            const y1 = 100 + Math.sin(a) * 70;
            const x2 = 100 + Math.cos(a) * 97;
            const y2 = 100 + Math.sin(a) * 97;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={SUN}
                strokeWidth={5}
                strokeLinecap="round"
                opacity={0.82}
              />
            );
          })}
        </svg>
      </div>
      <div
        style={{
          position: "absolute",
          inset: "27%",
          borderRadius: "50%",
          background: `radial-gradient(circle at 42% 38%, #FBE7C0, ${SUN} 58%, #D79A4E)`,
          boxShadow: `0 0 56px ${rgba(SUN, 0.7)}`,
        }}
      />
    </div>
  );
};

/* ================================ LUNA ================================== */

const Moon: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 0.92 + 0.08 * Math.sin(frame * 0.05);
  const S = 260;
  return (
    <div
      style={{ position: "relative", width: S, height: S, transform: `scale(${pulse})` }}
    >
      <div
        style={{
          position: "absolute",
          inset: "-38%",
          background: `radial-gradient(circle at 50% 50%, ${rgba(
            BRIGHT,
            0.3
          )} 0%, transparent 62%)`,
          filter: "blur(16px)",
        }}
      />
      <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%" }}>
        <defs>
          <radialGradient id="wnMoonFill" cx="40%" cy="36%" r="72%">
            <stop offset="0%" stopColor="#F6F0E2" />
            <stop offset="66%" stopColor="#CFE8E4" />
            <stop offset="100%" stopColor="#8FC7C2" />
          </radialGradient>
          <mask id="wnMoonMask">
            <rect width="200" height="200" fill="black" />
            <circle cx="100" cy="100" r="72" fill="white" />
            <circle cx="134" cy="84" r="63" fill="black" />
          </mask>
        </defs>
        <circle
          cx="100"
          cy="100"
          r="72"
          fill="url(#wnMoonFill)"
          mask="url(#wnMoonMask)"
        />
      </svg>
    </div>
  );
};

/* ====================== PHASE 1 · PIEL = ESCUDO ========================= */

const ArrowGlyph: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    style={{ overflow: "visible", display: "block" }}
  >
    <path d="M2 12 H17" stroke={color} strokeWidth={3} strokeLinecap="round" />
    <path
      d="M11 6 L18 12 L11 18"
      fill="none"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ShieldDefense: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - startFrame;

  // geometría del muro (coords 1920×1080)
  const wallTop = 316;
  const wallBot = 812;
  const wallLeft = 1128;
  const wallW = 152;
  const wallH = wallBot - wallTop;
  const WL = wallLeft; // cara izquierda que recibe los impactos

  const enter = spring({
    frame: f,
    fps,
    config: { damping: 22, stiffness: 90, mass: 0.9 },
  });
  const eScale = interpolate(enter, [0, 1], [0.9, 1], CLAMP);
  const eOp = interpolate(enter, [0, 0.5], [0, 1], CLAMP);
  const sway = Math.sin(f * 0.045) * 0.7; // el muro respira

  // ladrillos (segmentos del muro)
  const rows = 8;
  const cols = 3;

  // impactos UV
  const arrows = React.useMemo(() => {
    const rnd = mulberry32(0xa11);
    return new Array(7).fill(0).map(() => ({
      fracY: 0.1 + rnd() * 0.8,
      speed: 0.011 + rnd() * 0.008,
      phase: rnd(),
      size: 30 + rnd() * 12,
    }));
  }, []);

  // agua que escapa hacia arriba
  const drops = React.useMemo(() => {
    const rnd = mulberry32(0xd20);
    return new Array(4).fill(0).map(() => ({
      fx: rnd(),
      speed: 0.008 + rnd() * 0.006,
      phase: rnd(),
      size: 12 + rnd() * 8,
    }));
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, opacity: eOp }}>
      {/* halo frío detrás del muro */}
      <div
        style={{
          position: "absolute",
          left: wallLeft - 120,
          top: wallTop - 120,
          width: wallW + 240,
          height: wallH + 240,
          background: `radial-gradient(closest-side, ${rgba(
            "#8FB9C4",
            0.22
          )}, transparent 72%)`,
          filter: "blur(10px)",
        }}
      />

      {/* MURO / ESCUDO */}
      <div
        style={{
          position: "absolute",
          left: wallLeft,
          top: wallTop,
          width: wallW,
          height: wallH,
          transformOrigin: "50% 100%",
          transform: `rotate(${sway}deg) scale(${eScale})`,
          borderRadius: 14,
          background:
            "linear-gradient(100deg, #33525c 0%, #26424b 46%, #1b333a 100%)",
          border: `2px solid ${rgba("#BFE0E6", 0.5)}`,
          boxShadow: `inset 0 0 40px rgba(3,10,14,0.5), 0 24px 60px rgba(2,8,12,0.5)`,
          overflow: "hidden",
        }}
      >
        {/* textura de ladrillos */}
        {Array.from({ length: rows }, (_, r) =>
          Array.from({ length: cols }, (_, c) => (
            <div
              key={`${r}-${c}`}
              style={{
                position: "absolute",
                left: `${(c / cols) * 100 + (r % 2 ? 6 : -3)}%`,
                top: `${(r / rows) * 100}%`,
                width: `${100 / cols - 4}%`,
                height: `${100 / rows - 5}%`,
                borderRadius: 4,
                background: rgba("#4a6b74", 0.28),
                border: `1px solid ${rgba("#0c1b20", 0.5)}`,
              }}
            />
          ))
        )}
        {/* brillo de escudo que barre lento */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, ${rgba(
              "#DCEFF2",
              0.16
            )}, transparent 30%)`,
          }}
        />
      </div>

      {/* impactos UV que rebotan */}
      {arrows.map((ar, i) => {
        const p = mod(f * ar.speed + ar.phase, 1);
        const hitY = wallTop + ar.fracY * wallH;
        const startX = WL - 300;
        const startY = hitY - 210;
        let ax: number;
        let ay: number;
        let ang: number;
        let aop: number;
        if (p < 0.5) {
          const q = p / 0.5;
          ax = lerp(startX, WL, q);
          ay = lerp(startY, hitY, q);
          ang = 35;
          aop = interpolate(q, [0, 0.15, 1], [0, 1, 1], CLAMP);
        } else {
          const q = (p - 0.5) / 0.5;
          ax = lerp(WL, WL - 170, q);
          ay = lerp(hitY, hitY - 200, q);
          ang = -132;
          aop = interpolate(q, [0, 0.7, 1], [1, 1, 0], CLAMP);
        }
        const sparkOp =
          interpolate(Math.abs(p - 0.5), [0, 0.055], [1, 0], CLAMP) * 0.9;
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: "absolute",
                left: ax,
                top: ay,
                transform: `translate(-50%,-50%) rotate(${ang}deg)`,
                opacity: aop,
                filter: `drop-shadow(0 0 6px ${rgba(SUN, 0.6)})`,
              }}
            >
              <ArrowGlyph size={ar.size} color={SUN} />
            </div>
            {/* chispa del impacto en la cara del muro */}
            <div
              style={{
                position: "absolute",
                left: WL,
                top: hitY,
                transform: "translate(-50%,-50%)",
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${rgba(
                  "#FFF0D2",
                  0.95
                )}, ${rgba(SUN, 0.5)} 45%, transparent 70%)`,
                opacity: sparkOp,
              }}
            />
          </React.Fragment>
        );
      })}

      {/* moléculas de agua que se pierden (suben del borde superior del muro) */}
      {drops.map((d, i) => {
        const p = mod(f * d.speed + d.phase, 1);
        const dx = wallLeft + 16 + d.fx * (wallW - 32);
        const dy = lerp(wallTop + 26, wallTop - 210, p);
        const dop = interpolate(p, [0, 0.16, 0.8, 1], [0, 1, 1, 0], CLAMP);
        const dScale = interpolate(p, [0, 1], [1, 0.7], CLAMP);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: dx,
              top: dy,
              transform: `translate(-50%,-50%) scale(${dScale})`,
              width: d.size,
              height: d.size,
              borderRadius: "50% 50% 50% 50%",
              background: `radial-gradient(circle at 38% 32%, #EAFBFA, ${rgba(
                BRIGHT,
                0.85
              )} 55%, ${rgba(TEAL, 0.35)} 100%)`,
              boxShadow: `0 0 12px ${rgba(BRIGHT, 0.5)}`,
              opacity: dop * 0.9,
            }}
          />
        );
      })}
    </div>
  );
};

/* ================== PHASE 2 · PIEL QUE SE RECONSTRUYE =================== */

const SkinRepair: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - startFrame;

  // contenedor (coords propias del corte)
  const box = { left: 108, top: 548, w: 900, h: 300 };
  const VW = box.w;
  const VH = box.h;
  const dermTop = 70; // dentro del viewBox: empieza la dermis

  const enter = spring({
    frame: f,
    fps,
    config: { damping: 24, stiffness: 70, mass: 1 },
  });
  const eOp = interpolate(enter, [0, 0.35], [0, 1], CLAMP);
  const eScale = interpolate(enter, [0, 1], [0.93, 1], CLAMP);

  // fibras de colágeno que se tejen (draw-in con dashoffset)
  const fibers = React.useMemo(() => {
    const rnd = mulberry32(0xc07);
    const N = 11;
    return new Array(N).fill(0).map((_, i) => {
      const cx = 46 + (i / (N - 1)) * (VW - 92);
      const dir = i % 2 === 0 ? 1 : -1;
      const span = 74 + rnd() * 82;
      const y1 = dermTop + 14 + rnd() * 34;
      const y2 = VH - 34 - rnd() * 46;
      const x1 = cx - dir * span * 0.5 + (rnd() - 0.5) * 34;
      const x2 = cx + dir * span * 0.5 + (rnd() - 0.5) * 34;
      const len = Math.hypot(x2 - x1, y2 - y1);
      return {
        x1,
        y1,
        x2,
        y2,
        len,
        delay: i * 2.1,
        w: 3 + rnd() * 2,
        mx: (x1 + x2) / 2,
        my: (y1 + y2) / 2,
        tw: rnd() * Math.PI * 2,
      };
    });
  }, [VW, VH]);

  // chispas de reparación
  const sparks = React.useMemo(() => {
    const rnd = mulberry32(0x59a);
    return new Array(9).fill(0).map(() => ({
      x: 40 + rnd() * (VW - 80),
      y: dermTop + 20 + rnd() * (VH - dermTop - 40),
      delay: 20 + rnd() * 60,
      tw: rnd() * Math.PI * 2,
      size: 4 + rnd() * 4,
    }));
  }, [VW, VH]);

  // glow teal que sube de la dermis
  const glowY = interpolate(f, [0, 90], [VH + 20, dermTop + 40], CLAMP);
  const glowPulse = 0.55 + 0.25 * Math.sin(f * 0.08);

  return (
    <div
      style={{
        position: "absolute",
        left: box.left,
        top: box.top,
        width: box.w,
        height: box.h,
        opacity: eOp,
        transform: `scale(${eScale})`,
        transformOrigin: "0% 100%",
      }}
    >
      {/* epidermis (banda superior clara) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: (dermTop / VH) * 100 + "%",
          borderRadius: "14px 14px 0 0",
          background: `linear-gradient(180deg, ${rgba("#BFE7E3", 0.55)}, ${rgba(
            TEAL,
            0.32
          )})`,
          borderBottom: `1px solid ${rgba(BRIGHT, 0.4)}`,
        }}
      />
      {/* dermis (contenedor recortado con el glow que sube dentro) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: (dermTop / VH) * 100 + "%",
          width: "100%",
          bottom: 0,
          borderRadius: "0 0 14px 14px",
          background: `linear-gradient(180deg, ${rgba("#0d2a30", 0.9)}, ${rgba(
            "#0a2026",
            0.94
          )})`,
          border: `1px solid ${rgba(TEAL, 0.35)}`,
          borderTop: "none",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: glowY - dermTop,
            transform: "translate(-50%,-50%)",
            width: "120%",
            height: 320,
            background: `radial-gradient(50% 50% at 50% 50%, ${rgba(
              BRIGHT,
              0.4 * glowPulse
            )} 0%, ${rgba(TEAL, 0.2 * glowPulse)} 40%, transparent 72%)`,
            filter: "blur(6px)",
          }}
        />
      </div>

      {/* fibras + chispas en un SVG sobre el corte */}
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          overflow: "visible",
        }}
      >
        {fibers.map((fb, i) => {
          const draw = interpolate(
            f,
            [fb.delay, fb.delay + 16],
            [0, 1],
            CLAMP
          );
          const shimmer = 0.55 + 0.45 * Math.sin(f * 0.06 + fb.tw);
          const op = draw * (0.5 + 0.5 * shimmer);
          return (
            <line
              key={i}
              x1={fb.x1}
              y1={fb.y1}
              x2={fb.x2}
              y2={fb.y2}
              stroke={i % 3 === 0 ? BRIGHT : TEAL}
              strokeWidth={fb.w}
              strokeLinecap="round"
              strokeDasharray={fb.len}
              strokeDashoffset={fb.len * (1 - draw)}
              opacity={op}
              style={{
                filter: `drop-shadow(0 0 5px ${rgba(BRIGHT, 0.4 * draw)})`,
              }}
            />
          );
        })}
        {sparks.map((sp, i) => {
          const on = interpolate(f, [sp.delay, sp.delay + 10], [0, 1], CLAMP);
          const tw = 0.35 + 0.65 * Math.abs(Math.sin(f * 0.11 + sp.tw));
          return (
            <circle
              key={i}
              cx={sp.x}
              cy={sp.y}
              r={sp.size * (0.7 + 0.3 * tw)}
              fill="#EAFFFC"
              opacity={on * tw * 0.9}
              style={{ filter: `drop-shadow(0 0 6px ${rgba(BRIGHT, 0.8)})` }}
            />
          );
        })}
      </svg>
    </div>
  );
};

/* ===================== RELOJ DE 24H (bloqueo nocturno) ================== */

const HourDial24: React.FC<{
  startFrame: number;
  cx: number;
  cy: number;
  R: number;
}> = ({ startFrame, cx, cy, R }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - startFrame;

  const lockHour = 2; // ~2am, corazón de la ventana de reparación
  const targetAng = (lockHour / 24) * 360 - 90;

  const appear = spring({
    frame: f,
    fps,
    config: { damping: 20, stiffness: 90, mass: 0.9 },
  });
  const aOp = interpolate(appear, [0, 0.4], [0, 1], CLAMP);
  const aScale = interpolate(appear, [0, 1], [0.85, 1], CLAMP);

  // manecilla: ~1.6 vueltas y frena en la hora nocturna
  const handSp = spring({
    frame: f - 8,
    fps,
    config: { damping: 16, stiffness: 45 },
    durationInFrames: 74,
  });
  const handAng = interpolate(handSp, [0, 1], [-90, targetAng + 360 * 1.6], CLAMP);
  const ignited = spring({
    frame: f - 70,
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const glow = 0.6 + 0.4 * Math.sin(f / 7);
  const centerSp = spring({
    frame: f - 74,
    fps,
    config: { damping: 16, stiffness: 130 },
  });

  const ticks = Array.from({ length: 24 }, (_, i) => i);
  const dialBox = R + 46;

  return (
    <div
      style={{
        position: "absolute",
        left: cx - dialBox,
        top: cy - dialBox,
        width: dialBox * 2,
        height: dialBox * 2,
        opacity: aOp,
        transform: `scale(${aScale})`,
        transformOrigin: "50% 50%",
      }}
    >
      {/* aro base */}
      <div
        style={{
          position: "absolute",
          inset: 8,
          borderRadius: "50%",
          border: `2px solid ${rgba("#BFE0E6", 0.1)}`,
          boxShadow: `inset 0 0 40px ${rgba(TEAL, 0.12)}`,
        }}
      />
      {/* marcas de hora */}
      <svg
        viewBox={`0 0 ${dialBox * 2} ${dialBox * 2}`}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        {ticks.map((i) => {
          const a = ((i / 24) * 360 - 90) * (Math.PI / 180);
          const isNight = i >= 22 || i <= 5;
          const isHit = i === lockHour;
          const rOuter = R;
          const rInner = i % 6 === 0 ? R - 26 : R - 15;
          const ox = dialBox + Math.cos(a) * rInner;
          const oy = dialBox + Math.sin(a) * rInner;
          const ex = dialBox + Math.cos(a) * rOuter;
          const ey = dialBox + Math.sin(a) * rOuter;
          const nightOn = isNight
            ? interpolate(ignited, [0, 1], [0.22, 1], CLAMP)
            : 0;
          const col = isNight ? GOLD : "rgba(220,235,238,0.2)";
          return (
            <line
              key={i}
              x1={ox}
              y1={oy}
              x2={ex}
              y2={ey}
              stroke={col}
              strokeWidth={isHit ? 7 : i % 6 === 0 ? 5 : 3}
              strokeLinecap="round"
              opacity={isNight ? nightOn : 1}
              style={
                isNight
                  ? {
                      filter: `drop-shadow(0 0 ${
                        (isHit ? 12 : 7) * glow
                      }px ${GOLD})`,
                    }
                  : undefined
              }
            />
          );
        })}
      </svg>

      {/* punto encendido sobre la hora de bloqueo */}
      {(() => {
        const a = targetAng * (Math.PI / 180);
        const px = dialBox + Math.cos(a) * (R + 3);
        const py = dialBox + Math.sin(a) * (R + 3);
        return (
          <div
            style={{
              position: "absolute",
              left: px,
              top: py,
              transform: `translate(-50%,-50%) scale(${ignited})`,
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: GOLD,
              boxShadow: `0 0 ${22 * glow}px 6px ${GOLD}, 0 0 48px ${rgba(
                GOLD,
                0.55
              )}`,
            }}
          />
        );
      })()}

      {/* manecilla */}
      <div
        style={{
          position: "absolute",
          left: dialBox,
          top: dialBox,
          width: R - 24,
          height: 5,
          background: `linear-gradient(90deg, ${rgba(GOLD, 0)}, ${GOLD})`,
          transformOrigin: "0% 50%",
          transform: `rotate(${handAng}deg)`,
          borderRadius: 4,
          boxShadow: `0 0 16px ${rgba(GOLD, 0.7)}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: dialBox,
          top: dialBox,
          transform: "translate(-50%,-50%)",
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: CREAM,
          boxShadow: `0 0 12px ${GOLD}`,
        }}
      />

      {/* centro: 1 HOUR / night */}
      <div
        style={{
          position: "absolute",
          left: dialBox,
          top: dialBox - 4,
          transform: `translate(-50%,-50%) scale(${centerSp})`,
          textAlign: "center",
          fontFamily: FONT_SANS,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontSize: 74,
            fontWeight: 900,
            color: GOLD,
            lineHeight: 0.9,
            textShadow: `0 0 30px ${rgba(GOLD, 0.55)}`,
          }}
        >
          1
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: 6,
            color: CREAM,
            textTransform: "uppercase",
            marginTop: 2,
          }}
        >
          hour
        </div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: 3,
            color: rgba(BRIGHT, 0.85),
            textTransform: "uppercase",
            marginTop: 4,
          }}
        >
          night
        </div>
      </div>
    </div>
  );
};

/* ============================ ETIQUETAS ================================= */

const LabelBlock: React.FC<{
  title: string;
  accentWord: string;
  sub: string;
  accent: string;
  startFrame: number;
  x: string;
  y: string;
}> = ({ title, accentWord, sub, accent, startFrame, x, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - startFrame;

  const s = spring({
    frame: f,
    fps,
    config: { damping: 20, stiffness: 110, mass: 0.8 },
  });
  const o = interpolate(s, [0, 0.5], [0, 1], CLAMP);
  const ty = interpolate(s, [0, 1], [26, 0], CLAMP);
  const blur = Math.max(0, interpolate(s, [0, 1], [8, 0], CLAMP));
  const ruleW = interpolate(s, [0, 1], [0, 84], CLAMP);
  const drift = Math.sin(f * 0.04) * 4;

  // parte antes/después de la palabra en acento
  const parts = title.split(accentWord);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity: o,
        transform: `translateY(${ty + drift}px)`,
        filter: `blur(${blur}px)`,
        fontFamily: FONT_SANS,
      }}
    >
      <div
        style={{
          width: ruleW,
          height: 4,
          borderRadius: 2,
          background: accent,
          boxShadow: `0 0 14px ${rgba(accent, 0.6)}`,
          marginBottom: 18,
        }}
      />
      <div
        style={{
          fontSize: 66,
          fontWeight: 900,
          letterSpacing: "-0.01em",
          lineHeight: 1,
          color: "#FFFFFF",
          textShadow: "0 6px 26px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.7)",
        }}
      >
        {parts[0]}
        <span
          style={{
            color: accent,
            textShadow: `0 0 26px ${rgba(accent, 0.5)}, 0 6px 22px rgba(0,0,0,0.55)`,
          }}
        >
          {accentWord}
        </span>
        {parts[1] ?? ""}
      </div>
      <div
        style={{
          marginTop: 16,
          fontSize: 27,
          fontWeight: 600,
          letterSpacing: "0.01em",
          color: "rgba(240,246,247,0.9)",
          textShadow: "0 3px 14px rgba(0,0,0,0.55)",
        }}
      >
        {sub}
      </div>
    </div>
  );
};

/* =========================== TARJETA DE CIERRE ========================= */

const EndCaption: React.FC<{ text: string; startFrame: number }> = ({
  text,
  startFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - startFrame;

  const s = spring({
    frame: f,
    fps,
    config: { damping: 18, stiffness: 120, mass: 0.8 },
  });
  const o = interpolate(s, [0, 0.5], [0, 1], CLAMP);
  const ty = interpolate(s, [0, 1], [30, 0], CLAMP);
  const float = Math.sin(f * 0.05) * 5;
  const glow = 0.4 + 0.2 * Math.sin(f * 0.08);

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: "8%",
        transform: `translateX(-50%) translateY(${ty + float}px)`,
        opacity: o,
      }}
    >
      <div
        style={{
          padding: "22px 46px",
          borderRadius: 20,
          background: `linear-gradient(180deg, #F7F1E4, ${CREAM})`,
          border: `1px solid ${rgba(GOLD, 0.5)}`,
          boxShadow: `0 26px 70px rgba(2,8,12,0.55), 0 0 46px ${rgba(
            GOLD,
            glow
          )}`,
        }}
      >
        <span
          style={{
            fontFamily: FONT_SANS,
            fontSize: 42,
            fontWeight: 800,
            letterSpacing: "-0.01em",
            color: INK,
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

/* ======================= BARRIDO DORADO (whip) ========================= */

const GoldSweep: React.FC<{ a: number; b: number }> = ({ a, b }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [a, b], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const x = interpolate(p, [0, 1], [-45, 145], CLAMP);
  const op = Math.sin(clamp01(p) * Math.PI);
  return (
    <div
      style={{
        position: "absolute",
        top: "-12%",
        bottom: "-12%",
        width: "48%",
        left: 0,
        transform: `translateX(${x}%) skewX(-14deg)`,
        background: `linear-gradient(100deg, transparent 20%, ${rgba(
          GOLD,
          0.5
        )} 50%, transparent 80%)`,
        mixBlendMode: "screen",
        opacity: op * 0.9,
        pointerEvents: "none",
        zIndex: 45,
      }}
    />
  );
};

/* ============================ ESCENA PRINCIPAL ========================= */

export const WhyNightScene: React.FC<{
  durationInFrames: number;
  // ⚠️ props OPCIONALES con los textos originales (inglés/piel) como default → cero regresión
  // en el canal EN que ya la usa. Sirven para adaptar la escena al tema de CADA video.
  dayTitle?: string;
  nightTitle?: string;
  cardText?: string;
}> = ({
  durationInFrames,
  dayTitle = "DAY — DEFENSE",
  nightTitle = "NIGHT — REPAIR",
  cardText = "flood + seal at the hour your skin rebuilds",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = durationInFrames;

  // ---- fases (fracciones del total) ----
  const tr = interpolate(frame, [d * 0.37, d * 0.57], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const dayOp = 1 - tr;
  const nightOp = tr;
  const whip = Math.sin(clamp01(tr) * Math.PI);

  // anclas de entrada para el contenido de cada fase
  const P2 = Math.round(d * 0.5);
  const DIAL_START = Math.round(d * 0.58);
  const CAP_START = Math.round(d * 0.8);

  // deriva global + push-in cinematográfico
  const driftX = Math.sin(frame * 0.021) * 10;
  const driftY = Math.cos(frame * 0.017) * 8;
  const push = interpolate(frame, [0, d], [1, 1.05], CLAMP);
  const rootScale = push * (1 + whip * 0.03);
  const rootBlur = whip * 5;

  // sol se hunde, luna sube durante la transición
  const sunSink = interpolate(tr, [0, 1], [0, 140], CLAMP);
  const moonRise = interpolate(tr, [0, 1], [170, 0], CLAMP);

  // motes / estrellas
  const dayDust = React.useMemo(
    () => makeMotes(10, 0x0d, 2, 5, 0.01, 0.03, 0.06, 0.16),
    []
  );
  const stars = React.useMemo(
    () => makeMotes(46, 0x57a, 1.5, 4.5, 0.004, 0.014, 0.28, 0.85),
    []
  );
  const nightMid = React.useMemo(
    () => makeMotes(12, 0x1d, 2, 5.5, 0.02, 0.06, 0.24, 0.5),
    []
  );
  const bokeh = React.useMemo(
    () => makeMotes(4, 0xb0, 90, 200, 0.006, 0.016, 0.05, 0.1),
    []
  );

  // fondos día / noche
  const dayBg = [
    `radial-gradient(58% 55% at 17% 20%, ${rgba(SUN, 0.32)} 0%, ${rgba(
      SUN,
      0.08
    )} 34%, transparent 60%)`,
    "radial-gradient(120% 110% at 22% 18%, rgba(122,152,160,0.28) 0%, transparent 60%)",
    "linear-gradient(160deg, #2b4650 0%, #21393f 46%, #16272c 100%)",
  ].join(", ");
  const nightBg = [
    `radial-gradient(66% 58% at 82% 20%, ${rgba(BRIGHT, 0.12)} 0%, transparent 58%)`,
    `radial-gradient(90% 80% at 50% 102%, ${rgba(TEAL, 0.18)} 0%, transparent 60%)`,
    `linear-gradient(160deg, ${NIGHT_2} 0%, ${NIGHT_1} 55%, #06121a 100%)`,
  ].join(", ");

  // fades globales de entrada / salida
  const fadeIn = interpolate(
    frame,
    [0, Math.max(1, Math.round(0.4 * fps))],
    [1, 0],
    CLAMP
  );
  const foS = Math.max(0, d - Math.round(0.5 * fps));
  const fadeOut = interpolate(
    frame,
    [foS, Math.max(foS + 1, d - 1)],
    [0, 1],
    CLAMP
  );

  return (
    <AbsoluteFill style={{ background: NIGHT_1, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${rootScale})`,
          filter: `blur(${rootBlur.toFixed(2)}px)`,
          willChange: "transform, filter",
        }}
      >
        {/* === FONDOS (crossfade día→noche) === */}
        <AbsoluteFill style={{ background: dayBg, opacity: dayOp }} />
        <AbsoluteFill style={{ background: nightBg, opacity: nightOp }} />

        {/* === PHASE 1 · DÍA / DEFENSA === */}
        <div style={{ position: "absolute", inset: 0, opacity: dayOp }}>
          {/* sol (capa lejana) */}
          <ParallaxLayer factor={0.25} z={2} px={driftX} py={driftY}>
            <div
              style={{
                position: "absolute",
                left: "6%",
                top: "8%",
                transform: `translateY(${sunSink}px)`,
              }}
            >
              <Sun />
            </div>
          </ParallaxLayer>

          {/* polvo diurno */}
          <ParallaxLayer factor={0.4} z={3} px={driftX} py={driftY}>
            <MotesLayer motes={dayDust} blur={1.4} tint="232, 205, 150" />
          </ParallaxLayer>

          {/* piel = escudo (capa media) */}
          <ParallaxLayer factor={0.55} z={4} px={driftX} py={driftY}>
            <ShieldDefense startFrame={4} />
          </ParallaxLayer>

          {/* etiqueta (capa cercana) */}
          <ParallaxLayer factor={0.85} z={7} px={driftX} py={driftY}>
            <LabelBlock
              title={dayTitle}
              accentWord="DEFENSE"
              sub="fights sun + pollution · loses water · builds nothing"
              accent={SUN}
              startFrame={10}
              x="7%"
              y="66%"
            />
          </ParallaxLayer>
        </div>

        {/* === PHASE 2 · NOCHE / REPARACIÓN === */}
        <div style={{ position: "absolute", inset: 0, opacity: nightOp }}>
          {/* estrellas (fondo lejano) */}
          <ParallaxLayer factor={0.2} z={2} px={driftX} py={driftY}>
            <MotesLayer motes={stars} blur={0} tint="243, 236, 221" />
          </ParallaxLayer>

          {/* luna (capa lejana) */}
          <ParallaxLayer factor={0.28} z={3} px={driftX} py={driftY}>
            <div
              style={{
                position: "absolute",
                right: "6%",
                top: "9%",
                transform: `translateY(${moonRise}px)`,
              }}
            >
              <Moon />
            </div>
          </ParallaxLayer>

          {/* motas medias */}
          <ParallaxLayer factor={0.4} z={4} px={driftX} py={driftY}>
            <MotesLayer motes={nightMid} blur={1.5} tint="63, 224, 214" />
          </ParallaxLayer>

          {/* piel que se reconstruye (capa media) */}
          <ParallaxLayer factor={0.5} z={5} px={driftX} py={driftY}>
            <SkinRepair startFrame={P2} />
          </ParallaxLayer>

          {/* reloj de 24h (capa un poco más cercana) */}
          <ParallaxLayer factor={0.65} z={6} px={driftX} py={driftY}>
            <HourDial24 startFrame={DIAL_START} cx={1470} cy={556} R={168} />
          </ParallaxLayer>

          {/* etiqueta (capa cercana) */}
          <ParallaxLayer factor={0.85} z={7} px={driftX} py={driftY}>
            <LabelBlock
              title={nightTitle}
              accentWord="REPAIR"
              sub="cell turnover peaks · barrier rebuilds · water escapes fastest"
              accent={BRIGHT}
              startFrame={P2 + 6}
              x="7%"
              y="12%"
            />
          </ParallaxLayer>

          {/* bokeh gigante al frente */}
          <ParallaxLayer factor={1.1} z={8} px={driftX} py={driftY}>
            <MotesLayer motes={bokeh} blur={9} tint="63, 224, 214" />
          </ParallaxLayer>

          {/* tarjeta de cierre (lo más cercano) */}
          <ParallaxLayer factor={0.9} z={9} px={driftX} py={driftY}>
            <EndCaption
              text={cardText}
              startFrame={CAP_START}
            />
          </ParallaxLayer>
        </div>

        {/* barrido dorado del whip */}
        <GoldSweep a={d * 0.39} b={d * 0.56} />

        {/* viñeta global suave (unifica) */}
        <AbsoluteFill
          style={{
            zIndex: 40,
            pointerEvents: "none",
            background:
              "radial-gradient(125% 105% at 50% 46%, transparent 60%, rgba(1, 6, 10, 0.42) 100%)",
          }}
        />
      </AbsoluteFill>

      {/* grano de película */}
      <GrainOverlay />

      {/* fade in / out global */}
      <AbsoluteFill
        style={{
          zIndex: 70,
          background: NIGHT_1,
          opacity: Math.max(fadeIn, fadeOut),
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

export default WhyNightScene;

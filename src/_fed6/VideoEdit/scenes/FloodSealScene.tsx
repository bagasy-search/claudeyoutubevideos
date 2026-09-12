import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/* ============================================================================
 * FloodSealScene — el MECANISMO (agua primero, después la tapa) · Dr. Federer
 * ----------------------------------------------------------------------------
 * Corte transversal de piel (vista lateral) animado:
 *   FASE 1 · FLOOD  — el ALOE inunda de agua la dermis: gotas azules caen por
 *                     el techo, la malla de colágeno se HINCHA y brilla, y los
 *                     fibroblastos (la fábrica) DESPIERTAN y brotan fibras.
 *   FASE 2 · SEAL+GUARD — un film de aceite dorado SELLA la superficie (barrido
 *                     de luz) y queda como tapa: las partículas de agua REBOTAN
 *                     en vez de escapar. Escudos dorados DESVÍAN las flechas
 *                     rojas (enzimas) que rompen el colágeno.
 *   FIN · un subrayado dorado se dibuja bajo "water first — then the lid".
 *
 * Profundidad tipo FedererFluid pero AUTOCONTENIDO: capas en distinto z de
 * parallax, drift suave, motas, grano. Nada queda quieto.
 * 1920x1080 @ 30fps. Todo el timing sale de durationInFrames (fracciones).
 * ========================================================================== */

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const TAU = Math.PI * 2;

/* --------------------------------- paleta -------------------------------- */
const BG_HI = "#0E1D23";
const BG_LO = "#0A171C";
const TEAL = "#12B3AE";
const TEAL_BRIGHT = "#3FE0D6";
const GOLD = "#E8B96B";
const CREAM = "#F3ECDD";
const INK = "#10242A";
const RED = "#D6584A";

/* ------------------------------- geometría ------------------------------- */
const CS_LEFT = 250;
const CS_RIGHT = 1670;
const ROOF_TOP = 300;
const ROOF_BOT = 372;
const DERMIS_TOP = 372;
const DERMIS_BOT = 858;
const SRC = { x: 470, y: 262 }; // origen del aloe (punta de la hoja / base de la card)

/* ------------------------------- utilidades ------------------------------ */
const mod = (n: number, m: number): number => ((n % m) + m) % m;

const rgba = (hex: string, alpha: number): string => {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = Number.parseInt(full, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

// PRNG determinista (nunca Math.random)
const mulberry32 = (seed: number): (() => number) => {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

type Phases = {
  total: number;
  introEnd: number;
  floodA: number;
  floodB: number;
  sealA: number;
  sealB: number;
  guardA: number;
  guardB: number;
  endA: number;
};

/* =============================== PARALLAX =============================== */
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
      transform: `translate(${(px * factor).toFixed(2)}px, ${(py * factor).toFixed(2)}px)`,
      willChange: "transform",
    }}
  >
    {children}
  </div>
);

/* =============================== MOTAS ================================= */
type Mote = { x: number; y0: number; size: number; speed: number; phase: number; opacity: number };

const makeMotes = (count: number, seed: number): Mote[] => {
  const r = mulberry32(seed);
  return new Array(count).fill(0).map(() => ({
    x: r() * 100,
    y0: r(),
    size: 2 + r() * 7,
    speed: 0.02 + r() * 0.07,
    phase: r() * TAU,
    opacity: 0.08 + r() * 0.4,
  }));
};

const MotesLayer: React.FC<{ motes: Mote[]; blur: number; tint: string }> = ({ motes, blur, tint }) => {
  const frame = useCurrentFrame();
  const RANGE = 118;
  return (
    <AbsoluteFill style={{ filter: `blur(${blur}px)`, pointerEvents: "none" }}>
      {motes.map((m, i) => {
        const y = mod(m.y0 * RANGE - frame * m.speed, RANGE) - 9;
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
              background: rgba(tint, m.opacity * tw),
              boxShadow: `0 0 ${m.size * 2.2}px ${m.size * 0.55}px ${rgba(tint, m.opacity * 0.5 * tw)}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* =============================== GRANO ================================= */
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
    <filter id="fsGrain">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
    </filter>
    <rect width="100%" height="100%" filter="url(#fsGrain)" />
  </svg>
);

/* ===================== CORTE TRANSVERSAL (piel) ======================= */
type FiberSpec = { baseY: number; amp: number; waves: number; phase: number; drift: number };

const CrossSection: React.FC<{ plumpP: number; wakeP: number; ph: Phases }> = ({ plumpP, wakeP, ph }) => {
  const frame = useCurrentFrame();

  // reveal de entrada
  const reveal = interpolate(frame, [0, ph.introEnd], [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const revY = interpolate(reveal, [0, 1], [40, 0], CLAMP);

  // fibras de colágeno (geometría base memoizada; la forma se arma por-frame)
  const fibers = React.useMemo<FiberSpec[]>(() => {
    const r = mulberry32(9137);
    const N = 11;
    return new Array(N).fill(0).map((_, i) => ({
      baseY: lerp(DERMIS_TOP + 46, DERMIS_BOT - 44, i / (N - 1)),
      amp: 9 + r() * 15,
      waves: 2 + Math.floor(r() * 3),
      phase: r() * TAU,
      drift: 0.4 + r() * 0.5,
    }));
  }, []);

  const cross = React.useMemo(() => {
    const r = mulberry32(5521);
    const lines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
    for (let i = 0; i < 7; i++) {
      const x = lerp(CS_LEFT + 120, CS_RIGHT - 120, r());
      const y1 = lerp(DERMIS_TOP + 30, DERMIS_TOP + 200, r());
      const y2 = lerp(DERMIS_BOT - 200, DERMIS_BOT - 30, r());
      const dx = (r() - 0.5) * 220;
      lines.push({ x1: x, y1, x2: x + dx, y2 });
    }
    return lines;
  }, []);

  // fibroblastos ("la fábrica")
  const cells = React.useMemo(() => {
    const r = mulberry32(3301);
    return new Array(5).fill(0).map((_, i) => ({
      x: lerp(CS_LEFT + 190, CS_RIGHT - 190, (i + 0.5) / 5 + (r() - 0.5) * 0.08),
      y: lerp(DERMIS_TOP + 120, DERMIS_BOT - 120, r()),
      wake0: 0.1 + (i / 5) * 0.55,
      sprouts: new Array(3).fill(0).map((__, k) => ({
        ang: -TAU * 0.25 + (k - 1) * 0.7 + (r() - 0.5) * 0.4,
        len: 34 + r() * 26,
        delay: 0.05 * k + r() * 0.06,
      })),
    }));
  }, []);

  const buildFiber = (f: FiberSpec): string => {
    const N = 26;
    const ampNow = f.amp * (1 + 0.28 * plumpP);
    const bob = Math.sin(frame * 0.03 * f.drift + f.phase) * (1 + plumpP);
    const pts: string[] = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const x = lerp(CS_LEFT + 34, CS_RIGHT - 34, t);
      const y =
        f.baseY +
        Math.sin(t * TAU * f.waves + f.phase + frame * 0.02 * f.drift) * ampNow +
        bob;
      pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return "M " + pts.join(" L ");
  };

  const dermisMidY = (DERMIS_TOP + DERMIS_BOT) / 2;
  const fiberStroke = 2 + 2.4 * plumpP;
  const fiberOp = 0.32 + 0.6 * plumpP;
  const meshGlow = plumpP * 0.9;

  return (
    <svg
      viewBox="0 0 1920 1080"
      style={{ width: "100%", height: "100%", overflow: "visible", opacity: reveal, transform: `translateY(${revY}px)` }}
    >
      <defs>
        <linearGradient id="fsRoof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c3a41" />
          <stop offset="1" stopColor="#122a30" />
        </linearGradient>
        <linearGradient id="fsDermis" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={rgba(TEAL, 0.1)} />
          <stop offset="1" stopColor={rgba("#061215", 0.0)} />
        </linearGradient>
      </defs>

      {/* DERMIS: fondo + wash de agua que sube con el flood */}
      <rect x={CS_LEFT} y={DERMIS_TOP} width={CS_RIGHT - CS_LEFT} height={DERMIS_BOT - DERMIS_TOP} rx={26} fill="url(#fsDermis)" opacity={0.6} />
      <rect
        x={CS_LEFT}
        y={DERMIS_TOP}
        width={CS_RIGHT - CS_LEFT}
        height={DERMIS_BOT - DERMIS_TOP}
        rx={26}
        fill={rgba(TEAL_BRIGHT, 0.16 * plumpP)}
      />
      <rect x={CS_LEFT} y={DERMIS_TOP} width={CS_RIGHT - CS_LEFT} height={DERMIS_BOT - DERMIS_TOP} rx={26} fill="none" stroke={rgba(TEAL, 0.28)} strokeWidth={1.5} />

      {/* malla de colágeno (se hincha y brilla) */}
      <g style={{ filter: `drop-shadow(0 0 ${8 + 14 * meshGlow}px ${rgba(TEAL_BRIGHT, meshGlow)})` }}>
        {cross.map((l, i) => {
          const wob = Math.sin(frame * 0.025 + i) * (2 + plumpP * 3);
          return (
            <line
              key={`x${i}`}
              x1={l.x1 + wob}
              y1={l.y1}
              x2={l.x2 - wob}
              y2={l.y2}
              stroke={rgba(TEAL, fiberOp * 0.7)}
              strokeWidth={fiberStroke * 0.7}
              strokeLinecap="round"
            />
          );
        })}
        {fibers.map((f, i) => (
          <path
            key={`f${i}`}
            d={buildFiber(f)}
            fill="none"
            stroke={i % 2 === 0 ? TEAL_BRIGHT : TEAL}
            strokeWidth={fiberStroke}
            strokeLinecap="round"
            opacity={fiberOp}
          />
        ))}
      </g>

      {/* fibroblastos: despiertan y brotan fibras nuevas */}
      {cells.map((c, i) => {
        const wake = interpolate(wakeP, [c.wake0, c.wake0 + 0.22], [0, 1], CLAMP);
        const pulse = 1 + 0.14 * wake * Math.sin(frame * 0.2 + i * 1.3);
        const rCore = (10 + 6 * wake) * pulse;
        const col = `rgb(${Math.round(lerp(70, 63, wake))}, ${Math.round(lerp(120, 224, wake))}, ${Math.round(lerp(120, 214, wake))})`;
        return (
          <g key={`c${i}`}>
            <circle cx={c.x} cy={c.y} r={rCore * 2.4} fill={rgba(TEAL_BRIGHT, 0.16 * wake)} />
            {c.sprouts.map((s, k) => {
              const g = interpolate(wake, [s.delay, 1], [0, 1], CLAMP);
              const sway = Math.sin(frame * 0.06 + k + i) * 0.12;
              const ex = c.x + Math.cos(s.ang + sway) * s.len * g;
              const ey = c.y + Math.sin(s.ang + sway) * s.len * g;
              return <line key={k} x1={c.x} y1={c.y} x2={ex} y2={ey} stroke={TEAL_BRIGHT} strokeWidth={2.4} strokeLinecap="round" opacity={0.85 * g} />;
            })}
            <circle cx={c.x} cy={c.y} r={rCore} fill={col} stroke={rgba(TEAL_BRIGHT, 0.9 * wake)} strokeWidth={1.5} style={{ filter: `drop-shadow(0 0 ${10 * wake}px ${rgba(TEAL_BRIGHT, wake)})` }} />
            <circle cx={c.x - rCore * 0.3} cy={c.y - rCore * 0.3} r={rCore * 0.28} fill={rgba("#ffffff", 0.55 * wake)} />
          </g>
        );
      })}

      {/* SUPERFICIE: techo de células muertas */}
      <rect x={CS_LEFT} y={ROOF_TOP} width={CS_RIGHT - CS_LEFT} height={ROOF_BOT - ROOF_TOP} rx={12} fill="url(#fsRoof)" stroke={rgba("#2a4a52", 0.9)} strokeWidth={1.5} />
      {new Array(22).fill(0).map((_, i) => {
        const x = lerp(CS_LEFT + 20, CS_RIGHT - 20, i / 21);
        return <rect key={i} x={x - 22} y={ROOF_TOP + 6} width={44} height={ROOF_BOT - ROOF_TOP - 12} rx={9} fill="none" stroke={rgba("#3a5b63", 0.55)} strokeWidth={1.4} />;
      })}
      <line x1={CS_LEFT} y1={DERMIS_TOP} x2={CS_RIGHT} y2={DERMIS_TOP} stroke={rgba(TEAL, 0.35)} strokeWidth={1.2} strokeDasharray="7 9" />

      {/* etiquetas */}
      <g opacity={interpolate(frame, [ph.introEnd * 0.5, ph.introEnd + 8], [0, 1], CLAMP)}>
        <line x1={CS_RIGHT - 4} y1={ROOF_TOP + 18} x2={CS_RIGHT + 92} y2={ROOF_TOP + 18} stroke={rgba("#8fb2b8", 0.6)} strokeWidth={1.4} />
        <text x={CS_RIGHT + 100} y={ROOF_TOP + 12} fill="#cfe6e9" fontSize={22} fontFamily="Inter, Arial, sans-serif" fontWeight={700} letterSpacing="0.06em">SURFACE</text>
        <text x={CS_RIGHT + 100} y={ROOF_TOP + 40} fill={rgba("#9fc0c5", 0.85)} fontSize={17} fontFamily="Inter, Arial, sans-serif">dead-cell roof</text>
        <line x1={CS_LEFT + 4} y1={dermisMidY} x2={CS_LEFT - 92} y2={dermisMidY} stroke={rgba(TEAL, 0.6)} strokeWidth={1.4} />
        <text x={CS_LEFT - 100} y={dermisMidY - 6} textAnchor="end" fill="#d9f2f0" fontSize={22} fontFamily="Inter, Arial, sans-serif" fontWeight={700} letterSpacing="0.06em">DERMIS</text>
        <text x={CS_LEFT - 100} y={dermisMidY + 22} textAnchor="end" fill={rgba(TEAL_BRIGHT, 0.85)} fontSize={17} fontFamily="Inter, Arial, sans-serif">where the cushion lives</text>
      </g>
    </svg>
  );
};

/* ===================== FASE 1 · GOTAS DE AGUA (aloe) ================== */
const Droplets: React.FC<{ ph: Phases }> = ({ ph }) => {
  const frame = useCurrentFrame();
  const floodLocal = interpolate(frame, [ph.floodA, ph.floodB], [0, 1], CLAMP);

  const drops = React.useMemo(() => {
    const r = mulberry32(7717);
    return new Array(26).fill(0).map(() => ({
      sx: SRC.x + (r() - 0.5) * 150,
      tx: lerp(CS_LEFT + 120, CS_RIGHT - 120, r()),
      ty: lerp(DERMIS_TOP + 90, DERMIS_BOT - 90, r()),
      t0: r() * 0.72,
      dur: 0.24 + r() * 0.16,
      size: 6 + r() * 6,
      wob: (r() - 0.5) * 40,
    }));
  }, []);

  if (floodLocal <= 0 || floodLocal >= 1) return null;

  return (
    <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%", overflow: "visible" }}>
      {drops.map((d, i) => {
        const lp = interpolate(floodLocal, [d.t0, d.t0 + d.dur], [0, 1], CLAMP);
        if (lp <= 0 || lp >= 1) return null;
        const fall = Easing.in(Easing.quad)(lp);
        const y = lerp(SRC.y, d.ty, fall);
        const x = lerp(d.sx, d.tx, lp) + Math.sin(lp * 6 + i) * d.wob * (1 - lp);
        const op = interpolate(lp, [0, 0.12, 0.78, 1], [0, 1, 1, 0], CLAMP);
        const stretch = 1 + Math.min(0.8, lp * 1.2);
        return (
          <g key={i} opacity={op} style={{ filter: `drop-shadow(0 0 8px ${rgba(TEAL_BRIGHT, 0.7)})` }}>
            <ellipse cx={x} cy={y} rx={d.size * 0.8} ry={d.size * stretch} fill={TEAL_BRIGHT} />
            <ellipse cx={x - d.size * 0.22} cy={y - d.size * 0.3} rx={d.size * 0.22} ry={d.size * 0.32} fill={rgba("#ffffff", 0.7)} />
          </g>
        );
      })}
    </svg>
  );
};

/* ===================== FUENTE: hoja de aloe / card ==================== */
const AloeSource: React.FC<{ ph: Phases; aloeImg?: string }> = ({ ph, aloeImg }) => {
  const frame = useCurrentFrame();
  const appear = interpolate(frame, [ph.introEnd * 0.4, ph.introEnd + 10], [0, 1], CLAMP);
  const fade = interpolate(frame, [ph.floodB - 10, ph.floodB + 12], [0, 1], CLAMP);
  const op = appear * (1 - fade);
  if (op <= 0.001) return null;
  const sway = Math.sin(frame * 0.05) * 1.4;
  const bob = Math.sin(frame * 0.07) * 6;

  if (aloeImg) {
    return (
      <div
        style={{
          position: "absolute",
          left: 300,
          top: 70,
          width: 240,
          opacity: op,
          transform: `translateY(${bob}px) rotate(${sway * 0.5}deg)`,
        }}
      >
        <div style={{ position: "absolute", inset: "-18%", background: `radial-gradient(50% 50% at 50% 50%, ${rgba(TEAL_BRIGHT, 0.32)}, transparent 70%)`, filter: "blur(18px)" }} />
        <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", border: `1px solid ${rgba(TEAL_BRIGHT, 0.4)}`, background: "#08161a", aspectRatio: "3 / 2", boxShadow: "0 24px 60px rgba(0,0,0,0.55)" }}>
          <Img src={staticFile(aloeImg)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
      </div>
    );
  }

  return (
    <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%", overflow: "visible", opacity: op }}>
      <defs>
        <linearGradient id="fsAloe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2fbf9a" />
          <stop offset="1" stopColor="#12857f" />
        </linearGradient>
      </defs>
      <g transform={`translate(${SRC.x} ${SRC.y - 6}) rotate(${sway}) translate(${-SRC.x} ${-SRC.y + 6 + bob})`} style={{ filter: `drop-shadow(0 0 22px ${rgba(TEAL_BRIGHT, 0.35)})` }}>
        {[-1, 0.15, 1].map((k, i) => (
          <path
            key={i}
            d={`M ${SRC.x} ${SRC.y - 150} C ${SRC.x - 46 + k * 40} ${SRC.y - 40}, ${SRC.x - 30 + k * 60} ${SRC.y + 60}, ${SRC.x + k * 34} ${SRC.y + 96} C ${SRC.x + 34 + k * 60} ${SRC.y + 50}, ${SRC.x + 44 + k * 40} ${SRC.y - 60}, ${SRC.x} ${SRC.y - 150} Z`}
            fill="url(#fsAloe)"
            opacity={0.9 - Math.abs(k) * 0.18}
            stroke={rgba("#bff0e2", 0.5)}
            strokeWidth={1.5}
          />
        ))}
        <line x1={SRC.x} y1={SRC.y - 130} x2={SRC.x} y2={SRC.y + 80} stroke={rgba("#d6fff2", 0.35)} strokeWidth={2} />
      </g>
    </svg>
  );
};

/* ===================== FASE 2 · TAPA DE ACEITE (sella) ================ */
const OilLid: React.FC<{ ph: Phases }> = ({ ph }) => {
  const frame = useCurrentFrame();
  const lidIn = interpolate(frame, [ph.sealA, ph.sealA + (ph.sealB - ph.sealA) * 0.6], [0, 1], CLAMP);
  if (lidIn <= 0.001) return null;
  const sweepX = interpolate(frame, [ph.sealA, ph.sealB], [-40, 140], CLAMP);
  const shimmer = 0.5 + 0.5 * Math.sin(frame * 0.08);
  const lidY = ROOF_TOP - 10;
  const lidH = ROOF_BOT - ROOF_TOP + 22;

  return (
    <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%", overflow: "visible" }}>
      <defs>
        <linearGradient id="fsOil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={rgba(GOLD, 0.0)} />
          <stop offset="0.5" stopColor={rgba(GOLD, 0.55)} />
          <stop offset="1" stopColor={rgba("#c79a4e", 0.35)} />
        </linearGradient>
        <clipPath id="fsLidClip">
          <rect x={CS_LEFT} y={lidY} width={CS_RIGHT - CS_LEFT} height={lidH} rx={12} />
        </clipPath>
      </defs>
      <g clipPath="url(#fsLidClip)" opacity={lidIn}>
        <rect x={CS_LEFT} y={lidY} width={CS_RIGHT - CS_LEFT} height={lidH} fill="url(#fsOil)" />
        {/* barrido de luz que corre y deja la tapa */}
        <rect x={`${sweepX - 18}%`} y={lidY} width="16%" height={lidH} fill={rgba("#fff2d0", 0.5)} transform="skewX(-16)" style={{ mixBlendMode: "screen" }} />
      </g>
      {/* borde superior con brillo (la tapa asentada) */}
      <line x1={CS_LEFT} y1={lidY + 2} x2={CS_RIGHT} y2={lidY + 2} stroke={rgba("#ffe6ad", 0.4 + 0.5 * shimmer * lidIn)} strokeWidth={2.4} style={{ filter: `drop-shadow(0 0 8px ${rgba(GOLD, 0.7 * lidIn)})` }} />
    </svg>
  );
};

/* --------- partículas de agua que REBOTAN en la tapa (fase 2) --------- */
const BounceParticles: React.FC<{ ph: Phases }> = ({ ph }) => {
  const frame = useCurrentFrame();
  const winA = ph.sealA + (ph.sealB - ph.sealA) * 0.45;
  const winB = ph.guardB;
  const on = interpolate(frame, [winA, winA + 8, winB - 14, winB], [0, 1, 1, 0], CLAMP);

  // ⚠️ hooks SIEMPRE antes de cualquier return condicional (React error #310)
  const parts = React.useMemo(() => {
    const r = mulberry32(6203);
    return new Array(9).fill(0).map(() => ({
      x: lerp(CS_LEFT + 120, CS_RIGHT - 120, r()),
      y0: lerp(DERMIS_TOP + 220, DERMIS_TOP + 420, r()),
      t0: r(),
      dur: 0.5 + r() * 0.4,
      size: 5 + r() * 4,
    }));
  }, []);

  if (on <= 0.001) return null;

  const lidY = ROOF_BOT + 6;
  const span = winB - winA;

  return (
    <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%", overflow: "visible", opacity: on }}>
      {parts.map((p, i) => {
        const cyc = mod((frame - winA) / (span * p.dur) + p.t0, 1);
        const up = cyc < 0.5 ? cyc / 0.5 : 1 - (cyc - 0.5) / 0.5;
        const y = lerp(p.y0, lidY, Easing.out(Easing.quad)(up));
        const hitting = cyc > 0.44 && cyc < 0.56;
        return (
          <g key={i}>
            <circle cx={p.x} cy={y} r={p.size} fill={TEAL_BRIGHT} opacity={0.85} style={{ filter: `drop-shadow(0 0 6px ${rgba(TEAL_BRIGHT, 0.7)})` }} />
            {hitting ? <circle cx={p.x} cy={lidY - 2} r={p.size * (2 + (cyc - 0.44) * 30)} fill="none" stroke={rgba(GOLD, 0.6 * (0.56 - cyc) * 8)} strokeWidth={2} /> : null}
          </g>
        );
      })}
    </svg>
  );
};

/* ===================== FASE 2 · ESCUDOS + ENZIMAS ===================== */
type Vec = { x: number; y: number };
const SHIELDS: Vec[] = [
  { x: 560, y: 560 },
  { x: 900, y: 640 },
  { x: 1240, y: 560 },
  { x: 1500, y: 650 },
];

const ShieldsAndEnzymes: React.FC<{ ph: Phases }> = ({ ph }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const guardLocal = interpolate(frame, [ph.guardA, ph.guardB], [0, 1], CLAMP);
  const winOut = interpolate(frame, [ph.guardB - 12, ph.guardB], [0, 1], CLAMP);

  // eventos de flecha (enzimas) — 6 disparos escalonados sobre 4 escudos
  // ⚠️ hooks SIEMPRE antes de cualquier return condicional (React error #310)
  const events = React.useMemo(() => {
    const r = mulberry32(4127);
    return new Array(6).fill(0).map((_, i) => {
      const sIdx = i % SHIELDS.length;
      const ang = Math.PI * 0.5 + (r() - 0.5) * 1.7 + (i % 2 === 0 ? 0.3 : -0.3); // hacia arriba/adentro
      return { sIdx, t0: (i / 6) * 0.72, dur: 0.34, ang, spread: 0.35 + r() * 0.2 };
    });
  }, []);

  if (guardLocal <= 0 || winOut >= 1) return null;

  const contactSpark = (t: number): number => interpolate(t, [0.4, 0.46, 0.56], [0, 1, 0], CLAMP);

  return (
    <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%", overflow: "visible", opacity: 1 - winOut }}>
      <defs>
        <linearGradient id="fsShield" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd98f" />
          <stop offset="1" stopColor={GOLD} />
        </linearGradient>
      </defs>

      {/* flechas rojas que se acercan y REBOTAN en el escudo */}
      {events.map((e, i) => {
        const t = interpolate(guardLocal, [e.t0, e.t0 + e.dur], [0, 1], CLAMP);
        if (t <= 0 || t >= 1) return null;
        const C = SHIELDS[e.sIdx];
        const dir: Vec = { x: Math.cos(e.ang), y: -Math.abs(Math.sin(e.ang)) }; // apunta hacia arriba
        const startDist = 340;
        const S: Vec = { x: C.x - dir.x * startDist, y: C.y - dir.y * startDist };
        // normal del escudo inclinada → rebote lateral
        const nAng = Math.atan2(-dir.y, -dir.x) + e.spread;
        const n: Vec = { x: Math.cos(nAng), y: Math.sin(nAng) };
        const dot = dir.x * n.x + dir.y * n.y;
        const refl: Vec = { x: dir.x - 2 * dot * n.x, y: dir.y - 2 * dot * n.y };
        const O: Vec = { x: C.x + refl.x * 300, y: C.y + refl.y * 300 };

        let tip: Vec;
        let vel: Vec;
        if (t < 0.46) {
          const k = Easing.in(Easing.quad)(t / 0.46);
          tip = { x: lerp(S.x, C.x, k), y: lerp(S.y, C.y, k) };
          vel = dir;
        } else {
          const k = Easing.out(Easing.quad)((t - 0.46) / 0.54);
          tip = { x: lerp(C.x, O.x, k), y: lerp(C.y, O.y, k) };
          vel = refl;
        }
        const fade = interpolate(t, [0, 0.08, 0.85, 1], [0, 1, 1, 0], CLAMP);
        const a = Math.atan2(vel.y, vel.x);
        const tail: Vec = { x: tip.x - Math.cos(a) * 46, y: tip.y - Math.sin(a) * 46 };
        const hx = Math.cos(a), hy = Math.sin(a);
        const px = -hy, py = hx;
        const head = `M ${tip.x} ${tip.y} L ${tip.x - hx * 22 + px * 10} ${tip.y - hy * 22 + py * 10} L ${tip.x - hx * 22 - px * 10} ${tip.y - hy * 22 - py * 10} Z`;
        const spark = contactSpark(t);
        return (
          <g key={i} opacity={fade} style={{ filter: `drop-shadow(0 0 6px ${rgba(RED, 0.6)})` }}>
            <line x1={tail.x} y1={tail.y} x2={tip.x} y2={tip.y} stroke={RED} strokeWidth={5} strokeLinecap="round" />
            <path d={head} fill={RED} />
            {spark > 0 ? <circle cx={C.x} cy={C.y - 6} r={10 + spark * 26} fill="none" stroke={rgba(GOLD, 0.8 * spark)} strokeWidth={3} /> : null}
          </g>
        );
      })}

      {/* escudos dorados sobre la malla */}
      {SHIELDS.map((s, i) => {
        const pop = spring({ frame: frame - Math.round(ph.guardA) - i * 4, fps, config: { damping: 15, stiffness: 140, mass: 0.7 } });
        if (pop <= 0.001) return null;
        const sc = interpolate(pop, [0, 1], [0.4, 1], CLAMP) * (1 + 0.04 * Math.sin(frame * 0.1 + i));
        const bob = Math.sin(frame * 0.06 + i) * 4;
        const W = 44;
        const d = `M ${s.x} ${s.y - W} L ${s.x + W * 0.82} ${s.y - W * 0.5} L ${s.x + W * 0.82} ${s.y + W * 0.25} Q ${s.x + W * 0.82} ${s.y + W * 0.9} ${s.x} ${s.y + W * 1.15} Q ${s.x - W * 0.82} ${s.y + W * 0.9} ${s.x - W * 0.82} ${s.y + W * 0.25} L ${s.x - W * 0.82} ${s.y - W * 0.5} Z`;
        return (
          <g key={i} opacity={pop} transform={`translate(0 ${bob}) scale(${sc})`} transform-origin={`${s.x}px ${s.y}px`} style={{ transformOrigin: `${s.x}px ${s.y}px`, filter: `drop-shadow(0 0 14px ${rgba(GOLD, 0.6)})` }}>
            <path d={d} fill="url(#fsShield)" stroke={rgba("#fff2cf", 0.85)} strokeWidth={2} />
            <path d={`M ${s.x} ${s.y - W * 0.5} L ${s.x} ${s.y + W * 0.6}`} stroke={rgba("#fff6df", 0.7)} strokeWidth={2.4} />
            <path d={`M ${s.x - W * 0.4} ${s.y} L ${s.x + W * 0.4} ${s.y}`} stroke={rgba("#fff6df", 0.7)} strokeWidth={2.4} />
          </g>
        );
      })}
    </svg>
  );
};

/* ===================== CARDS DE SUBTÍTULO (cream) ===================== */
const CaptionCard: React.FC<{
  a: number;
  b: number;
  head: string;
  body: string;
  accent: string;
  leftPct: number;
  yPct: number;
  anchor: "top" | "bottom";
}> = ({ a, b, head, body, accent, leftPct, yPct, anchor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inP = spring({ frame: frame - a, fps, config: { damping: 18, stiffness: 120, mass: 0.8 } });
  const out = interpolate(frame, [b - 10, b], [0, 1], CLAMP);
  const op = interpolate(inP, [0, 1], [0, 1], CLAMP) * (1 - out);
  if (op <= 0.001) return null;
  const y = interpolate(inP, [0, 1], [26, 0], CLAMP) + out * 18;
  const pos: React.CSSProperties = anchor === "top" ? { top: `${yPct}%` } : { bottom: `${yPct}%` };

  return (
    <div
      style={{
        position: "absolute",
        left: `${leftPct}%`,
        ...pos,
        transform: `translateX(-50%) translateY(${y}px)`,
        opacity: op,
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "18px 30px",
        borderRadius: 18,
        background: `linear-gradient(180deg, ${CREAM}, #e7ddc7)`,
        boxShadow: "0 26px 64px rgba(0,0,0,0.5)",
        border: `1px solid ${rgba(accent, 0.5)}`,
        maxWidth: 900,
        willChange: "transform, opacity",
      }}
    >
      <span style={{ width: 12, height: 12, borderRadius: "50%", background: accent, boxShadow: `0 0 14px ${rgba(accent, 0.9)}`, flex: "0 0 auto" }} />
      <span style={{ fontFamily: "Inter, Arial, sans-serif", fontSize: 30, lineHeight: 1.2, color: INK }}>
        <strong style={{ color: accent === GOLD ? "#a9761f" : "#0d6f6a", fontWeight: 900, letterSpacing: "0.02em" }}>{head}</strong>
        <span style={{ fontWeight: 600 }}>{"  " + body}</span>
      </span>
    </div>
  );
};

/* ===================== FIN · "water first — then the lid" ============= */
const EndBeat: React.FC<{ ph: Phases }> = ({ ph }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inP = spring({ frame: frame - Math.round(ph.endA), fps, config: { damping: 20, stiffness: 90, mass: 0.9 } });
  const op = interpolate(inP, [0, 1], [0, 1], CLAMP);
  if (op <= 0.001) return null;
  const y = interpolate(inP, [0, 1], [22, 0], CLAMP);
  const underline = interpolate(frame, [ph.endA + 6, ph.total - 4], [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });

  return (
    <div style={{ position: "absolute", left: "50%", top: "57%", transform: `translateX(-50%) translateY(${y}px)`, opacity: op, textAlign: "center", willChange: "transform, opacity" }}>
      <div
        style={{
          fontFamily: "Inter, Arial, sans-serif",
          fontWeight: 900,
          fontSize: 58,
          letterSpacing: "-0.01em",
          color: "#ffffff",
          textShadow: "0 6px 26px rgba(0,0,0,0.7)",
          whiteSpace: "nowrap",
        }}
      >
        water first <span style={{ color: GOLD }}>—</span> then the lid
      </div>
      <div style={{ position: "relative", height: 12, marginTop: 12 }}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            transform: "translateX(-50%)",
            width: `${underline * 100}%`,
            height: 6,
            borderRadius: 4,
            background: `linear-gradient(90deg, ${rgba(GOLD, 0)}, ${GOLD} 12%, #ffe6ad 50%, ${GOLD} 88%, ${rgba(GOLD, 0)})`,
            boxShadow: `0 0 22px ${rgba(GOLD, 0.7)}`,
          }}
        />
      </div>
    </div>
  );
};

/* =============================== ESCENA =============================== */
export const FloodSealScene: React.FC<{ durationInFrames: number; aloeImg?: string; oilImg?: string }> = ({
  durationInFrames,
  aloeImg,
  oilImg,
}) => {
  const frame = useCurrentFrame();
  const total = durationInFrames;

  const ph: Phases = React.useMemo(() => {
    const f = (x: number) => Math.round(x * total);
    return {
      total,
      introEnd: f(0.1),
      floodA: f(0.07),
      floodB: f(0.5),
      sealA: f(0.48),
      sealB: f(0.7),
      guardA: f(0.66),
      guardB: f(0.9),
      endA: f(0.86),
    };
  }, [total]);

  // progresos que persisten (la piel queda hinchada / la fábrica despierta)
  const plumpP = interpolate(frame, [ph.floodA, ph.floodB * 0.9], [0, 1], CLAMP);
  const wakeP = interpolate(frame, [ph.floodA, ph.floodB], [0, 1], CLAMP);

  // cámara handheld + paneo lento (drift de las capas)
  const seed = 3.1;
  const px = Math.sin(frame * 0.05 + seed) * 5.5 + Math.sin(frame * 0.014 + seed * 2) * 8 + interpolate(frame, [0, total], [-6, 10], CLAMP);
  const py = Math.cos(frame * 0.042 + seed) * 4.5;

  // motas
  const farMotes = React.useMemo(() => makeMotes(16, 101), []);
  const midMotes = React.useMemo(() => makeMotes(13, 202), []);
  const foreMotes = React.useMemo(() => makeMotes(6, 303), []);

  // fades globales
  const fadeIn = interpolate(frame, [0, Math.round(total * 0.04)], [1, 0], CLAMP);
  const fadeOut = interpolate(frame, [total - Math.round(total * 0.05), total - 1], [0, 1], CLAMP);

  // card de aceite (rosemary) opcional
  const oilCardIn = interpolate(frame, [ph.sealA, ph.sealA + 12], [0, 1], CLAMP);
  const oilCardOut = interpolate(frame, [ph.guardB - 12, ph.guardB + 6], [0, 1], CLAMP);
  const oilCardOp = oilCardIn * (1 - oilCardOut);
  const oilBob = Math.sin(frame * 0.07) * 6;

  return (
    <AbsoluteFill style={{ background: BG_LO, overflow: "hidden" }}>
      {/* 0 · fondo */}
      <AbsoluteFill style={{ transform: `scale(${interpolate(frame, [0, total], [1, 1.05], CLAMP)})` }}>
        <AbsoluteFill style={{ background: `radial-gradient(120% 100% at 50% 36%, ${BG_HI} 0%, ${BG_LO} 60%, #050f13 100%)` }} />
        <AbsoluteFill style={{ background: "radial-gradient(130% 112% at 50% 46%, transparent 50%, rgba(3,10,13,0.72) 100%)" }} />
      </AbsoluteFill>

      {/* 1 · motas lejanas */}
      <ParallaxLayer factor={0.25} z={1} px={px} py={py}>
        <MotesLayer motes={farMotes} blur={2} tint="120, 200, 205" />
      </ParallaxLayer>

      {/* 2 · corte transversal (la ciencia) */}
      <ParallaxLayer factor={0.55} z={2} px={px} py={py}>
        <CrossSection plumpP={plumpP} wakeP={wakeP} ph={ph} />
      </ParallaxLayer>

      {/* 3 · tapa de aceite + rebotes + escudos + enzimas */}
      <ParallaxLayer factor={0.58} z={3} px={px} py={py}>
        <OilLid ph={ph} />
        <BounceParticles ph={ph} />
        <ShieldsAndEnzymes ph={ph} />
      </ParallaxLayer>

      {/* 4 · motas medias */}
      <ParallaxLayer factor={0.42} z={4} px={px} py={py}>
        <MotesLayer motes={midMotes} blur={1.4} tint="150, 215, 220" />
      </ParallaxLayer>

      {/* 5 · fuente aloe + gotas */}
      <ParallaxLayer factor={0.72} z={5} px={px} py={py}>
        <AloeSource ph={ph} aloeImg={aloeImg} />
        <Droplets ph={ph} />
      </ParallaxLayer>

      {/* 6 · card de aceite (rosemary) opcional */}
      {oilImg && oilCardOp > 0.001 ? (
        <ParallaxLayer factor={0.85} z={6} px={px} py={py}>
          <div style={{ position: "absolute", right: 90, top: 90, width: 230, opacity: oilCardOp, transform: `translateY(${oilBob}px)` }}>
            <div style={{ position: "absolute", inset: "-16%", background: `radial-gradient(50% 50% at 50% 50%, ${rgba(GOLD, 0.34)}, transparent 70%)`, filter: "blur(18px)" }} />
            <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", border: `1px solid ${rgba(GOLD, 0.5)}`, background: "#141008", aspectRatio: "3 / 2", boxShadow: "0 24px 60px rgba(0,0,0,0.55)" }}>
              <Img src={staticFile(oilImg)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
          </div>
        </ParallaxLayer>
      ) : null}

      {/* 7 · cards de subtítulo */}
      <ParallaxLayer factor={0.9} z={7} px={px} py={py}>
        <CaptionCard a={ph.floodA + 6} b={ph.floodB - 2} head="ALOE —" body="floods water in + wakes the collagen factory" accent={TEAL_BRIGHT} leftPct={50} yPct={8} anchor="bottom" />
        <CaptionCard a={ph.sealA + 4} b={ph.guardA + 6} head="ROSEMARY OIL —" body="seals the water in overnight" accent={GOLD} leftPct={50} yPct={7} anchor="top" />
        <CaptionCard a={ph.guardA + 6} b={ph.endA + 4} head="+ guards" body="collagen from breakdown" accent={GOLD} leftPct={50} yPct={8} anchor="bottom" />
        <EndBeat ph={ph} />
      </ParallaxLayer>

      {/* 8 · motas foreground (bokeh) */}
      <ParallaxLayer factor={1.25} z={8} px={px} py={py}>
        <MotesLayer motes={foreMotes} blur={9} tint="200, 225, 225" />
      </ParallaxLayer>

      {/* 9 · viñeta + grano */}
      <AbsoluteFill
        style={{
          zIndex: 40,
          pointerEvents: "none",
          background: [
            "radial-gradient(125% 105% at 50% 46%, transparent 60%, rgba(2,8,10,0.4) 100%)",
            "linear-gradient(to bottom, rgba(2,8,10,0.3), transparent 16%, transparent 84%, rgba(2,8,10,0.4))",
          ].join(", "),
        }}
      />
      <GrainOverlay />
      <AbsoluteFill style={{ zIndex: 70, background: BG_LO, opacity: Math.max(fadeIn, fadeOut), pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

export default FloodSealScene;

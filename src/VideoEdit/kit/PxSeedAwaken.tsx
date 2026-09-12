import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { COLORS, FONT_STACK } from "../theme";
import {
  ParticleField,
  RimLight,
  Odometer,
  GodRays,
  PaperGrain,
  SvgFilters,
  rand,
  wobble,
} from "./depth";

// ═══════════════════════════════════════════════════════════════════════════
// PxSeedAwaken — PIEZA ÚNICA para TRUCO 2: semillas en remojo 30 min.
// Una semilla dentro de un vaso de remojo con burbujas de O₂; a los ~30:00 la
// CÁSCARA se parte (dos mitades de un path SVG que se abren) y BROTA la radícula
// con física de resorte, retroiluminada (RimLight). Un timer Odometer cuenta
// hacia 30:00. Marca terrosa-vintage, luz cálida de germinación.
//
// RENDER-SAFE: cero Date.now / Math.random / new Date. Todo deriva de
// useCurrentFrame(); el "azar" es determinístico por índice. El timer también.
// 1920x1080. Esquina inferior-derecha libre para el avatar PiP.
// ═══════════════════════════════════════════════════════════════════════════

const WATER_HI = "#BFD3C6";
const WATER_LO = "#8FB0A0";
const GLASS_EDGE = "#C9BE9E";
const SEED = "#7A4A22"; // cáscara marrón
const SEED_HI = "#A9794A";
const SEED_IN = "#EAD9B8"; // interior crema
const SPROUT = COLORS.good; // radícula verde
const O2 = COLORS.cold;

export const PxSeedAwaken: React.FC<{
  durationInFrames: number;
  title?: string;
}> = ({ durationInFrames, title = "Despertar la semilla" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 60 } });

  // El timer 30:00 avanza durante la primera parte y "completa" al partir.
  // Progreso 0→1 del remojo mapeado a los primeros ~4s de la pieza.
  const soakDur = Math.max(60, Math.round(durationInFrames * 0.45));
  const soak = interpolate(frame, [10, soakDur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const minutes = Math.round(soak * 30); // 0 → 30

  // Momento en que la cáscara se PARTE (después del remojo).
  const crackAt = soakDur + 6;
  const crack = spring({ frame: frame - crackAt, fps, config: { damping: 13, mass: 0.8, stiffness: 140 } });
  // Brote con resorte (después de partir).
  const sprout = spring({ frame: frame - crackAt - 8, fps, config: { damping: 12, mass: 0.7, stiffness: 130 } });

  // apertura de las mitades de la cáscara
  const halfGap = interpolate(crack, [0, 1], [0, 46]);
  const halfRot = interpolate(crack, [0, 1], [0, 22]);

  // idle: la semilla flota/tiembla mientras absorbe agua
  const bob = Math.sin(frame / 26) * 6 * (1 - crack);
  const jitter = Math.sin(frame / 5) * 1.6 * (1 - crack) * soak; // vibra más cuanto más hinchada

  const titleIn = spring({ frame: frame - 8, fps, config: { damping: 18, mass: 0.9, stiffness: 120 } });

  const cx = 760; // vaso a la izquierda-centro; derecha libre para PiP
  const seedY = 560;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK }}>
      <SvgFilters prefix="pxd" />
      <GodRays x={40} y={-14} angle={18} intensity={1.0} rays={7} color="rgba(169,121,74,0.20)" />

      <AbsoluteFill style={{ opacity: enter, transform: `translateY(${(1 - enter) * 22}px)` }}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ display: "block" }}>
          <defs>
            <linearGradient id="pxdWater" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={WATER_HI} stopOpacity={0.65} />
              <stop offset="100%" stopColor={WATER_LO} stopOpacity={0.9} />
            </linearGradient>
            <radialGradient id="pxdGlow" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#F4E7CE" stopOpacity={0.9} />
              <stop offset="70%" stopColor={COLORS.amber} stopOpacity={0.14} />
              <stop offset="100%" stopColor={COLORS.amber} stopOpacity={0} />
            </radialGradient>
            <linearGradient id="pxdSeed" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={SEED_HI} />
              <stop offset="100%" stopColor={SEED} />
            </linearGradient>
          </defs>

          {/* ── VASO de remojo ── */}
          <g>
            {/* sombra en el piso */}
            <ellipse cx={cx} cy={880} rx={220} ry={34} fill="#2A2620" opacity={0.16} />
            {/* cuerpo del vaso */}
            <path d={`M ${cx - 190} 380 L ${cx - 168} 840 Q ${cx - 160} 870 ${cx - 120} 872 L ${cx + 120} 872 Q ${cx + 160} 870 ${cx + 168} 840 L ${cx + 190} 380 Z`} fill="#EFE7D3" opacity={0.18} stroke={GLASS_EDGE} strokeWidth={3} />
            {/* nivel de agua */}
            <clipPath id="pxdInner">
              <path d={`M ${cx - 190} 380 L ${cx - 168} 840 Q ${cx - 160} 870 ${cx - 120} 872 L ${cx + 120} 872 Q ${cx + 160} 870 ${cx + 168} 840 L ${cx + 190} 380 Z`} />
            </clipPath>
            <g clipPath="url(#pxdInner)">
              <rect x={cx - 190} y={440} width={380} height={440} fill="url(#pxdWater)" filter="url(#pxd-ripple)" />
              {/* menisco */}
              <ellipse cx={cx} cy={442} rx={188} ry={14} fill={WATER_HI} opacity={0.6} />

              {/* burbujas de O₂ dentro del agua subiendo */}
              {Array.from({ length: 22 }, (_, i) => {
                const span = 90 + rand(i, 1) * 70;
                const p = ((frame * 1.5 + rand(i, 2) * span) % span) / span;
                const bx = cx - 150 + rand(i) * 300 + wobble(i, frame, 1.5) * 10;
                const by = 860 - p * 400;
                const r = 4 + rand(i, 3) * 8;
                const op = Math.sin(p * Math.PI) * 0.75;
                return (
                  <g key={"o2" + i} opacity={op}>
                    <circle cx={bx} cy={by} r={r} fill={O2} opacity={0.5} />
                    <circle cx={bx} cy={by} r={r} fill="none" stroke={O2} strokeWidth={2} />
                    <ellipse cx={bx - r * 0.3} cy={by - r * 0.3} rx={r * 0.34} ry={r * 0.24} fill="#fff" opacity={0.6} />
                  </g>
                );
              })}
            </g>
            {/* reflejo del vidrio */}
            <rect x={cx - 150} y={420} width={22} height={420} rx={11} fill="#F4E7CE" opacity={0.22} />
          </g>

          {/* halo cálido de germinación detrás de la semilla */}
          <circle cx={cx} cy={seedY + bob} r={200} fill="url(#pxdGlow)" opacity={0.5 + soak * 0.4} />

          {/* ══════════ SEMILLA (cáscara que se parte) ══════════ */}
          <g transform={`translate(${cx + jitter} ${seedY + bob})`}>
            {/* interior expuesto (se ve al abrir) */}
            <g opacity={crack}>
              <ellipse cx={0} cy={0} rx={72} ry={92} fill={SEED_IN} />
              {/* radícula que brota con resorte hacia abajo */}
              <g opacity={sprout}>
                <path
                  d={`M 0 60 C ${interpolate(sprout, [0, 1], [0, -6])} ${interpolate(sprout, [0, 1], [70, 150])}, ${interpolate(sprout, [0, 1], [0, -30])} ${interpolate(sprout, [0, 1], [90, 230])}, ${interpolate(sprout, [0, 1], [0, -14])} ${interpolate(sprout, [0, 1], [110, 300])}`}
                  fill="none"
                  stroke={SPROUT}
                  strokeWidth={interpolate(sprout, [0, 1], [4, 13])}
                  strokeLinecap="round"
                />
                {/* pelillos de la radícula */}
                <path d={`M -18 ${interpolate(sprout, [0, 1], [110, 210])} l -22 14`} stroke={SPROUT} strokeWidth={3} opacity={0.8 * sprout} />
                <path d={`M -8 ${interpolate(sprout, [0, 1], [130, 260])} l 24 12`} stroke={SPROUT} strokeWidth={3} opacity={0.8 * sprout} />
              </g>
            </g>

            {/* mitad IZQUIERDA de la cáscara */}
            <g transform={`translate(${-halfGap} 0) rotate(${-halfRot})`}>
              <path d={`M 0 -92 C -70 -92 -74 -20 -70 20 C -66 60 -40 92 0 92 L 0 -92 Z`} fill="url(#pxdSeed)" stroke="#3a2412" strokeWidth={3} />
              <ellipse cx={-40} cy={-30} rx={18} ry={30} fill={SEED_HI} opacity={0.4} />
            </g>
            {/* mitad DERECHA de la cáscara */}
            <g transform={`translate(${halfGap} 0) rotate(${halfRot})`}>
              <path d={`M 0 -92 C 70 -92 74 -20 70 20 C 66 60 40 92 0 92 L 0 -92 Z`} fill="url(#pxdSeed)" stroke="#3a2412" strokeWidth={3} />
              <ellipse cx={40} cy={-30} rx={18} ry={30} fill={SEED_HI} opacity={0.3} />
            </g>

            {/* línea de fisura que se ilumina justo antes de partir */}
            <line x1={0} y1={-92} x2={0} y2={92} stroke={COLORS.amber} strokeWidth={interpolate(crack, [0, 0.3, 1], [1, 6, 0])} opacity={interpolate(crack, [0, 0.3, 1], [0, 0.9, 0])} />

            {/* destello de "despertar" al partir */}
            <circle cx={0} cy={0} r={interpolate(crack, [0, 0.4, 1], [40, 160, 240])} fill="none" stroke={COLORS.accent} strokeWidth={4} opacity={interpolate(crack, [0.1, 0.5, 1], [0, 0.6, 0])} />
          </g>
        </svg>
      </AbsoluteFill>

      {/* burbujas ambientales al frente */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.35, pointerEvents: "none" }}>
        <ParticleField count={9} kind="bubbles" rise drift={26} width={1920} height={1080} opacity={0.35} />
      </div>

      {/* ── TIMER Odometer 30:00 (retroiluminado) — arriba a la derecha, encima del PiP pero alto ── */}
      <div style={{ position: "absolute", right: 120, top: 90 }}>
        <RimLight color={COLORS.amber} spread={22} x={0.5} y={0.4}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 6,
              background: "rgba(34,30,26,0.74)",
              border: "1px solid rgba(239,231,211,0.16)",
              borderRadius: 20,
              padding: "14px 28px",
              boxShadow: "0 24px 60px rgba(0,0,0,0.42)",
            }}
          >
            <Odometer value={minutes} digits={2} durationInFrames={soakDur} size={72} color="#EFE7D3" />
            <span style={{ fontFamily: FONT_STACK, fontSize: 72, fontWeight: 900, color: "#EFE7D3", lineHeight: 1 }}>:00</span>
            <span style={{ fontFamily: FONT_STACK, fontSize: 30, fontWeight: 700, color: COLORS.accentSoft, marginLeft: 10 }}>min</span>
          </div>
        </RimLight>
      </div>

      {/* ── TÍTULO (prop) abajo a la izquierda ── */}
      <div
        style={{
          position: "absolute",
          left: 90,
          bottom: 96,
          opacity: titleIn,
          transform: `translateY(${(1 - titleIn) * 16}px)`,
        }}
      >
        <div style={{ display: "inline-block", background: "rgba(239,231,211,0.92)", border: "1px solid rgba(42,38,32,0.16)", borderRadius: 18, padding: "16px 32px", boxShadow: "0 18px 44px rgba(42,38,32,0.18)" }}>
          <span style={{ fontFamily: FONT_STACK, fontSize: 58, fontWeight: 800, color: COLORS.text }}>{title}</span>
        </div>
      </div>

      <PaperGrain opacity={0.1} scale={0.85} />
    </AbsoluteFill>
  );
};

export default PxSeedAwaken;

import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import {
  ParallaxLayer,
  ParticleField,
  GodRays,
  RimLight,
  DepthShadow,
  Odometer,
  InkDraw,
  SvgFilters,
  PaperGrain,
  rand,
  wobble,
} from "./depth";

// ═══════════════════════════════════════════════════════════════════════════
// PxRootRescue — PIEZA ÚNICA (video AGUA OXIGENADA en la huerta · truco 3).
// MOMENTO: "rescatar la raíz podrida". Una raíz principal marrón-babosa cuelga
// en el corte de tierra. Cae un chorro de peróxido desde arriba; al tocar la
// pudrición estalla en burbujas de O₂ que "queman" la baba (feDisplacementMap
// que se calma) y de la punta rescatada emerge una raicilla nueva + una hojita.
// Un Odometer marca los días 1→4 de recuperación.
// PISO SUPERADO: PeroxidoDiagram (modo roots). Acá hay chorro físico, transición
// podrido→sano por máscara, spring en el brote, contador de días y god-rays.
// RENDER-SAFE: cero Date.now/Math.random/new Date. Todo desde useCurrentFrame();
// azar determinístico por índice (rand/wobble de depth.tsx). Esquina inf-der
// libre para el avatar PiP. Texto español por props con DEFAULTS.
// ═══════════════════════════════════════════════════════════════════════════

// Estratos MÁS CLAROS (como PxSoilBreath) para que la tierra no sea un bloque
// negro: capa superior húmeda cálida → subsuelo → profundo.
const SOIL_TOP = "#6A4B2C"; // capa superior húmeda cálida (clara)
const SOIL0 = "#5A3F26"; // superior
const SOIL1 = "#43301C"; // subsuelo
const SOIL2 = "#33240F"; // profundo (nunca negro puro)
const ROTTEN = "#7A5A34"; // marrón podrido baboso (más claro → contrasta con la tierra)
const ROTTEN2 = "#94743F";
const ROOT_NEW = "#F3ECD8"; // raíz nueva crema-blanca (más brillante)
const O2 = COLORS.cold; // burbuja de oxígeno = eucalipto
const LEAF = COLORS.good;
const PEROX = "#E6F3EC"; // chorro de peróxido: claro azulado-verde

export const PxRootRescue: React.FC<{
  durationInFrames: number;
  title?: string;
  subtitle?: string;
  accent?: string;
}> = ({
  durationInFrames,
  title = "Rescatar la raíz",
  subtitle = "El peróxido mata la pudrición y la raíz revive",
  accent,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const acc = accent ?? COLORS.accent;

  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 60 } });
  const lab = (d: number) =>
    spring({ frame: frame - sec(d), fps, config: { damping: 200, mass: 1, stiffness: 70 } });

  // ── línea de tiempo del truco (frames) ──────────────────────────────────
  const F_POUR = sec(1.1); // empieza a caer el chorro
  const F_HIT = sec(1.8); // el chorro toca la raíz → reacción
  const F_HEAL = sec(2.6); // arranca el rescate / brote nuevo

  // chorro que cae: progresa de arriba a la raíz
  const pour = interpolate(frame - F_POUR, [0, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // "cura": 0 podrido → 1 sano (spring con rebote suave en el brote)
  const heal = spring({
    frame: frame - F_HEAL,
    fps,
    config: { damping: 16, mass: 0.9, stiffness: 90 },
  });
  // intensidad de la reacción (burbujeo) — pico al impactar, luego se calma
  const react = interpolate(
    frame - F_HIT,
    [0, 10, 60, 110],
    [0, 1, 0.85, 0.25],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // ondulación de la baba podrida: fuerte al impactar, se aquieta al sanar
  const rotScale = interpolate(react, [0, 1], [4, 26]) * (1 - heal * 0.85);
  // temblor de displacement animado (semilla que corre por frame, sin new Date)
  const rotSeed = 2 + (frame % 90);

  const groundY = 300;
  const rootTipX = 720;
  const rootTipY = groundY + 430;

  // día de recuperación 1→4 según heal
  const day = 1 + Math.round(heal * 3);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <SvgFilters prefix="pxroot" />

      {/* aire cálido arriba (cielo parchment) para que la mitad superior no
          quede vacía y todo respire luz */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${COLORS.bg0} 0%, ${COLORS.bg1} 40%, ${COLORS.amber}22 100%)`,
        }}
      />

      {/* profundidad de fondo: god-rays cálidos entrando desde arriba-izq */}
      <ParallaxLayer depth={0.25} driftY={14}>
        <GodRays x={30} y={-14} angle={16} color="rgba(169,121,74,0.22)" rays={7} intensity={1.1} />
      </ParallaxLayer>

      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            width: "94%",
            maxWidth: 1680,
            opacity: enter,
            transform: `translateY(${(1 - enter) * 26}px)`,
            fontFamily: FONT_STACK,
          }}
        >
          {/* título */}
          <div style={{ textAlign: "center", marginBottom: 6 }}>
            <div style={{ fontSize: 54, fontWeight: 800, color: COLORS.text, letterSpacing: 0.3 }}>
              {title}
            </div>
            <div style={{ fontSize: 26, fontWeight: 600, color: COLORS.textSoft, marginTop: 2 }}>
              {subtitle}
            </div>
          </div>

          <svg viewBox="0 0 1600 900" width="100%" style={{ display: "block" }}>
            <defs>
              {/* estratos de tierra — arranca CLARO arriba y sólo se oscurece
                  suave en profundidad (nunca negro plano) */}
              <linearGradient id="pxroot-soil" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={SOIL_TOP} />
                <stop offset="22%" stopColor={SOIL0} />
                <stop offset="60%" stopColor={SOIL1} />
                <stop offset="100%" stopColor={SOIL2} />
              </linearGradient>
              {/* god-rays cálidos que atraviesan la tierra desde la superficie */}
              <linearGradient id="pxroot-ray" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.amber} stopOpacity={0.34} />
                <stop offset="100%" stopColor={COLORS.amber} stopOpacity={0} />
              </linearGradient>
              {/* vidrio del cielo cálido sobre la superficie */}
              <radialGradient id="pxroot-sky" cx="30%" cy="0%">
                <stop offset="0%" stopColor={COLORS.amber} stopOpacity={0.5} />
                <stop offset="100%" stopColor={COLORS.amber} stopOpacity={0} />
              </radialGradient>
              {/* chorro de peróxido */}
              <linearGradient id="pxroot-pour" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={PEROX} stopOpacity={0} />
                <stop offset="18%" stopColor={PEROX} stopOpacity={0.95} />
                <stop offset="100%" stopColor={O2} stopOpacity={0.9} />
              </linearGradient>
              {/* halo cálido de la punta rescatada */}
              <radialGradient id="pxroot-glow" cx="50%" cy="50%">
                <stop offset="0%" stopColor={acc} stopOpacity={0.45} />
                <stop offset="100%" stopColor={acc} stopOpacity={0} />
              </radialGradient>
              {/* máscara de reacción: crece del impacto hacia afuera */}
              <clipPath id="pxroot-soilclip">
                <rect x={0} y={groundY} width={1600} height={900 - groundY} />
              </clipPath>
              {/* displacement de baba PODRIDA — la amplitud cae al sanar y la
                  semilla corre por frame (determinístico, sin new Date) */}
              <filter id="pxroot-rot" x="-30%" y="-30%" width="160%" height="160%">
                <feTurbulence type="fractalNoise" baseFrequency="0.02 0.05" numOctaves={2} seed={rotSeed} result="n" />
                <feDisplacementMap in="SourceGraphic" in2="n" scale={rotScale} xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>

            {/* ── aire arriba (cielo cálido), tierra abajo con estratos ── */}
            <g opacity={enter}>
              {/* halo cálido de sol difuso sobre la superficie (llena el aire) */}
              <rect x={0} y={0} width={1600} height={groundY + 40} fill="url(#pxroot-sky)" />
              {/* cuerpo de tierra */}
              <rect x={0} y={groundY} width={1600} height={900 - groundY} fill="url(#pxroot-soil)" />
              {/* estratos horizontales suaves que dan lectura de capas */}
              {[110, 250, 400, 540].map((dy, i) => (
                <line
                  key={"strat" + i}
                  x1={0}
                  y1={groundY + dy}
                  x2={1600}
                  y2={groundY + dy + (i % 2 === 0 ? 8 : -6)}
                  stroke="#2a1c0e"
                  strokeWidth={2}
                  opacity={0.28}
                />
              ))}
              {/* GOD-RAYS cálidos que se hunden en la tierra desde la superficie */}
              {[280, 560, 900, 1240].map((rx, i) => (
                <polygon
                  key={"soilray" + i}
                  points={`${rx - 40} ${groundY} ${rx + 40} ${groundY} ${rx + 130} ${groundY + 520} ${rx - 130} ${groundY + 520}`}
                  fill="url(#pxroot-ray)"
                  opacity={(0.5 + 0.5 * Math.sin(frame / 40 + i)) * 0.6}
                />
              ))}
              {/* línea de superficie (doble para dar tierra iluminada arriba) */}
              <rect x={0} y={groundY} width={1600} height={10} fill={SOIL_TOP} opacity={0.8} />
              <line x1={0} y1={groundY} x2={1600} y2={groundY} stroke="#241a0e" strokeWidth={4} />
              {/* granos de tierra determinísticos — más claros, tono cálido */}
              {Array.from({ length: 70 }, (_, i) => {
                const gx = rand(i, 3) * 1600;
                const gy = groundY + 24 + rand(i, 4) * (860 - groundY);
                const gr = 2 + Math.floor(rand(i, 5) * 3);
                const light = rand(i, 6) > 0.55;
                return (
                  <circle
                    key={"g" + i}
                    cx={gx}
                    cy={gy}
                    r={gr}
                    fill={light ? SOIL_TOP : "#241a0e"}
                    opacity={light ? 0.45 : 0.4}
                  />
                );
              })}
            </g>

            {/* superficie: sol cálido brillante arriba-izq (lejos del PiP) */}
            <circle cx={210} cy={128} r={64} fill={COLORS.amber} opacity={0.9 * lab(0.2)} />
            <circle cx={210} cy={128} r={110} fill="url(#pxroot-glow)" opacity={0.8 * lab(0.2)} />

            {/* césped / plantita sana ya presente en la superficie (estilo
                PxSoilBreath) — a la izquierda para no tapar la raíz */}
            <g opacity={lab(0.4)} transform={`translate(430 ${groundY})`}>
              <line x1={0} y1={0} x2={0} y2={-118} stroke="#2f5a23" strokeWidth={9} strokeLinecap="round" />
              <path d="M 0 -118 C -48 -154, -66 -208, -24 -232 C -6 -184, -2 -154, 0 -118" fill={LEAF} />
              <path d="M 0 -118 C 48 -154, 66 -208, 24 -232 C 6 -184, 2 -154, 0 -118" fill={LEAF} opacity={0.9} />
              {/* briznas de pasto alrededor */}
              {[-70, -40, 40, 74].map((bx, i) => (
                <path
                  key={"blade" + i}
                  d={`M ${bx} 0 q ${i % 2 ? 10 : -10} -40 ${i % 2 ? 4 : -4} -64`}
                  stroke="#3a6b2c"
                  strokeWidth={5}
                  fill="none"
                  strokeLinecap="round"
                  opacity={0.8}
                />
              ))}
            </g>

            {/* ── RAÍZ PRINCIPAL: podrida arriba, sana abajo según heal ── */}
            <g clipPath="url(#pxroot-soilclip)">
              {/* nicho oscuro detrás de la raíz para separarla de la tierra y
                  darle contraste (halo de sombra suave) */}
              <path
                d={`M 700 ${groundY} C 706 ${groundY + 110}, 690 ${groundY + 200}, ${rootTipX} ${rootTipY - 40}`}
                fill="none"
                stroke="#1c1206"
                strokeWidth={54}
                strokeLinecap="round"
                opacity={0.5 * enter}
              />
              {/* tramo PODRIDO (se disuelve al sanar) con displacement de baba */}
              <g
                opacity={lab(0.35) * (1 - heal * 0.9)}
                filter="url(#pxroot-rot)"
                style={{ mixBlendMode: "normal" }}
              >
                <path
                  d={`M 700 ${groundY} C 706 ${groundY + 110}, 690 ${groundY + 200}, ${rootTipX} ${groundY + 300}`}
                  fill="none"
                  stroke={ROTTEN}
                  strokeWidth={30}
                  strokeLinecap="round"
                />
                <path
                  d={`M 700 ${groundY} C 706 ${groundY + 110}, 690 ${groundY + 200}, ${rootTipX} ${groundY + 300}`}
                  fill="none"
                  stroke={ROTTEN2}
                  strokeWidth={14}
                  strokeLinecap="round"
                  opacity={0.7}
                />
                {/* gotas de baba colgando */}
                {Array.from({ length: 5 }, (_, i) => {
                  const sx = 700 + wobble(i, frame, 0.8) * 10;
                  const sy = groundY + 70 + i * 46 + Math.sin(frame / 20 + i) * 4;
                  return (
                    <ellipse key={"slime" + i} cx={sx} cy={sy} rx={9} ry={16} fill={ROTTEN2} opacity={0.55} />
                  );
                })}
              </g>

              {/* tramo SANO nuevo que emerge (crema) — crece con heal */}
              <g opacity={lab(0.35)}>
                {/* underlay ligeramente sombreado para volumen */}
                <path
                  d={`M 700 ${groundY} C 704 ${groundY + 120}, 692 ${groundY + 220}, ${rootTipX} ${rootTipY - 130}`}
                  fill="none"
                  stroke="#C9BE9E"
                  strokeWidth={22}
                  strokeLinecap="round"
                  strokeDasharray={520}
                  strokeDashoffset={520 * (1 - Math.min(1, heal * 1.1))}
                  opacity={0.9}
                />
                <path
                  d={`M 700 ${groundY} C 704 ${groundY + 120}, 692 ${groundY + 220}, ${rootTipX} ${rootTipY - 130}`}
                  fill="none"
                  stroke={ROOT_NEW}
                  strokeWidth={16}
                  strokeLinecap="round"
                  strokeDasharray={520}
                  strokeDashoffset={520 * (1 - Math.min(1, heal * 1.1))}
                  opacity={0.98}
                />
                {/* raicillas nuevas ramificando desde la punta rescatada */}
                {[
                  `M ${rootTipX} ${rootTipY - 130} C ${rootTipX - 40} ${rootTipY - 80}, ${rootTipX - 70} ${rootTipY - 40}, ${rootTipX - 96} ${rootTipY}`,
                  `M ${rootTipX} ${rootTipY - 130} C ${rootTipX + 34} ${rootTipY - 82}, ${rootTipX + 60} ${rootTipY - 44}, ${rootTipX + 82} ${rootTipY - 4}`,
                  `M ${rootTipX} ${rootTipY - 110} C ${rootTipX + 4} ${rootTipY - 60}, ${rootTipX + 2} ${rootTipY - 24}, ${rootTipX + 8} ${rootTipY + 14}`,
                ].map((d, i) => {
                  const len = 220;
                  const local = interpolate(heal, [0.35 + i * 0.12, 0.8 + i * 0.06], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  });
                  return (
                    <path
                      key={"rn" + i}
                      d={d}
                      fill="none"
                      stroke={ROOT_NEW}
                      strokeWidth={6}
                      strokeLinecap="round"
                      strokeDasharray={len}
                      strokeDashoffset={len * (1 - local)}
                      opacity={0.9}
                    />
                  );
                })}
                {/* halo de la punta rescatada */}
                <circle cx={rootTipX} cy={rootTipY - 130} r={interpolate(heal, [0.3, 1], [0, 90])} fill="url(#pxroot-glow)" opacity={heal} />
              </g>
            </g>

            {/* ── CHORRO de peróxido cayendo desde arriba hacia la raíz ── */}
            {frame >= F_POUR && (
              <g opacity={interpolate(frame - F_POUR, [0, 8], [0, 1], { extrapolateRight: "clamp" })}>
                {/* columna del chorro */}
                <rect
                  x={694}
                  y={70}
                  width={12}
                  height={(groundY + 60 - 70) * pour}
                  rx={6}
                  fill="url(#pxroot-pour)"
                  filter="url(#pxroot-ripple)"
                />
                {/* gotas cayendo (determinístico) */}
                {Array.from({ length: 7 }, (_, i) => {
                  const span = 34;
                  const p = ((frame + rand(i, 7) * span) % span) / span;
                  const dy = 90 + p * (groundY + 40 - 90);
                  const dx = 700 + wobble(i, frame, 1.6) * 6;
                  return (
                    <ellipse
                      key={"drop" + i}
                      cx={dx}
                      cy={dy}
                      rx={4.5}
                      ry={9}
                      fill={PEROX}
                      opacity={0.8 * (1 - p) * pour}
                    />
                  );
                })}
              </g>
            )}

            {/* ── BURBUJAS de O₂ estallando en la zona de pudrición ── */}
            {frame >= F_HIT && (
              <g clipPath="url(#pxroot-soilclip)">
                {Array.from({ length: 20 }, (_, i) => {
                  const span = 90 + Math.floor(rand(i, 9) * 60);
                  const p = ((frame - F_HIT + rand(i, 10) * span) % span) / span;
                  const originX = 700 + (rand(i, 11) - 0.5) * 120;
                  const originY = groundY + 90 + rand(i, 12) * 210;
                  const bx = originX + wobble(i, frame, 1.4) * 22;
                  const by = originY - p * 200;
                  const br = 6 + rand(i, 13) * 12;
                  const op = Math.sin(p * Math.PI) * react * (0.5 + rand(i, 14) * 0.5);
                  return (
                    <g key={"o2" + i} opacity={op}>
                      <circle cx={bx} cy={by} r={br} fill={O2} opacity={0.45} />
                      <circle cx={bx} cy={by} r={br} fill="none" stroke={O2} strokeWidth={2.5} />
                      <ellipse cx={bx - br * 0.3} cy={by - br * 0.3} rx={br * 0.34} ry={br * 0.24} fill="#fff" opacity={0.5} />
                    </g>
                  );
                })}
                {/* pulso de reacción en el punto de impacto */}
                <circle
                  cx={700}
                  cy={groundY + 140}
                  r={interpolate((frame - F_HIT) % 45, [0, 45], [10, 120])}
                  fill="none"
                  stroke={O2}
                  strokeWidth={4}
                  opacity={react * interpolate((frame - F_HIT) % 45, [0, 45], [0.5, 0])}
                />
              </g>
            )}

            {/* ── HOJITA nueva que asoma sobre la superficie (premio del rescate) ── */}
            <g opacity={lab(2.6) * Math.min(1, heal * 1.3)} transform={`translate(700 ${groundY})`}>
              <line
                x1={0}
                y1={0}
                x2={0}
                y2={-90 * Math.min(1, heal * 1.2)}
                stroke="#2f5a23"
                strokeWidth={8}
                strokeLinecap="round"
              />
              <g transform={`translate(0 ${-90 * Math.min(1, heal * 1.2)}) scale(${Math.min(1, heal * 1.2)})`}>
                <path d="M 0 0 C -46 -20, -60 -66, -20 -92 C -6 -54, -2 -28, 0 0" fill={LEAF} />
                <path d="M 0 0 C 46 -20, 60 -66, 20 -92 C 6 -54, 2 -28, 0 0" fill={LEAF} opacity={0.92} />
              </g>
            </g>

            {/* ── ETIQUETAS a pluma ── */}
            <g fill="none">
              <InkDraw
                d={`M 1040 ${groundY + 150} L 780 ${groundY + 150}`}
                at={F_HIT + 6}
                duration={22}
                color={O2}
                width={3}
                length={280}
              />
            </g>
            <g opacity={lab(1.9)} transform={`translate(1060 ${groundY + 160})`} textAnchor="start">
              <text fontSize={38} fontWeight={900} fill={O2} fontFamily={FONT_STACK} style={{ paintOrder: "stroke", stroke: COLORS.bg0, strokeWidth: 6 }}>
                El O₂ quema la pudrición
              </text>
            </g>
            <g opacity={lab(2.9)} transform={`translate(360 ${groundY - 40})`} textAnchor="middle">
              <text fontSize={38} fontWeight={900} fill={acc} fontFamily={FONT_STACK} style={{ paintOrder: "stroke", stroke: COLORS.bg0, strokeWidth: 6 }}>
                Brota raíz nueva
              </text>
            </g>
          </svg>
        </div>
      </AbsoluteFill>

      {/* ── CONTADOR de días 1→4 (card con profundidad, arriba-izq del PiP) ── */}
      <div style={{ position: "absolute", left: 84, bottom: 96 }}>
        <RimLight color={acc} spread={20} x={0.7} y={0.3}>
          <DepthShadow radius={20} distance={30} style={{ background: "rgba(239,231,211,0.94)", padding: "14px 26px", border: `1px solid ${COLORS.textDim}` }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, fontFamily: FONT_STACK }}>
              <span style={{ fontSize: 26, fontWeight: 700, color: COLORS.textSoft }}>Día</span>
              <Odometer value={day} digits={1} durationInFrames={sec(2.4)} size={64} color={acc} />
              <span style={{ fontSize: 24, fontWeight: 600, color: COLORS.textDim }}>de 4</span>
            </div>
          </DepthShadow>
        </RimLight>
      </div>

      {/* partículas de vapor cálido subiendo (aire) — profundidad extra */}
      <ParallaxLayer depth={0.6} driftY={-18}>
        <ParticleField count={12} kind="dust" rise drift={26} opacity={0.4} color={COLORS.amber} />
      </ParallaxLayer>

      {/* grano de papel + viñeta de marca por encima */}
      <PaperGrain opacity={0.1} scale={0.85} seed={11} />
    </AbsoluteFill>
  );
};

export default PxRootRescue;

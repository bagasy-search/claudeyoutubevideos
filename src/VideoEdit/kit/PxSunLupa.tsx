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
  InkDraw,
  WaxSeal,
  SvgFilters,
  PaperGrain,
  rand,
  wobble,
} from "./depth";

// ═══════════════════════════════════════════════════════════════════════════
// PxSunLupa — PIEZA ÚNICA (video AGUA OXIGENADA · ERROR/ADVERTENCIA).
// MOMENTO: "nunca al sol fuerte". Una lupa entra en escena y CONCENTRA los rayos
// del sol sobre una hoja mojada con peróxido: un punto caliente crece, la hoja
// se QUEMA (mancha marrón que se expande con feDisplacementMap de calor) y sube
// HUMO. Shimmer de calor ondula el aire sobre el punto. Un sello de PELIGRO se
// estampa. Es el beat de ALERTA — dentro de la marca terrosa (terracota/óxido),
// sin neón ni rojo alarma-moderno.
// PISO SUPERADO: PeroxidoDiagram. Acá hay lente con foco convergente, quemadura
// que crece por máscara+displacement, humo real y shimmer térmico.
// RENDER-SAFE: cero Date.now/Math.random/new Date. Todo desde useCurrentFrame();
// azar determinístico por índice. Esquina inf-der libre para el avatar PiP.
// ═══════════════════════════════════════════════════════════════════════════

const LEAF_MD = COLORS.good;
const LEAF_DK = "#3d5a2a";
const LEAF_LT = "#8FAE63";
const VEIN = "#2b3f1c";
const BURN = "#5a3a1e"; // quemadura marrón
const BURN_EDGE = "#8a4a24"; // borde chamuscado óxido
const SUN = COLORS.amber;

export const PxSunLupa: React.FC<{
  durationInFrames: number;
  title?: string;
  subtitle?: string;
  accent?: string;
}> = ({
  durationInFrames,
  title = "Al sol = veneno",
  subtitle = "La lupa del sol quema la hoja mojada",
  accent,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const acc = accent ?? COLORS.danger;

  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 60 } });
  const lab = (d: number) =>
    spring({ frame: frame - sec(d), fps, config: { damping: 200, mass: 1, stiffness: 70 } });

  // ── timeline ──────────────────────────────────────────────────────────
  const F_LUPA = sec(0.5); // entra la lupa
  const F_FOCUS = sec(1.4); // el foco converge en el punto
  const F_BURN = sec(2.0); // arranca la quemadura + humo

  // lupa entra con resorte y se posa sobre la hoja
  const lupaIn = spring({
    frame: frame - F_LUPA,
    fps,
    config: { damping: 15, mass: 0.9, stiffness: 90 },
  });
  // convergencia del haz al punto caliente
  const focus = interpolate(frame - F_FOCUS, [0, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // crecimiento de la quemadura
  const burn = spring({
    frame: frame - F_BURN,
    fps,
    config: { damping: 24, mass: 1, stiffness: 45 },
  });

  // punto focal sobre la hoja (centro-izq, PiP libre abajo-der)
  const focalX = 640;
  const focalY = 470;
  // posición de la lupa: entra desde arriba-izq y se asienta con leve flote
  const lupaX = interpolate(lupaIn, [0, 1], [-260, 0]) + Math.sin(frame / 40) * 6;
  const lupaY = interpolate(lupaIn, [0, 1], [-200, 0]) + Math.cos(frame / 48) * 5;
  const lupaCX = focalX - 140 + lupaX;
  const lupaCY = focalY - 200 + lupaY;
  const lensR = 150;

  // shimmer de calor: amplitud del displacement crece con burn
  const heatScale = interpolate(burn, [0, 1], [4, 22]) * (0.6 + focus * 0.4);
  const heatSeed = 3 + (frame % 100);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <SvgFilters prefix="pxsun" />

      {/* sol fuerte entrando desde arriba (god-rays intensos) — el "peligro" */}
      <ParallaxLayer depth={0.3} driftY={10}>
        <GodRays
          x={44}
          y={-16}
          angle={12}
          color={`rgba(169,121,74,${0.16 + focus * 0.14})`}
          rays={8}
          intensity={0.9 + focus * 0.5}
        />
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
          <div style={{ textAlign: "center", marginBottom: 6 }}>
            <div style={{ fontSize: 54, fontWeight: 800, color: acc, letterSpacing: 0.3 }}>
              {title}
            </div>
            <div style={{ fontSize: 26, fontWeight: 600, color: COLORS.textSoft, marginTop: 2 }}>
              {subtitle}
            </div>
          </div>

          <svg viewBox="0 0 1600 900" width="100%" style={{ display: "block" }}>
            <defs>
              <linearGradient id="pxsun-leaf" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={LEAF_LT} />
                <stop offset="50%" stopColor={LEAF_MD} />
                <stop offset="100%" stopColor={LEAF_DK} />
              </linearGradient>
              {/* quemadura: radial marrón→óxido→transparente */}
              <radialGradient id="pxsun-burn" cx="50%" cy="50%">
                <stop offset="0%" stopColor="#2a1a0d" />
                <stop offset="45%" stopColor={BURN} />
                <stop offset="80%" stopColor={BURN_EDGE} />
                <stop offset="100%" stopColor={BURN_EDGE} stopOpacity={0} />
              </radialGradient>
              {/* haz convergente de la lupa */}
              <radialGradient id="pxsun-hot" cx="50%" cy="50%">
                <stop offset="0%" stopColor="#FFF3D0" stopOpacity={0.95} />
                <stop offset="40%" stopColor={SUN} stopOpacity={0.7} />
                <stop offset="100%" stopColor={SUN} stopOpacity={0} />
              </radialGradient>
              {/* cristal de la lupa */}
              <radialGradient id="pxsun-glass" cx="38%" cy="32%">
                <stop offset="0%" stopColor="#fff" stopOpacity={0.5} />
                <stop offset="55%" stopColor="#dfe8e2" stopOpacity={0.14} />
                <stop offset="100%" stopColor={SUN} stopOpacity={0.22} />
              </radialGradient>
              <clipPath id="pxsun-leafclip">
                <path d={`M 640 150 C 940 210, 1000 520, 760 740 C 680 800, 600 800, 520 740 C 280 520, 340 210, 640 150 Z`} />
              </clipPath>
              {/* shimmer TÉRMICO — el aire sobre el foco ondula; amplitud crece
                  con la quemadura, semilla corre por frame (determinístico) */}
              <filter id="pxsun-heat" x="-30%" y="-30%" width="160%" height="160%">
                <feTurbulence type="fractalNoise" baseFrequency="0.008 0.03" numOctaves={2} seed={heatSeed} result="n" />
                <feDisplacementMap in="SourceGraphic" in2="n" scale={heatScale} xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>

            {/* ── HOJA verde con shimmer térmico (displacement crece con burn) ── */}
            <g opacity={lab(0.2)} filter="url(#pxsun-heat)">
              <path
                d={`M 640 150 C 940 210, 1000 520, 760 740 C 680 800, 600 800, 520 740 C 280 520, 340 210, 640 150 Z`}
                fill="url(#pxsun-leaf)"
                stroke={VEIN}
                strokeWidth={5}
              />
              <line x1={640} y1={168} x2={640} y2={760} stroke={VEIN} strokeWidth={7} opacity={0.7} />
              {Array.from({ length: 6 }, (_, i) => {
                const t = (i + 1) / 7;
                const y = 210 + t * 500;
                const spread = 220 * Math.sin(t * Math.PI);
                return (
                  <g key={"v" + i} stroke={VEIN} strokeWidth={4} opacity={0.5}>
                    <line x1={640} y1={y} x2={640 - spread} y2={y - 44} />
                    <line x1={640} y1={y} x2={640 + spread} y2={y - 44} />
                  </g>
                );
              })}
              {/* brillo de "hoja mojada" (peróxido) */}
              <ellipse cx={600} cy={340} rx={130} ry={180} fill="#fff" opacity={0.12} />
            </g>

            {/* ── QUEMADURA que crece en el foco (recortada a la hoja) ── */}
            <g clipPath="url(#pxsun-leafclip)">
              <circle
                cx={focalX}
                cy={focalY}
                r={interpolate(burn, [0, 1], [0, 160])}
                fill="url(#pxsun-burn)"
                filter="url(#pxsun-heat)"
                opacity={burn}
              />
              {/* núcleo carbonizado */}
              <circle cx={focalX} cy={focalY} r={interpolate(burn, [0, 1], [0, 46])} fill="#1c1109" opacity={burn * 0.9} />
              {/* motas chamuscadas alrededor del borde */}
              {Array.from({ length: 14 }, (_, i) => {
                const ang = rand(i, 2) * Math.PI * 2;
                const rad = interpolate(burn, [0, 1], [0, 150]) * (0.7 + rand(i, 3) * 0.4);
                const px = focalX + Math.cos(ang) * rad;
                const py = focalY + Math.sin(ang) * rad;
                const r = burn * (4 + rand(i, 4) * 10);
                return <circle key={"ch" + i} cx={px} cy={py} r={r} fill={BURN} opacity={burn * 0.6} />;
              })}
            </g>

            {/* ── HAZ CONVERGENTE del sol a través de la lupa ── */}
            {frame >= F_FOCUS && (
              <g opacity={focus}>
                {/* cono de luz desde la lupa al punto */}
                <path
                  d={`M ${lupaCX - lensR * 0.5} ${lupaCY} L ${focalX - 6} ${focalY} L ${focalX + 6} ${focalY} L ${lupaCX + lensR * 0.5} ${lupaCY} Z`}
                  fill="url(#pxsun-hot)"
                  opacity={0.55 * focus}
                />
                {/* punto caliente pulsante */}
                <circle
                  cx={focalX}
                  cy={focalY}
                  r={16 + Math.sin(frame / 4) * 4}
                  fill="#FFF3D0"
                  opacity={focus}
                />
                <circle cx={focalX} cy={focalY} r={interpolate((frame - F_FOCUS) % 40, [0, 40], [10, 90])} fill="none" stroke={SUN} strokeWidth={3} opacity={focus * interpolate((frame - F_FOCUS) % 40, [0, 40], [0.6, 0])} />
              </g>
            )}

            {/* ── HUMO subiendo del punto quemado ── */}
            {frame >= F_BURN && (
              <g>
                {Array.from({ length: 16 }, (_, i) => {
                  const span = 90 + Math.floor(rand(i, 5) * 70);
                  const p = ((frame - F_BURN + rand(i, 6) * span) % span) / span;
                  const sx = focalX + wobble(i, frame, 0.9) * (16 + p * 60);
                  const sy = focalY - p * 320;
                  const sr = (10 + rand(i, 7) * 18) * (0.6 + p * 1.4);
                  const op = Math.sin(p * Math.PI) * burn * 0.5;
                  return <circle key={"sm" + i} cx={sx} cy={sy} r={sr} fill="#6b625a" opacity={op} />;
                })}
              </g>
            )}

            {/* ── LUPA (mango + aro + cristal) que entra con resorte ── */}
            <g
              opacity={lupaIn}
              transform={`translate(${lupaCX} ${lupaCY})`}
            >
              {/* mango de madera hacia arriba-izq */}
              <g transform="rotate(-38)">
                <rect x={-16} y={lensR - 6} width={32} height={200} rx={16} fill={COLORS.amber} />
                <rect x={-16} y={lensR - 6} width={32} height={200} rx={16} fill="#000" opacity={0.14} />
                <rect x={-10} y={lensR + 4} width={8} height={180} rx={4} fill="#fff" opacity={0.16} />
              </g>
              {/* aro metálico */}
              <circle cx={0} cy={0} r={lensR + 14} fill="none" stroke={COLORS.text} strokeWidth={20} opacity={0.9} />
              <circle cx={0} cy={0} r={lensR + 14} fill="none" stroke={COLORS.amber} strokeWidth={6} opacity={0.5} />
              {/* cristal */}
              <circle cx={0} cy={0} r={lensR} fill="url(#pxsun-glass)" />
              {/* reflejo del cristal */}
              <ellipse cx={-lensR * 0.3} cy={-lensR * 0.35} rx={lensR * 0.4} ry={lensR * 0.22} fill="#fff" opacity={0.28} transform="rotate(-30)" />
            </g>

            {/* ── ETIQUETAS de peligro ── */}
            <InkDraw
              d={`M ${focalX + 200} ${focalY - 20} L ${focalX + 70} ${focalY}`}
              at={F_BURN + 4}
              duration={20}
              color={acc}
              width={4}
              length={200}
            />
            <g opacity={lab(2.2)} transform={`translate(${focalX + 220} ${focalY - 20})`} textAnchor="start">
              <text fontSize={40} fontWeight={900} fill={acc} fontFamily={FONT_STACK} style={{ paintOrder: "stroke", stroke: COLORS.bg0, strokeWidth: 6 }}>
                Quemadura + humo
              </text>
            </g>
          </svg>
        </div>
      </AbsoluteFill>

      {/* ── SELLO de PELIGRO estampado (arriba-izq del PiP) ── */}
      <div style={{ position: "absolute", left: 96, bottom: 92 }}>
        <RimLight color={acc} spread={22} x={0.6} y={0.3}>
          <WaxSeal at={sec(2.4)} size={150} color={acc} initials="!" />
        </RimLight>
      </div>
      <div style={{ position: "absolute", left: 260, bottom: 118, opacity: interpolate(lab(2.6), [0, 1], [0, 1]) }}>
        <DepthShadow radius={18} distance={24} style={{ background: "rgba(34,30,26,0.86)", padding: "12px 22px" }}>
          <div style={{ fontFamily: FONT_STACK, fontSize: 30, fontWeight: 800, color: "#EFE7D3", letterSpacing: 0.5 }}>
            Aplicar SIEMPRE a la sombra
          </div>
        </DepthShadow>
      </div>

      {/* brasas cálidas + grano de papel */}
      <ParallaxLayer depth={0.6} driftY={-16}>
        <ParticleField count={14} kind="embers" rise drift={24} opacity={0.4 * burn} color={COLORS.danger} />
      </ParallaxLayer>
      <PaperGrain opacity={0.1} scale={0.85} seed={17} />
    </AbsoluteFill>
  );
};

export default PxSunLupa;

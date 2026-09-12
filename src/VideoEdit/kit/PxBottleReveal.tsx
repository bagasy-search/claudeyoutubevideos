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
  GodRays,
  RimLight,
  Frame3D,
  PaperGrain,
  SvgFilters,
  rand,
  wobble,
} from "./depth";

// ═══════════════════════════════════════════════════════════════════════════
// PxBottleReveal — PIEZA ÚNICA para el momento CIENCIA: "es oxígeno puro saliendo".
// Botella marrón de agua oxigenada 3% modelada en 3D (Frame3D perspectiva real).
// La TAPA se destornilla y sube, y del cuello brota una COLUMNA de burbujas de O₂
// con bloom cálido. Rayos volumétricos de taller cayendo sobre el vidrio ámbar,
// RimLight que recorta la botella del papel. Marca terrosa-vintage.
//
// RENDER-SAFE: cero Date.now / Math.random / new Date. Todo deriva de
// useCurrentFrame(); el "azar" de las burbujas es determinístico por índice.
// 1920x1080. Esquina inferior-derecha libre para el avatar PiP.
// ═══════════════════════════════════════════════════════════════════════════

const GLASS_HI = "#8A5A2E"; // ámbar cristal iluminado
const GLASS = "#5C3A1C"; // marrón vidrio farmacia
const GLASS_LO = "#3A2410"; // sombra del vidrio
const LIQUID = "#C9D8CE"; // líquido peróxido claro (verdoso pálido)
const CAP = "#EAE0C8"; // tapa crema/hueso
const O2 = COLORS.cold; // burbuja O₂ liberada = eucalipto
const LABEL_BG = "#EFE7D3";

export const PxBottleReveal: React.FC<{
  durationInFrames: number;
  label?: string;
}> = ({ durationInFrames, label = "El oxígeno de más se libera" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrada global suave.
  const enter = spring({
    frame,
    fps,
    config: { damping: 200, mass: 1, stiffness: 60 },
  });

  // Apertura de la tapa (resorte): la tapa se destornilla, sube y se ladea.
  const capOpen = spring({
    frame: frame - 26,
    fps,
    config: { damping: 12, mass: 0.8, stiffness: 150 },
  });
  const capLift = interpolate(capOpen, [0, 1], [0, -150]);
  const capSpin = interpolate(capOpen, [0, 1], [0, 420]); // grados de destornillado
  const capTilt = interpolate(capOpen, [0, 1], [0, 26]);
  const capFade = interpolate(capOpen, [0.5, 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // La columna de O₂ arranca cuando la tapa ya se soltó.
  const gush = interpolate(frame, [40, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Idle: micro-balanceo del conjunto (respiración) + latido del bloom.
  const sway = Math.sin(frame / 40) * 1.4;
  const bloom = interpolate(Math.sin(frame / 18), [-1, 1], [0.6, 1]) * gush;

  // Aparición de la etiqueta.
  const labelIn = spring({
    frame: frame - 62,
    fps,
    config: { damping: 18, mass: 0.9, stiffness: 120 },
  });

  const cx = 830; // eje de la botella (dejo la derecha libre para el PiP)
  const capW = 150;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK }}>
      <SvgFilters prefix="pxb" />

      {/* Rayos volumétricos de taller cayendo sobre el vidrio */}
      <GodRays x={44} y={-12} angle={16} intensity={1.05} rays={8} color="rgba(169,121,74,0.22)" />

      {/* Bruma cálida ambiental muy sutil detrás */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.5 }}>
        <ParticleField count={16} kind="dust" rise drift={26} width={1920} height={1080} opacity={0.5} />
      </div>

      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: enter,
          transform: `translateY(${(1 - enter) * 26}px)`,
        }}
      >
        <Frame3D at={4} rotateY={-16} rotateX={5} depth={70} perspective={1400}>
          <div style={{ transform: `rotate(${sway}deg)`, transformOrigin: "50% 90%" }}>
            <RimLight color={COLORS.amber} spread={34} x={0.28} y={0.16}>
              <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ display: "block" }}>
                <defs>
                  <linearGradient id="pxbGlass" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={GLASS_LO} />
                    <stop offset="26%" stopColor={GLASS} />
                    <stop offset="50%" stopColor={GLASS_HI} />
                    <stop offset="74%" stopColor={GLASS} />
                    <stop offset="100%" stopColor={GLASS_LO} />
                  </linearGradient>
                  <linearGradient id="pxbLiquid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={LIQUID} stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#9FB6A8" stopOpacity={0.95} />
                  </linearGradient>
                  <radialGradient id="pxbBloom" cx="50%" cy="50%">
                    <stop offset="0%" stopColor={O2} stopOpacity={0.55} />
                    <stop offset="60%" stopColor={O2} stopOpacity={0.16} />
                    <stop offset="100%" stopColor={O2} stopOpacity={0} />
                  </radialGradient>
                  <linearGradient id="pxbCap" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#C9BE9E" />
                    <stop offset="50%" stopColor={CAP} />
                    <stop offset="100%" stopColor="#B9AE8C" />
                  </linearGradient>
                </defs>

                {/* Sombra en el "piso" de papel */}
                <ellipse cx={cx} cy={880} rx={210} ry={40} fill="#2A2620" opacity={0.18 * enter} />

                {/* Bloom cálido del oxígeno saliendo del cuello */}
                <circle cx={cx} cy={330} r={230} fill="url(#pxbBloom)" opacity={bloom} />

                {/* ── CUERPO de la botella (marrón farmacia, vidrio 3%) ── */}
                <g>
                  {/* cuerpo */}
                  <path
                    d={`M ${cx - 150} 470
                        Q ${cx - 168} 460 ${cx - 168} 500
                        L ${cx - 168} 820
                        Q ${cx - 168} 880 ${cx - 100} 882
                        L ${cx + 100} 882
                        Q ${cx + 168} 880 ${cx + 168} 820
                        L ${cx + 168} 500
                        Q ${cx + 168} 460 ${cx + 150} 470
                        Z`}
                    fill="url(#pxbGlass)"
                    stroke={GLASS_LO}
                    strokeWidth={3}
                  />
                  {/* líquido dentro */}
                  <clipPath id="pxbInner">
                    <path d={`M ${cx - 150} 470 Q ${cx - 168} 460 ${cx - 168} 500 L ${cx - 168} 820 Q ${cx - 168} 880 ${cx - 100} 882 L ${cx + 100} 882 Q ${cx + 168} 880 ${cx + 168} 820 L ${cx + 168} 500 Q ${cx + 168} 460 ${cx + 150} 470 Z`} />
                  </clipPath>
                  <g clipPath="url(#pxbInner)">
                    <rect x={cx - 168} y={540} width={336} height={342} fill="url(#pxbLiquid)" opacity={0.55} />
                    {/* burbujas internas subiendo dentro del líquido */}
                    {Array.from({ length: 14 }, (_, i) => {
                      const span = 90 + rand(i, 1) * 60;
                      const p = ((frame + rand(i, 2) * span) % span) / span;
                      const bx = cx - 130 + rand(i) * 260 + wobble(i, frame, 1.4) * 8;
                      const by = 870 - p * 300;
                      const r = 3 + rand(i, 3) * 6;
                      return (
                        <circle key={"il" + i} cx={bx} cy={by} r={r} fill="#EAF2EC" opacity={Math.sin(p * Math.PI) * 0.6} />
                      );
                    })}
                  </g>
                  {/* reflejo especular vertical */}
                  <rect x={cx - 120} y={500} width={26} height={340} rx={13} fill="#F4E7CE" opacity={0.28} />
                  {/* hombro/cuello */}
                  <path d={`M ${cx - 150} 470 Q ${cx} 430 ${cx + 150} 470 L ${cx + 60} 400 Q ${cx} 388 ${cx - 60} 400 Z`} fill="url(#pxbGlass)" stroke={GLASS_LO} strokeWidth={3} />
                  <rect x={cx - 60} y={356} width={120} height={54} rx={8} fill="url(#pxbGlass)" stroke={GLASS_LO} strokeWidth={3} />

                  {/* ── ETIQUETA de la botella: "H₂O₂ 3%" ── */}
                  <g opacity={0.96}>
                    <rect x={cx - 138} y={560} width={276} height={230} rx={16} fill={LABEL_BG} stroke="#B0503C" strokeWidth={3} opacity={0.94} />
                    <rect x={cx - 138} y={560} width={276} height={44} rx={16} fill="#B0503C" opacity={0.9} />
                    <text x={cx} y={591} fontSize={30} fontWeight={900} fill="#EFE7D3" textAnchor="middle">AGUA OXIGENADA</text>
                    <text x={cx} y={686} fontSize={92} fontWeight={900} fill="#2A2620" textAnchor="middle">H₂O₂</text>
                    <text x={cx} y={748} fontSize={40} fontWeight={800} fill="#7C8A5A" textAnchor="middle">3 %  ·  10 vol</text>
                  </g>
                </g>

                {/* ── TAPA que se destornilla y sube ── */}
                <g
                  opacity={capFade}
                  transform={`translate(${cx} ${300 + capLift}) rotate(${capTilt})`}
                >
                  <g transform={`rotate(${capSpin})`} style={{ transformBox: "fill-box" } as React.CSSProperties}>
                    <rect x={-capW / 2} y={-40} width={capW} height={80} rx={14} fill="url(#pxbCap)" stroke="#9E9270" strokeWidth={3} />
                    {/* estrías de la tapa */}
                    {Array.from({ length: 9 }, (_, i) => (
                      <line key={"rib" + i} x1={-capW / 2 + 10 + i * ((capW - 20) / 8)} y1={-38} x2={-capW / 2 + 10 + i * ((capW - 20) / 8)} y2={38} stroke="#9E9270" strokeWidth={2} opacity={0.5} />
                    ))}
                    <ellipse cx={0} cy={-34} rx={capW / 2 - 6} ry={12} fill="#F1E8CE" />
                  </g>
                </g>

                {/* ── COLUMNA de burbujas de O₂ brotando del cuello (bloom, loop) ── */}
                {gush > 0 &&
                  Array.from({ length: 30 }, (_, i) => {
                    const span = 96 + rand(i, 5) * 70;
                    const p = ((frame * 1.9 + rand(i, 6) * span) % span) / span;
                    // más angosto en la boca, se abre al subir (columna que florece)
                    const spread = 18 + p * 150;
                    const bx = cx + (rand(i) - 0.5) * spread + wobble(i, frame, 1.8) * 10;
                    const by = 372 - p * 330;
                    const r = (5 + rand(i, 7) * 12) * (0.5 + p * 0.7);
                    const op = Math.sin(p * Math.PI) * 0.85 * gush;
                    return (
                      <g key={"o2" + i} opacity={op}>
                        <circle cx={bx} cy={by} r={r} fill={O2} opacity={0.45} />
                        <circle cx={bx} cy={by} r={r} fill="none" stroke={O2} strokeWidth={2.5} />
                        <ellipse cx={bx - r * 0.3} cy={by - r * 0.3} rx={r * 0.34} ry={r * 0.24} fill="#fff" opacity={0.6} />
                      </g>
                    );
                  })}

                {/* símbolo O₂ ↑ arriba, a dónde va el gas */}
                <g opacity={interpolate(gush, [0.3, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} transform={`translate(${cx} 96)`}>
                  <rect x={-104} y={-44} width={208} height={88} rx={44} fill={O2} opacity={0.16} />
                  <text x={0} y={16} fontSize={52} fontWeight={900} fill={O2} textAnchor="middle">O₂ ↑</text>
                </g>
              </svg>
            </RimLight>
          </div>
        </Frame3D>
      </AbsoluteFill>

      {/* Etiqueta de texto (prop) — abajo a la izquierda, lejos del PiP */}
      <div
        style={{
          position: "absolute",
          left: 90,
          bottom: 96,
          maxWidth: 780,
          opacity: labelIn,
          transform: `translateY(${(1 - labelIn) * 18}px)`,
        }}
      >
        <div style={{ display: "inline-block", background: "rgba(239,231,211,0.92)", border: "1px solid rgba(42,38,32,0.16)", borderRadius: 18, padding: "18px 30px", boxShadow: "0 18px 44px rgba(42,38,32,0.18)" }}>
          <span style={{ fontSize: 46, fontWeight: 800, color: COLORS.cold }}>{label}</span>
        </div>
      </div>

      <PaperGrain opacity={0.1} scale={0.85} />
    </AbsoluteFill>
  );
};

export default PxBottleReveal;

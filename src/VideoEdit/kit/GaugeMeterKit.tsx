import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, FONT_STACK } from "../theme";
import { TechBackground } from "../components/TechBackground";
import { SfxCue, SFX } from "../components/Sfx";
import {
  ParticleField,
  GodRays,
  DepthShadow,
  Odometer,
  InkDraw,
  PaperGrain,
  SvgFilters,
  RimLight,
  wobble,
} from "./depth";

// ─────────────────────────────────────────────────────────────────────────────
// GaugeMeterKit — MEDIDOR DE AGUJA semicircular de latón/almanaque (nivel, riesgo,
// humedad, presión…). Genérico y PROP-DRIVEN: el tema entra por props.
//   • Huerta:    title="Humedad del suelo"  value=38  unit="%"
//   • Reparación:title="Presión de la junta" value=72  unit="psi"
//   • Amish:     title="Nivel del tonel"     value=90  unit="%"
// Técnica: dial de bronce con emboss, arco de zonas dibujado a tinta (InkDraw),
// aguja que se asienta con spring + rebote, sombra 3D multicapa, rayos de luz
// cálida de taller, polvo flotante y un Odómetro que rueda hasta el valor.
// RENDER-SAFE: todo deriva de useCurrentFrame() (interpolate/spring). Sin azar real.
// ─────────────────────────────────────────────────────────────────────────────

type Zone = { to: number; color: string };

export const GaugeMeterKit: React.FC<{
  durationInFrames: number;
  title?: string;
  subtitle?: string;
  accent?: string;
  value?: number;
  min?: number;
  max?: number;
  zones?: Zone[];
  unit?: string;
}> = ({
  durationInFrames,
  title = "Nivel medido",
  subtitle = "según la lectura del instrumento",
  accent = COLORS.amber,
  value = 65,
  min = 0,
  max = 100,
  zones = [
    { to: 40, color: COLORS.good },
    { to: 70, color: COLORS.amber },
    { to: 100, color: COLORS.danger },
  ],
  unit = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── entrada general del dial ────────────────────────────────────────────────
  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 55 } });
  // ── aguja: se asienta con rebote hacia el valor (arranca del mínimo) ─────────
  const needleS = spring({ frame: frame - 14, fps, config: { damping: 11, mass: 1.1, stiffness: 90 }, durationInFrames: 70 });

  // Geometría del arco (viewBox 1600x900). Semicírculo de −200°..20° (240° de barrido).
  const cx = 800;
  const cy = 600;
  const R = 330; // radio del arco de zonas
  const A0 = 200; // ángulo inicial (grados, medido desde el eje X positivo, sentido horario visual)
  const SWEEP = 260; // barrido total del dial

  const clamp = (v: number) => Math.max(min, Math.min(max, v));
  const norm = (v: number) => (clamp(v) - min) / (max - min || 1);
  // ángulo en grados para una fracción 0..1 del dial
  const angForFrac = (f: number) => A0 + f * SWEEP;
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const ptOnArc = (deg: number, r: number): [number, number] => [
    cx + Math.cos(rad(deg)) * r,
    cy - Math.sin(rad(deg)) * r,
  ];
  // arco SVG entre dos fracciones (para las zonas de color)
  const arcPath = (f0: number, f1: number, r: number) => {
    const [x0, y0] = ptOnArc(angForFrac(f0), r);
    const [x1, y1] = ptOnArc(angForFrac(f1), r);
    const large = f1 - f0 > 0.5 ? 1 : 0;
    // sweep-flag 0 porque el ángulo crece en sentido antihorario matemático
    return `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 0 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  };

  // fracción actual de la aguja (0 en reposo → valor)
  const targetFrac = norm(value);
  const liveFrac = targetFrac * needleS + wobble(0, frame, 0.5) * 0.004 * enter; // micro-vibración de instrumento
  const needleAng = angForFrac(liveFrac);

  // aguja como triángulo largo
  const [tipX, tipY] = ptOnArc(needleAng, R - 34);
  const perpAng = needleAng + 90;
  const [pdx, pdy] = [Math.cos(rad(perpAng)), -Math.sin(rad(perpAng))];
  const baseHalf = 16;
  const bx = cx + Math.cos(rad(needleAng)) * -60; // cola
  const by = cy - Math.sin(rad(needleAng)) * -60;

  // ticks del dial (11 marcas mayores)
  const majorTicks = 10;
  // El valor bajo la aguja (para el Odómetro) sigue a needleS
  const shownValue = value; // Odometer anima solo desde 0

  const zoneColorAt = (v: number) => {
    for (const z of zones) if (clamp(v) <= z.to) return z.color;
    return zones[zones.length - 1]?.color ?? accent;
  };
  const curColor = zoneColorAt(value);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK }}>
      <SvgFilters prefix="gauge" />
      <TechBackground glowX={50} glowY={30} hue="amber" drift={0.3} />
      <GodRays x={62} y={-14} angle={20} color="rgba(169,121,74,0.16)" intensity={1} rays={7} />
      <ParticleField count={20} kind="dust" rise drift={26} opacity={0.5} />
      <SfxCue at={0} src={SFX.whoosh} volume={0.35} />
      <SfxCue at={14} src={SFX.barGrow} volume={0.3} durationInFrames={60} />
      <SfxCue at={64} src={SFX.numberSlam} volume={0.32} />

      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "92%", maxWidth: 1600, opacity: enter, transform: `translateY(${(1 - enter) * 26}px)` }}>
          {/* título */}
          <div style={{ textAlign: "center", marginBottom: 4 }}>
            <div style={{ letterSpacing: 6, fontSize: 21, fontWeight: 700, textTransform: "uppercase", color: accent }}>
              {subtitle}
            </div>
            <div style={{ fontSize: 58, fontWeight: 800, color: COLORS.text, marginTop: 2 }}>{title}</div>
          </div>

          <svg viewBox="0 0 1600 900" width="100%" style={{ display: "block" }}>
            <defs>
              {/* latón/bronce del dial */}
              <radialGradient id="gaugeBrass" cx="42%" cy="34%">
                <stop offset="0%" stopColor="#F3E4C4" />
                <stop offset="42%" stopColor="#D8BE8E" />
                <stop offset="78%" stopColor="#A9794A" />
                <stop offset="100%" stopColor="#6E4E2E" />
              </radialGradient>
              <radialGradient id="gaugeFace" cx="46%" cy="30%">
                <stop offset="0%" stopColor="#F7EFDC" />
                <stop offset="70%" stopColor="#EDE1C4" />
                <stop offset="100%" stopColor="#DAC9A4" />
              </radialGradient>
              <radialGradient id="gaugeGlass" cx="38%" cy="26%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity={0.5} />
                <stop offset="40%" stopColor="#ffffff" stopOpacity={0.06} />
                <stop offset="100%" stopColor="#000000" stopOpacity={0.12} />
              </radialGradient>
              <radialGradient id="gaugeHub" cx="40%" cy="34%">
                <stop offset="0%" stopColor="#5a4126" />
                <stop offset="60%" stopColor="#3a2a17" />
                <stop offset="100%" stopColor="#20160c" />
              </radialGradient>
            </defs>

            {/* ── sombra 3D bajo el dial (varias capas apiladas via SVG) ── */}
            {Array.from({ length: 6 }, (_, i) => {
              const t = (i + 1) / 6;
              return (
                <ellipse
                  key={"sh" + i}
                  cx={cx}
                  cy={cy + 40 + t * 30}
                  rx={R + 96 - t * 20}
                  ry={(R + 96 - t * 20) * 0.5}
                  fill="rgba(42,38,32,0.05)"
                />
              );
            })}

            {/* ── aro exterior de latón (bisel) ── */}
            <circle cx={cx} cy={cy} r={R + 92} fill="url(#gaugeBrass)" filter="url(#gauge-emboss)" opacity={0.98} />
            <circle cx={cx} cy={cy} r={R + 92} fill="none" stroke="#3a2a17" strokeWidth={5} opacity={0.5} />
            <circle cx={cx} cy={cy} r={R + 62} fill="none" stroke="#F3E4C4" strokeWidth={3} opacity={0.5} />
            {/* tornillos del bisel */}
            {Array.from({ length: 8 }, (_, i) => {
              const a = (i / 8) * 360 - 90;
              const [sx, sy] = ptOnArc(a, R + 78);
              return (
                <g key={"scr" + i}>
                  <circle cx={sx} cy={sy} r={9} fill="#7a5a34" stroke="#3a2a17" strokeWidth={2} />
                  <line x1={sx - 5} y1={sy} x2={sx + 5} y2={sy} stroke="#2a1c10" strokeWidth={2} transform={`rotate(${i * 24} ${sx} ${sy})`} />
                </g>
              );
            })}

            {/* ── cara del instrumento ── */}
            <circle cx={cx} cy={cy} r={R + 58} fill="url(#gaugeFace)" />
            <circle cx={cx} cy={cy} r={R + 58} fill="none" stroke="rgba(42,38,32,0.18)" strokeWidth={2} />

            {/* ── arco de zonas de color, DIBUJADO A TINTA (InkDraw progresivo) ── */}
            {(() => {
              let acc = min;
              return zones.map((z, i) => {
                const f0 = norm(acc);
                const f1 = norm(z.to);
                acc = z.to;
                const at = 6 + i * 8;
                const seg = arcPath(f0, f1, R);
                return (
                  <g key={"zone" + i}>
                    <InkDraw d={seg} at={at} duration={22} color={z.color} width={30} length={1200} />
                    <InkDraw d={seg} at={at} duration={22} color="rgba(0,0,0,0.12)" width={30} length={1200} />
                  </g>
                );
              });
            })()}

            {/* ── ticks + números del dial ── */}
            {Array.from({ length: majorTicks + 1 }, (_, i) => {
              const f = i / majorTicks;
              const a = angForFrac(f);
              const [o1x, o1y] = ptOnArc(a, R - 46);
              const [o2x, o2y] = ptOnArc(a, R - 74);
              const [lx, ly] = ptOnArc(a, R - 108);
              const appear = interpolate(frame, [10 + i * 2, 22 + i * 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const tickVal = Math.round(min + f * (max - min));
              return (
                <g key={"tk" + i} opacity={appear}>
                  <line x1={o1x} y1={o1y} x2={o2x} y2={o2y} stroke={COLORS.ink} strokeWidth={4} strokeLinecap="round" />
                  <text x={lx} y={ly + 12} textAnchor="middle" fontSize={30} fontWeight={700} fill={COLORS.textSoft} fontFamily={FONT_STACK}>
                    {tickVal}
                  </text>
                </g>
              );
            })}
            {/* ticks menores */}
            {Array.from({ length: majorTicks * 5 + 1 }, (_, i) => {
              if (i % 5 === 0) return null;
              const f = i / (majorTicks * 5);
              const a = angForFrac(f);
              const [o1x, o1y] = ptOnArc(a, R - 46);
              const [o2x, o2y] = ptOnArc(a, R - 60);
              const appear = interpolate(frame, [14, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return <line key={"mtk" + i} x1={o1x} y1={o1y} x2={o2x} y2={o2y} stroke="rgba(42,38,32,0.4)" strokeWidth={2} opacity={appear} />;
            })}

            {/* ── vidrio del instrumento (reflejo) ── */}
            <circle cx={cx} cy={cy} r={R + 40} fill="url(#gaugeGlass)" opacity={0.6} />
            <ellipse cx={cx - 120} cy={cy - 150} rx={150} ry={70} fill="#fff" opacity={0.12} transform={`rotate(-28 ${cx - 120} ${cy - 150})`} />

            {/* ── AGUJA ── (aparece tras las zonas, se asienta con rebote) */}
            <g opacity={interpolate(needleS, [0, 0.06], [0, 1], { extrapolateRight: "clamp" })}>
              {/* sombra de la aguja proyectada */}
              <polygon
                points={`${tipX + 6},${tipY + 8} ${cx + pdx * baseHalf + 6},${cy + pdy * baseHalf + 8} ${cx - pdx * baseHalf + 6},${cy - pdy * baseHalf + 8}`}
                fill="rgba(42,38,32,0.22)"
              />
              {/* cuerpo de la aguja */}
              <polygon
                points={`${tipX},${tipY} ${cx + pdx * baseHalf},${cy + pdy * baseHalf} ${cx - pdx * baseHalf},${cy - pdy * baseHalf}`}
                fill={curColor}
                stroke="#2a1c10"
                strokeWidth={2}
              />
              {/* cola / contrapeso */}
              <line x1={cx} y1={cy} x2={bx} y2={by} stroke="#2a1c10" strokeWidth={13} strokeLinecap="round" />
              {/* highlight de la aguja */}
              <polygon
                points={`${tipX},${tipY} ${cx + pdx * (baseHalf * 0.4)},${cy + pdy * (baseHalf * 0.4)} ${cx},${cy}`}
                fill="#fff"
                opacity={0.22}
              />
            </g>

            {/* ── cubo central (pivote embutido) ── */}
            <circle cx={cx} cy={cy} r={40} fill="url(#gaugeHub)" stroke="#7a5a34" strokeWidth={3} />
            <circle cx={cx} cy={cy} r={16} fill="#C8A96A" opacity={0.8} />
            <circle cx={cx - 5} cy={cy - 6} r={5} fill="#fff" opacity={0.35} />

            {/* ── etiqueta de zona actual (chip) sobre el arco ── */}
            {(() => {
              const chipS = spring({ frame: frame - 58, fps, config: { damping: 12, mass: 0.7, stiffness: 150 } });
              const [chx, chy] = ptOnArc(angForFrac(targetFrac), R + 8);
              return (
                <g opacity={chipS} transform={`translate(${chx} ${chy}) scale(${0.6 + chipS * 0.4})`}>
                  <circle r={13} fill={curColor} stroke="#2a1c10" strokeWidth={2} />
                  <circle r={5} fill="#fff" opacity={0.6} />
                </g>
              );
            })()}
          </svg>

          {/* ── LECTURA numérica (Odómetro rodante) bajo el dial ── */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: -70 }}>
            <RimLight color={curColor} spread={22} x={0.5} y={0.3}>
              <DepthShadow layers={5} distance={30} radius={18} style={{ background: "rgba(239,231,211,0.94)", border: "2px solid rgba(42,38,32,0.2)", padding: "8px 34px" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <Odometer value={shownValue} digits={String(Math.round(max)).length} durationInFrames={64} size={86} color={curColor} />
                  {unit && <span style={{ fontSize: 46, fontWeight: 800, color: COLORS.textSoft }}>{unit}</span>}
                </div>
              </DepthShadow>
            </RimLight>
          </div>
        </div>
      </AbsoluteFill>

      <PaperGrain opacity={0.1} scale={0.85} />
    </AbsoluteFill>
  );
};

export default GaugeMeterKit;

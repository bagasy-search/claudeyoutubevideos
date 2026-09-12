import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import { TechBackground } from "../components/TechBackground";
import { SfxCue, SFX } from "../components/Sfx";
import {
  DepthShadow,
  Odometer,
  GodRays,
  PaperGrain,
  ParticleField,
  InkDraw,
  RimLight,
  rand,
  wobble,
} from "./depth";

// ═══════════════════════════════════════════════════════════════════════════
// BarChartKit — barras VERTICALES que crecen desde la base con sus valores.
// GENÉRICO y PROP-DRIVEN. Sirve a los 3 nichos:
//   • huerta:     rinde por método de riego (litros/kg)
//   • reparación: durabilidad por material (años)
//   • amish:      producción por temporada (fanegas)
// Técnica: cada barra sube con un spring (rebote suave al aterrizar), un Odometer
// rueda el valor arriba, DepthShadow le da relieve de columna 3D (cara lateral
// falsa + brillo cenital), la barra líder recibe RimLight, y sube polvo dorado
// (ParticleField) desde la base como si el crecimiento levantara tierra. El eje y
// las guías se trazan con tinta (InkDraw). Render-safe: todo por useCurrentFrame().
// ═══════════════════════════════════════════════════════════════════════════

type Bar = { label: string; value: number };

export const BarChartKit: React.FC<{
  durationInFrames: number;
  title?: string;
  subtitle?: string;
  accent?: string;
  bars?: Bar[];
  unit?: string;
}> = ({
  durationInFrames,
  title = "Cuánto rinde cada uno",
  subtitle = "Medido en el mismo cantero",
  accent = COLORS.accent,
  bars = [
    { label: "A mano", value: 42 },
    { label: "Con manguera", value: 65 },
    { label: "Por goteo", value: 88 },
    { label: "Con olla", value: 74 },
  ],
  unit = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 200, mass: 1, stiffness: 55 },
  });

  const data = bars.slice(0, 6);
  const maxV = Math.max(...data.map((b) => b.value), 1);
  const leadIdx = data.reduce((m, b, i) => (b.value > data[m].value ? i : m), 0);

  // geometría del plot (viewBox lógico en px de layout)
  const plotH = 520; // alto máximo de barra (las barras crecen hacia arriba desde el piso)
  const barW = 150;
  const gap = 46;
  const paletteFor = (i: number, lead: boolean) =>
    lead
      ? accent
      : [COLORS.amber, COLORS.cold, COLORS.good, "#B98A50", "#8C9A66"][i % 5];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK }}>
      <TechBackground glowX={50} glowY={26} hue="amber" drift={0.35} />
      <GodRays x={52} y={-14} angle={18} color="rgba(169,121,74,0.15)" rays={8} />
      <SfxCue at={0} src={SFX.whoosh} volume={0.4} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 90px 80px",
        }}
      >
        {/* encabezado */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 30,
            opacity: enter,
            transform: `translateY(${(1 - enter) * -20}px)`,
          }}
        >
          <div
            style={{
              letterSpacing: 6,
              fontSize: 22,
              fontWeight: 700,
              textTransform: "uppercase",
              color: COLORS.amber,
              marginBottom: 6,
            }}
          >
            {subtitle}
          </div>
          <div style={{ fontSize: 64, fontWeight: 800, color: COLORS.text, lineHeight: 1.03 }}>
            {title}
          </div>
        </div>

        {/* área del gráfico */}
        <div
          style={{
            position: "relative",
            height: plotH + 190,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            gap,
            padding: "0 40px",
          }}
        >
          {/* líneas guía horizontales de tinta (25/50/75/100%) */}
          <svg
            viewBox={`0 0 1200 ${plotH + 60}`}
            width={1200}
            height={plotH + 60}
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              left: "50%",
              bottom: 92,
              transform: "translateX(-50%)",
              pointerEvents: "none",
              overflow: "visible",
            }}
          >
            {[0.25, 0.5, 0.75, 1].map((g, i) => {
              const y = plotH - g * plotH + 10;
              return (
                <InkDraw
                  key={i}
                  d={`M 20 ${y} L 1180 ${y}`}
                  at={sec(0.4) + i * 5}
                  duration={24}
                  length={1200}
                  color="rgba(42,38,32,0.16)"
                  width={2}
                />
              );
            })}
            {/* eje base */}
            <InkDraw
              d={`M 12 ${plotH + 12} L 1188 ${plotH + 12}`}
              at={sec(0.3)}
              duration={26}
              length={1200}
              color="rgba(42,38,32,0.55)"
              width={4}
            />
          </svg>

          {data.map((b, i) => {
            const at = sec(0.55) + i * 8;
            const grow = spring({
              frame: frame - at,
              fps,
              config: { damping: 15, mass: 0.9, stiffness: 120 },
            });
            const h = (b.value / maxV) * plotH * grow;
            const isLead = i === leadIdx;
            const col = paletteFor(i, isLead);
            const sideW = 20; // cara lateral 3D
            const sway = wobble(i, frame, 0.6) * 2;

            const barVisual = (
              <div
                style={{
                  position: "relative",
                  width: barW,
                  height: h,
                  transform: `translateY(${sway}px)`,
                }}
              >
                {/* cara lateral (profundidad 3D) */}
                <div
                  style={{
                    position: "absolute",
                    right: -sideW,
                    top: sideW * 0.55,
                    width: sideW,
                    height: h,
                    background: `linear-gradient(${col}, ${col})`,
                    filter: "brightness(0.72)",
                    transform: "skewY(-32deg)",
                    borderTopRightRadius: 6,
                    transformOrigin: "top",
                  }}
                />
                {/* tapa superior */}
                <div
                  style={{
                    position: "absolute",
                    right: -sideW,
                    top: -sideW * 0.45,
                    width: barW,
                    height: sideW,
                    background: col,
                    filter: "brightness(1.18)",
                    transform: "skewX(-58deg)",
                    transformOrigin: "left top",
                    borderRadius: 3,
                  }}
                />
                {/* cara frontal */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(180deg, ${col} 0%, ${col} 60%, rgba(0,0,0,0.12) 100%)`,
                    borderRadius: "8px 8px 0 0",
                    boxShadow:
                      "inset 0 2px 0 rgba(255,255,255,0.35), inset -8px 0 20px rgba(0,0,0,0.14)",
                  }}
                />
                {/* vetas de textura de papel/madera en la barra */}
                <svg
                  viewBox={`0 0 ${barW} 100`}
                  preserveAspectRatio="none"
                  width={barW}
                  height={h}
                  style={{ position: "absolute", inset: 0, opacity: 0.12 }}
                >
                  {Array.from({ length: 5 }, (_, k) => (
                    <line
                      key={k}
                      x1={0}
                      x2={barW}
                      y1={12 + k * 20 + rand(i * 5 + k) * 6}
                      y2={14 + k * 20 + rand(i * 5 + k, 2) * 6}
                      stroke="#2A2620"
                      strokeWidth={1.5}
                    />
                  ))}
                </svg>
              </div>
            );

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  zIndex: 2,
                }}
              >
                {/* valor con odómetro, flotando sobre la barra */}
                <div
                  style={{
                    opacity: interpolate(grow, [0.15, 0.6], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
                    marginBottom: 14,
                    transform: `translateY(${interpolate(grow, [0, 1], [12, 0])}px)`,
                    display: "flex",
                    alignItems: "baseline",
                    gap: 4,
                  }}
                >
                  <Odometer
                    value={b.value}
                    digits={String(Math.round(b.value)).length}
                    durationInFrames={30}
                    size={44}
                    color={isLead ? accent : COLORS.text}
                  />
                  {unit && (
                    <span
                      style={{
                        fontSize: 24,
                        fontWeight: 700,
                        color: COLORS.textSoft,
                      }}
                    >
                      {unit}
                    </span>
                  )}
                </div>

                <DepthShadow
                  distance={26}
                  radius={8}
                  color="rgba(42,38,32,0.22)"
                  style={{ borderRadius: "8px 8px 0 0" }}
                >
                  {isLead ? (
                    <RimLight color={accent} spread={22} x={0.5} y={0.15}>
                      {barVisual}
                    </RimLight>
                  ) : (
                    barVisual
                  )}
                </DepthShadow>

                {/* etiqueta bajo la barra */}
                <div
                  style={{
                    marginTop: 22,
                    fontSize: 30,
                    fontWeight: isLead ? 800 : 600,
                    color: isLead ? accent : COLORS.text,
                    textAlign: "center",
                    maxWidth: barW + 60,
                    opacity: interpolate(grow, [0.2, 0.7], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
                  }}
                >
                  {b.label}
                </div>
              </div>
            );
          })}

          {/* polvo dorado que sube desde la base al crecer las barras */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 92,
              height: 260,
              pointerEvents: "none",
            }}
          >
            <ParticleField count={18} kind="dust" rise drift={14} opacity={0.6} height={260} />
          </div>
        </div>
      </AbsoluteFill>

      <PaperGrain opacity={0.1} scale={0.85} />
    </AbsoluteFill>
  );
};

export default BarChartKit;

import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, AbsoluteFill } from "remotion";
import { COLORS, FONT_STACK } from "../theme";
import {
  ParallaxLayer,
  ParticleField,
  GodRays,
  DepthShadow,
  Odometer,
  SvgFilters,
  PaperGrain,
  RimLight,
  rand,
  wobble,
} from "./depth";

// ═══════════════════════════════════════════════════════════════════════════
// BigStatKit — LA CIFRA PROTAGONISTA
// Una sola métrica gigante que domina la pantalla como un cartel de almanaque:
// un número que RUEDA (odómetro) sobre una placa de papel levantada del fondo,
// bañada por rayos de luz de taller y polvo suspendido. Etiqueta y contexto
// alrededor. Genérico y prop-driven: sirve para "−70% de agua" (huerta),
// "150 años de uso" (amish) o "3× más resistente" (reparación).
// technique: Odometer, DepthShadow, ParticleField dust, GodRays.
// ═══════════════════════════════════════════════════════════════════════════

export interface BigStatKitProps {
  durationInFrames: number;
  title?: string; // eyebrow superior (mayúsculas)
  subtitle?: string; // línea inferior de contexto
  accent?: string; // color de la cifra
  value?: number; // número objetivo
  unit?: string; // sufijo pegado a la cifra (%, ×, años…)
  caption?: string; // etiqueta grande bajo la cifra
  prefix?: string; // prefijo pegado a la cifra (−, +, $…)
}

export const BigStatKit: React.FC<BigStatKitProps> = ({
  durationInFrames,
  title = "SEGÚN EL ALMANAQUE",
  subtitle = "medido a lo largo de una temporada entera",
  accent = COLORS.amber,
  value = 70,
  unit = "%",
  caption = "menos agua",
  prefix = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 60 } });
  const plate = spring({ frame: frame - 4, fps, config: { damping: 16, mass: 1, stiffness: 90 } });
  const capIn = spring({ frame: frame - 22, fps, config: { damping: 18, mass: 0.9, stiffness: 120 } });
  const subIn = spring({ frame: frame - 30, fps, config: { damping: 20, mass: 0.9, stiffness: 120 } });

  // respiración/idle sutil de la placa entera
  const breathe = 1 + Math.sin(frame / 46) * 0.006;
  const tilt = Math.sin(frame / 90) * 0.5;

  // dígitos objetivo (para escalar el ancho del odómetro)
  const digitCount = Math.max(1, Math.floor(Math.abs(value)).toString().length);
  const numSize = digitCount >= 4 ? 300 : digitCount === 3 ? 340 : 380;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK, overflow: "hidden" }}>
      <SvgFilters prefix="bigstat" />

      {/* ── FONDO PROFUNDO: viñeta cálida + gradiente de establo ── */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 90% at 42% 24%, ${COLORS.bg0} 0%, ${COLORS.bg1} 46%, ${COLORS.bg2} 100%)`,
        }}
      />
      <ParallaxLayer depth={0.18} driftX={14} driftY={10}>
        <AbsoluteFill style={{ opacity: 0.5 }}>
          <PaperGrain opacity={0.14} scale={0.85} seed={7} />
        </AbsoluteFill>
      </ParallaxLayer>

      {/* rayos de luz volumétrica cayendo desde arriba-izquierda del taller */}
      <GodRays x={30} y={-14} angle={20} color="rgba(169,121,74,0.22)" intensity={1} rays={8} />

      {/* polvo suspendido: dos capas a distinta profundidad */}
      <ParallaxLayer depth={0.35} driftX={22} driftY={16}>
        <ParticleField count={26} kind="dust" rise={false} drift={26} color={COLORS.amber} opacity={0.55} />
      </ParallaxLayer>
      <ParallaxLayer depth={0.7} driftX={40} driftY={26}>
        <ParticleField count={16} kind="dust" rise drift={34} color={COLORS.accentSoft} opacity={0.4} />
      </ParallaxLayer>

      {/* ── CONTENIDO CENTRAL ── */}
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            transform: `scale(${(0.9 + enter * 0.1) * breathe}) rotate(${tilt}deg)`,
            opacity: enter,
            width: 1180,
            maxWidth: "88%",
            // dejar libre la esquina inferior derecha: empujar la placa a la izquierda-arriba
            marginRight: 180,
            marginBottom: 90,
          }}
        >
          <RimLight color={accent} spread={30} x={0.28} y={0.16}>
            <DepthShadow layers={6} distance={54} radius={30} color="rgba(42,38,32,0.20)">
              <div
                style={{
                  position: "relative",
                  borderRadius: 30,
                  padding: "58px 70px 64px",
                  background:
                    "linear-gradient(160deg, rgba(247,241,226,0.97) 0%, rgba(233,222,196,0.96) 60%, rgba(216,203,173,0.96) 100%)",
                  border: "1px solid rgba(42,38,32,0.14)",
                  transform: `translateY(${(1 - plate) * 40}px)`,
                  boxShadow: "inset 0 2px 0 rgba(255,255,255,0.55), inset 0 -2px 8px rgba(42,38,32,0.08)",
                  overflow: "hidden",
                }}
              >
                {/* grano de papel sobre la propia placa */}
                <PaperGrain opacity={0.1} scale={1.05} seed={4} />

                {/* filete decorativo doble arriba */}
                <div
                  style={{
                    position: "absolute",
                    top: 26,
                    left: 44,
                    right: 44,
                    height: 3,
                    background: `linear-gradient(90deg, transparent, ${COLORS.textSoft}, transparent)`,
                    opacity: 0.5,
                  }}
                />

                {/* eyebrow */}
                {title && (
                  <div
                    style={{
                      textAlign: "center",
                      letterSpacing: 7,
                      fontSize: 24,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: COLORS.amber,
                      marginBottom: 6,
                      opacity: interpolate(enter, [0.2, 0.7], [0, 1], { extrapolateRight: "clamp" }),
                    }}
                  >
                    {title}
                  </div>
                )}

                {/* LA CIFRA — odómetro + unidad */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "center",
                    gap: 4,
                    filter: "drop-shadow(0 10px 14px rgba(42,38,32,0.22))",
                    marginTop: 4,
                  }}
                >
                  <Odometer
                    value={Math.abs(value)}
                    digits={digitCount}
                    durationInFrames={Math.min(56, durationInFrames - 6)}
                    size={numSize}
                    color={accent}
                    prefix={prefix}
                  />
                  {unit && (
                    <span
                      style={{
                        fontSize: numSize * 0.5,
                        fontWeight: 900,
                        color: accent,
                        lineHeight: 1,
                        marginLeft: numSize * 0.04,
                        opacity: interpolate(enter, [0.35, 0.8], [0, 1], { extrapolateRight: "clamp" }),
                      }}
                    >
                      {unit}
                    </span>
                  )}
                </div>

                {/* CAPTION grande */}
                {caption && (
                  <div
                    style={{
                      textAlign: "center",
                      fontSize: 76,
                      fontWeight: 800,
                      color: COLORS.text,
                      marginTop: -6,
                      transform: `translateY(${(1 - capIn) * 18}px)`,
                      opacity: capIn,
                      lineHeight: 1.02,
                    }}
                  >
                    {caption}
                  </div>
                )}

                {/* subtítulo de contexto */}
                {subtitle && (
                  <div
                    style={{
                      textAlign: "center",
                      fontSize: 30,
                      fontStyle: "italic",
                      color: COLORS.textSoft,
                      marginTop: 14,
                      transform: `translateY(${(1 - subIn) * 14}px)`,
                      opacity: subIn * 0.92,
                    }}
                  >
                    {subtitle}
                  </div>
                )}

                {/* marcas de esquina tipo ficha de almanaque */}
                {[
                  { top: 18, left: 18, rot: 0 },
                  { top: 18, right: 18, rot: 90 },
                  { bottom: 18, left: 18, rot: -90 },
                ].map((c, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      width: 22,
                      height: 22,
                      borderTop: `2px solid ${COLORS.textSoft}`,
                      borderLeft: `2px solid ${COLORS.textSoft}`,
                      opacity: 0.4,
                      transform: `rotate(${c.rot}deg)`,
                      ...c,
                    }}
                  />
                ))}
              </div>
            </DepthShadow>
          </RimLight>
        </div>
      </AbsoluteFill>

      {/* ── ORNAMENTO: pequeños tildes de tinta que orbitan la cifra (idle) ── */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <svg viewBox="0 0 1600 900" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: 5 }, (_, i) => {
            const a = (i / 5) * Math.PI * 2 + frame / 120;
            const rx = 470 + wobble(i, frame, 0.8) * 12;
            const ry = 330 + wobble(i, frame, 1.1) * 10;
            const x = 640 + Math.cos(a) * rx;
            const y = 430 + Math.sin(a) * ry;
            const op = (0.18 + rand(i) * 0.18) * enter;
            return <circle key={i} cx={x} cy={y} r={3 + rand(i, 2) * 3} fill={accent} opacity={op} />;
          })}
        </svg>
      </AbsoluteFill>

      {/* viñeta final para hundir bordes */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: "radial-gradient(130% 100% at 50% 42%, transparent 55%, rgba(42,38,32,0.20) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

export default BigStatKit;

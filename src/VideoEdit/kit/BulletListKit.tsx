import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, AbsoluteFill } from "remotion";
import { COLORS, FONT_STACK } from "../theme";
import {
  ParallaxLayer,
  ParticleField,
  GodRays,
  DepthShadow,
  InkDraw,
  SvgFilters,
  PaperGrain,
  rand,
  wobble,
} from "./depth";
import { SfxCue, SFX } from "../components/Sfx";

// ═══════════════════════════════════════════════════════════════════════════
// BulletListKit — LISTA DE PUNTOS DIBUJADA A PLUMA
// Una card de papel-almanaque levantada del fondo. Un encabezado opcional y una
// lista de puntos que aparecen UNO A UNO: cada viñeta es una marca de tinta que
// se DIBUJA (check / aspa / estrella según convenga) con InkDraw, seguida por su
// texto que se desliza. Genérico: pasos de una técnica, ventajas de un remedio,
// materiales de una reparación — todo por props.
// technique: InkDraw de las viñetas, DepthShadow card, stagger, SfxCue tick.
// ═══════════════════════════════════════════════════════════════════════════

export interface BulletListKitProps {
  durationInFrames: number;
  title?: string; // eyebrow superior
  subtitle?: string; // línea de contexto
  accent?: string; // color de las viñetas de tinta
  items?: string[]; // puntos de la lista
  heading?: string; // título grande dentro de la card
}

const DEFAULT_ITEMS = [
  "Elegí el momento justo, ni antes ni después",
  "Preparalo con lo que ya tenés en casa",
  "Aplicalo despacio, sin apurar el proceso",
  "Repetí cada temporada y anotá el resultado",
];

// tres glifos de viñeta dibujables a tinta, rotados por índice para variedad.
// cada uno cabe en una caja 0..40 y trae su longitud estimada para el dash.
const GLYPHS: { d: (x: number, y: number) => string; len: number }[] = [
  // check
  { d: (x, y) => `M ${x + 6} ${y + 20} L ${x + 16} ${y + 30} L ${x + 34} ${y + 8}`, len: 60 },
  // estrella de trazo (asterisco de almanaque)
  {
    d: (x, y) =>
      `M ${x + 20} ${y + 4} L ${x + 20} ${y + 36} M ${x + 6} ${y + 12} L ${x + 34} ${y + 28} M ${x + 34} ${y + 12} L ${x + 6} ${y + 28}`,
    len: 130,
  },
  // flecha corta hacia la derecha
  { d: (x, y) => `M ${x + 4} ${y + 20} L ${x + 32} ${y + 20} M ${x + 22} ${y + 10} L ${x + 34} ${y + 20} L ${x + 22} ${y + 30}`, len: 78 },
  // marca de comprobación redonda
  { d: (x, y) => `M ${x + 8} ${y + 21} L ${x + 17} ${y + 31} L ${x + 33} ${y + 9}`, len: 58 },
];

export const BulletListKit: React.FC<BulletListKitProps> = ({
  durationInFrames,
  title = "PASO A PASO",
  subtitle = "el método probado, en orden",
  accent = COLORS.amber,
  items = DEFAULT_ITEMS,
  heading = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 60 } });
  const cardIn = spring({ frame: frame - 4, fps, config: { damping: 16, mass: 1, stiffness: 90 } });
  const headIn = spring({ frame: frame - 12, fps, config: { damping: 18, mass: 0.9, stiffness: 120 } });

  const list = items.slice(0, 6);
  const step = 12; // frames entre puntos
  const startAt = 20; // primer punto

  // tamaño de fuente adaptado a la cantidad de puntos
  const rowFont = list.length >= 5 ? 34 : 40;
  const rowGap = list.length >= 5 ? 20 : 28;

  const tilt = Math.sin(frame / 100) * 0.4;
  const breathe = 1 + Math.sin(frame / 52) * 0.005;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK, overflow: "hidden" }}>
      <SvgFilters prefix="bullet" />

      {/* fondo cálido con profundidad */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(115% 95% at 40% 22%, ${COLORS.bg0} 0%, ${COLORS.bg1} 50%, ${COLORS.bg2} 100%)`,
        }}
      />
      <GodRays x={28} y={-14} angle={20} color="rgba(169,121,74,0.18)" intensity={0.95} rays={7} />
      <ParallaxLayer depth={0.32} driftX={18} driftY={12}>
        <ParticleField count={18} kind="dust" rise={false} drift={22} color={COLORS.amber} opacity={0.42} />
      </ParallaxLayer>
      <ParallaxLayer depth={0.15} driftX={10}>
        <AbsoluteFill style={{ opacity: 0.5 }}>
          <PaperGrain opacity={0.12} scale={0.85} seed={7} />
        </AbsoluteFill>
      </ParallaxLayer>

      {/* tick de tinta por punto */}
      {list.map((_, i) => (
        <SfxCue key={i} at={startAt + i * step} src={SFX.click} volume={0.32} />
      ))}

      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            width: 1180,
            maxWidth: "88%",
            transform: `scale(${(0.92 + enter * 0.08) * breathe}) rotate(${tilt}deg)`,
            opacity: enter,
            // aire para el avatar PiP
            marginRight: 140,
            marginBottom: 80,
          }}
        >
          <DepthShadow layers={6} distance={50} radius={28} color="rgba(42,38,32,0.20)">
            <div
              style={{
                position: "relative",
                borderRadius: 28,
                padding: "48px 60px 52px",
                background:
                  "linear-gradient(160deg, rgba(247,241,226,0.98) 0%, rgba(233,222,196,0.97) 60%, rgba(216,203,173,0.97) 100%)",
                border: "1px solid rgba(42,38,32,0.14)",
                boxShadow: "inset 0 2px 0 rgba(255,255,255,0.5), inset 0 -2px 8px rgba(42,38,32,0.08)",
                transform: `translateY(${(1 - cardIn) * 38}px)`,
                overflow: "hidden",
              }}
            >
              <PaperGrain opacity={0.1} scale={1.05} seed={4} />

              {/* encabezado */}
              <div
                style={{
                  transform: `translateY(${(1 - headIn) * 16}px)`,
                  opacity: headIn,
                  marginBottom: heading ? 8 : 26,
                }}
              >
                {title && (
                  <div
                    style={{
                      letterSpacing: 6,
                      fontSize: 22,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: COLORS.amber,
                    }}
                  >
                    {title}
                  </div>
                )}
                {heading && (
                  <div style={{ fontSize: 58, fontWeight: 800, color: COLORS.text, marginTop: 2, lineHeight: 1.05 }}>
                    {heading}
                  </div>
                )}
                {subtitle && (
                  <div style={{ fontSize: 28, fontStyle: "italic", color: COLORS.textSoft, marginTop: heading ? 4 : 2 }}>
                    {subtitle}
                  </div>
                )}
              </div>

              {/* filete bajo el encabezado */}
              <div
                style={{
                  height: 3,
                  marginBottom: 30,
                  background: `linear-gradient(90deg, ${accent}, transparent)`,
                  opacity: interpolate(headIn, [0.4, 1], [0, 0.7], { extrapolateRight: "clamp" }),
                }}
              />

              {/* LISTA */}
              <div style={{ display: "flex", flexDirection: "column", gap: rowGap }}>
                {list.map((text, i) => {
                  const at = startAt + i * step;
                  const rowSpring = spring({ frame: frame - at, fps, config: { damping: 18, mass: 0.8, stiffness: 130 } });
                  const glyph = GLYPHS[i % GLYPHS.length];
                  const bob = wobble(i, frame, 0.7) * 1.5;
                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 26,
                        transform: `translateX(${(1 - rowSpring) * -30}px) translateY(${bob}px)`,
                        opacity: rowSpring,
                      }}
                    >
                      {/* viñeta de tinta dibujada */}
                      <div
                        style={{
                          width: 62,
                          height: 62,
                          flexShrink: 0,
                          borderRadius: 16,
                          background: "rgba(42,38,32,0.05)",
                          border: `2px solid ${accent}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)",
                          transform: `scale(${0.7 + rowSpring * 0.3})`,
                        }}
                      >
                        <svg width={40} height={40} viewBox="0 0 40 40">
                          <InkDraw
                            d={glyph.d(0, 0)}
                            at={at + 2}
                            duration={12}
                            color={accent}
                            width={5}
                            length={glyph.len}
                            dropShadow
                          />
                        </svg>
                      </div>
                      {/* texto del punto */}
                      <div
                        style={{
                          fontSize: rowFont,
                          fontWeight: 600,
                          color: COLORS.text,
                          lineHeight: 1.15,
                          flex: 1,
                        }}
                      >
                        {text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* marcas de esquina */}
              {[
                { top: 16, right: 16, rot: 90 },
                { bottom: 16, left: 16, rot: -90 },
              ].map((c, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    width: 20,
                    height: 20,
                    borderTop: `2px solid ${COLORS.textSoft}`,
                    borderLeft: `2px solid ${COLORS.textSoft}`,
                    opacity: 0.35,
                    transform: `rotate(${c.rot}deg)`,
                    ...c,
                  }}
                />
              ))}
            </div>
          </DepthShadow>
        </div>
      </AbsoluteFill>

      {/* pequeñas motas de tinta que orbitan (idle) */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <svg viewBox="0 0 1600 900" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: 4 }, (_, i) => {
            const a = (i / 4) * Math.PI * 2 + frame / 140;
            const x = 600 + Math.cos(a) * (460 + wobble(i, frame, 0.7) * 10);
            const y = 430 + Math.sin(a) * (320 + wobble(i, frame, 1) * 8);
            return <circle key={i} cx={x} cy={y} r={2.5 + rand(i, 2) * 3} fill={accent} opacity={(0.14 + rand(i) * 0.14) * enter} />;
          })}
        </svg>
      </AbsoluteFill>

      {/* viñeta */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: "radial-gradient(135% 105% at 48% 44%, transparent 58%, rgba(42,38,32,0.18) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

export default BulletListKit;

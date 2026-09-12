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
  wobble,
} from "./depth";

// ═══════════════════════════════════════════════════════════════════════════
// StatGridKit — REJILLA DE MÉTRICAS
// De 2 a 4 cifras contadas en cards de papel-almanaque, cada una levantada del
// fondo con sombra 3D y entrando con un stagger de resortes. Cada valor rueda
// en su propio odómetro. Genérico: sirve para rendimientos de huerta, medidas
// de una reparación o datos de una técnica amish — todo entra por props.
// technique: Odometer por celda, DepthShadow, stagger spring, PaperGrain.
// ═══════════════════════════════════════════════════════════════════════════

export interface StatGridItem {
  value: number;
  unit?: string;
  label: string;
  prefix?: string;
}

export interface StatGridKitProps {
  durationInFrames: number;
  title?: string;
  subtitle?: string;
  accent?: string;
  stats?: StatGridItem[];
}

const DEFAULT_STATS: StatGridItem[] = [
  { value: 70, unit: "%", label: "menos agua" },
  { value: 3, unit: "×", label: "más cosecha" },
  { value: 12, unit: " años", label: "de duración" },
  { value: 0, unit: "€", label: "de coste extra" },
];

// paletas de acento por celda, todas dentro de la marca terrosa
const CELL_ACCENTS = [COLORS.amber, COLORS.accent, COLORS.cold, COLORS.danger];

export const StatGridKit: React.FC<StatGridKitProps> = ({
  durationInFrames,
  title = "LOS NÚMEROS",
  subtitle = "lo que dice la experiencia, medido",
  accent = COLORS.amber,
  stats = DEFAULT_STATS,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 60 } });
  const headIn = spring({ frame: frame - 4, fps, config: { damping: 18, mass: 0.9, stiffness: 120 } });

  const items = stats.slice(0, 4);
  const n = items.length;
  // rejilla: 1 fila si ≤3, 2×2 si 4
  const cols = n <= 3 ? n : 2;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK, overflow: "hidden" }}>
      <SvgFilters prefix="statgrid" />

      {/* fondo cálido con profundidad */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(115% 95% at 46% 20%, ${COLORS.bg0} 0%, ${COLORS.bg1} 50%, ${COLORS.bg2} 100%)`,
        }}
      />
      <GodRays x={62} y={-14} angle={22} color="rgba(169,121,74,0.18)" intensity={0.95} rays={7} />
      <ParallaxLayer depth={0.3} driftX={18} driftY={12}>
        <ParticleField count={20} kind="dust" rise={false} drift={22} color={COLORS.amber} opacity={0.45 * enter} />
      </ParallaxLayer>
      <ParallaxLayer depth={0.15} driftX={10}>
        <AbsoluteFill style={{ opacity: 0.5 }}>
          <PaperGrain opacity={0.12} scale={0.85} seed={7} />
        </AbsoluteFill>
      </ParallaxLayer>

      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {/* encabezado */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 40,
            transform: `translateY(${(1 - headIn) * 20}px)`,
            opacity: headIn,
            // dejar aire a la derecha
            paddingRight: 40,
          }}
        >
          {title && (
            <div style={{ letterSpacing: 7, fontSize: 24, fontWeight: 700, textTransform: "uppercase", color: COLORS.amber }}>
              {title}
            </div>
          )}
          {subtitle && (
            <div style={{ fontSize: 34, fontStyle: "italic", color: COLORS.textSoft, marginTop: 6 }}>{subtitle}</div>
          )}
          <div
            style={{
              width: 220,
              height: 3,
              margin: "16px auto 0",
              background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
            }}
          />
        </div>

        {/* rejilla */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: 34,
            width: n <= 3 ? Math.min(1500, 380 * n + 68) : 940,
            maxWidth: "90%",
            // aire para el avatar PiP en la esquina inferior derecha
            marginBottom: 70,
          }}
        >
          {items.map((s, i) => {
            const cellAcc = CELL_ACCENTS[i % CELL_ACCENTS.length];
            const delay = 10 + i * 8;
            const cs = spring({ frame: frame - delay, fps, config: { damping: 15, mass: 0.9, stiffness: 110 } });
            const digits = Math.max(1, Math.floor(Math.abs(s.value)).toString().length);
            const numSize = digits >= 4 ? 96 : digits === 3 ? 112 : 128;
            // idle: leve balanceo desfasado por índice
            const bob = wobble(i, frame, 0.8) * 4;
            const tilt = Math.sin(frame / 100 + i) * 0.5;
            return (
              <div
                key={i}
                style={{
                  transform: `translateY(${(1 - cs) * 46 + bob}px) rotate(${tilt}deg) scale(${0.92 + cs * 0.08})`,
                  opacity: cs,
                }}
              >
                <DepthShadow layers={5} distance={40} radius={24} color="rgba(42,38,32,0.18)">
                  <div
                    style={{
                      position: "relative",
                      borderRadius: 24,
                      padding: "34px 26px 30px",
                      background:
                        "linear-gradient(158deg, rgba(247,241,226,0.98) 0%, rgba(231,220,192,0.97) 100%)",
                      border: "1px solid rgba(42,38,32,0.14)",
                      boxShadow: "inset 0 2px 0 rgba(255,255,255,0.5), inset 0 -2px 6px rgba(42,38,32,0.07)",
                      overflow: "hidden",
                      minHeight: 210,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <PaperGrain opacity={0.09} scale={1.1} seed={4 + i} />
                    {/* barra de acento arriba */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 6,
                        background: cellAcc,
                        opacity: 0.85,
                      }}
                    />
                    {/* cifra */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        justifyContent: "center",
                        filter: "drop-shadow(0 6px 8px rgba(42,38,32,0.18))",
                      }}
                    >
                      <Odometer
                        value={Math.abs(s.value)}
                        digits={digits}
                        durationInFrames={Math.min(50, durationInFrames - delay)}
                        size={numSize}
                        color={cellAcc}
                        prefix={s.prefix ?? ""}
                      />
                      {s.unit && (
                        <span
                          style={{
                            fontSize: numSize * 0.46,
                            fontWeight: 900,
                            color: cellAcc,
                            lineHeight: 1,
                            marginLeft: 2,
                          }}
                        >
                          {s.unit}
                        </span>
                      )}
                    </div>
                    {/* label */}
                    <div
                      style={{
                        fontSize: 30,
                        fontWeight: 700,
                        color: COLORS.text,
                        textAlign: "center",
                        marginTop: 10,
                        lineHeight: 1.1,
                        opacity: interpolate(cs, [0.4, 1], [0, 1], { extrapolateRight: "clamp" }),
                      }}
                    >
                      {s.label}
                    </div>
                    {/* filete inferior */}
                    <div
                      style={{
                        width: 60,
                        height: 2,
                        marginTop: 10,
                        background: COLORS.textSoft,
                        opacity: 0.35,
                      }}
                    />
                  </div>
                </DepthShadow>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* viñeta */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: "radial-gradient(135% 105% at 50% 44%, transparent 58%, rgba(42,38,32,0.18) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

export default StatGridKit;

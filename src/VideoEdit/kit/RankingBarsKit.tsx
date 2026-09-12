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
  WaxSeal,
  GodRays,
  PaperGrain,
  ParticleField,
  InkDraw,
  RimLight,
  rand,
  wobble,
} from "./depth";

// ═══════════════════════════════════════════════════════════════════════════
// RankingBarsKit — ranking de barras HORIZONTALES que se REORDENAN hacia el nº1.
// GENÉRICO y PROP-DRIVEN. Sirve a los 3 nichos:
//   • huerta:     mejores cultivos por rinde
//   • reparación: materiales por durabilidad
//   • amish:      oficios por demanda
// Técnica: las barras entran en un orden neutro y luego se REORDENAN (spring en la
// posición Y de cada fila) mientras su ancho crece con spring; el valor rueda con
// Odometer; el líder recibe un WaxSeal (medalla de lacre) + RimLight cálido y una
// insignia "Nº 1". Sombra 3D multicapa (DepthShadow) levanta las filas del papel,
// y sube polvo de fondo. Todo determinístico por useCurrentFrame() (render-safe).
// ═══════════════════════════════════════════════════════════════════════════

type Item = { label: string; value: number };

export const RankingBarsKit: React.FC<{
  durationInFrames: number;
  title?: string;
  subtitle?: string;
  accent?: string;
  items?: Item[];
  unit?: string;
}> = ({
  durationInFrames,
  title = "El ranking del año",
  subtitle = "De mayor a menor",
  accent = COLORS.accent,
  items = [
    { label: "Tomate", value: 92 },
    { label: "Zapallo", value: 78 },
    { label: "Lechuga", value: 64 },
    { label: "Rúcula", value: 51 },
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

  const data = items.slice(0, 6);
  const maxV = Math.max(...data.map((d) => d.value), 1);

  // orden final por valor descendente → rank[i] = posición final de la fila i
  const order = data
    .map((d, i) => ({ i, v: d.value }))
    .sort((a, b) => b.v - a.v);
  const finalRank: number[] = [];
  order.forEach((o, pos) => (finalRank[o.i] = pos));
  const leaderIdx = order[0].i;

  // el reordenamiento arranca después de que las barras se dibujaron
  const reorderAt = sec(1.5);
  const reorderS = spring({
    frame: frame - reorderAt,
    fps,
    config: { damping: 20, mass: 1, stiffness: 90 },
  });

  const rowH = 108;
  const rowGap = 26;
  const trackW = 1120;
  const labelW = 300;
  const paletteFor = (pos: number) =>
    pos === 0
      ? accent
      : [COLORS.amber, COLORS.cold, COLORS.good, "#B98A50", "#8C9A66"][
          (pos - 1) % 5
        ];

  // medalla nº1 se estampa cuando termina el reorden
  const medalAt = reorderAt + 24;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK }}>
      <TechBackground glowX={44} glowY={30} hue="amber" drift={0.35} />
      <GodRays x={50} y={-12} angle={16} color="rgba(169,121,74,0.15)" rays={8} />
      <SfxCue at={0} src={SFX.whoosh} volume={0.4} />
      <SfxCue at={medalAt} src={SFX.winnerChime} volume={0.5} />

      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <ParticleField count={16} kind="dust" rise drift={14} opacity={0.45} />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "56px 90px 70px",
        }}
      >
        {/* encabezado */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 40,
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

        {/* pista de filas */}
        <div
          style={{
            position: "relative",
            width: trackW,
            height: data.length * (rowH + rowGap),
          }}
        >
          {data.map((d, i) => {
            const startPos = i; // orden de entrada
            const targetPos = finalRank[i];
            const pos = interpolate(reorderS, [0, 1], [startPos, targetPos]);
            const y = pos * (rowH + rowGap);

            const at = sec(0.5) + i * 8;
            const grow = spring({
              frame: frame - at,
              fps,
              config: { damping: 16, mass: 0.9, stiffness: 110 },
            });
            const w = (d.value / maxV) * trackW * grow;
            const isLeader = i === leaderIdx;
            // el color sigue a la POSICIÓN actual (redondeada) para que el nº1 sea el acento
            const displayPos = Math.round(pos);
            const col = paletteFor(displayPos);
            const sway = wobble(i, frame, 0.6) * 1.6;

            const bar = (
              <div
                style={{
                  position: "relative",
                  height: rowH,
                  width: Math.max(w, labelW + 60),
                }}
              >
                {/* riel de fondo (pista completa, tenue) */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: rowH,
                    width: trackW,
                    borderRadius: 16,
                    background: "rgba(42,38,32,0.06)",
                    border: "1.5px dashed rgba(42,38,32,0.14)",
                  }}
                />
                {/* barra rellena 3D */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: rowH,
                    width: w,
                    borderRadius: 16,
                    background: `linear-gradient(180deg, ${col} 0%, ${col} 62%, rgba(0,0,0,0.14) 100%)`,
                    boxShadow:
                      "inset 0 2px 0 rgba(255,255,255,0.35), inset 0 -10px 22px rgba(0,0,0,0.16)",
                    overflow: "hidden",
                  }}
                >
                  {/* vetas sutiles */}
                  <svg
                    viewBox={`0 0 ${trackW} ${rowH}`}
                    preserveAspectRatio="none"
                    width={trackW}
                    height={rowH}
                    style={{ position: "absolute", inset: 0, opacity: 0.1 }}
                  >
                    {Array.from({ length: 6 }, (_, k) => (
                      <line
                        key={k}
                        y1={0}
                        y2={rowH}
                        x1={60 + k * 90 + rand(i * 6 + k) * 30}
                        x2={70 + k * 90 + rand(i * 6 + k, 3) * 30}
                        stroke="#2A2620"
                        strokeWidth={2}
                      />
                    ))}
                  </svg>
                </div>

                {/* nº de posición + etiqueta, dentro de la barra a la izquierda */}
                <div
                  style={{
                    position: "absolute",
                    left: 28,
                    top: 0,
                    height: rowH,
                    display: "flex",
                    alignItems: "center",
                    gap: 22,
                  }}
                >
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 30,
                      background: "rgba(247,241,223,0.9)",
                      border: `2.5px solid ${col}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 34,
                      fontWeight: 900,
                      color: col,
                      boxShadow: "0 4px 10px rgba(42,38,32,0.2)",
                    }}
                  >
                    {displayPos + 1}
                  </div>
                  <div
                    style={{
                      fontSize: 38,
                      fontWeight: isLeader ? 800 : 700,
                      color: "#F7F1DF",
                      textShadow: "0 2px 4px rgba(42,38,32,0.4)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {d.label}
                  </div>
                </div>

                {/* valor con odómetro al final de la barra */}
                <div
                  style={{
                    position: "absolute",
                    left: Math.max(w + 22, labelW + 90),
                    top: 0,
                    height: rowH,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    opacity: interpolate(grow, [0.3, 0.7], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
                  }}
                >
                  <Odometer
                    value={d.value}
                    digits={String(Math.round(d.value)).length}
                    durationInFrames={30}
                    size={46}
                    color={isLeader ? accent : COLORS.text}
                  />
                  {unit && (
                    <span style={{ fontSize: 26, fontWeight: 700, color: COLORS.textSoft }}>
                      {unit}
                    </span>
                  )}
                </div>
              </div>
            );

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 0,
                  top: y,
                  width: trackW,
                  transform: `translateY(${sway}px)`,
                  zIndex: isLeader ? 3 : 2,
                  opacity: grow,
                }}
              >
                <DepthShadow
                  distance={isLeader ? 34 : 24}
                  radius={16}
                  color="rgba(42,38,32,0.2)"
                >
                  {isLeader ? (
                    <RimLight color={accent} spread={24} x={0.2} y={0.3}>
                      {bar}
                    </RimLight>
                  ) : (
                    bar
                  )}
                </DepthShadow>

                {/* medalla de lacre + insignia para el líder, una vez reordenado */}
                {isLeader && (
                  <div
                    style={{
                      position: "absolute",
                      right: -46,
                      top: -30,
                      opacity: reorderS,
                      transform: `translateY(${(1 - reorderS) * -16}px) rotate(-6deg)`,
                    }}
                  >
                    <WaxSeal at={medalAt} size={86} color={accent} initials="1" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* pie: leyenda del líder */}
        <div
          style={{
            marginTop: 44,
            display: "flex",
            alignItems: "center",
            gap: 16,
            opacity: interpolate(reorderS, [0.4, 1], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <svg viewBox="0 0 60 24" width={60} height={24}>
            <InkDraw
              d="M 4 12 L 56 12 M 44 5 L 56 12 L 44 19"
              at={medalAt}
              duration={18}
              length={140}
              color={accent}
              width={4}
            />
          </svg>
          <div style={{ fontSize: 32, fontWeight: 700, color: COLORS.text }}>
            Nº 1:{" "}
            <span style={{ color: accent, fontWeight: 800 }}>{data[leaderIdx].label}</span>
          </div>
        </div>
      </AbsoluteFill>

      <PaperGrain opacity={0.1} scale={0.85} />
    </AbsoluteFill>
  );
};

export default RankingBarsKit;

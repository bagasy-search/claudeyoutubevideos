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
  DepthShadow,
  InkDraw,
  PaperGrain,
  SvgFilters,
  RimLight,
  rand,
  wobble,
} from "./depth";

// ═══════════════════════════════════════════════════════════════════════════
// ChecklistKit — lista de verificación de almanaque. Cada ítem se "confirma"
// dibujando un tilde de tinta dentro de una casilla de madera, con un pop de
// resorte y un pequeño estallido de partículas de tinta. GENÉRICO / PROP-DRIVEN:
// sirve para "pasos de la trampa" (amish), "checklist de siembra" (huerta) o
// "control de la junta" (reparación) según las props. Defaults sensatos.
// technique: InkDraw del check, spring pop, DepthShadow, ParticleField.
// ═══════════════════════════════════════════════════════════════════════════

export type ChecklistItem = { text: string; done?: boolean };

const DEFAULT_ITEMS: ChecklistItem[] = [
  { text: "Preparar el terreno", done: true },
  { text: "Medir dos veces", done: true },
  { text: "Sellar cada junta", done: true },
  { text: "Revisar antes del invierno", done: true },
];

export const ChecklistKit: React.FC<{
  durationInFrames: number;
  title?: string;
  subtitle?: string;
  accent?: string;
  items?: ChecklistItem[];
}> = ({
  durationInFrames,
  title = "La lista del oficio",
  subtitle = "Cuatro pasos, sin atajos",
  accent = COLORS.accent,
  items = DEFAULT_ITEMS,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 55 } });
  const n = Math.max(1, items.length);

  // ── geometría de la lista (viewBox 1600x900) ────────────────────────────
  const boxX = 250;
  const listTop = 300;
  const rowH = Math.min(120, (760 - listTop) / n + 6);
  const boxSize = Math.min(74, rowH - 26);

  // cadencia: cada ítem se confirma escalonado, dejando aire al final
  const confirmStart = 0.9;
  const confirmGap = Math.min(0.85, (durationInFrames / fps - confirmStart - 0.8) / n);

  // path de un tilde de tinta imperfecto (relativo a una casilla en 0,0)
  const tickPath = (s: number) =>
    `M ${s * 0.22} ${s * 0.55} L ${s * 0.42} ${s * 0.76} L ${s * 0.82} ${s * 0.24}`;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK }}>
      <SvgFilters prefix="chk" />

      {/* ── FONDO PROFUNDO: papel + viñeta + luz de taller ── */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 90% at 32% 24%, ${COLORS.bg0} 0%, ${COLORS.bg1} 55%, ${COLORS.bg2} 100%)`,
        }}
      />
      <ParallaxLayer depth={0.25} driftX={26} driftY={16}>
        <GodRays x={30} y={-14} angle={20} intensity={0.9} color="rgba(169,121,74,0.18)" />
      </ParallaxLayer>
      <ParallaxLayer depth={0.4} driftX={40} driftY={20}>
        <ParticleField count={18} kind="dust" rise={false} drift={26} opacity={0.5} />
      </ParallaxLayer>

      {/* viñeta terrosa para hundir los bordes */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(70% 60% at 50% 46%, rgba(0,0,0,0) 58%, rgba(42,38,32,0.22) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* ── LÁMINA PRINCIPAL ── */}
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ParallaxLayer depth={0.85} driftX={10} driftY={8}>
          <div
            style={{
              width: "88%",
              maxWidth: 1440,
              opacity: enter,
              transform: `translateY(${(1 - enter) * 30}px)`,
            }}
          >
            <DepthShadow layers={6} distance={52} radius={26} color="rgba(42,38,32,0.20)">
              <svg viewBox="0 0 1600 900" width="100%" style={{ display: "block" }}>
                <defs>
                  {/* superficie de la lámina de pergamino */}
                  <linearGradient id="chkSheet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F3ECD8" />
                    <stop offset="55%" stopColor={COLORS.bg1} />
                    <stop offset="100%" stopColor={COLORS.bg2} />
                  </linearGradient>
                  {/* relieve de la casilla de madera */}
                  <linearGradient id="chkBox" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F6F0DE" />
                    <stop offset="100%" stopColor="#E4D8BC" />
                  </linearGradient>
                  <radialGradient id="chkInkBurst" cx="50%" cy="50%">
                    <stop offset="0%" stopColor={COLORS.ink} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={COLORS.ink} stopOpacity={0} />
                  </radialGradient>
                  <filter id="chkPin" x="-40%" y="-40%" width="180%" height="180%">
                    <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#2A2620" floodOpacity="0.35" />
                  </filter>
                </defs>

                {/* lámina */}
                <rect
                  x={70}
                  y={90}
                  width={1460}
                  height={720}
                  rx={26}
                  fill="url(#chkSheet)"
                  stroke="rgba(42,38,32,0.16)"
                  strokeWidth={3}
                />
                {/* margen de renglones tenue (cuaderno de almanaque) */}
                <line x1={boxX - 40} y1={150} x2={boxX - 40} y2={760} stroke={COLORS.danger} strokeWidth={2.5} opacity={0.28} />

                {/* encabezado */}
                <text
                  x={boxX - 40}
                  y={200}
                  fontSize={64}
                  fontWeight={800}
                  fill={COLORS.text}
                  fontFamily={FONT_STACK}
                >
                  {title}
                </text>
                {subtitle && (
                  <text
                    x={boxX - 40}
                    y={246}
                    fontSize={30}
                    fontWeight={600}
                    fill={COLORS.textSoft}
                    fontFamily={FONT_STACK}
                    style={{ letterSpacing: 1 }}
                  >
                    {subtitle}
                  </text>
                )}
                {/* subrayado de tinta bajo el encabezado */}
                <InkDraw
                  d={`M ${boxX - 42} 262 C ${boxX + 160} 254, ${boxX + 520} 270, ${boxX + 740} 258`}
                  at={sec(0.4)}
                  duration={sec(0.6)}
                  color={accent}
                  width={6}
                  length={800}
                  dropShadow
                />

                {/* filas */}
                {items.map((it, i) => {
                  const y = listTop + i * rowH;
                  const rowSpring = spring({
                    frame: frame - sec(0.5 + i * 0.14),
                    fps,
                    config: { damping: 20, mass: 0.8, stiffness: 130 },
                  });
                  const cAt = confirmStart + i * confirmGap;
                  // pop del check al confirmar
                  const pop = spring({
                    frame: frame - sec(cAt),
                    fps,
                    config: { damping: 9, mass: 0.6, stiffness: 200 },
                  });
                  const confirmed = (it.done ?? true) && frame >= sec(cAt);
                  const drawn = interpolate(
                    frame - sec(cAt),
                    [0, sec(0.42)],
                    [0, 1],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                  );
                  const bob = wobble(i, frame, 0.7) * 1.4;

                  return (
                    <g
                      key={i}
                      opacity={rowSpring}
                      transform={`translate(${(1 - rowSpring) * -26} ${y + bob})`}
                    >
                      {/* casilla con relieve */}
                      <g filter="url(#chkPin)">
                        <rect
                          x={boxX}
                          y={-boxSize / 2}
                          width={boxSize}
                          height={boxSize}
                          rx={12}
                          fill="url(#chkBox)"
                          stroke={confirmed ? accent : "rgba(42,38,32,0.30)"}
                          strokeWidth={confirmed ? 5 : 3}
                        />
                        {/* bisel interno */}
                        <rect
                          x={boxX + 5}
                          y={-boxSize / 2 + 5}
                          width={boxSize - 10}
                          height={boxSize - 10}
                          rx={9}
                          fill="none"
                          stroke="rgba(255,255,255,0.55)"
                          strokeWidth={2}
                        />
                      </g>

                      {/* estallido de tinta al confirmar */}
                      {confirmed && (
                        <g opacity={interpolate(pop, [0, 0.5, 1], [0, 0.9, 0])}>
                          <circle cx={boxX + boxSize / 2} cy={0} r={boxSize * (0.4 + pop * 0.6)} fill="url(#chkInkBurst)" />
                          {Array.from({ length: 7 }, (_, k) => {
                            const a = (k / 7) * Math.PI * 2 + rand(i + k) * 0.6;
                            const rr = boxSize * (0.5 + pop * 0.7);
                            return (
                              <circle
                                key={k}
                                cx={boxX + boxSize / 2 + Math.cos(a) * rr}
                                cy={Math.sin(a) * rr}
                                r={3 + rand(k, i) * 3}
                                fill={COLORS.ink}
                                opacity={0.6}
                              />
                            );
                          })}
                        </g>
                      )}

                      {/* tilde de tinta dibujado dentro de la casilla */}
                      {confirmed && (
                        <g transform={`translate(${boxX} ${-boxSize / 2}) scale(${0.8 + pop * 0.2})`}>
                          <path
                            d={tickPath(boxSize)}
                            fill="none"
                            stroke={accent}
                            strokeWidth={9}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeDasharray={boxSize * 1.6}
                            strokeDashoffset={boxSize * 1.6 * (1 - drawn)}
                            style={{ filter: "drop-shadow(0 2px 2px rgba(42,38,32,0.35))" }}
                          />
                        </g>
                      )}

                      {/* texto del ítem con tachado suave al confirmar */}
                      <text
                        x={boxX + boxSize + 40}
                        y={12}
                        fontSize={42}
                        fontWeight={confirmed ? 700 : 600}
                        fill={confirmed ? COLORS.text : COLORS.textSoft}
                        fontFamily={FONT_STACK}
                      >
                        {it.text}
                      </text>
                      {confirmed && (
                        <line
                          x1={boxX + boxSize + 38}
                          y1={-2}
                          x2={boxX + boxSize + 38 + drawn * (it.text.length * 20 + 40)}
                          y2={-6}
                          stroke={accent}
                          strokeWidth={4}
                          strokeLinecap="round"
                          opacity={0.5}
                        />
                      )}
                    </g>
                  );
                })}
              </svg>
            </DepthShadow>
          </div>
        </ParallaxLayer>
      </AbsoluteFill>

      {/* clip de metal sujetando la lámina (frente cercano, profundidad) */}
      <ParallaxLayer depth={1} driftX={6} driftY={4}>
        <AbsoluteFill style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: "88%", maxWidth: 1440, position: "relative" }}>
            <RimLight color="rgba(169,121,74,0.6)" spread={14} x={0.4} y={0.2}>
              <div
                style={{
                  position: "absolute",
                  top: interpolate(enter, [0, 1], [-40, 24]),
                  left: "50%",
                  width: 120,
                  height: 54,
                  marginLeft: -60,
                  borderRadius: "14px 14px 6px 6px",
                  background: "linear-gradient(180deg,#C9BFAA,#8C8371)",
                  boxShadow: "inset 0 2px 3px rgba(255,255,255,0.6), 0 8px 14px rgba(42,38,32,0.35)",
                }}
              />
            </RimLight>
          </div>
        </AbsoluteFill>
      </ParallaxLayer>

      <PaperGrain opacity={0.14} scale={0.85} seed={5} />
    </AbsoluteFill>
  );
};

export default ChecklistKit;

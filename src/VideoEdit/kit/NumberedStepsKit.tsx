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
  Frame3D,
  wobble,
} from "./depth";

// ═══════════════════════════════════════════════════════════════════════════
// NumberedStepsKit — pasos numerados en columna, unidos por un conector vertical
// de tinta que se DIBUJA de arriba hacia abajo, revelando cada paso a medida que
// la tinta llega a su nodo. El número rueda en un odómetro dentro de un medallón
// de pergamino con perspectiva leve (Frame3D). GENÉRICO / PROP-DRIVEN: sirve para
// "cómo armar la trampa" (amish), "método de siembra" (huerta) o "reparar la
// junta paso a paso" (reparación) según las props.
// technique: InkDraw del conector, Odometer del nº, stagger, Frame3D leve.
// ═══════════════════════════════════════════════════════════════════════════

export type Step = { title: string; note?: string };

const DEFAULT_STEPS: Step[] = [
  { title: "Preparar", note: "Reúne las herramientas y despeja el área de trabajo." },
  { title: "Aplicar", note: "Trabaja de a poco, con paciencia y mano firme." },
  { title: "Sellar", note: "Deja curar y revisa que no quede ningún hueco." },
];

export const NumberedStepsKit: React.FC<{
  durationInFrames: number;
  title?: string;
  subtitle?: string;
  accent?: string;
  steps?: Step[];
}> = ({
  durationInFrames,
  title = "El método, paso a paso",
  subtitle = "Como lo hacían los abuelos",
  accent = COLORS.amber,
  steps = DEFAULT_STEPS,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 55 } });
  const n = Math.max(1, steps.length);

  // ── geometría (viewBox 1600x900) ────────────────────────────────────────
  const railX = 360;
  const top = 300;
  const bottom = 820;
  const gap = (bottom - top) / n;
  const nodeY = (i: number) => top + gap * i + gap / 2;
  const nodeR = Math.min(72, gap / 2 - 18);

  // la tinta del conector recorre todo el riel; cada nodo aparece cuando la tinta pasa por él
  const railDrawStart = 0.6;
  const railDrawDur = Math.min(2.4, (durationInFrames / fps) * 0.55);
  const railProg = interpolate(
    frame - sec(railDrawStart),
    [0, sec(railDrawDur)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK }}>
      <SvgFilters prefix="nst" />

      {/* ── FONDO PROFUNDO ── */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 100% at 40% 20%, ${COLORS.bg0} 0%, ${COLORS.bg1} 55%, ${COLORS.bg2} 100%)`,
        }}
      />
      <ParallaxLayer depth={0.25} driftX={30} driftY={14}>
        <GodRays x={26} y={-16} angle={18} intensity={0.85} color="rgba(169,121,74,0.16)" />
      </ParallaxLayer>
      <ParallaxLayer depth={0.42} driftX={44} driftY={22}>
        <ParticleField count={16} kind="spores" rise drift={22} opacity={0.4} />
      </ParallaxLayer>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(72% 62% at 42% 46%, rgba(0,0,0,0) 56%, rgba(42,38,32,0.24) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* ── ENCABEZADO ── */}
      <AbsoluteFill style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: "84%",
            maxWidth: 1400,
            marginTop: 70,
            opacity: enter,
            transform: `translateY(${(1 - enter) * -22}px)`,
          }}
        >
          <div style={{ letterSpacing: 6, fontSize: 22, fontWeight: 700, textTransform: "uppercase", color: accent }}>
            {subtitle}
          </div>
          <div style={{ fontSize: 62, fontWeight: 800, color: COLORS.text, lineHeight: 1.05, marginTop: 4 }}>
            {title}
          </div>
        </div>
      </AbsoluteFill>

      {/* ── COLUMNA DE PASOS ── */}
      <AbsoluteFill style={{ display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
        <ParallaxLayer depth={0.8} driftX={12} driftY={8}>
          <div style={{ width: "84%", maxWidth: 1400, height: "100%", position: "relative" }}>
            <svg viewBox="0 0 1600 900" width="100%" height="100%" style={{ display: "block", position: "absolute", inset: 0 }}>
              <defs>
                <linearGradient id="nstMedal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F6F0DE" />
                  <stop offset="100%" stopColor={COLORS.bg2} />
                </linearGradient>
                <radialGradient id="nstNodeGlow" cx="50%" cy="42%">
                  <stop offset="0%" stopColor="#FFF6E2" />
                  <stop offset="100%" stopColor={COLORS.bg2} />
                </radialGradient>
              </defs>

              {/* sombra del riel (profundidad detrás) */}
              <line x1={railX + 5} y1={top + 6} x2={railX + 5} y2={bottom + 6} stroke="rgba(42,38,32,0.16)" strokeWidth={12} strokeLinecap="round" />

              {/* riel guía tenue (donde irá la tinta) */}
              <line x1={railX} y1={top} x2={railX} y2={bottom} stroke="rgba(42,38,32,0.14)" strokeWidth={10} strokeLinecap="round" strokeDasharray="2 18" />

              {/* conector de TINTA que se dibuja de arriba a abajo */}
              <InkDraw
                d={`M ${railX} ${top} L ${railX} ${bottom}`}
                at={sec(railDrawStart)}
                duration={sec(railDrawDur)}
                color={accent}
                width={9}
                length={bottom - top}
                dropShadow
              />

              {/* gota de tinta en la punta del trazo (playhead) */}
              {railProg > 0.001 && railProg < 0.999 && (
                <circle
                  cx={railX}
                  cy={top + railProg * (bottom - top)}
                  r={11}
                  fill={accent}
                  style={{ filter: "drop-shadow(0 3px 4px rgba(42,38,32,0.4))" }}
                />
              )}
            </svg>

            {/* nodos + tarjetas (HTML sobre el SVG para tipografía nítida) */}
            {steps.map((st, i) => {
              const y = nodeY(i);
              const trigger = i / n + 0.12 / n; // fracción del riel al llegar al nodo
              const revealed = railProg >= trigger;
              const cAt = railDrawStart + railDrawDur * trigger;
              const nodeSpring = spring({
                frame: frame - sec(cAt),
                fps,
                config: { damping: 12, mass: 0.7, stiffness: 170 },
              });
              const cardSpring = spring({
                frame: frame - sec(cAt + 0.12),
                fps,
                config: { damping: 20, mass: 0.85, stiffness: 130 },
              });
              const bob = wobble(i, frame, 0.6) * 3;

              const topPct = (y / 900) * 100;
              const railPct = (railX / 1600) * 100;
              const nodePct = (nodeR / 900) * 100;

              return (
                <div key={i}>
                  {/* MEDALLÓN con número (odómetro) y perspectiva leve */}
                  <div
                    style={{
                      position: "absolute",
                      left: `${railPct}%`,
                      top: `${topPct}%`,
                      transform: `translate(-50%, calc(-50% + ${bob}px)) scale(${nodeSpring})`,
                      opacity: revealed ? 1 : 0,
                    }}
                  >
                    <Frame3D at={0} rotateY={12} rotateX={6} depth={30} perspective={900}>
                      <DepthShadow layers={5} distance={30} radius={999} color="rgba(42,38,32,0.28)">
                        <div
                          style={{
                            width: nodeR * 2,
                            height: nodeR * 2,
                            borderRadius: "50%",
                            background: "radial-gradient(circle at 42% 38%, #FFF6E2, #D8CBAD)",
                            border: `4px solid ${accent}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "inset 0 3px 6px rgba(255,255,255,0.7), inset 0 -6px 14px rgba(42,38,32,0.18)",
                          }}
                        >
                          {/* número FIJO y estable (los pasos son 1,2,3… — no deben
                              "rodar" ni mostrarse a mitad de giro en el still) */}
                          <span
                            style={{
                              fontFamily: FONT_STACK,
                              fontWeight: 900,
                              fontSize: nodeR * 1.05,
                              lineHeight: 1,
                              color: COLORS.text,
                              transform: `scale(${interpolate(nodeSpring, [0, 1], [0.6, 1])})`,
                            }}
                          >
                            {i + 1}
                          </span>
                        </div>
                      </DepthShadow>
                    </Frame3D>
                  </div>

                  {/* TARJETA del paso a la derecha del riel */}
                  <div
                    style={{
                      position: "absolute",
                      left: `${railPct + nodePct * 1.6 + 4}%`,
                      top: `${topPct}%`,
                      width: `${44}%`,
                      transform: `translateY(-50%) translateX(${(1 - cardSpring) * 30}px)`,
                      opacity: cardSpring,
                    }}
                  >
                    <DepthShadow layers={5} distance={26} radius={18} color="rgba(42,38,32,0.18)">
                      <div
                        style={{
                          background: "linear-gradient(180deg,#F3ECD8,#E4D8BC)",
                          border: "1px solid rgba(42,38,32,0.16)",
                          borderLeft: `6px solid ${accent}`,
                          borderRadius: 18,
                          padding: "18px 28px",
                        }}
                      >
                        <div style={{ fontSize: 40, fontWeight: 800, color: COLORS.text, lineHeight: 1.1 }}>
                          {st.title}
                        </div>
                        {st.note && (
                          <div style={{ fontSize: 26, fontWeight: 500, color: COLORS.textSoft, marginTop: 4, lineHeight: 1.25 }}>
                            {st.note}
                          </div>
                        )}
                      </div>
                    </DepthShadow>
                  </div>

                  {/* chispita de tinta cuando el nodo se enciende */}
                  {revealed && (
                    <div
                      style={{
                        position: "absolute",
                        left: `${railPct}%`,
                        top: `${topPct}%`,
                        transform: "translate(-50%,-50%)",
                        opacity: interpolate(nodeSpring, [0, 0.5, 1], [0, 0.8, 0]),
                        width: nodeR * 3,
                        height: nodeR * 3,
                        marginLeft: -nodeR * 1.5,
                        marginTop: -nodeR * 1.5,
                        borderRadius: "50%",
                        background: `radial-gradient(circle, ${accent}55 0%, transparent 60%)`,
                        pointerEvents: "none",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </ParallaxLayer>
      </AbsoluteFill>

      <PaperGrain opacity={0.13} scale={0.9} seed={8} />
    </AbsoluteFill>
  );
};

export default NumberedStepsKit;

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import { TechBackground } from "../components/TechBackground";
import { SfxCue, SFX } from "../components/Sfx";
import {
  ParallaxLayer,
  ParticleField,
  PaperGrain,
  GodRays,
  DepthShadow,
  Frame3D,
  InkDraw,
  WaxSeal,
  SvgFilters,
  wobble,
} from "./depth";

// ══════════════════════════════════════════════════════════════════════════════
// ClosingCardKit — PLACA DE CIERRE / LLAMADO con profundidad.
// Una tarjeta de pergamino levantada en perspectiva (Frame3D) sobre luz cálida de
// taller (GodRays) y brasas que suben (ParticleField embers). El encabezado serif
// aparece, una firma se dibuja a tinta bajo él (InkDraw) y un SELLO DE LACRE
// (WaxSeal) se estampa con rebote. Debajo, un botón/píldora de CTA (suscribirse /
// próximo) con sombra 3D.
//
// PROP-DRIVEN — el TEMA entra por props: `heading`, `subtitle`, `cta`, `accent`,
// `seal`. Sirve igual para los 3 nichos (huerta / amish / reparación). Renderiza
// SOLO sin props con un cierre genérico en español.
// ══════════════════════════════════════════════════════════════════════════════

export const ClosingCardKit: React.FC<{
  durationInFrames: number;
  title?: string;
  subtitle?: string;
  accent?: string;
  heading?: string;
  cta?: string;
  seal?: boolean;
}> = ({
  durationInFrames,
  title,
  subtitle = "Nos vemos en el próximo",
  accent = COLORS.amber,
  heading = "Gracias por ver",
  cta = "Suscribite",
  seal = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 55 } });
  const outStart = durationInFrames - sec(0.5);
  const exit = interpolate(frame, [outStart, durationInFrames], [1, 0.9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // latido sutil de la píldora CTA (loop)
  const ctaAt = sec(1.4);
  const ctaS = spring({ frame: frame - ctaAt, fps, config: { damping: 12, mass: 0.7, stiffness: 150 } });
  const pulse = 1 + Math.sin(frame / 16) * 0.02 * interpolate(frame, [ctaAt, ctaAt + sec(0.5)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const bob = Math.sin(frame / 130) * 5;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK }}>
      <SvgFilters prefix="cck" />
      <TechBackground glowX={50} glowY={44} hue="amber" drift={0.3} />
      <SfxCue at={0} src={SFX.whoosh} volume={0.4} />
      {seal && <SfxCue at={sec(1.9)} src={SFX.boom1} volume={0.5} />}

      {/* luz volumétrica desde arriba, cae sobre la placa */}
      <GodRays x={50} y={-16} angle={0} color="rgba(169,121,74,0.24)" intensity={1} rays={9} />

      {/* brasas cálidas que suben en el fondo (embers) */}
      <ParallaxLayer depth={0.3} driftX={20} driftY={26}>
        <ParticleField count={26} kind="embers" rise drift={30} color={accent} opacity={0.55} />
      </ParallaxLayer>
      {/* polvo suave más lejano */}
      <ParallaxLayer depth={0.16} driftX={16} driftY={12}>
        <ParticleField count={16} kind="dust" rise={false} drift={20} opacity={0.4} />
      </ParallaxLayer>

      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ opacity: enter * exit, transform: `translateY(${bob}px)`, perspective: 1600 }}>
          <Frame3D at={sec(0.1)} rotateY={0} rotateX={6} depth={70} perspective={1600}>
            <DepthShadow layers={7} distance={70} radius={26} color="rgba(42,38,32,0.24)">
              <div
                style={{
                  width: 1040,
                  maxWidth: "84vw",
                  padding: "72px 80px 84px",
                  borderRadius: 26,
                  background: `radial-gradient(120% 120% at 40% 20%, ${COLORS.bg0}, ${COLORS.bg2})`,
                  border: "1px solid rgba(42,38,32,0.18)",
                  boxShadow: "inset 0 3px 0 rgba(255,255,255,0.5), inset 0 -4px 18px rgba(42,38,32,0.14)",
                  position: "relative",
                  overflow: "hidden",
                  textAlign: "center",
                }}
              >
                {/* filete decorativo interior a tinta */}
                <svg viewBox="0 0 1000 560" width="100%" height="100%" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} preserveAspectRatio="none">
                  <InkDraw d="M 40 40 L 960 40 L 960 520 L 40 520 Z" at={sec(0.3)} duration={sec(1.4)} color="rgba(42,38,32,0.28)" width={2.5} length={2960} />
                  <InkDraw d="M 58 58 L 942 58 L 942 502 L 58 502 Z" at={sec(0.5)} duration={sec(1.5)} color={accent} width={1.5} length={2860} />
                  {/* florituras en las esquinas */}
                  {[
                    { t: "translate(60 60)", s: 1, sy: 1 },
                    { t: "translate(940 60)", s: -1, sy: 1 },
                    { t: "translate(60 500)", s: 1, sy: -1 },
                    { t: "translate(940 500)", s: -1, sy: -1 },
                  ].map((c, i) => (
                    <g key={i} transform={c.t}>
                      <InkDraw d={`M 0 0 C ${c.s * 40} ${c.sy * 6}, ${c.s * 54} ${c.sy * 26}, ${c.s * 46} ${c.sy * 54}`} at={sec(0.7 + i * 0.1)} duration={sec(0.6)} color={accent} width={3} length={120} />
                    </g>
                  ))}
                </svg>

                {title && (
                  <div style={{ letterSpacing: 7, fontSize: 20, fontWeight: 700, textTransform: "uppercase", color: accent, marginBottom: 14, position: "relative" }}>
                    {title}
                  </div>
                )}

                {/* encabezado */}
                <div
                  style={{
                    fontSize: 92,
                    lineHeight: 1.02,
                    fontWeight: 800,
                    color: COLORS.text,
                    position: "relative",
                    transform: `translateY(${(1 - enter) * 20}px)`,
                  }}
                >
                  {heading}
                </div>

                {/* firma a tinta bajo el encabezado */}
                <svg viewBox="0 0 520 90" width={360} height={62} style={{ display: "block", margin: "6px auto 0", position: "relative" }}>
                  <InkDraw
                    d="M 30 60 C 70 20 110 20 130 50 C 150 80 170 30 200 40 C 240 54 250 20 300 44 C 340 62 380 30 430 46 C 460 56 480 46 494 50"
                    at={sec(0.9)}
                    duration={sec(1.1)}
                    color={COLORS.ink}
                    width={4}
                    length={780}
                    dropShadow
                  />
                  <InkDraw d="M 300 62 C 360 74 430 70 470 64" at={sec(1.7)} duration={sec(0.5)} color={accent} width={2.5} length={200} />
                </svg>

                {subtitle && (
                  <div style={{ fontSize: 30, fontStyle: "italic", color: COLORS.textSoft, marginTop: 8, position: "relative" }}>
                    {subtitle}
                  </div>
                )}

                {/* CTA — píldora con sombra 3D y latido */}
                <div style={{ display: "flex", justifyContent: "center", marginTop: 40, position: "relative" }}>
                  <DepthShadow layers={5} distance={30} radius={999} color="rgba(42,38,32,0.28)" style={{ opacity: ctaS, transform: `scale(${interpolate(ctaS, [0, 1], [0.7, 1]) * pulse})` }}>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 16,
                        padding: "20px 44px",
                        borderRadius: 999,
                        background: `linear-gradient(180deg, ${accent}, ${COLORS.amber})`,
                        color: COLORS.bg0,
                        fontSize: 40,
                        fontWeight: 900,
                        border: "2px solid rgba(255,255,255,0.4)",
                        boxShadow: "inset 0 2px 0 rgba(255,255,255,0.4), inset 0 -3px 8px rgba(42,38,32,0.3)",
                        textShadow: "0 1px 2px rgba(42,38,32,0.3)",
                      }}
                    >
                      {/* campanita / play a tinta */}
                      <svg width={40} height={40} viewBox="0 0 40 40">
                        <path
                          d="M20 6 C13 6 10 11 10 18 C10 26 6 28 6 30 L34 30 C34 28 30 26 30 18 C30 11 27 6 20 6 Z"
                          fill={COLORS.bg0}
                          opacity={0.95}
                        />
                        <path d="M16 30 A4 4 0 0 0 24 30" fill="none" stroke={COLORS.bg0} strokeWidth={3} strokeLinecap="round" />
                        <circle cx={30} cy={9} r={5} fill={COLORS.danger} stroke="#fff" strokeWidth={1.5} />
                      </svg>
                      {cta}
                    </div>
                  </DepthShadow>
                </div>

                <PaperGrain opacity={0.08} scale={1} seed={5} />
              </div>
            </DepthShadow>
          </Frame3D>
        </div>
      </AbsoluteFill>

      {/* SELLO DE LACRE — se estampa sobre la esquina inferior IZQUIERDA (dejamos
          libre la esquina inferior derecha para el avatar PiP). */}
      {seal && (
        <div style={{ position: "absolute", left: "16%", bottom: "13%", opacity: enter }}>
          <div style={{ transform: `rotate(${-12 + wobble(0, frame, 0.4) * 1.5}deg)` }}>
            <WaxSeal at={sec(1.9)} size={168} color={COLORS.danger} initials="★" />
          </div>
        </div>
      )}

      <PaperGrain opacity={0.09} scale={0.9} seed={7} />
    </AbsoluteFill>
  );
};

export default ClosingCardKit;

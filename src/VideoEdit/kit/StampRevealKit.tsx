import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, FONT_STACK } from "../theme";
import { TechBackground } from "../components/TechBackground";
import { SfxCue, SFX } from "../components/Sfx";
import {
  ParticleField,
  GodRays,
  DepthShadow,
  WaxSeal,
  PaperGrain,
  SvgFilters,
  RimLight,
  rand,
  wobble,
} from "./depth";

// ─────────────────────────────────────────────────────────────────────────────
// StampRevealKit — SELLO/VEREDICTO que se ESTAMPA sobre una afirmación (aprobado
// vs mito). Genérico y PROP-DRIVEN: el claim y el veredicto entran por props.
//   • Huerta:     claim="¿La ceniza aleja las babosas?"  verdict="COMPROBADO"  positive
//   • Reparación: claim="¿Se puede soldar sin fundente?"  verdict="MITO"        positive=false
//   • Amish:      claim="Conservar sin heladera 100 años"  verdict="CIERTO"     positive
// Técnica: ficha de papel-almanaque que baja, el sello de lacre (WaxSeal) IMPACTA
// con spring de rebote, se estampa el veredicto ROTADO, salta un ParticleField de
// polvo/tinta, sombra 3D bajo la ficha y un THUMP grave (SfxCue).
// RENDER-SAFE: todo desde useCurrentFrame() (interpolate/spring). Azar por índice.
// ─────────────────────────────────────────────────────────────────────────────

export const StampRevealKit: React.FC<{
  durationInFrames: number;
  title?: string;
  subtitle?: string;
  accent?: string;
  claim?: string;
  verdict?: string;
  positive?: boolean;
}> = ({
  durationInFrames,
  title = "El veredicto",
  subtitle = "lo que dice la evidencia",
  accent = COLORS.amber,
  claim = "¿Es verdad este viejo truco casero?",
  verdict = "COMPROBADO",
  positive = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 55 } });

  // ── momento del impacto del sello ───────────────────────────────────────────
  const STAMP_AT = 34; // frame en que golpea el sello
  const stampS = spring({ frame: frame - STAMP_AT, fps, config: { damping: 8, mass: 0.9, stiffness: 200 } });
  // "aplastón" del papel al recibir el golpe (rebote suave hacia abajo)
  const squash = interpolate(
    frame - STAMP_AT,
    [0, 4, 12, 20],
    [0, 6, -2, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const impact = interpolate(frame - STAMP_AT, [-2, 0, 3], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const stampColor = positive ? COLORS.good : COLORS.danger;
  const seal = positive ? COLORS.good : COLORS.danger;
  const stampRot = positive ? -9 : 8; // inclinación del sello estampado

  // ── partículas de polvo/tinta que saltan en el impacto (determinístico) ──────
  const burst = interpolate(frame - STAMP_AT, [0, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK }}>
      <SvgFilters prefix="stamp" />
      <TechBackground glowX={50} glowY={34} hue={positive ? "amber" : "red"} drift={0.3} />
      <GodRays x={58} y={-16} angle={22} color="rgba(169,121,74,0.15)" intensity={1} rays={6} />
      <ParticleField count={16} kind="dust" rise drift={22} opacity={0.4} />
      <SfxCue at={2} src={SFX.whoosh} volume={0.3} />
      <SfxCue at={STAMP_AT} src={SFX.boom1} volume={0.5} />
      <SfxCue at={STAMP_AT + 1} src={SFX.textSlam} volume={0.32} />

      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "88%", maxWidth: 1400, opacity: enter, transform: `translateY(${(1 - enter) * 24}px)` }}>
          {/* título superior */}
          <div style={{ textAlign: "center", marginBottom: 26 }}>
            <div style={{ letterSpacing: 6, fontSize: 21, fontWeight: 700, textTransform: "uppercase", color: accent }}>
              {subtitle}
            </div>
            <div style={{ fontSize: 54, fontWeight: 800, color: COLORS.text, marginTop: 2 }}>{title}</div>
          </div>

          {/* ── FICHA de papel con la afirmación ── */}
          <div
            style={{
              position: "relative",
              transform: `translateY(${squash}px)`,
              filter: `drop-shadow(0 ${20 + impact * 10}px ${34}px rgba(42,38,32,${0.2 + impact * 0.08}))`,
            }}
          >
            <DepthShadow
              layers={6}
              distance={40}
              radius={20}
              color="rgba(42,38,32,0.14)"
              style={{
                background: "linear-gradient(160deg, #F4ECD6 0%, #E9DDC0 100%)",
                border: "2px solid rgba(42,38,32,0.18)",
                padding: "70px 72px 80px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* textura sutil de papel dentro de la ficha */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "repeating-linear-gradient(0deg, rgba(42,38,32,0.035) 0 1px, transparent 1px 44px)",
                  pointerEvents: "none",
                }}
              />
              {/* comillas decorativas */}
              <div style={{ position: "absolute", top: 10, left: 26, fontSize: 130, lineHeight: 1, color: "rgba(42,38,32,0.12)", fontWeight: 900 }}>“</div>

              <div
                style={{
                  fontSize: 60,
                  lineHeight: 1.16,
                  fontWeight: 700,
                  color: COLORS.text,
                  textAlign: "center",
                  maxWidth: 900,
                  margin: "0 auto",
                  position: "relative",
                }}
              >
                {claim}
              </div>

              {/* línea de firma tenue */}
              <div style={{ marginTop: 40, height: 2, background: "rgba(42,38,32,0.16)", width: "60%", marginLeft: "auto", marginRight: "auto" }} />

              {/* ── VEREDICTO estampado (tinta rugosa, rotado) ── */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  bottom: 40,
                  transform: `translateX(-50%) rotate(${stampRot}deg) scale(${0.6 + stampS * 0.4})`,
                  opacity: interpolate(stampS, [0, 0.15], [0, 1], { extrapolateRight: "clamp" }),
                }}
              >
                <div
                  style={{
                    border: `7px solid ${stampColor}`,
                    borderRadius: 14,
                    padding: "8px 40px",
                    color: stampColor,
                    fontSize: 76,
                    fontWeight: 900,
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    filter: "url(#stamp-rough)",
                    boxShadow: `inset 0 0 0 3px ${stampColor}`,
                    background: "rgba(239,231,211,0.35)",
                  }}
                >
                  {verdict}
                </div>
                {/* marca de check / cruz dibujada al lado */}
                <div style={{ position: "absolute", right: -66, top: "50%", transform: "translateY(-50%)" }}>
                  <svg width={80} height={80} viewBox="0 0 80 80" style={{ opacity: interpolate(stampS, [0.3, 0.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
                    {positive ? (
                      <path d="M 14 44 L 34 62 L 68 18" fill="none" stroke={stampColor} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" filter="url(#stamp-rough)" />
                    ) : (
                      <>
                        <path d="M 18 18 L 62 62" fill="none" stroke={stampColor} strokeWidth={10} strokeLinecap="round" filter="url(#stamp-rough)" />
                        <path d="M 62 18 L 18 62" fill="none" stroke={stampColor} strokeWidth={10} strokeLinecap="round" filter="url(#stamp-rough)" />
                      </>
                    )}
                  </svg>
                </div>
              </div>
            </DepthShadow>

            {/* ── SELLO DE LACRE que baja e IMPACTA en la esquina superior derecha ── */}
            <div style={{ position: "absolute", top: -30, right: 60 }}>
              <RimLight color={seal} spread={20} x={0.6} y={0.2}>
                <WaxSeal at={STAMP_AT} size={168} color={seal} initials={positive ? "✓" : "✕"} />
              </RimLight>
            </div>

            {/* ── partículas de polvo saltando del impacto (SVG determinístico) ── */}
            <svg viewBox="0 0 1400 700" width="100%" height="100%" style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }}>
              {Array.from({ length: 26 }, (_, i) => {
                const a = rand(i) * Math.PI * 2;
                const dist = burst * (60 + rand(i, 1) * 220);
                const ox = 1180 + Math.cos(a) * dist + wobble(i, frame, 2) * 6;
                const oy = 40 + Math.sin(a) * dist * 0.7 + burst * burst * 60; // gravedad leve
                const r = 2 + rand(i, 2) * 6;
                const op = interpolate(burst, [0, 0.15, 1], [0, 0.7, 0]) * (0.5 + rand(i, 3) * 0.5);
                return <circle key={i} cx={ox} cy={oy} r={r} fill={i % 3 === 0 ? seal : COLORS.amber} opacity={op} />;
              })}
            </svg>
          </div>
        </div>
      </AbsoluteFill>

      <PaperGrain opacity={0.1} scale={0.85} />
    </AbsoluteFill>
  );
};

export default StampRevealKit;

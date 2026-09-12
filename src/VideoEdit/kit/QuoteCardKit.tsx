import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import {
  ParallaxLayer,
  ParticleField,
  PaperGrain,
  GodRays,
  DepthShadow,
  InkDraw,
  WaxSeal,
  Frame3D,
  SvgFilters,
  wobble,
} from "./depth";

// ═══════════════════════════════════════════════════════════════════════════
// QuoteCardKit — una CITA/testimonio sobre una tarjeta de pergamino elevada, con
// una comilla gigante dibujada a tinta, la cita en serif y la firma del autor
// con un SELLO de lacre que se estampa. Luz volumétrica cálida detrás.
//
// GENÉRICO por props: quote/author/accent/seal. Sin props → una cita genérica
// del "viejo oficio". Sirve para huerta, reparación o amish (es solo texto).
// RENDER-SAFE: todo por useCurrentFrame (spring/interpolate/wobble). Sello a
// tiempo fijo, sin azar no-determinístico.
// ═══════════════════════════════════════════════════════════════════════════

export const QuoteCardKit: React.FC<{
  durationInFrames: number;
  title?: string;
  subtitle?: string;
  accent?: string;
  quote?: string;
  author?: string;
  seal?: boolean;
}> = ({
  durationInFrames,
  title,
  subtitle,
  accent = COLORS.amber,
  quote = "El que sabe esperar a la tierra, cosecha el doble sin gastar de más.",
  author = "",
  seal = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 20, mass: 0.9, stiffness: 110 } });

  // La cita se revela en un "barrido" de opacidad palabra por palabra (calmo).
  const words = quote.split(" ");
  const revealStart = sec(0.6);
  const perWord = 2.4; // frames por palabra (lento, documental)

  // iniciales del autor para el sello
  const initials =
    author
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "★";

  const cardW = 1180;
  const cardH = 620;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK }}>
      <SvgFilters prefix="quote" />

      {/* Fondo profundo: gradiente pergamino + rayos de luz cálida detrás de la card */}
      <ParallaxLayer depth={0.16} driftY={12}>
        <AbsoluteFill
          style={{
            background: `radial-gradient(110% 90% at 50% 30%, ${COLORS.bg1} 0%, ${COLORS.bg0} 40%, ${COLORS.bg2} 100%)`,
          }}
        />
      </ParallaxLayer>
      <GodRays x={50} y={-16} angle={0} color="rgba(169,121,74,0.22)" rays={9} intensity={1.1} />
      <AbsoluteFill style={{ background: "radial-gradient(115% 100% at 50% 46%, rgba(0,0,0,0) 48%, rgba(42,38,32,0.34) 100%)" }} />

      {/* Eyebrow / título opcional */}
      {(subtitle || title) && (
        <div style={{ position: "absolute", top: 56, left: 0, right: 0, textAlign: "center", opacity: enter, transform: `translateY(${(1 - enter) * -14}px)` }}>
          {subtitle && (
            <div style={{ fontSize: 22, letterSpacing: 6, textTransform: "uppercase", color: accent, fontWeight: 700 }}>{subtitle}</div>
          )}
          {title && <div style={{ fontSize: 52, fontWeight: 800, color: COLORS.text, marginTop: 2 }}>{title}</div>}
        </div>
      )}

      {/* La tarjeta */}
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Frame3D at={0} rotateY={6} rotateX={3} depth={46} perspective={1600}>
          <DepthShadow layers={7} distance={60} radius={20} color="rgba(42,38,32,0.30)">
            <div
              style={{
                width: cardW,
                height: cardH,
                borderRadius: 20,
                background: "linear-gradient(160deg, #f4ecd6 0%, #ebe0c5 100%)",
                border: "1px solid rgba(42,38,32,0.18)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 0 80px rgba(169,121,74,0.14)",
                position: "relative",
                overflow: "hidden",
                padding: "70px 96px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              {/* filete interior de tinta (marco) */}
              <svg viewBox={`0 0 ${cardW} ${cardH}`} width="100%" height="100%" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                <rect
                  x={26}
                  y={26}
                  width={cardW - 52}
                  height={cardH - 52}
                  rx={12}
                  fill="none"
                  stroke="rgba(42,38,32,0.28)"
                  strokeWidth={2}
                  filter="url(#quote-rough)"
                />
              </svg>

              {/* comilla gigante dibujada a tinta */}
              <svg
                viewBox="0 0 200 200"
                width={200}
                height={200}
                style={{ position: "absolute", top: 18, left: 44, overflow: "visible" }}
              >
                <InkDraw
                  d="M 60 40 C 20 55, 14 120, 58 128 C 78 132, 82 104, 66 96 C 52 90, 46 96, 46 96 C 40 66, 66 52, 78 50"
                  at={sec(0.3)}
                  duration={sec(0.9)}
                  color={accent}
                  width={12}
                  length={340}
                  dropShadow
                />
                <InkDraw
                  d="M 128 40 C 88 55, 82 120, 126 128 C 146 132, 150 104, 134 96 C 120 90, 114 96, 114 96 C 108 66, 134 52, 146 50"
                  at={sec(0.5)}
                  duration={sec(0.9)}
                  color={accent}
                  width={12}
                  length={340}
                  dropShadow
                />
              </svg>

              {/* la cita, revelada palabra por palabra */}
              <div
                style={{
                  position: "relative",
                  fontSize: 52,
                  lineHeight: 1.32,
                  color: COLORS.text,
                  fontStyle: "italic",
                  fontWeight: 500,
                  textAlign: "center",
                  padding: "0 20px",
                  marginTop: 20,
                }}
              >
                {words.map((w, i) => {
                  const t = interpolate(
                    frame,
                    [revealStart + i * perWord, revealStart + i * perWord + 8],
                    [0, 1],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                  );
                  return (
                    <span
                      key={i}
                      style={{
                        opacity: interpolate(t, [0, 1], [0.12, 1]),
                        filter: `blur(${interpolate(t, [0, 1], [3, 0])}px)`,
                        transition: "none",
                      }}
                    >
                      {w}{" "}
                    </span>
                  );
                })}
              </div>

              {/* subrayado de tinta bajo la cita */}
              <svg viewBox={`0 0 ${cardW} 40`} width="100%" height={40} style={{ marginTop: 26 }}>
                <InkDraw
                  d={`M ${cardW * 0.28} 20 C ${cardW * 0.42} 8, ${cardW * 0.58} 30, ${cardW * 0.72} 16`}
                  at={sec(0.6 + words.length * (perWord / fps) * 0.5)}
                  duration={sec(0.6)}
                  color={COLORS.accent}
                  width={5}
                  length={520}
                />
              </svg>

              {/* firma del autor */}
              {author && (
                <div
                  style={{
                    marginTop: 20,
                    textAlign: "center",
                    fontSize: 30,
                    color: COLORS.textSoft,
                    letterSpacing: 2,
                    opacity: interpolate(frame, [sec(1.4 + words.length * (perWord / fps)), sec(2 + words.length * (perWord / fps))], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
                    transform: `translateY(${wobble(0, frame, 0.4) * 2}px)`,
                  }}
                >
                  — {author}
                </div>
              )}

              {/* grano de papel sobre la card */}
              <div style={{ position: "absolute", inset: 0, borderRadius: 20, overflow: "hidden", pointerEvents: "none" }}>
                <PaperGrain opacity={0.1} scale={0.95} blend="multiply" />
              </div>
            </div>
          </DepthShadow>
        </Frame3D>
      </AbsoluteFill>

      {/* Sello de lacre estampado sobre la esquina inferior IZQUIERDA de la card
          (deja libre la esq. inf. der. para el avatar PiP). */}
      {seal && (
        <div style={{ position: "absolute", left: "24%", bottom: "16%" }}>
          <WaxSeal at={sec(1.6 + words.length * (perWord / fps))} size={132} color={COLORS.danger} initials={initials} />
        </div>
      )}

      {/* motas de polvo cálidas */}
      <ParticleField count={14} kind="dust" rise drift={22} opacity={0.4} />
      <PaperGrain opacity={0.07} scale={0.85} blend="multiply" />
    </AbsoluteFill>
  );
};

export default QuoteCardKit;

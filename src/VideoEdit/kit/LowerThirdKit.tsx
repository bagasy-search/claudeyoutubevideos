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
  DepthShadow,
  RimLight,
  InkDraw,
  PaperGrain,
  SvgFilters,
  WaxSeal,
  wobble,
} from "./depth";

// ═══════════════════════════════════════════════════════════════════════════
// LowerThirdKit — RÓTULO INFERIOR de la marca terroso-vintage.
// Genérico y PROP-DRIVEN: presenta nombre + rol/lugar de quien habla, o cualquier
// pareja título/subtítulo. Entra DESLIZANDO desde un lado con una regla lateral
// que se DIBUJA a pluma; una tarjeta de pergamino se levanta del papel con sombra
// 3D y luz de borde cálida. Diseñado para vivir en el TERCIO INFERIOR IZQUIERDO,
// dejando la esquina inferior DERECHA libre para el avatar PiP.
// Técnica: DepthShadow, RimLight, InkDraw de la regla lateral, spring slide.
// RENDER-SAFE: todo deriva de useCurrentFrame() (spring/interpolate).
// ═══════════════════════════════════════════════════════════════════════════

export const LowerThirdKit: React.FC<{
  durationInFrames: number;
  title?: string;
  subtitle?: string;
  accent?: string;
  name?: string;
  role?: string;
  side?: "left" | "right";
}> = ({
  durationInFrames,
  title,
  subtitle,
  accent = COLORS.amber,
  name = "El maestro",
  role = "Oficio de siempre",
  side = "left",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // title/subtitle sobreescriben name/role si se pasan (genérico)
  const line1 = title ?? name;
  const line2 = subtitle ?? role;

  const dir = side === "left" ? -1 : 1;

  // ── Entrada: desliza desde el borde + expande ─────────────────────────────
  const slide = spring({ frame, fps, config: { damping: 20, mass: 1, stiffness: 95 } });
  const l1 = spring({ frame: frame - sec(0.35), fps, config: { damping: 200, stiffness: 60 } });
  const l2 = spring({ frame: frame - sec(0.6), fps, config: { damping: 200, stiffness: 55 } });

  // ── Salida: desliza de vuelta ─────────────────────────────────────────────
  const out = interpolate(
    frame,
    [durationInFrames - sec(0.55), durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const enterX = interpolate(slide, [0, 1], [dir * 620, 0]);
  const exitX = out * dir * 560;
  const x = enterX + exitX;
  const op = slide * (1 - out);

  // idle sutil vertical
  const idleY = wobble(0, frame, 0.5) * 2.4;

  const cardW = 720;
  const cardH = 190;
  const ruleH = cardH - 26;

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK, pointerEvents: "none" }}>
      <SvgFilters prefix="lowerthird" />

      <div
        style={{
          position: "absolute",
          bottom: 96,
          [side]: 88,
          transform: `translate(${x}px, ${idleY}px)`,
          opacity: op,
        }}
      >
        <DepthShadow layers={6} distance={40} radius={18} color="rgba(42,38,32,0.24)">
          <RimLight color="rgba(169,121,74,0.5)" spread={24} x={side === "left" ? 0.75 : 0.25} y={0.2}>
            <div
              style={{
                position: "relative",
                width: cardW,
                minHeight: cardH,
                borderRadius: 18,
                overflow: "hidden",
                background: `linear-gradient(140deg, ${COLORS.bg0} 0%, #F1EAD5 40%, ${COLORS.bg1} 100%)`,
                border: "1px solid rgba(42,38,32,0.16)",
                boxShadow: "inset 0 2px 0 rgba(255,255,255,0.5), inset 0 -20px 40px rgba(120,90,50,0.12)",
                display: "flex",
                flexDirection: side === "left" ? "row" : "row-reverse",
                alignItems: "center",
              }}
            >
              {/* REGLA lateral dibujada a pluma + sello de lacre */}
              <div
                style={{
                  position: "relative",
                  width: 96,
                  height: cardH,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg viewBox="0 0 96 190" width={96} height={cardH} style={{ position: "absolute", inset: 0 }}>
                  {/* barra vertical de acento */}
                  <InkDraw
                    d={`M ${side === "left" ? 20 : 76} 22 L ${side === "left" ? 20 : 76} ${ruleH}`}
                    at={sec(0.2)}
                    duration={sec(0.6)}
                    color={accent}
                    width={7}
                    length={ruleH}
                  />
                  {/* remates decorativos arriba/abajo */}
                  <InkDraw
                    d={`M ${side === "left" ? 10 : 66} 22 L ${side === "left" ? 30 : 86} 22`}
                    at={sec(0.5)}
                    duration={sec(0.3)}
                    color={accent}
                    width={3}
                    length={20}
                  />
                  <InkDraw
                    d={`M ${side === "left" ? 10 : 66} ${ruleH} L ${side === "left" ? 30 : 86} ${ruleH}`}
                    at={sec(0.5)}
                    duration={sec(0.3)}
                    color={accent}
                    width={3}
                    length={20}
                  />
                </svg>
                {/* sello de lacre estampado */}
                <div style={{ transform: side === "left" ? "translateX(14px)" : "translateX(-14px)" }}>
                  <WaxSeal at={sec(0.7)} size={64} color={COLORS.danger} initials={line1.charAt(0).toUpperCase()} />
                </div>
              </div>

              {/* TEXTO */}
              <div
                style={{
                  flex: 1,
                  padding: side === "left" ? "0 34px 0 6px" : "0 6px 0 34px",
                  textAlign: side === "left" ? "left" : "right",
                }}
              >
                <div
                  style={{
                    fontSize: line1.length > 18 ? 46 : 56,
                    lineHeight: 1.0,
                    fontWeight: 800,
                    color: COLORS.text,
                    letterSpacing: -0.5,
                    opacity: l1,
                    transform: `translateX(${(1 - l1) * dir * -18}px)`,
                    textShadow: "0 2px 0 rgba(255,255,255,0.4)",
                  }}
                >
                  {line1}
                </div>
                {/* separador fino */}
                <div
                  style={{
                    height: 2,
                    width: interpolate(l2, [0, 1], [0, 120]),
                    background: accent,
                    opacity: 0.6 * l2,
                    margin: side === "left" ? "10px 0" : "10px 0 10px auto",
                  }}
                />
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 500,
                    fontStyle: "italic",
                    letterSpacing: 1,
                    color: COLORS.textSoft,
                    textTransform: "uppercase",
                    opacity: l2,
                    transform: `translateX(${(1 - l2) * dir * -14}px)`,
                  }}
                >
                  {line2}
                </div>
              </div>

              {/* grano de papel */}
              <PaperGrain opacity={0.12} scale={0.9} seed={13} blend="multiply" />
            </div>
          </RimLight>
        </DepthShadow>
      </div>
    </AbsoluteFill>
  );
};

export default LowerThirdKit;

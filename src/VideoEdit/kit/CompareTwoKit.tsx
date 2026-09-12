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
  Frame3D,
  RimLight,
  InkDraw,
  GodRays,
  PaperGrain,
  ParticleField,
  WaxSeal,
  wobble,
} from "./depth";

// ═══════════════════════════════════════════════════════════════════════════
// CompareTwoKit — comparación LADO A LADO (antes/después · malo/bueno) con veredicto.
// GENÉRICO y PROP-DRIVEN: el tema entra por props. Sirve a los 3 nichos:
//   • huerta:      "Riego a mano" vs "Riego por goteo" → veredicto derecha
//   • reparación:  "Junta vieja"  vs "Junta nueva"     → veredicto derecha
//   • amish:       "Herramienta rota" vs "Restaurada"  → veredicto derecha
// Técnica: dos paneles de pergamino con DepthShadow + Frame3D (perspectiva real
// en abanico hacia el centro), divisor de tinta trazado con InkDraw + un "VS" en
// una moneda de lacre, RimLight cálido que corona al ganador, GodRays + partículas
// de polvo para volumen. Todo deriva de useCurrentFrame() (render-safe).
// ═══════════════════════════════════════════════════════════════════════════

type Side = { title: string; points?: string[] };

export const CompareTwoKit: React.FC<{
  durationInFrames: number;
  title?: string;
  subtitle?: string;
  accent?: string;
  left?: Side;
  right?: Side;
  verdict?: "left" | "right" | null;
}> = ({
  durationInFrames,
  title = "Antes y después",
  subtitle = "La diferencia que se nota",
  accent = COLORS.accent,
  left = {
    title: "El método viejo",
    points: ["Más trabajo", "Menos rinde", "Gasta de más"],
  },
  right = {
    title: "El método nuevo",
    points: ["Menos esfuerzo", "Mejor resultado", "Ahorra plata"],
  },
  verdict = "right",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 200, mass: 1, stiffness: 55 },
  });

  // el divisor de tinta se traza en el centro; el veredicto llega después
  const verdictAt = sec(1.7);
  const verdictS = spring({
    frame: frame - verdictAt,
    fps,
    config: { damping: 12, mass: 0.8, stiffness: 150 },
  });

  // color de "perdedor" apagado vs ganador vivo
  const loseTint = "rgba(42,38,32,0.35)";

  // ── un panel (izq/der). Entra en abanico 3D hacia el centro. ──────────────
  const Panel: React.FC<{ side: Side; which: "left" | "right"; at: number }> = ({
    side,
    which,
    at,
  }) => {
    const isWinner = verdict === which;
    const isLoser = verdict !== null && verdict !== which;
    const sgn = which === "left" ? -1 : 1;

    const p = spring({
      frame: frame - at,
      fps,
      config: { damping: 20, mass: 0.9, stiffness: 110 },
    });
    // el ganador sube y se acerca; el perdedor se hunde levemente al llegar el veredicto
    const lift = isWinner
      ? interpolate(verdictS, [0, 1], [0, -22], { extrapolateRight: "clamp" })
      : isLoser
        ? interpolate(verdictS, [0, 1], [0, 14], { extrapolateRight: "clamp" })
        : 0;
    const idle = wobble(which === "left" ? 1 : 2, frame, 0.7) * 4;

    const headColor = isLoser ? loseTint : which === "left" ? COLORS.amber : accent;

    const card = (
      <DepthShadow
        distance={isWinner ? 60 : 42}
        radius={26}
        color="rgba(42,38,32,0.20)"
        style={{
          width: 640,
          background:
            "linear-gradient(160deg, rgba(245,238,220,0.97), rgba(222,210,182,0.95))",
          border: `2px solid ${isLoser ? "rgba(42,38,32,0.14)" : headColor}`,
          borderRadius: 26,
          padding: "44px 46px 50px",
          filter: isLoser ? "saturate(0.7) brightness(0.97)" : undefined,
        }}
      >
        {/* cinta de encabezado del panel */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 26,
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 4,
              background: headColor,
              boxShadow: `0 0 0 5px ${headColor}22`,
            }}
          />
          <div
            style={{
              fontSize: 21,
              letterSpacing: 3,
              textTransform: "uppercase",
              fontWeight: 700,
              color: COLORS.textSoft,
            }}
          >
            {which === "left" ? "Opción A" : "Opción B"}
          </div>
        </div>

        <div
          style={{
            fontSize: 52,
            lineHeight: 1.02,
            fontWeight: 800,
            color: isLoser ? "rgba(42,38,32,0.55)" : COLORS.text,
            marginBottom: 30,
            textDecoration: isLoser ? "line-through" : "none",
            textDecorationColor: "rgba(176,80,60,0.55)",
            textDecorationThickness: 3,
          }}
        >
          {side.title}
        </div>

        {/* regla de tinta bajo el título */}
        <svg viewBox="0 0 560 20" width="100%" height={16} style={{ display: "block", marginBottom: 22 }}>
          <InkDraw
            d="M 6 12 C 150 4, 410 20, 554 10"
            at={at + 8}
            duration={26}
            length={600}
            color={isLoser ? loseTint : headColor}
            width={4}
          />
        </svg>

        {/* puntos, se escriben en stagger */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {(side.points ?? []).slice(0, 4).map((pt, i) => {
            const bp = spring({
              frame: frame - at - 12 - i * 7,
              fps,
              config: { damping: 16, mass: 0.7, stiffness: 150 },
            });
            const good = which === "right";
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  opacity: bp,
                  transform: `translateX(${(1 - bp) * sgn * 26}px)`,
                }}
              >
                <svg viewBox="0 0 34 34" width={34} height={34} style={{ flexShrink: 0 }}>
                  <circle
                    cx={17}
                    cy={17}
                    r={15}
                    fill="none"
                    stroke={isLoser ? loseTint : good ? accent : COLORS.amber}
                    strokeWidth={2.4}
                    opacity={0.55}
                  />
                  {good && !isLoser ? (
                    <InkDraw
                      d="M 9 18 L 15 24 L 26 10"
                      at={at + 14 + i * 7}
                      duration={14}
                      length={40}
                      color={accent}
                      width={4}
                    />
                  ) : (
                    <InkDraw
                      d="M 11 11 L 23 23 M 23 11 L 11 23"
                      at={at + 14 + i * 7}
                      duration={14}
                      length={40}
                      color={isLoser ? loseTint : COLORS.danger}
                      width={3.6}
                    />
                  )}
                </svg>
                <div
                  style={{
                    fontSize: 30,
                    fontWeight: 600,
                    color: isLoser ? "rgba(42,38,32,0.5)" : COLORS.text,
                  }}
                >
                  {pt}
                </div>
              </div>
            );
          })}
        </div>

        {/* banderín GANADOR */}
        {isWinner && (
          <div
            style={{
              position: "absolute",
              top: -18,
              right: 28,
              opacity: verdictS,
              transform: `translateY(${(1 - verdictS) * -18}px) rotate(-4deg)`,
            }}
          >
            <div
              style={{
                background: accent,
                color: "#F7F1DF",
                fontWeight: 800,
                fontSize: 24,
                letterSpacing: 2,
                padding: "10px 22px",
                borderRadius: 10,
                boxShadow: "0 10px 24px rgba(42,38,32,0.28)",
                textTransform: "uppercase",
              }}
            >
              El mejor
            </div>
          </div>
        )}
      </DepthShadow>
    );

    const framed = (
      <div
        style={{
          transform: `translateY(${lift + idle}px)`,
          transition: "none",
        }}
      >
        <Frame3D
          at={at}
          rotateY={sgn * -9}
          rotateX={3}
          depth={isWinner ? 70 : 40}
          perspective={1500}
        >
          {card}
        </Frame3D>
      </div>
    );

    return (
      <div style={{ opacity: p, position: "relative" }}>
        {isWinner ? (
          <RimLight color={accent} spread={30} x={which === "left" ? 0.3 : 0.7} y={0.25}>
            {framed}
          </RimLight>
        ) : (
          framed
        )}
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK }}>
      <TechBackground glowX={50} glowY={30} hue="amber" drift={0.35} />
      <GodRays x={50} y={-12} angle={16} color="rgba(169,121,74,0.16)" rays={8} />
      <SfxCue at={0} src={SFX.whoosh} volume={0.4} />
      <SfxCue at={verdictAt} src={SFX.winnerChime} volume={0.5} />

      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <ParticleField count={20} kind="dust" rise drift={16} opacity={0.5} />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "70px 90px 90px",
        }}
      >
        {/* encabezado */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 46,
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
              marginBottom: 8,
            }}
          >
            {subtitle}
          </div>
          <div style={{ fontSize: 68, fontWeight: 800, color: COLORS.text, lineHeight: 1.03 }}>
            {title}
          </div>
        </div>

        {/* paneles + divisor central */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 30,
            position: "relative",
          }}
        >
          <Panel side={left} which="left" at={sec(0.35)} />

          {/* divisor de tinta + moneda "VS" */}
          <div
            style={{
              position: "relative",
              width: 120,
              height: 460,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              viewBox="0 0 120 460"
              width={120}
              height={460}
              style={{ position: "absolute", inset: 0 }}
            >
              <InkDraw
                d="M 60 10 C 44 120, 76 200, 60 230 C 44 260, 76 340, 60 450"
                at={sec(0.7)}
                duration={34}
                length={480}
                color="rgba(42,38,32,0.5)"
                width={3}
              />
            </svg>
            <div
              style={{
                transform: `scale(${interpolate(enter, [0, 1], [0.4, 1])})`,
                zIndex: 2,
              }}
            >
              <div style={{ position: "relative", width: 108, height: 108 }}>
                <DepthShadow
                  distance={22}
                  radius={54}
                  color="rgba(42,38,32,0.3)"
                  style={{
                    width: 108,
                    height: 108,
                    borderRadius: 54,
                    background:
                      "radial-gradient(circle at 38% 32%, #C9A15E, #8C6A34 70%, #6E5326)",
                    border: "3px solid rgba(247,241,223,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 46,
                      fontWeight: 900,
                      color: "#F7F1DF",
                      letterSpacing: 1,
                      textShadow: "0 2px 3px rgba(42,38,32,0.4)",
                    }}
                  >
                    VS
                  </span>
                </DepthShadow>
              </div>
            </div>
          </div>

          <Panel side={right} which="right" at={sec(0.55)} />
        </div>

        {/* sello de veredicto abajo (cuando hay ganador) */}
        {verdict !== null && (
          <div
            style={{
              marginTop: 40,
              display: "flex",
              alignItems: "center",
              gap: 20,
              opacity: verdictS,
              transform: `translateY(${(1 - verdictS) * 22}px)`,
            }}
          >
            <div style={{ transform: "rotate(-8deg)" }}>
              <WaxSeal at={verdictAt} size={92} color={accent} initials="✓" />
            </div>
            <div style={{ fontSize: 34, fontWeight: 700, color: COLORS.text }}>
              Veredicto:{" "}
              <span style={{ color: accent, fontWeight: 800 }}>
                {verdict === "left" ? left.title : right.title}
              </span>
            </div>
          </div>
        )}
      </AbsoluteFill>

      <PaperGrain opacity={0.1} scale={0.85} />
    </AbsoluteFill>
  );
};

export default CompareTwoKit;

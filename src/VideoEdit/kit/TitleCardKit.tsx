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
  PaperGrain,
  DepthShadow,
  InkDraw,
  Frame3D,
  RimLight,
  SvgFilters,
  wobble,
} from "./depth";

// ═══════════════════════════════════════════════════════════════════════════
// TitleCardKit — PLACA DE APERTURA de la marca terroso-vintage (almanaque).
// Genérica y PROP-DRIVEN: sirve a huertas, amish y reparaciones sin cambios.
//   eyebrow (ALMANAQUE)  → título serif grande  → subtítulo, todo sobre una
//   tarjeta de pergamino que se ASIENTA en 3D con sombra multicapa, bañada por
//   rayos de luz cálida de establo. El subrayado se DIBUJA a pluma (InkDraw).
// Técnica: Frame3D del card, DepthShadow multicapa, GodRays cálidos, PaperGrain,
//          InkDraw del subrayado, ParallaxLayer + ParticleField (polvo dorado).
// RENDER-SAFE: todo deriva de useCurrentFrame() (spring/interpolate) + rand(i).
// ═══════════════════════════════════════════════════════════════════════════

export const TitleCardKit: React.FC<{
  durationInFrames: number;
  title?: string;
  subtitle?: string;
  accent?: string;
  eyebrow?: string;
  underline?: boolean;
}> = ({
  durationInFrames,
  title = "El título",
  subtitle = "",
  accent = COLORS.amber,
  eyebrow = "ALMANAQUE",
  underline = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Entradas escalonadas ──────────────────────────────────────────────────
  const eyebrowIn = spring({ frame: frame - sec(0.35), fps, config: { damping: 200, stiffness: 60 } });
  const titleIn = spring({ frame: frame - sec(0.6), fps, config: { damping: 18, mass: 0.9, stiffness: 110 } });
  const subIn = spring({ frame: frame - sec(1.3), fps, config: { damping: 200, stiffness: 55 } });

  // idle: respiración muy sutil de todo el bloque
  const breathe = 1 + Math.sin(frame / 90) * 0.006;
  const driftY = wobble(0, frame, 0.5) * 3;

  // salida limpia (fade final)
  const outFade = interpolate(
    frame,
    [durationInFrames - sec(0.6), durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // ── Longitud aproximada del subrayado según el título ─────────────────────
  const cardW = 1180;
  const uW = Math.min(cardW * 0.62, 200 + title.length * 26);
  const uX = 800 - uW / 2;
  const uY = subtitle ? 578 : 596;
  // trazo con leve "ola" a pluma
  const underlinePath = `M ${uX} ${uY}
    C ${uX + uW * 0.28} ${uY - 10}, ${uX + uW * 0.5} ${uY + 8}, ${uX + uW * 0.72} ${uY - 4}
    S ${uX + uW} ${uY + 2}, ${uX + uW} ${uY}`;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg2, fontFamily: FONT_STACK, opacity: outFade }}>
      <SvgFilters prefix="titlecard" />

      {/* ── FONDO PROFUNDO: gradiente cálido de taller + viñeta ── */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 90% at 62% 18%, ${COLORS.bg0} 0%, ${COLORS.bg1} 42%, ${COLORS.bg2} 78%, #C9B994 100%)`,
        }}
      />

      {/* capa lejana: mancha de tinta / textura desenfocada con parallax lento */}
      <ParallaxLayer depth={0.2} driftX={26} driftY={14}>
        <AbsoluteFill style={{ opacity: 0.5 }}>
          <svg viewBox="0 0 1600 900" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
            <ellipse cx={1180} cy={210} rx={520} ry={360} fill={COLORS.bg0} opacity={0.35} />
            <ellipse cx={360} cy={760} rx={480} ry={300} fill="#C9B994" opacity={0.5} />
          </svg>
        </AbsoluteFill>
      </ParallaxLayer>

      {/* luz volumétrica cálida cayendo desde arriba-derecha */}
      <GodRays x={70} y={-14} angle={20} color="rgba(169,121,74,0.22)" intensity={1.05} rays={8} />

      {/* polvo dorado suspendido (capa media, sube lento) */}
      <ParallaxLayer depth={0.55} driftX={18} driftY={10}>
        <ParticleField count={26} kind="dust" rise drift={26} color={accent} width={1600} height={900} opacity={0.5} />
      </ParallaxLayer>

      {/* ── BLOQUE CENTRAL en perspectiva 3D ── */}
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: `translateY(${driftY}px) scale(${breathe})` }}>
          <Frame3D at={0} rotateY={9} rotateX={5} depth={54} perspective={1500}>
            <DepthShadow layers={6} distance={54} radius={26} color="rgba(42,38,32,0.20)">
              {/* TARJETA de pergamino */}
              <RimLight color="rgba(169,121,74,0.5)" spread={30} x={0.72} y={0.18}>
                <div
                  style={{
                    position: "relative",
                    width: cardW,
                    height: 660,
                    borderRadius: 26,
                    overflow: "hidden",
                    background: `linear-gradient(150deg, ${COLORS.bg0} 0%, #F3ECD8 30%, ${COLORS.bg1} 72%, ${COLORS.bg2} 100%)`,
                    border: "1px solid rgba(42,38,32,0.14)",
                    boxShadow: "inset 0 2px 0 rgba(255,255,255,0.55), inset 0 -30px 60px rgba(120,90,50,0.14)",
                  }}
                >
                  {/* borde interno doble grabado (marco de almanaque) */}
                  <svg viewBox="0 0 1180 660" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
                    <rect x={30} y={30} width={1120} height={600} rx={16} fill="none" stroke={COLORS.ink} strokeOpacity={0.22} strokeWidth={2.5} />
                    <rect x={42} y={42} width={1096} height={576} rx={12} fill="none" stroke={accent} strokeOpacity={0.55} strokeWidth={1.5} />
                    {/* florones en las esquinas */}
                    {[
                      [56, 56, 1, 1],
                      [1124, 56, -1, 1],
                      [56, 604, 1, -1],
                      [1124, 604, -1, -1],
                    ].map(([fx, fy, sx, sy], i) => (
                      <g key={i} stroke={accent} strokeOpacity={0.6} strokeWidth={2} fill="none" strokeLinecap="round">
                        <path d={`M ${fx} ${fy + sy * 34} Q ${fx + sx * 4} ${fy + sy * 12} ${fx + sx * 30} ${fy + sy * 6}`} />
                        <path d={`M ${fx + sx * 34} ${fy} Q ${fx + sx * 12} ${fy + sy * 4} ${fx + sx * 6} ${fy + sy * 30}`} />
                        <circle cx={fx + sx * 14} cy={fy + sy * 14} r={3} fill={accent} fillOpacity={0.7} stroke="none" />
                      </g>
                    ))}
                  </svg>

                  {/* grano de papel encima del contenido */}
                  <PaperGrain opacity={0.14} scale={0.85} seed={11} blend="multiply" />

                  {/* CONTENIDO */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0 90px",
                      textAlign: "center",
                    }}
                  >
                    {/* EYEBROW + ornamentos laterales */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 20,
                        opacity: eyebrowIn,
                        transform: `translateY(${(1 - eyebrowIn) * -10}px)`,
                        marginBottom: 26,
                      }}
                    >
                      <Flourish dir={-1} color={accent} />
                      <div
                        style={{
                          letterSpacing: 10,
                          fontSize: 26,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          color: accent,
                        }}
                      >
                        {eyebrow}
                      </div>
                      <Flourish dir={1} color={accent} />
                    </div>

                    {/* TÍTULO serif grande con relieve */}
                    <div
                      style={{
                        opacity: titleIn,
                        transform: `translateY(${(1 - titleIn) * 26}px) scale(${interpolate(titleIn, [0, 1], [0.94, 1])})`,
                        fontSize: title.length > 22 ? 88 : 118,
                        lineHeight: 1.02,
                        fontWeight: 800,
                        color: COLORS.text,
                        letterSpacing: -1,
                        textShadow: "0 2px 0 rgba(255,255,255,0.5), 0 4px 14px rgba(120,90,50,0.28)",
                        maxWidth: 980,
                      }}
                    >
                      {title}
                    </div>

                    {/* SUBRAYADO dibujado a pluma */}
                    {underline && (
                      <svg
                        viewBox="0 0 1600 900"
                        width="100%"
                        height="100%"
                        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
                      >
                        <InkDraw d={underlinePath} at={sec(1.0)} duration={sec(0.8)} color={accent} width={5} length={uW * 1.2} dropShadow />
                        <InkDraw d={underlinePath} at={sec(1.15)} duration={sec(0.8)} color={COLORS.ink} width={1.5} length={uW * 1.2} />
                      </svg>
                    )}

                    {/* SUBTÍTULO */}
                    {subtitle && (
                      <div
                        style={{
                          marginTop: underline ? 34 : 22,
                          opacity: subIn,
                          transform: `translateY(${(1 - subIn) * 12}px)`,
                          fontSize: 40,
                          fontWeight: 500,
                          fontStyle: "italic",
                          color: COLORS.textSoft,
                          maxWidth: 900,
                        }}
                      >
                        {subtitle}
                      </div>
                    )}
                  </div>
                </div>
              </RimLight>
            </DepthShadow>
          </Frame3D>
        </div>
      </AbsoluteFill>

      {/* partículas de primer plano (cercanas, más grandes, delante del card) */}
      <ParallaxLayer depth={0.9} driftX={30} driftY={16}>
        <ParticleField count={10} kind="dust" rise drift={40} color="#EDE4CE" width={1600} height={900} opacity={0.35} />
      </ParallaxLayer>

      {/* viñeta cálida final para asentar la escena */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: "radial-gradient(115% 85% at 50% 42%, rgba(0,0,0,0) 55%, rgba(60,44,24,0.22) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// pequeño ornamento serif (rombo + trazo) que flanquea el eyebrow
const Flourish: React.FC<{ dir: 1 | -1; color: string }> = ({ dir, color }) => (
  <svg width={90} height={22} viewBox="0 0 90 22" style={{ overflow: "visible" }}>
    <line x1={dir === 1 ? 0 : 90} y1={11} x2={dir === 1 ? 62 : 28} y2={11} stroke={color} strokeWidth={2} strokeLinecap="round" />
    <g transform={`translate(${dir === 1 ? 74 : 16} 11)`}>
      <path d="M 0 -6 L 8 0 L 0 6 L -8 0 Z" fill={color} opacity={0.9} />
    </g>
  </svg>
);

export default TitleCardKit;

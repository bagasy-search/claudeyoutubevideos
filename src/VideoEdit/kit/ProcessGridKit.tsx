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
  SvgFilters,
  rand,
  wobble,
} from "./depth";

// ══════════════════════════════════════════════════════════════════════════════
// ProcessGridKit — REJILLA DE PROCESO con profundidad.
// Tarjetas de pergamino (2×2 / 3×N) que entran escalonadas en perspectiva
// (Frame3D stagger) con sombra 3D multicapa. Cada tarjeta trae un ÍCONO dibujado
// a tinta (InkDraw) según un glifo genérico + número de paso en medalla, título y
// nota. Luz volumétrica cálida (GodRays) y polvo de establo dan el aire de taller.
//
// PROP-DRIVEN — el TEMA entra por `cards[]`:
//   • huerta: pasos de "cómo armar un bancal"  • reparación: "reparar una fuga"
//   • amish: "afilar una guadaña". El `icon` es un glifo semántico genérico
//     ("seed"|"drop"|"tool"|"fire"|"sun"|"leaf"|"hand"|"clock"|"check"|"gear")
//     que se dibuja a tinta; si no matchea, cae en un sello con la inicial.
// Renderiza SOLO sin props con 4 tarjetas de ejemplo.
// ══════════════════════════════════════════════════════════════════════════════

type Card = { icon?: string; title: string; note?: string };

// Glifos de tinta genéricos (paths en un lienzo 100×100, centrados).
const GLYPHS: Record<string, { paths: { d: string; fill?: string; w?: number }[]; len: number }> = {
  seed: { len: 260, paths: [{ d: "M50 22 C30 30 24 54 34 74 C44 60 56 60 66 74 C76 54 70 30 50 22 Z", fill: "soft" }, { d: "M50 30 C50 48 50 62 50 78", w: 4 }] },
  drop: { len: 260, paths: [{ d: "M50 20 C34 42 28 56 28 66 A22 22 0 0 0 72 66 C72 56 66 42 50 20 Z", fill: "soft" }, { d: "M40 60 A12 12 0 0 0 52 72", w: 3.5 }] },
  leaf: { len: 240, paths: [{ d: "M26 74 C26 40 52 24 78 26 C78 60 52 78 26 74 Z", fill: "soft" }, { d: "M30 70 C46 58 62 46 74 32", w: 4 }] },
  sun: { len: 320, paths: [{ d: "M50 34 A16 16 0 1 1 49.9 34 Z", fill: "solid" }] },
  fire: { len: 260, paths: [{ d: "M50 20 C40 36 34 44 38 58 C30 54 30 44 30 44 C22 58 26 78 50 80 C74 78 78 56 68 42 C66 52 60 54 60 54 C64 40 58 30 50 20 Z", fill: "soft" }] },
  tool: { len: 300, paths: [{ d: "M28 30 A12 12 0 0 0 44 46 L64 66 L72 58 L52 38 A12 12 0 0 0 36 22 L44 34 L40 44 L30 40 Z", fill: "soft" }, { d: "M62 64 L78 80", w: 5 }] },
  hand: { len: 300, paths: [{ d: "M36 46 L36 30 M46 46 L46 26 M56 46 L56 28 M66 48 L66 34", w: 5 }, { d: "M32 48 C30 66 40 82 56 82 C72 82 76 68 76 56 L76 48", fill: "soft", w: 4 }] },
  clock: { len: 300, paths: [{ d: "M50 26 A24 24 0 1 1 49.9 26 Z", w: 5 }, { d: "M50 38 L50 52 L64 60", w: 4 }] },
  check: { len: 200, paths: [{ d: "M50 26 A24 24 0 1 1 49.9 26 Z", w: 4 }, { d: "M36 52 L46 62 L66 40", w: 6 }] },
  gear: { len: 340, paths: [{ d: "M50 30 L54 30 L56 40 L64 43 L71 37 L74 40 L69 48 L74 55 L71 58 L64 52 L56 55 L54 66 L50 66 L48 55 L40 52 L33 58 L30 55 L35 48 L30 40 L33 37 L40 43 L48 40 Z", fill: "soft" }, { d: "M52 48 A6 6 0 1 1 51.9 48 Z", w: 3 }] },
  spade: { len: 300, paths: [{ d: "M46 22 L58 22 L58 44 L46 44 Z", w: 4 }, { d: "M40 44 L64 44 L58 66 C58 76 46 76 46 66 Z", fill: "soft" }, { d: "M46 66 L46 82 M58 66 L58 82", w: 4 }] },
};

// Mapea íconos "sueltos" (emojis o alias) → clave de glifo de tinta, para que
// SIEMPRE se dibuje un ícono grabado en vez de caer en la inicial del título.
const ICON_ALIAS: Record<string, string> = {
  "🌱": "seed", "🌿": "leaf", "🍃": "leaf", "🍂": "leaf", "☀️": "sun", "🌞": "sun",
  "🔥": "fire", "💧": "drop", "🌧️": "drop", "🛠️": "tool", "🔧": "tool", "🔨": "tool",
  "✋": "hand", "🖐️": "hand", "⏰": "clock", "🕒": "clock", "✅": "check", "✔️": "check",
  "⚙️": "gear", "❄️": "gear", "🪏": "spade", "🌰": "seed",
  semilla: "seed", hoja: "leaf", sol: "sun", fuego: "fire", agua: "drop",
  herramienta: "tool", mano: "hand", reloj: "clock", listo: "check", engranaje: "gear",
};

const resolveGlyph = (icon?: string) => {
  if (!icon) return undefined;
  if (GLYPHS[icon]) return GLYPHS[icon];
  const alias = ICON_ALIAS[icon] ?? ICON_ALIAS[icon.toLowerCase()];
  return alias ? GLYPHS[alias] : undefined;
};

export const ProcessGridKit: React.FC<{
  durationInFrames: number;
  title?: string;
  subtitle?: string;
  accent?: string;
  cards?: Card[];
}> = ({
  durationInFrames,
  title = "El proceso, paso a paso",
  subtitle = "método · paso a paso",
  accent = COLORS.amber,
  cards = [
    { icon: "spade", title: "Preparar la tierra", note: "Aflojá los primeros veinte centímetros." },
    { icon: "seed", title: "Sembrar en línea", note: "Un dedo de hondo, separadas a mano." },
    { icon: "drop", title: "Regar al ras", note: "Poca agua, pero todos los días al alba." },
    { icon: "leaf", title: "Acolchar encima", note: "Paja seca para guardar la humedad." },
  ],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 60 } });
  const outStart = durationInFrames - sec(0.5);
  const exit = interpolate(frame, [outStart, durationInFrames], [1, 0.88], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // rejilla adaptativa: hasta 3 columnas
  const n = cards.length;
  const cols = n <= 2 ? n : n === 4 ? 2 : Math.min(3, n);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK }}>
      <SvgFilters prefix="pgk" />
      <TechBackground glowX={50} glowY={30} hue="amber" drift={0.3} />
      <SfxCue at={0} src={SFX.whoosh} volume={0.35} />

      {/* profundidad lejana: haz de luz de taller + polvo */}
      <GodRays x={64} y={-14} angle={22} intensity={0.85} rays={7} />
      <ParallaxLayer depth={0.22} driftX={22} driftY={14}>
        <ParticleField count={18} kind="dust" rise={false} drift={24} opacity={0.45} />
      </ParallaxLayer>

      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "90%", maxWidth: 1560, opacity: enter * exit }}>
          {/* encabezado */}
          <div style={{ textAlign: "center", marginBottom: 46 }}>
            {subtitle && (
              <div
                style={{
                  letterSpacing: 6,
                  fontSize: 20,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: accent,
                  marginBottom: 8,
                  opacity: interpolate(enter, [0.3, 1], [0, 1], { extrapolateLeft: "clamp" }),
                }}
              >
                {subtitle}
              </div>
            )}
            <div style={{ fontSize: 60, fontWeight: 800, color: COLORS.text, transform: `translateY(${(1 - enter) * 18}px)` }}>
              {title}
            </div>
            <svg viewBox="0 0 520 34" width={Math.min(520, title.length * 20)} height={34} style={{ display: "block", margin: "6px auto 0" }}>
              <InkDraw d="M 8 20 C 140 6 340 30 512 14" at={sec(0.4)} duration={sec(0.8)} color={accent} width={6} length={560} dropShadow />
            </svg>
          </div>

          {/* rejilla */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gap: 34,
              perspective: 1500,
            }}
          >
            {cards.map((c, i) => {
              const at = sec(0.5 + i * 0.28);
              const s = spring({ frame: frame - at, fps, config: { damping: 18, mass: 0.9, stiffness: 120 } });
              // idle: leve balanceo alterno para que no queden estáticas
              const idle = wobble(i, frame, 0.5) * 0.6;
              const rot = (i % 2 === 0 ? 1 : -1) * (2.2 + rand(i) * 1.6);
              const glyph = resolveGlyph(c.icon);

              return (
                <div key={i} style={{ opacity: s, perspective: 1500 }}>
                  <Frame3D at={at} rotateY={(i % 2 === 0 ? -1 : 1) * 9 + idle} rotateX={4} depth={44} perspective={1500}>
                    <DepthShadow layers={6} distance={44} radius={22} color="rgba(42,38,32,0.2)">
                      <div
                        style={{
                          background: `linear-gradient(160deg, ${COLORS.bg0}, ${COLORS.bg2})`,
                          borderRadius: 22,
                          border: "1px solid rgba(42,38,32,0.16)",
                          padding: "30px 30px 32px",
                          minHeight: 250,
                          position: "relative",
                          overflow: "hidden",
                          boxShadow: "inset 0 2px 0 rgba(255,255,255,0.5), inset 0 -3px 14px rgba(42,38,32,0.12)",
                          transform: `rotate(${rot * 0.15}deg)`,
                        }}
                      >
                        {/* número de paso en medalla, arriba a la derecha */}
                        <div
                          style={{
                            position: "absolute",
                            top: 18,
                            right: 18,
                            width: 56,
                            height: 56,
                            borderRadius: "50%",
                            background: accent,
                            color: COLORS.bg0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 30,
                            fontWeight: 900,
                            boxShadow: "0 6px 14px rgba(42,38,32,0.28), inset 0 2px 0 rgba(255,255,255,0.35)",
                            border: "2px solid rgba(255,255,255,0.35)",
                          }}
                        >
                          {i + 1}
                        </div>

                        {/* ícono a tinta en un sello circular */}
                        <div style={{ width: 96, height: 96, marginBottom: 18, position: "relative" }}>
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              borderRadius: "50%",
                              background: "radial-gradient(circle at 38% 32%, #F4E7C6, " + COLORS.bg2 + ")",
                              boxShadow: "inset 0 0 0 2px rgba(42,38,32,0.16), 0 6px 12px rgba(42,38,32,0.16)",
                            }}
                          />
                          <svg viewBox="0 0 100 100" width={96} height={96} style={{ position: "absolute", inset: 0 }}>
                            {glyph ? (
                              glyph.paths.map((p, k) => (
                                <InkDraw
                                  key={k}
                                  d={p.d}
                                  at={at + sec(0.2 + k * 0.12)}
                                  duration={sec(0.55)}
                                  color={COLORS.ink}
                                  width={p.w ?? 4.5}
                                  length={glyph.len}
                                  fill={p.fill === "solid" ? accent : p.fill === "soft" ? COLORS.accentSoft : "none"}
                                />
                              ))
                            ) : (
                              // fallback: inicial del título grabada
                              <text
                                x={50}
                                y={66}
                                textAnchor="middle"
                                fontFamily={FONT_STACK}
                                fontWeight={900}
                                fontSize={54}
                                fill={COLORS.ink}
                                opacity={interpolate(s, [0.3, 1], [0, 0.85], { extrapolateLeft: "clamp" })}
                              >
                                {c.title.charAt(0).toUpperCase()}
                              </text>
                            )}
                          </svg>
                        </div>

                        <div style={{ fontSize: 34, fontWeight: 800, color: COLORS.text, lineHeight: 1.12, marginBottom: c.note ? 10 : 0 }}>
                          {c.title}
                        </div>
                        {c.note && (
                          <div style={{ fontSize: 24, lineHeight: 1.32, color: COLORS.textSoft, fontWeight: 500 }}>{c.note}</div>
                        )}

                        {/* grano de papel por tarjeta */}
                        <PaperGrain opacity={0.08} scale={1.1} seed={i + 2} />
                      </div>
                    </DepthShadow>
                  </Frame3D>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>

      <PaperGrain opacity={0.08} scale={0.9} seed={7} />
    </AbsoluteFill>
  );
};

export default ProcessGridKit;

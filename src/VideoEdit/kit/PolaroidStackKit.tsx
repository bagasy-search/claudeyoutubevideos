import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import {
  ParallaxLayer,
  ParticleField,
  PaperGrain,
  GodRays,
  DepthShadow,
  Frame3D,
  rand,
  wobble,
} from "./depth";

// ═══════════════════════════════════════════════════════════════════════════
// PolaroidStackKit — una PILA de fotos polaroid/de archivo tiradas sobre la mesa
// del taller que se ABANICAN una tras otra (spring escalonado), cada una con su
// leyenda manuscrita. Rotaciones/offsets determinísticos por índice (rand).
//
// GENÉRICO por props: `photos[]` (image + caption). Sin props → 3 polaroids
// placeholder. Sirve para "el antes/durante/después" (huerta), "3 piezas del
// arreglo" (reparación) o "el proceso a mano" (amish).
// RENDER-SAFE: rand(i)/wobble(i,frame). Nada de Math.random/Date.now.
// ═══════════════════════════════════════════════════════════════════════════

type Photo = { image?: string; caption?: string };

const resolveSrc = (src?: string): string | null => {
  if (!src) return null;
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  try {
    return staticFile(src);
  } catch {
    return src;
  }
};

// paletas placeholder por índice (dentro de la marca terrosa)
const PLACE_TONES: [string, string][] = [
  [COLORS.good, COLORS.accent],
  [COLORS.amber, COLORS.bg2],
  [COLORS.cold, COLORS.coldSoft],
  [COLORS.accentSoft, COLORS.good],
];

export const PolaroidStackKit: React.FC<{
  durationInFrames: number;
  title?: string;
  subtitle?: string;
  accent?: string;
  photos?: Photo[];
}> = ({
  durationInFrames,
  title = "El registro",
  subtitle = "Del archivo",
  accent = COLORS.amber,
  photos = [
    { caption: "El comienzo" },
    { caption: "A mitad de camino" },
    { caption: "El resultado" },
  ],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 22, mass: 0.9, stiffness: 110 } });

  const items = photos.slice(0, 5);
  const n = Math.max(items.length, 1);

  const PW = 380; // ancho polaroid
  const PH = 460; // alto polaroid (con margen inferior para leyenda)

  // el abanico se despliega en arco: la del medio arriba, las laterales caídas.
  const spread = Math.min(300, 640 / n); // px de separación horizontal por foto

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK }}>
      {/* Fondo: mesa de madera cálida con veta + viñeta + rayos */}
      <ParallaxLayer depth={0.12} driftY={8}>
        <AbsoluteFill
          style={{
            background: `radial-gradient(130% 100% at 50% 30%, ${COLORS.bg1} 0%, ${COLORS.bg2} 55%, #c9b78f 100%)`,
          }}
        />
      </ParallaxLayer>
      {/* veta de madera sutil */}
      <AbsoluteFill style={{ opacity: 0.14, mixBlendMode: "multiply" }}>
        <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1600 900">
          {Array.from({ length: 14 }, (_, i) => (
            <path
              key={i}
              d={`M 0 ${40 + i * 66} C 400 ${40 + i * 66 + 18}, 1100 ${40 + i * 66 - 18}, 1600 ${40 + i * 66}`}
              fill="none"
              stroke="#7a5a36"
              strokeWidth={2 + rand(i) * 3}
            />
          ))}
        </svg>
      </AbsoluteFill>
      <GodRays x={58} y={-14} angle={18} color="rgba(169,121,74,0.16)" rays={6} />
      <AbsoluteFill style={{ background: "radial-gradient(120% 100% at 50% 44%, rgba(0,0,0,0) 50%, rgba(42,38,32,0.34) 100%)" }} />

      {/* Título */}
      <div style={{ position: "absolute", top: 60, left: 0, right: 0, textAlign: "center", opacity: enter, transform: `translateY(${(1 - enter) * -16}px)` }}>
        <div style={{ fontSize: 24, letterSpacing: 6, textTransform: "uppercase", color: accent, fontWeight: 700 }}>{subtitle}</div>
        <div style={{ fontSize: 62, fontWeight: 800, color: COLORS.text, marginTop: 2 }}>{title}</div>
      </div>

      {/* Pila abanicada — centrada, ligeramente a la izquierda para dejar libre la esq. inf. der. */}
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 46 }}>
        <div style={{ position: "relative", width: 1200, height: 620, transform: "translateX(-70px)" }}>
          {items.map((ph, i) => {
            const at = 0.35 + i * 0.5;
            const s = spring({ frame: frame - sec(at), fps, config: { damping: 14, mass: 0.8, stiffness: 150 } });
            // posición final en el abanico
            const mid = (n - 1) / 2;
            const off = i - mid;
            const finalX = off * spread;
            const finalY = Math.abs(off) * 26 - 10; // arco: centro más alto
            const finalRot = off * 7 + (rand(i, 3) - 0.5) * 4;
            // idle: respiración/tilt muy sutil
            const idleRot = wobble(i, frame, 0.5) * 0.7;
            const idleY = wobble(i, frame + 30, 0.5) * 4;

            const x = interpolate(s, [0, 1], [-40 + off * 8, finalX]);
            const y = interpolate(s, [0, 1], [70, finalY]) + idleY;
            const rot = interpolate(s, [0, 1], [off * 2, finalRot]) + idleRot;
            const zi = 10 + i;

            const src = resolveSrc(ph.image);
            const [c1, c2] = PLACE_TONES[i % PLACE_TONES.length];

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  zIndex: zi,
                  transform: `translate(-50%,-50%) translate(${x}px, ${y}px) rotate(${rot}deg)`,
                  opacity: s,
                }}
              >
                <Frame3D at={sec(at)} rotateY={off * -3} rotateX={2} depth={20 + i * 6} perspective={1600}>
                  <DepthShadow layers={6} distance={40 + i * 4} radius={4} color="rgba(42,38,32,0.32)">
                    <div
                      style={{
                        width: PW,
                        height: PH,
                        background: "#f7f1e0",
                        borderRadius: 4,
                        padding: "18px 18px 0",
                        boxSizing: "border-box",
                        boxShadow: "inset 0 0 0 1px rgba(42,38,32,0.12)",
                        position: "relative",
                      }}
                    >
                      {/* ventana de la foto */}
                      <div
                        style={{
                          width: "100%",
                          height: PW - 6,
                          borderRadius: 2,
                          overflow: "hidden",
                          background: COLORS.bg2,
                          position: "relative",
                          boxShadow: "inset 0 0 30px rgba(42,38,32,0.28)",
                        }}
                      >
                        {src ? (
                          <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.88) sepia(0.16) contrast(1.02)" }} />
                        ) : (
                          <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
                            <defs>
                              <linearGradient id={`polg${i}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={c2} />
                                <stop offset="100%" stopColor={c1} />
                              </linearGradient>
                            </defs>
                            <rect width="100" height="100" fill={`url(#polg${i})`} />
                            <circle cx={72} cy={26} r={12} fill="#f0e6cd" opacity={0.7} />
                            <path d="M0 78 C 24 58, 40 70, 62 52 C 80 40, 92 54, 100 46 L100 100 L0 100 Z" fill="#2f3a24" opacity={0.5} />
                            <path d="M0 90 C 30 74, 52 86, 72 70 C 88 60, 96 70, 100 64 L100 100 L0 100 Z" fill="#22301c" opacity={0.7} />
                          </svg>
                        )}
                        {/* brillo de emulsión */}
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(0,0,0,0) 45%)", pointerEvents: "none" }} />
                      </div>
                      {/* leyenda manuscrita */}
                      <div
                        style={{
                          textAlign: "center",
                          marginTop: 12,
                          fontSize: 30,
                          color: COLORS.text,
                          fontStyle: "italic",
                          fontWeight: 600,
                        }}
                      >
                        {ph.caption ?? `Foto ${i + 1}`}
                      </div>
                      {/* grano de papel de la polaroid */}
                      <div style={{ position: "absolute", inset: 0, borderRadius: 4, overflow: "hidden", pointerEvents: "none" }}>
                        <PaperGrain opacity={0.09} scale={1.2} blend="multiply" />
                      </div>
                      {/* cinta adhesiva en una esquina, alternada */}
                      {i % 2 === 0 && (
                        <div
                          style={{
                            position: "absolute",
                            top: -10,
                            left: 30,
                            width: 90,
                            height: 34,
                            background: "rgba(174,186,140,0.55)",
                            transform: "rotate(-18deg)",
                            boxShadow: "0 3px 6px rgba(42,38,32,0.2)",
                          }}
                        />
                      )}
                    </div>
                  </DepthShadow>
                </Frame3D>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* Polvo cálido flotando */}
      <ParticleField count={14} kind="dust" rise drift={22} opacity={0.45} />
      <PaperGrain opacity={0.08} scale={0.85} blend="multiply" />
    </AbsoluteFill>
  );
};

export default PolaroidStackKit;

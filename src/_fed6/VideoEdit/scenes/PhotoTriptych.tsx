import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Media } from "../components/Media";
import { THEME_MEDICO } from "../kit/premium/theme";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

// ═══════════════════════════════════════════════════════════════════════════
// PhotoTriptych — MULTIESCENA de 2 a 4 fotos flotando a distintas profundidades.
//
// La cámara hace un push lento sobre el conjunto y EL FOCO VIAJA de una foto a
// la siguiente repartiendo `durationInFrames` en partes iguales: la activa se
// agranda, se aclara y desbloquea su `caption` en una tarjeta CLARA; las otras
// se hunden en desenfoque y retroceden en Z. Nada aparece de golpe: todo entra
// con springs escalonados y desenfoque de movimiento que decae.
//
// Capas (criterio de kit/premium/stagecraft.tsx):
//   L1 BED foto de cama desenfocada con parallax lento · L2 GRADE scrim
//   L3 SHAFTS haces · L4 FOTOS (Z propio, bob propio, rack focus)
//   L5 SOMBRA de contacto por foto · L6 CAPTION de vidrio claro
//   L7 TIPOGRAFÍA escalonada · L8 MOTAS · L9 GRANO + viñeta
//
// RENDER-SAFE: cero Date.now / Math.random.
// ═══════════════════════════════════════════════════════════════════════════

const INTER = loadInter().fontFamily;
const FONT = `${INTER}, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`;

const DEEP = "#0E1D23";
const TEAL = "#12B3AE";
const TEAL_DEEP = "#063B40";
const CREAM = "#F5F9FA";
const INK = "#0E1B22";
const GOLD = "#E6A23C";
const RADIUS = THEME_MEDICO.radius;

/** azar determinista por índice — copiado de stagecraft.tsx */
const rand = (i: number, salt = 0): number =>
  (((i * 37 + salt * 101 + 13) * 9301 + 49297) % 233280) / 233280;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

export type TriptychItem = {
  image: string;
  caption: string;
  sub?: string;
};

type Props = {
  durationInFrames: number;
  items: TriptychItem[];
  title?: string;
  eyebrow?: string;
  bed?: string;
};

// ── composición escalonada por cantidad (centros en el lienzo 1920x1080) ─────
const layoutFor = (n: number): { x: number; y: number; w: number }[] => {
  if (n <= 1) return [{ x: 960, y: 496, w: 560 }];
  if (n === 2) {
    return [
      { x: 682, y: 486, w: 520 },
      { x: 1242, y: 528, w: 520 },
    ];
  }
  if (n === 3) {
    return [
      { x: 442, y: 506, w: 448 },
      { x: 960, y: 458, w: 448 },
      { x: 1478, y: 528, w: 448 },
    ];
  }
  return [
    { x: 332, y: 522, w: 388 },
    { x: 752, y: 464, w: 388 },
    { x: 1170, y: 534, w: 388 },
    { x: 1588, y: 472, w: 388 },
  ];
};

// ── L1 + L2 · CAMA DE FOTO + GRADE ──────────────────────────────────────────
const Bed: React.FC<{ bed?: string; frame: number }> = ({ bed, frame }) => {
  const px = Math.sin(frame / 268) * 24;
  const py = Math.cos(frame / 332) * 14;
  const breathe = 1.2 + Math.cos(frame / 400) * 0.02;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {bed ? (
        <AbsoluteFill
          style={{ transform: `translate(${px.toFixed(2)}px, ${py.toFixed(2)}px) scale(${breathe.toFixed(4)})` }}
        >
          <Media
            src={bed}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "blur(28px) saturate(0.68) brightness(0.40)",
            }}
          />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill
          style={{
            transform: `translate(${(px * 0.4).toFixed(2)}px, ${(py * 0.4).toFixed(2)}px) scale(${breathe.toFixed(4)})`,
            background: `radial-gradient(126% 96% at 34% 16%, ${TEAL_DEEP} 0%, #0B1B21 48%, #061014 100%)`,
          }}
        />
      )}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(14,29,35,0.90) 0%, rgba(14,29,35,0.32) 34%, rgba(6,59,64,0.32) 64%, rgba(14,29,35,0.94) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(80% 64% at 48% 46%, rgba(18,179,174,0.17) 0%, rgba(6,59,64,0.10) 42%, rgba(10,22,27,0.78) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// ── L3 · HACES DE LUZ ────────────────────────────────────────────────────────
const Shafts: React.FC<{ frame: number; count?: number }> = ({ frame, count = 4 }) => (
  <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none", mixBlendMode: "screen" }}>
    {Array.from({ length: count }, (_, i) => {
      const respiro = 0.5 + 0.5 * Math.sin(frame / (70 + i * 21) + i * 2.3);
      const w = 4 + rand(i, 6) * 9;
      const sway = Math.cos(frame / 190 + i) * 1.6;
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${30 + i * 15 + sway}%`,
            top: "-22%",
            width: `${w}%`,
            height: "184%",
            background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(18,179,174,${(0.08 + rand(i, 8) * 0.07).toFixed(
              3,
            )}) 48%, rgba(0,0,0,0) 100%)`,
            transform: `rotate(${(-14 - rand(i, 5) * 7).toFixed(2)}deg)`,
            transformOrigin: "top center",
            filter: `blur(${(24 + rand(i, 3) * 26).toFixed(1)}px)`,
            opacity: 0.26 + respiro * 0.48,
          }}
        />
      );
    })}
  </AbsoluteFill>
);

// ── L8 · MOTAS ───────────────────────────────────────────────────────────────
const Motes: React.FC<{ frame: number; count?: number }> = ({ frame, count = 24 }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    {Array.from({ length: count }, (_, i) => {
      const depth = rand(i, 12);
      const span = 250 + rand(i, 4) * 210;
      const p = ((frame * (0.3 + depth * 0.75) + rand(i, 5) * span) % span) / span;
      const x = rand(i, 1) * 100 + Math.cos(frame / 72 + i * 1.3) * (1 + depth * 3);
      const y = 106 - p * 120;
      const r = 1.3 + depth * 5;
      const vida = Math.sin(p * Math.PI);
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${x}%`,
            top: `${y}%`,
            width: r * 2,
            height: r * 2,
            borderRadius: "50%",
            background: i % 6 === 0 ? GOLD : TEAL,
            opacity: vida * (0.09 + depth * 0.32),
            filter: `blur(${(depth * 3).toFixed(2)}px)`,
          }}
        />
      );
    })}
  </AbsoluteFill>
);

// ── L9 · GRANO + VIÑETA ──────────────────────────────────────────────────────
const Grain: React.FC<{ frame: number; amount?: number }> = ({ frame, amount = 0.12 }) => {
  const dx = Math.round(rand(frame % 19, 3) * 60) - 30;
  const dy = Math.round(rand(frame % 31, 4) * 60) - 30;
  return (
    <svg
      width="120%"
      height="120%"
      style={{
        position: "absolute",
        left: -60,
        top: -60,
        opacity: amount,
        mixBlendMode: "screen",
        pointerEvents: "none",
        transform: `translate(${dx}px, ${dy}px)`,
      }}
    >
      <filter id="ptrip-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.86" numOctaves={3} seed={19} stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.84  0 0 0 0 0.90  0 0 0 0 0.88  0 0 0 0.56 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#ptrip-grain)" />
    </svg>
  );
};

const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background:
        "radial-gradient(126% 96% at 50% 48%, rgba(3,10,13,0) 42%, rgba(3,10,13,0.30) 76%, rgba(3,10,13,0.60) 100%)",
    }}
  />
);

// ═══════════════════════════════════════════════════════════════════════════
export const PhotoTriptych: React.FC<Props> = ({
  durationInFrames,
  items,
  title,
  eyebrow = "EN IMÁGENES",
  bed,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const list: TriptychItem[] = items && items.length > 0 ? items : [{ image: "", caption: "—" }];
  const n = Math.min(4, list.length);
  const shown = list.slice(0, n);
  const pos = layoutFor(n);

  // ── el foco VIAJA: `durationInFrames` repartido en partes iguales ─────────
  const seg = durationInFrames / Math.max(1, n);
  const t = frame / seg;

  // ── cámara: push lento + micro-órbita (nada queda clavado) ────────────────
  const push = interpolate(frame, [0, durationInFrames], [1, 1.07], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const orbitY = Math.sin(frame / 300) * 1.5;
  const orbitX = Math.sin(frame / 260) * 12;

  // ── entrada / salida de la escena ─────────────────────────────────────────
  const inOp = interpolate(frame, [0, 9], [0, 1], { extrapolateRight: "clamp" });
  const outStart = Math.max(1, durationInFrames - 12);
  const outOp = interpolate(frame, [outStart, durationInFrames - 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const outScale = interpolate(frame, [outStart, durationInFrames - 1], [1, 1.04], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── tipografía escalonada ─────────────────────────────────────────────────
  const eyeSp = spring({ frame: frame - 2, fps, config: { damping: 22, mass: 0.9, stiffness: 115 } });
  const titleSp = spring({ frame: frame - 8, fps, config: { damping: 21, mass: 0.9, stiffness: 118 } });
  const barSp = spring({ frame: frame - 20, fps, config: { damping: 24, mass: 0.9, stiffness: 105 } });

  return (
    <AbsoluteFill
      style={{
        fontFamily: FONT,
        backgroundColor: DEEP,
        overflow: "hidden",
        opacity: inOp * outOp,
      }}
    >
      <AbsoluteFill style={{ transform: `scale(${outScale.toFixed(4)})`, transformOrigin: "50% 50%" }}>
        {/* L1 + L2 */}
        <Bed bed={bed} frame={frame} />
        {/* L3 */}
        <Shafts frame={frame} />

        {/* ── L4 · LAS FOTOS ───────────────────────────────────────────── */}
        <AbsoluteFill style={{ perspective: 1500, perspectiveOrigin: "50% 46%" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              transformStyle: "preserve-3d",
              transform: `translateX(${orbitX.toFixed(2)}px) scale(${push.toFixed(4)}) rotateY(${orbitY.toFixed(
                3,
              )}deg)`,
            }}
          >
            {shown.map((it, i) => {
              const p = pos[i];
              const h = Math.round(p.w * 1.3);

              // foco continuo: mantiene el centro y cruza rápido en el borde
              const g = clamp(1 - Math.abs(t - i), 0, 1);
              const f = smooth(clamp((g - 0.34) / 0.66, 0, 1));

              // entrada escalonada con desenfoque de movimiento que decae
              const enter = spring({
                frame: frame - (7 + i * 10),
                fps,
                config: { damping: 23, mass: 0.95, stiffness: 108 },
              });
              const enterBlur = interpolate(frame - (7 + i * 10), [0, 11], [12, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });

              const bob = Math.sin(frame / (108 + rand(i, 2) * 52) + i * 1.6) * (6 + rand(i, 4) * 6);
              const drift = Math.cos(frame / (146 + rand(i, 7) * 60) + i * 0.9) * (3 + rand(i, 1) * 4);

              const z = -90 + f * 200;
              const sc = (0.86 + 0.2 * f) * (0.93 + 0.07 * enter);
              const ry = ((p.x - 960) / 960) * 10 * (1 - f * 0.45);
              const rx = -2.4 + Math.sin(frame / 240 + i) * 0.9;
              const blur = (1 - f) * 4.4 + enterBlur * 0.4;
              const sat = 0.55 + 0.45 * f;
              const bri = 0.5 + 0.5 * f;

              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: p.x,
                    top: p.y + bob,
                    width: p.w,
                    height: h,
                    marginLeft: -p.w / 2,
                    marginTop: -h / 2,
                    transformStyle: "preserve-3d",
                    transform: `translateX(${drift.toFixed(2)}px) translateY(${((1 - enter) * 46).toFixed(
                      2,
                    )}px) translateZ(${z.toFixed(1)}px) rotateY(${ry.toFixed(3)}deg) rotateX(${rx.toFixed(
                      3,
                    )}deg) scale(${sc.toFixed(4)})`,
                    opacity: Math.min(1, enter * 1.7),
                    zIndex: Math.round(100 + f * 100),
                  }}
                >
                  {/* L5 · sombra de contacto propia */}
                  <div
                    style={{
                      position: "absolute",
                      left: "4%",
                      right: "4%",
                      bottom: -52 - bob * 0.35,
                      height: 54,
                      borderRadius: "50%",
                      background: "radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,0.66) 0%, rgba(0,0,0,0) 74%)",
                      filter: `blur(${(16 + (1 - f) * 10).toFixed(1)}px)`,
                      opacity: 0.4 + f * 0.36,
                    }}
                  />

                  {/* marco de vidrio + foto */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: RADIUS,
                      background: `linear-gradient(155deg, rgba(245,249,250,${(0.26 + f * 0.4).toFixed(
                        3,
                      )}) 0%, rgba(245,249,250,0.07) 46%, rgba(18,179,174,${(0.14 + f * 0.3).toFixed(3)}) 100%)`,
                      boxShadow: `0 ${(22 + f * 26).toFixed(0)}px ${(52 + f * 56).toFixed(
                        0,
                      )}px rgba(3,12,15,${(0.44 + f * 0.2).toFixed(3)}), inset 0 1px 0 rgba(255,255,255,${(
                        0.2 +
                        f * 0.34
                      ).toFixed(3)})`,
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 7,
                        borderRadius: RADIUS - 7,
                        overflow: "hidden",
                        background: "#08171C",
                      }}
                    >
                      {it.image ? (
                        <Media
                          src={it.image}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            filter: `blur(${blur.toFixed(2)}px) saturate(${sat.toFixed(3)}) brightness(${bri.toFixed(
                              3,
                            )})`,
                            transform: `scale(${(1.05 + f * 0.05 + (1 - enter) * 0.04).toFixed(4)})`,
                          }}
                        />
                      ) : null}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: `linear-gradient(180deg, rgba(6,59,64,${(0.28 - f * 0.18).toFixed(
                            3,
                          )}) 0%, rgba(14,29,35,${(0.14 - f * 0.08).toFixed(3)}) 44%, rgba(14,29,35,${(
                            0.6 -
                            f * 0.26
                          ).toFixed(3)}) 100%)`,
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: RADIUS - 7,
                          boxShadow: `inset 0 0 0 ${(1 + f * 1.8).toFixed(1)}px rgba(18,179,174,${(
                            0.24 +
                            f * 0.52
                          ).toFixed(3)}), inset 0 0 ${(16 + f * 38).toFixed(0)}px rgba(18,179,174,${(f * 0.3).toFixed(
                            3,
                          )})`,
                        }}
                      />
                    </div>
                  </div>

                  {/* halo teal de la activa */}
                  {f > 0.02 && (
                    <div
                      style={{
                        position: "absolute",
                        inset: -28,
                        borderRadius: RADIUS + 20,
                        background: `radial-gradient(58% 58% at 50% 50%, rgba(18,179,174,${(f * 0.24).toFixed(
                          3,
                        )}) 0%, rgba(18,179,174,0) 70%)`,
                        filter: "blur(16px)",
                        pointerEvents: "none",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </AbsoluteFill>

        {/* ── L6 · CAPTIONS de vidrio claro, anclados bajo su foto ─────────── */}
        {shown.map((it, i) => {
          const p = pos[i];
          const h = Math.round(p.w * 1.3);
          const g = clamp(1 - Math.abs(t - i), 0, 1);
          const f = smooth(clamp((g - 0.34) / 0.66, 0, 1));
          if (f <= 0.01) return null;
          const cx = clamp(p.x, 320, 1600);
          const cy = p.y + h / 2 + 44;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: cx,
                top: cy,
                transform: `translateX(-50%) translateY(${((1 - f) * 26).toFixed(2)}px) scale(${(
                  0.95 +
                  f * 0.05
                ).toFixed(4)})`,
                opacity: f,
                filter: f < 0.92 ? `blur(${((1 - f) * 7).toFixed(2)}px)` : undefined,
                zIndex: 300,
              }}
            >
              <div
                style={{
                  maxWidth: 620,
                  padding: "20px 34px",
                  borderRadius: RADIUS,
                  background: "rgba(245,249,250,0.95)",
                  border: "1px solid rgba(18,179,174,0.34)",
                  boxShadow: "0 24px 62px rgba(3,12,15,0.56), inset 0 2px 0 rgba(255,255,255,0.6)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    fontSize: it.caption.length > 24 ? 40 : 46,
                    lineHeight: 1.08,
                    fontWeight: 900,
                    color: INK,
                    letterSpacing: -0.4,
                  }}
                >
                  {it.caption}
                </span>
                {it.sub && (
                  <span style={{ fontSize: 27, lineHeight: 1.26, fontWeight: 600, color: "rgba(14,27,34,0.66)" }}>
                    {it.sub}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* ── L7 · TIPOGRAFÍA (eyebrow + título) escalonada ─────────────────── */}
        <div style={{ position: "absolute", left: 96, top: 76, zIndex: 320 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              opacity: Math.min(1, eyeSp * 1.6),
              transform: `translateY(${((1 - eyeSp) * -18).toFixed(2)}px)`,
            }}
          >
            <div style={{ width: 46, height: 3, borderRadius: 2, background: TEAL, boxShadow: `0 0 14px ${TEAL}` }} />
            <span
              style={{
                fontSize: 25,
                fontWeight: 800,
                letterSpacing: 7,
                color: TEAL,
                textTransform: "uppercase",
                textShadow: "0 2px 12px rgba(0,0,0,0.6)",
              }}
            >
              {eyebrow}
            </span>
          </div>
          {title && (
            <div
              style={{
                marginTop: 14,
                maxWidth: 1180,
                opacity: Math.min(1, titleSp * 1.6),
                transform: `translateY(${((1 - titleSp) * 26).toFixed(2)}px)`,
                filter: titleSp < 0.9 ? `blur(${((1 - titleSp) * 8).toFixed(2)}px)` : undefined,
              }}
            >
              <span
                style={{
                  fontSize: title.length > 44 ? 56 : 68,
                  lineHeight: 1.06,
                  fontWeight: 900,
                  color: CREAM,
                  letterSpacing: -1,
                  textShadow: "0 2px 10px rgba(0,0,0,0.7), 0 16px 44px rgba(0,0,0,0.5)",
                }}
              >
                {title}
              </span>
            </div>
          )}
        </div>

        {/* ── L7 · barra de avance del recorrido del foco ───────────────────── */}
        {n > 1 && (
          <div
            style={{
              position: "absolute",
              left: 96,
              right: 96,
              bottom: 58,
              height: 4,
              borderRadius: 2,
              background: "rgba(245,249,250,0.14)",
              overflow: "hidden",
              opacity: Math.min(1, barSp * 1.6),
              zIndex: 320,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${(clamp(frame / durationInFrames, 0, 1) * 100).toFixed(2)}%`,
                borderRadius: 2,
                background: `linear-gradient(90deg, ${TEAL_DEEP} 0%, ${TEAL} 100%)`,
                boxShadow: `0 0 16px ${TEAL}`,
              }}
            />
          </div>
        )}

        {/* L8 · L9 */}
        <Motes frame={frame} />
        <Grain frame={frame} />
        <Vignette />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

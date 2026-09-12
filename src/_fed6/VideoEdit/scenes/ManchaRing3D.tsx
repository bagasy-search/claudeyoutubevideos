import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Media } from "../components/Media";
import { THEME_MEDICO } from "../kit/premium/theme";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

// ═══════════════════════════════════════════════════════════════════════════
// ManchaRing3D — LA ESCENA ESTRELLA del canal "Dr. Federer".
//
// Un ANILLO 3D de tarjetas-foto flotando en un espacio con luz propia, que GIRA
// y ATERRIZA en la tarjeta que el presentador está nombrando AHORA (`focus`).
// La que llega al frente hace RACK FOCUS (se le va el desenfoque), sube de
// escala, gana rim-light teal y DESBLOQUEA su rótulo en una tarjeta de vidrio
// CLARA con tinta oscura (público adulto mayor → contraste alto, tipos grandes).
//
// Modelo de capas (mismo criterio que kit/premium/stagecraft.tsx):
//   L1 BED    foto de cama, escalada + desenfocada + parallax lentísimo
//   L2 GRADE  scrim en degradé direccional (NUNCA un color plano borde a borde)
//   L3 SHAFTS haces de luz con volumen, cada uno con su propio respiro
//   L4 RING   el anillo 3D (perspective 1400px + preserve-3d), ritmo de spring
//   L5 SHADOW sombra de contacto por tarjeta
//   L6 FORE   rótulo de vidrio + eyebrow + pips, entrada escalonada por spring
//   L7 ATMOS  motas de polvo con parallax por profundidad
//   L8 GRAIN  grano de película determinista + viñeta de lente
//
// RENDER-SAFE: cero Date.now / Math.random. Todo sale de `frame` y de `rand(i)`.
// ═══════════════════════════════════════════════════════════════════════════

const INTER = loadInter().fontFamily;
const FONT = `${INTER}, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`;

// Paleta del canal (clínico oscuro-cinematográfico + tarjetas claras)
const DEEP = "#0E1D23";
const TEAL = "#12B3AE";
const TEAL_DEEP = "#063B40";
const CREAM = "#F5F9FA";
const INK = "#0E1B22";
const GOLD = "#E6A23C";
const RADIUS = THEME_MEDICO.radius;

/** azar determinista por índice — copiado de stagecraft.tsx (render-safe) */
const rand = (i: number, salt = 0): number =>
  (((i * 37 + salt * 101 + 13) * 9301 + 49297) % 233280) / 233280;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const smooth = (t: number) => t * t * (3 - 2 * t);
const two = (n: number) => (n < 10 ? "0" + n : "" + n);

export type RingCard = {
  index: number;
  name: string;
  sub?: string;
  image: string;
};

type Props = {
  durationInFrames: number;
  cards: RingCard[];
  focus: number;
  intro?: boolean;
  eyebrow?: string;
  bed?: string;
};

// ── L1 + L2 · CAMA DE FOTO + GRADE ──────────────────────────────────────────
const Bed: React.FC<{ bed?: string; frame: number }> = ({ bed, frame }) => {
  const px = Math.sin(frame / 250) * 26;
  const py = Math.cos(frame / 315) * 15;
  const breathe = 1.2 + Math.sin(frame / 420) * 0.02;
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
              filter: "blur(26px) saturate(0.70) brightness(0.42)",
            }}
          />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill
          style={{
            transform: `translate(${(px * 0.4).toFixed(2)}px, ${(py * 0.4).toFixed(2)}px) scale(${breathe.toFixed(4)})`,
            background: `radial-gradient(120% 90% at 66% 18%, ${TEAL_DEEP} 0%, #0A1A20 46%, #061115 100%)`,
          }}
        />
      )}
      {/* scrim direccional — el fondo respira, nunca queda un plano liso */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(14,29,35,0.88) 0%, rgba(14,29,35,0.34) 30%, rgba(6,59,64,0.34) 62%, rgba(14,29,35,0.94) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(76% 62% at 50% 44%, rgba(18,179,174,0.18) 0%, rgba(6,59,64,0.10) 40%, rgba(10,22,27,0.78) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// ── L3 · HACES DE LUZ ────────────────────────────────────────────────────────
const Shafts: React.FC<{ frame: number; count?: number }> = ({ frame, count = 5 }) => (
  <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none", mixBlendMode: "screen" }}>
    {Array.from({ length: count }, (_, i) => {
      const respiro = 0.5 + 0.5 * Math.sin(frame / (62 + i * 17) + i * 1.9);
      const w = 3 + rand(i, 2) * 8;
      const sway = Math.sin(frame / 175 + i * 0.8) * 1.4;
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${58 + (i - count / 2) * 8 + sway}%`,
            top: "-20%",
            width: `${w}%`,
            height: "180%",
            background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(18,179,174,${(0.1 + rand(i, 4) * 0.07).toFixed(
              3,
            )}) 46%, rgba(0,0,0,0) 100%)`,
            transform: `rotate(${(16 + rand(i, 5) * 6).toFixed(2)}deg)`,
            transformOrigin: "top center",
            filter: `blur(${(20 + rand(i, 3) * 24).toFixed(1)}px)`,
            opacity: 0.28 + respiro * 0.5,
          }}
        />
      );
    })}
  </AbsoluteFill>
);

// ── L7 · MOTAS DE POLVO (parallax por profundidad) ───────────────────────────
const Motes: React.FC<{ frame: number; count?: number }> = ({ frame, count = 26 }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    {Array.from({ length: count }, (_, i) => {
      const depth = rand(i, 9);
      const span = 230 + rand(i, 1) * 220;
      const p = ((frame * (0.35 + depth * 0.8) + rand(i, 2) * span) % span) / span;
      const x = rand(i) * 100 + Math.sin(frame / 64 + i * 1.7) * (1 + depth * 3.4);
      const y = 106 - p * 120;
      const r = 1.4 + depth * 5.4;
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
            background: i % 5 === 0 ? GOLD : TEAL,
            opacity: vida * (0.1 + depth * 0.34),
            filter: `blur(${(depth * 3.2).toFixed(2)}px)`,
          }}
        />
      );
    })}
  </AbsoluteFill>
);

// ── L8 · GRANO + VIÑETA ──────────────────────────────────────────────────────
const Grain: React.FC<{ frame: number; amount?: number }> = ({ frame, amount = 0.12 }) => {
  const dx = Math.round(rand(frame % 23, 1) * 60) - 30;
  const dy = Math.round(rand(frame % 29, 2) * 60) - 30;
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
      <filter id="mring-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.84" numOctaves={3} seed={11} stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.84  0 0 0 0 0.90  0 0 0 0 0.88  0 0 0 0.58 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#mring-grain)" />
    </svg>
  );
};

const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background:
        "radial-gradient(124% 94% at 50% 46%, rgba(3,10,13,0) 44%, rgba(3,10,13,0.28) 76%, rgba(3,10,13,0.58) 100%)",
    }}
  />
);

// ═══════════════════════════════════════════════════════════════════════════
export const ManchaRing3D: React.FC<Props> = ({
  durationInFrames,
  cards,
  focus,
  intro = false,
  eyebrow = "LAS SEÑALES",
  bed,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const list: RingCard[] = cards && cards.length > 0 ? cards : [{ index: 1, name: "—", image: "" }];
  const n = list.length;
  const fIdx = clamp(Math.round(focus), 0, n - 1);

  // ── geometría del anillo ──────────────────────────────────────────────────
  const step = Math.min(360 / n, 42); // arco cómodo: nunca tarjetas espalda con espalda
  const R = n <= 3 ? 620 : n <= 5 ? 720 : 800;
  const CW = 520;
  const CH = 348;

  // ── aterrizaje: viene girando desde la tarjeta anterior (o de lejos, en intro)
  const fromAngle = intro ? -(fIdx * step) + 132 : -(Math.max(0, fIdx - 1) * step);
  const toAngle = -(fIdx * step);
  const land = spring({
    frame: frame - (intro ? 5 : 2),
    fps,
    // damping alto = ASIENTA con elegancia, sin rebote de juguete
    config: { damping: intro ? 27 : 24, mass: intro ? 1.25 : 1, stiffness: intro ? 62 : 98 },
    durationInFrames: intro ? 56 : 34,
  });
  const ringRot = interpolate(land, [0, 1], [fromAngle, toAngle]) + Math.sin(frame / 215) * 1.5;
  const dolly = interpolate(land, [0, 1], [intro ? -1180 : -150, 0]);
  const ringScale = interpolate(land, [0, 1], [intro ? 0.7 : 0.94, 1]);
  const tiltX = -5.5 + Math.sin(frame / 268) * 1.1;
  const tiltZ = Math.cos(frame / 340) * 0.7;

  // push de cámara continuo sobre TODO el plano (nada queda clavado)
  const push = interpolate(frame, [0, durationInFrames], [1, 1.045], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── entrada / salida de la escena ─────────────────────────────────────────
  const inOp = interpolate(frame, [0, 9], [0, 1], { extrapolateRight: "clamp" });
  const outStart = Math.max(1, durationInFrames - 12);
  const outOp = interpolate(frame, [outStart, durationInFrames - 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const outScale = interpolate(frame, [outStart, durationInFrames - 1], [1, 1.035], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── rótulo: se DESBLOQUEA cuando el anillo ya asentó ──────────────────────
  const lockAt = intro ? 30 : 15;
  const unlock = spring({ frame: frame - lockAt, fps, config: { damping: 20, mass: 0.85, stiffness: 130 } });
  const unlockSub = spring({ frame: frame - lockAt - 7, fps, config: { damping: 22, mass: 0.85, stiffness: 120 } });
  const eyeSp = spring({ frame: frame - 3, fps, config: { damping: 22, mass: 0.9, stiffness: 110 } });
  const pipsSp = spring({ frame: frame - (lockAt + 12), fps, config: { damping: 22, mass: 0.9, stiffness: 110 } });

  const activa = list[fIdx];

  return (
    <AbsoluteFill
      style={{
        fontFamily: FONT,
        backgroundColor: DEEP,
        overflow: "hidden",
        opacity: inOp * outOp,
      }}
    >
      <AbsoluteFill style={{ transform: `scale(${(push * outScale).toFixed(4)})`, transformOrigin: "50% 48%" }}>
        {/* L1 + L2 */}
        <Bed bed={bed} frame={frame} />
        {/* L3 */}
        <Shafts frame={frame} />

        {/* ── L4 · EL ANILLO 3D ─────────────────────────────────────────── */}
        <AbsoluteFill style={{ perspective: 1400, perspectiveOrigin: "50% 44%" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              transformStyle: "preserve-3d",
              transform: `translateZ(${dolly.toFixed(1)}px) scale(${ringScale.toFixed(4)}) rotateX(${tiltX.toFixed(
                3,
              )}deg) rotateZ(${tiltZ.toFixed(3)}deg) rotateY(${ringRot.toFixed(3)}deg)`,
            }}
          >
            {list.map((c, i) => {
              // ángulo efectivo de ESTA tarjeta respecto de la cámara
              const a = i * step + ringRot;
              const eff = ((((a + 180) % 360) + 360) % 360) - 180;
              const f = smooth(clamp(1 - Math.abs(eff) / step, 0, 1)); // foco continuo = rack focus real
              const vis = interpolate(Math.abs(eff), [72, 104], [1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              if (vis <= 0.01) return null;

              const cardIn = spring({
                frame: frame - (intro ? 2 + i * 3 : 0),
                fps,
                config: { damping: 24, mass: 0.9, stiffness: 110 },
              });

              const sc = (0.8 + 0.2 * f) * (0.9 + 0.1 * cardIn);
              const blur = (1 - f) * 3;
              const sat = 0.6 + 0.4 * f;
              const bri = 0.55 + 0.45 * f;
              const bob = Math.sin(frame / (96 + rand(i, 7) * 46) + i * 1.4) * (5 + rand(i, 3) * 5);

              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "44%",
                    width: CW,
                    height: CH,
                    marginLeft: -CW / 2,
                    marginTop: -CH / 2,
                    transformStyle: "preserve-3d",
                    transform: `rotateY(${(i * step).toFixed(3)}deg) translateZ(${R}px) translateY(${bob.toFixed(
                      2,
                    )}px) scale(${sc.toFixed(4)})`,
                    opacity: vis * Math.min(1, cardIn * 1.6),
                    zIndex: Math.round(600 - Math.abs(eff)),
                  }}
                >
                  {/* L5 · sombra de contacto (se abre y se difumina con la altura) */}
                  <div
                    style={{
                      position: "absolute",
                      left: "6%",
                      right: "6%",
                      bottom: -44 - bob * 0.4,
                      height: 46,
                      borderRadius: "50%",
                      background: "radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0) 72%)",
                      filter: `blur(${(14 + (1 - f) * 8).toFixed(1)}px)`,
                      opacity: 0.42 + f * 0.34,
                    }}
                  />

                  {/* marco de vidrio claro + foto */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: RADIUS,
                      background: `linear-gradient(150deg, rgba(245,249,250,${(0.3 + f * 0.42).toFixed(
                        3,
                      )}) 0%, rgba(245,249,250,0.08) 44%, rgba(18,179,174,${(0.16 + f * 0.3).toFixed(3)}) 100%)`,
                      boxShadow: `0 ${(20 + f * 26).toFixed(0)}px ${(48 + f * 52).toFixed(
                        0,
                      )}px rgba(3,12,15,${(0.42 + f * 0.22).toFixed(3)}), inset 0 1px 0 rgba(255,255,255,${(
                        0.24 +
                        f * 0.34
                      ).toFixed(3)})`,
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 8,
                        borderRadius: RADIUS - 8,
                        overflow: "hidden",
                        background: "#08171C",
                      }}
                    >
                      {c.image ? (
                        <Media
                          src={c.image}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            filter: `blur(${blur.toFixed(2)}px) saturate(${sat.toFixed(3)}) brightness(${bri.toFixed(
                              3,
                            )})`,
                            transform: `scale(${(1.06 + (1 - f) * 0.05).toFixed(4)})`,
                          }}
                        />
                      ) : null}
                      {/* grade sobre la foto: nunca cruda */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: `linear-gradient(180deg, rgba(6,59,64,${(0.3 - f * 0.2).toFixed(
                            3,
                          )}) 0%, rgba(14,29,35,${(0.16 - f * 0.1).toFixed(3)}) 46%, rgba(14,29,35,${(
                            0.62 -
                            f * 0.24
                          ).toFixed(3)}) 100%)`,
                        }}
                      />
                      {/* rim-light teal + glow al entrar en foco */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: RADIUS - 8,
                          boxShadow: `inset 0 0 0 ${(1 + f * 2).toFixed(1)}px rgba(18,179,174,${(
                            0.28 +
                            f * 0.55
                          ).toFixed(3)}), inset 0 0 ${(18 + f * 40).toFixed(0)}px rgba(18,179,174,${(f * 0.34).toFixed(
                            3,
                          )})`,
                        }}
                      />
                      {/* número de la tarjeta */}
                      <div
                        style={{
                          position: "absolute",
                          left: 16,
                          top: 16,
                          minWidth: 54,
                          height: 54,
                          borderRadius: 14,
                          background: `rgba(6,59,64,${(0.72 + f * 0.2).toFixed(3)})`,
                          border: `1px solid rgba(18,179,174,${(0.35 + f * 0.45).toFixed(3)})`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: CREAM,
                          fontSize: 28,
                          fontWeight: 900,
                          letterSpacing: 1,
                          opacity: 0.55 + f * 0.45,
                        }}
                      >
                        {two(c.index)}
                      </div>
                    </div>
                  </div>

                  {/* halo teal externo sólo para la que está en foco */}
                  {f > 0.02 && (
                    <div
                      style={{
                        position: "absolute",
                        inset: -26,
                        borderRadius: RADIUS + 18,
                        background: `radial-gradient(60% 60% at 50% 50%, rgba(18,179,174,${(f * 0.26).toFixed(
                          3,
                        )}) 0%, rgba(18,179,174,0) 70%)`,
                        filter: "blur(14px)",
                        pointerEvents: "none",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </AbsoluteFill>

        {/* ── L6 · EYEBROW ──────────────────────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            top: 74,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 18,
            opacity: Math.min(1, eyeSp * 1.6),
            transform: `translateY(${((1 - eyeSp) * -22).toFixed(2)}px)`,
          }}
        >
          <div
            style={{ width: 62, height: 2, background: `linear-gradient(90deg, rgba(18,179,174,0) 0%, ${TEAL} 100%)` }}
          />
          <span
            style={{
              fontSize: 27,
              fontWeight: 800,
              letterSpacing: 8,
              color: TEAL,
              textTransform: "uppercase",
              textShadow: "0 2px 12px rgba(0,0,0,0.6)",
            }}
          >
            {eyebrow}
          </span>
          <div
            style={{ width: 62, height: 2, background: `linear-gradient(90deg, ${TEAL} 0%, rgba(18,179,174,0) 100%)` }}
          />
        </div>

        {/* ── L6 · RÓTULO DE VIDRIO CLARO (tinta oscura, tipografía grande) ─ */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 118,
            transform: `translateX(-50%) translateY(${((1 - unlock) * 40).toFixed(2)}px) scale(${(
              0.94 +
              unlock * 0.06
            ).toFixed(4)})`,
            opacity: Math.min(1, unlock * 1.7),
            filter: unlock < 0.9 ? `blur(${((1 - unlock) * 9).toFixed(2)}px)` : undefined,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 26,
              maxWidth: 1280,
              padding: "26px 46px",
              borderRadius: RADIUS,
              background: "rgba(245,249,250,0.95)",
              border: "1px solid rgba(18,179,174,0.34)",
              boxShadow: "0 26px 70px rgba(3,12,15,0.58), inset 0 2px 0 rgba(255,255,255,0.6)",
            }}
          >
            <div
              style={{
                minWidth: 76,
                height: 76,
                borderRadius: 20,
                background: `linear-gradient(160deg, ${TEAL} 0%, ${TEAL_DEEP} 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: CREAM,
                fontSize: 36,
                fontWeight: 900,
                boxShadow: "0 10px 26px rgba(6,59,64,0.4)",
              }}
            >
              {two(activa.index)}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span
                style={{
                  fontSize: activa.name.length > 26 ? 46 : 56,
                  lineHeight: 1.06,
                  fontWeight: 900,
                  color: INK,
                  letterSpacing: -0.5,
                }}
              >
                {activa.name}
              </span>
              {activa.sub && (
                <span
                  style={{
                    fontSize: 30,
                    lineHeight: 1.24,
                    fontWeight: 600,
                    color: "rgba(14,27,34,0.66)",
                    opacity: Math.min(1, unlockSub * 1.6),
                    transform: `translateY(${((1 - unlockSub) * 10).toFixed(2)}px)`,
                  }}
                >
                  {activa.sub}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── L6 · PIPS de avance (dónde estamos de la lista) ─────────────── */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 62,
            display: "flex",
            justifyContent: "center",
            gap: 12,
            opacity: Math.min(1, pipsSp * 1.6),
          }}
        >
          {list.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === fIdx ? 44 : 12,
                height: 8,
                borderRadius: 4,
                background: i === fIdx ? TEAL : "rgba(245,249,250,0.26)",
                boxShadow: i === fIdx ? `0 0 16px ${TEAL}` : undefined,
              }}
            />
          ))}
        </div>

        {/* L7 · L8 */}
        <Motes frame={frame} />
        <Grain frame={frame} />
        <Vignette />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

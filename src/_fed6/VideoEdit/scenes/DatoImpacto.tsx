import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const INTER = loadInter().fontFamily;

// ═══════════════════════════════════════════════════════════════════════════
// DatoImpacto — LA REVELACIÓN DE UN NÚMERO, con profundidad real.
//
// Capas (de atrás hacia adelante, cada una con su propio parallax):
//   L1 FOTO      la imagen del momento a pantalla completa, muy desenfocada
//                y oscurecida, con un Ken-Burns lentísimo (parallax MÁS LENTO
//                y en dirección contraria al primer plano)
//   L2 AIRE      grade teal-profundo + viñeta + hasta 14 motas de luz con
//                desenfoque, que le dan volumen al aire
//   L3 CIFRA     entra desde más lejos en Z (1.25 → 1.0) con blur 14 → 0 y un
//                ligero overshoot; la unidad va abajo, sobre la MISMA línea de
//                base; la cifra proyecta una sombra larga y suave hacia atrás
//   L4 ARO       arco de acento que se DIBUJA (strokeDasharray) debajo de la
//                cifra, como subrayado editorial
//   L5 TARJETA   panel de vidrio (oscuro semitransparente + backdrop blur +
//                borde de 1px claro + sombra larga) con el eyebrow en
//                versalitas y el caption debajo; sube desde abajo
//
// Orden temporal ESTRICTO: foto → cifra → aro → tarjeta. Nada simultáneo.
// Todos los tiempos son FRACCIONES de durationInFrames (cero frames absolutos).
// Determinista: sin Math.random ni Date.now — todo sale de `frame` y random().
// ═══════════════════════════════════════════════════════════════════════════

const BG = "#0E1D23";
const CREAM = "#F3ECDD";
const TEAL = "#12B3AE";
const TEAL_LIGHT = "#3FE0D6";
const AMBER = "#E8B96B";
const CORAL = "#E0523E";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const TONES: Record<
  "teal" | "warn" | "danger",
  { accent: string; light: string; deep: string }
> = {
  teal: { accent: TEAL, light: TEAL_LIGHT, deep: "#063B40" },
  warn: { accent: AMBER, light: "#F5D9A6", deep: "#3A2A12" },
  danger: { accent: CORAL, light: "#F2917E", deep: "#3B1410" },
};

const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
const EASE_SOFT = Easing.bezier(0.33, 0, 0.15, 1);

/** progreso 0→1 con easing, sobre una VENTANA expresada en fracciones del clip */
const ramp = (
  frame: number,
  total: number,
  fromFrac: number,
  toFrac: number,
  easing = EASE_OUT,
): number =>
  interpolate(frame, [total * fromFrac, total * toFrac], [0, 1], {
    ...CLAMP,
    easing,
  });

// ── L2 · motas de luz flotando (máximo 14, muy sutiles, con desenfoque) ──────
const Motes: React.FC<{ frame: number; total: number; light: string }> = ({
  frame,
  total,
  light,
}) => (
  <AbsoluteFill
    style={{
      overflow: "hidden",
      pointerEvents: "none",
      mixBlendMode: "screen",
    }}
  >
    {Array.from({ length: 14 }, (_, i) => {
      const depth = random(`mote-depth-${i}`); // 0 = lejos, 1 = cerca
      const x = 6 + random(`mote-x-${i}`) * 88;
      const y = 8 + random(`mote-y-${i}`) * 84;
      const size = 4 + depth * 13;
      // deriva lentísima, distinta por mota; las de adelante viajan más
      const speed = 0.10 + depth * 0.22;
      const driftY = -((frame * speed) % (total * 0.9)) * 0.16;
      const sway = Math.sin(frame / (150 + random(`mote-s-${i}`) * 130) + i * 1.7) * (5 + depth * 16);
      const breathe = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(frame / (78 + i * 11) + i));
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${x}%`,
            top: `${y}%`,
            width: size,
            height: size,
            borderRadius: "50%",
            transform: `translate3d(${sway}px, ${driftY}px, 0)`,
            background: `radial-gradient(circle at 38% 34%, ${light} 0%, ${light}55 42%, rgba(0,0,0,0) 72%)`,
            filter: `blur(${2.5 + (1 - depth) * 7}px)`,
            opacity: (0.10 + depth * 0.24) * breathe,
          }}
        />
      );
    })}
  </AbsoluteFill>
);

export const DatoImpacto: React.FC<{
  durationInFrames: number;
  figure?: string;
  unit?: string;
  eyebrow?: string;
  caption?: string;
  image?: string;
  tone?: "teal" | "warn" | "danger";
}> = ({
  durationInFrames,
  figure,
  unit,
  eyebrow = "SEGÚN LOS ESTUDIOS",
  caption = "El dato que cambia toda la conversación.",
  image,
  tone = "teal",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = Math.max(1, durationInFrames);
  const T = TONES[tone] || TONES.teal;

  const fig = (figure || "").trim();
  const hasFigure = fig.length > 0;
  const un = (unit || "").trim();
  const eye = (eyebrow || "").trim();
  const cap = (caption || "").trim();
  const hasCard = eye.length > 0 || cap.length > 0;

  // ── LÍNEA DE TIEMPO (fracciones del clip, nunca frames absolutos) ─────────
  // foto 0.00 · cifra 0.10 · aro 0.34 · tarjeta 0.50
  const F_FIGURE = 0.10;
  const F_ARC = 0.34;
  const F_CARD = 0.50;
  // sin cifra, la tarjeta no espera: es la única protagonista
  const cardStart = hasFigure ? F_CARD : 0.08;

  const springAt = (fromFrac: number, damping: number, stiffness: number) =>
    spring({
      frame: frame - total * fromFrac,
      fps,
      config: { damping, stiffness, mass: 1 },
    });

  // ── entrada/salida global del bloque ──────────────────────────────────────
  const inOpacity = ramp(frame, total, 0, 0.05, EASE_SOFT);
  const outOpacity = interpolate(
    frame,
    [total * 0.94, total],
    [1, 0],
    { ...CLAMP, easing: EASE_SOFT },
  );

  // ── L1 · Ken-Burns lentísimo + parallax contrario al primer plano ─────────
  // el Ken-Burns tampoco es lineal: arranca apenas más rápido y va frenando
  const kb = ramp(frame, total, 0, 1, Easing.bezier(0.28, 0.02, 0.32, 1));
  const bedScale = interpolate(kb, [0, 1], [1.14, 1.26]);
  const bedX = interpolate(kb, [0, 1], [-16, 16]);
  const bedY = interpolate(kb, [0, 1], [10, -12]);
  const bedFocus = interpolate(
    frame,
    [0, total * 0.16],
    [30, 20],
    { ...CLAMP, easing: EASE_SOFT },
  );

  // ── L3 · la CIFRA: viene de más lejos en Z, con el foco resolviendo ───────
  const sFig = springAt(F_FIGURE, 15, 110);
  const figScale = hasFigure ? interpolate(sFig, [0, 1], [1.25, 1.0]) : 1;
  const figBlur = hasFigure
    ? interpolate(ramp(frame, total, F_FIGURE, F_FIGURE + 0.16), [0, 1], [14, 0])
    : 0;
  const figOpacity = hasFigure ? ramp(frame, total, F_FIGURE, F_FIGURE + 0.09, EASE_SOFT) : 0;
  // parallax del primer plano: sube apenas, al revés que la cama
  const figDrift = interpolate(kb, [0, 1], [10, -10]);

  // la cifra tiene que entrar bien hasta 8 caracteres
  const figSize = interpolate(
    Math.min(Math.max(fig.length, 1), 9),
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [400, 400, 362, 322, 286, 252, 226, 202, 182],
    CLAMP,
  );
  const unitSize = Math.round(figSize * 0.24);

  // ── L4 · el ARO/ARCO que se dibuja ────────────────────────────────────────
  const arcDraw = hasFigure ? ramp(frame, total, F_ARC, F_ARC + 0.16, EASE_OUT) : 0;
  const arcOpacity = hasFigure ? ramp(frame, total, F_ARC, F_ARC + 0.06, EASE_SOFT) : 0;
  const arcWidth = Math.min(1180, Math.max(520, fig.length * figSize * 0.62 + 190));

  // ── L5 · la TARJETA DE VIDRIO ─────────────────────────────────────────────
  const sCard = springAt(cardStart, 17, 96);
  const cardY = interpolate(sCard, [0, 1], [64, 0]);
  const cardOpacity = ramp(frame, total, cardStart, cardStart + 0.08, EASE_SOFT);
  const cardBlurIn = interpolate(
    ramp(frame, total, cardStart, cardStart + 0.10),
    [0, 1],
    [8, 0],
  );
  const capReveal = ramp(frame, total, cardStart + 0.05, cardStart + 0.16, EASE_SOFT);

  const vignettePulse = 0.5 + 0.5 * Math.sin(frame / 190);

  return (
    <AbsoluteFill style={{ backgroundColor: BG, opacity: inOpacity * outOpacity }}>
      {/* ── L1 · FOTO del momento (o degradé si no hay imagen) ───────────── */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        {image ? (
          <Img
            src={staticFile(image)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${bedScale}) translate3d(${bedX}px, ${bedY}px, 0)`,
              filter: `blur(${bedFocus}px) saturate(0.72) brightness(0.46)`,
            }}
          />
        ) : (
          <AbsoluteFill
            style={{
              transform: `scale(${bedScale}) translate3d(${bedX}px, ${bedY}px, 0)`,
              background: `radial-gradient(120% 90% at 30% 22%, ${T.deep} 0%, #0B1A20 52%, #060F13 100%)`,
              filter: "saturate(0.9)",
            }}
          />
        )}
      </AbsoluteFill>

      {/* ── L2a · grade que hunde la cama y unifica el color ─────────────── */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(14,29,35,0.62) 0%, rgba(14,29,35,0.30) 38%, rgba(14,29,35,0.82) 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(78% 62% at 50% 40%, ${T.deep}3D 0%, rgba(0,0,0,0) 68%)`,
          mixBlendMode: "screen",
          opacity: 0.85,
        }}
      />

      {/* ── L2b · motas de luz ───────────────────────────────────────────── */}
      <Motes frame={frame} total={total} light={T.light} />

      {/* ── L3 + L4 · CIFRA y ARO ────────────────────────────────────────── */}
      {hasFigure ? (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: 110,
            paddingRight: 110,
            paddingBottom: hasCard ? 250 : 0,
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transform: `translate3d(0, ${figDrift}px, 0) scale(${figScale})`,
              opacity: figOpacity,
            }}
          >
            {/* sombra larga y suave que la cifra proyecta sobre las capas de atrás */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                display: "flex",
                alignItems: "baseline",
                justifyContent: "center",
                gap: 22,
                color: "rgba(0,0,0,0.72)",
                fontFamily: INTER,
                fontSize: figSize,
                fontWeight: 800,
                lineHeight: 0.92,
                letterSpacing: "-0.035em",
                transform: "translate3d(0, 26px, 0)",
                filter: `blur(${26 + figBlur}px)`,
                opacity: 0.9,
                pointerEvents: "none",
              }}
            >
              <span>{fig}</span>
            </div>

            {/* la cifra + la unidad, sobre la MISMA línea de base */}
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "baseline",
                justifyContent: "center",
                gap: 22,
                filter: `blur(${figBlur}px)`,
              }}
            >
              <span
                style={{
                  fontFamily: INTER,
                  fontSize: figSize,
                  fontWeight: 800,
                  lineHeight: 0.92,
                  letterSpacing: "-0.035em",
                  color: CREAM,
                  textShadow: `0 2px 0 rgba(255,255,255,0.06), 0 26px 54px rgba(0,0,0,0.62), 0 6px 16px rgba(0,0,0,0.48)`,
                  whiteSpace: "nowrap",
                }}
              >
                {fig}
              </span>
              {un ? (
                <span
                  style={{
                    fontFamily: INTER,
                    fontSize: unitSize,
                    fontWeight: 600,
                    lineHeight: 0.92,
                    letterSpacing: "-0.012em",
                    color: T.light,
                    textShadow: "0 14px 30px rgba(0,0,0,0.55)",
                    whiteSpace: "nowrap",
                    opacity: 0.94,
                  }}
                >
                  {un}
                </span>
              ) : null}
            </div>

            {/* ── L4 · arco de acento que se dibuja como subrayado editorial ── */}
            <svg
              width={arcWidth}
              height={128}
              viewBox="0 0 900 128"
              style={{
                marginTop: Math.round(figSize * 0.03),
                overflow: "visible",
                opacity: arcOpacity,
              }}
            >
              <path
                d="M 30 92 C 236 26, 664 26, 870 92"
                fill="none"
                stroke={T.accent}
                strokeWidth={5}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={0}
                opacity={0.14}
              />
              <path
                d="M 30 92 C 236 26, 664 26, 870 92"
                fill="none"
                stroke={T.light}
                strokeWidth={7}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - arcDraw}
                style={{
                  filter: `drop-shadow(0 0 18px ${T.accent}88) drop-shadow(0 12px 26px rgba(0,0,0,0.5))`,
                }}
              />
            </svg>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* ── L5 · TARJETA DE CONTEXTO (panel de vidrio) ───────────────────── */}
      {hasCard ? (
        <AbsoluteFill
          style={{
            justifyContent: hasFigure ? "flex-end" : "center",
            alignItems: "center",
            paddingLeft: 110,
            paddingRight: 110,
            paddingTop: 96,
            paddingBottom: hasFigure ? 128 : 96,
          }}
        >
          <div
            style={{
              maxWidth: 1260,
              transform: `translate3d(0, ${cardY}px, 0)`,
              opacity: cardOpacity,
              filter: `blur(${cardBlurIn}px)`,
              backgroundColor: "rgba(10,22,27,0.56)",
              backdropFilter: "blur(22px) saturate(1.1)",
              WebkitBackdropFilter: "blur(22px) saturate(1.1)",
              border: "1px solid rgba(243,236,221,0.16)",
              borderRadius: 26,
              padding: "38px 52px 42px 52px",
              boxShadow: `0 42px 90px rgba(0,0,0,0.58), 0 10px 26px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.10)`,
            }}
          >
            {eye ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: cap ? 20 : 0,
                }}
              >
                <div
                  style={{
                    width: interpolate(capReveal, [0, 1], [0, 46], CLAMP),
                    height: 3,
                    borderRadius: 2,
                    backgroundColor: T.accent,
                    boxShadow: `0 0 14px ${T.accent}99`,
                  }}
                />
                <span
                  style={{
                    fontFamily: INTER,
                    fontSize: 30,
                    fontWeight: 700,
                    letterSpacing: "0.20em",
                    textTransform: "uppercase",
                    color: T.light,
                    opacity: 0.92,
                  }}
                >
                  {eye}
                </span>
              </div>
            ) : null}

            {cap ? (
              <div
                style={{
                  fontFamily: INTER,
                  fontSize: 48,
                  fontWeight: 500,
                  lineHeight: 1.28,
                  letterSpacing: "-0.008em",
                  color: CREAM,
                  textShadow: "0 10px 26px rgba(0,0,0,0.55)",
                  opacity: interpolate(capReveal, [0, 1], [0, 1], CLAMP),
                  transform: `translate3d(0, ${interpolate(capReveal, [0, 1], [14, 0], CLAMP)}px, 0)`,
                }}
              >
                {cap}
              </div>
            ) : null}
          </div>
        </AbsoluteFill>
      ) : null}

      {/* ── viñeta que late muy despacio ─────────────────────────────────── */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: `radial-gradient(102% 82% at 50% 46%, rgba(0,0,0,0) 44%, rgba(0,0,0,${(0.42 + vignettePulse * 0.08).toFixed(3)}) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

export default DatoImpacto;

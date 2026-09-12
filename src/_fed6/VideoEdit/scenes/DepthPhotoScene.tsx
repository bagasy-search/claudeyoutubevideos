import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Media } from "../components/Media";
import { THEME_MEDICO, SPR } from "../kit/premium/theme";
import {
  autoSize,
  mblur,
  slabShadow,
  specular,
  tilt3d,
  useDrift,
  useKeyLight,
  usePush,
} from "../kit/premium/stagecraft";

// ═══════════════════════════════════════════════════════════════════════════
// DepthPhotoScene — el CABALLO DE BATALLA del look "escena de profundidad"
// del canal Dr. Federer (_fed6). Una foto no se muestra: se PONE EN UN ESPACIO.
//
// Capas (modelo stagecraft L1→L9), cada una a su propio ritmo:
//   L1 BED      la foto (o `bed`) a 1.25, desenfocada, con parallax LENTO
//               en dirección CONTRARIA al primer plano
//   L2 GRADE    scrim de color teal-profundo que hunde la cama y unifica
//   L3 SHAFTS   3 haces cálidos en diagonal que respiran
//   L4 CARD     la foto protagonista en una tarjeta flotante con inclinación
//               3D que se endereza (spring), sombra de contacto LARGA y
//               rim-light teal de un lado
//   L5 RACK     los primeros ~18 frames el foco vive en la CAMA y la tarjeta
//               llega borrosa; después la cama se hunde y la tarjeta resuelve
//   L6 TYPE     eyebrow · title · lines, escalonados por springs distintos
//   L7 ATMOS    motas de polvo con profundidad + grano de película
//   L8 LENS     viñeta que late muy despacio
// Determinista: sin Date.now / Math.random. Todo sale de `frame` y de rand(i).
// ═══════════════════════════════════════════════════════════════════════════

const T = THEME_MEDICO;
const BG = "#0E1D23";
const DEEP = "#063B40";
const TEAL = "#12B3AE";
const CREAM = "#F5F9FA";
const INK = "#0E1B22";
const GOLD = "#E6A23C";
const ALERT = "#E0523E";

/** azar determinista por índice (mismo esquema que stagecraft) */
const rand = (i: number, salt = 0): number =>
  (((i * 37 + salt * 101 + 13) * 9301 + 49297) % 233280) / 233280;

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ── L3 · haces de luz cálidos, en diagonal, que respiran ────────────────────
const LightShafts: React.FC<{ frame: number; accent: string }> = ({ frame, accent }) => (
  <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none", mixBlendMode: "screen" }}>
    {Array.from({ length: 4 }, (_, i) => {
      const breathe = 0.45 + 0.55 * Math.sin(frame / (64 + i * 17) + i * 1.9);
      const sway = Math.sin(frame / 155 + i * 0.8) * 1.6;
      const warm = i % 2 === 0 ? GOLD : accent;
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${18 + i * 21 + sway}%`,
            top: "-24%",
            width: `${5 + rand(i, 2) * 9}%`,
            height: "170%",
            transform: `rotate(${19 + rand(i, 5) * 7}deg)`,
            transformOrigin: "top center",
            background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${warm}2E 46%, rgba(0,0,0,0) 100%)`,
            filter: `blur(${26 + rand(i, 3) * 26}px)`,
            opacity: breathe * 0.85,
          }}
        />
      );
    })}
  </AbsoluteFill>
);

// ── L7 · motas de polvo con profundidad (las de adelante, gordas y rápidas) ──
const DustMotes: React.FC<{ frame: number; count?: number }> = ({ frame, count = 26 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.6 }}>
    {Array.from({ length: count }, (_, i) => {
      const depth = rand(i, 9);
      const span = 230 + rand(i, 1) * 210;
      const p = ((frame * (0.45 + depth * 1.1) + rand(i, 2) * span) % span) / span;
      const x = rand(i) * 100 + Math.sin(frame / 58 + i * 1.7) * (1 + depth * 3.4);
      const y = 106 - p * 120;
      const r = 1.4 + depth * 5.6;
      const life = Math.sin(p * Math.PI);
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
            background: i % 3 === 0 ? GOLD : CREAM,
            opacity: life * (0.14 + depth * 0.42),
            filter: `blur(${depth * 3.2}px)`,
          }}
        />
      );
    })}
  </AbsoluteFill>
);

// ── L7 · grano de película (turbulencia SVG desplazada por frame) ────────────
const FilmGrain: React.FC<{ frame: number; amount?: number }> = ({ frame, amount = 0.14 }) => {
  const dx = Math.round(rand(frame % 23, 1) * 64) - 32;
  const dy = Math.round(rand(frame % 29, 2) * 64) - 32;
  return (
    <svg
      width="118%"
      height="118%"
      style={{
        position: "absolute",
        left: -64,
        top: -64,
        opacity: amount,
        mixBlendMode: "screen",
        pointerEvents: "none",
        transform: `translate(${dx}px, ${dy}px)`,
      }}
    >
      <filter id="dpsGrain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={3} seed={11} stitchTiles="stitch" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.86  0 0 0 0 0.90  0 0 0 0 0.88  0 0 0 0.58 0"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#dpsGrain)" />
    </svg>
  );
};

export type DepthPhotoSceneProps = {
  durationInFrames: number;
  /** la foto protagonista */
  image: string;
  /** foto de CAMA al fondo (si falta, se usa `image`) */
  bed?: string;
  eyebrow?: string;
  title?: string;
  /** 0 a 3 renglones de apoyo */
  lines?: string[];
  /** 0..1 — dónde está el sujeto de la foto (para no cortar caras) */
  focus?: { x: number; y: number };
  tone?: "teal" | "warn";
};

export const DepthPhotoScene: React.FC<DepthPhotoSceneProps> = ({
  durationInFrames,
  image,
  bed,
  eyebrow = "MIRE CON ATENCIÓN",
  title = "La señal que aparece en la piel",
  lines = [],
  focus = { x: 0.5, y: 0.42 },
  tone = "teal",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const accent = tone === "warn" ? ALERT : TEAL;
  const bedSrc = bed ?? image;
  const rows = lines.slice(0, 3);

  const light = useKeyLight("center");
  const push = usePush(durationInFrames, 0.045);

  // parallax: la cama va en dirección CONTRARIA al primer plano
  const back = useDrift(0.18, 2);
  const fore = useDrift(0.75, 7);

  // ── RACK FOCUS: 0..18 el foco está atrás; después resuelve la tarjeta ──────
  const rack = interpolate(frame, [4, 22], [0, 1], CLAMP);
  const bedBlur = 5 + rack * 21; // 5 → 26 px (el fondo se hunde)
  const bedDim = 0.34 + rack * 0.3;

  // ── la tarjeta llega movida y se endereza ─────────────────────────────────
  const cardSp = spring({ frame: frame - 2, fps, config: SPR.settle, durationInFrames: 30 });
  const cardBlur = interpolate(frame, [6, 24], [13, 0], CLAMP);
  const settle = 1 - cardSp; // 1 = recién llegando, 0 = asentada

  // ── tipografía escalonada, cada bloque con su propio spring ───────────────
  const eyeSp = spring({ frame: frame - 14, fps, config: SPR.snappy, durationInFrames: 22 });
  const titleSp = spring({ frame: frame - 20, fps, config: SPR.settle, durationInFrames: 28 });
  const rowSp = rows.map((_, i) =>
    spring({ frame: frame - (28 + i * 6), fps, config: SPR.settle, durationInFrames: 24 }),
  );

  // ── SALIDA: los últimos ~12 frames ────────────────────────────────────────
  const outAt = Math.max(1, durationInFrames - 12);
  const out = interpolate(frame, [outAt, durationInFrames], [1, 0], CLAMP);
  const outScale = interpolate(frame, [outAt, durationInFrames], [1, 0.962], CLAMP);

  const vignettePulse = 0.86 + 0.14 * Math.sin(frame / 96);
  const R = T.radius + 8;

  return (
    <AbsoluteFill
      style={{
        fontFamily: T.fontBody,
        // nunca un color plano pelado: degradé profundo + halo teal
        background: `radial-gradient(120% 92% at 62% 12%, ${DEEP} 0%, ${BG} 52%, #071216 100%)`,
        overflow: "hidden",
        opacity: out,
      }}
    >
      {/* ── L1 · CAMA: la foto a 1.25, borrosa, parallax lento e INVERTIDO ── */}
      <AbsoluteFill
        style={{
          transform: `translate(${(-back.x).toFixed(2)}px, ${(-back.y).toFixed(2)}px) scale(${(1.25 * push).toFixed(4)})`,
        }}
      >
        <Media
          src={bedSrc}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: `${(focus.x * 100).toFixed(0)}% ${(focus.y * 100).toFixed(0)}%`,
            filter: `blur(${bedBlur.toFixed(1)}px) saturate(0.72) brightness(0.78)`,
          }}
        />
      </AbsoluteFill>

      {/* ── L2 · GRADE: scrim de color que hunde la cama y unifica la paleta ── */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(6,59,64,${(0.5 + rack * 0.12).toFixed(3)}) 0%, rgba(14,29,35,${bedDim.toFixed(3)}) 42%, rgba(7,18,22,0.88) 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          mixBlendMode: "screen",
          opacity: 0.5,
          background: `radial-gradient(70% 55% at ${(light.x * 100).toFixed(0)}% ${(light.y * 100).toFixed(0)}%, ${accent}26 0%, rgba(0,0,0,0) 66%)`,
        }}
      />

      {/* ── L3 · haces de luz ─────────────────────────────────────────────── */}
      <LightShafts frame={frame} accent={accent} />

      {/* ── L4/L6 · tarjeta + tipografía ─────────────────────────────────── */}
      <AbsoluteFill
        style={{
          padding: "58px 96px 62px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 34,
          transform: `scale(${outScale.toFixed(4)})`,
        }}
      >
        {/* TARJETA FLOTANTE */}
        <div
          style={{
            position: "relative",
            width: 1230,
            flex: "1 1 auto",
            maxHeight: 618,
            minHeight: 300,
            borderRadius: R,
            background: DEEP,
            opacity: Math.min(1, cardSp * 1.8),
            boxShadow: `${slabShadow(light, {
              lift: 1.7,
              edge: "rgba(3,16,20,0.9)",
              tint: "rgba(0,0,0,0.5)",
            })}, 0 0 0 1px rgba(245,249,250,0.10)`,
            transform: `${tilt3d({
              amount: 0.45 + settle * 1.9,
              seed: 3,
              frame,
              rx: settle * 6.5,
              ry: -settle * 10,
            })} translate(${(fore.x * 0.28).toFixed(2)}px, ${(fore.y * 0.28 + settle * 44).toFixed(2)}px) scale(${(0.93 + 0.07 * cardSp).toFixed(4)})`,
          }}
        >
          {/* sombra de contacto LARGA, pegada al piso de la tarjeta */}
          <div
            style={{
              position: "absolute",
              left: "6%",
              right: "6%",
              bottom: -34,
              height: 74,
              borderRadius: "50%",
              background: "radial-gradient(closest-side, rgba(0,0,0,0.62), rgba(0,0,0,0) 78%)",
              filter: "blur(18px)",
              opacity: 0.55 + 0.45 * cardSp,
            }}
          />

          <div style={{ position: "absolute", inset: 0, borderRadius: R, overflow: "hidden" }}>
            <Media
              src={image}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                // el ENCUADRE: el sujeto queda centrado, nunca cortamos caras
                objectPosition: `${(focus.x * 100).toFixed(1)}% ${(focus.y * 100).toFixed(1)}%`,
                transform: `scale(${(1.06 + settle * 0.05).toFixed(4)})`,
                filter: `${cardBlur > 0.2 ? `blur(${cardBlur.toFixed(2)}px) ` : ""}saturate(1.06) contrast(1.05)`,
              }}
            />
            {/* grade interno: los pies de la foto se funden con el plano */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(180deg, rgba(6,59,64,0.16) 0%, rgba(0,0,0,0) 34%, rgba(7,18,22,0.5) 100%)`,
              }}
            />
            {/* rim-light teal de UN lado + specular que sigue a la luz */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                mixBlendMode: "screen",
                opacity: 0.5 + 0.18 * Math.sin(frame / 74),
                background: `linear-gradient(100deg, ${accent}66 0%, ${accent}18 9%, rgba(0,0,0,0) 26%), ${specular(light, 0.34)}`,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: R,
                boxShadow: `inset 5px 0 0 ${accent}D0, inset 0 0 0 1px rgba(245,249,250,0.16), inset 0 -70px 90px -60px rgba(0,0,0,0.8)`,
              }}
            />
          </div>

          {/* halo del rim-light, POR FUERA de la tarjeta */}
          <div
            style={{
              position: "absolute",
              top: 24,
              bottom: 24,
              left: -26,
              width: 40,
              borderRadius: 40,
              background: `linear-gradient(90deg, ${accent}00, ${accent}55)`,
              filter: "blur(20px)",
              opacity: 0.5 * cardSp,
            }}
          />
        </div>

        {/* BLOQUE DE TIPOGRAFÍA — tarjeta CLARA, tinta oscura, +60 friendly */}
        <div
          style={{
            width: 1230,
            flex: "0 0 auto",
            borderRadius: T.radius,
            background: `linear-gradient(180deg, ${CREAM} 0%, #E7F0F2 100%)`,
            boxShadow: `0 26px 60px rgba(0,0,0,0.46), 0 2px 0 rgba(255,255,255,0.6) inset`,
            padding: "26px 44px 30px",
            transform: `translateY(${((1 - Math.min(1, titleSp * 1.15)) * 30).toFixed(2)}px)`,
            opacity: Math.min(1, Math.max(eyeSp, titleSp) * 1.6),
          }}
        >
          {eyebrow && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                transform: `translateY(${((1 - eyeSp) * 20).toFixed(2)}px)`,
                opacity: Math.min(1, eyeSp * 1.7),
                filter: mblur(eyeSp, 6),
              }}
            >
              <span style={{ width: 34, height: 5, borderRadius: 3, background: accent }} />
              <span
                style={{
                  fontSize: 27,
                  fontWeight: 800,
                  letterSpacing: T.labelSpacing,
                  color: tone === "warn" ? ALERT : "#0B6F6C",
                  textTransform: "uppercase",
                }}
              >
                {eyebrow}
              </span>
            </div>
          )}

          {title && (
            <div
              style={{
                marginTop: eyebrow ? 10 : 0,
                fontSize: autoSize(title, 62, 42, 42),
                lineHeight: 1.12,
                fontWeight: T.displayWeight + 100,
                color: INK,
                letterSpacing: -0.5,
                transform: `translateY(${((1 - titleSp) * 34).toFixed(2)}px)`,
                opacity: Math.min(1, titleSp * 1.6),
                filter: mblur(titleSp, 8),
              }}
            >
              {title}
            </div>
          )}

          {rows.length > 0 && (
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              {rows.map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 14,
                    transform: `translateY(${((1 - rowSp[i]) * 26).toFixed(2)}px)`,
                    opacity: Math.min(1, rowSp[i] * 1.7),
                    filter: mblur(rowSp[i], 5),
                  }}
                >
                  <span
                    style={{
                      marginTop: 14,
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      flex: "0 0 auto",
                      background: accent,
                      boxShadow: `0 0 0 4px ${accent}22`,
                    }}
                  />
                  <span style={{ fontSize: 35, lineHeight: 1.32, fontWeight: 600, color: "rgba(14,27,34,0.86)" }}>
                    {row}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </AbsoluteFill>

      {/* ── L7 · atmósfera ────────────────────────────────────────────────── */}
      <DustMotes frame={frame} />
      <FilmGrain frame={frame} />

      {/* ── L8 · viñeta de lente, latiendo muy despacio ───────────────────── */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: `radial-gradient(128% 98% at 50% 44%, rgba(0,0,0,0) 44%, rgba(0,0,0,${(0.22 * vignettePulse).toFixed(3)}) 76%, rgba(0,0,0,${(0.5 * vignettePulse).toFixed(3)}) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

export default DepthPhotoScene;

// FraseCinetica_v8v252t7cjxe.tsx — componente PROPIO del slug (aislado, NO tocar el compartido
// `scenes/FraseCinetica.tsx`). Misma API, rediseño editorial: la frase DOMINA el cuadro.
//
// Qué cambia vs el original (que parecía subtítulo automático):
//  1. Tipografía ADAPTATIVA (56→172px) calculada por cantidad de caracteres → 3 palabras van
//     enormes, 10 palabras quedan contenidas. Nunca desborda, nunca queda raquítica.
//  2. Composición editorial: bloque alineado a la izquierda en el tercio inferior, con regla de
//     acento arriba, hairline abajo y aire real alrededor. NO centrado tipo subtítulo.
//  3. Layout ESTABLE: todas las palabras ocupan su lugar desde el frame 0 (entran por máscara),
//     así la frase no se re-acomoda sola a cada palabra como hacía el original.
//  4. Scrim de 3 capas (wash + viñeta + plinto local) → legible sobre b-roll claro U oscuro.
//  5. El acento no es un highlighter: la palabra sube a blanco puro contra el resto en crema
//     apagado, con regla de acento que se DIBUJA debajo (+ remate cuadrado) y aura suave.
//  6. Entrada por palabra: máscara + slide, spring corto y seco. Sin fades. Salida a corte limpio.
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const INTER = loadInter().fontFamily;

const TEAL = "#12B3AE";
const RED = "#E4141B";
const CREAM = "#F5F9FA";
const INK = "#0E1B22";

// Caja de composición: márgenes generosos = aire.
const PAD_X = 180;
const BOX_W = 1920 - PAD_X * 2; // 1560
const BOX_H = 430;

export type FWordV8 = { t: string; hl?: boolean };

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export const FraseCineticaV8: React.FC<{
  durationInFrames: number;
  words: FWordV8[];
  perWord?: number; // frames entre palabra y palabra (si no hay `ats`)
  ats?: number[]; // frame EXACTO de cada palabra (ms del avatar) — opcional
  tone?: "teal" | "warn";
  onImage?: boolean; // si va sobre foto → agrega el tratamiento de fondo
}> = ({ durationInFrames, words, perWord = 9, ats, tone = "teal", onImage = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const accent = tone === "warn" ? RED : TEAL;

  const list = words && words.length ? words : [];
  const starts = list.map((_, i) => (ats && ats[i] != null ? (ats[i] as number) : i * perWord));

  // ── TAMAÑO ADAPTATIVO ──────────────────────────────────────────────────────
  // Modelo de área: el texto ocupa ≈ chars · (0.52·fs de ancho) · (1.05·fs de alto). Igualo esa
  // mancha al 60% de la caja de composición y despejo fs. Después lo topo por la palabra más
  // larga (que jamás puede exceder el ancho de una línea) y lo clampeo a un rango sano.
  const chars = list.reduce((a, w) => a + w.t.length, 0) + Math.max(0, list.length - 1);
  const longest = list.reduce((m, w) => Math.max(m, w.t.length), 1);
  const areaFs = Math.sqrt((BOX_W * BOX_H * 0.6) / (0.545 * Math.max(chars, 6)));
  const wordFs = BOX_W / (longest * 0.58);
  const fs = clamp(Math.min(areaFs, wordFs), 56, 172);

  const gapX = fs * 0.3;
  const maskLh = 1.3; // caja de máscara: deja lugar a tildes y descendentes (á, ¿, g, j)

  // Deriva lentísima de cámara sobre el bloque (usa la duración real del beat). No es un fade:
  // sostiene el plano cuando la frase queda sola en pantalla.
  const drift = interpolate(frame, [0, Math.max(durationInFrames, 1)], [1, 1.014], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scrim: sube en 10f para no "aparecer" de golpe. SALIDA = CORTE LIMPIO (out = 1).
  const scrim = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const out = 1;

  // Regla de acento arriba del bloque: se dibuja sola en los primeros 14 frames.
  const ruleW = interpolate(frame, [0, 14], [0, fs * 1.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hairW = interpolate(frame, [4, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ fontFamily: INTER }}>
      {/* ── CONTRASTE GARANTIZADO ────────────────────────────────────────────
          3 capas: (1) wash de tinta que se densifica hacia abajo — mata cualquier toma clara;
          (2) viñeta de esquinas que cierra el cuadro; (3) plinto elíptico local detrás del
          bloque de texto, para que la frase tenga su propio piso aunque el b-roll sea un cielo. */}
      {onImage && (
        <>
          <AbsoluteFill
            style={{
              opacity: scrim,
              background:
                "linear-gradient(180deg, rgba(14,27,34,0.30) 0%, rgba(14,27,34,0.44) 38%, rgba(14,27,34,0.80) 74%, rgba(14,27,34,0.94) 100%)",
            }}
          />
          <AbsoluteFill
            style={{
              opacity: scrim,
              background: "radial-gradient(118% 88% at 50% 46%, rgba(6,14,18,0) 34%, rgba(6,14,18,0.66) 100%)",
            }}
          />
          <AbsoluteFill
            style={{
              opacity: scrim * 0.9,
              background: "radial-gradient(78% 46% at 30% 76%, rgba(6,14,18,0.72) 0%, rgba(6,14,18,0) 72%)",
            }}
          />
        </>
      )}

      <div
        style={{
          position: "absolute",
          left: PAD_X,
          width: BOX_W,
          bottom: 168,
          opacity: out,
          transform: `scale(${drift})`,
          transformOrigin: "left bottom",
        }}
      >
        {/* Regla de acento + hairline: firma de diseño, no decoración random */}
        <div style={{ position: "relative", height: 8, marginBottom: fs * 0.34 }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: ruleW,
              height: 8,
              background: accent,
              borderRadius: 1,
              boxShadow: `0 0 26px ${accent}55`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 3.5,
              width: `${hairW * 100}%`,
              height: 1,
              background: "rgba(245,249,250,0.16)",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            columnGap: gapX,
            rowGap: fs * 0.02,
          }}
        >
          {list.map((w, i) => {
            const s = starts[i];
            // Entrada seca y rápida: la palabra SUBE desde detrás de una máscara. Sin fade.
            const p = spring({
              frame: frame - s,
              fps,
              config: { damping: 18, mass: 0.42, stiffness: 190 },
            });
            // El remate del acento arranca apenas después de que la palabra aterriza.
            const a = spring({
              frame: frame - s - 3,
              fps,
              config: { damping: 20, mass: 0.5, stiffness: 130 },
            });
            const hl = !!w.hl;

            return (
              <span key={i} style={{ position: "relative", display: "inline-block" }}>
                {/* aura del acento (no es un highlighter: es luz detrás de la palabra) */}
                {hl && (
                  <span
                    style={{
                      position: "absolute",
                      left: -fs * 0.14,
                      right: -fs * 0.14,
                      top: fs * 0.16,
                      bottom: fs * 0.02,
                      background: `radial-gradient(60% 70% at 50% 60%, ${accent}55, ${accent}00 72%)`,
                      filter: "blur(16px)",
                      opacity: a * 0.95,
                      zIndex: 0,
                    }}
                  />
                )}

                {/* la palabra, enmascarada */}
                <span
                  style={{
                    position: "relative",
                    zIndex: 1,
                    display: "block",
                    overflow: "hidden",
                    lineHeight: maskLh,
                    paddingLeft: fs * 0.1,
                    paddingRight: fs * 0.1,
                    marginLeft: -fs * 0.1,
                    marginRight: -fs * 0.1,
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      transform: `translateY(${(1 - p) * 104}%) scale(${0.985 + p * 0.015})`,
                      transformOrigin: "left bottom",
                      fontSize: fs,
                      fontWeight: hl ? 900 : 800,
                      letterSpacing: hl ? -fs * 0.026 : -fs * 0.018,
                      color: hl ? "#FFFFFF" : CREAM,
                      opacity: hl ? 1 : 0.82,
                      textShadow: `0 ${fs * 0.05}px ${fs * 0.28}px rgba(6,14,18,0.85), 0 2px 6px rgba(6,14,18,0.55)`,
                      WebkitFontSmoothing: "antialiased",
                    }}
                  >
                    {w.t}
                  </span>
                </span>

                {/* regla de acento que se DIBUJA bajo la palabra + remate cuadrado */}
                {hl && (
                  <>
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        bottom: fs * 0.055,
                        width: `calc(100% - ${fs * 0.26}px)`,
                        height: Math.max(4, fs * 0.085),
                        background: accent,
                        borderRadius: 2,
                        transform: `scaleX(${a})`,
                        transformOrigin: "left center",
                        boxShadow: `0 0 22px ${accent}66`,
                        zIndex: 2,
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        right: 0,
                        bottom: fs * 0.055,
                        width: Math.max(4, fs * 0.085),
                        height: Math.max(4, fs * 0.085),
                        background: accent,
                        borderRadius: 1,
                        opacity: a > 0.86 ? 1 : 0,
                        transform: `scale(${a > 0.86 ? 1 : 0.4})`,
                        zIndex: 2,
                      }}
                    />
                  </>
                )}
              </span>
            );
          })}
        </div>

        {/* base del bloque: hairline de tinta que apoya la composición */}
        <div
          style={{
            marginTop: fs * 0.3,
            width: `${hairW * 62}%`,
            height: 2,
            background: `linear-gradient(90deg, ${accent}AA, ${INK}00)`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

export default FraseCineticaV8;

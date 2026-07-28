// Rule_vdjso9de381j.tsx — componente PROPIO del slug (aislado, no toca el kit compartido).
//
// Por qué existe: el kind `rule` del kit despacha a `ChapterTitle`, que trae los textos
// HARDCODEADOS COMO DEFAULTS de parámetro:
//     number = "III", title = "El error que arruina todo", sub = "y cómo esquivarlo en 30 segundos"
// Los directores mandaban {text} (no {title}) y ningún number, así que los VEINTIDÓS `rule` del
// video renderizaban exactamente la misma tarjeta "III · El error que arruina todo". El creador la
// vio repetida en 21:30. Un default silencioso es peor que un campo vacío: no falla, miente.
//
// Además `rule` acá NO es un capítulo: es una FRASE-ANCLA corta (así se la pidió a los directores).
// Por eso esta variante no numera nada — pone la frase sola, grande y legible, con una regla teal
// que se dibuja como remate. Y alterna la alineación según el índice para que 22 apariciones a lo
// largo de media hora no se sientan como el mismo cartel una y otra vez.
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

const TEAL = "#12B3AE";
const CREMA = "#F4F1E8";
const F = "Inter, system-ui, sans-serif";

export const RuleVdj: React.FC<{
  durationInFrames: number;
  title?: string;
  eyebrow?: string;
  variant?: number;
}> = ({ durationInFrames, title, eyebrow, variant = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const phrase = (title || "").trim();
  if (!phrase) return null;

  const inOp = interpolate(frame, [0, 7], [0, 1], { extrapolateRight: "clamp" });
  const outOp = interpolate(frame, [durationInFrames - 7, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  const op = Math.min(inOp, outOp);
  const s = spring({ frame, fps, config: { damping: 200, mass: 0.7 } });
  const ruleW = interpolate(frame, [6, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // tamaño ADAPTATIVO — una frase de 12 palabras no entra con el cuerpo de una de 4
  const L = phrase.length;
  const size = L <= 26 ? 116 : L <= 42 ? 96 : L <= 60 ? 80 : L <= 82 ? 66 : 56;

  // 3 variantes suaves para que no se sienta el mismo cartel 22 veces
  const v = ((variant % 3) + 3) % 3;
  const align = v === 1 ? "flex-start" : v === 2 ? "flex-end" : "center";
  const textAlign = (v === 1 ? "left" : v === 2 ? "right" : "center") as "left" | "right" | "center";

  return (
    <AbsoluteFill style={{ opacity: op }}>
      <AbsoluteFill style={{ background: "linear-gradient(145deg, #0F2429 0%, #0A1719 58%, #11262A 100%)" }} />
      <AbsoluteFill style={{ background: `radial-gradient(56% 40% at 50% 46%, ${TEAL}1C 0%, transparent 74%)` }} />
      <AbsoluteFill style={{ alignItems: align, justifyContent: "center", padding: "0 170px" }}>
        <div style={{ maxWidth: 1480, transform: `translateY(${(1 - s) * 22}px)` }}>
          {/* la regla se DIBUJA: remate de diseño, no un resaltador */}
          <div
            style={{
              height: 5,
              width: 180 * ruleW,
              background: TEAL,
              borderRadius: 3,
              marginBottom: 34,
              marginLeft: textAlign === "center" ? "auto" : 0,
              marginRight: textAlign === "center" ? "auto" : textAlign === "right" ? 0 : "auto",
            }}
          />
          {eyebrow ? (
            <div style={{ fontFamily: F, fontSize: 25, letterSpacing: 6, textTransform: "uppercase", color: TEAL, marginBottom: 20, textAlign }}>
              {eyebrow}
            </div>
          ) : null}
          <div
            style={{
              fontFamily: F,
              fontWeight: 800,
              fontSize: size,
              lineHeight: 1.14,
              letterSpacing: -1.4,
              color: CREMA,
              textAlign,
              textShadow: "0 6px 30px rgba(0,0,0,0.65)",
            }}
          >
            {phrase}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

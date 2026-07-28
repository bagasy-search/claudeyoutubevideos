// Callout_vdjso9de381j.tsx — componente PROPIO del slug (aislado, no toca el kit compartido).
//
// Por qué existe: el kind `callout` del kit despacha a `CalloutMark`, que espera
// {figure, caption, image, eyebrow}. Los directores escriben {title, text} — que es lo natural
// para un aviso — así que a CalloutMark le llegaba TODO undefined y pintaba una tarjeta oscura
// COMPLETAMENTE VACÍA con un puntito teal en el medio. El creador lo cazó en el minuto 0:34, y
// pasaba en los 11 callouts del video.
//
// Esta variante es un AVISO de verdad: barra de acento, título grande y cuerpo legible, con
// tamaño adaptativo al largo del texto y contraste propio garantizado.
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

const TEAL = "#12B3AE";
const CREMA = "#F4F1E8";
const SUB = "#BFD3D2";
const F = "Inter, system-ui, sans-serif";

export const CalloutVdj: React.FC<{
  durationInFrames: number;
  title?: string;
  text?: string;
  eyebrow?: string;
}> = ({ durationInFrames, title, text, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!title && !text) return null;

  const inOp = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const outOp = interpolate(frame, [durationInFrames - 7, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  const op = Math.min(inOp, outOp);

  const card = spring({ frame, fps, config: { damping: 200, mass: 0.7 } });
  const bodyOp = interpolate(frame, [7, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const barW = interpolate(frame, [4, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // tamaño ADAPTATIVO: un título de 6 palabras no puede usar el cuerpo de uno de 2
  const tLen = (title || "").length;
  const tSize = tLen <= 18 ? 96 : tLen <= 30 ? 78 : tLen <= 46 ? 62 : 52;
  const bLen = (text || "").length;
  const bSize = bLen <= 60 ? 46 : bLen <= 110 ? 40 : 34;

  return (
    <AbsoluteFill style={{ opacity: op }}>
      <AbsoluteFill style={{ background: "linear-gradient(150deg, #10262B 0%, #0B1A1E 55%, #0F2429 100%)" }} />
      <AbsoluteFill
        style={{ background: `radial-gradient(58% 42% at 42% 42%, ${TEAL}1F 0%, transparent 72%)` }}
      />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 150px" }}>
        <div
          style={{
            width: "100%",
            maxWidth: 1420,
            display: "flex",
            gap: 44,
            alignItems: "stretch",
            transform: `translateY(${(1 - card) * 26}px)`,
          }}
        >
          {/* barra de acento que se dibuja: remate de diseño, no resaltador */}
          <div style={{ width: 10, borderRadius: 5, background: TEAL, transformOrigin: "top", transform: `scaleY(${barW})` }} />
          <div style={{ flex: 1 }}>
            {eyebrow ? (
              <div style={{ fontFamily: F, fontSize: 26, letterSpacing: 6, textTransform: "uppercase", color: TEAL, marginBottom: 22, opacity: bodyOp }}>
                {eyebrow}
              </div>
            ) : null}
            {title ? (
              <div
                style={{
                  fontFamily: F,
                  fontWeight: 800,
                  fontSize: tSize,
                  lineHeight: 1.08,
                  color: CREMA,
                  letterSpacing: -1,
                  textShadow: "0 6px 26px rgba(0,0,0,0.6)",
                }}
              >
                {title}
              </div>
            ) : null}
            {text ? (
              <div
                style={{
                  marginTop: title ? 30 : 0,
                  fontFamily: F,
                  fontWeight: 500,
                  fontSize: bSize,
                  lineHeight: 1.38,
                  color: SUB,
                  opacity: bodyOp,
                  transform: `translateY(${(1 - bodyOp) * 12}px)`,
                  maxWidth: 1180,
                }}
              >
                {text}
              </div>
            ) : null}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

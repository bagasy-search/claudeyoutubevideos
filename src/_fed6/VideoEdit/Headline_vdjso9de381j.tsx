// Headline_vdjso9de381j.tsx — componente PROPIO del slug (aislado, no toca el kit compartido).
//
// Por qué existe: el `headline` del kit (HookCaption) pinta las palabras NO resaltadas con
// `theme.color.text`, que en el tema médico es TINTA OSCURA — pensada para un panel claro. Pero el
// Panel se renderiza oscuro, así que sólo se leía la palabra con caja de acento y el resto quedaba
// azul-sobre-negro. Lo cazó la cuadrícula del auditor (frame 27383: "Una planta, DOS …" con las
// tres primeras palabras invisibles).
//
// Acá el contraste está GARANTIZADO por el propio componente (plinto oscuro + texto crema), el
// tamaño es ADAPTATIVO al largo de la frase, y las palabras reservan su lugar desde el frame 0
// para que la frase no se re-acomode mientras entra.
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

const TEAL = "#12B3AE";
const CREMA = "#F4F1E8";
const F = "Inter, system-ui, sans-serif";

type Tok = { t: string; hl?: boolean };

export const HeadlineVdj: React.FC<{ durationInFrames: number; tokens: Tok[]; eyebrow?: string }> = ({
  durationInFrames,
  tokens,
  eyebrow,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const toks = (tokens || []).filter((x) => x && x.t);
  if (!toks.length) return null;

  // ── tamaño ADAPTATIVO: una frase larga no puede usar el mismo cuerpo que dos palabras
  const chars = toks.reduce((a, x) => a + x.t.length, 0) + toks.length;
  const size = chars <= 18 ? 132 : chars <= 30 ? 112 : chars <= 45 ? 94 : chars <= 65 ? 78 : 64;

  // entrada de la placa
  const inOp = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const outOp = interpolate(frame, [durationInFrames - 7, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  const op = Math.min(inOp, outOp);

  // las palabras entran escalonadas, pero TODAS adentro al 45% de la escena
  const hold = Math.max(6, Math.floor(durationInFrames * 0.45));
  const step = toks.length > 1 ? hold / toks.length : 0;

  return (
    <AbsoluteFill style={{ opacity: op }}>
      {/* plinto: contraste propio, no confía en lo que haya detrás */}
      <AbsoluteFill style={{ background: "linear-gradient(155deg, #0F2429 0%, #0B1A1E 60%, #12262B 100%)" }} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 45% at 50% 45%, ${TEAL}1A 0%, transparent 70%)`,
        }}
      />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 130px" }}>
        {eyebrow ? (
          <div
            style={{
              fontFamily: F,
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: TEAL,
              opacity: interpolate(frame, [2, 12], [0, 0.95], { extrapolateRight: "clamp" }),
              marginBottom: 30,
            }}
          >
            {eyebrow}
          </div>
        ) : null}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "14px 22px",
            textAlign: "center",
          }}
        >
          {toks.map((w, i) => {
            const s = spring({ frame: frame - Math.round(i * step), fps, config: { damping: 200, mass: 0.6 } });
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  // reserva el lugar desde el frame 0: la frase NO se re-acomoda al entrar
                  opacity: s,
                  transform: `translateY(${(1 - s) * 26}px)`,
                  fontFamily: F,
                  fontWeight: 800,
                  fontSize: w.hl ? Math.round(size * 1.04) : size,
                  lineHeight: 1.1,
                  color: w.hl ? "#08211F" : CREMA,
                  background: w.hl ? TEAL : "none",
                  padding: w.hl ? "4px 22px 10px" : 0,
                  borderRadius: w.hl ? 14 : 0,
                  boxShadow: w.hl ? "0 16px 40px rgba(0,0,0,0.45)" : "none",
                  textShadow: w.hl ? "none" : "0 4px 18px rgba(0,0,0,0.65)",
                }}
              >
                {w.t}
              </span>
            );
          })}
        </div>
        {/* remate de diseño: una regla que se dibuja, no un resaltador */}
        <div
          style={{
            marginTop: 44,
            height: 4,
            width: `${interpolate(frame, [hold, hold + 16], [0, 220], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px`,
            background: TEAL,
            borderRadius: 2,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

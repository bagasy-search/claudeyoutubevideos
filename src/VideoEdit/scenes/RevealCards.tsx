import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { COLORS, FONT_STACK } from "../theme";
import { Media } from "../components/Media";

// RevealCards — tarjetas con imagen O CLIP REAL que entran UNA POR UNA (spring),
// cada una anclada al ms de su palabra (`at` en seg), con número y label. Fondo
// oscuro (alto contraste). Aditivo (no se tachan). Reusable: herramientas, pasos,
// listas. items: { src, label, at }[]
const COLD = "#9FC4DA";

export const RevealCards: React.FC<{
  durationInFrames: number;
  items: { src: string; label: string; at?: number }[];
  eyebrow?: string;
  title?: string;
  numbered?: boolean;
  scale?: number;
}> = ({ durationInFrames, items, eyebrow = "", title = "", numbered = true, scale = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const inO = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const outO = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleSpr = spring({ frame, fps, config: { damping: 14 }, durationInFrames: 14 });

  const n = items.length;
  const cardW = n >= 4 ? 300 : 360;
  const cardH = n >= 4 ? 360 : 430;

  return (
    <AbsoluteFill style={{ opacity: inO * outO, background: "linear-gradient(160deg, #1E1A14 0%, #2A2318 60%, #312819 100%)", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", top: 120, width: "100%", textAlign: "center", fontFamily: FONT_STACK, opacity: titleSpr }}>
        {eyebrow ? <div style={{ color: COLD, fontSize: 28, letterSpacing: 4, textTransform: "uppercase", fontWeight: 700 }}>{eyebrow}</div> : null}
        {title ? <div style={{ color: "#F4E6CF", fontSize: 54, fontWeight: 800, marginTop: 2 }}>{title}</div> : null}
      </div>

      <div style={{ display: "flex", gap: 36, alignItems: "center", marginTop: 50 * scale, transform: `scale(${scale})` }}>
        {items.map((it, i) => {
          const at = it.at != null ? it.at : i * 0.9;
          const spr = spring({ frame: frame - Math.round(at * fps), fps, config: { damping: 15, mass: 0.7, stiffness: 150 }, durationInFrames: 16 });
          const y = interpolate(spr, [0, 1], [44, 0]);
          const sc = interpolate(spr, [0, 1], [0.85, 1]);
          return (
            <div key={i} style={{
              width: cardW, height: cardH, transform: `translateY(${y}px) scale(${sc})`, opacity: spr,
              borderRadius: 26, overflow: "hidden", position: "relative",
              boxShadow: "0 26px 60px rgba(10,8,5,0.5)", border: "4px solid rgba(255,250,240,0.92)", background: COLORS.bg2,
            }}>
              <Media src={it.src} speed={0.7} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(12,9,5,0.88) 0%, rgba(12,9,5,0.1) 46%, transparent 72%)" }} />
              {numbered ? <div style={{ position: "absolute", top: 14, left: 14, width: 42, height: 42, borderRadius: "50%", background: COLORS.danger, color: "#FBF6EC", fontFamily: FONT_STACK, fontSize: 26, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div> : null}
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 24, textAlign: "center", fontFamily: FONT_STACK, fontSize: 32, fontWeight: 700, color: "#FBF6EC", textShadow: "0 2px 8px rgba(0,0,0,0.85)", padding: "0 12px" }}>{it.label}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

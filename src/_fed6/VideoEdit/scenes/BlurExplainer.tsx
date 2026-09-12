import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { COLORS, FONT_STACK } from "../theme";
import { Media } from "../components/Media";

// BlurExplainer — patrón pro favorito del usuario: un CLIP arranca nítido, se
// DESENFOCA, entra una tarjeta con IMAGEN y al lado un TEXTO que se TIPEA
// explicando. Footage real de fondo + insert + máquina de escribir.
//   clip: bg (broll/x.mp4 o img/x.png) · image: inset · eyebrow/title/body
const COLD = "#7FB4D8";

export const BlurExplainer: React.FC<{
  durationInFrames: number;
  clip: string;
  image: string;
  eyebrow?: string;
  title?: string;
  body?: string;
  side?: "left" | "right"; // dónde va la imagen
}> = ({ durationInFrames, clip, image, eyebrow = "", title = "", body = "", side = "left" }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const inO = interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  const outO = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // nítido ~0.5s, luego se desenfoca
  const blur = interpolate(frame, [14, 34], [0, 16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scrim = interpolate(frame, [14, 34], [0, 0.62], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // insert entra a ~0.7s
  const insSpr = spring({ frame: frame - 20, fps, config: { damping: 16, mass: 0.8 }, durationInFrames: 16 });
  const insX = interpolate(insSpr, [0, 1], [side === "left" ? -80 : 80, 0]);

  // tipeo del body a ~1.0s
  const typeStart = 30;
  const cpf = 1.4; // chars por frame
  const nChars = Math.max(0, Math.min(body.length, Math.floor((frame - typeStart) * cpf)));
  const typed = body.slice(0, nChars);
  const typing = nChars < body.length && frame > typeStart;
  const cursorOn = Math.floor(frame / 8) % 2 === 0;
  const titleSpr = spring({ frame: frame - 22, fps, config: { damping: 14 }, durationInFrames: 14 });

  const imgEl = (
    <div style={{ transform: `translateX(${insX}px)`, opacity: insSpr, flex: "0 0 auto" }}>
      <div style={{ width: 540, height: 600, borderRadius: 28, overflow: "hidden", position: "relative", boxShadow: "0 34px 80px rgba(10,8,5,0.6)", border: "4px solid rgba(255,250,240,0.92)" }}>
        <Img src={staticFile(image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    </div>
  );

  const txtEl = (
    <div style={{ flex: 1, padding: side === "left" ? "0 0 0 60px" : "0 60px 0 0", maxWidth: 760 }}>
      {eyebrow ? (
        <div style={{ color: COLD, fontSize: 30, letterSpacing: 4, textTransform: "uppercase", fontWeight: 800, opacity: titleSpr }}>{eyebrow}</div>
      ) : null}
      {title ? (
        <div style={{ color: "#FBF1E0", fontSize: 66, fontWeight: 900, lineHeight: 1.05, marginTop: 8, textShadow: "0 3px 18px rgba(0,0,0,0.7)", opacity: titleSpr, transform: `translateY(${interpolate(titleSpr, [0, 1], [16, 0])}px)` }}>{title}</div>
      ) : null}
      <div style={{ color: "#ECE0CC", fontSize: 38, fontWeight: 600, lineHeight: 1.35, marginTop: 22, textShadow: "0 2px 12px rgba(0,0,0,0.8)", minHeight: 120 }}>
        {typed}
        <span style={{ opacity: typing && cursorOn ? 1 : 0, color: COLD }}>▋</span>
      </div>
    </div>
  );

  return (
    <AbsoluteFill style={{ opacity: inO * outO }}>
      {/* clip de fondo que se desenfoca */}
      <AbsoluteFill>
        <Media src={clip} speed={0.85} style={{ width: "100%", height: "100%", objectFit: "cover", filter: blur > 0.3 ? `blur(${blur}px)` : undefined, transform: "scale(1.08)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(12,10,8,${scrim})` }} />

      {/* insert + texto */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", padding: "0 90px", gap: 30 }}>
        {side === "left" ? (<>{imgEl}{txtEl}</>) : (<>{txtEl}{imgEl}</>)}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

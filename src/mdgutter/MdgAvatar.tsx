// MdgAvatar — una VENTANA de avatar (OffthreadVideo, muteado; el audio sale del master).
// startFrom permite mostrar un tramo de un clip de span que cubre varias ventanas.
// ⛔ NUNCA <Video>: en el render busca por tiempo y sirve cuadros equivocados (tirón).
import { AbsoluteFill, OffthreadVideo, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export const MdgAvatar: React.FC<{
  durationInFrames: number;
  src: string;        // clip de avatar ya conformado a 1920x1080@30
  startFrom?: number; // frame de arranque dentro del clip
  placeholder?: string; // foto (plate) si el avatar aún no está
}> = ({ durationInFrames, src, startFrom = 0, placeholder }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  // push Ken-Burns muy leve (regla: avatar full nunca 100% estático)
  const z = interpolate(frame, [0, D], [1.0, 1.03], { extrapolateRight: "clamp" });
  const style: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z.toFixed(4)})` };
  if (!src && placeholder) {
    return (
      <AbsoluteFill style={{ backgroundColor: "#0A0A0C" }}>
        <Img src={staticFile(placeholder)} style={style} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0A0C" }}>
      <OffthreadVideo src={staticFile(src)} muted startFrom={startFrom} style={style} />
    </AbsoluteFill>
  );
};

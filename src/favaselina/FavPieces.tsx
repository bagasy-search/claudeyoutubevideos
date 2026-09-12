// FavPieces.tsx — piezas full-screen del video favaselina (VLOG casero).
// ⛔ SOLO OffthreadVideo (nunca <Video>) — es la causa #1 del "se ve lageado" en el render.
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";

const CREAM = "#FBF8F2";

// FavPhoto — foto full-screen con Ken-Burns subpíxel + cama borrosa detrás (evita franjas).
export const FavPhoto: React.FC<{ durationInFrames: number; img: string; i?: number }> = ({
  durationInFrames,
  img,
  i = 0,
}) => {
  const f = useCurrentFrame();
  const blur = img.replace(/\.(png|jpe?g)$/i, "_blur.jpg");
  const prog = interpolate(f, [0, durationInFrames], [0, 1], { extrapolateRight: "clamp" });
  // alterna push-in / pull-out y un leve paneo por beat -> nunca dos planos iguales
  const zoom = i % 2 === 0 ? 1.02 + 0.06 * prog : 1.08 - 0.06 * prog;
  const panX = (i % 3 === 0 ? 1 : -1) * 1.2 * prog;
  const panY = (i % 2 === 0 ? -1 : 1) * 0.8 * prog;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0A0C", overflow: "hidden" }}>
      <Img
        src={staticFile(blur)}
        style={{ position: "absolute", inset: -40, width: "calc(100% + 80px)", height: "calc(100% + 80px)", objectFit: "cover", transform: "scale(1.15)", opacity: 0.9 }}
      />
      <Img
        src={staticFile(img)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${zoom.toFixed(4)}) translate(${panX.toFixed(2)}%, ${panY.toFixed(2)}%)`,
          transformOrigin: "center center",
        }}
      />
    </AbsoluteFill>
  );
};

// FavDiagram — lámina 16:9 NÍTIDA sobre fondo crema, con un empuje muy sutil (se lee tranquila).
export const FavDiagram: React.FC<{ durationInFrames: number; img: string }> = ({
  durationInFrames,
  img,
}) => {
  const f = useCurrentFrame();
  const prog = interpolate(f, [0, durationInFrames], [0, 1], { extrapolateRight: "clamp" });
  const scale = 1.0 + 0.02 * prog;
  const appear = interpolate(f, [0, 8], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ backgroundColor: CREAM, justifyContent: "center", alignItems: "center" }}>
      <Img
        src={staticFile(img)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          transform: `scale(${scale.toFixed(4)})`,
          opacity: appear,
        }}
      />
    </AbsoluteFill>
  );
};

// FavClip — clip full-screen (i2v del presentador o stock), cover, muteado. Al terminar el
// clip OffthreadVideo sostiene el último cuadro -> NO deja ver el fondo entre el fin del clip
// y el próximo beat.
export const FavClip: React.FC<{ durationInFrames: number; src: string }> = ({ src }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0A0C", overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile(src)}
        muted
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AbsoluteFill>
  );
};

// FavQr — overlay del CTA (esquina): QR a la guía + dominio. Va en la capa `over`, NUNCA
// hardcodeado dentro de un componente de escena (regla 4.bis del pipeline).
export const FavQr: React.FC<{ durationInFrames: number; qr: string; domain: string }> = ({
  durationInFrames,
  qr,
  domain,
}) => {
  const f = useCurrentFrame();
  const inP = interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const outP = interpolate(f, [durationInFrames - 12, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  const op = Math.min(inP, outP);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          right: 64,
          bottom: 64,
          opacity: op,
          transform: `translateY(${(1 - inP) * 24}px)`,
          background: "#FBF8F2",
          borderRadius: 20,
          padding: 18,
          boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          border: "3px solid #0F4A42",
        }}
      >
        <Img src={staticFile(qr)} style={{ width: 200, height: 200, borderRadius: 8 }} />
        <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 24, color: "#0F4A42", letterSpacing: 0.3 }}>
          {domain}
        </div>
        <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 16, color: "#E8724C" }}>
          Escaneá para la guía
        </div>
      </div>
    </AbsoluteFill>
  );
};

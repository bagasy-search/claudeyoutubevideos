import { OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

// Capa de CLIPS de fedrodillas.
// ⛔ OffthreadVideo, NUNCA <Video> de remotion: en el render <Video> busca por TIEMPO y
//    devuelve el cuadro más cercano que tenga listo → repite y saltea de forma IRREGULAR,
//    que es lo que se lee como "todo el video lageado".
// ★ El clip conserva su AUDIO NATIVO a volumen bajo (el ambiente de agnes suena muy bien),
//    por debajo de la voz del máster. OffthreadVideo 4.0.472 acepta `volume`.
// ★ El movimiento va por CSS (subpíxel), nunca horneado con ffmpeg (cuantiza a píxel entero).
export const ClipShotFr: React.FC<{
  durationInFrames: number;
  src: string;
  volume?: number;
}> = ({ durationInFrames, src, volume = 0.14 }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const z = interpolate(f, [0, durationInFrames], [1.0, 1.035], { extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", backgroundColor: "#0E1D23" }}>
      <OffthreadVideo
        src={staticFile(src)}
        volume={volume}
        style={{
          width, height, objectFit: "cover",
          transform: `scale(${z})`, transformOrigin: "50% 45%",
        }}
      />
    </div>
  );
};

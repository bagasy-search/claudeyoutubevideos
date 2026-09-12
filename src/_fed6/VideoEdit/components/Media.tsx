import { CSSProperties } from "react";
import { Img, Loop, OffthreadVideo, staticFile, useVideoConfig } from "remotion";

// <Media> — drop-in para cualquier "foto real" de b-roll. Decide solo entre
// <Img> (png/jpg) y <OffthreadVideo> (mp4). Los clips van muted (b-roll sin audio)
// y en cámara lenta por default (speed=0.6).
//
// ★ ANTI-CONGELADO (fix del bug "frame clavado" del video ventilador): si se pasan
// `clipDur` (duración REAL del archivo, en s — la mide beatsheet.mjs con ffprobe) y
// `beatDur` (lo que el beat ocupa en el timeline, en s), el playbackRate se adapta
// para que el clip CUBRA el beat entero:
//   · rate = clipDur / beatDur, clampeado a [0.45, 1.0] (más lento se ve mal)
//   · si ni a 0.45 alcanza (beat larguísimo), se LOOPEA el clip (corte de loop >
//     pantalla congelada, siempre)
// Sin esas props se comporta exactamente como antes (speed fijo).
const VIDEO_RE = /\.(mp4|webm|mov)$/i;

export const isVideoSrc = (src?: string) => !!src && VIDEO_RE.test(src);

export const Media: React.FC<{
  src: string;
  style?: CSSProperties;
  muted?: boolean;
  speed?: number; // playbackRate del clip; <1 = cámara lenta (default 0.6)
  clipDur?: number; // duración real del archivo (s) — habilita el anti-congelado
  beatDur?: number; // duración del beat en timeline (s)
}> = ({ src, style, muted = true, speed = 0.6, clipDur, beatDur }) => {
  const { fps } = useVideoConfig();
  if (VIDEO_RE.test(src)) {
    let rate = speed;
    let needLoop = false;
    if (clipDur && beatDur && clipDur > 0.5) {
      // cobertura del timeline reproduciendo clipDur a rate r = clipDur / r
      rate = Math.min(1.0, Math.max(0.45, clipDur / beatDur));
      // preferí la velocidad "linda" (0.6) cuando igual alcanza para cubrir el beat
      if (clipDur / 0.6 >= beatDur) rate = Math.min(Math.max(speed, 0.45), 1.0);
      needLoop = clipDur / rate < beatDur - 0.05;
    }
    const video = <OffthreadVideo src={staticFile(src)} style={style} muted={muted} playbackRate={rate} />;
    if (needLoop && clipDur) {
      const iterFrames = Math.max(1, Math.floor((clipDur / rate) * fps));
      return <Loop durationInFrames={iterFrames} layout="none">{video}</Loop>;
    }
    return video;
  }
  return <Img src={staticFile(src)} style={style} />;
};

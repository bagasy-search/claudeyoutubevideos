// Minuto 1 de suencargado (0-65 s). Tiempos = segundos absolutos de la voz final (timeline sin pausas).
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import AVC from "./avclips.json";

const FPS = 30;
export const MIN1_SECS = 65;

// Ventanas de Claudio: avwin.json tiene s (inicio en la voz), e (fin) y off (inicio dentro del reel).
const AV_WINDOWS = AVC as { s: number; e: number; src: string }[];
const WIN_MIN = AV_WINDOWS.filter((w) => w.s < MIN1_SECS);

// Capa de imagen fija con empuje lento (cámara viva).
const Still: React.FC<{ src: string; dur: number; from: number; from2?: number; to?: number }> = ({ src, dur, from, from2 = 1, to = 1.06 }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const k = interpolate(t, [0, dur], [from2, to], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ transform: `scale(${k})`, transformOrigin: "50% 50%", background: "#000" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
  );
};

// Clip real (stock/archivo), sin audio: su sonido no entra, sólo la voz.
const Clip: React.FC<{ src: string }> = ({ src }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </AbsoluteFill>
);

// Etiqueta de sello de la marca. Texto fijo, no es marca comercial.
const Seal: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: "absolute", left: 60, bottom: 60, padding: "14px 22px", background: "#c8102e", color: "#fff", fontFamily: "sans-serif", fontWeight: 800, fontSize: 40, letterSpacing: 1 }}>{text}</div>
);

export const Min1: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* Miniatura 0-3,84 s (sin texto: la miniatura real lleva el titular en la card) */}
      <Sequence from={0} durationInFrames={Math.round(3.84 * fps)}>
        <Still src="img/suencargado/thumb.jpg" dur={3.84} from2={1} to={1.04} />
      </Sequence>

      {/* Claudio: ventanas AV del reel. Cada una arranca en su off dentro del reel. */}
      {WIN_MIN.map((w, i) => {
        const dur = w.e - w.s;
        return (
          <Sequence key={"av" + i} from={Math.round(w.s * fps)} durationInFrames={Math.round(dur * fps)}>
            <AbsoluteFill>
              <OffthreadVideo src={staticFile(w.src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </AbsoluteFill>
          </Sequence>
        );
      })}

      {/* Real: montacargas (WOW1), depósito (WOW2), góndola vacía (WOW3) */}
      <Sequence from={Math.round(10.73 * fps)} durationInFrames={Math.round(6.27 * fps)}><Clip src="broll/suencargado/WOW1_forklift_1080.mp4" /></Sequence>
      <Sequence from={Math.round(17.0 * fps)} durationInFrames={Math.round(6.0 * fps)}><Clip src="broll/suencargado/WOW2_distcenter_1080.mp4" /></Sequence>
      <Sequence from={Math.round(23.0 * fps)} durationInFrames={Math.round(7.0 * fps)}><Clip src="broll/suencargado/WOW3_emptyshelf_1080.mp4" /></Sequence>

      {/* Llavero (N01, sin cara) entre 30 y 34,8 s */}
      <Sequence from={Math.round(30.0 * fps)} durationInFrames={Math.round(4.82 * fps)}>
        <Still src="img/suencargado/N01_llavero.png" dur={4.82} from2={1.0} to={1.05} />
        <Seal text="LLAVERO DEL ENCARGADO" />
      </Sequence>

      {/* Real: muelle (WOW4) 48,5-54 y transportadora (WOW6) 54-60 */}
      <Sequence from={Math.round(48.46 * fps)} durationInFrames={Math.round(5.54 * fps)}><Clip src="broll/suencargado/WOW4_loadingdock_1080.mp4" /></Sequence>
      <Sequence from={Math.round(54.0 * fps)} durationInFrames={Math.round(6.0 * fps)}><Clip src="broll/suencargado/WOW6_conveyor_1080.mp4" /></Sequence>

      {/* 60-65 s: planilla (N02) */}
      <Sequence from={Math.round(60.0 * fps)} durationInFrames={Math.round(5.0 * fps)}>
        <Still src="img/suencargado/N02_planilla.png" dur={5.0} from2={1.0} to={1.05} />
      </Sequence>

      {/* Voz final: una sola pista para todo el minuto */}
      <Audio src={staticFile("suencargadocut.wav")} />
    </AbsoluteFill>
  );
};

// suprecio · Pasada2: capa de fotos de Claudio ENCIMA del MP4 entregado (base = release suprecio.mp4, 28773 cuadros, tv/bt709).
// Tiempos en el tiempo del MP4 entregado (segundos absolutos). Fotos de pasada2_fotos.json.
// 1 de cada 4 fotos va como "foto de celular": marco blanco, 75 % del ancho, rotación ±2°, fondo desenfocado y oscurecido.
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import fotos from "./pasada2_fotos.json";

const FPS = 30;
const fr = (t: number) => Math.round(t * FPS);
// base = copia del MP4 entregado en su propio release (no se empaqueta en el tar; encfin reemplaza el asset suprecio.mp4)
const BASE_URL = "https://github.com/bagasy-search/claudeyoutubevideos/releases/download/suprecio-base/suprecio.mp4";

type Foto = { name: string; t0: number; t1: number; phone: boolean };

const Plana: React.FC<{ src: string; dur: number }> = ({ src, dur }) => {
  const f = useCurrentFrame();
  const scale = interpolate(f, [0, Math.max(1, dur)], [1, 1.07], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})` }} />
    </AbsoluteFill>
  );
};

const Celular: React.FC<{ src: string; dur: number; giro: number }> = ({ src, dur, giro }) => {
  const f = useCurrentFrame();
  const scale = interpolate(f, [0, Math.max(1, dur)], [1, 1.03], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <Img src={src} style={{ position: "absolute", inset: -40, width: "calc(100% + 80px)", height: "calc(100% + 80px)", objectFit: "cover", filter: "blur(24px) brightness(0.7)" }} />
      <AbsoluteFill style={{ backgroundColor: "rgba(0,0,0,0.3)" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            width: "75%",
            background: "#fff",
            padding: 14,
            boxSizing: "border-box",
            boxShadow: "0 18px 40px rgba(0,0,0,0.55)",
            transform: `rotate(${giro}deg) scale(${scale})`,
          }}
        >
          <Img src={src} style={{ width: "100%", display: "block" }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Pasada2: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    {/* base: el MP4 entregado, mudo (el audio viene de pasada2_mix.wav, igual que la entrega) */}
    <OffthreadVideo src={BASE_URL} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    {(fotos as Foto[]).map((ft, i) => {
      const from = fr(ft.t0);
      const dur = fr(ft.t1) - from;
      const src = staticFile(`pasada2/fotos/${ft.name}.png`);
      return (
        <Sequence key={ft.name} from={from} durationInFrames={dur}>
          {ft.phone ? <Celular src={src} dur={dur} giro={i % 2 === 0 ? 2 : -2} /> : <Plana src={src} dur={dur} />}
        </Sequence>
      );
    })}
    <Audio src={staticFile("pasada2/pasada2_mix.wav")} />
  </AbsoluteFill>
);

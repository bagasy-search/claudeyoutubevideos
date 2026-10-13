// mecnafta · composition Full: lee edl.json (planos fijados) y arma AV (reel de RunPod), L/N (fotos), ST/AR (metraje), C (héroes).
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Grade, Grain } from "./Base";
import { HEROES } from "./Scenes";
import EDL from "./edl.json";

const fr = (s: number) => Math.round(s * 30);
const cover: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };
type Sh = { s: number; e: number; k: string; src?: string; name?: string; ms?: number; off?: number };
const SH = (EDL as any).shots as Sh[];

// Minuto 1: recorte de la miniatura (th_card.jpg, 1280x720) SIN el texto. Ventana x 650..1280, y 0..354
// (16:9): deja fuera "LA MITAD DE GASOLINA" (termina en x~640) y "TRUCO DE MECÁNICO" (y>=660).
const CROP_K = 1920 / 630;
const cropStyle: React.CSSProperties = { position: "absolute", left: -650 * CROP_K, top: 0, width: 1280 * CROP_K, height: 720 * CROP_K };

const Still: React.FC<{ src: string; d: number; crop?: boolean }> = ({ src, d, crop }) => {
  const f = useCurrentFrame();
  const sc = 1.03 + 0.07 * f / Math.max(1, d);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${sc})` }}>
        {crop ? <Img src={staticFile("img/mecnafta/th_card.jpg")} style={cropStyle} />
          : <Img src={staticFile(`img/mecnafta/${src}.png`)} style={cover} />}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Fundido de entrada del AV (15 cuadros = 0,5 s) sobre la foto que queda debajo.
const FadeIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: Math.min(1, f / 15) }}>{children}</AbsoluteFill>;
};

export const FullM: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    {SH.map((s, i) => {
      const from = fr(s.s);
      // La foto del minuto 1 sigue 15 cuadros bajo el AV para que el fundido tenga con qué mezclarse.
      const d = fr(s.e) - fr(s.s) + (s.k === "L" && s.s === 0 ? 15 : 0);
      let body: React.ReactNode;
      if (s.k === "AV") {
        const av = <OffthreadVideo src={staticFile("av/mecnafta_reel0.mp4")} startFrom={fr((s.off || 0) + (s.s - (s.ms || 0)))} muted style={cover} />;
        body = s.s === 4 ? <FadeIn>{av}</FadeIn> : av;
      } else if (s.k === "L" || s.k === "N") {
        body = <Still src={s.src!} d={d} crop={s.s === 0} />;
      } else if (s.k === "ST" || s.k === "AR") {
        body = <OffthreadVideo src={staticFile(`broll/mecnafta/${s.src}.mp4`)} volume={0.12} style={cover} />;
      } else if (s.k === "C") {
        const H = HEROES[s.name!];
        body = H ? H.el() : null;
      }
      return <Sequence key={i} from={from} durationInFrames={d}><AbsoluteFill>{body}</AbsoluteFill></Sequence>;
    })}
    <Audio src={staticFile("mecnaftacut.wav")} />
    <Grade warm={1} vig={0.25} />
    <Grain />
  </AbsoluteFill>
);
export const TOTAL_FRAMES = fr(943.53);

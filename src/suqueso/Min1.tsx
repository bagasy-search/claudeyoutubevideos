// suqueso · minuto 1 (0-60 s) — R4b.
// Avatar: tramos de <=8 s (reel RunPod). Cada tramo sigue a avwin.json: reel = off + (t - ms) de la ventana vigente.
// Cortes de 3 s: WOW real (queso, envasado, cinta) o foto L de lo que se dice en ese segundo.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import avwin from "./avwin.json";

const FPS = 30;
const fr = (s: number) => Math.round(s * FPS);

// posición en el reel para un instante del video (ventana vigente)
const avOff = (t: number): number => {
  let best: any = null;
  for (const w of (avwin as any).win) if (w.ms <= t + 0.001 && (!best || w.ms > best.ms)) best = w;
  return best ? best.off + (t - best.ms) : 0;
};

// empuje lento sobre un plano (escala 1.00 -> 1.06)
const Push: React.FC<{ dur: number; src: string; vid?: boolean }> = ({ dur, src, vid }) => {
  const f = useCurrentFrame();
  const t = Math.max(0, Math.min(1, f / Math.max(1, fr(dur))));
  const s = 1 + 0.06 * t;
  const inner = vid
    ? <OffthreadVideo src={src} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    : <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={{ width: "100%", height: "100%", transform: `scale(${s})`, transformOrigin: "50% 50%" }}>{inner}</div>
    </AbsoluteFill>
  );
};

const Clip: React.FC<{ from: number; dur: number; name: string }> = ({ from, dur, name }) => (
  <Sequence from={fr(from)} durationInFrames={fr(dur)}>
    <Push dur={dur} src={staticFile(`broll/suqueso/${name}.mp4`)} vid />
  </Sequence>
);
const Still: React.FC<{ from: number; dur: number; name: string }> = ({ from, dur, name }) => (
  <Sequence from={fr(from)} durationInFrames={fr(dur)}>
    <Push dur={dur} src={staticFile(`img/suqueso/${name}.png`)} />
  </Sequence>
);
// tramo de avatar: a..b (<= 8 s)
const AV: React.FC<{ a: number; b: number }> = ({ a, b }) => (
  <Sequence from={fr(a)} durationInFrames={fr(b - a)}>
    <AbsoluteFill>
      <OffthreadVideo src={staticFile("avatar_clips/suqueso/reel30_nb.mp4")} startFrom={fr(avOff(a))} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
  </Sequence>
);

const Grade: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.32) 100%)", mixBlendMode: "multiply", pointerEvents: "none" }} />
);

export const Min1: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    {/* 0-0.6 miniatura exacta de la tarjeta (con su texto) */}
    <Sequence from={0} durationInFrames={fr(0.6)}>
      <Img src={staticFile("img/suqueso/thumb.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </Sequence>
    {/* cortes de queso real (sin Claudio) */}
    <Clip from={0.6} dur={6.0} name="nb_queso6658" />
    <Clip from={6.6} dur={4.4} name="nb_cheese_counter" />
    {/* avatar en tramos de <= 8 s */}
    <AV a={11.0} b={19.0} />
    <Still from={19.0} dur={3.0} name="l_etiqueta" />
    <AV a={22.0} b={30.0} />
    <Clip from={30.0} dur={3.0} name="nb_wow_conveyor" />
    <AV a={33.0} b={40.0} />
    <Clip from={40.0} dur={3.0} name="nb_produce3" />
    <AV a={43.0} b={51.0} />
    <Clip from={51.0} dur={3.0} name="nb_fiambreria3074" />
    <AV a={54.0} b={60.0} />
    <Grade />
  </AbsoluteFill>
);

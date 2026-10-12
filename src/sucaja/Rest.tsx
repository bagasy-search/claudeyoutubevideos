// sucaja · 65-400 s (Rest). Generado desde _v3 plan2.json. Clips ST ya cortados; AV = Sequence vacía (avatar fuera).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Scanner } from "../repkit/Kit";
import { AvatarWins } from "./Avatar";
import { Grade, Grain } from "../repkit/Rk";
const FPS = 30;
const fr = (s: number) => Math.round(s * FPS);
const CLIP = (name: string) => staticFile(`broll/sucaja/${name}`);
const IMG = (name: string) => staticFile(name.startsWith("../") ? name.slice(3) : `img/sucaja/${name}`);
export const Push: React.FC<{ dur: number; src: string; vid?: boolean }> = ({ dur, src, vid }) => {
  const f = useCurrentFrame();
  const t = Math.max(0, Math.min(1, f / Math.max(1, fr(dur))));
  const s = 1 + 0.08 * t;
  const inner = vid
    ? <OffthreadVideo src={src} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    : <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return <AbsoluteFill style={{ overflow: "hidden" }}><div style={{ width: "100%", height: "100%", transform: `scale(${s})`, transformOrigin: "50% 50%" }}>{inner}</div></AbsoluteFill>;
};
const Clip: React.FC<{ from: number; dur: number; file: string }> = ({ from, dur, file }) => (
  <Sequence from={fr(from)} durationInFrames={fr(dur)}><Push dur={dur} src={CLIP(file)} vid /></Sequence>
);
const Still: React.FC<{ from: number; dur: number; file: string }> = ({ from, dur, file }) => (
  <Sequence from={fr(from)} durationInFrames={fr(dur)}><Push dur={dur} src={IMG(file)} /></Sequence>
);
export const Rest: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Sequence from={fr(76.42)} durationInFrames={fr(6.59)}><AbsoluteFill /></Sequence>  {/* AV: avatar, fuera */}
    <Still from={83.01} dur={7.88} file="../img/repkit/checkout.png" />
    <Still from={90.89} dur={6.96} file="../img/repkit/checkout.png" />
    <Still from={97.85} dur={6.64} file="../img/repkit/checkout.png" />
    <Clip from={104.49} dur={7.10} file="st015.mp4" />
    <Sequence from={fr(111.59)} durationInFrames={fr(6.48)}><AbsoluteFill /></Sequence>  {/* AV: avatar, fuera */}
    <Still from={118.07} dur={11.28} file="L017.png" />
    <Sequence from={fr(129.35)} durationInFrames={fr(7.16)}><AbsoluteFill /></Sequence>  {/* AV: avatar, fuera */}
    <Clip from={136.51} dur={7.14} file="st019.mp4" />
    <Still from={143.65} dur={7.50} file="N020.png" />
    <Clip from={151.15} dur={6.06} file="st021.mp4" />
    <Sequence from={fr(157.21)} durationInFrames={fr(7.55)}><AbsoluteFill /></Sequence>  {/* AV: avatar, fuera */}
    <Still from={164.76} dur={5.74} file="L023.png" />
    <Clip from={170.50} dur={14.19} file="st024.mp4" />
    <Clip from={184.69} dur={8.48} file="st025.mp4" />
    <Sequence from={fr(193.17)} durationInFrames={fr(7.80)}><AbsoluteFill /></Sequence>  {/* AV: avatar, fuera */}
    <Clip from={200.97} dur={6.44} file="st027.mp4" />
    <Sequence from={fr(207.41)} durationInFrames={fr(7.86)}><AbsoluteFill /></Sequence>  {/* AV: avatar, fuera */}
    <Still from={215.27} dur={7.44} file="L029.png" />
    <Sequence from={fr(222.71)} durationInFrames={fr(7.42)}><AbsoluteFill /></Sequence>  {/* AV: avatar, fuera */}
    <Clip from={230.13} dur={7.40} file="st031.mp4" />
    <Scanner from={237.53} dur={6.56} img="img/repkit/scanner_pack.png" price={3400} tBeep={240.15} display={{ price: 3290, t: 241.47 }} />
    <Clip from={244.09} dur={6.18} file="st033.mp4" />
    <Sequence from={fr(250.27)} durationInFrames={fr(7.90)}><AbsoluteFill /></Sequence>  {/* AV: avatar, fuera */}
    <Still from={258.17} dur={7.74} file="L035.png" />
    <Clip from={265.91} dur={7.16} file="st036.mp4" />
    <Clip from={273.07} dur={8.34} file="st037.mp4" />
    <Still from={281.41} dur={8.96} file="../img/repkit/gondola_full.png" />
    <Still from={290.37} dur={8.08} file="../img/repkit/checkout.png" />
    <Still from={298.45} dur={6.31} file="../img/repkit/checkout.png" />
    <Still from={304.76} dur={6.82} file="L041.png" />
    <Sequence from={fr(311.58)} durationInFrames={fr(8.90)}><AbsoluteFill /></Sequence>  {/* AV: avatar, fuera */}
    <Clip from={320.48} dur={7.85} file="st043.mp4" />
    <Sequence from={fr(328.33)} durationInFrames={fr(8.82)}><AbsoluteFill /></Sequence>  {/* AV: avatar, fuera */}
    <Clip from={337.15} dur={7.41} file="st045.mp4" />
    <Still from={344.56} dur={8.58} file="N046.png" />
    <Still from={353.14} dur={10.57} file="L047.png" />
    <Clip from={363.71} dur={5.74} file="st048.mp4" />
    <Clip from={369.45} dur={9.30} file="st049.mp4" />
    <Sequence from={fr(378.75)} durationInFrames={fr(8.69)}><AbsoluteFill /></Sequence>  {/* AV: avatar, fuera */}
    <Clip from={387.44} dur={6.64} file="st051.mp4" />
    <Still from={394.08} dur={6.51} file="N052.png" />
    <AvatarWins from={65} to={400} />
    <Grade />
    <Grain />
  </AbsoluteFill>
);

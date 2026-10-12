// sucaja · 60-988.8 s (Full), generado desde plan2.json. Clips ST cortados; AR/L/N con footage real (pool) salvo UN checkout.png de 5 s; AV = AvatarWins del reel.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Scanner } from "../repkit/Kit";
import { Grade, Grain } from "../repkit/Rk";
import { AvatarWins } from "./Avatar";
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
export const Full: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Still from={83.01} dur={5.00} file="../img/repkit/checkout.png" />
    <Clip from={88.01} dur={2.88} file="pool/ar_a.mp4" />
    <Clip from={90.89} dur={6.96} file="pool/ar_a.mp4" />
    <Clip from={97.85} dur={6.64} file="pool/ar_a.mp4" />
    <Clip from={104.49} dur={7.1} file="st015.mp4" />
    <Still from={118.07} dur={11.28} file="L017.png" />
    <Clip from={136.51} dur={7.14} file="st019.mp4" />
    <Still from={143.65} dur={7.5} file="N020.png" />
    <Clip from={151.15} dur={6.06} file="st021.mp4" />
    <Still from={164.76} dur={5.74} file="L023.png" />
    <Clip from={170.50} dur={14.19} file="st024.mp4" />
    <Clip from={184.69} dur={8.48} file="st025.mp4" />
    <Clip from={200.97} dur={6.44} file="st027.mp4" />
    <Still from={215.27} dur={7.44} file="L029.png" />
    <Clip from={230.13} dur={7.4} file="st031.mp4" />
    <Scanner from={237.53} dur={6.56} img="img/repkit/scanner_pack.png" price={3400} tBeep={240.15} display={{ price: 3290, t: 241.47 }} />
    <Clip from={244.09} dur={6.18} file="st033.mp4" />
    <Still from={258.17} dur={7.74} file="L035.png" />
    <Clip from={265.91} dur={7.16} file="st036.mp4" />
    <Clip from={273.07} dur={8.34} file="st037.mp4" />
    <Still from={281.41} dur={8.96} file="../img/repkit/gondola_full.png" />
    <Clip from={290.37} dur={8.08} file="pool/l039.mp4" />
    <Clip from={298.45} dur={6.31} file="pool/l040.mp4" />
    <Still from={304.76} dur={6.82} file="L041.png" />
    <Clip from={320.48} dur={7.85} file="st043.mp4" />
    <Clip from={337.15} dur={7.41} file="st045.mp4" />
    <Clip from={344.56} dur={8.58} file="pool/n046.mp4" />
    <Still from={353.14} dur={10.57} file="L047.png" />
    <Clip from={363.71} dur={5.74} file="st048.mp4" />
    <Clip from={369.45} dur={9.3} file="st049.mp4" />
    <Clip from={387.44} dur={6.64} file="st051.mp4" />
    <Still from={394.08} dur={6.51} file="N052.png" />
    <Still from={400.59} dur={6.45} file="L053.png" />
    <Clip from={414.88} dur={7.82} file="st055.mp4" />
    <Still from={422.70} dur={8.4} file="N056.png" />
    <Clip from={431.10} dur={7.72} file="st057.mp4" />
    <Clip from={447.63} dur={6.23} file="st059.mp4" />
    <Clip from={453.86} dur={10.68} file="st060.mp4" />
    <Clip from={464.54} dur={4.58} file="st061.mp4" />
    <Still from={469.12} dur={7.72} file="N062.png" />
    <Clip from={476.84} dur={7.17} file="st063.mp4" />
    <Scanner from={484.01} dur={6.82} img="img/repkit/scanner_pack.png" price={3400} tBeep={486.74} display={{ price: 3290, t: 488.10 }} />
    <Still from={490.83} dur={9.34} file="L065.png" />
    <Scanner from={500.17} dur={9.3} img="img/repkit/scanner_pack.png" price={3400} tBeep={503.89} display={{ price: 3290, t: 505.75 }} />
    <Clip from={509.47} dur={4.92} file="st067.mp4" />
    <Scanner from={514.39} dur={10.86} img="img/repkit/scanner_pack.png" price={3400} tBeep={518.73} display={{ price: 3290, t: 520.91 }} />
    <Clip from={525.25} dur={9.1} file="st069.mp4" />
    <Scanner from={534.35} dur={8.89} img="img/repkit/scanner_pack.png" price={3400} tBeep={537.91} display={{ price: 3290, t: 539.68 }} />
    <Clip from={552.51} dur={10.87} file="st072.mp4" />
    <Clip from={563.38} dur={6.7} file="st073.mp4" />
    <Still from={570.08} dur={9.06} file="N074.png" />
    <Clip from={579.14} dur={5.25} file="st075.mp4" />
    <Still from={584.39} dur={4.9} file="N076.png" />
    <Clip from={617.91} dur={7.54} file="st081.mp4" />
    <Scanner from={625.45} dur={9.26} img="img/repkit/scanner_pack.png" price={3400} tBeep={629.15} display={{ price: 3290, t: 631.01 }} />
    <Clip from={643.55} dur={5.95} file="st084.mp4" />
    <Scanner from={649.50} dur={8.32} img="img/repkit/scanner_pack.png" price={3400} tBeep={652.83} display={{ price: 3290, t: 654.49 }} />
    <Scanner from={657.82} dur={10.58} img="img/repkit/scanner_pack.png" price={3400} tBeep={662.05} display={{ price: 3290, t: 664.17 }} />
    <Scanner from={668.40} dur={8.74} img="img/repkit/scanner_pack.png" price={3400} tBeep={671.90} display={{ price: 3290, t: 673.64 }} />
    <Still from={677.14} dur={8.12} file="N088.png" />
    <Scanner from={691.69} dur={7.35} img="img/repkit/scanner_pack.png" price={3400} tBeep={694.63} display={{ price: 3290, t: 696.10 }} />
    <Clip from={699.04} dur={7.44} file="st091.mp4" />
    <Scanner from={706.48} dur={8.55} img="img/repkit/scanner_pack.png" price={3400} tBeep={709.90} display={{ price: 3290, t: 711.61 }} />
    <Clip from={715.03} dur={8.24} file="st093.mp4" />
    <Still from={723.27} dur={8.79} file="N094.png" />
    <Clip from={740.08} dur={6.91} file="st096.mp4" />
    <Clip from={746.99} dur={5.64} file="st097.mp4" />
    <Still from={752.63} dur={8.84} file="N098.png" />
    <Clip from={761.47} dur={7.1} file="st099.mp4" />
    <Still from={768.57} dur={9.18} file="N100.png" />
    <Clip from={790.21} dur={8.0} file="st103.mp4" />
    <Still from={798.21} dur={7.92} file="../img/repkit/gondola_full.png" />
    <Clip from={806.13} dur={9.2} file="st105.mp4" />
    <Still from={815.33} dur={6.56} file="N106.png" />
    <Clip from={830.43} dur={8.09} file="st108.mp4" />
    <Clip from={838.52} dur={6.48} file="st109.mp4" />
    <Scanner from={845.00} dur={9.11} img="img/repkit/scanner_pack.png" price={3400} tBeep={848.64} display={{ price: 3290, t: 850.47 }} />
    <Clip from={854.11} dur={6.52} file="st111.mp4" />
    <Scanner from={860.63} dur={11.32} img="img/repkit/scanner_pack.png" price={3400} tBeep={865.16} display={{ price: 3290, t: 867.42 }} />
    <Scanner from={890.71} dur={8.05} img="img/repkit/scanner_pack.png" price={3400} tBeep={893.93} display={{ price: 3290, t: 895.54 }} />
    <Scanner from={898.76} dur={6.5} img="img/repkit/scanner_pack.png" price={3400} tBeep={901.36} display={{ price: 3290, t: 902.66 }} />
    <Clip from={905.26} dur={6.71} file="st117.mp4" />
    <Scanner from={911.97} dur={7.18} img="img/repkit/scanner_pack.png" price={3400} tBeep={914.84} display={{ price: 3290, t: 916.28 }} />
    <Scanner from={932.51} dur={6.95} img="img/repkit/scanner_pack.png" price={3400} tBeep={935.29} display={{ price: 3290, t: 936.68 }} />
    <Scanner from={939.46} dur={8.98} img="img/repkit/scanner_pack.png" price={3400} tBeep={943.05} display={{ price: 3290, t: 944.85 }} />
    <Scanner from={948.44} dur={8.36} img="img/repkit/scanner_pack.png" price={3400} tBeep={951.78} display={{ price: 3290, t: 953.46 }} />
    <AvatarWins from={60} to={988.8} />
    <Grade />
    <Grain />
  </AbsoluteFill>
);

// sucaja · 60-988.8 s (Full2). Escáner máx 3; st096 (barbijo) y huecos con footage real o N agnes; 25 tarjetas n/25 en cada "Truco número".
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Scanner, CountCard } from "../repkit/Kit";
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
export const Full2: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Still from={83.01} dur={5.00} file="../img/repkit/checkout.png" />
    <Clip from={88.01} dur={2.88} file="pool/ar_12.mp4" />
    <Clip from={90.89} dur={6.96} file="pool/ar_13.mp4" />
    <Clip from={97.85} dur={6.64} file="pool/ar_14.mp4" />
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
    <Scanner from={237.53} dur={6.56} img="img/repkit/scanner_pack.png" price={3290} tBeep={240.15} display={{ price: 3180, t: 241.47 }} />
    <Clip from={244.09} dur={6.18} file="st033.mp4" />
    <Still from={258.17} dur={7.74} file="L035.png" />
    <Clip from={265.91} dur={7.16} file="st036.mp4" />
    <Clip from={273.07} dur={8.34} file="st037.mp4" />
    <Still from={281.41} dur={8.96} file="N_ticket_largo.png" />
    <Clip from={290.37} dur={8.08} file="pool/l_39.mp4" />
    <Clip from={298.45} dur={6.31} file="pool/l_40.mp4" />
    <Still from={304.76} dur={6.82} file="L041.png" />
    <Clip from={320.48} dur={7.85} file="st043.mp4" />
    <Clip from={337.15} dur={7.41} file="st045.mp4" />
    <Still from={344.56} dur={8.58} file="N046.png" />
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
    <Scanner from={484.01} dur={6.82} img="img/repkit/scanner_pack.png" price={2150} tBeep={486.74} display={{ price: 2040, t: 488.10 }} />
    <Still from={490.83} dur={9.34} file="L065.png" />
    <Scanner from={500.17} dur={9.3} img="img/repkit/scanner_pack.png" price={4780} tBeep={503.89} display={{ price: 4670, t: 505.75 }} />
    <Clip from={509.47} dur={4.92} file="st067.mp4" />
    <Still from={514.39} dur={10.86} file="N_vuelto.png" />
    <Clip from={525.25} dur={9.1} file="st069.mp4" />
    <Still from={534.35} dur={8.89} file="N_cinta_productos.png" />
    <Clip from={552.51} dur={10.87} file="st072.mp4" />
    <Clip from={563.38} dur={6.7} file="st073.mp4" />
    <Still from={570.08} dur={9.06} file="N074.png" />
    <Clip from={579.14} dur={5.25} file="st075.mp4" />
    <Still from={584.39} dur={4.9} file="N076.png" />
    <Clip from={617.91} dur={7.54} file="st081.mp4" />
    <Still from={625.45} dur={9.26} file="N_posnet.png" />
    <Clip from={643.55} dur={5.95} file="st084.mp4" />
    <Still from={649.50} dur={8.32} file="N_bolsa_caja.png" />
    <Still from={657.82} dur={10.58} file="N_cartel_fila.png" />
    <Still from={668.40} dur={8.74} file="N_ticket_largo.png" />
    <Still from={677.14} dur={8.12} file="N088.png" />
    <Still from={691.69} dur={7.35} file="N_vuelto.png" />
    <Clip from={699.04} dur={7.44} file="st091.mp4" />
    <Still from={706.48} dur={8.55} file="N_cinta_productos.png" />
    <Clip from={715.03} dur={8.24} file="st093.mp4" />
    <Still from={723.27} dur={8.79} file="N094.png" />
    <Clip from={740.08} dur={6.91} file="pool/r96_96.mp4" />
    <Clip from={746.99} dur={5.64} file="st097.mp4" />
    <Still from={752.63} dur={8.84} file="N098.png" />
    <Clip from={761.47} dur={7.1} file="st099.mp4" />
    <Still from={768.57} dur={9.18} file="N100.png" />
    <Clip from={790.21} dur={8.0} file="st103.mp4" />
    <Still from={798.21} dur={7.92} file="N_posnet.png" />
    <Clip from={806.13} dur={9.2} file="st105.mp4" />
    <Still from={815.33} dur={6.56} file="N106.png" />
    <Clip from={830.43} dur={8.09} file="st108.mp4" />
    <Clip from={838.52} dur={6.48} file="st109.mp4" />
    <Still from={845.00} dur={9.11} file="N_bolsa_caja.png" />
    <Clip from={854.11} dur={6.52} file="st111.mp4" />
    <Still from={860.63} dur={11.32} file="N_cartel_fila.png" />
    <Clip from={890.71} dur={8.05} file="pool/c_115.mp4" />
    <Clip from={898.76} dur={6.5} file="pool/c_116.mp4" />
    <Clip from={905.26} dur={6.71} file="st117.mp4" />
    <Clip from={911.97} dur={7.18} file="pool/c_118.mp4" />
    <Clip from={932.51} dur={6.95} file="pool/c_121.mp4" />
    <Clip from={939.46} dur={8.98} file="pool/c_122.mp4" />
    <Clip from={948.44} dur={8.36} file="pool/c_123.mp4" />
    <AvatarWins from={60} to={988.8} />
    <CountCard from={109.00} dur={3.6} n={1} of={25} word="TRUCO" title="Truco número 1" bg="img/sucaja/N_ticket_largo.png" t={109.20} />
    <CountCard from={137.74} dur={3.6} n={2} of={25} word="TRUCO" title="Truco número 2" bg="img/sucaja/N_vuelto.png" t={137.94} />
    <CountCard from={172.30} dur={3.6} n={3} of={25} word="TRUCO" title="Truco número 3" bg="img/sucaja/N_cinta_productos.png" t={172.50} />
    <CountCard from={199.52} dur={3.6} n={4} of={25} word="TRUCO" title="Truco número 4" bg="img/sucaja/N_posnet.png" t={199.72} />
    <CountCard from={235.38} dur={3.6} n={5} of={25} word="TRUCO" title="Truco número 5" bg="img/sucaja/N_bolsa_caja.png" t={235.58} />
    <CountCard from={275.70} dur={3.6} n={6} of={25} word="TRUCO" title="Truco número 6" bg="img/sucaja/N_cartel_fila.png" t={275.90} />
    <CountCard from={307.76} dur={3.6} n={7} of={25} word="TRUCO" title="Truco número 7" bg="img/sucaja/N_ticket_largo.png" t={307.96} />
    <CountCard from={340.42} dur={3.6} n={8} of={25} word="TRUCO" title="Truco número 8" bg="img/sucaja/N_vuelto.png" t={340.62} />
    <CountCard from={372.92} dur={3.6} n={9} of={25} word="TRUCO" title="Truco número 9" bg="img/sucaja/N_cinta_productos.png" t={373.12} />
    <CountCard from={408.20} dur={3.6} n={10} of={25} word="TRUCO" title="Truco número 10" bg="img/sucaja/N_posnet.png" t={408.40} />
    <CountCard from={454.70} dur={3.6} n={11} of={25} word="TRUCO" title="Truco número 11" bg="img/sucaja/N_bolsa_caja.png" t={454.90} />
    <CountCard from={485.94} dur={3.6} n={12} of={25} word="TRUCO" title="Truco número 12" bg="img/sucaja/N_cartel_fila.png" t={486.14} />
    <CountCard from={514.04} dur={3.6} n={13} of={25} word="TRUCO" title="Truco número 13" bg="img/sucaja/N_ticket_largo.png" t={514.24} />
    <CountCard from={548.14} dur={3.6} n={14} of={25} word="TRUCO" title="Truco número 14" bg="img/sucaja/N_vuelto.png" t={548.34} />
    <CountCard from={580.78} dur={3.6} n={15} of={25} word="TRUCO" title="Truco número 15" bg="img/sucaja/N_cinta_productos.png" t={580.98} />
    <CountCard from={627.98} dur={3.6} n={16} of={25} word="TRUCO" title="Truco número 16" bg="img/sucaja/N_posnet.png" t={628.18} />
    <CountCard from={656.20} dur={3.6} n={17} of={25} word="TRUCO" title="Truco número 17" bg="img/sucaja/N_bolsa_caja.png" t={656.40} />
    <CountCard from={688.54} dur={3.6} n={18} of={25} word="TRUCO" title="Truco número 18" bg="img/sucaja/N_cartel_fila.png" t={688.74} />
    <CountCard from={722.36} dur={3.6} n={19} of={25} word="TRUCO" title="Truco número 19" bg="img/sucaja/N_ticket_largo.png" t={722.56} />
    <CountCard from={750.24} dur={3.6} n={20} of={25} word="TRUCO" title="Truco número 20" bg="img/sucaja/N_vuelto.png" t={750.44} />
    <CountCard from={785.82} dur={3.6} n={21} of={25} word="TRUCO" title="Truco número 21" bg="img/sucaja/N_cinta_productos.png" t={786.02} />
    <CountCard from={810.14} dur={3.6} n={22} of={25} word="TRUCO" title="Truco número 22" bg="img/sucaja/N_posnet.png" t={810.34} />
    <CountCard from={838.90} dur={3.6} n={23} of={25} word="TRUCO" title="Truco número 23" bg="img/sucaja/N_bolsa_caja.png" t={839.10} />
    <CountCard from={869.40} dur={3.6} n={24} of={25} word="TRUCO" title="Truco número 24" bg="img/sucaja/N_cartel_fila.png" t={869.60} />
    <CountCard from={899.94} dur={3.6} n={25} of={25} word="TRUCO" title="Truco número 25" bg="img/sucaja/N_ticket_largo.png" t={900.14} />
    {/* P2 fotos (fotos2) sobre su frase; las de ventana de avatar van encima del avatar */}
    <Still from={83.00} dur={3.20} file="F08300.png" />
    <Still from={120.40} dur={5.00} file="F12040.png" />
    <Still from={215.60} dur={4.00} file="F21560.png" />
    <Still from={387.80} dur={5.00} file="F38780.png" />
    <Still from={415.40} dur={4.00} file="F41540.png" />
    <Still from={419.40} dur={4.00} file="F41940.png" />
    <Still from={471.40} dur={5.00} file="F47140.png" />
    <Still from={476.40} dur={4.00} file="F47640.png" />
    <Still from={597.60} dur={3.50} file="F59760.png" />
    <Still from={669.40} dur={5.00} file="F66940.png" />
    <Still from={674.40} dur={4.00} file="F67440.png" />
    <Still from={700.00} dur={5.00} file="F70000.png" />
    <Still from={705.00} dur={4.00} file="F70500.png" />
    <Still from={758.80} dur={3.50} file="F75880.png" />
    <Still from={780.40} dur={3.50} file="F78040.png" />
    <Still from={791.00} dur={5.00} file="F79100.png" />
    <Still from={796.00} dur={4.00} file="F79600.png" />
    <Still from={846.20} dur={4.00} file="F84620.png" />
    <Still from={850.60} dur={4.00} file="F85060.png" />
    <Still from={883.20} dur={3.50} file="F88320.png" />
    <Still from={924.60} dur={3.50} file="F92460.png" />
    <Still from={966.00} dur={3.50} file="F96600.png" />
    <Grade />
    <Grain />
  </AbsoluteFill>
);

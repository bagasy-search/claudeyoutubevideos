// Cap. 7 (399,2–480,2): el primer golpe de pico (1859), el trabajo forzado, el agua, el cólera,
// Ismail, el fallo de Napoleón III y Egipto pagando por perder a sus obreros.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { FPS, Key, MapView, Tag, BigWord, Stamp, Note, Count, ScenePortal, Chain, Dust, Vignette, YearNote, Caption, Route, Photo, FullPhoto, CanalLine, proj, ramp, fadeOut, vis, camAt, pop, HAND, SANS } from "./kit";
import { PL } from "./geo";
import { AnimeScene } from "./anime";

export const CH7: [number, number] = [399.2, 480.2];
const KEYS: Key[] = [
  [399.2, 32.0, 30.4, 3.2],
  [403.6, 32.3, 31.24, 11.0],  // Port Said
  [415.0, 32.3, 31.2, 10.0],
  [436.6, 31.8, 30.4, 4.6],    // el canal de agua dulce
  [439.4, 32.0, 30.4, 5.0],
  [455.3, 31.3, 30.1, 5.0],    // muere Said
  [458.4, 31.24, 30.05, 6.0],
  [461.4, 18, 42, 1.3],        // escándalo en Europa
  [466.4, 8, 47, 1.6],
  [480.2, 2.35, 48.86, 3.0],
];
const SWEET: [number, number][] = [[31.24, 30.06], [31.5, 30.45], [31.75, 30.55], [32.05, 30.56], [32.27, 30.6], [32.28, 30.8], [32.3, 31.0], [32.3, 31.24]];
const SWEET_S: [number, number][] = [[32.27, 30.6], [32.36, 30.4], [32.45, 30.2], [32.55, 29.97]];

export const Ch7: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  const c = camAt(KEYS, t);
  const sceneOn = (t > 402.6 && t < 436.2) || (t > 439.8 && t < 454.9) || (t > 466.9);
  const ps = proj(c, PL.portSaid[0], PL.portSaid[1]);
  const shake = t > 405.4 && t < 405.9 ? Math.sin(t * 110) * 14 * (405.9 - t) : 0;
  const par = proj(c, PL.paris[0], PL.paris[1]);
  return (
    <AbsoluteFill style={{ background: "#e6d8b6", overflow: "hidden" }}>
      <MapView keys={KEYS} t={t} hidden={sceneOn}>
        {(c) => (
          <>
            <Tag c={c} f={f} t={t} lon={PL.portSaid[0]} lat={PL.portSaid[1]} t0={400.9} t1={403.0} text="future Port Said" size={32} dot dy={-44} />
            {/* el canal de agua dulce desde el Nilo */}
            {vis(t, 436.7, 440.2) && <>
              <CanalLine c={c} pts={SWEET} k={ramp(t, 436.8, 438.6)} w={9} color="#3fa34d" op={fadeOut(t, 440.2)} />
              <CanalLine c={c} pts={SWEET_S} k={ramp(t, 438.2, 439.2)} w={9} color="#3fa34d" op={fadeOut(t, 440.2)} />
            </>}
            <Tag c={c} f={f} t={t} lon={31.24} lat={30.05} t0={436.8} t1={440.2} text="Nile" size={28} bg="#2f6fb8" dot dy={40} />
            <Tag c={c} f={f} t={t} lon={31.9} lat={30.75} t0={437.6} t1={440.2} text="freshwater canal" size={30} bg="#3fa34d" />
            <Tag c={c} f={f} t={t} lon={31.24} lat={30.05} t0={455.9} t1={461.0} text="Cairo" size={28} dot dy={-38} />
            {/* el escándalo llega a Europa */}
            {vis(t, 463.2, 466.9) && [[2.35, 48.86], [-0.1, 51.5], [13.4, 52.5], [16.37, 48.2]].map(([lo, la], i) => {
              const [x, y] = proj(c, lo, la); const s = pop(f, 463.3 + i * 0.2, 9) * fadeOut(t, 466.9);
              return <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${s}) rotate(${(i % 2 ? 6 : -6)}deg)`, width: 230, padding: "10px 12px", background: "#f4efe2", border: "2px solid #333", boxShadow: "0 8px 16px rgba(0,0,0,.4)", fontFamily: "Georgia, serif", textAlign: "center" }}>
                <div style={{ fontSize: 15, letterSpacing: 2, borderBottom: "2px solid #333", paddingBottom: 4 }}>THE NEWSPAPER</div>
                <div style={{ fontSize: 30, fontWeight: 900, marginTop: 6 }}>FORCED LABOUR ON THE CANAL</div>
              </div>;
            })}
          </>
        )}
      </MapView>
      <YearNote f={f} t={t} marks={[[399.3, "25 Apr 1859"], [445.9, "1865"], [455.6, "1863"], [466.5, "1864"]]} />

      {/* 1859: la playa vacía y el primer golpe de pico → lo que faltaba → el trabajo forzado → con las manos */}
      <ScenePortal t={t} open={[402.15, 402.65]} close={[436.1, 436.6]} o={ps} cpt={proj(c, 31.6, 30.5)}>
        <AbsoluteFill style={{ transform: `translate(${shake}px, ${shake * 0.4}px)` }}>
          <Chain t={t} f={f} end={436.6} shots={[
            [402.15, (t) => <AnimeScene t={t} f={f} t0={402.1} t1={409.6} bg="bg_first_pick" z0={1.02} z1={1.16} px={30} py={-20} chars={[]} />],
            [409.45, (t) => <FullPhoto t={t} t0={409.4} t1={415.2} src="suez/pd/album/a20.jpg" z0={1.36} z1={1.42} ox={420} pos="50% 50%" />, "ink"],
            [415.0, (t) => <><AnimeScene t={t} f={f} t0={414.9} t1={425.2} bg="bg_corvee" z0={1.03} z1={1.15} px={-80} chars={[]} /><Dust f={f} op={0.5} /></>, "sand"],
            [425.05, (t) => <AnimeScene t={t} f={f} t0={425.0} t1={430.4} bg="bg_dig_hands" z0={1.03} z1={1.13} px={60} chars={[]} />, "whip"],
            [430.25, (t) => {
              const k = ramp(t, 430.25, 430.75);
              return <AbsoluteFill>
                <AbsoluteFill style={{ clipPath: `inset(0 ${50 * k}% 0 0)` }}><AnimeScene t={t} f={f} t0={425.0} t1={436.6} bg="bg_dig_hands" z0={1.03} z1={1.2} px={60} chars={[]} /></AbsoluteFill>
                <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${100 - 50 * k}%)` }}><AnimeScene t={t} f={f} t0={430.2} t1={436.6} bg="bg_necho" z0={1.1} z1={1.18} px={-40} chars={[]} /></AbsoluteFill>
                <div style={{ position: "absolute", left: 960 - 4, top: 0, width: 8, height: 1080, background: "#fff", opacity: k }} />
              </AbsoluteFill>;
            }],
            [434.45, (t) => <AnimeScene t={t} f={f} t0={434.4} t1={436.6} bg="bg_camels" z0={1.03} z1={1.1} px={50} chars={[]} />, "whip"],
          ]} />
        </AbsoluteFill>
      </ScenePortal>
      <Caption f={f} t={t} t0={404.5} t1={407.4} x={960} y={1010} text="Ferdinand de Lesseps · first pickaxe" flag="fr" />
      {vis(t, 405.4, 405.8) && <AbsoluteFill style={{ background: "#fff8e8", opacity: interpolate(t, [405.4, 405.8], [0.8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }} />}
      <BigWord f={f} t={t} t0={407.5} t1={409.3} text={<span>THE <span style={{ color: "#ff7a6b" }}>TRUE COST</span></span>} y={170} size={120} />
      {[["machines", 410.4], ["fresh water", 412.0], ["volunteers", 414.2]].map(([s, t0], i) => (
        <Note key={i} f={f} t={t} t0={t0 as number} t1={415.0} x={480 + i * 480} y={540} w={400} rot={-3 + i * 3} size={52}>{s} <b style={{ color: "#b3261e" }}>✕</b></Note>
      ))}
      <Stamp f={f} t={t} t0={418.0} t1={420.3} x={960} y={250} text="Forced labor" size={110} />
      <Note f={f} t={t} t0={420.4} t1={424.9} x={1460} y={330} w={440} rot={3} size={48}>every month<br /><b style={{ fontSize: 90, color: "#b3261e" }}>≈<Count t={t} t0={420.5} t1={421.4} from={0} to={20000} /></b><br />peasants</Note>
      {[["hands", 425.8], ["short hoes", 426.5], ["baskets", 428.5]].map(([s, t0], i) => (
        <Note key={i} f={f} t={t} t0={t0 as number} t1={430.2} x={1520} y={260 + i * 140} w={340} rot={2 - i * 2} size={48}>✓ {s}</Note>
      ))}
      <BigWord f={f} t={t} t0={430.6} t1={434.3} text="1859" x={480} y={950} size={110} />
      <BigWord f={f} t={t} t0={430.8} t1={434.3} text="600 BC" x={1440} y={950} size={110} color="#ffd23a" />
      <Caption f={f} t={t} t0={434.9} t1={436.2} x={960} y={1010} text="Water by camel" />

      {/* el canal de agua dulce, después el cólera */}
      <ScenePortal t={t} open={[439.4, 439.9]} close={[454.8, 455.3]} o={proj(c, 32.27, 30.6)} cpt={proj(c, 31.3, 30.1)}>
        <Chain t={t} f={f} end={455.3} shots={[
          [439.4, (t) => <AnimeScene t={t} f={f} t0={439.4} t1={444.0} bg="bg_sweetwater" z0={1.03} z1={1.14} px={-60} chars={[]} />],
          [443.85, (t) => <AnimeScene t={t} f={f} t0={443.8} t1={455.3} bg="bg_cholera" z0={1.02} z1={1.16} px={50} chars={[]} sand="#a8b8d8" />, "ink"],
        ]} />
      </ScenePortal>
      <Note f={f} t={t} t0={440.8} t1={443.6} x={1460} y={300} w={460} rot={3} size={50}>thousands of camels<br /><b>every single day</b></Note>
      <Stamp f={f} t={t} t0={445.95} t1={448.2} x={960} y={300} text="Cholera" size={120} />
      <Note f={f} t={t} t0={448.4} t1={454.7} x={480} y={330} w={420} rot={-3} size={50}>how many died?<br /><b style={{ fontSize: 100 }}>?</b></Note>
      <Note f={f} t={t} t0={451.1} t1={454.7} x={1440} y={330} w={400} rot={3} size={48}>"thousands"</Note>
      <Note f={f} t={t} t0={452.9} t1={454.7} x={1440} y={520} w={480} rot={-2} size={48}>Egyptian historians:<br /><b style={{ color: "#b3261e" }}>far more</b></Note>

      {/* muere Said, llega Ismail */}
      <Note f={f} t={t} t0={457.5} t1={460.9} x={540} y={760} w={380} rot={-3} size={50}>Said Pasha<br />† 1863</Note>
      <Photo f={f} t={t} t0={458.6} t1={466.4} src="suez/pd/ismail.jpg" x={1420} y={500} w={420} h={530} rot={3} caption="Khedive Ismail" pos="50% 30%" />
      <BigWord f={f} t={t} t0={463.2} t1={466.3} text="A SCANDAL" y={170} size={120} />

      {/* Napoleón III decide; Egipto paga */}
      <ScenePortal t={t} open={[466.45, 466.95]} close={[480.2, 480.3]} o={par} cpt={par}>
        <Chain t={t} f={f} end={480.3} shots={[
          [466.45, (t) => <AnimeScene t={t} f={f} t0={466.4} t1={476.8} bg="bg_tuileries" z0={1.02} z1={1.14} px={-50} chars={[]} />],
          [476.65, (t) => <AnimeScene t={t} f={f} t0={476.6} t1={482.0} bg="bg_gold" z0={1.03} z1={1.16} px={40} py={10} chars={[]} />, "whip"],
        ]} />
      </ScenePortal>
      <Caption f={f} t={t} t0={467.0} t1={471.6} x={960} y={1010} text="Emperor Napoleon III" flag="fr" />
      <Stamp f={f} t={t} t0={469.95} t1={471.7} x={1350} y={300} text="Brutal" size={120} />
      <Note f={f} t={t} t0={471.85} t1={476.4} x={480} y={330} w={420} rot={-3} size={52}>forced labor: <b style={{ color: "#1d6b3a" }}>ends</b></Note>
      <Note f={f} t={t} t0={473.2} t1={476.4} x={1440} y={560} w={500} rot={3} size={46}>Egypt pays the company<br /><b style={{ fontSize: 76, color: "#b3261e" }}><Count t={t} t0={473.3} t1={474.9} from={0} to={84} />,000,000</b><br />francs</Note>
      <BigWord f={f} t={t} t0={477.1} t1={480.1} text={<span>LOST ITS WORKERS<br /><span style={{ color: "#ffd23a" }}>AND PAID FOR IT</span></span>} y={880} size={84} />
      <Vignette />
    </AbsoluteFill>
  );
};

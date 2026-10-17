// Cap. 2 (83,0–127,7): Necho II — el canal de costado por el valle seco, Heródoto y los 120.000, el oráculo, la zanja abandonada
// y la sospecha de un canal todavía más viejo.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { FPS, Key, MapView, Tag, HandLabel, BigWord, Stamp, Note, Count, ScenePortal, Chain, Dust, Vignette, YearNote, Caption, Bubble, proj, partial, dpath, smooth, ramp, fadeOut, vis, camAt, pop, rnd } from "./kit";
import { PL, NECHO, DARIUS } from "./geo";
import { AnimeScene } from "./anime";

export const CH2: [number, number] = [83.0, 127.7];
const KEYS: Key[] = [
  [83.0, 32.3, 30.6, 11.5],
  [84.6, 31.0, 27.5, 2.1],   // "Egypt itself"
  [85.6, 31.2, 27.8, 2.2],
  [87.6, 31.75, 30.4, 8.5],  // 600 BC → el delta y el valle
  [92.7, 31.9, 30.45, 9.5],
  [94.2, 32.0, 30.5, 10.5],  // "not straight… but sideways"
  [96.8, 31.85, 30.55, 12.0], // "along a dry valley"
  [100.4, 31.85, 30.55, 12.5],
  [113.4, 31.9, 30.5, 10.0], // vuelve el mapa: "not even the first"
  [115.3, 31.6, 29.6, 4.6],
  [119.6, 31.9, 30.3, 8.5],  // "linked the Nile to the Red Sea"
  [122.4, 32.1, 30.25, 8.0],
  [124.4, 31.85, 30.55, 11.5], // "digging out a canal… swallowed once"
  [127.7, 31.95, 30.5, 12.5],
];
const ANCIENT = [...NECHO, ...DARIUS.slice(1)];

export const Ch2: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  const c = camAt(KEYS, t);
  const sceneOn = (t > 88.4 && t < 92.4) || (t > 97.4 && t < 113.0);
  const pj = (a: [number, number][]) => smooth(a).map(([lo, la]) => proj(c, lo, la));
  const bub = proj(c, PL.bubastis[0], PL.bubastis[1]);
  const wadi = proj(c, 31.85, 30.55);
  // la zanja de Necho: primero en el valle (93-96.5), después la arena la tapa (125-127)
  const kN = ramp(t, 94.4, 96.6, Easing.inOut(Easing.quad));
  const ghost = ramp(t, 119.8, 121.2) * fadeOut(t, 122.6, 0.6);
  const kRe = ramp(t, 124.4, 125.6);
  const buried = ramp(t, 125.7, 126.9);
  const w = Math.max(6, c.z * 1.1);
  return (
    <AbsoluteFill style={{ background: "#e6d8b6", overflow: "hidden" }}>
      <MapView keys={KEYS} t={t} hidden={sceneOn}>
        {(c) => (
          <>
            <svg width={1920} height={1080} style={{ position: "absolute" }}>
              {/* "not straight through": la línea recta, tachada */}
              {vis(t, 92.8, 96.9) && (() => {
                const a = proj(c, 32.3, 31.26), b = proj(c, 32.56, 29.95);
                const k = ramp(t, 92.85, 93.5, Easing.linear), x = ramp(t, 93.6, 94.0);
                const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
                return <g opacity={fadeOut(t, 96.9)}>
                  <line x1={a[0]} y1={a[1]} x2={a[0] + (b[0] - a[0]) * k} y2={a[1] + (b[1] - a[1]) * k} stroke="#26314a" strokeWidth={8} strokeDasharray="20 12" />
                  {x > 0 && <path d={`M${mx - 60 * x},${my - 60 * x} L${mx + 60 * x},${my + 60 * x} M${mx + 60 * x},${my - 60 * x} L${mx - 60 * x},${my + 60 * x}`} stroke="#d4241c" strokeWidth={16} strokeLinecap="round" />}
                </g>;
              })()}
              {/* el canal de costado: del Nilo hacia el este por el valle */}
              {kN > 0 && <g opacity={1 - buried * 0.85}>
                <path d={dpath(partial(pj(NECHO), kN))} fill="none" stroke="#3b2a17" strokeWidth={w + 6} strokeLinecap="round" opacity={0.5} />
                <path d={dpath(partial(pj(NECHO), kN))} fill="none" stroke={buried > 0.5 ? "#c9a66b" : "#4f9fe0"} strokeWidth={w} strokeLinecap="round" />
              </g>}
              {/* el canal más viejo, fantasma (inscripciones) */}
              {ghost > 0 && <path d={dpath(pj(ANCIENT))} fill="none" stroke="#fff" strokeWidth={w * 0.8} strokeDasharray={`${w} ${w}`} opacity={ghost * 0.85} />}
              {kRe > 0 && buried < 1 && <path d={dpath(partial(pj(NECHO), kRe))} fill="none" stroke="#2c7fd0" strokeWidth={w * 0.6} strokeLinecap="round" opacity={1 - buried} />}
              {/* la arena se lo traga */}
              {buried > 0 && Array.from({ length: 26 }).map((_, i) => {
                const p = pj(NECHO); const q = partial(p, rnd(i)); const [x, y] = q[q.length - 1];
                return <circle key={i} cx={x + (rnd(i + 9) - 0.5) * 40} cy={y + (rnd(i + 3) - 0.5) * 30} r={(16 + rnd(i + 5) * 30) * buried} fill="#d2b07a" opacity={0.85} />;
              })}
            </svg>
            <Tag c={c} f={f} t={t} lon={30.8} lat={26.8} t0={84.1} t1={87.2} text="Egypt" bg="#9c6a1c" size={46} />
            <HandLabel c={c} f={f} t={t} lon={31.3} lat={30.25} t0={87.9} t1={92.5} text="Nile" size={64} rot={-70} />
            <Tag c={c} f={f} t={t} lon={31.88} lat={30.5} t0={95.8} t1={97.4} text="dry valley" bg="#7a4b20" size={30} dy={70} />
            <HandLabel c={c} f={f} t={t} lon={32.25} lat={30.1} t0={119.0} t1={122.6} text="an older canal?" size={58} rot={-6} />
            <Tag c={c} f={f} t={t} lon={31.9} lat={30.45} t0={124.5} t1={127.7} text="dug again" bg="#2f6fb8" size={30} dy={-80} />
          </>
        )}
      </MapView>
      {/* barco que entra del río al canal y sale al mar (en el mapa, antes de la escena del valle) */}
      <YearNote f={f} t={t} marks={[[85.75, "600 BC"], [116.6, "1800s BC?"], [123.5, "600 BC"]]} />

      {/* Necho ordena el canal: portal desde Bubastis */}
      <ScenePortal t={t} open={[88.0, 88.5]} close={[92.0, 92.5]} o={bub} cpt={wadi}>
        <AnimeScene t={t} f={f} t0={88.0} t1={92.5} bg="bg_necho_court" z0={1.03} z1={1.13} px={-60} chars={[{ src: "ch_necho", x: 1420, bottom: 10, h: 900, tIn: 88.3, from: 160 }]} sand="#fff1d0" />
      </ScenePortal>
      <Caption f={f} t={t} t0={88.6} t1={92.0} x={1420} y={1010} text="Pharaoh Necho II" />
      <Note f={f} t={t} t0={89.75} t1={92.0} x={540} y={300} w={420} rot={-3} size={50}>Nile <span style={{ color: "#2c7fd0" }}>→</span> Red Sea</Note>

      {/* barcos del río al mar, luego Heródoto, el oráculo y la zanja abandonada */}
      <ScenePortal t={t} open={[96.95, 97.5]} close={[112.9, 113.4]} o={wadi} cpt={wadi}>
        <Chain t={t} f={f} end={113.4} shots={[
          [96.9, (t) => <AnimeScene t={t} f={f} t0={96.9} t1={100.6} bg="bg_wadi" z0={1.02} z1={1.14} px={90} chars={[]} />],
          [100.4, (t) => <AnimeScene t={t} f={f} t0={100.3} t1={105.9} bg="bg_herodotus" z0={1.02} z1={1.1} px={-40} chars={[{ src: "ch_herodotus", x: 1500, bottom: 0, h: 960, tIn: 100.6, from: 140 }]} sand="#fff" />, "whip"],
          [105.75, (t) => <><AnimeScene t={t} f={f} t0={105.6} t1={109.9} bg="bg_oracle" z0={1.05} z1={1.16} px={30} py={20} chars={[]} /><Dust f={f} op={0.3} color="#cfc6b8" /></>, "smoke"],
          [109.75, (t) => <><AnimeScene t={t} f={f} t0={109.7} t1={113.4} bg="bg_abandoned" z0={1.03} z1={1.15} px={-70} chars={[]} /><Dust f={f} op={0.8} n={60} /></>, "sand"],
        ]} />
      </ScenePortal>
      <Caption f={f} t={t} t0={100.9} t1={105.4} x={1500} y={1010} text="Herodotus · Greek historian" />
      <Note f={f} t={t} t0={102.4} t1={105.5} x={560} y={540} w={520} rot={-3} size={50}>
        <b style={{ fontSize: 96, color: "#b3261e" }}><Count t={t} t0={102.45} t1={103.5} from={0} to={120000} /></b><br />men died digging it
      </Note>
      {vis(t, 106.0, 109.6) && <AbsoluteFill style={{ background: `radial-gradient(ellipse at 55% 35%, rgba(255,214,140,${0.18 + 0.08 * Math.sin(f / 4)}), transparent 55%)`, pointerEvents: "none" }} />}
      <BigWord f={f} t={t} t0={107.7} t1={109.6} text={<span style={{ fontFamily: "inherit" }}>“…FOR A <span style={{ color: "#ffd23a" }}>FOREIGNER</span>”</span>} y={900} size={96} />
      <Stamp f={f} t={t} t0={109.95} t1={112.6} x={960} y={420} text="Stopped" size={120} />

      {/* inscripciones: un canal todavía más viejo */}
      <Bubble f={f} t={t} t0={116.6} t1={122.3} src="suez/anime/bg_old_relief.jpg" x={1440} y={330} r={250} anchor={proj(c, 31.75, 30.55)} caption="inscriptions" />
      <BigWord f={f} t={t} t0={115.0} t1={116.5} text="NOT EVEN THE FIRST?" y={950} size={86} />
      <Vignette />
    </AbsoluteFill>
  );
};

// Cap. 11 (753,5–788,0): el 12 % del comercio mundial, lo que pasa por el canal, Lesseps en Panamá,
// la caída y el final: todos miraron la misma franja de arena; sólo uno la cortó, y una sola vez.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { FPS, Key, MapView, Tag, BigWord, Stamp, Note, Count, ScenePortal, Chain, Vignette, YearNote, Caption, Route, Photo, HandLabel, CanalLine, proj, partial, dpath, ramp, fadeOut, vis, camAt, pop, rnd, clamp, HAND, SANS } from "./kit";
import { PL, SUEZ_ROUTE, MODERN } from "./geo";
import { AnimeScene } from "./anime";

export const CH11: [number, number] = [753.5, 788.0];
const KEYS: Key[] = [
  [753.5, 32.4, 30.5, 6.6],
  [755.2, 45, 25, 0.5],      // el comercio del mundo
  [758.9, 45, 25, 0.52],
  [764.3, -20, 25, 0.5],     // hacia Panamá
  [766.9, -79.6, 9.1, 2.4],
  [771.0, -79.6, 9.1, 2.8],
  [775.9, 32.3, 30.6, 7.0],  // la misma franja de arena
  [781.0, 32.32, 30.6, 8.4],
  [788.0, 32.32, 30.6, 8.4],
];
// rutas de comercio que pasan por Suez (Asia ↔ Europa)
const TRADE: [number, number][][] = [
  [[121.5, 31.2], [114, 22], [110, 12], [104, 1.3], [95, 6], [80, 6], [60, 13], [52, 13.2], [43.4, 12.6], [38.6, 20.8], [33.8, 28], [32.56, 29.9], [32.32, 30.7], [32.3, 31.4], [25, 34], [12, 37.6], [0, 36.7], [-6, 36], [-9.5, 39], [-5, 48], [4, 51.9]],
  [[129, 35], [122, 25], [114, 18], [104, 1.3], [92, 5], [77, 7], [56, 24], [58, 17], [52, 13.2], [43.4, 12.6], [36, 25], [32.56, 29.9], [32.32, 30.7], [32.3, 31.4], [28, 33], [24, 37.9]],
  [[72.8, 18.8], [62, 18], [52, 13.2], [43.4, 12.6], [38.6, 20.8], [32.56, 29.9], [32.32, 30.7], [32.3, 31.4], [20, 35], [12, 39], [8.9, 44.4]],
  [[50, 26.5], [56, 25], [58, 20], [52, 13.2], [43.4, 12.6], [36, 25], [32.56, 29.9], [32.32, 30.7], [32.3, 31.4], [16, 36], [-6, 36], [-10, 45], [-1, 50.5]],
];
const NAMES: [string, number, number, number][] = [ // nombre, lon, lat, t0
  ["Necho", 31.6, 30.9, 776.1], ["Darius", 32.9, 30.85, 776.5], ["Ptolemy", 31.65, 30.3, 776.9], ["Trajan", 32.95, 30.2, 777.3],
  ["Amr", 31.7, 29.9, 777.7], ["Napoleon", 33.0, 29.85, 778.0], ["Said", 31.8, 31.25, 778.4], ["Ismail", 33.1, 31.2, 778.7],
];

export const Ch11: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  const c = camAt(KEYS, t);
  const sceneOn = (t > 759.4 && t < 764.1) || (t > 768.0 && t < 775.7) || (t > 782.3);
  const pan = proj(c, PL.panama[0], PL.panama[1]);
  const isth = proj(c, 32.3, 30.6);
  return (
    <AbsoluteFill style={{ background: "#e6d8b6", overflow: "hidden" }}>
      <MapView keys={KEYS} t={t} hidden={sceneOn}>
        {(c) => (
          <>
            {vis(t, 754.0, 759.6) && <svg width={1920} height={1080} style={{ position: "absolute", opacity: fadeOut(t, 759.6) }}>
              {TRADE.map((r, i) => {
                const p = r.map(([lo, la]) => proj(c, lo, la)); const k = ramp(t, 754.3 + i * 0.35, 756.6 + i * 0.35, Easing.inOut(Easing.cubic));
                return <path key={i} d={dpath(partial(p, k))} fill="none" stroke={["#ffd23a", "#ff8a3a", "#7fc6ff", "#7be08f"][i]} strokeWidth={5} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 6px rgba(0,0,0,.4))" }} />;
              })}
              {Array.from({ length: 40 }).map((_, i) => {
                if (t <= 756.4) return null;
                const r = TRADE[i % 4].map(([lo, la]) => proj(c, lo, la)); const q = partial(r, Math.max(0.01, ((t - 756.0) * 0.12 + rnd(i)) % 1)); const [x, y] = q[q.length - 1];
                return <circle key={i} cx={x} cy={y} r={6} fill="#fff" stroke="#26314a" strokeWidth={2} />;
              })}
            </svg>}
            {vis(t, 754.0, 759.6) && (() => { const [x, y] = proj(c, 32.3, 30.6); return <div style={{ position: "absolute", left: x, top: y, width: 70, height: 70, borderRadius: 35, border: "6px solid #fff", transform: `translate(-50%,-50%) scale(${pop(f, 756.8, 9) * (1 + 0.12 * Math.sin(t * 6))})`, opacity: fadeOut(t, 759.6) }} />; })()}
            <Route c={c} t={t} f={f} pts={[[2.35, 48.86], [-6, 46], [-30, 30], [-55, 18], [-72, 14], [-79.6, 9.1]]} t0={764.6} t1={767.0} out={768.2} color="#d4241c" w={7} dash ship shipSize={80} />
            <Tag c={c} f={f} t={t} lon={PL.panama[0]} lat={PL.panama[1]} t0={767.6} t1={768.2} text="Panama" size={34} dot dy={-44} />
            {/* la misma franja de arena: todos los nombres */}
            {NAMES.map(([n, lo, la, t0], i) => <HandLabel key={n} c={c} f={f} t={t} lon={lo} lat={la} t0={t0} t1={782.4} text={n} size={64} rot={i % 2 ? 3 : -4} color="#5a4020" />)}
            {vis(t, 781.2, 782.4) && <CanalLine c={c} pts={MODERN} k={ramp(t, 781.4, 782.6)} w={Math.max(10, c.z * 1.1)} />}
            <HandLabel c={c} f={f} t={t} lon={32.75} lat={30.55} t0={782.0} t1={782.4} text="Lesseps" size={80} rot={-3} color="#b3261e" />
          </>
        )}
      </MapView>
      <YearNote f={f} t={t} marks={[[753.5, "today"], [764.3, "1880s"], [773.0, "1894"], [775.9, "3,000 years"]]} />
      <Note f={f} t={t} t0={754.2} t1={759.2} x={1500} y={280} w={460} rot={3} size={48}>of everything traded<br />on Earth <b style={{ fontSize: 110, color: "#b3261e" }}>≈<Count t={t} t0={754.3} t1={755.4} from={0} to={12} />%</b></Note>
      <BigWord f={f} t={t} t0={756.9} t1={759.2} text="ONE NARROW LINE OF WATER" y={950} size={90} />

      {/* qué pasa por ahí hoy */}
      <ScenePortal t={t} open={[759.0, 759.5]} close={[763.9, 764.4]} o={isth} cpt={isth}>
        <AnimeScene t={t} f={f} t0={759.0} t1={764.4} bg="bg_modern" z0={1.02} z1={1.14} px={-60} chars={[]} />
      </ScenePortal>
      {[["tankers", 759.2], ["container giants", 759.9], ["grain", 760.8], ["gas", 761.4], ["the phone in your pocket", 762.1]].map(([s, t0], i) => (
        <Note key={i} f={f} t={t} t0={t0 as number} t1={763.9} x={i < 2 ? 420 : 1480} y={i < 2 ? 260 + i * 150 : 230 + (i - 2) * 140} w={i === 4 ? 520 : 400} rot={i % 2 ? 3 : -3} size={46}>{s}</Note>
      ))}

      {/* Lesseps lo intenta otra vez, en Panamá */}
      <BigWord f={f} t={t} t0={764.4} t1={766.8} text={<span>AND <span style={{ color: "#ffd23a" }}>LESSEPS</span>?</span>} y={230} size={110} />
      <ScenePortal t={t} open={[767.9, 768.4]} close={[771.0, 771.5]} o={pan} cpt={pan}>
        <AnimeScene t={t} f={f} t0={767.9} t1={771.5} bg="bg_panama" z0={1.03} z1={1.14} px={50} chars={[]} />
      </ScenePortal>
      <BigWord f={f} t={t} t0={769.5} t1={771.2} text={<span>THE <span style={{ color: "#7be08f" }}>JUNGLE</span> WON</span>} y={230} size={120} />
      <ScenePortal t={t} open={[771.0, 771.5]} close={[775.6, 776.1]} o={[960, 540]} cpt={isth}>
        <AnimeScene t={t} f={f} t0={771.0} t1={776.1} bg="bg_lesseps_old" z0={1.03} z1={1.16} px={0} py={-30} chars={[]} />
      </ScenePortal>
      <Photo f={f} t={t} t0={771.3} t1={775.6} src="suez/pd/panama.jpg" x={470} y={420} w={560} h={420} rot={-4} caption="Panama, 1880s · real engraving" />
      <Stamp f={f} t={t} t0={772.5} t1={775.6} x={1440} y={330} text="Scandal" size={110} />
      <Note f={f} t={t} t0={774.1} t1={775.6} x={1440} y={760} w={440} rot={3} size={50}>died in<br /><b>disgrace</b></Note>

      {/* la misma franja: sólo uno la cortó, una sola vez */}
      {[["Pharaohs", 776.1], ["kings", 776.8], ["emperors", 777.5], ["generals", 778.0]].map(([s, t0], i) => (
        <BigWord key={i} f={f} t={t} t0={t0 as number} t1={781.0} text={s} x={[440, 1480, 440, 1480][i]} y={[260, 260, 880, 880][i]} size={80} />
      ))}
      <BigWord f={f} t={t} t0={779.3} t1={781.0} text="THE SAME STRIP OF SAND" y={540} size={96} color="#ffd23a" />
      <ScenePortal t={t} open={[782.3, 782.8]} close={[788.0, 788.1]} o={isth} cpt={isth}>
        <Chain t={t} f={f} end={788.1} shots={[
          [782.3, (t) => <AnimeScene t={t} f={f} t0={782.3} t1={784.3} bg="bg_final" z0={1.02} z1={1.08} px={0} py={-30} chars={[]} />],
          [784.1, (t) => <AnimeScene t={t} f={f} t0={784.1} t1={789.0} bg="bg_dawn" z0={1.02} z1={1.12} px={0} chars={[{ src: "ch_pharaoh_dawn", x: 1500, bottom: 0, h: 760, tIn: 784.3, from: 120 }]} />, "smoke"],
        ]} />
      </ScenePortal>
      <BigWord f={f} t={t} t0={782.6} t1={784.1} text={<span>ONE STUBBORN <span style={{ color: "#ffd23a" }}>DIPLOMAT</span></span>} y={230} size={100} />
      <BigWord f={f} t={t} t0={785.3} t1={788.0} text={<span>…ONLY <span style={{ color: "#ffd23a" }}>ONCE</span>.</span>} y={540} size={150} />
      {vis(t, 786.6, 788.0) && <AbsoluteFill style={{ background: "#000", opacity: ramp(t, 786.6, 788.0, Easing.in(Easing.quad)), pointerEvents: "none" }} />}
      <Vignette />
    </AbsoluteFill>
  );
};

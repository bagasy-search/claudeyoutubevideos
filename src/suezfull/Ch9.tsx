// Cap. 9 (584,2–669,3): la inauguración de 1869, la fiesta de Ismail, Eugenia, el HMS Newport colándose de noche,
// el canal funciona, la deuda, Disraeli compra las acciones con plata de Rothschild y los casacas rojas se quedan 70 años.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { FPS, Key, MapView, Tag, BigWord, Stamp, Note, Count, ScenePortal, Chain, Vignette, YearNote, Caption, Route, Flag, Photo, proj, ramp, fadeOut, vis, camAt, pop, clamp, HAND, SANS } from "./kit";
import { PL, SUEZ_ROUTE } from "./geo";
import { AnimeScene } from "./anime";

export const CH9: [number, number] = [584.2, 669.3];
const KEYS: Key[] = [
  [584.2, 32.3, 31.2, 9.0],
  [588.0, 32.3, 31.25, 10.0],
  [605.1, 32.3, 31.25, 10.5],
  [608.5, 32.3, 31.27, 12.0],
  [627.4, 40, 30, 0.62],   // el viaje a la India
  [633.4, 42, 28, 0.66],
  [646.8, 30, 31, 3.2],     // Egipto vende
  [647.6, 16, 42, 1.05],    // El Cairo → Londres
  [651.0, 10, 46, 1.25],
  [662.7, 31.5, 30.5, 3.8], // 1882: tropas británicas
  [669.3, 31.8, 30.6, 4.4],
];
const SHARES: [number, number][] = [[31.24, 30.04], [30, 31.5], [24, 33.6], [17, 36], [12, 37.6], [8, 39.5], [6, 43.5], [3, 47.5], [0.5, 50], [-0.1, 51.5]];

// la fila de barcos de la inauguración: el británico apagado se mete adelante
const Queue: React.FC<{ f: number; t: number; t0: number; t1: number }> = ({ f, t, t0, t1 }) => {
  if (!vis(t, t0, t1)) return null;
  const s = pop(f, t0, 12) * fadeOut(t, t1);
  const k = ramp(t, t0 + 0.6, t0 + 1.9, Easing.inOut(Easing.cubic));
  const ships = [["fr", "L'Aigle · the Empress"], ["at", ""], ["it", ""], ["de", ""], ["es", ""]];
  const W = 1500;
  return (
    <div style={{ position: "absolute", left: 960, top: 560, width: W, height: 470, transform: `translate(-50%,-50%) scale(${s}) rotate(-1deg)`, background: "linear-gradient(#1a2440,#0d1424)", border: "4px solid #fff", borderRadius: 8, boxShadow: "0 16px 40px rgba(0,0,0,.55)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 30, top: 18, fontFamily: SANS, fontWeight: 900, fontSize: 28, color: "#cfe3ff" }}>THE OPENING PROCESSION · NIGHT BEFORE</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, height: 170, background: "linear-gradient(#21406e,#142a4a)" }} />
      <div style={{ position: "absolute", left: 40, top: 400, fontFamily: HAND, fontSize: 40, color: "#ffd23a" }}>canal →</div>
      {ships.map(([cc, n], i) => (
        <div key={i} style={{ position: "absolute", left: 260 + i * 230, top: 232 }}>
          <svg width={180} height={80}><path d="M0,40 L180,40 L160,72 L18,72 Z" fill="#e8e1cc" stroke="#222" strokeWidth={3} /><rect x={60} y={14} width={44} height={26} fill="#c9b98f" stroke="#222" strokeWidth={3} />{[0, 1, 2, 3].map((j) => <circle key={j} cx={30 + j * 40} cy={54} r={5} fill="#ffd23a" style={{ filter: "drop-shadow(0 0 6px #ffd23a)" }} />)}</svg>
          <div style={{ position: "absolute", left: 120, top: -54 }}><Flag f={f} t={t} cc={cc} x={0} y={0} t0={t0 + 0.2 + i * 0.1} t1={t1} w={64} /></div>
          {n && <div style={{ position: "absolute", left: 0, top: 86, fontFamily: HAND, fontSize: 30, color: "#fff", whiteSpace: "nowrap" }}>{n}</div>}
        </div>
      ))}
      {/* HMS Newport: luces apagadas, se cuela adelante */}
      <div style={{ position: "absolute", left: interpolate(k, [0, 1], [W - 120, 40]), top: interpolate(k, [0, 0.25, 0.8, 1], [360, 300, 300, 236]) }}>
        <svg width={150} height={70}><path d="M0,34 L150,34 L134,62 L14,62 Z" fill="#2a2f3a" stroke="#000" strokeWidth={3} /><rect x={50} y={12} width={36} height={22} fill="#3a404c" stroke="#000" strokeWidth={3} /></svg>
        <div style={{ position: "absolute", left: 90, top: -48 }}><Flag f={f} t={t} cc="gb" x={0} y={0} t0={t0 + 0.3} t1={t1} w={56} /></div>
        <div style={{ position: "absolute", left: -10, top: -100, fontFamily: HAND, fontSize: 32, color: "#ff8a80", whiteSpace: "nowrap" }}>HMS Newport · lights off</div>
      </div>
    </div>
  );
};
// el viaje a la India casi a la mitad
const HalfBar: React.FC<{ f: number; t: number; t0: number; t1: number }> = ({ f, t, t0, t1 }) => {
  if (!vis(t, t0, t1)) return null;
  const s = pop(f, t0, 12) * fadeOut(t, t1);
  const k = ramp(t, t0 + 0.8, t0 + 2.0, Easing.inOut(Easing.cubic));
  return (
    <div style={{ position: "absolute", left: 960, top: 880, width: 1100, height: 210, transform: `translate(-50%,-50%) scale(${s}) rotate(-1deg)`, background: "linear-gradient(#fbf6e6,#efe4c4)", border: "4px solid #fff", borderRadius: 8, boxShadow: "0 16px 36px rgba(0,0,0,.45)" }}>
      <div style={{ position: "absolute", left: 30, top: 16, fontFamily: SANS, fontWeight: 900, fontSize: 26, color: "#26314a" }}>BRITAIN → INDIA, BY SEA</div>
      <div style={{ position: "absolute", left: 30, top: 70, width: 900, height: 44, background: "#d9c9a3", borderRadius: 6 }} />
      <div style={{ position: "absolute", left: 30, top: 70, width: 900 * (1 - 0.45 * k), height: 44, background: k > 0.5 ? "#2f6fb8" : "#d4241c", borderRadius: 6 }} />
      <div style={{ position: "absolute", left: 30, top: 130, fontFamily: HAND, fontSize: 44, color: "#26314a" }}>{k < 0.5 ? "around Africa" : "through Suez: almost half"}</div>
    </div>
  );
};

export const Ch9: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  const c = camAt(KEYS, t);
  const sceneOn = (t > 589.3 && t < 605.4) || (t > 609.1 && t < 614.6) || (t > 618.6 && t < 627.5) || (t > 634.0 && t < 646.6) || (t > 655.0 && t < 662.6) || (t > 663.6);
  const ps = proj(c, PL.portSaid[0], PL.portSaid[1]);
  const night = interpolate(t, [605.2, 606.0, 614.3, 614.8], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: "#e6d8b6", overflow: "hidden" }}>
      <MapView keys={KEYS} t={t} hidden={sceneOn}>
        {(c) => (
          <>
            <Tag c={c} f={f} t={t} lon={PL.portSaid[0]} lat={PL.portSaid[1]} t0={584.4} t1={589.2} text="Port Said" size={34} dot dy={-44} />
            <Route c={c} t={t} f={f} pts={SUEZ_ROUTE} t0={629.0} t1={632.3} out={634.0} color="#fff" w={8} ship shipSize={80} glow="#8fd0ff" />
            <Tag c={c} f={f} t={t} lon={72.8} lat={19} t0={631.0} t1={634.0} text="India" size={30} dot dy={-40} />
            <Route c={c} t={t} f={f} pts={SHARES} t0={647.9} t1={650.0} out={651.2} color="#1d6b3a" w={7} dash />
            <Tag c={c} f={f} t={t} lon={31.24} lat={30.04} t0={646.9} t1={649.0} text="Egypt's shares · 44%" size={34} bg="#1d6b3a" dy={-44} />
            <Flag c={c} f={f} t={t} cc="gb" lon={-0.1} lat={51.5} t0={649.6} t1={655.0} w={110} dy={-70} />
            <Tag c={c} f={f} t={t} lon={-0.1} lat={51.5} t0={649.9} t1={655.0} text="Britain" size={34} dot dy={30} />
            <Flag c={c} f={f} t={t} cc="gb" lon={31.5} lat={31.2} t0={663.5} t1={664.4} w={110} dy={-60} />
          </>
        )}
      </MapView>
      {night > 0 && <AbsoluteFill style={{ background: "#0a1030", opacity: night * 0.6, pointerEvents: "none" }} />}
      <YearNote f={f} t={t} marks={[[584.2, "17 Nov 1869"], [638.5, "1870s"], [644.7, "1875"], [662.8, "1882"]]} />
      <BigWord f={f} t={t} t0={585.0} t1={587.2} text={<span>17 NOVEMBER <span style={{ color: "#ffd23a" }}>1869</span></span>} y={220} size={110} />
      <Stamp f={f} t={t} t0={587.3} t1={589.2} x={960} y={720} text="Open" size={150} rot={-6} color="#1d6b3a" />

      {/* la fiesta del siglo y la procesión de Eugenia */}
      <ScenePortal t={t} open={[588.8, 589.3]} close={[605.0, 605.5]} o={ps} cpt={ps}>
        <Chain t={t} f={f} end={605.5} shots={[
          [588.8, (t) => <AnimeScene t={t} f={f} t0={588.8} t1={591.4} bg="bg_fireworks" z0={1.02} z1={1.1} px={-40} chars={[]} />],
          [591.25, (t) => <AnimeScene t={t} f={f} t0={591.2} t1={595.6} bg="bg_opera" z0={1.03} z1={1.12} px={50} chars={[]} />, "whip"],
          [595.35, (t) => <AnimeScene t={t} f={f} t0={595.3} t1={597.6} bg="bg_sphinx" z0={1.02} z1={1.1} px={-50} chars={[]} />, "whipL"],
          [597.35, (t) => <AnimeScene t={t} f={f} t0={597.3} t1={605.5} bg="bg_procession" z0={1.02} z1={1.14} px={60} chars={[{ src: "ch_eugenie", x: 1500, bottom: 0, h: 900, tIn: 597.5, from: 160 }]} />, "flash"],
        ]} />
      </ScenePortal>
      <BigWord f={f} t={t} t0={589.4} t1={591.2} text="THE PARTY OF THE CENTURY" y={220} size={96} />
      {[["a palace for his guests", 591.6], ["a new opera house in Cairo", 593.4], ["a road to the pyramids", 595.4]].map(([s, t0], i) => (
        <Note key={i} f={f} t={t} t0={t0 as number} t1={597.2} x={420} y={260 + i * 150} w={520} rot={-3 + i * 2} size={44}>✓ {s}</Note>
      ))}
      <Caption f={f} t={t} t0={597.6} t1={601.2} x={1500} y={1010} text="Empress Eugénie" flag="fr" />
      <Photo f={f} t={t} t0={600.0} t1={605.0} src="suez/pd/aigle.jpg" x={520} y={430} w={620} h={400} rot={-3} caption="L'Aigle at Port Said · 1869 · real photo" />
      {[["princes", 602.8], ["emperors", 603.7], ["journalists", 604.2]].map(([s, t0], i) => (
        <Note key={i} f={f} t={t} t0={t0 as number} t1={605.0} x={1460 - i * 40} y={220 + i * 120} w={340} rot={3 - i * 2} size={44}>{s}</Note>
      ))}

      {/* la noche anterior: el HMS Newport */}
      <BigWord f={f} t={t} t0={605.4} t1={608.6} text={<span>BUT THE NIGHT BEFORE<span style={{ color: "#ffd23a" }}>…</span></span>} y={230} size={100} />
      <ScenePortal t={t} open={[608.6, 609.1]} close={[614.3, 614.8]} o={ps} cpt={ps}>
        <AnimeScene t={t} f={f} t0={608.6} t1={614.8} bg="bg_newport_night" z0={1.04} z1={1.16} px={-80} chars={[]} />
      </ScenePortal>
      <Caption f={f} t={t} t0={609.4} t1={614.0} x={960} y={1010} text="HMS Newport" flag="gb" />
      <Note f={f} t={t} t0={612.7} t1={614.2} x={1460} y={260} w={380} rot={3} size={48}>total darkness</Note>
      <Queue f={f} t={t} t0={615.0} t1={618.5} />

      {/* a la mañana: un barco británico adelante de la emperatriz */}
      <ScenePortal t={t} open={[618.6, 619.1]} close={[627.0, 627.5]} o={ps} cpt={ps}>
        <AnimeScene t={t} f={f} t0={618.6} t1={627.5} bg="bg_morning_shock" z0={1.03} z1={1.15} px={60} chars={[]} />
      </ScenePortal>
      <BigWord f={f} t={t} t0={619.4} t1={622.2} text={<span>A <span style={{ color: "#ff6a5c" }}>BRITISH</span> SHIP<br />AHEAD OF THEIR EMPRESS</span>} y={250} size={86} />
      {vis(t, 622.4, 627.4) && <AbsoluteFill style={{ background: "#1a1208", opacity: 0.35 * ramp(t, 622.4, 622.8) * fadeOut(t, 627.4), pointerEvents: "none" }} />}
      <Stamp f={f} t={t} t0={623.5} t1={627.3} x={760} y={480} text="Reprimanded" size={110} />
      <Note f={f} t={t} t0={626.0} t1={627.3} x={1420} y={720} w={420} rot={4} size={50}>privately:<br /><b style={{ color: "#1d6b3a" }}>thanked</b></Note>

      {/* funciona */}
      <BigWord f={f} t={t} t0={627.7} t1={629.0} text={<span>IT <span style={{ color: "#7be08f" }}>WORKED</span></span>} y={170} size={130} />
      <Note f={f} t={t} t0={629.1} t1={631.8} x={1500} y={300} w={380} rot={3} size={50}>100 miles<br />of water</Note>
      <HalfBar f={f} t={t} t0={630.6} t1={633.6} />

      {/* los barcos vienen… y Egipto se hunde en deudas */}
      <ScenePortal t={t} open={[633.9, 634.4]} close={[646.2, 646.7]} o={[960, 540]} cpt={proj(c, 32.3, 30.6)}>
        <Chain t={t} f={f} end={646.7} shots={[
          [633.9, (t) => <AnimeScene t={t} f={f} t0={633.9} t1={639.7} bg="bg_steamers" z0={1.02} z1={1.14} px={-60} chars={[]} />],
          [639.5, (t) => <AnimeScene t={t} f={f} t0={639.5} t1={646.7} bg="bg_debt" z0={1.03} z1={1.16} px={50} py={-20} chars={[]} />, "ink"],
        ]} />
      </ScenePortal>
      <BigWord f={f} t={t} t0={633.9} t1={635.9} text="THE SHIPS CAME" y={220} size={110} />
      <Note f={f} t={t} t0={636.1} t1={639.3} x={1440} y={760} w={480} rot={3} size={48}>who paid ≠<br /><b>who profited</b></Note>
      <Caption f={f} t={t} t0={639.8} t1={643.6} x={960} y={1010} text="Khedive Ismail" flag="eg" />
      <BigWord f={f} t={t} t0={643.4} t1={646.2} text={<span style={{ color: "#ff6a5c" }}>DEBT</span>} y={180} size={170} />
      <Stamp f={f} t={t} t0={646.3} t1={647.6} x={960} y={360} text="Desperate" size={120} />
      <BigWord f={f} t={t} t0={649.9} t1={651.0} text="THE BUYER: BRITAIN" y={940} size={90} />

      {/* Disraeli y el préstamo de Rothschild */}
      <Photo f={f} t={t} t0={651.1} t1={655.3} src="suez/pd/disraeli.jpg" x={1420} y={500} w={420} h={540} rot={4} pos="50% 25%" />
      <Caption f={f} t={t} t0={651.3} t1={655.0} x={1420} y={830} text="PM Benjamin Disraeli" flag="gb" />
      <Note f={f} t={t} t0={652.8} t1={655.0} x={520} y={680} w={460} rot={-3} size={48}>Parliament?<br /><b>didn't wait</b></Note>
      <ScenePortal t={t} open={[655.0, 655.5]} close={[662.5, 663.0]} o={[1420, 500]} cpt={[960, 540]}>
        <AnimeScene t={t} f={f} t0={655.0} t1={663.0} bg="bg_rothschild" z0={1.03} z1={1.15} px={-40} chars={[]} />
      </ScenePortal>
      <Note f={f} t={t} t0={655.5} t1={659.0} x={960} y={260} w={560} rot={-2} size={52}>borrowed <b style={{ fontSize: 80 }}>£<Count t={t} t0={655.5} t1={656.4} from={0} to={4000000} /></b></Note>
      <Caption f={f} t={t} t0={656.9} t1={659.0} x={960} y={1010} text="from the Rothschild bank" />
      <Note f={f} t={t} t0={658.3} t1={662.4} x={1480} y={760} w={380} rot={4} size={48}>over a<br /><b>weekend</b></Note>
      <BigWord f={f} t={t} t0={659.6} t1={662.5} text={<span>THE CANAL BRITAIN SWORE<br /><span style={{ color: "#ff6a5c" }}>WOULD NEVER EXIST</span></span>} y={250} size={80} />

      {/* 1882: las tropas británicas, 70 años */}
      <ScenePortal t={t} open={[663.6, 664.1]} close={[669.3, 669.4]} o={proj(c, 31.5, 31.2)} cpt={[960, 540]}>
        <AnimeScene t={t} f={f} t0={663.6} t1={670.5} bg="bg_redcoats" z0={1.03} z1={1.14} px={60} chars={[]} />
      </ScenePortal>
      <BigWord f={f} t={t} t0={664.0} t1={666.6} text={<span>BRITISH TROOPS · <span style={{ color: "#ffd23a" }}>1882</span></span>} y={220} size={100} />
      {vis(t, 666.7, 669.3) && (() => {
        const s = pop(f, 666.7, 12) * fadeOut(t, 669.3); const k = ramp(t, 667.0, 668.2, Easing.linear);
        return <div style={{ position: "absolute", left: 960, top: 900, width: 1200, height: 170, transform: `translate(-50%,-50%) scale(${s})`, background: "linear-gradient(#fbf6e6,#efe4c4)", border: "4px solid #fff", borderRadius: 8, boxShadow: "0 16px 36px rgba(0,0,0,.45)" }}>
          <div style={{ position: "absolute", left: 40, top: 30, width: 1120 * k, height: 40, background: "#c8102e", borderRadius: 6 }} />
          <div style={{ position: "absolute", left: 40, top: 86, fontFamily: HAND, fontSize: 46, color: "#26314a" }}>1882</div>
          <div style={{ position: "absolute", right: 40, top: 86, fontFamily: HAND, fontSize: 46, color: "#26314a", opacity: k }}>1956</div>
          <div style={{ position: "absolute", left: 560, top: 80, fontFamily: SANS, fontWeight: 900, fontSize: 48, color: "#b3261e" }}><Count t={t} t0={667.0} t1={668.2} from={0} to={70} /> YEARS</div>
        </div>;
      })()}
      <Vignette />
    </AbsoluteFill>
  );
};

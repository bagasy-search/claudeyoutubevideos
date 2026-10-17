// Cap. 4 (193,3–256,9): Vasco da Gama da la vuelta, mueren las rutas de Egipto y Venecia, nadie cava;
// Napoleón desembarca, busca el canal viejo, y Le Père vuelve con el número: el Mar Rojo 30 pies más alto.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { FPS, Key, MapView, Tag, BigWord, Stamp, Note, ScenePortal, Chain, Dust, Vignette, YearNote, Caption, Route, Flag, Bubble, proj, ramp, fadeOut, vis, camAt, pop, HAND, SANS } from "./kit";
import { PL, GAMA, SPICE_OLD, NAPOLEON } from "./geo";
import { AnimeScene } from "./anime";

export const CH4: [number, number] = [193.3, 256.9];
const KEYS: Key[] = [
  [193.3, 32.3, 30.5, 8.0],
  [195.2, 25, 8, 0.52],     // "it got worse"
  [197.2, 22, 4, 0.5],
  [200.9, 40, 2, 0.5],      // la vuelta de Gama
  [204.5, 42, 25, 0.78],    // las rutas de especias mueren
  [207.9, 38, 28, 0.9],
  [214.8, 18, 37, 1.5],     // 1798
  [218.3, 25, 34, 1.75],
  [223.7, 45, 24, 0.85],    // Napoleón quiere la India
  [229.4, 50, 22, 0.8],
  [230.4, 32.3, 30.5, 4.0],
  [256.9, 32.3, 30.5, 5.0],
];
const INDIA_ARROW: [number, number][] = [[29.9, 31.2], [36, 26], [45, 18], [56, 15], [66, 17.5], [72.6, 19]];
const FR_INDIA: [number, number][] = [[5.9, 43.0], [12, 37.5], [22, 34], [29, 32.5], [32.3, 31.3], [32.42, 30.3], [32.56, 29.9], [36, 25], [41.6, 15.6], [43.4, 12.6], [52, 13.5], [62, 16.5], [72.6, 19]];

// corte de los dos mares según Le Père (el error)
const SeaCard: React.FC<{ f: number; t: number; t0: number; t1: number }> = ({ f, t, t0, t1 }) => {
  if (!vis(t, t0, t1)) return null;
  const s = pop(f, t0, 13) * fadeOut(t, t1, 0.35);
  const rise = ramp(t, 245.0, 246.4, Easing.out(Easing.back(1.4)));
  const lift = 130 * rise;
  const base = 250, BW = 330;
  const handW = ramp(t, 246.4, 247.4, Easing.linear);
  return (
    <div style={{ position: "absolute", left: 960, top: 560, width: 1100, height: 560, transform: `translate(-50%,-50%) scale(${s}) rotate(-1deg)`, border: "4px solid #fff", borderRadius: 8, boxShadow: "0 18px 40px rgba(0,0,0,.45)",
      backgroundImage: "repeating-linear-gradient(transparent 0 38px, rgba(80,110,160,.18) 38px 39px), linear-gradient(#fbf6e6,#efe4c4)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 40, top: 22, fontFamily: SANS, fontWeight: 900, fontSize: 30, color: "#26314a", letterSpacing: 1 }}>LE PÈRE'S SURVEY · 1799</div>
      <div style={{ position: "absolute", left: 40 + BW, top: base - 60, width: 1100 - 80 - 2 * BW, height: 400, background: "#c9a66b", borderTop: "5px solid #8a6a3a" }} />
      <div style={{ position: "absolute", left: 40, top: base, width: BW, height: 400, background: "linear-gradient(#5a9bd6,#2f6fb8)", borderTop: "5px solid #dff0ff" }} />
      <div style={{ position: "absolute", left: 40 + BW / 2, top: base + 120, transform: "translateX(-50%)", fontFamily: SANS, fontWeight: 900, fontSize: 30, color: "#fff", whiteSpace: "nowrap" }}>MEDITERRANEAN</div>
      <div style={{ position: "absolute", left: 1100 - 40 - BW, top: base - lift, width: BW, height: 400 + lift, background: "linear-gradient(#5a9bd6,#2f6fb8)", borderTop: "5px solid #dff0ff" }} />
      <div style={{ position: "absolute", left: 1100 - 40 - BW / 2, top: base + 120, transform: "translateX(-50%)", fontFamily: SANS, fontWeight: 900, fontSize: 30, color: "#fff", whiteSpace: "nowrap" }}>RED SEA</div>
      <svg width={1100} height={560} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs><marker id="ar4" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#fff" /></marker></defs>
        <line x1={40} y1={base} x2={1060} y2={base} stroke="#26314a" strokeWidth={3} strokeDasharray="12 9" opacity={0.75} />
        {rise > 0.05 && <line x1={895} y1={base - 4} x2={895} y2={base - lift + 16} stroke="#fff" strokeWidth={5} markerEnd="url(#ar4)" />}
      </svg>
      <div style={{ position: "absolute", left: 895, top: base - lift - 92, transform: "translateX(-50%)", fontFamily: HAND, fontSize: 64, color: "#26314a", clipPath: `inset(0 ${100 - handW * 100}% 0 0)`, whiteSpace: "nowrap" }}>+30 ft higher</div>
    </div>
  );
};

export const Ch4: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  const c = camAt(KEYS, t);
  const sceneOn = (t > 201.4 && t < 204.0) || (t > 209.0 && t < 214.4) || (t > 218.9 && t < 223.3) || (t > 230.9 && t < 256.9);
  const cal = proj(c, PL.calicut[0], PL.calicut[1]);
  const ven = proj(c, PL.venice[0], PL.venice[1]);
  const alx = proj(c, PL.alexandria[0], PL.alexandria[1]);
  const isth = proj(c, 32.3, 30.5);
  const die = ramp(t, 206.6, 207.9);
  return (
    <AbsoluteFill style={{ background: "#e6d8b6", overflow: "hidden" }}>
      <MapView keys={KEYS} t={t} hidden={sceneOn}>
        {(c) => (
          <>
            <Route c={c} t={t} f={f} pts={GAMA} t0={197.7} t1={200.8} out={201.6} color="#046a38" w={7} dash ship shipSize={80} />
            <Flag c={c} f={f} t={t} cc="pt" lon={PL.lisbon[0]} lat={PL.lisbon[1]} t0={198.1} t1={201.6} w={70} dy={-50} />
            <Tag c={c} f={f} t={t} lon={PL.calicut[0]} lat={PL.calicut[1]} t0={200.75} t1={201.6} text="India" size={30} dot dy={-38} />
            {/* las viejas rutas por Egipto y Venecia se apagan */}
            <AbsoluteFill style={{ filter: `grayscale(${die})`, opacity: 1 - die * 0.55 }}>
              <Route c={c} t={t} f={f} pts={SPICE_OLD} t0={204.6} t1={206.4} out={208.8} color="#d99a1e" w={9} glow="#ffd27a" />
            </AbsoluteFill>
            <Tag c={c} f={f} t={t} lon={PL.venice[0]} lat={PL.venice[1]} t0={206.5} t1={208.8} text="Venice" size={28} dot dy={-38} />
            <Tag c={c} f={f} t={t} lon={PL.cairo[0]} lat={PL.cairo[1]} t0={206.0} t1={208.8} text="Egypt" size={28} dot dy={44} />
            {/* 1798 */}
            <Route c={c} t={t} f={f} pts={NAPOLEON} t0={216.6} t1={218.3} out={219.0} color="#24427a" w={8} ship shipSize={90} />
            <Flag c={c} f={f} t={t} cc="fr" lon={PL.toulon[0]} lat={PL.toulon[1]} t0={216.4} t1={219.0} w={70} dy={-50} />
            <Tag c={c} f={f} t={t} lon={PL.alexandria[0]} lat={PL.alexandria[1]} t0={217.8} t1={219.0} text="Alexandria" size={28} dot dy={-38} />
            {/* Egipto, escalón hacia la India británica */}
            <Route c={c} t={t} f={f} pts={INDIA_ARROW} t0={225.6} t1={226.9} out={229.6} color="#d4241c" w={9} dash />
            <Flag c={c} f={f} t={t} cc="gb" lon={78} lat={22} t0={226.6} t1={229.6} w={86} />
            <Route c={c} t={t} f={f} pts={FR_INDIA} t0={227.9} t1={229.4} out={230.6} color="#fff" w={8} glow="#8fd0ff" ship shipSize={80} />
          </>
        )}
      </MapView>
      <YearNote f={f} t={t} marks={[[196.65, "1498"], [208.9, "1500s"], [215.3, "1798"], [235.4, "1799"]]} />
      <BigWord f={f} t={t} t0={195.3} t1={196.6} text={<span>IT GOT <span style={{ color: "#ffd23a" }}>WORSE</span></span>} y={540} size={140} />

      {/* Gama en la India */}
      <ScenePortal t={t} open={[201.0, 201.5]} close={[203.9, 204.4]} o={cal} cpt={cal}>
        <AnimeScene t={t} f={f} t0={201.0} t1={204.4} bg="bg_dagama" z0={1.03} z1={1.12} px={60} chars={[{ src: "ch_vasco", x: 1500, bottom: 10, h: 920, tIn: 201.3, from: 150 }]} sand="#fff" />
      </ScenePortal>
      <Caption f={f} t={t} t0={201.6} t1={204.0} x={1500} y={1010} text="Vasco da Gama" flag="pt" />
      <BigWord f={f} t={t} t0={202.3} t1={204.0} text="THE LONG WAY AROUND" y={170} size={96} />
      <Stamp f={f} t={t} t0={207.0} t1={208.8} x={960} y={700} text="Dying" size={110} />

      {/* Venecia y los otomanos: mucho hablar, nadie cava */}
      <ScenePortal t={t} open={[208.85, 209.35]} close={[214.3, 214.8]} o={ven} cpt={isth}>
        <Chain t={t} f={f} end={214.8} shots={[
          [208.85, (t) => <AnimeScene t={t} f={f} t0={208.8} t1={211.1} bg="bg_venice" z0={1.03} z1={1.11} px={50} chars={[]} />],
          [210.9, (t) => <AnimeScene t={t} f={f} t0={210.8} t1={214.8} bg="bg_ottoman" z0={1.03} z1={1.14} px={-60} chars={[]} />, "whip"],
        ]} />
      </ScenePortal>
      <Caption f={f} t={t} t0={209.3} t1={210.85} x={400} y={1010} text="Venetians" flag="ve" />
      <Caption f={f} t={t} t0={211.2} t1={212.8} x={1500} y={1010} text="Ottomans" flag="ot" />
      <Stamp f={f} t={t} t0={212.9} t1={214.4} x={960} y={500} text="Nobody dug" size={120} />

      {/* 1798: desembarco en Alejandría */}
      <ScenePortal t={t} open={[218.4, 218.9]} close={[223.2, 223.7]} o={alx} cpt={alx}>
        <Chain t={t} f={f} end={223.7} shots={[
          [218.4, (t) => <AnimeScene t={t} f={f} t0={218.4} t1={222.0} bg="bg_alexandria" z0={1.03} z1={1.13} px={70} chars={[]} />],
          [221.8, (t) => <AnimeScene t={t} f={f} t0={221.7} t1={223.7} bg="bg_savants" z0={1.04} z1={1.1} px={-40} chars={[]} />, "whip"],
        ]} />
      </ScenePortal>
      {[["an army", 219.2], ["a fleet", 219.95], ["150+ scientists", 220.75]].map(([s, t0], i) => (
        <Note key={i} f={f} t={t} t0={t0 as number} t1={223.3} x={1500} y={250 + i * 140} w={430} rot={2 - i * 2} size={46}>✓ {s}</Note>
      ))}
      <Bubble f={f} t={t} t0={223.75} t1={229.6} src="suez/gerome.jpg" x={420} y={360} r={230} pos="22% 70%" caption="Napoleon Bonaparte" />
      <Note f={f} t={t} t0={225.0} t1={229.6} x={470} y={800} w={420} rot={-3} size={46}>Egypt = stepping stone<br />to <b style={{ color: "#b3261e" }}>British India</b></Note>

      {/* al desierto, después la tienda de Le Père, el número y la inundación imaginada */}
      <ScenePortal t={t} open={[230.4, 230.9]} close={[256.9, 257.0]} o={isth} cpt={isth}>
        <Chain t={t} f={f} end={257.0} shots={[
          [230.4, (t) => <><AnimeScene t={t} f={f} t0={230.4} t1={235.6} bg="bg_napoleon_ride" z0={1.03} z1={1.14} px={60} chars={[]} /><Dust f={f} op={0.5} /></>],
          [235.45, (t) => <AnimeScene t={t} f={f} t0={235.4} t1={249.8} bg="bg_lepere_desk" z0={1.02} z1={1.15} px={-50} chars={[{ src: "ch_lepere", x: 1280, bottom: 10, h: 960, tIn: 235.7, from: 150 }]} sand="#dfe6ff" />, "whip"],
          [249.6, (t) => <AnimeScene t={t} f={f} t0={249.5} t1={260.6} bg="bg_flood" z0={1.04} z1={1.24} px={-110} py={40} chars={[]} />, "flash"],
        ]} />
      </ScenePortal>
      <BigWord f={f} t={t} t0={232.6} t1={235.2} text="LOOKING FOR THE OLD CANAL" y={170} size={84} />
      <Caption f={f} t={t} t0={236.0} t1={244.3} x={1280} y={1010} text="Jacques-Marie Le Père · chief engineer" flag="fr" />
      <Note f={f} t={t} t0={241.5} t1={244.3} x={480} y={330} w={440} rot={-3} size={50}>project frozen<br /><b style={{ fontSize: 80, color: "#2c7fd0" }}>❄ 50 years</b></Note>
      {vis(t, 244.4, 249.5) && <AbsoluteFill style={{ background: "#1a1208", opacity: 0.4 * ramp(t, 244.4, 244.8) * fadeOut(t, 249.5), pointerEvents: "none" }} />}
      <SeaCard f={f} t={t} t0={244.5} t1={249.5} />
      <BigWord f={f} t={t} t0={251.4} t1={253.4} text="POURING NORTH" y={170} size={110} />
      <BigWord f={f} t={t} t0={253.3} t1={256.7} text={<span>THE NILE DELTA <span style={{ color: "#7fc6ff" }}>DROWNED?</span></span>} y={930} size={96} />
      <Vignette />
    </AbsoluteFill>
  );
};

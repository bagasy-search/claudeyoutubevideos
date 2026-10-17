// Cap. 8 (480,2–584,2): las máquinas (dragas, canaletas, 300 máquinas, carbón británico), la ruta por los lagos,
// el agua llega a Timsah (1862), se inundan los Amargos (1869), los mares se juntan; nacen Port Said e Ismailia.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { FPS, Key, MapView, Tag, BigWord, Stamp, Note, Count, ScenePortal, Chain, Dust, Vignette, YearNote, Caption, Route, FullPhoto, CanalLine, Photo, HandLabel, proj, partial, smooth, dpath, ramp, fadeOut, vis, camAt, pop, rnd, HAND, SANS } from "./kit";
import { PL, MODERN } from "./geo";
import { AnimeScene } from "./anime";

export const CH8: [number, number] = [480.2, 584.2];
const KEYS: Key[] = [
  [480.2, 2.35, 48.86, 3.0],
  [483.0, 32.3, 30.6, 6.5],
  [501.3, 32.3, 30.6, 7.0],
  [505.4, 32.32, 30.6, 7.6],
  [507.6, 15, 41, 0.95],     // carbón desde Gran Bretaña
  [508.5, 16, 41, 0.95],
  [513.5, 32.3, 30.6, 8.5],  // la ruta: un rompecabezas
  [519.8, 32.18, 31.0, 15.0], // Manzala
  [521.1, 32.29, 30.62, 17.0],  // Timsah
  [523.6, 32.36, 30.45, 16.0],  // Amargos
  [527.9, 32.3, 30.65, 12.5],
  [531.5, 32.28, 30.85, 13.0],
  [533.3, 32.36, 30.45, 13.0],
  [547.0, 32.35, 30.6, 8.0],
  [549.9, 32.35, 30.6, 8.0],
  [553.2, 32.3, 31.22, 12.0], // Port Said
  [560.8, 32.3, 31.0, 10.0],
  [562.6, 32.27, 30.6, 12.5], // Ismailia
  [584.2, 32.27, 30.6, 12.5],
];
const LAKES: [string, number, number, number, number, number][] = [ // nombre, lon, lat, rx°, ry°, t0
  ["Lake Manzala", 32.05, 31.2, 0.22, 0.1, 519.9],
  ["Lake Timsah", 32.29, 30.57, 0.045, 0.025, 521.1],
  ["Bitter Lakes", 32.4, 30.32, 0.1, 0.08, 523.7],
];
const COAL: [number, number][] = [[-3.2, 51.4], [-5.5, 49.5], [-10, 44], [-9.5, 38], [-6, 36], [0, 36.8], [7, 37.6], [11.5, 37.3], [16, 35.3], [22, 34], [28, 32.8], [32.3, 31.35]];

// cadena de cangilones animada (diagrama a mano)
const BucketChain: React.FC<{ f: number; t: number; t0: number; t1: number }> = ({ f, t, t0, t1 }) => {
  if (!vis(t, t0, t1)) return null;
  const s = pop(f, t0, 12) * fadeOut(t, t1);
  const N = 14, L = 620;
  return (
    <div style={{ position: "absolute", left: 1450, top: 520, width: 520, height: 560, transform: `translate(-50%,-50%) scale(${s}) rotate(2deg)`, background: "linear-gradient(#fbf6e6,#efe4c4)", border: "4px solid #fff", borderRadius: 8, boxShadow: "0 16px 36px rgba(0,0,0,.45)" }}>
      <div style={{ position: "absolute", left: 24, top: 14, fontFamily: SANS, fontWeight: 900, fontSize: 24, color: "#26314a" }}>ENDLESS CHAIN OF BUCKETS</div>
      <svg width={520} height={560} style={{ position: "absolute", left: 0, top: 0 }}>
        <rect x={0} y={420} width={520} height={140} fill="#5a9bd6" opacity={0.6} />
        <rect x={0} y={500} width={520} height={60} fill="#c9a66b" />
        <g transform="translate(260,290) rotate(-35)">
          <rect x={-L / 2} y={-14} width={L} height={28} rx={14} fill="none" stroke="#333" strokeWidth={6} />
          {Array.from({ length: N }).map((_, i) => {
            const p = ((i / N + f / 240) % 1) * 2;
            const top = p < 1; const x = top ? -L / 2 + p * L : L / 2 - (p - 1) * L;
            const y = top ? -20 : 20;
            return <path key={i} d={`M${x - 16},${y} l32,0 l-6,${top ? -24 : 24} l-20,0 z`} fill={top ? "#8a6a3a" : "#555"} stroke="#222" strokeWidth={3} />;
          })}
        </g>
        <path d="M90,470 q30,-30 60,0" stroke="#fff" strokeWidth={4} fill="none" />
        <text x={260} y={545} textAnchor="middle" fontFamily={HAND} fontSize={34} fill="#3a2a14">bites the bottom ↓</text>
      </svg>
    </div>
  );
};
// "the pace exploded": barras relativas por año (sin cifras inventadas)
const Pace: React.FC<{ f: number; t: number; t0: number; t1: number }> = ({ f, t, t0, t1 }) => {
  if (!vis(t, t0, t1)) return null;
  const s = pop(f, t0, 12) * fadeOut(t, t1);
  const H = [10, 12, 14, 16, 18, 22, 40, 62, 85, 100];
  return (
    <div style={{ position: "absolute", left: 960, top: 560, width: 1000, height: 520, transform: `translate(-50%,-50%) scale(${s}) rotate(-1deg)`, background: "linear-gradient(#fbf6e6,#efe4c4)", border: "4px solid #fff", borderRadius: 8, boxShadow: "0 16px 36px rgba(0,0,0,.45)" }}>
      <div style={{ position: "absolute", left: 30, top: 18, fontFamily: SANS, fontWeight: 900, fontSize: 28, color: "#26314a" }}>SAND MOVED, YEAR BY YEAR (RELATIVE)</div>
      {H.map((h, i) => {
        const k = ramp(t, t0 + 0.1 + i * 0.07, t0 + 0.45 + i * 0.07, Easing.out(Easing.cubic));
        return <div key={i}>
          <div style={{ position: "absolute", left: 60 + i * 90, bottom: 70, width: 60, height: 340 * h / 100 * k, background: i >= 6 ? "#d4241c" : "#c9a66b", border: "2px solid #8a6a3a" }} />
          <div style={{ position: "absolute", left: 50 + i * 90, bottom: 30, width: 80, textAlign: "center", fontFamily: HAND, fontSize: 30, color: "#26314a" }}>{1860 + i}</div>
        </div>;
      })}
    </div>
  );
};

export const Ch8: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  const c = camAt(KEYS, t);
  const sceneOn = (t > 484.3 && t < 501.0) || (t > 510.7 && t < 513.2) || (t > 535.0 && t < 546.8) || (t > 555.2 && t < 560.5) || (t > 565.6);
  const isth = proj(c, 32.3, 30.6);
  const tim = proj(c, 32.29, 30.57);
  const bit = proj(c, 32.4, 30.32);
  return (
    <AbsoluteFill style={{ background: "#e6d8b6", overflow: "hidden" }}>
      <MapView keys={KEYS} t={t} hidden={sceneOn}>
        {(c) => (
          <>
            {/* 300 máquinas a lo largo de la línea */}
            {vis(t, 501.3, 506.2) && <svg width={1920} height={1080} style={{ position: "absolute", opacity: fadeOut(t, 506.2) }}>
              <path d={dpath(smooth(MODERN).map(([lo, la]) => proj(c, lo, la)))} fill="none" stroke="#c9a66b" strokeWidth={14} strokeDasharray="10 8" />
              {Array.from({ length: Math.floor(ramp(t, 502.5, 504.2, Easing.linear) * 120) }).map((_, i) => {
                const p = partial(smooth(MODERN).map(([lo, la]) => proj(c, lo, la)), rnd(i)); const [x, y] = p[p.length - 1];
                return <rect key={i} x={x - 6 + (rnd(i + 3) - 0.5) * 30} y={y - 6} width={12} height={12} fill="#2a2a2a" />;
              })}
            </svg>}
            <Route c={c} t={t} f={f} pts={COAL} t0={505.9} t1={507.6} out={508.6} color="#2a2a2a" w={8} ship shipSize={90} />
            <Tag c={c} f={f} t={t} lon={-3.2} lat={51.5} t0={506.0} t1={508.6} text="British coal" size={28} dot dy={-38} />
            {/* la cadena de lagos */}
            {vis(t, 519.8, 533.2) && <svg width={1920} height={1080} style={{ position: "absolute", opacity: fadeOut(t, 533.2) }}>
              {LAKES.map(([n, lo, la, rx, ry, t0], i) => {
                const [x, y] = proj(c, lo, la); const s = pop(f, t0, 10);
                const wet = i === 1 ? ramp(t, 530.6, 531.4) : 0;
                return <ellipse key={n} cx={x} cy={y} rx={rx * 30 * c.z * s} ry={ry * 30 * c.z * s} fill={wet > 0 ? "#4f9fe0" : i === 2 ? "#f2ead8" : "#7fa36a"} fillOpacity={0.35 + wet * 0.4} stroke="#fff" strokeWidth={5} strokeDasharray={i === 2 && wet === 0 ? "10 8" : undefined} />;
              })}
              {/* escalones: saltos entre lagos */}
              {vis(t, 524.8, 528.0) && [[32.3, 31.24, 32.05, 31.15], [32.15, 31.05, 32.29, 30.6], [32.3, 30.55, 32.4, 30.34], [32.45, 30.22, 32.55, 29.97]].map(([a, b, cc, d], i) => {
                const [x0, y0] = proj(c, a, b), [x1, y1] = proj(c, cc, d); const k = ramp(t, 524.9 + i * 0.4, 525.3 + i * 0.4);
                const mx = (x0 + x1) / 2 + 80, my = (y0 + y1) / 2;
                return <path key={i} d={`M${x0},${y0} Q${mx},${my} ${x0 + (x1 - x0) * k},${y0 + (y1 - y0) * k}`} fill="none" stroke="#d4241c" strokeWidth={6} strokeDasharray="12 8" />;
              })}
            </svg>}
            {/* 1862: el Mediterráneo llega a Timsah */}
            {vis(t, 529.6, 547.0) && <CanalLine c={c} pts={MODERN.slice(0, 5)} k={ramp(t, 529.7, 531.3)} w={Math.max(8, c.z * 0.9)} op={fadeOut(t, 547.0)} />}
            {vis(t, 533.4, 547.0) && <CanalLine c={c} pts={MODERN.slice(4)} k={ramp(t, 533.6, 534.6)} w={Math.max(8, c.z * 0.9)} op={fadeOut(t, 547.0)} />}
            <HandLabel c={c} f={f} t={t} lon={32.55} lat={30.62} t0={547.2} t1={549.8} text="+30 ft?" size={90} rot={-4} color="#b3261e" />
            {vis(t, 547.9, 549.8) && <div style={{ position: "absolute", left: proj(c, 32.55, 30.62)[0] - 140, top: proj(c, 32.55, 30.62)[1] - 6, width: 280 * ramp(t, 547.9, 548.3), height: 10, background: "#26314a", transform: "rotate(-6deg)" }} />}
            <Tag c={c} f={f} t={t} lon={PL.portSaid[0]} lat={PL.portSaid[1]} t0={553.3} t1={555.6} text="Port Said" size={34} dot dy={-44} />
            <Tag c={c} f={f} t={t} lon={PL.ismailia[0]} lat={PL.ismailia[1]} t0={564.4} t1={566.0} text="Ismailia" size={34} dot dy={-44} />
          </>
        )}
      </MapView>
      <YearNote f={f} t={t} marks={[[480.2, "1864"], [501.3, "1869"], [508.6, "1860s"], [528.1, "1862"], [533.6, "1869"], [549.9, "1860s"]]} />
      <Stamp f={f} t={t} t0={480.7} t1={482.1} x={960} y={540} text="Dead?" size={140} />
      <BigWord f={f} t={t} t0={482.8} t1={484.2} text={<span>IT <span style={{ color: "#7be08f" }}>SAVED</span> IT</span>} y={170} size={130} />

      {/* acero: la foto real de una draga, la draga anime, las canaletas */}
      <ScenePortal t={t} open={[483.95, 484.45]} close={[500.9, 501.4]} o={isth} cpt={isth}>
        <Chain t={t} f={f} end={501.4} shots={[
          [483.95, (t) => <FullPhoto t={t} t0={483.9} t1={487.8} src="suez/pd/album/a36.jpg" z0={1.02} z1={1.12} ox={-40} pos="40% 50%" />],
          [487.6, (t) => <AnimeScene t={t} f={f} t0={487.6} t1={497.6} bg="bg_dredger" z0={1.02} z1={1.16} px={-70} chars={[]} />, "flash"],
          [497.45, (t) => <AnimeScene t={t} f={f} t0={497.4} t1={501.4} bg="bg_chute" z0={1.03} z1={1.12} px={60} chars={[]} />, "whip"],
        ]} />
      </ScenePortal>
      <Caption f={f} t={t} t0={484.5} t1={487.5} x={960} y={1010} text="A real dredger · Suez, 1869" />
      <BigWord f={f} t={t} t0={485.9} t1={487.5} text="STEEL" y={170} size={160} color="#cfe3ff" />
      <BigWord f={f} t={t} t0={488.7} t1={490.8} text="MONSTER MACHINES" y={170} size={110} />
      <Note f={f} t={t} t0={491.6} t1={493.2} x={480} y={330} w={420} rot={-3} size={52}>taller than<br /><b>houses</b> 🏠</Note>
      <BucketChain f={f} t={t} t0={493.3} t1={497.3} />
      <BigWord f={f} t={t} t0={498.5} t1={500.8} text={<span>WET SAND, <span style={{ color: "#ffd23a" }}>FAR ONTO THE BANKS</span></span>} y={930} size={80} />
      <Note f={f} t={t} t0={502.5} t1={505.6} x={1480} y={300} w={420} rot={3} size={50}>machines<br /><b style={{ fontSize: 96 }}>≈<Count t={t} t0={502.6} t1={504.2} from={0} to={300} /></b></Note>
      <Pace f={f} t={t} t0={508.6} t1={510.6} />
      <BigWord f={f} t={t} t0={509.0} t1={510.6} text="THE PACE EXPLODED" y={150} size={90} />

      {/* foto real del corte de El Guisr */}
      <ScenePortal t={t} open={[510.35, 510.85]} close={[513.1, 513.6]} o={isth} cpt={isth}>
        <FullPhoto t={t} t0={510.3} t1={513.6} src="suez/pd/album/a17.jpg" z0={1.36} z1={1.44} ox={-380} />
      </ScenePortal>
      <Caption f={f} t={t} t0={510.9} t1={513.2} x={960} y={1010} text="The cutting, 1869 · real photo" />
      <BigWord f={f} t={t} t0={514.0} t1={515.5} text="A PUZZLE" y={170} size={120} />
      <Tag c={c} f={f} t={t} lon={32.05} lat={31.2} t0={520.0} t1={533.0} text="Lake Manzala" size={28} bg="#4c6b3a" />
      <Tag c={c} f={f} t={t} lon={32.29} lat={30.57} t0={521.2} t1={533.0} text="Lake Timsah" size={28} bg="#2f6fb8" dx={150} />
      <Tag c={c} f={f} t={t} lon={32.4} lat={30.32} t0={523.8} t1={533.0} text="Bitter Lakes (dry)" size={28} bg="#9c6a1c" dx={190} />
      <Note f={f} t={t} t0={531.3} t1={533.2} x={480} y={830} w={380} rot={-3} size={48}>halfway across ✓</Note>

      {/* 1869: el mar entra a los Amargos, los mares se juntan */}
      <ScenePortal t={t} open={[534.75, 535.25]} close={[546.7, 547.2]} o={bit} cpt={isth}>
        <Chain t={t} f={f} end={547.2} shots={[
          [534.75, (t) => <AnimeScene t={t} f={f} t0={534.7} t1={541.2} bg="bg_bitter_flood" z0={1.02} z1={1.18} px={0} py={-50} chars={[]} />],
          [541.0, (t) => <AnimeScene t={t} f={f} t0={540.9} t1={547.2} bg="bg_waters_meet" z0={1.03} z1={1.14} px={50} chars={[]} />, "flash"],
        ]} />
      </ScenePortal>
      <BigWord f={f} t={t} t0={536.6} t1={540.8} text={<span>SEA IN THE DESERT<br /><span style={{ color: "#7fc6ff", fontSize: 70 }}>first time in thousands of years</span></span>} y={200} size={96} />
      <Note f={f} t={t} t0={543.6} t1={546.6} x={480} y={300} w={420} rot={-3} size={50}>explosion? <b style={{ color: "#1d6b3a" }}>none</b></Note>
      <Note f={f} t={t} t0={545.0} t1={546.6} x={1440} y={300} w={460} rot={3} size={50}>delta drowned? <b style={{ color: "#1d6b3a" }}>no</b></Note>
      <Stamp f={f} t={t} t0={548.4} t1={549.8} x={960} y={850} text="Never existed" size={100} />
      <BigWord f={f} t={t} t0={550.7} t1={552.9} text="CITIES OUT OF NOTHING" y={170} size={100} />

      {/* Port Said: el dibujo y la foto real del muelle */}
      <ScenePortal t={t} open={[555.2, 555.7]} close={[560.4, 560.9]} o={proj(c, PL.portSaid[0], PL.portSaid[1])} cpt={proj(c, PL.portSaid[0], PL.portSaid[1])}>
        <AnimeScene t={t} f={f} t0={555.2} t1={560.9} bg="bg_port_said" z0={1.03} z1={1.14} px={60} chars={[]} />
      </ScenePortal>
      <Photo f={f} t={t} t0={557.2} t1={560.5} src="suez/pd/album/a07.jpg" x={560} y={760} w={620} h={240} rot={-3} caption="Quai Eugénie, Port Said · 1869" />
      <Note f={f} t={t} t0={558.3} t1={560.5} x={1460} y={260} w={460} rot={3} size={46}>harbor of giant<br /><b>concrete blocks</b><br />cast on the beach</Note>

      {/* Ismailia y la gente de todas partes */}
      <ScenePortal t={t} open={[565.6, 566.1]} close={[584.2, 584.3]} o={proj(c, PL.ismailia[0], PL.ismailia[1])} cpt={proj(c, PL.ismailia[0], PL.ismailia[1])}>
        <Chain t={t} f={f} end={584.3} shots={[
          [565.6, (t) => <AnimeScene t={t} f={f} t0={565.6} t1={573.2} bg="bg_ismailia" z0={1.02} z1={1.14} px={-60} chars={[]} />],
          [573.05, (t) => <AnimeScene t={t} f={f} t0={573.0} t1={586.0} bg="bg_market" z0={1.03} z1={1.16} px={70} chars={[]} />, "whip"],
        ]} />
      </ScenePortal>
      <Caption f={f} t={t} t0={566.3} t1={572.8} x={960} y={1010} text="Ismailia · a garden town in the desert" />
      {[["Egyptians", 574.6, "#c8102e"], ["Greeks", 575.4, "#0d5eaf"], ["Italians", 576.0, "#008c45"], ["Dalmatians", 576.8, "#7a1f1f"], ["Maltese", 577.7, "#cf142b"], ["Syrians", 578.45, "#1d6b3a"]].map(([n, t0, col], i) => vis(t, t0 as number, 583.9) ? (
        <div key={i} style={{ position: "absolute", left: 230 + (i % 3) * 730, top: 250 + Math.floor(i / 3) * 150 + (i % 3) * 30, transform: `translate(-50%,-50%) scale(${pop(f, t0 as number, 10) * fadeOut(t, 583.9)}) rotate(${i % 2 ? 2 : -2}deg)`, background: col as string, color: "#fff", fontFamily: SANS, fontWeight: 900, fontSize: 36, padding: "8px 18px", borderRadius: 6, border: "3px solid #fff", textTransform: "uppercase", boxShadow: "0 8px 18px rgba(0,0,0,.45)" }}>{n}</div>) : null)}
      <BigWord f={f} t={t} t0={580.0} t1={584.0} text={<span>ONE OF THE MOST <span style={{ color: "#ffd23a" }}>INTERNATIONAL</span><br />PLACES ON EARTH</span>} y={900} size={78} />
      <Vignette />
    </AbsoluteFill>
  );
};

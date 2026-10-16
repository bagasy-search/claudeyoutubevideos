// Capítulo 16 — Tatshenshini-Alsek y Kwäday Dän Ts'ìnchi, el joven que devolvió el hielo
import React from "react";
import { interpolate } from "remotion";
import { Chapter, at, Tag, Pin, Icon, BigWord, Sticker, Portal, PortalSpec, PL, P, pj, pop, vis, win, ramp, fadeOut, clamp, SANS, HAND } from "./lib";

const S = at("let's go north again");
const T = {
  corner: at("very top corner", S), remote: at("really remote", S), nw: at("northwest corner", S), alaska: at("touches alaska", S), yukon: at("the yukon", S), park: at("a park called", S),
  largest: at("largest protected", S), world: at("in the world", S), add: at("add the parks", S), glaciers: at("glaciers", S), fields: at("ice fields", S), clouds: at("disappear into", S), heritage: at("world heritage", S),
  y1999: at("in 1999", S), hunters: at("some hunters", S), melting: at("melting glacier", S), found: at("found something", S), remains: at("remains of", S), young: at("young man", S), ice: at("in the ice", S),
  stick: at("walking stick", S), hat: at("a hat", S), robe: at("fur robe", S), tools: at("some tools", S), sci: at("scientists", S), fn: at("first nations", S), champ: at("the champagne", S),
  name: at("gave him a name", S), kwaday: at("kwades", S), means: at("long ago person", S), hundred: at("couple of hundred", S), careful: at("careful work", S), dna: at("dna tests", S), perm: at("permission", S),
  living: at("living people", S), related: at("related to him", S), think: at("think about that", S), walked: at("walked out", S), centuries: at("centuries ago", S), home: at("never came home", S),
  safe: at("safe and silent", S), warmed: at("climate warmed", S), back: at("give him back", S), hide: at("doesn't just hide", S), keeps: at("keeps them", S), end: at("speaking of the border", S),
};
const KW = PL("tatshenshini");
const poly = (pts: [number, number][]) => "M" + pts.map(([lo, la]) => P(lo, la).map((v) => v.toFixed(1)).join(",")).join("L") + "Z";
const TA: [number, number][] = [[-139.05, 60.0], [-137.5, 60.0], [-136.5, 59.6], [-136.6, 59.2], [-137.4, 58.9], [-138.0, 59.05], [-138.7, 59.4]];
const KL: [number, number][] = [[-141.0, 61.0], [-139.0, 61.3], [-137.6, 60.9], [-137.0, 60.3], [-137.5, 60.0], [-139.05, 60.0], [-139.2, 60.35], [-141.0, 60.3]];
const WS: [number, number][] = [[-145.5, 62.5], [-141.0, 62.4], [-141.0, 60.3], [-139.2, 60.35], [-139.6, 59.9], [-142.5, 59.9], [-145.0, 60.4]];
const GB: [number, number][] = [[-138.7, 59.4], [-137.4, 58.9], [-136.3, 58.8], [-135.7, 58.4], [-136.6, 58.2], [-137.6, 58.6]];
const PARKS: [[number, number][], string, number][] = [[TA, "#2ecc71", 0], [KL, "#27ae60", 1], [WS, "#16a085", 2], [GB, "#1abc9c", 3]];
const CR = { tk: "Photo: Tobias Klenze · CC BY-SA 4.0", r89: "Photo: Random89 · CC BY 3.0" };

const PORTALS: PortalSpec[] = [
  { src: "raw/tatshen_tatshenshini_river_2.jpg", t0: T.remote - 0.1, t1: T.alaska - 0.05, lon: -137.6, lat: 59.7, zoom: [1.0, 1.15], credit: CR.r89, label: "Tatshenshini River" },
  { src: "raw/tatshen_tatshenshini_alsek_0.jpg", t0: T.glaciers - 0.1, t1: T.y1999 - 0.05, lon: KW[0], lat: KW[1], zoom: [1.0, 1.15], credit: CR.tk, label: "Tatshenshini-Alsek" },
  { src: "raw/tatshen_alsek_glacier_2.jpg", t0: T.melting - 0.1, t1: T.remains - 0.05, lon: KW[0], lat: KW[1], zoom: [1.0, 1.12], credit: CR.tk },
  { src: "img/s_kwaday_find.jpg", t0: T.remains - 0.05, t1: T.stick - 0.05, lon: KW[0], lat: KW[1], zoom: [1.0, 1.12], label: "1999" },
  { src: "raw/tatshen_alsek_glacier_0.jpg", t0: T.walked - 0.1, t1: T.warmed - 0.05, lon: KW[0], lat: KW[1], zoom: [1.15, 1.0], credit: CR.tk },
];

const World: Chapter["World"] = ({ t, z }) => {
  const on = win(t, T.park - 0.2, T.y1999, 0.5);
  if (on <= 0) return null;
  return (
    <>
      {PARKS.map(([pts, col, i]) => {
        const k = i === 0 ? ramp(t, T.park, 0.5) : ramp(t, T.add + 0.4 * (i - 1), 0.5);
        const glow = ramp(t, T.largest, 0.6) * (i === 0 ? 1 : ramp(t, T.add + 1.6, 0.5));
        return <path key={i} d={poly(pts)} fill={col} fillOpacity={(0.35 + 0.15 * Math.sin(t * 3 + i)) * k * on} stroke="#fff" strokeWidth={(4 + 3 * glow) / z} strokeOpacity={k * on} strokeLinejoin="round" />;
      })}
    </>
  );
};

// los objetos que estaban con él (dibujados a mano)
const Items: React.FC<{ f: number; t: number }> = ({ f, t }) => {
  if (!vis(t, T.stick - 0.1, T.sci + 0.3)) return null;
  const op = fadeOut(t, T.sci + 0.3);
  const cards: [number, string, React.ReactNode][] = [
    [T.stick, "Walking stick", <path d="M60,10 L60,150 M50,20 Q60,4 70,20" stroke="#8d6e63" strokeWidth={10} strokeLinecap="round" fill="none" />],
    [T.hat, "Woven hat", <g><path d="M15,110 Q60,20 105,110 Z" fill="#c8a165" stroke="#5d4037" strokeWidth={4} />{[0, 1, 2, 3].map((i) => <path key={i} d={`M${30 + i * 5},${95 - i * 18} Q60,${85 - i * 18} ${90 - i * 5},${95 - i * 18}`} stroke="#5d4037" strokeWidth={3} fill="none" />)}<ellipse cx={60} cy={110} rx={52} ry={10} fill="#a1887f" /></g>],
    [T.robe, "Fur robe", <g><path d="M30,20 L90,20 L110,150 L10,150 Z" fill="#795548" stroke="#3e2723" strokeWidth={4} />{Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${18 + i * 9},150 l4,10`} stroke="#3e2723" strokeWidth={3} />)}</g>],
    [T.tools, "Tools", <g><path d="M20,120 L80,40 L92,50 L32,130 Z" fill="#9e9e9e" stroke="#424242" strokeWidth={4} /><rect x={74} y={110} width={30} height={40} rx={6} fill="#6d4c41" /></g>],
  ];
  return (
    <div style={{ zIndex: 20, position: "absolute", left: 960, top: 820, transform: "translate(-50%,-50%)", display: "flex", gap: 30, opacity: op }}>
      {cards.map(([t0, lab, svg], i) => (
        <div key={i} style={{ width: 220, padding: "12px 10px", background: "#f5ecd7", border: "4px solid #3e2723", borderRadius: 14, textAlign: "center", transform: `scale(${pop(f, t0, 11)}) rotate(${(i % 2 ? 3 : -3)}deg)`, boxShadow: "0 10px 24px rgba(0,0,0,.45)" }}>
          <svg width={120} height={165} viewBox="0 0 120 165">{svg}</svg>
          <div style={{ fontFamily: HAND, fontSize: 36, color: "#3e2723" }}>{lab}</div>
        </div>
      ))}
    </div>
  );
};

// ADN → parientes vivos
const Dna: React.FC<{ f: number; t: number }> = ({ f, t }) => {
  if (!vis(t, T.dna - 0.2, T.think)) return null;
  const op = pop(f, T.dna - 0.2, 12) * fadeOut(t, T.think);
  const rel = ramp(t, T.living, 0.8);
  const kin = [[1180, 380], [1330, 300], [1480, 360], [1630, 300], [1760, 400], [1290, 520], [1560, 520], [1720, 560]];
  return (
    <div style={{ zIndex: 20, position: "absolute", inset: 0, opacity: op }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <rect x={140} y={250} width={1720} height={480} rx={26} fill="rgba(12,14,20,.86)" stroke="#fff" strokeWidth={4} />
        {Array.from({ length: 22 }, (_, i) => {
          const y = 300 + i * 19, ph = t * 3 + i * 0.5;
          const a = 380 + 90 * Math.sin(ph), b = 380 - 90 * Math.sin(ph);
          return <g key={i}><line x1={a} y1={y} x2={b} y2={y} stroke="#9aa5b1" strokeWidth={4} /><circle cx={a} cy={y} r={8} fill="#2a9df4" /><circle cx={b} cy={y} r={8} fill="#ff6b5b" /></g>;
        })}
        <circle cx={760} cy={480} r={44} fill="#ffd23a" stroke="#fff" strokeWidth={5} />
        {kin.map(([x, y], i) => {
          const k = Math.min(1, Math.max(0, rel * kin.length - i));
          return <g key={i} opacity={k}><line x1={800} y1={480} x2={800 + (x - 800) * k} y2={480 + (y - 480) * k} stroke="#2ecc71" strokeWidth={5} strokeDasharray="12 8" /><circle cx={x} cy={y} r={30} fill="#2ecc71" stroke="#fff" strokeWidth={4} /></g>;
        })}
      </svg>
      <div style={{ position: "absolute", left: 760, top: 560, transform: "translateX(-50%)", fontFamily: SANS, fontWeight: 900, fontSize: 28, color: "#ffd23a" }}>HIM</div>
      <div style={{ position: "absolute", left: 1460, top: 640, transform: "translateX(-50%)", fontFamily: SANS, fontWeight: 900, fontSize: 32, color: "#2ecc71", opacity: rel }}>LIVING RELATIVES TODAY</div>
      <div style={{ position: "absolute", left: 380, top: 690, transform: "translateX(-50%)", fontFamily: SANS, fontWeight: 900, fontSize: 30, color: "#fff" }}>DNA</div>
    </div>
  );
};

// el clima se calienta: termómetro
const Thermo: React.FC<{ f: number; t: number }> = ({ f, t }) => {
  if (!vis(t, T.warmed - 0.2, T.hide)) return null;
  const k = ramp(t, T.warmed, 1.2);
  return (
    <div style={{ zIndex: 20, position: "absolute", left: 300, top: 560, transform: `translate(-50%,-50%) scale(${pop(f, T.warmed - 0.2, 11) * fadeOut(t, T.hide)})` }}>
      <svg width={140} height={420} viewBox="0 0 140 420">
        <rect x={45} y={20} width={50} height={320} rx={25} fill="#fff" stroke="#111" strokeWidth={6} />
        <rect x={57} y={330 - 290 * (0.25 + 0.7 * k)} width={26} height={290 * (0.25 + 0.7 * k)} fill={k > 0.6 ? "#ff3b30" : "#2a9df4"} />
        <circle cx={70} cy={360} r={50} fill={k > 0.6 ? "#ff3b30" : "#2a9df4"} stroke="#111" strokeWidth={6} />
      </svg>
    </div>
  );
};

const Screen: Chapter["Screen"] = ({ c, f, t }) => {
  const [kx, ky] = pj(c, KW[0], KW[1]);
  const steps = interpolate(t, [T.hunters, T.found + 0.5], [0, 1], clamp);
  return (
    <>
      <Tag c={c} f={f} t={t} lon={-141.0} lat={60.6} dx={-170} t0={T.alaska} t1={T.glaciers} text="ALASKA" size={34} bg="#1565c0" />
      <Tag c={c} f={f} t={t} lon={-136.0} lat={60.9} t0={T.yukon} t1={T.glaciers} text="YUKON" size={34} bg="#c79100" />
      <Tag c={c} f={f} t={t} lon={-134.5} lat={59.0} t0={T.nw} t1={T.glaciers} text="B.C." size={34} bg="#2a7d2e" />
      <Tag c={c} f={f} t={t} lon={-137.9} lat={59.45} t0={T.park + 0.3} t1={T.glaciers} text="Tatshenshini-Alsek" size={32} bg="#111" />
      <Sticker f={f} t={t} t0={T.largest} t1={T.glaciers} x={1450} y={250} size={46}>Part of the largest protected area of its kind</Sticker>
      {[["Kluane", -139.6, 60.8, 0], ["Wrangell–St. Elias", -143.0, 61.4, 1], ["Glacier Bay", -137.0, 58.55, 2]].map(([n, lo, la, i]) => (
        <Tag key={n as string} c={c} f={f} t={t} lon={lo as number} lat={la as number} t0={T.add + 0.4 * (i as number) + 0.2} t1={T.glaciers} text={n as string} size={26} bg="#16a085" />
      ))}
      <Sticker f={f} t={t} t0={T.fields} t1={T.y1999} x={1480} y={230} size={46}>Glaciers · ice fields</Sticker>
      <Sticker f={f} t={t} t0={T.heritage} t1={T.y1999} x={1480} y={340} rot={3} size={46}>UNESCO World Heritage Site</Sticker>

      <BigWord f={f} t={t} t0={T.y1999} t1={T.melting} text={<span style={{ color: "#7fd3ff" }}>1999</span>} y={160} size={150} />
      {vis(t, T.hunters - 0.1, T.melting) && (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: 12 }, (_, i) => {
            const u = i / 11, x = kx + 460 - u * 460, y = ky + 200 - u * 200 + (i % 2 ? 14 : -14);
            return <ellipse key={i} cx={x} cy={y} rx={9} ry={14} fill="#111" opacity={steps > u ? 0.8 : 0} transform={`rotate(70 ${x} ${y})`} />;
          })}
        </svg>
      )}
      <Pin c={c} f={f} t={t} lon={KW[0]} lat={KW[1]} t0={T.hunters} t1={T.melting} label="Hunters" />
      <Icon c={c} f={f} t={t} src="i_glacier" lon={KW[0]} lat={KW[1]} t0={T.found} t1={T.walked} size={150} />
      <Tag c={c} f={f} t={t} lon={KW[0]} lat={KW[1]} dy={95} t0={T.kwaday} t1={T.walked} text="Kwäday Dän Ts'ìnchi" size={30} bg="#111" />
      <Sticker f={f} t={t} t0={T.young} t1={T.stick} x={1450} y={250} size={50}>A young man, preserved in the ice</Sticker>
      <Items f={f} t={t} />
      <Sticker f={f} t={t} t0={T.sci} t1={T.kwaday} x={1450} y={250} size={48}>Scientists 🤝 First Nations</Sticker>
      <Sticker f={f} t={t} t0={T.champ} t1={T.kwaday} x={1450} y={370} rot={3} size={42}>Champagne and Aishihik First Nations</Sticker>
      <BigWord f={f} t={t} t0={T.kwaday} t1={T.hundred} text={<span style={{ color: "#ffd23a" }}>KWÄDAY DÄN TS'ÌNCHI</span>} y={160} size={92} />
      <Sticker f={f} t={t} t0={T.means} t1={T.hundred + 0.6} x={960} y={330} rot={-2} size={58}>“Long ago person found”</Sticker>
      <Sticker f={f} t={t} t0={T.hundred} t1={T.dna} x={1450} y={250} size={50}>A couple of hundred years ago — or more</Sticker>
      <Dna f={f} t={t} />
      <Sticker f={f} t={t} t0={T.perm} t1={T.think} x={1450} y={170} rot={2} size={40}>With the community's permission</Sticker>

      <Sticker f={f} t={t} t0={T.centuries} t1={T.warmed} x={1450} y={250} size={50}>Centuries ago…</Sticker>
      <Sticker f={f} t={t} t0={T.home} t1={T.warmed} x={1450} y={370} rot={3} size={50}>…never came home</Sticker>
      {vis(t, T.safe - 0.2, T.hide) && <div style={{ position: "absolute", inset: 0, background: `rgba(200,235,255,${0.55 * (1 - ramp(t, T.warmed, 1.4)) * win(t, T.safe - 0.2, T.hide, 0.3)})` }} />}
      <Sticker f={f} t={t} t0={T.safe} t1={T.warmed} x={960} y={540} rot={-2} size={64}>Safe and silent 🧊</Sticker>
      <Thermo f={f} t={t} />
      <Sticker f={f} t={t} t0={T.back} t1={T.hide} x={1450} y={300} rot={3} size={56}>…until the ice gave him back</Sticker>
      <BigWord f={f} t={t} t0={T.hide} t1={T.end} text={<span>THE LAND <span style={{ color: "#7fd3ff" }}>KEEPS</span> THINGS</span>} y={160} size={110} />
      {PORTALS.map((p, i) => <Portal key={i} c={c} t={t} f={f} p={p} />)}
    </>
  );
};

export const ch16: Chapter = {
  T0: S, T1: T.end,
  keys: [
    [S + 0.3, -131.0, 57.0, 0.3, 0], [T.corner, -136.5, 59.3, 0.45, 0], [T.nw, -137.0, 59.6, 0.6, 0], [T.alaska, -138.0, 60.0, 0.5, 0], [T.park, -137.8, 59.5, 0.8, 0],
    [T.add, -139.5, 60.2, 0.32, 0], [T.glaciers, -139.5, 60.2, 0.3, 0], [T.y1999, -137.5, 59.6, 1.0, 0], [T.hunters, -137.5, 59.6, 1.6, 0], [T.found, -137.5, 59.6, 1.9, 0],
    [T.sci, -137.5, 59.9, 1.1, 0], [T.think, -137.5, 59.6, 1.5, 0], [T.end, -137.0, 59.4, 0.9, 0],
  ],
  World, Screen,
  full: [1972.119, 1994.819],
  sfx: [
    [T.corner, "wh2", 0.12, 1.4], [T.remote - 0.1, "sw1", 0.12, 1.0], [T.alaska, "pop1", 0.1, 0.4], [T.yukon, "pop2", 0.1, 0.4], [T.park, "pop3", 0.1, 0.4], [T.largest, "st1", 0.1, 0.5],
    [T.add, "tk1", 0.08, 1.4], [T.glaciers - 0.1, "sw4", 0.12, 1.0], [T.y1999, "im1", 0.15, 1.4], [T.melting - 0.1, "sw1", 0.12, 1.0], [T.remains, "im2", 0.14, 1.2],
    [T.stick, "pop1", 0.1, 0.4], [T.hat, "pop2", 0.1, 0.4], [T.robe, "pop3", 0.1, 0.4], [T.tools, "pop4", 0.1, 0.4], [T.kwaday, "im1", 0.12, 1.2], [T.dna, "wh6", 0.1, 1.2],
    [T.living, "tk1", 0.08, 1.0], [T.walked - 0.1, "sw4", 0.12, 1.0], [T.safe, "st2", 0.1, 0.5], [T.hide, "im2", 0.12, 1.2],
  ],
};

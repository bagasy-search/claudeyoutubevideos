// Capítulo 18 — la selva costera y el oso espíritu (Kermode)
import React from "react";
import { interpolate, Img } from "remotion";
import { Chapter, at, Tag, Pin, Icon, BigWord, Sticker, Portal, PortalSpec, PL, P, pj, sf, pop, vis, win, ramp, fadeOut, clamp, SANS } from "./lib";
import { Terrain3D, TEX, TKey } from "./v3_fortune";

const S = at("before we go");
const T = {
  thing: at("one more thing", S), heart: at("heart of what", S), south: at("just south", S), coast: at("along the coast", S), land: at("kind of land", S), anywhere: at("anywhere else", S),
  drop: at("drop straight", S), rain: at("rain forests", S), big: at("so big", S), five: at("five people", S), reach: at("reach around", S), salmon: at("full of salmon", S), walk: at("walk across", S),
  coastal: at("coastal rainforests", S), bear: at("a bear", S), legend: at("a legend", S), black: at("black bear", S), white: at("it's white", S), albino: at("not an albino", S), creamy: at("creamy white", S), gene: at("rare gene", S),
  kermode: at("the kermode", S), spirit: at("the spirit bear", S), indig: at("indigenous people", S), gens: at("countless generations", S), islands: at("a few islands", S), number: at("surprising number", S),
  river: at("standing in a river", S), green: at("green rainforest", S), ghost: at("like a ghost", S), forget: at("don't forget", S), once: at("saw one once", S), plane: at("float plane", S), flash: at("flash of white", S),
  trees: at("into the trees", S), circled: at("circled back", S), three: at("three times", S), never: at("never saw it", S), days: at("some days", S), imagined: at("imagined it", S), didnt: at("i didn't", S), end: at("and i'll leave you", S),
};
const PRI = PL("princess_royal"), GRI = PL("gribbell");
const GBR: [number, number][] = [[-130.4, 54.5], [-129.2, 54.6], [-127.6, 53.8], [-126.6, 52.6], [-126.4, 51.4], [-127.6, 51.2], [-128.6, 52.0], [-129.6, 53.0], [-130.6, 54.0]];
const RIVER: [number, number] = [-128.75, 53.15];
const CR = { cabin: "Photo: RupertRay · CC BY-SA 4.0", salmon: "Photo: Jack Borno · CC BY-SA 3.0" };
const TK: TKey[] = [
  [0, -127.2, 52.2, 0.42, -128.6, 53.1, 0.02],
  [0, -127.9, 52.6, 0.3, -129.0, 53.3, 0.02],
  [0, -128.5, 52.9, 0.22, -129.2, 53.5, 0.02],
];

const PORTALS: PortalSpec[] = [
  { src: "raw/spirit_great_bear_rainforest_2.jpg", t0: T.rain - 0.1, t1: T.five - 0.05, lon: PRI[0], lat: PRI[1], zoom: [1.0, 1.15], credit: CR.cabin, label: "Great Bear Rainforest" },
  { src: "raw/spirit_salmon_spawning_british__0.jpg", t0: T.salmon - 0.1, t1: T.coastal - 0.05, lon: RIVER[0], lat: RIVER[1], zoom: [1.0, 1.15], credit: CR.salmon, label: "Salmon run" },
  { src: "img/s_kermode_bear.jpg", t0: T.river - 0.1, t1: T.once - 0.05, lon: GRI[0], lat: GRI[1], zoom: [1.0, 1.15], label: "Kermode · spirit bear" },
  { src: "img/g_spirit_floatplane.jpg", t0: T.once - 0.05, t1: T.flash - 0.05, lon: RIVER[0], lat: RIVER[1], zoom: [1.0, 1.12] },
];
const poly = (pts: [number, number][]) => "M" + pts.map(([lo, la]) => P(lo, la).map((v) => v.toFixed(1)).join(",")).join("L") + "Z";

const World: Chapter["World"] = ({ t, z }) => {
  const on = win(t, T.coast - 0.2, T.end, 0.5) * (1 - win(t, T.drop - 0.2, T.rain + 0.1, 0.3));
  return on <= 0 ? null : <path d={poly(GBR)} fill="#1b7a3a" fillOpacity={0.3 * on} stroke="#9be7a9" strokeWidth={5 / z} strokeOpacity={on} strokeDasharray={`${18 / z} ${10 / z}`} strokeLinejoin="round" />;
};

// cinco personas de la mano no abrazan el tronco
const Hug: React.FC<{ f: number; t: number }> = ({ f, t }) => {
  if (!vis(t, T.five - 0.1, T.salmon)) return null;
  const op = pop(f, T.five - 0.1, 12) * fadeOut(t, T.salmon);
  const k = ramp(t, T.five + 0.2, 1.4);
  const R = 230;
  return (
    <div style={{ zIndex: 20, position: "absolute", inset: 0, opacity: op }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(10,30,15,.85)" }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <circle cx={960} cy={560} r={R} fill="#6d4c41" stroke="#3e2723" strokeWidth={10} />
        {[0.3, 0.55, 0.8].map((r, i) => <circle key={i} cx={960} cy={560} r={R * r} fill="none" stroke="#8d6e63" strokeWidth={4} />)}
        {Array.from({ length: 5 }, (_, i) => {
          const a = -Math.PI / 2 + (i / 5) * Math.PI * 1.55 * k;
          const x = 960 + (R + 70) * Math.cos(a), y = 560 + (R + 70) * Math.sin(a);
          return (
            <g key={i} transform={`translate(${x},${y})`} opacity={k > i / 6 ? 1 : 0}>
              <circle cx={0} cy={-34} r={18} fill="#ffd23a" stroke="#111" strokeWidth={4} />
              <path d="M0,-16 L0,26 M0,26 L-14,52 M0,26 L14,52 M-26,0 L26,0" stroke="#111" strokeWidth={7} strokeLinecap="round" />
            </g>
          );
        })}
        {k > 0.98 && <path d={`M${960 + (R + 70) * Math.cos(-Math.PI / 2 + Math.PI * 1.55)},${560 + (R + 70) * Math.sin(-Math.PI / 2 + Math.PI * 1.55)} A${R + 70},${R + 70} 0 0 1 960,${560 - R - 70}`} fill="none" stroke="#ff3b30" strokeWidth={8} strokeDasharray="16 12" />}
      </svg>
      <div style={{ position: "absolute", left: 960, top: 940, transform: "translateX(-50%)", fontFamily: SANS, fontWeight: 900, fontSize: 54, color: "#fff", textShadow: "0 4px 0 #111", whiteSpace: "nowrap" }}>5 people can't reach around <span style={{ color: "#ff3b30" }}>✗</span></div>
    </div>
  );
};

// el oso: negro → blanco (no albino)
const BEAR = "M10,70 C10,48 28,36 50,36 L92,34 C100,22 112,16 124,20 C132,14 140,18 138,26 C148,30 152,40 146,48 L132,52 C130,62 122,66 116,66 L112,96 L98,96 L96,72 L58,74 L54,96 L40,96 L38,76 C22,78 10,78 10,70 Z";
const Bear: React.FC<{ f: number; t: number }> = ({ f, t }) => {
  if (!vis(t, T.bear - 0.1, T.indig)) return null;
  const op = pop(f, T.bear - 0.1, 12) * fadeOut(t, T.indig);
  const w = ramp(t, T.white, 0.8);
  const col = `rgb(${Math.round(20 + 225 * w)},${Math.round(20 + 215 * w)},${Math.round(20 + 190 * w)})`;
  const qm = t < T.black ? 1 - ramp(t, T.black - 0.3, 0.3) : 0;
  return (
    <div style={{ zIndex: 20, position: "absolute", left: 960, top: 560, transform: `translate(-50%,-50%) scale(${op})`, textAlign: "center" }}>
      <div style={{ position: "relative", width: 720, height: 500 }}>
        <svg width={720} height={500} viewBox="0 0 160 110" style={{ filter: w > 0.5 ? `drop-shadow(0 0 ${20 * w}px rgba(255,250,220,.9))` : "none" }}>
          <path d={BEAR} fill={col} stroke="#111" strokeWidth={2.5} strokeLinejoin="round" opacity={1 - 0.75 * qm} />
          <circle cx={128} cy={34} r={2.4} fill="#111" />
        </svg>
        {qm > 0 && <div style={{ position: "absolute", left: 360, top: 200, transform: "translate(-50%,-50%)", fontFamily: SANS, fontWeight: 900, fontSize: 200, color: "#fff", textShadow: "0 8px 0 #111", opacity: qm }}>?</div>}
      </div>
    </div>
  );
};

const Screen: Chapter["Screen"] = ({ c, f, t }) => {
  const tk: TKey[] = [[T.drop - 0.1, ...TK[0].slice(1)] as TKey, [T.drop + 1.0, ...TK[1].slice(1)] as TKey, [T.rain, ...TK[2].slice(1)] as TKey];
  // la avioneta que da tres vueltas sobre el río
  const [rx, ry] = pj(c, RIVER[0], RIVER[1]);
  const lap = interpolate(t, [T.circled, T.never + 0.6], [0, 3], clamp);
  const ang = lap * Math.PI * 2 - Math.PI / 2;
  const px = rx + 260 * Math.cos(ang), py = ry + 170 * Math.sin(ang);
  const flash = win(t, T.flash, T.trees + 0.4, 0.15);
  return (
    <>
      <Sticker f={f} t={t} t0={T.heart} t1={T.south} x={1450} y={250} size={50}>The heart of the North</Sticker>
      <Tag c={c} f={f} t={t} lon={-128.0} lat={52.3} t0={T.coast + 0.3} t1={T.drop} text="Great Bear Rainforest" size={34} bg="#1b7a3a" />
      <Sticker f={f} t={t} t0={T.anywhere} t1={T.drop} x={1450} y={250} size={50}>Like nowhere else in Canada</Sticker>
      {vis(t, T.drop - 0.25, T.rain + 0.05) && (
        <Terrain3D name="nbc" t={t} t0={T.drop - 0.1} t1={T.rain} keys={tk} label="Mountains into the sea" font={SANS} tex={TEX}>
          <Sticker f={f} t={t} t0={T.drop + 0.2} t1={T.rain - 0.1} x={1450} y={240} size={56}>Mountains → straight into the sea</Sticker>
        </Terrain3D>
      )}
      <Sticker f={f} t={t} t0={T.big} t1={T.five} x={1450} y={250} size={50}>Trees so big · so old</Sticker>
      <Hug f={f} t={t} />
      <Sticker f={f} t={t} t0={T.walk} t1={T.coastal} x={1450} y={250} size={50}>…you could almost walk across</Sticker>

      <Bear f={f} t={t} />
      <Sticker f={f} t={t} t0={T.legend} t1={T.black} x={1450} y={220} size={52}>A legend?</Sticker>
      <Sticker f={f} t={t} t0={T.black} t1={T.albino} x={1450} y={220} size={52}>A black bear…</Sticker>
      <Sticker f={f} t={t} t0={T.white} t1={T.albino} x={1450} y={340} rot={3} size={62}>…that's WHITE</Sticker>
      <Sticker f={f} t={t} t0={T.albino} t1={T.kermode} x={1450} y={220} size={52}>Not an albino <span style={{ color: "#ff3b30" }}>✗</span></Sticker>
      <Sticker f={f} t={t} t0={T.creamy} t1={T.kermode} x={1450} y={340} rot={3} size={52}>Creamy white coat ✓</Sticker>
      <Sticker f={f} t={t} t0={T.gene} t1={T.kermode} x={1450} y={460} rot={-3} size={52}>🧬 a rare gene</Sticker>
      <BigWord f={f} t={t} t0={T.kermode} t1={T.spirit} text={<span>THE <span style={{ color: "#fff6d5" }}>KERMODE</span> BEAR</span>} y={160} size={110} />
      <BigWord f={f} t={t} t0={T.spirit} t1={T.indig + 0.2} text={<span>THE <span style={{ color: "#fff6d5" }}>SPIRIT</span> BEAR</span>} y={160} size={120} />
      <Sticker f={f} t={t} t0={T.indig} t1={T.islands} x={1450} y={250} size={46}>Coastal First Nations stories</Sticker>
      <Sticker f={f} t={t} t0={T.gens} t1={T.islands} x={1450} y={360} rot={3} size={46}>…for countless generations</Sticker>
      <Pin c={c} f={f} t={t} lon={GRI[0]} lat={GRI[1]} t0={T.islands} t1={T.river} label="Gribbell Island" side="l" />
      <Pin c={c} f={f} t={t} lon={PRI[0]} lat={PRI[1]} t0={T.islands + 0.3} t1={T.river} label="Princess Royal Island" side="l" />
      {[[-128.95, 53.5], [-128.85, 53.35], [-129.1, 53.0], [-128.8, 52.85], [-129.25, 52.75]].map(([lo, la], i) => (
        <Icon key={i} c={c} f={f} t={t} src="i_spirit_bear" lon={lo} lat={la} t0={T.number + i * 0.25} t1={T.river} size={90} />
      ))}
      <Sticker f={f} t={t} t0={T.number} t1={T.river} x={1450} y={250} size={46}>A surprising number are white</Sticker>
      <Sticker f={f} t={t} t0={T.ghost} t1={T.once} x={1450} y={250} size={56}>…like a ghost</Sticker>

      {vis(t, T.flash - 0.1, T.days) && (
        <>
          <div style={{ position: "absolute", left: rx, top: ry, width: 34, height: 34, transform: `translate(-50%,-50%) scale(${1 + 0.6 * flash})`, borderRadius: "50%", background: "#fff", boxShadow: "0 0 40px 18px rgba(255,255,255,.9)", opacity: flash }} />
          <div style={{ position: "absolute", left: rx, top: ry, width: 520, height: 340, transform: "translate(-50%,-50%)", borderRadius: "50%", border: "4px dashed rgba(255,255,255,.6)", opacity: win(t, T.circled - 0.2, T.days, 0.3) }} />
          {t >= T.circled - 0.2 && (
            <div style={{ position: "absolute", left: px, top: py, transform: `translate(-50%,-50%) rotate(${(ang * 180) / Math.PI + 90}deg)`, opacity: win(t, T.circled - 0.2, T.days, 0.3) }}>
              <Img src={sf("icons/i_plane.png")} style={{ width: 190 }} />
            </div>
          )}
        </>
      )}
      <Tag c={c} f={f} t={t} lon={RIVER[0]} lat={RIVER[1]} dy={-60} t0={T.flash} t1={T.trees + 0.8} text="a flash of white" size={28} bg="#111" />
      {[1, 2, 3].map((n) => <Sticker key={n} f={f} t={t} t0={T.circled + (n - 1) * 0.75} t1={T.days} x={1300 + n * 140} y={250} rot={n % 2 ? -4 : 4} size={70}>{n}</Sticker>)}
      <Sticker f={f} t={t} t0={T.never} t1={T.days} x={1450} y={400} rot={3} size={50}>…never saw it again</Sticker>
      <Sticker f={f} t={t} t0={T.imagined} t1={T.end} x={1450} y={250} size={56}>Imagined it?</Sticker>
      <Sticker f={f} t={t} t0={T.didnt} t1={T.end} x={1450} y={380} rot={3} size={60}>No.</Sticker>
      {PORTALS.map((p, i) => <Portal key={i} c={c} t={t} f={f} p={p} />)}
    </>
  );
};

export const ch18: Chapter = {
  T0: S, T1: T.end,
  keys: [
    [S + 0.3, -130.0, 55.0, 0.35, 0], [T.south, -127.0, 56.5, 0.22, 0], [T.coast, -128.2, 52.9, 0.45, 0], [T.anywhere, -128.4, 52.9, 0.6, 0],
    [T.salmon, -128.6, 53.0, 0.8, 0], [T.coastal, -128.7, 53.0, 0.8, 0], [T.islands, -129.0, 53.15, 1.2, 0], [T.number, -129.0, 53.15, 1.5, 0],
    [T.flash, -128.75, 53.15, 2.0, 0], [T.never, -128.75, 53.15, 1.8, 0], [T.end, -128.6, 53.2, 1.0, 0],
  ],
  World, Screen,
  full: [2079.839],
  sfx: [
    [T.thing, "st1", 0.1, 0.5], [T.coast, "wh2", 0.12, 1.4], [T.drop - 0.1, "wh6", 0.12, 1.6], [T.rain - 0.1, "sw1", 0.12, 1.0], [T.five, "pop1", 0.1, 0.4], [T.salmon - 0.1, "sw4", 0.12, 1.0],
    [T.bear, "pop2", 0.1, 0.4], [T.white, "im1", 0.14, 1.4], [T.albino, "st2", 0.1, 0.5], [T.gene, "pop3", 0.1, 0.4], [T.kermode, "im2", 0.14, 1.2], [T.spirit, "im1", 0.12, 1.2],
    [T.number, "tk1", 0.08, 1.2], [T.river - 0.1, "sw4", 0.12, 1.0], [T.once - 0.05, "sw1", 0.12, 1.0], [T.flash, "st1", 0.12, 0.5], [T.circled, "wh2", 0.1, 2.4], [T.didnt, "pop4", 0.1, 0.4],
  ],
};

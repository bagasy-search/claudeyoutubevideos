// Capítulo 12 — el Tratado Nisga'a (2000) y los tótems de 'Ksan
import React from "react";
import { interpolate } from "remotion";
import { Chapter, at, Tag, Pin, Icon, BigWord, Sticker, Note, Line, Dots, Portal, PortalSpec, Num, PL, P, pop, vis, win, ramp, fadeOut, clamp, SANS } from "./lib";

const S = at("and there's something else");
const T = {
  every: at("every canadian should", S), most: at("and most don't", S), long: at("for a very long time", S), recognize: at("recognize that this", S), since: at("since the 1800s", S),
  chiefs: at("their chiefs", S), victoria: at("down to victoria", S), turned: at("turned away", S), gens: at("for generations", S), kept: at("kept at it", S),
  finally: at("and finally", S), y2000: at("year 2000", S), treaty: at("nisga'a treaty came", S), first: at("first modern treaty", S), owner: at("recognized nisga'a ownership", S), km2: at("about 2,000", S),
  govern: at("govern themselves", S), laws: at("their own laws", S), hundred: at("more than a hundred", S), gave: at("never gave up", S),
  east: at("just to the east", S), skeena: at("skeena river", S), keeps: at("keeps this history", S), hazelton: at("town of hazleton", S), rivers: at("two rivers meet", S), gitxsan: at("the gixxin people", S), ksan: at("village called xan", S),
  rebuilt: at("rebuilt the old way", S), longhouses: at("cedar longhouses", S), painted: at("painted on the front", S), poles: at("tall totem poles", S), facing: at("facing the river", S),
  hazeltons: at("the hazeltons", S), great: at("great collections", S), still: at("still in the villages", S),
  stood: at("i've stood in front", S), struck: at("what struck me", S), figure: at("every figure", S), family: at("a family", S), story: at("a story", S), right: at("a right to", S), fishing: at("fishing spot", S),
  deco: at("not decorations", S), deed: at("title deed", S), book: at("history book", S), tree: at("one tree", S), end: at("and that brings me", S),
};
const HAZ = PL("hazelton"), VIC = PL("victoria");
const NL: [number, number][] = [[-129.75, 55.05], [-129.3, 54.95], [-128.75, 55.05], [-128.45, 55.35], [-128.6, 55.65], [-129.05, 55.75], [-129.5, 55.55], [-129.8, 55.3]];
const NLD = "M" + NL.map(([lo, la]) => P(lo, la).map((v) => v.toFixed(1)).join(",")).join("L") + "Z";
const SKEENA: [number, number][] = [[-128.6, 54.5], [-128.1, 54.75], [-127.85, 55.05], HAZ, [-127.4, 55.6], [-127.0, 56.2]];
const BULKLEY: [number, number][] = [HAZ, [-127.3, 55.05], [-127.0, 54.8], [-126.6, 54.6]];
const VILLAGES: [number, number][] = [[-127.65, 55.26], [-128.05, 55.08], [-127.85, 55.4], [-128.25, 55.25], [-127.55, 55.48]];

const PORTALS: PortalSpec[] = [
  { src: "img/s_nisgaa_treaty.jpg", t0: T.treaty - 0.1, t1: T.owner - 0.05, lon: -129.1, lat: 55.3, label: "Nisga'a Treaty · 2000" },
  { src: "img/s_ksan_village.jpg", t0: T.rebuilt - 0.1, t1: T.hazeltons - 0.05, lon: HAZ[0], lat: HAZ[1], label: "'Ksan" },
  { src: "img/g_totems.jpg", t0: T.stood - 0.1, t1: T.end + 0.3, lon: HAZ[0], lat: HAZ[1], zoom: [1.04, 1.2], pan: [-60, 30] },
];

// línea de tiempo: más de un siglo pidiendo
const Timeline: React.FC<{ f: number; t: number }> = ({ f, t }) => {
  if (!vis(t, T.since - 0.2, T.treaty)) return null;
  const s = pop(f, T.since - 0.2, 12) * fadeOut(t, T.treaty);
  const k = interpolate(t, [T.since, T.finally + 1.4], [0, 1], clamp);
  const ticks = [[0.0, ""], [0.1, "1887 · Victoria"], [0.3, ""], [0.5, ""], [0.7, ""], [0.88, ""], [1.0, "2000"]] as [number, string][];
  return (
    <div style={{ zIndex: 20, position: "absolute", left: 160, top: 830, width: 1600, transform: `scale(${s})`, transformOrigin: "50% 50%" }}>
      <div style={{ position: "absolute", top: 30, left: 0, width: 1600, height: 12, background: "rgba(255,255,255,.35)", borderRadius: 6 }} />
      <div style={{ position: "absolute", top: 30, left: 0, width: 1600 * k, height: 12, background: k >= 0.999 ? "#2ecc71" : "#ffd23a", borderRadius: 6 }} />
      {ticks.map(([u, lab], i) => (
        <div key={i} style={{ position: "absolute", left: 1600 * u, top: 16, transform: "translateX(-50%)", opacity: k >= u ? 1 : 0.25, textAlign: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: 20, background: k >= u ? (u === 1 ? "#2ecc71" : "#ffd23a") : "#777", border: "4px solid #fff", margin: "0 auto", transform: `scale(${k >= u ? 1 + 0.25 * Math.max(0, 1 - (k - u) * 20) : 0.7})` }} />
          {lab && <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 30, color: "#fff", textShadow: "0 3px 0 #111", marginTop: 6, whiteSpace: "nowrap" }}>{lab}</div>}
        </div>
      ))}
    </div>
  );
};

const LABELS: [string, keyof typeof T][] = [["A family", "family"], ["A story", "story"], ["A right to land", "right"], ["A fishing spot", "fishing"]];

const World: Chapter["World"] = ({ t, z }) => {
  const on = win(t, T.owner - 0.2, T.east + 0.6, 0.6);
  return <path d={NLD} fill="#8e44ad" fillOpacity={0.35 * on + 0.1 * Math.sin(t * 4) * on} stroke="#fff" strokeWidth={5 / z} strokeOpacity={on} strokeLinejoin="round" />;
};

const Screen: Chapter["Screen"] = ({ c, f, t }) => (
  <>
    <Tag c={c} f={f} t={t} lon={-129.3} lat={55.5} t0={S + 0.3} t1={T.chiefs} text="Nisga'a Nation" size={34} bg="#8e44ad" />
    <Sticker f={f} t={t} t0={T.most} t1={T.recognize} x={1450} y={260} size={56}>Most Canadians don't know</Sticker>
    <Sticker f={f} t={t} t0={T.recognize} t1={T.since} x={1450} y={260} size={56}>“This is our land.”</Sticker>
    <Timeline f={f} t={t} />
    <Pin c={c} f={f} t={t} lon={VIC[0]} lat={VIC[1]} t0={T.victoria} t1={T.finally} label="Victoria" side="l" />
    <Dots c={c} f={f} t={t} pts={[[-129.1, 55.3], [-129.8, 53.5], [-128.5, 51.5], [-125.5, 49.5], VIC]} t0={T.chiefs} t1={T.finally} dur={1.4} color="#ffffff" icon="i_canoe" iconSize={90} />
    <Sticker f={f} t={t} t0={T.turned} t1={T.finally} x={1450} y={260} size={66}>Turned away <span style={{ color: "#ff3b30" }}>✗</span></Sticker>
    <Sticker f={f} t={t} t0={T.kept} t1={T.finally} x={1450} y={400} rot={3} size={56}>…they kept at it</Sticker>
    <BigWord f={f} t={t} t0={T.y2000} t1={T.treaty} text={<span style={{ color: "#2ecc71" }}>2000</span>} y={200} size={170} />
    <Sticker f={f} t={t} t0={T.first} t1={T.owner} x={1450} y={250} size={52}>First modern treaty in B.C.</Sticker>
    <Num f={f} t={t} t0={T.km2} t1={T.govern} x={1460} y={280} value={2000} prefix="~" suffix=" km²" label="Nisga'a land" color="#c39bd3" />
    <Sticker f={f} t={t} t0={T.govern} t1={T.hundred} x={1450} y={260} size={56}>Their own government</Sticker>
    <Sticker f={f} t={t} t0={T.laws} t1={T.hundred} x={1450} y={390} rot={3} size={56}>Their own laws</Sticker>
    <BigWord f={f} t={t} t0={T.gave} t1={T.east} text={<span>100+ YEARS. <span style={{ color: "#2ecc71" }}>NEVER GAVE UP.</span></span>} y={930} size={86} />

    {/* Hazelton y 'Ksan */}
    <Line c={c} f={f} t={t} pts={SKEENA} t0={T.skeena} t1={T.rebuilt} dur={1.4} color="#2a9df4" w={9} />
    <Tag c={c} f={f} t={t} lon={-128.2} lat={54.7} t0={T.skeena + 0.3} t1={T.rebuilt} text="Skeena River" size={28} bg="#1e88e5" />
    <Line c={c} f={f} t={t} pts={BULKLEY} t0={T.rivers} t1={T.rebuilt} dur={0.9} color="#2a9df4" w={9} />
    <Pin c={c} f={f} t={t} lon={HAZ[0]} lat={HAZ[1]} t0={T.hazelton} t1={T.rebuilt} label="Hazelton" />
    <Tag c={c} f={f} t={t} lon={-127.3} lat={55.6} t0={T.gitxsan} t1={T.rebuilt} text="Gitxsan" size={34} bg="#8e44ad" />
    <Tag c={c} f={f} t={t} lon={HAZ[0]} lat={HAZ[1]} dy={70} t0={T.ksan} t1={T.rebuilt} text="'Ksan" size={34} bg="#111" />
    <Sticker f={f} t={t} t0={T.longhouses} t1={T.hazeltons - 0.1} x={1450} y={250} size={52}>Cedar longhouses</Sticker>
    <Sticker f={f} t={t} t0={T.poles} t1={T.hazeltons - 0.1} x={1450} y={370} rot={3} size={52}>Totem poles → the river</Sticker>
    {VILLAGES.map(([lo, la], i) => <Icon key={i} c={c} f={f} t={t} src="i_totem" lon={lo} lat={la} t0={T.great + i * 0.15} t1={T.stood} size={110} />)}
    <Sticker f={f} t={t} t0={T.great} t1={T.stood} x={1450} y={260} size={52}>One of the world's great collections</Sticker>
    <Sticker f={f} t={t} t0={T.still} t1={T.stood} x={1450} y={390} rot={3} size={52}>Still where they were raised</Sticker>
    {LABELS.map(([lab, key], i) => (
      <Sticker key={i} f={f} t={t} t0={T[key]} t1={T.end} x={1500} y={220 + i * 125} rot={i % 2 ? 3 : -3} size={54}>{lab}</Sticker>
    ))}
    <Sticker f={f} t={t} t0={T.deco} t1={T.deed} x={1500} y={760} size={54}>Not decorations</Sticker>
    <BigWord f={f} t={t} t0={T.deed} t1={T.end} text={<span>TITLE DEED + <span style={{ color: "#ffd23a" }}>HISTORY BOOK</span></span>} y={960} size={80} />
    {PORTALS.map((p, i) => <Portal key={i} c={c} t={t} f={f} p={p} />)}
  </>
);

export const ch12: Chapter = {
  T0: S, T1: T.end,
  keys: [
    [S + 0.4, -129.1, 55.3, 1.5, 0], [T.chiefs, -128.0, 53.0, 0.22, 0], [T.turned, -127.5, 52.5, 0.2, 0], [T.finally, -129.0, 55.3, 1.0, 0],
    [T.owner, -129.1, 55.3, 1.5, 0], [T.gave, -129.1, 55.3, 1.4, 0], [T.east, -128.4, 55.2, 1.3, 0], [T.hazelton, -127.7, 55.2, 1.8, 0],
    [T.rebuilt, -127.67, 55.25, 2.2, 0], [T.great, -127.8, 55.3, 1.9, 0], [T.end, -127.8, 55.3, 1.8, 0],
  ],
  World, Screen,
  full: [1402.533, 1483.193],
  sfx: [
    [S + 0.3, "pop1", 0.1, 0.4], [T.most, "st1", 0.11, 0.5], [T.since, "tk1", 0.08, 2.0], [T.chiefs, "wh2", 0.12, 1.4], [T.turned, "st2", 0.13, 0.5], [T.kept, "pop2", 0.1, 0.4],
    [T.y2000, "im1", 0.15, 1.4], [T.treaty - 0.1, "sw4", 0.12, 1.0], [T.first, "pop3", 0.1, 0.4], [T.owner, "wh6", 0.12, 1.4], [T.km2, "tk1", 0.08, 1.0], [T.govern, "pop4", 0.1, 0.4],
    [T.laws, "pop5", 0.1, 0.4], [T.gave, "im2", 0.13, 1.2], [T.east, "wh2", 0.12, 1.2], [T.hazelton, "ck2", 0.1, 0.3], [T.ksan, "pop1", 0.1, 0.4], [T.rebuilt - 0.1, "sw4", 0.12, 1.0],
    [T.great, "tk1", 0.08, 1.0], [T.stood - 0.1, "sw1", 0.12, 1.0], [T.family, "pop2", 0.1, 0.4], [T.story, "pop3", 0.1, 0.4], [T.right, "pop4", 0.1, 0.4], [T.fishing, "pop5", 0.1, 0.4],
    [T.deed, "st1", 0.12, 0.5],
  ],
};

// Capítulo 9 — el Gran Cañón del Stikine y Telegraph Creek
import React from "react";
import { Chapter, at, Tag, Pin, Icon, BigWord, Sticker, Note, Line, Dots, Portal, PortalSpec, PL, vis, ramp, SANS } from "./lib";
import { Terrain3D, TEX, TKey } from "./v3_fortune";

const S = at("from there a long");
const T = {
  gravel: at("gravel road winds", S), remote: at("most remote settlements", S), tc: at("telegraph creek on", S), stikine: at("the stikine river", S), between: at("between here and there", S),
  cuts: at("the river cuts", S), narrow: at("deep and so narrow", S), grand: at("grand canyon of", S), walls: at("the walls rise", S), hundreds: at("hundreds of meters", S), bottom: at("at the bottom", S), small: at("too small for it", S),
  violent: at("so violent", S), hardest: at("hardest stretches", S), handful: at("a handful of", S), paddlers: at("best paddlers", S), everest: at("the everest of", S), human: at("for most of human", S), nobody: at("nobody could travel", S),
  itself: at("telegraph creek itself", S), gold: at("gold rushes", S), steam: at("paddle wheel steamboats", S), coast: at("from the coast in alaska", S), miners: at("miners and supplies", S), far: at("as far as the river", S), grew: at("that's how this", S),
  tahltan: at("the taltan people", S), thousands: at("thousands of years", S), camps: at("fishing camps", S), older: at("older than any", S), old: at("old buildings", S), standing: at("still standing", S), next: at("the next boat", S),
  getting: at("getting there", S), half: at("half the adventure", S), lava: at("lava canyon", S), steep: at("so steep", S), sheer: at("drop-offs so sheer", S), lives: at("rest of their lives", S),
  fellow: at("i know a fellow", S), car: at("rented car", S), jam: at("traffic jam", S), end: at("now if casher", S),
};
const TC = PL("telegraph_creek"), DEASE = PL("dease_lake");
const GC: [number, number] = [-130.5, 57.95];
const WRANGELL: [number, number] = [-132.38, 56.47];
const ROAD: [number, number][] = [DEASE, [-130.35, 58.3], [-130.7, 58.1], [-130.95, 57.97], TC];
const RIVER: [number, number][] = [[-129.9, 57.85], GC, [-130.85, 57.92], TC, [-131.4, 57.6], [-131.8, 57.1], [-132.1, 56.75], WRANGELL];
const C = (n: string, lic: string) => `Photo: ${n} · Wikimedia Commons · ${lic}`;

const PORTALS: PortalSpec[] = [
  { src: "raw/stikine_grand_canyon_of_the_stik_1.jpg", t0: T.bottom - 0.1, t1: T.violent - 0.05, lon: GC[0], lat: GC[1], label: "Stikine River canyon", credit: C("GerthMichael", "CC BY-SA 3.0") },
  { src: "img/g_stikine_edge.jpg", t0: T.violent - 0.05, t1: T.handful - 0.05, lon: GC[0], lat: GC[1] },
  { src: "raw/stikine_telegraph_creek_british__0.jpg", t0: T.grew - 0.1, t1: T.tahltan - 0.05, lon: TC[0], lat: TC[1], label: "Arriving at Telegraph Creek, 1908", credit: "Photo: Agnes Deans Cameron · Wikimedia Commons · CC BY-SA 4.0" },
  { src: "img/g_telegraph_creek.jpg", t0: T.old - 0.1, t1: T.getting - 0.05, lon: TC[0], lat: TC[1] },
];

// barco de rueda que sube el río desde Alaska hasta donde el río lo deja
const STEAM_UP: [number, number][] = RIVER.slice(3).reverse();
const along = (pts: [number, number][], k: number): [number, number] => {
  const n = pts.length - 1, x = Math.min(n - 1e-6, Math.max(0, k * n)), i = Math.floor(x), u = x - i;
  return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * u, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * u];
};

const Screen: Chapter["Screen"] = ({ c, f, t }) => {
  const tk: TKey[] = [[T.cuts - 0.1, -129.75, 57.45, 0.85, -130.5, 57.95, 0.1], [T.grand, -130.1, 57.7, 0.6, -130.6, 57.97, 0.05], [T.hundreds, -130.35, 57.85, 0.45, -130.85, 57.93, 0.02], [T.bottom, -130.45, 57.9, 0.4, -130.9, 57.92, 0.0]];
  const sk = ramp(t, T.steam, T.far - T.steam + 0.6);
  const [slon, slat] = along(STEAM_UP, sk);
  const sk2 = ramp(t, T.next, 2.5);
  const [nlon, nlat] = along(STEAM_UP, 0.75 + 0.25 * sk2);
  return (
    <>
      <Line c={c} f={f} t={t} pts={ROAD} t0={T.gravel} t1={T.cuts} dur={2.0} color="#c8a26a" w={8} icon="i_pickup" iconSize={100} />
      <Pin c={c} f={f} t={t} lon={DEASE[0]} lat={DEASE[1]} t0={T.gravel} t1={T.cuts} label="Dease Lake" />
      <Pin c={c} f={f} t={t} lon={TC[0]} lat={TC[1]} t0={T.tc} t1={T.cuts} label="Telegraph Creek" side="l" color="#ffd23a" size={30} />
      <Sticker f={f} t={t} t0={T.remote} t1={T.cuts} x={1450} y={260} size={56}>One of B.C.'s most remote places</Sticker>
      <Line c={c} f={f} t={t} pts={RIVER} t0={T.stikine} t1={T.cuts} dur={1.6} color="#2a9df4" w={9} />
      <Tag c={c} f={f} t={t} lon={-131.6} lat={57.3} t0={T.stikine + 0.4} t1={T.cuts} text="Stikine River" size={30} bg="#1e88e5" />

      {vis(t, T.cuts - 0.15, T.bottom + 0.05) && (
        <Terrain3D name="nbc" t={t} t0={T.cuts - 0.1} t1={T.bottom} keys={tk} label="Grand Canyon of the Stikine" font={SANS} tex={TEX} />
      )}
      <Sticker f={f} t={t} t0={T.narrow} t1={T.bottom - 0.1} x={1450} y={240} rot={4} size={56}>So deep · so narrow</Sticker>
      <Sticker f={f} t={t} t0={T.hundreds} t1={T.bottom - 0.1} x={470} y={240} rot={-4} size={56}>↕ Hundreds of metres</Sticker>
      <Sticker f={f} t={t} t0={T.small} t1={T.violent - 0.1} x={1450} y={260} size={52}>The whole river → a gap</Sticker>
      <Sticker f={f} t={t} t0={T.hardest} t1={T.handful - 0.1} x={1450} y={260} size={52}>Hardest whitewater on Earth</Sticker>

      <Icon c={c} f={f} t={t} src="i_kayak" lon={GC[0]} lat={GC[1]} t0={T.handful} t1={T.itself} size={150} />
      <Sticker f={f} t={t} t0={T.paddlers} t1={T.everest} x={1450} y={260} size={56}>Only a handful made it</Sticker>
      <BigWord f={f} t={t} t0={T.everest} t1={T.itself} text={<span>THE <span style={{ color: "#7fd3ff" }}>EVEREST</span> OF WHITEWATER</span>} y={930} size={90} />
      <Tag c={c} f={f} t={t} lon={GC[0]} lat={GC[1]} dy={-120} t0={T.nobody} t1={T.itself} text="✗ No way through" size={30} bg="#e3261c" />

      {/* Telegraph Creek y los barcos de rueda */}
      <Note f={f} t={t} t0={T.gold} t1={T.tahltan} text="Late 1800s · gold rush" />
      <Pin c={c} f={f} t={t} lon={TC[0]} lat={TC[1]} t0={T.itself} t1={T.grew} label="Telegraph Creek" side="l" color="#ffd23a" size={30} />
      <Line c={c} f={f} t={t} pts={RIVER.slice(3)} t0={T.itself + 0.3} t1={T.tahltan} dur={1.4} color="#2a9df4" w={9} />
      <Sticker f={f} t={t} t0={T.steam} t1={T.miners - 0.1} x={1450} y={260} size={56}>Paddlewheel steamboats</Sticker>
      <Pin c={c} f={f} t={t} lon={WRANGELL[0]} lat={WRANGELL[1]} t0={T.coast} t1={T.grew} label="Alaska coast" side="l" />
      {vis(t, T.steam, T.grew) && <Icon c={c} f={f} t={t} src="i_sternwheeler" lon={slon} lat={slat} t0={T.steam} t1={T.grew} size={240} />}
      <Sticker f={f} t={t} t0={T.miners} t1={T.grew} x={1450} y={260} size={56}>⛏ Miners · 📦 supplies</Sticker>
      <Tag c={c} f={f} t={t} lon={TC[0]} lat={TC[1]} dy={-110} t0={T.far + 0.6} t1={T.grew} text="End of the line" size={28} bg="#b8860b" />
      <Tag c={c} f={f} t={t} lon={-131.5} lat={58.3} t0={T.tahltan} t1={T.old} text="Tahltan Nation" size={36} bg="#8e44ad" />
      <Sticker f={f} t={t} t0={T.thousands} t1={T.old} x={1450} y={260} size={56}>Thousands of years</Sticker>
      {[[-131.3, 57.82], [-130.95, 57.94], [-131.55, 57.5], [-130.7, 57.95]].map(([lo, la], i) => (
        <Icon key={i} c={c} f={f} t={t} src="i_salmon" lon={lo} lat={la} t0={T.camps + i * 0.15} t1={T.old} size={80} />
      ))}
      <Sticker f={f} t={t} t0={T.older} t1={T.old} x={1450} y={400} rot={3} size={52}>Older than any steamboat</Sticker>
      <Sticker f={f} t={t} t0={T.next} t1={T.getting - 0.1} x={1450} y={260} size={52}>…waiting for the next boat</Sticker>

      {/* el camino de lava */}
      <Line c={c} f={f} t={t} pts={ROAD} t0={T.getting} t1={T.end} dur={1.8} color="#ffd23a" w={8} icon="i_pickup" iconSize={100} />
      <Icon c={c} f={f} t={t} src="i_lava" lon={-130.85} lat={57.98} t0={T.lava} t1={T.end} size={120} />
      <Tag c={c} f={f} t={t} lon={-130.85} lat={57.98} dy={90} t0={T.lava + 0.2} t1={T.end} text="Lava canyon" size={28} bg="#5a2d1c" />
      <Sticker f={f} t={t} t0={T.steep} t1={T.lives + 0.8} x={1450} y={260} size={60}>⚠ Grades up to 20 %</Sticker>
      <Sticker f={f} t={t} t0={T.sheer} t1={T.lives + 0.8} x={1450} y={400} rot={3} size={60}>⚠ Sheer drop-offs</Sticker>
      <BigWord f={f} t={t} t0={T.half} t1={T.lava} text={<span>HALF THE <span style={{ color: "#ffd23a" }}>ADVENTURE</span></span>} y={930} size={100} />
      {PORTALS.map((p, i) => <Portal key={i} c={c} t={t} f={f} p={p} />)}
    </>
  );
};

export const ch09: Chapter = {
  T0: S, T1: T.end,
  keys: [
    [S + 0.6, -130.3, 58.25, 1.4, 0], [T.tc, -130.6, 58.1, 1.3, 0], [T.stikine, -131.0, 57.6, 0.8, 0], [T.cuts, -130.7, 57.9, 1.4, 0],
    [T.violent, -130.6, 57.93, 1.8, 0], [T.handful, -130.55, 57.95, 2.0, 0], [T.itself, -131.0, 57.6, 0.75, 0], [T.far, -131.3, 57.4, 0.7, 0],
    [T.tahltan, -131.1, 57.85, 1.3, 0], [T.older + 1.0, -131.1, 57.85, 1.4, 0], [T.getting, -130.6, 58.15, 1.4, 0], [T.end, -130.8, 58.05, 1.6, 0],
  ],
  Screen,
  full: [1049.986, 1137.206],
  sfx: [
    [S + 0.2, "wh2", 0.12, 1.2], [T.tc, "ck2", 0.1, 0.3], [T.remote, "pop1", 0.1, 0.4], [T.stikine, "wh6", 0.1, 1.2], [T.cuts - 0.1, "wh5", 0.15, 1.6], [T.narrow, "pop2", 0.1, 0.4],
    [T.hundreds, "pop3", 0.1, 0.4], [T.bottom - 0.1, "sw4", 0.12, 1.0], [T.violent - 0.05, "sw1", 0.12, 1.0], [T.hardest, "st1", 0.11, 0.5], [T.handful, "pop4", 0.1, 0.4],
    [T.everest, "im1", 0.14, 1.4], [T.nobody, "st2", 0.12, 0.5], [T.gold, "wh2", 0.1, 1.2], [T.steam, "tk1", 0.08, 2.0], [T.miners, "pop5", 0.1, 0.4], [T.grew - 0.1, "sw4", 0.12, 1.0],
    [T.tahltan, "pop1", 0.11, 0.4], [T.camps, "pop2", 0.1, 0.4], [T.old - 0.1, "sw1", 0.12, 1.0], [T.getting, "wh6", 0.12, 1.4], [T.half, "st1", 0.12, 0.5], [T.lava, "pop3", 0.1, 0.4],
    [T.steep, "st2", 0.11, 0.5], [T.sheer, "st1", 0.11, 0.5],
  ],
};

// Capítulo 4 — las Rocosas del norte: Liard River Hot Springs y el Muskwa-Kechika
import React from "react";
import { Chapter, at, Tag, Pin, Icon, BigWord, Sticker, Note, Line, Dots, Portal, PortalSpec, Num, PL, P, geo, win, ramp, SANS } from "./lib";
import { Terrain3D, TEX, TKey } from "./v3_fortune";
import { ALCAN, Sil } from "./ch01";

const S = at("up the highway past");
const T = {
  nelson: at("past fort nelson", S), rockies: at("into the northern rockies", S), river: at("beside a little river", S), snow: at("land of snow and ice", S),
  hot: at("hot springs", S), liard: at("the liard river", S), steam: at("steaming water", S), bath: at("warm as a bath", S), boreal: at("boreal forest", S),
  winter: at("warm all winter", S), plants: at("the plants around", S), ferns: at("ferns and orchids", S), south: at("much further south", S),
  soldiers: at("soldiers building the highway", S), paradise: at("into paradise", S), tell: at("i can tell you", S), snowHead: at("snow falling on", S), heaven: at("close to heaven", S),
  now: at("now right around there", S), west: at("look west on", S), noRoads: at("almost no roads", S), mk: at("that's the musqua", S), secrets: at("real secrets", S),
  protected: at("protected management area", S), six: at("six million hectares", S), bigger: at("bigger than many", S), inside: at("and inside it", S), towns: at("no towns", S), paved: at("no paved roads", S),
  just: at("just mountains", S), valleys: at("valleys", S), rivers: at("rivers and animals", S), animals: at("and animals", S),
  serengeti: at("the serengeti of", S), roam: at("roam free", S), sheep: at("stone sheep", S), goats: at("mountain goats", S), elk: at("elk", S), moose: at("moose", S),
  caribou: at("caribou", S), wolves: at("wolves", S), grizzly: at("grizzly bears", S), pushed: at("pushed out", S), never: at("never left", S),
  flown: at("i've flown over", S), hour: at("you fly for an hour", S), sign: at("no sign of", S), power: at("no power line", S), cabin: at("no cabin", S), road: at("no road", S + 60),
  river2: at("just a river shining", S), herd: at("a herd of caribou", S), realize: at("you realize that this", S), lucky: at("how lucky we are", S), end: at("now if you keep heading", S),
};
const ll = (n: string) => { const [lon, lat] = PL(n); return { lon, lat }; };
const LIARD = PL("liard");
const MKP: [number, number][] = [[-126.8, 59.95], [-124.0, 59.95], [-122.9, 58.9], [-122.5, 57.6], [-123.4, 56.6], [-124.6, 56.3], [-125.6, 57.1], [-126.5, 58.0], [-127.4, 59.2]];
const MKD = "M" + MKP.map(([lo, la]) => P(lo, la).map((v) => v.toFixed(1)).join(",")).join("L") + "Z";
const C = (n: string, lic: string) => `Photo: ${n} · Wikimedia Commons · ${lic}`;

const PORTALS: PortalSpec[] = [
  { src: "raw/liard_liard_river_hot_springs_0.jpg", t0: T.hot - 0.15, t1: T.boreal + 1.0, lon: LIARD[0], lat: LIARD[1], label: "Liard River Hot Springs", credit: C("Ltengum", "Public domain") },
  { src: "raw/liard_liard_river_hot_springs_1.jpg", t0: T.soldiers - 0.15, t1: T.tell - 0.05, lon: LIARD[0], lat: LIARD[1], label: "1942: “paradise”", credit: C("Elisa Wilke", "CC BY-SA 4.0") },
  { src: "img/g_hotsprings.jpg", t0: T.tell - 0.05, t1: T.now - 0.05, lon: LIARD[0], lat: LIARD[1] },
  { src: "img/s_muskwa_wild.jpg", t0: T.serengeti - 0.15, t1: T.sheep - 0.1, lon: -125, lat: 58.2, maxR: 420 },
  { src: "raw/muskwa_grizzly_bear_british_col_0.jpg", t0: T.grizzly + 0.5, t1: T.never + 0.9, lon: -124.6, lat: 57.4, label: "Grizzly", credit: C("marneejill", "CC BY-SA 2.0") },
  { src: "img/g_lowlevel.jpg", t0: T.flown - 0.1, t1: T.sign - 0.05, lon: -125, lat: 58.4 },
  { src: "raw/muskwa_northern_rocky_mountains_1.jpg", t0: T.sign - 0.05, t1: T.river2 - 0.05, lon: -125, lat: 58.4, label: "Northern Rockies", credit: C("Darren Kirby", "CC BY-SA 2.0") },
  { src: "raw/liard_muncho_lake_2.jpg", t0: T.river2 - 0.05, t1: T.herd - 0.05, ...ll("muncho"), label: "Muncho Lake", credit: C("Ian Mackenzie", "CC BY 2.0") },
];

const World: Chapter["World"] = ({ t, z }) => {
  const on = win(t, T.noRoads - 0.2, T.end + 0.6, 0.6);
  const glow = 0.28 + 0.12 * Math.sin(t * 4) * ramp(t, T.realize, 0.5);
  return (
    <g opacity={on}>
      <path d={MKD} fill="#2ecc71" fillOpacity={glow} stroke="#fff" strokeWidth={5 / z} strokeDasharray={`${16 / z} ${10 / z}`} strokeLinejoin="round" />
      <path d={geo.prov["British Columbia"]} fill="none" stroke="#fff" strokeWidth={2.5 / z} strokeOpacity={0.5 * ramp(t, T.realize, 0.6)} />
    </g>
  );
};

// manada de caribúes que cruza corriendo
const Herd: React.FC<{ c: any; f: number; t: number }> = ({ c, f, t }) => (
  <>
    {[0, 1, 2, 3, 4].map((i) => (
      <Icon key={i} c={c} f={f} t={t} src="i_caribou" lon={-123.6 - (t - T.herd) * 0.5 - i * 0.55} lat={58.35 + ((i * 37) % 5 - 2) * 0.22} t0={T.herd + i * 0.12} t1={T.realize} size={130 + (i % 3) * 18} />
    ))}
  </>
);

const Screen: Chapter["Screen"] = ({ c, f, t }) => {
  const tk: TKey[] = [[T.rockies - 0.1, -123.6, 58.25, 1.05, -125.6, 59.0, 0.2], [T.snow, -124.7, 58.7, 0.7, -126.1, 59.42, 0.1], [T.hot, -125.3, 58.95, 0.55, -126.1, 59.42, 0.05]];
  const A = (src: string, t0: number, lon: number, lat: number, size = 120) => <Icon c={c} f={f} t={t} src={src} lon={lon} lat={lat} t0={t0} t1={T.pushed} size={size} />;
  return (
    <>
      <Line c={c} f={f} t={t} pts={ALCAN.slice(0, 7)} t0={S + 0.1} t1={T.rockies} dur={2.6} color="#ffd23a" w={8} icon="i_pickup" iconSize={100} />
      {PORTALS.map((p, i) => <Portal key={i} c={c} t={t} f={f} p={p} />)}
      <Pin c={c} f={f} t={t} {...ll("fort_nelson")} t0={T.nelson} t1={T.rockies} label="Fort Nelson" />
      {vis3(t) && (
        <Terrain3D name="nbc" t={t} t0={T.rockies - 0.1} t1={T.hot} keys={tk} label="Northern Rockies" font={SANS} tex={TEX}>
          <Sticker f={f} t={t} t0={T.snow} t1={T.hot - 0.1} x={1450} y={240} rot={5} size={66}>❄ snow &amp; ice</Sticker>
        </Terrain3D>
      )}
      <Sticker f={f} t={t} t0={T.bath} t1={T.boreal + 0.9} x={1450} y={250}><span style={{ color: "#ff8a1c" }}>42–52</span> °C</Sticker>
      <Icon c={c} f={f} t={t} src="i_hotspring" lon={LIARD[0]} lat={LIARD[1]} t0={T.boreal + 0.9} t1={T.soldiers} size={230} />
      <Tag c={c} f={f} t={t} lon={LIARD[0]} lat={LIARD[1]} dy={-120} t0={T.winter} t1={T.soldiers} text="Warm all winter" size={28} bg="#ff6a3d" />
      <Tag c={c} f={f} t={t} lon={LIARD[0] - 0.35} lat={LIARD[1] - 0.12} t0={T.ferns} t1={T.soldiers} text="Ferns" size={30} bg="#2a7d2e" />
      <Tag c={c} f={f} t={t} lon={LIARD[0] + 0.35} lat={LIARD[1] - 0.12} t0={T.ferns + 0.55} t1={T.soldiers} text="Orchids" size={30} bg="#8e44ad" />
      <Dots c={c} f={f} t={t} pts={[LIARD, [-125.5, 57.0], [-124.5, 54.5], [-123.5, 51.0]]} t0={T.south} t1={T.soldiers} dur={1.0} color="#ffffff" />
      <Note f={f} t={t} t0={T.soldiers} t1={T.tell} text="1942" />

      <Sticker f={f} t={t} t0={T.west} t1={T.mk + 0.3} x={560} y={300} rot={-4} size={90}>← WEST</Sticker>
      <Pin c={c} f={f} t={t} lon={-125} lat={58.2} t0={T.realize + 0.3} t1={T.end} label="Muskwa-Kechika" color="#2ecc71" size={32} />
      {/* el Muskwa-Kechika */}
      <Tag c={c} f={f} t={t} lon={-124.6} lat={59.4} t0={T.mk} t1={T.bigger} text="Muskwa-Kechika" size={38} bg="#1d6b3a" />
      <BigWord f={f} t={t} t0={T.secrets} t1={T.protected} text={<span>A REAL <span style={{ color: "#2ecc71" }}>SECRET</span></span>} y={940} size={96} />
      <Num f={f} t={t} t0={T.six} t1={T.inside} x={1480} y={280} value={6} prefix="~" suffix=" million ha" label="Protected" color="#2ecc71" />
      <Sil c={c} f={f} t={t} name="Netherlands" lon={-125.45} lat={58.5} t0={T.bigger + 0.2} t1={T.inside + 0.3} color="#ff8a1c" label="Netherlands" />
      {["Netherlands", "Switzerland", "Denmark"].map((n, i) => (
        <Sticker key={n} f={f} t={t} t0={T.bigger + 0.5 + i * 0.4} t1={T.inside + 0.3} x={1480} y={440 + i * 110} rot={i % 2 ? 3 : -3} size={50}>{n} <span style={{ color: "#2ecc71" }}>✓</span></Sticker>
      ))}
      <Sticker f={f} t={t} t0={T.towns} t1={T.serengeti - 0.2} x={1440} y={260} rot={-5} size={64}>No towns <span style={{ color: "#ff3b30" }}>✗</span></Sticker>
      <Sticker f={f} t={t} t0={T.paved} t1={T.serengeti - 0.2} x={1440} y={400} rot={4} size={64}>No paved roads <span style={{ color: "#ff3b30" }}>✗</span></Sticker>
      <Tag c={c} f={f} t={t} lon={-125.8} lat={59.1} t0={T.just} t1={T.serengeti} text="Mountains" size={28} bg="#5a5f6b" />
      <Tag c={c} f={f} t={t} lon={-124.0} lat={58.6} t0={T.valleys} t1={T.serengeti} text="Valleys" size={28} bg="#2a7d2e" />
      <Tag c={c} f={f} t={t} lon={-125.2} lat={57.8} t0={T.rivers} t1={T.serengeti} text="Rivers" size={28} bg="#1e88e5" />
      <Tag c={c} f={f} t={t} lon={-123.6} lat={57.2} t0={T.animals} t1={T.serengeti} text="Animals" size={28} bg="#b8860b" />
      <BigWord f={f} t={t} t0={T.serengeti} t1={T.sheep - 0.1} text={<span>SERENGETI <span style={{ color: "#ffd23a" }}>OF THE NORTH</span></span>} y={950} size={100} />

      {/* cada animal aparece cuando se nombra */}
      {A("i_sheep", T.sheep, -125.9, 59.2)}
      <Tag c={c} f={f} t={t} lon={-124.4} lat={59.45} t0={T.goats} t1={T.pushed} text="Mountain goats" size={26} bg="#5a5f6b" />
      <Tag c={c} f={f} t={t} lon={-123.3} lat={58.6} t0={T.elk} t1={T.pushed} text="Elk" size={26} bg="#6b4f2a" />
      {A("i_moose", T.moose, -125.2, 58.25)}
      {A("i_caribou", T.caribou, -123.7, 57.75)}
      {A("i_wolf", T.wolves, -125.6, 57.55)}
      {A("i_grizzly", T.grizzly, -124.3, 56.95, 140)}

      {/* vuelo bajo: ni un rastro humano */}
      <Sticker f={f} t={t} t0={T.hour} t1={T.river2 - 0.1} x={470} y={230} rot={-5} size={60}>1 hour · 0 people</Sticker>
      <Sticker f={f} t={t} t0={T.power} t1={T.river2 - 0.1} x={1450} y={250} rot={4} size={56}>No power line <span style={{ color: "#ff3b30" }}>✗</span></Sticker>
      <Sticker f={f} t={t} t0={T.cabin} t1={T.river2 - 0.1} x={1450} y={380} rot={-3} size={56}>No cabin <span style={{ color: "#ff3b30" }}>✗</span></Sticker>
      <Sticker f={f} t={t} t0={T.road} t1={T.river2 - 0.1} x={1450} y={510} rot={3} size={56}>No road <span style={{ color: "#ff3b30" }}>✗</span></Sticker>
      <Herd c={c} f={f} t={t} />
      <Tag c={c} f={f} t={t} lon={-100} lat={45} t0={T.realize + 0.4} t1={T.end} text="North America, before us" size={34} />
      <Tag c={c} f={f} t={t} lon={-125} lat={58.2} dy={-70} t0={T.lucky} t1={T.end} text="Still left" size={32} bg="#1d6b3a" />
    </>
  );
};
const vis3 = (t: number) => t >= T.rockies - 0.15 && t <= T.hot + 0.05;

export const ch04: Chapter = {
  T0: S, T1: T.end,
  keys: [
    [S + 0.3, -121.6, 57.3, 0.42, 0], [T.nelson, -122.6, 58.4, 0.5, 0], [T.rockies, -124.0, 58.9, 0.6, 0],
    [T.hot, -126.0, 59.4, 1.4, 0], [T.plants, -126.1, 59.42, 1.6, 0], [T.south, -125.4, 57.5, 0.35, 0], [T.soldiers, -126.1, 59.4, 1.3, 0],
    [T.now, -126.0, 59.3, 1.1, 0], [T.noRoads, -125.1, 58.2, 0.62, 0], [T.secrets, -125.1, 58.15, 0.68, 0],
    [T.bigger, -125.0, 58.1, 0.74, 0], [T.inside + 0.4, -125.0, 58.15, 0.72, 0], [T.sheep, -124.8, 58.2, 0.8, 0], [T.pushed, -124.8, 58.2, 0.84, 0],
    [T.flown, -124.9, 58.3, 0.9, 0], [T.herd, -124.6, 58.35, 1.0, 0], [T.realize, -124.8, 58.3, 0.9, 0], [T.lucky, -115, 54, 0.1, 0], [T.end, -115, 54, 0.097, 0],
  ],
  World, Screen,
  full: [458.28, 480.32],
  sfx: [
    [S + 0.1, "wh2", 0.12, 1.2], [T.nelson, "ck2", 0.1, 0.3], [T.rockies - 0.1, "wh5", 0.15, 1.6], [T.snow, "pop1", 0.11, 0.4], [T.hot - 0.15, "sw4", 0.13, 1.2],
    [T.bath, "st1", 0.13, 0.5], [T.plants - 0.15, "pop2", 0.12, 0.4], [T.ferns, "pop3", 0.11, 0.4], [T.ferns + 0.55, "pop4", 0.11, 0.4], [T.south, "wh2", 0.1, 1.0],
    [T.soldiers - 0.15, "sw1", 0.13, 1.2], [T.tell - 0.05, "sw4", 0.12, 1.0], [T.now, "wh6", 0.13, 1.4], [T.mk, "ck6", 0.12, 0.6], [T.secrets, "st2", 0.14, 0.5],
    [T.six, "tk1", 0.08, 1.0], [T.bigger + 0.3, "pop1", 0.12, 0.4], [T.bigger + 0.8, "pop2", 0.12, 0.4], [T.towns, "st1", 0.12, 0.5], [T.paved, "st2", 0.12, 0.5],
    [T.just, "pop3", 0.1, 0.4], [T.valleys, "pop4", 0.1, 0.4], [T.rivers, "pop5", 0.1, 0.4], [T.animals, "pop1", 0.1, 0.4], [T.serengeti - 0.15, "im1", 0.14, 1.4],
    [T.sheep, "pop2", 0.11, 0.4], [T.goats, "pop3", 0.11, 0.4], [T.elk, "pop4", 0.11, 0.4], [T.moose, "pop5", 0.11, 0.4], [T.caribou, "pop1", 0.11, 0.4], [T.wolves, "pop2", 0.11, 0.4], [T.grizzly, "pop3", 0.12, 0.4],
    [T.grizzly + 0.5, "sw4", 0.12, 1.0], [T.flown - 0.1, "sw1", 0.13, 1.2], [T.sign - 0.05, "sw4", 0.12, 1.0], [T.power, "st1", 0.11, 0.5], [T.cabin, "st2", 0.11, 0.5], [T.road, "st1", 0.11, 0.5],
    [T.river2 - 0.05, "sw4", 0.12, 1.0], [T.herd, "tk1", 0.1, 1.6], [T.lucky, "wh5", 0.15, 1.8],
  ],
};

// Capítulo 6 — la ruta 37 (Stewart-Cassiar) y la aurora boreal
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Chapter, at, Tag, Pin, Icon, BigWord, Sticker, Note, Line, Portal, PortalSpec, Num, PL, pj, pop, fadeOut, vis, win, ramp, clamp, SANS } from "./lib";
import { Terrain3D, TEX, TKey } from "./v3_fortune";

const S = at("now before we leave");
const T = {
  road: at("one more road", S), one: at("only drive one", S), hwy: at("it's highway 37", S), sc: at("the stuart-cassiar highway", S), north: at("runs north from", S), skeena: at("skeena river", S),
  km: at("more than 800", S), mountains: at("up through the mountains", S), alaska: at("all the way to the alaska", S), nothing: at("almost nothing", S), tiny: at("a few tiny", S),
  gas: at("a gas station", S), apart: at("very long way apart", S), years: at("for years long", S), gravel: at("gravel", S), couple: at("a couple of places", S), airstrip: at("doubled as an airstrip", S), planes: at("watch for planes", S),
  drive: at("when you drive it", S), big: at("how big this", S), bend: at("around a bend", S), postcard: at("on a postcard", S), pass: at("over a pass", S), valley: at("a valley full", S), horizon: at("to the horizon", S),
  moose: at("you see moose", S), bears: at("black bears", S), grizzly: at("a grizzly digging", S),
  night: at("and at night", S), show: at("you get the show", S), lights: at("the northern lights", S), curtains: at("green curtains", S), pink: at("bit of pink", S), alive: at("like they're alive", S),
  cockpit: at("from the cockpit", S), tent: at("from a tent", S), truck: at("next to my truck", S), two: at("two in the morning", S), never: at("never get used", S),
  south: at("down south", S), wash: at("wash them out", S), here: at("up here there's", S), between: at("nothing between you", S),
  ever: at("so if you ever", S), airport: at("skip the airport", S), take: at("take that road", S), end: at("so that's the wild", S),
};
// traza de la ruta 37: Kitwanga → Meziadin → Bell II → Iskut → Dease Lake → Good Hope Lake → Alaska Highway
const H37: [number, number][] = [[-128.06, 55.1], [-128.6, 55.6], [-129.3, 56.1], [-129.8, 56.75], [-130.05, 57.3], [-129.98, 57.84], [-130.0, 58.44], [-129.75, 58.9], [-129.3, 59.29], [-129.1, 60.05]];
const GAS: [number, number][] = [[-129.3, 56.1], [-129.8, 56.75], [-129.98, 57.84], [-130.0, 58.44]];
const STRIP: [number, number] = [-130.05, 57.3];
const CITIES: [number, number, number][] = [[-123.12, 49.28, 1], [-123.37, 48.43, 0.6], [-119.5, 49.89, 0.55], [-122.75, 53.92, 0.5], [-122.3, 49.05, 0.6], [-121.95, 49.17, 0.45]];

const PORTALS: PortalSpec[] = [
  { src: "raw/cassiar_cassiar_british_columbia_1.jpg", t0: T.nothing - 0.1, t1: T.gas - 0.05, lon: -129.9, lat: 57.4, label: "Highway 37", credit: "Photo: Bruce McKay · Wikimedia Commons · CC BY-SA 2.0" },
  { src: "raw/cassiar_cassiar_british_columbia_2.jpg", t0: T.bend + 0.2, t1: T.pass - 0.1, lon: -130.2, lat: 57.55, label: "Kinaskan Lake", credit: "Photo: Joseph from Port Townsend · Wikimedia Commons · CC BY-SA 2.0" },
  { src: "img/s_aurora_lake.jpg", t0: T.alive - 0.1, t1: T.cockpit - 0.05, lon: -129.9, lat: 58.4, maxR: 1200 },
  { src: "img/g_cockpit.jpg", t0: T.cockpit - 0.05, t1: T.tent - 0.05, lon: -129.9, lat: 58.4 },
  { src: "img/g_aurora_truck.jpg", t0: T.truck - 0.05, t1: T.never + 1.2, lon: -129.9, lat: 58.4 },
];

// aurora dibujada a mano: cortinas verdes con borde rosado que ondulan
const Aurora: React.FC<{ t: number; o: number; y0?: number; h?: number; pink?: number }> = ({ t, o, y0 = 40, h = 520, pink = 0 }) => {
  if (o <= 0.01) return null;
  const N = 46;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: o, mixBlendMode: "screen" }}>
      <defs>
        <linearGradient id="au" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff4fa3" stopOpacity={0.25 + 0.55 * pink} />
          <stop offset="0.25" stopColor="#3dff9a" stopOpacity="0.85" />
          <stop offset="0.75" stopColor="#1fd17a" stopOpacity="0.45" />
          <stop offset="1" stopColor="#0b6b3a" stopOpacity="0" />
        </linearGradient>
        <filter id="aublur"><feGaussianBlur stdDeviation="9" /></filter>
      </defs>
      <g filter="url(#aublur)">
        {Array.from({ length: N }, (_, i) => {
          const u = i / (N - 1);
          const x = -60 + u * 2040 + Math.sin(t * 0.9 + u * 7) * 70;
          const y = y0 + Math.sin(t * 0.6 + u * 4.3) * 90 + Math.sin(u * 13) * 30;
          const hh = h * (0.6 + 0.4 * Math.sin(t * 1.3 + u * 9) ** 2);
          return <rect key={i} x={x} y={y} width={58} height={hh} fill="url(#au)" opacity={0.35 + 0.35 * Math.sin(t * 2 + u * 17) ** 2} />;
        })}
      </g>
    </svg>
  );
};

// cartel de ruta amarillo hecho a mano: "WATCH FOR PLANES"
const PlaneSign: React.FC<{ f: number; t: number; t0: number; t1: number }> = ({ f, t, t0, t1 }) => {
  if (!vis(t, t0, t1)) return null;
  const s = pop(f, t0, 10) * fadeOut(t, t1);
  return (
    <div style={{ zIndex: 20, position: "absolute", left: 1480, top: 560, transform: `translate(-50%,-50%) scale(${s}) rotate(${-3 + Math.sin(t * 3) * 1.5}deg)`, textAlign: "center" }}>
      <div style={{ width: 300, height: 300, margin: "0 auto", transform: "rotate(45deg)", background: "#ffd200", border: "10px solid #111", outline: "6px solid #ffd200", borderRadius: 18, boxShadow: "0 18px 30px rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: "rotate(-45deg)", fontFamily: SANS, fontWeight: 900, fontSize: 44, lineHeight: 1.0, color: "#111" }}>✈<br />WATCH<br />FOR<br />PLANES</div>
      </div>
      <div style={{ width: 22, height: 210, background: "#777", margin: "-30px auto 0", border: "3px solid #444" }} />
    </div>
  );
};

const Screen: Chapter["Screen"] = ({ c, f, t }) => {
  const tk: TKey[] = [[T.drive - 0.1, -129.75, 56.55, 0.95, -130.0, 57.4, 0.15], [T.bend, -129.95, 57.05, 0.55, -130.15, 57.6, 0.1], [T.pass, -130.0, 57.45, 0.75, -130.0, 58.2, 0.25], [T.moose, -130.0, 57.8, 0.9, -130.0, 58.7, 0.2]];
  const night = win(t, T.night - 0.2, T.ever + 0.3, 0.8);
  const au = Math.min(ramp(t, T.show, 1.2), 1 - ramp(t, T.ever, 0.6));
  return (
    <>
      {/* noche sobre el mapa + ciudades del sur que tapan la aurora */}
      <AbsoluteFill style={{ background: "#040a1e", opacity: 0.72 * night }} />
      {CITIES.map(([lo, la, k], i) => {
        const o = night * ramp(t, T.south + i * 0.12, 0.5);
        if (o <= 0) return null;
        const [x, y] = pj(c, lo, la);
        return <div key={i} style={{ position: "absolute", left: x - 180 * k, top: y - 180 * k, width: 360 * k, height: 360 * k, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,214,120,.95) 0%, rgba(255,170,60,.45) 35%, rgba(255,150,40,0) 70%)", opacity: o }} />;
      })}
      <Aurora t={t} o={au * (1 - 0.75 * ramp(t, T.wash, 0.6) * (1 - ramp(t, T.here, 0.6)))} pink={ramp(t, T.pink, 0.6)} y0={T.south < t ? -60 : 40} h={T.south < t ? 420 : 560} />

      {PORTALS.map((p, i) => <Portal key={i} c={c} t={t} f={f} p={p} />)}
      <Line c={c} f={f} t={t} pts={H37} t0={T.hwy} t1={T.drive} dur={2.6} color="#ffd23a" w={9} icon="i_pickup" iconSize={110} />
      <Pin c={c} f={f} t={t} lon={-128.06} lat={55.1} t0={T.skeena} t1={T.nothing} label="Skeena River" side="l" color="#1e88e5" />
      <Pin c={c} f={f} t={t} lon={-129.1} lat={60.05} t0={T.alaska} t1={T.nothing} label="Alaska Highway" />
      {GAS.map(([lo, la], i) => <Tag key={i} c={c} f={f} t={t} lon={lo} lat={la} dx={i % 2 ? 70 : -70} t0={T.gas + i * 0.35} t1={T.years} text="⛽" size={34} bg="#e3261c" />)}
      <Tag c={c} f={f} t={t} lon={-128.6} lat={58.0} t0={T.gravel} t1={T.drive} text="Gravel" size={30} bg="#6b4f2a" />
      <Icon c={c} f={f} t={t} src="i_plane" lon={STRIP[0] + 0.9 - 0.9 * ramp(t, T.airstrip, 1.6)} lat={STRIP[1] + 0.35 - 0.35 * ramp(t, T.airstrip, 1.6)} t0={T.airstrip} t1={T.drive} size={120} />
      <PlaneSign f={f} t={t} t0={T.planes - 0.2} t1={T.drive} />

      <Sticker f={f} t={t} t0={T.hwy} t1={T.km} x={470} y={250} size={70}>Highway <span style={{ color: "#ffd23a" }}>37</span></Sticker>
      <Num f={f} t={t} t0={T.km} t1={T.nothing - 0.2} x={1460} y={280} value={800} prefix=">" suffix=" km" label="Stewart-Cassiar Highway" />
      <Sticker f={f} t={t} t0={T.nothing} t1={T.gas - 0.1} x={1450} y={250} size={64}>Almost <span style={{ color: "#ff3b30" }}>nothing</span></Sticker>
      <Sticker f={f} t={t} t0={T.apart} t1={T.years} x={1450} y={260} rot={3} size={56}>⛽ … very long way … ⛽</Sticker>

      {vis(t, T.drive - 0.15, T.moose + 0.05) && (
        <Terrain3D name="nbc" t={t} t0={T.drive - 0.1} t1={T.moose} keys={tk} label="Highway 37" font={SANS} tex={TEX}>
          <Sticker f={f} t={t} t0={T.valley} t1={T.moose - 0.1} x={470} y={240} rot={-4} size={50}>Trees &amp; river to the horizon</Sticker>
        </Terrain3D>
      )}
      <Sticker f={f} t={t} t0={T.bend + 0.6} t1={T.pass - 0.15} x={1430} y={240} rot={4} size={50}>A lake not on any postcard</Sticker>
      <Icon c={c} f={f} t={t} src="i_moose" lon={-129.6} lat={58.0} t0={T.moose} t1={T.night} size={130} />
      <Tag c={c} f={f} t={t} lon={-130.5} lat={57.55} t0={T.bears} t1={T.night} text="Black bears" size={28} bg="#111" />
      <Icon c={c} f={f} t={t} src="i_grizzly" lon={-129.7} lat={57.15} t0={T.grizzly} t1={T.night} size={140} />
      <Sticker f={f} t={t} t0={T.grizzly + 0.5} t1={T.night} x={1450} y={260} size={56}>…digging for roots</Sticker>

      <BigWord f={f} t={t} t0={T.lights} t1={T.alive - 0.1} text={<span>THE <span style={{ color: "#3dff9a" }}>NORTHERN LIGHTS</span></span>} y={930} size={104} />
      <Sticker f={f} t={t} t0={T.tent} t1={T.truck - 0.1} x={1450} y={300} size={64}>⛺ from a tent</Sticker>
      <Sticker f={f} t={t} t0={T.two} t1={T.never + 1.1} x={1450} y={250} rot={3} size={64}>2:00 AM</Sticker>
      <Tag c={c} f={f} t={t} lon={-123.1} lat={49.6} dy={-150} t0={T.wash} t1={T.ever} text="City lights" size={30} bg="#b8860b" />
      <Tag c={c} f={f} t={t} lon={-129.5} lat={58.2} t0={T.here} t1={T.ever} text="Nothing between you and them" size={30} bg="#0b6b3a" />
      <BigWord f={f} t={t} t0={T.airport} t1={T.end} text={<span><span style={{ textDecoration: "line-through", color: "#ff8a80" }}>AIRPORT</span> → <span style={{ color: "#ffd23a" }}>TAKE THAT ROAD</span></span>} y={930} size={84} />
      <Line c={c} f={f} t={t} pts={H37} t0={T.take - 0.4} t1={T.end} dur={1.4} color="#ffd23a" w={10} icon="i_pickup" iconSize={110} />
    </>
  );
};

export const ch06: Chapter = {
  T0: S, T1: T.end,
  keys: [
    [S + 1.2, -129.5, 57.6, 0.28, 0], [T.hwy, -129.3, 57.5, 0.26, 0], [T.alaska + 1.2, -129.3, 57.6, 0.28, 0],
    [T.nothing, -129.6, 57.4, 0.38, 0], [T.airstrip, -129.9, 57.3, 0.55, 0], [T.drive, -129.95, 57.3, 0.6, 0],
    [T.moose, -129.9, 57.6, 0.5, 0], [T.night, -129.7, 57.7, 0.4, 0], [T.lights, -129.6, 57.8, 0.35, 0],
    [T.never + 1.2, -129.6, 57.8, 0.32, 0], [T.south + 0.4, -126.5, 54.0, 0.12, 0], [T.here, -127, 54.5, 0.12, 0],
    [T.ever, -129.3, 57.5, 0.26, 0], [T.end, -129.3, 57.6, 0.27, 0],
  ],
  Screen,
  full: [670.286, 732.906],
  sfx: [
    [S + 0.2, "wh2", 0.12, 1.2], [T.hwy, "st1", 0.12, 0.5], [T.hwy + 0.3, "wh6", 0.12, 1.4], [T.km, "tk1", 0.08, 1.0], [T.skeena, "ck2", 0.1, 0.3], [T.alaska, "ck2", 0.1, 0.3],
    [T.nothing - 0.1, "sw4", 0.12, 1.0], [T.gas, "pop1", 0.1, 0.4], [T.gas + 0.35, "pop2", 0.1, 0.4], [T.gas + 0.7, "pop3", 0.1, 0.4], [T.gas + 1.05, "pop4", 0.1, 0.4],
    [T.gravel, "pop5", 0.1, 0.4], [T.airstrip, "wh5", 0.13, 1.6], [T.planes - 0.2, "st2", 0.13, 0.5], [T.drive - 0.1, "wh5", 0.15, 1.6], [T.bend + 0.3, "pop1", 0.1, 0.4], [T.valley, "pop2", 0.1, 0.4],
    [T.moose, "pop3", 0.11, 0.4], [T.bears, "pop4", 0.11, 0.4], [T.grizzly, "pop5", 0.11, 0.4], [T.night, "wh2", 0.1, 1.4], [T.lights, "im1", 0.13, 1.4],
    [T.alive - 0.1, "sw4", 0.12, 1.0], [T.cockpit - 0.05, "sw1", 0.12, 1.0], [T.tent, "pop1", 0.1, 0.4], [T.truck - 0.05, "sw4", 0.12, 1.0], [T.two, "st1", 0.11, 0.5],
    [T.south, "wh6", 0.12, 1.4], [T.here, "pop2", 0.1, 0.4], [T.airport, "st2", 0.13, 0.5], [T.take - 0.4, "wh5", 0.14, 1.4],
  ],
};

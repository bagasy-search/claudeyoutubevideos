// Capítulo 15 — Kemano: el agua que dieron vuelta a través de una montaña (y su costo)
import React from "react";
import { interpolate, Img } from "remotion";
import { Chapter, at, Tag, Pin, Icon, BigWord, Sticker, Line, Dots, Portal, PortalSpec, PL, P, pj, sf, pop, vis, win, ramp, fadeOut, clamp, SANS } from "./lib";

const S = at("now head inland");
const T = {
  inlet: at("long inlet", S), impressive: at("most impressive", S), nobody: at("almost nobody", S), y1950: at("early 1950s", S), alu: at("aluminum company", S), smelter: at("giant smelter", S), kitimat: at("kitimat", S),
  huge: at("huge amounts", S), power: at("power source", S), incred: at("was incredible", S), east: at("east of the coast", S), lakes: at("system of lakes", S), drained: at("drained east", S), nechako: at("nitchaco river", S), fraser: at("to the fraser", S),
  dam: at("built a dam", S), held: at("held back", S), reservoir: at("big reservoir", S), tunnel: at("drilled a tunnel", S), km16: at("16 kimolators", S), through: at("straight through", S), other: at("flow the other way", S), west: at("west", S), pacific: at("toward the pacific", S),
  endt: at("end of that tunnel", S), house: at("powerhouse", S), surface: at("on the surface", S), inside: at("inside the mountain", S), cave: at("huge cave", S), rock: at("solid rock", S), deep: at("deep underground", S), gens: at("giant generators", S),
  think: at("think about", S), thousands: at("thousands of years", S), backwards: at("backwards", S), heart: at("heart of a mountain", S), incave: at("in a cave", S), kemano: at("kimeno project", S),
  town: at("town of kitimat", S), planned: at("planned town", S), scratch: at("from scratch", S), grew: at("grew up around", S),
  cost: at("with a cost", S), flooded: at("flooded land", S), cheslatta: at("cheslada carrier", S), gens2: at("for generations", S), notice: at("very little notice", S), came: at("water came", S),
  nech2: at("natchaco river", S), less: at("less water", S), since: at("ever since", S), salmon: at("the salmon", S), rely: at("rely on", S), stories: at("these are stories", S), remember: at("remember well", S), forgot: at("has forgotten", S), end: at("let's go north", S),
};
const KIT = PL("kitimat"), KEM = PL("kemano"), PG = PL("prince_george");
const KENNEY: [number, number] = [-124.95, 53.62];
const CHES: [number, number] = [-125.45, 53.72];
const DOUGLAS: [number, number][] = [[-129.6, 53.2], [-129.2, 53.45], [-128.9, 53.75], [-128.7, 53.95], KIT];
const GARDNER: [number, number][] = [[-128.7, 53.3], [-128.35, 53.45], [-128.0, 53.52], KEM];
const LAKES: [number, number][] = [[-127.65, 53.62], [-127.2, 53.6], [-126.8, 53.62], [-126.3, 53.7], [-125.8, 53.78], [-125.4, 53.72], KENNEY];
const NECH: [number, number][] = [KENNEY, [-124.6, 53.8], [-124.0, 54.02], [-123.5, 53.98], PG];
const FRASER: [number, number][] = [PG, [-122.5, 53.0], [-122.2, 52.1], [-121.9, 50.7], [-121.44, 49.38], [-122.3, 49.15], [-123.1, 49.12]];
const TUNNEL: [number, number][] = [[-127.65, 53.62], KEM];
const CR = { gardner: "Photo: Sam Beebe · CC BY 2.0", kemano: "Photo: Sam Beebe · CC BY 2.0", kitimat: "Photo: Sam Beebe / Ecotrust · CC BY-SA 3.0" };

const PORTALS: PortalSpec[] = [
  { src: "raw/kemano_kemano_0.jpg", t0: T.inlet - 0.1, t1: T.y1950 - 0.05, lon: -128.3, lat: 53.45, zoom: [1.0, 1.15], credit: CR.gardner, label: "Gardner Canal" },
  { src: "img/s_kitimat_smelter.jpg", t0: T.smelter - 0.1, t1: T.huge - 0.05, lon: KIT[0], lat: KIT[1], zoom: [1.0, 1.12] },
  { src: "img/g_kemano_tunnel.jpg", t0: T.tunnel - 0.1, t1: T.other - 0.05, lon: -127.8, lat: 53.6, zoom: [1.0, 1.12] },
  { src: "img/s_kemano_power.jpg", t0: T.rock - 0.05, t1: T.think - 0.05, lon: KEM[0], lat: KEM[1], zoom: [1.12, 1.0], label: "Underground powerhouse" },
  { src: "raw/kemano_kemano_2.jpg", t0: T.kemano - 0.1, t1: T.town - 0.05, lon: KEM[0], lat: KEM[1], zoom: [1.0, 1.1], credit: CR.kemano, label: "Kemano" },
  { src: "raw/kemano_kitimat_british_columbia_3.jpg", t0: T.town - 0.05, t1: T.cost - 0.05, lon: KIT[0], lat: KIT[1], zoom: [1.0, 1.15], credit: CR.kitimat, label: "Kitimat" },
];

// flujo animado (guiones que corren) en el mundo
const flowPath = (pts: [number, number][]) => "M" + pts.map(([lo, la]) => P(lo, la).map((v) => v.toFixed(1)).join(",")).join("L");
const Flow: React.FC<{ pts: [number, number][]; t: number; z: number; op: number; dir: 1 | -1; color?: string; w?: number; speed?: number }> = ({ pts, t, z, op, dir, color = "#e8f7ff", w = 14, speed = 1 }) =>
  op <= 0 ? null : (
    <g opacity={op}>
      <path d={flowPath(pts)} fill="none" stroke="#0b2a4a" strokeWidth={(w + 8) / z} strokeLinecap="round" strokeLinejoin="round" opacity={0.7} />
      <path d={flowPath(pts)} fill="none" stroke={color} strokeWidth={w / z} strokeDasharray={`${34 / z} ${22 / z}`} strokeDashoffset={(dir * -t * 110 * speed) / z} strokeLinecap="round" />
    </g>
  );

const World: Chapter["World"] = ({ t, z }) => {
  const eastOn = win(t, T.drained - 0.2, T.end, 0.4);
  const stopped = ramp(t, T.held, 0.6);
  const res = ramp(t, T.reservoir - 0.3, 1.0);
  const westOn = win(t, T.other, T.end, 0.4);
  const less = ramp(t, T.less, 1.0);
  const flood = win(t, T.flooded - 0.2, T.since, 0.5);
  return (
    <>
      <path d={flowPath(LAKES)} fill="none" stroke="#2a9df4" strokeWidth={(18 + 26 * res) / z} strokeLinecap="round" strokeLinejoin="round" opacity={win(t, T.lakes - 0.2, T.end, 0.5)} />
      {flood > 0 && <path d={flowPath(LAKES)} fill="none" stroke="#ff3b30" strokeWidth={(46 + 6 * Math.sin(t * 5)) / z} strokeLinecap="round" strokeLinejoin="round" opacity={0.75 * flood} />}
      <Flow pts={LAKES} t={t} z={z} op={eastOn * (1 - stopped)} dir={1} />
      <Flow pts={NECH} t={t} z={z} op={eastOn * (1 - 0.6 * stopped) * (1 - 0.5 * less)} dir={1} w={14 - 8 * less} speed={1 - 0.7 * stopped} />
      <Flow pts={FRASER} t={t} z={z} op={eastOn * win(t, T.fraser - 0.2, T.dam + 1, 0.4)} dir={1} />
      <Flow pts={[...LAKES].reverse()} t={t} z={z} op={westOn * stopped} dir={1} color="#4dd0e1" w={12} speed={1.4} />
      <Flow pts={TUNNEL} t={t} z={z} op={westOn * ramp(t, T.other, 0.4)} dir={1} color="#ffd23a" w={14} speed={1.6} />
    </>
  );
};

// corte de la montaña: túnel → caverna con generadores
const Section: React.FC<{ f: number; t: number }> = ({ f, t }) => {
  if (!vis(t, T.endt - 0.2, T.rock + 0.1)) return null;
  const op = win(t, T.endt - 0.2, T.rock + 0.1, 0.3);
  const cave = ramp(t, T.inside, 0.6);
  const flow = (t * 300) % 60;
  return (
    <div style={{ zIndex: 15, position: "absolute", inset: 0, opacity: op }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#9fd3f5,#cfe9fb 55%)" }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <path d="M-20,1080 L-20,780 L380,560 L760,200 L1120,430 L1460,330 L1940,760 L1940,1080 Z" fill="#6d5a48" stroke="#3e2f22" strokeWidth={6} />
        <path d="M760,200 L700,260 L820,250 Z" fill="#fff" />
        <path d="M1460,330 L1410,380 L1510,375 Z" fill="#fff" />
        <path d="M60,820 C500,760 900,720 1260,700" stroke="#1e4f7a" strokeWidth={34} fill="none" />
        <path d="M60,820 C500,760 900,720 1260,700" stroke="#7fd3ff" strokeWidth={12} fill="none" strokeDasharray="30 30" strokeDashoffset={-flow} />
        <g opacity={cave} transform={`translate(1380,700) scale(${0.6 + 0.4 * cave})`}>
          <rect x={-200} y={-110} width={400} height={200} rx={50} fill="#222" stroke="#ffd23a" strokeWidth={6} />
          {[-120, 0, 120].map((x, i) => (
            <g key={i} transform={`translate(${x},20)`}>
              <circle r={44} fill="#1565c0" stroke="#fff" strokeWidth={4} />
              <path d="M0,-30 L8,0 L0,30 L-8,0 Z" fill="#fff" transform={`rotate(${t * 360 + i * 40})`} />
            </g>
          ))}
        </g>
        <rect x={0} y={1000} width={1920} height={80} fill="#2a9df4" />
      </svg>
      <div style={{ position: "absolute", left: 300, top: 900, fontFamily: SANS, fontWeight: 900, fontSize: 36, color: "#fff", textShadow: "0 3px 0 #111" }}>16 km tunnel →</div>
      <Sticker f={f} t={t} t0={T.inside} t1={T.rock + 0.1} x={1380} y={480} size={52}>Inside the mountain</Sticker>
    </div>
  );
};

const Screen: Chapter["Screen"] = ({ c, f, t }) => (
  <>
    <Line c={c} f={f} t={t} pts={DOUGLAS} t0={S + 0.4} t1={T.y1950} dur={1.4} color="#ffffff" w={6} />
    <Line c={c} f={f} t={t} pts={GARDNER} t0={T.inlet - 0.6} t1={T.y1950} dur={0.9} color="#ffffff" w={6} />
    <Sticker f={f} t={t} t0={T.impressive} t1={T.y1950} x={1450} y={250} size={48}>One of Canada's greatest engineering feats</Sticker>
    <Sticker f={f} t={t} t0={T.nobody} t1={T.y1950} x={1450} y={370} rot={3} size={48}>…almost nobody knows</Sticker>
    <BigWord f={f} t={t} t0={T.y1950} t1={T.smelter} text={<span>EARLY <span style={{ color: "#ffd23a" }}>1950s</span></span>} y={160} size={110} />
    <Icon c={c} f={f} t={t} src="ingot" lon={KIT[0]} lat={KIT[1]} dx={-110} t0={T.alu} t1={T.east} size={110} />
    <Pin c={c} f={f} t={t} lon={KIT[0]} lat={KIT[1]} t0={T.kitimat - 0.2} t1={T.east} label="Kitimat" />
    <Icon c={c} f={f} t={t} src="i_smelter" lon={KIT[0]} lat={KIT[1]} dy={-110} t0={T.huge} t1={T.east} size={120} />
    {[0, 1, 2].map((i) => <Icon key={i} c={c} f={f} t={t} src="i_bolt" lon={KIT[0] + 0.25 + i * 0.25} lat={KIT[1] + 0.2} t0={T.huge + 0.3 + i * 0.25} t1={T.east} size={80} />)}
    <Sticker f={f} t={t} t0={T.huge} t1={T.east} x={1450} y={250} size={50}>Smelting = huge amounts of electricity</Sticker>
    <Sticker f={f} t={t} t0={T.power} t1={T.east} x={1450} y={370} rot={3} size={52}>Power source? ⚡</Sticker>

    <Tag c={c} f={f} t={t} lon={-126.4} lat={53.95} t0={T.lakes} t1={T.nechako} text="Chain of lakes" size={30} bg="#1e88e5" />
    <Tag c={c} f={f} t={t} lon={-124.0} lat={54.2} t0={T.nechako} t1={T.reservoir} text="Nechako River →" size={30} bg="#1e88e5" />
    <Tag c={c} f={f} t={t} lon={-121.6} lat={51.4} t0={T.fraser + 0.3} t1={T.dam + 1} text="Fraser → Pacific" size={30} bg="#1e88e5" />
    <Icon c={c} f={f} t={t} src="i_dam" lon={KENNEY[0]} lat={KENNEY[1]} t0={T.dam} t1={T.end} size={120} />
    <Tag c={c} f={f} t={t} lon={KENNEY[0]} lat={KENNEY[1]} dy={85} t0={T.dam + 0.3} t1={T.tunnel} text="Kenney Dam" size={28} bg="#111" />
    <Sticker f={f} t={t} t0={T.reservoir} t1={T.tunnel} x={1450} y={250} size={52}>Lakes → one big reservoir</Sticker>
    <Sticker f={f} t={t} t0={T.other} t1={T.endt} x={1450} y={250} size={56}>Water now flows WEST ←</Sticker>
    <Tag c={c} f={f} t={t} lon={-127.8} lat={53.75} t0={T.other + 0.2} t1={T.endt} text="16 km tunnel" size={30} bg="#c79100" />
    <Pin c={c} f={f} t={t} lon={KEM[0]} lat={KEM[1]} t0={T.pacific} t1={T.endt} label="Kemano" side="l" />

    <Section f={f} t={t} />
    <Sticker f={f} t={t} t0={T.deep} t1={T.think} x={1450} y={250} size={50}>Carved from solid rock · deep underground</Sticker>

    <BigWord f={f} t={t} t0={T.backwards} t1={T.kemano} text={<span>A RIVER SENT <span style={{ color: "#ffd23a" }}>BACKWARDS</span></span>} y={160} size={100} />
    <Sticker f={f} t={t} t0={T.thousands} t1={T.backwards} x={1450} y={260} size={52}>Flowing east for thousands of years…</Sticker>
    <Sticker f={f} t={t} t0={T.heart} t1={T.kemano} x={1450} y={330} rot={3} size={48}>…through a mountain, to a cave</Sticker>
    <Sticker f={f} t={t} t0={T.planned} t1={T.cost} x={1480} y={230} size={50}>A planned town</Sticker>
    <Sticker f={f} t={t} t0={T.scratch} t1={T.cost} x={1480} y={350} rot={3} size={50}>Built from scratch in the wilderness</Sticker>

    <BigWord f={f} t={t} t0={T.cost} t1={T.flooded + 0.4} text={<span>…AT A <span style={{ color: "#ff3b30" }}>COST</span></span>} y={160} size={110} />
    <Tag c={c} f={f} t={t} lon={CHES[0]} lat={CHES[1]} dy={-140} t0={T.cheslatta} t1={T.nech2} text="Cheslatta Carrier Nation" size={32} bg="#8e44ad" />
    {[[-125.6, 53.66], [-125.3, 53.78], [-125.9, 53.8]].map(([lo, la], i) => <Icon key={i} c={c} f={f} t={t} src="i_house_flood" lon={lo} lat={la} t0={T.gens2 + i * 0.3} t1={T.nech2} size={90} />)}
    <Sticker f={f} t={t} t0={T.notice} t1={T.nech2} x={1450} y={250} size={52}>Very little notice</Sticker>
    <Sticker f={f} t={t} t0={T.came} t1={T.nech2} x={1450} y={370} rot={3} size={52}>…then the water came</Sticker>
    <Tag c={c} f={f} t={t} lon={-124.0} lat={54.2} t0={T.nech2} t1={T.stories} text="Nechako: less water ↓" size={30} bg="#e3261c" />
    {[[-124.4, 53.86], [-123.8, 54.0], [-123.2, 53.95]].map(([lo, la], i) => <Icon key={i} c={c} f={f} t={t} src="i_salmon" lon={lo} lat={la} dy={80} t0={T.salmon + i * 0.2} t1={T.stories} size={80} grey={ramp(t, T.rely, 0.8)} />)}
    <Sticker f={f} t={t} t0={T.remember} t1={T.end} x={1450} y={250} size={50}>Remembered up north</Sticker>
    <Sticker f={f} t={t} t0={T.forgot} t1={T.end} x={1450} y={370} rot={3} size={50}>…forgotten by the rest</Sticker>
    {PORTALS.map((p, i) => <Portal key={i} c={c} t={t} f={f} p={p} />)}
  </>
);

export const ch15: Chapter = {
  T0: S, T1: T.end,
  keys: [
    [S + 0.3, -129.0, 53.6, 0.9, 0], [T.inlet, -128.6, 53.6, 1.1, 0], [T.kitimat, -128.65, 54.05, 1.6, 0], [T.power, -128.4, 54.0, 1.3, 0],
    [T.lakes, -126.4, 53.7, 1.0, 0], [T.nechako, -124.9, 53.8, 0.75, 0], [T.fraser + 0.3, -123.6, 51.8, 0.32, 0], [T.dam, -125.5, 53.7, 0.6, 0], [T.reservoir, -126.0, 53.7, 0.65, 0],
    [T.other, -127.2, 53.65, 0.9, 0], [T.pacific, -127.4, 53.6, 1.1, 0], [T.think, -126.0, 53.7, 0.55, 0], [T.backwards, -126.4, 53.7, 0.6, 0], [T.kemano, -127.5, 53.7, 0.9, 0],
    [T.flooded, -125.6, 53.72, 1.2, 0], [T.came, -125.5, 53.72, 1.3, 0], [T.nech2, -124.3, 53.9, 1.0, 0], [T.rely, -124.2, 53.9, 1.1, 0], [T.end, -125.5, 53.8, 0.6, 0],
  ],
  World, Screen,
  full: [1826.499, 1912.419],
  sfx: [
    [T.inlet - 0.1, "sw1", 0.12, 1.0], [T.impressive, "st1", 0.1, 0.5], [T.y1950, "im1", 0.14, 1.4], [T.smelter - 0.1, "sw4", 0.12, 1.0], [T.huge, "pop1", 0.1, 0.4], [T.power, "pop2", 0.1, 0.4],
    [T.lakes, "wh2", 0.1, 1.2], [T.fraser, "wh6", 0.1, 1.2], [T.dam, "im2", 0.14, 1.2], [T.tunnel - 0.1, "sw1", 0.12, 1.0], [T.other, "wh2", 0.12, 1.4], [T.endt - 0.1, "sw4", 0.12, 1.0],
    [T.surface, "wh6", 0.12, 1.2], [T.inside, "pop3", 0.1, 0.4], [T.rock, "sw1", 0.12, 1.0], [T.backwards, "im1", 0.14, 1.4], [T.kemano - 0.1, "sw4", 0.12, 1.0], [T.town, "sw1", 0.1, 1.0],
    [T.cost, "im2", 0.14, 1.2], [T.cheslatta, "pop4", 0.1, 0.4], [T.came, "st2", 0.12, 0.5], [T.less, "wh2", 0.1, 1.0], [T.rely, "st1", 0.1, 0.5],
  ],
};

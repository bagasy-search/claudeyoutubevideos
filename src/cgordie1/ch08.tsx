// Capítulo 8 — Cassiar, el pueblo borrado del mapa, y Jade City
import React from "react";
import { interpolate } from "remotion";
import { Chapter, at, Tag, Pin, Icon, BigWord, Sticker, Note, Line, Dots, Portal, PortalSpec, Num, PL, pj, pop, vis, ramp, fadeOut, clamp, SANS } from "./lib";

const S = at("let's keep going west");
const T = {
  deeper: at("deeper into the mountains", S), spooky: at("truly spooky", S), country: at("up in the kasiar", S), border: at("near the yukon border", S), called: at("a town called kasiar", S),
  company: at("company town", S), asbestos: at("asbestos mines", S), houses: at("houses", S + 10), school: at("a school", S), hospital: at("a hospital", S), rink: at("a curling rink", S), works: at("the whole works", S),
  families: at("families lived", S), kids: at("kids grew up", S), married: at("got married", S), world: at("then the world", S), lungs: at("human lungs", S), demand: at("demand collapsed", S),
  closed: at("the mine closed", S), gone: at("the whole town was gone", S), notab: at("not abandoned", S), sold: at("gone buildings", S), hauled: at("hauled away", S), taken: at("taken down", S),
  go: at("if you go there", S), roads: at("roads leading", S), pads: at("concrete pads", S), tailings: at("piles of tailings", S), thats: at("that's it", S), erased: at("a whole town erased", S), knew: at("never even knew", S),
  notfar: at("but not far", S), jade: at("jade city", S), madeup: at("sounds made up", S), nephrite: at("nephrite jade", S), green: at("deep green stone", S), jewelry: at("jewelry and sculptures", S),
  world2: at("a lot of the world's", S), boulders: at("boulders of it", S), tons: at("many tons", S), shipped: at("shipped to buyers", S), planet: at("other side of the planet", S),
  next: at("so the next time", S), carving: at("a green jade carving", S), chance: at("real chance", S), valley: at("remote valley", S), hardly: at("hardly anyone lives", S), end: at("from there a long", S),
};
const CAS = PL("cassiar"), JADE = PL("jade_city");
const RUPERT = PL("prince_rupert");
const C = (n: string, lic: string) => `Photo: ${n} · Wikimedia Commons · ${lic}`;

const PORTALS: PortalSpec[] = [
  { src: "img/s_cassiar_1960.jpg", t0: T.called + 0.3, t1: T.asbestos - 0.05, lon: CAS[0], lat: CAS[1], label: "Cassiar, 1960s" },
  { src: "img/g_cassiar_empty.jpg", t0: T.go - 0.1, t1: T.pads - 0.05, lon: CAS[0], lat: CAS[1] },
  { src: "img/s_cassiar_gone.jpg", t0: T.tailings - 0.1, t1: T.erased - 0.05, lon: CAS[0], lat: CAS[1], label: "Tailings" },
  { src: "raw/cassiar_jade_city_british_columb_2.jpg", t0: T.nephrite - 0.1, t1: T.jewelry - 0.05, lon: JADE[0], lat: JADE[1], label: "Nephrite jade", credit: C("James St. John", "CC BY 2.0") },
  { src: "img/s_jade_cut.jpg", t0: T.jewelry - 0.05, t1: T.boulders - 0.05, lon: JADE[0], lat: JADE[1] },
  { src: "img/g_jade_boulder.jpg", t0: T.boulders - 0.05, t1: T.shipped - 0.05, lon: JADE[0], lat: JADE[1] },
];

// el pueblo hecho a mano: casitas que aparecen, después se van en camiones y quedan las losas
const HOUSES = Array.from({ length: 24 }, (_, i) => [(i % 6) - 2.5, Math.floor(i / 6) - 1.5] as [number, number]);
const Town: React.FC<{ c: any; f: number; t: number }> = ({ c, f, t }) => {
  if (!vis(t, T.houses - 0.2, T.erased + 1.2)) return null;
  const [cx, cy] = pj(c, CAS[0], CAS[1]);
  const sc = Math.min(1.6, Math.max(0.6, c.z / 1.5));
  const out = fadeOut(t, T.erased + 1.2, 0.6);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: out }}>
      <g transform={`translate(${cx},${cy}) scale(${sc})`}>
        {HOUSES.map(([gx, gy], i) => {
          const x = gx * 62, y = gy * 58;
          const k = pop(f, T.houses + i * 0.05, 11);
          const leave = ramp(t, T.hauled - 0.6 + (i % 8) * 0.18, 1.3);
          const pad = ramp(t, T.hauled - 0.4 + (i % 8) * 0.18, 0.5);
          return (
            <g key={i}>
              <rect x={x - 22} y={y - 6} width={44} height={30} fill="#9a9a9a" opacity={pad} stroke="#555" strokeWidth={2} />
              <g transform={`translate(${x + leave * 900},${y + leave * 140}) scale(${k})`} opacity={1 - leave}>
                <rect x={-20} y={-4} width={40} height={26} fill={["#f2c14e", "#e7774a", "#7fb3d5", "#f5f5f5"][i % 4]} stroke="#222" strokeWidth={3} />
                <path d="M-25,-4 L0,-24 L25,-4 Z" fill="#7a2e1f" stroke="#222" strokeWidth={3} />
                <rect x={-5} y={8} width={10} height={14} fill="#333" />
              </g>
            </g>
          );
        })}
        {/* escombreras grises en la ladera */}
        {[[-260, -160, 170], [210, -190, 210], [-60, -230, 140]].map(([x, y, w], i) => {
          const k = ramp(t, T.tailings + i * 0.3, 0.6);
          return <path key={i} d={`M${x - w / 2},${y} Q${x},${y - w * 0.55 * k} ${x + w / 2},${y} Z`} fill="#8d8d8d" stroke="#555" strokeWidth={3} opacity={k} />;
        })}
      </g>
    </svg>
  );
};

// la goma de borrar que se lleva el nombre del mapa
const Erase: React.FC<{ c: any; t: number }> = ({ c, t }) => {
  if (!vis(t, T.thats - 0.2, T.notfar)) return null;
  const [x, y] = pj(c, CAS[0], CAS[1]);
  const k = ramp(t, T.erased + 0.2, 1.0);
  const o = fadeOut(t, T.notfar, 0.4);
  return (
    <div style={{ position: "absolute", left: x, top: y - 70, transform: "translate(-50%,-50%)", opacity: o, zIndex: 15 }}>
      <div style={{ position: "relative", fontFamily: SANS, fontWeight: 900, fontSize: 64, color: "#fff", textShadow: "0 4px 0 #111, 0 0 16px #000", letterSpacing: 2, clipPath: `inset(0 0 0 ${k * 100}%)` }}>CASSIAR</div>
      <div style={{ position: "absolute", top: 4, left: `${k * 100}%`, width: 90, height: 60, marginLeft: -45, background: "linear-gradient(#ff8fb1 0 55%, #3b6fd8 55% 100%)", borderRadius: 10, border: "4px solid #111", transform: `rotate(${-18 + Math.sin(t * 24) * 6}deg)`, opacity: k > 0 && k < 1 ? 1 : 0 }} />
    </div>
  );
};

const Screen: Chapter["Screen"] = ({ c, f, t }) => (
  <>
    <BigWord f={f} t={t} t0={T.spooky} t1={T.country} text={<span style={{ color: "#c9d6ff", textShadow: "0 0 30px #6c8cff" }}>SPOOKY</span>} y={930} size={130} />
    <Dots c={c} f={f} t={t} pts={[[-131.5, 60.0], [-129.5, 60.0], [-127.5, 60.0]]} t0={T.border} t1={T.called + 0.3} dur={1.0} color="#ffffff" gap={22} />
    <Tag c={c} f={f} t={t} lon={-129.5} lat={60.25} t0={T.border} t1={T.called + 0.3} text="Yukon" size={28} bg="#5a5f6b" />
    <Pin c={c} f={f} t={t} lon={CAS[0]} lat={CAS[1]} t0={T.called} t1={T.thats} label="Cassiar" />
    <Icon c={c} f={f} t={t} src="i_mine" lon={CAS[0] - 0.1} lat={CAS[1] + 0.06} t0={T.asbestos} t1={T.demand + 1.0} size={130} grey={ramp(t, T.demand, 0.6)} />
    <Tag c={c} f={f} t={t} lon={CAS[0] - 0.1} lat={CAS[1] + 0.06} dy={-170} t0={T.asbestos + 0.2} t1={T.demand + 1.0} text="Asbestos mine" size={28} bg="#5a5f6b" />
    <Sticker f={f} t={t} t0={T.company} t1={T.houses} x={1450} y={260} size={60}>Company town</Sticker>
    <Town c={c} f={f} t={t} />
    {[["🏠 Houses", T.houses], ["🏫 A school", T.school], ["🏥 A hospital", T.hospital], ["🥌 Curling rink", T.rink]].map(([s, t0], i) => (
      <Sticker key={i} f={f} t={t} t0={t0 as number} t1={T.world} x={1500} y={230 + i * 115} rot={i % 2 ? 3 : -3} size={48}>{s as string}</Sticker>
    ))}
    {[["Families", T.families], ["Kids", T.kids], ["Weddings", T.married]].map(([s, t0], i) => (
      <Sticker key={i} f={f} t={t} t0={t0 as number} t1={T.world} x={430} y={260 + i * 115} rot={i % 2 ? -3 : 3} size={48}>{s as string}</Sticker>
    ))}
    <Sticker f={f} t={t} t0={T.lungs} t1={T.closed} x={1450} y={260} size={60}>🫁 Asbestos → lungs</Sticker>
    <Sticker f={f} t={t} t0={T.demand} t1={T.closed} x={1450} y={400} rot={3} size={60}>Demand <span style={{ color: "#ff3b30" }}>↓↓↓</span></Sticker>
    <BigWord f={f} t={t} t0={T.notab} t1={T.go} text={<span><span style={{ textDecoration: "line-through", color: "#bbb" }}>ABANDONED</span> <span style={{ color: "#ff3b30" }}>GONE</span></span>} y={930} size={104} />
    {[0, 1, 2].map((i) => (
      <Icon key={i} c={c} f={f} t={t} src="i_army_truck" lon={CAS[0] + 0.15 + (t - T.hauled) * 0.35 + i * 0.25} lat={CAS[1] - 0.05 - i * 0.04} t0={T.hauled - 0.3 + i * 0.25} t1={T.go} size={100} />
    ))}
    <Tag c={c} f={f} t={t} lon={CAS[0]} lat={CAS[1]} dy={170} t0={T.pads} t1={T.tailings} text="Concrete pads" size={28} bg="#5a5f6b" />
    <Line c={c} f={f} t={t} pts={[[CAS[0] - 0.5, CAS[1] - 0.15], [CAS[0] - 0.2, CAS[1] - 0.05], [CAS[0] + 0.05, CAS[1] + 0.02]]} t0={T.roads} t1={T.tailings} dur={0.8} color="#cccccc" w={6} glow={false} />
    <Erase c={c} t={t} />
    <Sticker f={f} t={t} t0={T.knew} t1={T.notfar} x={1450} y={260} size={52}>Most of Canada: never knew</Sticker>

    {/* Jade City */}
    <Sticker f={f} t={t} t0={T.notfar} t1={T.madeup} x={1450} y={260} size={60}>…but not far away</Sticker>
    <Dots c={c} f={f} t={t} pts={[CAS, [-129.74, 59.3], JADE]} t0={T.notfar + 0.3} t1={T.madeup} dur={1.0} color="#2ecc71" gap={18} />
    <Pin c={c} f={f} t={t} lon={JADE[0]} lat={JADE[1]} t0={T.jade} t1={T.end} label="Jade City" color="#2ecc71" size={32} />
    <Sticker f={f} t={t} t0={T.madeup} t1={T.nephrite} x={1450} y={260} size={56}>Sounds made up… <span style={{ color: "#2ecc71" }}>true</span></Sticker>
    <Sticker f={f} t={t} t0={T.world2} t1={T.boulders} x={1450} y={260} size={52}>Much of the world's nephrite</Sticker>
    <Num f={f} t={t} t0={T.tons} t1={T.shipped} x={1460} y={280} value={10} prefix="up to ~" suffix=" t" label="One boulder" color="#2ecc71" />
    <Line c={c} f={f} t={t} pts={[JADE, [-130.2, 57.5], [-130.3, 55.2], RUPERT, [-140, 52], [-155, 46], [-172, 40]]} t0={T.shipped} t1={T.next} dur={2.0} color="#2ecc71" w={8} icon="i_container_ship" iconSize={120} />
    <Tag c={c} f={f} t={t} lon={-168} lat={42} t0={T.planet} t1={T.next} text="→ Asia" size={34} bg="#1d6b3a" />
    <Icon c={c} f={f} t={t} src="i_jade" lon={JADE[0]} lat={JADE[1]} dx={-150} t0={T.valley - 0.2} t1={T.end} size={140} />
    <Tag c={c} f={f} t={t} lon={JADE[0]} lat={JADE[1]} dy={110} t0={T.hardly} t1={T.end} text="Hardly anyone lives here" size={30} />
    {PORTALS.map((p, i) => <Portal key={i} c={c} t={t} f={f} p={p} />)}
  </>
);

export const ch08: Chapter = {
  T0: S, T1: T.end,
  keys: [
    [S + 1.0, -125.5, 57.2, 0.3, 0], [T.deeper + 2.5, -128, 58.6, 0.35, 0], [T.border, -129.5, 59.5, 0.5, 0], [T.called, -129.8, 59.3, 1.2, 0],
    [T.houses, -129.83, 59.3, 2.2, 0], [T.world, -129.83, 59.3, 2.3, 0], [T.notab, -129.8, 59.3, 2.0, 0], [T.hauled + 1.0, -129.6, 59.28, 1.9, 0],
    [T.erased, -129.83, 59.3, 2.1, 0], [T.knew, -129.83, 59.3, 1.9, 0], [T.jade, -129.7, 59.26, 2.0, 0], [T.world2, -129.7, 59.26, 1.8, 0],
    [T.shipped, -130.5, 57.5, 0.35, 0], [T.planet, -150, 50, 0.12, 0], [T.valley, -129.7, 59.25, 1.4, 0], [T.end, -129.9, 59.0, 1.0, 0],
  ],
  Screen,
  full: [973.866, 1030.906],
  sfx: [
    [S + 0.3, "wh2", 0.12, 1.2], [T.spooky, "im2", 0.12, 1.2], [T.border, "pop1", 0.1, 0.4], [T.called, "ck2", 0.1, 0.3], [T.called + 0.3, "sw4", 0.12, 1.0], [T.asbestos, "pop2", 0.11, 0.4],
    [T.company, "st1", 0.11, 0.5], [T.houses, "tk1", 0.08, 1.4], [T.school, "pop3", 0.1, 0.4], [T.hospital, "pop4", 0.1, 0.4], [T.rink, "pop5", 0.1, 0.4], [T.families, "pop1", 0.1, 0.4],
    [T.kids, "pop2", 0.1, 0.4], [T.married, "pop3", 0.1, 0.4], [T.lungs, "st2", 0.12, 0.5], [T.demand, "st1", 0.12, 0.5], [T.notab, "im1", 0.13, 1.2], [T.hauled, "wh6", 0.12, 1.6],
    [T.go - 0.1, "sw1", 0.12, 1.0], [T.tailings - 0.1, "sw4", 0.12, 1.0], [T.erased + 0.2, "rs1", 0.14, 1.0], [T.knew, "pop4", 0.1, 0.4], [T.jade, "ck6", 0.12, 0.6],
    [T.madeup, "pop5", 0.1, 0.4], [T.nephrite - 0.1, "sw1", 0.12, 1.0], [T.jewelry - 0.05, "sw4", 0.12, 1.0], [T.boulders - 0.05, "sw1", 0.12, 1.0], [T.tons, "tk1", 0.08, 1.0],
    [T.shipped, "wh5", 0.14, 1.8], [T.valley - 0.2, "pop1", 0.11, 0.4],
  ],
};

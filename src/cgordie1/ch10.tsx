// Capítulo 10 — Kitsault: el pueblo moderno que vivió 18 meses y quedó amueblado y vacío
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Chapter, at, Tag, Pin, Icon, BigWord, Sticker, Note, Line, Dots, Portal, PortalSpec, Num, PL, pj, pop, vis, ramp, win, fadeOut, clamp, SANS } from "./lib";

const S = at("now if casher");
const T = {
  stranger: at("even stranger", S), never: at("never got the chance", S), coast: at("toward the coast", S), alice: at("called alice arm", S), kits: at("called kitsalt", S),
  y70: at("late 1970s", S), moly: at("molybdenum mine", S), steel: at("harden steel", S), high: at("price was high", S), brand: at("brand new town", S), proper: at("a proper town", S),
  houses: at("modern houses", S), apts: at("apartment buildings", S), mall: at("shopping center", S), pool: at("swimming pool", S), hospital: at("a hospital", S), library: at("a library", S), pub: at("a pub", S), tennis: at("tennis courts", S),
  everything: at("everything a family", S), wild: at("coastal wilderness", S), n1200: at("around 1,200", S), school: at("kids started school", S), gardens: at("planted gardens", S),
  y80: at("early 1980s", S), crashed: at("crashed", S), worth: at("no longer worth", S), leave: at("pack up and leave", S), yearhalf: at("year and a half", S),
  eerie: at("the eerie part", S), unlike: at("unlike cassiar", S), torn: at("wasn't torn down", S), heat: at("kept the heat", S), caretaker: at("a caretaker", S), sat: at("just sat there", S),
  dishes: at("dishes and cupboards", S), books: at("books on library", S), carpets: at("carpets on the", S), noone: at("no one in it", S), decades: at("for decades", S), movie: at("movie set", S),
  later: at("years later", S), owner: at("single private owner", S), million: at("few million dollars", S), think: at("think about that", S), vancouver: at("nice house in vancouver", S),
  retreat: at("a retreat", S), artists: at("for artists", S), energy: at("energy project", S), asof: at("as of now", S), purpose: at("waiting for a purpose", S),
  flew: at("i flew over", S), cloud: at("low cloud", S), honest: at("honest with you", S), rows: at("neat rows", S), smoke: at("no smoke", S), cars: at("no cars", S), people: at("no people", S), chill: at("a chill", S), end: at("now let's talk", S),
};
const K = PL("kitsault");
const ALICE: [number, number][] = [[-129.95, 55.25], [-129.75, 55.33], [-129.6, 55.42], K];
const C = (n: string, lic: string) => `Photo: ${n} · Wikimedia Commons · ${lic}`;

const PORTALS: PortalSpec[] = [
  { src: "raw/kitsault_ferrimolybdite.jpg", t0: T.moly - 0.1, t1: T.high + 0.3, lon: K[0], lat: K[1], label: "Molybdenum ore · Alice Arm", credit: C("Pacific Museum of Earth", "CC BY-SA 2.0") },
  { src: "img/s_kitsault_mall.jpg", t0: T.sat - 0.1, t1: T.noone - 0.05, lon: K[0], lat: K[1] },
  { src: "img/s_kitsault_pool.jpg", t0: T.noone - 0.05, t1: T.later - 0.05, lon: K[0], lat: K[1] },
  { src: "img/g_kitsault_flyover.jpg", t0: T.flew - 0.1, t1: T.chill + 1.6, lon: K[0], lat: K[1] },
];

// el pueblo: casas en filas + bloques de departamentos; la gente se va, las casas quedan, las ventanas siguen tibias
const GRID = Array.from({ length: 28 }, (_, i) => [(i % 7) - 3, Math.floor(i / 7) - 1.5] as [number, number]);
const KTown: React.FC<{ c: any; f: number; t: number }> = ({ c, f, t }) => {
  if (!vis(t, T.houses - 0.2, T.later + 0.6)) return null;
  const [cx, cy] = pj(c, K[0], K[1]);
  const sc = Math.min(1.5, Math.max(0.6, c.z / 1.6));
  const warm = win(t, T.heat, T.later, 0.8);
  const o = fadeOut(t, T.later + 0.6, 0.6);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: o }}>
      <g transform={`translate(${cx},${cy}) scale(${sc})`}>
        {GRID.map(([gx, gy], i) => {
          const x = gx * 58, y = gy * 54 + 40, k = pop(f, T.houses + i * 0.035, 11);
          return (
            <g key={i} transform={`translate(${x},${y}) scale(${k})`}>
              <rect x={-20} y={-4} width={40} height={24} fill="#e9e4d8" stroke="#222" strokeWidth={3} />
              <path d="M-24,-4 L0,-20 L24,-4 Z" fill="#3e4a5c" stroke="#222" strokeWidth={3} />
              <rect x={-12} y={3} width={9} height={8} fill={warm > 0 ? `rgba(255,196,90,${0.3 + 0.7 * warm})` : "#6d8aa8"} />
              <rect x={4} y={3} width={9} height={8} fill={warm > 0 ? `rgba(255,196,90,${0.3 + 0.7 * warm})` : "#6d8aa8"} />
            </g>
          );
        })}
        {[[-260, -150], [-190, -170], [-120, -150]].map(([x, y], i) => {
          const k = pop(f, T.apts + i * 0.15, 11);
          return (
            <g key={i} transform={`translate(${x},${y}) scale(${k})`}>
              <rect x={-26} y={-70} width={52} height={90} fill="#d6d0c4" stroke="#222" strokeWidth={3} />
              {Array.from({ length: 12 }, (_, j) => <rect key={j} x={-18 + (j % 3) * 14} y={-62 + Math.floor(j / 3) * 20} width={9} height={11} fill={warm > 0 ? `rgba(255,196,90,${0.3 + 0.7 * warm})` : "#6d8aa8"} />)}
            </g>
          );
        })}
      </g>
    </svg>
  );
};

// precio del molibdeno: sube y se desploma (gráfico dibujado a mano)
const PriceChart: React.FC<{ f: number; t: number }> = ({ f, t }) => {
  if (!vis(t, T.y80 - 0.2, T.leave)) return null;
  const s = pop(f, T.y80 - 0.2, 12) * fadeOut(t, T.leave);
  const k = ramp(t, T.y80, T.crashed - T.y80 + 0.8);
  const pts = [[0, 200], [80, 170], [160, 110], [230, 40], [270, 20], [300, 60], [340, 190], [420, 230], [500, 235]];
  const n = Math.max(2, Math.ceil(k * pts.length));
  const d = pts.slice(0, n).map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join("");
  return (
    <div style={{ zIndex: 20, position: "absolute", left: 1150, top: 200, transform: `scale(${s})`, transformOrigin: "50% 50%", background: "rgba(12,14,20,.9)", border: "3px solid #fff", borderRadius: 14, padding: "18px 26px 14px" }}>
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 30, color: "#fff", marginBottom: 6 }}>Molybdenum price</div>
      <svg width={520} height={250}>
        <line x1={0} y1={240} x2={510} y2={240} stroke="#777" strokeWidth={2} />
        <path d={d} fill="none" stroke={k > 0.6 ? "#ff3b30" : "#2ecc71"} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
        <text x={0} y={236} fill="#aaa" fontFamily={SANS} fontSize={20}>1978</text>
        <text x={440} y={236} fill="#aaa" fontFamily={SANS} fontSize={20}>1983</text>
      </svg>
    </div>
  );
};

const Screen: Chapter["Screen"] = ({ c, f, t }) => {
  const night = win(t, T.eerie, T.later, 0.8);
  return (
    <>
      <AbsoluteFill style={{ background: "#0a1226", opacity: 0.45 * night }} />
      <Sticker f={f} t={t} t0={T.stranger} t1={T.coast} x={1450} y={260} size={56}>Even stranger…</Sticker>
      <Line c={c} f={f} t={t} pts={ALICE} t0={T.alice} t1={T.y70} dur={1.4} color="#7fd3ff" w={10} />
      <Tag c={c} f={f} t={t} lon={-129.8} lat={55.28} dy={50} t0={T.alice + 0.3} t1={T.y70} text="Alice Arm" size={30} bg="#1e88e5" />
      <Pin c={c} f={f} t={t} lon={K[0]} lat={K[1]} t0={T.kits} t1={T.later} label="Kitsault" color="#ffd23a" size={30} />
      <Note f={f} t={t} t0={T.y70} t1={T.y80} text="Late 1970s" />
      <Icon c={c} f={f} t={t} src="i_mine" lon={K[0] + 0.12} lat={K[1] + 0.08} t0={T.y70 + 0.3} t1={T.eerie} size={120} grey={ramp(t, T.crashed, 0.6)} />
      <Sticker f={f} t={t} t0={T.steel} t1={T.brand} x={470} y={250} size={56}>🔩 Hardens steel</Sticker>
      <Sticker f={f} t={t} t0={T.high} t1={T.brand} x={470} y={370} rot={3} size={56}>Price: <span style={{ color: "#2ecc71" }}>high ↑</span></Sticker>
      <BigWord f={f} t={t} t0={T.brand} t1={T.houses} text={<span>A BRAND <span style={{ color: "#ffd23a" }}>NEW TOWN</span></span>} y={930} size={104} />
      <KTown c={c} f={f} t={t} />
      {[["i_mall", T.mall, 0.22, 0.02], ["i_pool", T.pool, 0.25, -0.06], ["i_hospital", T.hospital, -0.25, -0.07]].map(([src, t0, dlo, dla], i) => (
        <Icon key={i} c={c} f={f} t={t} src={src as string} lon={K[0] + (dlo as number)} lat={K[1] + (dla as number)} t0={t0 as number} t1={T.y80} size={110} />
      ))}
      {[["Shopping centre", T.mall], ["Swimming pool", T.pool], ["Hospital", T.hospital], ["Library", T.library], ["Pub", T.pub], ["Tennis courts", T.tennis]].map(([s, t0], i) => (
        <Sticker key={i} f={f} t={t} t0={t0 as number} t1={T.everything + 1.2} x={i < 3 ? 380 : 1540} y={260 + (i % 3) * 120} rot={i % 2 ? 3 : -3} size={46}>{s as string}</Sticker>
      ))}
      <Num f={f} t={t} t0={T.n1200} t1={T.y80} x={1460} y={280} value={1200} prefix="~" label="People moved in" />
      <Sticker f={f} t={t} t0={T.school} t1={T.y80} x={470} y={260} size={52}>🎒 School</Sticker>
      <Sticker f={f} t={t} t0={T.gardens} t1={T.y80} x={470} y={380} rot={3} size={52}>🌱 Gardens</Sticker>
      <PriceChart f={f} t={t} />
      <Dots c={c} f={f} t={t} pts={[K, [-129.7, 55.38], [-129.95, 55.25], [-130.3, 55.05]]} t0={T.leave} t1={T.eerie} dur={1.0} color="#ffffff" icon="i_people" iconSize={90} />
      <Sticker f={f} t={t} t0={T.yearhalf} t1={T.eerie} x={1450} y={260} size={72}>Open just <span style={{ color: "#ff3b30" }}>18 months</span></Sticker>

      {/* lo inquietante */}
      <BigWord f={f} t={t} t0={T.eerie} t1={T.heat} text={<span style={{ color: "#c9d6ff", textShadow: "0 0 30px #6c8cff" }}>THE EERIE PART</span>} y={930} size={104} />
      <Sticker f={f} t={t} t0={T.torn} t1={T.heat} x={1450} y={260} size={56}>Not torn down</Sticker>
      <Sticker f={f} t={t} t0={T.heat} t1={T.sat} x={1450} y={260} size={56}>🔥 Heat kept on</Sticker>
      <Sticker f={f} t={t} t0={T.caretaker} t1={T.sat} x={1450} y={380} rot={3} size={56}>👤 One caretaker</Sticker>
      {[["🍽 Dishes in cupboards", T.dishes], ["📚 Books on shelves", T.books], ["Carpets on floors", T.carpets]].map(([s, t0], i) => (
        <Sticker key={i} f={f} t={t} t0={t0 as number} t1={T.noone - 0.1} x={1450} y={250 + i * 115} rot={i % 2 ? 3 : -3} size={48}>{s as string}</Sticker>
      ))}
      <Sticker f={f} t={t} t0={T.decades} t1={T.later - 0.1} x={1450} y={270} size={76}>1983 → <span style={{ color: "#c9d6ff" }}>{Math.round(interpolate(t, [T.decades + 0.2, T.decades + 3.5], [1983, 2004], clamp))}</span></Sticker>
      <Sticker f={f} t={t} t0={T.movie} t1={T.later - 0.1} x={480} y={900} rot={-4} size={60}>🎬 a movie set</Sticker>

      {/* se vende un pueblo */}
      <Sticker f={f} t={t} t0={T.owner} t1={T.retreat} x={470} y={250} size={56}>One private owner</Sticker>
      <Sticker f={f} t={t} t0={T.million} t1={T.retreat} x={470} y={370} rot={3} size={60}>A few <span style={{ color: "#2ecc71" }}>million $</span></Sticker>
      <BigWord f={f} t={t} t0={T.think} t1={T.retreat} text={<span>A WHOLE TOWN <span style={{ color: "#ffd23a" }}>&lt;</span> ONE VANCOUVER HOUSE</span>} y={930} size={76} />
      <Pin c={c} f={f} t={t} {...(() => { const [lon, lat] = PL("vancouver"); return { lon, lat }; })()} t0={T.vancouver} t1={T.retreat} label="Vancouver" />
      {[["Retreat?", T.retreat], ["Artists?", T.artists], ["Energy?", T.energy]].map(([s, t0], i) => (
        <Sticker key={i} f={f} t={t} t0={t0 as number} t1={T.asof} x={1450} y={250 + i * 115} rot={i % 2 ? 3 : -3} size={54}>{s as string}</Sticker>
      ))}
      {[["No smoke", T.smoke], ["No cars", T.cars], ["No people", T.people]].map(([s, t0], i) => (
        <Sticker key={i} f={f} t={t} t0={t0 as number} t1={T.end} x={1450} y={250 + i * 115} rot={i % 2 ? 3 : -3} size={54}>{s as string} <span style={{ color: "#ff3b30" }}>✗</span></Sticker>
      ))}
      {PORTALS.map((p, i) => <Portal key={i} c={c} t={t} f={f} p={p} />)}
    </>
  );
};

export const ch10: Chapter = {
  T0: S, T1: T.end,
  keys: [
    [S + 0.5, -130.2, 57.0, 0.5, 0], [T.coast, -129.9, 55.8, 0.75, 0], [T.alice, -129.7, 55.4, 1.4, 0], [T.kits, -129.5, 55.45, 2.0, 0],
    [T.brand, -129.48, 55.46, 2.4, 0], [T.everything, -129.48, 55.46, 2.6, 0], [T.y80, -129.48, 55.46, 2.3, 0], [T.leave, -129.6, 55.4, 1.9, 0],
    [T.eerie, -129.48, 55.46, 2.6, 0], [T.decades, -129.48, 55.46, 2.8, 0], [T.later, -129.48, 55.46, 2.4, 0],
    [T.vancouver - 0.3, -126.0, 52.3, 0.2, 0], [T.retreat, -129.4, 55.4, 1.6, 0], [T.end, -129.4, 55.45, 1.4, 0],
  ],
  Screen,
  full: [1195.713, 1255.693],
  sfx: [
    [S + 0.2, "wh2", 0.12, 1.2], [T.stranger, "pop1", 0.1, 0.4], [T.alice, "wh6", 0.1, 1.2], [T.kits, "ck2", 0.1, 0.3], [T.moly - 0.1, "sw4", 0.12, 1.0],
    [T.steel, "pop2", 0.1, 0.4], [T.high, "pop3", 0.1, 0.4], [T.brand, "im1", 0.13, 1.2], [T.houses, "tk1", 0.08, 1.4], [T.mall, "pop4", 0.1, 0.4], [T.pool, "pop5", 0.1, 0.4],
    [T.hospital, "pop1", 0.1, 0.4], [T.library, "pop2", 0.1, 0.4], [T.pub, "pop3", 0.1, 0.4], [T.tennis, "pop4", 0.1, 0.4], [T.n1200, "tk1", 0.08, 1.0], [T.crashed, "im2", 0.14, 1.2],
    [T.leave, "wh2", 0.12, 1.2], [T.yearhalf, "st1", 0.13, 0.5], [T.eerie, "wh5", 0.12, 1.6], [T.heat, "pop5", 0.1, 0.4], [T.sat - 0.1, "sw4", 0.12, 1.0],
    [T.noone - 0.05, "sw1", 0.12, 1.0], [T.decades, "tk1", 0.08, 1.4], [T.million, "ck6", 0.12, 0.6], [T.think, "st2", 0.13, 0.5], [T.retreat, "pop1", 0.1, 0.4],
    [T.artists, "pop2", 0.1, 0.4], [T.energy, "pop3", 0.1, 0.4], [T.flew - 0.1, "sw4", 0.12, 1.0], [T.smoke, "st1", 0.1, 0.5], [T.cars, "st2", 0.1, 0.5], [T.people, "st1", 0.1, 0.5],
  ],
};

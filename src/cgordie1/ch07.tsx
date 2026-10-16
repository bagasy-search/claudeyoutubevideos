// Capítulo 7 — el Peace River: represa Bennett, el lago Williston que tapó los valles, y Site C
import React from "react";
import { Chapter, at, Tag, Pin, Icon, BigWord, Sticker, Note, Line, Dots, Portal, PortalSpec, Num, PL, pj, vis, win, ramp, fadeOut } from "./lib";

const S = at("so that's the wild");
const T = {
  manmade: at("man-made", S), enormous: at("is enormous", S), head: at("head south and west", S), peace: at("peace river country", S), y60: at("in the 1960s", S), dam: at("a giant dam", S),
  wac: at("wack bennett dam", S), gates: at("closed the gates", S), backed: at("backed up and created", S), natural: at("not natural", S), williston: at("williston lake", S), biggest: at("biggest body of fresh", S),
  price: at("at a price", S), before: at("before the water came", S), trapping: at("trapping lines", S), homes: at("homes", S + 30), trails: at("trails", S + 30), finlay: at("finley forks", S), two: at("two rivers met", S),
  people: at("the people of the", S), gens: at("for generations", S), rose: at("when the water rose", S), whole: at("whole valleys gone", S), pilots: at("even today pilots", S), drowned: at("drowned trees", S), fingers: at("the fingers of", S),
  strange: at("and here's the strange", S), logs: at("floating logs", S), icebergs: at("like icebergs", S), wind: at("the wind can", S), narrow: at("long and narrow", S), looks: at("looks peaceful", S), respect: at("a lot of respect", S),
  story: at("and the peace river story", S), downstream: at("downstream from the", S), more: at("built more", S), second: at("a second dam", S), third: at("a third one", S), argument: at("biggest argument", S), called: at("it's called site", S),
  sits: at("site c sits", S), fsj: at("fort st john", S), construction: at("construction started", S), ten: at("better part of 10", S), money: at("a lot more money", S),
  filled: at("when it filled", S), km: at("more than 80", S), farmland: at("best farmland", S), bottom: at("river-bottom land", S), veg: at("grown vegetables", S), potato: at("grow a potato", S),
  treaty: at("treaty 8", S), courts: at("in the courts", S), hunted: at("hunted fished", S), buried: at("buried their people", S), farmers: at("farmers fought", S), same: at("same side of the river", S),
  power: at("needed the power", S), clean: at("clean power", S), flowing: at("the power is flowing", S), ask: at("if you ask", S), flip: at("down south you flip", S), lights: at("the lights come on", S),
  gave: at("gave up a valley", S), never: at("never know it", S), end: at("let's keep going west", S),
};
const DAM = PL("bennett_dam"), FF = PL("finlay_forks");
const PCD: [number, number] = [-121.97, 55.98], SITEC: [number, number] = [-120.91, 56.2], FSJ: [number, number] = [-120.85, 56.25], TKD: [number, number] = [-124.97, 56.9];
// el lago Williston dibujado como tres brazos que se llenan desde la represa
const PEACE_R: [number, number][] = [DAM, [-122.6, 56.05], [-123.2, 56.0], FF];
const FINLAY_R: [number, number][] = [FF, [-124.1, 56.3], [-124.45, 56.6], [-124.85, 56.85], [-125.15, 57.0]];
const PARSNIP_R: [number, number][] = [FF, [-123.6, 55.7], [-123.35, 55.45], [-123.15, 55.3]];
const SITEC_RES: [number, number][] = [SITEC, [-121.2, 56.17], [-121.5, 56.12], [-121.9, 56.03]];
const VALLEY: [number, number][] = [[-124.3, 56.45], [-123.5, 56.02], [-123.45, 55.6], [-124.7, 56.75], [-122.9, 56.03]];
const C = (n: string, lic: string) => `Photo: ${n} · Wikimedia Commons · ${lic}`;

const PORTALS: PortalSpec[] = [
  { src: "raw/williston_peace_river_british_colu_0.jpg", t0: T.peace - 0.1, t1: T.dam - 0.05, lon: -121.2, lat: 56.1, label: "Peace River country", credit: C("awmcphee", "CC BY-SA 4.0") },
  { src: "img/s_bennett_dam.jpg", t0: T.wac - 0.1, t1: T.backed - 0.05, lon: DAM[0], lat: DAM[1], label: "W.A.C. Bennett Dam" },
  { src: "img/s_finlay_forks.jpg", t0: T.finlay + 0.4, t1: T.people - 0.05, lon: FF[0], lat: FF[1], label: "Finlay Forks" },
  { src: "raw/williston_williston_lake_0.jpg", t0: T.pilots - 0.1, t1: T.drowned - 0.05, lon: -124, lat: 56.3, credit: C("Shawn from Airdrie", "CC BY-SA 2.0") },
  { src: "img/s_williston_drown.jpg", t0: T.drowned - 0.05, t1: T.strange - 0.05, lon: -124, lat: 56.3 },
  { src: "raw/williston_williston_lake_1.jpg", t0: T.wind - 0.1, t1: T.looks - 0.05, lon: -124.4, lat: 56.6, label: "Williston Lake", credit: C("Shawn from Airdrie", "CC BY-SA 2.0") },
  { src: "img/g_williston_float.jpg", t0: T.looks - 0.05, t1: T.story - 0.05, lon: -124.4, lat: 56.6 },
  { src: "img/s_site_c.jpg", t0: T.sits + 0.9, t1: T.ten + 1.0, lon: SITEC[0], lat: SITEC[1], label: "Site C" },
  { src: "img/g_peace_farm.jpg", t0: T.bottom - 0.1, t1: T.potato + 1.4, lon: -121.4, lat: 56.14 },
];

// troncos flotando a la deriva sobre el lago
const Logs: React.FC<{ c: any; t: number }> = ({ c, t }) => {
  if (!vis(t, T.logs - 0.3, T.wind)) return null;
  const o = Math.min(ramp(t, T.logs - 0.3, 0.6), fadeOut(t, T.wind, 0.5));
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: o }}>
      {Array.from({ length: 34 }, (_, i) => {
        const r = [...FINLAY_R, ...PEACE_R][i % 9];
        const [x, y] = pj(c, r[0] + Math.sin(i * 3.7) * 0.18 + (t - T.logs) * 0.012 * ((i % 3) - 1), r[1] + Math.cos(i * 2.3) * 0.08);
        return <rect key={i} x={x} y={y} width={46 + (i % 4) * 14} height={9} rx={4} fill="#6b4a2a" stroke="#2d1d0e" strokeWidth={2} transform={`rotate(${(i * 53 + t * 6 * ((i % 2) * 2 - 1)) % 180} ${x} ${y})`} />;
      })}
    </svg>
  );
};


const Screen: Chapter["Screen"] = ({ c, f, t }) => {
  // el agua: se llena con el cierre, se retira en "antes", vuelve a subir
  const fill1 = vis(t, T.backed, T.before + 0.4);
  const fill2 = t >= T.rose - 0.05;
  const W = (pts: [number, number][], t0: number, t1: number, d: number) => <Line c={c} f={f} t={t} pts={pts} t0={t0} t1={t1} dur={d} color="#2a7fd6" w={26} glow={false} />;
  const valleyGrey = ramp(t, T.rose, 1.2);
  return (
    <>
      {/* lo hecho por el hombre */}
      <Sticker f={f} t={t} t0={S + 0.4} t1={T.manmade} x={560} y={270} size={60}>Wild <span style={{ color: "#2ecc71" }}>✓</span> · Lonely <span style={{ color: "#2ecc71" }}>✓</span></Sticker>
      <BigWord f={f} t={t} t0={T.manmade} t1={T.head} text={<span>MAN-<span style={{ color: "#ffd23a" }}>MADE</span></span>} y={930} size={120} />
      <Icon c={c} f={f} t={t} src="i_dam" lon={DAM[0]} lat={DAM[1]} t0={T.enormous} t1={T.head + 0.5} size={200} />
      <Pin c={c} f={f} t={t} lon={DAM[0]} lat={DAM[1]} t0={T.dam} t1={T.price} label="Bennett Dam" side="r" />
      <Note f={f} t={t} t0={T.y60} t1={T.price} text="1960s" />

      {fill1 && <>{W(PEACE_R, T.backed - 0.05, T.before + 0.4, 1.2)}{W(FINLAY_R, T.backed + 1.0, T.before + 0.4, 1.4)}{W(PARSNIP_R, T.backed + 1.2, T.before + 0.4, 1.2)}</>}
      {fill2 && <>{W(PEACE_R, T.rose - 0.05, T.end, 1.0)}{W(FINLAY_R, T.rose + 0.6, T.end, 1.3)}{W(PARSNIP_R, T.rose + 0.8, T.end, 1.1)}</>}
      <Tag c={c} f={f} t={t} lon={-124.4} lat={56.75} dx={-120} t0={T.williston} t1={T.price} text="Williston Lake" size={34} bg="#1e88e5" />
      <Sticker f={f} t={t} t0={T.natural} t1={T.williston} x={1450} y={260} size={60}>Not natural <span style={{ color: "#ff3b30" }}>!</span></Sticker>
      <Sticker f={f} t={t} t0={T.biggest} t1={T.price} x={1450} y={260} size={52}>Biggest body of fresh water in B.C.</Sticker>

      {/* antes del agua */}
      <Note f={f} t={t} t0={T.before} t1={T.rose} text="Before the water" />
      {VALLEY.map(([lo, la], i) => <Icon key={i} c={c} f={f} t={t} src="i_cabin" lon={lo} lat={la} t0={T.homes + i * 0.12} t1={T.whole + 0.6} size={90} grey={valleyGrey} dy={valleyGrey * 30} />)}
      <Dots c={c} f={f} t={t} pts={[[-124.9, 56.3], [-124.5, 56.15], [-124.0, 55.9], [-123.7, 55.75]]} t0={T.trapping} t1={T.rose} dur={1.0} color="#ffffff" />
      <Tag c={c} f={f} t={t} lon={-124.9} lat={56.3} dy={-60} t0={T.trapping} t1={T.rose} text="Trapping lines" size={26} bg="#6b4f2a" />
      <Tag c={c} f={f} t={t} lon={-123.0} lat={55.75} t0={T.homes} t1={T.rose} text="Homes" size={26} bg="#111" />
      <Tag c={c} f={f} t={t} lon={-122.9} lat={56.3} t0={T.trails} t1={T.rose} text="Trails" size={26} bg="#2a7d2e" />
      <Pin c={c} f={f} t={t} lon={FF[0]} lat={FF[1]} t0={T.finlay} t1={T.rose} label="Finlay Forks" side="b" color="#ffd23a" />
      <Line c={c} f={f} t={t} pts={FINLAY_R.slice().reverse()} t0={T.two} t1={T.people + 0.2} dur={0.9} color="#7fd3ff" w={8} />
      <Line c={c} f={f} t={t} pts={PARSNIP_R.slice().reverse()} t0={T.two + 0.2} t1={T.people + 0.2} dur={0.9} color="#7fd3ff" w={8} />
      <Tag c={c} f={f} t={t} lon={TKD[0]} lat={TKD[1]} dy={-60} t0={T.people + 0.3} t1={T.rose} text="Tsay Keh Dene" size={30} bg="#8e44ad" />
      <Sticker f={f} t={t} t0={T.gens} t1={T.rose} x={1450} y={260} size={60}>For generations</Sticker>
      <BigWord f={f} t={t} t0={T.whole} t1={T.pilots} text={<span>WHOLE VALLEYS, <span style={{ color: "#ff3b30" }}>GONE</span></span>} y={930} size={104} />
      <BigWord f={f} t={t} t0={T.fingers + 0.3} t1={T.strange} text="“FINGERS OF A FOREST”" y={940} size={80} />

      {/* el lago traicionero */}
      <Logs c={c} t={t} />
      <Sticker f={f} t={t} t0={T.icebergs} t1={T.wind} x={1450} y={260} size={60}>🧊 like icebergs</Sticker>
      <Sticker f={f} t={t} t0={T.wind + 0.5} t1={T.looks} x={1450} y={260} rot={3} size={56}>🌊 waves that sink boats</Sticker>
      <Sticker f={f} t={t} t0={T.narrow} t1={T.looks} x={1450} y={390} rot={-3} size={56}>Long &amp; narrow</Sticker>
      <Sticker f={f} t={t} t0={T.respect} t1={T.story} x={1450} y={260} size={56}>Locals: respect it</Sticker>

      {/* el río no terminó */}
      <Note f={f} t={t} t0={T.story} t1={T.called} text="Not over yet" />
      <Icon c={c} f={f} t={t} src="i_dam" lon={DAM[0]} lat={DAM[1]} t0={T.downstream} t1={T.filled} size={130} />
      <Tag c={c} f={f} t={t} lon={DAM[0]} lat={DAM[1]} dy={60} t0={T.downstream} t1={T.filled} text="1" size={30} bg="#1e88e5" />
      <Dots c={c} f={f} t={t} pts={[DAM, PCD, [-121.5, 56.12], SITEC]} t0={T.downstream + 0.6} t1={T.filled} dur={1.4} color="#7fd3ff" />
      <Icon c={c} f={f} t={t} src="i_dam" lon={PCD[0]} lat={PCD[1]} t0={T.second} t1={T.filled} size={130} />
      <Tag c={c} f={f} t={t} lon={PCD[0]} lat={PCD[1]} dy={60} t0={T.second + 0.3} t1={T.filled} text="2 · 1980s" size={30} bg="#1e88e5" />
      <Icon c={c} f={f} t={t} src="i_dam" lon={SITEC[0]} lat={SITEC[1]} t0={T.third} t1={T.end} size={160} />
      <Tag c={c} f={f} t={t} lon={SITEC[0]} lat={SITEC[1]} dy={60} t0={T.third + 0.3} t1={T.filled} text="3" size={30} bg="#e3261c" />
      <Sticker f={f} t={t} t0={T.argument} t1={T.sits} x={1450} y={260} size={56}>The North's biggest fight</Sticker>
      <BigWord f={f} t={t} t0={T.called + 0.6} t1={T.sits + 0.8} text={<span>SITE <span style={{ color: "#ffd23a" }}>C</span></span>} y={930} size={140} />
      <Pin c={c} f={f} t={t} lon={FSJ[0]} lat={FSJ[1]} t0={T.fsj} t1={T.filled} label="Fort St. John" />
      <Sticker f={f} t={t} t0={T.construction} t1={T.filled} x={1450} y={260} size={60}>2015 → ~2025</Sticker>
      <Sticker f={f} t={t} t0={T.money} t1={T.filled} x={1450} y={400} rot={3} size={56}>$8 B → $16 B</Sticker>

      {/* el embalse y la mejor tierra */}
      <Line c={c} f={f} t={t} pts={SITEC_RES} t0={T.filled} t1={T.end} dur={2.2} color="#2a7fd6" w={22} glow={false} />
      <Num f={f} t={t} t0={T.km} t1={T.bottom - 0.2} x={1460} y={280} value={80} prefix=">" suffix=" km" label="Flooded valley" color="#7fd3ff" />
      <Icon c={c} f={f} t={t} src="i_tractor" lon={-121.4} lat={56.14} t0={T.farmland} t1={T.bottom} size={130} />
      <Tag c={c} f={f} t={t} lon={-121.4} lat={56.14} dy={70} t0={T.farmland + 0.2} t1={T.bottom} text="Best farmland in the North" size={28} bg="#2a7d2e" />
      <Sticker f={f} t={t} t0={T.veg} t1={T.potato + 1.3} x={1450} y={260} size={56}>Warm · sheltered · fertile</Sticker>
      <Sticker f={f} t={t} t0={T.potato} t1={T.potato + 1.3} x={480} y={900} rot={-4} size={70}>🥔 ?</Sticker>

      {/* la pelea */}
      <Tag c={c} f={f} t={t} lon={-121.6} lat={56.45} t0={T.treaty} t1={T.power} text="Treaty 8 First Nations" size={30} bg="#8e44ad" />
      <Sticker f={f} t={t} t0={T.courts} t1={T.farmers} x={1450} y={260} size={60}>⚖ Years in court</Sticker>
      {[["Hunted", T.hunted], ["Fished", T.hunted + 0.45], ["Buried their people", T.buried]].map(([s, t0], i) => (
        <Sticker key={i} f={f} t={t} t0={t0 as number} t1={T.farmers} x={1450} y={400 + i * 110} rot={i % 2 ? 3 : -3} size={48}>{s as string}</Sticker>
      ))}
      <Tag c={c} f={f} t={t} lon={-121.0} lat={56.0} t0={T.farmers} t1={T.power} text="Farmers" size={30} bg="#2a7d2e" />
      <BigWord f={f} t={t} t0={T.same} t1={T.power} text={<span>SAME SIDE <span style={{ color: "#ffd23a" }}>FOR ONCE</span></span>} y={930} size={96} />

      {/* la energía va al sur */}
      <Line c={c} f={f} t={t} pts={[SITEC, [-121.5, 54.0], [-122.0, 51.5], PL("vancouver")]} t0={T.power} t1={T.gave} dur={2.0} color="#ffd23a" w={8} icon="i_bolt" iconSize={110} />
      <Sticker f={f} t={t} t0={T.clean} t1={T.ask} x={1450} y={260} size={60}>⚡ Clean power</Sticker>
      <Pin c={c} f={f} t={t} {...(() => { const [lon, lat] = PL("vancouver"); return { lon, lat }; })()} t0={T.flip} t1={T.gave} label="Down south" color="#ffd23a" size={34} />
      <Sticker f={f} t={t} t0={T.lights - 0.2} t1={T.gave} x={1450} y={260} size={64}>💡 click</Sticker>
      <Tag c={c} f={f} t={t} lon={SITEC[0]} lat={SITEC[1]} dy={-80} t0={T.gave} t1={T.end} text="A valley, given up" size={32} bg="#e3261c" />
      {PORTALS.map((p, i) => <Portal key={i} c={c} t={t} f={f} p={p} />)}
    </>
  );
};

export const ch07: Chapter = {
  T0: S, T1: T.end,
  keys: [
    [S + 1.0, -126, 57.5, 0.18, 0], [T.manmade, -124, 56.8, 0.3, 0], [T.head, -122.5, 56.2, 0.8, 0], [T.y60, -122.3, 56.05, 1.6, 0],
    [T.backed, -123.4, 56.2, 0.95, 0], [T.biggest + 1.2, -123.7, 56.2, 0.9, 0], [T.before, -123.8, 56.15, 1.15, 0], [T.people, -124.2, 56.4, 1.0, 0],
    [T.rose, -123.8, 56.2, 0.95, 0], [T.pilots, -123.9, 56.25, 1.05, 0], [T.logs - 0.3, -124.2, 56.45, 1.7, 0], [T.wind, -124.3, 56.55, 1.5, 0],
    [T.story, -123.0, 56.1, 0.8, 0], [T.downstream + 0.5, -121.55, 56.1, 2.3, 0], [T.called, -121.5, 56.12, 2.4, 0],
    [T.sits, -121.0, 56.2, 3.0, 0], [T.filled, -121.4, 56.12, 2.4, 0], [T.km + 1.5, -121.4, 56.12, 2.5, 0], [T.treaty, -121.3, 56.2, 2.2, 0], [T.same + 1.6, -121.25, 56.18, 2.1, 0],
    [T.power, -121.5, 54.8, 0.25, 0], [T.flip, -122.0, 52.5, 0.22, 0], [T.gave, -121.3, 56.1, 1.8, 0], [T.end, -121.6, 56.1, 1.3, 0],
  ],
  Screen,
  full: [794.746, 933.686],
  sfx: [
    [S + 0.4, "pop1", 0.1, 0.4], [T.manmade, "st1", 0.13, 0.5], [T.enormous, "im1", 0.13, 1.2], [T.head, "wh2", 0.12, 1.2], [T.peace - 0.1, "sw4", 0.12, 1.0], [T.y60, "ck2", 0.1, 0.3],
    [T.wac - 0.1, "sw1", 0.12, 1.0], [T.backed, "wh6", 0.12, 2.0], [T.natural, "st2", 0.12, 0.5], [T.williston, "pop2", 0.11, 0.4], [T.before, "wh2", 0.1, 1.2],
    [T.trapping, "pop3", 0.1, 0.4], [T.homes, "pop4", 0.1, 0.4], [T.trails, "pop5", 0.1, 0.4], [T.finlay, "ck2", 0.1, 0.3], [T.finlay + 0.4, "sw4", 0.12, 1.0], [T.people + 0.3, "pop1", 0.1, 0.4],
    [T.rose, "wh6", 0.13, 2.0], [T.whole, "im2", 0.14, 1.2], [T.pilots - 0.1, "sw1", 0.12, 1.0], [T.drowned - 0.05, "sw4", 0.12, 1.0], [T.logs - 0.3, "wh2", 0.1, 1.2],
    [T.icebergs, "pop2", 0.1, 0.4], [T.wind - 0.1, "sw1", 0.12, 1.0], [T.looks - 0.05, "sw4", 0.12, 1.0], [T.downstream, "wh5", 0.14, 1.6], [T.second, "pop3", 0.11, 0.4], [T.third, "pop4", 0.12, 0.4],
    [T.called + 0.6, "im1", 0.15, 1.4], [T.sits + 0.9, "sw1", 0.12, 1.0], [T.construction, "st1", 0.11, 0.5], [T.money, "st2", 0.11, 0.5], [T.filled, "wh6", 0.12, 1.6], [T.km, "tk1", 0.08, 1.0],
    [T.bottom - 0.1, "sw4", 0.12, 1.0], [T.potato, "pop5", 0.11, 0.4], [T.treaty, "pop1", 0.11, 0.4], [T.courts, "st1", 0.11, 0.5], [T.farmers, "pop2", 0.11, 0.4], [T.same, "im2", 0.13, 1.0],
    [T.power, "wh5", 0.14, 1.6], [T.lights - 0.2, "ck6", 0.12, 0.6], [T.gave, "st2", 0.12, 0.5],
  ],
};

// Capítulo 5 — Atlin (la fiebre del oro de 1898) y la línea del Yukon Telegraph
import React from "react";
import { Chapter, at, Tag, Pin, Icon, BigWord, Sticker, Note, Line, Dots, Portal, PortalSpec, Num, PL, win, ramp } from "./lib";

const S = at("now if you keep heading");
const T = {
  yukon: at("against the yukon border", S), town: at("little town on the", S), lake: at("the lake is atlin", S), biggest: at("the biggest natural", S), atlin: at("and the town is atlin", S),
  y1898: at("in 1898", S), klondike: at("the klondike gold rush", S), tens: at("tens of thousands", S), prospectors: at("two prospectors", S), creek: at("decided to try", S), gold: at("they found gold", S), pine: at("pine creek", S),
  word: at("word got out", S), within: at("within months", S), turned: at("turned around and", S), tent: at("a tent city", S), hotels: at("there were hotels", S), saloons: at("saloons", S), paper: at("a newspaper", S), mountains: at("over the mountains", S), busiest: at("one of the busiest", S),
  faded: at("the rush faded", S), never: at("atlin never quite", S), few: at("a few hundred", S), old: at("old wooden buildings", S), still: at("still working for gold", S), float: at("i've landed a float", S),
  reflected: at("reflected so perfectly", S), oldtimers: at("some of the old", S), place: at("it was the place", S),
  another: at("and here's another piece", S), fever: at("when the gold fever", S), noRoad: at("there was no road", S), railway: at("no railway", S), radio: at("no radio", S),
  built: at("so they built", S), wire: at("just a single wire", S), thousand: at("more than a thousand", S), called: at("it was called the yukon", S), y1901: at("around 1901", S),
  keep: at("to keep that wire", S), cabins: at("little log cabins", S), two: at("two men to a", S), walk: at("walk the line", S), breaks: at("find the breaks", S), summer: at("summer and winter", S),
  months: at("went months without", S), supplies: at("their supplies once", S), lonely: at("the loneliness drove", S), stories: at("there are stories", S), key: at("the telegraph key", S), hundred: at("a hundred kimilators", S),
  eventually: at("eventually radio came", S), left: at("the cabins were left", S), today: at("today if you know", S), trail: at("the old trail", S), rotting: at("a rotting cabin", S),
  wire2: at("a piece of wire", S), insulator: at("a glass insulator", S), pieces: at("little pieces of", S), end: at("now before we leave", S),
};
const ll = (n: string) => { const [lon, lat] = PL(n); return { lon, lat }; };
const ATL = PL("atlin");
const DAWSON_CITY: [number, number] = [-139.43, 64.06];
const SKAGWAY: [number, number] = [-135.31, 59.46];
const PINE: [number, number] = [-133.45, 59.62];
// traza aproximada del Yukon Telegraph (Ashcroft → Quesnel → Hazelton → Telegraph Creek → Atlin → Whitehorse → Dawson)
const YT: [number, number][] = [[-121.28, 50.72], [-122.49, 52.98], [-124.3, 53.9], [-127.67, 55.25], [-128.9, 56.4], [-131.16, 57.91], [-132.6, 58.8], ATL, [-134.5, 60.1], [-135.05, 60.72], [-136.6, 62.1], [-138.0, 63.1], DAWSON_CITY];
const CABINS: [number, number][] = [[-123.4, 53.45], [-126.0, 54.6], [-128.3, 55.85], [-130.0, 57.15], [-132.0, 58.4], [-134.2, 59.9], [-135.8, 61.4], [-137.4, 62.6]];
const PD = "Public domain";
const C = (n: string, lic: string) => `Photo: ${n} · Wikimedia Commons · ${lic}`;

const PORTALS: PortalSpec[] = [
  { src: "raw/atlin_klondike_gold_rush_1898__2.jpg", t0: T.klondike - 0.15, t1: T.tens + 1.4, lon: DAWSON_CITY[0], lat: DAWSON_CITY[1], label: "Klondike, 1898", credit: C("unknown", PD) },
  { src: "raw/atlin_atlin_gold_rush_1898_0.jpg", t0: T.prospectors - 0.1, t1: T.gold - 0.05, lon: ATL[0], lat: ATL[1], zoom: [1.6, 1.8], credit: C("A. C. Pillsbury", PD) },
  { src: "img/s_atlin_1898.jpg", t0: T.word - 0.1, t1: T.turned - 0.05, lon: ATL[0], lat: ATL[1] },
  { src: "raw/atlin_atlin_gold_rush_1898_2.jpeg", t0: T.tent - 0.1, t1: T.hotels - 0.05, lon: ATL[0], lat: ATL[1], label: "Atlin, around 1899", credit: C("Eric A. Hegg", PD) },
  { src: "raw/atlin_atlin_british_columbia_2.jpeg", t0: T.hotels - 0.05, t1: T.busiest - 0.05, lon: ATL[0], lat: ATL[1], credit: C("Eric A. Hegg", PD) },
  { src: "raw/atlin_atlin_british_columbia_3.jpg", t0: T.old - 0.1, t1: T.still - 0.05, lon: ATL[0], lat: ATL[1], label: "Atlin today", credit: C("Jerrye & Roy Klotz MD", "CC BY-SA 3.0") },
  { src: "raw/atlin_atlin_british_columbia_0.jpg", t0: T.float + 5.3, t1: T.reflected + 2.6, lon: ATL[0], lat: ATL[1], label: "Atlin Lake", credit: C("Jerrye & Roy Klotz MD", "CC BY-SA 3.0") },
  { src: "raw/atlin_atlin_lake_3.jpg", t0: T.reflected + 2.6, t1: T.oldtimers - 0.05, lon: ATL[0], lat: ATL[1], credit: C("TravelingOtter", "CC BY-SA 2.0") },
  { src: "img/g_atlin_shore.jpg", t0: T.oldtimers - 0.05, t1: T.place - 0.05, lon: ATL[0], lat: ATL[1] },
  { src: "raw/atlin_atlin_lake_2.jpg", t0: T.place - 0.05, t1: T.another + 0.3, lon: ATL[0], lat: ATL[1], credit: C("TravelingOtter", "CC BY-SA 2.0") },
  { src: "raw/telegraph_yukon_telegraph_1.jpg", t0: T.wire - 0.1, t1: T.thousand - 0.05, lon: -129, lat: 56.8, label: "One single wire", credit: "Drawing: John Clayton White · Wikimedia Commons · Public domain" },
  { src: "img/s_telegraph_cabin.jpg", t0: T.two - 0.1, t1: T.months - 0.05, lon: CABINS[4][0], lat: CABINS[4][1] },
  { src: "img/s_telegraph_key.jpg", t0: T.key - 0.15, t1: T.eventually - 0.05, lon: CABINS[4][0], lat: CABINS[4][1] },
  { src: "img/g_insulator.jpg", t0: T.insulator - 0.1, t1: T.end - 0.05, lon: CABINS[4][0], lat: CABINS[4][1] },
];


const Screen: Chapter["Screen"] = ({ c, f, t }) => (
  <>
    {PORTALS.map((p, i) => <Portal key={i} c={c} t={t} f={f} p={p} />)}
    {/* llegada: Atlin y su lago */}
    <Tag c={c} f={f} t={t} lon={-133.2} lat={60.25} t0={T.yukon} t1={T.y1898} text="Yukon" size={30} bg="#5a5f6b" />
    <Dots c={c} f={f} t={t} pts={[[-134, 60.0], [-136.6, 60.0], [-138, 60.0]]} t0={T.yukon} t1={T.y1898} dur={1.2} color="#ffffff" gap={22} />
    <Pin c={c} f={f} t={t} lon={ATL[0]} lat={ATL[1]} t0={T.town} t1={T.y1898} label="Atlin" />
    <Tag c={c} f={f} t={t} {...ll("atlin_lake")} dx={-40} dy={110} t0={T.lake} t1={T.y1898} text="Atlin Lake" size={30} bg="#1e88e5" />
    <Sticker f={f} t={t} t0={T.biggest} t1={T.y1898} x={1450} y={250} size={56}>Biggest natural lake in <span style={{ color: "#ffd23a" }}>B.C.</span></Sticker>

    {/* 1898: el Klondike */}
    <Note f={f} t={t} t0={T.y1898} t1={T.word} text="1898" />
    <Pin c={c} f={f} t={t} lon={DAWSON_CITY[0]} lat={DAWSON_CITY[1]} t0={T.klondike} t1={T.word} label="Klondike" color="#ffd23a" size={30} />
    <Dots c={c} f={f} t={t} pts={[SKAGWAY, [-135.2, 60.4], [-136.4, 61.6], [-137.6, 62.8], DAWSON_CITY]} t0={T.tens + 1.4} t1={T.word} dur={1.6} color="#ffd23a" icon="i_people" iconSize={90} />
    <Sticker f={f} t={t} t0={T.tens + 1.4} t1={T.prospectors} x={1450} y={260} size={60}>Tens of <span style={{ color: "#ffd23a" }}>thousands</span></Sticker>
    <Dots c={c} f={f} t={t} pts={[SKAGWAY, [-134.4, 59.6], ATL]} t0={T.creek} t1={T.word} dur={1.0} color="#ffffff" />
    <Icon c={c} f={f} t={t} src="i_gold" lon={PINE[0]} lat={PINE[1]} t0={T.gold} t1={T.word} size={150} />
    <BigWord f={f} t={t} t0={T.gold} t1={T.word} text={<span style={{ color: "#ffd23a" }}>GOLD!</span>} y={170} size={150} />
    <Tag c={c} f={f} t={t} lon={PINE[0]} lat={PINE[1]} dy={110} t0={T.pine} t1={T.word} text="Pine Creek" size={30} bg="#b8860b" />

    {/* todos dan la vuelta */}
    <Dots c={c} f={f} t={t} pts={[[-136.4, 61.6], [-135.2, 60.4], [-134.4, 59.9], ATL]} t0={T.turned} t1={T.tent} dur={1.4} color="#ff3b30" icon="i_people" iconSize={90} />
    <Sticker f={f} t={t} t0={T.within} t1={T.tent} x={1450} y={260} size={60}>Within <span style={{ color: "#ffd23a" }}>months</span></Sticker>
    {[["Hotels", T.hotels + 0.3], ["Stores", T.hotels + 0.9], ["Saloons", T.saloons], ["A newspaper", T.paper]].map(([s, t0], i) => (
      <Sticker key={i} f={f} t={t} t0={t0 as number} t1={T.busiest - 0.15} x={420 + (i % 2) * 1080} y={260 + Math.floor(i / 2) * 520} rot={i % 2 ? 4 : -4} size={58}>{s as string}</Sticker>
    ))}
    <Pin c={c} f={f} t={t} lon={ATL[0]} lat={ATL[1]} t0={T.busiest} t1={T.old} label="Atlin" size={34} />
    <Tag c={c} f={f} t={t} lon={ATL[0]} lat={ATL[1]} dy={-90} t0={T.busiest + 0.3} t1={T.faded} text="Busiest place in the North" size={30} bg="#b8860b" />
    <Tag c={c} f={f} t={t} lon={ATL[0]} lat={ATL[1]} dy={-90} t0={T.faded} t1={T.old} text="The rush faded" size={30} bg="#5a5f6b" />
    <Num f={f} t={t} t0={T.few} t1={T.old - 0.2} x={1460} y={280} value={400} prefix="~" label="People today" />
    <Icon c={c} f={f} t={t} src="i_gold" lon={PINE[0]} lat={PINE[1]} t0={T.still} t1={T.float} size={140} />
    <Sticker f={f} t={t} t0={T.still + 0.6} t1={T.float} x={1450} y={260} size={58}>Still mining · 120+ years</Sticker>
    <BigWord f={f} t={t} t0={T.place + 0.1} t1={T.another} text={<span>THE <span style={{ color: "#ffd23a" }}>PLACE</span> ITSELF</span>} y={930} size={110} />

    {/* el telégrafo */}
    <Note f={f} t={t} t0={T.fever} t1={T.called} text="1898 · gold fever" />
    <Pin c={c} f={f} t={t} lon={-123.4} lat={48.6} t0={T.fever} t1={T.built} label="Government" side="l" />
    <Pin c={c} f={f} t={t} lon={DAWSON_CITY[0]} lat={DAWSON_CITY[1]} t0={T.fever + 0.4} t1={T.built} label="Yukon" color="#ffd23a" />
    {[["No road", T.noRoad], ["No railway", T.railway], ["No radio", T.radio]].map(([s, t0], i) => (
      <Sticker key={i} f={f} t={t} t0={t0 as number} t1={T.built} x={1450} y={250 + i * 130} rot={i % 2 ? 3 : -3} size={60}>{s as string} <span style={{ color: "#ff3b30" }}>✗</span></Sticker>
    ))}
    <Line c={c} f={f} t={t} pts={YT} t0={T.built} t1={T.left} dur={3.2} color="#ffd23a" w={6} icon="i_telegraph" iconSize={110} />
    <Num f={f} t={t} t0={T.thousand} t1={T.keep} x={1460} y={280} value={1000} prefix=">" suffix=" km" label="Of wilderness" />
    <Tag c={c} f={f} t={t} lon={-127.2} lat={57.8} t0={T.called} t1={T.keep} text="Yukon Telegraph" size={34} bg="#111" />
    <Sticker f={f} t={t} t0={T.y1901} t1={T.keep} x={480} y={900} size={70}>Finished <span style={{ color: "#ffd23a" }}>1901</span></Sticker>

    {CABINS.map(([lo, la], i) => (
      <Icon key={i} c={c} f={f} t={t} src="i_cabin" lon={lo} lat={la} t0={T.cabins + i * 0.15} t1={T.trail} size={100} grey={ramp(t, T.left, 0.8)} />
    ))}
    <Sticker f={f} t={t} t0={T.walk} t1={T.months} x={1460} y={250} size={56}>Walk the line</Sticker>
    <Sticker f={f} t={t} t0={T.breaks} t1={T.months} x={1460} y={370} rot={3} size={56}>Find the breaks</Sticker>
    <Sticker f={f} t={t} t0={T.breaks + 0.8} t1={T.months} x={1460} y={490} size={56}>Fix them</Sticker>
    <Sticker f={f} t={t} t0={T.summer} t1={T.months} x={470} y={900} rot={-3} size={64}>☀ summer · ❄ winter</Sticker>
    <Sticker f={f} t={t} t0={T.months} t1={T.key - 0.15} x={1450} y={260} size={64}>Months <span style={{ color: "#ff3b30" }}>alone</span></Sticker>
    <Sticker f={f} t={t} t0={T.supplies} t1={T.key - 0.15} x={1450} y={400} rot={3} size={56}>Supplies: once a year</Sticker>
    <Line c={c} f={f} t={t} pts={[CABINS[3], CABINS[4]]} t0={T.hundred - 0.2} t1={T.eventually} dur={0.8} color="#7fd3ff" w={8} />
    <Tag c={c} f={f} t={t} lon={-131} lat={57.5} dy={-80} t0={T.hundred} t1={T.eventually + 0.5} text="100 km" size={30} bg="#1e88e5" />
    <Sticker f={f} t={t} t0={T.eventually} t1={T.left + 0.4} x={1450} y={260} size={64}>📻 Radio</Sticker>
    <Dots c={c} f={f} t={t} pts={YT.slice(3, 9)} t0={T.trail} t1={T.insulator} dur={1.6} color="#ffffff" />
    <Tag c={c} f={f} t={t} lon={-130.2} lat={57.4} dy={60} t0={T.trail + 0.3} t1={T.insulator} text="The old trail" size={28} />
    <Icon c={c} f={f} t={t} src="i_cabin" lon={CABINS[4][0]} lat={CABINS[4][1]} t0={T.rotting} t1={T.insulator} size={140} grey={0.8} />
  </>
);

export const ch05: Chapter = {
  T0: S, T1: T.end,
  keys: [
    [S + 1.4, -133.5, 59.7, 0.55, 0], [T.lake, -133.8, 59.5, 0.75, 0], [T.atlin, -133.7, 59.55, 0.8, 0],
    [T.y1898 + 0.3, -136, 61.6, 0.3, 0], [T.tens + 1.4, -136.5, 61.8, 0.28, 0], [T.creek, -134.4, 59.9, 0.55, 0], [T.gold, -133.6, 59.6, 0.9, 0],
    [T.word, -134.5, 60.5, 0.4, 0], [T.turned + 1.5, -135, 60.6, 0.36, 0], [T.busiest, -133.7, 59.6, 0.8, 0], [T.few, -133.7, 59.58, 0.9, 0], [T.float, -133.7, 59.55, 1.0, 0],
    [T.another + 0.4, -133.7, 59.5, 0.7, 0], [T.fever, -130, 56.5, 0.13, 0], [T.built, -129.5, 57, 0.14, 0],
    [T.y1901, -129.5, 57.2, 0.15, 0], [T.cabins, -130.3, 57.5, 0.2, 0], [T.months, -131.2, 57.9, 0.32, 0], [T.hundred, -131.0, 57.75, 0.38, 0],
    [T.eventually, -130.5, 57.5, 0.3, 0], [T.trail, -129.8, 57.0, 0.24, 0], [T.end, -129.5, 57.3, 0.3, 0],
  ],
  Screen,
  full: [567.84, 633.666],
  sfx: [
    [S + 0.2, "wh2", 0.12, 1.2], [T.town, "ck2", 0.1, 0.3], [T.biggest, "st1", 0.12, 0.5], [T.y1898 + 0.3, "wh5", 0.14, 1.6], [T.klondike - 0.15, "sw4", 0.12, 1.0],
    [T.tens + 1.4, "tk1", 0.08, 1.4], [T.prospectors - 0.1, "sw1", 0.12, 1.0], [T.gold, "im1", 0.15, 1.4], [T.pine, "pop1", 0.11, 0.4], [T.word - 0.1, "sw4", 0.12, 1.0],
    [T.turned, "wh2", 0.12, 1.2], [T.tent - 0.1, "sw1", 0.12, 1.0], [T.hotels + 0.3, "pop2", 0.11, 0.4], [T.hotels + 0.9, "pop3", 0.11, 0.4], [T.saloons, "pop4", 0.11, 0.4], [T.paper, "pop5", 0.11, 0.4],
    [T.busiest, "st2", 0.12, 0.5], [T.few, "tk1", 0.08, 1.0], [T.old - 0.1, "sw4", 0.12, 1.0], [T.float + 5.3, "sw1", 0.12, 1.0], [T.place, "im2", 0.12, 1.0],
    [T.another + 0.4, "wh5", 0.15, 1.8], [T.noRoad, "st1", 0.11, 0.5], [T.railway, "st2", 0.11, 0.5], [T.radio, "st1", 0.11, 0.5], [T.built, "wh6", 0.13, 1.4],
    [T.wire - 0.1, "sw4", 0.12, 1.0], [T.thousand, "tk1", 0.08, 1.0], [T.y1901, "st2", 0.12, 0.5], [T.cabins, "pop1", 0.1, 0.4], [T.walk, "pop2", 0.1, 0.4], [T.breaks, "pop3", 0.1, 0.4],
    [T.two - 0.1, "sw1", 0.12, 1.0], [T.months, "st1", 0.12, 0.5], [T.key - 0.15, "sw4", 0.12, 1.0], [T.hundred, "ck6", 0.1, 0.6], [T.eventually, "pop4", 0.1, 0.4],
    [T.trail, "wh2", 0.1, 1.0], [T.insulator - 0.1, "sw1", 0.12, 1.0],
  ],
};

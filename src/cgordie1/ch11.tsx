// Capítulo 11 — país de volcanes: Edziza y la erupción del cono Tseax
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Chapter, at, Tag, Pin, Icon, BigWord, Sticker, Note, Line, Portal, PortalSpec, Num, People, PL, pj, vis, win, ramp, fadeOut, clamp, SANS } from "./lib";
import { Terrain3D, TEX, TKey } from "./v3_fortune";

const S = at("now let's talk");
const T = {
  older: at("even older", S), dangerous: at("more dangerous", S), country: at("volcano country", S), having: at("having volcanoes", S), nw: at("northwest part", S), field: at("a whole field", S),
  edziza: at("mount edzisa", S), flows: at("lava flows", S), cones: at("cinder cones", S), plateau: at("high plateau", S), paint: at("spilled paint", S), many: at("many more", S),
  long: at("not that long ago", S), toll: at("terrible toll", S), nass: at("the nass valley", S), nisgaa: at("the niskan nation", S), tseax: at("the tsiak's cone", S), y300: at("around 300", S),
  erupted: at("it erupted", S), poured: at("leva poured", S), floor: at("river valley floor", S), oral: at("oral history", S), villages: at("destroyed villages", S), n2000: at("as many as 2,000", S),
  gases: at("poisonous volcanic gases", S), settled: at("settled in the valley", S), numbers: at("if those numbers", S), deadliest: at("deadliest natural disasters", S), heard: at("ever heard of it", S), none: at("almost none", S),
  drive: at("today you can drive", S), bed: at("memorial lava bed", S), planet: at("another planet", S), black: at("black broken rock", S), moss: at("green moss", S), creeping: at("creeping over it", S), path: at("carve a new path", S),
  memory: at("kept the memory", S), stories: at("their stories", S), warning: at("as a warning", S), respect: at("respecting the land", S),
  stood: at("when i stood", S), quiet: at("dead quiet", S), birds: at("no birds", S), wind: at("just the wind", S), ancient: at("not ancient history", S), ggp: at("great-great-grandparents", S), moving: at("not finished moving", S), end: at("and there's something else", S),
};
const ED = PL("edziza"), TX = PL("tseax"), LB = PL("lava_bed");
const VOLCS: [number, number][] = [[-130.63, 57.72], [-131.29, 56.78], [-131.4, 58.4], [-128.9, 55.11], [-131.95, 58.6], [-130.2, 56.4], [-129.6, 55.9], [-132.3, 59.2], [-130.9, 57.2]];
const NASS: [number, number][] = [[-128.2, 55.75], [-128.6, 55.45], [-128.95, 55.25], [-129.3, 55.12], [-129.6, 54.98], [-129.95, 54.93]];
const FLOW: [number, number][] = [TX, [-128.95, 55.17], [-129.02, 55.23], [-129.1, 55.27], [-129.25, 55.24]];
const NCVP: [number, number][] = [[-133.5, 60.0], [-130.5, 60.0], [-129.6, 57.5], [-128.3, 55.0], [-129.6, 54.6], [-131.3, 56.5], [-132.6, 58.3]];
const C = (n: string, lic: string) => `Photo: ${n} · Wikimedia Commons · ${lic}`;

const PORTALS: PortalSpec[] = [
  { src: "raw/volcano_mount_edziza_1.jpg", t0: T.plateau - 0.1, t1: T.paint - 0.05, lon: ED[0], lat: ED[1], label: "Mount Edziza", credit: C("John Scurlock", "CC BY 4.0") },
  { src: "img/s_edziza.jpg", t0: T.paint - 0.05, t1: T.many - 0.05, lon: ED[0], lat: ED[1] },
  { src: "raw/volcano_nisga_a_memorial_lava_be_3.jpg", t0: T.bed + 1.3, t1: T.black + 1.2, lon: LB[0], lat: LB[1], label: "Nisga'a Memorial Lava Bed", credit: C("Iain Cameron", "CC BY 2.0") },
  { src: "raw/volcano_nisga_a_memorial_lava_be_1.jpg", t0: T.black + 1.2, t1: T.path - 0.05, lon: LB[0], lat: LB[1], credit: C("Darren Kirby", "CC BY-SA 2.0") },
  { src: "raw/volcano_nisga_a_memorial_lava_be_2.jpg", t0: T.path - 0.05, t1: T.memory - 0.05, lon: LB[0], lat: LB[1], credit: C("Darren Kirby", "CC BY-SA 2.0") },
  { src: "img/g_lava_bed.jpg", t0: T.stood - 0.1, t1: T.wind + 1.2, lon: LB[0], lat: LB[1] },
];

// nube de gas venenoso que se asienta en el valle
const Gas: React.FC<{ c: any; t: number }> = ({ c, t }) => {
  if (!vis(t, T.gases - 0.2, T.numbers + 0.4)) return null;
  const o = Math.min(ramp(t, T.gases - 0.2, 1.0), fadeOut(t, T.numbers + 0.4, 0.6));
  return (
    <>
      {NASS.slice(1, 5).map(([lo, la], i) => {
        const [x, y] = pj(c, lo + Math.sin(t * 0.7 + i) * 0.04, la);
        const r = 170 + 50 * Math.sin(t * 1.1 + i * 2) + 60 * ramp(t, T.settled, 1.2);
        return <div key={i} style={{ position: "absolute", left: x - r, top: y - r * 0.7 + (1 - ramp(t, T.settled, 1.5)) * -80, width: 2 * r, height: 1.4 * r, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(170,200,90,.6) 0%, rgba(140,160,80,.35) 45%, rgba(120,140,70,0) 72%)", opacity: o, filter: "blur(6px)" }} />;
      })}
    </>
  );
};

const Screen: Chapter["Screen"] = ({ c, f, t }) => {
  const tk: TKey[] = [[T.edziza - 0.1, -130.1, 57.25, 0.8, -130.63, 57.72, 0.2], [T.flows, -130.35, 57.45, 0.6, -130.65, 57.75, 0.25], [T.plateau, -130.5, 57.58, 0.5, -130.7, 57.78, 0.3]];
  const red = win(t, T.erupted - 0.2, T.numbers, 0.6);
  return (
    <>
      <AbsoluteFill style={{ background: "#3a0b00", opacity: 0.28 * red, mixBlendMode: "multiply" }} />
      <Sticker f={f} t={t} t0={T.older} t1={T.country} x={1450} y={260} size={56}>Older · <span style={{ color: "#ff6a3d" }}>more dangerous</span></Sticker>
      <BigWord f={f} t={t} t0={T.country} t1={T.edziza} text={<span>VOLCANO <span style={{ color: "#ff6a3d" }}>COUNTRY</span></span>} y={930} size={120} />
      {VOLCS.map(([lo, la], i) => <Icon key={i} c={c} f={f} t={t} src="i_volcano" lon={lo} lat={la} t0={T.field + i * 0.12} t1={T.edziza} size={90} />)}
      <Sticker f={f} t={t} t0={T.having} t1={T.field} x={470} y={260} size={56}>Canada? Volcanoes?!</Sticker>

      {vis(t, T.edziza - 0.15, T.plateau + 0.05) && (
        <Terrain3D name="nbc" t={t} t0={T.edziza - 0.1} t1={T.plateau} keys={tk} label="Mount Edziza" font={SANS} tex={TEX} />
      )}
      <Sticker f={f} t={t} t0={T.flows} t1={T.plateau - 0.1} x={1450} y={240} rot={4} size={54}>Lava flows</Sticker>
      <Sticker f={f} t={t} t0={T.cones} t1={T.plateau - 0.1} x={470} y={240} rot={-4} size={54}>Cinder cones</Sticker>
      <BigWord f={f} t={t} t0={T.paint + 0.3} t1={T.many} text={<span>“SPILLED <span style={{ color: "#ff8a1c" }}>PAINT</span>”</span>} y={930} size={96} />
      {VOLCS.map(([lo, la], i) => <Icon key={i} c={c} f={f} t={t} src="i_volcano" lon={lo} lat={la} t0={T.many + i * 0.08} t1={T.nass} size={80} />)}
      <Sticker f={f} t={t} t0={T.toll} t1={T.nass + 0.4} x={1450} y={260} size={60}>…a <span style={{ color: "#ff3b30" }}>terrible</span> toll</Sticker>

      {/* el Nass y el cono Tseax */}
      <Line c={c} f={f} t={t} pts={NASS} t0={T.nass} t1={T.end} dur={1.4} color="#2a9df4" w={9} />
      <Tag c={c} f={f} t={t} lon={-128.5} lat={55.62} dx={90} t0={T.nass + 0.4} t1={T.erupted} text="Nass Valley" size={30} bg="#1e88e5" />
      <Tag c={c} f={f} t={t} lon={-129.3} lat={55.5} t0={T.nisgaa} t1={T.erupted} text="Nisga'a Nation" size={34} bg="#8e44ad" />
      <Icon c={c} f={f} t={t} src="i_volcano" lon={TX[0]} lat={TX[1]} t0={T.tseax} t1={T.drive} size={150} />
      <Tag c={c} f={f} t={t} lon={TX[0]} lat={TX[1]} dy={80} t0={T.tseax + 0.2} t1={T.erupted} text="Tseax Cone" size={30} bg="#5a2d1c" />
      <Note f={f} t={t} t0={T.y300} t1={T.numbers} text="~300 years ago" />
      <Line c={c} f={f} t={t} pts={FLOW} t0={T.poured} t1={T.drive} dur={2.4} color="#ff5a1c" w={30} />
      <Sticker f={f} t={t} t0={T.floor} t1={T.oral} x={1450} y={260} size={56}>Lava fills the valley floor</Sticker>
      <Sticker f={f} t={t} t0={T.oral} t1={T.n2000} x={1450} y={260} size={56}>Nisga'a oral history</Sticker>
      {[[-129.0, 55.2], [-129.15, 55.28], [-128.9, 55.3]].map(([lo, la], i) => (
        <Icon key={i} c={c} f={f} t={t} src="i_house_flood" lon={lo} lat={la} t0={T.villages + i * 0.2} t1={T.gases} size={90} grey={ramp(t, T.villages + 0.8, 0.8)} />
      ))}
      <People f={f} t={t} t0={T.n2000} t1={T.gases + 0.2} n={40} hi={40} x={1420} y={330} label="Up to 2,000 lives" />
      <Gas c={c} t={t} />
      <Sticker f={f} t={t} t0={T.gases} t1={T.numbers} x={1450} y={260} size={56}>☁ Poisonous gas</Sticker>
      <Sticker f={f} t={t} t0={T.deadliest} t1={T.heard} x={1450} y={260} size={52}>One of Canada's deadliest disasters</Sticker>
      <BigWord f={f} t={t} t0={T.heard} t1={T.drive} text={<span>WHO'S <span style={{ color: "#ffd23a" }}>HEARD</span> OF IT?</span>} y={930} size={100} />

      <Sticker f={f} t={t} t0={T.planet} t1={T.black + 1.1} x={1450} y={260} size={60}>🪐 Another planet</Sticker>
      <Sticker f={f} t={t} t0={T.moss} t1={T.path - 0.1} x={1450} y={260} size={56}>Moss · lichen · slowly</Sticker>
      <Sticker f={f} t={t} t0={T.path + 0.3} t1={T.memory - 0.1} x={1450} y={260} size={56}>A river's new path</Sticker>
      {/* la memoria nisga'a */}
      <Tag c={c} f={f} t={t} lon={-129.3} lat={55.5} t0={T.memory} t1={T.stood} text="Nisga'a Nation" size={34} bg="#8e44ad" />
      <Sticker f={f} t={t} t0={T.stories} t1={T.stood} x={1450} y={260} size={56}>📜 Stories, for generations</Sticker>
      <Sticker f={f} t={t} t0={T.warning} t1={T.stood} x={1450} y={390} rot={3} size={56}>⚠ A warning</Sticker>
      <Sticker f={f} t={t} t0={T.respect} t1={T.stood} x={1450} y={520} rot={-3} size={50}>Respect the land &amp; its creatures</Sticker>
      <Sticker f={f} t={t} t0={T.quiet} t1={T.wind + 1.1} x={1450} y={250} size={56}>Dead quiet</Sticker>
      <Sticker f={f} t={t} t0={T.birds} t1={T.wind + 1.1} x={1450} y={370} rot={3} size={56}>No birds</Sticker>
      {/* 300 años = los tatarabuelos */}
      {["You", "Parents", "Grandparents", "Great-", "Great-great-"].map((s, i) => (
        <Sticker key={i} f={f} t={t} t0={T.ggp - 0.6 + i * 0.18} t1={T.moving} x={360 + i * 300} y={540} rot={i % 2 ? 3 : -3} size={38}>{s}</Sticker>
      ))}
      <BigWord f={f} t={t} t0={T.ancient} t1={T.ggp - 0.6} text={<span>NOT <span style={{ color: "#ff6a3d" }}>ANCIENT</span> HISTORY</span>} y={930} size={100} />
      <BigWord f={f} t={t} t0={T.moving} t1={T.end} text={<span>STILL <span style={{ color: "#ff6a3d" }}>MOVING</span></span>} y={930} size={120} />
      <Icon c={c} f={f} t={t} src="i_quake" lon={TX[0]} lat={TX[1]} dx={160} t0={T.moving} t1={T.end} size={120} />
      {PORTALS.map((p, i) => <Portal key={i} c={c} t={t} f={f} p={p} />)}
    </>
  );
};

export const ch11: Chapter = {
  T0: S, T1: T.end,
  keys: [
    [S + 0.6, -130.0, 57.0, 0.32, 0], [T.field, -130.6, 57.4, 0.38, 0], [T.edziza, -130.63, 57.72, 1.2, 0], [T.many, -130.4, 57.2, 0.4, 0],
    [T.nass, -128.9, 55.3, 1.2, 0], [T.tseax, -128.95, 55.2, 2.0, 0], [T.poured, -129.0, 55.2, 2.3, 0], [T.villages, -129.05, 55.22, 2.4, 0],
    [T.gases, -129.0, 55.2, 1.9, 0], [T.heard, -129.0, 55.2, 1.6, 0], [T.memory, -129.05, 55.3, 1.5, 0], [T.stood, -129.05, 55.25, 1.7, 0],
    [T.ancient, -129.05, 55.25, 1.6, 0], [T.end, -129.1, 55.3, 1.3, 0],
  ],
  Screen,
  full: [1348.673, 1384.393],
  sfx: [
    [S + 0.2, "wh2", 0.12, 1.2], [T.older, "pop1", 0.1, 0.4], [T.country, "im1", 0.14, 1.4], [T.field, "tk1", 0.08, 1.4], [T.having, "pop2", 0.1, 0.4], [T.edziza - 0.1, "wh5", 0.15, 1.6],
    [T.flows, "pop3", 0.1, 0.4], [T.cones, "pop4", 0.1, 0.4], [T.plateau - 0.1, "sw4", 0.12, 1.0], [T.paint - 0.05, "sw1", 0.12, 1.0], [T.many, "tk1", 0.08, 1.0], [T.toll, "st2", 0.12, 0.5],
    [T.nass, "wh6", 0.12, 1.4], [T.tseax, "pop5", 0.11, 0.4], [T.erupted, "im2", 0.16, 1.6], [T.poured, "wh6", 0.12, 2.0], [T.villages, "st1", 0.12, 0.5], [T.n2000, "tk1", 0.08, 1.2],
    [T.gases, "wh2", 0.1, 1.6], [T.heard, "st2", 0.12, 0.5], [T.bed + 1.3, "sw4", 0.12, 1.0], [T.black + 1.2, "sw1", 0.12, 1.0], [T.path - 0.05, "sw4", 0.12, 1.0],
    [T.stories, "pop1", 0.1, 0.4], [T.warning, "pop2", 0.1, 0.4], [T.stood - 0.1, "sw1", 0.12, 1.0], [T.ggp - 0.6, "tk1", 0.08, 1.0], [T.moving, "im1", 0.13, 1.2],
  ],
};

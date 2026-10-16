// Capítulo 17 — Stewart (B.C.) y Hyder (Alaska): la frontera sin aduana, y el glaciar Salmon
import React from "react";
import { interpolate, Img } from "remotion";
import { Chapter, at, Tag, Pin, BigWord, Sticker, Line, Portal, PortalSpec, PL, sf, pop, vis, win, ramp, fadeOut, clamp, SANS } from "./lib";

const S = at("speaking of the border");
const T = {
  secret: at("little secret", S), laugh: at("makes people laugh", S), coast: at("on the coast", S), canal: at("long canal", S), stewart: at("called stewart", S), door: at("right next door", S), km: at("couple of commoners", S),
  hyder: at("called hyder", S), only: at("only places", S), drive: at("drive into alaska", S), customs: at("american customs", S), nopost: at("no us border", S), across: at("just drive across", S), back: at("coming back", S), booth: at("canadian booth", S),
  cut: at("so cut off", S), money: at("canadian money", S), phone: at("phone codes", S), time: at("canadian time", S), road: at("up the road", S), glacier: at("salmon glacier", S), biggest: at("biggest glaciers", S), byroad: at("reach by road", S),
  ridge: at("on the ridge", S), down: at("look down", S), highway: at("frozen highway", S), blue: at("blue and white", S), peaks: at("between the peaks", S), visitors: at("brought visitors", S), mouths: at("mouths open", S), five: at("five minutes", S), end: at("before we go", S),
};
const STW = PL("stewart"), HYD = PL("hyder"), SG = PL("salmon_glacier");
const CANAL: [number, number][] = [[-130.65, 54.75], [-130.45, 55.1], [-130.2, 55.45], [-130.05, 55.75], STW];
const GROAD: [number, number][] = [HYD, [-130.05, 55.98], [-130.1, 56.03], SG];
const CR = { hyder: "Photo: Tdevries · CC BY-SA 3.0", sg0: "Photo: Lynn Kolund, US Forest Service · public domain", sg1: "Photo: Jerrye & Roy Klotz MD · CC BY-SA 3.0", sg2: "Photo: Strontium87 · CC BY 3.0" };

const PORTALS: PortalSpec[] = [
  { src: "raw/stewart_hyder_alaska_1.jpg", t0: T.hyder - 0.1, t1: T.drive - 0.05, lon: HYD[0], lat: HYD[1], zoom: [1.0, 1.12], credit: CR.hyder, label: "Hyder, Alaska" },
  { src: "img/s_hyder_town.jpg", t0: T.cut - 0.1, t1: T.road - 0.05, lon: HYD[0], lat: HYD[1], zoom: [1.0, 1.12] },
  { src: "raw/stewart_salmon_glacier_2.jpg", t0: T.ridge - 0.1, t1: T.highway - 0.05, lon: SG[0], lat: SG[1], zoom: [1.0, 1.12], credit: CR.sg2, label: "Salmon Glacier" },
  { src: "raw/stewart_salmon_glacier_1.jpg", t0: T.highway - 0.05, t1: T.peaks - 0.05, lon: SG[0], lat: SG[1], zoom: [1.12, 1.0], pan: [0, 20], credit: CR.sg1 },
  { src: "raw/stewart_salmon_glacier_0.jpg", t0: T.peaks - 0.05, t1: T.visitors - 0.05, lon: SG[0], lat: SG[1], zoom: [1.0, 1.15], credit: CR.sg0 },
  { src: "img/g_salmon_glacier.jpg", t0: T.visitors - 0.05, t1: T.end + 0.3, lon: SG[0], lat: SG[1], zoom: [1.0, 1.12] },
];

// esquema de la frontera: la ruta, la línea y el auto
const Border: React.FC<{ f: number; t: number }> = ({ f, t }) => {
  if (!vis(t, T.only - 0.2, T.cut)) return null;
  const op = pop(f, T.only - 0.2, 12) * fadeOut(t, T.cut);
  // ida (Stewart → Hyder) sin parar; vuelta frena en la caseta canadiense
  const go = interpolate(t, [T.drive, T.across + 1.2], [0, 1], clamp);
  const ret = interpolate(t, [T.back, T.booth - 0.2, T.booth + 1.2, T.cut - 0.2], [0, 0.42, 0.42, 1], clamp);
  const x = t < T.back ? 300 + 1320 * go : 1620 - 1320 * ret;
  const stop = t >= T.booth - 0.3 && t <= T.booth + 1.3;
  const sx = 960;
  return (
    <div style={{ zIndex: 20, position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: op }}>
      <div style={{ position: "absolute", left: 120, top: 380, width: 1680, height: 440, background: "rgba(12,14,20,.88)", border: "4px solid #fff", borderRadius: 24 }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <rect x={160} y={640} width={1600} height={70} fill="#555" />
        <line x1={160} y1={675} x2={1760} y2={675} stroke="#ffd23a" strokeWidth={5} strokeDasharray="34 26" />
        <line x1={sx} y1={430} x2={sx} y2={780} stroke="#fff" strokeWidth={6} strokeDasharray="14 10" />
        {/* caseta canadiense (lado de Stewart) */}
        <g transform={`translate(${sx - 150},560)`}>
          <rect x={-40} y={-10} width={80} height={70} fill="#e3261c" stroke="#fff" strokeWidth={4} />
          <path d="M-50,-10 L0,-40 L50,-10 Z" fill="#fff" />
          <text x={0} y={36} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={22} fill="#fff">CA</text>
        </g>
        {/* lugar vacío donde no hay puesto de EE. UU. */}
        <g transform={`translate(${sx + 150},580)`} opacity={ramp(t, T.nopost, 0.3)}>
          <rect x={-40} y={-30} width={80} height={70} fill="none" stroke="#9aa5b1" strokeWidth={4} strokeDasharray="10 8" />
          <text x={0} y={14} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={40} fill="#ff3b30">✗</text>
        </g>
      </svg>
      <div style={{ position: "absolute", left: 300, top: 430, transform: "translateX(-50%)", fontFamily: SANS, fontWeight: 900, fontSize: 40, color: "#fff" }}>STEWART, B.C.</div>
      <div style={{ position: "absolute", left: 1620, top: 430, transform: "translateX(-50%)", fontFamily: SANS, fontWeight: 900, fontSize: 40, color: "#fff" }}>HYDER, ALASKA</div>
      <div style={{ position: "absolute", left: sx + 150, top: 640 - 120, transform: "translateX(-50%)", fontFamily: SANS, fontWeight: 800, fontSize: 24, color: "#9aa5b1", opacity: ramp(t, T.nopost, 0.3), whiteSpace: "nowrap" }}>no U.S. border post</div>
      <div style={{ position: "absolute", left: x, top: 650, transform: `translate(-50%,-50%) scaleX(${t < T.back ? 1 : -1})` }}><Img src={sf("icons/i_pickup.png")} style={{ width: 230 }} /></div>
      {stop && <div style={{ position: "absolute", left: sx - 150, top: 470, transform: `translate(-50%,-50%) scale(${pop(f, T.booth - 0.3, 9)})`, fontFamily: SANS, fontWeight: 900, fontSize: 44, color: "#fff", background: "#e3261c", padding: "6px 18px", borderRadius: 10 }}>STOP</div>}
    </div>
  );
};

const Screen: Chapter["Screen"] = ({ c, f, t }) => (
  <>
    <Sticker f={f} t={t} t0={T.laugh} t1={T.canal} x={1450} y={250} size={52}>A little border secret 🤫</Sticker>
    <Line c={c} f={f} t={t} pts={CANAL} t0={T.canal - 0.3} t1={T.only} dur={1.2} color="#2a9df4" w={10} />
    <Tag c={c} f={f} t={t} lon={-130.6} lat={55.2} t0={T.canal + 0.3} t1={T.only} text="Portland Canal" size={28} bg="#1e88e5" />
    <Pin c={c} f={f} t={t} lon={STW[0]} lat={STW[1]} t0={T.stewart} t1={T.only} label="Stewart, B.C." />
    <Pin c={c} f={f} t={t} lon={HYD[0]} lat={HYD[1]} t0={T.hyder - 0.4} t1={T.only} label="Hyder, AK" side="l" color="#1565c0" />
    <Sticker f={f} t={t} t0={T.km} t1={T.hyder} x={1450} y={370} rot={3} size={52}>~2 km apart</Sticker>
    <Border f={f} t={t} />
    <Sticker f={f} t={t} t0={T.customs} t1={T.back} x={1450} y={250} size={46}>Into Alaska — no American customs</Sticker>
    <Sticker f={f} t={t} t0={T.money} t1={T.road} x={1480} y={230} size={50}>🍁 Canadian money</Sticker>
    <Sticker f={f} t={t} t0={T.phone} t1={T.road} x={1480} y={350} rot={3} size={50}>☎ Canadian phone codes</Sticker>
    <Sticker f={f} t={t} t0={T.time} t1={T.road} x={1480} y={470} rot={-3} size={50}>🕐 Canadian time</Sticker>
    <Line c={c} f={f} t={t} pts={GROAD} t0={T.road} t1={T.ridge} dur={1.2} color="#ffd23a" w={8} />
    <Pin c={c} f={f} t={t} lon={SG[0]} lat={SG[1]} t0={T.glacier} t1={T.ridge} label="Salmon Glacier" color="#2a9df4" />
    <Sticker f={f} t={t} t0={T.biggest} t1={T.ridge} x={1450} y={250} size={46}>One of the biggest glaciers you can drive to</Sticker>
    <Sticker f={f} t={t} t0={T.byroad} t1={T.ridge} x={1450} y={370} rot={3} size={50}>🚙 by road</Sticker>
    <Sticker f={f} t={t} t0={T.highway} t1={T.peaks} x={1450} y={250} size={56}>A frozen highway</Sticker>
    <Sticker f={f} t={t} t0={T.mouths} t1={T.end} x={1450} y={250} size={52}>Mouths open…</Sticker>
    <Sticker f={f} t={t} t0={T.five} t1={T.end} x={1450} y={370} rot={3} size={52}>…5 minutes of silence</Sticker>
    {PORTALS.map((p, i) => <Portal key={i} c={c} t={t} f={f} p={p} />)}
  </>
);

export const ch17: Chapter = {
  T0: S, T1: T.end,
  keys: [
    [S + 0.3, -134.0, 58.0, 0.35, 0], [T.coast, -130.8, 55.6, 0.9, 0], [T.canal, -130.4, 55.4, 1.4, 0], [T.stewart, -130.0, 55.93, 2.6, 0], [T.only, -130.0, 55.93, 2.8, 0],
    [T.road, -130.04, 56.0, 2.6, 0], [T.byroad, -130.06, 56.02, 3.0, 0], [T.end, -130.06, 56.04, 2.8, 0],
  ],
  Screen,
  full: [2017.359],
  sfx: [
    [T.secret, "st1", 0.1, 0.5], [T.canal, "wh2", 0.12, 1.2], [T.stewart, "pop1", 0.1, 0.4], [T.hyder - 0.1, "sw1", 0.12, 1.0], [T.only, "pop2", 0.1, 0.4], [T.drive, "wh6", 0.1, 1.6],
    [T.nopost, "st2", 0.12, 0.5], [T.booth - 0.3, "ck2", 0.12, 0.3], [T.cut - 0.1, "sw4", 0.12, 1.0], [T.money, "pop3", 0.1, 0.4], [T.phone, "pop4", 0.1, 0.4], [T.time, "pop5", 0.1, 0.4],
    [T.road, "wh2", 0.1, 1.2], [T.glacier, "pop1", 0.1, 0.4], [T.ridge - 0.1, "sw1", 0.12, 1.0], [T.highway, "sw4", 0.1, 1.0], [T.visitors - 0.05, "sw1", 0.1, 1.0],
  ],
};

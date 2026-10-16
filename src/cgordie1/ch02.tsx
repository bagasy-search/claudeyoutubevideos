// Capítulo 2 — Dawson Creek, Mile 0 y la Alaska Highway de 1942
import React from "react";
import { interpolate } from "remotion";
import { Chapter, at, Tag, Pin, Icon, BigWord, Sticker, Note, Line, Dots, Portal, PortalSpec, Num, PL, geo, ramp, win, clamp } from "./lib";
import { ALCAN } from "./ch01";

const S = at("our first stop");
const T = {
  dawson: at("dawson creek", S), alberta: at("alberta border", S), post: at("there's a post", S), mile0: at("mile zero", S), begins: at("that's where the alaska", S),
  story: at("here's the story behind", S), dec: at("in december of", S), pearl: at("pearl harbor", S), terrified: at("americans were terrified", S), noRoad: at("there was no road", S), none: at("none", S),
  cutoff: at("alaska was cut off", S), mountains: at("mountains", S + 20), muskeg: at("and forest", S + 20) - 0.5, forest: at("and forest", S + 20), most: at("most of it right here", S),
  early42: at("so in early", S), soldiers: at("thousands of soldiers", S), punch: at("punch a road", S), k10: at("around 10,000", S), winter: at("never seen a winter", S),
  mosq: at("they worked through mosquitoes", S), froze: at("froze the oil", S), black: at("many of the soldiers", S), credit: at("weren't given the credit", S),
  amazes: at("and here's the part that still", S), finished: at("they finished a rough", S), km: at("more than 2,700", S), eight: at("eight months", S + 60), eight2: at("eight months", S + 74),
  bridge: at("today it takes longer", S), rough: at("the road they built", S), paved: at("over the years it has", S), drive: at("but when you drive", S), bison: at("you'll see bison", S),
  sheep: at("you'll see stone sheep", S), hour: at("and you'll drive for an hour", S), end: at("but before we head up", S),
};
const ll = (n: string) => { const [lon, lat] = PL(n); return { lon, lat }; };
const ARCH = "U.S. Army Signal Corps film “Alaska Highway” (1943) · CC BY 3.0";

const PORTALS: PortalSpec[] = [
  { src: "raw/hwy_dawson_creek_mile_zero_0.jpg", t0: T.post - 0.2, t1: T.story - 0.1, ...ll("dawson_creek"), label: "Mile 0", credit: "Photo: Wikimedia Commons · CC BY-SA 3.0" },
  { src: "img/g_mile0.jpg", t0: T.story - 0.15, t1: T.dec + 0.3, ...ll("dawson_creek") },
  { src: "clips/ac_dozer_snow.mp4", video: true, t0: T.early42 - 0.2, t1: T.punch - 0.1, ...ll("dawson_creek"), credit: ARCH, startFrom: 0.5 },
  { src: "img/s_alcan_winter.jpg", t0: T.winter - 0.3, t1: T.mosq, lon: -126, lat: 59.4, label: "Winter of 1942" },
  { src: "clips/ac_clearing.mp4", video: true, t0: T.mosq - 0.05, t1: T.froze - 0.6, lon: -126, lat: 59.4, credit: ARCH },
  { src: "clips/ac_truck_snow.mp4", video: true, t0: T.froze - 0.6, t1: T.black - 0.05, lon: -126, lat: 59.4, credit: ARCH, startFrom: 2.4 },
  { src: "clips/ac_soldiers.mp4", video: true, t0: T.black - 0.1, t1: T.amazes, lon: -126, lat: 59.4, label: "Black regiments", credit: ARCH },
  { src: "clips/ac_truck_bridge.mp4", video: true, t0: T.rough + 1.2, t1: T.paved - 0.05, ...ll("liard"), credit: ARCH, startFrom: 0.2 },
  { src: "clips/ac_convoy.mp4", video: true, t0: T.paved - 0.05, t1: T.drive, ...ll("liard"), credit: ARCH, startFrom: 2.0 },
  { src: "img/g_bison_road.jpg", t0: T.drive - 0.05, t1: T.bison - 0.15, ...ll("muncho") },
  { src: "raw/hwy_alaska_highway_bison_3.jpg", t0: T.bison - 0.2, t1: T.sheep - 0.05, ...ll("muncho"), credit: "Photo: Wikimedia Commons · CC BY-SA 4.0" },
  { src: "raw/hwy_stone_sheep_3.jpg", t0: T.sheep - 0.1, t1: T.hour + 0.1, ...ll("muncho"), label: "Stone sheep", credit: "Photo: iNaturalist via Wikimedia Commons · CC0" },
];

const World: Chapter["World"] = ({ t, z }) => {
  const ab = win(t, T.alberta - 0.2, T.post + 0.3);
  const ak = win(t, T.terrified, T.cutoff + 0.5);
  const north = win(t, T.most - 0.1, T.early42 + 0.2);
  return (
    <g>
      <path d={geo.prov.Alberta} fill="#ffd23a" fillOpacity={0.25 * ab} stroke="#fff" strokeWidth={4 / z} strokeOpacity={ab} />
      <path d={geo.prov.Alaska} fill="#e3261c" fillOpacity={(0.35 + 0.15 * Math.sin(t * 6)) * ak} stroke="#fff" strokeWidth={4 / z} strokeOpacity={ak} />
      <path d={geo.prov.Yukon + geo.prov["British Columbia"]} fill="#ffd23a" fillOpacity={0.3 * north} stroke="#fff" strokeWidth={4 / z} strokeOpacity={north} />
    </g>
  );
};

const Screen: Chapter["Screen"] = ({ c, f, t }) => (
  <>
    <Pin c={c} f={f} t={t} {...ll("dawson_creek")} t0={T.dawson} t1={T.dec} label="Dawson Creek" />
    <Tag c={c} f={f} t={t} lon={-118.6} lat={56.6} t0={T.alberta} t1={T.post} text="Alberta" size={28} bg="#b8860b" />
    <Note f={f} t={t} t0={T.dec} t1={T.early42} text="December 1941" />
    <Pin c={c} f={f} t={t} {...ll("pearl_harbor")} t0={T.pearl - 0.2} t1={T.noRoad} label="Pearl Harbor" color="#ff3b30" size={30} />
    <Dots c={c} f={f} t={t} pts={[[-179, 49.5], [-172, 52], [-164, 55], [-156, 59]]} t0={T.terrified + 0.3} t1={T.cutoff} dur={1.4} color="#ff3b30" />
    <Tag c={c} f={f} t={t} lon={-152} lat={64} t0={T.terrified + 0.6} t1={T.cutoff} text="Alaska" size={34} bg="#e3261c" />
    <BigWord f={f} t={t} t0={T.noRoad + 0.4} t1={T.cutoff} text={<span>NO <span style={{ color: "#ff3b30" }}>ROAD</span></span>} />
    <Pin c={c} f={f} t={t} {...ll("edmonton")} t0={T.cutoff} t1={T.early42} label="Edmonton" />
    <Pin c={c} f={f} t={t} {...ll("fairbanks")} t0={T.cutoff + 0.2} t1={T.early42} label="Fairbanks" side="l" />
    <Dots c={c} f={f} t={t} pts={[PL("edmonton"), PL("dawson_creek"), [-125, 59], [-135, 60.7], PL("fairbanks")]} t0={T.cutoff + 0.3} t1={T.early42} dur={1.6} color="#ffffff" />
    <Tag c={c} f={f} t={t} lon={-129} lat={57.6} t0={T.mountains} t1={T.early42} text="Mountains" size={26} bg="#5a5f6b" />
    <Tag c={c} f={f} t={t} lon={-124.4} lat={60.6} t0={T.muskeg} t1={T.early42} text="Muskeg" size={26} bg="#6b4f2a" />
    <Tag c={c} f={f} t={t} lon={-133} lat={61.7} t0={T.forest} t1={T.early42} text="Forest" size={26} bg="#2a7d2e" />
    <Line c={c} f={f} t={t} pts={ALCAN} t0={T.punch} t1={T.k10 + 1.8} dur={2.6} color="#ffd23a" w={8} icon="i_bulldozer" iconSize={120} />
    <Num f={f} t={t} t0={T.k10} t1={T.winter - 0.3} x={1460} y={300} value={10000} prefix="~" label="Troops" />
    <Num f={f} t={t} t0={T.froze} t1={T.black - 0.2} x={1500} y={260} value={40} prefix="−" suffix="°" label="Oil froze in the machines" color="#7fd3ff" />
    <Note f={f} t={t} t0={T.amazes} t1={T.bridge} text="1942" />
    <Line c={c} f={f} t={t} pts={ALCAN} t0={T.finished} t1={T.bridge} dur={2.2} color="#ffd23a" w={10} icon="i_army_truck" iconSize={110} />
    <Num f={f} t={t} t0={T.km} t1={T.bridge} x={1450} y={760} value={2700} prefix=">" suffix=" km" label="Rough road" />
    <Sticker f={f} t={t} t0={T.eight} t1={T.bridge} x={560} y={260}><span style={{ color: "#ffd23a" }}>8</span> MONTHS</Sticker>
    <BigWord f={f} t={t} t0={T.eight2} t1={T.bridge} text="EIGHT MONTHS!" y={930} size={100} />
    {/* una hora sin cruzar un auto */}
    <Line c={c} f={f} t={t} pts={ALCAN.slice(3, 7)} t0={T.hour - 0.1} t1={T.end} dur={3.2} color="#ffffff" w={7} icon="i_pickup" iconSize={110} />
    <Num f={f} t={t} t0={T.hour + 0.4} t1={T.end} x={1500} y={300} value={0} suffix=" cars" label="In one hour" dur={0.2} />
    {PORTALS.map((p, i) => <Portal key={i} c={c} t={t} f={f} p={p} />)}
  </>
);

export const ch02: Chapter = {
  T0: S, T1: T.end,
  keys: [
    [S + 1.0, -120.6, 55.9, 1.0, 0], [T.post, -120.3, 55.8, 1.12, 0],
    [T.dec + 0.4, -120.4, 55.8, 0.9, 0], [T.pearl - 0.2, -150, 38, 0.09, 0], [T.terrified, -151, 44, 0.095, 0],
    [T.cutoff, -135, 58, 0.11, 0], [T.most, -133, 58.5, 0.13, 0], [T.early42, -130, 58.5, 0.14, 0],
    [T.punch, -133, 59.6, 0.2, 0], [T.k10 + 2.0, -133.5, 59.8, 0.21, 0],
    [T.amazes, -133, 59.6, 0.17, 0], [T.bridge, -133.4, 59.8, 0.18, 0],
    [T.rough, -125.5, 59, 0.5, 0], [T.hour - 0.3, -125.2, 59, 0.55, 0], [T.end, -124.4, 58.9, 0.62, 0],
  ],
  World, Screen,
  full: [236.54],
  sfx: [
    [T.dawson, "ck2", 0.1, 0.3], [T.post - 0.2, "sw1", 0.13, 1.2], [T.story - 0.15, "sw4", 0.11, 1.0], [T.pearl - 0.2, "wh5", 0.16, 1.8], [T.pearl, "im1", 0.15, 1.4], [T.noRoad + 0.4, "st2", 0.16, 0.5],
    [T.mountains, "pop1", 0.12, 0.4], [T.muskeg, "pop2", 0.12, 0.4], [T.forest, "pop3", 0.12, 0.4], [T.early42 - 0.2, "sw1", 0.13, 1.2], [T.punch, "wh6", 0.13, 1.2], [T.k10, "tk1", 0.08, 1.0],
    [T.winter - 0.3, "sw4", 0.12, 1.0], [T.froze, "ck6", 0.12, 1.0], [T.black - 0.1, "sw1", 0.12, 1.0], [T.finished, "wh5", 0.14, 1.4], [T.eight, "st1", 0.16, 0.5], [T.eight2, "im2", 0.14, 1.0],
    [T.drive - 0.05, "sw1", 0.12, 1.0], [T.bison - 0.2, "sw4", 0.11, 1.0], [T.sheep - 0.1, "sw4", 0.11, 1.0], [T.hour, "wh2", 0.12, 1.2],
  ],
};

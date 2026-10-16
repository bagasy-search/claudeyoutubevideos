// Capítulo 19 — Fort St. James (1806), el repaso del Norte y la despedida
import React from "react";
import { interpolate, Img } from "remotion";
import { Chapter, at, Tag, Pin, Icon, BigWord, Sticker, Line, Dots, Portal, PortalSpec, PL, P, pj, sf, pop, vis, win, ramp, fadeOut, clamp, SANS } from "./lib";
import { ALCAN } from "./ch01";

const S = at("and i'll leave you");
const TOTAL = 2296.5;
const T = {
  last: at("one last place", S), began: at("really began", S), middle: at("middle of the province", S), lake: at("stewart lake", S), fsj: at("fort st james", S), y1806: at("in 1806", S), trader: at("fur trader", S), fraser: at("simon fraser", S), post: at("trading post", S),
  oldest: at("oldest places", S), contin: at("lived in continuously", S), century: at("more than a century", S), trade: at("fur trade", S), north: at("whole northern", S), caled: at("new caledonia", S),
  dakelh: at("the daco", S), carrier: at("the carrier", S), thousands: at("thousands of years", S), knew: at("knew how", S), furs: at("traded furs", S), salmon: at("salmon and", S), know: at("knowledge", S),
  iron: at("iron tools", S), blankets: at("blankets", S), other: at("other side", S), good: at("for good", S), shape: at("take shape", S),
  today: at("today you can", S), walk: at("walk through", S), restored: at("restored", S), warehouse: at("fur warehouse", S), cache: at("fish cache", S), officer: at("officer's house", S), period: at("period clothing", S),
  stood: at("i stood", S), smell: at("smell of the wood", S), sound: at("sound of the lake", S), canoes: at("all the canoes", S), feel: at("feel the past", S),
  sothat: at("so that's northern", S), vanish: at("built and then vanish", S), volc: at("volcanoes have buried", S), turned: at("turned around", S), ice: at("ice gives back", S), road: at("american road", S), eight: at("eight months", S),
  animals: at("the animals", S), outn: at("outnumber", S), most: at("most canadians", S), never: at("never go", S), keeps: at("keeps it", S), everybody: at("everybody in this country", S),
  empty: at("isn't empty", S), full: at("it's full", S), stories: at("full of stories", S), history: at("full of history", S), forgot: at("we've forgotten", S), knewn: at("never knew", S),
  life: at("whole life", S), flying: at("flying over", S), finding: at("still finding", S), enjoyed: at("if you enjoyed", S), island: at("vancouver island", S), trust: at("trust me", S), care: at("take care", S), gordy: at("i'm gordy", S), upr: at("up the road", S),
};
const FSJ = PL("fort_st_james");
const STUART: [number, number][] = [FSJ, [-124.55, 54.58], [-124.9, 54.72], [-125.3, 54.84], [-125.55, 54.95]];
const FRASER1806: [number, number][] = [[-121.9, 56.03], [-122.7, 55.6], [-123.04, 54.99], [-123.7, 54.7], FSJ];
const NC: [number, number][] = [[-128.2, 57.2], [-122.2, 57.2], [-120.6, 54.2], [-121.8, 52.2], [-126.8, 52.0], [-128.6, 54.4]];
const CR = { fsj: "Photo: Jerrye & Roy Klotz MD · CC BY-SA 3.0", lake: "Photo: Flickr user 15193764@N07 · CC BY 2.0" };

const PORTALS: PortalSpec[] = [
  { src: "img/s_fraser_1806.jpg", t0: T.fraser - 0.1, t1: T.oldest - 0.05, lon: FSJ[0], lat: FSJ[1], zoom: [1.0, 1.12], label: "1806" },
  { src: "raw/stjames_fort_st_james_national_h_1.jpg", t0: T.today - 0.1, t1: T.warehouse - 0.05, lon: FSJ[0], lat: FSJ[1], zoom: [1.0, 1.15], credit: CR.fsj, label: "Fort St. James" },
  { src: "raw/stjames_fort_st_james_national_h_2.jpg", t0: T.warehouse - 0.05, t1: T.period - 0.05, lon: FSJ[0], lat: FSJ[1], zoom: [1.12, 1.0], credit: CR.fsj },
  { src: "img/g_fort_st_james.jpg", t0: T.period - 0.05, t1: T.stood - 0.05, lon: FSJ[0], lat: FSJ[1], zoom: [1.0, 1.1] },
  { src: "raw/stjames_stuart_lake_british_colu_3.jpg", t0: T.stood - 0.05, t1: T.sothat - 0.05, lon: -124.6, lat: 54.6, zoom: [1.0, 1.18], credit: CR.lake, label: "Stuart Lake" },
];
const poly = (pts: [number, number][]) => "M" + pts.map(([lo, la]) => P(lo, la).map((v) => v.toFixed(1)).join(",")).join("L") + "Z";

const World: Chapter["World"] = ({ t, z }) => {
  const on = win(t, T.caled - 0.2, T.dakelh + 0.8, 0.5);
  return on <= 0 ? null : <path d={poly(NC)} fill="#c0392b" fillOpacity={0.22 * on} stroke="#fff" strokeWidth={5 / z} strokeOpacity={on} strokeDasharray={`${20 / z} ${12 / z}`} strokeLinejoin="round" />;
};

// el intercambio: lo que daban los Dakelh ↔ lo que traían los comerciantes
const Trade: React.FC<{ f: number; t: number }> = ({ f, t }) => {
  if (!vis(t, T.furs - 0.2, T.shape)) return null;
  const op = pop(f, T.furs - 0.2, 12) * fadeOut(t, T.shape);
  const L: [string, number][] = [["Furs", T.furs], ["Salmon", T.salmon], ["Knowledge", T.know]];
  const R: [string, number][] = [["Iron tools", T.iron], ["Blankets", T.blankets], ["Goods from across the world", T.other]];
  const card = (s: string, t0: number, i: number, dir: 1 | -1) => {
    const k = ramp(t, t0, 0.5);
    return (
      <div key={s} style={{ position: "absolute", left: dir === 1 ? 260 + 420 * k : 1660 - 420 * k, top: 380 + i * 120, transform: `translate(-50%,-50%) scale(${pop(f, t0, 11)})`, fontFamily: SANS, fontWeight: 900, fontSize: 50, color: "#111", background: dir === 1 ? "#ffd23a" : "#e3f2fd", border: "4px solid #111", borderRadius: 12, padding: "8px 22px", whiteSpace: "nowrap", boxShadow: "0 6px 0 #0006" }}>
        {dir === 1 ? `${s} →` : `← ${s}`}
      </div>
    );
  };
  return (
    <div style={{ zIndex: 20, position: "absolute", inset: 0, opacity: op }}>
      <div style={{ position: "absolute", left: 100, top: 230, width: 1720, height: 560, background: "rgba(12,14,20,.86)", border: "4px solid #fff", borderRadius: 24 }} />
      <div style={{ position: "absolute", left: 260, top: 270, transform: "translateX(-50%)", fontFamily: SANS, fontWeight: 900, fontSize: 38, color: "#ffd23a" }}>DAKELH (CARRIER)</div>
      <div style={{ position: "absolute", left: 1660, top: 270, transform: "translateX(-50%)", fontFamily: SANS, fontWeight: 900, fontSize: 38, color: "#90caf9" }}>FUR TRADERS</div>
      {L.map(([s, t0], i) => card(s, t0, i, 1))}
      {R.map(([s, t0], i) => card(s, t0, i, -1))}
    </div>
  );
};

const AH: [number, number][] = ALCAN;
const ANIMALS = ["i_moose", "i_caribou", "i_grizzly", "i_wolf", "i_sheep", "i_bison", "i_moose", "i_caribou", "i_wolf", "i_grizzly"];

const Screen: Chapter["Screen"] = ({ c, f, t }) => {
  const endFade = interpolate(t, [TOTAL - 1.2, TOTAL - 0.1], [0, 1], clamp);
  const planeK = interpolate(t, [T.flying - 0.3, T.enjoyed], [0, 1], clamp);
  const [ax, ay] = pj(c, -133.0, 59.5), [bx, by] = pj(c, -120.5, 50.5);
  return (
    <>
      <Pin c={c} f={f} t={t} lon={FSJ[0]} lat={FSJ[1]} t0={T.fsj - 0.2} t1={T.dakelh} label="Fort St. James" />
      <Line c={c} f={f} t={t} pts={STUART} t0={T.lake - 0.2} t1={T.dakelh} dur={0.9} color="#2a9df4" w={14} />
      <Tag c={c} f={f} t={t} lon={-125.1} lat={54.95} t0={T.lake + 0.3} t1={T.y1806} text="Stuart Lake" size={28} bg="#1e88e5" />
      <BigWord f={f} t={t} t0={T.y1806} t1={T.fraser} text={<span style={{ color: "#ffd23a" }}>1806</span>} y={160} size={150} />
      <Dots c={c} f={f} t={t} pts={FRASER1806} t0={T.trader - 0.3} t1={T.century} dur={1.2} color="#ffffff" icon="i_canoe" iconSize={90} />
      <Sticker f={f} t={t} t0={T.trader} t1={T.fraser} x={1450} y={250} size={50}>Fur trader: Simon Fraser</Sticker>
      <Sticker f={f} t={t} t0={T.oldest} t1={T.century} x={1450} y={250} size={44}>One of B.C.'s oldest continuously settled places</Sticker>
      <Icon c={c} f={f} t={t} src="i_fort" lon={FSJ[0]} lat={FSJ[1]} dy={-110} t0={T.post} t1={T.dakelh} size={130} />
      <Sticker f={f} t={t} t0={T.century} t1={T.caled} x={1450} y={250} size={50}>100+ years: heart of the fur trade</Sticker>
      <BigWord f={f} t={t} t0={T.caled} t1={T.dakelh + 0.6} text={<span>“NEW <span style={{ color: "#ff8a80" }}>CALEDONIA</span>”</span>} y={160} size={110} />
      <Tag c={c} f={f} t={t} lon={FSJ[0]} lat={FSJ[1]} dy={90} t0={T.dakelh} t1={T.furs} text="Dakelh (Carrier)" size={34} bg="#8e44ad" />
      <Sticker f={f} t={t} t0={T.thousands} t1={T.furs} x={1450} y={250} size={50}>Here for thousands of years</Sticker>
      <Sticker f={f} t={t} t0={T.knew} t1={T.furs} x={1450} y={370} rot={3} size={50}>…they knew how to survive</Sticker>
      <Trade f={f} t={t} />
      <Sticker f={f} t={t} t0={T.good} t1={T.today} x={960} y={880} rot={-2} size={52}>For good and for bad — today's North took shape</Sticker>
      <Sticker f={f} t={t} t0={T.restored} t1={T.warehouse} x={1450} y={250} size={46}>Restored · as it looked ~100 years ago</Sticker>
      {[["Fur warehouse", T.warehouse], ["Fish cache", T.cache], ["Officer's house", T.officer]].map(([s, t0], i) => (
        <Sticker key={i} f={f} t={t} t0={t0 as number} t1={T.period} x={1500} y={230 + i * 115} rot={i % 2 ? 3 : -3} size={48}>{s as string}</Sticker>
      ))}
      <Sticker f={f} t={t} t0={T.period} t1={T.stood} x={1450} y={250} size={46}>Guides in period clothing</Sticker>
      <Sticker f={f} t={t} t0={T.smell} t1={T.canoes} x={1450} y={250} size={48}>The smell of the wood…</Sticker>
      <Sticker f={f} t={t} t0={T.sound} t1={T.canoes} x={1450} y={370} rot={3} size={48}>…the sound of the lake</Sticker>
      <Sticker f={f} t={t} t0={T.feel} t1={T.sothat} x={1450} y={250} size={52}>You can feel the past</Sticker>

      {/* el repaso: todo el Norte en un mapa */}
      <BigWord f={f} t={t} t0={T.sothat} t1={T.vanish} text={<span>NORTHERN <span style={{ color: "#ffd23a" }}>BRITISH COLUMBIA</span></span>} y={150} size={96} />
      <Icon c={c} f={f} t={t} src="i_town_empty" lon={-129.48} lat={55.46} t0={T.vanish} t1={T.most} size={110} />
      <Icon c={c} f={f} t={t} src="i_town_empty" lon={-129.83} lat={59.28} t0={T.vanish + 0.4} t1={T.most} size={110} />
      <Sticker f={f} t={t} t0={T.vanish} t1={T.volc} x={1450} y={260} size={50}>Towns built… then vanished</Sticker>
      <Icon c={c} f={f} t={t} src="i_volcano" lon={-128.9} lat={55.11} t0={T.volc} t1={T.most} size={120} />
      <Sticker f={f} t={t} t0={T.volc} t1={T.turned} x={1450} y={260} size={50}>Volcanoes that buried villages</Sticker>
      <Icon c={c} f={f} t={t} src="i_tunnel" lon={-127.94} lat={53.56} t0={T.turned} t1={T.most} size={110} />
      <Sticker f={f} t={t} t0={T.turned} t1={T.ice} x={1450} y={260} size={50}>Rivers sent through mountains</Sticker>
      <Icon c={c} f={f} t={t} src="i_glacier" lon={-137.5} lat={59.6} t0={T.ice} t1={T.most} size={120} />
      <Sticker f={f} t={t} t0={T.ice} t1={T.road} x={1450} y={260} size={50}>Ice that gives people back</Sticker>
      <Line c={c} f={f} t={t} pts={AH} t0={T.road - 0.2} t1={T.most} dur={1.6} color="#ffd23a" w={9} icon="i_army_truck" iconSize={100} />
      <Sticker f={f} t={t} t0={T.eight} t1={T.animals} x={1450} y={260} size={50}>An American road · 8 months</Sticker>
      {ANIMALS.map((a, i) => (
        <Icon key={i} c={c} f={f} t={t} src={a} lon={-133 + (i % 5) * 3.6} lat={58.4 - Math.floor(i / 5) * 2.6 + (i % 2) * 0.6} t0={T.animals + i * 0.12} t1={T.most} size={90} />
      ))}
      <Icon c={c} f={f} t={t} src="i_people" lon={-123.0} lat={55.0} t0={T.outn} t1={T.most} size={70} />
      <Sticker f={f} t={t} t0={T.outn} t1={T.most} x={1450} y={260} size={50}>Animals ≫ people</Sticker>

      <Sticker f={f} t={t} t0={T.never} t1={T.everybody} x={1450} y={250} size={50}>Most Canadians will never go</Sticker>
      <Sticker f={f} t={t} t0={T.keeps} t1={T.everybody} x={1450} y={370} rot={3} size={50}>…maybe that keeps it wild</Sticker>
      <BigWord f={f} t={t} t0={T.empty} t1={T.full} text={<span>THE NORTH ISN'T <span style={{ color: "#9aa5b1" }}>EMPTY</span></span>} y={160} size={100} />
      <BigWord f={f} t={t} t0={T.full} t1={T.life} text={<span>IT'S <span style={{ color: "#ffd23a" }}>FULL</span></span>} y={160} size={150} />
      {[["…of stories", T.stories], ["…of history", T.history], ["…of things we've forgotten", T.forgot], ["…and things we never knew", T.knewn]].map(([s, t0], i) => (
        <Sticker key={i} f={f} t={t} t0={t0 as number} t1={T.life} x={1450} y={330 + i * 110} rot={i % 2 ? 3 : -3} size={46}>{s as string}</Sticker>
      ))}
      {vis(t, T.flying - 0.3, T.enjoyed) && (
        <div style={{ zIndex: 20, position: "absolute", left: ax + (bx - ax) * planeK, top: ay + (by - ay) * planeK + Math.sin(t * 2) * 10, transform: "translate(-50%,-50%) rotate(130deg)", opacity: win(t, T.flying - 0.3, T.enjoyed, 0.3) }}>
          <Img src={sf("icons/i_plane.png")} style={{ width: 200 }} />
        </div>
      )}
      <Sticker f={f} t={t} t0={T.finding} t1={T.enjoyed} x={1450} y={250} size={50}>…still finding surprises</Sticker>
      <Tag c={c} f={f} t={t} lon={-125.6} lat={49.6} t0={T.island - 0.1} t1={T.care} text="NEXT: VANCOUVER ISLAND" size={40} bg="#e3261c" />
      <Line c={c} f={f} t={t} pts={[[-123.4, 48.45], [-124.0, 49.2], [-125.0, 49.7], [-125.9, 50.2], [-127.4, 50.6]]} t0={T.island - 0.1} t1={T.care} dur={1.0} color="#ffd23a" w={8} />
      {endFade > 0 && <div style={{ zIndex: 60, position: "absolute", inset: 0, background: `rgba(0,0,0,${endFade})` }} />}
      {PORTALS.map((p, i) => <Portal key={i} c={c} t={t} f={f} p={p} />)}
    </>
  );
};

export const ch19: Chapter = {
  T0: S, T1: TOTAL,
  keys: [
    [S + 0.3, -126.0, 54.5, 0.35, 0], [T.middle, -124.6, 54.6, 0.7, 0], [T.fsj, -124.6, 54.6, 1.4, 0], [T.trader, -123.2, 55.2, 0.75, 0], [T.oldest, -124.25, 54.44, 1.3, 0],
    [T.caled, -124.8, 54.6, 0.32, 0], [T.dakelh, -124.25, 54.44, 1.2, 0], [T.knew, -124.25, 54.44, 1.4, 0],
    [T.sothat, -127.0, 56.0, 0.24, 0], [T.vanish, -128.0, 56.5, 0.27, 0], [T.ice, -129.5, 57.0, 0.22, 0], [T.road, -125.5, 57.5, 0.26, 0], [T.animals, -126.0, 57.0, 0.24, 0],
    [T.most, -125.5, 55.5, 0.22, 0], [T.empty, -125.5, 55.5, 0.2, 0], [T.life, -126.0, 55.0, 0.2, 0], [T.island - 0.3, -125.5, 49.8, 0.5, 0], [T.care, -125.5, 49.8, 0.55, 0], [TOTAL, -125.0, 50.5, 0.4, 0],
  ],
  World, Screen,
  full: [2223.459, 2264.059, 2290.339],
  sfx: [
    [T.last, "st1", 0.1, 0.5], [T.fsj, "pop1", 0.1, 0.4], [T.y1806, "im1", 0.14, 1.4], [T.fraser - 0.1, "sw1", 0.12, 1.0], [T.oldest, "pop2", 0.1, 0.4], [T.caled, "im2", 0.13, 1.2],
    [T.dakelh, "pop3", 0.1, 0.4], [T.furs, "wh2", 0.1, 0.8], [T.salmon, "wh2", 0.1, 0.8], [T.know, "wh2", 0.1, 0.8], [T.iron, "wh6", 0.1, 0.8], [T.blankets, "wh6", 0.1, 0.8], [T.other, "wh6", 0.1, 0.8],
    [T.today - 0.1, "sw4", 0.12, 1.0], [T.warehouse, "pop4", 0.1, 0.4], [T.cache, "pop5", 0.1, 0.4], [T.officer, "pop1", 0.1, 0.4], [T.stood - 0.05, "sw1", 0.12, 1.0],
    [T.sothat, "im1", 0.13, 1.4], [T.vanish, "pop2", 0.1, 0.4], [T.volc, "pop3", 0.1, 0.4], [T.turned, "pop4", 0.1, 0.4], [T.ice, "pop5", 0.1, 0.4], [T.road, "wh2", 0.1, 1.6], [T.animals, "tk1", 0.08, 1.2],
    [T.empty, "st2", 0.12, 0.5], [T.full, "im2", 0.15, 1.4], [T.flying - 0.3, "wh6", 0.1, 2.0], [T.island, "im1", 0.12, 1.2],
  ],
};

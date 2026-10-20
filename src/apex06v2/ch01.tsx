// Capítulo 1 — el gancho (gancho.tsx) se cierra sobre Kumaon → 40 especies → los pocos que comen gente →
// Champawat 436 → el ranking vuela a su riel → "#1 no es el león" → suscripción → "una regla" (0:00 → ~1:01)
import React from "react";
import { Chapter, at, atEnd, G, Tag, Pin, BigWord, Sticker, Num, Dots, Portal, PortalSpec, Country, ramp, win, WD, RED, GOLD, pj, pop, vis, fadeOut, SANS } from "./lib";
import { RANK, RANK_T, slotXY } from "./rank";

const T = {
  forty: at("40 species"), almost: at("almost all of them"), most: at("most of them weigh"), backpack: at("backpack"),
  few: at("and then there are a few"), killed: at("killed and eaten"), eaten: at("eaten hundreds"), hundreds: at("hundreds of people"),
  one: at("one tiger in nepal"), nepal: at("nepal and india"), india: at("india is credited"), credited: at("credited with"), n436: at("436 human"), deaths: at("human deaths"),
  record: at("that is a world record"), nobody: at("nobody wanted"), today: at("so today we are"),
  twist: at("here is the twist"), notl: at("not the lion"), ifyou: at("if you like real"), subs: at("subscribe to apex"), does: atEnd("all this channel does"),
  before: at("before we start"), rule: at("one rule"), falls: at("falls apart"), lots: at("lots of animals"),
};
const CHAMP: [number, number] = [80.07, 29.33];
const TIG: [number, number] = [80, 23], LIONP: [number, number] = [35, -5], LEOP: [number, number] = [79.4, 29.9];

// ~40 especies de felino salvaje, un punto por especie en su zona (gato montés, ocelote, serval, gato de Pallas…)
const SPECIES: [number, number][] = [
  [35, -3], [22, 2], [24, -21], [12, 14], [31, -10], [14, 0], [23, -28], [3, 26], [18, 9], [40, 8],
  [80, 22], [84, 33], [99, 22], [112, 0], [101, 15], [96, 9], [87, 23], [114, 30], [104, 2], [78, 12],
  [102, 46], [70, 27], [100, 35], [132, 45], [57, 33], [116, 1], [25, 61], [-6, 38], [6, 47], [45, 41],
  [-60, -9], [-112, 41], [-102, 58], [-92, 34], [-64, -4], [-74, 3], [-49, -21], [-62, -32], [-72, -40], [-67, -21],
];

const PORTALS: PortalSpec[] = [
  { src: "real/lynx_10994322.mp4", video: true, startFrom: 1.0, t0: T.almost - 0.1, t1: T.few + 0.05, lon: 25, lat: 61, zoom: [1.14, 1.02] },
  { src: "real/tiger_37885533.mp4", video: true, startFrom: 0.6, t0: T.killed - 0.15, t1: T.one + 0.15, lon: TIG[0], lat: TIG[1], zoom: [1.1, 1.0] },
  { src: "foto/Head_of_the_Champawat_Tiger.jpg", t0: T.record - 0.2, t1: T.today + 0.2, lon: CHAMP[0], lat: CHAMP[1], maxR: 300, dx: 560, dy: -40, zoom: [1.15, 1.05], credit: "Wikimedia Commons" },
  { src: "real/lion_30280654.mp4", video: true, startFrom: 0.5, t0: T.notl - 0.05, t1: T.does + 0.35, lon: 0, lat: 0, sx: slotXY(6)[0], sy: slotXY(6)[1] - 20, zoom: [1.12, 1.0], dc: 0.7 },
];

const World: Chapter["World"] = ({ t, z }) => {
  const champ = win(t, T.nepal - 0.1, T.today + 0.4, 0.5);
  return (
    <g>
      <Country name="Nepal" z={z} op={champ} fill="#ffd23a" />
      <Country name="India" z={z} op={win(t, T.india - 0.1, T.today + 0.4, 0.5)} />
      <Country name="India" z={z} op={win(t, G - 1.0, G + 1.8, 0.5) * 0.5} />
    </g>
  );
};

const Screen: Chapter["Screen"] = ({ c, f, t }) => {
  const few = ramp(t, T.few, 0.6) * (1 - ramp(t, T.one + 0.4, 0.5));
  return (
    <>
      <Pin c={c} f={f} t={t} lon={CHAMP[0]} lat={CHAMP[1]} t0={G - 0.6} t1={T.forty + 1.0} label="Kumaon" side="l" />
      {/* 40 especies: un punto por especie; después casi todas se apagan y quedan 3 rojas */}
      {SPECIES.map(([lo, la], i) => {
        const t0 = T.forty + 0.05 + i * 0.045;
        if (!vis(t, t0, T.one + 0.9)) return null;
        const [x, y] = pj(c, lo, la), s = pop(f, t0, 10) * fadeOut(t, T.one + 0.9, 0.5);
        const r = 9 * (1 - 0.45 * few);
        return <div key={i} style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: r, background: few > 0.5 ? "#8a8f99" : GOLD, border: "2px solid #fff", opacity: 1 - 0.55 * few, transform: `scale(${s})`, boxShadow: "0 2px 6px rgba(0,0,0,.6)" }} />;
      })}
      <Num f={f} t={t} t0={T.forty} t1={T.almost + 0.3} x={960} y={150} value={40} prefix="~" label="Wild cat species" size={92} dur={1.6} />
      <Sticker f={f} t={t} t0={T.backpack} t1={T.few} x={1420} y={820} rot={-5} size={70}>LIGHTER THAN A <span style={{ color: GOLD }}>BACKPACK</span></Sticker>
      {[TIG, LIONP, LEOP].map(([lo, la], i) => <Pin key={i} c={c} f={f} t={t} lon={lo} lat={la} t0={T.few + 0.5 + i * 0.25} t1={T.one + 0.6} color={RED} />)}
      <Sticker f={f} t={t} t0={T.hundreds} t1={T.one} x={960} y={880} rot={4} bg={RED} size={72}>HUNDREDS OF PEOPLE · EACH</Sticker>
      {/* Champawat */}
      <Pin c={c} f={f} t={t} lon={CHAMP[0]} lat={CHAMP[1]} t0={T.credited - 0.1} t1={T.today + 0.3} label="Champawat" side="l" />
      <Tag c={c} f={f} t={t} lon={84.2} lat={28.2} t0={T.nepal} t1={T.today + 0.3} text="Nepal" size={30} />
      <Tag c={c} f={f} t={t} lon={78.5} lat={24.2} t0={T.india} t1={T.today + 0.3} text="India" size={30} />
      <Dots c={c} f={f} t={t} pts={WD.dots.champawat} k={interpolate01(t, T.credited + 0.2, T.deaths + 0.5)} op={fadeOut(t, T.today + 0.4, 0.5)} />
      <Num f={f} t={t} t0={T.n436 - 0.2} t1={T.today + 0.3} x={330} y={880} value={436} label="Human deaths · one tiger" size={110} prog={interpolate01(t, T.credited + 0.2, T.deaths + 0.5)} color="#ff5a3a" />
      <Sticker f={f} t={t} t0={at("world record")} t1={T.today + 0.1} x={1520} y={860} rot={-6} size={64}>WORLD <span style={{ color: GOLD }}>RECORD</span></Sticker>
      {/* ranking */}
      <BigWord f={f} t={t} t0={RANK_T.POP} t1={RANK_T.FLY + 0.8} text={<span>RANKING THE <span style={{ color: GOLD }}>BIG CATS</span></span>} y={130} size={96} />
      <BigWord f={f} t={t} t0={T.twist} t1={T.notl + 0.1} text={<span>THE <span style={{ color: RED }}>TWIST</span></span>} y={160} size={110} />
      {PORTALS.map((p, i) => <Portal key={i} c={c} t={t} f={f} p={p} />)}
      {/* sobre el león (dentro del portal) */}
      <Sticker f={f} t={t} t0={T.notl + 0.35} t1={T.ifyou + 0.2} x={960} y={420} rot={-8} bg={RED} size={120}>#1 ≠ LION</Sticker>
      <Sticker f={f} t={t} t0={T.subs} t1={T.does + 0.15} x={960} y={860} rot={-3} bg={RED} size={78}>SUBSCRIBE · APEX FILES</Sticker>
      <BigWord f={f} t={t} t0={T.rule} t1={T.lots + 0.6} text={<span>ONE <span style={{ color: GOLD }}>RULE</span></span>} y={170} size={130} />
    </>
  );
};
function interpolate01(t: number, a: number, b: number) { return Math.min(1, Math.max(0, (t - a) / (b - a))); }

export const ch01: Chapter = {
  T0: 0, T1: T.lots + 1,
  keys: [
    [0, CHAMP[0], CHAMP[1], 44], [G + 0.6, CHAMP[0], CHAMP[1], 36],
    [T.forty + 2.0, 15, 14, 340], [T.almost + 0.3, 18, 16, 330],
    [T.few + 0.2, 25, 20, 300], [T.hundreds, 62, 10, 150],
    [T.one + 0.9, 81, 27, 30], [T.deaths + 0.6, 80.6, 28.6, 26], [T.today - 0.2, 80.4, 28.7, 24],
    [T.today + 1.4, 0, 14, 345], [T.notl, -2, 12, 340],
    [T.does, 20, 8, 230], [T.before + 1.6, 30, -2, 90], [T.lots + 1, 34, -3, 60],
  ],
  World,
  Screen,
  sfx: [
    [G + 0.15, "lib/whoosh_soft_3.mp3", 0.5, 1.4], [T.forty + 0.1, "lib/twinkle_2.mp3", 0.35, 1.6],
    [T.almost - 0.15, "lib/whoosh_soft_1.mp3", 0.45, 1.0], [T.backpack, "lib/pop_soft_3.mp3", 0.5, 0.5], [T.few + 0.1, "lib/whoosh_reverse_4.mp3", 0.45, 1.0],
    [T.few + 0.5, "lib/tap_2.mp3", 0.4, 0.4], [T.few + 0.75, "lib/tap_3.mp3", 0.4, 0.4], [T.few + 1.0, "lib/tap_4.mp3", 0.4, 0.4],
    [T.killed - 0.2, "lib/whoosh_soft_2.mp3", 0.45, 1.0], [T.hundreds, "lib/impact_soft_2.mp3", 0.5, 0.9],
    [T.one + 0.1, "lib/whoosh_glass_1.mp3", 0.45, 1.2], [T.credited + 0.2, "lib/count_tick_1.mp3", 0.3, 2.5], [T.deaths, "deep-cinematic-impact-1.mp3", 0.55, 2.0],
    [T.record - 0.2, "universfield-camera-shutter-199580.mp3", 0.35, 0.6], [at("world record"), "lib/impact_soft_1.mp3", 0.45, 0.8],
    [T.today + 0.1, "lib/whoosh_soft_4.mp3", 0.45, 1.3], [RANK_T.POP, "lib/pop_soft_1.mp3", 0.4, 0.5], [RANK_T.FLY, "lib/card_slide_2.mp3", 0.45, 1.8],
    [RANK_T.LUNCH, "lib/glitch_soft_2.mp3", 0.35, 0.6], [T.twist - 0.4, "lib/riser_soft_3.mp3", 0.4, 1.4], [T.notl - 0.05, "deep-cinematic-impact-2.mp3", 0.55, 2.0],
    [T.subs, "lib/ui_select_3.mp3", 0.4, 0.5], [T.does + 0.1, "lib/whoosh_reverse_1.mp3", 0.45, 1.0], [T.rule, "lib/impact_soft_3.mp3", 0.45, 0.9],
  ],
  amb: [
    [T.almost - 0.1, T.few + 0.05, "real/lynx_10994322.mp4", 1.0],
    [T.killed - 0.15, T.one + 0.15, "real/tiger_37885533.mp4", 0.6],
    [T.notl - 0.05, T.does + 0.35, "real/lion_30280654.mp4", 0.5],
  ],
};

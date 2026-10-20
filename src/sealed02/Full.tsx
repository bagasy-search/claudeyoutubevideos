// sealed02 · VIDEO COMPLETO (≈15 min) con la vara del minuto 1 v2: 0–64,5 s = Min2 aprobado; después 7 lugares.
// · cada plano = lo que dice la voz EN ESE SEGUNDO (frases.txt / caps_resto.json, tiempos GLOBALES en segundos)
// · tomas agnes (ag_*) con foto real de primer cuadro o recreación; si una toma no llegó, cae sola a su foto real
//   (img_dXXX) con dolly 3D, así el render nunca rompe (avail.ts lo arma el port antes del farm)
// · escenas three.js nuevas en three3d_b.tsx; costuras BTG: flash en la palabra, globo que vuelve (Hop3D), tarjetas 3D
// Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, FONT, KeyLine } from "../kits/btg/kit";
import { Card3D, CardJoint3D, Flash, Min2, MIN2_FRAMES, PlaceTag, Pill, Shot, Stack3D, Studio, extrude } from "./Min2";
import { Big3D, Cars3D, Clamp3D, Crane3D, Gap3D, Gobekli3D, HBlock3D, Hop3D, Lintel3D, Pound3D, Quake3D, SITES7, Timeline3D, Twelve3D } from "./three3d_b";
import { AVAIL } from "./avail";

const FPS = 30;
const s = (t: number) => Math.round(t * FPS);
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const FULL_SECS = 901.3;
export const FULL_FRAMES = s(FULL_SECS);

// toma agnes que no llegó → su foto real (la misma que le dio el primer cuadro, o una afín del lugar)
const FB: Record<string, string> = {
  cz_coric_curve: "d009", cz_coric_conv: "d017", cz_coric_niche: "d013", cz_coric_wall: "d010", cz_sac1: "d019", cz_sac2: "d023", cz_sac3: "d018",
  cz_spanish: "d011", cz_tear: "d014", cz_quake: "d015", cz_gold: "d016", cz_melt: "d012", cz_protzen: "d020", cz_pound_macro: "d021", cz_fit: "d022",
  pp_land: "d002", pp_h1: "d003", pp_h2: "d004", pp_carved: "d005", pp_plate: "d007", pp_slab: "d118", pp_gate: "d120", pp_wall: "d116",
  pp_marks: "d006", pp_pour: "d008", pp_drag: "d001", pp_berkeley: "d113",
  bb_tri1: "d027", bb_tri2: "d028", bb_tri3: "d030", bb_jup1: "d038", bb_jup2: "d041", bb_cap: "d036", bb_huge: "d032", bb_quarry3: "d033", bb_crane: "d029", bb_winch: "d031",
  eg_giza: "d058", eg_khafre: "d045", eg_casing: "d048", eg_steps: "d061", eg_village: "d050", eg_crew: "d051", eg_white: "d046", eg_strip: "d047", eg_petrie: "d052", eg_saw: "d053",
  gb_site: "d067", gb_site2: "d068", gb_pillar: "d072", gb_relief: "d071", gb_hands: "d075", gb_raise: "d063", gb_carve: "d073", gb_feast: "d064", gb_unfin: "d065",
  dl_site: "d077", dl_wall1: "d079", dl_wall2: "d082", dl_insc: "d083", dl_oracle: "d078", dl_mtn: "d081",
  sh_tri: "d088", sh_lintel: "d086", sh_close: "d095", sh_wide: "d092", sh_wales: "d105", sh_altar: "d111", sh_drag: "d087", sh_carve: "d089",
  cl_scan: "d024", cl_final: "c035",
};
// orden: toma LTX (ltx_f_<id>, la calidad del minuto 1) → toma agnes (ag_<id>) → foto real
const res = (id: string) => {
  if (!id.startsWith("ag_")) return id;
  const k = id.slice(3);
  return AVAIL.has("f_" + k) ? "f_" + k : AVAIL.has(id) ? id : "img_" + (FB[k] ?? "d002");
};

// toma a pantalla completa; si cayó a foto, la foto se mueve en 3D (dolly + giro lento), nunca queda plana
const TK: React.FC<{ id: string; d: number; off?: number; dark?: number; blurAt?: number }> = ({ id, d, off, dark, blurAt }) => {
  const f = useCurrentFrame();
  const r = res(id);
  if (!r.startsWith("img_")) return <Shot id={r} d={d} off={off} dark={dark} blurAt={blurAt} />;
  const k = interpolate(f, [0, d], [0, 1], cl);
  const dir = (r.charCodeAt(5) + r.charCodeAt(6)) % 2 ? 1 : -1;
  return (
    <AbsoluteFill style={{ background: "#000", perspective: 1400, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translateZ(${40 + k * 150}px) rotateY(${dir * (3 - k * 6)}deg) rotateX(${1 - k * 2}deg) translateX(${dir * (k - 0.5) * 60}px)` }}>
        <Shot id={r} d={d} z={[1.06, 1.1]} dark={dark} blurAt={blurAt} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Fade: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [d - 20, d], [0, 1], cl) }} />;
};

type R = (L: (t: number) => number, d: number) => React.ReactNode;
type Seg = [number, number, R];
const ag = (id: string, off?: number): R => (_L, d) => <TK id={"ag_" + id} d={d} off={off} />;
const px = (id: string, off?: number): R => (_L, d) => <TK id={"px_" + id} d={d} off={off} />;
const w = (...rs: R[]): R => (L, d) => <>{rs.map((r, i) => <React.Fragment key={i}>{r(L, d)}</React.Fragment>)}</>;
const kl = (t: number, text: string, o: Partial<React.ComponentProps<typeof KeyLine>> = {}): R => (L) => <KeyLine a={L(t)} text={text} {...o} out={o.out !== undefined ? L(o.out) : undefined} />;
const big = (t: number, text: string, o: { y?: number; size?: number; hot?: boolean; out?: number } = {}): R => (L) => <Big3D a={L(t)} text={text} y={o.y} size={o.size} hot={o.hot} out={o.out !== undefined ? L(o.out) : undefined} />;
const tag = (t: number, text: string, sub?: string): R => (L) => <PlaceTag a={L(t)} text={text} sub={sub} />;
const stk = (lines: [number, string, boolean?][], o: { x?: number; y?: number; size?: number } = {}): R => (L) => <Stack3D lines={lines.map(([t, x, h]) => ({ at: L(t), t: x, hot: h }))} {...o} />;
const fl = (t: number, warm?: boolean): R => (L) => <Flash at={L(t)} warm={warm} />;
const pills = (ps: [number, string][]): R => (L) => <>{ps.map(([t, x], i) => <Pill key={i} a={L(t)} text={x} x={220 + (i % 2) * 760 + i * 40} y={250 + i * 150} z={40 + (i % 3) * 120} />)}</>;
const studio = (id: string, off?: number): R => () => <Studio id={res(id)} off={off} />;


const QuarryCard: React.FC = () => {
  const f = useCurrentFrame();
  return <Card3D id={res("ag_bb_quarry3")} off={5.4} x={560} y={200} w={800} h={500} ry={-16 + f * 0.25} z={-f * 2} label="NEVER LEFT THE QUARRY" hot />;
};
// Cusco y Delphi enfrentadas como dos tarjetas 3D (el mismo muro en las dos puntas del planeta)
const TwoWalls: React.FC<{ L: (t: number) => number }> = ({ L }) => {
  const f = useCurrentFrame();
  return <>
    <Card3D id="px_20771430" off={6} x={150} y={240} w={760} h={470} ry={18 - f * 0.02} z={-40} label="CUSCO · PERU" />
    <Card3D id="img_d081" x={1010} y={240} w={760} h={470} ry={-18 + f * 0.02} z={-40} label="DELPHI · GREECE" />
    <KeyLine a={L(710.6)} text="separated by *2,000 years*" align="center" y={830} size={52} />
    <KeyLine a={L(714.0)} text="never met. never *traded.*" align="center" y={920} size={44} />
  </>;
};

// destinos extra para los arcos de Stonehenge
const MARLB: [number, number] = [51.42, -1.73], PRESELI: [number, number] = [51.97, -4.75], ORKN: [number, number] = [58.75, -3.1];

const SEGS: Seg[] = [
  // ══════════ 1 · PERU ══════════
  [64.5, 70.8, () => <Hop3D d={6.3} from={3} to={0} title="1 · PERU" sub="CUSCO" titleAt={5.1} />],
  [70.8, 74.2, w(px("20771551"), tag(71.2, "CUSCO", "3,400 M · THE ANDES"))],
  [74.2, 77.8, w(px("12905000"), kl(75.3, "capital of the largest *empire* in the Americas"))],
  [77.8, 82.6, w(ag("cz_spanish"), big(79.4, "1533", { hot: true }))],
  [82.6, 85.4, ag("cz_tear")],
  [85.4, 88.1, w(px("3824285"), kl(85.9, "right on top of the old *foundations.*"))],
  [88.1, 96.4, () => <Quake3D d={8.3} shake={[1.9]} year={[{ a: 0.4, t: "1650" }]} labelsAt={0.3} />],
  [96.4, 100.7, w(ag("cz_quake"), big(98.4, "1950", { hot: true }), fl(98.4))],
  [100.7, 105.3, w(px("20771430"), kl(102.2, "like *nothing* happened."))],
  [105.3, 109.4, w(ag("cz_coric_conv"), kl(106.2, "a pretty *rude* thing for a wall to do"))],
  [109.4, 113.3, w(ag("cz_coric_curve"), tag(110.4, "QORIKANCHA", "TEMPLE OF THE SUN"))],
  [113.3, 116.4, w(ag("cz_gold"), fl(115.2, true), kl(114.6, "sheets of solid *gold*"))],
  [116.4, 120.6, ag("cz_melt")],
  [120.6, 127.7, w(ag("cz_coric_niche"), kl(124.2, "the Inca walls came back into the *light*"))],
  [127.7, 132.8, w(ag("cz_coric_wall"), stk([[127.8, "PERFECT."], [128.36, "CURVED."], [129.06, "STILL STANDING.", true]]))],
  [132.8, 147.9, () => <Twelve3D d={15.1} countAt={5.6} countDur={1.4} shakeAt={12.0} />],
  [147.9, 154.5, w(px("20129937"), kl(152.4, "nowhere else to *go.*"))],
  [154.5, 160, w(ag("cz_sac1"), tag(156.8, "SACSAYHUAMAN", "1400s – 1500s"))],
  [160, 165, w(ag("cz_sac2"), kl(161.2, "three giant *zigzag* walls"))],
  [165, 174.6, w(ag("cz_sac3", 0.1), kl(166.5, "taller than a person on another person's *shoulders*"), big(171.4, "100+ TONS", { hot: true, y: 300 }), fl(171.4))],
  [174.6, 184.8, w(studio("px_39212541"), kl(176.5, "nobody *knows.*", { align: "center", y: 200, size: 60 }), pills([[181.2, "MELTED STONE?"], [182.2, "LOST TECHNOLOGY?"], [183.3, "YOU KNOW THE ONES"]]))],
  [184.8, 192.2, w(ag("cz_protzen"), tag(187.4, "JEAN-PIERRE PROTZEN", "ARCHITECT · 1980s"), kl(190.7, "he *tried it* himself."))],
  [192.2, 198.3, () => <Pound3D d={6.1} mode="pound" />],
  [198.3, 205, w(ag("cz_pound_macro"), stk([[198.35, "NOT CHISELING."], [199.4, "POUNDING.", true]]), kl(200.6, "thousands of tiny *blows*"))],
  [205, 208.8, w(ag("cz_fit"), kl(205.1, "it *worked.*"))],
  [208.8, 219.3, () => <Pound3D d={10.5} mode="fit" marks={[{ a: 0.04, t: "*lower* it onto its neighbor" }, { a: 2.0, t: "*lift* it" }, { a: 2.74, t: "*look* where it touched" }, { a: 4.1, t: "*pound* those spots down" }, { a: 5.66, t: "*lower* it again" }, { a: 6.8, t: "over and *over*" }]} />],
  [219.3, 224.2, w(px("3923584"), kl(219.4, "the secret wasn't a lost *machine.*", { out: 222.9 }), big(223.44, "PATIENCE.", { hot: true }), fl(223.44, true))],

  // ══════════ 2 · BOLIVIA ══════════
  [224.2, 233, () => <Hop3D d={8.8} from={0} to={1} title="2 · BOLIVIA" sub="TIWANAKU" titleAt={6.8} arcs={[{ a: SITES7[0], b: SITES7[1], at: 2.4, label: "~500 KM" }]} />],
  [233, 237, w(ag("pp_land"), tag(233.6, "PUMA PUNKU", "TIWANAKU · BOLIVIA"))],
  [237, 241, w(px("34644249"), kl(238.2, "almost *4 km* above sea level"))],
  [241, 245, w(ag("pp_gate"), big(243.4, "1,500 YEARS"))],
  [245, 249, w(ag("pp_slab"), kl(246.6, "a giant dropped a box of *Lego*"))],
  [249, 255, w(ag("pp_h1"), tag(250.9, "H-BLOCKS", "ANDESITE · ONE OF THE HARDEST STONES"))],
  [255, 266, () => <HBlock3D d={11} measureAt={0.5} copiesAt={8.8} />],
  [266, 271.5, w(ag("pp_h2"), kl(267.6, "cut by machines… or *lasers?*"))],
  [271.5, 277.7, w(ag("pp_marks"), kl(273.2, "tiny pits from *hammerstones*"), kl(276.0, "ground flat with *sand*", { y: 920 }))],
  [277.7, 286.9, w(ag("pp_carved"), kl(278.2, "obsessively careful *human* work."), kl(284.3, "the Incas: one stone, *one* neighbor", { y: 920 }))],
  [286.9, 294.5, w(() => <HBlock3D d={7.6} copiesAt={0} wallAt={1.2} />, kl(287.6, "*interchangeable* parts", { align: "center", y: 120 }))],
  [294.5, 300.8, w(ag("pp_plate"), kl(296.0, "little T-shaped *notches*"), kl(299.6, "locked together with *metal*", { y: 920 }))],
  [300.8, 305.6, w(ag("pp_pour"), kl(301.4, "researchers analyzed the *clamps*"))],
  [305.6, 313.3, () => <Clamp3D d={7.7} pourAt={2.1} />],
  [313.3, 320.4, w(ag("pp_wall"), big(316.38, "130 TONS", { hot: true, y: 300 }), fl(316.38), kl(319.3, "from a quarry *10 km* away"))],
  [320.4, 326.2, w(ag("pp_drag"), kl(320.5, "*dragged* across the high plains"), kl(323.0, "at *4,000 m*", { y: 920 }))],
  [326.2, 333.4, w(ag("pp_berkeley"), tag(326.4, "UC BERKELEY · 2018", "3D-PRINTED MODELS"))],
  [333.4, 340.4, w(px("31755958"), kl(335.3, "the world's hardest *puzzle*"), kl(337.9, "the pieces were *standardized*", { y: 920 }))],
  [340.4, 345.6, w(px("33625894"), stk([[341.2, "REASSEMBLED"], [343.4, "FROM ITS OWN"], [344.5, "RUBBLE.", true]], { size: 110 }))],

  // ══════════ 3 · LEBANON ══════════
  [345.6, 351.9, () => <Hop3D d={6.3} from={1} to={2} title="3 · LEBANON" sub="BAALBEK" titleAt={4.6} />],
  [351.9, 356.9, w(ag("bb_jup1"), tag(353.4, "TEMPLE OF JUPITER", "BAALBEK · 2,000 YEARS AGO"))],
  [356.9, 360.4, w(ag("bb_cap"), kl(357.0, "and kings like big *furniture.*"))],
  [360.4, 365.5, w(ag("bb_tri1"), tag(363.6, "THE TRILITHON", "3 STONES · SIDE BY SIDE"))],
  [365.5, 370.4, w(ag("bb_tri2"), big(366.3, "19 M", { out: 368.7 }), big(369.0, "800 TONS", { hot: true }), fl(369.0))],
  [370.4, 376.9, w(ag("bb_tri3"), kl(372.0, "lifted *7 m* off the ground"), kl(375.2, "you can barely see the *joint.*", { y: 920 }))],
  [376.9, 384.4, () => <Cars3D d={7.5} stoneAt={3.6} liftAt={5.1} />],
  [384.4, 389.5, w(ag("bb_quarry3"), kl(385.0, "the *quarry*, a short walk away"))],
  [389.5, 395, w(ag("bb_huge"), tag(390.0, "STONE OF THE PREGNANT WOMAN", "~1,000 TONS"), kl(393.2, "cut on *five* sides… and left there"))],
  [395, 399.5, w(ag("bb_jup2"), kl(397.0, "\"You know what? *Tomorrow.*\"", { align: "center", size: 58 }))],
  [399.5, 404.8, w(px("31100076"), big(401.38, "2014", { out: 404.4 }), kl(402.6, "another block *underneath*"))],
  [404.8, 414.2, w(px("11740428"), big(407.44, "1,650 TONS", { hot: true, y: 260 }), fl(407.44), kl(409.6, "the *largest* stone block ever cut by human hands"), kl(412.6, "hiding under the *second largest.*", { y: 920 }))],
  [414.2, 419.3, w(px("20606539"), kl(415.1, "how did the Romans move *800 tons?*"), kl(417.8, "we don't know *exactly.*", { y: 920 }))],
  [419.3, 424.8, w(ag("bb_winch"), pills([[420.6, "EARTH RAMPS"], [421.5, "ROLLERS"], [422.2, "LEVERS"], [423.4, "WINCHES"]]))],
  [424.8, 440.4, () => <Crane3D d={15.6} liftAt={2.6} manyAt={9.4} />],
  [440.4, 445.8, w(ag("bb_crane"), kl(441.0, "the best engineers of their time"), kl(444.6, "the absolute *limit.*", { y: 920 }))],
  [445.8, 449.2, w(studio("px_31100076", 6), () => <QuarryCard />)],
  [449.2, 454.6, w(studio("px_32261421"), stk([[449.5, "HEAVY?"], [452.3, "NOT THE QUESTION."], [454.0, "TIGHT.", true]], { size: 112 }))],

  // ══════════ 4 · EGYPT ══════════
  [454.6, 459.2, () => <Hop3D d={4.6} from={2} to={3} title="4 · EGYPT" sub="GIZA" titleAt={3.4} />],
  [459.2, 464.1, w(ag("eg_giza"), kl(460.4, "the pyramids *aren't* the mystery"))],
  [464.1, 468.2, w(px("10717893"), big(464.3, "2,300,000 BLOCKS", { size: 120 }), kl(466.4, "over about *20 years*", { align: "center" }))],
  [468.2, 472.8, w(px("10719349"), kl(468.4, "*logistics*, not a magic trick"), kl(470.7, "and not *slaves*, either", { y: 920 }))],
  [472.8, 481, w(ag("eg_village"), tag(473.6, "THE WORKERS' VILLAGE", "BAKERIES · BREWERIES · GRAVES"))],
  [481, 486.6, w(ag("eg_crew"), kl(482.2, "the crews had *team names*"), kl(485.66, "\"Friends of *Khufu*\"", { y: 920 }))],
  [486.6, 490.9, w(px("35695240"), kl(488.3, "you *sign* the building."))],
  [490.9, 496.7, w(ag("eg_steps"), kl(494.5, "a *staircase* of rough brown blocks"))],
  [496.7, 505.3, w(ag("eg_white"), fl(498.5, true), big(498.5, "WHITE.", { y: 260 }), kl(503.4, "almost *painful* to look at"))],
  [505.3, 513.1, w(ag("eg_strip"), kl(505.4, "most of that skin is *gone.*"), big(509.0, "1303", { hot: true, y: 260 }), kl(511.0, "used to build *Cairo*", { y: 920 }))],
  [513.1, 515.9, w(ag("eg_khafre"), kl(513.3, "a few are *still there*"))],
  [515.9, 520.3, w(ag("eg_petrie"), tag(517.4, "FLINDERS PETRIE", "1880s"))],
  [520.3, 526.6, w(ag("eg_casing"), kl(521.4, "some *taller* than a person"))],
  [526.6, 546.5, () => <Gap3D d={19.9} closeAt={0.3} diveAt={1.4} paperAt={3.94} cementAt={11.1} />],
  [546.5, 551.3, w(px("4174146"), kl(547.4, "the work of an *optician*"), kl(549.7, "on a scale of *acres.*", { y: 920 }))],
  [551.3, 562.2, w(ag("eg_saw"), pills([[552.1, "COPPER"], [553.3, "SAND"], [554.2, "STONE"]]), kl(558.6, "the *sand* does the cutting"))],
  [562.2, 566.5, w(px("39400715"), kl(562.3, "slow. *Brutally* slow."))],
  [566.5, 571.8, w(px("32537551"), kl(568.8, "a whole *lifetime* on one building"))],

  // ══════════ 5 · TURKEY ══════════
  [571.8, 576.5, w(px("10717893", 20), stk([[573.9, "KINGS."], [574.7, "CITIES."], [575.6, "FARMS."]], { size: 110 }))],
  [576.5, 583.8, () => <Hop3D d={7.3} from={3} to={4} title="5 · TURKEY" sub="GÖBEKLI TEPE" titleAt={4.0} />],
  [583.8, 591.3, w(ag("gb_site"), tag(584.0, "GÖBEKLI TEPE", "SOUTHEASTERN TURKEY"), kl(589.0, "shaped like a capital *T*"))],
  [591.3, 595.5, w(ag("gb_pillar"), big(591.6, "5 M · 10 TONS", { size: 120 }))],
  [595.5, 601, w(ag("gb_relief"), pills([[596.4, "FOXES"], [597.3, "WILD BOARS"], [598.4, "SNAKES"], [599.2, "VULTURES"]]))],
  [601, 607, w(ag("gb_hands"), kl(602.6, "*arms*, with long fingers"))],
  [607, 612.8, () => <Gobekli3D d={5.8} tags={[{ a: 1.7, t: "giant stone *figures*, watching the middle" }]} />],
  [612.8, 617.9, w(ag("gb_site2"), big(614.4, "11,600 YEARS", { hot: true }), fl(614.4))],
  [617.9, 629.6, () => <Timeline3D d={11.7} marks={[{ a: 0.3, t: "GÖBEKLI TEPE", sub: "9600 BC", yr: 11600, hot: true }, { a: 1.6, t: "PYRAMIDS", sub: "2560 BC", yr: 4560 }, { a: 3.6, t: "STONEHENGE", sub: "3000 BC", yr: 5600 }]} stamps={[{ a: 5.9, t: "BEFORE FARMING" }, { a: 6.9, t: "POTTERY" }, { a: 7.8, t: "THE WHEEL" }, { a: 8.9, t: "WRITING" }]} />],
  [629.6, 635.1, w(px("19321125"), kl(632.3, "too busy looking for *dinner*"))],
  [635.1, 644.4, w(ag("gb_raise"), kl(636.8, "but they were *planned*"))],
  [644.4, 650.9, w(ag("gb_unfin"), big(646.4, "7 M", { y: 260 }), kl(648.4, "abandoned before it ever left the *ground*"))],
  [650.9, 655.1, w(ag("gb_carve"), kl(652.5, "a very bad day at *work.*"))],
  [655.1, 663.8, w(studio("px_35628058"), big(656.6, "BACKWARDS?", { hot: true, out: 659.3 }), kl(655.5, "maybe the other way *around*", { out: 659.4 }), stk([[659.6, "FARMING → TEMPLES?"], [662.0, "TEMPLES → FARMING.", true]], { size: 96 }))],
  [663.8, 671.9, w(ag("gb_feast"), kl(669.6, "the most expensive *party* in history."))],
  [671.9, 676.3, w(px("33625894", 7), big(675.6, "TIGHT.", { hot: true }), fl(675.6))],

  // ══════════ 6 · GREECE ══════════
  [676.3, 680.5, () => <Hop3D d={4.2} from={4} to={5} title="6 · GREECE" sub="DELPHI" titleAt={1.9} />],
  [680.5, 684.5, w(ag("dl_mtn"), tag(681.4, "DELPHI", "THE POLYGONAL WALL"))],
  [684.5, 689, w(ag("dl_oracle"), kl(686.0, "ask the *oracle* about their future"))],
  [689, 695, w(ag("dl_site"), big(692.6, "2,500 YEARS", { y: 260 }))],
  [695, 702.7, w(ag("dl_wall1"), stk([[695.9, "IRREGULAR."], [697.6, "CURVED."], [701.6, "NO MORTAR.", true]]))],
  [702.7, 708.7, w(ag("dl_wall2"), kl(705.4, "the same technique as *Cusco*"))],
  [708.7, 716.9, w(studio("px_35628058", 12), (L) => <TwoWalls L={L} />)],
  [716.9, 722.2, w(studio("px_39212541", 5), pills([[718.6, "SECRET CONNECTION?"], [719.6, "ALIENS?"], [720.9, "ATLANTIS?"]]))],
  [722.2, 732.9, w(() => <Twelve3D d={10.7} countAt={30} explodeAt={4.0} shakeAt={7.6} />, kl(725.6, "both *earthquake* country", { align: "center", y: 120 }))],
  [732.9, 737.3, w((L, d) => <TK id="img_d085" d={d} />, kl(733.0, "odd shapes that *lock* together"))],
  [737.3, 741.1, w(px("20771551", 6), big(740.6, "THE GROUND.", { hot: true }), fl(740.6))],
  [741.1, 746, w((L, d) => <TK id="img_d080" d={d} />, kl(742.6, "a public *notice board*"))],
  [746, 751, w(ag("dl_insc"), kl(746.2, "hundreds of carved *inscriptions*"))],
  [751, 755.3, w((L, d) => <TK id="img_d084" d={d} />, kl(751.2, "records of slaves being *freed*"))],
  [755.3, 760.1, w(studio("img_d083"), stk([[755.4, "A WALL BUILT"], [756.4, "TO LAST"], [757.1, "FOREVER.", true]]))],

  // ══════════ 7 · ENGLAND ══════════
  [760.1, 764.6, () => <Hop3D d={4.5} from={5} to={6} title="7 · ENGLAND" sub="STONEHENGE" titleAt={3.7} />],
  [764.6, 768.8, w(ag("sh_wide"), tag(764.8, "STONEHENGE", "SALISBURY PLAIN"))],
  [768.8, 774, w(ag("sh_tri"), kl(771.4, "a *secret* most people walk right past"))],
  [774, 780.1, w(ag("sh_lintel"), kl(774.0, "look at the *top.*"), kl(779.2, "they're *locked* on.", { y: 920 }))],
  [780.1, 791.4, () => <Lintel3D d={11.3} dropAt={2.0} xrayAt={5.6} tongueAt={8.3} />],
  [791.4, 794, w(ag("sh_close"), stk([[791.45, "WOODWORKING."], [793.08, "CARPENTRY.", true]], { size: 110 }))],
  [794, 802, w(ag("sh_carve"), kl(795.0, "built in stone, *4,500* years ago"), kl(799.0, "they just refused to *change*", { y: 920 }))],
  [802, 813.5, w(() => <Lintel3D d={11.5} dropAt={-9} xrayAt={-9} tongueAt={-9} ringAt={1.2} />, kl(808.3, "*7-ton* lintels, shaped into a ring", { align: "center", y: 900 }))],
  [813.5, 819, w(px("35628058", 18), big(816.3, "25 KM", { y: 260 }), kl(814.0, "the sarsens came from a *woodland*"))],
  [819, 824.8, w((L, d) => <TK id="img_d093" d={d} />, kl(819.5, "proven in *2020*, by the chemistry of a core"))],
  [824.8, 830.9, w(ag("sh_wales"), tag(826.4, "PRESELI HILLS · WALES", "THE BLUESTONES"), big(829.0, "200+ KM", { y: 300 }))],
  [830.9, 837.5, w(ag("sh_altar"), tag(831.5, "THE ALTAR STONE", "2024"))],
  [837.5, 843.2, w(() => <Hop3D d={5.7} from={6} to={6} hold endDist={1.5} arcs={[{ a: MARLB, b: SITES7[6], at: 0.0, label: "25 KM" }, { a: PRESELI, b: SITES7[6], at: 0.5, label: "200 KM" }, { a: ORKN, b: SITES7[6], at: 1.1, label: "700 KM", hot: true }]} />, kl(841.5, "the longest *delivery* of the Stone Age", { align: "center", y: 900 }))],
  [843.2, 845.9, w(px("26347209"), kl(843.4, "still waiting for a *package*"))],

  // ══════════ CIERRE ══════════
  [845.9, 858.6, w(() => <Hop3D d={12.7} from={6} to={0} hold endDist={2.6} recap={[{ a: 2.1 }, { a: 2.75 }, { a: 3.4 }, { a: 4.1 }, { a: 4.8 }, { a: 5.5 }, { a: 6.2 }]} />, kl(855.4, "too heavy, too old, or too *perfect*", { align: "center", y: 900, size: 52 }))],
  [858.6, 863.2, w(px("36592342"), kl(861.3, "modern machines *can* copy them."))],
  [863.2, 868.7, w(px("7480060"), kl(865.2, "a perfect copy… *this afternoon.*"))],
  [868.7, 871.7, w(ag("cl_scan"), kl(869.4, "a fraction of a *millimeter*"))],
  [871.7, 877.1, w(px("28239367"), stk([[871.7, "BUT NOBODY DOES IT."], [873.04, "NOT BECAUSE WE CAN'T.", true]], { size: 90 }))],
  [877.1, 880, w(studio("px_32537551", 8), stk([[877.14, "NOT MONEY."], [877.96, "NOT TECHNOLOGY."], [879.1, "TIME.", true]]), fl(879.1, true))],
  [880, 886.2, w(ag("cz_fit", 4.3), kl(883.6, "something they would never see *finished.*"))],
  [886.2, 892, w(px("31755958", 8), kl(887.3, "better tools than they ever dreamed of"), kl(890.6, "what we don't have is their *patience.*", { y: 920 }))],
  [892, FULL_SECS, w(ag("cl_final"), (L) => <Sequence from={L(898.0)}><CardJoint3D /></Sequence>, (_L, d) => <Fade d={d} />)],
];

export const Full: React.FC = () => (
  <AbsoluteFill style={{ background: "#000", fontFamily: FONT, color: C.ink }}>
    <Sequence durationInFrames={MIN2_FRAMES}><Min2 noAudio /></Sequence>
    {SEGS.map(([a, b, r], i) => {
      const from = s(a), d = s(b) - from;
      return <Sequence key={i} from={from} durationInFrames={d}>{r((t) => s(t) - from, d)}</Sequence>;
    })}
    <Audio src={staticFile("sealed02.wav")} />
  </AbsoluteFill>
);
void extrude;

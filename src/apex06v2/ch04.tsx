// Capítulo 4 — los del medio: #5 jaguar (Américas → Pantanal) y #4 puma (de Canadá a la Patagonia, <30 muertes, te sigue
// por detrás, "stand tall"). Cierra con "so far… an accident / the top three are different".
import React from "react";
import { Chapter, at, Sticker, BigWord, Num, Pin, Tag, Cat, Range, Country, Dots, pv, PortalSpec, ramp, win, fadeOut, WD, RED, GOLD, ORANGE } from "./lib";
import { RG } from "./ranges";

const T = {
  n5: at("number five the jaguar"), biggest: at("the biggest cat in the americas"), weapon: at("the strangest weapon"), throat: at("most big cats kill"), skull: at("bites straight through"),
  bite: at("its bite is so strong"), walnut: at("like a walnut"), swims: at("it swims across"), caimans: at("hunts caimans"), drags: at("and drags them"),
  expect: at("so you would expect"), isnt: at("there isn't one"), rare: at("fatal jaguar attacks"), onebyone: at("one by one"), most: at("most of the ones that do"),
  cornered: at("was cornered"), wounded: at("wounded", at("was cornered")), dogs: at("with dogs"), pant: at("in the pantanal"), yards: at("only a few yards away"),
  looks: at("the jaguar looks at"), yawns: at("yawns"), sleep: at("goes back to sleep"), dang: at("it is dangerous but"),
  n4: at("number 4"), names: at("also called the puma"), mlion: at("the mountain lion"), panther: at("the panther"), cata: at("the catamount"), record: at("world record for the animal"),
  surprised: at("how many different people"), canada: at("it lives from canada"), tip: at("the tip of south america"), unlike: at("and unlike the cats"),
  hunted: at("it has hunted people"), us: at("in the united states and canada"), fewer: at("fewer than 30"), century: at("well over a century"), small: at("that is a small number"),
  way: at("but the way they happen"), front: at("a cougar does not charge"), follows: at("it follows you"), behind: at("it stays behind you"), jumps: at("and then it jumps"),
  targets: at("the people it targets"), easy: at("easy prey"), smallp: at("someone small"), alone: at("someone alone"), running: at("someone running"),
  jogger: at("to a cougar a jogger"), deer: at("a lot like a deer"), rangers: at("that is why park rangers"), dont: at("do not run"), stand: at("stand tall"),
  jacket: at("open your jacket"), arms: at("wave your arms"), worst: at("the worst meal"), win: at("you are not trying to win"), convince: at("you are trying to convince"),
  sofar: at("so far every cat"), accident: at("an accident"), top3: at("the top three are different"), habit: at("into a habit"),
};
export const CH04_T1 = at("number three the leopard");
const JAG: [number, number] = [-60, -9], PANT: [number, number] = [-56.8, -17.5], COU: [number, number] = [-112, 41];

const portals: PortalSpec[] = [
  // #5
  pv("real/jaguar_19210129.mp4", T.n5 + 4.4, T.throat + 0.3, JAG[0], JAG[1], { startFrom: 1.0, zoom: [1.12, 1.0] }),
  pv("ltx/ap6_jaguar_caiman.mp4", T.swims - 0.2, T.expect + 0.3, JAG[0], JAG[1], { startFrom: 0, zoom: [1.04, 1.0] }),
  pv("ltx/ap6_jaguar_orilla.mp4", T.yards - 0.6, T.looks + 0.4, PANT[0], PANT[1], { startFrom: 0, zoom: [1.06, 1.0] }),
  pv("ilu/ap6i_boat.mp4", T.looks, T.n4 - 0.3, PANT[0], PANT[1], { startFrom: 2.0, zoom: [1.0, 1.08] }),
  // #4
  pv("real/cougar_15343877.mp4", T.names - 0.1, T.surprised + 1.2, COU[0], COU[1], { startFrom: 1.0, sx: 560, sy: 500, maxR: 330, zoom: [1.12, 1.0] }),
  pv("ilu/ap6i_cougarfollow_a.mp4", T.follows - 0.4, T.jumps + 0.3, COU[0], COU[1], { startFrom: 0, zoom: [1.0, 1.1] }),
  pv("atk/ap6_puma_trailcam.mp4", T.jumps - 0.2, T.targets + 0.4, COU[0], COU[1], { startFrom: 2.0, zoom: [1.04, 1.0] }),
  pv("real/hiker_5195355.mp4", T.jogger - 0.2, T.rangers + 0.2, -106, 39, { startFrom: 0, zoom: [1.06, 1.0] }),
  pv("ilu/ap6i_cougarfollow_b.mp4", T.deer - 0.4, T.dont + 0.2, -106, 39, { startFrom: 1.0, zoom: [1.0, 1.08] }),
  pv("ilu/ap6i_standtall_a.mp4", T.stand - 0.3, T.win + 0.3, -106, 39, { startFrom: 0, zoom: [1.0, 1.08] }),
  pv("ilu/ap6i_standtall2.mp4", T.win, T.sofar + 0.2, -106, 39, { startFrom: 0.5, zoom: [1.0, 1.08] }),
];

const World: Chapter["World"] = ({ t, z }) => (
  <g>
    <Range id="jag" rings={RG.jaguar} from={JAG} k={ramp(t, T.biggest, 2.0)} op={win(t, T.biggest, T.n4 + 1.0, 0.6)} />
    <Country name="Brazil" z={z} op={win(t, T.pant - 0.2, T.n4, 0.5) * 0.6} />
    <Range id="cou" rings={RG.cougar} from={COU} k={ramp(t, T.canada, 3.0)} op={win(t, T.canada - 0.2, T.sofar + 0.6, 0.6)} />
    <Country name="United States of America" z={z} op={win(t, T.us, T.way + 0.4, 0.5) * 0.45} />
    <Country name="Canada" z={z} op={win(t, at("and canada", T.us), T.way + 0.4, 0.5) * 0.45} />
  </g>
);

const Screen: Chapter["Screen"] = ({ c, f, t }) => (
  <>
    {/* #5 jaguar */}
    <Cat c={c} f={f} t={t} src="jaguar" lon={JAG[0]} lat={JAG[1]} t0={T.n5 + 0.4} t1={T.n5 + 4.6} h={120} />
    <Sticker f={f} t={t} t0={T.biggest + 0.2} t1={T.throat} x={960} y={180} rot={-3} size={60}>BIGGEST CAT IN THE AMERICAS</Sticker>
    <Sticker f={f} t={t} t0={T.throat + 0.4} t1={T.bite} x={640} y={500} rot={-5} size={64}><s style={{ textDecorationColor: RED, textDecorationThickness: 8 }}>THROAT</s></Sticker>
    <Sticker f={f} t={t} t0={T.skull} t1={T.bite + 0.6} x={1280} y={560} rot={5} bg={RED} size={80}>THE SKULL</Sticker>
    <Cat c={c} f={f} t={t} src="jaguar" lon={JAG[0]} lat={JAG[1]} t0={T.throat + 0.2} t1={T.swims} h={170} />
    <Sticker f={f} t={t} t0={T.walnut - 0.3} t1={T.swims - 0.1} x={960} y={860} rot={-3} bg={GOLD} size={66}><span style={{ color: "#111" }}>TURTLE SHELL = WALNUT</span></Sticker>
    <Sticker f={f} t={t} t0={T.caimans} t1={T.expect} x={960} y={190} rot={3} size={60}>HUNTS CAIMANS IN THE WATER</Sticker>
    <Sticker f={f} t={t} t0={T.isnt} t1={T.rare} x={960} y={860} rot={-4} bg={GOLD} size={76}><span style={{ color: "#111" }}>THERE ISN'T ONE.</span></Sticker>
    <Sticker f={f} t={t} t0={T.onebyone - 0.2} t1={T.most} x={960} y={200} rot={3} size={60}>SO RARE THEY'RE LISTED ONE BY ONE</Sticker>
    <Sticker f={f} t={t} t0={T.cornered + 0.2} t1={T.pant} x={520} y={820} rot={-6} size={56}>CORNERED</Sticker>
    <Sticker f={f} t={t} t0={T.wounded} t1={T.pant} x={960} y={860} rot={2} size={56}>WOUNDED</Sticker>
    <Sticker f={f} t={t} t0={T.dogs - 0.4} t1={T.pant} x={1420} y={820} rot={-3} size={56}>HUNTED WITH DOGS</Sticker>
    <Pin c={c} f={f} t={t} lon={PANT[0]} lat={PANT[1]} t0={at("pantanal") } t1={T.yards} label="Pantanal" color={GOLD} />
    <Sticker f={f} t={t} t0={T.yawns} t1={T.dang} x={1380} y={860} rot={4} bg={GOLD} size={64}><span style={{ color: "#111" }}>*YAWN*</span></Sticker>
    <BigWord f={f} t={t} t0={T.dang} t1={T.n4 - 0.2} text={<span><span style={{ color: ORANGE }}>DANGEROUS</span> · NOT A HUNTER OF YOU</span>} y={190} size={80} />

    {/* #4 puma */}
    <Cat c={c} f={f} t={t} src="cougar" lon={COU[0]} lat={COU[1]} t0={T.n4 + 0.4} t1={T.canada} h={150} />
    <Sticker f={f} t={t} t0={T.names + 0.6} t1={T.surprised + 1.0} x={1180} y={300} rot={-5} size={54}>PUMA</Sticker>
    <Sticker f={f} t={t} t0={T.mlion} t1={T.surprised + 1.0} x={1460} y={440} rot={4} size={54}>MOUNTAIN LION</Sticker>
    <Sticker f={f} t={t} t0={T.panther} t1={T.surprised + 1.0} x={1240} y={590} rot={-3} size={54}>PANTHER</Sticker>
    <Sticker f={f} t={t} t0={T.cata} t1={T.surprised + 1.0} x={1500} y={740} rot={5} size={54}>CATAMOUNT</Sticker>
    <Sticker f={f} t={t} t0={T.record} t1={T.surprised + 1.0} x={960} y={160} rot={-2} bg={GOLD} size={56}><span style={{ color: "#111" }}>WORLD RECORD · MOST NAMES</span></Sticker>
    <Tag c={c} f={f} t={t} lon={-100} lat={56} t0={at("from canada") } t1={T.hunted} text="Canada" size={30} />
    <Tag c={c} f={f} t={t} lon={-69} lat={-50} t0={T.tip + 0.6} t1={T.hunted} text="Tip of South America" size={30} />
    <BigWord f={f} t={t} t0={T.hunted} t1={T.us} text={<span>IT HAS <span style={{ color: RED }}>HUNTED PEOPLE</span></span>} y={190} size={100} />
    <Dots c={c} f={f} t={t} pts={WD.dots.cougar} k={Math.min(1, Math.max(0, (t - T.fewer) / 1.6))} op={fadeOut(t, T.front, 0.5)} />
    <Num f={f} t={t} t0={T.fewer - 0.2} t1={T.front - 0.1} x={1480} y={860} value={30} prefix="< " label="fatal attacks · 100+ years" size={100} />
    <Sticker f={f} t={t} t0={T.small} t1={T.way} x={960} y={180} rot={-3} size={60}>A SMALL NUMBER…</Sticker>
    <Sticker f={f} t={t} t0={T.way + 0.3} t1={T.front} x={960} y={300} rot={3} bg={RED} size={60}>…BUT HOW IT HAPPENS</Sticker>
    <Sticker f={f} t={t} t0={T.behind + 0.4} t1={T.jumps} x={960} y={190} rot={-3} size={58}>BEHIND YOU · LOW · SILENT</Sticker>
    <Sticker f={f} t={t} t0={at("goes for the neck")} t1={T.targets} x={960} y={860} rot={4} bg={RED} size={70}>THE BACK. THE NECK.</Sticker>
    <Sticker f={f} t={t} t0={T.smallp} t1={T.jogger} x={520} y={520} rot={-6} size={66}>SMALL</Sticker>
    <Sticker f={f} t={t} t0={T.alone} t1={T.jogger} x={960} y={560} rot={3} size={66}>ALONE</Sticker>
    <Sticker f={f} t={t} t0={T.running} t1={T.jogger} x={1400} y={520} rot={-3} bg={RED} size={66}>RUNNING</Sticker>
    <Sticker f={f} t={t} t0={T.deer - 0.2} t1={T.rangers} x={960} y={860} rot={-3} bg={ORANGE} size={64}>JOGGER AT DUSK ≈ DEER</Sticker>
    <BigWord f={f} t={t} t0={T.dont} t1={T.stand - 0.1} text={<span>DO <span style={{ color: RED }}>NOT</span> RUN</span>} y={200} size={130} />
    <Sticker f={f} t={t} t0={T.stand} t1={T.win} x={440} y={200} rot={-5} bg={GOLD} size={52}><span style={{ color: "#111" }}>STAND TALL</span></Sticker>
    <Sticker f={f} t={t} t0={T.jacket} t1={T.win} x={960} y={160} rot={3} bg={GOLD} size={52}><span style={{ color: "#111" }}>OPEN YOUR JACKET</span></Sticker>
    <Sticker f={f} t={t} t0={T.arms} t1={T.win} x={1480} y={200} rot={-3} bg={GOLD} size={52}><span style={{ color: "#111" }}>WAVE YOUR ARMS</span></Sticker>
    <Sticker f={f} t={t} t0={T.worst} t1={T.win} x={960} y={860} rot={-2} size={58}>THE WORST MEAL IT EVER CONSIDERED</Sticker>
    <Sticker f={f} t={t} t0={T.convince + 0.6} t1={T.sofar - 0.1} x={960} y={860} rot={3} bg={RED} size={58}>NOT WORTH THE FIGHT</Sticker>
    <BigWord f={f} t={t} t0={T.accident - 0.3} t1={T.top3 - 0.1} text={<span>AT WORST · AN <span style={{ color: "#7ee08a" }}>ACCIDENT</span></span>} y={200} size={96} />
    <BigWord f={f} t={t} t0={T.top3} t1={T.habit + 1.4} text={<span>THE TOP THREE ARE <span style={{ color: RED }}>DIFFERENT</span></span>} y={200} size={90} />
    <Sticker f={f} t={t} t0={T.habit - 0.4} t1={T.habit + 1.5} x={960} y={420} rot={-4} bg={RED} size={80}>EATING PEOPLE = A HABIT</Sticker>
  </>
);

export const ch04: Chapter = {
  T0: at("now things start to change"), T1: CH04_T1 + 1.0,
  keys: [
    [T.n5 + 1.2, -62, -8, 70], [T.throat + 0.4, -62, -10, 60], [T.swims, -60, -6, 56], [T.pant + 0.8, PANT[0], PANT[1], 22], [T.looks, PANT[0], PANT[1], 20],
    [T.n4 + 1.2, -108, 42, 60], [T.canada + 0.6, -95, 30, 110], [T.tip, -80, 5, 190], [T.hunted + 0.6, -100, 45, 80], [T.front + 0.5, -110, 42, 55],
    [T.jogger, -106, 39, 40], [T.sofar + 0.4, -60, 20, 250], [T.habit, -20, 20, 290],
  ],
  World,
  Screen,
  portals,
  sfx: [
    [T.n5 - 0.5, "lib/whoosh_glass_2.mp3", 0.45, 1.3], [T.n5 + 0.4, "lib/pop_soft_1.mp3", 0.45, 0.5], [T.biggest, "lib/shimmer_3.mp3", 0.3, 1.5],
    [T.skull, "lib/impact_soft_5.mp3", 0.45, 0.8], [T.walnut, "lib/snip_2.mp3", 0.35, 0.5], [T.isnt, "lib/tap_3.mp3", 0.4, 0.4],
    [T.cornered + 0.2, "lib/tap_1.mp3", 0.35, 0.4], [T.wounded, "lib/tap_2.mp3", 0.35, 0.4], [T.dogs - 0.4, "lib/tap_3.mp3", 0.35, 0.4],
    [T.pant - 0.2, "lib/whoosh_soft_8.mp3", 0.45, 1.3], [T.yawns, "lib/bubble_pop_2.mp3", 0.35, 0.5],
    [T.n4 - 0.5, "lib/whoosh_glass_3.mp3", 0.45, 1.3], [T.n4 + 0.4, "lib/pop_soft_2.mp3", 0.45, 0.5],
    [T.names + 0.6, "lib/pop_soft_3.mp3", 0.35, 0.5], [T.mlion, "lib/pop_soft_4.mp3", 0.35, 0.5], [T.panther, "lib/pop_soft_5.mp3", 0.35, 0.5], [T.cata, "lib/pop_soft_6.mp3", 0.35, 0.5],
    [T.canada, "lib/whoosh_soft_4.mp3", 0.4, 1.3], [T.hunted, "deep-cinematic-impact-2.mp3", 0.5, 2.0], [T.fewer - 0.2, "lib/count_tick_1.mp3", 0.3, 1.6],
    [T.follows - 0.4, "lib/whoosh_reverse_3.mp3", 0.4, 1.0], [T.smallp, "lib/tap_4.mp3", 0.35, 0.4], [T.alone, "lib/tap_5.mp3", 0.35, 0.4], [T.running, "lib/tap_6.mp3", 0.35, 0.4],
    [T.dont, "lib/impact_soft_3.mp3", 0.45, 0.8], [T.stand, "lib/pop_soft_7.mp3", 0.35, 0.5], [T.jacket, "lib/pop_soft_8.mp3", 0.35, 0.5], [T.arms, "lib/pop_soft_1.mp3", 0.35, 0.5],
    [T.sofar + 0.2, "lib/whoosh_soft_1.mp3", 0.4, 1.3], [T.top3 - 0.5, "lib/riser_soft_4.mp3", 0.4, 1.4],
  ],
};

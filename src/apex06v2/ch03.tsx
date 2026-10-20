// Capítulo 3 — "los tres inofensivos": #8 leopardo de las nieves (Himalaya), #7 guepardo (África → India/Persia con correa),
// #6 lince (Eurasia → Suiza/Finlandia). Cada uno: la cámara vuela a su zona, crece su rango, el recorte se para en su punto
// y el material real entra por portales que se abren desde ese punto.
import React from "react";
import { Chapter, at, Sticker, BigWord, Num, Pin, Tag, Cat, Range, pv, PortalSpec, ramp, win, RED, GOLD, ORANGE } from "./lib";
import { RG } from "./ranges";

const T = {
  n8: at("number 8"), lives: at("it lives higher"), feet: at("16000 feet"), jump: at("it can jump around"), tail: at("it has a tail"), least: at("and it is as far"),
  noconf: at("there is no confirmed case"), none: at("none"), herders: at("herders in these"), ghost: at("scientists have a nickname"), ghostw: at("the ghost of the mountains"),
  notb: at("not because it haunts"), sees: at("if a snow leopard ever"), never: at("you never find out"),
  n7: at("number 7"), fastest: at("the fastest land animal"), mph: at("70 miles an hour"), nightmare: at("you would think the fastest"), opp: at("it is the opposite"),
  bike: at("a cheetah is built like"), legs: at("long legs"), head: at("a tiny head"), skull: at("a light skull"), teeth: at("and small teeth"), traded: at("everything was traded"),
  nothing: at("nothing was left for fighting"), lose: at("cheetahs regularly lose"), imagine: at("imagine running"), bird: at("by a bird"), norec: at("there is no reliable record"),
  royal: at("for centuries royal"), leash: at("walked them on leashes"), try: at("try doing that"),
  n6: at("number 6"), paws: at("big paws"), disap: at("permanently disappointed"), eur: at("the eurasian lynx is"), dog: at("a large dog"), forests: at("it lives in the forests"),
  siberia: at("siberia"), casia: at("and central asia", at("it lives in the forests")), towns: at("from towns"), roe: at("it hunts roe deer"), menu: at("but humans are simply"),
  nofatal: at("there is no known fatal"), hikers: at("hikers in places like"), finland: at("and finland"), boring: at("you are boring"), compl: at("is a compliment"),
  three: at("so those are the harmless"), change: at("now things start to change"),
};
export const CH03_T1 = T.change + 1.6;
const SNOW: [number, number] = [84, 33], CHEE: [number, number] = [26, -8], LYNX: [number, number] = [40, 57];

const portals: PortalSpec[] = [
  // #8
  pv("real/himal_1439950.mp4", T.n8 + 4.4, T.jump + 0.4, 84, 30, { startFrom: 1.0, zoom: [1.12, 1.0] }),
  pv("real/snowleo_5503847.mp4", T.jump - 0.2, T.tail + 0.5, 84, 33, { startFrom: 1.5, zoom: [1.08, 1.0] }),
  pv("real/snowleo_5240201.mp4", T.tail, T.least + 0.4, 84, 33, { startFrom: 1.0, zoom: [1.05, 1.14] }),
  pv("ilu/ap6i_herder.mp4", T.herders - 0.2, T.ghost + 0.35, 82, 36, { startFrom: 0.3, zoom: [1.02, 1.1] }),
  pv("ilu/ap6i_ghost.mp4", T.ghost - 0.1, T.sees + 0.3, 82, 36, { startFrom: 0, zoom: [1.0, 1.12] }),
  pv("real/himal_6900954.mp4", T.sees, T.n7 - 0.3, 86, 31, { startFrom: 2.0, zoom: [1.0, 1.12] }),
  // #7
  pv("ltx/ap6_cheetah_corre.mp4", T.n7 + 4.0, T.nightmare + 0.4, CHEE[0], CHEE[1], { startFrom: 0, zoom: [1.04, 1.0] }),
  pv("atk/ap6_cheetah_derriba.mp4", T.nightmare - 0.2, T.opp + 0.9, CHEE[0], CHEE[1], { startFrom: 0.5, zoom: [1.06, 1.0] }),
  pv("real/cheetah_8256952.mp4", T.bike - 0.2, T.traded + 0.3, CHEE[0], CHEE[1], { startFrom: 1.0, zoom: [1.0, 1.06] }),
  pv("atk/ap6_cheetah_hienas.mp4", T.lose - 0.25, T.imagine + 0.4, CHEE[0], CHEE[1], { startFrom: 0.3, zoom: [1.04, 1.12] }),
  pv("ilu/ap6i_vulture_b.mp4", T.imagine, T.norec + 0.3, CHEE[0], CHEE[1], { startFrom: 0, zoom: [1.0, 1.1] }),
  pv("ilu/ap6i_leash.mp4", T.royal + 1.6, T.try + 0.6, 62, 28, { startFrom: 1.0, zoom: [1.0, 1.08] }),
  // #6
  pv("real/lynx_16938209.mp4", T.n6 + 1.2, T.eur + 0.3, LYNX[0], LYNX[1], { startFrom: 4.0, zoom: [1.1, 1.0], sx: 560, sy: 470, maxR: 340 }),
  pv("atk/ap6_lince_liebre.mp4", T.roe - 0.2, T.menu + 0.5, LYNX[0], LYNX[1], { startFrom: 0.5, zoom: [1.06, 1.0] }),
  pv("ilu/ap6i_hikerlynx.mp4", T.hikers + 1.4, T.three - 0.1, 17, 56, { startFrom: 0.5, zoom: [1.0, 1.1] }),
];

const World: Chapter["World"] = ({ t }) => (
  <g>
    <Range id="snow" rings={RG.snowleo} from={SNOW} k={ramp(t, T.lives, 2.0)} op={win(t, T.lives, T.n7 + 1.2, 0.6)} />
    <Range id="chee" rings={RG.cheetah} from={CHEE} k={ramp(t, T.fastest - 0.6, 2.0)} op={win(t, T.fastest - 0.6, T.n6 + 1.0, 0.6)} />
    <Range id="lynx" rings={RG.lynx} from={LYNX} k={ramp(t, T.forests, 2.4)} op={win(t, T.forests, T.change + 1.4, 0.6)} />
  </g>
);

const Screen: Chapter["Screen"] = ({ c, f, t }) => (
  <>
    {/* #8 leopardo de las nieves */}
    <Cat c={c} f={f} t={t} src="snowleo" lon={SNOW[0]} lat={SNOW[1]} t0={T.n8 + 0.4} t1={T.n8 + 4.6} h={170} />
    <Tag c={c} f={f} t={t} lon={84} lat={27.2} t0={T.lives + 0.8} t1={T.jump} text="Himalaya" size={30} />
    <Tag c={c} f={f} t={t} lon={70} lat={42} t0={at("central asia", T.lives)} t1={T.jump} text="Central Asia" size={30} />
    <Num f={f} t={t} t0={T.feet - 0.3} t1={T.jump - 0.1} x={1500} y={190} value={16000} label="feet up · sometimes" size={84} />
    <Sticker f={f} t={t} t0={T.jump + 0.4} t1={T.tail} x={960} y={860} rot={-4} size={78}>30 FT · ONE LEAP</Sticker>
    <Sticker f={f} t={t} t0={at("like a scarf")} t1={T.least} x={1400} y={840} rot={4} bg={GOLD} size={66}><span style={{ color: "#111" }}>TAIL = SCARF</span></Sticker>
    <BigWord f={f} t={t} t0={at("the least dangerous")} t1={T.noconf + 0.2} text={<span>THE <span style={{ color: "#7ee08a" }}>LEAST DANGEROUS</span> BIG CAT</span>} y={180} size={86} />
    <Cat c={c} f={f} t={t} src="snowleo" lon={SNOW[0]} lat={SNOW[1]} t0={T.least + 0.3} t1={T.herders} h={230} />
    <Num f={f} t={t} t0={T.noconf + 0.4} t1={T.herders - 0.1} x={960} y={860} value={0} label="confirmed human kills · healthy wild snow leopard" size={110} />
    <Sticker f={f} t={t} t0={T.none} t1={T.herders - 0.1} x={1420} y={300} rot={6} bg={RED} size={96}>NONE.</Sticker>
    <Sticker f={f} t={t} t0={at("walking away")} t1={T.ghost} x={960} y={190} rot={-3} size={58}>IT WALKED AWAY FROM ITS OWN SHEEP</Sticker>
    <BigWord f={f} t={t} t0={T.ghostw} t1={T.sees - 0.1} text={<span>THE <span style={{ color: "#bfe6ff" }}>GHOST</span> OF THE MOUNTAINS</span>} y={190} size={96} />
    <Sticker f={f} t={t} t0={at("go their whole lives")} t1={T.sees} x={960} y={880} rot={3} size={58}>MOST LOCALS NEVER SEE ONE</Sticker>
    <Sticker f={f} t={t} t0={T.never} t1={T.n7 - 0.2} x={960} y={860} rot={-3} bg={GOLD} size={70}><span style={{ color: "#111" }}>YOU NEVER FIND OUT</span></Sticker>

    {/* #7 guepardo */}
    <Cat c={c} f={f} t={t} src="cheetah" lon={CHEE[0]} lat={CHEE[1]} t0={T.n7 + 0.6} t1={T.n7 + 4.2} h={150} />
    <Num f={f} t={t} t0={T.mph - 0.2} t1={T.nightmare + 0.2} x={1500} y={200} value={70} prefix="~" label="mph · short burst" size={110} />
    <Sticker f={f} t={t} t0={T.opp} t1={T.bike} x={960} y={860} rot={-3} bg={GOLD} size={78}><span style={{ color: "#111" }}>THE OPPOSITE</span></Sticker>
    <Sticker f={f} t={t} t0={T.bike + 0.4} t1={T.traded} x={960} y={170} rot={-2} size={66}>BUILT LIKE A RACING BICYCLE</Sticker>
    <Sticker f={f} t={t} t0={T.legs} t1={T.traded} x={430} y={760} rot={-5} bg={GOLD} size={48}><span style={{ color: "#111" }}>LONG LEGS</span></Sticker>
    <Sticker f={f} t={t} t0={T.head} t1={T.traded} x={1500} y={380} rot={4} bg={GOLD} size={48}><span style={{ color: "#111" }}>TINY HEAD</span></Sticker>
    <Sticker f={f} t={t} t0={T.skull} t1={T.traded} x={1530} y={520} rot={-3} bg={GOLD} size={48}><span style={{ color: "#111" }}>LIGHT SKULL</span></Sticker>
    <Sticker f={f} t={t} t0={T.teeth} t1={T.traded} x={1480} y={660} rot={3} bg={GOLD} size={48}><span style={{ color: "#111" }}>SMALL TEETH</span></Sticker>
    <BigWord f={f} t={t} t0={T.traded + 0.2} t1={T.lose} text={<span>ALL <span style={{ color: GOLD }}>SPEED</span>.</span>} y={170} size={120} />
    <BigWord f={f} t={t} t0={T.nothing} t1={T.lose} text={<span>NO <span style={{ color: RED }}>FIGHT</span>.</span>} y={320} size={120} />
    <Cat c={c} f={f} t={t} src="cheetah" lon={CHEE[0]} lat={CHEE[1]} t0={T.traded} t1={T.lose} h={200} />
    <Sticker f={f} t={t} t0={at("to hyenas")} t1={T.imagine} x={420} y={200} rot={-5} size={50}>HYENAS</Sticker>
    <Sticker f={f} t={t} t0={at("lions", T.lose)} t1={T.imagine} x={760} y={150} rot={3} size={50}>LIONS</Sticker>
    <Sticker f={f} t={t} t0={at("leopards", T.lose)} t1={T.imagine} x={1120} y={160} rot={-3} size={50}>LEOPARDS</Sticker>
    <Sticker f={f} t={t} t0={at("even vultures")} t1={T.imagine} x={1480} y={210} rot={5} bg={RED} size={50}>…VULTURES</Sticker>
    <Sticker f={f} t={t} t0={T.bird} t1={T.norec} x={960} y={880} rot={-3} bg={RED} size={68}>BULLIED BY A BIRD</Sticker>
    <Num f={f} t={t} t0={T.norec + 0.3} t1={T.royal} x={960} y={860} value={0} label="reliable records · wild cheetah kills an adult" size={110} />
    <Pin c={c} f={f} t={t} lon={53} lat={32} t0={at("and persia") - 0.3} t1={T.royal + 2.0} label="Persia" side="l" color={GOLD} />
    <Pin c={c} f={f} t={t} lon={77} lat={24} t0={at("india and persia") - 0.1} t1={T.royal + 2.0} label="India" color={GOLD} />
    <Sticker f={f} t={t} t0={T.leash} t1={T.try} x={960} y={190} rot={-3} size={62}>ON A LEASH · LIKE A DOG</Sticker>
    <Sticker f={f} t={t} t0={T.try + 0.3} t1={T.n6 - 0.2} x={960} y={860} rot={4} bg={RED} size={66}>DON'T TRY THIS WITH THE OTHERS</Sticker>

    {/* #6 lince */}
    <Cat c={c} f={f} t={t} src="lynx" lon={LYNX[0]} lat={LYNX[1]} t0={T.n6 + 0.4} t1={T.forests} h={150} />
    <Sticker f={f} t={t} t0={T.disap - 0.1} t1={T.eur} x={1300} y={720} rot={4} size={54}>PERMANENTLY DISAPPOINTED</Sticker>
    <Sticker f={f} t={t} t0={T.dog} t1={T.forests} x={1300} y={300} rot={-4} bg={GOLD} size={66}><span style={{ color: "#111" }}>≈ A LARGE DOG</span></Sticker>
    <Tag c={c} f={f} t={t} lon={14} lat={51} t0={at("of europe") } t1={T.roe} text="Europe" size={32} />
    <Tag c={c} f={f} t={t} lon={98} lat={62} t0={T.siberia} t1={T.roe} text="Siberia" size={32} />
    <Tag c={c} f={f} t={t} lon={68} lat={44} t0={T.casia} t1={T.roe} text="Central Asia" size={32} />
    <Sticker f={f} t={t} t0={T.towns} t1={T.roe} x={960} y={860} rot={-3} size={54}>SOMETIMES MILES FROM TOWNS</Sticker>
    <Sticker f={f} t={t} t0={at("by ambush")} t1={T.menu} x={960} y={190} rot={-3} size={62}>AMBUSH · A FEW YARDS</Sticker>
    <Sticker f={f} t={t} t0={T.menu + 0.4} t1={T.nofatal} x={960} y={860} rot={3} bg={RED} size={64}>HUMANS: NOT ON THE MENU</Sticker>
    <Num f={f} t={t} t0={T.nofatal + 0.2} t1={T.hikers + 1.2} x={960} y={860} value={0} label="known fatal attacks · wild lynx" size={110} />
    <Pin c={c} f={f} t={t} lon={8.2} lat={46.8} t0={at("switzerland") - 0.1} t1={T.hikers + 1.6} label="Switzerland" side="l" color={GOLD} />
    <Pin c={c} f={f} t={t} lon={26} lat={63} t0={T.finland - 0.1} t1={T.hikers + 1.6} label="Finland" color={GOLD} />
    <Sticker f={f} t={t} t0={T.boring} t1={T.three - 0.2} x={960} y={190} rot={-3} size={64}>"YOU ARE BORING."</Sticker>
    <Sticker f={f} t={t} t0={T.compl} t1={T.three - 0.2} x={960} y={860} rot={3} bg={GOLD} size={58}><span style={{ color: "#111" }}>(FOR ONCE, A COMPLIMENT)</span></Sticker>
    {/* los tres inofensivos */}
    <BigWord f={f} t={t} t0={T.three} t1={T.change + 0.2} text={<span>THE <span style={{ color: "#7ee08a" }}>HARMLESS</span> THREE</span>} y={200} size={110} />
    <BigWord f={f} t={t} t0={T.change} t1={T.change + 1.5} text={<span>NOW IT <span style={{ color: ORANGE }}>CHANGES</span></span>} y={340} size={90} />
  </>
);

export const ch03: Chapter = {
  T0: at("let's start at the bottom"), T1: CH03_T1,
  keys: [
    [T.n8 + 0.9, 84, 33, 52], [T.feet, 86, 32, 40], [T.least + 0.3, 84, 33, 44], [T.sees, 85, 33, 40],
    [T.n7 + 1.0, 26, -6, 64], [T.traded, 25, -8, 54], [T.norec + 0.5, 26, -4, 70],
    [T.royal + 1.2, 64, 28, 58], [T.try + 0.5, 64, 28, 56],
    [T.n6 + 1.0, 40, 57, 70], [T.forests + 0.4, 70, 54, 130], [T.roe, 40, 57, 70], [T.hikers + 0.3, 17, 56, 42], [T.three + 0.4, 60, 30, 260],
  ],
  World,
  Screen,
  portals,
  sfx: [
    [T.n8 - 0.4, "lib/whoosh_glass_2.mp3", 0.45, 1.3], [T.n8 + 0.4, "lib/pop_soft_4.mp3", 0.45, 0.5], [T.lives, "lib/shimmer_2.mp3", 0.3, 1.5], [T.feet - 0.3, "lib/count_tick_2.mp3", 0.3, 1.2],
    [T.jump, "lib/swish_3.mp3", 0.35, 0.6], [T.noconf + 0.4, "lib/tap_4.mp3", 0.4, 0.4], [T.none, "lib/impact_soft_4.mp3", 0.45, 0.8], [T.herders - 0.2, "lib/whoosh_soft_5.mp3", 0.4, 1.0],
    [T.ghostw, "lib/shimmer_4.mp3", 0.35, 1.8], [T.never, "lib/tap_5.mp3", 0.35, 0.4],
    [T.n7 - 0.5, "lib/whoosh_glass_3.mp3", 0.45, 1.3], [T.n7 + 0.6, "lib/pop_soft_5.mp3", 0.45, 0.5], [T.mph - 0.2, "lib/count_tick_3.mp3", 0.3, 1.0],
    [T.legs, "lib/tap_1.mp3", 0.35, 0.4], [T.head, "lib/tap_2.mp3", 0.35, 0.4], [T.skull, "lib/tap_3.mp3", 0.35, 0.4], [T.teeth, "lib/tap_4.mp3", 0.35, 0.4],
    [T.traded + 0.2, "lib/impact_soft_2.mp3", 0.4, 0.8], [T.bird, "lib/pop_soft_6.mp3", 0.4, 0.5], [T.royal + 0.2, "lib/whoosh_soft_6.mp3", 0.45, 1.3],
    [T.n6 - 0.5, "lib/whoosh_glass_1.mp3", 0.45, 1.3], [T.n6 + 0.4, "lib/pop_soft_7.mp3", 0.45, 0.5], [T.forests, "lib/shimmer_5.mp3", 0.3, 1.5], [T.nofatal + 0.2, "lib/tap_6.mp3", 0.4, 0.4],
    [T.hikers, "lib/whoosh_soft_7.mp3", 0.4, 1.0], [T.three, "lib/success_2.mp3", 0.35, 1.0], [T.change, "lib/riser_soft_2.mp3", 0.4, 1.6],
  ],
};

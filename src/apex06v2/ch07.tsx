// Capítulo 7 — #1 tigre: se revela en el ranking → 500 lb, ataca por detrás → Champawat (Nepal, el ejército la empuja a la
// India, Corbett 1907, 436, dientes rotos) → Sundarbans (manglar, pescadores y mieleros, viudas del tigre) → máscaras en la nuca.
import React from "react";
import { Chapter, at, Sticker, BigWord, Num, Pin, Tag, Cat, Range, Country, Trail, Dots, pv, PortalSpec, ramp, win, fadeOut, WD, RED, GOLD, ORANGE } from "./lib";
import { RG } from "./ranges";

const T = {
  n1: at("number one the tiger"), biggest: at("the biggest cat alive"), n500: at("over 500 pounds"), alone: at("it hunts alone"), cover: at("it hunts from cover"), behind: at("attacks from behind"),
  fight: at("it does not want to fight"), coming: at("never see it coming"), start: at("at the start of the 20th"), nepal: at("in the hills of nepal"), tigress: at("a tigress began"),
  hunters: at("villagers sent for hunters"), army: at("the nepalese army"), didnot: at("they did not kill her"), chased: at("they chased her"), border: at("across the border"),
  kept: at("she simply kept hunting"), known: at("she became known as"), champ: at("the champawat tiger"), y1907: at("in 1907"), n436: at("436 deaths"), highest: at("that is the highest number"),
  examined: at("when corbett examined"), teeth: at("her teeth were broken"), gunshot: at("old gunshot wound"), switched: at("had switched to something"),
  most: at("but the most dangerous tiger story"), forest: at("it is about a whole forest"), sund: at("the sunderbans is the largest"), coast: at("india and bangladesh"), maze: at("it is a maze"),
  spikes: at("like spikes"), live: at("tigers live there"), people: at("so do people"), fisher: at("fishermen", at("so do people")), crab: at("crab catchers"), honey: at("collect wild honey"),
  decades: at("for decades tigers"), dozens: at("dozens of people every year"), higher: at("some estimates go"), widows: at("there are villages there"), widow2: at("the tiger widows"),
  wait: at("the tigers here do not wait"), walk: at("where people walk in"), heads: at("with their heads down"), deer: at("a very convenient deer"),
  y1980: at("in the 1980s"), masks: at("started wearing face masks"), backhead: at("on the back of their heads"), idea: at("the idea was simple"), looking: at("you are always looking"),
  moment: at("the moment it needs"), reports: at("according to reports"), left: at("were left alone"), killed: at("without them were killed"), last: at("it did not last"),
  smart: at("tigers are smart"), figure: at("figure it out"), beaten: at("was beaten by a cheap"), wrong: at("the wrong way round"),
};
export const CH07_T1 = at("so what should you actually do") + 0.6;
const TIG: [number, number] = [80, 23], NEP: [number, number] = [80.6, 29.3], CHAMP: [number, number] = [80.07, 29.33], SUND: [number, number] = [89.2, 21.9];

const portals: PortalSpec[] = [
  pv("real/tiger_7492891.mp4", T.n1 + 5.0, T.alone - 0.1, TIG[0], TIG[1], { startFrom: 1.0, zoom: [1.12, 1.0] }),
  pv("atk/ap6_tigre_acecho.mp4", T.cover - 0.3, T.fight + 0.3, TIG[0], TIG[1], { startFrom: 0, zoom: [1.04, 1.0] }),
  pv("real/tiger_7722973.mp4", T.fight, T.start + 0.3, TIG[0], TIG[1], { startFrom: 1.0, zoom: [1.14, 1.04] }),
  pv("ilu/ap6i_hunters_a.mp4", T.hunters - 0.2, T.didnot + 0.3, NEP[0], NEP[1], { startFrom: 0.5, zoom: [1.0, 1.08] }),
  pv("foto/Jim_Corbett_c_1907.jpg", T.y1907 - 0.8, T.highest + 0.3, CHAMP[0], CHAMP[1], { maxR: 300, dx: -560, dy: -20, zoom: [1.1, 1.0], credit: "Wikimedia Commons", label: "Jim Corbett" }),
  pv("foto/Head_of_the_Champawat_Tiger.jpg", T.examined - 0.2, T.switched + 0.6, CHAMP[0], CHAMP[1], { maxR: 300, dx: 560, dy: -20, zoom: [1.15, 1.05], credit: "Wikimedia Commons" }),
  pv("real/mangrove_3301296.mp4", T.maze - 0.3, T.live + 0.3, SUND[0], SUND[1], { startFrom: 1.0, zoom: [1.0, 1.1] }),
  pv("atk/ap6_tigre_nada.mp4", T.live - 0.1, T.people + 0.5, SUND[0], SUND[1], { startFrom: 1.0, zoom: [1.04, 1.0] }),
  pv("real/fisher_7651219.mp4", T.people + 0.2, T.crab + 0.4, SUND[0], SUND[1], { startFrom: 2.0, zoom: [1.06, 1.0] }),
  pv("ilu/ap6i_honey_a.mp4", T.crab + 0.1, T.decades + 0.3, SUND[0], SUND[1], { startFrom: 0, zoom: [1.0, 1.08] }),
  pv("atk/ap6_tigre_bote.mp4", T.decades, T.widows + 0.3, SUND[0], SUND[1], { startFrom: 1.0, zoom: [1.04, 1.0] }),
  pv("ilu/ap6i_honey_b.mp4", T.wait - 0.2, T.y1980 + 0.3, SUND[0], SUND[1], { startFrom: 0, zoom: [1.0, 1.1] }),
  pv("ilu/ap6i_mask_a.mp4", T.masks - 0.4, T.reports + 0.3, SUND[0], SUND[1], { startFrom: 0, zoom: [1.0, 1.08] }),
  pv("ilu/ap6i_mask_b.mp4", T.reports, T.smart + 0.3, SUND[0], SUND[1], { startFrom: 0, zoom: [1.0, 1.08] }),
  pv("real/tiger_39005168.mp4", T.smart, T.beaten + 0.2, SUND[0], SUND[1], { startFrom: 0, zoom: [1.0, 1.1] }),
];

const World: Chapter["World"] = ({ t, z }) => (
  <g>
    <Range id="tig" rings={RG.tiger} from={TIG} k={ramp(t, T.biggest, 2.4)} op={win(t, T.biggest, T.start + 0.6, 0.6)} />
    <Country name="Nepal" z={z} op={win(t, T.nepal - 0.3, T.champ + 0.6, 0.5)} fill="#ffd23a" />
    <Country name="India" z={z} op={win(t, T.border - 0.2, T.champ + 0.6, 0.5) * 0.5} />
    {/* la persecución: el ejército la empuja de Nepal a la India */}
    <Trail pts={[[81.6, 29.0], [81.0, 29.2], [80.5, 29.25], [80.2, 29.3], [CHAMP[0], CHAMP[1]]]} k={ramp(t, T.chased - 0.1, 1.6)} z={z} color={RED} w={7} op={win(t, T.chased - 0.2, T.highest, 0.4)} />
    <Country name="Bangladesh" z={z} op={win(t, T.coast - 0.3, T.maze + 0.4, 0.5) * 0.45} />
    <Country name="India" z={z} op={win(t, T.coast - 0.3, T.maze + 0.4, 0.5) * 0.3} />
  </g>
);

const Screen: Chapter["Screen"] = ({ c, f, t }) => (
  <>
    <BigWord f={f} t={t} t0={T.n1 + 0.2} t1={T.n1 + 4.8} text={<span>#1 · THE <span style={{ color: RED }}>TIGER</span></span>} y={200} size={130} />
    <Cat c={c} f={f} t={t} src="tiger" lon={TIG[0]} lat={TIG[1]} t0={T.n1 + 0.6} t1={T.n1 + 5.2} h={190} />
    <Num f={f} t={t} t0={T.n500 - 0.2} t1={T.alone - 0.1} x={1520} y={520} value={500} prefix="> " label="pounds · large male Bengal" size={100} />
    <Sticker f={f} t={t} t0={T.alone} t1={T.fight} x={520} y={200} rot={-5} size={54}>ALONE</Sticker>
    <Sticker f={f} t={t} t0={T.cover} t1={T.fight} x={960} y={160} rot={3} size={54}>FROM COVER</Sticker>
    <Sticker f={f} t={t} t0={T.behind} t1={T.fight} x={1400} y={200} rot={-3} bg={RED} size={54}>FROM BEHIND</Sticker>
    <BigWord f={f} t={t} t0={T.coming - 0.3} t1={T.start} text={<span>YOU NEVER SEE IT <span style={{ color: RED }}>COMING</span></span>} y={200} size={96} />
    {/* Champawat */}
    <Tag c={c} f={f} t={t} lon={83.6} lat={28.1} t0={T.nepal} t1={T.chased} text="Nepal · early 1900s" size={30} />
    <Dots c={c} f={f} t={t} pts={WD.dots.nepal} k={Math.min(1, Math.max(0, (t - T.tigress) / 4))} op={fadeOut(t, T.border + 0.6, 0.6)} />
    <Sticker f={f} t={t} t0={T.army + 0.4} t1={T.didnot + 0.2} x={1440} y={860} rot={4} bg={RED} size={58}>THE NEPALESE ARMY</Sticker>
    <Sticker f={f} t={t} t0={T.didnot} t1={T.chased} x={960} y={860} rot={-3} bg={GOLD} size={66}><span style={{ color: "#111" }}>…THEY MISSED</span></Sticker>
    <Tag c={c} f={f} t={t} lon={78.8} lat={28.3} t0={T.border} t1={T.champ + 0.6} text="India" size={30} />
    <Sticker f={f} t={t} t0={T.kept} t1={T.known} x={960} y={190} rot={-3} bg={RED} size={58}>SHE KEPT HUNTING</Sticker>
    <Dots c={c} f={f} t={t} pts={WD.dots.champawat} k={Math.min(1, Math.max(0, (t - T.y1907) / 2.8))} op={fadeOut(t, T.most, 0.6)} />
    <Pin c={c} f={f} t={t} lon={CHAMP[0]} lat={CHAMP[1]} t0={T.champ - 0.2} t1={T.most} label="Champawat" side="t" color={RED} />
    <Num f={f} t={t} t0={T.n436 - 0.4} t1={T.examined} x={1500} y={860} value={436} label="deaths · one tigress · 1907" size={110} color="#ff5a3a" prog={Math.min(1, Math.max(0, (t - T.y1907) / 2.8))} />
    <Sticker f={f} t={t} t0={T.highest + 0.3} t1={T.examined} x={960} y={190} rot={-3} bg={GOLD} size={60}><span style={{ color: "#111" }}>HIGHEST EVER · ONE ANIMAL</span></Sticker>
    <Sticker f={f} t={t} t0={T.teeth} t1={T.switched} x={960} y={860} rot={3} bg={RED} size={58}>BROKEN TEETH · OLD GUNSHOT</Sticker>
    <Sticker f={f} t={t} t0={T.switched + 0.3} t1={T.most} x={960} y={190} rot={-3} size={56}>→ SOMETHING EASIER</Sticker>
    {/* Sundarbans */}
    <BigWord f={f} t={t} t0={T.forest} t1={T.sund + 0.6} text={<span>A WHOLE <span style={{ color: "#5fd18a" }}>FOREST</span></span>} y={200} size={110} />
    <Pin c={c} f={f} t={t} lon={SUND[0]} lat={SUND[1]} t0={T.sund} t1={T.maze} label="Sundarbans" color={RED} />
    <Tag c={c} f={f} t={t} lon={90.6} lat={23.8} t0={at("and bangladesh")} t1={T.maze} text="Bangladesh" size={28} />
    <Tag c={c} f={f} t={t} lon={87.6} lat={23.2} t0={T.coast} t1={T.maze} text="India" size={28} />
    <Sticker f={f} t={t} t0={T.sund + 0.5} t1={T.maze} x={960} y={860} rot={-2} bg={GOLD} size={56}><span style={{ color: "#111" }}>LARGEST MANGROVE FOREST ON EARTH</span></Sticker>
    <Sticker f={f} t={t} t0={T.spikes - 0.3} t1={T.live} x={960} y={190} rot={3} size={54}>MUD · CHANNELS · ROOTS LIKE SPIKES</Sticker>
    <Sticker f={f} t={t} t0={T.fisher} t1={T.decades} x={520} y={200} rot={-5} size={50}>FISHERMEN</Sticker>
    <Sticker f={f} t={t} t0={T.crab} t1={T.decades} x={960} y={160} rot={3} size={50}>CRAB CATCHERS</Sticker>
    <Sticker f={f} t={t} t0={T.honey} t1={T.decades} x={1400} y={200} rot={-3} bg={GOLD} size={50}><span style={{ color: "#111" }}>HONEY COLLECTORS</span></Sticker>
    <Sticker f={f} t={t} t0={T.dozens - 0.2} t1={T.widows} x={960} y={860} rot={-3} bg={RED} size={66}>DOZENS KILLED · EVERY YEAR</Sticker>
    <BigWord f={f} t={t} t0={T.widow2} t1={T.wait} text={<span>"THE <span style={{ color: RED }}>TIGER WIDOWS</span>"</span>} y={540} size={110} />
    <Sticker f={f} t={t} t0={T.heads - 0.2} t1={T.y1980} x={960} y={860} rot={3} size={56}>QUIET · ALONE · HEADS DOWN</Sticker>
    <Sticker f={f} t={t} t0={T.deer} t1={T.y1980} x={960} y={190} rot={-3} bg={RED} size={58}>= A VERY CONVENIENT DEER</Sticker>
    <Sticker f={f} t={t} t0={T.y1980 + 0.2} t1={T.masks} x={960} y={190} rot={-3} bg={GOLD} size={66}><span style={{ color: "#111" }}>1980s</span></Sticker>
    <Sticker f={f} t={t} t0={T.backhead} t1={T.reports} x={960} y={860} rot={3} bg={GOLD} size={60}><span style={{ color: "#111" }}>A FACE ON THE BACK OF THE HEAD</span></Sticker>
    <Sticker f={f} t={t} t0={T.left - 0.2} t1={T.last} x={560} y={200} rot={-4} bg={"#2f9e57"} size={56}>MASK: LEFT ALONE</Sticker>
    <Sticker f={f} t={t} t0={T.killed} t1={T.last} x={1360} y={200} rot={4} bg={RED} size={56}>NO MASK: KILLED</Sticker>
    <Sticker f={f} t={t} t0={T.figure - 0.3} t1={T.beaten} x={960} y={860} rot={-3} size={58}>…SOME FIGURED IT OUT</Sticker>
    <BigWord f={f} t={t} t0={T.beaten} t1={at("so what should you actually do")} text={<span>BEATEN BY A <span style={{ color: GOLD }}>CHEAP MASK</span></span>} y={200} size={100} />
  </>
);

export const ch07: Chapter = {
  T0: at("in a different league"), T1: CH07_T1,
  keys: [
    [T.n1 + 1.2, 82, 23, 60], [T.n500, 82, 22, 56], [T.start + 0.6, 81.2, 28.8, 16], [T.army, 81, 29, 14], [T.border + 0.8, 80.4, 29.2, 13], [T.champ, CHAMP[0], CHAMP[1], 14],
    [T.switched, CHAMP[0], CHAMP[1], 15], [T.forest, 85, 25, 40], [T.sund + 0.8, 89.4, 22.4, 14], [T.maze, SUND[0], SUND[1], 10], [T.widow2, SUND[0], SUND[1], 9], [T.beaten, 89, 22.5, 12],
  ],
  World,
  Screen,
  portals,
  sfx: [
    [T.n1 - 0.6, "lib/riser_soft_6.mp3", 0.45, 1.0], [T.n1 + 0.2, "deep-cinematic-impact-2.mp3", 0.6, 2.2],
    [T.n500 - 0.2, "lib/count_tick_2.mp3", 0.3, 1.0], [T.alone, "lib/tap_1.mp3", 0.35, 0.4], [T.cover, "lib/tap_2.mp3", 0.35, 0.4], [T.behind, "lib/tap_3.mp3", 0.35, 0.4],
    [T.start + 0.2, "lib/whoosh_soft_5.mp3", 0.45, 1.3], [T.chased - 0.1, "line_draw.mp3", 0.4, 1.6], [T.champ - 0.2, "pin_plop.mp3", 0.4, 0.5],
    [T.y1907 - 0.8, "universfield-camera-shutter-199580.mp3", 0.35, 0.6], [T.n436 - 0.4, "lib/count_tick_4.mp3", 0.3, 2.8], [T.examined - 0.2, "universfield-camera-shutter-199580.mp3", 0.3, 0.6],
    [T.forest, "lib/impact_soft_1.mp3", 0.4, 0.8], [T.sund - 0.2, "lib/whoosh_soft_7.mp3", 0.45, 1.3], [T.dozens - 0.2, "lib/impact_soft_5.mp3", 0.4, 0.8],
    [T.widow2, "deep-cinematic-impact-1.mp3", 0.5, 2.0], [T.y1980 + 0.2, "lib/page_flip_2.mp3", 0.4, 0.6], [T.left - 0.2, "lib/success_3.mp3", 0.3, 0.8], [T.killed, "lib/glitch_soft_4.mp3", 0.35, 0.6],
  ],
};

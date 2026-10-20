// Capítulo 6 — #2 león: rey que no vive en la jungla, en grupo → Tsavo 1898 (ferrocarril, 9 meses, Patterson 135 → 35 por el
// estudio de 2009, dientes rotos) → Tanzania hoy (560 entre 1990 y 2004, cosecha, chanchos salvajes, la luna) → segundo puesto.
import React from "react";
import { Chapter, at, Sticker, BigWord, Num, Pin, Tag, Cat, Range, Country, Trail, Dots, Swap, pv, PortalSpec, ramp, win, fadeOut, WD, RED, GOLD, ORANGE } from "./lib";
import { RG } from "./ranges";

const T = {
  n2: at("number 2"), king: at("the king of the jungle"), jungle: at("does not actually live"), expects: at("expects to be number one"), big: at("it is big it is loud"), groups: at("lives in groups"),
  alone: at("any cat that hunts alone"), y1898: at("in 1898"), kenya: at("across kenya"), savo: at("a river called savo"), bridge: at("they needed a bridge"), nine: at("and for nine months"),
  camp: at("the work camp"), night: at("they came at night"), tents: at("out of their tents"), fences: at("the men built thorn"), fires: at("lit fires"), watch: at("and kept watch"),
  anyway: at("the lions came anyway"), eng: at("the engineer in charge"), shot: at("finally shot both"), claimed: at("he later claimed"), n135: at("135 people"), century: at("for a century"),
  y2009: at("then in 2009"), bones: at("the lion's bones"), record: at("which record what"), estimate: at("their estimate was"), n35: at("about 35 people"), nightmare: at("still a nightmare"),
  unusual: at("the savo lions were also"), teeth: at("both had bad teeth"), canine: at("a broken canine"), buffalo: at("cannot easily kill a buffalo"), softer: at("something softer"),
  human: at("than a human"), real: at("but the real story of lions"), now: at("it is happening right now"), tz: at("researchers in tanzania"), n560: at("more than 560"),
  y1990: at("between 1990 and 2004"), single: at("560 in a single"), pattern: at("the study found"), harvest: at("during harvest season"), farmers: at("farmers sleep out"),
  pigs: at("from bush pigs"), cometo: at("the bush pigs come"), farmer: at("find the farmer"), creepier: at("found something even creepier"), moon: at("right after the full moon"),
  late: at("when the moon rises late"), black: at("pitch black"), home: at("when people walk home"), angry: at("the lion is not angry"), hungry: at("it is just hungry"),
  outlate: at("you are out late"), hundreds: at("so the lion has killed"), second: at("it still only gets second"), league: at("because the cat at number one"),
};
export const CH06_T1 = at("number one the tiger") + 0.5;
const LIONP: [number, number] = [30, 0], TSAVO: [number, number] = [38.47, -2.98], TZ: [number, number] = [35, -6.5];

const portals: PortalSpec[] = [
  pv("real/lion_8476160.mp4", T.n2 + 4.4, T.groups - 0.2, LIONP[0], LIONP[1], { startFrom: 1.0, zoom: [1.12, 1.0] }),
  pv("real/lion_8353917.mp4", T.groups - 0.5, T.y1898 + 0.2, LIONP[0], LIONP[1], { startFrom: 1.0, zoom: [1.06, 1.0] }),
  pv("ilu/ap6i_tsavo_a.mp4", T.nine - 0.2, T.fences + 0.3, TSAVO[0], TSAVO[1], { startFrom: 0, zoom: [1.0, 1.1] }),
  pv("atk/ap6_leon_boma.mp4", T.fences, T.anyway + 0.3, TSAVO[0], TSAVO[1], { startFrom: 0.5, zoom: [1.06, 1.0] }),
  pv("ilu/ap6i_tsavo_b.mp4", T.watch - 0.3, T.eng + 0.3, TSAVO[0], TSAVO[1], { startFrom: 1.0, zoom: [1.0, 1.08] }),
  pv("foto/Colonel_Patterson_with_Tsavo_Lion.jpg", T.eng, T.century + 0.4, TSAVO[0], TSAVO[1], { zoom: [1.12, 1.0], pan: [-40, 0], credit: "J. H. Patterson · Wikimedia Commons", label: "J. H. Patterson · 1898" }),
  pv("foto/Man_Eaters_of_Tsavo_Field_Museum.jpg", T.y2009 - 0.2, T.unusual + 0.3, TSAVO[0], TSAVO[1], { zoom: [1.04, 1.16], credit: "Field Museum · Wikimedia Commons" }),
  pv("foto/Man_Eaters_of_Tsavo_Skulls.jpg", T.unusual, T.buffalo + 0.3, TSAVO[0], TSAVO[1], { zoom: [1.06, 1.2], pan: [0, -20], credit: "Field Museum · Wikimedia Commons" }),
  pv("atk/ap6_leones_bufalo.mp4", T.buffalo, T.real + 0.3, TSAVO[0], TSAVO[1], { startFrom: 0, zoom: [1.04, 1.0] }),
  pv("ilu/ap6i_field_a.mp4", T.farmers - 0.2, T.cometo + 0.3, TZ[0], TZ[1], { startFrom: 0, zoom: [1.0, 1.08] }),
  pv("ilu/ap6i_field_b.mp4", T.cometo, T.creepier + 0.3, TZ[0], TZ[1], { startFrom: 0.5, zoom: [1.0, 1.08] }),
  pv("ilu/ap6i_moon_b.mp4", T.moon - 0.3, T.black + 0.3, TZ[0], TZ[1], { startFrom: 0, zoom: [1.0, 1.08] }),
  pv("ilu/ap6i_moon_a.mp4", T.black, T.angry + 0.3, TZ[0], TZ[1], { startFrom: 0.5, zoom: [1.0, 1.1] }),
  pv("atk/ap6_leones_aldea.mp4", T.angry, T.hundreds + 0.3, TZ[0], TZ[1], { startFrom: 0.5, zoom: [1.06, 1.0] }),
];

const World: Chapter["World"] = ({ t, z }) => (
  <g>
    <Range id="lion" rings={RG.lion} from={LIONP} k={ramp(t, T.king, 2.6)} op={win(t, T.king, T.y1898 + 0.6, 0.6)} />
    <Country name="Kenya" z={z} op={win(t, T.kenya - 0.3, T.nine + 0.2, 0.5) * 0.55 + win(t, T.century, T.real, 0.5) * 0.3} />
    {/* el ferrocarril de Uganda: Mombasa → Tsavo → Nairobi */}
    <Trail pts={[[39.66, -4.05], [39.2, -3.6], [38.47, -2.98], [37.7, -2.4], [37.2, -1.9], [36.82, -1.29]]} k={ramp(t, T.y1898 + 0.3, 1.6)} z={z} color="#fff" w={6} dash op={win(t, T.y1898, T.real, 0.5)} />
    <Country name="United Republic of Tanzania" z={z} op={win(t, T.tz - 0.3, T.hundreds, 0.5) * 0.55} />
  </g>
);

const Screen: Chapter["Screen"] = ({ c, f, t }) => (
  <>
    <Cat c={c} f={f} t={t} src="lion" lon={LIONP[0]} lat={LIONP[1]} t0={T.n2 + 0.4} t1={T.n2 + 4.6} h={150} />
    <Sticker f={f} t={t} t0={T.jungle} t1={T.expects} x={960} y={190} rot={-3} size={56}>(IT DOESN'T LIVE IN THE JUNGLE)</Sticker>
    <Sticker f={f} t={t} t0={T.expects + 0.2} t1={T.big} x={960} y={860} rot={3} bg={GOLD} size={60}><span style={{ color: "#111" }}>EVERYONE'S #1 PICK</span></Sticker>
    <Sticker f={f} t={t} t0={T.groups} t1={T.y1898} x={960} y={860} rot={-3} bg={RED} size={64}>IT HUNTS IN GROUPS</Sticker>
    {/* Tsavo */}
    <Tag c={c} f={f} t={t} lon={37.6} lat={0.6} t0={T.kenya} t1={T.nine} text="Kenya · 1898" size={30} />
    <Pin c={c} f={f} t={t} lon={TSAVO[0]} lat={TSAVO[1]} t0={T.savo - 0.1} t1={T.nine + 0.4} label="Tsavo" color={RED} />
    <Sticker f={f} t={t} t0={T.bridge} t1={T.nine} x={1480} y={860} rot={4} size={52}>A RAILWAY BRIDGE</Sticker>
    <Sticker f={f} t={t} t0={T.nine + 0.3} t1={T.night} x={960} y={190} rot={-3} bg={RED} size={66}>9 MONTHS</Sticker>
    <Sticker f={f} t={t} t0={T.tents} t1={T.fences} x={960} y={860} rot={3} bg={RED} size={58}>PULLED OUT OF THEIR TENTS</Sticker>
    <Sticker f={f} t={t} t0={T.fences + 0.3} t1={T.anyway} x={520} y={200} rot={-5} size={50}>THORN FENCES</Sticker>
    <Sticker f={f} t={t} t0={T.fires} t1={T.anyway} x={960} y={160} rot={3} size={50}>FIRES</Sticker>
    <Sticker f={f} t={t} t0={T.watch} t1={T.anyway} x={1400} y={200} rot={-3} size={50}>WATCHMEN</Sticker>
    <BigWord f={f} t={t} t0={T.anyway} t1={T.eng} text={<span>THEY CAME <span style={{ color: RED }}>ANYWAY</span></span>} y={540} size={110} />
    <Swap f={f} t={t} t0={T.n135 - 0.3} tx={T.n35 - 0.2} t1={T.unusual} x={1460} y={860} a="135" b="35" label="Tsavo victims · claimed → measured" size={100} />
    <Sticker f={f} t={t} t0={T.y2009 + 0.3} t1={T.estimate} x={960} y={190} rot={-3} size={56}>2009 · CHEMISTRY OF BONES & HAIR</Sticker>
    <Sticker f={f} t={t} t0={T.nightmare} t1={T.unusual} x={700} y={190} rot={-3} bg={RED} size={52}>STILL A NIGHTMARE</Sticker>
    <Sticker f={f} t={t} t0={T.teeth} t1={T.buffalo} x={560} y={860} rot={-4} bg={RED} size={58}>BAD TEETH</Sticker>
    <Sticker f={f} t={t} t0={T.canine} t1={T.buffalo} x={1340} y={860} rot={4} bg={RED} size={58}>BROKEN CANINE</Sticker>
    <Sticker f={f} t={t} t0={T.human - 0.4} t1={T.real} x={960} y={860} rot={-3} bg={RED} size={64}>NOTHING SOFTER · NOTHING SLOWER</Sticker>
    <BigWord f={f} t={t} t0={T.now} t1={T.tz + 0.4} text={<span>IT'S HAPPENING <span style={{ color: RED }}>NOW</span></span>} y={200} size={110} />
    {/* Tanzania */}
    <Tag c={c} f={f} t={t} lon={34.5} lat={-3} t0={T.tz} t1={T.harvest} text="Tanzania" size={32} />
    <Dots c={c} f={f} t={t} pts={WD.dots.tanzania} k={Math.min(1, Math.max(0, (t - T.n560 + 0.2) / 3.2))} op={fadeOut(t, T.farmers, 0.6)} />
    <Num f={f} t={t} t0={T.n560 - 0.3} t1={T.farmers - 0.1} x={1500} y={860} value={560} prefix="" label="killed by lions · 1990–2004" size={110} color="#ff5a3a" prog={Math.min(1, Math.max(0, (t - T.n560 + 0.2) / 3.2))} />
    <Sticker f={f} t={t} t0={T.single} t1={T.harvest - 0.1} x={960} y={190} rot={-3} bg={RED} size={56}>ONE COUNTRY · MODERN TIMES</Sticker>
    <Sticker f={f} t={t} t0={T.harvest} t1={T.farmers + 1.0} x={960} y={190} rot={3} bg={GOLD} size={60}><span style={{ color: "#111" }}>HARVEST SEASON</span></Sticker>
    <Sticker f={f} t={t} t0={T.farmer - 0.2} t1={T.creepier} x={960} y={860} rot={-3} bg={RED} size={58}>…AND FIND THE FARMER</Sticker>
    <Sticker f={f} t={t} t0={T.moon} t1={T.black} x={960} y={190} rot={-3} size={58}>THE DARK NIGHTS AFTER THE FULL MOON</Sticker>
    <Sticker f={f} t={t} t0={T.home - 0.2} t1={T.angry} x={960} y={860} rot={3} bg={RED} size={58}>PITCH BLACK · WALKING HOME</Sticker>
    <Sticker f={f} t={t} t0={T.hungry} t1={T.hundreds} x={960} y={190} rot={-3} size={60}>NOT ANGRY. HUNGRY.</Sticker>
    <BigWord f={f} t={t} t0={T.second} t1={T.league - 0.1} text={<span>…AND STILL ONLY <span style={{ color: GOLD }}>#2</span></span>} y={200} size={110} />
    <BigWord f={f} t={t} t0={T.league} t1={at("number one the tiger") - 0.1} text={<span>#1 IS IN A <span style={{ color: RED }}>DIFFERENT LEAGUE</span></span>} y={200} size={90} />
  </>
);

export const ch06: Chapter = {
  T0: at("it did not forget"), T1: CH06_T1,
  keys: [
    [T.n2 + 1.2, 28, 0, 80], [T.groups, 30, 0, 76], [T.kenya + 0.4, 38, -2, 16], [T.savo + 0.4, TSAVO[0], TSAVO[1], 12], [T.anyway, TSAVO[0], TSAVO[1], 11],
    [T.y2009, 38, -2.6, 14], [T.human, 38, -2.6, 16], [T.tz + 0.6, 35, -6.3, 20], [T.harvest, 35, -6.3, 17], [T.hundreds + 0.4, 34, -2, 70], [T.league + 0.6, 50, 8, 120],
  ],
  World,
  Screen,
  portals,
  sfx: [
    [T.n2 - 0.5, "lib/whoosh_glass_2.mp3", 0.45, 1.3], [T.n2 + 0.4, "lib/pop_soft_4.mp3", 0.45, 0.5], [T.king, "lib/shimmer_7.mp3", 0.3, 1.8],
    [T.y1898 + 0.2, "line_draw.mp3", 0.4, 1.6], [T.savo - 0.1, "pin_plop.mp3", 0.4, 0.5], [T.nine + 0.3, "lib/impact_soft_7.mp3", 0.4, 0.8],
    [T.fences + 0.3, "lib/tap_1.mp3", 0.35, 0.4], [T.fires, "lib/tap_2.mp3", 0.35, 0.4], [T.watch, "lib/tap_3.mp3", 0.35, 0.4], [T.anyway, "lib/impact_soft_8.mp3", 0.45, 0.9],
    [T.eng, "universfield-camera-shutter-199580.mp3", 0.35, 0.6], [T.n135 - 0.3, "lib/count_tick_1.mp3", 0.3, 0.8], [T.n35 - 0.2, "lib/glitch_soft_3.mp3", 0.4, 0.6],
    [T.y2009 - 0.2, "universfield-camera-shutter-199580.mp3", 0.3, 0.6], [T.now, "lib/impact_soft_2.mp3", 0.45, 0.8], [T.tz - 0.2, "lib/whoosh_soft_2.mp3", 0.45, 1.3],
    [T.n560 - 0.3, "lib/count_tick_3.mp3", 0.3, 3.2], [T.moon - 0.3, "lib/shimmer_8.mp3", 0.3, 1.6], [T.second, "lib/impact_soft_4.mp3", 0.4, 0.8], [T.league - 0.2, "lib/riser_soft_5.mp3", 0.45, 1.8],
  ],
};

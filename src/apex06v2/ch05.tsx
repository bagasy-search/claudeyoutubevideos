// Capítulo 5 — #3 leopardo: el felino más exitoso (África + Asia) → Mumbai → no le teme a la cercanía → Panar (~400, 1910,
// Corbett) → Rudraprayag (125+, camino de peregrinos, 1926 desde un árbol) → "aprendió a qué sabemos por nosotros".
import React from "react";
import { Chapter, at, Sticker, BigWord, Num, Pin, Tag, Cat, Range, Country, Trail, pv, PortalSpec, ramp, win, RED, GOLD, ORANGE } from "./lib";
import { RG } from "./ranges";

const T = {
  n3: at("number three the leopard"), success: at("the most successful big cat"), africa: at("most of africa"), asia: at("large parts of asia"), deserts: at("from deserts"), cities: at("huge cities"),
  mumbai: at("in mumbai"), park: at("inside a national park"), apts: at("apartment buildings"), night: at("at night they walk"), dogs: at("hunt stray dogs"), learned: at("the people there have learned"),
  mostly: at("mostly"), skill: at("because the leopard has one skill"), close: at("it is not afraid of being close"), carcass: at("it can carry a carcass"), tree: at("into a tree"),
  hide: at("it can hide in a patch"), empty: at("was empty"), village: at("and it can walk into a village"), hearing: at("without anyone hearing"),
  early: at("in the early 1900s"), hills: at("in the hills of northern india"), legend: at("became a legend"), panar: at("the panar leopard"), n400: at("around 400 people"),
  doors: at("it would walk into villages"), pushed: at("pushed through the doors"), shot: at("it was finally shot in 1910"), corbett: at("jim corbett"),
  eight: at("corbett would later spend"), rudra: at("the rudder pryag leopard"), n125: at("more than 125 people"), pilgrim: at("on a pilgrim road"), locked: at("for years people on that road"),
  sunset: at("before sunset"), y1926: at("corbett finally shot it in 1926"), alone: at("waiting alone in a tree"), wrote: at("he wrote that many"), wounded: at("after being wounded"),
  epid: at("during epidemics"), bury: at("too many dead to bury"), taste: at("in other words the leopard"), us: at("because of us"), forget: at("and once it learned"),
};
export const CH05_T1 = at("number 2") + 0.5;
const LEO: [number, number] = [50, 8], MUM: [number, number] = [72.88, 19.1], PANAR: [number, number] = [79.9, 29.5], RUDRA: [number, number] = [78.98, 30.28];

const portals: PortalSpec[] = [
  pv("real/leopard_37154554.mp4", T.n3 + 4.4, T.africa + 0.2, 22, 3, { startFrom: 1.0, zoom: [1.1, 1.0] }),
  pv("ilu/ap6i_mumbai_a.mp4", T.park - 0.3, T.night + 0.4, MUM[0], MUM[1], { startFrom: 0.5, zoom: [1.0, 1.1] }),
  pv("atk/ap6_leopardo_cctv.mp4", T.night, T.learned + 0.4, MUM[0], MUM[1], { startFrom: 1.0, zoom: [1.05, 1.0] }),
  pv("ilu/ap6i_mumbai_b.mp4", T.learned, T.skill + 0.3, MUM[0], MUM[1], { startFrom: 0.5, zoom: [1.0, 1.08] }),
  pv("atk/ap6_leopardo_impala.mp4", T.carcass - 0.2, T.hide + 0.3, LEO[0], LEO[1], { startFrom: 3.0, zoom: [1.0, 1.08] }),
  pv("real/leopard_27683634.mp4", T.hide, T.village + 0.3, LEO[0], LEO[1], { startFrom: 1.0, zoom: [1.14, 1.04] }),
  pv("atk/ap6_leopardo_aldea.mp4", T.village, T.early + 0.3, PANAR[0], PANAR[1], { startFrom: 0, zoom: [1.0, 1.06] }),
  pv("foto/PanarManeater.jpg", T.panar - 0.2, T.doors + 0.4, PANAR[0], PANAR[1], { maxR: 320, dx: 520, dy: 0, zoom: [1.12, 1.02], credit: "Wikimedia Commons" }),
  pv("ilu/ap6i_door.mp4", T.doors, T.shot + 0.3, PANAR[0], PANAR[1], { startFrom: 0.5, zoom: [1.0, 1.1] }),
  pv("foto/Jim_Corbett_after_killing_the_Leopard_of.jpg", T.corbett - 0.3, T.rudra + 0.2, PANAR[0], PANAR[1], { maxR: 300, dx: -520, dy: 20, zoom: [1.1, 1.0], credit: "Wikimedia Commons", label: "Jim Corbett" }),
  pv("ilu/ap6i_pilgrim.mp4", T.pilgrim - 0.2, T.y1926 + 0.3, RUDRA[0], RUDRA[1], { startFrom: 0, zoom: [1.0, 1.08] }),
  pv("ilu/ap6i_machan_a.mp4", T.y1926, T.wrote + 0.6, RUDRA[0], RUDRA[1], { startFrom: 1.0, zoom: [1.0, 1.08] }),
  pv("ilu/ap6i_machan_b.mp4", T.wrote + 0.2, T.epid + 0.3, RUDRA[0], RUDRA[1], { startFrom: 1.0, zoom: [1.0, 1.08] }),
  pv("real/village_854070.mp4", T.epid, T.taste + 0.4, RUDRA[0], RUDRA[1], { startFrom: 1.0, zoom: [1.08, 1.0] }),
];

const World: Chapter["World"] = ({ t, z }) => (
  <g>
    <Range id="leo" rings={RG.leopard} from={LEO} k={ramp(t, T.africa - 0.4, 3.0)} op={win(t, T.africa - 0.4, T.mumbai + 1.0, 0.6)} />
    <Country name="India" z={z} op={win(t, T.mumbai - 0.3, T.park + 0.4, 0.4) * 0.4 + win(t, T.hills, T.taste + 0.6, 0.5) * 0.35} />
    {/* camino de peregrinos hacia Kedarnath / Badrinath pasando por Rudraprayag */}
    <Trail pts={[[78.3, 30.1], [78.6, 30.15], [78.98, 30.28], [79.2, 30.5], [79.06, 30.73]]} k={ramp(t, T.pilgrim - 0.3, 1.4)} z={z} color={GOLD} w={6} op={win(t, T.pilgrim - 0.3, T.taste + 0.5, 0.4)} />
  </g>
);

const Screen: Chapter["Screen"] = ({ c, f, t }) => (
  <>
    <Cat c={c} f={f} t={t} src="leopard" lon={LEO[0]} lat={LEO[1]} t0={T.n3 + 0.4} t1={T.n3 + 4.6} h={140} />
    <Sticker f={f} t={t} t0={T.success + 0.4} t1={T.africa} x={960} y={190} rot={-3} bg={GOLD} size={58}><span style={{ color: "#111" }}>THE MOST SUCCESSFUL BIG CAT</span></Sticker>
    <Tag c={c} f={f} t={t} lon={20} lat={-5} t0={T.africa + 0.2} t1={T.mumbai} text="Africa" size={32} />
    <Tag c={c} f={f} t={t} lon={100} lat={30} t0={T.asia} t1={T.mumbai} text="Asia" size={32} />
    <Sticker f={f} t={t} t0={T.deserts} t1={T.mumbai} x={960} y={860} rot={-2} size={52}>DESERTS · RAINFORESTS · CITY EDGES</Sticker>
    <Pin c={c} f={f} t={t} lon={MUM[0]} lat={MUM[1]} t0={T.mumbai} t1={T.skill + 0.6} label="Mumbai" side="l" />
    <Sticker f={f} t={t} t0={T.dogs - 0.3} t1={T.learned} x={960} y={860} rot={3} bg={RED} size={58}>HUNTING STRAY DOGS</Sticker>
    <Sticker f={f} t={t} t0={T.mostly} t1={T.skill} x={1400} y={250} rot={6} bg={GOLD} size={80}><span style={{ color: "#111" }}>MOSTLY.</span></Sticker>
    <BigWord f={f} t={t} t0={T.close} t1={T.carcass} text={<span>NOT AFRAID OF BEING <span style={{ color: RED }}>CLOSE</span></span>} y={200} size={90} />
    <Cat c={c} f={f} t={t} src="leopard" lon={LEO[0]} lat={LEO[1]} t0={T.skill} t1={T.carcass} h={200} />
    <Sticker f={f} t={t} t0={T.tree - 0.3} t1={T.hide} x={960} y={860} rot={-3} size={56}>HEAVIER THAN ITSELF · UP A TREE</Sticker>
    <Sticker f={f} t={t} t0={T.empty - 0.3} t1={T.village} x={960} y={190} rot={3} size={56}>"THAT GRASS WAS EMPTY"</Sticker>
    <Sticker f={f} t={t} t0={T.hearing} t1={T.early} x={960} y={860} rot={-3} bg={RED} size={58}>NOBODY HEARS A THING</Sticker>
    {/* Panar */}
    <Tag c={c} f={f} t={t} lon={78} lat={27.7} t0={T.hills} t1={T.panar} text="Northern India · early 1900s" size={28} />
    <Pin c={c} f={f} t={t} lon={PANAR[0]} lat={PANAR[1]} t0={T.legend - 0.2} t1={T.eight} label="Panar" color={RED} />
    <Num f={f} t={t} t0={T.n400 - 0.2} t1={T.shot} x={360} y={860} value={400} prefix="~" label="people · one leopard" size={100} color="#ff5a3a" />
    <Sticker f={f} t={t} t0={T.pushed} t1={T.shot} x={960} y={190} rot={-3} bg={RED} size={58}>THROUGH THE DOORS · INTO HOUSES</Sticker>
    <Sticker f={f} t={t} t0={T.shot + 0.4} t1={T.eight} x={1500} y={860} rot={4} size={64}>SHOT · 1910</Sticker>
    {/* Rudraprayag */}
    <Pin c={c} f={f} t={t} lon={RUDRA[0]} lat={RUDRA[1]} t0={T.rudra - 0.2} t1={T.taste} label="Rudraprayag" side="l" color={RED} />
    <Sticker f={f} t={t} t0={T.eight + 0.6} t1={T.rudra + 0.4} x={960} y={190} rot={-3} bg={GOLD} size={64}><span style={{ color: "#111" }}>8 YEARS</span></Sticker>
    <Num f={f} t={t} t0={T.n125 - 0.2} t1={T.locked} x={1500} y={860} value={125} label="people · more than" prefix="" size={100} color="#ff5a3a" />
    <Sticker f={f} t={t} t0={T.sunset - 0.3} t1={T.y1926} x={960} y={860} rot={3} size={58}>LOCKED INSIDE BEFORE SUNSET</Sticker>
    <Sticker f={f} t={t} t0={T.y1926 + 0.6} t1={T.wrote} x={960} y={190} rot={-3} size={58}>1926 · ALONE IN A TREE · NIGHT AFTER NIGHT</Sticker>
    <Sticker f={f} t={t} t0={T.wounded} t1={T.taste} x={600} y={200} rot={-5} bg={ORANGE} size={56}>WOUNDED</Sticker>
    <Sticker f={f} t={t} t0={T.epid} t1={T.taste} x={1340} y={240} rot={4} bg={ORANGE} size={56}>EPIDEMICS</Sticker>
    <BigWord f={f} t={t} t0={T.us - 0.6} t1={T.forget + 2.4} text={<span>IT LEARNED BECAUSE OF <span style={{ color: RED }}>US</span></span>} y={200} size={100} />
    <Sticker f={f} t={t} t0={at("it did not forget")} t1={at("number 2") - 0.1} x={960} y={420} rot={-3} bg={RED} size={70}>…AND IT DID NOT FORGET</Sticker>
  </>
);

export const ch05: Chapter = {
  T0: at("into a habit"), T1: CH05_T1,
  keys: [
    [T.n3 + 1.2, 50, 8, 120], [T.success + 0.8, 52, 10, 130], [T.cities, 70, 22, 80], [T.mumbai + 0.8, MUM[0], MUM[1], 18], [T.learned, MUM[0], MUM[1], 16],
    [T.skill + 0.6, 50, 8, 100], [T.village, 70, 22, 70], [T.hills + 1.0, 79.6, 29.4, 20], [T.shot, 79.8, 29.5, 18],
    [T.rudra + 0.4, 79.2, 30.2, 16], [T.locked, 79.1, 30.3, 14], [T.wrote, 79.3, 30.0, 20], [T.forget + 0.6, 50, 5, 110],
  ],
  World,
  Screen,
  portals,
  sfx: [
    [T.n3 - 0.5, "lib/whoosh_glass_1.mp3", 0.45, 1.3], [T.n3 + 0.4, "lib/pop_soft_3.mp3", 0.45, 0.5], [T.africa - 0.4, "lib/shimmer_6.mp3", 0.3, 1.8],
    [T.mumbai - 0.3, "lib/whoosh_soft_3.mp3", 0.45, 1.3], [T.mostly, "lib/bubble_pop_4.mp3", 0.35, 0.5], [T.close, "lib/impact_soft_6.mp3", 0.4, 0.8],
    [T.hills - 0.2, "lib/whoosh_soft_6.mp3", 0.45, 1.3], [T.panar - 0.2, "universfield-camera-shutter-199580.mp3", 0.35, 0.6], [T.n400 - 0.2, "lib/count_tick_2.mp3", 0.3, 1.2],
    [T.corbett - 0.3, "universfield-camera-shutter-199580.mp3", 0.3, 0.6], [T.n125 - 0.2, "lib/count_tick_4.mp3", 0.3, 1.2], [T.pilgrim - 0.3, "line_draw.mp3", 0.35, 1.4],
    [T.us - 0.6, "deep-cinematic-impact-1.mp3", 0.5, 2.0],
  ],
};

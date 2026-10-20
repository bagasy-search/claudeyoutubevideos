// Capítulo 2 — la regla: "peligroso" (te mata porque lo asustaste) ≠ "devorador de hombres" (te observa, aprende tu camino
// y te caza como a un ciervo). La cámara deriva de África a la India y despega hacia el Himalaya en "let's start at the bottom".
import React from "react";
import { Chapter, at, Sticker, BigWord, pv, PortalSpec, RED, GOLD, ORANGE } from "./lib";

const T = {
  lots: at("lots of animals"), cow: at("a cow can kill"), deer: at("a deer on a highway"), but: at("but being dangerous"), two: at("two completely different"),
  dang: at("a dangerous animal kills"), scared: at("you scared it"), corn: at("cornered it"), babies: at("its babies"), extreme: at("it is a very extreme"), leave: at("please leave"),
  me: at("a man-eater does something"), watches: at("it watches you"), learns: at("it learns where"), river: at("to the river"), deerto: at("and then it does to you"),
  claws: at("so this ranking is not"), bite: at("bite force"), one: at("it is about one question"), food: at("would this cat see"), bottom: at("let's start at the bottom"),
};
export const CH02_T1 = T.bottom + 0.8;

const portals: PortalSpec[] = [
  // la vaca y el ciervo de la ruta: dos ventanas chicas a los lados
  pv("real/herd_39209304.mp4", T.cow - 0.15, T.but + 0.4, 0, 0, { sx: 540, sy: 470, maxR: 300, startFrom: 1.0, zoom: [1.12, 1.04], label: "a cow" }),
  pv("real/herd_1508541.mp4", T.deer - 0.15, T.but + 0.6, 0, 0, { sx: 1380, sy: 470, maxR: 300, startFrom: 2.0, zoom: [1.1, 1.0], label: "a deer" }),
  // peligroso: la leona carga contra el vehículo
  pv("atk/ap6_leona_carga.mp4", T.dang - 0.25, T.me + 0.35, 36, -2, { startFrom: 0, zoom: [1.06, 1.14] }),
  // devorador: te mira, aprende tu camino al río, te caza
  pv("ilu/ap6i_stalk_b.mp4", T.me + 0.5, T.learns + 0.55, 78, 22, { startFrom: 0.5, zoom: [1.04, 1.12] }),
  pv("ilu/ap6i_stalk_a.mp4", T.learns, T.deerto + 0.55, 78, 22, { startFrom: 0.2, zoom: [1.0, 1.1] }),
  pv("atk/ap6_leopardo_impala.mp4", T.deerto, T.claws + 0.3, 78, 22, { startFrom: 0.6, zoom: [1.1, 1.0] }),
];

const Screen: Chapter["Screen"] = ({ f, t }) => (
  <>
    <Sticker f={f} t={t} t0={T.but} t1={T.dang - 0.1} x={600} y={820} rot={-4} bg={ORANGE} size={72}>DANGEROUS</Sticker>
    <Sticker f={f} t={t} t0={T.two - 0.2} t1={T.dang - 0.1} x={960} y={830} rot={0} size={80}>≠</Sticker>
    <Sticker f={f} t={t} t0={T.two} t1={T.dang - 0.1} x={1340} y={820} rot={4} bg={RED} size={72}>MAN-EATER</Sticker>
    {/* por qué te mata uno "peligroso" */}
    <Sticker f={f} t={t} t0={T.scared} t1={T.extreme} x={400} y={300} rot={-6} size={54}>YOU SCARED IT</Sticker>
    <Sticker f={f} t={t} t0={T.corn} t1={T.extreme} x={960} y={170} rot={3} size={54}>YOU CORNERED IT</Sticker>
    <Sticker f={f} t={t} t0={T.babies} t1={T.extreme} x={1520} y={300} rot={-3} size={54}>ITS BABIES</Sticker>
    <Sticker f={f} t={t} t0={T.leave} t1={T.me} x={960} y={860} rot={-4} bg={ORANGE} size={88}>"PLEASE LEAVE."</Sticker>
    <BigWord f={f} t={t} t0={T.me} t1={T.watches + 1.0} text={<span>A <span style={{ color: RED }}>MAN-EATER</span>…</span>} y={170} size={110} />
    <Sticker f={f} t={t} t0={T.watches} t1={T.learns} x={960} y={880} rot={3} bg={RED} size={76}>IT WATCHES YOU</Sticker>
    <Sticker f={f} t={t} t0={T.learns + 0.4} t1={T.deerto} x={960} y={880} rot={-3} size={54}>WHERE YOU WALK · WHEN YOU SLEEP</Sticker>
    <Sticker f={f} t={t} t0={T.deerto + 0.5} t1={T.claws} x={960} y={190} rot={-3} bg={RED} size={70}>…LIKE A DEER</Sticker>
    {/* no es por garras ni mordida */}
    <Sticker f={f} t={t} t0={T.claws + 0.4} t1={T.one} x={680} y={480} rot={-6} size={70}><s style={{ textDecorationColor: RED, textDecorationThickness: 8 }}>CLAWS</s></Sticker>
    <Sticker f={f} t={t} t0={T.bite} t1={T.one} x={1260} y={560} rot={5} size={70}><s style={{ textDecorationColor: RED, textDecorationThickness: 8 }}>BITE FORCE</s></Sticker>
    <BigWord f={f} t={t} t0={T.one} t1={T.food - 0.1} text={<span>ONE <span style={{ color: GOLD }}>QUESTION</span></span>} y={200} size={120} />
    <BigWord f={f} t={t} t0={T.food} t1={T.bottom + 0.3} text={<span>WOULD IT SEE YOU AS <span style={{ color: RED }}>FOOD</span>?</span>} y={200} size={100} />
  </>
);

export const ch02: Chapter = {
  T0: T.lots + 0.5, T1: CH02_T1,
  keys: [
    [T.cow + 0.5, 36, -2, 54], [T.dang, 36, -2, 46],
    [T.me + 0.6, 60, 12, 120], [T.claws + 0.4, 76, 20, 70], [T.food, 78, 22, 62], [T.bottom + 0.1, 79, 24, 66],
  ],
  Screen,
  portals,
  sfx: [
    [T.cow - 0.15, "lib/pop_soft_2.mp3", 0.4, 0.5], [T.deer - 0.15, "lib/pop_soft_3.mp3", 0.4, 0.5], [T.but, "lib/tap_2.mp3", 0.4, 0.4], [T.two, "lib/tap_3.mp3", 0.4, 0.4],
    [T.dang - 0.3, "lib/whoosh_soft_2.mp3", 0.45, 1.0], [T.leave, "lib/impact_soft_1.mp3", 0.4, 0.8],
    [T.me + 0.4, "lib/whoosh_reverse_2.mp3", 0.4, 1.0], [T.deerto - 0.1, "lib/whoosh_soft_3.mp3", 0.4, 1.0],
    [T.claws + 0.4, "lib/glitch_soft_1.mp3", 0.3, 0.5], [T.bite, "lib/glitch_soft_2.mp3", 0.3, 0.5], [T.food, "lib/impact_soft_3.mp3", 0.45, 0.9],
  ],
};

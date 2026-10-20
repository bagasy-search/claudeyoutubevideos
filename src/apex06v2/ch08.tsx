// Capítulo 8 — qué hacer frente a cada uno (puma / Colorado 2019 / leopardo / león / tigre / un amigo atento) → el ranking final
// → 100.000 → 3.200 tigres → ~5.500 → "el ranking se da vuelta" → "el que sostiene la cámara" → próximo caso. Fin del plano.
import React from "react";
import { interpolate } from "remotion";
import { Chapter, at, atEnd, Sticker, BigWord, Num, Pin, Cat, Range, Swap, pv, PortalSpec, ramp, win, clamp, SANS, RED, GOLD, ORANGE } from "./lib";
import { RG } from "./ranges";

const T = {
  what: at("so what should you actually do"), rules: at("the rules are different"), wrong: at("getting them wrong"),
  cougar: at("with a cougar you make"), big: at("you make yourself big"), noise: at("you make noise"), fightb: at("you fight back"), rocks: at("rocks and sticks"),
  y2019: at("and in 2019"), colorado: at("in colorado"), hands: at("his bare hands"),
  leopard: at("with a leopard the danger"), night: at("mostly at night"), children: at("keep children inside"), pens: at("closed pens"),
  lion: at("with a lion the worst"), run: at("is run"), running: at("running tells a lion"), twice: at("more than twice as fast"), guides: at("guides in africa"),
  still: at("stand still"), face: at("face it"), back: at("back away slowly"), never: at("never turn your back"),
  tiger: at("with a tiger the honest"), dontknow: at("you usually do not know it"), stripes: at("the whole point of the stripes"), grass: at("in tall grass"), lines: at("lines of light and dark"),
  skip: at("simply skip over"), survive: at("the people who survive tigers"), notalone: at("not alone"), shout: at("a shout"), second: at("a second person"), group: at("a group that does not"),
  ambush: at("for an ambush hunter"), failed: at("is a failed hunt"), weapon: at("which means the most powerful"), gun: at("is not a gun"), friend: at("it is a friend"),
  fin: at("so here is the final ranking"), bottom: at("at the bottom the snow"), basically: at("basically never hunted"), middle: at("in the middle the jaguar"), rare: at("rare and terrifying"),
  top: at("and at the top the three"), food: at("treat people as food"), threenames: at("the leopard the lion and the tiger"), onemore: at("but there is one more number"),
  ago: at("a little over a hundred years"), n100k: at("around 100000 wild tigers"), y2010: at("by 2010"), n3200: at("about 3200 left"), lionsr: at("lions have lost most"),
  leosr: at("leopards are gone"), rifle: at("one hunter with a rifle"), wiped: at("nearly wiped out"), bigger: at("something much bigger"), us: at("us our farms"), roads: at("our roads"),
  guns: at("our guns"), cities: at("and our cities"), good: at("the good news is"), climbing: at("have been climbing again"), n5500: at("five and a half thousand"), protect: at("worth protecting"),
  yes: at("so yes a tiger once"), put: at("but if you put every"), flips: at("the ranking flips"), never2: at("the most dangerous animal on this list"), cat: at("was never a cat"),
  camera: at("it was the one holding"), next: at("and if you want to know"), record: at("really holds the record"), apex: at("from apex files"),
};
const END = atEnd("from apex files") + 2.6;
const COL: [number, number] = [-105.5, 39.2];

const portals: PortalSpec[] = [
  pv("ilu/ap6i_standtall_b.mp4", T.cougar - 0.2, T.rocks + 0.3, COL[0], COL[1], { startFrom: 0, zoom: [1.0, 1.08] }),
  pv("atk/ap6_puma_trailcam.mp4", T.colorado - 0.4, T.leopard + 0.3, COL[0], COL[1], { startFrom: 5.0, zoom: [1.08, 1.0] }),
  pv("real/village_4178700.mp4", T.night - 0.2, T.lion + 0.3, 79.5, 29.6, { startFrom: 1.0, zoom: [1.08, 1.0] }),
  pv("real/lion_7710516.mp4", T.lion, T.guides + 0.3, 35, -3, { startFrom: 1.0, zoom: [1.1, 1.0] }),
  pv("ilu/ap6i_lionface.mp4", T.guides - 0.1, T.tiger + 0.3, 35, -3, { startFrom: 0, zoom: [1.0, 1.1] }),
  pv("real/tiger_855576.mp4", T.tiger, T.grass + 0.3, 80, 23, { startFrom: 1.0, zoom: [1.06, 1.0] }),
  pv("real/tiger_27683637.mp4", T.grass, T.survive + 0.3, 80, 23, { startFrom: 0.5, zoom: [1.16, 1.04] }),
  pv("ilu/ap6i_group_a.mp4", T.survive, T.ambush + 0.3, 80, 23, { startFrom: 0, zoom: [1.0, 1.08] }),
  pv("ilu/ap6i_group_b.mp4", T.ambush, T.fin - 0.2, 80, 23, { startFrom: 0.5, zoom: [1.0, 1.08] }),
  pv("real/tiger_31691426.mp4", T.ago - 0.2, T.y2010 + 0.4, 80, 23, { startFrom: 1.0, zoom: [1.1, 1.0], sx: 1440, sy: 470, maxR: 330 }),
  pv("real/city_2248563.mp4", T.us - 0.3, T.good + 0.2, 0, 20, { startFrom: 1.0, zoom: [1.0, 1.1] }),
  pv("real/tiger_39005170.mp4", T.climbing - 0.3, T.yes + 0.4, 80, 23, { startFrom: 0, zoom: [1.0, 1.1] }),
  pv("real/hiker_7606968.mp4", T.camera - 0.3, T.next + 1.2, 0, 20, { startFrom: 1.0, zoom: [1.0, 1.12] }),
];

// en "wiped out" los rangos se encogen; en "climbing again" el del tigre vuelve un poco
const World: Chapter["World"] = ({ t }) => {
  const shrink = ramp(t, T.n3200 - 0.4, 1.6), back = ramp(t, T.climbing, 1.4);
  const op = win(t, T.ago, T.us, 0.6) + win(t, T.climbing - 0.3, T.yes + 0.4, 0.5);
  return (
    <g>
      <Range id="tigF" rings={RG.tiger} from={[85, 24]} k={(1 - 0.72 * shrink + 0.22 * back)} op={Math.min(1, op)} />
      <Range id="lionF" rings={RG.lion} from={[25, 2]} k={1 - 0.6 * ramp(t, T.lionsr, 1.6)} op={win(t, T.lionsr - 0.3, T.us, 0.5)} color="#ffb05c" />
      <Range id="leoF" rings={RG.leopard} from={[40, 5]} k={1 - 0.55 * ramp(t, T.leosr, 1.6)} op={win(t, T.leosr - 0.3, T.us, 0.5)} color="#ffd23a" />
    </g>
  );
};

const Screen: Chapter["Screen"] = ({ c, f, t }) => {
  const flip = ramp(t, T.flips, 0.9);
  return (
    <>
      <BigWord f={f} t={t} t0={T.what} t1={T.cougar} text={<span>SO WHAT DO <span style={{ color: GOLD }}>YOU</span> DO?</span>} y={200} size={110} />
      <Sticker f={f} t={t} t0={T.rules + 0.3} t1={T.cougar} x={960} y={860} rot={-3} size={56}>DIFFERENT CAT · DIFFERENT RULES</Sticker>
      {/* puma */}
      <Sticker f={f} t={t} t0={T.cougar} t1={T.y2019} x={960} y={150} rot={-2} bg={ORANGE} size={58}>COUGAR</Sticker>
      <Sticker f={f} t={t} t0={T.big} t1={T.y2019} x={480} y={860} rot={-5} bg={GOLD} size={50}><span style={{ color: "#111" }}>BIG</span></Sticker>
      <Sticker f={f} t={t} t0={T.noise} t1={T.y2019} x={960} y={880} rot={3} bg={GOLD} size={50}><span style={{ color: "#111" }}>LOUD</span></Sticker>
      <Sticker f={f} t={t} t0={T.fightb} t1={T.y2019} x={1440} y={860} rot={-3} bg={RED} size={50}>FIGHT BACK</Sticker>
      <Pin c={c} f={f} t={t} lon={COL[0]} lat={COL[1]} t0={T.colorado - 0.6} t1={T.leopard} label="Colorado" />
      <Sticker f={f} t={t} t0={T.y2019 + 0.3} t1={T.leopard} x={960} y={190} rot={-3} size={56}>COLORADO · 2019 · TRAIL RUNNER</Sticker>
      <Sticker f={f} t={t} t0={T.hands} t1={T.leopard} x={960} y={860} rot={3} bg={RED} size={66}>BARE HANDS</Sticker>
      {/* leopardo */}
      <Sticker f={f} t={t} t0={T.leopard} t1={T.lion} x={960} y={150} rot={-2} bg={RED} size={58}>LEOPARD</Sticker>
      <Sticker f={f} t={t} t0={T.children - 0.2} t1={T.lion} x={620} y={860} rot={-4} size={50}>KIDS INSIDE AFTER DARK</Sticker>
      <Sticker f={f} t={t} t0={T.pens - 0.2} t1={T.lion} x={1360} y={860} rot={4} size={50}>ANIMALS IN CLOSED PENS</Sticker>
      {/* león */}
      <Sticker f={f} t={t} t0={T.lion} t1={T.guides} x={960} y={150} rot={-2} bg={RED} size={58}>LION</Sticker>
      <BigWord f={f} t={t} t0={T.run} t1={T.running + 1.5} text={<span>NEVER <span style={{ color: RED }}>RUN</span></span>} y={540} size={140} />
      <Sticker f={f} t={t} t0={T.twice} t1={T.guides} x={960} y={860} rot={3} bg={RED} size={60}>2× FASTER THAN YOU</Sticker>
      <Sticker f={f} t={t} t0={T.still} t1={T.tiger} x={420} y={860} rot={-5} bg={GOLD} size={46}><span style={{ color: "#111" }}>STAND STILL</span></Sticker>
      <Sticker f={f} t={t} t0={T.face} t1={T.tiger} x={800} y={880} rot={3} bg={GOLD} size={46}><span style={{ color: "#111" }}>FACE IT</span></Sticker>
      <Sticker f={f} t={t} t0={T.back} t1={T.tiger} x={1180} y={860} rot={-3} bg={GOLD} size={46}><span style={{ color: "#111" }}>BACK AWAY</span></Sticker>
      <Sticker f={f} t={t} t0={T.never} t1={T.tiger} x={1560} y={880} rot={4} bg={RED} size={46}>NEVER TURN</Sticker>
      {/* tigre */}
      <Sticker f={f} t={t} t0={T.tiger} t1={T.survive} x={960} y={150} rot={-2} bg={RED} size={58}>TIGER</Sticker>
      <Sticker f={f} t={t} t0={T.dontknow} t1={T.stripes} x={960} y={860} rot={3} size={58}>YOU USUALLY DON'T KNOW</Sticker>
      <Sticker f={f} t={t} t0={T.stripes + 0.3} t1={T.survive} x={960} y={860} rot={-3} bg={GOLD} size={58}><span style={{ color: "#111" }}>400 LB → LINES OF LIGHT & DARK</span></Sticker>
      <Sticker f={f} t={t} t0={T.shout} t1={T.ambush} x={480} y={860} rot={-5} bg={GOLD} size={50}><span style={{ color: "#111" }}>A SHOUT</span></Sticker>
      <Sticker f={f} t={t} t0={T.second} t1={T.ambush} x={960} y={880} rot={3} bg={GOLD} size={50}><span style={{ color: "#111" }}>A SECOND PERSON</span></Sticker>
      <Sticker f={f} t={t} t0={T.group} t1={T.ambush} x={1440} y={860} rot={-3} bg={GOLD} size={50}><span style={{ color: "#111" }}>A GROUP</span></Sticker>
      <Sticker f={f} t={t} t0={T.failed - 0.2} t1={T.weapon} x={960} y={190} rot={-3} bg={RED} size={60}>SEEN = FAILED HUNT</Sticker>
      <Sticker f={f} t={t} t0={T.gun - 0.1} t1={T.friend} x={960} y={190} rot={3} size={66}><s style={{ textDecorationColor: RED, textDecorationThickness: 8 }}>A GUN</s></Sticker>
      <BigWord f={f} t={t} t0={T.friend} t1={T.fin - 0.1} text={<span>A FRIEND WHO IS <span style={{ color: GOLD }}>PAYING ATTENTION</span></span>} y={200} size={84} />
      {/* ranking final (el riel vive en rank.tsx) */}
      <BigWord f={f} t={t} t0={T.fin} t1={T.onemore} text={<span>THE <span style={{ color: GOLD }}>FINAL</span> RANKING</span>} y={170} size={120} />
      <Sticker f={f} t={t} t0={T.basically - 0.2} t1={T.middle} x={960} y={420} rot={-3} bg={"#2f9e57"} size={56}>BASICALLY NEVER HUNTED A HUMAN</Sticker>
      <Sticker f={f} t={t} t0={T.rare} t1={T.top} x={960} y={420} rot={3} bg={ORANGE} size={56}>RARE · TERRIFYING · NEVER A HABIT</Sticker>
      <Sticker f={f} t={t} t0={T.food - 0.2} t1={T.onemore} x={960} y={420} rot={-3} bg={RED} size={60}>PEOPLE = FOOD</Sticker>
      <BigWord f={f} t={t} t0={T.onemore} t1={T.ago} text={<span>ONE MORE <span style={{ color: GOLD }}>NUMBER</span></span>} y={200} size={110} />
      <Swap f={f} t={t} t0={T.n100k - 0.4} tx={T.n3200 - 0.3} t1={T.lionsr} x={560} y={480} a="100,000" b="3,200" label="wild tigers · ~1910 → 2010" size={90} />
      <Sticker f={f} t={t} t0={T.lionsr + 0.2} t1={T.rifle} x={960} y={860} rot={-3} bg={ORANGE} size={54}>LIONS: MOST OF THEIR RANGE, GONE</Sticker>
      <Sticker f={f} t={t} t0={T.leosr + 0.2} t1={T.rifle} x={960} y={190} rot={3} bg={ORANGE} size={54}>LEOPARDS: GONE FROM HUGE AREAS</Sticker>
      <Sticker f={f} t={t} t0={T.rifle - 0.3} t1={T.wiped} x={960} y={860} rot={-3} size={58}>EACH MAN-EATER: ONE RIFLE</Sticker>
      <Sticker f={f} t={t} t0={T.bigger} t1={T.us} x={960} y={190} rot={3} bg={RED} size={60}>SOMETHING MUCH BIGGER</Sticker>
      <BigWord f={f} t={t} t0={T.us} t1={T.good} text={<span style={{ color: RED }}>US.</span>} y={300} size={180} />
      <Sticker f={f} t={t} t0={T.us + 0.6} t1={T.good} x={420} y={760} rot={-5} size={50}>FARMS</Sticker>
      <Sticker f={f} t={t} t0={T.roads} t1={T.good} x={800} y={820} rot={3} size={50}>ROADS</Sticker>
      <Sticker f={f} t={t} t0={T.guns} t1={T.good} x={1160} y={760} rot={-3} size={50}>GUNS</Sticker>
      <Sticker f={f} t={t} t0={T.cities} t1={T.good} x={1520} y={820} rot={4} size={50}>CITIES</Sticker>
      <BigWord f={f} t={t} t0={T.good} t1={T.climbing} text={<span>THE <span style={{ color: "#7ee08a" }}>GOOD NEWS</span></span>} y={200} size={110} />
      <Num f={f} t={t} t0={T.n5500 - 0.5} t1={T.yes} x={560} y={860} value={5500} prefix="~" label="wild tigers today" size={100} color="#7ee08a" />
      <Sticker f={f} t={t} t0={T.protect - 0.2} t1={T.yes} x={1360} y={860} rot={3} bg={"#2f9e57"} size={56}>WORTH PROTECTING</Sticker>
      <Num f={f} t={t} t0={T.yes + 0.3} t1={T.flips} x={960} y={200} value={436} label="one tiger · Champawat" size={100} color="#ff5a3a" dur={0.8} />
      <BigWord f={f} t={t} t0={T.flips - 0.1} t1={T.never2} text={<span>THE RANKING <span style={{ color: GOLD, display: "inline-block", transform: `scaleY(${interpolate(flip, [0, 0.5, 1], [1, -1, 1], clamp)})` }}>FLIPS</span></span>} y={200} size={120} />
      <BigWord f={f} t={t} t0={T.cat - 0.4} t1={T.camera} text={<span>…WAS NEVER A <span style={{ color: GOLD }}>CAT</span></span>} y={200} size={120} />
      {/* el que sostiene la cámara: un visor de cámara sobre la toma en primera persona */}
      {t > T.camera && t < T.next + 1.4 && (
        <div style={{ position: "absolute", inset: 0, zIndex: 25, opacity: win(t, T.camera + 0.2, T.next + 1.4, 0.4) }}>
          {[[60, 60, "0 0"], [1860, 60, "90"], [1860, 1020, "180"], [60, 1020, "270"]].map(([x, y, r], i) => (
            <div key={i} style={{ position: "absolute", left: (x as number) - 40, top: (y as number) - 40, width: 80, height: 80, borderLeft: "8px solid #fff", borderTop: "8px solid #fff", transform: `rotate(${r === "0 0" ? 0 : r}deg)` }} />
          ))}
          <div style={{ position: "absolute", left: 110, top: 90, fontFamily: SANS, fontWeight: 900, fontSize: 40, color: "#fff", display: "flex", alignItems: "center", gap: 14, textShadow: "0 2px 6px #000" }}>
            <span style={{ width: 26, height: 26, borderRadius: 13, background: RED, opacity: Math.floor(t * 2) % 2 ? 1 : 0.25 }} /> REC
          </div>
        </div>
      )}
      <BigWord f={f} t={t} t0={T.camera + 0.6} t1={T.next} text={<span>THE ONE HOLDING THE <span style={{ color: RED }}>CAMERA</span></span>} y={540} size={100} />
      <Sticker f={f} t={t} t0={T.record - 0.2} t1={END} x={960} y={420} rot={-3} bg={RED} size={64}>WHO REALLY HOLDS THE RECORD?</Sticker>
      <Sticker f={f} t={t} t0={T.apex - 0.4} t1={END} x={960} y={620} rot={2} size={70}>NEXT CASE FILE · APEX FILES</Sticker>
    </>
  );
};

export const ch08: Chapter = {
  T0: at("was beaten by a cheap"), T1: END,
  keys: [
    [T.what + 1.2, -20, 25, 300], [T.cougar + 0.4, -104, 40, 40], [T.colorado, COL[0], COL[1], 18], [T.leopard + 0.6, 79.5, 29.6, 30],
    [T.lion + 0.6, 35, -3, 50], [T.tiger + 0.6, 82, 23, 50], [T.survive, 82, 23, 46], [T.fin + 0.6, 20, 18, 330], [T.onemore, 20, 18, 320],
    [T.ago + 0.6, 85, 24, 80], [T.lionsr + 0.3, 30, 8, 130], [T.leosr + 0.6, 55, 12, 150], [T.wiped, 30, 15, 260],
    [T.climbing + 0.4, 85, 24, 80], [T.yes + 0.6, 80.07, 29.33, 30], [T.flips, 20, 15, 330], [END, 20, 15, 300],
  ],
  World,
  Screen,
  portals,
  sfx: [
    [T.what, "lib/impact_soft_3.mp3", 0.4, 0.8], [T.cougar - 0.2, "lib/whoosh_soft_1.mp3", 0.45, 1.3], [T.big, "lib/pop_soft_1.mp3", 0.35, 0.5], [T.noise, "lib/pop_soft_2.mp3", 0.35, 0.5],
    [T.fightb, "lib/pop_soft_3.mp3", 0.35, 0.5], [T.colorado - 0.6, "pin_plop.mp3", 0.4, 0.5], [T.leopard - 0.2, "lib/whoosh_soft_2.mp3", 0.45, 1.3], [T.lion - 0.2, "lib/whoosh_soft_3.mp3", 0.45, 1.3],
    [T.run, "lib/impact_soft_4.mp3", 0.45, 0.8], [T.still, "lib/tap_1.mp3", 0.35, 0.4], [T.face, "lib/tap_2.mp3", 0.35, 0.4], [T.back, "lib/tap_3.mp3", 0.35, 0.4], [T.never, "lib/tap_4.mp3", 0.35, 0.4],
    [T.tiger - 0.2, "lib/whoosh_soft_4.mp3", 0.45, 1.3], [T.shout, "lib/pop_soft_4.mp3", 0.35, 0.5], [T.second, "lib/pop_soft_5.mp3", 0.35, 0.5], [T.group, "lib/pop_soft_6.mp3", 0.35, 0.5],
    [T.friend, "lib/success_4.mp3", 0.3, 1.0], [T.fin, "lib/card_slide_3.mp3", 0.45, 1.8], [T.onemore, "lib/riser_soft_7.mp3", 0.4, 1.4], [T.n3200 - 0.3, "lib/glitch_soft_5.mp3", 0.4, 0.6],
    [T.us, "deep-cinematic-impact-1.mp3", 0.55, 2.2], [T.good, "lib/shimmer_1.mp3", 0.35, 1.6], [T.n5500 - 0.5, "lib/count_tick_3.mp3", 0.3, 1.2],
    [T.flips - 0.1, "lib/card_slide_5.mp3", 0.45, 1.8], [T.camera, "deep-cinematic-impact-2.mp3", 0.55, 2.2], [T.camera + 0.2, "universfield-camera-shutter-199580.mp3", 0.4, 0.6], [T.apex - 0.4, "lib/ui_select_2.mp3", 0.4, 0.5],
  ],
};

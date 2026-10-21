// keikoen01 · EL RESTO (108,25 s → final). Mismo mundo, misma cámara: la cocina de Keiko. Entre las ventanas del avatar,
// o el mundo 3D (la cámara viaja de la arrocera al cajón, a la puerta, a la olla…) o la foto real de Keiko HACIENDO la regla.
// Cada regla trae su tablilla EMA y sus piezas nuevas (piezas2.tsx), todo clavado a la voz con at("frase").
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, WorldProps, PT, screenOf, camSpeed, setKeys, win, DRAWER_OUT, bagTag, Key } from "./cocina3d";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import { BigNum, Flash, KK, P, Portal, Tag, at, e, ei, s } from "./lib";
import { Hanko, Pensado, Washi, ColdFog } from "./Min1";
import {
  Ema, Noren, SubBell, Rollo, Almidon, Plato10, Balanza, Bloque, Regla2, CorteFrio, Micro, MesNoSeis, RelojArroz, ArrozGrava, TresAguas,
  SalBlanda, EneroMayo, Cucharas, Receta, DiezDiez, Anillo30, CubosUso, BolsaGiro, Aliento, ManoCiega, HojaMarron, Obreritos, Pasos, Celulas,
  TresUsos, NieveJengibre, Ajos, Pizcas, Prohibidos, Marinada, Aire, Bandeja, Palma, Tableta, ZonaPeligro, NocheManana, Esponja, CintaFecha,
  Rotacion, Cupon, Bateria, Dial18, Helado, Domingo, Diagnostico, Soroban, Tarea, Pregunta, Proximo, Trabajo,
} from "./piezas2";

type V = [number, number, number];
const REEL = (AVAIL as { reel: boolean }).reel;
const CLIPS = new Set((AVAIL as { clips: string[] }).clips);
type Win = { ms: number; me: number; off: number };
const WIN: Win[] = ((AVW as { win: Win[] }).win).filter((w) => w.ms >= 110);
export const REST_START = Math.round((at("quick while") - 0.15) * 30) / 30;
const VOICE_END = at("taking care of you", 1000) + 1.6;
export const REST_END = Math.ceil((VOICE_END + 1.0) * 30) / 30;
const q = (ph: string, after: number) => at(ph, after);

// ---------------- anclas (una sola vez) ----------------
const R = [130.5, 163.9, 185.1, 213.6, 233.6, 285.2, 322.1, 347.9, 368.6, 427.5, 458.9, 494.9, 516.2, 538.4, 562.6, 585.7, 609.6, 660.6, 689.2, 718.7, 741.9, 762.2, 781.5, 808.3, 826.5]
  .map((x, i) => q(`rule number ${["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"][i] ?? String(i + 1)}`, x - 4));
const Q = {
  press: q("press subscribe", 108), bell: q("little bell", 108), oneq: q("one question", 108), back: q("back to the freezer", 115), written: q("written out", 118),
  letus: q("let us start", 124), withrice: q("with rice", 126),
  cooked: q("cooked rice is soft", 136), cools: q("cools slowly", 140), wrapit: q("if you wrap it", 147), softagain: q("soft again", 152), wrapwarm: q("wrap it warm", 157), ten: q("10 minutes", 157),
  grams: q("150 grams", 165), fist: q("size of your fist", 170), bigblock: q("one big block", 172), wasted: q("the rest is wasted", 175),
  cm2: q("2 centimeters", 189), round: q("a round ball", 193), flatfast: q("flat freezes fast", 203), twomin: q("two minutes", 205), lethim: q("i let him", 210),
  onemonth: q("one month not six", 213), notsix: q("not six", 213), socook: q("so i cook rice", 220), clock: q("clock of my freezer", 226),
  diff: q("difference between rice", 242), mother: q("my mother never", 246), three: q("three times", 257), idonot: q("i do not cook every", 262), smell: q("i smell her kitchen", 268),
  nowsoup: q("now the soup", 276),
  salt: q("so full of salt", 290), tastes: q("my miso tastes", 305), jan: q("in january", 305), ownc: q("keep it in its own", 308), wet: q("a wet spoon", 313), dry: q("dry spoon always", 318),
  spoonmiso: q("one spoon of miso", 325), wakame: q("dried wakame", 327), onion: q("chopped green onion", 327), flakes: q("dried fish flakes", 327), walnut: q("size of a walnut", 332),
  tenballs: q("ten balls", 336), atnight: q("at night one ball", 338), sec30: q("in 30 seconds", 342), miracle: q("is a miracle", 344),
  twosp: q("about two spoons", 353), stir: q("cube in the", 355), noodles: q("in the noodles", 357), smallsoup: q("for a small soup", 358),
  sitting: q("into a bag sitting", 372), laydown: q("lay it down", 376), book: q("like a book on", 379), roundc: q("round containers hide", 386), frosty: q("frosty stone", 387),
  northside: q("on the north side", 392), breath: q("your breath made clouds", 398), herfreezer: q("that was her freezer", 400), pickles: q("pickles in barrels", 402),
  fishhang: q("dried fish hanging", 403), misotub: q("miso in a big", 405), without: q("without looking", 417), dearveg: q("dear let me tell", 420),
  raw: q("freeze them raw", 433), leaf: q("inside every leaf", 439), stops: q("stops them", 445), coldw: q("then cold water", 447), squeeze: q("squeeze them hard", 448),
  cutthem: q("cut them", 449), smallp: q("small portions", 450),
  wipe: q("just wipe them", 463), iceforms: q("when ice forms", 468), walls: q("breaks the walls", 470), savory: q("deep savory", 473), frozenm: q("frozen mushrooms go", 477),
  wetsad: q("wet and sad", 481), sr: q("the soup the rice", 486), rn: q("the rice the noodles", 486), nood: q("the noodles", 488), threew: q("three weeks", 490),
  snow: q("grates like snow", 502), grate: q("i grate it straight", 507), clove: q("one clove at a time", 510),
  stick: q("does not stick", 523), everyb: q("every bowl of noodles", 526), everys: q("every soup", 527), everye: q("every egg", 528), personalone: q("for a person alone", 530),
  lettuce: q("lettuce", 541), cucumber: q("cucumber", 541), potato: q("raw potato", 541), eggs: q("eggs in the shell", 541), mayo: q("mayonnaise", 541),
  thingsfor: q("the freezer is for things", 552), backlife: q("come back to life", 552), nowprot: q("now the protein", 556),
  salmon: q("a piece of salmon", 571), saltgoes: q("the salt goes in", 580), marinade: q("becomes the marinade", 582),
  enemy: q("air is the enemy", 588), pushair: q("push the air out", 601), futon: q("folding a futon", 603),
  shecan: q("she can", 617), palm: q("palm of your hand", 620), swf: q("season wrap freeze", 624), onetray: q("that one tray", 626), eightd: q("eight dinners", 627), smallt: q("the small tray", 629),
  ground: q("and ground meat", 632), lines: q("press lines into it", 638), snapoff: q("snap off one square", 647), sixteen: q("sixteen little portions", 651),
  outside: q("the outside gets warm", 668), tonight: q("out tonight", 676), ready: q("it is ready", 680), neverhot: q("never hot water", 686),
  tofuturns: q("frozen tofu turns", 692), temples: q("mountain temples", 700), holes: q("the holes drink", 702), better: q("better than fresh", 708), dearnow: q("dear now let me show", 711),
  chickenmiso: q("chicken miso october", 725), lying: q("your memory is lying", 729), i76: q("i am 76", 730), littlecup: q("in a little cup", 734),
  takeold: q("i take the old food", 744), mydid: q("my mother did this", 750), newbottom: q("new rice at the bottom", 753),
  whatinside: q("what is inside", 767), howmany: q("how many", 768), drawone: q("draw one", 769), readdoor: q("i read the door", 772), coupon: q("any coupon", 776),
  fullstrong: q("a full freezer is a strong", 782), stonesun: q("like a stone holds", 788), power: q("if the power goes out", 792), twodays: q("about two days", 794),
  sowhen: q("so when my freezer", 799), blocks: q("blocks of ice", 803),
  minus: q("18 degrees celsius", 811), fahr: q("zero fahrenheit", 813), smallthermo: q("a small thermometer", 815), icecream: q("if ice cream", 819),
  sunday: q("sunday is my cooking day", 832), p7: q("seven packages of rice", 834), p10: q("ten miso balls", 836), p2: q("two portions of greens", 837), p1: q("one bag of soup", 839),
  p4: q("four pieces", 840), tuesday: q("on tuesday night", 845), notfrosty: q("not a frosty stone", 849), dinner: q("dinner", 852),
  trouble: q("honest troubleshooting", 852), ricehard: q("if your rice comes", 855), wrapsteam: q("next time wrap", 860), notyou: q("it is not you", 863), greensgrass: q("if your greens", 864),
  s30cold: q("seconds cold water", 871), fishspots: q("if your fish has", 874), dryedge: q("cut the dry edge", 880), lotice: q("a lot of ice", 884), runhand: q("run your hand", 889),
  arith: q("a little arithmetic", 893), villains: q("does not do villains", 896), threefour: q("three or four dollars", 908), year: q("that is more", 914) + 0.45, intotrash: q("into the trash quietly", 917),
  withrules: q("with these rules", 920), cookedtwo: q("than when i cooked", 926), onecook: q("one cooking day", 929),
  homework: q("here is your homework", 931), notchange: q("do not change 25", 934), changetwo: q("change two this week", 936), freezehot: q("freeze your rice hot", 938),
  putlist: q("put a little list", 940), onlythat: q("only that", 942), addmiso: q("add the miso balls", 944),
  comments: q("tell me in the comments", 946), honest: q("be honest", 951), yuzu: q("yuzu peel", 953), special: q("something special", 955),
  nextweek: q("next week i will show", 958), carrots: q("my carrots last", 964), towel: q("a paper towel", 969),
  winter: q("the first winter", 972), forone: q("how to cook for one", 976), bigboxes: q("in big boxes", 979), threwaway: q("threw all of it away", 982), cried: q("i cried in the kitchen", 985),
  notbook: q("not from a book", 988), trashcan: q("from that trash can", 989), motherno: q("my mother had no freezer", 992), foodis: q("food is", 995), ownwork: q("and your own work", 998),
  keepall: q("keeping all of that", 1001), takecare: q("take care of yourself", 1004), yourfreezer: q("take care of your freezer", 1005), carefor: q("taking care of you", 1006),
};

// ---------------- poses de la cámara ----------------
const DZ = PT.drawer[2] - 0.3 + DRAWER_OUT;
const STONE: V = [1.67, 0.27, DZ - 0.2];
type Pose = { p: V; l: V; fov: number; dr?: boolean };
const PO: Record<string, Pose> = {
  wide: { p: [0.9, 1.85, 3.1], l: [0.4, 0.8, -1.0], fov: 42 },
  wide2: { p: [0.6, 1.75, 3.1], l: [-0.1, 0.9, -0.7], fov: 42 },
  day: { p: [0.95, 1.75, 2.75], l: [0.3, 0.85, -0.9], fov: 41 },
  dr: { p: [1.6, 1.12, -0.42], l: [1.53, 0.14, DZ - 0.05], fov: 36, dr: true },
  drM: { p: [1.52, 1.15, -0.36], l: [1.52, 0.05, DZ + 0.02], fov: 40, dr: true },
  drS: { p: [1.5, 1.12, -0.15], l: STONE, fov: 34, dr: true },
  drHi: { p: [1.45, 1.45, 0.25], l: [1.55, 0.2, DZ], fov: 38, dr: true },
  door: { p: [1.5, 1.27, -0.3], l: [1.62, 1.19, -1.1], fov: 32 },
  fridge: { p: [1.0, 1.4, 0.6], l: [1.55, 0.8, -1.1], fov: 40 },
  stove: { p: [0.65, 1.62, -0.05], l: [0.3, 0.95, -1.5], fov: 40 },
  cooker: { p: [-1.55, 1.45, -0.6], l: [-2.0, 1.0, -1.5], fov: 34 },
  table: { p: [0.3, 1.5, 1.55], l: [-0.25, 0.76, 0.45], fov: 34 },
  rbox: { p: [-1.35, 1.55, 1.05], l: [-2.1, 1.12, 0.28], fov: 30 },
  win: { p: [-0.7, 1.55, -0.2], l: [-1.35, 1.7, -1.78], fov: 40 },
  trash: { p: [1.55, 0.95, -0.3], l: [1.02, 0.45, -1.02], fov: 34 },
};
const push = (o: Pose): Pose => ({ p: o.p.map((x, i) => x + (o.l[i] - x) * 0.07) as V, l: o.l, fov: o.fov - 2.5 });

// ---------------- la línea de tiempo del fondo: "w:<pose>" = mundo 3D · "k_…" = foto/clip real ----------------
const E0: [number, string][] = [
  [REST_START, "w:day"], [Q.back, "w:drHi"], [Q.letus, "w:cooker"],
  [Q.cooked - 2.7, "k_hotrice"], [Q.cooked - 0.2, "w:cooker"], [Q.softagain - 0.4, "w:table"],
  [Q.grams - 0.2, "k_fist"], [Q.bigblock - 0.1, "w:dr"],
  [R[2] - 0.1, "k_flatpress"], [Q.round - 0.1, "w:drM"], [Q.twomin - 2.8, "w:stove"],
  [R[3], "w:dr"], [Q.socook, "k_sunday7"], [Q.clock - 0.1, "w:drM"],
  [R[4] + 4.6, "k_spoonwater"], [Q.mother - 0.1, "w:rbox"], [Q.idonot - 0.2, "w:table"],
  [Q.nowsoup - 0.1, "w:stove"], [R[5], "w:drM"], [Q.salt + 3.2, "k_misotub"], [Q.wet - 3, "w:drM"],
  [R[6], "k_misoballs"], [Q.tenballs - 0.1, "w:drM"], [Q.atnight - 0.1, "k_misocup"],
  [R[7] - 1.9, "k_dashitray"], [Q.twosp - 4.8, "w:drM"], [R[8] - 4.9, "w:dr"], [Q.sitting - 0.1, "k_soupbag"], [Q.book + 1.1, "k_soupshelf"], [Q.roundc - 0.1, "w:drS"],
  [Q.northside, "w:win"], [Q.breath - 2.2, "k_northroom2"], [Q.without - 3.5, "w:dr"],
  [Q.dearveg - 0.1, "w:stove"], [R[9] + 4.5, "k_blanch"], [Q.leaf - 0.1, "w:stove"], [Q.coldw + 1.8, "k_squeeze"],
  [R[10] - 3.6, "w:drM"], [R[10] - 0.1, "k_mushroom"], [Q.iceforms - 0.1, "w:stove"], [Q.sr - 3.0, "w:table"],
  [R[11] + 7.4, "k_ginger"], [Q.grate - 0.2, "w:stove"],
  [R[12] + 4.4, "k_onion"], [Q.everyb - 0.2, "w:table"],
  [R[13] - 0.9, "k_nofreeze"], [Q.nowprot - 1.4, "w:wide"],
  [R[14], "w:dr"], [Q.salmon - 0.1, "k_salmon"],
  [R[15] + 2.2, "k_freezerburn"], [Q.pushair - 0.6, "k_wrap"],
  [R[16], "w:fridge"], [R[16] + 11.3, "k_chicken"], [Q.onetray - 2.2, "w:wide2"],
  [Q.ground + 3.9, "k_mince"], [R[17] - 4.9, "w:wide"], [Q.outside - 0.3, "w:stove"], [Q.tonight - 1.1, "k_fridgethaw"],
  [R[18] + 1.5, "k_tofu"], [Q.temples - 0.2, "k_templetofu"], [Q.holes + 4.3, "w:stove"],
  [Q.dearnow - 0.1, "w:fridge"], [R[19] + 3.7, "k_label"], [Q.littlecup + 4.2, "w:door"],
  [R[20] + 1.4, "k_frontback"], [Q.newbottom - 0.1, "w:rbox"],
  [R[21] - 4.1, "w:door"], [Q.readdoor - 0.1, "k_doorlist"],
  [R[22] + 6.2, "w:dr"], [Q.power - 0.1, "k_powerout"], [Q.sowhen + 4.0, "k_bottles"],
  [R[23], "k_thermo"], [Q.icecream - 0.1, "w:drM"],
  [R[24], "w:wide"], [Q.sunday - 0.2, "k_sundaycook"], [Q.tuesday - 0.3, "w:drHi"], [Q.dinner - 0.2, "k_tuesdaydinner"],
  [Q.trouble - 0.1, "w:wide2"], [Q.ricehard + 0.3, "w:cooker"], [Q.greensgrass + 4.2, "w:stove"], [Q.fishspots - 0.1, "k_dryfish"],
  [Q.lotice + 0.2, "k_iceseal"], [Q.runhand - 0.1, "k_handseal"],
  [Q.arith - 0.2, "k_arith"], [Q.threefour - 9.1, "k_trashbins"], [Q.withrules - 3.0, "w:wide"],
  [Q.homework + 2.6, "k_homework"], [Q.comments - 0.2, "w:drHi"], [Q.yuzu - 1.4, "k_yuzu"],
  [Q.nextweek - 0.1, "k_carrots"], [Q.winter - 2.9, "w:wide2"], [Q.winter + 0.2, "k_winter"], [Q.cried + 0.8, "w:trash"],
  [Q.motherno + 0.1, "w:rbox"], [Q.keepall + 1.8, "k_thanks"],
];
E0.forEach(([t, k], i) => { if (i && t <= E0[i - 1][0]) throw new Error(`Rest: fondo fuera de orden en ${k} (${t.toFixed(2)} <= ${E0[i - 1][0].toFixed(2)})`); });
const inWin = (t: number) => WIN.find((w) => t >= w.ms && t < w.me);
type Ent = { t: number; k: string; vis: number; end: number; pose?: Pose; prevWorld: boolean; i: number };
const ENT: Ent[] = E0.map(([t, k], i) => ({ t, k, i, vis: inWin(t)?.me ?? t, end: 0, prevWorld: false, pose: k.startsWith("w:") ? PO[k.slice(2)] : undefined }));
ENT.forEach((en, i) => {
  en.end = i + 1 < ENT.length ? ENT[i + 1].t : REST_END;
  const pv = ENT[i - 1];
  en.prevWorld = !!pv && !!pv.pose && !!en.pose && en.vis === en.t && !(pv.vis >= en.t);
});
const entAt = (t: number) => { let i = 0; while (i + 1 < ENT.length && ENT[i + 1].t <= t) i++; return ENT[i]; };

// cámara del resto: cada toma del mundo arranca en su pose y se acerca apenas; dos tomas seguidas del mundo = la cámara viaja
const KEYS: Key[] = [];
ENT.forEach((en, i) => {
  if (!en.pose) return;
  const pu = push(en.pose);
  if (i === 0) { KEYS.push({ t: Math.max(en.end, 109), p: pu.p, l: pu.l, fov: pu.fov }); return; }
  if (en.prevWorld) KEYS.push({ t: en.t + 1.4, p: en.pose.p, l: en.pose.l, fov: en.pose.fov, arc: 0.08 });
  else KEYS.push({ t: en.vis - 0.8, p: en.pose.p, l: en.pose.l, fov: en.pose.fov });
  KEYS.push({ t: en.end, p: pu.p, l: pu.l, fov: pu.fov });
});
setKeys(KEYS);

// ---------------- estado del mundo ----------------
const LIST = ["rice  ||||| ||", "miso balls  10", "greens  ||", "soup  |", "salmon  ||", "chicken  ||||"];
const worldAt = (t: number): WorldProps => {
  const en = entAt(t);
  const dr = en.pose?.dr ? (en.prevWorld ? ei(t, en.t + 0.4, en.t + 1.3) : 1) : 0;
  const night = Math.max(win(t, Q.tuesday - 1.2, Q.tuesday - 0.8) * (1 - win(t, Q.dinner - 0.5, Q.dinner - 0.3)), win(t, Q.winter - 3.6, Q.winter - 3.2) * (1 - win(t, Q.motherno - 0.4, Q.motherno)));
  return {
    t, night, drawer: dr, order: 1, stone: t > Q.roundc - 0.2 && t < Q.northside ? 1 : 0, frost: t > Q.roundc - 0.2 && t < Q.northside ? 0.7 : 0.25,
    miso: t > R[5] - 1 && t < R[7] ? 1 : 0, dashi: t > R[7] && t < R[8] ? 1 : 0,
    hlBag: t < Q.round ? 0 : t > Q.clock - 0.2 && t < R[4] ? 0 : t > R[14] && t < Q.salmon ? 5 : -1,
    lid: t > Q.cried && t < Q.motherno ? ei(t, Q.cried + 2.0, Q.cried + 2.6) : 0,
    list: 1, listLines: LIST, listCrossed: t > R[21] - 5 && t < R[22] ? (t > Q.readdoor - 1.5 ? 1 : 0) : 0,
    pot: en.k === "w:stove" ? 1 : 0.4 * (1 - night), cooker: en.k === "w:cooker" && t < 250 ? 1 : 0,
    ricebox: en.k === "w:rbox" ? 1 : 0, bowlOn: night > 0.5 && t < 900 ? 1 : en.k === "w:table" ? 1 : 0.6,
  };
};

const World: React.FC<{ t: number }> = ({ t }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const id = "mbr" + Math.round(t * 30);
  return <AbsoluteFill>
    <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
    <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><WorldRaw {...worldAt(t)} /></AbsoluteFill>
  </AbsoluteFill>;
};

const Avatar: React.FC<{ t: number }> = ({ t }) => <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
  {REEL ? WIN.map((w, i) => (
    <Sequence key={i} from={s(w.ms) - 10} durationInFrames={s(w.me - w.ms) + 12} layout="none">
      <AbsoluteFill style={{ opacity: t >= w.ms - 0.02 && t < w.me ? 1 : 0 }}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
    </Sequence>)) : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
</AbsoluteFill>;

const Clip: React.FC<{ k: string; t: number; a: number; i: number }> = ({ k, t, a, i }) => {
  const z = i % 2 ? [1.1, 1.03] : [1.03, 1.1], ox = (i % 3 - 1) * 40;
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + 8);
  const inner = CLIPS.has(k)
    ? <Sequence from={s(a)} layout="none"><OffthreadVideo src={staticFile(P + k + ".mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence>
    : <Img src={staticFile(P + "img_" + k + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return <AbsoluteFill style={{ overflow: "hidden" }}><AbsoluteFill style={{ transform: `scale(${sc}) translateX(${ox * e(t, a, a + 8)}px)` }}>{inner}</AbsoluteFill></AbsoluteFill>;
};
const bg = (en: Ent, t: number) => en.pose ? <World t={t} /> : <Clip k={en.k} t={t} a={en.vis} i={en.i} />;

// el fondo en el segundo t (avatar → portal; foto ↔ foto se deslizan; mundo ↔ foto se funden; mundo → mundo la cámara viaja)
const Fondo: React.FC<{ t: number }> = ({ t }) => {
  const w = inWin(t);
  if (w) {
    const r = ei(t, w.me - 0.6, w.me);
    return <><Avatar t={t} />{r > 0 && <Portal x={1500} y={520} r={r}>{bg(entAt(w.me), t)}</Portal>}</>;
  }
  const en = entAt(t), pv = ENT[en.i - 1];
  const fresh = pv && en.vis === en.t && t < en.t + 0.5 && !(inWin(en.t - 0.01));
  if (!fresh || en.prevWorld) return <><Avatar t={-1} />{bg(en, t)}</>;
  if (!pv.pose && !en.pose) {
    const sl = ei(t, en.t, en.t + 0.5), mb = Math.sin(sl * Math.PI) * 34, dir = en.i % 2 ? 1 : -1;
    return <><Avatar t={-1} />
      <AbsoluteFill style={{ transform: `translateX(${-dir * sl * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>{bg(pv, t)}</AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${dir * (1 - sl) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>{bg(en, t)}</AbsoluteFill></>;
  }
  const f = e(t, en.t, en.t + 0.45);
  return <><Avatar t={-1} />{bg(pv, t)}<AbsoluteFill style={{ opacity: f }}>{bg(en, t)}</AbsoluteFill></>;
};

// ======================= EL RESTO =======================
const TITLES = ["Freeze rice hot", "One bowl, one pack", "Flat, not round", "One month, not six", "A spoon of water", "Miso in the freezer", "Miso balls for one",
  "Dashi ice cubes", "Stand it, lay it", "Boil greens 30 s", "Mushrooms go raw", "Ginger lives frozen", "Cut all the onion", "Never freeze these", "Season it first",
  "One wrap, no air", "Buy big, cut today", "Thaw in the fridge", "Frozen tofu", "Name and date", "Old food in front", "A list on the door", "Keep it full", "Check the cold", "Cook once"];

export const Rest: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const L: React.ReactNode[] = [<Fondo key="bg" t={t} />];
  const add = (...n: React.ReactNode[]) => L.push(...n);

  // CTA: suscribirse + campanita + "una pregunta al final"; las 25 reglas abajo; parte 1 · ARROZ
  add(<SubBell key="sb" t={t} at={Q.press - 0.7} bell={Q.bell} q={Q.oneq} out={Q.back - 0.3} />);
  add(<Rollo key="ro" t={t} at={Q.written - 0.2} out={Q.letus + 0.6} />);
  add(<Noren key="n1" t={t} at={Q.withrice - 0.5} out={R[0] + 0.2} text="PART ONE RICE" sub="rules 1 – 5" />);
  R.forEach((r, i) => add(<Ema key={"ema" + i} t={t} at={r} n={i + 1} title={TITLES[i]} next={i < 24 ? R[i + 1] - 0.1 : Q.trouble - 0.1} />));

  // 1 · arroz caliente
  add(<Almidon key="al" t={t} at={Q.cooked} cool={Q.cools} wrap={Q.wrapit} soft={Q.softagain} out={Q.wrapwarm - 0.2} x={1520} />);
  add(<Plato10 key="p10" t={t} at={Q.ten - 0.4} out={R[1] - 0.3} />);
  // 2 · un cuenco, un paquete
  add(<Balanza key="ba" t={t} at={Q.grams} fist={Q.fist} out={Q.bigblock - 0.2} x={1560} y={330} />);
  add(<Bloque key="bl" t={t} at={Q.bigblock} waste={Q.wasted} out={R[2] - 4.6} />);
  // 3 · plano
  add(<Regla2 key="r2" t={t} at={Q.cm2} out={Q.round - 0.2} />);
  add(<CorteFrio key="cf" t={t} at={Q.round} flat={Q.flatfast} out={Q.twomin - 0.4} x={1540} />);
  add(<Micro key="mi" t={t} at={Q.twomin - 0.2} out={Q.lethim - 0.2} />);
  add(<Pensado key="lh" t={t} at={Q.lethim} out={R[3] - 0.1} x={1340} y={820} text="I let him." size={110} />);
  // 4 · un mes
  add(<MesNoSeis key="ms" t={t} at={Q.onemonth} six={Q.notsix} out={Q.socook - 0.2} x={1580} />);
  add(<RelojArroz key="ra" t={t} at={Q.clock} out={R[4] - 0.2} />);
  // 5 · una cuchara de agua
  add(<ArrozGrava key="ag" t={t} at={Q.diff} out={Q.mother - 0.2} />);
  add(<Pensado key="mm" t={t} at={Q.mother + 0.2} out={Q.three - 0.3} x={1480} y={250} text="my mother's kitchen…" size={84} />);
  add(<TresAguas key="ta" t={t} at={Q.three} out={Q.idonot - 0.2} />);
  add(<Pensado key="sk" t={t} at={Q.smell} out={Q.nowsoup - 0.4} x={1560} y={800} text="I smell her kitchen." size={88} />);

  // parte 2 · SOPA
  add(<Noren key="n2" t={t} at={Q.nowsoup} out={R[5] + 0.2} text="PART TWO SOUP" sub="rules 6 – 9" />);
  add(<SalBlanda key="sa" t={t} at={Q.salt} out={Q.tastes - 0.2} x={1560} />);
  add(<EneroMayo key="em" t={t} at={Q.tastes} may={Q.jan - 0.1} out={Q.wet - 0.3} x={1580} />);
  add(<Cucharas key="cu" t={t} at={Q.wet} dry={Q.dry} out={R[6] - 0.2} />);
  add(<Receta key="re" t={t} ats={[Q.spoonmiso, Q.wakame, Q.onion, Q.flakes]} ball={Q.walnut} out={Q.tenballs - 0.2} x={1560} />);
  add(<DiezDiez key="dd" t={t} at={Q.tenballs} out={Q.atnight - 0.2} />);
  add(<Anillo30 key="a30" t={t} at={Q.sec30 - 0.2} out={R[7] - 0.3} label="miso soup" x={1580} col="#e8b46a" />);
  add(<Pensado key="mir" t={t} at={Q.miracle} out={R[7] - 0.2} x={1560} y={850} text="a little miracle." size={80} />);
  add(<CubosUso key="cub" t={t} ats={[Q.twosp - 0.4, Q.stir, Q.noodles, Q.smallsoup]} out={R[8] - 0.3} />);
  add(<BolsaGiro key="bg9" t={t} ats={[Q.sitting, Q.laydown, Q.book]} out={Q.roundc - 0.2} x={1540} />);
  { const p = screenOf(t, STONE); add(<Tag key="fs" t={t} at={Q.frosty} x={p.x} y={p.y} dx={-320} dy={-180} text="THE FROSTY STONE" col={KK.frost} out={Q.northside - 0.3} size={52} />); }
  // el cuarto del norte
  add(<Aliento key="ali" t={t} at={Q.breath} out={Q.herfreezer + 0.6} x={1250} y={420} />);
  add(<Pasos key="nr" t={t} items={[["pickles", Q.pickles], ["dried fish", Q.fishhang], ["miso", Q.misotub]]} out={Q.without - 3.7} y={820} />);
  add(<ManoCiega key="mc" t={t} at={Q.without} out={Q.dearveg - 0.2} />);

  // parte 3 · VERDURAS
  add(<Noren key="n3" t={t} at={Q.dearveg} out={R[9] + 0.2} text="PART THREE GREENS" sub="rules 10 – 14" />);
  add(<HojaMarron key="hm" t={t} at={Q.raw} out={Q.leaf - 0.2} />);
  add(<Obreritos key="ob" t={t} at={Q.leaf} stop={Q.stops} out={Q.coldw - 0.2} x={1540} />);
  add(<Pasos key="ps" t={t} items={[["cold water", Q.coldw], ["squeeze hard", Q.squeeze], ["cut", Q.cutthem], ["small portions", Q.smallp]]} out={R[10] - 3.8} />);
  add(<Pensado key="wp" t={t} at={Q.wipe} out={Q.iceforms - 0.3} x={1580} y={820} text="wipe, don't wash" size={78} />);
  add(<Celulas key="ce" t={t} at={Q.iceforms} crack={Q.walls} taste={Q.savory} out={Q.frozenm - 0.2} x={1540} />);
  add(<Pensado key="ws" t={t} at={Q.wetsad} out={Q.sr - 3.1} x={1560} y={820} text="…or wet and sad." size={84} />);
  add(<TresUsos key="tu" t={t} ats={[Q.sr, Q.rn, Q.nood + 0.3]} out={Q.threew + 1.2} labels={["soup", "rice", "noodles"]} />);
  add(<BigNum key="3w" t={t} at={Q.threew} text="3 WEEKS" size={130} x={1400} y={300} col={KK.hinoki} edge="#4a2a10" sub="ONE BAG" out={R[11] - 0.2} />);
  add(<NieveJengibre key="nj" t={t} at={Q.snow - 0.2} out={Q.grate + 1.8} />);
  add(<Ajos key="aj" t={t} at={Q.clove} out={R[12] - 0.4} />);
  add(<Pensado key="st" t={t} at={Q.stick} out={Q.everyb - 0.3} x={1500} y={260} text="dry = no sticking" size={84} />);
  add(<Pizcas key="pz" t={t} ats={[Q.everyb, Q.everys, Q.everye]} out={Q.personalone + 1.0} />);
  add(<Prohibidos key="pr" t={t} items={[["lettuce", Q.lettuce], ["cucumber", Q.cucumber], ["raw potato", Q.potato], ["eggs in the shell", Q.eggs], ["mayonnaise", Q.mayo]]} out={Q.thingsfor - 0.3} />);
  add(<Pensado key="bl2" t={t} at={Q.backlife - 0.4} out={Q.nowprot - 0.3} x={1560} y={300} text="things that come back to life" size={66} />);

  // parte 4 · PROTEÍNA
  add(<Noren key="n4" t={t} at={Q.nowprot} out={R[14] + 0.2} text="PART FOUR PROTEIN" sub="rules 15 – 19" />);
  add(<Marinada key="mr" t={t} at={Q.salmon} salt={Q.saltgoes} out={R[15] - 0.3} />);
  add(<Aire key="ai" t={t} at={Q.enemy} push={Q.pushair} out={Q.futon + 1.4} x={1560} />);
  add(<Pensado key="fu" t={t} at={Q.futon} out={R[16] - 0.2} x={1500} y={850} text="like folding a futon" size={80} />);
  add(<Pensado key="sc" t={t} at={Q.shecan} out={Q.palm - 1.0} x={1600} y={420} text="She can." size={130} col={KK.hinoki} />);
  add(<Palma key="pa" t={t} at={Q.palm} out={Q.onetray - 0.3} />);
  add(<Bandeja key="bj" t={t} at={Q.swf} cut={Q.swf + 0.6} cmp={Q.eightd} out={Q.ground - 0.2} />);
  add(<Tableta key="tb" t={t} at={Q.lines} snap={Q.snapoff} out={R[17] - 0.3} x={1560} />);
  add(<ZonaPeligro key="zp" t={t} at={Q.outside} out={Q.tonight - 1.3} />);
  add(<NocheManana key="nm" t={t} at={Q.tonight} ready={Q.ready} out={Q.neverhot - 0.3} />);
  add(<Pensado key="nh" t={t} at={Q.neverhot - 0.3} out={R[18] - 0.2} x={1520} y={830} text="cold water. never hot." size={80} />);
  add(<Esponja key="es" t={t} at={Q.tofuturns} drink={Q.holes} out={Q.better - 0.3} x={1560} />);
  add(<Pensado key="bf" t={t} at={Q.better} out={Q.dearnow - 0.2} x={1500} y={830} text="sometimes better than fresh" size={78} />);

  // parte 5 · EL ORDEN
  add(<Noren key="n5" t={t} at={Q.dearnow} out={R[19] + 0.2} text="PART FIVE ORDER" sub="rules 20 – 25" />);
  add(<CintaFecha key="ci" t={t} at={Q.chickenmiso - 0.3} lie={Q.lying} out={Q.i76 + 1.4} x={1500} y={190} />);
  add(<Pensado key="76" t={t} at={Q.i76} out={Q.littlecup - 0.3} x={1560} y={820} text="I am 76. I know." size={90} />);
  { const p = screenOf(t, PT.door); add(<Tag key="cup" t={t} at={Q.littlecup + 4.4} x={p.x - 120} y={p.y + 160} dx={-300} dy={60} text="TAPE + MARKER" sub="RIGHT HERE" col={KK.hinoki} out={R[20] - 0.2} size={46} />); }
  add(<Rotacion key="rt" t={t} at={Q.takeold} out={Q.mydid - 0.2} />);
  add(<Pensado key="nb" t={t} at={Q.newbottom} out={R[21] - 4.3} x={1580} y={820} text="new rice below, old on top" size={70} />);
  { const p = screenOf(t, [PT.door[0] + 0.08, 1.22, PT.door[2] - 0.01]);
    add(<Tag key="wi" t={t} at={Math.max(Q.whatinside, R[21] - 3.6)} x={p.x} y={p.y - 60} dx={-380} dy={-120} text="WHAT IS INSIDE?" col={KK.cream} out={Q.readdoor - 0.3} size={50} />);
    add(<Tag key="hw" t={t} at={Math.max(Q.howmany, R[21] - 3.0)} x={p.x} y={p.y + 40} dx={-380} dy={140} text="HOW MANY?" col={KK.cream} out={Q.readdoor - 0.3} size={50} />); }
  add(<Cupon key="cp" t={t} at={Q.coupon - 1.4} tear={Q.coupon + 0.2} out={R[22] - 0.2} />);
  add(<Pensado key="ss" t={t} at={Q.stonesun - 0.2} out={Q.power - 0.3} x={1560} y={300} text="like a stone holds the sun" size={72} />);
  add(<Bateria key="bt" t={t} at={Q.power} power={Q.twodays} out={Q.sowhen - 0.2} x={1560} />);
  add(<Pensado key="bo" t={t} at={Q.blocks - 0.3} out={R[23] - 0.2} x={1500} y={260} text="bottles of water = ice blocks" size={70} />);
  add(<Dial18 key="d18" t={t} at={Q.minus - 0.6} f={Q.fahr} out={Q.icecream - 0.4} x={1560} />);
  add(<Helado key="he" t={t} at={Q.icecream} out={R[24] - 0.3} />);
  add(<Domingo key="do" t={t} items={[["7", "rice", Q.p7], ["10", "miso balls", Q.p10], ["2", "greens", Q.p2], ["1", "soup", Q.p1], ["4", "fish / chicken", Q.p4]]} out={Q.tuesday - 0.4} x={1560} />);
  add(<Pensado key="nfs" t={t} at={Q.notfrosty} out={Q.dinner - 0.2} x={1560} y={300} text="Not a frosty stone." size={84} />);
  add(<BigNum key="din" t={t} at={Q.dinner} text="DINNER." size={170} x={1400} y={300} col={KK.hinoki} edge="#4a2a10" out={Q.trouble - 0.2} />);

  // los problemas, honestos
  add(<Noren key="n6" t={t} at={Q.trouble} out={Q.ricehard + 0.2} text="WHAT WENT WRONG" sub="honest troubleshooting" />);
  add(<Diagnostico key="dg1" t={t} at={Q.ricehard + 0.3} flip={Q.wrapsteam} out={Q.greensgrass - 0.3} n={1} prob="Rice comes out hard" fix="Frozen cold, not hot. Next time: wrap it steaming. It is not you." x={1540} />);
  add(<Diagnostico key="dg2" t={t} at={Q.greensgrass} flip={Q.s30cold - 0.4} out={Q.fishspots - 0.3} n={2} prob="Greens taste like grass" fix="Water wasn't boiling yet. 30 s, cold water, squeeze, straight in." x={1560} />);
  add(<Diagnostico key="dg3" t={t} at={Q.fishspots} flip={Q.dryedge} out={Q.lotice - 0.3} n={3} prob="White dry spots on fish" fix="Air in the wrap. Safe! Cut the dry edge, cook it in a soup." x={1560} />);
  add(<Diagnostico key="dg4" t={t} at={Q.lotice} flip={Q.runhand} out={Q.arith - 0.3} n={4} prob="Lots of ice on the walls" fix="Door open too long, or a tired seal. Feel for cold air." x={1540} />);
  // la cuenta, la tarea, la pregunta
  add(<Pensado key="vi" t={t} at={Q.villains} out={Q.threefour - 9.3} x={1580} y={300} text="no villains. arithmetic." size={74} />);
  add(<Soroban key="so" t={t} at={Q.threefour} year={Q.year} out={Q.withrules - 0.3} />);
  add(<Pensado key="it" t={t} at={Q.intotrash} out={Q.withrules - 0.3} x={1560} y={850} text="…quietly, so nobody hears." size={70} />);
  add(<Pensado key="ct" t={t} at={Q.cookedtwo - 0.3} out={Q.onecook - 0.3} x={1500} y={300} text="less than when I cooked for two" size={70} />);
  add(<BigNum key="1s" t={t} at={Q.onecook} text="1 SUNDAY = 7 DINNERS" size={96} x={960} y={860} col={KK.cream} edge="#3a2210" out={Q.homework - 0.2} />);
  add(<Tarea key="tr" t={t} ats={[Q.homework, Q.freezehot, Q.putlist]} out={Q.comments - 0.3} x={1540} />);
  add(<Pregunta key="pq" t={t} at={Q.comments} out={Q.yuzu - 1.5} x={1540} />);
  add(<Washi key="yz" t={t} at={[Q.yuzu - 0.3, Q.special]} out={Q.nextweek - 0.3} x={1500} y={300} rot={3} w={520} lines={["Mine: yuzu peel,", "saving it for something special."]} />);
  add(<Proximo key="nx" t={t} at={Q.nextweek} towel={Q.towel} out={Q.winter - 3.1} />);
  // el invierno, la madre, el cierre
  add(<Pensado key="w1" t={t} at={Q.forone} out={Q.bigboxes - 0.2} x={1560} y={850} text="I did not know how to cook for one." size={62} />);
  add(<Pensado key="w2" t={t} at={Q.notbook} out={Q.motherno - 0.3} x={1420} y={250} text="not from a book…" size={84} />);
  add(<Pensado key="w3" t={t} at={Q.trashcan} out={Q.motherno - 0.3} x={1460} y={380} text="from that trash can." size={84} col={KK.hinoki} />);
  add(<Trabajo key="tj" t={t} ats={[Q.foodis + 1.2, Q.ownwork - 1.4, Q.ownwork + 0.3]} out={Q.keepall + 1.5} y={800} />);
  add(<Hanko key="hk2" t={t} at={Q.yourfreezer} x={1440} y={460} l1="TAKE CARE OF" l2="YOUR FREEZER" />);
  add(<Pensado key="fin" t={t} at={Q.carefor} out={REST_END + 5} x={1440} y={760} text="It is taking care of you." size={76} />);

  add(<ColdFog key="cfa" t={t} mid={Q.back} w={0.5} />, <ColdFog key="cfb" t={t} mid={Q.breath - 2.2} w={0.45} />, <ColdFog key="cfc" t={t} mid={Q.tuesday - 0.3} w={0.45} />);
  add(<Flash key="fla" t={t} at={Q.motherno + 0.1} col="#ffe6b8" peak={0.4} w={0.35} />);
  const fade = e(t, REST_END - 1.2, REST_END - 0.1);
  if (fade > 0) add(<AbsoluteFill key="fd" style={{ background: "#000", opacity: fade }} />);
  return <AbsoluteFill style={{ background: "#07090d" }}>{L}</AbsoluteFill>;
};

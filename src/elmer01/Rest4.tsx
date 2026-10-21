// elmer01 · RESTO tramo 4 (759 → final): la prueba de 300 lb (bolsas en el mundo) → sentado en la esquina → plegado a 4" de la pared →
// LA CUENTA en la guía (CTA 3, pág. 31) → $23 contra $420 → roble vs aglomerado → los 6 errores → las herramientas → el abuelo, el granero
// y la frase del clavo y la clavija → $23 / 5 segundos / tus dos manos → comentarios → el pestillo de la semana que viene → cierre.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Key, BENCH, PT } from "./garage3d";
import { at, Pic, scr } from "./core";
import { COL, FONT, e, ei, extrude, spr } from "./lib";
import { BigWord, Polaroid } from "./Rest1";
import { Plank } from "./Rest1av";
import { fold3 } from "./Rest3";
import { Block } from "./Min1";

export const T4 = {
  test: at("all right the test", 758), sixB: at("six bags of sand", 763), lb50: at("50 pounds each", 765), lb300: at("300 pounds", 766), oneAt: at("one at a time", 768),
  bag1: at("the first bag", 771), nothing1: at("bag nothing", 772), nothing2: at("second nothing", 773), bag6: at("the sixth bag", 775), watching: at("watching that leg", 776), hear: at("hear something give", 778), creak: at("not a creak", 780), bow: at("didn't bow", 781), s16: at("a sixteenth of an inch", 781),
  sandOff: at("took the sand off", 783), sat: at("i sat on the corner", 784), worst: at("the worst spot", 787), bounced: at("and bounced", 788), nothing3: at("bounced nothing", 788),
  foldUp: at("i folded it up", 789), in4: at("four inches from", 791), truck: at("my truck pulls in", 792), hand: at("good hands width", 795),
  addUp: at("let's add it up", 796), c1: at("pallets free", 797), c2: at("glue $6", 799), c3: at("hinges $12", 800), c4: at("lag screws $3", 802), c5: at("call it $2", 807), c23: at("$2 $23", 807),
  store: at("the store one", 809), s389: at("was $389", 810), tax: at("with tax", 812), s420: at("over $420", 812), saved: at("$400 saved", 813), oak: at("solid oak", 816), particle: at("theirs is particle board", 817),
  damp: at("a damp garage", 823), tenn: at("here in tennessee", 825), summers: at("three summers", 828), swell: at("start to swell", 830), dock: at("loading dock", 833), years5: at("five years", 834), weather: at("all about weather", 835), surprise: at("not going to surprise", 838),
  mist: at("give you the mistakes", 839), m1: at("number one", 843), stamp: at("check that stamp", 845), ht: at("ht is good", 847), mb: at("mb walk away", 849), m2: at("number two", 850), pry: at("prying the boards", 851), split: at("split half of them", 853), cutN: at("cut the nails instead", 854),
  m3: at("number three", 855), magnet: at("skipping the magnet", 856), blade: at("bought a new blade", 859), m4: at("number four", 860), tall: at("too tall", 862), wrist: at("wrist height", 863), m5: at("number five", 865), studs: at("missing the studs", 865), anchors: at("drywall anchors", 867), week: at("about a week", 868),
  comes: at("comes off the wall", 872), m6: at("number six", 873), straight: at("straight through together", 876), nothingP: at("does nothing", 879), offset: at("offset that tenon hole", 880), shoulder: at("toward the shoulder", 882), trick: at("the whole trick", 884),
  years50: at("in 50 years", 886), shop: at("a shop full of tools", 888), lasts: at("something that lasts", 889), circ: at("a circular saw", 892), recip: at("a reciprocating saw", 893), drill: at("a drill", 895), hatchet: at("a hatchet", 896), hammer: at("and a hammer", 896),
  grand: at("my granddaddy built", 896), barn: at("a whole barn", 898), standing: at("still standing", 900), sevier: at("sevier county", 901), nine: at("nine years old", 903), beam: at("end of a beam", 904), drovePeg: at("drove a peg", 906),
  asked: at("i asked him", 907), nails: at("use nails", 908), son: at("son a nail", 911), stuck: at("because it's stuck", 912), peg: at("a peg holds", 913), wants: at("wood wants to be there", 914),
  understand: at("didn't understand it", 916), doNow: at("i do now", 917), same: at("the same one", 920), roofs: at("three roofs", 924), tornado: at("two tornadoes", 925),
  done: at("when you're done", 926), cost23: at("cost you $23", 928), folds: at("folds away", 929), sec5: at("five seconds", 930), hands: at("own two hands", 932), remember: at("going to remember", 935), afternoon: at("the afternoon you made it", 935),
  build: at("if you build one", 937), comments: at("down in the comments", 939), howTall: at("how tall did you make", 941), subBell: at("subscribe and hit the bell", 938), next: at("next week", 947), gate: at("garden gate latch", 948), scrap: at("scrap wood", 950),
  noMetal: at("no metal at all", 951), locksSelf: at("locks itself", 952), engineers: at("some engineers", 954), wouldnt: at("wouldn't work", 956), come: at("come see", 957), elmer: at("i'm elmer", 957), thanks: at("thanks for spending", 958), go: at("now go find", 960), pallets: at("some pallets", 961),
  oilOn: at("deep honey color", 731),
};
const T = T4;
const B = BENCH;

// la tapa en todo el resto: abierta → (tramo 3: sube, baja, se pliega mal, botón) → plegada a 4" → baja para la cuenta → plegada en "folds away"
export const foldAll = (t: number): { fold: number; leg: number } => {
  const d3 = fold3(t);
  if (d3) return d3;
  const up = ei(t, T.foldUp, T.foldUp + 1.2), dn = ei(t, T.addUp - 1.0, T.addUp - 0.1), up2 = ei(t, T.folds - 0.2, T.folds + 1.0);
  const lup = ei(t, T.foldUp - 0.2, T.foldUp + 0.5), ldn = ei(t, T.addUp - 0.7, T.addUp + 0.1), lup2 = ei(t, T.folds - 0.4, T.folds + 0.3);
  return { fold: Math.max(0, Math.min(1, 1 - up + dn - up2)), leg: Math.max(0, Math.min(1, 1 - lup + ldn - lup2)) };
};

export const K4: Key[] = [
  // las bolsas sobre el banco (773,5 → 785) — de costado, a la altura de la pata
  { t: 773.4, p: [-2.8, 5.0, 8.4], l: [-8.8, 2.6, 2.0], fov: 42 },
  { t: T.watching, p: [-4.4, 2.6, 6.2], l: [-8.2, 1.6, 2.0], fov: 38, arc: 0.3 },
  { t: T.bow - 0.3, p: [-5.6, 3.2, 5.0], l: [-8.6, 2.9, 2.0], fov: 40 },
  { t: 785.0, p: [-5.4, 3.4, 5.4], l: [-8.6, 2.9, 2.0], fov: 40 },
  // plegado a la pared → el espejo de la camioneta → la tapa baja y la guía en la pág. 31 (789,6 → 819,3)
  { t: 789.6, p: [-1.8, 5.2, 9.4], l: [-9.0, 3.4, 2.0], fov: 44 },
  { t: T.in4 + 0.4, p: [-6.8, 5.8, 9.6], l: [-9.6, 4.0, 2.0], fov: 34, arc: 0.3 },
  { t: T.truck + 0.3, p: [-5.6, 6.4, 6.8], l: [-1.0, 3.8, -2.4], fov: 40, arc: 0.4 },
  { t: T.hand, p: [-4.0, 5.6, 3.2], l: [-1.0, 3.9, -2.6], fov: 30 },
  { t: T.addUp - 0.6, p: [-3.2, 6.4, 7.6], l: [-8.8, 2.8, 2.0], fov: 40 },
  { t: T.c1 - 0.2, p: [-2.6, 6.2, 8.6], l: [-8.6, 2.6, 2.6], fov: 40 },
  { t: 802.2, p: [-2.9, 6.0, 8.0], l: [-8.6, 2.6, 2.6], fov: 39 },
  { t: 807.1, p: [-3.0, 5.9, 7.8], l: [-8.6, 2.6, 2.6], fov: 38 },
  { t: 809.6, p: [-3.3, 5.7, 7.4], l: [-8.6, 2.6, 2.6], fov: 36 },
  // la pila de pallets afuera: 5 años al sol (831,6 → 836,5)
  { t: 831.6, p: [12.4, 4.0, 22.6], l: [6.5, 1.0, 15.5], fov: 36 },
  { t: 836.6, p: [10.6, 3.2, 20.4], l: [6.5, 1.0, 15.5], fov: 34 },
  // las herramientas que hacen falta (887,9 → 897,3): el banco abierto
  { t: 887.9, p: [-2.4, 6.6, 9.2], l: [-8.9, 2.6, 2.0], fov: 42 },
  { t: 897.3, p: [-2.9, 6.0, 8.0], l: [-8.9, 2.6, 2.0], fov: 40 },
  // $23 · 5 segundos · tus manos (926,4 → 933,7) y comentarios (937,3 → 944,7)
  { t: 926.4, p: [-1.4, 5.4, 10.2], l: [-9.0, 3.2, 2.0], fov: 44 },
  { t: 933.7, p: [-1.8, 5.6, 9.2], l: [-9.2, 3.8, 2.0], fov: 42 },
  { t: 937.3, p: [-1.0, 4.8, 11.0], l: [-9.0, 3.6, 2.0], fov: 46 },
  { t: 944.8, p: [-0.6, 4.6, 12.0], l: [-9.0, 3.6, 2.0], fov: 48 },
];

// ================= PIEZAS NUEVAS =================
const Dark: React.FC<{ o: number }> = ({ o }) => (o > 0.005 ? <AbsoluteFill style={{ background: `rgba(8,6,4,${o})` }} /> : null);
const Fade: React.FC<{ t: number; a: number; b: number; children: React.ReactNode }> = ({ t, a, b, children }) => <AbsoluteFill style={{ opacity: e(t, a, b) }}>{children}</AbsoluteFill>;
const Grad: React.FC<{ c1: string; c2: string }> = ({ c1, c2 }) => <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 42%, ${c1}, ${c2})` }} />;
const sc = (t: number, a: number) => Math.min(1.08, spr(t, a));

// 6 bolsas × 50 lb = 300 lb (las bolsas caen en una pila, el total sube)
const WeightMath: React.FC<{ t: number; at: number; each: number; total: number; out: number; x: number; y: number }> = ({ t, at, each, total, out, x, y }) => {
  const o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const tot = Math.round(300 * ei(t, total - 0.3, total + 0.5));
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, fontFamily: FONT }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 150px)", gap: 12, transform: "rotate(-3deg)" }}>
        {Array.from({ length: 6 }, (_, i) => { const k = Math.min(1, spr(t, at + i * 0.15, 1.2)); return <div key={i} style={{ height: 100, borderRadius: 30, transform: `translateY(${(1 - k) * -400}px)`, background: "linear-gradient(180deg,#e9dcc0,#b8a27a)", boxShadow: "0 14px 22px rgba(0,0,0,.55), inset 0 -10px 0 rgba(0,0,0,.12)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 32, color: "#5a4a30" }}>{t > each ? "50 LB" : "SAND"}</div>; })}
      </div>
      {t > total - 0.3 && <div style={{ marginTop: 30, fontWeight: 900, fontSize: 150, color: COL.amber, textShadow: extrude(9, "rgba(0,0,0,.6)"), lineHeight: 1 }}>{tot} LB</div>}
    </div>
  );
};
// anillos de vigilancia sobre la pata y las clavijas (proyectados del mundo)
const Watch: React.FC<{ t: number; at: number; out: number; K: Key[] }> = ({ t, at, out, K }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const pts: [number, number, number][] = [PT.benchLeg, [B.x0 + B.d - 0.2, B.y - 0.25, B.z - 1.8], [B.x0 + B.d - 0.2, B.y - 0.25, B.z + 1.8]];
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      {pts.map((q, i) => { const s = scr(K, t, q), r = i ? 50 : 90; return <div key={i} style={{ position: "absolute", left: s.x - r, top: s.y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", border: `6px dashed ${COL.ice}`, transform: `rotate(${t * 40}deg)` }} />; })}
    </div>
  );
};
// osciloscopio: el oído atento… y la línea plana (ni un crujido)
const QuietWave: React.FC<{ t: number; at: number; flat: number; out: number; x: number; y: number }> = ({ t, at, flat, out, x, y }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const amp = 30 * (1 - e(t, flat - 0.6, flat));
  const d = Array.from({ length: 81 }, (_, i) => `${i ? "L" : "M"} ${i * 8} ${70 + Math.sin(i * 0.7 + t * 12) * amp * Math.sin(i * 0.11 + 0.3)}`).join(" ");
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, padding: "20px 26px", borderRadius: 20, background: "rgba(6,14,12,.86)", boxShadow: "0 0 0 4px rgba(36,194,122,.6), 0 30px 50px rgba(0,0,0,.6)" }}>
      <svg width={640} height={140}><path d={d} fill="none" stroke="#24c27a" strokeWidth={5} style={{ filter: "drop-shadow(0 0 8px #24c27a)" }} /></svg>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 56, color: t > flat ? "#24c27a" : COL.dim, letterSpacing: 4, textAlign: "center" }}>{t > flat ? "NOT A CREAK" : "LISTENING…"}</div>
    </div>
  );
};
// regla recta sobre el canto de la tapa: luz cero (0" de pandeo)
const BowCheck: React.FC<{ t: number; at: number; out: number; K: Key[] }> = ({ t, at, out, K }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const a = scr(K, t, [B.x0 + B.d + 0.02, B.y + 0.13, B.z - 2]), b = scr(K, t, [B.x0 + B.d + 0.02, B.y + 0.13, B.z + 2]);
  const d = ei(t, at, at + 0.6);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><line x1={a.x} y1={a.y - 14} x2={a.x + (b.x - a.x) * d} y2={a.y - 14 + (b.y - a.y) * d} stroke="#e6e9ec" strokeWidth={14} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,.8))" }} /></svg>
      {d > 0.95 && <div style={{ position: "absolute", left: (a.x + b.x) / 2, top: (a.y + b.y) / 2 - 140, transform: `translateX(-50%) scale(${sc(t, at + 0.6)})`, fontFamily: FONT, fontWeight: 900, fontSize: 80, color: "#24c27a", textShadow: extrude(7, "rgba(0,0,0,.6)"), whiteSpace: "nowrap" }}>0" BOW</div>}
    </div>
  );
};
// tira de costos al lado del avatar (filas que entran por palabra)
const CostStrip: React.FC<{ t: number; rows: [string, string, number][]; out: number; x: number; y: number; total?: number }> = ({ t, rows, out, x, y, total }) => {
  const o = e(t, rows[0][2] - 0.3, rows[0][2]) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, width: 520, padding: "26px 30px", borderRadius: 18, background: "#fbf3df", boxShadow: "0 30px 60px rgba(0,0,0,.6)", fontFamily: FONT, transform: "rotate(-2deg)" }}>
      <div style={{ fontWeight: 900, fontSize: 36, color: "#7a5a30", letterSpacing: 6, marginBottom: 10 }}>WHAT IT COST</div>
      {rows.map(([n, p, a], i) => t >= a && <div key={i} style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 46, color: "#24180e", borderBottom: "3px dashed rgba(90,60,30,.3)", padding: "6px 0", transform: `translateX(${(1 - Math.min(1, spr(t, a))) * -120}px)` }}><span>{n}</span><span>{p}</span></div>)}
      {total !== undefined && t >= total && <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: 64, color: "#1a7a4c", paddingTop: 10, transform: `scale(${sc(t, total)})`, transformOrigin: "0 50%" }}><span>TOTAL</span><span>$23</span></div>}
    </div>
  );
};
// duelo de precios: $23 contra $389 → $420 → barra de ahorro de $400
const PriceDuel: React.FC<{ t: number; store: number; s389: number; s420: number; saved: number; out: number }> = ({ t, store, s389, s420, saved, out }) => {
  const o = e(t, store - 0.2, store) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const sv = ei(t, saved, saved + 0.8);
  const tag = (x: number, big: string, sub: string, c: string, a: number) => t >= a && (
    <div style={{ position: "absolute", left: x, top: 200, width: 600, height: 460, borderRadius: 30, background: c, boxShadow: "0 40px 80px rgba(0,0,0,.6)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${sc(t, a)})`, fontFamily: FONT }}>
      <div style={{ fontWeight: 900, fontSize: 200, color: "#1b1b1b", lineHeight: 1 }}>{big}</div>
      <div style={{ fontWeight: 800, fontSize: 44, color: "#3b2a18", letterSpacing: 4 }}>{sub}</div>
    </div>
  );
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      {tag(220, "$23", "MINE", "#ffe08a", store - 0.2)}
      {tag(1100, t > s420 ? "$420" : "$389", t > s420 ? "THE STORE + TAX" : "THE STORE", "#e9e4dc", s389 - 0.1)}
      {t > saved && <div style={{ position: "absolute", left: 220, top: 760, width: 1480 * sv, height: 120, borderRadius: 60, background: "linear-gradient(90deg,#1a7a4c,#24c27a)", boxShadow: "0 0 40px rgba(36,194,122,.6)" }} />}
      {t > saved && <div style={{ position: "absolute", left: 0, right: 0, top: 765, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 96, color: "#fff", letterSpacing: 6, textShadow: extrude(6, "rgba(0,0,0,.5)"), opacity: e(t, saved + 0.4, saved + 0.7) }}>$400 SAVED</div>}
    </div>
  );
};
// roble macizo (bloque 3D que gira) contra aglomerado (foto) en pantalla partida
const OakVsChip: React.FC<{ t: number; at: number; part: number; out: number }> = ({ t, at, part, out }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const ry = -30 + 20 * Math.sin((t - at) * 0.8);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ clipPath: "inset(0 50% 0 0)", background: "radial-gradient(circle at 25% 45%, #4a3522, #120c08)" }}>
        <div style={{ position: "absolute", left: 480, top: 520, width: 0, height: 0, perspective: 1500 }}>
          <div style={{ transformStyle: "preserve-3d", transform: `rotateX(-18deg) rotateY(${ry}deg)` }}><Block x={-220} y={-160} w={440} h={320} d={260} grain="h" tone={2} /></div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 960, top: 860, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 90, color: COL.amber, textShadow: extrude(7, "rgba(0,0,0,.6)") }}>SOLID OAK</div>
      </AbsoluteFill>
      {t > part - 0.3 && <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${50 + 50 * (1 - ei(t, part - 0.3, part + 0.2))}%)` }}><Pic id="r39_particle" t={t} a={part - 0.3} mv="in" ox="75% 50%" /><div style={{ position: "absolute", left: 960, width: 960, top: 860, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 80, color: COL.ink, textShadow: extrude(7, "rgba(0,0,0,.6)") }}>PARTICLE BOARD</div></AbsoluteFill>}
      <div style={{ position: "absolute", left: 954, top: 0, width: 12, height: 1080, background: "#f4efe6", opacity: t > part - 0.3 ? 1 : 0 }} />
    </AbsoluteFill>
  );
};
// soles que se cuentan (3 veranos) y la esquina que se hincha
const Summers: React.FC<{ t: number; at: number; swell: number; out: number; x: number; y: number }> = ({ t, at, swell, out, x, y }) => {
  const o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, display: "flex", gap: 30, alignItems: "center" }}>
      {[0, 1, 2].map((i) => { const k = Math.min(1.1, spr(t, at + i * 0.3)); return (
        <svg key={i} width={150} height={150} viewBox="-75 -75 150 150" style={{ transform: `scale(${k}) rotate(${t * 20}deg)`, filter: "drop-shadow(0 0 16px rgba(255,190,60,.8))" }}>
          {Array.from({ length: 10 }, (_, j) => <line key={j} x1={0} y1={-46} x2={0} y2={-70} stroke="#ffcf4a" strokeWidth={8} strokeLinecap="round" transform={`rotate(${j * 36})`} />)}
          <circle r={38} fill="#ffcf4a" />
        </svg>
      ); })}
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 90, color: "#ffcf4a", textShadow: extrude(7, "rgba(0,0,0,.6)"), whiteSpace: "nowrap" }}>3 SUMMERS</div>
      {t > swell && <div style={{ position: "absolute", left: 0, top: 200, fontFamily: FONT, fontWeight: 900, fontSize: 90, color: COL.red, textShadow: extrude(7, "rgba(0,0,0,.6)"), whiteSpace: "nowrap", transform: `scale(${1 + 0.06 * Math.sin((t - swell) * 5)})`, transformOrigin: "0 50%" }}>THE CORNERS SWELL</div>}
    </div>
  );
};
// los 6 errores: riel de números + la ficha grande del error en curso (error tachado → arreglo en verde)
type Mis = { n: number; at: number; bad: string; fix: string; fixAt: number };
const MISTAKES = (): Mis[] => [
  { n: 1, at: T.m1, bad: "WRONG PALLETS", fix: "HT ✓   MB ✗", fixAt: T.ht },
  { n: 2, at: T.m2, bad: "PRYING BOARDS OFF", fix: "CUT THE NAILS", fixAt: T.cutN },
  { n: 3, at: T.m3, bad: "SKIPPING THE MAGNET", fix: "1 NAIL = NEW BLADE", fixAt: T.blade },
  { n: 4, at: T.m4, bad: "TOO TALL", fix: "WRIST · NOT COUNTER", fixAt: T.wrist },
  { n: 5, at: T.m5, bad: "MISSING THE STUDS", fix: "ANCHORS LAST A WEEK", fixAt: T.anchors },
  { n: 6, at: T.m6, bad: "STRAIGHT DRAWBORE", fix: 'OFFSET 1/16"', fixAt: T.offset },
];
const MistakeDeck: React.FC<{ t: number; out: number; compact?: boolean }> = ({ t, out, compact }) => {
  const M = MISTAKES(), cur = M.filter((m) => t >= m.at - 0.2).pop();
  const o = 1 - e(t, out, out + 0.3);
  if (o <= 0.01) return null;
  const rail = (
    <div style={{ display: "flex", flexDirection: compact ? "row" : "column", gap: 14 }}>
      {M.map((m) => { const on = cur?.n === m.n, done = cur && m.n < cur.n; return <div key={m.n} style={{ width: compact ? 64 : 96, height: compact ? 64 : 96, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: compact ? 38 : 56, background: on ? COL.red : done ? "rgba(36,194,122,.85)" : "rgba(255,255,255,.1)", color: "#fff", boxShadow: on ? "0 0 30px rgba(255,74,61,.7)" : undefined, transform: `scale(${on ? 1.12 : 1})` }}>{done ? "✓" : m.n}</div>; })}
    </div>
  );
  if (compact) {
    return (
      <div style={{ position: "absolute", left: 70, top: 90, opacity: o, fontFamily: FONT }}>
        {rail}
        {cur && <div key={cur.n} style={{ marginTop: 24, width: 560, padding: "22px 28px", borderRadius: 18, background: "rgba(14,10,6,.88)", boxShadow: "0 30px 50px rgba(0,0,0,.6)", transform: `translateX(${(1 - Math.min(1, spr(t, cur.at - 0.2))) * -600}px)` }}>
          <div style={{ fontWeight: 900, fontSize: 52, color: COL.red, textDecoration: t > cur.fixAt ? "line-through" : undefined }}>{cur.bad}</div>
          {t > cur.fixAt && <div style={{ fontWeight: 900, fontSize: 52, color: "#24c27a", marginTop: 8 }}>{cur.fix}</div>}
        </div>}
      </div>
    );
  }
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: 90, top: 150 }}>{rail}</div>
      {cur && (
        <div key={cur.n} style={{ position: "absolute", left: 300, top: 220, width: 1400, height: 640, borderRadius: 36, background: "linear-gradient(160deg,#2a2018,#130d08)", boxShadow: "0 50px 100px rgba(0,0,0,.7), inset 0 0 0 4px rgba(255,255,255,.08)", padding: "60px 80px", fontFamily: FONT, transform: `perspective(1600px) rotateY(${(1 - Math.min(1, spr(t, cur.at - 0.2))) * -70}deg)`, transformOrigin: "0 50%" }}>
          <div style={{ fontWeight: 900, fontSize: 60, color: COL.dim, letterSpacing: 8 }}>MISTAKE #{cur.n}</div>
          <div style={{ position: "relative", display: "inline-block", marginTop: 20, fontWeight: 900, fontSize: 130, color: COL.red, lineHeight: 1.05 }}>
            {cur.bad}
            {t > cur.fixAt && <div style={{ position: "absolute", left: 0, top: "52%", height: 14, width: `${100 * ei(t, cur.fixAt, cur.fixAt + 0.35)}%`, background: COL.ink }} />}
          </div>
          {t > cur.fixAt && <div style={{ marginTop: 50, fontWeight: 900, fontSize: 110, color: "#24c27a", transform: `translateY(${(1 - Math.min(1, spr(t, cur.fixAt + 0.2))) * 80}px)`, opacity: e(t, cur.fixAt + 0.1, cur.fixAt + 0.3) }}>→ {cur.fix}</div>}
        </div>
      )}
    </AbsoluteFill>
  );
};
// las 5 herramientas, chapitas que caen por palabra sobre el banco
const ToolTags: React.FC<{ t: number; items: [string, number][]; out: number }> = ({ t, items, out }) => {
  const o = 1 - e(t, out, out + 0.3);
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 90, display: "flex", justifyContent: "center", gap: 22, opacity: o }}>
      {items.map(([n, a], i) => t >= a - 0.1 && <div key={i} style={{ padding: "18px 30px", borderRadius: 14, background: "repeating-linear-gradient(90deg, rgba(70,40,15,.18) 0 2px, transparent 2px 23px), linear-gradient(180deg,#c99a63,#9c6f3f)", fontFamily: FONT, fontWeight: 900, fontSize: 46, color: "#24140a", boxShadow: "0 20px 34px rgba(0,0,0,.6)", transform: `translateY(${(1 - Math.min(1, spr(t, a - 0.1))) * -500}px) rotate(${(i % 2 ? 3 : -3)}deg)` }}>{n}</div>)}
    </div>
  );
};
// la frase del abuelo, a máquina de escribir, sobre las clavijas
const Quote: React.FC<{ t: number; l1: [string, number]; l2: [string, number]; out: number }> = ({ t, l1, l2, out }) => {
  const o = e(t, l1[1] - 0.3, l1[1]) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const typ = (s: string, a: number, dur: number) => s.slice(0, Math.floor(s.length * Math.max(0, Math.min(1, (t - a) / dur))));
  return (
    <div style={{ position: "absolute", left: 200, right: 200, top: 300, opacity: o, fontFamily: "Georgia, 'Times New Roman', serif", color: "#fbf3df", textShadow: "0 4px 18px rgba(0,0,0,.9)" }}>
      <div style={{ fontSize: 200, lineHeight: 0.6, color: COL.amber, fontWeight: 900 }}>“</div>
      <div style={{ fontSize: 76, lineHeight: 1.25, fontStyle: "italic" }}>{typ(l1[0], l1[1], 1.6)}</div>
      <div style={{ fontSize: 76, lineHeight: 1.25, fontStyle: "italic", marginTop: 26, color: COL.amber }}>{typ(l2[0], l2[1], 2.2)}</div>
      {t > l2[1] + 2.4 && <div style={{ marginTop: 40, fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 6, color: COL.dim }}>— GRANDDADDY</div>}
    </div>
  );
};
// contadores de lo que aguantó el granero
const Outlasted: React.FC<{ t: number; roofs: number; torn: number; out: number }> = ({ t, roofs, torn, out }) => {
  const o = e(t, roofs - 0.4, roofs - 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const roof = (i: number) => <svg key={i} width={160} height={110} viewBox="0 0 160 110" style={{ transform: `translateY(${(1 - Math.min(1, spr(t, roofs + i * 0.15))) * -300}px)` }}><polygon points="0,100 80,10 160,100" fill="#8a2a1e" stroke="#f4efe6" strokeWidth={6} /></svg>;
  const tw = (i: number) => <svg key={i} width={130} height={170} viewBox="0 0 130 170" style={{ transform: `rotate(${Math.sin(t * 6 + i) * 8}deg)`, opacity: e(t, torn + i * 0.2, torn + i * 0.2 + 0.2) }}>{[0, 1, 2, 3, 4].map((j) => <ellipse key={j} cx={65 + Math.sin(t * 5 + j) * 6} cy={20 + j * 34} rx={60 - j * 11} ry={13} fill="none" stroke="#c9ccd1" strokeWidth={8} />)}</svg>;
  return (
    <div style={{ position: "absolute", left: 960, top: 520, transform: "translate(-50%,-50%)", opacity: o, fontFamily: FONT, textAlign: "center" }}>
      <div style={{ fontWeight: 900, fontSize: 70, color: COL.dim, letterSpacing: 8, marginBottom: 30 }}>THAT BARN OUTLASTED</div>
      <div style={{ display: "flex", gap: 120, justifyContent: "center", alignItems: "flex-end" }}>
        <div><div style={{ display: "flex", gap: 10 }}>{[0, 1, 2].map(roof)}</div><div style={{ fontWeight: 900, fontSize: 80, color: COL.ink, marginTop: 14 }}>3 ROOFS</div></div>
        {t > torn - 0.1 && <div><div style={{ display: "flex", gap: 10, justifyContent: "center" }}>{[0, 1].map(tw)}</div><div style={{ fontWeight: 900, fontSize: 80, color: COL.ink, marginTop: 14 }}>2 TORNADOES</div></div>}
      </div>
    </div>
  );
};
// tres tildes del final
const Triad: React.FC<{ t: number; items: [string, number][]; out: number }> = ({ t, items, out }) => {
  const o = 1 - e(t, out, out + 0.3);
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 90, top: 200, opacity: o, display: "flex", flexDirection: "column", gap: 26, fontFamily: FONT }}>
      {items.map(([s, a], i) => t >= a - 0.1 && <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, transform: `translateX(${(1 - Math.min(1, spr(t, a - 0.1))) * -400}px)` }}>
        <div style={{ width: 90, height: 90, borderRadius: "50%", background: "#24c27a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 60, color: "#fff", boxShadow: "0 0 30px rgba(36,194,122,.6)" }}>✓</div>
        <div style={{ fontWeight: 900, fontSize: 90, color: COL.ink, textShadow: extrude(7, "rgba(0,0,0,.6)"), whiteSpace: "nowrap" }}>{s}</div>
      </div>)}
    </div>
  );
};
// suscribirse + campanita + UNA pregunta para comentar (genérica, sin marca de ninguna plataforma)
const AskCard: React.FC<{ t: number; at: number; sub: number; q: number; out: number }> = ({ t, at, sub, q, out }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const ring = t > sub + 0.6 ? Math.sin((t - sub) * 18) * 14 * Math.exp(-(t - sub - 0.6) * 2.5) : 0;
  return (
    <div style={{ position: "absolute", left: 960, top: 540, opacity: o, transform: `translate(-50%,-50%) scale(${sc(t, at)})`, width: 1240, padding: "50px 60px", borderRadius: 30, background: "#fbf3df", boxShadow: "0 50px 100px rgba(0,0,0,.6)", fontFamily: FONT }}>
      {t > sub && <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
        <div style={{ padding: "18px 40px", borderRadius: 14, background: "#c0281e", color: "#fff", fontWeight: 900, fontSize: 60, letterSpacing: 4, transform: `scale(${sc(t, sub)})` }}>SUBSCRIBE</div>
        <svg width={110} height={110} viewBox="0 0 110 110" style={{ transform: `rotate(${ring}deg)`, transformOrigin: "50% 10%" }}><path d="M55 12 C32 12 26 32 26 52 L26 72 L14 86 L96 86 L84 72 L84 52 C84 32 78 12 55 12 Z" fill="#24180e" /><circle cx={55} cy={96} r={10} fill="#24180e" /></svg>
      </div>}
      {t > q && <div style={{ marginTop: 40, transform: `translateY(${(1 - Math.min(1, spr(t, q))) * 60}px)` }}>
        <div style={{ fontWeight: 900, fontSize: 40, letterSpacing: 6, color: "#7a5a30" }}>TELL ME IN THE COMMENTS</div>
        <div style={{ fontWeight: 900, fontSize: 84, color: "#24180e", marginTop: 8 }}>How tall did you make yours?</div>
      </div>}
    </div>
  );
};
// cierre: placa grabada con el nombre del canal (persona, no el creador) + "now go find yourself some pallets"
const SignOff: React.FC<{ t: number; at: number; line: number }> = ({ t, at, line }) => {
  const o = e(t, at, at + 0.4);
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 120, opacity: o, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: FONT }}>
      <div style={{ padding: "26px 60px", borderRadius: 16, backgroundImage: "repeating-linear-gradient(90deg, rgba(70,40,15,.18) 0 2px, transparent 2px 23px), linear-gradient(180deg,#c99a63,#9c6f3f)", boxShadow: "0 30px 60px rgba(0,0,0,.6)", transform: `translateY(${(1 - Math.min(1, spr(t, at))) * 300}px)` }}>
        <div style={{ fontWeight: 900, fontSize: 96, color: "#24140a", letterSpacing: 6 }}>ELMER THE CARPENTER</div>
      </div>
      {t > line && <div style={{ marginTop: 30, fontWeight: 900, fontSize: 70, color: COL.amber, textShadow: extrude(6, "rgba(0,0,0,.7)"), opacity: e(t, line, line + 0.3) }}>NOW GO FIND YOURSELF SOME PALLETS</div>}
    </div>
  );
};

const COST = (from: number): [string, string, number][] => [["PALLETS", "FREE", Math.max(from, T.c1)], ["GLUE", "$6", Math.max(from, T.c2)], ["HINGES", "$12", Math.max(from, T.c3)], ["LAG SCREWS", "$3", T.c4], ["SANDPAPER + OIL", "$2", T.c5]];

// ================= TRAMO 4 =================
export const seg4 = (t: number, L: React.ReactNode[], World: (k: string) => React.ReactNode) => {
  const K = K4;
  // --- la prueba: 6 bolsas de 50 lb (759,2 → 768,5) ---
  if (t >= 759.2 && t < 768.5) {
    L.push(<Pic key="sd" id="r36_sand" t={t} a={759.2} mv="in" />);
    L.push(<BigWord key="ts" t={t} at={T.test} out={T.sixB - 0.2} txt="THE TEST" x={960} y={220} col={COL.amber} size={160} rot={-3} />);
    L.push(<WeightMath key="wm" t={t} at={T.sixB - 0.1} each={T.lb50} total={T.lb300} out={768.2} x={1270} y={260} />);
  }
  // --- (avatar 768,3-773,7) → en el mundo: las bolsas suben, nada cede, ni un crujido, tapa sin pandeo ---
  if (t >= 773.5 && t < 785.0) {
    L.push(World("w14"));
    L.push(<BigWord key="n2" t={t} at={T.nothing2} out={T.bag6 - 0.2} txt="NOTHING" x={1450} y={220} col={COL.ink} size={110} rot={4} />);
    L.push(<BigWord key="b6" t={t} at={T.bag6} out={T.watching + 0.5} txt="BAG #6" x={1450} y={220} col={COL.amber} size={120} rot={-3} />);
    L.push(<Watch key="wa" t={t} at={T.watching} out={T.bow - 0.3} K={K} />);
    L.push(<QuietWave key="qw" t={t} at={T.hear - 0.4} flat={T.creak} out={T.bow - 0.2} x={1180} y={120} />);
    L.push(<BowCheck key="bc" t={t} at={T.bow - 0.2} out={784.7} K={K} />);
    L.push(<BigWord key="so" t={t} at={T.sandOff} out={784.7} txt="300 LB · 0 PROBLEMS" x={960} y={950} col="#24c27a" size={70} rot={0} />);
  }
  // --- sentado en la esquina, el peor lugar (784,8 → 786) ---
  if (t >= 784.8 && t < 786.2) L.push(<Pic key="st" id="r37_sit" t={t} a={784.8} mv="up" />);
  // --- (avatar 785,9-789,8) → se pliega a 4" de la pared → la camioneta entra → la tapa baja y LA CUENTA en la guía (pág. 31) ---
  if (t >= 789.6 && t < 802.3) {
    L.push(World("w15"));
    const g = scr(K, t, PT.wallGap);
    if (t > T.in4 - 0.1 && t < T.truck) L.push(<BigWord key="4in" t={t} at={T.in4} out={T.truck - 0.2} txt={'4" FROM THE WALL'} x={Math.min(1500, Math.max(420, g.x + 260))} y={Math.max(160, g.y - 120)} col={COL.amber} size={80} rot={0} />);
    L.push(<Polaroid key="fo" t={t} at={T.in4 + 0.2} out={T.truck - 0.2} img="r38_folded" x={1500} y={780} cap="folded · 4 inches" rot={5} />);
    const m = scr(K, t, PT.truckMirror);
    if (t > T.truck + 0.3 && t < T.addUp - 0.8) L.push(<div key="hw" style={{ position: "absolute", left: m.x - 150, top: m.y - 20, width: 300, height: 40, borderLeft: "8px solid #24c27a", borderRight: "8px solid #24c27a", opacity: e(t, T.truck + 0.3, T.truck + 0.6) * (1 - e(t, T.addUp - 1.1, T.addUp - 0.8)) }}><div style={{ position: "absolute", left: 0, right: 0, top: 16, height: 8, background: "#24c27a" }} /></div>);
    L.push(<BigWord key="hd" t={t} at={T.hand - 0.2} out={T.addUp - 0.8} txt="A GOOD HAND'S WIDTH" x={960} y={180} col="#24c27a" size={80} rot={0} />);
    L.push(<BigWord key="au" t={t} at={T.addUp} out={T.c1 - 0.2} txt="LET'S ADD IT UP" x={960} y={170} col={COL.ink} size={90} rot={0} />);
    L.push(<CostStrip key="cs1" t={t} rows={COST(0)} out={802.4} x={150} y={180} />);
  }
  // --- (avatar 802,1-807,3) → el total en la guía → $23 contra $420 → $400 ahorrados ---
  if (t >= 807.1 && t < 816.4) {
    L.push(World("w16"));
    L.push(<BigWord key="23" t={t} at={T.c23} out={T.store - 0.3} txt="$23" x={1500} y={260} col={COL.amber} size={220} rot={-6} />);
    L.push(<CostStrip key="cs2" t={t} rows={COST(802.2)} out={T.store - 0.3} x={150} y={180} total={T.c23} />);
    L.push(<Fade key="g1" t={t} a={T.store - 0.3} b={T.store}><Grad c1="#33281c" c2="#0c0906" /></Fade>);
    L.push(<PriceDuel key="pd" t={t} store={T.store} s389={T.s389} s420={T.s420} saved={T.saved} out={816.1} />);
  }
  // --- roble macizo vs aglomerado (816,2 → 819,4) ---
  if (t >= 816.2 && t < 819.4) L.push(<OakVsChip key="ov" t={t} at={816.2} part={T.particle} out={819.3} />);
  // --- (avatar 819,2-825) → el garaje húmedo de Tennessee: 3 veranos y la esquina se hincha → el roble ya vivió 5 años afuera ---
  if (t >= 824.8 && t < 836.6) {
    const dK = e(t, T.dock - 0.4, T.dock);
    L.push(<Pic key="sw" id="n12_swell" t={t} a={824.8} mv="in" ox="60% 60%" />);
    L.push(<BigWord key="tn" t={t} at={T.tenn - 0.1} out={T.summers - 0.3} txt="EVERY GARAGE IS DAMP" x={960} y={200} col={COL.ice} size={84} rot={0} />);
    L.push(<Summers key="sm" t={t} at={T.summers} swell={T.swell} out={T.dock - 0.4} x={260} y={170} />);
    if (dK > 0) L.push(<Fade key="wp" t={t} a={T.dock - 0.4} b={T.dock}>{World("w17")}</Fade>);
    L.push(<BigWord key="5y" t={t} at={T.years5} out={836.3} txt="5 YEARS OUTSIDE" x={960} y={190} col={COL.amber} size={100} rot={0} />);
    L.push(<BigWord key="wt" t={t} at={T.weather} out={836.3} txt="ALREADY DONE MOVING" x={960} y={920} col={COL.ink} size={70} rot={0} />);
  }
  // --- los 6 errores (pantalla entera fuera del avatar; compacto encima del avatar) ---
  if (t >= 839.6 && t < 883.3 && !(t >= 853.0 && t < 858.0) && !(t >= 869.7 && t < 873.5)) {
    L.push(<Grad key="g2" c1="#2c2018" c2="#0b0806" />);
    L.push(<BigWord key="mi" t={t} at={T.mist} out={T.m1 - 0.3} txt="LEARN FROM MINE" x={960} y={520} col={COL.amber} size={140} rot={-2} />);
    L.push(<MistakeDeck key="md" t={t} out={883.1} />);
  }
  // --- 50 años: no hace falta un taller lleno (887,9 → 897,3) → el granero del abuelo (897,3 → 900) ---
  if (t >= 887.9 && t < 900.1) {
    L.push(World("w18"));
    L.push(<BigWord key="sf" t={t} at={T.shop} out={T.circ - 0.2} txt="NO SHOP FULL OF TOOLS" x={960} y={180} col={COL.ink} size={86} rot={0} />);
    L.push(<ToolTags key="tt" t={t} items={[["CIRCULAR SAW", T.circ], ["RECIP SAW", T.recip], ["DRILL", T.drill], ["HATCHET", T.hatchet], ["HAMMER", T.hammer]]} out={T.grand - 0.3} />);
    L.push(<Fade key="bn" t={t} a={T.grand - 0.3} b={T.grand}><Pic id="r41_barn" t={t} a={T.grand - 0.3} mv="out" /></Fade>);
    L.push(<BigWord key="ls" t={t} at={T.barn} out={899.9} txt="LESS THAN THAT" x={1350} y={230} col={COL.amber} size={90} rot={4} />);
  }
  // --- (avatar 899,9-904,4) → el chico de 9 años sosteniendo la viga → la frase del clavo y la clavija ---
  if (t >= 904.2 && t < 916.3) {
    const qK = e(t, T.son - 0.5, T.son - 0.1);
    L.push(<Pic key="by" id="r40_boy" t={t} a={904.2} mv="in" />);
    L.push(<BigWord key="nl" t={t} at={T.nails} out={T.son - 0.5} txt="WHY NOT NAILS?" x={1400} y={220} col={COL.ink} size={86} rot={3} />);
    L.push(<Fade key="pg" t={t} a={T.son - 0.5} b={T.son - 0.1}><Pic id="n10_pegs" t={t} a={T.son - 0.5} mv="out" /></Fade>);
    L.push(<Dark key="dk" o={0.6 * qK} />);
    L.push(<Quote key="qt" t={t} l1={["Son, a nail holds because it's stuck.", T.son]} l2={["A peg holds because the wood wants to be there.", T.peg]} out={916.0} />);
  }
  // --- (avatar 916,1-921) → 3 techos y 2 tornados → $23 · 5 segundos · tus dos manos (en el mundo, se pliega) ---
  if (t >= 920.8 && t < 933.8) {
    const wK = e(t, T.done - 0.4, T.done);
    L.push(<Grad key="g3" c1="#2c241c" c2="#0b0806" />);
    L.push(<Outlasted key="ol" t={t} roofs={T.roofs} torn={T.tornado} out={T.done - 0.4} />);
    if (wK > 0) L.push(<Fade key="wf" t={t} a={T.done - 0.4} b={T.done}>{World("w19")}</Fade>);
    L.push(<Triad key="tr" t={t} items={[["$23", T.cost23], ["FOLDS AWAY · 5 SEC", T.folds], ["YOUR OWN TWO HANDS", T.hands]]} out={933.5} />);
  }
  // --- (avatar 933,5-937,5) → comentarios → la semana que viene: el pestillo de madera ---
  if (t >= 937.3 && t < 951.0) {
    L.push(World("w20"));
    L.push(<Dark key="dk2" o={0.55} />);
    L.push(<AskCard key="ak" t={t} at={T.build - 0.2} sub={T.subBell} q={T.howTall - 0.6} out={T.next - 0.4} />);
    L.push(<Fade key="gt" t={t} a={T.next - 0.4} b={T.next}><Pic id="r42_gate" t={t} a={T.next - 0.4} mv="in" /></Fade>);
    L.push(<BigWord key="nw" t={t} at={T.next} out={950.7} txt="NEXT WEEK" x={420} y={200} col={COL.amber} size={120} rot={-5} />);
    L.push(<BigWord key="gl" t={t} at={T.gate} out={950.7} txt="A GATE LATCH · SCRAP WOOD ONLY" x={960} y={930} col={COL.ink} size={64} rot={0} />);
  }
  // --- (avatar 950,8-957,1) → cierre ---
  if (t >= 956.9) {
    L.push(<Pic key="en" id="r43_end" t={t} a={956.9} dur={8} mv="out" />);
    L.push(<SignOff key="so2" t={t} at={T.elmer} line={T.go} />);
    L.push(<Dark key="dk3" o={e(t, T.pallets + 0.6, T.pallets + 1.5)} />);
  }
};

// ================= encima del avatar (tramo 4) =================
const A = {
  one: at("one at a time", 768), middle: at("right in the middle", 769), first: at("the first bag", 771), worst: at("the worst spot", 787), bounced: at("and bounced", 788),
  c4: at("lag screws $3", 802), sand: at("a little sandpaper", 803), c5: at("call it $2", 807), bad: at("is bad", 820), fine: at("it's fine", 821), damp: at("a damp garage", 823),
  mistakes: at("the mistakes", 840), m2: at("number two", 850), comes: at("comes off the wall", 872), little: at("that little bit", 883), y50: at("in 50 years", 886),
  nine: at("nine years old", 903), beam: at("end of a beam", 904), doNow: at("i do now", 917), same: at("the same one", 920), remember: at("going to remember", 935), self: at("locks itself", 952), eng: at("some engineers", 954), work: at("wouldn't work", 956),
};
export const AV4: Record<number, (t: number) => React.ReactNode> = {
  768: (t) => <Plank t={t} at={A.one - 0.1} out={773.4} big="ONE AT A TIME" sub="RIGHT OVER THE LEG" />,
  786: (t) => <Plank t={t} at={785.9} out={789.5} big="THE WORST SPOT" sub="SAT · BOUNCED · NOTHING" col="#1a7a4c" />,
  802: (t) => <CostStrip t={t} rows={COST(802.1)} out={807.0} x={70} y={110} />,
  819: (t) => <Plank t={t} at={A.fine - 0.2} out={824.7} big="IT'S FINE…" sub="NOT FOR A DAMP GARAGE" />,
  837: (t) => <Plank t={t} at={A.mistakes - 0.4} out={839.5} big="MY MISTAKES" sub="SO YOU DON'T MAKE THEM" col={COL.red} />,
  853: (t) => <MistakeDeck t={t} out={857.9} compact />,
  870: (t) => <MistakeDeck t={t} out={873.4} compact />,
  883: (t) => <Plank t={t} at={A.little - 0.1} out={887.7} big="THAT LITTLE BIT" sub="IS THE WHOLE TRICK" col="#1a7a4c" />,
  900: (t) => <Plank t={t} at={A.nine - 0.2} out={904.2} big="AGE 9" sub="HOLDING THE BEAM FOR HIM" />,
  916: (t) => <Plank t={t} at={A.doNow - 0.2} out={920.7} big="I DO NOW." sub="SAME JOINT AS THAT BARN" />,
  934: (t) => <Plank t={t} at={A.remember - 0.4} out={937.2} big="THE AFTERNOON" sub="YOU MADE IT" />,
  951: (t) => <Plank t={t} at={950.9} out={956.8} big="NO METAL AT ALL" sub="LOCKS ITSELF · 'WOULDN'T WORK'" col={COL.red} />,
};

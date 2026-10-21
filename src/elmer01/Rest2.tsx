// elmer01 · RESTO tramo 2 (256 → 515 s): medidas en el banco con LA GUÍA abierta en la página 12 (CTA 2) → la regla de la muñeca →
// tabla cruda (corte de perfil) → la cerca de larguero → 7 tablas iguales de 3¼" → el lijado que destapa el color miel → anillos que
// se dan vuelta → cola + cuñas → el plano del bastidor → caja y espiga → agujeros de armónica → la clavija corrida 1/16" que dobla y tira.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Key, BENCH, PT } from "./garage3d";
import { at, Pic, scr } from "./core";
import { COL, FONT, e, ei, extrude, spr } from "./lib";
import { BigWord, Polaroid } from "./Rest1";
import { Plank } from "./Rest1av";
import { Block } from "./Min1";

export const T2 = {
  w48: at("48 inches wide", 260), deep: at("22 inches deep", 262), why48: at("48 because", 264), splice: at("splice anything", 267), why22: at("22 deep because", 269),
  mirror: at("truck mirror", 272), height: at("and the height", 273), wrong: at("gets wrong", 275), k36: at("36", 276), kitchen: at("kitchen counter", 278), onions: at("chopping onions", 280),
  stand: at("stand up straight", 282), arms: at("arms hang", 283), floor: at("from the floor", 284), wrist: at("crease of your wrist", 285), benchH: at("that's your bench height", 287), h34: at("34", 288),
  rough: at("come rough", 295), cupped: at("cupped", 296), dirty: at("dirty", 297), edges: at("edges are not straight", 297), joiner: at("joiner", 299), trick: at("i'll show you a trick", 301),
  straightest: at("straightest stringers", 303), fence: at("as a fence", 305), clamp: at("clamp it down", 306),
  other: at("cut the other side", 312), same: at("same width", 314), w314: at("3 14", 315), square: at("clean square edges", 317), sanding: at("quick sanding", 319), grit: at("80 grit", 320), gray: at("the gray", 323), real: at("the real wood", 325),
  folks: at("folks always say", 331), notP: at("that's not pallet wood", 333), yes: at("yes it is", 334), mask: at("dust mask", 338), lungs: at("your lungs", 344),
  seven: at("seven deck boards", 346), endOf: at("look at the end", 350), rings: at("growth rings", 352), arcs: at("little arcs", 353), flipE: at("flip every other", 354), up: at("go up", 355), down: at("then down", 356), up2: at("then up", 357), seasons: at("seasons", 358),
  cancel: at("cancel each other", 360), chip: at("potato chip", 363), glue: at("then glue", 364), g6: at("$6", 367), edge: at("every edge", 368), push: at("push them together", 370),
  cauls: at("two stringers across", 371), wedges: at("couple of wedges", 373), flat: at("press it all flat", 375), noClamps: at("no fancy clamps", 377),
  frame: at("now the frame", 382), two: at("two stringers run", 383), f48: at("48 inches", 385), short: at("three short ones", 387), f19: at("19 inches", 388), eachEnd: at("one at each end", 390), middle: at("one in the middle", 390),
  joint: at("where the joint comes in", 392), drawbore: at("called a drawbore", 396), barns: at("barns that are", 399), y200: at("200 years", 399), how: at("here's how it works", 402),
  slot: at("cut a slot", 404), mortise: at("that's the mortise", 405), deep15: at("inch and a half deep", 406), third: at("a third of the board", 408), tongue: at("cut a tongue", 410), tenon: at("that's the tenon", 412),
  machine: at("fancy machine", 418), mark: at("mark it with", 419), row: at("drill a row", 421), depth: at("to the depth", 424), harm: at("harmonica", 427),
  walls: at("straight down on the walls", 431), tap: at("a little tap", 433), pry: at("don't pry", 435), crowbar: at("not a crowbar", 436), min5: at("5 minutes", 438), rhythm: at("rhythm", 440),
  fit: at("try the fit", 446), hand: at("with your hand", 448), firm: at("firm", 450), beat: at("beat it in", 451), apart: at("take them apart", 453), hole: at("drill a hole through", 454), e38: at("3 eighths", 456), side: at("right through the side", 457), back: at("put the tenon back", 458),
  secret: at("the whole secret", 464), dont: at("you don't drill the tenon", 466), s16: at("1 16th of an inch closer", 468), shoulder: at("closer to the shoulder", 469), dime: at("dime and a half", 473), notLine: at("don't line up", 475), hair: at("off just a hair", 476),
  bend: at("has to bend", 481), pullsIn: at("pulls the tenon in", 483), dead: at("dead tight", 485), never: at("never lets go", 487), noC: at("no clamp", 489), noS: at("no screw", 489), wood: at("wood pulling wood", 490),
  hatchet: at("with a hatchet", 494), splitNot: at("split not sawn", 495), grain: at("grain runs straight", 496), whittle: at("whittle them", 499), taper: at("taper the tip", 500), pencil: at("like a pencil", 501),
  drive: at("drive it with a hammer", 504), stops: at("until it stops", 504), flush: at("cut it flush", 506), six: at("six joints", 507), twelve: at("twelve pegs", 509), min40: at("40 minutes", 510), jump: at("jump on it", 515),
};
const T = T2;

// cámara: el banco abierto con el cuaderno en la página 12 → la regla de 48 → los 22 → el espejo de la camioneta
const B = BENCH;
export const K2: Key[] = [
  { t: 256.9, p: [-3.2, 6.6, 7.4], l: [-8.8, 2.7, 2.0], fov: 38 },
  { t: 259.9, p: [-3.1, 6.5, 7.6], l: [-8.8, 2.7, 2.0], fov: 39 },
  // sale del avatar (263,9) sobre el banco entero para las cotas
  { t: 263.9, p: [-3.0, 6.4, 7.6], l: [-8.9, 2.7, 2.0], fov: 40 },
  { t: T.why22 - 0.2, p: [-2.6, 6.8, 6.9], l: [-8.9, 2.6, 2.0], fov: 40 },
  { t: T.mirror - 0.3, p: [-4.8, 6.4, 6.0], l: [-1.0, 3.6, -2.6], fov: 42, arc: 0.4 },
  { t: T.height, p: [-5.0, 6.0, 5.6], l: [-0.6, 3.6, -2.6], fov: 40 },
  { t: 274.5, p: [-5.2, 5.0, 8.0], l: [-8.9, 1.7, 2.0], fov: 40 },
  // el bastidor (plano) 383,6-395,8 — el mundo de fondo, cámara desde arriba del banco
  { t: 383.4, p: [-6.6, 11.0, 4.4], l: [-8.8, 2.8, 2.0], fov: 40 },
  { t: 395.8, p: [-6.9, 10.4, 3.4], l: [-8.8, 2.8, 2.0], fov: 38 },
];

// ================= PIEZAS NUEVAS =================
// cinta métrica 3D: la hoja amarilla sale de la caja a lo largo de un canto proyectado y muestra el número
const Tape3D: React.FC<{ t: number; at: number; out: number; a: [number, number, number]; b: [number, number, number]; label: string; K: Key[] }> = ({ t, at, out, a, b, label, K }) => {
  const o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const A = scr(K, t, a), Bp = scr(K, t, b), d = ei(t, at, at + 0.6);
  const ang = Math.atan2(Bp.y - A.y, Bp.x - A.x) * 180 / Math.PI, len = Math.hypot(Bp.x - A.x, Bp.y - A.y) * d;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: A.x, top: A.y - 14, width: len, height: 28, transformOrigin: "0 50%", transform: `rotate(${ang}deg)`, background: "repeating-linear-gradient(90deg, #1b1b1b 0 2px, transparent 2px 14px), linear-gradient(180deg,#ffd51e,#e9b400)", boxShadow: "0 6px 14px rgba(0,0,0,.6)", borderRadius: 3 }} />
      <div style={{ position: "absolute", left: A.x - 50, top: A.y - 50, width: 100, height: 100, borderRadius: 22, background: "linear-gradient(160deg,#ffcd2e,#d99a00)", boxShadow: "0 14px 24px rgba(0,0,0,.6), inset 0 0 0 6px #2a2a2a" }} />
      <div style={{ position: "absolute", left: (A.x + Bp.x) / 2, top: (A.y + Bp.y) / 2 - 80, transform: `translate(-50%,-50%) scale(${Math.min(1.08, spr(t, at + 0.45))})`, fontFamily: FONT, fontWeight: 900, fontSize: 90, color: "#ffd51e", textShadow: extrude(8, "rgba(0,0,0,.65)"), whiteSpace: "nowrap" }}>{label}</div>
    </div>
  );
};
// regla vertical de altura con dos marcas (36" tachado / 34½" verde) junto a la persona
const HeightRuler: React.FC<{ t: number; at: number; out: number; x: number; top: number; bottom: number; k36: number; k34: number; x36: number }> = ({ t, at, out, x, top, bottom, k36, k34, x36 }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const H2 = bottom - top, y36 = bottom - H2 * (36 / 72), y34 = bottom - H2 * (34.5 / 72);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <div style={{ position: "absolute", left: x, top, width: 70, height: H2 * ei(t, at, at + 0.6), background: "repeating-linear-gradient(180deg, #1b1b1b 0 3px, transparent 3px 24px), linear-gradient(90deg,#ffd51e,#e9b400)", boxShadow: "0 10px 24px rgba(0,0,0,.6)", borderRadius: 4, transformOrigin: "50% 100%", marginTop: H2 * (1 - ei(t, at, at + 0.6)) }} />
      {t > x36 && <div style={{ position: "absolute", left: x + 70, top: y36 - 4, width: 360 * e(t, x36, x36 + 0.3), height: 8, background: COL.red }} />}
      {t > x36 && <div style={{ position: "absolute", left: x + 100, top: y36 - 90, fontFamily: FONT, fontWeight: 900, fontSize: 64, color: COL.red, textShadow: extrude(5, "rgba(0,0,0,.6)"), whiteSpace: "nowrap" }}>36" <span style={{ fontSize: 34 }}>KITCHEN</span>{t > k36 && <span style={{ marginLeft: 16 }}>✗</span>}</div>}
      {t > k34 && <div style={{ position: "absolute", left: x + 70, top: y34 - 5, width: 420 * e(t, k34, k34 + 0.3), height: 10, background: "#24c27a", boxShadow: "0 0 18px #24c27a" }} />}
      {t > k34 && <div style={{ position: "absolute", left: x + 100, top: y34 + 14, transform: `scale(${Math.min(1.08, spr(t, k34 + 0.1))})`, transformOrigin: "0 0", fontFamily: FONT, fontWeight: 900, fontSize: 96, color: "#24c27a", textShadow: extrude(7, "rgba(0,0,0,.6)"), whiteSpace: "nowrap" }}>34½" <span style={{ fontSize: 36 }}>WRIST</span></div>}
    </div>
  );
};
// perfil de la tabla cruda (corte transversal): curvada, sucia, canto torcido — con rótulos que entran por palabra
const RoughProfile: React.FC<{ t: number; at: number; out: number; cupped: number; dirty: number; edges: number }> = ({ t, at, out, cupped, dirty, edges }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const cup = 40 * e(t, cupped, cupped + 0.4), dirt = e(t, dirty, dirty + 0.4), wob = e(t, edges, edges + 0.4);
  return (
    <div style={{ position: "absolute", left: 960, top: 520, opacity: o, transform: "translate(-50%,-50%)" }}>
      <svg width={1300} height={520} viewBox="0 0 1300 520" style={{ overflow: "visible", filter: "drop-shadow(0 30px 40px rgba(0,0,0,.6))" }}>
        <defs><linearGradient id="rw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c99a63" /><stop offset="1" stopColor="#8d6a46" /></linearGradient></defs>
        <path d={`M 150 ${230 - cup} Q 650 ${230 + cup} 1150 ${230 - cup} L 1150 ${330 - cup} Q 650 ${330 + cup} 150 ${330 - cup} Z`} fill="url(#rw)" />
        <path d={`M 150 ${230 - cup} Q 650 ${230 + cup} 1150 ${230 - cup}`} fill="none" stroke="#6d6d6d" strokeWidth={14} opacity={0.85 * dirt} />
        {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={220 + i * 100} cy={240 - cup + (i % 3) * 8 + Math.abs(i - 4.5) * -cup * 0.17} r={10 + (i % 3) * 4} fill="#4d4a45" opacity={0.6 * dirt} />)}
        <path d={`M 150 ${230 - cup} L ${150 - 30 * wob} ${260 - cup} L ${150 + 18 * wob} ${300 - cup} L 150 ${330 - cup}`} fill="none" stroke={COL.red} strokeWidth={8} opacity={wob} />
      </svg>
      {t > cupped && <div style={{ position: "absolute", left: 560, top: -40, fontFamily: FONT, fontWeight: 900, fontSize: 70, color: COL.ink, textShadow: extrude(6, "rgba(0,0,0,.6)"), transform: `scale(${Math.min(1.08, spr(t, cupped))})` }}>CUPPED</div>}
      {t > dirty && <div style={{ position: "absolute", left: 900, top: 420, fontFamily: FONT, fontWeight: 900, fontSize: 70, color: "#b9b9b9", textShadow: extrude(6, "rgba(0,0,0,.6)"), transform: `scale(${Math.min(1.08, spr(t, dirty))})` }}>DIRTY</div>}
      {t > edges && <div style={{ position: "absolute", left: -60, top: 420, fontFamily: FONT, fontWeight: 900, fontSize: 70, color: COL.red, textShadow: extrude(6, "rgba(0,0,0,.6)"), transform: `scale(${Math.min(1.08, spr(t, edges))})`, whiteSpace: "nowrap" }}>CROOKED EDGE</div>}
    </div>
  );
};
// línea de corte que corre por la foto siguiendo la cerca (guion rojo + "FENCE")
const CutLine: React.FC<{ t: number; at: number; out: number; x1: number; y1: number; x2: number; y2: number; label: string }> = ({ t, at, out, x1, y1, x2, y2, label }) => {
  const o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const d = ei(t, at, at + 0.8);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 0 10px rgba(255,178,87,.8))" }}>
        <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * d} y2={y1 + (y2 - y1) * d} stroke={COL.amber} strokeWidth={10} strokeDasharray="34 18" strokeDashoffset={-t * 120} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", left: (x1 + x2) / 2, top: (y1 + y2) / 2 - 110, transform: `translate(-50%,0) rotate(${Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI}deg) scale(${Math.min(1.08, spr(t, at + 0.4))})`, fontFamily: FONT, fontWeight: 900, fontSize: 70, color: COL.amber, letterSpacing: 6, textShadow: extrude(6, "rgba(0,0,0,.6)"), whiteSpace: "nowrap" }}>{label}</div>
    </div>
  );
};
// 7 tablas idénticas que caen en fila con la cota 3¼"
const SameBoards: React.FC<{ t: number; at: number; dimAt: number; out: number }> = ({ t, at, dimAt, out }) => {
  const o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 960, top: 560, opacity: o, transform: "translate(-50%,-50%)", perspective: 1500 }}>
      <div style={{ display: "flex", gap: 14, transform: "rotateX(48deg) rotateZ(-4deg)", transformStyle: "preserve-3d" }}>
        {Array.from({ length: 7 }, (_, i) => { const k = ei(t, at + i * 0.08, at + i * 0.08 + 0.35); return <div key={i} style={{ width: 150, height: 760, borderRadius: 4, transform: `translateZ(${(1 - k) * 400}px)`, opacity: k, background: "repeating-linear-gradient(180deg, rgba(90,55,25,.16) 0 2px, transparent 2px 26px), linear-gradient(90deg,#d6aa72,#b98a55)", boxShadow: "0 20px 30px rgba(0,0,0,.5), inset 0 0 0 3px rgba(60,35,12,.25)" }} />; })}
      </div>
      {t > dimAt && <div style={{ position: "absolute", left: 0, top: 70, width: 150 * e(t, dimAt, dimAt + 0.3), height: 8, background: COL.amber, boxShadow: `0 0 12px ${COL.amber}` }} />}
      {t > dimAt && <div style={{ position: "absolute", left: -40, top: -60, fontFamily: FONT, fontWeight: 900, fontSize: 110, color: COL.amber, textShadow: extrude(8, "rgba(0,0,0,.6)"), transform: `scale(${Math.min(1.08, spr(t, dimAt))})`, transformOrigin: "0 100%", whiteSpace: "nowrap" }}>3¼" <span style={{ fontSize: 44, color: COL.ink }}>EVERY BOARD</span></div>}
    </div>
  );
};
// barrido de lijado: la foto en gris "sucio" se limpia detrás del taco (aparece el color real)
const SandWipe: React.FC<{ t: number; at: number; dur: number; children: React.ReactNode }> = ({ t, at, dur, children }) => {
  const k = ei(t, at, at + dur);
  return (
    <AbsoluteFill>
      {children}
      <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${k * 100}%)`, filter: "grayscale(1) brightness(.72) contrast(.9)" }}>{children}</AbsoluteFill>
      {k > 0 && k < 1 && <div style={{ position: "absolute", left: `${k * 100}%`, top: 0, bottom: 0, width: 10, marginLeft: -5, background: "rgba(255,240,210,.85)", boxShadow: "0 0 40px 18px rgba(255,220,160,.55)" }} />}
    </AbsoluteFill>
  );
};
// globo de diálogo de "la gente" + sello "YES IT IS."
const Bubble: React.FC<{ t: number; at: number; out: number; x: number; y: number; txt: string }> = ({ t, at, out, x, y, txt }) => {
  const k = spr(t, at, 1.1), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${Math.min(1.05, k)})`, transformOrigin: "20% 100%" }}>
      <div style={{ background: "#fff", borderRadius: 40, padding: "28px 44px", fontFamily: FONT, fontWeight: 800, fontSize: 56, color: "#1b1b1b", boxShadow: "0 30px 50px rgba(0,0,0,.55)", whiteSpace: "nowrap" }}>{txt}</div>
      <svg width={80} height={60} style={{ position: "absolute", left: 80, bottom: -50 }}><polygon points="0,0 60,0 10,55" fill="#fff" /></svg>
    </div>
  );
};
// polvo que sube del lijado (partículas deterministas)
const Dust: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = e(t, at, at + 0.3) * (1 - e(t, out, out + 0.4));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, pointerEvents: "none" }}>
      {Array.from({ length: 60 }, (_, i) => { const r = (n: number) => { const v = Math.sin(i * 91.7 + n * 13.1) * 43758.5; return v - Math.floor(v); }; const ph = ((t - at) * (0.25 + r(1) * 0.3) + r(2)) % 1;
        return <div key={i} style={{ position: "absolute", left: x + (r(3) - 0.5) * 700 + ph * 120 * (r(4) - 0.5), top: y - ph * 420, width: 6 + r(5) * 14, height: 6 + r(5) * 14, borderRadius: "50%", background: "rgba(235,220,190,.7)", opacity: Math.sin(ph * Math.PI) * 0.8, filter: "blur(2px)" }} />; })}
    </div>
  );
};
// 7 cabezas de tabla con los anillos: cada otra gira 180° (arriba / abajo / arriba)
const EndGrain: React.FC<{ t: number; at: number; flip: number; out: number; labels: number[] }> = ({ t, at, flip, out, labels }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 960, top: 560, opacity: o, transform: "translate(-50%,-50%)", display: "flex", gap: 10 }}>
      {Array.from({ length: 7 }, (_, i) => {
        const fl = i % 2 ? ei(t, flip + i * 0.06, flip + i * 0.06 + 0.45) : 0;
        const lab = i % 2 ? labels[1] : i === 0 ? labels[0] : labels[2];
        return (
          <div key={i} style={{ position: "relative" }}>
            <svg width={220} height={130} viewBox="0 0 220 130" style={{ transform: `rotate(${fl * 180}deg)`, filter: "drop-shadow(0 16px 20px rgba(0,0,0,.55))" }}>
              <rect x={0} y={0} width={220} height={130} rx={6} fill="#d9b07a" />
              {[0, 1, 2, 3, 4].map((j) => <path key={j} d={`M ${10 + j * 8} 130 A ${170 - j * 26} ${150 - j * 24} 0 0 1 ${210 - j * 8} 130`} fill="none" stroke="#8d5e2e" strokeWidth={5} opacity={0.75} transform="translate(0 -20)" />)}
            </svg>
            {t > lab && <div style={{ position: "absolute", left: "50%", top: i % 2 ? 160 : -90, transform: `translateX(-50%) scale(${Math.min(1.1, spr(t, lab))})`, fontFamily: FONT, fontWeight: 900, fontSize: 60, color: i % 2 ? COL.ice : COL.amber, textShadow: extrude(5, "rgba(0,0,0,.6)") }}>{i % 2 ? "▼" : "▲"}</div>}
          </div>
        );
      })}
    </div>
  );
};
// gota de cola que se dibuja por los cantos + precio colgado
const GlueBead: React.FC<{ t: number; at: number; out: number; x: number; y: number; w: number }> = ({ t, at, out, x, y, w }) => {
  const o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const d = ei(t, at, at + 1.2);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o, filter: "drop-shadow(0 0 10px rgba(255,236,150,.9))" }}>
      {[0, 1, 2].map((i) => <path key={i} d={`M ${x} ${y + i * 70} C ${x + w * 0.3} ${y + i * 70 - 10}, ${x + w * 0.6} ${y + i * 70 + 10}, ${x + w} ${y + i * 70}`} fill="none" stroke="#fff3b0" strokeWidth={12} strokeLinecap="round" strokeDasharray={w * 1.1} strokeDashoffset={w * 1.1 * (1 - Math.max(0, Math.min(1, d * 3 - i)))} />)}
    </svg>
  );
};
// flechas de cuña que empujan hacia adentro (presión) + "PRESS"
const WedgeArrows: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const p = Math.sin((t - at) * 7) * 10;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o }}>
      {[-1, 1].map((s) => <svg key={s} width={220} height={140} style={{ position: "absolute", left: s < 0 ? -420 + p : 200 - p, top: -70, transform: s > 0 ? "scaleX(-1)" : undefined, filter: "drop-shadow(0 10px 16px rgba(0,0,0,.6))" }}><polygon points="0,30 150,30 150,0 220,70 150,140 150,110 0,110" fill={COL.amber} /></svg>)}
      <div style={{ position: "absolute", left: -110, top: -60, fontFamily: FONT, fontWeight: 900, fontSize: 90, color: COL.ink, textShadow: extrude(7, "rgba(0,0,0,.6)") }}>FLAT</div>
    </div>
  );
};
// plano azul del bastidor: 2 largueros de 48" + 3 travesaños de 19", con las 6 juntas que se encienden
const Blueprint: React.FC<{ t: number; at: number; short: number; joints: number; out: number }> = ({ t, at, short, joints, out }) => {
  const o = e(t, at, at + 0.25) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const L1 = ei(t, at + 0.3, at + 1.0), S = (i: number) => ei(t, short + i * 0.4, short + i * 0.4 + 0.4);
  const J = [[200, 160], [1100, 160], [200, 520], [1100, 520], [650, 160], [650, 520]];
  return (
    <div style={{ position: "absolute", left: 960, top: 560, opacity: o, transform: "translate(-50%,-50%) perspective(1600px) rotateX(18deg)" }}>
      <svg width={1300} height={700} viewBox="0 0 1300 700" style={{ background: "#123a63", borderRadius: 18, boxShadow: "0 50px 90px rgba(0,0,0,.7)" }}>
        {Array.from({ length: 27 }, (_, i) => <line key={"v" + i} x1={i * 50} y1={0} x2={i * 50} y2={700} stroke="rgba(255,255,255,.08)" />)}
        {Array.from({ length: 15 }, (_, i) => <line key={"h" + i} x1={0} y1={i * 50} x2={1300} y2={i * 50} stroke="rgba(255,255,255,.08)" />)}
        <rect x={150} y={130} width={1000 * L1} height={60} fill="none" stroke="#fff" strokeWidth={5} />
        <rect x={150} y={490} width={1000 * L1} height={60} fill="none" stroke="#fff" strokeWidth={5} />
        {L1 > 0.95 && <text x={600} y={100} fill="#fff" fontFamily="Arial" fontWeight={900} fontSize={48}>48"</text>}
        {[175, 625, 1075].map((x, i) => <rect key={i} x={x} y={190} width={50} height={300 * S(i)} fill="none" stroke="#9fd3ff" strokeWidth={5} />)}
        {S(0) > 0.95 && <text x={250} y={360} fill="#9fd3ff" fontFamily="Arial" fontWeight={900} fontSize={48}>19"</text>}
        {J.map(([x, y], i) => t > joints + i * 0.15 && <circle key={i} cx={x} cy={y} r={34} fill="none" stroke={COL.amber} strokeWidth={8} opacity={0.6 + 0.4 * Math.sin(t * 6 + i)} />)}
      </svg>
      {t > joints && <div style={{ position: "absolute", left: 0, right: 0, top: 720, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 64, color: COL.amber, letterSpacing: 6, textShadow: extrude(6, "rgba(0,0,0,.6)") }}>6 JOINTS · NO SCREWS</div>}
    </div>
  );
};
// caja y espiga despiezadas (CSS 3D) con cotas que entran por palabra
const MortiseTenon: React.FC<{ t: number; at: number; mort: number; deep: number; third: number; ten: number; out: number }> = ({ t, at, mort, deep, third, ten, out }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const tk = ei(t, ten - 0.3, ten + 0.5), ry = -28 + 6 * Math.sin((t - at) * 0.5);
  return (
    <div style={{ position: "absolute", left: 960, top: 560, transform: "translate(-50%,-50%)", opacity: o }}>
      <div style={{ position: "relative", width: 1100, height: 600, perspective: 1700 }}>
        <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateX(-16deg) rotateY(${ry}deg)` }}>
          <Block x={620} y={40} w={180} h={520} d={180} grain="v" />
          <div style={{ position: "absolute", left: 690, top: 230, width: 40, height: 130, background: "#1e1206", transform: "translateZ(91px)", boxShadow: t > mort ? `0 0 0 5px ${COL.amber}` : undefined }} />
          <div style={{ position: "absolute", left: 0, top: 0, width: 1100, height: 600, transformStyle: "preserve-3d", transform: `translateX(${-220 * (1 - tk)}px)`, opacity: t > ten - 0.3 ? 1 : 0 }}>
            <Block x={60} y={220} w={420} h={150} d={120} grain="h" tone={4} />
            <Block x={480} y={255} w={130} h={80} d={40} grain="h" tone={10} />
          </div>
        </div>
        {t > mort && <div style={{ position: "absolute", left: 830, top: 120, fontFamily: FONT, fontWeight: 900, fontSize: 64, color: COL.amber, textShadow: extrude(6, "rgba(0,0,0,.6)"), transform: `scale(${Math.min(1.08, spr(t, mort))})` }}>MORTISE</div>}
        {t > deep && <div style={{ position: "absolute", left: 830, top: 200, fontFamily: FONT, fontWeight: 800, fontSize: 44, color: COL.ink, textShadow: extrude(4, "rgba(0,0,0,.6)") }}>1½" DEEP</div>}
        {t > third && <div style={{ position: "absolute", left: 830, top: 255, fontFamily: FONT, fontWeight: 800, fontSize: 44, color: COL.ink, textShadow: extrude(4, "rgba(0,0,0,.6)") }}>⅓ OF THE BOARD</div>}
        {t > ten && <div style={{ position: "absolute", left: 150, top: 430, fontFamily: FONT, fontWeight: 900, fontSize: 64, color: COL.ice, textShadow: extrude(6, "rgba(0,0,0,.6)"), transform: `scale(${Math.min(1.08, spr(t, ten))})` }}>TENON</div>}
      </div>
    </div>
  );
};
// fila de agujeros (armónica) dentro del rectángulo marcado
const HoleRow: React.FC<{ t: number; at: number; mark: number; out: number; x: number; y: number }> = ({ t, at, mark, out, x, y }) => {
  const o = e(t, mark, mark + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const n = 8, W2 = 760, H2 = 130;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)" }}>
      <svg width={W2 + 40} height={H2 + 40} style={{ overflow: "visible", filter: "drop-shadow(0 10px 18px rgba(0,0,0,.6))" }}>
        <rect x={20} y={20} width={W2} height={H2} fill="rgba(20,12,6,.35)" stroke="#fff" strokeWidth={5} strokeDasharray={2 * (W2 + H2)} strokeDashoffset={2 * (W2 + H2) * (1 - e(t, mark, mark + 0.6))} />
        {Array.from({ length: n }, (_, i) => { const a = at + i * 0.32; if (t < a) return null; const k = Math.min(1, spr(t, a, 1.4)); return <circle key={i} cx={20 + 48 + i * ((W2 - 96) / (n - 1))} cy={20 + H2 / 2} r={44 * k} fill="#1e1206" stroke={COL.amber} strokeWidth={4} />; })}
      </svg>
    </div>
  );
};
// cronómetro de taller (5 min de caja)
const Stopwatch: React.FC<{ t: number; at: number; out: number; x: number; y: number; min: number }> = ({ t, at, out, x, y, min }) => {
  const k = spr(t, at, 1.0), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const a = ei(t, at + 0.2, at + 1.6) * 360 * (min / 60) * 12;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${Math.min(1.05, k)})` }}>
      <svg width={300} height={340} viewBox="0 0 300 340" style={{ filter: "drop-shadow(0 20px 30px rgba(0,0,0,.6))" }}>
        <rect x={130} y={0} width={40} height={40} rx={6} fill="#c9ccd1" />
        <circle cx={150} cy={190} r={140} fill="#f4efe6" stroke="#2a2a2a" strokeWidth={14} />
        <path d={`M 150 190 L 150 60 A 130 130 0 ${a > 180 ? 1 : 0} 1 ${150 + Math.sin(a * Math.PI / 180) * 130} ${190 - Math.cos(a * Math.PI / 180) * 130} Z`} fill="rgba(255,178,87,.55)" />
        <line x1={150} y1={190} x2={150 + Math.sin(a * Math.PI / 180) * 115} y2={190 - Math.cos(a * Math.PI / 180) * 115} stroke="#b3261e" strokeWidth={8} strokeLinecap="round" />
      </svg>
      <div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 70, color: COL.ink, textShadow: extrude(6, "rgba(0,0,0,.6)") }}>{min} MIN</div>
    </div>
  );
};
// medidor de ajuste: FLOJO · FIRME · A MARTILLAZOS (la aguja se queda en FIRME)
const FitGauge: React.FC<{ t: number; at: number; firm: number; beat: number; out: number; x: number; y: number }> = ({ t, at, firm, beat, out, x, y }) => {
  const o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const target = t < firm ? -60 : t < beat ? 0 : t < beat + 0.5 ? 60 : 0;
  const ang = target * ei(t, at, at + 0.4) + Math.sin(t * 9) * 3;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)" }}>
      <svg width={560} height={330} viewBox="0 0 560 330" style={{ filter: "drop-shadow(0 20px 30px rgba(0,0,0,.6))" }}>
        <path d="M 40 300 A 240 240 0 0 1 520 300" fill="none" stroke="#3a3d42" strokeWidth={60} />
        <path d="M 40 300 A 240 240 0 0 1 160 92" fill="none" stroke="#8fd6ff" strokeWidth={50} />
        <path d="M 200 72 A 240 240 0 0 1 360 72" fill="none" stroke="#24c27a" strokeWidth={50} />
        <path d="M 400 92 A 240 240 0 0 1 520 300" fill="none" stroke="#ff4a3d" strokeWidth={50} />
        <line x1={280} y1={300} x2={280 + Math.sin(ang * Math.PI / 180) * 210} y2={300 - Math.cos(ang * Math.PI / 180) * 210} stroke="#f4efe6" strokeWidth={12} strokeLinecap="round" />
        <circle cx={280} cy={300} r={22} fill="#f4efe6" />
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", width: 560, fontFamily: FONT, fontWeight: 900, fontSize: 32, color: COL.ink, letterSpacing: 2 }}><span>LOOSE</span><span style={{ color: "#24c27a" }}>FIRM ✓</span><span>BEAT IT IN</span></div>
    </div>
  );
};
// los dos agujeros corridos: el de la espiga se corre 1/16" hacia el hombro (lupa con la moneda como escala)
const OffsetHoles: React.FC<{ t: number; at: number; shift: number; dime: number; out: number }> = ({ t, at, shift, dime, out }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const s = ei(t, shift, shift + 0.6) * 46;
  return (
    <div style={{ position: "absolute", left: 960, top: 540, opacity: o, transform: "translate(-50%,-50%)" }}>
      <svg width={1100} height={620} viewBox="0 0 1100 620" style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,.6))" }}>
        <rect x={0} y={0} width={1100} height={620} rx={30} fill="#d9b07a" />
        <rect x={520} y={0} width={580} height={620} fill="#c79c66" />
        <line x1={520} y1={0} x2={520} y2={620} stroke="#5e3a1a" strokeWidth={8} />
        <text x={540} y={60} fontFamily="Arial" fontWeight={900} fontSize={34} fill="#5e3a1a">SHOULDER</text>
        <circle cx={780} cy={310} r={110} fill="none" stroke="#1e1206" strokeWidth={10} strokeDasharray="22 12" />
        <circle cx={780 - s} cy={310} r={110} fill="rgba(30,18,6,.75)" stroke={COL.amber} strokeWidth={10} />
        {s > 2 && <g><line x1={780 - s} y1={460} x2={780} y2={460} stroke={COL.red} strokeWidth={8} /><text x={640} y={540} fontFamily="Arial" fontWeight={900} fontSize={72} fill={COL.red}>1/16"</text></g>}
        {t > dime && <g transform={`translate(160 310) scale(${Math.min(1.05, spr(t, dime))})`}><circle r={120} fill="#c9ccd1" stroke="#8f969e" strokeWidth={10} /><circle r={150} fill="none" stroke="#c9ccd1" strokeWidth={30} strokeDasharray="10 14" opacity={0.6} /><text x={-62} y={18} fontFamily="Arial" fontWeight={900} fontSize={50} fill="#5a5f66">1½ ¢</text></g>}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: -110, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 80, color: COL.amber, letterSpacing: 6, textShadow: extrude(7, "rgba(0,0,0,.6)") }}>THE WHOLE SECRET</div>
    </div>
  );
};
// corte de la junta: la clavija entra doblándose por los agujeros corridos y CIERRA el hombro (la luz se va a cero)
const PegBend: React.FC<{ t: number; at: number; pull: number; dead: number; out: number }> = ({ t, at, pull, dead, out }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const pin = ei(t, at, pull + 0.3), gap = 40 * (1 - ei(t, pull, dead)), bendX = 30 * Math.sin(Math.PI * Math.min(1, pin));
  const glow = e(t, dead, dead + 0.15) * (1 - e(t, dead + 0.6, dead + 1.2));
  return (
    <div style={{ position: "absolute", left: 960, top: 560, opacity: o, transform: "translate(-50%,-50%)" }}>
      <svg width={1200} height={700} viewBox="0 0 1200 700" style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,.6))" }}>
        <rect x={600} y={60} width={300} height={580} fill="#c99a63" />
        <rect x={600} y={220} width={200} height={260} fill="#2b1a0c" />
        <g transform={`translate(${-gap} 0)`}>
          <rect x={100} y={180} width={500} height={340} fill="#d9b07a" />
          <rect x={600} y={225} width={196} height={250} fill="#e0bb88" />
        </g>
        {gap > 1 && <rect x={600 - gap} y={180} width={gap} height={340} fill={COL.red} opacity={0.55} />}
        <path d={`M ${700} 0 Q ${700 - bendX} 350 ${700} ${60 + 620 * pin}`} stroke="#8a5a2e" strokeWidth={46} fill="none" strokeLinecap="round" />
        <path d={`M ${700} 0 Q ${700 - bendX} 350 ${700} ${60 + 620 * pin}`} stroke={`rgba(255,200,110,${glow})`} strokeWidth={70} fill="none" strokeLinecap="round" opacity={0.6} />
      </svg>
      {t > dead && <div style={{ position: "absolute", left: 40, top: 560, fontFamily: FONT, fontWeight: 900, fontSize: 84, color: "#24c27a", letterSpacing: 6, textShadow: extrude(7, "rgba(0,0,0,.6)"), transform: `scale(${Math.min(1.08, spr(t, dead))})`, transformOrigin: "0 50%" }}>DEAD TIGHT</div>}
      {t > at + 0.5 && t < dead && <div style={{ position: "absolute", left: 760, top: 20, fontFamily: FONT, fontWeight: 900, fontSize: 56, color: COL.amber, textShadow: extrude(5, "rgba(0,0,0,.6)") }}>THE PEG BENDS →</div>}
    </div>
  );
};
// veta: aserrada (corta en diagonal, se parte) vs rajada (corre derecha)
const GrainCompare: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const peg = (sawn: boolean, x: number, lbl: string, ok: boolean, a: number) => (
    <div style={{ position: "absolute", left: x, top: 0, opacity: e(t, a, a + 0.2), transform: `translateY(${(1 - Math.min(1, spr(t, a))) * 80}px)` }}>
      <svg width={260} height={640} viewBox="0 0 260 640" style={{ filter: "drop-shadow(0 20px 30px rgba(0,0,0,.6))" }}>
        <defs><clipPath id={"pc" + x}><path d="M 80 0 L 180 0 L 180 520 L 130 640 L 80 520 Z" /></clipPath></defs>
        <path d="M 80 0 L 180 0 L 180 520 L 130 640 L 80 520 Z" fill="#d9b07a" />
        <g clipPath={`url(#pc${x})`}>{Array.from({ length: 14 }, (_, i) => sawn ? <line key={i} x1={-200 + i * 50} y1={0} x2={100 + i * 50} y2={640} stroke="#8d5e2e" strokeWidth={5} /> : <line key={i} x1={86 + i * 7} y1={0} x2={86 + i * 7} y2={640} stroke="#8d5e2e" strokeWidth={4} />)}</g>
      </svg>
      <div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 52, color: ok ? "#24c27a" : COL.red, textShadow: extrude(5, "rgba(0,0,0,.6)"), whiteSpace: "nowrap" }}>{ok ? "✓ " : "✗ "}{lbl}</div>
    </div>
  );
  return <div style={{ position: "absolute", left: 960 - 330, top: 150, width: 660, height: 800, opacity: o }}>{peg(true, 0, "SAWN", false, at)}{peg(false, 400, "SPLIT", true, at + 0.6)}</div>;
};
// tablero de 12 clavijas que se van llenando (6 juntas × 2)
const PegBoard: React.FC<{ t: number; at: number; at2: number; out: number; x: number; y: number }> = ({ t, at, at2, out, x, y }) => {
  const o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const n = Math.floor(ei(t, at2, at2 + 1.0) * 12);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, padding: "26px 34px", borderRadius: 24, background: "rgba(20,14,8,.82)", boxShadow: "0 30px 60px rgba(0,0,0,.6)", fontFamily: FONT }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 80px)", gap: 18 }}>
        {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ width: 80, height: 80, borderRadius: "50%", background: i < n ? "radial-gradient(circle at 40% 35%, #d9a66a, #7a4c22)" : "rgba(255,255,255,.08)", boxShadow: i < n ? "0 0 0 4px #3e2410, 0 8px 14px rgba(0,0,0,.5)" : "inset 0 0 0 3px rgba(255,255,255,.2)", transform: `scale(${i === n - 1 ? 1.15 : 1})` }} />)}
      </div>
      <div style={{ marginTop: 18, textAlign: "center", fontWeight: 900, fontSize: 56, color: COL.amber, letterSpacing: 4 }}>6 JOINTS · {Math.max(n, t > at2 ? n : 0)} PEGS</div>
    </div>
  );
};
const Dark: React.FC<{ o: number }> = ({ o }) => (o > 0.005 ? <AbsoluteFill style={{ background: `rgba(8,6,4,${o})` }} /> : null);
const Fade: React.FC<{ t: number; a: number; b: number; children: React.ReactNode }> = ({ t, a, b, children }) => <AbsoluteFill style={{ opacity: e(t, a, b) }}>{children}</AbsoluteFill>;
const Grad: React.FC<{ c1: string; c2: string }> = ({ c1, c2 }) => <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 42%, ${c1}, ${c2})` }} />;

// ================= TRAMO 2 =================
export const seg2 = (t: number, L: React.ReactNode[], World: (k: string) => React.ReactNode) => {
  const K = K2; // dentro de cada tramo las claves que lo rodean son todas de K2
  // --- (cuaderno en la pág. 12 hasta 260) ... avatar 260,2-263,9 → cotas 48 / 22 con cinta en el banco → espejo de la camioneta ---
  if (t >= 263.7 && t < 274.7) {
    L.push(World("w4"));
    L.push(<Tape3D key="tp48" t={t} at={T.why48} out={T.mirror - 0.4} a={[B.x0 + B.d + 0.05, B.y + 0.12, B.z - 2]} b={[B.x0 + B.d + 0.05, B.y + 0.12, B.z + 2]} label={'48"'} K={K} />);
    L.push(<BigWord key="ns" t={t} at={T.splice} out={T.why22 - 0.2} txt="NO SPLICE" x={1500} y={240} col={COL.amber} size={90} rot={4} />);
    L.push(<Tape3D key="tp22" t={t} at={T.why22} out={T.mirror - 0.4} a={[B.x0, B.y + 0.12, B.z - 2.05]} b={[B.x0 + B.d, B.y + 0.12, B.z - 2.05]} label={'22"'} K={K} />);
    const m = scr(K, t, PT.truckMirror);
    if (t > T.mirror) L.push(<div key="mr" style={{ position: "absolute", left: m.x - 90, top: m.y - 90, width: 180, height: 180, borderRadius: "50%", boxShadow: `0 0 0 8px #24c27a, 0 0 40px #24c27a`, opacity: e(t, T.mirror, T.mirror + 0.2) * (1 - e(t, 274.2, 274.5)) }} />);
    L.push(<BigWord key="clr" t={t} at={T.mirror + 0.3} out={274.2} txt="CLEARS THE MIRROR ✓" x={960} y={180} col="#24c27a" size={80} rot={0} />);
  }
  // --- (avatar 274,5-280,3 36" de cocina) → la muñeca: regla de altura ---
  if (t >= 280.1 && t < 292.3) {
    L.push(<Pic key="wr" id="r11_wrist" t={t} a={280.1} mv="up" />);
    L.push(<BigWord key="on" t={t} at={T.onions - 0.2} out={T.stand - 0.1} txt="NOT FOR ONIONS" x={1400} y={220} col={COL.ink} size={86} rot={4} strike={T.onions + 0.4} />);
    L.push(<HeightRuler key="hr" t={t} at={T.floor - 0.4} out={292.0} x={1560} top={110} bottom={1010} k36={T.floor} k34={T.h34} x36={T.floor - 0.1} />);
  }
  // --- (avatar 292,1-296,5) → la tabla cruda de perfil → la cerca ---
  if (t >= 296.3 && t < 308.0) {
    L.push(<Grad key="g1" c1="#3a2c20" c2="#100b07" />);
    L.push(<RoughProfile key="rp" t={t} at={296.3} cupped={T.cupped} dirty={T.dirty} edges={T.edges} out={T.trick - 0.3} />);
    L.push(<BigWord key="nj" t={t} at={T.joiner} out={T.trick - 0.3} txt="NO JOINER · NO PLANER" x={960} y={170} col={COL.red} size={70} rot={0} />);
    L.push(<Fade key="fn" t={t} a={T.trick - 0.3} b={T.trick}><Pic id="r12_fence" t={t} a={T.trick - 0.3} mv="in" ox="50% 60%" /></Fade>);
    L.push(<CutLine key="cl" t={t} at={T.fence} out={307.7} x1={260} y1={700} x2={1660} y2={600} label="STRINGER = FENCE" />);
  }
  // --- (avatar 307,8-312,6) → 7 tablas iguales de 3¼" → lijado que destapa ---
  if (t >= 312.4 && t < 327.3) {
    L.push(<Grad key="g2" c1="#2c2a33" c2="#0c0b0f" />);
    L.push(<SameBoards key="sb" t={t} at={312.5} dimAt={T.w314} out={T.sanding - 0.3} />);
    L.push(<BigWord key="sq" t={t} at={T.square} out={T.sanding - 0.3} txt="CLEAN · SQUARE" x={960} y={960} col={COL.ink} size={70} rot={0} />);
    L.push(<Fade key="sd" t={t} a={T.sanding - 0.3} b={T.sanding}><SandWipe t={t} at={T.gray} dur={2.6}><Pic id="r13_sanding" t={t} a={T.sanding - 0.3} mv="l" /></SandWipe></Fade>);
    L.push(<BigWord key="80" t={t} at={T.grit} out={327.0} txt="80 GRIT" x={330} y={190} col={COL.amber} size={110} rot={-6} />);
  }
  // --- (avatar 327,1-331,6) → "eso no es pallet" / "sí lo es" → máscara y polvo ---
  if (t >= 331.4 && t < 343.8) {
    L.push(<Pic key="hn" id="n06_honey" t={t} a={331.4} mv="out" />);
    L.push(<Bubble key="bb" t={t} at={T.notP - 0.3} out={T.mask - 0.4} x={700} y={260} txt="“That's not pallet wood!”" />);
    L.push(<BigWord key="yes" t={t} at={T.yes} out={T.mask - 0.4} txt="YES IT IS." x={1300} y={700} col={COL.amber} size={140} rot={-5} />);
    L.push(<Fade key="mk" t={t} a={T.mask - 0.4} b={T.mask}><Grad c1="#4a3a28" c2="#120d08" /></Fade>);
    L.push(<Dust key="du" t={t} at={T.mask} out={343.5} x={960} y={760} />);
    L.push(<BigWord key="lg" t={t} at={T.lungs - 0.3} out={343.5} txt="NOT IN YOUR LUNGS" x={960} y={180} col={COL.ink} size={80} rot={0} />);
  }
  // --- (avatar 343,6-348,6) → los anillos de la punta → se dan vuelta ---
  if (t >= 348.4 && t < 360.2) {
    const gK = e(t, T.arcs + 0.2, T.arcs + 0.6);
    L.push(<Pic key="rg" id="r14_rings" t={t} a={348.4} mv="in" ox="50% 45%" />);
    L.push(<Dark key="dk" o={0.82 * gK} />);
    L.push(<EndGrain key="eg" t={t} at={T.arcs + 0.3} flip={T.flipE} out={360.0} labels={[T.up, T.down, T.up2]} />);
    L.push(<BigWord key="ss" t={t} at={T.seasons - 0.2} out={360.0} txt="THEY CANCEL OUT" x={960} y={890} col={COL.ice} size={80} rot={0} />);
  }
  // --- (avatar 360-364,8) → cola $6 → cuñas ---
  if (t >= 364.6 && t < 378.6) {
    L.push(<Pic key="gl" id="r15_glue" t={t} a={364.6} mv="r" />);
    L.push(<BigWord key="g6" t={t} at={T.g6} out={T.cauls - 0.3} txt="$6" x={1600} y={260} col={COL.amber} size={200} rot={8} />);
    L.push(<GlueBead key="gb" t={t} at={T.edge} out={T.cauls - 0.3} x={380} y={640} w={1150} />);
    L.push(<Fade key="wd" t={t} a={T.cauls - 0.3} b={T.cauls}><Pic id="r16_wedges" t={t} a={T.cauls - 0.3} mv="in" /></Fade>);
    L.push(<WedgeArrows key="wa" t={t} at={T.flat - 0.2} out={378.3} x={960} y={300} />);
    L.push(<BigWord key="nfc" t={t} at={T.noClamps} out={378.3} txt="NO FANCY CLAMPS" x={960} y={930} col={COL.red} size={80} rot={0} />);
  }
  // --- (avatar 378,4-383,6) → el plano del bastidor sobre el mundo ---
  if (t >= 383.4 && t < 396.0) {
    L.push(World("w5"));
    L.push(<Dark key="dk2" o={0.45} />);
    L.push(<Blueprint key="bp" t={t} at={383.5} short={T.short} joints={T.joint} out={395.7} />);
  }
  // --- (avatar 395,8-399,2 drawbore) → granero de 200 años → caja y espiga ---
  if (t >= 399.0 && t < 412.7) {
    const jK = e(t, T.how - 0.3, T.how);
    L.push(<Pic key="bn" id="n08_drawbore" t={t} a={399.0} mv="up" />);
    L.push(<BigWord key="200" t={t} at={T.y200 - 0.1} out={T.how - 0.3} txt="200 YEARS" x={1340} y={260} col={COL.ink} size={150} rot={-3} />);
    L.push(<Fade key="mt0" t={t} a={T.how - 0.3} b={T.how}><Grad c1="#3b2c1e" c2="#120c08" /></Fade>);
    if (jK > 0) L.push(<MortiseTenon key="mt" t={t} at={T.how} mort={T.mortise} deep={T.deep15} third={T.third} ten={T.tenon - 0.6} out={412.4} />);
  }
  // --- (avatar 412,5-415,7) → marcar + agujeros de armónica ---
  if (t >= 415.5 && t < 428.6) {
    L.push(<Pic key="dr" id="r17_drill" t={t} a={415.5} mv="in" ox="50% 55%" />);
    L.push(<Dark key="dk3" o={0.35 * e(t, T.mark - 0.2, T.mark)} />);
    L.push(<HoleRow key="hr2" t={t} at={T.row} mark={T.mark} out={428.3} x={960} y={300} />);
    L.push(<BigWord key="hm" t={t} at={T.harm} out={428.3} txt="LIKE A HARMONICA" x={960} y={880} col={COL.amber} size={86} rot={0} />);
  }
  // --- (avatar 428,4-431,7) → paredes rectas, no hacer palanca, 5 min ---
  if (t >= 431.5 && t < 442.3) {
    L.push(<Pic key="ch" id="r18_chisel" t={t} a={431.5} mv="out" />);
    L.push(<BigWord key="sd" t={t} at={T.walls} out={T.pry - 0.1} txt="STRAIGHT DOWN" x={960} y={180} col={COL.ink} size={90} rot={0} />);
    L.push(<BigWord key="pr" t={t} at={T.pry} out={T.min5 - 0.2} txt="DON'T PRY" x={1400} y={300} col={COL.red} size={120} rot={6} strike={undefined} />);
    L.push(<Stopwatch key="sw" t={t} at={T.min5 - 0.1} out={442.0} x={1540} y={520} min={5} />);
  }
  // --- (avatar 442,1-446,6) → el ajuste firme → agujero de 3/8 ---
  if (t >= 446.4 && t < 459.9) {
    L.push(<Pic key="tn" id="r19_tenon" t={t} a={446.4} mv="in" />);
    L.push(<FitGauge key="fg" t={t} at={T.fit} firm={T.firm} beat={T.beat} out={T.apart - 0.3} x={1460} y={320} />);
    L.push(<Fade key="mk2" t={t} a={T.apart - 0.3} b={T.apart}><Pic id="r20_mark" t={t} a={T.apart - 0.3} mv="r" /></Fade>);
    L.push(<BigWord key="38" t={t} at={T.e38} out={459.6} txt={'3/8"'} x={420} y={260} col={COL.amber} size={170} rot={-6} />);
    L.push(<BigWord key="th" t={t} at={T.side} out={459.6} txt="RIGHT THROUGH THE SIDE" x={960} y={930} col={COL.ink} size={64} rot={0} />);
  }
  // --- (avatar 459,7-464,4) → EL SECRETO: 1/16" corrido ---
  if (t >= 464.2 && t < 476.6) {
    L.push(<Pic key="dm" id="r21_dime" t={t} a={464.2} mv="in" />);
    L.push(<Dark key="dk4" o={0.8 * e(t, T.secret, T.secret + 0.4)} />);
    L.push(<OffsetHoles key="oh" t={t} at={T.secret + 0.2} shift={T.s16} dime={T.dime} out={476.3} />);
    L.push(<BigWord key="hr" t={t} at={T.hair} out={476.3} txt="OFF JUST A HAIR" x={960} y={980} col={COL.ice} size={70} rot={0} />);
  }
  // --- (avatar 476,4-481,2) → la clavija dobla y TIRA ---
  if (t >= 481.0 && t < 492.1) {
    L.push(<Grad key="g3" c1="#3b2c1e" c2="#0d0906" />);
    L.push(<PegBend key="pb" t={t} at={481.0} pull={T.pullsIn} dead={T.dead} out={491.8} />);
    L.push(<BigWord key="wpw" t={t} at={T.wood - 0.1} out={491.8} txt="WOOD PULLING WOOD" x={960} y={140} col={COL.amber} size={80} rot={0} />);
  }
  // --- (avatar 491,9-495,4) → rajada vs aserrada → afilar → clavar → 12 clavijas ---
  if (t >= 495.2 && t < 509.3) {
    const wK = e(t, T.whittle - 0.3, T.whittle), dK = e(t, T.drive - 0.3, T.drive);
    L.push(<Pic key="hc" id="r22_hatchet" t={t} a={495.2} mv="in" />);
    L.push(<Dark key="dk5" o={0.7 * e(t, 495.3, 495.7) * (1 - wK)} />);
    L.push(<GrainCompare key="gc" t={t} at={495.4} out={T.whittle - 0.3} />);
    L.push(<Fade key="wh" t={t} a={T.whittle - 0.3} b={T.whittle}><Pic id="r23_whittle" t={t} a={T.whittle - 0.3} mv="in" ox="55% 45%" /></Fade>);
    L.push(<BigWord key="pc" t={t} at={T.pencil - 0.1} out={T.drive - 0.3} txt="LIKE A PENCIL" x={1400} y={220} col={COL.ink} size={76} rot={4} />);
    L.push(<Fade key="dv" t={t} a={T.drive - 0.3} b={T.drive}><Pic id="r24_drive" t={t} a={T.drive - 0.3} mv="r" /></Fade>);
    L.push(<BigWord key="fl" t={t} at={T.flush} out={T.six - 0.1} txt="CUT IT FLUSH" x={960} y={200} col={COL.amber} size={86} rot={0} />);
    if (dK > 0) L.push(<PegBoard key="pg" t={t} at={T.six - 0.2} at2={T.six} out={509.0} x={1080} y={560} />);
  }
};

// ================= encima del avatar (tramo 2) =================
const A = {
  w48: at("48 inches wide", 260), d22: at("22 inches deep", 262), wrong: at("gets wrong", 275), k36: at("36", 276), kitchen: at("kitchen counter", 278),
  back: at("your back will thank", 291), rough: at("come rough", 295), run: at("run your circular saw", 307), flip: at("flip the board", 311), honey: at("pale honey", 329),
  seven: at("seven deck boards", 346), oldT: at("an old trick", 348), flat: at("stays flat", 361), chip: at("potato chip", 363), wedges2: at("wedges", 377), never: at("never owned a bar clamp", 379), frame: at("now the frame", 381),
  drawb: at("called a drawbore", 396), timber: at("timber frame joint", 397), snug: at("nice and snug", 414), chisel: at("take your chisel", 428), clean: at("clean out", 429),
  twoCuts: at("two cuts", 442), knock: at("knock the waste", 444), touch: at("touch the tenon", 460), markIt: at("and mark it", 462), drive: at("drive a wooden peg", 479), splitA: at("i split them", 492), stringerS: at("oak stringer scrap", 493), m40: at("40 minutes", 510), stand: at("stand on that frame", 514),
};
export const AV2: Record<number, (t: number) => React.ReactNode> = {
  260: (t) => <Plank t={t} at={A.w48 - 0.1} out={263.6} big={'48" × 22"'} sub="THE TOP" />,
  275: (t) => <Plank t={t} at={A.k36 - 0.1} out={280.0} big={'36"? NO.'} sub="THAT'S THE KITCHEN COUNTER" col={COL.red} />,
  292: (t) => <Plank t={t} at={A.back - 0.3} out={296.2} big="WRIST HEIGHT" sub="YOUR BACK WILL THANK YOU" col="#1a7a4c" />,
  308: (t) => <Plank t={t} at={A.run - 0.1} out={312.3} big="SAW ALONG IT" sub="FLIP · MEASURE · CUT" />,
  327: (t) => <div style={{ position: "absolute", left: 80, top: 140, opacity: e(t, A.honey - 0.2, A.honey) * (1 - e(t, 331.2, 331.5)), display: "flex", gap: 14 }}>{["#e8c58f", "#d9ac6c", "#7a5230"].map((c, i) => <div key={i} style={{ width: 150, height: 220, borderRadius: 16, background: c, boxShadow: "0 20px 30px rgba(0,0,0,.5)", transform: `translateY(${(1 - Math.min(1, spr(t, A.honey + i * 0.12))) * -200}px)` }} />)}<div style={{ position: "absolute", top: 240, left: 0, fontFamily: FONT, fontWeight: 900, fontSize: 52, color: COL.ink, letterSpacing: 4, textShadow: extrude(5, "rgba(0,0,0,.6)"), whiteSpace: "nowrap" }}>PALE HONEY · DARK STREAKS</div></div>,
  344: (t) => <Plank t={t} at={A.seven - 0.1} out={348.3} big="7 BOARDS" sub="SIDE BY SIDE" />,
  360: (t) => <>{<Plank t={t} at={A.flat - 0.2} out={364.5} big="FLAT" sub="NOT A POTATO CHIP" col="#1a7a4c" />}<Polaroid t={t} at={A.chip - 0.2} out={364.5} img="n07_chip" x={330} y={700} cap="the potato chip" rot={-5} /></>,
  378: (t) => <Plank t={t} at={A.never - 0.2} out={383.3} big="WEDGES > CLAMPS" sub="GRANDDADDY'S WAY" />,
  396: (t) => <Plank t={t} at={A.drawb} out={398.9} big="THE DRAWBORE" sub="OLD TIMBER-FRAME JOINT" col={COL.red} />,
  412: (t) => <Plank t={t} at={A.snug - 0.2} out={415.4} big="NICE & SNUG" sub="MORTISE + TENON" />,
  428: (t) => <Plank t={t} at={A.chisel - 0.1} out={431.4} big="CHISEL IT OUT" sub="BETWEEN THE HOLES" />,
  442: (t) => <Plank t={t} at={A.twoCuts - 0.1} out={446.3} big="TENON = 2 CUTS" sub="SAW SET TO DEPTH" />,
  460: (t) => <Plank t={t} at={A.touch - 0.2} out={464.1} big="MARK IT" sub="BIT THROUGH THE HOLE" />,
  476: (t) => <Plank t={t} at={A.drive - 0.2} out={480.9} big="DRIVE THE PEG" sub="THROUGH OFFSET HOLES" col={COL.red} />,
  492: (t) => <Plank t={t} at={A.splitA - 0.1} out={495.1} big="SPLIT PEGS" sub="FROM AN OAK SCRAP" />,
  509: (t) => <Plank t={t} at={A.m40 - 0.2} out={514.3} big="40 MINUTES" sub="YOU COULD JUMP ON IT" />,
};

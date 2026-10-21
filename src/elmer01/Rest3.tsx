// elmer01 · RESTO tramo 3 (514 → 759 s): la tapa sobre el bastidor (cabezas de clavija) → el estante de abajo → el listón francés a 45°
// → tirafondos a los montantes (rayos X en el mundo) → bisagras de $12 → la pata que se pliega (corrida ¼" + pie redondeado) →
// el botón giratorio → la morsa en la esquina fuerte → el acabado (linaza 50/50) → los trapos que se prenden solos.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Key, BENCH } from "./garage3d";
import { at, Pic, scr } from "./core";
import { COL, FONT, e, ei, extrude, spr } from "./lib";
import { BigWord, Polaroid } from "./Rest1";
import { Plank } from "./Rest1av";

export const T3 = {
  jump: at("jump on it", 515), topOn: at("the top goes onto", 517), four: at("four more pegs", 519), down: at("straight down through", 520), round: at("round ends", 523), shows: at("it shows how", 526),
  shelf: at("put a shelf underneath", 528), decks: at("four deck boards", 532), across: at("laid across", 534), folded: at("bench is folded up", 537), still: at("still there", 539), drill: at("my drill", 541), square: at("my square", 542), coffee: at("coffee can", 543),
  depth: at("add any depth", 545), inside: at("sits inside the frame", 546), d2: at("$2", 548), m15: at("15 minutes", 549),
  hang: at("how does it hang", 550), second: at("second trick", 553), s5: at("5 seconds", 555), move: at("ever move", 556), cleat: at("french cleat", 558),
  rip45: at("set your circular saw", 565), deg45: at("to 45", 566), length: at("cut it lengthwise", 567), twoP: at("two long pieces", 569), slanted: at("slanted edge", 571), wallUp: at("slant pointing up", 573), facing: at("facing the wall", 574),
  lift: at("you lift the bench", 579), drop: at("drop it on", 580), lock: at("lock into each other", 581), heavier: at("the heavier you load", 583), tighter: at("the tighter it grabs", 584),
  wallP: at("the wall piece", 586), metal: at("use metal", 587), lags: at("four lag screws", 588), in3: at("three inches long", 589), d3: at("$3", 591),
  houses: at("most houses", 596), s16: at("every 16 inches", 597), magW: at("run a magnet along", 599), stick: at("it'll stick", 601), where: at("where the studs are", 603), markS: at("mark them", 604), pilot: at("pilot hole", 605), driveL: at("drive the lags", 606),
  folding: at("the folding part", 614), hinged: at("hinged to a ledger", 615), ledger: at("hangs on the cleat", 617), strap: at("strap hinges", 619), d12: at("twelve dollars", 620),
  backE: at("on the back edge", 625), swings: at("swings up", 627), flatW: at("flat against the wall", 628), thenLeg: at("then the leg", 629), oneLeg: at("one leg right", 630), twoS: at("two stringers glued", 633), faceF: at("face to face", 634), thick: at("three inches thick", 635),
  frontF: at("hinged to the front", 637), liftUp: at("lift the bench up", 639), dropD: at("drop the bench down", 642), legDown: at("the leg swings down", 643), lands: at("lands on the floor", 644),
  detail: at("important little detail", 646), quarter: at("one quarter inch longer", 649), round2: at("slight round", 652), rocks: at("it rocks past", 655), locks: at("and locks", 658),
  exactly: at("exactly to length", 661), foldUnder: at("fold under", 663), lean: at("lean on it", 664), hard: at("the hard way", 665), holdUp: at("hold the whole thing up", 667), turnB: at("turn button", 670),
  oak3: at("oak 3 inches long", 672), oneHole: at("one hole in the middle", 674), screw: at("one screw into", 675), turnS: at("it sideways", 677), lockedUp: at("locked up", 679), turnSt: at("turn it straight", 679), comesD: at("bench comes down", 681), barnD: at("barn doors", 683), y200: at("200 years", 684),
  vise: at("a vice on it", 686), corner: at("left front corner", 689), frameMeet: at("frame pieces meet", 692), notMid: at("not out in the middle", 693), strongest: at("the strongest spot", 696), onCleat: at("on the cleat", 699),
  bolted: at("bolted an old vice", 701), y1978: at("since 1978", 703), heavyV: at("it's heavy", 705), noCare: at("doesn't care one bit", 706),
  finish: at("about the finish", 708), burn: at("burn your house down", 710), listen: at("so listen", 712), poly: at("polyurethane", 713), slippery: at("slippery", 715), scratched: at("gets scratched", 716), terrible: at("looks terrible", 717),
  linseed: at("boiled linseed oil", 719), half: at("half and half", 720), wipeOn: at("wipe it on", 722), soak: at("let it soak", 723), wipeOff: at("wipe off everything", 725), coats: at("two coats", 727), wax: at("paste wax", 728),
  honey: at("deep honey color", 731), pops: at("glue just pops", 732), rags: at("but the rags", 734), heats: at("heats up", 736), pile: at("a pile of oily rags", 737),
  fire: at("catch fire all by itself", 740), night: at("middle of the night", 742), every: at("woodworkers every year", 744), layFlat: at("out flat", 747), concrete: at("on the concrete", 748), bucket: at("bucket of water", 751),
  wad: at("never wad them", 754), trash: at("throw them in the trash", 756), test: at("all right the test", 758),
};
const T = T3;
const B = BENCH;

// cámara del tramo 3: la tapa vista de arriba → la pared con los montantes (rayos X) → el banco que sube y baja → la esquina de la morsa
export const K3: Key[] = [
  { t: 518.9, p: [-5.4, 9.6, 5.0], l: [-8.8, 2.9, 2.0], fov: 36 },
  { t: 525.8, p: [-6.0, 8.8, 3.6], l: [-8.8, 2.9, 2.0], fov: 32 },
  // la pared desnuda: montantes cada 16" (596,5 → 607,9)
  { t: 596.4, p: [-2.8, 5.6, 9.0], l: [-10.0, 4.4, 1.0], fov: 46 },
  { t: T.magW, p: [-3.6, 5.0, 7.0], l: [-10.0, 4.6, 1.6], fov: 44, arc: 0.3 },
  { t: T.driveL, p: [-4.4, 4.9, 5.6], l: [-10.0, 4.4, 2.0], fov: 40 },
  { t: 608.0, p: [-4.6, 4.9, 5.2], l: [-10.0, 4.4, 2.0], fov: 40 },
  // la tapa que sube y baja (626,4 → 638,9)
  { t: 626.3, p: [-1.6, 5.0, 9.6], l: [-9.0, 3.2, 2.0], fov: 42 },
  { t: T.flatW + 0.4, p: [-1.4, 5.6, 8.4], l: [-9.2, 4.0, 2.0], fov: 42 },
  { t: T.oneLeg, p: [-3.6, 3.0, 7.0], l: [-8.2, 1.6, 2.0], fov: 40 },
  { t: 639.0, p: [-3.9, 2.8, 6.6], l: [-8.2, 1.5, 2.0], fov: 38 },
  // pata que baja y se traba (643,7 → 655,5) — a la altura del pie
  { t: 643.6, p: [-4.2, 2.6, 6.4], l: [-8.1, 1.2, 2.0], fov: 40 },
  { t: T.lands + 0.5, p: [-5.0, 1.5, 4.6], l: [-7.9, 0.6, 2.0], fov: 36 },
  { t: 655.5, p: [-5.3, 1.4, 4.2], l: [-7.9, 0.5, 2.0], fov: 34 },
  // el que se pliega solo (658,8 → 671,6): cámara de costado, después de frente al botón
  { t: 658.8, p: [-2.4, 3.6, 7.8], l: [-8.6, 2.0, 2.0], fov: 42 },
  { t: T.holdUp, p: [-2.2, 4.6, 8.2], l: [-9.4, 4.0, 2.0], fov: 42 },
  { t: 671.6, p: [-4.0, 6.0, 4.4], l: [-10.0, 6.6, 2.0], fov: 34 },
  { t: 675.1, p: [-4.2, 6.0, 4.2], l: [-10.0, 6.6, 2.0], fov: 34 },
  { t: T.comesD, p: [-2.6, 5.4, 7.6], l: [-9.0, 3.4, 2.0], fov: 40 },
  { t: 687.5, p: [-2.8, 5.8, 7.8], l: [-8.9, 2.9, 2.0], fov: 40 },
  // la esquina izquierda-delantera (691,3 → 701,3)
  { t: 691.3, p: [-5.4, 5.4, -2.6], l: [-8.0, 2.9, 0.4], fov: 40 },
  { t: T.onCleat, p: [-6.0, 4.6, -1.6], l: [-8.6, 2.9, 0.2], fov: 36, arc: 0.3 },
  { t: 701.3, p: [-6.1, 4.5, -1.4], l: [-8.6, 2.9, 0.2], fov: 35 },
  // la tapa aceitada (730,2 → 735,9)
  { t: 730.0, p: [-5.0, 7.2, 4.4], l: [-8.8, 2.9, 2.0], fov: 34 },
  { t: 736.0, p: [-5.6, 6.4, 3.4], l: [-8.8, 2.9, 2.0], fov: 30 },
];

// la tapa y la pata en este tramo (sube a la pared, baja, se pliega mal, se traba con el botón)
export const fold3 = (t: number): { fold: number; leg: number } | null => {
  if (t < 626 || t > 683) return null;
  // 1 = abierto (abajo), 0 = plegado contra la pared
  const up1 = ei(t, T.swings - 0.2, T.swings + 1.1), dn1 = ei(t, T.thenLeg + 0.3, T.thenLeg + 1.3);
  const up2 = ei(t, 640.0, 641.0), dn2 = ei(t, 643.4, 644.2);
  const up3 = ei(t, T.holdUp, T.holdUp + 1.2), dn3 = ei(t, T.comesD - 0.3, T.comesD + 0.8);
  const fold = 1 - up1 + dn1 - up2 + dn2 - up3 + dn3;
  const leg1 = 1 - ei(t, T.swings - 0.4, T.swings + 0.4) + ei(t, T.thenLeg + 0.9, T.thenLeg + 1.6);
  const leg2 = -ei(t, 639.6, 640.2) + ei(t, T.legDown, T.lands + 0.3);
  const fail = -ei(t, T.lean, T.lean + 0.25) + ei(t, T.hard + 0.3, T.hard + 0.9);
  const leg3 = -ei(t, T.holdUp - 0.3, T.holdUp + 0.3) + ei(t, T.comesD + 0.1, T.comesD + 0.9);
  return { fold: Math.max(0, Math.min(1, fold)), leg: Math.max(0, Math.min(1, leg1 + leg2 + fail + leg3)) };
};

// ================= PIEZAS NUEVAS =================
const Dark: React.FC<{ o: number }> = ({ o }) => (o > 0.005 ? <AbsoluteFill style={{ background: `rgba(8,6,4,${o})` }} /> : null);
const Fade: React.FC<{ t: number; a: number; b: number; children: React.ReactNode }> = ({ t, a, b, children }) => <AbsoluteFill style={{ opacity: e(t, a, b) }}>{children}</AbsoluteFill>;
const Grad: React.FC<{ c1: string; c2: string }> = ({ c1, c2 }) => <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 42%, ${c1}, ${c2})` }} />;
const sc = (t: number, a: number) => Math.min(1.08, spr(t, a));

// cabezas de clavija que asoman en la tapa (4 puntos sobre las juntas del bastidor, proyectados del mundo)
const PegHeads: React.FC<{ t: number; at: number; out: number; K: Key[] }> = ({ t, at, out, K }) => {
  const o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const pts: [number, number, number][] = [[B.x0 + 0.25, B.y + 0.1, B.z - 1.75], [B.x0 + 0.25, B.y + 0.1, B.z + 1.75], [B.x0 + B.d - 0.25, B.y + 0.1, B.z - 1.75], [B.x0 + B.d - 0.25, B.y + 0.1, B.z + 1.75]];
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      {pts.map((q, i) => { const s = scr(K, t, q), k = Math.min(1.1, spr(t, at + i * 0.18, 1.3));
        return <div key={i} style={{ position: "absolute", left: s.x - 30, top: s.y - 30, width: 60, height: 60, borderRadius: "50%", transform: `scale(${k})`, background: "radial-gradient(circle at 40% 35%, #e3b47a, #7a4c22)", boxShadow: `0 0 0 5px ${COL.amber}, 0 0 30px ${COL.amber}` }} />; })}
    </div>
  );
};
// corte lateral del banco: tapa con bisagra en la pared + estante dentro del bastidor; plegado se ve que el estante no agrega fondo
const FoldSection: React.FC<{ t: number; at: number; fold: number; items: number[]; out: number }> = ({ t, at, fold, items, out }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const a = -90 * ei(t, fold, fold + 1.2);
  const shelf = (
    <g>
      <rect x={0} y={-30} width={460} height={30} fill="#d9b07a" />
      <rect x={20} y={0} width={30} height={170} fill="#b98a55" /><rect x={410} y={0} width={30} height={170} fill="#b98a55" />
      <rect x={20} y={150} width={420} height={20} fill="#c99a63" stroke={COL.amber} strokeWidth={t > at + 0.6 ? 4 : 0} />
      {["DRILL", "SQUARE", "PEG CAN"].map((n, i) => t > items[i] && <g key={n} transform={`translate(${70 + i * 130} ${150 - 54 * Math.min(1, spr(t, items[i]))})`}><rect x={0} y={0} width={100} height={54} rx={8} fill={["#e0b23a", "#9aa1a8", "#8a5a2e"][i]} /><text x={50} y={34} textAnchor="middle" fontFamily="Arial" fontWeight={900} fontSize={18} fill="#1b1b1b">{n}</text></g>)}
    </g>
  );
  return (
    <div style={{ position: "absolute", left: 960, top: 560, opacity: o, transform: "translate(-50%,-50%)" }}>
      <svg width={1100} height={760} viewBox="0 0 1100 760" style={{ overflow: "visible", filter: "drop-shadow(0 30px 40px rgba(0,0,0,.6))" }}>
        <rect x={60} y={0} width={60} height={760} fill="#e6e0d4" />
        <rect x={0} y={740} width={1100} height={20} fill="#7d7a74" />
        <g transform={`translate(120 260) rotate(${a})`}>{shelf}</g>
        {t > fold + 1.2 && <g><line x1={130} y1={-10} x2={330} y2={-10} stroke="#24c27a" strokeWidth={6} /><text x={150} y={-30} fontFamily="Arial" fontWeight={900} fontSize={40} fill="#24c27a">+0" DEPTH</text></g>}
      </svg>
    </div>
  );
};
// pastilla de cuenta regresiva grande (5 SEGUNDOS para sacarlo de la pared)
const Seconds: React.FC<{ t: number; at: number; out: number; n: number; x: number; y: number }> = ({ t, at, out, n, x, y }) => {
  const o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const left = Math.max(0, n - Math.floor((t - at) * 2.4));
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${sc(t, at)})`, display: "flex", alignItems: "center", gap: 24, padding: "20px 40px", borderRadius: 100, background: "rgba(14,10,6,.86)", boxShadow: `0 0 0 6px ${COL.amber}, 0 30px 60px rgba(0,0,0,.6)`, fontFamily: FONT }}>
      <div style={{ fontWeight: 900, fontSize: 130, color: COL.amber, width: 100, textAlign: "center" }}>{left}</div>
      <div style={{ fontWeight: 900, fontSize: 52, color: COL.ink, letterSpacing: 4, lineHeight: 1 }}>SECONDS<br /><span style={{ fontSize: 30, color: COL.dim }}>OFF THE WALL</span></div>
    </div>
  );
};
// corte del listón francés: un larguero se parte a 45°, una mitad a la pared (punta arriba), otra al banco (punta abajo), caen y TRABAN
const Cleat: React.FC<{ t: number; at: number; split: number; wall: number; bench: number; drop: number; lock: number; load: number; out: number }> = ({ t, at, split, wall, bench, drop, lock, load, out }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const sp = ei(t, split, split + 0.7), wl = ei(t, wall, wall + 0.8), bn = ei(t, bench, bench + 0.8), dr = ei(t, drop, drop + 0.6), lk = e(t, lock, lock + 0.2) * (1 - e(t, lock + 0.8, lock + 1.4));
  const ld = ei(t, load, load + 1.2);
  // piezas en coordenadas del corte (pared a la izquierda)
  const wallX = 260 + (1 - wl) * 240, benchX = 300 + (1 - bn) * 380, benchY = -120 * (1 - dr) + 6 * ld;
  return (
    <div style={{ position: "absolute", left: 960, top: 560, opacity: o, transform: "translate(-50%,-50%)" }}>
      <svg width={1200} height={760} viewBox="0 0 1200 760" style={{ overflow: "visible", filter: "drop-shadow(0 30px 40px rgba(0,0,0,.6))" }}>
        <rect x={140} y={0} width={120} height={760} fill="#e6e0d4" opacity={wl > 0 ? 1 : 0.4} />
        {/* mitad de la pared: cara plana contra la pared, chanfle hacia arriba mirando la pared */}
        <g transform={`translate(${wallX - 260 * (1 - sp) * 0} ${sp < 1 ? -sp * 20 : 0})`}><polygon points={`0,300 120,180 120,420 0,420`} fill="#d9b07a" stroke="#6a4420" strokeWidth={4} transform={`translate(${0} 0)`} /></g>
        {/* mitad del banco: cuelga del banco con el chanfle hacia abajo */}
        <g transform={`translate(${benchX + 120 * (1 - sp)} ${benchY})`}>
          <polygon points="0,180 120,60 120,180" fill="#c99a63" stroke="#6a4420" strokeWidth={4} transform="translate(0 120)" />
          <rect x={120} y={60} width={420} height={260} fill="rgba(217,176,122,.35)" stroke="#d9b07a" strokeWidth={4} strokeDasharray="14 10" opacity={bn} />
          <text x={220} y={210} fontFamily="Arial" fontWeight={900} fontSize={40} fill="#d9b07a" opacity={bn}>BENCH</text>
        </g>
        {sp > 0.5 && <text x={500} y={140} fontFamily="Arial" fontWeight={900} fontSize={70} fill={COL.amber}>45°</text>}
        {lk > 0 && <circle cx={wallX + 60} cy={250} r={120} fill="none" stroke="#24c27a" strokeWidth={12} opacity={lk} />}
        {ld > 0 && [0, 1, 2].map((i) => <polygon key={i} points="0,0 40,0 40,60 70,60 20,110 -30,60 0,60" fill={COL.red} transform={`translate(${560 + i * 120} ${-60 + 30 * Math.sin(t * 6 + i)})`} opacity={ld} />)}
      </svg>
      {t > wall && <div style={{ position: "absolute", left: 40, top: 640, fontFamily: FONT, fontWeight: 900, fontSize: 44, color: COL.ink, textShadow: extrude(4, "rgba(0,0,0,.6)") }}>WALL · SLANT UP</div>}
      {t > bench && <div style={{ position: "absolute", left: 640, top: 640, fontFamily: FONT, fontWeight: 900, fontSize: 44, color: COL.ink, textShadow: extrude(4, "rgba(0,0,0,.6)") }}>BENCH · SLANT DOWN</div>}
      {t > lock && <div style={{ position: "absolute", left: 300, top: -90, fontFamily: FONT, fontWeight: 900, fontSize: 90, color: "#24c27a", letterSpacing: 6, textShadow: extrude(7, "rgba(0,0,0,.6)"), transform: `scale(${sc(t, lock)})` }}>LOCKED</div>}
      {t > load && <div style={{ position: "absolute", left: 620, top: -200, fontFamily: FONT, fontWeight: 900, fontSize: 60, color: COL.red, textShadow: extrude(5, "rgba(0,0,0,.6)"), whiteSpace: "nowrap" }}>HEAVIER = TIGHTER</div>}
    </div>
  );
};
// transportador que marca el ángulo de la sierra (0 → 45°)
const AngleArc: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const a = 45 * ei(t, at + 0.2, at + 1.0), r = 220;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o }}>
      <svg width={520} height={300} viewBox="-260 -260 520 300" style={{ overflow: "visible", filter: "drop-shadow(0 16px 24px rgba(0,0,0,.6))" }}>
        <path d={`M ${-r} 0 A ${r} ${r} 0 0 1 ${r} 0 Z`} fill="rgba(255,240,200,.18)" stroke="#f4efe6" strokeWidth={5} />
        {Array.from({ length: 19 }, (_, i) => { const q = Math.PI * i / 18; return <line key={i} x1={-Math.cos(q) * r} y1={-Math.sin(q) * r} x2={-Math.cos(q) * (r - (i % 9 === 0 ? 40 : 20))} y2={-Math.sin(q) * (r - (i % 9 === 0 ? 40 : 20))} stroke="#f4efe6" strokeWidth={4} />; })}
        <line x1={0} y1={0} x2={0} y2={-r} stroke="rgba(244,239,230,.4)" strokeWidth={4} strokeDasharray="10 8" />
        <line x1={0} y1={0} x2={Math.sin(a * Math.PI / 180) * r} y2={-Math.cos(a * Math.PI / 180) * r} stroke={COL.amber} strokeWidth={10} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", left: 300, top: -20, fontFamily: FONT, fontWeight: 900, fontSize: 110, color: COL.amber, textShadow: extrude(8, "rgba(0,0,0,.6)") }}>{Math.round(a)}°</div>
    </div>
  );
};
// etiqueta de precio con hilo (para tornillos / bisagras)
const HangTag: React.FC<{ t: number; at: number; out: number; x: number; y: number; big: string; sub: string; col?: string }> = ({ t, at, out, x, y, big, sub, col = "#fbf3df" }) => {
  const o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const sw = Math.sin((t - at) * 4) * 10 * Math.exp(-(t - at) * 1.6);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transformOrigin: "50% -140px", transform: `translateY(${(1 - Math.min(1, spr(t, at))) * -300}px) rotate(${sw}deg)` }}>
      <svg width={20} height={140} style={{ position: "absolute", left: 140, top: -140 }}><line x1={10} y1={0} x2={10} y2={140} stroke="#f4efe6" strokeWidth={3} /></svg>
      <div style={{ width: 300, padding: "26px 20px", background: col, clipPath: "polygon(18% 0, 82% 0, 100% 16%, 100% 100%, 0 100%, 0 16%)", textAlign: "center", fontFamily: FONT, boxShadow: "0 20px 40px rgba(0,0,0,.6)" }}>
        <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#2b2118", margin: "0 auto 10px" }} />
        <div style={{ fontWeight: 900, fontSize: 92, color: "#1b1b1b", lineHeight: 1 }}>{big}</div>
        <div style={{ fontWeight: 800, fontSize: 30, color: "#4a3a28", letterSpacing: 2, marginTop: 6 }}>{sub}</div>
      </div>
    </div>
  );
};
// cotas de 16" entre montantes sobre la pared con rayos X (en el mundo) + imán que corre y "pega"
const StudMarks: React.FC<{ t: number; at: number; mag: number; out: number; K: Key[] }> = ({ t, at, mag, out, K }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const zs = [-1.33, 0, 1.33].map((d) => B.z + d);
  const p = zs.map((z) => scr(K, t, [-9.95, 5.4, z]));
  const mz = B.z - 2.4 + 4.6 * ei(t, mag, mag + 3.0), mp = scr(K, t, [-9.9, 4.6, mz]);
  const hit = zs.findIndex((z) => Math.abs(z - mz) < 0.12);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      {p.slice(0, 2).map((q, i) => t > at + 0.4 + i * 0.3 && <div key={i}><div style={{ position: "absolute", left: q.x, top: q.y - 4, width: (p[i + 1].x - q.x) * ei(t, at + 0.4 + i * 0.3, at + 0.9 + i * 0.3), height: 8, background: COL.amber, boxShadow: `0 0 12px ${COL.amber}` }} /><div style={{ position: "absolute", left: (q.x + p[i + 1].x) / 2, top: q.y - 80, transform: "translateX(-50%)", fontFamily: FONT, fontWeight: 900, fontSize: 56, color: COL.amber, textShadow: extrude(5, "rgba(0,0,0,.6)") }}>16"</div></div>)}
      {t > mag - 0.2 && t < mag + 3.6 && <div style={{ position: "absolute", left: mp.x - 46, top: mp.y - 46, width: 92, height: 92, borderRadius: 18, background: "linear-gradient(160deg,#ff4a3d,#a01e16)", boxShadow: hit >= 0 ? "0 0 0 8px #fff, 0 0 40px #fff" : "0 14px 24px rgba(0,0,0,.6)", transform: `scale(${hit >= 0 ? 1.15 : 1})` }}><div style={{ position: "absolute", left: 18, top: 18, width: 56, height: 56, borderRadius: 10, background: "#c9ccd1" }} /></div>}
      {t > mag + 1 && <div style={{ position: "absolute", left: mp.x + 70, top: mp.y - 30, fontFamily: FONT, fontWeight: 900, fontSize: 52, color: "#fff", textShadow: extrude(5, "rgba(0,0,0,.6)"), opacity: hit >= 0 ? 1 : 0.0 }}>CLICK</div>}
    </div>
  );
};
// corona sobre lo más caro del banco
const Crown: React.FC<{ t: number; at: number; out: number; x: number; y: number; txt: string }> = ({ t, at, out, x, y, txt }) => {
  const o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${sc(t, at)}) rotate(-6deg)`, textAlign: "center" }}>
      <svg width={220} height={140} viewBox="0 0 220 140" style={{ filter: "drop-shadow(0 0 20px rgba(255,200,80,.8))" }}><polygon points="10,130 20,30 70,80 110,10 150,80 200,30 210,130" fill="#ffcf4a" stroke="#a87a10" strokeWidth={6} /></svg>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 50, color: "#ffcf4a", letterSpacing: 3, textShadow: extrude(5, "rgba(0,0,0,.6)"), whiteSpace: "nowrap" }}>{txt}</div>
    </div>
  );
};
// corte de la pata: dos largueros encolados cara a cara → 3" de grueso
const LegLam: React.FC<{ t: number; at: number; glue: number; thick: number; out: number; x: number; y: number }> = ({ t, at, glue, thick, out, x, y }) => {
  const o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const g = ei(t, glue, glue + 0.7);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)" }}>
      <svg width={420} height={420} viewBox="0 0 420 420" style={{ filter: "drop-shadow(0 20px 30px rgba(0,0,0,.6))" }}>
        <rect x={60 - 50 * (1 - g)} y={60} width={150} height={300} fill="#d9b07a" stroke="#6a4420" strokeWidth={5} />
        <rect x={210 + 50 * (1 - g)} y={60} width={150} height={300} fill="#c99a63" stroke="#6a4420" strokeWidth={5} />
        {g > 0.9 && <line x1={210} y1={60} x2={210} y2={360} stroke="#fff3b0" strokeWidth={6} />}
        {t > thick && <g><line x1={60} y1={395} x2={360} y2={395} stroke={COL.amber} strokeWidth={8} /><line x1={60} y1={380} x2={60} y2={410} stroke={COL.amber} strokeWidth={8} /><line x1={360} y1={380} x2={360} y2={410} stroke={COL.amber} strokeWidth={8} /></g>}
      </svg>
      {t > thick && <div style={{ position: "absolute", left: 0, right: 0, top: 430, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 80, color: COL.amber, textShadow: extrude(7, "rgba(0,0,0,.6)"), transform: `scale(${sc(t, thick)})` }}>3" THICK</div>}
    </div>
  );
};
// la pata de costado: ¼" más larga + pie redondeado → se pasa de la vertical y TRABA (con su arco de recorrido)
const LegRock: React.FC<{ t: number; at: number; quarter: number; round: number; rocks: number; locks: number; out: number }> = ({ t, at, quarter, round, rocks, locks, out }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const sw = t < rocks ? -70 : -70 + 76 * ei(t, rocks, rocks + 0.9) - 6 * ei(t, rocks + 0.9, locks);
  const ext = 30 * e(t, quarter, quarter + 0.5), rd = e(t, round, round + 0.5);
  return (
    <div style={{ position: "absolute", left: 960, top: 520, opacity: o, transform: "translate(-50%,-50%)" }}>
      <svg width={1100} height={760} viewBox="0 0 1100 760" style={{ overflow: "visible", filter: "drop-shadow(0 30px 40px rgba(0,0,0,.6))" }}>
        <rect x={100} y={60} width={900} height={70} fill="#d9b07a" stroke="#6a4420" strokeWidth={5} />
        <rect x={0} y={720} width={1100} height={30} fill="#7d7a74" />
        <path d="M 550 130 A 590 590 0 0 1 1000 520" fill="none" stroke="rgba(244,239,230,.25)" strokeWidth={4} strokeDasharray="12 10" />
        <g transform={`translate(550 130) rotate(${sw})`}>
          <rect x={-45} y={0} width={90} height={560 + ext} fill="#c99a63" stroke="#6a4420" strokeWidth={5} rx={0} />
          <path d={`M -45 ${560 + ext - 30 * rd} Q 0 ${560 + ext + 26 * rd} 45 ${560 + ext - 30 * rd} L 45 ${560 + ext} L -45 ${560 + ext} Z`} fill={rd > 0 ? "#7d7a74" : "none"} opacity={rd * 0.0} />
          <rect x={-45} y={560} width={90} height={ext} fill={COL.amber} opacity={ext > 1 ? 0.9 : 0} />
          <circle cx={0} cy={0} r={18} fill="#9aa1a8" />
        </g>
      </svg>
      {t > quarter && <div style={{ position: "absolute", left: 640, top: 600, fontFamily: FONT, fontWeight: 900, fontSize: 80, color: COL.amber, textShadow: extrude(7, "rgba(0,0,0,.6)"), transform: `scale(${sc(t, quarter)})`, whiteSpace: "nowrap" }}>+¼" LONGER</div>}
      {t > round && <div style={{ position: "absolute", left: 640, top: 690, fontFamily: FONT, fontWeight: 800, fontSize: 48, color: COL.ink, textShadow: extrude(4, "rgba(0,0,0,.6)") }}>ROUNDED FOOT</div>}
      {t > locks && <div style={{ position: "absolute", left: 140, top: 240, fontFamily: FONT, fontWeight: 900, fontSize: 110, color: "#24c27a", letterSpacing: 8, textShadow: extrude(8, "rgba(0,0,0,.6)"), transform: `scale(${sc(t, locks)})` }}>LOCKS</div>}
    </div>
  );
};
// destello rojo de "se dobló" sobre el mundo
const FailFlash: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const o = e(t, at, at + 0.08) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <AbsoluteFill style={{ boxShadow: `inset 0 0 0 ${18 * o}px ${COL.red}`, background: `rgba(255,40,30,${0.18 * (1 - e(t, at, at + 0.6))})` }} />;
};
// botón giratorio en la pared (proyectado del mundo): gira 90° y traba / suelta
const SpinLatch: React.FC<{ t: number; at: number; lockAt: number; openAt: number; out: number; K: Key[] }> = ({ t, at, lockAt, openAt, out, K }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const q = scr(K, t, [-9.95, 6.75, B.z]);
  const rot = 90 * ei(t, lockAt, lockAt + 0.5) - 90 * ei(t, openAt, openAt + 0.5);
  const locked = t > lockAt + 0.4 && t < openAt;
  return (
    <div style={{ position: "absolute", left: q.x, top: q.y, opacity: o }}>
      <div style={{ position: "absolute", left: -40, top: -150, width: 80, height: 300, borderRadius: 14, transform: `rotate(${rot}deg)`, background: "repeating-linear-gradient(0deg, rgba(70,40,15,.2) 0 2px, transparent 2px 18px), linear-gradient(90deg,#c99a63,#8d6a46)", boxShadow: locked ? `0 0 0 6px #24c27a, 0 0 40px #24c27a` : "0 14px 24px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: -16, top: -16, width: 32, height: 32, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #e6e9ec, #6b7177)" }} />
      <div style={{ position: "absolute", left: 200, top: -40, fontFamily: FONT, fontWeight: 900, fontSize: 70, color: locked ? "#24c27a" : COL.amber, textShadow: extrude(6, "rgba(0,0,0,.6)"), whiteSpace: "nowrap" }}>{locked ? "LOCKED UP" : t > openAt ? "COMES DOWN" : "TURN BUTTON"}</div>
    </div>
  );
};
// la esquina fuerte del banco: anillo pulsante sobre la esquina proyectada + cruz en el medio del frente
const CornerPulse: React.FC<{ t: number; at: number; nope: number; out: number; K: Key[] }> = ({ t, at, nope, out, K }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const c = scr(K, t, [B.x0 + B.d, B.y + 0.1, B.z - B.w / 2]), m = scr(K, t, [B.x0 + B.d, B.y + 0.1, B.z]);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      {[0, 1].map((i) => { const ph = ((t - at) * 0.9 + i * 0.5) % 1; return <div key={i} style={{ position: "absolute", left: c.x - 60 - ph * 80, top: c.y - 60 - ph * 80, width: 120 + ph * 160, height: 120 + ph * 160, borderRadius: "50%", border: `8px solid #24c27a`, opacity: 1 - ph }} />; })}
      <div style={{ position: "absolute", left: c.x - 30, top: c.y - 30, width: 60, height: 60, borderRadius: "50%", background: "#24c27a", boxShadow: "0 0 30px #24c27a" }} />
      {t > nope && <div style={{ position: "absolute", left: m.x - 70, top: m.y - 70, width: 140, height: 140, fontFamily: FONT, fontWeight: 900, fontSize: 140, lineHeight: "140px", textAlign: "center", color: COL.red, textShadow: extrude(6, "rgba(0,0,0,.6)"), transform: `scale(${sc(t, nope)})` }}>✗</div>}
    </div>
  );
};
// lata de poliuretano tachada con los dos defectos
const PolyCan: React.FC<{ t: number; at: number; slip: number; scr2: number; out: number; x: number; y: number }> = ({ t, at, slip, scr2, out, x, y }) => {
  const o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const x1 = ei(t, at + 0.5, at + 0.9);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${sc(t, at)})` }}>
      <svg width={360} height={460} viewBox="0 0 360 460" style={{ overflow: "visible", filter: "drop-shadow(0 30px 40px rgba(0,0,0,.6))" }}>
        <rect x={40} y={60} width={280} height={380} rx={20} fill="#c9ccd1" />
        <rect x={40} y={140} width={280} height={200} fill="#2d4f8a" />
        <text x={180} y={230} textAnchor="middle" fontFamily="Arial" fontWeight={900} fontSize={44} fill="#fff">POLY</text>
        <text x={180} y={280} textAnchor="middle" fontFamily="Arial" fontWeight={700} fontSize={26} fill="#cfe0ff">GLOSS FINISH</text>
        <ellipse cx={180} cy={60} rx={140} ry={26} fill="#e6e9ec" />
        <line x1={0} y1={0} x2={360 * x1} y2={460 * x1} stroke={COL.red} strokeWidth={22} strokeLinecap="round" />
      </svg>
      {t > slip && <div style={{ position: "absolute", left: 380, top: 80, fontFamily: FONT, fontWeight: 900, fontSize: 64, color: COL.ink, textShadow: extrude(5, "rgba(0,0,0,.6)"), transform: `translateX(${(1 - Math.min(1, spr(t, slip))) * 200}px)` }}>SLIPPERY</div>}
      {t > scr2 && <div style={{ position: "absolute", left: 380, top: 180, fontFamily: FONT, fontWeight: 900, fontSize: 64, color: COL.ink, textShadow: extrude(5, "rgba(0,0,0,.6)"), transform: `translateX(${(1 - Math.min(1, spr(t, scr2))) * 200}px)`, whiteSpace: "nowrap" }}>SCRATCHES UGLY</div>}
    </div>
  );
};
// receta en fichas de taller que se van tildando
const Recipe: React.FC<{ t: number; steps: [string, number][]; out: number; x: number; y: number }> = ({ t, steps, out, x, y }) => {
  const o = e(t, steps[0][1] - 0.3, steps[0][1]) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const cur = steps.filter(([, a]) => t >= a).length - 1;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, display: "flex", flexDirection: "column", gap: 14, fontFamily: FONT }}>
      {steps.map(([s, a], i) => t >= a - 0.1 && (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, padding: "14px 26px", borderRadius: 16, background: i === cur ? "rgba(255,178,87,.95)" : "rgba(18,12,8,.84)", color: i === cur ? "#1b1b1b" : COL.ink, boxShadow: "0 16px 30px rgba(0,0,0,.5)", transform: `translateX(${(1 - Math.min(1, spr(t, a))) * -300}px)` }}>
          <div style={{ width: 54, height: 54, borderRadius: "50%", background: i < cur ? "#24c27a" : "transparent", border: `5px solid ${i === cur ? "#1b1b1b" : "#24c27a"}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 32, color: "#fff" }}>{i < cur ? "✓" : i + 1}</div>
          <div style={{ fontWeight: 900, fontSize: 48, letterSpacing: 2 }}>{s}</div>
        </div>
      ))}
    </div>
  );
};
// termómetro de calor que sube solo dentro del montón de trapos (con humito)
const HeatRise: React.FC<{ t: number; at: number; fire: number; out: number; x: number; y: number }> = ({ t, at, fire, out, x, y }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const h = ei(t, at, fire + 0.4), col = h > 0.85 ? COL.red : h > 0.5 ? COL.amber : "#ffd51e";
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o }}>
      <div style={{ position: "relative", width: 90, height: 560, borderRadius: 45, background: "rgba(255,255,255,.12)", boxShadow: "inset 0 0 0 6px rgba(255,255,255,.4), 0 20px 40px rgba(0,0,0,.6)" }}>
        <div style={{ position: "absolute", left: 18, right: 18, bottom: 18, height: (560 - 36) * h, borderRadius: 30, background: `linear-gradient(0deg, ${COL.red}, ${col})`, boxShadow: `0 0 30px ${col}` }} />
      </div>
      <div style={{ position: "absolute", left: 120, top: 560 - 560 * h - 30, fontFamily: FONT, fontWeight: 900, fontSize: 70, color: col, textShadow: extrude(6, "rgba(0,0,0,.6)"), whiteSpace: "nowrap" }}>{Math.round(70 + 380 * h)}°F</div>
      {t > fire && <div style={{ position: "absolute", left: 120, top: -120, fontFamily: FONT, fontWeight: 900, fontSize: 64, color: COL.red, textShadow: extrude(6, "rgba(0,0,0,.6)"), whiteSpace: "nowrap", transform: `scale(${sc(t, fire)})`, transformOrigin: "0 50%" }}>ALL BY ITSELF</div>}
    </div>
  );
};
// sellos NEVER uno abajo del otro
const NeverList: React.FC<{ t: number; items: [string, number][]; out: number; x: number; y: number }> = ({ t, items, out, x, y }) => {
  const o = 1 - e(t, out, out + 0.3);
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", flexDirection: "column", gap: 40, alignItems: "center" }}>
      {items.map(([s, a], i) => t >= a && (
        <div key={i} style={{ padding: "18px 44px", border: `10px solid ${COL.red}`, borderRadius: 18, transform: `rotate(${i ? 3 : -3}deg) scale(${Math.max(1, 2.2 - 1.2 * Math.min(1, (t - a) * 6))})`, fontFamily: FONT, fontWeight: 900, fontSize: 92, color: COL.red, letterSpacing: 6, background: "rgba(14,8,6,.75)", textShadow: "0 0 18px rgba(255,74,61,.5)", whiteSpace: "nowrap" }}>NEVER {s}</div>
      ))}
    </div>
  );
};

// ================= TRAMO 3 =================
export const seg3 = (t: number, L: React.ReactNode[], World: (k: string) => React.ReactNode) => {
  const K = K3;
  // --- (avatar 509,1-514,6) → saltando sobre el bastidor → la tapa con 4 clavijas (mundo, de arriba) ---
  if (t >= 514.4 && t < 525.9) {
    const wK = e(t, T.topOn - 0.3, T.topOn + 0.2);
    L.push(<Pic key="jp" id="r25_jump" t={t} a={514.4} mv="up" />);
    L.push(<BigWord key="jo" t={t} at={T.jump} out={T.topOn - 0.3} txt="JUMP ON IT" x={1400} y={250} col={COL.amber} size={110} rot={5} />);
    if (wK > 0) L.push(<Fade key="wt" t={t} a={T.topOn - 0.3} b={T.topOn + 0.2}>{World("w6")}</Fade>);
    L.push(<PegHeads key="ph" t={t} at={T.down} out={525.6} K={K} />);
    L.push(<BigWord key="4p" t={t} at={T.four} out={T.round - 0.2} txt="+4 PEGS" x={960} y={170} col={COL.amber} size={100} rot={0} />);
    L.push(<BigWord key="sh" t={t} at={T.round} out={525.6} txt="SHOWS HOW IT WAS MADE" x={960} y={930} col={COL.ink} size={64} rot={0} />);
  }
  // --- (avatar 525,7-529,9) → el estante de abajo (foto + corte plegado) ---
  if (t >= 529.7 && t < 542.9) {
    const sK = e(t, T.folded - 0.4, T.folded);
    L.push(<Pic key="sf" id="r26_shelf" t={t} a={529.7} mv="in" ox="50% 70%" />);
    L.push(<BigWord key="op" t={t} at={529.8} out={T.decks - 0.1} txt="OPTIONAL" x={1500} y={200} col={COL.dim} size={80} rot={6} />);
    L.push(<BigWord key="4d" t={t} at={T.decks} out={T.folded - 0.4} txt="4 DECK BOARDS" x={960} y={930} col={COL.amber} size={80} rot={0} />);
    L.push(<Dark key="dk" o={0.84 * sK} />);
    L.push(<FoldSection key="fs" t={t} at={T.folded - 0.3} fold={T.folded} items={[T.drill, T.square, T.coffee]} out={542.6} />);
  }
  // --- (avatar 542,7-548,4) → $2 + 15 min → ¿cómo cuelga? → 2º truco → 5 segundos → listón francés ---
  if (t >= 548.2 && t < 561.2) {
    L.push(<Grad key="g1" c1="#3a2c20" c2="#100b07" />);
    L.push(<BigWord key="d2" t={t} at={T.d2 - 0.2} out={T.hang - 0.2} txt="$2 · 15 MIN" x={960} y={500} col={COL.amber} size={150} rot={-3} />);
    L.push(<BigWord key="tr" t={t} at={T.second} out={T.cleat - 0.3} txt="TRICK #2" x={960} y={260} col={COL.ink} size={130} rot={0} />);
    L.push(<Seconds key="s5" t={t} at={T.s5 - 0.1} out={T.cleat - 0.3} n={5} x={960} y={640} />);
    L.push(<Fade key="cl" t={t} a={T.cleat - 0.3} b={T.cleat}><Pic id="n09_cleat" t={t} a={T.cleat - 0.3} mv="in" /></Fade>);
    L.push(<BigWord key="fc" t={t} at={T.cleat + 0.2} out={560.9} txt="FRENCH CLEAT" x={960} y={180} col={COL.amber} size={110} rot={0} />);
  }
  // --- (avatar 561-565,3) → la sierra a 45° → 2 piezas con chanfle → una a la pared ---
  if (t >= 565.1 && t < 576.1) {
    const xK = e(t, T.twoP - 0.4, T.twoP);
    L.push(<Pic key="rp" id="r27_rip45" t={t} a={565.1} mv="r" />);
    L.push(<AngleArc key="aa" t={t} at={T.deg45 - 0.6} out={T.twoP - 0.4} x={120} y={300} />);
    L.push(<BigWord key="lw" t={t} at={T.length} out={T.twoP - 0.4} txt="LENGTHWISE" x={1350} y={900} col={COL.ink} size={80} rot={0} />);
    L.push(<Fade key="g2" t={t} a={T.twoP - 0.4} b={T.twoP}><Grad c1="#33302e" c2="#0d0c0b" /></Fade>);
    if (xK > 0) L.push(<Cleat key="c1" t={t} at={T.twoP - 0.4} split={T.twoP} wall={T.wallUp - 0.3} bench={1e9} drop={1e9} lock={1e9} load={1e9} out={575.8} />);
  }
  // --- (avatar 575,9-579,4) → la otra al banco → se cuelga y traba → cuanto más peso, más agarra → tirafondos ---
  if (t >= 579.2 && t < 592.9) {
    L.push(<Grad key="g3" c1="#33302e" c2="#0d0c0b" />);
    L.push(<Cleat key="c2" t={t} at={579.2} split={570} wall={570} bench={579.3} drop={T.drop} lock={T.lock} load={T.heavier} out={T.wallP - 0.4} />);
    L.push(<Fade key="lg" t={t} a={T.wallP - 0.4} b={T.wallP}><Pic id="r29_lags" t={t} a={T.wallP - 0.4} mv="in" /></Fade>);
    L.push(<BigWord key="mt" t={t} at={T.metal - 0.1} out={T.lags - 0.1} txt="THE ONLY METAL" x={960} y={190} col={COL.ink} size={90} rot={0} />);
    L.push(<HangTag key="ht" t={t} at={T.d3 - 0.2} out={592.6} x={1450} y={330} big="$3" sub={'4 LAGS · 3"'} />);
  }
  // --- (avatar 592,7-596,7) → la pared en rayos X: montantes cada 16", el imán, los tirafondos ---
  if (t >= 596.5 && t < 608.1) {
    L.push(World("w7"));
    L.push(<StudMarks key="sm" t={t} at={T.s16 - 0.2} mag={T.magW} out={607.8} K={K} />);
    L.push(<BigWord key="nd" t={t} at={596.6} out={T.s16 - 0.3} txt="STUDS · NOT DRYWALL" x={960} y={170} col={COL.amber} size={80} rot={0} />);
    L.push(<BigWord key="ws" t={t} at={T.where} out={607.8} txt="THAT'S A STUD" x={1400} y={900} col="#24c27a" size={76} rot={-3} />);
    L.push(<Polaroid key="pl" t={t} at={T.pilot - 0.2} out={607.8} img="r28_studs" x={420} y={790} cap="pilot hole · drive the lags" rot={-5} />);
  }
  // --- (avatar 607,9-612,1) → la parte que pliega: bisagras $12 = lo más caro ---
  if (t >= 611.9 && t < 622.3) {
    L.push(<Pic key="hg" id="r30_hinges" t={t} a={611.9} mv="l" />);
    L.push(<BigWord key="fp" t={t} at={T.folding} out={T.strap - 0.2} txt="THE FOLDING PART" x={960} y={200} col={COL.ink} size={90} rot={0} />);
    L.push(<HangTag key="h12" t={t} at={T.d12 - 0.2} out={622.0} x={1430} y={360} big="$12" sub="3 STRAP HINGES" col="#ffe7a6" />);
    L.push(<Crown key="cr" t={t} at={621.9 - 1.2} out={622.0} x={1580} y={140} txt="MOST EXPENSIVE" />);
  }
  // --- (avatar 622,1-626,6) → la tapa sube contra la pared y baja → la pata (2 largueros encolados) ---
  if (t >= 626.4 && t < 639.0) {
    const lK = e(t, T.twoS - 0.4, T.twoS);
    L.push(World("w8"));
    L.push(<BigWord key="sw" t={t} at={T.swings} out={T.thenLeg} txt="SWINGS UP · FLAT TO THE WALL" x={960} y={170} col={COL.amber} size={70} rot={0} />);
    L.push(<Dark key="dk2" o={0.72 * lK} />);
    L.push(<Pic key="lg2" id="r31_leg" t={t} a={T.twoS - 0.4} mv="in" style={{ opacity: lK, clipPath: "inset(0 50% 0 0)" }} />);
    L.push(<LegLam key="ll" t={t} at={T.twoS - 0.2} glue={T.faceF - 0.3} thick={T.thick} out={638.7} x={1440} y={500} />);
    L.push(<BigWord key="ff" t={t} at={T.frontF} out={638.7} txt="HINGED TO THE FRONT" x={1440} y={930} col={COL.ink} size={56} rot={0} />);
  }
  // --- (avatar 638,8-643,9) → la pata baja sola y aterriza → el detalle: ¼" + pie redondo → traba ---
  if (t >= 643.7 && t < 655.5) {
    const dK = e(t, T.detail - 0.3, T.detail + 0.1);
    L.push(World("w9"));
    L.push(<BigWord key="ld" t={t} at={T.lands} out={T.detail - 0.3} txt="LANDS ON THE FLOOR" x={960} y={180} col={COL.ink} size={80} rot={0} />);
    L.push(<Dark key="dk3" o={0.86 * dK} />);
    L.push(<LegRock key="lr" t={t} at={T.detail} quarter={T.quarter} round={T.round2} rocks={T.rocks} locks={T.locks} out={655.2} />);
    L.push(<BigWord key="id" t={t} at={T.detail} out={T.quarter - 0.2} txt="THE LITTLE DETAIL" x={960} y={150} col={COL.amber} size={80} rot={0} />);
  }
  // --- (avatar 655,3-659) → si la cortás justa se dobla (en el mundo) → botón giratorio ---
  if (t >= 658.8 && t < 671.6) {
    L.push(World("w10"));
    L.push(<BigWord key="ex" t={t} at={T.exactly} out={T.hard + 0.6} txt="CUT EXACT?" x={960} y={170} col={COL.ink} size={90} rot={0} />);
    L.push(<FailFlash key="ff2" t={t} at={T.lean} out={T.hard + 0.6} />);
    L.push(<BigWord key="hw" t={t} at={T.lean + 0.1} out={T.hard + 0.6} txt="FOLDS UNDER YOU" x={960} y={880} col={COL.red} size={100} rot={-3} />);
    L.push(<SpinLatch key="sl" t={t} at={T.turnB - 0.3} lockAt={1e9} openAt={1e9} out={671.3} K={K} />);
  }
  // --- (avatar 671,4-675,3) → un taco de roble con un tornillo: traba / suelta → 200 años en puertas de granero ---
  if (t >= 675.1 && t < 687.5) {
    L.push(World("w11"));
    L.push(<SpinLatch key="sl2" t={t} at={675.1} lockAt={T.turnS - 0.3} openAt={T.turnSt} out={T.barnD - 0.3} K={K} />);
    L.push(<BigWord key="bd" t={t} at={T.barnD} out={687.2} txt="BARN DOORS · 200 YEARS" x={960} y={180} col={COL.amber} size={80} rot={0} />);
  }
  // --- (avatar 687,3-691,5) → la esquina izquierda-delantera: el lugar más fuerte ---
  if (t >= 691.3 && t < 701.3) {
    L.push(World("w12"));
    L.push(<CornerPulse key="cp" t={t} at={691.4} nope={T.notMid} out={701.0} K={K} />);
    L.push(<BigWord key="st" t={t} at={T.strongest} out={701.0} txt="STRONGEST SPOT" x={1300} y={180} col="#24c27a" size={90} rot={3} />);
    L.push(<BigWord key="oc" t={t} at={T.onCleat} out={701.0} txt="ON THE CLEAT + FRAME" x={1300} y={300} col={COL.ink} size={56} rot={3} />);
  }
  // --- (avatar 701,1-705,9: morsa de 1978) → la morsa → el acabado: lo que puede prender fuego la casa → nada de poliuretano ---
  if (t >= 705.7 && t < 719.1) {
    L.push(<Pic key="vs" id="r33_vise" t={t} a={705.7} mv="in" />);
    L.push(<BigWord key="nc" t={t} at={T.noCare - 0.2} out={T.finish - 0.3} txt="DOESN'T CARE ONE BIT" x={960} y={900} col={COL.ink} size={76} rot={0} />);
    L.push(<Fade key="g4" t={t} a={T.finish - 0.3} b={T.finish}><Grad c1="#3c1d14" c2="#0d0604" /></Fade>);
    L.push(<BigWord key="bh" t={t} at={T.burn - 0.1} out={T.poly - 0.3} txt="COULD BURN YOUR HOUSE DOWN" x={960} y={500} col={COL.red} size={86} rot={0} />);
    L.push(<PolyCan key="pc" t={t} at={T.poly - 0.2} slip={T.slippery} scr2={T.scratched} out={718.8} x={640} y={560} />);
  }
  // --- (avatar 718,9-724,1: linaza 50/50) → la receta → la tapa color miel (mundo con aceite) ---
  if (t >= 723.9 && t < 736.0) {
    const wK = e(t, T.honey - 0.4, T.honey);
    L.push(<Pic key="oi" id="r34_oil" t={t} a={723.9} mv="r" />);
    L.push(<Recipe key="rc" t={t} steps={[["WIPE ON", T.wipeOn], ["SOAK 15 MIN", T.soak], ["WIPE OFF", T.wipeOff], ["2 COATS", T.coats], ["PASTE WAX", T.wax]]} out={T.honey - 0.4} x={90} y={200} />);
    if (wK > 0) L.push(<Fade key="wo" t={t} a={T.honey - 0.4} b={T.honey}>{World("w13")}</Fade>);
    L.push(<BigWord key="hc" t={t} at={T.honey + 0.2} out={735.7} txt="DEEP HONEY" x={960} y={180} col={COL.amber} size={110} rot={0} />);
    L.push(<BigWord key="gp" t={t} at={T.pops} out={735.7} txt="GLUE POPS RIGHT OFF" x={960} y={920} col={COL.ink} size={70} rot={0} />);
  }
  // --- (avatar 735,8-740: los trapos) → se calientan solos → fuego de noche → acostados en el piso ---
  if (t >= 739.8 && t < 750.7) {
    L.push(<Pic key="rg" id="r35_rags" t={t} a={739.8} mv="in" />);
    L.push(<HeatRise key="hr" t={t} at={739.9} fire={T.fire} out={T.night - 0.3} x={1500} y={260} />);
    L.push(<Fade key="fi" t={t} a={T.night - 0.3} b={T.night}><Pic id="n11_fire" t={t} a={T.night - 0.3} mv="in" /></Fade>);
    L.push(<BigWord key="ey" t={t} at={T.every - 0.2} out={T.layFlat - 0.2} txt="EVERY YEAR" x={960} y={190} col={COL.red} size={110} rot={0} />);
    L.push(<BigWord key="lf" t={t} at={T.layFlat} out={750.4} txt="LAY THEM FLAT · CONCRETE" x={960} y={900} col="#24c27a" size={70} rot={0} />);
  }
  // --- (avatar 750,5-754,5) → NUNCA hechos un bollo / NUNCA a la basura mojados ---
  if (t >= 754.3 && t < 759.4) {
    L.push(<Grad key="g5" c1="#2a1410" c2="#080404" />);
    L.push(<NeverList key="nl" t={t} items={[["WAD THEM UP", T.wad], ["TRASH THEM WET", T.trash]]} out={759.0} x={960} y={540} />);
  }
};

// ================= encima del avatar (tramo 3) =================
const A = {
  shelf: at("put a shelf underneath", 528), opt: at("this part is optional", 529), drillA: at("my drill", 541), depth: at("add any depth", 545),
  take: at("take one more stringer", 559), rip: at("rip it right down", 562), other: at("the other goes", 576), down: at("slant pointing down", 578),
  intoS: at("go into the studs", 593), notD: at("not the drywall", 594), three: at("gets you three studs", 608), anywhere: at("not going anywhere", 612),
  most: at("most expensive thing", 622), hingesB: at("hinges go on", 625), lift: at("lift the bench up", 639), drop: at("drop the bench down", 642),
  rocks: at("it rocks past", 655), cant: at("can't fold back", 659), little: at("little piece of oak", 671), screw: at("one screw into", 675),
  left: at("left front corner", 689), right: at("right handed", 690), bolted: at("bolted an old vice", 701), y78: at("since 1978", 703),
  boiled: at("boiled linseed oil", 719), half: at("half and half", 720), rags: at("but the rags", 734), heats: at("heats up", 736),
  flat: at("hard and dry", 751), bucket: at("bucket of water", 751),
};
export const AV3: Record<number, (t: number) => React.ReactNode> = {
  526: (t) => <Plank t={t} at={A.shelf - 0.2} out={529.6} big="+ A SHELF" sub="UNDER THE TOP" />,
  543: (t) => <Plank t={t} at={A.depth - 0.4} out={548.1} big="NO EXTRA DEPTH" sub="IT SITS INSIDE THE FRAME" col="#1a7a4c" />,
  561: (t) => <Plank t={t} at={A.take - 0.6} out={565.0} big={'ONE STRINGER · 48"'} sub="RIP IT DOWN THE MIDDLE" />,
  576: (t) => <Plank t={t} at={A.other - 0.2} out={579.1} big="OTHER HALF" sub="ON THE BENCH · SLANT DOWN" />,
  593: (t) => <Plank t={t} at={A.intoS - 0.2} out={596.4} big="INTO THE STUDS" sub="NOT THE DRYWALL" col={COL.red} />,
  608: (t) => <Plank t={t} at={A.three - 0.6} out={611.8} big={'48" = 3 STUDS'} sub="4 LAGS · NOT GOING ANYWHERE" col="#1a7a4c" />,
  622: (t) => <Plank t={t} at={A.hingesB - 0.3} out={626.3} big="BACK EDGE" sub="HINGES GO HERE" />,
  639: (t) => <Plank t={t} at={A.lift - 0.2} out={643.6} big="LIFT · LEG FOLDS" sub="DROP · LEG SWINGS DOWN" />,
  655: (t) => <Plank t={t} at={A.rocks - 0.1} out={658.7} big="ROCKS · LOCKS" sub="CAN'T FOLD BACK ON YOU" col="#1a7a4c" />,
  671: (t) => <Plank t={t} at={A.little - 0.2} out={675.0} big={'3" OF OAK'} sub="ONE HOLE · ONE SCREW" />,
  687: (t) => <Plank t={t} at={A.left - 0.2} out={691.2} big="VISE: LEFT FRONT" sub="IF YOU'RE RIGHT HANDED" />,
  701: (t) => <Plank t={t} at={A.y78 - 0.2} out={705.6} big="SINCE 1978" sub="OLD VISE · STILL WORKS" />,
  719: (t) => <Plank t={t} at={A.boiled - 0.1} out={723.8} big="LINSEED 50/50" sub="BOILED OIL + MINERAL SPIRITS" />,
  736: (t) => <Plank t={t} at={A.heats - 0.4} out={739.7} big="THE RAGS" sub="THEY HEAT UP AS THEY DRY" col={COL.red} />,
  750: (t) => <Plank t={t} at={750.6} out={754.2} big="FLAT · OR WATER" sub="A BUCKET WITH A LID" col="#1a7a4c" />,
};

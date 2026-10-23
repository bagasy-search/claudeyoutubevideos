// marcus02 · MINUTO 1 (0-79,8 s) a mano, vara gary01. Un solo hilo sin cortes secos:
// avatar en el sillón → la foto del sillón (70° en la pared, pies fríos) → zoom a la casa 3D en corte con el aire frío entrando
// y el furnace que arranca otra vez → latigazo a Marcus con la factura 3D de $412 → el sahumerio frente al enchufe (toma agnes)
// → el humo chupado por el enchufe (LTX) → Marcus (THAT'S YOUR MONEY) → portal desde el enchufe a la casa entera: el calor sale
// por arriba, el frío entra por abajo → Marcus se presenta → el ático → Marcus (12 cosas) → la casa en la calle con los 12
// pines que se prenden uno por uno → Marcus (#7 = el grande) → la factura que se parte a la mitad sobre el ático → las primeras
// cuestan $0. Audio fuera de Remotion (la voz se mezcla en encfin). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { HouseWorld, PT, EV, screenOf, camSpeed } from "./world3d";
import { BigNum, COL, Card3D, Chips, Flash, FONT, LowerThird, P, Tag, Vid, e, ei, extrude, s, spr } from "../kits/yanqui3d/lib";
import { DUR, Stamp, Tr, transition } from "../kits/yanqui3d/engine";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";

export const MIN1_END = EV.n1 - 0.05;
export const MIN1_FRAMES = Math.round(MIN1_END * 30);
const HAS = AVAIL as { clips: string[]; imgs: string[] };

// ---------- tomas (si falta el mp4, la foto del primer cuadro con zoom lento) ----------
export const Shot: React.FC<{ k: string; t: number; a: number; z?: [number, number]; dur?: number; from?: number }> = ({ k, t, a, z = [1.03, 1.11], dur = 8, from = 0 }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + dur);
  return <AbsoluteFill style={{ transform: `scale(${sc})` }}>{HAS.clips.includes(k) ? <Vid id={"ltx_" + k} at={a} from={from} /> : <Vid id={"img_" + k} />}</AbsoluteFill>;
};
export const cardId = (k: string) => (HAS.clips.includes(k) ? "ltx_" + k : "img_" + k);

// ---------- avatar: ventanas pagadas del reel (preroll 10 cuadros, cola 0,65 s para salir con transición) ----------
const WIN = (AVW as { win: { ms: number; me: number; off: number }[] }).win.filter((w) => w.ms < MIN1_END);
export const Avatar: React.FC<{ t: number; blur?: number; dark?: number }> = ({ t, blur = 0, dark = 0 }) => {
  const face = WIN.map((w, i) => (
    <Sequence key={i} from={s(w.ms) - 10} durationInFrames={s(w.me - w.ms) + 30} layout="none">
      <AbsoluteFill style={{ opacity: t >= w.ms - 0.02 && t < w.me + 0.65 ? 1 : 0 }}>
        <OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </Sequence>
  ));
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ filter: blur > 0.2 ? `blur(${blur}px) brightness(${1 - dark})` : dark > 0 ? `brightness(${1 - dark})` : undefined, transform: blur > 0.2 ? "scale(1.05)" : undefined }}>{face}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- la casa 3D con blur de movimiento real (velocidad de cámara proyectada) ----------
export const World: React.FC<{ t: number; blur?: number; dark?: number }> = ({ t, blur = 0, dark = 0 }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5) + blur, by: Math.min(3.5, v0.by * 0.5) + blur };
  const id = "mb" + Math.round(t * 30) + "_" + Math.round(blur);
  return (
    <AbsoluteFill style={{ filter: dark > 0 ? `brightness(${1 - dark})` : undefined, transform: blur > 0.5 ? "scale(1.04)" : undefined }}>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><HouseWorld t={t} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- la factura de la calefacción en 3D: entra girando y, si `split`, se parte a la mitad ----------
const TEAR = "50% 0%, 47% 9%, 53% 18%, 46% 29%, 52% 40%, 47% 52%, 54% 63%, 48% 74%, 53% 86%, 49% 100%";
export const Bill: React.FC<{ t: number; at: number; out: number; x: number; y: number; amt: string; split?: number; after?: string; sc?: number }> = ({ t, at, out, x, y, amt, split, after, sc = 1 }) => {
  const o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const k = Math.min(1, spr(t, at, 0.9)), sp = split === undefined ? 0 : ei(t, split, split + 0.7);
  const paper = (
    <div style={{ position: "absolute", inset: 0, borderRadius: 10, background: "linear-gradient(180deg,#fbf8f1,#ece6d8)", boxShadow: "0 40px 80px rgba(0,0,0,.6)", fontFamily: FONT, color: "#2b2620", padding: "34px 38px" }}>
      <div style={{ fontWeight: 900, fontSize: 30, letterSpacing: 6 }}>HEATING BILL</div>
      <div style={{ fontWeight: 700, fontSize: 22, letterSpacing: 3, opacity: 0.6, marginTop: 6 }}>JANUARY · GAS SERVICE</div>
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ height: 12, borderRadius: 6, background: "rgba(0,0,0,.09)", marginTop: 26, width: `${88 - i * 13}%` }} />)}
      <div style={{ position: "absolute", left: 38, right: 38, bottom: 34, borderTop: "3px solid #2b2620", paddingTop: 14 }}>
        <div style={{ fontWeight: 800, fontSize: 24, letterSpacing: 4 }}>AMOUNT DUE</div>
        <div style={{ fontWeight: 900, fontSize: 132, lineHeight: 1, color: COL.red }}>{amt}</div>
      </div>
    </div>
  );
  const L = `polygon(0% 0%, ${TEAR}, 0% 100%)`, R = `polygon(100% 0%, ${TEAR}, 100% 100%)`;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 520, height: 700, opacity: o, perspective: 1600, transform: `translate(-50%,-50%) scale(${sc})` }}>
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `translateZ(${(1 - k) * -900}px) rotateY(${(1 - k) * 70 - 8}deg) rotateX(5deg)` }}>
        {sp <= 0 ? paper : (
          <>
            <div style={{ position: "absolute", inset: 0, clipPath: L, transform: `translate(${-60 * sp}px, ${420 * sp * sp}px) rotate(${-18 * sp}deg)`, opacity: 1 - 0.6 * sp }}>{paper}</div>
            <div style={{ position: "absolute", inset: 0, clipPath: R, transform: `translate(${40 * sp}px, 0) rotate(${4 * sp}deg)` }}>{paper}</div>
          </>
        )}
      </div>
      {after && sp > 0.6 && <div style={{ position: "absolute", left: 300, top: 760, opacity: e(t, split! + 0.6, split! + 0.9), fontFamily: FONT, fontWeight: 900, fontSize: 92, color: "#5ee38f", textShadow: extrude(7, "rgba(0,0,0,.7)"), whiteSpace: "nowrap", transform: `translate(-50%,0) scale(${Math.min(1.06, spr(t, split! + 0.6))})` }}>{after}</div>}
    </div>
  );
};

// ---------- los 12 pines sobre la casa (se prenden uno por uno; el 7 en rojo y más grande) ----------
const NP = [PT.n1, PT.n2, PT.n3, PT.n4, PT.n5, PT.n6, PT.n7, PT.n8, PT.n9, PT.n10, PT.n11, PT.n12];
export const Pins: React.FC<{ t: number; from: number; step: number; out: number; seven?: number; cam?: (t: number) => number }> = ({ t, from, step, out, seven = 1e9, cam = (x) => x }) => {
  const oo = 1 - e(t, out, out + 0.3);
  if (t < from || oo <= 0.01) return null;
  return (
    <>
      {NP.map((q, i) => {
        const a = from + i * step, k = Math.min(1.1, spr(t, a, 1)), big = i === 6 ? 1 + 0.45 * e(t, seven, seven + 0.4) : 1;
        if (t < a) return null;
        const p = screenOf(cam(t), q), c = i === 6 ? COL.red : "#ffd166", dim = i !== 6 && t > seven ? 0.35 : 1;
        return (
          <div key={i} style={{ position: "absolute", left: p.x, top: p.y, opacity: oo * dim, transform: `translate(-50%,-100%) scale(${k * big})`, transformOrigin: "50% 100%" }}>
            <div style={{ width: 66, height: 66, borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)", background: c, boxShadow: `0 10px 24px rgba(0,0,0,.6), 0 0 ${i === 6 ? 40 : 16}px ${c}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ transform: "rotate(45deg)", fontFamily: FONT, fontWeight: 900, fontSize: 34, color: "#1a1206" }}>{i + 1}</div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export const Head: React.FC<{ t: number; at: number; out: number; txt: string; y?: number; size?: number; col?: string }> = ({ t, at, out, txt, y = 120, size = 80, col = COL.ink }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: o, fontFamily: FONT, fontWeight: 900, fontSize: size, letterSpacing: 8, color: col, textShadow: extrude(9, "rgba(0,0,0,.65)"), transform: `scale(${0.92 + 0.08 * e(t, at, at + 1.6)})` }}>{txt}</div>;
};

// ---------- BASES (una por frase) + transiciones del kit ----------
type Seg = { a: number; tr: Tr; p?: (t: number) => [number, number]; r: (t: number) => React.ReactNode };
const xy = (q: { x: number; y: number }): [number, number] => [q.x, q.y];
const WIDE = EV.leaving + 2.0;
const W7 = (t: number) => 63.6 + (t - 71.0) * 0.3;   // la casa entera (vista "wide") mientras se parte la factura   // momento de la cámara "wide" de la casa (se reusa en el gancho)
const SEG: Seg[] = [
  // 0 · Marcus: "It's January, you're on your couch…"
  { a: 0, tr: "cut", r: (t) => <Avatar t={t} /> },
  // 1 · el sillón con el buzo: 70° en la pared, pies fríos
  { a: 3.95, tr: "whip", r: (t) => <Shot k="n_couch" t={t} a={3.95} z={[1.02, 1.12]} dur={6.5} /> },
  // 2 · zoom a la casa 3D en corte: el aire frío entra por abajo, el furnace arranca otra vez
  { a: 10.45, tr: "zoom", p: () => [960, 520], r: (t) => <World t={WIDE + (t - 10.45) * 0.5} /> },
  // 3 · latigazo a Marcus con la factura de $412
  { a: 15.08, tr: "whip", r: (t) => <Avatar t={t} blur={7 * e(t, 18.7, 19.1)} dark={0.35 * e(t, 18.7, 19.1)} /> },
  // 4 · "light a stick of incense" (toma agnes)
  { a: 21.25, tr: "whipL", r: (t) => <Shot k="n_incense" t={t} a={21.25} z={[1.1, 1.02]} dur={6.8} /> },
  // 5 · el humo chupado por el enchufe (LTX)
  { a: 28.05, tr: "light", r: (t) => <Shot k="l_hook" t={t} a={28.05} z={[1.0, 1.06]} dur={6.5} from={5.5} /> },
  // 6 · Marcus: THAT'S YOUR MONEY
  { a: 34.5, tr: "push", r: (t) => <Avatar t={t} /> },
  // 7 · portal: del enchufe a la casa entera (el calor que pagaste se va)
  { a: 37.9, tr: "portal", p: () => [960, 540], r: (t) => <World t={t} /> },
  // 8 · Marcus se presenta (toma agnes con el sahumerio)
  { a: 43.4, tr: "light", r: (t) => <Shot k="m_intro" t={t} a={43.4} z={[1.1, 1.03]} dur={4.2} /> },
  // 9 · "attics, crawl spaces, basements"
  { a: 47.6, tr: "whip", r: (t) => <Shot k="m_attic" t={t} a={47.6} z={[1.03, 1.1]} dur={2.5} /> },
  // 10 · Marcus: "12 things most techs never tell you"
  { a: 49.97, tr: "whipL", r: (t) => <Avatar t={t} blur={8 * e(t, 54.0, 54.4)} dark={0.4 * e(t, 54.0, 54.4)} /> },
  // 11 · la casa desde la calle: los 12 pines se prenden uno por uno
  { a: 54.6, tr: "zoom", p: () => [960, 540], r: (t) => <World t={t} /> },
  // 12 · Marcus: "number seven is the big one"
  { a: 66.49, tr: "push", r: (t) => <Avatar t={t} /> },
  // 13 · el ático 3D (el #7) con la factura que se parte a la mitad
  { a: 71.0, tr: "zoom", p: () => [960, 540], r: (t) => <World t={W7(t)} dark={0.3 * e(t, 71.3, 71.9) * (1 - e(t, 74.4, 74.9))} /> },
];

export const Min1: React.FC = () => {
  const t = useCurrentFrame() / 30;
  let i = 0; while (i < SEG.length - 1 && SEG[i + 1].a <= t) i++;
  const b = SEG[i], D = DUR[b.tr], k = D > 0 ? (t - b.a) / D : 1;
  const base = i > 0 && k < 1 ? transition(b.tr, k, SEG[i - 1].r(t), b.r(t), b.p ? b.p(b.a) : [960, 540]) : [<AbsoluteFill key="b">{b.r(t)}</AbsoluteFill>];
  const L: React.ReactNode[] = [];
  // A · el sillón: 70° en la pared, pies fríos, la brisa en la nuca
  L.push(<BigNum key="70" t={t} at={5.76} text="70°F" x={1450} y={330} size={210} col="#ffd29a" edge="#5a3a20" out={7.0} sub="ON THE WALL" />);
  L.push(<Stamp key="feet" t={t} at={7.14} text="COLD FEET" x={1380} y={760} out={8.85} rot={-6} size={100} />);
  L.push(<Tag key="breeze" t={t} at={8.92} x={900} y={330} dx={260} dy={-120} text="A BREEZE" sub="FROM WHERE?" col={COL.ice} out={10.35} />);
  // B · la casa 3D: el frío entra, el furnace arranca
  if (t > 10.4 && t < 15.6) {
    const f = screenOf(WIDE + (t - 10.45) * 0.5, PT.n12), r = screenOf(WIDE + (t - 10.45) * 0.5, PT.rim);
    L.push(<Tag key="cold" t={t} at={11.0} x={r.x} y={r.y} dx={260} dy={60} text="COLD AIR IN" col={COL.ice} out={14.9} />);
    L.push(<Tag key="kicks" t={t} at={13.3} x={f.x} y={f.y} dx={-240} dy={-120} text="KICKS ON. AGAIN." col={COL.amber} out={14.9} />);
  }
  // C · Marcus con la factura
  L.push(<Bill key="bill" t={t} at={18.78} out={21.0} x={1380} y={540} amt="$412" />);
  L.push(<Tag key="last" t={t} at={17.6} x={540} y={300} dx={0} dy={-60} text="LAST MONTH" col={COL.ink} out={21.0} />);
  // D · el sahumerio
  L.push(<Tag key="inc" t={t} at={23.82} x={1300} y={640} dx={-80} dy={-200} text="1 STICK OF INCENSE" col={COL.amber} out={27.6} />);
  L.push(<Tag key="wall" t={t} at={26.52} x={760} y={420} dx={-200} dy={-130} text="OUTSIDE WALL" col={COL.ink} out={27.9} />);
  // E · el humo
  L.push(<Stamp key="up" t={t} at={29.4} text="IT DOESN'T GO UP" x={960} y={180} out={30.6} rot={-4} size={78} />);
  L.push(<Tag key="pull" t={t} at={32.5} x={1000} y={560} dx={260} dy={-150} text="PULLED RIGHT IN" col={COL.red} out={34.3} />);
  // F · Marcus
  L.push(<Stamp key="money" t={t} at={36.9} text="THAT'S YOUR MONEY" x={960} y={870} out={37.75} rot={-4} size={92} />);
  // G · la casa entera: el calor sale arriba, el frío entra abajo
  if (t > 37.9 && t < 43.7) {
    const o = screenOf(t, PT.outlet), rd = screenOf(t, PT.ridge);
    L.push(<Tag key="heat" t={t} at={38.3} x={rd.x} y={rd.y} dx={240} dy={-60} text="THE HEAT YOU PAID FOR" col="#ff9a4a" out={43.2} />);
    L.push(<Tag key="card" t={t} at={41.0} x={o.x} y={o.y} dx={-420} dy={110} text="A HOLE THE SIZE OF" sub="A PLAYING CARD" col={COL.ice} out={43.2} />);
  }
  // H · Marcus se presenta
  L.push(<LowerThird key="lt" t={t} at={43.48} out={47.4} name="MARCUS" l2="HVAC TECH · GEORGIA · 40 YEARS" l2at={44.84} />);
  L.push(<Chips key="ch" t={t} at={48.66} items={["ATTICS", "CRAWL SPACES", "BASEMENTS"]} out={49.85} />);
  // I · Marcus: 12 cosas
  L.push(<BigNum key="12" t={t} at={54.12} text="12" x={960} y={480} size={320} col="#ffd166" edge="#5a4210" out={54.8} sub="THINGS TECHS NEVER TELL YOU" />);
  // J · la casa con los 12 pines
  L.push(<Head key="tw" t={t} at={55.0} out={62.9} txt="12 THINGS TECHS NEVER TELL YOU" y={90} size={70} />);
  L.push(<Pins key="pins" t={t} from={55.3} step={0.62} out={66.3} seven={EV.seven} />);
  L.push(<Tag key="kitch" t={t} at={61.64} x={960} y={620} dx={0} dy={-40} text="NOBODY PAYS THEM TO EXPLAIN IT" col={COL.ink} out={63.2} size={40} />);
  L.push(<Head key="saves" t={t} at={63.62} out={66.3} txt="+ HOW MUCH EACH ONE SAVES" y={90} size={70} col="#5ee38f" />);
  // K · Marcus: el #7
  L.push(<Stamp key="seven" t={t} at={67.26} text="#7 = THE BIG ONE" x={1380} y={250} out={70.95} rot={5} size={84} />);
  L.push(<Tag key="drafty" t={t} at={69.58} x={520} y={760} dx={0} dy={-40} text="DRAFTY OLD HOUSE" col={COL.amber} out={70.95} />);
  // L · el ático: la factura se parte a la mitad, y las primeras cuestan $0
  L.push(<Pins key="pins7" t={t} from={71.0} step={0} out={MIN1_END - 0.2} seven={71.0} cam={W7} />);
  L.push(<Bill key="half" t={t} at={71.3} out={74.5} x={1420} y={500} amt="$412" split={73.2} after="≈ HALF" sc={0.85} />);
  L.push(<Head key="free" t={t} at={77.5} out={MIN1_END - 0.3} txt="THE FIRST ONES COST $0" y={820} size={78} col="#5ee38f" />);
  // fogonazos en los golpes
  L.push(<Flash key="f1" t={t} at={36.9} peak={0.35} w={0.2} />);
  L.push(<Flash key="f2" t={t} at={73.2} peak={0.3} w={0.2} />);
  void Card3D;
  return <AbsoluteFill style={{ background: "#05070b" }}>{base}{L}</AbsoluteFill>;
};

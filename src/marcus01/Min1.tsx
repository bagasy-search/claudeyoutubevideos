// marcus01 · MINUTO 1 (0-72,1 s) a mano, vara gary01. Un solo hilo sin cortes secos:
// avatar + reloj LED 3:00 AM que se muere → portal al dormitorio helado (COLD.) → portal desde la ventana a la calle 3D en la
// tormenta (los cables caen, la cuadra se apaga, 19°F) → zoom a la escalera del sótano → latigazo a Marcus con la tarjeta 3D
// del medidor de gas → zoom a través de la tarjeta al furnace 3D en corte (el gas llega hasta la válvula y se frena: GAS ✓ HEAT ✗)
// → zoom a través de la placa a Marcus (NO POWER = NO HEAT) → la pieza de $5 → Marcus se presenta → la cuenta de lo que viene
// (tarjetas sobre el sótano desenfocado) → Marcus (incendio / liniero) → giro al backfeed 3D que sale a la calle (WRONG WAY).
// Audio fuera de Remotion (la voz se mezcla en encfin). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { FurnaceWorld, PT, EV, screenOf, camSpeed } from "./world3d";
import { BigNum, COL, Card3D, Chips, DrawX, Flash, FONT, LowerThird, P, Tag, Vid, e, ei, extrude, s, spr } from "../kits/yanqui3d/lib";
import { DUR, Price, Stamp, Tr, transition } from "../kits/yanqui3d/engine";
import { Words } from "../kits/yanqui3d/pieces";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";

export const MIN1_END = 72.1;
export const MIN1_FRAMES = Math.round(MIN1_END * 30);
const HAS = AVAIL as { clips: string[]; imgs: string[] };

// ---------- tomas agnes (si falta el mp4, la foto del primer cuadro con zoom lento) ----------
export const Shot: React.FC<{ k: string; t: number; a: number; z?: [number, number]; dur?: number }> = ({ k, t, a, z = [1.03, 1.11], dur = 8 }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + dur);
  return <AbsoluteFill style={{ transform: `scale(${sc})` }}>{HAS.clips.includes(k) ? <Vid id={"ltx_" + k} at={a} /> : <Vid id={"img_" + k} />}</AbsoluteFill>;
};
const cardId = (k: string) => (HAS.clips.includes(k) ? "ltx_" + k : "img_" + k);

// ---------- avatar: ventanas pagadas del reel (preroll 10 cuadros, cola 0,65 s para salir con transición) ----------
const WIN = (AVW as { win: { ms: number; me: number; off: number }[] }).win.filter((w) => w.ms < MIN1_END);
export const Avatar: React.FC<{ t: number; blur?: number; dark?: number; edge?: number }> = ({ t, blur = 0, dark = 0, edge = 0 }) => {
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
      {edge > 0.01 && <AbsoluteFill style={{ filter: `blur(${14 * edge}px) brightness(.7)`, transform: "scale(1.04)", WebkitMaskImage: "radial-gradient(ellipse 46% 52% at 50% 42%, transparent 55%, #000 100%)" } as React.CSSProperties}>{face}</AbsoluteFill>}
    </AbsoluteFill>
  );
};

// ---------- el mundo 3D con blur de movimiento real (velocidad de cámara proyectada) ----------
export const World: React.FC<{ t: number; blur?: number; dark?: number }> = ({ t, blur = 0, dark = 0 }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5) + blur, by: Math.min(3.5, v0.by * 0.5) + blur };
  const id = "mb" + Math.round(t * 30) + "_" + Math.round(blur);
  return (
    <AbsoluteFill style={{ filter: dark > 0 ? `brightness(${1 - dark})` : undefined, transform: blur > 0.5 ? "scale(1.04)" : undefined }}>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><FurnaceWorld t={t} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

// reloj LED 3:00 AM sobre el avatar: titila con el corte, se muere y vuela al centro (de ahí sale el portal al dormitorio)
const LedClock: React.FC<{ t: number }> = ({ t }) => {
  const o = e(t, 0.36, 0.6) * (1 - e(t, 3.85, 4.05));
  if (o <= 0.01) return null;
  const go = ei(t, 2.9, 3.6);
  const x = 1440 + (960 - 1440) * go, y = 300 + (540 - 300) * go, sc = (0.7 + 0.3 * Math.min(1, spr(t, 0.36))) * (1 + go * 0.8);
  const flick = t < 2.0 ? 1 : t < 2.9 ? (Math.sin(t * 61) > -0.2 ? 1 : 0.15) : Math.max(0, 1 - (t - 2.9) / 0.3);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1000px) rotateY(${(1 - go) * -18}deg) rotateX(6deg) scale(${sc})` }}>
      <div style={{ padding: "26px 44px", borderRadius: 26, background: "linear-gradient(180deg,#25272c,#0d0e10)", boxShadow: "0 40px 80px rgba(0,0,0,.7), inset 0 2px 0 rgba(255,255,255,.12), 0 0 0 3px #3a3c42" }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontWeight: 900, fontSize: 170, lineHeight: 1, letterSpacing: 6, color: `rgba(255,59,47,${0.12 + 0.88 * flick})`, textShadow: flick > 0.5 ? "0 0 26px rgba(255,59,47,.9), 0 0 60px rgba(255,59,47,.5)" : "none" }}>
          3:00<span style={{ fontSize: 60, marginLeft: 14 }}>AM</span>
        </div>
      </div>
    </div>
  );
};

// chip redondeado (✓ verde / ✗ rojo)
const Chip: React.FC<{ t: number; at: number; out: number; x: number; y: number; txt: string; ok: boolean; size?: number }> = ({ t, at, out, x, y, txt, ok, size = 64 }) => {
  const o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const c = ok ? "#5ee38f" : COL.red;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${Math.min(1.08, spr(t, at))})`, padding: "14px 34px", borderRadius: 60, background: ok ? "rgba(10,30,20,.9)" : "rgba(40,6,4,.9)", border: `4px solid ${c}`, fontFamily: FONT, fontWeight: 900, fontSize: size, color: c, letterSpacing: 4, boxShadow: `0 24px 50px rgba(0,0,0,.6), 0 0 30px ${ok ? "rgba(94,227,143,.25)" : "rgba(255,74,61,.3)"}`, whiteSpace: "nowrap" }}>{txt}</div>;
};
const Head: React.FC<{ t: number; at: number; out: number; txt: string; y?: number; size?: number; col?: string }> = ({ t, at, out, txt, y = 130, size = 84, col = COL.ink }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: o, fontFamily: FONT, fontWeight: 900, fontSize: size, letterSpacing: 10, color: col, textShadow: extrude(9, "rgba(0,0,0,.65)"), transform: `scale(${0.92 + 0.08 * e(t, at, at + 1.6)})` }}>{txt}</div>;
};

// ---------- BASES (una por frase) + transiciones del kit ----------
type Seg = { a: number; tr: Tr; p?: (t: number) => [number, number]; r: (t: number) => React.ReactNode };
const xy = (q: { x: number; y: number }): [number, number] => [q.x, q.y];
const tGas = EV.gasLine;
const SEG: Seg[] = [
  // 0 · Marcus a oscuras: se le va la luz con el reloj
  { a: 0, tr: "cut", r: (t) => <Avatar t={t} blur={6 * e(t, 2.6, 3.5)} dark={t < 2.0 ? 0 : t < 2.9 ? (Math.sin(t * 47) > 0.3 ? 0.15 : 0.6) : 0.8} /> },
  // 1 · portal desde el reloj → dormitorio helado
  { a: 3.45, tr: "portal", p: () => [960, 540], r: (t) => <Shot k="n_bedroom" t={t} a={3.45} z={[1.12, 1.02]} dur={3} /> },
  // 2 · portal desde la ventana escarchada → la calle 3D en la tormenta
  { a: 6.05, tr: "portal", p: () => [640, 240], r: (t) => <World t={t} /> },
  // 3 · zoom a través del sótano → la escalera con la linterna
  { a: EV.nineteen + 2.0, tr: "zoom", p: (t) => xy(screenOf(t, [-5.5, -1.0, 0])), r: (t) => <Shot k="n_stairs" t={t} a={EV.nineteen + 2.0} /> },
  // 4 · latigazo a Marcus; tarjeta 3D del medidor de gas ("Full gas line")
  { a: 15.95, tr: "whip", r: (t) => {
      const k = spr(t, tGas, 0.8), zt = ei(t, 19.55, 20.05), bl = e(t, tGas - 0.2, tGas + 0.3);
      return (
        <AbsoluteFill>
          <Avatar t={t} blur={11 * bl} dark={0.38 * bl} />
          <Card3D id={cardId("n_gasmeter")} at={tGas} x={600} y={200} w={760} h={428} ry={(1 - Math.min(1, k)) * 60 - 7 + 6 * e(t, tGas, 20)} rx={4} z={(1 - Math.min(1, k)) * -1400 + zt * 1500} o={e(t, tGas, tGas + 0.15) * (1 - e(t, 19.9, 20.06))} label="FULL GAS LINE" labelCol="#ffe066" />
          <Chip t={t} at={tGas + 0.7} out={19.7} x={1600} y={760} txt="GAS ✓" ok />
        </AbsoluteFill>
      );
    } },
  // 5 · zoom a través de la tarjeta → el furnace 3D en el haz de la linterna; el gas llega y se frena en la válvula
  { a: 20.0, tr: "zoom", p: () => [980, 410], r: (t) => <World t={t} /> },
  // 6 · zoom a través de la placa sin luz → Marcus
  { a: 32.16, tr: "zoom", p: (t) => xy(screenOf(t, PT.board)), r: (t) => <Avatar t={t} /> },
  // 7 · la pieza de $5 en su mano
  { a: 37.2, tr: "whipL", r: (t) => <Shot k="m_part" t={t} a={37.2} z={[1.02, 1.1]} /> },
  // 8 · Marcus se presenta junto al furnace
  { a: 43.3, tr: "light", r: (t) => <Shot k="m_intro" t={t} a={43.3} z={[1.1, 1.03]} /> },
  // 9 · Marcus
  { a: 48.95, tr: "whip", r: (t) => <Avatar t={t} edge={e(t, 49.2, 49.6)} /> },
  // 10 · lo que viene: el sótano 3D desenfocado de fondo con las tarjetas encima
  { a: 52.74, tr: "push", r: (t) => <World t={20 + (t - 52.74) * 0.7} blur={9 * e(t, 56.9, 57.3)} dark={0.45 * e(t, 56.9, 57.3)} /> },
  // 11 · Marcus: incendio / liniero
  { a: 63.0, tr: "zoom", p: () => [960, 540], r: (t) => <Avatar t={t} /> },
  // 12 · giro al backfeed 3D: la corriente sale por el secarropas hasta la calle (la manera EQUIVOCADA)
  { a: 66.85, tr: "flip", r: (t) => <World t={EV.backwards - 0.6 + (t - 66.85) * 1.15} /> },
];

export const Min1: React.FC = () => {
  const t = useCurrentFrame() / 30;
  let i = 0; while (i < SEG.length - 1 && SEG[i + 1].a <= t) i++;
  const b = SEG[i], D = DUR[b.tr], k = D > 0 ? (t - b.a) / D : 1;
  const base = i > 0 && k < 1 ? transition(b.tr, k, SEG[i - 1].r(t), b.r(t), b.p ? b.p(b.a) : [960, 540]) : [<AbsoluteFill key="b">{b.r(t)}</AbsoluteFill>];
  const L: React.ReactNode[] = [];
  // A · reloj
  L.push(<LedClock key="led" t={t} />);
  // B · dormitorio
  L.push(<Stamp key="cold" t={t} at={4.55} text="COLD." x={1390} y={600} out={5.85} rot={-7} size={130} />);
  // C · la calle: el poste con hielo, la cuadra a oscuras, 19°F
  if (t > 6 && t < 13.6) {
    const pole = screenOf(t, [9.0, 7.4, 12.0]);
    L.push(<Tag key="pole" t={t} at={EV.linesDown + 0.25} x={pole.x} y={pole.y} dx={-200} dy={-90} text="ICE ON THE LINES" sub="AROUND MIDNIGHT" col={COL.ice} out={EV.dark - 0.2} />);
  }
  L.push(<Head key="street" t={t} at={EV.dark + 0.3} out={EV.nineteen - 0.15} txt="THE WHOLE STREET · DARK" />);
  L.push(<BigNum key="19" t={t} at={EV.nineteen} text="19°F" x={1440} y={430} size={250} col={COL.ice2} edge="#26425e" out={13.0} sub="OUTSIDE" />);
  // D · escalera
  L.push(<Tag key="stairs" t={t} at={14.0} x={1060} y={600} dx={220} dy={-140} text="3 AM · THE BASEMENT" col={COL.amber} out={15.7} size={42} />);
  // F · el furnace 3D: el gas llega, el furnace no hace nada
  if (t > 20.0 && t < 32.6) {
    const v = screenOf(t, PT.valve), bu = screenOf(t, PT.burners), bo = screenOf(t, PT.board);
    L.push(<Tag key="valve" t={t} at={EV.gasLine + 2.6} x={v.x} y={v.y} dx={230} dy={-110} text="GAS VALVE" sub="THE GAS IS RIGHT HERE" col="#ffe066" out={EV.howCan - 0.4} />);
    L.push(<Tag key="quiet" t={t} at={24.14} x={bu.x} y={bu.y} dx={-240} dy={-130} text="DEAD QUIET" col={COL.ice} out={EV.howCan - 0.4} />);
    L.push(<Chip key="gas" t={t} at={EV.howCan + 0.5} out={30.0} x={700} y={860} txt="GAS ✓" ok size={76} />);
    L.push(<Chip key="heat" t={t} at={28.6} out={30.0} x={1220} y={860} txt="HEAT ✗" ok={false} size={76} />);
    L.push(<Tag key="board" t={t} at={30.9} x={bo.x} y={bo.y} dx={220} dy={-120} text="NO POWER" sub="THE PART NOBODY TELLS YOU" col={COL.red} out={32.3} />);
  }
  // G · Marcus
  L.push(<Stamp key="nopow" t={t} at={35.72} text="NO POWER = NO HEAT" x={960} y={880} out={37.35} rot={-4} size={86} />);
  // H · la pieza de $5
  L.push(<Tag key="fix" t={t} at={38.4} x={700} y={640} dx={-230} dy={-160} text="THE FIX" col={COL.amber} out={42.9} />);
  L.push(<Price key="5" t={t} at={40.66} x={1480} y={250} item="HARDWARE STORE" $={5} out={43.2} />);
  // I · Marcus se presenta
  L.push(<LowerThird key="lt" t={t} at={43.32} out={48.7} name="MARCUS" l2="HVAC TECH · GEORGIA · 40 YEARS" l2at={45.3} />);
  L.push(<Chips key="ch" t={t} at={49.3} items={["3 AM CALLS", "COLD BASEMENTS", "40 WINTERS"]} out={52.5} />);
  // J · lo que viene
  L.push(<Head key="why" t={t} at={55.5} out={56.95} txt="WHY IT DIES IN A BLACKOUT" y={150} />);
  if (t > 56.9 && t < 63.6) {
    const cards = [{ k: "s_unplug", at: 57.12, x: 120, lab: "THE $5 PART", c: "#ffe066" }, { k: "s_inverter", at: 59.82, x: 700, lab: "SMALL GENERATOR", c: COL.ink }, { k: "s_station", at: 61.2, x: 1280, lab: "BATTERY STATION", c: COL.ink }];
    cards.forEach((c, j) => {
      const kk = spr(t, c.at, 1), fall = ei(t, 62.8 + j * 0.08, 63.35 + j * 0.08);
      L.push(<AbsoluteFill key={"cd" + j} style={{ transform: `translateY(${fall * 1300}px) rotate(${fall * (j - 1) * 25}deg)` }}>
        <Card3D id={cardId(c.k)} at={c.at} x={c.x} y={310} w={520} h={340} ry={(1 - Math.min(1, kk)) * -80 + (j - 1) * 8} rx={6} z={(1 - Math.min(1, kk)) * -900} o={e(t, c.at, c.at + 0.1)} label={c.lab} labelCol={c.c} />
      </AbsoluteFill>);
    });
    L.push(<Stamp key="mis" t={t} at={62.76} text="+ THE MISTAKES" x={960} y={840} out={63.5} rot={-5} size={92} />);
  }
  // K · Marcus: lo que puede salir mal
  L.push(<Stamp key="fire" t={t} at={63.78} text="BURN THE HOUSE DOWN" x={1370} y={250} out={66.95} rot={5} size={62} />);
  L.push(<Stamp key="line" t={t} at={65.24} text="KILL A LINEMAN" x={1370} y={420} out={66.95} rot={-4} size={62} />);
  // L · la manera equivocada (backfeed a la calle)
  L.push(<Chip key="right" t={t} at={67.5} out={68.4} x={960} y={190} txt="RIGHT WAY ✓" ok size={70} />);
  L.push(<Chip key="wrong" t={t} at={68.44} out={71.9} x={960} y={190} txt="WRONG WAY ✗" ok={false} size={70} />);
  L.push(<Stamp key="pop" t={t} at={70.82} text="REAL POPULAR" x={1300} y={820} out={71.95} rot={-6} size={84} />);
  // fogonazos en los golpes
  L.push(<Flash key="f1" t={t} at={EV.linesDown + 0.55} peak={0.55} col="#cfe6ff" w={0.2} />);
  L.push(<Flash key="f2" t={t} at={35.72} peak={0.35} w={0.2} />);
  void DrawX; void Words;
  return <AbsoluteFill style={{ background: "#05070b" }}>{base}{L}</AbsoluteFill>;
};

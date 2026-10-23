// alpinhum · MINUTO 1 + EL MANUAL (0-104 s). Un solo hilo, sin cortes secos:
// avatar "no pinte esa pared" → portal al pasillo 3D: la pared recién pintada y el balde ANTIHUMEDAD → la cámara baja a la
// ampolla → la toma real (la mano de la señora) → avatar "la aprieta, se rompe" → sale AGUA, el revoque se deshace (LTX)
// → el salitre cae al piso → Doña Elena → avatar 74 años / 2 veces → el CORTE del muro: el agua sube como un mapa de calor
// y la pintura es una tapa, la pared se infla otra vez, US$400 → la cámara pasa por arriba del muro al patio: la jardinera
// y la canaleta (teaser) → avatar → la mesa: cepillo, bolsa, hidrófugo → antes/después → CLAUDIO → la prueba de US$0:
// el martillo y el papel aluminio 48 h → "el pintor: NUNCA" → vuela a la mesa, EL MANUAL se abre en la pág. 11 REAL
// (avatar en videollamada al lado), se pintan las cantidades, el QR → "link en la 1ª línea" → avatar "vamos a la pared".
// Audio fuera de Remotion (voz + sonido real de los clips se mezclan en encfin). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Freeze, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, PT, screenOf, camSpeed, C1, pagePt } from "./muro3d";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import { BigNum, COL, Flash, FONT, LowerThird, P, Portal, Tag, Vid, e, ei, extrude, s, spr } from "./lib";

export const MIN1_END = 104.0;
export const MIN1_FRAMES = s(MIN1_END + 0.7);
const REEL = (AVAIL as { reel: boolean }).reel; // reel del avatar (public/alpinhum/reel0.mp4, 1 /run de RunPod)
const LTX = new Set((AVAIL as { ltx: string[] }).ltx); // clips LTX ya bajados (public/alpinhum/ltx_<k>.mp4); si no, el cuadro clave
export const clip = (k: string) => (LTX.has(k) ? "ltx_" + k : "img_" + k);
const REEL_LEN = 271.5; // largo del reel0.mp4 (se ajusta al llegar): la última ventana se congela en el último cuadro
export const WIN: { ms: number; me: number; off: number }[] = (AVW as { win: { ms: number; me: number; off: number }[] }).win;

export const Avatar: React.FC<{ t: number }> = ({ t }) => {
  const cur = WIN.findIndex((w) => t >= w.ms - 0.02 && t < w.me);
  const vis = cur >= 0 ? cur : WIN.findIndex((w) => t >= w.ms - 0.32 && t < w.me + 0.8);
  const face = REEL ? <>{WIN.map((w, i) => (
    <Sequence key={i} from={Math.max(0, s(w.ms) - 10)} durationInFrames={s(w.me - w.ms) + 12 + 14} layout="none">
      <AbsoluteFill style={{ opacity: i === vis ? 1 : 0 }}><Freeze frame={s(REEL_LEN) - Math.max(0, s(w.off) - 10)} active={(f) => f > s(REEL_LEN) - Math.max(0, s(w.off) - 10)}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Freeze></AbsoluteFill>
    </Sequence>))}</> : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.015 * Math.sin(t * 0.7)})` }} />;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{face}</AbsoluteFill>;
};

export const World: React.FC<{ t: number }> = ({ t }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(6, v0.bx * 0.5), by: Math.min(4, v0.by * 0.5) };
  const id = "mb" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><WorldRaw t={t} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

// toma real (LTX o cuadro clave) con empuje lento propio por plano; a = segundo en que arranca el clip
export const Shot: React.FC<{ k: string; t: number; a: number; z?: [number, number]; ox?: number; oy?: number; dur?: number }> = ({ k, t, a, z = [1.03, 1.12], ox = 0, oy = 0, dur = 8 }) => {
  const q = e(t, a, a + dur), sc = z[0] + (z[1] - z[0]) * q;
  const id = clip(k);
  return <AbsoluteFill style={{ transform: `scale(${sc}) translate(${ox * q}px, ${oy * q}px)` }}><Vid id={id} at={id.startsWith("ltx_") ? a : undefined} /></AbsoluteFill>;
};
// barrido entre dos capas (dir 1 = la nueva entra por la derecha); sin desenfoque: el avatar va nítido
export const Swipe: React.FC<{ t: number; a: number; b: number; from: React.ReactNode; to: React.ReactNode; dir?: number; vert?: boolean }> = ({ t, a, b, from, to, dir = 1, vert }) => {
  const k = ei(t, a, b), ax = vert ? "Y" : "X", D = vert ? 1080 : 1920;
  return (
    <AbsoluteFill>
      {k < 1 && <AbsoluteFill style={{ transform: `translate${ax}(${-dir * k * D}px)` }}>{from}</AbsoluteFill>}
      {k > 0 && <AbsoluteFill style={{ transform: `translate${ax}(${dir * (1 - k) * D}px)` }}>{to}</AbsoluteFill>}
    </AbsoluteFill>
  );
};
// sello que cae girando
export const Stamp: React.FC<{ t: number; at: number; text: string; x: number; y: number; out?: number; rot?: number; size?: number; col?: string }> = ({ t, at, text, x, y, out = 1e9, rot = -9, size = 110, col = COL.red }) => {
  const k = spr(t, at, 1.3), o = e(t, at, at + 0.06) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.4 - 1.4 * Math.min(1, k)})` }}>
      <div style={{ border: `10px solid ${col}`, borderRadius: 14, padding: "6px 30px", fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, letterSpacing: 4, background: "rgba(20,0,0,.25)", boxShadow: `0 0 30px ${col}77`, textShadow: "0 4px 10px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>{text}</div>
    </div>
  );
};
// fichas numeradas que nacen cada una con SU frase
export const ChipsAt: React.FC<{ t: number; items: { at: number; tx: string }[]; out: number; y?: number }> = ({ t, items, out, y = 800 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 34, perspective: 1200 }}>
    {items.map((it, i) => {
      const k = Math.min(1.1, spr(t, it.at)), o = e(t, it.at, it.at + 0.1) * (1 - e(t, out, out + 0.3));
      return (
        <div key={i} style={{ opacity: o, transform: `translateY(${(1 - Math.min(1, k)) * 140}px) rotateX(${(1 - Math.min(1, k)) * 70}deg)`, width: 440, padding: "16px 0 14px", borderRadius: 18,
          background: "linear-gradient(180deg, rgba(52,30,16,.95), rgba(26,16,8,.95))", boxShadow: `0 26px 50px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.18), 0 0 0 2px ${COL.amber}55`, textAlign: "center", fontFamily: FONT }}>
          <div style={{ fontWeight: 900, fontSize: 70, color: COL.amber, lineHeight: 1, textShadow: extrude(6, "#3a2000") }}>{i + 1}</div>
          <div style={{ fontWeight: 800, fontSize: 30, color: COL.ink, letterSpacing: 3, marginTop: 6 }}>{it.tx}</div>
        </div>
      );
    })}
  </div>
);
// el avatar en "videollamada": marco de celular apaisado flotando junto al manual
const VideoCall: React.FC<{ t: number; at: number; out: number; x: number; y: number; w: number }> = ({ t, at, out, x, y, w }) => {
  const k = Math.min(1.1, spr(t, at, 0.8)), o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3)), h = w * 9 / 16;
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, perspective: 1600, opacity: o }}>
      <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transform: `translateZ(${(1 - Math.min(1, k)) * -700}px) rotateY(${14 + (1 - Math.min(1, k)) * 40}deg) rotateX(3deg)`, borderRadius: 34, padding: 14, background: "linear-gradient(160deg,#2b2e33,#0c0d0f)", boxShadow: "0 60px 110px rgba(0,0,0,.7), inset 0 0 0 3px #4a4d52" }}>
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 24, overflow: "hidden" }}>
          <Avatar t={t} />
          <div style={{ position: "absolute", left: 18, top: 16, padding: "6px 14px", borderRadius: 20, background: "rgba(0,0,0,.55)", fontFamily: FONT, fontWeight: 800, fontSize: 22, color: "#fff", display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ width: 12, height: 12, borderRadius: 6, background: "#ff3b30", opacity: Math.sin(t * 5) > 0 ? 1 : 0.3 }} /> CLAUDIO · EN VIVO</div>
        </div>
      </div>
    </div>
  );
};
// "link en la 1ª línea de la descripción": cartel con la descripción esquemática y el renglón 1 iluminado (sin URL en pantalla)
export const LinkCard: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const k = spr(t, at, 0.8), o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.35));
  if (o <= 0.01) return null;
  const hl = e(t, at + 0.4, at + 0.9), sweep = e(t, at + 0.4, at + 1.4);
  const L = (w: number, op = 0.25) => <div style={{ height: 16, width: w, borderRadius: 8, background: `rgba(255,255,255,${op})`, margin: "18px 0 0" }} />;
  return (
    <div style={{ position: "absolute", left: 760, top: 560, perspective: 1500, opacity: o }}>
      <div style={{ transform: `translate(-50%,-50%) translateZ(${(1 - Math.min(1, k)) * -500}px) rotateX(${14 - 8 * Math.min(1, k)}deg) rotateY(${-10 + 4 * Math.sin(t * 0.8)}deg)`, width: 1060, padding: "34px 44px 40px", borderRadius: 26,
        background: "linear-gradient(180deg, rgba(28,30,34,.96), rgba(16,17,20,.96))", boxShadow: "0 70px 120px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.12)", fontFamily: FONT }}>
        <div style={{ color: "rgba(255,255,255,.55)", fontWeight: 800, fontSize: 24, letterSpacing: 4 }}>DESCRIPCIÓN DEL VIDEO</div>
        <div style={{ position: "relative", marginTop: 16, padding: "16px 20px", borderRadius: 14, background: `rgba(255,214,10,${0.18 * hl})`, boxShadow: hl > 0.05 ? `0 0 0 3px rgba(255,214,10,${0.9 * hl}), 0 0 40px rgba(255,214,10,${0.35 * hl})` : undefined, overflow: "hidden" }}>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 40, lineHeight: 1.3 }}>📕 MANUAL DEL ALBAÑIL · pág. 11, la humedad que sube</div>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${-30 + 130 * sweep}%`, width: "25%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent)", opacity: sweep < 1 ? 1 : 0 }} />
        </div>
        {L(880)}{L(940)}{L(660)}{L(800, 0.15)}
      </div>
      <div style={{ position: "absolute", left: -560, top: -250, opacity: hl, transform: `translateX(${-30 * (1 - hl) + 10 * Math.sin(t * 6)}px)`, fontFamily: FONT, fontWeight: 900, fontSize: 54, color: "#ffd60a", textShadow: extrude(6, "#5a4500"), whiteSpace: "nowrap" }}>LINK EN LA 1ª LÍNEA ⬇</div>
    </div>
  );
};

export const Min1: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];

  // ===== A · 0-4,47 · avatar "no pinte esa pared"; portal a la pared 3D =====
  if (t < 4.47) {
    L.push(<Avatar key="avA" t={t} />);
    L.push(<Stamp key="no" t={t} at={0.35} text="NO LA PINTE" x={1450} y={210} out={2.2} size={84} />);
    L.push(<BigNum key="vp" t={t} at={2.3} text="VUELVE PEOR" size={92} x={1430} y={200} out={4.2} col="#ffd0b0" edge="#5a1a10" />);
    const r = ei(t, 3.75, 4.47);
    if (r > 0) L.push(<Portal key="pA" x={1300} y={760} r={r}><World t={Math.max(3.4, t)} /></Portal>);
  }
  // ===== B · 4,47-15,6 · la pared recién pintada, el balde ANTIHUMEDAD, la cámara baja a la ampolla =====
  if (t >= 4.47 && t < 16.0) {
    L.push(<World key="wB" t={t} />);
    const bu = screenOf(t, PT.bucket), wa = screenOf(t, [-0.3, 1.2, -1.35]), bl = screenOf(t, PT.blister);
    L.push(<Tag key="pn" t={t} at={6.76} x={wa.x} y={wa.y} dx={-220} dy={-150} text="PINTURA NUEVA" col={COL.ink} out={10.4} size={50} />);
    L.push(<BigNum key="2m" t={t} at={7.4} text="HACE 2 MESES" size={86} x={1440} y={150} out={10.4} col="#fff1cf" edge="#4a3a20" />);
    L.push(<Tag key="ah" t={t} at={10.88} x={bu.x} y={bu.y} dx={-300} dy={-140} text="«ANTIHUMEDAD»" col="#8fc4ff" out={12.6} size={52} />);
    L.push(<Tag key="ab" t={t} at={13.9} x={bl.x} y={bl.y} dx={-320} dy={-180} text="ABAJO, CERCA DEL PISO" col={COL.amber} out={15.6} size={46} />);
    const r = ei(t, 15.3, 15.95);
    if (r > 0) L.push(<Portal key="pB" x={bl.x} y={bl.y} r={r}><Shot k="h_ampolla" t={t} a={16.0} z={[1.12, 1.04]} /></Portal>);
  }
  // ===== C · 16-16,27 · la toma real (la mano) → avatar =====
  if (t >= 15.95 && t < 16.65) L.push(<Swipe key="swC" t={t} a={16.27} b={16.6} dir={-1} from={<Shot k="h_ampolla" t={t} a={16.0} z={[1.12, 1.04]} />} to={<Avatar t={t} />} />);
  // ===== D · 16,27-22,12 · avatar "un bulto, una ampolla, la aprieta y se rompe" =====
  if (t >= 16.6 && t < 22.12) L.push(<Avatar key="avD" t={t} />);
  if (t >= 16.3 && t < 22.2) {
    L.push(<BigNum key="amp" t={t} at={18.24} text="UNA AMPOLLA" size={110} x={1400} y={190} out={20.7} col="#f3ecd8" edge="#5a4a36" />);
    L.push(<Stamp key="rom" t={t} at={21.48} text="SE ROMPE" x={1420} y={210} out={22.1} size={90} col={COL.amber} />);
  }
  // ===== E · 22,12-28,9 · sale AGUA de la ampolla, corre por la pared (el clip sigue desde donde iba) =====
  if (t >= 22.12 && t < 28.95) {
    L.push(<Swipe key="swE" t={t} a={22.12} b={22.45} from={<Avatar t={t} />} to={
      <Swipe t={t} a={28.6} b={28.95} vert from={<Shot k="h_ampolla" t={t} a={16.0} z={[1.04, 1.12]} dur={13} />} to={<Shot k="h_salitre" t={t} a={28.6} z={[1.02, 1.1]} />} />} />);
    L.push(<BigNum key="ag" t={t} at={22.56} text="AGUA" size={190} x={560} y={260} out={25.2} col={COL.ice2} edge="#0a3a5a" sub="DE VERDAD" />);
    L.push(<Tag key="co" t={t} at={25.5} x={980} y={620} dx={300} dy={120} text="LE CORRE POR LA PARED" col={COL.ice} out={28.1} size={44} />);
    L.push(<Tag key="rv" t={t} at={28.26} x={960} y={560} dx={-300} dy={-180} text="EL REVOQUE" col={COL.amber} out={28.8} size={50} />);
  }
  // ===== F · 28,95-33,9 · el revoque se deshace como arena mojada y cae al piso =====
  if (t >= 28.95 && t < 34.25) {
    L.push(<Swipe key="swF" t={t} a={33.88} b={34.22} from={<Shot k="h_salitre" t={t} a={28.6} z={[1.02, 1.1]} />} to={<Shot k="c_elena" t={t} a={33.88} z={[1.02, 1.08]} dur={3} />} />);
    L.push(<Tag key="ar" t={t} at={30.38} x={900} y={520} dx={260} dy={-200} text="COMO ARENA MOJADA" col="#f3ecd8" out={33.6} size={48} />);
    L.push(<Tag key="pi" t={t} at={32.02} x={1000} y={820} dx={300} dy={-60} text="AL PISO" col={COL.amber} out={33.6} size={48} />);
  }
  // ===== G · 33,9-35,4 · Doña Elena =====
  if (t >= 34.22 && t < 35.75) {
    L.push(<Swipe key="swG" t={t} a={35.38} b={35.72} dir={-1} from={<Shot k="c_elena" t={t} a={33.88} z={[1.02, 1.08]} dur={3} />} to={<Avatar t={t} />} />);
  }
  if (t >= 34.3 && t < 36.0) L.push(<LowerThird key="lE" t={t} at={34.6} out={35.4} name="DOÑA ELENA" l2="LA VECINA DE ENFRENTE" l2at={34.9} />);
  // ===== H · 35,4-41,77 · avatar: 74 años, la pintaron dos veces este año =====
  if (t >= 35.72 && t < 41.77) L.push(<Avatar key="avH" t={t} />);
  if (t >= 35.4 && t < 41.9) {
    L.push(<BigNum key="74" t={t} at={37.82} text="74 AÑOS" size={130} x={1420} y={210} out={39.9} col="#f3ecd8" edge="#4a3a2a" />);
    L.push(<Stamp key="2v" t={t} at={40.3} text="2 VECES ESTE AÑO" x={1360} y={220} out={41.75} size={70} />);
  }
  // ===== I · 41,77-51,6 · el CORTE: el agua sube del piso, la pintura la tapa, se infla otra vez · US$400 · al patio =====
  if (t >= 41.77 && t < 51.95) {
    const r = ei(t, 41.77, 42.2);
    if (r < 1) L.push(<Avatar key="avI" t={t} />);
    L.push(<Portal key="pI" x={960} y={540} r={r}><World t={t} /></Portal>);
    const lo = screenOf(t, PT.cutLow), fi = screenOf(t, PT.film), pl = screenOf(t, PT.planter), pp = screenOf(t, PT.pipe);
    L.push(<Tag key="su" t={t} at={42.3} x={lo.x} y={lo.y} dx={320} dy={60} text="EL AGUA SUBE DEL SUELO" col={COL.ice} out={48.3} size={44} />);
    L.push(<Tag key="ta" t={t} at={43.6} x={fi.x} y={fi.y} dx={240} dy={-130} text="LA PINTURA LA TAPA" col="#cfe3ff" out={48.3} size={46} />);
    L.push(<Stamp key="if" t={t} at={44.64} text="OTRA VEZ INFLADA" x={1420} y={120} out={46.0} size={64} />);
    L.push(<BigNum key="400" t={t} at={44.98 + 1.3} text="US$ 400" size={150} x={1380} y={860} out={48.4} col="#ffd0b0" edge="#5a1a10" sub="TIRADOS EN LA MISMA PARED" />);
    L.push(<Tag key="jd" t={t} at={50.94} x={pl.x} y={pl.y} dx={-260} dy={-170} text="AFUERA…" col={COL.amber} out={51.8} size={52} />);
    L.push(<Tag key="cn" t={t} at={51.2} x={pp.x} y={pp.y} dx={260} dy={-120} text="?" col={COL.amber} out={51.8} size={60} />);
    const rp = ei(t, 51.55, 51.95);
    if (rp > 0) L.push(<Portal key="pJ" x={pl.x} y={pl.y} r={rp}><Shot k="o_jardinera" t={t} a={51.55} z={[1.0, 1.08]} dur={3} /></Portal>);
  }
  // ===== J · 51,9-53,5 · la jardinera y la canaleta en la lluvia (teaser) =====
  if (t >= 51.95 && t < 53.85) {
    L.push(<Swipe key="swJ" t={t} a={53.5} b={53.84} dir={-1} from={<Shot k="o_jardinera" t={t} a={51.55} z={[1.0, 1.08]} dur={3} />} to={<Avatar t={t} />} />);
    L.push(<Tag key="ex" t={t} at={52.56} x={960} y={560} dx={-280} dy={-200} text="ESTO LO EXPLICÓ TODO" col={COL.amber} out={53.4} size={50} />);
  }
  // ===== K · 53,5-58,84 · avatar: por qué pasa, cómo se arregla, que no vuelva =====
  if (t >= 53.84 && t < 58.84) L.push(<Avatar key="avK" t={t} />);
  if (t >= 53.5 && t < 59.2) L.push(<ChipsAt key="chp" t={t} out={58.6} items={[{ at: 54.96, tx: "POR QUÉ PASA" }, { at: 56.3, tx: "CÓMO SE ARREGLA" }, { at: 57.4, tx: "QUE NO VUELVA" }]} />);
  // ===== L · 58,84-64,6 · la mesa: cepillo de alambre, bolsa de cemento, el líquido para el agua =====
  if (t >= 58.84 && t < 64.95) {
    const k = ei(t, 58.84, 59.2);
    if (k < 1) L.push(<Avatar key="avL" t={t} />);
    L.push(<AbsoluteFill key="wL" style={{ clipPath: `circle(${k * 1200}px at 960px 540px)` }}><World t={t} /></AbsoluteFill>);
    const b1 = screenOf(t, PT.brush), b2 = screenOf(t, [PT.bag[0], 0.3, PT.bag[2]]), b3 = screenOf(t, [PT.bottle[0], 0.95, PT.bottle[2]]);
    L.push(<Tag key="t1" t={t} at={59.2} x={b1.x} y={b1.y} dx={260} dy={-160} text="CEPILLO DE ALAMBRE" col={COL.ink} out={64.4} size={42} />);
    L.push(<Tag key="t2" t={t} at={60.7} x={b2.x} y={b2.y} dx={-380} dy={60} text="BOLSA DE CEMENTO" col={COL.ink} out={64.4} size={42} />);
    L.push(<Tag key="t3" t={t} at={62.3} x={b3.x} y={b3.y} dx={200} dy={-220} text="HIDRÓFUGO" sub="VA EN EL AGUA DE LA MEZCLA" col="#7dffb8" out={64.4} size={46} />);
  }
  // ===== M · 64,6-68,34 · así estaba / así va a quedar · CLAUDIO =====
  if (t >= 64.6 && t < 68.7) {
    const k = ei(t, 64.6, 64.95);
    const wipe = ei(t, 66.2, 66.7);
    const ad = <AbsoluteFill><Shot k="c_antes" t={t} a={64.6} z={[1.02, 1.08]} dur={4} />
      <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${(1 - wipe) * 100}%)` }}><Shot k="c_despues" t={t} a={64.6} z={[1.02, 1.08]} dur={4} /></AbsoluteFill>
      {wipe > 0.01 && wipe < 0.99 && <div style={{ position: "absolute", top: 0, bottom: 0, left: `${(1 - wipe) * 100}%`, width: 8, background: "#fff", boxShadow: "0 0 30px rgba(255,255,255,.8)" }} />}
    </AbsoluteFill>;
    L.push(<Swipe key="swM" t={t} a={64.6} b={64.95} from={<World t={Math.min(t, 64.6)} />} to={
      <Swipe t={t} a={68.34} b={68.68} dir={-1} from={ad} to={<Avatar t={t} />} />} />);
    void k;
    L.push(<Tag key="ae" t={t} at={64.9} x={640} y={500} dx={-200} dy={-200} text="ASÍ ESTABA" col={COL.red} out={66.3} size={50} />);
    L.push(<Tag key="aq" t={t} at={66.5} x={1240} y={500} dx={-300} dy={-200} text="ASÍ VA A QUEDAR" col="#7dffb8" out={68.3} size={50} />);
  }
  if (t >= 67.5 && t < 72.0) L.push(<LowerThird key="lt" t={t} at={67.76} out={71.6} name="CLAUDIO" l2="30 AÑOS DE ALBAÑIL" l2at={68.66} />);
  // ===== N · 68,34-73,38 · avatar: la prueba de US$0 =====
  if (t >= 68.68 && t < 73.38) L.push(<Avatar key="avN" t={t} />);
  if (t >= 72.0 && t < 77.5) L.push(<BigNum key="p0" t={t} at={72.9} text="LA PRUEBA DE US$0" size={96} x={1350} y={190} out={77.2} col="#fff1cf" edge="#4a3a20" />);
  // ===== O · 73,38-77,8 · antes de pintar: el martillo · 77,8-83,3 el papel aluminio, 48 h =====
  if (t >= 73.38 && t < C1 + 0.4) {
    L.push(<Swipe key="swO" t={t} a={73.38} b={73.72} from={<Avatar t={t} />} to={
      <Swipe t={t} a={77.8} b={78.15} vert from={<Shot k="k_golpe" t={t} a={73.38} z={[1.03, 1.1]} dur={5} />} to={<Shot k="k_alu" t={t} a={77.8} z={[1.02, 1.1]} dur={6} />} />} />);
    L.push(<Tag key="ap" t={t} at={74.52} x={960} y={600} dx={-320} dy={-200} text="ANTES DE PINTAR" col={COL.amber} out={77.6} size={48} />);
    L.push(<Tag key="al" t={t} at={78.84} x={700} y={560} dx={80} dy={320} text="PAPEL ALUMINIO 30×30" col={COL.ink} out={82.4} size={44} />);
    L.push(<BigNum key="48" t={t} at={79.8} text="48 H" size={170} x={1500} y={260} out={82.4} col={COL.ice2} edge="#0a3a5a" sub="DOS DÍAS" />);
    L.push(<Stamp key="nu" t={t} at={82.64} text="EL PINTOR: NUNCA" x={960} y={540} out={83.5} size={84} />);
  }
  // ===== CTA · 83,3-101,68 · vuelo a la mesa, EL MANUAL se abre en la pág. 11 REAL =====
  if (t >= C1 && t < 102.05) {
    const k = ei(t, C1, C1 + 0.4);
    L.push(<AbsoluteFill key="wC" style={{ clipPath: `circle(${k * 1200}px at 960px 540px)` }}><World t={t} /></AbsoluteFill>);
    L.push(<Flash key="flC" t={t} at={C1 + 0.02} col="#fff1cf" peak={0.5} w={0.3} />);
    const bk = screenOf(t, [PT.book[0], PT.book[1] + 0.04, PT.book[2]]);
    L.push(<Tag key="g1" t={t} at={87.24} x={bk.x} y={bk.y - 40} dx={300} dy={-170} text="MANUAL DEL ALBAÑIL" sub="DE CLAUDIO" col="#ffd08a" out={88.7} size={52} />);
    L.push(<VideoCall key="vc" t={t} at={85.33} out={89.9} x={70} y={250} w={760} />);
    L.push(<BigNum key="p11" t={t} at={88.78} text="PÁG. 11" size={120} x={1560} y={150} out={91.6} col="#ffd60a" edge="#5a4500" />);
    const pc = screenOf(t, pagePt(0.6, 0.453)), mz = screenOf(t, pagePt(0.83, 0.474)), sc = screenOf(t, pagePt(0.43, 0.515)), ns = screenOf(t, pagePt(0.49, 0.87));
    L.push(<Tag key="pc" t={t} at={92.2} x={pc.x} y={pc.y} dx={300} dy={-150} text="HASTA DÓNDE PICAR" col="#ffd60a" out={97.0} size={40} />);
    L.push(<Tag key="mz" t={t} at={93.16} x={mz.x} y={mz.y} dx={-60} dy={230} text="LA MEZCLA EXACTA" col="#ffd60a" out={97.0} size={40} />);
    L.push(<Tag key="se" t={t} at={94.74} x={sc.x} y={sc.y} dx={-320} dy={130} text="CUÁNTO ESPERAR" col="#ffd60a" out={97.0} size={40} />);
    L.push(<Tag key="ns" t={t} at={97.6} x={ns.x} y={ns.y} dx={320} dy={-60} text="SI LA HUMEDAD PASA POR ENCIMA" col="#ffb36b" out={99.0} size={40} />);
    L.push(<LinkCard key="lk" t={t} at={99.2} out={101.6} />);
  }
  // ===== R · 101,68-104 · avatar "ahora sí, vamos a la pared" =====
  if (t >= 101.68) L.push(<Swipe key="swR" t={t} a={101.68} b={102.02} dir={-1} from={<World t={Math.min(t, 101.68)} />} to={<Avatar t={t} />} />);

  return <AbsoluteFill style={{ background: "#0b0e13" }}>{L}</AbsoluteFill>;
};

// wade01 · MINUTO 1 (0-72,1 s), a mano. Un solo hilo, sin cortes secos:
// avatar → (la bombita se cae y es la del sótano: portal) → escalera real → el sótano 3D en corte con el olor → (portal desde la pared)
// → la mano en la pared húmeda → avatar con "WHITE CRUST" → (latigazo) rincón con cajas y moho → (portal se cierra en el rincón 3D)
// → el vapor del aire se pega a las paredes "every single hour" → (latigazo) avatar con el deshumidificador de $300 → la toma
// del tanque lleno → (zoom a través) vuelo al balde del rincón, $4 → avatar NO POWER → (portal desde la pupila) balanza 3D, días 1→7
// → latigazo a la pared que filtra: REAL LEAK → avatar con rótulo de Wade → (portal desde la gorra) el techo.
// Audio fuera de Remotion (la voz se mezcla en encfin). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BasementWorld, PT, screenOf, camSpeed } from "./basement3d";
import { BigNum, Bulb, COL, Flash, FONT, LowerThird, P, Portal, Tag, Vid, e, ei, extrude, s, spr, setSlug } from "../kits/yanqui3d/lib";
import { Stamp, Price } from "../kits/yanqui3d/engine";
import AVW from "./avwin_k.json";
import AVAIL from "./avail.json";

setSlug("wade01");
export const MIN1_FRAMES = 2163; // 72,1 s

const HAS = AVAIL as { clips: string[]; imgs: string[] };
const REEL = true; // true cuando llegue el reel (public/wade01/reel0.mp4)
const Shot: React.FC<{ k: string; t: number; a: number; from?: number; z?: [number, number]; dur?: number }> = ({ k, t, a, from = 0, z = [1.04, 1.12], dur = 8 }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + dur);
  const inner = HAS.clips.includes(k) ? <Vid id={"ltx_" + k} from={from} at={a} /> : HAS.imgs.includes(k) ? <Vid id={"img_" + k} /> :
    <AbsoluteFill style={{ background: "linear-gradient(135deg,#1b2430,#0b0f14)", color: "#556", fontFamily: FONT, fontSize: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>{k}</AbsoluteFill>;
  return <AbsoluteFill style={{ transform: `scale(${sc})` }}>{inner}</AbsoluteFill>;
};

// ---------- AVATAR: ventanas pagadas (preroll 10 cuadros) ----------
const WIN = (AVW as number[][]).filter(([ms]) => ms < 72).map(([ms, me, off]) => ({ ms, me, off }));
const Avatar: React.FC<{ t: number; blur?: number; dark?: number; edge?: number }> = ({ t, blur = 0, dark = 0, edge = 0 }) => {
  const face = REEL ? WIN.map((w, i) => (
    <Sequence key={i} from={Math.max(0, s(w.ms) - 10)} durationInFrames={s(w.me - w.ms) + 30} layout="none">
      <AbsoluteFill style={{ opacity: t >= w.ms - 0.02 && t < w.me + 0.65 ? 1 : 0 }}>
        <OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - (w.ms > 0 ? 10 : 0))} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </Sequence>
  )) : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ filter: blur > 0.2 ? `blur(${blur}px) brightness(${1 - dark})` : dark > 0 ? `brightness(${1 - dark})` : undefined, transform: blur > 0.2 ? "scale(1.04)" : undefined }}>{face}</AbsoluteFill>
      {edge > 0.01 && <AbsoluteFill style={{ filter: `blur(${14 * edge}px) brightness(.7)`, transform: "scale(1.04)", WebkitMaskImage: "radial-gradient(ellipse 46% 52% at 50% 42%, transparent 55%, #000 100%)" } as React.CSSProperties}>{face}</AbsoluteFill>}
    </AbsoluteFill>
  );
};

// mundo 3D con blur de movimiento real
export const World: React.FC<{ t: number }> = ({ t }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const id = "mb" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><BasementWorld t={t} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

// texto grande con extrusión que entra palabra por palabra
const Big: React.FC<{ t: number; at: number; out: number; text: string; y?: number; size?: number; col?: string }> = ({ t, at, out, text, y = 150, size = 92, col = COL.ink }) => {
  const o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: o, fontFamily: FONT, fontWeight: 900, fontSize: size, letterSpacing: 8, color: col, textShadow: extrude(9, "rgba(0,0,0,.6)"), transform: `scale(${0.92 + 0.08 * Math.min(1, spr(t, at))})` }}>{text}</div>;
};

// higrómetro flotante (2.5D) que sube de golpe
export const Gauge: React.FC<{ t: number; at: number; out: number; from: number; to: number; dur?: number; x?: number; y?: number; label?: string }> = ({ t, at, out, from, to, dur = 1.6, x = 1560, y = 300, label = "HUMIDITY" }) => {
  const o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const v = Math.round(from + (to - from) * ei(t, at + 0.2, at + 0.2 + dur));
  const bad = v > 60;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(900px) rotateY(-14deg) scale(${Math.min(1.06, spr(t, at))})` }}>
      <div style={{ width: 300, padding: "18px 0 14px", borderRadius: 24, background: "linear-gradient(180deg,#f3f2ec,#d9d8d0)", boxShadow: "0 40px 70px rgba(0,0,0,.6), inset 0 2px 0 #fff", textAlign: "center" }}>
        <div style={{ margin: "0 24px", borderRadius: 12, background: "#c9d3c2", boxShadow: "inset 0 3px 8px rgba(0,0,0,.35)", padding: "6px 0" }}>
          <span style={{ fontFamily: "'Courier New', monospace", fontWeight: 900, fontSize: 120, lineHeight: 1, color: bad ? "#7a1d12" : "#13301d" }}>{v}</span>
          <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 46, color: "#26302a" }}>%</span>
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, letterSpacing: 5, color: "#3a3f3a", marginTop: 8 }}>{label}</div>
      </div>
    </div>
  );
};

export const Min1: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];

  // ===== A · 0-3,5 · avatar (“you walk down the basement stairs”); la bombita cuelga, titila y abre el portal a la escalera =====
  if (t < 3.6) {
    L.push(<Avatar key="avA" t={t} blur={8 * e(t, 2.7, 3.4)} dark={0.4 * e(t, 2.7, 3.4)} />);
    L.push(<Bulb key="bA" t={t} at={0.4} off={2.9} out={3.6} x={1440} y={40} />);
    L.push(<Big key="st" t={t} at={0.96} out={2.6} text="THE BASEMENT" y={820} size={80} />);
    const r = ei(t, 3.05, 3.52);
    if (r > 0) L.push(<Portal key="pA" x={1440} y={330} r={r}><Shot k="s01" t={t} a={3.05} /></Portal>);
  }
  // ===== B · 3,5-5,8 · bajando la escalera real; “you smell it” =====
  if (t >= 3.5 && t < 6.45) {
    const z = ei(t, 5.55, 6.4);
    L.push(<AbsoluteFill key="s01" style={{ transformOrigin: "960px 620px", transform: `scale(${1 + z * z * 5})`, filter: z > 0.05 ? `blur(${z * 16}px)` : undefined, opacity: 1 - e(t, 6.05, 6.4) }}><Shot k="s01" t={t} a={3.05} /></AbsoluteFill>);
    if (z > 0.2) L.push(<AbsoluteFill key="wB0" style={{ opacity: e(t, 5.85, 6.3), zIndex: -1 }}><World t={Math.max(5.75, t)} /></AbsoluteFill>);
    L.push(<Big key="sm" t={t} at={4.64} out={5.7} text="YOU SMELL IT" y={140} size={86} />);
  }
  // ===== C · 5,8-10,4 · el sótano 3D en corte: mechones de olor, la cámara entra al rincón; “like an old towel in a gym bag” =====
  if (t >= 6.0 && t < 10.9) {
    L.push(<World key="wC" t={t} />);
    const c = screenOf(t, PT.corner);
    L.push(<Tag key="mu" t={t} at={6.82} x={c.x} y={c.y} dx={-300} dy={-180} text="MUSTY" sub="= WATER IN THE AIR" col="#b9d39a" out={9.9} size={56} />);
    const w = screenOf(t, PT.wallR);
    const pr = ei(t, 10.0, 10.48);
    if (pr > 0) L.push(<Portal key="pW" x={w.x} y={w.y} r={pr}><Shot k="s02" t={t} a={10.0} /></Portal>);
  }
  // ===== D · 10,4-13,3 · la mano en la pared: fría y húmeda =====
  if (t >= 10.45 && t < 13.75) {
    const wp = ei(t, 13.26, 13.72), mb = Math.sin(wp * Math.PI) * 40;
    L.push(<AbsoluteFill key="s02" style={{ transform: `translateX(${-wp * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>
      <Shot k="s02" t={t} a={10.0} />
      <Tag t={t} at={11.92} x={900} y={520} dx={-260} dy={-170} text="COLD" col={COL.ice} out={13.1} size={60} />
      <Tag t={t} at={12.58} x={1060} y={600} dx={260} dy={140} text="DAMP" col={COL.ice2} out={13.1} size={60} />
    </AbsoluteFill>);
    if (wp > 0) L.push(<AbsoluteFill key="avD" style={{ transform: `translateX(${(1 - wp) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Avatar t={Math.max(t, 13.3)} /></AbsoluteFill>);
  }
  // ===== E · 13,3-17,55 · avatar con la costra blanca en tarjeta; latigazo al rincón de las cajas =====
  if (t >= 13.7 && t < 18.05) {
    const wp = ei(t, 17.55, 18.02), mb = Math.sin(wp * Math.PI) * 40;
    const bl = e(t, 13.9, 14.3) * (1 - e(t, 16.2, 16.6));
    L.push(<AbsoluteFill key="avE" style={{ transform: `translateX(${-wp * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>
      <Avatar t={t} blur={12 * bl} dark={0.35 * bl} />
      {/* tarjeta con la costra blanca (foto real) que gira desde el fondo */}
      {(() => { const k = Math.min(1, spr(t, 13.82, 0.9)), o = e(t, 13.82, 13.95) * (1 - e(t, 16.2, 16.5));
        return o > 0.01 ? <div style={{ position: "absolute", left: 960, top: 520, opacity: o, transform: `translate(-50%,-50%) perspective(1600px) rotateY(${(1 - k) * 70 - 6}deg) translateZ(${(1 - k) * -900}px)` }}>
          <div style={{ width: 860, height: 484, borderRadius: 22, overflow: "hidden", boxShadow: "0 50px 90px rgba(0,0,0,.7), 0 0 0 4px rgba(255,255,255,.8)" }}><Shot k="s03" t={t} a={13.82} z={[1.08, 1.14]} /></div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: -86, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 64, letterSpacing: 6, color: "#f6f4ec", textShadow: extrude(7, "rgba(0,0,0,.65)") }}>WHITE CRUST</div>
        </div> : null; })()}
      <Big t={t} at={16.88} out={17.45} text="THE CORNER" y={820} size={70} />
    </AbsoluteFill>);
    if (wp > 0) L.push(<AbsoluteFill key="s04in" style={{ transform: `translateX(${(1 - wp) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Shot k="s04" t={t} a={17.55} /></AbsoluteFill>);
  }
  // ===== F · 17,55-23,9 · cartón blando, puntitos negros que trepan; el portal se cierra en el rincón 3D =====
  if (t >= 18.0 && t < 24.4) {
    const shrink = ei(t, 23.4, 23.95);
    const c = screenOf(23.9, PT.corner);
    const shot = <AbsoluteFill><Shot k="s04" t={t} a={17.55} />
      <Tag t={t} at={19.68} x={760} y={720} dx={-200} dy={120} text="SOFT" col={COL.amber} out={23.2} size={52} />
      <Tag t={t} at={21.18} x={1180} y={420} dx={220} dy={-140} text="MOLD" sub="CLIMBING" col="#9fe08a" out={23.2} size={52} />
    </AbsoluteFill>;
    if (shrink > 0) L.push(<World key="wF" t={23.9} />);
    L.push(shrink > 0 ? <Portal key="pF" x={c.x} y={c.y} r={1 - shrink}>{shot}</Portal> : <AbsoluteFill key="f1">{shot}</AbsoluteFill>);
  }
  // ===== G · 23,9-30,9 · “That's not a smell. That's water.” el vapor del aire se pega a las paredes; reloj de 24 h =====
  if (t >= 23.9 && t < 31.4) {
    L.push(<World key="wG" t={t} />);
    L.push(<Stamp key="ns" t={t} at={24.0} text="NOT A SMELL" x={560} y={250} out={25.3} rot={-7} size={74} />);
    L.push(<BigNum key="wa" t={t} at={25.48} text="WATER" x={960} y={220} size={170} col={COL.ice2} edge="#1d4a6e" out={27.3} />);
    L.push(<Big key="air" t={t} at={27.54} out={28.9} text="OUT OF THE AIR" y={120} size={78} col={COL.ice} />);
    // reloj circular de 24 horas que da la vuelta (every single hour of every single day)
    const o = e(t, 28.4, 28.6) * (1 - e(t, 30.6, 30.85));
    if (o > 0.01) {
      const k = ei(t, 28.5, 30.4);
      L.push(<div key="clk" style={{ position: "absolute", left: 1560, top: 300, opacity: o, transform: `translate(-50%,-50%) scale(${Math.min(1.05, spr(t, 28.4))})` }}>
        <svg width={300} height={300}><circle cx={150} cy={150} r={120} fill="rgba(8,16,26,.75)" stroke="rgba(255,255,255,.25)" strokeWidth={6} />
          <circle cx={150} cy={150} r={120} fill="none" stroke={COL.ice} strokeWidth={14} strokeDasharray={`${754 * k} 754`} transform="rotate(-90 150 150)" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px ${COL.ice})` }} />
          <line x1={150} y1={150} x2={150 + Math.sin(k * 6.283 * 3) * 80} y2={150 - Math.cos(k * 6.283 * 3) * 80} stroke="#fff" strokeWidth={6} strokeLinecap="round" /></svg>
        <div style={{ position: "absolute", left: 0, right: 0, top: 112, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 64, color: "#fff" }}>{Math.round(k * 24)}h</div>
        <div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: 5, color: COL.ice2, marginTop: 6 }}>EVERY HOUR · EVERY DAY</div>
      </div>);
    }
    const wp = ei(t, 30.88, 31.35), mb = Math.sin(wp * Math.PI) * 40;
    if (wp > 0) {
      L.length = 0;
      L.push(<AbsoluteFill key="wGo" style={{ transform: `translateX(${-wp * 1920}px)`, filter: `blur(${mb}px)` }}><World t={30.88} /></AbsoluteFill>);
      L.push(<AbsoluteFill key="avGi" style={{ transform: `translateX(${(1 - wp) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Avatar t={Math.max(t, 30.9)} /></AbsoluteFill>);
    }
  }
  // ===== H · 30,9-35,5 · avatar: “most folks… go buy a $300 dehumidifier”; el precio cuelga; zoom a través =====
  if (t >= 31.35 && t < 36.0) {
    const z = ei(t, 35.5, 35.98);
    L.push(<AbsoluteFill key="avH" style={{ transformOrigin: "1420px 470px", transform: `scale(${1 + z * z * 6})`, filter: z > 0.05 ? `blur(${z * 18}px)` : undefined }}>
      <Avatar t={t} />
      <Price t={t} at={33.12} x={1420} y={330} item="DEHUMIDIFIER" $={300} out={35.4} />
    </AbsoluteFill>);
    if (z > 0.4) L.push(<AbsoluteFill key="s05in" style={{ opacity: e(t, 35.7, 35.98) }}><Shot k="s05" t={t} a={35.5} /></AbsoluteFill>);
  }
  // ===== I · 35,5-39,5 · tanque lleno; “pay the power company to run it all summer”: el medidor de luz gira =====
  if (t >= 35.95 && t < 40.0) {
    const z = ei(t, 39.3, 39.95);
    L.push(<AbsoluteFill key="s05" style={{ transformOrigin: "960px 540px", transform: `scale(${1 + z * z * 4})`, filter: z > 0.05 ? `blur(${z * 16}px)` : undefined, opacity: 1 - e(t, 39.6, 39.95) }}>
      <Shot k="s05" t={t} a={35.5} />
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(0,0,0,.6), transparent 45%)" }} />
      {(() => { const o = e(t, 36.6, 36.8) * (1 - e(t, 39.2, 39.4)); const kwh = Math.round(ei(t, 36.8, 39.2) * 214);
        return o > 0.01 ? <div style={{ position: "absolute", left: 1500, top: 760, opacity: o, transform: `translate(-50%,-50%) scale(${Math.min(1.05, spr(t, 36.6))})`, padding: "18px 34px", borderRadius: 18, background: "rgba(30,10,6,.85)", border: `4px solid ${COL.red}`, fontFamily: FONT, color: COL.red, textAlign: "center", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>
          <div style={{ fontWeight: 900, fontSize: 96, lineHeight: 1 }}>+{kwh} kWh</div>
          <div style={{ fontWeight: 800, fontSize: 26, letterSpacing: 5, color: "#ffb3a8" }}>ALL SUMMER</div></div> : null; })()}
    </AbsoluteFill>);
    if (z > 0.3) L.push(<AbsoluteFill key="wIn" style={{ opacity: e(t, 39.45, 39.95), zIndex: -1 }}><World t={39.45} /></AbsoluteFill>);
  }
  // ===== J · 39,5-46,8 · vuelo al balde del rincón (luz de héroe); “INSTEAD”; $4; la bolsa de sal =====
  if (t >= 39.6 && t < 47.3) {
    L.push(<World key="wJ" t={Math.min(t, 46.85)} />);
    L.push(<Flash key="flJ" t={t} at={39.62} peak={0.5} />);
    L.push(<Big key="ins" t={t} at={41.46} out={43.2} text="40 YEARS · INSTEAD" y={130} size={76} col={COL.amber} />);
    const b = screenOf(t, PT.bucketTop);
    L.push(<Price key="p4" t={t} at={43.4} x={b.x + 230} y={b.y - 210} item="BUCKET" $={4} out={46.6} />);
    L.push(<Tag key="bag" t={t} at={45.02} x={b.x} y={b.y + 40} dx={-320} dy={150} text="A BAG FROM" sub="THE WINTER AISLE" col={COL.ice2} out={46.6} size={48} />);
    const wp = ei(t, 46.8, 47.27), mb = Math.sin(wp * Math.PI) * 40;
    if (wp > 0) {
      L.length = 0;
      L.push(<AbsoluteFill key="wJo" style={{ transform: `translateY(${-wp * 1080}px)`, filter: `blur(${mb}px)` }}><World t={46.85} /></AbsoluteFill>);
      L.push(<AbsoluteFill key="avJi" style={{ transform: `translateY(${(1 - wp) * 1080}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Avatar t={Math.max(t, 46.85)} /></AbsoluteFill>);
    }
  }
  // ===== K · 46,8-51,3 · avatar: “no electricity at all” — enchufe tachado; portal desde el centro a la balanza =====
  if (t >= 47.25 && t < 51.75) {
    L.push(<Avatar key="avK" t={t} blur={10 * e(t, 49.3, 49.6) * (1 - e(t, 50.8, 51.1))} dark={0.3 * e(t, 49.3, 49.6)} />);
    L.push(<Stamp key="np" t={t} at={49.6} text="NO POWER" x={960} y={760} out={51.0} rot={-6} size={120} />);
    // enchufe con cable cortado
    const o = e(t, 49.5, 49.65) * (1 - e(t, 51.0, 51.2));
    if (o > 0.01) L.push(<svg key="plug" width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
      <g transform={`translate(960 380) scale(${Math.min(1.05, spr(t, 49.5))})`}>
        <path d="M-260 0 C -170 0 -150 -30 -90 -30" stroke="#ddd" strokeWidth={14} fill="none" strokeLinecap="round" />
        <rect x={-90} y={-62} width={110} height={64} rx={12} fill="#eee" /><rect x={20} y={-50} width={36} height={10} fill="#bbb" /><rect x={20} y={-22} width={36} height={10} fill="#bbb" />
        <line x1={-150} y1={-130} x2={130} y2={70} stroke={COL.red} strokeWidth={18} strokeLinecap="round" strokeDasharray={360} strokeDashoffset={360 * (1 - e(t, 49.8, 50.1))} />
      </g></svg>);
    const r = ei(t, 51.28, 51.72);
    if (r > 0) L.push(<Portal key="pK" x={960} y={540} r={r}><World t={51.28} /></Portal>);
  }
  // ===== L · 51,3-58,6 · balanza 3D: “at the end of seven days… on a scale”; días 1→7; la aguja =====
  if (t >= 51.7 && t < 59.1) {
    L.push(<World key="wL" t={Math.min(t, 58.6)} />);
    const day = t < 52.12 ? 0 : Math.min(7, 1 + Math.floor((t - 52.12) / 0.6));
    if (day > 0) L.push(<BigNum key={"d" + day} t={t} at={52.12 + (day - 1) * 0.6} text={`DAY ${day}`} x={480} y={210} size={130} out={day === 7 ? 55.3 : 52.12 + day * 0.6 - 0.1} />);
    const sc = screenOf(t, PT.scale);
    L.push(<Tag key="sca" t={t} at={55.4} x={sc.x} y={sc.y} dx={260} dy={-170} text="ON A SCALE" sub="EXACTLY WHAT IT DOES" col={COL.amber} out={58.4} size={52} />);
    L.push(<BigNum key="q" t={t} at={56.9} text="? LB" x={1500} y={260} size={150} col={COL.ice2} edge="#1d4a6e" out={58.3} />);
  }
  // ===== M · 58,6-62,5 · latigazo a la pared que filtra; “when this trick is not enough… a real leak” =====
  if (t >= 58.55 && t < 62.95) {
    const wp = ei(t, 62.48, 62.92), mb = Math.sin(wp * Math.PI) * 40;
    L.push(<AbsoluteFill key="wM" style={{ transform: `translateX(${-wp * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>
      <World t={Math.min(t, 62.48)} />
      <Big t={t} at={61.06} out={62.3} text="NOT ENOUGH?" y={120} size={86} col={COL.red} />
      {(() => { const w = screenOf(Math.min(t, 62.48), PT.wallFoot); return <Tag t={t} at={59.6} x={w.x} y={w.y} dx={-420} dy={-260} text="WATER COMING IN" sub="THROUGH THE WALL" col={COL.ice} out={62.3} size={50} />; })()}
    </AbsoluteFill>);
    if (wp > 0) L.push(<AbsoluteFill key="avMi" style={{ transform: `translateX(${(1 - wp) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Avatar t={Math.max(t, 62.5)} /></AbsoluteFill>);
  }
  // ===== N · 62,5-67,15 · avatar: “a real leak you need to go find” — sello; “My name is Wade” → rótulo =====
  if (t >= 62.9 && t < 67.65) {
    const r = ei(t, 67.15, 67.62);
    L.push(<Avatar key="avN" t={t} />);
    L.push(<Stamp key="rl" t={t} at={63.44} text="REAL LEAK" x={1450} y={300} out={65.3} rot={7} size={96} />);
    if (r > 0) L.push(<Portal key="pN" x={960} y={170} r={r}><Shot k="s08" t={t} a={67.15} /></Portal>);
  }
  if (t >= 65.9 && t < 72.0) L.push(<LowerThird key="lt" t={t} at={65.98} out={71.6} name="WADE" l2="ROOFER · TENNESSEE · 40 YEARS" l2at={67.62} />);
  // ===== O · 67,15-72,1 · en el techo, levantando una teja; “and down in wet basements” =====
  if (t >= 67.6) {
    L.push(<AbsoluteFill key="s08"><Shot k="s08" t={t} a={67.15} /></AbsoluteFill>);
    L.push(<Words key="ws" t={t} />);
  }
  return <AbsoluteFill style={{ background: "#05070b" }}>{L}</AbsoluteFill>;
};

// “ROOFS ↓ WET BASEMENTS” sobre el techo
const Words: React.FC<{ t: number }> = ({ t }) => {
  const a = e(t, 68.7, 68.85), b = e(t, 69.84, 70.0), o = 1 - e(t, 71.6, 71.9);
  return (
    <div style={{ position: "absolute", left: 120, top: 620, opacity: o, fontFamily: FONT, fontWeight: 900, letterSpacing: 6, textShadow: extrude(8, "rgba(0,0,0,.6)") }}>
      <div style={{ fontSize: 96, color: COL.ink, opacity: a, transform: `translateX(${(1 - a) * -60}px)` }}>ROOFS</div>
      <div style={{ fontSize: 96, color: COL.ice, opacity: b, transform: `translateX(${(1 - b) * -60}px)` }}>↓ WET BASEMENTS</div>
    </div>
  );
};

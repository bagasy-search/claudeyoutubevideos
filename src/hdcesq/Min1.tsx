// hdcesq · MINUTO 1 + LA GUÍA (0-101,4 s). Un solo hilo, sin cortes secos:
// avatar → portal al patio de la vecina (el rosal) → la toma real del corte → el vaso en la ventana de la cocina →
// TIMELAPSE (día 3 se cae la flor, día 7 se dobla la punta) → avatar → toma real: la base negra → "SE PUDRIÓ" → "AGUA ✓" → "?" →
// avatar "NO ES SED · ES HONGO" → la cámara entra al vaso: las hifas → vuela a la maceta en corte: EL PORTAL ES LA TIERRA, la raíz crece →
// canela / miel / sábila en la mesa → grúa sobre el muro: el sauce del río (portal a la toma real) → avatar → rosa·bugambilia·romero →
// la repisa: 7 de 10 frascos se pudren → dron sobre el patio "CLAUDIO · 30 AÑOS" → avatar (manos en la tierra) →
// LA GUÍA en la mesa: tapa → (avatar) → se abre en la pág. 13 (ramitas/agua/horas) → pasa a la 15 → avatar + la descripción con el link → "vamos al rosal".
// Audio fuera de Remotion (la voz se mezcla en encfin). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, PT, screenOf, camSpeed, C1, JAR, ROT7, pageAt } from "./patio3d";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import CLIPS from "./clips.json";
import { BigNum, COL, Card3D, Flash, FONT, LowerThird, P, Portal, Tag, e, ei, extrude, s, spr } from "./lib";

export const MIN1_FRAMES = s(101.38);
const REEL = (AVAIL as { reel: boolean }).reel;
const WIN: { ms: number; me: number; off: number }[] = (AVW as { win: { ms: number; me: number; off: number }[] }).win;
// toma real: el mp4 LTX si ya llegó, si no la foto de la que sale (para los stills)
const CL = CLIPS as Record<string, boolean>;
const Clip: React.FC<{ k: string; at: number; t: number; z?: [number, number] }> = ({ k, at, t, z = [1.03, 1.1] }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, at, at + 6);
  const st: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };
  return <AbsoluteFill style={{ transform: `scale(${sc})`, background: "#000" }}>
    {CL[k] ? <Sequence from={s(at)} layout="none"><OffthreadVideo src={staticFile(P + k + ".mp4")} muted style={st} /></Sequence> : <Img src={staticFile(P + k + ".jpg")} style={st} />}
  </AbsoluteFill>;
};

export const Avatar: React.FC<{ t: number; blur?: number; dark?: number; edge?: number }> = ({ t, blur = 0, dark = 0, edge = 0 }) => {
  // +14 cuadros: la Sequence sigue viva durante la transición de salida (TR 0,38 s); antes se cortaba 2 cuadros después de la ventana → 3 cuadros NEGROS en cada salida del avatar
  // ventana visible: la que contiene t; si t cae fuera (fundido de ENTRADA que arranca antes de ms, o la salida), la vecina cuya Sequence sigue montada → nunca cuadro negro
  const cur = WIN.findIndex((w) => t >= w.ms - 0.02 && t < w.me);
  const vis = cur >= 0 ? cur : WIN.findIndex((w) => t >= w.ms - 0.32 && t < w.me + 0.8);
  const face = REEL ? <>{WIN.map((w, i) => (
    <Sequence key={i} from={s(w.ms) - 10} durationInFrames={s(w.me - w.ms) + 12 + 14} layout="none">
      <AbsoluteFill style={{ opacity: i === vis ? 1 : 0 }}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
    </Sequence>))}</> : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.015 * Math.sin(t * 0.7)})` }} />;
  // SIN desenfoque en el avatar (orden del creador 21-oct): ni blur, ni halo/máscara radial; borde nítido. blur/edge se ignoran.
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ filter: dark > 0 ? `brightness(${1 - dark})` : undefined }}>{face}</AbsoluteFill>
    </AbsoluteFill>
  );
};

export const World: React.FC<{ t: number }> = ({ t }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const id = "mb" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><WorldRaw t={t} /></AbsoluteFill>
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

// calendario de pared que pasa hojas: DÍA 3 → DÍA 7 → DÍA 14 (con la hoja que se arranca)
export const Calendar: React.FC<{ t: number; x: number; y: number; days: { at: number; d: number }[]; out: number; inAt: number }> = ({ t, x, y, days, out, inAt }) => {
  const o = e(t, inAt, inAt + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  let cur = days[0].d, prev = -1, k = 1;
  for (const d of days) if (t >= d.at) { prev = cur === d.d ? prev : cur; cur = d.d; k = e(t, d.at, d.at + 0.35); }
  const page = (n: number, extra: React.CSSProperties = {}) => (
    <div style={{ position: "absolute", inset: 0, borderRadius: 14, background: "linear-gradient(180deg,#fffaf0,#efe6d4)", boxShadow: "0 30px 60px rgba(0,0,0,.55)", overflow: "hidden", fontFamily: FONT, textAlign: "center", ...extra }}>
      <div style={{ background: "#c8402f", color: "#fff", fontWeight: 900, fontSize: 30, letterSpacing: 6, padding: "10px 0" }}>DÍA</div>
      <div style={{ fontWeight: 900, fontSize: 150, color: "#2b2620", lineHeight: "190px" }}>{n}</div>
    </div>
  );
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 260, height: 260, opacity: o, perspective: 1200, transform: `scale(${Math.min(1.08, spr(t, inAt))}) rotate(-3deg)` }}>
      {page(cur)}
      {prev > 0 && k < 1 && page(prev, { transformOrigin: "50% 0", transform: `rotateX(${k * 110}deg) translateY(${k * 40}px)`, opacity: 1 - k * 0.6 })}
    </div>
  );
};

// líneas de olor (florero viejo)
const Stink: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = e(t, at, at + 0.3) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o, filter: "drop-shadow(0 0 8px rgba(120,160,40,.7))" }}>
      {[-60, 0, 60].map((dx, i) => {
        const ph = (t - at) * 2 + i;
        const d = Array.from({ length: 12 }, (_, k) => `${k ? "L" : "M"}${x + dx + Math.sin(ph * 3 + k * 0.9) * 22},${y - k * 22 - ((t - at) * 60) % 40}`).join(" ");
        return <path key={i} d={d} fill="none" stroke="#a6c84a" strokeWidth={9} strokeLinecap="round" opacity={0.85} />;
      })}
    </svg>
  );
};

// tarjeta "descripción del video" que flota: el renglón 1 se ilumina y la flecha lo señala
export const Desc: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const k = spr(t, at, 0.8), o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.35));
  if (o <= 0.01) return null;
  const hl = e(t, at + 0.9, at + 1.4), sweep = e(t, at + 0.9, at + 1.9);
  const L = (w: number, op = 0.25) => <div style={{ height: 16, width: w, borderRadius: 8, background: `rgba(255,255,255,${op})`, margin: "18px 0 0" }} />;
  return (
    <div style={{ position: "absolute", left: 960, top: 640, perspective: 1500, opacity: o }}>
      <div style={{ transform: `translate(-50%,-50%) translateZ(${(1 - Math.min(1, k)) * -500}px) rotateX(${14 - 8 * Math.min(1, k)}deg) rotateY(${-8 + 4 * Math.sin(t * 0.8)}deg)`, width: 1240, padding: "30px 44px 36px", borderRadius: 26,
        background: "linear-gradient(180deg, rgba(28,30,34,.96), rgba(16,17,20,.96))", boxShadow: "0 70px 120px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.12)", fontFamily: FONT }}>
        <div style={{ color: "rgba(255,255,255,.55)", fontWeight: 800, fontSize: 24, letterSpacing: 4 }}>DESCRIPCIÓN</div>
        <div style={{ position: "relative", marginTop: 16, padding: "16px 20px", borderRadius: 14, background: `rgba(155,226,122,${0.16 * hl})`, boxShadow: hl > 0.05 ? `0 0 0 3px rgba(155,226,122,${0.9 * hl}), 0 0 40px rgba(155,226,122,${0.35 * hl})` : undefined, overflow: "hidden" }}>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 38, lineHeight: 1.25 }}>🌱 Mi guía Plantas Gratis para Siempre, paso por paso 👉 <span style={{ color: "#6fb4ff", textDecoration: "underline" }}>huertodeclaudio.vercel.app</span></div>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${-30 + 130 * sweep}%`, width: "25%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent)", opacity: sweep < 1 ? 1 : 0 }} />
        </div>
        {L(980)}{L(1040)}{L(760, 0.15)}
      </div>
      <div style={{ position: "absolute", left: -880, top: -160, opacity: hl, transform: `translateX(${-30 * (1 - hl) + 10 * Math.sin(t * 6)}px)`, fontFamily: FONT, fontWeight: 900, fontSize: 54, color: COL.leaf, textShadow: extrude(6, "#1d3a12"), whiteSpace: "nowrap" }}>1ª LÍNEA ➜</div>
    </div>
  );
};

// marcador que resalta un renglón de la página real (puntos 3D de la página proyectados)
const Hi: React.FC<{ t: number; at: number; out: number; a: { x: number; y: number }; b: { x: number; y: number }; h: number; col?: string }> = ({ t, at, out, a, b, h, col = "#ffd60a" }) => {
  const k = e(t, at, at + 0.35), o = 1 - e(t, out, out + 0.25);
  if (k <= 0.01 || o <= 0.01) return null;
  return <div style={{ position: "absolute", left: a.x, top: a.y - h / 2, width: Math.max(4, (b.x - a.x) * k), height: h, background: col, opacity: 0.4 * o, mixBlendMode: "multiply", borderRadius: 6 }} />;
};

// fichas de las tres plantas
const Chips: React.FC<{ t: number; items: { at: number; tx: string; col: string }[]; out: number; y?: number }> = ({ t, items, out, y = 820 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 34, perspective: 1200 }}>
    {items.map((it, i) => {
      const k = Math.min(1.1, spr(t, it.at)), o = e(t, it.at, it.at + 0.1) * (1 - e(t, out + i * 0.05, out + i * 0.05 + 0.25));
      return <div key={i} style={{ opacity: o, transform: `translateY(${(1 - Math.min(1, k)) * 120}px) rotateX(${(1 - Math.min(1, k)) * 70}deg) rotateY(${(i - 1) * -6}deg)`, padding: "16px 34px", borderRadius: 18,
        background: "linear-gradient(180deg, rgba(22,34,18,.95), rgba(12,18,10,.95))", boxShadow: `0 26px 50px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.18), 0 0 0 3px ${it.col}88`, fontFamily: FONT, fontWeight: 900, fontSize: 52, color: it.col, letterSpacing: 3, textShadow: extrude(5, "#000") }}>{it.tx}</div>;
    })}
  </div>
);

export const Min1: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];
  const W = (k: string, tt = t) => <World key={k} t={tt} />;

  // ===== A · 0-3,5 · avatar; "el patio de tu vecina": portal desde el centro al rosal =====
  if (t < 3.55) {
    L.push(<Avatar key="avA" t={t} />);
    const r = ei(t, 3.0, 3.52);
    if (r > 0) L.push(<Portal key="pA" x={1240} y={430} r={r}><World t={Math.max(3.0, t)} /></Portal>);
  }
  // ===== B · 3,5-7,6 · el rosal de la vecina; "te corta una con flor y todo" → toma real del corte =====
  if (t >= 3.5 && t < 7.65) {
    L.push(W("wB"));
    const rs = screenOf(t, PT.rose);
    L.push(<Tag key="tR" t={t} at={3.5} x={rs.x} y={rs.y} dx={220} dy={-140} text="EL ROSAL" sub="DE TU VECINA" col={COL.rose} out={5.1} size={50} />);
    const r = ei(t, 5.2, 5.7);
    if (r > 0) L.push(<Portal key="pC" x={rs.x} y={rs.y} r={r}><Clip k="m1_corte" at={5.2} t={t} /></Portal>);
    if (t > 5.7) L.push(<Tag key="cf" t={t} at={6.3} x={1010} y={420} dx={240} dy={-150} text="CON FLOR Y TODO" col={COL.rose} out={7.3} size={46} />);
  }
  // ===== C · 7,6-16,95 · "llegas a tu casa": el vaso en la ventana de la cocina; timelapse día 3 / día 7 =====
  if (t >= 7.6 && t < 16.95) {
    const sl = ei(t, 7.55, 7.95), mb = Math.sin(sl * Math.PI) * 36;
    L.push(<AbsoluteFill key="wC" style={{ transform: `translateX(${(1 - sl) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><World t={t} /></AbsoluteFill>);
    if (sl < 1) L.push(<AbsoluteFill key="cOut" style={{ transform: `translateX(${-sl * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Clip k="m1_corte" at={5.2} t={t} /></AbsoluteFill>);
    const v = screenOf(t, PT.vaso);
    L.push(<Tag key="vs" t={t} at={9.4} x={v.x} y={v.y} dx={-260} dy={-90} text="UN VASO CON AGUA" col={COL.ice} out={11.6} size={46} />);
    L.push(<Tag key="vn" t={t} at={10.3} x={v.x + 120} y={v.y - 260} dx={200} dy={-60} text="LA VENTANA" sub="DE LA COCINA" out={11.6} size={40} />);
    L.push(<Calendar key="cal" t={t} x={140} y={150} inAt={12.75} out={16.75} days={[{ at: 12.75, d: 1 }, { at: 13.0, d: 3 }, { at: 15.0, d: 7 }]} />);
    const tp = screenOf(t, PT.vasoTop);
    L.push(<Tag key="fl" t={t} at={14.18} x={tp.x} y={tp.y} dx={240} dy={-80} text="SE CAE LA FLOR" col={COL.rose} out={14.9} size={44} />);
    L.push(<Tag key="pu" t={t} at={16.3} x={tp.x} y={tp.y} dx={240} dy={-80} text="LA PUNTA SE DOBLA" col={COL.amber} out={16.8} size={44} />);
  }
  // ===== D · 16,9-20,45 · avatar "y a las dos semanas…" =====
  if (t >= 16.9 && t < 20.5) {
    const sl = ei(t, 20.1, 20.48), mb = Math.sin(sl * Math.PI) * 40;
    L.push(<AbsoluteFill key="avD" style={{ transform: `translateX(${-sl * 1920}px)` }}><Avatar t={t} /></AbsoluteFill>);
    L.push(<Calendar key="cal2" t={t} x={1520} y={150} inAt={17.94} out={20.0} days={[{ at: 17.94, d: 7 }, { at: 18.1, d: 14 }]} />);
    if (sl > 0) L.push(<AbsoluteFill key="podIn" style={{ transform: `translateX(${(1 - sl) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Clip k="m1_podrido" at={20.1} t={t} z={[1.02, 1.12]} /></AbsoluteFill>);
  }
  // ===== E · 20,45-24,7 · toma real: la rama sale del vaso, la base negra, blanda; "huele a florero viejo" =====
  if (t >= 20.45 && t < 24.75) {
    const z = ei(t, 24.3, 24.72);
    L.push(<AbsoluteFill key="pod" style={{ opacity: 1 - z, filter: z > 0.05 ? `blur(${z * 14}px)` : undefined }}>
      <Clip k="m1_podrido" at={20.1} t={t} z={[1.02, 1.12]} />
      <Tag t={t} at={21.16} x={880} y={760} dx={-300} dy={60} text="NEGRA" col={COL.red} out={24.2} size={56} />
      <Tag t={t} at={21.88} x={900} y={700} dx={300} dy={-120} text="BLANDA" col={COL.amber} out={24.2} size={56} />
      <Stink t={t} at={22.9} out={24.2} x={1180} y={640} />
    </AbsoluteFill>);
    if (z > 0) L.push(<AbsoluteFill key="wE" style={{ opacity: z }}><World t={t} /></AbsoluteFill>);
  }
  // ===== F · 24,7-30,85 · el vaso podrido; "SE PUDRIÓ"; "no le faltó nada de agua" AGUA ✓; "lo que nadie te dijo" ? =====
  if (t >= 24.7 && t < 30.9) {
    const z = ei(t, 30.45, 30.85);
    L.push(<AbsoluteFill key="wF" style={{ transformOrigin: "960px 540px", transform: `scale(${1 + z * z * 0.4})`, opacity: 1 - z * 0.9 }}><World t={t} /></AbsoluteFill>);
    L.push(<Stamp key="sp" t={t} at={24.84} text="SE PUDRIÓ" x={1340} y={300} out={26.8} rot={-8} />);
    const w = screenOf(t, PT.vaso);
    L.push(<Tag key="ag" t={t} at={27.58} x={w.x} y={w.y} dx={-280} dy={60} text="AGUA ✓" sub="NO LE FALTÓ" col={COL.ice} out={30.2} size={58} />);
    const qo = e(t, 29.5, 29.7) * (1 - e(t, 30.3, 30.5));
    if (qo > 0.01) L.push(<div key="q" style={{ position: "absolute", left: w.x + 260, top: w.y - 420, opacity: qo, transform: `scale(${Math.min(1.1, spr(t, 29.5))}) rotate(${8 * Math.sin(t * 3)}deg)`, fontFamily: FONT, fontWeight: 900, fontSize: 300, color: COL.amber, textShadow: extrude(14, "#5a3a00") }}>?</div>);
    if (z > 0) L.push(<AbsoluteFill key="avF" style={{ opacity: z }}><Avatar t={t} /></AbsoluteFill>);
  }
  // ===== G · 30,85-34,95 · avatar: "no se muere de SED, se muere de HONGO" =====
  if (t >= 30.85 && t < 35.0) {
    const z = ei(t, 34.55, 34.95);
    L.push(<AbsoluteFill key="avG" style={{ transformOrigin: "960px 600px", transform: `scale(${1 + z * z * 6})` }}><Avatar t={t} /></AbsoluteFill>);
    L.push(<Stamp key="ns" t={t} at={33.1} text="NO ES SED" x={560} y={820} out={34.4} rot={-6} size={86} col={COL.ice} />);
    L.push(<Stamp key="eh" t={t} at={34.2} text="ES HONGO" x={1360} y={820} out={34.5} rot={5} size={86} />);
    if (z > 0.35) L.push(<AbsoluteFill key="wG" style={{ opacity: (z - 0.35) / 0.65 }}><World t={34.95} /></AbsoluteFill>);
  }
  // ===== H · 34,95-38,35 · adentro del vaso: las hifas del hongo; "¿qué le echas…?" → vuela a la maceta en corte: la tierra =====
  if (t >= 34.95 && t < 38.4) {
    L.push(W("wH"));
    const b = screenOf(t, PT.base);
    L.push(<Tag key="hg" t={t} at={35.6} x={b.x} y={b.y} dx={260} dy={-200} text="HONGO" sub="ENTRA POR EL CORTE" col="#e6e2d6" out={36.9} size={60} />);
    const qo = e(t, 36.3, 36.5) * (1 - e(t, 37.9, 38.1));
    if (qo > 0.01) L.push(<div key="qq" style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", opacity: qo, fontFamily: FONT, fontWeight: 900, fontSize: 70, color: COL.ink, letterSpacing: 2, textShadow: extrude(6, "#000") }}>¿QUÉ LE ECHAS?</div>);
    const so = screenOf(t, PT.soil), r = ei(t, 37.9, 38.35);
    if (r > 0) L.push(<Portal key="pS" x={so.x} y={so.y} r={r} ring={0.6}><World t={Math.max(38.3, t)} /></Portal>);
  }
  // ===== I · 38,35-40,9 · la tierra en corte: la raíz crece en timelapse; "eche RAÍZ" =====
  if (t >= 38.35 && t < 41.0) {
    L.push(W("wI"));
    const r = screenOf(t, PT.roots);
    L.push(<Tag key="rz" t={t} at={39.1} x={r.x} y={r.y} dx={300} dy={-60} text="RAÍZ" col="#fff3d6" out={40.6} size={78} />);
  }
  // ===== J · 40,9-47,9 · canela, miel, sábila en la mesa; el sauce del río (portal a la toma real) =====
  if (t >= 40.9 && t < 47.95) {
    L.push(W("wJ"));
    const a = screenOf(t, PT.canela), b = screenOf(t, PT.miel), c = screenOf(t, PT.sabila);
    L.push(<BigNum key="3c" t={t} at={41.1} text="3" size={170} x={300} y={250} out={43.4} sub="DE TU COCINA" col={COL.ink} edge="#4a3a22" />);
    L.push(<Tag key="ca" t={t} at={41.4} x={a.x} y={a.y} dx={-80} dy={-230} text="CANELA" col="#e0a46a" out={43.4} size={46} />);
    L.push(<Tag key="mi" t={t} at={41.95} x={b.x} y={b.y} dx={170} dy={-150} text="MIEL" col="#ffc23d" out={43.4} size={46} />);
    L.push(<Tag key="sa" t={t} at={42.5} x={c.x} y={c.y} dx={-260} dy={60} text="SÁBILA" col={COL.leaf} out={43.4} size={46} />);
    const wl = screenOf(t, PT.willow);
    L.push(<Tag key="wi" t={t} at={44.6} x={wl.x} y={wl.y} dx={-320} dy={-80} text="SAUCE" sub="EN LA ORILLA DEL RÍO" col={COL.leaf} out={45.6} size={60} />);
    const r = ei(t, 45.4, 45.9);
    if (r > 0) L.push(<Portal key="pW" x={wl.x} y={wl.y} r={r}><Clip k="m1_sauce" at={45.4} t={t} /></Portal>);
    if (t > 45.9) L.push(<Tag key="cv" t={t} at={46.44} x={760} y={560} dx={260} dy={-200} text="CUÁL VA CON CADA PLANTA" col={COL.ink} out={47.6} size={44} />);
  }
  // ===== K · 47,9-52,0 · avatar: el corte que sí echa raíz; rosas… =====
  if (t >= 47.9 && t < 52.05) {
    const z = ei(t, 51.65, 52.0);
    L.push(<AbsoluteFill key="avK" style={{ transform: `scale(${1 - z * 0.3})`, opacity: 1 - z }}><Avatar t={t} /></AbsoluteFill>);
    L.push(<Stamp key="cr" t={t} at={48.9} text="EL CORTE QUE SÍ ECHA RAÍZ" x={960} y={850} out={50.4} rot={-3} size={64} col={COL.leaf} />);
    if (z > 0) L.push(<AbsoluteFill key="wK" style={{ opacity: z }}><World t={52.0} /></AbsoluteFill>);
  }
  // ===== L · 52,0-55,2 · el patio entero: ROSA · BUGAMBILIA · ROMERO "de una sola rama" =====
  if (t >= 52.0 && t < 55.25) {
    L.push(W("wL"));
    const rs = screenOf(t, PT.rosal), bg = screenOf(t, PT.buga), ro = screenOf(t, PT.romero);
    L.push(<Tag key="t1" t={t} at={52.0} x={rs.x} y={rs.y} dx={-150} dy={-160} text="ROSA" col={COL.rose} out={54.9} size={50} />);
    L.push(<Tag key="t2" t={t} at={52.15} x={bg.x} y={bg.y} dx={-120} dy={-150} text="BUGAMBILIA" col="#f04aa8" out={54.9} size={50} />);
    L.push(<Tag key="t3" t={t} at={53.04} x={ro.x} y={ro.y} dx={120} dy={-170} text="ROMERO" col="#b9a8ff" out={54.9} size={50} />);
    L.push(<Chips key="ch" t={t} items={[{ at: 53.62, tx: "DE UNA SOLA RAMA", col: COL.leaf }]} out={54.9} y={860} />);
  }
  // ===== M · 55,2-59,9 · la repisa: 7 de cada 10 se pudren "aunque los cuides perfecto" =====
  if (t >= 55.2 && t < 60.0) {
    const z = ei(t, 59.6, 60.0);
    L.push(<AbsoluteFill key="wM" style={{ filter: z > 0.05 ? `blur(${z * 10}px)` : undefined }}><World t={t} /></AbsoluteFill>);
    L.push(<BigNum key="7" t={t} at={56.7} text="7 DE 10" size={150} y={150} out={59.4} col={COL.red} edge="#4a0f0a" sub="ESQUEJES SE PUDREN" />);
    ROT7.forEach((i, n) => { const p = screenOf(t, JAR(i)); const o = e(t, 57.0 + n * 0.1, 57.15 + n * 0.1) * (1 - e(t, 59.3, 59.5));
      if (o > 0.01) L.push(<div key={"x" + i} style={{ position: "absolute", left: p.x - 34, top: p.y - 150, opacity: o, fontFamily: FONT, fontWeight: 900, fontSize: 70, color: COL.red, textShadow: extrude(4, "#300") }}>✕</div>); });
    L.push(<Stamp key="cp" t={t} at={58.7} text="AUNQUE LOS CUIDES PERFECTO" x={960} y={900} out={59.5} rot={-2} size={58} col={COL.amber} />);
    L.push(<Flash key="fl60" t={t} at={60.0} peak={0.35} />);
  }
  // ===== N · 60,0-62,85 · "Soy Claudio, 30 años de jardinero": dron sobre el patio =====
  if (t >= 59.95 && t < 62.85) {
    const sl = ei(t, 62.45, 62.83), mb = Math.sin(sl * Math.PI) * 40;
    L.push(<AbsoluteFill key="wN" style={{ transform: `translateX(${-sl * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><World t={t} /></AbsoluteFill>);
    if (sl > 0) L.push(<AbsoluteFill key="avNi" style={{ transform: `translateX(${(1 - sl) * 1920}px)` }}><Avatar t={t} /></AbsoluteFill>);
  }
  if (t >= 60.5 && t < 66) L.push(<LowerThird key="lt" t={t} at={60.55} out={65.4} name="CLAUDIO" l2="30 AÑOS DE JARDINERO" l2at={61.3} />);
  // ===== O · 62,8-68,3 · avatar: "todo lo que ves en mi patio salió de una rama" (las manos en la tierra al lado) =====
  if (t >= 62.8 && t < 68.35) {
    const z = ei(t, 67.9, 68.3);
    L.push(<AbsoluteFill key="avO" style={{ transformOrigin: "1500px 700px", transform: `scale(${1 + z * z * 7})` }}><Avatar t={t} /></AbsoluteFill>);
    const k = spr(t, 65.1, 0.9);
    L.push(<Card3D key="mn" id="img_m1_manos" x={1140} y={250} w={660} h={420} ry={(1 - Math.min(1, k)) * -70 - 12} rx={4} z={(1 - Math.min(1, k)) * -900} o={e(t, 65.1, 65.2) * (1 - e(t, 67.6, 67.85))} label="DE UNA RAMA QUE IBAN A TIRAR" labelCol={COL.leaf} />);
    if (z > 0.35) L.push(<AbsoluteFill key="wO" style={{ opacity: (z - 0.35) / 0.65 }}><World t={C1} /></AbsoluteFill>);
  }
  // ===== CTA1 · 68,3-77,95 · la mesa: LA GUÍA (tapa) =====
  if (t >= 68.3 && t < 77.95) {
    const z = ei(t, 77.55, 77.93);
    L.push(<AbsoluteFill key="wP" style={{ opacity: 1 - z }}><World t={t} /></AbsoluteFill>);
    const bk = screenOf(t, pageAt(0.5, 0.2));
    L.push(<Tag key="g1" t={t} at={74.28} x={bk.x} y={bk.y} dx={300} dy={-160} text="MI GUÍA" sub="PASO POR PASO" col={COL.leaf} out={75.2} size={56} />);
    L.push(<Tag key="g2" t={t} at={75.26} x={bk.x} y={bk.y} dx={300} dy={-160} text="LIBRO 3" sub="PLANTAS GRATIS PARA SIEMPRE" col="#ffd60a" out={77.5} size={56} />);
    if (z > 0) L.push(<AbsoluteFill key="avPi" style={{ opacity: z }}><Avatar t={t} /></AbsoluteFill>);
  }
  // ===== avatar 77,95-81,92 ("Plantas gratis para siempre. Si vas a la página 13") =====
  if (t >= 77.9 && t < 81.95) {
    const z = ei(t, 81.55, 81.92);
    L.push(<AbsoluteFill key="avQ" style={{ transformOrigin: "960px 760px", transform: `scale(${1 + z * z * 5})` }}><Avatar t={t} /></AbsoluteFill>);
    L.push(<BigNum key="p13a" t={t} at={81.06} text="PÁG. 13" size={130} x={1500} y={230} out={81.6} col="#ffd60a" edge="#5a4500" />);
    if (z > 0.35) L.push(<AbsoluteFill key="wQ" style={{ opacity: (z - 0.35) / 0.65 }}><World t={81.92} /></AbsoluteFill>);
  }
  // ===== CTA1 · 81,92-95,55 · la página 13 (agua de sauce: ramitas / agua / horas) → la 15 =====
  if (t >= 81.92 && t < 95.6) {
    L.push(W("wR"));
    const tt = screenOf(t, pageAt(0.33, 0.095));
    L.push(<Tag key="as" t={t} at={82.5} x={tt.x} y={tt.y} dx={-200} dy={-140} text="AGUA DE SAUCE" sub="EL ENRAIZANTE MÁS FUERTE" col={COL.leaf} out={86.2} size={50} />);
    const row = (u0: number, u1: number, v: number) => [screenOf(t, pageAt(u0, v)), screenOf(t, pageAt(u1, v))];
    const [r1a, r1b] = row(0.07, 0.38, 0.478), [r2a, r2b] = row(0.07, 0.36, 0.521), [r3a, r3b] = row(0.44, 0.9, 0.534);
    if (t < 91.6) {
      L.push(<Hi key="h1" t={t} at={88.36} out={91.3} a={r1a} b={r1b} h={30} />);
      L.push(<Hi key="h2" t={t} at={89.54} out={91.3} a={r2a} b={r2b} h={24} />);
      L.push(<Hi key="h3" t={t} at={90.54} out={91.3} a={r3a} b={r3b} h={24} />);
      L.push(<Tag key="q1" t={t} at={88.36} x={r1a.x} y={r1a.y} dx={-180} dy={-60} text="RAMITAS" col="#ffd60a" out={91.2} size={40} />);
      L.push(<Tag key="q2" t={t} at={89.54} x={r2a.x} y={r2a.y} dx={-180} dy={50} text="AGUA" col={COL.ice} out={91.2} size={40} />);
      L.push(<Tag key="q3" t={t} at={90.54} x={r3b.x} y={r3b.y} dx={170} dy={-60} text="HORAS" col={COL.amber} out={91.2} size={40} />);
    }
    L.push(<BigNum key="p15" t={t} at={91.82} text="PÁG. 15" size={120} x={1560} y={200} out={93.6} col="#ffd60a" edge="#5a4500" />);
    const [s1a, s1b] = row(0.44, 0.92, 0.455), [s2a, s2b] = row(0.44, 0.92, 0.515);
    L.push(<Hi key="s1" t={t} at={93.7} out={95.3} a={s1a} b={s1b} h={34} col="#8fd6ff" />);
    L.push(<Hi key="s2" t={t} at={94.9} out={95.3} a={s2a} b={s2b} h={34} col="#b8f08a" />);
    L.push(<Tag key="ea" t={t} at={94.18} x={s1b.x} y={s1b.y} dx={120} dy={-120} text="EN AGUA" col={COL.ice} out={95.3} size={44} />);
    L.push(<Tag key="et" t={t} at={95.22} x={s2b.x} y={s2b.y} dx={120} dy={60} text="EN TIERRA" col={COL.leaf} out={95.45} size={44} />);
    const z = ei(t, 95.2, 95.55);
    if (z > 0) L.push(<AbsoluteFill key="avRi" style={{ opacity: z }}><Avatar t={t} /></AbsoluteFill>);
  }
  // ===== 95,53-101,4 · avatar con la descripción flotando ("el link está en la primera línea"); "vamos al rosal" =====
  if (t >= 95.5) {
    const z = ei(t, 100.6, 101.3);
    L.push(<AbsoluteFill key="avS" style={{ transformOrigin: "700px 500px", transform: `scale(${1 + z * z * 6})` }}><Avatar t={t} /></AbsoluteFill>);
    L.push(<Desc key="desc" t={t} at={96.02} out={99.1} />);
    if (z > 0.35) L.push(<AbsoluteFill key="wS" style={{ opacity: (z - 0.35) / 0.65 }}><World t={t} /></AbsoluteFill>);
  }

  return <AbsoluteFill style={{ background: "#0b0d08" }}>{L}</AbsoluteFill>;
};

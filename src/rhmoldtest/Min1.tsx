// rhmoldtest · MINUTO 1 + LA GUÍA (0-82,7 s). Un solo hilo, sin cortes secos:
// avatar STOP → portal al baño 3D: la nube de esporas sale de la esquina y mancha toalla, extractor y techo → la cámara baja
// a la MANCHA NEGRA del cordón → toma real: cepillo en seco → portal al MICROSCOPIO: las cerdas pegan, las esporas vuelan
// → avatar (toallas · extractor · la semana que viene, el techo) → el hisopo real + la promesa (10 s · 1 cda · 1 taza)
// → 3D: el hisopo toca la esquina y la mancha ACLARA · MOHO / HONGO / MUGRE → avatar (el test · 5 errores)
// → microscopio: las RAÍCES bajan dentro de la silicona → el techo: el cuadrado de 10 pies² → Rhonda en el porche
// → avatar US$3.000 · ERA MUGRE → la clienta que lo ignoró → vuelo a la mesita del pasillo: LA GUÍA se abre en la pág. 23
// REAL (avatar en videollamada), se pintan los renglones, la descripción con el link → vuelve volando a la esquina.
// ⛔ Avatar SIN desenfoque (regla 21-oct): ni halo ni blur; sólo oscurecer. Audio fuera de Remotion. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, PT, screenOf, camSpeed, pagePt } from "./moho3d";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import { BigNum, COL, Flash, FONT, LowerThird, P, Portal, Tag, Vid, e, ei, extrude, s, spr } from "./lib";

export const MIN1_END = 82.72;
export const MIN1_FRAMES = s(MIN1_END + 0.7);
const REEL = (AVAIL as { reel: boolean }).reel; // reel del avatar (public/rhmoldtest/reel0.mp4, 1 /run de RunPod)
const LTX = new Set((AVAIL as { ltx: string[] }).ltx); // clips LTX bajados (public/rhmoldtest/ltx_<k>.mp4); si no, el cuadro clave
export const clip = (k: string) => (LTX.has(k) ? "ltx_" + k : "img_" + k);
export const WIN: { ms: number; me: number; off: number }[] = (AVW as { win: { ms: number; me: number; off: number }[] }).win;

// avatar NÍTIDO: sin blur, sin halo, sin máscara; borde limpio
export const Avatar: React.FC<{ t: number; dark?: number }> = ({ t, dark = 0 }) => {
  const face = REEL ? <>{WIN.map((w, i) => (
    <Sequence key={i} from={Math.max(0, s(w.ms) - 10)} durationInFrames={s(w.me - w.ms) + 12} layout="none">
      <AbsoluteFill style={{ opacity: t >= w.ms - 0.02 && t < w.me ? 1 : 0 }}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
    </Sequence>))}</> : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.015 * Math.sin(t * 0.7)})` }} />;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ filter: dark > 0 ? `brightness(${1 - dark})` : undefined }}>{face}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// el mundo con desenfoque de movimiento según la velocidad de la cámara (sólo el 3D, nunca el avatar)
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

// toma real (LTX o cuadro clave) con empuje lento propio por plano
export const Shot: React.FC<{ k: string; t: number; a: number; z?: [number, number]; ox?: number; oy?: number; dur?: number }> = ({ k, t, a, z = [1.03, 1.12], ox = 0, oy = 0, dur = 8 }) => {
  const q = e(t, a, a + dur), sc = z[0] + (z[1] - z[0]) * q;
  const id = clip(k);
  return <AbsoluteFill style={{ transform: `scale(${sc}) translate(${ox * q}px, ${oy * q}px)` }}><Vid id={id} at={id.startsWith("ltx_") ? a : undefined} /></AbsoluteFill>;
};
// barrido lateral entre dos capas (dir 1 = la nueva entra por la derecha); el desenfoque de barrido sólo en tomas, no en el avatar
export const Swipe: React.FC<{ t: number; a: number; b: number; from: React.ReactNode; to: React.ReactNode; dir?: number; vert?: boolean; mbFrom?: boolean; mbTo?: boolean }> = ({ t, a, b, from, to, dir = 1, vert, mbFrom = true, mbTo = true }) => {
  const k = ei(t, a, b), mb = Math.sin(k * Math.PI) * 30, ax = vert ? "Y" : "X", D = vert ? 1080 : 1920;
  return (
    <AbsoluteFill>
      {k < 1 && <AbsoluteFill style={{ transform: `translate${ax}(${-dir * k * D}px)`, filter: mbFrom && mb > 1 ? `blur(${mb}px)` : undefined }}>{from}</AbsoluteFill>}
      {k > 0 && <AbsoluteFill style={{ transform: `translate${ax}(${dir * (1 - k) * D}px)`, filter: mbTo && mb > 1 ? `blur(${mb}px)` : undefined }}>{to}</AbsoluteFill>}
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

// cartel octogonal de PARE que cae con resorte
const StopSign: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const k = Math.min(1.12, spr(t, at, 1.2)), o = e(t, at, at + 0.05) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const pts = Array.from({ length: 8 }, (_, i) => { const a = Math.PI / 8 + i * Math.PI / 4; return `${150 + 140 * Math.cos(a)},${150 + 140 * Math.sin(a)}`; }).join(" ");
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1000, transform: `translate(-50%,-50%) scale(${0.3 + 0.7 * k})` }}>
      <svg width={300} height={300} style={{ transform: `rotateY(${-16 + 5 * Math.sin(t * 1.4)}deg) rotateZ(${(1 - Math.min(1, k)) * -30}deg)`, filter: "drop-shadow(0 30px 40px rgba(0,0,0,.6))" }}>
        <polygon points={pts} fill="#d7261e" stroke="#fff" strokeWidth={12} />
        <text x={150} y={176} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={88} fill="#fff">STOP</text>
      </svg>
    </div>
  );
};

// ocular de microscopio: aro con el aumento que sube 1× → 400×
export const Mag: React.FC<{ t: number; at: number; out: number; to?: number; top?: number }> = ({ t, at, out, to = 400, top = 60 }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const n = Math.round(1 + (to - 1) * ei(t, at, at + 1.2));
  return (
    <div style={{ position: "absolute", left: 70, top, opacity: o, display: "flex", alignItems: "center", gap: 18, fontFamily: FONT }}>
      <svg width={92} height={92}><circle cx={46} cy={46} r={36} fill="none" stroke={COL.ice} strokeWidth={8} /><circle cx={46} cy={46} r={22} fill="rgba(143,214,255,.25)" />
        <line x1={46} y1={4} x2={46} y2={22} stroke={COL.ice} strokeWidth={5} /><line x1={46} y1={70} x2={46} y2={88} stroke={COL.ice} strokeWidth={5} /></svg>
      <div><div style={{ fontWeight: 900, fontSize: 64, color: COL.ink, lineHeight: 1, textShadow: extrude(6, "#0a2a40") }}>×{n}</div>
        <div style={{ fontWeight: 800, fontSize: 24, letterSpacing: 5, color: COL.ice }}>UNDER THE MICROSCOPE</div></div>
    </div>
  );
};

// la lista de "a dónde va": fichas en perspectiva con su ícono; la última se pone roja
export const Spread: React.FC<{ t: number; items: { at: number; tx: string; ic: string; hot?: boolean }[]; out: number }> = ({ t, items, out }) => (
  <div style={{ position: "absolute", right: 90, top: 200, perspective: 1300 }}>
    {items.map((it, i) => {
      const k = Math.min(1.1, spr(t, it.at)), o = e(t, it.at, it.at + 0.1) * (1 - e(t, out + i * 0.05, out + i * 0.05 + 0.25));
      if (o <= 0.01) return null;
      return (
        <div key={i} style={{ opacity: o, display: "flex", alignItems: "center", gap: 22, margin: "0 0 24px", padding: "16px 34px 16px 20px", borderRadius: 20,
          transform: `translateX(${(1 - Math.min(1, k)) * 260}px) rotateY(${(1 - Math.min(1, k)) * -60 - 14}deg) rotateZ(${(i - 1) * 1.3}deg)`,
          background: it.hot ? "linear-gradient(180deg,#7a1f1a,#4a100d)" : "linear-gradient(180deg, rgba(250,248,242,.97), rgba(226,222,212,.97))", boxShadow: "0 30px 60px rgba(0,0,0,.55)", fontFamily: FONT }}>
          <div style={{ fontSize: 60, width: 80, textAlign: "center" }}>{it.ic}</div>
          <div style={{ fontWeight: 900, fontSize: 50, color: it.hot ? "#fff" : "#1d2733", letterSpacing: 1 }}>{it.tx}</div>
        </div>
      );
    })}
  </div>
);

// LA PROMESA: nota adhesiva con los tres datos que se escriben con la voz + el cronómetro de 10 s
const Promise3: React.FC<{ t: number; rows: { at: number; big: string; sm: string }[]; at: number; out: number }> = ({ t, rows, at, out }) => {
  const k = Math.min(1.1, spr(t, at, 0.9)), o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 70, top: 110, perspective: 1400, opacity: o }}>
      <div style={{ width: 700, padding: "40px 40px 30px", transformOrigin: "50% 0", transform: `rotateX(${(1 - Math.min(1, k)) * 70}deg) rotateY(12deg) rotateZ(-2.5deg)`, borderRadius: 6,
        background: "linear-gradient(180deg,#fff27a,#f7dc4a)", boxShadow: "0 50px 90px rgba(0,0,0,.6)", fontFamily: "'Segoe Print','Comic Sans MS',cursive" }}>
        <div style={{ position: "absolute", left: 210, top: -18, width: 140, height: 36, background: "rgba(255,255,255,.55)", transform: "rotate(-3deg)" }} />
        {rows.map((r, i) => { const w = e(t, r.at, r.at + 0.4); return (
          <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 18, margin: "8px 0 14px", clipPath: `inset(0 ${100 - 100 * w}% 0 0)` }}>
            <span style={{ fontSize: 76, fontWeight: 900, color: "#2a2410", lineHeight: 1, whiteSpace: "nowrap" }}>{r.big}</span><span style={{ fontSize: 40, fontWeight: 700, color: "#5a4b12", whiteSpace: "nowrap" }}>{r.sm}</span>
          </div>); })}
      </div>
    </div>
  );
};

// fichas que nacen cada una con SU frase
export const ChipsAt: React.FC<{ t: number; items: { at: number; tx: string; c?: string }[]; out: number; y?: number; num?: boolean }> = ({ t, items, out, y = 790, num = true }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 34, perspective: 1200 }}>
    {items.map((it, i) => {
      const k = Math.min(1.1, spr(t, it.at)), o = e(t, it.at, it.at + 0.1) * (1 - e(t, out, out + 0.3));
      return (
        <div key={i} style={{ opacity: o, transform: `translateY(${(1 - Math.min(1, k)) * 140}px) rotateX(${(1 - Math.min(1, k)) * 70}deg)`, width: 420, padding: "16px 0 14px", borderRadius: 18,
          background: "linear-gradient(180deg, rgba(20,32,52,.95), rgba(10,16,28,.95))", boxShadow: `0 26px 50px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.18), 0 0 0 3px ${(it.c ?? COL.ice)}88`, textAlign: "center", fontFamily: FONT }}>
          {num && <div style={{ fontWeight: 900, fontSize: 64, color: it.c ?? COL.ice, lineHeight: 1, textShadow: extrude(6, "#0a2a40") }}>{i + 1}</div>}
          <div style={{ fontWeight: 900, fontSize: num ? 34 : 54, color: num ? COL.ink : it.c ?? COL.ink, letterSpacing: 3, marginTop: num ? 6 : 0 }}>{it.tx}</div>
        </div>
      );
    })}
  </div>
);

// el avatar en "videollamada": marco de celular apaisado flotando junto a la guía (nítido)
export const VideoCall: React.FC<{ t: number; at: number; out: number; x: number; y: number; w: number }> = ({ t, at, out, x, y, w }) => {
  const k = Math.min(1.1, spr(t, at, 0.8)), o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3)), h = w * 9 / 16;
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, perspective: 1600, opacity: o }}>
      <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transform: `translateZ(${(1 - Math.min(1, k)) * -700}px) rotateY(${14 + (1 - Math.min(1, k)) * 40}deg) rotateX(3deg)`, borderRadius: 34, padding: 14, background: "linear-gradient(160deg,#2b2e33,#0c0d0f)", boxShadow: "0 60px 110px rgba(0,0,0,.7), inset 0 0 0 3px #4a4d52" }}>
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 24, overflow: "hidden" }}>
          <Avatar t={t} />
          <div style={{ position: "absolute", left: 18, top: 16, padding: "6px 14px", borderRadius: 20, background: "rgba(0,0,0,.55)", fontFamily: FONT, fontWeight: 800, fontSize: 22, color: "#fff", display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ width: 12, height: 12, borderRadius: 6, background: "#ff3b30", opacity: Math.sin(t * 5) > 0 ? 1 : 0.3 }} /> RHONDA · LIVE</div>
        </div>
      </div>
    </div>
  );
};

// tarjeta "descripción del video": el renglón 1 (el link) se ilumina y la flecha lo señala
export const Desc: React.FC<{ t: number; at: number; out: number; top?: number }> = ({ t, at, out, top = 470 }) => {
  const k = spr(t, at, 0.8), o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.35));
  if (o <= 0.01) return null;
  const hl = e(t, at + 0.4, at + 0.9), sweep = e(t, at + 0.4, at + 1.4);
  const L = (w: number, op = 0.25) => <div style={{ height: 16, width: w, borderRadius: 8, background: `rgba(255,255,255,${op})`, margin: "18px 0 0" }} />;
  return (
    <div style={{ position: "absolute", left: 1010, top, perspective: 1500, opacity: o }}>
      <div style={{ transform: `translate(-50%,-50%) translateZ(${(1 - Math.min(1, k)) * -500}px) rotateX(${14 - 8 * Math.min(1, k)}deg) rotateY(${-10 + 4 * Math.sin(t * 0.8)}deg)`, width: 1240, padding: "34px 44px 40px", borderRadius: 26,
        background: "linear-gradient(180deg, rgba(28,30,34,.96), rgba(16,17,20,.96))", boxShadow: "0 70px 120px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.12)", fontFamily: FONT }}>
        <div style={{ color: "rgba(255,255,255,.55)", fontWeight: 800, fontSize: 24, letterSpacing: 4 }}>DESCRIPTION</div>
        <div style={{ position: "relative", marginTop: 16, padding: "16px 20px", borderRadius: 14, background: `rgba(255,214,10,${0.18 * hl})`, boxShadow: hl > 0.05 ? `0 0 0 3px rgba(255,214,10,${0.9 * hl}), 0 0 40px rgba(255,214,10,${0.35 * hl})` : undefined, overflow: "hidden" }}>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 36, lineHeight: 1.3 }}>🟤 The mold test with the exact amounts 👉 <span style={{ color: "#6fb4ff", textDecoration: "underline" }}>https://rhondas-brown-bottle-book.vercel.app/</span></div>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${-30 + 130 * sweep}%`, width: "25%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent)", opacity: sweep < 1 ? 1 : 0 }} />
        </div>
        {L(980)}{L(1040)}{L(760)}{L(900, 0.15)}
      </div>
      <div style={{ position: "absolute", left: -950, top: -120, opacity: hl, transform: `translateX(${-30 * (1 - hl) + 10 * Math.sin(t * 6)}px)`, fontFamily: FONT, fontWeight: 900, fontSize: 54, color: "#ffd60a", textShadow: extrude(6, "#5a4500"), whiteSpace: "nowrap" }}>1ST LINE ➜</div>
    </div>
  );
};

export const Min1: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];

  // ===== A · 0-3,5 · avatar: STOP. Put the brush down. → portal al baño 3D desde abajo a la derecha =====
  if (t < 3.65) {
    L.push(<Avatar key="avA" t={t} dark={0.25 * e(t, 2.9, 3.4)} />);
    L.push(<StopSign key="stp" t={t} at={0.02} out={2.6} x={1530} y={330} />);
    L.push(<BigNum key="pbd" t={t} at={0.84} text="PUT THE BRUSH DOWN" size={92} y={900} out={2.75} />);
    const r = ei(t, 3.0, 3.6);
    if (r > 0) L.push(<Portal key="pA" x={1400} y={720} r={r}><World t={Math.max(3.0, t)} /></Portal>);
  }
  // ===== B/C · 3,5-8,8 · la nube de esporas recorre el baño; la cámara baja a la mancha negra de la esquina =====
  if (t >= 3.6 && t < 8.95) {
    L.push(<World key="wB" t={t} />);
    const tw = screenOf(t, PT.towel), vt = screenOf(t, PT.vent), cl = screenOf(t, PT.ceil), co = screenOf(t, PT.corner);
    L.push(<BigNum key="all" t={t} at={3.94} text="ALL OVER YOUR BATHROOM" size={74} y={110} out={5.7} />);
    L.push(<Tag key="tw" t={t} at={4.3} x={tw.x} y={tw.y} dx={200} dy={-60} text="TOWEL" out={5.8} size={40} />);
    L.push(<Tag key="vt" t={t} at={4.6} x={vt.x} y={vt.y} dx={220} dy={60} text="FAN" out={5.8} size={40} />);
    L.push(<Tag key="cl" t={t} at={4.9} x={cl.x} y={cl.y} dx={-220} dy={80} text="CEILING" out={5.8} size={40} />);
    L.push(<Tag key="bs" t={t} at={6.3} x={co.x} y={co.y} dx={-320} dy={-200} text="BLACK SPOT" sub="SHOWER CORNER" col={COL.amber} out={8.8} size={56} />);
  }
  // ===== D · 8,8-12,1 · toma real: el cepillo en seco, fuerte =====
  if (t >= 8.6 && t < 12.4) {
    L.push(<Swipe key="swD" t={t} a={8.6} b={8.95} vert dir={1} from={<World t={Math.min(t, 8.8)} />} to={<Shot k="h_scrub" t={t} a={8.6} z={[1.04, 1.14]} dur={4} />} />);
    L.push(<Tag key="dry" t={t} at={9.0} x={860} y={600} dx={-300} dy={-200} text="DRY BRUSH" col={COL.ice} out={12.0} size={54} />);
    L.push(<Stamp key="hard" t={t} at={10.94} text="SCRUB HARD" x={1380} y={250} out={12.0} rot={-8} size={96} />);
    const r = ei(t, 11.9, 12.35);
    if (r > 0) L.push(<Portal key="pD" x={900} y={560} r={r}><World t={Math.max(t, 12.0)} /></Portal>);
  }
  // ===== E · 12,1-17,0 · MICROSCOPIO: cada pasada sacude miles de esporas al aire =====
  if (t >= 12.35 && t < 17.25) {
    L.push(<World key="wE" t={t} />);
    L.push(<Mag key="mg" t={t} at={12.4} out={16.8} />);
    const sp = screenOf(t, PT.spore);
    L.push(<Tag key="fl" t={t} at={12.8} x={sp.x} y={sp.y} dx={-260} dy={-170} text="EVERY STROKE FLICKS" col={COL.ice} out={14.3} size={44} />);
    L.push(<BigNum key="th" t={t} at={13.22} text="THOUSANDS" sub="OF TINY SPORES" size={150} y={820} out={15.3} />);
    L.push(<Tag key="air" t={t} at={15.42} x={1250} y={330} dx={-260} dy={-120} text="INTO THE AIR YOU BREATHE" col={COL.amber} out={16.9} size={48} />);
  }
  // ===== F · 17,0-22,9 · avatar: las toallas, el extractor… y la semana que viene, el techo =====
  if (t >= 16.95 && t < 23.3) {
    L.push(<Swipe key="swF" t={t} a={16.95} b={17.25} dir={-1} mbTo={false} from={<World t={Math.min(t, 17.0)} />} to={
      <Swipe t={t} a={22.9} b={23.25} mbFrom={false} from={<Avatar t={t} />} to={<Shot k="h_swab" t={t} a={22.9} z={[1.03, 1.12]} dur={5} />} />} />);
  }
  if (t >= 17.4 && t < 23.2) L.push(<Spread key="spr" t={t} out={22.7} items={[{ at: 17.62, tx: "YOUR TOWELS", ic: "🧺" }, { at: 18.7, tx: "THE FAN VENT", ic: "🌀" }, { at: 19.6, tx: "NEXT WEEK…", ic: "📅" }, { at: 20.98, tx: "THE CEILING", ic: "⬛", hot: true }]} />);
  // ===== G · 22,9-27,5 · el hisopo real + la promesa =====
  if (t >= 23.25 && t < 27.85) {
    const k = ei(t, 27.45, 27.85);
    L.push(<AbsoluteFill key="gS" style={{ opacity: 1 - k }}><Shot k="h_swab" t={t} a={22.9} z={[1.03, 1.12]} dur={5} /></AbsoluteFill>);
    if (k > 0) L.push(<AbsoluteFill key="gW" style={{ opacity: k }}><World t={t} /></AbsoluteFill>);
  }
  if (t >= 22.95 && t < 28.0) L.push(<Promise3 key="pr" t={t} at={23.0} out={27.6} rows={[{ at: 23.02, big: "10 SEC", sm: "a cotton swab" }, { at: 25.34, big: "1 TBSP", sm: "bleach" }, { at: 26.82, big: "1 CUP", sm: "water" }]} />);
  // ===== H · 27,5-34,6 · 3D: el hisopo toca la esquina, la mancha ACLARA · moho / hongo / mugre =====
  if (t >= 27.85 && t < 34.95) {
    L.push(<Swipe key="swH" t={t} a={34.6} b={34.95} mbTo={false} from={<World t={t} />} to={<Avatar t={t} />} />);
    const d = screenOf(t, PT.dab);
    L.push(<Tag key="lt" t={t} at={29.0} x={d.x} y={d.y} dx={-300} dy={-190} text="IT GOT LIGHTER" col="#9fffb0" out={33.6} size={50} />);
  }
  if (t >= 29.6 && t < 34.4) L.push(<ChipsAt key="3a" t={t} out={34.1} y={800} num={false} items={[{ at: 29.84, tx: "MOLD", c: "#ff8a7a" }, { at: 30.54, tx: "MILDEW", c: "#ffd66b" }, { at: 31.96, tx: "JUST DIRT", c: "#c9b08a" }]} />);
  if (t >= 32.8 && t < 34.5) L.push(<Tag key="nt" t={t} at={32.94} x={960} y={420} dx={0} dy={-200} text="BEFORE YOU TOUCH IT" col={COL.amber} out={34.2} size={50} />);
  // ===== I · 34,9-39,0 · avatar: el test · los 5 errores que lo desparraman =====
  if (t >= 34.95 && t < 39.5) {
    const r = ei(t, 39.0, 39.45);
    L.push(<Avatar key="avI" t={t} />);
    if (r > 0) L.push(<Portal key="pI" x={960} y={600} r={r}><World t={Math.max(t, 39.0)} /></Portal>);
  }
  if (t >= 35.8 && t < 39.4) L.push(<ChipsAt key="ch" t={t} out={39.0} items={[{ at: 35.98, tx: "THE 10-SEC TEST" }, { at: 36.98, tx: "5 MISTAKES" }, { at: 38.06, tx: "THAT SPREAD IT" }]} />);
  // ===== J · 39,0-41,8 · MICROSCOPIO: las raíces bajan dentro de la silicona =====
  if (t >= 39.45 && t < 41.85) {
    L.push(<World key="wJ" t={t} />);
    L.push(<Mag key="mg2" t={t} at={39.5} out={41.6} to={600} />);
    const rt = screenOf(t, PT.roots);
    L.push(<Tag key="ro" t={t} at={40.0} x={rt.x} y={rt.y} dx={300} dy={150} text="ROOTS" sub="DEEP IN THE CAULK" col="#9cff8a" out={41.7} size={58} />);
  }
  // ===== K · 41,8-45,0 · el techo: el cuadrado de 10 pies² · la botella abajo · el teléfono =====
  if (t >= 41.6 && t < 45.3) {
    const r = ei(t, 41.6, 41.95);
    if (t < 41.95) L.push(<World key="wK0" t={41.6} />);
    L.push(<Portal key="pK" x={960} y={540} r={r} ring={0.5}><World t={Math.max(t, 41.85)} /></Portal>);
    L.push(<Flash key="fK" t={t} at={41.82} peak={0.35} />);
    L.push(<BigNum key="sq" t={t} at={42.0} text="10 SQ FT" sub="THE SIZE THAT MATTERS" size={150} y={820} col="#ffd60a" edge="#5a4500" out={44.0} />);
    L.push(<Tag key="bt" t={t} at={42.94} x={600} y={420} dx={-200} dy={-140} text="BOTTLE DOWN" col={COL.ink} out={45.0} size={46} />);
    L.push(<Tag key="ph" t={t} at={44.22} x={1300} y={420} dx={200} dy={-140} text="📞 PICK UP THE PHONE" col={COL.red} out={45.0} size={46} />);
  }
  // ===== L · 45,0-49,3 · Rhonda en el porche (rótulo) =====
  if (t >= 45.0 && t < 49.6) {
    L.push(<Swipe key="swL" t={t} a={45.0} b={45.3} from={<World t={Math.min(t, 45.0)} />} to={
      <Swipe t={t} a={49.25} b={49.6} mbTo={false} from={<Shot k="c_porch" t={t} a={45.0} z={[1.03, 1.12]} dur={5} />} to={<Avatar t={t} />} />} />);
    L.push(<LowerThird key="lt" t={t} at={45.32} out={49.0} name="RHONDA" l2="34 YEARS CLEANING HOUSES · OHIO" l2at={47.8} />);
  }
  // ===== M · 49,3-54,1 · avatar: US$3.000 por una mancha… que era mugre =====
  if (t >= 49.6 && t < 54.5) {
    L.push(<Swipe key="swM" t={t} a={54.1} b={54.45} mbFrom={false} from={<Avatar t={t} />} to={<Shot k="c_ignored" t={t} a={54.1} z={[1.02, 1.1]} dur={4} />} />);
  }
  if (t >= 50.5 && t < 54.3) {
    L.push(<BigNum key="3k" t={t} at={50.72} text="$3,000" sub="MOLD REMEDIATION QUOTE" size={150} x={430} y={300} col="#ff8a7a" edge="#4a100d" out={54.0} />);
    L.push(<Stamp key="dirt" t={t} at={53.1} text="IT WAS DIRT" x={430} y={620} out={54.0} rot={-10} size={84} />);
  }
  // ===== N · 54,1-57,0 · la que lo ignoró años → vuelo a la mesita del pasillo =====
  if (t >= 54.45 && t < 59.5) {
    const r = ei(t, 56.95, 57.35);
    if (r < 1) L.push(<Shot key="nS" k="c_ignored" t={t} a={54.1} z={[1.02, 1.1]} dur={4} />);
    L.push(<Tag key="ig" t={t} at={54.86} x={960} y={520} dx={-260} dy={-220} text="IGNORED IT FOR YEARS" col={COL.amber} out={56.9} size={50} />);
    if (r > 0) L.push(<Portal key="pN" x={960} y={540} r={r}><World t={Math.max(t, 57.0)} /></Portal>);
    L.push(<BigNum key="fo" t={t} at={57.6} text="FIND OUT WHICH ONE" size={86} y={130} out={59.2} />);
  }
  // ===== CTA1 · 59,4-82,7 · LA GUÍA se abre en la pág. 23 REAL =====
  if (t >= 59.5 && t < MIN1_END) {
    L.push(<World key="wC" t={t} />);
    const bk = screenOf(t, [PT.book[0], PT.book[1] + 0.04, PT.book[2]]);
    L.push(<Tag key="wr" t={t} at={60.18} x={bk.x} y={bk.y} dx={-320} dy={-200} text="I WROTE IT DOWN" col="#ffd08a" out={63.2} size={50} />);
    L.push(<BigNum key="p23" t={t} at={64.36} text="PAGE 23" size={120} x={1560} y={150} out={67.4} col="#ffd60a" edge="#5a4500" />);
    L.push(<Tag key="bb" t={t} at={66.42} x={bk.x - 200} y={bk.y} dx={-260} dy={-200} text="RHONDA'S BROWN BOTTLE BOOK" col="#ffd08a" out={67.8} size={44} />);
    L.push(<VideoCall key="vc" t={t} at={67.7} out={71.6} x={70} y={250} w={720} />);
    const sw = screenOf(t, pagePt(0.135, 0.61)), mx = screenOf(t, pagePt(0.6, 0.507)), mn = screenOf(t, pagePt(0.4, 0.546)), st = screenOf(t, pagePt(0.37, 0.733));
    L.push(<Tag key="sw" t={t} at={71.72} x={sw.x} y={sw.y} dx={-60} dy={170} text="THE SWAB" col="#9fd0ff" out={75.9} size={40} />);
    L.push(<Tag key="mx" t={t} at={72.6} x={mx.x} y={mx.y} dx={280} dy={-150} text="1 TBSP : 1 CUP" col="#ffd60a" out={75.9} size={40} />);
    L.push(<Tag key="mn" t={t} at={73.2} x={mn.x} y={mn.y} dx={300} dy={40} text="1-2 MINUTES" col="#ff9f43" out={75.9} size={40} />);
    L.push(<Tag key="ea" t={t} at={74.7} x={st.x} y={st.y} dx={280} dy={120} text="WHAT EACH ANSWER MEANS" col="#9fffb0" out={75.9} size={40} />);
    L.push(<Desc key="desc" t={t} at={76.06} out={78.9} />);
    L.push(<BigNum key="tn" t={t} at={79.02} text="LET'S DO IT TONIGHT" size={90} y={140} out={82.4} />);
  }
  // ===== cola · 82,7 · vuelve el avatar (sigue en el resto) =====
  if (t >= MIN1_END) L.push(<Avatar key="avZ" t={t} />);

  return <AbsoluteFill style={{ background: "#0b0e13" }}>{L}</AbsoluteFill>;
};
void Img;

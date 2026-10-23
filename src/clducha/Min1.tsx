// clducha · MINUTO 1 + LA GUÍA (0-107,9 s). Un solo hilo, sin cortes secos:
// avatar "usted está en la ducha… baja la vista" → la LINTERNA de noche barre las juntas (LTX) → el mundo 3D de noche: la cámara
// baja a la junta de abajo mientras se pone negra ("no grises · como con lápiz") → avatar (cloro, 2 días) → de día: OTRA VEZ, a la
// altura de los pies → la cámara vuela a LA JUNTA EN CORTE (la ciudad) → avatar ENCIMA✗/ADENTRO✓ → el moho adentro: el cloro NUNCA LLEGA
// → Claudio con el carrito (rótulo) · 23:00 · hab. 214 → el huésped → avatar «está sucia» → la linterna: recién lavada, pero NEGRAS
// → la ciudad con las raíces encendidas → avatar "tres cosas" (fichas) → 1 el cloro blanquea arriba y vuelve → 2 la pasta, la pasada
// de plata → avatar UNA SOLA PASADA → 3 el cepillo de alambre ✗ → CTA: vuela al carrito, LA GUÍA se abre en la pág. 19 REAL
// (avatar en videollamada), receta / tiempo / "si no sale", la descripción con el link → vuelve volando a la ducha.
// Audio fuera de Remotion (voz + sonido real de los clips se mezclan en encfin). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Freeze, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, PT, pagePt } from "./ducha3d";
import { screenOf, camSpeed } from "./camara";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import { BigNum, COL, Card3D, DrawX, Flash, FONT, LowerThird, P, Portal, Tag, Vid, e, ei, extrude, s, spr } from "./lib";

export const MIN1_END = 107.88;
export const MIN1_FRAMES = s(MIN1_END + 0.7);
const REEL = (AVAIL as { reel: boolean }).reel; // reel del avatar (public/clducha/reel0.mp4, 1 /run de RunPod)
const LTX = new Set((AVAIL as { ltx: string[] }).ltx); // clips LTX ya bajados (public/clducha/ltx_<k>.mp4); si no, el cuadro clave
export const clip = (k: string) => (LTX.has(k) ? "ltx_" + k : "img_" + k);
const REEL_LEN = 274.6; // reel0.wav dura 274,8 s: la última ventana pide más → se congela el último cuadro (si no, NEGRO al final)
export const WIN: { ms: number; me: number; off: number }[] = (AVW as { win: { ms: number; me: number; off: number }[] }).win;

export const Avatar: React.FC<{ t: number; blur?: number; dark?: number }> = ({ t, blur = 0, dark = 0 }) => {
  // +14 cuadros: la Sequence sigue viva durante la transición de salida (antes se desmontaba 2 cuadros después de la ventana → cuadros NEGROS en cada salida)
  // ventana visible: la que contiene t; si t cae fuera (fundido de entrada o salida), la vecina cuya Sequence sigue montada → nunca cuadro negro
  const cur = WIN.findIndex((w) => t >= w.ms - 0.02 && t < w.me);
  const vis = cur >= 0 ? cur : WIN.findIndex((w) => t >= w.ms - 0.32 && t < w.me + 0.8);
  const face = REEL ? <>{WIN.map((w, i) => (
    <Sequence key={i} from={Math.max(0, s(w.ms) - 10)} durationInFrames={s(w.me - w.ms) + 12 + 14} layout="none">
      <AbsoluteFill style={{ opacity: i === vis ? 1 : 0 }}><Freeze frame={s(REEL_LEN) - Math.max(0, s(w.off) - 10)} active={(f) => f > s(REEL_LEN) - Math.max(0, s(w.off) - 10)}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Freeze></AbsoluteFill>
    </Sequence>))}</> : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.015 * Math.sin(t * 0.7)})` }} />;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ filter: blur > 0.2 ? `blur(${blur}px) brightness(${1 - dark})` : dark > 0 ? `brightness(${1 - dark})` : undefined, transform: blur > 0.2 ? "scale(1.04)" : undefined }}>{face}</AbsoluteFill>
    </AbsoluteFill>
  );
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

// toma real (LTX o cuadro clave) con empuje lento propio por plano
export const Shot: React.FC<{ k: string; t: number; a: number; z?: [number, number]; ox?: number; oy?: number; dur?: number }> = ({ k, t, a, z = [1.03, 1.12], ox = 0, oy = 0, dur = 8 }) => {
  const q = e(t, a, a + dur), sc = z[0] + (z[1] - z[0]) * q;
  const id = clip(k);
  return <AbsoluteFill style={{ transform: `scale(${sc}) translate(${ox * q}px, ${oy * q}px)` }}><Vid id={id} at={id.startsWith("ltx_") ? a : undefined} /></AbsoluteFill>;
};
// barrido lateral con desenfoque de movimiento entre dos capas (dir 1 = la nueva entra por la derecha)
export const Swipe: React.FC<{ t: number; a: number; b: number; from: React.ReactNode; to: React.ReactNode; dir?: number; vert?: boolean }> = ({ t, a, b, from, to, dir = 1, vert }) => {
  const k = ei(t, a, b), mb = 0, /* sin desenfoque: el avatar va nítido (orden del creador 21-oct) */ ax = vert ? "Y" : "X", D = vert ? 1080 : 1920;
  return (
    <AbsoluteFill>
      {k < 1 && <AbsoluteFill style={{ transform: `translate${ax}(${-dir * k * D}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>{from}</AbsoluteFill>}
      {k > 0 && <AbsoluteFill style={{ transform: `translate${ax}(${dir * (1 - k) * D}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>{to}</AbsoluteFill>}
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


// placa de dos caras que da media vuelta: FROTAR ✗ → DISOLVER ✓
export const Toggle: React.FC<{ t: number; at: number; flip: number; out: number; x: number; y: number; a?: string; b?: string }> = ({ t, at, flip, out, x, y, a = "ENCIMA", b = "ADENTRO" }) => {
  const k = Math.min(1.1, spr(t, at, 0.9)), o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const r = ei(t, flip, flip + 0.45) * 180;
  const face = (back: boolean): React.CSSProperties => ({ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: back ? "rotateX(180deg)" : undefined, borderRadius: 26, display: "flex", alignItems: "center", justifyContent: "center", gap: 26,
    background: back ? "linear-gradient(180deg,#1f6b45,#13452c)" : "linear-gradient(180deg,#7a1f1a,#4a100d)", boxShadow: "0 50px 90px rgba(0,0,0,.65), inset 0 2px 0 rgba(255,255,255,.2)", fontFamily: FONT, fontWeight: 900, fontSize: 96, color: "#fff", letterSpacing: 6, textShadow: extrude(6, "rgba(0,0,0,.5)") });
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 760, height: 190, perspective: 1400, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * Math.min(1, k)})` }}>
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateX(${r}deg) rotateY(${-8 + 4 * Math.sin(t)}deg)` }}>
        <div style={face(false)}>{a} <span style={{ color: "#ff8a7a" }}>✗</span></div>
        <div style={face(true)}>{b} <span style={{ color: "#8dffb8" }}>✓</span></div>
      </div>
    </div>
  );
};


// cronómetro de bolsillo: la aguja da la vuelta y se clava en 10 MIN
export const Stopwatch: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const k = Math.min(1.1, spr(t, at, 0.9)), o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const sweep = ei(t, at + 0.1, at + 1.4), ang = sweep * (360 + 60) - 90;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1200, transform: `translate(-50%,-50%) scale(${0.5 + 0.5 * Math.min(1, k)})` }}>
      <div style={{ transform: `rotateY(${-18 + 6 * Math.sin(t)}deg) rotateX(8deg)`, display: "flex", alignItems: "center", gap: 34 }}>
        <svg width={300} height={340} viewBox="0 0 300 340" style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,.6))" }}>
          <rect x={128} y={0} width={44} height={34} rx={8} fill="#c9ced3" />
          <circle cx={150} cy={190} r={140} fill="#d9dde1" /><circle cx={150} cy={190} r={124} fill="#fbfbf8" />
          <path d={`M150 190 L150 66 A124 124 0 ${sweep * 60 > 180 ? 1 : 0} 1 ${150 + 124 * Math.sin((sweep * 60 * Math.PI) / 180)} ${190 - 124 * Math.cos((sweep * 60 * Math.PI) / 180)} Z`} fill="rgba(255,178,87,.45)" />
          {Array.from({ length: 12 }, (_, i) => <line key={i} x1={150 + 108 * Math.sin(i * 0.5236)} y1={190 - 108 * Math.cos(i * 0.5236)} x2={150 + 120 * Math.sin(i * 0.5236)} y2={190 - 120 * Math.cos(i * 0.5236)} stroke="#33404d" strokeWidth={i % 3 ? 3 : 7} />)}
          <line x1={150} y1={190} x2={150 + 100 * Math.cos((ang * Math.PI) / 180)} y2={190 + 100 * Math.sin((ang * Math.PI) / 180)} stroke={COL.red} strokeWidth={8} strokeLinecap="round" />
          <circle cx={150} cy={190} r={12} fill="#222" />
        </svg>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 130, color: COL.ink, textShadow: extrude(10, "#3a2a14") }}>{Math.round(sweep * 10)} MIN</div>
      </div>
    </div>
  );
};

// fichas numeradas que nacen cada una con SU frase (las tres cosas del video)
export const ChipsAt: React.FC<{ t: number; items: { at: number; tx: string }[]; out: number; y?: number; hl?: number }> = ({ t, items, out, y = 790, hl = -1 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 34, perspective: 1200 }}>
    {items.map((it, i) => {
      const k = Math.min(1.1, spr(t, it.at)), o = e(t, it.at, it.at + 0.1) * (1 - e(t, out, out + 0.3));
      const on = i === hl;
      return (
        <div key={i} style={{ opacity: o, transform: `translateY(${(1 - Math.min(1, k)) * 140}px) rotateX(${(1 - Math.min(1, k)) * 70}deg) scale(${on ? 1.08 : 1})`, width: 420, padding: "16px 0 14px", borderRadius: 18,
          background: on ? "linear-gradient(180deg,#ffe28a,#f2b632)" : "linear-gradient(180deg, rgba(20,32,52,.95), rgba(10,16,28,.95))", boxShadow: `0 26px 50px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.18), 0 0 0 2px ${COL.ice}55`, textAlign: "center", fontFamily: FONT }}>
          <div style={{ fontWeight: 900, fontSize: 70, color: on ? "#3a2400" : COL.ice, lineHeight: 1, textShadow: on ? "none" : extrude(6, "#0a2a40") }}>{i + 1}</div>
          <div style={{ fontWeight: 800, fontSize: 30, color: on ? "#3a2400" : COL.ink, letterSpacing: 3, marginTop: 6 }}>{it.tx}</div>
        </div>
      );
    })}
  </div>
);

// el avatar en "videollamada": marco de celular apaisado flotando junto a la guía
export const VideoCall: React.FC<{ t: number; at: number; out: number; x: number; y: number; w: number }> = ({ t, at, out, x, y, w }) => {
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

// tarjeta "descripción del video": el renglón 1 (el link) se ilumina y la flecha lo señala
export const Desc: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const k = spr(t, at, 0.8), o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.35));
  if (o <= 0.01) return null;
  const hl = e(t, at + 0.4, at + 0.9), sweep = e(t, at + 0.4, at + 1.4);
  const L = (w: number, op = 0.25) => <div style={{ height: 16, width: w, borderRadius: 8, background: `rgba(255,255,255,${op})`, margin: "18px 0 0" }} />;
  return (
    <div style={{ position: "absolute", left: 990, top: 470, perspective: 1500, opacity: o }}>
      <div style={{ transform: `translate(-50%,-50%) translateZ(${(1 - Math.min(1, k)) * -500}px) rotateX(${14 - 8 * Math.min(1, k)}deg) rotateY(${-10 + 4 * Math.sin(t * 0.8)}deg)`, width: 1240, padding: "34px 44px 40px", borderRadius: 26,
        background: "linear-gradient(180deg, rgba(28,30,34,.96), rgba(16,17,20,.96))", boxShadow: "0 70px 120px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.12)", fontFamily: FONT }}>
        <div style={{ color: "rgba(255,255,255,.55)", fontWeight: 800, fontSize: 24, letterSpacing: 4 }}>DESCRIPCIÓN</div>
        <div style={{ position: "relative", marginTop: 16, padding: "16px 20px", borderRadius: 14, background: `rgba(255,214,10,${0.18 * hl})`, boxShadow: hl > 0.05 ? `0 0 0 3px rgba(255,214,10,${0.9 * hl}), 0 0 40px rgba(255,214,10,${0.35 * hl})` : undefined, overflow: "hidden" }}>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 36, lineHeight: 1.3 }}>🟤 La pasta de las juntas con las cantidades exactas 👉 <span style={{ color: "#ffd08a" }}>El Frasco Marrón de Claudio</span></div>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${-30 + 130 * sweep}%`, width: "25%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent)", opacity: sweep < 1 ? 1 : 0 }} />
        </div>
        {L(980)}{L(1040)}{L(760)}{L(900, 0.15)}
      </div>
      <div style={{ position: "absolute", left: -930, top: -120, opacity: hl, transform: `translateX(${-30 * (1 - hl) + 10 * Math.sin(t * 6)}px)`, fontFamily: FONT, fontWeight: 900, fontSize: 54, color: "#ffd60a", textShadow: extrude(6, "#5a4500"), whiteSpace: "nowrap" }}>1ª LÍNEA ➜</div>
    </div>
  );
};
// el lápiz: una raya negra que se dibuja sobre la junta de abajo (proyectada desde el mundo)
const LOWY = 0.06 + 0.156;
const Pencil: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const k = ei(t, at, at + 0.7), o = 1 - e(t, out, out + 0.3);
  if (k <= 0.01 || o <= 0.01) return null;
  const a = screenOf(t, [-0.95, LOWY, -0.992]), b = screenOf(t, [0.5, LOWY, -0.992]);
  const x = a.x + (b.x - a.x) * k, y = a.y + (b.y - a.y) * k;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
      <line x1={a.x} y1={a.y} x2={x} y2={y} stroke="#0b0b0b" strokeWidth={9} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,.35))" }} />
      <g transform={`translate(${x},${y}) rotate(-35)`}><rect x={0} y={-9} width={190} height={18} rx={3} fill="#f2c230" /><polygon points="0,-9 -26,0 0,9" fill="#e8c9a0" /><polygon points="-17,-3.5 -26,0 -17,3.5" fill="#222" /><rect x={186} y={-9} width={22} height={18} fill="#e98a8a" /></g>
    </svg>
  );
};

export const Min1: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];
  const lo = (x = -0.2): [number, number, number] => [x, LOWY, -0.992];

  // ===== A · 0-3,35 · avatar "usted está en la ducha… baja la vista" → la toma baja (barrido vertical) =====
  if (t < 3.75) L.push(<Swipe key="swA" t={t} a={3.35} b={3.72} vert dir={1} from={<Avatar t={t} />} to={<Shot k="h_linterna_a" t={t} a={3.35} z={[1.02, 1.1]} />} />);
  // ===== B · 3,35-8,6 · la LINTERNA de noche barre las juntas (LTX) =====
  if (t >= 3.72 && t < 8.6) {
    L.push(<Shot key="hB" k="h_linterna_a" t={t} a={3.35} z={[1.02, 1.1]} />);
    L.push(<Tag key="ae" t={t} at={5.5} x={900} y={720} dx={-260} dy={-200} text="AHÍ ESTÁN" col={COL.ink} out={8.3} size={54} />);
  }
  // ===== C · 8,6-15,95 · el mundo de noche: la cámara baja a la junta de abajo mientras se pone negra =====
  if (t >= 8.4 && t < 16.3) {
    const r = ei(t, 8.4, 8.8);
    if (r < 1) L.push(<Shot key="hC" k="h_linterna_a" t={t} a={3.35} z={[1.02, 1.1]} />);
    L.push(<Portal key="pC" x={960} y={620} r={r}><World t={Math.max(8.6, t)} /></Portal>);
    const g = screenOf(t, lo(-0.35));
    L.push(<Tag key="bl" t={t} at={9.0} x={g.x} y={g.y} dx={-240} dy={-190} text="ERAN BLANCAS" col="#f3f0e6" out={10.5} size={48} />);
    L.push(<Tag key="ng" t={t} at={11.1} x={g.x} y={g.y} dx={260} dy={-200} text="NEGRAS" col={COL.red} out={15.9} size={64} />);
    L.push(<Stamp key="ngr" t={t} at={11.9} text="NO GRISES" x={560} y={250} out={13.3} rot={-8} size={96} />);
    L.push(<Pencil key="lp" t={t} at={14.8} out={15.95} />);
  }
  // ===== D · 15,95-21 · avatar: el cloro del sábado, blancas un par de días =====
  if (t >= 15.93 && t < 21.3) {
    L.push(<Swipe key="swD" t={t} a={15.93} b={16.25} dir={1} from={<World t={Math.min(t, 15.93)} />} to={
      <Swipe t={t} a={21.0} b={21.3} dir={-1} from={<Avatar t={t} />} to={<World t={Math.max(t, 21.0)} />} />} />);
    L.push(<Tag key="clo" t={t} at={17.1} x={1380} y={520} dx={160} dy={-170} text="CLORO" sub="EL SÁBADO" col={COL.ice} out={19.4} size={50} />);
    L.push(<BigNum key="2d" t={t} at={20.1} text="2 DÍAS" size={150} x={1440} y={210} out={21.05} col="#f3f0e6" edge="#3a4656" />);
  }
  // ===== E · 21-30 · de día: OTRA VEZ la misma raya, a la altura de los pies → vuela a la junta en corte =====
  if (t >= 21.3 && t < 30.4) {
    const r = ei(t, 30.06, 30.4);
    L.push(<World key="wE" t={Math.min(t, 30.06)} />);
    const g = screenOf(t, lo(-0.4));
    L.push(<Stamp key="ov" t={t} at={21.8} text="OTRA VEZ" x={1380} y={230} out={23.4} rot={7} size={100} />);
    L.push(<Tag key="mr" t={t} at={23.1} x={g.x} y={g.y} dx={-260} dy={-190} text="LA MISMA RAYA" col={COL.ink} out={25.6} size={46} />);
    L.push(<Tag key="pi" t={t} at={26.3} x={g.x} y={g.y} dx={300} dy={140} text="A LA ALTURA DE SUS PIES" col={COL.amber} out={27.9} size={44} />);
    L.push(<div key="cnd" style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 42, letterSpacing: 8, color: COL.dim, opacity: e(t, 28.4, 28.7) * (1 - e(t, 29.8, 30.05)), textShadow: "0 3px 12px #000" }}>LO QUE EL CLORO NO LE DICE</div>);
    if (r > 0) L.push(<Portal key="pE" x={960} y={540} r={r}><Avatar t={t} /></Portal>);
  }
  // ===== G · 30,06-33,47 · avatar: ENCIMA ✗ / ADENTRO ✓ =====
  if (t >= 30.4 && t < 33.85) L.push(<Swipe key="swG" t={t} a={33.47} b={33.82} vert dir={1} from={<Avatar t={t} />} to={<World t={Math.max(t, 33.47)} />} />);
  if (t >= 31.6 && t < 35.0) L.push(<Toggle key="tg" t={t} at={31.7} flip={33.5} out={34.6} x={960} y={880} />);
  // ===== H · 33,5-37,1 · la junta en corte: el cloro se queda arriba, el moho abajo · NUNCA LLEGA =====
  if (t >= 33.82 && t < 37.4) {
    L.push(<World key="wH" t={t} />);
    const c = screenOf(t, PT.crust), rt = screenOf(t, PT.root);
    L.push(<Tag key="rz" t={t} at={33.85} x={rt.x} y={rt.y} dx={300} dy={120} text="EL MOHO" sub="ADENTRO DE LA JUNTA" col="#c9a27a" out={37.0} size={46} />);
    L.push(<Tag key="cl" t={t} at={34.9} x={c.x} y={c.y} dx={-300} dy={-170} text="EL CLORO" sub="SE QUEDA ARRIBA" col={COL.ice} out={37.0} size={46} />);
    L.push(<Stamp key="nl" t={t} at={35.9} text="NUNCA LLEGA" x={1380} y={210} out={37.1} rot={-7} size={92} />);
  }
  // ===== I · 37,1-43,8 · Claudio con el carrito (rótulo) · 23:00 =====
  if (t >= 37.08 && t < 44.1) {
    L.push(<Swipe key="swI" t={t} a={37.08} b={37.4} dir={1} from={<World t={Math.min(t, 37.08)} />} to={
      <Swipe t={t} a={43.78} b={44.08} dir={1} from={<Shot k="c_pasillo" t={t} a={37.08} z={[1.02, 1.1]} />} to={<Shot k="c_huesped" t={t} a={43.78} z={[1.03, 1.12]} />} />} />);
    L.push(<BigNum key="23" t={t} at={42.95} text="23:00" size={140} x={1480} y={190} out={44.0} col="#ffd08a" edge="#4a2e10" />);
  }
  if (t >= 37.3 && t < 40.9) L.push(<LowerThird key="lt" t={t} at={37.4} out={40.6} name="CLAUDIO" l2="30 AÑOS · CONSERJE DE HOTEL" l2at={38.4} />);
  // ===== K · 43,8-46,2 · el huésped de la 214 =====
  if (t >= 44.08 && t < 46.55) {
    L.push(<Swipe key="swK" t={t} a={46.22} b={46.52} dir={-1} from={<Shot k="c_huesped" t={t} a={43.78} z={[1.03, 1.12]} />} to={<Avatar t={t} />} />);
    L.push(<BigNum key="214" t={t} at={44.6} text="HAB. 214" size={110} x={1450} y={180} out={46.1} col={COL.ink} edge="#2a2a2a" />);
  }
  // ===== L · 46,2-51,2 · avatar «está sucia» · fui con la linterna =====
  if (t >= 46.52 && t < 51.5) L.push(<Swipe key="swL" t={t} a={51.19} b={51.48} vert dir={1} from={<Avatar t={t} />} to={<Shot k="c_linterna" t={t} a={51.19} z={[1.03, 1.1]} />} />);
  if (t >= 48.8 && t < 50.9) L.push(<Stamp key="su" t={t} at={49.1} text="«ESTÁ SUCIA»" x={1400} y={240} out={50.6} rot={6} size={80} col={COL.amber} />);
  // ===== M · 51,2-54,4 · la linterna: recién lavada con cloro =====
  if (t >= 51.48 && t < 54.7) {
    L.push(<Swipe key="swM" t={t} a={54.4} b={54.68} dir={1} from={<Shot k="c_linterna" t={t} a={51.19} z={[1.03, 1.1]} />} to={<Shot k="h_juntas" t={t} a={54.4} z={[1.04, 1.12]} />} />);
    L.push(<Tag key="rl" t={t} at={52.8} x={760} y={640} dx={-260} dy={-230} text="RECIÉN LAVADA" sub="CON CLORO" col="#7dff9e" out={54.3} size={48} />);
  }
  // ===== N · 54,4-58,8 · pero las juntas: NEGRAS · el huésped tenía razón =====
  if (t >= 54.68 && t < 59.2) {
    const r = ei(t, 58.8, 59.2);
    L.push(<Shot key="hN" k="h_juntas" t={t} a={54.4} z={[1.04, 1.12]} />);
    L.push(<Stamp key="ngN" t={t} at={55.7} text="NEGRAS" x={960} y={300} out={57.0} rot={-6} size={120} />);
    L.push(<Tag key="tr" t={t} at={57.5} x={960} y={620} dx={300} dy={-180} text="TENÍA RAZÓN" col={COL.amber} out={58.7} size={50} />);
    if (r > 0) L.push(<Portal key="pN" x={960} y={540} r={r}><World t={Math.max(t, 58.8)} /></Portal>);
  }
  // ===== O · 58,8-62,2 · la ciudad: las raíces encendidas — parece sucia aunque esté limpia =====
  if (t >= 59.2 && t < 62.55) {
    L.push(<Swipe key="swO" t={t} a={62.24} b={62.54} dir={-1} from={<World t={Math.min(t, 62.24)} />} to={<Avatar t={t} />} />);
    const rt = screenOf(t, PT.root);
    L.push(<Tag key="rO" t={t} at={59.3} x={rt.x} y={rt.y} dx={-320} dy={140} text="LO QUE NO SE VE" col="#ff9a5a" out={62.1} size={46} />);
    L.push(<BigNum key="ps" t={t} at={61.4} text="PARECE SUCIA" size={120} y={190} out={62.3} col="#f3f0e6" edge="#3a2a20" />);
  }
  // ===== P · 62,2-67,6 · avatar: las tres cosas =====
  if (t >= 62.54 && t < 67.95) L.push(<Swipe key="swP" t={t} a={67.59} b={67.93} dir={1} from={<Avatar t={t} />} to={<World t={Math.max(t, 67.59)} />} />);
  // ===== Q · 67,6-73,7 · 1 · el cloro blanquea ARRIBA y a la semana vuelve el negro =====
  if (t >= 67.93 && t < 74.0) {
    L.push(<Swipe key="swQ" t={t} a={73.7} b={73.98} dir={1} from={<World t={Math.min(t, 73.7)} />} to={<Shot k="s2_revolver" t={t} a={73.7} z={[1.06, 1.0]} dur={2.5} />} />);
    const c = screenOf(t, PT.crust), rt = screenOf(t, PT.root);
    L.push(<Tag key="ba" t={t} at={68.9} x={c.x} y={c.y} dx={-280} dy={-180} text="BLANQUEA ARRIBA" col={COL.ice} out={73.5} size={44} />);
    L.push(<Tag key="vu" t={t} at={70.8} x={rt.x} y={rt.y} dx={280} dy={150} text="Y DESDE ACÁ VUELVE" col="#ff9a5a" out={73.5} size={44} />);
    L.push(<Stamp key="nc" t={t} at={72.2} text="NO ES CULPA SUYA" x={960} y={250} out={73.6} rot={-5} size={80} col="#7dff9e" />);
  }
  // ===== R · 73,7-75,8 · 2 · la pasta del hotel =====
  if (t >= 73.98 && t < 76.1) {
    L.push(<Swipe key="swR" t={t} a={75.8} b={76.08} dir={1} from={<Shot k="s2_revolver" t={t} a={73.7} z={[1.06, 1.0]} dur={2.5} />} to={<Shot k="s6_esponja_a" t={t} a={75.8} z={[1.0, 1.06]} dur={3} />} />);
  }
  // ===== S · 75,8-78,2 · la pasada de plata: de negra a blanca en una sola pasada =====
  if (t >= 76.08 && t < 78.55) {
    L.push(<Swipe key="swS" t={t} a={78.21} b={78.53} dir={-1} from={<Shot k="s6_esponja_a" t={t} a={75.8} z={[1.0, 1.06]} dur={3} />} to={<Avatar t={t} />} />);
    L.push(<Tag key="co" t={t} at={76.2} x={900} y={520} dx={300} dy={-120} text="3 COSAS DE SU COCINA" col={COL.ink} out={78.1} size={46} />);
  }
  // ===== T · 78,2-82,35 · avatar: blanca de verdad, UNA SOLA PASADA =====
  if (t >= 78.53 && t < 82.7) L.push(<Swipe key="swT" t={t} a={82.35} b={82.68} vert dir={1} from={<Avatar t={t} />} to={<Shot k="e_alambre" t={t} a={82.35} z={[1.0, 1.1]} dur={5.7} />} />);
  if (t >= 80.4 && t < 82.6) L.push(<BigNum key="usp" t={t} at={80.6} text="UNA SOLA PASADA" size={110} y={190} out={82.3} col="#f3f0e6" edge="#3a4656" />);
  // ===== U · 82,35-88 · 3 · el error que gasta las juntas para siempre =====
  if (t >= 82.68 && t < 88.4) {
    L.push(<Shot key="eU" k="e_alambre" t={t} a={82.35} z={[1.0, 1.1]} dur={5.7} />);
    L.push(<DrawX key="xU" t={t} at={83.0} x={620} y={260} w={680} h={420} />);
    L.push(<Tag key="ps2" t={t} at={83.6} x={960} y={560} dx={320} dy={160} text="PARA SIEMPRE" col={COL.red} out={85.9} size={50} />);
    L.push(<Tag key="bi" t={t} at={86.4} x={900} y={640} dx={-320} dy={220} text="CON BUENA INTENCIÓN" col={COL.amber} out={88.0} size={44} />);
  }
  if (t >= 66.5 && t < 88.3) L.push(<ChipsAt key="chp" t={t} out={88.0} y={t < 67.59 || (t >= 78.21 && t < 82.35) ? 840 : 50} hl={t < 67.8 ? -1 : t < 73.7 ? 0 : t < 82.0 ? 1 : 2}
    items={[{ at: 67.8, tx: "POR QUÉ VUELVE" }, { at: 73.7, tx: "LA PASTA DEL HOTEL" }, { at: 82.0, tx: "EL ERROR" }]} />);
  // ===== CTA1 · 88-107,9 · vuelo al carrito, la guía se abre en la página 19 REAL =====
  if (t >= 88.04) {
    const k = ei(t, 88.04, 88.44);
    if (k < 1) L.push(<Shot key="eC" k="e_alambre" t={t} a={82.35} z={[1.0, 1.1]} dur={5.7} />);
    L.push(<AbsoluteFill key="wC" style={{ clipPath: `circle(${k * 1200}px at 960px 540px)` }}><World t={t} /></AbsoluteFill>);
    L.push(<Flash key="flC" t={t} at={88.06} col="#fff1cf" peak={0.5} w={0.3} />);
    const bk = screenOf(t, [PT.book[0], PT.book[1] + 0.04, PT.book[2]]);
    L.push(<Tag key="g1" t={t} at={92.56} x={bk.x} y={bk.y - 40} dx={-300} dy={-160} text="EL FRASCO MARRÓN" sub="DE CLAUDIO · MI GUÍA" col="#ffd08a" out={94.3} size={52} />);
    L.push(<VideoCall key="vc" t={t} at={93.86} out={99.6} x={70} y={250} w={760} />);
    L.push(<BigNum key="p19" t={t} at={94.76} text="PÁG. 19" size={120} x={1560} y={150} out={97.0} col="#ffd60a" edge="#5a4500" />);
    const pa = screenOf(t, pagePt(0.6, 0.5)), ti = screenOf(t, pagePt(0.3, 0.54)), ns = screenOf(t, pagePt(0.28, 0.85));
    L.push(<Tag key="re" t={t} at={96.1} x={pa.x} y={pa.y} dx={-420} dy={-210} text="LA RECETA" sub="CUÁNTO DE CADA COSA" col="#ffd60a" out={103.2} size={42} />);
    L.push(<Tag key="ti" t={t} at={99.74} x={ti.x} y={ti.y} dx={-300} dy={60} text="CUÁNTO TIEMPO" col="#ffd60a" out={103.2} size={42} />);
    L.push(<Tag key="sn" t={t} at={100.92} x={ns.x} y={ns.y} dx={-380} dy={120} text="SI NO QUEDA BLANCA" col="#9fd0ff" out={103.2} size={42} />);
    L.push(<Desc key="desc" t={t} at={103.38} out={106.1} />);
  }

  return <AbsoluteFill style={{ background: "#0b0e13" }}>{L}</AbsoluteFill>;
};
void Card3D; void Vid; void Stopwatch;

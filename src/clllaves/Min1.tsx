// clllaves · MINUTO 1 + LA GUÍA (0-100,8 s). Un solo hilo, sin cortes secos:
// avatar → portal desde el lavamanos al baño 3D: el chorro TORCIDO salpica el espejo → toma real → la cámara baja a la COSTRA
// → portal a la costra real (dura como piedra) → esponja / cloro / un sábado entero (lista que se tacha) → avatar
// → cromo rayado y amarillo → macro 3D de la costra "NO ES MUGRE · ES PIEDRA" → la cueva → avatar FROTAR✗ / DISOLVER✓
// → Claudio con el carrito (rótulo) → el gerente con la libreta (101 ✓ 102 ✓ … 104 ✗) → avatar "NO SE ENTREGA"
// → en 3D la costra SE DISUELVE (burbujas) y el chorro sale recto · cronómetro 10 MIN → la mesa con lo de la cocina
// → la cámara sale del baño: la MAQUETA con el subsuelo (la piedra que usted no ve) → se zambulle hasta el aireador tapado
// → avatar "la bolsita" → la fibra verde que raya → CTA: vuela al carrito del pasillo, LA GUÍA se abre en la pág. 18 REAL
// (avatar en videollamada al lado), se pintan las cantidades, la descripción con el link → vuelve volando a la llave.
// Audio fuera de Remotion (voz + sonido real de los clips se mezclan en encfin). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, PT, screenOf, camSpeed, C1, pagePt } from "./bano3d";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import { BigNum, COL, Card3D, DrawX, Flash, FONT, LowerThird, P, Portal, Tag, Vid, e, ei, extrude, s, spr } from "./lib";

export const MIN1_END = 100.8;
export const MIN1_FRAMES = s(MIN1_END + 0.7);
const REEL = (AVAIL as { reel: boolean }).reel; // reel del avatar (public/clllaves/reel0.mp4, 1 /run de RunPod)
const LTX = new Set((AVAIL as { ltx: string[] }).ltx); // clips LTX ya bajados (public/clllaves/ltx_<k>.mp4); si no, el cuadro clave
export const clip = (k: string) => (LTX.has(k) ? "ltx_" + k : "img_" + k);
export const WIN: { ms: number; me: number; off: number }[] = (AVW as { win: { ms: number; me: number; off: number }[] }).win;

export const Avatar: React.FC<{ t: number; blur?: number; dark?: number }> = ({ t, blur = 0, dark = 0 }) => {
  const face = REEL ? <>{WIN.map((w, i) => (
    <Sequence key={i} from={Math.max(0, s(w.ms) - 10)} durationInFrames={s(w.me - w.ms) + 12} layout="none">
      <AbsoluteFill style={{ opacity: t >= w.ms - 0.02 && t < w.me ? 1 : 0 }}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
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
const Swipe: React.FC<{ t: number; a: number; b: number; from: React.ReactNode; to: React.ReactNode; dir?: number; vert?: boolean }> = ({ t, a, b, from, to, dir = 1, vert }) => {
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

// LOS INTENTOS: fichas apiladas en perspectiva, cada una con su ícono; al "sigue ahí" las tres quedan tachadas a la vez
const Intentos: React.FC<{ t: number; items: { at: number; tx: string; ic: string }[]; strike: number; out: number }> = ({ t, items, strike, out }) => (
  <div style={{ position: "absolute", right: 110, top: 230, perspective: 1300 }}>
    {items.map((it, i) => {
      const k = Math.min(1.1, spr(t, it.at)), o = e(t, it.at, it.at + 0.1) * (1 - e(t, out + i * 0.05, out + i * 0.05 + 0.25));
      if (o <= 0.01) return null;
      const st = e(t, strike + i * 0.08, strike + i * 0.08 + 0.22), shake = strike < t && t < strike + 0.5 ? Math.sin(t * 70) * 6 * (1 - e(t, strike, strike + 0.5)) : 0;
      return (
        <div key={i} style={{ opacity: o, position: "relative", display: "flex", alignItems: "center", gap: 24, margin: "0 0 26px", padding: "18px 34px 18px 22px", borderRadius: 20,
          transform: `translateX(${(1 - Math.min(1, k)) * 260 + shake}px) rotateY(${(1 - Math.min(1, k)) * -60 - 14}deg) rotateZ(${(i - 1) * 1.5}deg)`,
          background: "linear-gradient(180deg, rgba(250,248,242,.97), rgba(226,222,212,.97))", boxShadow: "0 30px 60px rgba(0,0,0,.55), inset 0 -4px 0 rgba(0,0,0,.08)", fontFamily: FONT }}>
          <div style={{ fontSize: 64, width: 84, textAlign: "center", filter: `grayscale(${st})` }}>{it.ic}</div>
          <div style={{ fontWeight: 900, fontSize: 52, color: "#1d2733", letterSpacing: 1 }}>{it.tx}</div>
          <svg width={600} height={120} style={{ position: "absolute", left: 10, top: 0, overflow: "visible" }}>
            {st > 0.01 && <line x1={0} y1={64} x2={560 * st} y2={52} stroke={COL.red} strokeWidth={14} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 8px rgba(255,60,40,.7))" }} />}
          </svg>
        </div>
      );
    })}
  </div>
);

// placa de dos caras que da media vuelta: FROTAR ✗ → DISOLVER ✓
const Toggle: React.FC<{ t: number; at: number; flip: number; out: number; x: number; y: number }> = ({ t, at, flip, out, x, y }) => {
  const k = Math.min(1.1, spr(t, at, 0.9)), o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const r = ei(t, flip, flip + 0.45) * 180;
  const face = (back: boolean): React.CSSProperties => ({ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: back ? "rotateX(180deg)" : undefined, borderRadius: 26, display: "flex", alignItems: "center", justifyContent: "center", gap: 26,
    background: back ? "linear-gradient(180deg,#1f6b45,#13452c)" : "linear-gradient(180deg,#7a1f1a,#4a100d)", boxShadow: "0 50px 90px rgba(0,0,0,.65), inset 0 2px 0 rgba(255,255,255,.2)", fontFamily: FONT, fontWeight: 900, fontSize: 96, color: "#fff", letterSpacing: 6, textShadow: extrude(6, "rgba(0,0,0,.5)") });
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 760, height: 190, perspective: 1400, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * Math.min(1, k)})` }}>
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateX(${r}deg) rotateY(${-8 + 4 * Math.sin(t)}deg)` }}>
        <div style={face(false)}>FROTAR <span style={{ color: "#ff8a7a" }}>✗</span></div>
        <div style={face(true)}>DISOLVER <span style={{ color: "#8dffb8" }}>✓</span></div>
      </div>
    </div>
  );
};

// LA LIBRETA del gerente: hoja rayada en perspectiva, renglones escritos a mano que aparecen con la voz
const Libreta: React.FC<{ t: number; at: number; out: number; rows: { at: number; tx: string; ok: boolean }[]; stampAt: number }> = ({ t, at, out, rows, stampAt }) => {
  const k = Math.min(1.1, spr(t, at, 0.8)), o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 1290, top: 170, perspective: 1500, opacity: o }}>
      <div style={{ width: 520, height: 700, transformOrigin: "50% 100%", transform: `rotateX(${(1 - Math.min(1, k)) * 70 + 12}deg) rotateY(-14deg) rotateZ(3deg)`, borderRadius: 10, position: "relative",
        background: "repeating-linear-gradient(180deg, #fbf8ef 0 62px, #9fb8d6 62px 64px)", boxShadow: "0 50px 90px rgba(0,0,0,.6), -14px 0 0 #1c1c1c", padding: "70px 40px 0 70px", fontFamily: "'Segoe Print','Comic Sans MS',cursive" }}>
        <div style={{ position: "absolute", left: 50, top: 0, bottom: 0, width: 3, background: "#e08a8a" }} />
        <div style={{ position: "absolute", left: 70, top: 14, fontSize: 34, color: "#33465f", fontWeight: 700 }}>REVISIÓN · PISO 1</div>
        {rows.map((r, i) => { const w = e(t, r.at, r.at + 0.35); return (
          <div key={i} style={{ height: 64, lineHeight: "64px", fontSize: 44, color: "#1f3557", fontWeight: 700, display: "flex", gap: 30, clipPath: `inset(0 ${100 - 100 * w}% 0 0)` }}>
            <span>Hab. {r.tx}</span><span style={{ color: r.ok ? "#1d8a4c" : COL.red, fontSize: 52 }}>{r.ok ? "✓" : "✗"}</span>
          </div>); })}
        <div style={{ position: "absolute", left: 260, top: 470 }}><Stamp t={t} at={stampAt} text="NO SE ENTREGA" x={0} y={0} rot={-14} size={58} /></div>
      </div>
    </div>
  );
};

// cronómetro de bolsillo: la aguja da la vuelta y se clava en 10 MIN
const Stopwatch: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
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
const ChipsAt: React.FC<{ t: number; items: { at: number; tx: string }[]; out: number; y?: number; hl?: number }> = ({ t, items, out, y = 790, hl = -1 }) => (
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
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 36, lineHeight: 1.3 }}>🟤 El arreglo del sarro con las cantidades exactas 👉 <span style={{ color: "#6fb4ff", textDecoration: "underline" }}>https://el-frasco-marron-de-claudio.vercel.app/</span></div>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${-30 + 130 * sweep}%`, width: "25%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent)", opacity: sweep < 1 ? 1 : 0 }} />
        </div>
        {L(980)}{L(1040)}{L(760)}{L(900, 0.15)}
      </div>
      <div style={{ position: "absolute", left: -930, top: -120, opacity: hl, transform: `translateX(${-30 * (1 - hl) + 10 * Math.sin(t * 6)}px)`, fontFamily: FONT, fontWeight: 900, fontSize: 54, color: "#ffd60a", textShadow: extrude(6, "#5a4500"), whiteSpace: "nowrap" }}>1ª LÍNEA ➜</div>
    </div>
  );
};

export const Min1: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];

  // ===== A · 0-4,2 · avatar "el chorro sale torcido"; portal desde el lavamanos al baño 3D =====
  if (t < 4.25) {
    L.push(<Avatar key="avA" t={t} />);
    const r = ei(t, 3.5, 4.2);
    if (r > 0) L.push(<Portal key="pA" x={1250} y={760} r={r}><World t={Math.max(3.4, t)} /></Portal>);
    L.push(<Tag key="tor" t={t} at={3.22} x={1250} y={760} dx={-240} dy={-200} text="TORCIDO" col={COL.amber} out={4.6} size={56} />);
  }
  // ===== B · 4,2-6,6 · el chorro torcido salpica el espejo =====
  if (t >= 4.2 && t < 6.62) {
    L.push(<World key="wB" t={t} />);
    const j = screenOf(t, PT.jet), m = screenOf(t, PT.mirror);
    L.push(<Tag key="ch" t={t} at={4.28} x={j.x} y={j.y} dx={220} dy={120} text="SALPICA" col={COL.ice} out={6.4} size={48} />);
    L.push(<Tag key="es" t={t} at={5.74} x={m.x} y={m.y} dx={260} dy={-60} text="EL ESPEJO" out={6.4} size={44} />);
  }
  // ===== C · 6,6-8,8 · toma real del chorro (entra con barrido vertical) =====
  if (t >= 6.4 && t < 9.1) {
    L.push(<Swipe key="swC" t={t} a={6.4} b={6.75} vert dir={1} from={<World t={Math.min(t, 6.6)} />}
      to={<Shot k="h_chorro" t={t} a={6.4} z={[1.04, 1.12]} />} />);
  }
  // ===== D · 8,8-11,2 · "mira la base de la llave": la cámara baja a la costra =====
  if (t >= 8.8 && t < 11.5) {
    const k = ei(t, 8.8, 9.15);
    L.push(<AbsoluteFill key="wD" style={{ clipPath: `inset(0 0 ${(1 - k) * 100}% 0)` }}><World t={t} /></AbsoluteFill>);
    if (k < 1) L.push(<AbsoluteFill key="cD" style={{ clipPath: `inset(${k * 100}% 0 0 0)` }}><Shot k="h_chorro" t={t} a={6.4} z={[1.04, 1.12]} /></AbsoluteFill>);
    const b = screenOf(t, PT.joint);
    L.push(<Tag key="cb" t={t} at={10.78} x={b.x} y={b.y} dx={-300} dy={-170} text="COSTRA BLANCA" out={11.5} size={56} />);
    const r = ei(t, 11.05, 11.45);
    if (r > 0) L.push(<Portal key="pD" x={b.x} y={b.y} r={r}><Shot k="h_costra" t={t} a={11.05} z={[1.12, 1.03]} /></Portal>);
  }
  // ===== E · 11,2-16,9 · la costra real: dura como piedra, pegada donde el metal toca el lavamanos =====
  if (t >= 11.45 && t < 17.2) {
    const out = ei(t, 16.75, 17.15);
    L.push(<AbsoluteFill key="cE" style={{ transform: `scale(${1 + out * 0.25})`, opacity: 1 - out }}><Shot k="h_costra" t={t} a={11.05} z={[1.12, 1.03]} /></AbsoluteFill>);
    L.push(<BigNum key="dp" t={t} at={12.26} text="DURA COMO PIEDRA" size={104} y={200} out={13.8} />);
    L.push(<Tag key="jn" t={t} at={13.94} x={930} y={640} dx={-320} dy={170} text="METAL + LOZA" sub="AHÍ SE PEGA" col={COL.amber} out={16.6} size={50} />);
    if (out > 0) L.push(<AbsoluteFill key="fE" style={{ opacity: out }}><Shot k="h_frotar" t={t} a={16.75} z={[1.0, 1.08]} dur={2} /></AbsoluteFill>);
  }
  // ===== F · 16,9-18,3 · la esponja (lista de intentos que se arma) =====
  if (t >= 17.1 && t < 18.65) {
    const k = ei(t, 18.25, 18.62);
    L.push(<Swipe key="swF" t={t} a={18.25} b={18.62} dir={-1} from={<Shot k="h_frotar" t={t} a={16.75} z={[1.0, 1.08]} dur={2} />} to={<Avatar t={t} />} />);
    void k;
  }
  // ===== G · 18,3-23,2 · avatar: cloro, un sábado entero, "y sigue ahí" =====
  if (t >= 18.62 && t < 23.25) L.push(<Avatar key="avG" t={t} />);
  if (t >= 16.9 && t < 24.6) L.push(<Intentos key="int" t={t} strike={23.38} out={24.3} items={[{ at: 17.68, tx: "ESPONJA", ic: "🧽" }, { at: 19.5, tx: "CLORO", ic: "🧴" }, { at: 21.2, tx: "UN SÁBADO ENTERO", ic: "😩" }]} />);
  // ===== H · 23,2-28,2 · peor: cromo rayado y costra amarilla =====
  if (t >= 23.0 && t < 28.6) {
    const r = ei(t, 23.0, 23.35);
    if (t < 23.36) L.push(<Avatar key="avH" t={t} />);
    L.push(<Portal key="pH" x={960} y={540} r={r} ring={0.6}><Shot k="h_rayas" t={t} a={23.0} z={[1.1, 1.02]} ox={-30} /></Portal>);
    L.push(<Stamp key="peor" t={t} at={24.34} text="PEOR" x={420} y={240} out={25.6} rot={-8} size={120} />);
    L.push(<Tag key="ry" t={t} at={26.06} x={820} y={520} dx={260} dy={-200} text="RAYITAS" col={COL.ink} out={28.3} size={50} />);
    L.push(<Tag key="am" t={t} at={27.56} x={1060} y={760} dx={300} dy={90} text="AMARILLA" col="#ffd66b" out={28.3} size={50} />);
  }
  // ===== I · 28,2-33,7 · macro 3D de la costra: "NO ES MUGRE" tachado → ES PIEDRA =====
  if (t >= 28.2 && t < 34.05) {
    const k = ei(t, 28.2, 28.6);
    L.push(<AbsoluteFill key="wI" style={{ opacity: k }}><World t={t} /></AbsoluteFill>);
    if (k < 1) L.push(<AbsoluteFill key="hI" style={{ opacity: 1 - k, transform: `scale(${1 + k * 0.4})` }}><Shot k="h_rayas" t={t} a={23.0} z={[1.1, 1.02]} ox={-30} /></AbsoluteFill>);
    L.push(<div key="nad" style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: COL.dim, opacity: e(t, 29.04, 29.3) * (1 - e(t, 31.2, 31.4)), textShadow: "0 3px 12px #000" }}>LO QUE NADIE LE DICE</div>);
    const nm = e(t, 31.4, 31.55) * (1 - e(t, 33.5, 33.7)), sx = e(t, 32.52, 32.75);
    if (nm > 0.01) L.push(<div key="nm" style={{ position: "absolute", left: 960, top: 230, transform: "translate(-50%,-50%)", opacity: nm, fontFamily: FONT, fontWeight: 900, fontSize: 96, color: COL.ink, letterSpacing: 4, textShadow: extrude(8, "#000") }}>
      NO ES MUGRE<div style={{ position: "absolute", left: -20, right: -20, top: "52%", height: 14, background: COL.red, transformOrigin: "0 50%", transform: `scaleX(${sx}) rotate(-3deg)`, borderRadius: 7, boxShadow: "0 0 18px rgba(255,60,40,.8)" }} /></div>);
    L.push(<BigNum key="pi" t={t} at={32.92} text="ES PIEDRA" size={170} y={820} col="#f3ecd8" edge="#6b5a3a" out={33.75} />);
  }
  // ===== J · 33,7-34,7 · la cueva (la misma piedra) =====
  if (t >= 33.7 && t < 35.05) {
    const r = ei(t, 33.7, 34.05);
    L.push(<Portal key="pJ" x={960} y={560} r={r}><Shot k="h_cueva" t={t} a={33.7} z={[1.0, 1.1]} dur={2} /></Portal>);
    L.push(<Tag key="cv" t={t} at={33.9} x={980} y={300} dx={240} dy={-80} text="LA MISMA DE LAS CUEVAS" col="#f3ecd8" out={34.9} size={42} />);
  }
  // ===== K · 34,7-40,1 · avatar: no se va frotando, se va disolviendo =====
  if (t >= 34.66 && t < 40.4) {
    const sl = ei(t, 40.0, 40.4);
    L.push(<Swipe key="swK" t={t} a={34.66} b={34.95} vert dir={-1} from={<Shot k="h_cueva" t={t} a={33.7} z={[1.0, 1.1]} dur={2} />} to={
      <Swipe t={t} a={40.0} b={40.4} from={<Avatar t={t} />} to={<Shot k="c_pasillo" t={t} a={40.0} z={[1.02, 1.1]} />} />} />);
    void sl;
    L.push(<Toggle key="tg" t={t} at={37.4} flip={38.84} out={40.0} x={960} y={880} />);
  }
  // ===== L · 40,1-43,7 · Claudio con el carrito por el pasillo (rótulo) =====
  if (t >= 40.4 && t < 44.05) {
    const k = ei(t, 43.7, 44.05);
    L.push(<Swipe key="swL" t={t} a={43.7} b={44.05} from={<Shot k="c_pasillo" t={t} a={40.0} z={[1.02, 1.1]} />} to={<Shot k="c_gerente" t={t} a={43.7} z={[1.03, 1.13]} />} />);
    void k;
  }
  if (t >= 40.4 && t < 44.2) L.push(<LowerThird key="lt" t={t} at={40.64} out={43.55} name="CLAUDIO" l2="30 AÑOS · CONSERJE DE HOTEL" l2at={41.5} />);
  // ===== M · 43,7-50,4 · el gerente pasa el dedo · la libreta =====
  if (t >= 44.05 && t < 50.75) {
    const r = ei(t, 50.38, 50.75);
    L.push(<Shot key="gM" k="c_gerente" t={t} a={43.7} z={[1.03, 1.13]} />);
    L.push(<Tag key="dd" t={t} at={47.2} x={760} y={640} dx={-260} dy={130} text="EL DEDO" col={COL.ice} out={50.3} size={48} />);
    if (r > 0) L.push(<AbsoluteFill key="avMN" style={{ opacity: r }}><Avatar t={t} /></AbsoluteFill>);
  }
  // ===== N · 50,4-56,1 · avatar "si el dedo salía blanco… no se entregaba" =====
  if (t >= 50.75 && t < 56.4) {
    const z = ei(t, 55.9, 56.35);
    L.push(<AbsoluteFill key="avN" style={{ transform: `scale(${1 + z * 0.6})`, opacity: 1 - z * 0.7 }}><Avatar t={t} /></AbsoluteFill>);
    if (z > 0.3) L.push(<AbsoluteFill key="wN" style={{ opacity: (z - 0.3) / 0.7 }}><World t={56.1} /></AbsoluteFill>);
  }
  if (t >= 45.9 && t < 54.6) L.push(<Libreta key="lib" t={t} at={45.96} out={54.2} stampAt={52.58} rows={[{ at: 48.64, tx: "101", ok: true }, { at: 49.34, tx: "102", ok: true }, { at: 49.8, tx: "103", ok: true }, { at: 51.42, tx: "104", ok: false }]} />);
  // ===== O · 56,1-59,7 · la costra se DISUELVE en 3D, el chorro sale recto; 10 MIN =====
  if (t >= 56.35 && t < 60.05) {
    L.push(<World key="wO" t={t} />);
    const b = screenOf(t, PT.joint);
    L.push(<Tag key="sr" t={t} at={56.4} x={b.x} y={b.y} dx={-320} dy={150} text="SIN RAYAR NADA" col="#7dff9e" out={59.5} size={48} />);
    L.push(<Stopwatch key="sw" t={t} at={57.44} out={59.55} x={1440} y={250} />);
  }
  // ===== P · 59,7-62,3 · lo que ya tiene en la cocina =====
  if (t >= 59.7 && t < 62.65) {
    L.push(<Swipe key="swP" t={t} a={59.7} b={60.05} from={<World t={Math.min(t, 59.7)} />} to={
      <Swipe t={t} a={62.3} b={62.65} dir={-1} from={<Shot k="m_mesa" t={t} a={59.7} z={[1.08, 1.0]} dur={3} />} to={<World t={62.3} />} />} />);
    L.push(<Tag key="co" t={t} at={60.9} x={760} y={480} dx={260} dy={-220} text="YA ESTÁ EN SU COCINA" col={COL.amber} out={62.2} size={48} />);
  }
  // ===== Q · 62,3-68,6 · la maqueta: la piedra escondida bajo el piso → se zambulle hasta el aireador =====
  if (t >= 62.65 && t < 68.9) {
    L.push(<World key="wQ" t={t} />);
    const li = screenOf(t, PT.lime), wa = screenOf(t, PT.water), pp = screenOf(t, PT.pipe);
    L.push(<Tag key="cal" t={t} at={64.7} x={li.x} y={li.y} dx={300} dy={-60} text="PIEDRA CALIZA" col="#f3ecd8" out={66.9} size={44} />);
    L.push(<Tag key="agu" t={t} at={65.3} x={wa.x} y={wa.y} dx={300} dy={110} text="EL AGUA PASA POR AHÍ" col={COL.ice} out={66.9} size={40} />);
    L.push(<Tag key="cañ" t={t} at={65.9} x={pp.x} y={pp.y} dx={-180} dy={-200} text="Y SUBE A SU LLAVE" col={COL.amber} out={66.9} size={40} />);
    const a = screenOf(t, PT.aer);
    L.push(<Tag key="aer" t={t} at={67.72} x={a.x} y={a.y} dx={260} dy={180} text="AQUÍ SE TUERCE" col={COL.red} out={68.8} size={52} />);
  }
  // ===== R · 68,6-74,9 · avatar "el truco de la bolsita" =====
  if (t >= 68.55 && t < 75.3) {
    const r = ei(t, 68.55, 68.9);
    if (r < 1) L.push(<World key="wR" t={68.6} />);
    L.push(<Portal key="pR" x={960} y={480} r={r}>
      <Swipe t={t} a={74.9} b={75.28} from={<Avatar t={t} />} to={<Shot k="e_fibra" t={t} a={74.9} z={[1.0, 1.12]} dur={5} />} />
    </Portal>);
  }
  if (t >= 62.9 && t < 80.2) L.push(<ChipsAt key="chp" t={t} out={79.9} y={t < 68.6 ? 50 : 840} hl={t < 68.6 ? 0 : t < 74.9 ? 1 : 2}
    items={[{ at: 64.42, tx: "LA PIEDRA QUE NO VE" }, { at: 69.78, tx: "LA BOLSITA DEL HOTEL" }, { at: 75.16, tx: "EL ERROR QUE RAYA" }]} />);
  // ===== S · 74,9-80 · la fibra verde raya el cromo para siempre =====
  if (t >= 75.28 && t < 80.4) {
    L.push(<Shot key="fS" k="e_fibra" t={t} a={74.9} z={[1.0, 1.12]} dur={5} />);
    L.push(<DrawX key="xS" t={t} at={76.64} x={620} y={260} w={680} h={420} />);
    L.push(<Tag key="pd" t={t} at={79.02} x={960} y={470} dx={260} dy={-260} text="EL PRIMER DÍA" col={COL.amber} out={80.0} size={46} />);
  }
  // ===== CTA1 · 80-100,8 · vuelo al carrito, la guía se abre en la página 18 REAL =====
  if (t >= 80.0) {
    const k = ei(t, 80.0, 80.4);
    L.push(<AbsoluteFill key="wC" style={{ clipPath: `circle(${k * 1200}px at 960px 540px)` }}><World t={t} /></AbsoluteFill>);
    if (k < 1) L.push(<AbsoluteFill key="fC" style={{ clipPath: `circle(${k * 1200}px at 960px 540px)`, opacity: 0 }} />);
    L.push(<Flash key="flC" t={t} at={80.02} col="#fff1cf" peak={0.55} w={0.3} />);
    const bk = screenOf(t, [PT.book[0], PT.book[1] + 0.04, PT.book[2]]);
    L.push(<Tag key="g1" t={t} at={84.3} x={bk.x} y={bk.y - 40} dx={-300} dy={-160} text="EL FRASCO MARRÓN" sub="DE CLAUDIO · MI GUÍA" col="#ffd08a" out={86.4} size={52} />);
    L.push(<VideoCall key="vc" t={t} at={85.6} out={91.9} x={70} y={250} w={760} />);
    L.push(<BigNum key="p18" t={t} at={86.98} text="PÁG. 18" size={120} x={1560} y={150} out={89.4} col="#ffd60a" edge="#5a4500" />);
    // renglones pintados: el título, "2 tazas", "15 minutos", "si no sale"
    const tz = screenOf(t, pagePt(0.86, 0.481)), mn = screenOf(t, pagePt(0.6, 0.508)), ns = screenOf(t, pagePt(0.49, 0.86));
    L.push(<Tag key="vi" t={t} at={91.88} x={tz.x} y={tz.y} dx={-260} dy={-150} text="CUÁNTO VINAGRE" col="#ffd60a" out={95.5} size={42} />);
    L.push(<Tag key="ti" t={t} at={92.86} x={mn.x} y={mn.y} dx={300} dy={40} text="CUÁNTO TIEMPO" col="#ffd60a" out={95.5} size={42} />);
    L.push(<Tag key="sn" t={t} at={94.64} x={ns.x} y={ns.y} dx={300} dy={-30} text="SI NO SALE" col="#9fd0ff" out={95.6} size={42} />);
    L.push(<Desc key="desc" t={t} at={95.68} out={98.5} />);
  }

  return <AbsoluteFill style={{ background: "#0b0e13" }}>{L}</AbsoluteFill>;
};
void Card3D; void Vid;

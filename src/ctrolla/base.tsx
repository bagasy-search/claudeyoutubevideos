// ctrolla · BASE (piezas del minuto 1 de ctrsarten que se reusan: at(), Shot, Avatar, Line, Stamp, Sticker, Phone, Tablet3D).
// (lo que sigue es el comentario original del minuto 1 de ctrsarten) Un solo hilo, sin cortes secos; todo anclado a la VOZ con at("frase"):
// avatar + pastilla 3D → (la pastilla abre el portal) → cronómetro gigante → llama → la costra de diez años se levanta en el mundo 3D
// → (portal desde la sartén) macro de espuma → teléfono → (la pantalla se abre en el avatar) → humo que tapa todo → arroz/leche/cebolla
// → la perilla se apaga → costra "dura como piedra" → (latigazo) avatar con stickers de noche y media hora → (zoom a través de la tarjeta)
// tallando → al fondo del mueble → cocina de noche "nadie te explicó" → (iris desde la sartén) avatar "7 PASOS" → recorrido por el laboratorio
// (costra · colgador con imán · agua + pastilla · cronómetro · espátula) → avatar con las fichas.
// Audio fuera de Remotion (la voz se mezcla en encfin). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BigNum, COL, Card3D, Chips, DrawX, Flash, FONT, P, Portal, Tag, Vid, e, ei, extrude, s, spr } from "./lib";
import WORDS from "./words.json";
import AVW from "./avwin.json";

// ---------- at("frase"): segundo en que EMPIEZA la frase en la voz (primera aparición después de `desde`) ----------
const nrm = (w: string) => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9ñ]/g, "");
const WN = (WORDS as { w: string; s: number; e: number }[]).map((x) => ({ n: nrm(x.w), s: x.s, e: x.e }));
export const at = (frase: string, desde = 0, fin = false): number => {
  const q = frase.split(/\s+/).map(nrm).filter(Boolean);
  for (let i = 0; i < WN.length - q.length + 1; i++) {
    if (WN[i].s < desde - 0.01) continue;
    let ok = true; for (let k = 0; k < q.length; k++) if (WN[i + k].n !== q[k]) { ok = false; break; }
    if (ok) return fin ? WN[i + q.length - 1].e : WN[i].s;
  }
  throw new Error("at(): no está en la voz → " + frase);
};



// ---------- tomas LTX que ya llegaron (si falta: la foto del primer cuadro con zoom lento) ----------
// clips agnes que llegaron (clips.json = nombres sin extensión en public/ctrolla/clip_<k>.mp4); el que falta va con su foto
import CLIPS from "./clips.json";
export const HAS: Record<string, boolean> = Object.fromEntries((CLIPS as string[]).map((k) => [k, true]));
export const REEL = true;  // true cuando llega el reel del avatar (public/ctrolla/reel0.mp4)

export const Shot: React.FC<{ k: string; t: number; a: number; from?: number; z?: [number, number]; style?: React.CSSProperties }> = ({ k, t, a, from = 0, z = [1.03, 1.11], style }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + 8);
  return <AbsoluteFill style={{ transform: `scale(${sc})`, ...style }}>{HAS[k] ? <Vid id={"clip_" + k} from={from} at={a} /> : <Vid id={"img_" + k} />}</AbsoluteFill>;
};

// ---------- AVATAR: ventanas pagadas (avwin.json), preroll de 10 cuadros ----------
export const WIN = (AVW as { win: { ms: number; me: number; off: number }[] }).win;
export const Avatar: React.FC<{ t: number; blur?: number; dark?: number; edge?: number; style?: React.CSSProperties }> = ({ t, blur = 0, dark = 0, edge = 0, style }) => {
  const face = (
    <>
      {REEL ? WIN.filter((w) => w.me > t - 1 && w.ms < t + 1).map((w) => (
        <Sequence key={w.ms} from={Math.max(0, s(w.ms) - 10)} durationInFrames={s(w.me - w.ms) + 12} layout="none">
          <AbsoluteFill style={{ opacity: t >= w.ms - 0.02 && t < w.me ? 1 : 0 }}>
            <OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - (s(w.ms) >= 10 ? 10 : s(w.ms)))} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </AbsoluteFill>
        </Sequence>
      )) : <Img src={staticFile(P + "av_still.png")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.015 * Math.sin(t * 0.7)})` }} />}
    </>
  );
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000", ...style }}>
      {/* ⛔ el avatar va SIEMPRE nítido: sin blur, sin halo ni borde difuminado (creador, 21-oct). blur/edge quedan sin efecto */}
      <AbsoluteFill style={{ filter: dark > 0 ? `brightness(${1 - dark})` : undefined }}>{face}</AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Tablet3D: React.FC<{ t: number; at: number; x: number; y: number; sc?: number; out?: number }> = ({ t, at, x, y, sc = 1, out = 1e9 }) => {
  const k = spr(t, at, 1.1), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.2));
  if (o <= 0.01) return null;
  const ry = -38 + 30 * Math.sin((t - at) * 0.9), rx = 28 + Math.sin(t * 1.3) * 5, W = 300 * sc, H = 200 * sc, D = 110 * sc;
  const grain = "radial-gradient(rgba(0,0,0,.07) 1px, transparent 1.4px) 0 0/7px 7px, radial-gradient(rgba(255,255,255,.9) 1px, transparent 1.6px) 3px 4px/9px 9px";
  const face = (bg: string, w: number, h: number, tr: string, extra?: React.ReactNode) => <div style={{ position: "absolute", left: -w / 2, top: -h / 2, width: w, height: h, background: bg, transform: tr, borderRadius: 18 * sc, boxShadow: "inset 0 0 30px rgba(0,0,0,.18)", overflow: "hidden" }}>{extra}</div>;
  const top = <div style={{ position: "absolute", inset: 0 }}><div style={{ position: "absolute", left: 0, right: 0, top: "58%", bottom: 0, background: "linear-gradient(180deg,#2f7fe0,#1b56a8)" }} /><div style={{ position: "absolute", left: "38%", top: "26%", width: "24%", height: "38%", borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#ff7b6b,#d0231a)", boxShadow: "0 4px 10px rgba(0,0,0,.35)" }} /></div>;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1400, transform: `scale(${Math.min(1.06, k)})` }}>
      <div style={{ position: "absolute", transformStyle: "preserve-3d", transform: `rotateX(${rx}deg) rotateY(${ry}deg)` }}>
        {face(`${grain}, linear-gradient(135deg,#ffffff,#dfe3e7)`, W, H, `translateZ(${D / 2}px)`, top)}
        {face("#e9ecef", W, H, `rotateY(180deg) translateZ(${D / 2}px)`)}
        {face(`${grain}, linear-gradient(180deg,#e9edf0 58%,#2a72cf 58%)`, D, H, `rotateY(90deg) translateZ(${W / 2}px)`)}
        {face(`${grain}, linear-gradient(180deg,#d9dee3 58%,#1f5fb3 58%)`, D, H, `rotateY(-90deg) translateZ(${W / 2}px)`)}
        {face(`${grain}, #f7f8f9`, W, D, `rotateX(90deg) translateZ(${H / 2}px)`)}
        {face("#1b56a8", W, D, `rotateX(-90deg) translateZ(${H / 2}px)`)}
      </div>
      <div style={{ position: "absolute", left: -W * 0.7, top: -H * 0.9, width: W * 1.4, height: H * 1.8, background: "radial-gradient(circle, rgba(140,200,255,.35), transparent 65%)", mixBlendMode: "screen", pointerEvents: "none" }} />
    </div>
  );
};

// cartel que se escribe solo (frase grande con subrayado que se dibuja)
export const Line: React.FC<{ t: number; at: number; out: number; text: string; y?: number; size?: number; col?: string }> = ({ t, at, out, text, y = 150, size = 84, col = COL.ink }) => {
  const o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.2));
  if (o <= 0.01) return null;
  const n = Math.round(text.length * e(t, at, at + 0.45));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: o, fontFamily: FONT, fontWeight: 900, fontSize: size, letterSpacing: 4, color: col, textShadow: extrude(8, "rgba(0,0,0,.6)") }}>
      {text.slice(0, n)}<span style={{ opacity: 0 }}>{text.slice(n)}</span>
      <div style={{ margin: "6px auto 0", height: 8, width: `${60 * e(t, at + 0.3, at + 0.7)}%`, borderRadius: 4, background: COL.amber, boxShadow: `0 0 18px ${COL.amber}` }} />
    </div>
  );
};

// teléfono 3D con notificaciones que se apilan (sobre el avatar: "se te fue la cabeza con el teléfono")
export const Phone: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const k = spr(t, at, 1), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const notes = ["Mensaje nuevo", "3 videos para ti", "Grupo familia (12)", "¡Oferta!"];
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1200px) rotateY(${(1 - Math.min(1, k)) * 70 - 16}deg) rotateX(8deg) rotateZ(${Math.sin(t * 1.1) * 2}deg)` }}>
      <div style={{ width: 300, height: 600, borderRadius: 46, background: "#0c0d10", padding: 14, boxShadow: "0 50px 90px rgba(0,0,0,.7), inset 0 0 0 3px #2a2c31, 18px 0 0 -6px #1a1b1f" }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 34, background: "linear-gradient(160deg,#3b4a7a,#141a2e)", overflow: "hidden", position: "relative" }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, color: "#fff", fontSize: 64, textAlign: "center", marginTop: 50 }}>12:47</div>
          {notes.map((n, i) => {
            const a = at + 0.35 + i * 0.32, kk = spr(t, a, 1.2);
            return <div key={i} style={{ position: "absolute", left: 14, right: 14, top: 170 + i * 92, opacity: e(t, a, a + 0.08), transform: `translateY(${(1 - Math.min(1, kk)) * -40}px) scale(${0.9 + 0.1 * Math.min(1, kk)})`, borderRadius: 18, background: "rgba(255,255,255,.88)", padding: "14px 16px", fontFamily: FONT, fontWeight: 800, fontSize: 22, color: "#1b1e26", boxShadow: "0 8px 18px rgba(0,0,0,.35)" }}>{n}</div>;
          })}
        </div>
      </div>
    </div>
  );
};

// humo que sube y TAPA todo (transición avatar → quemado)
export const SmokeWipe: React.FC<{ t: number; a: number; b: number; c: number }> = ({ t, a, b, c }) => {
  const up = e(t, a, b), out = e(t, b + 0.1, c);
  if (up <= 0.01 || out >= 0.99) return null;
  return (
    <AbsoluteFill style={{ opacity: 1 - out, pointerEvents: "none" }}>
      {Array.from({ length: 14 }, (_, i) => {
        const x = (i / 13) * 2100 - 90 + Math.sin(i * 7.3) * 60, sz = 520 + (i % 4) * 140;
        const y = 1200 - up * (1100 + (i % 3) * 260) + Math.sin(t * 1.4 + i) * 30;
        return <div key={i} style={{ position: "absolute", left: x - sz / 2, top: y - sz / 2, width: sz, height: sz, borderRadius: "50%", background: "radial-gradient(circle, rgba(70,66,62,.95) 0%, rgba(55,52,50,.7) 40%, transparent 70%)", filter: "blur(28px)", transform: `rotate(${t * 20 + i * 30}deg)` }} />;
      })}
    </AbsoluteFill>
  );
};

// sticker 3D brillante con icono dibujado (luna / reloj de 30 min / dedos)
export const Sticker: React.FC<{ t: number; at: number; out: number; x: number; y: number; icon: "luna" | "reloj"; text: string; col: string }> = ({ t, at, out, x, y, icon, text, col }) => {
  const k = spr(t, at, 1.1), o = e(t, at, at + 0.08) * (1 - e(t, out, out + 0.2));
  if (o <= 0.01) return null;
  const sweep = ((t - at) * 0.7) % 1;
  const ic = icon === "luna"
    ? <svg width={110} height={110}><circle cx={55} cy={55} r={40} fill="#ffe7a3" /><circle cx={74} cy={44} r={36} fill="#22305a" /></svg>
    : <svg width={110} height={110}><circle cx={55} cy={55} r={44} fill="#fff" stroke="#22252b" strokeWidth={6} /><path d={`M55 55 L55 15 A40 40 0 ${e(t, at + 0.2, at + 1.6) > 0.5 ? 1 : 0} 1 ${55 + 40 * Math.sin(e(t, at + 0.2, at + 1.6) * Math.PI)} ${55 - 40 * Math.cos(e(t, at + 0.2, at + 1.6) * Math.PI)} Z`} fill={COL.amber} /><line x1={55} y1={55} x2={55 + 34 * Math.sin(e(t, at + 0.2, at + 1.6) * Math.PI)} y2={55 - 34 * Math.cos(e(t, at + 0.2, at + 1.6) * Math.PI)} stroke="#22252b" strokeWidth={6} strokeLinecap="round" /></svg>;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1000px) rotateY(${(1 - Math.min(1, k)) * -80 + Math.sin(t) * 6}deg) rotateZ(-4deg) scale(${Math.min(1.05, k)})` }}>
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 20, padding: "18px 34px 18px 22px", borderRadius: 40, background: `linear-gradient(160deg, ${col}, #1a2236)`, border: "5px solid #fff", boxShadow: "0 30px 60px rgba(0,0,0,.6), 0 10px 0 #c9cfd8", overflow: "hidden" }}>
        {ic}
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 58, color: "#fff", textShadow: extrude(5, "rgba(0,0,0,.5)"), whiteSpace: "nowrap" }}>{text}</div>
        <div style={{ position: "absolute", top: 0, bottom: 0, width: 90, left: `${-20 + sweep * 140}%`, background: "linear-gradient(90deg, transparent, rgba(255,255,255,.45), transparent)", transform: "skewX(-20deg)" }} />
      </div>
    </div>
  );
};

// sello rojo que cae girando
export const Stamp: React.FC<{ t: number; at: number; text: string; x: number; y: number; out?: number; rot?: number; size?: number }> = ({ t, at, text, x, y, out = 1e9, rot = -9, size = 110 }) => {
  const k = spr(t, at, 1.3), o = e(t, at, at + 0.06) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.4 - 1.4 * Math.min(1, k)})` }}>
      <div style={{ border: `10px solid ${COL.red}`, borderRadius: 14, padding: "6px 30px", fontFamily: FONT, fontWeight: 900, fontSize: size, color: COL.red, letterSpacing: 4, background: "rgba(20,0,0,.25)", boxShadow: "0 0 30px rgba(255,60,40,.45)", textShadow: "0 4px 10px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>{text}</div>
    </div>
  );
};

// número de paso que sale del objeto 3D (recorrido del laboratorio)

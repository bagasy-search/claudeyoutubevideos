// fb5nb · BASE: at("frase") anclado a la voz · avatar (ventanas pagadas, corte seco) · Veo y fotos Nano Banana con
// Ken Burns sorteado por plano · Stage (el escenario de cada componente) · Lbl (rótulo ≤5 palabras con resorte).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile } from "remotion";
import { C, FONT, P, e, hash, idn, s, spr, shadowTxt } from "./lib";
import WORDS from "./words.json";
import AVW from "./avwin.json";
import MEDIA from "./media.json";

const nrm = (w: string) => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9ñ]/g, "");
const WN = (WORDS as { w: string; s: number; e: number }[]).map((x) => ({ n: nrm(x.w), s: x.s, e: x.e }));
export const END_VOZ = WN[WN.length - 1].e;
// segundo en que EMPIEZA la frase (primera aparición desde `desde`); fin = segundo en que TERMINA
export const at = (frase: string, desde = 0, fin = false): number => {
  const q = frase.split(/\s+/).map(nrm).filter(Boolean);
  for (let i = 0; i < WN.length - q.length + 1; i++) {
    if (WN[i].s < desde - 0.01) continue;
    let ok = true; for (let k = 0; k < q.length; k++) if (WN[i + k].n !== q[k]) { ok = false; break; }
    if (ok) return fin ? WN[i + q.length - 1].e : WN[i].s;
  }
  throw new Error("at(): no está en la voz → " + frase);
};

// ---------- medios que llegaron (media.json: {v: ids Veo, i: ids foto, reel: bool}) ----------
const M = MEDIA as { v: string[]; i: string[]; reel: boolean; mix: boolean };
export const HAS_V = new Set(M.v), HAS_I = new Set(M.i);
export const REEL = M.reel, MIX = M.mix;

// la estrellita de Nano Banana (93 %, 87 % del cuadro): zoom 1,11 anclado al borde izquierdo la deja fuera
const SinEstrella: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <AbsoluteFill style={{ transform: "scale(1.11)", transformOrigin: `0% ${Math.round(100 * hash(idn(id), 10))}%` }}>{children}</AbsoluteFill>
  </AbsoluteFill>
);

// Ken Burns por plano: sentido, velocidad, foco, ángulo y ESTILO sorteados (deriva · paneo · golpe · frena)
export const kbOf = (id: string, dur: number) => {
  const n = idn(id), out = hash(n, 1) < 0.5, rate = 0.018 + 0.022 * hash(n, 2), amp = Math.min(0.2, rate * dur);
  const ang = 2 * Math.PI * hash(n, 5), st = hash(n, 6), c = hash(n, 8);
  const estilo = st < 0.5 ? "deriva" : st < 0.7 ? "paneo" : st < 0.85 && dur >= 3.5 ? "golpe" : "frena";
  return { out, amp, ox: 35 + 30 * hash(n, 3), oy: 35 + 30 * hash(n, 4), px: 2 * Math.cos(ang), py: 1.2 * Math.sin(ang), estilo, curva: c < 0.4 ? 0 : c < 0.75 ? 1 : 2, tg: 0.35 + 0.3 * hash(n, 9) };
};
const cl01 = (x: number) => Math.min(1, Math.max(0, x));
const ease = (u: number, c: number) => (c === 1 ? 1 - Math.pow(1 - u, 3) : c === 2 ? 0.5 - 0.5 * Math.cos(Math.PI * u) : u);
const kbStyle = (id: string, t: number, a: number, dur: number, half = false): React.CSSProperties => {
  const kb = kbOf(id, dur), u = cl01((t - a) / dur), amp = half ? kb.amp * 0.5 : kb.amp;
  let z: number, tx: number, ty: number, ox = kb.ox, oy = kb.oy;
  if (kb.estilo === "paneo") {
    const k = 2 * (kb.out ? 1 - ease(u, kb.curva) : ease(u, kb.curva)) - 1;
    z = 1.14; tx = 1.75 * kb.px * k; ty = 1.67 * kb.py * k; ox = 50; oy = 50;
  } else if (kb.estilo === "golpe") {
    const g = 1 - Math.pow(1 - cl01((t - a - kb.tg * dur) / 0.3), 3);
    z = 1.06 + 0.4 * amp * u + 0.09 * g; tx = 0.5 * kb.px * u; ty = 0.5 * kb.py * u;
  } else {
    const ee = kb.estilo === "frena" ? 1 - Math.pow(1 - u, 3) : ease(u, kb.curva), k = kb.out ? 1 - ee : ee;
    z = 1.06 + amp * k; tx = kb.px * k; ty = kb.py * k;
  }
  return { transform: `translate(${tx}%, ${ty}%) scale(${z})`, transformOrigin: `${ox}% ${oy}%` };
};

// foto Nano Banana a cuadro completo
export const Foto: React.FC<{ id: string; t: number; a: number; dur: number }> = ({ id, t, a, dur }) => (
  <SinEstrella id={id}>
    <AbsoluteFill style={kbStyle(id, t, a, dur)}>
      <Img src={staticFile(P + "img/" + id + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
  </SinEstrella>
);
// clip Veo a cuadro completo (arranca en su cuadro 0 en `a`; el audio va en la mezcla maestra) con media deriva
export const Clip: React.FC<{ id: string; t: number; a: number; dur: number; rate?: number }> = ({ id, t, a, dur, rate = 1 }) => (
  <SinEstrella id={id}>
    <AbsoluteFill style={kbStyle(id, t, a, dur, true)}>
      <Sequence from={s(a)} layout="none">
        <OffthreadVideo src={staticFile(P + "v/" + id + ".mp4")} playbackRate={rate} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </Sequence>
    </AbsoluteFill>
  </SinEstrella>
);
// fondo de un componente: el plano (Veo o foto) del momento, quieto y lejos
export const Fondo: React.FC<{ id?: string; a: number }> = ({ id, a }) => {
  if (!id) return null;
  if (HAS_V.has(id)) return <Sequence from={s(a - 0.5)} layout="none"><OffthreadVideo src={staticFile(P + "v/" + id + ".mp4")} playbackRate={0.6} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence>;
  if (HAS_I.has(id)) return <Img src={staticFile(P + "img/" + id + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return null;
};

// ---------- AVATAR: ventanas pagadas, corte seco, imagen entera y nítida ----------
export const WIN = (AVW as { win: { ms: number; me: number; off: number }[] }).win;
export const Avatar: React.FC<{ t: number }> = ({ t }) => {
  const w = WIN.find((x) => t >= x.ms - 0.02 && t < x.me + 0.02);
  if (!REEL || !w) return <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return (
    <Sequence from={s(w.ms)} durationInFrames={Math.max(1, s(w.me - w.ms) + 1)} layout="none">
      <OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={s(w.off)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </Sequence>
  );
};

// ---------- ESCENARIO de cada componente: el plano del momento hundido en sombra tibia, piso de vidrio, halo de sol ----------
// CÁMARA de cada componente: mesa vista desde arriba que gira despacio en curva (nunca lineal) y se acerca;
// sentido y ángulos sorteados por componente. Un solo transform con perspective() (preserve-3d parpadea en el farm).
export const camOf = (t: number, a: number, b: number): React.CSSProperties => {
  const n = Math.round(a * 100), d = Math.max(1, b - a), u = Math.min(1, Math.max(0, (t - a) / d));
  const k = 0.5 - 0.5 * Math.cos(Math.PI * u), dir = hash(n, 21) < 0.5 ? -1 : 1;
  const ry = dir * (5 + 3 * hash(n, 22)) * (2 * k - 1), rx = 7 + 3 * hash(n, 23) - 4 * Math.sin(Math.PI * u);
  const z = 1.0 + 0.06 * k + 0.05 * (1 - e(t, a, a + 0.9)) * -1;
  return { transform: `perspective(2200px) rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg) scale(${z.toFixed(4)})`, transformOrigin: "50% 60%" };
};
export const BgCtx = React.createContext<string | undefined>(undefined);
export const Stage: React.FC<{ t: number; a: number; b: number; heat?: number; children?: React.ReactNode }> = ({ t, a, b, heat = 0, children }) => {
  const bg = React.useContext(BgCtx);
  const sink = e(t, a - 0.05, a + 0.6), out = e(t, b - 0.3, b);
  const halo = heat > 0 ? `rgba(124,200,255,${0.2 * heat})` : "rgba(255,195,90,.18)";
  return (
    <AbsoluteFill style={{ background: C.night, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${1.18 - 0.06 * sink}) translateX(${-(t - a) * 6}px)`, filter: `blur(${3 + 9 * sink}px) brightness(${1 - 0.55 * sink}) saturate(${1 - 0.5 * sink}) sepia(${0.25 * sink})` }}>
        <Fondo id={bg} a={a} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(70% 60% at 50% 46%, ${halo} 0%, rgba(21,17,11,.0) 55%), linear-gradient(180deg, rgba(21,17,11,.25) 0%, rgba(21,17,11,.0) 40%, rgba(21,17,11,.78) 100%)`, opacity: sink }} />
      {/* piso de vidrio: reflejo y línea de horizonte */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 820, height: 2, background: "linear-gradient(90deg, transparent, rgba(255,236,200,.35), transparent)", opacity: sink }} />
      <AbsoluteFill style={{ opacity: 1 - out, transform: `translateY(${out * 40}px) scale(${1 - 0.04 * out})` }}>
        <AbsoluteFill style={camOf(t, a, b)}>{children}</AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// rótulo (≤5 palabras): entra con resorte desde abajo y gira apenas; jamás arriba a la izquierda
export const Lbl: React.FC<{ t: number; at: number; out?: number; text: string; x: number; y: number; size?: number; col?: string; align?: "center" | "left" | "right"; k?: number; plate?: string }> = ({ t, at: a, out = 1e9, text, x, y, size = 74, col = C.ink, align = "center", k = 1, plate }) => {
  const p = spr(t, a, k), o = Math.min(1, Math.max(0, (t - a) * 8)) * (1 - e(t, out, out + 0.22));
  if (o <= 0.01) return null;
  const tx = align === "center" ? "-50%" : align === "right" ? "-100%" : "0";
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(${tx},-50%) translateY(${(1 - p) * 60}px) rotate(${(1 - p) * -4}deg) scale(${0.8 + 0.2 * p})`, fontFamily: FONT, fontWeight: 800, fontSize: size, color: col, whiteSpace: "nowrap", letterSpacing: 1, textTransform: "uppercase", textShadow: plate ? undefined : shadowTxt, background: plate, padding: plate ? "6px 22px 2px" : undefined, borderRadius: plate ? 10 : undefined }}>{text}</div>
  );
};

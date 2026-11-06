// ola1_C · EL VIDEO ENTERO (kit común Ray / Lenny). Base = foto Nano Banana del tramo (Ken Burns 1,8-4 %/s, sentido al azar
// por plano, dentro de scale 1,11 anclado arriba-izquierda: la estrellita de abajo-derecha queda afuera) o Veo del presentador.
// El avatar entra y sale con CORTE SECO. Un componente único por toma C (heroes.tsx), anclado a su frase (armar.py → plan.json).
// Audio fuera de Remotion (encfin). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import PLAN from "./plan.json";
import LTXOK from "./ltx_ok.json";
import CFG from "./cfg.json";
import { Avatar, Desc, WIN } from "./parts";
import { COL, FONT, LowerThird, P, e, extrude, s } from "./lib";
import { CamaraMano } from "./CamaraMano";
import { HEROES } from "./heroes";

type Seg = [number, number, string, string];
type Ov = { k: string; at: number; out: number; [x: string]: any };
type Cta = { at: number; desc: number; end: number };
const PL = PLAN as unknown as { segs: Seg[]; ov: Ov[]; cta: Cta[]; end: number; txt: { lower: [number, number] } };
const CF = CFG as { name: string; l2: string; guide: string; line: string; covers: string[]; qr?: boolean };
export const END = PL.end;
const OK = new Set(LTXOK as string[]);
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

// ---------------- base ----------------
const Star: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ overflow: "hidden" }}><AbsoluteFill style={{ transform: "scale(1.11)", transformOrigin: "0% 0%" }}>{children}</AbsoluteFill></AbsoluteFill>
);
const Photo: React.FC<{ id: string; t: number; a: number; b: number; k: number }> = ({ id, t, a, b, k }) => {
  // Ken Burns: velocidad 1,8-4 %/s y punto de fuga al azar por plano; acerca o aleja (nunca lineal: arranca y frena suave)
  const rate = 0.018 + 0.022 * rnd(k, 3), d = Math.max(0.5, b - a), amt = Math.min(0.2, rate * d);
  const q = e(t, a - 0.2, b + 0.4), zin = rnd(k, 5) > 0.42, z = zin ? 1 + amt * q : 1 + amt * (1 - q);
  const ox = 15 + 70 * rnd(k, 7), oy = 15 + 70 * rnd(k, 9);
  return <Star><AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${ox}% ${oy}%` }}>
    <Img src={staticFile(P + "img_" + id + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </AbsoluteFill></Star>;
};
const Veo: React.FC<{ id: string; t: number; a: number; b: number }> = ({ id, t, a, b }) => (
  <Star><AbsoluteFill style={{ transform: `scale(${1.0 + 0.035 * e(t, a, b + 1)})` }}>
    <Sequence from={s(a)} layout="none"><OffthreadVideo src={staticFile(P + "veo/" + id + ".mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence>
  </AbsoluteFill></Star>
);
// tramo sin medio (Veo que no pasó / toma C mientras entra el componente): la foto más cercana, desenfocada
const fotoCerca = (t: number) => { let best = "", d = 1e9; for (const [a, b, kind, id] of PL.segs) if (kind === "shot") { const x = t < a ? a - t : t > b ? t - b : 0; if (x < d) { d = x; best = id; } } return best; };
const Blur: React.FC<{ t: number }> = ({ t }) => { const id = fotoCerca(t); return id ? <AbsoluteFill><Img src={staticFile(P + "img_" + id + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(18px) brightness(.55)", transform: "scale(1.15)" }} /></AbsoluteFill> : null; };
const base = (t: number): React.ReactNode => {
  const i = PL.segs.findIndex(([a, b]) => t >= a && t < b);
  if (i < 0) return <Blur t={t} />;
  const [a, b, kind, id] = PL.segs[i];
  if (kind === "veo") return OK.has(id) ? <Veo id={id} t={t} a={a} b={b} /> : <Blur t={t} />;
  if (kind === "shot") return <Photo id={id} t={t} a={a} b={b} k={i} />;
  return <Blur t={t} />;
};
const avNow = (t: number) => WIN.some((w) => t >= w.ms && t < w.me);

// ---------------- CTA: tapa(s) de la guía + la descripción con el renglón 1 marcado (nunca la URL en pantalla) ----------------
const Covers: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const k = e(t, at, at + 0.6) * (1 - e(t, out, out + 0.4));
  if (k <= 0.01) return null;
  const n = CF.covers.length;
  return <AbsoluteFill style={{ perspective: 1800, opacity: k }}>
    {CF.covers.map((c, i) => { const j = i - (n - 1) / 2, p = e(t, at + 0.12 * i, at + 0.7 + 0.12 * i);
      return <Img key={c} src={staticFile(P + c + ".jpg")} style={{ position: "absolute", left: 1380 - 160 + j * 120 * p, top: 200 + Math.abs(j) * 18, width: 320, height: 452, objectFit: "cover", borderRadius: 8,
        boxShadow: "-10px 0 0 #c9c2b2, 0 50px 90px rgba(0,0,0,.7)", transform: `rotateY(${-16 - j * 6 * p + 3 * Math.sin(t * 0.8)}deg) rotateZ(${j * 2.5 * p}deg) translateY(${(1 - p) * 80}px)` }} />; })}
    <div style={{ position: "absolute", left: 1380, top: 720, transform: "translateX(-50%)", fontFamily: FONT, fontWeight: 900, fontSize: 44, color: "#ffd60a", textShadow: extrude(4, "#5a4500"), whiteSpace: "nowrap", opacity: e(t, at + 0.5, at + 0.9) }}>{CF.guide}</div>
  </AbsoluteFill>;
};
const CTA: React.FC<{ t: number; c: Cta }> = ({ t, c }) => <>
  <Covers t={t} at={c.at} out={c.desc - 0.1} />
  <Desc t={t} at={c.desc} out={c.end} x={CF.qr ? 760 : 960} line={CF.line} />
  {CF.qr && <QR t={t} at={c.desc + 0.2} out={c.end} />}
</>;
const QR: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const k = e(t, at, at + 0.45) * (1 - e(t, out, out + 0.35));
  if (k <= 0.01) return null;
  return <div style={{ position: "absolute", right: 120, top: 250, opacity: k, transform: `translateY(${(1 - k) * 40}px)`, fontFamily: FONT, textAlign: "center" }}>
    <div style={{ padding: 22, background: "#fff", borderRadius: 22, boxShadow: "0 40px 90px rgba(0,0,0,.6)" }}><Img src={staticFile(P + "qr.png")} style={{ width: 380, height: 380, display: "block", imageRendering: "pixelated" }} /></div>
    <div style={{ marginTop: 18, fontWeight: 900, fontSize: 36, color: "#ffd60a", textShadow: extrude(4, "#5a4500") }}>{CF.guide}</div>
  </div>;
};

// ---------------- componentes únicos: sólo fuera del avatar; se congelan mientras él habla y siguen al volver ----------------
const OV = PL.ov.map((o) => ({ ...o, bg: o.bg ?? fotoCerca(o.at) }));
const avIn = (a: number, b: number) => WIN.reduce((s0, w) => s0 + Math.max(0, Math.min(b, w.me) - Math.max(a, w.ms)), 0);
const OVX = OV.map((o, i) => { const lim = (OV[i + 1]?.at ?? 1e9) - 0.6; let end = o.out; for (let k = 0; k < 4; k++) end = Math.min(lim, o.out + avIn(o.at, end)); return { ...o, out: end }; });
const Heroes: React.FC<{ t: number }> = ({ t }) => <>{OVX.map((o, i) => {
  const C = HEROES[o.k];
  if (!C || t < o.at - 0.1 || t > o.out + 0.9 || avNow(t)) return null;
  return <C key={i} t={t - avIn(o.at, t)} h={o} />;
})}</>;

export const Body: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const fade = e(t, END - 1.4, END - 0.1);
  return <AbsoluteFill style={{ background: "#000" }}>
    <CamaraMano intensidad={0.8}>{avNow(t) ? <Avatar t={t} /> : <>{base(t)}</>}</CamaraMano>
    {!avNow(t) && <Heroes t={t} />}
    <LowerThird t={t} at={PL.txt.lower[0]} out={PL.txt.lower[1]} name={CF.name} l2={CF.l2} l2at={PL.txt.lower[0] + 1} />
    {PL.cta.map((c, i) => <CTA key={i} t={t} c={c} />)}
    <AbsoluteFill style={{ background: "#000", opacity: fade }} />
  </AbsoluteFill>;
};

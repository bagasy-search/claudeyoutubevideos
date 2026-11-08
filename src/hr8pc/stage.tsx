// stage.tsx · escenario común de los componentes de Rosa: la foto de ese momento se hunde y desenfoca, piso cálido con charco de luz,
// haz que respira, motas de polvo y cámara en curva. Todo sale de t (sin estado entre cuadros).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { FONT, e, ei, spr } from "./lib";
import { MANO, SERIF } from "./funerario";
export { FONT, MANO, SERIF, e, ei, spr };

export const INK = "#fbf4e6", PAPER = "#f4ead6", PAPER2 = "#e6d8bd", TINTA = "#2b2a3a", LILA = "#b49ad8", ORO = "#f0c24b", ROJO = "#c23a2e", WOOD = "#7a4f2b", WOOD2 = "#4a2e18", BRASS = "#c9a24b";
export type P = { t: number; a: number; b: number; src?: string; [k: string]: any }; // eslint-disable-line @typescript-eslint/no-explicit-any

export const cl = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
// resorte con peso que llega, se pasa y asienta (0→1, sin topes)
export const sp = (t: number, a: number, k = 1) => { const x = (t - a) * 5.2 * k; return x <= 0 ? 0 : 1 - Math.exp(-x * 0.9) * Math.cos(x * 1.75); };
export const rnd = (i: number, s = 1) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };

const Motes: React.FC<{ t: number; n?: number; col?: string }> = ({ t, n = 14, col = "255,232,190" }) => (
  <>{Array.from({ length: n }, (_, i) => {
    const x = rnd(i, 1) * 1920 + Math.sin(t * (0.13 + rnd(i, 2) * 0.2) + i) * 60, y = (rnd(i, 3) * 1180 - t * (6 + rnd(i, 4) * 14)) % 1180, r = 2 + rnd(i, 5) * 5;
    const yy = y < -60 ? y + 1180 : y, o = 0.18 + 0.4 * (0.5 + 0.5 * Math.sin(t * 0.9 + i * 2));
    return <div key={i} style={{ position: "absolute", left: x, top: yy, width: r * 2, height: r * 2, borderRadius: "50%", background: `rgba(${col},${o})`, filter: `blur(${r > 5 ? 2.5 : 1}px)` }} />;
  })}</>
);

export const Stage: React.FC<{ t: number; a: number; b: number; src: string; floor?: number; beamX?: number; night?: boolean; children: React.ReactNode }> = ({ t, a, b, src, floor = 760, beamX = 620, night, children }) => {
  const inn = ei(t, a - 0.42, a + 0.06), out = 1 - ei(t, b - 0.6, b - 0.16);
  if (out <= 0.001 || inn <= 0.001) return null;
  const q = t - a, dx = Math.sin(q * 0.37) * 14 + Math.sin(q * 0.17 + 1) * 8, dy = Math.cos(q * 0.29) * 9, z = 1 + 0.045 * e(t, a, Math.max(b, a + 8));
  const beam = 0.5 + 0.13 * Math.sin(q * 0.8);
  return (
    <AbsoluteFill style={{ opacity: out, overflow: "hidden", pointerEvents: "none" }}>
      <AbsoluteFill style={{ opacity: inn }}>
        <Img src={staticFile(src)} style={{ position: "absolute", left: -120, top: -80, width: 2160, height: 1240, objectFit: "cover", filter: `blur(26px) brightness(${night ? 0.34 : 0.55})`, transform: `translate(${-dx * 0.6}px, ${-dy * 0.6}px) scale(${1.03 + 0.05 * e(t, a, b)})` }} />
        <AbsoluteFill style={{ background: night ? "rgba(8,10,28,.45)" : "rgba(28,16,6,.22)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: floor, bottom: 0, background: "linear-gradient(180deg, rgba(58,36,18,.0), rgba(50,31,16,.78) 22%, rgba(24,14,7,.94))" }} />
        <div style={{ position: "absolute", left: 960 - 760, top: floor - 20, width: 1520, height: 360, background: "radial-gradient(ellipse at 50% 42%, rgba(255,214,150,.42), rgba(255,200,130,0) 68%)" }} />
        <div style={{ position: "absolute", left: beamX - 420, top: -160, width: 840, height: 1320, background: `linear-gradient(180deg, rgba(255,226,170,${beam * 0.5}), rgba(255,226,170,0) 88%)`, clipPath: "polygon(40% 0, 60% 0, 100% 100%, 0 100%)", mixBlendMode: "screen", filter: "blur(14px)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ transform: `translate(${dx}px, ${dy + (1 - inn) * 26}px) scale(${z * (0.96 + 0.04 * inn)})`, opacity: e(t, a - 0.06, a + 0.16), filter: out < 0.98 ? `blur(${(1 - out) * 9}px)` : undefined }}>{children}</AbsoluteFill>
      <AbsoluteFill style={{ opacity: inn }}><Motes t={t} col={night ? "190,205,255" : undefined} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

// objeto que llega con peso desde arriba/atrás: se pasa, asienta y la sombra se aprieta al apoyarse
export const Drop: React.FC<{ t: number; at: number; x: number; y: number; w: number; h: number; rot?: number; from?: number; shadow?: boolean; children: React.ReactNode; z?: number }> = ({ t, at, x, y, w, h, rot = 0, from = -420, shadow = true, children, z }) => {
  const k = sp(t, at), o = e(t, at - 0.02, at + 0.12);
  if (o <= 0.003) return null;
  const up = (1 - k) * from, gap = cl(Math.abs(1 - k) * 2.2);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: o, zIndex: z }}>
      {shadow ? <div style={{ position: "absolute", left: -w * 0.06 - gap * 34, top: h - 16 + gap * 26, width: w * 1.12 + gap * 68, height: 42 + gap * 16, borderRadius: "50%", background: "rgba(0,0,0,.55)", filter: `blur(${10 + gap * 22}px)`, opacity: 0.85 - gap * 0.5 }} /> : null}
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${up}px) rotate(${rot + (1 - k) * 11}deg) perspective(1400px) rotateX(${(1 - k) * -24}deg)`, transformOrigin: "50% 100%" }}>{children}</div>
    </div>
  );
};

export const Label: React.FC<{ tx: string; size?: number; col?: string; font?: string; w?: number; style?: React.CSSProperties }> = ({ tx, size = 66, col = INK, font = FONT, w, style }) => (
  <div style={{ fontFamily: font, fontWeight: font === MANO ? 700 : 900, fontSize: size, color: col, lineHeight: 1.08, textAlign: "center", width: w, ...style }}>{tx}</div>
);
// rótulo grande que entra de a una palabra, siempre desde el objeto (abajo) y con sombra propia
export const Say: React.FC<{ t: number; at: number; tx: string; x?: number; y?: number; size?: number; col?: string; font?: string; w?: number }> = ({ t, at, tx, x = 960, y = 900, size = 82, col = INK, font = FONT, w = 1500 }) => {
  const ws = tx.split(" ");
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: `0 ${size * 0.28}px` }}>
      {ws.map((p, i) => { const k = sp(t, at + i * 0.11); return <span key={i} style={{ fontFamily: font, fontWeight: font === MANO ? 700 : 900, fontSize: size, color: col, lineHeight: 1.12, opacity: e(t, at + i * 0.11, at + i * 0.11 + 0.14), transform: `translateY(${(1 - k) * 46}px) rotate(${(1 - k) * 4}deg)`, textShadow: "0 3px 0 rgba(0,0,0,.35), 0 10px 30px rgba(0,0,0,.65)" }}>{p}</span>; })}
    </div>
  );
};
export const papel = (c1 = PAPER, c2 = PAPER2): React.CSSProperties => ({ background: `linear-gradient(160deg, ${c1}, ${c2})`, boxShadow: "inset 0 0 0 1px rgba(90,60,30,.18), inset 0 -14px 26px rgba(120,84,40,.14)" });
export const madera = (c1 = WOOD, c2 = WOOD2): React.CSSProperties => ({ background: `repeating-linear-gradient(92deg, rgba(255,220,170,.05) 0 7px, rgba(0,0,0,.07) 7px 11px, rgba(255,220,170,.03) 11px 23px), linear-gradient(170deg, ${c1}, ${c2})`, boxShadow: "inset 0 2px 0 rgba(255,225,180,.35), inset 0 -12px 22px rgba(0,0,0,.4)" });
export const laton = (): React.CSSProperties => ({ background: "linear-gradient(135deg,#f4dc97,#b98d35 42%,#7a5a1e 58%,#e6c877)", boxShadow: "inset 0 1px 0 rgba(255,255,255,.7), inset 0 -2px 3px rgba(0,0,0,.4)" });

export const T = (p: P, k: string, d: number) => Math.min(Math.max(typeof p[k] === "number" ? p[k] : p.a + d, p.a + 0.2), p.b - 1.0);
export const abs = (x: number, y: number, w: number, h: number): React.CSSProperties => ({ position: "absolute", left: x, top: y, width: w, height: h });
export const center: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" };
export const glow = (c: string, r = 30) => `0 0 ${r}px ${c}, 0 0 ${r * 2.4}px ${c}`;
export const piedra = (c1: string, c2: string): React.CSSProperties => ({ background: `repeating-linear-gradient(8deg, rgba(255,240,210,.05) 0 3px, rgba(0,0,0,.07) 3px 9px, rgba(255,240,210,.03) 9px 17px), repeating-linear-gradient(97deg, rgba(0,0,0,.05) 0 5px, rgba(255,240,210,.04) 5px 13px), linear-gradient(175deg, ${c1}, ${c2})`, boxShadow: "inset 0 3px 0 rgba(255,235,200,.3), inset 0 -10px 18px rgba(0,0,0,.35)" });

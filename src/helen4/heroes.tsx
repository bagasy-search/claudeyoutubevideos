// helen4 · componentes PROPIOS (porotos + garrón ahumado de 2 dólares). PURO CSS: cero imágenes adentro.
// Capas de cada uno: material del oficio dibujado con gradientes (madera de tajo, papel kraft, papel de carnicería, pizarra,
// acero cepillado, corcho, azulejo de bloque) → luz/sombra → objeto principal dibujado (garrón, olla, porotos, etiqueta) → datos → acento animado.
// Fuentes (2): Alfa Slab One (cartel de almacén) + Kalam (letra a mano / tiza). Paleta del local: azul delantal, crema, kraft, ahumado, jamón.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as loadSlab } from "@remotion/google-fonts/AlfaSlabOne";
import { loadFont as loadKalam } from "@remotion/google-fonts/Kalam";
import { sp, ez, cl, FPS, fr } from "../lkit/core";

const SLAB = loadSlab().fontFamily;
const HANDF = loadKalam().fontFamily;
const NAVY = "#1E2B45", CREAM = "#F5EFE2", INK = "#2A211B", RED = "#B42A22", GOLD = "#E0A63A", SMOKE = "#9B5A2A", HAM = "#D7836F",
  BEAN = "#EFE4CC", CHALK = "#F3F1E8", GREEN = "#2F6B47", YEL = "#F3D77A";
const SH = "0 2px 3px rgba(0,0,0,.28), 0 14px 26px rgba(0,0,0,.28), 0 44px 80px rgba(0,0,0,.32)";
type B = { a: number; a0?: number; d: number };
const useT0 = (a: number, a0?: number) => {
  const f0 = useCurrentFrame(); const s = a0 ?? a;
  return { f: f0 + fr(a) - fr(s), at: (t: number) => fr(t) - fr(s) };
};
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const pos = (p: React.CSSProperties): React.CSSProperties => ({ position: "absolute", ...p });

// ── materiales ──────────────────────────────────────────────────────────────
const Drift: React.FC<{ f: number; children: React.ReactNode; k?: number }> = ({ f, children, k = 1 }) => (
  <AbsoluteFill style={{ transform: `scale(${1.04 + 0.00012 * f * k}) translate(${-0.03 * f * k}px, ${-0.015 * f * k}px)` }}>{children}</AbsoluteFill>
);
const MAPLE = "radial-gradient(ellipse 22% 8% at 30% 40%, rgba(90,50,20,.35), transparent 70%), radial-gradient(ellipse 18% 6% at 72% 72%, rgba(90,50,20,.3), transparent 70%), repeating-linear-gradient(91deg, rgba(120,70,30,.18) 0 3px, transparent 3px 11px, rgba(255,230,190,.12) 11px 13px, transparent 13px 29px), repeating-linear-gradient(89deg, rgba(80,45,15,.10) 0 1px, transparent 1px 47px), linear-gradient(180deg, #D7AC74, #C99A5E 60%, #B98A50)";
const KRAFT = "radial-gradient(ellipse at 25% 15%, rgba(255,240,210,.35), transparent 55%), radial-gradient(circle at 80% 85%, rgba(70,40,15,.28), transparent 50%), repeating-linear-gradient(83deg, rgba(90,60,30,.07) 0 2px, transparent 2px 7px), repeating-linear-gradient(-7deg, rgba(255,255,255,.05) 0 1px, transparent 1px 5px), #C29A66";
const BUTCHER = "linear-gradient(118deg, rgba(0,0,0,0) 0 28%, rgba(120,90,70,.07) 31%, rgba(0,0,0,0) 34% 61%, rgba(255,255,255,.35) 63%, rgba(0,0,0,0) 66%), repeating-linear-gradient(90deg, rgba(150,120,100,.05) 0 1px, transparent 1px 4px), #F3EBE2";
const STEEL = "repeating-linear-gradient(90deg, rgba(255,255,255,.06) 0 1px, rgba(0,0,0,.05) 1px 2px, transparent 2px 4px), conic-gradient(from 200deg at 50% 50%, #9aa3ab, #cfd5da, #8f989f, #c3c9ce, #9aa3ab)";
const CORK = "radial-gradient(circle at 20% 30%, rgba(90,50,20,.5) 0 2px, transparent 3px) 0 0/23px 19px, radial-gradient(circle at 60% 70%, rgba(60,30,10,.4) 0 1.5px, transparent 2.5px) 0 0/17px 21px, radial-gradient(circle at 40% 50%, rgba(255,230,180,.35) 0 2px, transparent 3px) 0 0/29px 25px, #B98A55";
const TILE = "repeating-linear-gradient(0deg, #D8D3C9 0 5px, transparent 5px 135px), repeating-linear-gradient(90deg, #D8D3C9 0 5px, transparent 5px 270px), radial-gradient(ellipse at 30% 0%, #FBFAF6, #ECE8DF 70%)";
const BOARD = "radial-gradient(ellipse 40% 30% at 22% 30%, rgba(255,255,255,.07), transparent), radial-gradient(ellipse 35% 25% at 75% 68%, rgba(255,255,255,.055), transparent), radial-gradient(ellipse 20% 40% at 55% 20%, rgba(255,255,255,.04), transparent), repeating-linear-gradient(7deg, rgba(255,255,255,.012) 0 2px, transparent 2px 9px), #1F2B26";
const Light: React.FC<{ x?: number; y?: number; o?: number }> = ({ x = 25, y = 10, o = 0.3 }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 80% at ${x}% ${y}%, rgba(255,244,220,${o}), transparent 60%), linear-gradient(180deg, transparent 55%, rgba(0,0,0,.28))`, pointerEvents: "none" }} />
);
const Sheen: React.FC<{ f: number; at: number; dur?: number }> = ({ f, at, dur = 26 }) => {
  const u = (f - at) / dur; if (u < 0 || u > 1) return null;
  return <AbsoluteFill style={{ background: `linear-gradient(105deg, transparent ${u * 140 - 40}%, rgba(255,255,255,.28) ${u * 140 - 30}%, transparent ${u * 140 - 20}%)`, mixBlendMode: "screen", pointerEvents: "none" }} />;
};
const Bg: React.FC<{ m: string; f: number; light?: [number, number, number] }> = ({ m, f, light = [25, 10, 0.3] }) => (
  <>
    <Drift f={f}><AbsoluteFill style={{ background: m }} /></Drift>
    <Light x={light[0]} y={light[1]} o={light[2]} />
  </>
);
const Board: React.FC<{ f: number; children?: React.ReactNode }> = ({ f, children }) => (
  <AbsoluteFill style={{ background: MAPLE }}>
    <div style={pos({ inset: 38, background: BOARD, borderRadius: 6, boxShadow: "inset 0 0 70px rgba(0,0,0,.65), inset 0 0 0 4px rgba(0,0,0,.35), 0 4px 0 rgba(255,220,170,.25)" })}>
      <div style={pos({ left: 120, right: 120, bottom: 14, height: 18, borderRadius: 4, background: "linear-gradient(180deg,#b88a55,#8a6235)", boxShadow: "0 6px 10px rgba(0,0,0,.4)" })} />
      <div style={pos({ left: 300, bottom: 26, width: 70, height: 16, borderRadius: 3, background: "linear-gradient(180deg,#fff,#e6e2d6)" })} />
      <AbsoluteFill style={{ transform: `translateY(${-0.02 * f}px)` }}>{children}</AbsoluteFill>
    </div>
    <Light x={20} y={0} o={0.18} />
  </AbsoluteFill>
);

// ── piezas dibujadas ────────────────────────────────────────────────────────
const Bean: React.FC<{ w?: number; c?: string; x: number; y: number; rot?: number; style?: React.CSSProperties }> = ({ w = 60, c = BEAN, x, y, rot = 0, style }) => (
  <div style={pos({ left: x, top: y, width: w, height: w * 0.66, borderRadius: "52% 48% 46% 54% / 62% 60% 40% 38%", transform: `rotate(${rot}deg)`,
    background: `radial-gradient(ellipse 40% 30% at 35% 28%, rgba(255,255,255,.8), transparent), radial-gradient(ellipse at 62% 78%, rgba(0,0,0,.2), transparent 60%), ${c}`,
    boxShadow: "0 3px 5px rgba(0,0,0,.28), inset -3px -4px 6px rgba(0,0,0,.12)", ...style })} />
);
const BeanField: React.FC<{ n: number; w: number; h: number; size?: number; c?: string | ((i: number) => string); seed?: number }> = ({ n, w, h, size = 46, c = BEAN, seed = 1 }) => (
  <>{Array.from({ length: n }, (_, i) => <Bean key={i} w={size * (0.85 + 0.3 * rnd(i + seed))} c={typeof c === "function" ? c(i) : c} x={rnd(i * 3 + seed) * (w - size)} y={rnd(i * 7 + seed + 2) * (h - size * 0.7)} rot={rnd(i * 11 + seed) * 360} />)}</>
);
// garrón ahumado: cuerpo de piel ahumada + corte con hueso, carne y grasa
const HockEnd: React.FC<{ s: number; style?: React.CSSProperties }> = ({ s, style }) => (
  <div style={{ width: s, height: s, borderRadius: "50%", background: "radial-gradient(circle, #F6EEDD 0 15%, #C9B79A 16% 20%, #DE937F 21% 50%, #F3E8DA 51% 61%, #C77D63 62% 79%, #7A3A17 80% 100%)",
    boxShadow: "inset 0 0 14px rgba(0,0,0,.45), 0 10px 20px rgba(0,0,0,.4)", ...style }} />
);
const Hock: React.FC<{ w?: number; style?: React.CSSProperties }> = ({ w = 520, style }) => {
  const h = w * 0.6;
  return (
    <div style={{ position: "relative", width: w, height: h, ...style }}>
      <div style={pos({ left: w * 0.03, top: h * 0.86, width: w * 0.9, height: h * 0.2, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,0,0,.45), transparent 70%)" })} />
      <div style={pos({ inset: 0, borderRadius: "48% 40% 44% 52% / 52% 46% 54% 48%",
        background: "radial-gradient(ellipse 30% 22% at 30% 24%, rgba(255,210,150,.6), transparent), radial-gradient(ellipse at 70% 82%, rgba(40,15,5,.6), transparent 60%), repeating-linear-gradient(115deg, rgba(60,25,8,.22) 0 5px, transparent 5px 21px), linear-gradient(160deg,#A8642F,#71391A 55%,#4A2009)",
        boxShadow: "inset -18px -22px 40px rgba(30,10,0,.55), inset 14px 16px 30px rgba(255,190,120,.25)" })} />
      <div style={pos({ left: w * 0.12, top: h * 0.2, width: w * 0.35, height: h * 0.12, borderRadius: "50%", background: "linear-gradient(90deg, transparent, rgba(255,225,170,.35), transparent)", transform: "rotate(-12deg)" })} />
      <HockEnd s={h * 0.66} style={pos({ right: -w * 0.05, top: h * 0.16 })} />
    </div>
  );
};
// olla de aluminio vista de costado
const Pot: React.FC<{ w?: number; liquid?: string; f: number; steam?: number; style?: React.CSSProperties; lid?: number }> = ({ w = 620, liquid, f, steam = 1, style, lid = 0 }) => {
  const h = w * 0.62;
  return (
    <div style={{ position: "relative", width: w, height: h, ...style }}>
      {Array.from({ length: 4 }, (_, i) => {
        const c = ((f + i * 22) % 88) / 88;
        return <div key={i} style={pos({ left: w * (0.2 + 0.18 * i) + Math.sin((f + i * 30) / 14) * 16, top: -h * 0.15 - c * h * 0.9, width: w * 0.22, height: w * 0.3, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(255,255,255,.4), transparent 68%)", opacity: steam * Math.sin(Math.PI * c) * 0.9 })} />;
      })}
      {[-1, 1].map((sd) => <div key={sd} style={pos({ [sd < 0 ? "left" : "right"]: -w * 0.07, top: h * 0.12, width: w * 0.12, height: h * 0.1, borderRadius: 18, background: "linear-gradient(180deg,#3b3b3b,#151515)", boxShadow: "0 6px 10px rgba(0,0,0,.4)" })} />)}
      <div style={pos({ left: 0, right: 0, top: h * 0.06, bottom: 0, borderRadius: "4px 4px 46% 46% / 4px 4px 20% 20%",
        background: "radial-gradient(ellipse 10% 14% at 70% 55%, rgba(0,0,0,.12), transparent), radial-gradient(ellipse 6% 9% at 28% 70%, rgba(255,255,255,.25), transparent), linear-gradient(90deg,#7E868D,#D9DEE2 28%,#AEB6BC 52%,#8C949B 78%,#6D757C)",
        boxShadow: "inset 0 -20px 40px rgba(0,0,0,.25), 0 30px 50px rgba(0,0,0,.4)" })} />
      <div style={pos({ left: -6, right: -6, top: 0, height: h * 0.14, borderRadius: "50%", background: liquid ? `radial-gradient(ellipse at 50% 60%, ${liquid}, rgba(0,0,0,.35))` : "radial-gradient(ellipse, #2b2f33, #5a6268)",
        border: "8px solid #C9CFD4", boxShadow: "inset 0 6px 14px rgba(0,0,0,.4)" })} />
      {lid ? <div style={pos({ left: -10 + lid * w * 0.1, right: -10 - lid * w * 0.1, top: -h * 0.06, height: h * 0.2, borderRadius: "50% 50% 46% 46%", background: "linear-gradient(180deg,#E3E7EA,#9AA2A9)", boxShadow: "0 8px 14px rgba(0,0,0,.35)" })}>
        <div style={pos({ left: "44%", top: -18, width: "12%", height: 26, borderRadius: 10, background: "#222" })} /></div> : null}
    </div>
  );
};
const Tag: React.FC<{ w?: number; children: React.ReactNode; rot?: number; style?: React.CSSProperties }> = ({ w = 360, children, rot = 0, style }) => (
  <div style={{ position: "relative", width: w, padding: "34px 28px 28px 70px", transform: `rotate(${rot}deg)`, background: KRAFT, clipPath: "polygon(16% 0, 100% 0, 100% 100%, 16% 100%, 0 50%)", boxShadow: SH, ...style }}>
    <div style={pos({ left: 28, top: "50%", width: 26, height: 26, marginTop: -13, borderRadius: "50%", background: "#3a2a1a", boxShadow: "inset 0 2px 4px rgba(0,0,0,.6), 0 0 0 6px rgba(255,240,210,.5)" })} />
    {children}
  </div>
);
const Slip: React.FC<{ w?: number; rot?: number; children: React.ReactNode; style?: React.CSSProperties; pin?: boolean }> = ({ w = 420, rot = 0, children, style, pin = true }) => (
  <div style={{ position: "relative", width: w, padding: "40px 30px 30px", transform: `rotate(${rot}deg)`, boxShadow: SH,
    background: "repeating-linear-gradient(180deg, transparent 0 46px, rgba(70,90,140,.25) 46px 48px), linear-gradient(180deg,#FBEFB0,#F2DC86)", ...style }}>
    {pin ? <div style={pos({ left: "50%", top: 10, width: 30, height: 30, marginLeft: -15, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #ff8a7a, #B42A22 60%, #6b1310)", boxShadow: "0 6px 8px rgba(0,0,0,.45)" })} /> : null}
    {children}
  </div>
);
const Card: React.FC<{ w: number; rot?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ w, rot = 0, children, style }) => (
  <div style={{ position: "relative", width: w, padding: "70px 50px 40px 110px", transform: `rotate(${rot}deg)`, boxShadow: SH,
    background: "linear-gradient(90deg, transparent 84px, rgba(200,50,50,.55) 84px 87px, transparent 87px), repeating-linear-gradient(180deg, transparent 0 62px, rgba(80,120,190,.35) 62px 64px), linear-gradient(180deg, #FFFDF6, #F4EEDD)", ...style }}>{children}</div>
);
const Hand: React.FC<{ txt: string; size: number; color?: string; f?: number; at?: number; dur?: number; style?: React.CSSProperties }> = ({ txt, size, color = INK, f = 999, at = 0, dur = 14, style }) => (
  <div style={{ fontFamily: HANDF, fontWeight: 700, fontSize: size, color, lineHeight: 1.05, whiteSpace: "nowrap", clipPath: `inset(-30% ${100 - 100 * ez((f - at) / dur)}% -30% 0)`, ...style }}>{txt}</div>
);
const Chalk: React.FC<{ txt: string; size: number; f: number; at: number; dur?: number; slab?: boolean; color?: string; style?: React.CSSProperties }> = ({ txt, size, f, at, dur = 16, slab, color = CHALK, style }) => (
  <div style={{ fontFamily: slab ? SLAB : HANDF, fontWeight: 700, fontSize: size, color, lineHeight: 1.05, whiteSpace: "nowrap", letterSpacing: slab ? 2 : 0,
    textShadow: "0 0 1px rgba(255,255,255,.9), 0 0 7px rgba(255,255,255,.22), 2px 1px 0 rgba(255,255,255,.12), -1px 2px 0 rgba(255,255,255,.08)",
    clipPath: `inset(-30% ${100 - 100 * ez((f - at) / dur)}% -30% 0)`, ...style }}>{txt}</div>
);
const Slab: React.FC<{ txt: string; size: number; color?: string; style?: React.CSSProperties; ls?: number }> = ({ txt, size, color = INK, style, ls = 1 }) => (
  <div style={{ fontFamily: SLAB, fontSize: size, color, lineHeight: 1, letterSpacing: ls, whiteSpace: "nowrap", ...style }}>{txt}</div>
);
const Check: React.FC<{ f: number; at: number; s?: number; c?: string }> = ({ f, at, s = 60, c = GREEN }) => {
  const u = sp(f, at, 11, 200);
  return <div style={{ width: s * 0.45, height: s * 0.9, borderRight: `${s * 0.18}px solid ${c}`, borderBottom: `${s * 0.18}px solid ${c}`, borderRadius: 4, transform: `rotate(42deg) scale(${u})`, opacity: cl(u * 3), flex: "none", marginRight: s * 0.25 }} />;
};
const Cross: React.FC<{ f: number; at: number; s?: number; c?: string }> = ({ f, at, s = 60, c = RED }) => {
  const u = sp(f, at, 11, 200);
  return (
    <div style={{ position: "relative", width: s, height: s, flex: "none", opacity: cl(u * 3) }}>
      {[45, -45].map((r) => <div key={r} style={pos({ left: 0, top: s * 0.42, width: s, height: s * 0.17, borderRadius: 6, background: c, transform: `rotate(${r}deg) scaleX(${u})` })} />)}
    </div>
  );
};
const Strike: React.FC<{ f: number; at: number; c?: string; h?: number; rot?: number }> = ({ f, at, c = RED, h = 12, rot = -4 }) => (
  <div style={pos({ left: -14, right: -14, top: "50%", height: h, marginTop: -h / 2, borderRadius: h, background: c, transformOrigin: "left center", transform: `rotate(${rot}deg) scaleX(${ez((f - at) / 9)})`, boxShadow: "0 3px 6px rgba(0,0,0,.3)" })} />
);
const Stamp: React.FC<{ txt: string; f: number; at: number; c?: string; size?: number; rot?: number; style?: React.CSSProperties }> = ({ txt, f, at, c = RED, size = 80, rot = -9, style }) => {
  if (f < at - 1) return null;
  const u = sp(f, at, 10, 230);
  return (
    <div style={{ position: "absolute", zIndex: 9, opacity: cl(u * 3), transform: `rotate(${rot}deg) scale(${2 - u})`, border: `10px solid ${c}`, borderRadius: 16, padding: "6px 30px", color: c,
      background: "rgba(250,246,236,.86)", boxShadow: "0 16px 30px rgba(0,0,0,.4)", fontFamily: SLAB, fontSize: size, letterSpacing: 3, whiteSpace: "nowrap", ...style }}>{txt}</div>
  );
};
const rise = (f: number, at: number, dist = 70) => { const u = sp(f, at, 14, 150); return { opacity: cl(u * 2.5), transform: `perspective(1400px) translateY(${(1 - u) * dist}px) rotateX(${(1 - u) * 22}deg)` }; };
const pop = (f: number, at: number) => { const u = sp(f, at, 11, 190); return { opacity: cl(u * 3), transform: `scale(${0.6 + 0.4 * u})` }; };
const slideIn = (f: number, at: number, dx = -900, rot = 0) => { const u = sp(f, at, 15, 120); return { opacity: cl(u * 2), transform: `translateX(${dx * (1 - u)}px) rotate(${rot * (1 - u)}deg)` }; };
const Arrow: React.FC<{ f: number; at: number; w?: number; c?: string; style?: React.CSSProperties }> = ({ f, at, w = 160, c = RED, style }) => {
  const u = ez((f - at) / 10);
  return (
    <div style={{ position: "relative", width: w, height: 60, opacity: cl(u * 3), ...style }}>
      <div style={pos({ left: 0, top: 22, height: 16, width: (w - 40) * u, borderRadius: 8, background: c })} />
      <div style={pos({ left: (w - 50) * u, top: 0, width: 0, height: 0, borderTop: "30px solid transparent", borderBottom: "30px solid transparent", borderLeft: `50px solid ${c}` })} />
    </div>
  );
};
const Can: React.FC<{ w?: number; style?: React.CSSProperties }> = ({ w = 150, style }) => (
  <div style={{ position: "relative", width: w, height: w * 1.25, ...style }}>
    <div style={pos({ inset: 0, borderRadius: `${w * 0.08}px / ${w * 0.05}px`, background: "linear-gradient(90deg,#8d959c,#e4e8eb 30%,#a7afb6 60%,#7a8289)", boxShadow: "0 14px 20px rgba(0,0,0,.35)" })} />
    <div style={pos({ left: 0, right: 0, top: w * 0.18, bottom: w * 0.18, background: "linear-gradient(90deg,#8E2A20,#C9473A 30%,#A3352A 60%,#6E1E16)" })} />
    <div style={pos({ left: 0, right: 0, top: w * 0.47, height: w * 0.28, background: "linear-gradient(90deg,#d9cfb6,#fbf5e6 30%,#e6dcc4 60%,#bfb59c)" })} />
    {[0.06, 0.12, 0.88, 0.94].map((p) => <div key={p} style={pos({ left: 0, right: 0, top: `${p * 100}%`, height: 2, background: "rgba(0,0,0,.25)" })} />)}
  </div>
);
const Bowl: React.FC<{ s: number; style?: React.CSSProperties; seed?: number }> = ({ s, style, seed = 1 }) => (
  <div style={{ position: "relative", width: s, height: s, borderRadius: "50%", background: "radial-gradient(circle, #fff 0 60%, #e9e4da 62%, #fff 70%, #d8d2c6 100%)", boxShadow: "0 12px 22px rgba(0,0,0,.35)", ...style }}>
    <div style={pos({ inset: s * 0.14, borderRadius: "50%", overflow: "hidden", background: "radial-gradient(circle at 40% 35%, #E8C690, #B98546)" })}>
      <BeanField n={16} w={s * 0.72} h={s * 0.72} size={s * 0.16} seed={seed} c={(i) => (i % 5 === 0 ? HAM : BEAN)} />
    </div>
  </div>
);
const Clock: React.FC<{ s: number; p: number; label?: string; c?: string }> = ({ s, p, label, c = RED }) => (
  <div style={{ position: "relative", width: s, height: s, borderRadius: "50%", background: "radial-gradient(circle, #fff 0 64%, #e2e2dc 66%, #b5bbc0 76%, #eef0f2 82%, #8d959c 100%)", boxShadow: SH }}>
    <div style={pos({ inset: s * 0.14, borderRadius: "50%", background: `conic-gradient(${c} 0 ${p * 360}deg, rgba(0,0,0,0) ${p * 360}deg)`, opacity: 0.85 })} />
    <div style={pos({ inset: s * 0.2, borderRadius: "50%", background: "#fff" })} />
    {Array.from({ length: 12 }, (_, i) => <div key={i} style={pos({ left: s / 2 - 3, top: s * 0.16, width: 6, height: s * 0.07, background: INK, transformOrigin: `3px ${s * 0.34}px`, transform: `rotate(${i * 30}deg)` })} />)}
    <div style={pos({ left: s / 2 - 5, top: s * 0.22, width: 10, height: s * 0.28, borderRadius: 5, background: INK, transformOrigin: `5px ${s * 0.28}px`, transform: `rotate(${p * 360}deg)` })} />
    <div style={pos({ left: s / 2 - 14, top: s / 2 - 14, width: 28, height: 28, borderRadius: "50%", background: INK })} />
    {label ? <Slab txt={label} size={s * 0.13} color={INK} style={pos({ left: 0, right: 0, top: s * 0.6, textAlign: "center" })} /> : null}
  </div>
);

// ═══════════════════════════ COMPONENTES ═══════════════════════════
// 1 · etiqueta colgante de 2 dólares sobre el garrón en el tajo
export const HockTag: React.FC<B & { price: string; txt: string; t: number }> = ({ a, a0, d, price, txt, t }) => {
  const { f, at } = useT0(a, a0);
  const sw = Math.sin((f - at(t)) / 6) * 9 * Math.exp(-Math.max(0, f - at(t)) / 30);
  return (
    <AbsoluteFill>
      <Bg m={MAPLE} f={f} />
      <div style={pos({ left: 210, top: 290, width: 1100, height: 640, background: BUTCHER, transform: "rotate(-4deg)", boxShadow: SH, ...slideIn(f, 0, 0) })} />
      <div style={pos({ left: 330, top: 420, ...rise(f, 4, 120) })}><Hock w={820} /></div>
      <div style={pos({ left: 1240, top: 120, width: 6, height: 260, background: "linear-gradient(90deg,#e8e0cc,#a99c80)", transformOrigin: "top", transform: `rotate(${sw}deg)` })} />
      <div style={pos({ left: 1000, top: 360, transformOrigin: "160px -60px", transform: `rotate(${sw}deg)`, ...pop(f, at(t)) })}>
        <Tag w={600} rot={0}>
          <Slab txt={price} size={210} color={RED} style={{ textShadow: "0 3px 0 rgba(0,0,0,.15)" }} />
          <Hand txt={txt} size={46} color={INK} f={f} at={at(t) + 10} />
        </Tag>
      </div>
      <Stamp txt="EVERY FRIDAY" f={f} at={at(t) + 22} size={58} rot={8} c={NAVY} style={{ left: 120, top: 120 }} />
      <Sheen f={f} at={at(t) + 4} />
    </AbsoluteFill>
  );
};

// 2 · ticket de supermercado que se imprime: 8 latas → $10.32
export const CanReceipt: React.FC<B & { rows: number; each: string; tot: string; t: number }> = ({ a, a0, d, rows, each, tot, t }) => {
  const { f, at } = useT0(a, a0);
  const per = 5, t0 = at(t) - rows * per - 6;
  const shown = Math.max(0, Math.min(rows, Math.floor((f - Math.max(4, t0)) / per)));
  const totOn = f >= at(t);
  const len = 230 + shown * 70 + (totOn ? 200 : 0);
  return (
    <AbsoluteFill>
      <Bg m={STEEL} f={f} light={[70, 0, 0.25]} />
      {Array.from({ length: 8 }, (_, i) => <div key={i} style={pos({ left: 110 + (i % 4) * 150, top: 330 + Math.floor(i / 4) * 210 - (i % 2) * 12, ...pop(f, 2 + i * 3) })}><Can w={140} /></div>)}
      <div style={pos({ left: 900, top: 70, width: 760, height: 70, borderRadius: 14, background: "linear-gradient(180deg,#2c2f33,#0f1113)", boxShadow: SH, zIndex: 3 })}>
        <div style={pos({ left: 40, right: 40, top: 46, height: 8, borderRadius: 4, background: "#000" })} />
      </div>
      <div style={pos({ left: 950, top: 120, width: 660, height: Math.min(900, len), overflow: "hidden", zIndex: 2 })}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "40px 46px 60px", background: "linear-gradient(90deg, rgba(0,0,0,.05), transparent 8%, transparent 92%, rgba(0,0,0,.05)), #FBFBF7", boxShadow: SH,
          clipPath: "polygon(0 0,100% 0,100% 100%,96% 98.5%,92% 100%,88% 98.5%,84% 100%,80% 98.5%,76% 100%,72% 98.5%,68% 100%,64% 98.5%,60% 100%,56% 98.5%,52% 100%,48% 98.5%,44% 100%,40% 98.5%,36% 100%,32% 98.5%,28% 100%,24% 98.5%,20% 100%,16% 98.5%,12% 100%,8% 98.5%,4% 100%,0 98.5%)" }}>
          <Slab txt="GROCERY" size={40} color="#444" style={{ textAlign: "center", letterSpacing: 6 }} />
          <div style={{ borderTop: "3px dashed #999", margin: "18px 0 10px" }} />
          {Array.from({ length: shown }, (_, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", height: 70, alignItems: "center" }}>
              <Hand txt={`BEANS 15 OZ`} size={44} color="#333" /><Hand txt={each} size={44} color="#333" />
            </div>
          ))}
          {totOn ? <>
            <div style={{ borderTop: "3px dashed #999", margin: "12px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", position: "relative" }}>
              <Slab txt="TOTAL" size={56} /><Slab txt={tot} size={110} color={RED} style={pop(f, at(t))} />
            </div>
          </> : null}
        </div>
      </div>
      {totOn ? <div style={pos({ left: 1230, top: Math.min(900, len) - 20, width: 400, height: 170, borderRadius: "50%", border: `9px solid ${RED}`, zIndex: 4, transform: "rotate(-6deg)",
        clipPath: `inset(0 ${100 - 100 * ez((f - at(t) - 8) / 12)}% 0 0)` })} /> : null}
      <Hand txt="eight cans" size={70} color={NAVY} f={f} at={10} style={pos({ left: 170, top: 790, transform: "rotate(-3deg)" })} />
    </AbsoluteFill>
  );
};

// 3 · 8 latas $10.32 contra bolsa $1.69 + garrón $2.00 = $3.69
export const CounterVs: React.FC<B & { L_: { name: string; tot: string }; R_: { a: string; aT: string; b: string; bT: string; tot: string }; tA: number; tB: number; tTot: number }> = ({ a, a0, d, L_, R_, tA, tB, tTot }) => {
  const { f, at } = useT0(a, a0);
  return (
    <AbsoluteFill>
      <Drift f={f}><AbsoluteFill style={{ background: STEEL }} /><AbsoluteFill style={{ background: KRAFT, clipPath: "polygon(46% 0,100% 0,100% 100%,38% 100%)" }} /></Drift>
      <Light />
      <div style={pos({ left: 60, top: 140, width: 640 })}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 18, width: 600 }}>{Array.from({ length: 8 }, (_, i) => <div key={i} style={pop(f, 2 + i * 2)}><Can w={128} /></div>)}</div>
        <div style={{ position: "relative", display: "inline-block", marginTop: 40 }}>
          <Slab txt={`${L_.name}  ${L_.tot}`} size={84} color={CREAM} style={{ textShadow: "0 4px 10px rgba(0,0,0,.6)" }} />
          <Strike f={f} at={at(tTot) + 6} />
        </div>
      </div>
      <div style={pos({ left: 880, top: 200, width: 960, height: 640, background: BUTCHER, transform: "rotate(2deg)", boxShadow: SH })} />
      <div style={pos({ left: 960, top: 290, width: 330, height: 420, borderRadius: "30px 30px 40px 40px", overflow: "hidden", background: "linear-gradient(90deg, rgba(255,255,255,.45), rgba(255,255,255,.1) 30%, rgba(255,255,255,.35) 70%, rgba(255,255,255,.15))", boxShadow: SH, ...rise(f, at(tA) - 4) })}>
        <BeanField n={70} w={330} h={420} size={40} seed={3} />
        <div style={pos({ inset: 0, background: "linear-gradient(90deg, rgba(255,255,255,.35), transparent 25%, transparent 75%, rgba(255,255,255,.25))" })} />
      </div>
      <div style={pos({ left: 1340, top: 420, ...rise(f, at(tB) - 4) })}><Hock w={430} /></div>
      <div style={pos({ left: 990, top: 160, ...pop(f, at(tA)) })}><Tag w={300} rot={-6}><Slab txt={R_.a} size={76} color={RED} /><Hand txt={R_.aT} size={34} /></Tag></div>
      <div style={pos({ left: 1440, top: 230, ...pop(f, at(tB)) })}><Tag w={300} rot={5}><Slab txt={R_.b} size={76} color={RED} /><Hand txt={R_.bT} size={34} /></Tag></div>
      <Stamp txt={`= ${R_.tot}`} f={f} at={at(tTot)} size={120} rot={-7} c={GREEN} style={{ left: 1080, top: 760 }} />
    </AbsoluteFill>
  );
};

// 4 · olla de aluminio sobre el azulejo del local + etiqueta de precio que cuelga del asa
export const PotPrice: React.FC<B & { big: string; sub: string; t: number }> = ({ a, a0, d, big, sub, t }) => {
  const { f, at } = useT0(a, a0);
  return (
    <AbsoluteFill>
      <Bg m={TILE} f={f} light={[30, 0, 0.25]} />
      <div style={pos({ left: 0, right: 0, top: 790, bottom: 0, background: STEEL, boxShadow: "0 -6px 18px rgba(0,0,0,.25)" })} />
      <div style={pos({ left: 230, top: 330, ...rise(f, 0, 160) })}><Pot w={760} f={f} liquid="#D9A35A" /></div>
      <div style={pos({ left: 1080, top: 250, ...pop(f, at(t)) })}>
        <div style={{ background: NAVY, borderRadius: 26, padding: "36px 60px 40px", boxShadow: SH, border: `6px solid ${CREAM}`, transform: "rotate(3deg)" }}>
          <Slab txt={big} size={260} color={CREAM} />
          <Hand txt={sub} size={64} color={GOLD} f={f} at={at(t) + 8} />
        </div>
      </div>
      <Sheen f={f} at={at(t) + 6} />
    </AbsoluteFill>
  );
};

// 5 · pizarra de menú: "14 TRICKS" y una fila de 14 porotos que caen
export const Fourteen: React.FC<B & { t: number }> = ({ a, a0, d, t }) => {
  const { f, at } = useT0(a, a0);
  return (
    <AbsoluteFill>
      <Board f={f}>
        <Chalk txt="FRIDAY BEANS" size={70} f={f} at={2} slab style={pos({ left: 110, top: 70 })} />
        <div style={pos({ left: 110, top: 160, width: 600, height: 6, background: "rgba(243,241,232,.6)", transformOrigin: "left", transform: `scaleX(${ez((f - 8) / 12)})` })} />
        <Chalk txt="14" size={420} f={f} at={at(t)} slab color={GOLD} style={pos({ left: 150, top: 220 })} />
        <Chalk txt="tricks," size={130} f={f} at={at(t) + 10} style={pos({ left: 820, top: 300 })} />
        <Chalk txt="in the order you do them" size={84} f={f} at={at(t) + 20} style={pos({ left: 820, top: 460 })} />
        {Array.from({ length: 14 }, (_, i) => {
          const u = sp(f, at(t) + 24 + i * 2, 12, 160);
          return <div key={i} style={pos({ left: 140 + i * 118, top: 760 - (1 - u) * 500, opacity: cl(u * 2) })}>
            <Bean w={90} x={0} y={0} rot={i * 23} /><Slab txt={`${i + 1}`} size={34} color={CHALK} style={pos({ left: 26, top: 74 })} />
          </div>;
        })}
      </Board>
    </AbsoluteFill>
  );
};

// 6 · pizarra con palitos que cuentan hasta 60 garrones cada viernes
export const FridayTally: React.FC<B & { n: number; t: number }> = ({ a, a0, d, n, t }) => {
  const { f, at } = useT0(a, a0);
  const k = Math.round(n * ez((f - at(t)) / 50));
  const groups = Math.ceil(n / 5);
  return (
    <AbsoluteFill>
      <Board f={f}>
        <Chalk txt="FRIDAY HOCKS" size={84} f={f} at={2} slab style={pos({ left: 110, top: 70 })} />
        <Chalk txt="sold every week" size={60} f={f} at={14} style={pos({ left: 120, top: 180 })} />
        <div style={pos({ left: 110, top: 300, width: 1150, display: "flex", flexWrap: "wrap", gap: "40px 46px" })}>
          {Array.from({ length: groups }, (_, g) => (
            <div key={g} style={{ position: "relative", width: 130, height: 120 }}>
              {Array.from({ length: 4 }, (_, j) => g * 5 + j < k ? <div key={j} style={pos({ left: 10 + j * 30, top: 0, width: 9, height: 120, borderRadius: 5, background: CHALK, boxShadow: "0 0 6px rgba(255,255,255,.3)", transform: `rotate(${(rnd(g * 5 + j) - 0.5) * 6}deg)` })} /> : null)}
              {g * 5 + 4 < k ? <div style={pos({ left: -10, top: 52, width: 150, height: 9, borderRadius: 5, background: CHALK, transform: "rotate(-28deg)", boxShadow: "0 0 6px rgba(255,255,255,.3)" })} /> : null}
            </div>
          ))}
        </div>
        <div style={pos({ left: 1340, top: 260, textAlign: "center" })}>
          <Slab txt={`${k}`} size={330} color={GOLD} style={{ textShadow: "0 0 10px rgba(255,220,150,.3)" }} />
          <Chalk txt="hocks" size={90} f={f} at={at(t) + 20} />
        </div>
        <Chalk txt="mostly to folks over 65" size={64} f={f} at={at(t) + 46} color={YEL} style={pos({ left: 120, top: 800 })} />
      </Board>
    </AbsoluteFill>
  );
};

// 7 · lupa sobre la bolsa + lista de control en kraft
export const BeanCheck: React.FC<B & { head: string; items: { txt: string; ok: boolean; t: number }[]; foot: string; tFoot: number }> = ({ a, a0, d, head, items, foot, tFoot }) => {
  const { f, at } = useT0(a, a0);
  const mx = 420 + Math.sin(f / 40) * 60, my = 520 + Math.cos(f / 50) * 40;
  return (
    <AbsoluteFill>
      <Bg m={KRAFT} f={f} />
      <div style={pos({ left: 80, top: 130, width: 760, height: 820, borderRadius: 40, overflow: "hidden", background: "linear-gradient(90deg, rgba(255,255,255,.4), rgba(255,255,255,.1) 30%, rgba(255,255,255,.3) 70%, rgba(255,255,255,.12)), #E9DFC9", boxShadow: SH })}>
        <BeanField n={170} w={760} h={820} size={56} seed={9} c={(i) => (i % 13 === 0 ? "#CDBB96" : BEAN)} />
      </div>
      <div style={pos({ left: mx - 210, top: my - 210, width: 420, height: 420, borderRadius: "50%", overflow: "hidden", border: "22px solid #2b2f33", boxShadow: "0 30px 50px rgba(0,0,0,.5), inset 0 0 30px rgba(0,0,0,.4)", ...pop(f, 4) })}>
        <div style={pos({ inset: 0, background: "#EDE3CC" })} />
        <div style={pos({ left: 0, top: 0, transform: "scale(1.9)", transformOrigin: "0 0" })}><BeanField n={14} w={220} h={220} size={56} seed={21} /></div>
        <div style={pos({ inset: 0, background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,.45), transparent 35%)" })} />
      </div>
      <div style={pos({ left: mx + 120, top: my + 150, width: 60, height: 300, borderRadius: 30, background: "linear-gradient(90deg,#3a2a1a,#7a5a3a,#3a2a1a)", transform: "rotate(-40deg)", transformOrigin: "top", ...pop(f, 4) })} />
      <div style={pos({ left: 960, top: 120, ...rise(f, 6) })}>
        <Card w={860} rot={1.5}>
          <Slab txt={head} size={56} color={NAVY} style={{ marginBottom: 30 }} />
          {items.map((it, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", height: 124, opacity: f >= at(it.t) - 2 ? 1 : 0.15 }}>
              {it.ok ? <Check f={f} at={at(it.t)} s={70} /> : <Cross f={f} at={at(it.t)} s={66} />}
              <Hand txt={it.txt} size={72} color={it.ok ? GREEN : INK} f={f} at={at(it.t)} style={{ marginLeft: 26 }} />
            </div>
          ))}
        </Card>
      </div>
      <Stamp txt={foot.toUpperCase()} f={f} at={at(tFoot)} size={56} rot={-6} c={NAVY} style={{ left: 1080, top: 900 }} />
    </AbsoluteFill>
  );
};

// 8 · 1 bolsa → 2 tazas secas → 6 tazas cocidas (tazas de acero que se llenan)
const Cup: React.FC<{ w: number; fill: number; c: string; label: string; seed: number }> = ({ w, fill, c, label, seed }) => (
  <div style={{ position: "relative", width: w, height: w * 1.05 }}>
    <div style={pos({ right: -w * 0.28, top: w * 0.2, width: w * 0.34, height: w * 0.45, border: `${w * 0.07}px solid #9aa3ab`, borderLeft: "none", borderRadius: `0 ${w * 0.2}px ${w * 0.2}px 0` })} />
    <div style={pos({ inset: 0, borderRadius: `8px 8px ${w * 0.18}px ${w * 0.18}px`, overflow: "hidden", background: "linear-gradient(90deg,#8d959c,#e4e8eb 30%,#a7afb6 60%,#7a8289)", boxShadow: SH })}>
      <div style={pos({ left: 10, right: 10, bottom: 10, height: `${fill * 88}%`, overflow: "hidden", borderRadius: `0 0 ${w * 0.16}px ${w * 0.16}px`, background: c })}>
        <BeanField n={Math.round(w / 9)} w={w - 20} h={w} size={w * 0.17} seed={seed} />
      </div>
    </div>
    <Slab txt={label} size={w * 0.2} color={CREAM} style={pos({ left: 0, right: 0, top: w * 1.12, textAlign: "center", textShadow: "0 4px 10px rgba(0,0,0,.6)" })} />
  </div>
);
export const CupMath: React.FC<B & { a: number; aT: string; b: string; cc: string; cT: string; tA: number; tB: number; tC: number } & { a_?: string }> = (p: any) => {
  const { a, a0, aT, b, cc, cT, tA, tB, tC } = p;
  const { f, at } = useT0(a, a0);
  return (
    <AbsoluteFill>
      <Bg m={MAPLE} f={f} />
      <div style={pos({ left: 90, top: 260, ...rise(f, at(tA)) })}>
        <div style={{ width: 340, height: 440, borderRadius: "30px 30px 40px 40px", overflow: "hidden", position: "relative", background: "rgba(255,255,255,.3)", boxShadow: SH }}><BeanField n={80} w={340} h={440} size={42} seed={5} /></div>
        <Slab txt="1 LB BAG" size={56} color={CREAM} style={{ marginTop: 26, textShadow: "0 4px 10px rgba(0,0,0,.6)" }} />
        <Hand txt={aT} size={46} color={CREAM} />
      </div>
      <Arrow f={f} at={at(tB) - 4} w={180} c={NAVY} style={pos({ left: 470, top: 470 })} />
      <div style={pos({ left: 690, top: 330, ...rise(f, at(tB)) })}><Cup w={330} fill={0.95 * ez((f - at(tB)) / 20)} c="#E9DFC6" label={b} seed={7} /></div>
      <Arrow f={f} at={at(tC) - 4} w={180} c={NAVY} style={pos({ left: 1090, top: 470 })} />
      <div style={pos({ left: 1300, top: 220, ...rise(f, at(tC)) })}><Cup w={420} fill={0.95 * ez((f - at(tC)) / 26)} c="#D8B07A" label={`${cc}`} seed={11} /></div>
      <Sheen f={f} at={at(tC) + 20} />
    </AbsoluteFill>
  );
};

// 9 · ficha de receta + bol de vidrio con sal que cae
export const BrineCard: React.FC<B & { rows: { q: string; w: string; t: number }[]; hrs: string; tHrs: number }> = ({ a, a0, d, rows, hrs, tHrs }) => {
  const { f, at } = useT0(a, a0);
  const salt = f > at(rows[2]?.t ?? 0);
  return (
    <AbsoluteFill>
      <Bg m={STEEL} f={f} />
      <div style={pos({ left: 90, top: 140, ...rise(f, 2) })}>
        <Card w={900} rot={-2}>
          <Slab txt="THE SALT SOAK" size={64} color={RED} style={{ marginBottom: 26 }} />
          {rows.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "baseline", height: 124 }}>
              <Hand txt={r.q} size={92} color={NAVY} f={f} at={at(r.t)} style={{ width: 300 }} />
              <Hand txt={r.w} size={72} color={INK} f={f} at={at(r.t) + 6} />
            </div>
          ))}
        </Card>
      </div>
      <div style={pos({ left: 1120, top: 330, width: 680, height: 470, ...rise(f, 6) })}>
        <div style={pos({ inset: 0, borderRadius: "10px 10px 50% 50% / 10px 10px 40% 40%", overflow: "hidden", background: "linear-gradient(90deg, rgba(255,255,255,.55), rgba(200,225,240,.2) 25%, rgba(200,225,240,.1) 70%, rgba(255,255,255,.45))", border: "5px solid rgba(255,255,255,.7)", boxShadow: SH })}>
          <div style={pos({ left: 0, right: 0, top: 80, bottom: 0, background: "linear-gradient(180deg, rgba(170,205,225,.55), rgba(120,160,190,.65))" })} />
          <div style={pos({ left: 40, right: 40, bottom: 10, height: 220 })}><BeanField n={70} w={600} h={220} size={44 * (1 + 0.5 * ez((f - at(tHrs)) / 30))} seed={13} /></div>
        </div>
        {salt ? Array.from({ length: 26 }, (_, i) => { const y = ((f - at(rows[2].t)) * 14 + rnd(i) * 300) % 360; return <div key={i} style={pos({ left: 250 + rnd(i * 5) * 180, top: -260 + y, width: 9, height: 9, background: "#fff", boxShadow: "0 0 3px rgba(0,0,0,.3)", transform: `rotate(${i * 40}deg)` })} />; }) : null}
      </div>
      <div style={pos({ left: 1150, top: 60, ...pop(f, at(tHrs)) })}><Clock s={230} p={ez((f - at(tHrs)) / 40) * 0.67} /></div>
      <Stamp txt={hrs} f={f} at={at(tHrs) + 6} size={90} rot={8} c={NAVY} style={{ left: 1360, top: 120 }} />
    </AbsoluteFill>
  );
};

// 10 · ficha que gira en 3D: mito → verdad
export const MythFlip: React.FC<B & { myth: string; truth: string; tM: number; tT: number }> = ({ a, a0, d, myth, truth, tM, tT }) => {
  const { f, at } = useT0(a, a0);
  const r = 180 * sp(f, at(tT), 16, 110);
  const face: React.CSSProperties = { position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 22, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40, boxShadow: SH };
  return (
    <AbsoluteFill>
      <Board f={f}>
        <div style={pos({ left: 360, top: 170, width: 1120, height: 620, perspective: 2000, ...rise(f, at(tM)) })}>
          <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateY(${r}deg)` }}>
            <div style={{ ...face, background: BUTCHER }}>
              <Hand txt={`"${myth}"`} size={96} color={INK} />
              <Stamp txt="OLD MYTH" f={f} at={at(tM) + 12} size={90} rot={-8} style={{ position: "relative" }} />
            </div>
            <div style={{ ...face, background: YEL, transform: "rotateY(180deg)" }}>
              <Slab txt={truth.split("=")[0].trim().toUpperCase()} size={84} color={NAVY} />
              <Slab txt={"= " + (truth.split("=")[1] || "").trim().toUpperCase()} size={96} color={GREEN} />
            </div>
          </div>
        </div>
      </Board>
    </AbsoluteFill>
  );
};

// 11 · remojo rápido: hornalla con llama + 3 tarjetas con la línea de tiempo
export const QuickSoak: React.FC<B & { steps: { big: string; txt: string; t: number }[] }> = ({ a, a0, d, steps }) => {
  const { f, at } = useT0(a, a0);
  const cur = steps.reduce((k, s, i) => (f >= at(s.t) ? i : k), -1);
  const flame = cur === 0 ? 1 : cur >= 1 ? 1 - ez((f - at(steps[1].t)) / 10) : 0.6;
  return (
    <AbsoluteFill>
      <Bg m="radial-gradient(ellipse at 50% 30%, #FBFAF6, #E9E6DE)" f={f} />
      <div style={pos({ left: 760, top: 80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, #2a2a2a 0 18%, #444 19% 22%, #1a1a1a 23% 100%)", boxShadow: SH })}>
        {Array.from({ length: 18 }, (_, i) => <div key={i} style={pos({ left: 190, top: 90, width: 20, height: 70 * flame, borderRadius: "50% 50% 40% 40%", transformOrigin: "10px 110px", transform: `rotate(${i * 20}deg) scaleY(${0.8 + 0.25 * Math.sin(f / 3 + i)})`,
          background: "linear-gradient(180deg, rgba(120,170,255,.2), #3D7BFF 60%, #9FC2FF)", opacity: flame })} />)}
        {[0, 45, 90, 135].map((r) => <div key={r} style={pos({ left: -20, right: -20, top: 190, height: 20, background: "linear-gradient(180deg,#555,#111)", transform: `rotate(${r}deg)` })} />)}
      </div>
      <div style={pos({ left: 150, right: 150, top: 640, height: 14, borderRadius: 7, background: "rgba(0,0,0,.12)" })}>
        <div style={pos({ left: 0, top: 0, bottom: 0, borderRadius: 7, background: RED, width: `${cur < 0 ? 0 : ((cur + ez((f - at(steps[cur].t)) / 20)) / steps.length) * 100}%` })} />
      </div>
      {steps.map((s, i) => (
        <div key={i} style={pos({ left: 150 + i * 560, top: 540, ...rise(f, at(s.t)) })}>
          <div style={{ width: 500, background: i === 2 ? NAVY : CREAM, borderRadius: 24, padding: "40px 40px 34px", boxShadow: SH, border: `6px solid ${i === 2 ? GOLD : NAVY}` }}>
            <Slab txt={s.big} size={130} color={i === 2 ? CREAM : RED} />
            <Hand txt={s.txt} size={46} color={i === 2 ? GOLD : INK} />
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

// 12 · cerdo dibujado en papel de carnicería: se ilumina la pata (el garrón)
export const HockMap: React.FC<B & { t: number }> = ({ a, a0, d, t }) => {
  const { f, at } = useT0(a, a0);
  const glow = 0.55 + 0.45 * Math.sin((f - at(t)) / 5);
  const ink = { border: `7px solid ${INK}`, background: "rgba(255,255,255,.25)" };
  const hot = f >= at(t);
  return (
    <AbsoluteFill>
      <Bg m={BUTCHER} f={f} />
      <div style={pos({ left: 260, top: 160, width: 1400, height: 760, ...rise(f, 2) })}>
        <div style={pos({ left: 200, top: 120, width: 960, height: 400, borderRadius: "48% 52% 46% 54% / 55% 55% 45% 45%", ...ink })} />
        <div style={pos({ left: 1080, top: 120, width: 300, height: 260, borderRadius: "50% 45% 45% 50%", ...ink })} />
        <div style={pos({ left: 1330, top: 200, width: 90, height: 110, borderRadius: "40%", ...ink })} />
        <div style={pos({ left: 1150, top: 70, width: 90, height: 120, clipPath: "polygon(0 100%, 50% 0, 100% 100%)", background: INK })} />
        {[[300, 0], [480, 0], [880, 1], [1040, 0]].map(([x, isHock], i) => (
          <div key={i} style={pos({ left: x, top: 470, width: 110, height: 260, borderRadius: "20px 20px 30px 30px", ...ink, overflow: "hidden" })}>
            {isHock ? <div style={pos({ left: 0, right: 0, top: 70, height: 120, background: hot ? `rgba(180,42,34,${glow})` : "transparent" })} /> : null}
          </div>
        ))}
        <div style={pos({ left: 130, top: 200, width: 110, height: 30, borderRadius: 20, border: `7px solid ${INK}`, transform: "rotate(-30deg)" })} />
        {["HAM", "LOIN", "SHOULDER", "BELLY"].map((w, i) => <Hand key={w} txt={w} size={54} color="rgba(42,33,27,.6)" style={pos({ left: [300, 620, 1080, 600][i], top: [260, 180, 220, 380][i] })} />)}
        {hot ? <div style={pos({ left: 680, top: 560, ...pop(f, at(t) + 4) })}>
          <Arrow f={f} at={at(t) + 4} w={190} c={RED} />
        </div> : null}
        {hot ? <div style={pos({ left: 130, top: 540, ...pop(f, at(t) + 8) })}>
          <div style={{ background: RED, borderRadius: 18, padding: "18px 40px", boxShadow: SH, transform: "rotate(-3deg)" }}><Slab txt="THE HOCK" size={90} color={CREAM} /></div>
          <Hand txt="skin, bone, a little meat" size={54} color={INK} f={f} at={at(t) + 18} style={{ marginTop: 14 }} />
        </div> : null}
      </div>
    </AbsoluteFill>
  );
};

// 13 · la sierra parte el garrón en 3: tres veces más hueso al agua
export const HockCut: React.FC<B & { t: number }> = ({ a, a0, d, t }) => {
  const { f, at } = useT0(a, a0);
  const s = ez((f - at(t) + 10) / 16);
  const blade = ez((f - 2) / 18);
  return (
    <AbsoluteFill>
      <Bg m={STEEL} f={f} light={[50, 0, 0.3]} />
      <div style={pos({ left: 0, right: 0, top: 620, bottom: 0, background: MAPLE, boxShadow: "0 -10px 30px rgba(0,0,0,.35)" })} />
      <div style={pos({ left: 870, top: -40 + 0 * blade, width: 26, height: 1200 * blade, background: "repeating-linear-gradient(180deg,#d9dee2 0 10px,#8d959c 10px 14px)", boxShadow: "0 0 20px rgba(255,255,255,.4)", opacity: 1 - s })} />
      {[0, 1, 2].map((i) => (
        <div key={i} style={pos({ left: 330 + i * 380 + (i - 1) * 140 * s, top: 360, transform: `rotate(${(i - 1) * 6 * s}deg)` })}>
          <div style={{ width: 360, height: 300, borderRadius: i === 0 ? "50% 20px 20px 50%" : i === 2 ? "20px 50% 50% 20px" : 20, background: "repeating-linear-gradient(115deg, rgba(60,25,8,.22) 0 5px, transparent 5px 21px), linear-gradient(160deg,#A8642F,#71391A 55%,#4A2009)", boxShadow: SH, position: "relative" }}>
            {s > 0.3 ? <HockEnd s={240} style={pos({ left: 60, top: 30, opacity: cl((s - 0.3) * 2), transform: `scale(${0.8 + 0.2 * s})` })} /> : null}
          </div>
        </div>
      ))}
      <div style={pos({ left: 200, top: 90, ...rise(f, at(t) + 10) })}>
        <div style={{ background: NAVY, borderRadius: 20, padding: "22px 46px", boxShadow: SH, border: `5px solid ${CREAM}` }}><Slab txt="3 PIECES = 3× THE BONE" size={80} color={CREAM} /></div>
      </div>
      <Stamp txt="½ THE TIME" f={f} at={at(t) + 30} size={84} rot={-6} c={GOLD} style={{ left: 1260, top: 820 }} />
    </AbsoluteFill>
  );
};

// 14 · caldo: el agua pasa de clara a dorada mientras el reloj llega a 45 min
export const BrothClock: React.FC<B & { mins: number; t: number }> = ({ a, a0, d, mins, t }) => {
  const { f, at } = useT0(a, a0);
  const p = ez((f - at(t)) / 60);
  const c = `rgb(${Math.round(196 + 30 * p)}, ${Math.round(214 - 50 * p)}, ${Math.round(222 - 140 * p)})`;
  return (
    <AbsoluteFill>
      <Bg m={TILE} f={f} />
      <div style={pos({ left: 0, right: 0, top: 830, bottom: 0, background: "linear-gradient(180deg,#f2f0ea,#d9d5cc)" })} />
      <div style={pos({ left: 160, top: 330, ...rise(f, 2, 140) })}>
        <div style={{ position: "relative", width: 860, height: 520 }}>
          <div style={pos({ left: 0, right: 0, top: 0, bottom: 0, borderRadius: "6px 6px 46% 46% / 6px 6px 22% 22%", overflow: "hidden", background: "linear-gradient(90deg,#7E868D,#D9DEE2 28%,#AEB6BC 52%,#8C949B 78%,#6D757C)", boxShadow: SH })}>
            <div style={pos({ left: 26, right: 26, top: 60, bottom: 26, borderRadius: "0 0 46% 46% / 0 0 24% 24%", background: `linear-gradient(180deg, ${c}, rgba(150,90,30,${0.35 * p}))`, boxShadow: "inset 0 0 40px rgba(0,0,0,.2)" })}>
              {[0, 1, 2].map((i) => <div key={i} style={pos({ left: 120 + i * 220, top: 150 + (i % 2) * 70, transform: `rotate(${i * 30}deg) scale(.42)` })}><HockEnd s={300} /></div>)}
              <div style={pos({ left: 560, top: 90, width: 140, height: 90, borderRadius: "50%", background: "radial-gradient(circle, #f3e6c6, #d9b97a)" })} />
              {Array.from({ length: 10 }, (_, i) => { const y = ((f * 2 + i * 40) % 300); return <div key={i} style={pos({ left: 80 + rnd(i) * 650, top: 380 - y, width: 16, height: 16, borderRadius: "50%", border: "3px solid rgba(255,255,255,.6)", opacity: 0.8 * (1 - y / 300) })} />; })}
            </div>
          </div>
          <div style={pos({ left: -10, right: -10, top: -14, height: 70, borderRadius: "50%", border: "10px solid #C9CFD4", background: `radial-gradient(ellipse, ${c}, rgba(0,0,0,.25))` })} />
        </div>
      </div>
      <div style={pos({ left: 1180, top: 160, ...pop(f, at(t) - 6) })}><Clock s={440} p={p * (mins / 60)} label={`${Math.round(p * mins)} MIN`} c={GOLD} /></div>
      <Hand txt="clear water → gold, smoky broth" size={64} color={NAVY} f={f} at={at(t) + 40} style={pos({ left: 1080, top: 680 })} />
    </AbsoluteFill>
  );
};

// 15 · el poroto es una esponja: se llena de agua gris o de caldo dorado
export const Sponge: React.FC<B & { plain: string; plainOut: string; hock: string; hockOut: string; tP: number; tH: number }> = ({ a, a0, d, plain, plainOut, hock, hockOut, tP, tH }) => {
  const { f, at } = useT0(a, a0);
  const BigBean: React.FC<{ x: number; fill: number; c: string; at0: number }> = ({ x, fill, c, at0 }) => (
    <div style={pos({ left: x, top: 230, width: 620, height: 410, ...rise(f, at0) })}>
      <div style={pos({ inset: 0, borderRadius: "52% 48% 46% 54% / 62% 60% 40% 38%", overflow: "hidden", background: BEAN, boxShadow: "0 30px 50px rgba(0,0,0,.5), inset -20px -26px 40px rgba(0,0,0,.18)" })}>
        <div style={pos({ left: 0, right: 0, bottom: 0, height: `${fill * 100}%`, background: c, transition: "none" })} />
        <div style={pos({ inset: 0, background: "radial-gradient(ellipse 40% 30% at 35% 28%, rgba(255,255,255,.75), transparent)" })} />
        <div style={pos({ left: "46%", top: "30%", width: 26, height: 70, borderRadius: 13, background: "rgba(0,0,0,.12)" })} />
      </div>
    </div>
  );
  return (
    <AbsoluteFill>
      <Board f={f}>
        <BigBean x={120} fill={ez((f - at(tP)) / 30)} c="linear-gradient(180deg, rgba(170,185,190,.85), rgba(140,150,155,.95))" at0={2} />
        <BigBean x={1100} fill={ez((f - at(tH)) / 30)} c="linear-gradient(180deg, rgba(224,166,58,.85), rgba(155,90,42,.95))" at0={6} />
        <Chalk txt={plain} size={70} f={f} at={at(tP)} slab style={pos({ left: 150, top: 80 })} />
        <Chalk txt={plainOut} size={74} f={f} at={at(tP) + 18} color="#B9C3C7" style={pos({ left: 200, top: 700 })} />
        <Chalk txt={hock} size={62} f={f} at={at(tH)} slab color={GOLD} style={pos({ left: 1080, top: 80 })} />
        <Chalk txt={hockOut} size={64} f={f} at={at(tH) + 18} color={YEL} style={pos({ left: 1100, top: 700 })} />
        <Chalk txt="vs" size={120} f={f} at={6} slab style={pos({ left: 840, top: 360 })} />
      </Board>
    </AbsoluteFill>
  );
};

// 16 · perilla de la cocina: de fuego fuerte a burbujas perezosas + tapa entreabierta
export const SimmerDial: React.FC<B & { t1: number; t2: number; t3: number }> = ({ a, a0, d, t1, t2, t3 }) => {
  const { f, at } = useT0(a, a0);
  const ang = -120 + 120 * sp(f, at(t1), 14, 120) - 180 * sp(f, at(t2), 14, 90);
  const hard = f < at(t2);
  const nb = hard ? 34 : 6;
  return (
    <AbsoluteFill>
      <Bg m="linear-gradient(180deg,#F4F2EC,#E2DED4)" f={f} />
      <div style={pos({ left: 140, top: 230, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #fbfbfb, #c9cdd1 70%, #9aa1a7)", boxShadow: SH, ...rise(f, 2) })}>
        <div style={pos({ left: 210, top: 30, width: 100, height: 460, borderRadius: 50, background: "linear-gradient(90deg,#d0d4d8,#ffffff 40%,#b7bdc2)", boxShadow: "0 8px 16px rgba(0,0,0,.3)", transform: `rotate(${ang}deg)` })}>
          <div style={pos({ left: 40, top: 20, width: 20, height: 80, borderRadius: 10, background: RED })} />
        </div>
        {["HI", "MED", "LO"].map((w, i) => <Slab key={w} txt={w} size={42} color={INK} style={pos({ left: [-90, 210, 520][i], top: [80, -80, 80][i] })} />)}
      </div>
      <div style={pos({ left: 880, top: 220, width: 900, height: 560, borderRadius: "50%", overflow: "hidden", border: "18px solid #C9CFD4", boxShadow: SH, background: "radial-gradient(ellipse, #E6C68E, #B9874A)" })}>
        <BeanField n={60} w={860} h={520} size={58} seed={31} />
        {Array.from({ length: nb }, (_, i) => { const c = ((f + i * 7) % (hard ? 14 : 40)) / (hard ? 14 : 40); return <div key={i} style={pos({ left: rnd(i * 3) * 820, top: rnd(i * 5 + 1) * 480, width: (hard ? 70 : 34) * c, height: (hard ? 70 : 34) * c, borderRadius: "50%", border: "4px solid rgba(255,255,255,.7)", opacity: 1 - c })} />; })}
        <div style={pos({ left: 0, right: 0, top: 0, bottom: 0, background: "linear-gradient(180deg,#E3E7EA,#9AA2A9)", borderRadius: "50%", transform: `translateX(${f >= at(t3) ? 100 - 12 * sp(f, at(t3), 14, 100) : 110}%)` })} />
      </div>
      <div style={pos({ left: 960, top: 820, ...pop(f, hard ? at(t1) : at(t2)) })}>
        <div style={{ background: hard ? RED : GREEN, borderRadius: 20, padding: "16px 40px", boxShadow: SH }}><Slab txt={hard ? "HARD BOIL = SPLIT SKINS" : "A FEW LAZY BUBBLES"} size={64} color={CREAM} /></div>
      </div>
      <Stamp txt="LID OPEN A CRACK" f={f} at={at(t3) + 6} size={56} rot={6} c={NAVY} style={{ left: 1260, top: 110 }} />
    </AbsoluteFill>
  );
};

// 17 · advertencia de porotos colorados: tarjeta roja sobre un campo de porotos rojos
export const KidneyWarn: React.FC<B & { t: number }> = ({ a, a0, d, t }) => {
  const { f, at } = useT0(a, a0);
  const p = ez((f - at(t) - 12) / 40);
  return (
    <AbsoluteFill>
      <Drift f={f}><AbsoluteFill style={{ background: "#5a1410" }}><BeanField n={230} w={1920} h={1080} size={80} seed={41} c={(i) => (i % 3 ? "#7B1E1A" : "#9A2A22")} /></AbsoluteFill></Drift>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,.2), rgba(0,0,0,.65))" }} />
      <div style={pos({ left: 200, top: 200, width: 1520, ...rise(f, at(t)) })}>
        <div style={{ background: CREAM, borderRadius: 30, padding: "50px 70px", boxShadow: SH, border: `14px solid ${RED}`, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
            <div style={{ width: 150, height: 130, background: RED, clipPath: "polygon(50% 0, 100% 100%, 0 100%)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}><Slab txt="!" size={100} color={CREAM} /></div>
            <Slab txt="RED KIDNEY BEANS" size={84} color={RED} />
          </div>
          <Slab txt="BOIL HARD 10 MIN FIRST" size={76} color={NAVY} style={{ marginTop: 40 }} />
          <Hand txt="a slow cooker on low is not hot enough" size={58} color={INK} f={f} at={at(t) + 30} style={{ marginTop: 26 }} />
          <div style={pos({ right: 60, top: -90 })}><Clock s={200} p={p * 10 / 60} label="10:00" /></div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 18 · pizarra "NOT UNTIL THEY'RE SOFT": se escriben los ácidos y se sella "AFTER THEY'RE SOFT"
export const AcidBoard: React.FC<B & { items: { txt: string; t: number }[]; tStamp: number }> = ({ a, a0, d, items, tStamp }) => {
  const { f, at } = useT0(a, a0);
  return (
    <AbsoluteFill>
      <Board f={f}>
        <Chalk txt="NOT UNTIL THEY'RE SOFT" size={84} f={f} at={2} slab color={YEL} style={pos({ left: 110, top: 70 })} />
        {items.map((it, i) => (
          <div key={i} style={pos({ left: 170 + (i % 2) * 760, top: 250 + Math.floor(i / 2) * 170, display: "flex", alignItems: "center" })}>
            <Cross f={f} at={at(it.t) + 4} s={70} c="#E46A5E" />
            <Chalk txt={it.txt} size={100} f={f} at={at(it.t)} style={{ marginLeft: 34 }} />
          </div>
        ))}
        <Stamp txt="ONLY AFTER THEY'RE SOFT" f={f} at={at(tStamp)} size={76} rot={-5} c={GREEN} style={{ left: 300, top: 760 }} />
      </Board>
    </AbsoluteFill>
  );
};

// 19 · juego de cucharas medidoras: sólo la de ¼ cucharadita
export const SodaPinch: React.FC<B & { t: number; tNo: number }> = ({ a, a0, d, t, tNo }) => {
  const { f, at } = useT0(a, a0);
  const sizes = [["1 TBSP", 230], ["1 TSP", 190], ["½ TSP", 160], ["¼ TSP", 130]] as const;
  const on = f >= at(t);
  return (
    <AbsoluteFill>
      <Bg m={STEEL} f={f} />
      {sizes.map(([lbl, s], i) => {
        const me = i === 3, dim = on && !me;
        return (
          <div key={lbl} style={pos({ left: 140 + i * 420, top: 330 - (me && on ? 60 * sp(f, at(t), 12, 140) : 0), opacity: dim ? 0.3 : 1, ...rise(f, 2 + i * 4) })}>
            <div style={{ position: "relative", width: s * 1.6, height: s * 3 }}>
              <div style={pos({ left: s * 0.6, top: s * 0.9, width: s * 0.35, height: s * 2, borderRadius: s, background: "linear-gradient(90deg,#8d959c,#eef1f3 40%,#9aa3ab)", boxShadow: SH })} />
              <div style={pos({ left: 0, top: 0, width: s * 1.6, height: s, borderRadius: "50%", background: "radial-gradient(ellipse at 45% 35%, #ffffff, #b9c0c6 60%, #7e868d)", boxShadow: SH })}>
                {me && on ? <div style={pos({ inset: s * 0.14, borderRadius: "50%", background: "radial-gradient(circle at 40% 30%, #fff, #e8e8e8)", boxShadow: "inset 0 -4px 6px rgba(0,0,0,.15)" })} /> : null}
              </div>
            </div>
            <Slab txt={lbl} size={me ? 72 : 52} color={me && on ? GOLD : CREAM} style={{ textShadow: "0 4px 10px rgba(0,0,0,.6)" }} />
          </div>
        );
      })}
      <div style={pos({ left: 150, top: 90, ...rise(f, at(t)) })}>
        <div style={{ background: NAVY, borderRadius: 20, padding: "20px 46px", boxShadow: SH, border: `5px solid ${CREAM}` }}><Slab txt="BAKING SODA: JUST A PINCH" size={72} color={CREAM} /></div>
      </div>
      <Stamp txt="NO MORE" f={f} at={at(tNo)} size={110} rot={-10} style={{ left: 1150, top: 800 }} />
    </AbsoluteFill>
  );
};

// 20 · cinco porotos en la cuchara: el centro blanco se vuelve cremoso, uno por uno
export const FiveBeans: React.FC<B & { ts: number[] }> = ({ a, a0, d, ts }) => {
  const { f, at } = useT0(a, a0);
  return (
    <AbsoluteFill>
      <Bg m={KRAFT} f={f} />
      <div style={pos({ left: 120, top: 280, width: 1680, height: 520, ...rise(f, 2) })}>
        <div style={pos({ left: 1300, top: 220, width: 560, height: 90, borderRadius: 45, background: "linear-gradient(180deg,#e9edf0,#8d959c)", boxShadow: SH })} />
        <div style={pos({ left: 0, top: 0, width: 1360, height: 520, borderRadius: "50%", background: "radial-gradient(ellipse at 45% 35%, #ffffff, #c4cbd1 60%, #858d94)", boxShadow: SH })} />
        {ts.map((t, i) => {
          const u = ez((f - at(t)) / 14);
          return (
            <div key={i} style={pos({ left: 140 + i * 230, top: 150 })}>
              <div style={{ width: 200, height: 140, borderRadius: "52% 48% 46% 54% / 62% 60% 40% 38%", background: `radial-gradient(ellipse 40% 30% at 35% 28%, rgba(255,255,255,.8), transparent), radial-gradient(ellipse 26% 22% at 50% 52%, rgba(255,255,255,${1 - u}) 0 60%, transparent 62%), #E9D3A8`, boxShadow: "0 8px 12px rgba(0,0,0,.3)" }} />
              <div style={pos({ left: 70, top: -110 })}>{f >= at(t) ? <Check f={f} at={at(t) + 6} s={80} /> : <Slab txt={`${i + 1}`} size={70} color={NAVY} />}</div>
            </div>
          );
        })}
      </div>
      <div style={pos({ left: 160, top: 90, ...rise(f, 4) })}><Slab txt="BITE ALL FIVE" size={100} color={NAVY} style={{ textShadow: "0 3px 0 rgba(255,255,255,.4)" }} /></div>
      <Hand txt="no chalky little center = done" size={66} color={INK} f={f} at={at(ts[4]) + 10} style={pos({ left: 170, top: 860 })} />
    </AbsoluteFill>
  );
};

// 21 · el plan del viernes en papelitos amarillos clavados en el corcho del local
export const FridayPlan: React.FC<B & { rows: { when: string; txt: string; t: number }[] }> = ({ a, a0, d, rows }) => {
  const { f, at } = useT0(a, a0);
  return (
    <AbsoluteFill>
      <Bg m={CORK} f={f} light={[40, 0, 0.25]} />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 0 34px #8a6235, inset 0 0 0 40px #6b4a28, inset 0 0 80px rgba(0,0,0,.5)" }} />
      <div style={pos({ left: 120, top: 80, ...rise(f, 2) })}><Slab txt="YOUR FIRST FRIDAY" size={90} color={CREAM} style={{ textShadow: "0 5px 12px rgba(0,0,0,.6)" }} /></div>
      <div style={pos({ left: 140, right: 140, top: 520, height: 8, borderRadius: 4, background: "rgba(42,33,27,.5)" })} />
      {rows.map((r, i) => {
        const u = sp(f, at(r.t), 13, 150);
        return (
          <div key={i} style={pos({ left: 110 + i * 430, top: 260 + (i % 2) * 70, opacity: cl(u * 3), transform: `translateY(${(1 - u) * -120}px) rotate(${(i % 2 ? 3 : -3) + (1 - u) * 10}deg)` })}>
            <Slip w={380}><Slab txt={r.when} size={70} color={NAVY} /><Hand txt={r.txt} size={64} color={INK} f={f} at={at(r.t) + 8} style={{ marginTop: 10 }} /></Slip>
          </div>
        );
      })}
      <Stamp txt="BETTER THE NEXT DAY" f={f} at={at(rows[rows.length - 1].t) + 24} size={64} rot={-4} c={RED} style={{ left: 620, top: 820 }} />
    </AbsoluteFill>
  );
};

// 22 · un garrón de 2 dólares → una taza de carne picada
export const HockYield: React.FC<B & { t: number }> = ({ a, a0, d, t }) => {
  const { f, at } = useT0(a, a0);
  const fill = ez((f - at(t)) / 30);
  return (
    <AbsoluteFill>
      <Bg m={BUTCHER} f={f} />
      <div style={pos({ left: 110, top: 360, ...rise(f, 2) })}><Hock w={640} /></div>
      <div style={pos({ left: 220, top: 200, ...pop(f, 8) })}><Tag w={280} rot={-8}><Slab txt="$2" size={110} color={RED} /></Tag></div>
      <Arrow f={f} at={at(t) - 6} w={220} c={NAVY} style={pos({ left: 820, top: 520 })} />
      <div style={pos({ left: 1120, top: 250, ...rise(f, at(t) - 4) })}>
        <div style={{ position: "relative", width: 520, height: 560 }}>
          <div style={pos({ left: 0, top: 0, right: 0, bottom: 0, borderRadius: "10px 10px 70px 70px", overflow: "hidden", background: "linear-gradient(90deg, rgba(255,255,255,.55), rgba(220,235,245,.25) 30%, rgba(255,255,255,.4))", border: "6px solid rgba(255,255,255,.85)", boxShadow: SH })}>
            <div style={pos({ left: 0, right: 0, bottom: 0, height: `${fill * 82}%`, overflow: "hidden" })}>
              {Array.from({ length: 120 }, (_, i) => <div key={i} style={pos({ left: rnd(i) * 480, bottom: rnd(i * 7) * 460, width: 34 + rnd(i * 3) * 20, height: 28 + rnd(i * 5) * 16, borderRadius: 6, background: i % 4 ? HAM : "#B86450", transform: `rotate(${rnd(i * 9) * 90}deg)`, boxShadow: "0 2px 3px rgba(0,0,0,.25)" })} />)}
            </div>
            {[0.25, 0.5, 0.75].map((p) => <div key={p} style={pos({ right: 0, top: `${(1 - p) * 82 + 18}%`, width: 80, height: 5, background: "rgba(40,60,90,.6)" })} />)}
          </div>
        </div>
        <Slab txt="1 CUP OF MEAT" size={84} color={NAVY} style={{ marginTop: 26 }} />
      </div>
    </AbsoluteFill>
  );
};

// 23 · ocho platos de la olla → cuatro bolsas planas de 2 tazas
export const BowlsToBags: React.FC<B & { bowls: number; bags: number; tBowls: number; tBags: number }> = ({ a, a0, d, bowls, bags, tBowls, tBags }) => {
  const { f, at } = useT0(a, a0);
  const m = sp(f, at(tBags), 15, 110);
  return (
    <AbsoluteFill>
      <Bg m="radial-gradient(ellipse at 50% 20%, #F4F8FB, #CFDCE6)" f={f} />
      <AbsoluteFill style={{ background: "repeating-linear-gradient(135deg, rgba(255,255,255,.18) 0 3px, transparent 3px 22px)" }} />
      {Array.from({ length: bowls }, (_, i) => (
        <div key={i} style={pos({ left: 140 + (i % 4) * 230 + m * 40, top: 210 + Math.floor(i / 4) * 250, opacity: 1 - 0.7 * m, transform: `scale(${1 - 0.25 * m})`, ...pop(f, at(tBowls) + i * 2) })}><Bowl s={210} seed={i * 7} /></div>
      ))}
      <Slab txt={`${bowls} BOWLS`} size={90} color={NAVY} style={pos({ left: 300, top: 80, ...rise(f, at(tBowls)) })} />
      {Array.from({ length: bags }, (_, i) => (
        <div key={i} style={pos({ left: 1120 + (i % 2) * 360, top: 200 + Math.floor(i / 2) * 360, ...rise(f, at(tBags) + i * 4) })}>
          <div style={{ width: 330, height: 300, borderRadius: 18, overflow: "hidden", position: "relative", background: "linear-gradient(180deg, rgba(255,255,255,.5), rgba(255,255,255,.2))", border: "4px solid rgba(255,255,255,.9)", boxShadow: SH }}>
            <div style={pos({ left: 0, right: 0, top: 26, height: 10, background: "linear-gradient(180deg,#5b8ad8,#2b5aa8)" })} />
            <div style={pos({ left: 16, right: 16, top: 70, bottom: 16, borderRadius: 12, overflow: "hidden", background: "#D9AE6E" })}><BeanField n={22} w={300} h={210} size={44} seed={i * 13} c={(k) => (k % 6 === 0 ? HAM : BEAN)} /></div>
            <Hand txt="2 cups · Oct" size={40} color={NAVY} style={pos({ left: 30, top: 80, background: "rgba(255,255,255,.75)", padding: "0 12px", borderRadius: 6 })} />
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

// 24 · freezer 6 meses / heladera 4 días
export const KeepTimes: React.FC<B & { a: any; aT: string; b: string; bT: string; tA: number; tB: number }> = (p: any) => {
  const { a, a0, aT, b, bT, tA, tB } = p;
  const A = p.a_ ?? p["a"]; // a = segundo de inicio (contrato del Player); el texto "6 months" llega como prop aparte
  const { f, at } = useT0(a, a0);
  const flake = (x: number, y: number, s: number) => <div style={pos({ left: x, top: y, width: s, height: s })}>{[0, 60, 120].map((r) => <div key={r} style={pos({ left: 0, top: s / 2 - 4, width: s, height: 8, borderRadius: 4, background: "#fff", transform: `rotate(${r}deg)` })} />)}</div>;
  return (
    <AbsoluteFill>
      <Drift f={f}><AbsoluteFill style={{ background: "linear-gradient(90deg, #BFD8EA 0 50%, #F3F1EA 50%)" }} /></Drift>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 20% 30%, rgba(255,255,255,.6) 0 2px, transparent 3px) 0 0/40px 36px", clipPath: "inset(0 50% 0 0)" }} />
      {flake(160, 140, 120)}{flake(700, 760, 90)}
      <div style={pos({ left: 110, top: 320, ...rise(f, at(tA)) })}>
        <Slab txt={p.mo || "6 MONTHS"} size={120} color={NAVY} />
        <Hand txt={aT} size={90} color="#2b5aa8" />
      </div>
      <div style={pos({ left: 1080, top: 320, ...rise(f, at(tB)) })}>
        <Slab txt={b.toUpperCase()} size={140} color={RED} />
        <Hand txt={bT} size={90} color={INK} />
      </div>
      <div style={pos({ left: 955, top: 0, width: 10, bottom: 0, background: "linear-gradient(180deg,#9aa3ab,#e4e8eb,#9aa3ab)" })} />
      {A === undefined ? null : null}
    </AbsoluteFill>
  );
};

// 25 · problemas del mostrador: papelitos de pedido con problema → arreglo
export const Trouble: React.FC<B & { rows: { p: string; fix: string; t: number }[] }> = ({ a, a0, d, rows }) => {
  const { f, at } = useT0(a, a0);
  return (
    <AbsoluteFill>
      <Bg m={MAPLE} f={f} />
      <div style={pos({ left: 120, top: 70, ...rise(f, 2) })}><Slab txt="AT THE COUNTER" size={90} color={CREAM} style={{ textShadow: "0 5px 12px rgba(0,0,0,.6)" }} /></div>
      {rows.map((r, i) => {
        const u = sp(f, at(r.t), 14, 140);
        return (
          <div key={i} style={pos({ left: 200 + i * 800, top: 260, opacity: cl(u * 3), transform: `translateY(${(1 - u) * 300}px) rotate(${[-3, 2, -1][i]}deg)` })}>
            <Slip w={700} pin={false}>
              <Hand txt={r.p} size={74} color={RED} />
              <div style={{ height: 4, background: "rgba(42,33,27,.4)", margin: "16px 0" }} />
              <Hand txt={"→ " + r.fix} size={54} color={NAVY} f={f} at={at(r.t) + 14} />
            </Slip>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 26 · la cuenta: ticket de latas tachado vs sumas a mano en papel kraft → 50¢ el plato
export const PotMath: React.FC<B & { L_: { txt: string; v: string; t: number }; R_: { rows: { txt: string; v: string; t: number }[]; tot: string; t: number }; big: string; tBig: number }> = ({ a, a0, d, L_, R_, big, tBig }) => {
  const { f, at } = useT0(a, a0);
  return (
    <AbsoluteFill>
      <Bg m={KRAFT} f={f} />
      <div style={pos({ left: 110, top: 180, width: 560, padding: "50px 50px", background: "#FBFBF7", boxShadow: SH, transform: "rotate(-3deg)", ...rise(f, at(L_.t)) })}>
        <Slab txt="FROM CANS" size={52} color="#555" />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, position: "relative" }}>
          <Hand txt={L_.txt} size={80} color={INK} /><Hand txt={L_.v} size={80} color={INK} />
          <Strike f={f} at={at(R_.t)} />
        </div>
      </div>
      <div style={pos({ left: 800, top: 110, ...rise(f, at(R_.rows[0].t) - 4) })}>
        <div style={{ width: 960, padding: "50px 60px", background: BUTCHER, boxShadow: SH, transform: "rotate(1.5deg)" }}>
          <Slab txt="FRIDAY POT" size={60} color={NAVY} style={{ marginBottom: 20 }} />
          {R_.rows.map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", height: 110, alignItems: "center" }}>
              <Hand txt={r.txt} size={72} color={INK} f={f} at={at(r.t)} /><Hand txt={r.v} size={72} color={INK} f={f} at={at(r.t) + 8} />
            </div>
          ))}
          <div style={{ height: 6, background: INK, transformOrigin: "left", transform: `scaleX(${ez((f - at(R_.t)) / 10)})`, margin: "10px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Hand txt="whole pot" size={80} color={NAVY} f={f} at={at(R_.t)} /><Slab txt={R_.tot} size={130} color={GREEN} style={pop(f, at(R_.t) + 6)} />
          </div>
        </div>
      </div>
      <Stamp txt={big.toUpperCase()} f={f} at={at(tBig)} size={110} rot={-6} c={RED} style={{ left: 160, top: 760 }} />
    </AbsoluteFill>
  );
};

// 27 · ahorro: $5 → $2 por semana y un frasco que se llena de monedas hasta $150 al año
export const YearSave: React.FC<B & { a: any; aT: string; b: string; bT: string; big: string; bigT: string; tA: number; tB: number; tBig: number } & { five?: string }> = (p: any) => {
  const { a, a0, aT, b, bT, big, bigT, tA, tB, tBig } = p;
  const { f, at } = useT0(a, a0);
  const fill = ez((f - at(tBig)) / 40);
  const n = Math.round(150 * fill);
  return (
    <AbsoluteFill>
      <Bg m={TILE} f={f} />
      <div style={pos({ left: 110, top: 160, ...rise(f, at(tA)) })}>
        <div style={{ position: "relative", background: CREAM, borderRadius: 22, padding: "24px 44px", boxShadow: SH, border: `5px solid ${RED}` }}>
          <Slab txt={p.five || "$5"} size={120} color={RED} /><Hand txt={aT} size={54} color={INK} />
          <Strike f={f} at={at(tB)} />
        </div>
      </div>
      <div style={pos({ left: 110, top: 520, ...rise(f, at(tB)) })}>
        <div style={{ background: NAVY, borderRadius: 22, padding: "24px 44px", boxShadow: SH, border: `5px solid ${GOLD}` }}><Slab txt={b} size={120} color={CREAM} /><Hand txt={bT} size={54} color={GOLD} /></div>
      </div>
      <div style={pos({ left: 900, top: 170, ...rise(f, at(tBig) - 6) })}>
        <div style={{ position: "relative", width: 480, height: 640 }}>
          <div style={pos({ left: 60, right: 60, top: 0, height: 70, borderRadius: 12, background: "linear-gradient(180deg,#d9b04a,#9a7420)", boxShadow: SH })} />
          <div style={pos({ left: 0, right: 0, top: 60, bottom: 0, borderRadius: "40px 40px 60px 60px", overflow: "hidden", background: "linear-gradient(90deg, rgba(255,255,255,.55), rgba(220,235,245,.2) 30%, rgba(255,255,255,.4))", border: "6px solid rgba(255,255,255,.85)", boxShadow: SH })}>
            {Array.from({ length: 90 }, (_, i) => i < 90 * fill ? <div key={i} style={pos({ left: 20 + rnd(i) * 380, bottom: 10 + Math.floor(i / 9) * 52 + rnd(i * 3) * 10, width: 64, height: 22, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 30%, #f2f4f6, #9aa3ab 70%, #6e767d)", boxShadow: "0 3px 4px rgba(0,0,0,.35)" })} /> : null)}
          </div>
        </div>
      </div>
      <div style={pos({ left: 1420, top: 330, ...pop(f, at(tBig)) })}><Slab txt={`$${n}`} size={190} color={GREEN} /><Hand txt={bigT} size={80} color={INK} /></div>
      {big ? null : null}
    </AbsoluteFill>
  );
};

// 28 · tarea en ficha: casilleros que se tildan
export const Homework: React.FC<B & { items: { txt: string; t: number }[] }> = ({ a, a0, d, items }) => {
  const { f, at } = useT0(a, a0);
  return (
    <AbsoluteFill>
      <Bg m={MAPLE} f={f} />
      <div style={pos({ left: 330, top: 60, ...rise(f, 2) })}>
        <Card w={1260} rot={-1}>
          <Slab txt="HOMEWORK, THIS WEEK" size={70} color={RED} style={{ marginBottom: 24 }} />
          {items.map((it, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", height: 124 }}>
              <div style={{ width: 70, height: 70, border: `6px solid ${NAVY}`, borderRadius: 8, marginRight: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>{f >= at(it.t) ? <Check f={f} at={at(it.t) + 4} s={56} /> : null}</div>
              <Hand txt={it.txt} size={76} color={INK} f={f} at={at(it.t)} />
            </div>
          ))}
        </Card>
      </div>
    </AbsoluteFill>
  );
};

// 29 · pregunta para comentarios: papelito clavado en el corcho + 3 opciones
export const AskCard: React.FC<B & { q: string; opts: string[]; t: number }> = ({ a, a0, d, q, opts, t }) => {
  const { f, at } = useT0(a, a0);
  return (
    <AbsoluteFill>
      <Bg m={CORK} f={f} />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 0 34px #8a6235, inset 0 0 0 40px #6b4a28, inset 0 0 80px rgba(0,0,0,.5)" }} />
      <div style={pos({ left: 260, top: 120, ...rise(f, 2) })}>
        <Slip w={1400} rot={-1.5}>
          <Slab txt="TELL ME IN THE COMMENTS" size={60} color={RED} />
          <Hand txt={q} size={76} color={NAVY} f={f} at={at(t)} dur={22} style={{ marginTop: 20 }} />
        </Slip>
      </div>
      {opts.map((o, i) => (
        <div key={o} style={pos({ left: 300 + i * 470, top: 640, ...pop(f, at(t) + 22 + i * 8) })}>
          <div style={{ background: [GOLD, CREAM, "#9CC28B"][i], borderRadius: 60, padding: "26px 54px", boxShadow: SH, transform: `rotate(${[-4, 2, -2][i]}deg)` }}><Slab txt={o} size={62} color={INK} /></div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

// overlay · número de truco: tapa de olla azul con el número + cinta crema con el título (arriba a la izquierda, sobre Helen)
export const TrickNo: React.FC<{ n: number; txt: string; d: number; a?: number }> = ({ n, txt, d }) => {
  const f = useCurrentFrame();
  const u = sp(f, 0, 12, 150), o = 1 - ez((f - (d - 10)) / 10);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 56, top: 46, display: "flex", alignItems: "center", opacity: o }}>
        <div style={{ width: 200, height: 200, borderRadius: "50%", zIndex: 2, transform: `scale(${u}) rotate(${(1 - u) * -120}deg)`,
          background: "radial-gradient(circle at 38% 30%, #3b4e78, #1E2B45 60%, #121a2b)", border: `9px solid ${CREAM}`, boxShadow: SH, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 54, height: 16, borderRadius: 8, background: CREAM, marginBottom: 6, opacity: 0.85 }} />
          <Slab txt={`${n}`} size={96} color={CREAM} />
        </div>
        <div style={{ marginLeft: -44, background: BUTCHER, padding: "20px 44px 20px 74px", borderRadius: "0 14px 14px 0", boxShadow: SH, clipPath: `inset(0 ${100 - 100 * ez((f - 6) / 12)}% 0 0)` }}>
          <Hand txt={txt} size={60} color={NAVY} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

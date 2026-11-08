// c11d.tsx · componentes ÚNICOS de rm6nd (sesE, Ramón: «5 engines I'd never buy, even if the car is cheap»). Inglés.
// Ninguno repite rm6na (c6a), rm6nb (c7b), rm6nc (c9c) ni tec5na-d (c5a/c5b/c8c/c10d). Objetos dibujados en código; 3D = CSS 3D real.
// El tiempo tt de Stage llega comprimido a ~0-4,4 s: toda la animación vive en esa ventana. Tag sólo dibuja ≤12 caracteres.
import React from "react";
import { cl, DIM, eio, H, HAND, lerp, MZ, phys, RED, rnd, Stage, Tag, TX, VER } from "./ckit";

type C = React.FC<{ t: number; h: H }>;
const ab = (x: number, y: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: x, top: y, ...extra });
const F = "'Arial Black', Arial, sans-serif";
const M = "'Courier New', monospace";
const PAPER = "linear-gradient(#fbf7ea,#ece3cb)";
const STEEL = "linear-gradient(#cfd5db,#7d868f)", IRONC = "linear-gradient(#5d646c,#2c3137)", OIL = "#c98a1d", COOL = "#38c6a0";
const txt = (x: number, y: number, s: number, c: string, o = 1, font = F): React.CSSProperties => ({ position: "absolute", left: x, top: y, fontFamily: font, fontSize: s, fontWeight: 900, color: c, opacity: o, lineHeight: 1.05, whiteSpace: "nowrap" });
const mid = (w: number, y: number, s: number, c: string, o = 1, font = F): React.CSSProperties => ({ ...txt(0, y, s, c, o, font), width: w, textAlign: "center" });
const shadow = "0 34px 70px rgba(0,0,0,.55)";
const Check: React.FC<{ x: number; y: number; k: number; s?: number; c?: string }> = ({ x, y, k, s = 1, c = VER }) => (
  <svg style={ab(x, y)} width={70 * s} height={60 * s} viewBox="0 0 70 60"><path d="M6 32 L26 52 L64 8" fill="none" stroke={c} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={100} strokeDashoffset={100 * (1 - cl(k))} /></svg>
);
const XMark: React.FC<{ x: number; y: number; k: number; s?: number }> = ({ x, y, k, s = 1 }) => (
  <svg style={ab(x, y)} width={80 * s} height={80 * s} viewBox="0 0 80 80"><path d="M10 10 L70 70 M70 10 L10 70" fill="none" stroke={RED} strokeWidth={12} strokeLinecap="round" strokeDasharray={90} strokeDashoffset={90 * (1 - cl(k))} /></svg>
);
const Stamp: React.FC<{ x: number; y: number; k: number; txt: string; c?: string; r?: number; s?: number }> = ({ x, y, k, txt: tx, c = RED, r = -12, s = 1 }) => {
  const z = cl(k); if (z <= 0) return null;
  return <div style={ab(x, y, { transform: `translate(-50%,-50%) rotate(${r}deg) scale(${(1.8 - 0.8 * eio(z, 0, 1)) * s})`, opacity: cl(z * 3), border: `8px solid ${c}`, borderRadius: 14, padding: "8px 26px", fontFamily: F, fontSize: 54, color: c, letterSpacing: 3, whiteSpace: "nowrap", background: "rgba(255,255,255,.04)" })}>{tx}</div>;
};
const Card: React.FC<{ x: number; y: number; w: number; h: number; k: number; r?: number; bg?: string; children?: React.ReactNode }> = ({ x, y, w, h, k, r = 0, bg = PAPER, children }) => (
  <div style={ab(x, y + (1 - cl(k)) * 260, { width: w, height: h, borderRadius: 16, background: bg, boxShadow: shadow, opacity: cl(k * 2), transform: `rotate(${r * (1 - cl(k)) + r * 0.2}deg)` })}>{children}</div>
);
// bloque de motor visto de frente (n = cilindros visibles arriba)
const Block: React.FC<{ x: number; y: number; w: number; n: number; s?: number; glow?: number; c?: string }> = ({ x, y, w, n, s = 1, glow = 0, c = "#59616a" }) => (
  <div style={ab(x, y, { width: w * s, height: w * 0.62 * s, borderRadius: 18 * s, background: `linear-gradient(${c},#23282d)`, boxShadow: `0 0 ${80 * glow}px rgba(235,70,40,${0.75 * glow}), ${shadow}` })}>
    <div style={ab(w * 0.08 * s, -w * 0.12 * s, { width: w * 0.84 * s, height: w * 0.16 * s, borderRadius: 10 * s, background: "linear-gradient(#8a939c,#4b5259)" })} />
    {Array.from({ length: n }, (_, i) => <div key={i} style={ab(w * 0.1 * s + (i * w * 0.8 * s) / n + (w * 0.8 * s) / n / 2 - w * 0.045 * s, w * 0.12 * s, { width: w * 0.09 * s, height: w * 0.09 * s, borderRadius: "50%", background: "#15191d", boxShadow: "inset 0 4px 8px rgba(255,255,255,.15)" })} />)}
    <div style={ab(w * 0.1 * s, w * 0.36 * s, { width: w * 0.8 * s, height: 6 * s, background: "rgba(255,255,255,.12)" })} />
  </div>
);
// varilla de aceite (lvl 0..1 dónde llega el aceite; sp = brillitos)
const Dipstick: React.FC<{ x: number; y: number; lvl: number; sp?: number; r?: number; len?: number }> = ({ x, y, lvl, sp = 0, r = 0, len = 760 }) => (
  <div style={ab(x, y, { width: len, height: 30, transform: `rotate(${r}deg)`, transformOrigin: "0 50%" })}>
    <div style={ab(0, -18, { width: 70, height: 66, borderRadius: 33, background: "linear-gradient(#f0c419,#b88d07)" })} />
    <div style={ab(60, 6, { width: len - 60, height: 18, borderRadius: 9, background: STEEL })} />
    <div style={ab(len - 230, 6, { width: 230 * cl(lvl), height: 18, borderRadius: 9, background: `linear-gradient(90deg,${OIL},#8a5a10)`, marginLeft: 230 * (1 - cl(lvl)) })} />
    {[len - 200, len - 80].map((m, i) => <div key={i} style={ab(m, -4, { width: 6, height: 38, background: "#222" })} />)}
    <div style={txt(len - 214, 40, 26, DIM)}>MIN</div><div style={txt(len - 100, 40, 26, DIM)}>MAX</div>
    {sp > 0 && Array.from({ length: 14 }, (_, i) => <div key={i} style={ab(len - 220 + rnd(i) * 200, 4 + rnd(i + 9) * 20, { width: 7, height: 7, borderRadius: 2, background: "#fff6c8", opacity: cl(sp) * (0.4 + 0.6 * Math.abs(Math.sin(i * 1.7 + sp * 9))), boxShadow: "0 0 10px #fff" })} />)}
  </div>
);
const Odo: React.FC<{ x: number; y: number; v: number; s?: number; c?: string }> = ({ x, y, v, s = 1, c = TX }) => {
  const d = String(Math.max(0, Math.round(v))).padStart(6, "0").split("");
  return <div style={ab(x, y, { display: "flex", gap: 8 * s, padding: 14 * s, borderRadius: 14 * s, background: "#0d0f12", boxShadow: "inset 0 0 0 4px #3a3f45, " + shadow })}>
    {d.map((ch, i) => <div key={i} style={{ width: 62 * s, height: 92 * s, borderRadius: 8 * s, background: "linear-gradient(#1c2024,#30363c 50%,#1c2024)", color: c, fontFamily: M, fontWeight: 900, fontSize: 70 * s, textAlign: "center", lineHeight: `${92 * s}px` }}>{ch}</div>)}
  </div>;
};
const Bubble: React.FC<{ x: number; y: number; w: number; k: number; children: React.ReactNode; dark?: boolean; tail?: "l" | "r" }> = ({ x, y, w, k, children, dark, tail = "l" }) => (
  <div style={ab(x, y, { width: w, padding: "28px 36px", borderRadius: 36, background: dark ? "#2a3440" : "#f6f1e4", color: dark ? TX : "#24262a", fontFamily: F, fontSize: 46, lineHeight: 1.15, boxShadow: shadow, opacity: cl(k * 2), transform: `scale(${0.7 + 0.3 * phys(k, 0, 6, 0.5)})`, transformOrigin: tail === "l" ? "10% 100%" : "90% 100%" })}>
    {children}
    <div style={ab(tail === "l" ? 50 : w - 30, "100%" as any, { width: 0, height: 0, borderLeft: "26px solid transparent", borderRight: "26px solid transparent", borderTop: `34px solid ${dark ? "#2a3440" : "#f6f1e4"}`, marginTop: -2 })} />
  </div>
);

// 1 · el cartel del parabrisas cae ($4,900) y el capó se abre: adentro, el motor late en rojo
const Parabrisas: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#1b2027">{(tt) => {
  const s = phys(tt, 0.3, 6, 0.5), hood = eio(tt, 1.9, 3.0);
  return <>
    <div style={ab(360, 160, { width: 1200, height: 360, clipPath: "polygon(10% 0,90% 0,100% 100%,0 100%)", background: "linear-gradient(160deg,rgba(150,185,215,.45),rgba(25,40,58,.9))", boxShadow: "inset 0 0 0 10px #0e1216" })} />
    <div style={ab(1080, 210 + (1 - s) * -280, { width: 330, height: 220, borderRadius: 14, background: "linear-gradient(#ffe14d,#f0b90b)", transform: `rotate(${-4 + (1 - s) * 18}deg)`, boxShadow: shadow })}>
      <div style={mid(330, 30, 40, "#3a2a00")}>ONLY</div><div style={mid(330, 88, 92, "#c4140a")}>$4,900</div>
    </div>
    <div style={{ position: "absolute", left: 300, top: 560, width: 1320, height: 400, perspective: 1600 }}>
      <div style={ab(220, 90, { width: 880, height: 290 })}><Block x={140} y={20} w={600} n={4} glow={hood * (0.6 + 0.4 * Math.sin(tt * 9))} /></div>
      <div style={ab(0, 0, { width: 1320, height: 400, borderRadius: "40px 40px 12px 12px", background: "linear-gradient(#3b4552,#1d232b)", transformOrigin: "50% 0", transform: `rotateX(${-hood * 78}deg)`, boxShadow: shadow })} />
    </div>
    <Tag tt={tt} at={3.3} x={960} y={110} txt="WHY CHEAP?" col={MZ} />
  </>;
}}</Stage>;

// 2 · cinco bloques de motor en fila; los números 5→1 se dan vuelta; el 1 queda en rojo
const CincoMotores: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#181c22">{(tt) => {
  const N = [6, 4, 8, 8, 4];
  return <>
    {N.map((n, i) => { const s = phys(tt, 0.2 + i * 0.22, 7, 0.5), f = eio(tt, 1.5 + i * 0.4, 1.9 + i * 0.4), one = i === 4;
      return <div key={i} style={ab(110 + i * 350, 330 + (1 - s) * 300, { width: 320, height: 420, opacity: cl(s * 2) })}>
        <Block x={10} y={160} w={300} n={n} glow={one ? cl(tt - 3.2) : 0} c={one ? "#6a3a34" : "#59616a"} />
        <div style={{ position: "absolute", left: 90, top: 0, width: 140, height: 140, perspective: 800 }}>
          <div style={{ width: 140, height: 140, borderRadius: "50%", background: one ? RED : "#e9e2cf", transform: `rotateY(${180 - 180 * f}deg)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontSize: 92, color: one ? "#fff" : "#2b2b2b", boxShadow: shadow, opacity: f > 0.5 ? 1 : 0.25 }}>{f > 0.5 ? 5 - i : ""}</div>
        </div>
      </div>; })}
    <Tag tt={tt} at={3.6} x={960} y={150} txt="NOT BRANDS" col={MZ} />
  </>;
}}</Stage>;

// 3 · tres documentos caen en abanico con sellos; el rumor del estacionamiento se tacha
const Papeleo: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#1f1d1a">{(tt) => {
  const D = ["RECALL", "LAWSUIT", "BULLETIN"];
  return <>
    {D.map((d, i) => { const k = phys(tt, 0.3 + i * 0.35, 6, 0.5);
      return <Card key={i} x={170 + i * 390} y={200 + i * 30} w={360} h={560} k={k} r={-8 + i * 8}>
        {Array.from({ length: 8 }, (_, j) => <div key={j} style={ab(40, 120 + j * 52, { width: 220 + rnd(j + i * 9) * 60, height: 12, borderRadius: 6, background: "#c9bea4" })} />)}
        <Stamp x={180} y={250} k={(tt - 1.4 - i * 0.35) * 2.5} txt={d} r={-14 + i * 6} s={0.72} />
      </Card>; })}
    <div style={ab(1400, 330, { opacity: cl((tt - 0.6) * 3) })}>
      <Bubble x={0} y={0} w={420} k={cl((tt - 0.6) * 2)} dark tail="r"><span style={{ fontFamily: HAND, fontSize: 60 }}>"I heard that..."</span></Bubble>
      <XMark x={150} y={10} k={(tt - 2.8) * 2.5} s={1.6} />
    </div>
    <Tag tt={tt} at={3.4} x={960} y={960} txt="PAPERWORK" col={MZ} />
  </>;
}}</Stage>;

// 4 · el estacionamiento del súper visto de arriba: uno de cada tres autos se prende en rojo
const Estacionamiento: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#1a1d20">{(tt) => {
  const cols = 9, rows = 4, lit = Math.floor(cl((tt - 1.0) / 2.4) * 12);
  const idx = [2, 7, 10, 14, 17, 21, 24, 29, 31, 4, 19, 34];
  return <>
    <div style={ab(150, 170, { width: 1620, height: 760, background: "#2c2f33", borderRadius: 20, transform: "perspective(1800px) rotateX(38deg)", transformOrigin: "50% 100%" })}>
      {Array.from({ length: cols * rows }, (_, i) => { const c = i % cols, r = Math.floor(i / cols), on = idx.slice(0, lit).includes(i), k = phys(tt, 0.1 + (c + r) * 0.06, 8, 0.6);
        return <div key={i} style={ab(40 + c * 176, 40 + r * 180, { width: 140, height: 150, opacity: cl(k * 2) })}>
          <div style={ab(-18, -10, { width: 6, height: 170, background: "#e9e2cf", opacity: 0.6 })} />
          <div style={ab(20, 10 + (1 - k) * -60, { width: 100, height: 140, borderRadius: 24, background: on ? "linear-gradient(#ff5a44,#9c1c14)" : `hsl(${(i * 47) % 360},12%,${42 + (i % 3) * 8}%)`, boxShadow: on ? "0 0 40px rgba(255,80,50,.8)" : "0 10px 20px rgba(0,0,0,.5)" })}>
            <div style={ab(14, 28, { width: 72, height: 34, borderRadius: 8, background: "rgba(20,30,40,.7)" })} />
          </div>
        </div>; })}
    </div>
    <div style={txt(1420, 90, 110, RED, cl((tt - 1.2) * 3))}>×100</div>
    <Tag tt={tt} at={3.5} x={720} y={110} txt="EVERYWHERE" col={MZ} />
  </>;
}}</Stage>;

// 5 · la carta de la señora: la letra aparece trazo a trazo y la última frase se subraya en rojo
const CartaSenora: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#211c18">{(tt) => {
  const L = ["Ramón,", "the shop didn't get me.", "The car did.", "Nobody told me."];
  return <>
    <div style={ab(460, 140, { width: 1000, height: 800, background: "linear-gradient(#f7f1df,#e6dcc0)", boxShadow: shadow, transform: `rotate(-2deg) translateY(${(1 - phys(tt, 0.1, 6, 0.5)) * -400}px)` })}>
      {Array.from({ length: 11 }, (_, i) => <div key={i} style={ab(70, 150 + i * 58, { width: 860, height: 2, background: "#b9c7d6" })} />)}
      {L.map((l, i) => { const k = cl((tt - 0.6 - i * 0.6) * 1.6);
        return <div key={i} style={{ ...txt(90, 110 + i * 150, i === 2 ? 110 : 76, i === 2 ? "#1c2c66" : "#2c3550", 1, HAND), fontWeight: 700, clipPath: `inset(0 ${100 - k * 100}% 0 0)` }}>{l}</div>; })}
      <div style={ab(90, 520, { width: 560 * eio(tt, 2.6, 3.3), height: 12, borderRadius: 6, background: RED, transform: "rotate(-1deg)" })} />
    </div>
    <Tag tt={tt} at={3.5} x={960} y={1010} txt="THE CAR DID" col={MZ} />
  </>;
}}</Stage>;

// 6 · precios de autos iguales en la misma calle: uno cae $2.000 más abajo y aparece la llave del motivo
const DosMil: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#1a1f24">{(tt) => {
  const P = [6900, 7100, 6800, 7000, 4900], base = 900, U = 0.085;
  return <>
    <div style={ab(220, base, { width: 1480, height: 6, background: TX, opacity: 0.6 })} />
    {P.map((p, i) => { const g = eio(tt, 0.3 + i * 0.25, 1.1 + i * 0.25), hgt = p * U * (i === 4 ? lerp(1, 1, g) : g), last = i === 4, drop = last ? eio(tt, 1.6, 2.4) : 0;
      const hh = last ? lerp(7000 * U, p * U, drop) * cl(g * 3) : hgt;
      return <div key={i}>
        <div style={ab(300 + i * 280, base - hh, { width: 180, height: hh, borderRadius: "12px 12px 0 0", background: last ? `linear-gradient(${RED},#7a1510)` : "linear-gradient(#8fa3b6,#4a5866)" })} />
        <div style={mid(180, base - hh - (last ? 60 : 70), 46, last ? RED : TX, cl(g * 2))} ><span style={{ position: "relative", left: 300 + i * 280 }}>${Math.round(last ? lerp(7000, p, drop) : p).toLocaleString("en-US")}</span></div>
      </div>; })}
    <div style={ab(1616, base - 7000 * U, { width: 6, height: (7000 - 4900) * U * eio(tt, 2.2, 2.7), background: MZ })} />
    <div style={txt(1420, base - 7000 * U - 150, 64, MZ, cl((tt - 2.5) * 3))}>−$2,000</div>
    <Tag tt={tt} at={3.2} x={960} y={130} txt="WHY?" col={MZ} />
  </>;
}}</Stage>;

// 7 · la preparación del lote: lavado, brillo de gomas, arbolito, precio rápido… y el sello SELL FAST
const Arbolito: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#1c2420">{(tt) => {
  const S = ["WASH", "TIRE SHINE", "LITTLE TREE", "PRICE LOW"];
  return <>
    {S.map((s, i) => { const k = phys(tt, 0.2 + i * 0.45, 7, 0.5);
      return <Card key={i} x={170 + i * 410} y={300} w={360} h={440} k={k} bg="linear-gradient(#26313b,#161c22)">
        <div style={ab(0, 40, { width: 360, height: 220, display: "flex", alignItems: "center", justifyContent: "center" })}>
          {i === 0 && Array.from({ length: 9 }, (_, j) => <div key={j} style={ab(80 + rnd(j) * 200, 40 + ((tt * 200 + j * 40) % 180), { width: 14, height: 26, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "#7fc6ff", opacity: 0.8 })} />)}
          {i === 1 && <div style={{ width: 170, height: 170, borderRadius: "50%", background: "radial-gradient(#3a3f45 30%,#111 31%,#1d1f22 60%)", boxShadow: `0 0 ${30 + 30 * Math.sin(tt * 8)}px rgba(255,255,255,.5)` }} />}
          {i === 2 && <svg width={150} height={200} viewBox="0 0 150 200" style={{ transform: `rotate(${Math.sin(tt * 4) * 8}deg)`, transformOrigin: "75px 0" }}><line x1={75} y1={0} x2={75} y2={30} stroke="#ddd" strokeWidth={3} /><path d="M75 30 L130 90 L100 90 L140 150 L85 150 L85 190 L65 190 L65 150 L10 150 L50 90 L20 90 Z" fill="#2fae5a" /></svg>}
          {i === 3 && <div style={{ fontFamily: F, fontSize: 96, color: "#ffd84a", transform: `scale(${1 + 0.08 * Math.sin(tt * 10)})` }}>$↓</div>}
        </div>
        <div style={mid(360, 300, 40, TX)}>{s}</div>
        <Check x={150} y={360} k={(tt - 1.0 - i * 0.45) * 3} s={0.9} />
      </Card>; })}
    <Stamp x={960} y={860} k={(tt - 2.9) * 2.5} txt="SELL FAST" c={MZ} r={-6} />
  </>;
}}</Stage>;

// 8 · un motor que brilla demasiado; la lupa pasa y debajo del brillo aparece la mugre
const MotorLimpio: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#191d22">{(tt) => {
  const lx = lerp(300, 1350, eio(tt, 1.0, 3.2)), ly = 520 + Math.sin(tt * 2) * 30;
  return <>
    <Block x={360} y={300} w={1200} n={4} c="#7a8591" />
    {Array.from({ length: 12 }, (_, i) => { const a = (tt * 1.6 + i * 0.37) % 1; return <div key={i} style={ab(420 + rnd(i) * 1080, 330 + rnd(i + 4) * 560, { width: 40, height: 40, opacity: Math.sin(a * Math.PI), transform: `scale(${0.4 + a}) rotate(45deg)`, background: "radial-gradient(#fff 15%,transparent 60%)" })} />; })}
    <div style={ab(lx - 190, ly - 190, { width: 380, height: 380, borderRadius: "50%", overflow: "hidden", boxShadow: "0 0 0 18px #2a2a2a, 0 0 0 26px #8a7b5a, " + shadow, opacity: cl((tt - 0.8) * 3) })}>
      <div style={ab(0, 0, { width: 380, height: 380, background: "radial-gradient(#3b2a14,#160d04)" })} />
      {Array.from({ length: 10 }, (_, i) => <div key={i} style={ab(40 + rnd(i + 20) * 280, 40 + rnd(i + 30) * 280, { width: 30 + rnd(i) * 60, height: 18 + rnd(i + 2) * 30, borderRadius: "50%", background: "rgba(10,6,2,.85)" })} />)}
      <div style={ab(160, 60, { width: 26, height: 260, borderRadius: 13, background: "linear-gradient(#5a3a10,#1e1204)", opacity: 0.9 })} />
    </div>
    <div style={ab(lx + 120, ly + 120, { width: 50, height: 260, borderRadius: 20, background: "linear-gradient(90deg,#4b3a26,#8a6b44,#4b3a26)", transform: "rotate(-40deg)", transformOrigin: "0 0", opacity: cl((tt - 0.8) * 3) })} />
    <Tag tt={tt} at={3.3} x={960} y={150} txt="TOO CLEAN" col={MZ} />
  </>;
}}</Stage>;

// 9 · V6 en dos bancadas: en ruta, tres cilindros se apagan para ahorrar nafta (y uno igual moja aceite)
const VCM: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#141b22">{(tt) => {
  const off = eio(tt, 1.2, 1.8), drip = cl((tt - 2.4) * 1.2);
  const Bank = ({ x, r, side }: { x: number; r: number; side: number }) => <div style={ab(x, 300, { width: 420, height: 640, borderRadius: 30, background: IRONC, transform: `rotate(${r}deg)`, boxShadow: shadow })}>
    {[0, 1, 2].map((i) => { const dead = side === 1; return <div key={i} style={ab(90, 50 + i * 190, { width: 240, height: 160, borderRadius: 20, background: dead ? `rgba(${lerp(255, 40, off)},${lerp(140, 50, off)},${lerp(40, 60, off)},1)` : "linear-gradient(#ffb24a,#e05a1a)", boxShadow: dead ? "none" : `0 0 ${40 + 20 * Math.sin(tt * 14 + i)}px rgba(255,150,40,.8)` })}>
      {dead && <div style={mid(240, 50, 56, "#9fb0c0", off)}>OFF</div>}
      {dead && i === 1 && <div style={ab(110, 120, { width: 22, height: 22 + 60 * drip, borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%", background: OIL, opacity: drip })} />}
    </div>; })}
  </div>;
  return <>
    <Bank x={470} r={-18} side={0} /><Bank x={1030} r={18} side={1} />
    <div style={ab(820, 120, { opacity: cl((tt - 1.4) * 3), display: "flex", alignItems: "center", gap: 20 })}>
      <svg width={90} height={90} viewBox="0 0 90 90"><path d="M10 80 C10 30 40 10 85 8 C80 50 60 80 10 80 Z" fill={VER} /><path d="M12 78 L60 30" stroke="#0e3a1c" strokeWidth={5} /></svg>
      <div style={txt(0, 0, 60, VER, 1)} />
    </div>
    <Tag tt={tt} at={2.0} x={1180} y={160} txt="3 RESTING" col={MZ} />
  </>;
}}</Stage>;

// 10 · el pistón en corte: el carbón tapa los aros, el aceite sube a la cámara, y la cadena aceite→bujía→fallo
const Anillos: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#171a1f">{(tt) => {
  const carbon = cl((tt - 0.3) * 0.8), up = cl((tt - 1.2) * 0.8);
  const steps = ["OIL BURNS", "PLUG FOULS", "MISFIRE"];
  return <>
    <svg style={ab(180, 150)} width={760} height={820} viewBox="0 0 760 820">
      <rect x={120} y={0} width={30} height={820} fill="#4a5056" /><rect x={610} y={0} width={30} height={820} fill="#4a5056" />
      <rect x={150} y={40} width={460} height={200} fill="#2a1a12" opacity={0.6} />
      <rect x={160} y={260} width={440} height={330} rx={16} fill="url(#pg)" />
      <defs><linearGradient id="pg" x1="0" x2="1"><stop offset="0" stopColor="#8d959d" /><stop offset=".5" stopColor="#d7dce0" /><stop offset="1" stopColor="#7c848b" /></linearGradient></defs>
      {[300, 340, 380].map((y, i) => <g key={i}><rect x={150} y={y} width={460} height={18} fill="#2b2f33" />{Array.from({ length: 9 }, (_, j) => <circle key={j} cx={160 + j * 55 + rnd(j + i) * 20} cy={y + 9} r={7 * carbon} fill="#0a0a0a" />)}</g>)}
      <rect x={340} y={590} width={80} height={230} fill="#6d757c" />
      {Array.from({ length: 6 }, (_, i) => { const p = cl(up * 1.4 - i * 0.12); return <circle key={i} cx={i % 2 ? 140 : 620} cy={lerp(620, 120, p)} r={12} fill={OIL} opacity={p > 0 && p < 1 ? 1 : p >= 1 ? 0.8 : 0} />; })}
      {up > 0.8 && <circle cx={380} cy={140} r={60 + 20 * Math.sin(tt * 12)} fill="rgba(80,80,90,.5)" />}
    </svg>
    <div style={txt(260, 100, 44, DIM, cl(carbon * 3))}>CARBON IN THE RINGS</div>
    {steps.map((s, i) => { const k = phys(tt, 2.0 + i * 0.5, 7, 0.5); return <div key={i} style={ab(1080, 260 + i * 230, { opacity: cl(k * 2), transform: `translateX(${(1 - k) * 200}px)` })}>
      <div style={{ width: 600, height: 150, borderRadius: 20, background: i === 2 ? `linear-gradient(${RED},#7a1510)` : "#26303a", boxShadow: shadow, fontFamily: F, fontSize: 60, color: TX, display: "flex", alignItems: "center", justifyContent: "center" }}>{s}</div>
      {i < 2 && <div style={txt(270, 155, 70, MZ)}>↓</div>}
    </div>; })}
  </>;
}}</Stage>;

// 11 · el círculo vicioso: la bujía da vuelta al anillo, el contador de cambios sube, la luz del motor vuelve
const Bujias: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#1b1d24">{(tt) => {
  const a = tt * 1.9, n = 1 + Math.floor(cl(tt / 3.6) * 3), cx = 760, cy = 540, R = 300, blink = Math.sin(tt * 12) > 0;
  return <>
    <svg style={ab(cx - 360, cy - 360)} width={720} height={720} viewBox="0 0 720 720"><circle cx={360} cy={360} r={R} fill="none" stroke="rgba(246,241,228,.25)" strokeWidth={14} strokeDasharray="30 22" /><path d="M640 300 l20 50 l-50 -10" fill="none" stroke={MZ} strokeWidth={10} /></svg>
    <div style={ab(cx + Math.cos(a) * R - 40, cy + Math.sin(a) * R - 110, { width: 80, height: 220, transform: `rotate(${(a * 180) / Math.PI + 90}deg)` })}>
      <div style={ab(20, 0, { width: 40, height: 60, borderRadius: 8, background: "#e9e6de" })} /><div style={ab(10, 60, { width: 60, height: 60, background: "linear-gradient(90deg,#8d959d,#d7dce0,#8d959d)" })} /><div style={ab(28, 120, { width: 24, height: 80, background: "repeating-linear-gradient(#9aa1a8 0 8px,#5f666c 8px 14px)" })} />
    </div>
    <div style={mid(1520, cy - 40, 120, TX)}><span style={{ position: "relative", left: -0 }}>{n}×</span></div>
    <div style={ab(1260, 300, { width: 300, height: 220, borderRadius: 30, background: "#101318", boxShadow: shadow, display: "flex", alignItems: "center", justifyContent: "center" })}>
      <svg width={180} height={120} viewBox="0 0 180 120"><path d="M30 30 h90 l20 20 h20 v40 h-20 l-10 20 h-90 v-30 h-20 v-30 h10 z" fill={tt > 2.6 && blink ? "#ffb21a" : "#3a3320"} /></svg>
    </div>
    <div style={txt(1290, 560, 44, DIM)}>PLUGS AGAIN</div>
    <Tag tt={tt} at={2.8} x={1410} y={760} txt="COMES BACK" col={RED} />
  </>;
}}</Stage>;

// 12 · línea de tiempo: la extensión de garantía vivió años atrás; tu compra cae mucho después
const Garantia: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#171c21">{(tt) => {
  const Y0 = 2008, Y1 = 2026, X = (y: number) => 180 + ((y - Y0) / (Y1 - Y0)) * 1560, k = eio(tt, 0.2, 1.4), w = eio(tt, 1.2, 2.2);
  return <>
    <div style={ab(180, 600, { width: 1560 * k, height: 8, background: TX })} />
    {Array.from({ length: Y1 - Y0 + 1 }, (_, i) => Y0 + i).filter((y) => y % 2 === 0).map((y) => <div key={y} style={{ ...txt(X(y) - 46, 630, 34, DIM, cl(k * 1.5)) }}>{y}</div>)}
    <div style={ab(X(2010), 520, { width: (X(2017) - X(2010)) * w, height: 70, borderRadius: 12, background: `linear-gradient(90deg,${VER},#1f6b3b)` })} />
    <div style={txt(X(2010) + 20, 450, 46, VER, w)}>WARRANTY EXTENDED</div>
    <div style={ab(X(2025) - 4, 380, { width: 8, height: 230 * eio(tt, 2.3, 2.8), background: RED })} />
    <div style={txt(X(2025) - 430, 290, 56, RED, cl((tt - 2.6) * 3))}>YOU BUY HERE</div>
    <div style={ab(X(2017), 560, { width: (X(2025) - X(2017)) * eio(tt, 2.8, 3.4), height: 6, background: "repeating-linear-gradient(90deg,#ff6b5a 0 20px,transparent 20px 36px)" })} />
    <Tag tt={tt} at={3.4} x={960} y={850} txt="LONG GONE" col={MZ} />
  </>;
}}</Stage>;

// 13 · el motor sobre sus tres soportes de goma: cada cambio de modo lo sacude y un soporte se raja
const Soportes: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#191c20">{(tt) => {
  const kick = [0.9, 1.7, 2.5, 3.2].reduce((s, a) => s + Math.exp(-Math.max(0, tt - a) * 6) * (tt > a ? 1 : 0), 0), sh = Math.sin(tt * 40) * 14 * kick, crack = cl((tt - 2.6) * 2);
  return <>
    <div style={ab(200, 860, { width: 1520, height: 40, borderRadius: 10, background: "#3a4048" })} />
    <div style={ab(560 + sh, 300 - Math.abs(sh) * 0.5, { transform: `rotate(${sh * 0.2}deg)` })}><Block x={0} y={0} w={800} n={6} /></div>
    {[520, 920, 1320].map((x, i) => <div key={i} style={ab(x, 800, { width: 120, height: 70, borderRadius: 16, background: "linear-gradient(#2a2a2a,#0d0d0d)", transform: `scaleY(${1 - 0.25 * kick * (i === 1 ? 1.4 : 1)})`, transformOrigin: "50% 100%" })}>
      {i === 1 && <svg style={ab(0, 0)} width={120} height={70} viewBox="0 0 120 70"><path d="M10 35 L40 25 L55 45 L80 20 L110 38" fill="none" stroke={RED} strokeWidth={6} strokeDasharray={140} strokeDashoffset={140 * (1 - crack)} /></svg>}
    </div>)}
    <div style={txt(1440, 420, 72, MZ, 0.35 + 0.65 * cl(kick))}>ON / OFF</div>
    <Tag tt={tt} at={3.0} x={960} y={130} txt="MOUNTS" col={RED} />
  </>;
}}</Stage>;

// 14 · el cartero jubilado: el odómetro rueda hasta 210.000 y el sobre del service al día aparece sellado
const Cartero: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#1b2024">{(tt) => {
  const v = 210000 * eio(tt, 0.3, 2.6);
  return <>
    <div style={ab(560, 250)}><Odo x={0} y={0} v={v} s={1.4} /></div>
    <div style={txt(1290, 290, 52, DIM, cl((tt - 0.5) * 3))}>MILES</div>
    <div style={ab(560, 560, { width: 420, height: 280, background: "linear-gradient(#f3ead2,#ddd0ae)", boxShadow: shadow, transform: `rotate(-4deg) translateY(${(1 - phys(tt, 1.8, 6, 0.5)) * 400}px)` })}>
      <svg style={ab(0, 0)} width={420} height={280} viewBox="0 0 420 280"><path d="M0 0 L210 150 L420 0" fill="none" stroke="#b9ab86" strokeWidth={6} /></svg>
      <div style={mid(420, 190, 36, "#5a4a2a")}>OIL ON TIME</div>
    </div>
    <Check x={1050} y={620} k={(tt - 2.6) * 3} s={2} />
    <Tag tt={tt} at={3.2} x={1300} y={700} txt="CAREFUL" col={VER} />
  </>;
}}</Stage>;

// 15 · cuatro pruebas del V6: papeles, varilla, hollín en el caño (crece el anillo negro), temblor en ruta
const CuatroChequeo: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#191d21">{(tt) => {
  const L = ["RECORDS", "DIPSTICK", "PIPE SOOT", "SHUDDER"];
  return <>
    {L.map((l, i) => { const k = phys(tt, 0.2 + i * 0.3, 7, 0.5), hot = i === 2;
      return <Card key={i} x={130 + i * 420} y={hot ? 220 : 300} w={380} h={hot ? 560 : 440} k={k} bg={hot ? "linear-gradient(#303942,#1a1f25)" : "linear-gradient(#26303a,#161b20)"}>
        <div style={mid(380, 30, 30, DIM)}>{i + 1}</div>
        {i === 0 && Array.from({ length: 4 }, (_, j) => <div key={j} style={ab(80 + j * 16, 110 + j * 20, { width: 200, height: 150, background: "#efe6cf", boxShadow: "0 6px 12px rgba(0,0,0,.4)" })} />)}
        {i === 1 && <div style={ab(20, 180)}><Dipstick x={0} y={0} lvl={0.25} len={340} /></div>}
        {hot && <div style={ab(70, 110, { width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(#050505 0,#050505 30%,#1a1a1a " + (32 + 22 * eio(tt, 1.2, 2.6)) + "%,#9aa1a8 " + (36 + 22 * eio(tt, 1.2, 2.6)) + "%,#c9cfd5 70%,#6b7279 100%)", boxShadow: "inset 0 0 30px #000" })} />}
        {i === 3 && <div style={ab(80, 150, { width: 220, height: 120, borderRadius: 20, background: "#3b4552", transform: `translateX(${Math.sin(tt * 35) * 8 * cl(tt - 2.4)}px)` })}><div style={ab(20, 90, { width: 50, height: 50, borderRadius: "50%", background: "#111" })} /><div style={ab(150, 90, { width: 50, height: 50, borderRadius: "50%", background: "#111" })} /></div>}
        <div style={mid(380, hot ? 420 : 340, 40, hot ? MZ : TX)}>{l}</div>
      </Card>; })}
  </>;
}}</Stage>;

// 16 · un cuarto de aceite se vacía cada mil millas: la botella baja mientras el odómetro corre
const CuartoPorMil: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#1d1b17">{(tt) => {
  const p = cl((tt - 0.4) / 3.2), lvl = 1 - 0.82 * p;
  return <>
    <div style={ab(500, 260, { width: 360, height: 600, borderRadius: "60px 60px 30px 30px", background: "rgba(240,230,200,.12)", boxShadow: "inset 0 0 0 8px rgba(240,230,200,.5), " + shadow, overflow: "hidden" })}>
      <div style={ab(0, 600 * (1 - lvl), { width: 360, height: 600 * lvl, background: `linear-gradient(${OIL},#7a4f0c)` })} />
      <div style={mid(360, 250, 70, "#fff7e0")}>1 QT</div>
    </div>
    <div style={ab(590, 200, { width: 180, height: 80, borderRadius: 16, background: "#c21f14" })} />
    <div style={ab(1040, 380)}><Odo x={0} y={0} v={1000 * p} s={1.2} /></div>
    <div style={txt(1100, 300, 50, DIM)}>MILES DRIVEN</div>
    <Tag tt={tt} at={3.5} x={1350} y={720} txt="EVERY 1000" col={RED} />
  </>;
}}</Stage>;

// 17 · la cadena de distribución entre dos piñones: el aceite baja, la cadena se afloja y la marca salta
const Cadena: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#15191e">{(tt) => {
  const oil = 1 - eio(tt, 0.4, 2.4), slack = eio(tt, 1.2, 3.0) * 90, jump = tt > 3.0, rot = tt * 140;
  const Gear = ({ x, y, r, mark }: { x: number; y: number; r: number; mark: number }) => <svg style={ab(x - r - 20, y - r - 20)} width={2 * r + 40} height={2 * r + 40} viewBox={`${-r - 20} ${-r - 20} ${2 * r + 40} ${2 * r + 40}`}>
    <g transform={`rotate(${rot * (60 / r)})`}>{Array.from({ length: 18 }, (_, i) => <rect key={i} x={-10} y={-r - 16} width={20} height={26} fill="#9aa1a8" transform={`rotate(${i * 20})`} />)}<circle r={r} fill="url(#gg)" /><circle r={r * 0.25} fill="#22262a" /><circle cx={0} cy={-r * 0.7} r={10} fill={MZ} transform={`rotate(${mark})`} /></g>
    <defs><radialGradient id="gg"><stop offset="0" stopColor="#c9cfd5" /><stop offset="1" stopColor="#6f777e" /></radialGradient></defs>
  </svg>;
  const sag = `M 700 300 C 960 ${300 + slack} 960 ${300 + slack} 1220 300`;
  return <>
    <svg style={ab(0, 0)} width={1920} height={1080}><path d={sag} fill="none" stroke="#3b4148" strokeWidth={28} /><path d={sag} fill="none" stroke="#c8ced4" strokeWidth={10} strokeDasharray="22 12" strokeDashoffset={-tt * 220} />
      <path d="M 700 760 C 960 760 960 760 1220 760" fill="none" stroke="#3b4148" strokeWidth={28} /><path d="M 700 760 L 1220 760" fill="none" stroke="#c8ced4" strokeWidth={10} strokeDasharray="22 12" strokeDashoffset={tt * 220} /></svg>
    <Gear x={700} y={530} r={230} mark={0} /><Gear x={1220} y={530} r={230} mark={jump ? 40 : 0} />
    <div style={ab(150, 300, { width: 120, height: 460, borderRadius: 20, background: "#101318", boxShadow: "inset 0 0 0 5px #3a3f45" })}><div style={ab(10, 10 + 440 * (1 - oil), { width: 100, height: 440 * oil, borderRadius: 12, background: `linear-gradient(${OIL},#7a4f0c)` })} /></div>
    <div style={txt(140, 790, 40, DIM)}>OIL</div>
    {jump && <div style={txt(1420, 200, 80, RED, cl((tt - 3.0) * 4))}>JUMPED!</div>}
    <Tag tt={tt} at={1.6} x={960} y={120} txt="STRETCH" col={MZ} />
  </>;
}}</Stage>;

// 18 · el martillo del juez golpea y la balanza se inclina hacia los dueños
const Jurado: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#1e1a16">{(tt) => {
  const hit = eio(tt, 0.6, 0.9) - eio(tt, 0.95, 1.3), tilt = eio(tt, 1.2, 2.4) * 14;
  return <>
    <div style={ab(960, 260, { width: 12, height: 560, background: "#b8963e", transform: "translateX(-50%)" })} />
    <div style={ab(960, 280, { width: 1000, height: 14, background: "#d6b65a", transform: `translateX(-50%) rotate(${-tilt}deg)`, transformOrigin: "50% 50%" })}>
      <div style={ab(-130, 0, { width: 260, height: 160, transform: `rotate(${tilt}deg)`, transformOrigin: "50% 0" })}><div style={ab(127, 0, { width: 6, height: 122, background: "#b8963e" })} /><div style={ab(0, 120, { width: 260, height: 40, borderRadius: "0 0 130px 130px", background: "#c9a74c" })} /><div style={mid(260, 178, 40, MZ)}>OWNERS</div></div>
      <div style={ab(870, 0, { width: 260, height: 160, transform: `rotate(${tilt}deg)`, transformOrigin: "50% 0" })}><div style={ab(127, 0, { width: 6, height: 122, background: "#b8963e" })} /><div style={ab(0, 120, { width: 260, height: 40, borderRadius: "0 0 130px 130px", background: "#c9a74c" })} /><div style={mid(260, 178, 40, DIM)}>MAKER</div></div>
    </div>
    <div style={ab(820, 860, { width: 280, height: 40, borderRadius: 10, background: "#5a3a1e" })} />
    <div style={ab(1300, 520, { width: 380, height: 120, transform: `rotate(${-30 + 50 * hit}deg)`, transformOrigin: "100% 50%" })}>
      <div style={ab(0, 20, { width: 160, height: 90, borderRadius: 16, background: "linear-gradient(#7a4a22,#3e230e)" })} /><div style={ab(150, 50, { width: 230, height: 26, borderRadius: 13, background: "#6a3f1c" })} />
    </div>
    <Tag tt={tt} at={2.7} x={960} y={150} txt="OWNERS WON" col={MZ} />
  </>;
}}</Stage>;

// 19 · el ruido de la mañana: de 3 segundos a un minuto entero; la varilla marca dos cuartos menos
const Traqueteo: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#171b20">{(tt) => {
  const W = 1300, a = eio(tt, 0.4, 0.9), b = eio(tt, 1.4, 2.8);
  return <>
    <div style={ab(310, 300, { width: W, height: 16, background: "rgba(246,241,228,.2)", borderRadius: 8 })} />
    {[0, 15, 30, 45, 60].map((s) => <div key={s} style={txt(310 + (s / 60) * W - 30, 330, 34, DIM)}>{s}s</div>)}
    <div style={txt(140, 280, 40, TX, a)}>THEN</div>
    <div style={ab(310, 290, { width: (3 / 60) * W * a, height: 36, borderRadius: 10, background: MZ })} />
    <div style={txt(140, 480, 40, RED, b > 0 ? 1 : 0)}>NOW</div>
    <div style={ab(310, 490, { width: W * b, height: 36, borderRadius: 10, background: `repeating-linear-gradient(90deg,${RED} 0 26px,#a5170f 26px 40px)`, transform: `translateY(${Math.sin(tt * 50) * 3}px)` })} />
    <div style={ab(310, 760)}><Dipstick x={0} y={0} lvl={eio(tt, 2.6, 3.4) > 0 ? lerp(0.9, 0.08, eio(tt, 2.6, 3.4)) : 0.9} len={900} /></div>
    <div style={txt(1280, 720, 60, RED, cl((tt - 3.2) * 3))}>−2 QT</div>
  </>;
}}</Stage>;

// 20 · la pregunta directa al vendedor: «¿cada cuánto le agrega aceite?» «Nunca.» → dos caminos
const PreguntaAceite: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#1c2026">{(tt) => <>
  <Bubble x={160} y={150} w={820} k={cl((tt - 0.2) * 2)}>"How often do you add oil?"</Bubble>
  <Bubble x={1080} y={300} w={520} k={cl((tt - 1.0) * 2)} dark tail="r"><span style={{ fontSize: 80 }}>"Never."</span></Bubble>
  <div style={ab(200, 620, { opacity: cl((tt - 1.5) * 3) })}><Dipstick x={0} y={0} lvl={0.12} len={680} /></div>
  {["NOT LOOKING", "NOT TELLING"].map((l, i) => { const k = phys(tt, 2.3 + i * 0.4, 7, 0.5); return <div key={i} style={ab(1060, 600 + i * 170, { width: 640, height: 130, borderRadius: 20, background: "#2a1715", boxShadow: `inset 0 0 0 5px ${RED}, ${shadow}`, opacity: cl(k * 2), transform: `translateX(${(1 - k) * 300}px)`, fontFamily: F, fontSize: 56, color: TX, display: "flex", alignItems: "center", justifyContent: "center" })}>{l}</div>; })}
  <div style={txt(950, 690, 90, MZ, cl((tt - 2.2) * 3))}>→</div>
</>}</Stage>;

// 21 · el V8 de frente: dos turbos al rojo dentro de la V, ondas de calor subiendo
const VCaliente: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#140f0e">{(tt) => {
  const heat = eio(tt, 0.8, 2.4);
  return <>
    {[-1, 1].map((sd) => <div key={sd} style={ab(960 + sd * 260 - 200, 360, { width: 400, height: 560, borderRadius: 30, background: IRONC, transform: `rotate(${sd * 24}deg)`, transformOrigin: "50% 100%", boxShadow: shadow })}>
      {[0, 1, 2, 3].map((i) => <div key={i} style={ab(110, 40 + i * 128, { width: 180, height: 100, borderRadius: 50, background: "#161a1e" })} />)}
    </div>)}
    {[-1, 1].map((sd) => <svg key={sd} style={ab(960 + sd * 95 - 90, 470, { overflow: "visible" })} width={180} height={180} viewBox="-90 -90 180 180">
      <circle r={80} fill={`rgb(${lerp(110, 255, heat)},${lerp(110, 70, heat)},${lerp(115, 30, heat)})`} style={{ filter: `drop-shadow(0 0 ${50 * heat}px rgba(255,90,30,.9))` }} />
      <path d="M0 0 m-50 0 a50 50 0 1 1 50 50 a35 35 0 1 1 -35 -35 a20 20 0 1 1 20 20" fill="none" stroke="#2a1a12" strokeWidth={8} transform={`rotate(${tt * 300 * sd})`} />
    </svg>)}
    {Array.from({ length: 7 }, (_, i) => { const a = (tt * 0.9 + i * 0.14) % 1; return <svg key={i} style={ab(800 + i * 50, 420 - a * 320)} width={40} height={120} viewBox="0 0 40 120" opacity={heat * Math.sin(a * Math.PI)}><path d="M20 120 C0 90 40 70 20 40 C0 20 30 10 20 0" fill="none" stroke="#ff8a3a" strokeWidth={5} /></svg>; })}
    <Tag tt={tt} at={2.6} x={960} y={140} txt="HOT VEE" col={RED} />
  </>;
}}</Stage>;

// 22 · el termómetro sube y cada pieza alrededor se cocina: sellos, mangueras, plástico, cables, aceite
const Cocina: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#1c1512">{(tt) => {
  const T = eio(tt, 0.3, 3.4), L = ["SEALS", "HOSES", "PLASTIC", "WIRING", "OIL"];
  return <>
    <div style={ab(230, 180, { width: 110, height: 700, borderRadius: 55, background: "#e9e2cf", boxShadow: shadow })}>
      <div style={ab(30, 30 + 560 * (1 - T), { width: 50, height: 560 * T + 40, borderRadius: 25, background: `linear-gradient(${RED},#ff8a3a)` })} />
    </div>
    <div style={ab(205, 820, { width: 160, height: 160, borderRadius: "50%", background: RED })} />
    {L.map((l, i) => { const thr = 0.15 + i * 0.17, cooked = cl((T - thr) * 4), k = phys(tt, 0.1 + i * 0.15, 8, 0.5);
      return <div key={i} style={ab(520, 190 + i * 150, { width: 1150, height: 120, borderRadius: 20, opacity: cl(k * 2), background: `linear-gradient(90deg, rgb(${lerp(44, 92, cooked)},${lerp(52, 38, cooked)},${lerp(62, 22, cooked)}), #1b1f24)`, boxShadow: shadow, display: "flex", alignItems: "center", paddingLeft: 50, fontFamily: F, fontSize: 56, color: cooked > 0.5 ? "#ffb08a" : TX })}>
        {l}
        <svg style={ab(800, 20)} width={300} height={80} viewBox="0 0 300 80"><path d="M0 40 L60 20 L100 60 L160 10 L210 55 L300 30" fill="none" stroke="#ff6b3a" strokeWidth={6} strokeDasharray={420} strokeDashoffset={420 * (1 - cooked)} /></svg>
      </div>; })}
  </>;
}}</Stage>;

// 23 · la balanza: el auto vale $10.000, el presupuesto $11.000; se va para abajo y el sello «FOR PARTS»
const Estimado: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#1a1d21">{(tt) => {
  const tilt = -eio(tt, 1.4, 2.4) * 16;
  const Pan = ({ x, lbl, v, c }: { x: number; lbl: string; v: string; c: string }) => <div style={ab(x, 14, { width: 420, height: 300, transform: `rotate(${tilt}deg)`, transformOrigin: "50% 0" })}>
    <div style={ab(205, 0, { width: 6, height: 120, background: "#9aa1a8" })} />
    <div style={ab(0, 120, { width: 420, height: 50, borderRadius: "0 0 210px 210px", background: "#b9c0c7" })} />
    <div style={mid(420, 190, 44, DIM)}>{lbl}</div><div style={mid(420, 240, 72, c)}>{v}</div>
  </div>;
  return <>
    <div style={ab(950, 300, { width: 20, height: 600, background: "#7d868f" })} />
    <div style={ab(960, 300, { width: 1200, height: 16, background: "#c9cfd5", transform: `translateX(-50%) rotate(${-tilt}deg)` })}>
      <Pan x={-120} lbl="CAR" v="$10,000" c={TX} /><Pan x={900} lbl="REPAIR" v="$11,000" c={RED} />
    </div>
    <Stamp x={560} y={860} k={(tt - 2.7) * 2.5} txt="FOR PARTS" r={-6} />
  </>;
}}</Stage>;

// 24 · el caño de escape: humo azul al arrancar y al soltar el acelerador en bajada
const HumoAzul: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#171b21">{(tt) => {
  const puff = (a: number) => cl(1 - Math.abs(tt - a) / 0.9);
  const p = 0.45 + 0.55 * Math.max(puff(1.0), puff(2.8));
  return <>
    <div style={ab(1150, 560, { width: 600, height: 120, borderRadius: 60, background: STEEL, boxShadow: shadow })} />
    <div style={ab(1110, 560, { width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(#050505 50%,#8d959d 52%)" })} />
    {Array.from({ length: 10 }, (_, i) => { const a = (tt * 1.3 + i * 0.1) % 1; return <div key={i} style={ab(1100 - a * 700, 560 - a * 250 + Math.sin(i + a * 6) * 40, { width: 160 + a * 260, height: 120 + a * 200, borderRadius: "50%", background: "radial-gradient(rgba(140,175,255,.85),rgba(120,160,255,.35) 40%,transparent 68%)", opacity: p * (1 - a), transform: "translate(-50%,-30%)" })} />; })}
    <div style={ab(300, 860, { width: 1320, height: 8, background: "rgba(246,241,228,.25)" })} />
    {[["START", 1.0], ["DOWNHILL", 2.8]].map(([l, a], i) => <div key={i}><div style={ab(300 + (Number(a) / 4) * 1320, 836, { width: 56, height: 56, borderRadius: "50%", background: tt > Number(a) - 0.3 ? "#6a8cff" : "#3a3f45" })} /><div style={txt(250 + (Number(a) / 4) * 1320, 910, 44, tt > Number(a) - 0.3 ? "#9fb6ff" : DIM)}>{String(l)}</div></div>)}
    <Tag tt={tt} at={1.4} x={600} y={200} txt="BLUE SMOKE" col="#9fb6ff" />
  </>;
}}</Stage>;

// 25 · la cadena del 6.0: enfriador de aceite tapado → enfriador EGR recalienta y se raja → refrigerante → humo blanco
const Enfriador: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#161a1f">{(tt) => {
  const clog = eio(tt, 0.2, 1.4), hot = eio(tt, 1.3, 2.3), crack = eio(tt, 2.2, 2.7), smoke = cl((tt - 2.8) * 1.5);
  const Box = ({ x, y, w, lbl, children, c = "#2a333d" }: { x: number; y: number; w: number; lbl: string; children?: React.ReactNode; c?: string }) => <div style={ab(x, y, { width: w, height: 300, borderRadius: 24, background: c, boxShadow: shadow })}>{children}<div style={mid(w, 320, 40, TX)}>{lbl}</div></div>;
  return <>
    <Box x={120} y={300} w={420} lbl="OIL COOLER">{Array.from({ length: 6 }, (_, i) => <div key={i} style={ab(40, 30 + i * 42, { width: 340, height: 22, borderRadius: 11, background: "#6f777e", overflow: "hidden" })}><div style={ab(0, 0, { width: 340 * clog * (0.5 + rnd(i) * 0.5), height: 22, background: "#2a1a08" })} /></div>)}</Box>
    <div style={txt(560, 400, 90, MZ, cl(clog * 2))}>→</div>
    <Box x={700} y={300} w={460} lbl="EGR COOLER" c={`rgb(${lerp(42, 140, hot)},${lerp(51, 40, hot)},${lerp(61, 30, hot)})`}>
      <div style={mid(460, 110, 80, hot > 0.5 ? "#ffd2c4" : DIM)}>{Math.round(lerp(190, 1100, hot))}°F</div>
      <svg style={ab(60, 190)} width={340} height={100} viewBox="0 0 340 100"><path d="M20 20 L120 70 L90 85 L210 95 L320 40" fill="none" stroke="#fff3c4" strokeWidth={7} strokeDasharray={600} strokeDashoffset={600 * (1 - crack)} /></svg>
    </Box>
    <div style={txt(1180, 400, 90, MZ, crack)}>→</div>
    <div style={ab(1320, 260, { opacity: crack })}>
      {Array.from({ length: 5 }, (_, i) => <div key={i} style={ab(60 + i * 50, (tt * 300 + i * 70) % 300, { width: 26, height: 40, borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%", background: COOL })} />)}
      <div style={txt(20, 320, 40, COOL)}>COOLANT LEAKS</div>
    </div>
    {Array.from({ length: 6 }, (_, i) => <div key={i} style={ab(1580 + i * 30, 700 - smoke * 300 - i * 30, { width: 200 + i * 40, height: 140 + i * 30, borderRadius: "50%", background: "radial-gradient(rgba(240,240,240,.75),transparent 65%)", opacity: smoke * (1 - i * 0.12) })} />)}
    <div style={txt(1360, 880, 52, TX, smoke)}>WHITE SMOKE</div>
  </>;
}}</Stage>;

// 26 · la tapa de cilindros: la presión estira los bulones, la junta sopla; los espárragos dorados la sostienen
const Pernos: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#181b20">{(tt) => {
  const p = eio(tt, 0.3, 1.6), blow = tt > 1.6 && tt < 2.3 ? 1 : 0, studs = eio(tt, 2.4, 3.1), lift = (1 - studs) * p * 40;
  return <>
    <div style={ab(460, 560, { width: 1000, height: 300, borderRadius: 20, background: IRONC, boxShadow: shadow })} />
    <div style={ab(460, 540 - lift, { width: 1000, height: 26, background: blow ? "#ffd27a" : "#8a6b44", boxShadow: blow ? "0 0 60px #ff8a3a" : "none" })} />
    <div style={ab(460, 330 - lift, { width: 1000, height: 210, borderRadius: 20, background: "linear-gradient(#7d868f,#4b5259)", boxShadow: shadow })} />
    {[560, 800, 1040, 1280].map((x, i) => <div key={i} style={ab(x, 280 - lift * 1.6, { width: 50, height: 340 + lift * 1.6, borderRadius: 10, background: studs > 0.5 ? "linear-gradient(90deg,#b8862a,#ffd27a,#b8862a)" : STEEL, transform: `scaleX(${studs > 0.5 ? 1.25 : 1 - 0.3 * p * (1 - studs)})` })}><div style={ab(-15, -10, { width: 80, height: 40, borderRadius: 8, background: studs > 0.5 ? "#c99a2e" : "#9aa1a8" })} /></div>)}
    {Array.from({ length: 5 }, (_, i) => <div key={i} style={txt(520 + i * 200, 880 - p * 40, 70, RED, p * (1 - studs))}>↑</div>)}
    {blow > 0 && <div style={txt(1480, 470, 70, "#ffd27a")}>BLOWN!</div>}
    <Tag tt={tt} at={2.8} x={960} y={160} txt="HEAD STUDS" col={MZ} />
  </>;
}}</Stage>;

// 27 · el que vendió la camioneta demanda al que hizo el motor: la demanda vuela de un edificio al otro
const Demanda: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#1a1d22">{(tt) => {
  const fly = eio(tt, 1.0, 2.2), x = lerp(520, 1260, fly), y = 380 - Math.sin(fly * Math.PI) * 220;
  const Bld = ({ x0, lbl, c }: { x0: number; lbl: string; c: string }) => <div style={ab(x0, 420, { width: 380, height: 460, background: `linear-gradient(${c},#1a1f25)`, boxShadow: shadow })}>
    {Array.from({ length: 12 }, (_, i) => <div key={i} style={ab(40 + (i % 3) * 110, 40 + Math.floor(i / 3) * 100, { width: 70, height: 60, background: "rgba(255,220,140,.35)" })} />)}
    <div style={mid(380, 490, 40, TX)}>{lbl}</div>
  </div>;
  return <>
    <Bld x0={240} lbl="SOLD THE TRUCK" c="#3a4a66" /><Bld x0={1300} lbl="BUILT THE ENGINE" c="#5a4a3a" />
    <div style={ab(x, y, { width: 200, height: 260, background: PAPER, boxShadow: shadow, transform: `rotate(${fly * 380}deg)`, opacity: cl(tt * 2) })}><div style={mid(200, 30, 30, RED)}>LAWSUIT</div>{[0, 1, 2, 3].map((j) => <div key={j} style={ab(30, 90 + j * 36, { width: 140, height: 10, background: "#c9bea4" })} />)}</div>
    <Stamp x={1490} y={300} k={(tt - 2.4) * 2.5} txt="SETTLED" c={MZ} />
    <Tag tt={tt} at={3.2} x={960} y={1000} txt="IT WAS BAD" col={RED} />
  </>;
}}</Stage>;

// 28 · el escudo del «bulletproofing»: cuatro piezas lo van llenando y aparece la etiqueta de precio $$$$
const Blindaje: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#161c22">{(tt) => {
  const L = ["HEAD STUDS", "OIL COOLER", "EGR COOLER", "CLEAN COOLANT"], fill = eio(tt, 0.4, 2.8);
  return <>
    <svg style={ab(240, 170)} width={560} height={700} viewBox="0 0 560 700"><defs><clipPath id="shc"><path d="M280 10 L540 100 C540 420 420 600 280 690 C140 600 20 420 20 100 Z" /></clipPath></defs>
      <path d="M280 10 L540 100 C540 420 420 600 280 690 C140 600 20 420 20 100 Z" fill="#20272e" stroke="#c8ced4" strokeWidth={10} />
      <rect x={0} y={700 - 700 * fill} width={560} height={700} fill="url(#shg)" clipPath="url(#shc)" /><defs><linearGradient id="shg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffd27a" /><stop offset="1" stopColor="#b8862a" /></linearGradient></defs>
    </svg>
    {L.map((l, i) => { const k = phys(tt, 0.4 + i * 0.55, 7, 0.5); return <div key={i} style={ab(900, 220 + i * 150, { width: 760, height: 120, borderRadius: 18, background: "#222a33", boxShadow: shadow, opacity: cl(k * 2), transform: `translateX(${(1 - k) * 300}px)`, fontFamily: F, fontSize: 52, color: TX, display: "flex", alignItems: "center", paddingLeft: 120 })}>{l}<Check x={20} y={30} k={(tt - 0.8 - i * 0.55) * 3} s={0.9} c={MZ} /></div>; })}
    <div style={ab(1250, 830, { padding: "14px 40px", borderRadius: 14, background: RED, fontFamily: F, fontSize: 70, color: "#fff", opacity: cl((tt - 3.0) * 3), transform: `rotate(-6deg) scale(${0.6 + 0.4 * phys(tt, 3.0, 7, 0.5)})` })}>$$$$</div>
    <Tag tt={tt} at={3.3} x={520} y={940} txt="BULLETPROOF" col={MZ} />
  </>;
}}</Stage>;

// 29 · «sí, ya está hecho» se tacha; el recibo real entra con taller, fecha y piezas resaltadas
const Recibos: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#1c1f24">{(tt) => {
  const R = [["SHOP:", "HONDO DIESEL"], ["DATE:", "03/14/2019"], ["HEAD STUDS", "✓"], ["OIL COOLER", "✓"], ["EGR COOLER", "✓"]];
  return <>
    <div style={ab(150, 330)}><Bubble x={0} y={0} w={600} k={cl((tt - 0.2) * 2)} dark><span style={{ fontFamily: HAND, fontSize: 70 }}>"Yeah, it's been done."</span></Bubble><XMark x={220} y={20} k={(tt - 1.2) * 2.5} s={1.8} /></div>
    <div style={ab(960, 140 + (1 - phys(tt, 1.0, 6, 0.5)) * 700, { width: 760, height: 820, background: "linear-gradient(#fdfbf4,#efe8d6)", boxShadow: shadow, transform: "rotate(3deg)", clipPath: "polygon(0 0,100% 0,100% 96%,95% 100%,90% 96%,85% 100%,80% 96%,75% 100%,70% 96%,65% 100%,60% 96%,55% 100%,50% 96%,45% 100%,40% 96%,35% 100%,30% 96%,25% 100%,20% 96%,15% 100%,10% 96%,5% 100%,0 96%)" })}>
      <div style={mid(760, 40, 46, "#333", 1, M)}>RECEIPT</div>
      {R.map(([a, b], i) => { const hl = eio(tt, 1.9 + i * 0.25, 2.2 + i * 0.25); return <div key={i}>
        <div style={ab(50, 140 + i * 110, { width: 660 * hl, height: 70, background: "rgba(255,226,77,.55)" })} />
        <div style={txt(70, 150 + i * 110, 42, "#2a2a2a", 1, M)}>{a}</div><div style={{ ...txt(0, 150 + i * 110, 42, i > 1 ? "#1f7a3e" : "#2a2a2a", 1, M), width: 690, textAlign: "right" }}>{b}</div>
      </div>; })}
    </div>
  </>;
}}</Stage>;

// 30 · el depósito de refrigerante: MAX antes de la prueba, mucho menos después, y debajo del auto… nada
const Refrigerante: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#151b20">{(tt) => {
  const drive = eio(tt, 1.0, 2.2), lvl = lerp(0.85, 0.45, eio(tt, 1.6, 2.6));
  return <>
    <div style={ab(300, 220, { width: 420, height: 560, borderRadius: 40, background: "rgba(230,240,240,.14)", boxShadow: "inset 0 0 0 8px rgba(230,240,240,.55), " + shadow, overflow: "hidden" })}>
      <div style={ab(0, 560 * (1 - lvl), { width: 420, height: 560 * lvl, background: `linear-gradient(${COOL},#1d7d63)` })} />
      {[["MAX", 0.85], ["MIN", 0.3]].map(([l, y], i) => <div key={i}><div style={ab(0, 560 * (1 - Number(y)), { width: 420, height: 5, background: "#fff" })} /><div style={txt(300, 560 * (1 - Number(y)) - 50, 38, "#fff")}>{String(l)}</div></div>)}
    </div>
    <div style={txt(330, 820, 48, tt < 1.6 ? TX : RED)}>{tt < 1.6 ? "BEFORE" : "AFTER, COOL"}</div>
    <div style={ab(lerp(900, 1180, drive), 520, { width: 520, height: 200 })}>
      <div style={ab(0, 40, { width: 520, height: 120, borderRadius: "40px 60px 20px 20px", background: "#3b4552" })} /><div style={ab(60, 0, { width: 300, height: 70, borderRadius: "30px 50px 0 0", background: "#2c343e" })} />
      {[70, 380].map((x) => <div key={x} style={ab(x, 130, { width: 90, height: 90, borderRadius: "50%", background: "#111", transform: `rotate(${drive * 720}deg)`, boxShadow: "inset 0 0 0 18px #2a2a2a" })} />)}
    </div>
    <div style={ab(1150, 760, { width: 560, height: 30, borderRadius: "50%", background: "rgba(0,0,0,.45)" })} />
    <div style={txt(1220, 820, 52, MZ, cl((tt - 2.8) * 3))}>NO PUDDLE?</div>
    <Tag tt={tt} at={3.3} x={1440} y={300} txt="WHERE?" col={RED} />
  </>;
}}</Stage>;

// 31 · la chapa del VIN detrás del parabrisas: 17 casilleros se llenan uno por uno
const Vin: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#181d23">{(tt) => {
  const CH = "5NPE24AF7FH123456".split(""), n = Math.floor(cl((tt - 0.6) / 2.4) * 17);
  return <>
    <div style={ab(160, 330, { width: 1600, height: 300, borderRadius: 20, background: "linear-gradient(160deg,rgba(150,185,215,.25),rgba(25,40,58,.6))", boxShadow: "inset 0 0 0 6px #0e1216" })}>
      <div style={ab(60, 70, { width: 1480, height: 160, borderRadius: 14, background: "linear-gradient(#c9cfd5,#8d959d)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 })}>
        {CH.map((c, i) => <div key={i} style={{ width: 76, height: 110, borderRadius: 8, background: i < n ? "#1d2228" : "rgba(29,34,40,.25)", color: i < n ? "#e9e2cf" : "transparent", fontFamily: M, fontWeight: 900, fontSize: 70, textAlign: "center", lineHeight: "110px", transform: `scale(${i === n - 1 ? 1.15 : 1})` }}>{c}</div>)}
      </div>
    </div>
    <div style={mid(1920, 700, 160, MZ)}>{n}</div>
    <div style={mid(1920, 880, 44, DIM)}>LETTERS + NUMBERS</div>
    <Tag tt={tt} at={3.3} x={960} y={190} txt="PHOTO IT" col={TX} />
  </>;
}}</Stage>;

// 32 · el teléfono: se tipea el VIN, gira el buscador y sale la tarjeta roja «1 OPEN RECALL · FIX: FREE»
const Nhtsa: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#14191f">{(tt) => {
  const typed = "5NPE24AF7FH123456".slice(0, Math.floor(cl((tt - 0.3) / 1.2) * 17)), spin = tt > 1.6 && tt < 2.3, res = phys(tt, 2.3, 7, 0.5);
  return <>
    <div style={ab(660, 80, { width: 600, height: 940, borderRadius: 70, background: "#0b0d10", boxShadow: "inset 0 0 0 10px #2b3036, " + shadow })}>
      <div style={ab(40, 60, { width: 520, height: 820, borderRadius: 36, background: "#f4f6f8", overflow: "hidden" })}>
        <div style={ab(0, 0, { width: 520, height: 110, background: "#1f3a63" })}><div style={mid(520, 36, 38, "#fff")}>RECALL LOOKUP</div></div>
        <div style={ab(30, 150, { width: 460, height: 80, borderRadius: 12, border: "4px solid #9aa7b4", background: "#fff", fontFamily: M, fontSize: 30, fontWeight: 900, color: "#222", lineHeight: "80px", paddingLeft: 14, boxSizing: "border-box" })}>{typed}<span style={{ opacity: Math.sin(tt * 10) > 0 ? 1 : 0 }}>|</span></div>
        <div style={ab(130, 260, { width: 260, height: 70, borderRadius: 35, background: tt > 1.5 ? "#2c6ad8" : "#9aa7b4", color: "#fff", fontFamily: F, fontSize: 32, textAlign: "center", lineHeight: "70px" })}>CHECK</div>
        {spin && <div style={ab(220, 400, { width: 80, height: 80, borderRadius: "50%", border: "10px solid #c8d2dc", borderTopColor: "#2c6ad8", transform: `rotate(${tt * 900}deg)` })} />}
        <div style={ab(30, 380 + (1 - res) * 200, { width: 460, height: 380, borderRadius: 20, background: "#fff", boxShadow: "0 0 0 6px " + RED + ", 0 20px 40px rgba(0,0,0,.25)", opacity: cl(res * 2) })}>
          <div style={mid(460, 40, 90, RED)}>1</div><div style={mid(460, 150, 44, RED)}>OPEN RECALL</div><div style={mid(460, 220, 30, "#555")}>NEVER DONE</div>
          <div style={ab(80, 280, { width: 300, height: 70, borderRadius: 14, background: VER, color: "#fff", fontFamily: F, fontSize: 36, textAlign: "center", lineHeight: "70px" })}>FIX: FREE</div>
        </div>
      </div>
    </div>
    <Tag tt={tt} at={3.0} x={1560} y={540} txt="THAT CAR" col={MZ} />
  </>;
}}</Stage>;

// 33 · los tres papeles se apilan: recall, historial, inspección; la inspección pesa contra un motor entero
const TresPapeles: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#1e1c19">{(tt) => {
  const P = [["1", "RECALL CHECK", "FREE"], ["2", "SERVICE HISTORY", "ASK"], ["3", "INSPECTION", "~ A DINNER"]];
  return <>
    {P.map(([n, l, c], i) => { const k = phys(tt, 0.2 + i * 0.6, 6, 0.5), hl = i === 2 && tt > 2.0;
      return <div key={i} style={ab(200 + i * 70, 190 + i * 250 + (1 - k) * -500, { width: 860, height: 220, borderRadius: 16, background: PAPER, boxShadow: hl ? `0 0 0 8px ${MZ}, ${shadow}` : shadow, transform: `rotate(${-3 + i * 2}deg)`, opacity: cl(k * 2) })}>
        <div style={ab(40, 40, { width: 110, height: 110, borderRadius: "50%", background: "#2a3440", color: "#fff", fontFamily: F, fontSize: 70, textAlign: "center", lineHeight: "110px" })}>{n}</div>
        <div style={txt(180, 40, 56, "#2a2a2a")}>{l}</div><div style={txt(180, 120, 44, i === 2 ? "#a5170f" : "#1f7a3e")}>{c}</div>
      </div>; })}
    <div style={ab(1320, 520, { opacity: cl((tt - 2.4) * 3) })}><Block x={0} y={0} w={420} n={4} /><div style={txt(40, 300, 52, RED)}>vs. AN ENGINE</div></div>
    <Tag tt={tt} at={3.4} x={1520} y={200} txt="3 PAPERS" col={MZ} />
  </>;
}}</Stage>;

// 34 · el cojinete de biela en corte: la película de aceite, las virutas que entran, el golpe y el motor clavado
const Cojinete: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#14171c">{(tt) => {
  const chips = eio(tt, 0.8, 2.0), film = 1 - eio(tt, 1.6, 2.8), seize = tt > 3.1, rot = seize ? 3.1 * 220 : tt * 220, knock = !seize && tt > 2.0 ? Math.abs(Math.sin(tt * 18)) : 0;
  return <>
    <svg style={ab(560, 140)} width={800} height={800} viewBox="-400 -400 800 800">
      <circle r={330} fill="#4b5259" /><circle r={250} fill="#2a2f35" />
      <circle r={232} fill="none" stroke="#d9a63a" strokeWidth={26} />
      <circle r={214} fill="none" stroke={OIL} strokeWidth={14 * film} opacity={0.85} />
      <g transform={`rotate(${rot})`}><circle r={205} fill="url(#jg)" /><rect x={-20} y={-205} width={40} height={60} fill="#5f666c" /><defs><radialGradient id="jg"><stop offset="0" stopColor="#d7dce0" /><stop offset="1" stopColor="#7c848b" /></radialGradient></defs></g>
      {Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2 + tt * 2; const r = lerp(380, 222, chips); return <rect key={i} x={Math.cos(a) * r - 6} y={Math.sin(a) * r - 6} width={12} height={12} fill="#fff6c8" transform={`rotate(${i * 30} ${Math.cos(a) * r} ${Math.sin(a) * r})`} opacity={chips} />; })}
      {knock > 0 && [0, 1, 2].map((j) => <circle key={j} r={340 + j * 30 + knock * 20} fill="none" stroke={RED} strokeWidth={6} opacity={knock * (1 - j * 0.3)} />)}
    </svg>
    <div style={txt(140, 300, 46, "#d9a63a")}>BEARING</div><div style={txt(140, 370, 46, OIL, film)}>OIL FILM</div><div style={txt(140, 440, 46, "#fff6c8", chips)}>METAL BITS</div>
    {seize && <Stamp x={1620} y={540} k={(tt - 3.1) * 3} txt="SEIZED" />}
    <Tag tt={tt} at={2.2} x={1600} y={300} txt="KNOCK" col={RED} />
  </>;
}}</Stage>;

// 35 · el sensor escucha: la onda corre, aparecen picos, se marcan y el velocímetro queda topeado abajo
const Sensor: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#12161b">{(tt) => {
  const pts = Array.from({ length: 120 }, (_, i) => { const x = i * 10, ph = i + tt * 40, spike = tt > 1.0 && i % 23 === Math.floor(tt * 3) % 23 ? 1 : 0, big = spike && i > 30; return `${x},${100 - Math.sin(ph * 0.6) * 18 - (big ? 80 : 0) + rnd(i + Math.floor(tt * 10)) * 10}`; }).join(" ");
  const lim = eio(tt, 2.2, 2.8), needle = lerp(-120, lerp(40, -60, lim), eio(tt, 0.2, 1.2));
  return <>
    <div style={ab(120, 220, { width: 1200, height: 220, borderRadius: 20, background: "#0b0e11", boxShadow: "inset 0 0 0 4px #2a3138" })}>
      <svg width={1200} height={220} viewBox="0 0 1200 220"><polyline points={pts} fill="none" stroke={VER} strokeWidth={5} /></svg>
      {tt > 1.4 && <div style={ab(560, 10, { width: 160, height: 200, border: `6px solid ${RED}`, borderRadius: 12, opacity: Math.sin(tt * 10) > 0 ? 1 : 0.5 })} />}
    </div>
    <div style={txt(140, 470, 46, tt > 1.4 ? RED : DIM)}>{tt > 1.4 ? "KNOCK HEARD" : "LISTENING..."}</div>
    <svg style={ab(1360, 300)} width={460} height={460} viewBox="-230 -230 460 460">
      <circle r={210} fill="#0b0e11" stroke="#3a3f45" strokeWidth={10} />
      <path d={`M ${Math.cos((-210 * Math.PI) / 180) * 180} ${Math.sin((-210 * Math.PI) / 180) * 180} A 180 180 0 1 1 ${Math.cos((30 * Math.PI) / 180) * 180} ${Math.sin((30 * Math.PI) / 180) * 180}`} fill="none" stroke="#2c3339" strokeWidth={22} />
      <path d={`M ${Math.cos((-60 * Math.PI) / 180) * 180} ${Math.sin((-60 * Math.PI) / 180) * 180} A 180 180 0 0 1 ${Math.cos((30 * Math.PI) / 180) * 180} ${Math.sin((30 * Math.PI) / 180) * 180}`} fill="none" stroke={RED} strokeWidth={22} opacity={lim} />
      <line x1={0} y1={0} x2={0} y2={-160} stroke={MZ} strokeWidth={10} strokeLinecap="round" transform={`rotate(${needle})`} /><circle r={20} fill={MZ} />
    </svg>
    <div style={txt(1380, 790, 46, RED, lim)}>REDUCED POWER</div>
    <Tag tt={tt} at={3.2} x={720} y={760} txt="GET OFF" col={MZ} />
  </>;
}}</Stage>;

// 36 · por qué es el número uno: cuatro motores cuestan plata; el último, todo de golpe en la autopista
const Seguridad: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#171a1e">{(tt) => {
  const R = [["#5", "BURNS OIL", 1], ["#4", "RATTLES CHAIN", 2], ["#3", "COOKS ITSELF", 4], ["#2", "BLOWS GASKETS", 3], ["#1", "ALL AT ONCE", 0]] as const;
  return <>
    <div style={txt(1150, 130, 44, DIM, cl(tt * 2))}>MONEY</div><div style={txt(1480, 130, 44, RED, cl(tt * 2))}>SAFETY</div>
    {R.map(([n, l, m], i) => { const k = phys(tt, 0.2 + i * 0.45, 7, 0.5), one = i === 4;
      return <div key={i} style={ab(150, 210 + i * 160, { width: 1620, height: 130, borderRadius: 18, background: one ? "#3a1512" : "#222a32", boxShadow: one ? `0 0 0 5px ${RED}, ${shadow}` : shadow, opacity: cl(k * 2), transform: `translateX(${(1 - k) * -300}px)` })}>
        <div style={txt(40, 30, 64, one ? RED : MZ)}>{n}</div><div style={txt(200, 36, 54, TX)}>{l}</div>
        <div style={txt(1000, 30, 64, VER)}>{"$".repeat(m || 0)}</div>
        {one && <div style={ab(1390, 25, { width: 80, height: 80, borderRadius: "50%", background: RED, opacity: cl((tt - 2.6) * 3), transform: `scale(${1 + 0.1 * Math.sin(tt * 10)})`, fontFamily: F, fontSize: 60, color: "#fff", textAlign: "center", lineHeight: "80px" })}>!</div>}
      </div>; })}
  </>;
}}</Stage>;

// 37 · la olla y la cuchara: el golpeteo abajo se acelera con las vueltas del motor
const Cuchara: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#1a1b1e">{(tt) => {
  const rpm = eio(tt, 0.6, 3.0), rate = 4 + rpm * 16, ph = Math.sin(tt * rate), hit = ph > 0.85 ? 1 : 0;
  return <>
    <div style={ab(500, 260, { width: 700, height: 380, borderRadius: "20px 20px 220px 220px", background: "linear-gradient(#a9b0b7,#5f666c)", boxShadow: shadow })}><div style={ab(-40, -20, { width: 780, height: 50, borderRadius: 25, background: "#c9cfd5" })} /></div>
    <div style={ab(820, 700, { width: 420, height: 60, transformOrigin: "0 50%", transform: `rotate(${-30 + 30 * Math.max(0, ph)}deg)` })}><div style={ab(0, 10, { width: 300, height: 30, borderRadius: 15, background: "linear-gradient(#d7dce0,#8d959d)" })} /><div style={ab(-60, -10, { width: 110, height: 70, borderRadius: "50%", background: "linear-gradient(#e2e6ea,#9aa1a8)" })} /></div>
    {hit > 0 && [0, 1].map((j) => <div key={j} style={ab(700 - j * 40, 640 - j * 20, { width: 260 + j * 80, height: 80 + j * 40, borderRadius: "50%", border: `5px solid ${MZ}`, opacity: 0.8 - j * 0.3 })} />)}
    <svg style={ab(1360, 300)} width={420} height={260} viewBox="-210 -210 420 260"><path d="M -180 0 A 180 180 0 0 1 180 0" fill="none" stroke="#2c3339" strokeWidth={22} /><line x1={0} y1={0} x2={0} y2={-160} stroke={RED} strokeWidth={10} strokeLinecap="round" transform={`rotate(${lerp(-80, 70, rpm)})`} /><circle r={18} fill={RED} /></svg>
    <div style={txt(1480, 580, 46, DIM)}>RPM</div>
    <Tag tt={tt} at={2.2} x={960} y={150} txt="DEEP KNOCK" col={MZ} />
  </>;
}}</Stage>;

// 38 · «son los botadores, señor» contra cuarenta y seis años de oído: el sello NOT THE LIFTERS
const Lifters: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#1c1f24">{(tt) => <>
  <Bubble x={140} y={200} w={760} k={cl((tt - 0.2) * 2)}>"That's just the lifters, sir. All of them do that."</Bubble>
  <div style={ab(1100, 220, { width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(#2a3440,#151b21)", boxShadow: shadow, opacity: cl((tt - 1.0) * 2) })}>
    <svg style={ab(130, 120)} width={340} height={360} viewBox="0 0 340 360"><path d="M200 40 C80 30 60 160 120 200 C150 220 130 280 170 300 C210 320 250 290 240 250 C230 210 280 190 270 130 C260 70 230 45 200 40 Z" fill="none" stroke={MZ} strokeWidth={12} /><path d="M180 110 C150 110 145 160 175 170" fill="none" stroke={MZ} strokeWidth={10} /></svg>
    <div style={mid(600, 470, 56, TX)}>46 YEARS</div>
  </div>
  <Stamp x={700} y={760} k={(tt - 2.4) * 2.5} txt="NOT THE LIFTERS" />
</>}</Stage>;

// 39 · la carpetita de la señora de la iglesia: se abre y cada cambio de aceite está anotado a mano
const Carpeta: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#1f1c18">{(tt) => {
  const open = eio(tt, 0.4, 1.2), L = ["Jan 2016 · 61,240 mi", "Jul 2016 · 65,980 mi", "Feb 2017 · 70,310 mi", "Aug 2017 · 74,900 mi", "Mar 2018 · 79,450 mi", "Oct 2018 · 83,700 mi"];
  return <>
    <div style={{ position: "absolute", left: 360, top: 160, width: 1200, height: 780, perspective: 2000 }}>
      <div style={ab(600, 0, { width: 600, height: 780, borderRadius: "0 16px 16px 0", background: "linear-gradient(#fbf7ea,#ece3cb)", boxShadow: shadow })}>
        {L.map((l, i) => { const k = cl((tt - 1.2 - i * 0.35) * 2); return <div key={i} style={{ ...txt(40, 80 + i * 110, 50, "#24306b", 1, HAND), fontWeight: 700, clipPath: `inset(0 ${100 - k * 100}% 0 0)` }}>{l}</div>; })}
      </div>
      <div style={ab(0, 0, { width: 600, height: 780, borderRadius: "16px 0 0 16px", background: "linear-gradient(#e2c27a,#b8954a)", boxShadow: shadow })} />
      <div style={ab(600, 0, { width: 600, height: 780, borderRadius: "0 16px 16px 0", background: "linear-gradient(#e8c983,#c19d52)", transformOrigin: "0 50%", transform: `rotateY(${-178 * open}deg)`, backfaceVisibility: "hidden" })}><div style={mid(600, 320, 60, "#6a4d1a")}>OIL CHANGES</div></div>
    </div>
    <Tag tt={tt} at={3.5} x={960} y={1010} txt="ALL WRITTEN" col={MZ} />
  </>;
}}</Stage>;

// 40 · la lista entera en una tarjeta y el obturador del teléfono la captura (flash)
const Captura: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#15191e">{(tt) => {
  const L = ["#5  3.5 V6 w/ CYLINDER MGMT", "#4  2.4 FOUR · EQUINOX/TERRAIN", "#3  N63 TWIN-TURBO V8", "#2  6.0 POWER STROKE", "#1  THETA II 2.4 / 2.0T"], flash = tt > 2.8 ? cl(1 - (tt - 2.8) * 3) : 0, fr = eio(tt, 2.2, 2.8);
  return <>
    <div style={ab(360, 180, { width: 1200, height: 720, borderRadius: 24, background: PAPER, boxShadow: shadow })}>
      <div style={mid(1200, 40, 56, "#a5170f")}>5 ENGINES I'D NEVER BUY</div>
      {L.map((l, i) => <div key={i} style={{ ...txt(80, 160 + i * 100, 46, "#2a2a2a", cl((tt - 0.3 - i * 0.25) * 3)) }}>{l}</div>)}
      <div style={txt(80, 650, 34, "#555", cl((tt - 1.8) * 3))}>+ VIN · RECORDS · INSPECTION</div>
    </div>
    {[[300, 130, 0], [1520, 130, 90], [1520, 870, 180], [300, 870, 270]].map(([x, y, r], i) => <div key={i} style={ab(x - lerp(80, 0, fr) * (i === 0 || i === 3 ? 1 : -1), y - lerp(80, 0, fr) * (i < 2 ? 1 : -1), { width: 100, height: 100, borderTop: "10px solid #fff", borderLeft: "10px solid #fff", transform: `rotate(${r}deg)`, opacity: fr })} />)}
    <div style={ab(0, 0, { width: 1920, height: 1080, background: "#fff", opacity: flash })} />
    <Tag tt={tt} at={3.2} x={960} y={1000} txt="SAVE IT" col={MZ} />
  </>;
}}</Stage>;

export const TEC: Record<string, C> = {
  parabrisas: Parabrisas, cincomotores: CincoMotores, papeleo: Papeleo, estacionamiento: Estacionamiento, cartasenora: CartaSenora, dosmil: DosMil,
  arbolito: Arbolito, motorlimpio: MotorLimpio, vcm: VCM, anillos: Anillos, bujias: Bujias, garantia: Garantia, soportes: Soportes, cartero: Cartero,
  cuatrochequeo: CuatroChequeo, cuartopormil: CuartoPorMil, cadena: Cadena, jurado: Jurado, traqueteo: Traqueteo, preguntaaceite: PreguntaAceite,
  vcaliente: VCaliente, cocina: Cocina, estimado: Estimado, humoazul: HumoAzul, enfriador: Enfriador, pernos: Pernos, demanda: Demanda, blindaje: Blindaje,
  recibos: Recibos, refrigerante: Refrigerante, vin: Vin, nhtsa: Nhtsa, trespapeles: TresPapeles, cojinete: Cojinete, sensor: Sensor, seguridad: Seguridad,
  cuchara: Cuchara, lifters: Lifters, carpeta: Carpeta, captura: Captura,
};
export const _unused = { lerp };

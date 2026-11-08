// r8 · utilería común de los componentes únicos de premium8n_B (Ramón). Objetos dibujados en código; 3D = CSS 3D real.
import React from "react";
import { cl, HAND, lerp, phys, rnd } from "./ckit";
export { cl, HAND, lerp, phys, rnd };
export const ab = (x: number, y: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: x, top: y, ...extra });
export const F = "'Arial Black', Arial, sans-serif";
export const txt = (x: number, y: number, s: number, c: string, o = 1, font = F): React.CSSProperties => ({ position: "absolute", left: x, top: y, fontFamily: font, fontSize: s, fontWeight: 900, color: c, opacity: o, lineHeight: 1, whiteSpace: "nowrap" });
export const CHROME = "linear-gradient(100deg,#6d7680,#dfe6ec 28%,#8d969f 55%,#e8edf2 78%,#6a7279)";
export const STEEL = "linear-gradient(#59616b,#2c3138)";
export const RUBBER = "linear-gradient(#34363a,#121316)";
export const SHAD = "0 34px 70px rgba(0,0,0,.6)";
export const YEL = "linear-gradient(170deg,#f3dd8c,#dcc068)";
export const Scene: React.FC<{ x?: number; y?: number; rx: number; ry: number; rz?: number; s?: number; children: React.ReactNode }> = ({ x = 960, y = 540, rx, ry, rz = 0, s = 1, children }) => (
  <div style={ab(x, y, { perspective: 1700, perspectiveOrigin: "50% 40%" })}><div style={{ transformStyle: "preserve-3d", transform: `scale(${s}) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)` }}>{children}</div></div>
);
export const Box: React.FC<{ w: number; h: number; d: number; c: string; top?: string; front?: React.ReactNode; z?: number; x?: number; y?: number; side?: string }> = ({ w, h, d, c, top, front, z = 0, x = 0, y = 0, side }) => {
  const f = (tr: string, ww: number, hh: number, bg: string, ch?: React.ReactNode) => <div style={{ position: "absolute", left: -ww / 2, top: -hh / 2, width: ww, height: hh, transform: tr, background: bg, overflow: "hidden" }}>{ch}</div>;
  return <div style={{ position: "absolute", transformStyle: "preserve-3d", transform: `translate3d(${x}px,${y}px,${z}px)` }}>
    {f(`translateZ(${d / 2}px)`, w, h, c, front)}{f(`rotateY(180deg) translateZ(${d / 2}px)`, w, h, c)}{f(`rotateY(90deg) translateZ(${w / 2}px)`, d, h, side ?? c)}{f(`rotateY(-90deg) translateZ(${w / 2}px)`, d, h, side ?? c)}{f(`rotateX(90deg) translateZ(${h / 2}px)`, w, d, top ?? c)}{f(`rotateX(-90deg) translateZ(${h / 2}px)`, w, d, side ?? c)}
  </div>;
};
export const Finger: React.FC<{ x: number; y: number; w?: number; rot?: number }> = ({ x, y, w = 96, rot = 0 }) => (
  <div style={ab(x - w / 2, y - 560, { width: w, height: 560, borderRadius: w / 2, background: "linear-gradient(90deg,#b9845e,#dcaa82 45%,#b07a55)", transform: `rotate(${rot}deg)`, transformOrigin: "50% 100%", boxShadow: "0 18px 30px rgba(0,0,0,.45)" })}>
    <div style={ab(w * 0.16, 468, { width: w * 0.68, height: 62, borderRadius: "40% 40% 50% 50%", background: "rgba(255,235,220,.55)", boxShadow: "inset 0 0 0 2px rgba(120,80,50,.3)" })} />
    <div style={ab(w * 0.1, 360, { width: w * 0.8, height: 5, background: "rgba(90,55,30,.35)", borderRadius: 3 })} /><div style={ab(w * 0.1, 376, { width: w * 0.8, height: 4, background: "rgba(90,55,30,.28)", borderRadius: 3 })} />
  </div>
);
export const Slip: React.FC<{ x: number; y: number; r?: number; w?: number; o?: number }> = ({ x, y, r = 0, w = 190, o = 1 }) => (
  <div style={ab(x - w / 2, y - w * 0.32, { width: w, height: w * 0.64, opacity: o, transform: `rotate(${r}deg)`, background: YEL, borderRadius: 3, boxShadow: "0 8px 14px rgba(0,0,0,.4)", overflow: "hidden" })}>
    {[0.14, 0.32, 0.5, 0.68, 0.86].map((k, i) => <div key={i} style={ab(w * 0.08, w * 0.64 * k, { width: w * (0.5 + 0.34 * rnd(i + w)), height: 3, background: "rgba(40,50,90,.55)" })} />)}
  </div>
);
export const Card: React.FC<{ x: number; y: number; w?: number; h?: number; r?: number; ry?: number; children?: React.ReactNode; glow?: number }> = ({ x, y, w = 760, h = 470, r = 0, ry = 0, children, glow = 0 }) => (
  <div style={ab(x - w / 2, y - h / 2, { width: w, height: h, transform: `perspective(1800px) rotateY(${ry}deg) rotate(${r}deg)`, background: "repeating-linear-gradient(180deg,#fbf8ee 0 40px,#bcd0e6 40px 42px)", borderRadius: 8, boxShadow: `${SHAD}${glow > 0 ? `, 0 0 ${glow * 90}px rgba(255,214,120,${glow * 0.8})` : ""}`, overflow: "hidden" })}>
    <div style={ab(0, 38, { width: w, height: 3, background: "#d0473f" })} />{children}
  </div>
);
export const Hand: React.FC<{ x: number; y: number; s: number; c?: string; rot?: number; k?: number; children: string }> = ({ x, y, s, c = "#1e2b63", rot = -2, k = 1, children }) => (
  <div style={{ position: "absolute", left: x, top: y, fontFamily: HAND, fontSize: s, fontWeight: 700, color: c, lineHeight: 1, whiteSpace: "nowrap", transform: `rotate(${rot}deg)`, clipPath: `inset(-20% ${100 - cl(k) * 100}% -20% 0)` }}>{children}</div>
);
// auto de perfil (SVG): sedan o pickup, color y ruedas giratorias
export const Car: React.FC<{ x: number; y: number; w?: number; c?: string; pick?: boolean; spin?: number; rot?: number; o?: number; o2?: string }> = ({ x, y, w = 980, c = "#b9bec4", pick, spin = 0, rot = 0, o = 1, o2 = "50% 90%" }) => {
  const b = pick ? "M20 300 L24 212 L70 196 L300 190 L380 96 Q388 86 402 86 L585 86 Q604 86 610 104 L640 190 L970 190 Q984 192 984 214 L984 300 Z" : "M18 300 Q10 238 60 222 L232 196 L340 106 Q354 92 376 92 L640 92 Q664 92 682 112 L770 196 L930 214 Q984 226 984 270 L984 300 Z";
  const gl = pick ? "M400 106 L330 190 L488 190 L488 106 Z M505 106 L505 190 L620 190 L596 106 Z" : "M372 112 L286 194 L492 194 L492 112 Z M510 112 L510 194 L732 194 L662 112 Z";
  return <svg width={w} height={w * 0.42} viewBox="0 0 1000 420" style={{ position: "absolute", left: x - w / 2, top: y - w * 0.42, overflow: "visible", opacity: o, transform: `rotate(${rot}deg)`, transformOrigin: o2 }}>
    <defs><linearGradient id={"cb" + Math.round(x)} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".38" /><stop offset=".45" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".42" /></linearGradient></defs>
    <path d={b} fill={c} /><path d={b} fill={`url(#cb${Math.round(x)})`} /><path d={gl} fill="#1c2733" opacity=".92" />
    <rect x="14" y="296" width="972" height="20" rx="8" fill="#23262b" />
    {[220, 780].map((cx) => <g key={cx} transform={`rotate(${spin} ${cx} 312)`}><circle cx={cx} cy={312} r={76} fill="#101114" /><circle cx={cx} cy={312} r={44} fill="#a7adb5" />{[0, 72, 144, 216, 288].map((a) => <rect key={a} x={cx - 5} y={270} width={10} height={40} fill="#555b63" transform={`rotate(${a} ${cx} 312)`} />)}</g>)}
  </svg>;
};

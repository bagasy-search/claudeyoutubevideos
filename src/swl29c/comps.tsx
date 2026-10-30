// swl29c · los componentes únicos del video (uno por minuto, ninguno repetido en la tanda: D:/rtmp/swl29_COMPONENTES.md).
// v5 (ronda 1 del evaluador): cada idea es un OBJETO con volumen (cara + canto + brillo + sombra de contacto), apoyado en la mesa,
// que se arma de a partes después de la entrada y no se queda quieto. Una sola palabra por escena, grande y dentro del objeto.
import React from "react";
import { Img } from "remotion";
import { Stage, Tag, Shadow, H, K, cl, phys, eio, eIn, eOut, lerp, rnd, img, SERIF, HAND, MARK, SANS } from "./kit";

const r = (h: H, i: number, d = 0) => (h.b[i] ?? h.at + d) - h.at;   // beat i relativo a la entrada
export const bt = (h: H, lo = 1.0, hi = 3.4) => Math.max(lo, Math.min(hi, r(h, 0, 1.5)));   // la acción principal, dentro de los 6 s
type CP = { t: number; h: H };
const uid = () => "u" + React.useId().replace(/:/g, "");
const A: React.CSSProperties = { position: "absolute" };
export const golden = "radial-gradient(ellipse at 38% 30%,#f7c77a,#d68a3a 45%,#8a4a18 85%)";
export const fall = (tt: number, a: number, h0: number, g = 2600) => { const d = tt - a; return d <= 0 ? -h0 : Math.min(0, -h0 + 0.5 * g * d * d); };   // caída con gravedad hasta 0
const bounce = (tt: number, a: number, h0 = 420) => { const d = tt - a; if (d <= 0) return -h0; const T = Math.sqrt(2 * h0 / 2600); if (d < T) return -h0 + 1300 * d * d; const e = d - T; return -Math.abs(Math.sin(e * 9)) * 40 * Math.exp(-e * 6); };

// ───────────────────────── objetos con volumen ─────────────────────────

// muslo visto desde arriba con canto (grosor), poros, pliegues y brillo especular; k = cuánto se doró
export const Thigh: React.FC<{ w: number; k?: number; rot?: number; sq?: number; style?: React.CSSProperties }> = ({ w, k = 0, rot = 0, sq = 1, style }) => {
  const id = uid();
  const c = (a: number[], b: number[]) => `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], k))).join(",")})`;
  const P = "M28 68 C 22 42, 50 20, 92 18 C 128 16, 154 34, 158 60 C 162 90, 140 120, 98 124 C 56 128, 34 98, 28 68 Z";
  return <div style={{ position: "relative", width: w, height: w * 0.76, transform: `rotate(${rot}deg) scaleY(${sq})`, ...style }}>
    <svg width={w} height={w * 0.76} viewBox="0 0 200 152" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <defs>
        <radialGradient id={id + "s"} cx="40%" cy="32%" r="72%"><stop offset="0%" stopColor={c([255, 236, 216], [252, 214, 130])} /><stop offset="50%" stopColor={c([240, 198, 170], [220, 138, 56])} /><stop offset="100%" stopColor={c([206, 150, 124], [128, 58, 14])} /></radialGradient>
        <pattern id={id + "p"} width="8" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(18)"><circle cx="3" cy="3" r="1.1" fill={c([190, 134, 110], [110, 46, 8])} opacity=".5" /><circle cx="6.5" cy="5.6" r=".7" fill={c([190, 134, 110], [100, 40, 6])} opacity=".4" /></pattern>
      </defs>
      <path d={P} transform="translate(0 12)" fill={c([150, 84, 72], [70, 28, 6])} />
      <path d="M150 52 C 170 40, 186 46, 190 56 C 194 66, 184 74, 172 72 Z" fill="#f3ead8" stroke="#cbb994" strokeWidth="2" />
      <path d="M22 70 C 14 40, 46 14, 92 12 C 132 10, 160 30, 166 58 C 172 92, 146 128, 98 132 C 52 136, 28 104, 22 70 Z" fill={c([228, 128, 118], [150, 62, 28])} />
      <path d={P} fill={`url(#${id}s)`} />
      <path d={P} fill={`url(#${id}p)`} />
      <path d="M44 52 C 56 34, 78 28, 100 30" fill="none" stroke={c([255, 248, 238], [255, 240, 190])} strokeWidth="7" strokeLinecap="round" opacity={0.5 + 0.35 * k} />
      <ellipse cx="78" cy="44" rx="16" ry="6" fill="#fff" opacity={0.25 + 0.35 * k} />
      <path d="M60 110 C 80 120, 112 120, 134 104" fill="none" stroke={c([200, 144, 120], [100, 40, 8])} strokeWidth="3" opacity=".5" />
      {k > 0.3 && Array.from({ length: 10 }, (_, i) => <ellipse key={i} cx={46 + rnd(i + 2) * 100} cy={36 + rnd(i + 7) * 78} rx={4 + rnd(i) * 6} ry={3 + rnd(i + 1) * 3} fill="#5e2404" opacity={(k - 0.3) * 0.55} />)}
      {k > 0.5 && Array.from({ length: 6 }, (_, i) => <ellipse key={"h" + i} cx={58 + rnd(i + 20) * 74} cy={38 + rnd(i + 30) * 44} rx="5" ry="2" fill="#fff6d8" opacity={(k - 0.5) * 1.3} />)}
    </svg>
  </div>;
};

// sartén de hierro en perspectiva: canto, borde con brillo, fondo con calor (heat 0-1); los hijos van sobre el fondo (coords del div)
const Skillet: React.FC<{ x: number; y: number; w: number; heat?: number; cold?: boolean; children?: React.ReactNode }> = ({ x, y, w, heat = 0, cold, children }) => {
  const id = uid(), h = w * 0.62;
  return <div style={{ ...A, left: x - w / 2, top: y - h / 2, width: w, height: h }}>
    <Shadow x={w / 2} y={h * 0.86} w={w * 1.05} k={1} o={0.75} />
    <svg width={w * 1.5} height={h} viewBox={`0 0 ${w * 1.5} ${h}`} style={{ ...A, left: 0, top: 0, overflow: "visible" }}>
      <defs>
        <radialGradient id={id + "f"} cx="45%" cy="40%" r="65%"><stop offset="0%" stopColor={cold ? "#3a4048" : "#3d3836"} /><stop offset="100%" stopColor={cold ? "#12161a" : "#141110"} /></radialGradient>
        <radialGradient id={id + "h"} cx="50%" cy="50%" r="55%"><stop offset="0%" stopColor="#ff8a3a" stopOpacity={0.45 * heat} /><stop offset="100%" stopColor="#ff5a1a" stopOpacity="0" /></radialGradient>
        <linearGradient id={id + "r"} x1="0" x2="1"><stop offset="0%" stopColor="#1a1716" /><stop offset="35%" stopColor="#5a5450" /><stop offset="60%" stopColor="#2a2624" /><stop offset="100%" stopColor="#100e0d" /></linearGradient>
      </defs>
      <rect x={w * 0.9} y={h * 0.4} width={w * 0.62} height={w * 0.07} rx={w * 0.035} fill={`url(#${id}r)`} transform={`rotate(-6 ${w * 0.9} ${h * 0.44})`} />
      <ellipse cx={w / 2} cy={h * 0.56} rx={w / 2} ry={h * 0.36} fill="#0b0909" />
      <rect x={0} y={h * 0.44} width={w} height={h * 0.12} fill={`url(#${id}r)`} />
      <ellipse cx={w / 2} cy={h * 0.44} rx={w / 2} ry={h * 0.36} fill={`url(#${id}r)`} />
      <ellipse cx={w / 2} cy={h * 0.46} rx={w * 0.45} ry={h * 0.31} fill={`url(#${id}f)`} />
      <ellipse cx={w / 2} cy={h * 0.46} rx={w * 0.45} ry={h * 0.31} fill={`url(#${id}h)`} />
      <path d={`M ${w * 0.12} ${h * 0.34} Q ${w * 0.3} ${h * 0.1} ${w * 0.62} ${h * 0.1}`} fill="none" stroke="rgba(255,255,255,.22)" strokeWidth={w * 0.012} strokeLinecap="round" />
    </svg>
    <div style={{ ...A, left: w * 0.05, top: h * 0.15, width: w * 0.9, height: h * 0.62 }}>{children}</div>
  </div>;
};

// plato de loza en perspectiva (borde con filete dorado opcional)
const Plate: React.FC<{ x: number; y: number; w: number; gold?: boolean; children?: React.ReactNode }> = ({ x, y, w, gold, children }) => {
  const id = uid(), h = w * 0.5;
  return <div style={{ ...A, left: x - w / 2, top: y - h / 2, width: w, height: h }}>
    <Shadow x={w / 2} y={h * 0.9} w={w} k={1} o={0.6} />
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ ...A, inset: 0, overflow: "visible" }}>
      <defs><radialGradient id={id} cx="42%" cy="38%" r="70%"><stop offset="0%" stopColor="#ffffff" /><stop offset="70%" stopColor="#ece6da" /><stop offset="100%" stopColor="#cfc6b4" /></radialGradient></defs>
      <ellipse cx={w / 2} cy={h * 0.56} rx={w / 2} ry={h * 0.42} fill="#b9b09e" />
      <ellipse cx={w / 2} cy={h * 0.5} rx={w / 2} ry={h * 0.42} fill={`url(#${id})`} />
      {gold && <ellipse cx={w / 2} cy={h * 0.5} rx={w * 0.45} ry={h * 0.37} fill="none" stroke="#d8b25a" strokeWidth={w * 0.012} />}
      <ellipse cx={w / 2} cy={h * 0.52} rx={w * 0.33} ry={h * 0.26} fill="rgba(0,0,0,.05)" />
      <path d={`M ${w * 0.14} ${h * 0.36} Q ${w * 0.3} ${h * 0.14} ${w * 0.56} ${h * 0.12}`} fill="none" stroke="#fff" strokeWidth={w * 0.014} strokeLinecap="round" opacity=".9" />
    </svg>
    <div style={{ ...A, left: w * 0.15, top: h * 0.12, width: w * 0.7, height: h * 0.76 }}>{children}</div>
  </div>;
};

// vapor que sube en volutas
const Steam: React.FC<{ x: number; y: number; tt: number; n?: number; w?: number; k?: number; hgt?: number }> = ({ x, y, tt, n = 6, w = 200, k = 1, hgt = 360 }) => <>{Array.from({ length: n }, (_, i) => {
  const p = ((tt * 0.45 + i / n) % 1), s = 60 + 90 * p;
  return <div key={i} style={{ ...A, left: x - w / 2 + rnd(i) * w + Math.sin(tt * 1.4 + i) * 30 * p - s / 2, top: y - p * hgt - s / 2, width: s, height: s * 1.3, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,255,255,.42),transparent 68%)", filter: "blur(8px)", opacity: k * Math.sin(p * Math.PI) }} />;
})}</>;

// gota de agua con reflejo
const Drop: React.FC<{ x: number; y: number; s: number; col?: string; o?: number }> = ({ x, y, s, col = "#bfe4ff", o = 1 }) => <svg width={s} height={s * 1.3} viewBox="0 0 20 26" style={{ ...A, left: x - s / 2, top: y - s * 0.65, overflow: "visible", opacity: o }}>
  <path d="M10 1 C 14 9, 18 13, 18 17 A 8 8 0 0 1 2 17 C 2 13, 6 9, 10 1 Z" fill={col} fillOpacity=".75" stroke="rgba(255,255,255,.7)" strokeWidth=".8" />
  <ellipse cx="7" cy="15" rx="2" ry="3" fill="#fff" opacity=".85" />
</svg>;

// mano de Loretta (manga lila) que entra desde un costado; press 0-1 = cuánto aprieta (dedos se cierran)
const Hand: React.FC<{ x: number; y: number; s?: number; rot?: number; press?: number }> = ({ x, y, s = 1, rot = 0, press = 0 }) => {
  const id = uid();
  return <svg width={520 * s} height={300 * s} viewBox="0 0 520 300" style={{ ...A, left: x, top: y, overflow: "visible", transform: `rotate(${rot}deg)`, transformOrigin: "0 50%", filter: "drop-shadow(0 18px 20px rgba(0,0,0,.45))" }}>
    <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f2d2b8" /><stop offset="100%" stopColor="#c99a7c" /></linearGradient></defs>
    <path d="M520 80 L 330 96 L 330 210 L 520 230 Z" fill="#b7a0d4" />
    <path d="M330 96 L 300 100 L 300 206 L 330 210 Z" fill="#9c86bc" />
    <path d="M300 104 C 250 96, 190 100, 170 120 L 168 196 C 190 214, 250 214, 300 204 Z" fill={`url(#${id})`} />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={70 + press * 50 + i * 4} y={112 + i * 22} width={120 - press * 50} height={22} rx={11} fill={`url(#${id})`} stroke="#b88a6c" strokeWidth="1.5" />)}
    <path d="M250 200 C 220 236, 180 250, 150 246" fill="none" stroke={`url(#${id})`} strokeWidth="26" strokeLinecap="round" />
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${172 + press * 6} ${118 + i * 22} q 6 6 0 14`} fill="none" stroke="#a87a5e" strokeWidth="2" opacity=".6" />)}
  </svg>;
};

// caja con caras (CSS 3D): frente, tapa y costado
export const Box3: React.FC<{ x: number; y: number; w: number; h: number; d: number; front: string; top: string; side: string; ry?: number; rx?: number; children?: React.ReactNode; lid?: React.ReactNode }> = ({ x, y, w, h, d, front, top, side, ry = -24, rx = -14, children, lid }) => (
  <div style={{ ...A, left: x - w / 2, top: y - h / 2, width: w, height: h, transformStyle: "preserve-3d", transform: `rotateX(${rx}deg) rotateY(${ry}deg)` }}>
    <div style={{ ...A, inset: 0, background: front, transform: `translateZ(${d / 2}px)`, overflow: "hidden" }}>{children}</div>
    <div style={{ ...A, left: 0, top: 0, width: w, height: d, background: top, transformOrigin: "50% 0", transform: `translateZ(${d / 2}px) rotateX(90deg)` }}>{lid}</div>
    <div style={{ ...A, right: 0, top: 0, width: d, height: h, background: side, transformOrigin: "100% 50%", transform: `translateZ(${d / 2}px) rotateY(90deg)` }} />
    <div style={{ ...A, left: 0, top: 0, width: d, height: h, background: side, transformOrigin: "0 50%", transform: `translateZ(${d / 2}px) rotateY(-90deg)`, filter: "brightness(.7)" }} />
  </div>
);


// chuleta con volumen vista desde arriba: canto (grosor), borde de grasa, hueso, vetas y brillo; k = dorada, g = gris; bites = mordiscos (recorte real)
const Chop3: React.FC<{ w: number; k?: number; g?: number; rot?: number; bites?: number; th?: number; style?: React.CSSProperties }> = ({ w, k = 0, g = 0, rot = 0, bites = 0, th = 14, style }) => {
  const id = uid();
  const c = (a: number[], b: number[], gg: number[]) => `rgb(${a.map((v, i) => Math.round(lerp(lerp(v, b[i], k), gg[i], g))).join(",")})`;
  const P = "M10,96 C4,72 28,56 52,49 C66,20 118,6 160,19 C193,31 199,78 179,105 C159,131 108,137 70,125 C48,118 32,112 10,96 Z";
  return <svg width={w} height={w * 0.78} viewBox="0 0 200 156" style={{ transform: `rotate(${rot}deg)`, overflow: "visible", ...style }}>
    <defs>
      <radialGradient id={id + "m"} cx="0.5" cy="0.36" r="0.72"><stop offset="0" stopColor={c([236, 150, 140], [196, 112, 52], [178, 160, 146])} /><stop offset="0.6" stopColor={c([206, 112, 108], [150, 70, 26], [150, 132, 118])} /><stop offset="1" stopColor={c([160, 70, 70], [96, 36, 10], [112, 98, 88])} /></radialGradient>
      <linearGradient id={id + "f"} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={c([255, 248, 236], [244, 204, 140], [222, 214, 200])} /><stop offset="1" stopColor={c([230, 212, 186], [176, 118, 56], [170, 160, 148])} /></linearGradient>
      <mask id={id + "k"}><rect x="-20" y="-20" width="260" height="200" fill="#fff" />{Array.from({ length: bites }, (_, i) => <circle key={i} cx={186 - i * 4} cy={38 + i * 24} r={17} fill="#000" />)}</mask>
    </defs>
    <ellipse cx="100" cy={128 + th} rx="96" ry="18" fill="rgba(0,0,0,.45)" style={{ filter: "blur(6px)" }} />
    <g mask={`url(#${id}k)`}>
      <path d={P} transform={`translate(0 ${th})`} fill={c([150, 72, 64], [92, 40, 12], [110, 96, 86])} stroke={c([200, 176, 150], [150, 96, 40], [150, 140, 128])} strokeWidth={13} strokeLinejoin="round" />
      <path d={P} fill={`url(#${id}m)`} stroke={`url(#${id}f)`} strokeWidth={13} strokeLinejoin="round" />
      {[["M92,40 C110,52 128,50 150,44", 0.4], ["M84,78 C104,70 126,86 156,76", 0.32], ["M96,108 C118,100 140,108 160,98", 0.26]].map(([d, o], i) => <path key={i} d={d as string} fill="none" stroke="#fff3ea" strokeWidth={2.4} opacity={(o as number) * (1 - g * 0.7)} strokeLinecap="round" />)}
      <path d="M57,55 C63,78 66,100 73,121" fill="none" stroke="#e9dcc4" strokeWidth={12} strokeLinecap="round" />
      <path d="M57,55 C63,78 66,100 73,121" fill="none" stroke="#fffaf0" strokeWidth={4} strokeLinecap="round" opacity={0.85} />
      <path d="M61,86 C78,84 96,88 112,86" fill="none" stroke="#e2d4ba" strokeWidth={7} strokeLinecap="round" />
      <circle cx={55} cy={52} r={9} fill="#f4ecdc" stroke="#d2c0a0" strokeWidth={1.5} />
      {k > 0.4 && [0, 1, 2, 3].map((i) => <path key={i} d={`M${70 + i * 28},${30 + i * 4} l34,74`} stroke="#3e1c08" strokeWidth={7} opacity={cl((k - 0.4) * 2) * 0.6} strokeLinecap="round" />)}
      <ellipse cx={132} cy={40} rx={30} ry={9} fill="#fff" opacity={0.2 + 0.25 * k - 0.15 * g} transform="rotate(-12 132 40)" />
      {Array.from({ length: bites }, (_, i) => <circle key={i} cx={186 - i * 4} cy={38 + i * 24} r={19} fill="none" stroke="#8a7a6c" strokeWidth={3} strokeDasharray="3 4" opacity={0.7} />)}
    </g>
  </svg>;
};

// rodillos de un contador mecánico (cada dígito gira solo, como el cuentakilómetros)
const Rollers: React.FC<{ v: number; n?: number; size?: number; col?: string; bg?: string }> = ({ v, n = 3, size = 110, col = "#f6efe2", bg = "linear-gradient(180deg,#0e0a08,#2e221a 50%,#0e0a08)" }) => <div style={{ display: "flex", gap: 6, padding: 10, borderRadius: 16, background: "linear-gradient(180deg,#8a6a44,#4e3820)", boxShadow: "0 20px 40px rgba(0,0,0,.55), inset 0 2px 0 rgba(255,255,255,.3)" }}>
  {Array.from({ length: n }, (_, i) => {
    const p = Math.pow(10, n - 1 - i), d = (v / p) % 10;
    const f = i === n - 1 ? d : Math.floor(d) + cl((v % p - (p - 1)) / 1);
    return <div key={i} style={{ width: size * 0.68, height: size * 1.1, overflow: "hidden", position: "relative", background: bg, borderRadius: 8, boxShadow: "inset 0 14px 18px rgba(0,0,0,.8), inset 0 -14px 18px rgba(0,0,0,.8)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: -f * size * 1.1, fontFamily: SANS, fontWeight: 900, fontSize: size, color: col, textAlign: "center", lineHeight: `${size * 1.1}px` }}>
        {Array.from({ length: 11 }, (_, j) => <div key={j}>{j % 10}</div>)}
      </div>
    </div>;
  })}
</div>;

// ───────────────────────── P01-P30 ─────────────────────────

// P01 · seca como un banco de iglesia: una dentadura muerde la chuleta gris, cada mordisco la recorta y el contador de mordidas no para
export const P01Chew: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const ch = Math.max(0, tt - 0.9) * 2.2, open = Math.abs(Math.sin(ch * Math.PI)), bites = Math.min(4, Math.floor(ch));
  const jx = lerp(1500, 1180, eOut(tt, 0.3, 1.1));
  const gum = "linear-gradient(180deg,#e88c94,#b0505c)";
  const teeth = (up: boolean) => <div style={{ display: "flex", gap: 4, justifyContent: "center", flexDirection: up ? "row" : "row" }}>{Array.from({ length: 6 }, (_, i) => <div key={i} style={{ width: 44, height: 58 - Math.abs(i - 2.5) * 6, borderRadius: up ? "8px 8px 20px 20px" : "20px 20px 8px 8px", background: "linear-gradient(90deg,#d8d0bc,#fffdf4 40%,#e8e0cc)", boxShadow: "inset 0 -6px 8px rgba(0,0,0,.12)" }} />)}</div>;
  return <>
    <Plate x={720} y={640} w={860}><div style={{ position: "absolute", left: 70, top: -40 }}><Chop3 w={480} g={1} bites={bites} /></div></Plate>
    <div style={{ ...A, left: jx, top: 360, width: 340, transform: `rotate(-8deg)`, filter: "drop-shadow(0 30px 30px rgba(0,0,0,.5))" }}>
      <div style={{ transform: `translateY(${-open * 50}px)` }}><div style={{ height: 60, borderRadius: "60px 60px 20px 20px", background: gum }} />{teeth(true)}</div>
      <div style={{ transform: `translateY(${open * 40 + 6}px)` }}>{teeth(false)}<div style={{ height: 56, borderRadius: "20px 20px 60px 60px", background: gum }} /></div>
    </div>
    <div style={{ ...A, left: 1220, top: 760, transform: `scale(${phys(tt, 1.0, 7, 0.5)})`, transformOrigin: "0 0" }}>
      <Rollers v={Math.floor(ch * 7)} n={3} size={96} />
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 52, color: K.tx, letterSpacing: 6, marginTop: 10, textShadow: "0 6px 20px rgba(0,0,0,.6)" }}>CHEWS</div>
    </div>
  </>;
}}</Stage>;

// P02 · los tres sellos: un sello de goma con mango de madera golpea tres veces «160°F» en el recetario, la libreta de mamá y el folleto oficial
export const P02Stamp: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const docs = [{ x: 330, c: "#7e1f24", tt: "COOKBOOK", f: SERIF, ink: "#f3e3c4" }, { x: 820, c: "#f4ecd8", tt: "Mother's notes", f: HAND, ink: "#3a5a8a" }, { x: 1310, c: "#e6edf2", tt: "OFFICIAL GUIDE", f: SANS, ink: "#1c3c64" }];
  const hits = [1.1, 2.3, 3.5];
  const seg = hits.findIndex((a, i) => tt < a + 0.55 || i === 2);
  const a = hits[Math.max(0, seg)], x0 = docs[Math.max(0, seg)].x + 200;
  const d = tt - a, lift = d < -0.35 ? 1 : d < 0 ? eIn(tt, a - 0.35, a) : d < 0.12 ? 0 : eOut(tt, a + 0.12, a + 0.5);
  const yS = lerp(560, 200, d < 0 ? (d < -0.35 ? 1 : 1 - eIn(tt, a - 0.35, a)) : lift), squash = d >= 0 && d < 0.12 ? 0.9 : 1;
  return <>
    {docs.map((o, i) => <div key={i} style={{ ...A, left: o.x, top: 560, width: 400, height: 300, transform: `perspective(900px) rotateX(38deg) rotate(${(i - 1) * 4}deg) translateY(${(1 - phys(tt, 0.2 + i * 0.15, 7, 0.5)) * 300}px)`, borderRadius: 10, background: i === 1 ? "repeating-linear-gradient(180deg,#f4ecd8 0 30px,#b8c8dc 30px 32px)" : o.c, boxShadow: "0 40px 60px rgba(0,0,0,.6), inset 0 0 0 2px rgba(0,0,0,.1)" }}>
      <div style={{ position: "absolute", top: 24, width: "100%", textAlign: "center", fontFamily: o.f, fontWeight: 800, fontSize: 46, color: o.ink }}>{o.tt}</div>
      {tt > hits[i] && <div style={{ position: "absolute", left: 60, top: 110, width: 280, height: 130, border: "8px solid #c4202a", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, fontSize: 92, color: "#c4202a", opacity: 0.85 * eOut(tt, hits[i], hits[i] + 0.1), transform: `rotate(${-6 + i * 5}deg)`, maskImage: "radial-gradient(circle at 30% 40%, #000 55%, rgba(0,0,0,.55) 75%)" }}>160°F</div>}
    </div>)}
    <Shadow x={x0} y={700} w={lerp(320, 160, cl((560 - yS) / 360))} k={1} o={lerp(0.7, 0.25, cl((560 - yS) / 360))} />
    <div style={{ ...A, left: x0 - 120, top: yS - 330, width: 240, transform: `scaleY(${squash})`, transformOrigin: "50% 100%" }}>
      <div style={{ width: 120, height: 120, margin: "0 auto", borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#d8a46a,#8a5226 70%,#5a3416)" }} />
      <div style={{ width: 54, height: 110, margin: "-10px auto 0", background: "linear-gradient(90deg,#6a3e1c,#c48a52 45%,#6a3e1c)" }} />
      <div style={{ width: 240, height: 70, borderRadius: 10, background: "linear-gradient(90deg,#4a2c14,#a8723e 40%,#4a2c14)", boxShadow: "inset 0 -8px 0 rgba(0,0,0,.3)" }} />
      <div style={{ width: 224, height: 26, margin: "0 auto", borderRadius: "0 0 8px 8px", background: "linear-gradient(180deg,#8a1a20,#c4202a)" }} />
    </div>
  </>;
}}</Stage>;

// P03 · la salmuera: el frasco de mayonesa con agua se sacude con inercia, los cristales de sal giran y se achican y el agua turbia se aclara
export const P03Shake: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="rise">{(tt) => {
  const sh = tt > 0.9 && tt < 3.6 ? Math.sin((tt - 0.9) * 18) * 12 * (1 - eio(tt, 3.0, 3.6)) : 0, slosh = Math.sin((tt - 0.9) * 18 - 1.2) * 18 * cl((tt - 0.9) * 3) * (1 - eio(tt, 3.0, 4.0));
  const melt = eio(tt, 1.2, 4.4), cloud = Math.sin(cl((tt - 0.9) / 3.6) * Math.PI) * 0.7;
  return <>
    <Shadow x={960} y={950} w={520} k={1} o={0.7} />
    <div style={{ ...A, left: 960 - 230, top: 260, width: 460, height: 680, transform: `rotate(${sh}deg)`, transformOrigin: "50% 100%" }}>
      <div style={{ position: "absolute", left: 40, top: 0, width: 380, height: 90, borderRadius: 16, background: "repeating-linear-gradient(90deg,#c9ccd0 0 10px,#f4f6f8 10px 22px)", boxShadow: "0 8px 0 #8a8e94, inset 0 -10px 16px rgba(0,0,0,.25)" }} />
      <div style={{ position: "absolute", left: 0, top: 84, width: 460, height: 596, borderRadius: "70px 70px 50px 50px", background: "linear-gradient(90deg,rgba(220,235,245,.35),rgba(255,255,255,.12) 30%,rgba(200,220,235,.25) 80%,rgba(255,255,255,.5))", boxShadow: "inset 0 0 0 6px rgba(255,255,255,.35), inset 0 0 60px rgba(180,210,230,.3)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: -60, right: -60, top: 120, bottom: -20, background: `linear-gradient(180deg,rgba(170,205,225,${0.35 + cloud * 0.4}),rgba(120,165,195,${0.5 + cloud * 0.35}))`, transform: `rotate(${slosh}deg)`, transformOrigin: "50% 0", boxShadow: "inset 0 6px 0 rgba(255,255,255,.55)" }} />
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 70%,rgba(255,255,255,${cloud * 0.6}),transparent 70%)` }} />
        {Array.from({ length: 22 }, (_, i) => {
          const s = (16 + rnd(i) * 22) * (1 - melt), sw = Math.sin(tt * 4 + i) * 60 * cl((tt - 0.9) * 2) * (1 - melt);
          return s > 1 && <div key={i} style={{ position: "absolute", left: 50 + rnd(i + 3) * 340 + sw, top: 440 + rnd(i + 9) * 110 - Math.abs(Math.sin(tt * 5 + i)) * 160 * cl((tt - 0.9) * 2) * (1 - eio(tt, 3.0, 3.8)), width: s, height: s, transform: `rotate(${tt * 200 + i * 40}deg)`, background: "linear-gradient(135deg,#ffffff,#d8e4ec)", boxShadow: "0 0 6px rgba(255,255,255,.8)" }} />;
        })}
        <div style={{ position: "absolute", left: 40, top: 30, width: 34, height: 520, borderRadius: 20, background: "linear-gradient(90deg,rgba(255,255,255,.0),rgba(255,255,255,.55),rgba(255,255,255,0))" }} />
      </div>
      <div style={{ position: "absolute", left: 90, top: 300, width: 280, height: 120, background: "linear-gradient(180deg,#f2e2b8,#e0cc98)", transform: "rotate(-3deg)", boxShadow: "0 6px 12px rgba(0,0,0,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MARK, fontSize: 84, color: K.ink }}>BRINE</div>
    </div>
  </>;
}}</Stage>;

// P04 · adentro de la carne: macro de fibras con relieve que se abren como cuerdas, entran los granos de sal y las gotas de jugo quedan prendidas
export const P04Fibers: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const op = eio(tt, 0.6, 1.8), salt = eio(tt, 1.4, 3.2), juice = eio(tt, 2.8, 4.2);
  return <>
    <div style={{ ...A, left: 120, top: 220, width: 1680, height: 660, transform: "perspective(1400px) rotateX(24deg)", transformOrigin: "50% 100%" }}>
      {Array.from({ length: 9 }, (_, i) => {
        const y = i * 72 + (i - 4) * op * 10 + Math.sin(tt * 1.6 + i) * 3;
        return <div key={i} style={{ position: "absolute", left: 0, top: y, width: 1680, height: 62, borderRadius: 31, background: "linear-gradient(180deg,#f2a49a,#d0645e 35%,#a83c3c 70%,#6e2024)", boxShadow: "0 10px 14px rgba(40,0,0,.55), inset 0 6px 6px rgba(255,220,210,.5)" }}>
          {Array.from({ length: 6 }, (_, j) => <div key={j} style={{ position: "absolute", left: 120 + j * 260 + rnd(i * 9 + j) * 80, top: 14, width: 120, height: 4, borderRadius: 2, background: "rgba(255,230,220,.45)" }} />)}
        </div>;
      })}
      {Array.from({ length: 26 }, (_, i) => {
        const lane = Math.floor(rnd(i) * 8), px = lerp(-80, 120 + rnd(i + 4) * 1440, eOut(salt, 0, 1) * cl(salt * 1.6 - rnd(i + 7) * 0.5));
        return <div key={"s" + i} style={{ position: "absolute", left: px, top: lane * 72 + 58 + (lane - 4) * op * 10 + 2, width: 22, height: 22, transform: `rotate(${45 + i * 13}deg)`, background: "linear-gradient(135deg,#ffffff,#bcd6ea)", boxShadow: "0 0 10px rgba(200,230,255,.9)", opacity: cl(salt * 3) }} />;
      })}
      {Array.from({ length: 18 }, (_, i) => {
        const lane = Math.floor(rnd(i + 40) * 8), s = 30 * phys(juice * 4, rnd(i) * 2.4, 8, 0.5);
        return <Drop key={"j" + i} x={140 + rnd(i + 50) * 1400} y={lane * 72 + 66 + (lane - 4) * op * 10} s={s} col="#f4b46a" />;
      })}
    </div>
    <div style={{ ...A, left: 960, top: 940, transform: `translate(-50%,-50%) scale(${phys(tt, 3.2, 7, 0.5)})`, fontFamily: SERIF, fontWeight: 900, fontSize: 96, color: K.goldL, letterSpacing: 4, textShadow: "0 8px 30px rgba(0,0,0,.7)" }}>HOLDS THE JUICE</div>
  </>;
}}</Stage>;

// P05 · dura como un zapato: la chuleta se sigue cocinando en la sartén, se achica, se ennegrece, se arquea… y queda una suela de zapato con cordón
export const P05Shoe: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const cook = eio(tt, 0.5, 3.0), morph = eio(tt, 3.0, 3.9);
  return <>
    <Skillet x={900} y={640} w={1100} heat={0.9}>
      <div style={{ position: "absolute", left: 240, top: 30, transform: `scale(${1 - 0.25 * cook}) rotate(${-6 + 4 * cook}deg) perspective(600px) rotateX(${cook * 22}deg)`, opacity: 1 - morph }}>
        <Chop3 w={520} k={0.4 + 0.6 * cook} g={0} style={{ filter: `brightness(${1 - 0.55 * cook}) saturate(${1 - 0.5 * cook})` }} />
      </div>
      <svg width={560} height={300} viewBox="0 0 560 300" style={{ position: "absolute", left: 220, top: 50, opacity: morph, transform: `scale(${0.8 + 0.2 * morph})` }}>
        <defs><linearGradient id="sole5" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6a4428" /><stop offset="1" stopColor="#2c180c" /></linearGradient></defs>
        <path d="M40 170 C 30 90, 120 60, 230 70 C 330 78, 420 50, 500 90 C 548 116, 540 190, 480 214 C 400 246, 300 220, 220 236 C 120 256, 52 236, 40 170 Z" transform="translate(0 22)" fill="#1a0e06" />
        <path d="M40 170 C 30 90, 120 60, 230 70 C 330 78, 420 50, 500 90 C 548 116, 540 190, 480 214 C 400 246, 300 220, 220 236 C 120 256, 52 236, 40 170 Z" fill="url(#sole5)" stroke="#8a5a34" strokeWidth={6} />
        {Array.from({ length: 11 }, (_, i) => <path key={i} d={`M${80 + i * 38} 100 l -14 120`} stroke="#1c1006" strokeWidth={9} strokeLinecap="round" opacity={0.75} />)}
        <path d="M120 150 C 200 120, 300 140, 380 120" fill="none" stroke="#e8dcc4" strokeWidth={8} strokeLinecap="round" strokeDasharray="22 14" />
      </svg>
    </Skillet>
    {Array.from({ length: 5 }, (_, i) => { const p = ((tt * 0.35 + i / 5) % 1); return <div key={i} style={{ ...A, left: 780 + rnd(i) * 260 + Math.sin(tt * 1.2 + i) * 40, top: 520 - p * 420, width: 140, height: 200, borderRadius: "50%", background: "radial-gradient(circle,rgba(70,66,64,.55),transparent 70%)", filter: "blur(10px)", opacity: cook * Math.sin(p * Math.PI) }} />; })}
    <Tag tt={tt} at={3.6} x={1560} y={300} txt="HARD AS A SHOE" size={64} col={K.goldL} />
  </>;
}}</Stage>;

// P06 · cuando el aceite tiembla: el reflejo de la ventana en el aceite se ondula (distorsión real) y sube el primer hilo de humo
export const P06Shimmer: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const sh = eio(tt, 0.8, 2.6), smoke = eio(tt, 3.2, 4.6), id = "sh6";
  const fr = (0.004 + 0.012 * sh).toFixed(4);
  return <>
    <Shadow x={960} y={920} w={1500} k={1} o={0.7} />
    <div style={{ ...A, left: 960 - 760, top: 160, width: 1520, height: 780, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 45%,#2e2a28,#0e0c0b 70%)", boxShadow: "0 0 0 34px #262220, 0 0 0 40px #4a4440, inset 0 30px 80px rgba(0,0,0,.8)" }}>
      <svg width={1520} height={780} viewBox="0 0 1520 780" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id={id}><feTurbulence type="fractalNoise" baseFrequency={`${fr} ${(+fr * 2).toFixed(4)}`} numOctaves={2} seed={Math.floor(tt * 8)} result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale={10 + 70 * sh} /></filter>
          <radialGradient id={id + "o"} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#d8a43a" stopOpacity=".55" /><stop offset="1" stopColor="#8a5a14" stopOpacity=".15" /></radialGradient>
          <clipPath id={id + "c"}><ellipse cx="760" cy="390" rx="740" ry="370" /></clipPath>
        </defs>
        <g clipPath={`url(#${id}c)`}>
          <ellipse cx="760" cy="390" rx="720" ry="360" fill={`url(#${id}o)`} />
          <g filter={`url(#${id})`} opacity={0.85}>
            {[0, 1].map((cx) => [0, 1].map((cy) => <rect key={`${cx}${cy}`} x={560 + cx * 210} y={180 + cy * 190} width={196} height={176} rx={8} fill="#fff7e2" opacity={0.75} />))}
            <rect x={540} y={160} width={436} height={400} rx={10} fill="none" stroke="#3a3430" strokeWidth={16} />
          </g>
          {[0, 1, 2].map((i) => { const p = ((tt * 0.6 + i / 3) % 1) * sh; return <ellipse key={i} cx="760" cy="390" rx={80 + p * 600} ry={40 + p * 300} fill="none" stroke="#ffe6a8" strokeWidth={3} opacity={0.4 * (1 - p)} />; })}
        </g>
      </svg>
    </div>
    {[0, 1, 2].map((i) => <div key={i} style={{ ...A, left: 1000 + Math.sin(tt * 2 + i) * 30 + i * 30, top: 380 - smoke * (180 + i * 80), width: 60 + i * 30, height: 160, borderRadius: "50%", background: "radial-gradient(circle,rgba(230,230,230,.6),transparent 70%)", filter: "blur(8px)", opacity: smoke * (1 - i * 0.25) }} />)}
    <Tag tt={tt} at={1.4} x={960} y={1010} txt="SHIMMER" size={84} font={SERIF} col={K.goldL} />
  </>;
}}</Stage>;

// P07 · el semáforo de la salsa: semáforo de calle de metal con visera; cada luz se prende con su tiempo y la olla burbujea abajo
export const P07Light: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="rise">{(tt) => {
  const ph = tt < 1.4 ? -1 : tt < 2.8 ? 0 : tt < 4.2 ? 1 : 2;
  const lamps = [{ c: "#ff3a2a", txt: "STOP" }, { c: "#ffc22a", txt: "3 MIN" }, { c: "#3aff7a", txt: "5 MIN" }];
  const on = (i: number) => (i === 2 && ph === 0) || (i === 1 && ph === 1) || (i === 0 && ph === 2);
  return <>
    <div style={{ ...A, left: 1180, top: 120, width: 300, height: 820, transform: `translateY(${(1 - phys(tt, 0.2, 7, 0.5)) * -700}px)` }}>
      <div style={{ position: "absolute", left: 120, top: 760, width: 60, height: 300, background: "linear-gradient(90deg,#2a2c30,#6a6e74,#2a2c30)" }} />
      <div style={{ position: "absolute", inset: "0 0 60px 0", borderRadius: 30, background: "linear-gradient(90deg,#1c1e20,#3c4044 40%,#1a1c1e)", boxShadow: "0 40px 80px rgba(0,0,0,.7), inset 0 0 0 6px #4a4e52" }}>
        {lamps.map((l, i) => <div key={i} style={{ position: "absolute", left: 40, top: 30 + i * 240, width: 220, height: 220 }}>
          <div style={{ position: "absolute", left: -10, top: -14, width: 240, height: 70, borderRadius: "120px 120px 0 0", background: "linear-gradient(180deg,#2a2c2e,#121314)" }} />
          <div style={{ position: "absolute", inset: 10, borderRadius: "50%", background: on(i) ? `radial-gradient(circle at 40% 35%,#fff,${l.c} 45%,${l.c}88)` : "radial-gradient(circle at 40% 35%,#3a3a3a,#141414)", boxShadow: on(i) ? `0 0 90px 30px ${l.c}88` : "inset 0 6px 14px rgba(0,0,0,.8)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, fontSize: 52, color: on(i) ? "#1a0a00" : "transparent" }}>{l.txt}</div>
        </div>)}
      </div>
    </div>
    <div style={{ ...A, left: 300, top: 560, width: 720, height: 380 }}>
      <Shadow x={360} y={360} w={760} k={1} o={0.7} />
      <div style={{ position: "absolute", left: 0, top: 80, width: 720, height: 280, borderRadius: "0 0 120px 120px", background: "linear-gradient(90deg,#3a3c40,#9a9ea4 35%,#4a4c50)" }} />
      <div style={{ position: "absolute", left: 0, top: 30, width: 720, height: 110, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 50%,#8a5428,#5a3214 80%)", boxShadow: "inset 0 0 0 14px #b8bcc2" }} />
      {Array.from({ length: 9 }, (_, i) => { const p = ((tt * 1.3 + rnd(i)) % 1); return <div key={i} style={{ position: "absolute", left: 120 + rnd(i + 3) * 460, top: 60 + rnd(i + 5) * 40, width: 40 * p, height: 26 * p, borderRadius: "50%", border: "3px solid rgba(240,190,130,.7)", opacity: ph === 0 ? 1 - p : 0.2 * (1 - p) }} />; })}
    </div>
    <Steam x={660} y={590} tt={tt} n={5} w={400} k={ph === 0 ? 1 : 0.4} hgt={280} />
  </>;
}}</Stage>;

// P08 · marzo de 2023: bola de nieve grande con la cajita de stuffing adentro; se inclina y sacude, la nieve se arremolina y cae afuera
export const P08Globe: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const sk = tt > 0.8 && tt < 2.6 ? Math.sin((tt - 0.8) * 14) * 14 * (1 - eio(tt, 2.0, 2.6)) : 0, sw = cl((tt - 0.8) * 2) * (1 - eio(tt, 2.6, 5.4));
  return <>
    <Shadow x={960} y={1000} w={760} k={1} o={0.8} />
    <div style={{ ...A, left: 960 - 330, top: 160, width: 660, height: 860, transform: `rotate(${sk}deg)`, transformOrigin: "50% 90%" }}>
      <div style={{ position: "absolute", left: 30, top: 0, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle at 50% 70%,rgba(190,215,240,.5),rgba(120,160,200,.25) 70%)", boxShadow: "inset 0 0 0 6px rgba(255,255,255,.4), inset -40px -40px 80px rgba(255,255,255,.18)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 120, background: "radial-gradient(ellipse at 50% 0%,#ffffff,#d8e4ee 70%)" }} />
        <div style={{ position: "absolute", left: 210, top: 300, width: 180, height: 200, transform: "perspective(500px) rotateY(-22deg)", background: "linear-gradient(180deg,#e8762a,#b0461a)", borderRadius: 8, boxShadow: "18px 0 0 #8a3414, 0 20px 30px rgba(0,0,0,.4)", fontFamily: SANS, fontWeight: 900, color: "#fff6e0", textAlign: "center", paddingTop: 30, fontSize: 36, lineHeight: 1.1 }}>STUFF<br />ING<div style={{ margin: "14px auto 0", width: 120, height: 60, borderRadius: 10, background: "radial-gradient(circle,#d8a050,#8a5420)" }} /></div>
        {Array.from({ length: 70 }, (_, i) => {
          const ang = tt * (1.4 + rnd(i) * 1.8) + i, rad = 60 + rnd(i + 5) * 230;
          const restY = 470 + rnd(i + 2) * 50, x = 300 + Math.cos(ang) * rad * sw + (rnd(i + 9) - 0.5) * 500 * (1 - sw), y = lerp(restY, 300 + Math.sin(ang) * rad * 0.8, sw) + (1 - sw) * 0;
          return <div key={i} style={{ position: "absolute", left: x, top: y, width: 10 + rnd(i) * 8, height: 10 + rnd(i) * 8, borderRadius: "50%", background: "#fff", boxShadow: "0 0 6px rgba(255,255,255,.9)" }} />;
        })}
        <div style={{ position: "absolute", left: 90, top: 60, width: 160, height: 260, borderRadius: "50%", background: "linear-gradient(135deg,rgba(255,255,255,.55),transparent 60%)", transform: "rotate(-24deg)" }} />
      </div>
      <div style={{ position: "absolute", left: 60, top: 560, width: 540, height: 230, borderRadius: "40px 40px 30px 30px", background: "linear-gradient(90deg,#3a2210,#8a5a30 40%,#3a2210)", boxShadow: "0 30px 50px rgba(0,0,0,.6), inset 0 10px 0 rgba(255,255,255,.12)" }}>
        <div style={{ margin: "70px auto 0", width: 400, height: 96, borderRadius: 10, background: "linear-gradient(135deg,#f6dc96,#b8862e 50%,#f0d088)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 54, color: "#3a2208" }}>MARCH 2023</div>
      </div>
    </div>
    {Array.from({ length: 24 }, (_, i) => { const a = 2.8 + rnd(i) * 1.8, p = cl((tt - a) / 1.4); return p > 0 && <div key={"o" + i} style={{ ...A, left: 400 + rnd(i + 30) * 1120 + Math.sin(tt * 2 + i) * 20, top: lerp(-30, 960 + rnd(i) * 40, p), width: 12, height: 12, borderRadius: "50%", background: "#fff", opacity: 0.9 }} />; })}
  </>;
}}</Stage>;

// P09 · Thanksgiving en un bol: la caja de cereal se inclina y caen chuleta, bolitas de stuffing y compota de manzana que se apilan en el bol
export const P09Cereal: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const tilt = eio(tt, 0.5, 1.3), pour = (i: number) => 1.2 + i * 0.16;
  const kinds = ["chop", "ball", "sauce", "ball", "chop", "sauce", "ball", "chop", "ball", "sauce", "ball", "ball", "chop", "sauce"];
  return <>
    <div style={{ ...A, left: 1100, top: 120, width: 340, height: 480, transform: `rotate(${-tilt * 112}deg)`, transformOrigin: "10% 20%", borderRadius: 10, background: "linear-gradient(160deg,#f4b43a,#d0641a 70%)", boxShadow: "26px 0 0 #9a4410, 0 30px 50px rgba(0,0,0,.5)" }}>
      <div style={{ padding: "30px 20px", fontFamily: SERIF, fontWeight: 900, fontSize: 60, color: "#5a1a08", lineHeight: 1, textAlign: "center" }}>THANKS<br />GIVING<div style={{ fontFamily: MARK, fontSize: 96, color: "#fff7e2" }}>O's</div></div>
      <div style={{ margin: "0 auto", width: 200, height: 120, borderRadius: "50%", background: "radial-gradient(circle,#e8a858,#8a4a18)" }} />
    </div>
    {kinds.map((k, i) => {
      const a = pour(i), d = tt - a; if (d < 0) return null;
      const T = 0.55, p = cl(d / T), x = lerp(1020, 660 + (i % 5) * 70 - 140, p), y = lerp(320, 700 - Math.floor(i / 5) * 46 - rnd(i) * 20, p * p) + (p >= 1 ? -Math.abs(Math.sin((d - T) * 10)) * 14 * Math.exp(-(d - T) * 6) : 0);
      return <div key={i} style={{ ...A, left: x - 50, top: y - 40, transform: `rotate(${p * 200 + i * 30}deg)`, zIndex: 3 }}>
        {k === "chop" ? <Chop3 w={130} k={0.9} th={6} /> : k === "ball" ? <div style={{ width: 70, height: 64, borderRadius: "46% 54% 50% 50%", background: "radial-gradient(circle at 35% 30%,#e0b070,#8a5222 75%)", boxShadow: "inset -6px -8px 12px rgba(60,20,0,.4)" }} /> : <div style={{ width: 96, height: 60, borderRadius: "50% 50% 40% 40%", background: "radial-gradient(circle at 40% 30%,#fff2c8,#e0bc6a 80%)" }} />}
      </div>;
    })}
    <div style={{ ...A, left: 400, top: 640, width: 720, height: 320, zIndex: 4 }}>
      <Shadow x={360} y={300} w={760} k={1} o={0.7} />
      <div style={{ position: "absolute", left: 0, top: 30, width: 720, height: 270, borderRadius: "0 0 360px 360px", background: "linear-gradient(90deg,#1e4e7e,#4a8ac0 40%,#1a3e66)", boxShadow: "inset 0 -20px 40px rgba(0,0,0,.35)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 720, height: 70, borderRadius: "50%", border: "10px solid #5a9ad0", boxSizing: "border-box", borderBottomColor: "transparent" }} />
      <div style={{ position: "absolute", left: 160, top: 130, fontFamily: HAND, fontSize: 64, color: "#fff7e2" }}>Thanksgiving</div>
    </div>
  </>;
}}</Stage>;

// P10 · Walter Bremer: del rollo se despega la etiqueta «HELLO my name is», un dedo la pega en la solapa y el marcador escribe WALTER
export const P10Name: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const peel = eio(tt, 0.4, 1.2), fly = eio(tt, 1.2, 2.0), press = eio(tt, 2.0, 2.4) * (1 - eio(tt, 2.6, 3.0)), wr = eio(tt, 2.8, 4.4);
  const lx = lerp(560, 1160, fly), ly = lerp(820, 470, fly) - Math.sin(fly * Math.PI) * 120, curl = (1 - peel) * 0 + Math.sin(fly * Math.PI) * 26 + (1 - peel) * 34;
  return <>
    <div style={{ ...A, left: 900, top: 120, width: 820, height: 960, background: "linear-gradient(100deg,#2a3038,#4a525e 50%,#2a3038)", clipPath: "polygon(30% 0,70% 0,100% 100%,0 100%)", boxShadow: "inset 0 0 120px rgba(0,0,0,.6)" }} />
    <div style={{ ...A, left: 1180, top: 120, width: 260, height: 960, background: "linear-gradient(180deg,#f4f4f2,#d4d6d8)", clipPath: "polygon(20% 0,80% 0,62% 100%,38% 100%)" }} />
    <div style={{ ...A, left: 1270, top: 180, width: 80, height: 700, background: "linear-gradient(90deg,#5a1218,#a42838 50%,#5a1218)", clipPath: "polygon(30% 0,70% 0,100% 90%,50% 100%,0 90%)" }} />
    <div style={{ ...A, left: 980, top: 200, width: 300, height: 900, background: "linear-gradient(120deg,#3a424c,#58626e)", clipPath: "polygon(0 0,100% 0,60% 50%,100% 100%,0 100%)", boxShadow: "inset 0 0 40px rgba(0,0,0,.5)" }} />
    <div style={{ ...A, left: 340, top: 760, width: 320, height: 200 }}>
      <Shadow x={160} y={190} w={340} k={1} o={0.7} />
      <div style={{ position: "absolute", left: 40, top: 20, width: 240, height: 170, borderRadius: "50%", background: "radial-gradient(circle,#f6f2ea 30%,#d8d2c4 31%,#efe9dc 60%,#c8c0b0)", boxShadow: "0 10px 0 #a8a090" }} />
    </div>
    <div style={{ ...A, left: lx - 210, top: ly - 140, width: 420, height: 280, transform: `perspective(900px) rotateX(${curl}deg) rotate(${lerp(-10, -4, fly)}deg) scale(${1 - press * 0.03})`, transformOrigin: "50% 100%", borderRadius: 18, background: "#fff", boxShadow: `0 ${30 - press * 24}px ${50 - press * 40}px rgba(0,0,0,.5)`, overflow: "hidden", opacity: cl(peel * 4) }}>
      <div style={{ height: 96, background: "#d8242e", color: "#fff", fontFamily: SANS, fontWeight: 900, fontSize: 56, textAlign: "center", lineHeight: "70px" }}>HELLO<div style={{ fontSize: 24, lineHeight: "18px" }}>my name is</div></div>
      <div style={{ fontFamily: MARK, fontSize: 108, color: "#14141a", textAlign: "center", lineHeight: "170px", clipPath: `inset(0 ${100 - wr * 100}% 0 0)` }}>WALTER</div>
    </div>
    <div style={{ opacity: cl((tt - 1.7) * 4) * (1 - cl((tt - 3.0) * 3)) }}><Hand x={lx + 60} y={ly - 120 - press * 0} s={0.9} rot={-18} press={press} /></div>
    {wr > 0 && wr < 1 && <div style={{ ...A, left: lx - 190 + wr * 360, top: ly - 30, width: 40, height: 260, borderRadius: 12, background: "linear-gradient(90deg,#1a1a1e,#4a4a52,#1a1a1e)", transform: "rotate(28deg)", transformOrigin: "50% 100%", boxShadow: "0 20px 30px rgba(0,0,0,.5)" }} />}
  </>;
}}</Stage>;

// P11 · la prueba de la cuchara: cuchara de madera de perfil cubierta de salsa espesa; un dedo traza un surco que queda abierto
export const P11Nappe: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const coat = eio(tt, 0.4, 1.6), line = eio(tt, 2.0, 3.0), fx = lerp(760, 1200, line);
  return <>
    <Shadow x={960} y={860} w={1300} k={1} o={0.55} />
    <svg width={1700} height={560} viewBox="0 0 1700 560" style={{ ...A, left: 110, top: 300, overflow: "visible", transform: `rotate(-6deg) translateY(${(1 - phys(tt, 0.1, 7, 0.5)) * 300}px)` }}>
      <defs>
        <linearGradient id="wd11" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e8c08a" /><stop offset="0.5" stopColor="#c48a50" /><stop offset="1" stopColor="#7a4a22" /></linearGradient>
        <linearGradient id="sc11" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c4884a" /><stop offset="0.5" stopColor="#8a5022" /><stop offset="1" stopColor="#5a2e10" /></linearGradient>
        <clipPath id="cl11"><path d="M520 200 C 600 60, 1300 60, 1420 210 C 1500 320, 1300 420, 980 420 C 680 420, 470 320, 520 200 Z" /></clipPath>
      </defs>
      <rect x={-200} y={230} width={760} height={70} rx={34} fill="url(#wd11)" />
      {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${-180 + i * 140} 250 q 60 10 120 0`} stroke="#8a5a2e" strokeWidth={3} fill="none" opacity={0.5} />)}
      <path d="M520 200 C 600 60, 1300 60, 1420 210 C 1500 320, 1300 420, 980 420 C 680 420, 470 320, 520 200 Z" transform="translate(0 18)" fill="#5a3416" />
      <path d="M520 200 C 600 60, 1300 60, 1420 210 C 1500 320, 1300 420, 980 420 C 680 420, 470 320, 520 200 Z" fill="url(#wd11)" />
      <g clipPath="url(#cl11)">
        <rect x={400} y={lerp(-400, 40, coat)} width={1200} height={500} fill="url(#sc11)" />
        {Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx={620 + i * 110} cy={lerp(-200, 420, coat) + rnd(i) * 30} rx={22} ry={34 * coat} fill="#7a4418" />)}
        <ellipse cx={900} cy={140} rx={260} ry={34} fill="#fff" opacity={0.25 * coat} />
        <rect x={760} y={60} width={Math.max(0, fx - 760)} height={34} rx={17} fill="url(#wd11)" transform="rotate(10 760 60)" />
        <rect x={760} y={60} width={Math.max(0, fx - 760)} height={34} rx={17} fill="none" stroke="#5a2e10" strokeWidth={6} transform="rotate(10 760 60)" />
      </g>
    </svg>
    <div style={{ opacity: cl((tt - 1.7) * 4) * (1 - cl((tt - 3.4) * 3)) }}><Hand x={fx + 140} y={200 + (fx - 760) * 0.17} s={0.8} rot={20} press={0.8} /></div>
    <Tag tt={tt} at={3.2} x={960} y={960} txt="THE LINE STAYS" size={80} font={SERIF} col={K.goldL} />
  </>;
}}</Stage>;

// P12 · la regla nueva: la máquina de escribir con teclas redondas tipea: «160» se tacha con X roja y sale «145°F»
export const P12Type: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="rise">{(tt) => {
  const s1 = "160", s2 = "145°F", t1 = 0.6, t2 = 2.4, cps = 6;
  const n1 = Math.min(s1.length, Math.floor(Math.max(0, tt - t1) * cps)), n2 = Math.min(s2.length, Math.floor(Math.max(0, tt - t2) * cps)), x = eOut(tt, 1.4, 2.0);
  const hit = (tt - t1) * cps % 1 < 0.35 && tt > t1 && tt < t1 + s1.length / cps || (tt - t2) * cps % 1 < 0.35 && tt > t2 && tt < t2 + s2.length / cps;
  const carriage = tt < t2 ? n1 * 60 : n2 * 60;
  return <>
    <div style={{ ...A, left: 520 - carriage + 120, top: 120, width: 880, height: 520, background: "linear-gradient(180deg,#fffdf6,#efe8d6)", boxShadow: "0 20px 40px rgba(0,0,0,.4)", transform: `translateY(${tt < t2 ? 0 : -eOut(tt, t2 - 0.4, t2) * 150}px)` }}>
      <div style={{ position: "absolute", left: 120, top: 200, fontFamily: "Courier New, monospace", fontWeight: 900, fontSize: 150, color: "#1a1a22", letterSpacing: 8 }}>{s1.slice(0, n1)}</div>
      <svg width={500} height={240} style={{ position: "absolute", left: 110, top: 170 }}><path d={`M10 20 L ${10 + 300 * x} ${20 + 200 * x}`} stroke="#d0202a" strokeWidth={22} strokeLinecap="round" /><path d={`M310 20 L ${310 - 300 * cl(x * 2 - 1)} ${20 + 200 * cl(x * 2 - 1)}`} stroke="#d0202a" strokeWidth={22} strokeLinecap="round" opacity={x > 0.5 ? 1 : 0} /></svg>
      <div style={{ position: "absolute", left: 120, top: 380, fontFamily: "Courier New, monospace", fontWeight: 900, fontSize: 150, color: "#1a1a22", letterSpacing: 8 }}>{s2.slice(0, n2)}</div>
    </div>
    <div style={{ ...A, left: 360, top: 600, width: 1200, height: 420 }}>
      <Shadow x={600} y={410} w={1260} k={1} o={0.8} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1200, height: 80, borderRadius: 40, background: "linear-gradient(180deg,#2a2c2e,#0e0f10)", boxShadow: "inset 0 6px 0 rgba(255,255,255,.12)" }} />
      <div style={{ position: "absolute", left: 60, top: 70, width: 1080, height: 340, borderRadius: "30px 30px 60px 60px", background: "linear-gradient(180deg,#2e5a46,#1a3428)", boxShadow: "inset 0 10px 0 rgba(255,255,255,.12), 0 30px 50px rgba(0,0,0,.5)" }}>
        {[0, 1, 2].map((row) => Array.from({ length: 10 - row }, (_, i) => {
          const dn = hit && (i + row * 3) % 7 === Math.floor(tt * cps) % 7;
          return <div key={`${row}-${i}`} style={{ position: "absolute", left: 90 + row * 40 + i * 92, top: 120 + row * 70 + (dn ? 8 : 0), width: 68, height: 68, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#f4efe2,#c8c0ac 70%)", boxShadow: dn ? "0 2px 0 #6a6658" : "0 10px 0 #4a473e, 0 12px 10px rgba(0,0,0,.4)", border: "4px solid #8a8678", boxSizing: "border-box" }} />;
        }))}
      </div>
      <svg width={300} height={260} style={{ position: "absolute", left: 450, top: -200, overflow: "visible" }}><path d={`M150 260 L ${150 + (hit ? 0 : 60)} ${hit ? 30 : 140}`} stroke="#9a9ea4" strokeWidth={12} strokeLinecap="round" /></svg>
    </div>
  </>;
}}</Stage>;

// P13 · rayos X: la chuleta con hueso en T sobre la caja de luz; el hueso brilla y la sonda entra a lo más grueso, a un dedo del hueso
export const P13Xray: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="cold">{(tt) => {
  const lit = eio(tt, 0.5, 1.2), probe = eio(tt, 1.6, 3.0), gap = eio(tt, 3.0, 3.6);
  return <>
    <div style={{ ...A, left: 300, top: 150, width: 1320, height: 780, borderRadius: 24, background: "linear-gradient(180deg,#2e3438,#15191c)", boxShadow: "0 50px 90px rgba(0,0,0,.7)" }}>
      <div style={{ position: "absolute", inset: 40, borderRadius: 10, background: `radial-gradient(ellipse at 50% 50%,rgba(230,245,255,${0.2 + 0.75 * lit}),rgba(150,190,220,${0.1 + 0.5 * lit}))`, boxShadow: `0 0 ${80 * lit}px rgba(200,230,255,.5)` }} />
      <svg width={1240} height={700} viewBox="0 0 200 140" style={{ position: "absolute", left: 40, top: 40, opacity: 0.4 + 0.6 * lit }}>
        <path d="M14,92 C8,70 30,56 52,50 C66,24 118,10 158,22 C190,34 194,78 176,102 C156,126 108,132 72,122 C50,116 34,108 14,92 Z" fill="rgba(40,60,80,.55)" stroke="rgba(20,40,60,.7)" strokeWidth={4} />
        <path d="M60,46 C66,72 70,96 76,120 M64,82 C82,80 100,84 118,82" fill="none" stroke="#ffffff" strokeWidth={9} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 ${4 * lit}px #fff)` }} />
        <circle cx="140" cy="68" r={10 + 2 * Math.sin(tt * 6) * gap} fill="none" stroke="#3aff8a" strokeWidth={1.6} opacity={gap} />
      </svg>
      <div style={{ position: "absolute", left: lerp(1400, 960, probe), top: 345, width: 520, height: 18, borderRadius: 9, background: "linear-gradient(180deg,#f4f6f8,#8a9098 60%,#c8ccd2)", boxShadow: "0 8px 14px rgba(0,0,0,.5)" }} />
      <div style={{ position: "absolute", left: lerp(1400, 960, probe) + 500, top: 300, width: 200, height: 110, borderRadius: 20, background: "linear-gradient(180deg,#e8402a,#a01e12)", boxShadow: "0 10px 20px rgba(0,0,0,.5)", fontFamily: SANS, fontWeight: 900, fontSize: 52, color: "#fff", textAlign: "center", lineHeight: "110px" }}>{Math.round(lerp(40, 145, eOut(tt, 2.8, 4.6)))}°</div>
    </div>
    <Tag tt={tt} at={3.4} x={960} y={1000} txt="NOT THE BONE" size={78} col="#c8ecff" />
  </>;
}}</Stage>;

// P14 · las ollas de 2020: en la pileta se apilan ollas, sartenes y tapas con peso; la torre se tambalea, se derrumba y queda UNA asadera con aluminio
export const P14Pots: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const items = [{ w: 560, h: 150, c: "#8a8e94" }, { w: 480, h: 130, c: "#2a2624" }, { w: 420, h: 140, c: "#a04a2a" }, { w: 380, h: 60, c: "#c8ccd2" }, { w: 340, h: 120, c: "#3a3c40" }, { w: 300, h: 50, c: "#9a9ea4" }, { w: 260, h: 110, c: "#6a2a1a" }];
  const wob = Math.sin(tt * 7) * 4 * eio(tt, 2.0, 2.6), crash = eIn(tt, 2.8, 3.4), pan = eio(tt, 3.6, 4.4);
  let y = 820;
  return <>
    <div style={{ ...A, left: 360, top: 700, width: 1200, height: 330, borderRadius: "20px 20px 60px 60px", background: "linear-gradient(180deg,#c8ccd0,#8a8e94)", boxShadow: "inset 0 30px 60px rgba(0,0,0,.45), 0 30px 50px rgba(0,0,0,.5)" }} />
    {items.map((o, i) => {
      y -= o.h; const a = 0.3 + i * 0.24, yy = y + bounce(tt, a, 500) * (1 - crash);
      const dx = crash * (i - 3) * 220 * (1 + rnd(i)), dy = crash * (500 - i * 30), rot = wob * (i + 1) * 0.6 + crash * (i % 2 ? 1 : -1) * (40 + i * 20);
      return tt > a && <div key={i} style={{ ...A, left: 960 - o.w / 2 + dx, top: yy + dy, width: o.w, height: o.h, transform: `rotate(${rot}deg)`, transformOrigin: "50% 100%", opacity: 1 - pan, borderRadius: o.h < 70 ? "50%" : "10px 10px 40px 40px", background: `linear-gradient(90deg,${o.c},#ffffff55 30%,${o.c} 60%,#00000055)`, boxShadow: "0 14px 20px rgba(0,0,0,.45), inset 0 8px 0 rgba(255,255,255,.2)" }}>{o.h >= 70 && <div style={{ position: "absolute", left: -36, top: 24, width: 50, height: 22, borderRadius: 11, background: "#1a1a1a" }} />}</div>;
    })}
    <div style={{ ...A, left: 960 - 420, top: 560, width: 840, height: 260, opacity: pan, transform: `perspective(1000px) rotateX(40deg) scale(${0.8 + 0.2 * phys(tt, 3.6, 7, 0.5)})` }}>
      <Shadow x={420} y={250} w={880} k={1} o={0.8} />
      <div style={{ position: "absolute", inset: 0, borderRadius: 24, background: "linear-gradient(180deg,#5a5c60,#2a2c30)", boxShadow: "inset 0 0 0 18px #7a7e84" }} />
      <div style={{ position: "absolute", inset: 22, borderRadius: 10, background: "linear-gradient(120deg,#c8ccd2,#f6f8fa 30%,#a8acb2 50%,#eef0f2 70%,#b8bcc2)", backgroundSize: "200% 100%", backgroundPosition: `${tt * 30}% 0` }} />
    </div>
    <Tag tt={tt} at={4.0} x={960} y={420} txt="ONE PAN" size={110} font={SERIF} col={K.goldL} />
  </>;
}}</Stage>;

// P15 · la carrera: dos carriles en perspectiva; la papa larga 15 minutos antes, la chuleta sale después y cortan la cinta juntas
export const P15Race: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const pot = eio(tt, 0.4, 4.2), pork = eio(tt, 1.9, 4.2), tape = cl((tt - 4.2) * 3);
  const run = (p: number, lane: number) => ({ x: lerp(200, 1520, p), y: 760 - lane * 220 - p * 120, s: 1 - p * 0.35 });
  const P = run(pot, 0), C = run(pork, 1);
  return <>
    <div style={{ ...A, left: 0, top: 380, width: 1920, height: 700, transform: "perspective(1000px) rotateX(55deg)", transformOrigin: "50% 100%", background: "repeating-linear-gradient(180deg,#b8482a 0 200px,#f4ece0 200px 212px)", boxShadow: "inset 0 80px 120px rgba(0,0,0,.5)" }} />
    <div style={{ ...A, left: 1560, top: 300, width: 14, height: 540, background: "#eee", transform: "rotate(-8deg)" }} />
    <div style={{ ...A, left: 1600 - tape * 60, top: 560, width: 380, height: 20, background: "repeating-linear-gradient(90deg,#fff 0 30px,#d0202a 30px 60px)", transform: `rotate(${-14 - tape * 40}deg)`, transformOrigin: "0 50%" }} />
    <div style={{ ...A, left: P.x - 110, top: P.y - 150 - Math.abs(Math.sin(tt * 9)) * 24 * (pot > 0 && pot < 1 ? 1 : 0), transform: `scale(${P.s})` }}>
      <div style={{ width: 220, height: 160, borderRadius: "48% 52% 46% 54%", background: "radial-gradient(circle at 35% 30%,#e8c088,#a8743a 70%,#6a4218)", boxShadow: "inset -14px -14px 24px rgba(60,30,0,.4), 0 30px 30px rgba(0,0,0,.35)" }} />
    </div>
    <div style={{ ...A, left: C.x - 130, top: C.y - 170 - Math.abs(Math.sin(tt * 9 + 1)) * 24 * (pork > 0 && pork < 1 ? 1 : 0), transform: `scale(${C.s})` }}><Chop3 w={260} k={0.7} /></div>
    <div style={{ ...A, left: 220, top: 160, transform: `scale(${phys(tt, 0.4, 7, 0.5)})`, transformOrigin: "0 0", fontFamily: SANS, fontWeight: 900, fontSize: 76, color: K.tx, textShadow: "0 6px 20px rgba(0,0,0,.6)" }}>
      <span style={{ color: "#f4c27a" }}>+15</span> MIN HEAD START
    </div>
  </>;
}}</Stage>;

// P16 · nueve por trece: fuente de vidrio grande con la cinta métrica que la recorre; después se encoge al moldecito de budín
export const P16Plan: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const tape = eio(tt, 0.6, 2.0), shr = eio(tt, 2.8, 3.8);
  const W = lerp(1120, 520, shr), Hh = lerp(560, 320, shr);
  return <>
    <div style={{ ...A, left: 960 - W / 2, top: 560 - Hh / 2, width: W, height: Hh, transform: "perspective(1200px) rotateX(42deg)" }}>
      <Shadow x={W / 2} y={Hh} w={W * 1.05} k={1} o={0.7} />
      <div style={{ position: "absolute", inset: 0, borderRadius: 30, background: "linear-gradient(180deg,rgba(220,240,250,.5),rgba(170,200,220,.35))", boxShadow: "inset 0 0 0 16px rgba(255,255,255,.45), 0 20px 0 rgba(150,180,200,.5)" }} />
      <div style={{ position: "absolute", inset: 22, borderRadius: 14, overflow: "hidden" }}><Img src={img(h.bg ?? "f10")} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }} /></div>
      <div style={{ position: "absolute", left: 0, top: -50, width: W * tape, height: 40, background: "repeating-linear-gradient(90deg,#f4d43a 0 18px,#1a1a1a 18px 20px,#f4d43a 20px 38px)", boxShadow: "0 8px 12px rgba(0,0,0,.4)" }} />
      <div style={{ position: "absolute", left: W + 10, top: 0, width: 40, height: Hh * tape, background: "repeating-linear-gradient(180deg,#f4d43a 0 18px,#1a1a1a 18px 20px,#f4d43a 20px 38px)" }} />
    </div>
    <div style={{ ...A, left: 960 - W / 2 + W * tape - 60, top: 560 - Hh / 2 - 130, width: 120, height: 100, borderRadius: 18, background: "linear-gradient(180deg,#d02a2a,#801010)", boxShadow: "0 10px 20px rgba(0,0,0,.5)", opacity: 1 - shr }} />
    <div style={{ ...A, left: 960, top: 940, transform: "translate(-50%,-50%)", fontFamily: SERIF, fontWeight: 900, fontSize: 104, color: K.goldL, textShadow: "0 8px 30px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>{shr < 0.5 ? "9 × 13" : "LOAF PAN"}</div>
  </>;
}}</Stage>;

// P17 · el repulgue: el molde de aluminio con la hoja encima; los dedos pellizcan el borde vuelta a vuelta y el vapor choca adentro y no sale
export const P17Crimp: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const cr = eio(tt, 0.6, 3.0), steam = eio(tt, 3.0, 4.0);
  const per = 2 * (900 + 460), pos = cr * per;
  const at = (d: number) => d < 900 ? [510 + d, 330] : d < 1360 ? [1410, 330 + d - 900] : d < 2260 ? [1410 - (d - 1360), 790] : [510, 790 - (d - 2260)];
  const [hx, hy] = at(pos % per);
  return <>
    <div style={{ ...A, left: 480, top: 300, width: 960, height: 520, transform: "perspective(1400px) rotateX(30deg)" }}>
      <Shadow x={480} y={520} w={1000} k={1} o={0.7} />
      <div style={{ position: "absolute", inset: 0, borderRadius: 20, background: "linear-gradient(120deg,#b8bcc2,#f4f6f8 25%,#9a9ea4 50%,#e8eaec 75%,#a8acb2)", boxShadow: "inset 0 0 40px rgba(0,0,0,.25)", transform: `translateY(${-steam * 16}px) scaleY(${1 + steam * 0.03})` }}>
        {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: 40 + rnd(i) * 860, top: 30 + rnd(i + 5) * 440, width: 200, height: 6, background: "rgba(255,255,255,.6)", transform: `rotate(${rnd(i + 2) * 40 - 20}deg)` }} />)}
      </div>
      <svg width={960} height={520} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <path d={Array.from({ length: Math.floor(pos / 30) }, (_, i) => { const [x, y] = at(i * 30); return `${i ? "L" : "M"}${x - 480 + (i % 2 ? 10 : -10) * (x === 510 || x === 1410 ? 1 : 0)} ${y - 300 + (i % 2 ? 10 : -10) * (y === 330 || y === 790 ? 1 : 0)}`; }).join(" ")} fill="none" stroke="#6a6e74" strokeWidth={14} strokeLinejoin="round" />
      </svg>
      {steam > 0 && Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: 120 + i * 130 + Math.sin(tt * 3 + i) * 20, top: 300 - steam * 120, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,255,255,.3),transparent 70%)", filter: "blur(6px)", opacity: steam }} />)}
    </div>
    {cr < 1 && <Hand x={hx + 20} y={hy - 150} s={0.7} rot={-30} press={0.5 + 0.5 * Math.abs(Math.sin(tt * 10))} />}
    <Tag tt={tt} at={3.2} x={960} y={190} txt="SEALED TIGHT" size={88} font={SERIF} col={K.goldL} />
  </>;
}}</Stage>;

// P18 · no la tires: la lata de sopa se vuelca en el frasquito con un hilo de crema y el nivel sube; la tapa se enrosca y se pega el post-it
export const P18Note: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="rise">{(tt) => {
  const tilt = eio(tt, 0.4, 1.0), flow = cl((tt - 1.0) / 1.8) * (1 - cl((tt - 2.8) * 4)), lvl = eio(tt, 1.1, 2.9), lid = eio(tt, 3.0, 3.6), note = phys(tt, 3.8, 7, 0.5);
  return <>
    <div style={{ ...A, left: 760, top: 160, width: 260, height: 340, transform: `rotate(${-tilt * 118}deg)`, transformOrigin: "100% 0", borderRadius: 18, background: "linear-gradient(90deg,#8a1a1a,#d83a3a 40%,#8a1a1a)", boxShadow: "inset 0 18px 0 #c8ccd2, inset 0 -18px 0 #c8ccd2, 0 20px 30px rgba(0,0,0,.5)" }}>
      <div style={{ marginTop: 120, background: "#f4ecd8", height: 90, fontFamily: SERIF, fontWeight: 900, fontSize: 44, color: "#8a1a1a", textAlign: "center", lineHeight: "90px" }}>CREAM OF</div>
    </div>
    {flow > 0 && <div style={{ ...A, left: 950 + Math.sin(tt * 9) * 3, top: 210, width: 26 * flow + 4, height: 440, borderRadius: 14, background: "linear-gradient(90deg,#e8dcc4,#fff8ea,#d8c8a8)" }} />}
    <div style={{ ...A, left: 800, top: 520, width: 340, height: 420 }}>
      <Shadow x={170} y={420} w={380} k={1} o={0.7} />
      <div style={{ position: "absolute", left: 30, top: 40 - lid * 0, width: 280, height: 380, borderRadius: "40px 40px 30px 30px", background: "linear-gradient(90deg,rgba(220,235,245,.35),rgba(255,255,255,.12) 30%,rgba(255,255,255,.4))", boxShadow: "inset 0 0 0 6px rgba(255,255,255,.4)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 340 * lvl, background: "linear-gradient(180deg,#f8eed8,#e0cca4)", boxShadow: "inset 0 8px 0 #fffaf0" }} />
      </div>
      <div style={{ position: "absolute", left: 20, top: lerp(-260, 10, eOut(lid, 0, 1)), width: 300, height: 60, borderRadius: 12, background: "repeating-linear-gradient(90deg,#c8a43a 0 12px,#f4d47a 12px 24px)", transform: `rotate(${(1 - lid) * 360}deg) scaleY(.9)`, boxShadow: "0 8px 0 #8a6a1a" }} />
    </div>
    <div style={{ ...A, left: 1180, top: 520, width: 380, height: 360, background: "linear-gradient(180deg,#fff27a,#f4d83a)", transform: `rotate(${4 - (1 - note) * 30}deg) scale(${note})`, transformOrigin: "50% 0", boxShadow: "0 30px 30px rgba(0,0,0,.4)", fontFamily: HAND, fontSize: 70, color: "#2a2a6a", padding: 30, lineHeight: 1.1 }}>use by<br /><b style={{ fontSize: 90 }}>THURSDAY</b></div>
  </>;
}}</Stage>;

// P19 · que no se curve: dos chuletas de perfil sobre la llama; la de grasa entera se arquea como papa frita, la con cortes queda plana
export const P19Curl: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const cu = eio(tt, 0.8, 3.0), mark = phys(tt, 3.2, 7, 0.5);
  const side = (x: number, curl: number, cuts: boolean) => <svg width={620} height={260} viewBox="0 0 620 260" style={{ ...A, left: x, top: 470, overflow: "visible" }}>
    <defs><linearGradient id={"sd" + x} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d8945a" /><stop offset="1" stopColor="#8a4a22" /></linearGradient></defs>
    <path d={`M20 ${200 - curl * 110} Q 310 ${200 + curl * 40} 600 ${200 - curl * 110} L 600 ${150 - curl * 110} Q 310 ${150 + curl * 40} 20 ${150 - curl * 110} Z`} fill={`url(#sd${x})`} stroke="#5a2a10" strokeWidth={4} />
    <path d={`M20 ${150 - curl * 110} Q 310 ${150 + curl * 40} 600 ${150 - curl * 110}`} fill="none" stroke="#fbe8c8" strokeWidth={16} />
    {cuts && [120, 240, 360, 480].map((cx) => <path key={cx} d={`M${cx} 138 l 0 26`} stroke="#5a2a10" strokeWidth={8} strokeLinecap="round" />)}
  </svg>;
  return <>
    {[0, 1].map((i) => <div key={i} style={{ ...A, left: 160 + i * 860, top: 640, width: 740, height: 180 }}>
      <div style={{ position: "absolute", left: 0, top: 50, width: 740, height: 50, borderRadius: 10, background: "linear-gradient(180deg,#3a3634,#121010)", boxShadow: "0 20px 30px rgba(0,0,0,.6)" }} />
      {Array.from({ length: 9 }, (_, j) => <div key={j} style={{ position: "absolute", left: 60 + j * 74, top: 100 + Math.sin(tt * 14 + j) * 4, width: 46, height: 70 + Math.sin(tt * 11 + j * 2) * 14, borderRadius: "50% 50% 40% 40%", background: "radial-gradient(ellipse at 50% 80%,#ffd27a,#ff6a1a 50%,rgba(60,90,255,.4) 90%)", filter: "blur(2px)" }} />)}
    </div>)}
    {side(220, cu, false)}{side(1080, 0, true)}
    <div style={{ ...A, left: 1390, top: 300, transform: `scale(${mark})`, fontFamily: SANS, fontWeight: 900, fontSize: 90, color: "#7af0a0", textShadow: "0 6px 20px rgba(0,0,0,.6)" }}>FLAT ✓</div>
    <div style={{ ...A, left: 420, top: 300, transform: `scale(${mark})`, fontFamily: SANS, fontWeight: 900, fontSize: 90, color: "#ff7a6a", textShadow: "0 6px 20px rgba(0,0,0,.6)" }}>CURLS ✗</div>
  </>;
}}</Stage>;

// P20 · vista explotada: la pila de chuletas se abre en el aire y una hoja de papel encerado translúcida baja entre cada par
export const P20Stack: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const ex = eio(tt, 0.6, 1.6), wp = (i: number) => eio(tt, 1.6 + i * 0.4, 2.2 + i * 0.4), cl2 = eio(tt, 3.9, 4.6);
  const gapY = lerp(40, 150, ex) * (1 - cl2 * 0.65);
  return <>
    <Shadow x={960} y={940} w={760} k={1} o={0.7} />
    {[0, 1, 2, 3].map((i) => <React.Fragment key={i}>
      <div style={{ ...A, left: 960 - 300, top: 760 - i * gapY - 200, transform: `perspective(900px) rotateX(58deg) rotate(${(i - 1.5) * 6 * ex}deg)`, zIndex: i * 2 }}><Chop3 w={600} th={20} /></div>
      {i < 3 && <div style={{ ...A, left: 960 - 330 + (1 - wp(i)) * 800, top: 760 - i * gapY - gapY / 2 - 150, width: 660, height: 420, transform: "perspective(900px) rotateX(58deg)", background: "linear-gradient(120deg,rgba(255,252,240,.55),rgba(255,255,255,.25) 50%,rgba(255,250,230,.6))", boxShadow: "inset 0 0 0 2px rgba(255,255,255,.6)", opacity: wp(i), zIndex: i * 2 + 1 }} />}
    </React.Fragment>)}
    <Tag tt={tt} at={3.2} x={1560} y={300} txt="WAX PAPER" size={84} font={SERIF} col={K.goldL} />
  </>;
}}</Stage>;

// P21 · la luna de miel: sedán de 1964 de tres cuartos cruza la ruta arrastrando latas, con JUST MARRIED en la luneta
export const P21Car: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const x = lerp(-700, 1500, eio(tt, 0.3, 5.2)), bob = Math.sin(tt * 16) * 3;
  return <>
    <div style={{ ...A, left: 0, top: 720, width: 1920, height: 360, background: "linear-gradient(180deg,#4a4846,#2a2826)" }} />
    {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ ...A, left: ((i * 300 - tt * 600) % 2400 + 2400) % 2400 - 240, top: 880, width: 160, height: 14, background: "#f4e4a8" }} />)}
    <div style={{ ...A, left: x, top: 470 + bob, width: 760, height: 320 }}>
      <Shadow x={380} y={300} w={800} k={1} o={0.8} />
      <svg width={760} height={320} viewBox="0 0 760 320" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <defs><linearGradient id="car21" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c8e8e0" /><stop offset="0.45" stopColor="#5aa89a" /><stop offset="1" stopColor="#2a5a52" /></linearGradient>
          <linearGradient id="chr21" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" /><stop offset="0.5" stopColor="#8a9098" /><stop offset="1" stopColor="#e8ecf0" /></linearGradient></defs>
        <path d="M40 210 L 60 150 C 90 140, 180 130, 220 128 L 290 60 C 320 44, 470 44, 510 60 L 580 128 C 650 132, 710 146, 730 170 L 740 220 Z" fill="url(#car21)" stroke="#1a3a34" strokeWidth={4} />
        <path d="M300 70 L 250 128 L 400 128 L 400 66 Z M412 66 L 412 128 L 560 128 L 506 70 Z" fill="#cfe8f4" stroke="#1a3a34" strokeWidth={3} />
        <text x="480" y="112" fontFamily={MARK} fontSize="30" fill="#d0202a" transform="rotate(-6 480 112)">JUST MARRIED</text>
        <rect x={36} y={204} width={708} height={20} rx={10} fill="url(#chr21)" />
        {[170, 610].map((cx) => <g key={cx} transform={`rotate(${tt * 720} ${cx} 236)`}><circle cx={cx} cy={236} r={52} fill="#141414" /><circle cx={cx} cy={236} r={26} fill="url(#chr21)" /><rect x={cx - 3} y={212} width={6} height={48} fill="#555" /></g>)}
      </svg>
      {Array.from({ length: 4 }, (_, i) => { const lx = -90 - i * 90 + Math.sin(tt * 8 + i) * 10, ly = 240 + Math.abs(Math.sin(tt * 11 + i * 2)) * -40; return <React.Fragment key={i}>
        <svg width={760} height={320} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}><path d={`M40 214 Q ${lx + 60} ${ly - 30} ${lx + 30} ${ly}`} stroke="#d8d0c0" strokeWidth={3} fill="none" /></svg>
        <div style={{ position: "absolute", left: lx, top: ly, width: 56, height: 70, borderRadius: 8, background: "linear-gradient(90deg,#8a9098,#f4f6f8 40%,#8a9098)", transform: `rotate(${Math.sin(tt * 9 + i) * 30}deg)`, boxShadow: "0 10px 10px rgba(0,0,0,.4)" }} /></React.Fragment>; })}
    </div>
    <Tag tt={tt} at={1.0} x={960} y={200} txt="JUNE 1964" size={110} font={SERIF} col={K.goldL} />
  </>;
}}</Stage>;

// P22 · tenía veinte años: el contador de rodillos gira para atrás de 81 a 20 mientras la foto vieja de borde blanco pasa de gris a color
export const P22Young: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const k = eio(tt, 0.8, 3.6), age = lerp(81, 20, k), col = eio(tt, 2.0, 4.2);
  return <>
    <div style={{ ...A, left: 260, top: 180, width: 700, height: 760, padding: 30, paddingBottom: 110, background: "linear-gradient(180deg,#fbf6ea,#e8dfcc)", transform: `rotate(-4deg) translateY(${(1 - phys(tt, 0.1, 7, 0.5)) * 400}px)`, boxShadow: "0 40px 70px rgba(0,0,0,.6)", boxSizing: "border-box" }}>
      <div style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative" }}>
        <Img src={img(h.bg ?? "f20")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `grayscale(${1 - col}) sepia(${0.6 * (1 - col)}) contrast(${1 - 0.15 * (1 - col)})`, transform: `scale(${1.08 - 0.06 * k})` }} />
      </div>
      <div style={{ position: "absolute", bottom: 30, left: 0, right: 0, textAlign: "center", fontFamily: HAND, fontSize: 52, color: "#3a2a1a" }}>June 1964</div>
    </div>
    <div style={{ ...A, left: 1120, top: 360, transform: `scale(${phys(tt, 0.5, 7, 0.5)})`, transformOrigin: "0 0" }}>
      <Rollers v={age} n={2} size={190} />
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: K.goldL, marginTop: 20, textShadow: "0 6px 20px rgba(0,0,0,.6)" }}>YEARS OLD</div>
    </div>
  </>;
}}</Stage>;

// P23 · nada se desperdicia: la rodaja de pan apoyada en el plato hondo chupa el jugo y el color sube por la miga
export const P23Soak: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="rise">{(tt) => {
  const dip = eio(tt, 0.5, 1.3), soak = eio(tt, 1.3, 4.0), lvl = 1 - 0.4 * soak;
  return <>
    <div style={{ ...A, left: 360, top: 560, width: 1000, height: 380 }}>
      <Shadow x={500} y={370} w={1040} k={1} o={0.7} />
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(ellipse at 45% 40%,#ffffff,#e8e2d4 60%,#c8c0ae)", boxShadow: "0 18px 0 #b0a894" }} />
      <div style={{ position: "absolute", left: 160 + (1 - lvl) * 60, top: 80 + (1 - lvl) * 30, width: 680 - (1 - lvl) * 120, height: 220 - (1 - lvl) * 60, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 35%,#c8843a,#7a3e12 70%)", boxShadow: "inset 0 10px 20px rgba(0,0,0,.35)" }}>
        <div style={{ position: "absolute", left: 120, top: 40, width: 200, height: 30, borderRadius: "50%", background: "rgba(255,240,210,.35)" }} />
      </div>
    </div>
    <div style={{ ...A, left: 920, top: lerp(140, 270, dip), width: 460, height: 520, transform: `rotate(${lerp(-30, -18, dip)}deg)`, transformOrigin: "50% 100%" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "46% 46% 18px 18px / 30% 30% 18px 18px", background: "linear-gradient(180deg,#b8742e,#7a4214)", padding: 22, boxSizing: "border-box", boxShadow: "0 30px 40px rgba(0,0,0,.5)" }}>
        <div style={{ width: "100%", height: "100%", borderRadius: "44% 44% 10px 10px / 28% 28% 10px 10px", background: `linear-gradient(0deg,#9a5a22 0%,#b8783a ${soak * 70}%,#f6e8c8 ${soak * 70 + 12}%,#fbf2dc)`, position: "relative", overflow: "hidden" }}>
          {Array.from({ length: 40 }, (_, i) => <div key={i} style={{ position: "absolute", left: rnd(i) * 400, top: rnd(i + 7) * 460, width: 8 + rnd(i + 3) * 14, height: 6 + rnd(i + 4) * 10, borderRadius: "50%", background: "rgba(150,110,60,.35)" }} />)}
        </div>
      </div>
    </div>
    <Tag tt={tt} at={2.6} x={560} y={320} txt="NOTHING WASTED" size={80} font={SERIF} col={K.goldL} />
  </>;
}}</Stage>;

// P24 · la feria de 1971: podio de madera; la chuleta de Ruth en el plato del 1º y el pastel de Loretta en el 2º; la cinta azul cae y se prende
export const P24Podium: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const rb = eio(tt, 1.6, 2.6), sw = Math.sin((tt - 2.6) * 6) * 10 * Math.exp(-Math.max(0, tt - 2.6) * 1.6) * (tt > 2.6 ? 1 : 0);
  const block = (x: number, w: number, hh: number, n: string, a: number) => <div style={{ ...A, left: x, top: 960 - hh * phys(tt, a, 7, 0.5), width: w, height: hh, background: "linear-gradient(90deg,#6a3e1c,#c48a52 40%,#8a5428)", boxShadow: "inset 0 14px 0 #e0aa6a, 0 30px 40px rgba(0,0,0,.5)", fontFamily: SERIF, fontWeight: 900, fontSize: 120, color: "#3a1e08", textAlign: "center", lineHeight: `${hh}px` }}>{n}</div>;
  return <>
    {block(560, 400, 420, "1", 0.2)}{block(960, 380, 290, "2", 0.4)}
    <div style={{ ...A, left: 760 - 170, top: 400, transform: `translateY(${(1 - phys(tt, 0.7, 7, 0.5)) * -500}px)` }}><Plate x={170} y={100} w={340} gold><div style={{ position: "absolute", left: 10, top: -50 }}><Chop3 w={220} k={0.9} th={10} /></div></Plate></div>
    <div style={{ ...A, left: 1150 - 170, top: 530, transform: `translateY(${(1 - phys(tt, 0.9, 7, 0.5)) * -500}px)` }}><Plate x={170} y={100} w={340}><div style={{ position: "absolute", left: 30, top: -10, width: 180, height: 90, borderRadius: "50% 50% 12px 12px", background: "linear-gradient(180deg,#f0c070,#b87830)", boxShadow: "inset 0 -14px 0 #8a5420" }} /></Plate></div>
    <div style={{ ...A, left: 700, top: lerp(-300, 410, eOut(rb, 0, 1)), transform: `rotate(${sw}deg)`, transformOrigin: "50% 0", filter: "drop-shadow(0 16px 16px rgba(0,0,0,.5))" }}>
      <div style={{ width: 120, height: 120, borderRadius: "50%", background: "repeating-conic-gradient(#1a4ab0 0 10deg,#2a6ad8 10deg 20deg)", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 76, height: 76, borderRadius: "50%", background: "radial-gradient(circle,#f4d47a,#b8862e)", fontFamily: SERIF, fontWeight: 900, fontSize: 30, color: "#3a2208", textAlign: "center", lineHeight: "76px" }}>1st</div></div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: -10 }}>{[0, 1].map((i) => <div key={i} style={{ width: 44, height: 140, background: "linear-gradient(90deg,#1a4ab0,#3a7ae8,#1a4ab0)", clipPath: "polygon(0 0,100% 0,100% 100%,50% 82%,0 100%)", transform: `rotate(${i ? 8 : -8}deg)` }} />)}</div>
    </div>
    <Tag tt={tt} at={3.0} x={960} y={200} txt="COUNTY FAIR 1971" size={84} font={SERIF} col={K.goldL} />
  </>;
}}</Stage>;

// P25 · la heladera de Ruth: la puerta gira en su bisagra, se prende la lamparita y adentro está el frasco de mayonesa lleno de agua con sal
export const P25Reveal: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="night">{(tt) => {
  const op = eio(tt, 0.5, 1.8), bulb = cl((tt - 1.4) * 5) * (0.92 + 0.08 * Math.sin(tt * 40) * (tt < 1.8 ? 1 : 0)), push = eio(tt, 2.4, 4.2);
  return <>
    <div style={{ ...A, left: 560, top: 100, width: 800, height: 940, perspective: 1600 }}>
      <Shadow x={400} y={940} w={860} k={1} o={0.8} />
      <div style={{ position: "absolute", inset: 0, borderRadius: 40, background: "linear-gradient(90deg,#d8d4c8,#f6f2e6 40%,#c8c4b8)", boxShadow: "0 40px 80px rgba(0,0,0,.7)" }}>
        <div style={{ position: "absolute", inset: 40, borderRadius: 14, background: `radial-gradient(ellipse at 50% 10%,rgba(255,248,220,${bulb}),rgba(200,210,215,${0.15 + 0.5 * bulb}) 60%,#2a2c2e)`, overflow: "hidden", transform: `scale(${1 + push * 0.25})`, transformOrigin: "50% 60%" }}>
          <div style={{ position: "absolute", left: 340, top: 10, width: 80, height: 50, borderRadius: "0 0 40px 40px", background: `radial-gradient(circle,#fffbe0,#e8d89a)`, boxShadow: `0 0 ${120 * bulb}px ${50 * bulb}px rgba(255,240,180,.6)`, opacity: 0.3 + 0.7 * bulb }} />
          {[300, 560].map((y) => <div key={y} style={{ position: "absolute", left: 0, right: 0, top: y, height: 14, background: "linear-gradient(180deg,rgba(255,255,255,.7),rgba(200,210,220,.4))" }} />)}
          <div style={{ position: "absolute", left: 60, top: 180, width: 140, height: 120, borderRadius: 14, background: "linear-gradient(180deg,#f4ead2,#d8c49a)", opacity: 0.6 }} />
          <div style={{ position: "absolute", left: 500, top: 440, width: 160, height: 120, borderRadius: 60, background: "radial-gradient(circle,#e8b84a,#a8741a)", opacity: 0.55 }} />
          <div style={{ position: "absolute", left: 260, top: 330, width: 220, height: 230, borderRadius: "40px 40px 26px 26px", background: "linear-gradient(90deg,rgba(200,220,235,.6),rgba(255,255,255,.25) 30%,rgba(190,215,230,.5))", boxShadow: "inset 0 0 0 5px rgba(255,255,255,.5), 0 0 60px rgba(255,250,220,.4)" }}>
            <div style={{ position: "absolute", left: 20, top: -30, width: 180, height: 44, borderRadius: 10, background: "repeating-linear-gradient(90deg,#c8ccd0 0 8px,#f4f6f8 8px 16px)" }} />
            <div style={{ position: "absolute", left: 6, right: 6, bottom: 6, height: 170, borderRadius: "0 0 22px 22px", background: "linear-gradient(180deg,rgba(220,235,245,.55),rgba(170,200,220,.7))" }} />
            <div style={{ position: "absolute", left: 30, top: 90, width: 160, height: 60, background: "#f2e2b8", fontFamily: MARK, fontSize: 40, color: K.ink, textAlign: "center", lineHeight: "60px", transform: "rotate(-3deg)" }}>BRINE</div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", inset: 0, borderRadius: 40, transformOrigin: "0 50%", transform: `rotateY(${-op * 112}deg)`, background: "linear-gradient(90deg,#c8c4b8,#f8f4ea 30%,#d8d4c8)", boxShadow: "inset -14px 0 0 #b8b4a8", backfaceVisibility: "hidden" }}>
        <div style={{ position: "absolute", right: 60, top: 380, width: 30, height: 200, borderRadius: 15, background: "linear-gradient(90deg,#8a9098,#f4f6f8,#8a9098)" }} />
      </div>
    </div>
  </>;
}}</Stage>;

// P26 · el almíbar dorado: cenital de la sartén con rodajas de manzana; llueve azúcar rubia, se funde y hace burbujas que se doran
export const P26Syrup: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const sug = cl((tt - 0.5) / 1.4), melt = eio(tt, 1.6, 3.6), gold = eio(tt, 2.4, 4.6);
  return <>
    <Skillet x={940} y={600} w={1200} heat={0.7}>
      <div style={{ position: "absolute", inset: "4% 6%", borderRadius: "50%", background: `radial-gradient(ellipse,rgba(${Math.round(lerp(240, 200, gold))},${Math.round(lerp(200, 120, gold))},${Math.round(lerp(120, 30, gold))},${0.15 + 0.7 * melt}),transparent 80%)` }} />
      {Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2, rr = i % 2 ? 0.3 : 0.18; return <div key={i} style={{ position: "absolute", left: `${50 + Math.cos(a) * rr * 100 - 9}%`, top: `${46 + Math.sin(a) * rr * 100 - 10}%`, width: 200, height: 90, borderRadius: "50% 50% 46% 46% / 90% 90% 30% 30%", transform: `rotate(${a * 57 + 90}deg)`, background: `linear-gradient(180deg,rgba(${Math.round(lerp(250, 230, gold))},${Math.round(lerp(236, 170, gold))},${Math.round(lerp(190, 70, gold))},.92),rgba(${Math.round(lerp(230, 180, gold))},${Math.round(lerp(200, 110, gold))},${Math.round(lerp(140, 30, gold))},.85))`, boxShadow: "inset 0 -10px 0 rgba(160,40,20,.5), 0 6px 10px rgba(0,0,0,.3)" }} />; })}
      {Array.from({ length: 40 }, (_, i) => { const p = cl(sug * 1.5 - rnd(i) * 0.5); return p > 0 && <div key={"g" + i} style={{ position: "absolute", left: `${18 + rnd(i + 3) * 64}%`, top: `${lerp(-40, 18 + rnd(i + 8) * 60, p)}%`, width: 14, height: 14, transform: `rotate(${i * 40}deg)`, background: "linear-gradient(135deg,#fff4d0,#e0b870)", opacity: 1 - melt }} />; })}
      {Array.from({ length: 22 }, (_, i) => { const p = ((tt * 0.8 + rnd(i)) % 1); return <div key={"b" + i} style={{ position: "absolute", left: `${20 + rnd(i + 11) * 60}%`, top: `${20 + rnd(i + 13) * 56}%`, width: 10 + 40 * p * melt, height: 10 + 40 * p * melt, borderRadius: "50%", border: "3px solid rgba(255,230,160,.8)", background: "radial-gradient(circle at 35% 30%,rgba(255,255,255,.7),transparent 50%)", opacity: melt * (1 - p) }} />; })}
    </Skillet>
    <Tag tt={tt} at={3.2} x={960} y={160} txt="GOLDEN SYRUP" size={96} font={SERIF} col={K.goldL} />
  </>;
}}</Stage>;

// P27 · cinco dólares bien gastados: el termómetro de varilla en su blíster se balancea en el gancho del tablero perforado; cae la etiqueta $5
export const P27Peg: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="rise">{(tt) => {
  const sw = Math.sin(tt * 3.4) * 9 * Math.exp(-tt * 0.5), tag = phys(tt, 2.4, 6, 0.4);
  return <>
    <div style={{ ...A, left: 0, top: 0, width: 1920, height: 1080, background: "radial-gradient(circle,#2a1c10 0 7px,transparent 8px) 0 0/60px 60px, linear-gradient(180deg,#c89a64,#9a6e40)" }} />
    <div style={{ ...A, left: 940, top: 120, width: 40, height: 140, background: "linear-gradient(90deg,#8a9098,#f4f6f8,#8a9098)", borderRadius: 8 }} />
    <div style={{ ...A, left: 760, top: 180, width: 400, height: 760, transform: `rotate(${sw}deg)`, transformOrigin: "50% 0" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 400, height: 120, borderRadius: "20px 20px 0 0", background: "linear-gradient(180deg,#d8242e,#a01a20)", fontFamily: SANS, fontWeight: 900, fontSize: 40, color: "#fff", textAlign: "center", lineHeight: "120px" }}>
        <div style={{ position: "absolute", left: 170, top: 20, width: 60, height: 22, borderRadius: 11, background: "#1a1c1e" }} />
        <span style={{ position: "relative", top: 22 }}>INSTANT READ</span>
      </div>
      <div style={{ position: "absolute", left: 0, top: 120, width: 400, height: 640, background: "linear-gradient(180deg,#f4f0e6,#ddd6c6)", boxShadow: "0 40px 60px rgba(0,0,0,.55)" }}>
        <div style={{ position: "absolute", left: 60, top: 30, width: 280, height: 580, borderRadius: 40, background: "linear-gradient(110deg,rgba(255,255,255,.55),rgba(255,255,255,.15) 40%,rgba(255,255,255,.5))", boxShadow: "inset 0 0 0 4px rgba(255,255,255,.7), 0 10px 20px rgba(0,0,0,.2)" }}>
          <div style={{ position: "absolute", left: 70, top: 30, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#3a3c40,#121314)", border: "8px solid #c8ccd2", fontFamily: SANS, fontWeight: 900, fontSize: 52, color: "#7af0a0", textAlign: "center", lineHeight: "124px" }}>145</div>
          <div style={{ position: "absolute", left: 130, top: 180, width: 20, height: 380, borderRadius: "10px 10px 2px 2px", background: "linear-gradient(90deg,#8a9098,#f4f6f8,#8a9098)" }} />
        </div>
      </div>
    </div>
    <div style={{ ...A, left: 1230, top: lerp(-300, 560, cl(tag)), width: 280, height: 200, transform: `rotate(${-12 + (1 - cl(tag)) * 40}deg)`, background: "linear-gradient(180deg,#fff27a,#f4c83a)", borderRadius: 14, boxShadow: "0 24px 30px rgba(0,0,0,.45)", fontFamily: SANS, fontWeight: 900, fontSize: 130, color: "#c4202a", textAlign: "center", lineHeight: "200px" }}>$5</div>
  </>;
}}</Stage>;

// P28 · el remojo: sartén con una pulgada de agua caliente; cae una gota amarilla de detergente, la espuma crece y al pasar el trapo brilla limpia
export const P28Soak: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const drop = cl((tt - 0.6) / 0.5), foam = eio(tt, 1.1, 3.0), wipe = eio(tt, 3.4, 4.6);
  return <>
    <Skillet x={900} y={640} w={1100} heat={0.2}>
      <div style={{ position: "absolute", inset: "6% 8%", borderRadius: "50%", background: "radial-gradient(ellipse at 50% 40%,rgba(180,210,230,.4),rgba(100,140,170,.3))", boxShadow: "inset 0 6px 0 rgba(255,255,255,.3)" }} />
      {Array.from({ length: 34 }, (_, i) => { const a = rnd(i) * Math.PI * 2, rr = rnd(i + 4) * 0.36 * foam; const s = 30 + rnd(i + 2) * 60; return <div key={i} style={{ position: "absolute", left: `${50 + Math.cos(a) * rr * 100}%`, top: `${48 + Math.sin(a) * rr * 70}%`, width: s * foam, height: s * foam, marginLeft: -s * foam / 2, marginTop: -s * foam / 2, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#ffffff,rgba(240,248,255,.85) 40%,rgba(200,220,240,.5))", boxShadow: "0 4px 8px rgba(0,0,0,.15)", opacity: 1 - wipe }} />; })}
      {wipe > 0 && <div style={{ position: "absolute", left: "8%", top: "8%", width: `${84 * wipe}%`, height: "80%", borderRadius: "50%", background: "linear-gradient(110deg,transparent 40%,rgba(255,255,255,.4) 50%,transparent 60%)" }} />}
    </Skillet>
    <Steam x={900} y={560} tt={tt} n={5} w={500} k={0.5} hgt={260} />
    <div style={{ ...A, left: 1180, top: 120, width: 150, height: 300, transform: `rotate(${-eio(tt, 0.1, 0.6) * 130}deg)`, transformOrigin: "50% 100%", borderRadius: "40px 40px 20px 20px", background: "linear-gradient(90deg,#d8a81a,#f8d84a 40%,#c8981a)", boxShadow: "0 20px 30px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 50, top: -50, width: 50, height: 60, borderRadius: 10, background: "#2a6ad8" }} />
    </div>
    {drop > 0 && drop < 1 && <Drop x={lerp(1060, 900, drop)} y={lerp(160, 620, drop * drop)} s={44} col="#f8d84a" />}
    {wipe > 0 && <div style={{ ...A, left: lerp(450, 1250, wipe) - 140, top: 560, width: 280, height: 200, borderRadius: 30, background: "repeating-linear-gradient(45deg,#3a7ae8 0 16px,#2a5ab8 16px 32px)", transform: `rotate(${-10 + Math.sin(tt * 8) * 6}deg)`, boxShadow: "0 20px 30px rgba(0,0,0,.5)" }} />}
    <Tag tt={tt} at={4.4} x={960} y={190} txt="WIPES RIGHT OUT" size={84} font={SERIF} col={K.goldL} />
  </>;
}}</Stage>;

// P29 · la placa de bronce: una punta grabadora traza «145°» con chispas calientes y el barrido de luz descubre el relieve con sus tornillos
export const P29Plaque: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const eng = eio(tt, 0.6, 3.0), sweep = eio(tt, 3.0, 4.4), ex = 560 + eng * 800;
  return <>
    <div style={{ ...A, left: 360, top: 220, width: 1200, height: 640, borderRadius: 24, background: "linear-gradient(135deg,#8a5a1a,#e8b45a 30%,#a87028 55%,#f4cc7a 75%,#8a5a1a)", boxShadow: "0 50px 90px rgba(0,0,0,.7), inset 0 0 0 16px rgba(90,50,10,.55), inset 0 0 0 22px rgba(255,220,150,.4)" }}>
      {[[50, 50], [1150, 50], [50, 590], [1150, 590]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x - 22, top: y - 22, width: 44, height: 44, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#fff2c8,#8a5a1a)", boxShadow: "0 4px 6px rgba(0,0,0,.4)" }}><div style={{ position: "absolute", left: 8, top: 19, width: 28, height: 6, background: "#5a3a0a", transform: `rotate(${i * 40}deg)` }} /></div>)}
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 250, color: "#6a4010", textShadow: "0 -3px 0 rgba(0,0,0,.45), 0 3px 0 rgba(255,230,170,.7)", clipPath: `inset(0 ${100 - eng * 100}% 0 0)` }}>145°</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 80, letterSpacing: 10, color: "#6a4010", textShadow: "0 -2px 0 rgba(0,0,0,.4), 0 2px 0 rgba(255,230,170,.7)", opacity: eio(tt, 2.6, 3.4) }}>+ 3 MINUTES</div>
      <div style={{ position: "absolute", inset: 0, borderRadius: 24, background: `linear-gradient(110deg,transparent ${sweep * 120 - 30}%,rgba(255,255,240,.55) ${sweep * 120 - 15}%,transparent ${sweep * 120}%)` }} />
    </div>
    {eng > 0 && eng < 1 && <>
      <div style={{ ...A, left: ex - 14, top: 160, width: 28, height: 300, borderRadius: "14px 14px 2px 2px", background: "linear-gradient(90deg,#3a3c40,#c8ccd2,#3a3c40)", transform: "rotate(18deg)", transformOrigin: "50% 100%", boxShadow: "0 20px 30px rgba(0,0,0,.5)" }} />
      {Array.from({ length: 16 }, (_, i) => { const p = ((tt * 3 + rnd(i)) % 1), a = -Math.PI / 2 + (rnd(i + 3) - 0.5) * 2.2; return <div key={i} style={{ ...A, left: ex + 40 + Math.cos(a) * p * 220, top: 460 + Math.sin(a) * p * 220 + p * p * 160, width: 8, height: 8, borderRadius: "50%", background: "#fff4b0", boxShadow: "0 0 12px 4px #ffb43a", opacity: 1 - p }} />; })}
    </>}
  </>;
}}</Stage>;

// P30 · el buzón: buzón metálico grande; la banderita roja salta con resorte y los sobres caen de a uno y se apilan
export const P30Mail: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const flag = phys(tt, 0.8, 8, 0.3), door = eio(tt, 1.4, 2.0);
  return <>
    <div style={{ ...A, left: 940, top: 700, width: 60, height: 380, background: "linear-gradient(90deg,#4a2e14,#8a5a30,#4a2e14)" }} />
    <div style={{ ...A, left: 560, top: 300, width: 820, height: 420 }}>
      <Shadow x={410} y={430} w={600} k={1} o={0.6} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 820, height: 420, borderRadius: "210px 210px 20px 20px", background: "linear-gradient(180deg,#e8ecf0,#9aa0a8 50%,#5a6068)", boxShadow: "inset 0 20px 0 rgba(255,255,255,.4), 0 40px 70px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: -10, top: 10, width: 220, height: 400, borderRadius: "110px 110px 14px 14px", background: "linear-gradient(90deg,#3a3e44,#1a1c1e)", transformOrigin: "50% 100%", transform: `perspective(800px) rotateX(${-door * 70}deg)`, boxShadow: "inset 0 0 0 10px #6a7078" }} />
      <div style={{ position: "absolute", left: 700, top: 180, width: 20, height: 220, background: "#8a1a1a", transformOrigin: "50% 100%", transform: `rotate(${lerp(-90, 0, flag)}deg)` }}><div style={{ width: 110, height: 70, background: "linear-gradient(180deg,#e83a2a,#a01a12)", boxShadow: "0 8px 12px rgba(0,0,0,.4)" }} /></div>
    </div>
    {Array.from({ length: 9 }, (_, i) => { const a = 2.0 + i * 0.32, d = tt - a; if (d < 0) return null; const p = cl(d / 0.5); return <div key={i} style={{ ...A, left: lerp(620, 300 + (i % 3) * 30 + i * 8, p), top: lerp(560, 960 - i * 22, p * p), width: 300, height: 180, transform: `rotate(${lerp(0, -12 + rnd(i) * 24, p) + (1 - p) * 120}deg)`, background: "linear-gradient(180deg,#fbf6ea,#e8dcc4)", boxShadow: "0 10px 14px rgba(0,0,0,.35)", zIndex: 5 + i }}><div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,transparent 49%,#d8ccb0 50%,transparent 51%), linear-gradient(20deg,transparent 49%,#d8ccb0 50%,transparent 51%)" }} /><div style={{ position: "absolute", right: 14, top: 12, width: 40, height: 48, background: "#c4202a" }} /></div>; })}
    <Tag tt={tt} at={3.2} x={1500} y={220} txt="EVERY ONE" size={96} font={SERIF} col={K.goldL} />
  </>;
}}</Stage>;

import { Odo as OdoK, Stage as StageK, H as HK } from "./kit";
import { Img as ImgK } from "remotion";
type CPk = { t: number; h: HK };

// ───────────── v6 (ronda 3 del evaluador): el OBJETO es una foto real de la cocina de Loretta; la cámara viaja en curva hacia él,
// un elemento físico en código actúa sobre la foto y una sola palabra grande vive dentro de la escena (nunca arriba a la izquierda).
const FA: React.CSSProperties = { position: "absolute" };
type Fx = (tt: number, d: number) => React.ReactNode;   // d = duración del componente
const Foto: React.FC<CPk & { id: string; fx: number; fy: number; z?: number; word: string; wx?: number; wy?: number; wa?: number; mode?: "iris" | "wipe" | "blinds" | "split" | "drop" | "rise"; fx2?: Fx }> = ({ t, h, id, fy, word, wa = 1.4, mode = "iris", fx2 }) => <StageK t={t} h={h} mode={mode} table={false}>{(tt) => {
  const d = h.out - h.at, k = eio(tt, 0, d), s = lerp(1.0, 1.1, k), pan = 0.6 * 960 * (s - 1) * (1 - 2 * k), oy = fy * 1080;
  const ca = phys(tt, 0.05, 6, 0.55), sweep = cl((tt - 0.6) / 2.2), CW = 1540, CH = 866, CX = (1920 - CW) / 2, CY = 34;
  const fs = Math.min(104, 1640 / (word.length * 0.6));
  return <>
    <ImgK src={img(id)} style={{ ...FA, left: -160, top: -90, width: 2240, height: 1260, objectFit: "cover", filter: "blur(34px) brightness(.42) saturate(1.15)", transform: `scale(${lerp(1.06, 1.0, k)})` }} />
    <div style={{ ...FA, left: CX, top: CY, width: CW, height: CH, transform: `translateY(${(1 - ca) * 60}px) rotate(${lerp(-1.1, 0, ca) + lerp(0, 0.35, k)}deg)`, borderRadius: 14, overflow: "hidden", boxShadow: "0 30px 70px rgba(0,0,0,.6), 0 6px 14px rgba(0,0,0,.45)", outline: "6px solid rgba(250,244,230,.92)" }}>
      <div style={{ ...FA, left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 540px", transform: `translate(${(CW - 1920) / 2 + pan}px, ${(CH - 1080) / 2}px) scale(${s * CW / 1920 * 1.0})`, }}>
        <ImgK src={img(id)} style={{ width: 1920, height: 1080, objectFit: "cover" }} />
        {fx2 && fx2(tt, d)}
      </div>
      <div style={{ ...FA, inset: 0, background: `linear-gradient(105deg, transparent ${sweep * 140 - 40}%, rgba(255,246,220,.16) ${sweep * 140 - 25}%, transparent ${sweep * 140 - 10}%)` }} />
    </div>
    <div style={{ ...FA, left: 960, top: CY + CH + (1080 - CY - CH) / 2 + 4, transform: `translate(-50%,-50%) translateY(${(1 - phys(tt, wa, 7, 0.5)) * 40}px) scale(${0.88 + 0.12 * phys(tt, wa, 7, 0.5)})`, opacity: cl((tt - wa) * 4), fontFamily: SERIF, fontWeight: 900, fontSize: fs, color: K.goldL, letterSpacing: 2, whiteSpace: "nowrap", textShadow: "0 5px 0 rgba(60,30,0,.55), 0 12px 30px rgba(0,0,0,.8)" }}>{word}</div>
  </>;
}}</StageK>;
// monedas que caen con rebote y se apilan
const Coins = (tt: number, a: number, x: number, y: number, n = 6): React.ReactNode => tt < -1e9 && Array.from({ length: n }, (_, i) => {
  const st = a + i * 0.18, dd = tt - st; if (dd < 0) return null;
  const T = 0.42, yy = dd < T ? lerp(-500, 0, (dd / T) ** 2) : -Math.abs(Math.sin((dd - T) * 12)) * 26 * Math.exp(-(dd - T) * 6);
  return <div key={i} style={{ ...FA, left: x + (i % 3) * 22 - 30, top: y + yy - i * 9, width: 118, height: 40, borderRadius: "50%", background: "linear-gradient(180deg,#f4f0e8,#a8a49a 60%,#6a665e)", boxShadow: "0 3px 0 #5a564e, 0 8px 10px rgba(0,0,0,.4)" }} />;
});
// vapor en volutas sobre la foto
const Vapor = (tt: number, x: number, y: number, w = 220, k = 1): React.ReactNode => Array.from({ length: 6 }, (_, i) => {
  const p = (tt * 0.42 + i / 6) % 1, sz = 70 + 120 * p;
  return <div key={i} style={{ ...FA, left: x - w / 2 + rnd(i) * w + Math.sin(tt * 1.3 + i) * 34 * p - sz / 2, top: y - p * 380 - sz / 2, width: sz, height: sz * 1.3, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,255,255,.4),transparent 68%)", filter: "blur(9px)", opacity: k * Math.sin(p * Math.PI) }} />;
});
// granos / partículas que caen desde un punto
const Lluvia = (tt: number, a: number, x: number, y: number, h0: number, col: string, n = 40, sz = 9): React.ReactNode => Array.from({ length: n }, (_, i) => {
  if (tt < a) return null;
  const p = ((tt - a) * 1.1 + rnd(i)) % 1;
  return <div key={i} style={{ ...FA, left: x + (rnd(i + 5) - 0.5) * 40 * (1 + p), top: y + p * p * h0, width: sz, height: sz, borderRadius: "40%", background: col, transform: `rotate(${i * 50}deg)`, opacity: 1 - p * 0.6 }} />;
});
// aro de cuenta regresiva alrededor de un objeto de la foto
const Aro = (tt: number, a: number, b: number, x: number, y: number, r0: number, col = "#f8dda4"): React.ReactNode => { if (tt > -1) return null;
  const p = 1 - eio(tt, a, b), C = 2 * Math.PI * r0;
  return <svg width={r0 * 2 + 40} height={r0 * 2 + 40} style={{ ...FA, left: x - r0 - 20, top: y - r0 - 20, transform: "rotate(-90deg)", opacity: cl((tt - a + 0.3) * 4) }}><circle cx={r0 + 20} cy={r0 + 20} r={r0} fill="none" stroke="rgba(0,0,0,.35)" strokeWidth={16} /><circle cx={r0 + 20} cy={r0 + 20} r={r0} fill="none" stroke={col} strokeWidth={12} strokeDasharray={`${C * p} ${C}`} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px ${col})` }} /></svg>;
};
// destello que pulsa sobre un punto de la foto
const Pulso = (tt: number, a: number, x: number, y: number, col = "rgba(255,240,190,.9)"): React.ReactNode => tt < -1e9 && tt > a && [0, 1].map((i) => { const p = ((tt - a) * 0.8 + i * 0.5) % 1; return <div key={i} style={{ ...FA, left: x - 30 - p * 120, top: y - 30 - p * 120, width: 60 + p * 240, height: 60 + p * 240, borderRadius: "50%", border: `6px solid ${col}`, opacity: 1 - p }} />; });
// contador de rodillos dentro de la escena
const Rodillo: React.FC<{ tt: number; d: number; a: number; b: number; v: number; x: number; y: number; pre?: string; dec?: number; size?: number }> = ({ tt, d, a, b, v, x, y, pre, dec = 0, size = 120 }) => tt < -1e9 && <div style={{ ...FA, left: x, top: y, opacity: 1 - cl((tt - d + 0.45) * 3), transform: `translate(-50%,-50%) scale(${phys(tt, a - 0.3, 7, 0.5)})` }}><OdoK tt={tt} a={a} b={b} v={v} pre={pre} dec={dec} size={size} /></div>;


export const K01: React.FC<CPk> = (p) => <Foto {...p} id="k01" fx={0.5} fy={0.55} z={1.32} word="DRY AS A CHURCH PEW" wx={960} wy={950} mode="iris"  />;
export const K02: React.FC<CPk> = (p) => <><Foto {...p} id="k02" fx={0.5} fy={0.55} z={1.45} word="THE GOVERNMENT SAID" wx={960} wy={180} mode="wipe"  /><Rodillo tt={p.t - p.h.at} d={p.h.out - p.h.at} a={0.7} b={3.2} v={7} x={1500} y={800} size={150} /></>;
export const K03: React.FC<CPk> = (p) => <Foto {...p} id="k03" fx={0.5} fy={0.55} z={1.38} word="THAT'S A BRINE" wx={960} wy={950} mode="rise" fx2={(tt) => Lluvia(tt, 0.6, 960, 260, 420, "rgba(250,248,240,.9)", 40, 7)} />;
export const K04: React.FC<CPk> = (p) => <Foto {...p} id="k04" fx={0.5} fy={0.55} z={1.32} word="HOLDS THE JUICE" wx={960} wy={180} mode="blinds"  />;
export const K05: React.FC<CPk> = (p) => <Foto {...p} id="k05" fx={0.5} fy={0.55} z={1.45} word="HARD AS A SHOE" wx={960} wy={950} mode="drop" fx2={(tt) => Vapor(tt, 960, 520, 420, 0.9)} />;
export const K06: React.FC<CPk> = (p) => <Foto {...p} id="k06" fx={0.5} fy={0.55} z={1.38} word="WHEN IT SHIMMERS" wx={960} wy={180} mode="split"  />;
export const K07: React.FC<CPk> = (p) => <Foto {...p} id="k07" fx={0.5} fy={0.55} z={1.32} word="FIVE MINUTES" wx={960} wy={950} mode="iris" fx2={(tt) => Vapor(tt, 960, 520, 420, 0.9)} />;
export const K08: React.FC<CPk> = (p) => <><Foto {...p} id="k08" fx={0.5} fy={0.55} z={1.45} word="HALF A BOX" wx={960} wy={180} mode="wipe"  /><Rodillo tt={p.t - p.h.at} d={p.h.out - p.h.at} a={0.7} b={3.2} v={375} x={1500} y={800} size={150} /></>;
export const K09: React.FC<CPk> = (p) => <Foto {...p} id="k09" fx={0.5} fy={0.55} z={1.38} word="THANKSGIVING IN A BOWL" wx={960} wy={950} mode="rise" fx2={(tt) => Vapor(tt, 960, 520, 420, 0.9)} />;
export const K10: React.FC<CPk> = (p) => <><Foto {...p} id="k10" fx={0.5} fy={0.55} z={1.32} word="WALTER · 20 YEARS" wx={960} wy={180} mode="blinds"  /><Rodillo tt={p.t - p.h.at} d={p.h.out - p.h.at} a={0.7} b={3.2} v={20} x={1500} y={800} size={150} /></>;
export const K11: React.FC<CPk> = (p) => <Foto {...p} id="k11" fx={0.5} fy={0.55} z={1.45} word="COAT THE SPOON" wx={960} wy={950} mode="drop"  />;
export const K12: React.FC<CPk> = (p) => <><Foto {...p} id="k12" fx={0.5} fy={0.55} z={1.38} word="SAFE AT 145°" wx={960} wy={180} mode="split"  /><Rodillo tt={p.t - p.h.at} d={p.h.out - p.h.at} a={0.7} b={3.2} v={145} x={1500} y={800} size={150} /></>;
export const K13: React.FC<CPk> = (p) => <Foto {...p} id="k13" fx={0.5} fy={0.55} z={1.32} word="THE THICKEST PART" wx={960} wy={950} mode="iris"  />;
export const K14: React.FC<CPk> = (p) => <Foto {...p} id="k14" fx={0.5} fy={0.55} z={1.45} word="ONE PAN" wx={960} wy={180} mode="wipe"  />;
export const K15: React.FC<CPk> = (p) => <Foto {...p} id="k15" fx={0.5} fy={0.55} z={1.38} word="POTATOES FIRST" wx={960} wy={950} mode="rise" fx2={(tt) => Vapor(tt, 960, 520, 420, 0.9)} />;
export const K16: React.FC<CPk> = (p) => <Foto {...p} id="k16" fx={0.5} fy={0.55} z={1.32} word="NINE BY THIRTEEN" wx={960} wy={180} mode="blinds"  />;
export const K17: React.FC<CPk> = (p) => <Foto {...p} id="k17" fx={0.5} fy={0.55} z={1.45} word="STEAMING ON TOP" wx={960} wy={950} mode="drop" fx2={(tt) => Vapor(tt, 960, 520, 420, 0.9)} />;
export const K18: React.FC<CPk> = (p) => <Foto {...p} id="k18" fx={0.5} fy={0.55} z={1.38} word="DON'T THROW IT OUT" wx={960} wy={180} mode="split"  />;
export const K19: React.FC<CPk> = (p) => <Foto {...p} id="k19" fx={0.5} fy={0.55} z={1.32} word="NO CURLING" wx={960} wy={950} mode="iris" fx2={(tt) => Vapor(tt, 960, 520, 420, 0.9)} />;
export const K20: React.FC<CPk> = (p) => <Foto {...p} id="k20" fx={0.5} fy={0.55} z={1.45} word="FLAT IN THE FREEZER" wx={960} wy={180} mode="wipe" fx2={(tt) => Lluvia(tt, 0.3, 960, 100, 760, "rgba(230,245,255,.85)", 46, 7)} />;
export const K21: React.FC<CPk> = (p) => <><Foto {...p} id="k21" fx={0.5} fy={0.55} z={1.38} word="AMANA · JUNE 1964" wx={960} wy={950} mode="rise"  /><Rodillo tt={p.t - p.h.at} d={p.h.out - p.h.at} a={0.7} b={3.2} v={1964} x={1500} y={300} size={150} /></>;
export const K22: React.FC<CPk> = (p) => <Foto {...p} id="k22" fx={0.5} fy={0.55} z={1.32} word="WHAT THEY NEVER DID" wx={960} wy={180} mode="blinds"  />;
export const K23: React.FC<CPk> = (p) => <Foto {...p} id="k23" fx={0.5} fy={0.55} z={1.45} word="SOAK UP THE JUICE" wx={960} wy={950} mode="drop"  />;
export const K24: React.FC<CPk> = (p) => <><Foto {...p} id="k24" fx={0.5} fy={0.55} z={1.38} word="BLUE RIBBON · 1971" wx={960} wy={180} mode="split"  /><Rodillo tt={p.t - p.h.at} d={p.h.out - p.h.at} a={0.7} b={3.2} v={1971} x={1500} y={800} size={150} /></>;
export const K25: React.FC<CPk> = (p) => <Foto {...p} id="k25" fx={0.5} fy={0.55} z={1.32} word="A JAR OF SALT WATER" wx={960} wy={950} mode="iris"  />;
export const K26: React.FC<CPk> = (p) => <Foto {...p} id="k26" fx={0.5} fy={0.55} z={1.45} word="GOLDEN SYRUP" wx={960} wy={180} mode="wipe" fx2={(tt) => Vapor(tt, 960, 520, 420, 0.9)} />;
export const K27: React.FC<CPk> = (p) => <Foto {...p} id="k27" fx={0.5} fy={0.55} z={1.38} word="$5 THERMOMETER" wx={960} wy={950} mode="rise"  />;
export const K28: React.FC<CPk> = (p) => <Foto {...p} id="k28" fx={0.5} fy={0.55} z={1.32} word="LET IT SOAK" wx={960} wy={180} mode="blinds" fx2={(tt) => Vapor(tt, 960, 520, 420, 0.9)} />;
export const K29: React.FC<CPk> = (p) => <Foto {...p} id="k29" fx={0.5} fy={0.55} z={1.45} word="NOT 160. NEVER AGAIN." wx={960} wy={950} mode="drop"  />;
export const K30: React.FC<CPk> = (p) => <Foto {...p} id="k30" fx={0.5} fy={0.55} z={1.38} word="I READ EVERY ONE" wx={960} wy={180} mode="split"  />;

import React from "react";
import { interpolate } from "remotion";
import { C, ent, fontFamily, prog } from "./kit";
import { O } from "./kitj";

// Más piezas de soot09: globos, herramientas de oficios, lupa, almacén común, carreta, tacha, torta de fracción.
type Pos = { x: number; y: number; s?: number; t?: number; t0?: number; rot?: number; op?: number };

// globo de diálogo (en coordenadas del lugar donde se dibuja)
export const Globo: React.FC<{ t: number; t0: number; t1?: number; x: number; y: number; text: string; size?: number; color?: string; tinta?: string; cola?: "izq" | "der" }> = ({ t, t0, t1 = 1e9, x, y, text, size = 46, color = "#fff", tinta = C.noche, cola = "izq" }) => {
  if (t < t0 || t > t1 + 0.25) return null;
  const s = ent(t, t0, 0, { damping: 10, stiffness: 200 }) * (t > t1 ? 1 - (t - t1) / 0.25 : 1);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -100%) scale(${s})`, transformOrigin: cola === "izq" ? "20% 120%" : "80% 120%", fontFamily, fontWeight: 700, fontSize: size, color: tinta, background: color, padding: `${size * 0.25}px ${size * 0.5}px`, borderRadius: size * 0.6, border: `${Math.max(4, size * 0.1)}px solid ${C.noche}`, whiteSpace: "nowrap", boxShadow: "0 6px 0 rgba(20,10,50,.3)" }}>
      {text}
      <div style={{ position: "absolute", bottom: -size * 0.42, [cola === "izq" ? "left" : "right"]: "18%", width: 0, height: 0, borderLeft: `${size * 0.25}px solid transparent`, borderRight: `${size * 0.25}px solid transparent`, borderTop: `${size * 0.45}px solid ${C.noche}` }} />
    </div>
  );
};

export type Oficio = "martillo" | "sierra" | "yunque" | "navaja" | "casco" | "nino" | "horca" | "pala" | "pluma";
export const Icono: React.FC<Pos & { k: Oficio; fondo?: string }> = ({ k, fondo = "#fff3d6", ...p }) => (
  <O {...p} w={200} h={200}>
    <circle r={92} fill={fondo} stroke={C.noche} strokeWidth={10} />
    {k === "martillo" && <g transform="rotate(-30)"><rect x={-8} y={-30} width={16} height={100} rx={6} fill="#8a5a2a" /><rect x={-46} y={-60} width={92} height={36} rx={8} fill="#6a7484" /></g>}
    {k === "sierra" && <g transform="rotate(-20)"><path d="M -70 -20 L 50 -20 L 50 20 L -70 20 Z" fill="#b9c2cf" />{Array.from({ length: 8 }, (_, i) => <path key={i} d={`M ${-70 + i * 15} 20 l 7 14 l 8 -14 Z`} fill="#8a94a4" />)}<rect x={46} y={-30} width={36} height={60} rx={12} fill="#8a5a2a" /></g>}
    {k === "yunque" && <g><path d="M -70 -30 L 60 -30 Q 80 -30 76 -10 L 30 -10 L 30 20 L 50 50 L -50 50 L -30 20 L -30 -10 L -60 -10 Z" fill="#3a3a44" /></g>}
    {k === "navaja" && <g transform="rotate(-25)"><path d="M -60 -12 L 40 -12 Q 70 0 40 12 L -60 12 Z" fill="#dfe6f0" stroke="#6a7484" strokeWidth={4} /><rect x={-80} y={-10} width={30} height={20} rx={6} fill="#8a5a2a" /></g>}
    {k === "casco" && <g><path d="M -80 10 Q 0 30 80 10 Q 60 0 50 -6 Q 46 -70 0 -74 Q -46 -70 -50 -6 Q -60 0 -80 10 Z" fill="#b9c2cf" stroke="#6a7484" strokeWidth={4} /></g>}
    {k === "nino" && <g><circle cx={0} cy={-26} r={30} fill="#f2b48a" /><path d="M -34 60 Q -30 4 0 4 Q 30 4 34 60 Z" fill="#7a5a3a" /><circle cx={-10} cy={-28} r={4} fill="#2a1a10" /><circle cx={10} cy={-28} r={4} fill="#2a1a10" /></g>}
    {k === "horca" && <g transform="rotate(-20)"><rect x={-6} y={-30} width={12} height={110} fill="#8a5a2a" />{[-24, 0, 24].map((x) => <rect key={x} x={x - 4} y={-80} width={8} height={56} rx={4} fill="#8a94a4" />)}<rect x={-30} y={-30} width={60} height={10} fill="#8a94a4" /></g>}
    {k === "pala" && <g transform="rotate(-20)"><rect x={-6} y={-80} width={12} height={100} fill="#8a5a2a" /><path d="M -34 20 L 34 20 L 30 70 Q 0 86 -30 70 Z" fill="#8a94a4" /></g>}
    {k === "pluma" && <g><path d="M 50 -70 Q -20 -40 -50 60 Q 0 -10 60 -60 Z" fill="#fff" stroke="#9aa" strokeWidth={4} /></g>}
  </O>
);

// tacha roja que se dibuja sobre algo (pantalla)
export const Tacha: React.FC<{ t: number; t0: number; x: number; y: number; r?: number }> = ({ t, t0, x, y, r = 120 }) => {
  if (t < t0) return null;
  const a = prog(t, t0, t0 + 0.2), b = prog(t, t0 + 0.12, t0 + 0.32);
  return (
    <svg style={{ position: "absolute", left: x - r, top: y - r, overflow: "visible" }} width={2 * r} height={2 * r}>
      <path d={`M ${r * 0.2} ${r * 0.2} L ${r * 1.8} ${r * 1.8}`} stroke={C.rojo} strokeWidth={r * 0.22} strokeLinecap="round" strokeDasharray={`${a * r * 2.4} ${r * 3}`} />
      <path d={`M ${r * 1.8} ${r * 0.2} L ${r * 0.2} ${r * 1.8}`} stroke={C.rojo} strokeWidth={r * 0.22} strokeLinecap="round" strokeDasharray={`${b * r * 2.4} ${r * 3}`} />
    </svg>
  );
};

// lupa (pantalla)
export const Lupa: React.FC<{ t: number; t0: number; x: number; y: number; r?: number; children?: React.ReactNode }> = ({ t, t0, x, y, r = 220, children }) => {
  if (t < t0) return null;
  const s = ent(t, t0);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${s}) rotate(${(1 - s) * 20}deg)` }}>
      <div style={{ width: 2 * r, height: 2 * r, borderRadius: r, overflow: "hidden", background: "#fff8e8", border: `${r * 0.1}px solid #6b3a1f`, boxShadow: "0 10px 0 rgba(20,10,40,.35)", position: "relative" }}>{children}</div>
      <div style={{ position: "absolute", left: r * 1.6, top: r * 1.6, width: r * 0.24, height: r * 0.9, background: "#6b3a1f", borderRadius: 12, transform: "rotate(-45deg)", transformOrigin: "top" }} />
    </div>
  );
};

// almacén común de la compañía (mundo)
export const Almacen: React.FC<Pos & { t: number; letrero?: string }> = ({ t, letrero = "COMMON STORE", ...p }) => (
  <O {...p} t={t} w={700} h={620}>
    <rect x={-280} y={-200} width={560} height={420} fill="#b48a5a" stroke="#5a3418" strokeWidth={10} />
    {Array.from({ length: 9 }, (_, i) => <line key={i} x1={-280 + i * 70} y1={-200} x2={-280 + i * 70} y2={220} stroke="#8a6a3a" strokeWidth={5} />)}
    <path d="M -320 -200 L 0 -330 L 320 -200 Z" fill="#7a4a24" stroke="#5a3418" strokeWidth={10} />
    <rect x={-90} y={40} width={180} height={180} fill="#3a2416" />
    <rect x={-250} y={-180} width={500} height={80} rx={10} fill="#fff3d6" stroke="#5a3418" strokeWidth={8} />
    <text x={0} y={-124} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={52} fill="#7a1a24">{letrero}</text>
  </O>
);

// carreta con caballo que cruza la calle
export const Carreta: React.FC<{ t: number; x: number; y: number; s?: number }> = ({ t, x, y, s = 1 }) => {
  const r = t * 4;
  return (
    <O x={x} y={y} s={s} w={700} h={360}>
      <rect x={-300} y={-60} width={300} height={110} rx={8} fill="#a0683a" stroke="#4e2a12" strokeWidth={6} />
      {[-240, -60].map((cx) => <g key={cx} transform={`translate(${cx} 70) rotate(${r * 57})`}><circle r={56} fill="none" stroke="#4e2a12" strokeWidth={12} />{[0, 1, 2, 3].map((k) => <line key={k} x1={0} y1={0} x2={Math.cos(k * 0.785 * 2) * 52} y2={Math.sin(k * 0.785 * 2) * 52} stroke="#4e2a12" strokeWidth={8} />)}</g>)}
      <g transform={`translate(160 ${Math.abs(Math.sin(t * 6)) * -8})`}>
        <ellipse cx={0} cy={0} rx={110} ry={50} fill="#9a5a2a" />
        <path d="M 70 -20 L 120 -120 L 160 -104 L 130 -10 Z" fill="#9a5a2a" />
        <ellipse cx={150} cy={-110} rx={40} ry={24} fill="#9a5a2a" />
        <circle cx={156} cy={-118} r={5} fill="#1a1010" />
        {[-70, -30, 40, 80].map((xx, i) => <rect key={xx} x={xx} y={36} width={18} height={76} fill="#7a4420" transform={`rotate(${Math.sin(t * 9 + i * 1.7) * 18} ${xx + 9} 36)`} />)}
        <path d="M -110 -10 Q -150 20 -130 70" stroke="#3a1e0e" strokeWidth={16} fill="none" />
      </g>
      <line x1={0} y1={0} x2={70} y2={0} stroke="#4e2a12" strokeWidth={10} />
    </O>
  );
};

// olor (líneas onduladas verdes que suben)
export const Olor: React.FC<{ t: number; x: number; y: number; color?: string }> = ({ t, x, y, color = "#8ac04a" }) => (
  <svg style={{ position: "absolute", left: x - 80, top: y - 220, overflow: "visible", pointerEvents: "none" }} width={160} height={220}>
    {[0, 1, 2].map((i) => { const k = (t * 0.8 + i / 3) % 1; return <path key={i} d={`M ${40 + i * 40} ${200 - k * 140} q 20 -20 0 -40 q -20 -20 0 -40`} stroke={color} strokeWidth={10} fill="none" strokeLinecap="round" opacity={1 - k} />; })}
  </svg>
);

// torta de fracción (1/3)
export const Torta: React.FC<{ t: number; t0: number; x: number; y: number; r?: number; frac: number; color?: string }> = ({ t, t0, x, y, r = 110, frac, color = C.violeta }) => {
  if (t < t0) return null;
  const u = prog(t, t0 + 0.1, t0 + 0.7) * frac;
  const a = u * Math.PI * 2;
  return (
    <svg style={{ position: "absolute", left: x - r - 10, top: y - r - 10, transform: `scale(${ent(t, t0)})` }} width={2 * r + 20} height={2 * r + 20}>
      <circle cx={r + 10} cy={r + 10} r={r} fill="#fff3d6" stroke={C.noche} strokeWidth={8} />
      <path d={`M ${r + 10} ${r + 10} L ${r + 10} 10 A ${r} ${r} 0 ${a > Math.PI ? 1 : 0} 1 ${r + 10 + Math.sin(a) * r} ${r + 10 - Math.cos(a) * r} Z`} fill={color} stroke={C.noche} strokeWidth={6} />
    </svg>
  );
};

// número grande que rueda (pantalla)
export const Rueda: React.FC<{ t: number; t0: number; t1: number; de: number; a: number; x: number; y: number; size?: number; color?: string; pre?: string; suf?: string }> = ({ t, t0, t1, de, a, x, y, size = 160, color = C.crema, pre = "", suf = "" }) => {
  if (t < t0) return null;
  const v = interpolate(t, [t0, t1], [de, a], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const golpe = t > t1 ? 1 + 0.15 * Math.exp(-(t - t1) * 8) : 1;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${ent(t, t0) * golpe})`, fontFamily, fontWeight: 700, fontSize: size, color, WebkitTextStroke: `${size * 0.08}px ${C.noche}`, paintOrder: "stroke fill", whiteSpace: "nowrap", textShadow: `0 ${size * 0.06}px 0 ${C.noche}` }}>
      {pre}{Math.round(v).toLocaleString("en-US")}{suf}
    </div>
  );
};

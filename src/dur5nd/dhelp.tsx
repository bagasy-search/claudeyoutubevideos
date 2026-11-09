// dhelp — piezas chicas compartidas por d8a/d8b/d8c (cielo, suelo, termómetro, número grande, gota de texto en SVG).
import React from "react";
import { useCurrentFrame } from "remotion";
import { F, INK, ez } from "./ukit";

export type UP = { d: number; p: any };
export const lp = (a: number, b: number, k: number) => a + (b - a) * k;

// cielo en degradé + suelo con horizonte (dentro de un SV)
export const Land: React.FC<{ top: string; mid: string; ground: string; gy?: number; haze?: number }> = ({ top, mid, ground, gy = 820, haze = 0 }) => {
  const f = useCurrentFrame();
  const id = `g${top.slice(1)}${ground.slice(1)}`;
  return (
    <>
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={top} /><stop offset="1" stopColor={mid} /></linearGradient></defs>
      <rect x={-200} y={-200} width={2320} height={gy + 200} fill={`url(#${id})`} />
      <rect x={-200} y={gy} width={2320} height={1080 - gy + 200} fill={ground} />
      {haze > 0 && Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M-100,${gy - 20 - i * 18} Q480,${gy - 34 - i * 18 + Math.sin(f / 9 + i) * 8} 960,${gy - 20 - i * 18} T2020,${gy - 20 - i * 18}`} stroke={`rgba(255,240,220,${0.07 * haze})`} strokeWidth={6} fill="none" />)}
    </>
  );
};

// termómetro vertical que sube hasta k (0-1)
export const Thermo: React.FC<{ x: number; y: number; h: number; k: number; col: string; label: string }> = ({ x, y, h, k, col, label }) => (
  <g>
    <rect x={x - 22} y={y - h} width={44} height={h} rx={22} fill="rgba(255,255,255,.12)" stroke={INK} strokeWidth={4} />
    <rect x={x - 12} y={y - 14 - (h - 30) * k} width={24} height={(h - 30) * k + 14} rx={12} fill={col} />
    <circle cx={x} cy={y + 18} r={40} fill={col} stroke={INK} strokeWidth={4} />
    {[0.25, 0.5, 0.75].map((t) => <line key={t} x1={x + 26} x2={x + 46} y1={y - h * t} y2={y - h * t} stroke={INK} strokeWidth={4} />)}
    <text x={x + 64} y={y - 14 - (h - 30) * k + 18} fontFamily={F} fontWeight={900} fontSize={64} fill={col}>{label}</text>
  </g>
);

// texto SVG que aparece con escala (para rótulos sobre objetos)
export const T: React.FC<{ a: number; x: number; y: number; t: string; size?: number; c?: string; anchor?: "start" | "middle" | "end"; w?: number }> = ({ a, x, y, t, size = 48, c = INK, anchor = "middle", w = 900 }) => {
  const f = useCurrentFrame(); const k = ez(f, a, a + 12);
  return <text x={x} y={y} textAnchor={anchor} fontFamily={F} fontWeight={900} fontSize={size} fill={c} opacity={k} style={{ paintOrder: "stroke" }} stroke="rgba(0,0,0,.75)" strokeWidth={size / 7} transform={`translate(${x},${y}) scale(${0.8 + 0.2 * k}) translate(${-x},${-y})`}>{t}</text>;
};

// cronómetro chico dentro de la escena (corre o se congela)
export const MiniWatch: React.FC<{ x: number; y: number; s?: number; sec: number; frozen?: boolean; col?: string }> = ({ x, y, s = 1, sec, frozen, col = "#f14536" }) => {
  const m = Math.floor(sec / 60), ss = Math.floor(sec % 60);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-18} y={-128} width={36} height={22} rx={6} fill={INK} />
      <circle r={100} fill="#0c0a09" stroke={frozen ? "#9fd8ff" : col} strokeWidth={12} />
      <line x1={0} y1={0} x2={Math.sin((sec / 60) * Math.PI * 2) * 74} y2={-Math.cos((sec / 60) * Math.PI * 2) * 74} stroke={frozen ? "#9fd8ff" : col} strokeWidth={8} strokeLinecap="round" />
      <text y={56} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={40} fill={INK} style={{ fontVariantNumeric: "tabular-nums" }}>{`${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`}</text>
      {frozen && <path d="M-70,-40 L-20,-6 L-40,30 M20,-60 L10,-10 L60,20" stroke="#dff3ff" strokeWidth={5} fill="none" />}
    </g>
  );
};

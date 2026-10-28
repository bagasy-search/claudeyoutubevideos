// lc01 · vuelta 5 (v5f, planos P44-P57 <8): piezas nuevas. Sólo las usa lc01_planos2.tsx (P44-P57).
// · SubTomas: cambio de sub-toma con fundido CORTO (6 cuadros), sin fantasma largo ni corte seco que mida como tirón
// · HumoV5 (mundo): humo de chimenea que se lee contra cualquier cielo (bocanadas grandes, núcleo oscuro + borde claro)
// · Num3230V5 (pantalla): «32°F» se tacha y SALE entero; recién después entra «−30°F» (nunca los dos a la vez)
// · GraficoFrioV5 (pantalla): las noches más frías de cada mes, 6 barras que entran rápido (3 cuadros de escalón), grande
// · Bidon (mundo): bidón de nafta rojo
// · DisplayGalones (mundo): el visor del surtidor, grande, con los galones que ruedan
// · CuelloCampera (mundo): el cuello de la campera que sube con el cierre
import React from "react";
import { AbsoluteFill, interpolate, spring, useVideoConfig } from "remotion";
import { useF } from "../../anikit/camara";
import { F_HUD } from "../../anikit/pantalla";
import { FRIO, F_MONO } from "../hud";
import { tw } from "./lc01_planos2_comp";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ---------------------------------------------------------------- sub-tomas con fundido corto
// tomas: [{desde (cuadro local), el: () => nodo}] en orden. En los primeros `fade` cuadros de cada toma, la anterior
// sigue debajo (en su movimiento) y la nueva sube de 0 a 1. Así el medidor no ve un salto y no queda fantasma.
export const SubTomas: React.FC<{ tomas: { desde: number; el: () => React.ReactNode }[]; fade?: number }> = ({ tomas, fade = 6 }) => {
  const f = useF();
  let i = 0;
  for (let j = 0; j < tomas.length; j++) if (f >= tomas[j].desde) i = j;
  const u = i === 0 ? 1 : (f - tomas[i].desde + 1) / (fade + 1);
  if (u >= 1) return <AbsoluteFill>{tomas[i].el()}</AbsoluteFill>;
  return (
    <AbsoluteFill>
      <AbsoluteFill>{tomas[i - 1].el()}</AbsoluteFill>
      <AbsoluteFill style={{ opacity: u }}>{tomas[i].el()}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- humo de chimenea (mundo). (x, y) = boca de la chimenea
export const HumoV5: React.FC<{ x: number; y: number; o?: number; oscuro?: string; claro?: string; n?: number; alto?: number }> = ({ x, y, o = 1, oscuro = "#4c4858", claro = "#d9d6e2", n = 18, alto = 330 }) => {
  const f = useF();
  if (o <= 0) return null;
  return (
    <g opacity={o}>
      {Array.from({ length: n }).map((_, i) => {
        const t = (f / 80 + i / n) % 1;
        const cx = x + t * t * 190 + Math.sin(f / 22 + i * 1.7) * 10 * t;
        const cy = y - 8 - t * alto;
        const r = 18 + t * 58;
        const a = (t < 0.1 ? t / 0.1 : 1) * (1 - t) * 0.6;
        return <g key={i} opacity={a}><circle cx={cx} cy={cy} r={r} fill={oscuro} /><circle cx={cx - r * 0.25} cy={cy - r * 0.3} r={r * 0.62} fill={claro} opacity={0.35} /></g>;
      })}
    </g>
  );
};

// ---------------------------------------------------------------- 32°F → −30°F (pantalla): uno reemplaza al otro
// `cambia`: se tacha el 32 (8 cuadros) y sale cayendo con fundido (8 cuadros); el −30 entra con resorte DESPUÉS (cambia+17)
export const Num3230V5: React.FC<{ y: number; cambia: number; desde: number; hasta?: number; rotulo?: string }> = ({ y, cambia, desde, hasta = 1e9, rotulo }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde || f > hasta + 10) return null;
  const o = Math.min(interpolate(f, [desde, desde + 10], [0, 1], CL), interpolate(f, [hasta, hasta + 10], [1, 0], CL));
  const tacha = tw(f, cambia, cambia + 8, 0, 1);
  const sale = tw(f, cambia + 8, cambia + 16, 0, 1, (t) => t * t);
  const ent = cambia + 17;
  const s = f < ent ? 0 : spring({ frame: f - ent, fps, config: { damping: 12, stiffness: 150 } });
  const txt = (t: string, c: string, tam: number) => <span style={{ fontFamily: F_HUD, fontWeight: 600, fontSize: tam, color: c, lineHeight: 1, textShadow: "0 4px 0 rgba(0,0,0,0.45), 0 0 30px rgba(0,0,0,0.35)" }}>{t}</span>;
  return (
    <div style={{ position: "absolute", left: 960, top: y, transform: "translateX(-50%)", opacity: o, textAlign: "center", whiteSpace: "nowrap" }}>
      <div style={{ position: "relative", height: 172, width: 560 }}>
        {sale < 1 && <div style={{ position: "absolute", left: "50%", top: 0, transform: `translate(-50%, ${sale * 90}px)`, opacity: 1 - sale }}>
          {txt("32°F", "#e8dcc0", 150)}
          {tacha > 0 && <div style={{ position: "absolute", left: -10, top: 66, width: `${(tacha * 104).toFixed(1)}%`, height: 14, borderRadius: 7, background: "#e2483a" }} />}
        </div>}
        {s > 0 && <div style={{ position: "absolute", left: "50%", top: 0, transform: `translateX(-50%) scale(${0.5 + 0.5 * s})`, transformOrigin: "50% 60%", opacity: Math.min(1, (f - ent) / 4) }}>{txt("−30°F", FRIO, 170)}</div>}
      </div>
      {rotulo && <div style={{ fontFamily: F_HUD, fontWeight: 600, fontSize: 36, letterSpacing: 4, color: "#f6ecd2", marginTop: 10, textShadow: "0 3px 0 rgba(0,0,0,0.5)" }}>{rotulo}</div>}
    </div>
  );
};

// ---------------------------------------------------------------- las noches más frías de cada mes (pantalla, sin caja)
// (x, y) = esquina sup-izq del gráfico en pantalla. Ancho = 6 × paso. Las barras entran de a una cada 3 cuadros.
const MESES5: [string, number, number][] = [["OCT", 18, 36], ["NOV", -2, 23], ["DEC", -20, 8], ["JAN", -30, -1], ["FEB", -26, 3], ["MAR", -12, 15]];
export const GraficoFrioV5: React.FC<{ x: number; y: number; desde: number; marca: number; hasta?: number; k?: number; paso?: number }> = ({ x, y, desde, marca, hasta = 1e9, k = 5, paso = 170 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde || f > hasta + 10) return null;
  const o = Math.min(interpolate(f, [desde, desde + 8], [0, 1], CL), interpolate(f, [hasta, hasta + 10], [1, 0], CL));
  const top = 44; // título
  const cero = 64 + 36 * k; // eje del cero (deja lugar al promedio de OCT, 36°)
  const filaMes = cero + 30 * k + 78; // los meses en una fila abajo, lejos de la línea del promedio
  void top;
  const W = paso * 6;
  const prom = tw(f, marca, marca + 18, 0, 1);
  const jan = tw(f, marca + 12, marca + 24, 0, 1);
  const sh = (t: string, xx: number, yy: number, tam: number, c: string, anchor: "start" | "middle" | "end" = "middle") => (
    <g>
      <text x={xx + 2} y={yy + 3} textAnchor={anchor} fontFamily={F_HUD} fontWeight={600} fontSize={tam} letterSpacing={2} fill="#05060c" opacity={0.8}>{t}</text>
      <text x={xx} y={yy} textAnchor={anchor} fontFamily={F_HUD} fontWeight={600} fontSize={tam} letterSpacing={2} fill={c}>{t}</text>
    </g>
  );
  const bw = paso * 0.62;
  const cx = (i: number) => i * paso + paso / 2;
  const pts = MESES5.map(([, , v], i) => [cx(i), cero - v * k] as const);
  const H = filaMes + 16;
  return (
    <svg style={{ position: "absolute", left: x, top: y, width: W, height: H, overflow: "visible", opacity: o }} viewBox={`0 0 ${W} ${H}`}>
      {sh("COLDEST NIGHTS · DULUTH (°F)", W / 2, 34, 34, "#f6ecd2")}
      <line x1={0} y1={cero} x2={W} y2={cero} stroke="#f6ecd2" strokeWidth={4} />
      {sh("0°", W + 10, cero + 10, 28, "#f6ecd2", "start")}
      {MESES5.map(([m, v], i) => {
        const a = desde + 4 + i * 3;
        const s = f < a ? 0 : spring({ frame: f - a, fps, config: { damping: 14, stiffness: 150 } });
        const h = v * k * s;
        const esJan = m === "JAN";
        const c = v < 0 ? FRIO : "#e8dcc0";
        const xx = cx(i) - bw / 2;
        return <g key={m}>
          <rect x={xx} y={h >= 0 ? cero - h : cero} width={bw} height={Math.max(3, Math.abs(h))} rx={8} fill={c} opacity={esJan ? 1 : 0.82} />
          {s > 0.5 && sh(`${v}°`, cx(i), h >= 0 ? cero - h - 12 : cero + Math.abs(h) + 34, 30, esJan ? "#ffffff" : "#f6ecd2")}
          {sh(m, cx(i), filaMes, 30, esJan ? FRIO : "#e8dcc0")}
          {esJan && jan > 0 && <rect x={xx - 12} y={cero - 4} width={bw + 24} height={Math.abs(v * k) + 52} rx={12} fill="none" stroke="#ffffff" strokeWidth={5} opacity={jan} />}
        </g>;
      })}
      {prom > 0 && <g opacity={Math.min(1, prom * 1.4)}>
        <path d={"M" + pts.slice(0, Math.max(2, Math.ceil(prom * pts.length))).map((p) => p.join(",")).join(" L")} stroke="#ffcf6e" strokeWidth={5} strokeDasharray="12 10" fill="none" />
        {pts.map((p, i) => (i / (pts.length - 1) <= prom + 0.01 ? <circle key={i} cx={p[0]} cy={p[1]} r={9} fill="#ffcf6e" stroke="#05060c" strokeWidth={3} /> : null))}
        {sh("AVERAGE LOW", pts[1][0] + 30, pts[1][1] - 24, 28, "#ffcf6e", "start")}
      </g>}
    </svg>
  );
};

// ---------------------------------------------------------------- bidón de nafta (mundo): base en (0,0), alto ~70
export const Bidon: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M-30,0 V-58 Q-30,-66 -22,-66 H14 L30,-50 V0 Z" fill="#c8322a" stroke="#1a1620" strokeWidth={4} strokeLinejoin="round" />
    <path d="M-20,-66 V-80 H4 V-66" fill="none" stroke="#1a1620" strokeWidth={6} strokeLinejoin="round" />
    <rect x={18} y={-74} width={10} height={16} rx={2} fill="#e8b43a" stroke="#1a1620" strokeWidth={3} transform="rotate(35 23 -66)" />
    <path d="M-22,-46 L18,-14 M18,-46 L-22,-14" stroke="#8e1e18" strokeWidth={5} />
  </g>
);

// ---------------------------------------------------------------- visor del surtidor (mundo), centro (x,y)
export const DisplayGalones: React.FC<{ x: number; y: number; gal: number; s?: number }> = ({ x, y, gal, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-92} y={-58} width={184} height={112} rx={12} fill="#1a1a22" stroke="#5a5a66" strokeWidth={5} />
    <rect x={-78} y={-46} width={156} height={56} rx={6} fill="#0c1a0c" />
    <text x={70} y={0} textAnchor="end" fontFamily={F_MONO} fontWeight={800} fontSize={44} fill="#7dff6a">{gal.toFixed(1)}</text>
    <text x={0} y={40} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={22} letterSpacing={3} fill="#e8dcc0">GALLONS</text>
  </g>
);

// ---------------------------------------------------------------- cuello de la campera (mundo): sube con el cierre
// (x, y) = base del cuello del personaje (hombros); u 0..1 cuánto subió; dir = hacia dónde mira
export const CuelloCampera: React.FC<{ x: number; y: number; u: number; color: string; dir?: number }> = ({ x, y, u, color, dir = 1 }) => {
  if (u <= 0.02) return null;
  const h = 34 * u;
  return (
    <g transform={`translate(${x},${y}) scale(${dir},1)`}>
      <path d={`M-30,6 Q-32,${-h} -16,${-h - 6} H22 Q34,${-h} 32,6 Z`} fill={color} stroke="#1a1620" strokeWidth={3} strokeLinejoin="round" />
      <path d={`M10,6 V${-h - 4}`} stroke="#e8dcc0" strokeWidth={3} strokeDasharray="4 3" />
      <rect x={5} y={-h - 8} width={10} height={14} rx={3} fill="#c9c4b6" stroke="#1a1620" strokeWidth={2} />
    </g>
  );
};

// lc01 · vuelta 4 (v4d, planos 44-57): componentes nuevos. Sólo los usa lc01_planos2.tsx (P44-P57).
// · Vaho: aliento que SALE de la boca en bocanadas chicas (reemplaza al disco gris que flotaba junto a la cabeza)
// · Humo4: humo de chimenea que se lee contra el cielo (oscuro de día, claro de noche)
// · CanoEstufa: une el caño a la estufa del Living (el set lo deja flotando)
// · OlaApagon: el apagón en OLA: dos versiones del mismo plano (prendido / apagado) y franjas de pantalla que se apagan
//   de izquierda a derecha, cada una con fundido de `fade` cuadros, escalonadas
// · GraficoFrio4: las noches más frías de cada mes (6 barras que bajan hasta −30) + la mínima promedio, sin caja, en el cielo
// · Numero3230: «32°F» se tacha y cae; «−30°F» entra con resorte
// · Generador (mundo): el grupo electrógeno al que Theo le tira la soga; tose humo negro y no arranca
// · NeonMuela (mundo): el cartel de neón de la ventana del dentista, que se apaga con fundido
// · PildoraNext: cartel final opaco, contraste completo
import React from "react";
import { AbsoluteFill, interpolate, spring, useVideoConfig } from "remotion";
import { useF } from "../../anikit/camara";
import { F_HUD } from "../../anikit/pantalla";
import { Halo } from "../../anikit/luz";
import { FRIO, F_MONO } from "../hud";
import { lerp, tw } from "./lc01_planos2_comp";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ---------------------------------------------------------------- aliento (mundo): chorro de bocanadas chicas desde la boca
export const Vaho: React.FC<{ x: number; y: number; dir?: number; cada?: number; o?: number }> = ({ x, y, dir = 1, cada = 46, o = 1 }) => {
  const f = useF();
  if (o <= 0) return null;
  return (
    <g opacity={o}>
      {[0, 1, 2, 3].map((i) => {
        const t = ((f + i * 7) % cada) / cada;
        if (t > 0.62) return null;
        const u = t / 0.62;
        const px = x + dir * (6 + u * 74), py = y + 4 - u * 34 + Math.sin(u * 5 + i) * 3;
        return <ellipse key={i} cx={px} cy={py} rx={3 + u * 13} ry={2 + u * 8} fill="#eef4ff" opacity={(1 - u) * 0.42} />;
      })}
    </g>
  );
};

// ---------------------------------------------------------------- humo de chimenea (mundo). (x, y) = boca de la chimenea
export const Humo4: React.FC<{ x: number; y: number; o?: number; color?: string; n?: number }> = ({ x, y, o = 1, color = "#55505e", n = 12 }) => {
  const f = useF();
  if (o <= 0) return null;
  return (
    <g opacity={o}>
      {Array.from({ length: n }).map((_, i) => {
        const t = (f / 95 + i / n) % 1;
        return <circle key={i} cx={x + t * 150 + Math.sin(f / 24 + i * 1.3) * 12} cy={y - 10 - t * 300} r={16 + t * 44} fill={color} opacity={(1 - t) * 0.62} />;
      })}
    </g>
  );
};

// ---------------------------------------------------------------- caño de la estufa del Living (mundo): tapa el hueco entre el caño y la estufa
export const CanoEstufa: React.FC<{ x?: number; piso?: number }> = ({ x = 1950, piso = 900 }) => (
  <g>
    <rect x={x - 26} y={piso - 372} width={52} height={64} fill="#1c1a20" />
    <rect x={x - 32} y={piso - 344} width={64} height={12} rx={4} fill="#2c2832" />
  </g>
);

// ---------------------------------------------------------------- apagón en ola sobre dos versiones del mismo plano
// on = el plano prendido; off = el mismo plano apagado (misma cámara). f0 = cuando se apaga la primera franja.
// n franjas de pantalla; cada una se apaga en `fade` cuadros, `paso` cuadros después de la anterior (izq → der).
export const alfaFranja = (f: number, i: number, f0: number, paso: number, fade: number) => tw(f, f0 + i * paso, f0 + i * paso + fade, 0, 1, (t) => t);
export const OlaApagon: React.FC<{ on: React.ReactNode; off: React.ReactNode; f0: number; n?: number; paso?: number; fade?: number; x0?: number; x1?: number }> = ({ on, off, f0, n = 8, paso = 5, fade = 8, x0 = 0, x1 = 1920 }) => {
  const f = useF();
  const w = (x1 - x0) / n;
  const a = Array.from({ length: n }).map((_, i) => alfaFranja(f, i, f0, paso, fade));
  // las franjas ya apagadas del todo se juntan en un solo recorte (izquierda); las que están en fundido van una por una
  let lleno = 0;
  while (lleno < n && a[lleno] >= 1) lleno++;
  const xl = lleno === n ? 1920 : x0 + lleno * w;
  return (
    <AbsoluteFill>
      {on}
      {lleno > 0 && <AbsoluteFill style={{ clipPath: `inset(0px ${(1920 - xl).toFixed(1)}px 0px 0px)` }}>{off}</AbsoluteFill>}
      {a.map((v, i) => (i < lleno || v <= 0 ? null : (
        <AbsoluteFill key={i} style={{ clipPath: `inset(0px ${(1920 - (i === n - 1 ? 1920 : x0 + (i + 1) * w)).toFixed(1)}px 0px ${(x0 + i * w).toFixed(1)}px)`, opacity: v }}>{off}</AbsoluteFill>
      )))}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- las noches más frías (pantalla, sin caja): 6 barras que bajan a −30
const MESES4: [string, number, number][] = [["OCT", 18, 36], ["NOV", -2, 23], ["DEC", -20, 8], ["JAN", -30, -1], ["FEB", -26, 3], ["MAR", -12, 15]];
export const GraficoFrio4: React.FC<{ x: number; y: number; desde: number; marca: number; hasta?: number; k?: number; escala?: number }> = ({ x, y, desde, marca, hasta = 1e9, k = 5.4, escala = 1 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde || f > hasta + 12) return null;
  const o = Math.min(interpolate(f, [desde, desde + 10], [0, 1], CL), interpolate(f, [hasta, hasta + 12], [1, 0], CL));
  const cero = 150, paso = 150, W = 900;
  const prom = tw(f, marca, marca + 16, 0, 1);
  const jan = tw(f, marca + 10, marca + 24, 0, 1);
  const sh = (t: string, xx: number, yy: number, tam: number, c: string, anchor: "start" | "middle" = "middle") => (
    <g>
      <text x={xx + 2} y={yy + 3} textAnchor={anchor} fontFamily={F_HUD} fontWeight={600} fontSize={tam} letterSpacing={2} fill="#05060c" opacity={0.75}>{t}</text>
      <text x={xx} y={yy} textAnchor={anchor} fontFamily={F_HUD} fontWeight={600} fontSize={tam} letterSpacing={2} fill={c}>{t}</text>
    </g>
  );
  const pts = MESES4.map(([, , v], i) => [40 + i * paso + 45, cero - v * k] as const);
  return (
    <svg style={{ position: "absolute", left: x, top: y, width: W, height: 420, overflow: "visible", opacity: o, transform: `scale(${escala})`, transformOrigin: "0 0" }} viewBox={`0 -60 ${W} 420`}>
      {sh("COLDEST NIGHTS · DULUTH (°F)", 0, -18, 34, "#f6ecd2", "start")}
      <line x1={0} y1={cero} x2={W - 20} y2={cero} stroke="#f6ecd2" strokeWidth={4} />
      {sh("0°", W - 4, cero + 10, 26, "#f6ecd2", "start")}
      {MESES4.map(([m, v], i) => {
        const a = desde + 8 + i * 7;
        const s = f < a ? 0 : spring({ frame: f - a, fps, config: { damping: 15, stiffness: 120 } });
        const h = v * k * s;
        const xx = 40 + i * paso;
        const esJan = m === "JAN";
        const c = v < 0 ? FRIO : "#e8dcc0";
        return <g key={m}>
          <rect x={xx} y={h >= 0 ? cero - h : cero} width={90} height={Math.max(3, Math.abs(h))} rx={8} fill={c} opacity={esJan ? 1 : 0.8} />
          {s > 0.6 && sh(`${v}°`, xx + 45, h >= 0 ? cero - h - 14 : cero + Math.abs(h) + 36, 30, esJan ? "#ffffff" : "#f6ecd2")}
          {sh(m, xx + 45, v >= 0 ? cero + 38 : cero - 14, 28, esJan ? FRIO : "#e8dcc0")}
          {esJan && jan > 0 && <rect x={xx - 12} y={cero - 4} width={114} height={Math.abs(v * k) + 58} rx={12} fill="none" stroke="#ffffff" strokeWidth={5} opacity={jan} />}
        </g>;
      })}
      {/* la mínima PROMEDIO de cada mes: línea de puntos que se dibuja */}
      {prom > 0 && <g opacity={Math.min(1, prom * 1.4)}>
        <path d={"M" + pts.slice(0, Math.max(2, Math.ceil(prom * pts.length))).map((p) => p.join(",")).join(" L")} stroke="#ffcf6e" strokeWidth={5} strokeDasharray="12 10" fill="none" />
        {pts.map((p, i) => (i / (pts.length - 1) <= prom + 0.01 ? <circle key={i} cx={p[0]} cy={p[1]} r={9} fill="#ffcf6e" stroke="#05060c" strokeWidth={3} /> : null))}
        {sh("AVERAGE LOW", pts[1][0] + 30, pts[1][1] - 22, 26, "#ffcf6e", "start")}
      </g>}
    </svg>
  );
};

// ---------------------------------------------------------------- 32°F se tacha → −30°F con resorte (pantalla)
export const Numero3230: React.FC<{ y: number; cambia: number; desde?: number; hasta?: number; rotulo?: string }> = ({ y, cambia, desde = -30, hasta = 1e9, rotulo }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde || f > hasta + 10) return null;
  const o = Math.min(interpolate(f, [desde, desde + 10], [0, 1], CL), interpolate(f, [hasta, hasta + 10], [1, 0], CL));
  const tacha = tw(f, cambia, cambia + 8, 0, 1);
  const cae = tw(f, cambia + 8, cambia + 20, 0, 1, (t) => t * t);
  const s = f < cambia + 12 ? 0 : spring({ frame: f - cambia - 12, fps, config: { damping: 11, stiffness: 150 } });
  const txt = (t: string, c: string, tam: number) => <span style={{ fontFamily: F_HUD, fontWeight: 600, fontSize: tam, color: c, lineHeight: 1, textShadow: "0 4px 0 rgba(0,0,0,0.45), 0 0 30px rgba(0,0,0,0.35)" }}>{t}</span>;
  return (
    <div style={{ position: "absolute", left: 960, top: y, transform: "translateX(-50%)", opacity: o, textAlign: "center", whiteSpace: "nowrap" }}>
      <div style={{ position: "relative", height: 170 }}>
        {cae < 1 && <div style={{ position: "absolute", left: "50%", top: 0, transform: `translate(-50%, ${cae * 260}px) rotate(${cae * 18}deg)`, opacity: 1 - cae }}>
          {txt("32°F", "#e8dcc0", 150)}
          {tacha > 0 && <div style={{ position: "absolute", left: -10, top: 70, width: `${(tacha * 104).toFixed(1)}%`, height: 14, borderRadius: 7, background: "#e2483a" }} />}
        </div>}
        {s > 0 && <div style={{ position: "absolute", left: "50%", top: 0, transform: `translateX(-50%) scale(${0.4 + 0.6 * s})` }}>{txt("−30°F", FRIO, 170)}</div>}
      </div>
      {rotulo && <div style={{ fontFamily: F_HUD, fontWeight: 600, fontSize: 36, letterSpacing: 4, color: "#f6ecd2", marginTop: 14, textShadow: "0 3px 0 rgba(0,0,0,0.5)" }}>{rotulo}</div>}
    </div>
  );
};

// ---------------------------------------------------------------- grupo electrógeno (mundo): base en (x, piso). tose humo en cada `tiros`
export const Generador: React.FC<{ x: number; piso: number; tiros: number[]; soga?: { x: number; y: number } | null }> = ({ x, piso, tiros, soga }) => {
  const f = useF();
  const y0 = piso - 150;
  const ult = tiros.filter((t) => f >= t).pop();
  const u = ult === undefined ? 1 : (f - ult) / 40;
  const sacude = ult !== undefined && f - ult < 10 ? Math.sin((f - ult) * 2.8) * (10 - (f - ult)) * 0.5 : 0;
  const mango = { x: x + 96, y: y0 + 44 };
  return (
    <g>
      <ellipse cx={x} cy={piso + 4} rx={150} ry={10} fill="#000" opacity={0.3} />
      <g transform={`translate(${sacude},0)`}>
        {[-90, 90].map((d) => <g key={d}><circle cx={x + d} cy={piso - 26} r={26} fill="#26262a" /><circle cx={x + d} cy={piso - 26} r={10} fill="#8a949a" /></g>)}
        <rect x={x - 130} y={y0} width={260} height={110} rx={10} fill="#d8a020" stroke="#1a1620" strokeWidth={5} />
        <rect x={x - 112} y={y0 + 18} width={130} height={74} rx={6} fill="#2a2630" />
        {[0, 1, 2, 3].map((i) => <rect key={i} x={x - 104 + i * 30} y={y0 + 26} width={16} height={58} rx={3} fill="#3a3640" />)}
        <rect x={x + 34} y={y0 + 20} width={80} height={40} rx={6} fill="#2a2630" />
        <circle cx={x + 52} cy={y0 + 40} r={9} fill="#5a5a66" /><circle cx={x + 82} cy={y0 + 40} r={9} fill="#5a5a66" />
        <rect x={x - 70} y={y0 - 22} width={120} height={24} rx={6} fill="#1a1620" />
        <rect x={x - 40} y={y0 - 36} width={40} height={16} rx={4} fill="#c0352c" />
        <rect x={x + 120} y={y0 + 70} width={34} height={14} rx={4} fill="#1a1620" />
      </g>
      {/* soga de arranque: del motor al mango (o a la mano de Theo) */}
      <path d={`M${mango.x},${mango.y} L${soga ? soga.x : mango.x + 22},${soga ? soga.y : mango.y + 6}`} stroke="#1a1620" strokeWidth={4} />
      <rect x={(soga ? soga.x : mango.x + 22) - 14} y={(soga ? soga.y : mango.y + 6) - 6} width={28} height={12} rx={5} fill="#c0352c" />
      {/* tos: humo negro del escape que se apaga */}
      {u < 1 && Array.from({ length: 5 }).map((_, i) => {
        const t = Math.min(1, u * (1 + i * 0.25));
        return <circle key={i} cx={x + 140 + t * (60 + i * 26)} cy={y0 + 76 - t * (40 + i * 30)} r={10 + t * (22 + i * 6)} fill="#2a2630" opacity={(1 - t) * 0.75} />;
      })}
    </g>
  );
};

// ---------------------------------------------------------------- neón de la ventana del dentista (mundo): una muela que se apaga
export const NeonMuela: React.FC<{ x: number; y: number; o: number }> = ({ x, y, o }) => {
  const c = o > 0.02 ? "#ff6aa8" : "#4a3a44";
  return (
    <g>
      <rect x={x - 70} y={y - 70} width={140} height={150} rx={8} fill="#1a1620" opacity={0.85} />
      {o > 0.02 && <Halo x={x} y={y} r={150} color="#ff6aa8" fuerza={0.55 * o} />}
      <path d={`M${x - 34},${y - 38} Q${x - 50},${y - 52} ${x - 30},${y - 56} Q${x - 14},${y - 58} ${x},${y - 46} Q${x + 14},${y - 58} ${x + 30},${y - 56} Q${x + 50},${y - 52} ${x + 34},${y - 38} Q${x + 30},${y} ${x + 22},${y + 34} Q${x + 14},${y + 46} ${x + 8},${y + 30} L${x},${y + 4} L${x - 8},${y + 30} Q${x - 14},${y + 46} ${x - 22},${y + 34} Q${x - 30},${y} ${x - 34},${y - 38} Z`}
        fill="none" stroke={c} strokeWidth={6} strokeLinejoin="round" opacity={0.35 + 0.65 * o} />
      <text x={x} y={y + 68} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={20} letterSpacing={3} fill={c} opacity={0.35 + 0.65 * o}>OPEN</text>
    </g>
  );
};

// ---------------------------------------------------------------- cartel final opaco (pantalla), contraste completo
export const PildoraNext: React.FC<{ texto: string; x: number; y: number; desde: number; tam?: number }> = ({ texto, x, y, desde, tam = 40 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 14, stiffness: 140 } });
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) translateY(${(1 - s) * 18}px)`, opacity: Math.min(1, (f - desde) / 8), fontFamily: F_HUD, fontWeight: 600, fontSize: tam, letterSpacing: 3, color: "#ffffff", whiteSpace: "nowrap", padding: "14px 34px", borderRadius: 44, background: "#0c0a14", border: "4px solid #ffcf6e", boxShadow: "0 6px 0 rgba(0,0,0,0.5)" }}>{texto}</div>
  );
};

// ---------------------------------------------------------------- helper: valor en claves lineales con easing (para luces)
export const fundidoLuz = (f: number, cl: [number, number][]) => {
  let v = cl[0][1];
  for (let i = 1; i < cl.length; i++) {
    const [fa, va] = cl[i - 1], [fb, vb] = cl[i];
    if (f >= fb) { v = vb; continue; }
    if (f > fa) return lerp(va, vb, (f - fa) / (fb - fa));
    return va;
  }
  return v;
};
export { F_MONO };

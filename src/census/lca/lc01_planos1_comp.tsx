// lc01 · componentes de la rehechura (vuelta 2) de los planos 1-29: IK de manos, insertos (cuaderno, auto, interruptor),
// sets chicos propios (corte del dúplex, la Holiday por dentro, el cuarto de la guardia, el esquema de la red) y
// recursos de concepto (multitud que se apaga, tarjetas con ícono, reloj de arena, checklist, surtidor que rueda).
import React from "react";
import { AbsoluteFill, Easing, interpolate, random, spring, useVideoConfig } from "remotion";
import { useF } from "../../anikit/camara";
import { alcanzar, huesosDe, Look, Pose } from "../../anikit/personaje";
import { F_HUD, F_MANO } from "../../anikit/pantalla";
import { Halo, Charco } from "../../anikit/luz";
import { Cielo, osc, SetProps } from "../../anikit/sets/comun";
import { AMBAR, ROJO_CENSO } from "../elenco";
import { LUCES } from "../mundo/hora";
import { F_MONO } from "../hud";

// ---------------- utilidades ----------------
export const rampa = (f: number, a: number, b: number, ease = true) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease ? Easing.inOut(Easing.cubic) : undefined });
export const entre = (f: number, a: number, b: number) => f >= a && f < b;

// IK de una mano hacia un punto del MUNDO. pos/dir/asiento del actor en ese cuadro (si es fijo, constantes).
export const manoA = (o: {
  look: Look; x: number | ((f: number) => number); y: number; esc?: number; dir?: 1 | -1 | ((f: number) => 1 | -1); lado?: "D" | "I"; asiento?: number;
  obj: (f: number) => { x: number; y: number } | null; peso: (f: number) => number; otra?: (p: Pose, f: number) => Pose;
}) => (p0: Pose, f: number): Pose => {
  const p = o.otra ? o.otra(p0, f) : p0;
  const w = o.peso(f);
  const t = o.obj(f);
  if (!t || w <= 0.001) return p;
  const esc = o.esc ?? 1;
  const ax = typeof o.x === "function" ? o.x(f) : o.x;
  const d = typeof o.dir === "function" ? o.dir(f) : o.dir ?? 1;
  const loc = { x: (t.x - ax) / (esc * d), y: (t.y - o.y) / esc };
  const lado = o.lado ?? "D";
  const r = alcanzar(p, lado, loc, o.asiento, huesosDe(o.look.estilo, o.look.alto));
  if (lado === "D") return { ...p, hD: p.hD + ((r.hD ?? p.hD) - p.hD) * w, cD: p.cD + ((r.cD ?? p.cD) - p.cD) * w };
  return { ...p, hI: p.hI + ((r.hI ?? p.hI) - p.hI) * w, cI: p.cI + ((r.cI ?? p.cI) - p.cI) * w };
};
// peso de IK: sube en [a, a+e] y baja en [b, b+e]
export const pesoIK = (a: number, b = 1e9, e = 10) => (f: number) => Math.min(rampa(f, a, a + e), 1 - rampa(f, b, b + e));

// ---------------- cocina (P02-P03) ----------------
export const Cafetera: React.FC<{ f: number; s?: number }> = ({ f, s = 1 }) => (
  <g transform={`scale(${s})`}>
    <rect x={-58} y={-12} width={116} height={12} rx={4} fill="#1d1a20" />
    <rect x={-48} y={-176} width={96} height={30} rx={8} fill="#2a2630" />
    <rect x={30} y={-176} width={18} height={176} rx={6} fill="#2a2630" />
    <path d="M-38,-104 L36,-104 L30,-14 L-32,-14 Z" fill="#9fb4c8" opacity={0.55} />
    <path d={`M-35,${-60 + 3 * Math.sin(f / 3)} L33,${-60 + 3 * Math.sin(f / 3 + 1)} L30,-14 L-32,-14 Z`} fill="#5a3218" />
    {[0, 1, 2, 3].map((k) => { const t = ((f / 9 + k / 4) % 1); return <circle key={k} cx={-20 + k * 13} cy={-20 - t * 40} r={2 + t * 3} fill="#c89a6a" opacity={0.8 * (1 - t)} />; })}
    <path d="M-38,-104 L36,-104" stroke="#2a2630" strokeWidth={6} />
    <path d="M-46,-90 q-26,8 -22,40 q4,20 22,20" stroke="#2a2630" strokeWidth={8} fill="none" />
    <circle cx={40} cy={-150} r={6} fill={Math.floor(f / 10) % 2 ? "#ff5a3a" : "#c03a2a"} />
    <Halo x={40} y={-150} r={26} color="#ff5a3a" fuerza={0.5} />
    {[0, 1, 2].map((k) => <path key={k} d={`M${-16 + k * 16},-182 q9,-14 0,-28 q-9,-14 2,-26`} stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.3 + 0.2 * Math.sin(f / 7 + k)} transform={`translate(0,${-((f * 0.8 + k * 12) % 20)})`} />)}
  </g>
);
export const RadioVieja: React.FC<{ f: number; on: number; perilla?: number }> = ({ f, on, perilla = 0 }) => (
  <g>
    <rect x={-90} y={-100} width={180} height={100} rx={14} fill="#7a4a2e" />
    <rect x={-90} y={-100} width={180} height={14} rx={7} fill="#8e5a38" />
    <rect x={-76} y={-84} width={84} height={70} rx={8} fill="#3a2a22" />
    {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={-70} y={-78 + i * 11} width={72} height={4} fill="#1d1612" />)}
    <rect x={18} y={-84} width={60} height={22} rx={4} fill={on > 0.5 ? "#ffe2a0" : "#4a3a2a"} />
    {on > 0.5 && <rect x={30 + 30 * ((f / 60) % 1)} y={-82} width={3} height={18} fill="#c0352c" />}
    <g transform={`translate(48,-34) rotate(${perilla})`}><circle r={16} fill="#e8d9b5" /><rect x={-2} y={-14} width={4} height={12} fill="#3a2a22" /></g>
    <path d="M-62,-100 L-96,-190" stroke="#2a2228" strokeWidth={4} />
    {on > 0.5 && [0, 1, 2].map((k) => { const r = 30 + ((f * 2 + k * 20) % 60); return <path key={k} d={`M${96 + r * 0.2},${-80 - r * 0.6} q${r * 0.5},${r * 0.6} 0,${r * 1.2}`} stroke={AMBAR} strokeWidth={5} fill="none" opacity={(1 - r / 90) * on} />; })}
    {on > 0.5 && [0, 1].map((k) => { const t = ((f / 40 + k / 2) % 1); return <text key={`n${k}`} x={110 + t * 60} y={-120 - t * 80 + Math.sin(f / 6 + k) * 6} fontSize={34} fill={AMBAR} opacity={(1 - t) * on} fontFamily={F_HUD}>♪</text>; })}
  </g>
);
// rejilla de calefacción en la PARED con aire caliente que sube
export const Rejilla: React.FC<{ f: number; on: number; w?: number }> = ({ f, on, w = 240 }) => (
  <g>
    <rect x={-w / 2 - 8} y={-58} width={w + 16} height={66} rx={6} fill="#a8a094" />
    <rect x={-w / 2} y={-50} width={w} height={50} rx={4} fill="#cfc8bc" />
    {Array.from({ length: Math.floor(w / 26) }).map((_, i) => <rect key={i} x={-w / 2 + 10 + i * 26} y={-44} width={12} height={38} fill="#6a645a" />)}
    {on > 0 && [0, 1, 2, 3, 4].map((k) => {
      const t = ((f / 34 + k / 5) % 1);
      return <path key={k} d={`M${-w / 2 + 30 + k * (w - 60) / 4},${-70 - t * 160} q14,-26 0,-52 q-14,-26 4,-52`} stroke="#ffb27a" strokeWidth={6} fill="none" strokeLinecap="round" opacity={on * 0.75 * Math.sin(t * Math.PI)} />;
    })}
  </g>
);

// ventana de la cocina vista desde adentro (pantalla): pared oscura con el hueco, marco, cortina y el «vos» de perfil.
// El empuje a través del vidrio: la pared crece y se desvanece entre e0 y e1.
export const VentanaInterior: React.FC<{ e0: number; e1: number; children?: React.ReactNode }> = ({ e0, e1, children }) => {
  const f = useF();
  const u = rampa(f, e0, e1);
  const s = 1 + u * 1.9;
  const o = 1 - rampa(f, e0 + (e1 - e0) * 0.45, e1);
  if (o <= 0.01) return null;
  return (
    <AbsoluteFill style={{ opacity: o, transform: `scale(${s})`, transformOrigin: "1140px 470px" }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <path fillRule="evenodd" d="M-200,-200 H2200 V1300 H-200 Z M600,120 H1700 V820 H600 Z" fill="#2b2230" />
        <path fillRule="evenodd" d="M-200,-200 H2200 V1300 H-200 Z M600,120 H1700 V820 H600 Z" fill="url(#vigrad)" />
        <defs><linearGradient id="vigrad" x1="0" x2="1"><stop offset="0" stopColor="#120f18" stopOpacity={0.7} /><stop offset="0.5" stopColor="#120f18" stopOpacity={0} /><stop offset="1" stopColor="#120f18" stopOpacity={0.5} /></linearGradient></defs>
        <rect x={588} y={108} width={1124} height={724} fill="none" stroke="#e9dfc8" strokeWidth={24} />
        <rect x={1140} y={120} width={20} height={700} fill="#e9dfc8" />
        <rect x={600} y={460} width={1100} height={16} fill="#e9dfc8" />
        <rect x={560} y={826} width={1180} height={30} rx={6} fill="#d8ccb2" />
        <path d="M600,120 Q640,300 610,560 Q660,580 700,560 Q690,300 760,120 Z" fill="#c8582b" opacity={0.85} />
        <path d="M1700,120 Q1660,300 1690,560 Q1640,580 1600,560 Q1610,300 1540,120 Z" fill="#c8582b" opacity={0.85} />
        <rect x={1240} y={770} width={60} height={56} rx={6} fill="#c9463a" /><path d="M1270,770 q-30,-60 -10,-110 M1270,770 q20,-50 50,-80 M1270,770 q0,-70 6,-120" stroke="#5a8a4a" strokeWidth={8} fill="none" />
      </svg>
      {children}
    </AbsoluteFill>
  );
};

// hoja/bolsa que cruza con el viento (coordenadas de mundo). path de f0 a f1 de (x0,y0) a (x1,y1) con remolino
export const Volador: React.FC<{ f: number; f0: number; f1: number; x0: number; y0: number; x1: number; y1: number; tipo?: "hoja" | "bolsa"; s?: number }> = ({ f, f0, f1, x0, y0, x1, y1, tipo = "hoja", s = 1 }) => {
  if (f < f0 || f > f1) return null;
  const u = (f - f0) / (f1 - f0);
  const x = x0 + (x1 - x0) * u + Math.sin(u * 9) * 40;
  const y = y0 + (y1 - y0) * u - Math.sin(u * Math.PI) * 120 + Math.cos(u * 11) * 26;
  const r = f * 9;
  return (
    <g transform={`translate(${x},${y}) rotate(${r}) scale(${s})`}>
      {tipo === "hoja" ? <path d="M0,-22 Q18,-6 0,22 Q-18,-6 0,-22 Z M0,-20 L0,24" fill="#c8682b" stroke="#7a3a1a" strokeWidth={2} /> :
        <path d={`M-28,-20 Q0,${-34 + 8 * Math.sin(f / 3)} 28,-20 L22,26 Q0,32 -22,26 Z`} fill="#eef0f2" opacity={0.85} stroke="#b8bcc4" strokeWidth={2} />}
    </g>
  );
};

// semáforo peatonal (mano roja / caminante blanco) en un poste
export const SemPeaton: React.FC<{ x: number; y: number; walk: boolean; cuenta?: number }> = ({ x, y, walk, cuenta }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-38} y={-46} width={76} height={92} rx={8} fill="#1a1620" />
    <rect x={-30} y={-38} width={60} height={76} rx={4} fill="#0c0a10" />
    {walk ? (
      <g fill="#f4f6ff"><circle cx={0} cy={-22} r={6} /><path d="M-2,-14 L4,-14 L6,4 L14,22 L8,24 L0,8 L-8,24 L-14,22 L-6,2 L-12,-2 L-8,-6 Z" /></g>
    ) : (
      <g fill="#ff6a3a"><path d="M-12,24 L-14,-4 Q-14,-10 -10,-10 L-8,-10 L-8,-22 Q-8,-27 -4,-27 Q0,-27 0,-22 L0,-24 Q0,-29 4,-29 Q8,-29 8,-24 L8,-20 Q12,-23 15,-19 L15,6 Q15,20 6,24 Z" /></g>
    )}
    <Halo x={0} y={0} r={60} color={walk ? "#f4f6ff" : "#ff6a3a"} fuerza={0.4} />
    {cuenta !== undefined && <text x={0} y={70} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={30} fill="#ff6a3a">{cuenta}</text>}
  </g>
);
// banco de la vereda con un café humeando y una correa tirada
export const BancoCafe: React.FC<{ x: number; piso: number; f: number }> = ({ x, piso, f }) => (
  <g transform={`translate(${x},${piso})`}>
    <rect x={-120} y={-74} width={240} height={14} rx={4} fill="#5a3a24" />
    <rect x={-120} y={-118} width={240} height={12} rx={4} fill="#5a3a24" /><rect x={-120} y={-100} width={240} height={10} rx={4} fill="#5a3a24" />
    {[-104, 96].map((dx) => <rect key={dx} x={dx} y={-62} width={10} height={62} fill="#1a1620" />)}
    <g transform="translate(60,-74)">
      <path d="M-14,0 L-11,-40 L11,-40 L14,0 Z" fill="#f4efe6" /><rect x={-15} y={-48} width={30} height={9} rx={3} fill="#3a2a22" /><rect x={-12} y={-30} width={24} height={12} fill={ROJO_CENSO} />
      {[0, 1].map((k) => <path key={k} d={`M${-5 + k * 10},-54 q7,-12 0,-24 q-7,-12 2,-22`} stroke="#fff" strokeWidth={3} fill="none" opacity={0.45 + 0.2 * Math.sin(f / 6 + k)} transform={`translate(0,${-((f * 0.7 + k * 10) % 14)})`} />)}
    </g>
    <path d="M-60,-74 Q-70,-30 -40,-6 Q-10,14 40,8 Q90,4 120,10" stroke="#c0352c" strokeWidth={5} fill="none" />
    <rect x={112} y={4} width={16} height={12} rx={3} fill="#8a8a92" />
  </g>
);
// luz de giro que titila (amarilla) en un auto quieto
export const Giro: React.FC<{ x: number; y: number; f: number }> = ({ x, y, f }) => {
  const on = Math.floor(f / 11) % 2 === 0;
  return <g>{on && <><circle cx={x} cy={y} r={8} fill="#ffb02a" /><Halo x={x} y={y} r={50} color="#ffb02a" fuerza={0.75} /></>}{!on && <circle cx={x} cy={y} r={7} fill="#7a5a2a" />}</g>;
};
export const Bandada: React.FC<{ f: number; x0: number; y0: number; vx?: number; n?: number; s?: number; color?: string }> = ({ f, x0, y0, vx = 7, n = 7, s = 1, color = "#2a2230" }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const x = x0 + f * vx + (i % 3) * 50 * s + random(`bx${i}`) * 40 * s, y = y0 + Math.floor(i / 2) * 26 * s + Math.sin(f / 5 + i) * 6 * s;
      const a = Math.sin(f / 2.5 + i * 1.3) * 10 * s;
      return <path key={i} d={`M${x - 16 * s},${y - a} Q${x - 6 * s},${y - 6 * s} ${x},${y} Q${x + 6 * s},${y - 6 * s} ${x + 16 * s},${y - a}`} stroke={color} strokeWidth={3.5 * s} fill="none" strokeLinecap="round" />;
    })}
  </g>
);

// ---------------- 8 · la multitud que se apaga (8 mil millones → 2) ----------------
// grilla de figuritas; se apagan en ola desde los bordes entre a y b; quedan Theo (naranja) y June (verde-agua)
export const Multitud: React.FC<{ a: number; b: number; zoomF?: number }> = ({ a, b, zoomF = 0 }) => {
  const f = useF();
  const C = 34, R = 11, W = 1920, x0 = 60, y0 = 470, dx = (W - 120) / (C - 1), dy = 52;
  const ic = 16, ir = 6; // los dos que quedan (columna 16 y 17, fila 6)
  const z = 1 + rampa(f, zoomF, zoomF + 40) * 4 * (zoomF > 0 ? 1 : 0);
  const cx = x0 + (ic + 0.5) * dx, cy = y0 + ir * dy;
  return (
    <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(${cx},${cy}) scale(${z}) translate(${-cx},${-cy})`}>
        {Array.from({ length: R }).map((_, r) => Array.from({ length: C }).map((__, c) => {
          const theo = r === ir && c === ic, june = r === ir && c === ic + 1;
          const d = Math.hypot((c - ic - 0.5) / C, (r - ir) / R * 0.6);
          const t = a + (b - a) * (1 - Math.min(1, d / 0.62)) + random(`m${r}${c}`) * 10;
          const vivo = theo || june || f < t;
          const k = theo || june ? 1 : Math.max(0, 1 - (f - t) / 6);
          const x = x0 + c * dx + (r % 2) * dx * 0.5 - (r % 2 ? dx * 0.25 : 0), y = y0 + r * dy;
          const col = theo ? "#c8582b" : june ? "#2f7f86" : ["#d8cfc0", "#bfb5a6", "#a89e90", "#cfc4b2"][(r * 7 + c) % 4];
          const e = 0.82 + (r / R) * 0.4;
          if (!vivo && k <= 0) return <g key={`${r}-${c}`} opacity={0.18}><circle cx={x} cy={y - 26 * e} r={7 * e} fill="#5a5260" /><rect x={x - 6 * e} y={y - 18 * e} width={12 * e} height={20 * e} rx={5 * e} fill="#5a5260" /></g>;
          return (
            <g key={`${r}-${c}`} opacity={0.18 + 0.82 * k}>
              {(theo || june) && f > b - 10 && <Halo x={x} y={y - 18} r={70} color={theo ? "#ff9a5a" : "#6ae0e8"} fuerza={0.6} />}
              <circle cx={x} cy={y - 26 * e} r={7 * e} fill={theo || june ? "#17100d" : col} />
              <rect x={x - 6 * e} y={y - 18 * e} width={12 * e} height={20 * e} rx={5 * e} fill={col} />
              {theo && <path d={`M${x - 8},${y - 31} Q${x},${y - 42} ${x + 8},${y - 31} Z`} fill="#b2342a" />}
            </g>
          );
        }))}
      </g>
    </svg>
  );
};

// ---------------- tarjetas con ícono (viñetas que entran con resorte) ----------------
export type Icono = "claqueta" | "lata" | "termo" | "cuenta" | "bus" | "pinta";
const IconoSVG: React.FC<{ i: Icono; f: number }> = ({ i, f }) => {
  if (i === "claqueta") return <g><rect x={-60} y={-30} width={120} height={80} rx={6} fill="#2a2630" /><g transform="rotate(-16 -60 -30)"><rect x={-60} y={-56} width={120} height={24} rx={4} fill="#2a2630" />{[0, 1, 2, 3].map((k) => <path key={k} d={`M${-50 + k * 30},-56 l18,0 l-14,24 l-18,0 Z`} fill="#f4efe6" />)}</g><text x={0} y={22} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={22} fill="#f4efe6">MOVIE</text></g>;
  if (i === "lata") return <g><rect x={-42} y={-56} width={84} height={112} rx={10} fill="#c0352c" /><rect x={-42} y={-30} width={84} height={50} fill="#f2ece0" /><ellipse cx={0} cy={-56} rx={42} ry={10} fill="#d8d2c8" /><text x={0} y={2} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={20} fill="#c0352c">BEANS</text></g>;
  if (i === "termo") return <g><rect x={-14} y={-60} width={28} height={92} rx={14} fill="#f4efe6" /><circle cx={0} cy={40} r={24} fill="#f4efe6" /><circle cx={0} cy={40} r={16} fill="#8fd3ff" /><rect x={-6} y={-20 + 10 * Math.sin(f / 20)} width={12} height={60} fill="#8fd3ff" />{[0, 60, 120].map((a) => <path key={a} d="M50,-50 l0,-30 M50,-65 l-12,-8 M50,-65 l12,-8" stroke="#dfe9ff" strokeWidth={5} strokeLinecap="round" transform={`rotate(${a} 50 -65)`} />)}</g>;
  if (i === "cuenta") return <g><rect x={-54} y={-62} width={108} height={124} rx={6} fill={ROJO_CENSO} /><rect x={-44} y={-50} width={88} height={100} rx={3} fill="#f8f2e2" /><text x={0} y={-6} textAnchor="middle" fontFamily={F_MANO} fontWeight={700} fontSize={40} fill="#1d3a8a">+ −</text><text x={0} y={36} textAnchor="middle" fontFamily={F_MANO} fontWeight={700} fontSize={40} fill="#1d3a8a">× =</text></g>;
  if (i === "bus") return <g><rect x={-70} y={-44} width={140} height={78} rx={14} fill="#2f6a8a" /><rect x={-58} y={-34} width={116} height={30} rx={4} fill="#cfe6f4" /><circle cx={-40} cy={36} r={12} fill="#1a1620" /><circle cx={40} cy={36} r={12} fill="#1a1620" /><text x={0} y={22} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={26} fill="#fff">6</text></g>;
  return <g />;
};
export const Tarjeta: React.FC<{ x: number; y: number; desde: number; hasta?: number; icono: Icono; texto: string; color?: string; tacha?: number; w?: number }> = ({ x, y, desde, hasta = 1e9, icono, texto, color = AMBAR, tacha, w = 250 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 11, stiffness: 160 } });
  const o = 1 - rampa(f, hasta - 8, hasta);
  const t = tacha !== undefined ? rampa(f, tacha, tacha + 8) : 0;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, opacity: o, transform: `translateY(${(1 - s) * 50}px) scale(${0.6 + 0.4 * s}) rotate(${(1 - s) * -8}deg)`, transformOrigin: "50% 100%" }}>
      <div style={{ background: "rgba(18,15,24,0.86)", border: `4px solid ${color}`, borderRadius: 22, padding: "16px 10px 12px", textAlign: "center", boxShadow: "0 10px 26px rgba(0,0,0,0.45)" }}>
        <svg width={160} height={140} viewBox="-80 -75 160 150" style={{ display: "block", margin: "0 auto" }}>
          <IconoSVG i={icono} f={f} />
          {t > 0 && <><path d={`M-70,-64 L${-70 + 140 * t},${-64 + 128 * t}`} stroke="#ff4a3d" strokeWidth={12} strokeLinecap="round" />{t > 0.5 && <path d={`M70,-64 L${70 - 140 * (t - 0.5) * 2},${-64 + 128 * (t - 0.5) * 2}`} stroke="#ff4a3d" strokeWidth={12} strokeLinecap="round" />}</>}
        </svg>
        <div style={{ fontFamily: F_HUD, fontWeight: 600, fontSize: 36, letterSpacing: 2, color: "#f6ecd2", marginTop: 4, whiteSpace: "nowrap" }}>{texto}</div>
      </div>
    </div>
  );
};

// reloj de arena (la pregunta «¿cuánto durarían?»): la arena cae desde `desde`
export const RelojArena: React.FC<{ x: number; y: number; desde: number; s?: number }> = ({ x, y, desde, s = 1 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde) return null;
  const e = spring({ frame: f - desde, fps, config: { damping: 12, stiffness: 120 } });
  const u = Math.min(1, (f - desde) / 260);
  return (
    <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(${x},${y}) scale(${s * e}) rotate(${(1 - e) * 30})`}>
        <Halo x={0} y={0} r={160} color={AMBAR} fuerza={0.25} />
        <rect x={-70} y={-110} width={140} height={14} rx={6} fill="#7a5032" /><rect x={-70} y={96} width={140} height={14} rx={6} fill="#7a5032" />
        {[-62, 54].map((dx) => <rect key={dx} x={dx} y={-98} width={8} height={196} fill="#5a3a24" />)}
        <path d="M-50,-96 L50,-96 Q50,-30 6,0 Q50,30 50,96 L-50,96 Q-50,30 -6,0 Q-50,-30 -50,-96 Z" fill="#dfe9ff" opacity={0.25} stroke="#f4f6ff" strokeWidth={4} />
        <path d={`M${-44 + 30 * u},${-80 + 76 * u} L${44 - 30 * u},${-80 + 76 * u} Q20,-14 0,-4 Q-20,-14 ${-44 + 30 * u},${-80 + 76 * u} Z`} fill={AMBAR} />
        <rect x={-2} y={-4} width={4} height={98} fill={AMBAR} opacity={0.9} />
        <path d={`M-46,94 Q0,${94 - 20 - 56 * u} 46,94 Z`} fill={AMBAR} />
        <text x={0} y={170} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={44} letterSpacing={4} fill="#f6ecd2">HOW LONG?</text>
      </g>
    </svg>
  );
};

// círculo dibujado a mano alrededor de un punto de PANTALLA (se traza entre desde y desde+14)
export const CirculoMano: React.FC<{ x: number; y: number; r: number; desde: number; color?: string; texto?: string }> = ({ x, y, r, desde, color = AMBAR, texto }) => {
  const f = useF();
  if (f < desde) return null;
  const u = rampa(f, desde, desde + 14);
  const L = 2 * Math.PI * r * 1.15;
  return (
    <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
      <ellipse cx={x} cy={y} rx={r * 1.15} ry={r} fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" strokeDasharray={L * 1.1} strokeDashoffset={L * 1.1 * (1 - u)} transform={`rotate(-12 ${x} ${y})`} />
      {texto && u > 0.9 && <text x={x + r * 1.2 + 20} y={y - r * 0.6} fontFamily={F_MANO} fontWeight={700} fontSize={56} fill={color} opacity={rampa(f, desde + 12, desde + 20)}>{texto}</text>}
    </svg>
  );
};

// ---------------- 13 · el dúplex en corte: el cuarto de Theo y la otra mitad vacía ----------------
export const DUP = { theo: 700, cama: 620, pared: 1180, vecino: 1700, piso: 900 };
export const DuplexCorte: React.FC<SetProps & { alba?: number; celular?: number }> = ({ capa, f, alba = 0.6, celular = 1 }) => {
  const P = DUP.piso;
  if (capa === "lejos") return <g><Cielo c={LUCES.alba.cielo} /></g>;
  if (capa === "frente") return null;
  const pared = "#4a4458", pared2 = "#3a3646";
  return (
    <g>
      {/* corte del edificio: dos cuartos, techo, entrepiso */}
      <rect x={140} y={300} width={2160} height={P - 300} fill={pared} />
      <rect x={DUP.pared} y={300} width={2300 - DUP.pared} height={P - 300} fill={pared2} />
      <rect x={120} y={276} width={2200} height={30} fill="#2a2232" />
      <path d="M100,280 L1220,60 L2340,280 Z" fill="#2a2232" />
      <rect x={DUP.pared - 14} y={300} width={28} height={P - 300} fill="#2a2232" />
      <rect x={120} y={P} width={2200} height={40} fill="#5a3a2a" />
      <rect x={120} y={P + 40} width={2200} height={400} fill="#2a2232" />
      {/* ventana de Theo con el alba */}
      <rect x={330} y={420} width={200} height={230} fill={LUCES.alba.cielo[2]} opacity={0.4 + 0.5 * alba} />
      <rect x={330} y={420} width={200} height={230} fill="none" stroke="#2a2232" strokeWidth={14} /><rect x={424} y={420} width={12} height={230} fill="#2a2232" />
      <Halo x={430} y={560} r={420} color="#ffb08a" fuerza={0.35 * alba} />
      {/* cómoda con el despertador y el gorro colgado */}
      <rect x={880} y={P - 150} width={200} height={150} fill="#6a4a32" /><rect x={870} y={P - 160} width={220} height={14} rx={4} fill="#7a5a3a" />
      <rect x={930} y={P - 200} width={70} height={42} rx={8} fill="#1d1a20" /><text x={965} y={P - 170} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={24} fill="#ff4a3d">5:58</text>
      <rect x={1040} y={P - 420} width={8} height={30} fill="#2a2232" />
      {/* cuarto vecino: cama deshecha, pantuflas, el celular que suena solo */}
      <rect x={1980} y={420} width={200} height={230} fill={LUCES.alba.cielo[2]} opacity={0.3 + 0.4 * alba} />
      <rect x={1980} y={420} width={200} height={230} fill="none" stroke="#2a2232" strokeWidth={14} /><rect x={2074} y={420} width={12} height={230} fill="#2a2232" />
      <g transform={`translate(${DUP.vecino},${P})`}>
        <rect x={-260} y={-110} width={420} height={70} rx={8} fill="#e8e2d6" />
        <rect x={-270} y={-50} width={440} height={50} fill="#6a4a32" />
        <rect x={-280} y={-200} width={30} height={200} rx={6} fill="#6a4a32" />
        <path d="M-120,-112 Q-40,-150 60,-120 Q120,-104 160,-112 L160,-96 Q60,-80 -40,-96 Z" fill="#7a8ab0" />
        <ellipse cx={-210} cy={-122} rx={44} ry={18} fill="#f4efe6" />
        <path d="M-60,-6 q20,-14 40,0 Z M-10,-4 q20,-14 40,0 Z" fill="#b07a9a" />
        <rect x={200} y={-90} width={90} height={90} fill="#5a4030" />
        <g transform="translate(245,-96)"><rect x={-18} y={-6} width={36} height={8} rx={3} fill="#111" /><rect x={-16} y={-5} width={32} height={6} fill={celular > 0 && Math.floor(f / 8) % 2 ? "#bfe6ff" : "#28303a"} />{celular > 0 && Math.floor(f / 8) % 2 === 0 && <Halo x={0} y={-2} r={50} color="#bfe6ff" fuerza={0.6} />}</g>
      </g>
    </g>
  );
};
// Theo dormido en la cama (perfil acostado, se da vuelta): bulto de frazada + cabeza en la almohada
export const TheoCama: React.FC<{ x: number; piso: number; f: number; vuelta: number; destapa?: number; gorro?: boolean; vacia?: boolean }> = ({ x, piso, f, vuelta, destapa = 0, gorro, vacia }) => {
  const r = Math.sin(f / 26) * 2;
  const b = interpolate(vuelta, [0, 0.5, 1], [0, -22, 0]);
  return (
    <g transform={`translate(${x},${piso})`}>
      <rect x={-200} y={-110} width={420} height={70} rx={8} fill="#e8e2d6" />
      <rect x={-210} y={-50} width={440} height={50} fill="#6a4a32" /><rect x={-220} y={-210} width={30} height={210} rx={6} fill="#6a4a32" />
      <ellipse cx={-150} cy={-124} rx={46} ry={18} fill="#f4efe6" />
      {!vacia && <g transform={`translate(${-148 + 8 * vuelta},${-150 + b * 0.4})`}><circle r={30} fill="#17100d" />{vuelta < 0.5 ? <path d="M-6,-4 q6,4 12,0" stroke="#fff" strokeWidth={3} fill="none" /> : <path d="M-12,-2 q6,4 12,0" stroke="#fff" strokeWidth={3} fill="none" />}<path d="M-22,-24 q22,-14 46,4" stroke="#5a3a22" strokeWidth={8} fill="none" /></g>}
      <path d={`M${-120 + destapa * 60},-114 Q${-20},${-170 + b + r} ${80},${-150 + b * 0.6 + r} Q${170},-140 ${200},-112 L200,-100 L${-120 + destapa * 60},-100 Z`} fill="#c8582b" opacity={0.95} />
      <path d={`M${-120 + destapa * 60},-114 Q-20,${-170 + b + r} 80,${-150 + b * 0.6 + r}`} stroke="#9a3f1e" strokeWidth={4} fill="none" />
      {gorro && <path d="M-60,-112 q20,-20 40,0 Z" fill="#b2342a" />}
    </g>
  );
};

// ---------------- 16 · el auto quieto: interior visto por la ventanilla ----------------
export const InteriorAuto: React.FC<{ e0?: number; mano?: number }> = ({ e0 = 0, mano }) => {
  const f = useF();
  const z = 1 + rampa(f, e0, e0 + 200, false) * 0.12;
  const llave = Math.sin(f / 7) * 8 * Math.exp(-Math.max(0, f - e0) / 90);
  const m = mano !== undefined ? rampa(f, mano, mano + 14) : 0;
  return (
    <AbsoluteFill style={{ background: "#1a1820" }}>
      <AbsoluteFill style={{ transform: `scale(${z})` }}>
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          {/* tablero y parabrisas al fondo */}
          <rect x={0} y={0} width={1920} height={1080} fill="#3a3440" />
          <path d="M1180,120 L1920,60 L1920,420 L1200,470 Z" fill="#a9bfd6" opacity={0.75} />
          <path d="M1180,470 L1920,420 L1920,640 L1160,640 Z" fill="#2a2630" />
          {/* volante */}
          <g transform="translate(1500,520)"><ellipse rx={190} ry={210} fill="none" stroke="#1a1820" strokeWidth={34} /><rect x={-170} y={-12} width={340} height={26} fill="#1a1820" /><circle r={56} fill="#24202a" /></g>
          {/* llaves puestas que se balancean */}
          <g transform={`translate(1290,610) rotate(${llave})`}><rect x={-4} y={0} width={8} height={30} fill="#9a9aa2" /><circle cx={0} cy={44} r={16} fill="none" stroke="#c9c9d0" strokeWidth={5} /><rect x={-6} y={56} width={12} height={40} rx={3} fill="#d8b24a" /><rect x={10} y={50} width={22} height={34} rx={6} fill={ROJO_CENSO} /></g>
          {/* asiento del conductor */}
          <path d="M240,1080 L300,560 Q320,420 470,400 L760,400 Q880,410 900,540 L940,1080 Z" fill="#4a4048" />
          <path d="M300,1080 L340,640 L900,640 L930,1080 Z" fill="#564a54" />
          {Array.from({ length: 5 }).map((_, i) => <rect key={i} x={340 + i * 115} y={430} width={8} height={600} fill="#3a3238" opacity={0.6} />)}
          {/* campera doblada: dos pliegues, cuello, botones y cierre */}
          <g transform="translate(610,760) rotate(-4)">
            <rect x={-230} y={-40} width={460} height={110} rx={26} fill="#5f6e4c" />
            <rect x={-230} y={-118} width={460} height={96} rx={26} fill="#6f7f5a" />
            <path d="M-230,-70 q230,-36 460,0" stroke="#4a5838" strokeWidth={6} fill="none" />
            <path d="M-120,-118 Q-40,-170 40,-150 Q110,-136 140,-118 Z" fill="#8a7a52" />
            <path d="M-110,-122 Q-30,-150 40,-140" stroke="#5a4a2a" strokeWidth={5} fill="none" />
            <rect x={-8} y={-116} width={16} height={180} fill="#cfc8b0" opacity={0.75} />
            {[-90, -30, 30].map((y) => <circle key={y} cx={50} cy={y + 20} r={9} fill="#3a3020" />)}
            <rect x={150} y={-110} width={60} height={40} rx={6} fill="#4a5838" />
          </g>
          {/* café en el portavasos, todavía con vapor */}
          <g transform="translate(1040,700)">
            <rect x={-60} y={10} width={120} height={50} rx={10} fill="#1a1820" />
            <path d="M-34,10 L-28,-80 L28,-80 L34,10 Z" fill="#f4efe6" /><rect x={-36} y={-92} width={72} height={16} rx={5} fill="#3a2a22" /><rect x={-30} y={-50} width={60} height={22} fill={ROJO_CENSO} />
            {[0, 1, 2].map((k) => <path key={k} d={`M${-14 + k * 14},-100 q10,-18 0,-36 q-10,-18 3,-32`} stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.3 + 0.18 * Math.sin(f / 8 + k)} transform={`translate(0,${-((f * 0.6 + k * 14) % 18)})`} />)}
          </g>
          {/* marco de la ventanilla (estamos mirando desde afuera) + reflejo */}
          <path fillRule="evenodd" d="M-100,-100 H2020 V1180 H-100 Z M120,160 Q160,90 300,80 L1700,60 Q1820,70 1840,180 L1860,980 L100,1000 Z" fill="#6a2f36" />
          <path d="M120,160 Q160,90 300,80 L1700,60 Q1820,70 1840,180" stroke="#4a1e24" strokeWidth={18} fill="none" />
          <path d="M300,90 L700,90 L380,990 L180,990 Z" fill="#ffffff" opacity={0.07} />
          <path d="M800,80 L900,80 L560,990 L500,990 Z" fill="#ffffff" opacity={0.05} />
          {/* la mano de Theo que se apoya en el vidrio */}
          {m > 0 && <g transform={`translate(${1500 + (1 - m) * 500},${900 + (1 - m) * 300})`} opacity={0.9}>
            <rect x={60} y={40} width={220} height={150} rx={40} fill="#c8582b" transform="rotate(-20)" />
            <path d="M-60,-40 q-10,-80 20,-90 q20,0 22,60 q6,-90 34,-90 q26,4 18,92 q16,-70 40,-66 q22,8 6,90 q20,-40 40,-30 q18,12 -14,80 q-30,60 -100,56 q-60,-6 -66,-102 Z" fill="#17100d" />
          </g>}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------- 18 · lista de lugares que se tachan ----------------
export const Checklist: React.FC<{ x: number; y: number; desde: number; items: { t: string; f: number; x?: number }[] }> = ({ x, y, desde, items }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 14, stiffness: 140 } });
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translateY(${(1 - s) * -20}px)`, opacity: s, background: "#fdf6d8", borderRadius: 8, padding: "18px 30px 14px", boxShadow: "0 10px 24px rgba(0,0,0,0.45)", transformOrigin: "0 0", rotate: "2deg" }}>
      {items.map((it, i) => {
        const vis = f >= it.f - 10;
        const t = it.x !== undefined ? rampa(f, it.x, it.x + 8) : 0;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: F_MANO, fontWeight: 700, fontSize: 46, color: "#1d3a8a", opacity: vis ? 1 : 0.25, height: 58 }}>
            <div style={{ width: 34, height: 34, border: "4px solid #1d3a8a", borderRadius: 4, position: "relative" }}>
              {t > 0 && <svg width={50} height={50} style={{ position: "absolute", left: -10, top: -12 }}><path d={`M6,6 L${6 + 38 * t},${6 + 38 * t} M44,6 L${44 - 38 * Math.max(0, t * 2 - 1)},${6 + 38 * Math.max(0, t * 2 - 1)}`} stroke="#d8382c" strokeWidth={7} strokeLinecap="round" /></svg>}
            </div>
            {it.t}
          </div>
        );
      })}
    </div>
  );
};

// ---------------- 19 · surtidor con el display que corre ----------------
export const SurtidorGrande: React.FC<{ x: number; piso: number; gal: number; usd: number; manguera?: { x: number; y: number } | null }> = ({ x, piso, gal, usd, manguera }) => (
  <g>
    <rect x={x - 70} y={piso - 300} width={140} height={300} rx={10} fill="#ece6dc" />
    <rect x={x - 70} y={piso - 300} width={140} height={30} rx={10} fill="#c0352c" />
    <text x={x} y={piso - 279} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={18} fill="#fff" letterSpacing={2}>HOLIDAY</text>
    <rect x={x - 56} y={piso - 258} width={112} height={92} rx={6} fill="#10141c" />
    <text x={x + 48} y={piso - 226} textAnchor="end" fontFamily={F_MONO} fontWeight={800} fontSize={28} fill="#7dff9a">{usd.toFixed(2)}</text>
    <text x={x - 50} y={piso - 226} fontFamily={F_HUD} fontWeight={600} fontSize={13} fill="#7dff9a" opacity={0.8}>$</text>
    <text x={x + 48} y={piso - 182} textAnchor="end" fontFamily={F_MONO} fontWeight={800} fontSize={22} fill="#ffcf6e">{gal.toFixed(3)}</text>
    <text x={x - 50} y={piso - 182} fontFamily={F_HUD} fontWeight={600} fontSize={13} fill="#ffcf6e" opacity={0.8}>GAL</text>
    <Halo x={x} y={piso - 212} r={90} color="#7dff9a" fuerza={0.18} />
    <rect x={x - 70} y={piso - 120} width={140} height={20} fill="#c0352c" />
    {[0, 1, 2].map((k) => <rect key={k} x={x - 50 + k * 36} y={piso - 150} width={28} height={18} rx={3} fill={["#2a7a4a", "#c9a32a", "#c0352c"][k]} />)}
    {/* manguera: del costado del surtidor a la pistola (en el gancho o en la mano) */}
    {(() => { const m = manguera ?? { x: x + 92, y: piso - 160 }; return <g><path d={`M${x + 70},${piso - 210} Q${x + 130},${piso - 30} ${m.x},${m.y + 30}`} stroke="#1d1a20" strokeWidth={9} fill="none" /><g transform={`translate(${m.x},${m.y})`}><rect x={-10} y={-8} width={20} height={44} rx={5} fill="#1d1a20" /><rect x={-34} y={-8} width={30} height={10} rx={3} fill="#2a2a30" /></g></g>; })()}
  </g>
);

// ---------------- 19 · la Holiday por dentro (mostrador + cafetera de filtro) ----------------
export const TIENDA = { mostrador: 1100, cafe: 1250, piso: 900 };
export const Tienda: React.FC<SetProps & { luz?: number }> = ({ capa, f, luz = 1 }) => {
  const P = TIENDA.piso;
  if (capa === "lejos") return <rect x={-2000} y={-800} width={8000} height={2400} fill="#cfc8bc" />;
  if (capa === "frente") return null;
  return (
    <g>
      <rect x={-800} y={-300} width={4000} height={P + 300} fill="#e4dccc" />
      <rect x={-800} y={P - 90} width={4000} height={90} fill="#cfc4b0" />
      <rect x={-800} y={P} width={4000} height={1000} fill="#b8b0a2" />
      {Array.from({ length: 30 }).map((_, i) => <rect key={i} x={-800 + i * 140} y={P} width={4} height={600} fill="#a49c8e" />)}
      {/* góndolas de snacks al fondo */}
      {[0, 1, 2, 3].map((r) => <g key={r}><rect x={100} y={P - 520 + r * 110} width={640} height={12} fill="#8a8a92" />{Array.from({ length: 12 }).map((_, c) => <rect key={c} x={110 + c * 52} y={P - 566 + r * 110} width={44} height={46} rx={4} fill={["#c0352c", "#e0a23a", "#2f6a8a", "#5a8a4a", "#8a4a7a"][(r * 3 + c) % 5]} />)}</g>)}
      {/* cartel */}
      <rect x={1000} y={240} width={600} height={70} rx={8} fill="#c0352c" /><text x={1300} y={290} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={40} fill="#fff" letterSpacing={6}>HOLIDAY · COFFEE</text>
      {/* mostrador */}
      <rect x={900} y={P - 210} width={760} height={210} fill="#7a3a30" />
      <rect x={890} y={P - 226} width={780} height={22} rx={5} fill="#d8cfc0" />
      {/* cafetera de filtro con jarra en la placa */}
      <g transform={`translate(${TIENDA.cafe},${P - 226})`}>
        <rect x={-80} y={-190} width={160} height={40} rx={8} fill="#1d1a20" />
        <rect x={50} y={-190} width={30} height={190} fill="#1d1a20" />
        <rect x={-70} y={-12} width={120} height={12} rx={4} fill="#2a2630" />
        <circle cx={-56} cy={-6} r={5} fill="#ff4a3d" /><Halo x={-56} y={-6} r={24} color="#ff4a3d" fuerza={0.6} />
        <path d="M-50,-120 L30,-120 Q42,-60 26,-14 L-46,-14 Q-62,-60 -50,-120 Z" fill="#9fb4c8" opacity={0.5} />
        <path d="M-56,-60 Q-58,-30 -46,-14 L26,-14 Q38,-30 36,-60 Z" fill="#4a2a14" />
        <path d="M30,-110 q30,0 30,30 q0,26 -24,30" stroke="#1d1a20" strokeWidth={9} fill="none" />
        {[0, 1, 2].map((k) => <path key={k} d={`M${-30 + k * 22},-130 q10,-16 0,-32 q-10,-16 3,-30`} stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.35 + 0.2 * Math.sin(f / 7 + k)} transform={`translate(0,${-((f * 0.8 + k * 12) % 18)})`} />)}
      </g>
      {/* registradora + vasos */}
      <rect x={1430} y={P - 300} width={150} height={74} rx={8} fill="#2a2630" /><rect x={1446} y={P - 290} width={70} height={26} fill="#7dff9a" opacity={0.6 * luz} />
      {[0, 1, 2].map((k) => <path key={k} d={`M${1000 + k * 34},${P - 226} l-4,-46 l26,0 l-4,46 Z`} fill="#f4efe6" stroke="#cfc8bc" />)}
      <Halo x={1250} y={P - 600} r={900} color="#fff8e6" fuerza={0.25} />
    </g>
  );
};

// ---------------- 20 · el cuaderno en la mesa con la MANO que escribe (inserto) ----------------
// escritura: renglones con tiempos; la mano + lápiz sigue la punta del renglón que se está escribiendo.
export type Linea2 = { t: string; desde: number; x: number; y: number; tam: number; vel?: number };
export const CuadernoEscribe: React.FC<{ lineas: Linea2[]; abre?: number; z0?: number; z1?: number; vela?: boolean; ocultaMano?: number; luz?: string }> = ({ lineas, abre = -100, z0 = 1, z1 = 1.08, vela = true, ocultaMano = 1e9, luz = "#3a2c2a" }) => {
  const f = useF();
  const z = interpolate(f, [0, 360], [z0, z1], { extrapolateRight: "clamp" });
  const ab = rampa(f, abre, abre + 16);
  // posición de la punta: renglón activo
  let tip = { x: 1500, y: 860 }, escribiendo = false;
  for (const l of lineas) {
    if (f < l.desde) break;
    const n = (f - l.desde) / (l.vel ?? 3);
    const fr = Math.min(1, n / l.t.length);
    tip = { x: l.x + fr * l.t.length * l.tam * 0.5, y: l.y + l.tam * 0.75 };
    escribiendo = fr < 1;
  }
  const mv = escribiendo ? Math.sin(f * 1.3) * 5 : 0;
  const manoIn = 1 - rampa(f, ocultaMano, ocultaMano + 16);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 55% 50%, ${luz} 0%, #0f0c14 80%)` }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "1150px 540px" }}>
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <rect x={0} y={0} width={1920} height={1080} fill="#4a2e1e" opacity={0.55} />
          {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={0} y={i * 130} width={1920} height={4} fill="#2e1c12" opacity={0.5} />)}
          {vela && <g transform="translate(480,840)"><Halo x={0} y={-220} r={520} color="#ffcf6e" fuerza={0.55 + 0.05 * Math.sin(f / 4)} /><rect x={-26} y={-180} width={52} height={180} rx={6} fill="#f2ece0" /><ellipse cx={0} cy={0} rx={70} ry={20} fill="#b8a888" /><path d={`M0,-180 q-22,-40 ${Math.sin(f / 4) * 8},-90 q22,46 0,90 Z`} fill="#ffd27a" /><rect x={-3} y={-196} width={6} height={18} fill="#2a2228" /></g>}
          <g transform="rotate(-3 1150 540)">
            <rect x={640} y={200} width={1100} height={700} rx={12} fill="#000" opacity={0.35} />
            {/* hoja izquierda (aparece al abrir) */}
            <rect x={1150 - 520 * ab} y={180} width={520 * ab} height={700} rx={10} fill="#f8f2e2" />
            {ab > 0.2 && Array.from({ length: 13 }).map((_, i) => <rect key={i} x={1170 - 520 * ab} y={260 + i * 46} width={480 * ab} height={2} fill="#9fb4d4" opacity={0.6} />)}
            {/* hoja derecha */}
            <rect x={1150} y={180} width={520} height={700} rx={10} fill="#f8f2e2" />
            {Array.from({ length: 13 }).map((_, i) => <rect key={i} x={1170} y={260 + i * 46} width={480} height={2} fill="#9fb4d4" opacity={0.6} />)}
            <rect x={1230} y={180} width={3} height={700} fill="#e09a9a" opacity={0.7} />
            {ab < 0.99 && <g transform={`translate(1150,0) scale(${Math.cos(ab * Math.PI)},1) translate(-1150,0)`}>
              <rect x={1150} y={170} width={540} height={720} rx={14} fill={ab < 0.5 ? ROJO_CENSO : "#8a2a22"} />
              {ab < 0.5 && <><rect x={1190} y={220} width={460} height={100} rx={8} fill="#f4ecd6" /><text x={1420} y={292} textAnchor="middle" fontFamily={F_MANO} fontWeight={700} fontSize={66} fill="#1d3a8a">CENSUS</text>
                <g transform="translate(1400,600) scale(1.3)"><path d="M-60,30 Q-62,-10 -20,-14 L40,-14 Q70,-12 70,20 L70,30 Z" fill="#7a4a26" />{[-50, -30, 40, 58].map((x) => <rect key={x} x={x} y={26} width={10} height={44} rx={4} fill="#5e3818" />)}<path d="M40,-14 Q60,-60 92,-46 Q110,-36 104,-18 Q96,-2 70,-4 Z" fill="#7a4a26" /><circle cx={88} cy={-36} r={5} fill="#1a120c" /><path d="M56,-44 q-30,-36 -6,-60 q4,20 18,14 q2,-22 18,-26 q-4,22 8,26 q10,-20 24,-14 q-8,30 -46,48 Z" fill="#e8c88a" /></g>
                <text x={1420} y={840} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={24} fill="#f4ecd6" opacity={0.8}>GAS · SNACKS · BAIT</text></>}
            </g>}
            <rect x={1142} y={176} width={16} height={708} rx={6} fill="#6a1e18" />
            {ab > 0.95 && lineas.map((l, i) => {
              if (f < l.desde) return null;
              const n = Math.floor((f - l.desde) / (l.vel ?? 3)) + 1;
              return <text key={i} x={l.x} y={l.y + l.tam * 0.8} fontFamily={F_MANO} fontWeight={700} fontSize={l.tam} fill="#1d3a8a">{l.t.slice(0, n)}</text>;
            })}
            {/* mano de Theo con el lápiz (manga naranja) */}
            {manoIn > 0.01 && ab > 0.95 && <g transform={`translate(${tip.x + mv + (1 - manoIn) * 600},${tip.y + Math.cos(f * 1.1) * (escribiendo ? 3 : 0) + (1 - manoIn) * 400})`}>
              <path d="M40,40 L620,420 L520,560 L-20,140 Z" fill="#c8582b" /><path d="M40,40 L620,420" stroke="#9a3f1e" strokeWidth={8} />
              <ellipse cx={30} cy={70} rx={62} ry={48} fill="#17100d" transform="rotate(30 30 70)" />
              <g transform="rotate(-38)"><rect x={-7} y={-150} width={14} height={160} fill="#e0a23a" /><rect x={-7} y={-160} width={14} height={14} fill="#e88a8a" /><path d="M-7,10 L0,30 L7,10 Z" fill="#e8d2a8" /><path d="M-3,22 L0,30 L3,22 Z" fill="#2a2228" /></g>
              <ellipse cx={4} cy={34} rx={22} ry={14} fill="#17100d" />
            </g>}
          </g>
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------- 21 · el cuaderno HOY: otra mesa, luz fría, polvo; una mano da vuelta la hoja y se ve el borde arrancado ----
export const CuadernoHoy: React.FC<{ pasa: number; zoom: number; marca: number }> = ({ pasa, zoom, marca }) => {
  const f = useF();
  const u = rampa(f, pasa, pasa + 26); // la hoja 1 gira
  const z = 1 + rampa(f, zoom, zoom + 70) * 1.15;
  const ang = u * Math.PI;
  const sx = Math.cos(ang);
  return (
    <AbsoluteFill style={{ background: "#14161e" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "1015px 560px" }}>
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          {/* mesa gris de archivo, luz fría de ventana desde la izquierda */}
          <rect x={0} y={0} width={1920} height={1080} fill="#3a3e48" />
          {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={0} y={i * 96} width={1920} height={3} fill="#2c3038" />)}
          <path d="M0,0 L760,0 L1500,1080 L0,1080 Z" fill="#cfe0ff" opacity={0.1} />
          <path d="M0,0 L420,0 L1100,1080 L0,1080 Z" fill="#cfe0ff" opacity={0.08} />
          {/* etiqueta de archivo */}
          <g transform="translate(1520,860) rotate(6)"><rect x={-130} y={-40} width={260} height={80} rx={4} fill="#efe6cc" /><text x={0} y={10} textAnchor="middle" fontFamily={F_MONO} fontWeight={700} fontSize={26} fill="#3a3e48">ITEM 001</text></g>
          <g transform="rotate(-2 1000 540)">
            <rect x={460} y={200} width={1100} height={700} rx={12} fill="#000" opacity={0.4} />
            {/* hoja izquierda (dorso de la 1) */}
            <rect x={440} y={180} width={540} height={700} rx={10} fill="#e6d8b0" />
            {/* página 3 (después de la arrancada) */}
            <rect x={1000} y={180} width={540} height={700} rx={10} fill="#e9dcb6" />
            {Array.from({ length: 13 }).map((_, i) => <rect key={i} x={1020} y={260 + i * 46} width={500} height={2} fill="#8fa0b4" opacity={0.5} />)}
            {/* restos de la hoja 2 arrancada en el lomo */}
            {u > 0.5 && <path d="M1000,186 l22,30 -14,26 20,34 -16,30 18,44 -18,40 14,52 -16,44 18,54 -14,46 16,60 -18,56 12,96 -26,0 0,-692 Z" fill="#f1e6c4" stroke="#c9b88a" strokeWidth={3} />}
            {/* hoja 1 que gira sobre el lomo */}
            <g transform={`translate(1000,0) scale(${sx},1) translate(-1000,0)`}>
              <rect x={1000} y={180} width={540} height={700} rx={10} fill={sx > 0 ? "#efe2c0" : "#e2d2a6"} />
              {sx > 0 && <>{Array.from({ length: 13 }).map((_, i) => <rect key={i} x={1020} y={260 + i * 46} width={500} height={2} fill="#8fa0b4" opacity={0.5} />)}
                <text x={1110} y={360} fontFamily={F_MANO} fontWeight={700} fontSize={92} fill="#2a3a7a" opacity={0.85}>CENSUS</text>
                <text x={1240} y={560} fontFamily={F_MANO} fontWeight={700} fontSize={150} fill="#2a3a7a" opacity={0.85}>1</text>
                <circle cx={1420} cy={760} r={60} fill="#a07a3a" opacity={0.15} /></>}
            </g>
            <rect x={992} y={176} width={16} height={708} rx={6} fill="#5a1a14" />
          </g>
          {/* polvo en el haz de luz */}
          {Array.from({ length: 40 }).map((_, i) => { const x = random(`pv${i}`) * 900 + ((f * (0.3 + random(`pw${i}`) * 0.4)) % 300), y = (random(`py${i}`) * 1080 + f * (0.4 + random(`pz${i}`) * 0.5)) % 1080; return <circle key={i} cx={x + y * 0.4} cy={y} r={1.5 + random(`pr${i}`) * 2.5} fill="#e8f0ff" opacity={0.25 + 0.3 * Math.sin(f / 10 + i)} />; })}
          {/* la mano que pasa la hoja (manga gris oscura) */}
          {(() => {
            const a = rampa(f, pasa - 30, pasa - 4), b = rampa(f, pasa + 26, pasa + 50);
            const hx = 1520 - u * 980 + (1 - a) * 500 + b * -700, hy = 520 + (1 - a) * 300 - Math.sin(u * Math.PI) * 120;
            if (a <= 0 || b >= 1) return null;
            return <g transform={`translate(${hx},${hy}) rotate(${-10 + u * 20})`}><path d="M60,10 L700,140 L680,320 L40,150 Z" fill="#4a4e5a" /><ellipse cx={40} cy={80} rx={64} ry={50} fill="#17100d" /><path d="M-10,60 q-60,-20 -70,-2 q4,18 66,30 Z" fill="#17100d" /></g>;
          })()}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------- 23 · el esquema de la red (set propio, piso 900): represa → torres → subestación → ciudad ----------------
export const ESQ = { represa: 600, torres: [1150, 1500, 1850], sub: 2250, ciudad: 2800, piso: 900 };
export const Esquema: React.FC<SetProps & { pulso?: number; ciudad?: number; turbina?: number; marcas?: number }> = ({ capa, f, pulso = 0, ciudad = 0, turbina = 1, marcas = 1 }) => {
  const P = ESQ.piso;
  if (capa === "lejos") {
    return (
      <g>
        <rect x={-2000} y={-800} width={8000} height={2400} fill="#13223a" />
        {Array.from({ length: 60 }).map((_, i) => <rect key={i} x={-1500 + i * 120} y={-800} width={2} height={2400} fill="#2a4a6a" opacity={0.35} />)}
        {Array.from({ length: 22 }).map((_, i) => <rect key={`h${i}`} x={-2000} y={-800 + i * 120} width={8000} height={2} fill="#2a4a6a" opacity={0.35} />)}
      </g>
    );
  }
  if (capa === "frente") return null;
  const L = "#cfe6ff", A = AMBAR;
  const T = ESQ.torres;
  // cable: represa → torres → sub → ciudad (catenarias)
  const pts = [{ x: ESQ.represa + 230, y: P - 330 }, ...T.map((x) => ({ x, y: P - 400 })), { x: ESQ.sub, y: P - 300 }, { x: ESQ.ciudad - 200, y: P - 260 }];
  const seg = pts.slice(1).map((b, i) => { const a = pts[i]; return `M${a.x},${a.y} Q${(a.x + b.x) / 2},${Math.max(a.y, b.y) + 60} ${b.x},${b.y}`; });
  const largo = pts.length - 1;
  return (
    <g>
      <rect x={-1500} y={P} width={8000} height={10} fill={L} opacity={0.5} />
      {/* río y represa */}
      <path d={`M${ESQ.represa - 700},${P - 120} L${ESQ.represa - 60},${P - 120} L${ESQ.represa - 60},${P} L${ESQ.represa - 700},${P} Z`} fill="#3a7ac0" opacity={0.6} />
      {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={ESQ.represa - 680 + ((f * 3 + i * 110) % 600)} y={P - 100 + (i % 3) * 30} width={60} height={4} rx={2} fill="#cfe6ff" opacity={0.6} />)}
      <path d={`M${ESQ.represa - 60},${P - 420} L${ESQ.represa + 40},${P - 420} L${ESQ.represa + 120},${P} L${ESQ.represa - 60},${P} Z`} fill="#8a96a6" stroke={L} strokeWidth={5} />
      {/* agua que cae por el vertedero */}
      {Array.from({ length: 8 }).map((_, i) => { const t = ((f / 20 + i / 8) % 1); return <path key={i} d={`M${ESQ.represa + 46 + i * 6},${P - 300 + t * 280} l10,30`} stroke="#9fd0ff" strokeWidth={6} strokeLinecap="round" opacity={1 - t * 0.6} />; })}
      <path d={`M${ESQ.represa + 120},${P - 40} L${ESQ.represa + 420},${P - 40} L${ESQ.represa + 420},${P} L${ESQ.represa + 120},${P} Z`} fill="#3a7ac0" opacity={0.5} />
      {/* casa de máquinas con turbina que gira */}
      <rect x={ESQ.represa + 140} y={P - 300} width={200} height={190} rx={8} fill="#1d3352" stroke={L} strokeWidth={5} />
      <g transform={`translate(${ESQ.represa + 240},${P - 205}) rotate(${f * 7 * turbina})`}>
        <circle r={62} fill="none" stroke={A} strokeWidth={6} />
        {Array.from({ length: 8 }).map((_, i) => <path key={i} d="M0,0 Q22,-26 8,-56" stroke={A} strokeWidth={8} fill="none" strokeLinecap="round" transform={`rotate(${i * 45})`} />)}
        <circle r={12} fill={A} />
      </g>
      {/* torres de alta tensión */}
      {T.map((x, i) => <g key={i} stroke={L} strokeWidth={6} fill="none"><path d={`M${x - 60},${P} L${x},${P - 420} L${x + 60},${P}`} /><path d={`M${x - 90},${P - 380} L${x + 90},${P - 380} M${x - 70},${P - 320} L${x + 70},${P - 320}`} /><path d={`M${x - 45},${P - 130} L${x + 30},${P - 230} M${x + 45},${P - 130} L${x - 30},${P - 230}`} /></g>)}
      {/* subestación */}
      <g stroke={L} strokeWidth={5} fill="#1d3352"><rect x={ESQ.sub - 120} y={P - 260} width={240} height={260} rx={6} />{[0, 1, 2].map((k) => <g key={k}><rect x={ESQ.sub - 96 + k * 72} y={P - 220} width={48} height={110} rx={6} /><path d={`M${ESQ.sub - 72 + k * 72},${P - 220} l0,-40`} /></g>)}</g>
      {/* ciudad */}
      {Array.from({ length: 9 }).map((_, i) => {
        const x = ESQ.ciudad - 220 + i * 90, h = 160 + ((i * 53) % 5) * 60;
        return <g key={i}><rect x={x} y={P - h} width={76} height={h} fill="#1d3352" stroke={L} strokeWidth={4} />{Array.from({ length: Math.floor(h / 50) }).map((_, r) => [0, 1].map((c) => <rect key={`${r}${c}`} x={x + 12 + c * 30} y={P - h + 16 + r * 50} width={20} height={26} fill={ciudad > (i * 7 + r * 3 + c) / 60 ? A : "#2a3a52"} />))}</g>;
      })}
      {ciudad > 0.5 && <Halo x={ESQ.ciudad + 140} y={P - 250} r={520} color={A} fuerza={0.3 * ciudad} />}
      {/* cables y el pulso de corriente */}
      {seg.map((d, i) => <path key={i} d={d} stroke={L} strokeWidth={4} fill="none" opacity={0.8} />)}
      {pulso > 0 && seg.map((d, i) => {
        const loc = pulso * largo - i;
        if (loc < 0) return null;
        return <path key={`p${i}`} d={d} stroke={A} strokeWidth={9} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="0.18 0.82" strokeDashoffset={-((f / 18 + i * 0.3) % 1)} opacity={Math.min(1, loc * 3)} />;
      })}
      {/* rótulos de cada pieza (en el cielo del esquema) */}
      {marcas > 0 && [["HYDRO DAM", ESQ.represa + 60], ["TRANSMISSION", T[1]], ["SUBSTATION", ESQ.sub], ["DULUTH", ESQ.ciudad + 140]].map(([t, x]) => <text key={t as string} x={x as number} y={P - 560} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={40} letterSpacing={4} fill={L} opacity={0.85 * marcas}>{t}</text>)}
    </g>
  );
};
// mapa del río St. Louis que se dibuja con las dos represas (pantalla)
export const MapaRio: React.FC<{ desde: number; pin1: number; pin2: number }> = ({ desde, pin1, pin2 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  const u = rampa(f, desde, desde + 40);
  const pin = (x: number, y: number, t: string, a: number, dx = 0) => {
    if (f < a) return null;
    const s = spring({ frame: f - a, fps, config: { damping: 10, stiffness: 180 } });
    return <g transform={`translate(${x},${y})`}><g transform={`translate(0,${(1 - s) * -60}) scale(${s})`}><path d="M0,0 C-26,-34 -26,-70 0,-70 C26,-70 26,-34 0,0 Z" fill={AMBAR} /><circle cx={0} cy={-48} r={10} fill="#13223a" /></g><text x={dx} y={46} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={38} letterSpacing={3} fill="#f6ecd2" opacity={s}>{t}</text></g>;
  };
  const rio = "M260,860 C420,820 520,700 700,690 C860,680 940,560 1100,540 C1240,520 1320,440 1460,420 C1560,404 1640,360 1720,300";
  return (
    <AbsoluteFill style={{ background: "#13223a" }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 17 }).map((_, i) => <rect key={i} x={i * 120} y={0} width={2} height={1080} fill="#2a4a6a" opacity={0.35} />)}
        {Array.from({ length: 10 }).map((_, i) => <rect key={`h${i}`} x={0} y={i * 120} width={1920} height={2} fill="#2a4a6a" opacity={0.35} />)}
        {/* el lago Superior arriba a la derecha */}
        <path d="M1600,0 L1920,0 L1920,420 Q1780,360 1720,300 Q1650,200 1600,0 Z" fill="#3a7ac0" opacity={0.55} />
        <text x={1800} y={120} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={34} fill="#cfe6ff" letterSpacing={3}>LAKE</text>
        <text x={1800} y={160} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={34} fill="#cfe6ff" letterSpacing={3}>SUPERIOR</text>
        <path d={rio} stroke="#5aa0e0" strokeWidth={22} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - u} />
        <text x={560} y={950} fontFamily={F_HUD} fontWeight={600} fontSize={36} fill="#9fd0ff" letterSpacing={4} opacity={u}>ST. LOUIS RIVER</text>
        {/* Duluth */}
        <g opacity={u}><circle cx={1700} cy={330} r={18} fill="#f6ecd2" /><text x={1640} y={300} textAnchor="end" fontFamily={F_HUD} fontWeight={600} fontSize={40} fill="#f6ecd2" letterSpacing={3}>DULUTH</text></g>
        {pin(700, 690, "THOMSON", pin1)}
        {pin(1100, 540, "FOND DU LAC", pin2)}
      </svg>
    </AbsoluteFill>
  );
};

// ---------------- 24 · semáforo grande en primer plano (pantalla) ----------------
export const SemaforoGrande: React.FC<{ x: number; y: number; luz: 0 | 1 | 2; s?: number }> = ({ x, y, luz, s = 1 }) => {
  const cols = ["#ff4a3d", "#ffcf3a", "#4ae08a"];
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-12} y={160} width={24} height={900} fill="#121016" />
      <rect x={-70} y={-180} width={140} height={360} rx={22} fill="#121016" />
      {[0, 1, 2].map((k) => <g key={k}><path d={`M-58,${-150 + k * 112} q58,-30 116,0`} stroke="#121016" strokeWidth={14} fill="none" /><circle cx={0} cy={-110 + k * 110} r={42} fill={k === luz ? cols[k] : "#2a2630"} />{k === luz && <Halo x={0} y={-110 + k * 110} r={170} color={cols[k]} fuerza={0.75} />}</g>)}
    </g>
  );
};

// ---------------- 26 / 29 · interruptor (ícono y mano) ----------------
export const Interruptor: React.FC<{ on: boolean; s?: number }> = ({ on, s = 1 }) => (
  <g transform={`scale(${s})`}>
    <rect x={-60} y={-90} width={120} height={180} rx={14} fill="#f2eee4" stroke="#c9c2b2" strokeWidth={4} />
    <circle cx={0} cy={-66} r={6} fill="#c9c2b2" /><circle cx={0} cy={66} r={6} fill="#c9c2b2" />
    <rect x={-22} y={-40} width={44} height={80} rx={8} fill="#d8d2c4" />
    <rect x={-18} y={on ? -38 : 2} width={36} height={36} rx={6} fill="#faf8f2" stroke="#b8b0a0" strokeWidth={3} />
  </g>
);
// cuarto de la guardia del 4º piso por dentro: ventana a la ciudad, interruptor junto a la ventana, cama vacía
export const CUARTO = { ventana: 1200, interruptor: 860, cama: 1700, piso: 900 };
export const CuartoHosp: React.FC<SetProps & { luz?: number }> = ({ capa, f, luz = 1 }) => {
  const P = CUARTO.piso;
  if (capa === "lejos") {
    return <g><Cielo c={LUCES.noche.cielo} />{Array.from({ length: 30 }).map((_, i) => <rect key={i} x={700 + i * 40} y={520 + ((i * 37) % 7) * 18} width={30} height={200} fill="#1d1a2e" />)}{Array.from({ length: 40 }).map((_, i) => <rect key={`l${i}`} x={710 + (i * 53) % 1180} y={540 + ((i * 29) % 9) * 16} width={8} height={8} fill={AMBAR} opacity={0.8} />)}</g>;
  }
  if (capa === "frente") return null;
  const pared = luz > 0.5 ? "#c8d2d6" : "#3a4048";
  return (
    <g>
      <path fillRule="evenodd" d={`M-800,-300 H3200 V${P} H-800 Z M960,260 H1440 V700 H960 Z`} fill={pared} />
      <rect x={-800} y={P - 90} width={4000} height={90} fill={osc(pared, 0.85)} />
      <rect x={-800} y={P} width={4000} height={1000} fill={luz > 0.5 ? "#9aa6aa" : "#22262c"} />
      <rect x={948} y={248} width={504} height={464} fill="none" stroke="#5a6874" strokeWidth={24} />
      <rect x={1192} y={260} width={16} height={440} fill="#5a6874" />
      <rect x={930} y={700} width={540} height={24} rx={4} fill="#8a949a" />
      <g transform={`translate(${CUARTO.interruptor},${P - 215}) scale(0.45)`}><Interruptor on={luz > 0.5} /></g>
      {luz > 0.5 && <><Halo x={1200} y={60} r={900} color="#fff6dc" fuerza={0.4} /><rect x={1100} y={-20} width={200} height={30} rx={8} fill="#fff6dc" /></>}
      <g transform={`translate(${CUARTO.cama},${P})`}>
        <rect x={-150} y={-170} width={300} height={40} rx={10} fill="#f2f0ea" /><rect x={-160} y={-130} width={320} height={14} fill="#7a8a96" />
        <rect x={-150} y={-116} width={10} height={116} fill="#5a6874" /><rect x={140} y={-116} width={10} height={116} fill="#5a6874" />
        <path d="M-140,-172 Q-110,-200 -70,-172 Z" fill="#ffffff" />
      </g>
    </g>
  );
};
// la mano en el interruptor (inserto de pantalla completa): pared, placa, mano con manga verde-agua que baja y sube la tecla
export const ManoInterruptor: React.FC<{ toques: number[] }> = ({ toques }) => {
  const f = useF();
  let on = true;
  for (const t of toques) if (f >= t) on = !on;
  const ult = toques.filter((t) => t <= f).pop() ?? -100;
  const golpeY = interpolate(f - ult, [0, 3, 8], [0, 14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const z = 1 + rampa(f, 0, 140, false) * 0.08;
  return (
    <AbsoluteFill style={{ background: on ? "#c8d2d6" : "#2a3038", transform: `scale(${z})` }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        {on && <Halo x={960} y={-100} r={1300} color="#fff6dc" fuerza={0.5} />}
        {!on && <path d="M1920,0 L1400,0 L1100,1080 L1920,1080 Z" fill="#6a7aa0" opacity={0.25} />}
        <g transform="translate(900,560) scale(2.6)"><Interruptor on={on} /></g>
        <g transform={`translate(${990},${on ? 470 + golpeY : 600 - golpeY})`}>
          <path d="M60,30 L760,-60 L800,200 L80,170 Z" fill="#2f7f86" /><path d="M60,30 L760,-60" stroke="#225f66" strokeWidth={10} />
          <ellipse cx={20} cy={90} rx={80} ry={66} fill="#17100d" />
          <path d="M-40,70 q-70,-14 -80,8 q2,22 76,32 Z" fill="#17100d" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------------- 28 · utilería de June ----------------
export const Caja: React.FC<{ t?: string; w?: number; h?: number; color?: string }> = ({ t, w = 96, h = 72, color = "#c8a878" }) => (
  <g>
    <rect x={-w / 2} y={-h} width={w} height={h} rx={4} fill={color} stroke={osc(color, 0.7)} strokeWidth={3} />
    <rect x={-w / 2} y={-h} width={w} height={10} fill={osc(color, 0.85)} />
    {t && <><rect x={-w / 2 + 10} y={-h * 0.62} width={w - 20} height={h * 0.34} rx={3} fill="#f6f1e6" /><text x={0} y={-h * 0.62 + h * 0.27} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={Math.min(20, h * 0.26)} fill="#c0352c">{t}</text></>}
  </g>
);
export const RelojPared: React.FC<{ x: number; y: number; vel: number; f: number; r?: number }> = ({ x, y, vel, f, r = 60 }) => (
  <g transform={`translate(${x},${y})`}>
    <circle r={r} fill="#f4f1ea" stroke="#3a4048" strokeWidth={8} />
    {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-2} y={-r + 8} width={4} height={10} fill="#3a4048" transform={`rotate(${i * 30})`} />)}
    <rect x={-3} y={-r * 0.55} width={6} height={r * 0.6} rx={3} fill="#2a2228" transform={`rotate(${f * vel * 0.083})`} />
    <rect x={-2} y={-r * 0.8} width={4} height={r * 0.85} rx={2} fill="#c0352c" transform={`rotate(${f * vel})`} />
    <circle r={5} fill="#2a2228" />
  </g>
);
// sábana (de cama vacía) que una mano levanta: punta en (px,py)
export const Sabana: React.FC<{ x: number; y: number; px: number; py: number; o?: number }> = ({ x, y, px, py, o = 1 }) => (
  <path d={`M${x - 120},${y} Q${x - 40},${y - 8} ${x + 40},${y - 4} L${px},${py} Q${(x + 40 + px) / 2},${(y + py) / 2 + 30} ${x - 120},${y + 26} Z`} fill="#eef2f4" stroke="#c8d0d4" strokeWidth={3} opacity={o} />
);
// líneas de calor que suben de algo tibio
export const Tibio: React.FC<{ x: number; y: number; w: number; f: number; o?: number; color?: string }> = ({ x, y, w, f, o = 1, color = "#ffb27a" }) => (
  <g opacity={o}>{[0, 1, 2].map((k) => { const t = ((f / 40 + k / 3) % 1); return <path key={k} d={`M${x - w / 2 + 20 + k * (w - 40) / 2},${y - t * 90} q10,-18 0,-36 q-10,-18 3,-34`} stroke={color} strokeWidth={5} fill="none" strokeLinecap="round" opacity={Math.sin(t * Math.PI) * 0.8} />; })}</g>
);
// faroles (encendido escalonado) — mismas piezas que Superior, para hacer la ola a mano
export const OlaFarolas: React.FC<{ xs: number[]; piso: number; f: number; f0: number; paso: number; lados?: (1 | -1)[] }> = ({ xs, piso, f, f0, paso, lados }) => (
  <g>
    {xs.map((x, i) => {
      const t = f0 + i * paso;
      const on = f < t ? 0 : f < t + 3 ? 0.5 : f < t + 5 ? 0.15 : Math.min(1, 0.6 + (f - t - 5) / 10);
      const lado = lados?.[i] ?? 1;
      return (
        <g key={i}>
          <rect x={x - 5} y={piso - 470} width={10} height={470} fill="#1a1620" />
          <path d={`M${x},${piso - 470} Q${x + lado * 30},${piso - 500} ${x + lado * 80},${piso - 488}`} stroke="#1a1620" strokeWidth={9} fill="none" />
          <path d={`M${x + lado * 60},${piso - 492} L${x + lado * 104},${piso - 486} L${x + lado * 96},${piso - 476} L${x + lado * 66},${piso - 478} Z`} fill="#1a1620" />
          <ellipse cx={x + lado * 82} cy={piso - 476} rx={18} ry={5} fill={on > 0.05 ? "#ffe9c0" : "#3a3442"} />
          {on > 0.05 && <>
            <path d={`M${x + lado * 82 - 15},${piso - 474} L${x + lado * 82 + 15},${piso - 474} L${x + lado * 82 + 210},${piso} L${x + lado * 82 - 210},${piso} Z`} fill="#ffd9a0" opacity={0.16 * on} />
            <Halo x={x + lado * 82} y={piso - 474} r={120} color="#ffd9a0" fuerza={0.6 * on} />
            <Charco x={x + lado * 82} y={piso + 30} rx={230} color="#ffd9a0" fuerza={0.42 * on} />
          </>}
        </g>
      );
    })}
  </g>
);

// ---------------- cámara sin desenfoque: empuje/paneo por transform de PANTALLA ----------------
// claves {f, z, x, y}: (x, y) = punto de la pantalla (sin zoom) que queda en el centro con zoom z. z=1 → x 960 y 540.
export type ClaveE = { f: number; z: number; x?: number; y?: number };
export const empujeEn = (k: ClaveE[], f: number) => {
  const q = (c: ClaveE) => ({ z: c.z, x: c.x ?? 960, y: c.y ?? 540 });
  if (f <= k[0].f) return q(k[0]);
  for (let i = 1; i < k.length; i++) {
    if (f < k[i].f) {
      const a = q(k[i - 1]), b = q(k[i]);
      const u = rampa(f, k[i - 1].f, k[i].f);
      const z = Math.exp(Math.log(a.z) + (Math.log(b.z) - Math.log(a.z)) * u);
      return { z, x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u };
    }
  }
  return q(k[k.length - 1]);
};
// lleva el punto de pantalla (sx, sy) a donde queda con el empuje
export const tras = (k: ClaveE[], f: number, sx: number, sy: number) => { const e = empujeEn(k, f); const z = e.z; const x = Math.min(1920 - 960 / z, Math.max(960 / z, e.x)), y = Math.min(1080 - 540 / z, Math.max(540 / z, e.y)); return { x: 960 + (sx - x) * z, y: 540 + (sy - y) * z }; };
export const Empuje: React.FC<{ k: ClaveE[]; children: React.ReactNode }> = ({ k, children }) => {
  const f = useF();
  const e = empujeEn(k, f);
  const z = e.z;
  // nunca mostrar fuera del cuadro renderizado
  const x = Math.min(1920 - 960 / z, Math.max(960 / z, e.x)), y = Math.min(1080 - 540 / z, Math.max(540 / z, e.y));
  return <AbsoluteFill style={{ transform: `translate(${960 - x * z}px,${540 - y * z}px) scale(${z})`, transformOrigin: "0 0" }}>{children}</AbsoluteFill>;
};
// cortes internos: el elemento cuyo cuadro de inicio es el último ≤ f
export const Cortes: React.FC<{ en: [number, React.ReactNode][] }> = ({ en }) => {
  const f = useF();
  let el: React.ReactNode = en[0][1];
  for (const [a, e] of en) if (f >= a) el = e;
  return <>{el}</>;
};
// pared lisa de cocina con zócalo (para el inserto de la rejilla)
export const PARED_PISO = 900;
export const ParedCocina: React.FC<SetProps & { tono?: string }> = ({ capa, tono = "#e9d8b8" }) => {
  const P = PARED_PISO;
  if (capa === "lejos") return <rect x={-2000} y={-800} width={8000} height={2400} fill={tono} />;
  if (capa === "frente") return null;
  return (
    <g>
      <rect x={-1000} y={-400} width={5000} height={P + 400} fill={tono} />
      {Array.from({ length: 40 }).map((_, i) => <rect key={i} x={-1000 + i * 120} y={-400} width={3} height={P + 400} fill={osc(tono, 0.95)} />)}
      <rect x={-1000} y={P - 46} width={5000} height={46} fill="#c9b08a" />
      <rect x={-1000} y={P - 50} width={5000} height={6} fill="#a88a62" />
      <rect x={-1000} y={P} width={5000} height={600} fill="#8a6a4a" />
      {Array.from({ length: 30 }).map((_, i) => <rect key={i} x={-1000 + i * 180} y={P} width={4} height={600} fill="#6a4e36" />)}
      <g transform="translate(1340,600)"><rect x={-22} y={-34} width={44} height={68} rx={6} fill="#f4efe6" stroke="#c9c2b2" strokeWidth={3} /><rect x={-8} y={-20} width={4} height={12} fill="#6a645a" /><rect x={4} y={-20} width={4} height={12} fill="#6a645a" /><rect x={-8} y={8} width={4} height={12} fill="#6a645a" /><rect x={4} y={8} width={4} height={12} fill="#6a645a" /></g>
      <g transform="translate(700,470)"><rect x={-110} y={-80} width={220} height={160} rx={6} fill="#6a4a32" /><rect x={-96} y={-66} width={192} height={132} fill="#f4e8cc" /><circle cx={-30} cy={0} r={30} fill="#e0a23a" /><path d="M-90,60 L-20,-10 L30,40 L60,10 L92,60 Z" fill="#5a8a4a" /></g>
    </g>
  );
};

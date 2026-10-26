import React from "react";
import { AbsoluteFill } from "remotion";
import { rnd } from "../soot/lib";
import { C, fontFamily, ent, prog } from "./kit";

// Kit v4 (ojo del director, 26-oct): LUGARES fijos del mundo (en vez de fondos de rayos), poses de ACCIÓN en loop para la
// Persona, el TABLERO del viaje con las 7 trampas y el contador de edad. Todo SVG, cero imágenes.

// ── poses de acción: devuelven ángulos de hombro/codo (bI, bD, cI, cD) + inclinación del cuerpo para Persona
export type Accion = "cavar" | "martillar" | "golpear" | "comer" | "escribir" | "saludar" | "cargar" | "empujar" | "lanzar" | "apunalar" | "moler" | "barrer" | "temblar" | "festejar" | "contar";
export const pose = (a: Accion, t: number, vel = 1) => {
  const f = t * vel;
  const s = Math.sin(f * Math.PI * 2), c = Math.cos(f * Math.PI * 2);
  switch (a) {
    case "cavar": return { bI: 60 + s * 35, bD: 40 + s * 40, cI: 40, cD: 60 + c * 20, inclina: 10 + s * 6 };
    case "martillar": return { bI: 30, cI: 60, bD: 120 + s * 50, cD: 30 + Math.max(0, s) * 50, inclina: 2 };
    case "golpear": { const k = (f % 1); const g = k < 0.35 ? k / 0.35 : 1 - (k - 0.35) / 0.65; return { bI: 40, cI: 70, bD: 160 - g * 130, cD: 20 + g * 20, inclina: -2 + g * 8 }; }
    case "comer": return { bI: 30, cI: 90, bD: 60 + Math.max(0, s) * 60, cD: 110 + Math.max(0, s) * 30, inclina: 0 };
    case "escribir": return { bI: 40, cI: 80, bD: 50 + s * 6, cD: 85 + c * 10, inclina: 6 };
    case "saludar": return { bI: 10, cI: 10, bD: 150 + s * 18, cD: 20 + s * 10, inclina: 0 };
    case "cargar": return { bI: 170, cI: 20, bD: 170, cD: 20, inclina: 4 + s * 2 };
    case "empujar": return { bI: 90 + s * 6, cI: 15, bD: 85 + s * 6, cD: 15, inclina: 14 };
    case "lanzar": { const k = Math.min(1, f % 1.6); return { bI: 50, cI: 30, bD: k < 0.5 ? 150 + k * 40 : 170 - (k - 0.5) * 220, cD: 20, inclina: k < 0.5 ? -8 : 10 }; }
    case "apunalar": { const k = (f % 1); const g = k < 0.25 ? k / 0.25 : Math.max(0, 1 - (k - 0.25) / 0.5); return { bI: 70, cI: 60, bD: 40 + g * 50, cD: 80 - g * 75, inclina: 4 + g * 8 }; }
    case "moler": return { bI: 75 + c * 20, cI: 70 + s * 25, bD: 75 - c * 20, cD: 70 - s * 25, inclina: 10 };
    case "barrer": return { bI: 50 + s * 25, cI: 30, bD: 30 + s * 25, cD: 40, inclina: 8 };
    case "temblar": return { bI: 120, cI: 125, bD: 120, cD: 125, inclina: Math.sin(t * 40) * 1.5 };
    case "festejar": return { bI: 160 + s * 12, cI: 10, bD: 160 - s * 12, cD: 10, inclina: 0 };
    case "contar": return { bI: 30, cI: 100, bD: 70 + Math.max(0, s) * 15, cD: 100, inclina: 4 };
  }
};

// ── cielo con nubes que se mueven
export const Nubes: React.FC<{ t: number; n?: number; seed?: number; y?: number; color?: string; vel?: number; op?: number }> = ({ t, n = 6, seed = 1, y = 80, color = "#fff", vel = 12, op = 0.95 }) => {
  const r = rnd(seed);
  const ns = Array.from({ length: n }, () => ({ x: r() * 2200, y: y + r() * 220, s: 0.6 + r() * 0.9 }));
  return (
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      {ns.map((c, i) => {
        const x = ((c.x + t * vel * c.s) % 2400) - 240;
        return (
          <g key={i} transform={`translate(${x} ${c.y}) scale(${c.s})`} fill={color} opacity={op}>
            <ellipse cx={0} cy={0} rx={110} ry={42} /><circle cx={-40} cy={-24} r={44} /><circle cx={30} cy={-36} r={56} /><circle cx={80} cy={-8} r={36} />
          </g>
        );
      })}
    </svg>
  );
};

// estandarte rojo con corona de laurel que flamea
export const Estandarte: React.FC<{ x: number; y: number; s?: number; t: number; f?: number }> = ({ x, y, s = 1, t, f = 0 }) => {
  const o = Math.sin(t * 3 + f) * 8;
  return (
    <svg style={{ position: "absolute", left: x - 60 * s, top: y - 330 * s, overflow: "visible" }} width={120 * s} height={340 * s} viewBox="0 0 120 340">
      <rect x={56} y={0} width={8} height={340} fill="#6b3a1f" />
      <rect x={18} y={20} width={84} height={8} rx={4} fill="#c98f2a" />
      <path d={`M 22 28 L 98 28 L ${98 + o * 0.4} 170 Q 60 ${186 + o} ${22 + o * 0.4} 170 Z`} fill="#c81d2e" />
      <path d={`M 22 28 L 40 28 L ${40 + o * 0.3} 176 Q 30 178 ${22 + o * 0.4} 170 Z`} fill="#9e1222" />
      <g transform={`translate(${60 + o * 0.2} 100)`} stroke="#f7c548" strokeWidth={5} fill="none" strokeLinecap="round">
        <path d="M -6 30 Q -30 10 -18 -28" /><path d="M 6 30 Q 30 10 18 -28" />
        {[-20, -8, 4].map((yy, i) => <g key={i}><path d={`M -22 ${yy} q -10 -4 -12 -12`} /><path d={`M 22 ${yy} q 10 -4 12 -12`} /></g>)}
      </g>
    </svg>
  );
};

// carpa de cuero (contubernium)
export const Carpa: React.FC<{ x: number; y: number; s?: number; tono?: string }> = ({ x, y, s = 1, tono = "#d9b27a" }) => (
  <svg style={{ position: "absolute", left: x - 130 * s, top: y - 150 * s, overflow: "visible" }} width={260 * s} height={150 * s} viewBox="0 0 260 150">
    <path d="M 10 150 L 130 12 L 250 150 Z" fill={tono} />
    <path d="M 130 12 L 250 150 L 170 150 Z" fill="rgba(80,40,10,.22)" />
    <path d="M 104 150 L 130 70 L 156 150 Z" fill="#5a3418" />
    {[50, 90, 170, 210].map((xx) => <line key={xx} x1={130} y1={12} x2={xx} y2={150} stroke="rgba(90,50,20,.25)" strokeWidth={3} />)}
    <line x1={130} y1={12} x2={130} y2={-6} stroke="#5a3418" strokeWidth={6} />
  </svg>
);

// torre de vigilancia de madera
export const Torre: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <svg style={{ position: "absolute", left: x - 90 * s, top: y - 420 * s, overflow: "visible" }} width={180 * s} height={420 * s} viewBox="0 0 180 420">
    {[30, 150].map((xx) => <rect key={xx} x={xx - 8} y={90} width={16} height={330} fill="#7a4a22" />)}
    {[160, 250, 340].map((yy) => <g key={yy}><line x1={30} y1={yy} x2={150} y2={yy + 80} stroke="#6b3a1f" strokeWidth={9} /><line x1={150} y1={yy} x2={30} y2={yy + 80} stroke="#6b3a1f" strokeWidth={9} /></g>)}
    <rect x={8} y={70} width={164} height={70} fill="#9a6232" />
    {[24, 52, 80, 108, 136].map((xx) => <rect key={xx} x={xx} y={78} width={14} height={54} fill="#7a4a22" />)}
    <path d="M -4 74 L 90 8 L 184 74 Z" fill="#8a3a1e" />
    <rect x={86} y={-30} width={6} height={40} fill="#6b3a1f" /><path d="M 92 -30 L 130 -20 L 92 -10 Z" fill="#c81d2e" />
  </svg>
);

// empalizada continua de troncos con punta
export const Empalizada: React.FC<{ y: number; x0?: number; x1?: number; alto?: number; color?: string; color2?: string }> = ({ y, x0 = -40, x1 = 1960, alto = 150, color = "#a0682e", color2 = "#7a4a22" }) => {
  const n = Math.ceil((x1 - x0) / 34);
  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
      {Array.from({ length: n }, (_, i) => { const x = x0 + i * 34; return <path key={i} d={`M ${x} ${y} L ${x} ${y - alto} L ${x + 15} ${y - alto - 22} L ${x + 30} ${y - alto} L ${x + 30} ${y} Z`} fill={i % 2 ? color : color2} />; })}
      <rect x={x0} y={y - alto * 0.62} width={x1 - x0} height={10} fill="#5a3418" opacity={0.7} />
    </svg>
  );
};

// fila de legionarios lejanos (silueta simple, barata de renderizar)
export const FilaLejana: React.FC<{ y: number; x0: number; n: number; paso?: number; s?: number; t: number; marcha?: number; color?: string }> = ({ y, x0, n, paso = 46, s = 1, t, marcha = 0, color }) => (
  <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
    {Array.from({ length: n }, (_, i) => {
      const b = marcha ? Math.abs(Math.sin(t * marcha * Math.PI + i)) * -4 : 0;
      const x = x0 + i * paso * s + (marcha ? t * 30 * marcha : 0);
      return (
        <g key={i} transform={`translate(${x} ${y + b}) scale(${s})`}>
          <rect x={-9} y={-56} width={18} height={34} rx={6} fill={color ?? "#a3202f"} />
          <rect x={-9} y={-52} width={18} height={14} fill={color ?? "#b9c2cf"} />
          <circle cx={0} cy={-66} r={10} fill={color ?? "#e8b48a"} />
          <path d="M -11 -68 Q 0 -84 11 -68 Z" fill={color ?? "#d9962e"} />
          <rect x={-7} y={-22} width={5} height={22} fill={color ?? "#6b3a1f"} /><rect x={2} y={-22} width={5} height={22} fill={color ?? "#6b3a1f"} />
          <rect x={10} y={-50} width={14} height={30} rx={3} fill={color ?? "#c81d2e"} />
          <line x1={-14} y1={-92} x2={-14} y2={0} stroke={color ?? "#5a3418"} strokeWidth={3} />
        </g>
      );
    })}
  </svg>
);

// ── LUGARES (fondos completos del mundo). Todos aceptan `dx` (paneo de cámara en px) para viajar sin cortar.
type LugarP = { t: number; dx?: number; hora?: "dia" | "tarde" | "noche" };
const cielo = (h: LugarP["hora"]) => h === "noche" ? "linear-gradient(180deg,#0e0a2a,#1b1240 40%,#3a2a78 100%)" : h === "tarde" ? "linear-gradient(180deg,#3a2a78,#a8417a 45%,#ff9a4d 80%,#ffd27a)" : "linear-gradient(180deg,#3b9be0,#7cc4f0 45%,#c8ecf8 80%,#fff3d6)";

// campamento/fuerte de legión: el MISMO lugar de la miniatura (empalizada, torre, carpas, estandartes)
export const Campamento: React.FC<LugarP & { tropa?: boolean }> = ({ t, dx = 0, hora = "dia", tropa = true }) => (
  <AbsoluteFill style={{ background: cielo(hora) }}>
    {hora === "noche" ? null : <Nubes t={t} seed={3} op={hora === "tarde" ? 0.35 : 0.95} />}
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      <path d={`M -100 640 Q 300 ${560} 700 620 T 1500 600 T 2200 630 L 2200 1080 L -100 1080 Z`} fill={hora === "noche" ? "#241a52" : hora === "tarde" ? "#7a3a6a" : "#9cc98a"} transform={`translate(${-dx * 0.2} 0)`} />
    </svg>
    <div style={{ position: "absolute", inset: 0, transform: `translateX(${-dx * 0.5}px)` }}>
      <Empalizada y={700} alto={120} color={hora === "noche" ? "#4a3060" : "#b07a3e"} color2={hora === "noche" ? "#3a2450" : "#8a5a2a"} x0={-400} x1={2600} />
      <Torre x={140} y={710} s={0.9} /><Torre x={1820} y={710} s={0.9} />
      {[300, 520, 760, 1180, 1420, 1640].map((x, i) => <Carpa key={x} x={x} y={790 + (i % 2) * 14} s={0.7} tono={hora === "noche" ? "#7a6a8a" : "#e0bc84"} />)}
    </div>
    <div style={{ position: "absolute", inset: 0, transform: `translateX(${-dx * 0.8}px)` }}>
      {[230, 610, 1310, 1700].map((x, i) => <Estandarte key={x} x={x} y={880} s={0.85} t={t} f={i} />)}
      {tropa && <FilaLejana y={890} x0={380} n={14} paso={48} s={1.1} t={t} />}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 880, bottom: 0, background: hora === "noche" ? "linear-gradient(180deg,#2e2246,#1a1230)" : "linear-gradient(180deg,#d9a35a,#a8692e)" }} />
  </AbsoluteFill>
);

// pueblo polvoriento de Galia/Hispania
export const Pueblo: React.FC<LugarP> = ({ t, dx = 0, hora = "dia" }) => {
  const r = rnd(7);
  const casas = Array.from({ length: 7 }, (_, i) => ({ x: i * 340 - 60 + r() * 60, s: 0.9 + r() * 0.5, tono: ["#f0c08a", "#e8b07a", "#f2c89a", "#ead2a8"][i % 4], techo: ["#b5552c", "#a8452c", "#c46a3a"][i % 3] }));
  return (
    <AbsoluteFill style={{ background: hora === "tarde" ? cielo("tarde") : "linear-gradient(180deg,#f2ae62,#f7c98a 50%,#fde3b4)" }}>
      <Nubes t={t} seed={9} color="#fff1d6" op={0.6} />
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${-dx * 0.6}px)` }}>
        {casas.map((c, i) => (
          <svg key={i} style={{ position: "absolute", left: c.x, top: 800 - 220 * c.s, overflow: "visible" }} width={260 * c.s} height={220 * c.s} viewBox="0 0 260 220">
            <rect x={20} y={90} width={220} height={130} fill={c.tono} /><rect x={160} y={90} width={80} height={130} fill="rgba(60,20,30,.15)" />
            <path d="M 0 96 L 130 26 L 260 96 Z" fill={c.techo} /><path d="M 0 96 L 260 96 L 252 106 L 8 106 Z" fill="rgba(0,0,0,.15)" />
            <rect x={100} y={140} width={56} height={80} rx={26} fill="#5a3418" /><rect x={42} y={122} width={38} height={34} rx={5} fill="#5a3418" />
            {i % 2 === 0 && <rect x={180} y={30} width={18} height={44} fill="#9a6a4a" />}
          </svg>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 790, bottom: 0, background: "linear-gradient(180deg,#d39a5a,#a8692e)" }} />
    </AbsoluteFill>
  );
};

// ruta romana de adoquines con mojones que pasan (para marchar)
export const Ruta: React.FC<LugarP & { avance?: number; verde?: boolean }> = ({ t, dx = 0, hora = "dia", avance = 0, verde = true }) => {
  const off = avance % 600;
  return (
    <AbsoluteFill style={{ background: cielo(hora) }}>
      {hora !== "noche" && <Nubes t={t} seed={5} op={hora === "tarde" ? 0.3 : 0.9} />}
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <path d="M -100 620 Q 400 520 900 600 T 2000 580 L 2000 1080 L -100 1080 Z" fill={verde ? "#7fb86a" : "#d8a060"} transform={`translate(${-(avance * 0.1) % 400} 0)`} />
        <path d="M -100 700 Q 500 640 1000 690 T 2100 680 L 2100 1080 L -100 1080 Z" fill={verde ? "#5f9a4a" : "#c4874a"} />
        <rect x={0} y={860} width={1920} height={130} fill="#9a8a78" />
        {Array.from({ length: 34 }, (_, i) => <rect key={i} x={((i * 64 - avance) % 2176 + 2176) % 2176 - 128} y={866 + (i % 2) * 60} width={58} height={56} rx={10} fill={i % 3 ? "#b4a48e" : "#a8977f"} />)}
        <rect x={0} y={990} width={1920} height={90} fill={verde ? "#4f8a3c" : "#b07a40"} />
      </svg>
      {[0, 1, 2, 3].map((k) => { const x = 300 + k * 600 - off - dx * 0; return <div key={k} style={{ position: "absolute", left: x, top: 770, width: 60, height: 100, background: "#e8d8b8", borderRadius: "30px 30px 6px 6px", boxShadow: "inset -10px 0 0 #c9b48a", fontFamily, fontWeight: 700, fontSize: 26, color: "#7a3d14", textAlign: "center", paddingTop: 18 }}>{["I", "II", "III", "IV", "V", "VI"][(Math.floor(avance / 600) + k) % 6]}</div>; })}
    </AbsoluteFill>
  );
};

// bosque oscuro (Teutoburgo)
export const Bosque: React.FC<LugarP & { luz?: number }> = ({ t, dx = 0, luz = 0.4 }) => {
  const r = rnd(21);
  const arb = Array.from({ length: 22 }, (_, i) => ({ x: i * 100 + r() * 60 - 80, h: 520 + r() * 300, c: i % 2 ? "#1d3a24" : "#244a2c", capa: i % 3 }));
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg,#2a3a3a,#3c5a48 ${50 + luz * 20}%,#2a3a2a)` }}>
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {arb.map((a, i) => { const x = a.x - dx * (0.3 + a.capa * 0.25); return <g key={i} opacity={0.6 + a.capa * 0.2}><rect x={x - 12} y={980 - a.h * 0.4} width={24} height={a.h * 0.4} fill="#2a1a10" /><path d={`M ${x} ${980 - a.h} L ${x + 110} ${980 - a.h * 0.35} L ${x - 110} ${980 - a.h * 0.35} Z`} fill={a.c} /><path d={`M ${x} ${980 - a.h * 0.8} L ${x + 140} ${980 - a.h * 0.2} L ${x - 140} ${980 - a.h * 0.2} Z`} fill={a.c} /></g>; })}
        <rect x={0} y={960} width={1920} height={120} fill="#22301e" />
        <ellipse cx={960} cy={1000} rx={900} ry={50} fill="#2d3d26" />
      </svg>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 40%, rgba(200,230,200,${0.12 * luz}), transparent 60%)` }} />
    </AbsoluteFill>
  );
};

// valle de batalla: colina del enemigo a la derecha
export const Valle: React.FC<LugarP> = ({ t, dx = 0, hora = "dia" }) => (
  <AbsoluteFill style={{ background: cielo(hora) }}>
    <Nubes t={t} seed={13} op={0.8} />
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      <path d={`M -100 760 Q 600 700 1100 640 Q 1500 470 2100 430 L 2100 1080 L -100 1080 Z`} fill="#8ab866" transform={`translate(${-dx * 0.4} 0)`} />
      <path d="M -100 860 Q 700 820 2100 880 L 2100 1080 L -100 1080 Z" fill="#6a9a4a" />
    </svg>
  </AbsoluteFill>
);

// interior del fuerte de piedra (letrinas, hospital, comedor)
export const Interior: React.FC<{ tono?: string; piso?: string; ventana?: boolean; t?: number }> = ({ tono = "#d8c6a4", piso = "#a88a62", ventana = true }) => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, ${tono}, #c4ae88)` }}>
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      {Array.from({ length: 9 }, (_, j) => Array.from({ length: 13 }, (_, i) => <rect key={`${i}-${j}`} x={i * 160 - (j % 2) * 80} y={j * 90} width={152} height={82} rx={8} fill="rgba(120,90,50,.09)" />))}
      {ventana && <g><rect x={1460} y={170} width={260} height={220} rx={110} fill="#7cc4f0" /><rect x={1460} y={280} width={260} height={110} fill="#9cd48a" /><rect x={1585} y={170} width={10} height={220} fill="#8a6a3a" /></g>}
      <rect x={0} y={860} width={1920} height={220} fill={piso} />
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={i * 180} y1={860} x2={i * 180 - 120} y2={1080} stroke="rgba(0,0,0,.08)" strokeWidth={4} />)}
    </svg>
  </AbsoluteFill>
);

// parcela de veterano
export const Campo: React.FC<LugarP & { seco?: boolean }> = ({ t, dx = 0, seco }) => (
  <AbsoluteFill style={{ background: cielo("dia") }}>
    <Nubes t={t} seed={17} />
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      <path d="M -100 640 Q 500 560 1000 620 T 2100 600 L 2100 1080 L -100 1080 Z" fill={seco ? "#c9a060" : "#8fd16a"} transform={`translate(${-dx * 0.3} 0)`} />
      <path d="M -100 760 L 2100 760 L 2100 1080 L -100 1080 Z" fill={seco ? "#a8803e" : "#6aae4a"} />
      {Array.from({ length: 10 }, (_, i) => <line key={i} x1={-200 + i * 260} y1={1080} x2={600 + i * 90} y2={760} stroke={seco ? "#8a6a2e" : "#58963c"} strokeWidth={10} />)}
    </svg>
  </AbsoluteFill>
);

// ── HUD: contador de años de servicio / edad, fijo arriba a la derecha (el hilo de todo el video)
export const Reloj: React.FC<{ t: number; anio: number; edad: number; x?: number; y?: number }> = ({ t, anio, edad, x = 1640, y = 960 }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${0.96 + 0.04 * Math.sin(t * 2)})`, display: "flex", gap: 10, fontFamily, fontWeight: 700 }}>
    <div style={{ background: "rgba(27,18,64,.88)", color: C.oro, padding: "6px 18px", borderRadius: 14, fontSize: 34, border: "4px solid #fff", whiteSpace: "nowrap" }}>YEAR {Math.max(0, Math.round(anio))}/25</div>
    <div style={{ background: "rgba(27,18,64,.88)", color: "#fff", padding: "6px 18px", borderRadius: 14, fontSize: 34, border: "4px solid #fff", whiteSpace: "nowrap" }}>AGE {Math.round(edad)}</div>
  </div>
);

// ── TABLERO DEL VIAJE: camino de 25 años con las 7 trampas; la ficha (el soldadito) avanza. Se usa en el gancho, en cada
// cartela de trampa y en el CTA (reemplaza los «TRAP #N» sobre rayos).
export const TRAMPAS = ["THE CONTRACT", "TRAINING", "THE MARCH", "THE CENTURION", "THE CAMP", "THE BATTLE", "RETIREMENT"];
const CASILLAS: [number, number][] = [[400, 790], [620, 700], [830, 790], [1070, 655], [1310, 755], [1515, 585], [1640, 390]];
export const Tablero: React.FC<{ t: number; t0: number; en: number; de?: number; tAvanza?: number; marca?: number; hecho?: number }> = ({ t, t0, en, de, tAvanza, marca, hecho = 0 }) => {
  const ini = de ?? Math.max(0, en - 1);
  const u = tAvanza === undefined ? 1 : prog(t, tAvanza, tAvanza + 1.1);
  const pos = ini + (en - ini) * u;
  const k = Math.floor(Math.min(pos, 5.999)), f = pos - k;
  const [ax, ay] = CASILLAS[k], [bx, by] = CASILLAS[Math.min(6, k + 1)];
  const fx = ax + (bx - ax) * f, fy = ay + (by - ay) * f - Math.abs(Math.sin(f * Math.PI)) * 90;
  const d = CASILLAS.map(([x, y], i) => `${i ? "L" : "M"} ${x} ${y}`).join(" ");
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 60%, #f6e3b4, #d9b878 70%, #b88a4a)" }}>
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {Array.from({ length: 40 }, (_, i) => { const r = rnd(i + 3); return <circle key={i} cx={r() * 1920} cy={r() * 1080} r={4 + r() * 10} fill="#c9a060" opacity={0.35} />; })}
        <path d={d} stroke="#8a5a2a" strokeWidth={70} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} stroke="#e8c88a" strokeWidth={44} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="30 22" pathLength={1000} strokeDashoffset={-t * 20} />
      </svg>
      {CASILLAS.map(([x, y], i) => {
        const e = ent(t, t0, i * 0.08);
        const activa = i === Math.round(en) && (marca === undefined || t > marca);
        const pasada = i < hecho;
        const lt = Math.max(0, t - t0);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${e * (activa ? 1.18 + 0.05 * Math.sin(lt * 7) : 1)})` }}>
            <div style={{ width: 150, height: 150, borderRadius: 75, background: pasada ? C.teal : activa ? C.rojo : "#fff8ec", border: "9px solid #2a1530", boxShadow: "0 10px 0 rgba(40,20,10,.35)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily, fontWeight: 700, fontSize: 76, color: activa || pasada ? "#fff" : "#2a1530" }}>{pasada ? "✓" : i + 1}</div>
            <div style={{ position: "absolute", left: "50%", top: 168, transform: "translateX(-50%)", whiteSpace: "nowrap", fontFamily, fontWeight: 700, fontSize: activa ? 40 : 30, color: activa ? C.rojo : "#5a3418", background: activa ? "#fff" : "transparent", padding: "2px 14px", borderRadius: 12 }}>{TRAMPAS[i]}</div>
          </div>
        );
      })}
      {/* ficha: el legionario chiquito con casco */}
      <svg style={{ position: "absolute", left: fx - 50, top: fy - 190, overflow: "visible" }} width={100} height={150} viewBox="-50 -150 100 150">
        <ellipse cx={0} cy={0} rx={40} ry={10} fill="rgba(40,20,10,.35)" />
        <rect x={-26} y={-80} width={52} height={70} rx={18} fill="#d8443a" /><rect x={-26} y={-76} width={52} height={28} fill="#c8ccd4" />
        <circle cx={0} cy={-104} r={30} fill="#f2b48a" /><path d="M -32 -108 Q 0 -150 32 -108 Z" fill="#e2a531" /><circle cx={0} cy={-142} r={6} fill="#e2a531" />
        <circle cx={-10} cy={-102} r={6} fill="#2a1a10" /><circle cx={10} cy={-102} r={6} fill="#2a1a10" />
      </svg>
    </AbsoluteFill>
  );
};

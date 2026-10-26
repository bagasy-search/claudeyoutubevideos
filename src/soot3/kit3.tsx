import React from "react";
import { AbsoluteFill } from "remotion";
import { rnd } from "../soot/lib";
import { C, fontFamily, ent, prog, fijarLuz, luzActual, Bruma, Niebla, Tinte, mezcla, LUCES, Estrellas } from "./kit";
import { Persona, CIVIL, LUCIUS, TextoMano } from "./persona";
import type { Ropa, Expr, Giro, Reaccion } from "./persona";

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
        <g key={i} transform={`translate(${x} ${y + b}) scale(${s} ${s * (1 + (((i * 37) % 11) - 5) * 0.016)})`}>
          {!color && <ellipse cx={-8} cy={0} rx={18} ry={4} fill="#1d0f33" opacity={0.25} />}
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
// v5 (arte base): cada lugar FIJA LA LUZ del set (los Persona que se dibujan después toman sombra, borde y tinte), tiene
// perspectiva atmosférica (capas de atrás más claras y desaturadas, bruma) y tinte de color propio.
type LugarP = { t: number; dx?: number; hora?: "dia" | "tarde" | "noche" };
const cielo = (h: LugarP["hora"]) => h === "noche" ? "linear-gradient(180deg,#0e0a2a,#1b1240 40%,#3a2a78 100%)" : h === "tarde" ? "linear-gradient(180deg,#3a2a78,#a8417a 45%,#ff9a4d 80%,#ffd27a)" : "linear-gradient(180deg,#3b9be0,#7cc4f0 45%,#c8ecf8 80%,#fff3d6)";
const TINTE: Record<"dia" | "tarde" | "noche", [string, number]> = { dia: ["#ffd9a0", 0.05], tarde: ["#ff4a5a", 0.09], noche: ["#140f5a", 0.2] };
const LEJOS: Record<"dia" | "tarde" | "noche", [string, string]> = { dia: ["#a9cfe0", "#8fbfb0"], tarde: ["#b9688e", "#9a4f7a"], noche: ["#2e2466", "#271d58"] };
// cordillera de horizonte QUEBRADO (picos irregulares), plana
const Cordillera: React.FC<{ y: number; color: string; alto?: number; seed?: number; dx?: number; paso?: number }> = ({ y, color, alto = 120, seed = 1, dx = 0, paso = 110 }) => {
  const r = rnd(seed);
  const pts: string[] = [];
  for (let k = -3; k <= 2200 / paso + 3; k++) {
    const pico = r() < 0.35;
    pts.push(`${k * paso - (dx % paso)},${y - (pico ? alto * (0.7 + r() * 0.5) : alto * (0.15 + r() * 0.45))}`);
  }
  return <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}><polygon points={`-400,1080 ${pts.join(" ")} 2400,1080`} fill={color} strokeLinejoin="round" /></svg>;
};

// campamento/fuerte de legión: el MISMO lugar de la miniatura (empalizada, torre, carpas, estandartes)
// angulo: "general" (el de siempre) · "bajo" (horizonte abajo, torre en contrapicado, cámara al piso) · "cenital" (el campamento como mapa vivo)
export type AnguloCamp = "general" | "bajo" | "cenital";
export const Campamento: React.FC<LugarP & { tropa?: boolean; angulo?: AnguloCamp }> = ({ t, dx = 0, hora = "dia", tropa = true, angulo = "general" }) => {
  fijarLuz(hora);
  if (angulo === "bajo") return <CampBajo t={t} dx={dx} hora={hora} />;
  if (angulo === "cenital") return <CampCenital t={t} dx={dx} hora={hora} tropa={tropa} />;
  const N = hora === "noche";
  return (
    <AbsoluteFill style={{ background: cielo(hora) }}>
      {N ? <Estrellas t={t} n={60} alto={480} /> : <Nubes t={t} seed={3} op={hora === "tarde" ? 0.35 : 0.95} />}
      <Cordillera y={600} color={LEJOS[hora][0]} alto={110} seed={31} dx={dx * 0.08} />
      <Bruma y0={470} y1={640} op={0.45} />
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <path d={`M -100 640 Q 300 ${560} 700 620 T 1500 600 T 2200 630 L 2200 1080 L -100 1080 Z`} fill={N ? "#241a52" : hora === "tarde" ? "#7a3a6a" : "#9cc98a"} transform={`translate(${-dx * 0.2} 0)`} />
      </svg>
      <Bruma y0={560} y1={700} op={0.25} />
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${-dx * 0.5}px)` }}>
        <Empalizada y={700} alto={120} color={N ? "#4a3060" : "#b07a3e"} color2={N ? "#3a2450" : "#8a5a2a"} x0={-400} x1={2600} />
        <div style={{ position: "absolute", left: -400, width: 3000, top: 700, height: 26, background: "linear-gradient(180deg, rgba(29,15,51,.28), rgba(29,15,51,0))" }} />
        <Torre x={140} y={710} s={0.9} /><Torre x={1820} y={710} s={0.9} />
        {[300, 520, 760, 1180, 1420, 1640].map((x, i) => (
          <React.Fragment key={x}>
            <div style={{ position: "absolute", left: x - 70 - 50, top: 784 + (i % 2) * 14, width: 190, height: 16, borderRadius: "50%", background: "rgba(29,15,51,.22)" }} />
            <Carpa x={x} y={790 + (i % 2) * 14} s={0.7} tono={N ? "#7a6a8a" : "#e0bc84"} />
          </React.Fragment>
        ))}
      </div>
      <Bruma y0={620} y1={820} op={0.1} />
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${-dx * 0.8}px)` }}>
        {[230, 610, 1310, 1700].map((x, i) => <Estandarte key={x} x={x} y={880} s={0.85} t={t} f={i} />)}
        {tropa && <FilaLejana y={890} x0={380} n={14} paso={48} s={1.1} t={t} />}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 880, bottom: 0, background: N ? "linear-gradient(180deg,#2e2246,#1a1230)" : "linear-gradient(180deg,#d9a35a,#a8692e)" }} />
      <Suelo y={880} hora={hora} dx={dx} />
      <Tinte color={TINTE[hora][0]} op={TINTE[hora][1]} />
    </AbsoluteFill>
  );
};
// textura plana del piso de tierra (piedritas y huellas) para que no sea un plano liso
const Suelo: React.FC<{ y: number; hora: "dia" | "tarde" | "noche"; dx?: number; seed?: number }> = ({ y, hora, dx = 0, seed = 8 }) => {
  const r = rnd(seed);
  const os = hora === "noche" ? "#140c26" : "#7a4a1e";
  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
      {Array.from({ length: 26 }, (_, i) => {
        const yy = y + 14 + r() * (1080 - y - 20), k = (yy - y) / (1080 - y);
        const xx = ((r() * 2400 - dx * (0.8 + k * 0.4)) % 2400 + 2400) % 2400 - 240;
        return <ellipse key={i} cx={xx} cy={yy} rx={(8 + r() * 26) * (0.5 + k)} ry={(3 + r() * 5) * (0.5 + k)} fill={os} opacity={0.18} />;
      })}
    </svg>
  );
};
// campamento desde el PISO: horizonte bajo, empalizada enorme, torre en contrapicado contra el cielo
const CampBajo: React.FC<{ t: number; dx: number; hora: "dia" | "tarde" | "noche" }> = ({ t, dx, hora }) => {
  const N = hora === "noche";
  const tx = 1540 - dx * 0.6;
  const madera = N ? ["#4a3060", "#3a2450", "#2a1a3a"] : ["#b07a3e", "#8a5a2a", "#6b4220"];
  return (
    <AbsoluteFill style={{ background: cielo(hora) }}>
      {N ? <Estrellas t={t} n={80} alto={760} /> : <Nubes t={t} seed={11} y={40} op={hora === "tarde" ? 0.4 : 0.95} vel={16} />}
      <Cordillera y={960} color={LEJOS[hora][0]} alto={60} seed={5} dx={dx * 0.1} />
      <Bruma y0={860} y1={990} op={0.5} />
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <g transform={`translate(${-dx * 0.45} 0)`}>
          {/* estacas de la empalizada vistas desde abajo: anchas, convergen hacia arriba */}
          {Array.from({ length: 40 }, (_, i) => {
            const x = -300 + i * 72, lean = (x - 960) * -0.035;
            return <path key={i} d={`M ${x} 1010 L ${x + lean} 700 L ${x + lean + 33} 650 L ${x + lean + 66} 700 L ${x + 66} 1010 Z`} fill={i % 2 ? madera[0] : madera[1]} />;
          })}
          <path d="M -300 820 L 2600 820 L 2600 842 L -300 842 Z" fill={madera[2]} opacity={0.8} />
        </g>
        {/* torre en contrapicado: patas que se cierran hacia arriba, plataforma vista de abajo */}
        <g transform={`translate(${tx} 0)`}>
          {[-1, 1].map((s) => <path key={s} d={`M ${s * 170 - 16} 1040 L ${s * 96 - 10} 230 L ${s * 96 + 10} 230 L ${s * 170 + 16} 1040 Z`} fill={madera[2]} />)}
          {[880, 680, 500, 340].map((yy, i) => { const w = 170 - (1040 - yy) * 0.093, w2 = 170 - (1040 - yy + 170 - i * 20) * 0.093; return <g key={yy} stroke={madera[1]} strokeWidth={16 - i * 2}><line x1={-w} y1={yy} x2={w2} y2={yy - 170 + i * 20} /><line x1={w} y1={yy} x2={-w2} y2={yy - 170 + i * 20} /></g>; })}
          <path d="M -150 250 L 150 250 L 130 210 L -130 210 Z" fill={madera[2]} />
          <rect x={-140} y={130} width={280} height={84} fill={madera[0]} />
          {[-110, -60, -10, 40, 90].map((xx) => <rect key={xx} x={xx} y={140} width={22} height={64} fill={madera[1]} />)}
          <path d="M -170 136 L 0 30 L 170 136 Z" fill={N ? "#3a1a2a" : "#8a3a1e"} />
          <rect x={-4} y={-40} width={8} height={74} fill={madera[2]} />
          <path d={`M 4 -40 L ${56 + Math.sin(t * 4) * 6} -28 L 4 -14 Z`} fill="#c81d2e" />
        </g>
        <rect x={0} y={1000} width={1920} height={80} fill={N ? "#1a1230" : "#a8692e"} />
      </svg>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${-dx * 0.7}px)` }}>
        {[180, 620].map((x, i) => <Estandarte key={x} x={x} y={1060} s={1.9} t={t} f={i * 2} />)}
      </div>
      <Tinte color={TINTE[hora][0]} op={TINTE[hora][1]} />
    </AbsoluteFill>
  );
};
// campamento desde ARRIBA: el mapa vivo (fosa, empalizada, 4 puertas, vías principalis/praetoria, principia, carpas en
// grilla, columnas que marchan y sombras de nubes que pasan)
const CampCenital: React.FC<{ t: number; dx: number; hora: "dia" | "tarde" | "noche"; tropa: boolean }> = ({ t, dx, hora, tropa }) => {
  const N = hora === "noche";
  const suelo = N ? "#3a3060" : hora === "tarde" ? "#c08a5a" : "#cdb06e";
  const pasto = N ? "#2e2852" : hora === "tarde" ? "#a8785a" : "#a9c070";
  const via = N ? "#5a4c80" : "#ead09a";
  const carpa = N ? ["#7a6a8a", "#5a4c6e"] : ["#ecd09a", "#c8a066"];
  const r = rnd(41);
  const X0 = 300, X1 = 1620, Y0 = 110, Y1 = 970, VX = 960, VY = 470;
  const carpas: [number, number][] = [];
  for (let gx = X0 + 70; gx < X1 - 60; gx += 82) for (let gy = Y0 + 70; gy < Y1 - 50; gy += 66) {
    if (Math.abs(gx - VX) < 80 || Math.abs(gy - VY) < 70) continue;
    if (Math.abs(gx - VX) < 190 && Math.abs(gy - VY) < 140) continue;
    carpas.push([gx, gy]);
  }
  const marcha = (k: number, n: number, x0: number, y0: number, vx: number, vy: number, largo: number) => Array.from({ length: n }, (_, i) => {
    const u = ((t * 0.06 + k * 0.37 + i * 0.022) % 1) * largo;
    return [x0 + vx * u, y0 + vy * u] as [number, number];
  });
  const tropas = tropa ? [...marcha(0, 8, X0 + 20, VY - 14, 1, 0, X1 - X0 - 40), ...marcha(1, 6, VX + 14, Y0 + 20, 0, 1, Y1 - Y0 - 40), ...marcha(2, 6, X1 - 20, VY + 14, -1, 0, X1 - X0 - 40)] : [];
  return (
    <AbsoluteFill style={{ background: suelo, overflow: "hidden" }}>
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <g transform={`translate(${-dx * 0.5} 0)`}>
          {Array.from({ length: 22 }, (_, i) => <ellipse key={i} cx={r() * 2200 - 140} cy={r() * 1080} rx={60 + r() * 140} ry={40 + r() * 90} fill={pasto} opacity={0.7} />)}
          {/* fosa + empalizada */}
          <rect x={X0 - 46} y={Y0 - 46} width={X1 - X0 + 92} height={Y1 - Y0 + 92} rx={70} fill="none" stroke={N ? "#241c44" : "#8a6a3a"} strokeWidth={30} opacity={0.6} />
          <rect x={X0 - 6} y={Y0 - 6} width={X1 - X0 + 12} height={Y1 - Y0 + 12} rx={46} fill="none" stroke="#1d0f33" strokeWidth={26} opacity={0.22} />
          <rect x={X0} y={Y0} width={X1 - X0} height={Y1 - Y0} rx={44} fill="none" stroke={N ? "#4a3060" : "#7a4a22"} strokeWidth={24} />
          <rect x={X0} y={Y0} width={X1 - X0} height={Y1 - Y0} rx={44} fill="none" stroke={N ? "#6a4a80" : "#b07a3e"} strokeWidth={10} strokeDasharray="10 8" />
          {/* vías */}
          <rect x={X0 - 60} y={VY - 36} width={X1 - X0 + 120} height={72} fill={via} />
          <rect x={VX - 36} y={Y0 - 60} width={72} height={Y1 - Y0 + 120} fill={via} />
          {/* carpas en grilla (techo a dos aguas: mitad en sombra del lado opuesto al sol) */}
          {carpas.map(([x, y], i) => (
            <g key={i}>
              <rect x={x - 26} y={y - 16} width={52} height={34} fill="#1d0f33" opacity={0.2} transform="translate(-8 6)" />
              <rect x={x - 26} y={y - 18} width={26} height={34} fill={carpa[1]} />
              <rect x={x} y={y - 18} width={26} height={34} fill={carpa[0]} />
              <line x1={x} y1={y - 20} x2={x} y2={y + 18} stroke={N ? "#3a2a50" : "#8a5a2a"} strokeWidth={3} />
            </g>
          ))}
          {/* principia en el cruce */}
          <g>
            <rect x={VX - 130} y={VY - 100} width={260} height={200} fill="#1d0f33" opacity={0.2} transform="translate(-14 10)" />
            <rect x={VX - 130} y={VY - 100} width={260} height={200} fill={N ? "#6a5a7a" : "#e8dcc0"} />
            <rect x={VX - 80} y={VY - 56} width={160} height={112} fill={via} />
            <rect x={VX - 130} y={VY - 100} width={260} height={40} fill={N ? "#5a2a3a" : "#b5452c"} />
            <rect x={VX - 130} y={VY + 60} width={260} height={40} fill={N ? "#4a2030" : "#9a3a22"} />
            <rect x={VX - 10} y={VY - 10} width={20} height={20} fill="#c81d2e" />
          </g>
          {/* torres de esquina y de puerta */}
          {[[X0, Y0], [X1, Y0], [X0, Y1], [X1, Y1], [VX - 70, Y0], [VX + 70, Y0], [VX - 70, Y1], [VX + 70, Y1], [X0, VY - 70], [X0, VY + 70], [X1, VY - 70], [X1, VY + 70]].map(([x, y], i) => (
            <g key={i}>
              <rect x={x - 30} y={y - 30} width={60} height={60} fill="#1d0f33" opacity={0.22} transform="translate(-12 8)" />
              <rect x={x - 30} y={y - 30} width={60} height={60} fill={N ? "#5a3a50" : "#9a5a2e"} />
              <path d={`M ${x - 30} ${y - 30} L ${x + 30} ${y + 30} M ${x + 30} ${y - 30} L ${x - 30} ${y + 30}`} stroke={N ? "#3a2440" : "#6b3a1f"} strokeWidth={4} />
            </g>
          ))}
          {/* columnas que marchan (cascos vistos de arriba) */}
          {tropas.map(([x, y], i) => (
            <g key={i}>
              <ellipse cx={x - 6} cy={y + 5} rx={11} ry={9} fill="#1d0f33" opacity={0.25} />
              <ellipse cx={x} cy={y} rx={12} ry={10} fill="#c81d2e" />
              <circle cx={x} cy={y} r={7} fill="#e2a531" />
            </g>
          ))}
        </g>
        {/* sombras de nubes que pasan */}
        {[0, 1].map((i) => <ellipse key={i} cx={((t * 22 + i * 1100) % 2600) - 340} cy={300 + i * 420} rx={340} ry={170} fill="#1d0f33" opacity={0.1} />)}
      </svg>
      <Tinte color={TINTE[hora][0]} op={TINTE[hora][1]} />
    </AbsoluteFill>
  );
};

// pueblo polvoriento de Galia/Hispania
export const Pueblo: React.FC<LugarP> = ({ t, dx = 0, hora = "dia" }) => {
  fijarLuz(hora === "dia" ? "polvo" : hora);
  const r = rnd(7);
  const casas = Array.from({ length: 7 }, (_, i) => ({ x: i * 340 - 60 + r() * 60, s: 0.9 + r() * 0.5, tono: ["#f0c08a", "#e8b07a", "#f2c89a", "#ead2a8"][i % 4], techo: ["#b5552c", "#a8452c", "#c46a3a"][i % 3] }));
  return (
    <AbsoluteFill style={{ background: hora === "tarde" ? cielo("tarde") : "linear-gradient(180deg,#f2ae62,#f7c98a 50%,#fde3b4)" }}>
      <Nubes t={t} seed={9} color="#fff1d6" op={0.6} />
      <Cordillera y={640} color={hora === "tarde" ? "#c07a7a" : "#e8b88a"} alto={120} seed={12} dx={dx * 0.15} />
      <Bruma y0={520} y1={660} op={0.4} color="#fde3b4" />
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${-dx * 0.6}px)` }}>
        {casas.map((c, i) => (
          <svg key={i} style={{ position: "absolute", left: c.x, top: 800 - 220 * c.s, overflow: "visible" }} width={260 * c.s} height={220 * c.s} viewBox="0 0 260 220">
            <ellipse cx={100} cy={222} rx={170} ry={10} fill="#1d0f33" opacity={0.18} />
            <rect x={20} y={90} width={220} height={130} fill={c.tono} /><rect x={160} y={90} width={80} height={130} fill="rgba(60,20,30,.15)" />
            <rect x={20} y={90} width={10} height={130} fill="#fff6e0" opacity={0.0} />
            <rect x={232} y={90} width={8} height={130} fill="#fff3c8" opacity={0.5} />
            <path d="M 0 96 L 130 26 L 260 96 Z" fill={c.techo} /><path d="M 0 96 L 260 96 L 252 106 L 8 106 Z" fill="rgba(0,0,0,.15)" />
            <rect x={100} y={140} width={56} height={80} rx={26} fill="#5a3418" /><rect x={42} y={122} width={38} height={34} rx={5} fill="#5a3418" />
            {i % 2 === 0 && <rect x={180} y={30} width={18} height={44} fill="#9a6a4a" />}
          </svg>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 790, bottom: 0, background: "linear-gradient(180deg,#d39a5a,#a8692e)" }} />
      <Suelo y={790} hora="dia" dx={dx} seed={3} />
      <Tinte color={hora === "tarde" ? TINTE.tarde[0] : "#ffb060"} op={hora === "tarde" ? TINTE.tarde[1] : 0.05} />
    </AbsoluteFill>
  );
};

// ruta romana de adoquines con mojones que pasan (para marchar)
export const Ruta: React.FC<LugarP & { avance?: number; verde?: boolean }> = ({ t, dx = 0, hora = "dia", avance = 0, verde = true }) => {
  fijarLuz(hora);
  const off = avance % 600;
  return (
    <AbsoluteFill style={{ background: cielo(hora) }}>
      {hora !== "noche" && <Nubes t={t} seed={5} op={hora === "tarde" ? 0.3 : 0.9} />}
      <Cordillera y={600} color={verde ? LEJOS[hora][0] : hora === "tarde" ? "#c07a7a" : "#e8c08a"} alto={100} seed={19} dx={avance * 0.03} />
      <Bruma y0={480} y1={620} op={0.45} />
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <path d="M -100 620 Q 400 520 900 600 T 2000 580 L 2000 1080 L -100 1080 Z" fill={verde ? "#7fb86a" : "#d8a060"} transform={`translate(${-(avance * 0.1) % 400} 0)`} />
        <path d="M -100 700 Q 500 640 1000 690 T 2100 680 L 2100 1080 L -100 1080 Z" fill={verde ? "#5f9a4a" : "#c4874a"} />
        <rect x={0} y={860} width={1920} height={130} fill="#9a8a78" />
        {Array.from({ length: 34 }, (_, i) => <rect key={i} x={((i * 64 - avance) % 2176 + 2176) % 2176 - 128} y={866 + (i % 2) * 60} width={58} height={56} rx={10} fill={i % 3 ? "#b4a48e" : "#a8977f"} />)}
        <rect x={0} y={990} width={1920} height={90} fill={verde ? "#4f8a3c" : "#b07a40"} />
      </svg>
      {[0, 1, 2, 3].map((k) => { const x = 300 + k * 600 - off - dx * 0; return <div key={k} style={{ position: "absolute", left: x, top: 770, width: 60, height: 100, background: "#e8d8b8", borderRadius: "30px 30px 6px 6px", boxShadow: "inset -10px 0 0 #c9b48a, -16px 92px 0 -40px rgba(29,15,51,.25)", fontFamily, fontWeight: 700, fontSize: 26, color: "#7a3d14", textAlign: "center", paddingTop: 18 }}>{["I", "II", "III", "IV", "V", "VI"][(Math.floor(avance / 600) + k) % 6]}</div>; })}
      <Tinte color={TINTE[hora][0]} op={TINTE[hora][1]} />
    </AbsoluteFill>
  );
};

// bosque oscuro (Teutoburgo): horizonte quebrado, árboles en 3 capas con perspectiva atmosférica y niebla entre capas
export const Bosque: React.FC<LugarP & { luz?: number }> = ({ t, dx = 0, luz = 0.4 }) => {
  fijarLuz("bosque");
  const r = rnd(21);
  const arb = Array.from({ length: 22 }, (_, i) => ({ x: i * 100 + r() * 60 - 80, h: 520 + r() * 300, c: i % 2 ? "#1d3a24" : "#244a2c", capa: i % 3 }));
  const NIE = "#a8c4b4";
  const capa = (k: number) => arb.filter((a) => a.capa === k).map((a, i) => {
    const x = a.x - dx * (0.3 + a.capa * 0.25), col = mezcla(a.c, NIE, [0.5, 0.22, 0][k]), tronco = mezcla("#2a1a10", NIE, [0.5, 0.22, 0][k]);
    const sc = [0.78, 0.9, 1][k], base = [900, 950, 985][k];
    return <g key={`${k}-${i}`} transform={`translate(${x} ${base}) scale(${sc}) translate(${-x} ${-980})`}><rect x={x - 12} y={980 - a.h * 0.4} width={24} height={a.h * 0.4} fill={tronco} /><path d={`M ${x} ${980 - a.h} L ${x + 110} ${980 - a.h * 0.35} L ${x - 110} ${980 - a.h * 0.35} Z`} fill={col} /><path d={`M ${x} ${980 - a.h * 0.8} L ${x + 140} ${980 - a.h * 0.2} L ${x - 140} ${980 - a.h * 0.2} Z`} fill={col} /></g>;
  });
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg,#2a3a3a,#3c5a48 ${50 + luz * 20}%,#2a3a2a)` }}>
      <Cordillera y={560} color="#4f6a60" alto={150} seed={23} dx={dx * 0.1} paso={90} />
      <Niebla t={t} y={560} color={NIE} op={0.32} alto={60} vel={8} seed={4} />
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>{capa(0)}</svg>
      <Niebla t={t} y={720} color={NIE} op={0.26} alto={70} vel={12} seed={6} />
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>{capa(1)}</svg>
      <Niebla t={t} y={880} color={NIE} op={0.2} alto={60} vel={18} seed={9} />
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {capa(2)}
        <rect x={0} y={960} width={1920} height={120} fill="#22301e" />
        <ellipse cx={960} cy={1000} rx={900} ry={50} fill="#2d3d26" />
      </svg>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 40%, rgba(200,230,200,${0.12 * luz}), transparent 60%)` }} />
      <Niebla t={t} y={1010} color={NIE} op={0.16} alto={40} vel={24} seed={12} />
    </AbsoluteFill>
  );
};

// valle de batalla: colina del enemigo a la derecha; horizonte quebrado en 2 cordilleras con niebla en capas
export const Valle: React.FC<LugarP> = ({ t, dx = 0, hora = "dia" }) => {
  fijarLuz(hora);
  const nie = hora === "tarde" ? "#ffc0a0" : hora === "noche" ? "#5a4a9a" : "#eef8fc";
  return (
    <AbsoluteFill style={{ background: cielo(hora) }}>
      <Nubes t={t} seed={13} op={0.8} />
      <Cordillera y={560} color={LEJOS[hora][0]} alto={170} seed={47} dx={dx * 0.1} paso={130} />
      <Niebla t={t} y={560} color={nie} op={0.4} alto={50} vel={9} seed={3} />
      <Cordillera y={650} color={LEJOS[hora][1]} alto={110} seed={53} dx={dx * 0.2} paso={100} />
      <Niebla t={t} y={680} color={nie} op={0.3} alto={60} vel={14} seed={7} />
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <path d={`M -100 760 Q 600 700 1100 640 Q 1500 470 2100 430 L 2100 1080 L -100 1080 Z`} fill="#8ab866" transform={`translate(${-dx * 0.4} 0)`} />
        <path d={`M 1100 640 Q 1500 470 2100 430 L 2100 470 Q 1500 500 1100 650 Z`} fill="#c8e89a" opacity={0.5} transform={`translate(${-dx * 0.4} 0)`} />
        <path d="M -100 860 Q 700 820 2100 880 L 2100 1080 L -100 1080 Z" fill="#6a9a4a" />
      </svg>
      <Niebla t={t} y={840} color={nie} op={0.14} alto={40} vel={20} seed={11} />
      <Tinte color={TINTE[hora][0]} op={TINTE[hora][1]} />
    </AbsoluteFill>
  );
};

// interior del fuerte de piedra (letrinas, hospital, comedor)
export const Interior: React.FC<{ tono?: string; piso?: string; ventana?: boolean; t?: number }> = ({ tono = "#d8c6a4", piso = "#a88a62", ventana = true }) => {
  fijarLuz(ventana ? "interior" : { ...LUCES.interior, bordeOp: 0.35, largo: 0.15 });
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${tono}, #c4ae88)` }}>
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {Array.from({ length: 9 }, (_, j) => Array.from({ length: 13 }, (_, i) => <rect key={`${i}-${j}`} x={i * 160 - (j % 2) * 80} y={j * 90} width={152} height={82} rx={8} fill="rgba(120,90,50,.09)" />))}
        {ventana && <g><rect x={1460} y={170} width={260} height={220} rx={110} fill="#7cc4f0" /><rect x={1460} y={280} width={260} height={110} fill="#9cd48a" /><rect x={1585} y={170} width={10} height={220} fill="#8a6a3a" /></g>}
        <rect x={0} y={860} width={1920} height={220} fill={piso} />
        {Array.from({ length: 12 }, (_, i) => <line key={i} x1={i * 180} y1={860} x2={i * 180 - 120} y2={1080} stroke="rgba(0,0,0,.08)" strokeWidth={4} />)}
        <rect x={0} y={846} width={1920} height={16} fill="#1d0f33" opacity={0.12} />
        {/* haz de luz de la ventana (plano, sin blur) */}
        {ventana && <path d="M 1460 290 L 1720 290 L 1500 1080 L 980 1080 Z" fill="#fff3c8" opacity={0.13} />}
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 60% 45%, rgba(0,0,0,0) 55%, rgba(60,30,10,.22) 100%)" }} />
    </AbsoluteFill>
  );
};

// parcela de veterano
export const Campo: React.FC<LugarP & { seco?: boolean }> = ({ t, dx = 0, seco }) => {
  fijarLuz("dia");
  return (
    <AbsoluteFill style={{ background: cielo("dia") }}>
      <Nubes t={t} seed={17} />
      <Cordillera y={630} color="#a9cfe0" alto={120} seed={61} dx={dx * 0.1} />
      <Bruma y0={500} y1={650} op={0.45} />
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <path d="M -100 640 Q 500 560 1000 620 T 2100 600 L 2100 1080 L -100 1080 Z" fill={seco ? "#c9a060" : "#8fd16a"} transform={`translate(${-dx * 0.3} 0)`} />
        <path d="M -100 760 L 2100 760 L 2100 1080 L -100 1080 Z" fill={seco ? "#a8803e" : "#6aae4a"} />
        {Array.from({ length: 10 }, (_, i) => <line key={i} x1={-200 + i * 260} y1={1080} x2={600 + i * 90} y2={760} stroke={seco ? "#8a6a2e" : "#58963c"} strokeWidth={10} />)}
      </svg>
      <Tinte color={TINTE.dia[0]} op={TINTE.dia[1]} />
    </AbsoluteFill>
  );
};

// ── SETS NUEVOS (v5) ───────────────────────────────────────────────────────────────────────────────────────────────
// proyección de un punto del mundo (x, y, profundidad z ≥ 0) con punto de fuga en (960, 520)
const P = (x: number, y: number, z: number, vx = 960, vy = 520): [number, number] => { const f = 1 / (1 + z); return [vx + (x - vx) * f, vy + (y - vy) * f]; };
const poli = (...ps: [number, number][]) => ps.map((p) => p.join(",")).join(" ");

// INTERIOR DE LA CARPA del contubernium: 8 literas (4 cuchetas de 2), lámpara de aceite que se mece, equipo colgado.
// Los personajes van parados/sentados en el centro (pies en y≈960-1040).
export const CarpaInterior: React.FC<{ t: number; lampara?: boolean; dx?: number; mantas?: string[] }> = ({ t, lampara = true, dx = 0, mantas = ["#b8432f", "#7a4a8a", "#3f7a6a", "#c08a2a", "#9e2531", "#4a6a9a", "#8a6a3a", "#a83a5a"] }) => {
  fijarLuz("carpa");
  const sw = Math.sin(t * 1.3) * 18;
  const lx = 960 + sw - dx * 0.2, ly = 380;
  const ZB = 1.6, piso = 1150, techo = -650;
  const cuero = ["#7a4a2a", "#8f5a34", "#6a3e22", "#5a3420"];
  // cucheta pegada a la pared: lado s, profundidad z0..z1
  const cucheta = (s: 1 | -1, z0: number, z1: number, k: number) => {
    const xp = s < 0 ? -300 : 2220, xi = s < 0 ? 220 : 1700;
    const el: React.ReactNode[] = [];
    [880, 570].forEach((yw, n) => {
      const m = mantas[(k * 2 + n) % mantas.length];
      // marco de madera, colchón (cara de arriba + frente), manta con pliegue y almohada al fondo
      el.push(<polygon key={`b${n}`} points={poli(P(xp, yw + 60, z0), P(xi, yw + 60, z0), P(xi, yw + 60, z1), P(xp, yw + 60, z1))} fill="#4a2a14" />);
      el.push(<polygon key={`c${n}`} points={poli(P(xp, yw, z0), P(xi, yw, z0), P(xi, yw, z1), P(xp, yw, z1))} fill="#e8d4a8" />);
      el.push(<polygon key={`k${n}`} points={poli(P(xp, yw - 4, z0), P(xi + s * 10, yw - 4, z0), P(xi + s * 10, yw - 4, z1 - 0.3), P(xp, yw - 4, z1 - 0.3))} fill={m} />);
      el.push(<polygon key={`f${n}`} points={poli(P(xp, yw - 4, z0), P(xi + s * 10, yw - 4, z0), P(xi + s * 10, yw + 50, z0), P(xp, yw + 50, z0))} fill={mezcla(m, "#1d0f33", 0.3)} />);
      el.push(<line key={`l${n}`} x1={P(xi - s * 120, yw - 4, z0)[0]} y1={P(xi - s * 120, yw - 4, z0)[1]} x2={P(xi - s * 120, yw - 4, z1 - 0.3)[0]} y2={P(xi - s * 120, yw - 4, z1 - 0.3)[1]} stroke={mezcla(m, "#ffffff", 0.3)} strokeWidth={5} />);
      el.push(<polygon key={`m${n}`} points={poli(P(xp, yw + 50, z0), P(xi + s * 10, yw + 50, z0), P(xi + s * 10, yw + 74, z0), P(xp, yw + 74, z0))} fill="#6b3a1f" />);
      el.push(<polygon key={`a${n}`} points={poli(P(xi - s * 30, yw - 54, z1 - 0.2), P(xi - s * 330, yw - 54, z1 - 0.2), P(xi - s * 330, yw, z1 - 0.04), P(xi - s * 30, yw, z1 - 0.04))} fill="#f6ead0" />);
    });
    [z0, z1].forEach((z, n) => { const a = P(xi + s * 14, 470, z), b = P(xi + s * 14, piso, z); el.push(<line key={`p${n}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#6b3a1f" strokeWidth={30 / (1 + z)} strokeLinecap="round" />); });
    return <g key={`${s}${z0}`}>{el}</g>;
  };
  const back = (x: number, y: number) => P(x, y, ZB);
  return (
    <AbsoluteFill style={{ background: "#3a2214", overflow: "hidden" }}>
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <g transform={`translate(${-dx * 0.2} 0)`}>
          {/* paños del techo (izq/der) con costuras que fugan, pared del fondo y piso */}
          <polygon points={poli([-1400, techo + 200], P(960, techo, 0), back(960, techo), back(-300, piso), [-1400, 1080 + 600])} fill={cuero[0]} />
          <polygon points={poli([3320, techo + 200], P(960, techo, 0), back(960, techo), back(2220, piso), [3320, 1080 + 600])} fill={cuero[1]} />
          {[0.25, 0.5, 0.75, 1.05, 1.35].map((z) => <g key={z} stroke={cuero[3]} strokeWidth={6 / (1 + z)} opacity={0.6}><line x1={P(960, techo, z)[0]} y1={P(960, techo, z)[1]} x2={P(-300, piso, z)[0]} y2={P(-300, piso, z)[1]} /><line x1={P(960, techo, z)[0]} y1={P(960, techo, z)[1]} x2={P(2220, piso, z)[0]} y2={P(2220, piso, z)[1]} /></g>)}
          <polygon points={poli(back(960, techo), back(2220, piso), back(-300, piso))} fill={cuero[2]} />
          <polygon points={poli(back(960, techo + 260), back(1060, piso), back(860, piso))} fill={cuero[3]} />
          <polygon points={poli(back(-300, piso), back(2220, piso), [2600, 1080], [-680, 1080])} fill="#5a3a20" />
          {Array.from({ length: 9 }, (_, i) => { const x = -300 + i * 315; const a = back(x, piso); return <line key={i} x1={a[0]} y1={a[1]} x2={960 + (x - 960) * 1.4} y2={1080} stroke="#4a2e18" strokeWidth={5} opacity={0.6} />; })}
          {/* poste central del fondo y cumbrera */}
          <line x1={back(960, techo)[0]} y1={back(960, techo)[1]} x2={back(960, piso)[0]} y2={back(960, piso)[1]} stroke="#3a2010" strokeWidth={10} />
          <line x1={960} y1={-40} x2={back(960, techo)[0]} y2={back(960, techo)[1]} stroke="#3a2010" strokeWidth={22} />
          {/* equipo colgado en el fondo: cascos, capas, escudos apoyados, pila */}
          {[-420, -250, 250, 420].map((xo, i) => { const [x, y] = back(960 + xo * 2.6, 200); return <g key={i} transform={`translate(${x} ${y}) scale(0.95)`}><rect x={-30} y={30} width={60} height={110} rx={10} fill={["#9e2531", "#6a4a8a", "#2e5a7a", "#8a6a3a"][i]} opacity={0.9} /><line x1={0} y1={-40} x2={0} y2={-10} stroke="#3a2010" strokeWidth={6} /><path d="M -40 30 Q -42 -24 0 -24 Q 42 -24 40 30 Z" fill="#c9862a" /><rect x={-44} y={26} width={88} height={10} fill="#8a5414" /></g>; })}
          {[-1, 1].map((s) => { const [x, y] = back(960 + s * 560, 560); return <g key={s} transform={`translate(${x} ${y})`}><rect x={-34} y={-10} width={68} height={120} rx={14} fill={s < 0 ? "#9e2531" : "#2e5a7a"} /><rect x={-34} y={-10} width={68} height={22} rx={8} fill="#3a2010" opacity={0.4} /></g>; })}
          {[-1, 1].map((s) => { const [x, y] = back(960 + s * 340, piso); return <g key={`e${s}`} transform={`translate(${x} ${y}) rotate(${s * -8})`}><rect x={-40} y={-150} width={80} height={150} rx={12} fill="#c81d2e" /><circle cx={0} cy={-75} r={14} fill="#e2a531" /><rect x={-40} y={-150} width={80} height={150} rx={12} fill="none" stroke="#e2a531" strokeWidth={6} /></g>; })}
          {(() => { const a = back(1200, piso), b = back(1300, -200); return <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#6b3a1f" strokeWidth={6} />; })()}
          {/* 8 literas */}
          {cucheta(-1, 0.9, 1.5, 2)}{cucheta(1, 0.9, 1.5, 3)}
          {cucheta(-1, 0.12, 0.75, 0)}{cucheta(1, 0.12, 0.75, 1)}
        </g>
      </svg>
      {/* luz de la lámpara (gradiente plano, un solo nodo) + viñeta cálida */}
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${lx}px ${ly + 40}px, rgba(255,200,110,${lampara ? 0.34 : 0}) 0px, rgba(255,170,80,${lampara ? 0.12 : 0}) 380px, rgba(20,8,0,.45) 1100px)` }} />
      {lampara && (
        <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
          <line x1={960 - dx * 0.2} y1={-10} x2={lx} y2={ly - 30} stroke="#2a1608" strokeWidth={5} />
          <g transform={`translate(${lx} ${ly}) scale(1.7)`}>
            <path d="M -46 0 Q 0 40 50 0 L 64 -6 Q 0 -22 -46 0 Z" fill="#c9862a" />
            <ellipse cx={0} cy={-6} rx={46} ry={12} fill="#e8b04a" />
            <path d={`M 60 -10 Q ${66 + Math.sin(t * 13) * 4} ${-46 - Math.sin(t * 9) * 8} 72 -10 Z`} fill="#ffd27a" />
            <path d={`M 63 -10 Q ${66 + Math.sin(t * 13) * 3} ${-30 - Math.sin(t * 9) * 5} 69 -10 Z`} fill="#fff6c8" />
          </g>
        </svg>
      )}
    </AbsoluteFill>
  );
};

// PLAZA DE ARMAS: arena rastrillada, postes de práctica (palus) que fugan, armero con espadas de madera y escudos de mimbre,
// muñeco de paja, empalizada lejana con bruma. angulo "bajo": un poste enorme en primer plano contra el cielo.
export const PlazaArmas: React.FC<LugarP & { angulo?: "general" | "bajo" }> = ({ t, dx = 0, hora = "dia", angulo = "general" }) => {
  fijarLuz(hora === "dia" ? "polvo" : hora);
  const N = hora === "noche";
  const arena = N ? ["#4a3a6a", "#3a2c58"] : hora === "tarde" ? ["#e0a070", "#c88050"] : ["#ecc88a", "#d8ae6a"];
  const bajo = angulo === "bajo";
  const H = bajo ? 900 : 610;
  const poste = (x: number, yb: number, s: number, k: number) => (
    <g key={k} transform={`translate(${x} ${yb}) scale(${s})`}>
      <ellipse cx={-40 * luzActual().lado} cy={0} rx={70} ry={12} fill="#1d0f33" opacity={0.22} />
      <rect x={-24} y={-330} width={48} height={330} rx={8} fill="#8a5a2e" />
      <rect x={-24} y={-330} width={14} height={330} fill="#6b4220" />
      <rect x={14} y={-330} width={10} height={330} fill="#c08a4e" opacity={0.7} />
      {[-250, -170].map((yy) => <rect key={yy} x={-28} y={yy} width={56} height={26} fill="#d8b860" />)}
      {[-290, -210, -130].map((yy, i) => <line key={i} x1={-20} y1={yy} x2={6} y2={yy + 12} stroke="#4a2a10" strokeWidth={4} />)}
    </g>
  );
  return (
    <AbsoluteFill style={{ background: cielo(hora) }}>
      {N ? <Estrellas t={t} n={60} alto={500} /> : <Nubes t={t} seed={23} op={hora === "tarde" ? 0.35 : 0.9} />}
      <Cordillera y={H - 30} color={LEJOS[hora][0]} alto={90} seed={71} dx={dx * 0.1} />
      <Bruma y0={H - 140} y1={H} op={0.4} />
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${-dx * 0.3}px)` }}>
        <Empalizada y={H + 10} alto={bajo ? 50 : 70} x0={-400} x1={2600} color={N ? "#4a3060" : "#c0905a"} color2={N ? "#3a2450" : "#a07448"} />
        {!bajo && <><Torre x={420} y={H + 14} s={0.48} /><Torre x={1500} y={H + 14} s={0.48} /></>}
      </div>
      <Bruma y0={H - 80} y1={H + 20} op={0.3} />
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <rect x={0} y={H + 8} width={1920} height={1080 - H} fill={arena[0]} />
        {/* rastrillado: arcos concéntricos */}
        <g transform={`translate(${-dx * 0.8} 0)`} fill="none" stroke={arena[1]} strokeWidth={5}>
          {Array.from({ length: 9 }, (_, i) => <ellipse key={i} cx={960} cy={H + 900} rx={500 + i * 170} ry={(200 + i * 60) * (bajo ? 0.25 : 1)} />)}
        </g>
        {!bajo && (
          <g transform={`translate(${-dx * 0.6} 0)`}>
            {/* armero */}
            <g transform="translate(250 760) scale(0.62)">
              <ellipse cx={-30} cy={6} rx={170} ry={14} fill="#1d0f33" opacity={0.2} />
              <rect x={-150} y={-200} width={16} height={206} fill="#6b3a1f" /><rect x={134} y={-200} width={16} height={206} fill="#6b3a1f" />
              <rect x={-160} y={-210} width={320} height={18} fill="#8a5a2e" /><rect x={-160} y={-60} width={320} height={14} fill="#8a5a2e" />
              {[-110, -60, -10, 40, 90].map((xx) => <g key={xx}><rect x={xx} y={-200} width={16} height={150} rx={6} fill="#c09060" /><rect x={xx - 10} y={-80} width={36} height={8} fill="#6b3a1f" /></g>)}
              {[-90, 60].map((xx) => <g key={xx} transform={`translate(${xx} -40)`}><rect x={-46} y={-10} width={92} height={60} rx={20} fill="#c8a060" /><path d="M -40 0 L 40 0 M -40 14 L 40 14 M -40 28 L 40 28" stroke="#9a7040" strokeWidth={4} /></g>)}
            </g>
            {/* muñeco de paja */}
            <g transform="translate(620 700) scale(0.5)">
              <rect x={-8} y={-300} width={16} height={300} fill="#6b3a1f" /><rect x={-110} y={-230} width={220} height={14} fill="#6b3a1f" />
              <ellipse cx={0} cy={-200} rx={70} ry={90} fill="#e0c060" /><circle cx={0} cy={-320} r={44} fill="#e0c060" />
              <circle cx={0} cy={-200} r={30} fill="none" stroke="#c81d2e" strokeWidth={8} /><circle cx={0} cy={-200} r={8} fill="#c81d2e" />
            </g>
            {/* postes que fugan hacia el fondo */}
            {[[1180, 680, 0.42], [1330, 712, 0.52], [1500, 752, 0.64], [1700, 805, 0.8]].map(([x, y, s], i) => poste(x, y, s, i))}
          </g>
        )}
        {bajo && poste(1560 - dx * 0.7, 1120, 2.7, 9)}
      </svg>
      <Suelo y={H + 8} hora={hora} dx={dx} seed={14} />
      <Tinte color={TINTE[hora][0]} op={TINTE[hora][1]} />
    </AbsoluteFill>
  );
};

// PUERTA PRETORIA: muro de piedra con 2 torres, arco con puertas de madera que se abren (abre 0-1) y se ve el camino de
// afuera, centinelas en el adarve y 2 guardias con lanza y escudo junto a la puerta (guardia={false} los saca).
export const PuertaPretoria: React.FC<LugarP & { abre?: number; guardia?: boolean }> = ({ t, dx = 0, hora = "dia", abre = 0, guardia = true }) => {
  fijarLuz(hora);
  const N = hora === "noche";
  const piedra = N ? ["#6a5a8a", "#58487a", "#4a3c68"] : hora === "tarde" ? ["#e0b08a", "#c89470", "#a87858"] : ["#dcc8a0", "#c4ae86", "#a8926a"];
  const AX = 960, AW = 180, AT = 520, AB = 900; // arco: centro, medio ancho, arranque del semicírculo, base
  const arco = `M ${AX - AW} ${AB} L ${AX - AW} ${AT} A ${AW} ${AW} 0 0 1 ${AX + AW} ${AT} L ${AX + AW} ${AB} Z`;
  const muro = `M -60 380 L 1980 380 L 1980 ${AB} L -60 ${AB} Z ${arco}`;
  const id = "pp" + Math.round(dx);
  const ab = Math.max(0, Math.min(1, abre));
  return (
    <AbsoluteFill style={{ background: cielo(hora) }}>
      {N ? <Estrellas t={t} n={60} alto={420} /> : <Nubes t={t} seed={29} op={hora === "tarde" ? 0.35 : 0.95} />}
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${-dx * 0.5}px)` }}>
        {/* lo de afuera (se ve por el arco) */}
        <Cordillera y={700} color={LEJOS[hora][0]} alto={130} seed={83} />
        <Bruma y0={560} y1={720} op={0.5} />
        <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
          <path d="M -100 720 Q 600 680 960 700 T 2100 690 L 2100 1080 L -100 1080 Z" fill={N ? "#2a2058" : hora === "tarde" ? "#9a5a6a" : "#9cc98a"} />
          <path d="M 940 700 L 980 700 L 1160 900 L 760 900 Z" fill={N ? "#5a4c80" : "#d8c09a"} />
        </svg>
        <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
          <defs><clipPath id={id}><path d={muro} clipRule="evenodd" /></clipPath><clipPath id={id + "a"}><path d={arco} /></clipPath></defs>
          {/* puertas (abren hacia adentro: se angostan sobre la bisagra) */}
          <g clipPath={`url(#${id}a)`}>
            {[-1, 1].map((s) => {
              const w = AW * (1 - ab * 0.82);
              const x0 = s < 0 ? AX - AW : AX + AW - w;
              return (
                <g key={s}>
                  <rect x={x0} y={AT - AW} width={w} height={AB - AT + AW} fill={s < 0 ? "#8a5a2e" : "#7a4a22"} />
                  {Array.from({ length: 5 }, (_, i) => <line key={i} x1={x0 + (w * (i + 1)) / 6} y1={AT - AW} x2={x0 + (w * (i + 1)) / 6} y2={AB} stroke="#5a3418" strokeWidth={4} />)}
                  {[AT - 60, AT + 120, AB - 80].map((yy) => <rect key={yy} x={x0} y={yy} width={w} height={20} fill="#3a3a44" />)}
                </g>
              );
            })}
          </g>
          {/* muro con hueco del arco */}
          <path d={muro} fillRule="evenodd" fill={piedra[0]} />
          <g clipPath={`url(#${id})`} fill="none" stroke={piedra[2]} strokeWidth={4}>
            {Array.from({ length: 9 }, (_, j) => <g key={j}><line x1={-60} y1={380 + j * 58} x2={1980} y2={380 + j * 58} />{Array.from({ length: 22 }, (_, i) => <line key={i} x1={i * 96 + (j % 2) * 48 - 40} y1={380 + j * 58} x2={i * 96 + (j % 2) * 48 - 40} y2={438 + j * 58} />)}</g>)}
          </g>
          <path d={`M ${AX - AW - 26} ${AB} L ${AX - AW - 26} ${AT} A ${AW + 26} ${AW + 26} 0 0 1 ${AX + AW + 26} ${AT} L ${AX + AW + 26} ${AB}`} fill="none" stroke={piedra[1]} strokeWidth={26} />
          <rect x={AX - 120} y={AT - AW - 120} width={240} height={70} rx={8} fill={piedra[2]} />
          <text x={AX} y={AT - AW - 70} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={46} fill={N ? "#e8dcff" : "#5a3418"}>SPQR</text>
          {/* almenas */}
          {Array.from({ length: 30 }, (_, i) => <rect key={i} x={-60 + i * 70} y={346} width={40} height={40} fill={piedra[1]} />)}
          {/* torres */}
          {[-1, 1].map((s) => {
            const x = AX + s * 340;
            return (
              <g key={s}>
                <rect x={x - 120} y={230} width={240} height={AB - 230} fill={piedra[s < 0 ? 1 : 0]} />
                <rect x={x + luzActual().lado * 100 - 10} y={230} width={20} height={AB - 230} fill={N ? "#b9a8e8" : "#fff3c8"} opacity={0.35} />
                {Array.from({ length: 4 }, (_, i) => <rect key={i} x={x - 120 + i * 66} y={196} width={42} height={40} fill={piedra[s < 0 ? 1 : 0]} />)}
                <path d={`M ${x - 26} 420 L ${x - 26} 360 A 26 26 0 0 1 ${x + 26} 360 L ${x + 26} 420 Z`} fill="#2a1a20" />
                <rect x={x - 46} y={500} width={92} height={210} fill="#c81d2e" />
                <rect x={x - 46} y={500} width={92} height={16} fill="#e2a531" />
                <path d={`M ${x - 46} 710 L ${x} 750 L ${x + 46} 710 Z`} fill="#c81d2e" />
                <circle cx={x} cy={600} r={26} fill="none" stroke="#e2a531" strokeWidth={6} />
              </g>
            );
          })}
          <rect x={-60} y={AB} width={2040} height={180} fill={N ? "#2e2246" : "#c49a62"} />
          <path d={`M ${AX - AW} ${AB} L ${AX + AW} ${AB} L ${AX + AW + 260} 1080 L ${AX - AW - 260} 1080 Z`} fill={N ? "#5a4c80" : "#e0cca4"} />
          <rect x={-60} y={AB} width={2040} height={14} fill="#1d0f33" opacity={0.16} />
        </svg>
        {/* centinelas en el adarve */}
        <FilaLejana y={350} x0={260 + Math.sin(t * 0.4) * 30} n={3} paso={70} s={0.8} t={t} />
        <FilaLejana y={350} x0={1380 - Math.sin(t * 0.4) * 30} n={3} paso={70} s={0.8} t={t} />
        {guardia && [-1, 1].map((s) => (
          <Persona key={s} x={AX + s * 300} y={AB + 6} h={300} t={t} seed={900 + s} casco="legion" flip={s > 0} giro="34" bD={20} cD={60} bI={35} cI={70}
            agarra={<EnMano.lanza />} agarraAng={-90} agarraI={<EnMano.escudo />} agarraAngI={0} />
        ))}
      </div>
      <Tinte color={TINTE[hora][0]} op={TINTE[hora][1]} />
    </AbsoluteFill>
  );
};

// ── OBJETOS PARA AGARRAR (props `agarra` / `agarraI` de Persona). Mango en (0,0), el objeto apunta a +x; girarlo con agarraRot.
export const EnMano = {
  gladius: ({ madera }: { madera?: boolean }) => (
    <g>
      <rect x={-26} y={-9} width={52} height={18} rx={8} fill={madera ? "#8a5a2e" : "#6b3a1f"} />
      <rect x={24} y={-22} width={14} height={44} rx={5} fill={madera ? "#a0682e" : "#e2a531"} />
      <path d={`M 38 -13 L 190 -11 L 216 0 L 190 11 L 38 13 Z`} fill={madera ? "#c09060" : "#dfe5ee"} />
      {!madera && <path d="M 40 -3 L 200 -2" stroke="#fff" strokeWidth={4} opacity={0.8} />}
    </g>
  ),
  pala: () => (
    <g>
      <rect x={-60} y={-8} width={260} height={16} rx={7} fill="#8a5a2e" />
      <path d="M 196 -36 L 290 -30 Q 316 0 290 30 L 196 36 Z" fill="#9aa4b2" />
      <path d="M 200 -28 L 280 -24" stroke="#dfe5ee" strokeWidth={5} />
    </g>
  ),
  pico: () => (
    <g>
      <rect x={-50} y={-8} width={240} height={16} rx={7} fill="#8a5a2e" />
      <path d="M 186 -6 Q 210 -110 150 -150 Q 222 -110 206 -6 Q 222 90 170 130 Q 200 80 186 6 Z" fill="#8a93a3" />
    </g>
  ),
  lanza: () => (
    <g>
      <rect x={-150} y={-6} width={480} height={12} rx={6} fill="#7a4a22" />
      <path d="M 326 -14 L 400 0 L 326 14 Z" fill="#dfe5ee" />
    </g>
  ),
  antorcha: ({ t = 0 }: { t?: number }) => (
    <g>
      <rect x={-30} y={-9} width={160} height={18} rx={8} fill="#6b3a1f" />
      <rect x={118} y={-14} width={26} height={28} rx={4} fill="#3a2a20" />
      <g transform={`translate(150 0) rotate(${-90 + Math.sin(t * 9) * 8})`}>
        <path d={`M -22 0 Q -30 ${-50 - Math.sin(t * 13) * 10} 0 ${-96 - Math.sin(t * 11) * 12} Q 30 ${-50 - Math.cos(t * 12) * 8} 22 0 Z`} fill="#ff7a3d" />
        <path d={`M -12 0 Q -14 -36 0 ${-60 - Math.sin(t * 15) * 8} Q 14 -36 12 0 Z`} fill="#ffd27a" />
      </g>
    </g>
  ),
  escudo: ({ color = "#c81d2e" }: { color?: string }) => (
    <g transform="rotate(90)">
      <rect x={-60} y={-90} width={120} height={180} rx={22} fill={color} />
      <rect x={-60} y={-90} width={120} height={180} rx={22} fill="none" stroke="#e2a531" strokeWidth={8} />
      <circle cx={0} cy={0} r={22} fill="#e2a531" />
    </g>
  ),
  esponja: () => (
    <g>
      <rect x={-20} y={-6} width={210} height={12} rx={6} fill="#a0682e" />
      <ellipse cx={210} cy={0} rx={34} ry={26} fill="#e8c860" />
      {[[-12, -8], [8, 6], [14, -12], [-6, 12]].map(([a, b], i) => <circle key={i} cx={210 + a} cy={b} r={5} fill="#c8a040" />)}
    </g>
  ),
  tablilla: ({ texto = "" }: { texto?: string }) => (
    <g transform="rotate(-90) translate(0 -20)">
      <rect x={-60} y={-110} width={120} height={150} rx={10} fill="#c9a36a" />
      <rect x={-48} y={-98} width={96} height={126} rx={6} fill="#3a2a20" />
      {texto ? <TextoMano x={0} y={-30} padre={-90} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={30} fill="#e8d8b8">{texto}</TextoMano> : [0, 1, 2, 3].map((i) => <line key={i} x1={-36} y1={-80 + i * 26} x2={30 - (i % 2) * 20} y2={-80 + i * 26} stroke="#e8d8b8" strokeWidth={5} strokeLinecap="round" />)}
    </g>
  ),
  bolsa: ({ txt }: { txt?: string }) => (
    <g transform="rotate(-90)">
      <path d="M -14 -6 L 14 -6 L 12 14 Q 70 30 64 100 Q 56 150 0 150 Q -56 150 -64 100 Q -70 30 -12 14 Z" fill="#a8743a" />
      <rect x={-20} y={-2} width={40} height={14} rx={5} fill="#6b3a1f" />
      {txt && <TextoMano x={0} y={100} padre={-90} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={34} fill="#fff3d6">{txt}</TextoMano>}
    </g>
  ),
  copa: () => (
    <g transform="rotate(-90)">
      <path d="M -40 -80 L 40 -80 L 30 -10 Q 0 6 -30 -10 Z" fill="#c9862a" />
      <rect x={-6} y={-10} width={12} height={30} fill="#a8650f" /><ellipse cx={0} cy={22} rx={26} ry={8} fill="#a8650f" />
      <ellipse cx={0} cy={-80} rx={40} ry={9} fill="#7a2a3a" />
    </g>
  ),
  martillo: () => (
    <g>
      <rect x={-40} y={-8} width={200} height={16} rx={7} fill="#8a5a2e" />
      <rect x={150} y={-40} width={44} height={80} rx={8} fill="#6a7280" />
    </g>
  ),
  pergamino: () => (
    <g transform="rotate(-90)">
      <rect x={-20} y={-140} width={40} height={150} fill="#f6e3b4" />
      <rect x={-28} y={-146} width={56} height={14} rx={7} fill="#c98f4a" /><rect x={-28} y={4} width={56} height={14} rx={7} fill="#c98f4a" />
    </g>
  ),
  pluma: () => (
    <g transform="rotate(-60)">
      <path d="M 0 0 Q -30 -90 10 -170 Q 40 -90 6 0 Z" fill="#fff6e8" />
      <line x1={3} y1={0} x2={10} y2={-160} stroke="#c9b9a0" strokeWidth={4} />
      <line x1={3} y1={0} x2={0} y2={30} stroke="#2b2b2b" strokeWidth={5} strokeLinecap="round" />
    </g>
  ),
  garrote: () => (
    <g>
      <path d="M -30 -8 L 180 -16 Q 230 0 180 22 L -30 8 Z" fill="#6b3a1f" />
      {[60, 120, 170].map((x) => <circle key={x} cx={x} cy={-4} r={7} fill="#4a2a10" />)}
    </g>
  ),
};

// ── MULTITUD: N personas con altura ±8 %, desfase de animación, 3-4 poses mezcladas, escala y altura por profundidad
// (filas de atrás más chicas, más arriba y con bruma), y algunos que «rompen» (miran a otro lado / bostezan).
export type PoseMult = "quieto" | "brazos" | "cadera" | "señala" | Accion;
export const Multitud: React.FC<{
  t: number; n: number; x0?: number; x1?: number; y?: number; h?: number; filas?: number; seed?: number;
  casco?: "no" | "legion" | "centurion" | "mixto"; ropa?: "legion" | "civil" | Ropa; accion?: Accion; vel?: number; poses?: PoseMult[];
  rompe?: number; expr?: Expr; mira?: number; giro?: Giro; flip?: boolean; habla?: boolean; aparece?: number; reaccion?: Reaccion; reaccionT0?: number;
}> = ({ t, n, x0 = 260, x1 = 1660, y = 1000, h = 380, filas, seed = 1, casco = "legion", ropa = "legion", accion, vel = 0.7, poses, rompe, expr = "neutro", mira = 0, giro, flip, habla, aparece, reaccion, reaccionT0 }) => {
  const r = rnd(seed * 97 + 13);
  const F = filas ?? Math.max(1, Math.min(4, Math.ceil(n / 7)));
  const porFila = Math.ceil(n / F);
  const romp = rompe ?? (n >= 5 ? Math.max(1, Math.round(n / 9)) : 0);
  const mezclaPoses: PoseMult[] = poses ?? (accion ? [accion, accion, accion, "quieto"] : ["quieto", "brazos", "cadera", "quieto", "señala"]);
  type Uno = { x: number; y: number; h: number; k: number; i: number; pose: PoseMult; d: number; rompe: 0 | 1 | 2; casco: "no" | "legion" | "centurion"; ropa: Ropa; flip: boolean };
  const gente: Uno[] = [];
  let i = 0;
  for (let f = F - 1; f >= 0; f--) {
    const esc = 1 - f * 0.17;
    const yy = y - f * h * 0.2;
    const cnt = Math.min(porFila, n - (F - 1 - f) * porFila);
    const ancho = (x1 - x0) * (1 - f * 0.08);
    const cx = (x0 + x1) / 2;
    for (let j = 0; j < Math.max(0, cnt); j++) {
      const u = cnt > 1 ? j / (cnt - 1) : 0.5;
      const x = cx - ancho / 2 + u * ancho + (f % 2 ? ancho / cnt / 2 : 0) * (j === cnt - 1 ? 0 : 1) + (r() - 0.5) * 30;
      const ro: Ropa = typeof ropa === "object" ? ropa : ropa === "civil" ? CIVIL(i + seed) : { ...LUCIUS, tunica: ["#d8443a", "#c83a3a", "#e04a40", "#b8362f"][i % 4], piel: CIVIL(i + seed).piel, piel2: CIVIL(i + seed).piel2, pelo: CIVIL(i + seed).pelo };
      const ca = casco === "mixto" ? (r() < 0.3 ? "no" : "legion") : casco;
      gente.push({ x, y: yy + (r() - 0.5) * 10, h: h * esc * (1 + (r() - 0.5) * 0.16), k: f, i, pose: mezclaPoses[Math.floor(r() * mezclaPoses.length)], d: r(), rompe: 0, casco: ca, ropa: ro, flip: flip ?? false });
      i++;
    }
  }
  // los que rompen: elegidos al azar (no en la fila de atrás si hay varias)
  const cand = gente.map((_, k) => k).filter((k) => F === 1 || gente[k].k < F - 1);
  for (let q = 0; q < romp && cand.length; q++) { const k = cand.splice(Math.floor(r() * cand.length), 1)[0]; gente[k].rompe = q % 2 === 0 ? 1 : 2; }
  // ordenar: atrás primero; dentro de la fila, de izquierda a derecha
  const filasOrden = Array.from({ length: F }, (_, k) => F - 1 - k);
  return (
    <>
      {filasOrden.map((f) => (
        <React.Fragment key={f}>
          {gente.filter((g) => g.k === f).map((g) => {
            const tt = t + g.d * 0.6;
            let a: { bI?: number; bD?: number; cI?: number; cD?: number; inclina?: number } = {};
            if (g.pose === "quieto") a = { bI: 6 + g.d * 8, bD: 6 + g.d * 6 };
            else if (g.pose === "brazos") a = { bI: 55, cI: 125, bD: 55, cD: 125 };
            else if (g.pose === "cadera") a = { bI: 35, cI: 120, bD: 35, cD: 120 };
            else if (g.pose === "señala") a = { bI: 8, bD: 95 + Math.sin(tt * 2) * 6, cD: 5 };
            else a = pose(g.pose, tt, vel);
            let ex: Expr = expr, mi = mira + (g.d - 0.5) * 0.6, gi = giro, fl = g.flip, la = 0;
            if (g.rompe === 1) { gi = "34"; fl = !fl; mi = -1; }
            if (g.rompe === 2) { ex = "dormido"; a = { bI: 10, bD: 150, cD: 150, inclina: -4 }; la = 10; }
            return (
              <Persona key={g.i} x={g.x} y={g.y} h={g.h} t={t} seed={4000 + seed * 100 + g.i} ropa={g.ropa} casco={g.casco} expr={ex} mira={mi} giro={gi} flip={fl}
                habla={habla && g.d < 0.5} ladea={la} bruma={g.k * 0.22} aparece={aparece === undefined ? undefined : aparece + g.d * 0.4 + g.k * 0.1}
                reaccion={g.rompe ? undefined : reaccion} reaccionT0={reaccionT0 === undefined ? undefined : reaccionT0 + g.d * 0.25} {...a} />
            );
          })}
        </React.Fragment>
      ))}
    </>
  );
};

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

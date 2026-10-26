import React from "react";
import { interpolate, Easing } from "remotion";
import { rnd } from "../soot/lib";
import { C, ent, fontFamily, prog } from "./kit";

// Objetos de soot10 como grupos SVG en coordenadas de mundo (o del barco). Van dentro de <G>.
// <P> los hace entrar con rebote (t0) y salir (t1). Vector plano saturado, sombra propia y brillo.
export const TINTA = "#2a1530";
export const G: React.FC<{ children: React.ReactNode; op?: number }> = ({ children, op = 1 }) => (
  <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: op }} width={1} height={1}>{children}</svg>
);
// marcador de SFX: no dibuja nada; lo lee cues_soot10.py (t = segundo, p = pool, g = dB, d = duración)
export const S: React.FC<{ t: number; p: string; g?: number; d?: number; pitch?: number }> = () => null;

export const P: React.FC<{ t: number; t0?: number; t1?: number; x: number; y: number; s?: number; rot?: number; children: React.ReactNode; flota?: boolean; op?: number }> = ({ t, t0, t1 = 1e9, x, y, s = 1, rot = 0, children, flota, op = 1 }) => {
  if (t0 !== undefined && t < t0) return null;
  if (t > t1 + 0.3) return null;
  const e = t0 === undefined ? 1 : ent(t, t0, 0, { damping: 10, stiffness: 190 });
  const out = interpolate(t, [t1, t1 + 0.25], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const f = flota ? Math.sin(t * 2.2 + x) * 8 : 0;
  return <g transform={`translate(${x} ${y + f}) scale(${s * e * out}) rotate(${rot + (1 - e) * -16})`} opacity={op}>{children}</g>;
};
// trayectoria en arco de a → b entre ta y tb (objetos arrojados, saqueo)
export const arco = (t: number, ta: number, tb: number, a: [number, number], b: [number, number], alto = 300) => {
  const u = interpolate(t, [ta, tb], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  return { x: a[0] + (b[0] - a[0]) * u, y: a[1] + (b[1] - a[1]) * u - Math.sin(u * Math.PI) * alto, u };
};
const Br: React.FC<{ d: string; w?: number }> = ({ d, w = 8 }) => <path d={d} stroke="#fff" strokeOpacity={0.5} strokeWidth={w} fill="none" strokeLinecap="round" />;

export const Moneda8: React.FC<{ r?: number; oro?: boolean; t?: number; gira?: number }> = ({ r = 40, oro, t = 0, gira = 0 }) => {
  const sx = gira ? Math.max(0.12, Math.abs(Math.cos(t * gira * Math.PI))) : 1;
  const c = oro ? ["#ffe27a", "#e9a92a", "#a8650f"] : ["#f4f6fa", "#b9c0cc", "#7a8393"];
  return (
    <g transform={`scale(${sx} 1)`}>
      <circle cx={4} cy={6} r={r} fill={c[2]} />
      <circle r={r} fill={c[1]} />
      <circle r={r * 0.78} fill={c[0]} />
      <text y={r * 0.34} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={r * 0.9} fill={c[2]}>8</text>
      <Br d={`M ${-r * 0.5} ${-r * 0.4} Q ${-r * 0.2} ${-r * 0.75} ${r * 0.25} ${-r * 0.7}`} w={r * 0.12} />
    </g>
  );
};
export const Pila: React.FC<{ n: number; t?: number; t0?: number; oro?: boolean }> = ({ n, t = 99, t0 = 0, oro }) => (
  <g>
    {Array.from({ length: Math.ceil(n * 2) }, (_, i) => {
      const half = i + 1 > n * 2 - 0.01 && n % 1 !== 0;
      const ap = t >= t0 + i * 0.06;
      if (!ap) return null;
      return <g key={i} transform={`translate(0 ${-i * 22})`}><ellipse cx={0} cy={0} rx={half ? 24 : 54} ry={16} fill={oro ? "#a8650f" : "#7a8393"} /><ellipse cx={0} cy={-8} rx={half ? 24 : 54} ry={16} fill={oro ? "#ffd04a" : "#dfe4ec"} /></g>;
    })}
  </g>
);
export const Galleta: React.FC<{ t?: number; bichos?: number; mordida?: boolean; camina?: number }> = ({ t = 0, bichos = 0, mordida, camina = 0 }) => (
  <g>
    {camina > 0 && [-50, -20, 20, 50].map((x, i) => <line key={i} x1={x} y1={30} x2={x + Math.sin(t * 22 + i * 2) * 14} y2={58} stroke="#5a3418" strokeWidth={8} strokeLinecap="round" />)}
    <rect x={-84} y={-58} width={176} height={104} rx={26} fill="#a87a3a" />
    <rect x={-90} y={-66} width={176} height={104} rx={26} fill="#e0b26a" />
    {[[-50, -30], [0, -30], [50, -30], [-50, 10], [0, 10], [50, 10]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={7} fill="#a87a3a" />)}
    {mordida && <circle cx={84} cy={-60} r={40} fill="rgba(0,0,0,0)" stroke="none" />}
    {Array.from({ length: bichos }, (_, i) => {
      const r = rnd(i + 3);
      const a = t * (1 + r()) * 1.6 + i * 2;
      const x = Math.cos(a) * (40 + r() * 40), y = -14 + Math.sin(a * 1.3) * 34;
      return <Gorgojo key={i} x={x} y={y} rot={(a * 57) % 360} t={t} s={0.55} />;
    })}
  </g>
);
export const Gorgojo: React.FC<{ x?: number; y?: number; rot?: number; t?: number; s?: number }> = ({ x = 0, y = 0, rot = 0, t = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {[-1, 1].map((d) => [-10, 0, 10].map((k) => <line key={`${d}${k}`} x1={k} y1={0} x2={k + Math.sin(t * 30 + k) * 5} y2={d * 18} stroke="#2a1a10" strokeWidth={4} />))}
    <ellipse cx={0} cy={0} rx={22} ry={12} fill="#5a3418" />
    <circle cx={22} cy={0} r={8} fill="#3a1c10" />
    <line x1={28} y1={0} x2={44} y2={-4} stroke="#3a1c10" strokeWidth={4} />
    <circle cx={-6} cy={-4} r={4} fill="#fff" opacity={0.4} />
  </g>
);
export const Queso: React.FC<{ t?: number; cara?: boolean; habla?: boolean; verde?: number }> = ({ t = 0, cara, habla, verde = 0 }) => (
  <g>
    <path d="M -110 50 L 110 50 L 110 -20 L -110 -60 Z" fill={verde > 0.5 ? "#c9c46a" : "#f2c548"} />
    <path d="M -110 -60 L 110 -20 L 60 -70 L -150 -90 Z" fill={verde > 0.5 ? "#dcd88a" : "#ffd968"} />
    {[[-60, 0, 14], [30, 20, 10], [70, -10, 8]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#d9a020" />)}
    {verde > 0 && [[-80, 30], [40, -30], [80, 30]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={18 * verde} fill="#7aa85a" opacity={0.8} />)}
    {cara && (
      <g>
        <ellipse cx={-30} cy={-6} rx={12} ry={15} fill="#fff" /><ellipse cx={20} cy={-2} rx={12} ry={15} fill="#fff" />
        <circle cx={-26} cy={-4} r={6} fill={TINTA} /><circle cx={24} cy={0} r={6} fill={TINTA} />
        <line x1={-44} y1={-28} x2={-16} y2={-20} stroke={TINTA} strokeWidth={6} strokeLinecap="round" />
        <line x1={8} y1={-18} x2={36} y2={-24} stroke={TINTA} strokeWidth={6} strokeLinecap="round" />
        <ellipse cx={-2} cy={26} rx={16} ry={habla ? 4 + Math.abs(Math.sin(t * 14)) * 10 : 3} fill="#5a1a22" />
      </g>
    )}
  </g>
);
export const Carne: React.FC<{ gris?: number }> = ({ gris = 0 }) => {
  const c = gris > 0.5 ? ["#9a9494", "#7a7474"] : ["#d9534a", "#a8342e"];
  return (
    <g>
      <path d="M -100 -10 Q -110 -70 -30 -70 Q 70 -80 100 -20 Q 110 40 30 50 Q -80 60 -100 -10 Z" fill={c[1]} />
      <path d="M -90 -16 Q -96 -62 -30 -62 Q 60 -70 90 -24 Q 96 30 30 40 Q -72 48 -90 -16 Z" fill={c[0]} />
      <path d="M -50 -40 Q 0 -20 50 -40 M -40 0 Q 10 20 60 0" stroke="#fff" strokeOpacity={0.4} strokeWidth={8} fill="none" />
      {gris > 0.5 && [[-60, -20], [-20, 10], [30, -20], [60, 10]].map(([x, y], i) => <path key={i} d={`M ${x} ${y} q 10 30 0 60`} stroke="#8a8484" strokeWidth={6} fill="none" />)}
    </g>
  );
};
export const Arvejas: React.FC = () => (
  <g>
    <path d="M -80 0 Q -80 50 0 50 Q 80 50 80 0 Z" fill="#8a5a2a" />
    {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={-56 + (i % 5) * 28} cy={-6 - Math.floor(i / 5) * 18} r={14} fill="#7ac85a" />)}
  </g>
);
export const Diente: React.FC = () => (
  <g><path d="M -26 -30 Q 0 -44 26 -30 Q 30 0 20 30 L 10 10 L 0 34 L -10 10 L -20 30 Q -30 0 -26 -30 Z" fill="#fff8e8" stroke={TINTA} strokeWidth={4} /></g>
);
export const Limon: React.FC = () => (
  <g>
    <ellipse cx={4} cy={6} rx={70} ry={52} fill="#c9a010" />
    <ellipse rx={70} ry={52} fill="#ffe04a" />
    <path d="M 64 -10 L 86 -16 L 70 6 Z" fill="#c9a010" />
    <path d="M -50 -20 Q -30 -40 0 -40" stroke="#fff" strokeOpacity={0.6} strokeWidth={10} fill="none" strokeLinecap="round" />
    <path d="M -40 -50 Q -60 -90 -10 -80 Q -10 -56 -40 -50 Z" fill="#3fb85a" />
  </g>
);
export const Mosquito: React.FC<{ t: number; s?: number }> = ({ t, s = 1 }) => (
  <g transform={`scale(${s})`}>
    {[-1, 1].map((d) => <ellipse key={d} cx={d * 10} cy={-26} rx={14} ry={30} transform={`rotate(${d * (30 + Math.sin(t * 60) * 25)} 0 -6)`} fill="#dff4ff" opacity={0.75} />)}
    <ellipse cx={0} cy={0} rx={12} ry={26} fill="#3a2a2a" />
    <circle cx={0} cy={-30} r={11} fill="#2a1a1a" />
    <line x1={0} y1={-38} x2={0} y2={-70} stroke="#2a1a1a" strokeWidth={3} />
    {[-1, 1].map((d) => [0, 12, 24].map((k) => <line key={`${d}${k}`} x1={0} y1={k - 10} x2={d * 34} y2={k + 6} stroke="#2a1a1a" strokeWidth={3} />))}
    <circle cx={-4} cy={-32} r={4} fill="#ff3a3a" />
  </g>
);
export const Microbio: React.FC<{ t: number; c?: string; s?: number }> = ({ t, c = "#9be15d", s = 1 }) => (
  <g transform={`scale(${s}) rotate(${Math.sin(t * 2) * 10})`}>
    {Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return <line key={i} x1={Math.cos(a) * 50} y1={Math.sin(a) * 50} x2={Math.cos(a) * (72 + Math.sin(t * 8 + i) * 6)} y2={Math.sin(a) * (72 + Math.sin(t * 8 + i) * 6)} stroke={c} strokeWidth={8} strokeLinecap="round" />; })}
    <circle r={56} fill={c} />
    <circle cx={-18} cy={-8} r={12} fill="#fff" /><circle cx={18} cy={-8} r={12} fill="#fff" />
    <circle cx={-15} cy={-6} r={6} fill={TINTA} /><circle cx={21} cy={-6} r={6} fill={TINTA} />
    <path d="M -22 18 Q 0 34 22 18" stroke={TINTA} strokeWidth={6} fill="none" strokeLinecap="round" />
    <path d="M -34 -26 L -6 -18 M 34 -26 L 6 -18" stroke={TINTA} strokeWidth={6} strokeLinecap="round" />
  </g>
);
export const Cofre: React.FC<{ t?: number; abre?: number; txt?: string; brillo?: boolean; color?: string }> = ({ t = 0, abre = 0, txt, brillo, color = "#8a4520" }) => (
  <g>
    {brillo && abre > 0.2 && Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + (i - 4.5) * 0.22; return <path key={i} d={`M 0 -60 L ${Math.cos(a - 0.05) * 420} ${-60 + Math.sin(a - 0.05) * 420} L ${Math.cos(a + 0.05) * 420} ${-60 + Math.sin(a + 0.05) * 420} Z`} fill="#fff3c4" opacity={0.3 * abre * (0.7 + 0.3 * Math.sin(t * 5 + i))} />; })}
    <rect x={-130} y={-70} width={260} height={150} rx={14} fill={color} />
    <rect x={-130} y={-70} width={260} height={24} fill="#f7c548" />
    <rect x={-20} y={-60} width={40} height={50} rx={6} fill="#f7c548" />
    <g transform={`translate(0 -70) rotate(${-abre * 105} -130 0)`}>
      <path d="M -130 0 Q -130 -80 0 -84 Q 130 -80 130 0 Z" fill={color} />
      <path d="M -130 0 Q -130 -80 0 -84 Q 130 -80 130 0" stroke="#f7c548" strokeWidth={14} fill="none" />
    </g>
    {txt && <text x={0} y={46} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={34} fill="#fff3d6">{txt}</text>}
  </g>
);
export const Frasco: React.FC<{ c?: string }> = ({ c = "#7ac8e8" }) => (
  <g><rect x={-24} y={-70} width={48} height={22} rx={6} fill="#8a5a2a" /><path d="M -34 -50 L 34 -50 L 40 40 Q 0 54 -40 40 Z" fill={c} opacity={0.85} /><Br d="M -22 -30 L -22 20" w={7} /></g>
);
export const Sierra: React.FC = () => (
  <g>
    <path d="M -160 -10 L 120 -30 L 120 20 L -160 30 Z" fill="#c8ccd4" />
    {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M ${-150 + i * 20} ${29 - i * 0.7} l 10 16 l 10 -16`} fill="#c8ccd4" />)}
    <path d="M 110 -50 Q 200 -60 200 0 Q 200 50 110 40 Z" fill="#8a4520" />
    <ellipse cx={160} cy={0} rx={26} ry={20} fill="#2a1530" opacity={0.5} />
    <Br d="M -140 -6 L 100 -22" w={6} />
  </g>
);
export const Balde: React.FC<{ t?: number; peste?: boolean; agua?: string }> = ({ t = 0, peste, agua = "#7ab8d8" }) => (
  <g>
    <path d="M -70 -80 Q 0 -150 70 -80" stroke="#5a5a6a" strokeWidth={8} fill="none" />
    <path d="M -70 -80 L 70 -80 L 54 40 L -54 40 Z" fill="#a8682f" />
    {[-50, 10].map((y) => <path key={y} d={`M -66 ${y} L 66 ${y}`} stroke="#5a5a6a" strokeWidth={10} />)}
    <ellipse cx={0} cy={-80} rx={70} ry={16} fill={agua} />
    {peste && [-30, 0, 30].map((x, i) => <path key={i} d={`M ${x} -100 q -20 -30 0 -60 q 20 -30 0 -60`} stroke="#9be15d" strokeWidth={8} fill="none" opacity={0.6 + 0.4 * Math.sin(t * 4 + i)} transform={`translate(0 ${-((t * 30 + i * 20) % 30)})`} strokeLinecap="round" />)}
    {peste && [0, 1, 2].map((i) => <circle key={`m${i}`} cx={Math.cos(t * 6 + i * 2) * 70} cy={-150 + Math.sin(t * 8 + i) * 30} r={6} fill={TINTA} />)}
  </g>
);
export const Ladrillo: React.FC = () => (
  <g><rect x={-60} y={-30} width={120} height={60} rx={8} fill="#d9d2c0" /><rect x={-60} y={10} width={120} height={20} rx={8} fill="#b9b2a0" />{[[-30, -10], [10, 0], [30, -16]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={4} fill="#a8a090" />)}</g>
);
export const Tijera: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const a = Math.abs(Math.sin((t - t0) * 12)) * 26;
  return (
    <g>
      <g transform={`rotate(${-a})`}><path d="M 0 0 L 170 -12 L 170 6 Z" fill="#c8ccd4" /><circle cx={-40} cy={-20} r={26} fill="none" stroke={C.rojo} strokeWidth={12} /></g>
      <g transform={`rotate(${a})`}><path d="M 0 0 L 170 12 L 170 -6 Z" fill="#dfe4ec" /><circle cx={-40} cy={20} r={26} fill="none" stroke={C.rojo} strokeWidth={12} /></g>
      <circle r={8} fill="#5a5a6a" />
    </g>
  );
};
export const Pistola: React.FC<{ t?: number; dispara?: number }> = ({ t = 0, dispara }) => (
  <g>
    <path d="M -40 -20 L 150 -26 L 150 -2 L -20 4 Q -50 60 -90 70 Q -110 40 -70 -10 Z" fill="#8a4520" />
    <rect x={10} y={-30} width={160} height={20} rx={8} fill="#5a5a6a" />
    <path d="M -10 4 Q 0 30 20 4" stroke="#5a5a6a" strokeWidth={6} fill="none" />
    <path d="M -20 -24 L -6 -50 L 6 -46 L 0 -22 Z" fill="#5a5a6a" />
    {dispara !== undefined && t > dispara && t < dispara + 0.4 && <circle cx={190} cy={-20} r={40 + (t - dispara) * 140} fill="#fff3c4" opacity={1 - (t - dispara) * 2.5} />}
  </g>
);
export const Botella: React.FC<{ c?: string; txt?: string; mecha?: number; t?: number; corcho?: boolean }> = ({ c = "#3a8a5a", txt, mecha, t = 0, corcho = true }) => (
  <g>
    <path d="M -16 -110 L 16 -110 L 16 -70 Q 48 -50 48 -10 L 48 70 Q 0 84 -48 70 L -48 -10 Q -48 -50 -16 -70 Z" fill={c} opacity={0.9} />
    {corcho && <rect x={-14} y={-128} width={28} height={22} rx={5} fill="#c9a06a" />}
    <Br d="M -30 -20 L -30 50" w={8} />
    {txt && <><rect x={-40} y={0} width={80} height={44} rx={6} fill="#f4ead2" /><text x={0} y={30} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={txt.length > 4 ? 15 : 22} fill={TINTA}>{txt}</text></>}
    {mecha !== undefined && (
      <g>
        <path d="M 0 -128 Q 20 -160 6 -180" stroke="#c9a06a" strokeWidth={6} fill="none" />
        <circle cx={6} cy={-182} r={12 + Math.sin(t * 30) * 4} fill="#ffb020" /><circle cx={6} cy={-182} r={6} fill="#fff3c4" />
      </g>
    )}
  </g>
);
export const Gato9: React.FC<{ t?: number; latigo?: number }> = ({ t = 0, latigo }) => {
  const k = latigo !== undefined && t > latigo ? Math.sin(Math.min(1, (t - latigo) * 3) * Math.PI) : 0;
  return (
    <g>
      <rect x={-20} y={-160} width={40} height={140} rx={14} fill="#8a4520" />
      <rect x={-24} y={-40} width={48} height={20} rx={6} fill="#5a2d14" />
      {Array.from({ length: 9 }, (_, i) => {
        const a = (i - 4) * 7 + Math.sin(t * 3 + i) * 4 + k * 40;
        return (
          <g key={i} transform={`rotate(${a} 0 -20)`}>
            <path d={`M 0 -20 Q ${Math.sin(t * 4 + i) * 16} 120 ${Math.sin(t * 3 + i) * 10} 260`} stroke="#c9a06a" strokeWidth={8} fill="none" />
            {[80, 170, 250].map((y) => <circle key={y} cx={Math.sin(t * 3 + i) * (y / 26)} cy={y} r={9} fill="#a8783a" />)}
          </g>
        );
      })}
    </g>
  );
};
export const BolsaRoja: React.FC<{ abre?: number }> = ({ abre = 0 }) => (
  <g>
    <path d="M -110 -20 Q -150 150 0 156 Q 150 150 110 -20 Q 60 -60 0 -60 Q -60 -60 -110 -20 Z" fill="#c81d2e" />
    <path d={`M -50 -60 L ${-70 - abre * 40} ${-120 - abre * 30} Q 0 ${-96 - abre * 50} ${70 + abre * 40} ${-120 - abre * 30} L 50 -60 Z`} fill="#9e1525" />
    <rect x={-60} y={-74} width={120} height={18} rx={8} fill="#5a3418" opacity={1 - abre} />
    <Br d="M -90 10 Q -96 60 -70 100" />
  </g>
);
export const GatoAnimal: React.FC<{ t?: number }> = ({ t = 0 }) => (
  <g>
    <path d={`M 60 30 Q 140 ${-10 + Math.sin(t * 6) * 30} 120 -80`} stroke="#ff9a3d" strokeWidth={20} fill="none" strokeLinecap="round" />
    <ellipse cx={0} cy={20} rx={80} ry={50} fill="#ff9a3d" />
    <circle cx={-60} cy={-40} r={50} fill="#ff9a3d" />
    <path d="M -100 -70 L -96 -120 L -66 -86 Z M -40 -84 L -20 -124 L -12 -78 Z" fill="#ff9a3d" />
    <circle cx={-78} cy={-46} r={9} fill={TINTA} /><circle cx={-44} cy={-46} r={9} fill={TINTA} />
    <path d="M -70 -24 Q -60 -16 -50 -24" stroke={TINTA} strokeWidth={4} fill="none" />
    {[-1, 1].map((d) => <line key={d} x1={-60 + d * 20} y1={-28} x2={-60 + d * 70} y2={-34 + d * 4} stroke={TINTA} strokeWidth={3} />)}
    {[[-50, 4], [30, 0], [-10, -10]].map(([x, y], i) => <path key={i} d={`M ${x} ${y} l 20 10`} stroke="#d9771d" strokeWidth={8} strokeLinecap="round" />)}
  </g>
);
export const Tablon: React.FC<{ largo?: number }> = ({ largo = 520 }) => (
  <g><rect x={0} y={-16} width={largo} height={32} rx={6} fill="#c98a4a" /><rect x={0} y={4} width={largo} height={12} rx={4} fill="#a8682f" />{[0.2, 0.5, 0.8].map((k) => <line key={k} x1={largo * k} y1={-14} x2={largo * k} y2={14} stroke="#8a4f22" strokeWidth={4} />)}</g>
);
export const Aleta: React.FC<{ t: number }> = ({ t }) => (
  <g transform={`translate(${Math.sin(t * 0.8) * 60} 0)`}><path d="M -60 0 Q -20 -20 10 -110 Q 30 -40 70 0 Z" fill="#5a6a8a" /><path d="M -90 4 Q 0 -10 100 4" stroke="#e8fbff" strokeWidth={8} fill="none" strokeLinecap="round" /></g>
);
export const Dado: React.FC<{ n?: number }> = ({ n = 5 }) => (
  <g>
    <rect x={-46} y={-46} width={92} height={92} rx={18} fill="#fff8e8" stroke={TINTA} strokeWidth={5} />
    {([[0, 0], [-22, -22], [22, 22], [22, -22], [-22, 22], [-22, 0], [22, 0]] as [number, number][]).slice(0, n === 5 ? 5 : n).map(([x, y], i) => <circle key={i} cx={x} cy={y} r={8} fill={TINTA} />)}
  </g>
);
export const Carta: React.FC<{ txt?: string; c?: string }> = ({ txt = "A", c = C.rojo }) => (
  <g><rect x={-50} y={-70} width={100} height={140} rx={12} fill="#fff8e8" stroke={TINTA} strokeWidth={5} /><text x={0} y={22} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={64} fill={c}>{txt}</text><path d="M 0 -48 l 12 14 l -12 14 l -12 -14 Z" fill={c} /></g>
);
export const Libro: React.FC<{ titulo: string[]; c?: string }> = ({ titulo, c = "#7a2a2a" }) => (
  <g>
    <rect x={-170} y={-230} width={360} height={470} rx={14} fill="#3a1010" />
    <rect x={-190} y={-240} width={360} height={470} rx={14} fill={c} />
    <rect x={-160} y={-210} width={300} height={410} rx={8} fill="none" stroke="#f7c548" strokeWidth={6} />
    {titulo.map((l, i) => <text key={i} x={-10} y={-120 + i * 64} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={i === 0 ? 40 : 52} fill="#f7c548">{l}</text>)}
    <Br d="M -170 -200 L -170 180" w={10} />
  </g>
);
export const Sable: React.FC = () => (
  <g>
    <path d="M -10 0 Q 120 -10 260 -70 Q 200 10 -10 26 Z" fill="#dfe4ec" />
    <path d="M -10 0 Q 120 -10 260 -70" stroke="#fff" strokeWidth={5} fill="none" />
    <path d="M -30 -30 Q -60 13 -30 56" stroke="#f7c548" strokeWidth={12} fill="none" />
    <rect x={-80} y={0} width={60} height={26} rx={10} fill="#8a4520" />
  </g>
);
export const Cartucho: React.FC = () => (
  <g><rect x={-26} y={-50} width={52} height={100} rx={18} fill="#e8dcc0" stroke="#a89a78" strokeWidth={5} /><path d="M -26 -30 L 26 -30" stroke="#a89a78" strokeWidth={5} /><text x={0} y={18} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={22} fill="#7a3a2a">⚠</text></g>
);
export const Astillas: React.FC<{ t: number; t0: number; n?: number; dir?: number; vel?: number }> = ({ t, t0, n = 14, dir = -1, vel = 900 }) => {
  if (t < t0) return null;
  const d = t - t0;
  const r = rnd(Math.round(t0 * 10));
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const a = (r() - 0.5) * 1.6 + (dir < 0 ? Math.PI : 0), v = vel * (0.5 + r()), L = 30 + r() * 90;
        const x = Math.cos(a) * v * d, y = Math.sin(a) * v * d + 600 * d * d;
        return <path key={i} transform={`translate(${x} ${y}) rotate(${d * 600 * (r() - 0.5) + (a * 180) / Math.PI})`} d={`M ${-L / 2} -6 L ${L / 2} 0 L ${-L / 2} 6 Z`} fill={i % 3 ? "#c98a4a" : "#8a4f22"} opacity={Math.max(0, 1 - d * 0.7)} />;
      })}
    </g>
  );
};
export const Lazo: React.FC = () => (
  <g><line x1={0} y1={-400} x2={0} y2={-60} stroke="#a8803a" strokeWidth={10} /><ellipse cx={0} cy={0} rx={40} ry={60} fill="none" stroke="#a8803a" strokeWidth={10} /></g>
);
export const Tortuga: React.FC<{ t?: number }> = ({ t = 0 }) => (
  <g>
    {[[-60, 30], [60, 30], [-50, -30], [50, -30]].map(([x, y], i) => <ellipse key={i} cx={x * 1.2} cy={y + 10} rx={26} ry={14} fill="#5aa85a" transform={`rotate(${Math.sin(t * 6 + i) * 10} ${x} ${y})`} />)}
    <circle cx={100} cy={0} r={26} fill="#5aa85a" /><circle cx={110} cy={-6} r={5} fill={TINTA} />
    <ellipse cx={0} cy={0} rx={90} ry={60} fill="#3a7a3a" />
    {[[-30, -20], [30, -20], [0, 20], [-40, 20], [40, 20]].map(([x, y], i) => <path key={i} d={`M ${x - 20} ${y} l 20 -14 l 20 14 l -20 14 Z`} fill="#4a9a4a" />)}
  </g>
);
export const Fruta: React.FC<{ k: "banana" | "pina" | "coco" }> = ({ k }) =>
  k === "banana" ? <g><path d="M -80 -20 Q 0 80 90 -30 Q 0 40 -80 -20 Z" fill="#ffd94a" /><path d="M -80 -20 l -14 -10" stroke="#5a3418" strokeWidth={10} /></g>
    : k === "pina" ? <g><ellipse rx={50} ry={70} fill="#e9a92a" />{Array.from({ length: 8 }, (_, i) => <path key={i} d={`M ${-40 + (i % 3) * 30} ${-40 + Math.floor(i / 3) * 34} l 15 15 l 15 -15`} stroke="#a8650f" strokeWidth={5} fill="none" />)}{[-30, 0, 30].map((a) => <path key={a} transform={`rotate(${a} 0 -70)`} d="M 0 -70 Q -16 -130 0 -150 Q 16 -130 0 -70 Z" fill="#3fb85a" />)}</g>
      : <g><circle r={50} fill="#6b3a1f" /><circle cx={-14} cy={-10} r={7} fill="#3a1c10" /><circle cx={10} cy={-14} r={7} fill="#3a1c10" /><circle cx={0} cy={6} r={7} fill="#3a1c10" /></g>;
export const Cuenco: React.FC<{ t?: number }> = ({ t = 0 }) => (
  <g>
    <path d="M -160 -20 Q -150 110 0 116 Q 150 110 160 -20 Z" fill="#8a4520" />
    <ellipse cx={0} cy={-20} rx={160} ry={34} fill="#5a2d14" />
    <ellipse cx={0} cy={-26} rx={140} ry={24} fill="#c9773a" />
    {Array.from({ length: 4 }, (_, i) => <path key={i} d={`M ${-60 + i * 40} -50 q -14 -30 0 -60 q 14 -30 0 -60`} stroke="#fff" strokeWidth={7} fill="none" opacity={0.35} transform={`translate(0 ${-((t * 40 + i * 30) % 40)})`} />)}
  </g>
);
export const Pupitre: React.FC = () => (
  <g><rect x={-180} y={-150} width={360} height={30} rx={8} fill="#c98a4a" /><rect x={-170} y={-120} width={20} height={160} fill="#5a5a6a" /><rect x={150} y={-120} width={20} height={160} fill="#5a5a6a" /><rect x={-150} y={-60} width={300} height={14} fill="#5a5a6a" /></g>
);
export const Zapato: React.FC<{ brillo?: number; t?: number }> = ({ brillo = 0, t = 0 }) => (
  <g>
    {brillo > 0 && Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2 + t * 0.6, r0 = 150, r1 = 150 + 50 * brillo + 14 * Math.sin(t * 5 + i); return <line key={i} x1={Math.cos(a) * r0} y1={Math.sin(a) * r0 * 0.6} x2={Math.cos(a) * r1} y2={Math.sin(a) * r1 * 0.6} stroke="#ffe27a" strokeWidth={10} strokeLinecap="round" />; })}
    <path d="M -110 30 L -110 -40 Q -110 -70 -80 -70 L -30 -70 Q -20 -20 30 -14 Q 110 -6 120 20 L 120 34 L -110 34 Z" fill="#1d1420" />
    <rect x={-116} y={28} width={240} height={16} rx={6} fill="#3a2a2a" />
    <rect x={-60} y={-46} width={40} height={14} rx={4} fill="#c8ccd4" />
    <path d="M -96 -50 Q -96 0 -76 20" stroke="#fff" strokeOpacity={0.35} strokeWidth={8} fill="none" strokeLinecap="round" />
  </g>
);
export const Media: React.FC = () => (
  <g><path d="M -30 -160 L 30 -160 L 34 20 Q 80 30 90 60 L 20 70 Q -30 70 -34 30 Z" fill="#f4f1e8" stroke="#cfc8b4" strokeWidth={4} />{[-120, -80, -40].map((y) => <path key={y} d={`M -30 ${y} L 32 ${y}`} stroke="#e0d9c4" strokeWidth={6} />)}</g>
);
export const Hueso: React.FC = () => (
  <g><rect x={-12} y={-130} width={24} height={260} rx={10} fill="#f2ead8" />{[-1, 1].map((d) => <g key={d}><circle cx={-12} cy={d * 130} r={20} fill="#f2ead8" /><circle cx={12} cy={d * 130} r={20} fill="#f2ead8" /></g>)}</g>
);
export const Concrecion: React.FC<{ rayos?: number; t?: number; sinZapato?: boolean }> = ({ rayos = 0, t = 0, sinZapato }) => (
  <g>
    <path d="M -300 60 Q -340 -90 -180 -150 Q -40 -230 120 -170 Q 300 -140 320 0 Q 330 130 150 160 Q -60 200 -220 150 Q -320 130 -300 60 Z" fill="#8a7a6a" />
    {Array.from({ length: 14 }, (_, i) => { const r = rnd(i + 30); return <circle key={i} cx={-240 + r() * 480} cy={-130 + r() * 260} r={10 + r() * 26} fill={r() < 0.5 ? "#7a6a5a" : "#a8987a"} />; })}
    {rayos > 0 && (
      <g opacity={rayos}>
        <path d="M -300 60 Q -340 -90 -180 -150 Q -40 -230 120 -170 Q 300 -140 320 0 Q 330 130 150 160 Q -60 200 -220 150 Q -320 130 -300 60 Z" fill="#0a2a4a" />
        <g transform="translate(-180 0) scale(0.8)" opacity={0.9}><Hueso /></g>
        <g transform="translate(20 20) scale(0.8)"><Media /></g>
        {!sinZapato && <g transform="translate(190 80) scale(0.7)"><Zapato /></g>}
        {Array.from({ length: 6 }, (_, i) => <line key={i} x1={-300} y1={-150 + ((t * 120 + i * 60) % 330)} x2={320} y2={-150 + ((t * 120 + i * 60) % 330)} stroke="#7ad8ff" strokeWidth={3} opacity={0.3} />)}
      </g>
    )}
  </g>
);
export const Buzo: React.FC<{ t: number; luz?: number; flip?: boolean }> = ({ t, luz = 1, flip }) => (
  <g transform={`scale(${flip ? -1 : 1} 1) rotate(${Math.sin(t * 1.2) * 4})`}>
    {luz > 0 && <path d="M 90 -20 L 900 -260 L 900 260 Z" fill="#fff8c4" opacity={0.18 * luz} />}
    {[-1, 1].map((d) => <path key={d} d={`M -120 ${d * 14} L -230 ${d * 30 + Math.sin(t * 5 + d) * 16} L -270 ${d * 10 + Math.sin(t * 5 + d) * 22}`} stroke="#1d2a4a" strokeWidth={26} fill="none" strokeLinecap="round" />)}
    <path d={`M -290 ${-10 + Math.sin(t * 5) * 20} L -330 ${-40 + Math.sin(t * 5) * 30} L -330 ${30 + Math.sin(t * 5) * 30} Z`} fill={C.ambar} />
    <rect x={-130} y={-36} width={200} height={72} rx={34} fill="#2a3a6a" />
    <rect x={-100} y={-70} width={120} height={36} rx={16} fill={C.ambar} />
    <circle cx={90} cy={-6} r={40} fill="#2a3a6a" />
    <rect x={90} y={-30} width={46} height={40} rx={10} fill="#9fe0ff" stroke="#1d1420" strokeWidth={6} />
    <rect x={60} y={10} width={70} height={18} rx={8} fill="#1d2a4a" transform="rotate(20 60 10)" />
    <rect x={120} y={16} width={30} height={24} rx={6} fill="#f7c548" />
  </g>
);
export const Metronomo: React.FC<{ t: number }> = ({ t }) => (
  <g><path d="M -90 120 L -50 -150 L 50 -150 L 90 120 Z" fill="#8a4520" /><rect x={-60} y={60} width={120} height={50} fill="#5a2d14" /><g transform={`rotate(${Math.sin(t * 4) * 32} 0 80)`}><line x1={0} y1={80} x2={0} y2={-160} stroke="#dfe4ec" strokeWidth={8} /><rect x={-18} y={-80} width={36} height={30} rx={6} fill="#f7c548" /></g></g>
);
export const Nota: React.FC<{ txt: string; c?: string }> = ({ txt, c = "#f4ead2" }) => (
  <g><rect x={-130} y={-60} width={260} height={120} rx={10} fill={c} stroke="#a8946a" strokeWidth={5} transform="rotate(-4)" /><text x={0} y={16} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={46} fill={TINTA} transform="rotate(-4)">{txt}</text></g>
);
// etiqueta de precio colgante (cuánto vale tu brazo)
export const Precio: React.FC<{ txt: string; t?: number; c?: string }> = ({ txt, t = 0, c = C.oro }) => (
  <g transform={`rotate(${Math.sin(t * 3) * 8})`}>
    <line x1={0} y1={-70} x2={0} y2={-10} stroke={TINTA} strokeWidth={4} />
    <path d="M -100 -10 L 70 -10 L 110 40 L 70 90 L -100 90 Z" fill={c} stroke={TINTA} strokeWidth={6} />
    <circle cx={74} cy={40} r={10} fill="#fff" stroke={TINTA} strokeWidth={4} />
    <text x={-12} y={60} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={txt.length > 5 ? 40 : 54} fill={TINTA}>{txt}</text>
  </g>
);
// sello de goma que golpea (NO BOYS ALLOWED, MYTH, FORCED...)
export const Sello: React.FC<{ t: number; t0: number; txt: string; c?: string; size?: number; rot?: number; fondo?: string }> = ({ t, t0, txt, c = C.rojo, size = 90, rot = -12, fondo }) => {
  if (t < t0) return null;
  const u = interpolate(t, [t0, t0 + 0.14], [2.6, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const w = txt.length * size * 0.62 + size * 0.9;
  return (
    <g transform={`rotate(${rot}) scale(${u})`} opacity={Math.min(1, (t - t0) * 9)}>
      <rect x={-w / 2} y={-size * 0.78} width={w} height={size * 1.4} rx={size * 0.2} fill={fondo ?? "none"} stroke={c} strokeWidth={size * 0.13} />
      <text x={0} y={size * 0.33} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={size} fill={c} letterSpacing={3}>{txt}</text>
    </g>
  );
};
// bocadillo de texto en el mundo
export const Globo: React.FC<{ txt: string; w?: number; size?: number; cola?: number }> = ({ txt, w, size = 54, cola = -1 }) => {
  const ww = w ?? txt.length * size * 0.58 + 70;
  return (
    <g>
      <rect x={-ww / 2} y={-size * 1.1} width={ww} height={size * 1.7} rx={size * 0.5} fill="#fff" stroke={TINTA} strokeWidth={6} />
      <path d={`M ${cola * 30} ${size * 0.58} L ${cola * 70} ${size * 1.3} L ${cola * -10} ${size * 0.58} Z`} fill="#fff" stroke={TINTA} strokeWidth={6} strokeLinejoin="round" />
      <rect x={cola * 30 - 30} y={size * 0.5} width={70} height={12} fill="#fff" />
      <text x={0} y={size * 0.12} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={size} fill={TINTA}>{txt}</text>
    </g>
  );
};
// cota / medida con flechas (1 METER, 30 M, 14 INCHES)
export const Cota: React.FC<{ x1: number; y1: number; x2: number; y2: number; txt: string; t: number; t0: number; t1?: number; c?: string; size?: number }> = ({ x1, y1, x2, y2, txt, t, t0, t1 = t0 + 2.5, c = "#fff", size = 50 }) => {
  if (t < t0 || t > t1) return null;
  const u = prog(t, t0, t0 + 0.5);
  const xm = x1 + (x2 - x1) * u, ym = y1 + (y2 - y1) * u;
  const a = Math.atan2(y2 - y1, x2 - x1);
  const fl = (x: number, y: number, s: number) => <path d={`M ${x} ${y} l ${Math.cos(a + s * 2.6) * 30} ${Math.sin(a + s * 2.6) * 30} M ${x} ${y} l ${Math.cos(a - s * 2.6) * 30} ${Math.sin(a - s * 2.6) * 30}`} stroke={c} strokeWidth={8} strokeLinecap="round" />;
  return (
    <g>
      <line x1={x1} y1={y1} x2={xm} y2={ym} stroke={TINTA} strokeWidth={14} strokeLinecap="round" />
      <line x1={x1} y1={y1} x2={xm} y2={ym} stroke={c} strokeWidth={7} strokeDasharray="20 12" strokeLinecap="round" />
      {fl(x1, y1, -1)}{u >= 1 && fl(x2, y2, 1)}
      {u >= 1 && <text x={(x1 + x2) / 2 + Math.sin(a) * 60} y={(y1 + y2) / 2 - Math.cos(a) * 40 + 16} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={size} fill={c} stroke={TINTA} strokeWidth={size * 0.18} paintOrder="stroke">{txt}</text>}
    </g>
  );
};
// flecha curva dibujándose (señala algo en el mundo)
export const Flecha: React.FC<{ t: number; t0: number; t1?: number; d: string; c?: string; w?: number }> = ({ t, t0, t1 = t0 + 2.5, d, c = C.ambar, w = 14 }) => {
  if (t < t0 || t > t1) return null;
  const u = prog(t, t0, t0 + 0.45);
  return <path d={d} stroke={c} strokeWidth={w} fill="none" strokeLinecap="round" pathLength={1000} strokeDasharray={`${u * 1000} 1000`} markerEnd={u > 0.95 ? "url(#punta)" : undefined} />;
};
export const Defs: React.FC = () => (
  <defs>
    <marker id="punta" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill={C.ambar} /></marker>
  </defs>
);
// nube de humo / pedo de peste que se expande
export const Nube: React.FC<{ t: number; t0: number; c?: string; r?: number; n?: number }> = ({ t, t0, c = "#9be15d", r = 120, n = 7 }) => {
  if (t < t0) return null;
  const d = t - t0;
  return (
    <g opacity={Math.max(0, 0.75 - d * 0.12)}>
      {Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2 + d * 0.4; const k = Math.min(1, d * 2.5); return <circle key={i} cx={Math.cos(a) * r * 0.8 * k} cy={Math.sin(a) * r * 0.5 * k - d * 30} r={r * (0.5 + 0.3 * Math.sin(t * 3 + i)) * k} fill={c} />; })}
    </g>
  );
};
// confeti (ironía)
export const Confeti: React.FC<{ t: number; t0: number; n?: number; x?: number; y?: number }> = ({ t, t0, n = 40, x = 0, y = 0 }) => {
  if (t < t0 || t > t0 + 2.5) return null;
  const d = t - t0;
  const r = rnd(Math.round(t0 * 7));
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const a = -Math.PI / 2 + (r() - 0.5) * 2.2, v = 500 + r() * 700;
        const xx = x + Math.cos(a) * v * d, yy = y + Math.sin(a) * v * d + 700 * d * d;
        return <rect key={i} x={xx} y={yy} width={22} height={12} fill={[C.rojo, C.oro, C.teal, C.lila, C.lima, C.rosa][i % 6]} transform={`rotate(${d * 700 * (r() - 0.5)} ${xx} ${yy})`} opacity={Math.max(0, 1 - d * 0.5)} />;
      })}
    </g>
  );
};
export const Signo: React.FC<{ k: "check" | "cross"; s?: number }> = ({ k, s = 1 }) => (
  <g transform={`scale(${s})`}>
    <circle r={44} fill={k === "check" ? "#3fb85a" : C.rojo} stroke="#fff" strokeWidth={8} />
    {k === "check" ? <path d="M -20 0 L -4 16 L 22 -16" stroke="#fff" strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : <path d="M -16 -16 L 16 16 M 16 -16 L -16 16" stroke="#fff" strokeWidth={12} strokeLinecap="round" />}
  </g>
);

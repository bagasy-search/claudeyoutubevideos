// fb5nd · PIEZAS CON CUERPO del video de la humedad del vecino: el muro de frente (revoque, pintura, mancha que respira,
// salitre), el muro EN CORTE (ladrillo, revoque, poros, el agua que viaja de costado, los cristales que la frenan),
// la nube con lluvia, la casa en corte y el reloj. Todo f(t), todo con el material de kit.Svg (relieve + sombra).
import React from "react";
import { C, cl, hash, lerp } from "./lib";

export const H2O = "#5fb4ff", MANCHA = "#57594a", REV = "#d9d2c3", REV2 = "#bdb4a2", LAD = "#b8643c", LAD2 = "#8e4626", SAL = "#f4f1e8", CRIS = "#d9f3ff";

// mancha de humedad con borde irregular (anillos que la hacen ver «manchada», no un círculo)
export const Mancha: React.FC<{ cx: number; cy: number; rx: number; ry: number; k: number; seed?: number; col?: string }> = ({ cx, cy, rx, ry, k, seed = 1, col = MANCHA }) => {
  if (k <= 0.01) return null;
  // mancha de humedad creíble: cuerpo difuso + aureola más oscura en el borde (la «marea» de sales) + borde orgánico
  const id = `mch${seed}`, kk = 0.35 + 0.65 * k;
  return (
    <g opacity={cl(k * 1.6)}>
      <defs>
        <radialGradient id={`${id}g`} cx="50%" cy="58%" r="50%">
          <stop offset="0%" stopColor={col} stopOpacity={0.55} />
          <stop offset="62%" stopColor={col} stopOpacity={0.42} />
          <stop offset="84%" stopColor="#6b5636" stopOpacity={0.62} />
          <stop offset="93%" stopColor="#8a7350" stopOpacity={0.35} />
          <stop offset="100%" stopColor={col} stopOpacity={0} />
        </radialGradient>
        <filter id={`${id}f`} x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={3} seed={seed} />
          <feDisplacementMap in="SourceGraphic" scale={rx * 0.35} />
          <feGaussianBlur stdDeviation={3} />
        </filter>
      </defs>
      <ellipse cx={cx} cy={cy} rx={rx * kk} ry={ry * kk} fill={`url(#${id}g)`} filter={`url(#${id}f)`} />
      <ellipse cx={cx - rx * 0.12} cy={cy + ry * 0.2} rx={rx * 0.45 * kk} ry={ry * 0.4 * kk} fill={col} opacity={0.22} filter={`url(#${id}f)`} />
    </g>
  );
};

// ampollas de pintura: burbujas que se inflan desde la pared (k 0→1)
export const Ampollas: React.FC<{ x: number; y: number; w: number; h: number; k: number; seed?: number }> = ({ x, y, w, h, k, seed = 7 }) => (
  <g>{Array.from({ length: 11 }, (_, i) => {
    const r = (14 + 22 * hash(i, seed)) * cl(k * 1.3 - hash(i, seed + 1) * 0.3);
    return r > 1 ? <g key={i}><ellipse cx={x + w * hash(i, seed + 2)} cy={y + h * hash(i, seed + 3)} rx={r} ry={r * 0.8} fill="#efe9dc" stroke="#a49d8e" strokeWidth={2} /><ellipse cx={x + w * hash(i, seed + 2) - r * 0.3} cy={y + h * hash(i, seed + 3) - r * 0.3} rx={r * 0.3} ry={r * 0.2} fill="#fff" opacity={0.8} /></g> : null;
  })}</g>
);

// salitre: escarcha blanca en el zócalo (k 0→1)
export const Salitre: React.FC<{ x: number; y: number; w: number; k: number; seed?: number }> = ({ x, y, w, k, seed = 3 }) => (
  <g opacity={cl(k * 1.5)}>{Array.from({ length: 40 }, (_, i) => <circle key={i} cx={x + w * hash(i, seed)} cy={y - 60 * Math.pow(hash(i, seed + 1), 2) * k} r={2 + 5 * hash(i, seed + 2)} fill={SAL} />)}</g>
);

// MURO de frente en 3/4: cara de revoque pintado, canto de arriba y costado (ladrillo a la vista en el corte)
export const Muro: React.FC<{ x: number; y: number; w: number; h: number; d?: number; pint?: string; children?: React.ReactNode }> = ({ x, y, w, h, d = 70, pint = "#ece6d8", children }) => (
  <g>
    <path d={`M${x},${y} L${x + d},${y - d * 0.55} L${x + w + d},${y - d * 0.55} L${x + w},${y} Z`} fill="#cfc7b5" stroke="#8d887e" strokeWidth={2} />
    <path d={`M${x + w},${y} L${x + w + d},${y - d * 0.55} L${x + w + d},${y + h - d * 0.55} L${x + w},${y + h} Z`} fill={LAD2} />
    {Array.from({ length: Math.floor(h / 34) }, (_, i) => <path key={i} d={`M${x + w},${y + i * 34 + 30} L${x + w + d},${y + i * 34 + 30 - d * 0.55}`} stroke="#5e3a1c" strokeWidth={3} />)}
    <rect x={x} y={y} width={w} height={h} fill={pint} stroke="#8d887e" strokeWidth={2} />
    <rect x={x} y={y + h - 46} width={w} height={46} fill="#c8bfa9" />
    {children}
  </g>
);

// MURO EN CORTE (visto desde arriba de costado): revoque | ladrillos | revoque. El agua entra por `de` ("r" o "b") y
// viaja por los poros; `cris` cierra los poros del revoque de adentro (izquierda) desde adentro hacia afuera.
export const Corte: React.FC<{ t: number; x: number; y: number; w: number; h: number; agua: number; cris?: number; vapor?: number; de?: "r" | "b"; poros?: boolean }> = ({ t, x, y, w, h, agua, cris = 0, vapor = 0, de = "r", poros = true }) => {
  const rv = w * 0.16, lx = x + rv, lw = w - 2 * rv;
  const stop = x + rv * (1 - 0.85 * cris); // hasta dónde llega el agua dentro del revoque de adentro
  return (
    <g>
      <rect x={x} y={y} width={rv} height={h} fill={REV} />
      <rect x={x + w - rv} y={y} width={rv} height={h} fill={REV2} />
      {Array.from({ length: Math.ceil(h / 60) }, (_, r) => Array.from({ length: 3 }, (_, c) => <rect key={r + "-" + c} x={lx + 6 + c * (lw / 3) + (r % 2 ? lw / 6 : 0) - (r % 2 && c === 2 ? lw / 3 : 0)} y={y + 6 + r * 60} width={lw / 3 - 12} height={48} rx={4} fill={(r + c) % 3 ? LAD : "#c4714a"} />))}
      {poros && Array.from({ length: 16 }, (_, i) => <path key={i} d={`M${x + 4},${y + 30 + i * (h - 60) / 15} q ${rv * 0.3},${-10} ${rv * 0.5},0 t ${rv * 0.45},0`} stroke="rgba(90,80,62,.55)" strokeWidth={3} fill="none" />)}
      {/* agua que entra y viaja hacia la izquierda */}
      {agua > 0 && Array.from({ length: 26 }, (_, i) => {
        const yy = de === "b" ? y + h - ((t * 40 + i * 47) % (h * agua)) : y + 20 + (h - 40) * hash(i, 4);
        const sp = 0.18 + 0.12 * hash(i, 5), u = ((t * sp + hash(i, 6)) % 1);
        const xx = de === "b" ? x + w * hash(i, 7) : lerp(x + w + 30, x - 10, u * agua);
        if (xx < stop - 4 && cris > 0.05) return <circle key={i} cx={stop + 6 + 8 * hash(i, 8)} cy={yy} r={7} fill={H2O} opacity={0.85} />;
        return <circle key={i} cx={xx} cy={yy} r={6 + 3 * hash(i, 9)} fill={H2O} opacity={0.9} />;
      })}
      {/* cristales del cristalizante creciendo dentro del revoque de adentro */}
      {cris > 0 && Array.from({ length: 34 }, (_, i) => {
        const g = cl(cris * 1.4 - hash(i, 11) * 0.4); if (g <= 0) return null;
        const cx = x + rv * (0.05 + 0.85 * hash(i, 12)), cy = y + 16 + (h - 32) * hash(i, 13), s = 6 + 12 * g;
        return <path key={i} d={`M${cx},${cy - s} L${cx + s * 0.6},${cy} L${cx},${cy + s} L${cx - s * 0.6},${cy} Z`} fill={CRIS} stroke="#7fc6ec" strokeWidth={1.5} opacity={0.95} />;
      })}
      {/* vapor que sale igual (la pared respira) */}
      {vapor > 0 && Array.from({ length: 10 }, (_, i) => { const u = ((t * 0.3 + i / 10) % 1); return <circle key={i} cx={x - 20 - 160 * u} cy={y + 40 + (h - 80) * hash(i, 14) - 60 * u} r={4 + 10 * u} fill="rgba(235,245,255,.6)" opacity={vapor * (1 - u)} />; })}
      <rect x={x} y={y} width={w} height={h} fill="none" stroke="#5e5547" strokeWidth={3} />
    </g>
  );
};

// nube que llueve (k = intensidad)
export const Nube: React.FC<{ t: number; x: number; y: number; s?: number; k?: number }> = ({ t, x, y, s = 1, k = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {k > 0 && Array.from({ length: 12 }, (_, i) => { const u = ((t * 1.4 + hash(i, 2)) % 1); return <line key={i} x1={-90 + 180 * hash(i, 1)} y1={30 + 220 * u} x2={-96 + 180 * hash(i, 1)} y2={52 + 220 * u} stroke={H2O} strokeWidth={4} opacity={k * (1 - u)} strokeLinecap="round" />; })}
    <ellipse cx={-50} cy={0} rx={70} ry={48} fill="#9aa6b2" /><ellipse cx={30} cy={-24} rx={84} ry={62} fill="#aeb9c4" /><ellipse cx={90} cy={8} rx={60} ry={42} fill="#9aa6b2" /><rect x={-110} y={0} width={240} height={42} rx={20} fill="#9aa6b2" />
  </g>
);

// reloj de aguja que avanza de 0 a k vueltas
export const Reloj: React.FC<{ x: number; y: number; r: number; k: number; col?: string }> = ({ x, y, r, k, col = C.honey }) => (
  <g transform={`translate(${x},${y})`}>
    <circle r={r} fill="#f4efe4" stroke="#5e5547" strokeWidth={6} />
    <path d={`M0,0 L0,${-r} A${r},${r} 0 ${k % 1 > 0.5 ? 1 : 0} 1 ${r * Math.sin(2 * Math.PI * (k % 1))},${-r * Math.cos(2 * Math.PI * (k % 1))} Z`} fill={col} opacity={0.35} />
    {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={-r * 0.82} x2={0} y2={-r * 0.92} stroke="#5e5547" strokeWidth={4} transform={`rotate(${i * 30})`} />)}
    <line x1={0} y1={0} x2={0} y2={-r * 0.75} stroke="#2b241b" strokeWidth={7} strokeLinecap="round" transform={`rotate(${360 * k})`} />
    <circle r={9} fill="#2b241b" />
  </g>
);

// casita en corte: piso, techo a dos aguas; `lado` = qué hay del otro lado de la medianera
export const Casa: React.FC<{ x: number; y: number; s?: number; children?: React.ReactNode }> = ({ x, y, s = 1, children }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-220,0 L-220,-260 L0,-400 L220,-260 L220,0 Z" fill="#e9dfca" stroke="#6b5a44" strokeWidth={6} />
    <path d="M-250,-250 L0,-420 L250,-250" fill="none" stroke="#8e4626" strokeWidth={22} strokeLinejoin="round" />
    <rect x={-150} y={-200} width={90} height={80} fill="#9ccbe8" stroke="#6b5a44" strokeWidth={5} />
    <rect x={40} y={-150} width={80} height={150} fill="#9a6233" stroke="#5e3a1c" strokeWidth={5} />
    {children}
  </g>
);

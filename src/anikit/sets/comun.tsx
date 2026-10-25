// Piezas sueltas que comparten los sets: plantas, ventanas, cielo, nubes, montañas, árboles, pájaros.
import React, { useId } from "react";
import { random } from "remotion";

export const uid = () => useId().replace(/[^a-zA-Z0-9]/g, "");
// acepta "#rrggbb" o "rgb(r,g,b)" (las mezclas encadenadas devuelven rgb)
const rgb = (c: string) => {
  if (c.startsWith("#")) { const n = parseInt(c.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  return (c.match(/[\d.]+/g) ?? ["0", "0", "0"]).slice(0, 3).map(Number);
};
export const mezclar = (a: string, b: string, t: number) => {
  const pa = rgb(a), pb = rgb(b);
  const c = (i: number) => Math.round(pa[i] * (1 - t) + pb[i] * t);
  return `rgb(${c(0)},${c(1)},${c(2)})`;
};
// grisar: lleva un color a su gris (paletas monocromas tipo Monk Mode); los rosas quedan (son el acento)
export const grisar = (c: string, k = 0.88) => {
  const [r, g, b] = rgb(c);
  if (r > 200 && b > 110 && g < 150) return c;
  const l = Math.round(0.3 * r + 0.59 * g + 0.11 * b);
  return mezclar(c, `rgb(${l},${l},${Math.min(255, l + 4)})`, k);
};
export const osc = (hex: string, k: number) => mezclar(hex, "#000000", 1 - k);
export const acl = (hex: string, k: number) => mezclar(hex, "#ffffff", k);

export type SetProps = { capa: "lejos" | "medio" | "frente"; f: number; pal: import("../paletas").Paleta; variante?: string };

export const Cielo: React.FC<{ c: [string, string, string]; x?: number; y?: number; w?: number; h?: number }> = ({ c, x = -2000, y = -800, w = 8000, h = 2400 }) => {
  const id = uid();
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={c[0]} /><stop offset="0.55" stopColor={c[1]} /><stop offset="0.8" stopColor={c[2]} /><stop offset="1" stopColor={c[2]} />
        </linearGradient>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id})`} />
    </g>
  );
};

// planta de hojas largas en maceta (la de la vereda del café de Awaken)
export const Planta: React.FC<{ x: number; y: number; s?: number; hoja?: string; maceta?: string; seed?: number; f?: number }> = ({ x, y, s = 1, hoja = "#3f8a5a", maceta = "#a4643a", seed = 0, f = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {Array.from({ length: 11 }).map((_, i) => {
      const a = -80 + i * 16 + (random(`pl${seed}${i}`) - 0.5) * 10 + Math.sin(f / 50 + i) * 1.5;
      const L = 70 + random(`pL${seed}${i}`) * 40;
      const r = (a * Math.PI) / 180;
      const tx = Math.sin(r) * L, ty = -Math.cos(r) * L;
      return <path key={i} d={`M0,-40 Q${tx * 0.4 - 8},${-40 + ty * 0.6} ${tx},${-40 + ty} Q${tx * 0.4 + 8},${-40 + ty * 0.5} 0,-40 Z`} fill={i % 2 ? hoja : osc(hoja, 0.78)} />;
    })}
    <path d="M-34,-44 L34,-44 L26,0 L-26,0 Z" fill={maceta} />
    <rect x={-37} y={-50} width={74} height={10} rx={3} fill={osc(maceta, 0.85)} />
  </g>
);

export const Arbusto: React.FC<{ x: number; y: number; w: number; h: number; color: string; seed?: number }> = ({ x, y, w, h, color, seed = 0 }) => (
  <g>
    {Array.from({ length: 7 }).map((_, i) => {
      const cx = x + (i / 6) * w, r = h * (0.45 + random(`ab${seed}${i}`) * 0.4);
      return <circle key={i} cx={cx} cy={y - r * 0.8} r={r} fill={i % 2 ? color : osc(color, 0.85)} />;
    })}
  </g>
);

export const Arbol: React.FC<{ x: number; y: number; s?: number; copa: string; tronco?: string; tipo?: "redondo" | "pino" }> = ({ x, y, s = 1, copa, tronco = "#3a2a20", tipo = "redondo" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-8} y={-120} width={16} height={120} fill={tronco} />
    {tipo === "pino" ? (
      <>
        <path d="M0,-330 L70,-160 L-70,-160 Z" fill={copa} />
        <path d="M0,-260 L90,-90 L-90,-90 Z" fill={osc(copa, 0.88)} />
      </>
    ) : (
      <>
        <circle cx={-40} cy={-160} r={60} fill={osc(copa, 0.85)} />
        <circle cx={35} cy={-170} r={66} fill={copa} />
        <circle cx={0} cy={-220} r={70} fill={copa} />
      </>
    )}
  </g>
);

export const Nube: React.FC<{ x: number; y: number; s?: number; color: string; o?: number }> = ({ x, y, s = 1, color, o = 0.9 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={o}>
    <ellipse cx={0} cy={0} rx={160} ry={26} fill={color} />
    <ellipse cx={-40} cy={-14} rx={70} ry={30} fill={color} />
    <ellipse cx={40} cy={-22} rx={80} ry={36} fill={color} />
  </g>
);

// cordillera procedural (silueta) para el fondo: capas cada vez más claras = perspectiva aérea
export const Cordillera: React.FC<{ y: number; alto: number; color: string; seed?: number; x0?: number; w?: number; puntas?: number }> = ({ y, alto, color, seed = 0, x0 = -1500, w = 7000, puntas = 14 }) => {
  const pts: string[] = [`${x0},${y + 400}`];
  for (let i = 0; i <= puntas * 2; i++) {
    const x = x0 + (i / (puntas * 2)) * w;
    const h = i % 2 ? alto * (0.6 + random(`co${seed}${i}`) * 0.4) : alto * (0.15 + random(`cv${seed}${i}`) * 0.25);
    pts.push(`${x.toFixed(0)},${(y - h).toFixed(0)}`);
  }
  pts.push(`${x0 + w},${y + 400}`);
  return <polygon points={pts.join(" ")} fill={color} />;
};

export const Colinas: React.FC<{ y: number; alto: number; color: string; seed?: number; x0?: number; w?: number }> = ({ y, alto, color, seed = 0, x0 = -1500, w = 7000 }) => {
  let d = `M${x0},${y + 600} L${x0},${y}`;
  const n = 8;
  for (let i = 0; i < n; i++) {
    const xa = x0 + (i / n) * w, xb = x0 + ((i + 1) / n) * w;
    d += ` Q${(xa + xb) / 2},${y - alto * (0.4 + random(`cl${seed}${i}`) * 0.8)} ${xb},${y - alto * 0.1 * random(`cm${seed}${i}`)}`;
  }
  d += ` L${x0 + w},${y + 600} Z`;
  return <path d={d} fill={color} />;
};

export const Pajaros: React.FC<{ x: number; y: number; f: number; n?: number; color?: string; seed?: number }> = ({ x, y, f, n = 3, color = "#2a1a1a", seed = 0 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const px = x + i * 46 + f * (0.9 + random(`pj${seed}${i}`) * 0.4) + random(`px${seed}${i}`) * 30;
      const py = y + random(`py${seed}${i}`) * 40 + Math.sin(f / 18 + i) * 6;
      const al = 6 * Math.sin(f / 3 + i * 2);
      return <path key={i} d={`M${px - 9},${py - al} Q${px - 4},${py - 3} ${px},${py} Q${px + 4},${py - 3} ${px + 9},${py - al}`} stroke={color} strokeWidth={2.4} fill="none" strokeLinecap="round" />;
    })}
  </g>
);

// ventana con marco, travesaños y luz interior; `persona` dibuja una silueta detrás de la cortina
export const Ventana: React.FC<{ x: number; y: number; w: number; h: number; luz: string; apagada?: string; prendida?: boolean; marco?: string; cortina?: string; persona?: boolean; f?: number; seed?: number }> = ({ x, y, w, h, luz, apagada = "#222", prendida = true, marco = "#e8e0cf", cortina, persona, f = 0, seed = 0 }) => {
  const id = uid();
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={prendida ? acl(luz, 0.25) : apagada} /><stop offset="1" stopColor={prendida ? osc(luz, 0.82) : osc(apagada, 0.8)} />
        </linearGradient>
      </defs>
      <rect x={x - 6} y={y - 6} width={w + 12} height={h + 12} fill={marco} />
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id})`} />
      {persona && prendida && <g opacity={0.45}><circle cx={x + w * 0.4 + Math.sin(f / 60 + seed) * w * 0.15} cy={y + h * 0.45} r={w * 0.13} fill={osc(luz, 0.45)} /><rect x={x + w * 0.4 - w * 0.15 + Math.sin(f / 60 + seed) * w * 0.15} y={y + h * 0.58} width={w * 0.3} height={h * 0.5} rx={10} fill={osc(luz, 0.45)} /></g>}
      {cortina && <><path d={`M${x},${y} L${x + w * 0.22},${y} Q${x + w * 0.12},${y + h * 0.5} ${x + w * 0.2},${y + h} L${x},${y + h} Z`} fill={cortina} /><path d={`M${x + w},${y} L${x + w * 0.78},${y} Q${x + w * 0.88},${y + h * 0.5} ${x + w * 0.8},${y + h} L${x + w},${y + h} Z`} fill={cortina} /></>}
      <rect x={x + w / 2 - 3} y={y} width={6} height={h} fill={marco} />
      <rect x={x} y={y + h * 0.45} width={w} height={6} fill={marco} />
      <rect x={x - 12} y={y + h + 4} width={w + 24} height={10} fill={osc(marco, 0.85)} />
    </g>
  );
};

// textura de ladrillos con <pattern> (barata aunque la fachada mida 5000 px)
export const Ladrillos: React.FC<{ x: number; y: number; w: number; h: number; color: string; alto?: number; o?: number }> = ({ x, y, w, h, color, alto = 26, o = 0.55 }) => {
  const id = uid();
  return (
    <g opacity={o}>
      <defs>
        <pattern id={id} x={x} y={y} width={64} height={alto * 2} patternUnits="userSpaceOnUse">
          <path d={`M0,0 H64 M0,${alto} H64 M0,0 V${alto} M32,${alto} V${alto * 2}`} stroke={color} strokeWidth={2} fill="none" />
        </pattern>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id})`} />
    </g>
  );
};

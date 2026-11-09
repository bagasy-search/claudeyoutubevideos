// dkit — «tu perro» dibujado por código (perfil, mirando a la derecha). 12 razas paramétricas, sin IA.
// (x,y) = suelo bajo el centro del cuerpo. Todo sale de useCurrentFrame(): sin estado entre cuadros.
import React from "react";
import { useCurrentFrame } from "remotion";

export type Br = {
  bl: number; ll: number; bh: number; hr: number; sn: number; ear: "prick" | "drop" | "bat" | "rose" | "long";
  tail: "curl" | "sickle" | "straight" | "short" | "plume" | "pom"; c: string; c2?: string; belly?: string;
  spots?: boolean; curls?: boolean; mane?: boolean; mask?: string; sweater?: string; flat?: boolean; saddle?: string;
};
export const BR: Record<string, Br> = {
  chihuahua: { bl: 62, ll: 34, bh: 34, hr: 25, sn: 12, ear: "bat", tail: "sickle", c: "#d8b07a", belly: "#f0dcb8", sweater: "#f08fb5" },
  bulldog: { bl: 92, ll: 26, bh: 58, hr: 29, sn: 4, ear: "rose", tail: "short", c: "#f1e9dc", c2: "#b07a4a", flat: true },
  teckel: { bl: 134, ll: 17, bh: 34, hr: 22, sn: 28, ear: "long", tail: "straight", c: "#7a3e1c", belly: "#93522a" },
  caniche: { bl: 88, ll: 64, bh: 44, hr: 24, sn: 26, ear: "long", tail: "pom", c: "#1d1d20", curls: true },
  golden: { bl: 112, ll: 50, bh: 50, hr: 27, sn: 25, ear: "drop", tail: "plume", c: "#d39a45", belly: "#e8bb6e" },
  dalmata: { bl: 112, ll: 56, bh: 46, hr: 25, sn: 27, ear: "drop", tail: "straight", c: "#f4f1ea", spots: true },
  galgo: { bl: 122, ll: 72, bh: 40, hr: 20, sn: 36, ear: "rose", tail: "sickle", c: "#8a8f96", belly: "#a7acb2" },
  pastor: { bl: 122, ll: 58, bh: 52, hr: 27, sn: 31, ear: "prick", tail: "plume", c: "#b0763a", saddle: "#231a12" },
  husky: { bl: 112, ll: 54, bh: 50, hr: 27, sn: 25, ear: "prick", tail: "curl", c: "#6f7680", belly: "#eef0f2", mask: "#eef0f2" },
  kangal: { bl: 134, ll: 62, bh: 60, hr: 32, sn: 27, ear: "drop", tail: "curl", c: "#d9c49a", mask: "#1d1612" },
  mastin: { bl: 132, ll: 58, bh: 66, hr: 31, sn: 20, ear: "drop", tail: "curl", c: "#1d1612", belly: "#a8622c", mane: true },
  sinraza: { bl: 106, ll: 52, bh: 44, hr: 25, sn: 27, ear: "prick", tail: "curl", c: "#b98a52", belly: "#d8b47e" },
};
const rr = (i: number, s: number) => { const x = Math.sin(i * 91.7 + s * 47.3) * 43758.5453; return x - Math.floor(x); };

export const Perro: React.FC<{ x: number; y: number; s?: number; b: string; walk?: number; wag?: number; pant?: number; shiver?: number; flip?: boolean; head?: number; op?: number; lie?: boolean; curl?: boolean; run?: boolean }> = ({ x, y, s = 1, b, walk = 0, wag = 0, pant = 0, shiver = 0, flip, head = 0, op = 1, lie, curl, run }) => {
  const f = useCurrentFrame();
  const k = BR[b] ?? BR.sinraza;
  const ll = lie ? 6 : k.ll, by = -ll - k.bh / 2 + 4;
  const ph = (run ? f / 2.2 : f / 4.5) * (walk || run ? 1 : 0), amp = run ? 34 : 18 * walk;
  const sx = shiver ? Math.sin(f * 2.3) * 2.2 * shiver : 0;
  const lw = Math.max(9, k.bh * 0.27), col = k.c;
  const legs = [-0.36, -0.27, 0.3, 0.38].map((p, i) => {
    const sw = Math.sin(ph + (i % 2 ? Math.PI : 0) + (i > 1 ? Math.PI / 2 : 0)) * amp;
    const hx = p * k.bl, hy = by + k.bh * 0.25, fx = hx + sw * 0.6, fy = 0 - Math.max(0, Math.cos(ph + i)) * (run ? 18 : 6 * walk);
    return <path key={i} d={lie ? `M${hx},${hy} L${hx + (i > 1 ? 34 : -20)},${-4}` : `M${hx},${hy} Q${hx + sw * 0.2},${(hy + fy) / 2} ${fx},${fy}`} stroke={i % 2 ? col : shade(col)} strokeWidth={lw} strokeLinecap="round" fill="none" />;
  });
  const tb: [number, number] = [-k.bl / 2 + 4, by - k.bh * 0.2];
  const wg = Math.sin(f / 2.6) * 14 * wag;
  const tail = k.tail === "curl" ? `M${tb[0]},${tb[1]} q-18,-34 6,-46 q20,-6 14,16` : k.tail === "sickle" ? `M${tb[0]},${tb[1]} q-26,-10 -34,-38` : k.tail === "straight" ? `M${tb[0]},${tb[1]} q-30,4 -52,${-8}` : k.tail === "short" ? `M${tb[0]},${tb[1]} l-12,4` : k.tail === "pom" ? `M${tb[0]},${tb[1]} q-12,-24 -10,-42` : `M${tb[0]},${tb[1]} q-38,10 -58,-12`;
  const hx = k.bl / 2 + k.hr * 0.25, hy = by - k.bh * 0.55 - k.hr * 0.55 + (lie ? 14 : 0);
  const hrot = head + Math.sin(f / 40) * 2;
  return (
    <g transform={`translate(${x + sx},${y}) scale(${flip ? -s : s},${s})`} opacity={op}>
      <ellipse cx={0} cy={4} rx={k.bl * 0.62} ry={7} fill="rgba(0,0,0,.4)" />
      <g transform={curl ? `rotate(-8)` : undefined}>
        <g transform={`rotate(${wg} ${tb[0]} ${tb[1]})`}>
          <path d={tail} stroke={col} strokeWidth={k.tail === "plume" ? lw * 0.9 : lw * 0.6} strokeLinecap="round" fill="none" />
          {k.tail === "pom" && <circle cx={tb[0] - 10} cy={tb[1] - 44} r={13} fill={col} />}
        </g>
        {legs}
        <ellipse cx={0} cy={by} rx={k.bl / 2} ry={k.bh / 2} fill={col} />
        {k.belly && <ellipse cx={k.bl * 0.06} cy={by + k.bh * 0.24} rx={k.bl * 0.36} ry={k.bh * 0.2} fill={k.belly} />}
        {k.saddle && <ellipse cx={-k.bl * 0.06} cy={by - k.bh * 0.18} rx={k.bl * 0.4} ry={k.bh * 0.3} fill={k.saddle} />}
        {k.c2 && <ellipse cx={-k.bl * 0.18} cy={by - k.bh * 0.08} rx={k.bl * 0.2} ry={k.bh * 0.3} fill={k.c2} />}
        {k.spots && Array.from({ length: 16 }).map((_, i) => <circle key={i} cx={(rr(i, 1) - 0.5) * k.bl * 0.9} cy={by + (rr(i, 2) - 0.5) * k.bh * 0.75} r={3 + rr(i, 3) * 3.5} fill="#111" />)}
        {k.curls && Array.from({ length: 22 }).map((_, i) => { const a = (i / 22) * Math.PI * 2; return <circle key={i} cx={Math.cos(a) * k.bl * 0.5} cy={by + Math.sin(a) * k.bh * 0.5} r={8} fill={col} />; })}
        {k.sweater && <path d={`M${-k.bl * 0.22},${by - k.bh / 2 - 1} L${k.bl * 0.42},${by - k.bh / 2 + 4} Q${k.bl * 0.5},${by} ${k.bl * 0.36},${by + k.bh / 2} L${-k.bl * 0.22},${by + k.bh / 2} Z`} fill={k.sweater} stroke="#c8618c" strokeWidth={2} />}
        {k.mane && <circle cx={hx - k.hr * 0.4} cy={hy + k.hr * 0.3} r={k.hr * 1.15} fill={col} />}
        <g transform={`rotate(${hrot} ${hx - k.hr * 0.6} ${hy + k.hr * 0.6})`}>
          <path d={`M${k.bl * 0.32},${by - k.bh * 0.2} L${hx - k.hr * 0.3},${hy + k.hr * 0.4}`} stroke={col} strokeWidth={k.hr * 1.1} strokeLinecap="round" />
          {k.ear === "drop" || k.ear === "long" ? null : earP(k, hx, hy, col)}
          <circle cx={hx} cy={hy} r={k.hr} fill={col} />
          {k.mask && <path d={`M${hx},${hy - k.hr * 0.2} Q${hx + k.hr},${hy - k.hr * 0.1} ${hx + k.hr * 0.8 + k.sn},${hy + k.hr * 0.3} L${hx + k.hr * 0.6},${hy + k.hr * 0.75} Z`} fill={k.mask} />}
          <rect x={hx + k.hr * 0.45} y={hy - k.hr * (k.flat ? 0.2 : 0.05)} width={k.sn + k.hr * 0.4} height={k.hr * (k.flat ? 0.95 : 0.62)} rx={k.hr * 0.3} fill={k.mask && b === "kangal" ? k.mask : col} />
          {k.flat && <path d={`M${hx + k.hr * 0.5},${hy + k.hr * 0.6} q${k.hr * 0.4},${k.hr * 0.5} ${k.hr * 0.9},0`} fill={shade(col)} />}
          <circle cx={hx + k.hr * 0.85 + k.sn} cy={hy + k.hr * 0.05} r={Math.max(4, k.hr * 0.17)} fill="#141010" />
          <circle cx={hx + k.hr * 0.38} cy={hy - k.hr * 0.25} r={Math.max(2.6, k.hr * 0.1)} fill="#141010" />
          {pant > 0 && <ellipse cx={hx + k.hr * 0.55 + k.sn * 0.6} cy={hy + k.hr * 0.62 + Math.abs(Math.sin(f / 3)) * 5 * pant} rx={k.hr * 0.22} ry={k.hr * 0.3 * pant} fill="#d9667a" />}
          {(k.ear === "drop" || k.ear === "long") && earP(k, hx, hy, col)}
        </g>
      </g>
    </g>
  );
};
const shade = (c: string) => { const n = parseInt(c.slice(1), 16); const r = Math.max(0, (n >> 16) - 28), g = Math.max(0, ((n >> 8) & 255) - 28), bb = Math.max(0, (n & 255) - 28); return `rgb(${r},${g},${bb})`; };
const earP = (k: Br, hx: number, hy: number, col: string) => {
  const r = k.hr;
  if (k.ear === "prick") return <path d={`M${hx - r * 0.55},${hy - r * 0.6} L${hx - r * 0.35},${hy - r * 1.75} L${hx + r * 0.15},${hy - r * 0.8} Z`} fill={col} stroke={shade(col)} strokeWidth={2} />;
  if (k.ear === "bat") return <path d={`M${hx - r * 0.7},${hy - r * 0.4} L${hx - r * 0.8},${hy - r * 2.2} L${hx + r * 0.2},${hy - r * 0.75} Z`} fill={col} stroke="#e8a0a0" strokeWidth={3} />;
  if (k.ear === "rose") return <path d={`M${hx - r * 0.6},${hy - r * 0.7} q${r * 0.2},${-r * 0.5} ${r * 0.6},${-r * 0.1} l${-r * 0.2},${r * 0.3} Z`} fill={shade(col)} />;
  const L = k.ear === "long" ? 1.6 : 1.05;
  return <ellipse cx={hx - r * 0.45} cy={hy + r * 0.25 * L} rx={r * 0.34} ry={r * 0.62 * L} fill={k.curls ? col : shade(col)} transform={`rotate(12 ${hx - r * 0.45} ${hy})`} />;
};
// pájaro grande en silueta (teratornis) que planea
export const Ave: React.FC<{ x: number; y: number; s?: number; c?: string }> = ({ x, y, s = 1, c = "#120c08" }) => {
  const f = useCurrentFrame(); const fl = Math.sin(f / 9) * 6;
  return <g transform={`translate(${x},${y}) scale(${s})`}><path d={`M-180,${fl} Q-90,${-26 + fl} -20,-4 L0,-12 L20,-4 Q90,${-26 + fl} 180,${fl} Q90,${-6 + fl} 20,8 L0,22 L-20,8 Q-90,${-6 + fl} -180,${fl} Z`} fill={c} /></g>;
};
// lobo en silueta (manada, lobo terrible, lobo del Tíbet)
export const Lobo: React.FC<{ x: number; y: number; s?: number; c?: string; flip?: boolean; walk?: number; eyes?: number }> = ({ x, y, s = 1, c = "#151210", flip, walk = 0, eyes = 0 }) => {
  const f = useCurrentFrame(); const w = Math.sin(f / 5) * 10 * walk;
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <path d={`M-70,-58 Q-10,-80 50,-62 L78,-92 L86,-76 L104,-72 L92,-60 L80,-54 Q60,-40 54,-30 L${58 + w},0 L${46 + w},0 L40,-26 L-40,-30 L${-44 - w},0 L${-56 - w},0 L-60,-36 Q-90,-40 -112,-30 Q-90,-52 -70,-58 Z`} fill={c} />
      {eyes > 0 && <circle cx={88} cy={-74} r={3.5} fill={`rgba(255,220,120,${eyes})`} />}
    </g>
  );
};

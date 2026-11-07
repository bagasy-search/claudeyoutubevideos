// arboles60 — piezas de entorno reusables (todas vectoriales, por capas).
import React from "react";
import { C, Cam, Layer, Glow, Motes, clamp, lerp, rnd, rr, spr, wob, prog, eio } from "./lib";

// ── árboles ──
export const Pine: React.FC<{ x: number; y: number; h: number; c?: string; c2?: string; g?: number; sway?: number; trunk?: string }> =
  ({ x, y, h, c = C.leaf2, c2 = "#23804A", g = 1, sway = 0, trunk = "#6B3F2A" }) => {
    if (g <= 0) return null;
    const w = h * 0.42;
    return (
      <g transform={`translate(${x} ${y}) scale(${Math.max(0, g)} ${Math.max(0, g)}) skewX(${sway})`}>
        <rect x={-h * 0.04} y={-h * 0.16} width={h * 0.08} height={h * 0.18} fill={trunk} />
        {[0, 1, 2].map((i) => {
          const top = -h + i * h * 0.24, base = -h * 0.12 - (2 - i) * h * 0.2, ww = w * (0.55 + i * 0.22);
          return (
            <g key={i}>
              <path d={`M0 ${top} Q ${ww * 0.25} ${(top + base) / 2} ${ww} ${base} Q 0 ${base + h * 0.06} ${-ww} ${base} Q ${-ww * 0.25} ${(top + base) / 2} 0 ${top} Z`} fill={c} />
              <path d={`M0 ${top} Q ${ww * 0.25} ${(top + base) / 2} ${ww} ${base} Q ${ww * 0.4} ${base + h * 0.04} 0 ${base + h * 0.03} Z`} fill={c2} />
            </g>
          );
        })}
      </g>
    );
  };

export const RoundTree: React.FC<{ x: number; y: number; h: number; c?: string; c2?: string; g?: number; seed?: number; sway?: number; trunk?: string }> =
  ({ x, y, h, c = C.leaf, c2 = C.leaf2, g = 1, seed = 1, sway = 0, trunk = "#7A4A2E" }) => {
    if (g <= 0) return null;
    const r = h * 0.3;
    return (
      <g transform={`translate(${x} ${y}) scale(${g}) skewX(${sway})`}>
        <path d={`M${-h * 0.05} 0 L${-h * 0.03} ${-h * 0.5} L${h * 0.03} ${-h * 0.5} L${h * 0.05} 0 Z`} fill={trunk} />
        <circle cx={-r * 0.55} cy={-h + r * 1.25} r={r * 0.8} fill={c2} />
        <circle cx={r * 0.6} cy={-h + r * 1.2} r={r * 0.85} fill={c2} />
        <circle cx={0} cy={-h + r} r={r} fill={c} />
        <circle cx={-r * 0.6} cy={-h + r * 1.15} r={r * 0.7} fill={c} />
        <circle cx={r * 0.25} cy={-h + r * 0.75} r={r * 0.45} fill="#fff" opacity={0.12} />
        {rnd(seed) > 0.5 && <circle cx={r * 0.45} cy={-h + r * 1.4} r={r * 0.12} fill={C.pink} opacity={0.8} />}
      </g>
    );
  };

export const Stump: React.FC<{ x: number; y: number; h: number }> = ({ x, y, h }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d={`M${-h * 0.07} 0 L${-h * 0.06} ${-h * 0.09} L${h * 0.06} ${-h * 0.09} L${h * 0.07} 0 Z`} fill="#7A4A2E" />
    <ellipse cx={0} cy={-h * 0.09} rx={h * 0.06} ry={h * 0.02} fill="#E8B77A" />
  </g>
);

// ── cielo nocturno con estrellas y banda de la Vía Láctea ──
export const NightSky: React.FC<{ t: number; milky: number; flare?: number; n?: number }> = ({ t, milky, flare = 0, n = 220 }) => (
  <g>
    <defs>
      <linearGradient id="nsky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#060D38" />
        <stop offset="0.55" stopColor={C.deep2} />
        <stop offset="1" stopColor="#3B2A9A" />
      </linearGradient>
      <linearGradient id="milky" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={C.light} stopOpacity="0" />
        <stop offset="0.3" stopColor={C.light} stopOpacity="0.35" />
        <stop offset="0.5" stopColor={C.pink} stopOpacity="0.3" />
        <stop offset="0.7" stopColor={C.light} stopOpacity="0.35" />
        <stop offset="1" stopColor={C.light} stopOpacity="0" />
      </linearGradient>
    </defs>
    <rect x={-900} y={-1400} width={3720} height={2900} fill="url(#nsky)" />
    {milky > 0 && (
      <g transform="rotate(-18 960 300)" opacity={milky}>
        <ellipse cx={960} cy={260} rx={1500 * clamp(milky * 1.3)} ry={150} fill="url(#milky)" />
        <ellipse cx={960} cy={260} rx={1300 * clamp(milky * 1.3)} ry={60} fill="url(#milky)" />
        {Array.from({ length: 140 }, (_, i) => {
          const x = 960 + (rnd(i * 3 + 900) - 0.5) * 2600 * clamp(milky * 1.3), y = 260 + (rnd(i * 5 + 901) - 0.5) * 190 * (1 - Math.abs(rnd(i * 3 + 900) - 0.5));
          return <circle key={i} cx={x} cy={y} r={rr(i + 902, 0.8, 2.4)} fill="#fff" opacity={0.5 + 0.5 * Math.sin(t * 3 + i)} />;
        })}
      </g>
    )}
    {Array.from({ length: n }, (_, i) => {
      const x = rr(i * 7 + 1, -700, 2620), y = rr(i * 7 + 2, -1300, 760);
      const r = rr(i * 7 + 3, 0.8, 2.8) * (1 + flare * 0.9);
      const tw = 0.5 + 0.5 * Math.sin(t * rr(i, 1.2, 3.6) + i);
      const big = rnd(i * 7 + 4) > 0.93;
      const col = rnd(i * 7 + 5) > 0.8 ? C.yellow : rnd(i * 7 + 5) > 0.65 ? C.light : "#fff";
      return (
        <g key={i} opacity={0.35 + 0.65 * tw}>
          {big && <path d={`M${x} ${y - r * 4} L${x + r * 0.7} ${y - r * 0.7} L${x + r * 4} ${y} L${x + r * 0.7} ${y + r * 0.7} L${x} ${y + r * 4} L${x - r * 0.7} ${y + r * 0.7} L${x - r * 4} ${y} L${x - r * 0.7} ${y - r * 0.7} Z`} fill={col} />}
          <circle cx={x} cy={y} r={r} fill={col} />
        </g>
      );
    })}
  </g>
);

// colinas lejanas, medias y la loma principal (mundo nocturno de la apertura y el cierre)
export const nightHills = {
  far: "M-900 700 C -500 600, -200 640, 200 610 C 600 580, 900 650, 1300 600 C 1700 560, 2100 640, 2820 590 L2820 1500 L-900 1500 Z",
  mid: "M-900 800 C -400 720, 0 760, 400 740 C 800 720, 1100 790, 1500 750 C 1900 710, 2300 780, 2820 740 L2820 1500 L-900 1500 Z",
  main: "M-900 930 C -300 880, 200 860, 600 870 C 1000 880, 1300 940, 1700 920 C 2100 900, 2400 930, 2820 920 L2820 1500 L-900 1500 Z",
};
export const pinesOn = (seed: number, n: number, x0: number, x1: number, yf: (x: number) => number, h0: number, h1: number) =>
  Array.from({ length: n }, (_, i) => {
    const x = lerp(x0, x1, (i + rnd(seed + i) * 0.7) / n);
    return { x, y: yf(x) + rr(seed + i * 3, 4, 18), h: rr(seed + i * 5, h0, h1), k: i };
  });
// y de cada curva (aprox. por tramos) para apoyar árboles
const curveY = (pts: [number, number][]) => (x: number) => {
  for (let i = 1; i < pts.length; i++) if (x <= pts[i][0]) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; return lerp(y0, y1, (x - x0) / (x1 - x0)); }
  return pts[pts.length - 1][1];
};
export const yFar = curveY([[-900, 700], [200, 615], [900, 640], [1300, 600], [2100, 630], [2820, 590]]);
export const yMid = curveY([[-900, 800], [0, 755], [400, 740], [1100, 785], [1500, 750], [2300, 775], [2820, 740]]);
export const yMain = curveY([[-900, 930], [200, 862], [600, 870], [1300, 935], [1700, 920], [2820, 920]]);

export const NightWorld: React.FC<{ t: number; cam: Cam; milky: number; flare?: number; children?: React.ReactNode; fore?: React.ReactNode; midExtra?: React.ReactNode }> =
  ({ t, cam, milky, flare = 0, children, fore, midExtra }) => {
    const far = pinesOn(100, 40, -900, 2800, yFar, 40, 80), mid = pinesOn(300, 30, -900, 2800, yMid, 80, 150);
    return (
      <g>
        <Layer cam={cam} d={0.15}><NightSky t={t} milky={milky} flare={flare} /></Layer>
        <Layer cam={cam} d={0.35}>
          <Glow id="hzn" x={960} y={640} r={900} color={C.royal} op={0.5} />
          <path d={nightHills.far} fill="#1E2A84" />
          {far.map((p) => <Pine key={p.k} x={p.x} y={p.y} h={p.h} c="#18216E" c2="#141C5E" trunk="#141C5E" sway={Math.sin(t * 0.8 + p.k) * 1.5} />)}
        </Layer>
        <Layer cam={cam} d={0.6}>
          <path d={nightHills.mid} fill="#141C5E" />
          {mid.map((p) => <Pine key={p.k} x={p.x} y={p.y} h={p.h} c="#10195A" c2="#0C1350" trunk="#0C1350" sway={Math.sin(t * 0.9 + p.k) * 2} />)}
          {midExtra}
        </Layer>
        <Layer cam={cam} d={1}>
          <path d={nightHills.main} fill="#0E1550" />
          <path d={nightHills.main} fill="none" stroke="#2D3FB0" strokeWidth={5} opacity={0.6} />
          {Array.from({ length: 40 }, (_, i) => {
            const x = rr(i + 500, -800, 2700), y = yMain(x) + rr(i + 501, 6, 60);
            return <path key={i} d={`M${x} ${y} q 6 -22 ${10 + Math.sin(t * 1.5 + i) * 3} -30 M${x + 8} ${y} q 2 -16 ${-4 + Math.sin(t * 1.3 + i) * 3} -24`} stroke="#25349A" strokeWidth={4} fill="none" strokeLinecap="round" />;
          })}
          {children}
        </Layer>
        <Layer cam={cam} d={1.35}>
          <Motes t={t} n={26} seed={7} color={C.yellow} r={[2, 4]} glow area={[-300, 500, 2200, 1100]} speed={0.6} />
          {fore}
        </Layer>
      </g>
    );
  };

// ── planeta con giro (proyección ortográfica) ──
const CONT: [number, number, number][] = [
  [0.2, 0.75, 0.55], [0.6, 0.3, 0.38], [0.9, -0.2, 0.42], [1.7, 0.5, 0.5], [2.0, 0.1, 0.35], [2.6, 0.7, 0.45], [3.1, -0.45, 0.4],
  [3.8, 0.35, 0.55], [4.3, -0.1, 0.4], [4.9, 0.6, 0.35], [5.4, -0.5, 0.45], [5.9, 0.15, 0.3], [1.2, -0.75, 0.3], [4.6, -0.8, 0.28],
];
export const Earth: React.FC<{ cx: number; cy: number; r: number; rot: number; t: number; forest?: number; pins?: number; id: string; scan?: number; cover?: number }> =
  ({ cx, cy, r, rot, t, forest = 1, pins = 0, id, scan = -1, cover = 0 }) => {
    const proj = (lon: number, lat: number) => {
      const l = lon - rot, c = Math.cos(l) * Math.cos(lat);
      return { x: cx + r * Math.cos(lat) * Math.sin(l), y: cy - r * Math.sin(lat), vis: c, sx: Math.max(0.05, Math.cos(l)) };
    };
    return (
      <g>
        <Glow id={`${id}atm`} x={cx} y={cy} r={r * 1.22} color={C.cyan} op={0.75} />
        <defs><clipPath id={`${id}cl`}><circle cx={cx} cy={cy} r={r} /></clipPath>
          <radialGradient id={`${id}sh`} cx="0.35" cy="0.3" r="0.8"><stop offset="0.55" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#06103A" stopOpacity="0.55" /></radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r={r} fill={C.royal} />
        <g clipPath={`url(#${id}cl)`}>
          {CONT.map(([lon, lat, s], i) => {
            const p = proj(lon, lat); if (p.vis < -0.15) return null;
            return (
              <g key={i} transform={`translate(${p.x} ${p.y}) scale(${p.sx} 1)`}>
                <ellipse cx={0} cy={0} rx={r * s * 0.55} ry={r * s * 0.38} fill="#3FAE5A" />
                <ellipse cx={r * s * 0.25} cy={r * s * 0.1} rx={r * s * 0.35} ry={r * s * 0.3} fill="#3FAE5A" />
                <ellipse cx={-r * s * 0.2} cy={-r * s * 0.12} rx={r * s * 0.3} ry={r * s * 0.22} fill="#5BC46E" />
                <ellipse cx={r * s * 0.1} cy={r * s * 0.22} rx={r * s * 0.18} ry={r * s * 0.12} fill="#D9B26A" opacity={0.8} />
              </g>
            );
          })}
          {/* bosques: puntos que se encienden con el conteo */}
          {Array.from({ length: 260 }, (_, i) => {
            const k = i % CONT.length, [lon, lat, s] = CONT[k];
            const p = proj(lon + (rnd(i * 3) - 0.5) * s * 0.9, lat + (rnd(i * 3 + 1) - 0.5) * s * 0.6);
            if (p.vis < 0) return null;
            const on = forest * clamp((cover * 1.4 - rnd(i * 9)) * 3 + (cover >= 1 ? 1 : 0));
            const sc = scan >= 0 && Math.abs(p.x - scan) < 24 ? 1 : 0;
            return <circle key={i} cx={p.x} cy={p.y} r={r * 0.012 * (1 + sc * 0.8)} fill={sc ? C.yellow : on > 0 ? C.leaf3 : "#2C8A48"} opacity={0.5 + 0.5 * Math.max(on, sc)} />;
          })}
          {pins > 0 && Array.from({ length: 70 }, (_, i) => {
            const k = i % CONT.length, [lon, lat, s] = CONT[k];
            const p = proj(lon + (rnd(i * 5 + 2) - 0.5) * s * 0.8, lat + (rnd(i * 5 + 3) - 0.5) * s * 0.5);
            if (p.vis < 0.05) return null;
            const g = clamp(spr(pins, rnd(i * 13) * 0.8, 2.5, 8));
            if (g <= 0) return null;
            return (
              <g key={i} transform={`translate(${p.x} ${p.y}) scale(${g * p.sx} ${g})`}>
                <path d="M0 0 C -9 -14, -9 -26, 0 -28 C 9 -26, 9 -14, 0 0 Z" fill={C.orange} />
                <circle cx={0} cy={-19} r={3.6} fill="#fff" />
              </g>
            );
          })}
          {Array.from({ length: 8 }, (_, i) => {
            const p = proj(i * 0.8 + t * 0.15, (rnd(i + 40) - 0.5) * 1.6); if (p.vis < 0) return null;
            return <ellipse key={i} cx={p.x} cy={p.y} rx={r * 0.18 * p.sx} ry={r * 0.04} fill="#fff" opacity={0.35} />;
          })}
          <circle cx={cx} cy={cy} r={r} fill={`url(#${id}sh)`} />
        </g>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.teal} strokeWidth={r * 0.015} opacity={0.6} />
      </g>
    );
  };

// ── balanza ──
const STARPILE: [number, number][] = [];
[4, 3, 2, 1].forEach((n, row) => { for (let c = 0; c < n; c++) STARPILE.push([(c - (n - 1) / 2) * 30, -12 - row * 24]); });
export const Balance: React.FC<{ x: number; y: number; s?: number; tilt: number; stars: number; trees: number; t: number }> = ({ x, y, s = 1, tilt, stars, trees, t }) => {
  const L = 230;
  const pan = (sgn: number, content: React.ReactNode) => {
    const px = sgn * L * Math.cos((tilt * Math.PI) / 180), py = sgn * L * Math.sin((tilt * Math.PI) / 180);
    return (
      <g transform={`translate(${px} ${py})`}>
        <line x1={0} y1={0} x2={-70} y2={120} stroke="#C7D2FF" strokeWidth={3} />
        <line x1={0} y1={0} x2={70} y2={120} stroke="#C7D2FF" strokeWidth={3} />
        <circle r={9} fill={C.yellow} />
        <g transform="translate(0 120)">
          {content}
          <path d="M-95 0 Q0 40 95 0 Z" fill="#E7ECFF" />
          <path d="M-95 0 Q0 40 95 0" stroke="#9AA8E8" strokeWidth={4} fill="none" />
        </g>
      </g>
    );
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-26 340 L26 340 L12 0 L-12 0 Z" fill="#C7D2FF" />
      <rect x={-90} y={330} width={180} height={26} rx={13} fill="#9AA8E8" />
      <g transform={`rotate(${tilt})`}>
        <rect x={-L - 10} y={-9} width={2 * L + 20} height={18} rx={9} fill="#E7ECFF" />
      </g>
      <circle r={22} fill={C.yellow} />
      {pan(-1, (
        <g>{STARPILE.slice(0, Math.round(stars)).map(([xx, yy], i) => (
          <path key={i} transform={`translate(${xx} ${yy})`} d="M0 -14 L4 -4 L14 -4 L6 3 L9 13 L0 7 L-9 13 L-6 3 L-14 -4 L-4 -4 Z" fill={C.yellow} opacity={0.95} />
        ))}</g>
      ))}
      {pan(1, (
        <g>{Array.from({ length: Math.round(trees) }, (_, i) => {
          const per = 5, row = Math.floor(i / per), col = i % per;
          return <Pine key={i} x={(col - 2) * 30 + (row % 2) * 15} y={-4 - row * 22} h={44} c={C.leaf} c2={C.leaf2} />;
        })}</g>
      ))}
    </g>
  );
};

// ── satélite ──
export const Satellite: React.FC<{ x: number; y: number; t: number; s?: number; rot?: number }> = ({ x, y, t, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {[-1, 1].map((sg) => (
      <g key={sg} transform={`translate(${sg * 95} 0)`}>
        <rect x={-62} y={-26} width={124} height={52} rx={4} fill={C.royal} stroke="#C7D2FF" strokeWidth={4} />
        {[0, 1, 2, 3].map((i) => <line key={i} x1={-62 + 31 * i} y1={-26} x2={-62 + 31 * i} y2={26} stroke="#8CAAF7" strokeWidth={2} />)}
        <line x1={-62} y1={0} x2={62} y2={0} stroke="#8CAAF7" strokeWidth={2} />
      </g>
    ))}
    <rect x={-34} y={-34} width={68} height={68} rx={12} fill="#E7ECFF" />
    <rect x={-34} y={-34} width={68} height={22} rx={10} fill={C.orange} />
    <circle cx={0} cy={40} r={14} fill="#5C6A80" />
    <circle cx={0} cy={44} r={7} fill={C.teal} />
    <circle cx={22} cy={-44} r={5} fill={Math.sin(t * 6) > 0 ? C.pink : "#7a2a55"} />
    <line x1={22} y1={-34} x2={22} y2={-44} stroke="#C7D2FF" strokeWidth={3} />
  </g>
);

// rayos de sol giratorios
export const Burst: React.FC<{ x: number; y: number; t: number; color: string; n?: number; r?: number; op?: number }> = ({ x, y, t, color, n = 18, r = 2400, op = 0.18 }) => (
  <g transform={`translate(${x} ${y}) rotate(${t * 6})`} opacity={op}>
    {Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2, b = a + Math.PI / n;
      return <path key={i} d={`M0 0 L${Math.cos(a) * r} ${Math.sin(a) * r} L${Math.cos(b) * r} ${Math.sin(b) * r} Z`} fill={color} />;
    })}
  </g>
);

export { wob, prog, eio };

// cl2mezcla · EL BLOQUE EN CORTE en 3D (proyección propia, sin librerías): un bloque de mezcla cortado al medio. Las caras de
// arriba y del costado son de mortero; la cara de adelante es el corte, y adentro se ve lo que la mezcla es: granos de arena,
// la pasta de cemento, los poros que deja el agua de más, los cristalitos que crecen mientras cura, el brillo del agua fresca
// y la grieta que corre cuando pega la maza (y se frena en un grano). Todo f(t) y f(cámara).
import React from "react";
import { C, cl, hash, lerp } from "./lib";

export type V3 = [number, number, number];
export type Cam = { ry: number; rx: number; sc: number; cx: number; cy: number };
const W = 2, H = 1, D = 1;
const rad = (g: number) => (g * Math.PI) / 180;
export const proj = (c: Cam, [x, y, z]: V3) => {
  const a = rad(c.ry), b = rad(c.rx);
  const xr = x * Math.cos(a) - z * Math.sin(a), zr = x * Math.sin(a) + z * Math.cos(a);
  return { x: c.cx + c.sc * xr, y: c.cy - c.sc * y * Math.cos(b) + c.sc * zr * Math.sin(b), z: zr };
};
const poly = (c: Cam, ps: V3[]) => ps.map((p) => { const q = proj(c, p); return `${q.x},${q.y}`; }).join(" ");

export type BloqueSt = {
  agua: number;     // 0 justa · 1 aguada (poros)
  fresco: number;   // 0 seco · 1 recién hecho (brilla, más oscuro)
  cris: number;     // 0..1 cristalitos crecidos entre los granos
  grieta?: number;  // 0..1 cuánto corrió la grieta
  frena?: boolean;  // la grieta se frena en un grano (mezcla justa) o atraviesa (aguada)
  roto?: number;    // 0..1 el bloque se abre en dos (aguado)
  golpe?: number;   // 0..1 brillo blanco del golpe en la cara de arriba
  seco?: number;    // 0..1 costra floja arriba (se secó antes de fraguar)
};

// granos de arena del corte, deterministas, en coordenadas locales 0..1000 × 0..500
const GR = Array.from({ length: 150 }, (_, i) => {
  const x = 30 + hash(i, 1) * 940, y = 25 + hash(i, 2) * 450, r = 9 + 22 * hash(i, 3) ** 1.6;
  const n = 7, pts = Array.from({ length: n }, (_, k) => { const a = (k / n) * Math.PI * 2, rr = r * (0.72 + 0.4 * hash(i * 13 + k, 4)); return `${x + rr * Math.cos(a)},${y + rr * 0.85 * Math.sin(a)}`; }).join(" ");
  return { x, y, r, pts, tono: hash(i, 5) };
});
const PO = Array.from({ length: 70 }, (_, i) => ({ x: 40 + hash(i, 11) * 920, y: 30 + hash(i, 12) * 440, r: 4 + 9 * hash(i, 13), k: hash(i, 14) }));
// la grieta: un zigzag de arriba hacia abajo por el medio; si frena, termina contra un grano a media altura
const CR = Array.from({ length: 11 }, (_, i) => [500 + (i ? (hash(i, 21) - 0.5) * 90 : 0), i * 50] as [number, number]);

export const Bloque: React.FC<{ t: number; cam: Cam; st: BloqueSt; id?: number; dx?: number }> = ({ t, cam: c, st, id = 0, dx = 0 }) => {
  const sp = (st.roto ?? 0) * 0.35, gid = `bq${id}`;
  // dos mitades (izquierda y derecha) que se separan si el bloque se rompe
  const half = (s: -1 | 1) => {
    const x0 = s < 0 ? -W / 2 : 0, x1 = s < 0 ? 0 : W / 2, o = s * sp + dx;
    const P = (x: number, y: number, z: number): V3 => [x + o, y - (st.roto ?? 0) * 0.08 * Math.abs(x), z];
    return { top: poly(c, [P(x0, H, -D / 2), P(x1, H, -D / 2), P(x1, H, D / 2), P(x0, H, D / 2)]), side: s > 0 ? poly(c, [P(x1, 0, D / 2), P(x1, 0, -D / 2), P(x1, H, -D / 2), P(x1, H, D / 2)]) : null, x0, x1, o };
  };
  // afín: local (0..1000, 0..500) → cara de adelante (z = D/2)
  const A = proj(c, [-W / 2 + dx, H, D / 2]), B = proj(c, [W / 2 + dx, H, D / 2]), Cc = proj(c, [-W / 2 + dx, 0, D / 2]);
  const m = `matrix(${(B.x - A.x) / 1000},${(B.y - A.y) / 1000},${(Cc.x - A.x) / 500},${(Cc.y - A.y) / 500},${A.x},${A.y})`;
  const L = half(-1), R = half(1);
  const pasta = `rgb(${Math.round(lerp(150, 105, st.fresco))},${Math.round(lerp(146, 102, st.fresco))},${Math.round(lerp(138, 98, st.fresco))})`;
  const nPo = Math.round(PO.length * st.agua);
  const crN = Math.round(CR.length * cl(st.grieta ?? 0)), stop = st.frena ? 6 : CR.length;
  const crack = CR.slice(0, Math.min(crN, stop)).map(([x, y]) => `${x},${y}`).join(" ");
  const ground = proj(c, [dx, 0, 0]);
  return (
    <g>
      <ellipse cx={ground.x + 40} cy={ground.y + 26} rx={c.sc * 1.35} ry={c.sc * 0.3} fill="rgba(0,0,0,.42)" />
      {[L, R].map((h, k) => <g key={k}>
        <polygon points={h.top} fill={lerp(0, 1, st.fresco) > 0.5 ? "#8a857c" : "#a8a398"} stroke="rgba(0,0,0,.35)" strokeWidth={2} />
        {h.side && <polygon points={h.side} fill="#6e6a63" stroke="rgba(0,0,0,.35)" strokeWidth={2} />}
      </g>)}
      {/* golpe: destello en la cara de arriba */}
      {(st.golpe ?? 0) > 0.01 && (() => { const q = proj(c, [dx, H, 0]); return <ellipse cx={q.x} cy={q.y} rx={c.sc * 0.35 * (0.6 + st.golpe!)} ry={c.sc * 0.1 * (0.6 + st.golpe!)} fill="rgba(255,255,255,.7)" opacity={st.golpe} />; })()}
      {/* el corte */}
      <g transform={m}>
        <defs><clipPath id={gid + "L"}><rect x={0} y={0} width={500} height={500} /></clipPath><clipPath id={gid + "R"}><rect x={500} y={0} width={500} height={500} /></clipPath></defs>
        {[["L", -1], ["R", 1]].map(([k, s]) => (
          <g key={k as string} clipPath={`url(#${gid}${k})`} transform={`translate(${(s as number) * sp * 500},${0})`}>
            <rect x={0} y={0} width={1000} height={500} fill={pasta} />
            {/* textura de la pasta */}
            {Array.from({ length: 220 }, (_, i) => <circle key={i} cx={hash(i, 31) * 1000} cy={hash(i, 32) * 500} r={1.5 + 2 * hash(i, 33)} fill={hash(i, 34) > 0.5 ? "rgba(255,255,255,.10)" : "rgba(0,0,0,.12)"} />)}
            {GR.map((g, i) => <polygon key={i} points={g.pts} fill={`rgb(${Math.round(lerp(196, 232, g.tono))},${Math.round(lerp(160, 200, g.tono))},${Math.round(lerp(96, 140, g.tono))})`} stroke="rgba(60,40,10,.45)" strokeWidth={2} />)}
            {/* cristalitos entre granos */}
            {st.cris > 0.01 && GR.slice(0, 90).map((g, i) => { const a = hash(i, 41) * Math.PI * 2, L2 = (g.r + 4 + 16 * hash(i, 42)) * st.cris; return <line key={i} x1={g.x + Math.cos(a) * g.r * 0.9} y1={g.y + Math.sin(a) * g.r * 0.8} x2={g.x + Math.cos(a) * (g.r * 0.9 + L2)} y2={g.y + Math.sin(a) * (g.r * 0.8 + L2)} stroke="rgba(235,245,255,.85)" strokeWidth={2.2} strokeLinecap="round" />; })}
            {/* poros del agua de más */}
            {PO.slice(0, nPo).map((p, i) => <g key={i}><circle cx={p.x} cy={p.y} r={p.r} fill="#1b1916" /><circle cx={p.x - p.r * 0.3} cy={p.y - p.r * 0.3} r={p.r * 0.35} fill="rgba(255,255,255,.12)" /></g>)}
            {/* agua fresca: brillo que tiembla */}
            {st.fresco > 0.01 && Array.from({ length: 26 }, (_, i) => <ellipse key={i} cx={hash(i, 51) * 1000} cy={hash(i, 52) * 500} rx={18 + 20 * hash(i, 53)} ry={4 + 3 * hash(i, 54)} fill="rgba(160,215,255,.35)" opacity={st.fresco * (0.5 + 0.5 * Math.sin(t * 3 + i))} />)}
            {/* costra floja arriba */}
            {(st.seco ?? 0) > 0.01 && <rect x={0} y={0} width={1000} height={70 * st.seco!} fill="rgba(225,215,195,.55)" />}
          </g>
        ))}
        {crN > 0 && (st.roto ?? 0) < 0.05 && <polyline points={crack} fill="none" stroke="#0d0c0b" strokeWidth={7} strokeLinejoin="round" />}
        {st.frena && crN >= stop && <circle cx={CR[stop - 1][0]} cy={CR[stop - 1][1] + 16} r={22} fill="none" stroke={C.ok} strokeWidth={5} opacity={0.9} />}
        <rect x={0} y={0} width={1000} height={500} fill="none" stroke="rgba(0,0,0,.45)" strokeWidth={4} />
      </g>
    </g>
  );
};

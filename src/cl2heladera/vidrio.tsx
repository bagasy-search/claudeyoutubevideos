// cl2heladera · HILO VISUAL «La heladera de vidrio»: una heladera de los ochenta proyectada en 3D a mano (SVG), paredes de
// vidrio esmerilado. El frío es luz azul que baja del congelador; el calor es luz naranja que sale por la parrilla de atrás;
// cada falla es un punto rojo en su lugar. Unidades: ancho x∈[-1,1], alto y∈[-1.9,1.9], fondo z∈[-0.9,0.9] (z+ = puerta).
import React from "react";
import { C, hash } from "./lib";

export type V3 = [number, number, number];
export type Cam = { ry: number; rx: number; sc: number; cx: number; cy: number };
export const proj = (p: V3, c: Cam): [number, number, number] => {
  const ry = (c.ry * Math.PI) / 180, rx = (c.rx * Math.PI) / 180;
  const x1 = p[0] * Math.cos(ry) + p[2] * Math.sin(ry), z1 = -p[0] * Math.sin(ry) + p[2] * Math.cos(ry);
  const y2 = p[1] * Math.cos(rx) - z1 * Math.sin(rx), z2 = p[1] * Math.sin(rx) + z1 * Math.cos(rx);
  const f = 7 / (7 - z2);
  return [c.cx + x1 * c.sc * f, c.cy - y2 * c.sc * f, z2];
};
const W = 1, H = 1.9, D = 0.9, FZ = 0.72; // FZ: piso del congelador
const pts = (a: V3[], c: Cam) => a.map((p) => proj(p, c).slice(0, 2).join(",")).join(" ");

export type Dot = { p: V3; on: number; col?: string };
export const Fridge: React.FC<{
  t: number; cam: Cam; cold?: number; heat?: number; lint?: number; fan?: number; ice?: number; door?: number; dots?: Dot[];
  coldTop?: number; glow?: number; children?: (c: Cam) => React.ReactNode;
}> = ({ t, cam, cold = 0, heat = 0, lint = 0, fan = 0, ice = 0, door = 0, dots = [], coldTop = 0, glow = 1, children }) => {
  const P = (p: V3) => proj(p, cam);
  const v: V3[] = [[-W, -H, -D], [W, -H, -D], [W, H, -D], [-W, H, -D], [-W, -H, D], [W, -H, D], [W, H, D], [-W, H, D]];
  const E = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
  const faces: V3[][] = [[v[0], v[1], v[2], v[3]], [v[4], v[5], v[6], v[7]], [v[0], v[4], v[7], v[3]], [v[1], v[5], v[6], v[2]], [v[3], v[2], v[6], v[7]], [v[0], v[1], v[5], v[4]]];
  // parrilla de atrás (zigzag de caños, plano z = -D - 0.08)
  const zc = -D - 0.08, coil: V3[] = [];
  for (let i = 0; i <= 14; i++) { const y = -1.15 + i * 0.2; coil.push([i % 2 ? 0.82 : -0.82, y, zc]); coil.push([i % 2 ? -0.82 : 0.82, y, zc]); }
  const coilD = coil.map((p, i) => (i ? "L" : "M") + P(p).slice(0, 2).join(",")).join(" ");
  const wires = Array.from({ length: 9 }, (_, i) => { const x = -0.78 + i * 0.195; return `M${P([x, -1.2, zc - 0.01]).slice(0, 2).join(",")} L${P([x, 1.6, zc - 0.01]).slice(0, 2).join(",")}`; }).join(" ");
  const comp = P([0.15, -1.62, -D - 0.12]), compR = 0.32 * cam.sc * (7 / (7 - comp[2]));
  // puerta (se abre girando sobre la bisagra izquierda)
  const dA = (door * 100 * Math.PI) / 180, hinge = (y: number, w: number): V3 => [-W + w * Math.cos(dA), y, D + w * Math.sin(dA)];
  const doorLow: V3[] = [hinge(-H, 0), hinge(-H, 2 * W), hinge(FZ - 0.04, 2 * W), hinge(FZ - 0.04, 0)];
  const doorTop: V3[] = [[-W, FZ + 0.04, D], [W, FZ + 0.04, D], [W, H, D], [-W, H, D]];
  const shelves = [0.15, -0.55, -1.25].map((y) => [[-W + 0.05, y, -D + 0.05], [W - 0.05, y, -D + 0.05], [W - 0.05, y, D - 0.05], [-W + 0.05, y, D - 0.05]] as V3[]);
  // partículas: frío (baja del congelador por el fondo y sube por la puerta) y calor (sale por la parrilla hacia atrás y arriba)
  const N = 46, coldP = Array.from({ length: N }, (_, i) => {
    const u = (t * 0.16 + i / N + hash(i, 3) * 0.05) % 1, side = hash(i, 4) * 1.6 - 0.8;
    const top = coldTop > 0 && hash(i, 6) < coldTop;  // el frío que se queda arriba (ventilador parado)
    const y = top ? FZ + 0.1 + 0.9 * ((u * 3) % 1) : FZ - u * (2 * H * 0.86), z = top ? -0.4 + 0.8 * hash(i, 7) : -D + 0.25 + 0.5 * Math.sin(u * Math.PI) * hash(i, 5);
    return { p: [side, y, z] as V3, a: Math.sin(u * Math.PI) };
  });
  const heatP = Array.from({ length: 38 }, (_, i) => {
    const u = (t * 0.22 + i / 38) % 1, x = hash(i, 8) * 1.6 - 0.8, y = -1.1 + hash(i, 9) * 2.6 + u * 0.9;
    return { p: [x, y, zc - u * (1.4 - 1.1 * lint)] as V3, a: Math.sin(u * Math.PI) * (1 - 0.75 * lint) };
  });
  const lintBlobs = Array.from({ length: 70 }, (_, i) => ({ p: [hash(i, 11) * 1.7 - 0.85, -1.15 + hash(i, 12) * 2.8, zc - 0.02] as V3, r: 4 + hash(i, 13) * 9 }));
  const fanC = P([0, 1.3, -D + 0.15]);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <defs>
        <filter id="vglow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <filter id="vsoft"><feGaussianBlur stdDeviation="9" /></filter>
        <radialGradient id="vcomp" cx="40%" cy="35%"><stop offset="0" stopColor="#3a4652" /><stop offset="1" stopColor="#0c1218" /></radialGradient>
      </defs>
      {/* sombra al piso */}
      <ellipse cx={P([0, -H, 0])[0]} cy={P([0, -H, 0])[1] + 10} rx={cam.sc * 1.5} ry={cam.sc * 0.22} fill="rgba(0,0,0,.45)" filter="url(#vsoft)" />
      {/* calor saliendo por atrás */}
      {heat > 0 && heatP.map((h, i) => { const q = P(h.p); return <circle key={"h" + i} cx={q[0]} cy={q[1]} r={7 + 6 * hash(i, 10)} fill={C.heat} opacity={heat * h.a * 0.55} filter="url(#vsoft)" />; })}
      {/* parrilla + compresor */}
      <path d={coilD} fill="none" stroke={heat > 0 ? `rgba(255,154,60,${0.45 + 0.5 * heat})` : "rgba(160,190,210,.6)"} strokeWidth={3.2} filter={heat > 0.3 ? "url(#vglow)" : undefined} />
      <path d={wires} stroke="rgba(160,190,210,.35)" strokeWidth={1.2} />
      {lint > 0 && lintBlobs.map((b, i) => { const q = P(b.p); return <circle key={"l" + i} cx={q[0]} cy={q[1]} r={b.r * cam.sc / 160} fill="#9a9a94" opacity={lint * 0.85} filter="url(#vsoft)" />; })}
      <circle cx={comp[0]} cy={comp[1]} r={compR} fill="url(#vcomp)" stroke="rgba(210,238,255,.35)" strokeWidth={1.5} />
      {/* caras de vidrio (de atrás hacia adelante) */}
      {faces.map((f, i) => <polygon key={"f" + i} points={pts(f, cam)} fill={C.glass} stroke="none" />)}
      {/* estantes */}
      {shelves.map((sh, i) => <polygon key={"s" + i} points={pts(sh, cam)} fill="rgba(214,241,255,.07)" stroke="rgba(214,241,255,.28)" strokeWidth={1.2} />)}
      {/* piso del congelador + escarcha */}
      <polygon points={pts([[-W, FZ, -D], [W, FZ, -D], [W, FZ, D], [-W, FZ, D]], cam)} fill={`rgba(214,241,255,${0.12 + 0.3 * ice})`} stroke="rgba(214,241,255,.5)" strokeWidth={1.5} />
      {ice > 0 && <polygon points={pts([[-W + 0.02, FZ + 0.02, -D + 0.02], [W - 0.02, FZ + 0.02, -D + 0.02], [W - 0.02, H - 0.02, -D + 0.02], [-W + 0.02, H - 0.02, -D + 0.02]], cam)} fill="rgba(240,250,255,.6)" opacity={ice} />}
      {/* ventilador del no frost */}
      {fan > 0 && <g transform={`translate(${fanC[0]},${fanC[1]}) rotate(${t * 900 * fan})`} opacity={0.9}>{[0, 72, 144, 216, 288].map((r) => <ellipse key={r} cx={0} cy={-14} rx={6} ry={14} fill={C.ice2} transform={`rotate(${r})`} />)}<circle r={5} fill={C.night} /></g>}
      {/* frío */}
      {cold > 0 && coldP.map((c, i) => { const q = P(c.p); return <circle key={"c" + i} cx={q[0]} cy={q[1]} r={5 + 5 * hash(i, 14)} fill={C.ice} opacity={cold * c.a * 0.75} filter="url(#vglow)" />; })}
      {/* aristas */}
      {E.map(([a, b], i) => { const p = P(v[a]), q = P(v[b]); return <line key={"e" + i} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={C.edge} strokeWidth={2} opacity={glow} />; })}
      {/* puertas */}
      <polygon points={pts(doorTop, cam)} fill="rgba(214,241,255,.08)" stroke={C.edge} strokeWidth={2.2} />
      <polygon points={pts(doorLow, cam)} fill="rgba(214,241,255,.10)" stroke={C.edge} strokeWidth={2.2} />
      {/* puntos de falla */}
      {dots.map((d, i) => { const q = P(d.p); const pul = 1 + 0.25 * Math.sin(t * 6 + i); return d.on > 0.01 ? <g key={"d" + i} opacity={d.on}><circle cx={q[0]} cy={q[1]} r={22 * pul} fill={d.col ?? C.red} opacity={0.28} filter="url(#vsoft)" /><circle cx={q[0]} cy={q[1]} r={9} fill={d.col ?? C.red} /></g> : null; })}
      {children?.(cam)}
    </svg>
  );
};
// lugares de la heladera donde vive cada falla (para los puntos rojos del hilo)
export const SPOT: Record<string, V3> = {
  parrilla: [0, 0.2, -D - 0.1], pared: [-0.9, 0.6, -D - 0.5], bandeja: [0.2, -1.35, -D - 0.25], burlete: [W, -0.4, D], puerta: [0.6, -1.85, D],
  carga: [0, -0.55, 0], escarcha: [0, 1.3, -0.3], desagote: [0, -1.0, -D + 0.05], boton: [W - 0.05, FZ + 0.45, D], ventilador: [0, 1.3, -D + 0.15],
  bulbo: [-0.7, 0.2, -D + 0.05], rele: [0.55, -1.6, -D - 0.2], gas: [0.85, 1.6, -D - 0.1],
};

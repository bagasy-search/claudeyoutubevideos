// cl2hongos · HILO VISUAL «El cantero de vidrio»: el cantero del patio en corte 3D, con las paredes de vidrio. Se ven las capas
// de tierra, las piedras, las raíces y (cuando toca) el medio ladrillo enterrado. Encima crecen los hongos del video; cada uno
// puede mostrarse en corte (el alambre adentro de la llave), mojarse desde abajo, cuartearse con la helada o prender su luz.
// Unidades: x∈[-1.6,1.6] (largo), y∈[-0.9,0.28] (fondo → borde de ladrillo; la tierra está en y=0), z∈[-0.8,0.8] (z+ = frente).
import React from "react";
import { C, cl, hash, lerp } from "./lib";

export type V3 = [number, number, number];
export type Cam = { ry: number; rx: number; sc: number; cx: number; cy: number };
export const proj = (p: V3, c: Cam): [number, number, number] => {
  const ry = (c.ry * Math.PI) / 180, rx = (c.rx * Math.PI) / 180;
  const x1 = p[0] * Math.cos(ry) + p[2] * Math.sin(ry), z1 = -p[0] * Math.sin(ry) + p[2] * Math.cos(ry);
  const y2 = p[1] * Math.cos(rx) - z1 * Math.sin(rx), z2 = p[1] * Math.sin(rx) + z1 * Math.cos(rx);
  const f = 7 / (7 - z2);
  return [c.cx + x1 * c.sc * f, c.cy - y2 * c.sc * f, z2];
};
const X = 1.6, Y0 = -0.9, YB = 0.28, Z = 0.8;
const pts = (a: V3[], c: Cam) => a.map((p) => proj(p, c).slice(0, 2).join(",")).join(" ");

// un hongo visto de frente (2D, escalado por la perspectiva de su base)
export type HongoSt = {
  on: number; tam: number; paint?: number; dots?: number; corte?: number; agua?: number; grieta?: number; luz?: number; ladrillo?: number;
  col?: string; dotCol?: string; marca?: number; seed?: number;
};
export const HongoDib: React.FC<{ x: number; y: number; k: number; st: HongoSt; t: number; noche?: number }> = ({ x, y, k, st, t, noche = 0 }) => {
  if (st.on <= 0.01) return null;
  const s = k * st.tam * st.on, cw = 1.25 * s, ch = 0.62 * s, sw = 0.24 * s, sh = 0.78 * s;   // ancho/alto de sombrero y tallo
  const yb = y - (st.ladrillo ?? 0) * 0.16 * s, top = yb - sh;                                         // si hay ladrillo, el hongo sube
  const capCol = st.col ?? C.cap, gris = C.cem, pc = cl(st.paint ?? 0);
  const mix = (a: string, b: string, u: number) => `color-mix(in srgb, ${b} ${Math.round(u * 100)}%, ${a})`;
  const capD = `M${x - cw},${top} C ${x - cw},${top - ch * 1.35} ${x + cw},${top - ch * 1.35} ${x + cw},${top} Q ${x},${top + ch * 0.22} ${x - cw},${top} Z`;
  const stemD = `M${x - sw * 1.25},${yb} C ${x - sw * 0.9},${yb - sh * 0.5} ${x - sw},${top + 4} ${x - sw * 0.85},${top} L ${x + sw * 0.85},${top} C ${x + sw},${top + 4} ${x + sw * 0.9},${yb - sh * 0.5} ${x + sw * 1.25},${yb} Z`;
  const nd = Math.round(9 * cl(st.dots ?? 0)), sd = st.seed ?? 1;
  const cid = `cst${Math.round(x)}_${Math.round(y)}`;
  const corte = cl(st.corte ?? 0), agua = cl(st.agua ?? 0), gr = cl(st.grieta ?? 0), luz = cl(st.luz ?? 0);
  return (
    <g style={noche > 0 ? { filter: `brightness(${1 - 0.65 * noche * (1 - luz)})` } : undefined}>
      {luz > 0 && <ellipse cx={x} cy={yb - 4} rx={cw * 1.6} ry={ch * 0.7} fill={C.sun} opacity={0.35 * luz} filter="url(#csoft)" />}
      <path d={stemD} fill={mix(gris, C.cream, pc)} stroke="rgba(0,0,0,.25)" strokeWidth={1.5} />
      {agua > 0 && <><clipPath id={cid}><path d={stemD} /></clipPath><rect x={x - sw * 1.4} y={yb - agua * sh} width={sw * 2.8} height={agua * sh} fill={C.water} opacity={0.6} clipPath={`url(#${cid})`} /></>}
      <path d={capD} fill={mix(gris, capCol, pc)} stroke="rgba(0,0,0,.3)" strokeWidth={1.5} />
      {luz > 0 && <path d={capD} fill={C.sun} opacity={0.18 * luz + 0.08 * luz * Math.sin(t * 3)} />}
      {Array.from({ length: nd }, (_, i) => {
        const a = -2.5 + (i / 8) * 1.9 + (hash(i, sd) - 0.5) * 0.25, r = 0.55 + 0.4 * hash(i, sd + 3);
        const px = x + Math.cos(a) * cw * r * 0.95, py = top - ch * 0.35 + Math.sin(a) * ch * 0.75 * r, rr = s * (0.05 + 0.07 * (1 - r) + 0.02 * hash(i, sd + 5));
        return <ellipse key={i} cx={px} cy={py} rx={rr} ry={rr * 0.8} fill={st.dotCol ?? "#fbf3e2"} />;
      })}
      {corte > 0 && (
        <g opacity={corte}>
          {/* corte: el sombrero hueco con la llave, el tallo con el alambre que entra */}
          <path d={capD} fill="rgba(60,56,50,.72)" />
          <rect x={x - sw * 0.6} y={top - ch * 0.42} width={sw * 1.2} height={ch * 0.5} rx={4} fill="rgba(20,18,14,.85)" stroke={C.sun} strokeWidth={2} strokeDasharray="5 4" />
          <path d={stemD} fill="rgba(60,56,50,.72)" />
          <line x1={x} y1={yb - 6} x2={x} y2={top - ch * 0.36} stroke={C.red} strokeWidth={Math.max(3, s * 0.03)} strokeLinecap="round" />
        </g>
      )}
      {gr > 0 && <path d={`M${x - sw * 0.6},${yb - 2} l ${sw * 0.4},${-sh * 0.25} l ${-sw * 0.3},${-sh * 0.2} l ${sw * 0.5},${-sh * 0.25} M${x + sw * 0.5},${yb - 2} l ${-sw * 0.3},${-sh * 0.3}`} stroke="#1c1a16" strokeWidth={2.5} fill="none" pathLength={1} strokeDasharray={`${gr} 1`} />}
      {(st.marca ?? 0) > 0.01 && <g opacity={st.marca}><circle cx={x + cw * 0.7} cy={top - ch * 0.9} r={10 + 3 * Math.sin(t * 6)} fill={C.red} /><circle cx={x + cw * 0.7} cy={top - ch * 0.9} r={24} fill={C.red} opacity={0.25} filter="url(#csoft)" /></g>}
    </g>
  );
};

export const Cantero: React.FC<{
  t: number; cam: Cam; hongos: { p: V3; st: HongoSt }[]; ladrillo?: number; humedad?: number; hielo?: number; noche?: number; children?: (c: Cam) => React.ReactNode;
}> = ({ t, cam, hongos, ladrillo = 0, humedad = 0, hielo = 0, noche = 0, children }) => {
  const P = (p: V3) => proj(p, cam);
  const v: V3[] = [[-X, Y0, -Z], [X, Y0, -Z], [X, YB, -Z], [-X, YB, -Z], [-X, Y0, Z], [X, Y0, Z], [X, YB, Z], [-X, YB, Z]];
  const E = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
  const capa = (y0: number, y1: number): V3[][] => [
    [[-X, y0, Z], [X, y0, Z], [X, y1, Z], [-X, y1, Z]], [[X, y0, -Z], [X, y0, Z], [X, y1, Z], [X, y1, -Z]], [[-X, y0, -Z], [-X, y0, Z], [-X, y1, Z], [-X, y1, -Z]],
  ];
  // piedras y raíces sobre la cara de adelante (corte)
  const piedras = Array.from({ length: 22 }, (_, i) => ({ p: [-X + 0.1 + hash(i, 21) * (2 * X - 0.2), Y0 + 0.08 + hash(i, 22) * 0.55, Z] as V3, r: 3 + 7 * hash(i, 23) }));
  const raices = [-1.1, -0.2, 0.7, 1.3].map((x0, i) => {
    let d = ""; for (let j = 0; j <= 8; j++) { const y = -0.02 - j * 0.07, x = x0 + 0.12 * Math.sin(j * 1.3 + i); const q = P([x, y, Z]); d += (j ? "L" : "M") + q[0] + "," + q[1]; } return d;
  }).join(" ");
  const ladrillos = Array.from({ length: 16 }, (_, i) => i);
  const top = pts([[-X, 0, -Z], [X, 0, -Z], [X, 0, Z], [-X, 0, Z]], cam);
  const fern = (x: number, z: number, h: number, i: number) => {
    const b = P([x, 0, z]), f = 7 / (7 - b[2]), L = h * cam.sc * f, sw = Math.sin(t * 1.2 + i) * 4;
    return <g key={"fe" + i}>{[-38, -18, 0, 18, 38].map((a, j) => <path key={j} d={`M${b[0]},${b[1]} q ${(a / 38) * L * 0.4 + sw},${-L * 0.6} ${(a / 38) * L * 0.9 + sw},${-L * (0.75 + 0.2 * Math.cos(a))}`} stroke="#5f8f3a" strokeWidth={3} fill="none" opacity={0.85} />)}</g>;
  };
  const dark = cl(noche);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <defs>
        <filter id="csoft"><feGaussianBlur stdDeviation="9" /></filter>
        <linearGradient id="csuelo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4a3020" /><stop offset="0.45" stopColor="#6b4a30" /><stop offset="1" stopColor="#8a6a48" /></linearGradient>
      </defs>
      <ellipse cx={P([0, Y0, 0])[0]} cy={P([0, Y0, 0])[1] + 14} rx={cam.sc * 2.2} ry={cam.sc * 0.25} fill="rgba(0,0,0,.45)" filter="url(#csoft)" />
      {/* tierra en corte: tres caras de vidrio dejan ver las capas */}
      {capa(Y0, 0).map((f, i) => <polygon key={"t" + i} points={pts(f, cam)} fill="url(#csuelo)" opacity={0.78 - 0.18 * dark} />)}
      <polygon points={top} fill="#3a2618" opacity={0.9} />
      {piedras.map((q, i) => { const r = P(q.p); return <ellipse key={"p" + i} cx={r[0]} cy={r[1]} rx={q.r * cam.sc / 150} ry={q.r * 0.7 * cam.sc / 150} fill="#a59a88" opacity={0.75} />; })}
      <path d={raices} stroke="#d9c39a" strokeWidth={1.6} fill="none" opacity={0.55} />
      {/* humedad: el agua de la tierra (azul) que sube; la helada (cristales) */}
      {humedad > 0 && <polygon points={pts([[-X, Y0, Z], [X, Y0, Z], [X, -0.05, Z], [-X, -0.05, Z]], cam)} fill={C.water} opacity={0.22 * humedad} />}
      {hielo > 0 && Array.from({ length: 30 }, (_, i) => { const q = P([-X + hash(i, 31) * 2 * X, -0.02 - hash(i, 32) * 0.1, Z]); return <path key={"h" + i} d={`M${q[0] - 6},${q[1]} L${q[0] + 6},${q[1]} M${q[0]},${q[1] - 6} L${q[0]},${q[1] + 6} M${q[0] - 4},${q[1] - 4} L${q[0] + 4},${q[1] + 4}`} stroke="#eaf6ff" strokeWidth={1.5} opacity={hielo} />; })}
      {/* borde de ladrillos arriba */}
      {ladrillos.map((i) => { const x0 = -X + (i / 16) * 2 * X; return <polygon key={"b" + i} points={pts([[x0 + 0.01, 0, Z], [x0 + 2 * X / 16 - 0.01, 0, Z], [x0 + 2 * X / 16 - 0.01, YB, Z], [x0 + 0.01, YB, Z]], cam)} fill="#a5543a" stroke="#6e3424" strokeWidth={1} opacity={0.55 + 0.35 * (1 - dark)} />; })}
      {/* aristas de vidrio */}
      {E.map(([a, b], i) => { const p = P(v[a]), q = P(v[b]); return <line key={"e" + i} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={C.edge} strokeWidth={2} />; })}
      {[[-1.3, -0.5, 0.45], [-0.9, 0.55, 0.5], [0.15, -0.6, 0.4], [1.35, -0.3, 0.55], [0.8, 0.6, 0.35]].map(([x, z, h], i) => fern(x, z, h, i))}
      {dark > 0 && <rect x={-200} y={-200} width={2320} height={1480} fill="#05070d" opacity={0.6 * dark} style={{ mixBlendMode: "multiply" }} />}
      {/* hongos (de atrás hacia adelante) */}
      {[...hongos].sort((a, b) => P(a.p)[2] - P(b.p)[2]).map((h, i) => {
        const q = P(h.p), f = 7 / (7 - q[2]), lad = h.st.ladrillo ?? ladrillo;
        return (
          <g key={"g" + i}>
            {lad > 0.01 && <rect x={q[0] - 0.42 * cam.sc * f * h.st.tam} y={q[1] - 0.06 * cam.sc * f * lad} width={0.84 * cam.sc * f * h.st.tam} height={0.22 * cam.sc * f * h.st.tam} rx={3} fill="#b65a3c" stroke="#6e3424" strokeWidth={2} opacity={lad} />}
            <HongoDib x={q[0]} y={q[1]} k={cam.sc * f} st={{ ...h.st, ladrillo: lad, agua: (h.st.agua ?? 0) * (1 - lad) }} t={t} noche={dark} />
          </g>
        );
      })}
      {/* frente de vidrio con brillo */}
      <polygon points={pts([[-X, Y0, Z], [X, Y0, Z], [X, YB, Z], [-X, YB, Z]], cam)} fill={C.glass} stroke="none" />
      {children?.(cam)}
    </svg>
  );
};
export const lerpV = (a: V3, b: V3, k: number): V3 => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];

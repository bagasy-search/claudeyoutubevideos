// fb5na · EL FRASCO DE VIDRIO en 3D (proyección propia, sin librerías): cilindro de vidrio con tapa de metal, el líquido
// con su nivel, su espesor (aceite → miel → dulce de leche) y su leche (burbujas de aire), los pedacitos de telgopor que se
// hunden y se deshacen, y el brillo del vidrio que se corre cuando el frasco gira. Todo f(t) y f(cámara).
import React from "react";
import { C, cl, hash, lerp } from "./lib";

export type V3 = [number, number, number];
export type Cam = { ry: number; rx: number; sc: number; cx: number; cy: number };
export type Pedazo = { p: V3; s: number; d: number }; // posición dentro del frasco (y = 0 fondo, 1.4 boca), lado, cuánto se deshizo
const R = 0.55, H = 1.4;
const rad = (g: number) => (g * Math.PI) / 180;

export const proj = (c: Cam, [x, y, z]: V3) => {
  const a = rad(c.ry), b = rad(c.rx);
  const xr = x * Math.cos(a) - z * Math.sin(a), zr = x * Math.sin(a) + z * Math.cos(a);
  return { x: c.cx + c.sc * xr, y: c.cy - c.sc * y * Math.cos(b) + c.sc * zr * Math.sin(b), z: zr };
};
// elipse de un aro horizontal a la altura y
const aro = (c: Cam, y: number, r = R) => { const o = proj(c, [0, y, 0]); return { cx: o.x, cy: o.y, rx: c.sc * r, ry: c.sc * r * Math.sin(rad(c.rx)) }; };
// cuerpo entre dos alturas: los dos costados + media elipse de adelante abajo y media de atrás arriba
const cuerpo = (c: Cam, y0: number, y1: number, r = R) => {
  const A = aro(c, y0, r), B = aro(c, y1, r);
  return `M${A.cx - A.rx},${A.cy} A${A.rx},${A.ry} 0 0 0 ${A.cx + A.rx},${A.cy} L${B.cx + B.rx},${B.cy} A${B.rx},${B.ry} 0 0 0 ${B.cx - B.rx},${B.cy} Z`;
};

export type FrascoSt = {
  nivel: number;   // 0..1 de la altura
  visc: number;    // 0 disolvente solo · 0.33 aceite · 0.66 miel · 1 dulce de leche
  milk: number;    // 0 transparente · 1 blanco lechoso
  clara?: number;  // 0..1 cuánto se aclaró DE ABAJO PARA ARRIBA (reposo)
  tapa: number;    // 0 sin tapa · 1 cerrada
  ped?: Pedazo[];
  burb?: number;   // 0..1 burbujas subiendo
  reflejo?: number; // 0..1 la ventana reflejada en la superficie (punto miel)
  tinte?: string;
};

export const Frasco: React.FC<{ t: number; cam: Cam; st: FrascoSt; id?: number }> = ({ t, cam: c, st, id = 0 }) => {
  const yl = 0.06 + (H - 0.12) * cl(st.nivel), top = aro(c, yl, R * 0.96), boca = aro(c, H, R * 0.86);
  const col = st.tinte ?? (st.visc < 0.05 ? "rgba(143,211,255,.20)" : `rgba(${Math.round(lerp(214, 240, st.visc))},${Math.round(lerp(196, 150, st.visc))},${Math.round(lerp(150, 50, st.visc))},${lerp(0.28, 0.72, st.visc)})`);
  const clara = st.clara ?? 0, gid = `fr${id}`;
  // brillo del vidrio: una franja que se corre con el giro
  const hx = Math.sin(rad(c.ry * 1.0 + 35)) * 0.62;
  const ped = (st.ped ?? []).map((q) => ({ ...q, pr: proj(c, q.p) })).sort((u, v) => u.pr.z - v.pr.z);
  return (
    <g>
      <defs>
        <linearGradient id={gid + "m"} x1="0" y1="1" x2="0" y2="0">
          <stop offset={0} stopColor={C.milk} stopOpacity={0} />
          <stop offset={cl(clara)} stopColor={C.milk} stopOpacity={0} />
          <stop offset={cl(clara + 0.12)} stopColor={C.milk} stopOpacity={0.85 * st.milk} />
          <stop offset={1} stopColor={C.milk} stopOpacity={0.85 * st.milk} />
        </linearGradient>
        <clipPath id={gid + "c"}><path d={cuerpo(c, 0.06, yl, R * 0.96)} /></clipPath>
      </defs>
      {/* sombra en la mesa */}
      <ellipse cx={aro(c, 0).cx + 30} cy={aro(c, 0).cy + 10} rx={c.sc * R * 1.25} ry={c.sc * R * 0.32} fill="rgba(0,0,0,.4)" />
      {/* vidrio de atrás */}
      <path d={cuerpo(c, 0, H)} fill={C.glass} stroke="rgba(220,240,255,.18)" strokeWidth={2} />
      {/* líquido */}
      {st.nivel > 0.01 && <>
        <path d={cuerpo(c, 0.06, yl, R * 0.96)} fill={col} />
        <path d={cuerpo(c, 0.06, yl, R * 0.96)} fill={`url(#${gid}m)`} />
        <g clipPath={`url(#${gid}c)`}>
          {Array.from({ length: Math.round(40 * (st.burb ?? 0)) }, (_, i) => {
            const u = ((t * (0.08 + 0.1 * hash(i, 3)) + hash(i, 4)) % 1), q = proj(c, [(hash(i, 5) - 0.5) * R * 1.6, 0.08 + u * (yl - 0.1), (hash(i, 6) - 0.5) * R * 1.4]);
            return <circle key={i} cx={q.x} cy={q.y} r={1.5 + 3 * hash(i, 7)} fill="rgba(255,255,255,.75)" opacity={0.8 * (1 - u)} />;
          })}
          {ped.map((q, i) => {
            const s = c.sc * q.s * (1 - 0.92 * q.d), o = cl(1.2 - q.d);
            return s < 1 ? null : <g key={i} opacity={o}>
              <rect x={q.pr.x - s / 2} y={q.pr.y - s / 2} width={s} height={s * 0.85} rx={s * 0.22} fill={C.styro} stroke="rgba(0,0,0,.18)" strokeWidth={1.5} transform={`rotate(${hash(i, 9) * 40 - 20 + q.d * 30} ${q.pr.x} ${q.pr.y})`} />
              {Array.from({ length: 6 }, (_, j) => { const u = ((t * 1.4 + hash(i * 7 + j, 2)) % 1); return <circle key={j} cx={q.pr.x + (hash(i * 7 + j, 3) - 0.5) * s} cy={q.pr.y - s * 0.5 - u * c.sc * 0.4} r={2 + 2 * hash(j, i)} fill="none" stroke="rgba(255,255,255,.8)" strokeWidth={1.2} opacity={q.d > 0 && q.d < 1 ? 1 - u : 0} />; })}
            </g>;
          })}
        </g>
        {/* la superficie */}
        <ellipse cx={top.cx} cy={top.cy} rx={top.rx} ry={top.ry} fill={col} stroke="rgba(255,240,214,.5)" strokeWidth={2} />
        {(st.reflejo ?? 0) > 0.01 && <g opacity={st.reflejo}>
          <clipPath id={gid + "r"}><ellipse cx={top.cx} cy={top.cy} rx={top.rx} ry={top.ry} /></clipPath>
          <g clipPath={`url(#${gid}r)`}>
            <rect x={top.cx - top.rx * 0.5} y={top.cy - top.ry * 0.7} width={top.rx * 0.55} height={top.ry * 1.2} fill="rgba(200,240,190,.75)" />
            <line x1={top.cx - top.rx * 0.22} y1={top.cy - top.ry} x2={top.cx - top.rx * 0.22} y2={top.cy + top.ry} stroke="rgba(60,40,20,.8)" strokeWidth={4} />
          </g>
        </g>}
      </>}
      {/* vidrio de adelante: costados, boca y brillo */}
      <path d={cuerpo(c, 0, H)} fill="none" stroke={C.edge} strokeWidth={3} />
      <rect x={aro(c, 0).cx + c.sc * R * hx - 7} y={aro(c, H * 0.88).cy} width={14} height={aro(c, 0.15).cy - aro(c, H * 0.88).cy} rx={7} fill="rgba(255,255,255,.35)" />
      <ellipse cx={boca.cx} cy={boca.cy} rx={boca.rx} ry={boca.ry} fill="none" stroke={C.edge} strokeWidth={3} />
      {/* tapa de metal */}
      {st.tapa > 0.01 && (() => { const b = aro(c, H + 0.02 + (1 - st.tapa) * 0.5, R * 0.9), b2 = aro(c, H + 0.16 + (1 - st.tapa) * 0.5, R * 0.9); return (
        <g opacity={cl(st.tapa * 3)}>
          <path d={`M${b.cx - b.rx},${b.cy} A${b.rx},${b.ry} 0 0 0 ${b.cx + b.rx},${b.cy} L${b2.cx + b2.rx},${b2.cy} A${b2.rx},${b2.ry} 0 0 0 ${b2.cx - b2.rx},${b2.cy} Z`} fill="#b9b2a3" stroke="#5e584d" strokeWidth={2} />
          <ellipse cx={b2.cx} cy={b2.cy} rx={b2.rx} ry={b2.ry} fill="#d7d0c0" stroke="#5e584d" strokeWidth={2} />
        </g>); })()}
    </g>
  );
};

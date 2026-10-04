// Mini motor 3D para fondos "pintados": cámara pinhole, cajas sombreadas por luz,
// sombras proyectadas, manchas de luz y bruma por distancia. Todo termina en polígonos SVG.
import React from "react";

export type V3 = [number, number, number];
export type V2 = [number, number];
export const W = 1920, H = 1080;
export const LINEA = "#2a1f1b";

/* ── color ── */
const hx = (c: string) => { const n = parseInt(c.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const toHex = (r: number[]) => "#" + r.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
export const mix = (a: string, b: string, t: number) => { const A = hx(a), B = hx(b); return toHex(A.map((v, i) => v + (B[i] - v) * t)); };
export const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

/* ── vectores ── */
export const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];
export const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const norm = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

/* ── cámara ── */
export type Cam = { pos: V3; yaw: number; pitch: number; f: number; cx?: number; cy?: number };
export const proyectar = (cam: Cam, p: V3): { x: number; y: number; z: number } => {
  let [x, y, z] = sub(p, cam.pos);
  const cy = Math.cos(cam.yaw), sy = Math.sin(cam.yaw);
  [x, z] = [x * cy - z * sy, x * sy + z * cy];
  const cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
  [y, z] = [y * cp - z * sp, y * sp + z * cp];
  const zz = Math.max(z, 0.05);
  return { x: (cam.cx ?? W / 2) + (cam.f * x) / zz, y: (cam.cy ?? H / 2) - (cam.f * y) / zz, z };
};
export const pts = (cam: Cam, ps: V3[]) => ps.map((p) => { const q = proyectar(cam, p); return `${q.x.toFixed(1)},${q.y.toFixed(1)}`; }).join(" ");

/* ── escena: luz + bruma ── */
export type Ambiente = {
  luz: V3;            // dirección HACIA la luz (normalizada)
  calido: string;     // color de luz
  frio: string;       // color de sombra (hue shift)
  bruma: string; brumaDesde: number; brumaHasta: number; // bruma por distancia
  sombraCol: string; sombraOp: number;
};

// tono de una cara según su normal: cel shading en 3 niveles + bruma
export const tono = (base: string, n: V3, amb: Ambiente, dist: number) => {
  const d = dot(norm(n), amb.luz);
  const k = d > 0.45 ? 1 : d > 0.05 ? 0.62 : 0.3;
  let c = k >= 1 ? mix(base, amb.calido, 0.22) : k > 0.5 ? mix(base, amb.frio, 0.22) : mix(base, amb.frio, 0.48);
  if (k < 0.5) c = mix(c, "#000000", 0.12);
  const fz = Math.max(0, Math.min(1, (dist - amb.brumaDesde) / (amb.brumaHasta - amb.brumaDesde)));
  return mix(c, amb.bruma, fz * 0.75);
};

/* ── polígono 3D (cara) ── */
export const Cara: React.FC<{ cam: Cam; p: V3[]; fill: string; trazo?: number; op?: number; linea?: string; ao?: boolean; id?: string }> =
  ({ cam, p, fill, trazo = 2.2, op = 1, linea = LINEA }) => (
    <polygon points={pts(cam, p)} fill={fill} opacity={op} stroke={trazo ? linea : "none"} strokeWidth={trazo} strokeLinejoin="round" />
  );

// rect sobre un plano: origen + u*a + v*b
export const quad = (o: V3, u: V3, v: V3, u0: number, u1: number, v0: number, v1: number): V3[] => [
  add(add(o, mul(u, u0)), mul(v, v0)), add(add(o, mul(u, u1)), mul(v, v0)),
  add(add(o, mul(u, u1)), mul(v, v1)), add(add(o, mul(u, u0)), mul(v, v1)),
];

// casco convexo 2D (para sombras)
const casco = (P: V2[]): V2[] => {
  const s = [...P].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o: V2, a: V2, b: V2) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: V2[] = [], up: V2[] = [];
  for (const p of s) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (const p of s.reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
};
// proyecta un punto sobre el piso y=py siguiendo la luz
export const alPiso = (p: V3, luz: V3, py = 0): V3 => { const t = (p[1] - py) / luz[1]; return [p[0] - luz[0] * t, py, p[2] - luz[2] * t]; };

// sombra proyectada de una caja sobre el piso
export const SombraCaja: React.FC<{ cam: Cam; amb: Ambiente; x0: number; x1: number; y1: number; z0: number; z1: number; py?: number }> =
  ({ cam, amb, x0, x1, y1, z0, z1, py = 0 }) => {
    const base: V3[] = [[x0, py, z0], [x1, py, z0], [x1, py, z1], [x0, py, z1]];
    const top: V3[] = base.map((b) => alPiso([b[0], y1, b[2]], amb.luz, py));
    const P = [...base, ...top].map((p) => { const q = proyectar(cam, p); return [q.x, q.y] as V2; });
    return <polygon points={casco(P).map((q) => q.join(",")).join(" ")} fill={amb.sombraCol} opacity={amb.sombraOp} />;
  };

/* ── caja sombreada (edificio, mueble, cajón) con caras visibles ── */
export type CajaProps = {
  cam: Cam; amb: Ambiente; x0: number; x1: number; y0?: number; y1: number; z0: number; z1: number;
  col: string; techo?: string; trazo?: number;
  deco?: (cara: CaraInfo) => React.ReactNode;
};
export type CaraInfo = { nombre: "frente" | "atras" | "izq" | "der" | "techo"; o: V3; u: V3; v: V3; ancho: number; alto: number; color: string; n: V3 };
export const Caja: React.FC<CajaProps> = ({ cam, amb, x0, x1, y0 = 0, y1, z0, z1, col, techo, trazo = 2.2, deco }) => {
  const caras: CaraInfo[] = [
    { nombre: "frente", o: [x0, y0, z0], u: [1, 0, 0], v: [0, 1, 0], ancho: x1 - x0, alto: y1 - y0, n: [0, 0, -1], color: "" },
    { nombre: "atras", o: [x1, y0, z1], u: [-1, 0, 0], v: [0, 1, 0], ancho: x1 - x0, alto: y1 - y0, n: [0, 0, 1], color: "" },
    { nombre: "izq", o: [x0, y0, z1], u: [0, 0, -1], v: [0, 1, 0], ancho: z1 - z0, alto: y1 - y0, n: [-1, 0, 0], color: "" },
    { nombre: "der", o: [x1, y0, z0], u: [0, 0, 1], v: [0, 1, 0], ancho: z1 - z0, alto: y1 - y0, n: [1, 0, 0], color: "" },
    { nombre: "techo", o: [x0, y1, z0], u: [1, 0, 0], v: [0, 0, 1], ancho: x1 - x0, alto: z1 - z0, n: [0, 1, 0], color: "" },
  ];
  const vis = caras.filter((c) => {
    const centro = add(add(c.o, mul(c.u, c.ancho / 2)), mul(c.v, c.alto / 2));
    return dot(c.n, sub(cam.pos, centro)) > 0;
  });
  // más lejanas primero
  vis.sort((a, b) => {
    const ca = add(add(a.o, mul(a.u, a.ancho / 2)), mul(a.v, a.alto / 2)), cb = add(add(b.o, mul(b.u, b.ancho / 2)), mul(b.v, b.alto / 2));
    return Math.hypot(...sub(cb, cam.pos)) - Math.hypot(...sub(ca, cam.pos));
  });
  return (
    <g>
      {vis.map((c, i) => {
        const centro = add(add(c.o, mul(c.u, c.ancho / 2)), mul(c.v, c.alto / 2));
        const dist = Math.hypot(...sub(centro, cam.pos));
        const fill = tono(c.nombre === "techo" && techo ? techo : col, c.n, amb, dist);
        const info = { ...c, color: fill };
        const p = quad(c.o, c.u, c.v, 0, c.ancho, 0, c.alto);
        // oclusión ambiente: franja oscura abajo
        const ao = c.nombre !== "techo" ? quad(c.o, c.u, c.v, 0, c.ancho, 0, Math.min(c.alto, 0.6)) : null;
        return (
          <g key={i}>
            <Cara cam={cam} p={p} fill={fill} trazo={0} />
            {ao && <Cara cam={cam} p={ao} fill="#000" op={0.12} trazo={0} />}
            {deco?.(info)}
            <Cara cam={cam} p={p} fill="none" trazo={trazo} />
          </g>
        );
      })}
    </g>
  );
};

/* ── ventanas sobre una cara ── */
export const Ventanas: React.FC<{ cam: Cam; c: CaraInfo; cols: number; filas: number; mx: number; my: number; vw: number; vh: number; seed: number; luzOn?: string; vidrio?: string; desdeY?: number }> =
  ({ cam, c, cols, filas, mx, my, vw, vh, seed, luzOn = "#f7d98f", vidrio = "#45566a", desdeY = 0 }) => {
    const gx = (c.ancho - 2 * mx - cols * vw) / Math.max(1, cols - 1);
    const gy = (c.alto - desdeY - 2 * my - filas * vh) / Math.max(1, filas - 1);
    const out: React.ReactNode[] = [];
    for (let r = 0; r < filas; r++) for (let k = 0; k < cols; k++) {
      const u0 = mx + k * (vw + gx), v0 = desdeY + my + r * (vh + gy);
      const on = rnd(seed + r * 13 + k * 7) > 0.7;
      const vid = mix(vidrio, c.color, 0.25);
      out.push(
        <g key={`${r}-${k}`}>
          <Cara cam={cam} p={quad(c.o, c.u, c.v, u0 - 0.08, u0 + vw + 0.08, v0 - 0.12, v0 + vh + 0.06)} fill={mix(c.color, "#ffffff", 0.35)} trazo={1.4} />
          <Cara cam={cam} p={quad(c.o, c.u, c.v, u0, u0 + vw, v0, v0 + vh)} fill={on ? luzOn : vid} trazo={1.6} />
          {!on && <Cara cam={cam} p={quad(c.o, c.u, c.v, u0 + vw * 0.1, u0 + vw * 0.35, v0 + vh * 0.15, v0 + vh * 0.9)} fill="#c9dbe6" op={0.25} trazo={0} />}
          <Cara cam={cam} p={quad(c.o, c.u, c.v, u0 + vw / 2 - 0.02, u0 + vw / 2 + 0.02, v0, v0 + vh)} fill={LINEA} op={0.8} trazo={0} />
        </g>,
      );
    }
    return <g>{out}</g>;
  };

/* ── garabatos de suciedad sobre una cara ── */
export const Mugre: React.FC<{ cam: Cam; c: CaraInfo; n: number; seed: number; col?: string }> = ({ cam, c, n, seed, col = "#000" }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const u = 0.3 + rnd(seed + i) * (c.ancho - 0.6), v = 0.4 + rnd(seed + i * 3) * (c.alto - 0.8), l = 0.15 + rnd(i + seed * 2) * 0.35;
      const a = proyectar(cam, add(add(c.o, mul(c.u, u)), mul(c.v, v))), b = proyectar(cam, add(add(c.o, mul(c.u, u + l)), mul(c.v, v + (rnd(i) - 0.5) * 0.12)));
      return <path key={i} d={`M${a.x},${a.y} L${b.x},${b.y}`} stroke={col} strokeWidth={1.4} opacity={0.22} />;
    })}
  </g>
);

/* ── árbol de racimos con lado iluminado ── */
export const Arbol: React.FC<{ cam: Cam; base: V3; alto: number; radio: number; col: string; amb: Ambiente; seed: number }> = ({ cam, base, alto, radio, col, amb, seed }) => {
  const b = proyectar(cam, base), t = proyectar(cam, [base[0], base[1] + alto, base[2]]);
  const esc = (b.y - t.y) / alto; const R = radio * esc;
  const dist = Math.hypot(...sub(base, cam.pos));
  const fz = Math.max(0, Math.min(1, (dist - amb.brumaDesde) / (amb.brumaHasta - amb.brumaDesde)));
  const c1 = mix(mix(col, amb.calido, 0.15), amb.bruma, fz * 0.7), c0 = mix(mix(col, amb.frio, 0.4), amb.bruma, fz * 0.7), c2 = mix(c1, "#fff2c0", 0.25);
  const lx = amb.luz[0] >= 0 ? 1 : -1;
  const clumps = Array.from({ length: 9 }).map((_, i) => ({ x: t.x + (rnd(seed + i) - 0.5) * R * 1.6, y: t.y + R * 0.2 + (rnd(seed + i * 5) - 0.5) * R * 1.4, r: R * (0.42 + rnd(seed + i * 2) * 0.3) }));
  return (
    <g>
      <path d={`M${b.x - 0.08 * esc},${b.y} L${b.x - 0.05 * esc},${t.y + R} M${b.x + 0.08 * esc},${b.y} L${b.x + 0.05 * esc},${t.y + R}`} stroke={LINEA} strokeWidth={1.6} />
      <path d={`M${b.x - 0.08 * esc},${b.y} L${b.x - 0.05 * esc},${t.y + R} L${b.x + 0.05 * esc},${t.y + R} L${b.x + 0.08 * esc},${b.y} Z`} fill={mix("#5a3f2c", amb.bruma, fz * 0.6)} />
      {clumps.map((c, i) => <circle key={i} cx={c.x} cy={c.y} r={c.r} fill={c0} stroke={LINEA} strokeWidth={1.6} />)}
      {clumps.map((c, i) => <circle key={`l${i}`} cx={c.x + lx * c.r * 0.22} cy={c.y - c.r * 0.22} r={c.r * 0.78} fill={c1} />)}
      {clumps.filter((_, i) => i % 3 === 0).map((c, i) => <circle key={`h${i}`} cx={c.x + lx * c.r * 0.4} cy={c.y - c.r * 0.4} r={c.r * 0.35} fill={c2} opacity={0.8} />)}
      {clumps.map((c, i) => <path key={`s${i}`} d={`M${c.x - c.r * 0.5},${c.y + c.r * 0.2} q${c.r * 0.25},${c.r * 0.2} ${c.r * 0.5},0`} stroke={LINEA} strokeWidth={1.2} fill="none" opacity={0.55} />)}
    </g>
  );
};

/* ── pasto en trazos ── */
export const Pasto: React.FC<{ cam: Cam; desde: V3; hasta: V3; n: number; alto: number; col: string; amb: Ambiente; seed: number; ancho?: number }> =
  ({ cam, desde, hasta, n, alto, col, amb, seed, ancho = 0.4 }) => (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const t = rnd(seed + i);
        const p: V3 = [desde[0] + (hasta[0] - desde[0]) * t + (rnd(i * 7 + seed) - 0.5) * ancho, desde[1], desde[2] + (hasta[2] - desde[2]) * t + (rnd(i * 3 + seed) - 0.5) * ancho];
        const h = alto * (0.5 + rnd(i * 11 + seed) * 0.7);
        const a = proyectar(cam, p), b = proyectar(cam, [p[0] + (rnd(i) - 0.5) * 0.25, p[1] + h, p[2]]);
        const c = rnd(i * 5) > 0.5 ? mix(col, amb.calido, 0.3) : mix(col, amb.frio, 0.3);
        return <path key={i} d={`M${a.x},${a.y} Q${(a.x + b.x) / 2 + (rnd(i) - 0.5) * 8},${(a.y + b.y) / 2} ${b.x},${b.y}`} stroke={c} strokeWidth={1.6 + rnd(i) * 1.4} fill="none" strokeLinecap="round" />;
      })}
    </g>
  );

/* ── filtros: temblor de línea + papel ── */
export const Filtros: React.FC<{ id: string; temblor?: number }> = ({ id, temblor = 1.6 }) => (
  <defs>
    <filter id={`mano${id}`} x="-2%" y="-2%" width="104%" height="104%">
      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={3} result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale={temblor} xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </defs>
);

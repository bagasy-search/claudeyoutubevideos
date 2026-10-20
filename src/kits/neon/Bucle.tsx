// El OBJETO ANCLA del estilo: bucle de neón rojo (tubo con patrón de moléculas y bombitas) que vuelve en cada
// capítulo y en el resumen. nx-capitulo-bucle = la cámara vuela A LO LARGO del tubo hasta el número del capítulo.
// nx-resumen-bucle = el mismo bucle con las 4 palabras alrededor. Todo vectorial: se puede acercar 8x sin pixelar.
import React from "react";
import { interpolate } from "remotion";
import { BlurDef, N, SANS, Toma, clamp, easeOut, neonOn, pop, ramp, respira, rnd, useSvgId, useT, vis } from "./base";

type P2 = [number, number];
// ───────── geometría: lemniscata de Bernoulli parametrizada por longitud de arco u ∈ [0,1) ─────────
// u=0 cruce central (sale hacia arriba-izquierda) · 0,25 punta izquierda · 0,5 cruce · 0,75 punta derecha
export type Geo = { a: number; pts: P2[]; cum: number[]; L: number; at: (u: number) => { x: number; y: number; ang: number; nx: number; ny: number } };
const memo = new Map<number, Geo>();
export const geoBucle = (a: number): Geo => {
  const m = memo.get(a);
  if (m) return m;
  const n = 1200;
  const pts: P2[] = [];
  for (let i = 0; i <= n; i++) {
    const th = Math.PI / 2 + (i / n) * Math.PI * 2;
    const s = Math.sin(th), c = Math.cos(th), d = 1 + s * s;
    pts.push([(a * c) / d, (a * s * c) / d]);
  }
  const cum = [0];
  for (let i = 1; i <= n; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = cum[n];
  const at = (u0: number) => {
    const u = ((u0 % 1) + 1) % 1, target = u * L;
    let lo = 0, hi = n;
    while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (cum[mid] < target) lo = mid; else hi = mid; }
    const k = (target - cum[lo]) / (cum[hi] - cum[lo] || 1);
    const x = pts[lo][0] + (pts[hi][0] - pts[lo][0]) * k, y = pts[lo][1] + (pts[hi][1] - pts[lo][1]) * k;
    const ang = Math.atan2(pts[hi][1] - pts[lo][1], pts[hi][0] - pts[lo][0]);
    // normal hacia AFUERA del lóbulo (lejos de su centro)
    const cx = x >= 0 ? a * 0.56 : -a * 0.56;
    let nx = -Math.sin(ang), ny = Math.cos(ang);
    if (nx * (x - cx) + ny * y < 0) { nx = -nx; ny = -ny; }
    return { x, y, ang, nx, ny };
  };
  const g = { a, pts, cum, L, at };
  memo.set(a, g);
  return g;
};
const pathDe = (g: Geo, u0: number, u1: number, ox: number, oy: number) => {
  const n = g.pts.length - 1;
  const i0 = Math.max(0, Math.floor(u0 * n)), i1 = Math.min(n, Math.ceil(u1 * n));
  let d = "";
  for (let i = i0; i <= i1; i++) d += (i === i0 ? "M" : "L") + (g.pts[i][0] + ox).toFixed(1) + "," + (g.pts[i][1] + oy).toFixed(1);
  return d;
};

// tubo por capas: halo, borde rosado, cuerpo rojo, banda interior (volumen)
const Tubo: React.FC<{ d: string; w: number; len: number; k: number; blur: string; on: number; halo?: boolean; puntas?: "round" | "butt" }> = ({ d, w, len, k, blur, on, halo = true, puntas = "round" }) => {
  const dash = k >= 0.999 ? undefined : `${len * k} ${len * 2}`;
  const c = { d, fill: "none", strokeLinecap: puntas, strokeLinejoin: "round" as const, strokeDasharray: dash };
  return (
    <g>
      {halo && <path {...c} stroke={N.rojo} strokeWidth={w * 2.1} opacity={0.42 * on} filter={`url(#${blur})`} />}
      <path {...c} stroke={N.rojoBorde} strokeWidth={w * 1.08} opacity={0.35 + 0.65 * on} />
      <path {...c} stroke={N.rojoTubo} strokeWidth={w * 0.94} />
      <path {...c} stroke="#ff4a64" strokeWidth={w * 0.56} opacity={0.5 * on} />
      <path {...c} stroke="#a40c22" strokeWidth={w * 0.16} opacity={0.35} />
    </g>
  );
};

export type Marca = { u: number; texto: string; t: number; size?: number; dist?: number };
export const BucleNeon: React.FC<{ x: number; y: number; a?: number; ancho?: number; t0: number; dur?: number; t1?: number; marcas?: Marca[]; rot?: number }> = ({ x, y, a = 300, ancho, t0, dur = 1.1, t1 = Infinity, marcas = [], rot = 0 }) => {
  const t = useT();
  const blur = useSvgId("bucleblur"), clip = useSvgId("bucleclip");
  if (!vis(t, t0, t1)) return null;
  const g = geoBucle(a);
  const w = ancho ?? a * 0.16;
  const ox = a + w * 2.5, oy = a * 0.36 + w * 2.5;
  const d = pathDe(g, 0, 1, ox, oy);
  const k = ramp(t, t0, dur, easeOut);
  const on = neonOn(t, t0 + dur * 0.85) * respira(t, 0.5, 0.06);
  const op = t1 === Infinity ? 1 : 1 - ramp(t, t1 - 0.4, 0.4);
  const OV = 0.045; // tramo que pasa POR ENCIMA en el cruce central (sensación 3D)
  const kOver = interpolate(k, [0.5 - OV, 0.5 + OV], [0, 1], clamp);
  const dOver = pathDe(g, 0.5 - OV, 0.5 + OV, ox, oy);
  const lenOver = g.L * OV * 2;
  // patrón de moléculas: hexágonos en zigzag unidos por enlaces + ramitas con átomo
  const paso = w * 0.62, nMol = Math.floor(g.L / paso);
  const mol: React.ReactNode[] = [], bonds: string[] = [];
  const molOv: React.ReactNode[] = [], bondsOv: string[] = []; // los del tramo de arriba se pintan encima del cruce
  let prev: P2 | null = null;
  for (let i = 0; i < nMol; i++) {
    const u = (i + 0.5) / nMol;
    if (u > k) break;
    const p = g.at(u);
    const side = i % 2 ? 1 : -1;
    const cx = p.x + ox + p.nx * side * w * 0.17, cy = p.y + oy + p.ny * side * w * 0.17;
    const r = w * 0.115;
    const ov = Math.abs(u - 0.5) < OV, M = ov ? molOv : mol, B = ov ? bondsOv : bonds;
    let hex = "";
    for (let j = 0; j < 6; j++) { const an = p.ang + (j * Math.PI) / 3; hex += (j ? "L" : "M") + (cx + r * Math.cos(an)).toFixed(1) + "," + (cy + r * Math.sin(an)).toFixed(1); }
    M.push(<path key={"h" + i} d={hex + "Z"} />);
    if (prev) B.push(`M${prev[0].toFixed(1)},${prev[1].toFixed(1)}L${cx.toFixed(1)},${cy.toFixed(1)}`);
    if (i % 3 === 1) {
      const ex = cx + p.nx * side * w * 0.2, ey = cy + p.ny * side * w * 0.2;
      B.push(`M${cx.toFixed(1)},${cy.toFixed(1)}L${ex.toFixed(1)},${ey.toFixed(1)}`);
      M.push(<circle key={"a" + i} cx={ex} cy={ey} r={w * 0.035} fill={N.rojoPatron} stroke="none" />);
    }
    prev = [cx, cy];
  }
  // bombitas: puntos blancos en los dos bordes que titilan (y una "persecución" que corre)
  const nB = Math.floor(g.L / (w * 0.36));
  const bomb: React.ReactNode[] = [], bombOv: React.ReactNode[] = [];
  for (let i = 0; i < nB; i++) {
    const u = i / nB;
    if (u > k) break;
    const p = g.at(u);
    for (const s of [-1, 1]) {
      const ph = rnd(i, s + 3) * 6.28;
      const chase = Math.max(0, Math.cos((u * 18 - t * 1.6 + (s > 0 ? 0.5 : 0)) * Math.PI * 2)) ** 6;
      const br = 0.25 + 0.55 * Math.max(0, Math.sin(t * 3.1 + ph)) ** 4 + 0.6 * chase;
      (Math.abs(u - 0.5) < OV ? bombOv : bomb).push(<circle key={i + "_" + s} cx={p.x + ox + p.nx * s * w * 0.4} cy={p.y + oy + p.ny * s * w * 0.4} r={w * 0.028} fill="#fff" opacity={Math.min(1, br) * on} />);
    }
  }
  const head = k > 0 && k < 1 ? g.at(k) : null;
  const corre = ((t * 0.16) % 1) * g.L;
  return (
    <div style={{ position: "absolute", left: x - ox, top: y - oy, width: ox * 2, height: oy * 2, opacity: op, transform: rot ? `rotate(${rot}deg)` : undefined, pointerEvents: "none" }}>
      <svg width={ox * 2} height={oy * 2} style={{ position: "absolute", overflow: "visible" }}>
        <defs>
          <BlurDef id={blur} s={w * 0.42} />
          <clipPath id={clip}><path d={d} fill="none" stroke="#000" strokeWidth={w * 0.9} /></clipPath>
        </defs>
        <Tubo d={d} w={w} len={g.L} k={k} blur={blur} on={on} />
        <g stroke={N.rojoPatron} strokeWidth={w * 0.022} fill="none" opacity={0.75}>
          <path d={bonds.join("")} />
          {mol}
        </g>
        {bomb}
        {/* cruce: el tramo de arriba se vuelve a pintar (borde incluido) por encima del de abajo; sin halo propio (el filtro de
            un tramo tan corto se recorta en un cuadrado visible) y con puntas rectas (redondas = costura de cápsula) */}
        {kOver > 0 && <Tubo d={dOver} w={w} len={lenOver} k={kOver} blur={blur} on={on} halo={false} puntas="butt" />}
        {kOver > 0 && (
          <g>
            <g stroke={N.rojoPatron} strokeWidth={w * 0.022} fill="none" opacity={0.75}><path d={bondsOv.join("")} />{molOv}</g>
            {bombOv}
          </g>
        )}
        {/* destello que corre por el tubo (vida permanente) */}
        {k >= 1 && <path d={d} fill="none" stroke={N.rojoBorde} strokeWidth={w * 0.5} strokeLinecap="round" opacity={0.35 * on} filter={`url(#${blur})`} strokeDasharray={`${g.L * 0.06} ${g.L}`} strokeDashoffset={-corre} />}
        {head && (
          <g transform={`translate(${head.x + ox},${head.y + oy})`}>
            <circle r={w * 1.1} fill={N.rojo} opacity={0.55} filter={`url(#${blur})`} />
            <circle r={w * 0.3} fill="#fff" />
          </g>
        )}
      </svg>
      {marcas.map((m, i) => {
        if (t < m.t) return null;
        const p = g.at(m.u);
        const s = pop(t, m.t, 11);
        const dist = (m.dist ?? 1.15) * w;
        return (
          <div key={i} style={{ position: "absolute", left: p.x + ox + p.nx * dist, top: p.y + oy + p.ny * dist, transform: `translate(-50%,-50%) scale(${s})`, fontFamily: SANS, fontWeight: 800, fontSize: m.size ?? w * 0.62, color: "#fff", whiteSpace: "nowrap", lineHeight: 1, textAlign: "center", textShadow: "0 0 12px rgba(255,255,255,.35)" }}>{m.texto}</div>
        );
      })}
    </div>
  );
};

// ───────── nx-capitulo-bucle: la cámara vuela a lo largo del tubo ─────────
// Devuelve las tomas de cámara: llega (acelerando) al tramo u0 del bucle, lo recorre a velocidad pareja hasta u1 con
// zoom z (el tubo llena el cuadro) y deja el resto a la toma siguiente del plan. `desplazo` = dónde queda el tubo en
// pantalla respecto del centro (px de pantalla): [0,170] = tubo abajo y el número arriba.
export const vueloBucle = (b: { x: number; y: number; a: number }, t0: number, t1: number, u0: number, u1: number, z = 6, desplazo: [number, number] = [0, 170], rot = -8): Toma[] => {
  const g = geoBucle(b.a);
  const n = 6, out: Toma[] = [];
  for (let i = 0; i <= n; i++) {
    const k = i / n, p = g.at(u0 + (u1 - u0) * k);
    const zz = z * (1 + 0.08 * k);
    out.push([t0 + (t1 - t0) * k, b.x + p.x - desplazo[0] / zz, b.y + p.y - desplazo[1] / zz, zz, rot + 4 * k, i < n ? "lin" : "io"]);
  }
  return out;
};

// número gigante + palabra del capítulo, fijos en el escenario (encima del tubo que pasa)
export const NumeroCapitulo: React.FC<{ n: number | string; texto: string; t0: number; t1: number; w: number; arriba?: boolean }> = ({ n, texto, t0, t1, w, arriba = true }) => {
  const t = useT();
  if (!vis(t, t0, t1)) return null;
  const s = pop(t, t0, 13);
  const bl = interpolate(t - t0, [0, 0.22], [18, 0], clamp);
  const sal = ramp(t, t1 - 0.35, 0.35);
  const y = arriba ? 250 : 760;
  return (
    <div style={{ position: "absolute", left: w * 0.12 - sal * 260, top: y, display: "flex", alignItems: "center", gap: 26, opacity: 1 - sal, filter: `blur(${bl + sal * 10}px)` }}>
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 210, lineHeight: 0.8, color: "#fff", transform: `translateY(${(1 - s) * 60}px) scale(${0.7 + 0.3 * s})`, transformOrigin: "50% 100%", textShadow: "0 0 30px rgba(255,255,255,.35), 0 10px 30px rgba(0,0,0,.6)" }}>{n}</div>
      <div style={{ display: "flex", gap: 0, fontFamily: SANS, fontWeight: 800, fontSize: 84, color: "#fff", letterSpacing: -1.5, textShadow: "0 6px 24px rgba(0,0,0,.7)" }}>
        {texto.split("").map((ch, i) => {
          const k = ramp(t, t0 + 0.12 + i * 0.025, 0.22, easeOut);
          return <span key={i} style={{ opacity: k, filter: `blur(${(1 - k) * 10}px)`, transform: `translateX(${(1 - k) * 18}px)`, display: "inline-block", whiteSpace: "pre" }}>{ch}</span>;
        })}
      </div>
    </div>
  );
};

// ───────── nx-resumen-bucle: las 4 palabras alrededor del bucle ancla ─────────
// Va ENCIMA del BucleNeon ancla (mismo x, y, a). Cada palabra: una luz corre por el tubo desde la anterior, destello
// al llegar y la palabra salta afuera del lóbulo. Orden del molde: arriba-izq, arriba-der, abajo-izq, abajo-der.
const U_RESUMEN = [0.125, 0.625, 0.375, 0.875];
export const ResumenBucle: React.FC<{ x: number; y: number; a?: number; ancho?: number; palabras: { texto: string; t: number }[]; t1?: number }> = ({ x, y, a = 300, ancho, palabras, t1 = Infinity }) => {
  const t = useT();
  const blur = useSvgId("resblur");
  if (!palabras.length || !vis(t, palabras[0].t - 0.6, t1)) return null;
  const g = geoBucle(a);
  const w = ancho ?? a * 0.16;
  const ox = a + w * 2.5, oy = a * 0.36 + w * 2.5;
  const op = t1 === Infinity ? 1 : 1 - ramp(t, t1 - 0.4, 0.4);
  return (
    <div style={{ position: "absolute", left: x - ox, top: y - oy, width: ox * 2, height: oy * 2, opacity: op, pointerEvents: "none" }}>
      <svg width={ox * 2} height={oy * 2} style={{ position: "absolute", overflow: "visible" }}>
        <defs><BlurDef id={blur} s={w * 0.5} /></defs>
        {palabras.map((pw, i) => {
          const uA = i === 0 ? U_RESUMEN[3] - 0.25 : U_RESUMEN[(i - 1) % 4], uB = U_RESUMEN[i % 4] + (uA > U_RESUMEN[i % 4] ? 1 : 0);
          const kv = ramp(t, pw.t - 0.45, 0.45);
          if (kv <= 0 || t > pw.t + 0.6) return null;
          const p = g.at(uA + (uB - uA) * kv);
          const fl = interpolate(t, [pw.t - 0.02, pw.t + 0.08, pw.t + 0.6], [0, 1, 0], clamp);
          return (
            <g key={i}>
              {kv < 1 && <g transform={`translate(${p.x + ox},${p.y + oy})`}><circle r={w * 0.9} fill="#fff" opacity={0.5} filter={`url(#${blur})`} /><circle r={w * 0.25} fill="#fff" /></g>}
              {fl > 0 && <circle cx={p.x + ox} cy={p.y + oy} r={w * (0.8 + 1.8 * (t - pw.t))} fill="none" stroke="#fff" strokeWidth={w * 0.12} opacity={fl} filter={`url(#${blur})`} />}
            </g>
          );
        })}
      </svg>
      {palabras.map((pw, i) => {
        if (t < pw.t) return null;
        const p = g.at(U_RESUMEN[i % 4]);
        const s = pop(t, pw.t, 10);
        const dist = w * 1.35;
        const lx = p.x + ox + p.nx * dist, ly = p.y + oy + p.ny * dist;
        return (
          <div key={i} style={{ position: "absolute", left: lx, top: ly, transform: `translate(-50%,-50%) scale(${s})`, fontFamily: SANS, fontWeight: 800, fontSize: w * 0.72, color: "#fff", whiteSpace: "nowrap", letterSpacing: -0.5, textShadow: `0 0 ${14 * (1 + interpolate(t - pw.t, [0, 0.5], [2, 0], clamp))}px rgba(255,255,255,.45)` }}>{pw.texto}</div>
        );
      })}
    </div>
  );
};

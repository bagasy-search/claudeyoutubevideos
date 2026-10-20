// nx-camino-ab — expectativa vs realidad ("creías que iba a A y fue a B"): ruta punteada en perspectiva hacia A y un
// camino de neón verde que se abre hacia B. Una luz con cono corre por la ruta, se frena en el cruce apuntando a A
// (lo que el espectador espera) y en la palabra del giro se desvía por el verde hasta B, dejando estela.
import React from "react";
import { interpolate } from "remotion";
import { BlurDef, N, SANS, clamp, ease, easeOut, lerp, pop, ramp, useSvgId, useT, vis } from "./base";
import { LineaTitulo } from "./Titulo";

type P2 = [number, number];
const cubic = (p: P2[], k: number): P2 => {
  const m = 1 - k;
  return [m * m * m * p[0][0] + 3 * m * m * k * p[1][0] + 3 * m * k * k * p[2][0] + k * k * k * p[3][0], m * m * m * p[0][1] + 3 * m * m * k * p[1][1] + 3 * m * k * k * p[2][1] + k * k * k * p[3][1]];
};
type Poly = { pts: P2[]; cum: number[]; L: number };
const poly = (ctrl: P2[], n = 160): Poly => {
  const pts = Array.from({ length: n + 1 }, (_, i) => cubic(ctrl, i / n));
  const cum = [0];
  for (let i = 1; i <= n; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return { pts, cum, L: cum[n] };
};
const sobre = (p: Poly, u: number) => {
  const target = Math.max(0, Math.min(1, u)) * p.L;
  let i = 1;
  while (i < p.pts.length - 1 && p.cum[i] < target) i++;
  const k = (target - p.cum[i - 1]) / (p.cum[i] - p.cum[i - 1] || 1);
  const a = p.pts[i - 1], b = p.pts[i];
  return { x: lerp(a[0], b[0], k), y: lerp(a[1], b[1], k), ang: Math.atan2(b[1] - a[1], b[0] - a[0]) };
};

// (x, y) = centro del dibujo en el MUNDO. tB = se enciende el camino verde · tLuz = arranca la luz · tDesvio = gira a B.
export const CaminoAB: React.FC<{ x: number; y: number; t0: number; tB: number; tLuz: number; tDesvio: number; t1?: number; etiquetaA?: string; etiquetaB?: string; titulo?: string; ancho?: number; alto?: number }> = ({ x, y, t0, tB, tLuz, tDesvio, t1 = Infinity, etiquetaA = "A", etiquetaB = "B", titulo, ancho = 1100, alto = 720 }) => {
  const t = useT();
  const blur = useSvgId("cblur"), cono = useSvgId("ccono");
  if (!vis(t, t0, t1)) return null;
  const sal = t1 === Infinity ? 0 : ramp(t, t1 - 0.35, 0.35);
  const yh = 40;
  const esc = (yy: number) => interpolate(yy, [yh, alto], [0.16, 1], clamp); // perspectiva: lejos = chico
  const A = poly([[ancho * 0.12, alto + 30], [ancho * 0.34, alto * 0.55], [ancho * 0.5, alto * 0.24], [ancho * 0.36, alto * 0.09]]);
  const uF = 0.4;
  const F = sobre(A, uF);
  const B = poly([[F.x, F.y], [F.x + ancho * 0.12, F.y - alto * 0.08], [ancho * 0.62, alto * 0.16], [ancho * 0.9, alto * 0.11]]);
  // ruta punteada (dos líneas de carril) que se tiende de cerca hacia lejos
  const kA = ramp(t, t0, 0.9, easeOut);
  const dashes: React.ReactNode[] = [];
  for (const lado of [0, 1]) {
    let d = 0, i = 0;
    while (d < A.L * kA) {
      const p = sobre(A, d / A.L), s = esc(p.y);
      const len = 36 * s, gap = 28 * s;
      const q = sobre(A, Math.min(1, (d + len) / A.L));
      const off = lado ? -74 * s : 0;
      const nx = -Math.sin(p.ang), ny = Math.cos(p.ang);
      dashes.push(<line key={lado + "_" + i++} x1={p.x + nx * off} y1={p.y + ny * off} x2={q.x + nx * off} y2={q.y + ny * off} stroke="#fff" strokeOpacity={(lado ? 0.45 : 0.85) * (t > tDesvio ? 0.55 : 1)} strokeWidth={(lado ? 4 : 7) * s} strokeLinecap="round" />);
      d += len + gap;
    }
  }
  // camino verde de neón (ancho según perspectiva)
  const kB = ramp(t, tB, 0.8, easeOut);
  const verde: React.ReactNode[] = [], halo: React.ReactNode[] = [];
  const nS = 90;
  for (let i = 0; i < nS; i++) {
    const u0 = i / nS, u1 = (i + 1) / nS;
    if (u0 > kB) break;
    const p = sobre(B, u0), q = sobre(B, Math.min(u1, kB)), s = esc(p.y);
    verde.push(<line key={i} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={N.verde} strokeWidth={7 * s} strokeLinecap="round" />);
    halo.push(<line key={i} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={N.verde} strokeWidth={30 * s} strokeLinecap="round" />);
  }
  // la luz: por A hasta el cruce, se frena apuntando a A, y en tDesvio dobla por B
  let luz: { x: number; y: number; ang: number } | null = null, enB = false;
  const llegaF = tDesvio - 0.35;
  if (t >= tLuz) {
    if (t < tDesvio) {
      const k = interpolate(t, [tLuz, llegaF], [0, 1], { ...clamp, easing: easeOut });
      const p = sobre(A, uF * k);
      const adelante = sobre(A, uF + 0.06);
      luz = { x: p.x, y: p.y, ang: k >= 1 ? Math.atan2(adelante.y - F.y, adelante.x - F.x) : p.ang };
    } else {
      enB = true;
      const k = interpolate(t, [tDesvio, tDesvio + 1.3], [0, 1], { ...clamp, easing: ease });
      const p = sobre(B, k);
      const aA = Math.atan2(sobre(A, uF + 0.06).y - F.y, sobre(A, uF + 0.06).x - F.x);
      luz = { x: p.x, y: p.y, ang: lerp(aA, p.ang, ramp(t, tDesvio, 0.25)) };
    }
  }
  const estela: React.ReactNode[] = [];
  if (luz) {
    const camino = enB ? B : A;
    const uNow = enB ? interpolate(t, [tDesvio, tDesvio + 1.3], [0, 1], { ...clamp, easing: ease }) : interpolate(t, [tLuz, llegaF], [0, uF], { ...clamp, easing: easeOut });
    const n = 28;
    for (let i = 0; i < n; i++) {
      const ua = uNow - (i + 1) * 0.012, ub = uNow - i * 0.012;
      if (ub <= 0) break;
      const p = sobre(camino, Math.max(0, ua)), q = sobre(camino, ub), s = esc(q.y);
      estela.push(<line key={i} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={enB ? "#d9ffe0" : "#fff"} strokeOpacity={(1 - i / n) * 0.8} strokeWidth={14 * s} strokeLinecap="round" />);
    }
  }
  const sL = luz ? esc(luz.y) : 1;
  const eA = sobre(A, 1), eB = sobre(B, 1);
  return (
    <div style={{ position: "absolute", left: x - ancho / 2, top: y - alto / 2, width: ancho, height: alto, opacity: 1 - sal }}>
      {titulo && <div style={{ position: "absolute", left: ancho / 2 - 700, top: -150, width: 1400 }}><LineaTitulo texto={titulo} t0={t0} size={64} /></div>}
      <svg width={ancho} height={alto} style={{ position: "absolute", overflow: "visible" }}>
        <defs>
          <BlurDef id={blur} s={7} />
          <radialGradient id={cono} cx="0" cy="0.5" r="1"><stop offset="0" stopColor="#fff" stopOpacity={0.75} /><stop offset="1" stopColor="#fff" stopOpacity={0} /></radialGradient>
        </defs>
        {dashes}
        <g opacity={0.45} filter={`url(#${blur})`}>{halo}</g>
        {verde}
        <g filter={`url(#${blur})`} opacity={0.7}>{estela}</g>
        {estela}
        {luz && (
          <g transform={`translate(${luz.x},${luz.y})`}>
            <g transform={`rotate(${(luz.ang * 180) / Math.PI})`} filter={`url(#${blur})`}>
              <path d={`M0,0 L${260 * sL},${-80 * sL} Q${300 * sL},0 ${260 * sL},${80 * sL} Z`} fill={`url(#${cono})`} />
            </g>
            <circle r={26 * sL} fill="#fff" opacity={0.4} filter={`url(#${blur})`} />
            <circle r={11 * sL + 2} fill="#fff" />
          </g>
        )}
      </svg>
      {[{ e: eA, s: etiquetaA, t: t0 + 0.6, dim: t > tDesvio }, { e: eB, s: etiquetaB, t: tB + 0.5, dim: false }].map((l, i) => t >= l.t && (
        <div key={i} style={{ position: "absolute", left: l.e.x + (i ? 10 : -10), top: l.e.y - 64, transform: `translate(-50%,-50%) scale(${pop(t, l.t, 11)})`, fontFamily: SANS, fontWeight: 800, fontSize: 56, color: i && t > tDesvio + 1.1 ? N.verde : "#fff", opacity: l.dim ? 0.4 : 1, whiteSpace: "nowrap", textShadow: i && t > tDesvio + 1.1 ? `0 0 22px ${N.verde}` : "0 0 14px rgba(255,255,255,.3)" }}>{l.s}</div>
      ))}
    </div>
  );
};

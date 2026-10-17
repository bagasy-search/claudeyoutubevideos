// Escenas gráficas a mano para deeptime01 (todas en código: mapas, línea de tiempo, gráficos).
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Img, staticFile } from "remotion";
import { C, SERIF, SANS, ramp, lerp, easeOut } from "./theme";
import world from "./world.json";
import gond from "./gond.json";

type P = Record<string, any>;
const W = 1920, H = 1080;

// ---------- utilidades ----------
const Grain: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)" }} />
);
const Label: React.FC<{ x: number; y: number; text: string; o: number; size?: number; color?: string; anchor?: "start" | "middle" | "end"; serif?: boolean; weight?: number; ls?: number }> = ({ x, y, text, o, size = 30, color = C.text, anchor = "middle", serif, weight = 600, ls = 2 }) => (
  <text x={x} y={y} fill={color} opacity={o} fontSize={size} fontFamily={serif ? SERIF : SANS} fontWeight={weight} textAnchor={anchor} letterSpacing={ls}
    style={{ paintOrder: "stroke", stroke: "rgba(0,0,0,0.65)", strokeWidth: size / 7 }}>{text}</text>
);
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

// ---------- MAPA PLANO (equirectangular 3600x1800, 10 px/grado) ----------
const ll = (lon: number, lat: number) => [(lon + 180) * 10, (90 - lat) * 10];
const pathOf = (pts: number[][]) => "M" + pts.map((p) => ll(p[0], p[1]).join(",")).join(" L");
// gran círculo interpolado
const gc = (a: number[], b: number[], n = 80) => {
  const r = Math.PI / 180;
  const v = (lo: number, la: number) => [Math.cos(la * r) * Math.cos(lo * r), Math.cos(la * r) * Math.sin(lo * r), Math.sin(la * r)];
  const A = v(a[0], a[1]), B = v(b[0], b[1]);
  const d = Math.acos(A[0] * B[0] + A[1] * B[1] + A[2] * B[2]);
  const out: number[][] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, s1 = Math.sin((1 - t) * d) / Math.sin(d), s2 = Math.sin(t * d) / Math.sin(d);
    const x = s1 * A[0] + s2 * B[0], y = s1 * A[1] + s2 * B[1], z = s1 * A[2] + s2 * B[2];
    out.push([Math.atan2(y, x) / r, Math.asin(z) / r]);
  }
  return out;
};
const HIMA = [[73.5, 35.6], [75.5, 34.3], [77.5, 32.6], [79.5, 30.9], [81.5, 29.6], [84, 28.6], [86.9, 27.99], [89.5, 27.6], [92, 27.7], [94.5, 28.6], [95.5, 29.2]];
const LON = [-0.13, 51.5], BEI = [116.4, 39.9];
const SAMPLES = [[-112, 56], [-105, 64], [-75, 47], [-60, -3], [-45, -15], [-68, -33], [-8, 13], [18, -27], [31, -20], [37, 8], [45, 24], [26, 63], [15, 61], [-5, 57], [80, 14], [77, 27], [105, 32], [121, 40], [135, 61], [117, -27], [135, -22], [146, -33], [-50, 64], [60, 55], [100, 52], [-90, 40], [10, 46], [47, -19], [-150, 64], [140, 36], [29, -3], [-1, 34]];
const SAM_IDX = [7, 21, 14, 3, 26, 11, 19, 28, 5, 9, 0, 16, 23, 2, 31, 12, 27, 4, 17, 8, 22, 1, 25, 13, 29, 6, 15, 30, 10, 24, 18, 20];

export const FlatMap: React.FC<{ mode: string; dur: number }> = ({ mode, dur }) => {
  const f = useCurrentFrame();
  const t = f / dur;
  // cámara: [cx, cy, ancho] en px del mapa
  const cams: Record<string, number[][]> = {
    himalaya: [[1900, 650, 3000], [2600, 620, 900]],
    london: [[2050, 520, 2300], [2150, 470, 1900]],
    samples: [[1800, 820, 3500], [1800, 820, 3300]],
    india: [[2600, 750, 1500], [2650, 680, 1200]],
  };
  const cam = cams[mode] || cams.samples;
  const k = easeOut(Math.min(1, t * 1.25));
  const cx = lerp(cam[0][0], cam[1][0], k), cy = lerp(cam[0][1], cam[1][1], k), cw = lerp(cam[0][2], cam[1][2], k);
  const ch = (cw * H) / W;
  const vb = `${cx - cw / 2} ${cy - ch / 2} ${cw} ${ch}`;
  const sw = cw / W; // 1 px de pantalla en unidades del mapa
  const indiaOff = mode === "india" ? lerp(-260, 0, ramp(f, 10, dur * 0.62)) : 0;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${C.ocean2}, ${C.ink})` }}>
      <svg width={W} height={H} viewBox={vb} style={{ position: "absolute" }}>
        {/* retícula */}
        {Array.from({ length: 13 }, (_, i) => <line key={"m" + i} x1={i * 300} y1={0} x2={i * 300} y2={1800} stroke="rgba(150,190,220,0.07)" strokeWidth={sw} />)}
        {Array.from({ length: 7 }, (_, i) => <line key={"p" + i} x1={0} y1={i * 300} x2={3600} y2={i * 300} stroke="rgba(150,190,220,0.07)" strokeWidth={sw} />)}
        {(world as any[]).map((c, i) => {
          const isInd = mode === "india" && ["India", "Sri Lanka", "Bangladesh", "Nepal", "Bhutan"].includes(c.n);
          const fill = isInd ? "#c98a3a" : C.land;
          return <path key={i} d={c.d} fill={fill} stroke="rgba(10,16,22,0.9)" strokeWidth={sw * 0.8} transform={isInd ? `translate(0 ${-indiaOff})` : undefined} />;
        })}
        {mode === "himalaya" && (() => {
          const p = ramp(f, 20, 70);
          const d = pathOf(HIMA);
          return <g>
            <path d={d} fill="none" stroke={C.amber} strokeWidth={sw * 14} strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 1`} opacity={0.95} />
            <path d={d} fill="none" stroke={C.amberHot} strokeWidth={sw * 34} strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 1`} opacity={0.25} />
          </g>;
        })()}
        {mode === "london" && (() => {
          const p = ramp(f, 15, dur * 0.7);
          const d = pathOf(gc(LON, BEI));
          const [x1, y1] = ll(LON[0], LON[1]), [x2, y2] = ll(BEI[0], BEI[1]);
          return <g>
            <path d={pathOf(HIMA)} fill="none" stroke={C.dim} strokeWidth={sw * 8} strokeLinecap="round" opacity={0.6 * ramp(f, 0, 15)} />
            <path d={d} fill="none" stroke={C.amber} strokeWidth={sw * 8} strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 1`} />
            <circle cx={x1} cy={y1} r={sw * 12} fill={C.text} opacity={ramp(f, 5, 15)} />
            <circle cx={x2} cy={y2} r={sw * 12} fill={C.text} opacity={ramp(f, dur * 0.65, dur * 0.72)} />
          </g>;
        })()}
        {mode === "samples" && SAMPLES.map((s, i) => {
          const [x, y] = ll(s[0], s[1]);
          const o = ramp(f, 8 + SAM_IDX[i] * 4, 14 + SAM_IDX[i] * 4);
          return <g key={i} opacity={o}><circle cx={x} cy={y} r={sw * 26 * (1.6 - 0.6 * o)} fill="none" stroke={C.amber} strokeWidth={sw * 2} opacity={0.5} /><circle cx={x} cy={y} r={sw * 8} fill={C.amber} /></g>;
        })}
        {mode === "india" && (() => {
          const p = ramp(f, dur * 0.55, dur * 0.85);
          return <path d={pathOf(HIMA)} fill="none" stroke={C.amber} strokeWidth={sw * 14 * p + 0.01} strokeLinecap="round" opacity={p} />;
        })()}
      </svg>
      {/* textos en coordenadas de pantalla */}
      {mode === "himalaya" && <Tit top={770} o={ramp(f, 55, 75)} a="HIMALAYAS" b="≈ 2,400 km long" />}
      {mode === "london" && (() => {
        const [x1, y1] = ll(LON[0], LON[1]), [x2, y2] = ll(BEI[0], BEI[1]);
        const sx = (x: number) => ((x - (cx - cw / 2)) / cw) * W, sy = (y: number) => ((y - (cy - ch / 2)) / ch) * H;
        const km = Math.round(8150 * ramp(f, 15, dur * 0.7) / 50) * 50;
        return <>
          <svg width={W} height={H} style={{ position: "absolute" }}>
            <Label x={sx(x1)} y={sy(y1) - 28} text="LONDON" o={ramp(f, 5, 15)} size={34} />
            <Label x={sx(x2)} y={sy(y2) - 28} text="BEIJING" o={ramp(f, dur * 0.65, dur * 0.75)} size={34} />
          </svg>
          <Tit top={800} o={ramp(f, 10, 25)} a={`${fmt(km)} km`} b="the length of the lost supermountain" />
        </>;
      })()}
      {mode === "samples" && <Tit top={860} o={ramp(f, 10, 30)} a="ZIRCONS FROM EVERY CONTINENT" b="each one dated, each one measured" small />}
      {mode === "india" && <Tit top={860} o={ramp(f, dur * 0.6, dur * 0.75)} a="INDIA HITS ASIA" b="≈ 50 million years ago" small />}
      <Grain />
    </AbsoluteFill>
  );
};

const Tit: React.FC<{ top: number; o: number; a: string; b?: string; small?: boolean }> = ({ top, o, a, b, small }) => (
  <div style={{ position: "absolute", top, width: "100%", textAlign: "center", opacity: o, transform: `translateY(${(1 - o) * 18}px)` }}>
    <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: small ? 70 : 96, color: C.text, letterSpacing: 4, textShadow: "0 4px 24px rgba(0,0,0,0.8)" }}>{a}</div>
    {b && <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, color: C.amber, letterSpacing: 6, textTransform: "uppercase", marginTop: 6, textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}>{b}</div>}
  </div>
);

// ---------- GLOBO DE GONDWANA ----------
const D2R = Math.PI / 180;
const vec = (lo: number, la: number) => [Math.cos(la * D2R) * Math.cos(lo * D2R), Math.cos(la * D2R) * Math.sin(lo * D2R), Math.sin(la * D2R)];
const rot = (v: number[], ax: number[], th: number) => {
  const c = Math.cos(th), s = Math.sin(th), d = ax[0] * v[0] + ax[1] * v[1] + ax[2] * v[2];
  const cr = [ax[1] * v[2] - ax[2] * v[1], ax[2] * v[0] - ax[0] * v[2], ax[0] * v[1] - ax[1] * v[0]];
  return [v[0] * c + cr[0] * s + ax[0] * d * (1 - c), v[1] * c + cr[1] * s + ax[1] * d * (1 - c), v[2] * c + cr[2] * s + ax[2] * d * (1 - c)];
};
const GCOL: Record<string, string> = { afr: "#b08a58", sam: "#7f9a6a", mad: "#b8735a", ind: "#9c84b8", ant: "#c7d0d6", aus: "#c9ad5a" };
const GNAME: Record<string, [string, number, number]> = { afr: ["AFRICA", 20, 8], sam: ["S. AMERICA", -58, -14], ind: ["INDIA", 78, 20], ant: ["ANTARCTICA", 60, -78], aus: ["AUSTRALIA", 134, -25], mad: ["", 0, 0] };
// cinturón transgondwánico (coordenadas MODERNAS de cada placa)
const BELT: { g: string; pts: number[][]; w: number }[] = [
  { g: "afr", w: 1, pts: [[35.5, 29], [37.5, 22], [39, 15], [39, 9], [37.5, 3], [37, -3], [36, -9], [35, -15], [33.5, -20], [32.5, -26]] },
  { g: "ant", w: 1, pts: [[30, -71], [22, -72], [12, -72.5], [2, -72], [-8, -73]] },
  { g: "afr", w: 0.6, pts: [[12.5, -17], [13.5, -21], [16, -22], [19.5, -21], [21, -19]] },
  { g: "afr", w: 0.6, pts: [[2, 25], [3, 18], [3.5, 11], [2, 6]] },
  { g: "sam", w: 0.6, pts: [[-41.5, -16], [-42, -19], [-43, -22]] },
  { g: "sam", w: 0.6, pts: [[-48, -12], [-48.5, -16], [-47.5, -20]] },
  { g: "sam", w: 0.6, pts: [[-52, -29], [-53.5, -31], [-54.5, -33.5]] },
];
export const GondwanaGlobe: React.FC<{ mode: string; dur: number }> = ({ mode, dur }) => {
  const f = useCurrentFrame();
  const asm = mode === "assemble" ? ramp(f, 10, dur * 0.7, easeOut) : 1;
  const beltP = mode === "range" ? ramp(f, 12, dur * 0.6) : 0;
  const C0 = [22, -28];
  const spin = mode === "assemble" ? lerp(-25, 0, asm) : lerp(0, 6, f / dur);
  const lo0 = (C0[0] + spin) * D2R, la0 = C0[1] * D2R;
  const R = 470 * (mode === "range" ? lerp(1, 1.12, ramp(f, 0, dur)) : 1);
  const cx = W / 2, cy = H / 2 + 10;
  const rots = (gond as any).rot as Record<string, number[]>;
  const tf = (g: string) => {
    const r = rots[g];
    const ax = vec(r[1], r[0]);
    return (v: number[]) => rot(v, ax, r[2] * D2R * asm);
  };
  const proj = (v: number[]) => {
    const lo = Math.atan2(v[1], v[0]), la = Math.asin(Math.max(-1, Math.min(1, v[2])));
    const x = Math.cos(la) * Math.sin(lo - lo0);
    const y = Math.cos(la0) * Math.sin(la) - Math.sin(la0) * Math.cos(la) * Math.cos(lo - lo0);
    const vis = Math.sin(la0) * Math.sin(la) + Math.cos(la0) * Math.cos(la) * Math.cos(lo - lo0);
    return [cx + x * R, cy - y * R, vis];
  };
  const polys = (gond as any).polys as { g: string; p: number[][] }[];
  const tfs: Record<string, (v: number[]) => number[]> = {};
  for (const g of Object.keys(rots)) tfs[g] = tf(g);
  const lines = (pts: number[][], g: string) => pts.map((p) => proj(tfs[g](vec(p[0], p[1]))));
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, #0d1b28, ${C.ink} 70%)` }}>
      <svg width={W} height={H}>
        <defs>
          <radialGradient id="gl" cx="40%" cy="35%" r="70%"><stop offset="0%" stopColor="#1b3a52" /><stop offset="100%" stopColor="#081521" /></radialGradient>
          <radialGradient id="sh" cx="50%" cy="50%" r="50%"><stop offset="75%" stopColor="rgba(0,0,0,0)" /><stop offset="100%" stopColor="rgba(0,0,0,0.55)" /></radialGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="6" /></filter>
        </defs>
        <circle cx={cx} cy={cy} r={R + 18} fill="rgba(120,190,255,0.06)" />
        <circle cx={cx} cy={cy} r={R} fill="url(#gl)" />
        {polys.map((pl, i) => {
          const pts = lines(pl.p, pl.g);
          if (pts.every((q) => q[2] < 0)) return null;
          const d = "M" + pts.map((q) => {
            if (q[2] >= 0) return `${q[0].toFixed(1)},${q[1].toFixed(1)}`;
            // punto detrás: lo llevamos al borde
            const dx = q[0] - cx, dy = q[1] - cy, n = Math.hypot(dx, dy) || 1;
            return `${(cx + (dx / n) * R).toFixed(1)},${(cy + (dy / n) * R).toFixed(1)}`;
          }).join(" L") + "Z";
          return <path key={i} d={d} fill={GCOL[pl.g]} stroke="rgba(0,0,0,0.35)" strokeWidth={0.8} />;
        })}
        {beltP > 0 && BELT.map((b, i) => {
          const pts = lines(b.pts, b.g).filter((q) => q[2] > 0);
          const d = "M" + pts.map((q) => `${q[0]},${q[1]}`).join(" L");
          return <g key={i}>
            <path d={d} fill="none" stroke={C.amberHot} strokeWidth={34 * b.w} strokeLinecap="round" opacity={0.35} filter="url(#glow)" pathLength={1} strokeDasharray={`${beltP} 1`} />
            <path d={d} fill="none" stroke={C.amber} strokeWidth={11 * b.w} strokeLinecap="round" pathLength={1} strokeDasharray={`${beltP} 1`} />
          </g>;
        })}
        <circle cx={cx} cy={cy} r={R} fill="url(#sh)" />
        {Object.entries(GNAME).map(([g, [n, lo, la]]) => {
          if (!n) return null;
          const q = proj(tfs[g](vec(lo, la)));
          if (q[2] < 0.15) return null;
          const o = mode === "assemble" ? ramp(f, dur * 0.55, dur * 0.7) : (mode === "range" ? 1 - beltP * 0.6 : 1);
          return <Label key={g} x={q[0]} y={q[1]} text={n} o={o} size={26} ls={4} />;
        })}
      </svg>
      {mode === "assemble" && <Tit top={60} o={ramp(f, dur * 0.6, dur * 0.75)} a="GONDWANA" b="≈ 550 million years ago" small />}
      {mode === "range" && <Tit top={60} o={ramp(f, dur * 0.35, dur * 0.5)} a="THE TRANSGONDWANAN SUPERMOUNTAIN" b="≈ 8,000 km of collision belts" small />}
      <Grain />
    </AbsoluteFill>
  );
};

// ---------- LÍNEA DE TIEMPO PROFUNDO ----------
// eje: 4600 Ma (izq) → 0 (der); opcional futuro
export const DeepTimeline: React.FC<{ mode: string; dur: number }> = ({ mode, dur }) => {
  const f = useCurrentFrame();
  const fut = mode === "future";
  const x0 = 140, x1 = fut ? 1600 : 1780, y = 560;
  const X = (ma: number) => lerp(x0, x1, (4600 - ma) / 4600);
  const XF = (my: number) => x1 + (my / 250) * 180; // futuro
  const draw = ramp(f, 0, 25);
  const band = (a: number, b: number, col: string, delay: number, label: string, sub?: string, up = true) => {
    const o = ramp(f, delay, delay + 15);
    const xa = X(a), xb = X(b);
    return <g opacity={o}>
      <rect x={xa} y={y - 40} width={Math.max(6, xb - xa)} height={80} fill={col} opacity={0.35} />
      <rect x={xa} y={y - 40} width={Math.max(6, xb - xa)} height={80} fill="none" stroke={col} strokeWidth={3} />
      <Label x={(xa + xb) / 2} y={up ? y - 70 : y + 120} text={label} o={1} size={38} color={col} serif weight={700} ls={3} />
      {sub && <Label x={(xa + xb) / 2} y={up ? y - 112 : y + 160} text={sub} o={0.85} size={24} color={C.text} ls={3} />}
    </g>;
  };
  const mark = (ma: number, delay: number, label: string, up = true, col = C.text) => {
    const o = ramp(f, delay, delay + 12);
    const x = X(ma);
    return <g opacity={o}>
      <line x1={x} y1={up ? y - 50 : y + 50} x2={x} y2={up ? y - 150 : y + 150} stroke={col} strokeWidth={2} />
      <circle cx={x} cy={y} r={9} fill={col} />
      <Label x={x} y={up ? y - 165 : y + 185} text={label} o={1} size={26} color={col} ls={2} />
    </g>;
  };
  const show = (m: string[]) => m.includes(mode);
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.ink}, #0f1a24 60%, ${C.ink})` }}>
      <svg width={W} height={H}>
        <line x1={x0} y1={y} x2={lerp(x0, fut ? XF(250) : x1, draw)} y2={y} stroke={C.dim} strokeWidth={4} />
        {[4000, 3000, 2000, 1000].map((m) => <g key={m} opacity={draw}><line x1={X(m)} y1={y - 12} x2={X(m)} y2={y + 12} stroke={C.dim} strokeWidth={2} /><Label x={X(m)} y={y + 50} text={`${m / 1000} BILLION`} o={0.7} size={20} color={C.dim} /></g>)}
        <Label x={x0} y={y - 26} text="EARTH FORMS" o={draw * 0.8} size={20} color={C.dim} anchor="start" />
        <Label x={x1} y={y + 50} text="TODAY" o={draw * 0.9} size={22} color={C.text} anchor="end" />
        {show(["intro", "nuna", "both", "boring", "future"]) && band(2000, 1800, C.amber, 18, "NUNA", "SUPERMOUNTAIN 1")}
        {show(["intro", "both", "future"]) && band(650, 500, C.amberHot, mode === "intro" ? 8 : 30, "TRANSGONDWANAN", "SUPERMOUNTAIN 2")}
        {show(["boring", "both"]) && band(1800, 800, "#6f8a9a", mode === "boring" ? 30 : 60, "THE BORING BILLION", undefined, false)}
        {mode === "intro" && (() => {
          const o = ramp(f, 40, 60);
          return <g opacity={o}><path d={`M${X(1950)},${y - 130} Q${(X(1950) + X(600)) / 2},${y - 260} ${X(600)},${y - 130}`} fill="none" stroke={C.text} strokeWidth={3} strokeDasharray="10 10" />
            <Label x={(X(1950) + X(600)) / 2} y={y - 250} text="≈ 1.4 BILLION YEARS APART" o={1} size={28} /></g>;
        })()}
        {mode === "both" && mark(1800, 80, "FIRST COMPLEX CELLS", false, C.teal)}
        {mode === "both" && mark(560, 100, "FIRST ANIMALS", false, C.teal)}
        {fut && (() => {
          const o = ramp(f, 30, 50);
          return <g opacity={o}><line x1={x1} y1={y} x2={XF(250)} y2={y} stroke={C.amber} strokeWidth={4} strokeDasharray="12 10" />
            <circle cx={XF(225)} cy={y} r={12} fill={C.amber} /><line x1={XF(225)} y1={y - 20} x2={XF(225)} y2={y - 200} stroke={C.amber} strokeWidth={2} /><Label x={XF(225)} y={y - 250} text="NEXT SUPERCONTINENT?" o={1} size={30} color={C.amber} anchor="end" />
            <Label x={XF(225)} y={y - 215} text="+200–250 MILLION YEARS" o={0.9} size={22} anchor="end" /></g>;
        })()}
      </svg>
      <Grain />
    </AbsoluteFill>
  );
};

// ---------- GRÁFICO DE ZIRCONES CON POCO LUTECIO ----------
export const ZirconChart: React.FC<{ mode: string; dur: number }> = ({ mode, dur }) => {
  const f = useCurrentFrame();
  const x0 = 180, x1 = 1760, yb = 820, ht = 520;
  const X = (ma: number) => lerp(x0, x1, (4000 - ma) / 4000);
  // curva ilustrativa: fondo bajo + dos picos (2.0-1.8 Ga y 0.65-0.5 Ga)
  const g = (m: number, mu: number, s: number) => Math.exp(-((m - mu) ** 2) / (2 * s * s));
  const val = (m: number) => 0.1 + 0.05 * Math.sin(m / 170) ** 2 + 0.85 * g(m, 1900, 75) + 0.95 * g(m, 580, 55) + 0.12 * g(m, 2700, 120) + 0.1 * g(m, 1100, 80);
  const N = 240, pts: number[][] = [];
  for (let i = 0; i <= N; i++) { const m = 4000 - (4000 * i) / N; pts.push([X(m), yb - val(m) * ht]); }
  const p = ramp(f, 8, mode === "gap" ? 10 : dur * 0.55);
  const d = "M" + pts.map((q) => q.join(",")).join(" L");
  const area = d + ` L${x1},${yb} L${x0},${yb}Z`;
  const pk1 = ramp(f, dur * 0.35, dur * 0.45), pk2 = ramp(f, dur * 0.55, dur * 0.65);
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.ink}, #0e1822)` }}>
      <svg width={W} height={H}>
        <defs><clipPath id="zc"><rect x={x0} y={0} width={(x1 - x0) * p} height={H} /></clipPath>
          <linearGradient id="za" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.amber} stopOpacity={0.45} /><stop offset="100%" stopColor={C.amber} stopOpacity={0.02} /></linearGradient></defs>
        <line x1={x0} y1={yb} x2={x1} y2={yb} stroke={C.dim} strokeWidth={2} />
        {[4000, 3000, 2000, 1000, 0].map((m) => <Label key={m} x={X(m)} y={yb + 46} text={m ? `${m / 1000} BILLION YEARS AGO` : "TODAY"} o={0.75} size={20} color={C.dim} />)}
        <g clipPath="url(#zc)"><path d={area} fill="url(#za)" /><path d={d} fill="none" stroke={C.amber} strokeWidth={5} /></g>
        <text x={x0} y={170} fill={C.text} fontFamily={SANS} fontSize={26} fontWeight={600} letterSpacing={4}>LOW-LUTETIUM ZIRCONS · SHARE OF ALL ZIRCONS (ILLUSTRATIVE)</text>
        {mode !== "gap" && <g opacity={pk1}><line x1={X(1900)} y1={yb - 0.97 * ht - 20} x2={X(1900)} y2={yb - 0.97 * ht - 80} stroke={C.text} strokeWidth={2} />
          <Label x={X(1900)} y={yb - 0.97 * ht - 95} text="2.0 – 1.8 BILLION" o={1} size={30} /></g>}
        {mode !== "gap" && <g opacity={pk2}><line x1={X(580)} y1={yb - 1.07 * ht - 10} x2={X(580)} y2={yb - 1.07 * ht - 60} stroke={C.text} strokeWidth={2} />
          <Label x={X(580)} y={yb - 1.07 * ht - 75} text="650 – 500 MILLION" o={1} size={30} /></g>}
        {mode === "gap" && (() => { const o = ramp(f, 15, 30); return <g opacity={o}><rect x={X(1800)} y={yb - ht - 40} width={X(800) - X(1800)} height={ht + 40} fill="#6f8a9a" opacity={0.18} />
          <Label x={(X(1800) + X(800)) / 2} y={yb - ht - 60} text="NO SUPERMOUNTAIN SIGNAL" o={1} size={34} color={C.text} /></g>; })()}
      </svg>
      <Grain />
    </AbsoluteFill>
  );
};

// ---------- RELOJ URANIO → PLOMO ----------
export const UPbClock: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const n = 64, cols = 8, s = 62;
  const ox = 960 - 560, oy = 540 - (cols * s) / 2 + 30;
  const decayed = (i: number) => ((i * 37) % n) / n; // orden de decaimiento
  const t = ramp(f, 20, dur * 0.8);
  let lead = 0;
  const dots = Array.from({ length: n }, (_, i) => {
    const r = Math.floor(i / cols), c = i % cols;
    const isPb = decayed(i) < t * 0.6;
    if (isPb) lead++;
    return <g key={i}><circle cx={ox + c * s} cy={oy + r * s} r={22} fill={isPb ? "#8d99a3" : C.amber} opacity={0.95} />
      <text x={ox + c * s} y={oy + r * s + 7} fill={C.ink} fontFamily={SANS} fontWeight={800} fontSize={18} textAnchor="middle">{isPb ? "Pb" : "U"}</text></g>;
  });
  const age = t * 4.4;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 30% 50%, #132433, ${C.ink} 75%)` }}>
      <svg width={W} height={H}>{dots}
        <Label x={ox + (cols - 1) * s / 2} y={oy - 70} text="URANIUM  →  LEAD" o={ramp(f, 0, 15)} size={36} serif weight={700} ls={6} />
      </svg>
      <div style={{ position: "absolute", left: 1040, top: 330, color: C.text, fontFamily: SANS, opacity: ramp(f, 10, 25) }}>
        <div style={{ fontSize: 28, letterSpacing: 6, color: C.dim }}>CRYSTAL AGE</div>
        <div style={{ fontFamily: SERIF, fontSize: 150, fontWeight: 700, lineHeight: 1.05 }}>{age.toFixed(2)}</div>
        <div style={{ fontSize: 34, letterSpacing: 6, color: C.amber }}>BILLION YEARS</div>
        <div style={{ fontSize: 24, marginTop: 40, color: C.dim, letterSpacing: 2 }}>U atoms left: {n - lead} · Pb atoms: {lead}</div>
      </div>
      <Grain />
    </AbsoluteFill>
  );
};

// ---------- CORTE DE CORTEZA: montaña, raíz, granate, zircón ----------
export const CrustSection: React.FC<{ mode: string; dur: number }> = ({ mode, dur }) => {
  const f = useCurrentFrame();
  const up = mode === "thicken" ? ramp(f, 10, dur * 0.8, easeOut) : 1;
  const mtn = (k: number) => {
    const pts: string[] = [];
    for (let x = 0; x <= 1920; x += 20) {
      const g = Math.exp(-((x - 960) ** 2) / (2 * 330 ** 2));
      const jag = (Math.sin(x * 0.045) * 0.5 + Math.sin(x * 0.11) * 0.3) * 30 * g;
      pts.push(`${x},${430 - (g * 300 + jag) * k}`);
    }
    return pts.join(" L");
  };
  const root = (k: number) => {
    const pts: string[] = [];
    for (let x = 1920; x >= 0; x -= 20) { const g = Math.exp(-((x - 960) ** 2) / (2 * 300 ** 2)); pts.push(`${x},${620 + g * 330 * k}`); }
    return pts.join(" L");
  };
  const gar = mode !== "thicken" ? ramp(f, 5, 30) : ramp(f, dur * 0.7, dur * 0.95);
  const zr = mode === "zircon" ? ramp(f, dur * 0.25, dur * 0.45) : 0;
  const fp = mode === "zircon" ? ramp(f, dur * 0.65, dur * 0.8) : 0;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #2a3d52 0%, #6d8396 40%, #6d8396 41%)" }}>
      <svg width={W} height={H}>
        <defs><linearGradient id="cr" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6b5a49" /><stop offset="60%" stopColor="#4a3a2f" /><stop offset="100%" stopColor="#3a2a22" /></linearGradient>
          <linearGradient id="mn" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e9eef2" /><stop offset="12%" stopColor="#8b8378" /><stop offset="100%" stopColor="#6b5a49" /></linearGradient></defs>
        <rect x={0} y={430} width={1920} height={650} fill="#2a1d18" />
        <path d={`M0,430 L${mtn(up)} L1920,430 L1920,1080 L0,1080Z`} fill="url(#mn)" />
        <path d={`M0,430 L1920,430 L${root(up)}Z`} fill="url(#cr)" opacity={0.95} />
        <path d={`M0,620 L${root(up).split(" L").reverse().join(" L")}`} fill="none" stroke="rgba(255,190,120,0.5)" strokeWidth={3} strokeDasharray="8 8" />
        {/* flechas de presión */}
        {[700, 1220].map((x, i) => <g key={i} opacity={mode === "thicken" ? ramp(f, 15, 35) : 0.5}>
          <path d={`M${x + (i ? 160 : -160)},700 L${x + (i ? 40 : -40)},700`} stroke={C.amber} strokeWidth={10} markerEnd="" />
          <path d={`M${x + (i ? 40 : -40)},700 l${i ? 30 : -30},-22 l0,44Z`} fill={C.amber} transform={`rotate(${i ? 180 : 180} ${x + (i ? 40 : -40)} 700)`} />
        </g>)}
        {/* granates en la raíz */}
        {Array.from({ length: 22 }, (_, i) => { const x = 760 + ((i * 97) % 400), y = 760 + ((i * 53) % 160); return <polygon key={i} points={`${x},${y - 14} ${x + 12},${y - 4} ${x + 8},${y + 12} ${x - 8},${y + 12} ${x - 12},${y - 4}`} fill="#9b1f2a" stroke="#ff8a8a" strokeWidth={1.5} opacity={gar * (0.6 + 0.4 * ((i * 13) % 7) / 7)} />; })}
        {zr > 0 && <g opacity={zr}><polygon points="960,820 990,850 990,910 960,940 930,910 930,850" fill="#d9a46a" stroke="#fff3d6" strokeWidth={3} /></g>}
        <Label x={960} y={130} text={mode === "thicken" ? "A GIANT RANGE PRESSES ITS ROOTS DOWN" : mode === "zircon" ? "ZIRCON GROWING NEXT TO GARNET" : "DEEP IN THE ROOTS"} o={ramp(f, 5, 20)} size={40} serif weight={700} ls={4} />
        <Label x={1470} y={820} text={gar > 0.5 ? "GARNET  (hoards lutetium)" : ""} o={gar} size={28} color="#ffb0b0" anchor="start" />
        {zr > 0 && <Label x={1010} y={1000} text="ZIRCON: almost no lutetium left" o={zr} size={28} color={C.amber} anchor="start" />}
      </svg>
      {fp > 0 && <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center", opacity: fp }}>
        <div style={{ display: "inline-block", padding: "22px 44px", background: "rgba(7,11,16,0.82)", border: `2px solid ${C.amber}`, fontFamily: SERIF, fontSize: 58, color: C.text, fontWeight: 700 }}>LOW-Lu ZIRCON = A GIANT MOUNTAIN WAS HERE</div>
      </div>}
      <Grain />
    </AbsoluteFill>
  );
};

// ---------- COMPARACIÓN DE LARGO ----------
export const LengthCompare: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const x0 = 160, full = 1600, k = full / 8000;
  const a = ramp(f, 10, 40), b = ramp(f, dur * 0.3, dur * 0.65);
  const ridge = (x: number, w: number, y: number, h: number, seed: number) => {
    const pts: string[] = [`${x},${y}`];
    for (let i = 0; i <= w; i += 14) { const n = Math.abs(Math.sin((i + seed) * 0.05) * 0.6 + Math.sin((i + seed) * 0.13) * 0.4); pts.push(`${x + i},${y - n * h - 8}`); }
    pts.push(`${x + w},${y}`); return pts.join(" L");
  };
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.ink}, #142231)` }}>
      <svg width={W} height={H}>
        <path d={"M" + ridge(x0, 2400 * k * a, 430, 90, 3)} fill="#c9d3da" opacity={0.9} />
        <Label x={x0} y={300} text="HIMALAYAS" o={a} size={40} anchor="start" serif weight={700} />
        <Label x={x0 + 2400 * k * a + 20} y={420} text={`${fmt(2400 * a)} km`} o={a} size={34} anchor="start" color={C.dim} />
        <path d={"M" + ridge(x0, 8000 * k * b, 830, 150, 40)} fill={C.amber} opacity={0.95} />
        <Label x={x0} y={620} text="TRANSGONDWANAN SUPERMOUNTAIN" o={b > 0 ? 1 : 0} size={40} anchor="start" serif weight={700} />
        <Label x={Math.min(x0 + 8000 * k * b, 1700)} y={880} text={`${fmt(8000 * b)} km`} o={b > 0 ? 1 : 0} size={34} anchor="end" color={C.text} />
        <Label x={960} y={1000} text="MORE THAN 3× LONGER · PEAKS AT LEAST AS HIGH" o={ramp(f, dur * 0.7, dur * 0.82)} size={30} color={C.amber} ls={5} />
      </svg>
      <Grain />
    </AbsoluteFill>
  );
};

// ---------- GRAN DISCORDANCIA ----------
export const Unconformity: React.FC<{ dur: number; bg: string }> = ({ dur, bg }) => {
  const f = useCurrentFrame();
  const z = lerp(1.04, 1.12, f / dur);
  const a = ramp(f, 15, 35), b = ramp(f, dur * 0.35, dur * 0.5), c = ramp(f, dur * 0.55, dur * 0.7);
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <Img src={staticFile(bg)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})`, filter: "brightness(0.75)" }} />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <path d="M0,560 C300,540 520,600 800,575 C1100,548 1400,590 1920,565" fill="none" stroke={C.amber} strokeWidth={8} pathLength={1} strokeDasharray={`${a} 1`} />
        <g opacity={b}><rect x={1250} y={330} width={560} height={110} rx={6} fill="rgba(7,11,16,0.78)" /><Label x={1530} y={378} text="≈ 500 MILLION YEARS" o={1} size={36} /><Label x={1530} y={420} text="Tapeats Sandstone (Cambrian)" o={0.8} size={22} color={C.dim} /></g>
        <g opacity={b}><rect x={1250} y={680} width={560} height={110} rx={6} fill="rgba(7,11,16,0.78)" /><Label x={1530} y={728} text="≈ 1.7 BILLION YEARS" o={1} size={36} /><Label x={1530} y={770} text="Vishnu Schist" o={0.8} size={22} color={C.dim} /></g>
        <g opacity={c}><rect x={110} y={600} width={620} height={90} rx={6} fill={C.amber} /><Label x={420} y={660} text="1+ BILLION YEARS MISSING" o={1} size={40} color={C.ink} weight={800} /></g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------- ESTRONCIO ----------
export const Strontium: React.FC<{ dur: number; bg: string }> = ({ dur, bg }) => {
  const f = useCurrentFrame();
  const x0 = 260, x1 = 1660, yb = 800, ht = 420;
  const X = (ma: number) => lerp(x0, x1, (900 - ma) / 450); // 900 → 450 Ma
  // forma cualitativa conocida: 87Sr/86Sr sube fuerte entre ~650 y ~500 Ma
  const v = (m: number) => 0.2 + 0.55 / (1 + Math.exp((m - 560) / 25)) + 0.04 * Math.sin(m / 18);
  const pts: number[][] = []; for (let m = 900; m >= 450; m -= 5) pts.push([X(m), yb - v(m) * ht]);
  const p = ramp(f, 10, dur * 0.7);
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <Img src={staticFile(bg)} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.35, transform: `scale(${lerp(1.05, 1.12, f / dur)})` }} />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <defs><clipPath id="sc"><rect x={x0} y={0} width={(x1 - x0) * p} height={H} /></clipPath></defs>
        <line x1={x0} y1={yb} x2={x1} y2={yb} stroke={C.dim} strokeWidth={2} />
        {[900, 750, 600, 450].map((m) => <Label key={m} x={X(m)} y={yb + 44} text={`${m} MILLION YEARS AGO`} o={0.75} size={20} color={C.dim} />)}
        <g clipPath="url(#sc)"><path d={"M" + pts.map((q) => q.join(",")).join(" L")} fill="none" stroke={C.teal} strokeWidth={6} /></g>
        <Label x={x0} y={220} text="STRONTIUM ISOTOPES IN SEAWATER (⁸⁷Sr/⁸⁶Sr, SIMPLIFIED)" o={ramp(f, 0, 15)} size={28} anchor="start" ls={3} />
        <Label x={X(560) + 30} y={yb - 0.62 * ht} text="continents being worn away" o={ramp(f, dur * 0.6, dur * 0.75)} size={30} color={C.teal} anchor="start" />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- CADENA: montaña → nutrientes → oxígeno → animales ----------
export const Chain: React.FC<{ dur: number; bg: string; steps: string[]; at: number[] }> = ({ dur, bg, steps, at }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <Img src={staticFile(bg)} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.45, transform: `scale(${lerp(1.04, 1.14, f / dur)})` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 440, display: "flex", justifyContent: "center", alignItems: "center", gap: 18 }}>
        {steps.map((s, i) => {
          const o = ramp(f, at[i], at[i] + 10);
          return <React.Fragment key={i}>
            {i > 0 && <div style={{ fontSize: 60, color: C.amber, opacity: o, fontFamily: SANS }}>→</div>}
            <div style={{ opacity: o, transform: `translateY(${(1 - o) * 30}px) scale(${0.9 + 0.1 * o})`, padding: "26px 30px", background: "rgba(7,11,16,0.82)", border: `2px solid ${i === steps.length - 1 ? C.amber : "rgba(243,239,230,0.35)"}`, borderRadius: 10, fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.text, letterSpacing: 3 }}>{s}</div>
          </React.Fragment>;
        })}
      </div>
    </AbsoluteFill>
  );
};

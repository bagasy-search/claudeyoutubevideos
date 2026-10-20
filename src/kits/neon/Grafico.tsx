// nx-grafico-linea — comparar dos curvas (bueno vs excelente, antes vs después): vitrinas de vidrio con borde de luz;
// la curva se dibuja con una punta brillante. "arco" = sube y baja · "rulos" = se re-engancha (rulitos) y sigue
// subiendo · o una lista de valores 0..1.
import React from "react";
import { BlurDef, NeonPath, easeOut, pop, ramp, useSvgId, useT, vis } from "./base";
import { LineaTitulo } from "./Titulo";

type P2 = [number, number];
export type Panel = { titulo: string; t: number; curva: "arco" | "rulos" | number[]; color?: string; dur?: number };
const puntos = (c: Panel["curva"], w: number, h: number): P2[] => {
  const m = 26, iw = w - m * 2, ih = h - m * 2;
  if (c === "arco") return Array.from({ length: 80 }, (_, i) => { const k = i / 79; return [m + k * iw, m + ih - Math.sin(Math.PI * k) * ih * 0.7 - k * ih * 0.05]; });
  if (c === "rulos") {
    // trocoide con tendencia: rulitos que avanzan y suben
    const n = 260, out: P2[] = [];
    for (let i = 0; i < n; i++) {
      const th = (i / (n - 1)) * Math.PI * 2 * 5.5;
      const xx = th * 1 - 1.9 * Math.sin(th), yy = -1.9 * Math.cos(th);
      out.push([xx, yy - th * 0.32]);
    }
    const xs = out.map((p) => p[0]), ys = out.map((p) => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    return out.map(([xx, yy]) => [m + ((xx - x0) / (x1 - x0)) * iw, m + ih * 0.12 + ((yy - y0) / (y1 - y0)) * ih * 0.86]);
  }
  return c.map((v, i) => [m + (i / (c.length - 1)) * iw, m + ih - v * ih]);
};

// (x, y) = centro del bloque en el MUNDO. Paneles uno debajo del otro (o al lado con `horizontal`).
export const GraficoLinea: React.FC<{ x: number; y: number; t0: number; t1?: number; paneles: Panel[]; ancho?: number; alto?: number; sep?: number; horizontal?: boolean }> = ({ x, y, t0, t1 = Infinity, paneles, ancho = 620, alto = 300, sep = 120, horizontal = false }) => {
  const t = useT();
  const blur = useSvgId("gblur");
  if (!vis(t, t0, t1)) return null;
  const sal = t1 === Infinity ? 0 : ramp(t, t1 - 0.35, 0.35);
  const n = paneles.length;
  const totH = horizontal ? alto : n * alto + (n - 1) * sep, totW = horizontal ? n * ancho + (n - 1) * sep : ancho;
  return (
    <div style={{ position: "absolute", left: x - totW / 2, top: y - totH / 2, width: totW, height: totH, opacity: 1 - sal }}>
      {paneles.map((p, i) => {
        const tp = i === 0 ? Math.min(t0, p.t - 0.4) : p.t - 0.4;
        if (t < tp) return null;
        const e = pop(t, tp, 14, 140);
        const px = horizontal ? i * (ancho + sep) : 0, py = horizontal ? 0 : i * (alto + sep);
        const pts = puntos(p.curva, ancho, alto);
        let L = 0; for (let j = 1; j < pts.length; j++) L += Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]);
        const k = ramp(t, p.t, p.dur ?? 1.6, easeOut);
        const d = "M" + pts.map((q) => q[0].toFixed(1) + "," + q[1].toFixed(1)).join("L");
        // punta brillante: el punto de la curva donde va el dibujo
        let acc = 0, tip: P2 = pts[0];
        for (let j = 1; j < pts.length; j++) { const s = Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]); if (acc + s >= L * k) { const f = (L * k - acc) / (s || 1); tip = [pts[j - 1][0] + (pts[j][0] - pts[j - 1][0]) * f, pts[j - 1][1] + (pts[j][1] - pts[j - 1][1]) * f]; break; } acc += s; tip = pts[j]; }
        const col = p.color ?? "#f2f4ff";
        return (
          <div key={i} style={{ position: "absolute", left: px, top: py, width: ancho, height: alto, transform: `translateY(${(1 - e) * 40}px) scale(${0.94 + 0.06 * e})`, opacity: Math.min(1, e * 1.3) }}>
            <div style={{ position: "absolute", left: -200, right: -200, top: -78 }}><LineaTitulo texto={p.titulo} t0={tp + 0.05} size={38} subrayado={false} /></div>
            <div style={{ position: "absolute", inset: 0, borderRadius: 6, border: "2px solid rgba(255,255,255,.85)", background: "linear-gradient(170deg, rgba(255,255,255,.06), rgba(255,255,255,.015) 50%, rgba(255,255,255,.035))", boxShadow: "0 0 14px rgba(255,255,255,.3), inset 0 0 30px rgba(255,255,255,.04)" }} />
            <svg width={ancho} height={alto} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
              <defs><BlurDef id={blur} s={5} /></defs>
              <NeonPath d={d} color={col} ancho={2.4} k={k} len={L} blurId={blur} />
              {k > 0 && k < 1 && <g transform={`translate(${tip[0]},${tip[1]})`}><circle r={16} fill={col} opacity={0.5} filter={`url(#${blur})`} /><circle r={5} fill="#fff" /></g>}
            </svg>
          </div>
        );
      })}
    </div>
  );
};

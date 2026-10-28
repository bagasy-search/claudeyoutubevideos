// lc01 · vuelta 5 (v5e, planos P30-P43): piezas nuevas. No toca los _comp compartidos ni los v3*/v4*.
// - Tomas (re-export de v4g): sub-tomas internas con fundido CORTO de 6 cuadros (el corte seco interno mide como tirón).
// - LenaLiv (re-export de v4e): la pila de leña del Living con troncos de verdad (no la grilla de lunares del set).
// - ReaccionFx (re-export del kit): rayitas de sorpresa / bocanada de alivio en el mundo.
// - BarrasVida: placa grande (texto ≥ 32 px) «toda la comida de Duluth» vs «2 personas, una vida» (P37).
// - LagoV5: el lago Superior que se dibuja GRANDE sobre una placa del cielo, con DULUTH y el rótulo ≥ 40 px (P41).
import React from "react";
import { interpolate, spring, useVideoConfig } from "remotion";
import { useF } from "../../anikit/camara";
import { F_HUD } from "../../anikit/pantalla";
import { AMBAR } from "../elenco";
import { Icono } from "./lc01_planos2_comp";
export { Tomas } from "./v4g_v4";
export { LenaLiv } from "./v4e_v4";
export { ReaccionFx } from "../../anikit/explica/reaccion";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const tw = (f: number, a: number, b: number, v0: number, v1: number) => v0 + (v1 - v0) * io(Math.max(0, Math.min(1, (f - a) / Math.max(1, b - a))));

// ---------------------------------------------------------------- P37 · toda la ciudad vs 2 personas (pantalla, x/y = esquina sup. izq.)
export const BarrasVida: React.FC<{ x: number; y: number; w: number; desde: number; d2: number; hasta?: number }> = ({ x, y, w, desde, d2, hasta = 1e9 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde || f > hasta + 10) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 14, stiffness: 140 } });
  const o = interpolate(f, [desde, desde + 10, hasta, hasta + 10], [0, 1, 1, 0], CL);
  const b1 = spring({ frame: f - desde - 6, fps, config: { damping: 20, stiffness: 50 } });
  const b2 = f < d2 ? 0 : spring({ frame: f - d2, fps, config: { damping: 11, stiffness: 140 } });
  const W = w - 64;
  const late = f < d2 + 20 ? 0 : 0.5 + 0.5 * Math.sin((f - d2 - 20) / 5);
  const rot: React.CSSProperties = { fontFamily: F_HUD, fontWeight: 700, fontSize: 34, letterSpacing: 2, whiteSpace: "nowrap", lineHeight: 1.05 };
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, opacity: o, transform: `scale(${0.86 + 0.14 * s})`, transformOrigin: "50% 0%",
      background: "rgba(18,15,24,0.92)", border: `4px solid ${AMBAR}`, borderRadius: 22, padding: "12px 30px 16px", boxSizing: "border-box", boxShadow: "0 8px 24px rgba(0,0,0,0.35)" }}>
      <div style={{ ...rot, color: "#f6ecd2" }}>ALL THE FOOD IN DULUTH</div>
      <div style={{ height: 34, width: W * b1, background: AMBAR, borderRadius: 10, marginTop: 6 }} />
      <div style={{ ...rot, color: "#8fc8ff", marginTop: 12, opacity: Math.min(1, b2 * 1.5) }}>2 PEOPLE · ONE LIFETIME</div>
      <div style={{ display: "flex", alignItems: "center", marginTop: 6, height: 34 }}>
        <div style={{ height: 34, width: Math.max(0, W * 0.04 * b2), background: "#5ab0ff", borderRadius: 8, boxShadow: `0 0 0 ${4 * late}px rgba(90,176,255,0.35)` }} />
        <div style={{ height: 34, flex: 1, marginLeft: 8, borderRadius: 8, border: "3px dashed rgba(246,236,210,0.35)", opacity: Math.min(1, b2 * 1.5), boxSizing: "border-box" }} />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- P41 · el lago Superior grande, en una placa clara del cielo (pantalla)
// silueta: punta oeste (Duluth) fina, cuerpo ancho al este, la península de Keweenaw abajo (0..100 × 0..56)
const SUP: [number, number][] = [[0, 52], [8, 46], [16, 40], [24, 33], [31, 27], [38, 21], [44, 15], [50, 12], [56, 8], [62, 5], [68, 4], [74, 6], [79, 4], [85, 7], [90, 12], [95, 18], [100, 26], [99, 33], [94, 37], [88, 41], [82, 40], [76, 44], [70, 47], [66, 44], [64, 36], [61, 33], [58, 38], [55, 46], [50, 48], [44, 47], [38, 49], [32, 49], [26, 50], [20, 52], [14, 54], [8, 55], [3, 55]];
export const LagoV5: React.FC<{ x: number; y: number; w: number; h: number; desde: number; hasta?: number }> = ({ x, y, w, h, desde, hasta = 1e9 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde || f > hasta + 10) return null;
  // placa apaisada: el mapa a la izquierda (se dibuja), los rótulos a la derecha (≥ 32 px)
  const pad = 26, k = Math.min((h - 2 * pad - 40) / 56, (w * 0.36) / 100);
  const pts = SUP.map(([a, b]) => [pad + 6 + a * k, pad + b * k]);
  let L = 0; for (let i = 1; i <= pts.length; i++) { const p = pts[i - 1], q = pts[i % pts.length]; L += Math.hypot(q[0] - p[0], q[1] - p[1]); }
  const d = "M" + pts.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" L") + " Z";
  const s = spring({ frame: f - desde, fps, config: { damping: 15, stiffness: 130 } });
  const o = interpolate(f, [desde, desde + 8, hasta, hasta + 10], [0, 1, 1, 0], CL);
  const u = tw(f, desde + 4, desde + 34, 0, 1);
  const r = tw(f, desde + 24, desde + 40, 0, 1);
  const t1 = tw(f, desde + 10, desde + 20, 0, 1), t2 = tw(f, desde + 36, desde + 48, 0, 1), t3 = tw(f, desde + 46, desde + 58, 0, 1);
  const du = pts[0];
  const pulso = 1 + 0.25 * Math.max(0, Math.sin((f - desde) / 5));
  const tx = pad + 100 * k + 40;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: o, transform: `translateY(${(1 - s) * 18}px) scale(${0.9 + 0.1 * s})`, transformOrigin: "50% 0%",
      background: "rgba(18,15,24,0.9)", border: `4px solid ${AMBAR}`, borderRadius: 24, boxShadow: "0 8px 24px rgba(0,0,0,0.35)" }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", left: -4, top: -4, overflow: "visible" }}>
        <path d={d} fill="#2f6fa8" opacity={0.95 * r} />
        <path d={d} fill="none" stroke="#bfe4ff" strokeWidth={5} strokeDasharray={L} strokeDashoffset={L * (1 - u)} strokeLinejoin="round" />
        {r > 0 && <g opacity={r}>
          <circle cx={du[0]} cy={du[1]} r={12 * pulso} fill={AMBAR} stroke="#120f18" strokeWidth={3} />
          <text x={du[0] + 4} y={du[1] + 40} fontFamily={F_HUD} fontWeight={700} fontSize={32} fill={AMBAR}>DULUTH</text>
        </g>}
        <text x={tx} y={h * 0.3} fontFamily={F_HUD} fontWeight={700} fontSize={46} letterSpacing={3} fill="#f6ecd2" opacity={t1}>LAKE SUPERIOR</text>
        <text x={tx} y={h * 0.3 + 56} fontFamily={F_HUD} fontWeight={700} fontSize={34} letterSpacing={1} fill="#8fd3ff" opacity={t2}>LARGEST FRESHWATER</text>
        <text x={tx} y={h * 0.3 + 98} fontFamily={F_HUD} fontWeight={700} fontSize={34} letterSpacing={1} fill="#8fd3ff" opacity={t2}>LAKE ON EARTH</text>
        <text x={tx} y={h * 0.3 + 140} fontFamily={F_HUD} fontWeight={600} fontSize={30} letterSpacing={3} fill="#f6ecd2" opacity={t3}>BY SURFACE AREA</text>
      </svg>
    </div>
  );
};

// ---------------------------------------------------------------- P42/P43 · la tira de 4 casilleros, versión legible (pantalla, x/y = esquina sup. izq.)
// columnas de ancho fijo (los rótulos ya no se pisan), rótulo en 2 renglones a 28 px, título a 36 px
export const CasillerosV5: React.FC<{ x: number; y: number; desde: number; llenos: { f: number; icono: string; rot: string }[]; titulo?: string; tam?: number; col?: number; gap?: number; hasta?: number }> = ({ x, y, desde, llenos, titulo = "WHAT KILLS TWO PEOPLE?", tam = 112, col = 160, gap = 14, hasta = 1e9 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde || f > hasta + 10) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 16, stiffness: 120 } });
  const o = interpolate(f, [hasta, hasta + 10], [1, 0], CL) * interpolate(f, [desde, desde + 10], [0, 1], CL);
  const W = 4 * col + 3 * gap;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: W, opacity: o, transform: `translateY(${(1 - s) * 16}px)` }}>
      <div style={{ fontFamily: F_HUD, fontWeight: 700, fontSize: 36, letterSpacing: 3, color: "#f6ecd2", textShadow: "0 3px 10px rgba(0,0,0,0.8)", marginBottom: 10, whiteSpace: "nowrap", textAlign: "center" }}>{titulo}</div>
      <div style={{ display: "flex", gap }}>
        {[0, 1, 2, 3].map((i) => {
          const l = llenos[i];
          const on = l && f >= l.f;
          const sp = on ? spring({ frame: f - l.f, fps, config: { damping: 12, stiffness: 150 } }) : 0;
          return (
            <div key={i} style={{ width: col, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ position: "relative", width: tam, height: tam }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: 18, border: "5px dashed #8a8090", background: "rgba(18,15,24,0.6)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 54, color: "#8a8090", opacity: 1 - Math.min(1, sp) }}>?</div>
                {on && <div style={{ position: "absolute", inset: 0, borderRadius: 18, border: "5px solid #e2483a", background: "#f6f0e2", transform: `scale(${0.4 + 0.6 * sp})`, opacity: Math.min(1, sp * 1.6), display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width={tam} height={tam} viewBox="-60 -60 120 120"><Icono n={l.icono} f={f} /></svg>
                </div>}
              </div>
              <div style={{ marginTop: 6, fontFamily: F_HUD, fontWeight: 700, fontSize: 28, lineHeight: 1.05, letterSpacing: 1, color: "#f6ecd2", textAlign: "center", opacity: on ? Math.min(1, sp) : 0, textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>
                {(l?.rot ?? "").split(" ").map((w, j) => <div key={j}>{w}</div>)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Versus de lcf01: panel compacto a la IZQUIERDA (x 60-780) para no tapar la cara de Loretta (centro del cuadro),
// con el título en su propia franja y el valor siempre debajo del título (nunca se pisan, mida lo que mida la barra).
import React from "react";
import { COL, FONT, e, ei, extrude } from "../kits/yanqui3d/lib";

type Side = { label: string; val: string; h: number; col: string; mark?: "ok" | "x" };
const op = (t: number, a: number, out: number) => e(t, a, a + 0.3) * (1 - e(t, out - 0.3, out));
const pop = (t: number, a: number, d = 0.6) => { const x = Math.min(1, Math.max(0, (t - a) / d)); return 1 - Math.pow(1 - x, 3) * Math.cos(x * 4.5); };
const BAR = 300;

export const VersusS: React.FC<{ t: number; at: number; out: number; L: Side; R: Side; title?: string }> = ({ t, at, out, L, R, title }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const col = (c: Side, i: number) => {
    const a = at + 0.15 + i * 0.35, g = ei(t, a, a + 0.8);
    const mk = c.mark && t > a + 0.7 ? Math.min(1, pop(t, a + 0.7, 0.5)) : 0;
    const n = c.val.length, fs = n <= 5 ? 64 : n <= 7 ? 52 : n <= 9 ? 44 : 40;
    return (
      <div key={i} style={{ width: 300, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: FONT, opacity: e(t, a, a + 0.15) }}>
        <div style={{ height: 120, display: "flex", alignItems: "flex-end", justifyContent: "center", textAlign: "center", fontWeight: 900, fontSize: fs, width: 290, overflowWrap: "anywhere", lineHeight: 1.05, color: COL.ink, textShadow: extrude(6, "rgba(0,0,0,.7)") }}>{c.val}</div>
        <div style={{ height: BAR + 20, width: "100%", display: "flex", alignItems: "flex-end", justifyContent: "center", position: "relative" }}>
          <div style={{ width: 170, height: BAR * c.h * g, borderRadius: "18px 18px 6px 6px", background: `linear-gradient(90deg, ${c.col}cc, ${c.col}, ${c.col}aa)`, boxShadow: `0 0 40px ${c.col}55, inset 0 3px 0 rgba(255,255,255,.55), 0 24px 48px rgba(0,0,0,.6)` }} />
          {mk > 0 && <div style={{ position: "absolute", bottom: BAR * c.h * g - 34, left: 205, width: 76, height: 76, borderRadius: "50%", background: c.mark === "ok" ? "#2fbf71" : COL.red, color: "#fff", fontSize: 52, fontWeight: 900, lineHeight: "76px", textAlign: "center", transform: `scale(${mk})`, boxShadow: "0 12px 24px rgba(0,0,0,.5)" }}>{c.mark === "ok" ? "✓" : "✕"}</div>}
        </div>
        <div style={{ height: 96, marginTop: 14, textAlign: "center", fontWeight: 900, fontSize: 32, lineHeight: 1.2, letterSpacing: 3, color: c.col, textShadow: extrude(4, "rgba(0,0,0,.8)") }}>{c.label}</div>
      </div>
    );
  };
  const k = Math.min(1, pop(t, at, 0.7));
  return (
    <div style={{ position: "absolute", left: 60, top: 120, width: 720, opacity: o, transform: `translateX(${(1 - k) * -80}px)` }}>
      <div style={{ position: "absolute", inset: -10, borderRadius: 34, background: "rgba(8,10,16,.62)", boxShadow: "0 30px 80px rgba(0,0,0,.45)" }} />
      <div style={{ position: "relative", padding: "26px 30px 18px" }}>
        {title && <div style={{ minHeight: 64, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 46, lineHeight: 1.1, letterSpacing: 5, color: COL.ink, textShadow: extrude(5, "rgba(0,0,0,.7)") }}>{title}</div>}
        <div style={{ display: "flex", justifyContent: "center", gap: 60, marginTop: 10 }}>{col(L, 0)}{col(R, 1)}</div>
      </div>
    </div>
  );
};

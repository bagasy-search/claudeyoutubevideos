// so29 · CTA sin guía: el botón de suscribirse como OBJETO (tecla roja gruesa con canto), un dedo de arcilla baja y lo aprieta,
// la tecla se hunde, pasa a gris «SUBSCRIBED» y la campanita se hamaca. Nunca arriba a la izquierda; sobre el avatar va chico abajo.
import React from "react";
import { FONT } from "./lib";
import { phys, cl, eIn, eio } from "./hkit";

export const SubCta: React.FC<{ t: number; at: number; out: number; side?: boolean }> = ({ t, at, out, side }) => {
  if (t < at - 0.1 || t > out + 0.8) return null;
  const inn = phys(t, at, 6, 0.55), xo = eIn(t, out - 0.1, out + 0.6), vis = cl(inn) * (1 - xo);
  if (vis <= 0.01) return null;
  const tt = t - at;
  const press = eio(tt, 1.0, 1.25) * (1 - eio(tt, 1.35, 1.7));      // la tecla se hunde y vuelve
  const done = cl((tt - 1.25) / 0.2);                                   // ya suscripto
  const fing = eio(tt, 0.45, 1.05) * (1 - eio(tt, 1.6, 2.2));         // el dedo baja y se va
  const bell = done > 0 ? Math.sin((tt - 1.3) * 9) * Math.exp(-(tt - 1.3) * 1.6) * 28 : 0;
  const sc = side ? 0.58 : 1, x = side ? 470 : 960, y = side ? 900 : 760;
  const depth = 22 * (1 - press * 0.8);
  const top = done > 0.5 ? "#d9d4cc" : "#e2231a", edge = done > 0.5 ? "#9e978c" : "#8f1410";
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${sc * (0.7 + 0.3 * vis)}) rotate(${-2 + 1.2 * Math.sin(tt * 0.6)}deg)`, opacity: vis, fontFamily: FONT }}>
    {/* sombra en la mesada */}
    <div style={{ position: "absolute", left: 30, top: 150, width: 640, height: 50, borderRadius: "50%", background: "rgba(0,0,0,.45)", filter: "blur(18px)" }} />
    <div style={{ display: "flex", alignItems: "center", gap: 34 }}>
      {/* la tecla: canto + cara */}
      <div style={{ position: "relative", width: 560, height: 150 + 22 }}>
        <div style={{ position: "absolute", left: 0, top: 22, width: 560, height: 150, borderRadius: 34, background: edge }} />
        <div style={{ position: "absolute", left: 0, top: 22 - depth, width: 560, height: 150, borderRadius: 34, background: `linear-gradient(180deg, ${top}, ${edge} 160%)`,
          boxShadow: "inset 0 3px 0 rgba(255,255,255,.35), inset 0 -6px 14px rgba(0,0,0,.2)", display: "flex", alignItems: "center", justifyContent: "center",
          color: done > 0.5 ? "#4a453e" : "#fff", fontWeight: 900, fontSize: done > 0.5 ? 64 : 76, letterSpacing: 3 }}>{done > 0.5 ? "SUBSCRIBED ✓" : "SUBSCRIBE"}</div>
      </div>
      {/* la campanita */}
      <div style={{ transform: `rotate(${bell}deg)`, transformOrigin: "50% 8%", fontSize: 120, filter: "drop-shadow(0 10px 18px rgba(0,0,0,.45))", opacity: 0.6 + 0.4 * done }}>🔔</div>
    </div>
    {/* el dedo de arcilla (Blanquito) */}
    <div style={{ position: "absolute", left: 330, top: -330 + 300 * fing + 16 * press, width: 92, height: 330, borderRadius: 46, opacity: cl(fing * 3),
      background: "linear-gradient(90deg, #d8d2c8, #f6f2ec 40%, #e4ded4)", boxShadow: "0 18px 30px rgba(0,0,0,.35)" }} />
  </div>;
};

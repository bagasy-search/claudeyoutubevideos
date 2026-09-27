// TfbCamera — cámara virtual sobre el footage: push-in lento, punch (zoom seco en un golpe), shake (impacto),
// whip (barrido lateral con desenfoque de movimiento para pasar de un plano a otro), drift (deriva suave) y frame
// (reencuadre seco: salto a un plano más cerrado dentro de la misma toma, para cortar planos largos sin cambiar de clip).
// Envuelve la capa base; los eventos se anclan en cuadros ABSOLUTOS del video.
// Uso: <TfbCamera events={[{f:120,dur:10,kind:"punch",amt:0.12},{f:300,dur:8,kind:"whip",dir:1}]}> …footage… </TfbCamera>
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EIO, EO, lin, rnd } from "./theme";

export type CamEvent = { f: number; dur: number; kind: "push" | "punch" | "shake" | "whip" | "drift" | "frame"; amt?: number; dir?: 1 | -1; ox?: number; oy?: number };

const evalEvent = (e: CamEvent, fr: number) => {
  const t = fr - e.f; if (t < 0 || t > e.dur) return null;
  const p = t / Math.max(1, e.dur), a = e.amt ?? 1, d = e.dir ?? 1;
  switch (e.kind) {
    case "frame": return { s: 1 + (a || 0.25), x: 0, y: 0, blur: 0 };   // reencuadre SECO (jump cut a plano más cerrado)
    case "push": return { s: 1 + (a || 0.06) * EIO(p), x: 0, y: 0, blur: 0 };
    case "drift": return { s: 1.04, x: d * (a || 1.2) * (p - 0.5), y: (a || 1.2) * 0.4 * Math.sin(p * Math.PI), blur: 0 };
    case "punch": { // sube rápido y vuelve con rebote corto
      const up = lin(t, [0, 3], [0, 1], EO), down = lin(t, [3, e.dur], [1, 0], EIO);
      return { s: 1 + (a || 0.1) * Math.min(up, down), x: 0, y: 0, blur: 0 };
    }
    case "shake": { const k = (1 - p) * (a || 1); return { s: 1.03, x: (rnd(fr * 1.3) - 0.5) * 2.4 * k, y: (rnd(fr * 2.7 + 5) - 0.5) * 1.8 * k, blur: 0 }; }
    case "whip": { // la mitad saliente se va, la entrante llega: el corte cae en el medio del evento
      const q = p < 0.5 ? lin(p, [0, 0.5], [0, 1], (u) => u * u) : lin(p, [0.5, 1], [-1, 0], (u) => 1 - (1 - u) * (1 - u));
      return { s: 1.06, x: -d * q * 22, y: 0, blur: Math.abs(q) * 26 * (a || 1) };
    }
  }
};

export const TfbCamera: React.FC<{ events: CamEvent[]; children: React.ReactNode }> = ({ events, children }) => {
  const fr = useCurrentFrame();
  let s = 1, x = 0, y = 0, blur = 0, ox = 50, oy = 50;
  for (const e of events) {
    const v = evalEvent(e, fr); if (!v) continue;
    s *= v.s; x += v.x; y += v.y; blur = Math.max(blur, v.blur);
    if (e.ox != null) ox = e.ox; if (e.oy != null) oy = e.oy;
  }
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="tfbWhipBlur" x="-10%" y="0" width="120%" height="100%"><feGaussianBlur stdDeviation={`${(blur * 1.6).toFixed(1)} 0`} /></filter>
      </svg>
      <AbsoluteFill style={{ transform: `translate(${x.toFixed(3)}%, ${y.toFixed(3)}%) scale(${s.toFixed(4)})`, transformOrigin: `${ox}% ${oy}%`,
        filter: blur > 0.3 ? "url(#tfbWhipBlur)" : undefined }}>
        {children}
      </AbsoluteFill>
      {blur > 0.3 ? <AbsoluteFill style={{ backdropFilter: undefined, background: `linear-gradient(90deg, rgba(255,255,255,${(blur / 260).toFixed(3)}), transparent 40%, transparent 60%, rgba(255,255,255,${(blur / 260).toFixed(3)}))` }} /> : null}
    </AbsoluteFill>
  );
};

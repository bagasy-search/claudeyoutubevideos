// cme5nd · vlog crudo: los ÚNICOS fx son el cuadro 0 (miniatura sin texto) y el CTA de la guía (portada + QR grande).
// FXI sale de edl.json (tools/edl.py los ancla a la voz); FXR = id → cómo se dibuja en el segundo t.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Rot, Stage } from "./base";
import { P, e, spr } from "./lib";
import EDL from "./edl.json";

export type Fi = { id: string; a: number; b: number };
export const FXI: Record<string, Fi> = Object.fromEntries(((EDL as { fx?: Fi[] }).fx ?? []).map((f) => [f.id, f]));
FXI.thumb0 = { id: "thumb0", a: 0, b: 0.8 };

// CTA: la portada de la guía entra girada desde la izquierda, el QR (sin URL escrita) desde la derecha
const Cta: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const k1 = spr(t, f.a + 0.15, 0.9), k2 = spr(t, f.a + 0.45, 0.9), fl = Math.sin((t - f.a) * 0.9) * 1.5;
  return (
    <Stage t={t} a={f.a} b={f.b} dim={0.75}>
      <Img src={staticFile(P + "guia.jpg")} style={{ position: "absolute", left: 300, top: 150, height: 780, borderRadius: 10, boxShadow: "0 40px 80px rgba(0,0,0,.65)", opacity: e(t, f.a + 0.1, f.a + 0.3), transform: `perspective(1600px) translateX(${(1 - Math.min(1, k1)) * -260}px) rotateY(${14 + fl}deg) rotateZ(-3deg)` }} />
      <div style={{ position: "absolute", left: 1120, top: 250, width: 500, height: 500, padding: 22, background: "#fff", borderRadius: 24, boxShadow: "0 40px 80px rgba(0,0,0,.6)", opacity: e(t, f.a + 0.4, f.a + 0.6), transform: `translateY(${(1 - Math.min(1, k2)) * 120}px) rotateZ(${2 - fl * 0.5}deg)` }}>
        <Img src={staticFile(P + "qr.png")} style={{ width: "100%", height: "100%" }} />
      </div>
      <Rot t={t} at={f.a + 0.3} out={f.b - 0.35} text="SISTEMA LUZ CERO" x={1370} y={170} size={66} col="#ffb257" />
      <Rot t={t} at={f.a + 0.8} out={f.b - 0.35} text="El link está en la primera" x={1370} y={830} size={44} />
      <Rot t={t} at={f.a + 0.9} out={f.b - 0.35} text="línea de la descripción" x={1370} y={890} size={44} />
    </Stage>
  );
};

export const FXR: Record<string, (t: number, f: Fi) => React.ReactNode> = {
  thumb0: (t) => <AbsoluteFill style={{ background: "#0b0907" }}><Img src={staticFile(P + "thumb0.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1 + 0.03 * Math.min(1, t / 0.8)})` }} /></AbsoluteFill>,
};
for (const id of Object.keys(FXI)) if (id.startsWith("cta")) FXR[id] = (t, f) => <Cta t={t} f={f} />;

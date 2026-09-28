// FixLadder.tsx — LOS SEIS ARREGLOS de rkcard como una ESCALERA de costo que se construye escalón
// por escalón (del más barato al más caro), con el llavero de latón que la sube.
//   highlight=2 — el anticipo (p24): se arma entera rápido y quedan encendidos los 2 primeros
//                 ("most people only need the first two").
//   highlight=6 — el repaso (p43): cada escalón se enciende a su turno, con su precio.
// ⛔ Precios como RANGO aproximado, iguales al guion; nada de cifras de otra fuente.
// ⛔ Escalonado = fracción de la duración (no cuadros fijos).
import React from "react";
import { Easing, interpolate } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, Keyring } from "./RayStage";
import { useT, DiagramStage } from "./LatchKit";

const PASOS = [
  { price: "$0", label: "Use your deadbolt" },
  { price: "$3", label: "3-inch hinge screw" },
  { price: "$0–5", label: "Line up the strike" },
  { price: "$20–40", label: "Knob with a deadlatch" },
  { price: "$15–30", label: "Latch guard" },
  { price: "$30–60", label: "A real deadbolt" },
];

export const FixLadder: React.FC<{
  highlight?: number;
  kicker?: string;
  title?: string;
  bed?: string;
  durationInFrames?: number;
}> = ({ highlight, kicker, title, bed, durationInFrames }) => {
  const hi = Math.max(0, Math.min(6, highlight ?? 6));
  const repaso = hi >= 6;
  const { ph, salida } = useT(durationInFrames);
  const aTitle = ph(0, 0.1, Easing.out(Easing.quad));
  const N = PASOS.length;
  // ventana de construcción: el repaso usa casi todo el plano; el anticipo, la primera mitad
  const c0 = 0.08, c1 = repaso ? 0.84 : 0.5;
  const step = (i: number) => ph(c0 + ((c1 - c0) * i) / N, c0 + ((c1 - c0) * (i + 0.8)) / N, Easing.out(Easing.back(1.4)));
  const litT = (i: number) => (repaso ? step(i) : ph(0.56 + i * 0.08, 0.64 + i * 0.08));
  // llavero: sube al último escalón encendido
  const pos = repaso ? PASOS.reduce((a, _, i) => a + step(i), 0) - 1 : PASOS.slice(0, hi).reduce((a, _, i) => a + litT(i), 0) - 1;
  const X = (i: number) => 190 + i * 262;
  const Y = (i: number) => 800 - i * 78;

  return (
    <DiagramStage bed={bed} kicker={kicker ?? (repaso ? "IN ORDER" : "SIX FIXES")} title={title ?? "Cheapest to most expensive"}
      caption={repaso ? "No camera. No subscription. No bunker." : "Most people only need the first two."} captionTone="brass"
      aTitle={aTitle} aCaption={ph(0.86, 0.94)} salida={salida}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        {PASOS.map((p, i) => {
          const a = step(i);
          const lit = i < hi ? litT(i) : 0;
          const h = 925 - Y(i);
          const hh = h * a;
          return (
            <g key={i} opacity={Math.min(1, a * 1.4)}>
              <rect x={X(i)} y={925 - hh} width={246} height={hh} rx={6}
                fill={lit > 0.5 ? rgba(V.brass, 0.3) : rgba(V.ink2, 0.92)} stroke={lit > 0.5 ? V.brassSoft : rgba(V.bone, 0.3)} strokeWidth={lit > 0.5 ? 3 : 1.5} />
              <text x={X(i) + 18} y={Y(i) + 58} fill={lit > 0.5 ? V.brassSoft : V.white} opacity={a} style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 50 }}>{p.price}</text>
              <text x={X(i) + 18} y={Y(i) + 98} fill={V.bone} opacity={a} style={{ fontFamily: F_BODY, fontWeight: 600, fontSize: 21 }}>{p.label}</text>
              <text x={X(i) + 222} y={Y(i) + 40} textAnchor="end" fill={rgba(V.bone, 0.5)} opacity={a} style={{ fontFamily: F_DISPLAY, fontSize: 30 }}>{i + 1}</text>
            </g>
          );
        })}
        {pos >= -0.05 ? (() => {
          const i0 = Math.max(0, Math.floor(pos)), fr = Math.max(0, pos - i0);
          const i1 = Math.min(N - 1, i0 + 1);
          const x = interpolate(fr, [0, 1], [X(i0), X(i1)]) + 200;
          const y = interpolate(fr, [0, 1], [Y(i0), Y(i1)]) - 40 - Math.sin(fr * Math.PI) * 40;
          return <g transform={`translate(${x} ${y})`}><Keyring size={46} /></g>;
        })() : null}
      </svg>
    </DiagramStage>
  );
};

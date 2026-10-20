// gb01 v2 · dibujo de neón para los objetos en órbita: trazos SVG en una caja de 200x200 centrada en (0,0),
// que se dibujan solos al nacer (k) y respiran después. Cada objeto del video tiene sus propios trazos.
import React from "react";
import { BlurDef, NeonPath, N, SANS, SERIF, easeOut, ramp, respira, useSvgId } from "../../kits/neon/base";

export type Trazo = { d: string; c?: string; a?: number; f?: string; dt?: number; len?: number };
export const Glifo: React.FC<{ t: number; t0: number; on: number; tam: number; trazos: Trazo[]; color?: string; dur?: number; children?: React.ReactNode }> = ({ t, t0, on, tam, trazos, color = N.cian, dur = 0.55, children }) => {
  const id = useSvgId("gl");
  const s = tam / 200;
  return (
    <svg width={tam} height={tam} viewBox="-100 -100 200 200" style={{ position: "absolute", left: -tam / 2, top: -tam / 2, overflow: "visible" }}>
      <defs><BlurDef id={id} s={3.2 / Math.max(0.6, s)} /></defs>
      <g opacity={on * respira(t, t0, 0.06)}>
        {trazos.map((tr, i) => (
          <NeonPath key={i} d={tr.d} color={tr.c ?? color} ancho={(tr.a ?? 2.4) / Math.max(0.7, s * 0.9)} fill={tr.f ?? "none"} blurId={id} k={ramp(t, t0 + (tr.dt ?? i * 0.06), dur, easeOut)} len={tr.len ?? 900} />
        ))}
        {children}
      </g>
    </svg>
  );
};

// texto de neón suelto (para etiquetas dentro de un objeto)
export const TextoNeon: React.FC<{ x?: number; y?: number; texto: string; size?: number; color?: string; on?: number; serif?: boolean }> = ({ x = 0, y = 0, texto, size = 26, color = "#fff", on = 1, serif }) => (
  <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontFamily={serif ? SERIF : SANS} fontStyle={serif ? "italic" : "normal"} fontWeight={serif ? 400 : 900}
    fontSize={size} fill={color} opacity={on} style={{ filter: `drop-shadow(0 0 6px ${color})` }}>{texto}</text>
);

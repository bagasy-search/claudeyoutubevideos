// arboles60 — línea de tiempo única. Cada cuadro = función de t. Escenas + transiciones con motivo.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { S1, S2, S3 } from "./s123";
import { S4, S5, S6, S7 } from "./s4567";
import { C, END, FPS, H, W, clamp, eio, ei, prog, lerp } from "./lib";

loadFont("normal", { weights: ["600", "700", "800", "900"], subsets: ["latin", "latin-ext"] });

// eventos sincronizados a la voz (s) — EV
export const EV = {
  s1: 0, arboles: 1.08, estrellas: 2.84, viaLactea: 4.3,
  s2: 5.4, cien: 8.7, cuatrocientos: 9.16, como: 12.14, bosque: 13.3,
  s3: 14.0, y2015: 14.46, calculaban: 18.24, empate: 23.08,
  s4: 23.9, contar: 26.94, mediciones: 28.28, arbolPorArbol: 32.92, satelitales: 35.98, clima: 37.64, suelo: 38.1, entera: 40.62,
  s5: 41.5, tresBillones: 43.48, ocho: 45.58, persona: 48.04,
  s6: 50.8, civilizacion: 54.34, mitad: 57.18, talan: 59.04,
  s7: 61.4, dependen: 65.86, cuantos: 68.06, fin: END,
};

const Circle: React.FC<{ t: number; a: number; b: number; x: number; y: number; ring?: string; children: React.ReactNode }> = ({ t, a, b, x, y, ring, children }) => {
  const k = eio(prog(t, a, b));
  if (k >= 1) return <>{children}</>;
  const r = lerp(0, 2300, k);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `circle(${r}px at ${x}px ${y}px)` }}>{children}</AbsoluteFill>
      {ring && k > 0 && (
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <circle cx={x} cy={y} r={r} fill="none" stroke={ring} strokeWidth={lerp(26, 6, k)} opacity={1 - k * 0.6} />
        </svg>
      )}
    </AbsoluteFill>
  );
};

const LeafWipe: React.FC<{ t: number; a: number; b: number; children: React.ReactNode }> = ({ t, a, b, children }) => {
  const k = prog(t, a, b);
  if (k >= 1) return <>{children}</>;
  const lx = lerp(W + 700, -900, eio(k));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${Math.max(0, lx + 260)}px)` }}>{children}</AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${lx} ${H / 2}) rotate(${lerp(-24, 18, k)}) scale(4.2)`}>
          <path d="M0 -160 C 90 -120, 120 20, 0 160 C -120 20, -90 -120, 0 -160 Z" fill={C.leaf2} />
          <path d="M0 -160 C 90 -120, 120 20, 0 160 Z" fill={C.leaf} />
          <path d="M0 -150 L0 165" stroke="#1C6B3D" strokeWidth={6} />
          {[-90, -40, 10, 60].map((y) => <path key={y} d={`M0 ${y} L60 ${y - 50} M0 ${y + 10} L-60 ${y - 40}`} stroke="#1C6B3D" strokeWidth={4} />)}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export const Full: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const fadeS6 = clamp(prog(t, 60.9, 61.4)), fadeS7 = 1 - clamp(prog(t, 61.4, 61.9));
  const tail = clamp(prog(t, 72.55, END - 0.05));
  return (
    <AbsoluteFill style={{ background: C.deep }}>
      {t < 5.8 && <AbsoluteFill><S1 t={t} /></AbsoluteFill>}
      {t >= 5.3 && t < 14.35 && <Circle t={t} a={5.3} b={5.8} x={960} y={420} ring="#FFF6D6"><S2 t={t} /></Circle>}
      {t >= 13.75 && t < 24.2 && <Circle t={t} a={13.75} b={14.3} x={478} y={790} ring={C.cyan}><S3 t={t} /></Circle>}
      {t >= 23.72 && t < 41.8 && <Circle t={t} a={23.72} b={24.15} x={960} y={540} ring={C.leaf3}><S4 t={t} /></Circle>}
      {t >= 41.2 && t < 50.8 && <LeafWipe t={t} a={41.2} b={41.8}><S5 t={t} /></LeafWipe>}
      {t >= 50.8 && t < 61.4 && <AbsoluteFill><S6 t={t} /></AbsoluteFill>}
      {t >= 60.9 && t < 61.4 && <AbsoluteFill style={{ background: C.deep, opacity: fadeS6 }} />}
      {t >= 61.4 && <AbsoluteFill><S7 t={t} /></AbsoluteFill>}
      {t >= 61.4 && t < 61.9 && <AbsoluteFill style={{ background: C.deep, opacity: fadeS7 }} />}
      {tail > 0 && <AbsoluteFill style={{ background: "#050A2A", opacity: tail }} />}
    </AbsoluteFill>
  );
};

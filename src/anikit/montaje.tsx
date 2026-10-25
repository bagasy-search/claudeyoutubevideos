// Montaje: encadena planos con transiciones INVISIBLES (pocas, como Awaken: 16 cortes en 7 min).
// Cada plano corre con su cuadro local (useF() = 0 en su corte nominal; negativo durante la entrada encimada).
//   corte    → directo (preferir cortar en el MOVIMIENTO: un gesto que empieza en un plano y termina en el otro)
//   fundido  → disolvencia de d cuadros centrada en el corte
//   cortina  → algo oscuro pasa pegado a la lente (poste, silueta, puerta) y el corte queda tapado
//   luz      → el plano se quema en blanco cálido (lámpara, sol, flash) y vuelve a abrir en el nuevo
//   barrido  → paneo rápido: el desenfoque de movimiento del Plano tapa el corte (las claves de cámara
//              de los dos planos tienen que salir/entrar con velocidad; usar `barrido()`)
import React from "react";
import { AbsoluteFill, Sequence, interpolate } from "remotion";
import { Clave, OffsetCtx } from "./camara";

export type Trans = { tipo: "corte" | "fundido" | "cortina" | "luz" | "barrido"; d?: number; color?: string; lado?: 1 | -1 };
export type PlanoM = { dur: number; el: React.ReactNode; trans?: Trans }; // trans = cómo se ENTRA a este plano

export const Montaje: React.FC<{ planos: PlanoM[] }> = ({ planos }) => {
  let t = 0;
  const cortes = planos.map((p) => { const a = t; t += p.dur; return a; });
  return (
    <AbsoluteFill>
      {planos.map((p, i) => {
        const T = cortes[i];
        const entra = p.trans ?? { tipo: "corte" };
        const sale = planos[i + 1]?.trans ?? { tipo: "corte" };
        const dIn = entra.tipo === "fundido" || entra.tipo === "luz" ? Math.ceil((entra.d ?? 12) / 2) : 0;
        const dOut = sale.tipo === "fundido" ? Math.ceil((sale.d ?? 12) / 2) : sale.tipo === "luz" ? Math.ceil((sale.d ?? 12) / 2) : 0;
        const desde = Math.max(0, T - dIn);
        const dur = p.dur + (T - desde) + dOut;
        const local = (f: number) => f + desde - T; // cuadro local en el corte nominal
        return (
          <Sequence key={i} from={desde} durationInFrames={dur} layout="none">
            <OffsetCtx.Provider value={T - desde}>
              <CapaOpacidad entra={entra} dIn={dIn} offset={T - desde}>{p.el}</CapaOpacidad>
            </OffsetCtx.Provider>
          </Sequence>
        );
      })}
      {/* sobreimpresiones de transición (por encima de todo) */}
      {planos.map((p, i) => {
        const tr = p.trans;
        if (!tr || i === 0 || (tr.tipo !== "cortina" && tr.tipo !== "luz")) return null;
        const d = tr.d ?? (tr.tipo === "cortina" ? 14 : 16);
        return (
          <Sequence key={`t${i}`} from={cortes[i] - Math.ceil(d / 2)} durationInFrames={d} layout="none">
            {tr.tipo === "cortina" ? <Cortina d={d} color={tr.color} lado={tr.lado} /> : <Destello d={d} color={tr.color} />}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

import { useCurrentFrame } from "remotion";
const CapaOpacidad: React.FC<{ entra: Trans; dIn: number; offset: number; children: React.ReactNode }> = ({ entra, dIn, children }) => {
  const f = useCurrentFrame();
  const o = entra.tipo === "fundido" && dIn > 0 ? interpolate(f, [0, dIn * 2], [0, 1], { extrapolateRight: "clamp" }) : 1;
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

// silueta oscura que barre la lente: borde suave con degradé (sin filter blur)
export const Cortina: React.FC<{ d: number; color?: string; lado?: 1 | -1 }> = ({ d, color = "#0b0a0c", lado = 1 }) => {
  const f = useCurrentFrame();
  const u = interpolate(f, [0, d], [0, 1]);
  const ease = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
  const w = 2600;
  const x = lado > 0 ? -w + ease * (1920 + w) : 1920 - ease * (1920 + w);
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="cortg" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor={color} stopOpacity={0} />
            <stop offset="0.18" stopColor={color} stopOpacity={1} />
            <stop offset="0.82" stopColor={color} stopOpacity={1} />
            <stop offset="1" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <rect x={x} y={-20} width={w} height={1120} fill="url(#cortg)" />
      </svg>
    </AbsoluteFill>
  );
};

export const Destello: React.FC<{ d: number; color?: string }> = ({ d, color = "#fff3d8" }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, d * 0.5, d], [0, 1, 0], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, #ffffff 0%, ${color} 45%, ${color} 100%)`, opacity: o }} />;
};

// claves de un barrido: el plano que sale acelera hacia `lado` en sus últimos n cuadros; el que entra llega frenando
export const barridoSalida = (ultima: Clave, fFin: number, lado: 1 | -1, n = 8, dist = 1400): Clave[] => [
  { ...ultima, f: fFin - n },
  { ...ultima, f: fFin + 2, x: ultima.x + lado * dist, curva: "in" },
];
export const barridoEntrada = (primera: Clave, lado: 1 | -1, n = 10, dist = 1400): Clave[] => [
  { ...primera, f: -2, x: primera.x - lado * dist },
  { ...primera, f: n, curva: "out" },
];

import React from "react";
import { vida, POSES } from "./poses";

// MULTITUD CON ACCIÓN CONTINUA (vuelta 8 OJO) — pieza reutilizable: gente en 2-3 filas de profundidad (más chica
// y más apagada atrás), superpuesta, cada uno con su cadena de poses (poses.tsx) y algunos que CRUZAN caminando
// ida y vuelta. Nada de filas quietas. `pinta` recibe la puesta de cada uno y devuelve el personaje del rig.
export type Puesta = { k: number; x: number; y: number; h: number; t: number; flip: boolean; camina: number; bI?: number; bD?: number; cI?: number; cD?: number; inclina?: number; ladea?: number; tono: number };

const rnd = (s: number) => () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;

export const Multitud: React.FC<{
  t: number; n?: number; y: number; h: number; filas?: number; x0?: number; x1?: number; seed?: number;
  caminan?: number; repertorio?: (keyof typeof POSES)[]; pinta: (p: Puesta) => React.ReactNode;
}> = ({ t, n = 10, y, h, filas = 2, x0 = 80, x1 = 1840, seed = 5, caminan = 0.25, repertorio, pinta }) => {
  const r = React.useMemo(() => rnd(seed * 97 + 13), [seed]);
  const gente = React.useMemo(() => Array.from({ length: n }, (_, k) => {
    const fila = k % filas; // 0 = la del fondo
    return { k, fila, x: x0 + (x1 - x0) * ((k + r() * 0.8) / n), anda: r() < caminan, vel: 70 + r() * 70, rango: 160 + r() * 260, fase: r() * 10 };
  }), [n, filas, x0, x1, caminan, r]);
  return (
    <>
      {gente.slice().sort((a, b) => a.fila - b.fila).map((g) => {
        const prof = filas === 1 ? 1 : g.fila / (filas - 1); // 0 fondo → 1 frente
        const hh = h * (0.72 + 0.28 * prof), yy = y - (1 - prof) * h * 0.16;
        let x = g.x, flip = g.k % 2 === 0, camina = 0;
        let brazos = {};
        if (g.anda) {
          // vaivén: camina un tramo, se da vuelta y vuelve (la vuelta dura 0,3 s, sin saltos de posición)
          const P = (2 * g.rango) / g.vel, u = (((t + g.fase) % P) + P) % P / P;
          const tri = u < 0.5 ? u * 2 : 2 - u * 2;
          x = g.x - g.rango / 2 + g.rango * tri;
          flip = u >= 0.5;
          camina = 1.6;
        } else brazos = vida(t, g.k * 5 + seed, repertorio);
        return <React.Fragment key={g.k}>{pinta({ k: g.k, x, y: yy, h: hh, t, flip, camina, tono: 1 - prof, ...brazos })}</React.Fragment>;
      })}
    </>
  );
};

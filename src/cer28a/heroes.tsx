// cer28 · registro de los componentes únicos (1 por minuto, ninguno repetido en el video: heroes.json del slug).
// Tapan todo mientras duran; las piezas chicas del plan que caen en su tramo se apagan (engine).
import React from "react";
import type { H } from "./hkit";
import * as G1 from "./heroes_g1";
import * as G2 from "./heroes_g2";
import * as G3 from "./heroes_g3";
import * as G4 from "./heroes_g4";

const ALL: Record<string, unknown> = { ...G1, ...G2, ...G3, ...G4 };
// clave del json = nombre del componente sin la H y en minúscula (HClock → clock)
export const HC: Record<string, React.FC<{ t: number; h: H }>> = Object.fromEntries(
  Object.entries(ALL).filter(([n, c]) => /^H[A-Z]/.test(n) && typeof c === "function").map(([n, c]) => [n.slice(1).toLowerCase(), c as React.FC<{ t: number; h: H }>]));

export const Heroes: React.FC<{ t: number; hs: H[] }> = ({ t, hs }) => <>{hs.map((h, i) => {
  const C = HC[h.k];
  return C && t > h.at - 0.1 && t < h.out + 0.9 ? <C key={"h" + i} t={t} h={h} /> : null;
})}</>;
// el componente tapa el cuadro entero (para no dibujar el mundo 3D debajo sin necesidad)
export const heroFull = (t: number, hs: H[]) => hs.some((h) => t > h.at + 0.9 && t < h.out - 0.3);

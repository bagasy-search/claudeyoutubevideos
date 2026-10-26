import React from "react";
import { interpolate, Easing } from "remotion";
import { Chico } from "./reparto";
import { Persona, MARINO, type Expr } from "./persona";

// vuelta 3 OJO: en los tramos del mundo lejano entra un personaje GRANDE en primer plano, por encima del hombro,
// que mira la escena y reacciona a la frase (el plano de cine del molde). [a, b, expr, gesto, quién]
type G = "senala" | "cabeza" | "sostiene" | "puno";
const PP: [number, number, Expr, G, ("chico" | "essex")?][] = [
  [37.9, 41.0, "sorpresa", "senala"], [45.8, 51.3, "neutro", "senala"], [56.1, 59.0, "miedo", "cabeza"],
  [63.1, 64.6, "feliz", "puno"], [66.5, 68.7, "feliz", "senala"], [139.9, 141.4, "sorpresa", "senala"],
  [159.9, 164.4, "neutro", "sostiene"], [181.0, 182.5, "sorpresa", "puno"], [255.4, 258.2, "triste", "sostiene"],
  [268.5, 277.8, "triste", "cabeza"], [331.1, 333.7, "triste", "sostiene"], [347.7, 352.2, "sorpresa", "senala"],
  [367.9, 370.1, "sorpresa", "senala"], [450.1, 452.5, "miedo", "cabeza"], [459.8, 462.5, "miedo", "puno"],
  [470.4, 476.2, "miedo", "cabeza"], [521.0, 523.4, "miedo", "cabeza"], [609.3, 611.8, "sorpresa", "senala"],
  [705.2, 707.9, "miedo", "cabeza", "essex"],
];
const GESTO: Record<G, { bD: number; cD: number; bI: number; cI: number }> = {
  senala: { bD: 95, cD: 0, bI: 20, cI: 20 },
  cabeza: { bD: 162, cD: 12, bI: 162, cI: 12 },
  sostiene: { bD: 60, cD: 110, bI: 60, cI: 110 },
  puno: { bD: 150, cD: 40, bI: 25, cI: 30 },
};

export const Primerplano: React.FC<{ t: number }> = ({ t }) => {
  const p = PP.find((k) => t >= k[0] && t < k[1]);
  if (!p) return null;
  const [a, b, expr, g, quien] = p;
  const sube = Easing.out(Easing.cubic)(interpolate(t, [a, a + 0.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const baja = interpolate(t, [b - 0.25, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = 1340 + (1 - sube) * 520 + baja * 520;
  // el gesto cambia a mitad de los tramos largos para que no quede posado
  const G2 = b - a > 4 && t > (a + b) / 2 ? GESTO[g === "senala" ? "puno" : "senala"] : GESTO[g];
  const comun = { x: 290, y, h: 1150, t, expr, mira: 1, salta: a + 0.35, ...G2 };
  return quien === "essex"
    ? <Persona {...comun} seed={63} ropa={MARINO(3)} casco="gorro" gorroCol="#2b6ad0" pantalon="#2a3a5a" />
    : <Chico {...comun} />;
};

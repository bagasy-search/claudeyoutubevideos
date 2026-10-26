import React from "react";
import { Chico } from "./reparto";
import { Persona, MARINO, type Expr } from "./persona";
import { vida, ANIMO, POSES } from "./poses";

// vuelta 3 OJO: en los tramos del mundo lejano entra un personaje GRANDE en primer plano, por encima del hombro,
// que mira la escena y reacciona a la frase (el plano de cine del molde). [a, b, expr, gesto, quién]
type G = "senala" | "cabeza" | "sostiene" | "puno";
const PP: [number, number, Expr, G, ("chico" | "essex")?][] = [
  [37.9, 41.0, "sorpresa", "senala"], [45.8, 51.3, "neutro", "senala"], [56.1, 59.0, "miedo", "cabeza"],
  [63.1, 64.6, "feliz", "puno"], [66.5, 68.7, "feliz", "senala"], [139.9, 141.4, "sorpresa", "senala"],
  [159.9, 164.4, "neutro", "sostiene"], [181.0, 182.5, "sorpresa", "puno"], [255.4, 258.2, "triste", "sostiene"],
  [268.5, 277.8, "triste", "cabeza"], [331.1, 333.7, "triste", "sostiene"], [347.7, 352.2, "sorpresa", "senala"],
  [359.2, 362.3, "feliz", "senala"], [367.9, 370.1, "sorpresa", "senala"], [450.1, 452.5, "miedo", "cabeza"], [459.8, 462.5, "miedo", "puno"],
  [470.4, 476.2, "miedo", "cabeza"], [521.0, 523.4, "miedo", "cabeza"], [609.3, 611.8, "sorpresa", "senala"],
  [705.2, 707.9, "miedo", "cabeza", "essex"],
];
const GESTO: Record<G, { bD: number; cD: number; bI: number; cI: number }> = {
  senala: { bD: 95, cD: 0, bI: 20, cI: 20 },
  cabeza: { bD: 162, cD: 12, bI: 162, cI: 12 },
  sostiene: { bD: 60, cD: 110, bI: 60, cI: 110 },
  puno: { bD: 150, cD: 40, bI: 25, cI: 30 },
};

// vuelta 4 OJO: fuera de los insertos NINGÚN plano general queda sin personaje grande. Los huecos del mundo que no
// están en PP llevan uno automático (emoción según el tramo del relato, lado y gesto alternados).
const TRAMPAS: [number, number][] = [[64.6, 66.5], [149.0, 152.6], [266.1, 268.5], [370.1, 372.1], [486.3, 488.5], [578.4, 580.5], [660.5, 662.8]];
const SIN_AUTO: [number, number][] = [[0, 2.0], [888.9, 902]];
const animo = (t: number, k: number): Expr => {
  const m: [number, Expr, Expr][] = [[130, "sorpresa", "feliz"], [290, "triste", "sorpresa"], [365, "triste", "neutro"], [560, "miedo", "sorpresa"], [660, "sorpresa", "miedo"], [800, "miedo", "triste"], [999, "triste", "sorpresa"]];
  const f = m.find((x) => t < x[0])!;
  return k % 2 ? f[2] : f[1];
};
let HUECOS: [number, number][] | null = null;
const huecos = (lista: { a: number; b: number }[]) => {
  if (HUECOS) return HUECOS;
  const ocup = [...lista.map((k) => [k.a, k.b] as [number, number]), ...TRAMPAS, ...SIN_AUTO, ...PP.map((k) => [k[0], k[1]] as [number, number])].sort((x, y) => x[0] - y[0]);
  const out: [number, number][] = [];
  let fin = 0;
  for (const [a, b] of ocup) { if (a - fin >= 1.2) out.push([fin, a]); fin = Math.max(fin, b); }
  if (902 - fin >= 1.2) out.push([fin, 902]);
  HUECOS = out;
  return out;
};

export const Primerplano: React.FC<{ t: number; lista: { a: number; b: number }[] }> = ({ t, lista }) => {
  let p = PP.find((k) => t >= k[0] && t < k[1]);
  let lado = 0;
  if (!p) {
    const hs = huecos(lista);
    const j = hs.findIndex((h) => t >= h[0] && t < h[1]);
    if (j < 0) return null;
    const [ha, hb] = hs[j];
    const gs: G[] = ["senala", "cabeza", "puno", "sostiene"];
    p = [ha, hb, animo(ha, j), gs[j % 4], ha > 662.8 && ha < 800 ? "essex" : undefined];
    lado = j % 2;
  }
  const [a, b, expr, g, quien] = p;
  // vuelta 6 OJO: subía desde abajo y el corte lo agarraba con sólo los ojos asomando → entra ya armado (corte seco),
  // más chico y más alto: cabeza y torso enteros dentro del cuadro
  const y = 1250;
  // el gesto cambia a mitad de los tramos largos para que no quede posado
  // vuelta 8 OJO: en vez de alternar 2 gestos, actúa una cadena de la biblioteca de poses según el ánimo,
  // arrancando por el gesto pedido (los planos largos ya no repiten la misma pose)
  const rep: (keyof typeof POSES)[] = [g === "sostiene" ? "cuenta" : g, ...(expr === "miedo" || expr === "sorpresa" ? ANIMO.miedo : expr === "feliz" ? ANIMO.alegre : expr === "triste" ? ANIMO.triste : ANIMO.charla)];
  const g0 = { ...GESTO[g], inclina: 0, ladea: 0 }, vv = vida(Math.max(0, t - a - 1.6), Math.round(a * 10) % 97, rep);
  const um = Math.min(1, Math.max(0, (t - a - 1.6) / 0.45)), us = um * um * (3 - 2 * um);
  const v = { bD: g0.bD + (vv.bD - g0.bD) * us, cD: g0.cD + (vv.cD - g0.cD) * us, bI: g0.bI + (vv.bI - g0.bI) * us, cI: g0.cI + (vv.cI - g0.cI) * us, inclina: (vv.inclina ?? 0) * us, ladea: (vv.ladea ?? 0) * us };
  const G2 = { bD: v.bD, cD: v.cD, bI: v.bI, cI: v.cI, inclina: v.inclina, ladea: v.ladea };
  const comun = { x: lado ? 1640 : 280, y, h: 980, t, expr, mira: lado ? -1 : 1, salta: a + 0.35, ...G2 };
  return quien === "essex"
    ? <Persona {...comun} seed={63} ropa={MARINO(3)} casco="gorro" gorroCol="#2b6ad0" pantalon="#2a3a5a" />
    : <Chico {...comun} />;
};

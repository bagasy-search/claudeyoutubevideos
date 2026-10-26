import React from "react";
import { interpolate, Easing } from "remotion";
import { Persona, GRUMETE, PIRATA, Ropa, Expr } from "./persona";
import { en } from "./dsl";

// insertos de reacción en primer plano (vara del molde: personaje grande, ~45 % del cuadro, actuando).
// Tapan los planos generales con gente diminuta y los planos de utilería sola.
type Ins = { t0: number; t1: number; der?: boolean; ropa?: Ropa; expr: Expr; seed?: number; bD?: number; bI?: number; cD?: number; habla?: boolean; salta?: boolean; ladea?: boolean };

export const INSERTOS: Ins[] = [
  { t0: 28.0, t1: 31.9, der: true, expr: "sorpresa", bD: 150, cD: 30 },
  { t0: 97.4, t1: 99.9, der: true, expr: "miedo", bD: 60, bI: 60, cD: 90, ladea: true },
  { t0: 188.3, t1: 191.5, der: true, ropa: PIRATA(2), seed: 402, expr: "dormido", bD: 150, cD: 120 },
  { t0: 227.5, t1: 231.6, der: true, ropa: PIRATA(3), seed: 403, expr: "miedo", bD: 160, cD: 10 },
  { t0: 238.0, t1: 242.0, ropa: PIRATA(4), seed: 404, expr: "miedo", bD: 150, bI: 150, cD: 20, ladea: true },
  { t0: 386.0, t1: 389.9, der: true, expr: "miedo", bD: 40, cD: 100 },
  { t0: 488.5, t1: 492.0, expr: "enojado", bD: 120, cD: 60 },
  { t0: 779.4, t1: 782.6, ropa: PIRATA(5), seed: 405, expr: "triste", bD: 20 },
  { t0: 577.4, t1: 581.2, der: true, ropa: PIRATA(1), seed: 401, expr: "sorpresa", bD: 150, cD: 20 },
  { t0: 557.0, t1: 560.4, der: true, expr: "triste", bD: 30, bI: 30, cD: 20 },
  { t0: 563.2, t1: 567.4, expr: "miedo", bD: 150, cD: 120, ladea: true },
  { t0: 697.3, t1: 701.2, der: true, ropa: PIRATA(2), seed: 406, expr: "enojado", bD: 170, cD: 20, habla: true },
];

const UNO: React.FC<{ t: number; i: Ins }> = ({ t, i }) => {
  const entra = interpolate(t, [i.t0, i.t0 + 0.28], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.6)) });
  const sale = interpolate(t, [i.t1 - 0.22, i.t1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const off = (entra + sale) * 520 * (i.der ? 1 : -1);
  const x = (i.der ? 1640 : 280) + off;
  return (
    <Persona x={x} y={1110} h={500} t={t} seed={i.seed ?? 7} ropa={i.ropa ?? GRUMETE} expr={i.expr} flip={!i.der ? false : true}
      bD={i.bD ?? 15} bI={i.bI ?? 10} cD={i.cD ?? 20} habla={i.habla}
      salta={i.salta ? Math.abs(Math.sin(t * 6)) * 14 : 0} ladea={i.ladea ? Math.sin(t * 2.2) * 6 : 0} />
  );
};

export const Insertos: React.FC<{ t: number }> = ({ t }) => (
  <>{INSERTOS.map((i, k) => (en(t, i.t0, i.t1) ? <UNO key={k} t={t} i={i} /> : null))}</>
);


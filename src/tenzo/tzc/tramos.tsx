// Tramos en SEGUNDOS ABSOLUTOS de la voz → planos del Montaje (cada plano = la frase de ese segundo).
// Los tramos tienen que ser contiguos (t1 de uno = t0 del siguiente); `planosDe` lo verifica y redondea a cuadros
// sin acumular error.
import React from "react";
import { PlanoM, Trans } from "../../anikit/montaje";

export type TramoS = { t0: number; t1: number; el: React.ReactNode; trans?: Trans };

export const planosDe = (tramos: TramoS[], fps = 30): PlanoM[] =>
  tramos.map((t, i) => {
    if (i > 0 && Math.abs(tramos[i - 1].t1 - t.t0) > 0.001) throw new Error(`tramo ${i} no es contiguo: ${tramos[i - 1].t1} → ${t.t0}`);
    const a = Math.round(t.t0 * fps), b = Math.round(t.t1 * fps);
    return { dur: b - a, el: t.el, trans: t.trans };
  });

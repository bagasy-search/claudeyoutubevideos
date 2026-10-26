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

// ---------- partir un plano largo en cortes de cámara (Ojo del Director 26-oct: nada de 15-50 s con el mismo encuadre) ----------
// `hacer(cam)` arma el MISMO plano (actores, habla, utilería con sus claves en cuadros del plano entero); cada corte lo ve
// con otra cámara desde el segundo absoluto `t`. Las claves de cámara de cada corte van en cuadros desde el inicio del corte.
import { useContext } from "react";
import { Clave, OffsetCtx } from "../../anikit/camara";
const Desde: React.FC<{ d: number; children: React.ReactNode }> = ({ d, children }) => {
  const o = useContext(OffsetCtx);
  return <OffsetCtx.Provider value={o - d}>{children}</OffsetCtx.Provider>;
};
export const partir = (t0: number, t1: number, hacer: (cam: Clave[]) => React.ReactNode, cortes: [number, Clave[]][], trans?: Trans, fps = 30): TramoS[] =>
  cortes.map(([t, cam], i) => {
    const d = Math.round((t - t0) * fps);
    return { t0: i === 0 ? t0 : t, t1: i < cortes.length - 1 ? cortes[i + 1][0] : t1, trans: i === 0 ? trans : undefined,
      el: <Desde d={d}>{hacer(cam.map((c) => ({ ...c, f: c.f + d })))}</Desde> };
  });

// lc02 · vuelta 4 (v4h, 28-oct): piezas nuevas para P61-P80.
//  · SubTomas: corte interno de una escena con fundido CORTO (6 cuadros) — la toma nueva entra sobre la vieja.
//  · TarjetasPop: las 3 reglas (CTA) que entran con resorte de escala (pop), sin fundido cruzado ni doble exposición.
//  · FilaUltima: la última fila de leña en el piso (troncos de costado de verdad), con huecos donde ya no hay.
import React from "react";
import { AbsoluteFill, spring } from "remotion";
import { F_HUD, F_MANO } from "../../anikit/pantalla";
import { F_MONO } from "../hud";
import { LenoLado } from "./v3h_v3";

export const SubTomas: React.FC<{ f: number; corte: number; antes: () => React.ReactNode; despues: () => React.ReactNode; d?: number }> = ({ f, corte, antes, despues, d = 6 }) => {
  if (f < corte) return <>{antes()}</>;
  if (f >= corte + d) return <>{despues()}</>;
  return (
    <AbsoluteFill>
      <AbsoluteFill>{antes()}</AbsoluteFill>
      <AbsoluteFill style={{ opacity: (f - corte + 1) / (d + 1) }}>{despues()}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// resorte 0 → 1 (con un rebote chico) desde el cuadro d
export const pop = (f: number, d: number, fps = 30) => (f < d ? 0 : spring({ frame: f - d, fps, config: { damping: 11, stiffness: 170, mass: 0.7 } }));

export const TarjetasPop: React.FC<{ x: number; y: number; p: number[]; marca: number; w?: number; h?: number; voto?: number; salida?: number }> = ({ x, y, p, marca, w = 300, h = 220, voto = 0, salida = 1 }) => {
  const T = [["1", "FRESH FOOD", "FIRST"], ["2", "NOTHING RISKY", "ALONE"], ["3", "ONE THING", "FOR FUN"]];
  return (
    <g opacity={salida}>
      {T.map((t, i) => {
        const a = p[i] ?? 0;
        if (a <= 0.001) return null;
        const on = marca === i;
        const cx = x + i * (w + 40), sc = 0.35 + 0.65 * a + (on ? 0.06 : 0);
        return (
          <g key={i} opacity={Math.min(1, a * 4)} transform={`translate(${cx + w / 2},${y + h / 2}) scale(${sc}) rotate(${[-3, 1.5, -1.5][i]}) translate(${-w / 2},${-h / 2})`}>
            <rect x={6} y={10} width={w} height={h} rx={10} fill="#000" opacity={0.25} />
            <rect x={0} y={0} width={w} height={h} rx={10} fill="#fbf4dc" stroke={on ? "#e2483a" : "#cfc4a4"} strokeWidth={on ? 8 : 3} />
            <rect x={w / 2 - 22} y={-14} width={44} height={26} rx={4} fill={on ? "#e2483a" : "#c0352c"} opacity={0.9} />
            <text x={30} y={88} fontFamily={F_MANO} fontWeight={700} fontSize={84} fill={on ? "#e2483a" : "#1d3a8a"}>{t[0]}</text>
            <text x={w / 2 + 22} y={110} textAnchor="middle" fontFamily={F_MANO} fontWeight={700} fontSize={34} fill="#1d3a8a">{t[1]}</text>
            <text x={w / 2 + 22} y={154} textAnchor="middle" fontFamily={F_MANO} fontWeight={700} fontSize={34} fill="#1d3a8a">{t[2]}</text>
            {voto > 0 && <g opacity={voto}><circle cx={w - 34} cy={h - 32} r={22} fill="#2f7f86" /><text x={w - 34} y={h - 22} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={26} fill="#fff">?</text></g>}
          </g>
        );
      })}
    </g>
  );
};

// la última fila de leña: tabla en el piso + leños de costado; `quedan` = cuántos se ven (de izquierda a derecha)
export const FilaUltima: React.FC<{ x: number; piso: number; quedan: number; total?: number }> = ({ x, piso, quedan, total = 4 }) => (
  <g>
    <rect x={x - 20} y={piso - 14} width={total * 150 + 40} height={14} rx={4} fill="#5a3a24" />
    <rect x={x - 20} y={piso - 6} width={total * 150 + 40} height={6} fill="#3a2416" />
    {Array.from({ length: total }).map((_, i) => i < quedan ? <g key={i} transform={`translate(${x + 70 + i * 150},${piso - 38})`}><LenoLado s={0.95} rot={[-2, 3, -1, 2][i % 4]} seed={`fu${i}`} /></g> : null)}
    {/* astillas y corteza suelta donde había leña */}
    {Array.from({ length: 9 }).map((_, i) => <rect key={`a${i}`} x={x + 20 + ((i * 97) % (total * 150))} y={piso - 18 - (i % 3) * 2} width={14 + (i % 4) * 6} height={4} rx={2} fill={i % 2 ? "#8a5a36" : "#c89a62"} transform={`rotate(${(i * 37) % 30 - 15} ${x + 20 + ((i * 97) % (total * 150))} ${piso - 16})`} />)}
  </g>
);

export const _usa = [F_HUD];

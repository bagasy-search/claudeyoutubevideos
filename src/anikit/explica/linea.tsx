// LineaTiempo: una línea que se dibuja detrás de un cursor brillante; el cursor viaja (aceleración y frenada) de
// hito en hito y se queda `paso` cuadros en cada uno; en cada hito salta una tarjeta (año grande + texto), alternando
// arriba y abajo, y las anteriores se apagan un poco. Si la línea no entra, toda la tira se desliza siguiendo al
// cursor (como una cámara). Va en el hud.
import React from "react";
import { interpolate } from "remotion";
import { F_HUD } from "../pantalla";
import { clamp, Cue, cue, easeInOut, Sombra, useReloj } from "./comun";

export type HitoLT = { año: string; texto: string; color?: string };
export type LineaTiempoProps = {
  y: number; desde: number; hasta?: number; eventos: HitoLT[];
  paso?: number; viaje?: number; espacio?: number; x0?: number; ancho?: number; acento?: string;
};

export const LineaTiempo: React.FC<LineaTiempoProps> = ({ y, desde, hasta, eventos, paso = 45, viaje = 22, espacio = 380, x0 = 240, ancho = 1440, acento = "#ffc93c" }) => {
  const { f, ent, salida } = useReloj(desde, hasta);
  if (f < 0) return null;
  const n = eventos.length;
  const tLlega = (i: number) => 16 + i * (paso + viaje); // cuadro en que el cursor llega al hito i
  // posición del cursor en índice fraccional: suma del avance de cada tramo (0..1 cada uno)
  let pos = 0;
  for (let i = 1; i < n; i++) pos += interpolate(f, [tLlega(i) - viaje, tLlega(i)], [0, 1], { ...clamp, easing: easeInOut });
  const X = (i: number) => x0 + i * espacio;
  const cx = X(pos);
  // la tira se corre cuando el cursor pasa el 60 % del ancho visible
  const lim = x0 + ancho * 0.6;
  const des = Math.max(0, cx - lim);
  const eL = interpolate(f, [0, 16], [0, 1], { ...clamp, easing: easeInOut });
  const finLinea = Math.max(cx + 60, x0 + (ancho * 0.3) * eL);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: salida }}>
      <g transform={`translate(${-des},0)`}>
        <line x1={x0 - 120} x2={X(n - 1) + 160} y1={y} y2={y} stroke="#ffffff" strokeOpacity={0.18 * eL} strokeWidth={8} strokeLinecap="round" />
        <line x1={x0 - 120} x2={Math.min(finLinea, X(n - 1) + 160)} y1={y} y2={y} stroke="#f6f1e6" strokeWidth={8} strokeLinecap="round" opacity={eL} />
        {eventos.map((ev, i) => {
          const t = tLlega(i) - (i === 0 ? 10 : 0);
          const e = ent(t, { damping: 10, stiffness: 150 });
          const ePunto = ent(t - 2, { damping: 7, stiffness: 240 });
          const arriba = i % 2 === 0;
          // las ya vistas se achican y se oscurecen (sin transparencia: sobre el fondo quedaría barroso)
          const k = i < n - 1 ? interpolate(f, [tLlega(i + 1) - viaje, tLlega(i + 1)], [0, 1], clamp) : 0;
          const c = ev.color ?? acento;
          const w = Math.max(ev.año.length * 34, Math.min(19, ev.texto.length) * 15.5) + 56;
          const hC = 132, yC = arriba ? -hC - 56 : 56;
          const sx = X(i) - des; // x en pantalla
          const fuera = interpolate(sx - w / 2, [-40, 60], [0, 1], clamp);
          if (fuera <= 0) return null;
          return (
            <g key={i} transform={`translate(${X(i)},${y})`} opacity={fuera}>
              {ePunto > 0.001 && <circle r={22 * ePunto} fill={c} stroke="#1a1410" strokeWidth={5} />}
              {e > 0.001 && (
                <g transform={`translate(0,${(1 - e) * (arriba ? 40 : -40) + k * (arriba ? 12 : -12)}) scale(${(0.6 + 0.4 * Math.min(1.1, e)) * (1 - 0.14 * k)})`} opacity={Math.min(1, e * 2)}>
                  <line x1={0} x2={0} y1={arriba ? -22 : 22} y2={arriba ? -56 : 56} stroke={c} strokeWidth={5} />
                  <Sombra dy={9} o={0.3}><rect x={-w / 2} y={yC} width={w} height={hC} rx={22} /></Sombra>
                  <rect x={-w / 2} y={yC} width={w} height={hC} rx={22} fill="#f8f3e8" />
                  <rect x={-w / 2} y={yC} width={12} height={hC} rx={6} fill={c} />
                  <text x={0} y={yC + 62} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={54} fill="#2a2420">{ev.año}</text>
                  <text x={0} y={yC + 106} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={30} fill="#2a2420" opacity={0.85}>{ev.texto}</text>
                  {k > 0.01 && <rect x={-w / 2} y={yC} width={w} height={hC} rx={22} fill="#2a2030" opacity={0.16 * k} />}
                </g>
              )}
            </g>
          );
        })}
        {/* cursor: halo que late + punto blanco, se estira apenas con la velocidad */}
        <g transform={`translate(${cx},${y})`} opacity={eL}>
          <circle r={34 + 4 * Math.sin(f / 4)} fill={acento} opacity={0.22} />
          <circle r={13} fill="#fff" />
        </g>
      </g>
    </svg>
  );
};

export const foleyLineaTiempo = (p: Pick<LineaTiempoProps, "desde" | "eventos" | "paso" | "viaje">): Cue[] => {
  const paso = p.paso ?? 45, viaje = p.viaje ?? 22;
  const c: Cue[] = [cue(p.desde, "swish", -10)];
  p.eventos.forEach((_, i) => {
    const t = p.desde + 16 + i * (paso + viaje);
    if (i > 0) c.push(cue(t - viaje, "whoosh", -10));
    c.push(cue(t, "pop", -6));
  });
  return c;
};

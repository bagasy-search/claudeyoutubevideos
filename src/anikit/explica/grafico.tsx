// Grafico: tarjeta con barras que crecen con overshoot (escalonadas, el valor rueda encima) y/o una línea que se
// dibuja con un punto brillante en la punta; la barra/punto clave va en el acento. Va en el hud.
import React from "react";
import { interpolate } from "remotion";
import { F_HUD } from "../pantalla";
import { clamp, Cue, cue, curva, easeInOut, num, Sombra, useReloj } from "./comun";

export type GraficoProps = {
  x: number; y: number; w?: number; h?: number; desde: number; hasta?: number;
  datos: { rotulo: string; v: number }[]; // barras (y rótulos del eje)
  linea?: number[]; // serie de la línea (uno por rótulo); si falta y tipo≠"barras", usa los mismos datos
  tipo?: "barras" | "linea" | "ambos";
  titulo?: string; unidad?: string; max?: number; dec?: number;
  destacar?: number; // índice de la barra / punto clave
  acento?: string; tema?: "claro" | "oscuro";
  paso?: number; // cuadros entre barra y barra
};

export const Grafico: React.FC<GraficoProps> = ({ x, y, w = 820, h = 500, desde, hasta, datos, linea, tipo = "barras", titulo, unidad = "", max, dec = 0, destacar, acento = "#ffc93c", tema = "claro", paso = 6 }) => {
  const { f, ent, suave, salida } = useReloj(desde, hasta);
  if (f < 0) return null;
  const claro = tema === "claro";
  const fondo = claro ? "#f8f3e8" : "#141a2a", tinta = claro ? "#2a2420" : "#eef2f8", suaveC = claro ? "#d9cfbd" : "#2c3550";
  const colBar = claro ? "#5f93d6" : "#4f7fd0";
  const serie = linea ?? datos.map((d) => d.v);
  const M = max ?? Math.max(...datos.map((d) => d.v), ...(tipo !== "barras" ? serie : [0])) * 1.15;
  const pad = { l: 70, r: 40, t: titulo ? 96 : 40, b: 72 };
  const W = w - pad.l - pad.r, H = h - pad.t - pad.b;
  const n = datos.length, cw = W / n, bw = Math.min(110, cw * 0.62);
  const X = (i: number) => pad.l + cw * (i + 0.5), Y = (v: number) => pad.t + H - (v / M) * H;
  const eP = ent(0, { damping: 15, stiffness: 140 });
  const t0 = 14;
  const finBarras = t0 + n * paso + 10;
  const tL = tipo === "linea" ? t0 : finBarras;
  const cl = curva(serie.map((v, i) => ({ x: X(i), y: Y(v) })), 16);
  const uL = interpolate(f, [tL, tL + 14 + n * 7], [0, 1], { ...clamp, easing: easeInOut });
  const cabeza = cl.en(uL);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: salida }}>
      <g transform={`translate(${x + w / 2},${y + h / 2}) scale(${0.85 + 0.15 * eP}) rotate(${(1 - eP) * -3}) translate(${-w / 2},${-h / 2})`} opacity={Math.min(1, eP * 1.5)}>
        <Sombra dy={12} o={0.3}><rect width={w} height={h} rx={26} /></Sombra>
        <rect width={w} height={h} rx={26} fill={fondo} />
        {titulo && <text x={pad.l - 30} y={62} fontFamily={F_HUD} fontWeight={600} fontSize={38} fill={tinta} letterSpacing={1.5}>{titulo}</text>}
        {/* grilla: 4 líneas que se dibujan de izquierda a derecha */}
        {[0.25, 0.5, 0.75, 1].map((k, i) => {
          const u = suave(4 + i * 2, 14);
          return <line key={i} x1={pad.l} x2={pad.l + W * u} y1={pad.t + H - k * H} y2={pad.t + H - k * H} stroke={suaveC} strokeWidth={2} strokeDasharray="6 8" />;
        })}
        <line x1={pad.l - 10} x2={pad.l - 10 + (W + 20) * suave(2, 14)} y1={pad.t + H} y2={pad.t + H} stroke={tinta} strokeWidth={4} strokeLinecap="round" />
        {/* barras */}
        {tipo !== "linea" && datos.map((d, i) => {
          const e = ent(t0 + i * paso, { damping: 9, stiffness: 110, mass: 0.8 });
          const v = d.v * Math.max(0, e);
          const hb = Math.max(0, (v / M) * H);
          const clave = i === destacar;
          const c = clave ? acento : colBar;
          const vis = interpolate(f, [t0 + i * paso + 4, t0 + i * paso + 10], [0, 1], clamp);
          return (
            <g key={i}>
              <rect x={X(i) - bw / 2} y={pad.t + H - hb} width={bw} height={hb} rx={12} fill={c} />
              <rect x={X(i) - bw / 2} y={pad.t + H - hb} width={bw * 0.28} height={hb} rx={10} fill="#fff" opacity={0.16} />
              {/* valor que rueda arriba de la barra */}
              <text x={X(i)} y={tipo === "ambos" ? (hb > 70 ? pad.t + H - hb + 56 : pad.t + H - hb - 40) : pad.t + H - hb - 16} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={clave ? 44 : 36} fill={tipo === "ambos" && hb > 70 ? "#ffffff" : clave ? (claro ? "#2a2420" : acento) : tinta} opacity={vis}>
                {num(d.v * Math.min(1, Math.max(0, e)), dec)}{unidad}
              </text>
            </g>
          );
        })}
        {/* línea con punto en la punta */}
        {tipo !== "barras" && uL > 0 && (
          <g>
            <path d={cl.d} fill="none" stroke={claro ? "#2a2420" : "#eef2f8"} strokeOpacity={0.18} strokeWidth={14} strokeDasharray={`${cl.largo * uL} ${cl.largo}`} strokeLinecap="round" />
            <path d={cl.d} fill="none" stroke={acento} strokeWidth={7} strokeDasharray={`${cl.largo * uL} ${cl.largo}`} strokeLinecap="round" strokeLinejoin="round" />
            {serie.map((v, i) => {
              const llega = i / Math.max(1, n - 1);
              const e = uL >= llega - 0.001 ? ent(tL + (14 + n * 7) * llega, { damping: 8, stiffness: 200 }) : 0;
              const clave = i === destacar;
              return e > 0 ? <circle key={i} cx={X(i)} cy={Y(v)} r={(clave ? 13 : 9) * e} fill={clave ? acento : fondo} stroke={acento} strokeWidth={4} /> : null;
            })}
            {uL < 1 && <><circle cx={cabeza.x} cy={cabeza.y} r={22} fill={acento} opacity={0.25} /><circle cx={cabeza.x} cy={cabeza.y} r={10} fill="#fff" /></>}
            {tipo === "linea" && serie.map((v, i) => {
              const vis = interpolate(uL, [i / Math.max(1, n - 1), i / Math.max(1, n - 1) + 0.08], [0, 1], clamp);
              return <text key={"t" + i} x={X(i)} y={Y(v) - 24} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={i === destacar ? 38 : 28} fill={i === destacar ? acento : tinta} opacity={vis}>{num(v, dec)}{unidad}</text>;
            })}
          </g>
        )}
        {/* rótulos del eje */}
        {datos.map((d, i) => (
          <text key={i} x={X(i)} y={pad.t + H + 44} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={32} fill={tinta} opacity={0.85 * suave(t0 + i * paso, 10)}>{d.rotulo}</text>
        ))}
      </g>
    </svg>
  );
};

export const foleyGrafico = (p: Pick<GraficoProps, "desde" | "datos" | "tipo" | "paso" | "destacar">): Cue[] => {
  const d = p.desde, n = p.datos.length, paso = p.paso ?? 6, t0 = 14, tipo = p.tipo ?? "barras";
  const c: Cue[] = [cue(d, "whoosh", -8)];
  if (tipo !== "linea") p.datos.forEach((_, i) => c.push(cue(d + t0 + i * paso, i === p.destacar ? "pop" : "tick", i === p.destacar ? -4 : -10)));
  const tL = tipo === "linea" ? t0 : t0 + n * paso + 10;
  if (tipo !== "barras") { c.push(cue(d + tL, "swish", -8)); c.push(cue(d + tL + 14 + n * 7, "ding", -6)); }
  else c.push(cue(d + t0 + n * paso + 6, "ding", -8));
  return c;
};

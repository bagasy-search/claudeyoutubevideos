// Medidor: velocímetro grande (semicírculo con zonas, marcas y aguja con inercia: se pasa y vuelve, y TIEMBLA cuando
// está en rojo) + número que rueda y rótulo. claves = valores en cuadros relativos a `desde`. Va en el hud.
import React from "react";
import { spring } from "remotion";
import { F_HUD } from "../pantalla";
import { Cue, cue, num, Sombra, useReloj } from "./comun";

export type MedidorProps = {
  x: number; y: number; R?: number; desde: number; hasta?: number;
  claves: { f: number; v: number }[]; min?: number; max?: number; dec?: number;
  zonas?: { hasta: number; color: string }[]; // en valores; por defecto verde / amarillo / rojo
  rotulo?: string; unidad?: string; acento?: string;
};

const arco = (R: number, a0: number, a1: number) => {
  const p = (a: number) => `${(Math.cos(a) * R).toFixed(1)},${(Math.sin(a) * R).toFixed(1)}`;
  return `M${p(a0)} A${R},${R} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${p(a1)}`;
};

export const Medidor: React.FC<MedidorProps> = ({ x, y, R = 250, desde, hasta, claves, min = 0, max = 100, dec = 0, zonas, rotulo, unidad = "", acento = "#ff4a3d" }) => {
  const { f, fps, ent, suave, salida } = useReloj(desde, hasta);
  if (f < 0) return null;
  const zs = zonas ?? [{ hasta: min + (max - min) * 0.5, color: "#5fcf7a" }, { hasta: min + (max - min) * 0.78, color: "#f5c33b" }, { hasta: max, color: "#ff4a3d" }];
  // valor de la aguja: cada cambio es un resorte poco amortiguado (se pasa y vuelve como una aguja real)
  let v = claves[0].v;
  for (let i = 1; i < claves.length; i++) {
    const k = claves[i];
    if (f < k.f) break;
    const s = spring({ frame: f - k.f, fps, config: { damping: 9, stiffness: 70, mass: 1 } });
    v = v + (k.v - v) * s;
  }
  // el número muestra el valor sin el sobrepaso (redondeado hacia el destino)
  const vNum = Math.max(min, Math.min(max, v));
  const t = (Math.max(min, Math.min(max * 1.04, v)) - min) / (max - min);
  const rojo = vNum >= zs[zs.length - 2].hasta;
  const tiembla = rojo ? Math.sin(f * 2.1) * 1.4 + Math.sin(f * 3.7) * 0.8 : 0;
  const ang = Math.PI + t * Math.PI; // de 180° (izquierda) a 360° (derecha)
  const aguja = (ang * 180) / Math.PI + tiembla;
  const e = ent(0, { damping: 14 });
  const marcas = suave(6, 20);
  const zonaAct = zs.find((z) => vNum <= z.hasta) ?? zs[zs.length - 1];
  const pulso = rojo ? 0.5 + 0.5 * Math.sin(f / 3) : 0;
  const pie = R * 0.66, rr = 28;
  const caja = `${arco(R + 40, Math.PI, 2 * Math.PI)} L${R + 40},${pie - rr} Q${R + 40},${pie} ${R + 40 - rr},${pie} L${-R - 40 + rr},${pie} Q${-R - 40},${pie} ${-R - 40},${pie - rr} Z`;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: salida }}>
      <g transform={`translate(${x},${y}) scale(${0.8 + 0.2 * e})`} opacity={Math.min(1, e * 1.5)}>
        {/* caja: semicírculo + pie con esquinas redondas donde va el número (debajo del eje, nunca sobre la escala) */}
        <Sombra dy={12} o={0.3}><path d={caja} /></Sombra>
        <path d={caja} fill="#1a1e2a" />
        {/* zonas de color */}
        {zs.map((z, i) => {
          const a0 = Math.PI + (((i ? zs[i - 1].hasta : min) - min) / (max - min)) * Math.PI;
          const a1 = Math.PI + ((z.hasta - min) / (max - min)) * Math.PI;
          const fin = a0 + (a1 - a0) * Math.min(1, Math.max(0, marcas * zs.length - i));
          return fin > a0 + 0.001 ? <path key={i} d={arco(R, a0 + 0.012, fin - 0.012)} stroke={z.color} strokeWidth={34} fill="none" opacity={z === zonaAct ? 1 : 0.62} /> : null;
        })}
        {rojo && <path d={arco(R, Math.PI + ((zs[zs.length - 2].hasta - min) / (max - min)) * Math.PI, 2 * Math.PI)} stroke={zs[zs.length - 1].color} strokeWidth={56} fill="none" opacity={0.25 * pulso} />}
        {/* marcas */}
        {Array.from({ length: 21 }).map((_, i) => {
          const a = Math.PI + (i / 20) * Math.PI, largo = i % 5 === 0 ? 30 : 16;
          return <line key={i} x1={Math.cos(a) * (R - 30)} y1={Math.sin(a) * (R - 30)} x2={Math.cos(a) * (R - 30 - largo)} y2={Math.sin(a) * (R - 30 - largo)} stroke="#eef2f8" strokeWidth={i % 5 === 0 ? 5 : 3} opacity={marcas > i / 20 ? 0.85 : 0} strokeLinecap="round" />;
        })}
        {[0, 1, 2, 3, 4].map((i) => {
          const a = Math.PI + (i / 4) * Math.PI;
          return <text key={i} x={Math.cos(a) * (R - 92)} y={Math.sin(a) * (R - 92) + 10} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={34} fill="#eef2f8" opacity={0.9 * marcas}>{num(min + ((max - min) * i) / 4)}</text>;
        })}
        {/* aguja */}
        <g transform={`rotate(${aguja})`}>
          <path d={`M-14,10 L${R - 46},3 L${R - 30},0 L${R - 46},-3 L-14,-10 Z`} fill="#000" opacity={0.3} transform="translate(0,6)" />
          <path d={`M-14,10 L${R - 46},3 L${R - 30},0 L${R - 46},-3 L-14,-10 Z`} fill={acento} />
        </g>
        <circle r={34} fill="#eef2f8" /><circle r={34} fill="none" stroke={acento} strokeWidth={6} /><circle r={12} fill="#1a1e2a" />
        {/* número + rótulo */}
        <text y={rotulo ? R * 0.4 : R * 0.48} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={R * 0.3} fill={zonaAct.color} style={{ fontVariantNumeric: "tabular-nums" }} transform={`scale(${1 + 0.05 * pulso})`}>{num(vNum, dec)}{unidad}</text>
        {rotulo && <text y={R * 0.57} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={Math.max(24, R * 0.12)} fill="#eef2f8" opacity={0.85} letterSpacing={3}>{rotulo}</text>}
      </g>
    </svg>
  );
};

export const foleyMedidor = (p: Pick<MedidorProps, "desde" | "claves" | "max" | "min" | "zonas">): Cue[] => {
  const min = p.min ?? 0, max = p.max ?? 100;
  const umbral = p.zonas ? p.zonas[p.zonas.length - 2].hasta : min + (max - min) * 0.78;
  const c: Cue[] = [cue(p.desde, "whoosh", -8)];
  p.claves.slice(1).forEach((k) => { c.push(cue(p.desde + k.f, "roll", -8)); if (k.v >= umbral) c.push(cue(p.desde + k.f + 12, "fail", -6)); });
  return c;
};

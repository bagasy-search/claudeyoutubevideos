// CausaEfecto: tarjetas-nodo unidas por flechas curvas que se DIBUJAN en orden (la punta viaja); cuando la flecha
// llega, el nodo destino salta y se enciende. Sirve para cadenas (A → B → C) y ciclos (C → A). Va en el hud.
import React from "react";
import { interpolate } from "remotion";
import { F_HUD } from "../pantalla";
import { clamp, Cue, cue, curva, easeInOut, Sombra, useReloj } from "./comun";

export type NodoCE = { texto: string; x: number; y: number; color?: string; sub?: string; icono?: React.ReactNode }; // icono: SVG centrado en (0,0), ~tam de alto, va a la izquierda del texto
export type FlechaCE = { de: number; a: number; etiqueta?: string; curva?: number }; // curva: px de comba (+/-)
export type CausaEfectoProps = {
  nodos: NodoCE[]; flechas: FlechaCE[]; desde: number; hasta?: number;
  paso?: number; tam?: number; acento?: string; tema?: "claro" | "oscuro";
};

const medida = (n: NodoCE, tam: number) => ({ hw: Math.max(n.texto.length, (n.sub ?? "").length * 0.7) * tam * 0.29 + 34 + (n.icono ? tam * 0.75 : 0), hh: tam * (n.sub ? 1.05 : 0.8) + 8 });
// punto del borde de la tarjeta en dirección (dx, dy)
const borde = (n: NodoCE, tam: number, dx: number, dy: number) => {
  const { hw, hh } = medida(n, tam);
  const k = Math.min(hw / (Math.abs(dx) || 1e-6), hh / (Math.abs(dy) || 1e-6));
  return { x: n.x + dx * k, y: n.y + dy * k };
};

export const CausaEfecto: React.FC<CausaEfectoProps> = ({ nodos, flechas, desde, hasta, paso = 30, tam = 40, acento = "#ffc93c", tema = "claro" }) => {
  const { f, ent, salida } = useReloj(desde, hasta);
  if (f < 0) return null;
  const claro = tema === "claro";
  // cuándo se enciende cada nodo: los que no son destino de nadie, al principio; el resto, cuando llega su 1ª flecha
  const tFlecha = (i: number) => 14 + i * paso;
  const dur = Math.min(20, paso - 4);
  const tNodo = nodos.map((_, i) => {
    const k = flechas.findIndex((fl) => fl.a === i);
    const fuente = flechas.findIndex((fl) => fl.de === i);
    return k >= 0 && (fuente < 0 || k < fuente) ? tFlecha(k) + dur : fuente >= 0 ? Math.max(0, tFlecha(fuente) - 12) : 0;
  });
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: salida }}>
      {flechas.map((fl, i) => {
        const A = nodos[fl.de], B = nodos[fl.a];
        const dx = B.x - A.x, dy = B.y - A.y, d = Math.hypot(dx, dy) || 1;
        const p0 = borde(A, tam, dx / d, dy / d), p1 = borde(B, tam, -dx / d, -dy / d);
        const comba = fl.curva ?? (fl.a < fl.de ? 140 : 40);
        const mx = (p0.x + p1.x) / 2 - (dy / d) * comba, my = (p0.y + p1.y) / 2 + (dx / d) * comba;
        const c = curva([p0, { x: mx, y: my }, { x: p1.x - (dx / d) * 18, y: p1.y - (dy / d) * 18 }], 20);
        const u = interpolate(f, [tFlecha(i), tFlecha(i) + dur], [0, 1], { ...clamp, easing: easeInOut });
        if (u <= 0) return null;
        const pt = c.en(u);
        return (
          <g key={i}>
            <path d={c.d} stroke={claro ? "#000" : "#000"} strokeOpacity={0.2} strokeWidth={14} fill="none" strokeDasharray={`${c.largo * u} ${c.largo + 10}`} strokeLinecap="round" transform="translate(0,6)" />
            <path d={c.d} stroke={claro ? "#2a2420" : "#eef2f8"} strokeWidth={9} fill="none" strokeDasharray={`${c.largo * u} ${c.largo + 10}`} strokeLinecap="round" />
            <g transform={`translate(${pt.x},${pt.y}) rotate(${pt.ang})`}>
              <path d="M12,0 L-30,-24 L-19,0 L-30,24 Z" fill={claro ? "#2a2420" : "#eef2f8"} strokeLinejoin="round" />
            </g>
          </g>
        );
      })}
      {/* nodos ENCIMA de las flechas; las etiquetas, encima de todo: pastilla montada en el medio de su flecha */}
      {nodos.map((n, i) => {
        const e = ent(tNodo[i], { damping: 9, stiffness: 170 });
        if (e <= 0.001) return null;
        const { hw, hh } = medida(n, tam);
        const flash = interpolate(f, [tNodo[i], tNodo[i] + 4, tNodo[i] + 20], [0, 1, 0], clamp);
        const c = n.color ?? (claro ? "#f8f3e8" : "#1d2438");
        const tx = claro && !n.color ? "#2a2420" : "#fff";
        return (
          <g key={i} transform={`translate(${n.x},${n.y}) scale(${e * (1 + 0.06 * flash)})`}>
            <Sombra dy={9} o={0.3}><rect x={-hw} y={-hh} width={hw * 2} height={hh * 2} rx={hh} /></Sombra>
            <rect x={-hw} y={-hh} width={hw * 2} height={hh * 2} rx={hh} fill={c} stroke={flash > 0.01 ? acento : claro ? "#2a2420" : "#4a5c82"} strokeWidth={4 + 6 * flash} />
            {n.icono && <g transform={`translate(${-hw + hh * 0.95},0) rotate(${-14 * flash})`}>{n.icono}</g>}
            <g transform={`translate(${n.icono ? tam * 0.75 : 0},0)`}>
            <text y={n.sub ? -4 : tam * 0.35} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={tam} fill={tx}>{n.texto}</text>
            {n.sub && <text y={tam * 0.95} textAnchor="middle" fontFamily={F_HUD} fontWeight={500} fontSize={tam * 0.75} fill={tx} opacity={0.85}>{n.sub}</text>}
            </g>
          </g>
        );
      })}
      {flechas.map((fl, i) => {
        if (!fl.etiqueta) return null;
        const eE = ent(tFlecha(i) + dur * 0.6, { damping: 12 });
        if (eE <= 0.01) return null;
        const A = nodos[fl.de], B = nodos[fl.a];
        const dx = B.x - A.x, dy = B.y - A.y, d = Math.hypot(dx, dy) || 1;
        const p0 = borde(A, tam, dx / d, dy / d), p1 = borde(B, tam, -dx / d, -dy / d);
        const comba = fl.curva ?? (fl.a < fl.de ? 140 : 40);
        // la curva pasa por este punto medio: ahí se monta la pastilla
        const mx = (p0.x + p1.x) / 2 - (dy / d) * comba, my = (p0.y + p1.y) / 2 + (dx / d) * comba;
        return (
          <g key={"e" + i} transform={`translate(${mx},${my}) scale(${eE}) rotate(${(1 - Math.min(1, eE)) * -10})`}>
            <rect x={-fl.etiqueta.length * 10 - 18} y={-24} width={fl.etiqueta.length * 20 + 36} height={48} rx={24} fill={acento} stroke={claro ? "#f8f3e8" : "#1d2438"} strokeWidth={4} />
            <text y={10} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={30} fill="#2a2420">{fl.etiqueta}</text>
          </g>
        );
      })}
    </svg>
  );
};

export const foleyCausaEfecto = (p: Pick<CausaEfectoProps, "desde" | "flechas" | "paso">): Cue[] => {
  const paso = p.paso ?? 30, dur = Math.min(20, paso - 4);
  const c: Cue[] = [cue(p.desde, "pop", -8)];
  p.flechas.forEach((_, i) => { c.push(cue(p.desde + 14 + i * paso, "swish", -9)); c.push(cue(p.desde + 14 + i * paso + dur, "pop", -6)); });
  return c;
};

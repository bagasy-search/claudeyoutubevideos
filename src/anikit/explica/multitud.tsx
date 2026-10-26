// Multitud: la escala con gente. Modo "alejar": arranca con UNA persona grande (la del tema, en el acento) y la
// cámara se aleja hasta mostrar a las N (1 contra 1.000). Modo "ola": aparecen todas en una ola desde la destacada.
// `marcados`: una parte cambia de color en otra ola («1 de cada 10»). Pictogramas baratos (2 figuras cada uno)
// y todo determinístico. Va en el hud.
import React from "react";
import { interpolate } from "remotion";
import { F_HUD } from "../pantalla";
import { clamp, Cue, cue, easeInOut, num, useReloj } from "./comun";

export type MultitudProps = {
  x: number; y: number; w?: number; h?: number; desde: number; hasta?: number;
  n?: number; cols?: number; destacado?: number; modo?: "alejar" | "ola";
  color?: string; acento?: string; rotulo?: string; // etiqueta de la destacada («YOU»)
  contador?: string; // texto del contador abajo («PEOPLE»): rueda con las que se ven
  marcados?: { cada: number; color: string; desde: number; etiqueta?: string }; // desde relativo
  dur?: number; // cuadros del alejamiento / de la ola
};

// hash entero → 0..1 (elige marcados y varía apenas el tamaño, igual en cada chunk)
const h01 = (i: number) => { let x = Math.imul(i ^ 0x9e3779b9, 0x85ebca6b); x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35); x ^= x >>> 16; return (x >>> 0) / 4294967296; };

const Figura: React.FC<{ x: number; y: number; s: number; c: string }> = ({ x, y, s, c }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <circle cx={0} cy={-30} r={11} fill={c} />
    <path d="M-15,18 L-15,-6 Q-15,-17 0,-17 Q15,-17 15,-6 L15,18 Z" fill={c} />
  </g>
);

export const Multitud: React.FC<MultitudProps> = ({ x, y, w = 1500, h = 640, desde, hasta, n = 1000, cols, destacado, modo = "alejar", color = "#d9d2c4", acento = "#ffc93c", rotulo, contador, marcados, dur = 90 }) => {
  const { f, ent, salida } = useReloj(desde, hasta);
  if (f < 0) return null;
  // columnas para que cada celda tenga la proporción de la figura (36 x 56): grilla pareja, no «cortinas»
  const C = cols ?? Math.max(1, Math.round(Math.sqrt((n * w * 56) / (h * 36))));
  const F = Math.ceil(n / C);
  const cw = w / C, ch = h / F;
  const s = Math.min(cw / 36, ch / 56) * 0.82;
  const D = destacado ?? Math.floor(F / 2) * C + Math.floor(C / 2);
  const resto = n % C, ultima = Math.floor((n - 1) / C);
  // la última fila, si queda incompleta, va centrada
  const pos = (i: number) => ({ x: -w / 2 + cw * ((i % C) + 0.5) + (resto && Math.floor(i / C) === ultima ? (cw * (C - resto)) / 2 : 0), y: -h / 2 + ch * (Math.floor(i / C) + 0.5) + 28 * s });
  const pd = pos(D);
  // alejar: zoom logarítmico de Z (la destacada llena el cuadro) a 1, centrado en ella y viajando al centro
  const Z = Math.min(14, 300 / (56 * s));
  const u = modo === "alejar" ? interpolate(f, [14, 14 + dur], [0, 1], { ...clamp, easing: easeInOut }) : 1;
  const z = Math.exp(Math.log(Z) * (1 - u));
  const ox = -pd.x * (1 - u), oy = -pd.y * (1 - u);
  const radioMax = Math.hypot(w, h) / 2;
  const visibles = modo === "ola" ? n * interpolate(f, [8, 8 + dur], [0, 1], clamp) : n * Math.min(1, (u * 1.15) ** 2);
  let enCuadro = 1; // alejar: el contador cuenta las que de verdad se ven (no un número que no coincide con la imagen)
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: salida }}>
      {/* placa oscura detrás: la multitud se lee como gráfico y no se mezcla con el set */}
      {(() => {
        const k = ent(0, { damping: 16 });
        const pw = (w + 80) * (0.3 + 0.7 * k), ph = (h + 200) * (0.3 + 0.7 * k);
        return k > 0.01 ? <rect x={x - pw / 2} y={y - (h + 80) / 2 * (0.3 + 0.7 * k)} width={pw} height={ph} rx={36} fill="#0e0c14" opacity={0.86 * Math.min(1, k * 1.4)} /> : null;
      })()}
      {/* la gente queda DENTRO de la placa: en el alejamiento no tapa todo el cuadro */}
      <defs><clipPath id={`mt${desde}`}><rect x={x - (w + 80) / 2} y={y - (h + 80) / 2} width={w + 80} height={h + 200} rx={36} /></clipPath></defs>
      <g clipPath={`url(#mt${desde})`}>
      <g transform={`translate(${x},${y}) scale(${z}) translate(${ox},${oy})`}>
        {Array.from({ length: n }).map((_, i) => {
          if (i === D) return null;
          const p = pos(i);
          const dist = Math.hypot(p.x - pd.x, p.y - pd.y) / radioMax;
          // ola: cada una aparece cuando la ola (que sale de la destacada) pasa por ella
          // alejar: cada una aparece cuando el alejamiento llega a su distancia (1 → unas pocas → todas)
          const tA = modo === "ola" ? 8 + dist * dur : 0;
          const e = modo === "ola" ? interpolate(f, [tA, tA + 8], [0, 1], clamp) : interpolate(u * 1.25 - dist, [0, 0.08], [0, 1], clamp);
          if (e <= 0) return null;
          let c = color;
          if (marcados && h01(i) < 1 / marcados.cada) {
            const tm = marcados.desde + dist * 40;
            if (f >= tm) c = marcados.color;
          }
          const k = 0.92 + h01(i + 7) * 0.16;
          // borde suave: la que cruza el borde de la placa se desvanece entera (nada cortado al ras)
          const sx = x + (p.x + ox) * z, sy = y + (p.y + oy) * z, sz = s * z;
          const abajo = contador ? y + h / 2 + 30 : y + (h + 80) / 2; // el contador tapa el borde de abajo: se desvanecen antes
          // fundido corto (16 px) contra el borde: en la grilla final (u = 1) todas quedan enteras y a pleno
          const bd = (d: number) => interpolate(d, [0, 16], [0, 1], clamp);
          const borde = Math.min(bd(sy - 44 * sz - (y - (h + 80) / 2)), bd(abajo - (sy + 20 * sz)), bd(sx - 18 * sz - (x - (w + 80) / 2)), bd(x + (w + 80) / 2 - (sx + 18 * sz)));
          if (borde <= 0) return null;
          if (e > 0.5 && borde > 0.5) enCuadro++;
          // las vecinas que caen bajo el anillo se apartan (se desvanecen): el aro rodea sólo a la destacada
          const rA = Math.max(44 * s, 90 / z) * 1.12 + 16 * s, dA = Math.hypot(p.x - pd.x, p.y - 12 * s - (pd.y - 12 * s));
          const libre = interpolate(dA, [rA - 10 * s, rA + 8 * s], [0, 1], clamp);
          if (libre <= 0) return null;
          return <g key={i} opacity={borde * libre}><Figura x={p.x} y={p.y + (1 - e) * 10} s={s * k * (0.6 + 0.4 * e)} c={c} /></g>;
        })}
        {/* la destacada: más clara, con anillo */}
        <g>
          <circle cx={pd.x} cy={pd.y - 12 * s} r={Math.max(44 * s, 90 / z) * (1 + 0.12 * Math.sin(f / 4))} fill="none" stroke={acento} strokeWidth={Math.max(4 * s / Math.max(1, z / 3), 10 / z)} opacity={0.95} />
          <Figura x={pd.x} y={pd.y} s={s * (1.05 + 0.45 * u)} c={acento} />
        </g>
      </g>
      </g>
      {/* rótulo de la destacada: en pantalla, sigue su posición */}
      {rotulo && (() => {
        const sx = x + (pd.x + ox) * z, sy = y + (pd.y + oy) * z - 44 * s * z - 34;
        const e = ent(4, { damping: 12 });
        return (
          <g transform={`translate(${sx},${Math.max(y - (h + 80) / 2 + 70, sy)}) scale(${e})`}>
            <rect x={-rotulo.length * 13 - 22} y={-36} width={rotulo.length * 26 + 44} height={56} rx={28} fill={acento} />
            <text y={4} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={36} fill="#2a2420">{rotulo}</text>
          </g>
        );
      })()}
      {contador && (
        <g transform={`translate(${x},${y + h / 2 + 90})`} opacity={modo === "alejar" ? interpolate(u, [0.05, 0.2], [0, 1], clamp) : interpolate(f, [10, 22], [0, 1], clamp)}>
          <rect x={-330} y={-58} width={660} height={84} rx={42} fill="#0e0c14" />
          <text textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={58} fill="#f6f1e6" stroke="#000" strokeOpacity={0.4} strokeWidth={8} paintOrder="stroke">
            <tspan fill={acento}>1</tspan> vs <tspan>{num(modo === "alejar" ? (u >= 1 ? n : Math.min(n, enCuadro)) : Math.max(1, visibles))}</tspan> {contador}
          </text>
          {marcados?.etiqueta && f >= marcados.desde + 10 && (
            <text y={64} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={40} fill={marcados.color} stroke="#000" strokeOpacity={0.4} strokeWidth={7} paintOrder="stroke" opacity={interpolate(f, [marcados.desde + 10, marcados.desde + 22], [0, 1], clamp)}>{marcados.etiqueta}</text>
          )}
        </g>
      )}
    </svg>
  );
};

export const foleyMultitud = (p: Pick<MultitudProps, "desde" | "modo" | "dur" | "marcados">): Cue[] => {
  const dur = p.dur ?? 90;
  const c: Cue[] = p.modo === "ola" ? [cue(p.desde + 8, "popcluster", -6)] : [cue(p.desde, "pop", -6), cue(p.desde + 14, "whoosh_big", -6), cue(p.desde + 14 + dur * 0.6, "popcluster", -10)];
  if (p.marcados) c.push(cue(p.desde + p.marcados.desde, "glitter", -8));
  return c;
};

// Lupa: una lupa entra desde abajo-derecha, recorre la `ruta` (frena en cada punto, se inclina con la velocidad) y
// adentro del vidrio se ve el MISMO dibujo aumentado (children se dibuja dos veces: normal y con zoom recortado al
// vidrio). En cada parada puede saltar una nota. children = SVG en coordenadas de pantalla. Va en el hud.
import React from "react";
import { interpolate } from "remotion";
import { F_HUD } from "../pantalla";
import { clamp, Cue, cue, easeInOut, useReloj } from "./comun";

export type LupaProps = {
  children: React.ReactNode; desde: number; hasta?: number;
  ruta: { f: number; x: number; y: number; nota?: string }[]; // f relativos a `desde`
  aumento?: number; r?: number; acento?: string;
  notaX?: number; // si va, las notas salen en esa x (columna fija al costado) con una línea guía a la lente
  mango?: number; // ángulo del mango en grados (45 = abajo-derecha); giralo hacia donde no hay texto
  velo?: { x: number; y: number; w: number; h: number; rx?: number; color?: string }; // papel tenue sobre el dibujo mientras la lupa trabaja: lo de afuera del vidrio pasa a segundo plano
  banda?: number; // si va, el vidrio aumenta sólo una franja horizontal de ese alto (px de pantalla, sin aumentar): se lee UNA línea, no pedazos de las vecinas
};

// la lente se queda QUIETA en cada parada y viaja sólo en los últimos cuadros antes de la siguiente
export const viajeLupa = (a: number, b: number) => Math.min(26, (b - a) * 0.55);
const posEn = (ruta: LupaProps["ruta"], f: number) => {
  if (f <= ruta[0].f) return { x: ruta[0].x, y: ruta[0].y };
  for (let i = 1; i < ruta.length; i++) {
    const a = ruta[i - 1], b = ruta[i];
    if (f < b.f) {
      const u = interpolate(f, [b.f - viajeLupa(a.f, b.f), b.f], [0, 1], { ...clamp, easing: easeInOut });
      return { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u };
    }
  }
  const z = ruta[ruta.length - 1];
  return { x: z.x, y: z.y };
};

export const Lupa: React.FC<LupaProps> = ({ children, desde, hasta, ruta, aumento = 2.4, r = 150, acento = "#ffc93c", notaX, banda, mango = 45, velo }) => {
  const { f, ent, salida } = useReloj(desde, hasta);
  if (f < 0) return null;
  // entrada: viene de abajo a la derecha hasta el primer punto
  const eIn = ent(0, { damping: 14, stiffness: 80 });
  const p = posEn(ruta, f);
  const q = posEn(ruta, f - 2);
  const cx = p.x + (1 - eIn) * 700, cy = p.y + (1 - eIn) * 500;
  const inclina = Math.max(-14, Math.min(14, (p.x - q.x) * 0.9)) + (1 - eIn) * 25;
  const id = `lupa${desde}`;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: salida }}>
      {children}
      {velo && <rect x={velo.x} y={velo.y} width={velo.w} height={velo.h} rx={velo.rx ?? 0} fill={velo.color ?? "#f8f3e8"} opacity={0.62 * Math.min(1, eIn * 1.2)} />}
      <defs><clipPath id={id}><circle cx={cx} cy={cy} r={r - 6} /></clipPath>{banda && <clipPath id={`${id}b`}><rect x={cx - r} y={cy - banda / 2} width={r * 2} height={banda} /></clipPath>}</defs>
      {/* sombra de la lupa sobre el papel */}
      <circle cx={cx + 22} cy={cy + 30} r={r} fill="#000" opacity={0.18} />
      <g clipPath={`url(#${id})`}>
        <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} fill="#fbf7ee" />
        <g transform={`translate(${cx},${cy}) scale(${aumento}) translate(${-cx},${-cy})`}><g clipPath={banda ? `url(#${id}b)` : undefined}>{children}</g></g>
        {/* con banda: arriba y abajo de la franja el vidrio queda en papel liso, con una regla tenue que la enmarca */}
        {banda && [-1, 1].map((sd) => <rect key={sd} x={cx - r} y={cy + sd * (banda * aumento) / 2 - 2} width={r * 2} height={4} fill={acento} opacity={0.5} />)}
        {/* vidrio: tinte celeste y reflejo curvo */}
        <circle cx={cx} cy={cy} r={r} fill="#bfe6ff" opacity={0.1} />
        <path d={`M${cx - r * 0.62},${cy - r * 0.28} A${r * 0.68},${r * 0.68} 0 0 1 ${cx - r * 0.1},${cy - r * 0.7}`} stroke="#fff" strokeWidth={14} strokeLinecap="round" fill="none" opacity={0.55} />
      </g>
      {/* aro y mango, inclinados con la velocidad */}
      <g transform={`rotate(${inclina} ${cx} ${cy})`}>
        <g transform={`translate(${cx},${cy}) rotate(${mango})`}>
          <rect x={r - 4} y={-17} width={46} height={34} rx={6} fill="#3a3a40" />
          <rect x={r + 38} y={-24} width={150} height={48} rx={22} fill="#7a3e22" />
          <rect x={r + 46} y={-18} width={134} height={12} rx={6} fill="#a55a34" />
        </g>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#2a2420" strokeWidth={22} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#5a5a62" strokeWidth={10} />
        <path d={`M${cx - r * 0.7},${cy - r * 0.7} A${r},${r} 0 0 1 ${cx + r * 0.2},${cy - r * 0.98}`} stroke="#c8c8d0" strokeWidth={5} fill="none" strokeLinecap="round" />
      </g>
      {/* notas de cada parada */}
      {ruta.map((pt, i) => {
        if (!pt.nota) return null;
        const fin = ruta[i + 1] ? ruta[i + 1].f - viajeLupa(pt.f, ruta[i + 1].f) + 6 : 1e9; // se va cuando la lente arranca
        const e = ent(pt.f + 4, { damping: 11 });
        const o = interpolate(f, [fin - 8, fin], [1, 0], clamp);
        if (e <= 0.001 || o <= 0) return null;
        const nx = notaX ?? pt.x + (pt.x > 960 ? -r - 40 : r + 40), alinear = notaX !== undefined ? "start" : pt.x > 960 ? "end" : "start";
        const w = pt.nota.length * 17 + 44, ny = notaX !== undefined ? pt.y : pt.y - r - 20;
        return (
          <g key={i} opacity={o}>
          {notaX !== undefined && <path d={`M${pt.x + r + 8},${pt.y} L${nx - 6},${ny - 7}`} stroke={acento} strokeWidth={5} strokeLinecap="round" opacity={Math.min(1, e)} />}
          <g transform={`translate(${nx},${ny}) scale(${e})`}>
            <rect x={alinear === "end" ? -w : 0} y={-34} width={w} height={54} rx={27} fill={acento} />
            <text x={alinear === "end" ? -w / 2 : w / 2} y={3} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={30} fill="#2a2420">{pt.nota}</text>
          </g>
          </g>
        );
      })}
    </svg>
  );
};

export const foleyLupa = (p: Pick<LupaProps, "desde" | "ruta">): Cue[] => {
  const c: Cue[] = [cue(p.desde, "whoosh", -8)];
  p.ruta.slice(1).forEach((pt, i) => c.push(cue(p.desde + pt.f - viajeLupa(p.ruta[i].f, pt.f), "swish", -12)));
  p.ruta.forEach((pt) => pt.nota && c.push(cue(p.desde + pt.f + 4, "pop", -6)));
  return c;
};

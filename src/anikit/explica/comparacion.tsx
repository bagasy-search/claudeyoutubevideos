// Comparacion: dos tarjetas lado a lado que entran desde los costados (con inclinación que se endereza) y un sello
// «VS» que golpea en el medio; o modo "cortina": un solo cuadro ANTES/DESPUÉS con un divisor que barre y revela.
// El contenido de cada lado es un dato grande o cualquier dibujo SVG (coordenadas locales de la tarjeta). Va en el hud.
import React from "react";
import { interpolate } from "remotion";
import { F_HUD } from "../pantalla";
import { clamp, Cue, cue, easeInOut, Sombra, useReloj } from "./comun";

export type LadoComp = { titulo: string; color?: string; dato?: string; sub?: string; contenido?: React.ReactNode };
export type ComparacionProps = {
  x: number; y: number; desde: number; hasta?: number; izq: LadoComp; der: LadoComp;
  modo?: "lado" | "cortina"; w?: number; h?: number; acento?: string; vs?: string;
  barrido?: number; // modo cortina: cuadros que tarda el divisor (y cuándo arranca: 24)
};

// colores claros (amarillo, crema) no se leen sobre la tarjeta crema: el número va oscuro y el color queda en la franja
const claro = (c: string) => { const m = /^#([0-9a-f]{6})$/i.exec(c); if (!m) return false; const n = parseInt(m[1], 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255 > 0.68; };

// cx = centro del texto y del dibujo (en cortina cada lado ocupa su mitad de la tarjeta ancha)
const Tarjeta: React.FC<{ l: LadoComp; w: number; h: number; colorDef: string; cx?: number; anchoC?: number; vis?: number }> = ({ l, w, h, colorDef, cx = w / 2, anchoC = w, vis = 1 }) => {
  const c = l.color ?? colorDef;
  const cDato = claro(c) ? "#2a2420" : c;
  return (
    <g>
      <Sombra dy={12} o={0.3}><rect width={w} height={h} rx={26} /></Sombra>
      <rect width={w} height={h} rx={26} fill="#f8f3e8" />
      <path d={`M0,26 Q0,0 26,0 L${w - 26},0 Q${w},0 ${w},26 L${w},84 L0,84 Z`} fill={c} />
      <g opacity={vis}>
      <text x={cx} y={58} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={40} fill={claro(c) ? "#2a2420" : "#fff"} letterSpacing={3}>{l.titulo}</text>
      <g transform={`translate(${cx - anchoC / 2},84)`}>{l.contenido}</g>
      {l.dato && <text x={cx} y={l.contenido ? h - 74 : h / 2 + 70} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={l.contenido ? 64 : 120} fill={cDato}>{l.dato}</text>}
      {l.sub && <text x={cx} y={l.contenido ? h - 28 : h / 2 + 130} textAnchor="middle" fontFamily={F_HUD} fontWeight={500} fontSize={36} fill="#2a2420" opacity={0.8}>{l.sub}</text>}
      </g>
    </g>
  );
};

export const Comparacion: React.FC<ComparacionProps> = ({ x, y, desde, hasta, izq, der, modo = "lado", w = 560, h = 560, acento = "#ffc93c", vs = "VS", barrido = 50 }) => {
  const { f, ent, salida } = useReloj(desde, hasta);
  if (f < 0) return null;
  if (modo === "cortina") {
    const W = w * 2;
    const e = ent(0, { damping: 15 });
    // arranca mostrando sólo el ANTES (todo el ancho); el divisor barre hacia la izquierda revelando el DESPUÉS,
    // se pasa un poco y vuelve a la mitad (el «toque humano» del arrastre).
    // El texto y el dibujo de cada lado se centran en la parte que se ve: se corren con el divisor
    const u = interpolate(f, [24, 24 + barrido], [1, 0.4], { ...clamp, easing: easeInOut });
    const vuelta = interpolate(f, [24 + barrido, 24 + barrido + 22], [0, 1], { ...clamp, easing: easeInOut });
    const corte = (u * (1 - vuelta) + 0.5 * vuelta) * W;
    const id = `cmp${desde}`;
    return (
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: salida }}>
        <g transform={`translate(${x},${y}) scale(${0.88 + 0.12 * e}) translate(${-W / 2},${-h / 2})`} opacity={Math.min(1, e * 1.5)}>
          <defs>
            <clipPath id={id + "a"}><rect x={0} y={-10} width={corte} height={h + 20} /></clipPath>
            <clipPath id={id + "d"}><rect x={corte} y={-10} width={W - corte} height={h + 20} /></clipPath>
          </defs>
          <g clipPath={`url(#${id}a)`}><Tarjeta l={izq} w={W} h={h} colorDef="#8a7a72" cx={corte / 2} anchoC={w} vis={interpolate(corte, [w * 0.45, w * 0.8], [0, 1], clamp)} /></g>
          <g clipPath={`url(#${id}d)`}><Tarjeta l={der} w={W} h={h} colorDef={acento} cx={(corte + W) / 2} anchoC={w} vis={interpolate(W - corte, [w * 0.45, w * 0.8], [0, 1], clamp)} /></g>
          {/* divisor con manija */}
          <line x1={corte} x2={corte} y1={-14} y2={h + 14} stroke="#fff" strokeWidth={8} />
          <circle cx={corte} cy={h / 2} r={36} fill="#fff" stroke="#2a2420" strokeWidth={4} />
          <path d={`M${corte - 12},${h / 2 - 12} l-12,12 l12,12 M${corte + 12},${h / 2 - 12} l12,12 l-12,12`} stroke="#2a2420" strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    );
  }
  const gap = 120;
  const eI = ent(0, { damping: 13, stiffness: 110 }), eD = ent(8, { damping: 13, stiffness: 110 });
  const eV = ent(22, { damping: 7, stiffness: 260 });
  const sacude = f >= 22 && f < 34 ? Math.sin((f - 22) * 2.6) * Math.exp(-(f - 22) / 3) * 8 : 0;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: salida }}>
      <g transform={`translate(${x + sacude},${y})`}>
        <g transform={`translate(${-gap / 2 - w + (eI - 1) * 900},${-h / 2}) rotate(${(1 - eI) * -8} ${w / 2} ${h})`}><Tarjeta l={izq} w={w} h={h} colorDef="#8a7a72" /></g>
        <g transform={`translate(${gap / 2 + (1 - eD) * 900},${-h / 2}) rotate(${(1 - eD) * 8} ${w / 2} ${h})`}><Tarjeta l={der} w={w} h={h} colorDef={acento} /></g>
        {eV > 0.01 && (
          <g transform={`scale(${eV}) rotate(${(1 - eV) * 40 - 6})`}>
            <circle r={78} fill="#000" opacity={0.25} cy={8} />
            <circle r={78} fill="#2a2420" stroke={acento} strokeWidth={7} />
            <text y={22} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={62} fill={acento}>{vs}</text>
          </g>
        )}
      </g>
    </svg>
  );
};

export const foleyComparacion = (p: Pick<ComparacionProps, "desde" | "modo" | "barrido">): Cue[] =>
  p.modo === "cortina"
    ? [cue(p.desde, "whoosh", -8), cue(p.desde + 24, "swish", -6), cue(p.desde + 24 + (p.barrido ?? 50), "click", -6)]
    : [cue(p.desde, "whoosh", -6), cue(p.desde + 8, "whoosh", -8), cue(p.desde + 22, "slam", -4)];

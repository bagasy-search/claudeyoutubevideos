// Personaje cabezón (cabeza redonda blanca, cuerpo fino, tinta negra) — 100% SVG.
// Origen = pies. Altura ~330 u a escala 1.
import React from "react";
import { useCurrentFrame } from "remotion";

export const TINTA = "#1d1714";

export type Pelo = { tipo: "gorro" | "melena" | "rodete" | "gorra" | "rulos"; color: string; color2?: string };
export type Expr = "neutral" | "picaro" | "sorpresa" | "enojado" | "feliz" | "nervioso";
export type Brazos = "abajo" | "cruzados" | "gesto" | "saludo" | "volante" | "manos";

export type PersonajeProps = {
  x: number; y: number; s?: number;
  pelo: Pelo; campera: string; remera?: string;
  habla?: boolean; expr?: Expr; mira?: number; giro?: number;
  camina?: boolean; brazos?: Brazos; auriculares?: boolean; seed?: number;
  sinPiernas?: boolean;
};

// ruido barato y determinista
const n1 = (t: number, seed: number) =>
  Math.sin(t * 0.9 + seed) * 0.5 + Math.sin(t * 2.3 + seed * 1.7) * 0.3 + Math.sin(t * 5.1 + seed * 0.3) * 0.2;

export const Personaje: React.FC<PersonajeProps> = ({
  x, y, s = 1, pelo, campera, remera = "#f4f1ea", habla = false, expr = "neutral",
  mira = 0, giro = 0, camina = false, brazos = "abajo", auriculares = false, seed = 1, sinPiernas = false,
}) => {
  const f = useCurrentFrame();
  const fase = f * 0.32;
  const paso = camina ? Math.sin(fase) : 0;
  const rebote = camina ? -Math.abs(Math.sin(fase)) * 6 : Math.sin(f / 22 + seed) * 1.6;
  // parpadeo
  const ciclo = (f + seed * 37) % 97;
  const parp = ciclo < 4 ? [0.5, 0.1, 0.1, 0.6][ciclo] : 1;
  // boca: aleatoria con ritmo de sílabas
  const ab = habla ? Math.max(0, n1(f * 0.9, seed) * 0.8 + 0.45 + Math.sin(f * 1.7 + seed) * 0.35) : 0;
  const HY = -292 + rebote, R = 58;
  const ex = mira * 9, ey = 0;
  const lw = 4.2;
  const torsoY = -236 + rebote;

  // brazos (hombro → codo → mano)
  const hom = { l: { x: -30, y: torsoY + 16 }, r: { x: 30, y: torsoY + 16 } };
  const gest = Math.sin(f / 7 + seed) * 0.5 + 0.5;
  let brazo = (lado: 1 | -1): string => {
    const h = lado === 1 ? hom.r : hom.l;
    const sw = camina ? -paso * lado * 18 : Math.sin(f / 25 + seed) * 2;
    if (brazos === "cruzados") return `M${h.x},${h.y} Q${lado * 40},${h.y + 50} ${-lado * 18},${h.y + 52}`;
    if (brazos === "volante") return `M${h.x},${h.y} Q${lado * 44},${h.y + 50} ${lado * 34},${h.y + 82}`;
    if (brazos === "manos") return `M${h.x},${h.y} Q${lado * 40},${h.y + 70} ${lado * 8},${h.y + 78}`;
    if (brazos === "saludo" && lado === 1) {
      const w = Math.sin(f / 3.2) * 14;
      return `M${h.x},${h.y} Q${70},${h.y - 10} ${78 + w},${h.y - 70}`;
    }
    if (brazos === "gesto" && lado === 1) {
      const up = 30 + gest * 26;
      return `M${h.x},${h.y} Q${62},${h.y + 46} ${72 + gest * 10},${h.y + 30 - up}`;
    }
    return `M${h.x},${h.y} Q${lado * 40 + sw * 0.4},${h.y + 55} ${lado * 34 + sw},${h.y + 110}`;
  };
  const manoPos = (d: string) => { const p = d.split(" ").pop()!.split(","); return { x: +p[0], y: +p[1] }; };

  // boca según expresión
  const boca = () => {
    const my = HY + 30;
    if (ab > 0.08) {
      const ry = 3 + ab * 13, rx = 12 + ab * 3;
      return (
        <g>
          <ellipse cx={ex * 0.5} cy={my + ry * 0.3} rx={rx} ry={ry} fill="#5a1c1c" stroke={TINTA} strokeWidth={3.4} />
          <ellipse cx={ex * 0.5} cy={my + ry * 0.3 + ry * 0.55} rx={rx * 0.55} ry={ry * 0.35} fill="#c95b5b" />
          {expr === "enojado" && <rect x={ex * 0.5 - rx * 0.7} y={my + ry * 0.3 - ry + 2} width={rx * 1.4} height={Math.min(5, ry)} fill="#fff" />}
        </g>
      );
    }
    const c = ex * 0.5;
    switch (expr) {
      case "picaro": return <path d={`M${c - 22},${my - 4} Q${c},${my + 10} ${c + 24},${my - 12}`} fill="none" stroke={TINTA} strokeWidth={3.6} strokeLinecap="round" />;
      case "feliz": return <path d={`M${c - 18},${my - 4} Q${c},${my + 16} ${c + 18},${my - 4} Z`} fill="#5a1c1c" stroke={TINTA} strokeWidth={3.4} strokeLinejoin="round" />;
      case "sorpresa": return <ellipse cx={c} cy={my + 2} rx={8} ry={10} fill="#5a1c1c" stroke={TINTA} strokeWidth={3.4} />;
      case "enojado": return <path d={`M${c - 16},${my + 4} Q${c},${my - 6} ${c + 16},${my + 4}`} fill="none" stroke={TINTA} strokeWidth={3.6} strokeLinecap="round" />;
      case "nervioso": return <path d={`M${c - 16},${my} l6,-4 l6,4 l6,-4 l6,4 l6,-4`} fill="none" stroke={TINTA} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" />;
      default: return <path d={`M${c - 13},${my} Q${c},${my + 3} ${c + 13},${my - 1}`} fill="none" stroke={TINTA} strokeWidth={3.6} strokeLinecap="round" />;
    }
  };

  const ceja = (lado: 1 | -1) => {
    const cx = lado * 20 + ex, cy = HY - 20;
    const inc = expr === "enojado" ? -lado * 7 : expr === "picaro" ? (lado === 1 ? 6 : -9) : expr === "sorpresa" ? 0 : expr === "nervioso" ? lado * 5 : 0;
    const up = expr === "sorpresa" ? -8 : 0;
    return <path d={`M${cx - 10},${cy + up - inc * -1 * (lado === 1 ? 1 : -1) * 0} L${cx + 10},${cy + up}`} transform={`rotate(${inc} ${cx} ${cy})`} stroke={TINTA} strokeWidth={3.6} strokeLinecap="round" />;
  };

  const ojo = (lado: 1 | -1) => {
    const cx = lado * 19 + ex, cy = HY - 3 + ey;
    if (expr === "feliz" && ab < 0.08) return <path d={`M${cx - 7},${cy + 2} Q${cx},${cy - 7} ${cx + 7},${cy + 2}`} fill="none" stroke={TINTA} strokeWidth={3.6} strokeLinecap="round" />;
    const ry = (expr === "sorpresa" ? 7.5 : expr === "picaro" ? 4.5 : 6) * parp;
    return (
      <g>
        <ellipse cx={cx} cy={cy} rx={expr === "sorpresa" ? 5.5 : 4.6} ry={ry} fill={TINTA} />
        {expr === "picaro" && <path d={`M${cx - 9},${cy - 4} L${cx + 9},${cy - 6}`} stroke={TINTA} strokeWidth={3} strokeLinecap="round" />}
      </g>
    );
  };

  const clipId = `cab${seed}`;
  const peloDetras = pelo.tipo === "rodete" ? (
    <circle cx={-6} cy={HY - R - 8} r={24} fill={pelo.color} stroke={TINTA} strokeWidth={lw} />
  ) : pelo.tipo === "melena" ? (
    <path d={`M${-R - 4},${HY} Q${-R - 10},${HY + 50} ${-R + 10},${HY + 62} L${R - 10},${HY + 62} Q${R + 10},${HY + 50} ${R + 4},${HY} Z`} fill={pelo.color} stroke={TINTA} strokeWidth={lw} />
  ) : null;

  const peloEncima = () => {
    const c = pelo.color, c2 = pelo.color2 ?? pelo.color;
    switch (pelo.tipo) {
      case "gorro":
        return (
          <g>
            <path d={`M${-R - 3},${HY - 8} Q${-R + 2},${HY - R - 22} 0,${HY - R - 26} Q${R - 2},${HY - R - 22} ${R + 3},${HY - 8} Z`} fill={c} stroke={TINTA} strokeWidth={lw} strokeLinejoin="round" />
            <path d={`M${-R - 5},${HY - 20} Q0,${HY - 34} ${R + 5},${HY - 20} L${R + 5},${HY - 4} Q0,${HY - 18} ${-R - 5},${HY - 4} Z`} fill={c2} stroke={TINTA} strokeWidth={lw} strokeLinejoin="round" />
            {[-36, -18, 0, 18, 36].map((xx) => <path key={xx} d={`M${xx},${HY - 27} L${xx + 1},${HY - 12}`} stroke={TINTA} strokeWidth={1.6} opacity={0.5} />)}
            <circle cx={0} cy={HY - R - 30} r={9} fill={c2} stroke={TINTA} strokeWidth={lw - 1} />
          </g>
        );
      case "gorra":
        return (
          <g>
            <path d={`M${-R + 2},${HY - 22} Q${-R + 6},${HY - R - 8} 0,${HY - R - 6} Q${R - 6},${HY - R - 8} ${R - 2},${HY - 22} Z`} fill={c} stroke={TINTA} strokeWidth={lw} />
            <path d={`M${-R + 4},${HY - 22} Q${-R - 26},${HY - 22} ${-R - 30},${HY - 12} Q${-R},${HY - 8} ${-R + 10},${HY - 14} Z`} fill={c2} stroke={TINTA} strokeWidth={lw - 0.6} strokeLinejoin="round" />
            <circle cx={0} cy={HY - R - 5} r={4} fill={c2} stroke={TINTA} strokeWidth={2} />
          </g>
        );
      case "rulos":
        return (
          <g fill={c} stroke={TINTA} strokeWidth={lw - 0.6}>
            {[-48, -28, -6, 16, 38, 52].map((xx, i) => <circle key={i} cx={xx} cy={HY - R + 14 - (i % 2) * 8 - Math.abs(xx) * -0.12} r={20} />)}
          </g>
        );
      default: {
        // melena / rodete: casquete con flequillo cortado
        const fleq = pelo.tipo === "melena"
          ? `L${R - 6},${HY - 16} L${R - 22},${HY - 30} L${R - 30},${HY - 14} L${R - 46},${HY - 30} L${R - 60},${HY - 12} L${R - 74},${HY - 30} L${-R + 20},${HY - 10} L${-R + 4},${HY - 22}`
          : `Q${R - 20},${HY - 26} ${10},${HY - 40} Q${-R + 20},${HY - 44} ${-R + 2},${HY - 14}`;
        return (
          <path d={`M${-R - 2},${HY - 6} Q${-R},${HY - R - 12} 0,${HY - R - 6} Q${R},${HY - R - 12} ${R + 2},${HY - 6} ${fleq} Z`} fill={c} stroke={TINTA} strokeWidth={lw} strokeLinejoin="round" />
        );
      }
    }
  };

  const bL = brazo(-1), bR = brazo(1);
  const pie = (lado: 1 | -1) => {
    const off = camina ? paso * lado * 22 : 0;
    const lift = camina ? Math.max(0, Math.sin(fase) * lado) * 10 : 0;
    return { x: lado * 12 + off, y: -lift };
  };
  const pL = pie(-1), pR = pie(1);

  return (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(${giro})`}>
      {/* sombra de contacto */}
      {!sinPiernas && <ellipse cx={0} cy={2} rx={44} ry={7} fill="#000" opacity={0.28} />}
      {/* piernas */}
      {!sinPiernas && (
        <g stroke={TINTA} strokeWidth={lw + 0.4} strokeLinecap="round" fill="none">
          <path d={`M-11,${-122 + rebote} Q${-12 + pL.x * 0.3},${-60 + rebote * 0.5} ${pL.x},${pL.y}`} />
          <path d={`M11,${-122 + rebote} Q${12 + pR.x * 0.3},${-60 + rebote * 0.5} ${pR.x},${pR.y}`} />
          <path d={`M${pL.x},${pL.y} l-12,0`} strokeWidth={lw + 2} />
          <path d={`M${pR.x},${pR.y} l12,0`} strokeWidth={lw + 2} />
        </g>
      )}
      {/* brazo de atrás */}
      <path d={bL} fill="none" stroke={TINTA} strokeWidth={lw + 0.4} strokeLinecap="round" />
      {/* torso: campera con remera en V */}
      <path d={`M-31,${torsoY + 6} Q-36,${torsoY + 60} -36,${-118 + rebote} L36,${-118 + rebote} Q36,${torsoY + 60} 31,${torsoY + 6} Q0,${torsoY - 8} -31,${torsoY + 6} Z`} fill={campera} stroke={TINTA} strokeWidth={lw} strokeLinejoin="round" />
      <path d={`M-13,${torsoY + 1} L0,${torsoY + 44} L13,${torsoY + 1} Q0,${torsoY - 3} -13,${torsoY + 1} Z`} fill={remera} stroke={TINTA} strokeWidth={lw - 1.2} strokeLinejoin="round" />
      <path d={`M-13,${torsoY + 1} L-20,${torsoY + 60} M13,${torsoY + 1} L20,${torsoY + 60}`} stroke={TINTA} strokeWidth={2.4} opacity={0.55} fill="none" />
      <path d={`M-31,${torsoY + 30} Q-28,${torsoY + 70} -32,${-122 + rebote}`} stroke="#000" strokeWidth={10} opacity={0.12} fill="none" />
      {/* brazo de adelante */}
      <path d={bR} fill="none" stroke={TINTA} strokeWidth={lw + 0.4} strokeLinecap="round" />
      {[bL, bR].map((d, i) => { const m = manoPos(d); return <circle key={i} cx={m.x} cy={m.y} r={6} fill="#fff" stroke={TINTA} strokeWidth={3} />; })}
      {/* cabeza */}
      {peloDetras}
      <defs><clipPath id={clipId}><circle cx={0} cy={HY} r={R} /></clipPath></defs>
      <circle cx={0} cy={HY} r={R} fill="#fbfaf6" />
      <g clipPath={`url(#${clipId})`}>
        <ellipse cx={-R * 0.55} cy={HY + R * 0.45} rx={R * 0.9} ry={R * 0.7} fill="#d9d4c9" opacity={0.35} />
      </g>
      <circle cx={0} cy={HY} r={R} fill="none" stroke={TINTA} strokeWidth={lw} />
      {peloEncima()}
      {auriculares && (
        <g>
          <path d={`M${-R - 6},${HY - 4} Q${-R + 2},${HY - R - 26} 0,${HY - R - 22} Q${R - 2},${HY - R - 26} ${R + 6},${HY - 4}`} fill="none" stroke="#2a2a2e" strokeWidth={9} />
          <rect x={-R - 16} y={HY - 22} width={22} height={40} rx={9} fill="#2f3036" stroke={TINTA} strokeWidth={3} />
          <rect x={R - 6} y={HY - 22} width={22} height={40} rx={9} fill="#2f3036" stroke={TINTA} strokeWidth={3} />
        </g>
      )}
      {ceja(-1)}{ceja(1)}
      {ojo(-1)}{ojo(1)}
      {boca()}
      {expr === "nervioso" && <path d={`M${R - 8},${HY - 30} q6,10 0,16 q-6,-6 0,-16 Z`} fill="#8fc7e8" stroke={TINTA} strokeWidth={2} />}
    </g>
  );
};

// Personaje cabezón v2 — proporciones del estilo: cabeza blanca redonda apoyada sobre un
// torso-tubo angosto, piernas largas de una línea, cara chica. Sombreado lateral + tinte de escena.
// Origen = pies. Alto total ≈ 344 u (≈1,75 m).
import React from "react";
import { useCurrentFrame } from "remotion";
import { mix } from "./Motor3D";

export const TINTA = "#231a17";

export type Pelo = { tipo: "gorro" | "melena" | "rodete" | "gorra" | "rulos" | "corto"; color: string; color2?: string };
export type Expr = "neutral" | "picaro" | "sorpresa" | "enojado" | "feliz" | "nervioso" | "serio";
export type Brazos = "abajo" | "cruzados" | "gesto" | "saludo" | "volante" | "manos" | "bolsillos";

export type PersonajeProps = {
  x: number; y: number; s?: number;
  pelo: Pelo; campera: string; remera?: string; pantalon?: string;
  habla?: boolean; expr?: Expr; mira?: number; giro?: number;
  camina?: boolean; brazos?: Brazos; auriculares?: boolean; seed?: number;
  sinPiernas?: boolean;
  luzLado?: 1 | -1;          // de qué lado viene la luz
  tinte?: string; tinteK?: number; // color de la luz de la escena
  solapas?: boolean;          // campera abierta con solapas (planos cortos)
  linea?: number;             // grosor de línea en px de pantalla
};

const n1 = (t: number, seed: number) =>
  Math.sin(t * 0.9 + seed) * 0.5 + Math.sin(t * 2.3 + seed * 1.7) * 0.3 + Math.sin(t * 5.1 + seed * 0.3) * 0.2;

export const Personaje: React.FC<PersonajeProps> = ({
  x, y, s = 1, pelo, campera, remera = "#ece8df", pantalon, habla = false, expr = "neutral",
  mira = 0, giro = 0, camina = false, brazos = "abajo", auriculares = false, seed = 1, sinPiernas = false,
  luzLado = 1, tinte = "#ffffff", tinteK = 0, solapas = false, linea = 2.2,
}) => {
  const f = useCurrentFrame();
  const T = (c: string) => (tinteK ? mix(c, tinte, tinteK) : c);
  const ink = TINTA;
  const lw = linea / s;
  const fase = f * 0.3;
  const paso = camina ? Math.sin(fase) : 0;
  const rebote = camina ? -Math.abs(Math.sin(fase)) * 5 : Math.sin(f / 24 + seed) * 1.2;
  const ciclo = (f + seed * 37) % 101;
  const parp = ciclo < 4 ? [0.5, 0.08, 0.08, 0.6][ciclo] : 1;
  const ab = habla ? Math.max(0, n1(f * 0.9, seed) * 0.8 + 0.45 + Math.sin(f * 1.7 + seed) * 0.35) : 0;

  const R = 44;
  const HY = -300 + rebote;
  const tTop = -262 + rebote, tBot = -146 + rebote;
  const ex = mira * 8;
  const piel = T("#fbfaf6"), pielSom = T("#cfcac2");
  const camC = T(campera), camS = mix(T(campera), "#1a1426", 0.32);
  const pan = T(pantalon ?? "#3a3a40");

  // brazos
  const hom = (l: 1 | -1) => ({ x: l * 21, y: tTop + 12 });
  const gest = Math.sin(f / 7 + seed) * 0.5 + 0.5;
  const brazo = (l: 1 | -1): string => {
    const h = hom(l);
    const sw = camina ? -paso * l * 16 : Math.sin(f / 25 + seed) * 1.5;
    if (brazos === "cruzados") return `M${h.x},${h.y} Q${l * 30},${h.y + 40} ${-l * 14},${h.y + 42}`;
    if (brazos === "volante") return `M${h.x},${h.y} Q${l * 36},${h.y + 46} ${l * 30},${h.y + 74}`;
    if (brazos === "manos") return `M${h.x},${h.y} Q${l * 32},${h.y + 56} ${l * 6},${h.y + 62}`;
    if (brazos === "bolsillos") return `M${h.x},${h.y} Q${l * 30},${h.y + 50} ${l * 16},${h.y + 92}`;
    if (brazos === "saludo" && l === 1) { const w = Math.sin(f / 3.2) * 12; return `M${h.x},${h.y} Q${54},${h.y - 4} ${60 + w},${h.y - 58}`; }
    if (brazos === "gesto" && l === 1) { const up = 22 + gest * 22; return `M${h.x},${h.y} Q${48},${h.y + 40} ${56 + gest * 8},${h.y + 26 - up}`; }
    return `M${h.x},${h.y} Q${l * 30 + sw * 0.4},${h.y + 50} ${l * 26 + sw},${h.y + 100}`;
  };
  const fin = (d: string) => { const p = d.split(" ").pop()!.split(","); return { x: +p[0], y: +p[1] }; };

  const boca = () => {
    const my = HY + 20, c = ex * 0.55;
    if (ab > 0.08) {
      const ry = 2 + ab * 8, rx = 7 + ab * 2;
      return (
        <g>
          <ellipse cx={c} cy={my + ry * 0.3} rx={rx} ry={ry} fill="#4a1a1a" stroke={ink} strokeWidth={lw} />
          <ellipse cx={c} cy={my + ry * 0.85} rx={rx * 0.5} ry={ry * 0.3} fill="#b95252" />
          {expr === "enojado" && <rect x={c - rx * 0.7} y={my + ry * 0.3 - ry + 1} width={rx * 1.4} height={Math.min(3.5, ry)} fill="#fff" />}
        </g>
      );
    }
    switch (expr) {
      case "picaro": return <path d={`M${c - 15},${my - 3} Q${c + 2},${my + 7} ${c + 16},${my - 9}`} fill="none" stroke={ink} strokeWidth={lw * 1.1} strokeLinecap="round" />;
      case "feliz": return <path d={`M${c - 11},${my - 3} Q${c},${my + 10} ${c + 11},${my - 3} Z`} fill="#4a1a1a" stroke={ink} strokeWidth={lw} strokeLinejoin="round" />;
      case "sorpresa": return <ellipse cx={c} cy={my + 1} rx={5} ry={6.5} fill="#4a1a1a" stroke={ink} strokeWidth={lw} />;
      case "enojado": return <path d={`M${c - 10},${my + 3} Q${c},${my - 4} ${c + 10},${my + 3}`} fill="none" stroke={ink} strokeWidth={lw * 1.1} strokeLinecap="round" />;
      case "nervioso": return <path d={`M${c - 11},${my} l4.4,-3 l4.4,3 l4.4,-3 l4.4,3 l4.4,-3`} fill="none" stroke={ink} strokeWidth={lw} strokeLinecap="round" strokeLinejoin="round" />;
      case "serio": return <path d={`M${c - 8},${my} H${c + 8}`} stroke={ink} strokeWidth={lw * 1.1} strokeLinecap="round" />;
      default: return <path d={`M${c - 8},${my} Q${c},${my + 2} ${c + 8},${my - 0.5}`} fill="none" stroke={ink} strokeWidth={lw * 1.1} strokeLinecap="round" />;
    }
  };
  const ceja = (l: 1 | -1) => {
    const cx = l * 14 + ex, cy = HY - 16 + (expr === "sorpresa" ? -5 : 0);
    const r = expr === "enojado" ? -l * 16 : expr === "picaro" ? (l === 1 ? 10 : -18) : expr === "nervioso" ? l * 12 : 0;
    return <path d={`M${cx - 7},${cy} L${cx + 7},${cy}`} transform={`rotate(${r} ${cx} ${cy})`} stroke={ink} strokeWidth={lw * 1.25} strokeLinecap="round" />;
  };
  const ojo = (l: 1 | -1) => {
    const cx = l * 13 + ex, cy = HY - 3;
    if (expr === "feliz" && ab < 0.08) return <path d={`M${cx - 4.5},${cy + 1.5} Q${cx},${cy - 4.5} ${cx + 4.5},${cy + 1.5}`} fill="none" stroke={ink} strokeWidth={lw} strokeLinecap="round" />;
    const ry = (expr === "sorpresa" ? 5 : expr === "picaro" ? 3 : 4.2) * parp;
    return (
      <g>
        <ellipse cx={cx} cy={cy} rx={expr === "sorpresa" ? 3.8 : 3.2} ry={ry} fill={ink} />
        {expr === "picaro" && <path d={`M${cx - 6},${cy - 3} L${cx + 6},${cy - 4.5}`} stroke={ink} strokeWidth={lw} strokeLinecap="round" />}
      </g>
    );
  };

  const cid = `cab${seed}`, tid = `tor${seed}`;
  const C = T(pelo.color), C2 = T(pelo.color2 ?? mix(pelo.color, "#000000", 0.2)), CS = mix(C, "#100818", 0.35);
  const peloDetras = pelo.tipo === "rodete" ? <circle cx={-4} cy={HY - R - 6} r={17} fill={C} stroke={ink} strokeWidth={lw} />
    : pelo.tipo === "melena" ? <path d={`M${-R - 4},${HY - 4} Q${-R - 8},${HY + 36} ${-R + 6},${HY + 46} L${R - 6},${HY + 46} Q${R + 8},${HY + 36} ${R + 4},${HY - 4} Z`} fill={C} stroke={ink} strokeWidth={lw} /> : null;

  const peloEncima = () => {
    switch (pelo.tipo) {
      case "gorro":
        return (
          <g>
            <path d={`M${-R - 2},${HY - 6} Q${-R + 2},${HY - R - 16} 0,${HY - R - 19} Q${R - 2},${HY - R - 16} ${R + 2},${HY - 6} Z`} fill={C} stroke={ink} strokeWidth={lw} strokeLinejoin="round" />
            <path d={`M${luzLado * -R * 0.1},${HY - R - 18} Q${-luzLado * R},${HY - R} ${-luzLado * (R + 2)},${HY - 8} L${-luzLado * R * 0.3},${HY - 14} Z`} fill={CS} opacity={0.6} />
            <path d={`M${-R - 4},${HY - 15} Q0,${HY - 26} ${R + 4},${HY - 15} L${R + 4},${HY - 3} Q0,${HY - 14} ${-R - 4},${HY - 3} Z`} fill={C2} stroke={ink} strokeWidth={lw} strokeLinejoin="round" />
            {[-27, -13, 0, 13, 27].map((xx) => <path key={xx} d={`M${xx},${HY - 21} L${xx + 0.8},${HY - 9}`} stroke={ink} strokeWidth={lw * 0.5} opacity={0.5} />)}
          </g>
        );
      case "gorra":
        return (
          <g>
            <path d={`M${-R + 1},${HY - 16} Q${-R + 4},${HY - R - 6} 0,${HY - R - 4} Q${R - 4},${HY - R - 6} ${R - 1},${HY - 16} Z`} fill={C} stroke={ink} strokeWidth={lw} />
            <path d={`M${R - 4},${HY - 16} Q${R + 22},${HY - 17} ${R + 26},${HY - 9} Q${R},${HY - 6} ${R - 8},${HY - 11} Z`} fill={C2} stroke={ink} strokeWidth={lw} strokeLinejoin="round" />
            <path d={`M${-R * 0.2},${HY - R - 4} Q${-R * 0.9},${HY - R * 0.7} ${-R + 2},${HY - 16} L${-R * 0.4},${HY - 16} Z`} fill={CS} opacity={0.5} />
          </g>
        );
      case "rulos":
        return <g fill={C} stroke={ink} strokeWidth={lw}>{[-36, -21, -5, 11, 27, 39].map((xx, i) => <circle key={i} cx={xx} cy={HY - R + 10 - (i % 2) * 6} r={14} />)}</g>;
      case "corto":
        return <path d={`M${-R - 1},${HY - 8} Q${-R},${HY - R - 8} 0,${HY - R - 5} Q${R},${HY - R - 8} ${R + 1},${HY - 8} Q${R - 6},${HY - 22} ${R - 18},${HY - 26} Q${0},${HY - 36} ${-R + 10},${HY - 22} Z`} fill={C} stroke={ink} strokeWidth={lw} strokeLinejoin="round" />;
      default: {
        const fleq = pelo.tipo === "melena"
          ? `L${R - 4},${HY - 12} L${R - 16},${HY - 22} L${R - 22},${HY - 10} L${R - 34},${HY - 23} L${R - 45},${HY - 9} L${R - 56},${HY - 22} L${-R + 14},${HY - 8} L${-R + 3},${HY - 17}`
          : `Q${R - 14},${HY - 20} ${8},${HY - 30} Q${-R + 14},${HY - 33} ${-R + 2},${HY - 10}`;
        return <path d={`M${-R - 2},${HY - 4} Q${-R},${HY - R - 9} 0,${HY - R - 4} Q${R},${HY - R - 9} ${R + 2},${HY - 4} ${fleq} Z`} fill={C} stroke={ink} strokeWidth={lw} strokeLinejoin="round" />;
      }
    }
  };

  const bL = brazo(-1), bR = brazo(1);
  const pie = (l: 1 | -1) => ({ x: l * 9 + (camina ? paso * l * 20 : 0), y: camina ? -Math.max(0, Math.sin(fase) * l) * 8 : 0 });
  const pL = pie(-1), pR = pie(1);
  const torso = `M-23,${tTop + 10} Q-24,${tTop} -12,${tTop - 2} L12,${tTop - 2} Q24,${tTop} 23,${tTop + 10} L25,${tBot - 6} Q25,${tBot} 18,${tBot} L-18,${tBot} Q-25,${tBot} -25,${tBot - 6} Z`;

  return (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(${giro})`}>
      {!sinPiernas && <ellipse cx={0} cy={1} rx={30} ry={5} fill="#000" opacity={0.3} />}
      {!sinPiernas && (
        <g stroke={ink} strokeLinecap="round" fill="none">
          <path d={`M-8,${tBot - 2} Q${-8 + pL.x * 0.25},${-70 + rebote * 0.5} ${pL.x},${pL.y - 4}`} strokeWidth={lw * 1.5} />
          <path d={`M8,${tBot - 2} Q${8 + pR.x * 0.25},${-70 + rebote * 0.5} ${pR.x},${pR.y - 4}`} strokeWidth={lw * 1.5} />
          <ellipse cx={pL.x - 4} cy={pL.y - 2} rx={7} ry={3.4} fill={pan} strokeWidth={lw * 0.8} />
          <ellipse cx={pR.x + 4} cy={pR.y - 2} rx={7} ry={3.4} fill={pan} strokeWidth={lw * 0.8} />
        </g>
      )}
      <path d={bL} fill="none" stroke={ink} strokeWidth={lw * 1.4} strokeLinecap="round" />
      {/* torso-tubo con lado en sombra */}
      <defs>
        <clipPath id={tid}><path d={torso} /></clipPath>
        <clipPath id={cid}><circle cx={0} cy={HY} r={R} /></clipPath>
      </defs>
      <path d={torso} fill={camC} />
      <g clipPath={`url(#${tid})`}>
        <rect x={luzLado === 1 ? -30 : 4} y={tTop - 5} width={26} height={tBot - tTop + 10} fill={camS} opacity={0.75} />
        {solapas ? (
          <g>
            <path d={`M-10,${tTop - 2} L0,${tTop + 46} L10,${tTop - 2} Z`} fill={T(remera)} />
            <path d={`M-10,${tTop - 2} L-15,${tTop + 26} L-3,${tTop + 34} M10,${tTop - 2} L15,${tTop + 26} L3,${tTop + 34}`} stroke={ink} strokeWidth={lw * 0.9} fill={mix(camC, "#000000", 0.15)} strokeLinejoin="round" />
            <path d={`M0,${tTop + 46} V${tBot}`} stroke={ink} strokeWidth={lw * 0.8} />
          </g>
        ) : (
          <path d={`M-8,${tTop - 2} Q0,${tTop + 8} 8,${tTop - 2}`} fill={T(remera)} stroke={ink} strokeWidth={lw * 0.8} />
        )}
        <rect x={-30} y={tBot - 10} width={60} height={12} fill="#000" opacity={0.12} />
      </g>
      <path d={torso} fill="none" stroke={ink} strokeWidth={lw} strokeLinejoin="round" />
      <path d={bR} fill="none" stroke={ink} strokeWidth={lw * 1.4} strokeLinecap="round" />
      {[bL, bR].map((d, i) => { const m = fin(d); return <circle key={i} cx={m.x} cy={m.y} r={3.6} fill={piel} stroke={ink} strokeWidth={lw * 0.8} />; })}
      {/* cabeza */}
      {peloDetras}
      <circle cx={0} cy={HY} r={R} fill={piel} />
      <g clipPath={`url(#${cid})`}>
        <circle cx={luzLado * R * 0.42} cy={HY - R * 0.32} r={R * 1.02} fill="none" stroke={pielSom} strokeWidth={R * 0.5} opacity={0.38} />
      </g>
      <circle cx={0} cy={HY} r={R} fill="none" stroke={ink} strokeWidth={lw} />
      {peloEncima()}
      {auriculares && (
        <g>
          <path d={`M${-R - 4},${HY - 3} Q${-R + 2},${HY - R - 20} 0,${HY - R - 16} Q${R - 2},${HY - R - 20} ${R + 4},${HY - 3}`} fill="none" stroke="#26262b" strokeWidth={7} />
          <rect x={-R - 12} y={HY - 16} width={16} height={30} rx={7} fill="#2f3036" stroke={ink} strokeWidth={lw} />
          <rect x={R - 4} y={HY - 16} width={16} height={30} rx={7} fill="#2f3036" stroke={ink} strokeWidth={lw} />
        </g>
      )}
      {ceja(-1)}{ceja(1)}{ojo(-1)}{ojo(1)}{boca()}
      {expr === "nervioso" && <path d={`M${R - 6},${HY - 22} q4.5,8 0,12 q-4.5,-4 0,-12 Z`} fill="#8fc7e8" stroke={ink} strokeWidth={lw * 0.7} />}
    </g>
  );
};

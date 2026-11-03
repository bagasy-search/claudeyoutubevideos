// cl2alisar · LA PARED EN CAPAS (el objeto del hilo): un trozo de pared de ladrillo hueco visto en corte a la izquierda y
// con su cara en perspectiva a la derecha. Las capas tienen espesor (exagerado para que se lea): puente, primera mano (con
// sus olas), enduido, pintura. Sobre la cara se apoyan la regla, la linterna rasante y la malla del encuentro con la columna.
// Todo f(estado): el hilo decide cuánto de cada cosa hay en cada segundo.
import React from "react";
import { C, cl, hash, lerp } from "./lib";

export type ParSt = { pego?: number; moja?: number; puente?: number; prim?: number; olas?: number; end?: number; lija?: number; pint?: number; malla?: number; fisura?: number; regla?: number; luz?: number; hum?: number };

const H = 600, W = 190, D = 640, DK = 200, ROWS = 6;
// ladrillo hueco en corte: cara exterior + tabiques internos con 3 agujeros
const LadCorte: React.FC<{ x: number; y: number; w: number; h: number; dark: number }> = ({ x, y, w, h, dark }) => {
  const f = `rgb(${Math.round(lerp(181, 120, dark))},${Math.round(lerp(83, 52, dark))},${Math.round(lerp(47, 30, dark))})`;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={f} stroke={C.lad2} strokeWidth={2} />
      {[0, 1, 2].map((i) => <rect key={i} x={x + 10 + i * ((w - 20) / 3)} y={y + 12} width={(w - 20) / 3 - 10} height={h - 24} rx={3} fill="#1c1410" />)}
    </g>
  );
};

export const Pared: React.FC<{ x: number; y: number; s?: number; st: ParSt; t: number; giro?: number }> = ({ x, y, s = 1, st, t, giro = 0 }) => {
  const { pego = 0, moja = 0, puente = 0, prim = 0, olas = 0, end = 0, lija = 0, pint = 0, malla = 0, fisura = 0, regla = 0, luz = 0, hum = 0 } = st;
  const dk = DK + 26 * Math.sin(giro), k = dk / D, rh = H / ROWS;
  // espesores (px, exagerados): puente 5, primera 26, enduido 10, pintura 4
  const tP = 5 * puente, tR = 26 * prim, tE = 10 * end, tF = 4 * pint;
  const ola = (v: number) => olas * prim * (1 - end * 0.85) * 9 * Math.sin(v / 46 + 1.3) * Math.sin(v / 113);
  const capa = (x0: number, th: number, wav: boolean) => {
    const pts: string[] = [];
    for (let v = 0; v <= H; v += 20) pts.push(`${x0 + th + (wav ? ola(v) : 0)},${v}`);
    return `M${x0},0 L${pts.join(" L")} L${x0},${H} Z`;
  };
  // la cara: coordenadas locales (u hacia el fondo, v hacia abajo) → plano en perspectiva
  const M = `matrix(1,${-k},0,1,${W + tP + tR + tE + tF},0)`;
  const colU = D * 0.82;
  const cov = cl(prim * 0.9 + end * 0.6); // cuánto se ve el ladrillo a través
  return (
    <g transform={`translate(${x - (W + D) / 2 * s},${y - H * s}) scale(${s})`}>
      <defs>
        <linearGradient id="pz_rasante" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor={C.luz} stopOpacity={0.55} /><stop offset="1" stopColor={C.luz} stopOpacity={0} /></linearGradient>
        <pattern id="pz_malla" width="14" height="14" patternUnits="userSpaceOnUse"><path d="M0,0 L14,0 M0,0 L0,14" stroke={C.malla} strokeWidth={2.2} /></pattern>
      </defs>
      <ellipse cx={(W + D) / 2} cy={H + 18} rx={(W + D) * 0.58} ry={26} fill="rgba(0,0,0,.45)" />
      {/* ---- la cara en perspectiva ---- */}
      <g transform={M}>
        {Array.from({ length: ROWS }, (_, r) => Array.from({ length: 4 }, (_, c) => {
          const off = r % 2 ? -80 : 0, u = off + c * 165;
          if (u > colU) return null;
          const dark = moja * 0.5 + hum * (r >= ROWS - 2 ? 0.7 : 0);
          return <rect key={r + "_" + c} x={Math.max(0, u + 4)} y={r * rh + 4} width={Math.min(colU, u + 161) - Math.max(0, u + 4)} height={rh - 8} fill={`rgb(${Math.round(lerp(181, 118, dark))},${Math.round(lerp(83, 50, dark))},${Math.round(lerp(47, 28, dark))})`} />;
        }))}
        <rect x={0} y={0} width={colU} height={H} fill={C.mort} opacity={0.0} />
        {/* juntas */}
        {Array.from({ length: ROWS + 1 }, (_, r) => <rect key={"j" + r} x={0} y={r * rh - 4} width={colU} height={8} fill={C.mort} />)}
        {/* rebabas: pegotes que salen de las juntas */}
        {pego > 0.01 && Array.from({ length: 16 }, (_, i) => { const r = 1 + Math.floor(hash(i, 1) * (ROWS - 1)), u = 30 + hash(i, 2) * (colU - 60); return <ellipse key={"p" + i} cx={u} cy={r * rh + 6 * hash(i, 3)} rx={14 + 16 * hash(i, 4)} ry={7 + 7 * hash(i, 5)} fill={C.mort2} stroke="#46423d" strokeWidth={2} opacity={pego} />; })}
        {/* humedad: manchón oscuro abajo con sal */}
        {hum > 0.01 && <g opacity={hum}><path d={`M0,${H} L0,${H - 170} Q${colU * 0.3},${H - 230} ${colU * 0.55},${H - 175} Q${colU * 0.8},${H - 130} ${colU},${H - 190} L${colU},${H} Z`} fill={C.hum} opacity={0.55} />{Array.from({ length: 40 }, (_, i) => <circle key={i} cx={hash(i, 7) * colU} cy={H - 30 - hash(i, 8) * 150} r={2 + 2 * hash(i, 9)} fill={C.sal} opacity={0.8} />)}</g>}
        {/* columna de hormigón al fondo */}
        <rect x={colU} y={-10} width={D - colU} height={H + 10} fill={C.horm} />
        {Array.from({ length: 22 }, (_, i) => <circle key={"h" + i} cx={colU + 8 + hash(i, 11) * (D - colU - 16)} cy={hash(i, 12) * H} r={2 + 2 * hash(i, 13)} fill="#7d8083" />)}
        {/* capas sobre la cara */}
        {puente > 0.01 && <rect x={0} y={0} width={D} height={H} fill={C.puente} opacity={0.35 * puente * (1 - prim)} />}
        {prim > 0.01 && <rect x={0} y={0} width={D * cl(prim * 1.2)} height={H} fill={C.prim} opacity={0.35 + 0.65 * cov} />}
        {prim > 0.01 && Array.from({ length: 7 }, (_, i) => <path key={"ll" + i} d={`M${40 + i * 85},${30 + 50 * hash(i, 21)} q40,${180 + 60 * hash(i, 22)} 0,${380}`} stroke={C.prim2} strokeWidth={3} fill="none" opacity={prim * (1 - end) * 0.6 * cl(prim * 1.2 - i / 8)} />)}
        {end > 0.01 && <rect x={0} y={0} width={D * cl(end * 1.2)} height={H} fill={C.end} opacity={0.4 + 0.6 * end} />}
        {pint > 0.01 && <rect x={0} y={0} width={D} height={H} fill={C.pint} opacity={pint} />}
        {/* malla del encuentro, centrada sobre la línea ladrillo/columna */}
        {malla > 0.01 && <g opacity={cl(malla * 2) * (1 - pint * 0.85)}><rect x={colU - 60} y={H * (1 - malla)} width={120} height={H * malla} fill="url(#pz_malla)" /><rect x={colU - 60} y={H * (1 - malla)} width={120} height={H * malla} fill="none" stroke={C.malla} strokeWidth={2} strokeDasharray="10 8" /></g>}
        {/* fisura: sigue exactamente la línea del encuentro */}
        {fisura > 0.01 && <polyline points={Array.from({ length: 13 }, (_, i) => `${colU + (hash(i, 31) - 0.5) * 10},${(i / 12) * H * fisura}`).join(" ")} fill="none" stroke="#1a1714" strokeWidth={4} strokeLinejoin="round" />}
        {/* olas leídas con la linterna rasante: franjas de sombra */}
        {luz > 0.01 && olas > 0.01 && Array.from({ length: 6 }, (_, i) => <rect key={"o" + i} x={0} y={30 + i * 98} width={colU} height={34} fill="rgba(20,16,10,.5)" opacity={luz * olas * (1 - end * 0.9) * (0.5 + 0.5 * hash(i, 41))} transform={`skewY(${(hash(i, 42) - 0.5) * 3})`} />)}
        {luz > 0.01 && <rect x={0} y={0} width={D} height={H} fill="url(#pz_rasante)" opacity={luz} />}
        {lija > 0.01 && Array.from({ length: 18 }, (_, i) => <circle key={"l" + i} cx={60 + hash(i, 51) * (colU - 120)} cy={60 + hash(i, 52) * (H - 120)} r={14 + 20 * hash(i, 53)} fill="none" stroke="rgba(255,255,255,.35)" strokeWidth={2} opacity={lija * (1 - pint)} />)}
        {/* la regla de aluminio apoyada de canto, con la luz debajo */}
        {regla > 0.01 && <g opacity={cl(regla * 3)} transform={`translate(${-D * (1 - regla)},0)`}>
          <rect x={20} y={H * 0.42} width={colU - 40} height={22} rx={4} fill={C.alu} stroke={C.alu2} strokeWidth={2} />
          <path d={`M60,${H * 0.42 + 22} Q${colU / 2},${H * 0.42 + 22 + 12 * (1 - prim)} ${colU - 60},${H * 0.42 + 22}`} stroke={C.luz} strokeWidth={4} fill="none" opacity={0.9} />
        </g>}
      </g>
      {/* ---- el corte ---- */}
      {Array.from({ length: ROWS }, (_, r) => <LadCorte key={r} x={0} y={r * rh + 4} w={W} h={rh - 8} dark={moja * 0.5} />)}
      {Array.from({ length: ROWS + 1 }, (_, r) => <rect key={"cj" + r} x={0} y={r * rh - 4} width={W} height={8} fill={C.mort} />)}
      {pego > 0.01 && [1, 3, 4].map((r) => <path key={"cp" + r} d={`M${W},${r * rh - 6} q${16 * pego},-4 ${20 * pego},6 q-6,8 ${-20 * pego},6 Z`} fill={C.mort2} />)}
      <g transform={`translate(${W},0)`}>
        {puente > 0.01 && <rect x={0} y={0} width={tP} height={H} fill={C.puente} />}
        {prim > 0.01 && <path d={capa(tP, tR, true)} fill={C.prim} transform={`scale(1,${cl(prim * 1.3)})`} />}
        {end > 0.01 && <path d={capa(tP + tR, tE, false)} fill={C.end} transform={`scale(1,${cl(end * 1.3)})`} />}
        {pint > 0.01 && <rect x={tP + tR + tE} y={0} width={tF} height={H * cl(pint * 1.3)} fill={C.pint} />}
      </g>
      {/* arista entre el corte y la cara */}
      <line x1={W + tP + tR + tE + tF} y1={0} x2={W + tP + tR + tE + tF} y2={H} stroke="rgba(255,236,200,.35)" strokeWidth={2} />
      <path d={`M0,0 L${W + tP + tR + tE + tF},0 L${W + tP + tR + tE + tF + D},${-dk} L${D},${-dk} Z`} fill="rgba(255,236,200,.08)" stroke="rgba(255,236,200,.25)" strokeWidth={2} />
    </g>
  );
};

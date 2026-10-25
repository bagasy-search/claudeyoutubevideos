import React from "react";
import { interpolate } from "remotion";
import { tramos, V, useCam } from "./mundo";
import { Ballenero, CasaNan, Molino, Iglesia, Muelle, Oficina, Torre, Barril, Farol, Nube, Isla } from "./kit3";
import { Casa } from "./kit";
import { Arbol } from "./kit2";

// Estado global del mundo de Soot 04: dónde está el barco y cómo está (velas, corte, botes, fuego, bodega),
// y los lugares fijos (granja, Nueva York, Nantucket de ida, Nantucket de vuelta, Pensilvania).
const pz = (t: number, ks: [number, number][]) => interpolate(t, ks.map((k) => k[0]), ks.map((k) => k[1]), { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const X_FARM = -17000, X_NY = -12500, X_DOCK = -1200, X_FARO = -2450;
export const X_NAN2 = 110000; // el barco amarra acá a la vuelta (la vuelta al mundo cierra en el mismo pueblo)
export const X_PENN = 124500;
export const X_ISLA = 63800; // Marquesas (Melville)

// x del barco: quieto en el muelle, sale, navega, se detiene a cazar, sigue, ancla en la isla, vuelve
export const bx = tramos([
  [0, X_DOCK], [141, X_DOCK], [146, X_DOCK + 400], [152, X_DOCK + 1800], [266, 30000], [335, 48000], [352, 51200], [368, 52400],
  [578, 52400], [612, 62000], [627, 62000], [660, 70000], [803, 70000], [806, 70800], [868, X_NAN2 - 300], [872, X_NAN2], [901, X_NAN2],
]);
export const velas = (t: number) => pz(t, [[141, 0], [147, 1], [360, 1], [370, 0.25], [578, 0.25], [582, 1], [610, 1], [614, 0.15], [626, 0.15], [630, 1], [865, 1], [871, 0]]);
export const corte = (t: number) => pz(t, [[266.6, 0], [268.2, 1], [330.6, 1], [332, 0], [569.4, 0], [570.4, 1], [578.2, 1], [579.4, 0]]);
export const fuego = (t: number) => pz(t, [[521, 0], [523.5, 1], [569, 1], [570, 0.4], [578, 0.4], [579, 0]]);
export const bodega = (t: number) => (t < 569.6 ? 0 : t < 803 ? pz(t, [[569.6, 0.05], [578, 1]]) : 1);
export const botesB = (t: number): [boolean, boolean, boolean] => [true, t < 389.4 || t > 578, true];

// transformación del barco (para montar personas que se balancean con la cubierta)
export const barcoTr = (t: number, x: number, escala = 1, roto = 0) => {
  const bal = Math.sin(t * 0.8) * 1.4 * (1 - roto) + roto * 14;
  const sube = Math.sin(t * 1.1) * 6 + roto * 260;
  return `translate(${x}px, 0px) scale(${escala}) translate(0px, ${sube}px) rotate(${bal}deg)`;
};
export const EnBarco: React.FC<{ t: number; x: number; escala?: number; roto?: number; children: React.ReactNode }> = ({ t, x, escala = 1, roto = 0, children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, transformOrigin: "0 0", transform: barcoTr(t, x, escala, roto) }}>{children}</div>
);
export const CUBIERTA = -212; // y local de la cubierta (pies de las personas)

// tierra firme: banda de suelo que tapa el mar (de x0 a x1)
const Tierra: React.FC<{ x0: number; x1: number; col?: string; col2?: string }> = ({ x0, x1, col = "#d8c48a", col2 = "#7aa84a" }) => (
  <div style={{ position: "absolute", left: x0, top: -70, width: x1 - x0, height: 3200, background: `linear-gradient(180deg, ${col2} 0px, ${col2} 40px, ${col} 41px, #b89a5a 600px, #6a5030 3200px)` }} />
);
const Colina: React.FC<{ x: number; w: number; h: number; col: string }> = ({ x, w, h, col }) => (
  <svg style={{ position: "absolute", left: x - w / 2, top: -70 - h, overflow: "visible" }} width={w} height={h + 2}>
    <path d={`M 0 ${h + 2} Q ${w * 0.25} ${h * 0.1} ${w / 2} 0 Q ${w * 0.75} ${h * 0.1} ${w} ${h + 2} Z`} fill={col} />
  </svg>
);
const Poste: React.FC<{ x: number }> = ({ x }) => (
  <svg style={{ position: "absolute", left: x, top: -420, overflow: "visible" }} width={1} height={1}>
    <rect x={-8} y={0} width={16} height={350} fill="#5a3418" /><rect x={-50} y={20} width={100} height={12} fill="#5a3418" />
    <path d="M -50 26 Q 300 120 650 26" stroke="#2a1a10" strokeWidth={3} fill="none" />
  </svg>
);
// faro de Brant Point en la boca del puerto
export const Faro: React.FC<{ x: number; t: number; luz?: number }> = ({ x, t, luz = 1 }) => (
  <svg style={{ position: "absolute", left: x, top: -70, overflow: "visible" }} width={1} height={1}>
    {luz > 0 && <g opacity={luz}><path d={`M 0 -560 L ${2400 * Math.cos(t * 0.9)} ${-760} L ${2400 * Math.cos(t * 0.9)} ${-360} Z`} fill="#fff6c0" opacity={0.22} /><circle cx={0} cy={-560} r={150} fill="#fff3b0" opacity={0.35} /></g>}
    <path d="M -80 0 L -50 -520 L 50 -520 L 80 0 Z" fill="#f4f0e8" />
    {[0, 1, 2].map((i) => <path key={i} d={`M ${-76 + i * 10} ${-60 - i * 160} L ${76 - i * 10} ${-60 - i * 160} L ${70 - i * 10} ${-130 - i * 160} L ${-70 + i * 10} ${-130 - i * 160} Z`} fill="#c8343a" />)}
    <rect x={-60} y={-600} width={120} height={80} fill={luz > 0 ? "#fff3a0" : "#5a6a8a"} stroke="#2a2a30" strokeWidth={8} />
    <path d="M -76 -600 L 0 -660 L 76 -600 Z" fill="#2a2a30" />
  </svg>
);

// Nantucket (pueblo + muelle + barriles); `x` = punta del muelle
const Nantucket: React.FC<{ x: number; t: number; luz?: boolean; dir?: 1 | -1 }> = ({ x, t, luz, dir = 1 }) => {
  const X = (d: number) => x - dir * d;
  return (
    <>
      <Muelle x={dir === 1 ? x : x + 3600} y={0} w={3600} />
      {[300, 560, 820, 1300, 1700].map((d, i) => <Barril key={i} x={X(d)} y={-90 - (i % 2) * 0} s={1.1} />)}
      <Barril x={X(430)} y={-150} s={1.1} /><Barril x={X(690)} y={-150} s={1.1} />
      {[2600, 3000, 3420, 3850, 4300, 4750, 5200].map((d, i) => <CasaNan key={i} x={X(d)} y={-70} s={1 + (i % 3) * 0.12} tono={["#9aa0a8", "#a8aeb6", "#8e949c"][i % 3]} rica={i === 2 || i === 5} luz={luz} />)}
      <Iglesia x={X(5800)} y={-70} />
      <Molino x={X(6500)} y={-70} t={t} />
    </>
  );
};

// Pensilvania: colinas verdes y la torre de 1859
const Pensilvania: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Colina x={X_PENN - 900} w={2200} h={420} col="#5a8a3a" />
    <Colina x={X_PENN + 1200} w={2600} h={520} col="#4a7a32" />
    {[-1600, -1300, 900, 1500, 1900].map((d) => <Arbol key={d} x={X_PENN + d} y={-70} s={0.7} color="#2a5a22" />)}
  </>
);

// todo lo fijo del mundo (con descarte por distancia a cámara)
export const LugaresFijos: React.FC<{ t: number }> = ({ t }) => {
  const noche2 = t > 828;
  return (
    <>
      {/* oeste: granja y camino, Nueva York */}
      <V x={(X_FARM + X_DOCK) / 2} y={0} w={X_DOCK - X_FARM + 6000} h={8000}><Tierra x0={X_FARM - 6000} x1={X_FARO - 150} /></V>
      <V x={X_FARM} y={-400} w={5000}>
        <Colina x={X_FARM - 1200} w={2600} h={380} col="#6aa04a" /><Colina x={X_FARM + 1400} w={2200} h={300} col="#5a9040" />
        <Casa x={X_FARM + 200} y={-70} s={2.2} techo="#9a3a2a" tono="#e8c79a" />
        {[-900, -700, 700, 1000].map((d) => <Arbol key={d} x={X_FARM + d} y={-70} s={0.8} color="#3a6a2a" />)}
      </V>
      <V x={(X_FARM + X_NY) / 2} y={-300} w={6000}>{Array.from({ length: 6 }, (_, i) => <Poste key={i} x={X_FARM + 1600 + i * 650} />)}</V>
      <V x={X_NY} y={-500} w={4200}>
        <Oficina x={X_NY} y={-70} t={t} />
        {[-1400, -1000, 1000, 1400].map((d, i) => (
          <div key={d} style={{ position: "absolute", left: X_NY + d - 180, top: -70 - (800 + (i % 2) * 300), width: 360, height: 800 + (i % 2) * 300, background: ["#6a5a7a", "#7a4a3a", "#5a4a6a", "#8a5a4a"][i], boxShadow: "inset 0 -20px 0 rgba(0,0,0,.2)" }}>
            {Array.from({ length: 12 }, (_, k) => <div key={k} style={{ position: "absolute", left: 40 + (k % 3) * 100, top: 60 + Math.floor(k / 3) * 160, width: 60, height: 90, background: "#ffd27a", opacity: 0.85 }} />)}
          </div>
        ))}
      </V>
      {/* Nantucket de ida */}
      <V x={X_DOCK - 4500} y={-400} w={10000}><Nantucket x={X_DOCK - 900} t={t} /></V>
      <V x={X_FARO} y={-400}><Faro x={X_FARO} t={t} luz={t > 29 && t < 44 ? 1 : 0} /></V>
      {/* Nantucket de vuelta + tierra firme + Pensilvania */}
      <V x={X_NAN2 + 8000} y={0} w={22000} h={8000}><Tierra x0={X_NAN2 + 3300} x1={X_PENN + 6000} /></V>
      <V x={X_NAN2 + 3500} y={-400} w={10000}><Nantucket x={X_NAN2 + 900} t={t} luz={noche2} dir={-1} /></V>
      <V x={X_PENN} y={-400} w={6000}><Pensilvania t={t} /></V>
      <V x={X_ISLA} y={-300} w={3000}><Isla x={X_ISLA} y={10} t={t} s={1.6} seed={4} humo /></V>
      {/* farolas del pueblo de vuelta */}
      {noche2 && <V x={X_NAN2 + 3000} y={-300} w={6000}>{[1400, 2200, 3000, 3800].map((d) => <Farol key={d} x={X_NAN2 + 900 + d} y={-330} t={t} s={1} />)}</V>}
    </>
  );
};

// el barco de la historia (con todo su estado)
export const BarcoNuestro: React.FC<{ t: number }> = ({ t }) => {
  const { cam } = useCam();
  const x = bx(t);
  if (Math.abs(cam.x - x) > 960 / cam.z + 2400) return null;
  return <Ballenero x={x} y={0} t={t} velas={velas(t)} corte={corte(t)} botes={botesB(t)} fuego={fuego(t)} bodega={bodega(t)} nombre="LYDIA" />;
};
export { Nube };

import React from "react";
import { prog } from "./kit";
import { En, SUELO, AGUA, Vegetacion } from "./mundo";
import { CasaTudor, Fuerte, Cabo, Choclo, O, Nave, Pino, Pantano, Cipres } from "./kitj";

// Lo que vive fijo en el mundo durante todo el video (su estado depende sólo del segundo global t).
// El fuerte: en el gancho (1610) está gastado; desde el rebobinado no existe hasta que se construye (238,9-247 s);
// en el hambre (650-740 s) se deteriora con nieve; en el giro vuelve a estar en pie.
export const FX = 24350; // centro del fuerte
export const fuerteEstado = (t: number) => {
  if (t < 33.5) return { arma: 1, ruina: 0.3, nieve: 0 };
  if (t < 238.9) return { arma: 0, ruina: 0, nieve: 0 };
  const arma = prog(t, 238.9, 247.0);
  const ruina = t > 652 ? Math.min(0.45, (t - 652) / 160) : t > 345 && t < 352 ? 0.25 : 0;
  const nieve = t > 660 && t < 732 ? 1 : 0;
  return { arma, ruina: t > 741 ? 0.3 : ruina, nieve };
};

export const Yehakin: React.FC<{ x: number; s?: number; t: number }> = ({ x, s = 1, t }) => (
  <O x={x} y={SUELO - 110 * s} s={s} w={520} h={260}>
    <path d="M -230 120 L -230 -10 Q -230 -120 0 -120 Q 230 -120 230 -10 L 230 120 Z" fill="#b08a5a" stroke="#6a4a2a" strokeWidth={8} />
    {[-160, -80, 0, 80, 160].map((xx) => <line key={xx} x1={xx} y1={-110} x2={xx} y2={120} stroke="#8a6a3a" strokeWidth={6} />)}
    {[-60, 20].map((y) => <path key={y} d={`M -228 ${y} Q 0 ${y - 20} 228 ${y}`} stroke="#8a6a3a" strokeWidth={6} fill="none" />)}
    <rect x={-40} y={40} width={80} height={80} rx={30} fill="#3a2416" />
    {[0, 1].map((i) => { const k = (t * 0.3 + i / 2) % 1; return <circle key={i} cx={20 + k * 40} cy={-120 - k * 160} r={14 + k * 30} fill="#d8d0c8" opacity={0.5 * (1 - k)} />; })}
  </O>
);

export const Base: React.FC<{ t: number }> = ({ t }) => {
  const f = fuerteEstado(t);
  return (
    <>
      {/* Londres: calle de casas Tudor */}
      {[400, 760, 1120, 1480, 1840, 2200, 2560, 2920, 3280, 3640, 4000, 4360, 4720, 5080].map((x, i) => (
        <En key={x} x={x} w={300}>
          <CasaTudor x={x} y={SUELO - (i % 3 === 0 ? 4 : 3) * 65 - 130} pisos={i % 3 === 0 ? 4 : 3} tono={["#f4e6c4", "#f0d8b0", "#e8e0c8", "#f8eed8"][i % 4]} tt={t + i} s={1} />
        </En>
      ))}
      {/* muelle del Támesis */}
      <En x={6200} w={1200}>
        <svg style={{ position: "absolute", left: 5500, top: SUELO - 30, overflow: "visible" }} width={1400} height={300}>
          <rect x={0} y={0} width={1100} height={34} fill="#8a5a2a" stroke="#4e2a12" strokeWidth={6} />
          {Array.from({ length: 12 }, (_, i) => <rect key={i} x={20 + i * 92} y={30} width={24} height={240} fill="#6a3a1a" />)}
        </svg>
      </En>
      {/* arena de la playa de la isla */}
      <En x={23100} w={600}>
        <svg style={{ position: "absolute", left: 22760, top: SUELO - 6, overflow: "visible" }} width={800} height={200}>
          <path d="M 0 30 Q 200 0 800 10 L 800 200 L 0 200 Z" fill="#e8d090" />
        </svg>
      </En>
      <Vegetacion t={t} />
      {/* árboles altos de la isla (los barcos se amarran a ellos) */}
      {[[23360, 1.35], [23560, 1.6], [23780, 1.3]].map(([x, k]) => <En key={x} x={x} w={300}><Pino x={x} y={SUELO - 190 * k} s={k} color={x === 23560 ? "#2a7a44" : "#1f6a3a"} /></En>)}
      {/* el pantano detrás del fuerte y el ciprés calvo viejo (el de los anillos) */}
      <En x={25800} w={800}><Pantano t={t} x={25420} y={SUELO - 34} w={760} /></En>
      <En x={25960} w={500}><Cipres x={25960} y={SUELO - 360} s={1.2} /></En>
      {/* la flota de 1606-07 */}
      {t > 52.2 && t < 345 && [0, 1, 2].filter((i) => t < 252 || i === 2).map((i) => { const x = flotaX(i, t); return <En key={i} x={x} w={500}><Nave x={x} y={AGUA - 130 * FLOTA_TAM[i]} t={t + i} tam={FLOTA_TAM[i]} vela={t > 132.8 && t < 227 ? 1 : 0.3} rolido={i === 0 && t > 183.5 && t < 203 ? 0.5 : 3} nombre={t > [129.9, 131.16, 132.26][i] && t < 136 ? ["SUSAN CONSTANT", "GODSPEED", "DISCOVERY"][i] : undefined} /></En>; })}
      {/* la curva del río */}
      <En x={20300} w={500}><Cabo x={20300} w={760} /></En>
      {/* el fuerte */}
      {f.arma > 0 && <En x={FX} w={900}><Fuerte x={FX} y={SUELO - 40} t={t} arma={f.arma} ruina={f.ruina} nieve={f.nieve} humo={!(t > 652 && t < 741)} /></En>}
      {/* pueblo Powhatan y sus campos de maíz */}
      {[27600, 28200, 28800].map((x, i) => <En key={x} x={x} w={400}><Yehakin x={x} t={t + i} s={i === 1 ? 1.15 : 0.95} /></En>)}
      <En x={29500} w={600}>
        <>{Array.from({ length: 10 }, (_, i) => <Choclo key={i} x={29200 + i * 70} y={SUELO - 100 - (i % 2) * 10} s={0.8} />)}</>
      </En>
      {/* arrecife de Bermudas */}
      <En x={13000} w={400}>
        <svg style={{ position: "absolute", left: 12800, top: AGUA - 10, overflow: "visible" }} width={400} height={80}>
          {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${i * 80} 40 l 30 -46 l 30 46 Z`} fill="#7a6a5a" />)}
        </svg>
      </En>
    </>
  );
};

// ── la flota de 1606-07 (Susan Constant, Godspeed, Discovery): x de cada barco según el segundo global
import { kx } from "./mundo";
export const FLOTA_TAM = [1.05, 0.85, 0.45];
const FK: number[][][] = [
  [[0, 6600], [132.8, 6600], [140.0, 8150], [155.5, 8450], [158.0, 9500], [162.8, 10200], [171.0, 15600], [176.0, 18800], [213.0, 19050], [227.0, 22300]],
  [[0, 7150], [132.8, 7150], [140.0, 8650], [155.5, 8900], [158.0, 9950], [162.8, 10650], [171.0, 16050], [176.0, 19200], [213.0, 19420], [227.0, 22000]],
  [[0, 7550], [132.8, 7550], [140.0, 9050], [155.5, 9250], [158.0, 10300], [162.8, 11000], [171.0, 16400], [176.0, 19500], [213.0, 19700], [227.0, 21700]],
];
export const flotaX = (i: number, t: number) => kx(FK[i], t);

// SETS DE CIUDAD EN CORTE (lc-b, Ep.3):
// · Subsuelo = una cuadra de Duluth con la calle ABIERTA en corte (piso SUB_PISO = la calzada). Arriba: fachadas,
//   postes con cables y autos quietos. Abajo: cables (690), gas (730), agua (790), cloaca grande (900) y la estación
//   de bombeo de la cloaca (SUB_PUNTOS.bombeo); el pozo de la tapa en SUB_PUNTOS.tapa. `luz` = {cable, gas, agua, cloaca}
//   0..1 (cada sistema se enciende cuando se nombra) · `flujo` · `sube` 0..1 (la cloaca que se tapa y sube por el pozo).
// · Cuesta = una calle empinada de la colina (Duluth: 20 % de pendiente). y del asfalto en x = cuestaY(x).
//   `grieta` 0..1 · `rio` 0..1 (deshielo que baja) · `hueco` 0..1 (falta el tramo 1500…1950).
import React from "react";
import { interpolate, random } from "remotion";
import { Halo } from "../../anikit/luz";
import { Cielo, SetProps, acl, mezclar, osc } from "../../anikit/sets/comun";
import { Auto, Banco, COLORES_AUTO, Edificio } from "../mundo/comun";
import { Hora, LUCES } from "../mundo/hora";

export const SUB_PISO = 640;
export const SUB_PUNTOS = { tapa: 1200, bombeo: 2700, caños: 900, poste: 600 };
export const SUB_Y = { cable: 690, gas: 730, agua: 790, cloaca: 900 };
type PS = SetProps & { hora?: Hora; luz?: { cable?: number; gas?: number; agua?: number; cloaca?: number }; flujo?: number; sube?: number; nieve?: number; luces?: number };

const Tubo: React.FC<{ y: number; g: number; color: string; on: number; f: number; flujo: number; x0?: number; x1?: number }> = ({ y, g, color, on, f, flujo, x0 = -800, x1 = 4200 }) => (
  <g>
    <rect x={x0} y={y - g / 2 - 5} width={x1 - x0} height={g + 10} rx={g / 2} fill="#2a2428" />
    <rect x={x0} y={y - g / 2} width={x1 - x0} height={g} rx={g / 2} fill={mezclar(osc(color, 0.45), color, on)} />
    {on > 0.05 && <rect x={x0} y={y - g / 2} width={x1 - x0} height={g} fill="none" stroke={acl(color, 0.55)} strokeWidth={Math.max(3, g * 0.18)} strokeDasharray="36 54" strokeDashoffset={-f * 5 * flujo} opacity={on} />}
    {on > 0.05 && <rect x={x0} y={y - g / 2 - 10} width={x1 - x0} height={g + 20} rx={g / 2 + 10} fill={color} opacity={0.18 * on} />}
  </g>
);

export const Subsuelo: React.FC<PS> = ({ capa, f, hora = "invierno", luz = {}, flujo = 1, sube = 0, nieve = 0.5, luces = 0 }) => {
  const L = LUCES[hora];
  const P = SUB_PISO;
  if (capa === "lejos") return <g><Cielo c={L.cielo} x={-2000} w={8000} /><Halo x={1400} y={L.solY} r={420} color={L.sol} fuerza={0.5} /></g>;
  if (capa === "frente") return <g />;
  const cols = ["#4a3442", "#3a3a4e", "#523a3a", "#3e4452", "#4c3a4c"];
  return (
    <g>
      {/* fachadas */}
      {Array.from({ length: 9 }).map((_, i) => <Edificio key={i} x={-700 + i * 540} y={P - 60} w={500} h={300 + random(`sb${i}`) * 260} color={mezclar(cols[i % 5], L.tinte, 0.25)} luces={luces} seed={`sb${i}`} techoNieve={nieve} />)}
      <rect x={-800} y={P - 64} width={5000} height={34} fill={mezclar("#6a6470", L.tinte, 0.2)} />
      {/* postes con cables */}
      {[600, 1800, 3000, 4200].map((x) => <rect key={x} x={x - 7} y={P - 520} width={14} height={490} fill="#3a2e2a" />)}
      {[0, 1, 2].map((k) => <path key={k} d={`M-800,${P - 490 + k * 18} Q0,${P - 440 + k * 18} 600,${P - 490 + k * 18} Q1200,${P - 440 + k * 18} 1800,${P - 490 + k * 18} Q2400,${P - 440 + k * 18} 3000,${P - 490 + k * 18} Q3600,${P - 440 + k * 18} 4200,${P - 490 + k * 18}`} stroke={mezclar("#1a1620", "#ffcf6e", luz.cable ?? 0)} strokeWidth={4 + 3 * (luz.cable ?? 0)} fill="none" />)}
      {/* calzada (en corte) */}
      <rect x={-800} y={P - 30} width={5000} height={24} fill="#2a2630" />
      {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-760 + i * 420} y={P - 20} width={160} height={6} fill="#c9b48a" opacity={0.6} />)}
      {[[-300, 0], [900, 3], [2200, 6], [3400, 2]].map(([x, c], i) => <Auto key={i} x={x} y={P - 30} color={COLORES_AUTO[c]} nieve={nieve} dir={i % 2 ? -1 : 1} />)}
      {nieve > 0 && <Banco x={-800} w={5000} piso={P - 64} alto={26 * nieve} color={L.nieve} seed="sbn" />}
      {/* tierra */}
      <rect x={-800} y={P - 6} width={5000} height={2000} fill="#4a362c" />
      {Array.from({ length: 80 }).map((_, i) => <circle key={i} cx={-800 + random(`sp${i}`) * 5000} cy={P + 20 + random(`sq${i}`) * 520} r={4 + random(`sr${i}`) * 8} fill="#3a2a22" />)}
      <rect x={-800} y={P - 6} width={5000} height={10} fill="#2e2420" />
      <Tubo y={SUB_Y.cable} g={14} color="#ffcf6e" on={luz.cable ?? 0} f={f} flujo={flujo} />
      <Tubo y={SUB_Y.gas} g={22} color="#f2c14a" on={luz.gas ?? 0} f={f} flujo={flujo} />
      <Tubo y={SUB_Y.agua} g={40} color="#5ab0ff" on={luz.agua ?? 0} f={f} flujo={flujo} />
      <Tubo y={SUB_Y.cloaca} g={92} color="#a0784a" on={luz.cloaca ?? 0} f={f} flujo={flujo * (1 - sube)} />
      {/* pozo de la tapa hasta la cloaca */}
      <rect x={SUB_PUNTOS.tapa - 50} y={P - 6} width={100} height={SUB_Y.cloaca - P} fill="#1e1a1e" />
      {Array.from({ length: 7 }).map((_, i) => <rect key={i} x={SUB_PUNTOS.tapa - 30} y={P + 20 + i * 34} width={60} height={6} fill="#5a5a60" />)}
      <rect x={SUB_PUNTOS.tapa - 70} y={P - 36} width={140} height={10} rx={4} fill="#5a5a60" />
      {sube > 0 && <rect x={SUB_PUNTOS.tapa - 48} y={SUB_Y.cloaca - (SUB_Y.cloaca - P + 20) * sube} width={96} height={(SUB_Y.cloaca - P + 20) * sube} fill="#7a5a32" opacity={0.95} />}
      {sube > 0 && Array.from({ length: 6 }).map((_, i) => <circle key={i} cx={SUB_PUNTOS.tapa - 30 + i * 12} cy={SUB_Y.cloaca - (SUB_Y.cloaca - P) * sube + 6 - ((f * 1.5 + i * 13) % 20)} r={4} fill="#a0784a" />)}
      {/* estación de bombeo de la cloaca */}
      <g>
        <rect x={SUB_PUNTOS.bombeo - 180} y={P + 140} width={360} height={360} fill="#3a3e48" stroke="#22242a" strokeWidth={10} />
        <circle cx={SUB_PUNTOS.bombeo} cy={P + 330} r={70} fill="#3a6a8a" />
        <rect x={SUB_PUNTOS.bombeo - 4} y={P + 270} width={8} height={60} fill="#8fd3ff" transform={`rotate(${f * 8 * (1 - sube)} ${SUB_PUNTOS.bombeo} ${P + 330})`} opacity={0.3 + 0.7 * (1 - sube)} />
        <rect x={SUB_PUNTOS.bombeo + 100} y={P + 170} width={50} height={30} fill={sube > 0.2 ? "#d8382c" : "#4ae08a"} />
        {sube > 0.2 && <Halo x={SUB_PUNTOS.bombeo + 125} y={P + 185} r={60} color="#d8382c" fuerza={0.5 * (0.5 + 0.5 * Math.sin(f / 4))} />}
      </g>
    </g>
  );
};

// ---------- CUESTA ----------
export const CUESTA_X0 = -600;
export const CUESTA_Y0 = 1080;
export const PENDIENTE = 0.36; // 20° aprox.
export const cuestaY = (x: number) => CUESTA_Y0 - (x - CUESTA_X0) * PENDIENTE;
type PC = SetProps & { hora?: Hora; grieta?: number; rio?: number; hueco?: number; nieve?: number };

export const Cuesta: React.FC<PC> = ({ capa, f, hora = "dia", grieta = 0, rio = 0, hueco = 0, nieve = 0 }) => {
  const L = LUCES[hora];
  if (capa === "lejos") {
    return (
      <g>
        <Cielo c={L.cielo} x={-2000} w={8000} />
        <Halo x={300} y={L.solY} r={420} color={L.sol} fuerza={0.55} />
        <rect x={-2000} y={760} width={8000} height={500} fill={L.lago[0]} />
      </g>
    );
  }
  if (capa === "frente") return <g />;
  const x0 = CUESTA_X0, x1 = 4200;
  const y = cuestaY;
  const cols = ["#6a4a3a", "#4a5a6a", "#7a6a4a", "#5a4a5a", "#3e5a4e"];
  const hx0 = 1500, hx1 = 1950;
  return (
    <g>
      {/* casas escalonadas sobre la cuesta */}
      {Array.from({ length: 10 }).map((_, i) => {
        const x = x0 + 100 + i * 460, b = y(x + 200) - 60;
        return (
          <g key={i}>
            <rect x={x} y={b - 300} width={380} height={300 + 140} fill={mezclar(cols[i % 5], L.tinte, 0.25)} />
            <path d={`M${x - 20},${b - 300} L${x + 190},${b - 420} L${x + 400},${b - 300} Z`} fill={osc(cols[i % 5], 0.6)} />
            {[0, 1].map((k) => <rect key={k} x={x + 60 + k * 170} y={b - 240} width={90} height={110} fill={mezclar("#2a3040", L.tinte, 0.3)} />)}
          </g>
        );
      })}
      {/* vereda y asfalto */}
      <path d={`M${x0},${y(x0) - 60} L${x1},${y(x1) - 60} L${x1},${y(x1) + 900} L${x0},${y(x0) + 900} Z`} fill="#4a362c" />
      <path d={`M${x0},${y(x0) - 60} L${x1},${y(x1) - 60} L${x1},${y(x1) - 20} L${x0},${y(x0) - 20} Z`} fill={mezclar("#8a8490", L.tinte, 0.2)} />
      <path d={`M${x0},${y(x0) - 20} L${x1},${y(x1) - 20} L${x1},${y(x1) + 40} L${x0},${y(x0) + 40} Z`} fill="#2a2630" />
      {Array.from({ length: 12 }).map((_, i) => { const xa = x0 + 80 + i * 400; return <path key={i} d={`M${xa},${y(xa) + 10} L${xa + 160},${y(xa + 160) + 10}`} stroke="#c9b48a" strokeWidth={6} opacity={0.6} />; })}
      {nieve > 0 && <path d={`M${x0},${y(x0) - 60} L${x1},${y(x1) - 60} L${x1},${y(x1) - 80 * nieve} L${x0},${y(x0) - 80 * nieve} Z`} fill={L.nieve} />}
      {/* autos estacionados en la pendiente */}
      {[[200, 1], [1100, 4], [2500, 7]].map(([x, c], i) => <g key={i} transform={`rotate(${-Math.atan(PENDIENTE) * 180 / Math.PI} ${x} ${y(x) - 20})`}><Auto x={x} y={y(x) - 20} color={COLORES_AUTO[c]} nieve={nieve} /></g>)}
      {/* grieta que crece */}
      {grieta > 0 && <path d={`M${hx0 - 300},${y(hx0 - 300) + 8} l60,6 l40,-8 l70,10 l50,-6 l80,12 l60,-4 l90,8 l70,-6`} stroke="#120f14" strokeWidth={7} fill="none" strokeDasharray="900" strokeDashoffset={900 * (1 - grieta)} transform={`rotate(${-Math.atan(PENDIENTE) * 180 / Math.PI} ${hx0 - 300} ${y(hx0 - 300)})`} />}
      {/* deshielo: agua que baja por la calzada */}
      {rio > 0 && Array.from({ length: 30 }).map((_, i) => {
        const t = ((f * 0.012 + i / 30) % 1);
        const x = x1 - t * (x1 - x0);
        return <path key={i} d={`M${x},${y(x) + 4} L${x - 140},${y(x - 140) + 4}`} stroke="#9fc8e8" strokeWidth={10} strokeLinecap="round" opacity={rio * 0.75} />;
      })}
      {rio > 0 && <path d={`M${x0},${y(x0) - 10} L${x1},${y(x1) - 10} L${x1},${y(x1) + 20} L${x0},${y(x0) + 20} Z`} fill="#6a9ac0" opacity={rio * 0.45} />}
      {/* el tramo que falta */}
      {hueco > 0 && (
        <g opacity={hueco}>
          <path d={`M${hx0},${y(hx0) - 64} L${hx1},${y(hx1) - 64} L${hx1 - 30},${y(hx1) + 240} Q${(hx0 + hx1) / 2},${y((hx0 + hx1) / 2) + 330} ${hx0 + 30},${y(hx0) + 240} Z`} fill="#1e1614" />
          <path d={`M${hx0 + 30},${y(hx0) + 200} Q${(hx0 + hx1) / 2},${y((hx0 + hx1) / 2) + 290} ${hx1 - 30},${y(hx1) + 200}`} stroke="#6a9ac0" strokeWidth={24} fill="none" opacity={0.8} />
          {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={hx0 + 20 + i * 52} y={y(hx0 + i * 52) + 60 + random(`hc${i}`) * 120} width={30} height={20} fill="#2a2630" transform={`rotate(${random(`hr${i}`) * 60} ${hx0 + i * 52} ${y(hx0 + i * 52) + 100})`} />)}
        </g>
      )}
    </g>
  );
};

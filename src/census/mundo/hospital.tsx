// SETS DEL HOSPITAL ST. MARY'S (Essentia Health, E 2nd St):
// · StMarys = la fachada de cerca (piso SM_PISO): torre de 8 pisos con la ventana del 4º piso (`ventana` 0..1, la que
//   June prende y apaga), la marquesina EMERGENCY y la calle.
// · Lobby = adentro (piso LOBBY_PISO): puertas de vidrio (x 250), pizarra blanca junto a la puerta (x 620, `pizarra`),
//   mostrador (1150), escalera que sube al descanso (LOBBY_DESCANSO, donde espera June) y el pasillo de guardia con camas
//   vacías y monitores que siguen pitando (2700…3800). Lo reusa el Ep.5 (quirófano, lc-c).
import React from "react";
import { random } from "remotion";
import { Charco, Halo, LamparaColgante } from "../../anikit/luz";
import { Cielo, SetProps, acl, osc } from "../../anikit/sets/comun";
import { F_MANO } from "../../anikit/pantalla";
import { AMBAR } from "../elenco";
import { Auto, Banco, Estrellas, Farola, NieveCae, prendida } from "./comun";
import { Hora, LUCES } from "./hora";

export const SM_PISO = 900;
export const SM_PUNTOS = { puerta: 900, torre: 1100, ventana: { x: 1215, y: 330 } };
export const LOBBY_PISO = 900;
export const LOBBY_DESCANSO = { x: 2250, y: 900 - 380 };
export const LOBBY_PUNTOS = { puerta: 250, pizarra: 620, mostrador: 1150, escalera: 1700, descanso: 2250, guardia: 3200 };

type PE = SetProps & { hora?: Hora; luces?: number; ventana?: number; nieve?: number; cae?: boolean };

export const StMarys: React.FC<PE> = ({ capa, f, pal, hora = "noche", luces = 1, ventana = 0, nieve = 0, cae = false }) => {
  const L = LUCES[hora];
  const P = SM_PISO;
  if (capa === "lejos") return <g><Cielo c={L.cielo} /><Estrellas f={f} o={L.estrellas} /><path d="M-2000,700 L6000,640 L6000,1200 L-2000,1200 Z" fill={osc(L.tinte, 0.5)} /></g>;
  if (capa === "frente") return <g>{cae && <NieveCae f={f} n={140} x0={-800} w={4400} y0={-1500} h={2600} />}<Auto x={300} y={P + 180} color="#2f4a5e" s={1.2} nieve={nieve} /><Auto x={1700} y={P + 190} color="#8a8a92" tipo="suv" s={1.2} dir={-1} nieve={nieve} /></g>;
  const X = 500, W = 1300, pisos = 9, ph = 150;
  return (
    <g>
      <rect x={X} y={P - pisos * ph - 60} width={W} height={pisos * ph + 60} fill="#4a3a52" />
      <rect x={X} y={P - pisos * ph - 60} width={W} height={20} fill="#3a2c42" />
      {nieve > 0 && <rect x={X - 10} y={P - pisos * ph - 72} width={W + 20} height={14} rx={6} fill={L.nieve} opacity={nieve} />}
      <text x={X + W / 2} y={P - pisos * ph - 90} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={64} letterSpacing={6} fill={luces > 0.3 ? "#ffffff" : "#5a5060"}>ST. MARY'S</text>
      {Array.from({ length: pisos }).map((_, r) => Array.from({ length: 8 }).map((__, c) => {
        const piso4 = r === pisos - 4 && c === 4;
        const lit = piso4 ? ventana : prendida(`sm${r}${c}`, luces, 0.5) ? 0.85 : 0;
        const wx = X + 70 + c * 150, wy = P - pisos * ph - 20 + r * ph;
        if (r === pisos - 1) return null;
        return <g key={`${r}${c}`}><rect x={wx} y={wy} width={90} height={100} fill={lit > 0.05 ? (piso4 ? "#fff1b8" : AMBAR) : "#251d2c"} opacity={lit > 0.05 ? 0.5 + 0.5 * lit : 1} />{piso4 && lit > 0.05 && <Halo x={wx + 45} y={wy + 50} r={240} color={AMBAR} fuerza={0.95 * lit} />}</g>;
      }))}
      {/* entrada de guardia */}
      <rect x={X + 300} y={P - 240} width={700} height={30} fill="#c0352c" />
      <text x={X + 650} y={P - 216} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={26} letterSpacing={6} fill="#ffffff">EMERGENCY</text>
      <rect x={X + 450} y={P - 200} width={400} height={200} fill={luces > 0.3 ? "#cfe6ee" : "#1e2230"} opacity={0.9} />
      <rect x={X + 648} y={P - 200} width={4} height={200} fill="#3a2c42" />
      {luces > 0.3 && <Charco x={X + 650} y={P + 10} rx={300} color="#e6f4ff" fuerza={0.35} />}
      <rect x={-1500} y={P} width={6000} height={1300} fill={nieve > 0.2 ? L.nieve : osc(pal.vereda, 0.8)} />
      <Farola x={300} piso={P} on={luces} />
      <Banco x={-1500} w={6000} piso={P + 20} alto={40 * nieve} color={L.nieve} seed="sm" />
    </g>
  );
};

type PL = SetProps & { luces?: number; pizarra?: string; trazo?: number; afuera?: Hora; monitores?: boolean };

export const Lobby: React.FC<PL> = ({ capa, f, pal, luces = 1, pizarra = "", trazo = 1, afuera = "noche", monitores = true }) => {
  const P = LOBBY_PISO;
  const L = LUCES[afuera];
  const pared = luces > 0.3 ? "#cdd6d8" : "#4a5058";
  const D = LOBBY_DESCANSO;
  if (capa === "lejos") return <g><rect x={-2000} y={-800} width={8000} height={2400} fill={osc(pared, 0.6)} /></g>;
  if (capa === "frente") return null;
  const n = Math.floor(pizarra.length * Math.min(1, trazo));
  return (
    <g>
      <rect x={-800} y={-300} width={5000} height={P + 300} fill={pared} />
      <rect x={-800} y={P - 120} width={5000} height={120} fill={osc(pared, 0.85)} />
      <rect x={-1500} y={P} width={6000} height={1400} fill={luces > 0.3 ? "#9aa6aa" : "#2c3036"} />
      {/* puertas de vidrio con la noche afuera */}
      <rect x={60} y={P - 420} width={380} height={420} fill={L.cielo[0]} />
      <rect x={60} y={P - 120} width={380} height={120} fill={L.nieve} opacity={0.4} />
      <rect x={60} y={P - 420} width={380} height={420} fill="none" stroke="#3a4048" strokeWidth={14} />
      <rect x={244} y={P - 420} width={12} height={420} fill="#3a4048" />
      {/* pizarra blanca */}
      <rect x={480} y={P - 520} width={300} height={220} rx={6} fill="#f6f6f2" stroke="#8a9094" strokeWidth={8} />
      <text x={630} y={P - 450} textAnchor="middle" fontFamily={F_MANO} fontWeight={700} fontSize={46} fill="#1d3a8a">{pizarra.slice(0, n).split("\n")[0]}</text>
      {pizarra.split("\n")[1] && <text x={630} y={P - 380} textAnchor="middle" fontFamily={F_MANO} fontWeight={700} fontSize={46} fill="#1d3a8a">{pizarra.slice(0, n).split("\n")[1] ?? ""}</text>}
      {/* mostrador */}
      <rect x={950} y={P - 150} width={420} height={150} rx={8} fill="#7a8a96" />
      <rect x={940} y={P - 160} width={440} height={18} rx={6} fill="#5a6874" />
      <rect x={1050} y={P - 230} width={90} height={70} rx={4} fill="#1d2228" /><rect x={1058} y={P - 222} width={74} height={50} fill={luces > 0.3 ? "#6ae0c0" : "#1d2228"} />
      {luces > 0.3 && <LamparaColgante x={1160} y={-80} piso={P} f={f} />}
      {/* escalera al descanso */}
      {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={1500 + i * 52} y={P - (i + 1) * 31.7} width={56} height={(i + 1) * 31.7} fill={i % 2 ? "#8a949a" : "#949ea4"} />)}
      <rect x={D.x - 140} y={D.y} width={700} height={P - D.y} fill="#8a949a" />
      <path d={`M1500,${P - 90} L${D.x - 140},${D.y - 90} L${D.x + 560},${D.y - 90}`} stroke="#3a4048" strokeWidth={8} fill="none" />
      {/* extintor en la pared del descanso */}
      <rect x={D.x + 300} y={D.y - 160} width={34} height={80} rx={10} fill="#c0352c" />
      {/* pasillo de guardia: camas vacías y monitores que pitan */}
      {[2900, 3350, 3800].map((x, i) => (
        <g key={x}>
          <path d={`M${x - 200},${P - 560} L${x - 200},${P - 60}`} stroke="#9ab0b8" strokeWidth={4} />
          <path d={`M${x - 200},${P - 560} Q${x - 180},${P - 300} ${x - 210},${P - 70} L${x - 140},${P - 70} Q${x - 120},${P - 300} ${x - 140},${P - 560} Z`} fill="#7fb0b4" opacity={0.8} />
          <rect x={x - 120} y={P - 170} width={260} height={40} rx={10} fill="#f2f0ea" />
          <rect x={x - 130} y={P - 130} width={280} height={14} fill="#7a8a96" />
          <rect x={x - 120} y={P - 116} width={10} height={116} fill="#5a6874" /><rect x={x + 130} y={P - 116} width={10} height={116} fill="#5a6874" />
          <path d={`M${x - 110},${P - 172} Q${x - 80},${P - 200} ${x - 40},${P - 172} Z`} fill="#ffffff" />
          <rect x={x + 160} y={P - 400} width={110} height={80} rx={6} fill="#1d2228" />
          {monitores && <path d={`M${x + 168},${P - 360} ${Array.from({ length: 20 }).map((_, k) => `L${x + 168 + k * 5},${P - 360 - (((k + Math.floor(f / 2) + i * 5) % 20) === 6 ? 26 : ((k + Math.floor(f / 2) + i * 5) % 20) === 7 ? -14 : 0)}`).join(" ")}`} stroke="#6aff9a" strokeWidth={3} fill="none" />}
        </g>
      ))}
      <Halo x={3350} y={P - 500} r={900} color="#e6f4ff" fuerza={luces > 0.3 ? 0.25 : 0.05} />
    </g>
  );
};

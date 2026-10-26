// SET · EL CUARTO DE LEO (monoambiente en Wilson Avenue, Uptown): colchón en el piso, cajas de pizza apiladas, el bolso
// térmico de delivery, escritorio con dibujos sin terminar pegados en la pared, ventana a la calle con la vía elevada y
// nieve, cajón de verdulería como mesa de luz, y la puerta (por donde entra la luz cálida de Tenzo en la miniatura).
// Piso: CTO_PISO. x útil: -300 … 3200. Puntos en CTO_PUNTOS.
// setProps: luzPuerta 0..1 (la puerta abierta con luz cálida), lampara (velador del escritorio), nieve, tren.
import React from "react";
import { random } from "remotion";
import { Charco, Halo } from "../../anikit/luz";
import { SetProps } from "../../anikit/sets/comun";
import { ORO, FRIO } from "../elenco";
import { Nieve, Skyline, TrenElevado, ViaElevada } from "./chicago";

export const CTO_PISO = 900;
export const CTO_PUNTOS = { puerta: 200, cajas: 640, colchon: 1180, cabecera: 930, almohada: 960, cajon: 820, bolso: 1620, escritorio: 2180, dibujos: 2180, ventana: 2780, silla: 2120 };
export const COLCHON_ALTO = 46; // alto del colchón (asiento ≈ 46; acostado: cadera a 30)

export const Cuarto: React.FC<SetProps & { luzPuerta?: number; lampara?: boolean; nieve?: boolean; tren?: number }> = ({ capa, f, luzPuerta = 0, lampara = false, nieve = true, tren = -1 }) => {
  const P = CTO_PISO;
  const W = { x: 2560, y: 160, w: 440, h: 460 };
  if (capa === "lejos") {
    return (
      <g>
        <rect x={W.x - 500} y={-200} width={W.w + 1000} height={1200} fill="#0e121a" />
        <Skyline x0={W.x - 400} w={W.w + 800} piso={760} f={f} seed={21} />
        <ViaElevada x0={W.x - 500} w={W.w + 1000} y={330} columnas={false} />
        {tren >= 0 && <TrenElevado x0={W.x - 500} w={W.w + 1000} y={330} f={f - tren} vel={22} />}
        {nieve && <Nieve f={f} x0={W.x - 300} w={W.w + 600} y0={-100} h={900} n={60} seed={3} />}
      </g>
    );
  }
  if (capa === "frente") return null;
  return (
    <g>
      {/* paredes con hueco de ventana */}
      <defs><clipPath id="ctpared"><path clipRule="evenodd" d={`M-800,-600 H4200 V${P} H-800 Z M${W.x},${W.y} V${W.y + W.h} H${W.x + W.w} V${W.y} Z`} /></clipPath></defs>
      <g clipPath="url(#ctpared)">
        <rect x={-800} y={-600} width={5000} height={P + 600} fill="#242830" />
        {Array.from({ length: 40 }).map((_, i) => <rect key={i} x={-800 + i * 130} y={-600} width={3} height={P + 600} fill="#21252c" />)}
        <rect x={-800} y={P - 40} width={5000} height={40} fill="#1c1f25" />
        {/* manchas de humedad */}
        <ellipse cx={1500} cy={60} rx={120} ry={60} fill="#20232a" />
        {/* dibujos sin terminar pegados con cinta encima del escritorio */}
        {[[1980, 180, -4], [2140, 150, 3], [2300, 200, -2], [2060, 340, 2], [2240, 360, -5]].map(([x, y, r], k) => (
          <g key={k} transform={`rotate(${r} ${x} ${y})`}>
            <rect x={x - 70} y={y - 52} width={140} height={104} fill="#e6e2d8" />
            <rect x={x - 20} y={y - 62} width={40} height={14} fill="#d8d0b8" opacity={0.8} />
            {/* trazos de lápiz: caras, una bici, un edificio a medio hacer */}
            {k === 0 && <><circle cx={x - 10} cy={y - 6} r={26} fill="none" stroke="#4a4a50" strokeWidth={2.5} /><path d={`M${x - 20},${y - 10} l6,0 M${x + 2},${y - 10} l6,0 M${x - 18},${y + 8} q8,6 16,0`} stroke="#4a4a50" strokeWidth={2.5} /></>}
            {k === 1 && <><circle cx={x - 30} cy={y + 20} r={18} fill="none" stroke="#4a4a50" strokeWidth={2.5} /><circle cx={x + 30} cy={y + 20} r={18} fill="none" stroke="#4a4a50" strokeWidth={2.5} /><path d={`M${x - 30},${y + 20} L${x - 6},${y - 12} L${x + 22},${y - 12} L${x + 30},${y + 20}`} stroke="#4a4a50" strokeWidth={2.5} fill="none" /></>}
            {k === 2 && <><path d={`M${x - 40},${y + 40} L${x - 40},${y - 30} L${x},${y - 30} L${x},${y + 40} M${x + 10},${y + 40} L${x + 10},${y}`} stroke="#4a4a50" strokeWidth={2.5} fill="none" /><path d={`M${x + 10},${y} L${x + 40},${y}`} stroke="#4a4a50" strokeWidth={2.5} strokeDasharray="6 6" /></>}
            {k === 3 && <path d={`M${x - 50},${y + 20} Q${x - 20},${y - 30} ${x + 10},${y + 10} T${x + 50},${y - 10}`} stroke="#4a4a50" strokeWidth={2.5} fill="none" />}
            {k === 4 && <><path d={`M${x - 30},${y + 30} L${x},${y - 30} L${x + 30},${y + 30} Z`} stroke="#4a4a50" strokeWidth={2.5} fill="none" /><text x={x} y={y + 46} fontSize={13} textAnchor="middle" fill="#6a6a70" fontFamily="sans-serif">???</text></>}
          </g>
        ))}
        {/* luz de la calle que entra por la ventana (fría) */}
        <path d={`M${W.x},${W.y + W.h} L${W.x + W.w},${W.y + W.h} L${W.x + W.w - 300},${P} L${W.x - 520},${P} Z`} fill={FRIO} opacity={0.06} />
      </g>
      {/* ventana: marco, travesaño, persiana a medio bajar */}
      <rect x={W.x - 14} y={W.y - 14} width={W.w + 28} height={W.h + 28} fill="none" stroke="#3a3f48" strokeWidth={24} />
      <rect x={W.x + W.w / 2 - 6} y={W.y} width={12} height={W.h} fill="#3a3f48" />
      <rect x={W.x} y={W.y} width={W.w} height={120} fill="#c9c4b8" />
      {Array.from({ length: 6 }).map((_, k) => <rect key={k} x={W.x} y={W.y + 18 + k * 18} width={W.w} height={3} fill="#a9a498" />)}
      <rect x={W.x - 30} y={W.y + W.h + 12} width={W.w + 60} height={16} fill="#3a3f48" />
      <Halo x={W.x + W.w / 2} y={W.y + W.h / 2} r={520} color="#6f86b0" fuerza={0.12} />
      {/* puerta (se abre con luz cálida) */}
      <g>
        <rect x={CTO_PUNTOS.puerta - 120} y={P - 600} width={240} height={600} fill={luzPuerta > 0 ? "#e9b062" : "#2e333c"} />
        {luzPuerta > 0 && <Halo x={CTO_PUNTOS.puerta} y={P - 300} r={700} color={ORO} fuerza={0.5 * luzPuerta} />}
        {luzPuerta > 0 && <path d={`M${CTO_PUNTOS.puerta - 120},${P} L${CTO_PUNTOS.puerta + 120},${P} L${CTO_PUNTOS.puerta + 520},${P + 120} L${CTO_PUNTOS.puerta - 60},${P + 120} Z`} fill={ORO} opacity={0.22 * luzPuerta} />}
        <rect x={CTO_PUNTOS.puerta - 132} y={P - 612} width={264} height={612} fill="none" stroke="#3e434c" strokeWidth={14} />
        <path d={`M${CTO_PUNTOS.puerta - 120},${P - 600} L${CTO_PUNTOS.puerta - 120 - 120 * luzPuerta},${P - 640} L${CTO_PUNTOS.puerta - 120 - 120 * luzPuerta},${P + 30} L${CTO_PUNTOS.puerta - 120},${P}`} fill="#353a43" opacity={luzPuerta > 0 ? 1 : 0} />
        <circle cx={CTO_PUNTOS.puerta + 90} cy={P - 300} r={9} fill="#9aa3ad" opacity={luzPuerta > 0 ? 0 : 1} />
      </g>
      {/* piso de madera gastada */}
      <rect x={-800} y={P} width={5000} height={900} fill="#2a2620" />
      {Array.from({ length: 10 }).map((_, i) => <rect key={i} x={-800} y={P + 10 + i * 24} width={5000} height={2} fill="#221e19" />)}
      {/* cajas de pizza apiladas */}
      <g transform={`translate(${CTO_PUNTOS.cajas},0)`}>
        {Array.from({ length: 6 }).map((_, k) => <g key={k} transform={`rotate(${(random(`pz${k}`) - 0.5) * 6} 0 ${P - k * 26})`}><rect x={-110 + (k % 2) * 8} y={P - 26 - k * 26} width={220} height={24} rx={2} fill={k % 2 ? "#cdbfa2" : "#d9ccb0"} /><rect x={-40 + (k % 2) * 8} y={P - 20 - k * 26} width={80} height={10} fill="#b8483a" opacity={0.6} /></g>)}
        <rect x={130} y={P - 22} width={200} height={22} rx={2} fill="#cdbfa2" transform={`rotate(8 230 ${P})`} />
      </g>
      {/* cajón de verdulería como mesa de luz */}
      <g transform={`translate(${CTO_PUNTOS.cajon},0)`}>
        <rect x={-60} y={P - 90} width={120} height={90} fill="#7a6248" />
        {[0, 1, 2].map((k) => <rect key={k} x={-60} y={P - 84 + k * 30} width={120} height={6} fill="#5a4634" />)}
      </g>
      {/* colchón en el piso con sábana revuelta y almohada */}
      <g>
        <rect x={CTO_PUNTOS.colchon - 330} y={P - COLCHON_ALTO} width={660} height={COLCHON_ALTO} rx={14} fill="#5d6470" />
        <path d={`M${CTO_PUNTOS.colchon - 300},${P - COLCHON_ALTO + 4} Q${CTO_PUNTOS.colchon - 100},${P - COLCHON_ALTO - 34} ${CTO_PUNTOS.colchon + 80},${P - COLCHON_ALTO - 10} Q${CTO_PUNTOS.colchon + 240},${P - COLCHON_ALTO - 30} ${CTO_PUNTOS.colchon + 330},${P - COLCHON_ALTO + 6} L${CTO_PUNTOS.colchon + 320},${P - 4} L${CTO_PUNTOS.colchon - 300},${P - 4} Z`} fill="#3c4250" />
        <rect x={CTO_PUNTOS.almohada - 90} y={P - COLCHON_ALTO - 36} width={170} height={44} rx={20} fill="#9aa1ad" />
      </g>
      {/* bolso térmico de delivery */}
      <g transform={`translate(${CTO_PUNTOS.bolso},0)`}>
        <rect x={-90} y={P - 190} width={180} height={190} rx={14} fill="#2a2e36" />
        <rect x={-90} y={P - 190} width={180} height={28} rx={10} fill="#353a44" />
        <rect x={-60} y={P - 120} width={120} height={40} rx={6} fill="#3e434e" />
        <path d={`M-70,${P - 190} Q0,${P - 250} 70,${P - 190}`} stroke="#1c1f25" strokeWidth={10} fill="none" />
      </g>
      {/* escritorio con velador, lápices, un cuaderno */}
      <g transform={`translate(${CTO_PUNTOS.escritorio},0)`}>
        <rect x={-260} y={P - 300} width={520} height={18} fill="#5a4a3a" />
        <rect x={-250} y={P - 282} width={16} height={282} fill="#4a3c2e" /><rect x={234} y={P - 282} width={16} height={282} fill="#4a3c2e" />
        <rect x={-120} y={P - 312} width={150} height={12} fill="#e6e2d8" transform={`rotate(-3 -45 ${P - 306})`} />
        {[0, 1, 2].map((k) => <rect key={k} x={60 + k * 10} y={P - 360} width={6} height={50} fill={["#c9a24a", "#4a5262", "#8a5a3a"][k]} transform={`rotate(${k * 8 - 8} ${63 + k * 10} ${P - 310})`} />)}
        <rect x={50} y={P - 330} width={44} height={30} rx={4} fill="#3a3f48" />
        <g>
          <path d={`M180,${P - 300} L190,${P - 420} L140,${P - 470}`} stroke="#3a3f48" strokeWidth={8} fill="none" />
          <path d={`M110,${P - 500} L170,${P - 450} L140,${P - 440} Z`} fill="#3a3f48" />
          {lampara && <><Halo x={150} y={P - 450} r={300} color="#e9e4d8" fuerza={0.4} /><Charco x={60} y={P - 300} rx={200} color="#e9e4d8" fuerza={0.35} /></>}
        </g>
      </g>
      {/* ropa tirada en el piso */}
      <path d={`M1700,${P} Q1760,${P - 30} 1830,${P - 8} Q1880,${P - 26} 1940,${P} Z`} fill="#3a3f4a" />
      <Charco x={1400} y={P + 60} rx={900} color={FRIO} fuerza={0.06} />
    </g>
  );
};

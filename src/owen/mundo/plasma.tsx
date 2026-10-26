// CENTRO DE PLASMA de Ashland (ob04, sesión B): sala larga con sillones reclinables, máquinas de aféresis
// (la sangre sale por un tubo rojo, vuelve sin el plasma; la bolsa amarilla se va llenando), ventana a la avenida,
// cartel «NEW DONORS EARN UP TO $70». Piso PLA_PISO. Puntos PLA_PUNTOS (sillon = x de cada sillón, recepcion).
// <Aferesis> se dibuja aparte (en `medio`) para animar la bolsa y el pulso del tubo con el donante sentado.
import React from "react";
import { random } from "remotion";
import { Charco, Halo } from "../../anikit/luz";
import { F_HUD } from "../../anikit/pantalla";
import { Planta, SetProps, osc } from "../../anikit/sets/comun";
import { Hora, LUCES } from "./hora";
import { ANCHO_LOTE, Lote } from "./calle";

export const PLA_PISO = 900;
export const PLA_PUNTOS = { recepcion: 380, puerta: 80, sillon: [1000, 1500, 2000, 2500], ventana: 3000, asiento: 92 };

// sillón reclinable (perfil mirando a la izquierda): respaldo inclinado, apoyabrazos
export const Sillon: React.FC<{ x: number; piso: number; color?: string; recl?: number }> = ({ x, piso, color = "#3d6fa6", recl = 1 }) => {
  const a = 18 + 14 * recl; // el respaldo se va hacia atrás (a la derecha: el donante mira a la izquierda)
  return (
    <g>
      <rect x={x - 70} y={piso - 30} width={140} height={30} rx={6} fill="#6a7078" />
      <rect x={x - 90} y={piso - 106} width={180} height={64} rx={22} fill={color} />
      <g transform={`translate(${x + 70},${piso - 90}) rotate(${a})`}><rect x={-30} y={-220} width={52} height={230} rx={24} fill={osc(color, 0.9)} /><rect x={-14} y={-260} width={46} height={50} rx={18} fill={osc(color, 1.08)} /></g>
      <g transform={`translate(${x - 92},${piso - 80}) rotate(28)`}><rect x={-120} y={-20} width={130} height={44} rx={18} fill={color} /></g>
      <rect x={x - 40} y={piso - 150} width={130} height={18} rx={9} fill="#cfd6dc" />
    </g>
  );
};

// la máquina de aféresis + tubos al brazo + bolsa de plasma. lleno 0..1, pulso = cuadro (la sangre corre por el tubo)
export const Aferesis: React.FC<{ x: number; piso: number; brazo: { x: number; y: number }; lleno?: number; f?: number; on?: boolean }> = ({ x, piso, brazo, lleno = 0, f = 0, on = true }) => {
  const mx = x + 170, top = piso - 470;
  const d = `M${mx - 40},${top + 210} C${mx - 120},${top + 260} ${brazo.x + 80},${brazo.y - 60} ${brazo.x},${brazo.y}`;
  const d2 = `M${mx - 40},${top + 240} C${mx - 140},${top + 300} ${brazo.x + 60},${brazo.y - 10} ${brazo.x + 4},${brazo.y + 6}`;
  return (
    <g>
      <rect x={mx - 60} y={top} width={120} height={470} rx={14} fill="#e9edf0" />
      <rect x={mx - 48} y={top + 20} width={96} height={70} rx={8} fill="#1d2a34" />
      {on && <><text x={mx} y={top + 50} fontFamily={F_HUD} fontWeight={600} fontSize={16} fill="#7dff6a" textAnchor="middle">CYCLE {1 + (Math.floor(f / 240) % 8)}/8</text><rect x={mx - 36} y={top + 62} width={72 * ((f % 240) / 240)} height={8} rx={4} fill="#7dff6a" /></>}
      <circle cx={mx} cy={top + 150} r={34} fill="#c9d2d8" stroke="#8a949c" strokeWidth={6} />
      <g transform={`rotate(${on ? f * 9 : 0} ${mx} ${top + 150})`}><rect x={mx - 4} y={top + 120} width={8} height={60} rx={4} fill="#6a747c" /></g>
      {/* bolsa de plasma (amarilla) colgada */}
      <rect x={mx + 60} y={top - 40} width={8} height={60} fill="#8a949c" />
      <g transform={`translate(${mx + 64},${top + 20})`}>
        <rect x={-38} y={0} width={76} height={110} rx={14} fill="#f4f1e6" opacity={0.85} stroke="#c9ccc4" strokeWidth={3} />
        <rect x={-34} y={106 - 100 * lleno} width={68} height={100 * lleno} rx={10} fill="#f2c94a" />
        <rect x={-30} y={106 - 100 * lleno} width={10} height={100 * lleno} rx={5} fill="#fff3b0" opacity={0.6} />
      </g>
      {/* tubos: rojo (sale) con glóbulos que corren, y el que vuelve */}
      <path d={d} stroke="#a3202a" strokeWidth={7} fill="none" />
      <path d={d2} stroke="#c9505a" strokeWidth={5} fill="none" opacity={0.8} />
      {on && <path d={d} stroke="#ff6a6a" strokeWidth={4} fill="none" strokeDasharray="8 26" strokeDashoffset={-f * 4} />}
      <circle cx={brazo.x} cy={brazo.y} r={9} fill="#f4f1ea" stroke="#9aa4ae" strokeWidth={3} />
    </g>
  );
};

export const Plasma: React.FC<SetProps & { hora?: Hora }> = ({ capa, f, hora = "ocaso" }) => {
  const L = LUCES[hora];
  const P = PLA_PISO;
  if (capa === "lejos") {
    // la avenida por el ventanal del fondo
    return (
      <g>
        <defs><linearGradient id="placielo" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={L.cielo[0]} /><stop offset="0.6" stopColor={L.cielo[1]} /><stop offset="1" stopColor={L.cielo[2]} /></linearGradient></defs>
        <rect x={-2000} y={-1400} width={7000} height={3200} fill="url(#placielo)" />
        {Array.from({ length: 10 }).map((_, i) => <Lote key={i} n={30 + i} piso={P - 40} hora={hora} f={f} esc={0.8} />)}
      </g>
    );
  }
  if (capa === "frente") return <g />;
  const muro = "#e6ece9";
  return (
    <g>
      <defs><clipPath id="plapared"><path clipRule="evenodd" d={`M-800,-600 H4200 V${P + 300} H-800 Z M2800,${P - 600} H3500 V${P - 140} H2800 Z`} /></clipPath></defs>
      <g clipPath="url(#plapared)">
        <rect x={-800} y={-600} width={5000} height={P + 900} fill={muro} />
        <rect x={-800} y={P - 300} width={5000} height={300} fill="#c9d6d2" />
        <rect x={-800} y={P - 304} width={5000} height={8} fill="#2f8f8a" />
        <Halo x={1700} y={200} r={1600} color="#f2fffa" fuerza={0.22} />
      </g>
      <rect x={2790} y={P - 610} width={720} height={480} fill="none" stroke="#9aa4a8" strokeWidth={16} />
      <rect x={3140} y={P - 600} width={12} height={460} fill="#9aa4a8" />
      {/* tubos de techo */}
      {Array.from({ length: 6 }).map((_, i) => <g key={i}><rect x={200 + i * 600} y={-40} width={300} height={14} rx={7} fill="#fbfff8" /><Halo x={350 + i * 600} y={-10} r={300} color="#eafff6" fuerza={0.3} /></g>)}
      {/* logo y cartel de pago */}
      <g transform="translate(1250,140)">
        <circle cx={-260} cy={0} r={46} fill="#c62a36" /><path d="M-260,-26 q22,30 0,52 q-22,-22 0,-52 Z" fill="#fff" />
        <text x={-196} y={16} fontFamily={F_HUD} fontWeight={600} fontSize={58} fill="#20343a" letterSpacing={4}>ASHLAND PLASMA</text>
      </g>
      <g transform="translate(560,290)">
        <rect x={0} y={0} width={420} height={170} rx={14} fill="#f2c94a" />
        <text x={210} y={56} fontFamily={F_HUD} fontWeight={600} fontSize={30} fill="#3a2a10" textAnchor="middle">NEW DONORS</text>
        <text x={210} y={128} fontFamily={F_HUD} fontWeight={600} fontSize={66} fill="#3a2a10" textAnchor="middle">EARN $70</text>
      </g>
      {/* recepción */}
      <rect x={PLA_PUNTOS.recepcion - 220} y={P - 230} width={440} height={230} rx={10} fill="#2f8f8a" />
      <rect x={PLA_PUNTOS.recepcion - 236} y={P - 246} width={472} height={24} rx={8} fill="#f4f1ea" />
      <rect x={PLA_PUNTOS.recepcion + 60} y={P - 330} width={120} height={84} rx={6} fill="#20262c" />
      <rect x={PLA_PUNTOS.recepcion + 66} y={P - 324} width={108} height={66} rx={4} fill="#5ac8c0" opacity={0.7} />
      <Planta x={-80} y={P} s={0.9} f={f} seed={4} />
      {/* sillones (el de Owen lo dibuja la escena con <Aferesis>; acá la fila entera) */}
      {PLA_PUNTOS.sillon.map((x, i) => <g key={i}><Sillon x={x} piso={P} color={["#3d6fa6", "#3d6fa6", "#4a7ab0", "#3d6fa6"][i]} /></g>)}
      {/* cortinas separadoras */}
      {[1250, 1750, 2250].map((x, i) => <g key={i}><rect x={x - 4} y={P - 560} width={8} height={560} fill="#9aa4a8" /><path d={`M${x},${P - 540} q20,180 0,360 q-20,90 0,160`} stroke="#bfe0dc" strokeWidth={30} fill="none" opacity={0.7} /></g>)}
      {/* piso */}
      <rect x={-800} y={P} width={5000} height={600} fill="#cfd6d8" />
      {Array.from({ length: 40 }).map((_, i) => <rect key={i} x={-800 + i * 130} y={P} width={3} height={600} fill="#b9c2c6" />)}
      <Charco x={1700} y={P + 40} rx={1500} ry={50} color="#eafff6" fuerza={0.2} />
      {random("pla") > 2 && null}
    </g>
  );
};

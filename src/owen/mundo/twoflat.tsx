// EL TWO-FLAT DE SOUTH PAULINA STREET (Pilsen). Dos sets:
// - <TwoFlatFuera>: la cuadra de ladrillo con el two-flat de Owen (escalinata, bay window, vecinos). Piso TF_PISO.
//   Puntos: TF_PUNTOS.puerta (puerta de entrada), .escalinata.
// - <TwoFlatCorte>: corte de casa de muñecas. ABAJO la cocina de Rosa (piso TF_PISO = 900), ARRIBA el depto de Owen
//   (piso TF_ARRIBA = 380): dormitorio + baño con espejo. La escalera de atrás une los dos (14 escalones, como en ob01).
import React from "react";
import { random } from "remotion";
import { Charco, Halo, LamparaColgante, Polvo } from "../../anikit/luz";
import { F_HUD, F_MANO } from "../../anikit/pantalla";
import { Ladrillos, Planta, SetProps, Ventana, acl, osc, mezclar } from "../../anikit/sets/comun";
import { Hora, LUCES } from "./hora";
import { FarolChi, SkylineChi } from "./calle";

export const TF_PISO = 900;
export const TF_ARRIBA = 380;
export const TF_PUNTOS = {
  // corte
  mesa: 620, cocina: 260, heladera: 1030, sillaRosa: 520, sillaOwen: 760, ventanaCocina: 380,
  cama: 330, baño: 1080, espejo: 1110, puertaBaño: 900,
  escaleraAbajo: 1440, escaleraArriba: 1888, pasilloArriba: 1960,
  // fuera
  puerta: 1180, escalinata: 1180,
};
export const ESCALONES = 14;
// posición de los pies en el escalón k (0 = piso de abajo, 14 = piso de arriba)
export const escalon = (k: number) => ({ x: TF_PUNTOS.escaleraAbajo + (k / ESCALONES) * (TF_PUNTOS.escaleraArriba - TF_PUNTOS.escaleraAbajo), y: TF_PISO - (k / ESCALONES) * (TF_PISO - TF_ARRIBA) });

const Radiador: React.FC<{ x: number; y: number; f: number; golpe?: boolean }> = ({ x, y, f, golpe }) => (
  <g transform={`translate(${x + (golpe ? Math.sin(f * 2.3) * 4 : 0)},${y})`}>
    {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={i * 18} y={-110} width={14} height={110} rx={7} fill="#c9c2b4" stroke="#9a9284" strokeWidth={2} />)}
    <rect x={-6} y={-8} width={170} height={8} fill="#9a9284" />
  </g>
);

export const TwoFlatCorte: React.FC<SetProps & { hora?: Hora; radiador?: (f: number) => boolean; luzBaño?: boolean; luzCocina?: boolean; luzDorm?: boolean }> = ({ capa, f, hora = "alba", radiador = () => false, luzBaño = true, luzCocina = true, luzDorm = false }) => {
  const L = LUCES[hora];
  const P = TF_PISO, A = TF_ARRIBA;
  if (capa === "lejos") {
    return (
      <g>
        <defs><linearGradient id="tfcielo" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={L.cielo[0]} /><stop offset="0.6" stopColor={L.cielo[1]} /><stop offset="1" stopColor={L.cielo[2]} /></linearGradient></defs>
        <rect x={-2000} y={-1400} width={6000} height={3200} fill="url(#tfcielo)" />
        <Halo x={1400} y={L.solY} r={420} color={L.sol} fuerza={0.6} />
        <SkylineChi x0={-200} piso={760} hora={hora} esc={0.8} />
        <rect x={-2000} y={TF_PISO - 40} width={6000} height={1400} fill={mezclar("#3a4a34", L.cielo[0], 0.3)} />
        {/* techos y two-flats del otro lado del patio */}
        {Array.from({ length: 9 }).map((_, i) => <g key={i}><rect x={-600 + i * 360} y={420 + (i % 3) * 30} width={330} height={800} fill={mezclar(["#7a3f34", "#9a4a36", "#6e4a3e"][i % 3], L.cielo[1], 0.35)} />{[0, 1].map((k) => <rect key={k} x={-560 + i * 360 + k * 150} y={480 + (i % 3) * 30} width={90} height={110} fill={random(`tfv${i}${k}`) < L.ventanas ? L.luz : "#2d3b44"} opacity={0.8} />)}</g>)}
      </g>
    );
  }
  if (capa === "frente") {
    return <g><Polvo x={0} y={A - 400} w={1400} h={900} n={26} f={f} seed={11} color={acl(L.luz, 0.3)} /></g>;
  }
  const muroC = "#e9d6b4", muroA = "#cfd8d2";
  return (
    <g>
      {/* ladrillo del corte (bordes del edificio) */}
      <rect x={-260} y={A - 560} width={2560} height={P - A + 640} fill="#8a4a36" />
      <Ladrillos x={-260} y={A - 560} w={2560} h={P - A + 640} color="#6a3426" o={0.5} />
      {/* ---- ABAJO: cocina de Rosa ---- */}
      <rect x={-200} y={A + 40} width={1400} height={P - A - 40} fill={muroC} />
      {Array.from({ length: 22 }).map((_, i) => <rect key={i} x={-200 + i * 64} y={A + 40} width={3} height={P - A - 40} fill={osc(muroC, 0.92)} />)}
      <rect x={-200} y={P - 200} width={1400} height={200} fill="#c9a77a" />
      <rect x={-200} y={P - 206} width={1400} height={8} fill="#8a6a44" />
      {luzCocina && <Halo x={600} y={P - 300} r={900} color="#ffd88a" fuerza={0.45} />}
      {/* ventana de la cocina al patio (deja ver la capa lejos) */}
      <rect x={TF_PUNTOS.ventanaCocina - 130} y={A + 110} width={260} height={210} fill={mezclar(L.cielo[2], "#ffffff", 0.2)} opacity={0.85} />
      <rect x={TF_PUNTOS.ventanaCocina - 140} y={A + 100} width={280} height={230} fill="none" stroke="#f4efe4" strokeWidth={14} />
      <rect x={TF_PUNTOS.ventanaCocina - 4} y={A + 100} width={8} height={230} fill="#f4efe4" />
      <path d={`M${TF_PUNTOS.ventanaCocina - 140},${A + 100} h110 q-40,120 -10,230 h-100 Z`} fill="#e86a5a" opacity={0.85} />
      <path d={`M${TF_PUNTOS.ventanaCocina + 140},${A + 100} h-110 q40,120 10,230 h100 Z`} fill="#e86a5a" opacity={0.85} />
      <Planta x={TF_PUNTOS.ventanaCocina - 60} y={A + 330} s={0.5} hoja="#4f9a5a" maceta="#d2662f" f={f} seed={3} />
      <Planta x={TF_PUNTOS.ventanaCocina + 70} y={A + 330} s={0.45} hoja="#6aaa4a" maceta="#e8b830" f={f} seed={5} />
      {/* cocina a gas con la cafetera y la olla */}
      <rect x={100} y={P - 260} width={200} height={260} rx={8} fill="#efe8da" />
      <rect x={100} y={P - 270} width={200} height={20} rx={4} fill="#2a2a2a" />
      <rect x={120} y={P - 200} width={160} height={110} rx={6} fill="#2a2a2a" opacity={0.85} />
      <path d={`M150,${P - 270} l14,-70 h40 l14,70 Z`} fill="#b0b6bc" />
      <rect x={160} y={P - 352} width={50} height={16} rx={4} fill="#3a3a3a" />
      {[0, 1, 2].map((k) => <path key={k} d={`M${172 + k * 12},${P - 360} q10,-24 0,-48 q-10,-24 4,-44`} stroke="#fff" strokeWidth={4} fill="none" opacity={0.3 + 0.2 * Math.sin(f / 8 + k)} />)}
      {/* alacena con platos y la Virgen de Guadalupe */}
      <rect x={-140} y={A + 90} width={220} height={260} fill="#a8754a" />
      {[0, 1, 2].map((r) => Array.from({ length: 4 }).map((_, k) => <circle key={`${r}${k}`} cx={-108 + k * 50} cy={A + 140 + r * 80} r={20} fill={["#f2efe8", "#2a5a9a", "#e7b240"][r]} />))}
      <rect x={560} y={A + 130} width={90} height={120} rx={6} fill="#2f6b4a" />
      <path d={`M605,${A + 150} q26,40 0,90 q-26,-50 0,-90 Z`} fill="#e7b240" />
      {/* calendario de pared y reloj */}
      <rect x={760} y={A + 120} width={110} height={140} fill="#f6f1e6" />
      <rect x={760} y={A + 120} width={110} height={30} fill="#c23a2e" />
      <text x={815} y={A + 210} fontFamily={F_HUD} fontWeight={600} fontSize={48} fill="#2a2420" textAnchor="middle">27</text>
      <g transform={`translate(1000,${A + 170})`}>
        <circle r={46} fill="#f4efe4" stroke="#8a5a36" strokeWidth={6} />
        <rect x={-2} y={-34} width={4} height={34} fill="#2a2420" transform={`rotate(${156 + f * 0.01})`} />
        <rect x={-2} y={-24} width={5} height={24} fill="#2a2420" transform={`rotate(${150 + f * 0.0008})`} />
      </g>
      {/* heladera vieja con imanes y la foto de Owen chico */}
      <rect x={TF_PUNTOS.heladera - 90} y={P - 470} width={180} height={470} rx={22} fill="#e6e0cc" />
      <rect x={TF_PUNTOS.heladera - 90} y={P - 330} width={180} height={6} fill="#c9c2ae" />
      <rect x={TF_PUNTOS.heladera + 64} y={P - 440} width={10} height={90} rx={5} fill="#b9b3a3" />
      <rect x={TF_PUNTOS.heladera - 50} y={P - 300} width={70} height={84} fill="#f8f5ee" transform={`rotate(-5 ${TF_PUNTOS.heladera} ${P - 260})`} />
      <circle cx={TF_PUNTOS.heladera - 16} cy={P - 266} r={16} fill="#141418" />
      {/* mesa con mantel de hule a cuadros */}
      <rect x={TF_PUNTOS.mesa - 190} y={P - 200} width={380} height={16} fill="#e86a5a" />
      {Array.from({ length: 10 }).map((_, i) => <rect key={i} x={TF_PUNTOS.mesa - 190 + i * 38} y={P - 200} width={19} height={16} fill="#f4efe4" opacity={0.8} />)}
      <path d={`M${TF_PUNTOS.mesa - 190},${P - 184} h380 l-14,46 h-352 Z`} fill="#e86a5a" opacity={0.9} />
      <rect x={TF_PUNTOS.mesa - 160} y={P - 140} width={12} height={140} fill="#6a4630" />
      <rect x={TF_PUNTOS.mesa + 150} y={P - 140} width={12} height={140} fill="#6a4630" />
      <rect x={TF_PUNTOS.mesa - 40} y={P - 232} width={80} height={32} rx={6} fill="#c9a36a" />
      {Array.from({ length: 5 }).map((_, i) => <ellipse key={i} cx={TF_PUNTOS.mesa - 28 + i * 14} cy={P - 236} rx={10} ry={5} fill="#e8b860" />)}
      {[TF_PUNTOS.sillaRosa - 40, TF_PUNTOS.sillaOwen + 40].map((x, i) => (
        <g key={i} transform={`translate(${x},${P}) scale(${i ? -1 : 1},1)`}>
          <rect x={-34} y={-62} width={72} height={10} rx={3} fill="#8a5a36" />
          <rect x={-32} y={-56} width={7} height={56} fill="#6a4630" /><rect x={27} y={-56} width={7} height={56} fill="#6a4630" />
          <rect x={-38} y={-180} width={9} height={124} rx={3} fill="#8a5a36" />
        </g>
      ))}
      <Radiador x={-160} y={P} f={f} golpe={radiador(f)} />
      <LamparaColgante x={TF_PUNTOS.mesa} y={A + 40} piso={P - 200} color="#ffd88a" pantalla="#e7b240" techo={A + 40} f={f} fuerza={luzCocina ? 0.7 : 0} />
      <rect x={-260} y={P} width={2560} height={420} fill="#5e5a54" />
      <rect x={-200} y={P} width={1400} height={400} fill="#8a6a44" />
      {Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M${-200 + i * 100},${P} l50,0 l-50,50 l-50,-50 Z`} fill={i % 2 ? "#a8754a" : "#6a4630"} opacity={0.5} />)}
      <Charco x={600} y={P + 30} rx={600} color="#ffd88a" fuerza={luzCocina ? 0.35 : 0} />

      {/* ---- entrepiso ---- */}
      <rect x={-260} y={A} width={2560} height={40} fill="#5a3a2a" />
      {/* ---- ARRIBA: depto de Owen ---- */}
      <rect x={-200} y={A - 470} width={1400} height={470} fill={muroA} />
      <rect x={-200} y={A - 6} width={1400} height={6} fill="#8a9690" />
      <Radiador x={-160} y={A} f={f} golpe={radiador(f)} />
      {radiador(f) && [0, 1].map((k) => <path key={k} d={`M${-150 + k * 140},${A - 120} l-14,-26 M${-140 + k * 140},${A - 124} l0,-30 M${-130 + k * 140},${A - 120} l14,-26`} stroke="#f4efe4" strokeWidth={5} strokeLinecap="round" opacity={0.5 + 0.5 * Math.sin(f * 1.7 + k)} />)}
      {/* dormitorio: cama deshecha, ropa en la silla, energizantes, el despertador */}
      <g>
        <rect x={TF_PUNTOS.cama - 230} y={A - 120} width={460} height={70} rx={10} fill="#3a4a6a" />
        <path d={`M${TF_PUNTOS.cama - 230},${A - 120} q120,-50 260,-10 q120,30 200,-6 v40 h-460 Z`} fill="#5a7ab0" />
        <rect x={TF_PUNTOS.cama - 250} y={A - 230} width={24} height={230} rx={8} fill="#6a4630" />
        <rect x={TF_PUNTOS.cama - 220} y={A - 150} width={90} height={36} rx={14} fill="#f2efe8" />
        <rect x={TF_PUNTOS.cama - 230} y={A - 50} width={460} height={50} fill="#4a3a2a" />
        <rect x={TF_PUNTOS.cama + 260} y={A - 110} width={90} height={110} fill="#6a4630" />
        <rect x={TF_PUNTOS.cama + 270} y={A - 136} width={44} height={26} rx={5} fill="#1d1f24" />
        <text x={TF_PUNTOS.cama + 292} y={A - 117} fontFamily={F_HUD} fontWeight={600} fontSize={16} fill="#ff4a3d" textAnchor="middle">5:12</text>
        {[0, 1, 2].map((k) => <g key={k} transform={`translate(${TF_PUNTOS.cama + 330 + k * 16},${A - 112}) rotate(${k === 2 ? 80 : 0})`}><rect x={-6} y={-26} width={12} height={26} rx={3} fill="#2fd16a" /><rect x={-6} y={-18} width={12} height={8} fill="#141418" /></g>)}
        <Ventana x={-120} y={A - 400} w={200} h={200} luz={L.luz} apagada={mezclar(L.cielo[1], "#2d3b44", 0.4)} prendida={L.ventanas < 0.5} marco="#f4efe4" cortina="#5a6a8a" f={f} />
      </g>
      {luzDorm && <Halo x={300} y={A - 250} r={500} color="#ffd88a" fuerza={0.35} />}
      {/* tabique y puerta del baño */}
      <rect x={TF_PUNTOS.puertaBaño - 12} y={A - 470} width={24} height={470} fill="#9aa6a0" />
      {/* baño: azulejo blanco, lavabo, espejo con luz arriba */}
      <rect x={TF_PUNTOS.puertaBaño + 12} y={A - 470} width={1200 - TF_PUNTOS.puertaBaño - 12} height={470} fill="#eef3f2" />
      {Array.from({ length: 6 }).map((_, r) => Array.from({ length: 6 }).map((__, c) => <rect key={`${r}${c}`} x={TF_PUNTOS.puertaBaño + 20 + c * 48} y={A - 220 + r * 36} width={44} height={32} fill="#dfe8e7" />))}
      <rect x={TF_PUNTOS.espejo - 80} y={A - 410} width={160} height={180} rx={10} fill="#aac6cf" stroke="#c9ced0" strokeWidth={10} />
      <path d={`M${TF_PUNTOS.espejo - 60},${A - 395} l40,0 l-60,80 z`} fill="#fff" opacity={0.3} />
      <rect x={TF_PUNTOS.espejo - 70} y={A - 438} width={140} height={14} rx={6} fill="#f6f2e8" />
      {luzBaño && <Halo x={TF_PUNTOS.espejo} y={A - 400} r={340} color="#fff2d8" fuerza={0.5} />}
      <path d={`M${TF_PUNTOS.espejo - 70},${A - 200} h140 l-20,40 h-100 Z`} fill="#f4f4f0" />
      <rect x={TF_PUNTOS.espejo - 8} y={A - 160} width={16} height={160} fill="#e4e4e0" />
      <rect x={-200} y={A - 500} width={1400} height={30} fill="#7a5a44" />
      {/* ---- escalera de atrás (14 escalones) ---- */}
      <rect x={1200} y={A - 470} width={1100} height={P - A + 470} fill="#d8c4a4" />
      <Halo x={1700} y={A - 250} r={500} color="#ffe8b8" fuerza={0.25} />
      <path d={`M${escalon(0).x},${P} ${Array.from({ length: ESCALONES }).map((_, k) => { const a = escalon(k), b = escalon(k + 1); return `L${a.x},${b.y} L${b.x},${b.y}`; }).join(" ")} L${escalon(ESCALONES).x},${P} Z`} fill="#8a5a36" />
      {Array.from({ length: ESCALONES }).map((_, k) => { const b = escalon(k + 1); return <rect key={k} x={escalon(k).x - 4} y={b.y} width={(TF_PUNTOS.escaleraArriba - TF_PUNTOS.escaleraAbajo) / ESCALONES + 8} height={7} fill="#a8754a" />; })}
      <path d={`M${escalon(0).x},${P - 150} L${escalon(ESCALONES).x},${A - 150}`} stroke="#5a3a2a" strokeWidth={10} />
      {Array.from({ length: 8 }).map((_, k) => { const a = escalon(k * 2); return <rect key={k} x={a.x} y={a.y - 150} width={6} height={150} fill="#5a3a2a" />; })}
      <rect x={TF_PUNTOS.escaleraArriba} y={A} width={420} height={40} fill="#5a3a2a" />
      {/* puerta del depto de arriba */}
      <rect x={2140} y={A - 300} width={120} height={300} fill="#6a4630" />
      <circle cx={2156} cy={A - 150} r={6} fill="#d9a441" />
      <rect x={-200} y={P} width={2600} height={8} fill="#5a3a2a" />
    </g>
  );
};

// la fachada de la cuadra de Paulina St: el two-flat de Owen y Rosa en el centro
export const TwoFlatFuera: React.FC<SetProps & { hora?: Hora; nieve?: boolean }> = ({ capa, f, hora = "alba" }) => {
  const L = LUCES[hora];
  const P = TF_PISO;
  if (capa === "lejos") {
    return (
      <g>
        <defs><linearGradient id="tffcielo" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={L.cielo[0]} /><stop offset="0.6" stopColor={L.cielo[1]} /><stop offset="1" stopColor={L.cielo[2]} /></linearGradient></defs>
        <rect x={-3000} y={-1400} width={8000} height={3200} fill="url(#tffcielo)" />
        <Halo x={1500} y={L.solY} r={520} color={L.sol} fuerza={0.7} />
        <SkylineChi x0={-400} piso={P - 160} hora={hora} esc={0.9} />
        <SkylineChi x0={1700} piso={P - 160} hora={hora} esc={0.75} />
      </g>
    );
  }
  if (capa === "frente") return <g><FarolChi x={-200} piso={P + 380} hora={hora} esc={1.2} /></g>;
  const casa = (x: number, col: string, seed: number, owen?: boolean) => (
    <g key={seed}>
      <rect x={x} y={P - 760} width={560} height={766} fill={col} />
      <Ladrillos x={x} y={P - 760} w={560} h={760} color={osc(col, 0.7)} o={0.45} />
      <rect x={x - 12} y={P - 790} width={584} height={36} fill={osc(col, 0.6)} />
      {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={x + 10 + i * 70} y={P - 754} width={30} height={20} fill={acl(col, 0.2)} />)}
      {/* bay window de 2 pisos */}
      <path d={`M${x + 40},${P - 140} v-560 h250 v560 Z`} fill={osc(col, 0.85)} />
      {[0, 1].map((r) => [0, 1, 2].map((c) => {
        const on = owen ? (r === 0 ? L.ventanas > 0.3 : L.ventanas > 0.6) : random(`tff${seed}${r}${c}`) < L.ventanas;
        return <g key={`${r}${c}`}>{on && <Halo x={x + 80 + c * 75} y={P - 600 + r * 260} r={130} color={L.luz} fuerza={0.3} />}<Ventana x={x + 55 + c * 75} y={P - 680 + r * 260} w={60} h={170} luz={L.luz} apagada="#2d3b44" prendida={on} marco="#efe8d8" f={f} /></g>;
      }))}
      {/* escalinata y puerta */}
      <rect x={x + 340} y={P - 640} width={150} height={170} fill="#2d3b44" />
      <rect x={x + 355} y={P - 340} width={120} height={200} fill="#5a2a22" />
      <rect x={x + 365} y={P - 330} width={100} height={70} fill={L.ventanas > 0.3 ? L.luz : "#3a4a54"} opacity={0.8} />
      <text x={x + 415} y={P - 355} fontFamily={F_HUD} fontWeight={600} fontSize={22} fill="#efe8d8" textAnchor="middle">{1800 + seed * 2}</text>
      {Array.from({ length: 6 }).map((_, k) => <rect key={k} x={x + 330 - k * 12} y={P - 140 + k * 24} width={170 + k * 24} height={24} fill="#b8b0a2" stroke="#8a847a" strokeWidth={2} />)}
      <path d={`M${x + 318},${P - 150} l-80,150 M${x + 512},${P - 150} l80,150`} stroke="#1d1d22" strokeWidth={8} />
      <rect x={x} y={P - 140} width={560} height={140} fill={osc(col, 0.8)} />
      <rect x={x + 60} y={P - 110} width={90} height={70} fill="#2d3b44" />
    </g>
  );
  return (
    <g>
      {casa(-700, "#7a3f34", 1)}
      {casa(-130, "#9a4a36", 2)}
      {casa(TF_PUNTOS.puerta - 415, "#8a4a36", 3, true)}
      {casa(1010, "#b5654a", 4)}
      {casa(1580, "#6e4a3e", 5)}
      {/* cerco de hierro, vereda, árbol del parkway, calle */}
      {Array.from({ length: 60 }).map((_, i) => <rect key={i} x={-760 + i * 40} y={P - 60} width={5} height={60} fill="#1d1d22" />)}
      <rect x={-760} y={P - 62} width={2400} height={6} fill="#1d1d22" />
      <rect x={-1500} y={P} width={4500} height={90} fill="#b3aca0" />
      <rect x={-1500} y={P + 90} width={4500} height={50} fill="#5a7a4a" />
      <rect x={-1500} y={P + 140} width={4500} height={14} fill="#d9d3c7" />
      <rect x={-1500} y={P + 154} width={4500} height={600} fill={L.calle} />
      <g transform={`translate(400,${P + 110})`}><rect x={-14} y={-420} width={28} height={420} fill="#4a3a2c" />{[[-90, -470, 140], [70, -500, 150], [0, -600, 170]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={["#c96a2a", "#e7a23a", "#b8541f"][i]} opacity={0.95} />)}</g>
      <text x={TF_PUNTOS.puerta + 600} y={P + 70} fontFamily={F_MANO} fontSize={1} fill="#000">.</text>
      {/* cartel de calle */}
      <g transform={`translate(${TF_PUNTOS.puerta + 700},${P})`}><rect x={-5} y={-480} width={10} height={480} fill="#5a6068" /><rect x={-110} y={-500} width={220} height={44} rx={4} fill="#2f6b4a" /><text x={0} y={-469} fontFamily={F_HUD} fontWeight={600} fontSize={24} fill="#fff" textAnchor="middle">S PAULINA ST</text><rect x={-90} y={-452} width={180} height={36} rx={4} fill="#2f6b4a" /><text x={0} y={-427} fontFamily={F_HUD} fontWeight={600} fontSize={20} fill="#fff" textAnchor="middle">1800 S</text></g>
    </g>
  );
};

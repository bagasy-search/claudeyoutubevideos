// HALDEN CLINIC (Fulton Market, West Loop): piso blanco de ensayo clínico. Recepción con logo, sillas de espera,
// box con camilla, tablet y la pared con el cartel del estudio. Piso HAL_PISO.
// Puntos: HAL_PUNTOS.recepcion (Hale detrás del mostrador), .silla (Owen firma), .camilla, .tablet, .ventanal.
import React from "react";
import { Halo, Polvo } from "../../anikit/luz";
import { F_HUD, F_MANO } from "../../anikit/pantalla";
import { Planta, SetProps } from "../../anikit/sets/comun";
import { Hora, LUCES } from "./hora";
import { SkylineChi } from "./calle";

export const HAL_PISO = 900;
export const HAL_PUNTOS = { ventanal: -100, recepcion: 640, silla: 1080, mesa: 1180, camilla: 1760, tablet: 1180, cartel: 1500 };
export const HAL_AZUL = "#2a6fd6";

export const LogoHalden: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 1, color = HAL_AZUL }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <circle r={34} fill="none" stroke={color} strokeWidth={7} />
    <path d="M-16,-18 v36 M16,-18 v36 M-16,0 h32" stroke={color} strokeWidth={7} strokeLinecap="round" />
    <text x={52} y={14} fontFamily={F_HUD} fontWeight={600} fontSize={42} letterSpacing={6} fill="#20242c">HALDEN</text>
    <text x={54} y={40} fontFamily={F_HUD} fontSize={16} letterSpacing={5} fill="#6a7280">LONGEVITY CLINIC</text>
  </g>
);

// formulario de consentimiento (se puede pintar en primer plano, en mano o sobre la mesa)
export const Formulario: React.FC<{ x: number; y: number; s?: number; firma?: number; rot?: number }> = ({ x, y, s = 1, firma = 0, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-110} y={-150} width={220} height={300} rx={4} fill="#fbfbf8" stroke="#c9ced6" strokeWidth={2} />
    <text x={0} y={-118} fontFamily={F_HUD} fontWeight={600} fontSize={16} fill="#20242c" textAnchor="middle">INFORMED CONSENT</text>
    <text x={0} y={-98} fontFamily={F_HUD} fontSize={11} fill="#6a7280" textAnchor="middle">STUDY HC-12 · 12 WEEKS · $4,700</text>
    {Array.from({ length: 11 }).map((_, i) => <rect key={i} x={-90} y={-80 + i * 16} width={i % 4 === 3 ? 110 : 180} height={5} rx={2} fill="#d6dae0" />)}
    <text x={-90} y={112} fontFamily={F_HUD} fontSize={10} fill="#c23a2e">side effects: mild and temporary</text>
    <rect x={-90} y={124} width={180} height={2} fill="#20242c" />
    <path d="M-80,118 q14,-26 26,-2 q10,18 22,-8 q14,-22 22,4 q10,14 30,-6" stroke="#1f3fa8" strokeWidth={3} fill="none" strokeDasharray={200} strokeDashoffset={200 * (1 - firma)} />
  </g>
);

export const Halden: React.FC<SetProps & { hora?: Hora; tablet?: string; numero?: string }> = ({ capa, f, hora = "manana", tablet = "47 / 47", numero }) => {
  const L = LUCES[hora];
  const P = HAL_PISO;
  if (capa === "lejos") {
    return (
      <g>
        <rect x={-2000} y={-1400} width={7000} height={3200} fill={L.cielo[1]} />
        <SkylineChi x0={-900} piso={P - 120} hora={hora} esc={1.1} />
      </g>
    );
  }
  if (capa === "frente") return <g><Polvo x={-200} y={150} w={2400} h={700} n={18} f={f} seed={21} color="#ffffff" /></g>;
  return (
    <g>
      {/* ventanal de piso a techo a la izquierda (deja ver el skyline) */}
      <rect x={-700} y={P - 720} width={30} height={720} fill="#e8ecf0" />
      {[0, 1, 2].map((k) => <rect key={k} x={-680 + k * 200} y={P - 720} width={12} height={720} fill="#e8ecf0" />)}
      <rect x={-700} y={P - 740} width={640} height={30} fill="#e8ecf0" />
      <rect x={-700} y={P - 720} width={620} height={720} fill="#ffffff" opacity={0.12} />
      {/* pared blanca */}
      <rect x={-60} y={P - 760} width={2600} height={760} fill="#f5f6f8" />
      <Halo x={900} y={P - 500} r={1100} color="#ffffff" fuerza={0.5} />
      {Array.from({ length: 5 }).map((_, i) => <rect key={i} x={160 + i * 480} y={P - 750} width={260} height={12} rx={6} fill="#ffffff" />)}
      {/* recepción: mostrador blanco curvo con franja azul y el logo detrás */}
      <LogoHalden x={HAL_PUNTOS.recepcion - 190} y={P - 560} s={1.2} />
      <path d={`M${HAL_PUNTOS.recepcion - 260},${P} v-150 q260,-30 520,0 v150 Z`} fill="#ffffff" stroke="#dfe3ea" strokeWidth={4} />
      <rect x={HAL_PUNTOS.recepcion - 260} y={P - 95} width={520} height={14} fill={HAL_AZUL} />
      <rect x={HAL_PUNTOS.recepcion + 120} y={P - 240} width={110} height={74} rx={6} fill="#20242c" />
      <rect x={HAL_PUNTOS.recepcion + 168} y={P - 166} width={14} height={20} fill="#9aa2ae" />
      <Planta x={HAL_PUNTOS.recepcion - 380} y={P} s={1.1} hoja="#3f8a5a" maceta="#f2f2f2" f={f} seed={12} />
      {/* cartel del estudio en la pared */}
      <g transform={`translate(${HAL_PUNTOS.cartel},${P - 560})`}>
        <rect x={-200} y={-120} width={400} height={240} rx={10} fill="#ffffff" stroke="#dfe3ea" strokeWidth={4} />
        <text x={0} y={-70} fontFamily={F_HUD} fontWeight={600} fontSize={26} fill="#20242c" textAnchor="middle">AGE REVERSAL TRIAL</text>
        <text x={0} y={-36} fontFamily={F_HUD} fontSize={18} fill="#6a7280" textAnchor="middle">HC-12 · EPIGENETIC CLOCK</text>
        <path d="M-160,70 q60,-10 100,-40 q60,-46 120,-50 q30,-2 100,-10" stroke={HAL_AZUL} strokeWidth={6} fill="none" />
        <circle cx={160} cy={-30} r={9} fill={HAL_AZUL} />
        <text x={0} y={100} fontFamily={F_HUD} fontSize={16} fill="#9aa2ae" textAnchor="middle">FULTON MARKET · CHICAGO</text>
      </g>
      {/* mesa con tablet y formulario, silla de Owen */}
      <rect x={HAL_PUNTOS.mesa - 170} y={P - 220} width={340} height={14} rx={4} fill="#ffffff" stroke="#dfe3ea" strokeWidth={3} />
      <rect x={HAL_PUNTOS.mesa - 6} y={P - 206} width={12} height={206} fill="#c9ced6" />
      <rect x={HAL_PUNTOS.mesa - 80} y={P - 6} width={160} height={6} rx={3} fill="#c9ced6" />
      <g transform={`translate(${HAL_PUNTOS.tablet + 60},${P - 222}) rotate(-12)`}>
        <rect x={-62} y={-86} width={124} height={86} rx={8} fill="#20242c" />
        <rect x={-54} y={-78} width={108} height={70} rx={4} fill="#eaf2ff" />
        <text x={0} y={-58} fontFamily={F_HUD} fontSize={10} letterSpacing={2} fill="#6a7280" textAnchor="middle">PARTICIPANTS</text>
        <text x={0} y={-24} fontFamily={F_HUD} fontWeight={600} fontSize={28} fill={HAL_AZUL} textAnchor="middle">{tablet}</text>
      </g>
      <rect x={HAL_PUNTOS.mesa - 130} y={P - 224} width={90} height={6} fill="#fbfbf8" />
      <g transform={`translate(${HAL_PUNTOS.silla - 140},${P})`}>
        <rect x={-50} y={-120} width={110} height={14} rx={6} fill={HAL_AZUL} />
        <rect x={-50} y={-260} width={14} height={150} rx={6} fill={HAL_AZUL} />
        <rect x={0} y={-106} width={8} height={106} fill="#9aa2ae" />
        <rect x={-40} y={-6} width={90} height={6} rx={3} fill="#9aa2ae" />
      </g>
      {/* box con camilla, monitor de signos y la cortina */}
      <rect x={HAL_PUNTOS.camilla - 340} y={P - 700} width={12} height={700} fill="#dfe3ea" />
      {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M${HAL_PUNTOS.camilla - 330 + i * 28},${P - 690} q14,320 0,600`} stroke="#bcd3f0" strokeWidth={22} fill="none" opacity={0.8} />)}
      <rect x={HAL_PUNTOS.camilla - 200} y={P - 260} width={420} height={40} rx={18} fill="#e4ecf6" />
      <rect x={HAL_PUNTOS.camilla - 200} y={P - 240} width={420} height={20} fill="#c9d4e2" />
      <rect x={HAL_PUNTOS.camilla - 170} y={P - 220} width={14} height={220} fill="#9aa2ae" /><rect x={HAL_PUNTOS.camilla + 180} y={P - 220} width={14} height={220} fill="#9aa2ae" />
      <g transform={`translate(${HAL_PUNTOS.camilla + 300},${P - 520})`}>
        <rect x={-90} y={-60} width={180} height={120} rx={8} fill="#20242c" />
        <path d={`M-80,0 ${Array.from({ length: 16 }).map((_, i) => `L${-80 + i * 10},${(i + Math.floor(f / 3)) % 8 === 4 ? -36 : (i + Math.floor(f / 3)) % 8 === 5 ? 20 : 0}`).join(" ")}`} stroke="#4af08a" strokeWidth={3} fill="none" />
        <text x={60} y={46} fontFamily={F_HUD} fontWeight={600} fontSize={20} fill="#4af08a" textAnchor="middle">72</text>
        <rect x={-6} y={60} width={12} height={460} fill="#9aa2ae" />
      </g>
      {numero && <text x={HAL_PUNTOS.camilla} y={P - 300} fontFamily={F_MANO} fontSize={40} fill={HAL_AZUL} textAnchor="middle">{numero}</text>}
      {/* piso blanco brillante */}
      <rect x={-2000} y={P} width={7000} height={400} fill="#e8ecf0" />
      <rect x={-2000} y={P} width={7000} height={6} fill="#cfd6de" />
      <ellipse cx={900} cy={P + 60} rx={900} ry={30} fill="#ffffff" opacity={0.6} />
    </g>
  );
};

// el mostrador de recepción: se dibuja DESPUÉS de la Dra. Hale (queda detrás)
export const MostradorHalden: React.FC = () => {
  const P = HAL_PISO, x = HAL_PUNTOS.recepcion;
  return <g><path d={`M${x - 260},${P} v-150 q260,-30 520,0 v150 Z`} fill="#ffffff" stroke="#dfe3ea" strokeWidth={4} /><rect x={x - 260} y={P - 95} width={520} height={14} fill={HAL_AZUL} /><rect x={x + 120} y={P - 240} width={110} height={74} rx={6} fill="#20242c" /><rect x={x + 168} y={P - 166} width={14} height={20} fill="#9aa2ae" /></g>;
};

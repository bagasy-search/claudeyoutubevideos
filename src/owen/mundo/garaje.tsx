// GARAJE CTA DE LA 74th: nave con buses estacionados en fila, la ventanilla de despacho de Tiny y el reloj de turnos.
// Piso GAR_PISO. Puntos: GAR_PUNTOS.ventanilla (Tiny adentro, Owen afuera en .mostrador), .bus (x del bus de Owen).
import React from "react";
import { Halo, Haces, Polvo } from "../../anikit/luz";
import { F_HUD, F_MANO } from "../../anikit/pantalla";
import { SetProps, osc } from "../../anikit/sets/comun";
import { Hora, LUCES } from "./hora";
import { Bus9 } from "./bus";

export const GAR_PISO = 900;
export const GAR_PUNTOS = { ventanilla: 420, mostrador: 640, reloj: 900, bus: 1900, puerton: 2600 };

export const Garaje: React.FC<SetProps & { hora?: Hora; hoja?: (f: number) => number }> = ({ capa, f, hora = "alba", hoja = () => 0 }) => {
  const L = LUCES[hora];
  const P = GAR_PISO;
  if (capa === "lejos") {
    return (
      <g>
        <rect x={-2000} y={-1400} width={7000} height={3200} fill="#3a3e46" />
        {/* cabreadas del techo y tubos */}
        {Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M${-800 + i * 360},40 l180,-140 l180,140`} stroke="#22252b" strokeWidth={14} fill="none" />)}
        <rect x={-2000} y={30} width={7000} height={18} fill="#22252b" />
        {Array.from({ length: 8 }).map((_, i) => <g key={i}><rect x={-500 + i * 600} y={90} width={220} height={14} rx={6} fill="#eaf4ff" /><Halo x={-390 + i * 600} y={110} r={320} color="#dff0ff" fuerza={0.35} /></g>)}
        {/* portón abierto al alba */}
        <rect x={GAR_PUNTOS.puerton} y={P - 620} width={900} height={620} fill={L.cielo[2]} />
        <rect x={GAR_PUNTOS.puerton} y={P - 620} width={900} height={120} fill={L.cielo[1]} />
        {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={GAR_PUNTOS.puerton} y={P - 620 + i * 20} width={900} height={4} fill="#5a5e66" />)}
        {/* buses al fondo, en fila */}
        {[0, 1, 2].map((k) => <Bus9 key={k} x={-900 + k * 1300} y={P - 60} esc={0.55} dir={1} hora={hora} seed={k + 20} chofer={false} />)}
      </g>
    );
  }
  if (capa === "frente") {
    return <g><Haces x={GAR_PUNTOS.puerton + 300} y={P - 640} ang={-30} largo={1300} n={5} ancho={140} f={f} color={L.sol} fuerza={0.22} /><Polvo x={0} y={200} w={3000} h={700} n={30} f={f} seed={7} /></g>;
  }
  const v = GAR_PUNTOS.ventanilla;
  const hj = hoja(f);
  return (
    <g>
      {/* pared de bloques con la oficina de despacho */}
      <rect x={-600} y={P - 560} width={1700} height={560} fill="#c9c4b4" />
      {Array.from({ length: 14 }).map((_, r) => <rect key={r} x={-600} y={P - 560 + r * 40} width={1700} height={3} fill="#a8a294" />)}
      <rect x={-600} y={P - 220} width={1700} height={14} fill="#e7b240" />
      <rect x={v - 240} y={P - 470} width={480} height={300} fill="#2a2e34" />
      <rect x={v - 230} y={P - 460} width={460} height={280} fill="#f2e6c4" />
      <Halo x={v} y={P - 380} r={380} color="#fff2c8" fuerza={0.4} />
      <rect x={v - 230} y={P - 460} width={460} height={280} fill="#bcd8e6" opacity={0.22} />
      {/* hojas de ruta clavadas y el cartel */}
      {Array.from({ length: 5 }).map((_, k) => <rect key={k} x={v - 210 + k * 46} y={P - 440} width={36} height={48} fill="#fffaf0" transform={`rotate(${(k % 2 ? 4 : -3)} ${v - 192 + k * 46} ${P - 416})`} />)}
      <rect x={v - 280} y={P - 540} width={560} height={56} rx={6} fill="#22305a" />
      <text x={v} y={P - 501} fontFamily={F_HUD} fontWeight={600} fontSize={32} letterSpacing={4} fill="#fff" textAnchor="middle">DISPATCH · 74TH GARAGE</text>
      {/* la hoja de ruta de Owen sobre el mostrador (Tiny la golpea) */}
      <g transform={`translate(${v + 120},${P - 186 - hj * 10}) rotate(${-6 + hj * 4})`}>
        <rect x={-60} y={-8} width={120} height={10} fill="#fffaf0" />
        <text x={0} y={-12} fontFamily={F_MANO} fontSize={22} fill="#2a2420" textAnchor="middle">RT 9</text>
      </g>
      {/* reloj de fichar */}
      <g transform={`translate(${GAR_PUNTOS.reloj},${P - 380})`}>
        <rect x={-60} y={-80} width={120} height={180} rx={10} fill="#8a9096" />
        <circle cx={0} cy={-20} r={44} fill="#f4efe4" stroke="#2a2420" strokeWidth={4} />
        <rect x={-2} y={-54} width={4} height={34} fill="#2a2420" transform={`rotate(${240 + f * 0.05})`} />
        <rect x={-2} y={-44} width={5} height={24} fill="#2a2420" transform="rotate(170)" />
        <rect x={-40} y={40} width={80} height={40} fill="#3a3e46" />
      </g>
      {/* cartel de seguridad */}
      <rect x={-500} y={P - 480} width={260} height={150} fill="#fff" />
      <rect x={-500} y={P - 480} width={260} height={40} fill="#2f8a4a" />
      <text x={-370} y={P - 451} fontFamily={F_HUD} fontWeight={600} fontSize={22} fill="#fff" textAnchor="middle">SAFETY FIRST</text>
      <text x={-370} y={P - 385} fontFamily={F_HUD} fontWeight={600} fontSize={48} fill="#2a2420" textAnchor="middle">412</text>
      <text x={-370} y={P - 352} fontFamily={F_HUD} fontSize={16} fill="#2a2420" textAnchor="middle">DAYS WITHOUT ACCIDENT</text>
      {/* el bus de Owen, listo para salir */}
      <Bus9 x={GAR_PUNTOS.bus} y={P} esc={0.9} dir={1} hora={hora} seed={9} chofer={false} />
      {/* piso de cemento con manchas y línea amarilla */}
      <rect x={-2000} y={P} width={7000} height={400} fill="#6a6a6e" />
      <rect x={-2000} y={P + 60} width={7000} height={10} fill="#e7b240" opacity={0.8} />
      {[0, 1, 2, 3].map((k) => <ellipse key={k} cx={-200 + k * 900} cy={P + 160} rx={160} ry={22} fill={osc("#6a6a6e", 0.7)} opacity={0.6} />)}
    </g>
  );
};

// el mostrador de la ventanilla: se dibuja DESPUÉS de Tiny (Tiny queda detrás, de la cintura para arriba)
export const MostradorDespacho: React.FC = () => {
  const v = GAR_PUNTOS.ventanilla, P = GAR_PISO;
  return <g><rect x={v - 240} y={P - 180} width={480} height={180} fill="#c9c4b4" /><rect x={v - 250} y={P - 190} width={500} height={30} fill="#7a7468" /><rect x={v - 240} y={P - 60} width={480} height={14} fill="#e7b240" /></g>;
};

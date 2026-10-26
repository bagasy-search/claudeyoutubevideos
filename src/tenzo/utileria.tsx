// Utilería de Tenzo Films: farol de papel con loto (la única luz cálida), celular con pantalla ámbar, toalla que se dobla,
// mandarina en espiral, carrito de lavandería, bolso de ropa, bici blanca (ghost bike), carroza de Channa, elefante.
// Todo SVG en coordenadas del mundo; los que van en la mano tienen el origen en la mano (eje = antebrazo).
import React from "react";
import { Halo, Charco } from "../anikit/luz";
import { osc, acl } from "../anikit/sets/comun";
import { ACENTO, ORO } from "./elenco";

// farol de papel con un loto pintado; `luz` 0..1 (se apaga suave en el cierre); `parpadeo` = titila (la transición a la parábola)
export const FarolPapel: React.FC<{ x?: number; y?: number; s?: number; luz?: number; halo?: number; colgado?: boolean }> = ({ x = 0, y = 0, s = 1, luz = 1, halo = 1, colgado }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {halo > 0 && <Halo x={0} y={colgado ? 70 : -38} r={330} color={ORO} fuerza={0.55 * luz * halo} />}
    <g transform={colgado ? "translate(0,70) rotate(90)" : undefined}>
      {colgado && <line x1={0} y1={-110} x2={0} y2={-70} stroke="#3a2a1c" strokeWidth={4} />}
    </g>
    <g transform={colgado ? "translate(0,108)" : undefined}>
      <rect x={-4} y={-108} width={8} height={26} rx={3} fill="#4a321e" />
      <rect x={-22} y={-86} width={44} height={9} rx={3} fill="#3a2414" />
      <ellipse cx={0} cy={-40} rx={34} ry={40} fill={luz > 0.05 ? acl(ORO, 0.55 - 0.3 * (1 - luz)) : "#8a7a60"} />
      <ellipse cx={0} cy={-40} rx={34} ry={40} fill="none" stroke={osc(ORO, 0.7)} strokeWidth={2} opacity={0.6} />
      {[-24, -12, 0, 12, 24].map((k) => <path key={k} d={`M-33,${-40 + k} Q0,${-40 + k + 5} 33,${-40 + k}`} stroke={osc(ORO, 0.75)} strokeWidth={1.2} fill="none" opacity={0.45} />)}
      {/* loto */}
      <g transform="translate(0,-34)" fill={luz > 0.05 ? "#e8782c" : "#6a4a2a"} opacity={0.9}>
        <path d="M0,8 Q-5,-6 0,-16 Q5,-6 0,8 Z" />
        <path d="M0,8 Q-14,0 -16,-10 Q-6,-6 0,8 Z" /><path d="M0,8 Q14,0 16,-10 Q6,-6 0,8 Z" />
        <path d="M0,9 Q-18,6 -22,0 Q-10,0 0,9 Z" /><path d="M0,9 Q18,6 22,0 Q10,0 0,9 Z" />
      </g>
      <rect x={-20} y={-4} width={40} height={9} rx={3} fill="#3a2414" />
      {luz > 0.05 && <ellipse cx={0} cy={-40} rx={14} ry={18} fill="#fff6dc" opacity={0.55 * luz} />}
    </g>
  </g>
);

// el farol en la mano (cuelga de la manija)
export const FarolMano: React.FC<{ luz?: number }> = ({ luz = 1 }) => <g transform="rotate(0)"><FarolPapel y={112} s={0.9} luz={luz} /></g>;

// celular con pantalla ámbar (en la mano: rotado como el del kit). `n` = notificaciones (globito)
export const Tel: React.FC<{ prendido?: boolean; s?: number; boca?: "arriba" | "abajo"; n?: number }> = ({ prendido = true, s = 1.3, boca = "arriba", n }) => (
  <g transform={`scale(${s}) rotate(90)`}>
    {prendido && <Halo x={0} y={-12} r={70} color={ACENTO} fuerza={0.35} />}
    <rect x={-12} y={-34} width={24} height={44} rx={5} fill="#15151a" stroke="#3a3a44" strokeWidth={2} />
    {prendido && boca === "arriba" && <rect x={-9} y={-30} width={18} height={36} rx={3} fill={ACENTO} opacity={0.88} />}
    {prendido && boca === "arriba" && [0, 1, 2].map((k) => <rect key={k} x={-6} y={-24 + k * 9} width={12} height={4} rx={2} fill="#ffd2b8" opacity={0.6} />)}
    {n !== undefined && <g><circle cx={11} cy={-32} r={8} fill={ACENTO} /><text x={11} y={-29} fontSize={8} textAnchor="middle" fill="#fff" fontWeight={700}>{n}</text></g>}
  </g>
);
// celular apoyado sobre una mesa (en el mundo): boca abajo = sin luz
export const TelMesa: React.FC<{ x: number; y: number; bocaAbajo?: boolean; vibra?: number }> = ({ x, y, bocaAbajo, vibra = 0 }) => (
  <g transform={`translate(${x + vibra},${y})`}>
    {!bocaAbajo && <Halo x={0} y={-10} r={120} color={ACENTO} fuerza={0.4} />}
    <rect x={-26} y={-7} width={52} height={7} rx={3} fill="#15151a" stroke="#3a3a44" strokeWidth={1.5} />
    {!bocaAbajo && <rect x={-22} y={-9} width={44} height={3} rx={1.5} fill={ACENTO} />}
  </g>
);

// toalla: `doblez` 0 (abierta) → 1 (doblada en cuadrado). Sobre la mesa, centrada en x
export const Toalla: React.FC<{ x: number; y: number; doblez: number; color?: string }> = ({ x, y, doblez, color = "#e9e6e0" }) => {
  const w = 220 - 130 * doblez, h = 14 + 22 * doblez;
  return (
    <g>
      <rect x={x - w / 2} y={y - h} width={w} height={h} rx={5} fill={color} />
      {Array.from({ length: Math.round(1 + doblez * 3) }).map((_, k) => <rect key={k} x={x - w / 2} y={y - h + 6 + k * 7} width={w} height={1.6} fill={osc(color, 0.85)} />)}
    </g>
  );
};
// pila de toallas dobladas
export const PilaToallas: React.FC<{ x: number; y: number; n?: number }> = ({ x, y, n = 4 }) => (
  <g>{Array.from({ length: n }).map((_, k) => <Toalla key={k} x={x + (k % 2) * 4} y={y - k * 34} doblez={1} color={k % 2 ? "#dcd8d0" : "#ecebe6"} />)}</g>
);

// mandarina: `pelada` 0..1 (la cáscara sale en espiral)
export const Mandarina: React.FC<{ pelada?: number; s?: number }> = ({ pelada = 0, s = 1 }) => (
  <g transform={`scale(${s})`}>
    <circle r={17} fill={pelada > 0.5 ? "#f2b05a" : "#ee8a2a"} />
    {pelada > 0.5 && [0, 1, 2, 3, 4].map((k) => <path key={k} d={`M0,0 L${Math.cos(k * 1.25) * 16},${Math.sin(k * 1.25) * 16}`} stroke="#e9963a" strokeWidth={1.5} />)}
    {pelada > 0.02 && <path d={`M14,-8 q20,8 14,26 q-6,16 -24,14`} stroke="#ee8a2a" strokeWidth={6} fill="none" strokeLinecap="round" strokeDasharray={120} strokeDashoffset={120 * (1 - Math.min(1, pelada))} />}
    {pelada < 0.5 && <path d="M-2,-17 q4,-6 8,-4" stroke="#5a7a3a" strokeWidth={3} fill="none" />}
  </g>
);

// carrito de lavandería (canasto de alambre con ropa)
export const CarritoRopa: React.FC<{ x: number; piso: number; lleno?: boolean }> = ({ x, piso, lleno = true }) => (
  <g transform={`translate(${x},${piso})`}>
    {lleno && <path d="M-70,-150 Q-40,-190 0,-170 Q40,-196 72,-150 Z" fill="#c9ccd2" />}
    {lleno && <path d="M-40,-160 Q-10,-182 20,-160 Z" fill="#7d8796" />}
    <path d="M-80,-150 L80,-150 L70,-70 L-70,-70 Z" fill="#9aa3ad" fillOpacity={0.12} stroke="#aeb5bd" strokeWidth={4} />
    {Array.from({ length: 7 }).map((_, k) => <line key={k} x1={-72 + k * 24} y1={-150} x2={-64 + k * 21} y2={-70} stroke="#aeb5bd" strokeWidth={2} />)}
    <line x1={-74} y1={-110} x2={76} y2={-110} stroke="#aeb5bd" strokeWidth={2} />
    <rect x={-6} y={-70} width={10} height={58} fill="#8a9199" />
    <rect x={-60} y={-16} width={120} height={6} fill="#8a9199" />
    {[-55, 55].map((cx) => <circle key={cx} cx={cx} cy={-6} r={7} fill="#2a2c30" />)}
  </g>
);

// bolso de ropa sucia (en la mano o en el piso)
export const BolsoRopa: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M-6,0 L6,0 L4,18 L-4,18 Z" fill="#5a5f66" />
    <path d="M-36,18 Q-44,60 -30,96 Q0,108 30,96 Q44,60 36,18 Z" fill="#6a707a" stroke="#2a2c30" strokeWidth={3} />
    <path d="M-30,40 Q0,50 30,40" stroke="#4a4f57" strokeWidth={3} fill="none" />
  </g>
);

// bici blanca de la vereda (ghost bike) con flores y una foto
export const GhostBike: React.FC<{ x: number; piso: number; flores?: boolean }> = ({ x, piso, flores = true }) => (
  <g transform={`translate(${x},${piso})`}>
    <rect x={150} y={-430} width={14} height={430} fill="#3a3d44" />
    {[[-70, -46], [70, -46]].map(([cx, cy], i) => <g key={i}><circle cx={cx} cy={cy} r={44} fill="none" stroke="#f4f2ee" strokeWidth={7} /><circle cx={cx} cy={cy} r={6} fill="#f4f2ee" /></g>)}
    <path d="M-70,-46 L-20,-120 L45,-120 L70,-46 M-20,-120 L0,-46 L45,-120 M0,-46 L-70,-46 M45,-120 L52,-142 M30,-142 L66,-142 M-20,-120 L-28,-140 M-44,-142 L-12,-142" stroke="#f4f2ee" strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M60,-90 Q110,-100 158,-96" stroke="#9aa0a8" strokeWidth={4} fill="none" />
    {flores && <g>
      {[[-40, -96, "#e9e4d8"], [-20, -104, "#d8dbe2"], [0, -96, "#f2efe8"], [-30, -86, "#cfd3da"]].map(([fx, fy, c], i) => <g key={i}><line x1={fx as number} y1={fy as number} x2={-14} y2={-60} stroke="#6a7a6a" strokeWidth={3} /><circle cx={fx as number} cy={fy as number} r={9} fill={c as string} /></g>)}
      <rect x={128} y={-300} width={58} height={70} rx={3} fill="#f4f2ee" />
      <rect x={134} y={-294} width={46} height={44} fill="#8a8f98" />
      <circle cx={157} cy={-280} r={9} fill="#c9ccd2" /><rect x={146} y={-268} width={22} height={16} rx={6} fill="#c9ccd2" />
    </g>}
  </g>
);

// carroza de Channa con el caballo blanco Kanthaka: `rueda` en grados, `paso` fase del trote
export const Carroza: React.FC<{ x: number; piso: number; dir?: 1 | -1; rueda?: number; paso?: number }> = ({ x, piso, dir = 1, rueda = 0, paso = 0 }) => {
  const pata = (k: number) => 14 * Math.sin(paso * 2 * Math.PI + k * Math.PI);
  return (
    <g transform={`translate(${x},${piso}) scale(${dir},1)`}>
      {/* caballo */}
      <g transform="translate(250,0)">
        {[-60, -40, 40, 60].map((px, i) => <path key={i} d={`M${px},-120 L${px + pata(i % 2)},-4`} stroke={i % 2 ? "#d8cdb8" : "#efe6d4"} strokeWidth={13} strokeLinecap="round" />)}
        <ellipse cx={0} cy={-150} rx={95} ry={45} fill="#f4ecdc" stroke="#6a4a2a" strokeWidth={3} />
        <path d="M70,-175 Q100,-250 140,-262 Q160,-250 150,-228 Q120,-215 105,-160 Z" fill="#f4ecdc" stroke="#6a4a2a" strokeWidth={3} />
        <path d="M78,-200 Q96,-252 128,-262" stroke="#c9963a" strokeWidth={10} fill="none" />
        <circle cx={140} cy={-246} r={3.5} fill="#3a2414" />
        <path d="M-92,-160 Q-130,-150 -128,-100" stroke="#e9dcc4" strokeWidth={10} fill="none" strokeLinecap="round" />
        <rect x={-50} y={-196} width={100} height={16} rx={4} fill="#c9963a" />
      </g>
      {/* lanza */}
      <path d="M60,-120 L200,-150" stroke="#8a5a2a" strokeWidth={7} />
      {/* carro */}
      <path d="M-120,-210 L70,-210 L80,-90 L-110,-90 Z" fill="#c9963a" stroke="#6a4020" strokeWidth={4} />
      <path d="M-120,-210 Q-110,-300 -20,-310 Q60,-300 70,-210" fill="#a8322c" opacity={0.9} />
      {Array.from({ length: 5 }).map((_, k) => <rect key={k} x={-100 + k * 40} y={-200} width={16} height={100} fill="#e8b450" opacity={0.6} />)}
      <g transform={`translate(-20,-56) rotate(${rueda})`}>
        <circle r={58} fill="none" stroke="#6a4020" strokeWidth={10} />
        {Array.from({ length: 8 }).map((_, k) => <line key={k} x1={0} y1={0} x2={Math.cos((k * Math.PI) / 4) * 54} y2={Math.sin((k * Math.PI) / 4) * 54} stroke="#8a5a2a" strokeWidth={5} />)}
        <circle r={10} fill="#e0b040" />
      </g>
    </g>
  );
};

// elefante de perfil (calle de Vaishali): `paso` = fase de la caminata, `adorno` = manta de fiesta
export const Elefante: React.FC<{ x: number; piso: number; dir?: 1 | -1; s?: number; paso?: number; adorno?: boolean }> = ({ x, piso, dir = 1, s = 1, paso = 0, adorno = true }) => {
  const c = "#9a8a7a", cs = osc(c, 0.85);
  const pata = (k: number) => 10 * Math.sin(paso * 2 * Math.PI + k * Math.PI);
  return (
    <g transform={`translate(${x},${piso}) scale(${dir * s},${s})`}>
      {[-110, -60, 60, 110].map((px, i) => <rect key={i} x={px - 24 + pata(i % 2)} y={-170} width={48} height={170} rx={20} fill={i % 2 ? cs : c} />)}
      <ellipse cx={0} cy={-230} rx={170} ry={110} fill={c} />
      <ellipse cx={175} cy={-270} rx={80} ry={75} fill={c} />
      <path d={`M235,-250 Q275,-180 250,-90 Q244,-60 262,-50`} stroke={c} strokeWidth={34} fill="none" strokeLinecap="round" />
      <path d="M130,-320 Q70,-300 80,-220 Q110,-180 150,-210 Z" fill={cs} />
      <circle cx={200} cy={-290} r={6} fill="#2a1a10" />
      <path d="M222,-232 q24,8 30,26" stroke="#f4ecdc" strokeWidth={10} fill="none" strokeLinecap="round" />
      <path d="M-170,-240 Q-200,-210 -195,-170" stroke={c} strokeWidth={8} fill="none" />
      {adorno && <g><path d="M-90,-330 L90,-330 L100,-200 L-100,-200 Z" fill="#a8322c" /><path d="M-100,-200 L100,-200" stroke="#e0b040" strokeWidth={10} />{[-60, 0, 60].map((k) => <circle key={k} cx={k} cy={-270} r={14} fill="#e0b040" />)}</g>}
    </g>
  );
};

// cuenco de limosnas
export const Cuenco: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}><path d="M-22,-4 Q-20,18 0,20 Q20,18 22,-4 Z" fill="#5a3a24" /><ellipse cx={0} cy={-4} rx={22} ry={5} fill="#3a2414" /></g>
);
// bastón (el viejo de la primera visión)
export const Baston: React.FC<{ largo?: number }> = ({ largo = 150 }) => <path d={`M0,-30 L0,${largo}`} stroke="#6a4a2a" strokeWidth={7} strokeLinecap="round" />;

// laptop vieja abierta (en el piso/colchón): `brillo` 0..1
export const Laptop: React.FC<{ x: number; y: number; brillo?: number; onda?: number }> = ({ x, y, brillo = 1, onda = 0 }) => (
  <g transform={`translate(${x},${y})`}>
    {brillo > 0 && <Halo x={0} y={-60} r={240} color="#9fb8e0" fuerza={0.35 * brillo} />}
    <path d="M-80,0 L80,0 L95,12 L-95,12 Z" fill="#3a3d44" />
    <path d="M-72,0 L-64,-110 L64,-110 L72,0 Z" fill="#2a2c32" />
    <path d="M-62,-8 L-56,-102 L56,-102 L62,-8 Z" fill={brillo > 0 ? "#9fb8e0" : "#1a1c20"} opacity={0.4 + 0.5 * brillo} />
    {brillo > 0 && Array.from({ length: 16 }).map((_, k) => { const h = 6 + 26 * Math.abs(Math.sin(onda * 0.4 + k * 0.9)) * (onda > 0 ? 1 : 0.2); return <rect key={k} x={-44 + k * 5.6} y={-55 - h / 2} width={3.2} height={h} rx={1.5} fill="#e9eef6" opacity={0.85} />; })}
  </g>
);

export { Charco };

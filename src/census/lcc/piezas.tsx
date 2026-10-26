// Piezas de utilería de la sesión lc-c (Ep.5-6 de The Last Census): farmacia, quirófano a farol, radio de Gus,
// la isla y el hielo. Todo vectorial plano; la luz sale de anikit/luz (degradés con alfa, nada de filter).
import React from "react";
import { random } from "remotion";
import { Halo, Charco } from "../../anikit/luz";
import { acl, osc } from "../../anikit/sets/comun";
import { AMBAR, ROJO_CENSO } from "../elenco";

// farol a querosén (de mano o colgado). on 0..1; x,y = base. Origen en la base: sirve en enManoD con y negativo.
export const FarolMano: React.FC<{ x?: number; y?: number; on?: number; s?: number; f?: number; color?: string; halo?: number }> = ({ x = 0, y = 0, on = 1, s = 1, f = 0, color = "#ffc56a", halo = 1 }) => {
  const tit = 1 + 0.04 * Math.sin(f / 3.1) + 0.03 * Math.sin(f / 1.7);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {on > 0.02 && halo > 0 && <Halo x={0} y={-34} r={260 * tit} color={color} fuerza={0.55 * on * halo} />}
      <path d="M-14,-78 Q0,-96 14,-78" stroke="#2a2420" strokeWidth={4} fill="none" />
      <rect x={-17} y={-76} width={34} height={8} rx={3} fill="#3a3028" />
      <path d="M-15,-68 Q-20,-36 -15,-12 L15,-12 Q20,-36 15,-68 Z" fill={on > 0.02 ? acl(color, 0.35) : "#5a5048"} opacity={0.9} />
      {on > 0.02 && <ellipse cx={0} cy={-36} rx={6 * tit} ry={11 * tit} fill="#fff4d0" opacity={on} />}
      {[-15, 15].map((k) => <rect key={k} x={k - 2} y={-70} width={4} height={60} fill="#2a2420" />)}
      <rect x={-19} y={-14} width={38} height={14} rx={4} fill="#3a3028" />
    </g>
  );
};

// frasco de remedio (vial con tapa). brillo 0..1 = el de la miniatura
export const Vial: React.FC<{ x?: number; y?: number; s?: number; brillo?: number; color?: string; tapa?: string }> = ({ x = 0, y = 0, s = 1, brillo = 0, color = "#f4e6c8", tapa = "#c9cfd6" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {brillo > 0 && <Halo x={0} y={-30} r={150} color="#ffcf6e" fuerza={0.8 * brillo} />}
    <rect x={-13} y={-58} width={26} height={10} rx={3} fill={tapa} />
    <rect x={-9} y={-50} width={18} height={6} fill="#b9c0c8" />
    <path d="M-15,-44 L15,-44 L15,-4 Q15,0 11,0 L-11,0 Q-15,0 -15,-4 Z" fill="#e8f2f6" opacity={0.85} />
    <path d="M-14,-22 L14,-22 L14,-4 Q14,-1 11,-1 L-11,-1 Q-14,-1 -14,-4 Z" fill={brillo > 0 ? "#ffe7a8" : color} />
    <rect x={-10} y={-40} width={4} height={30} rx={2} fill="#fff" opacity={0.7} />
  </g>
);

// caja de remedios con etiqueta y cruz; tono 0..1 (1 = vigente, 0 = apagada / vencida)
export const CajaRemedio: React.FC<{ x: number; y: number; w?: number; h?: number; color?: string; tono?: number; seed?: number }> = ({ x, y, w = 58, h = 44, color = "#e9ecef", tono = 1, seed = 0 }) => {
  const banda = ["#2f7f86", "#c0352c", "#e3a531", "#5a7fc0", "#6aa86a"][Math.floor(random(`cr${seed}`) * 5)];
  return (
    <g opacity={0.45 + 0.55 * tono}>
      <rect x={x} y={y - h} width={w} height={h} rx={3} fill={color} />
      <rect x={x} y={y - h * 0.62} width={w} height={h * 0.22} fill={banda} />
      <rect x={x + w * 0.12} y={y - h * 0.88} width={w * 0.5} height={4} rx={2} fill="#9aa2aa" />
    </g>
  );
};

// estante metálico de farmacia (x,y = esquina inferior izq.); llenado 0..1 (los estantes se vacían en timelapse)
export const EstanteFarmacia: React.FC<{ x: number; y: number; w: number; pisos?: number; llenado?: number; seed?: number; tono?: (i: number) => number; color?: string }> = ({ x, y, w, pisos = 5, llenado = 1, seed = 0, tono, color = "#5d6a84" }) => {
  const alto = 112;
  return (
    <g>
      <rect x={x} y={y - pisos * alto - 20} width={10} height={pisos * alto + 20} fill={osc(color, 0.8)} />
      <rect x={x + w - 10} y={y - pisos * alto - 20} width={10} height={pisos * alto + 20} fill={osc(color, 0.8)} />
      <rect x={x + 10} y={y - pisos * alto - 20} width={w - 20} height={pisos * alto + 20} fill={osc(color, 0.45)} />
      {Array.from({ length: pisos }).map((_, p) => {
        const py = y - p * alto;
        const n = Math.floor((w - 30) / 64);
        return (
          <g key={p}>
            <rect x={x} y={py - 12} width={w} height={12} fill={color} />
            {Array.from({ length: n }).map((__, k) => {
              const i = p * 50 + k;
              if (random(`ef${seed}-${i}`) > llenado) return null;
              const t = tono ? tono(i) : 1;
              return random(`et${seed}-${i}`) < 0.3
                ? <g key={k} transform={`translate(${x + 30 + k * 64},${py - 12})`}><Vial s={0.75} color={["#c98a5a", "#f4e6c8", "#7aa6c8"][i % 3]} /></g>
                : <CajaRemedio key={k} x={x + 18 + k * 64} y={py - 12} w={54} h={34 + random(`eh${seed}-${i}`) * 26} tono={t} seed={seed * 100 + i} />;
            })}
          </g>
        );
      })}
    </g>
  );
};

// bolsa de suero en un pie (perchero de la granja). gota = cuadro para la gota que cae
export const Suero: React.FC<{ x: number; piso: number; f: number; lleno?: number; via?: { x: number; y: number } }> = ({ x, piso, f, lleno = 0.8, via }) => {
  const g = (f % 45) / 45;
  return (
    <g>
      <rect x={x - 4} y={piso - 520} width={8} height={520} fill="#6a4a30" />
      <path d={`M${x - 60},${piso} L${x},${piso - 40} L${x + 60},${piso}`} stroke="#6a4a30" strokeWidth={10} fill="none" />
      <path d={`M${x},${piso - 520} q30,-6 40,10`} stroke="#6a4a30" strokeWidth={7} fill="none" />
      <g transform={`translate(${x + 40},${piso - 505})`}>
        <path d="M-26,0 L26,0 L24,88 Q0,100 -24,88 Z" fill="#eaf4f8" opacity={0.85} />
        <path d={`M-24,${88 - 80 * lleno} L24,${88 - 80 * lleno} L24,88 Q0,100 -24,88 Z`} fill="#cfe8f2" />
        <rect x={-14} y={20} width={28} height={16} rx={2} fill="#fff" opacity={0.9} />
        <rect x={-10} y={25} width={20} height={3} fill="#2f7f86" />
        <rect x={-3} y={96} width={6} height={24} fill="#dfe8ec" />
        <ellipse cx={0} cy={108 + g * 10} rx={2.2} ry={3} fill="#bfe2f0" opacity={1 - g} />
      </g>
      {via && <path d={`M${x + 40},${piso - 385} C${x + 40},${piso - 260} ${via.x + 80},${via.y - 120} ${via.x},${via.y}`} stroke="#e8eef0" strokeWidth={3} fill="none" opacity={0.9} />}
    </g>
  );
};

// cuaderno rojo «CENSUS» (de gasolinera, alce en la tapa). abierto: dos páginas con renglones
export const CuadernoCenso: React.FC<{ x?: number; y?: number; s?: number; abierto?: boolean; rot?: number }> = ({ x = 0, y = 0, s = 1, abierto, rot = 0 }) =>
  abierto ? (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-210} y={-140} width={420} height={280} rx={8} fill={ROJO_CENSO} />
      <rect x={-200} y={-132} width={196} height={264} fill="#f6efdc" />
      <rect x={4} y={-132} width={196} height={264} fill="#f8f2e2" />
      {Array.from({ length: 9 }).map((_, i) => <g key={i}><rect x={-190} y={-100 + i * 26} width={176} height={1.5} fill="#9ab4d0" /><rect x={14} y={-100 + i * 26} width={176} height={1.5} fill="#9ab4d0" /></g>)}
      <rect x={-172} y={-132} width={1.5} height={264} fill="#e08a8a" />
      <rect x={-3} y={-136} width={6} height={272} fill={osc(ROJO_CENSO, 0.7)} />
    </g>
  ) : (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-100} y={-140} width={200} height={280} rx={8} fill={ROJO_CENSO} />
      <rect x={-100} y={-140} width={16} height={280} fill={osc(ROJO_CENSO, 0.75)} />
      <rect x={-56} y={-104} width={130} height={40} rx={4} fill="#f6efdc" />
      <text x={9} y={-76} textAnchor="middle" fontFamily="Arial Black, Arial" fontWeight={900} fontSize={26} fill={ROJO_CENSO}>CENSUS</text>
      {/* alce de dibujito */}
      <g transform="translate(10,30)" fill="#f6efdc">
        <ellipse cx={0} cy={0} rx={40} ry={22} /><rect x={-30} y={10} width={8} height={30} /><rect x={22} y={10} width={8} height={30} />
        <circle cx={46} cy={-16} r={14} />
        <path d="M40,-30 L30,-56 L40,-46 L44,-60 L50,-44 L60,-54 L54,-30 Z" />
      </g>
    </g>
  );

// radio HF de Gus: equipo con dial verde, aguja, micrófono de mano con cable rizado. luz 0..1
export const RadioHF: React.FC<{ x: number; y: number; f: number; luz?: number; aguja?: number; mic?: boolean }> = ({ x, y, f, luz = 0.6, aguja = 0.4, mic = true }) => (
  <g transform={`translate(${x},${y})`}>
    <Halo x={0} y={-90} r={300} color="#7dffb0" fuerza={0.22 * luz} />
    <rect x={-190} y={-170} width={380} height={170} rx={12} fill="#2a2622" />
    <rect x={-180} y={-160} width={360} height={14} rx={6} fill="#3a342e" />
    <rect x={-160} y={-128} width={200} height={64} rx={8} fill={acl("#1a3a2a", 0.15 + 0.35 * luz)} stroke="#6a5a48" strokeWidth={4} />
    {Array.from({ length: 16 }).map((_, i) => <rect key={i} x={-150 + i * 12} y={-118} width={2} height={i % 4 ? 10 : 18} fill="#bfffd8" opacity={0.5 + 0.4 * luz} />)}
    <rect x={-150 + aguja * 180} y={-124} width={4} height={54} fill="#ff6a3a" />
    <circle cx={110} cy={-96} r={34} fill="#4a423a" stroke="#1a1614" strokeWidth={5} />
    <rect x={107} y={-128} width={6} height={22} rx={3} fill="#d8cdb8" transform={`rotate(${aguja * 300 - 150} 110 -96)`} />
    {[-140, -96, -52].map((cx) => <circle key={cx} cx={cx} cy={-28} r={11} fill="#4a423a" />)}
    <circle cx={160} cy={-30} r={6} fill={luz > 0.5 ? "#ff5a3a" : "#5a2a20"} />
    {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={10 + i * 14} y={-44} width={8} height={30} rx={3} fill="#1a1614" />)}
    {mic && <g>
      <path d={`M-200,-30 ${Array.from({ length: 10 }).map((_, i) => `q-8,${i % 2 ? 10 : -10} -14,4`).join(" ")}`} stroke="#1a1614" strokeWidth={4} fill="none" />
    </g>}
  </g>
);

// micrófono de mano (para enManoD): cuerpo negro con rejilla y botón PTT
export const MicMano: React.FC<{ s?: number; ptt?: boolean }> = ({ s = 1, ptt }) => (
  <g transform={`scale(${s}) rotate(-80)`}>
    <rect x={-14} y={-30} width={28} height={52} rx={12} fill="#1e1b19" />
    <rect x={-10} y={-26} width={20} height={16} rx={6} fill="#4a4440" />
    {[0, 1, 2].map((k) => <rect key={k} x={-8} y={-24 + k * 5} width={16} height={2} fill="#1e1b19" />)}
    <rect x={14} y={-6} width={5} height={14} rx={2} fill={ptt ? "#ff6a3a" : "#5a524a"} />
  </g>
);

// mapa de los Grandes Lagos (oeste del Superior) para la pared del altillo / la estación de la isla.
// marcas: duluth, isla, bayfield, hermantown iluminables (0..1)
export const MapaLago: React.FC<{ x: number; y: number; w?: number; isla?: number; ruta?: number; f?: number; linea?: number }> = ({ x, y, w = 520, isla = 0, ruta = 0, f = 0, linea = 0 }) => {
  const k = w / 520;
  const D = { x: 70, y: 250 }, I = { x: 360, y: 130 }, B = { x: 330, y: 170 }, H = { x: 40, y: 245 };
  return (
    <g transform={`translate(${x},${y}) scale(${k})`}>
      <rect x={-16} y={-16} width={552} height={352} rx={6} fill="#6a5038" />
      <rect x={0} y={0} width={520} height={320} fill="#efe4c8" />
      {/* lago Superior (mitad oeste) */}
      <path d="M60,240 Q120,200 200,170 Q280,120 380,90 Q460,70 520,40 L520,220 Q440,190 380,160 Q330,175 300,200 Q220,215 150,245 Q100,262 70,258 Z" fill="#7fb0d0" />
      <path d="M340,120 q12,-8 26,-2 q4,10 -10,14 q-14,0 -16,-12 Z" fill="#c8b88a" stroke="#6a5a3a" strokeWidth={1.5} />
      {[{ x: 380, y: 100 }, { x: 395, y: 118 }, { x: 410, y: 96 }, { x: 372, y: 82 }].map((q, i) => <ellipse key={i} cx={q.x} cy={q.y} rx={7} ry={4} fill="#c8b88a" />)}
      <text x={210} y={190} fontFamily="Georgia, serif" fontStyle="italic" fontSize={20} fill="#3a5a78">Lake Superior</text>
      {[["DULUTH", D], ["BAYFIELD", B], ["HERMANTOWN", H]].map(([t, p]: any) => (
        <g key={t}><circle cx={p.x} cy={p.y} r={5} fill="#3a2a20" /><text x={p.x + 8} y={p.y + (t === "HERMANTOWN" ? 22 : -8)} fontFamily="Arial" fontWeight={700} fontSize={13} fill="#3a2a20">{t}</text></g>
      ))}
      {isla > 0 && <g><Halo x={I.x - 6} y={I.y - 10} r={60} color={AMBAR} fuerza={0.8 * isla} /><circle cx={I.x - 6} cy={I.y - 10} r={6 + 3 * Math.sin(f / 6)} fill={AMBAR} opacity={isla} /><text x={I.x - 70} y={I.y - 30} fontFamily="Arial" fontWeight={700} fontSize={13} fill="#7a3a10" opacity={isla}>MADELINE IS.</text></g>}
      {linea > 0 && <path d={`M${D.x},${D.y} Q${200},${120} ${I.x - 6},${I.y - 10}`} stroke={AMBAR} strokeWidth={4} strokeDasharray="10 8" fill="none" pathLength={1} strokeDashoffset={0} opacity={linea} />}
      {ruta > 0 && <path d={`M${I.x - 6},${I.y - 10} L${B.x},${B.y} Q${200},${250} ${H.x},${H.y}`} stroke="#c0352c" strokeWidth={4} strokeDasharray="8 7" fill="none" opacity={ruta} />}
    </g>
  );
};

// arbolito de Navidad viejo clavado en la nieve (marca el ice road)
export const Arbolito: React.FC<{ x: number; y: number; s?: number; seed?: number; nieve?: boolean }> = ({ x, y, s = 1, seed = 0, nieve = true }) => {
  const inc = (random(`ab${seed}`) - 0.5) * 10;
  return (
    <g transform={`translate(${x},${y}) scale(${s}) rotate(${inc})`}>
      <rect x={-4} y={-30} width={8} height={34} fill="#4a3020" />
      {[0, 1, 2].map((k) => <path key={k} d={`M0,${-130 + k * 32} L${-30 - k * 9},${-72 + k * 32} L${30 + k * 9},${-72 + k * 32} Z`} fill={k % 2 ? "#2f5a3e" : "#3a6a48"} />)}
      {nieve && [0, 1, 2].map((k) => <path key={k} d={`M${-12 - k * 6},${-96 + k * 32} Q0,${-104 + k * 32} ${12 + k * 6},${-96 + k * 32} L${6 + k * 4},${-92 + k * 32} L${-6 - k * 4},${-92 + k * 32} Z`} fill="#eef3fb" />)}
      <ellipse cx={0} cy={4} rx={26} ry={6} fill="#dfe6f2" />
    </g>
  );
};

// barreno de hielo (manual). Origen en el mango (para enManoD), largo 220 hacia abajo
export const Barreno: React.FC<{ s?: number; giro?: number }> = ({ s = 1, giro = 0 }) => (
  <g transform={`scale(${s}) rotate(90)`}>
    <rect x={-30} y={-6} width={60} height={12} rx={6} fill="#2a2a30" />
    <rect x={-4} y={0} width={8} height={170} fill="#6a7684" />
    {Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M-22,${110 + i * 16 + ((giro * 16) % 16)} Q0,${100 + i * 16 + ((giro * 16) % 16)} 22,${110 + i * 16 + ((giro * 16) % 16)}`} stroke="#8a96a4" strokeWidth={5} fill="none" />)}
    <path d="M-4,206 L0,222 L4,206 Z" fill="#8a96a4" />
  </g>
);

// termómetro de alcohol en el marco de la ventana. grados °F (−30 … 40)
export const Termometro: React.FC<{ x: number; y: number; grados: number; s?: number }> = ({ x, y, grados, s = 1 }) => {
  const u = Math.max(0, Math.min(1, (grados + 30) / 70));
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-22} y={-200} width={44} height={230} rx={10} fill="#efe6d2" />
      {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={-16} y={-180 + i * 22} width={i % 2 ? 8 : 14} height={2} fill="#6a5a48" />)}
      <rect x={-4} y={-186} width={8} height={196} rx={4} fill="#fff" stroke="#c9bfa8" strokeWidth={1.5} />
      <rect x={-4} y={10 - 196 * u} width={8} height={196 * u} rx={4} fill="#d83a2e" />
      <circle cx={0} cy={16} r={11} fill="#d83a2e" />
    </g>
  );
};

// cruz de madera chica (para la línea de tiempo "la gente se moría de un dolor de panza"), sin nada macabro
export const Cruz: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-5} y={-70} width={10} height={74} fill="#6a5038" /><rect x={-24} y={-54} width={48} height={9} fill="#6a5038" />
    <ellipse cx={0} cy={4} rx={30} ry={6} fill="#dfe6f2" />
  </g>
);

// vela encendida (on 0..1). Para la cuenta de dosis "by candlelight" y la línea de tiempo
export const Vela: React.FC<{ x: number; y: number; on?: number; f?: number; s?: number }> = ({ x, y, on = 1, f = 0, s = 1 }) => {
  const t = 1 + 0.08 * Math.sin(f / 2.7 + x);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {on > 0.02 && <Halo x={0} y={-50} r={120 * t} color="#ffc56a" fuerza={0.5 * on} />}
      <rect x={-9} y={-44} width={18} height={44} rx={3} fill="#f2e8d2" />
      <rect x={-1} y={-52} width={2} height={9} fill="#2a2420" />
      {on > 0.02 && <path d={`M0,${-54 - 18 * t} Q8,-56 0,-50 Q-8,-56 0,${-54 - 18 * t} Z`} fill="#ffd98a" opacity={on} />}
    </g>
  );
};

// palangana con agua y jabón
export const Palangana: React.FC<{ x: number; y: number; espuma?: number; f?: number }> = ({ x, y, espuma = 0, f = 0 }) => (
  <g transform={`translate(${x},${y})`}>
    <path d="M-90,-50 L90,-50 L66,0 L-66,0 Z" fill="#c9d3dc" />
    <ellipse cx={0} cy={-50} rx={90} ry={14} fill="#e6edf2" />
    <ellipse cx={0} cy={-48} rx={78} ry={9} fill="#9fc8de" />
    {espuma > 0 && Array.from({ length: 12 }).map((_, i) => <circle key={i} cx={-60 + i * 11} cy={-52 - Math.abs(Math.sin(f / 9 + i)) * 10 * espuma} r={5 + (i % 3) * 2} fill="#fff" opacity={0.8 * espuma} />)}
    <rect x={100} y={-26} width={40} height={24} rx={8} fill="#e8d8a8" />
  </g>
);

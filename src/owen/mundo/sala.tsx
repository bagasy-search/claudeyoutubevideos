// Dos interiores chicos (sesión B, ob04-06):
// - <Living>: el living de Rosa (planta baja del two-flat): sofá, tele vieja, foto de familia, lámpara de pie, Virgen,
//   ventana a Paulina St. Piso LIV_PISO. Puntos LIV_PUNTOS (sofa = centro del sofá, asiento = altura de cadera sentado).
// - <Descanso>: el break room del garaje de la 74th: mesa con la caja de donas, microondas, cafetera, lockers.
//   Piso DES_PISO. Puntos DES_PUNTOS (mesa, lockers, cafetera). <CajaDonas> va aparte para animarla (Owen se la come).
import React from "react";
import { random } from "remotion";
import { Charco, Halo, LamparaColgante } from "../../anikit/luz";
import { F_HUD } from "../../anikit/pantalla";
import { Planta, SetProps, acl, osc, mezclar } from "../../anikit/sets/comun";
import { Hora, LUCES } from "./hora";
import { SkylineChi } from "./calle";

export const LIV_PISO = 900;
export const LIV_PUNTOS = { sofa: 1000, asiento: 70, tele: 300, lampara: 1420, ventana: 1750, foto: 1000, puerta: 2150 };

const Cielo: React.FC<{ hora: Hora; id: string }> = ({ hora, id }) => {
  const L = LUCES[hora];
  return (
    <g>
      <defs><linearGradient id={id} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={L.cielo[0]} /><stop offset="0.6" stopColor={L.cielo[1]} /><stop offset="1" stopColor={L.cielo[2]} /></linearGradient></defs>
      <rect x={-2000} y={-1400} width={7000} height={3200} fill={`url(#${id})`} />
      <Halo x={1700} y={L.solY} r={380} color={L.sol} fuerza={0.5} />
      <SkylineChi x0={600} piso={760} hora={hora} esc={0.7} />
      {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={-400 + i * 400} y={500 + (i % 3) * 40} width={360} height={800} fill={mezclar(["#7a3f34", "#9a4a36", "#6e4a3e"][i % 3], L.cielo[1], 0.35)} />)}
    </g>
  );
};

export const Living: React.FC<SetProps & { hora?: Hora; tele?: boolean }> = ({ capa, f, hora = "noche", tele = true }) => {
  const L = LUCES[hora];
  const P = LIV_PISO;
  const noche = L.ventanas > 0.5;
  if (capa === "lejos") return <Cielo hora={hora} id="livcielo" />;
  if (capa === "frente") return <g><rect x={2300} y={-600} width={60} height={2000} fill="#3a2a22" /></g>;
  const muro = noche ? "#a8786a" : "#d9a88a";
  return (
    <g>
      <defs><clipPath id="livpared"><path clipRule="evenodd" d={`M-800,-600 H4000 V${P + 300} H-800 Z M1600,${P - 620} H1900 V${P - 260} H1600 Z`} /></clipPath></defs>
      <g clipPath="url(#livpared)">
        <rect x={-800} y={-600} width={4800} height={P + 900} fill={muro} />
        {/* empapelado de rayas suaves */}
        {Array.from({ length: 60 }).map((_, i) => <rect key={i} x={-800 + i * 80} y={-600} width={30} height={P + 300} fill={acl(muro, 0.06)} />)}
        <rect x={-800} y={P - 260} width={4800} height={260} fill={osc(muro, 0.85)} />
        <rect x={-800} y={P - 266} width={4800} height={12} fill="#6a4a36" />
        <Halo x={LIV_PUNTOS.lampara} y={P - 560} r={900} color="#ffcf7a" fuerza={noche ? 0.55 : 0.2} />
      </g>
      <rect x={1588} y={P - 632} width={324} height={384} fill="none" stroke="#efe6d4" strokeWidth={16} />
      <rect x={1745} y={P - 620} width={10} height={360} fill="#efe6d4" />
      <path d={`M1570,${P - 640} Q1610,${P - 440} 1580,${P - 240} L1530,${P - 240} Q1550,${P - 440} 1520,${P - 640} Z`} fill="#c9463a" />
      <path d={`M1930,${P - 640} Q1890,${P - 440} 1920,${P - 240} L1970,${P - 240} Q1950,${P - 440} 1980,${P - 640} Z`} fill="#c9463a" />
      {/* foto de familia: Rosa, Dee y Owen chicos */}
      <g transform={`translate(${LIV_PUNTOS.foto},${P - 560})`}>
        <rect x={-130} y={-80} width={260} height={160} rx={6} fill="#f4efe4" stroke="#9a6a38" strokeWidth={10} />
        {[-70, 0, 70].map((x, i) => <g key={i}><circle cx={x} cy={-14} r={i === 1 ? 24 : 18} fill="#17100d" /><rect x={x - 20} y={12} width={40} height={50} rx={10} fill={["#3fa39a", "#b8463c", "#a8d4f0"][i]} /></g>)}
      </g>
      {/* Virgen (manto con estrellas) y crucifijo chico */}
      <g transform={`translate(${LIV_PUNTOS.foto - 420},${P - 600})`}>
        <rect x={-50} y={-70} width={100} height={140} rx={6} fill="#f4efe4" stroke="#c99b5a" strokeWidth={6} />
        <path d="M0,-52 Q34,-16 30,54 L-30,54 Q-34,-16 0,-52 Z" fill="#2f7a6a" />
        <ellipse cx={0} cy={-28} rx={12} ry={14} fill="#e9c9a0" />
        {Array.from({ length: 8 }).map((_, i) => <circle key={i} cx={-18 + (i % 3) * 18} cy={-2 + Math.floor(i / 3) * 18} r={2.2} fill="#f2c14a" />)}
      </g>
      {/* tele vieja sobre mueble */}
      <rect x={LIV_PUNTOS.tele - 150} y={P - 170} width={300} height={170} fill="#6a4a36" />
      <rect x={LIV_PUNTOS.tele - 140} y={P - 160} width={130} height={70} rx={4} fill="#5a3e2e" />
      <rect x={LIV_PUNTOS.tele - 120} y={P - 350} width={240} height={180} rx={18} fill="#2b2b30" />
      <rect x={LIV_PUNTOS.tele - 104} y={P - 334} width={208} height={146} rx={10} fill={tele ? "#6a8acc" : "#1a1c22"} />
      {tele && <><rect x={LIV_PUNTOS.tele - 104} y={P - 334 + ((f * 3) % 146)} width={208} height={4} fill="#fff" opacity={0.15} /><Halo x={LIV_PUNTOS.tele} y={P - 260} r={360} color="#8ab0ff" fuerza={noche ? 0.4 : 0.1} /></>}
      {/* sofá (mirando a cámara un cuarto: largo y bajo) */}
      <g transform={`translate(${LIV_PUNTOS.sofa},${P})`}>
        <rect x={-330} y={-250} width={660} height={150} rx={44} fill="#5a7aa0" />
        <rect x={-350} y={-130} width={700} height={110} rx={30} fill="#6a8ab0" />
        <rect x={-385} y={-200} width={76} height={190} rx={32} fill="#4e6e94" />
        <rect x={309} y={-200} width={76} height={190} rx={32} fill="#4e6e94" />
        <rect x={-290} y={-230} width={130} height={96} rx={22} fill="#f2c14a" transform="rotate(-8 -225 -182)" />
        <path d="M-200,-250 h340 v40 h-340 Z" fill="#e9dcc4" opacity={0.85} />
        {Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M${-190 + i * 44},-250 l22,40`} stroke="#c9463a" strokeWidth={6} opacity={0.6} />)}
        <rect x={-330} y={-20} width={20} height={20} fill="#2a2a2a" /><rect x={310} y={-20} width={20} height={20} fill="#2a2a2a" />
      </g>
      {/* mesita ratona */}
      <rect x={LIV_PUNTOS.sofa - 160} y={P - 96} width={320} height={16} rx={6} fill="#8a5a36" />
      <rect x={LIV_PUNTOS.sofa - 140} y={P - 80} width={12} height={80} fill="#6a4a2a" /><rect x={LIV_PUNTOS.sofa + 128} y={P - 80} width={12} height={80} fill="#6a4a2a" />
      {/* lámpara de pie */}
      <rect x={LIV_PUNTOS.lampara - 4} y={P - 540} width={8} height={540} fill="#3a2a22" />
      <path d={`M${LIV_PUNTOS.lampara - 70},${P - 540} L${LIV_PUNTOS.lampara + 70},${P - 540} L${LIV_PUNTOS.lampara + 45},${P - 640} L${LIV_PUNTOS.lampara - 45},${P - 640} Z`} fill="#f0d9a0" />
      <Planta x={2050} y={P} s={0.9} f={f} seed={8} />
      {/* piso de madera + alfombra */}
      <rect x={-800} y={P} width={4800} height={600} fill="#8a5a3a" />
      {Array.from({ length: 10 }).map((_, i) => <rect key={i} x={-800} y={P + 14 + i * 24} width={4800} height={2} fill="#6e4630" />)}
      <path d={`M${LIV_PUNTOS.sofa - 520},${P + 22} L${LIV_PUNTOS.sofa + 520},${P + 22} L${LIV_PUNTOS.sofa + 600},${P + 130} L${LIV_PUNTOS.sofa - 600},${P + 130} Z`} fill="#b8463c" opacity={0.85} />
      {[0, 1, 2].map((i) => <path key={i} d={`M${LIV_PUNTOS.sofa - 520 - i * 20},${P + 46 + i * 28} L${LIV_PUNTOS.sofa + 520 + i * 20},${P + 46 + i * 28}`} stroke="#f2c14a" strokeWidth={4} opacity={0.7} />)}
      <Charco x={LIV_PUNTOS.lampara} y={P + 40} rx={600} color="#ffcf7a" fuerza={noche ? 0.5 : 0.15} />
    </g>
  );
};

// ---------- break room del garaje ----------
export const DES_PISO = 900;
export const DES_PUNTOS = { mesa: 1000, lockers: 1800, cafetera: 420, puerta: 2300, silla: 1180 };

// caja de donas: abierta, n donas (0..6), mordida 0..1 = cuánto queda de la caja (ob06: se come la caja)
export const CajaDonas: React.FC<{ x: number; y: number; n?: number; caja?: number; s?: number; rot?: number }> = ({ x, y, n = 6, caja = 1, s = 1, rot = 0 }) => {
  const cols = ["#e9759a", "#7a4a2a", "#f2e6c8", "#e9759a", "#f2c14a", "#7a4a2a"];
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <defs><clipPath id={`cdm${Math.round(x)}`}><path d={`M-120,-200 H${-120 + 240 * caja} l-14,30 l18,24 l-16,30 l14,30 l-12,200 H-120 Z`} /></clipPath></defs>
      <g clipPath={`url(#cdm${Math.round(x)})`}>
        <path d="M-110,0 L110,0 L120,-30 L-120,-30 Z" fill="#d9b48a" />
        <path d="M-120,-30 L120,-30 L100,-130 L-100,-130 Z" fill="#e9c9a0" stroke="#c99b6a" strokeWidth={3} />
        <circle cx={0} cy={-80} r={26} fill="#e9759a" /><circle cx={0} cy={-80} r={9} fill="#e9c9a0" />
        <text x={0} y={-36} fontFamily={F_HUD} fontWeight={600} fontSize={16} fill="#8a4a2a" textAnchor="middle">DONUTS</text>
      </g>
      {Array.from({ length: n }).map((_, i) => (
        <g key={i} transform={`translate(${-80 + (i % 3) * 80},${-14 - Math.floor(i / 3) * 8})`}>
          <ellipse cx={0} cy={0} rx={32} ry={14} fill="#d99a5a" />
          <ellipse cx={0} cy={-4} rx={28} ry={11} fill={cols[i]} />
          <ellipse cx={0} cy={-4} rx={8} ry={4} fill="#b8783a" />
        </g>
      ))}
    </g>
  );
};

export const Descanso: React.FC<SetProps & { hora?: Hora }> = ({ capa, f, hora = "alba" }) => {
  const L = LUCES[hora];
  const P = DES_PISO;
  if (capa === "lejos") return <Cielo hora={hora} id="descielo" />;
  if (capa === "frente") return <g />;
  return (
    <g>
      <defs><clipPath id="despared"><path clipRule="evenodd" d={`M-800,-600 H4000 V${P + 300} H-800 Z M700,${P - 640} H1200 V${P - 360} H700 Z`} /></clipPath></defs>
      <g clipPath="url(#despared)">
        <rect x={-800} y={-600} width={4800} height={P + 900} fill="#cfd2c4" />
        <rect x={-800} y={P - 320} width={4800} height={320} fill="#9aa08e" />
        {Array.from({ length: 12 }).map((_, r) => <rect key={r} x={-800} y={-600 + r * 70} width={4800} height={2} fill="#b9bdb0" />)}
      </g>
      <rect x={690} y={P - 650} width={520} height={300} fill="none" stroke="#5a5e56" strokeWidth={14} />
      {Array.from({ length: 4 }).map((_, i) => <rect key={i} x={700} y={P - 640 + i * 70} width={500} height={6} fill="#5a5e56" opacity={0.7} />)}
      {/* tubo de techo que titila */}
      <rect x={700} y={-20} width={500} height={16} rx={8} fill="#fbfff0" opacity={random(`tt${Math.floor(f / 3)}`) > 0.04 ? 1 : 0.4} />
      <Halo x={950} y={0} r={900} color="#f4ffe8" fuerza={0.35} />
      {/* tablero de anuncios */}
      <rect x={1300} y={P - 640} width={340} height={230} fill="#b8864a" />
      {[["SAFETY FIRST", "#f4efe4"], ["OT SIGN-UP", "#f2e27a"], ["UNION MTG FRI", "#bfe0f2"]].map(([t, c], i) => <g key={i} transform={`translate(${1320 + i * 104},${P - 620}) rotate(${(i - 1) * 4})`}><rect width={96} height={120} fill={c} /><text x={48} y={30} fontFamily={F_HUD} fontWeight={600} fontSize={11} fill="#333" textAnchor="middle">{t}</text>{[0, 1, 2, 3].map((k) => <rect key={k} x={12} y={46 + k * 16} width={72} height={4} fill="#999" />)}</g>)}
      {/* mesada con cafetera y microondas */}
      <rect x={DES_PUNTOS.cafetera - 300} y={P - 280} width={560} height={280} fill="#6a6e64" />
      <rect x={DES_PUNTOS.cafetera - 310} y={P - 296} width={580} height={20} rx={4} fill="#e2e0d6" />
      <rect x={DES_PUNTOS.cafetera - 260} y={P - 420} width={180} height={124} rx={8} fill="#e9e9e2" /><rect x={DES_PUNTOS.cafetera - 250} y={P - 410} width={120} height={104} rx={4} fill="#2a2e2a" />
      <rect x={DES_PUNTOS.cafetera + 40} y={P - 440} width={100} height={144} rx={10} fill="#2a2a2e" /><rect x={DES_PUNTOS.cafetera + 58} y={P - 360} width={64} height={56} rx={8} fill="#5a3a24" opacity={0.85} />
      {/* lockers */}
      {Array.from({ length: 6 }).map((_, i) => (
        <g key={i} transform={`translate(${DES_PUNTOS.lockers - 300 + i * 104},${P - 560})`}>
          <rect width={98} height={560} fill={["#3f5b7a", "#45607e"][i % 2]} />
          {[0, 1, 2].map((k) => <rect key={k} x={22} y={30 + k * 14} width={54} height={6} rx={3} fill="#2a3a4a" />)}
          <rect x={74} y={260} width={12} height={40} rx={4} fill="#c9ced2" />
          <text x={49} y={120} fontFamily={F_HUD} fontWeight={600} fontSize={18} fill="#c9d6e2" textAnchor="middle">{214 + i}</text>
        </g>
      ))}
      {/* mesa y sillas */}
      <rect x={DES_PUNTOS.mesa - 260} y={P - 220} width={520} height={20} rx={6} fill="#c9c2a8" />
      <rect x={DES_PUNTOS.mesa - 230} y={P - 200} width={14} height={200} fill="#6a6e64" /><rect x={DES_PUNTOS.mesa + 216} y={P - 200} width={14} height={200} fill="#6a6e64" />
      <rect x={-800} y={P} width={4800} height={600} fill="#7a7e72" />
      {Array.from({ length: 30 }).map((_, i) => <rect key={i} x={-800 + i * 160} y={P} width={3} height={600} fill="#6a6e62" />)}
      <Charco x={950} y={P + 40} rx={900} color="#f4ffe8" fuerza={0.2} />
      <Planta x={-200} y={P} s={0.0001} />
      {L && null}
    </g>
  );
};

// SETS NUEVOS DEL EP.5 (lc-c). Todos con piso 900 y las 3 capas; la luz sale de anikit/luz (degradés con alfa).
//  · Farmacia   — la farmacia de St. Mary's de noche: puertas con cinta (−250), cartel PHARMACY (650), 3 góndolas (900…2350),
//                 estante militar verde (2500…2950), heladera (3150), mostrador con la caja dorada (3550).
//  · GranjaLiving — el living de la granja de Marcus = quirófano a farol: escalera al altillo (100), sillón de Lily (800),
//                 suero (1080), ventanal (1250…1750), estufa (2050), mesa larga (2400…3000), heladera con las reglas (3300).
//  · RadioGus   — el altillo: ventanita (300), mesa con la radio HF (900), mapa del lago (1350…1870).
//  · Granero    — por dentro: henil arriba (200…1250, piso del henil 480), escalera (1320), alambique (2200).
//  · Mural      — pared oscura de pizarrón para los viajes en el tiempo (los dibujos van como hijos con <Tiza>).
import React from "react";
import { interpolate, random } from "remotion";
import { Charco, Cono, Halo, Haces, Polvo } from "../../anikit/luz";
import { Cielo, Colinas, SetProps, acl, mezclar, osc } from "../../anikit/sets/comun";
import { F_MANO } from "../../anikit/pantalla";
import { AMBAR, ROJO_CENSO } from "../elenco";
import { Estrellas, NieveCae } from "../mundo/comun";
import { Estufa } from "../mundo/casa";
import { Hora, LUCES } from "../mundo/hora";
import { EstanteFarmacia, FarolMano, MapaLago, RadioHF, Suero, Vela, CajaRemedio } from "./piezas";

const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// trazo de tiza que se dibuja (pathLength = 1)
export const Tiza: React.FC<{ d: string; f: number; desde: number; dur?: number; color?: string; ancho?: number; o?: number }> = ({ d, f, desde, dur = 18, color = "#f2ead8", ancho = 6, o = 0.9 }) => {
  const u = interpolate(f, [desde, desde + dur], [0, 1], cl);
  if (u <= 0) return null;
  return <path d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - u} stroke={color} strokeWidth={ancho} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={o} />;
};
// texto escrito EN el mundo (pizarra, pared): se revela de izquierda a derecha
export const Escrito: React.FC<{ t: string; x: number; y: number; f: number; desde: number; tam?: number; color?: string; vel?: number; ancla?: "start" | "middle"; fuente?: string }> = ({ t, x, y, f, desde, tam = 40, color = "#f2ead8", vel = 1.4, ancla = "start", fuente = F_MANO }) => {
  const n = Math.floor(interpolate(f, [desde, desde + Math.max(6, t.length * vel)], [0, t.length], cl));
  if (f < desde) return null;
  return <text x={x} y={y} textAnchor={ancla} fontFamily={fuente} fontWeight={700} fontSize={tam} fill={color}>{t.slice(0, n)}</text>;
};

// =============================== FARMACIA ===============================
export const FAR_PISO = 900;
export const FAR_PUNTOS = { puerta: -250, cartel: 650, gondola1: 1100, gondola2: 1600, gondola3: 2100, militar: 2720, heladera: 3150, mostrador: 3550, oro: 3550 };
type PF = SetProps & { luces?: number; vaciar?: number; apagar?: number; militar?: number; oro?: number; cinta?: number; heladera?: boolean; polvo?: number; frascosTurbios?: number };

export const Farmacia: React.FC<PF> = ({ capa, f, luces = 0, vaciar = 0, apagar = 0, militar = 1, oro = 0, cinta = 0, heladera = true, polvo = 1, frascosTurbios = 0 }) => {
  const P = FAR_PISO;
  if (capa === "lejos") return <g><rect x={-3000} y={-2000} width={9000} height={5000} fill="#141626" /></g>;
  if (capa === "frente") return <g>{polvo > 0 && <Polvo x={-200} y={P - 760} w={3900} h={720} n={70} f={f} seed={51} color="#cfd8ff" tam={2.2} />}</g>;
  const pared = mezclar("#2a2c44", "#5a6280", luces);
  const tono = (i: number) => (random(`fa${i}`) < apagar ? 0.15 : 1);
  return (
    <g>
      <rect x={-1200} y={-800} width={6000} height={P + 800} fill={pared} />
      <rect x={-1200} y={P - 140} width={6000} height={140} fill={osc(pared, 0.82)} />
      {/* luces de techo apagadas */}
      {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={-300 + i * 480} y={60} width={300} height={22} rx={6} fill={luces > 0.3 ? "#f4f8ff" : "#30344c"} />)}
      {/* cartel PHARMACY con cruz */}
      <g transform={`translate(${FAR_PUNTOS.cartel},170)`}>
        <rect x={-260} y={-60} width={520} height={120} rx={16} fill="#20243a" stroke="#4a5070" strokeWidth={6} />
        <g transform="translate(-180,0)"><rect x={-14} y={-40} width={28} height={80} fill="#3fb88a" /><rect x={-40} y={-14} width={80} height={28} fill="#3fb88a" /></g>
        <text x={50} y={18} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={58} letterSpacing={5} fill="#e8eef6">PHARMACY</text>
      </g>
      {/* puertas de vidrio con la cinta cruzada del Ep.1 */}
      <g>
        <rect x={-560} y={P - 600} width={600} height={600} fill="#1c2034" />
        <rect x={-540} y={P - 580} width={270} height={580} fill="#2c3a5a" opacity={0.7} /><rect x={-250} y={P - 580} width={270} height={580} fill="#2c3a5a" opacity={0.7} />
        <path d={`M-520,${P - 560} L-120,${P - 60}`} stroke="#f2e6a0" strokeWidth={26} opacity={1 - cinta} />
        <path d={`M-120,${P - 560} L-520,${P - 60}`} stroke="#f2e6a0" strokeWidth={26} opacity={1 - cinta} />
      </g>
      {/* piso de linóleo */}
      <rect x={-1200} y={P} width={6000} height={1600} fill="#3a3e58" />
      {Array.from({ length: 40 }).map((_, i) => <rect key={i} x={-1200 + i * 150} y={P} width={2} height={1600} fill="#2a2e44" />)}
      {/* góndolas */}
      {[0, 1, 2].map((g) => <EstanteFarmacia key={g} x={880 + g * 500} y={P} w={440} pisos={5} llenado={1 - vaciar} seed={g + 3} tono={tono} />)}
      {/* frascos de jarabe que se vuelven turbios */}
      {frascosTurbios > 0 && Array.from({ length: 5 }).map((_, i) => <g key={i}><rect x={1410 + i * 60} y={P - 290} width={40} height={64} rx={8} fill={mezclar("#c98a5a", "#6a6a5a", frascosTurbios)} opacity={1 - 0.5 * frascosTurbios} /><rect x={1416 + i * 60} y={P - 304} width={28} height={16} fill="#e8e4dc" /></g>)}
      {/* estante militar: cajas verdes sin logos */}
      <g opacity={militar}>
        <rect x={2500} y={P - 600} width={460} height={600} fill="#2e3828" />
        {Array.from({ length: 4 }).map((_, r) => Array.from({ length: 4 }).map((__, c) => (r * 4 + c) / 16 < 1 - vaciar ? <g key={`${r}${c}`}><rect x={2520 + c * 110} y={P - 130 - r * 140} width={96} height={100} rx={4} fill={r % 2 ? "#4f6a3a" : "#5a7442"} /><rect x={2532 + c * 110} y={P - 112 - r * 140} width={70} height={14} fill="#d8d2b0" /></g> : null))}
        {Array.from({ length: 4 }).map((_, r) => <rect key={r} x={2500} y={P - 30 - r * 140} width={460} height={10} fill="#1e261a" />)}
      </g>
      {/* heladera de farmacia apagada */}
      {heladera && <g>
        <rect x={3020} y={P - 640} width={260} height={640} rx={10} fill="#c8ccd6" />
        <rect x={3040} y={P - 620} width={220} height={580} fill={luces > 0.3 ? "#dff2ff" : "#3a4258"} />
        {[0, 1, 2, 3].map((r) => <rect key={r} x={3040} y={P - 500 + r * 120} width={220} height={6} fill="#8a92a8" />)}
        <rect x={3266} y={P - 480} width={8} height={120} rx={3} fill="#8a92a8" />
      </g>}
      {/* mostrador con la caja dorada */}
      <rect x={3380} y={P - 260} width={520} height={260} fill="#4a4e6a" /><rect x={3360} y={P - 280} width={560} height={26} rx={4} fill="#6a6e8a" />
      {oro > 0 && <g>
        <Halo x={FAR_PUNTOS.oro} y={P - 330} r={360} color="#ffcf6e" fuerza={0.75 * oro} />
        <rect x={FAR_PUNTOS.oro - 90} y={P - 400} width={180} height={120} rx={8} fill={mezclar("#8a7a5a", "#ffcf3a", oro)} stroke="#a8781a" strokeWidth={5} />
        <rect x={FAR_PUNTOS.oro - 30} y={P - 360} width={60} height={46} rx={6} fill="#5a4a2a" /><path d={`M${FAR_PUNTOS.oro - 20},${P - 360} v-20 a20,20 0 0 1 40,0 v20`} stroke="#5a4a2a" strokeWidth={8} fill="none" />
      </g>}
    </g>
  );
};

// =============================== LIVING DE LA GRANJA ===============================
export const GL_PISO = 900;
export const GL_PUNTOS = { escalera: 100, sillon: 800, suero: 1080, ventana: 1500, estufa: 2050, mesa: 2700, heladera: 3300, farol: 1300, reloj: 2450 };
export const GL_PIZARRA = { x: 3195, y: 900 - 540 }; // esquina sup. izq. del papel de la heladera
type PG = SetProps & { hora?: Hora; farol?: number; fuego?: number; suero?: number; sueroNivel?: number; pano?: number; libros?: number; reglas?: { t: string; desde: number; tilde?: number; color?: string }[]; sol?: number; cae?: boolean; mesaLarga?: boolean };

export const GranjaLiving: React.FC<PG> = ({ capa, f, hora = "noche", farol = 1, fuego = 0.8, suero = 0, sueroNivel = 0.8, pano = 0, libros = 0, reglas = [], sol = 0, cae = false }) => {
  const P = GL_PISO;
  const L = LUCES[hora];
  const V = { x: 1250, y: 250, w: 500, h: 400 };
  if (capa === "lejos") return (
    <g>
      <Cielo c={L.cielo} />
      <Estrellas f={f} o={L.estrellas} />
      <Colinas y={700} alto={90} color={osc(L.tinte, 0.55)} seed={9} />
      {/* el granero rojo a lo lejos, por la ventana */}
      <g transform="translate(1100,700)"><rect x={0} y={-150} width={220} height={150} fill={osc("#b8382c", hora === "noche" ? 0.45 : 0.9)} /><path d="M-14,-150 L110,-230 L234,-150 Z" fill={osc("#5a2a22", 0.8)} /></g>
      <rect x={-2000} y={700} width={8000} height={800} fill={L.nieve} />
      {cae && <NieveCae f={f} n={100} x0={-400} w={3200} y0={-200} h={1200} />}
    </g>
  );
  if (capa === "frente") return <g />;
  const pared = mezclar("#5a3e2e", "#8a6a4a", sol * 0.6);
  return (
    <g>
      <rect x={-1500} y={P} width={7000} height={1600} fill="#3a2618" /><rect x={-1500} y={P} width={7000} height={10} fill="#2a1a10" />
      {Array.from({ length: 40 }).map((_, i) => <rect key={i} x={-1500 + i * 180} y={P} width={3} height={1600} fill="#2e1e12" />)}
      <path d={`M-900,-600 H4400 V${P} H-900 Z M${V.x},${V.y} V${V.y + V.h} H${V.x + V.w} V${V.y} Z`} fill={pared} fillRule="evenodd" />
      {Array.from({ length: 30 }).map((_, i) => <rect key={i} x={-900} y={-600 + i * 52} width={5300} height={3} fill={osc(pared, 0.85)} />)}
      <rect x={-900} y={P - 120} width={5300} height={120} fill={osc(pared, 0.78)} />
      <rect x={V.x - 16} y={V.y - 16} width={V.w + 32} height={V.h + 32} fill="none" stroke="#e8d9b5" strokeWidth={16} />
      <rect x={V.x + V.w / 2 - 6} y={V.y} width={12} height={V.h} fill="#e8d9b5" /><rect x={V.x} y={V.y + V.h / 2 - 6} width={V.w} height={12} fill="#e8d9b5" />
      <path d={`M${V.x},${V.y + V.h} q60,-40 40,-110 q40,60 90,110 Z`} fill="#eef4ff" opacity={0.5} />
      {sol > 0 && <Haces x={V.x + V.w / 2} y={V.y + 40} ang={-24} largo={900} n={4} ancho={110} color="#ffe6a8" fuerza={0.22 * sol} f={f} seed={3} />}
      {/* escalera al altillo */}
      <g>{Array.from({ length: 9 }).map((_, i) => <rect key={i} x={-60 + i * 30} y={P - 70 - i * 70} width={220} height={16} fill="#7a5032" />)}<path d={`M-80,${P} L200,${P - 640}`} stroke="#5a3a24" strokeWidth={20} /><rect x={-260} y={P - 660} width={560} height={20} fill="#4a3020" /></g>
      {/* sillón */}
      <g>
        <rect x={560} y={P - 250} width={480} height={150} rx={30} fill="#7a3a3a" />
        <rect x={560} y={P - 130} width={480} height={90} rx={18} fill="#8a4646" />
        <rect x={520} y={P - 200} width={70} height={170} rx={26} fill="#6a3030" /><rect x={1010} y={P - 200} width={70} height={170} rx={26} fill="#6a3030" />
        {[600, 1000].map((x) => <rect key={x} x={x} y={P - 40} width={18} height={40} fill="#3a2010" />)}
      </g>
      {suero > 0 && <g opacity={suero}><Suero x={GL_PUNTOS.suero} piso={P} f={f} lleno={sueroNivel} via={{ x: 820, y: P - 160 }} /></g>}
      {/* reloj de pared */}
      <g transform={`translate(${GL_PUNTOS.reloj},260)`}><circle r={52} fill="#efe6d2" stroke="#5a3a24" strokeWidth={8} /><rect x={-3} y={-38} width={6} height={40} fill="#2a2018" transform={`rotate(${f * 0.5})`} /><rect x={-3} y={-28} width={6} height={30} fill="#2a2018" transform={`rotate(${f * 0.04})`} /></g>
      <Estufa x={GL_PUNTOS.estufa} piso={P} f={f} fuego={fuego} />
      {/* mesa larga de la cocina */}
      <rect x={2380} y={P - 180} width={640} height={22} rx={4} fill="#8a5a36" />
      {[2400, 2990].map((x) => <rect key={x} x={x} y={P - 158} width={18} height={158} fill="#5a3a24" />)}
      {pano > 0 && <g opacity={pano}>
        <path d={`M2390,${P - 186} H3010 L3030,${P - 120} H2370 Z`} fill="#f4f2ec" />
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M${2520 + i * 110},${P - 186} q30,-26 60,0`} fill="#e6e2da" />)}
      </g>}
      {libros > 0 && <g opacity={libros}>
        {[0, 1, 2].map((i) => <rect key={i} x={2460 + i * 40} y={P - 210 - i * 22} width={150} height={22} rx={3} fill={["#2f5a7a", "#7a3a3a", "#5a6a3a"][i]} />)}
        <rect x={2760} y={P - 200} width={70} height={16} rx={2} fill={ROJO_CENSO} />
      </g>}
      {/* heladera con las reglas */}
      <rect x={3160} y={P - 580} width={280} height={580} rx={16} fill="#e8e4dc" /><rect x={3160} y={P - 390} width={280} height={8} fill="#c8c4bc" />
      <rect x={GL_PIZARRA.x} y={GL_PIZARRA.y} width={210} height={200 + Math.max(0, reglas.length - 4) * 34} fill="#fdf6d8" />
      {reglas.map((r, i) => (
        <g key={i}>
          <Escrito t={r.t} x={GL_PIZARRA.x + 12} y={GL_PIZARRA.y + 36 + i * 34} f={f} desde={r.desde} tam={23} color={r.color ?? "#1d3a8a"} vel={0.8} />
          {r.tilde !== undefined && <Tiza d={`M${GL_PIZARRA.x + 180},${GL_PIZARRA.y + 26 + i * 34} l8,10 l18,-24`} f={f} desde={r.tilde} dur={8} color="#2f9a4a" ancho={5} o={1} />}
        </g>
      ))}
      {/* farol colgado del techo (la luz del quirófano) */}
      <path d={`M${GL_PUNTOS.farol},-600 V180`} stroke="#2a2420" strokeWidth={4} />
      <FarolMano x={GL_PUNTOS.farol} y={290} on={farol} f={f} s={1.3} halo={0} />
      {farol > 0.02 && <><Halo x={GL_PUNTOS.farol} y={240} r={1100} color="#ffc56a" fuerza={0.5 * farol * (0.95 + 0.05 * Math.sin(f / 3.1))} /><Charco x={GL_PUNTOS.farol - 300} y={P + 6} rx={900} color="#ffc56a" fuerza={0.35 * farol} /></>}
    </g>
  );
};

// =============================== ALTILLO: LA RADIO DE GUS ===============================
export const RG_PISO = 900;
export const RG_PUNTOS = { ventana: 300, mesa: 900, radio: 900, mapa: 1610, silla: 760 };
type PR = SetProps & { hora?: Hora; luzRadio?: number; aguja?: number; isla?: number; linea?: number; ruta?: number; lampara?: number };

export const RadioGus: React.FC<PR> = ({ capa, f, hora = "noche", luzRadio = 0.6, aguja = 0.3, isla = 0, linea = 0, ruta = 0, lampara = 0.7 }) => {
  const P = RG_PISO;
  const L = LUCES[hora];
  if (capa === "lejos") return <g><Cielo c={L.cielo} /><Estrellas f={f} o={L.estrellas} /><rect x={-2000} y={720} width={8000} height={800} fill={L.nieve} /></g>;
  if (capa === "frente") return <g />;
  const pared = "#4e3628";
  return (
    <g>
      <rect x={-1500} y={P} width={6000} height={1600} fill="#3a2618" />
      {/* paredes bajo el techo a dos aguas, ventanita */}
      <path d={`M-900,-600 H3200 V${P} H-900 Z M200,330 h200 v200 h-200 Z`} fill={pared} fillRule="evenodd" />
      {Array.from({ length: 22 }).map((_, i) => <rect key={i} x={-900 + i * 190} y={-600} width={4} height={P + 600} fill={osc(pared, 0.82)} />)}
      <path d="M-900,-200 L1100,-560 L3200,-160 L3200,-600 L-900,-600 Z" fill={osc(pared, 0.7)} />
      {[[-900, -200, 1100, -560], [1100, -560, 3200, -160]].map(([a, b, c, d], i) => <path key={i} d={`M${a},${b} L${c},${d}`} stroke="#3a2418" strokeWidth={40} />)}
      <rect x={190} y={320} width={220} height={220} fill="none" stroke="#e8d9b5" strokeWidth={14} /><rect x={294} y={330} width={12} height={200} fill="#e8d9b5" />
      {/* mapa */}
      <MapaLago x={RG_PUNTOS.mapa - 260} y={200} w={520} isla={isla} linea={linea} ruta={ruta} f={f} />
      {/* mesa y radio */}
      <rect x={560} y={P - 300} width={700} height={24} rx={4} fill="#7a5032" />
      {[580, 1220].map((x) => <rect key={x} x={x} y={P - 276} width={20} height={276} fill="#5a3a24" />)}
      <RadioHF x={RG_PUNTOS.radio} y={P - 300} f={f} luz={luzRadio} aguja={aguja} />
      {/* lámpara de escritorio */}
      <g transform={`translate(1180,${P - 300})`}><rect x={-30} y={-10} width={60} height={10} fill="#2a2420" /><path d="M0,-10 L-30,-110 L10,-150" stroke="#2a2420" strokeWidth={6} fill="none" /><path d="M-10,-170 L40,-170 L30,-130 Z" fill="#3a5a4a" /></g>
      {lampara > 0 && <><Cono x={1195} y={P - 450} alto={170} ancho={260} boca={40} color="#ffd88a" fuerza={0.3 * lampara} /><Halo x={1100} y={P - 330} r={420} color="#ffd88a" fuerza={0.35 * lampara} /></>}
      <Halo x={RG_PUNTOS.radio} y={P - 380} r={600} color="#7dffb0" fuerza={0.16 * luzRadio} />
      {/* silla */}
      <g><rect x={700} y={P - 180} width={150} height={16} fill="#6a4a30" /><rect x={700} y={P - 380} width={16} height={380} fill="#5a3a24" /><rect x={836} y={P - 164} width={14} height={164} fill="#5a3a24" /></g>
    </g>
  );
};

// =============================== GRANERO POR DENTRO ===============================
export const GR_PISO = 900;
export const GR_HENIL = 480; // y del piso del henil
export const GR_PUNTOS = { henil: 700, lily: 760, escalera: 1320, alambique: 2200, puerta: 2900 };
type PGr = SetProps & { farol?: number; alambique?: number; vapor?: number; hora?: Hora };

export const Granero: React.FC<PGr> = ({ capa, f, farol = 1, alambique = 0, vapor = 0, hora = "noche" }) => {
  const P = GR_PISO, H = GR_HENIL;
  const L = LUCES[hora];
  if (capa === "lejos") return <g><Cielo c={L.cielo} /><rect x={-2000} y={700} width={8000} height={800} fill={L.nieve} /></g>;
  if (capa === "frente") return <g>{Array.from({ length: 30 }).map((_, i) => <rect key={i} x={-1500 + i * 200 + random(`gh${i}`) * 80} y={P - 4} width={50} height={4} fill="#d8b860" opacity={0.6} transform={`rotate(${random(`gr${i}`) * 30 - 15} ${-1500 + i * 200} ${P})`} />)}</g>;
  const tabla = "#6a3428";
  return (
    <g>
      <rect x={-1500} y={P} width={6000} height={1600} fill="#4a3424" />
      {/* paredes de tablas verticales, puerta entreabierta a la noche */}
      <path d={`M-900,-600 H3600 V${P} H-900 Z M2800,${P - 520} h260 v520 h-260 Z`} fill={tabla} fillRule="evenodd" />
      {Array.from({ length: 40 }).map((_, i) => <rect key={i} x={-900 + i * 115} y={-600} width={6} height={P + 600} fill={osc(tabla, 0.75)} />)}
      <path d="M-900,-300 L1300,-640 L3600,-300" stroke="#3a1c14" strokeWidth={50} fill="none" />
      {[-400, 400, 1300, 2200, 3000].map((x) => <rect key={x} x={x} y={-400} width={36} height={P + 400} fill="#4a2418" />)}
      {/* henil */}
      <rect x={-100} y={H} width={1400} height={34} fill="#5a3420" />
      <path d={`M-100,${H} Q100,${H - 120} 300,${H - 60} Q500,${H - 150} 760,${H - 70} Q1000,${H - 140} 1280,${H} Z`} fill="#d9b25a" />
      {Array.from({ length: 30 }).map((_, i) => <path key={i} d={`M${-80 + i * 46},${H - 20 - random(`hh${i}`) * 60} l${random(`hx${i}`) * 30 - 15},-20`} stroke="#b88a3a" strokeWidth={3} />)}
      {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={i * 220} y={H + 34} width={30} height={P - H - 34} fill="#4a2a1a" />)}
      {/* fardos abajo */}
      {[[60, 0], [240, 0], [150, 1]].map(([x, r], i) => <g key={i}><rect x={x} y={P - 90 - r * 90} width={170} height={90} rx={8} fill="#d0a64e" /><rect x={x + 40} y={P - 90 - r * 90} width={6} height={90} fill="#a07a2a" /><rect x={x + 124} y={P - 90 - r * 90} width={6} height={90} fill="#a07a2a" /></g>)}
      {/* escalera al henil */}
      <g>{[0, 1].map((k) => <rect key={k} x={GR_PUNTOS.escalera - 50 + k * 100} y={H - 40} width={14} height={P - H + 40} fill="#8a5a36" transform={`rotate(-8 ${GR_PUNTOS.escalera} ${P})`} />)}{Array.from({ length: 7 }).map((_, i) => <rect key={i} x={GR_PUNTOS.escalera - 40} y={P - 60 - i * 62} width={100} height={10} fill="#8a5a36" transform={`rotate(-8 ${GR_PUNTOS.escalera} ${P})`} />)}</g>
      {/* alambique: olla a presión sobre un anafe + serpentina de cobre + balde */}
      {alambique > 0 && <g opacity={alambique}>
        <rect x={2000} y={P - 170} width={380} height={170} fill="#5a4a3a" />
        <rect x={2060} y={P - 190} width={120} height={20} fill="#2a2a30" />
        <rect x={2050} y={P - 330} width={140} height={140} rx={16} fill="#b8bec8" /><rect x={2040} y={P - 340} width={160} height={18} rx={6} fill="#8a909a" /><rect x={2110} y={P - 372} width={20} height={34} fill="#5a5e66" />
        <path d={`M2130,${P - 372} Q2200,${P - 440} 2260,${P - 380}`} stroke="#c8743a" strokeWidth={10} fill="none" />
        {Array.from({ length: 5 }).map((_, i) => <ellipse key={i} cx={2290} cy={P - 360 + i * 30} rx={44} ry={12} fill="none" stroke="#d8843a" strokeWidth={9} />)}
        <path d={`M2290,${P - 210} V${P - 190}`} stroke="#d8843a" strokeWidth={8} />
        <path d={`M2250,${P - 190} L2330,${P - 190} L2320,${P - 100} L2260,${P - 100} Z`} fill="#8aa0b8" />
        {vapor > 0 && Array.from({ length: 4 }).map((_, i) => <circle key={i} cx={2120 + Math.sin(f / 7 + i) * 14} cy={P - 400 - ((f * 1.6 + i * 30) % 120)} r={14 + i * 3} fill="#fff" opacity={vapor * 0.35 * (1 - ((f * 1.6 + i * 30) % 120) / 120)} />)}
        <Halo x={2120} y={P - 180} r={200} color="#ff8a3a" fuerza={0.35 * alambique} />
      </g>}
      {/* farol colgado de la viga */}
      <path d={`M900,-400 V200`} stroke="#2a2420" strokeWidth={4} />
      <FarolMano x={900} y={300} on={farol} f={f} s={1.2} halo={0} />
      {farol > 0.02 && <><Halo x={900} y={250} r={1000} color="#ffc56a" fuerza={0.5 * farol} /><Charco x={900} y={P + 6} rx={700} color="#ffc56a" fuerza={0.3 * farol} /></>}
      <Polvo x={200} y={0} w={1800} h={800} n={40} f={f} seed={8} color="#ffe2a0" />
    </g>
  );
};

// =============================== MURAL (viajes en el tiempo) ===============================
export const MUR_PISO = 900;
type PM = SetProps & { tono?: string; luz?: string; velas?: { x: number; on: number }[]; piso?: boolean };
export const Mural: React.FC<PM> = ({ capa, f, tono = "#1e2230", luz = "#ffcf6e", velas = [], piso = true }) => {
  const P = MUR_PISO;
  if (capa === "lejos") return <g><rect x={-3000} y={-2000} width={9000} height={5000} fill={osc(tono, 0.7)} /></g>;
  if (capa === "frente") return <g />;
  return (
    <g>
      <rect x={-2000} y={-1200} width={8000} height={P + 1200} fill={tono} />
      {Array.from({ length: 40 }).map((_, i) => <rect key={i} x={-2000 + i * 200} y={-1200} width={3} height={P + 1200} fill={acl(tono, 0.06)} />)}
      <Halo x={960} y={420} r={1400} color={luz} fuerza={0.12} />
      {piso && <><rect x={-2000} y={P} width={8000} height={400} fill={osc(tono, 0.6)} /><rect x={-2000} y={P} width={8000} height={8} fill={acl(tono, 0.12)} /></>}
      {velas.map((v, i) => <Vela key={i} x={v.x} y={P} on={v.on} f={f} s={1.4} />)}
    </g>
  );
};
export { CajaRemedio, AMBAR };

// =============================== PASILLO DE LA FARMACIA (perspectiva, = miniatura del Ep.5) ===============================
// punto de fuga PF; estanterías a los dos lados que convergen, cartel PHARMACY con cruz en la pared derecha, ventana al fondo.
export const PAS_PISO = 900;
export const PAS_PF = { x: 640, y: 560 };
type PP = SetProps & { llenado?: number; fondoLuz?: number; luzFarol?: { x: number; y: number; on: number } };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const PasilloFarmacia: React.FC<PP> = ({ capa, f, llenado = 0.35, fondoLuz = 0.6, luzFarol }) => {
  const V = PAS_PF;
  if (capa === "lejos") return <g><rect x={-3000} y={-2000} width={9000} height={5000} fill="#0f1426" /></g>;
  if (capa === "frente") return <g><Polvo x={-400} y={0} w={2800} h={1000} n={60} f={f} seed={77} color="#ffd890" tam={2.6} /></g>;
  // un punto del borde (X,Y) llevado hacia el punto de fuga con t (0 = borde, 1 = fondo)
  const hacia = (X: number, Y: number, t: number) => [lerp(X, V.x, t), lerp(Y, V.y, t)];
  const ladoI = { x0: -500, top: -500, bot: 1500 }, ladoD = { x0: 2500, top: -500, bot: 1500 };
  const prof = 0.86; // hasta dónde llegan las estanterías
  const poli = (pts: number[][]) => pts.map((p) => p.join(",")).join(" ");
  const estantes = (L: typeof ladoI, sgn: 1 | -1, seed: number) => {
    const els: React.ReactNode[] = [];
    const [ax, ay] = hacia(L.x0, L.top, prof), [bx, by] = hacia(L.x0, L.bot, prof);
    els.push(<polygon key="p" points={poli([[L.x0, L.top], [ax, ay], [bx, by], [L.x0, L.bot]])} fill="#1f2a44" />);
    const ts = [0, 0.32, 0.52, 0.65, 0.74, 0.8, 0.84, prof];
    ts.forEach((t, k) => { const [x1, y1] = hacia(L.x0, L.top, t), [x2, y2] = hacia(L.x0, L.bot, t); els.push(<path key={`u${k}`} d={`M${x1},${y1} L${x2},${y2}`} stroke="#4a5a7c" strokeWidth={lerp(26, 3, t / prof)} />); });
    // estantes (líneas que convergen) + cajitas
    for (let r = 0; r < 7; r++) {
      const Y = L.top + 160 + r * 240;
      const [x2, y2] = hacia(L.x0, Y, prof);
      els.push(<path key={`s${r}`} d={`M${L.x0},${Y} L${x2},${y2}`} stroke="#5d6e92" strokeWidth={14} />);
      for (let c = 0; c < 6; c++) {
        if (random(`pc${seed}-${r}-${c}`) > llenado) continue;
        const t = ts[c] + (ts[c + 1] - ts[c]) * random(`pt${seed}-${r}-${c}`) * 0.6;
        const [bx2, by2] = hacia(L.x0, Y, t);
        const esc = 1 - t / prof * 0.85;
        els.push(<rect key={`c${r}${c}`} x={bx2 - (sgn > 0 ? 0 : 70 * esc)} y={by2 - 64 * esc} width={70 * esc} height={58 * esc} rx={3} fill={["#c8ccd6", "#d8d2c0", "#a8b8c8"][(r + c) % 3]} opacity={0.85} />);
      }
    }
    return els;
  };
  const [fx1, fy1] = hacia(ladoI.x0, ladoI.top, prof), [fx2, fy2] = hacia(ladoD.x0, ladoD.bot, prof);
  return (
    <g>
      {/* techo y piso */}
      <polygon points={poli([[-500, -500], [2500, -500], [fx2, fy1], [fx1, fy1]])} fill="#141c34" />
      {Array.from({ length: 6 }).map((_, i) => { const [x1, y1] = hacia(-500 + i * 600, -500, 0), [x2, y2] = hacia(-500 + i * 600, -500, prof); return <path key={i} d={`M${x1},${y1} L${x2},${y2}`} stroke="#1f2a48" strokeWidth={4} />; })}
      <polygon points={poli([[-500, 1500], [2500, 1500], [fx2, fy2], [fx1, fy2]])} fill="#1a2238" />
      {/* fondo: pared con ventana iluminada */}
      <rect x={fx1} y={fy1} width={fx2 - fx1} height={fy2 - fy1} fill="#1b2440" />
      <rect x={V.x - 30} y={V.y - 60} width={60} height={70} fill="#5a7ab8" opacity={fondoLuz} />
      <Halo x={V.x} y={V.y - 20} r={260} color="#7aa0e8" fuerza={0.35 * fondoLuz} />
      {estantes(ladoI, 1, 1)}
      {estantes(ladoD, -1, 2)}
      {/* cartel PHARMACY con cruz en la pared derecha */}
      <g transform="translate(1620,40) skewY(-14)">
        <rect x={0} y={0} width={360} height={120} fill="#2a3656" />
        <text x={180} y={80} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={58} letterSpacing={3} fill="#9fb0d0">PHARMACY</text>
      </g>
      <g transform="translate(1500,-60) skewY(-14)"><rect x={-20} y={-60} width={40} height={140} fill="#2a3656" /><rect x={-60} y={-20} width={120} height={40} fill="#2a3656" /></g>
      {/* cajas tiradas en el piso y reflejo húmedo */}
      {[[-200, 1260], [80, 1180], [300, 1060], [1900, 1280], [2150, 1190]].map(([x, y], i) => <rect key={i} x={x} y={y} width={140 - i * 6} height={90 - i * 4} rx={4} fill="#c8c4b8" opacity={0.8} transform={`rotate(${(i % 2 ? 6 : -8)} ${x} ${y})`} />)}
      {luzFarol && luzFarol.on > 0 && <><Charco x={luzFarol.x} y={luzFarol.y + 40} rx={340} color="#ffb04a" fuerza={0.55 * luzFarol.on} /><Halo x={luzFarol.x} y={luzFarol.y - 40} r={420} color="#ffb04a" fuerza={0.6 * luzFarol.on} /></>}
    </g>
  );
};

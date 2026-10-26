// SETS DE LA CASA:
// · Barrio = calle residencial en la colina (piso BARRIO_PISO): el dúplex de madera de Theo en W 4th St (x 300), la
//   parada del bus 6 (x 900), casas vecinas y la CASA DE LADRILLO de la 7th Avenue East (x 1900, chimenea con `humo`).
//   El lago se ve abajo, detrás. props: hora · luces · nieve · cae · humo 0..1 · ventanaCasa 0..1
// · Living = el living de la casa de ladrillo (piso LIV_PISO), el único cuarto que se calefacciona en invierno:
//   pila de leña contra la pared (`lena` 0..1 = alto), colchones en el piso, estufa a leña (`fuego` 0..1), ventana al lago
//   (`luces` = la ciudad afuera, `plastico`), mantas en las puertas (`mantas`), estante de latas (`latas` 0..1),
//   alarma de CO (`alarma` titila), mesa con vela (`vela`) y la heladera con las reglas de June (`reglas` 0..3).
import React from "react";
import { random } from "remotion";
import { Charco, Halo, Haces, Polvo } from "../../anikit/luz";
import { Cielo, Ladrillos, SetProps, acl, osc } from "../../anikit/sets/comun";
import { F_MANO } from "../../anikit/pantalla";
import { AMBAR, ROJO_CENSO } from "../elenco";
import { Auto, Banco, Edificio, Estrellas, Farola, NieveCae, Vapor, prendida } from "./comun";
import { Hora, LUCES } from "./hora";

export const BARRIO_PISO = 900;
export const BARRIO_PUNTOS = { duplex: 300, parada: 900, casa: 1900, puertaCasa: 1900, vecina: 2700 };
export const LIV_PISO = 900;
export const LIV_PUNTOS = { lena: 380, colchones: 900, ventana: 1300, estufa: 1950, mesa: 2500, latas: 2800, heladera: 3250, puertaI: -60, alarma: 760 };

type PB = SetProps & { hora?: Hora; luces?: number; nieve?: number; cae?: boolean; humo?: number; ventanaCasa?: number };

const Casa: React.FC<{ x: number; piso: number; w: number; h: number; color: string; techo: string; luces: number; seed: string; nieve: number; ladrillo?: boolean; ventana?: number; dos?: boolean }> = ({ x, piso, w, h, color, techo, luces, seed, nieve, ladrillo, ventana, dos }) => (
  <g>
    <rect x={x - w / 2} y={piso - h} width={w} height={h} fill={color} />
    {ladrillo ? <Ladrillos x={x - w / 2} y={piso - h} w={w} h={h} color={osc(color, 0.75)} /> : Array.from({ length: Math.floor(h / 22) }).map((_, i) => <rect key={i} x={x - w / 2} y={piso - h + i * 22} width={w} height={3} fill={osc(color, 0.85)} />)}
    <path d={`M${x - w / 2 - 30},${piso - h} L${x},${piso - h - w * 0.38} L${x + w / 2 + 30},${piso - h} Z`} fill={techo} />
    {nieve > 0 && <path d={`M${x - w / 2 - 30},${piso - h} L${x},${piso - h - w * 0.38} L${x + w / 2 + 30},${piso - h} L${x + w / 2 + 10},${piso - h + 4} L${x},${piso - h - w * 0.38 + 18 * nieve} L${x - w / 2 - 10},${piso - h + 4} Z`} fill="#eef2fa" opacity={nieve} />}
    {[[-0.28, 0.35], [0.28, 0.35], [-0.28, 0.72], [0.28, 0.72]].map(([fx, fy], i) => {
      const lit = ventana !== undefined && i === 2 ? ventana : prendida(`${seed}${i}`, luces, 0.5) ? 1 : 0;
      return <g key={i}><rect x={x + fx * w - 34} y={piso - h + fy * h - 44} width={68} height={80} fill={osc(color, 0.6)} /><rect x={x + fx * w - 28} y={piso - h + fy * h - 38} width={56} height={68} fill={lit > 0.05 ? AMBAR : "#221c2a"} opacity={lit > 0.05 ? 0.5 + 0.5 * lit : 1} />{lit > 0.05 && ventana !== undefined && i === 2 && <Halo x={x + fx * w} y={piso - h + fy * h} r={180} color={AMBAR} fuerza={0.8 * lit} />}</g>;
    })}
    <rect x={x - 30} y={piso - 130} width={60} height={130} fill={osc(color, 0.5)} />
    {dos && <rect x={x + w / 2 - 90} y={piso - 130} width={56} height={130} fill={osc(color, 0.5)} />}
    <rect x={x - w / 2 - 20} y={piso - 16} width={w + 40} height={16} fill={osc(color, 0.6)} />
  </g>
);

const Humo: React.FC<{ x: number; y: number; f: number; o: number }> = ({ x, y, f, o }) => (
  <g opacity={o}>
    {Array.from({ length: 9 }).map((_, i) => {
      const t = ((f / 90 + i / 9) % 1);
      return <circle key={i} cx={x + t * 120 + Math.sin(f / 30 + i) * 12} cy={y - t * 320} r={16 + t * 46} fill="#cfd4e4" opacity={(1 - t) * 0.5} />;
    })}
  </g>
);

export const Barrio: React.FC<PB> = ({ capa, f, pal, hora = "dia", luces = 1, nieve = 0, cae = false, humo = 0, ventanaCasa }) => {
  const L = LUCES[hora];
  const P = BARRIO_PISO;
  if (capa === "lejos") {
    return (
      <g>
        <Cielo c={L.cielo} />
        <Estrellas f={f} o={L.estrellas} />
        <defs><linearGradient id="barlago" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={L.lago[0]} /><stop offset="1" stopColor={L.lago[1]} /></linearGradient></defs>
        <rect x={-2000} y={430} width={8000} height={300} fill="url(#barlago)" />
        <Vapor f={f} x0={-1500} w={5000} y={470} o={hora === "invierno" || hora === "noche" ? 0.5 : 0} />
        {Array.from({ length: 40 }).map((_, i) => <Edificio key={i} x={-1500 + i * 160} y={640} w={130} h={60 + random(`bl${i}`) * 100} color={osc(L.tinte, 0.5)} luces={luces} seed={`bl${i}`} techoNieve={nieve} detalle={false} />)}
        {Array.from({ length: 40 }).map((_, i) => prendida(`blv${i}`, luces, 0.7) ? <rect key={`v${i}`} x={-1470 + i * 160} y={600} width={14} height={14} fill={AMBAR} opacity={0.8} /> : null)}
      </g>
    );
  }
  if (capa === "frente") {
    return cae ? <NieveCae f={f} n={160} x0={-800} w={4600} /> : null;
  }
  return (
    <g>
      <rect x={-1500} y={P - 10} width={6000} height={1500} fill={nieve > 0.2 ? L.nieve : "#4a4252"} />
      <rect x={-1500} y={P + 150} width={6000} height={160} fill={osc(nieve > 0.2 ? L.nieve : "#4a4252", 0.72)} />
      <Banco x={-1500} w={6000} piso={P + 160} alto={40 * nieve} color={L.nieve} seed="bf" />
      <Casa x={300} piso={P} w={520} h={460} color="#5a6a7a" techo="#2a2232" luces={luces} seed="dup" nieve={nieve} dos />
      <Casa x={-400} piso={P} w={420} h={380} color="#7a6a52" techo="#2a2232" luces={luces} seed="v0" nieve={nieve} />
      {/* parada del bus 6 */}
      <g>
        <rect x={895} y={P - 300} width={10} height={300} fill="#2a2432" />
        <rect x={860} y={P - 360} width={80} height={70} rx={6} fill="#2f6a8a" />
        <text x={900} y={P - 308} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={50} fill="#ffffff">6</text>
        <text x={900} y={P - 368} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={18} fill="#e8d9b5">DTA</text>
      </g>
      <Casa x={1900} piso={P} w={600} h={520} color="#8a3a2e" techo="#2a1e22" luces={luces} seed="lad" nieve={nieve} ladrillo ventana={ventanaCasa} />
      <rect x={2060} y={P - 760} width={60} height={200} fill="#6a2a22" />
      <Humo x={2090} y={P - 770} f={f} o={humo} />
      <Casa x={2750} piso={P} w={460} h={420} color="#6a7a6a" techo="#2a2232" luces={luces} seed="v1" nieve={nieve} />
      <Casa x={3450} piso={P} w={480} h={400} color="#7a5a6a" techo="#2a2232" luces={luces} seed="v2" nieve={nieve} />
      <Farola x={1300} piso={P + 30} on={hora === "noche" ? luces : 0} />
      <Auto x={600} y={P + 160} color="#7a5a3a" tipo="pickup" nieve={nieve} s={1.1} />
    </g>
  );
};

type PLv = SetProps & { hora?: Hora; luces?: number; fuego?: number; lena?: number; latas?: number; mantas?: boolean; plastico?: boolean; alarma?: boolean; vela?: boolean; reglas?: number; nieveAfuera?: number; cae?: boolean };

// estufa a leña (x centro, piso). fuego 0..1
export const Estufa: React.FC<{ x: number; piso: number; f: number; fuego: number }> = ({ x, piso, f, fuego }) => (
  <g>
    <rect x={x - 26} y={-400} width={52} height={piso - 360 + 400} fill="#1c1a20" />
    <rect x={x - 110} y={piso - 300} width={220} height={250} rx={14} fill="#26222a" />
    <rect x={x - 120} y={piso - 312} width={240} height={22} rx={6} fill="#1c1a20" />
    {[-90, 70].map((d) => <rect key={d} x={x + d} y={piso - 50} width={20} height={50} fill="#1c1a20" />)}
    <rect x={x - 76} y={piso - 250} width={152} height={130} rx={10} fill={fuego > 0.05 ? "#ff8a3a" : "#120f14"} />
    {fuego > 0.05 && <>
      {Array.from({ length: 6 }).map((_, i) => {
        const h = 50 + 40 * Math.abs(Math.sin(f / 5 + i * 1.7)) * fuego;
        return <path key={i} d={`M${x - 60 + i * 24},${piso - 125} Q${x - 70 + i * 24},${piso - 125 - h * 0.6} ${x - 56 + i * 24 + Math.sin(f / 4 + i) * 6},${piso - 125 - h} Q${x - 42 + i * 24},${piso - 125 - h * 0.5} ${x - 48 + i * 24},${piso - 125} Z`} fill={i % 2 ? "#ffd27a" : "#ffb04a"} />;
      })}
      <Halo x={x} y={piso - 190} r={700} color="#ff9a4a" fuerza={0.55 * fuego * (0.92 + 0.08 * Math.sin(f / 3))} />
      <Charco x={x} y={piso + 4} rx={520} color="#ff9a4a" fuerza={0.45 * fuego} />
    </>}
    <rect x={x - 76} y={piso - 250} width={152} height={130} rx={10} fill="none" stroke="#3a343e" strokeWidth={10} />
  </g>
);

export const Living: React.FC<PLv> = ({ capa, f, pal, hora = "invierno", luces = 0, fuego = 1, lena = 0.5, latas = 1, mantas = true, plastico = false, alarma = false, vela = false, reglas = 2, nieveAfuera = 1, cae = false }) => {
  const P = LIV_PISO;
  const L = LUCES[hora];
  const V = { x: 1060, y: 230, w: 480, h: 420 };
  if (capa === "lejos") {
    // lo que se ve por la ventana: calle nevada, casas apagadas, el lago
    return (
      <g>
        <Cielo c={L.cielo} />
        <Estrellas f={f} o={L.estrellas} />
        <rect x={-2000} y={560} width={8000} height={200} fill={L.lago[1]} />
        {Array.from({ length: 30 }).map((_, i) => <Edificio key={i} x={-600 + i * 140} y={760} w={110} h={80 + random(`lv${i}`) * 140} color={osc(L.tinte, 0.45)} luces={luces} seed={`lv${i}`} techoNieve={nieveAfuera} />)}
        <rect x={-2000} y={740} width={8000} height={600} fill={L.nieve} />
        {cae && <NieveCae f={f} n={120} x0={-200} w={3000} y0={0} h={900} />}
      </g>
    );
  }
  if (capa === "frente") {
    return null;
  }
  const pared = "#5a4a5e";
  const nl = Math.round(14 * lena);
  return (
    <g>
      {/* pared con hueco de ventana (el hueco deja ver la capa lejos) */}
      <path d={`M-800,-1400 H4200 V${P} H-800 Z M${V.x},${V.y} V${V.y + V.h} H${V.x + V.w} V${V.y} Z`} fill={pared} fillRule="evenodd" />
      <rect x={-800} y={P - 140} width={5000} height={140} fill={osc(pared, 0.8)} />
      <rect x={-1500} y={P} width={6000} height={1400} fill="#3a2a22" />
      {Array.from({ length: 40 }).map((_, i) => <rect key={`tb${i}`} x={-1500 + i * 150} y={P} width={4} height={1400} fill="#2e2019" />)}
      <rect x={-1500} y={P} width={6000} height={10} fill="#2a1e18" />
      <rect x={V.x - 16} y={V.y - 16} width={V.w + 32} height={V.h + 32} fill="none" stroke="#e8d9b5" strokeWidth={16} />
      <rect x={V.x + V.w / 2 - 6} y={V.y} width={12} height={V.h} fill="#e8d9b5" />
      <rect x={V.x} y={V.y + V.h / 2 - 6} width={V.w} height={12} fill="#e8d9b5" />
      {plastico && <rect x={V.x - 30} y={V.y - 30} width={V.w + 60} height={V.h + 60} fill="#dfe8f4" opacity={0.22} stroke="#c8d4e4" strokeWidth={3} strokeDasharray="10 8" />}
      {/* escarcha en las esquinas */}
      {hora === "invierno" || hora === "noche" || hora === "tormenta" ? <path d={`M${V.x},${V.y + V.h} q60,-40 40,-120 q40,60 90,120 Z M${V.x + V.w},${V.y} q-70,30 -60,110 q-30,-70 -90,-110 Z`} fill="#eef4ff" opacity={0.55} /> : null}
      <rect x={V.x - 30} y={V.y + V.h + 16} width={V.w + 60} height={18} fill="#c8b48a" />
      {/* puerta izquierda y derecha con mantas */}
      {[-260, 3550].map((x) => <g key={x}><rect x={x} y={P - 620} width={240} height={620} fill="#2a2028" />{mantas && <><path d={`M${x - 10},${P - 630} H${x + 250} V${P - 10} Q${x + 120},${P + 6} ${x - 10},${P - 10} Z`} fill="#7a3a3a" /><path d={`M${x - 10},${P - 630} H${x + 250} V${P - 10} Q${x + 120},${P + 6} ${x - 10},${P - 10} Z`} fill="url(#cuadros)" opacity={0.5} /></>}</g>)}
      <defs><pattern id="cuadros" width={60} height={60} patternUnits="userSpaceOnUse"><rect width={60} height={60} fill="none" /><rect width={60} height={14} fill="#3a2a5a" opacity={0.6} /><rect width={14} height={60} fill="#3a2a5a" opacity={0.6} /></pattern></defs>
      {/* pila de leña contra la pared */}
      {Array.from({ length: nl }).map((_, r) => Array.from({ length: 7 }).map((__, c) => <g key={`${r}${c}`}><circle cx={60 + c * 92 + (r % 2) * 46} cy={P - 24 - r * 44} r={22} fill={r % 3 ? "#8a5a3a" : "#7a4a2e"} /><circle cx={60 + c * 92 + (r % 2) * 46} cy={P - 24 - r * 44} r={11} fill="#c89a6a" /></g>))}
      {/* colchones en el piso */}
      {[0, 1].map((k) => <g key={k}><rect x={600 + k * 330} y={P - 70} width={300} height={70} rx={14} fill={k ? "#c8c0d8" : "#d8c8b0"} /><rect x={610 + k * 330} y={P - 92} width={110} height={34} rx={14} fill="#f2ece0" /><path d={`M${700 + k * 330},${P - 72} q90,-26 196,0 l0,20 h-196 Z`} fill={k ? "#2f7f86" : "#b2342a"} opacity={0.85} /></g>)}
      {/* alarma de CO en la pared */}
      <g>
        <circle cx={LIV_PUNTOS.alarma} cy={P - 400} r={34} fill="#f2ece0" stroke="#bdb6a8" strokeWidth={4} />
        <circle cx={LIV_PUNTOS.alarma} cy={P - 400} r={7} fill={alarma && Math.floor(f / 5) % 2 ? "#ff3a2e" : "#5aff7a"} />
        {alarma && Math.floor(f / 5) % 2 === 0 && <Halo x={LIV_PUNTOS.alarma} y={P - 400} r={160} color="#ff3a2e" fuerza={0.8} />}
        <text x={LIV_PUNTOS.alarma} y={P - 352} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={14} fill="#e8d9b5">CO</text>
      </g>
      <Estufa x={LIV_PUNTOS.estufa} piso={P} f={f} fuego={fuego} />
      {/* mesa con vela y el cuaderno rojo */}
      <rect x={2320} y={P - 170} width={380} height={20} rx={4} fill="#7a5032" />
      {[2340, 2660].map((x) => <rect key={x} x={x} y={P - 150} width={16} height={150} fill="#5a3a24" />)}
      <rect x={2440} y={P - 186} width={70} height={16} rx={2} fill={ROJO_CENSO} />
      {vela && <g><rect x={2600} y={P - 230} width={16} height={60} fill="#f2ece0" /><path d={`M2608,${P - 230} q-8,-14 0,-30 q8,16 0,30 Z`} fill="#ffd27a" /><Halo x={2608} y={P - 250} r={300} color="#ffcf6e" fuerza={0.6 * (0.9 + 0.1 * Math.sin(f / 4))} /></g>}
      {/* estante de latas */}
      <rect x={2760} y={P - 560} width={320} height={14} fill="#6a4a30" /><rect x={2760} y={P - 400} width={320} height={14} fill="#6a4a30" /><rect x={2760} y={P - 240} width={320} height={14} fill="#6a4a30" />
      {[0, 1, 2].map((r) => Array.from({ length: 8 }).map((_, c) => (r * 8 + c) / 24 < latas ? <g key={`${r}${c}`}><rect x={2772 + c * 38} y={P - 606 + r * 160} width={30} height={46} rx={3} fill={["#c0352c", "#e0a23a", "#4a7a5a", "#3a5a8a"][(r + c) % 4]} /><rect x={2772 + c * 38} y={P - 590 + r * 160} width={30} height={14} fill="#f2ece0" /></g> : null))}
      {/* heladera con las reglas de June */}
      <rect x={3160} y={P - 560} width={260} height={560} rx={16} fill="#e8e4dc" /><rect x={3160} y={P - 380} width={260} height={8} fill="#c8c4bc" />
      <rect x={3390} y={P - 520} width={10} height={100} rx={4} fill="#a8a49c" />
      <rect x={3190} y={P - 540} width={180} height={150} fill="#fdf6d8" transform={`rotate(-2 3280 ${P - 465})`} />
      {["1. FRESH FOOD FIRST", "2. NOTHING RISKY ALONE", "3. ONE THING FOR FUN"].slice(0, reglas).map((t, i) => <text key={i} x={3200} y={P - 510 + i * 40} fontFamily={F_MANO} fontWeight={700} fontSize={17} fill="#1d3a8a">{t}</text>)}
      {fuego > 0.05 && <Polvo x={1500} y={P - 600} w={900} h={560} n={30} f={f} seed={4} color="#ffcf8a" />}
    </g>
  );
};

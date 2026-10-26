// SET · DULUTH DESDE LA COLINA (miniatura del Ep.1): mirador con baranda nevada en primer término (x −900…1400),
// el lago Superior a la izquierda con el Aerial Lift Bridge, y la ciudad en 3 filas de manzanas hacia la derecha con
// St. Mary's (la ventana del 4º piso). Piso del mirador: PANO_PISO. Mundo útil x −900 … 3800.
// props: hora · luces 0..1 (ciudad prendida) · ventana 0..1 (la del hospital) · nieve 0..1 (techos/suelo) · cae (nieva) · vapor 0..1
import React from "react";
import { random } from "remotion";
import { Halo } from "../../anikit/luz";
import { Arbol, Cielo, Colinas, SetProps, osc } from "../../anikit/sets/comun";
import { AMBAR } from "../elenco";
import { Auto, Banco, COLORES_AUTO, Edificio, Estrellas, NieveCae, Vapor, prendida } from "./comun";
import { Hora, LUCES } from "./hora";
import { PuenteLift } from "./puenteLift";

export const PANO_PISO = 900;
export const PANO_PUNTOS = { mirador: 420, puente: 640, hospital: 2620, centro: 2100, lago: 200 };
// la ventana del hospital (4º piso) en coordenadas del mundo
export const HOSP = { x: 2480, base: 760, w: 300, h: 420 };
export const VENT_HOSP = { x: HOSP.x + 12 + 46 * 2 + 12, y: HOSP.base - 30 - 62 * 4 + 16 };

type P = SetProps & { hora?: Hora; luces?: number; ventana?: number; nieve?: number; cae?: boolean; vapor?: number; puenteLuz?: number };

const FILAS = [
  { base: 640, x0: 980, x1: 3900, hMin: 50, hMax: 130, wMin: 70, wMax: 130, k: 0.7 },
  { base: 720, x0: 900, x1: 3900, hMin: 100, hMax: 230, wMin: 90, wMax: 170, k: 0.82 },
  { base: 830, x0: 1300, x1: 3900, hMin: 170, hMax: 360, wMin: 120, wMax: 210, k: 0.94 },
];

export const Panorama: React.FC<P> = ({ capa, f, pal, hora = "noche", luces = 1, ventana = 0, nieve = 0.6, cae = false, vapor = 0.5, puenteLuz }) => {
  const L = LUCES[hora];
  const P = PANO_PISO;
  if (capa === "lejos") {
    return (
      <g>
        <Cielo c={L.cielo} />
        <Estrellas f={f} o={L.estrellas} />
        <Halo x={1000} y={L.solY} r={520} color={L.sol} fuerza={hora === "noche" ? 0.25 : 0.7} />
        <circle cx={1000} cy={L.solY} r={hora === "noche" ? 34 : 60} fill={L.sol} opacity={hora === "dia" || hora === "invierno" ? 0.5 : 0.95} />
        <Colinas y={545} alto={50} color={osc(L.tinte, 0.55)} seed={3} />
        <defs>
          <linearGradient id="panolago" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={L.lago[0]} /><stop offset="1" stopColor={L.lago[1]} /></linearGradient>
        </defs>
        <rect x={-2000} y={540} width={8000} height={500} fill="url(#panolago)" />
        {Array.from({ length: 18 }).map((_, i) => <rect key={i} x={900 + (random(`rl${i}`) - 0.5) * 260 + Math.sin(f / 30 + i) * 8} y={556 + i * 10} width={50 + random(`rw${i}`) * 90} height={3} rx={2} fill={L.sol} opacity={0.45} />)}
        <PuenteLift x={380} y={640} W={560} H={300} color="#1b1520" luces={puenteLuz ?? luces} detalle={0.6} nieve={nieve * 0.8} />
        <Vapor f={f} x0={-1200} w={2800} y={620} o={vapor} />
      </g>
    );
  }
  if (capa === "frente") {
    return cae ? <NieveCae f={f} n={130} x0={-900} w={4800} y0={-300} h={1500} /> : null;
  }
  // medio: costa de Canal Park, 3 filas de ciudad, hospital, mirador con baranda
  const edif: React.ReactNode[] = [];
  FILAS.forEach((r, ri) => {
    let x = r.x0, i = 0;
    while (x < r.x1) {
      const w = r.wMin + random(`fw${ri}${i}`) * (r.wMax - r.wMin);
      const h = r.hMin + random(`fh${ri}${i}`) * (r.hMax - r.hMin);
      const col = osc(pal.fachada[(i + ri) % pal.fachada.length], r.k);
      if (!(ri === 1 && x + w > HOSP.x - 20 && x < HOSP.x + HOSP.w + 20))
        edif.push(<Edificio key={`${ri}-${i}`} x={x} y={r.base} w={w} h={h} color={col} luces={luces} seed={`pn${ri}${i}`} techoNieve={nieve} tanque={random(`tq${ri}${i}`) > 0.8} />);
      x += w + 6 + random(`fg${ri}${i}`) * 20;
      i++;
    }
    // calle con faroles delante de la fila
    edif.push(
      <g key={`c${ri}`}>
        <rect x={r.x0 - 200} y={r.base} width={r.x1 - r.x0 + 400} height={14} fill={osc(pal.calle, 0.9)} />
        {Array.from({ length: Math.floor((r.x1 - r.x0) / 110) }).map((_, k) => {
          const on = prendida(`fl${ri}${k}`, luces, 1.0);
          return on ? <circle key={k} cx={r.x0 + k * 110} cy={r.base + 4} r={3 + ri} fill="#ffd9a0" /> : null;
        })}
        {Array.from({ length: 6 }).map((_, k) => <Auto key={`a${k}`} x={r.x0 + 200 + random(`ax${ri}${k}`) * (r.x1 - r.x0 - 400)} y={r.base + 12} color={COLORES_AUTO[(k + ri) % COLORES_AUTO.length]} s={0.12 + ri * 0.06} nieve={nieve} />)}
      </g>,
    );
  });
  const ventOn = Math.max(0, Math.min(1, ventana));
  return (
    <g>
      {/* Canal Park: costa baja delante del lago */}
      <rect x={-1500} y={760} width={2600} height={200} fill={osc(pal.fachada[1], 0.7)} />
      {Array.from({ length: 11 }).map((_, i) => <Edificio key={`cp${i}`} x={-900 + i * 170} y={780} w={120 + random(`cpw${i}`) * 40} h={60 + random(`cph${i}`) * 80} color={osc(pal.fachada[i % 4], 0.72)} luces={luces} seed={`cp${i}`} techoNieve={nieve} />)}
      {/* la ladera de la ciudad que baja al lago (las manzanas se apoyan en ella) */}
      <path d={`M860,700 Q920,650 1000,640 L4000,630 L4000,1500 L860,1500 Z`} fill={osc(L.tinte, 0.42)} />
      {edif.slice(0, edif.length)}
      {/* St. Mary's: bloque alto con cartel y la ventana del 4º piso */}
      <Edificio x={HOSP.x} y={HOSP.base} w={HOSP.w} h={HOSP.h} color={osc("#4a3a52", 0.9)} luces={luces} seed="hosp" base={0.7} techoNieve={nieve} />
      <rect x={HOSP.x + 40} y={HOSP.base - HOSP.h - 34} width={220} height={30} rx={4} fill="#1b1520" />
      <text x={HOSP.x + 150} y={HOSP.base - HOSP.h - 12} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={20} fill={luces > 0.3 ? "#ffffff" : "#6a6070"} letterSpacing={2}>ST. MARY'S</text>
      <rect x={VENT_HOSP.x} y={VENT_HOSP.y} width={24} height={32} fill={ventOn > 0.1 ? "#fff1b8" : "#2a2230"} />
      {ventOn > 0.1 && <Halo x={VENT_HOSP.x + 12} y={VENT_HOSP.y + 16} r={90} color={AMBAR} fuerza={0.9 * ventOn} />}
      {/* mirador: ladera nevada, pinos y baranda de madera */}
      <path d={`M-1500,${P - 20} Q-300,${P - 60} 600,${P - 10} Q1100,${P + 20} 1500,${P + 70} Q2600,${P + 160} 4500,${P + 420} L4500,2400 L-1500,2400 Z`} fill={nieve > 0.2 ? L.nieve : "#3a3a3a"} />
      <path d={`M-1500,${P + 40} Q0,${P + 10} 1500,${P + 120} Q2600,${P + 220} 4500,${P + 500} L4500,2400 L-1500,2400 Z`} fill={osc(nieve > 0.2 ? L.nieve : "#3a3a3a", 0.86)} />
      {[-700, -520, -380].map((x, i) => <Arbol key={i} x={x} y={P - 20} s={1.3 + i * 0.15} copa={osc("#1f3a34", 0.8)} tipo="pino" />)}
      <g>
        {Array.from({ length: 14 }).map((_, i) => <rect key={i} x={-200 + i * 120} y={P - 120} width={16} height={130} fill="#3a2a22" />)}
        <rect x={-210} y={P - 124} width={1700} height={18} rx={4} fill="#4a3428" />
        <rect x={-210} y={P - 70} width={1700} height={12} rx={4} fill="#3a2a22" />
        {nieve > 0.2 && <rect x={-214} y={P - 136} width={1708} height={14} rx={7} fill={L.nieve} />}
      </g>
      <Banco x={-900} w={2400} piso={P + 30} alto={40 * nieve} color={L.nieve} seed="pm" />
    </g>
  );
};

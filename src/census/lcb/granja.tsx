// SET · LA GRANJA DE MARCUS EN HERMANTOWN (lc-b, Ep.3-4). Piso GRANJA_PISO. Mundo útil x −900 … 5600.
//   casa con estufa y porche (−250…450, termómetro del porche en 400) · granero rojo (800…1700: portón 1250,
//   pared pintada a la izquierda del portón, henil arriba) · silo 1850 · loma con el sótano de raíz (2150…2900, puerta 2500)
//   · campo de papa de 1 acre (3050…5000) · maíz al fondo del campo (4700…5600) · alambrado con zapallos 3000.
// props: hora · estacion ("invierno" | "barro" | "verano") · crec 0..1 (plantas) · helada 0..1 (escarcha + plantas negras)
//        · corte 0..1 (suelo del campo en corte, con las papas) · papas 0..1 (tamaño) · sotano 0..1 (corte del sótano)
//        · humo 0..1 (chimenea) · temp (°F del termómetro del porche) · tSot (°F del termómetro del sótano)
//        · pared: texto pintado en el granero [{ t, desde, x?, y?, tam?, color? }] (se pinta de izquierda a derecha)
import React from "react";
import { interpolate, random } from "remotion";
import { Charco, Halo } from "../../anikit/luz";
import { Arbol, Cielo, Colinas, Nube, Pajaros, SetProps, acl, mezclar, osc } from "../../anikit/sets/comun";
import { F_MANO } from "../../anikit/pantalla";
import { Banco, Estrellas, NieveCae } from "../mundo/comun";
import { Hora, LUCES } from "../mundo/hora";

export const GRANJA_PISO = 900;
export const GRANJA_PUNTOS = { casa: 100, porche: 380, termometro: 410, granero: 1250, pared: 1000, henil: 1250, silo: 1850, sotano: 2500, campo: 3500, campoFin: 5000, maiz: 5100, cerca: 3000 };
export const PARED = { x: 860, y: 330, w: 300, h: 340 }; // tablero blanco de la pared del granero (a la izquierda del portón)
export const PUERTA_GRANERO = { x: 1450, y: 470, w: 230, h: 430 }; // la puerta chica de la derecha (reloj del verano)

export type Pintura = { t: string; desde: number; x?: number; y?: number; tam?: number; color?: string; vel?: number };
type P = SetProps & { hora?: Hora; estacion?: "invierno" | "barro" | "verano"; crec?: number; helada?: number; corte?: number; papas?: number; sotano?: number; humo?: number; temp?: number; tSot?: number; pared?: Pintura[]; seca?: number };

const ROJO = "#b8382c";
const BLANCO = "#efe6d2";

// texto pintado EN el mundo: aparece de izquierda a derecha como un pincel (recto y limpio)
export const Pintado: React.FC<{ p: Pintura; f: number; base: { x: number; y: number } }> = ({ p, f, base }) => {
  const tam = p.tam ?? 54;
  const n = p.t.length;
  const prog = interpolate(f, [p.desde, p.desde + n * (p.vel ?? 1.4)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (prog <= 0) return null;
  const lineas = p.t.split("\n");
  const id = `pin${Math.round(base.x)}${p.desde}${n}`;
  const w = Math.max(...lineas.map((l) => l.length)) * tam * 0.62;
  return (
    <g>
      <defs><clipPath id={id}><rect x={base.x + (p.x ?? 0) - 10} y={base.y + (p.y ?? 0) - tam} width={(w + 20) * prog} height={tam * 1.25 * lineas.length + 20} /></clipPath></defs>
      <g clipPath={`url(#${id})`}>
        {lineas.map((l, i) => (
          <text key={i} x={base.x + (p.x ?? 0)} y={base.y + (p.y ?? 0) + i * tam * 1.15} fontFamily={F_MANO} fontWeight={700} fontSize={tam} fill={p.color ?? "#2a1c18"}>{l}</text>
        ))}
      </g>
    </g>
  );
};

// termómetro de pared (°F): bulbo + columna roja; escala 0-110
export const Termometro: React.FC<{ x: number; y: number; temp: number; s?: number; marca?: [number, number] }> = ({ x, y, temp, s = 1, marca }) => {
  const h = 150;
  const nivel = (t: number) => h * Math.max(0, Math.min(1, t / 110));
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-22} y={-h - 30} width={44} height={h + 56} rx={10} fill="#efe6d2" stroke="#6a5240" strokeWidth={3} />
      {marca && <rect x={-20} y={-nivel(marca[1]) - 4} width={40} height={nivel(marca[1]) - nivel(marca[0]) + 2} fill="#7cc46a" opacity={0.55} />}
      {[0, 20, 40, 60, 80, 100].map((t) => <rect key={t} x={8} y={-nivel(t) - 1} width={10} height={2} fill="#6a5240" />)}
      <rect x={-5} y={-h - 6} width={10} height={h + 6} rx={5} fill="#d8d0c0" />
      <rect x={-5} y={-nivel(temp)} width={10} height={nivel(temp) + 4} rx={4} fill="#d8382c" />
      <circle cx={0} cy={12} r={13} fill="#d8382c" />
    </g>
  );
};

// tractor diésel viejo (verde, ruedas grandes atrás). x = centro, y = piso. rueda = giro (grados). humo 0..1 = escape.
export const Tractor: React.FC<{ x: number; y: number; dir?: 1 | -1; rueda?: number; humo?: number; f?: number; s?: number }> = ({ x, y, dir = 1, rueda = 0, humo = 0, f = 0, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${dir * s},${s})`}>
    <ellipse cx={0} cy={4} rx={190} ry={12} fill="#000" opacity={0.3} />
    <path d="M-150,-90 L-150,-170 L-60,-170 L-40,-120 L150,-110 L170,-70 L170,-50 L-150,-50 Z" fill="#3f7a3a" />
    <rect x={-150} y={-280} width={110} height={12} fill="#2c2a2a" />
    <rect x={-146} y={-270} width={8} height={100} fill="#2c2a2a" /><rect x={-52} y={-270} width={8} height={100} fill="#2c2a2a" />
    <rect x={-128} y={-200} width={60} height={34} rx={6} fill="#2c2a2a" />
    <rect x={60} y={-180} width={14} height={72} fill="#2c2a2a" />
    <rect x={40} y={-108} width={130} height={8} fill="#f2c14a" />
    {[0, 1].map((k) => (
      <g key={k} transform={`translate(${k ? 110 : -100},${k ? -40 : -70})`}>
        <circle r={k ? 40 : 70} fill="#1c1a1c" />
        <circle r={k ? 22 : 40} fill="#f2c14a" />
        {Array.from({ length: k ? 6 : 10 }).map((_, i) => <rect key={i} x={-3} y={-(k ? 40 : 70)} width={6} height={12} fill="#2c2a2a" transform={`rotate(${rueda * (k ? 1.7 : 1) + i * (k ? 60 : 36)})`} />)}
      </g>
    ))}
    {humo > 0 && Array.from({ length: 7 }).map((_, i) => {
      const t = ((f / 26 + i / 7) % 1);
      return <circle key={i} cx={67 - t * 60} cy={-185 - t * 160} r={10 + t * 34} fill="#3a3640" opacity={humo * (1 - t) * 0.6} />;
    })}
  </g>
);

// planta de papa (mata baja). crec 0..1 · helada 0..1 (hojas negras y caídas)
const Mata: React.FC<{ x: number; y: number; s: number; crec: number; helada: number; seed: number; f: number }> = ({ x, y, s, crec, helada, seed, f }) => {
  if (crec <= 0.02) return <ellipse cx={x} cy={y} rx={26 * s} ry={6 * s} fill="#4a3022" />;
  const verde = mezclar("#4f9a3c", "#1d2018", helada);
  const claro = mezclar("#7cc45a", "#2a2a22", helada);
  const h = (30 + 60 * crec) * s * (1 - helada * 0.55);
  const viento = Math.sin(f / 30 + seed) * 3 * (1 - helada);
  return (
    <g>
      <ellipse cx={x} cy={y} rx={34 * s} ry={7 * s} fill="#4a3022" />
      {Array.from({ length: 7 }).map((_, i) => {
        const a = -70 + i * 23 + (random(`mt${seed}${i}`) - 0.5) * 14;
        const r = (a * Math.PI) / 180;
        const L = h * (0.6 + random(`ml${seed}${i}`) * 0.5);
        const tx = x + Math.sin(r) * L * 0.8 + viento, ty = y - Math.cos(r) * L * (1 - helada * 0.4);
        return <ellipse key={i} cx={tx} cy={ty} rx={16 * s * (0.5 + crec * 0.6)} ry={11 * s * (0.5 + crec * 0.6)} fill={i % 2 ? verde : claro} transform={`rotate(${a + helada * 40} ${tx} ${ty})`} />;
      })}
      {crec > 0.7 && helada < 0.3 && Array.from({ length: 3 }).map((_, i) => <circle key={i} cx={x - 14 * s + i * 14 * s} cy={y - h - 6} r={4 * s} fill="#f4efe4" />)}
    </g>
  );
};

// papa (bajo tierra o en mano). s = tamaño
export const Papa: React.FC<{ x: number; y: number; s?: number; rot?: number; brotes?: number; color?: string }> = ({ x, y, s = 1, rot = 0, brotes = 0, color = "#c9935a" }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <ellipse rx={30} ry={21} fill={color} />
    <ellipse cx={-6} cy={-6} rx={18} ry={9} fill={acl(color, 0.25)} opacity={0.6} />
    {[[-14, 4], [8, -8], [14, 8], [-2, 12]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={2.4} fill={osc(color, 0.65)} />)}
    {brotes > 0 && [[-14, 4], [8, -8], [14, 8]].map(([a, b], i) => <path key={i} d={`M${a},${b} q${-4 + i * 4},${-10 * brotes} ${2 + i * 2},${-18 * brotes}`} stroke="#d8e8a0" strokeWidth={4} fill="none" strokeLinecap="round" />)}
  </g>
);

export const Granja: React.FC<P> = ({ capa, f, hora = "dia", estacion = "verano", crec = 1, helada = 0, corte = 0, papas = 1, sotano = 0, humo = 0.6, temp = 64, tSot = 39, pared = [], seca = 0 }) => {
  const L = LUCES[hora];
  const P = GRANJA_PISO;
  const nieve = estacion === "invierno" ? 1 : 0;
  const pasto = estacion === "invierno" ? L.nieve : mezclar(estacion === "barro" ? "#5f6a3a" : "#4f8a3a", "#8a7a4a", seca * 0.7);
  const noche = hora === "noche";
  if (capa === "lejos") {
    return (
      <g>
        <Cielo c={L.cielo} />
        {L.estrellas > 0 && <Estrellas f={f} o={L.estrellas} />}
        <Halo x={2600} y={L.solY} r={460} color={L.sol} fuerza={0.65} />
        <circle cx={2600} cy={L.solY} r={noche ? 46 : 70} fill={acl(L.sol, 0.4)} />
        {[[-600, 160, 1.3], [900, 110, 1], [2300, 190, 1.5], [3600, 130, 1.1], [4700, 220, 0.9]].map(([x, y, s], i) => <Nube key={i} x={(x as number) + f * 0.1 * (i + 1)} y={y as number} s={s as number} color={acl(L.cielo[1], 0.4)} o={noche ? 0.25 : 0.7} />)}
        {!noche && <Pajaros x={600} y={300} f={f} n={4} color={osc(L.cielo[1], 0.45)} />}
        <Colinas y={600} alto={170} color={mezclar(estacion === "invierno" ? "#8a96b8" : "#4f6f58", L.cielo[1], 0.35)} seed={3} />
        <Colinas y={660} alto={110} color={mezclar(estacion === "invierno" ? "#b9c2da" : "#41683e", L.tinte, 0.22)} seed={8} />
        {Array.from({ length: 40 }).map((_, i) => <Arbol key={i} x={-1500 + i * 190 + random(`gt${i}`) * 80} y={700 + random(`gy${i}`) * 20} s={0.42 + random(`gs${i}`) * 0.25} tipo="pino" copa={mezclar(estacion === "invierno" ? "#34465a" : "#244a30", L.tinte, 0.25)} tronco="#2a2420" />)}
        <rect x={-2000} y={700} width={9000} height={400} fill={mezclar(estacion === "invierno" ? L.nieve : "#5f8a44", L.tinte, 0.2)} />
        {estacion !== "invierno" && Array.from({ length: 6 }).map((_, k) => <rect key={k} x={-2000} y={712 + k * 14} width={9000} height={4} fill={osc("#5f8a44", 0.8)} opacity={0.5} />)}
      </g>
    );
  }
  if (capa === "frente") {
    return (
      <g>
        {/* postes del alambrado en primer término + pasto alto */}
        {Array.from({ length: 16 }).map((_, i) => <rect key={i} x={-900 + i * 420} y={P - 40} width={16} height={240} fill={osc("#6a4a32", noche ? 0.5 : 0.8)} />)}
        <rect x={-900} y={P + 10} width={6800} height={5} fill="#3a2e28" opacity={0.6} />
        {estacion !== "invierno" && Array.from({ length: 90 }).map((_, i) => {
          const x = -900 + i * 75 + random(`pf${i}`) * 40;
          return <path key={i} d={`M${x},${P + 200} q${6 + Math.sin(f / 25 + i) * 6},-90 ${14},-170`} stroke={osc(pasto, 0.7)} strokeWidth={8} fill="none" strokeLinecap="round" />;
        })}
        {estacion === "invierno" && <NieveCae f={f} n={120} x0={-900} w={6800} viento={0.8} o={0.8} />}
        {helada > 0 && Array.from({ length: 70 }).map((_, i) => {
          const x = -900 + random(`hz${i}`) * 6800, y = P - 300 + random(`hy${i}`) * 500;
          return <circle key={i} cx={x} cy={y} r={2 + random(`hr${i}`) * 3} fill="#e6f2ff" opacity={helada * (0.4 + 0.5 * Math.abs(Math.sin(f / 12 + i)))} />;
        })}
      </g>
    );
  }
  // ---- capa media ----
  const hilera = (y: number, s: number, x0: number, x1: number, paso: number, seed: number) =>
    Array.from({ length: Math.floor((x1 - x0) / paso) }).map((_, i) => <Mata key={`${seed}-${i}`} x={x0 + i * paso + (seed % 2) * paso * 0.5} y={y} s={s} crec={estacion === "verano" ? crec : 0} helada={helada} seed={seed * 100 + i} f={f} />);
  return (
    <g>
      {/* suelo */}
      <rect x={-900} y={P - 30} width={6800} height={1200} fill={pasto} />
      <rect x={-900} y={P - 34} width={6800} height={8} fill={osc(pasto, 0.85)} />
      {nieve > 0 && <Banco x={-900} w={6800} piso={P - 26} alto={30} color={L.nieve} seed="gn" />}
      {/* camino de tierra */}
      <path d={`M-900,${P + 40} L5600,${P + 40} L5600,${P + 90} L-900,${P + 90} Z`} fill={estacion === "invierno" ? acl(L.nieve, 0.1) : "#8a6a48"} opacity={0.8} />

      {/* ---- CASA ---- */}
      <g>
        <rect x={-250} y={P - 360} width={560} height={330} fill={mezclar("#d9cbb0", L.tinte, 0.25)} />
        {Array.from({ length: 11 }).map((_, i) => <rect key={i} x={-250} y={P - 350 + i * 30} width={560} height={3} fill={osc("#d9cbb0", 0.82)} />)}
        <path d={`M-290,${P - 360} L30,${P - 560} L350,${P - 360} Z`} fill="#4a2e3a" />
        {nieve > 0 && <path d={`M-290,${P - 360} L30,${P - 560} L350,${P - 360} L330,${P - 372} L30,${P - 540} L-270,${P - 372} Z`} fill={L.nieve} />}
        <rect x={140} y={P - 600} width={46} height={130} fill="#6a3a30" />
        {humo > 0 && Array.from({ length: 8 }).map((_, i) => {
          const t = ((f / 60 + i / 8) % 1);
          return <circle key={i} cx={163 + Math.sin(f / 30 + i) * 12 + t * 80} cy={P - 610 - t * 260} r={14 + t * 40} fill={noche ? "#5a5a70" : "#e6e0d8"} opacity={humo * (1 - t) * 0.55} />;
        })}
        {[-180, 40].map((wx, i) => <g key={i}><rect x={wx} y={P - 300} width={90} height={110} fill={noche ? "#ffcf6e" : "#5a6a80"} /><rect x={wx + 42} y={P - 300} width={6} height={110} fill={BLANCO} /><rect x={wx} y={P - 248} width={90} height={6} fill={BLANCO} />{noche && <Halo x={wx + 45} y={P - 245} r={140} color="#ffcf6e" fuerza={0.5} />}</g>)}
        {/* porche */}
        <rect x={220} y={P - 200} width={260} height={14} fill="#8a6a48" />
        <path d={`M200,${P - 200} L500,${P - 200} L480,${P - 236} L220,${P - 236} Z`} fill="#4a2e3a" />
        {[230, 470].map((px) => <rect key={px} x={px} y={P - 200} width={10} height={170} fill={BLANCO} />)}
        <rect x={200} y={P - 40} width={300} height={14} fill="#7a5a3e" />
        <rect x={250} y={P - 180} width={70} height={150} fill="#5a3a2e" />
        <Termometro x={GRANJA_PUNTOS.termometro} y={P - 70} temp={temp} s={0.5} />
      </g>

      {/* ---- GRANERO ROJO ---- */}
      <g>
        <path d={`M800,${P - 30} L800,${P - 470} L930,${P - 640} L1250,${P - 720} L1570,${P - 640} L1700,${P - 470} L1700,${P - 30} Z`} fill={mezclar(ROJO, L.tinte, noche ? 0.45 : 0.15)} />
        {Array.from({ length: 30 }).map((_, i) => <rect key={i} x={810 + i * 30} y={P - 640} width={2} height={610} fill={osc(ROJO, 0.78)} opacity={0.5} />)}
        <path d={`M790,${P - 470} L930,${P - 650} L1250,${P - 732} L1570,${P - 650} L1710,${P - 470}`} stroke="#3a2a30" strokeWidth={26} fill="none" strokeLinejoin="round" />
        {nieve > 0 && <path d={`M790,${P - 482} L930,${P - 662} L1250,${P - 744} L1570,${P - 662} L1710,${P - 482}`} stroke={L.nieve} strokeWidth={14} fill="none" />}
        {/* pared pintada (tablero blanco gastado) */}
        <rect x={PARED.x} y={PARED.y} width={PARED.w} height={PARED.h} fill={mezclar("#e9dcc0", L.tinte, noche ? 0.5 : 0.12)} stroke={BLANCO} strokeWidth={8} />
        {/* portón grande con la X blanca */}
        <rect x={1120} y={P - 430} width={260} height={400} fill={osc(ROJO, 0.82)} stroke={BLANCO} strokeWidth={12} />
        <path d={`M1120,${P - 430} L1380,${P - 30} M1380,${P - 430} L1120,${P - 30}`} stroke={BLANCO} strokeWidth={10} />
        <rect x={1245} y={P - 430} width={10} height={400} fill={BLANCO} />
        {/* puerta chica de la derecha (el reloj del verano) */}
        <rect x={PUERTA_GRANERO.x} y={PUERTA_GRANERO.y} width={PUERTA_GRANERO.w} height={PUERTA_GRANERO.h - 30} fill={mezclar("#e9dcc0", L.tinte, noche ? 0.5 : 0.12)} stroke={BLANCO} strokeWidth={8} />
        {/* henil */}
        <rect x={1170} y={P - 640} width={160} height={150} fill={noche ? "#ffcf6e" : "#2a1c1c"} stroke={BLANCO} strokeWidth={10} />
        {noche && <Halo x={1250} y={P - 565} r={180} color="#ffcf6e" fuerza={0.45} />}
        {!noche && Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M${1185 + i * 24},${P - 492} l6,-30`} stroke="#e2c060" strokeWidth={5} />)}
        <rect x={1240} y={P - 700} width={20} height={40} fill="#3a2a30" />
        {pared.map((p, i) => <Pintado key={i} p={p} f={f} base={p.x !== undefined && p.x > 400 ? { x: 0, y: 0 } : { x: PARED.x + 20, y: PARED.y + 70 }} />)}
      </g>

      {/* ---- SILO ---- */}
      <g>
        <rect x={1770} y={P - 620} width={170} height={590} fill={mezclar("#b9b4a8", L.tinte, 0.25)} />
        {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={1770} y={P - 600 + i * 50} width={170} height={4} fill="#8a857a" />)}
        <path d={`M1760,${P - 620} Q1855,${P - 720} 1950,${P - 620} Z`} fill="#7a7a80" />
      </g>

      {/* ---- LOMA + SÓTANO DE RAÍZ ---- */}
      <g>
        <path d={`M2100,${P - 26} Q2250,${P - 330} 2500,${P - 340} Q2760,${P - 330} 2920,${P - 26} Z`} fill={osc(pasto, 0.9)} />
        {/* puerta de madera con marco de piedra */}
        {Array.from({ length: 9 }).map((_, i) => <ellipse key={i} cx={2400 + (i % 3) * 100 - (i > 5 ? 0 : 0)} cy={P - 230 + Math.floor(i / 3) * 70} rx={30} ry={18} fill="#8a8580" opacity={0.0} />)}
        <path d={`M2410,${P - 26} L2410,${P - 210} Q2500,${P - 270} 2590,${P - 210} L2590,${P - 26} Z`} fill="#7a7570" />
        <path d={`M2430,${P - 26} L2430,${P - 200} Q2500,${P - 248} 2570,${P - 200} L2570,${P - 26} Z`} fill={osc("#8a6a48", 0.8)} />
        {[0, 1, 2, 3].map((k) => <rect key={k} x={2430} y={P - 196 + k * 44} width={140} height={4} fill={osc("#8a6a48", 0.6)} />)}
        <circle cx={2550} cy={P - 110} r={6} fill="#c9a36a" />
        {/* corte del sótano: se abre la loma y se ve la cámara de piedra con canastas */}
        {sotano > 0 && (
          <g opacity={sotano}>
            <path d={`M2160,${P - 26} Q2280,${P - 300} 2500,${P - 312} Q2720,${P - 300} 2860,${P - 26} Z`} fill="#3a2e28" />
            <path d={`M2220,${P - 30} L2220,${P - 230} Q2500,${P - 290} 2780,${P - 230} L2780,${P - 30} Z`} fill="#241c1e" />
            {Array.from({ length: 26 }).map((_, i) => <ellipse key={i} cx={2240 + (i % 9) * 66} cy={P - 220 + Math.floor(i / 9) * 70 + (i % 2) * 8} rx={30} ry={18} fill={mezclar("#8a8580", "#3a3436", random(`st${i}`) * 0.5)} />)}
            {[0, 1].map((r) => <rect key={r} x={2260} y={P - 150 + r * 90} width={480} height={10} fill="#7a5a3e" />)}
            {Array.from({ length: 12 }).map((_, i) => {
              const r = Math.floor(i / 6), c = i % 6;
              return <g key={i}><path d={`M${2275 + c * 78},${P - 150 + r * 90} l8,-50 l52,0 l8,50 Z`} fill="#b08a5a" />{Array.from({ length: 3 }).map((__, k) => <ellipse key={k} cx={2295 + c * 78 + k * 14} cy={P - 196 + r * 90} rx={10} ry={7} fill="#c9935a" />)}</g>;
            })}
            <Termometro x={2700} y={P - 60} temp={tSot} s={0.55} marca={[38, 40]} />
          </g>
        )}
      </g>

      {/* ---- CAMPO DE PAPA (1 acre) ---- */}
      <g>
        <rect x={3020} y={P - 60} width={2000} height={34} fill={estacion === "invierno" ? L.nieve : "#5a3a28"} />
        {estacion !== "invierno" && [0, 1, 2, 3].map((k) => <rect key={k} x={3020} y={P - 58 + k * 9} width={2000} height={3} fill="#3e2a1e" opacity={0.6} />)}
        {estacion !== "invierno" && hilera(P - 52, 0.75, 3060, 5000, 110, 1)}
        {estacion !== "invierno" && hilera(P - 30, 1, 3040, 5000, 120, 2)}
        {/* maíz al fondo */}
        {estacion === "verano" && Array.from({ length: 16 }).map((_, i) => {
          const x = 4700 + i * 56, hh = (120 + 280 * crec) * (1 - helada * 0.3);
          const c = mezclar("#6aa848", "#6a5a30", helada);
          return <g key={i}><path d={`M${x},${P - 40} q${Math.sin(f / 35 + i) * 6},${-hh / 2} ${Math.sin(f / 35 + i) * 10},${-hh}`} stroke={c} strokeWidth={8} fill="none" />{[0.35, 0.6, 0.8].map((t, k) => <path key={k} d={`M${x},${P - 40 - hh * t} q${(k % 2 ? 1 : -1) * 40},-20 ${(k % 2 ? 1 : -1) * 70},10`} stroke={c} strokeWidth={10} fill="none" strokeLinecap="round" />)}{crec > 0.8 && <rect x={x + 4} y={P - 40 - hh * 0.55} width={12} height={34} rx={6} fill="#e8c860" />}</g>;
        })}
        {/* alambrado con zapallos */}
        <rect x={2960} y={P - 140} width={8} height={110} fill="#6a4a32" />
        <path d={`M2960,${P - 120} L3020,${P - 120} M2960,${P - 80} L3020,${P - 80}`} stroke="#8a8a90" strokeWidth={2} />
        {estacion === "verano" && crec > 0.5 && Array.from({ length: 6 }).map((_, i) => <g key={i}><ellipse cx={2930 + i * 22} cy={P - 70 - (i % 3) * 30} rx={26 * crec} ry={18 * crec} fill={mezclar("#5a9a3c", "#1d2018", helada)} />{i % 2 === 0 && helada < 0.5 && <circle cx={2935 + i * 22} cy={P - 44} r={20} fill="#e8a040" />}</g>)}
        {/* corte del suelo: las papas debajo de cada mata */}
        {corte > 0 && (
          <g opacity={corte}>
            <rect x={3020} y={P - 26} width={2000} height={360} fill="#4a3022" />
            {Array.from({ length: 5 }).map((_, k) => <rect key={k} x={3020} y={P - 10 + k * 70} width={2000} height={6} fill="#3a2418" opacity={0.6} />)}
            {Array.from({ length: 16 }).map((_, i) => Array.from({ length: 5 }).map((__, k) => (
              <Papa key={`${i}-${k}`} x={3070 + i * 120 + (k - 2) * 26} y={P + 40 + (k % 3) * 34 + random(`pp${i}${k}`) * 16} s={0.35 + 0.65 * papas * (0.7 + random(`ps${i}${k}`) * 0.5)} rot={random(`pr${i}${k}`) * 60 - 30} />
            )))}
            {Array.from({ length: 16 }).map((_, i) => <path key={i} d={`M${3070 + i * 120},${P - 26} q-10,40 -20,70 M${3070 + i * 120},${P - 26} q16,46 30,64`} stroke="#c9b48a" strokeWidth={3} fill="none" />)}
          </g>
        )}
      </g>
      {!noche && <Charco x={2200} y={P + 10} rx={1800} color={L.sol} fuerza={0.2} />}
    </g>
  );
};

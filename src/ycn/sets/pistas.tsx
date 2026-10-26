// SET · HOLLIS LANES por dentro (vista de frente a las pistas, como el que está por tirar):
//   izquierda  x -1900…-80  : snack bar (mostrador, freidora, fuente de soda, ~40 objetos en estantes, TV, puerta a la cocina)
//   centro     x 0…3840     : las 16 pistas en fuga hacia el fondo (pinos, masking units con número, un monitor por pista;
//                             el de la pista 8 muestra el DÍA), columna de la tiza entre la 8 y la 9 (x 1920)
//   derecha    x 3900…5600  : mostrador de zapatos (cubículos con pares), banco, entrada con puertas de vidrio y PERSIANA metálica
// Piso: PISTAS_PISO. Variantes de luz: "liga" (martes de liga, todo prendido), "alerta" (liga + TV azul + sirenas
// rojas/azules por la puerta), "noche" (a oscuras: sólo el monitor de la 8, EXIT y el neón rosa de afuera).
import React from "react";
import { random } from "remotion";
import { Charco, Halo, Lluvia } from "../../anikit/luz";
import { F_HUD } from "../../anikit/pantalla";
import { SetProps, acl, osc, mezclar } from "../../anikit/sets/comun";
import { Bola, Pino } from "../utileria";
import { ROSA_NEON, TIZA } from "../elenco";

export const PISTAS_PISO = 900;
export const pistaX = (n: number) => 120 + (n - 1) * 240; // centro de la pista n (1..16) en la línea de falta
export const PISTAS_PUNTOS = {
  snack: -900, mostradorSnack: -900, puertaCocina: -1700, tv: -560,
  pista8: pistaX(8), columna: 1920, pista16: pistaX(16), pista1: pistaX(1),
  zapatos: 4280, banco: 4120, puerta: 5100, cadena: 5440,
};
const P = PISTAS_PISO;
const YF = P - 18, YB = P - 300; // línea de falta / cubierta de pinos
const AF = 104, AB = 60; // medio ancho de la pista adelante / atrás

export type Luz = "liga" | "alerta" | "noche";
export type Tiro = { pista: number; f0: number; bola?: string };
type Val = number | ((f: number) => number);
const v = (x: Val | undefined, f: number, def = 0) => (x === undefined ? def : typeof x === "function" ? x(f) : x);

export type PistasProps = SetProps & {
  luz?: Luz; dia?: string; tiza?: number; persiana?: Val; tiros?: Tiro[]; pinos?: boolean; tv?: "normal" | "alerta" | "apagada";
  cerradas?: number[]; // pistas con el cartel LANE CLOSED (Ep. 2: la 16)
};

// marcas de tiza: grupos de 5 (4 palitos + diagonal), un grupo por renglón, sobre la columna
export const Rayitas: React.FC<{ n: number; x: number; y: number; color?: string; nueva?: number }> = ({ n, x, y, color = TIZA, nueva = 1 }) => (
  <g stroke={color} strokeWidth={4.5} strokeLinecap="round" opacity={0.92}>
    {Array.from({ length: n }).map((_, i) => {
      const g = Math.floor(i / 5), k = i % 5;
      const gx = x, gy = y + g * 40;
      const w = (r: string) => (random(`tz${i}${r}`) - 0.5) * 4;
      const o = i === n - 1 ? nueva : 1; // la última se dibuja (0..1)
      if (k < 4) return <line key={i} x1={gx + k * 9 + w("a")} y1={gy} x2={gx + k * 9 + w("b")} y2={gy + (30 * o)} />;
      return <line key={i} x1={gx - 4} y1={gy + 26} x2={gx - 4 + 38 * o} y2={gy + 26 - 22 * o} />;
    })}
  </g>
);

// pinos de una pista: triángulo visto de frente (fila de 4 atrás, el 1 adelante)
const PINOS: [number, number][] = [[0, 0], [-1, 1], [1, 1], [-2, 2], [0, 2], [2, 2], [-3, 3], [-1, 3], [1, 3], [3, 3]];
const PinosPista: React.FC<{ cx: number; f: number; tiro?: Tiro; pinos: boolean; seed: number }> = ({ cx, f, tiro, pinos, seed }) => {
  // bola rodando + pinos volando; a los 210 cuadros la máquina baja 10 pinos nuevos
  let t = -1;
  if (tiro && f >= tiro.f0) t = f - tiro.f0;
  const imp = 34; // cuadros que tarda la bola en llegar
  const vuelta = 210;
  const ciclo = t >= 0 && t < vuelta;
  return (
    <g>
      {ciclo && t < imp + 6 && (() => {
        const u = Math.min(1, t / imp), e = 1 - Math.pow(1 - u, 1.6);
        const y = YF - 8 - e * (YF - YB - 2);
        return <Bola x={cx + Math.sin(u * 3) * 10 * (1 - u)} y={y} s={0.95 - 0.5 * e} color={tiro?.bola ?? "#2f6fd0"} rot={t * 30} />;
      })()}
      {PINOS.map(([c, r], i) => {
        const x = cx + c * 13, y = YB + 8 - (3 - r) * 0 - r * 4;
        if (!pinos && !ciclo) return <Pino key={i} x={x} y={y} s={0.52} />;
        if (!ciclo) return <Pino key={i} x={x} y={y} s={0.52} />;
        if (t < imp) return <Pino key={i} x={x} y={y} s={0.52} />;
        const k = t - imp;
        const vx = (random(`pv${seed}${i}`) - 0.5) * 9 + c * 1.6, vy = -4 - random(`pw${seed}${i}`) * 6;
        const px = x + vx * k, py = y + vy * k + 0.5 * k * k * 0.9;
        if (k > 22) return t > vuelta - 18 && pinos ? <Pino key={i} x={x} y={y} s={0.52} o={(t - (vuelta - 18)) / 18} /> : null;
        return <Pino key={i} x={px} y={Math.min(py, YB + 30)} s={0.52} rot={k * (random(`pr${seed}${i}`) - 0.5) * 50} o={1 - k / 24} />;
      })}
    </g>
  );
};

// monitor de puntaje colgado sobre cada pista
const Monitor: React.FC<{ cx: number; n: number; prendido: boolean; dia?: string; f: number }> = ({ cx, n, prendido, dia, f }) => {
  const w = 176, h = 112, y = P - 720;
  const diaOn = !!dia;
  return (
    <g>
      <rect x={cx - 4} y={y - 120} width={8} height={120} fill="#141620" />
      <rect x={cx - w / 2 - 10} y={y - 10} width={w + 20} height={h + 20} rx={10} fill="#22242e" />
      <rect x={cx - w / 2} y={y} width={w} height={h} rx={6} fill={diaOn ? "#140a04" : prendido ? "#10234a" : "#07090c"} />
      {diaOn && <>
        <Halo x={cx} y={y + h / 2} r={260} color="#ff9a3d" fuerza={0.35} />
        <text x={cx} y={y + h / 2 + 22} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={dia!.length > 6 ? 46 : 56} fill="#ff9a3d" opacity={0.92 + 0.08 * Math.sin(f / 3)}>{dia}</text>
      </>}
      {!diaOn && prendido && <g>
        <rect x={cx - w / 2 + 10} y={y + 10} width={w - 20} height={16} rx={2} fill="#2e5fb0" />
        <text x={cx} y={y + 23} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={14} fill="#e8f0ff">LANE {n}</text>
        {[0, 1, 2].map((r) => (
          <g key={r}>
            {Array.from({ length: 6 }).map((_, c) => <rect key={c} x={cx - w / 2 + 12 + c * 26} y={y + 34 + r * 24} width={22} height={18} rx={2} fill={(r + c + n) % 4 === 0 ? "#f2c230" : "#1f3d78"} opacity={0.9} />)}
          </g>
        ))}
      </g>}
    </g>
  );
};

// mostrador del snack bar (va POR DELANTE de los actores: la escena lo pone después de ellos)
export const MostradorSnack: React.FC<{ x0?: number; x1?: number }> = ({ x0 = -1560, x1 = -260 }) => (
  <g>
    <rect x={x0} y={P - 168} width={x1 - x0} height={168} fill="#8a3a2e" />
    {Array.from({ length: Math.floor((x1 - x0) / 60) }).map((_, i) => <rect key={i} x={x0 + 12 + i * 60} y={P - 150} width={34} height={140} rx={4} fill="#9c4636" />)}
    <rect x={x0 - 14} y={P - 184} width={x1 - x0 + 28} height={22} rx={5} fill="#e9dcc4" />
    <rect x={x0} y={P - 30} width={x1 - x0} height={30} fill="#5a2620" />
    {/* caja registradora y servilleteros */}
    <rect x={x0 + 120} y={P - 250} width={110} height={66} rx={6} fill="#3a3a44" /><rect x={x0 + 130} y={P - 240} width={56} height={22} fill="#7dff8a" opacity={0.5} />
    {[x0 + 420, x1 - 200].map((x) => <g key={x}><rect x={x} y={P - 220} width={46} height={36} rx={4} fill="#c9cfd2" /><rect x={x + 6} y={P - 232} width={34} height={14} fill="#f8f4e8" /></g>)}
    <rect x={x0 + 640} y={P - 236} width={26} height={52} rx={4} fill="#d8382c" /><rect x={x0 + 676} y={P - 236} width={26} height={52} rx={4} fill="#f2c230" />
  </g>
);

// mostrador de zapatos (por delante de los actores)
export const MostradorZapatos: React.FC = () => (
  <g>
    <rect x={3980} y={P - 160} width={620} height={160} fill="#2c4a5e" />
    <rect x={3966} y={P - 176} width={648} height={20} rx={5} fill="#e9dcc4" />
    <text x={4290} y={P - 70} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={40} fill="#f2c230">SHOES</text>
  </g>
);

// banco del mostrador de zapatos (para sentarse: asiento ≈ 60)
export const Banco: React.FC<{ x: number; w?: number }> = ({ x, w = 300 }) => (
  <g>
    <rect x={x - w / 2} y={P - 66} width={w} height={16} rx={6} fill="#c23a5e" />
    <rect x={x - w / 2 + 10} y={P - 52} width={10} height={52} fill="#3a3a44" /><rect x={x + w / 2 - 20} y={P - 52} width={10} height={52} fill="#3a3a44" />
  </g>
);

// letrero grande colgado del techo (por delante de la columna)
const LetreroSala: React.FC<{ oscuro: boolean }> = ({ oscuro }) => (
  <g opacity={oscuro ? 0.35 : 1}>
    <rect x={1340} y={-470} width={1160} height={170} rx={30} fill="#170f20" stroke={ROSA_NEON} strokeWidth={5} />
    <text x={1920} y={-358} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={96} fill={ROSA_NEON} letterSpacing={6}>HOLLIS LANES</text>
    {!oscuro && <Halo x={1920} y={-390} r={700} color={ROSA_NEON} fuerza={0.25} />}
  </g>
);

export const Pistas: React.FC<PistasProps> = ({ capa, f, pal, luz = "liga", dia, tiza = 0, persiana, tiros = [], pinos = true, tv = "normal", cerradas = [] }) => {
  const oscuro = luz === "noche";
  const sirena = luz === "alerta";
  const per = Math.max(0, Math.min(1, v(persiana, f, 0)));
  if (capa === "lejos") {
    // lo que se ve por las puertas de vidrio: noche de lluvia con el reflejo rosa del letrero
    return (
      <g>
        <rect x={-3000} y={-1200} width={12000} height={3400} fill="#0d1418" />
        <rect x={4700} y={300} width={800} height={700} fill="#1a2228" />
      </g>
    );
  }
  if (capa === "frente") {
    return (
      <g>
        {oscuro && <Halo x={PISTAS_PUNTOS.pista8} y={P - 660} r={700} color="#ff9a3d" fuerza={0.1} />}
      </g>
    );
  }
  const carpet = "#2b1f3a";
  return (
    <g>
      {/* techo y pared del fondo */}
      <rect x={-2200} y={-1200} width={8200} height={P + 1200} fill="#1d1a2c" />
      <rect x={-2200} y={-1200} width={8200} height={380} fill="#15131f" />
      {/* banda de neón del cielorraso (rosa + verde-agua) */}
      <rect x={-80} y={P - 560} width={3960} height={8} fill={ROSA_NEON} opacity={oscuro ? 0.25 : 0.95} />
      <rect x={-80} y={P - 540} width={3960} height={4} fill="#43e0c4" opacity={oscuro ? 0.15 : 0.7} />
      {!oscuro && <rect x={-80} y={P - 600} width={3960} height={90} fill={ROSA_NEON} opacity={0.08} />}
      {/* cielorraso: placas, banderines de la liga y el letrero grande */}
      {Array.from({ length: 40 }).map((_, i) => <rect key={`c${i}`} x={-100 + i * 100} y={-1200} width={3} height={600} fill="#221f33" />)}
      <rect x={-100} y={-610} width={4000} height={6} fill="#2a2640" />
      {Array.from({ length: 30 }).map((_, i) => { const x = 40 + i * 128; return <path key={`b${i}`} d={`M${x},${-200 + Math.sin(i) * 6} l64,0 l-32,54 Z`} fill={["#ff5fa8", "#f2c230", "#43e0c4", "#ff7a3d"][i % 4]} opacity={oscuro ? 0.2 : 0.85} />; })}
      <path d={`M0,-200 Q${960},${-170} 3840,-200`} stroke="#d9d4cb" strokeWidth={2} fill="none" opacity={0.5} />
      <g opacity={oscuro ? 0.3 : 1}>
        <rect x={300} y={-150} width={560} height={84} rx={10} fill="#f2c230" /><text x={580} y={-94} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={44} fill="#2a1a3e">TUESDAY LEAGUE</text>
        <rect x={2980} y={-150} width={480} height={84} rx={10} fill="#43e0c4" /><text x={3220} y={-94} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={44} fill="#2a1a3e">COSMIC FRIDAY</text>
      </g>
      {/* luces de techo sobre las pistas */}
      {!oscuro && Array.from({ length: 9 }).map((_, i) => <g key={i}><ellipse cx={i * 480} cy={-260} rx={60} ry={12} fill="#fff1c8" /><Halo x={i * 480} y={-240} r={420} color="#ffd38a" fuerza={0.22} /></g>)}

      {/* ===== las 16 pistas ===== */}
      {/* masking units (paneles sobre los pinos) */}
      <rect x={-60} y={P - 480} width={3960} height={180} fill="#2a1a3e" />
      {Array.from({ length: 16 }).map((_, i) => {
        const n = i + 1, cx = pistaX(n);
        return (
          <g key={`m${n}`}>
            <path d={`M${cx - 120},${P - 480} L${cx + 120},${P - 480} L${cx + 120},${P - 330} L${cx - 120},${P - 330} Z`} fill={n % 2 ? "#33204a" : "#2d1c44"} />
            {/* dibujo retro: bola + estrellas */}
            <circle cx={cx - 40} cy={P - 410} r={22} fill={["#ff5fa8", "#43e0c4", "#f2c230", "#ff7a3d"][n % 4]} opacity={oscuro ? 0.3 : 0.85} />
            <path d={`M${cx + 10},${P - 440} l8,18 l18,2 l-14,12 l4,18 l-16,-10 l-16,10 l4,-18 l-14,-12 l18,-2 Z`} fill="#f4efe4" opacity={oscuro ? 0.2 : 0.7} />
            <text x={cx + 70} y={P - 360} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={34} fill="#f4efe4" opacity={oscuro ? 0.35 : 0.9}>{n}</text>
          </g>
        );
      })}
      {/* hueco de los pinos (oscuro) */}
      <rect x={-60} y={P - 330} width={3960} height={40} fill="#0c0a12" />
      {/* las pistas: madera de arce en fuga, canaletas, flechas */}
      {Array.from({ length: 16 }).map((_, i) => {
        const n = i + 1, cx = pistaX(n);
        const mad = oscuro ? "#5a4636" : "#d9a066";
        return (
          <g key={`p${n}`}>
            {/* canaletas */}
            <path d={`M${cx - AF - 16},${YF} L${cx - AB - 10},${YB} L${cx + AB + 10},${YB} L${cx + AF + 16},${YF} Z`} fill="#2a2a34" />
            <path d={`M${cx - AF},${YF} L${cx - AB},${YB} L${cx + AB},${YB} L${cx + AF},${YF} Z`} fill={mad} />
            {/* tablas */}
            {Array.from({ length: 7 }).map((_, k) => { const u = (k + 1) / 8; return <line key={k} x1={cx - AF + 2 * AF * u} y1={YF} x2={cx - AB + 2 * AB * u} y2={YB} stroke={osc(mad, 0.88)} strokeWidth={1.5} />; })}
            {/* brillo del barniz */}
            <path d={`M${cx - AF * 0.5},${YF} L${cx - AB * 0.3},${YB} L${cx + AB * 0.05},${YB} L${cx - AF * 0.1},${YF} Z`} fill="#fff6e0" opacity={oscuro ? 0.04 : 0.16} />
            {/* flechas */}
            {[-2, -1, 0, 1, 2].map((k) => <path key={k} d={`M${cx + k * 22},${YF - 92 - Math.abs(k) * 8} l-5,12 l10,0 Z`} fill="#7a3a2a" opacity={0.7} />)}
            <PinosPista cx={cx} f={f} tiro={tiros.find((t) => t.pista === n)} pinos={pinos} seed={n} />
            {cerradas.includes(n) && <g><rect x={cx - 70} y={YF - 150} width={140} height={44} rx={6} fill={pal.acento} /><text x={cx} y={YF - 118} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={22} fill="#fff">LANE CLOSED</text></g>}
          </g>
        );
      })}
      {/* paredes de rebote entre pares de pistas */}
      {Array.from({ length: 9 }).map((_, k) => { const x = -0 + k * 480; return <path key={k} d={`M${x - 8},${YF} L${x - 4},${YB - 10} L${x + 4},${YB - 10} L${x + 8},${YF} Z`} fill="#3a2c50" />; })}
      {/* retorno de bolas entre pistas pares */}
      {Array.from({ length: 8 }).map((_, k) => {
        const x = pistaX(2 * k + 1) + 120;
        return (
          <g key={`r${k}`}>
            <path d={`M${x - 56},${P} L${x - 46},${P - 64} Q${x},${P - 96} ${x + 46},${P - 64} L${x + 56},${P} Z`} fill="#3a3a48" />
            <path d={`M${x - 40},${P - 66} Q${x},${P - 90} ${x + 40},${P - 66}`} stroke={ROSA_NEON} strokeWidth={4} fill="none" opacity={oscuro ? 0.3 : 0.8} />
            {[-26, 0, 26].map((dx, j) => <Bola key={j} x={x + dx} y={P - 22} s={0.62} color={["#2f6fd0", "#e2483a", "#3fa36a", "#f2c230", "#7a4fd0"][(k + j) % 5]} />)}
          </g>
        );
      })}
      {/* columna de la tiza entre la 8 y la 9 */}
      <rect x={1890} y={-1200} width={62} height={P + 1200} fill="#24343a" />
      <rect x={1890} y={-1200} width={10} height={P + 1200} fill="#1a262a" />
      <rect x={1890} y={P - 40} width={62} height={40} fill="#1a262a" />
      {tiza > 0 && <Rayitas n={Math.floor(tiza)} nueva={tiza % 1 || 1} x={1904} y={P - 560} />}
      <LetreroSala oscuro={oscuro} />
      {/* monitores */}
      {Array.from({ length: 16 }).map((_, i) => <Monitor key={`t${i}`} cx={pistaX(i + 1)} n={i + 1} prendido={!oscuro} dia={i + 1 === 8 ? dia : undefined} f={f} />)}


      {/* ===== snack bar (izquierda) ===== */}
      <rect x={-2200} y={-1200} width={2140} height={P + 1200} fill="#3a2a26" />
      {Array.from({ length: 24 }).map((_, i) => <rect key={i} x={-2200 + i * 90} y={-1200} width={4} height={P + 1200} fill="#2e211e" />)}
      {/* letrero SNACK BAR */}
      <rect x={-1500} y={P - 960} width={760} height={120} rx={16} fill="#1a1414" />
      <text x={-1120} y={P - 880} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={72} fill={pal.acento} opacity={oscuro ? 0.35 : 1}>SNACK BAR</text>
      {!oscuro && <Halo x={-1120} y={P - 900} r={500} color={pal.acento} fuerza={0.22} />}
      {/* menú */}
      <rect x={-1500} y={P - 820} width={760} height={150} rx={8} fill="#f4ecd8" />
      {[["CHILI DOG", "$5"], ["PRETZEL", "$2"], ["FRIES", "$3"], ["PITCHER", "$9"]].map(([a, b], i) => (
        <g key={a}><text x={-1470 + (i % 2) * 380} y={P - 770 + Math.floor(i / 2) * 56} fontFamily={F_HUD} fontWeight={600} fontSize={34} fill="#3a2a26">{a}</text><text x={-1130 + (i % 2) * 380 - 40} y={P - 770 + Math.floor(i / 2) * 56} fontFamily={F_HUD} fontWeight={600} fontSize={34} fill="#c23a2e">{b}</text></g>
      ))}
      {/* TV sobre la barra */}
      <g>
        <rect x={-660} y={P - 700} width={260} height={160} rx={10} fill="#16161c" />
        <rect x={-648} y={P - 688} width={236} height={136} rx={4} fill={tv === "apagada" || oscuro ? "#08090c" : tv === "alerta" ? "#1d4fd8" : "#3a8a5a"} />
        {tv === "alerta" && !oscuro && <><Halo x={-530} y={P - 620} r={320} color="#3a6aff" fuerza={0.35} /><text x={-530} y={P - 628} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={22} fill="#fff">EMERGENCY</text><text x={-530} y={P - 598} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={18} fill="#fff">STAY INDOORS</text><rect x={-640} y={P - 580} width={220} height={18} fill="#fff" opacity={0.85} /></>}
        {tv === "normal" && !oscuro && <><circle cx={-530} cy={P - 630} r={26} fill="#f4efe4" /><rect x={-600} y={P - 590} width={140} height={10} fill="#f4efe4" opacity={0.6} /></>}
      </g>
      {/* contramostrador: freidora, rodillo de panchos, fuente de soda y estantes (~40 objetos) */}
      <rect x={-1560} y={P - 420} width={1300} height={14} rx={3} fill="#7a5236" />
      {Array.from({ length: 2 }).map((_, r) => Array.from({ length: 20 }).map((_, k) => {
        const x = -1540 + k * 64, y = P - 420 - r * 0 + (r ? -120 : 0);
        const cols = ["#e2483a", "#f2c230", "#3fa36a", "#2f6fd0", "#f4efe4", "#e9893a"];
        const c = cols[Math.floor(random(`sn${r}${k}`) * cols.length)];
        const t = Math.floor(random(`st${r}${k}`) * 3);
        return <g key={`${r}-${k}`}>{t === 0 ? <rect x={x} y={y - 46} width={36} height={46} rx={4} fill={c} /> : t === 1 ? <rect x={x + 6} y={y - 60} width={24} height={60} rx={8} fill={c} /> : <path d={`M${x},${y} L${x + 4},${y - 50} L${x + 34},${y - 50} L${x + 38},${y} Z`} fill={c} />}</g>;
      }))}
      <rect x={-1560} y={P - 540} width={1300} height={14} rx={3} fill="#7a5236" />
      <g>
        <rect x={-1520} y={P - 330} width={240} height={140} rx={6} fill="#b9c4c8" />
        <rect x={-1500} y={P - 312} width={90} height={60} fill="#2a2a2a" /><rect x={-1390} y={P - 312} width={90} height={60} fill="#2a2a2a" />
        <rect x={-1220} y={P - 300} width={220} height={60} rx={8} fill="#c9c9cc" />
        {Array.from({ length: 6 }).map((_, k) => <rect key={k} x={-1210} y={P - 296 + k * 9} width={200} height={7} rx={3.5} fill="#b8452e" />)}
        <rect x={-960} y={P - 380} width={200} height={190} rx={8} fill="#d8382c" />
        {[0, 1, 2].map((k) => <rect key={k} x={-946 + k * 62} y={P - 280} width={50} height={70} rx={4} fill="#2a2a30" />)}
        <rect x={-700} y={P - 350} width={160} height={160} rx={8} fill="#e9dcc4" /><rect x={-690} y={P - 340} width={140} height={90} fill="#f2b23a" opacity={0.8} />
      </g>
      {/* puerta vaivén a la cocina (ojo de buey) */}
      <rect x={-1830} y={P - 420} width={220} height={420} rx={6} fill="#5a3a30" />
      <circle cx={-1720} cy={P - 300} r={36} fill={oscuro ? "#1a2a30" : "#ffd88a"} opacity={0.85} />
      <text x={-1720} y={P - 440} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={26} fill="#e9dcc4" opacity={0.8}>KITCHEN</text>

      {/* ===== zapatos + entrada (derecha) ===== */}
      <rect x={3880} y={-1200} width={2200} height={P + 1200} fill="#2a2638" />
      {/* cubículos de zapatos: 5x9 pares de colores */}
      <rect x={3990} y={P - 640} width={600} height={420} rx={6} fill="#3a2a22" />
      {Array.from({ length: 5 }).map((_, r) => Array.from({ length: 9 }).map((_, c) => (
        <g key={`z${r}${c}`}>
          <rect x={4000 + c * 65} y={P - 630 + r * 82} width={60} height={76} fill="#2a1e18" />
          <path d={`M${4006 + c * 65},${P - 568 + r * 82} q12,-16 24,-6 l0,8 l-24,0 Z M${4032 + c * 65},${P - 568 + r * 82} q12,-16 24,-6 l0,8 l-24,0 Z`} fill={["#c23a2e", "#2f6fd0", "#e9e3d6", "#3fa36a", "#f2c230"][(r * 3 + c) % 5]} />
        </g>
      )))}
      {/* entrada: puertas de vidrio (se ve la lluvia y el rosa del letrero) */}
      <rect x={4760} y={P - 560} width={700} height={560} fill="#0f171c" />
      <rect x={4760} y={P - 560} width={700} height={560} fill={ROSA_NEON} opacity={0.12 + 0.04 * Math.sin(f / 7)} />
      <g clipPath="none">{/* lluvia por el vidrio */}
        <svg x={4760} y={P - 560} width={700} height={560} overflow="hidden"><Lluvia f={f} w={700} h={560} n={50} color="#e9b8d0" seed={9} /></svg>
      </g>
      {sirena && <rect x={4760} y={P - 560} width={700} height={560} fill={Math.floor(f / 8) % 2 ? "#ff3a3a" : "#3a6aff"} opacity={0.3} />}
      {[4760, 5100, 5450].map((x) => <rect key={x} x={x - 8} y={P - 560} width={16} height={560} fill="#9aa3aa" />)}
      <rect x={4752} y={P - 572} width={716} height={16} fill="#9aa3aa" />
      {/* persiana metálica enrollable (cae desde el rollo) */}
      <rect x={4740} y={P - 640} width={740} height={70} rx={10} fill="#4a5058" />
      {per > 0 && (
        <g>
          <rect x={4752} y={P - 572} width={716} height={per * 572} fill="#7d858c" />
          {Array.from({ length: Math.ceil((per * 572) / 22) }).map((_, k) => <rect key={k} x={4752} y={P - 572 + k * 22} width={716} height={4} fill="#5f666c" />)}
          <rect x={4752} y={P - 572 + per * 572 - 14} width={716} height={14} fill="#4a5058" />
        </g>
      )}
      {/* cadena de la persiana */}
      <path d={`M5440,${P - 600} L5440,${P - 120}`} stroke="#b9c0c6" strokeWidth={6} strokeDasharray="10 6" />
      {/* EXIT */}
      <rect x={5030} y={P - 720} width={140} height={56} rx={6} fill="#1a0a0a" />
      <text x={5100} y={P - 680} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={40} fill={pal.acento}>EXIT</text>
      <Halo x={5100} y={P - 690} r={oscuro ? 260 : 160} color={pal.acento} fuerza={oscuro ? 0.4 : 0.25} />

      {/* ===== piso ===== */}
      <rect x={-2200} y={P} width={8200} height={900} fill={oscuro ? "#2a2036" : "#4a3060"} />
      {/* alfombra retro: confites y órbitas */}
      {Array.from({ length: 70 }).map((_, i) => {
        const x = -2100 + random(`al${i}`) * 7900, y = P + 30 + random(`am${i}`) * 260;
        const c = ["#ff5fa8", "#43e0c4", "#f2c230", "#7a5fd0"][i % 4];
        return i % 3 ? <circle key={i} cx={x} cy={y} r={7 + random(`ar${i}`) * 6} fill={c} opacity={oscuro ? 0.25 : 0.55} /> : <path key={i} d={`M${x - 18},${y} q18,-14 36,0`} stroke={c} strokeWidth={4} fill="none" opacity={oscuro ? 0.25 : 0.55} />;
      })}
      {/* approach de madera delante de las pistas */}
      <rect x={-60} y={P} width={3960} height={40} fill={oscuro ? "#4a3a2c" : "#c8905a"} />
      <rect x={-60} y={P + 40} width={3960} height={6} fill="#2a1a12" />
      {!oscuro && <Charco x={1900} y={P + 30} rx={2200} ry={80} color="#ffd38a" fuerza={0.25} />}

      {/* ===== oscuridad (a la noche todo se apaga, quedan las fuentes de luz) ===== */}
      {oscuro && <>
        <rect x={-2200} y={-1200} width={8200} height={3000} fill="#060a10" opacity={0.5} />
        <Halo x={pistaX(8)} y={P - 660} r={620} color="#ff9a3d" fuerza={0.4} />
        <Halo x={5110} y={P - 300} r={700} color={ROSA_NEON} fuerza={0.22} />
        <Charco x={pistaX(8)} y={P + 30} rx={500} color="#ff9a3d" fuerza={0.25} />
      </>}
      {oscuro && dia && <Monitor cx={pistaX(8)} n={8} prendido dia={dia} f={f} />}
      {oscuro && <><rect x={5030} y={P - 720} width={140} height={56} rx={6} fill="#1a0a0a" /><text x={5100} y={P - 680} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={40} fill={pal.acento}>EXIT</text></>}
      {oscuro && tiza > 0 && <Rayitas n={Math.floor(tiza)} nueva={tiza % 1 || 1} x={1904} y={P - 560} color={mezclar(TIZA, "#ff9a3d", 0.15)} />}
    </g>
  );
};

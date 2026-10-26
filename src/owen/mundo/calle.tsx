// Fachadas de Ashland Avenue (Chicago): cuadras procedurales de ladrillo de 2-3 pisos con locales a la calle,
// toldos, carteles en inglés/español (Pilsen), escaleras de incendio y faroles. Se dibuja SÓLO lo que ve la cámara
// (desde..hasta), así una cuadra de 17 millas no pesa. La usan el set Ashland y el exterior que pasa por las ventanas del bus.
import React from "react";
import { random } from "remotion";
import { Halo } from "../../anikit/luz";
import { F_HUD } from "../../anikit/pantalla";
import { Ladrillos, Ventana, acl, osc, mezclar } from "../../anikit/sets/comun";
import { Hora, LUCES } from "./hora";

const LADRILLO = ["#9a4a36", "#b5654a", "#7a3f34", "#c98a5e", "#8a5a4a", "#a8754a", "#6e4a3e", "#d7a86c"];
const CARTELES = ["TAQUERIA", "LAVANDERIA", "PHARMACY", "BARBER", "PANADERIA", "AUTO PARTS", "TIENDA", "PHONES", "FRUTERIA", "DENTAL", "INSURANCE", "TAX & NOTARY", "PIZZA", "TORTILLERIA", "THRIFT", "HARDWARE", "LAUNDROMAT", "DOLLAR+", "JOYERIA", "CARNICERIA"];
const TOLDOS = ["#d9352e", "#2f6b4a", "#2a5a9a", "#e7b240", "#6a3a8a", "#e07a52", "#2a8a8a"];

export const ANCHO_LOTE = 420;
// edificio n de la avenida (x = n * ANCHO_LOTE): todo sale de la semilla → la avenida es la misma en todos los planos
export const Lote: React.FC<{ n: number; piso: number; hora: Hora; f: number; esc?: number; letrero?: string }> = ({ n, piso, hora, f, esc = 1, letrero }) => {
  const L = LUCES[hora];
  const r = (k: string) => random(`ash${n}${k}`);
  const w = ANCHO_LOTE * esc;
  const x = n * w;
  const pisos = 1 + Math.floor(r("p") * 2.4); // 1-3 pisos sobre el local
  const alto = (330 + pisos * 190) * esc;
  const col = LADRILLO[Math.floor(r("c") * LADRILLO.length)];
  const top = piso - alto;
  const toldo = TOLDOS[Math.floor(r("t") * TOLDOS.length)];
  const cartel = letrero ?? CARTELES[Math.floor(r("k") * CARTELES.length)];
  const local = r("l") > 0.12;
  const noche = L.ventanas > 0.5;
  return (
    <g>
      <rect x={x} y={top} width={w + 2} height={alto + 4} fill={mezclar(col, L.cielo[1], 0.12)} />
      <Ladrillos x={x} y={top} w={w} h={alto} color={osc(col, 0.72)} o={0.4} alto={22 * esc} />
      <rect x={x - 6 * esc} y={top - 14 * esc} width={w + 12 * esc} height={20 * esc} fill={osc(col, 0.7)} />
      {r("cor") > 0.5 && Array.from({ length: 6 }).map((_, i) => <rect key={i} x={x + (i + 0.5) * (w / 6) - 8 * esc} y={top + 6 * esc} width={16 * esc} height={14 * esc} fill={acl(col, 0.2)} />)}
      {Array.from({ length: pisos }).map((_, p) => [0, 1].map((c) => {
        const vy = top + (40 + p * 190) * esc, vx = x + (c ? w * 0.58 : w * 0.14);
        const on = random(`ashv${n}${p}${c}`) < L.ventanas;
        return <g key={`${p}${c}`}>{on && <Halo x={vx + 60 * esc} y={vy + 70 * esc} r={140 * esc} color={L.luz} fuerza={0.25} />}<Ventana x={vx} y={vy} w={120 * esc} h={140 * esc} luz={L.luz} apagada={mezclar("#2d3b44", L.cielo[1], 0.3)} prendida={on} marco={acl(col, 0.55)} cortina={on && random(`ashc${n}${p}${c}`) > 0.5 ? osc(L.luz, 0.7) : undefined} persona={on && random(`ashpp${n}${p}`) > 0.8} f={f} seed={n + p} /></g>;
      }))}
      {pisos >= 2 && r("fe") > 0.55 && (
        <g stroke={osc(col, 0.4)} strokeWidth={4 * esc} fill="none">
          {Array.from({ length: pisos - 1 }).map((_, p) => <path key={p} d={`M${x + w * 0.1},${top + (205 + p * 190) * esc} h${w * 0.8} M${x + w * 0.16},${top + (205 + p * 190) * esc} l${w * 0.6},${-150 * esc}`} />)}
        </g>
      )}
      {local ? (
        <g>
          <rect x={x + 10 * esc} y={piso - 300 * esc} width={w - 20 * esc} height={300 * esc} fill={osc(col, 0.55)} />
          <rect x={x + 22 * esc} y={piso - 290 * esc} width={w - 44 * esc} height={58 * esc} rx={4 * esc} fill={noche ? "#1b1b22" : "#f2ede1"} />
          <text x={x + w / 2} y={piso - 250 * esc} fontFamily={F_HUD} fontWeight={600} fontSize={30 * esc} letterSpacing={2 * esc} fill={noche ? acl(toldo, 0.4) : toldo} textAnchor="middle">{cartel}</text>
          {Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M${x + 22 * esc + i * ((w - 44 * esc) / 8)},${piso - 228 * esc} h${(w - 44 * esc) / 8} l${4 * esc},${44 * esc} h${-(w - 44 * esc) / 8 - 8 * esc} Z`} fill={i % 2 ? toldo : acl(toldo, 0.75)} />)}
          <rect x={x + 26 * esc} y={piso - 176 * esc} width={w * 0.55} height={170 * esc} fill={mezclar(L.luz, "#ffffff", 0.2)} opacity={noche ? 0.95 : 0.55} />
          {noche && <Halo x={x + 26 * esc + w * 0.27} y={piso - 90 * esc} r={260 * esc} color={L.luz} fuerza={0.5} />}
          {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={x + 40 * esc + i * (w * 0.085)} y={piso - 120 * esc + (i % 2) * 20 * esc} width={22 * esc} height={30 * esc} rx={3 * esc} fill={TOLDOS[(i + n) % TOLDOS.length]} opacity={0.8} />)}
          <rect x={x + w * 0.66} y={piso - 190 * esc} width={w * 0.24} height={190 * esc} fill={osc(col, 0.35)} />
          <rect x={x + w * 0.68} y={piso - 178 * esc} width={w * 0.2} height={110 * esc} fill={mezclar(L.luz, "#ffffff", 0.3)} opacity={noche ? 0.8 : 0.4} />
        </g>
      ) : (
        <g>
          <path d={`M${x + w * 0.35},${piso} v${-200 * esc} q${w * 0.15},${-60 * esc} ${w * 0.3},0 v${200 * esc} Z`} fill={osc(col, 0.45)} />
          <rect x={x + w * 0.4} y={piso - 190 * esc} width={w * 0.2} height={190 * esc} fill="#2b1714" />
          {[0, 1, 2].map((k) => <rect key={k} x={x + w * 0.3 - k * 10 * esc} y={piso + k * 0} width={w * 0.4 + k * 20 * esc} height={10 * esc} fill={acl(col, 0.3)} transform={`translate(0,${-k * 10 * esc - 10 * esc})`} />)}
        </g>
      )}
    </g>
  );
};

// Farol de la ciudad (cuello de cisne de Chicago) cada 3 lotes
export const FarolChi: React.FC<{ x: number; piso: number; hora: Hora; esc?: number }> = ({ x, piso, hora, esc = 1 }) => {
  const L = LUCES[hora];
  return (
    <g>
      <rect x={x - 6 * esc} y={piso - 520 * esc} width={12 * esc} height={520 * esc} fill="#2a2f36" />
      <path d={`M${x},${piso - 515 * esc} q0,${-40 * esc} ${60 * esc},${-40 * esc} h${50 * esc}`} stroke="#2a2f36" strokeWidth={10 * esc} fill="none" />
      <rect x={x + 90 * esc} y={piso - 566 * esc} width={50 * esc} height={20 * esc} rx={6 * esc} fill="#3a4048" />
      {L.farol > 0 && <><Halo x={x + 115 * esc} y={piso - 540 * esc} r={220 * esc} color="#ffcf7a" fuerza={0.6 * L.farol} /><ellipse cx={x + 115 * esc} cy={piso - 544 * esc} rx={22 * esc} ry={6 * esc} fill="#fff2c8" /></>}
    </g>
  );
};

// Parada de la CTA: poste con el cartel azul y blanco «9 Ashland» + número de parada de la serie
export const ParadaCTA: React.FC<{ x: number; piso: number; num?: number; esc?: number; refugio?: boolean }> = ({ x, piso, num, esc = 1, refugio }) => (
  <g>
    {refugio && (
      <g>
        <rect x={x - 230 * esc} y={piso - 300 * esc} width={260 * esc} height={300 * esc} fill="#c9e4f2" opacity={0.28} stroke="#3a4048" strokeWidth={6 * esc} />
        <rect x={x - 236 * esc} y={piso - 312 * esc} width={272 * esc} height={16 * esc} fill="#3a4048" />
        <rect x={x - 210 * esc} y={piso - 70 * esc} width={200 * esc} height={10 * esc} fill="#3a4048" />
      </g>
    )}
    <rect x={x - 5 * esc} y={piso - 420 * esc} width={10 * esc} height={420 * esc} fill="#5a6068" />
    <rect x={x - 48 * esc} y={piso - 470 * esc} width={96 * esc} height={120 * esc} rx={6 * esc} fill="#f4f4f0" stroke="#1f5fa8" strokeWidth={5 * esc} />
    <rect x={x - 48 * esc} y={piso - 470 * esc} width={96 * esc} height={30 * esc} rx={6 * esc} fill="#1f5fa8" />
    <text x={x} y={piso - 448 * esc} fontFamily={F_HUD} fontWeight={600} fontSize={20 * esc} fill="#fff" textAnchor="middle">CTA</text>
    <text x={x} y={piso - 395 * esc} fontFamily={F_HUD} fontWeight={600} fontSize={52 * esc} fill="#1f5fa8" textAnchor="middle">9</text>
    <text x={x} y={piso - 366 * esc} fontFamily={F_HUD} fontWeight={500} fontSize={16 * esc} fill="#1f5fa8" textAnchor="middle">ASHLAND</text>
    {num !== undefined && (
      <g>
        <rect x={x - 34 * esc} y={piso - 345 * esc} width={68 * esc} height={30 * esc} rx={15 * esc} fill="#1d1d24" />
        <text x={x} y={piso - 323 * esc} fontFamily={F_HUD} fontWeight={600} fontSize={18 * esc} fill="#7dff6a" textAnchor="middle">STOP {num}</text>
      </g>
    )}
  </g>
);

// Skyline del Loop al fondo (Willis con antenas, Hancock, Aon): siluetas con ventanitas
export const SkylineChi: React.FC<{ x0: number; piso: number; hora: Hora; esc?: number }> = ({ x0, piso, hora, esc = 1 }) => {
  const L = LUCES[hora];
  const c = mezclar(L.cielo[1], "#2a2a40", 0.35);
  const t: [number, number, number, number?][] = [[0, 180, 520], [200, 140, 640], [360, 220, 980, 1], [600, 160, 760], [790, 120, 560], [930, 200, 880, 2], [1160, 150, 600], [1330, 110, 470], [1460, 170, 700], [1660, 130, 520]];
  return (
    <g opacity={0.9}>
      {t.map(([dx, w, h, tipo], i) => {
        const x = x0 + dx * esc, W = w * esc, Hh = h * esc;
        return (
          <g key={i}>
            <rect x={x} y={piso - Hh} width={W} height={Hh} fill={c} />
            {tipo === 1 && <><rect x={x + W * 0.1} y={piso - Hh - 120 * esc} width={W * 0.8} height={120 * esc} fill={c} /><rect x={x + W * 0.25} y={piso - Hh - 260 * esc} width={8 * esc} height={140 * esc} fill={c} /><rect x={x + W * 0.7} y={piso - Hh - 260 * esc} width={8 * esc} height={140 * esc} fill={c} /></>}
            {tipo === 2 && <><path d={`M${x},${piso - Hh} L${x + W * 0.15},${piso - Hh - 60 * esc} L${x + W * 0.85},${piso - Hh - 60 * esc} L${x + W},${piso - Hh} Z`} fill={c} /><rect x={x + W * 0.45} y={piso - Hh - 220 * esc} width={6 * esc} height={160 * esc} fill={c} /></>}
            {Array.from({ length: Math.floor(Hh / (60 * esc)) }).map((_, r) => Array.from({ length: 3 }).map((__, k) => random(`sk${i}${r}${k}`) < L.ventanas + 0.1 && <rect key={`${r}${k}`} x={x + W * (0.18 + k * 0.28)} y={piso - Hh + 30 * esc + r * 60 * esc} width={W * 0.12} height={14 * esc} fill={L.luz} opacity={0.55} />))}
          </g>
        );
      })}
    </g>
  );
};

// Auto que pasa (sedán de perfil); rueda = giro
export const Auto: React.FC<{ x: number; y: number; color: string; dir?: 1 | -1; rueda?: number; noche?: boolean }> = ({ x, y, color, dir = 1, rueda = 0, noche }) => (
  <g transform={`translate(${x},${y}) scale(${dir},1)`}>
    <path d="M-170,0 L-165,-50 Q-130,-62 -95,-64 L-55,-108 L75,-108 L120,-64 Q165,-60 178,-40 L180,0 Z" fill={color} />
    <path d="M-48,-98 L-10,-98 L-10,-66 L-80,-66 Z M2,-98 L66,-98 L104,-66 L2,-66 Z" fill="#2a3a48" opacity={0.85} />
    {[-108, 112].map((cx) => <g key={cx}><circle cx={cx} cy={0} r={30} fill="#151515" /><circle cx={cx} cy={0} r={13} fill="#9aa0a6" /><rect x={cx - 2} y={-12} width={4} height={24} fill="#5a5f66" transform={`rotate(${rueda} ${cx} 0)`} /></g>)}
    <rect x={168} y={-44} width={12} height={10} rx={3} fill="#fff4c8" />
    {noche && <Halo x={200} y={-38} r={120} color="#fff2c8" fuerza={0.6} />}
    <rect x={-172} y={-46} width={8} height={12} rx={3} fill="#e23a2e" />
  </g>
);

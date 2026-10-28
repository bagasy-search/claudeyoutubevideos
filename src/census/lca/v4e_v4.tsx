// v4e · vuelta 4 de lc02 P01-P20: piezas nuevas (sólo las usa lc02_planos1, escenas P01-P20 que estaban < 8).
// - LenaLiv: la pila del Living con TRONCOS de verdad (la misma PilaLena de v3h que usa planos2: x 40, w 600, seed «liv»);
//   reemplaza la grilla de lunares del set (setProps lena: 0).
// - SuperOscuro: el súper SIN luz (ciudad sin red): sin el carrito suelto del frente, velo oscuro en el fondo y en el medio,
//   tubos apagados; la luz la ponen la vidriera de la entrada y el celular de June (en el plano).
// - FilaCuerdas: contador de cuerdas (pantalla): 6 casilleros, los 3 primeros se llenan de leña, los 3 últimos punteados.
// - Subtomas: cortes INTERNOS de una escena con fundido corto de 6 cuadros (no fantasma, no tirón).
// - SierraViva + HumoSierra: la motosierra dibujada en el mundo (barra horizontal hacia el tronco) que vibra 2 px
//   cuando arranca, con bocanadas de escape gris oscuro que se ven contra la nieve.
import React from "react";
import { AbsoluteFill, interpolate, spring, useVideoConfig } from "remotion";
import { useF } from "../../anikit/camara";
import { F_HUD } from "../../anikit/pantalla";
import { Supermercado, SUPER_PISO } from "../../anikit/sets/super";
import { LIV_PISO } from "../mundo/casa";
import { AMBAR } from "../elenco";
import { cl } from "./lc02_planos1_comp";
import { VeloSinLuz } from "./v3e_v3";
import { PilaLena as PilaLiv } from "./v3h_v3";

// ---------------------------------------------------------------------------------------------------------------
// la pila de leña del Living, troncos reales (lena 0..1 como el set: 0,45 ≈ 6 filas)
export const LenaLiv: React.FC<{ lena: number }> = ({ lena }) => {
  const filas = Math.max(1, Math.round(lena * 13));
  return <PilaLiv x={40} piso={LIV_PISO} w={600} filas={filas} seed="liv" />;
};

// ---------------------------------------------------------------------------------------------------------------
// el súper apagado (Set): mismo set del kit, sin el carrito del frente y con la luz cortada
export const SuperOscuro: React.FC<any> = (p) => {
  if (p.capa === "frente") return null;
  if (p.capa === "lejos") return <g><Supermercado {...p} /><rect x={-3000} y={-3000} width={12000} height={9000} fill="#0b0f1e" opacity={0.5} /></g>;
  return <g><Supermercado {...p} /><VeloSinLuz piso={SUPER_PISO} o={0.72} /></g>;
};

// ---------------------------------------------------------------------------------------------------------------
// contador de cuerdas (pantalla): x = centro, y = arriba. llenas = [cuadro de cada una de las 3]; fantasma = cuadro de las 3 «?»
export const FilaCuerdas: React.FC<{ x: number; y: number; desde: number; llenas: number[]; fantasma: number; hasta?: number }> = ({ x, y, desde, llenas, fantasma, hasta = 1e9 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde) return null;
  const W = 6 * 112 + 40, H = 100;
  const s = spring({ frame: f - desde, fps, config: { damping: 14, stiffness: 140 } });
  const o = interpolate(f, [desde, desde + 8, hasta, hasta + 8], [0, 1, 1, 0], cl);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", left: x - W / 2, top: y, opacity: o, transform: `scale(${0.85 + 0.15 * s})`, transformOrigin: "50% 0%" }}>
      <rect x={2} y={2} width={W - 4} height={H - 4} rx={22} fill="#120f18" opacity={0.88} stroke={AMBAR} strokeWidth={3} />
      {Array.from({ length: 6 }).map((_, i) => {
        const bx = 26 + i * 112, by = 22;
        if (i < 3) {
          const t0 = llenas[i] ?? 1e9;
          const u = spring({ frame: f - t0, fps, config: { damping: 12, stiffness: 170 } });
          return (
            <g key={i}>
              <rect x={bx} y={by} width={96} height={56} rx={6} fill="#2a2230" stroke="#5a4a3a" strokeWidth={2} />
              {f >= t0 && <g transform={`translate(${bx + 48},${by + 56}) scale(${Math.min(1, u)}) translate(${-bx - 48},${-by - 56})`}>
                {Array.from({ length: 3 }).map((__, r) => Array.from({ length: 5 - (r % 2) }).map((___, c) => (
                  <g key={`${r}${c}`}>
                    <circle cx={bx + 12 + c * 18 + (r % 2) * 9} cy={by + 46 - r * 16} r={8} fill={["#7a4a2e", "#8a5a3a", "#6e4428"][(r + c) % 3]} />
                    <circle cx={bx + 12 + c * 18 + (r % 2) * 9} cy={by + 46 - r * 16} r={4.5} fill="#d4a878" />
                  </g>
                )))}
              </g>}
            </g>
          );
        }
        const v = spring({ frame: f - fantasma - (i - 3) * 4, fps, config: { damping: 12, stiffness: 170 } });
        if (f < fantasma + (i - 3) * 4) return <rect key={i} x={bx} y={by} width={96} height={56} rx={6} fill="#1c1822" opacity={0.6} />;
        return (
          <g key={i} opacity={Math.min(1, v)}>
            <rect x={bx} y={by} width={96} height={56} rx={6} fill="none" stroke={AMBAR} strokeWidth={3} strokeDasharray="9 6" />
            <text x={bx + 48} y={by + 42} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={34} fill={AMBAR}>?</text>
          </g>
        );
      })}
    </svg>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// cortes internos con fundido corto: tomas[i] vale hasta cortes[i]; en [corte, corte+d) la siguiente entra encima.
export const Subtomas: React.FC<{ f: number; cortes: number[]; tomas: (() => React.ReactNode)[]; d?: number }> = ({ f, cortes, tomas, d = 6 }) => {
  let i = 0;
  while (i < cortes.length && f >= cortes[i]) i++;
  const c = i > 0 ? cortes[i - 1] : -1e9;
  const o = interpolate(f, [c, c + d], [0, 1], cl);
  return (
    <AbsoluteFill>
      {i > 0 && o < 1 && <AbsoluteFill>{tomas[i - 1]()}</AbsoluteFill>}
      <AbsoluteFill style={{ opacity: i > 0 ? o : 1 }}>{tomas[i]()}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// motosierra en el mundo: (x, y) = mango de atrás (la mano); barra hacia +x. on = vibra; corta = la cadena corre
export const SierraViva: React.FC<{ x: number; y: number; f: number; on: boolean; ang?: number; s?: number }> = ({ x, y, f, on, ang = 0, s = 1 }) => {
  const jx = on ? Math.sin(f * 2.7) * 2 : 0, jy = on ? Math.cos(f * 3.1) * 2 : 0;
  return (
    <g transform={`translate(${x + jx},${y + jy}) rotate(${ang}) scale(${s})`}>
      {/* barra y cadena */}
      <rect x={40} y={-14} width={210} height={26} rx={13} fill="#c4c8d0" stroke="#2a2228" strokeWidth={4} />
      <rect x={44} y={-10} width={202} height={18} rx={9} fill="none" stroke="#3a3238" strokeWidth={3} strokeDasharray="7 5" strokeDashoffset={on ? -f * 5 : 0} />
      {/* cuerpo naranja + mango de arriba */}
      <rect x={-34} y={-34} width={84} height={56} rx={12} fill="#e07a1a" stroke="#8a4410" strokeWidth={3} />
      <path d="M-20,-34 Q4,-70 40,-36" stroke="#2a2228" strokeWidth={10} fill="none" strokeLinecap="round" />
      <rect x={-44} y={-6} width={20} height={14} rx={5} fill="#2a2228" />
      <rect x={-10} y={-24} width={30} height={10} rx={4} fill="#2a2228" opacity={0.7} />
      {/* escape */}
      <rect x={-30} y={14} width={14} height={10} rx={3} fill="#4a4048" />
    </g>
  );
};
// humo de escape gris oscuro (se ve contra la nieve): bocanadas que salen de (x, y) hacia dir y suben
export const HumoSierra: React.FC<{ x: number; y: number; f: number; desde: number; n?: number; dir?: number; o?: number }> = ({ x, y, f, desde, n = 8, dir = -1, o = 1 }) => {
  if (f < desde) return null;
  return (
    <g opacity={o}>{Array.from({ length: n }).map((_, i) => {
      if (f - desde < i * 3) return null;
      const t = ((f - desde - i * 3) % 30) / 30;
      return <circle key={i} cx={x + dir * 90 * t + Math.sin(i * 2 + f / 5) * 6} cy={y - 120 * t} r={9 + 26 * t} fill={i % 2 ? "#5a5e6a" : "#6e727e"} opacity={0.75 * (1 - t)} />;
    })}</g>
  );
};

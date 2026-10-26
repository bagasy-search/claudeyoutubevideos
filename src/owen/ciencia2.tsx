// Láminas de ciencia de ob02 (la batería): combustible, adenosina, cafeína, media vida, bajón de la tarde, choques, alcohol, siesta NASA.
// Todas sobre la Pizarra de ciencia.tsx; los tiempos son cuadros locales del plano.
import React from "react";
import { interpolate } from "remotion";
import { F_HUD, F_MANO } from "../anikit/pantalla";
import { useF } from "../anikit/camara";
import { VERDE } from "./elenco";
import { Pizarra } from "./ciencia";

const AMBAR = "#ffc24a", ROJO = "#ff5a4a", TINTA = "#f4efe4", AZUL = "#6fa8ff", GRIS = "#2a3a62";
const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
const T: React.FC<{ x: number; y: number; s?: number; c?: string; a?: "middle" | "start" | "end"; w?: number; o?: number; children: React.ReactNode }> = ({ x, y, s = 44, c = TINTA, a = "middle", w = 600, o = 1, children }) => (
  <text x={x} y={y} fontFamily={F_HUD} fontWeight={w} fontSize={s} fill={c} textAnchor={a} opacity={o}>{children}</text>
);

// cerebro simple (contorno) centrado en 0,0, radio ~r
const Cerebro: React.FC<{ r?: number; color?: string; relleno?: string }> = ({ r = 200, color = "#f2a7c0", relleno = "#3a2a44" }) => (
  <g>
    <path d={`M${-r},0 C${-r},${-r * 0.9} ${-r * 0.3},${-r * 1.05} 0,${-r * 0.8} C${r * 0.3},${-r * 1.05} ${r},${-r * 0.9} ${r},0 C${r},${r * 0.6} ${r * 0.5},${r * 0.75} 0,${r * 0.7} C${-r * 0.5},${r * 0.75} ${-r},${r * 0.6} ${-r},0 Z`} fill={relleno} stroke={color} strokeWidth={10} />
    <path d={`M0,${-r * 0.8} C${-r * 0.1},${-r * 0.3} ${r * 0.1},${r * 0.2} 0,${r * 0.7}`} fill="none" stroke={color} strokeWidth={6} opacity={0.7} />
    {[-0.55, 0.55].map((k) => <path key={k} d={`M${r * k - 50},${-r * 0.35} q50,-40 100,0 M${r * k - 60},${r * 0.15} q60,40 120,0`} fill="none" stroke={color} strokeWidth={6} opacity={0.6} />)}
  </g>
);

// 1 · el combustible: hígado 100 g, músculos 400 g, cerebro 2 % del peso / 20 % de la energía
export const Combustible: React.FC<{ dHigado?: number; dMusculo?: number; dCerebro?: number }> = ({ dHigado = 60, dMusculo = 160, dCerebro = 240 }) => {
  const f = useF();
  const barra = (x: number, g: number, max: number, et: string, d: number, col: string) => {
    const u = ease(f, d, d + 30);
    const h = (g / max) * 420 * u;
    return (
      <g opacity={ease(f, d - 6, d + 4)}>
        <rect x={x - 70} y={820 - 420} width={140} height={420} rx={16} fill="none" stroke={GRIS} strokeWidth={6} />
        <rect x={x - 62} y={812 - h} width={124} height={Math.max(0, h - 4)} rx={10} fill={col} />
        <T x={x} y={790 - h} s={56} c={col}>{Math.round(g * u)} g</T>
        <T x={x} y={890} s={36}>{et}</T>
      </g>
    );
  };
  const uc = ease(f, dCerebro, dCerebro + 30);
  return (
    <Pizarra titulo="STORED FUEL" fuente="Glycogen stores · adult averages">
      {barra(420, 100, 500, "LIVER", dHigado, AMBAR)}
      {barra(720, 400, 500, "MUSCLES", dMusculo, AMBAR)}
      <g transform="translate(1380,560)" opacity={ease(f, dCerebro - 6, dCerebro + 4)}>
        <Cerebro r={190} />
        <circle cx={-330} cy={330} r={70} fill="none" stroke={GRIS} strokeWidth={22} />
        <circle cx={-330} cy={330} r={70} fill="none" stroke={AZUL} strokeWidth={22} strokeDasharray={`${440 * 0.02 * uc} 440`} transform="rotate(-90 -330 330)" />
        <T x={-330} y={345} s={40} c={AZUL}>2%</T>
        <T x={-330} y={450} s={28}>OF BODY WEIGHT</T>
        <circle cx={330} cy={330} r={70} fill="none" stroke={GRIS} strokeWidth={22} />
        <circle cx={330} cy={330} r={70} fill="none" stroke={ROJO} strokeWidth={22} strokeDasharray={`${440 * 0.2 * uc} 440`} transform="rotate(-90 330 330)" />
        <T x={330} y={345} s={40} c={ROJO}>20%</T>
        <T x={330} y={450} s={28}>OF ALL ENERGY</T>
      </g>
    </Pizarra>
  );
};

// 2 · la adenosina se acumula despierto y el sueño la vacía; Owen (5 h) no llega a vaciarla
export const Adenosina: React.FC<{ llenaHasta?: number; vaciaDesde?: number; vaciaHasta?: number; resto?: number; owenDesde?: number }> = ({ llenaHasta = 150, vaciaDesde = 190, vaciaHasta = 240, resto = 0.45, owenDesde = 250 }) => {
  const f = useF();
  const lleno = ease(f, 10, llenaHasta);
  const vac = ease(f, vaciaDesde, vaciaHasta);
  const nivel = lleno * (1 - vac * (1 - resto));
  const N = 70;
  const vis = Math.round(N * nivel);
  return (
    <Pizarra titulo="ADENOSINE · THE TIRED METER">
      <g transform="translate(760,580)">
        <Cerebro r={260} />
        {Array.from({ length: N }).map((_, k) => {
          const a = k * 2.399, rr = 30 + Math.sqrt(k / N) * 210;
          const x = Math.cos(a) * rr * 0.95, y = Math.sin(a) * rr * 0.62 - 20;
          return <circle key={k} cx={x} cy={y} r={13} fill={AMBAR} opacity={k < vis ? 0.95 : 0} />;
        })}
      </g>
      <g transform="translate(1440,300)">
        <rect x={-50} y={0} width={100} height={500} rx={20} fill="none" stroke={GRIS} strokeWidth={8} />
        <rect x={-40} y={490 - 480 * nivel} width={80} height={480 * nivel} rx={12} fill={nivel > 0.6 ? ROJO : AMBAR} />
        <T x={0} y={580} s={34}>TIRED</T>
      </g>
      <T x={760} y={1000} s={46} c={f < vaciaDesde ? AMBAR : AZUL}>{f < vaciaDesde ? "AWAKE: IT BUILDS UP" : "SLEEP: IT EMPTIES"}</T>
      {f > owenDesde && <text x={1440} y={250} fontFamily={F_MANO} fontWeight={700} fontSize={56} fill={ROJO} textAnchor="middle" opacity={ease(f, owenDesde, owenDesde + 10)}>Owen: 5 h</text>}
    </Pizarra>
  );
};

// 3 · la cafeína tapa los receptores (la mano sobre la luz de alerta)
export const Receptores: React.FC<{ tapaDesde?: number }> = ({ tapaDesde = 60 }) => {
  const f = useF();
  return (
    <Pizarra titulo="CAFFEINE DOESN'T ADD ENERGY">
      {Array.from({ length: 5 }).map((_, k) => {
        const x = 400 + k * 280, u = ease(f, tapaDesde + k * 8, tapaDesde + k * 8 + 14);
        return (
          <g key={k} transform={`translate(${x},640)`}>
            <path d="M-70,0 v-60 a70,70 0 0,1 140,0 v60" fill="none" stroke={AZUL} strokeWidth={14} />
            <rect x={-90} y={0} width={180} height={40} rx={10} fill={GRIS} />
            <circle cy={-200 + u * 0} r={30} fill={AMBAR} opacity={1 - u} transform={`translate(0,${-40 * (1 - u)})`} />
            <g transform={`translate(0,${-40 - 260 * (1 - u)})`} opacity={u}>
              <rect x={-55} y={-30} width={110} height={60} rx={14} fill="#7a4a2a" />
              <T x={0} y={14} s={30} c={TINTA}>CAF</T>
            </g>
          </g>
        );
      })}
      <g transform="translate(960,330)">
        <circle r={60} fill={ROJO} opacity={f < tapaDesde + 40 ? (f % 20 < 12 ? 1 : 0.4) : 0.15} />
        <T x={0} y={18} s={50}>!</T>
        <path d="M-90,40 q-20,-120 60,-130 q80,-10 120,90" fill="#d9a07a" stroke="#7a4a2a" strokeWidth={6} opacity={ease(f, tapaDesde + 40, tapaDesde + 55)} />
      </g>
      <T x={960} y={900} s={46} c={AMBAR} o={ease(f, tapaDesde + 60, tapaDesde + 72)}>IT HIDES HOW TIRED YOU ARE</T>
    </Pizarra>
  );
};

// 4 · media vida de ~5 h: 6 AM 100 % → 11 AM 50 % → 4 PM 25 %
export const MedioVida: React.FC<{ d50?: number; d25?: number }> = ({ d50 = 40, d25 = 110 }) => {
  const f = useF();
  const x0 = 260, x1 = 1660, y0 = 860, yT = 300;
  const X = (h: number) => x0 + ((h - 6) / 12) * (x1 - x0);
  const Y = (p: number) => y0 - p * (y0 - yT);
  const hasta = 6 + 12 * ease(f, 5, d25 + 30);
  const pts = Array.from({ length: 80 }).map((_, i) => 6 + (i / 79) * 12).filter((h) => h <= hasta).map((h) => `${X(h)},${Y(Math.pow(0.5, (h - 6) / 5))}`).join(" ");
  const mark = (h: number, p: number, et: string, d: number) => (
    <g opacity={ease(f, d, d + 10)}>
      <line x1={X(h)} y1={Y(p)} x2={X(h)} y2={y0} stroke={TINTA} strokeWidth={3} strokeDasharray="10 10" />
      <circle cx={X(h)} cy={Y(p)} r={18} fill={AMBAR} />
      <T x={X(h)} y={Y(p) - 40} s={58} c={AMBAR}>{Math.round(p * 100)}%</T>
      <T x={X(h)} y={y0 + 60} s={34}>{et}</T>
    </g>
  );
  return (
    <Pizarra titulo="CAFFEINE HALF-LIFE ≈ 5 HOURS">
      <line x1={x0} y1={y0} x2={x1} y2={y0} stroke={GRIS} strokeWidth={6} />
      <polyline points={pts} fill="none" stroke="#c98a5a" strokeWidth={12} strokeLinecap="round" />
      <T x={X(6)} y={y0 + 60} s={34}>6 AM</T>
      <circle cx={X(6)} cy={Y(1)} r={18} fill="#c98a5a" />
      {mark(11, 0.5, "11 AM", d50)}
      {mark(16, 0.25, "4 PM", d25)}
    </Pizarra>
  );
};

// 5 · el bajón de la tarde: curva de alerta del día con el pozo de 2 a 4 PM
export const BajonTarde: React.FC<{ pozoDesde?: number }> = ({ pozoDesde = 60 }) => {
  const f = useF();
  const x0 = 220, x1 = 1700, y0 = 860;
  const X = (h: number) => x0 + ((h - 6) / 18) * (x1 - x0);
  const alerta = (h: number) => 0.55 + 0.3 * Math.sin(((h - 6) / 18) * Math.PI) - 0.22 * Math.exp(-Math.pow((h - 15) / 1.1, 2)) - (h > 21 ? (h - 21) * 0.12 : 0);
  const Y = (a: number) => y0 - a * 600;
  const hasta = 6 + 18 * ease(f, 5, 70);
  const pts = Array.from({ length: 120 }).map((_, i) => 6 + (i / 119) * 18).filter((h) => h <= hasta).map((h) => `${X(h)},${Y(alerta(h))}`).join(" ");
  return (
    <Pizarra titulo="THE AFTERNOON DIP" fuente="Circadian rhythm · lowest alertness ~2-4 PM">
      <rect x={X(14)} y={260} width={X(16) - X(14)} height={y0 - 260} fill={ROJO} opacity={0.18 * ease(f, pozoDesde, pozoDesde + 15)} />
      <line x1={x0} y1={y0} x2={x1} y2={y0} stroke={GRIS} strokeWidth={6} />
      <polyline points={pts} fill="none" stroke={AZUL} strokeWidth={12} strokeLinecap="round" />
      {[6, 10, 14, 18, 22].map((h) => <T key={h} x={X(h)} y={y0 + 60} s={32}>{h > 12 ? `${h - 12} PM` : `${h} AM`}</T>)}
      <T x={(X(14) + X(16)) / 2} y={250} s={48} c={ROJO} o={ease(f, pozoDesde, pozoDesde + 15)}>2-4 PM</T>
      <T x={250} y={300} s={32} a="start" c="#8a9ac0">ALERTNESS</T>
    </Pizarra>
  );
};

// 6 · choques por sueño en EE.UU. (un año): 91.000 choques, ~800 muertes
export const Choques: React.FC<{ dMuertes?: number }> = ({ dMuertes = 110 }) => {
  const f = useF();
  const n = Math.round(91000 * ease(f, 10, 80));
  const m = Math.round(800 * ease(f, dMuertes, dMuertes + 50));
  return (
    <Pizarra titulo="DROWSY DRIVING · ONE YEAR · USA" fuente="NHTSA · police-reported crashes, 2017">
      <T x={960} y={480} s={200} c={AMBAR}>{n.toLocaleString("en-US")}</T>
      <T x={960} y={560} s={44}>CRASHES</T>
      <g opacity={ease(f, dMuertes - 5, dMuertes + 5)}>
        <T x={960} y={800} s={150} c={ROJO}>~{m}</T>
        <T x={960} y={870} s={44}>DEATHS</T>
      </g>
    </Pizarra>
  );
};

// 7 · horas despierto = alcohol en sangre (18 h ≈ 0,05; 24 h ≈ 0,10; límite 0,08)
export const Alcohol: React.FC<{ d24?: number }> = ({ d24 = 150 }) => {
  const f = useF();
  const bar = (x: number, v: number, et: string, d: number, col: string) => {
    const u = ease(f, d, d + 30);
    const h = (v / 0.12) * 560 * u;
    return (
      <g opacity={ease(f, d - 5, d + 5)}>
        <rect x={x - 110} y={880 - h} width={220} height={h} rx={14} fill={col} />
        <T x={x} y={860 - h} s={70} c={col}>{(v * u).toFixed(2)}</T>
        <T x={x} y={940} s={40}>{et}</T>
      </g>
    );
  };
  const yl = 880 - (0.08 / 0.12) * 560;
  return (
    <Pizarra titulo="AWAKE TOO LONG = DRUNK" fuente="Williamson & Feyer, Occup Environ Med, 2000 · blood alcohol equivalent">
      <line x1={420} y1={yl} x2={1500} y2={yl} stroke={ROJO} strokeWidth={5} strokeDasharray="18 12" opacity={ease(f, d24 + 20, d24 + 30)} />
      <T x={1510} y={yl + 14} s={34} a="start" c={ROJO} o={ease(f, d24 + 20, d24 + 30)}>LEGAL LIMIT 0.08</T>
      {bar(720, 0.05, "18 H AWAKE", 20, AMBAR)}
      {bar(1200, 0.10, "24 H AWAKE", d24, ROJO)}
    </Pizarra>
  );
};

// 8 · la siesta de la NASA: ~26 min → rendimiento +34 %, alerta +54 %
export const SiestaNasa: React.FC<{ dAlerta?: number }> = ({ dAlerta = 120 }) => {
  const f = useF();
  const bar = (y: number, v: number, et: string, d: number) => {
    const u = ease(f, d, d + 30);
    return (
      <g opacity={ease(f, d - 5, d + 5)}>
        <T x={300} y={y + 20} s={44} a="start">{et}</T>
        <rect x={760} y={y - 40} width={900 * (v / 60) * u} height={80} rx={14} fill={VERDE} />
        <T x={780 + 900 * (v / 60) * u} y={y + 22} s={64} a="start" c={VERDE}>+{Math.round(v * u)}%</T>
      </g>
    );
  };
  return (
    <Pizarra titulo="NASA · A 26-MINUTE NAP" fuente="Rosekind et al., NASA Ames, 1994 · long-haul pilots">
      {bar(470, 34, "PERFORMANCE", 30)}
      {bar(680, 54, "ALERTNESS", dAlerta)}
      <text x={960} y={920} fontFamily={F_MANO} fontWeight={700} fontSize={64} fill={AMBAR} textAnchor="middle" opacity={ease(f, dAlerta + 50, dAlerta + 60)}>short, not deep</text>
    </Pizarra>
  );
};

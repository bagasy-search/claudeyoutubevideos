// gb01 v2 · MINUTO 1 (ventanas 0-3). Hubs nuevos con el monje en el centro; las escenas son el mundo del minuto 1 v1
// (Min1.tsx: tragamonedas muda, 2:07, tirones, cerebro del maybe, ojo, mala, engranajes), ahora visto a través de portales.
import React from "react";
import { N, neonOn, ramp, easeOut } from "../../kits/neon/base";
import { Escenario } from "../../kits/neon/Layout";
import { TituloNeon } from "../../kits/neon/Titulo";
import { Mundo as Mundo1, cam as cam1 } from "../Min1";
import { CelularPull, CerebroPartido, CerebroQuizas, TragaTiradas } from "../piezas";
import { T } from "./datos";
import { Glifo, TextoNeon } from "./glifo";
import type { Seg } from "./Video";

const EscenaMin1: React.FC = () => <Escenario cam={cam1} w={1920} mundo={<Mundo1 />} />;

// ───────── objetos de órbita del minuto 1 ─────────
const CelularChico: React.FC<{ t: number; t0: number; on: number; tam: number }> = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[
    { d: "M-34,-62 Q-34,-70 -26,-70 L26,-70 Q34,-70 34,-62 L34,62 Q34,70 26,70 L-26,70 Q-34,70 -34,62 Z", a: 2.6 },
    { d: "M-10,-60 L10,-60", a: 2 },
    { d: "M-22,-40 L22,-40 M-22,-26 L14,-26 M-22,-12 L18,-12", c: N.violeta, a: 1.6 },
  ]}>
    {/* el punto que late: "close to you" */}
    <circle cx={26} cy={-62} r={9 + 2 * Math.sin(t * 6)} fill={N.rojo} opacity={neonOn(t, t0 + 0.35)} style={{ filter: `drop-shadow(0 0 8px ${N.rojo})` }} />
  </Glifo>
);

const MonedasOro: React.FC<{ t: number; t0: number; on: number; tam: number }> = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oro} trazos={[0, 1, 2].map((i) => {
    const x = -46 + i * 46, y = 18 * Math.sin(t * 2.2 + i * 1.7) - i * 6, sq = 0.35 + 0.65 * Math.abs(Math.cos(t * 2.6 + i));
    return { d: `M${x - 26 * sq},${y} A${26 * sq},26 0 1,0 ${x + 26 * sq},${y} A${26 * sq},26 0 1,0 ${x - 26 * sq},${y}`, a: 2.4, f: "rgba(244,194,74,.14)" };
  })} />
);

const Tragamonedas: React.FC<{ t: number; t0: number; on: number; tam: number }> = ({ t0, tam }) => (
  <TragaTiradas x={0} y={0} t0={t0} tam={tam} tiradas={[]} apagada={[0, 1e9]} />
);

const CelularTiron: React.FC<{ t: number; t0: number; on: number; tam: number }> = ({ t0, tam }) => (
  <CelularPull x={0} y={0} t0={t0} ancho={tam * 0.46} tirones={[{ t: T("down", 16) + 0.05, nada: true }]} />
);

const Rueda: React.FC<{ t: number; t0: number; on: number; tam: number }> = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 + t * 5;
    return { d: `M${Math.cos(a) * 24},${Math.sin(a) * 24} L${Math.cos(a) * 52},${Math.sin(a) * 52}`, a: 3, c: `rgba(203,251,255,${0.25 + 0.75 * (i / 8)})` };
  })} />
);

const PastillaNada: React.FC<{ t: number; t0: number; on: number; tam: number }> = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color="#e6eeff" trazos={[{ d: "M-80,-22 L80,-22 A22,22 0 0,1 80,22 L-80,22 A22,22 0 0,1 -80,-22 Z", a: 2 }]}>
    <TextoNeon texto="No new posts" size={22} on={ramp(t, t0 + 0.2, 0.3)} />
  </Glifo>
);

const CerebroNucleo: React.FC<{ t: number; t0: number; on: number; tam: number }> = ({ t0, tam }) => (
  <CerebroQuizas x={0} y={0} t0={t0} tam={tam} quizas={[T("lights up", 30)]} />
);

const PremioTachado: React.FC<{ t: number; t0: number; on: number; tam: number }> = ({ t, t0, on, tam }) => {
  const tNo = T("Not when", 33);
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oro} trazos={[
      { d: "M-40,-50 L40,-50 L34,0 Q0,30 -34,0 Z", a: 2.4, f: "rgba(244,194,74,.1)" },
      { d: "M-40,-40 Q-70,-40 -62,-14 Q-56,2 -34,0 M40,-40 Q70,-40 62,-14 Q56,2 34,0", a: 2 },
      { d: "M0,22 L0,44 M-26,56 L26,56 L20,44 L-20,44 Z", a: 2.2 },
      { d: "M-70,-70 L70,70", c: N.rojo, a: 3.2, dt: tNo - t0 },
    ]} />
  );
};

const RelojArena: React.FC<{ t: number; t0: number; on: number; tam: number }> = ({ t, t0, on, tam }) => {
  const k = ramp(t, t0, 1.6);
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.violeta} trazos={[
      { d: "M-40,-70 L40,-70 M-40,70 L40,70 M-32,-70 Q-32,-20 0,0 Q32,-20 32,-70 M-32,70 Q-32,20 0,0 Q32,20 32,70", a: 2.4 },
      { d: `M-${22 * (1 - k)},-${30 + 10 * k} L${22 * (1 - k)},-${30 + 10 * k} L0,-4 Z`, c: N.oro, a: 1.6, f: "rgba(244,194,74,.5)" },
      { d: `M-${24 * k},62 L${24 * k},62 L0,${62 - 30 * k} Z`, c: N.oro, a: 1.6, f: "rgba(244,194,74,.5)" },
    ]}>
      <TextoNeon y={98} texto="just before" size={20} serif color={N.oroClaro} on={ramp(t, T("just before", 35), 0.3)} />
    </Glifo>
  );
};

const CerebroQueSeParte: React.FC<{ t: number; t0: number; on: number; tam: number }> = ({ t0, tam }) => {
  const tp = T("piece by piece", 50);
  return <CerebroPartido x={0} y={0} t0={t0} tParte={tp} tEngr={[1e9, 1e9, 1e9, 1e9]} tGira={1e9} tFrena={2e9} t1={3e9} tam={tam} />;
};

const Esquirla: (n: number) => React.FC<{ t: number; t0: number; on: number; tam: number }> = (n) => ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={[N.oro, N.rojo, N.cian, N.verde][n]} trazos={[
    { d: ["M-50,-10 Q-40,-50 0,-50 L0,0 Z", "M0,-50 Q40,-50 50,-10 L0,0 Z", "M-50,-10 Q-50,40 0,40 L0,0 Z", "M50,-10 Q50,40 0,40 L0,0 Z"][n], a: 2.6, f: "rgba(255,255,255,.04)" },
  ]}>
    <TextoNeon y={-8} texto={String(n + 1)} size={34} color={[N.oro, N.rojo, N.cian, N.verde][n]} on={ramp(t, t0 + 0.2, 0.3)} />
  </Glifo>
);

const Titulo: React.FC<{ t: number }> = () => (
  <TituloNeon lineas={["Psychology of", "*Phone Addiction*"]} t0={T("Today", 50)} t1={T("four gears", 55) - 0.1} w={1920} y={52} tamanos={[44, 84]} />
);

export const SEGS_M01: Seg[] = [
  {
    hub: {
      portal: "slot",
      orbs: [
        { id: "cel", t: T("close to you"), ang: 205, anillo: 1, tam: 150, D: CelularChico },
        { id: "slot", t: T("slot machine"), ang: 10, anillo: 0, tam: 270, D: Tragamonedas },
        { id: "monedas", t: T("slot machine") + 0.35, ang: 128, anillo: 2, tam: 170, D: MonedasOro },
      ],
    },
    Escena: EscenaMin1,
  },
  {
    hub: {
      portal: "celu",
      orbs: [
        { id: "celu", t: T("Your thumb", 16), ang: -12, anillo: 0, tam: 330, D: CelularTiron },
        { id: "rueda", t: T("jumps", 18), ang: 196, anillo: 1, tam: 120, D: Rueda },
        { id: "nada", t: T("Nothing new", 19), ang: 140, anillo: 2, tam: 230, D: PastillaNada },
      ],
    },
    Escena: EscenaMin1,
  },
  {
    hub: {
      portal: "cerebro",
      orbs: [
        { id: "cerebro", t: T("deep inside", 31), ang: -16, anillo: 0, tam: 300, D: CerebroNucleo },
        { id: "premio", t: T("prize arrives", 33), ang: 198, anillo: 1, tam: 150, D: PremioTachado },
        { id: "arena", t: T("just before", 35), ang: 132, anillo: 2, tam: 170, D: RelojArena },
      ],
    },
    Escena: EscenaMin1,
  },
  {
    hub: {
      portal: "cerebro",
      Pantalla: Titulo,
      orbs: [
        { id: "cerebro", t: T("open the glass brain", 50), ang: -14, anillo: 0, tam: 320, D: CerebroQueSeParte },
        ...[0, 1, 2, 3].map((n) => ({ id: "esq" + n, t: T("piece by piece", 50) + 0.12 + n * 0.14, ang: 150 + n * 70, anillo: 1 as const, tam: 100, D: Esquirla(n) })),
      ],
    },
    Escena: EscenaMin1,
    sonidos: (s) => { s.add("grieta", T("piece by piece", 50) - 0.05); s.add("golpe", T("piece by piece", 50) + 0.05, 0.6); },
  },
];

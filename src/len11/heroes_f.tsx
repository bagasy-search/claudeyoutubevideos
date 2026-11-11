// Héroes de len11f, parte 1: el termotanque por dentro (hilo conductor), el truco, los pasos y por qué pasa.
import React from "react";
import { AbsoluteFill } from "remotion";
import { K, SLAB, SANS, HAND, cl, lerp, eio, eout, pr, useT, useFade, Stamp, Svg } from "./kit";

export type H = React.FC<{ dur: number; src?: string; v?: number }>;
export const F: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => { const o = useFade(dur); return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>; };
export const txt = (x: number, y: number, s: string, size = 44, col: string = K.ink, w = 700, font = SLAB, anchor: any = "middle", op = 1) => (
  <text x={x} y={y} fontSize={size} fill={col} fontWeight={w} fontFamily={font} textAnchor={anchor} opacity={op}>{s}</text>
);
export const NAVY = { background: `radial-gradient(ellipse at 50% 40%, ${K.blue}, ${K.navy})` };
export const CREAM = { background: K.cream };
export const BASE = { background: "linear-gradient(#5d6166, #3b3e42)" };
export const eIn = (x: number) => x * x;

// Termotanque en corte: cuerpo, varilla (rod 0..1 = cuánto queda), piedra en el fondo (rock 0..1), óxido (rust 0..1), llama
export const Tank: React.FC<{ x: number; y: number; s?: number; rod?: number; rock?: number; rust?: number; flame?: number; t?: number; level?: number; hl?: string }> = ({ x, y, s = 1, rod = 1, rock = 0, rust = 0, flame = 0, t = 0, level = 1, hl }) => {
  const W = 360, Hh = 760, top = -Hh / 2, bot = Hh / 2, wl = top + 40 + (1 - level) * (Hh - 120);
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-W / 2 - 22} y={top - 22} width={W + 44} height={Hh + 44} rx={40} fill="#e9e6df" stroke={K.ink} strokeWidth={6} />
    <rect x={-W / 2} y={top} width={W} height={Hh} rx={26} fill="#2d3b48" />
    <rect x={-W / 2 + 8} y={wl} width={W - 16} height={bot - wl - 8} rx={18} fill="#5b8fb5" opacity={0.85} />
    {rust > 0 && Array.from({ length: 14 }, (_, i) => <circle key={i} cx={(i % 2 ? 1 : -1) * (W / 2 - 10)} cy={top + 80 + i * 46} r={10 + 22 * rust * ((i * 37) % 10) / 10} fill="#9a4a1a" opacity={0.85 * rust} />)}
    <rect x={-3} y={top - 30} width={6} height={Hh - 120} fill="#8a8a8a" />
    <rect x={-22 * rod} y={top - 30} width={44 * rod} height={(Hh - 120) * (0.4 + 0.6 * rod)} rx={14 * rod} fill={hl === "rod" ? "#d9d4c7" : "#a7a39a"} stroke={hl === "rod" ? K.copper : "none"} strokeWidth={4} />
    <rect x={-30} y={top - 56} width={60} height={34} rx={4} fill="#9b9b9b" stroke={K.ink} strokeWidth={4} />
    {rock > 0 && <path d={`M${-W / 2 + 8} ${bot - 8} L${-W / 2 + 8} ${bot - 8 - 90 * rock} ${Array.from({ length: 9 }, (_, i) => `L${-W / 2 + 8 + (i + 1) * (W - 16) / 9} ${bot - 8 - 90 * rock + ((i * 23) % 3) * 10}`).join(" ")} L${W / 2 - 8} ${bot - 8} Z`} fill="#efe9d6" stroke="#bdb39a" strokeWidth={3} />}
    {flame > 0 && [-90, -30, 30, 90].map((k, i) => <path key={k} d={`M${k - 22} ${bot + 70} Q${k} ${bot + 20 - 30 * flame - 10 * Math.sin(t * 9 + i)} ${k + 22} ${bot + 70} Z`} fill="#3d8bfd" opacity={0.9 * flame} />)}
    <rect x={W / 2 + 22} y={bot - 70} width={50} height={30} fill="#b88a3a" stroke={K.ink} strokeWidth={4} />
  </g>);
};

// ── XRAY_TANK (v0-v10, HILO CONDUCTOR): el mismo termotanque en corte, cada vez con una capa nueva
const XR: [string, number, number, number, number, string?][] = [
  ["THE ROD EATS ITSELF SO THE TANK DOESN'T", 0.6, 0, 0, 0, "rod"], ["THE ANODE ROD", 1, 0, 0, 0, "rod"], ["CUT IN HALF", 1, 0.2, 0, 0.4], ["3-4 FEET · MAGNESIUM OR ALUMINUM", 1, 0, 0, 0, "rod"],
  ["THE ROD AND THE ROCK ARE CONNECTED", 0.5, 0.6, 0, 0.6], ["RUST FROM INSIDE · HEAT FROM BELOW", 0.05, 0.9, 0.7, 1], ["", 1, 0, 0, 0], ["FIVE GALLONS LOWER", 1, 0.3, 0, 0],
  ["", 1, 0, 0, 0], ["COLD WATER STIRS THE BOTTOM", 1, 0.7, 0, 0], ["NO ROD → THE TANK RUSTS", 0.02, 0.4, 0.9, 0.5]];
export const xray_tank: H = ({ dur, v = 0 }) => {
  const t = useT(), [lab, rod0, rock, rust, fl, hl] = XR[v] || XR[0], g = eio(pr(t, 0.2, 1.6));
  const rod = v === 0 ? lerp(1, rod0, g) : v === 10 ? lerp(0.5, rod0, g) : rod0, rs = v === 10 || v === 5 ? rust * g : rust;
  return (<F dur={dur}><AbsoluteFill style={BASE}><Svg>
    <Tank x={v === 9 ? 760 : 960} y={560} s={1} rod={rod} rock={rock * (v === 9 ? 1 - 0.3 * Math.abs(Math.sin(t * 3)) : 1)} rust={rs} flame={fl} t={t} level={v === 7 ? lerp(1, 0.86, g) : 1} hl={hl} />
    {v === 7 && <g opacity={cl((t - 1) * 2)}><circle cx={960} cy={150} r={26} fill="none" stroke={K.copper} strokeWidth={6} />{txt(1220, 160, "ROD HOLE STAYS DRY", 40, K.cream, 900, SANS, "start")}</g>}
    {v === 9 && <g><path d={`M800 140 L800 ${lerp(160, 860, eio(pr(t, 0.2, 1.2)))}`} stroke="#9fd0f0" strokeWidth={14} />{txt(1320, 520, "DIP TUBE", 52, K.cream, 900, SANS)}</g>}
    {lab && <g opacity={cl((t - 0.4) * 2)}><rect x={360} y={950} width={1200} height={90} rx={12} fill="rgba(0,0,0,0.55)" />{txt(960, 1012, lab, 48, K.cream, 900, SANS)}</g>}
  </Svg></AbsoluteFill></F>);
};
// ── TREE_RINGS: corte de tronco: cada anillo un año; los otoños del trabajo de 30 min
export const tree_rings: H = ({ dur, v = 0 }) => {
  const t = useT(), n = Math.floor(eout(pr(t, 0.1, 1.8)) * (v === 2 ? 10 : 22));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#3a2e22" }}><Svg>
    {Array.from({ length: 22 }, (_, i) => 22 - i).map((k) => <circle key={k} cx={960} cy={560} r={20 + k * 19} fill={k % 2 ? "#c49a62" : "#b08550"} stroke="#6a4a26" strokeWidth={k <= n ? 3 : 1} opacity={k <= n ? 1 : 0.35} />)}
    <g opacity={cl((t - 1) * 2)}>{txt(960, 90, v === 0 ? "22 YEARS · NEVER LEAKED" : v === 2 ? "A NEW ROD IN A 10-YEAR-OLD TANK" : "HOW OLD IS YOURS?", 60, K.cream, 900, SANS)}</g>
    {v !== 3 && <g opacity={cl((t - 1.4) * 2)}>{txt(960, 1040, v === 0 ? "ONE JOB EVERY FALL" : "CAN BUY IT YEARS", 46, "#f2d39b", 900, SANS)}</g>}
  </Svg></AbsoluteFill></F>);
};
// ── HOURGLASS_ROD: reloj de arena; la arena es el metal de la varilla que se va consumiendo
export const hourglass_rod: H = ({ dur, v = 0 }) => {
  const t = useT(), f = v === 2 ? lerp(0.2, 0, eio(pr(t, 0.2, 1.6))) : v === 4 ? lerp(1, 0.3, eio(pr(t, 0.2, 2))) : lerp(1, 0.6, eio(pr(t, 0.2, 2)));
  return (<F dur={dur}><AbsoluteFill style={NAVY}><Svg>
    <rect x={720} y={140} width={480} height={30} rx={8} fill="#8a6a3a" /><rect x={720} y={930} width={480} height={30} rx={8} fill="#8a6a3a" />
    <path d="M760 170 L1160 170 L980 545 L1160 930 L760 930 L940 545 Z" fill="rgba(255,255,255,0.12)" stroke={K.cream} strokeWidth={5} />
    <path d={`M${960 - 180 * f} ${545 - 360 * f} L${960 + 180 * f} ${545 - 360 * f} L960 545 Z`} fill="#b9b6ad" />
    <path d={`M760 930 L1160 930 L${960 + 170 * (1 - f)} ${930 - 260 * (1 - f)} L${960 - 170 * (1 - f)} ${930 - 260 * (1 - f)} Z`} fill={v === 2 ? "#9a4a1a" : "#8f8b80"} />
    {f > 0.02 && <line x1={960} y1={545} x2={960} y2={930} stroke="#b9b6ad" strokeWidth={4} />}
    {txt(1500, 520, ["30 MINUTES", "30 MINUTES A YEAR", "THEN IT EATS THE TANK", "", "EVERY FEW YEARS: THE ROD"][v] || "", 54, K.cream, 900, SANS)}
  </Svg></AbsoluteFill></F>);
};
// ── STEP_TABS: fichero de pestañas de carpeta; cada paso es una pestaña que sube. v0-v5 el truco (1-6) · v6 paso cero · v7-v16 pasos 1-10
const TAB = ["DIAL TO VACATION", "COLD OFF · HOT FAUCET OPEN", "HOSE · FIVE GALLONS OUT", "FIND THE ROD · BREAK IT LOOSE", "LOOK AT IT", "FLUSH UNTIL CLEAR",
  "SAFETY: THREE THINGS", "THE NIGHT BEFORE", "WATER OFF, PRESSURE OFF", "DRAIN A FEW GALLONS", "FIND THE ROD", "BREAK IT LOOSE", "PULL IT OUT AND LOOK", "THE NEW ROD", "FLUSH THE SEDIMENT", "REFILL AND RESTART", "CHECK FOR LEAKS"];
export const step_tabs: H = ({ dur, v = 0 }) => {
  const t = useT(), trick = v < 6, n = trick ? v + 1 : v - 6, tot = trick ? 6 : 11, up = eout(pr(t, 0.1, 0.7));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#e7dcc4" }}><Svg>
    {Array.from({ length: tot }, (_, i) => { const cur = trick ? i === v : i === n, done = trick ? i < v : i < n, w = 1500 / tot;
      return <g key={i} transform={`translate(${210 + i * w} ${cur ? lerp(560, 300, up) : 560})`}>
        <path d={`M0 0 L${w - 10} 0 L${w - 10} 520 L0 520 Z`} fill={cur ? "#f6e7b6" : done ? "#d8c79a" : "#cbbd96"} stroke="#6a5a30" strokeWidth={4} />
        <rect x={10} y={-50} width={w - 30} height={60} rx={10} fill={cur ? K.copper : "#b8a676"} />{txt(w / 2 - 5, -8, trick ? `${i + 1}` : `${i}`, 36, K.white, 900, SANS)}</g>; })}
    <g opacity={up}>{txt(960, 200, trick ? "THE WHOLE TRICK" : n === 0 ? "STEP ZERO" : `STEP ${n}`, 54, K.navy, 900, SANS)}{txt(960, lerp(700, 470, up), TAB[v] || "", 62, K.ink, 900, SLAB)}</g>
  </Svg></AbsoluteFill></F>);
};
// ── MOON_PHASE: luna que pasa de noche a mañana: el agua se enfría de un día para el otro. v1 vacation · v3 Friday nerves
export const moon_phase: H = ({ dur, v = 0 }) => {
  const t = useT(), p = eio(pr(t, 0.2, 2.0)), sky = `rgb(${lerp(20, 170, p)},${lerp(30, 200, p)},${lerp(70, 230, p)})`;
  return (<F dur={dur}><AbsoluteFill style={{ background: sky }}><Svg>
    <g transform={`translate(${lerp(400, 1500, p)} ${lerp(220, 700, p)})`} opacity={1 - p}><circle r={110} fill="#f4f0dc" /><circle cx={50} r={100} fill={sky} /></g>
    <g transform={`translate(${lerp(300, 1500, p)} ${lerp(900, 220, p)})`} opacity={p}><circle r={110} fill="#f7c948" /></g>
    {txt(960, 960, v === 3 ? "FRIDAY · CHECKED FOUR TIMES" : "BY MORNING IT'S COOL", 58, p > 0.5 ? K.navy : K.cream, 900, SANS)}
    {v === 1 && txt(960, 120, "DIAL TO VACATION THE NIGHT BEFORE", 50, p > 0.5 ? K.navy : K.cream, 900, SANS)}
  </Svg></AbsoluteFill></F>);
};
// ── PIGGY_SCALE: balanza: chanchito (lo que cuesta la varilla) contra un termotanque nuevo
export const piggy_scale: H = ({ dur, v = 0 }) => {
  const t = useT(), tilt = eio(pr(t, 0.4, 1.4)) * (v === 3 ? -14 : 14);
  const L = ["A NEW ROD", "$20 – $50", "", "PUT IT TOWARD A NEW TANK"][v], R = ["A NEW TANK", "$1,800 – $2,800", "", "A 15-YEAR-OLD TANK"][v];
  return (<F dur={dur}><AbsoluteFill style={CREAM}><Svg>
    <path d="M960 980 L900 1040 L1020 1040 Z" fill={K.ink} /><line x1={960} y1={500} x2={960} y2={990} stroke={K.ink} strokeWidth={14} />
    <g transform={`rotate(${tilt} 960 500)`}><line x1={460} y1={500} x2={1460} y2={500} stroke={K.ink} strokeWidth={14} />
      <g transform="translate(560 500)"><ellipse cy={-90} rx={130} ry={90} fill="#f2a3b8" stroke={K.ink} strokeWidth={6} /><circle cx={100} cy={-110} r={14} fill={K.ink} />{txt(0, -230, L, 40, K.ink, 900, SANS)}</g>
      <g transform="translate(1360 500)"><rect x={-80} y={-330} width={160} height={330} rx={30} fill="#e9e6df" stroke={K.ink} strokeWidth={6} />{txt(0, -360, R, 40, K.ink, 900, SANS)}</g></g>
    <g opacity={cl((t - 1.6) * 2)}>{txt(960, 140, v === 1 ? "THE ROD: TWENTY TO FIFTY DOLLARS" : v === 3 ? "OLD AND RUSTY? SAVE FOR THE TANK" : "A ROD COSTS A LOT LESS THAN A TANK", 52, K.navy, 900, SANS)}</g>
  </Svg></AbsoluteFill></F>);
};
// ── PENCIL_GAUGE: un lápiz al lado de la varilla: si es igual de fina o se ve el alambre, está terminada
export const pencil_gauge: H = ({ dur, v = 0 }) => {
  const t = useT(), m = eio(pr(t, 0.3, 1.4)), wire = v === 1 || v === 3;
  return (<F dur={dur}><AbsoluteFill style={{ background: "#d9d4c7" }}><Svg>
    <g transform="translate(0 0)"><rect x={300} y={lerp(380, 420, m)} width={1300} height={lerp(150, 40, m)} rx={20} fill="#9b978d" stroke={K.ink} strokeWidth={5} />
      {wire && <rect x={900} y={392} width={500} height={14} fill="#5a5a5a" opacity={m} />}
      {Array.from({ length: 8 }, (_, i) => <circle key={i} cx={400 + i * 150} cy={400 + (i % 2) * 30} r={18 * m} fill="#e6e1cf" opacity={m} />)}</g>
    <g transform={`translate(0 ${lerp(300, 0, m)})`}><rect x={300} y={640} width={1200} height={40} fill="#f2c230" stroke={K.ink} strokeWidth={4} /><path d="M1500 640 L1580 660 L1500 680 Z" fill="#e8c9a0" stroke={K.ink} strokeWidth={4} /><rect x={260} y={640} width={40} height={40} fill="#e88" /></g>
    <g opacity={cl((t - 1.4) * 2)}>{txt(960, 160, v === 3 ? "PENCIL-THIN OR BARE WIRE FOR SIX INCHES" : "THIN AS A PENCIL? BARE WIRE?", 56, K.navy, 900, SANS)}{txt(960, 900, "IT'S DONE", 80, K.red, 900, SLAB)}</g>
  </Svg></AbsoluteFill></F>);
};
// ── BODYGUARD: el guardaespaldas se lleva los golpes para que el jefe no: la varilla y el tanque
export const bodyguard: H = ({ dur, v = 0 }) => {
  const t = useT(), hits = Math.min(7, Math.floor(t * 2.2));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#26303a" }}><Svg>
    <g transform="translate(1250 560)"><rect x={-110} y={-280} width={220} height={560} rx={50} fill="#e9e6df" stroke={K.ink} strokeWidth={6} />{txt(0, 330, "THE TANK", 44, K.cream, 900, SANS)}</g>
    <g transform="translate(820 560)"><rect x={-60} y={-300} width={120} height={600} rx={50} fill="#a7a39a" stroke={K.ink} strokeWidth={6} />{Array.from({ length: hits }, (_, i) => <circle key={i} cx={-50 + (i % 2) * 100} cy={-240 + i * 80} r={28} fill="#26303a" />)}{txt(0, 350, "THE ROD", 44, K.cream, 900, SANS)}</g>
    {Array.from({ length: 6 }, (_, i) => { const p = cl((t - i * 0.45) * 2.2); return <circle key={i} cx={lerp(160, 760, p)} cy={300 + i * 80} r={20} fill="#5b8fb5" opacity={p < 1 ? 1 : 0} />; })}
    {txt(960, 120, v === 2 ? "THE ROD DIES SO THE TANK DOESN'T" : "METALS MORE WILLING TO CORRODE", 56, K.cream, 900, SANS)}
  </Svg></AbsoluteFill></F>);
};
// ── TUG_ROPE: tira y afloja: el agua tira de la varilla y no del tanque
export const tug_rope: H = ({ dur }) => {
  const t = useT(), pull = eio(pr(t, 0.3, 1.6)) * 180;
  return (<F dur={dur}><AbsoluteFill style={{ background: "#dfe8ee" }}><Svg>
    <line x1={300 - pull} y1={560} x2={1620 - pull} y2={560} stroke="#a0763a" strokeWidth={22} />
    <g transform={`translate(${380 - pull} 560)`}><circle r={130} fill="#5b8fb5" stroke={K.ink} strokeWidth={6} />{txt(0, 14, "WATER", 42, K.white, 900, SANS)}</g>
    <g transform={`translate(${1100 - pull} 560)`}><rect x={-40} y={-200} width={80} height={400} rx={30} fill="#a7a39a" stroke={K.ink} strokeWidth={6} />{txt(0, 260, "ROD", 40, K.ink, 900, SANS)}</g>
    <g transform="translate(1600 560)" opacity={0.5}><rect x={-90} y={-230} width={180} height={460} rx={40} fill="#e9e6df" stroke={K.ink} strokeWidth={6} />{txt(0, 290, "TANK", 40, K.ink, 900, SANS)}</g>
    {txt(960, 150, "THE WATER GOES AFTER THE ROD", 60, K.navy, 900, SANS)}
  </Svg></AbsoluteFill></F>);
};
// ── WARRANTY_CARD: tarjeta de garantía: "6 years" y al lado lo que dura la varilla
export const warranty_card: H = ({ dur }) => {
  const t = useT(), d = eout(pr(t, 0.1, 0.7));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#3a4048" }}><Svg>
    <g transform={`translate(960 ${lerp(1300, 540, d)}) rotate(-3)`}><rect x={-520} y={-300} width={1040} height={600} rx={20} fill="#fff" stroke={K.navy} strokeWidth={8} />
      <rect x={-520} y={-300} width={1040} height={110} rx={20} fill={K.navy} />{txt(0, -225, "LIMITED WARRANTY", 54, K.white, 900, SANS)}
      {txt(-460, -90, "TANK: 6 YEARS", 56, K.ink, 900, SANS, "start")}{txt(-460, 10, "THE ROD LASTS: ABOUT THAT LONG", 44, K.graphite, 800, SANS, "start")}
      <line x1={-460} y1={140} x2={460} y2={140} stroke="#bbb" strokeWidth={3} />{txt(-460, 210, "...PLUS A LITTLE", 50, K.red, 700, HAND, "start")}</g>
  </Svg></AbsoluteFill></F>);
};
// ── RIVERBED: corte de un lecho de río: el calcio decanta como arena. v0 se asienta · v1 la llama calienta la piedra · v2 calor contra el acero · v4 tapa la válvula
export const riverbed: H = ({ dur, v = 0 }) => {
  const t = useT(), s = eio(pr(t, 0.2, 1.8));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#9fc3d8" }}><Svg>
    {Array.from({ length: 70 }, (_, i) => { const x = 200 + ((i * 131) % 1520), y0 = 120 + ((i * 71) % 400); return <circle key={i} cx={x} cy={lerp(y0, 860 - ((i * 13) % 60), cl(s * 1.3 - (i % 7) * 0.04))} r={7} fill="#f5f1e4" />; })}
    <path d={`M120 ${940 - 120 * s} Q960 ${900 - 160 * s} 1800 ${940 - 120 * s} L1800 1080 L120 1080 Z`} fill="#efe9d6" />
    {(v === 1 || v === 2) && [500, 800, 1100, 1400].map((k, i) => <path key={k} d={`M${k - 50} 1080 Q${k} ${980 - 30 * Math.sin(t * 8 + i)} ${k + 50} 1080`} fill="#3d8bfd" opacity={0.9} />)}
    {v === 2 && <rect x={120} y={900} width={1680} height={30} fill="#d84a1a" opacity={0.4 + 0.3 * Math.sin(t * 6)} />}
    {v === 4 && <g><rect x={1650} y={860} width={150} height={70} fill="#b88a3a" stroke={K.ink} strokeWidth={5} /><circle cx={1660} cy={895} r={30 * s} fill="#efe9d6" /></g>}
    {txt(960, 110, ["CALCIUM SETTLES LIKE SAND", "THE FLAME HEATS ROCK FIRST", "HEAT HELD AGAINST THE STEEL", "", "ROCK PLUGGING THE DRAIN VALVE"][v], 58, K.navy, 900, SANS)}
  </Svg></AbsoluteFill></F>);
};
// ── STETHOSCOPE: el estetoscopio sobre el tanque: el ruido de la piedra. v0 gasta gas · v1 cuanto más fuerte, más piedra
export const stethoscope: H = ({ dur, v = 0 }) => {
  const t = useT(), amp = v === 1 ? lerp(10, 60, eio(pr(t, 0.2, 2))) : 26;
  return (<F dur={dur}><AbsoluteFill style={BASE}><Svg>
    <rect x={260} y={180} width={420} height={760} rx={40} fill="#e9e6df" stroke={K.ink} strokeWidth={6} />
    <path d="M680 600 Q900 600 960 420 Q1000 300 1120 300" fill="none" stroke="#333" strokeWidth={14} /><circle cx={690} cy={600} r={40} fill="#c0c0c0" stroke={K.ink} strokeWidth={5} />
    <path d={Array.from({ length: 60 }, (_, i) => `${i ? "L" : "M"}${1100 + i * 12} ${640 + Math.sin(i * 1.3 + t * 12) * amp * (0.5 + ((i * 7) % 5) / 5)}`).join(" ")} fill="none" stroke="#f2d03a" strokeWidth={6} />
    {txt(1420, 300, v === 1 ? "LOUDER = MORE ROCK" : "IT WASTES GAS", 56, K.cream, 900, SANS)}{v === 0 && txt(1420, 860, "AND OVERHEATS THE BOTTOM", 44, K.copper, 900, SANS)}
  </Svg></AbsoluteFill></F>);
};
// ── POPCORN_POT: olla de pochoclos: los granos saltan = el ruido del fondo
export const popcorn_pot: H = ({ dur }) => {
  const t = useT();
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2a1e14" }}><Svg>
    <path d="M560 600 L1360 600 L1300 960 L620 960 Z" fill="#7a7f86" stroke={K.ink} strokeWidth={8} />
    {Array.from({ length: 24 }, (_, i) => { const ph = (t * 1.6 + i * 0.37) % 1.4, y = 600 - Math.max(0, Math.sin(ph * Math.PI / 1.4)) * (160 + (i % 5) * 50); return <g key={i} transform={`translate(${640 + (i * 29) % 640} ${y})`}><circle r={22} fill="#fff6dc" /><circle cx={14} cy={-8} r={16} fill="#fff6dc" /></g>; })}
    {[700, 900, 1100, 1260].map((k, i) => <path key={k} d={`M${k - 40} 1040 Q${k} ${985 - 15 * Math.sin(t * 9 + i)} ${k + 40} 1040`} fill="#3d8bfd" />)}
    {txt(960, 150, "POPPING · RUMBLING · CRACKLING", 58, K.cream, 900, SANS)}{txt(960, 230, "THAT'S THE ROCK ON THE BOTTOM", 44, K.copper, 900, SANS)}
  </Svg></AbsoluteFill></F>);
};
// ── THERMO_DIAL: perilla de temperatura: 120 alcanza; más arriba, todo se acelera
export const thermo_dial: H = ({ dur, v = 0 }) => {
  const t = useT(), target = v === 0 ? 120 : lerp(120, 150, eio(pr(t, 0.3, 1.5))), ang = lerp(-130, 130, (target - 90) / 70);
  return (<F dur={dur}><AbsoluteFill style={{ background: v === 1 ? "#4a1e14" : "#26303a" }}><Svg>
    <circle cx={760} cy={560} r={300} fill="#e9e6df" stroke={K.ink} strokeWidth={8} />
    {[90, 100, 110, 120, 130, 140, 150, 160].map((d) => { const a = (lerp(-130, 130, (d - 90) / 70) - 90) * Math.PI / 180; return <g key={d}><line x1={760 + Math.cos(a) * 240} y1={560 + Math.sin(a) * 240} x2={760 + Math.cos(a) * 280} y2={560 + Math.sin(a) * 280} stroke={d > 120 ? K.red : K.ink} strokeWidth={6} />{txt(760 + Math.cos(a) * 200, 575 + Math.sin(a) * 200, `${d}`, 30, d > 120 ? K.red : K.ink, 800, SANS)}</g>; })}
    <g transform={`rotate(${ang} 760 560)`}><rect x={750} y={330} width={20} height={240} rx={8} fill={K.red} /></g><circle cx={760} cy={560} r={30} fill={K.ink} />
    {txt(1420, 460, `${Math.round(target)}°F`, 110, K.cream, 900, SLAB)}
    {txt(1420, 600, v === 0 ? "PLENTY FOR A HOUSE" : "ROCK FASTER · ROD FASTER", 44, v === 0 ? K.green : K.copper, 900, SANS)}{v === 1 && <g opacity={cl((t - 1.4) * 2)}>{txt(1420, 680, "AND IT CAN SCALD", 48, K.red, 900, SANS)}</g>}
  </Svg></AbsoluteFill></F>);
};

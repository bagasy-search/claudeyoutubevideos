// Héroes de len11d, parte 2: rutina, errores, los 9 tanques, el libro, historia, comentarios y cierre.
import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { K, SLAB, SANS, HAND, cl, lerp, eio, eout, pr, spr, useT, Pencil, Stamp, FromBook, Svg } from "./kit";
import { H, F, txt, lbl, NAVY, CREAM, Tank } from "./heroes_d";

const PG = (n: string) => staticFile(`len11d/c/${n}.png`);
const PW = 1700, PH = 2200;
const Page: React.FC<{ n: string; x: number; y: number; h: number; rot?: number; op?: number }> = ({ n, x, y, h, rot = 0, op = 1 }) => {
  const w = (h * PW) / PH;
  return (<g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={op}>
    <rect x={-w / 2 + 14} y={-h / 2 + 18} width={w} height={h} fill="rgba(0,0,0,0.35)" />
    <image href={PG(n)} x={-w / 2} y={-h / 2} width={w} height={h} preserveAspectRatio="none" />
  </g>);
};
const Crop: React.FC<{ n: string; fx: number; fy: number; fw: number; fh: number; x: number; y: number; w: number; id: string }> = ({ n, fx, fy, fw, fh, x, y, w, id }) => {
  const h = (w * fh * PH) / (fw * PW), sc = w / (fw * PW);
  return (<g><clipPath id={id}><rect x={x} y={y} width={w} height={h} /></clipPath>
    <image href={PG(n)} x={x - fx * PW * sc} y={y - fy * PH * sc} width={PW * sc} height={PH * sc} clipPath={`url(#${id})`} preserveAspectRatio="none" />
    <rect x={x} y={y} width={w} height={h} fill="none" stroke={K.ink} strokeWidth={4} /></g>);
};
const eIn = (x: number) => x * x;

// ── GIFT_BOXES: tres cajitas de regalo que se abren: cada una trae un arreglo de 5 minutos
export const gift_boxes: H = ({ dur }) => {
  const t = useT();
  return (<F dur={dur}><AbsoluteFill style={NAVY}><Svg>
    {["CHAIN", "VALVE", "HANDLE"].map((s, i) => { const o = eout(pr(t, 0.2 + i * 0.5, 0.6 + i * 0.5)), x = 480 + i * 480; return <g key={s}>
      <rect x={x - 150} y={520} width={300} height={260} fill={[K.red, K.copper, "#3F7D4E"][i]} /><rect x={x - 20} y={520} width={40} height={260} fill={K.cream} />
      <g transform={`translate(${x} ${520 - o * 120}) rotate(${-o * 18})`}><rect x={-170} y={-60} width={340} height={60} fill={[K.red, K.copper, "#3F7D4E"][i]} stroke="#0003" /><rect x={-20} y={-60} width={40} height={60} fill={K.cream} /></g>
      <g opacity={o}>{txt(x, 470 - o * 60, s, 50, K.cream, 900, SANS)}{txt(x, 850, "5 MIN", 46, K.white, 800, SANS)}</g></g>; })}
    {lbl(t, "FIVE MINUTES EACH", 0.2, 180)}
  </Svg></AbsoluteFill></F>);
};
// ── POPCORN_CUP: la mugre del caño salta como pochoclo y cae en el vaso puesto boca abajo, no en el techo
export const popcorn_cup: H = ({ dur }) => {
  const t = useT(), cup = eout(pr(t, 0.2, 0.7));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#f3ece0" }}><Svg>
    <rect x={0} y={60} width={1920} height={40} fill="#ddd" />{txt(1700, 150, "ceiling", 40, "#999", 600, HAND)}
    <rect x={920} y={640} width={80} height={360} fill="#e8e8e8" stroke={K.ink} strokeWidth={5} />
    <g transform={`translate(960 ${lerp(200, 560, cup)})`}><path d="M-140 -160 L140 -160 L110 80 L-110 80 Z" fill="#fff" stroke={K.red} strokeWidth={6} transform="rotate(180 0 -40)" />{Array.from({ length: 6 }, (_, i) => <rect key={i} x={-120 + i * 44} y={-160} width={22} height={240} fill={K.red} opacity={0.5} transform="rotate(180 0 -40)" />)}</g>
    {Array.from({ length: 14 }, (_, i) => { const a = 0.8 + i * 0.18, p = pr(t, a, a + 0.6), up = Math.sin(p * Math.PI); return <circle key={i} cx={960 + ((i % 5) - 2) * 24 * p} cy={620 - up * 140 + (p > 0.5 ? 0 : 0)} r={12} fill="#6b4a2e" opacity={p > 0 && p < 1 ? 1 : 0} />; })}
    <Pencil t={t} at={1.6} x={1350} y={420} text="dirt goes in the cup" col={K.navy} to={[1110, 500]} />
  </Svg></AbsoluteFill></F>);
};
// ── SPIRIT_LEVEL: nivel de burbuja gigante: la burbuja va al centro cuando el agua para en la línea
export const spirit_level: H = ({ dur }) => {
  const t = useT(), b = Math.sin(t * 3) * 260 * (1 - eio(pr(t, 0.4, 2.4)));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2a3640" }}><Svg>
    <rect x={260} y={420} width={1400} height={240} rx={30} fill="#f2c230" stroke="#7a5a10" strokeWidth={8} />
    <rect x={560} y={470} width={800} height={140} rx={70} fill="#c8f0a0" stroke="#5a7a30" strokeWidth={6} />
    <line x1={900} y1={470} x2={900} y2={610} stroke="#333" strokeWidth={6} /><line x1={1020} y1={470} x2={1020} y2={610} stroke="#333" strokeWidth={6} />
    <ellipse cx={960 + b} cy={540} rx={56} ry={40} fill="#f6fff0" stroke="#5a7a30" strokeWidth={4} />
    {Math.abs(b) < 10 && txt(960, 800, "RIGHT AT THE LINE", 70, K.cream, 900, SANS)}
    {lbl(t, "WHERE THE WATER SHOULD STOP", 0.2, 260)}
  </Svg></AbsoluteFill></F>);
};
// ── SLOT_MACHINE: tragamonedas: tirás la palanca y sale "TRICKLE · TRICKLE · TRICKLE", y las monedas salen de TU bolsillo
export const slot_machine: H = ({ dur }) => {
  const t = useT(), lev = Math.sin(pr(t, 0.2, 0.6) * Math.PI);
  return (<F dur={dur}><AbsoluteFill style={{ background: "#3a0d18" }}><Svg>
    <rect x={560} y={160} width={800} height={760} rx={50} fill="#c9a24a" stroke="#6a4a10" strokeWidth={10} />
    {[0, 1, 2].map((i) => { const stop = 0.9 + i * 0.5, sp = t < stop; return <g key={i}><rect x={640 + i * 230} y={330} width={200} height={260} fill={K.white} stroke="#333" strokeWidth={6} />
      {sp ? txt(740 + i * 230, 480 + ((t * 900) % 120) - 60, ["$", "7", "★"][Math.floor(t * 12 + i) % 3], 90, "#333", 900, SANS) : <><path d={`M${740 + i * 230} 380 q-30 60 0 100 q30 40 0 80`} stroke={K.waterD} strokeWidth={14} fill="none" />{txt(740 + i * 230, 570, "TRICKLE", 28, K.waterD, 900, SANS)}</>}</g>; })}
    <g transform={`translate(1400 300) rotate(${lev * 60} 0 160)`}><rect x={-12} y={0} width={24} height={240} fill="#999" /><circle cx={0} cy={0} r={40} fill={K.red} /></g>
    {txt(960, 270, "TOO HIGH", 60, K.red, 900, SANS)}
    <g opacity={cl((t - 2.2) * 2)}>{txt(960, 760, "YOU PAY THE WATER BILL", 52, "#3a0d18", 900, SANS)}</g>
  </Svg></AbsoluteFill></F>);
};
// ── BIKE_PEDAL: el pedal izquierdo de la bicicleta tiene rosca al revés, como la tuerca de la manija del inodoro
export const bike_pedal: H = ({ dur }) => {
  const t = useT(), r = -eio(pr(t, 0.6, 2.6)) * 360;
  return (<F dur={dur}><AbsoluteFill style={CREAM}><Svg>
    <g transform="translate(560 560)"><circle r={200} fill="none" stroke={K.ink} strokeWidth={10} /><g transform={`rotate(${r})`}><line x1={0} y1={0} x2={0} y2={-260} stroke="#666" strokeWidth={30} /><rect x={-90} y={-300} width={180} height={50} rx={10} fill="#333" /></g><circle r={40} fill="#333" /></g>
    {txt(560, 900, "LEFT PEDAL", 50, K.ink, 900, SANS)}
    <g transform="translate(1360 560)"><rect x={-260} y={-160} width={360} height={320} rx={20} fill={K.porcelain} stroke={K.ink} strokeWidth={8} /><g transform={`rotate(${r})`}><polygon points="0,-70 61,-35 61,35 0,70 -61,35 -61,-35" fill="#bbb" stroke={K.ink} strokeWidth={6} /></g><rect x={100} y={-30} width={200} height={50} rx={14} fill="#ddd" stroke={K.ink} strokeWidth={5} /></g>
    {txt(1360, 900, "HANDLE NUT", 50, K.ink, 900, SANS)}
    <path d="M1460 380 A160 160 0 0 0 1250 400" stroke={K.red} strokeWidth={10} fill="none" />{txt(1360, 340, "← LEFT TIGHTENS", 44, K.red, 900, SANS)}
    {lbl(t, "BACKWARDS THREAD, ON PURPOSE", 0.2, 140, K.navy)}
  </Svg></AbsoluteFill></F>);
};
// ── BOUNCE_BALL: prueba del rebote: la goma buena rebota alto, la vieja cae muerta
export const bounce_ball: H = ({ dur }) => {
  const t = useT();
  const h1 = Math.abs(Math.sin(t * 3)) * 520 * Math.exp(-t * 0.2), h2 = Math.abs(Math.sin(t * 3)) * 520 * Math.exp(-t * 3.5);
  return (<F dur={dur}><AbsoluteFill style={{ background: "#e6eef2" }}><Svg>
    <line x1={200} y1={900} x2={1720} y2={900} stroke={K.ink} strokeWidth={6} />
    <ellipse cx={620} cy={860 - h1} rx={60} ry={40 + (h1 < 30 ? -10 : 0)} fill="#151515" />{txt(620, 980, "SOFT · SPRINGY · FLAT", 40, K.green, 900, SANS)}
    <ellipse cx={1300} cy={870 - h2} rx={70} ry={30} fill="#3a3a3a" stroke="#777" strokeWidth={4} />{txt(1300, 980, "HARD · WARPED", 40, K.red, 900, SANS)}
    {lbl(t, "A GOOD FLAPPER IS LIKE A NEW RUBBER BAND", 0.2, 140, K.navy, 48)}
  </Svg></AbsoluteFill></F>);
};
// ── GUESTBOOK: libro de visitas del tanque: cada parte firma cuánto dura
export const guestbook: H = ({ dur }) => {
  const t = useT();
  const R = [["Flapper", "3 – 5 years", "less with tablets"], ["Fill valve", "5 – 7 years", ""], ["Chain", "until it rusts", ""], ["Tank", "a lifetime", "if you don't scrape it"]];
  return (<F dur={dur}><AbsoluteFill style={{ background: "#4a2a1a" }}><Svg>
    <rect x={260} y={120} width={1400} height={840} fill="#F4EAD2" stroke="#8a6a3a" strokeWidth={6} /><line x1={960} y1={120} x2={960} y2={960} stroke="#c9b48a" strokeWidth={8} />
    {txt(610, 220, "GUEST BOOK", 60, "#5a3a1a", 900, SLAB)}{txt(610, 280, "how long we stay", 40, "#7a5a3a", 600, HAND)}
    {R.map(([a, b, c], i) => { const n = Math.floor(pr(t, 0.4 + i * 0.7, 1.0 + i * 0.7) * b.length); return <g key={i}>
      <line x1={1000} x2={1620} y1={260 + i * 170} y2={260 + i * 170} stroke="#c9b48a" strokeWidth={3} />
      {txt(1010, 240 + i * 170, a, 40, "#5a3a1a", 800, SANS, "start")}{txt(1610, 240 + i * 170, b.slice(0, n), 48, K.navy, 700, HAND, "end")}
      {c && n >= b.length && txt(1610, 290 + i * 170, c, 30, K.red, 700, HAND, "end")}</g>; })}
  </Svg></AbsoluteFill></F>);
};
// ── LANE_CLOSURE: cierre de carril en la ruta: los conos de sarro angostan el agujero y el tránsito (agua) se frena
export const lane_closure: H = ({ dur }) => {
  const t = useT(), c = eio(pr(t, 0.3, 1.8));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#3d4a3a" }}><Svg>
    <rect x={0} y={300} width={1920} height={480} fill="#45474a" />
    {[0, 1, 2].map((i) => <rect key={i} x={0} y={455 + i * 160 - 160} width={1920} height={10} fill="#eee" strokeDasharray="40 30" opacity={0.6} />)}
    {Array.from({ length: 8 }, (_, i) => { const x = 700 + i * 70, o = cl(c * 8 - i); return <g key={i} opacity={o} transform={`translate(${x} ${340 + i * 40})`}><path d="M-30 50 L0 -40 L30 50 Z" fill="#f28a1a" /><rect x={-18} y={0} width={36} height={12} fill="#fff" /></g>; })}
    {Array.from({ length: 10 }, (_, i) => { const sp = lerp(260, 90, c), x = ((t * sp + i * 200) % 2100) - 100; return <rect key={i} x={x} y={600 + (i % 2) * 70} width={120} height={50} rx={10} fill={K.water} />; })}
    <rect x={1300} y={160} width={480} height={150} rx={10} fill="#f28a1a" />{txt(1540, 230, "LANE CLOSED", 50, "#111", 900, SANS)}{txt(1540, 285, "lime crust ahead", 34, "#111", 700, SANS)}
    {lbl(t, "THE HOLE GETS A LITTLE SMALLER EVERY YEAR", 0.4, 900, K.cream, 46)}
  </Svg></AbsoluteFill></F>);
};
// ── TICKET_ROLL: rollo de tickets de feria: cada ticket corta un paso. v0 el resumen entero · v1 último ticket
export const ticket_roll: H = ({ dur, v = 0 }) => {
  const t = useT(), D = dur / 30;
  const S = v === 1 ? ["UP TO THE LINE"] : ["LID ON A TOWEL", "WATER OFF", "FLUSH & HOLD", "1 CUP · 2 GAL", "POUR"];
  const per = Math.max(0.6, (D - 0.8) / S.length), k = Math.min(S.length, Math.floor(t / per) + 1);
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2a1a2a" }}><Svg>
    <circle cx={260} cy={540} r={180} fill="#e85a6a" /><circle cx={260} cy={540} r={60} fill="#2a1a2a" />
    {S.slice(0, k).map((s, i) => { const x = 460 + i * 300, o = eout(pr(t, i * per, i * per + 0.4)); return <g key={i} transform={`translate(${lerp(300, x, o)} 540) rotate(${(i % 2 ? 2 : -2) * o})`}>
      <rect x={0} y={-110} width={280} height={220} fill="#f7a6b0" stroke="#a03a4a" strokeWidth={4} strokeDasharray="10 6" />
      {txt(140, -50, `ADMIT ONE · ${v === 1 ? 5 : i + 1}`, 24, "#a03a4a", 800, SANS)}{txt(140, 20, s, s.length > 10 ? 30 : 38, "#3a0a1a", 900, SANS)}</g>; })}
    {lbl(t, v === 1 ? "INTO THE TANK" : "IN ONE LINE", 0.1, 180)}
  </Svg></AbsoluteFill></F>);
};
// ── FRIDGE_NOTE: nota pegada en la heladera con imán: la cuenta de la bolsa de una libra
export const fridge_note: H = ({ dur }) => {
  const t = useT(), d = spr(t, 0.2, 1);
  return (<F dur={dur}><AbsoluteFill style={{ background: "#dfe4e6" }}><Svg>
    <rect x={540} y={0} width={840} height={1080} fill="#f3f5f6" stroke="#bbb" strokeWidth={4} /><rect x={1300} y={300} width={30} height={300} rx={14} fill="#bbb" />
    <g transform={`translate(960 ${lerp(-300, 520, d)}) rotate(-3)`}><rect x={-300} y={-330} width={600} height={660} fill="#FFF6A8" />
      <circle cx={0} cy={-300} r={40} fill={K.red} />
      {txt(-250, -180, "1 lb citric acid", 54, K.ink, 700, HAND, "start")}{txt(-250, -90, "= about $6", 54, K.ink, 700, HAND, "start")}
      {[0, 1, 2, 3].map((i) => <g key={i} opacity={cl((t - 1.2 - i * 0.5) * 3)}><rect x={-240 + i * 130} y={10} width={100} height={120} rx={10} fill="none" stroke={K.navy} strokeWidth={5} />{txt(-190 + i * 130, 90, "✓", 60, K.green, 900, SANS)}</g>)}
      {txt(-250, 240, "3 or 4 tanks", 54, K.navy, 700, HAND, "start")}</g>
  </Svg></AbsoluteFill></F>);
};
// ── EQUALIZER: ecualizador de equipo de audio: las barras del "ruido del tanque" bajan a cero
export const equalizer: H = ({ dur }) => {
  const t = useT(), q = 1 - eio(pr(t, 0.2, 1.6));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#0b0f14" }}><Svg>
    {Array.from({ length: 16 }, (_, i) => { const h = Math.round((0.3 + 0.7 * Math.abs(Math.sin(t * 6 + i * 0.7))) * 12 * q); return <g key={i}>{Array.from({ length: 12 }, (_, j) => <rect key={j} x={380 + i * 72} y={800 - j * 46} width={58} height={36} fill={j < h ? (j > 9 ? "#ff4030" : j > 6 ? "#f2c230" : "#4fd36a") : "#1a2028"} />)}</g>; })}
    {q < 0.05 && txt(960, 220, "QUIET", 110, K.cream, 900, SANS)}
  </Svg></AbsoluteFill></F>);
};
// ── WILTING_FLOWER: flor en florero: la pastilla azul cae en el agua y la flor (el flapper de goma) se marchita
export const wilting_flower: H = ({ dur }) => {
  const t = useT(), d = eIn(pr(t, 0.3, 1.0)), w = eio(pr(t, 1.2, 5.0));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#efe7d6" }}><Svg>
    <path d="M820 640 L1100 640 L1060 980 L860 980 Z" fill="#cfe6ef" opacity={0.7} stroke="#7aa" strokeWidth={5} /><rect x={830} y={700} width={260} height={270} fill={lerp(0, 1, d) > 0.9 ? "#3a7fd0" : K.water} opacity={0.5} />
    <rect x={930} y={lerp(300, 880, d)} width={60} height={30} rx={8} fill="#2a5fd0" />
    <path d={`M960 700 Q${960 + w * 60} ${500 + w * 60} ${960 + w * 200} ${330 + w * 320}`} stroke="#3f7d4e" strokeWidth={14} fill="none" />
    <g transform={`translate(${960 + w * 200} ${330 + w * 320}) rotate(${w * 110})`}>{Array.from({ length: 6 }, (_, i) => <ellipse key={i} cx={0} cy={-60 + w * 20} rx={30 - w * 8} ry={60 - w * 20} fill={w > 0.6 ? "#2a2a2a" : "#151515"} transform={`rotate(${i * 60})`} />)}</g>
    <g opacity={cl((t - 1.2) * 2)}>{txt(960, 130, "SOFT · WARPED · LEAKING", 56, K.red, 900, SANS)}</g>
    {txt(1400, 900, "the rubber flapper", 44, K.ink, 700, HAND)}
  </Svg></AbsoluteFill></F>);
};
// ── FOG_ROOM: cuarto chico que se llena de niebla verde al mezclar; el cartel de NO MEZCLAR
export const fog_room: H = ({ dur }) => {
  const t = useT(), f = eio(pr(t, 0.6, 3.6));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#1e2622" }}><Svg>
    <path d="M360 160 L1560 160 L1560 980 L360 980 Z" fill="#B9D8C6" /><rect x={460} y={260} width={200} height={720} fill="#6a5a4a" />
    <rect x={1100} y={600} width={120} height={200} rx={10} fill={K.white} stroke={K.ink} strokeWidth={4} />{txt(1160, 710, "BLEACH", 26, K.ink, 900, SANS)}
    <rect x={1260} y={640} width={100} height={160} rx={10} fill="#f4ecd6" stroke={K.ink} strokeWidth={4} />{txt(1310, 730, "ACID", 26, K.ink, 900, SANS)}
    {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={1230 + Math.cos(i + t) * 300 * f + (i - 7) * 40 * f} cy={700 - i * 30 * f} r={120 * f + 40} fill="#c8e26a" opacity={0.18 * f} />)}
    <g opacity={cl((t - 1.4) * 2)}><rect x={560} y={420} width={800} height={240} rx={14} fill="#fff" stroke={K.red} strokeWidth={14} />{txt(960, 520, "NEVER MIX", 100, K.red, 900, SANS)}{txt(960, 610, "a gas you must never breathe", 40, K.ink, 700, SANS)}</g>
  </Svg></AbsoluteFill></F>);
};
// ── SUNDIAL: reloj de sol: la sombra pasa la marca de 1 hora y la noche entera queda tachada
export const sundial: H = ({ dur }) => {
  const t = useT(), a = lerp(-70, 140, eio(pr(t, 0.3, 3.4)));
  return (<F dur={dur}><AbsoluteFill style={{ background: `linear-gradient(${a > 60 ? "#1a2238" : "#f2dca8"}, ${a > 60 ? "#0a1020" : "#e0c080"})` }}><Svg>
    <ellipse cx={960} cy={640} rx={460} ry={260} fill="#bdb6a6" stroke="#6a6458" strokeWidth={8} />
    {Array.from({ length: 12 }, (_, i) => { const r = ((-90 + i * 18) * Math.PI) / 180; return <line key={i} x1={960 + Math.cos(r) * 300} y1={640 + Math.sin(r) * 170} x2={960 + Math.cos(r) * 420} y2={640 + Math.sin(r) * 240} stroke="#6a6458" strokeWidth={5} />; })}
    <path d={`M960 640 L${960 + Math.cos((a * Math.PI) / 180) * 420} ${640 + Math.sin((a * Math.PI) / 180) * 240}`} stroke="#3a3428" strokeWidth={26} strokeLinecap="round" opacity={0.6} />
    <path d="M960 640 L960 420 L1080 640 Z" fill="#8a826e" />
    {txt(1400, 360, "1 HOUR", 54, K.green, 900, SANS)}
    <g opacity={cl((t - 2.6) * 2)}>{txt(960, 980, "ALL NIGHT", 80, "#ff6050", 900, SANS)}<line x1={760} y1={955} x2={1160} y2={955} stroke="#ff6050" strokeWidth={12} /></g>
  </Svg></AbsoluteFill></F>);
};
// ── TRADING_CARDS: figuritas coleccionables de los 9 tanques, una por tipo, con su "poder" y su remedio
const CARDS: [string, string, string, string][] = [
  ["THE LIGHT TANK", "#cfd6d8", "a little gray, lime on the float", "15 MIN"],
  ["THE BROWN TANK", "#8a5a2a", "years of hard water", "1 HOUR"],
  ["THE SLIME TANK", "#20281e", "soft black bottom", "BRUSH FIRST"],
  ["THE ORANGE TANK", "#c8642a", "iron streaks", "SAME CUP"],
  ["THE BLUE TANK", "#2a5fd0", "tablet sludge", "SCOOP IT OUT"],
  ["THE OLD TANK", "#9a8a6a", "1950s · rusty bolts", "GO EASY"],
  ["THE CRACKED TANK", "#e6e2da", "hairline crack", "DON'T PUSH"],
  ["THE EMPTY HOUSE", "#6a7a8a", "still water sits", "FLUSH WEEKLY"],
  ["THE SWEATY TANK", "#9fc8dc", "drips outside", "NOT A LEAK"],
];
export const trading_cards: H = ({ dur, v = 0 }) => {
  const t = useT(), [n, c, d, fix] = CARDS[Math.min(8, v)], fl = eio(pr(t, 0.2, 0.9)), sc = Math.cos((1 - fl) * Math.PI);
  return (<F dur={dur}><AbsoluteFill style={{ background: "#23202a" }}><Svg>
    {CARDS.map((_, i) => <rect key={i} x={120 + i * 46} y={980} width={36} height={50} rx={4} fill={i === v ? "#FFD84A" : i < v ? "#888" : "#444"} />)}
    <g transform={`translate(960 520) scale(${Math.abs(sc)} 1) rotate(-2)`}>
      {sc < 0 ? <rect x={-300} y={-420} width={600} height={840} rx={24} fill={K.navy} stroke="#FFD84A" strokeWidth={10} />
        : <><rect x={-300} y={-420} width={600} height={840} rx={24} fill="#FFD84A" /><rect x={-270} y={-390} width={540} height={500} fill={c} stroke={K.ink} strokeWidth={6} />
          <Tank x={0} y={-140} s={0.8} lvl={0.7} crust={v === 1 ? 1 : v === 5 ? 0.6 : 0} water={v === 4 ? "#2a5fd0" : v === 2 ? "#3a4a3a" : v === 3 ? "#d08a5a" : K.water} />
          {txt(0, 180, n, 46, K.ink, 900, SANS)}{txt(0, 240, d, 32, "#444", 600, SLAB)}
          <rect x={-200} y={290} width={400} height={80} rx={40} fill={K.red} />{txt(0, 345, fix, 40, K.white, 900, SANS)}
          {txt(250, -350, `${v + 1}/9`, 34, K.ink, 900, SANS)}</>}
    </g>
  </Svg></AbsoluteFill></F>);
};
// ── ICED_TEA: vaso de té helado que transpira igual que el tanque en verano
export const iced_tea: H = ({ dur }) => {
  const t = useT(), d = pr(t, 0.6, 5);
  return (<F dur={dur}><AbsoluteFill style={{ background: "linear-gradient(#f5d58a, #e2a55a)" }}><Svg>
    <path d="M560 300 L820 300 L790 900 L590 900 Z" fill="#b8642a" opacity={0.85} stroke="#fff" strokeWidth={6} />{[0, 1, 2].map((i) => <rect key={i} x={600 + i * 60} y={340 + i * 30} width={70} height={70} rx={10} fill="#fff" opacity={0.6} transform={`rotate(${i * 20} 630 380)`} />)}
    <g transform="translate(1250 600)"><rect x={-220} y={-260} width={440} height={520} rx={16} fill={K.porcelain} stroke={K.ink} strokeWidth={6} /></g>
    {Array.from({ length: 16 }, (_, i) => { const x0 = i < 8 ? 600 + (i * 23) % 180 : 1060 + (i * 47) % 380, y0 = i < 8 ? 380 : 380; return <ellipse key={i} cx={x0} cy={y0 + ((d * 900 + i * 90) % 520)} rx={9} ry={14} fill="#fff" opacity={0.8} />; })}
    {txt(690, 990, "ICED TEA", 44, "#5a2a0a", 900, SANS)}{txt(1250, 990, "TANK IN SUMMER", 44, "#5a2a0a", 900, SANS)}
    {lbl(t, "COLD INSIDE · HUMID OUTSIDE", 0.3, 160, "#5a2a0a")}
  </Svg></AbsoluteFill></F>);
};
// ── BUS_TIMETABLE: tablero de horarios de colectivo: la rutina del tanque. v0 mensual · v1 cada 3 meses · v2 una vez al año
export const bus_timetable: H = ({ dur, v = 0 }) => {
  const t = useT();
  const R = [["EVERY MONTH", "LIFT THE LID · LOOK"], ["EVERY 3 MONTHS", "THE CUP OF CITRIC ACID"], ["ONCE A YEAR", "FOOD COLORING TEST"]];
  return (<F dur={dur}><AbsoluteFill style={{ background: "#101418" }}><Svg>
    <rect x={200} y={180} width={1520} height={700} rx={16} fill="#181e24" stroke="#444" strokeWidth={6} />
    {txt(260, 260, "TANK LINE · DEPARTURES", 44, "#f2c230", 900, "monospace", "start")}
    {R.map(([a, b], i) => { const on = i === v, n = on ? Math.floor(pr(t, 0.2, 1.2) * b.length) : b.length; return <g key={i} opacity={i <= v ? 1 : 0.3}>
      {txt(260, 420 + i * 160, a, 46, on ? "#f2c230" : "#9aa", 900, "monospace", "start")}{txt(1660, 420 + i * 160, b.slice(0, n), 46, on ? K.white : "#9aa", 700, "monospace", "end")}
      {on && <rect x={230} y={370 + i * 160} width={1460} height={70} fill="none" stroke="#f2c230" strokeWidth={4} opacity={0.5 + 0.5 * Math.sin(t * 6)} />}</g>; })}
  </Svg></AbsoluteFill></F>);
};
// ── APOTHECARY: frasco de botica: la misma bolsa sirve en otras tres partes de la casa (v0 ducha · v1 aireador · v2 pava)
export const apothecary: H = ({ dur, v = 0 }) => {
  const t = useT(), p = eio(pr(t, 0.4, 1.6));
  const [n, d] = [["SHOWER HEAD", "bag of warm water · 2 spoonfuls · overnight"], ["AERATOR", "drop it in a cup · one hour"], ["KETTLE", "one spoonful · boil · let it sit"]][v];
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2a1f18" }}><Svg>
    {[0, 1, 2].map((i) => <rect key={i} x={160} y={300 + i * 260} width={1600} height={20} fill="#6a4a2a" />)}
    {[0, 1, 2].map((i) => <g key={i} opacity={i === v ? 1 : 0.35} transform={`translate(${520 + i * 440} ${i === v ? lerp(560, 520, p) : 560})`}>
      <rect x={-140} y={-220} width={280} height={360} rx={30} fill="#d8e6e0" opacity={0.7} stroke="#8aa" strokeWidth={6} /><rect x={-100} y={-280} width={200} height={70} rx={10} fill="#6a4a2a" />
      <rect x={-120} y={-100} width={240} height={140} fill="#F4EAD2" stroke="#6a4a2a" strokeWidth={4} />{txt(0, -40, ["SHOWER", "AERATOR", "KETTLE"][i], 34, "#5a3a1a", 900, SANS)}{txt(0, 10, "No. " + (i + 1), 28, "#7a5a3a", 700, SLAB)}</g>)}
    <g opacity={p}>{txt(960, 200, n, 64, K.cream, 900, SANS)}{txt(960, 960, d, 42, "#e8d2a8", 700, HAND)}</g>
  </Svg></AbsoluteFill></F>);
};
// ── JOB_BOARD: pizarra de taller con columna FUERTE / DÉBIL: el vinagre baja de columna
export const job_board: H = ({ dur }) => {
  const t = useT(), m = eio(pr(t, 0.2, 1.0));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2d3a30" }}><Svg>
    <rect x={360} y={200} width={1200} height={680} fill="#1f2a22" stroke="#8a6a3a" strokeWidth={14} />
    {txt(660, 290, "STRONGER", 54, "#e8e6df", 700, HAND)}{txt(1260, 290, "WEAKER", 54, "#e8e6df", 700, HAND)}<line x1={960} y1={240} x2={960} y2={840} stroke="#e8e6df" strokeWidth={4} />
    {txt(660, 480, "citric acid", 60, "#f2e27a", 700, HAND)}
    <g transform={`translate(${lerp(660, 1260, m)} ${lerp(600, 480, m)})`}>{txt(0, 0, "vinegar", 60, "#e8e6df", 700, HAND)}</g>
  </Svg></AbsoluteFill></F>);
};
// ── FILM_LEADER: cola de película antigua 5-4-3-2 que aterriza en 1979
export const film_leader: H = ({ dur }) => {
  const t = useT(), n = Math.max(0, 3 - Math.floor(t / 0.5)), sw = (t % 0.5) / 0.5;
  return (<F dur={dur}><AbsoluteFill style={{ background: "#c9c2b0" }}><Svg>
    {t < 1.5 ? <><circle cx={960} cy={540} r={360} fill="none" stroke="#222" strokeWidth={8} /><circle cx={960} cy={540} r={300} fill="none" stroke="#222" strokeWidth={4} />
      <path d={`M960 540 L960 180 A360 360 0 ${sw > 0.5 ? 1 : 0} 1 ${960 + Math.sin(sw * 6.283) * 360} ${540 - Math.cos(sw * 6.283) * 360} Z`} fill="#555" opacity={0.5} />
      <line x1={560} y1={540} x2={1360} y2={540} stroke="#222" strokeWidth={4} /><line x1={960} y1={140} x2={960} y2={940} stroke="#222" strokeWidth={4} />{txt(960, 620, String(n + 1), 260, "#111", 900, SANS)}</>
      : <g opacity={cl((t - 1.5) * 3)}>{txt(960, 560, "1979", 300, "#3a2a1a", 900, SLAB)}{txt(960, 680, "Chicago · I was nineteen", 56, "#3a2a1a", 700, HAND)}</g>}
    {Array.from({ length: 30 }, (_, i) => <line key={i} x1={(i * 137 + t * 900) % 1920} y1={0} x2={(i * 137 + t * 900) % 1920 + 4} y2={1080} stroke="#000" opacity={0.06} />)}
  </Svg></AbsoluteFill></F>);
};
// ── CRATE_DIG: los estantes de Gus como cajón de discos: los dedos pasan "sobres" de tapas de tanque viejas
export const crate_dig: H = ({ dur }) => {
  const t = useT(), k = Math.floor(t * 4);
  return (<F dur={dur}><AbsoluteFill style={{ background: "#3a2a1e" }}><Svg>
    <rect x={460} y={620} width={1000} height={380} fill="#8a5a32" stroke="#4a2a12" strokeWidth={10} />
    {Array.from({ length: 12 }, (_, i) => { const tilt = i < (k % 12) ? -24 : 0; return <g key={i} transform={`translate(${520 + i * 76} 640) rotate(${tilt} 0 0)`}><rect x={0} y={-300} width={60} height={320} fill={["#e6e2da", "#d8cfc0", "#ece6d8"][i % 3]} stroke="#555" strokeWidth={3} />{txt(30, -260, "'" + (55 + i * 2), 22, "#555", 800, SANS)}</g>; })}
    {lbl(t, "GUS'S SHELVES · FLOOR TO CEILING", 0.2, 180)}{txt(960, 300, "tank lids, by year", 50, K.copper, 700, HAND)}
  </Svg></AbsoluteFill></F>);
};
// ── SUGGESTION_BOX: buzón de sugerencias: sale un papelito con el comentario y Lenny lo sella. v0 intro · v1 la tapa · v2 pastillas · v3 bórax · v4 "who lets it get like that"
export const suggestion_box: H = ({ dur, v = 0 }) => {
  const t = useT(), up = eout(pr(t, 0.3, 1.1));
  const C = [["“What about the other tank videos?”", "LET'S ANSWER"], ["“Dropped the lid. Never found one that fit.”", "TOWEL ON THE FLOOR"], ["“Blue tablets made a thick sludge.”", "YES."], ["“A cup of borax overnight.”", "GENTLE · BUT SLOW"], ["“Who lets their toilet get like that?”", "ALMOST EVERYBODY"]][Math.min(4, v)];
  return (<F dur={dur}><AbsoluteFill style={{ background: "#26303a" }}><Svg>
    <rect x={710} y={620} width={500} height={380} rx={16} fill="#8a5a32" stroke="#4a2a12" strokeWidth={8} /><rect x={830} y={640} width={260} height={24} rx={8} fill="#2a1a10" />{txt(960, 790, "COMMENTS", 50, K.cream, 900, SANS)}
    <g transform={`translate(960 ${lerp(660, 380, up)}) rotate(${lerp(0, -2, up)})`}><rect x={-560} y={-170} width={1120} height={250} fill={K.white} stroke="#ccc" strokeWidth={3} />{txt(0, -40, C[0], 46, K.ink, 700, HAND)}</g>
    <Stamp t={t} at={Math.min(2.0, dur / 30 - 1.5)} x={1300} y={560} text={C[1]} size={46} col={v === 2 ? K.red : K.green} rot={-6} />
  </Svg></AbsoluteFill></F>);
};
// ── VENN: diagrama de Venn: agua oxigenada para el limo, ácido cítrico para el sarro; en el medio, NO juntos el mismo día
export const venn: H = ({ dur }) => {
  const t = useT(), a = eout(pr(t, 0.2, 1.0)), b = eout(pr(t, 0.8, 1.6));
  return (<F dur={dur}><AbsoluteFill style={CREAM}><Svg>
    <circle cx={lerp(400, 760, a)} cy={540} r={330} fill="#4a8ad0" opacity={0.45} /><circle cx={lerp(1520, 1160, b)} cy={540} r={330} fill="#f2c230" opacity={0.5} />
    <g opacity={a}>{txt(620, 500, "PEROXIDE", 50, K.navy, 900, SANS)}{txt(620, 560, "slime · mold", 38, K.navy, 700, HAND)}</g>
    <g opacity={b}>{txt(1300, 500, "CITRIC ACID", 50, "#6a4a00", 900, SANS)}{txt(1300, 560, "lime · rock", 38, "#6a4a00", 700, HAND)}</g>
    <g opacity={cl((t - 2) * 2)}>{txt(960, 530, "NOT THE", 30, K.red, 900, SANS)}{txt(960, 570, "SAME DAY", 30, K.red, 900, SANS)}</g>
  </Svg></AbsoluteFill></F>);
};
// ── SHELF_LABEL: etiqueta de góndola con lista de ingredientes: dentro de la pastilla de dentadura está el ácido cítrico
export const shelf_label: H = ({ dur }) => {
  const t = useT(), h = eio(pr(t, 1.0, 1.8));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#e8eef0" }}><Svg>
    <rect x={460} y={200} width={1000} height={680} fill={K.white} stroke="#333" strokeWidth={6} />
    {txt(520, 290, "DENTURE TABLETS", 56, "#111", 900, SANS, "start")}{txt(520, 350, "INGREDIENTS:", 36, "#333", 800, SANS, "start")}
    {["sodium bicarbonate", "CITRIC ACID", "potassium monopersulfate", "sodium carbonate", "fragrance"].map((s, i) => <g key={i}>{i === 1 && <rect x={510} y={400 + i * 80} width={lerp(0, 380, h)} height={60} fill="#FFF14A" opacity={0.7} />}{txt(520, 448 + i * 80, s, 42, "#222", i === 1 ? 900 : 500, SANS, "start")}</g>)}
    <g opacity={cl((t - 2) * 2)}>{txt(960, 990, "+ something that fizzes", 50, K.navy, 700, HAND)}</g>
  </Svg></AbsoluteFill></F>);
};
// ── ICEBERG: el tanque es un iceberg: arriba la tapa limpia del baño impecable, abajo lo que nadie mira
export const iceberg: H = ({ dur }) => {
  const t = useT(), d = eio(pr(t, 0.6, 2.4));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#0e2a44" }}><Svg>
    <g transform={`translate(0 ${-d * 300})`}>
      <rect x={0} y={0} width={1920} height={420} fill="#bfe0f2" />
      <path d="M820 420 L900 300 L1000 280 L1100 420 Z" fill="#fff" />{txt(960, 220, "THE CLEAN BATHROOM", 46, K.navy, 900, SANS)}
      <path d="M700 420 L1240 420 L1380 820 L1100 1080 L760 1060 L560 760 Z" fill="#9fc8dc" opacity={0.85} />
      {["LIME", "IRON", "SLIME", "BLUE SLUDGE"].map((s, i) => <g key={s} opacity={cl((t - 1.2 - i * 0.3) * 3)}>{txt(960, 560 + i * 120, s, 54, "#0e2a44", 900, SANS)}</g>)}
      <rect x={0} y={418} width={1920} height={6} fill="#fff" opacity={0.5} />
    </g>
    <g opacity={cl((t - 2.6) * 2)}>{txt(960, 1000, "a closed box nobody opens", 50, K.cream, 700, HAND)}</g>
  </Svg></AbsoluteFill></F>);
};
// ── STAMP_ALBUM: álbum de estampillas: el resumen final, una estampilla por idea. v0 qué es el tanque · v1 la receta · v2 los tiempos
export const stamp_album: H = ({ dur, v = 0 }) => {
  const t = useT(), D = dur / 30;
  const S = [["WHERE THE BOWL'S WATER LIVES", "LIME", "IRON", "SLIME"], ["WATER OFF", "FLUSH & HOLD", "1 CUP", "2 GALLONS"], ["15 MINUTES", "PLASTIC BRUSH", "1 HOUR TOPS", "NEVER LONGER"]][Math.min(2, v)];
  return (<F dur={dur}><AbsoluteFill style={{ background: "#3a2a20" }}><Svg>
    <rect x={240} y={100} width={1440} height={880} fill="#efe6cf" stroke="#8a6a3a" strokeWidth={6} />
    {txt(960, 190, ["THE TANK", "THE CUP", "THE CLOCK"][Math.min(2, v)], 64, "#5a3a1a", 900, SLAB)}
    {S.map((s, i) => { const a = 0.3 + i * Math.max(0.5, (D - 1.5) / 4), p = spr(t, a, 1.4), x = 470 + (i % 2) * 980 - (i % 2) * 0 + (i % 2 ? -260 : 0), y = 300 + Math.floor(i / 2) * 330;
      return <g key={i} transform={`translate(${x + 230} ${y + 130}) scale(${p}) rotate(${[-3, 2, 2, -2][i]})`}>
        <rect x={-260} y={-140} width={520} height={280} fill={[K.red, K.navy, K.copper, "#3F7D4E"][i]} stroke="#fff" strokeWidth={10} strokeDasharray="14 8" />
        {txt(0, 18, s, s.length > 16 ? 30 : 44, K.white, 900, SANS)}{txt(220, -100, ["1¢", "2¢", "5¢", "10¢"][i], 26, "#fff", 800, SANS, "end")}</g>; })}
  </Svg></AbsoluteFill></F>);
};
// ── SWITCHES_OFF: panel de cuatro interruptores de palanca: NO TABLETS · NO BLEACH · NO MIXING · NO METAL se bajan de a uno
export const switches_off: H = ({ dur }) => {
  const t = useT();
  return (<F dur={dur}><AbsoluteFill style={{ background: "#1e2328" }}><Svg>
    <rect x={260} y={260} width={1400} height={560} rx={20} fill="#3a4148" stroke="#111" strokeWidth={8} />
    {["TABLETS", "BLEACH", "MIXING", "METAL"].map((s, i) => { const o = eio(pr(t, 0.4 + i * 0.7, 0.7 + i * 0.7)), x = 440 + i * 350; return <g key={s}>
      <rect x={x - 70} y={380} width={140} height={260} rx={14} fill="#22272c" /><g transform={`translate(${x} 510) rotate(${lerp(-30, 30, o)})`}><rect x={-18} y={-130} width={36} height={130} rx={14} fill="#ccc" /></g>
      <circle cx={x} cy={330} r={18} fill={o > 0.5 ? "#ff4030" : "#4fd36a"} />{txt(x, 720, "NO " + s, 40, K.cream, 900, SANS)}</g>; })}
  </Svg></AbsoluteFill></F>);
};

// ── LIBRO ───────────────────────────────────────────────
// el libro gira desde el lomo y se abre
export const bkd_spine: H = ({ dur }) => {
  const t = useT(), r = eio(pr(t, 0.1, 1.0));
  return (<F dur={dur}><AbsoluteFill style={NAVY}><Svg>
    <g transform={`translate(960 540) scale(${lerp(0.15, 1, r)} 1)`}><rect x={-240} y={-310} width={480} height={620} fill="#111" opacity={0.3} /><image href={PG("p001")} x={-232} y={-300} width={464} height={600} preserveAspectRatio="none" /></g>
    <rect x={960 - lerp(40, 8, r)} y={230} width={lerp(80, 16, r)} height={620} fill={K.copper} opacity={1 - r} />
  </Svg><FromBook /></AbsoluteFill></F>);
};
// página 58 bajo una lámpara de escritorio que se prende con un clic; el cono de luz barre la página
export const bkd_lamp: H = ({ dur }) => {
  const t = useT(), D = dur / 30, on = pr(t, 0.4, 0.5), z = lerp(1, 1.35, eio(pr(t, 1.6, D - 0.6))), ty = lerp(0, -140, eio(pr(t, 1.6, D - 0.6)));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#14100c" }}><Svg>
    <g opacity={0.25 + 0.75 * on} transform={`translate(860 ${560 + ty}) scale(${z}) translate(-860 -560)`}><Page n="p058" x={860} y={560} h={1000} rot={-2} /></g>
    <path d="M1480 140 L1760 140 L1880 300 L1360 300 Z" fill="#2c5a3a" /><line x1={1620} y1={300} x2={1620} y2={1080} stroke="#888" strokeWidth={14} />
    <path d="M1360 300 L1880 300 L1200 1080 L200 1080 Z" fill="#FFE8A8" opacity={0.12 * on} />
    <Pencil t={t} at={1.2} x={1500} y={480} text="page 58" size={70} col={K.cream} to={[1200, 420]} />
  </Svg><FromBook x={140} y={60} /></AbsoluteFill></F>);
};
// un clip con bandera roja se engancha sobre el paso 4 (una hora, no más): la regla de las gomas
export const bkd_flag: H = ({ dur }) => {
  const t = useT(), c = eout(pr(t, 0.5, 1.1));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2a2622" }}><Svg>
    <Page n="p058" x={620} y={540} h={1000} op={0.9} />
    <Crop n="p058" fx={0.3} fy={0.61} fw={0.21} fh={0.2} x={1080} y={200} w={700} id="bdf" />
    <g transform={`translate(${lerp(1900, 1100, c)} 200) rotate(-8)`}><rect x={0} y={-10} width={40} height={140} rx={20} fill="none" stroke="#aaa" strokeWidth={8} /><line x1={20} y1={-10} x2={20} y2={-180} stroke="#333" strokeWidth={6} /><path d="M20 -180 L180 -140 L20 -100 Z" fill={K.red} /></g>
    <g opacity={cl((t - 1.4) * 2)}>{txt(1430, 900, "THE RUBBER RULE", 56, K.cream, 900, SANS)}{txt(1430, 970, "one hour, no more", 44, "#FFD86A", 700, HAND)}</g>
  </Svg><FromBook x={140} y={60} /></AbsoluteFill></F>);
};
// un cheque que se escribe solo: PAY TO plumber $150 se tacha y el cheque nuevo dice $6
export const bkd_check: H = ({ dur }) => {
  const t = useT(), w1 = Math.floor(pr(t, 0.3, 1.5) * 10), strike = eio(pr(t, 1.8, 2.3)), w2 = eout(pr(t, 2.6, 3.4));
  const Chk = (y: number, to: string, amt: string, n: number, col: string) => (<g transform={`translate(960 ${y})`}><rect x={-620} y={-150} width={1240} height={300} fill="#E6F0E2" stroke="#6a8a6a" strokeWidth={4} />
    {txt(-580, -90, "PAY TO THE ORDER OF", 26, "#4a6a4a", 800, SANS, "start")}{txt(-260, -86, to.slice(0, n), 46, K.ink, 700, HAND, "start")}
    <rect x={300} y={-60} width={280} height={90} fill={K.white} stroke="#6a8a6a" strokeWidth={4} />{txt(440, 8, amt, 60, col, 900, SLAB)}
    {txt(-580, 100, "PAGE 58 · CLEANING THE TANK", 26, "#4a6a4a", 700, SANS, "start")}</g>);
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2a3a2e" }}><Svg>
    {Chk(330, "the plumber", "$150", w1, K.red)}
    <line x1={340} y1={330} x2={lerp(340, 1580, strike)} y2={330} stroke={K.red} strokeWidth={12} />
    <g opacity={w2} transform={`translate(0 ${lerp(60, 0, w2)})`}>{Chk(760, "you", "$6", 10, K.green)}</g>
    <Stamp t={t} at={3.8} x={1560} y={960} text="YOU KEEP $144" size={54} col={K.green} rot={-5} />
  </Svg><FromBook x={140} y={60} /></AbsoluteFill></F>);
};
// TV vieja: el tubo calienta (línea blanca → imagen), aparece el QR y la leyenda FIRST LINE OF DESCRIPTION. v0 CTA1 (p58) · v1 CTA2 (p19)
export const bkd_tvqr: H = ({ dur, v = 0 }) => {
  const t = useT(), warm = eout(pr(t, 0.1, 0.8)), pg = v === 1 ? "p019" : "p058";
  return (<F dur={dur}><AbsoluteFill style={{ background: "#3a2a1c" }}><Svg>
    <Page n={pg} x={420} y={560} h={760} rot={-5} op={0.95} />
    <rect x={840} y={150} width={980} height={780} rx={60} fill="#6a4a2a" stroke="#2a1a0a" strokeWidth={10} />
    <rect x={900} y={210} width={720} height={600} rx={50} fill="#0a0a0a" />
    <clipPath id={"tv" + v}><rect x={910} y={510 - 290 * warm} width={700} height={Math.max(6, 580 * warm)} rx={40} /></clipPath>
    <g clipPath={`url(#tv${v})`}><rect x={910} y={220} width={700} height={580} fill="#f2f2ec" /><image href={PG("qr_tank")} x={1060} y={250} width={400} height={400} />
      {txt(1260, 720, "FIRST LINE OF", 40, K.ink, 900, SANS)}{txt(1260, 770, "THE DESCRIPTION", 40, K.ink, 900, SANS)}
      {Array.from({ length: 40 }, (_, i) => <rect key={i} x={910} y={220 + i * 15} width={700} height={2} fill="#000" opacity={0.06} />)}</g>
    {[0, 1].map((i) => <circle key={i} cx={1720} cy={300 + i * 160} r={50} fill="#2a1a0a" />)}
    <g opacity={cl((t - 1.2) * 2)}>{txt(1330, 1010, "SCAN · OR THE FIRST LINE", 36, K.cream, 800, SANS)}</g>
  </Svg><FromBook x={140} y={60} /></AbsoluteFill></F>);
};
// página 19 sale deslizando de una carpeta manila
export const bkd_folder: H = ({ dur }) => {
  const t = useT(), s = eio(pr(t, 0.3, 1.6));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2a2f36" }}><Svg>
    <g transform={`translate(0 ${lerp(300, -60, s)})`}><Page n="p019" x={960} y={560} h={760} /></g>
    <path d="M460 620 L860 620 L900 580 L1460 580 L1460 1080 L460 1080 Z" fill="#d8b878" stroke="#8a6a3a" strokeWidth={6} />
    {txt(960, 760, "THE WARPED FLAPPER", 54, "#5a3a1a", 900, SANS)}{txt(960, 830, "page 19", 44, "#5a3a1a", 700, HAND)}
  </Svg><FromBook x={140} y={60} /></AbsoluteFill></F>);
};
// calculadora de escritorio con rollo de papel: 175 − 6 = 169, el rollo imprime cada línea
export const bkd_calc: H = ({ dur }) => {
  const t = useT(), L = [["175.00", "PLUMBER"], ["−6.00", "YOU"], ["169.00 *", "YOU KEEP"]], k = Math.min(3, Math.floor(pr(t, 0.6, 4.0) * 3.99));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#26221e" }}><Svg>
    <Crop n="p019" fx={0.7} fy={0.6} fw={0.26} fh={0.2} x={120} y={260} w={600} id="bdc" />
    <rect x={1000} y={120 - k * 20} width={420} height={360 + k * 90} fill="#F7F3E8" />
    {L.slice(0, k).map(([a, b], i) => <g key={i}>{txt(1390, 380 + i * 90 - k * 20 + 90, a, 46, i === 2 ? K.green : K.ink, 700, "monospace", "end")}{txt(1030, 380 + i * 90 - k * 20 + 90, b, 26, "#777", 700, SANS, "start")}</g>)}
    <rect x={900} y={560} width={620} height={480} rx={30} fill="#d6d2c8" stroke="#555" strokeWidth={6} /><rect x={960} y={600} width={500} height={90} fill="#3a4a3a" />
    {txt(1440, 665, k >= 3 ? "169" : k >= 1 ? ["175", "6"][k - 1] : "0", 60, "#b8f0a0", 700, "monospace", "end")}
    {Array.from({ length: 12 }, (_, i) => <rect key={i} x={970 + (i % 4) * 125} y={720 + Math.floor(i / 4) * 100} width={100} height={76} rx={10} fill={i === 11 ? K.red : "#f2efe6"} stroke="#555" strokeWidth={3} />)}
  </Svg><FromBook x={140} y={60} /></AbsoluteFill></F>);
};
// cajón de fichero de biblioteca: 40 fichas, cada una un arreglo con su precio de plomero y el tuyo
export const bkd_catalog: H = ({ dur }) => {
  const t = useT(), o = eout(pr(t, 0.2, 1.2)), k = Math.floor(pr(t, 1.2, 6) * 40);
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2c2018" }}><Svg>
    <g transform={`translate(0 ${lerp(-200, 0, o)})`}><rect x={460} y={420} width={1000} height={560} fill="#9a6a3a" stroke="#4a2a12" strokeWidth={10} />
      {Array.from({ length: 40 }, (_, i) => { const up = i === k ? -110 : 0; return <rect key={i} x={500 + (i % 40) * 23} y={470 + up} width={18} height={300} fill={i === k ? K.white : "#ece4d0"} stroke="#aaa" strokeWidth={1} />; })}
      <rect x={860} y={860} width={200} height={70} rx={10} fill="#d8b878" />{txt(960, 908, "TOILETS", 32, "#4a2a12", 900, SANS)}</g>
    {txt(960, 180, "EVERY TOILET, FIXED", 70, K.cream, 900, SLAB)}{txt(960, 260, `${Math.min(40, k + 1)} of 40 · the plumber's price · and yours`, 40, "#e8c890", 700, HAND)}
  </Svg><FromBook x={140} y={60} /></AbsoluteFill></F>);
};
// cierre: el libro se acomoda en un estante entre tapas de tanque viejas de Gus
export const bkd_shelf: H = ({ dur }) => {
  const t = useT(), s = eio(pr(t, 0.4, 1.8));
  return (<F dur={dur}><AbsoluteFill style={{ background: "linear-gradient(#3a2a1e, #22180f)" }}><Svg>
    <rect x={160} y={760} width={1600} height={40} fill="#7a4a22" /><rect x={160} y={360} width={1600} height={30} fill="#7a4a22" />
    {Array.from({ length: 8 }, (_, i) => <rect key={i} x={240 + i * 90 + (i > 3 ? 360 : 0)} y={420} width={70} height={340} rx={10} fill={["#e6e2da", "#d8cfc0", "#ece6d8", "#cfc6b6"][i % 4]} stroke="#555" strokeWidth={3} />)}
    <g transform={`translate(${lerp(1300, 960, s)} ${lerp(300, 590, s)}) rotate(${lerp(20, 0, s)})`}><rect x={-150} y={-170} width={300} height={340} fill="#111" opacity={0.3} /><image href={PG("p001")} x={-145} y={-180} width={262} height={340} preserveAspectRatio="none" /></g>
    <g opacity={cl((t - 2.4) * 1.5)}>{txt(960, 940, "THE $10 PLUMBER", 60, K.cream, 900, SLAB)}{txt(960, 1010, "what did you find in your tank?", 44, "#e8c890", 700, HAND)}</g>
  </Svg><FromBook x={140} y={60} /></AbsoluteFill></F>);
};

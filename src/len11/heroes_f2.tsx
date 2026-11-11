// Héroes de len11f, parte 2: herramientas, errores, tipos de termotanque, rutina, historia de Gus, comentarios y el libro.
import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { K, SLAB, SANS, HAND, cl, lerp, eio, eout, pr, useT, Stamp, FromBook, Svg } from "./kit";
import { H, F, txt, NAVY, CREAM, BASE, eIn, Tank } from "./heroes_f";

const PG = (n: string) => staticFile(`len11f/c/${n}.png`);
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
const QR: React.FC<{ x: number; y: number; page: string; edge?: string }> = ({ x, y, page, edge = K.navy }) => (<g>
  <rect x={x} y={y} width={740} height={820} rx={20} fill="#fff" stroke={edge} strokeWidth={10} /><image href={PG("qr_heater")} x={x + 120} y={y + 60} width={500} height={500} />
  {txt(x + 370, y + 640, "FIRST LINE OF", 46, K.navy, 900, SANS)}{txt(x + 370, y + 700, "THE DESCRIPTION", 46, K.navy, 900, SANS)}{txt(x + 370, y + 770, page, 40, K.red, 900, SANS)}</g>);

// ── FLAME_SHIELD: un escudo delante de la llama piloto: primero, el gas
export const flame_shield: H = ({ dur }) => {
  const t = useT(), s = eout(pr(t, 0.4, 1.0));
  return (<F dur={dur}><AbsoluteFill style={BASE}><Svg>
    <path d={`M960 ${760} Q${930} ${640 - 20 * Math.sin(t * 9)} 960 560 Q990 ${640 + 20 * Math.sin(t * 7)} 960 760 Z`} fill="#3d8bfd" />
    <g transform={`translate(${lerp(1700, 1120, s)} 600)`}><path d="M0 -240 L180 -180 L180 40 Q180 200 0 280 Q-180 200 -180 40 L-180 -180 Z" fill="#c8a24a" stroke={K.ink} strokeWidth={8} />{txt(0, 30, "GAS", 70, K.ink, 900, SANS)}</g>
    {txt(960, 150, "SAFETY FIRST: THE GAS", 60, K.cream, 900, SANS)}{txt(960, 930, "SMELL GAS? STOP AND CALL THE GAS COMPANY", 40, K.copper, 900, SANS)}
  </Svg></AbsoluteFill></F>);
};
// ── BALLOON_VALVE: un globo que se desinfla por la canilla abierta: la presión sale
export const balloon_valve: H = ({ dur }) => {
  const t = useT(), d = eio(pr(t, 0.3, 2.0)), r = lerp(260, 120, d);
  return (<F dur={dur}><AbsoluteFill style={{ background: "#e6eef2" }}><Svg>
    <ellipse cx={760} cy={480} rx={r} ry={r * 1.15} fill={K.red} stroke={K.ink} strokeWidth={6} /><path d={`M${760} ${480 + r * 1.15} L760 820`} stroke={K.ink} strokeWidth={6} />
    <rect x={720} y={820} width={80} height={60} fill="#b88a3a" stroke={K.ink} strokeWidth={5} />
    {Array.from({ length: 5 }, (_, i) => { const p = ((t * 1.5 + i * 0.2) % 1); return <path key={i} d={`M${820 + p * 400} ${850 - i * 8} l40 0`} stroke="#5b8fb5" strokeWidth={6} opacity={(1 - p) * (1 - d * 0.6)} />; })}
    {txt(1350, 420, "HOT FAUCET OPEN", 60, K.navy, 900, SANS)}{txt(1350, 500, "THE PRESSURE COMES OFF", 44, K.graphite, 800, SANS)}
  </Svg></AbsoluteFill></F>);
};
// ── MEASURING_JUG: jarra medidora que se llena hasta 5 galones. v1: con cinco menos el agua queda adentro
export const measuring_jug: H = ({ dur, v = 0 }) => {
  const t = useT(), f = eio(pr(t, 0.2, 1.8));
  return (<F dur={dur}><AbsoluteFill style={CREAM}><Svg>
    {v === 0 ? <><path d="M700 260 L1220 260 L1180 980 L740 980 Z" fill="rgba(160,200,230,0.25)" stroke={K.ink} strokeWidth={8} />
      <path d={`M${740 - 0} 980 L1180 980 L${1180 + 40 * f * 0} ${980 - 640 * f} L${740} ${980 - 640 * f} Z`} fill="#c9b98a" opacity={0.85} />
      {[1, 2, 3, 4, 5].map((g) => <g key={g}><line x1={1100} y1={980 - g * 128} x2={1180} y2={980 - g * 128} stroke={K.ink} strokeWidth={5} />{txt(1240, 992 - g * 128, `${g} GAL`, 34, K.ink, 800, SANS, "start")}</g>)}
      {txt(960, 150, "ABOUT FIVE GALLONS · A FEW MINUTES", 56, K.navy, 900, SANS)}</>
      : <><Tank x={760} y={560} s={0.95} level={0.86} />{txt(1350, 460, "FIVE GALLONS LOWER", 58, K.navy, 900, SANS)}{txt(1350, 540, "IT STAYS INSIDE", 52, K.green, 900, SANS)}</>}
  </Svg></AbsoluteFill></F>);
};
// ── RULER_HEX: regla de carpintero sobre la cabeza hexagonal: 1-1/16"
export const ruler_hex: H = ({ dur }) => {
  const t = useT(), s = eout(pr(t, 0.3, 1.0));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#d9d4c7" }}><Svg>
    <polygon points={Array.from({ length: 6 }, (_, i) => { const a = (i * 60 + 30) * Math.PI / 180; return `${960 + Math.cos(a) * 220},${560 + Math.sin(a) * 220}`; }).join(" ")} fill="#9b9b9b" stroke={K.ink} strokeWidth={8} />
    <g transform={`translate(0 ${lerp(-500, 0, s)})`}><rect x={560} y={270} width={800} height={90} fill="#f2d03a" stroke={K.ink} strokeWidth={5} />
      {Array.from({ length: 33 }, (_, i) => <line key={i} x1={580 + i * 23} y1={270} x2={580 + i * 23} y2={i % 4 ? 300 : 320} stroke={K.ink} strokeWidth={3} />)}</g>
    <g opacity={cl((t - 1.1) * 2)}><line x1={770} y1={420} x2={1150} y2={420} stroke={K.red} strokeWidth={6} />{txt(960, 940, "1-1/16 INCH", 90, K.navy, 900, SLAB)}</g>
  </Svg></AbsoluteFill></F>);
};
// ── SEESAW_LEVER: subibaja: un mango largo levanta lo que la mano sola no
export const seesaw_lever: H = ({ dur }) => {
  const t = useT(), a = lerp(14, -10, eio(pr(t, 0.4, 1.6)));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#e7dcc4" }}><Svg>
    <path d="M760 800 L700 900 L820 900 Z" fill={K.ink} />
    <g transform={`rotate(${a} 760 790)`}><rect x={560} y={770} width={1100} height={36} rx={10} fill="#555" /><rect x={520} y={700} width={80} height={110} rx={10} fill="#9b9b9b" stroke={K.ink} strokeWidth={5} />
      <circle cx={1600} cy={740} r={46} fill="#e8b48f" stroke={K.ink} strokeWidth={5} /></g>
    {txt(960, 160, "A LONG BREAKER BAR", 64, K.navy, 900, SANS)}{txt(960, 240, "LEVERAGE, NOT MUSCLE", 46, K.copper, 900, SANS)}
  </Svg></AbsoluteFill></F>);
};
// ── DOMINO_TWIST: si empujás demasiado, el tanque gira y los caños caen como dominó
export const domino_twist: H = ({ dur, v = 0 }) => {
  const t = useT(), fall = (i: number) => eIn(pr(t, 0.5 + i * 0.18, 0.9 + i * 0.18));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2f343a" }}><Svg>
    {Array.from({ length: 6 }, (_, i) => <g key={i} transform={`translate(${480 + i * 190} 760) rotate(${fall(i) * 72})`}><rect x={-30} y={-280} width={60} height={280} rx={6} fill={i ? "#b87333" : "#e9e6df"} stroke={K.ink} strokeWidth={5} /></g>)}
    {txt(960, 150, ["IT TWISTS THE PIPES", "AN OLD TANK: THE FITTING TWISTS OUT", "MISTAKE THREE: TWISTING THE TANK"][v], 58, K.cream, 900, SANS)}
    <g opacity={cl((t - 1.6) * 2)}>{txt(960, 940, v === 2 ? "PIPES CRACK · THE GAS LINE GETS STRESSED" : "HOLD IT · SHORT PULLS", 44, K.copper, 900, SANS)}</g>
  </Svg></AbsoluteFill></F>);
};
// ── CEILING_BUMP: la varilla larga choca contra la viga del techo del sótano
export const ceiling_bump: H = ({ dur }) => {
  const t = useT(), up = Math.min(eio(pr(t, 0.2, 1.2)), 0.62), hit = pr(t, 1.0, 1.1) >= 1, sh = hit ? Math.sin(t * 40) * 6 * Math.exp(-(t - 1.1) * 4) : 0;
  return (<F dur={dur}><AbsoluteFill style={{ background: "#4a4038" }}><Svg>
    <rect x={0} y={150} width={1920} height={110} fill="#8a6a40" stroke="#3a2a10" strokeWidth={6} />{txt(1600, 220, "JOIST", 40, "#f2e6c8", 900, SANS)}
    <rect x={760} y={640} width={400} height={440} rx={30} fill="#e9e6df" stroke={K.ink} strokeWidth={6} />
    <rect x={930 + sh} y={lerp(600, 260, up / 0.62) } width={60} height={500} rx={20} fill="#a7a39a" stroke={K.ink} strokeWidth={5} />
    <g opacity={cl((t - 1.3) * 2)}>{txt(960, 380, "LOW CEILING?", 64, K.cream, 900, SANS)}</g>
  </Svg></AbsoluteFill></F>);
};
// ── REPORT_CARD: libreta de calificaciones de la varilla. v0 todavía ayuda · v1 la quinta · v3 la varilla es un indicador
export const report_card: H = ({ dur, v = 0 }) => {
  const t = useT(), d = eout(pr(t, 0.1, 0.7));
  const rows = [["THICKNESS", v === 0 ? "C" : "F"], ["BARE WIRE", v === 0 ? "B" : "F"], ["STILL PROTECTING", v === 0 ? "A LITTLE" : "NO"]];
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2c3e50" }}><Svg>
    <g transform={`translate(960 ${lerp(1300, 560, d)}) rotate(2)`}><rect x={-480} y={-380} width={960} height={760} fill="#fbf7ea" stroke="#6a5a2a" strokeWidth={6} />
      {txt(0, -290, v === 3 ? "THE ROD IS A GAUGE" : "REPORT CARD · ANODE ROD", 50, K.navy, 900, SANS)}
      {rows.map(([a, b], i) => <g key={a}>{txt(-420, -150 + i * 130, a, 46, K.ink, 800, SANS, "start")}{txt(380, -150 + i * 130, b, 60, K.red, 700, HAND, "end")}</g>)}
      {txt(0, 300, v === 0 ? "IT HELPS · IT CAN'T UNDO THE DAMAGE" : v === 1 ? "THAT'S THE FIFTH ONE" : "IT TELLS YOU HOW THE TANK IS DOING", 38, K.graphite, 800, SANS)}</g>
  </Svg></AbsoluteFill></F>);
};
// ── CHAIN_LINKS: la varilla flexible por segmentos se dobla como una ristra
export const chain_links: H = ({ dur }) => {
  const t = useT(), b = eio(pr(t, 0.3, 1.6));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#e7dcc4" }}><Svg>
    {Array.from({ length: 9 }, (_, i) => { const a = b * i * 0.18, x = 520 + Math.sin(a) * i * 70 + i * (1 - b) * 0, y = 220 + Math.cos(a) * i * 85; return <g key={i}><ellipse cx={x} cy={y} rx={46} ry={40} fill="#a7a39a" stroke={K.ink} strokeWidth={5} /></g>; })}
    {txt(1300, 440, "A FLEXIBLE ROD", 64, K.navy, 900, SANS)}{txt(1300, 520, "IN SEGMENTS", 48, K.graphite, 800, SANS)}{txt(1300, 620, "FOR LOW CLEARANCE", 44, K.copper, 900, SANS)}
  </Svg></AbsoluteFill></F>);
};
// ── NOSE_CLIP: un broche en la nariz: olor a huevo podrido. v0 pedí aluminio-zinc · v1 bacterias + magnesio
export const nose_clip: H = ({ dur, v = 0 }) => {
  const t = useT(), c = eout(pr(t, 0.3, 0.9));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#d8e0b0" }}><Svg>
    <path d="M820 300 Q960 260 1000 520 Q1020 640 920 660 Q860 640 880 600" fill="#e8b48f" stroke={K.ink} strokeWidth={6} />
    <g transform={`translate(${lerp(1500, 960, c)} 470)`}><rect x={-30} y={-110} width={60} height={220} rx={10} fill="#d9a03a" stroke={K.ink} strokeWidth={5} /><circle r={18} fill="#8a6a2a" /></g>
    {[0, 1, 2].map((i) => <path key={i} d={`M${560 + i * 60} ${700 - ((t * 60 + i * 40) % 200)} q20 -30 0 -60 q-20 -30 0 -60`} fill="none" stroke="#8a9a3a" strokeWidth={6} opacity={0.8} />)}
    {txt(960, 140, "ROTTEN-EGG HOT WATER?", 60, K.navy, 900, SANS)}{txt(960, 920, v === 0 ? "ASK FOR AN ALUMINUM-ZINC ROD" : "BACTERIA + THE MAGNESIUM ROD", 48, K.red, 900, SANS)}
  </Svg></AbsoluteFill></F>);
};
// ── CLEAR_GLASS: tres vasos de lo que sale de la manguera: turbio, menos, claro
export const clear_glass: H = ({ dur }) => {
  const t = useT();
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2a3440" }}><Svg>
    {[0, 1, 2].map((i) => { const on = cl((t - 0.3 - i * 0.6) * 3); return <g key={i} transform={`translate(${600 + i * 360} 600)`} opacity={on}>
      <path d="M-110 -220 L110 -220 L90 220 L-90 220 Z" fill={["rgba(225,215,180,0.95)", "rgba(220,225,215,0.7)", "rgba(200,225,240,0.35)"][i]} stroke="#e6eef2" strokeWidth={6} />
      {i < 2 && Array.from({ length: 12 - i * 8 }, (_, k) => <circle key={k} cx={-70 + (k * 37) % 140} cy={100 + (k * 23) % 100} r={6} fill="#f5f1e4" />)}{txt(0, 300, ["FIRST", "LATER", "CLEAR"][i], 42, K.cream, 900, SANS)}</g>; })}
    {txt(960, 150, "UNTIL THE BUCKET COMES OUT CLEAR", 58, K.cream, 900, SANS)}
  </Svg></AbsoluteFill></F>);
};
// ── KNOCK_THREE: tres golpes en la puerta: hacelo dos o tres veces
export const knock_three: H = ({ dur }) => {
  const t = useT(), n = Math.min(3, Math.floor(t * 1.6));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#3a2a1c" }}><Svg>
    <rect x={660} y={140} width={600} height={940} fill="#7a4e2c" stroke="#2a160a" strokeWidth={10} /><circle cx={1180} cy={640} r={24} fill="#c8a24a" />
    {Array.from({ length: n }, (_, i) => <g key={i}>{txt(500 - i * 0, 360 + i * 160, ["ONE", "TWO", "THREE"][i], 70, K.cream, 900, SANS, "end")}</g>)}
    {txt(1600, 560, "DO IT TWO", 50, K.cream, 900, SANS)}{txt(1600, 630, "OR THREE TIMES", 50, K.cream, 900, SANS)}
  </Svg></AbsoluteFill></F>);
};
// ── RECAP_TICKER: cinta de teletipo con el resumen en una línea
const TK = ["DIAL TO VACATION THE NIGHT BEFORE", "COLD OFF · HOT FAUCET OPEN", "PENCIL-THIN OR BARE WIRE: IT'S DONE"];
export const recap_ticker: H = ({ dur, v = 0 }) => {
  const t = useT(), x = lerp(1920, -400, pr(t, 0, 3.2));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#111" }}><Svg>
    <rect x={0} y={460} width={1920} height={160} fill="#1d2a1d" /><rect x={0} y={460} width={1920} height={8} fill="#3a5" /><rect x={0} y={612} width={1920} height={8} fill="#3a5" />
    {txt(x, 568, `${TK[v] || TK[0]}  ·  IN ONE LINE  ·`, 72, "#8f8", 900, SANS, "start")}{txt(960, 300, "SO, IN ONE LINE", 56, K.cream, 900, SANS)}
  </Svg></AbsoluteFill></F>);
};
// ── WARN_SIGN: carteles de obra amarillos que bajan colgando: los cinco errores · v5 todos juntos
const WS = [["MISTAKE 1", "A HOT TANK"], ["MISTAKE 2", "ELECTRIC · BREAKER ON"], ["MISTAKE 3", "TWISTING THE TANK"], ["MISTAKE 4", "A PLASTIC DRAIN VALVE"], ["MISTAKE 5", "CAPPING THE RELIEF VALVE"]];
export const warn_sign: H = ({ dur, v = 0 }) => {
  const t = useT(), d = eout(pr(t, 0.1, 0.7)), sw = Math.sin(t * 3) * 3 * (1 - cl(t / 2));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2f343a" }}><Svg>
    {v < 5 ? <g transform={`translate(960 ${lerp(-500, 520, d)}) rotate(${sw})`}><line x1={-250} y1={-600} x2={-250} y2={-300} stroke="#888" strokeWidth={6} /><line x1={250} y1={-600} x2={250} y2={-300} stroke="#888" strokeWidth={6} />
      <polygon points="0,-330 360,30 0,390 -360,30" fill="#f2c230" stroke={K.ink} strokeWidth={12} />{txt(0, -40, WS[v][0], 54, K.ink, 900, SANS)}{txt(0, 60, WS[v][1], 40, K.ink, 900, SANS)}</g>
      : WS.map(([a, b], i) => <g key={a} transform={`translate(${260 + i * 350} ${lerp(-300, 540, cl(d * 1.5 - i * 0.12))}) rotate(45)`}><rect x={-120} y={-120} width={240} height={240} fill="#f2c230" stroke={K.ink} strokeWidth={8} /><g transform="rotate(-45)">{txt(0, 12, `${i + 1}`, 80, K.ink, 900, SANS)}</g></g>)}
    {v === 5 && txt(960, 950, "NO HOT TANK · NO BREAKER · NO TWISTING · NO PLASTIC VALVE · NO CAP", 34, K.cream, 900, SANS)}
  </Svg></AbsoluteFill></F>);
};
// ── PRESSURE_GAUGE: manómetro que sube hacia rojo; la válvula de alivio lo frena. v1 tapada = bomba · v2 gotea sola = demasiado alto
export const pressure_gauge: H = ({ dur, v = 0 }) => {
  const t = useT(), p = v === 1 ? eio(pr(t, 0.2, 2)) : v === 0 ? Math.min(0.72, eio(pr(t, 0.2, 1.4))) : 0.8 + 0.04 * Math.sin(t * 6), a = lerp(-130, 130, p);
  return (<F dur={dur}><AbsoluteFill style={{ background: v === 1 ? "#3a1410" : "#26303a" }}><Svg>
    <circle cx={760} cy={560} r={300} fill="#f4f1e6" stroke="#888" strokeWidth={22} />
    <path d={`M${760 + Math.cos((60 - 90) * Math.PI / 180) * 250} ${560 + Math.sin((60 - 90) * Math.PI / 180) * 250} A250 250 0 0 1 ${760 + Math.cos((130 - 90) * Math.PI / 180) * 250} ${560 + Math.sin((130 - 90) * Math.PI / 180) * 250}`} fill="none" stroke={K.red} strokeWidth={30} />
    <g transform={`rotate(${a} 760 560)`}><rect x={752} y={330} width={16} height={240} fill={K.ink} /></g><circle cx={760} cy={560} r={26} fill={K.ink} />
    {txt(1420, 420, ["IT OPENS INSTEAD OF BURSTING", "A CAPPED VALVE = A BOMB", "DRIPS ON ITS OWN?"][v], 52, K.cream, 900, SANS)}
    {txt(1420, 520, ["THE SAFETY ON THE TANK", "NEVER CAP THE PIPE END", "PRESSURE OR HEAT TOO HIGH"][v], 42, v === 1 ? K.red : K.copper, 900, SANS)}
  </Svg></AbsoluteFill></F>);
};
// ── HEATER_LINEUP: rueda de reconocimiento de termotanques; uno da un paso adelante
const HL = ["GAS", "ELECTRIC", "SMELLY WATER", "WITH A SOFTENER", "OLD & RUSTY", "TANKLESS"];
export const heater_lineup: H = ({ dur, v = 0 }) => {
  const t = useT(), st = eout(pr(t, 0.3, 0.9)), sel = v === 0 ? -1 : v;
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2a2f36" }}><Svg>
    {Array.from({ length: 8 }, (_, i) => <line key={i} x1={0} y1={260 + i * 90} x2={1920} y2={260 + i * 90} stroke="#555" strokeWidth={3} />)}
    {HL.map((n, i) => { const on = i === sel, x = 260 + i * 280, s = on ? lerp(1, 1.2, st) : 1; return <g key={n} transform={`translate(${x} ${on ? lerp(640, 680, st) : 640}) scale(${s})`} opacity={sel < 0 || on ? 1 : 0.35}>
      {i === 5 ? <rect x={-80} y={-150} width={160} height={220} rx={14} fill="#e9e6df" stroke={K.ink} strokeWidth={5} /> : <rect x={-80} y={-260} width={160} height={420} rx={34} fill={i === 4 ? "#c9a27a" : "#e9e6df"} stroke={K.ink} strokeWidth={5} />}
      {txt(0, 230, n, 30, K.cream, 900, SANS)}</g>; })}
    {txt(960, 140, sel < 0 ? "WHICH ONE IS YOURS?" : `THE ${HL[sel]} HEATER`.replace("THE TANKLESS HEATER", "THE TANKLESS BOX ON THE WALL"), 58, K.cream, 900, SANS)}
  </Svg></AbsoluteFill></F>);
};
// ── QUOTE_STAMP: el presupuesto de $450 con un sello rojo "FAIR: $175 – $250"
export const quote_stamp: H = ({ dur }) => {
  const t = useT(), d = eout(pr(t, 0.1, 0.6));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#d8d0bc" }}><Svg>
    <g transform={`translate(960 ${lerp(1300, 560, d)}) rotate(-2)`}><rect x={-420} y={-400} width={840} height={800} fill="#fff" stroke="#999" strokeWidth={4} />
      {txt(0, -300, "ESTIMATE", 56, K.navy, 900, SANS)}{txt(-360, -160, "Toilet fill valve", 46, K.ink, 700, HAND, "start")}{txt(360, -160, "$450", 60, K.ink, 900, SANS, "end")}
      {[0, 1, 2, 3].map((i) => <line key={i} x1={-360} y1={-60 + i * 70} x2={360} y2={-60 + i * 70} stroke="#ddd" strokeWidth={3} />)}</g>
    <Stamp t={t} at={1.0} x={1100} y={700} text="FAIR: $175–$250" rot={-12} size={70} />
  </Svg></AbsoluteFill></F>);
};
// ── AUTUMN_LEAF: hojas de otoño que caen y cada una trae una parte de la rutina
const AL = ["EVERY FALL: TEST THE RELIEF VALVE", "EVERY 3 YEARS: PULL THE ROD", "", "EVERY FALL: FLUSH AND TEST"];
export const autumn_leaf: H = ({ dur, v = 0 }) => {
  const t = useT(), f = eio(pr(t, 0.1, 1.6));
  return (<F dur={dur}><AbsoluteFill style={{ background: "linear-gradient(#f2d39b, #d9824a)" }}><Svg>
    {Array.from({ length: 14 }, (_, i) => { const x = (i * 157) % 1920 + Math.sin(t * 2 + i) * 40, y = ((t * 120 + i * 90) % 1200) - 100; return <path key={i} d="M0 -30 Q30 -10 0 30 Q-30 -10 0 -30" transform={`translate(${x} ${y}) rotate(${t * 60 + i * 30}) scale(1.6)`} fill={["#b8441a", "#d9822a", "#8a2a10"][i % 3]} opacity={0.7} />; })}
    <g transform={`translate(960 ${lerp(-200, 540, f)}) rotate(${lerp(-30, -4, f)})`}><path d="M0 -260 Q300 -120 0 260 Q-300 -120 0 -260" fill="#c4521e" stroke="#5a1a08" strokeWidth={6} /><line x1={0} y1={-240} x2={0} y2={300} stroke="#5a1a08" strokeWidth={5} /></g>
    <g opacity={cl((t - 1.2) * 2)}><rect x={360} y={900} width={1200} height={100} rx={14} fill="rgba(0,0,0,0.5)" />{txt(960, 968, AL[v] || AL[0], 50, K.cream, 900, SANS)}</g>
  </Svg></AbsoluteFill></F>);
};
// ── TAPE_DATE: un pedazo de cinta de papel con la fecha escrita a mano sobre el tanque
export const tape_date: H = ({ dur }) => {
  const t = useT(), s = eout(pr(t, 0.2, 0.7)), w = cl((t - 0.8) / 1.0);
  return (<F dur={dur}><AbsoluteFill style={{ background: "#e9e6df" }}><Svg>
    <rect x={0} y={0} width={1920} height={1080} fill="#ece9e2" /><line x1={0} y1={0} x2={0} y2={0} />
    <g transform={`translate(960 540) rotate(-4) scale(${lerp(0.3, 1, s)})`}><rect x={-420} y={-90} width={840} height={180} fill="#efe2b0" opacity={0.95} />
      <g clipPath="url(#tdc)"><clipPath id="tdc"><rect x={-400} y={-90} width={800 * w} height={180} /></clipPath>{txt(-380, 30, "ROD + FLUSH · OCT 2026", 64, K.ink, 700, HAND, "start")}</g></g>
    {txt(960, 140, "WRITE THE DATE ON THE TANK", 56, K.navy, 900, SANS)}
  </Svg></AbsoluteFill></F>);
};
// ── TIME_CAPSULE: una caja de lata enterrada que se abre: Toledo 1979 · v3 el tanque siguió hasta 1990
export const time_capsule: H = ({ dur, v = 0 }) => {
  const t = useT(), o = eout(pr(t, 0.3, 1.0));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#4a3826" }}><Svg>
    <rect x={0} y={700} width={1920} height={380} fill="#3a2a1a" />
    <g transform="translate(960 700)"><rect x={-300} y={-200} width={600} height={240} fill="#8a8f96" stroke={K.ink} strokeWidth={6} />
      <g transform={`rotate(${-o * 70} -300 -200)`}><rect x={-310} y={-240} width={620} height={50} fill="#9aa0a8" stroke={K.ink} strokeWidth={6} /></g></g>
    <g opacity={o}>{txt(960, 300, v === 3 ? "STILL RUNNING IN 1990" : "TOLEDO, OHIO · 1979", 76, "#f2d39b", 900, SLAB)}{txt(960, 390, v === 3 ? "WHEN GUS SOLD THE HOUSE" : "NINETEEN, APPRENTICING FOR GUS", 44, K.cream, 800, SANS)}</g>
  </Svg></AbsoluteFill></F>);
};
// ── PIANO_MOVE: un piano a medio levantar se apoya: no estás moviendo un piano, tirones cortos
export const piano_move: H = ({ dur }) => {
  const t = useT(), d = eio(pr(t, 0.2, 1.0));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2b2622" }}><Svg>
    <g transform={`translate(760 ${lerp(560, 640, d)}) rotate(${lerp(-6, 0, d)})`}><rect x={-300} y={-260} width={600} height={420} rx={14} fill="#1a1412" stroke="#6a5a4a" strokeWidth={6} />
      {Array.from({ length: 14 }, (_, i) => <rect key={i} x={-280 + i * 40} y={60} width={36} height={90} fill="#f4f1e6" />)}</g>
    <g opacity={cl((t - 0.9) * 2)}>{txt(1420, 460, "\"SHORT PULLS, LENNY.", 50, K.cream, 700, HAND)}{txt(1420, 540, "YOU'RE NOT MOVING A PIANO.\"", 50, K.cream, 700, HAND)}</g>
  </Svg></AbsoluteFill></F>);
};
// ── KNUCKLE_CRACK: tres tirones cortos (marcas 1-2-3) y "crack" con el sonido de un nudillo
export const knuckle_crack: H = ({ dur }) => {
  const t = useT(), n = Math.min(3, Math.floor(t * 2)), pop = cl((t - 1.6) * 4);
  return (<F dur={dur}><AbsoluteFill style={{ background: "#d9d4c7" }}><Svg>
    <polygon points={Array.from({ length: 6 }, (_, i) => { const a = (i * 60 + 30) * Math.PI / 180; return `${960 + Math.cos(a) * 160},${600 + Math.sin(a) * 160}`; }).join(" ")} fill="#9b9b9b" stroke={K.ink} strokeWidth={8} transform={`rotate(${n * 6 + pop * 20} 960 600)`} />
    {Array.from({ length: n }, (_, i) => txt(560 + i * 400, 240, `PULL ${i + 1}`, 52, K.navy, 900, SANS))}
    <g opacity={pop}>{txt(960, 940, "CRACK.", 120, K.red, 900, SLAB)}</g>
  </Svg></AbsoluteFill></F>);
};
// ── GIFT_TAG: una etiqueta de regalo pegada al tanque con las fechas y el tamaño del tubo
export const gift_tag: H = ({ dur }) => {
  const t = useT(), d = eout(pr(t, 0.1, 0.7));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#3a4048" }}><Svg>
    <rect x={200} y={140} width={420} height={900} rx={40} fill="#e9e6df" stroke={K.ink} strokeWidth={6} />
    <path d={`M620 400 Q760 420 ${lerp(620, 900, d)} 480`} fill="none" stroke="#c4521e" strokeWidth={6} />
    <g transform={`translate(${lerp(700, 1200, d)} 560) rotate(${lerp(-20, 4, d)})`}><path d="M-340 -260 L300 -260 L380 0 L300 260 L-340 260 Z" fill="#f2e6b8" stroke="#6a5a2a" strokeWidth={6} /><circle cx={300} cy={0} r={20} fill="#3a4048" />
      {txt(-300, -150, "ROD: '79, '82, '85", 48, K.ink, 700, HAND, "start")}{txt(-300, -40, "SOCKET: 1-1/16\"", 48, K.ink, 700, HAND, "start")}{txt(-300, 80, "— GUS", 48, K.ink, 700, HAND, "start")}</g>
  </Svg></AbsoluteFill></F>);
};
// ── INBOX_TRAY: bandeja de entrada de oficina: cada carta es un comentario
const IB = ["I READ THE COMMENTS", "", "\"TAPE, THEN PIPE DOPE ON TOP\"", "", "\"OPEN A HOT FAUCET FIRST\"", "", "\"HOW OLD IS MY HEATER?\"", "", "\"FLUSHED IT, NOW THE VALVE LEAKS\""];
export const inbox_tray: H = ({ dur, v = 0 }) => {
  const t = useT(), d = eout(pr(t, 0.1, 0.7));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#5a4a3a" }}><Svg>
    <path d="M300 800 L1620 800 L1560 980 L360 980 Z" fill="#8a6a40" stroke="#2a1a0a" strokeWidth={6} />{txt(960, 930, "IN", 50, "#f2e6c8", 900, SANS)}
    {Array.from({ length: 4 }, (_, i) => <rect key={i} x={420 + i * 6} y={760 - i * 14} width={1080} height={40} fill="#fbf7ea" stroke="#bbb" strokeWidth={2} />)}
    <g transform={`translate(960 ${lerp(760, 420, d)}) rotate(${lerp(4, -2, d)})`}><rect x={-560} y={-200} width={1120} height={400} fill="#fbf7ea" stroke="#b9a" strokeWidth={4} />{txt(0, 20, IB[v] || "", v ? 50 : 64, K.navy, 800, v ? HAND : SANS)}</g>
    {v > 0 && txt(960, 120, "FROM THE COMMENTS", 44, K.cream, 900, SANS)}
  </Svg></AbsoluteFill></F>);
};
// ── BKF_BENCH: el libro aparece sobre el banco de trabajo del sótano
export const bkf_bench: H = ({ dur }) => {
  const t = useT(), b = eout(pr(t, 0.2, 1.0));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#4a4038" }}><Svg>
    <rect x={0} y={760} width={1920} height={80} fill="#a07a48" stroke="#3a2a10" strokeWidth={6} /><rect x={140} y={840} width={60} height={240} fill="#8a6a3a" /><rect x={1720} y={840} width={60} height={240} fill="#8a6a3a" />
    <g transform={`translate(960 ${lerp(-400, 470, b)}) rotate(${lerp(10, -3, b)})`}><Page n="p001" x={0} y={0} h={560} /></g>
    <g opacity={cl((t - 1.2) * 2)}>{txt(1560, 300, "MY BOOK", 60, K.cream, 900, SLAB)}</g>
  </Svg><FromBook x={140} y={60} /></AbsoluteFill></F>);
};
// ── BKF_P348: la página 348 (lavar el sedimento). v0 la página entera · v1 el dibujo de la manguera agrandado
export const bkf_p348: H = ({ dur, v = 0 }) => {
  const t = useT(), p = eout(pr(t, 0.2, 0.9));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#e8e2d2" }}><Svg>
    {v === 0 ? <g transform={`translate(0 ${lerp(300, 0, p)})`}><Page n="p348" x={960} y={560} h={1000} rot={1} />{txt(1560, 300, "PAGE 348", 60, K.navy, 900, SANS)}</g>
      : <><Page n="p348" x={420} y={560} h={900} rot={-3} op={0.8} /><Crop n="p348" fx={0.547} fy={0.045} fw={0.418} fh={0.155} x={820} y={260} w={1020} id="p348d" />
        <g opacity={cl((t - 1) * 2)}>{txt(1330, 820, "FLUSHING THE SEDIMENT, STEP BY STEP", 40, K.navy, 900, SANS)}</g></>}
  </Svg><FromBook x={140} y={60} /></AbsoluteFill></F>);
};
// ── BKF_P349: la página 349 (prueba de la válvula de alivio) con su dibujo
export const bkf_p349: H = ({ dur }) => {
  const t = useT(), p = eout(pr(t, 0.2, 0.9));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#dfe6e2" }}><Svg>
    <Page n="p349" x={440} y={560} h={940} rot={2} />
    <g transform={`translate(${lerp(200, 0, p)} 0)`}><Crop n="p349" fx={0.547} fy={0.05} fw={0.42} fh={0.155} x={860} y={260} w={980} id="p349d" /></g>
    <g opacity={cl((t - 1.1) * 2)}>{txt(1350, 800, "THE RELIEF VALVE TEST · PAGE 349", 40, K.navy, 900, SANS)}</g>
  </Svg><FromBook x={140} y={60} /></AbsoluteFill></F>);
};
// ── BKF_BILL: las dos cuentas de las páginas 348 y 349 lado a lado
export const bkf_bill: H = ({ dur }) => {
  const t = useT(), a = eout(pr(t, 0.2, 0.8)), b = eout(pr(t, 0.7, 1.3));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2c3a33" }}><Svg>
    <g transform={`translate(0 ${lerp(-900, 0, a)}) rotate(-3 620 560)`}><Crop n="p348" fx={0.735} fy={0.627} fw={0.207} fh={0.155} x={300} y={200} w={640} id="bb1" /></g>
    <g transform={`translate(0 ${lerp(-900, 0, b)}) rotate(3 1300 560)`}><Crop n="p349" fx={0.735} fy={0.614} fw={0.207} fh={0.158} x={980} y={200} w={640} id="bb2" /></g>
    <g opacity={cl((t - 1.6) * 2)}>{txt(960, 1000, "WHAT A PLUMBER CHARGES · WHAT YOU PAY", 40, K.cream, 900, SANS)}</g>
  </Svg><FromBook x={140} y={60} /></AbsoluteFill></F>);
};
// ── BKF_QR: el código (≥8 s). v0 la sección "Before You Call a Plumber" · v1 el código para la TV
export const bkf_qr: H = ({ dur, v = 0 }) => {
  const t = useT(), d = eout(pr(t, 0.1, 0.6));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#efe7d4" }}><Svg>
    <Page n="p348" x={460} y={560} h={900} rot={-4} />
    <g transform={`translate(0 ${lerp(-900, 0, d)})`}><QR x={1000} y={140} page="PAGE 348" /></g>
    {v === 0 && <g opacity={cl((t - 0.8) * 2)}>{txt(460, 1060, "BEFORE YOU CALL A PLUMBER", 38, K.navy, 900, SANS)}</g>}
  </Svg><FromBook x={140} y={60} /></AbsoluteFill></F>);
};
// ── BKF_PRICES: la página 363 (lista de precios justos). v0 página · v1 el título · v2 paso 1 · v3 paso 5 · v4 la cuenta
export const bkf_prices: H = ({ dur, v = 0 }) => {
  const t = useT(), p = eout(pr(t, 0.2, 0.9));
  const C: [number, number, number, number, number][] = [[0, 0, 0, 0, 0], [0.06, 0.255, 0.88, 0.1, 1500], [0.3, 0.427, 0.205, 0.185, 760], [0.52, 0.632, 0.205, 0.195, 760], [0.735, 0.636, 0.207, 0.155, 700]];
  const [fx, fy, fw, fh, w] = C[v] || C[0];
  return (<F dur={dur}><AbsoluteFill style={{ background: "#31404a" }}><Svg>
    {v === 0 ? <g transform={`translate(0 ${lerp(300, 0, p)})`}><Page n="p363" x={960} y={560} h={1000} rot={-1} />{txt(1560, 300, "PAGE 363", 60, K.cream, 900, SANS)}</g>
      : <><Page n="p363" x={v === 1 ? 960 : 420} y={v === 1 ? 760 : 560} h={900} rot={-3} op={v === 1 ? 0.35 : 0.8} />
        <g transform={`rotate(${p * 2} 960 540)`}><Crop n="p363" fx={fx} fy={fy} fw={fw} fh={fh} x={v === 1 ? 210 : 1000} y={v === 1 ? 240 : 160} w={w} id={"pr" + v} /></g></>}
  </Svg><FromBook x={140} y={60} /></AbsoluteFill></F>);
};
// ── BKF_QR2: CTA2. v0 la sección con los 40 arreglos · v1 el código
export const bkf_qr2: H = ({ dur, v = 0 }) => {
  const t = useT(), d = eout(pr(t, 0.1, 0.6)), n = Math.min(40, Math.floor(eout(pr(t, 0.2, 2.2)) * 40));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2a3440" }}><Svg>
    {v === 0 ? <><Page n="p363" x={480} y={560} h={900} rot={-3} />{txt(1350, 380, "BEFORE YOU CALL", 64, K.cream, 900, SLAB)}{txt(1350, 460, "A PLUMBER", 64, K.cream, 900, SLAB)}{txt(1350, 600, `${n} FIXES`, 80, K.copper, 900, SANS)}</>
      : <><Page n="p363" x={460} y={560} h={900} rot={-4} /><g transform={`translate(0 ${lerp(-900, 0, d)})`}><QR x={1000} y={140} page="PAGE 363" edge={K.copper} /></g></>}
  </Svg><FromBook x={140} y={60} /></AbsoluteFill></F>);
};
// ── BKF_CLOSE: el libro apoyado contra el termotanque, la bombita del sótano y la pregunta
export const bkf_close: H = ({ dur, v = 0 }) => {
  const t = useT(), b = eout(pr(t, 0.1, 0.8)), q = cl((t - 2.0) * 2);
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2a241e" }}><Svg>
    <line x1={1500} y1={0} x2={1500} y2={160} stroke="#555" strokeWidth={4} /><circle cx={1500} cy={190} r={36} fill="#fff3c8" /><ellipse cx={1500} cy={700} rx={600} ry={300} fill="#fff3c8" opacity={0.1} />
    <rect x={180} y={160} width={420} height={920} rx={40} fill="#e9e6df" stroke={K.ink} strokeWidth={6} />
    <g transform={`translate(860 ${lerp(1000, 640, b)}) rotate(-8)`}><Page n="p001" x={0} y={0} h={600} /></g>
    <g opacity={cl((t - 0.9) * 2)}>{txt(1420, 460, "THE $10 PLUMBER", 56, K.cream, 900, SLAB)}{txt(1420, 540, v === 1 ? "FLUSH · VALVE · FAIR PRICES" : "40 FIXES", 40, K.copper, 900, SANS)}</g>
    {v === 0 && <g opacity={q}>{txt(1420, 760, "how old is your water heater?", 46, K.cream, 700, HAND)}</g>}
  </Svg></AbsoluteFill></F>);
};

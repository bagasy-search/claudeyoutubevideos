// Héroes de len11e, parte 2: tipos de pileta, piso del bajo mesada, errores, rutina, historia de Gus, comentarios y el libro.
import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { K, SLAB, SANS, HAND, cl, lerp, eio, eout, pr, useT, Stamp, FromBook, Svg } from "./kit";
import { H, F, txt, lbl, NAVY, CREAM, eIn } from "./heroes_e";

const PG = (n: string) => staticFile(`len11e/c/${n}.png`);
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

// ── PAINT_CHIPS: tarjeta de muestras de pintura; cada muestra es un tipo de pileta y se destaca la de este momento
const CHIPS = [["KITCHEN", "1-1/2 INCH"], ["BATHROOM", "1-1/4 INCH"], ["DOUBLE SINK", "TWO TAILPIECES"], ["DISPOSAL", "RUBBER GASKET"], ["OLD METAL TRAP", "THIN AS PAPER"], ["TOP LEAK", "AT THE BASKET"]];
export const paint_chips: H = ({ dur, v = 0 }) => {
  const t = useT(), sel = [0, 1, 1, 2, 3, 4, 5][v], fan = eout(pr(t, 0.1, 0.8)), cols = ["#E8C9A0", "#A9C8D8", "#C8D8A9", "#D8A9B8", "#B8B0A0", "#E0D080"];
  return (<F dur={dur}><AbsoluteFill style={{ background: "#efe9dc" }}><Svg>
    {CHIPS.map(([a, b], i) => { const on = i === sel, rot = (i - 2.5) * 9 * fan; return <g key={a} transform={`translate(960 1000) rotate(${rot}) translate(0 ${on ? -80 * fan : 0})`}>
      <rect x={-150} y={-760} width={300} height={700} rx={10} fill="#fff" stroke={on ? K.red : "#999"} strokeWidth={on ? 8 : 3} /><rect x={-130} y={-740} width={260} height={360} fill={cols[i]} />
      {txt(0, -320, a, 30, K.ink, 900, SANS)}{txt(0, -280, b, 26, K.graphite, 700, SANS)}</g>; })}
    {txt(960, 120, v === 2 ? "NOT EVERY SINK IS THE SAME" : CHIPS[sel][0], 64, K.navy, 900, SANS)}
  </Svg></AbsoluteFill></F>);
};
// ── MEMORY_FOAM: el pulgar aprieta y la marca no vuelve: aglomerado que tomó agua
export const memory_foam: H = ({ dur }) => {
  const t = useT(), press = eio(pr(t, 0.4, 1.0)) * (1 - eio(pr(t, 1.4, 1.8))), dent = eio(pr(t, 0.4, 1.0));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2d2a26" }}><Svg>
    <path d={`M200 620 L860 620 Q960 ${620 + dent * 70} 1060 620 L1720 620 L1720 860 L200 860 Z`} fill="#b99a6a" stroke="#1a1208" strokeWidth={6} />
    {Array.from({ length: 50 }, (_, i) => <circle key={i} cx={220 + ((i * 97) % 1480)} cy={660 + ((i * 53) % 180)} r={6} fill="#8a6a40" />)}
    <g transform={`translate(960 ${lerp(300, 560, press)})`}><rect x={-60} y={-260} width={120} height={260} rx={50} fill="#e8b48f" stroke={K.ink} strokeWidth={6} /></g>
    {txt(960, 150, "PARTICLE BOARD DRINKS WATER", 62, K.cream, 900, SANS)}
    <g opacity={cl((t - 1.9) * 2)}>{txt(960, 990, "THE DENT STAYS · IT SWELLS · IT FALLS APART", 44, K.copper, 900, SANS)}</g>
  </Svg></AbsoluteFill></F>);
};
// ── PINWHEEL: con todas las canillas cerradas el molinete igual gira: el agua se va a algún lado
export const pinwheel: H = ({ dur }) => {
  const t = useT(), spin = t * 220;
  return (<F dur={dur}><AbsoluteFill style={{ background: "#dfe8ee" }}><Svg>
    {["KITCHEN", "BATH", "TOILETS", "OUTSIDE"].map((s, i) => <g key={s}>{txt(260, 320 + i * 140, s, 44, K.ink, 800, SANS, "start")}{txt(640, 320 + i * 140, "OFF", 44, K.green, 900, SANS, "start")}</g>)}
    <line x1={1300} y1={560} x2={1300} y2={1000} stroke={K.graphite} strokeWidth={14} />
    <g transform={`rotate(${spin} 1300 560)`}>{[0, 90, 180, 270].map((a, i) => <path key={a} d="M1300 560 L1300 340 Q1420 400 1300 560" fill={[K.red, "#2e7dbf", "#e0b24a", K.green][i]} transform={`rotate(${a} 1300 560)`} />)}</g>
    <circle cx={1300} cy={560} r={20} fill={K.ink} />
    <g opacity={cl((t - 1) * 2)}>{txt(960, 150, "EVERYTHING'S OFF AND IT'S TURNING", 58, K.navy, 900, SANS)}{txt(1300, 1050, "THAT'S A LEAK", 46, K.red, 900, SANS)}</g>
  </Svg></AbsoluteFill></F>);
};
// ── WALL_CALENDAR: hojas de almanaque que se arrancan; cada hoja trae una parte de la rutina
const CAL = [["IN ONE LINE", "DRY · PAPER · FULL SINK · HAND TIGHT"], ["", ""], ["ONCE A MONTH", "A DRY HAND · TEN SECONDS"], ["", ""], ["EVERY MONTH", "A PAPER TOWEL ON THE FLOOR"]];
export const wall_calendar: H = ({ dur, v = 0 }) => {
  const t = useT(), tear = eIn(pr(t, 0.3, 1.0)), [a, b] = CAL[v] || CAL[0];
  return (<F dur={dur}><AbsoluteFill style={CREAM}><Svg>
    <rect x={560} y={160} width={800} height={820} fill="#fff" stroke={K.ink} strokeWidth={6} /><rect x={560} y={160} width={800} height={140} fill={K.red} />{txt(960, 260, "LENNY'S ROUTINE", 60, K.white, 900, SANS)}
    {txt(960, 560, a, 80, K.navy, 900, SANS)}{txt(960, 680, b, 42, K.ink, 800, SANS)}
    <g transform={`translate(${tear * 300} ${tear * 900}) rotate(${tear * 40} 960 600)`} opacity={1 - tear}><rect x={560} y={300} width={800} height={680} fill="#fff" stroke={K.ink} strokeWidth={4} />{txt(960, 700, "31", 260, K.graphite, 900, SANS)}</g>
  </Svg></AbsoluteFill></F>);
};
// ── CRAYON_BOX: caja de crayones = colores de cinta; ninguno va en una tuerca deslizante
export const crayon_box: H = ({ dur, v = 0 }) => {
  const t = useT(), up = eout(pr(t, 0.2, 0.9));
  const cr = [["WHITE", "#f4f4f0", "WATER THREADS"], ["PINK", "#f2a3b8", "THICKER, WATER"], ["YELLOW", "#f2d03a", "GAS LINES"]];
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2c3e50" }}><Svg>
    {cr.map(([n, c, u], i) => { const hi = v === 4 ? i === 1 : v === 5 ? i === 0 : true; return <g key={n} transform={`translate(${620 + i * 340} ${lerp(820, 520, up)})`} opacity={hi ? 1 : 0.4}>
      <rect x={-60} y={-300} width={120} height={500} fill={c} stroke={K.ink} strokeWidth={6} /><path d="M-60 -300 L0 -400 L60 -300 Z" fill={c} stroke={K.ink} strokeWidth={6} />
      {txt(0, 260, n, 40, K.cream, 900, SANS)}{txt(0, 310, u, 28, K.cream, 700, SANS)}</g>; })}
    <rect x={440} y={700} width={1040} height={340} fill={K.copper} stroke={K.ink} strokeWidth={6} />{txt(960, 900, "THREAD TAPE", 70, K.white, 900, SANS)}
    <g opacity={cl((t - 1.4) * 2)}>{txt(960, 140, v === 1 ? "MISTAKE TWO: TAPE" : "NONE OF THEM ON A SLIP NUT", 62, K.cream, 900, SANS)}</g>
  </Svg></AbsoluteFill></F>);
};
// ── CHEWING_GUM: un chicle estirado entre dos dedos: se pega, se despega, se rompe
export const chewing_gum: H = ({ dur, v = 0 }) => {
  const t = useT(), st = eio(pr(t, 0.3, 1.8)), gap = lerp(40, 520, st), snap = st > 0.95;
  return (<F dur={dur}><AbsoluteFill style={{ background: "#f2c6d0" }}><Svg>
    <rect x={960 - gap / 2 - 200} y={480} width={200} height={110} rx={50} fill="#e8b48f" stroke={K.ink} strokeWidth={6} />
    <rect x={960 + gap / 2} y={480} width={200} height={110} rx={50} fill="#e8b48f" stroke={K.ink} strokeWidth={6} />
    {!snap && <path d={`M${960 - gap / 2} 520 Q960 ${535 + st * 60} ${960 + gap / 2} 520 L${960 + gap / 2} 550 Q960 ${560 + st * 70} ${960 - gap / 2} 550 Z`} fill="#ff7aa8" />}
    {txt(960, 180, ["MISTAKE THREE: SILICONE", "A JOINT FULL OF DRIED RUBBER", "PICK THE SILICONE OFF FIRST"][v], 64, K.navy, 900, SANS)}
    <g opacity={cl((t - 1.6) * 2)}>{txt(960, 900, "IT PEELS · THEN THE TRAP WON'T COME APART", 44, K.red, 900, SANS)}</g>
  </Svg></AbsoluteFill></F>);
};
// ── CHOC_SOFTEN: barra de chocolate al calor se ablanda y pierde la forma. v0 hot water shows a weak seal · v1 boiling water flattens washers
export const choc_soften: H = ({ dur, v = 0 }) => {
  const t = useT(), m = eio(pr(t, 0.3, 2.0)) * (v === 0 ? 0.35 : 1);
  return (<F dur={dur}><AbsoluteFill style={{ background: "#fbe3c4" }}><Svg>
    <circle cx={1600} cy={200} r={110} fill="#f7b733" opacity={0.9} />
    <g transform={`translate(960 600)`}><path d={`M-300 ${-140 + m * 120} L300 ${-140 + m * 140} Q${340 + m * 80} ${100} 300 140 L-300 140 Q${-340 - m * 80} 100 -300 ${-140 + m * 120} Z`} fill="#6b3b1f" stroke="#2a1408" strokeWidth={6} />
      {Array.from({ length: 6 }, (_, i) => <rect key={i} x={-280 + (i % 3) * 190} y={-120 + m * 120 + Math.floor(i / 3) * 120} width={170} height={100 - m * 40} rx={8} fill="#7d4826" opacity={1 - m * 0.7} />)}</g>
    {txt(960, 160, v === 0 ? "HOT WATER SHOWS A WEAK SEAL" : "MISTAKE FOUR: BOILING WATER", 62, K.navy, 900, SANS)}
    <g opacity={cl((t - 1.4) * 2)}>{txt(960, 960, v === 0 ? "THE PLASTIC EXPANDS A LITTLE" : "IT SOFTENS, FLATTENS AND WARPS THE WASHER", 44, K.red, 900, SANS)}</g>
  </Svg></AbsoluteFill></F>);
};
// ── CEREAL_SOGGY: el tazón de cereal día tras día se ablanda: el bol de abajo de la pileta, por meses
export const cereal_soggy: H = ({ dur }) => {
  const t = useT(), d = Math.floor(pr(t, 0.2, 2.4) * 60), s = d / 60;
  return (<F dur={dur}><AbsoluteFill style={{ background: "#e6eef2" }}><Svg>
    <path d="M600 560 Q960 900 1320 560 Z" fill="#fff" stroke={K.ink} strokeWidth={6} /><ellipse cx={960} cy={560} rx={360} ry={50} fill={`rgb(${lerp(240, 200, s)},${lerp(230, 200, s)},${lerp(210, 190, s)})`} />
    {Array.from({ length: 18 }, (_, i) => <ellipse key={i} cx={680 + (i * 37) % 560} cy={550 + (i % 3) * 8 + s * 30} rx={lerp(28, 36, s)} ry={lerp(14, 6, s)} fill={`rgb(${lerp(220, 170, s)},${lerp(160, 140, s)},${lerp(60, 110, s)})`} />)}
    {txt(960, 180, "MISTAKE FIVE: LIVING WITH THE BOWL", 62, K.navy, 900, SANS)}{txt(960, 960, `DAY ${d}`, 60, K.red, 900, SANS)}
  </Svg></AbsoluteFill></F>);
};
// ── LEGO_VS_GLUE: dos ladrillos encastrados se separan; dos pegados no
export const lego_vs_glue: H = ({ dur, v = 0 }) => {
  const t = useT(), pull = eio(pr(t, 0.6, 1.4));
  const Brick = ({ x, y, c }: { x: number; y: number; c: string }) => <g transform={`translate(${x} ${y})`}><rect x={-160} y={-60} width={320} height={120} rx={8} fill={c} stroke={K.ink} strokeWidth={6} />{[-90, 0, 90].map((k) => <rect key={k} x={k - 30} y={-90} width={60} height={30} rx={6} fill={c} stroke={K.ink} strokeWidth={5} />)}</g>;
  return (<F dur={dur}><AbsoluteFill style={CREAM}><Svg>
    <Brick x={560} y={640} c={K.red} /><Brick x={560} y={640 - 150 - pull * 160} c="#2e7dbf" />{txt(560, 900, "NUTS: COME APART", 44, K.green, 900, SANS)}
    <Brick x={1360} y={640} c={K.red} /><Brick x={1360} y={490 - pull * 6} c="#2e7dbf" /><rect x={1200} y={540} width={320} height={22} fill="#f2f2c0" opacity={0.9} />{txt(1360, 900, "GLUED: CUT IT OUT", 44, K.red, 900, SANS)}
    {txt(960, 160, v === 0 ? "NEXT CLOG: THE TRAP WON'T COME APART" : "MY TRAP IS GLUED, NOT WITH NUTS", 58, K.navy, 900, SANS)}
  </Svg></AbsoluteFill></F>);
};
// ── SCISSORS_ROCK: piedra-papel-tijera: el bronce (piedra) gana al plástico y le come la rosca
export const scissors_rock: H = ({ dur }) => {
  const t = useT(), hit = eIn(pr(t, 0.6, 1.1)), sh = hit >= 1 ? Math.sin(t * 40) * 6 * Math.exp(-(t - 1.1) * 4) : 0;
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2b3036" }}><Svg>
    <g transform={`translate(${lerp(300, 820, hit)} 520)`}><circle r={150} fill="#c8a24a" stroke="#5a4510" strokeWidth={8} />{txt(0, 16, "BRASS", 48, "#3a2a08", 900, SANS)}</g>
    <g transform={`translate(${1240 + sh} 520)`}><rect x={-150} y={-150} width={300} height={300} rx={20} fill="#f4f1e6" stroke={K.ink} strokeWidth={8} />
      {Array.from({ length: 8 }, (_, i) => <line key={i} x1={-140} y1={-120 + i * 34} x2={140} y2={-110 + i * 34} stroke={K.ink} strokeWidth={4} opacity={hit >= 1 ? 0.15 : 0.6} />)}{txt(0, 16, "PLASTIC", 44, K.ink, 900, SANS)}</g>
    <g opacity={cl((t - 1.3) * 2)}>{txt(960, 170, "BRASS ON PLASTIC STRIPS THE THREADS", 58, K.cream, 900, SANS)}{txt(960, 950, "PLASTIC ON PLASTIC · METAL ON METAL", 48, K.copper, 900, SANS)}</g>
  </Svg></AbsoluteFill></F>);
};
// ── ICE_CRACK: la pantalla es una capa de hielo que se raja de golpe
export const ice_crack: H = ({ dur }) => {
  const t = useT(), c = eout(pr(t, 0.05, 0.35));
  const lines = ["M960 540 L700 200 L560 80", "M960 540 L1300 260 L1500 120", "M960 540 L1500 700 L1880 760", "M960 540 L620 820 L420 1060", "M960 540 L1040 1060", "M960 540 L240 520"];
  return (<F dur={dur}><AbsoluteFill style={{ background: "linear-gradient(#b9dbe8, #e8f6fa)" }}><Svg>
    {lines.map((d, i) => <path key={i} d={d} fill="none" stroke="#fff" strokeWidth={8} strokeDasharray="1400" strokeDashoffset={1400 - c * 1400} />)}
    {lines.map((d, i) => <path key={"s" + i} d={d} fill="none" stroke="#6a9ab0" strokeWidth={3} strokeDasharray="1400" strokeDashoffset={1400 - c * 1400} transform="translate(4 4)" />)}
    <g opacity={c}>{txt(960, 560, "CRACK.", 180, K.navy, 900, SLAB)}</g>
  </Svg></AbsoluteFill></F>);
};
// ── POLAROID_STACK: polaroids de 1979 que caen una sobre otra con su leyenda escrita a mano
const POL = [["TOLEDO, OHIO · 1979", "#c9a77a"], ["MY BRAND NEW 18-INCH WRENCH", "#9a6a4a"], ["ONE MONTH, BARE HANDS", "#b08a5a"], ["NEVER ON A SLIP NUT SINCE", "#8a7a5a"]];
export const polaroid_stack: H = ({ dur, v = 0 }) => {
  const t = useT();
  return (<F dur={dur}><AbsoluteFill style={{ background: "#3a2c20" }}><Svg>
    {POL.slice(0, v + 1).map(([s, c], i) => { const last = i === v, p = last ? eout(pr(t, 0.1, 0.7)) : 1, rot = [-8, 6, -3, 9][i];
      return <g key={i} transform={`translate(${780 + i * 90} ${lerp(-300, 520 + i * 10, p)}) rotate(${rot})`}><rect x={-300} y={-330} width={600} height={680} fill="#f7f3ea" /><rect x={-260} y={-290} width={520} height={480} fill={c} opacity={0.85} />
        {txt(0, 280, s, 36, K.ink, 700, HAND)}</g>; })}
  </Svg></AbsoluteFill></F>);
};
// ── PAWN_TICKET: boleta de empeño de la llave de Gus: se retiene y, al mes, se sella devuelta
export const pawn_ticket: H = ({ dur, v = 1 }) => {
  const t = useT(), d = eout(pr(t, 0.1, 0.6));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2a3a2a" }}><Svg>
    <g transform={`translate(960 ${lerp(1300, 560, d)}) rotate(-4)`}><rect x={-420} y={-300} width={840} height={600} fill="#f2e6b8" stroke="#6a5a2a" strokeWidth={6} />
      {txt(0, -200, "GUS PLUMBING · TOLEDO", 44, K.ink, 900, SANS)}{txt(-360, -80, "ITEM: 1 PIPE WRENCH, 18 IN.", 40, K.ink, 700, HAND, "start")}
      {txt(-360, 10, "HELD FROM: LENNY, AGE 19", 40, K.ink, 700, HAND, "start")}{txt(-360, 100, "RETURN IN: ONE MONTH", 40, K.ink, 700, HAND, "start")}
      {Array.from({ length: 16 }, (_, i) => <circle key={i} cx={-400 + i * 54} cy={300} r={10} fill="#2a3a2a" />)}</g>
    {v === 2 && <Stamp t={t} at={0.9} x={1180} y={460} text="RETURNED" rot={-14} />}
    {v === 1 && <g opacity={cl((t - 1) * 2)}>{txt(960, 1000, "EVERY SINK, YOU USE YOUR HANDS", 46, K.cream, 900, SANS)}</g>}
  </Svg></AbsoluteFill></F>);
};
// ── MAILBAG: de una bolsa de correo salen cartas; cada una es un comentario resumido
const MAIL = ["PEOPLE ASK ME", "\"JUST REPLACE THE WASHER\"", "\"CAN'T MAKE IT TO THE STORE\"", "\"USE A BRASS NUT\"", "\"DRAINS WON'T COME APART\"", "\"PUTTY ON THE SLIP NUT?\"", "\"PLUMBER'S MATE\" (ENGLAND)", "\"STILL LEAKING, SO I SILICONED IT\""];
export const mailbag: H = ({ dur, v = 0 }) => {
  const t = useT(), p = eout(pr(t, 0.2, 0.9));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#4a3a2a" }}><Svg>
    <path d="M200 1080 L260 640 Q420 560 580 640 L640 1080 Z" fill="#8a7050" stroke="#2a1a0a" strokeWidth={8} />{txt(420, 900, "U.S. MAIL", 40, "#2a1a0a", 900, SANS)}
    <g transform={`translate(${lerp(420, 1150, p)} ${lerp(700, 520, p)}) rotate(${lerp(-30, -3, p)})`}><rect x={-560} y={-220} width={1120} height={440} fill="#fbf7ea" stroke="#b9a" strokeWidth={4} />
      <path d="M-560 -220 L0 40 L560 -220" fill="none" stroke="#c9b9a0" strokeWidth={4} />{txt(0, 120, MAIL[v] || "", v ? 50 : 64, K.navy, 800, v ? HAND : SANS)}</g>
    {v > 0 && txt(1150, 120, "FROM THE COMMENTS", 44, K.cream, 900, SANS)}
  </Svg></AbsoluteFill></F>);
};
// ── BKE_DRAWER: el libro sale de un cajón de cocina y se apoya en el piso del bajo mesada
export const bke_drawer: H = ({ dur }) => {
  const t = useT(), o = eout(pr(t, 0.1, 0.8)), b = eout(pr(t, 0.7, 1.4));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#5a3a22" }}><Svg>
    <rect x={460} y={200} width={1000} height={260} fill="#7a4e2c" stroke="#2a160a" strokeWidth={8} />
    <g transform={`translate(0 ${o * 120})`}><rect x={500} y={240} width={920} height={200} fill="#8f5e36" stroke="#2a160a" strokeWidth={6} /><rect x={900} y={320} width={120} height={30} rx={14} fill="#c8a24a" /></g>
    <g transform={`translate(960 ${lerp(380, 720, b)}) rotate(${lerp(0, -4, b)})`}><Page n="p001" x={0} y={0} h={560} /></g>
  </Svg><FromBook x={1500} y={1000} /></AbsoluteFill></F>);
};
// ── BKE_MAGNIFY: lupa sobre la página 292 que agranda el dibujo de la arandela. v0 just the drawing · v1 the page then the drawing
export const bke_magnify: H = ({ dur, v = 0 }) => {
  const t = useT(), m = eout(pr(t, v ? 1.0 : 0.2, v ? 1.8 : 0.9));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#e8e2d2" }}><Svg>
    <Page n="p292" x={520} y={540} h={980} rot={-2} />
    <g opacity={m}><circle cx={1360} cy={520} r={400} fill="#fff" stroke="#3a2a10" strokeWidth={22} /><clipPath id={"mg" + v}><circle cx={1360} cy={520} r={390} /></clipPath>
      <g clipPath={`url(#mg${v})`}><Crop n="p292" fx={0.6} fy={0.055} fw={0.2} fh={0.17} x={1000} y={170} w={720} id={"mgc" + v} /></g>
      <rect x={1600} y={860} width={70} height={260} rx={20} fill="#3a2a10" transform="rotate(-40 1600 860)" /></g>
    {v === 1 && <g opacity={cl((t - 0.2) * 3) * (1 - m)}>{txt(1300, 520, "PAGE 292", 90, K.navy, 900, SANS)}</g>}
  </Svg><FromBook x={140} y={60} /></AbsoluteFill></F>);
};
// ── BKE_SIZES: la cajita de medidas de la página se despega y queda como etiqueta de ferretería
export const bke_sizes: H = ({ dur }) => {
  const t = useT(), p = eout(pr(t, 0.3, 1.0));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#d8d0bc" }}><Svg>
    <Page n="p292" x={480} y={540} h={980} rot={2} op={0.85} />
    <g transform={`translate(${lerp(-200, 0, p)} 0)`}><Crop n="p292" fx={0.795} fy={0.14} fw={0.175} fh={0.055} x={960} y={330} w={860} id="bks" /></g>
    <g opacity={cl((t - 1.2) * 2)}>{txt(1390, 760, "KITCHEN 1-1/2 · BATHROOM 1-1/4", 44, K.navy, 900, SANS)}{txt(1390, 830, "BRING THE OLD WASHER", 40, K.red, 900, SANS)}</g>
  </Svg><FromBook x={140} y={60} /></AbsoluteFill></F>);
};
// ── BKE_BILL: la cuenta de la página 292 se arranca: plumber $150 / you $2 / you keep $148
export const bke_bill: H = ({ dur }) => {
  const t = useT(), p = eout(pr(t, 0.2, 0.9));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2c3a33" }}><Svg>
    <Page n="p292" x={500} y={560} h={940} rot={-3} op={0.9} />
    <g transform={`translate(${lerp(0, 120, p)} ${lerp(0, -40, p)}) rotate(${lerp(0, 4, p)} 1350 560)`}><Crop n="p292" fx={0.735} fy={0.605} fw={0.205} fh={0.16} x={1000} y={200} w={700} id="bkb" /></g>
    <g opacity={cl((t - 1.2) * 2)}>{txt(1400, 1000, "WHAT THE PLUMBER CHARGES · WHAT YOU PAY", 38, K.cream, 900, SANS)}</g>
  </Svg><FromBook x={140} y={60} /></AbsoluteFill></F>);
};
// ── BKE_QR: cartel de ferretería con la página y el código (≥8 s en pantalla)
export const bke_qr: H = ({ dur }) => {
  const t = useT(), d = eout(pr(t, 0.1, 0.6));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#efe7d4" }}><Svg>
    <Page n="p292" x={460} y={560} h={900} rot={-4} />
    <g transform={`translate(0 ${lerp(-500, 0, d)})`}><line x1={1100} y1={0} x2={1100} y2={160} stroke="#888" strokeWidth={6} /><line x1={1640} y1={0} x2={1640} y2={160} stroke="#888" strokeWidth={6} />
      <rect x={1000} y={160} width={740} height={820} rx={20} fill="#fff" stroke={K.navy} strokeWidth={10} /><image href={PG("qr_leak")} x={1120} y={220} width={500} height={500} />
      {txt(1370, 800, "FIRST LINE OF", 46, K.navy, 900, SANS)}{txt(1370, 860, "THE DESCRIPTION", 46, K.navy, 900, SANS)}{txt(1370, 930, "PAGE 292", 40, K.red, 900, SANS)}</g>
  </Svg><FromBook x={140} y={60} /></AbsoluteFill></F>);
};
// ── BKE_QR2: la página 294 (cinta: sí / no) y su cuenta; termina en el código. v0 page · v1 yes/no · v2 three wraps · v3 bill · v4 qr
export const bke_qr2: H = ({ dur, v = 0 }) => {
  const t = useT(), p = eout(pr(t, 0.2, 0.9));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#31404a" }}><Svg>
    {v === 0 && <g transform={`translate(0 ${lerp(300, 0, p)})`}><Page n="p294" x={960} y={560} h={1000} rot={1} /></g>}
    {(v === 1 || v === 2) && <><Page n="p294" x={420} y={560} h={900} rot={-3} op={0.8} /><Crop n="p294" fx={0.55} fy={0.045} fw={0.42} fh={0.16} x={860} y={300} w={980} id={"q2" + v} />
      <g opacity={cl((t - 1) * 2)}>{txt(1350, 850, v === 1 ? "WHICH JOINTS TAKE TAPE · WHICH NEVER DO" : "THREE WRAPS · TO THE RIGHT", 42, K.cream, 900, SANS)}</g></>}
    {v === 3 && <><Page n="p294" x={480} y={560} h={900} rot={-3} op={0.85} /><g transform={`rotate(${p * 3} 1350 560)`}><Crop n="p294" fx={0.735} fy={0.635} fw={0.205} fh={0.16} x={1000} y={200} w={700} id="q2b" /></g>
      <g opacity={cl((t - 1.2) * 2)}>{txt(1350, 1000, "THE HONEST BILL", 48, K.copper, 900, SANS)}</g></>}
    {v === 4 && <><Page n="p294" x={460} y={560} h={900} rot={-4} /><rect x={1000} y={140} width={740} height={820} rx={20} fill="#fff" stroke={K.copper} strokeWidth={10} />
      <image href={PG("qr_leak")} x={1120} y={200} width={500} height={500} />{txt(1370, 790, "FIRST LINE OF", 46, K.navy, 900, SANS)}{txt(1370, 850, "THE DESCRIPTION", 46, K.navy, 900, SANS)}{txt(1370, 920, "PAGE 294", 40, K.red, 900, SANS)}</>}
  </Svg><FromBook x={140} y={60} /></AbsoluteFill></F>);
};
// ── BKE_JUKEBOX: una rockola: el título de la sección gira en la ventanita entre los 40 arreglos
export const bke_jukebox: H = ({ dur }) => {
  const t = useT(), roll = Math.min(39, Math.floor(eout(pr(t, 0.2, 2.2)) * 40));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#1c1424" }}><Svg>
    <path d="M560 1000 L560 420 Q960 60 1360 420 L1360 1000 Z" fill="#7a2a3a" stroke="#e0b24a" strokeWidth={12} />
    <rect x={640} y={430} width={640} height={300} rx={20} fill="#fff6e0" />{txt(960, 520, "FIND THE LEAK,", 50, K.navy, 900, SLAB)}{txt(960, 590, "KILL THE SMELL", 50, K.navy, 900, SLAB)}
    {txt(960, 690, `FIX ${roll + 1} OF 40`, 46, K.red, 900, SANS)}
    {Array.from({ length: 8 }, (_, i) => <rect key={i} x={640 + i * 82} y={790} width={60} height={160} rx={10} fill={i === roll % 8 ? "#e0b24a" : "#4a1a2a"} />)}
  </Svg><FromBook x={140} y={60} /></AbsoluteFill></F>);
};
// ── BKE_CLOSE: el libro cerrado sobre el piso del bajo mesada, la luz de la linterna y la pregunta
export const bke_close: H = ({ dur }) => {
  const t = useT(), b = eout(pr(t, 0.1, 0.8)), q = cl((t - 2.2) * 2);
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2a1c10" }}><Svg>
    <ellipse cx={960} cy={720} rx={700 * b} ry={260 * b} fill="#fff3c8" opacity={0.18} />
    <g transform={`translate(760 ${lerp(900, 560, b)}) rotate(-6)`}><Page n="p001" x={0} y={0} h={620} /></g>
    <g opacity={cl((t - 1) * 2)}>{txt(1420, 480, "THE $10 PLUMBER", 56, K.cream, 900, SLAB)}{txt(1420, 560, "40 LEAK FIXES", 44, K.copper, 900, SANS)}</g>
    <g opacity={q}>{txt(1420, 760, "upside down, dirty, or cracked?", 44, K.cream, 700, HAND)}</g>
  </Svg></AbsoluteFill></F>);
};

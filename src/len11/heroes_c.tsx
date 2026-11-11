// Héroes de len11c (the weak flush), parte 1. Cada uno: {dur (frames), src?, v?}. Mecanismos registrados en D:/rtmp/len11_COMPONENTES.md.
import React from "react";
import { AbsoluteFill } from "remotion";
import { K, SLAB, SANS, HAND, cl, lerp, eio, eout, pr, spr, useT, useFade, Pad, Blueprint, Under, Pencil, Stamp, Svg, Dial } from "./kit";

export type H = React.FC<{ dur: number; src?: string; v?: number }>;
export const F: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => { const o = useFade(dur); return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>; };
export const X: React.FC<{ x: number; y: number; s?: number; p: number }> = ({ x, y, s = 60, p }) => (
  <g transform={`translate(${x} ${y})`} opacity={p > 0 ? 1 : 0}>
    <line x1={-s} y1={-s} x2={-s + 2 * s * cl(p * 2)} y2={-s + 2 * s * cl(p * 2)} stroke={K.red} strokeWidth={14} strokeLinecap="round" />
    <line x1={s} y1={-s} x2={s - 2 * s * cl(p * 2 - 1)} y2={-s + 2 * s * cl(p * 2 - 1)} stroke={K.red} strokeWidth={14} strokeLinecap="round" />
  </g>
);
export const Check: React.FC<{ x: number; y: number; p: number; s?: number; col?: string }> = ({ x, y, p, s = 1, col = K.green }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M-30 0 L-8 24 L36 -30" fill="none" stroke={col} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
);
export const txt = (x: number, y: number, s: string, size = 44, col: string = K.ink, w = 700, font = SLAB, anchor: any = "middle", op = 1) => (
  <text x={x} y={y} fontFamily={font} fontWeight={w} fontSize={size} fill={col} textAnchor={anchor} opacity={op}>{s}</text>
);
/** inodoro de perfil simple (ícono): tanque + taza; origen = base */
export const Loo: React.FC<{ x: number; y: number; s?: number; col?: string; fill?: string }> = ({ x, y, s = 1, col = K.ink, fill = K.porcelain }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-20} y={-250} width={110} height={130} rx={10} fill={fill} stroke={col} strokeWidth={6} />
    <path d="M-80 -120 L120 -120 Q120 -40 40 -20 L50 0 L-20 0 L-10 -30 Q-80 -50 -80 -120 Z" fill={fill} stroke={col} strokeWidth={6} />
  </g>
);
const lbl = (t: number, s: string, at = 0.3, y = 150, col: string = K.cream) => <g opacity={cl((t - at) * 3)}>{txt(960, y, s, 54, col, 700, SANS)}</g>;

// ── RIM_VEIN (hilo conductor): angiografía del inodoro. El canal escondido del borde se ve como una vena en rayos X.
const XRAY = "#9FE6FF";
const ToiletX: React.FC<{ fill: number; holes?: number; dye?: string; plaque?: number; t: number; tube?: number }> = ({ fill, holes = 1, dye = "#E9FF7A", plaque = 0, t, tube = 0 }) => (
  <g>
    {/* tanque con tubo de rebalse */}
    <rect x={1080} y={250} width={300} height={330} rx={16} fill="none" stroke={XRAY} strokeWidth={4} opacity={0.75} />
    <rect x={1200} y={300} width={26} height={250} fill="none" stroke={XRAY} strokeWidth={4} opacity={0.9} />
    {tube > 0 && <rect x={1203} y={lerp(548, 302, tube)} width={20} height={lerp(0, 246, tube)} fill={dye} opacity={0.9} />}
    <path d="M1213 550 L1213 600 Q1213 640 1150 640 L840 640" fill="none" stroke={XRAY} strokeWidth={3} opacity={0.6} />
    {/* taza */}
    <path d="M520 640 Q520 900 760 930 L780 1010 L880 1010 L900 930 Q1100 900 1100 640" fill="none" stroke={XRAY} strokeWidth={4} opacity={0.7} />
    {/* la vena: el canal del borde */}
    <path d="M1100 640 L520 640" stroke={XRAY} strokeWidth={30} opacity={0.18} strokeLinecap="round" />
    <path d="M1100 640 L520 640" stroke={dye} strokeWidth={22} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - fill} style={{ filter: `drop-shadow(0 0 14px ${dye})` }} />
    {Array.from({ length: 9 }, (_, i) => { const x = 560 + i * 62; const blocked = plaque > 0 && i % 3 !== 1; return (<g key={i}>
      <circle cx={x} cy={662} r={9} fill={blocked ? "#F4F1E6" : "#0B1620"} stroke={XRAY} strokeWidth={3} />
      {blocked && <circle cx={x} cy={662} r={9 * plaque} fill="#F4F1E6" />}
      {holes > 0 && !blocked && <path d={`M${x} 672 q ${4 * Math.sin(t * 9 + i)} ${60 * holes} 0 ${120 * holes}`} stroke={K.water} strokeWidth={6} fill="none" opacity={0.8} />}
    </g>); })}
  </g>
);
export const rim_vein: H = ({ dur, v = 0 }) => {
  const t = useT(), D = dur / 30;
  const bg = { background: "radial-gradient(ellipse at 50% 50%, #102331, #04080C)" };
  const scan = (t * 220) % 1400;
  const frame = (k: React.ReactNode) => (<F dur={dur}><AbsoluteFill style={bg}><Svg>
    <rect x={0} y={scan - 60} width={1920} height={60} fill="url(#scanG)" opacity={0.25} />
    <defs><linearGradient id="scanG" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={XRAY} stopOpacity="0" /><stop offset="1" stopColor={XRAY} stopOpacity="0.6" /></linearGradient></defs>
    {k}
    {txt(140, 1010, "RIM CHANNEL · SIDE VIEW", 26, XRAY, 700, SANS, "start", 0.7)}
  </Svg></AbsoluteFill></F>);
  if (v === 0) { const f = eio(pr(t, 0.4, D - 0.8)); return frame(<><ToiletX fill={f} holes={0} t={t} tube={1} />{lbl(t, "A HIDDEN CHANNEL INSIDE THE RIM", 0.2, 150, XRAY)}<Pencil t={t} at={1.2} x={300} y={520} text="vinegar fills it" col={"#E9FF7A"} to={[600, 630]} /></>); }
  if (v === 1) { const h = eout(pr(t, 0.6, 2)); return frame(<><ToiletX fill={1} holes={h} dye={K.water} t={t} />{lbl(t, "FLUSH WATER RUNS THE RIM, OUT THE HOLES", 0.2, 150, XRAY)}</>); }
  if (v === 2) { const p = eout(pr(t, 0.2, 1.6)); return frame(<><ToiletX fill={1} holes={1 - p * 0.7} dye={K.water} plaque={p} t={t} />{lbl(t, "ROCK IN ITS VEINS", 0.3, 150, "#F4F1E6")}</>); }
  // v3: el vinagre baja por el tubo de rebalse, pasa el flapper y llena el canal; la cinta tapa los agujeros
  const tb = eio(pr(t, 0.3, 2.0)), f = eio(pr(t, 1.6, D - 0.6));
  return frame(<><ToiletX fill={f} holes={0} t={t} tube={1 - tb * 0.4} />
    {Array.from({ length: 9 }, (_, i) => <rect key={i} x={548 + i * 62} y={650} width={26} height={24} fill="#B9B9B2" opacity={cl((t - 1.0 - i * 0.08) * 4)} />)}
    {lbl(t, "DOWN THE OVERFLOW TUBE · INTO THE RIM", 0.2, 150, XRAY)}<Pencil t={t} at={0.8} x={1420} y={330} text="the tube" col={"#E9FF7A"} to={[1230, 330]} /></>);
};

// diario: aviso de inodoros nuevos con precios que se rodean en rojo
export const flyer_ad: H = ({ dur }) => {
  const t = useT();
  const P = ["$400", "$500", "$800"];
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2a2622" }}><Svg>
    <g transform={`rotate(-2 960 540)`}>
      <rect x={300} y={90} width={1320} height={900} fill="#EDE6D3" />
      {txt(960, 190, "SPRING BATH SALE", 82, K.ink, 900, SLAB)}<line x1={340} x2={1580} y1={220} y2={220} stroke={K.ink} strokeWidth={4} />
      {P.map((p, i) => { const x = 520 + i * 440, k = pr(t, 0.8 + i * 0.9, 1.4 + i * 0.9); return (<g key={p}>
        <Loo x={x} y={640} s={1.15} col="#333" fill="#F7F3E8" />
        {txt(x, 760, "NEW TOILET", 34, "#333", 700, SANS)}{txt(x, 850, p, 86, K.ink, 900, SLAB)}
        <ellipse cx={x} cy={822} rx={130} ry={66} fill="none" stroke={K.red} strokeWidth={9} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} transform={`rotate(-6 ${x} 822)`} />
      </g>); })}
      {Array.from({ length: 6 }, (_, i) => <rect key={i} x={360} y={900 + i * 12} width={1200 - (i % 3) * 140} height={5} fill="#9C968A" />)}
    </g>
  </Svg></AbsoluteFill></F>);
};

// diez fichas de dominó-inodoro: se empuja la fila y sólo una cae
export const ten_domino: H = ({ dur }) => {
  const t = useT(), D = dur / 30;
  return (<F dur={dur}><Pad no="0601"><Svg>
    {Array.from({ length: 10 }, (_, i) => { const x = 330 + i * 140, fall = i === 9 ? eout(pr(t, 1.1, 1.7)) : 0, wob = i < 9 ? 4 * Math.sin(Math.max(0, t - 0.8 - i * 0.03) * 14) * Math.exp(-Math.max(0, t - 0.8) * 2) * (t > 0.8 ? 1 : 0) : 0;
      return (<g key={i} transform={`translate(${x} 720) rotate(${wob + fall * 82})`}>
        <rect x={-40} y={-260} width={80} height={260} rx={10} fill={i === 9 ? "#E8D7C7" : K.white} stroke={K.ink} strokeWidth={5} />
        <g transform="translate(0 -60) scale(0.38)"><Loo x={-20} y={0} /></g>
        <circle cx={0} cy={-200} r={9} fill={K.ink} />
      </g>); })}
    <path d={`M${190 + 40 * eout(pr(t, 0.4, 0.8))} 600 l 60 0`} stroke={K.red} strokeWidth={14} strokeLinecap="round" />
    <g opacity={cl((t - 1.9) * 3)}>{txt(960, 880, "9 OUT OF 10", 90, K.ink, 900, SLAB)}{txt(960, 950, "never needed replacing", 50, K.graphite, 700, HAND)}</g>
    <Stamp t={t} at={Math.min(2.6, D - 1)} x={1580} y={330} text="KEEP" size={70} col={K.green} />
  </Svg></Pad></F>);
};

// expendedor de números de la fiambrería: "NOW SERVING" pasa al 1
export const now_serving: H = ({ dur }) => {
  const t = useT(), pull = eout(pr(t, 0.3, 0.9)), n = t > 1.4 ? "01" : "00";
  return (<F dur={dur}><AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #3a3230, #120f0e)" }}><Svg>
    <rect x={560} y={160} width={800} height={300} rx={20} fill="#B3261E" stroke="#5A0F0A" strokeWidth={8} />
    {txt(960, 240, "NOW SERVING", 60, "#FFE9C7", 900, SANS)}
    <rect x={800} y={270} width={320} height={160} rx={10} fill="#140606" />
    {txt(960, 395, n, 150, "#FF5A3A", 900, SANS)}
    <circle cx={960} cy={720} r={120} fill="#D23A2E" stroke="#5A0F0A" strokeWidth={8} /><rect x={900} y={790} width={120} height={60} fill="#5A0F0A" />
    <g transform={`translate(${960 + pull * 260} ${820 + pull * 60}) rotate(${pull * 14})`}>
      <path d="M-70 0 L70 0 L70 150 L-70 150 Z" fill="#FFE9C7" stroke="#B3261E" strokeWidth={4} />{txt(0, 105, "01", 70, "#B3261E", 900, SANS)}
    </g>
    <g opacity={cl((t - 1.6) * 3)}>{txt(400, 720, "THE WHOLE", 56, "#FFE9C7", 900, SANS)}{txt(400, 790, "TRICK, FIRST", 56, "#FFE9C7", 900, SANS)}</g>
  </Svg></AbsoluteFill></F>);
};

// cartel de hotel que se cuelga y se balancea
export const door_hanger: H = ({ dur, src }) => {
  const t = useT(), d = eout(pr(t, 0.1, 0.7)), sw = 9 * Math.sin(t * 4) * Math.exp(-t * 1.1);
  return (<F dur={dur}><Under src={src} dark={0.5} blur={6}><Svg>
    <g transform={`translate(960 ${lerp(-700, 120, d)}) rotate(${sw})`}>
      <path d="M-210 0 L210 0 L210 760 L-210 760 Z" fill="#F7EEDC" stroke={K.navy} strokeWidth={8} />
      <circle cx={0} cy={110} r={70} fill="#2a2622" stroke={K.navy} strokeWidth={6} />
      <rect x={-210} y={0} width={420} height={40} fill={K.navy} />
      {txt(0, 330, "PLEASE", 50, K.navy, 700, SANS)}{txt(0, 430, "DON'T", 110, K.red, 900, SLAB)}{txt(0, 540, "USE", 110, K.red, 900, SLAB)}
      {txt(0, 660, "vinegar at work", 46, K.graphite, 700, HAND)}
    </g>
  </Svg></Under></F>);
};

// el inodoro se parte en dos mitades que se separan: adentro, el corte
export const split_open: H = ({ dur }) => {
  const t = useT(), o = eio(pr(t, 0.4, 1.4)) * 230;
  return (<F dur={dur}><Blueprint><Svg>
    <g opacity={cl(o / 120)}>
      <rect x={960 - 18} y={250} width={36} height={600} fill="none" stroke={K.cream} strokeWidth={3} strokeDasharray="12 10" />
      <path d="M820 380 L1120 380 M1050 380 L1050 600 Q1050 690 960 690 Q870 690 870 600 L870 520" stroke={K.copper} strokeWidth={10} fill="none" />
      {txt(960, 960, "CUT IN HALF, FROM THE SIDE", 50, K.cream, 700, SANS)}
    </g>
    <g transform={`translate(${-o} 0)`}><clipPath id="hl"><rect x={0} y={0} width={960} height={1080} /></clipPath><g clipPath="url(#hl)"><Loo x={940} y={880} s={2.3} col={K.cream} fill="#1E4470" /></g></g>
    <g transform={`translate(${o} 0)`}><clipPath id="hr"><rect x={960} y={0} width={960} height={1080} /></clipPath><g clipPath="url(#hr)"><Loo x={940} y={880} s={2.3} col={K.cream} fill="#1E4470" /></g></g>
  </Svg></Blueprint></F>);
};

// el flapper como trampilla en un piso: se abre y el agua cae al sótano (la taza)
export const trapdoor: H = ({ dur }) => {
  const t = useT(), op = eout(pr(t, 0.4, 0.9));
  return (<F dur={dur}><AbsoluteFill style={{ background: "linear-gradient(#2c4a63 0 52%, #13202c 52%)" }}><Svg>
    <rect x={0} y={540} width={1920} height={40} fill="#7A5A3A" />
    <rect x={820} y={540} width={280} height={40} fill="#111" />
    <g transform={`translate(820 560) rotate(${op * 100})`}><rect x={0} y={-20} width={280} height={40} fill="#C23B2E" stroke="#5A0F0A" strokeWidth={4} />{txt(140, 14, "FLAPPER", 28, "#fff", 700, SANS)}</g>
    <rect x={500} y={300} width={920} height={240} fill={K.water} opacity={lerp(0.9, 0.35, op)} />
    {op > 0.2 && Array.from({ length: 12 }, (_, i) => { const y = 600 + ((t * 700 + i * 60) % 420); return <rect key={i} x={840 + (i * 23) % 240} y={y} width={14} height={50} rx={6} fill={K.water} />; })}
    {txt(300, 400, "TANK", 60, K.cream, 900, SANS)}{txt(300, 820, "BOWL", 60, K.cream, 900, SANS)}
  </Svg></AbsoluteFill></F>);
};

// sifón de pecera: la manguera se llena de una vez y el agua sigue sola
export const siphon_hose: H = ({ dur }) => {
  const t = useT(), D = dur / 30, fill = eio(pr(t, 0.3, 1.1)), flow = pr(t, 1.1, D);
  const hose = "M640 420 L640 300 Q640 200 760 200 Q880 200 880 300 L880 860";
  return (<F dur={dur}><Pad no="0612"><Svg>
    <rect x={380} y={380} width={520} height={420} rx={10} fill="rgba(143,193,221,0.25)" stroke={K.ink} strokeWidth={6} />
    <rect x={384} y={lerp(470, 640, flow)} width={512} height={lerp(326, 156, flow)} fill={K.water} opacity={0.8} />
    <rect x={800} y={840} width={300} height={170} fill="none" stroke={K.ink} strokeWidth={6} />
    <rect x={804} y={lerp(1006, 900, flow)} width={292} height={lerp(0, 106, flow)} fill={K.water} />
    <path d={hose} stroke={K.graphite} strokeWidth={30} fill="none" strokeLinecap="round" />
    <path d={hose} stroke={K.waterD} strokeWidth={18} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - fill} />
    <g opacity={cl((t - 1.0) * 3)}>{txt(1400, 420, "ALL AT ONCE", 70, K.ink, 900, SLAB)}{txt(1400, 500, "then it pulls by itself", 46, K.graphite, 700, HAND)}</g>
  </Svg></Pad></F>);
};

// estalactitas: gota a gota crecen bajo los agujeros del borde
export const stalactite: H = ({ dur }) => {
  const t = useT(), D = dur / 30, g = pr(t, 0.3, D - 0.6), yr = Math.round(g * 20);
  return (<F dur={dur}><AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 20%, #3a3f44, #111316)" }}><Svg>
    <rect x={200} y={180} width={1520} height={110} fill={K.porcelain} />{txt(960, 250, "UNDER THE RIM", 34, "#777", 700, SANS)}
    {Array.from({ length: 8 }, (_, i) => { const x = 330 + i * 180, L = 20 + g * (120 + (i * 37) % 90), dy = (t * 1.4 + i * 0.37) % 1;
      return (<g key={i}><circle cx={x} cy={290} r={13} fill="#0b0b0b" />
        <path d={`M${x - 18} 290 L${x + 18} 290 L${x + 3} ${290 + L} L${x - 3} ${290 + L} Z`} fill="#E9E4D6" stroke="#C9C1AA" strokeWidth={2} />
        <circle cx={x} cy={300 + L + dy * 120} r={9} fill={K.water} opacity={1 - dy} /></g>); })}
    {txt(960, 820, `YEAR ${yr}`, 110, K.cream, 900, SLAB)}{txt(960, 900, "each drop leaves a little rock", 46, "#cfcfcf", 700, HAND)}
  </Svg></AbsoluteFill></F>);
};

// diafragma de cámara: los agujeros se cierran año tras año
export const iris: H = ({ dur }) => {
  const t = useT(), c = eio(pr(t, 0.2, 2.6)), r = lerp(260, 50, c);
  const yrs = ["1 YEAR", "5 YEARS", "10 YEARS"][Math.min(2, Math.floor(c * 3))];
  return (<F dur={dur}><AbsoluteFill style={{ background: "#0d0f12" }}><Svg>
    <circle cx={960} cy={500} r={340} fill="#1b1e22" stroke="#555" strokeWidth={10} />
    <circle cx={960} cy={500} r={r} fill={K.water} />
    {Array.from({ length: 8 }, (_, i) => <path key={i} transform={`rotate(${i * 45 + c * 30} 960 500)`} d={`M${960 + r} 500 L${960 + 340} ${500 - 140} L${960 + 340} ${500 + 200} Z`} fill="#2b2f35" stroke="#0d0f12" strokeWidth={4} />)}
    {txt(960, 940, yrs, 80, K.cream, 900, SANS)}
  </Svg></AbsoluteFill></F>);
};

// motor de arranque a cuerda: v0 tose y se apaga (sifón flojo); v1 arranca al primer tirón (chorro limpio)
export const kick_start: H = ({ dur, v = 0 }) => {
  const t = useT(), D = dur / 30, pull = eout(pr(t, 0.4, 0.9)) * (1 - eio(pr(t, 0.9, 1.3)));
  const run = v === 1 && t > 1.0, sputter = v === 0 && t > 1.0 && t < 2.6;
  const shake = run ? 5 * Math.sin(t * 60) : sputter ? 3 * Math.sin(t * 25) * (Math.sin(t * 5) > 0 ? 1 : 0) : 0;
  return (<F dur={dur}><Pad no={v ? "0688" : "0614"}><Svg>
    <g transform={`translate(${760 + shake} 560)`}>
      <rect x={-260} y={-200} width={520} height={340} rx={30} fill="#3B4A5A" stroke={K.ink} strokeWidth={6} />
      {Array.from({ length: 6 }, (_, i) => <rect key={i} x={-230 + i * 80} y={-170} width={40} height={280} rx={8} fill="#2a3542" />)}
      <circle cx={300} cy={0} r={60} fill="#C9CED2" stroke={K.ink} strokeWidth={6} />
      <line x1={300} y1={0} x2={300 + 380 * pull} y2={-60 * pull} stroke={K.ink} strokeWidth={5} />
      <rect x={290 + 380 * pull} y={-80 * pull - 20} width={70} height={36} rx={10} fill={K.red} />
      {sputter && [0, 1].map((i) => <circle key={i} cx={-300 - ((t * 120 + i * 60) % 160)} cy={-180 - i * 30} r={26 + i * 10} fill="#777" opacity={0.5} />)}
      {run && Array.from({ length: 5 }, (_, i) => <line key={i} x1={-300} x2={-460 - (i % 2) * 60} y1={-120 + i * 50} y2={-120 + i * 50} stroke={K.copper} strokeWidth={8} strokeLinecap="round" opacity={0.6 + 0.4 * Math.sin(t * 20 + i)} />)}
    </g>
    {v === 0 ? <g opacity={cl((t - 1.2) * 3)}>{txt(1420, 380, "putt… putt…", 70, K.graphite, 700, HAND)}<g opacity={cl((t - 2.6) * 3)}>{txt(1420, 520, "THE SIPHON", 60, K.ink, 900, SLAB)}{txt(1420, 590, "NEVER KICKS IN", 60, K.red, 900, SLAB)}</g></g>
      : <g opacity={cl((t - 1.1) * 3)}>{txt(1420, 420, "FIRST PULL", 70, K.ink, 900, SLAB)}{txt(1420, 500, "clean jet = it starts right away", 42, K.graphite, 700, HAND)}</g>}
    {v === 1 && <Stamp t={t} at={Math.min(2.2, D - 1)} x={1420} y={760} text="FIXED" size={80} />}
  </Svg></Pad></F>);
};

// varilla de aceite: se saca del tanque y se lee el nivel del agua
export const dipstick: H = ({ dur }) => {
  const t = useT(), up = eout(pr(t, 0.2, 1.0));
  return (<F dur={dur}><Pad no="0703"><Svg>
    <rect x={560} y={560} width={800} height={420} fill="rgba(143,193,221,0.2)" stroke={K.ink} strokeWidth={6} />
    <rect x={564} y={680} width={792} height={296} fill={K.water} opacity={0.8} />
    <g transform={`translate(960 ${lerp(380, 0, up)})`}>
      <rect x={-14} y={180} width={28} height={720} fill="#B9BEC2" stroke={K.ink} strokeWidth={3} />
      <rect x={-40} y={140} width={80} height={50} rx={16} fill="#F2C230" stroke={K.ink} strokeWidth={4} />
      <rect x={-14} y={680 - lerp(380, 0, up) + lerp(380, 0, up)} width={28} height={220} fill={K.waterD} opacity={0.8} />
      <line x1={-40} x2={40} y1={640} y2={640} stroke={K.red} strokeWidth={6} />{txt(60, 650, "FULL", 36, K.red, 700, SANS, "start")}
      <line x1={-40} x2={40} y1={760} y2={760} stroke={K.ink} strokeWidth={6} />{txt(60, 770, "LOW", 36, K.ink, 700, SANS, "start")}
    </g>
    <g opacity={cl((t - 1.2) * 3)}>{txt(380, 400, "CHECK 1", 70, K.ink, 900, SLAB)}{txt(380, 470, "the water level", 46, K.graphite, 700, HAND)}</g>
  </Svg></Pad></F>);
};

// la cadena del flapper dibujada como sonrisa: tensa = boca recta (mal); con dos eslabones de juego = sonrisa
export const chain_smile: H = ({ dur }) => {
  const t = useT(), k = eio(pr(t, 1.0, 2.2)), sag = lerp(0, 120, k);
  const links = Array.from({ length: 13 }, (_, i) => { const u = i / 12; return [660 + u * 600, 360 + sag * 4 * u * (1 - u)]; });
  return (<F dur={dur}><Blueprint><Svg>
    <circle cx={960} cy={420} r={330} fill="#F2C230" opacity={0.92} /><circle cx={840} cy={300} r={34} fill={K.ink} /><circle cx={1080} cy={300} r={34} fill={K.ink} />
    {links.map(([x, y], i) => <ellipse key={i} cx={x} cy={y + 120} rx={26} ry={14} fill="none" stroke="#5E666C" strokeWidth={8} transform={`rotate(${i % 2 ? 90 : 0} ${x} ${y + 120})`} />)}
    <rect x={600} y={460} width={70} height={30} rx={8} fill="#C9CED2" /><circle cx={1290} cy={480} r={34} fill={K.red} />
    {k < 0.2 ? txt(960, 960, "TIGHT = NO SEAL", 60, K.red, 900, SANS) : <g opacity={cl((k - 0.2) * 3)}>{txt(960, 960, "ABOUT TWO LINKS OF SLACK", 60, K.cream, 900, SANS)}</g>}
  </Svg></Blueprint></F>);
};

// dos cronómetros: empujar 2 s (débil) contra sostener 6 s (fuerte)
export const stopwatch_pair: H = ({ dur }) => {
  const t = useT(), a = cl(t / 2.2) * (2 / 60), b = cl(t / 2.6) * (6 / 60);
  return (<F dur={dur}><Pad no="0711"><Svg>
    <Dial x={620} y={560} r={190} frac={a * 6} label="PUSH" col={K.graphite} /><Dial x={1300} y={560} r={190} frac={b * 6} label="HOLD" col={K.red} />
    {txt(620, 900, "2 sec · weak", 54, K.graphite, 700, HAND)}{txt(1300, 900, "6 sec · strong", 54, K.red, 700, HAND)}
  </Svg></Pad></F>);
};

// cambio de vías: si el inodoro tira fuerte con el mango sostenido, el tren va a la vía "EL CAÑO ESTÁ BIEN"
export const rail_switch: H = ({ dur }) => {
  const t = useT(), D = dur / 30, sw = eio(pr(t, 0.6, 1.1)), tr = pr(t, 1.2, D - 0.4);
  const up = (u: number) => [200 + u * 1500, 700 - Math.max(0, u - 0.45) * 2 * 420 * sw];
  const [x, y] = up(tr);
  return (<F dur={dur}><AbsoluteFill style={{ background: "linear-gradient(#6E8B55, #3D5130)" }}><Svg>
    <path d="M200 700 L875 700 L1700 280" stroke="#4a3a2a" strokeWidth={46} fill="none" opacity={sw} /><path d="M200 700 L1700 700" stroke="#4a3a2a" strokeWidth={46} fill="none" opacity={1 - sw * 0.6} />
    <path d="M200 700 L875 700 L1700 280" stroke="#C9CED2" strokeWidth={8} fill="none" strokeDasharray="30 14" opacity={sw} /><path d="M200 700 L1700 700" stroke="#C9CED2" strokeWidth={8} fill="none" strokeDasharray="30 14" opacity={1 - sw * 0.6} />
    <rect x={1500} y={170} width={360} height={90} fill={K.cream} />{txt(1680, 230, "RIM & JET", 46, K.ink, 900, SANS)}
    <rect x={1500} y={760} width={360} height={90} fill={K.cream} opacity={0.6} />{txt(1680, 820, "THE PIPE", 46, K.ink, 900, SANS, "middle", 0.6)}
    <g transform={`translate(${x} ${y})`}><rect x={-90} y={-70} width={180} height={90} rx={14} fill={K.red} /><circle cx={-50} cy={24} r={20} fill="#222" /><circle cx={50} cy={24} r={20} fill="#222" />{txt(0, -14, "WHOOSH", 34, "#fff", 900, SANS)}</g>
    {txt(560, 200, "BIG WHOOSH? THE PIPE IS FINE", 54, K.cream, 900, SANS)}
  </Svg></AbsoluteFill></F>);
};

// gotas de colorante + reloj de 20 minutos: si aparece color en la taza, pierde el flapper
export const dye_drop: H = ({ dur }) => {
  const t = useT(), D = dur / 30, cl2 = pr(t, 0.3, 1.2), tm = pr(t, 1.2, D - 1.0), bowl = pr(t, D - 1.6, D - 0.6);
  return (<F dur={dur}><Pad no="0719"><Svg>
    <rect x={420} y={300} width={560} height={420} fill="rgba(143,193,221,0.25)" stroke={K.ink} strokeWidth={6} />
    <rect x={424} y={380} width={552} height={336} fill={`rgba(${lerp(143, 40, cl2)},${lerp(193, 90, cl2)},${lerp(221, 200, cl2)},0.8)`} />
    {[0, 1, 2].map((i) => <circle key={i} cx={640 + i * 60} cy={lerp(200, 380, pr(t, 0.2 + i * 0.2, 0.6 + i * 0.2))} r={16} fill="#1F4FD8" opacity={1 - pr(t, 0.6 + i * 0.2, 0.7 + i * 0.2)} />)}
    <Dial x={1340} y={440} r={150} frac={tm * (20 / 60)} label="20 MIN" />
    <ellipse cx={700} cy={880} rx={260} ry={70} fill={`rgba(${lerp(143, 40, bowl)},${lerp(193, 90, bowl)},${lerp(221, 200, bowl)},0.85)`} stroke={K.ink} strokeWidth={6} />
    <g opacity={bowl}>{txt(1340, 860, "color in the bowl =", 46, K.graphite, 700, HAND)}{txt(1340, 930, "THE FLAPPER LEAKS", 54, K.red, 900, SANS)}</g>
  </Svg></Pad></F>);
};

// periscopio: la luz baja, rebota en el espejo y llega al ojo
export const periscope: H = ({ dur }) => {
  const t = useT(), k = pr(t, 0.2, 1.4);
  return (<F dur={dur}><Blueprint><Svg>
    <path d="M700 260 L860 260 L860 760 L1300 760 L1300 900 L700 900 Z" fill="none" stroke={K.cream} strokeWidth={6} opacity={0.6} />
    <line x1={720} y1={920} x2={840} y2={800} stroke={K.copper} strokeWidth={14} />{txt(640, 1000, "MIRROR", 34, K.copper, 700, SANS)}
    <path d="M1280 830 L780 830 L780 300" stroke="#FFF6B0" strokeWidth={10} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} style={{ filter: "drop-shadow(0 0 12px #FFF6B0)" }} />
    <ellipse cx={780} cy={230} rx={60} ry={34} fill="#fff" /><circle cx={780} cy={230} r={20} fill={K.ink} />
    {txt(1360, 400, "STEP 1", 70, K.cream, 900, SLAB)}{txt(1360, 480, "the mirror test", 50, K.cream, 700, HAND)}
  </Svg></Blueprint></F>);
};

// carta de oculista hecha de agujeros: limpios = negros y redondos; tapados = blancos con costra
export const hole_chart: H = ({ dur }) => {
  const t = useT();
  const rows = [1, 2, 3, 4, 5];
  return (<F dur={dur}><AbsoluteFill style={{ background: "#E9E4D6" }}><Svg>
    {rows.map((n, r) => Array.from({ length: n }, (_, i) => { const s = 80 - r * 12, x = 960 + (i - (n - 1) / 2) * s * 2.2, y = 180 + r * 150, bad = (r + i) % 3 === 2;
      const k = cl((t - 0.2 - r * 0.25) * 3); return (<g key={r + "-" + i} opacity={k}>
        <circle cx={x} cy={y} r={s / 2} fill={bad ? "#FAF8F1" : "#111"} stroke={bad ? "#C9C1AA" : "#111"} strokeWidth={6} />
        {bad && <circle cx={x} cy={y} r={s / 5} fill="#444" />}</g>); }))}
    <g opacity={cl((t - 1.6) * 3)}>{txt(420, 960, "● CLEAN: DARK, ROUND", 40, K.ink, 900, SANS)}{txt(1460, 960, "○ BLOCKED: WHITE, CRUSTY", 40, K.red, 900, SANS)}</g>
  </Svg></AbsoluteFill></F>);
};

// compuertas de esclusa: v0 cerradas, el vinagre se queda toda la noche; v1 abiertas, se vacía en 10 segundos
export const sluice: H = ({ dur, v = 0 }) => {
  const t = useT(), D = dur / 30;
  const open = v === 1 ? eio(pr(t, 0.4, 1.0)) : 0, drain = v === 1 ? pr(t, 1.0, D - 1.0) : 0, secs = Math.round(drain * 10);
  return (<F dur={dur}><AbsoluteFill style={{ background: "linear-gradient(#55707f, #2a3a44)" }}><Svg>
    <rect x={300} y={360} width={1320} height={360} fill="#8a8a82" /><rect x={320} y={380} width={1280} height={320} fill="#3a4a52" />
    <rect x={320} y={lerp(420, 690, drain)} width={1280} height={lerp(280, 10, drain)} fill="#E9FF7A" opacity={0.75} />
    {[420, 1500].map((x, i) => <rect key={i} x={x - 30} y={lerp(340, 140, open)} width={60} height={400} fill="#5D4A3A" stroke="#2a1f16" strokeWidth={5} />)}
    {txt(420, 320 - open * 200, "TAPE", 36, K.cream, 900, SANS)}{txt(1500, 320 - open * 200, "TAPE", 36, K.cream, 900, SANS)}
    {v === 0 ? <g opacity={cl((t - 0.8) * 3)}>{txt(960, 860, "THE VINEGAR STAYS IN THE RIM", 56, K.cream, 900, SANS)}{txt(960, 930, "all night", 46, K.cream, 700, HAND)}</g>
      : <g>{txt(960, 860, `NO TAPE: GONE IN ${secs} SEC`, 60, "#FFD2C7", 900, SANS)}</g>}
  </Svg></AbsoluteFill></F>);
};

// tres ollas: fría, tibia (sí), caliente humeando (no)
export const goldilocks: H = ({ dur }) => {
  const t = useT();
  const P: [string, string, number][] = [["COLD", "#7FB0D0", 0], ["WARM", "#E0A65A", 1], ["HOT", "#D8452E", 2]];
  return (<F dur={dur}><Pad no="0742"><Svg>
    {P.map(([n, c, i]) => { const x = 480 + i * 480, k = spr(t, 0.1 + i * 0.15); return (<g key={n} transform={`translate(${x} 620) scale(${cl(k)})`}>
      <path d="M-170 -110 L170 -110 L150 120 L-150 120 Z" fill="#4a4f55" stroke={K.ink} strokeWidth={6} /><rect x={-190} y={-130} width={380} height={30} rx={10} fill="#6a7077" />
      <rect x={-160} y={-100} width={320} height={40} fill={c} />
      {i === 2 && [0, 1, 2].map((j) => <path key={j} d={`M${-60 + j * 60} -150 q 20 -40 0 -80 q -20 -40 0 -80`} stroke="#ddd" strokeWidth={8} fill="none" opacity={0.7} />)}
      {txt(0, 220, n, 56, K.ink, 900, SANS)}</g>); })}
    <Check x={960} y={330} p={pr(t, 0.9, 1.3)} s={2} /><X x={1440} y={330} p={pr(t, 1.2, 1.6)} s={50} />
  </Svg></Pad></F>);
};

// etiquetas "HELLO my name is" que se pegan en las dos piezas paradas del tanque
export const name_tags: H = ({ dur }) => {
  const t = useT();
  const tag = (x: number, y: number, name: string, at: number) => { const k = spr(t, at); return (<g transform={`translate(${x} ${y}) rotate(${-6 + 10 * (1 - cl(k))}) scale(${cl(k)})`}>
    <rect x={-170} y={-90} width={340} height={180} rx={14} fill="#fff" stroke="#C0302A" strokeWidth={4} /><rect x={-170} y={-90} width={340} height={70} rx={14} fill="#C0302A" />
    {txt(0, -42, "HELLO my name is", 30, "#fff", 700, SANS)}{txt(0, 50, name, 46, K.ink, 700, HAND)}</g>); };
  return (<F dur={dur}><Pad no="0748"><Svg>
    <rect x={460} y={260} width={1000} height={700} fill="rgba(143,193,221,0.2)" stroke={K.ink} strokeWidth={6} /><rect x={464} y={500} width={992} height={456} fill={K.water} opacity={0.6} />
    <rect x={700} y={320} width={50} height={600} fill={K.porcelain} stroke={K.ink} strokeWidth={5} />
    <rect x={1180} y={360} width={90} height={560} fill="#6E7378" stroke={K.ink} strokeWidth={5} /><circle cx={1225} cy={380} r={50} fill="#6E7378" stroke={K.ink} strokeWidth={5} />
    {tag(560, 420, "overflow tube", 0.3)}{tag(1400, 470, "fill valve", 0.9)}
  </Svg></Pad></F>);
};

// medidor de combustible: la aguja va de E a F mientras el tubo se llena y rebalsa
export const fuel_gauge: H = ({ dur }) => {
  const t = useT(), D = dur / 30, k = eio(pr(t, 0.3, D - 1.4)), a = lerp(-60, 60, k);
  return (<F dur={dur}><AbsoluteFill style={{ background: "#111" }}><Svg>
    <path d="M560 700 A400 400 0 0 1 1360 700" stroke="#333" strokeWidth={40} fill="none" />
    <path d="M560 700 A400 400 0 0 1 1360 700" stroke="#E9FF7A" strokeWidth={14} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />
    {txt(600, 780, "E", 80, "#fff", 900, SANS)}{txt(1320, 780, "F", 80, "#fff", 900, SANS)}
    <line x1={960} y1={700} x2={960} y2={360} stroke={K.red} strokeWidth={14} strokeLinecap="round" transform={`rotate(${a} 960 700)`} /><circle cx={960} cy={700} r={30} fill="#ddd" />
    {txt(960, 880, "POUR UNTIL IT BACKS UP", 58, "#fff", 900, SANS)}
    {k > 0.95 && txt(960, 960, "then stop", 50, "#E9FF7A", 700, HAND)}
  </Svg></AbsoluteFill></F>);
};

// correo neumático: v0 la cápsula de vinagre entra a la estación TANK y se queda; v1 la línea al RIM está cerrada por el flapper
export const pneumatic: H = ({ dur, v = 0 }) => {
  const t = useT(), k = eio(pr(t, 0.2, 1.2));
  const tube = "M240 260 L900 260 Q960 260 960 320 L960 620";
  return (<F dur={dur}><Blueprint><Svg>
    <path d={tube} stroke="rgba(255,255,255,0.35)" strokeWidth={70} fill="none" strokeLinecap="round" />
    <rect x={820} y={620} width={280} height={200} rx={12} fill={K.cream} />{txt(960, 740, "TANK", 60, K.ink, 900, SANS)}
    <path d="M1100 720 L1500 720 L1500 520" stroke="rgba(255,255,255,0.35)" strokeWidth={70} fill="none" />
    <rect x={1380} y={360} width={240} height={160} rx={12} fill={K.cream} />{txt(1500, 460, "RIM", 60, K.ink, 900, SANS)}
    <rect x={1140} y={670} width={30} height={100} fill={K.red} />{txt(1155, 820, "FLAPPER", 26, K.red, 900, SANS)}
    {v === 0 ? <g transform={`translate(${k < 0.6 ? lerp(240, 900, k / 0.6) : 960} ${k < 0.6 ? 260 : lerp(260, 680, (k - 0.6) / 0.4)})`}><rect x={-60} y={-28} width={120} height={56} rx={28} fill="#E9FF7A" stroke={K.ink} strokeWidth={4} />{txt(0, 12, "VINEGAR", 22, K.ink, 900, SANS)}</g>
      : <g><g transform="translate(1060 720)"><rect x={-60} y={-28} width={120} height={56} rx={28} fill="#E9FF7A" stroke={K.ink} strokeWidth={4} /></g><X x={1155} y={560} p={pr(t, 0.6, 1.2)} s={44} />{txt(960, 1000, "IT NEVER REACHES THE RIM", 56, K.cream, 900, SANS)}</g>}
  </Svg></Blueprint></F>);
};

// tarjeta de fichar: IN 9 PM, OUT 7 AM
export const punch_clock: H = ({ dur }) => {
  const t = useT(), p1 = t > 0.8, p2 = t > 1.8;
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2b2925" }}><Svg>
    <rect x={720} y={120} width={480} height={840} fill="#EFE3C6" stroke="#9a8a6a" strokeWidth={4} />
    {txt(960, 210, "TIME CARD", 56, K.ink, 900, SLAB)}{txt(960, 260, "VINEGAR · NIGHT SHIFT", 26, K.graphite, 700, SANS)}
    {Array.from({ length: 10 }, (_, i) => <line key={i} x1={740} x2={1180} y1={320 + i * 60} y2={320 + i * 60} stroke="rgba(0,0,0,0.15)" strokeWidth={2} />)}
    {txt(780, 420, "IN", 40, K.ink, 900, SANS, "start")}{p1 && txt(1140, 420, "9:00 PM", 48, "#5a2fa0", 700, "monospace", "end")}
    {txt(780, 540, "OUT", 40, K.ink, 900, SANS, "start")}{p2 && txt(1140, 540, "7:00 AM", 48, "#5a2fa0", 700, "monospace", "end")}
    <g opacity={cl((t - 2.3) * 3)}>{txt(960, 720, "8 HRS: GOOD", 50, K.ink, 900, SANS)}{txt(960, 790, "12: BETTER", 50, K.red, 900, SANS)}</g>
    <rect x={700} y={(t % 1 < 0.15 && t < 2.2) ? 360 : 330} width={520} height={20} fill="#555" opacity={0.5} />
  </Svg></AbsoluteFill></F>);
};

// la llave Allen gira en el agujero y la costra se desmorona en granitos
export const grit_fall: H = ({ dur }) => {
  const t = useT(), rot = Math.sin(t * 6) * 25 * pr(t, 0.4, 0.8), crumb = pr(t, 0.8, 3.4);
  return (<F dur={dur}><AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #e6e1d4, #9a958a)" }}><Svg>
    <rect x={0} y={0} width={1920} height={420} fill={K.porcelain} /><circle cx={960} cy={420} r={90} fill="#111" />
    <circle cx={960} cy={420} r={90 * (1 - crumb * 0.8)} fill="none" stroke="#E9E4D6" strokeWidth={60 * (1 - crumb)} />
    <g transform={`rotate(${rot} 960 420)`}><path d="M960 420 L960 120 L1180 120" stroke="#2a2a2a" strokeWidth={36} fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>
    {Array.from({ length: 30 }, (_, i) => { const k = cl(crumb * 1.4 - (i % 10) * 0.07); return k > 0 ? <rect key={i} x={890 + (i * 47) % 140} y={480 + k * (300 + (i * 31) % 200)} width={10} height={10} fill="#E9E4D6" transform={`rotate(${i * 30})`} /> : null; })}
    {txt(960, 960, "A LITTLE TWIST · NO FORCE", 60, K.ink, 900, SANS)}
  </Svg></AbsoluteFill></F>);
};

// anillos de árbol: el agujero astillado junta cal al doble de velocidad
export const tree_rings: H = ({ dur }) => {
  const t = useT(), D = dur / 30, y = Math.floor(pr(t, 0.6, D - 1.2) * 5);
  const hole = (x: number, n: number, chip: boolean) => (<g>
    {Array.from({ length: n }, (_, i) => <circle key={i} cx={x} cy={520} r={60 + (n - i) * 26} fill={i % 2 ? "#E9E4D6" : "#D9D1BB"} stroke="#B5AA8C" strokeWidth={2} />)}
    <path d={chip ? `M${x - 60} 520 l 20 -30 l 18 26 l 22 -40 l 20 44 l 20 -20 l 20 40 a60 60 0 1 1 -120 -20` : ""} fill="#111" />
    {!chip && <circle cx={x} cy={520} r={60} fill="#111" />}</g>);
  return (<F dur={dur}><AbsoluteFill style={{ background: "#F3EEE2" }}><Svg>
    {hole(560, y, false)}{hole(1360, y * 2, true)}
    {txt(560, 900, "SMOOTH", 56, K.ink, 900, SANS)}{txt(1360, 900, "CHIPPED BY A NAIL", 56, K.red, 900, SANS)}
    {txt(960, 140, `YEAR ${y}`, 64, K.graphite, 900, SLAB)}{txt(1360, 970, "lime twice as fast", 44, K.red, 700, HAND)}
  </Svg></AbsoluteFill></F>);
};

// telón de agua: baja parejo por toda la vuelta de la taza
export const stage_curtain: H = ({ dur }) => {
  const t = useT(), k = eout(pr(t, 0.3, 1.3));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#14080a" }}><Svg>
    <rect x={200} y={120} width={1520} height={100} fill="#7A1E22" />{Array.from({ length: 16 }, (_, i) => <path key={i} d={`M${200 + i * 95} 220 q 47 40 95 0`} fill="#7A1E22" />)}
    {Array.from({ length: 40 }, (_, i) => { const x = 260 + i * 36, L = k * 600; return <line key={i} x1={x} x2={x + 3 * Math.sin(t * 8 + i)} y1={240} y2={240 + L} stroke={K.water} strokeWidth={14} opacity={0.75} strokeLinecap="round" />; })}
    <rect x={200} y={860} width={1520} height={40} fill="#3a2a1a" />
    <g opacity={cl((t - 1.4) * 3)}>{txt(960, 990, "EVEN, ALL THE WAY AROUND", 60, K.cream, 900, SANS)}</g>
  </Svg></AbsoluteFill></F>);
};

// osciloscopio: v0 el "whoosh" hondo (una onda grande y se termina); v1 bueno contra gorgoteo
export const scope: H = ({ dur, v = 0 }) => {
  const t = useT(), D = dur / 30, sweep = pr(t, 0.1, Math.min(D - 0.4, 2.2));
  const good = (x: number) => { const u = x / 1200; return u < 0.15 ? 0 : u < 0.55 ? Math.sin((u - 0.15) * 28) * 180 * Math.sin(Math.PI * (u - 0.15) / 0.4) : 0; };
  const bad = (x: number) => { const u = x / 1200; return u < 0.1 ? 0 : (Math.sin(u * 90) * 30 + Math.sin(u * 37) * 25) * (u < 0.95 ? 1 : 0); };
  const tr = (fn: (x: number) => number, y0: number, col: string) => { const n = Math.floor(240 * sweep); const d = Array.from({ length: n }, (_, i) => `${i ? "L" : "M"}${360 + i * 5} ${y0 - fn(i * 5)}`).join(" "); return <path d={d} stroke={col} strokeWidth={6} fill="none" style={{ filter: `drop-shadow(0 0 10px ${col})` }} />; };
  return (<F dur={dur}><AbsoluteFill style={{ background: "#08140c" }}><Svg>
    <rect x={340} y={140} width={1240} height={800} rx={30} fill="none" stroke="#2c4a33" strokeWidth={8} />
    {Array.from({ length: 11 }, (_, i) => <line key={i} x1={360 + i * 120} x2={360 + i * 120} y1={160} y2={920} stroke="#173020" strokeWidth={2} />)}
    {v === 0 ? <>{tr(good, 540, "#7CFF9A")}{txt(960, 1020, "DEEP · QUICK · OVER", 50, "#7CFF9A", 900, SANS)}</>
      : <>{tr(good, 380, "#7CFF9A")}{tr(bad, 740, "#FF7A5A")}{txt(1560, 300, "GOOD", 40, "#7CFF9A", 900, SANS, "end")}{txt(1560, 660, "GURGLE", 40, "#FF7A5A", 900, SANS, "end")}</>}
  </Svg></AbsoluteFill></F>);
};

// cinta de teletipo de la bolsa: el repaso corre en una línea con tildes
export const ticker_tape: H = ({ dur }) => {
  const t = useT(), x = lerp(1920, 260, eout(pr(t, 0.1, 1.4)));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#0b0f14" }}><Svg>
    <rect x={0} y={440} width={1920} height={200} fill="#14202c" /><rect x={0} y={440} width={1920} height={8} fill="#2c4a63" /><rect x={0} y={632} width={1920} height={8} fill="#2c4a63" />
    <g transform={`translate(${x} 0)`}>
      <text x={0} y={575} fontFamily={SANS} fontWeight={900} fontSize={96} fill="#7CFF9A" letterSpacing={6}>LEVEL ▲ OK</text>
      <text x={760} y={575} fontFamily={SANS} fontWeight={900} fontSize={96} fill="#7CFF9A" letterSpacing={6}>CHAIN ▲ OK</text>
    </g>
  </Svg></AbsoluteFill></F>);
};

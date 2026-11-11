// Héroes de len11b, parte 2: libro, errores, rutina, historia y cierre.
import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { K, SLAB, SANS, HAND, cl, lerp, eio, eout, pr, spr, useT, Pad, Blueprint, Under, Pencil, Stamp, FromBook, Svg } from "./kit";
import { H, F, X, Check, txt, Rope, DrainModel } from "./heroes_b";

const PG = (n: string) => staticFile(`len11b/c/${n}.png`);
const PW = 1700, PH = 2200;
/** página del libro como <image> SVG con sombra */
const Page: React.FC<{ n: string; x: number; y: number; h: number; rot?: number; op?: number }> = ({ n, x, y, h, rot = 0, op = 1 }) => {
  const w = (h * PW) / PH;
  return (<g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={op}>
    <rect x={-w / 2 + 14} y={-h / 2 + 18} width={w} height={h} fill="rgba(0,0,0,0.35)" />
    <image href={PG(n)} x={-w / 2} y={-h / 2} width={w} height={h} preserveAspectRatio="none" />
  </g>);
};
const BILL: Record<string, [number, number]> = { p127: [0.84, 0.72], p133: [0.84, 0.69], p126: [0.84, 0.7] };

// ── LIBRO ───────────────────────────────────────────────
// el libro se desliza por el borde de la bañera y se frena
export const bk_tub: H = ({ dur, src }) => {
  const t = useT(), D = dur / 30, k = eout(pr(t, 0.2, 1.4));
  return (<F dur={dur}><Under src={src} dark={0.35}><Svg>
    <rect x={0} y={760} width={1920} height={60} fill="#F4F1EA" opacity={0.92} /><rect x={0} y={812} width={1920} height={14} fill="#CFCAC0" />
    <g transform={`translate(${lerp(2300, 1180, k)} 520) rotate(${lerp(8, -3, k)})`}>
      <rect x={-232} y={-290} width={480} height={600} fill="#1a1a1a" opacity={0.3} />
      <image href={PG("p001")} x={-240} y={-310} width={464} height={600} preserveAspectRatio="none" />
    </g>
    <Pencil t={t} at={1.6} x={420} y={420} text="my book" size={70} col={K.cream} to={[930, 470]} />
    <g opacity={cl((t - D * 0.55) * 3)}><rect x={250} y={560} width={560} height={110} rx={10} fill={K.pad} stroke={K.red} strokeWidth={5} />{txt(530, 628, "the shop vac trick: not in it", 40, K.red, 700, HAND)}</g>
  </Svg><FromBook /></Under></F>);
};

// una lupa se desliza por la página 127 hasta la cuenta
export const bk_page: H = ({ dur }) => {
  const t = useT(), D = dur / 30, h = 1000, w = (h * PW) / PH, x0 = 960 - w / 2, y0 = 40;
  const [fx, fy] = BILL.p127; const k = eio(pr(t, 0.8, D * 0.6));
  const lx = lerp(x0 + w * 0.3, x0 + w * fx, k), ly = lerp(y0 + h * 0.2, y0 + h * fy, k), R = 170, Z = 2.2;
  return (<F dur={dur}><AbsoluteFill style={{ background: K.navy }}><Svg>
    <defs><clipPath id="loupe"><circle cx={lx} cy={ly} r={R} /></clipPath></defs>
    <rect x={x0 + 14} y={y0 + 18} width={w} height={h} fill="rgba(0,0,0,0.4)" />
    <image href={PG("p127")} x={x0} y={y0} width={w} height={h} preserveAspectRatio="none" />
    <g clipPath="url(#loupe)"><rect x={lx - R} y={ly - R} width={2 * R} height={2 * R} fill={K.white} />
      <image href={PG("p127")} x={lx - (lx - x0) * Z} y={ly - (ly - y0) * Z} width={w * Z} height={h * Z} preserveAspectRatio="none" /></g>
    <circle cx={lx} cy={ly} r={R} fill="none" stroke={K.copper} strokeWidth={14} />
    <line x1={lx + R * 0.7} y1={ly + R * 0.7} x2={lx + R * 1.5} y2={ly + R * 1.5} stroke="#3B2A1A" strokeWidth={34} strokeLinecap="round" />
    {txt(220, 200, "PAGE", 34, K.copper, 700, SANS)}{txt(220, 300, "127", 120, K.cream)}
  </Svg><FromBook /></AbsoluteFill></F>);
};

// tres páginas reales en abanico; la cuenta de cada una se rodea en rojo
export const bk_bill: H = ({ dur }) => {
  const t = useT(), D = dur / 30, h = 760;
  const P = [["p126", 560, -8], ["p127", 960, 0], ["p133", 1360, 8]] as const;
  return (<F dur={dur}><AbsoluteFill style={{ background: K.navy }}><Svg>
    {P.map(([n, x, r], i) => { const a = spr(t, 0.1 + i * 0.15); const w = (h * PW) / PH; const [fx, fy] = BILL[n]; const c = pr(t, 0.9 + i * 0.6, 1.4 + i * 0.6);
      return (<g key={n} transform={`translate(${x} ${560 + (1 - a) * 500}) rotate(${r})`}>
        <Page n={n} x={0} y={0} h={h} />
        <ellipse cx={-w / 2 + w * fx} cy={-h / 2 + h * fy} rx={90} ry={60} fill="none" stroke={K.red} strokeWidth={8} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - c} />
      </g>); })}
    {txt(960, 1050, "WHAT THE PLUMBER CHARGES · WHAT YOU PAY", 34, K.cream, 700, SANS)}
  </Svg><FromBook x={1680} y={60} /></AbsoluteFill></F>);
};

// tarjeta QR colgada de un broche en un hilo; detrás, la página real
export const bk_qr: H = ({ dur, v = 0 }) => {
  const t = useT(), pg = v === 1 ? "p133" : "p127", sw = Math.sin(t * 1.6) * 2.2 * (1 - pr(t, 0, 3) * 0.6), d = eout(pr(t, 0, 0.5));
  return (<F dur={dur}><AbsoluteFill style={{ background: `radial-gradient(ellipse at 40% 40%, ${K.blue}, ${K.navy})` }}><Svg>
    <Page n={pg} x={560} y={560} h={900} rot={-5} op={0.95} />
    <path d="M900 120 Q1340 170 1920 110" stroke={K.cream} strokeWidth={4} fill="none" />
    <g transform={`translate(1340 ${lerp(-500, 150, d)}) rotate(${sw})`}>
      <rect x={-22} y={-40} width={44} height={110} rx={8} fill="#C9A26B" stroke="#6E5230" strokeWidth={3} /><circle cx={0} cy={10} r={8} fill="#8A8F93" />
      <rect x={-270} y={60} width={540} height={680} rx={12} fill={K.white} stroke={K.ink} strokeWidth={5} />
      <image href={PG("qr_shower")} x={-230} y={100} width={460} height={460} />
      {txt(0, 625, "FIRST LINE OF", 38, K.ink, 700, SANS)}{txt(0, 680, "THE DESCRIPTION", 38, K.red, 700, SANS)}
    </g>
    {txt(560, 1050, v === 1 ? "NEVER PAY FOR A CLOGGED DRAIN" : "PAGE 127", 34, K.copper, 700, SANS)}
  </Svg><FromBook x={140} y={60} /></AbsoluteFill></F>);
};

// pestaña roja "133": se tira y el libro cae abierto en esa página
export const bk_tab: H = ({ dur }) => {
  const t = useT(), D = dur / 30, pull = eio(pr(t, 0.5, 1.3)), open = eio(pr(t, 1.3, 2.1));
  return (<F dur={dur}><AbsoluteFill style={{ background: K.pad }}><Svg>
    <g transform={`translate(960 560) scale(${lerp(1, 1.08, open)})`}>
      <g opacity={1 - open} transform={`scale(${1 - open * 0.9} 1)`}>
        <rect x={250} y={-260 - pull * 40} width={90} height={150} fill={K.red} />{txt(295, -170 - pull * 40, "133", 34, K.white, 700, SANS)}
        <image href={PG("p001")} x={-310} y={-400} width={620} height={800} preserveAspectRatio="none" />
      </g>
      <g opacity={open}><Page n="p133" x={0} y={0} h={900} /></g>
    </g>
    {open > 0.9 && <Pencil t={t} at={2.2} x={1340} y={300} text="slow shower, no hair" size={50} col={K.red} />}
  </Svg><FromBook /></AbsoluteFill></F>);
};

// pilas de monedas junto a la página 133: la del plomero sube, la tuya queda en cero
export const bk_coins: H = ({ dur }) => {
  const t = useT(), D = dur / 30, n = Math.floor(lerp(0, 18, pr(t, 0.5, D * 0.6)));
  const stack = (x: number, k: number, col: string) => Array.from({ length: k }, (_, i) => <g key={i}><ellipse cx={x} cy={860 - i * 26} rx={90} ry={24} fill={col} stroke="#6E5230" strokeWidth={3} /><ellipse cx={x} cy={854 - i * 26} rx={90} ry={24} fill={col} stroke="#6E5230" strokeWidth={2} /></g>);
  return (<F dur={dur}><AbsoluteFill style={{ background: K.navy }}><Svg>
    <Page n="p133" x={480} y={540} h={900} rot={-3} />
    {stack(1180, n, "#D7B46A")}<ellipse cx={1580} cy={866} rx={90} ry={24} fill="none" stroke={K.cream} strokeWidth={3} strokeDasharray="10 8" />
    {txt(1180, 960, "PLUMBER", 40, K.cream, 700, SANS)}{txt(1580, 960, "YOU", 40, K.copper, 700, SANS)}
    {n >= 18 && <>{txt(1180, 340, "$175", 80, K.cream)}{txt(1580, 760, "$0", 80, K.copper)}</>}
  </Svg><FromBook /></AbsoluteFill></F>);
};

// cierre: brotan 40 pestañas de colores del canto del libro
export const bk_tabs40: H = ({ dur }) => {
  const t = useT(), D = dur / 30, n = Math.floor(lerp(0, 40, pr(t, 0.6, D * 0.65)));
  const cols = [K.red, K.copper, K.waterD, K.green, "#D7B46A"];
  return (<F dur={dur}><AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, ${K.blue}, ${K.navy})` }}><Svg>
    <g transform="translate(960 540)">
      {Array.from({ length: n }, (_, i) => { const right = i % 2 === 0, row = Math.floor(i / 2); const y = -360 + row * 37; const p = eout(pr(t, 0.6 + i * (D * 0.65 - 0.6) / 40, 0.9 + i * (D * 0.65 - 0.6) / 40));
        return <rect key={i} x={right ? 290 : -290 - 70 * p} y={y} width={70 * p} height={28} rx={4} fill={cols[i % 5]} />; })}
      <image href={PG("p001")} x={-300} y={-390} width={600} height={776} preserveAspectRatio="none" />
    </g>
    {txt(1610, 500, String(n), 150, K.cream)}{txt(1610, 570, "DRAIN FIXES", 40, K.copper, 700, SANS)}
    <g opacity={cl((t - D * 0.7) * 2)}>{txt(320, 520, "PLUMBER", 36, K.cream, 700, SANS)}{txt(320, 580, "next to", 36, K.cream, 700, HAND)}{txt(320, 640, "YOU", 36, K.copper, 700, SANS)}</g>
  </Svg><FromBook /></AbsoluteFill></F>);
};

// ── MÉTODO ──────────────────────────────────────────────
// filtro de papel: se moja, se rasga, la tierra va al motor
export const filter_tear: H = ({ dur }) => {
  const t = useT(), D = dur / 30, w = pr(t, 0.3, D * 0.45), r = pr(t, D * 0.45, D * 0.7), d = pr(t, D * 0.65, D - 0.3);
  return (<F dur={dur}><Pad no="0520"><Svg>
    <rect x={760} y={300} width={400} height={540} rx={20} fill="#EDE7D6" stroke={K.ink} strokeWidth={5} />
    {Array.from({ length: 12 }, (_, i) => <line key={i} x1={790 + i * 30} x2={790 + i * 30} y1={310} y2={830} stroke="#CFC7B0" strokeWidth={4} />)}
    <rect x={765} y={lerp(840, 420, w)} width={390} height={lerp(0, 420, w)} fill={K.waterD} opacity={0.45} />
    <path d="M900 420 L930 500 L890 580 L940 660 L900 740" stroke={K.ink} strokeWidth={7} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - r} />
    {Array.from({ length: 14 }, (_, i) => { const k = cl(d * 1.6 - i * 0.05); return <circle key={i} cx={lerp(915, 960 + (i % 5 - 2) * 30, k)} cy={lerp(580, 210, k)} r={8 + (i % 3) * 3} fill="#6B4E32" opacity={k > 0 ? 1 : 0} />; })}
    <circle cx={960} cy={190} r={60} fill={K.copper} stroke={K.ink} strokeWidth={4} />{txt(1100, 200, "MOTOR", 40, K.red, 700, SANS, "start")}
    {txt(420, 560, "PAPER", 60, K.ink)}{txt(420, 630, "+ WATER", 60, K.waterD)}
  </Svg></Pad></F>);
};

// laberinto: el agua prueba los caminos y se va por el más fácil
export const easy_path: H = ({ dur }) => {
  const t = useT(), k = pr(t, 0.2, 2.6);
  const walls = ["M300 300 H1620", "M300 800 H1620", "M700 300 V650", "M1100 450 V800", "M1400 300 V600"];
  return (<F dur={dur}><Blueprint><Svg>
    {walls.map((d, i) => <path key={i} d={d} stroke={K.cream} strokeWidth={14} fill="none" />)}
    <path d="M300 550 H600 Q650 550 650 700 L650 740 H1000 Q1050 740 1050 520 L1050 400 H1300 Q1350 400 1350 700 L1350 720 H1620" stroke={K.water} strokeWidth={30} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />
    <path d="M760 360 l 30 40 m -30 -40 l -30 40" stroke={K.red} strokeWidth={6} opacity={0.5} />
    {txt(960, 220, "THE EASIEST PATH", 54, K.cream)}
  </Svg></Blueprint></F>);
};

// el agua sube de golpe y arrastra la mata con ella
export const water_carry: H = ({ dur }) => {
  const t = useT(), D = dur / 30, k = eio(pr(t, 0.4, D - 0.4));
  return (<F dur={dur}><Blueprint><Svg>
    <rect x={860} y={120} width={200} height={860} fill="rgba(190,225,245,0.12)" stroke={K.cream} strokeWidth={5} />
    <rect x={866} y={lerp(980, 140, k)} width={188} height={lerp(0, 840, k)} fill={K.water} opacity={0.75} />
    <Rope x={960} y={lerp(700, 160, k)} L={160} w={44} t={t} />
    {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${900 + (i % 3) * 40} ${900 - ((t * 500 + i * 120) % 700)} l -16 26 m 16 -26 l 16 26`} stroke={K.white} strokeWidth={6} fill="none" />)}
    {txt(1420, 520, "WATER", 70, K.water)}{txt(1420, 590, "carries it up", 42, K.cream, 700, HAND)}
  </Svg></Blueprint></F>);
};

// pajita en un batido espeso: cuesta, cuesta… y de golpe pasa
export const milkshake: H = ({ dur }) => {
  const t = useT(), D = dur / 30, slow = pr(t, 0.3, D * 0.7), fast = pr(t, D * 0.7, D - 0.3);
  const lvl = lerp(0, 0.15, slow) + lerp(0, 0.75, eio(fast)), sec = Math.min(15, Math.floor(slow * 15));
  return (<F dur={dur}><Pad no="0521"><Svg>
    <path d="M760 300 L1160 300 L1110 920 L810 920 Z" fill="rgba(255,255,255,0.6)" stroke={K.ink} strokeWidth={6} />
    <clipPath id="cupIn"><path d="M766 306 L1154 306 L1105 914 L815 914 Z" /></clipPath>
    <rect x={760} y={lerp(340, 920, lvl)} width={400} height={700} fill="#E9C9A0" clipPath="url(#cupIn)" />
    <rect x={985} y={140} width={34} height={720} fill="#FFFFFF" stroke={K.red} strokeWidth={4} transform="rotate(8 1000 500)" />
    {fast > 0.4 && Array.from({ length: 4 }, (_, i) => <circle key={i} cx={1030 + i * 12} cy={130 - ((t * 400 + i * 40) % 120)} r={10} fill="#E9C9A0" />)}
    {txt(1480, 520, String(sec), 200, fast > 0 ? K.green : K.ink)}{txt(1480, 610, fast > 0 ? "and through!" : "seconds", 44, fast > 0 ? K.green : K.graphite, 700, HAND)}
  </Svg></Pad></F>);
};

// el tacho en corte: cada tirón agrega una capa
export const drum_window: H = ({ dur }) => {
  const t = useT(), L = [["THE BIG PLUG", HAIR_C], ["BITS", "#7B6B5A"], ["WATER", K.waterD]] as const;
  return (<F dur={dur}><Pad no="0522"><Svg>
    <path d="M700 260 L1220 260 L1180 940 L740 940 Z" fill="#C93A2E" stroke={K.ink} strokeWidth={6} />
    <rect x={800} y={340} width={320} height={560} rx={16} fill="#1C1C1C" />
    {L.map(([s, c], i) => { const k = eout(pr(t, 0.2 + i * 0.8, 0.7 + i * 0.8)); return (<g key={i} opacity={k}><rect x={806} y={900 - (i + 1) * 150 + (1 - k) * 60} width={308} height={146} fill={c} />{txt(1300, 840 - i * 150, `${i + 1} · ${s}`, 40, K.ink, 700, SANS, "start")}</g>); })}
  </Svg></Pad></F>);
};
const HAIR_C = "#3A2B22";

// la puerta de agua de la curva se abre al aspirar → hay que volver a llenarla
export const trap_gas: H = ({ dur }) => {
  const t = useT(), D = dur / 30, out = eio(pr(t, 0.3, 1.6)), gas = pr(t, 1.6, D);
  return (<F dur={dur}><Blueprint><Svg>
    <DrainModel x={900} y={250} s={1.1} trapWater={1 - out}>
      {Array.from({ length: 8 }, (_, i) => { const y = lerp(380, -260, ((gas * 1.4 + i * 0.12) % 1)); return <circle key={i} cx={-30 + Math.sin(i * 2 + t * 3) * 30} cy={y} r={22 + (i % 3) * 8} fill="#8A9A5B" opacity={gas > 0 ? 0.55 : 0} />; })}
    </DrainModel>
    {txt(1550, 520, gas > 0 ? "SEWER SMELL" : "WATER OUT", 56, gas > 0 ? "#B7C77F" : K.water)}
    {gas > 0.4 && txt(1550, 590, "run the tap to refill it", 38, K.cream, 700, HAND)}
  </Svg></Blueprint></F>);
};

// rosca macro: el destornillador aprieta de más y los filetes se aplastan
export const thread_strip: H = ({ dur }) => {
  const t = useT(), D = dur / 30, c = pr(t, 0.6, D * 0.65);
  const th = Array.from({ length: 10 }, (_, i) => { const y = 300 + i * 56, a = lerp(40, 4, cl(c * 1.5 - i * 0.05)); return `L${960 - 120 - a} ${y + 28} L${960 - 120} ${y + 56}`; }).join(" ");
  return (<F dur={dur}><Blueprint><Svg>
    <rect x={840} y={300} width={240} height={560} fill="#B9C0C6" />
    <path d={`M840 300 ${th}`} stroke={K.ink} strokeWidth={5} fill="none" /><path d={`M1080 300 ${th.replace(/L(\d+\.?\d*)/g, (_m, x) => `L${1920 - +x}`)}`} stroke={K.ink} strokeWidth={5} fill="none" />
    <g transform={`translate(960 ${230}) rotate(${t * 220})`}><rect x={-26} y={-26} width={52} height={52} fill="#B23A2E" /></g>
    {txt(960, 140, "DON'T CRANK IT", 60, K.cream)}
    {c > 0.8 && <><Stamp t={t} at={D * 0.65} x={1480} y={560} text="STRIPPED" size={66} /><Pencil t={t} at={D * 0.75} x={300} y={760} text="cover won't stay on" size={44} col={K.cream} /></>}
  </Svg></Blueprint></F>);
};

// cinta métrica: la hoja sale y cada pulgada es un paso con tilde (3 partes)
const PASOS = [["COVER OFF", "PIPE TAPED", "FILTER OUT"], ["½\" WATER", "15 SEC × 3"], ["HOT 2 MIN", "COVER ON"]];
export const tape_measure: H = ({ dur, v = 0 }) => {
  const t = useT(), D = dur / 30, S = PASOS[v] || PASOS[0], ext = eio(pr(t, 0.2, 1.0)), L = 1300 * ext;
  return (<F dur={dur}><Pad no="0523"><Svg>
    <rect x={180} y={420} width={260} height={260} rx={40} fill="#E8B930" stroke={K.ink} strokeWidth={6} /><circle cx={310} cy={550} r={60} fill="#C99A1E" />
    <rect x={430} y={600} width={L} height={60} fill="#F2D24A" stroke={K.ink} strokeWidth={4} />
    {Array.from({ length: Math.floor(L / 40) }, (_, i) => <line key={i} x1={440 + i * 40} x2={440 + i * 40} y1={600} y2={i % 4 ? 620 : 640} stroke={K.ink} strokeWidth={3} />)}
    {S.map((s, i) => { const x = 560 + i * (1100 / S.length) + 120; const k = pr(t, 1 + i * (D - 1.4) / S.length, 1.4 + i * (D - 1.4) / S.length); return (<g key={i} opacity={x < 430 + L ? 1 : 0}>
      {txt(x, 560, s, 46, K.ink)}<Check x={x} y={760} p={k} s={1.3} col={K.red} /></g>); })}
    {txt(1580, 320, ["1 – 3", "4 – 5", "6 – 7"][v] || "", 60, K.copper, 700, SANS)}
  </Svg></Pad></F>);
};

// marcas de marea en el vidrio: semanas de subir de a poco
export const tide_marks: H = ({ dur }) => {
  const t = useT(), D = dur / 30, n = Math.floor(lerp(0, 14, pr(t, 0.3, D - 0.6)));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#CFD6D6" }}><Svg>
    {Array.from({ length: 9 }, (_, i) => <line key={i} x1={0} x2={1920} y1={i * 130} y2={i * 130} stroke="#B7C0C0" strokeWidth={3} />)}
    <rect x={560} y={120} width={800} height={860} fill="rgba(235,245,250,0.55)" stroke="#9BA6A8" strokeWidth={12} />
    {Array.from({ length: n }, (_, i) => <path key={i} d={`M580 ${930 - i * 26 - i * i * 0.6} Q960 ${922 - i * 26 - i * i * 0.6} 1340 ${930 - i * 26 - i * i * 0.6}`} stroke="#A99E86" strokeWidth={4} fill="none" opacity={0.5 + i * 0.03} />)}
    {txt(1640, 500, `WEEK ${Math.max(1, Math.ceil(n / 3.5))}`, 50, K.navy, 700, SANS)}{txt(1640, 570, "slower… slower…", 40, K.graphite, 700, HAND)}
  </Svg></AbsoluteFill></F>);
};

// dos mangueras: la grande pierde por la junta, la chica sellada tira más
export const two_hoses: H = ({ dur }) => {
  const t = useT(), D = dur / 30;
  const hose = (y: number, w: number, leak: boolean, lab: string) => (<g>
    <rect x={260} y={y - w / 2} width={1400} height={w} rx={w / 2} fill={K.graphite} />
    {leak && <><rect x={940} y={y - w / 2 - 6} width={24} height={w + 12} fill="#8A8F93" />{Array.from({ length: 5 }, (_, i) => <circle key={i} cx={952 + Math.sin(i + t * 9) * 20} cy={y - w / 2 - 20 - ((t * 200 + i * 30) % 120)} r={7} fill="#9FD3F2" />)}</>}
    {Array.from({ length: 4 }, (_, i) => <path key={i} d={`M${300 + ((t * (leak ? 260 : 700) + i * 340) % 1340)} ${y} l -30 -20 m 30 20 l -30 20`} stroke={K.cream} strokeWidth={8} fill="none" />)}
    {txt(1780, y + 14, lab, 40, leak ? K.red : K.green, 700, SANS)}
  </g>);
  return (<F dur={dur}><Blueprint><Svg>{hose(400, 140, true, "BIG · LEAKS")}{hose(720, 80, false, "SMALL · SEALED")}{txt(960, 960, "THE SEAL BEATS THE MOTOR", 46, K.cream)}</Svg></Blueprint></F>);
};

// etiquetas colgando: la del plomero se da vuelta, la de tu garaje dice "nada"
export const price_tags: H = ({ dur }) => {
  const t = useT();
  const tag = (x: number, s: string, sub: string, col: string, at: number) => { const a = Math.sin((t - at) * 6) * 12 * Math.exp(-(t - at) * 1.5) * (t > at ? 1 : 0); return (<g transform={`translate(${x} 260) rotate(${a})`} opacity={t > at ? 1 : 0}>
    <line x1={0} y1={-200} x2={0} y2={0} stroke={K.ink} strokeWidth={3} />
    <path d="M-170 0 L170 0 L170 420 L-170 420 Z M-150 30 a 18 18 0 1 0 0.1 0" fill={K.white} stroke={K.ink} strokeWidth={5} />
    {txt(0, 200, s, 86, col)}{txt(0, 300, sub, 36, K.graphite, 700, HAND)}
  </g>); };
  return (<F dur={dur}><Pad no="0524"><Svg>{tag(640, "$175", "plumber", K.ink, 0.2)}{tag(1280, "$0", "already in the garage", K.red, 0.9)}</Svg></Pad></F>);
};

// ── ERRORES ─────────────────────────────────────────────
// tablero de 5 fusibles: en cada error salta el siguiente
const ERR = ["CHEMICALS FIRST", "BOILING WATER", "COAT HANGER", "LOST SCREW", "OTHER DRAINS"];
export const five_fuses: H = ({ dur, v = 0 }) => {
  const t = useT(), blow = t > 0.7, fl = blow && t < 1 ? 1 : 0;
  return (<F dur={dur}><AbsoluteFill style={{ background: fl ? "#FFF3C4" : "#2A2D31" }}><Svg>
    <rect x={260} y={180} width={1400} height={560} rx={20} fill="#4A4E54" stroke="#1A1C1F" strokeWidth={10} />
    {ERR.map((s, i) => { const x = 400 + i * 280, dead = i < v || (i === v && blow), cur = i === v; return (<g key={i}>
      <circle cx={x} cy={420} r={95} fill="#2E3135" /><circle cx={x} cy={420} r={78} fill={dead ? "#2A2015" : "rgba(220,235,245,0.7)"} stroke="#B8BEC4" strokeWidth={10} />
      {!dead && <path d={`M${x - 50} 420 q 25 -30 50 0 t 50 0`} stroke="#B87333" strokeWidth={6} fill="none" />}
      {cur && blow && <circle cx={x} cy={420} r={lerp(80, 160, pr(t, 0.7, 1))} fill="none" stroke="#FFD34E" strokeWidth={8} opacity={1 - pr(t, 0.7, 1.1)} />}
      {txt(x, 600, String(i + 1), 50, cur ? K.red : "#9AA0A6", 700, SANS)}
    </g>); })}
    {txt(960, 900, `MISTAKE ${v + 1}`, 40, K.copper, 700, SANS)}
    <g opacity={cl((t - 0.9) * 3)}>{txt(960, 990, ERR[v] || "", 82, K.cream)}</g>
  </Svg></AbsoluteFill></F>);
};

// tarjeta roja de peligro atada a la canilla
export const danger_tag: H = ({ dur }) => {
  const t = useT(), sw = Math.sin(t * 3) * 4 * Math.exp(-t * 0.6), a = eout(pr(t, 0.1, 0.6));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#D9DDDC" }}><Svg>
    <rect x={300} y={150} width={420} height={70} rx={30} fill="#C9CED2" stroke={K.ink} strokeWidth={5} /><rect x={640} y={150} width={80} height={240} rx={20} fill="#C9CED2" stroke={K.ink} strokeWidth={5} />
    <g transform={`translate(680 390) rotate(${sw - 12 + (1 - a) * 40})`}>
      <path d="M0 0 C 60 60 80 80 120 120" stroke={K.ink} strokeWidth={4} fill="none" />
      <g transform="translate(120 120) rotate(12)"><rect x={0} y={0} width={700} height={460} rx={20} fill={K.red} stroke={K.ink} strokeWidth={5} /><circle cx={50} cy={50} r={16} fill={K.white} />
        {txt(350, 110, "DANGER", 80, K.white)}{txt(350, 200, "CHEMICALS IN THE DRAIN", 36, K.white, 700, SANS)}
        {["✕ DON'T PLUNGE", "✕ DON'T VACUUM"].map((s, i) => <g key={i} opacity={cl((t - 1 - i * 0.5) * 3)}>{txt(350, 300 + i * 70, s, 46, "#FFE8C4", 700, SANS)}</g>)}
      </g>
    </g>
  </Svg></AbsoluteFill></F>);
};

// junta de plástico: a 212° se ablanda y cede; a 120° queda
export const joint_sag: H = ({ dur }) => {
  const t = useT(), D = dur / 30, s = eio(pr(t, 1, D - 1));
  const elbow = (x: number, sag: number, temp: string, hot: boolean) => (<g transform={`translate(${x} 300)`}>
    <rect x={-60} y={0} width={120} height={300} fill="#ECEAE2" stroke={K.ink} strokeWidth={5} />
    <path d={`M-60 300 Q-60 ${430 + sag * 60} ${80 + sag * 20} ${430 + sag * 80} L${360} ${440 + sag * 120} L360 ${560 + sag * 120} L${80 + sag * 10} ${550 + sag * 80} Q60 ${520 + sag * 40} 60 300 Z`} fill="#ECEAE2" stroke={K.ink} strokeWidth={5} />
    {hot && Array.from({ length: 4 }, (_, i) => <path key={i} d={`M${-40 + i * 26} -30 q 14 -30 0 -60 q -14 -30 0 -60`} stroke="#E8C9B2" strokeWidth={6} fill="none" opacity={0.7} />)}
    {txt(140, -100, temp, 70, hot ? K.red : K.waterD)}
    {sag > 0.6 && <ellipse cx={360} cy={620 + sag * 120} rx={14} ry={20} fill={K.water} />}
  </g>);
  return (<F dur={dur}><Pad no="0525"><Svg>{elbow(420, s, "212°", true)}{elbow(1160, 0, "120°", false)}{s > 0.6 && <Stamp t={t} at={D * 0.7} x={620} y={950} text="SAGS" size={70} />}{s > 0.6 && <Check x={1300} y={950} p={pr(t, D * 0.75, D * 0.85)} s={1.4} />}</Svg></Pad></F>);
};

// el alambre empuja la mata más abajo
export const hanger_poke: H = ({ dur }) => {
  const t = useT(), D = dur / 30, k = eio(pr(t, 0.2, D - 0.4));
  return (<F dur={dur}><Blueprint><Svg>
    <DrainModel x={760} y={200} s={1.05}><Rope x={-30} y={lerp(20, 260, k)} L={200} w={46} t={t} fold={k * 0.6} />
      <path d={`M-30 ${lerp(-300, -40, k)} L-30 ${lerp(0, 250, k)} q 10 20 -10 30`} stroke="#B8BEC4" strokeWidth={8} fill="none" /></DrainModel>
    <path d="M1500 300 V700 M1440 620 L1500 700 L1560 620" stroke={K.red} strokeWidth={22} fill="none" strokeLinecap="round" />
    {txt(1500, 800, "DEEPER", 60, K.red)}
  </Svg></Blueprint></F>);
};

// el tornillo perdido en la curva se vuelve un imán de pelos
export const screw_magnet: H = ({ dur }) => {
  const t = useT(), D = dur / 30, f = eout(pr(t, 0.2, 1.2)), g = pr(t, 1.6, D - 0.3);
  return (<F dur={dur}><Blueprint><Svg>
    <DrainModel x={760} y={180} s={1.05}>
      <g transform={`translate(80 ${lerp(-120, 470, f)}) rotate(${f * 400})`}><rect x={-8} y={-22} width={16} height={36} fill="#C9CED2" /><rect x={-16} y={-28} width={32} height={8} fill="#C9CED2" /></g>
      {g > 0 && [0, 1, 2].map((i) => <ellipse key={i} cx={80} cy={470} rx={40 + i * 40 + Math.sin(t * 4) * 6} ry={20 + i * 18} fill="none" stroke={K.copper} strokeWidth={3} strokeDasharray="8 8" opacity={0.7} />)}
      {Array.from({ length: 9 }, (_, i) => { const k = cl(g * 1.5 - i * 0.06); const a = i * 0.7; return <path key={i} d={`M${80 + Math.cos(a) * lerp(200, 20, k)} ${470 + Math.sin(a) * lerp(120, 10, k)} q 20 10 30 -10`} stroke="#3A2B22" strokeWidth={4} fill="none" opacity={k > 0 ? 1 : 0} />; })}
    </DrainModel>
    {txt(1520, 520, "A HAIR MAGNET", 54, K.copper)}
  </Svg></Blueprint></F>);
};

// los arroyos de la casa se juntan en el río a la calle; un dique lo devuelve al más bajo
export const river: H = ({ dur }) => {
  const t = useT(), D = dur / 30, dam = pr(t, D * 0.5, D * 0.6), back = pr(t, D * 0.6, D - 0.2);
  const S = [["SINK", 300], ["TOILET", 520], ["WASHER", 740], ["SHOWER", 960]] as const;
  return (<F dur={dur}><AbsoluteFill style={{ background: "#E9E3D0" }}><Svg>
    <path d="M200 980 C 700 960 1200 990 1800 940" stroke={K.waterD} strokeWidth={70} fill="none" />{txt(1700, 1040, "TO THE STREET", 30, K.navy, 700, SANS)}
    {S.map(([s, y], i) => <g key={s}><path d={`M${200 + i * 40} ${y} C 700 ${y + 60} ${900 + i * 80} ${y + 200} ${1100 + i * 60} 960`} stroke={K.water} strokeWidth={22} fill="none" strokeDasharray="30 18" strokeDashoffset={-t * 120} />{txt(170 + i * 40, y + 10, s, 34, i === 3 ? K.red : K.navy, 700, SANS, "end")}</g>)}
    {dam > 0 && <rect x={1500} y={880} width={40} height={180} fill="#6B4E32" opacity={dam} />}
    {back > 0 && <path d="M1100 960 C 900 1000 500 1000 360 960" stroke={K.red} strokeWidth={10} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - back} markerEnd="" />}
    {back > 0.5 && txt(960, 140, "it backs up into the lowest drain", 50, K.red, 700, HAND)}
    {back === 0 && txt(960, 140, "THE MAIN LINE", 60, K.navy)}
  </Svg></AbsoluteFill></F>);
};

// ── CASOS ───────────────────────────────────────────────
// fichero giratorio: cada caso es una ficha que cae al frente
const CASOS = [["SHOWER STALL", "one screw"], ["OLD CHICAGO HOUSE", "drum trap"], ["SLOW SHOWER", "no hair"], ["COMES BACK MONTHLY", "hair isn't stopped"]];
export const rolodex: H = ({ dur, v = 0 }) => {
  const t = useT(), f = eout(pr(t, 0.1, 0.7)), [a, b] = CASOS[v] || CASOS[0];
  return (<F dur={dur}><Pad no="0526"><Svg>
    <rect x={560} y={820} width={800} height={60} rx={10} fill={K.graphite} /><circle cx={600} cy={700} r={50} fill={K.graphite} /><circle cx={1320} cy={700} r={50} fill={K.graphite} />
    {[3, 2, 1].map((i) => <rect key={i} x={640} y={330 + i * 40} width={640} height={420} rx={16} fill="#F7F2E4" stroke="#B9AF95" strokeWidth={3} transform={`rotate(${-i * 4} 960 760)`} />)}
    <g transform={`rotate(${lerp(-80, 0, f)} 960 760)`}><rect x={640} y={300} width={640} height={440} rx={16} fill={K.white} stroke={K.ink} strokeWidth={4} />
      <rect x={640} y={300} width={640} height={70} rx={16} fill={K.navy} />{txt(960, 350, `CASE ${v + 1}`, 34, K.copper, 700, SANS)}
      {txt(960, 500, a, a.length > 14 ? 50 : 62, K.ink)}{txt(960, 600, b, 50, K.red, 700, HAND)}</g>
  </Svg></Pad></F>);
};

// página de catálogo de ferretería de 1928: el ítem "DRUM TRAP" se ilumina y el sello de fecha marca la época
export const drum_trap: H = ({ dur }) => {
  const t = useT(), D = dur / 30, slide = eout(pr(t, 0, 0.8)), hi = pr(t, 1, 1.6);
  const items = ["BASIN COCK", "S-TRAP, BRASS", "DRUM TRAP, LEAD", "TUB SPOUT", "STOP VALVE"];
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2A2420" }}><Svg>
    <g transform={`translate(${lerp(-900, 0, slide)} 0) rotate(-2 960 540)`}>
      <rect x={420} y={60} width={1080} height={960} fill="#E9DDBF" stroke="#8C7A55" strokeWidth={6} />
      {txt(960, 150, "PLUMBERS' SUPPLIES — 1928", 50, "#4A3B28", 700, SLAB)}<line x1={480} x2={1440} y1={175} y2={175} stroke="#4A3B28" strokeWidth={3} />
      {items.map((s, i) => { const on = i === 2; return (<g key={s} transform={`translate(0 ${250 + i * 150})`}>
        {on && <rect x={470} y={-60} width={980} height={130} fill="#F2C94C" opacity={0.55 * hi} />}
        <rect x={500} y={-45} width={110} height={100} fill="none" stroke="#4A3B28" strokeWidth={3} />
        {on ? <g><rect x={520} y={-30} width={70} height={70} rx={10} fill="#8E949A" stroke="#4A3B28" strokeWidth={3} /><line x1={500} x2={520} y1={5} y2={5} stroke="#4A3B28" strokeWidth={8} /><line x1={590} x2={610} y1={25} y2={25} stroke="#4A3B28" strokeWidth={8} /></g> : <circle cx={555} cy={5} r={28} fill="none" stroke="#7B6A4E" strokeWidth={3} />}
        {txt(650, 18, `No. ${410 + i * 7}  ${s}`, 40, "#4A3B28", on ? 700 : 500, SLAB, "start")}
        {txt(1420, 18, ["$1.10", "$0.85", "$1.45", "$2.20", "$0.95"][i], 40, "#4A3B28", 500, SLAB, "end")}
      </g>); })}
    </g>
    <Stamp t={t} at={1.8} x={1380} y={860} text="BEFORE 1950" size={64} rot={-10} />
    {txt(960, 1060, "UNDER OLD TUBS: A ROUND CAN", 34, K.cream, 700, SANS, "middle", cl((t - 2.2) * 3))}
  </Svg></AbsoluteFill></F>);
};

// granos de bicarbonato y sal ruedan por el caño y raspan la película gris
export const scrub_grains: H = ({ dur }) => {
  const t = useT(), D = dur / 30, k = pr(t, 1, D - 0.3), x = lerp(200, 1720, k);
  return (<F dur={dur}><Blueprint><Svg>
    <rect x={160} y={380} width={1600} height={320} fill="rgba(190,225,245,0.1)" stroke={K.cream} strokeWidth={6} />
    <rect x={Math.max(166, x)} y={386} width={Math.max(0, 1754 - x)} height={30} fill="#8E918C" /><rect x={Math.max(166, x)} y={664} width={Math.max(0, 1754 - x)} height={30} fill="#8E918C" />
    {Array.from({ length: 26 }, (_, i) => <rect key={i} x={x - 40 - (i * 37) % 200} y={420 + (i * 61) % 240} width={14} height={14} transform={`rotate(${t * 300 + i * 30} ${x - 33 - (i * 37) % 200} ${427 + (i * 61) % 240})`} fill={i % 2 ? K.white : "#E9E2CF"} />)}
    {txt(960, 260, k > 0 ? "baking soda + salt scrub it off" : "SOFT GRAY FILM", 54, k > 0 ? K.cream : "#B8BAB4", 700, k > 0 ? HAND : SLAB)}
  </Svg></Blueprint></F>);
};

// velcro: los ganchos del palito agarran los rulos de pelo y suben
export const velcro: H = ({ dur }) => {
  const t = useT(), D = dur / 30, up = eio(pr(t, D * 0.55, D - 0.3)), tw = pr(t, D * 0.35, D * 0.55);
  return (<F dur={dur}><Pad no="0527"><Svg>
    <g transform={`translate(0 ${-up * 300})`}>
      <rect x={300} y={500} width={1320} height={60} fill="#2E2E2E" />
      {Array.from({ length: 22 }, (_, i) => <path key={i} d={`M${340 + i * 58} 560 l 0 50 q 0 20 -18 14`} stroke="#2E2E2E" strokeWidth={8} fill="none" transform={`rotate(${tw * 10} ${340 + i * 58} 560)`} />)}
      {Array.from({ length: 22 }, (_, i) => <ellipse key={i} cx={330 + i * 58} cy={640} rx={26} ry={20} fill="none" stroke="#3A2B22" strokeWidth={5} opacity={tw > 0.3 || up > 0 ? 1 : 0.5} />)}
    </g>
    {up === 0 && Array.from({ length: 22 }, (_, i) => <ellipse key={i} cx={330 + i * 58} cy={660} rx={26} ry={20} fill="none" stroke="#3A2B22" strokeWidth={5} opacity={tw > 0.3 ? 0 : 0.6} />)}
    {txt(960, 300, up > 0 ? "PULL UP SLOWLY" : tw > 0 ? "TWIST" : "PUSH DOWN SLOWLY", 64, up > 0 ? K.red : K.ink)}
  </Svg></Pad></F>);
};

// ── RUTINA / HISTORIA ───────────────────────────────────
// órbitas de frecuencia alrededor del desagüe
export const orbits: H = ({ dur, v = 0 }) => {
  const t = useT();
  const O = [["AFTER EVERY SHOWER", 200, 3], ["EVERY WEEK", 330, 1.2], ["FIRST SUNDAY · THE CUP", 460, 0.5]] as const;
  return (<F dur={dur}><Blueprint><Svg>
    <circle cx={960} cy={560} r={80} fill="#C9CED2" stroke={K.ink} strokeWidth={5} /><line x1={900} x2={1020} y1={560} y2={560} stroke={K.ink} strokeWidth={10} /><line x1={960} x2={960} y1={500} y2={620} stroke={K.ink} strokeWidth={10} />
    {O.map(([s, r, sp], i) => { const hi = (v === 0 && i === 0) || (v === 1 && i === 2); const a = t * sp + i * 2; return (<g key={i} opacity={hi ? 1 : 0.35}>
      <ellipse cx={960} cy={560} rx={r * 1.6} ry={r * 0.8} fill="none" stroke={hi ? K.copper : K.cream} strokeWidth={hi ? 6 : 3} strokeDasharray="12 10" />
      <circle cx={960 + Math.cos(a) * r * 1.6} cy={560 + Math.sin(a) * r * 0.8} r={hi ? 26 : 16} fill={hi ? K.copper : K.cream} />
      {hi && txt(960, 560 - r * 0.8 - 30, s, 46, K.copper, 700, SANS)}
    </g>); })}
  </Svg></Blueprint></F>);
};

// torta: casi todo el pelo suelto sale en el cepillo
export const brush_pie: H = ({ dur }) => {
  const t = useT(), k = eio(pr(t, 0.2, 1.6)), a = k * 0.8 * Math.PI * 2;
  const arc = (a0: number, a1: number) => `M960 560 L${960 + Math.cos(a0) * 300} ${560 + Math.sin(a0) * 300} A300 300 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${960 + Math.cos(a1) * 300} ${560 + Math.sin(a1) * 300} Z`;
  return (<F dur={dur}><Pad no="0528"><Svg>
    <circle cx={960} cy={560} r={300} fill="#D9D2BE" stroke={K.ink} strokeWidth={5} />
    {k > 0 && <path d={arc(-Math.PI / 2, -Math.PI / 2 + a)} fill={K.copper} stroke={K.ink} strokeWidth={5} />}
    {txt(1460, 460, "IN THE BRUSH", 50, K.copper)}{txt(460, 700, "DRAIN", 50, K.graphite)}
  </Svg></Pad></F>);
};

// teléfono a disco que suena + nota de llamada a lápiz
export const phone_call: H = ({ dur }) => {
  const t = useT(), D = dur / 30, ring = t < 2 ? Math.sin(t * 40) * 4 : 0;
  return (<F dur={dur}><Pad no="1979"><Svg>
    <g transform={`translate(520 600) rotate(${ring})`}>
      <path d="M-240 120 Q-260 -60 -120 -80 L120 -80 Q260 -60 240 120 Z" fill="#2E2E2E" />
      <circle cx={0} cy={30} r={110} fill="#E9E3D0" stroke="#2E2E2E" strokeWidth={6} />{Array.from({ length: 10 }, (_, i) => <circle key={i} cx={Math.cos(i * 0.55 - 2) * 78} cy={30 + Math.sin(i * 0.55 - 2) * 78} r={16} fill="#2E2E2E" />)}
      <path d={`M-260 ${-110 - (t < 2 ? Math.abs(ring) * 4 : 0)} Q0 -200 260 -110 L240 -70 Q0 -150 -240 -70 Z`} fill="#2E2E2E" />
    </g>
    {t < 2 && [0, 1].map((i) => <path key={i} d={`M${790 + i * 30} ${420 - i * 20} q 30 40 0 80`} stroke={K.red} strokeWidth={6} fill="none" opacity={Math.sin(t * 20 + i) > 0 ? 1 : 0.3} />)}
    <Pencil t={t} at={0.8} x={980} y={400} text="1979 · Toledo, Ohio" size={60} col={K.ink} />
    <Pencil t={t} at={1.8} x={980} y={500} text="apprentice, age 19" size={52} col={K.graphite} />
    <Pencil t={t} at={2.8} x={980} y={600} text="boss: GUS" size={60} col={K.red} />
  </Svg></Pad></F>);
};

// el anillo: v0 se resbala del dedo y cae; v1 su viaje trampa → lata → cloaca
export const ring_fall: H = ({ dur, v = 0 }) => {
  const t = useT(), D = dur / 30;
  const Ring = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => <g transform={`translate(${x} ${y}) scale(${s})`}><ellipse rx={34} ry={14} fill="none" stroke="#E2B84B" strokeWidth={10} /><circle cx={0} cy={-16} r={9} fill="#DDF3FF" stroke="#B0C8D8" strokeWidth={2} /></g>;
  if (v === 0) { const k = pr(t, 0.6, 1.8), sl = eio(pr(t, 0.1, 0.6));
    return (<F dur={dur}><AbsoluteFill style={{ background: "#DCE3E3" }}><Svg>
      <path d="M300 300 Q700 250 980 330 L990 380 Q700 320 300 380 Z" fill="#E8C3A8" stroke={K.ink} strokeWidth={4} />
      <ellipse cx={960} cy={900} rx={160} ry={40} fill="#B8BEC4" stroke={K.ink} strokeWidth={4} /><ellipse cx={960} cy={900} rx={70} ry={16} fill="#1C1C1C" />
      <Ring x={lerp(880, 990, sl) + Math.sin(k * 8) * 20 * (1 - k)} y={lerp(350, 900, k * k)} s={1 - k * 0.5} />
      {k >= 1 && <Stamp t={t} at={1.8} x={1400} y={520} text="GONE" size={80} />}
    </Svg></AbsoluteFill></F>); }
  const P = [[400, 300, "TRAP"], [800, 560, "DRUM"], [1250, 760, "MAIN"], [1700, 900, "GONE"]] as const, k = pr(t, 0.3, D - 0.6), seg = Math.min(2.999, k * 3), i0 = Math.floor(seg), f = seg - i0;
  return (<F dur={dur}><Blueprint><Svg>
    <path d={`M${P.map((p) => `${p[0]} ${p[1]}`).join(" L")}`} stroke={K.cream} strokeWidth={8} strokeDasharray="20 14" fill="none" />
    {P.map(([x, y, s], i) => <g key={i} opacity={k * 3 >= i ? 1 : 0.35}><circle cx={x} cy={y} r={20} fill={i === 3 ? K.red : K.copper} />{txt(x, y - 50, s, 44, i === 3 ? K.red : K.cream, 700, SANS)}</g>)}
    <Ring x={lerp(P[i0][0], P[i0 + 1][0], f)} y={lerp(P[i0][1], P[i0 + 1][1], f) + 40} s={1.3} />
  </Svg></Blueprint></F>);
};

// la malla fina en la boca de la manguera atrapa el anillo en 10 segundos
export const stocking: H = ({ dur }) => {
  const t = useT(), D = dur / 30, k = pr(t, 0.4, D - 1), s = Math.min(10, Math.floor(k * 10) + 1);
  return (<F dur={dur}><Pad no="1979"><Svg>
    <rect x={200} y={480} width={900} height={160} rx={70} fill="#2E2E2E" />
    <rect x={1080} y={460} width={70} height={200} rx={20} fill="rgba(240,240,236,0.85)" stroke="#9B9B95" strokeWidth={3} />
    {Array.from({ length: 10 }, (_, i) => <line key={i} x1={1082} x2={1148} y1={470 + i * 19} y2={470 + i * 19} stroke="#B0B0A8" strokeWidth={2} />)}
    <rect x={1030} y={450} width={24} height={220} rx={8} fill={K.red} />
    <g transform={`translate(${lerp(1600, 1170, eio(k))} 560) rotate(80)`}><ellipse rx={34} ry={14} fill="none" stroke="#E2B84B" strokeWidth={10} /></g>
    {txt(1500, 300, String(s), 150, K.ink)}{txt(1500, 370, "seconds", 40, K.graphite, 700, HAND)}
    {k >= 1 && <Check x={1170} y={360} p={pr(t, D - 1, D - 0.6)} s={1.5} />}
  </Svg></Pad></F>);
};

// ── PREGUNTAS ───────────────────────────────────────────
// casa de muñecas en corte: la curva de arriba está dentro del piso; la sierra corta el techo de abajo
export const trap_reach: H = ({ dur }) => {
  const t = useT(), D = dur / 30, c = pr(t, D * 0.4, D - 0.4);
  return (<F dur={dur}><AbsoluteFill style={{ background: "#E9E3D0" }}><Svg>
    <path d="M360 180 L960 60 L1560 180 Z" fill="#8E5A3C" stroke={K.ink} strokeWidth={5} />
    <rect x={400} y={180} width={1120} height={800} fill="#F5EFE0" stroke={K.ink} strokeWidth={6} />
    <rect x={400} y={540} width={1120} height={90} fill="#C9B79A" stroke={K.ink} strokeWidth={4} />
    <path d="M1100 540 L1100 580 Q1100 610 1130 610 Q1160 610 1160 580 L1160 560 L1300 560" stroke={K.waterD} strokeWidth={14} fill="none" />
    <rect x={1000} y={420} width={200} height={120} fill={K.porcelain} stroke={K.ink} strokeWidth={4} />{txt(1100, 380, "UPSTAIRS SHOWER", 30, K.navy, 700, SANS)}
    <path d="M1020 632 L1240 632" stroke={K.red} strokeWidth={6} strokeDasharray="14 10" pathLength={1} strokeDashoffset={0} opacity={0.5} />
    <path d="M1020 632 L1240 632" stroke={K.red} strokeWidth={10} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - c} />
    <g transform={`translate(${lerp(1020, 1240, c)} 660)`}><path d="M-80 0 L80 0 L80 40 L-80 40 Z" fill="#B8BEC4" stroke={K.ink} strokeWidth={3} /><rect x={80} y={0} width={60} height={60} rx={10} fill="#8E5A3C" /></g>
    {txt(700, 820, "THE ROOM BELOW", 36, K.navy, 700, SANS)}
  </Svg></AbsoluteFill></F>);
};

// carrera de dos carriles: la soda cáustica se arrastra, la aspiradora llega
export const race: H = ({ dur }) => {
  const t = useT(), D = dur / 30, a = pr(t, 0.3, D * 0.5), b = pr(t, 0.3, D * 8);
  const lane = (y: number, s: string, k: number, col: string) => (<g><rect x={300} y={y} width={1300} height={120} fill="rgba(255,255,255,0.08)" stroke={K.cream} strokeWidth={3} />
    <rect x={300} y={y} width={1300 * k} height={120} fill={col} opacity={0.7} />{txt(260, y + 76, s, 44, K.cream, 700, SANS, "end")}
    {k >= 1 && txt(1660, y + 76, "DONE", 44, col, 700, SANS, "start")}</g>);
  return (<F dur={dur}><Blueprint><Svg>
    <line x1={1600} x2={1600} y1={300} y2={800} stroke={K.cream} strokeWidth={8} strokeDasharray="20 10" />
    {lane(360, "LYE", b, K.red)}{lane(620, "SHOP VAC", a, K.copper)}
    {txt(960, 220, "SLOWLY", 60, K.red)}{b < 1 && txt(300 + 1300 * b + 30, 440, "…days", 40, K.cream, 700, HAND, "start")}
  </Svg></Blueprint></F>);
};

// receta en un bol: jabón + agua dura = pasta blanca
export const recipe_bowl: H = ({ dur }) => {
  const t = useT(), D = dur / 30, mix = pr(t, D * 0.5, D - 0.5);
  return (<F dur={dur}><Pad no="0529"><Svg>
    <path d="M660 520 Q960 900 1260 520 Z" fill={K.white} stroke={K.ink} strokeWidth={6} />
    <ellipse cx={960} cy={540} rx={260} ry={40} fill={mix > 0 ? "#F4F2EA" : "rgba(143,193,221,0.6)"} />
    {mix > 0 && Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${840 + i * 40} 540 q 20 ${-20 - (i % 2) * 10} 40 0`} stroke="#D8D4C8" strokeWidth={6} fill="none" transform={`rotate(${t * 60} 960 540)`} />)}
    <g opacity={1 - mix} transform={`translate(${lerp(500, 900, pr(t, 0.3, 1.2))} ${lerp(300, 500, pr(t, 0.3, 1.2))})`}><rect x={-70} y={-40} width={140} height={80} rx={24} fill="#F2E0C8" stroke={K.ink} strokeWidth={4} />{txt(0, 10, "SOAP", 28, K.ink, 700, SANS)}</g>
    {Array.from({ length: 5 }, (_, i) => { const k = pr(t, 1.2 + i * 0.25, 1.6 + i * 0.25); return <ellipse key={i} cx={1040 + i * 14} cy={lerp(220, 520, k)} rx={10} ry={15} fill={K.waterD} opacity={k > 0 && k < 1 ? 1 : 0} />; })}
    {txt(1100, 200, "HARD WATER", 34, K.waterD, 700, SANS)}
    {mix > 0.3 && txt(960, 960, "= SOAP SCUM", 70, K.red)}
  </Svg></Pad></F>);
};

// caño caliente fluye; frío, se asienta la película blanca
export const grease_pan: H = ({ dur }) => {
  const t = useT(), D = dur / 30, s = pr(t, 0.4, D - 0.3);
  const pipe = (y: number, hot: boolean) => (<g><rect x={300} y={y} width={1320} height={160} fill="rgba(190,225,245,0.1)" stroke={K.cream} strokeWidth={5} />
    {Array.from({ length: 8 }, (_, i) => <circle key={i} cx={300 + ((t * (hot ? 500 : 120) + i * 170) % 1320)} cy={y + 80 + Math.sin(i) * 30} r={14} fill="#F2EFE4" opacity={0.8} />)}
    {!hot && <rect x={306} y={y + 130 - 30 * s} width={1308} height={30 * s} fill="#F2EFE4" />}
    {txt(260, y + 95, hot ? "HOT" : "COLD", 50, hot ? K.red : K.waterD, 700, SANS, "end")}</g>);
  return (<F dur={dur}><Blueprint><Svg>{pipe(300, true)}{pipe(640, false)}{s > 0.6 && txt(1420, 920, "it sets", 46, K.cream, 700, HAND)}</Svg></Blueprint></F>);
};

// enzimas: puntitos que comen la película durante tres noches
export const enzyme_eat: H = ({ dur }) => {
  const t = useT(), D = dur / 30, n = Math.min(3, Math.floor(pr(t, 0.3, D - 0.3) * 3) + 1), k = pr(t, 0.3, D - 0.3);
  return (<F dur={dur}><AbsoluteFill style={{ background: "#101A2A" }}><Svg>
    {[0, 1, 2].map((i) => <g key={i} opacity={i < n ? 1 : 0.25}><circle cx={1500 + i * 120} cy={180} r={40} fill="#E9E3D0" /><circle cx={1500 + i * 120 + 18 - i * 12} cy={170} r={36} fill="#101A2A" />{txt(1500 + i * 120, 260, `night ${i + 1}`, 24, "#9FB7CF", 700, SANS)}</g>)}
    <rect x={200} y={420} width={1520} height={300} fill="rgba(190,225,245,0.08)" stroke="#9FB7CF" strokeWidth={4} />
    <rect x={206} y={426} width={1508 * (1 - k)} height={36} fill="#8E918C" transform={`translate(${1508 * k} 0)`} />
    {Array.from({ length: 12 }, (_, i) => { const x = 206 + 1508 * k + Math.sin(t * 5 + i) * 30 - 20; return <path key={i} d={`M${x} ${470 + i * 18} l 14 -8 a 16 16 0 1 0 0 16 Z`} fill="#7FD6A0" opacity={k < 1 ? 0.9 : 0} transform={`rotate(180 ${x} ${470 + i * 18})`} />; })}
    {txt(960, 860, "ENZYMES EAT THE SOAP FILM", 50, "#7FD6A0", 700, SANS)}
  </Svg></AbsoluteFill></F>);
};

// flechas bumerán: empujás y todo vuelve hacia arriba
export const blow_back: H = ({ dur }) => {
  const t = useT(), D = dur / 30, d = eio(pr(t, 0.2, 1.4)), u = eio(pr(t, 1.6, D - 0.6));
  return (<F dur={dur}><Blueprint><Svg>
    <DrainModel x={960} y={560} s={0.9} />
    <path d={`M960 ${lerp(120, 480, d)} l -40 -60 m 40 60 l 40 -60`} stroke={K.cream} strokeWidth={14} fill="none" opacity={1 - u} />
    {u > 0 && ["WATER", "SOAP", "HAIR"].map((s, i) => { const a = -Math.PI / 2 + (i - 1) * 0.5; const r = lerp(0, 380, u); return (<g key={s}><path d={`M960 520 Q${960 + Math.cos(a) * r * 0.5 + (i - 1) * 120} ${520 - r * 0.9} ${960 + Math.cos(a) * r} ${520 + Math.sin(a) * r}`} stroke={i === 2 ? "#5A4030" : i === 1 ? "#F2EFE4" : K.water} strokeWidth={12} fill="none" />{txt(960 + Math.cos(a) * r, 520 + Math.sin(a) * r - 30, s, 38, K.cream, 700, SANS)}</g>); })}
    {u > 0.7 && txt(1600, 900, "goggles on", 50, K.red, 700, HAND)}
  </Svg></Blueprint></F>);
};

// desagüe lineal: la rejilla larga se levanta, abajo la canaleta y el agujerito en la punta
export const linear_drain: H = ({ dur }) => {
  const t = useT(), D = dur / 30, up = eio(pr(t, 0.4, 1.8)), hole = pr(t, 2.4, 3.2);
  return (<F dur={dur}><AbsoluteFill style={{ background: "#D4D9D9" }}><Svg>
    {Array.from({ length: 12 }, (_, i) => <line key={i} x1={i * 160} x2={i * 160} y1={0} y2={1080} stroke="#BFC6C6" strokeWidth={3} />)}
    <rect x={260} y={500} width={1400} height={110} fill="#5D6266" /><rect x={276} y={520} width={1368} height={70} fill="#3E4246" />
    <ellipse cx={1580} cy={555} rx={36} ry={28} fill="#111" stroke={hole > 0 ? K.red : "none"} strokeWidth={6} />
    <g transform={`translate(0 ${-up * 260}) rotate(${-up * 4} 960 555)`}><rect x={250} y={495} width={1420} height={120} fill="#C9CED2" stroke={K.ink} strokeWidth={4} />{Array.from({ length: 34 }, (_, i) => <rect key={i} x={280 + i * 40} y={520} width={20} height={70} fill="#8E949A" />)}</g>
    {hole > 0 && <Pencil t={t} at={2.6} x={1300} y={820} text="the small hole" size={56} col={K.red} to={[1580, 590]} />}
    {txt(960, 200, "LINEAR DRAIN", 60, K.navy)}
  </Svg></AbsoluteFill></F>);
};

// tres puertas: pelo, película, objeto duro; se abre la tercera → una tapita
export const three_causes: H = ({ dur }) => {
  const t = useT(), D = dur / 30, o = eio(pr(t, D * 0.45, D * 0.75));
  const S = ["HAIR", "SOAP FILM", "SOMETHING HARD"];
  return (<F dur={dur}><Pad no="0530"><Svg>
    {S.map((s, i) => { const x = 420 + i * 540, op = i === 2 ? o : 0; return (<g key={s}>
      <rect x={x - 170} y={260} width={340} height={600} fill="#2E2E2E" />
      {i === 2 && <g opacity={o}><circle cx={x} cy={600} r={70} fill="#C93A2E" stroke={K.ink} strokeWidth={4} />{Array.from({ length: 16 }, (_, j) => <line key={j} x1={x + Math.cos(j * 0.39) * 70} y1={600 + Math.sin(j * 0.39) * 70} x2={x + Math.cos(j * 0.39) * 80} y2={600 + Math.sin(j * 0.39) * 80} stroke={K.ink} strokeWidth={4} />)}</g>}
      <g transform={`translate(${x - 170} 260) scale(${1 - op * 0.85} 1)`}><rect x={0} y={0} width={340} height={600} fill="#8E5A3C" stroke={K.ink} strokeWidth={5} /><circle cx={290} cy={300} r={14} fill="#D7B46A" /></g>
      {txt(x, 930, s, 44, i === 2 ? K.red : K.ink, 700, SANS)}
    </g>); })}
  </Svg></Pad></F>);
};

// repaso: azulejos del baño que se dan vuelta y muestran cada paso (2 partes)
const REC = [["SHOP VAC OUTSIDE", "SAFETY OUTLET", "DRY FLOOR"], ["OVERFLOW TAPED", "WET CLOTH", "½\" OF WATER"]];
export const recap_tiles: H = ({ dur, v = 0 }) => {
  const t = useT(), D = dur / 30, S = REC[v] || REC[0];
  return (<F dur={dur}><AbsoluteFill style={{ background: "#BFC6C6" }}><Svg>
    {Array.from({ length: 36 }, (_, i) => <rect key={i} x={(i % 9) * 214 + 4} y={Math.floor(i / 9) * 270 + 4} width={206} height={262} fill={K.porcelain} opacity={0.6} />)}
    {S.map((s, i) => { const k = eio(pr(t, 0.3 + i * (D - 1) / 3, 0.9 + i * (D - 1) / 3)); const x = 420 + i * 540; return (<g key={i} transform={`translate(${x} 540) scale(${Math.abs(Math.cos(k * Math.PI))} 1)`}>
      <rect x={-230} y={-230} width={460} height={460} rx={8} fill={k > 0.5 ? K.navy : K.porcelain} stroke="#9BA6A8" strokeWidth={6} />
      {k > 0.5 && <>{txt(0, -60, String(v * 3 + i + 1), 90, K.copper)}{txt(0, 70, s, s.length > 13 ? 36 : 44, K.cream, 700, SANS)}</>}
    </g>); })}
  </Svg></AbsoluteFill></F>);
};

// cinta de precaución que cruza la pantalla, una por prohibición
export const no_tape: H = ({ dur }) => {
  const t = useT(), D = dur / 30, S = ["NO PLUNGING AFTER CHEMICALS", "NO BOILING WATER", "NO COAT HANGERS"];
  return (<F dur={dur}><AbsoluteFill style={{ background: K.navy }}><Svg>
    {S.map((s, i) => { const k = eout(pr(t, 0.3 + i * (D - 1) / 3, 0.8 + i * (D - 1) / 3)); const y = 280 + i * 260, r = [-6, 4, -3][i]; return (<g key={i} transform={`rotate(${r} 960 ${y})`}>
      <g transform={`translate(${lerp(-2100, 0, k)} 0)`}><rect x={-100} y={y - 60} width={2120} height={120} fill="#F2C230" />
        {Array.from({ length: 30 }, (_, j) => <path key={j} d={`M${-100 + j * 80} ${y - 60} l 40 0 l -60 120 l -40 0 Z`} fill="#1C1C1C" opacity={0.85} />)}
        <rect x={360} y={y - 44} width={1200} height={88} fill="#F2C230" />{txt(960, y + 22, s, 58, "#1C1C1C", 700, SANS)}</g>
    </g>); })}
  </Svg></AbsoluteFill></F>);
};

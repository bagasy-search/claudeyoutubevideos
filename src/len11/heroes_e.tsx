// Héroes de len11e (kitchen sink slip-nut drip), parte 1. Cada uno: {dur (frames), src?, v?}. Mecanismos registrados en D:/rtmp/len11_COMPONENTES.md.
import React from "react";
import { AbsoluteFill } from "remotion";
import { K, SLAB, SANS, HAND, cl, lerp, eio, eout, pr, spr, useT, useFade, Under, Stamp, Svg } from "./kit";

export type H = React.FC<{ dur: number; src?: string; v?: number }>;
export const F: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => { const o = useFade(dur); return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>; };
export const txt = (x: number, y: number, s: string, size = 44, col: string = K.ink, w = 700, font = SLAB, anchor: any = "middle", op = 1) => (
  <text x={x} y={y} fontFamily={font} fontWeight={w} fontSize={size} fill={col} textAnchor={anchor} opacity={op}>{s}</text>
);
export const lbl = (t: number, s: string, at = 0.3, y = 130, col: string = K.cream, size = 54) => <g opacity={cl((t - at) * 3)}>{txt(960, y, s, size, col, 800, SANS)}</g>;
export const NAVY = { background: `radial-gradient(ellipse at 50% 40%, ${K.blue}, ${K.navy})` };
export const CREAM = { background: K.cream };
export const eIn = (x: number) => x * x;
/** junta de desagüe en corte: tailpiece + tuerca + arandela + boca de la trampa. tilt = grados del caño, gap 0..1 */
export const Joint: React.FC<{ x: number; y: number; s?: number; tilt?: number; gap?: number; nut?: number; flip?: boolean; drip?: number }> = ({ x, y, s = 1, tilt = 0, gap = 0, nut = 1, flip = false, drip = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-150 60 L-150 260 Q-150 380 0 380 Q150 380 150 260 L150 60" fill="none" stroke={K.porcelain} strokeWidth={70} />
    <path d="M-150 60 L-150 260 Q-150 380 0 380 Q150 380 150 260 L150 60" fill="none" stroke={K.ink} strokeWidth={6} opacity={0.5} />
    <g transform={`rotate(${tilt} -150 40)`}><rect x={-185} y={-360} width={70} height={420} fill="#EDEDE6" stroke={K.ink} strokeWidth={6} /></g>
    <g transform={`translate(-150 ${lerp(-120, 40, nut)})`}><rect x={-75} y={-40} width={150} height={80} rx={10} fill="#F4F1E6" stroke={K.ink} strokeWidth={6} />
      {Array.from({ length: 7 }, (_, i) => <line key={i} x1={-60 + i * 20} y1={-36} x2={-60 + i * 20} y2={36} stroke={K.ink} strokeWidth={3} opacity={0.4} />)}</g>
    <path d={flip ? "M-205 60 L-95 60 L-120 30 L-180 30 Z" : "M-205 30 L-95 30 L-120 60 L-180 60 Z"} fill={K.copper} opacity={0.9} transform={`translate(${gap * 14} 0)`} />
    {gap > 0 && <rect x={-110} y={30} width={6 + gap * 10} height={36} fill={K.water} />}
    {drip > 0 && <circle cx={-150} cy={90 + (drip % 1) * 260} r={12} fill={K.waterD} opacity={1 - (drip % 1)} />}
  </g>
);

// ── SEISMOGRAPH (hilo conductor): la goteadera registrada como sismógrafo en papel que corre.
// v0 drip drip drip · v1 the gap squeezes a little out · v2 creeps & drips off the nut · v3 always there, only shows with a full sink
export const seismograph: H = ({ dur, v = 0 }) => {
  const t = useT(), off = t * 260;
  const amp = (x: number) => { const ph = ((x + off) % 260) / 260; const spike = Math.exp(-Math.pow((ph - 0.5) * 18, 2)); return v === 3 ? spike * (x > 1100 ? 160 : 6) : spike * (v === 1 ? 90 : 150); };
  const pts = Array.from({ length: 190 }, (_, i) => { const x = 60 + i * 10; return `${x},${560 - amp(x) * Math.sin(i * 1.3)}`; }).join(" ");
  const cap = ["DRIP · DRIP · DRIP", "EVERY TIME THE SINK DRAINS", "IT CREEPS ALONG THE THREADS", "ALWAYS THERE"][v];
  const sub = ["RIGHT FROM THAT BIG PLASTIC NUT", "A LITTLE SQUEEZES OUT", "AND DRIPS OFF THE BOTTOM OF THE NUT", "ONLY SHOWS WITH A FULL SINK"][v];
  return (<F dur={dur}><AbsoluteFill style={{ background: "#ECE6D6" }}><Svg>
    <rect x={40} y={300} width={1840} height={520} fill="#FBF8EF" stroke="#bbb" strokeWidth={3} />
    {Array.from({ length: 24 }, (_, i) => <line key={i} x1={60 + ((i * 80 - off) % 1920 + 1920) % 1920} y1={300} x2={60 + ((i * 80 - off) % 1920 + 1920) % 1920} y2={820} stroke={K.rule} strokeWidth={2} />)}
    <polyline points={pts} fill="none" stroke={K.red} strokeWidth={5} />
    <line x1={1700} y1={180} x2={1700} y2={560} stroke={K.ink} strokeWidth={6} /><circle cx={1700} cy={560} r={14} fill={K.ink} />
    {v === 3 && <g opacity={cl((t - 1) * 2)}>{txt(500, 760, "TRICKLE", 40, K.graphite, 800, SANS)}{txt(1450, 760, "FULL SINK", 40, K.red, 900, SANS)}</g>}
    {txt(960, 180, cap, 76, K.navy, 900, SANS)}<g opacity={cl((t - 0.6) * 2)}>{txt(960, 930, sub, 44, K.ink, 800, SANS)}</g>
  </Svg></AbsoluteFill></F>);
};
// ── LIGHTHOUSE_BEAM: un haz de faro barre la noche y en cada pasada ilumina un dato
export const lighthouse_beam: H = ({ dur }) => {
  const t = useT(), a = -60 + t * 70;
  const facts: [number, string][] = [[-25, "45 YEARS"], [15, "15 MINUTES"], [50, "HANDS · BUCKET · TOILET PAPER"]];
  return (<F dur={dur}><AbsoluteFill style={{ background: "#0d1626" }}><Svg>
    <rect x={180} y={520} width={90} height={420} fill="#e9e2d0" /><rect x={160} y={480} width={130} height={60} fill={K.red} /><circle cx={225} cy={470} r={26} fill="#fff6c0" />
    <g transform={`rotate(${a} 225 470)`}><path d="M225 470 L1900 330 L1900 610 Z" fill="#fff6c0" opacity={0.22} /></g>
    {facts.map(([ang, s], i) => { const lit = cl(1 - Math.abs(a - ang) / 12) + (a > ang ? 0.6 : 0); const y = 470 + Math.tan((ang * Math.PI) / 180) * 1200; return <g key={i} opacity={cl(lit)}>{txt(1250, y + 20, s, 70, K.cream, 900, SANS)}</g>; })}
    <rect x={0} y={940} width={1920} height={140} fill="#0a1a2e" />
  </Svg></AbsoluteFill></F>);
};
// ── BREAD_RISE: tres boles tapados con repasador; se levanta cada paño y adentro no hay nada que comprar
export const bread_rise: H = ({ dur }) => {
  const t = useT(), items = ["NO NEW PARTS", "NO SEALANT", "NO WRENCH"];
  return (<F dur={dur}><AbsoluteFill style={CREAM}><Svg>
    {items.map((s, i) => { const x = 420 + i * 540, up = eout(pr(t, 0.4 + i * 0.6, 0.9 + i * 0.6));
      return <g key={s}><path d={`M${x - 200} 620 Q${x} 860 ${x + 200} 620 Z`} fill="#c9a77a" stroke={K.ink} strokeWidth={6} />
        <g transform={`translate(${x} ${620 - up * 260}) rotate(${up * -18})`}><path d="M-230 0 Q0 -90 230 0 L210 30 L-210 30 Z" fill="#fff" stroke={K.red} strokeWidth={5} />{[0, 1, 2].map((k) => <line key={k} x1={-180 + k * 120} y1={-30} x2={-180 + k * 120} y2={20} stroke={K.red} strokeWidth={10} opacity={0.5} />)}</g>
        <g opacity={up}>{txt(x, 700, "$0", 70, K.green, 900, SANS)}{txt(x, 960, s, 46, K.navy, 900, SANS)}</g></g>; })}
    {lbl(t, "IT COSTS NOTHING", 2.2, 160, K.red, 64)}
  </Svg></AbsoluteFill></F>);
};
// ── JAR_LID: una tapa de frasco girada de más: el vidrio se raja
export const jar_lid: H = ({ dur }) => {
  const t = useT(), turn = eio(pr(t, 0.3, 2.0)) * 540, crack = pr(t, 2.0, 2.3);
  return (<F dur={dur}><AbsoluteFill style={NAVY}><Svg>
    <rect x={760} y={420} width={400} height={480} rx={50} fill="rgba(220,240,255,0.25)" stroke={K.cream} strokeWidth={6} />
    <g transform={`translate(960 400)`}><rect x={-220} y={-50} width={440} height={100} rx={16} fill="#c8ccd0" stroke={K.ink} strokeWidth={6} />
      {Array.from({ length: 12 }, (_, i) => { const xx = ((i * 40 + turn) % 440) - 220; return <line key={i} x1={xx} y1={-46} x2={xx} y2={46} stroke={K.ink} strokeWidth={4} opacity={0.5} />; })}</g>
    <path d="M820 470 L880 560 L850 640 L920 720 L890 820" fill="none" stroke="#fff" strokeWidth={6} strokeDasharray="600" strokeDashoffset={600 - crack * 600} />
    {txt(960, 180, "TIGHTER ISN'T BETTER", 70, K.cream, 900, SANS)}
    <Stamp t={t} at={2.3} x={1450} y={720} text="CRACK" rot={-12} />
  </Svg></AbsoluteFill></F>);
};
// ── LADDER_RUNGS: escalera vista de frente; el peldaño del paso se enciende al subir
const RUNGS: string[][] = [["ONE", "DRY EVERYTHING"], ["TWO", "TOILET PAPER ON EVERY JOINT"], ["THREE", "HAND TIGHT"], ["FOUR", "THE WASHER"], ["FIVE", "WIPE IT CLEAN"], ["SIX", "FULL SINK · NEW STRIP"],
  ["LOOK UP", "THE HIGHEST WET STRIP"], ["STEP FOUR", "TAKE THE JOINT APART"], ["STEP FIVE", "CLEAN IT"], ["STEP SIX", "STRAIGHT"], ["STEP SEVEN", "HAND TIGHT AGAIN"], ["STEP EIGHT", "TEST"], ["ONE LAST TIME", "DRY · PAPER · FULL SINK · HAND TIGHT"]];
export const ladder_rungs: H = ({ dur, v = 0 }) => {
  const t = useT(), [a, b] = RUNGS[v] || RUNGS[0], k = Math.min(v, 5), cl6 = v >= 6 ? 5 : k, rise = eout(pr(t, 0.1, 0.7));
  return (<F dur={dur}><AbsoluteFill style={NAVY}><Svg>
    <line x1={300} y1={1040} x2={420} y2={80} stroke="#c9a77a" strokeWidth={22} /><line x1={640} y1={1040} x2={520} y2={80} stroke="#c9a77a" strokeWidth={22} />
    {Array.from({ length: 7 }, (_, i) => { const y = 960 - i * 140, on = i === cl6; return <line key={i} x1={312 + i * 16} y1={y} x2={628 - i * 16} y2={y} stroke={on ? K.copper : "#a88a62"} strokeWidth={on ? 26 : 16} opacity={on ? 1 : 0.6} />; })}
    <g transform={`translate(${lerp(1400, 1180, rise)} 0)`} opacity={rise}>{txt(0, 470, a, 120, K.copper, 900, SANS, "middle")}{txt(0, 580, b, 52, K.cream, 800, SANS, "middle")}</g>
  </Svg></AbsoluteFill></F>);
};
// ── SAFE_DIAL: dial de caja fuerte girado a la derecha por tacto; un clic y "HAND TIGHT"
export const safe_dial: H = ({ dur, v = 0 }) => {
  const t = useT(), ang = eio(pr(t, 0.2, 1.8)) * 300, click = pr(t, 1.8, 2.0);
  return (<F dur={dur}><AbsoluteFill style={{ background: "#26282b" }}><Svg>
    <circle cx={760} cy={560} r={330} fill="#3a3d42" stroke="#111" strokeWidth={14} />
    <g transform={`rotate(${ang} 760 560)`}><circle cx={760} cy={560} r={240} fill="#c8ccd0" stroke="#111" strokeWidth={8} />
      {Array.from({ length: 40 }, (_, i) => <line key={i} x1={760} y1={330} x2={760} y2={i % 5 ? 350 : 370} stroke="#111" strokeWidth={4} transform={`rotate(${i * 9} 760 560)`} />)}
      <circle cx={760} cy={560} r={70} fill="#9aa0a6" /></g>
    <path d="M740 200 L780 200 L760 240 Z" fill={K.red} />
    <g opacity={click}>{txt(1450, 470, "CLICK", 90, K.copper, 900, SANS)}{txt(1450, 580, v === 1 ? "STEP THREE: HAND TIGHT" : "AS TIGHT AS YOUR HAND CAN", 46, K.cream, 800, SANS)}{txt(1450, 660, "NOT A WRENCH", 46, K.red, 900, SANS)}</g>
  </Svg></AbsoluteFill></F>);
};
// ── LAMPSHADE_FLIP: una pantalla de lámpara al revés se ve mal; igual la arandela: lado ancho y lado angosto
export const lampshade_flip: H = ({ dur, v = 0 }) => {
  const t = useT(), fl = eio(pr(t, 0.9, 1.6)), rot = 180 - fl * 180;
  const top = ["FLAT SIDE · TAPERED SIDE", "UPSIDE DOWN IT CAN'T SEAL", "HALF THE TIME: UPSIDE DOWN", "", "NINE TIMES OUT OF TEN", "UPSIDE DOWN, DIRTY, OR CRACKED?", "FLAT SIDE TOWARD THE NUT"][v] || "";
  return (<F dur={dur}><AbsoluteFill style={CREAM}><Svg>
    <line x1={560} y1={620} x2={560} y2={900} stroke={K.graphite} strokeWidth={14} /><ellipse cx={560} cy={910} rx={140} ry={30} fill={K.graphite} />
    <g transform={`rotate(${rot} 560 520)`}><path d="M440 420 L680 420 L760 620 L360 620 Z" fill="#F2D9A6" stroke={K.ink} strokeWidth={6} /></g>
    <g transform={`translate(1360 560) rotate(${rot})`}><path d="M-200 -60 L200 -60 L120 60 L-120 60 Z" fill={K.copper} stroke={K.ink} strokeWidth={6} />
      <g transform={`rotate(${-rot})`}>{txt(0, -100, rot > 90 ? "TAPERED" : "FLAT", 40, K.ink, 900, SANS)}</g></g>
    <g opacity={fl}>{txt(1360, 760, "FLAT SIDE UP · TOWARD THE NUT", 40, K.green, 900, SANS)}</g>
    {txt(960, 170, top, 66, K.navy, 900, SANS)}
  </Svg></AbsoluteFill></F>);
};
// ── PRINCESS_PEA: colchones apilados sobre un grano: arriba se nota el bulto = la arandela no asienta
export const princess_pea: H = ({ dur }) => {
  const t = useT(), stack = Math.floor(pr(t, 0.2, 1.4) * 6);
  return (<F dur={dur}><AbsoluteFill style={{ background: "#3a2b4a" }}><Svg>
    <circle cx={960} cy={940} r={18} fill={K.green} />
    {Array.from({ length: stack }, (_, i) => { const y = 900 - i * 70, bump = 22 - i * 2; return <path key={i} d={`M600 ${y} Q960 ${y - bump - 40} 1320 ${y} L1320 ${y - 56} Q960 ${y - bump - 96} 600 ${y - 56} Z`} fill={i % 2 ? "#E8C5D8" : "#C5D8E8"} stroke={K.ink} strokeWidth={4} />; })}
    <g opacity={cl((t - 1.6) * 2)}>{txt(960, 200, "A GRAIN OF RICE UNDER IT", 66, K.cream, 900, SANS)}{txt(960, 290, "LEAVES A GAP", 66, K.copper, 900, SANS)}</g>
  </Svg></AbsoluteFill></F>);
};
// ── LEANING_TOWER: torre torcida: la presión cae de un lado; enderezarla reparte. v0 straight · v1 gap on one side · v2 look from front and side · v3 hard on one side
export const leaning_tower: H = ({ dur, v = 0 }) => {
  const t = useT(), fix = v === 0 || v === 2 ? eio(pr(t, 1.0, 2.0)) : 0, ang = 12 * (1 - fix);
  return (<F dur={dur}><AbsoluteFill style={{ background: "#d9e4ec" }}><Svg>
    <rect x={0} y={900} width={1920} height={180} fill="#9bb07a" />
    <g transform={`rotate(${ang} 600 900)`}>{Array.from({ length: 6 }, (_, i) => <rect key={i} x={520} y={900 - (i + 1) * 110} width={160} height={104} fill="#f1ead8" stroke={K.ink} strokeWidth={5} />)}</g>
    <Joint x={1400} y={420} s={0.9} tilt={ang} gap={ang > 2 ? 1 : 0} />
    {ang > 2 && <g opacity={cl((t - 0.8) * 2)}>{txt(1600, 520, "GAP", 48, K.red, 900, SANS)}{txt(1050, 520, "SQUEEZED", 40, K.navy, 900, SANS)}</g>}
    {txt(960, 140, ["STRAIGHT, NOT CROOKED", "AT AN ANGLE: A GAP ON ONE SIDE", "FROM THE FRONT AND FROM THE SIDE", "HARD ON ONE SIDE, LOOSE ON THE OTHER"][v], 62, K.navy, 900, SANS)}
  </Svg></AbsoluteFill></F>);
};
// ── TREASURE_CHEST: el cofre se abre y salen las causas (no una pieza rota). v1: lo que había dentro de la trampa
export const treasure_chest: H = ({ dur, v = 0 }) => {
  const t = useT(), op = eout(pr(t, 0.2, 0.8));
  const items = v === 1 ? ["GREASE", "COFFEE GROUNDS", "RICE", "A BOTTLE CAP"] : ["DIRTY", "CROOKED", "UPSIDE DOWN", "PIPES OFF LINE"];
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2a2017" }}><Svg>
    <rect x={710} y={640} width={500} height={300} rx={20} fill="#7a4a24" stroke="#e0b24a" strokeWidth={10} />
    <g transform={`rotate(${-op * 60} 710 640)`}><path d="M710 640 L1210 640 L1210 560 Q960 470 710 560 Z" fill="#8a5a2c" stroke="#e0b24a" strokeWidth={10} /></g>
    {items.map((s, i) => { const p = eout(pr(t, 0.7 + i * 0.45, 1.2 + i * 0.45)), x = lerp(960, 300 + i * 440, p), y = lerp(640, 300, p); return <g key={s} opacity={p} transform={`translate(${x} ${y})`}><rect x={-190} y={-50} width={380} height={100} rx={14} fill={K.cream} />{txt(0, 18, s, 42, K.navy, 900, SANS)}</g>; })}
    {lbl(t, v === 1 ? "WHAT'S BEEN SITTING UNDER YOUR SINK" : "NOT A BROKEN PART", 2.3, 1030, K.copper, 48)}
  </Svg></AbsoluteFill></F>);
};
// ── MOAT_GATE: el foso de un castillo: v0/v1 la compuerta (arandela) baja y cierra la grieta · v2 el agua del foso frena el gas
export const moat_gate: H = ({ dur, v = 0 }) => {
  const t = useT(), g = eout(pr(t, 0.4, 1.4));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#c7d7c0" }}><Svg>
    <path d="M200 620 L700 620 L700 380 L760 380 L760 330 L820 330 L820 380 L880 380 L880 330 L940 330 L940 380 L1000 380 L1000 620 L1720 620 L1720 1080 L200 1080 Z" fill="#b7aa92" stroke={K.ink} strokeWidth={6} />
    <path d="M200 760 Q960 700 1720 760 L1720 1000 Q960 940 200 1000 Z" fill={K.water} opacity={0.85} />
    {v < 2 ? <g transform={`translate(0 ${lerp(-200, 0, g)})`}><rect x={780} y={420} width={140} height={200} fill={K.copper} stroke={K.ink} strokeWidth={6} />{txt(850, 540, "WASHER", 30, K.white, 900, SANS)}</g>
      : <g>{Array.from({ length: 6 }, (_, i) => { const p = ((t * 0.5 + i / 6) % 1); return <circle key={i} cx={400 + i * 220} cy={1060 - p * 160} r={30 + p * 30} fill="#8a9a5a" opacity={(1 - p) * 0.6} />; })}{txt(960, 900, "SEWER GAS STOPS HERE", 48, K.navy, 900, SANS)}</g>}
    {txt(960, 180, ["HOW DOES A DRAIN JOINT SEAL?", "THE WHOLE VIDEO IN ONE PICTURE", "THAT WATER IS ON PURPOSE"][v], 66, K.navy, 900, SANS)}
  </Svg></AbsoluteFill></F>);
};
// ── TV_GUIDE: una grilla de programación de diario: el arreglo dura un programa corto
export const tv_guide: H = ({ dur, v = 0 }) => {
  const t = useT(), hl = eout(pr(t, 0.6, 1.1));
  const rows = [["6:30", "NEWS"], ["7:00", v ? "FIX THE DRIP · 15 MIN" : "THE FREE TRICK"], ["7:15", "GAME SHOW"], ["7:30", "WEATHER"]];
  return (<F dur={dur}><AbsoluteFill style={{ background: "#e8e1cc" }}><Svg>
    <rect x={360} y={140} width={1200} height={800} fill="#f6f1e2" stroke={K.ink} strokeWidth={4} />{txt(960, 230, "TONIGHT ON CHANNEL 7", 54, K.ink, 900, SLAB)}
    {rows.map(([h, s], i) => <g key={i}>{i === 1 && <rect x={380} y={300 + i * 150} width={1160 * hl} height={120} fill={K.copper} opacity={0.35} />}{txt(440, 380 + i * 150, h, 54, K.ink, 800, SANS, "start")}{txt(680, 380 + i * 150, s, 54, i === 1 ? K.red : K.ink, 800, SANS, "start")}</g>)}
    {v === 1 && <g opacity={cl((t - 1.4) * 2)}>{txt(960, 1020, "MOSTLY DRYING AND WAITING FOR THE SINK", 40, K.navy, 900, SANS)}</g>}
  </Svg></AbsoluteFill></F>);
};
// ── NUTCRACKER: el cascanueces de madera muerde la tuerca de plástico y la parte
export const nutcracker: H = ({ dur, v = 0 }) => {
  const t = useT(), bite = eio(pr(t, 0.6, 1.4)), crack = pr(t, 1.4, 1.6);
  return (<F dur={dur}><AbsoluteFill style={{ background: "#3d1c1c" }}><Svg>
    <rect x={540} y={300} width={260} height={560} rx={30} fill="#b23a2e" stroke="#1a0a0a" strokeWidth={8} /><circle cx={670} cy={260} r={110} fill="#f0c9a0" stroke="#1a0a0a" strokeWidth={8} />
    <rect x={560} y={150} width={220} height={60} fill="#1a0a0a" />
    <g transform={`translate(0 ${-bite * 40})`}><rect x={800} y={380} width={280} height={70} fill="#e0d6c0" stroke="#1a0a0a" strokeWidth={6} /></g>
    <rect x={800} y={520} width={280} height={70} fill="#e0d6c0" stroke="#1a0a0a" strokeWidth={6} />
    <g transform={`translate(1240 480)`}><g transform={`translate(${-crack * 30} 0) rotate(${-crack * 14})`}><path d="M-110 -60 L0 -60 L-10 60 L-110 60 Z" fill="#F4F1E6" stroke={K.ink} strokeWidth={6} /></g>
      <g transform={`translate(${crack * 30} 0) rotate(${crack * 14})`}><path d="M0 -60 L110 -60 L110 60 L-10 60 Z" fill="#F4F1E6" stroke={K.ink} strokeWidth={6} /></g></g>
    {txt(960, 140, ["CRANKING JUST CRACKS THE NUT", "", "MISTAKE ONE: THE BIG WRENCH", "NO BIG WRENCH"][v] || "", 64, K.cream, 900, SANS)}
    {v >= 2 && <g opacity={cl((t - 1.8) * 2)}>{txt(960, 1000, "PLASTIC NUTS CRACK", 50, K.copper, 900, SANS)}</g>}
  </Svg></AbsoluteFill></F>);
};
// ── BANDAGE_WRAP: una venda envuelve un dedo: pareja sella, floja deja hueco
export const bandage_wrap: H = ({ dur, v = 0 }) => {
  const t = useT(), w = eout(pr(t, 0.3, 1.6)), even = v !== 3;
  return (<F dur={dur}><AbsoluteFill style={{ background: "#f3dcc8" }}><Svg>
    <rect x={820} y={260} width={280} height={640} rx={140} fill="#e8b48f" stroke={K.ink} strokeWidth={6} />
    {Array.from({ length: Math.floor(w * 6) }, (_, i) => <rect key={i} x={800} y={420 + i * 60 + (even ? 0 : (i % 2) * 18)} width={320} height={56} rx={10} fill="#fff7ea" stroke="#d8c8a8" strokeWidth={4} transform={`rotate(${even ? -6 : (i % 2 ? 10 : -12)} 960 ${440 + i * 60})`} />)}
    {txt(960, 150, ["THE WASHER SEALS IT", "", "SQUEEZED EVENLY ALL THE WAY AROUND", "IT DOES THE SEALING", "THE WASHER, NOT THE NUT"][v] || "", 62, K.navy, 900, SANS)}
    <g opacity={cl((t - 1.8) * 2)}>{txt(960, 1000, "NOT THE THREADS · NOT THE NUT", 46, K.red, 900, SANS)}</g>
  </Svg></AbsoluteFill></F>);
};
// ── PICNIC_BLANKET: un mantel a cuadros se desenrolla y deja cada herramienta en su lugar
const PIC = ["BUCKET", "TOILET PAPER", "OLD TOWELS", "FLASHLIGHT", "GLOVES", "A RAG"];
export const picnic_blanket: H = ({ dur, v = 0 }) => {
  const t = useT(), un = eout(pr(t, 0.1, 0.9)), n = v === 3 ? 6 : 3 + v;
  const head = ["STEP BY STEP", "STEP ONE: CLEAR IT OUT AND DRY IT", "STEP TWO: THE TOILET PAPER", "THAT'S IT"][v];
  return (<F dur={dur}><AbsoluteFill style={{ background: "#5d7a4a" }}><Svg>
    <rect x={160} y={300} width={1600 * un} height={680} fill="#fff" />
    {Array.from({ length: 16 }, (_, i) => <rect key={"a" + i} x={160 + i * 100} y={300} width={50} height={680} fill={K.red} opacity={0.35 * (160 + i * 100 < 160 + 1600 * un ? 1 : 0)} />)}
    {Array.from({ length: 7 }, (_, i) => <rect key={"b" + i} x={160} y={300 + i * 100} width={1600 * un} height={50} fill={K.red} opacity={0.35} />)}
    {PIC.slice(0, n).map((s, i) => { const p = eout(pr(t, 0.8 + i * 0.3, 1.2 + i * 0.3)); return <g key={s} opacity={p} transform={`translate(${420 + (i % 3) * 540} ${480 + Math.floor(i / 3) * 300})`}><rect x={-210} y={-60} width={420} height={120} rx={16} fill={K.navy} />{txt(0, 18, s, 44, K.cream, 900, SANS)}</g>; })}
    {txt(960, 200, head, 64, K.cream, 900, SANS)}
  </Svg></AbsoluteFill></F>);
};
// ── SUBWAY_CROWD: vagón casi vacío (chorrito) vs vagón lleno apretado contra las puertas (pileta llena)
export const subway_crowd: H = ({ dur, v = 0 }) => {
  const t = useT(), full = v === 2 ? 1 : eio(pr(t, 1.2, 2.0)), n = Math.round(lerp(3, 26, full));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#1f2a33" }}><Svg>
    <rect x={160} y={300} width={1600} height={520} rx={60} fill="#c9d3da" stroke={K.ink} strokeWidth={8} />
    {[0, 1, 2].map((i) => <rect key={i} x={360 + i * 520} y={360} width={200} height={460} fill="#9fb0bc" stroke={K.ink} strokeWidth={6} />)}
    {Array.from({ length: n }, (_, i) => { const x = 240 + ((i * 61) % 1460), y = 700 - (i % 3) * 40, push = full > 0.8 ? Math.sin(t * 6 + i) * 4 : 0; return <g key={i} transform={`translate(${x + push} ${y})`}><circle cx={0} cy={-120} r={26} fill="#3b4a56" /><rect x={-24} y={-94} width={48} height={110} rx={16} fill="#3b4a56" /></g>; })}
    {txt(960, 180, full > 0.5 ? "A FULL SINK PUSHES ON EVERY JOINT" : "A TRICKLE GOES RIGHT PAST", 62, K.cream, 900, SANS)}
  </Svg></AbsoluteFill></F>);
};

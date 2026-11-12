// Héroes de len11d (clean the tank with citric acid), parte 1. Cada uno: {dur (frames), src?, v?}. Mecanismos registrados en D:/rtmp/len11_COMPONENTES.md.
import React from "react";
import { AbsoluteFill } from "remotion";
import { K, SLAB, SANS, HAND, cl, lerp, eio, eout, pr, spr, useT, useFade, Under, Pencil, Stamp, Svg } from "./kit";

export type H = React.FC<{ dur: number; src?: string; v?: number }>;
export const F: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => { const o = useFade(dur); return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>; };
export const txt = (x: number, y: number, s: string, size = 44, col: string = K.ink, w = 700, font = SLAB, anchor: any = "middle", op = 1) => (
  <text x={x} y={y} fontFamily={font} fontWeight={w} fontSize={size} fill={col} textAnchor={anchor} opacity={op}>{s}</text>
);
export const lbl = (t: number, s: string, at = 0.3, y = 130, col: string = K.cream, size = 54) => <g opacity={cl((t - at) * 3)}>{txt(960, y, s, size, col, 800, SANS)}</g>;
export const NAVY = { background: `radial-gradient(ellipse at 50% 40%, ${K.blue}, ${K.navy})` };
export const CREAM = { background: K.cream };
/** tanque de inodoro en corte (frente), origen = centro; lvl 0..1 agua, crust 0..1 sarro marrón */
export const Tank: React.FC<{ x: number; y: number; s?: number; lvl?: number; crust?: number; col?: string; water?: string; t?: number }> = ({ x, y, s = 1, lvl = 0.75, crust = 0, col = K.ink, water = K.water, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-260} y={-200} width={520} height={400} rx={18} fill={K.porcelain} stroke={col} strokeWidth={8} />
    <rect x={-250} y={200 - 390 * lvl} width={500} height={390 * lvl - 10} fill={water} opacity={0.65} />
    {crust > 0 && <path d={`M-250 ${190} L-250 ${190 - 380 * lvl} L250 ${190 - 380 * lvl} L250 190`} fill="none" stroke={K.rust} strokeWidth={26 * crust} opacity={0.75} />}
    <rect x={-40} y={150} width={80} height={36} rx={8} fill="#222" />
    <rect x={90} y={-120} width={26} height={310} fill="#ddd" stroke={col} strokeWidth={4} />
    <rect x={-170} y={-60 + Math.sin(t * 2) * 4} width={60} height={50} rx={10} fill="#E9E2D0" stroke={col} strokeWidth={4} />
  </g>
);

// ── POSTCARD: postal del tanque "greetings from the tank" que se da vuelta: "the bowl comes from in here"
export const postcard: H = ({ dur }) => {
  const t = useT(), fl = eio(pr(t, 0.5, 1.1)), ry = fl * 180;
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2c3a33" }}><Svg>
    <g transform={`translate(960 540) scale(${Math.abs(Math.cos((ry * Math.PI) / 180))} 1) rotate(-3)`}>
      <rect x={-560} y={-340} width={1120} height={680} fill={ry < 90 ? "#F6E7C4" : K.white} stroke="#a58b5c" strokeWidth={6} />
      {ry < 90 ? <>{txt(0, -200, "GREETINGS FROM", 60, K.copper, 800, SANS)}{txt(0, -60, "THE TANK", 170, K.navy, 900, SLAB)}<Tank x={0} y={200} s={0.4} /></>
        : <>{txt(-500, -230, "Dear bowl,", 64, K.ink, 700, HAND, "start")}{txt(-500, -120, "Everything you get", 64, K.ink, 700, HAND, "start")}{txt(-500, -20, "comes from in here.", 64, K.red, 700, HAND, "start")}
          <line x1={120} y1={-300} x2={120} y2={300} stroke="#bbb" strokeWidth={3} /><rect x={380} y={-300} width={140} height={170} fill="none" stroke={K.copper} strokeWidth={5} /></>}
    </g>
  </Svg></AbsoluteFill></F>);
};
// ── AISLE_SIGN: cartel colgante de pasillo que baja balanceándose. v0 canning aisle · v1 near the jars and pectin
export const aisle_sign: H = ({ dur, src, v = 0 }) => {
  const t = useT(), d = spr(t, 0.1, 0.8), sw = Math.sin(t * 3.4) * 6 * Math.exp(-t * 0.9);
  const [n, a, b] = v === 1 ? ["14", "CANNING", "JARS · LIDS · PECTIN · CITRIC ACID"] : ["9", "CANNING", "CITRIC ACID IS HERE"];
  return (<F dur={dur}><Under src={src} dark={0.5} blur={4}><Svg>
    <g transform={`translate(960 ${lerp(-300, 380, d)}) rotate(${sw})`}>
      <line x1={-300} y1={-500} x2={-300} y2={-150} stroke="#888" strokeWidth={6} /><line x1={300} y1={-500} x2={300} y2={-150} stroke="#888" strokeWidth={6} />
      <rect x={-520} y={-150} width={1040} height={330} rx={16} fill={K.navy} stroke={K.cream} strokeWidth={8} />
      <circle cx={-400} cy={15} r={90} fill={K.red} />{txt(-400, 50, n, 100, K.white, 900, SANS)}
      {txt(80, 30, a, 120, K.cream, 900, SANS)}{txt(80, 130, b, 40, K.copper, 800, SANS)}
    </g>
  </Svg></Under></F>);
};
// ── TRASH_PEDAL: tacho a pedal: la tapa se abre y cada cosa cae dentro. v0 scrubbing/bleach/tablets · v1 tablets/bleach/pucks
export const trash_pedal: H = ({ dur, v = 0 }) => {
  const t = useT(), open = eout(pr(t, 0.2, 0.5)) * (1 - eio(pr(t, 3.4, 3.8)));
  const items = v === 1 ? ["TABLETS", "BLEACH", "PUCKS"] : ["SCRUBBING", "BLEACH", "BLUE TABLETS"];
  return (<F dur={dur}><AbsoluteFill style={CREAM}><Svg>
    <rect x={760} y={560} width={400} height={440} rx={20} fill="#9aa3a8" stroke={K.ink} strokeWidth={8} />
    <g transform={`translate(760 560) rotate(${-open * 70})`}><rect x={0} y={-36} width={400} height={36} rx={10} fill="#7f878c" stroke={K.ink} strokeWidth={8} /></g>
    <rect x={900} y={990} width={120} height={22} fill={K.ink} transform={`rotate(${open * 8} 900 1000)`} />
    {items.map((s, i) => { const a = 0.6 + i * 0.85, p = pr(t, a, a + 0.6), y = lerp(200, 720, eIn(p)); return <g key={s} opacity={p < 1 ? 1 : 0} transform={`translate(${lerp(560 + i * 400, 960, p)} ${y}) rotate(${p * 160})`}><rect x={-170} y={-50} width={340} height={100} rx={12} fill={K.white} stroke={K.red} strokeWidth={6} />{txt(0, 18, s, 44, K.red, 900, SANS)}</g>; })}
    {lbl(t, v === 1 ? "THE TANK IS FOR CLEAN WATER" : "NOT TONIGHT", 3.0, 140, K.navy)}
  </Svg></AbsoluteFill></F>);
};
const eIn = (x: number) => x * x;
// ── PH_STRIP: tira de pH que se moja y vira; la escala marca limón y ácido cítrico juntos
export const ph_strip: H = ({ dur }) => {
  const t = useT(), dip = eio(pr(t, 0.3, 1.0)), col = pr(t, 1.0, 2.0);
  const sc = ["#D93025", "#E8622C", "#F2A23A", "#F2D33A", "#B8D84A", "#6CC04A", "#3AA67A", "#3A7FB0", "#3A4FB0", "#5A3A9A"];
  return (<F dur={dur}><AbsoluteFill style={NAVY}><Svg>
    <rect x={300} y={560} width={420} height={380} rx={20} fill="rgba(255,255,255,0.15)" stroke={K.cream} strokeWidth={5} /><rect x={306} y={700} width={408} height={234} fill="#F7F3C8" opacity={0.6} />
    <g transform={`translate(510 ${lerp(200, 520, dip) - (t > 2 ? eio(pr(t, 2, 2.5)) * 300 : 0)})`}><rect x={-30} y={0} width={60} height={360} fill={K.white} /><rect x={-30} y={240} width={60} height={110} fill={col > 0 ? `rgb(${lerp(240, 217, col)},${lerp(240, 98, col)},${lerp(230, 44, col)})` : "#eee"} /></g>
    {sc.map((c, i) => <rect key={i} x={900 + i * 84} y={420} width={78} height={120} fill={c} />)}
    {sc.map((_, i) => txt(939 + i * 84, 590, String(i + 1), 36, K.cream, 700, SANS))}
    <g opacity={cl((t - 2.2) * 2)}><path d="M1026 400 L1026 330" stroke={K.cream} strokeWidth={5} />{txt(1026, 310, "LEMON · CITRIC ACID", 40, "#FFD86A", 800, SANS)}<path d="M1446 560 L1446 640" stroke={K.cream} strokeWidth={5} />{txt(1446, 690, "TAP WATER", 36, K.cream, 700, SANS)}</g>
    {lbl(t, "WHAT MAKES LEMONS SOUR", 0.2, 140)}
  </Svg></AbsoluteFill></F>);
};
// ── PARK_METER: parquímetro de esfera: se mete la moneda y la aguja corre. v0 15 minutes · v1 set the timer
export const park_meter: H = ({ dur, v = 0 }) => {
  const t = useT(), coin = eio(pr(t, 0.15, 0.6)), nd = eout(pr(t, 0.6, 1.2));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#3a4a44" }}><Svg>
    <rect x={930} y={640} width={60} height={440} fill="#5b5f63" />
    <rect x={760} y={240} width={400} height={420} rx={60} fill="#7e8790" stroke={K.ink} strokeWidth={8} />
    <circle cx={960} cy={420} r={150} fill={K.cream} stroke={K.ink} strokeWidth={6} />
    {Array.from({ length: 13 }, (_, i) => { const a = (-120 + i * 20) * Math.PI / 180; return <line key={i} x1={960 + Math.sin(a) * 120} y1={420 - Math.cos(a) * 120} x2={960 + Math.sin(a) * 140} y2={420 - Math.cos(a) * 140} stroke={K.ink} strokeWidth={4} />; })}
    <path d={`M960 420 L${960 + Math.sin(((-120 + nd * 120) * Math.PI) / 180) * 120} ${420 - Math.cos(((-120 + nd * 120) * Math.PI) / 180) * 120}`} stroke={K.red} strokeWidth={10} strokeLinecap="round" />
    {txt(960, 520, v === 1 ? "TIMER ON" : "15 MIN", 44, K.red, 900, SANS)}
    <g transform={`translate(${lerp(1300, 1080, coin)} ${lerp(160, 300, coin)})`} opacity={1 - pr(t, 0.6, 0.7)}><ellipse rx={36} ry={36} fill="#c8a24a" stroke="#7a6020" strokeWidth={4} /></g>
    <rect x={1060} y={280} width={40} height={10} fill="#222" />
    {lbl(t, v === 1 ? "SET THE TIMER" : "FIFTEEN MINUTES", 0.3, 150)}
  </Svg></AbsoluteFill></F>);
};
// ── SANDCASTLE: castillo de arena que la ola desarma: así sale el sarro. v0 / v1 (otro castillo)
export const sandcastle: H = ({ dur, v = 0 }) => {
  const t = useT(), w = eio(pr(t, 0.5, 1.7));
  const towers = v === 1 ? [[700, 160], [960, 240], [1220, 160]] : [[760, 200], [1040, 280], [1240, 140]];
  return (<F dur={dur}><AbsoluteFill style={{ background: "linear-gradient(#cfe6ef 0 45%, #e6d3a3 45%)" }}><Svg>
    {towers.map(([x, h], i) => { const fall = cl(w * 1.6 - i * 0.3); return <g key={i}><path d={`M${x - 90} 760 L${x - 70} ${760 - h * (1 - fall)} L${x + 70} ${760 - h * (1 - fall)} L${x + 90} 760 Z`} fill="#C9A867" stroke="#8a6c35" strokeWidth={4} />
      {fall > 0 && <ellipse cx={x} cy={765} rx={90 + 120 * fall} ry={20 + 10 * fall} fill="#C9A867" opacity={0.9} />}</g>; })}
    <path d={`M${lerp(-200, 1400, w) - 1400} 700 Q ${lerp(-200, 1400, w) - 500} 640 ${lerp(-200, 1400, w)} 720 L ${lerp(-200, 1400, w)} 1080 L -2000 1080 Z`} fill={K.water} opacity={0.75} />
    {lbl(t, "THE CRUST COMES OFF LIKE WET SAND", 0.2, 150, K.navy)}
  </Svg></AbsoluteFill></F>);
};
// ── TRAFFIC_LIGHT: semáforo de tiempos: verde 15 min · amarillo 1 hora · rojo más. v0 "never longer than an hour" · v1 "one hour, no more"
export const traffic_light: H = ({ dur, v = 0 }) => {
  const t = useT(), st = t < 0.8 ? 0 : t < 1.6 ? 1 : 2;
  const L = [["15 MIN", "#3fb35a"], ["1 HOUR", "#f2c230"], [v === 1 ? "NO MORE" : "NEVER LONGER", "#e2412f"]];
  return (<F dur={dur}><AbsoluteFill style={{ background: "#1c2228" }}><Svg>
    <rect x={810} y={110} width={300} height={860} rx={40} fill="#2b2f33" stroke="#111" strokeWidth={8} />
    {L.map(([s, c], i) => <g key={i}><circle cx={960} cy={260 + i * 280} r={110} fill={st === i ? c : "#3a3d40"} style={{ filter: st === i ? `drop-shadow(0 0 40px ${c})` : undefined }} />
      <g opacity={st >= i ? 1 : 0.25}>{txt(i % 2 ? 1180 : 740, 280 + i * 280, s, 58, st === i ? c : "#888", 900, SANS, i % 2 ? "start" : "end")}</g></g>)}
  </Svg></AbsoluteFill></F>);
};
// ── PLAYBILL: programa de teatro "WHAT'S IN A TANK": el reparto se ilumina actor por actor
export const playbill: H = ({ dur }) => {
  const t = useT();
  const cast = [["THE FLAPPER", "the rubber door at the bottom"], ["THE CHAIN", "pulls it open"], ["THE FILL VALVE", "refills the tank"], ["THE FLOAT", "tells it when to stop"], ["THE OVERFLOW TUBE", "the emergency exit"]];
  return (<F dur={dur}><AbsoluteFill style={{ background: "#3a1416" }}><Svg>
    <rect x={560} y={60} width={800} height={960} fill="#F5EBD3" stroke="#b8902e" strokeWidth={10} />
    {txt(960, 170, "TONIGHT AT THE", 36, "#7a5a1a", 800, SANS)}{txt(960, 270, "TOILET TANK", 92, "#5a1416", 900, SLAB)}{txt(960, 330, "a play cut in half", 40, "#7a5a1a", 600, HAND)}
    {cast.map(([a, b], i) => { const o = cl((t - 0.5 - i * 0.55) * 3); return <g key={i} opacity={0.2 + 0.8 * o}>{txt(960, 450 + i * 110, a, 50, "#2a1414", 900, SANS)}{txt(960, 492 + i * 110, b, 30, "#6a4a2a", 600, SLAB)}</g>; })}
  </Svg></AbsoluteFill></F>);
};
// ── COMIC_STRIP: historieta de 3 cuadros: flapper sube · agua baja · flapper cae y se llena
export const comic_strip: H = ({ dur }) => {
  const t = useT(), D = dur / 30;
  const P = [["THE FLAPPER LIFTS", 0], ["THE WATER DROPS", 1], ["IT SHUTS · IT REFILLS", 2]];
  return (<F dur={dur}><AbsoluteFill style={{ background: "#FFF6DA" }}><Svg>
    {P.map(([s, i]: any) => { const a = 0.3 + i * (D - 1) / 3, o = eout(pr(t, a, a + 0.4)), x = 120 + i * 580, lp = pr(t, a, a + 1.4);
      const lvl = i === 0 ? 0.75 : i === 1 ? lerp(0.75, 0.1, lp) : lerp(0.1, 0.75, lp), flap = i === 0 ? lp : i === 1 ? 1 : 1 - lp;
      return <g key={i} opacity={o} transform={`translate(0 ${lerp(40, 0, o)})`}><rect x={x} y={180} width={540} height={720} fill={K.white} stroke={K.ink} strokeWidth={8} />
        <rect x={x + 20} y={200} width={500} height={70} fill="#FFE27A" stroke={K.ink} strokeWidth={4} />{txt(x + 270, 248, s, 34, K.ink, 900, SANS)}
        <Tank x={x + 270} y={620} s={0.85} lvl={lvl} t={t} />
        <g transform={`translate(${x + 270} 762) rotate(${-flap * 50} -40 0)`}><rect x={-50} y={-14} width={100} height={22} rx={6} fill="#151515" /></g>
        {i === 1 && txt(x + 270, 880, "WHOOSH!", 60, K.red, 900, SANS)}</g>; })}
  </Svg></AbsoluteFill></F>);
};
// ── WANTED_POSTERS: tres carteles de "se busca" clavados en fila: LIME · IRON · SLIME
export const wanted_posters: H = ({ dur }) => {
  const t = useT();
  const W: [string, string, string][] = [["LIME", "#E9E2CF", "hard water rock"], ["IRON", "#B5612E", "orange streaks"], ["SLIME", "#2E3A2C", "bacteria"]];
  return (<F dur={dur}><AbsoluteFill style={{ background: "#6b4a2e" }}><Svg>
    {W.map(([n, c, d], i) => { const a = 0.2 + i * 0.6, p = spr(t, a, 1.2); return <g key={n} transform={`translate(${380 + i * 580} 560) rotate(${[-4, 2, -2][i]}) scale(${p})`}>
      <rect x={-240} y={-380} width={480} height={760} fill="#EAD9AE" stroke="#8a6a3a" strokeWidth={5} />
      {txt(0, -290, "WANTED", 84, "#3a2a1a", 900, SLAB)}<rect x={-170} y={-230} width={340} height={300} fill={c} stroke="#3a2a1a" strokeWidth={5} />
      {txt(0, 160, n, 96, "#3a2a1a", 900, SANS)}{txt(0, 230, d, 36, "#5a3a1a", 600, SLAB)}<circle cx={0} cy={-360} r={12} fill="#888" /></g>; })}
    {lbl(t, "THREE THINGS BUILD UP IN THERE", 0.1, 90)}
  </Svg></AbsoluteFill></F>);
};
// ── PETRI: placa de Petri: las colonias negras crecen en lo mojado y quieto
export const petri: H = ({ dur }) => {
  const t = useT(), g = eio(pr(t, 0.3, 3.2));
  const C = Array.from({ length: 26 }, (_, i) => [960 + Math.cos(i * 2.4) * (60 + (i * 37) % 280), 560 + Math.sin(i * 2.4) * (60 + (i * 53) % 260), 10 + (i * 7) % 30]);
  return (<F dur={dur}><AbsoluteFill style={{ background: "#dfe7e4" }}><Svg>
    <circle cx={960} cy={560} r={380} fill="#f3eccd" stroke="#b0b8b4" strokeWidth={16} /><circle cx={960} cy={560} r={350} fill="none" stroke="#fff" strokeWidth={4} opacity={0.6} />
    {C.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r * cl(g * 1.6 - i / 40)} fill={i % 3 ? "#1d2219" : "#3e4a3a"} opacity={0.85} />)}
    <g opacity={cl((t - 1.4) * 2)}><rect x={1300} y={180} width={420} height={110} fill={K.white} stroke={K.ink} strokeWidth={4} transform="rotate(4 1500 230)" />{txt(1510, 250, "WET + STILL", 50, K.ink, 900, SANS)}</g>
    {lbl(t, "BACTERIA", 0.2, 110, K.navy)}
  </Svg></AbsoluteFill></F>);
};
// ── BOBBER_ICE: boya de pesca presa en hielo: así queda el flotador con sarro, no sube ni baja
export const bobber_ice: H = ({ dur }) => {
  const t = useT(), frz = eio(pr(t, 0.4, 1.4)), bob = Math.sin(t * 5) * 22 * (1 - frz);
  return (<F dur={dur}><AbsoluteFill style={{ background: "linear-gradient(#a8c8dc 0 40%, #4f7d99 40%)" }}><Svg>
    <rect x={0} y={432} width={1920} height={60} fill="#EAF4FA" opacity={frz * 0.9} />
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${i * 170} 460 l60 ${20 + (i % 3) * 14} l60 -30`} stroke="#fff" strokeWidth={4} fill="none" opacity={frz} />)}
    <g transform={`translate(960 ${440 + bob})`}><path d="M-60 0 A60 60 0 0 1 60 0 Z" fill={K.red} /><path d="M-60 0 A60 60 0 0 0 60 0 Z" fill={K.white} /><line x1={0} y1={-60} x2={0} y2={-300} stroke="#333" strokeWidth={3} /></g>
    <g opacity={cl((t - 1.4) * 2)}>{txt(960, 720, "STUCK", 140, K.white, 900, SANS)}{txt(960, 800, "lime on the float", 50, K.cream, 600, SLAB)}</g>
  </Svg></AbsoluteFill></F>);
};
// ── BABY_MONITOR: monitor de bebé en la mesa de luz: 3:12 AM y las barras suben con el "shhh" del tanque
export const baby_monitor: H = ({ dur }) => {
  const t = useT(), on = pr(t, 1.0, 1.2) * (1 - pr(t, 3.6, 3.8));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#0d1420" }}><Svg>
    <rect x={0} y={760} width={1920} height={320} fill="#1b2433" />
    <g transform="translate(1260 600)"><rect x={-150} y={-260} width={300} height={420} rx={50} fill="#e8e6df" /><rect x={-110} y={-210} width={220} height={190} rx={14} fill="#203040" />
      {Array.from({ length: 5 }, (_, i) => <rect key={i} x={-90 + i * 40} y={-40 - (i + 1) * 28 * on * (0.6 + 0.4 * Math.abs(Math.sin(t * 8 + i)))} width={28} height={(i + 1) * 28 * on * (0.6 + 0.4 * Math.abs(Math.sin(t * 8 + i)))} fill={i < 3 ? "#5fd36a" : "#f2c230"} />)}
      <circle cx={0} cy={80} r={30} fill="#ccc" /></g>
    {txt(560, 420, "3:12", 200, "#ff5040", 700, "monospace")}{txt(560, 500, "AM", 60, "#ff5040", 700, "monospace")}
    <g opacity={on}>{txt(1260, 260, "shhhhhh…", 64, K.water, 700, HAND)}</g>
    {lbl(t, "THE TOILET THAT RUNS BY ITSELF AT NIGHT", 0.2, 1000)}
  </Svg></AbsoluteFill></F>);
};
// ── TANK_WEATHER (hilo conductor): el pronóstico del tiempo de la TV, pero sobre el mapa del tanque.
// v0 "frente marrón avanza hacia el bowl" · v1 "15 min · despejado" · v2 "bowl: limpio todo el mes"
export const tank_weather: H = ({ dur, v = 0 }) => {
  const t = useT(), m = eio(pr(t, 0.3, 2.6));
  const front = v === 0 ? lerp(-200, 520, m) : -999;
  return (<F dur={dur}><AbsoluteFill style={{ background: "#0e2a4a" }}><Svg>
    <rect x={120} y={120} width={1180} height={820} fill="#2d6a8a" stroke="#cfe3ef" strokeWidth={6} />
    <rect x={260} y={200} width={640} height={420} rx={20} fill="#3f8a6a" stroke="#e8f2e0" strokeWidth={6} />{txt(580, 250, "TANK", 40, "#e8f2e0", 800, SANS)}
    <path d="M580 620 L580 720 Q580 860 800 860 L1040 860" stroke="#e8f2e0" strokeWidth={22} fill="none" /><ellipse cx={1120} cy={830} rx={150} ry={80} fill="#3f8a6a" stroke="#e8f2e0" strokeWidth={6} />{txt(1120, 840, "BOWL", 40, "#e8f2e0", 800, SANS)}
    {v === 0 && <g transform={`translate(${front} 0)`}><path d="M300 260 q60 -60 120 0 q60 -60 120 0 q60 60 0 120 q60 60 0 120 l-240 0 z" fill="#7a4a22" opacity={0.75} />{Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${330 + i * 40} 520 l-14 40`} stroke="#3a2a1a" strokeWidth={6} />)}</g>}
    {v === 0 && <path d={`M560 600 L700 ${lerp(600, 860, m)}`} stroke={K.red} strokeWidth={10} markerEnd="" opacity={m} />}
    {v === 1 && <g opacity={m}><circle cx={580} cy={410} r={110} fill="#FFD84A" />{Array.from({ length: 10 }, (_, i) => <line key={i} x1={580 + Math.cos(i * 0.63 + t) * 140} y1={410 + Math.sin(i * 0.63 + t) * 140} x2={580 + Math.cos(i * 0.63 + t) * 180} y2={410 + Math.sin(i * 0.63 + t) * 180} stroke="#FFD84A" strokeWidth={10} />)}</g>}
    {v === 2 && <g opacity={m}>{Array.from({ length: 5 }, (_, i) => <circle key={i} cx={1040 + i * 40} cy={760 - (t * 40 + i * 30) % 120} r={10} fill="#fff" />)}</g>}
    <rect x={1360} y={120} width={440} height={820} fill="#0a1e36" stroke="#cfe3ef" strokeWidth={4} />
    {txt(1580, 200, "TANK WEATHER", 40, "#FFD84A", 900, SANS)}
    {(v === 0 ? [["TONIGHT", "BROWN FRONT"], ["MOVING", "INTO THE BOWL"], ["EVERY", "FLUSH"]] : v === 1 ? [["MOST TANKS", "15 MINUTES"], ["CRUST", "SOFT · CLEARING"], ["OUTLOOK", "WHITE"]] : [["BOWL", "CLEAN WATER IN"], ["STAINS", "STAYING AWAY"], ["ALL", "MONTH"]]).map(([a, b], i) => <g key={i} opacity={cl((t - 0.6 - i * 0.5) * 3)}>{txt(1580, 340 + i * 200, a, 34, "#cfe3ef", 700, SANS)}{txt(1580, 400 + i * 200, b, 44, K.white, 900, SANS)}</g>)}
  </Svg></AbsoluteFill></F>);
};
// ── ARM_WRESTLE: pulseada: ácido cítrico contra vinagre; los dos son ácidos, gana el cítrico
export const arm_wrestle: H = ({ dur }) => {
  const t = useT(), a = Math.sin(t * 7) * 6 * (1 - pr(t, 1.6, 2.0)) - eio(pr(t, 1.8, 2.6)) * 60;
  return (<F dur={dur}><AbsoluteFill style={{ background: "#2a3138" }}><Svg>
    <rect x={460} y={700} width={1000} height={60} fill="#7a5a3a" /><rect x={520} y={760} width={40} height={300} fill="#5a3a2a" /><rect x={1360} y={760} width={40} height={300} fill="#5a3a2a" />
    <g transform={`rotate(${a} 960 690)`}><line x1={660} y1={690} x2={960} y2={420} stroke="#f0d9b5" strokeWidth={70} strokeLinecap="round" /><line x1={1260} y1={690} x2={960} y2={420} stroke="#d9b48a" strokeWidth={70} strokeLinecap="round" /><circle cx={960} cy={420} r={60} fill="#e8c9a0" /></g>
    <rect x={380} y={380} width={300} height={160} rx={12} fill={K.white} stroke={K.ink} strokeWidth={5} />{txt(530, 450, "CITRIC", 52, K.ink, 900, SANS)}{txt(530, 505, "ACID", 40, K.ink, 700, SANS)}
    <rect x={1240} y={380} width={300} height={160} rx={12} fill="#f4ecd6" stroke={K.ink} strokeWidth={5} />{txt(1390, 470, "VINEGAR", 52, K.ink, 900, SANS)}
    <Stamp t={t} at={2.4} x={530} y={260} text="STRONGER" size={60} col={K.green} rot={-6} />
    {lbl(t, "BOTH ARE ACIDS", 0.2, 120)}
  </Svg></AbsoluteFill></F>);
};
// ── BUTTER_KNIFE: manteca dura que no se unta vs manteca blanda: el ácido ablanda y después se limpia solo
export const butter_knife: H = ({ dur }) => {
  const t = useT(), soft = eio(pr(t, 1.6, 3.2)), spread = eio(pr(t, 3.4, 5.2));
  return (<F dur={dur}><AbsoluteFill style={{ background: "#e9e1cd" }}><Svg>
    <rect x={300} y={560} width={1320} height={300} rx={20} fill="#c69a5a" />
    <rect x={500} y={500 - (1 - soft) * 40} width={lerp(240, 600, spread)} height={lerp(160, 50, spread)} rx={lerp(8, 30, soft)} fill="#F5E27A" stroke="#c9b450" strokeWidth={4} />
    <g transform={`translate(${lerp(1300, 820 + spread * 380, pr(t, 0.3, 1.2))} ${lerp(380, 460, soft)}) rotate(${-18 + soft * 10})`}><rect x={0} y={-16} width={420} height={32} rx={14} fill="#cfd3d6" stroke="#888" strokeWidth={3} /><rect x={330} y={-22} width={170} height={44} rx={16} fill="#5a3a2a" /></g>
    {t < 1.6 && t > 0.9 && txt(960, 340, "won't spread", 60, K.red, 700, HAND)}
    <g opacity={cl((t - 1.8) * 2)}>{txt(960, 200, "THE ACID SOFTENS IT", 64, K.navy, 900, SANS)}</g>
    <g opacity={cl((t - 3.6) * 2)}>{txt(960, 960, "then it comes right off", 60, K.ink, 700, HAND)}</g>
  </Svg></AbsoluteFill></F>);
};
// ── INCLINED_PLANE: diagrama de física de plano inclinado: la tapa en el asiento resbala y se parte
export const inclined_plane: H = ({ dur }) => {
  const t = useT(), s = eIn(pr(t, 0.6, 2.0)), crack = pr(t, 2.0, 2.2);
  return (<F dur={dur}><AbsoluteFill style={{ background: "#F7F4EA" }}><Svg>
    {Array.from({ length: 30 }, (_, i) => <line key={i} x1={0} x2={1920} y1={i * 40} y2={i * 40} stroke="rgba(46,92,150,0.12)" />)}
    <path d="M300 520 L1100 820 L300 820 Z" fill="none" stroke={K.ink} strokeWidth={6} />{txt(560, 780, "TOILET SEAT", 32, K.ink, 700, SANS)}
    <path d="M360 760 A90 90 0 0 1 380 818" fill="none" stroke={K.blue} strokeWidth={4} />{txt(430, 800, "θ", 40, K.blue, 700, SLAB)}
    {crack < 1 ? <g transform={`translate(${lerp(460, 1150, s)} ${lerp(560, 900, s)}) rotate(${20.5 + s * 30})`}><rect x={-150} y={-40} width={300} height={40} rx={8} fill={K.porcelain} stroke={K.ink} strokeWidth={5} /></g>
      : <g><g transform="translate(1100 960) rotate(-12)"><rect x={-150} y={-20} width={140} height={40} fill={K.porcelain} stroke={K.ink} strokeWidth={5} /></g><g transform="translate(1290 975) rotate(14)"><rect x={0} y={-20} width={150} height={40} fill={K.porcelain} stroke={K.ink} strokeWidth={5} /></g>{txt(1200, 900, "CRACK", 70, K.red, 900, SANS)}</g>}
    <line x1={200} y1={1000} x2={1700} y2={1000} stroke={K.ink} strokeWidth={6} />
    <Pencil t={t} at={0.3} x={1300} y={420} text="smooth + tilted" col={K.blue} to={[900, 640]} />
  </Svg></AbsoluteFill></F>);
};
// ── JIGSAW: la tapa como pieza de rompecabezas que encaja en un solo tanque. v0 encaja · v1 la pieza partida no tiene repuesto
export const jigsaw: H = ({ dur, v = 0 }) => {
  const t = useT(), p = eio(pr(t, 0.4, 1.8));
  const piece = (x: number, y: number, col: string, k = 1) => <path transform={`translate(${x} ${y}) scale(${k})`} d="M-200 -80 L-40 -80 q0 -50 40 -50 q40 0 40 50 L200 -80 L200 80 L-200 80 Z" fill={col} stroke={K.ink} strokeWidth={6} />;
  return (<F dur={dur}><AbsoluteFill style={{ background: "#36404a" }}><Svg>
    {[0, 1, 2].map((i) => <g key={i}><rect x={260 + i * 500} y={540} width={400} height={360} fill={["#F2EEE4", "#E9E4DA", "#F6F1E6"][i]} stroke={K.ink} strokeWidth={6} />
      <path d={`M${260 + i * 500} 540 L${420 + i * 500} 540 q0 ${[-50, -30, -60][i]} 40 ${[-50, -30, -60][i]} q40 0 40 ${[50, 30, 60][i]} L${660 + i * 500} 540`} fill="#36404a" stroke={K.ink} strokeWidth={6} /></g>)}
    {v === 0 ? <g>{piece(lerp(960, 960, p), lerp(200, 460, p), K.porcelain)}{p > 0.95 && <Stamp t={t} at={1.9} x={960} y={980} text="ONE LID · ONE TANK" size={54} col={K.green} rot={-3} />}</g>
      : <g><g transform={`translate(${880 - p * 60} 300) rotate(${-p * 20})`}><path d="M-200 -80 L-40 -80 q0 -50 40 -50 L10 80 L-200 80 Z" fill={K.porcelain} stroke={K.ink} strokeWidth={6} /></g><g transform={`translate(${1040 + p * 60} 300) rotate(${p * 20})`}><path d="M10 -130 q30 0 30 50 L200 -80 L200 80 L-20 80 Z" fill={K.porcelain} stroke={K.ink} strokeWidth={6} /></g>
        <g opacity={cl((t - 1.8) * 2)}>{txt(960, 1000, "NO SPARE PIECE IN THE BOX", 54, K.red, 900, SANS)}</g></g>}
  </Svg></AbsoluteFill></F>);
};
// ── VIEWFINDER: visor estereoscópico de juguete: al hacer clic cambia el disco: chain · handle · flapper
export const viewfinder: H = ({ dur, src }) => {
  const t = useT(), k = Math.min(2, Math.floor(t / ((dur / 30) / 3))), cl0 = pr(t % ((dur / 30) / 3), 0, 0.15);
  const N = ["THE CHAIN", "THE HANDLE", "THE FLAPPER"];
  return (<F dur={dur}><AbsoluteFill style={{ background: "#9e1c1c" }}><Svg>
    <clipPath id="vfL"><circle cx={660} cy={520} r={300} /></clipPath><clipPath id="vfR"><circle cx={1260} cy={520} r={300} /></clipPath>
    {src && [660, 1260].map((x, i) => <image key={i} href={src} x={x - 360 - k * 40} y={160} width={720 + 120} height={720} preserveAspectRatio="xMidYMid slice" clipPath={`url(#vf${i ? "R" : "L"})`} opacity={cl0 < 1 ? cl0 : 1} />)}
    <circle cx={660} cy={520} r={300} fill="none" stroke="#5a0e0e" strokeWidth={40} /><circle cx={1260} cy={520} r={300} fill="none" stroke="#5a0e0e" strokeWidth={40} />
    {[0, 1, 2].map((i) => <circle key={i} cx={900 + i * 60} cy={930} r={18} fill={i === k ? "#FFD84A" : "#5a0e0e"} />)}
    {txt(960, 1020, N[k], 60, K.white, 900, SANS)}
  </Svg></AbsoluteFill></F>);
};
// ── RADIO_KNOB: perilla de radio vieja: girás a la derecha hasta el tope y la aguja del dial llega a OFF
export const radio_knob: H = ({ dur }) => {
  const t = useT(), r = eio(pr(t, 0.4, 2.2)) * 270;
  return (<F dur={dur}><AbsoluteFill style={{ background: "#5b3a22" }}><Svg>
    <rect x={260} y={180} width={1400} height={720} rx={40} fill="#8a5a32" stroke="#3a2210" strokeWidth={10} />
    <rect x={360} y={260} width={1200} height={170} rx={14} fill="#F2DFA8" stroke="#3a2210" strokeWidth={6} />
    {["ON", "", "", "", "", "", "", "", "OFF"].map((s, i) => <g key={i}><line x1={420 + i * 135} y1={290} x2={420 + i * 135} y2={330} stroke="#3a2210" strokeWidth={4} />{s && txt(420 + i * 135, 400, s, 44, i ? K.red : K.green, 900, SANS)}</g>)}
    <line x1={lerp(420, 1500, r / 270)} y1={270} x2={lerp(420, 1500, r / 270)} y2={420} stroke={K.red} strokeWidth={8} />
    <g transform={`translate(960 680) rotate(${r})`}><circle r={160} fill="#2a1a10" /><circle r={130} fill="#4a3020" />{Array.from({ length: 24 }, (_, i) => <line key={i} x1={0} y1={-130} x2={0} y2={-160} stroke="#2a1a10" strokeWidth={8} transform={`rotate(${i * 15})`} />)}<line x1={0} y1={-20} x2={0} y2={-120} stroke="#F2DFA8" strokeWidth={14} strokeLinecap="round" /></g>
    <path d="M1180 600 A240 240 0 0 1 1180 760" stroke={K.cream} strokeWidth={8} fill="none" />{txt(1260, 700, "RIGHT", 50, K.cream, 900, SANS, "start")}
    {r >= 269 && txt(960, 980, "UNTIL IT STOPS", 60, K.cream, 900, SANS)}
  </Svg></AbsoluteFill></F>);
};
// ── MARIONETTE: marioneta: el hilo levanta el brazo del flotador y lo deja colgado de un lápiz
export const marionette: H = ({ dur }) => {
  const t = useT(), up = eio(pr(t, 0.5, 1.8)), sw = Math.sin(t * 2) * 3;
  return (<F dur={dur}><AbsoluteFill style={{ background: "#22303d" }}><Svg>
    <g transform={`rotate(${sw} 960 120)`}><rect x={700} y={100} width={520} height={30} rx={10} fill="#c8a46a" /><rect x={940} y={60} width={40} height={110} fill="#c8a46a" /></g>
    <line x1={1100} y1={130} x2={1100} y2={lerp(640, 360, up)} stroke={K.white} strokeWidth={4} />
    <Tank x={960} y={720} s={1} lvl={0.4} />
    <g transform={`translate(760 700) rotate(${-up * 40})`}><rect x={0} y={-10} width={360} height={20} rx={8} fill="#999" /><circle cx={380} cy={0} r={60} fill="#E9E2D0" stroke={K.ink} strokeWidth={5} /></g>
    {lbl(t, "TIE THE ARM UP", 0.3, 1010)}
    <Pencil t={t} at={1.8} x={1350} y={260} text="string + pencil" col={K.cream} to={[1110, 200]} />
  </Svg></AbsoluteFill></F>);
};
// ── SNOW_GLOBE: bola de nieve: v0 sacudida, el polvo cae en un montón sobre el flapper · v1 revuelto en el balde, nube pareja que desaparece
export const snow_globe: H = ({ dur, v = 0 }) => {
  const t = useT(), D = dur / 30;
  const flakes = Array.from({ length: 70 }, (_, i) => i);
  return (<F dur={dur}><AbsoluteFill style={{ background: "#1d2a3a" }}><Svg>
    <clipPath id={"sg" + v}><circle cx={960} cy={500} r={360} /></clipPath>
    <circle cx={960} cy={500} r={360} fill="#2c5a7a" opacity={0.6} />
    <g clipPath={`url(#sg${v})`}>
      {v === 0 ? <><rect x={880} y={790} width={160} height={30} rx={8} fill="#151515" />
        {flakes.map((i) => { const fx = 700 + (i * 53) % 520, p = eIn(pr(t, 0.3 + (i % 10) * 0.08, 2.4 + (i % 10) * 0.1)), ex = 960 + ((i % 9) - 4) * 10, ey = 780 - (i % 7) * 8; return <circle key={i} cx={lerp(fx, ex, p)} cy={lerp(200 + (i * 17) % 200, ey, p)} r={8} fill="#fff" />; })}
        <g opacity={cl((t - 2.6) * 2)}>{txt(960, 560, "A PILE", 80, "#fff", 900, SANS)}{txt(960, 630, "right on the flapper", 44, K.cream, 700, HAND)}</g></>
        : <>{flakes.map((i) => { const a = i * 0.7 + t * 2.5, r = 60 + (i * 41) % 260; return <circle key={i} cx={960 + Math.cos(a) * r} cy={500 + Math.sin(a) * r * 0.8} r={8 * (1 - pr(t, 1.5, D - 0.8))} fill="#fff" />; })}
        <g opacity={cl((t - 1.6) * 2)}>{txt(960, 520, "EVEN", 110, "#fff", 900, SANS)}{txt(960, 600, "dissolved in the bucket", 44, K.cream, 700, HAND)}</g></>}
    </g>
    <circle cx={960} cy={500} r={360} fill="none" stroke="#cfe3ef" strokeWidth={10} opacity={0.6} />
    <path d="M700 820 L1220 820 L1300 1000 L620 1000 Z" fill="#6b4a2e" />
  </Svg></AbsoluteFill></F>);
};
// ── PLIMSOLL: marca de carga de los barcos (disco de Plimsoll) pintada en la pared del tanque: el agua sube hasta la línea
export const plimsoll: H = ({ dur }) => {
  const t = useT(), w = eout(pr(t, 0.3, 2.4));
  return (<F dur={dur}><AbsoluteFill style={{ background: K.porcelain }}><Svg>
    <rect x={0} y={lerp(1080, 500, w)} width={1920} height={600} fill={K.water} opacity={0.6} />
    <circle cx={820} cy={500} r={120} fill="none" stroke={K.red} strokeWidth={14} /><line x1={660} y1={500} x2={980} y2={500} stroke={K.red} strokeWidth={14} />
    {[["T", 400], ["S", 500], ["W", 600]].map(([s, y]: any) => <g key={s}><line x1={1080} y1={y} x2={1260} y2={y} stroke={K.red} strokeWidth={12} />{txt(1300, y + 18, s, 50, K.red, 900, SANS, "start")}</g>)}
    <line x1={1040} y1={380} x2={1040} y2={640} stroke={K.red} strokeWidth={12} />
    {lbl(t, "THE LINE ON THE INSIDE WALL", 0.3, 160, K.navy)}
  </Svg></AbsoluteFill></F>);
};
// ── RUBBER_BAND: banda elástica que se estira con el reloj: a la hora se pone blanca y se corta
export const rubber_band: H = ({ dur }) => {
  const t = useT(), s = eio(pr(t, 0.2, 2.6)), snap = pr(t, 2.6, 2.8);
  return (<F dur={dur}><AbsoluteFill style={{ background: "#f1e6cc" }}><Svg>
    <circle cx={lerp(860, 400, s)} cy={540} r={40} fill="#555" /><circle cx={lerp(1060, 1520, s)} cy={540} r={40} fill="#555" />
    {snap < 0.5 ? <path d={`M${lerp(860, 400, s)} 500 L${lerp(1060, 1520, s)} 500 M${lerp(860, 400, s)} 580 L${lerp(1060, 1520, s)} 580`} stroke={`rgb(${lerp(196, 230, s)},${lerp(98, 200, s)},${lerp(60, 180, s)})`} strokeWidth={lerp(26, 8, s)} />
      : <g><path d="M400 500 q120 80 60 140" stroke="#e6c8b4" strokeWidth={8} fill="none" /><path d="M1520 580 q-120 -80 -60 -140" stroke="#e6c8b4" strokeWidth={8} fill="none" />{txt(960, 560, "SNAP", 100, K.red, 900, SANS)}</g>}
    {txt(960, 300, `${Math.round(s * 60)} MIN`, 90, K.navy, 900, SLAB)}
    {lbl(t, "ACID IS HARD ON RUBBER", 0.3, 900, K.ink)}
  </Svg></AbsoluteFill></F>);
};
// ── RECORD_SCRATCH: disco de vinilo: la púa raya el surco y queda la marca. v0 nada de metal en el anillo · v1 el rayón de la porcelana junta suciedad
export const record_scratch: H = ({ dur, v = 0 }) => {
  const t = useT(), rot = t * (t < 1.2 ? 200 : 40), sc = pr(t, 1.0, 1.3);
  return (<F dur={dur}><AbsoluteFill style={{ background: "#1a1a1a" }}><Svg>
    <g transform={`translate(860 540) rotate(${rot})`}><circle r={420} fill={v ? "#F6F3EA" : "#111"} />{Array.from({ length: 24 }, (_, i) => <circle key={i} r={130 + i * 12} fill="none" stroke={v ? "#ddd" : "#2a2a2a"} strokeWidth={2} />)}
      <circle r={120} fill={K.red} />{txt(0, 14, v ? "PORCELAIN" : "THE RING", 30, K.white, 900, SANS)}
      {sc > 0 && <path d="M180 -60 L400 40" stroke={v ? "#555" : "#ccc"} strokeWidth={6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - sc} />}</g>
    <g transform={`rotate(${lerp(-30, -8, pr(t, 0.2, 0.8))} 1500 200)`}><line x1={1500} y1={200} x2={1180} y2={560} stroke="#bbb" strokeWidth={18} /><rect x={1150} y={540} width={60} height={40} fill="#888" /></g>
    {sc > 0 && txt(1500, 760, v ? "IT HOLDS DIRT" : "NO METAL", 70, K.red, 900, SANS)}
  </Svg></AbsoluteFill></F>);
};

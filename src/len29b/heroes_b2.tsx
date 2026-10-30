// len29b · componentes únicos 16-29 (10:22 → 21:40). Mismo escenario (Stage); un objeto que se entiende sin leer.
import React from "react";
import { AMB, DIM, H, HAND, Head, ICE, MARK, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

const W = "#7fc4ea", GREASE = "#e3cf8e", PVC = "#eeeae2", STEEL = "#c8cdd2";
const rn = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

// ---- 10:22 · EL PLANO AZUL: la espiral de mano se dibuja como plano técnico, trazo por trazo, y sus partes se nombran ----
export const HBlueprint: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="radial-gradient(ellipse at 50% 45%, #123a63, #071a30 75%)">{(tt) => {
  const d = (a: number) => ({ strokeDasharray: 1600, strokeDashoffset: 1600 * (1 - eio(tt, a, a + 1.1)) });
  return <>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px) 0 0/40px 40px, linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px) 0 0/40px 40px" }} />
    <Head tt={tt} kick="THE $20 TOOL" title="A HAND AUGER" col={ICE} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }} fill="none" stroke="#dbeeff" strokeWidth={4}>
      <circle cx={700} cy={580} r={220} style={d(0.4)} /><circle cx={700} cy={580} r={60} style={d(0.8)} />
      <path d="M 700 580 L 470 380 L 420 420" style={d(1.3)} /><rect x={900} y={555} width={70} height={50} style={d(1.7)} />
      <path d="M 970 580 C 1150 580 1250 640 1400 600 S 1600 520 1700 600" style={d(2.1)} strokeWidth={6} />
      <circle cx={935} cy={540} r={14} style={d(2.6)} />
    </svg>
    <Tag tt={tt} at={1.6} x={700} y={860} txt="DRUM · 25 FT INSIDE" col={TX} size={30} />
    <Tag tt={tt} at={2.2} x={430} y={330} txt="HANDLE" col={TX} size={30} />
    <Tag tt={tt} at={2.9} x={940} y={480} txt="LOCK SCREW" col={AMB} size={30} />
    <Tag tt={tt} at={3.4} x={1520} y={500} txt="¼ INCH STEEL CABLE" col={TX} size={30} />
  </>;
}}</Stage>;

// ---- 11:00 · EL SACACORCHOS: el cable gira sobre sí mismo y por girar encuentra la curva; empujar solo, choca ----
export const HCorkscrew: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const adv = eio(tt, 0.8, 4.8), path = (u: number) => u < 0.55 ? [300 + u / 0.55 * 900, 520] : [1200 + 160 * Math.sin((u - 0.55) / 0.45 * Math.PI / 2), 520 + 160 * (1 - Math.cos((u - 0.55) / 0.45 * Math.PI / 2)) + 300 * Math.max(0, (u - 0.55) / 0.45 - 0.0) ** 2];
  return <>
    <Head tt={tt} kick="TURN AND PUSH" title="THE TURN FINDS THE BEND" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d="M 260 520 L 1200 520 Q 1360 520 1360 680 L 1360 1000" stroke="#4a4d52" strokeWidth={120} fill="none" />
      <path d="M 260 520 L 1200 520 Q 1360 520 1360 680 L 1360 1000" stroke="#16181a" strokeWidth={96} fill="none" />
      {Array.from({ length: 70 }, (_, i) => { const u = (i / 70) * adv; if (u <= 0) return null; const [x, y] = path(u), ph = i * 0.8 - tt * 14;
        return <ellipse key={i} cx={x} cy={y} rx={9} ry={28} fill="none" stroke={STEEL} strokeWidth={5} transform={`rotate(${u < 0.55 ? 0 : (u - 0.55) / 0.45 * 90} ${x} ${y}) translate(${6 * Math.sin(ph)} 0)`} opacity={0.6 + 0.4 * Math.cos(ph)} />; })}
    </svg>
    <Tag tt={tt} at={1.4} x={600} y={400} txt="TURN" col={AMB} size={56} />
    <Tag tt={tt} at={2.0} x={900} y={400} txt="+ PUSH" col={TX} size={56} />
  </>;
}}</Stage>;

// ---- 11:32 · EL SISMÓGRAFO DE LA MANO: la aguja anota lo que siente el cable; recto liso, la curva dura, el tapón blando ----
export const HSeismo: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const run = eio(tt, 0.6, 5.0) * 1400;
  const y = (x: number) => { const u = x / 1400; if (u < 0.35) return 6 * Math.sin(x * 0.2); if (u < 0.55) return 70 * Math.sin(x * 0.09) * Math.sin(((u - 0.35) / 0.2) * Math.PI); if (u < 0.75) return 18 * Math.sin(x * 0.04) + 40 * Math.sin(((u - 0.55) / 0.2) * Math.PI); return 4 * Math.sin(x * 0.3); };
  const pts = Array.from({ length: Math.max(2, Math.floor(run / 6)) }, (_, i) => `${260 + i * 6},${600 - y(i * 6)}`).join(" ");
  return <>
    <Head tt={tt} kick="WHAT YOUR HAND FEELS" title="SOFT · LIKE WET SOAP" col={ICE} />
    <div style={{ position: "absolute", left: 240, top: 380, width: 1440, height: 440, borderRadius: 14, background: "repeating-linear-gradient(0deg,#f4efe2 0 39px,#e3d8c2 39px 40px)", boxShadow: "0 40px 80px rgba(0,0,0,.6)" }} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <polyline points={pts} fill="none" stroke="#2b2b2e" strokeWidth={4} />
      <line x1={260 + run} y1={330} x2={260 + run} y2={600 - y(run)} stroke="#555" strokeWidth={3} /><circle cx={260 + run} cy={600 - y(run)} r={8} fill={RED} />
    </svg>
    {[["STRAIGHT", 0.18, TX], ["THE BEND", 0.45, AMB], ["THE CANDLE", 0.65, RED], ["THROUGH", 0.88, ICE]].map(([n, u, c], i) =>
      <Tag key={i} tt={tt} at={0.6 + (u as number) * 4.4} x={260 + 1400 * (u as number)} y={870} txt={n as string} col={c as string} size={30} />)}
  </>;
}}</Stage>;

// ---- 12:40 · EL CUADRANTE DEL TALADRO: la aguja sube hasta rojo y el cable latiguea; vuelve a lento y el cable gira prolijo ----
export const HDial: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const v = tt < 2.6 ? eio(tt, 0.6, 2.2) : 1 - 0.8 * eio(tt, 2.6, 3.6), ang = -120 + 240 * v, whip = cl((v - 0.7) / 0.3);
  return <>
    <Head tt={tt} kick="AUGER ON A DRILL" title="GO SLOW" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <g transform="translate(640 620)">
        <path d="M -260 0 A 260 260 0 0 1 260 0" stroke="#3a3c40" strokeWidth={40} fill="none" transform="rotate(-30)" />
        <path d="M -225 130 A 260 260 0 0 1 -130 -225" stroke={ICE} strokeWidth={40} fill="none" />
        <path d="M 130 -225 A 260 260 0 0 1 225 130" stroke={RED} strokeWidth={40} fill="none" />
        <line x1={0} y1={0} x2={0} y2={-220} stroke={TX} strokeWidth={10} strokeLinecap="round" transform={`rotate(${ang})`} /><circle r={24} fill={TX} />
      </g>
      <path d={`M 1050 620 ${Array.from({ length: 14 }, (_, i) => `Q ${1080 + i * 50} ${620 + (i % 2 ? 1 : -1) * (12 + 120 * whip) * Math.sin(tt * 30 + i)} ${1100 + i * 50} 620`).join(" ")}`} stroke={STEEL} strokeWidth={8} fill="none" />
    </svg>
    <Tag tt={tt} at={2.0} x={1380} y={430} txt="FULL SPEED: WHIPS" col={RED} size={32} />
    <Tag tt={tt} at={3.6} x={640} y={900} txt="SLOW AND STEADY" col={ICE} size={36} />
  </>;
}}</Stage>;

// ---- 13:28 · LOS DOS REMOLINOS: las dos bachas vistas desde arriba, llenas; se destapan a la vez y giran juntas ----
export const HTwinVortex: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const go = cl((tt - 1.6) / 3), lvl = 1 - eio(tt, 1.6, 5.0);
  const Bowl = (cx: number, s: number) => <g transform={`translate(${cx} 600) scale(${s})`}>
    <rect x={-250} y={-200} width={500} height={400} rx={60} fill="#c3c9cf" /><rect x={-230} y={-180} width={460} height={360} rx={50} fill="#8fa3b0" opacity={0.25 + 0.6 * lvl} />
    {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M ${40 + i * 30} 0 A ${40 + i * 30} ${40 + i * 30} 0 0 1 0 ${40 + i * 30}`} stroke="rgba(255,255,255,.7)" strokeWidth={6} fill="none" transform={`rotate(${tt * 260 * go + i * 70})`} opacity={go * lvl} />)}
    <circle r={30} fill="#2a2a2c" /></g>;
  return <>
    <Head tt={tt} kick="THE PLUMBER'S TEST" title="BOTH SIDES AT ONCE" col={ICE} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{Bowl(680, cl(phys(tt, 0.3, 6, 0.6)))}{Bowl(1240, cl(phys(tt, 0.7, 6, 0.6)))}</svg>
    <Tag tt={tt} at={4.2} x={960} y={900} txt="A BIG SWIRL = CLEAR" col={ICE} size={38} />
  </>;
}}</Stage>;

// ---- 14:06 · EL MAPA DE SUBTE: la bacha, el triturador y el lavavajillas son tres líneas que se juntan en una estación: el sifón ----
export const HTransit: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const lines: [string, string, string][] = [["M 300 330 L 900 330 L 1100 560", ICE, "OTHER BOWL"], ["M 300 560 L 1100 560", AMB, "DISPOSAL"], ["M 300 800 L 700 800 L 900 640 L 1100 560", "#c58cf0", "DISHWASHER"]];
  return <>
    <Head tt={tt} kick="WITH A DISPOSAL" title="THREE LINES · ONE TRAP" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {lines.map(([d, c], i) => { const s = eio(tt, 0.5 + i * 0.7, 1.4 + i * 0.7); return <path key={i} d={d} stroke={c} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray="1200" strokeDashoffset={1200 * (1 - s)} />; })}
      <path d="M 1100 560 L 1650 560" stroke={TX} strokeWidth={28} strokeLinecap="round" strokeDasharray="600" strokeDashoffset={600 * (1 - eio(tt, 2.8, 3.6))} />
      <circle cx={1100} cy={560} r={44 * cl(phys(tt, 2.6, 7, 0.4))} fill="#111" stroke={TX} strokeWidth={10} />
    </svg>
    {lines.map(([, c, n], i) => <Tag key={n} tt={tt} at={0.9 + i * 0.7} x={300} y={[280, 510, 850][i]} txt={n} col={c} size={30} anchor="l" />)}
    <Tag tt={tt} at={3.2} x={1100} y={660} txt="THE TRAP" col={TX} size={34} />
    <Tag tt={tt} at={4.0} x={1450} y={430} txt="PLUNGE THE PLAIN SIDE" col={AMB} size={30} />
  </>;
}}</Stage>;

// ---- 14:49 · LA MESA DE ACCIÓN DE GRACIAS: vista desde arriba; en cada plato aparece una costumbre del día ----
export const HDinnerTable: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const seats: [number, number, string, React.ReactNode][] = [
    [560, 420, "A STRAINER", <circle r={60} fill="none" stroke="#c9cdd2" strokeWidth={10} strokeDasharray="6 6" />],
    [1360, 420, "A COFFEE CAN", <g><circle r={62} fill="#7d828a" /><circle r={48} fill="#efe6c8" /></g>],
    [560, 760, "WIPE EVERY PAN", <rect x={-55} y={-60} width={110} height={120} rx={6} fill="#f7f5ef" />],
    [1360, 760, "COLD WATER", <g><rect x={-36} y={-60} width={72} height={120} rx={10} fill="rgba(170,215,240,.55)" stroke="#fff" strokeWidth={3} /></g>],
  ];
  return <>
    <Head tt={tt} kick="BEFORE THE BIG DINNER" title="THE PLUMBER'S TABLE" col={AMB} />
    <div style={{ position: "absolute", left: 360, top: 300, width: 1200, height: 580, borderRadius: 300, background: "radial-gradient(ellipse,#8a5f3a,#5e3d22)", boxShadow: "0 50px 90px rgba(0,0,0,.6)", transform: `scale(${cl(phys(tt, 0.2, 5, 0.6))})` }} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <ellipse cx={960} cy={590} rx={170} ry={110} fill="#c58a4a" opacity={cl(phys(tt, 0.6, 6, 0.5))} />
      {seats.map(([x, y, , it], i) => { const s = phys(tt, 1.0 + i * 0.7, 7, 0.42);
        return <g key={i} transform={`translate(${x} ${y})`}><circle r={100} fill="#f4f1ea" /><circle r={78} fill="#e8e2d4" />
          <g transform={`translate(0 ${(1 - s) * -300}) scale(${cl(s)})`}>{it}</g></g>; })}
    </svg>
    {seats.map(([x, y, n], i) => <Tag key={n} tt={tt} at={1.3 + i * 0.7} x={x} y={y + 140} txt={n} col={TX} size={28} />)}
  </>;
}}</Stage>;

// ---- 15:39 · LA NOCHE DE LOS ONCE: un reloj de 4 de la tarde a 2 de la mañana; once alfileres caen sobre el arco ----
export const HClockPins: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const hand = eio(tt, 0.6, 5.0);
  return <>
    <Head tt={tt} kick="THANKSGIVING EVE · 1998" title="11 SINKS IN ONE NIGHT" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <g transform="translate(960 600)">
        <circle r={330} fill="#f3eee3" /><circle r={330} fill="none" stroke="#3a2e22" strokeWidth={16} />
        {Array.from({ length: 12 }, (_, i) => <rect key={i} x={-5} y={-310} width={10} height={36} fill="#3a2e22" transform={`rotate(${i * 30})`} />)}
        {/* 4 pm → 2 am = 10 horas: el arco que recorre la aguja */}
        <path d={`M ${300 * Math.sin((120 * Math.PI) / 180)} ${-300 * Math.cos((120 * Math.PI) / 180)} A 300 300 0 1 1 ${300 * Math.sin(((120 + 300 * hand) * Math.PI) / 180)} ${-300 * Math.cos(((120 + 300 * hand) * Math.PI) / 180)}`} stroke={AMB} strokeWidth={26} fill="none" opacity={0.6} />
        <line x1={0} y1={0} x2={0} y2={-230} stroke="#2a2a2a" strokeWidth={14} strokeLinecap="round" transform={`rotate(${120 + 300 * hand})`} />
        {Array.from({ length: 11 }, (_, i) => { const a = 120 + (i + 0.5) * (300 / 11), s = phys(tt, 0.8 + (i * 4) / 11, 8, 0.4); if (s <= 0.01) return null;
          return <g key={i} transform={`rotate(${a}) translate(0 ${-300 - (1 - s) * 200})`}><line x1={0} y1={0} x2={0} y2={-40} stroke="#555" strokeWidth={4} /><circle cy={-44} r={14} fill={RED} /></g>; })}
      </g>
    </svg>
    <Tag tt={tt} at={5.2} x={960} y={1010} txt="EVERY ONE: GREASE" col={RED} size={34} />
  </>;
}}</Stage>;

// ---- 16:27 · EL HIERRO DEL HORMIGÓN: un bloque de grasa se abre y adentro el pelo hace de varilla ----
export const HRebar: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const open = eio(tt, 1.2, 2.8), b = cl(phys(tt, 0.3, 5, 0.6));
  return <>
    <Head tt={tt} kick="CUT A CANDLE OPEN" title="HAIR IS THE BONES" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {[-1, 1].map((sd) => <g key={sd} transform={`translate(${sd * 160 * open} 0)`} opacity={b}>
        <rect x={sd < 0 ? 560 : 960} y={420} width={400} height={300} fill={GREASE} stroke="#b9a46a" strokeWidth={6} />
        {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M ${sd < 0 ? 560 : 960} ${450 + i * 30} q 100 ${(rn(i, sd) - 0.5) * 40} 200 0 t 200 0`} stroke="#3b2a20" strokeWidth={3} fill="none" opacity={0.4 + 0.6 * open} />)}</g>)}
      {/* al lado, la varilla en el hormigón */}
      <g opacity={eio(tt, 3.0, 3.8)} transform="translate(0 0)"><rect x={640} y={790} width={640} height={110} fill="#9b9890" />
        {[0, 1, 2].map((i) => <rect key={i} x={660} y={808 + i * 32} width={600} height={10} fill="#7a4b2a" />)}</g>
    </svg>
    <Tag tt={tt} at={2.2} x={960} y={360} txt="HAIR SNAGS FIRST" col={TX} size={36} />
    <Tag tt={tt} at={3.6} x={960} y={950} txt="LIKE STEEL IN CONCRETE" col={AMB} size={32} />
  </>;
}}</Stage>;

// ---- 17:20 · LA LATA DE STAN: una lata de café bajo la pileta; mes a mes la grasa sube en capas y se pone blanca y dura ----
export const HStanCan: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const fill = eio(tt, 0.8, 4.6), can = cl(phys(tt, 0.2, 6, 0.5));
  return <>
    <Head tt={tt} kick="STAN'S RULE" title="THE SINK IS FOR WATER" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(0 ${(1 - can) * -400})`} opacity={can}>
        <rect x={760} y={340} width={400} height={520} rx={18} fill="#8a9097" />
        {Array.from({ length: 6 }, (_, i) => { const k = cl(fill * 6 - i); return <rect key={i} x={772} y={848 - (i + 1) * 80 * k} width={376} height={80 * k} fill={i % 2 ? "#f2ecd8" : "#e7dcb8"} />; })}
        {Array.from({ length: 5 }, (_, i) => <rect key={i} x={760} y={380 + i * 100} width={400} height={6} fill="rgba(0,0,0,.18)" />)}
        <ellipse cx={960} cy={340} rx={200} ry={30} fill="#a3a9b0" />
      </g>
      <g transform={`translate(${1400 - 200 * eio(tt, 2.4, 3.2)} 600) rotate(${-30 * eio(tt, 2.4, 3.2)})`} opacity={eio(tt, 2.2, 2.6)}>
        <ellipse rx={150} ry={40} fill="#33302b" /><rect x={140} y={-12} width={200} height={24} rx={8} fill="#222" /></g>
    </svg>
    {["JAN", "MAR", "MAY", "JUL"].map((m, i) => <Tag key={m} tt={tt} at={1.0 + i * 0.9} x={640} y={800 - i * 90} txt={m} col={DIM} size={28} />)}
    <Tag tt={tt} at={4.4} x={1400} y={860} txt="FULL? IN THE GARBAGE" col={TX} size={32} />
  </>;
}}</Stage>;

// ---- 18:24 · DIEZ ALFILERES: la pared en corte con el brazo del sifón; caen diez alfileres y nueve se clavan en la curva ----
export const HPins10: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => <>
  <Head tt={tt} kick="9 OUT OF 10 KITCHEN CALLS" title="THE TURN IN THE WALL" col={RED} />
  <div style={{ position: "absolute", left: 980, top: 240, width: 820, height: 800, background: "linear-gradient(90deg,#9b8f7c,#bdb19c)", opacity: 0.55 }} />
  <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
    <path d="M 300 560 L 1180 560 Q 1300 560 1300 680 L 1300 1060" stroke="#e8e4da" strokeWidth={80} fill="none" />
    <path d="M 300 560 L 1180 560 Q 1300 560 1300 680 L 1300 1060" stroke="#1a1b1d" strokeWidth={56} fill="none" />
    {Array.from({ length: 10 }, (_, i) => { const s = phys(tt, 0.8 + i * 0.32, 8, 0.4); if (s <= 0.01) return null;
      const miss = i === 6, x = miss ? 700 : 1220 + (rn(i) - 0.5) * 80, y = miss ? 520 : 600 + rn(i, 2) * 70;
      return <g key={i} transform={`translate(${x} ${y - (1 - s) * 600})`}><line x1={0} y1={0} x2={0} y2={-60} stroke="#666" strokeWidth={5} /><circle cy={-64} r={16} fill={miss ? DIM : RED} /></g>; })}
  </svg>
  <Tag tt={tt} at={4.4} x={1500} y={340} txt="3 TO 6 FEET IN" col={AMB} size={36} />
  <Tag tt={tt} at={1.0} x={640} y={680} txt="THE TRAP ARM" col={TX} size={30} />
</>}</Stage>;

// ---- 19:20 · EL CAÑO DEL TECHO: la casa en corte; el aire baja por la ventilación hasta que un nido de pájaro la tapa ----
export const HRoofVent: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const house = cl(phys(tt, 0.2, 5, 0.6)), nest = phys(tt, 2.6, 7, 0.4);
  return <>
    <Head tt={tt} kick="ALWAYS GURGLES? SMELLS?" title="CHECK THE VENT" col={ICE} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <g opacity={house} transform={`translate(0 ${(1 - house) * 80})`}>
        <path d="M 560 520 L 960 260 L 1360 520 Z" fill="#6b3f2c" /><rect x={600} y={520} width={720} height={460} fill="#c9b79a" />
        <rect x={1100} y={200} width={40} height={780} fill="#e8e4da" /><rect x={1060} y={780} width={80} height={36} fill="#e8e4da" />
      </g>
      {Array.from({ length: 8 }, (_, i) => { const k = ((tt * 0.7 + i / 8) % 1), blocked = nest > 0.6; const y = 160 + k * (blocked ? 40 : 600);
        return <path key={i} d={`M 1120 ${y} l -14 -20 m 14 20 l 14 -20`} stroke={ICE} strokeWidth={5} fill="none" opacity={house * (blocked ? 1 - k * 3 : 1)} />; })}
      <g transform={`translate(1120 ${200 - (1 - nest) * 300})`} opacity={cl(nest * 2)}>
        {Array.from({ length: 16 }, (_, i) => <line key={i} x1={-50 + rn(i) * 30} y1={-8 + rn(i, 2) * 16} x2={20 + rn(i, 3) * 30} y2={-8 + rn(i, 4) * 16} stroke="#7a5a32" strokeWidth={5} />)}</g>
    </svg>
    <Tag tt={tt} at={3.4} x={1460} y={220} txt="A BIRD'S NEST" col={RED} size={34} />
    <Tag tt={tt} at={4.4} x={1460} y={300} txt="DON'T CLIMB · TELL HIM" col={TX} size={28} />
  </>;
}}</Stage>;

// ---- 20:52 · LAS TRES RAZONES: tres objetos en pedestales giran hacia cámara: la otra bacha, la manguera, la vela de la pared ----
export const HThreeReasons: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const objs: [string, React.ReactNode][] = [
    ["THE OTHER SIDE", <path d="M -110 -60 L 110 -60 L 90 70 L -90 70 Z" fill="#c3c9cf" />],
    ["THE HOSE", <path d="M -110 40 C -60 -90 60 90 110 -40" stroke="#5a5e63" strokeWidth={30} fill="none" strokeLinecap="round" />],
    ["THE CANDLE", <g><circle r={90} fill="#3a3c40" /><circle r={74} fill={GREASE} /><circle r={16} fill="#111" /></g>],
  ];
  return <>
    <Head tt={tt} kick="THE SHORT VERSION" title="3 REASONS IT FAILS" col={AMB} />
    {objs.map(([n, o], i) => { const s = phys(tt, 0.5 + i * 0.7, 6, 0.45), x = 480 + i * 480;
      return <div key={i} style={{ position: "absolute", left: x, top: 600, transform: `translate(-50%,-50%) translateY(${(1 - s) * 200}px)`, opacity: cl(s * 2) }}>
        <svg width={320} height={320} viewBox="-160 -160 320 320" style={{ transform: `rotateY(${(1 - s) * 80 + 8 * Math.sin(tt * 0.8 + i)}deg)` }}>{o}</svg>
        <div style={{ width: 300, height: 40, margin: "0 auto", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,210,150,.35), transparent 70%)" }} />
        <div style={{ textAlign: "center", fontWeight: 900, fontSize: 34, marginTop: 10 }}><span style={{ fontFamily: MARK, color: AMB, marginRight: 12 }}>{i + 1}</span>{n}</div></div>; })}
  </>;
}}</Stage>;

// ---- 21:40 · LA SARTÉN QUE SE LIMPIA: una servilleta barre la grasa de la sartén y la grasa cae en la lata, no en la pileta ----
export const HPanWipe: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const wipe = eio(tt, 0.8, 3.0), tilt = eio(tt, 3.2, 4.2);
  return <>
    <Head tt={tt} kick="FROM NOW ON" title="WIPE THE PAN FIRST" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <g transform={`rotate(${-25 * tilt} 1100 560)`}>
        <circle cx={860} cy={560} r={240} fill="#2b2b2e" /><circle cx={860} cy={560} r={210} fill="#3a3a3e" />
        <circle cx={860} cy={560} r={200} fill={GREASE} opacity={0.85 * (1 - wipe)} style={{ clipPath: `inset(0 0 0 ${wipe * 100}%)` }} />
        <rect x={1090} y={540} width={360} height={40} rx={14} fill="#1d1d1f" />
      </g>
      <g transform={`translate(${660 + 420 * wipe} ${560 + 30 * Math.sin(wipe * 12)}) rotate(${-10 + 20 * Math.sin(wipe * 6)})`} opacity={1 - tilt}>
        <path d="M -70 -80 L 70 -70 L 80 80 L -60 70 Z" fill="#faf8f2" /><path d="M -60 40 L 70 50" stroke={GREASE} strokeWidth={14} opacity={wipe} /></g>
      <g opacity={tilt}><rect x={1420} y={700} width={180} height={230} rx={12} fill="#7d828a" /><ellipse cx={1510} cy={700} rx={90} ry={16} fill="#efe6c8" /></g>
    </svg>
    <Tag tt={tt} at={3.4} x={1510} y={640} txt="INTO THE CAN" col={TX} size={34} />
  </>;
}}</Stage>;

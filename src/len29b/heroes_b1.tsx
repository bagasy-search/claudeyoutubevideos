// len29b · componentes únicos 1-15 (0:41 → 9:50). Viven en el Stage (foto del momento desenfocada, piso con luz, haz, motas):
// entran con su transición, los elementos llegan de a uno con resorte, la cámara curva y la salida se funde hacia atrás.
import React from "react";
import { AMB, DIM, H, HAND, Head, ICE, MARK, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

const W = "#7fc4ea", WD = "#3f86b5", GRAY = "#8d8a7e", GREASE = "#e3cf8e", PVC = "#eeeae2", STEEL = "#c8cdd2";
const rn = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const grads = <defs>
  <linearGradient id="bP" x1="0" x2="1"><stop offset="0" stopColor="#cfccc4" /><stop offset=".5" stopColor="#fbfaf6" /><stop offset="1" stopColor="#c6c2b9" /></linearGradient>
  <linearGradient id="bW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={W} /><stop offset="1" stopColor={WD} /></linearGradient>
  <linearGradient id="bG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9b978a" /><stop offset="1" stopColor="#5d5a50" /></linearGradient>
  <linearGradient id="bS" x1="0" x2="1"><stop offset="0" stopColor="#8e959c" /><stop offset=".45" stopColor="#f2f4f6" /><stop offset="1" stopColor="#7d848b" /></linearGradient>
</defs>;

// ---- 0:41 · LA PARED DE TELÉFONOS: doce teléfonos de disco llegan de a uno y cada uno empieza a sonar (se sacude y brilla) ----
const Phone: React.FC<{ ring: number; col: string }> = ({ ring, col }) => <svg width={170} height={150} viewBox="0 0 170 150">
  <path d="M 20 70 Q 85 0 150 70 L 140 92 L 110 80 L 112 64 Q 85 52 58 64 L 60 80 L 30 92 Z" fill={col} transform={`translate(0 ${-14 * ring}) rotate(${8 * Math.sin(ring * 40)} 85 60)`} />
  <path d="M 30 98 L 140 98 L 156 144 L 14 144 Z" fill={col} /><circle cx={85} cy={118} r={20} fill="#f2ebdc" /><circle cx={85} cy={118} r={6} fill="#333" />
</svg>;
export const HPhoneWall: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => <>
  <Head tt={tt} kick="THANKSGIVING EVE" title="THE BUSIEST NIGHT OF MY YEAR" col={AMB} />
  {Array.from({ length: 12 }, (_, i) => {
    const a = 0.5 + i * 0.32, s = phys(tt, a, 7, 0.4); if (s <= 0.01) return null;
    const ring = tt > a + 0.6 ? Math.abs(Math.sin((tt - a) * 9)) * (0.6 + 0.4 * Math.sin(tt * 2 + i)) : 0;
    const x = 330 + (i % 6) * 220, y = 330 + Math.floor(i / 6) * 260;
    return <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translateY(${(1 - s) * -500}px) scale(${0.7 + 0.3 * s})`, filter: `drop-shadow(0 0 ${30 * ring}px rgba(255,190,90,.8)) drop-shadow(0 26px 30px rgba(0,0,0,.6))` }}>
      <Phone ring={ring} col={["#2d2b28", "#c9b48c", "#8c2f26", "#d9d4c7"][i % 4]} /></div>;
  })}
  <Tag tt={tt} at={4.6} x={960} y={930} txt="MORE SINKS THAN ANY NIGHT" col={AMB} size={40} />
</>}</Stage>;

// ---- 1:08 · LOS DOS LADRONES: el empujón del sopapapo baja como un pulso azul y dos caños lo chupan de costado antes de llegar ----
export const HThieves: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const pulse = (tt * 0.55) % 1, b1 = cl(phys(tt, 1.2, 6, 0.6)), b2 = cl(phys(tt, 2.4, 6, 0.6));
  const left = 1 - 0.45 * b1 * cl((pulse - 0.32) * 8) - 0.45 * b2 * cl((pulse - 0.58) * 8);
  return <>
    <Head tt={tt} kick="WHY THE PLUNGER LOSES" title="TWO THINGS STEAL THE PUSH" col={ICE} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{grads}
      <rect x={900} y={250} width={120} height={720} fill="url(#bP)" />
      {/* las dos fugas */}
      <g opacity={b1} transform={`translate(${(1 - b1) * 200} 0)`}><rect x={1020} y={430} width={420 * b1} height={80} fill="url(#bP)" /></g>
      <g opacity={b2} transform={`translate(${(b2 - 1) * 200} 0)`}><rect x={900 - 420 * b2} y={640} width={420 * b2} height={80} fill="url(#bP)" /></g>
      {/* el pulso */}
      <rect x={912} y={260 + pulse * 690} width={96} height={46} rx={10} fill={W} opacity={left} />
      {b1 > 0.5 && pulse > 0.32 && <rect x={1030 + (pulse - 0.32) * 900} y={448} width={60} height={44} rx={10} fill={W} opacity={0.8 * (1 - cl((pulse - 0.32) * 2.5))} />}
      {b2 > 0.5 && pulse > 0.58 && <rect x={830 - (pulse - 0.58) * 900} y={658} width={60} height={44} rx={10} fill={W} opacity={0.8 * (1 - cl((pulse - 0.58) * 2.5))} />}
      <ellipse cx={960} cy={980} rx={110 * cl(phys(tt, 0.4, 5, 0.6))} ry={30} fill={GRAY} />
    </svg>
    <Tag tt={tt} at={1.6} x={1480} y={400} txt="THE OTHER SIDE" col={AMB} />
    <Tag tt={tt} at={2.8} x={440} y={610} txt="THE DISHWASHER" col={AMB} />
    <Tag tt={tt} at={3.6} x={1240} y={985} txt="CLOG · BARELY TOUCHED" col={RED} size={30} />
  </>;
}}</Stage>;

// ---- 2:28 · LA FUENTE: la pileta doble en corte; cada bombeo de la izquierda cruza por el caño de unión y salta por la derecha ----
export const HFountain: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const pump = tt > 1.2 ? Math.max(0, Math.sin((tt - 1.2) * 4.2)) : 0, jet = pump * cl(phys(tt, 1.2, 4, 0.6));
  return <>
    <Head tt={tt} kick="DOUBLE KITCHEN SINK" title="IT GOES THE EASY WAY" col={ICE} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{grads}
      {/* las dos bachas */}
      {[560, 1100].map((x, i) => <g key={i}><path d={`M ${x} 380 L ${x + 300} 380 L ${x + 270} 560 L ${x + 30} 560 Z`} fill="url(#bS)" opacity={0.85} />
        <path d={`M ${x + 14} ${420 - (i ? 30 * jet : 0)} L ${x + 286} ${420 - (i ? 30 * jet : 0)} L ${x + 266} 548 L ${x + 34} 548 Z`} fill="url(#bG)" opacity={0.9} /></g>)}
      {/* caños de cola, la unión y el sifón común */}
      <rect x={690} y={560} width={44} height={150} fill="url(#bP)" /><rect x={1230} y={560} width={44} height={100} fill="url(#bP)" />
      <rect x={734} y={660} width={496} height={44} fill="url(#bP)" />
      <path d="M 1230 704 L 1230 800 Q 1230 880 1300 880 Q 1370 880 1370 800 L 1370 760 L 1414 760 L 1414 800 Q 1414 924 1300 924 Q 1186 924 1186 800 L 1186 704 Z" fill="url(#bP)" />
      {/* el sopapo bombeando a la izquierda */}
      <g transform={`translate(0 ${30 * pump})`}><rect x={704} y={170} width={16} height={190} fill="#8a5a33" /><path d="M 640 360 Q 712 300 784 360 L 770 392 L 654 392 Z" fill="#c2302a" /></g>
      {/* el agua cruza: flechas que corren por la unión */}
      {Array.from({ length: 6 }, (_, i) => { const u = ((tt * 1.3 + i / 6) % 1); return <path key={i} d={`M ${750 + u * 460} 672 l 24 10 l -24 10 z`} fill={W} opacity={jet} />; })}
      {/* el chorro de la derecha */}
      {Array.from({ length: 22 }, (_, i) => { const k = ((tt * 1.6 + rn(i) ) % 1); const y = 400 - jet * 330 * Math.sin(k * Math.PI), x = 1250 + (rn(i, 2) - 0.5) * 90 * k;
        return <circle key={i} cx={x} cy={y} r={8 + 8 * rn(i, 3)} fill="#a39d88" opacity={jet * (1 - k * 0.4)} />; })}
    </svg>
    <Tag tt={tt} at={2.2} x={600} y={250} txt="PUSH HERE" col={TX} />
    <Tag tt={tt} at={2.9} x={1520} y={260} txt="COMES UP HERE" col={RED} />
  </>;
}}</Stage>;

// ---- 2:46 · EL TECHO DE LA SEÑORA NOVAK: una cocina en corte; la mancha crece en el techo y empieza a gotear ----
export const HCeiling: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const room = cl(phys(tt, 0.2, 5, 0.7)), stain = eio(tt, 1.2, 4.5);
  return <>
    <Head tt={tt} kick="BERWYN · 1984" title="NOT THE WINDOW. THE CEILING" col={AMB} />
    <div style={{ position: "absolute", left: 460, top: 260, width: 1000, height: 640, transform: `scale(${0.9 + 0.1 * room})`, opacity: room, background: "linear-gradient(180deg,#e8dcc4,#d7c7a8)", boxShadow: "0 50px 90px rgba(0,0,0,.6), inset 0 0 0 10px #6b5a43", borderRadius: 6, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 60, background: "#f2ece0" }} />
      {/* la mancha del techo */}
      <div style={{ position: "absolute", left: 280, top: 6, width: 420 * stain, height: 90 * stain, transform: "translateX(-50%)", marginLeft: 210, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(110,96,70,.75), rgba(110,96,70,.0) 70%)" }} />
      {/* ventana, mesada, pileta */}
      <div style={{ position: "absolute", left: 360, top: 140, width: 280, height: 200, background: "linear-gradient(180deg,#a8cbe0,#e6f0f5)", boxShadow: "inset 0 0 0 10px #f4efe6" }} />
      <div style={{ position: "absolute", left: 120, right: 120, top: 430, height: 40, background: "#8b6b47" }} />
      <div style={{ position: "absolute", left: 380, top: 418, width: 240, height: 24, background: "#c6ccd2", borderRadius: 4 }} />
      {/* gotas */}
      {Array.from({ length: 8 }, (_, i) => { const a = 2 + i * 0.35, k = ((tt - a) % 1.1) / 1.1; if (tt < a) return null;
        return <div key={i} style={{ position: "absolute", left: 420 + (i % 4) * 50, top: 60 + k * 360, width: 10, height: 16, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "#9a8a68", opacity: 1 - k }} />; })}
    </div>
    <Tag tt={tt} at={3.4} x={960} y={960} txt="20 MINUTES OF PLUNGING" col={RED} size={36} />
  </>;
}}</Stage>;

// ---- 3:22 · EL SÁNDWICH: trapo mojado, plato y mano caen de a uno sobre el otro desagüe; recién ahí el empujón va para abajo ----
export const HSandwich: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const r = phys(tt, 0.5, 7, 0.45), p = phys(tt, 1.3, 7, 0.45), hd = phys(tt, 2.1, 7, 0.45), arrow = eio(tt, 3.0, 4.0);
  return <>
    <Head tt={tt} kick="BLOCK THE OTHER SIDE" title="RAG · PLATE · HAND" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{grads}
      <ellipse cx={960} cy={720} rx={300} ry={70} fill="url(#bS)" /><ellipse cx={960} cy={720} rx={60} ry={16} fill="#2a2a2c" />
      <g transform={`translate(0 ${(1 - r) * -600})`} opacity={cl(r * 3)}><ellipse cx={960} cy={706} rx={130} ry={34} fill="#b9c6c9" /><path d="M 840 700 Q 960 670 1080 700" stroke="#93a3a7" strokeWidth={6} fill="none" /></g>
      <g transform={`translate(0 ${(1 - p) * -600})`} opacity={cl(p * 3)}><ellipse cx={960} cy={678} rx={210} ry={52} fill="#f5f2ea" /><ellipse cx={960} cy={674} rx={150} ry={34} fill="#e6e1d4" /></g>
      <g transform={`translate(0 ${(1 - hd) * -600})`} opacity={cl(hd * 3)}><path d="M 860 640 Q 880 560 960 560 Q 1050 560 1070 640 Z" fill="#d8a888" /><rect x={930} y={430} width={80} height={140} rx={30} fill="#d8a888" /></g>
    </svg>
    {/* del otro lado, la flecha baja */}
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d={`M 1500 420 L 1500 ${420 + 360 * arrow}`} stroke={W} strokeWidth={26} strokeLinecap="round" opacity={arrow} />
      <path d={`M 1460 ${760 * arrow + 40 * (1 - arrow)} l 40 50 l 40 -50 z`} fill={W} opacity={arrow} transform={`translate(0 ${20 * (1 - arrow)})`} />
    </svg>
    <Tag tt={tt} at={3.4} x={1500} y={360} txt="ONLY WAY: DOWN" col={ICE} />
  </>;
}}</Stage>;

// ---- 4:03 · EL GÉISER DEL AIR GAP: el cilindro cromado de la mesada escupe agua sucia por las ranuras a cada bombeo ----
export const HGeyser: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const c = cl(phys(tt, 0.3, 5, 0.6)), pump = tt > 1.4 ? Math.max(0, Math.sin((tt - 1.4) * 4)) : 0;
  return <>
    <Head tt={tt} kick="NEXT TO YOUR FAUCET" title="THE AIR GAP" col={ICE} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{grads}
      <rect x={300} y={700} width={1320} height={40} rx={8} fill="#6d6458" opacity={c} />
      <g transform={`translate(0 ${(1 - c) * 300})`} opacity={c}>
        <rect x={900} y={430} width={120} height={270} rx={30} fill="url(#bS)" /><ellipse cx={960} cy={432} rx={60} ry={18} fill="#eef1f3" />
        {[0, 1, 2].map((i) => <rect key={i} x={922 + i * 28} y={470} width={14} height={60} rx={7} fill="#2e3236" />)}
      </g>
      {Array.from({ length: 30 }, (_, i) => { const k = ((tt * 1.4 + rn(i)) % 1), side = rn(i, 2) > 0.5 ? 1 : -1;
        const x = 960 + side * (40 + 300 * k), y = 500 - 220 * Math.sin(k * Math.PI * 0.9) + 200 * k * k;
        return <circle key={i} cx={x} cy={y} r={7 + 7 * rn(i, 3)} fill="#968f78" opacity={pump * (1 - k * 0.5)} />; })}
      {/* el charco que crece */}
      <ellipse cx={960} cy={712} rx={80 + 330 * eio(tt, 1.6, 4.8)} ry={14} fill="#8d8670" opacity={0.7} />
    </svg>
    <Tag tt={tt} at={2.4} x={1430} y={430} txt="YOUR PUSH, ON THE COUNTER" col={RED} size={32} />
  </>;
}}</Stage>;

// ---- 4:46 · LOS DOS GALONES: dos bidones se vuelcan dentro de un caño angosto; el agua no entra y sube a la pileta ----
export const HJugs: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const j1 = phys(tt, 0.4, 6, 0.5), j2 = phys(tt, 1.0, 6, 0.5), tip = eio(tt, 1.8, 2.6), rise = eio(tt, 2.6, 5.2);
  const Jug = (x: number, s: number) => <g transform={`translate(${x} ${(1 - s) * -500}) rotate(${70 * tip} 120 120)`} opacity={cl(s * 3)}>
    <rect x={40} y={40} width={160} height={200} rx={30} fill="rgba(235,240,240,.35)" stroke="rgba(255,255,255,.6)" strokeWidth={4} />
    <rect x={44} y={110} width={152} height={126} rx={26} fill="#8f8a74" /><rect x={95} y={14} width={50} height={34} rx={6} fill="#e9e3d0" /></g>;
  return <>
    <Head tt={tt} kick="DON'T RUN THE DISHWASHER" title="2 GALLONS, NOWHERE TO GO" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{grads}
      {Jug(520, j1)}{Jug(760, j2)}
      {/* la pileta y el caño */}
      <path d="M 1100 420 L 1500 420 L 1470 600 L 1130 600 Z" fill="url(#bS)" opacity={0.85} />
      <path d={`M 1132 ${590 - 150 * rise} L 1468 ${590 - 150 * rise} L 1462 594 L 1138 594 Z`} fill="url(#bG)" />
      <rect x={1280} y={600} width={40} height={330} fill="url(#bP)" /><rect x={1284} y={680} width={32} height={60} fill={GRAY} />
      {tip > 0.3 && <path d={`M 900 330 Q 1100 ${300 + 60 * Math.sin(tt * 6)} 1290 600`} stroke="#8f8a74" strokeWidth={22 * tip} fill="none" strokeLinecap="round" opacity={0.85 * (1 - rise * 0.6)} />}
    </svg>
    <Tag tt={tt} at={3.6} x={1300} y={340} txt="BACK UP IN YOUR SINK" col={RED} size={32} />
  </>;
}}</Stage>;

// ---- 5:19 · EL ÁRBOL DE LA PILETA: tres síntomas caen como nudos y la rama dice dónde está el tapón ----
export const HTree: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const rows = [["ONE SIDE SLOW", "CLOSE · EASY", ICE], ["BOTH SIDES SLOW", "TRAP OR WALL", AMB], ["OTHER DRAINS TOO", "MAIN LINE · CALL", RED]] as const;
  const root = cl(phys(tt, 0.3, 6, 0.6));
  return <>
    <Head tt={tt} kick="BEFORE ANY TOOL" title="READ YOUR SINK" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <circle cx={360} cy={600} r={70 * root} fill="#2a2620" stroke={AMB} strokeWidth={6} />
      {rows.map(([, , c], i) => { const s = eio(tt, 0.9 + i * 0.9, 1.6 + i * 0.9), y = 330 + i * 270;
        return <path key={i} d={`M 430 600 C 600 600 640 ${y} ${430 + 400 * s} ${y}`} stroke={c} strokeWidth={8} fill="none" strokeDasharray="900" strokeDashoffset={900 * (1 - s)} />; })}
    </svg>
    <div style={{ position: "absolute", left: 322, top: 572, fontSize: 46, fontWeight: 900, color: AMB, opacity: root }}>?</div>
    {rows.map(([a, b, c], i) => { const s = phys(tt, 1.5 + i * 0.9, 7, 0.45), y = 330 + i * 270;
      return <div key={i} style={{ position: "absolute", left: 850, top: y, transform: `translate(${(1 - s) * 120}px,-50%)`, opacity: cl(s * 2), display: "flex", alignItems: "center", gap: 36 }}>
        <div style={{ fontWeight: 900, fontSize: 44, color: TX, width: 470 }}>{a}</div>
        <div style={{ fontFamily: HAND, fontSize: 52, color: c as string }}>→ {b}</div></div>; })}
  </>;
}}</Stage>;

// ---- 5:39 · GLUG GLUG: la onda del sonido sale del desagüe y las burbujas de aire se pelean por entrar al caño ----
export const HGlug: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const s = cl(phys(tt, 0.3, 5, 0.6));
  const pts = Array.from({ length: 120 }, (_, i) => { const x = 220 + i * 12.5, env = Math.max(0, Math.sin(((x - 220) / 1500) * Math.PI * 3 - tt * 2)) ** 3;
    return `${x},${560 + Math.sin(i * 0.9 + tt * 10) * 150 * env * s}`; }).join(" ");
  return <>
    <Head tt={tt} kick="LISTEN TO IT" title="AIR CAN'T GET IN" col={ICE} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <polyline points={pts} fill="none" stroke={ICE} strokeWidth={6} strokeLinejoin="round" />
      {Array.from({ length: 14 }, (_, i) => { const k = ((tt * 0.6 + i / 14) % 1); return <circle key={i} cx={960 + Math.sin(i * 2 + tt * 3) * 40} cy={930 - k * 220} r={10 + 12 * rn(i)} fill="none" stroke="rgba(220,240,255,.8)" strokeWidth={3} opacity={s * (1 - k)} />; })}
      <rect x={910} y={900} width={100} height={150} fill="#d9d6ce" opacity={s} />
    </svg>
    {["GLUG", "GLUG", "GLUG"].map((w, i) => <Tag key={i} tt={tt} at={1 + i * 0.7} x={560 + i * 400} y={300 - i * 20} txt={w} col={TX} size={64} />)}
    <Tag tt={tt} at={3.4} x={960} y={850} txt="CLOG · OR THE VENT" col={AMB} size={32} />
  </>;
}}</Stage>;

// ---- 6:28 · EL TABLERO DE HERRAMIENTAS: siluetas pintadas en un tablero perforado; cada cosa vuela a su silueta ----
export const HPegboard: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const items: [string, number, number, React.ReactNode][] = [
    ["BUCKET", 470, 520, <path d="M -90 -80 L 90 -80 L 70 90 L -70 90 Z" fill="#e2702e" />],
    ["TOWELS", 830, 520, <rect x={-90} y={-80} width={180} height={170} rx={10} fill="#d9cfb8" />],
    ["GLOVES", 1170, 520, <path d="M -50 90 L -60 -20 L -40 -90 L -20 -30 L 0 -100 L 20 -30 L 40 -90 L 60 -20 L 50 90 Z" fill="#f2d14a" />],
    ["FLASHLIGHT", 1490, 520, <g><rect x={-30} y={-90} width={60} height={150} rx={12} fill="#3b3f45" /><path d="M -45 60 L 45 60 L 35 100 L -35 100 Z" fill="#9aa1a8" /></g>],
  ];
  return <>
    <Head tt={tt} kick="FIVE MINUTES OF WORK" title="WHAT YOU NEED" col={AMB} />
    <div style={{ position: "absolute", left: 260, top: 280, width: 1400, height: 520, borderRadius: 10, background: "radial-gradient(circle, rgba(0,0,0,.35) 4px, transparent 5px) 0 0/40px 40px, linear-gradient(180deg,#b88d5b,#9a7448)", boxShadow: "0 40px 90px rgba(0,0,0,.6)" }} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {items.map(([, x, y, sh], i) => { const s = phys(tt, 0.8 + i * 0.6, 7, 0.42);
        return <g key={i}>
          <g transform={`translate(${x} ${y})`} opacity={0.35}><g style={{ filter: "brightness(0) invert(1)" }}>{sh}</g></g>
          <g transform={`translate(${x + (1 - s) * (i % 2 ? 600 : -600)} ${y + (1 - s) * -200}) rotate(${(1 - s) * 40})`} opacity={cl(s * 3)}>{sh}</g></g>; })}
    </svg>
    {items.map(([n, x], i) => <Tag key={n} tt={tt} at={1.2 + i * 0.6} x={x} y={740} txt={n} col={TX} size={30} />)}
  </>;
}}</Stage>;

// ---- 7:03 · LA TAPA DEL FRASCO: una tapa de frasco y la tuerca del sifón llegan juntas y giran a la par, contra reloj ----
export const HJarLid: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const a = phys(tt, 0.4, 6, 0.5), b = phys(tt, 1.0, 6, 0.5), rot = -160 * eio(tt, 2.0, 4.6);
  const Ring = (x: number, s: number, col: string, ribs: number) => <g transform={`translate(${x} 560) scale(${s})`}>
    <g transform={`rotate(${rot})`}><circle r={190} fill={col} />{Array.from({ length: ribs }, (_, i) => <rect key={i} x={-6} y={-196} width={12} height={34} fill="rgba(0,0,0,.18)" transform={`rotate(${(i * 360) / ribs})`} />)}
      <circle r={120} fill="rgba(0,0,0,.12)" /><rect x={-8} y={-150} width={16} height={60} fill="rgba(255,255,255,.6)" /></g></g>;
  return <>
    <Head tt={tt} kick="THE TRAP NUTS" title="SAME SIZE · SAME TURN" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {Ring(620, a, "#c9a54a", 40)}{Ring(1300, b, PVC, 24)}
      <path d={`M 960 300 A 140 140 0 1 0 1080 360`} stroke={ICE} strokeWidth={10} fill="none" opacity={eio(tt, 2.0, 2.6)} />
      <path d="M 1050 330 l 50 30 l -50 25 z" fill={ICE} opacity={eio(tt, 2.0, 2.6)} />
    </svg>
    <Tag tt={tt} at={1.2} x={620} y={820} txt="A JAR LID" col={TX} />
    <Tag tt={tt} at={1.8} x={1300} y={820} txt="A TRAP NUT" col={TX} />
    <Tag tt={tt} at={2.6} x={960} y={200} txt="COUNTERCLOCKWISE" col={ICE} size={38} />
  </>;
}}</Stage>;

// ---- 8:09 · LA RADIOGRAFÍA: una banda de rayos X barre los azulejos y muestra el caño detrás; el sifón limpio, el tapón más allá ----
export const HXray: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const x = 200 + 1520 * eio(tt, 0.8, 4.2);
  const pipe = <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
    <path d="M 300 560 L 900 560 Q 1000 560 1000 660 L 1000 1000" stroke="rgba(160,230,255,.9)" strokeWidth={70} fill="none" />
    <path d="M 300 560 L 900 560 Q 1000 560 1000 660 L 1000 1000" stroke="rgba(10,30,50,.9)" strokeWidth={50} fill="none" />
    <ellipse cx={985} cy={640} rx={36} ry={44} fill="#e9dcae" /></svg>;
  return <>
    <Head tt={tt} kick="THE TRAP WAS CLEAN" title="SO WHERE IS IT?" col={ICE} />
    <div style={{ position: "absolute", left: 160, top: 260, width: 1600, height: 780, background: "repeating-linear-gradient(0deg,#ddd5c6 0 118px,#b8ae9c 118px 122px), repeating-linear-gradient(90deg,transparent 0 118px,#b8ae9c 118px 122px)", backgroundBlendMode: "multiply", boxShadow: "inset 0 0 120px rgba(0,0,0,.4)" }} />
    <div style={{ position: "absolute", left: 160, top: 260, width: 1600, height: 780, background: "#06131c", clipPath: `inset(0 ${1760 - Math.min(1760, x + 140)}px 0 ${Math.max(0, x - 300)}px)` }}>
      <div style={{ position: "absolute", left: -160, top: -260 }}>{pipe}</div></div>
    <div style={{ position: "absolute", left: x + 140, top: 260, width: 6, height: 780, background: "rgba(160,230,255,.9)", boxShadow: "0 0 40px rgba(160,230,255,.9)", opacity: tt < 4.4 ? 1 : 0 }} />
    <Tag tt={tt} at={3.4} x={1250} y={640} txt="IN THE WALL" col={RED} size={40} />
  </>;
}}</Stage>;

// ---- 8:58 · LOS ANILLOS DEL TRONCO: el caño en corte junta grasa año por año, como un tronco, hasta dejar el agujero de un lápiz ----
export const HTreeRings: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const N = 9, grown = eio(tt, 0.6, 4.6) * N, pen = phys(tt, 5.0, 6, 0.5);
  return <>
    <Head tt={tt} kick="A THIN LAYER A WEEK" title="IT GROWS LIKE A TREE" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <circle cx={760} cy={580} r={300} fill="#3a3c40" /><circle cx={760} cy={580} r={276} fill="#151617" />
      {Array.from({ length: N }, (_, i) => { const k = cl(grown - i); if (k <= 0) return null; const r0 = 276 - i * 27;
        return <circle key={i} cx={760} cy={580} r={r0 - 13 * k} fill="none" stroke={i % 2 ? GREASE : "#c9b06c"} strokeWidth={26 * k} opacity={0.95} />; })}
      {/* el lápiz para comparar */}
      <g transform={`translate(${1500 - 380 * pen} 580)`} opacity={cl(pen * 2)}><rect x={0} y={-16} width={420} height={32} fill="#f2c230" /><path d="M 0 -16 L -50 0 L 0 16 Z" fill="#e8c9a0" /></g>
    </svg>
    {[1990, 2000, 2010, 2020].map((y, i) => <Tag key={y} tt={tt} at={0.8 + i * 1.0} x={1240} y={380 + i * 70} txt={String(y)} col={DIM} size={30} />)}
    <Tag tt={tt} at={5.3} x={1300} y={680} txt="A PENCIL'S WORTH" col={RED} size={34} />
  </>;
}}</Stage>;

// ---- 9:20 · LA POSTA QUE SE APAGA: el empujón viaja por el sifón, el caño y la curva y se achica en cada tramo hasta no llegar ----
export const HRelay: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const legs = [["THE TRAP", 1], ["3 FEET OF PIPE", 0.55], ["THE BEND", 0.25], ["THE CANDLE", 0.05]] as const;
  return <>
    <Head tt={tt} kick="WHERE YOUR PUSH GOES" title="IT DIES ON THE WAY" col={ICE} />
    {legs.map(([n, amp], i) => { const s = phys(tt, 0.5 + i * 0.7, 7, 0.45), x = 360 + i * 400;
      const pts = Array.from({ length: 60 }, (_, k) => `${k * 5},${80 + Math.sin(k * 0.5 - tt * 8) * 70 * amp * cl((tt - 0.8 - i * 0.7) * 2)}`).join(" ");
      return <div key={i} style={{ position: "absolute", left: x, top: 470, transform: `translate(-50%, ${(1 - s) * 80}px)`, opacity: cl(s * 2), textAlign: "center" }}>
        <svg width={300} height={160}><rect x={0} y={40} width={300} height={80} rx={40} fill="rgba(255,255,255,.07)" /><polyline points={pts} fill="none" stroke={i === 3 ? RED : ICE} strokeWidth={6} /></svg>
        <div style={{ fontWeight: 900, fontSize: 30, color: i === 3 ? RED : TX, marginTop: 14 }}>{n}</div></div>; })}
    <Tag tt={tt} at={3.8} x={960} y={820} txt="NOTHING LEFT TO PUSH" col={RED} size={36} />
  </>;
}}</Stage>;

// ---- 9:50 · LA VÍBORA DE 40 PIES: la grasa sacada del sótano cruza toda la pantalla, con marcas de pies que se van contando ----
export const HSnakeOut: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const len = eio(tt, 0.5, 4.5), ft = Math.round(40 * len);
  const d = `M 120 ${640} ${Array.from({ length: 40 }, (_, i) => `Q ${150 + i * 44 + 22} ${640 + (i % 2 ? 60 : -60)} ${150 + i * 44 + 44} 640`).join(" ")}`;
  return <>
    <Head tt={tt} kick="MILWAUKEE AVE · 1993" title="40 FEET OF GREASE" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d={d} stroke="#6f6a5a" strokeWidth={54} fill="none" strokeLinecap="round" strokeDasharray="2200" strokeDashoffset={2200 * (1 - len)} />
      <path d={d} stroke="#b6ab86" strokeWidth={30} fill="none" strokeLinecap="round" strokeDasharray="2200" strokeDashoffset={2200 * (1 - len)} opacity={0.7} />
      {Array.from({ length: 8 }, (_, i) => { const x = 150 + (i + 1) * 220; return <g key={i} opacity={len * 1900 > x - 150 ? 1 : 0}><line x1={x} y1={740} x2={x} y2={770} stroke={DIM} strokeWidth={4} /></g>; })}
    </svg>
    <div style={{ position: "absolute", left: 960, top: 860, transform: "translateX(-50%)", fontFamily: MARK, fontSize: 110, color: AMB }}>{ft} FT</div>
    <Tag tt={tt} at={4.6} x={1500} y={420} txt="HARD LIKE SOAP" col={TX} size={34} />
  </>;
}}</Stage>;

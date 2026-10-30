// len29d · componentes únicos 1-16 (0:08 → 8:30). Viven en el Stage (foto del momento desenfocada, piso con luz, haz, motas):
// entran con su transición, los elementos llegan de a uno con resorte, la cámara curva y la salida se funde hacia atrás.
import React from "react";
import { AMB, DIM, H, HAND, Head, ICE, MARK, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

const PORC = "#f3f2ee", CHROME = "#d7dce0", SOAP = "#6fbf4a", WATER = "#7fbde0", PAPER = "#f1ede2";
const rn = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
// inodoro de perfil (tazón + tanque), para reusar el contorno dentro de cada idea
const ToiletSide: React.FC<{ x: number; y: number; s?: number; water?: number; col?: string }> = ({ x, y, s = 1, water = 0.4, col = PORC }) =>
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={60} y={-330} width={150} height={190} rx={14} fill={col} stroke="#c9c7c0" strokeWidth={4} />
    <path d="M -170 -140 L 200 -140 L 190 -110 Q 150 40 40 60 L 40 120 L -40 120 L -40 60 Q -150 30 -170 -110 Z" fill={col} stroke="#c9c7c0" strokeWidth={4} />
    <path d={`M -150 ${-120 + 90 * (1 - water)} L 170 ${-120 + 90 * (1 - water)} Q 140 10 40 30 L -40 30 Q -130 0 -150 ${-120 + 90 * (1 - water)} Z`} fill={WATER} opacity={0.75} />
  </g>;

// ---- 0:08 · EL RELOJ DE LAS SEIS: un despertador marca las 6:00 y el agua del tazón sube como si fuera la aguja ----
export const HDawnClock: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const rise = eio(tt, 0.8, 5.0), c = phys(tt, 0.4, 5, 0.45);
  return <>
    <Head tt={tt} kick="6:00 A.M." title="IT'S COMING UP" col={RED} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(560 600) scale(${c})`} opacity={cl(c * 2)}>
        <circle r={210} fill="#f2ede2" stroke="#b98b4a" strokeWidth={18} /><circle cx={-150} cy={-190} r={46} fill="#b98b4a" /><circle cx={150} cy={-190} r={46} fill="#b98b4a" />
        {Array.from({ length: 12 }, (_, i) => <rect key={i} x={-4} y={-190} width={8} height={i % 3 ? 16 : 30} fill="#333" transform={`rotate(${i * 30})`} />)}
        <rect x={-6} y={-150} width={12} height={150} rx={6} fill="#222" /><rect x={-5} y={0} width={10} height={120} rx={5} fill="#222" transform="rotate(180)" />
        <rect x={-3} y={-175} width={6} height={175} fill={RED} transform={`rotate(${360 * eio(tt, 0.6, 6.0)})`} /></g>
      <ToiletSide x={1320} y={760} s={1.25} water={0.35 + 0.62 * rise} />
    </svg>
    <Tag tt={tt} at={3.6} x={1320} y={330} txt="SLOW · THEN NOT SO SLOW" col={AMB} size={32} />
  </>;
}}</Stage>;

// ---- 0:24 · EL CAMINO EN SILENCIO: plano de la casa visto de arriba; una línea punteada va del garaje al baño pasando por los que duermen ----
export const HQuietPath: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const p = eio(tt, 0.8, 4.8);
  const R: [number, number, number, number, string][] = [[360, 300, 420, 300, "GARAGE"], [780, 300, 520, 460, "LIVING ROOM"], [1300, 300, 300, 260, "BATH"], [1300, 560, 300, 200, "GUESTS"]];
  return <>
    <Head tt={tt} kick="NOBODY CAN HEAR YOU" title="PAST EVERYBODY" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {R.map(([x, y, w, hh, n], i) => { const s = phys(tt, 0.3 + i * 0.25, 6, 0.5); return <g key={n} opacity={cl(s * 2)}>
        <rect x={x} y={y + (1 - s) * 60} width={w} height={hh} fill="rgba(240,235,225,.08)" stroke="#e9e2d4" strokeWidth={6} />
        <text x={x + 16} y={y + 40} fontFamily={MARK} fontSize={26} fill={DIM}>{n}</text></g>; })}
      {[[900, 560], [990, 600], [1060, 560], [1450, 690]].map(([x, y], i) => <g key={i} opacity={cl(phys(tt, 1.2 + i * 0.2, 6, 0.6))}><ellipse cx={x} cy={y} rx={46} ry={24} fill="#8fa6c9" /><circle cx={x - 40} cy={y - 6} r={16} fill="#e5c2a6" /><text x={x + 10} y={y - 30} fontFamily={HAND} fontSize={30} fill={ICE} opacity={0.5 + 0.5 * Math.sin(tt * 3 + i)}>z</text></g>)}
      <path d="M 520 520 C 700 640 860 700 1040 680 S 1300 460 1420 430" stroke={AMB} strokeWidth={8} fill="none" strokeDasharray="20 16" pathLength={1} style={{ strokeDasharray: `${p} 1` }} />
    </svg>
    <Tag tt={tt} at={4.2} x={1450} y={250} txt="WITH A PLUNGER" col={RED} size={32} />
  </>;
}}</Stage>;

// ---- 0:55 · UNA TAZA: una taza medidora de vidrio se llena de detergente verde, línea por línea, hasta «1 CUP» ----
export const HOneCup: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const f = eio(tt, 1.0, 4.4), c = phys(tt, 0.4, 5, 0.45);
  return <>
    <Head tt={tt} kick="SOMETHING YOU ALREADY OWN" title="ONE CUP" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(960 ${640 + (1 - c) * 300})`} opacity={cl(c * 2)}>
        <path d="M -200 -260 L 200 -260 L 170 220 Q 165 250 135 250 L -135 250 Q -165 250 -170 220 Z" fill="rgba(220,240,250,.12)" stroke="rgba(230,245,252,.75)" strokeWidth={8} />
        <path d="M 200 -180 Q 300 -170 290 -40 Q 280 60 186 70" stroke="rgba(230,245,252,.75)" strokeWidth={22} fill="none" />
        <path d={`M ${-170 + 6 * (1 - f)} ${240 - 440 * f} L ${170 - 6 * (1 - f)} ${240 - 440 * f} L 160 230 L -160 230 Z`} fill={SOAP} opacity={0.85} />
        <path d={`M -170 ${240 - 440 * f} Q 0 ${230 - 440 * f + 10 * Math.sin(tt * 3)} 170 ${240 - 440 * f}`} stroke="#a8e08a" strokeWidth={6} fill="none" />
        {[0.25, 0.5, 0.75, 1].map((q, i) => <g key={i}><line x1={-180} y1={240 - 440 * q} x2={-120} y2={240 - 440 * q} stroke="#fff" strokeWidth={5} /><text x={-110} y={250 - 440 * q} fontFamily={MARK} fontSize={30} fill="#fff">{["¼", "½", "¾", "1 CUP"][i]}</text></g>)}
      </g>
      <path d={`M 1060 140 Q 1040 ${260} 1000 ${380 + 40 * Math.sin(tt * 4)}`} stroke={SOAP} strokeWidth={22} fill="none" strokeLinecap="round" opacity={f > 0.02 && f < 0.98 ? 0.9 : 0} />
    </svg>
  </>;
}}</Stage>;

// ---- 1:45 · LA MANO QUE VUELVE: la mano va hacia la manija una y otra vez; cada intento hace subir el agua ----
export const HHandOff: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const n = Math.min(3, Math.floor(eio(tt, 0.5, 4.0) * 3.99)), lift = eio(tt, 4.4, 5.4), reach = Math.max(0, Math.sin(eio(tt, 0.5, 4.0) * Math.PI * 3)) * (1 - lift);
  return <>
    <Head tt={tt} kick="EVERYBODY DOES IT" title="DON'T FLUSH AGAIN" col={RED} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <ToiletSide x={900} y={800} s={1.5} water={0.45 + 0.18 * n} />
      <rect x={1050} y={330} width={70} height={18} rx={8} fill={CHROME} />
      <g transform={`translate(${1460 - 300 * reach} ${300 - 120 * lift})`}><path d="M 0 0 Q 60 -40 140 -10 L 220 30 L 200 70 L 120 50 Q 60 60 0 50 Z" fill="#d8a888" /><rect x={200} y={20} width={120} height={60} rx={20} fill="#3c5a86" /></g>
    </svg>
    <div style={{ position: "absolute", left: 360, top: 420, fontFamily: MARK, fontSize: 150, color: RED, opacity: n > 0 ? 1 : 0 }}>×{n}</div>
    <Tag tt={tt} at={4.6} x={1500} y={600} txt="HAND OFF THE HANDLE" col={ICE} size={34} />
  </>;
}}</Stage>;

// ---- 2:02 · BUSCAR LA LLAVE: la pared de atrás del inodoro está a oscuras; una linterna barre y encuentra la llave cromada ----
export const HValveHunt: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const sx = 400 + 900 * eio(tt, 0.5, 2.8), sy = 380 + 360 * eio(tt, 0.5, 2.8), found = eio(tt, 2.8, 3.4), turn = eio(tt, 3.6, 5.0);
  return <>
    <Head tt={tt} kick="DOWN LOW, NEAR THE FLOOR" title="THE LITTLE VALVE" col={AMB} />
    <div style={{ position: "absolute", left: 260, top: 280, width: 1400, height: 640, background: "linear-gradient(180deg,#e6e1d6,#cfc9bc)", borderRadius: 10 }}>
      <svg width={1400} height={640}><ToiletSide x={420} y={560} s={1.4} /><rect x={1000} y={420} width={300} height={22} fill={CHROME} /><path d="M 1000 431 Q 900 431 860 380 L 820 300" stroke="#bfc4c8" strokeWidth={12} fill="none" />
        <g transform={`translate(1040 431) rotate(${90 * turn})`}><ellipse rx={34} ry={20} fill={CHROME} stroke="#8a9096" strokeWidth={4} /></g></svg>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at ${sx - 260 + 440 * found * 0}px ${sy - 280}px, rgba(255,240,200,.12) 60px, rgba(0,0,0,${0.93 - 0.5 * found}) ${200 + 120 * found}px)` }} />
    </div>
    <Tag tt={tt} at={3.2} x={1300} y={820} txt="TURN IT RIGHT" col={ICE} size={36} />
  </>;
}}</Stage>;

// ---- 2:32 · LEVANTAR EL FLOTANTE: el tanque en corte; el agua entra, la mano sube el flotante y el chorro se corta ----
export const HFloatLift: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const lift = eio(tt, 2.4, 3.4), lv = 0.3 + 0.25 * eio(tt, 0.4, 2.4), stream = 1 - lift;
  return <>
    <Head tt={tt} kick="NO VALVE? NO PROBLEM" title="LIFT THE FLOAT" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <rect x={620} y={280} width={680} height={600} rx={24} fill="rgba(240,240,236,.12)" stroke={PORC} strokeWidth={10} />
      <rect x={630} y={870 - 590 * lv} width={660} height={590 * lv} fill={WATER} opacity={0.6} />
      <rect x={730} y={360} width={34} height={500} fill="#cfd3d6" /><path d={`M 747 360 L 747 ${380}`} stroke="#fff" />
      {stream > 0.05 && Array.from({ length: 10 }, (_, i) => <ellipse key={i} cx={747 + 10 * Math.sin(i)} cy={380 + ((tt * 400 + i * 50) % (490 - 590 * lv + 400))} rx={7} ry={14} fill="#bfe4f5" opacity={stream} />)}
      <g transform={`translate(0 ${-140 * lift})`}><line x1={760} y1={600} x2={1060} y2={870 - 590 * lv} stroke="#8a9096" strokeWidth={10} /><ellipse cx={1080} cy={860 - 590 * lv} rx={70} ry={44} fill="#e2e2dc" stroke="#9aa1a7" strokeWidth={5} /></g>
      <g transform={`translate(1200 ${1000 - 380 * eio(tt, 1.6, 2.6) - 140 * lift})`}><path d="M -60 0 Q -70 -80 -20 -110 L 30 -90 L 40 0 Z" fill="#d8a888" /></g>
    </svg>
    <Tag tt={tt} at={3.6} x={1520} y={420} txt="THE WATER STOPS" col={ICE} size={34} />
  </>;
}}</Stage>;

// ---- 2:51 · SÓLO EL LÍQUIDO: tres envases pasan por una vitrina; el polvo y la cápsula se apagan, el líquido queda iluminado ----
export const HLiquidOnly: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const dim = eio(tt, 2.6, 3.6);
  const B: [string, React.ReactNode][] = [
    ["POWDER", <g><rect x={-90} y={-150} width={180} height={260} rx={8} fill="#3f6fb5" /><rect x={-90} y={-150} width={180} height={50} fill="#2c5390" /></g>],
    ["PODS", <g><path d="M -110 -60 Q -110 -150 0 -150 Q 110 -150 110 -60 L 110 110 L -110 110 Z" fill="#e7e5df" />{[-50, 0, 50].map((x) => <circle key={x} cx={x} cy={10} r={26} fill="#4aa0d8" />)}</g>],
    ["LIQUID", <g><path d="M -60 110 L -70 -60 Q -70 -110 -20 -120 L -20 -170 L 20 -170 L 20 -120 Q 70 -110 70 -60 L 60 110 Z" fill={SOAP} /><rect x={-24} y={-200} width={48} height={34} rx={6} fill="#2b5c1c" /></g>],
  ];
  return <>
    <Head tt={tt} kick="NOT THE DISHWASHER KIND" title="THE LIQUID ONE" col={AMB} />
    {B.map(([n, g], i) => { const s = phys(tt, 0.4 + i * 0.6, 6, 0.45), off = i < 2 ? dim : 0, glow = i === 2 ? dim : 0;
      return <div key={n} style={{ position: "absolute", left: 520 + i * 440, top: 600, transform: `translate(-50%,-50%) translateY(${(1 - s) * 300}px) scale(${1 + 0.15 * glow})`, opacity: cl(s * 2) * (1 - 0.7 * off), filter: `saturate(${1 - off}) drop-shadow(0 0 ${60 * glow}px rgba(160,240,120,.6))` }}>
        <svg width={300} height={420} viewBox="-150 -220 300 420">{g}</svg>
        <div style={{ textAlign: "center", fontFamily: MARK, fontSize: 40, color: i === 2 ? AMB : TX, marginTop: -10 }}>{n}</div></div>; })}
    <Tag tt={tt} at={4.0} x={1400} y={260} txt="CHEAPEST IS FINE" col={ICE} size={30} />
  </>;
}}</Stage>;

// ---- 3:17 · MÁS PESADO QUE EL AGUA: un frasco de agua; la cinta verde entra arriba, atraviesa y se apoya en el fondo ----
export const HDenseJar: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const d = eio(tt, 0.8, 4.4);
  return <>
    <Head tt={tt} kick="THE PART NOBODY TELLS YOU" title="IT SINKS" col={ICE} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <rect x={700} y={250} width={520} height={680} rx={40} fill="rgba(200,230,245,.10)" stroke="rgba(230,245,252,.7)" strokeWidth={8} />
      <rect x={712} y={330} width={496} height={588} rx={30} fill={WATER} opacity={0.35} />
      <path d={`M 960 300 C ${960 + 60 * Math.sin(tt)} ${400 + 200 * d} ${940 - 50 * Math.cos(tt * 0.8)} ${500 + 300 * d} 960 ${330 + 560 * d}`} stroke={SOAP} strokeWidth={34} fill="none" strokeLinecap="round" />
      <ellipse cx={960} cy={900} rx={230 * eio(tt, 3.6, 5.2)} ry={22 * eio(tt, 3.6, 5.2)} fill={SOAP} opacity={0.85} />
      <g transform={`translate(1380 ${590 - 120 * Math.sin(eio(tt, 0.6, 2.4) * Math.PI)})`} opacity={cl(phys(tt, 0.6, 6, 0.5))}><path d="M -90 0 L 90 0 L 60 -120 L -60 -120 Z" fill="none" stroke={DIM} strokeWidth={6} /><text x={-60} y={60} fontFamily={MARK} fontSize={34} fill={TX}>HEAVIER</text></g>
    </svg>
    <Tag tt={tt} at={4.4} x={960} y={1000} txt="RIGHT DOWN TO THE CLOG" col={AMB} size={32} />
  </>;
}}</Stage>;

// ---- 3:35 · EL PASAJE DE LOZA: el camino del sifón se dibuja como una montaña rusa; un carrito baja, sube la joroba y cae ----
export const HPorcelainPath: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const d = eio(tt, 0.4, 2.4), u = eio(tt, 2.6, 6.0);
  const P = "M 360 360 C 420 820 700 860 820 560 C 900 360 1100 340 1180 520 C 1240 680 1300 900 1560 900";
  const pts = [[360, 360], [560, 760], [820, 560], [1000, 380], [1180, 520], [1300, 820], [1560, 900]];
  const k = u * (pts.length - 1), i = Math.min(pts.length - 2, Math.floor(k)), f = k - i;
  const cx = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, cy = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f;
  return <>
    <Head tt={tt} kick="INSIDE THE PORCELAIN" title="DOWN · UP · OVER" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d={P} stroke={PORC} strokeWidth={110} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${d} 1`} />
      <path d={P} stroke="#1a1c1e" strokeWidth={80} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${d} 1`} />
      <circle cx={1000} cy={380} r={26} fill={RED} opacity={eio(tt, 2.0, 2.6)} />
      <g transform={`translate(${cx} ${cy})`} opacity={u > 0.01 ? 1 : 0}><ellipse rx={36} ry={24} fill={PAPER} /><ellipse cx={-12} cy={-6} rx={16} ry={10} fill="#e0d9c8" /></g>
    </svg>
    <Tag tt={tt} at={2.4} x={1000} y={280} txt="THE HUMP" col={RED} size={36} />
  </>;
}}</Stage>;

// ---- 3:52 · LA PARED RESBALOSA: el tapón está pegado a la loza con ganchitos; el jabón los suelta uno a uno y el tapón resbala ----
export const HSlipWall: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const coat = eio(tt, 0.8, 3.4), slide = eio(tt, 3.8, 6.0);
  return <>
    <Head tt={tt} kick="TWO THINGS AT ONCE" title="IT MAKES IT SLIPPERY" col={ICE} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <rect x={260} y={300} width={1400} height={70} fill={PORC} /><rect x={260} y={720} width={1400} height={70} fill={PORC} />
      <rect x={260} y={370} width={1400} height={350 * coat} fill={SOAP} opacity={0.2} />
      <g transform={`translate(${760 + 700 * slide} 545)`}>
        <ellipse rx={190} ry={170} fill={PAPER} /><ellipse cx={-50} cy={-40} rx={80} ry={50} fill="#e2dccb" /><ellipse cx={60} cy={60} rx={70} ry={40} fill="#d9d2bf" />
        {Array.from({ length: 12 }, (_, i) => { const up = i % 2 === 0, x = -150 + i * 27, held = coat < (i + 1) / 13; return <path key={i} d={`M ${x} ${up ? -160 : 160} l ${held ? 0 : 10} ${up ? -14 : 14}`} stroke={held ? RED : "transparent"} strokeWidth={8} />; })}
      </g>
      <path d="M 1500 545 l -80 -40 m 80 40 l -80 40" stroke={ICE} strokeWidth={10} fill="none" opacity={slide} />
    </svg>
    <Tag tt={tt} at={3.4} x={760} y={900} txt="NOT STUCK TO THE WALLS" col={TX} size={32} />
  </>;
}}</Stage>;

// ---- 4:24 · PISO 12: el indicador de bronce del ascensor del hotel sube piso por piso hasta el 12 ----
export const HHotel12: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const fl = Math.max(1, Math.min(12, Math.round(1 + 11 * eio(tt, 0.6, 3.6)))), arc = -70 + 140 * ((fl - 1) / 11);
  return <>
    <Head tt={tt} kick="RUSH STREET · 1980" title="THE 12TH FLOOR" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d="M 560 620 A 400 400 0 0 1 1360 620 L 1360 680 L 560 680 Z" fill="#b48a3c" stroke="#7a5a20" strokeWidth={10} />
      {Array.from({ length: 12 }, (_, i) => { const a = (-70 + i * (140 / 11)) * Math.PI / 180; return <text key={i} x={960 + Math.sin(a) * 320} y={640 - Math.cos(a) * 320} textAnchor="middle" fontFamily={MARK} fontSize={36} fill={i + 1 === fl ? "#fff6d8" : "#5a4012"}>{i + 1}</text>; })}
      <g transform={`translate(960 640) rotate(${arc})`}><rect x={-6} y={-280} width={12} height={280} fill="#2a1d08" /><path d="M -18 -260 L 0 -300 L 18 -260 Z" fill="#2a1d08" /></g>
      <circle cx={960} cy={640} r={30} fill="#7a5a20" />
      <rect x={760} y={720} width={180} height={300} fill="#8f6c2c" opacity={0.9} /><rect x={980} y={720} width={180} height={300} fill="#8f6c2c" opacity={0.9} />
    </svg>
    <Tag tt={tt} at={3.6} x={1500} y={460} txt="A FURIOUS GUEST" col={RED} size={32} />
  </>;
}}</Stage>;

// ---- 4:58 · LA PROPINA: el billete de 20 cae girando, se parte en dos y uno de 5 vuela hacia el aprendiz ----
export const HTipSplit: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const fall = phys(tt, 0.3, 4, 0.4), split = eio(tt, 2.4, 3.6);
  const Bill = (v: string, w = 380) => <g><rect x={-w / 2} y={-90} width={w} height={180} rx={10} fill="#cfdcc2" stroke="#5f7a4a" strokeWidth={6} /><ellipse rx={60} ry={70} fill="none" stroke="#5f7a4a" strokeWidth={5} /><text x={-w / 2 + 20} y={-50} fontFamily={MARK} fontSize={44} fill="#3f5a2e">{v}</text><text x={w / 2 - 70} y={70} fontFamily={MARK} fontSize={44} fill="#3f5a2e">{v}</text></g>;
  return <>
    <Head tt={tt} kick="15 MINUTES LATER" title="IT FLUSHED" col={ICE} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(${960 - 300 * split} ${200 + 380 * fall}) rotate(${(1 - fall) * 200 - 6})`} opacity={cl(fall * 2)}>{Bill("$20")}</g>
      <g transform={`translate(${960 + 460 * split} ${580 + 40 * Math.sin(split * Math.PI)}) rotate(${12 * split}) scale(${0.75 * split})`} opacity={split}>{Bill("$5")}</g>
    </svg>
    <Tag tt={tt} at={3.0} x={660} y={820} txt="STAN" col={TX} size={38} />
    <Tag tt={tt} at={3.4} x={1420} y={820} txt="ME" col={AMB} size={38} />
  </>;
}}</Stage>;

// ---- 5:49 · LA LOZA FRÍA: el tazón escarchado de invierno; la olla hirviendo vierte y una grieta corre por la loza ----
export const HFrostCrack: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const pour = eio(tt, 1.0, 2.4), crack = eio(tt, 2.6, 4.2);
  return <>
    <Head tt={tt} kick="MISTAKE NUMBER ONE" title="BOILING WATER" col={RED} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <ToiletSide x={960} y={820} s={1.6} col="#eef3f6" />
      {Array.from({ length: 30 }, (_, i) => <path key={i} d={`M ${700 + rn(i) * 520} ${640 + rn(i, 2) * 160} l 10 -10 m -10 0 l 10 10`} stroke="#cfe8f6" strokeWidth={3} opacity={0.8 * (1 - crack)} />)}
      <g transform={`translate(${1340} ${300}) rotate(${-50 * pour})`}><rect x={-120} y={-70} width={240} height={150} rx={14} fill="#5a6066" /><rect x={-150} y={-80} width={300} height={22} rx={8} fill="#40454a" /></g>
      {pour > 0.05 && Array.from({ length: 6 }, (_, i) => <path key={i} d={`M ${1200 + i * 6} 300 q ${-60} 120 ${-200} ${260}`} stroke="#f2f8fb" strokeWidth={8} fill="none" opacity={0.7 * (1 - crack * 0.6)} />)}
      <path d="M 820 600 L 860 660 L 830 720 L 880 790 L 850 860" stroke="#1a1a1a" strokeWidth={6} fill="none" pathLength={1} strokeDasharray={`${crack} 1`} />
    </svg>
    <Tag tt={tt} at={3.6} x={560} y={460} txt="COLD PORCELAIN CRACKS" col={RED} size={32} />
  </>;
}}</Stage>;

// ---- 6:06 · EL ANILLO DE CERA: vista bajo el inodoro; el anillo amarillo se ablanda, se achata y deja un hueco ----
export const HWaxMelt: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const m = eio(tt, 1.2, 4.0);
  return <>
    <Head tt={tt} kick="UNDER THE TOILET" title="THE WAX SEAL" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <rect x={300} y={700} width={1320} height={240} fill="#b9a789" /><rect x={860} y={700} width={200} height={240} fill="#2a2420" />
      <path d="M 520 380 L 1400 380 L 1340 560 L 580 560 Z" fill={PORC} /><rect x={900} y={560} width={120} height={80} fill={PORC} />
      <g transform={`translate(960 ${670 + 20 * m})`}><ellipse rx={170 + 40 * m} ry={36 - 18 * m} fill="#e7c25a" /><ellipse rx={90} ry={20 - 10 * m} fill="#2a2420" /></g>
      {Array.from({ length: 6 }, (_, i) => <ellipse key={i} cx={780 + i * 70} cy={700 + 60 * m * rn(i)} rx={8} ry={14} fill="#e7c25a" opacity={m} />)}
      <path d={`M 1110 ${660} q 40 20 80 0`} stroke={WATER} strokeWidth={10} fill="none" opacity={eio(tt, 3.6, 4.4)} />
    </svg>
    <Tag tt={tt} at={2.6} x={1450} y={300} txt="HOT FROM THE TAP · ENOUGH" col={ICE} size={30} />
  </>;
}}</Stage>;

// ---- 6:29 · DESDE LA CINTURA: una regla vertical junto a la persona; el chorro cae tres pies y empuja una flecha dentro del sifón ----
export const HWaistDrop: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const pour = eio(tt, 1.2, 2.2), push = eio(tt, 2.4, 4.6);
  return <>
    <Head tt={tt} kick="HOW YOU POUR MATTERS" title="FROM THE WAIST" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <rect x={360} y={240} width={60} height={700} fill="#f0c94a" />{[0, 1, 2, 3].map((i) => <g key={i}><rect x={360} y={940 - i * 233} width={90} height={6} fill="#3a2d10" /><text x={460} y={950 - i * 233} fontFamily={MARK} fontSize={34} fill={TX}>{i} FT</text></g>)}
      <ToiletSide x={1000} y={900} s={1.2} />
      <g transform={`translate(1100 ${260}) rotate(${70 * pour})`}><path d="M -90 -80 L 90 -80 L 70 80 L -70 80 Z" fill="#e8e6e0" /></g>
      {pour > 0.3 && <path d={`M 1060 300 Q 1000 500 980 ${560 + 140 * push}`} stroke="#bfe4f5" strokeWidth={26} fill="none" strokeLinecap="round" opacity={0.85} />}
      <path d={`M 980 ${720} L 980 ${720 + 120 * push}`} stroke={RED} strokeWidth={14} /><path d={`M 950 ${700 + 120 * push} l 30 40 l 30 -40`} stroke={RED} strokeWidth={14} fill="none" opacity={push} />
    </svg>
    <Tag tt={tt} at={3.4} x={1420} y={760} txt="THE WEIGHT PUSHES" col={RED} size={34} />
  </>;
}}</Stage>;

// ---- 7:17 · LA LÍNEA DE 15 MINUTOS: un camino curvo con cuatro paradas (asienta · ablanda · suelta · baja) que se recorren ----
export const HTimeline15: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const S: [string, string][] = [["0-3 MIN", "SOAP SETTLES"], ["5 MIN", "PAPER SOFTENS"], ["10 MIN", "IT LETS GO"], ["15 MIN", "IT DRAINS"]];
  const p = eio(tt, 0.6, 6.4);
  return <>
    <Head tt={tt} kick="WHILE YOU WAIT" title="WHAT'S HAPPENING DOWN THERE" col={ICE} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d="M 300 760 C 560 500 760 860 1000 620 S 1460 460 1640 600" stroke="rgba(255,255,255,.25)" strokeWidth={10} fill="none" />
      <path d="M 300 760 C 560 500 760 860 1000 620 S 1460 460 1640 600" stroke={AMB} strokeWidth={10} fill="none" pathLength={1} strokeDasharray={`${p} 1`} />
    </svg>
    {S.map(([a, b], i) => { const at = 0.8 + i * 1.4, s = phys(tt, at, 6, 0.45), x = [330, 760, 1180, 1610][i], y = [720, 700, 600, 580][i];
      return <div key={a} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`, opacity: cl(s * 2), textAlign: "center" }}>
        <div style={{ width: 90, height: 90, borderRadius: "50%", margin: "0 auto", background: i === 3 ? ICE : AMB, boxShadow: "0 10px 30px rgba(0,0,0,.5)" }} />
        <div style={{ fontFamily: MARK, fontSize: 36, color: TX, marginTop: 14 }}>{a}</div><div style={{ fontFamily: HAND, fontSize: 38, color: DIM }}>{b}</div></div>; })}
  </>;
}}</Stage>;

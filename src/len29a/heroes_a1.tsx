// len29a · componentes únicos 1-15 (0:23 → 11:19), 2ª vuelta tras el evaluador: cada pieza es UN objeto con volumen
// (degradés de material, sombra de contacto) y UN mecanismo que cuenta la idea sin leer; los elementos llegan de a uno,
// el momento fuerte cae en la palabra clave y nada pisa el título. Stage: foto del momento desenfocada, cámara curva, salida fundida.
import React from "react";
import { AMB, DIM, Defs, H, HAND, Head, ICE, MARK, RED, Shadow, Stage, TX, Tag, cl, eio, phys } from "./hkit";

const rn = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const FULL = { position: "absolute", inset: 0 } as const;
// tubo en corte (lado a lado): pared con volumen + canal oscuro adentro; se dibuja con trazos superpuestos sobre el mismo camino
const Tube: React.FC<{ d: string; w: number; col?: string; inner?: string; op?: number }> = ({ d, w, col = "#f1ede4", inner = "#16181b", op = 1 }) => <g opacity={op}>
  <path d={d} stroke="#8f897c" strokeWidth={w + 8} fill="none" strokeLinejoin="round" />
  <path d={d} stroke={col} strokeWidth={w} fill="none" strokeLinejoin="round" />
  <path d={d} stroke="rgba(255,255,255,.55)" strokeWidth={w * 0.12} fill="none" strokeLinejoin="round" transform={`translate(${-w * 0.22} ${-w * 0.22})`} />
  <path d={d} stroke={inner} strokeWidth={w * 0.72} fill="none" strokeLinejoin="round" />
</g>;
const Bubble: React.FC<{ x: number; y: number; r: number; o?: number }> = ({ x, y, r, o = 1 }) => <g opacity={o}>
  <circle cx={x} cy={y} r={r} fill="rgba(255,255,255,.82)" stroke="rgba(190,225,250,.9)" strokeWidth={2} />
  <circle cx={x - r * 0.35} cy={y - r * 0.38} r={r * 0.26} fill="#fff" /></g>;
const Lump: React.FC<{ x: number; y: number; s: number; n?: number; seed?: number; col?: string }> = ({ x, y, s, n = 16, seed = 1, col = "#7d786c" }) => <g>
  {Array.from({ length: n }, (_, i) => <ellipse key={i} cx={x + (rn(i, seed) - 0.5) * 1.6 * s} cy={y + (rn(i, seed + 1) - 0.5) * 0.7 * s} rx={s * (0.25 + 0.2 * rn(i, seed + 2))} ry={s * (0.18 + 0.12 * rn(i, seed + 3))} fill={i % 4 === 0 ? "#a9a291" : col} />)}
  {Array.from({ length: 10 }, (_, i) => <path key={"h" + i} d={`M ${x - s + rn(i, seed + 4) * 2 * s} ${y - 0.3 * s} q ${s * 0.4} ${s * 0.5} ${s * 0.9} ${s * (rn(i, seed + 5) - 0.3)}`} stroke="#2a1e16" strokeWidth={2.5} fill="none" />)}
</g>;

// ---- 0:23 · LA PARED DE AGUA: las bolitas de espuma caen por el caño de cola, pegan en el agua quieta del sifón, rebotan y se apilan; el tapón de abajo ni se entera ----
export const HFoamWall: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const pipe = cl(phys(tt, 0.1, 5, 0.7)), WL = 640, U = "M 820 250 L 820 700 A 200 200 0 0 0 1220 700 L 1220 560 L 1640 560";
  const hits = Array.from({ length: 9 }, (_, i) => 0.9 + i * 0.55);
  return <>
    <Head tt={tt} kick="UNDER YOUR SINK" title="THE FOAM NEVER GETS DOWN" col={ICE} />
    <svg width={1920} height={1080} style={FULL}><Defs />
      <defs><clipPath id="fwC"><rect x={0} y={WL} width={1920} height={600} /></clipPath></defs>
      <g opacity={pipe} transform={`translate(0 ${(1 - pipe) * 80})`}>
        <path d="M 560 250 L 1080 250 L 1040 205 L 600 205 Z" fill="url(#chromeV)" />
        <Tube d={U} w={150} />
        <path d={U} stroke="url(#waterV)" strokeWidth={108} fill="none" clipPath="url(#fwC)" />
        <rect x={766} y={WL - 3} width={108} height={6} fill="#dff4ff" opacity={0.8} />
      </g>
      {/* el tapón gris con pelo, al fondo de la U, quieto todo el tiempo */}
      <g opacity={cl(phys(tt, 0.8, 5, 0.6))}><Lump x={1020} y={880} s={70} seed={3} /></g>
      <circle cx={1020} cy={880} r={110} fill="none" stroke={RED} strokeWidth={4} opacity={0.35 + 0.25 * Math.sin(tt * 3)} strokeDasharray="10 14" />
      {/* cada bolita: cae por el caño, pega en el agua (onda), rebota y queda flotando apilada */}
      {hits.map((a, i) => {
        const k = tt - a + 0.5; if (k <= 0) return null;
        const fall = Math.min(1, k / 0.5), stackY = WL - 26 - (i % 3) * 40 - Math.floor(i / 3) * 6, x = 820 + ((i % 3) - 1) * 30;
        const bo = k > 0.5 ? 120 * Math.exp(-(k - 0.5) * 2.6) * Math.abs(Math.cos((k - 0.5) * 6)) : 0;
        const y = k <= 0.5 ? 210 + fall * fall * (stackY - 210) : stackY - bo;
        return <Bubble key={i} x={x} y={y} r={26 + 6 * rn(i)} />;
      })}
      {hits.map((a, i) => { const k = tt - a; if (k < 0 || k > 0.8) return null; return <ellipse key={"r" + i} cx={820} cy={WL} rx={30 + 70 * k} ry={8 + 10 * k} fill="none" stroke="#e8f8ff" strokeWidth={4} opacity={1 - k / 0.8} />; })}
      {/* la «pared»: brilla en cada golpe */}
      <rect x={766} y={WL - 10} width={108} height={20} rx={6} fill={ICE} opacity={hits.reduce((m, a) => Math.max(m, Math.exp(-Math.abs(tt - a) * 6)), 0) * 0.8} />
    </svg>
  </>;
}}</Stage>;

// ---- 0:40 · LA SEMANA DE VOLCANES: cada noche cae otra caja de bicarbonato y otro bidón vacío sobre la mesada y el contador mecánico rueda ----
export const HPipeBoxes: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const N = 7, step = 0.66, roll = cl((tt - 0.7) / (step * (N - 1) + 0.3)) * N;
  return <>
    <Head tt={tt} kick="SAME SINK · EVERY NIGHT" title="A WEEK OF VOLCANOES" col={AMB} />
    <svg width={1920} height={1080} style={FULL}><Defs />
      {/* la mesada en perspectiva */}
      <path d="M 200 760 L 1720 760 L 1620 640 L 300 640 Z" fill="#cfc4ab" /><rect x={200} y={760} width={1520} height={34} fill="url(#woodV)" />
      {Array.from({ length: N }, (_, i) => {
        const a = 0.7 + i * step, s = phys(tt, a, 7, 0.38); if (s <= 0.005) return null;
        const x = 360 + i * 190, y = 720 - (1 - s) * 260, rot = (rn(i) - 0.5) * 14 * (1 - s * 0.5);
        return <g key={i} transform={`translate(${x} ${y}) rotate(${rot})`} opacity={cl(s * 3)}>
          <Shadow x={30} y={4} w={170} o={s} />
          <rect x={-50} y={-130} width={86} height={130} rx={4} fill="#efe9da" /><rect x={-50} y={-130} width={22} height={130} fill="#fffaf0" opacity={0.7} /><path d="M -50 -130 L 36 -130 L 50 -150 L -36 -150 Z" fill="#ddd5c2" />
          <rect x={-40} y={-92} width={66} height={30} rx={3} fill="#e9a23a" />
          <g transform="translate(66 -36) rotate(-8)"><path d="M -36 36 L -36 -40 Q -36 -60 -16 -60 L 16 -60 Q 36 -60 36 -40 L 36 36 Z" fill="url(#glassH)" stroke="rgba(255,255,255,.65)" strokeWidth={3} /><rect x={-12} y={-80} width={24} height={22} rx={4} fill="#d8d2c6" /></g>
        </g>;
      })}
      {/* el contador de noches: rodillo mecánico que gira de 0 a 7 */}
      <g transform="translate(1500 330)">
        <rect x={-110} y={-110} width={220} height={220} rx={26} fill="url(#ironV)" stroke="#2b2e31" strokeWidth={6} />
        <rect x={-74} y={-80} width={148} height={160} rx={12} fill="#f5efe1" />
        <clipPath id="pbC"><rect x={-74} y={-80} width={148} height={160} rx={12} /></clipPath>
        <g clipPath="url(#pbC)">{Array.from({ length: N + 2 }, (_, i) => <text key={i} x={0} y={52 + (i - roll) * 150} textAnchor="middle" fontFamily={MARK} fontSize={140} fill="#2a2520">{i}</text>)}
          <rect x={-74} y={-80} width={148} height={40} fill="url(#shadowR)" opacity={0.5} /></g>
        <text x={0} y={160} textAnchor="middle" fontWeight={900} fontSize={34} letterSpacing={5} fill={DIM}>NIGHTS</text>
      </g>
    </svg>
  </>;
}}</Stage>;

// ---- 1:55 · LA BALANZA: bicarbonato y vinagre se equilibran; se vuelcan al vaso, que se llena de agua con sal que se disuelve y los platillos suben vacíos ----
export const HScale: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const b1 = phys(tt, 0.5, 6, 0.4), b2 = phys(tt, 1.3, 6, 0.4), pour = eio(tt, 3.0, 4.2), fill = eio(tt, 3.2, 5.0), up = eio(tt, 4.2, 5.0);
  const tilt = (9 * (b1 - b2) + 3 * Math.sin(tt * 1.3) * Math.exp(-(tt - 1.3) * 0.8) * (tt > 1.3 ? 1 : 0)) * (1 - up);
  const sy = (side: number) => 470 + side * Math.sin(tilt * Math.PI / 180) * 330 - 18 * up;
  const Pan = ({ x, side }: { x: number; side: number }) => <g transform={`translate(${x} ${sy(side)})`}>
    <line x1={-110} y1={0} x2={0} y2={-150} stroke="url(#brassV)" strokeWidth={4} /><line x1={110} y1={0} x2={0} y2={-150} stroke="url(#brassV)" strokeWidth={4} />
    <path d="M -130 0 Q 0 64 130 0 Z" fill="url(#brassV)" /></g>;
  return <>
    <Head tt={tt} kick="A BASE + AN ACID" title="THEY CANCEL OUT" col={AMB} />
    <svg width={1920} height={1080} style={FULL}><Defs />
      <Shadow x={960} y={880} w={420} />
      <rect x={948} y={330} width={24} height={530} fill="url(#brassH)" /><path d="M 840 880 L 1080 880 L 1030 846 L 890 846 Z" fill="url(#woodV)" />
      <g transform={`rotate(${tilt} 960 330)`}><rect x={630} y={321} width={660} height={18} rx={9} fill="url(#brassV)" /><circle cx={960} cy={330} r={20} fill="url(#brassR)" /></g>
      <Pan x={630} side={-1} /><Pan x={1290} side={1} />
      {/* taza de bicarbonato (montañita blanca) y frasco de vinagre: se vuelcan hacia el vaso */}
      <g opacity={cl(b1 * 2)} transform={`translate(${630 + 200 * pour} ${sy(-1) - 20 - (1 - b1) * 300 - 160 * pour}) rotate(${70 * pour})`}>
        <path d="M -60 -70 L 60 -70 L 48 0 L -48 0 Z" fill="url(#pvcH)" /><path d={`M -55 -70 Q 0 ${-120 + 60 * pour} 55 -70 Z`} fill="#fff" opacity={1 - pour} /></g>
      <g opacity={cl(b2 * 2)} transform={`translate(${1290 - 200 * pour} ${sy(1) - 20 - (1 - b2) * 300 - 160 * pour}) rotate(${-70 * pour})`}>
        <path d="M -55 -110 L 55 -110 L 48 0 L -48 0 Z" fill="url(#glassH)" stroke="rgba(255,255,255,.7)" strokeWidth={3} /><rect x={-46} y={-70 + 60 * pour} width={92} height={Math.max(0, 66 - 60 * pour)} fill="rgba(240,226,170,.6)" /></g>
      {/* los chorros que caen al vaso */}
      {pour > 0.3 && pour < 0.98 && <><path d={`M 800 ${300} Q 880 420 935 ${800 - 200 * fill}`} stroke="#fff" strokeWidth={10} fill="none" opacity={0.7} /><path d={`M 1120 ${300} Q 1040 420 985 ${800 - 200 * fill}`} stroke="rgba(240,226,170,.8)" strokeWidth={10} fill="none" /></>}
      {/* el vaso: se llena de agua; la sal (cristalitos) gira y se disuelve */}
      <g transform="translate(960 830)" opacity={cl(phys(tt, 2.6, 5, 0.6))}>
        <path d={`M ${-80} ${-250 * fill} L 80 ${-250 * fill} L 66 0 L -66 0 Z`} fill="url(#waterV)" opacity={0.85} />
        {Array.from({ length: 16 }, (_, i) => { const k = eio(tt, 3.6 + rn(i) * 0.8, 5.6 + rn(i) * 0.6); return <rect key={i} x={(rn(i, 2) - 0.5) * 110} y={-30 - 180 * rn(i, 3) * fill} width={10 * (1 - k)} height={10 * (1 - k)} fill="#fff" transform={`rotate(${45 + tt * 90} ${(rn(i, 2) - 0.5) * 110} ${-30 - 180 * rn(i, 3) * fill})`} opacity={fill * (1 - k)} />; })}
        <path d="M -90 -270 L 90 -270 L 70 0 L -70 0 Z" fill="url(#glassH)" stroke="rgba(255,255,255,.8)" strokeWidth={5} />
      </g>
    </svg>
    <Tag tt={tt} at={5.0} x={960} y={960} txt="SALT WATER" col={ICE} size={46} />
  </>;
}}</Stage>;

// ---- 2:27 · CICERO, 1982: el mapa del oeste de Chicago se tiende, el camino sale del taller de Stan y donde cae el pin se levanta la casita de la señora ----
export const HCicero: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="radial-gradient(ellipse 80% 70% at 50% 50%, #26231c, #0c0b09 75%)">{(tt) => {
  const grid = eio(tt, 0.2, 1.6), road = eio(tt, 1.4, 3.4), pin = phys(tt, 3.2, 7, 0.38), house = phys(tt, 3.9, 5, 0.45), pol = phys(tt, 4.8, 4.5, 0.45);
  const path = "M 560 420 C 720 420 780 560 920 600 S 1180 640 1270 720";
  return <>
    <svg width={1920} height={1080} style={{ ...FULL, transform: `perspective(1600px) rotateX(${30 - 8 * grid}deg) scale(${1.04 - 0.06 * grid + 0.05 * eio(tt, 3.4, 7)})`, transformOrigin: "62% 66%" }}><Defs />
      <rect x={300} y={230} width={1320} height={720} rx={10} fill="#e9dfc6" opacity={0.95 * grid} />
      {Array.from({ length: 14 }, (_, i) => <line key={"v" + i} x1={360 + i * 92} y1={250} x2={360 + i * 92} y2={250 + 680 * grid} stroke="#b8a985" strokeWidth={i % 4 === 0 ? 6 : 2} />)}
      {Array.from({ length: 8 }, (_, i) => <line key={"h" + i} x1={320} y1={290 + i * 86} y2={290 + i * 86} x2={320 + 1280 * grid} stroke="#b8a985" strokeWidth={i % 3 === 0 ? 6 : 2} />)}
      <path d="M 1500 230 C 1480 430 1540 620 1600 950 L 1620 950 L 1620 230 Z" fill="#9fc3d6" opacity={grid} />
      <path d={path} fill="none" stroke={RED} strokeWidth={11} strokeLinecap="round" pathLength={1} strokeDasharray={`${road} 1`} />
      {/* el taller de Stan: casilla con una llave colgada */}
      <g transform="translate(560 420)" opacity={grid}><rect x={-40} y={-70} width={80} height={60} fill="#7a5a3a" /><path d="M -52 -70 L 0 -108 L 52 -70 Z" fill="#4c3423" /><rect x={-12} y={-40} width={24} height={30} fill="#2a1d12" /><circle r={12} fill="#3b3a36" /></g>
      {/* la casa de la señora: se levanta del mapa donde cae el pin */}
      <g transform={`translate(1270 720) scale(1 ${house})`} opacity={cl(house * 2)}><Shadow x={0} y={4} w={180} />
        <rect x={-70} y={-110} width={140} height={110} fill="url(#pvcH)" /><path d="M -86 -110 L 0 -176 L 86 -110 Z" fill="#9c3b2c" /><rect x={-18} y={-60} width={36} height={60} fill="#6b4421" />
        <rect x={-58} y={-92} width={30} height={26} fill="#ffd88a" /><rect x={28} y={-92} width={30} height={26} fill="#ffd88a" /></g>
    </svg>
    <div style={{ position: "absolute", left: 1290, top: 560, transform: `translate(-50%,-100%) translateY(${(1 - pin) * -420}px)`, opacity: cl(pin * 3) * (1 - eio(tt, 3.9, 4.3)) }}>
      <svg width={80} height={110}><path d="M 40 108 C 12 66 2 48 2 38 A 38 38 0 1 1 78 38 C 78 48 68 66 40 108 Z" fill={RED} /><circle cx={40} cy={38} r={14} fill="#fff" /></svg></div>
    <div style={{ position: "absolute", left: 1460, top: 300, width: 300, padding: "14px 14px 48px", background: "#f7f3ea", boxShadow: "0 40px 80px rgba(0,0,0,.55)", opacity: cl(pol * 2), transform: `translateY(${(1 - pol) * 300}px) rotate(${7 - (1 - pol) * 20}deg)` }}>
      <div style={{ height: 200, background: "linear-gradient(160deg,#c9b48c,#7d6a4c)", position: "relative", overflow: "hidden" }}>
        {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 34 + i * 82, bottom: 26, width: 60, height: 90, background: "linear-gradient(90deg,#fffaf0,#e1d8c2)", boxShadow: "6px 6px 0 rgba(0,0,0,.18)" }} />)}</div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 8, textAlign: "center", fontFamily: HAND, fontSize: 40, fontWeight: 700, color: "#3b3328" }}>3 empty boxes</div>
    </div>
    <Head tt={tt} kick="A LADY CALLS STAN" title="CICERO · 1982" col={RED} />
  </>;
}}</Stage>;

// ---- 3:19 · ARRIBA / ABAJO: las dos esferas (base blanca, ácido ámbar) chocan ARRIBA, en la pileta, con chispas y efervescencia; ABAJO, el tapón en la U ni se mueve ----
export const HUpDown: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const top = cl(phys(tt, 0.2, 5, 0.6)), bot = cl(phys(tt, 1.6, 5, 0.6)), m = Math.min(1, Math.max(0, tt - 0.3) / 0.8), boom = tt > 1.1 ? Math.exp(-(tt - 1.1) * 1.6) : 0;
  return <>
    <svg width={1920} height={1080} style={FULL}><Defs />
      <g opacity={top} transform={`translate(0 ${(1 - top) * -120})`}>
        {/* la pileta (de costado) */}
        <path d="M 560 220 L 1360 220 L 1300 470 Q 960 520 620 470 Z" fill="url(#chromeV)" opacity={0.55} />
        <circle cx={960 - 300 * (1 - m) - 70 * (1 - Math.min(1, boom * 3))} cy={340} r={88} fill="url(#pvcR)" />
        <circle cx={960 + 300 * (1 - m) + 70 * (1 - Math.min(1, boom * 3))} cy={340} r={88} fill="url(#yellowR)" />
        {Array.from({ length: 46 }, (_, i) => { const k = cl((tt - 1.1 - rn(i) * 3.2) / 1.3); if (k <= 0 || k >= 1) return null; const a = -Math.PI * rn(i, 2);
          return <Bubble key={i} x={960 + Math.cos(a) * 340 * k} y={340 + Math.sin(a) * 200 * k} r={6 + 14 * rn(i, 3)} o={1 - k} />; })}
        {Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2, r = 60 + 260 * (1 - boom); return <line key={"s" + i} x1={960 + Math.cos(a) * r} y1={340 + Math.sin(a) * r * 0.6} x2={960 + Math.cos(a) * (r + 40)} y2={340 + Math.sin(a) * (r + 40) * 0.6} stroke="#ffe7a8" strokeWidth={5} opacity={boom} />; })}
      </g>
      <line x1={140} x2={1780} y1={560} y2={560} stroke="rgba(255,255,255,.2)" strokeWidth={4} strokeDasharray="22 16" opacity={top} />
      <g opacity={bot} transform={`translate(0 ${(1 - bot) * 120})`}>
        <Tube d="M 820 560 L 820 820 A 140 140 0 0 0 1100 820 L 1100 700 L 1400 700" w={110} />
        <path d="M 820 760 L 820 820 A 140 140 0 0 0 1100 820 L 1100 760" stroke="url(#waterV)" strokeWidth={80} fill="none" />
        <Lump x={960} y={950} s={52} seed={7} />
      </g>
    </svg>
    <Tag tt={tt} at={1.3} x={300} y={340} txt="UP HERE" col={AMB} size={56} anchor="l" />
    <Tag tt={tt} at={2.4} x={1460} y={900} txt="NOT HERE" col={DIM} size={56} anchor="l" />
  </>;
}}</Stage>;

// ---- 4:10 · LA PILETA DE NATACIÓN: una burbuja grande sale del fondo de una pileta de verdad, crece al subir y revienta en la superficie: el gas sólo va para arriba ----
export const HPool: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 80% 70% at 50% 50%, #0f2230, #05090d 75%)">{(tt) => {
  const tank = cl(phys(tt, 0.1, 4.5, 0.65)), k = cl((tt - 1.2) / 3.2), by = 860 - 560 * eio(tt, 1.2, 4.4), br = 18 + 46 * k, pop = tt > 4.4 ? cl((tt - 4.4) / 0.9) : 0;
  return <>
    <svg width={1920} height={1080} style={FULL}><Defs />
      <defs><linearGradient id="plW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5ec7ef" /><stop offset="1" stopColor="#0c4772" /></linearGradient></defs>
      <g opacity={tank} transform={`translate(0 ${(1 - tank) * 200})`}>
        {/* pileta en perspectiva: fondo de baldosas, paredes, el agua */}
        <path d="M 300 300 L 1620 300 L 1500 900 L 420 900 Z" fill="url(#plW)" />
        {Array.from({ length: 13 }, (_, i) => <line key={"a" + i} x1={300 + i * 110} y1={300} x2={420 + i * 90} y2={900} stroke="rgba(255,255,255,.12)" strokeWidth={3} />)}
        {Array.from({ length: 7 }, (_, i) => { const y = 340 + i * 90, f = (y - 300) / 600; return <line key={"b" + i} x1={300 + 120 * f} x2={1620 - 120 * f} y1={y} y2={y} stroke="rgba(255,255,255,.12)" strokeWidth={3} />; })}
        {Array.from({ length: 10 }, (_, i) => <path key={"c" + i} d={`M ${450 + i * 105 + 20 * Math.sin(tt * 1.3 + i)} ${700 + 60 * Math.sin(i)} q 40 -22 80 0 q 40 22 80 0`} stroke="rgba(220,250,255,.32)" strokeWidth={6} fill="none" />)}
        <path d={`M 300 300 ${Array.from({ length: 27 }, (_, i) => `L ${300 + i * 50.8} ${300 + 8 * Math.sin(tt * 2.4 + i * 0.7) + (Math.abs(300 + i * 50.8 - 960) < 120 ? -30 * pop * (1 - pop) * 4 : 0)}`).join(" ")}`} stroke="#d9f6ff" strokeWidth={6} fill="none" />
        <rect x={290} y={280} width={1340} height={22} rx={6} fill="url(#pvcV)" />
        <rect x={935} y={850} width={50} height={36} rx={8} fill="url(#chromeV)" />
      </g>
      {pop < 0.05 && tt > 1.2 && <g><circle cx={960 + 14 * Math.sin(tt * 3)} cy={by} r={br} fill="rgba(255,255,255,.12)" stroke="#effcff" strokeWidth={4} /><circle cx={960 + 14 * Math.sin(tt * 3) - br * 0.35} cy={by - br * 0.4} r={br * 0.22} fill="#fff" /></g>}
      {Array.from({ length: 18 }, (_, i) => { const a = -Math.PI * (0.1 + 0.8 * rn(i)), v = 140 + 160 * rn(i, 2); return <circle key={i} cx={960 + Math.cos(a) * v * pop} cy={300 + Math.sin(a) * v * pop + 260 * pop * pop} r={8 + 8 * rn(i, 3)} fill="#e9fbff" opacity={pop > 0 ? 1 - pop : 0} />; })}
      {Array.from({ length: 12 }, (_, i) => { const kk = ((tt * 0.6 + rn(i, 4)) % 1); return <circle key={"m" + i} cx={960 + 30 * Math.sin(kk * 8 + i)} cy={860 - kk * 520} r={5 + 4 * rn(i, 5)} fill="none" stroke="#e9fbff" strokeWidth={2} opacity={tank * 0.6 * (1 - kk)} />; })}
    </svg>
    <Head tt={tt} kick="GAS LOOKS FOR AIR" title="BUBBLES ONLY GO UP" col={ICE} />
  </>;
}}</Stage>;

// ---- 4:31 · LA CINTA MÉTRICA: la hoja amarilla baja por el caño de vidrio desde el desagüe, pega en el tapón de grasa y se frena; se marca la franja de 6 a 18 pulgadas ----
export const HRuler: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const px = 34, top = 250, plugT = top + 7 * px, L = Math.min(eio(tt, 0.6, 2.4) * 22 * px, plugT - top + 4), hit = tt > 2.2 ? Math.exp(-(tt - 2.2) * 5) : 0, band = phys(tt, 2.6, 6, 0.55);
  return <>
    <Head tt={tt} kick="MEASURED FROM THE DRAIN" title="WHERE THE CLOG LIVES" col={AMB} />
    <svg width={1920} height={1080} style={FULL}><Defs />
      {/* el desagüe y el caño de vidrio en corte */}
      <ellipse cx={800} cy={top} rx={120} ry={22} fill="url(#chromeV)" />
      <rect x={730} y={top} width={140} height={800} fill="url(#glassH)" stroke="rgba(255,255,255,.55)" strokeWidth={5} />
      {/* el tapón de grasa y pelo, con volumen */}
      <g opacity={cl(phys(tt, 0.3, 5, 0.6))} transform={`translate(${hit * 6 * Math.sin(tt * 60)} 0)`}>
        <rect x={738} y={plugT} width={124} height={11 * px} rx={30} fill="url(#greaseH)" /><Lump x={800} y={plugT + 5 * px} s={56} seed={5} col="#b3a77d" /></g>
      <rect x={734} y={top + 6 * px} width={132} height={12 * px} fill={RED} opacity={0.22 * cl(band)} />
      {/* la cinta: caja amarilla arriba a la derecha del desagüe; la hoja entra por el desagüe y baja */}
      <g transform={`translate(0 ${(1 - cl(phys(tt, 0.2, 6, 0.5))) * -200})`}>
        <rect x={900} y={top - 120} width={150} height={130} rx={26} fill="url(#yellowR)" stroke="#a77d06" strokeWidth={5} /><circle cx={975} cy={top - 55} r={26} fill="url(#ironR)" />
        <path d={`M 905 ${top - 20} Q 820 ${top - 20} 810 ${top + 10}`} stroke="#f6d548" strokeWidth={40} fill="none" />
        <rect x={790} y={top} width={40} height={L} fill="url(#yellowH)" />
        {Array.from({ length: 23 }, (_, i) => i * px <= L ? <line key={i} x1={790} x2={i % 6 === 0 ? 826 : 806} y1={top + i * px} y2={top + i * px} stroke="#2a2410" strokeWidth={i % 6 === 0 ? 4 : 2} /> : null)}
      </g>
      <g opacity={cl(band)}><path d={`M 900 ${top + 6 * px} L 950 ${top + 6 * px} L 950 ${top + 18 * px} L 900 ${top + 18 * px}`} fill="none" stroke={RED} strokeWidth={8} /></g>
    </svg>
    <Tag tt={tt} at={2.8} x={980} y={top + 12 * px} txt="6 – 18 INCHES" col={RED} size={60} anchor="l" />
  </>;
}}</Stage>;

// ---- 5:16 · LA LUPA: el caño de frente con las capas de la cocina (pared, grasa, jabón, pelo); una lupa de vidrio pasa y agranda de verdad lo que tiene debajo ----
const Rings: React.FC<{ tt: number }> = ({ tt }) => <g>
  <circle cx={960} cy={600} r={300} fill="url(#pvcR)" />
  <circle cx={960} cy={600} r={262} fill="url(#greaseR)" opacity={cl(phys(tt, 0.6, 5, 0.6))} />
  {Array.from({ length: 40 }, (_, i) => { const a = rn(i) * Math.PI * 2, r = 210 + 46 * rn(i, 2); return <circle key={i} cx={960 + Math.cos(a) * r} cy={600 + Math.sin(a) * r} r={8 + 10 * rn(i, 3)} fill="#f6e7b0" opacity={0.8 * cl(phys(tt, 0.8, 5, 0.6))} />; })}
  <circle cx={960} cy={600} r={200} fill="#d9d4c4" opacity={cl(phys(tt, 1.4, 5, 0.6))} />
  {Array.from({ length: 34 }, (_, i) => { const a = rn(i, 4) * Math.PI * 2, r = 150 + 40 * rn(i, 5); return <path key={"h" + i} d={`M ${960 + Math.cos(a) * r} ${600 + Math.sin(a) * r} q ${40 * Math.cos(a + 1.6)} ${40 * Math.sin(a + 1.6)} ${90 * Math.cos(a + 1)} ${90 * Math.sin(a + 1)}`} stroke="#2a1e16" strokeWidth={3} fill="none" opacity={cl(phys(tt, 2.0, 5, 0.6))} />; })}
  <circle cx={960} cy={600} r={120} fill="#121315" />
</g>;
export const HLoupe: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const p = eio(tt, 2.4, 6.6), a = -2.4 + 2.2 * p, lx = 960 + Math.cos(a) * 235, ly = 600 + Math.sin(a) * 235, on = cl(phys(tt, 2.2, 5, 0.6)), layer = p < 0.5 ? "GREASE" : "HAIR";
  return <>
    <Head tt={tt} kick="A KITCHEN CLOG" title="LAYER BY LAYER" col={AMB} />
    <svg width={1920} height={1080} style={FULL}><Defs />
      <defs><clipPath id="lpC"><circle cx={lx} cy={ly} r={130} /></clipPath></defs>
      <Shadow x={960} y={930} w={520} />
      <g transform={`scale(${cl(phys(tt, 0.1, 5, 0.6))})`} style={{ transformOrigin: "960px 600px" }}><Rings tt={tt} /></g>
      <g opacity={on} transform={`translate(${(1 - on) * 500} 0)`}>
        <g clipPath="url(#lpC)"><g transform={`translate(${lx} ${ly}) scale(2.1) translate(${-lx} ${-ly})`}><Rings tt={tt} /></g></g>
        <circle cx={lx} cy={ly} r={130} fill="url(#glassH)" /><circle cx={lx} cy={ly} r={136} fill="none" stroke="url(#chromeV)" strokeWidth={16} />
        <path d={`M ${lx + 100} ${ly + 100} L ${lx + 230} ${ly + 230}`} stroke="url(#woodH)" strokeWidth={36} strokeLinecap="round" />
      </g>
    </svg>
    <Tag tt={tt} at={2.8} x={1420} y={330} txt={layer} col={layer === "HAIR" ? TX : AMB} size={56} anchor="l" />
  </>;
}}</Stage>;

// ---- 6:10 · LA VELA DE PILSEN: el corte del caño se llena de grasa desde la pared hacia el centro como una vela; aparece la mecha y se prende; al lado cae un palo de amasar ----
export const HCandle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const g = eio(tt, 0.6, 3.4), wick = phys(tt, 3.4, 6, 0.5), fire = cl((tt - 3.9) / 0.5), pin = phys(tt, 4.4, 6, 0.4), fl = fire * (0.85 + 0.15 * Math.sin(tt * 19) * Math.sin(tt * 7));
  return <>
    <Head tt={tt} kick="PILSEN · 1991 · FOUR APARTMENTS" title="A CANDLE INSIDE THE PIPE" col={AMB} />
    <svg width={1920} height={1080} style={FULL}><Defs />
      <circle cx={780} cy={560} r={360} fill="#ffb64a" opacity={0.18 * fl} filter="url(#soft)" />
      {/* el caño acostado con su boca cortada hacia nosotros */}
      <rect x={780} y={330} width={900} height={460} fill="url(#pvcV)" /><ellipse cx={1680} cy={560} rx={70} ry={230} fill="#cfc9bb" />
      <ellipse cx={780} cy={560} rx={150} ry={230} fill="url(#pvcR)" />
      <ellipse cx={780} cy={560} rx={128} ry={204} fill="#111214" />
      {/* la grasa crece de la pared hacia el centro, como una vela */}
      <ellipse cx={780} cy={560} rx={128} ry={204} fill="url(#greaseR)" opacity={cl(g * 3)} />
      <ellipse cx={780} cy={560} rx={128 * (1 - 0.86 * g)} ry={204 * (1 - 0.86 * g)} fill="#111214" />
      {Array.from({ length: 10 }, (_, i) => <ellipse key={i} cx={780 + 90 * Math.cos(i)} cy={560 + 150 * Math.sin(i * 1.7)} rx={10} ry={6} fill="#fff3c4" opacity={g * 0.7} />)}
      {/* mecha y llama */}
      <rect x={776} y={560 - 70 * wick} width={8} height={70 * wick} fill="#2a1e16" />
      <g transform={`translate(780 ${500 - 6 * Math.sin(tt * 9) * fire})`} opacity={fire}><path d={`M 0 0 C -30 -30 -16 ${-90 * fl} 0 ${-120 * fl} C 16 ${-90 * fl} 30 -30 0 0 Z`} fill="#ffb238" /><path d={`M 0 0 C -14 -16 -8 ${-50 * fl} 0 ${-66 * fl} C 8 ${-50 * fl} 14 -16 0 0 Z`} fill="#fff4c0" /></g>
      {/* palo de amasar para dar escala */}
      <g transform={`translate(1220 ${930 - (1 - pin) * 500}) rotate(${(1 - pin) * 30})`} opacity={cl(pin * 3)}><Shadow x={0} y={36} w={640} />
        <rect x={-260} y={-34} width={520} height={68} rx={34} fill="url(#woodV)" /><rect x={-380} y={-14} width={130} height={28} rx={14} fill="url(#woodV)" /><rect x={250} y={-14} width={130} height={28} rx={14} fill="url(#woodV)" /></g>
    </svg>
  </>;
}}</Stage>;

// ---- 7:14 · LA REPISA: las cinco cosas (balde, toalla, guantes, linterna, cepillo) caen de a una sobre una repisa de madera, con rebote, sombra y un pulso al nombrarlas ----
export const HToolFan: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const items: [number, React.ReactNode][] = [
    [380, <g><path d="M -90 -170 L 90 -170 L 70 0 L -70 0 Z" fill="url(#rubberH)" /><path d="M -86 -168 Q 0 -260 86 -168" stroke="url(#ironV)" strokeWidth={8} fill="none" /><ellipse cx={0} cy={-170} rx={90} ry={16} fill="#8a2a22" /></g>],
    [680, <g>{[0, 1, 2].map((k) => <rect key={k} x={-100} y={-40 - k * 36} width={200} height={34} rx={14} fill={k % 2 ? "#7fb3d8" : "#9cc6e4"} />)}</g>],
    [960, <g><path d="M -60 0 L -60 -110 Q -60 -150 -40 -150 L -40 -200 Q -30 -214 -20 -200 L -20 -150 L -4 -150 L -4 -214 Q 6 -228 16 -214 L 16 -150 L 30 -150 L 30 -200 Q 40 -214 50 -200 L 50 -120 Q 80 -150 90 -130 L 60 -40 L 60 0 Z" fill="url(#yellowH)" /></g>],
    [1240, <g><rect x={-110} y={-70} width={170} height={60} rx={14} fill="url(#ironV)" /><path d="M 60 -84 L 110 -100 L 110 20 L 60 4 Z" fill="url(#chromeV)" /><path d="M 110 -100 L 360 -160 L 360 80 L 110 20 Z" fill="#fff4c0" opacity={0.18 + 0.1 * Math.sin(tt * 3)} /></g>],
    [1540, <g transform="rotate(-20)"><rect x={-130} y={-12} width={150} height={24} rx={12} fill="url(#woodV)" />{Array.from({ length: 14 }, (_, k) => <line key={k} x1={20 + k * 8} y1={-34} x2={20 + k * 8} y2={34} stroke="#f2f0ea" strokeWidth={5} />)}</g>],
  ];
  return <>
    <Head tt={tt} kick="NO PLUMBER NEEDED" title="FIVE THINGS, ONE SHELF" col={AMB} />
    <svg width={1920} height={1080} style={FULL}><Defs />
      <path d="M 200 800 L 1720 800 L 1640 720 L 280 720 Z" fill="#b48650" /><rect x={200} y={800} width={1520} height={40} fill="url(#woodV)" />
      <path d="M 300 840 L 360 960 L 400 960 L 360 840 Z" fill="url(#ironH)" /><path d="M 1620 840 L 1560 960 L 1520 960 L 1560 840 Z" fill="url(#ironH)" />
      {items.map(([x, g], i) => { const a = 0.4 + i * 1.0, s = phys(tt, a, 7, 0.34), pulse = 1 + 0.12 * Math.exp(-Math.abs(tt - a - 0.35) * 4); if (s <= 0.005) return null;
        return <g key={i} transform={`translate(${x} ${770 - (1 - s) * 420})`} opacity={cl(s * 3)}><Shadow x={0} y={6} w={220} o={s} /><g transform={`scale(${pulse})`}>{g}</g></g>; })}
    </svg>
  </>;
}}</Stage>;

// ---- 8:01 · LA TUERCA Y EL FRASCO: la tapa de un frasco y la tuerca deslizante giran juntas a la izquierda y las dos saltan sueltas ----
export const HNut: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const rot = -300 * eio(tt, 1.0, 4.0), pop = phys(tt, 4.0, 5, 0.5), lift = 140 * pop, sc = 1 + 0.2 * pop;
  const hex = (r: number) => Array.from({ length: 6 }, (_, i) => `${Math.cos(i * Math.PI / 3) * r},${Math.sin(i * Math.PI / 3) * r}`).join(" ");
  return <>
    <Head tt={tt} kick="LOOKING FROM THE TOP DOWN" title="LIKE OPENING A JAR" col={AMB} />
    <svg width={1920} height={1080} style={FULL}><Defs />
      {/* el frasco */}
      <g transform="translate(620 600)" opacity={cl(phys(tt, 0.2, 5, 0.6))}>
        <Shadow x={0} y={260} w={320} /><rect x={-130} y={-60} width={260} height={320} rx={40} fill="url(#glassH)" stroke="rgba(255,255,255,.6)" strokeWidth={5} />
        <g transform={`translate(0 ${-90 - lift}) rotate(${rot})`} style={{ transformOrigin: "0px 0px" }}><g transform={`scale(${sc})`}><ellipse rx={150} ry={150} fill="url(#chromeR)" />{Array.from({ length: 30 }, (_, i) => <line key={i} x1={Math.cos(i / 30 * 6.283) * 128} y1={Math.sin(i / 30 * 6.283) * 128} x2={Math.cos(i / 30 * 6.283) * 148} y2={Math.sin(i / 30 * 6.283) * 148} stroke="#6b737a" strokeWidth={5} />)}<circle r={18} fill="#e9a23a" cx={90} /></g></g>
      </g>
      {/* la tuerca, vista desde arriba, sobre el caño */}
      <g transform="translate(1300 600)" opacity={cl(phys(tt, 0.5, 5, 0.6))}>
        <circle r={110} fill="#16181b" stroke="url(#pvcV)" strokeWidth={30} />
        <g transform={`translate(0 ${-lift}) rotate(${rot})`}><g transform={`scale(${sc})`}><polygon points={hex(190)} fill="url(#pvcR)" stroke="#8f897c" strokeWidth={6} /><circle r={120} fill="none" stroke="#d6d0c3" strokeWidth={10} />{Array.from({ length: 12 }, (_, i) => <line key={i} x1={Math.cos(i * 0.5236) * 150} y1={Math.sin(i * 0.5236) * 150} x2={Math.cos(i * 0.5236) * 178} y2={Math.sin(i * 0.5236) * 178} stroke="#cbc4b6" strokeWidth={6} />)}<circle r={18} cx={150} fill="#e9a23a" /></g></g>
      </g>
      {/* flecha curva a la izquierda arriba de los dos */}
      {[620, 1300].map((x, i) => <g key={i} opacity={cl(phys(tt, 0.9, 6, 0.6)) * (1 - pop)} transform={`translate(${x} ${i ? 600 : 510})`}><path d="M 200 -60 A 210 210 0 0 0 -60 -200" stroke={AMB} strokeWidth={14} fill="none" strokeLinecap="round" /><path d="M -40 -232 L -84 -196 L -30 -176" fill={AMB} /></g>)}
    </svg>
    <Tag tt={tt} at={1.4} x={960} y={950} txt="COUNTERCLOCKWISE" col={TX} size={52} />
  </>;
}}</Stage>;

// ---- 8:19 · EL DESPIECE: el sifón se abre en el aire en sus piezas con volumen (cola, tuercas, arandelas, la U, el brazo) y vuelve a cerrar ----
export const HExploded: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const e = eio(tt, 0.8, 2.2) * (1 - eio(tt, 5.4, 6.6)), base = cl(phys(tt, 0.1, 5, 0.6));
  const hex = (r: number) => Array.from({ length: 6 }, (_, i) => `${Math.cos(i * Math.PI / 3 + 0.5) * r},${Math.sin(i * Math.PI / 3 + 0.5) * r * 0.42}`).join(" ");
  const nut = (x: number, y: number) => <g transform={`translate(${x} ${y})`}><polygon points={hex(62)} fill="url(#pvcV)" stroke="#8f897c" strokeWidth={4} /><ellipse rx={36} ry={14} fill="#1a1b1d" /></g>;
  const washer = (x: number, y: number) => <g transform={`translate(${x} ${y})`}><ellipse rx={44} ry={14} fill="none" stroke="#e8e2d2" strokeWidth={10} /></g>;
  return <>
    <Head tt={tt} kick="IT'S JUST TWO NUTS" title="THE TRAP, TAKEN APART" col={ICE} />
    <svg width={1920} height={1080} style={FULL}><Defs />
      <g opacity={base}>
        <rect x={830} y={300 - 30 * e} width={76} height={250} fill="url(#chromeH)" />
        {nut(868, 560 + 30 * e)}{washer(868, 590 + 90 * e)}
        <g transform={`translate(${-150 * e} ${150 * e})`}><Tube d="M 868 600 L 868 760 A 150 150 0 0 0 1168 760 L 1168 650" w={90} /></g>
        {washer(1168, 640 + 30 * e - 120 * e)}{nut(1168 + 150 * e, 620 - 40 * e)}
        <g transform={`translate(${240 * e} ${-60 * e})`}><Tube d="M 1168 620 L 1168 590 L 1560 590" w={84} /></g>
      </g>
      <Shadow x={960} y={1000} w={700} o={0.6} />
    </svg>
    <Tag tt={tt} at={2.2} x={1540} y={780} txt="THE U" col={ICE} size={52} anchor="l" />
    <Tag tt={tt} at={2.7} x={560} y={680} txt="SLIP NUT" col={TX} size={44} anchor="l" />
  </>;
}}</Stage>;

// ---- 9:29 · EL CUARTO DE VUELTA: la tuerca, apretada a mano, gira sólo el gajo de 90° iluminado y la arandela se aplasta; si sigue, se raja ----
export const HQuarter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const q = eio(tt, 1.0, 2.4), over = eio(tt, 4.0, 4.6), crack = cl((tt - 4.5) / 0.6), rot = 90 * q + 60 * over;
  const hex = (r: number) => Array.from({ length: 6 }, (_, i) => `${Math.cos(i * Math.PI / 3) * r},${Math.sin(i * Math.PI / 3) * r}`).join(" ");
  return <>
    <Head tt={tt} kick="HAND TIGHT, THEN…" title="A QUARTER TURN. THAT'S IT." col={AMB} />
    <svg width={1920} height={1080} style={FULL}><Defs />
      <g transform="translate(860 620)">
        <Shadow x={0} y={290} w={560} />
        {/* gajo de 90° permitido */}
        <path d={`M 0 0 L 0 -300 A 300 300 0 0 1 300 0 Z`} fill={AMB} opacity={0.18 + 0.2 * q} />
        <path d="M 0 -300 A 300 300 0 0 1 300 0" stroke={AMB} strokeWidth={10} fill="none" />
        {/* la arandela que se aplasta abajo */}
        <ellipse cx={0} cy={250} rx={170} ry={26 - 12 * q} fill="#e8e2d2" stroke="#9a937f" strokeWidth={4} />
        <g transform={`rotate(${rot})`}><polygon points={hex(220)} fill={crack > 0 ? "url(#pvcR)" : "url(#pvcR)"} stroke="#8f897c" strokeWidth={8} /><circle r={130} fill="#16181b" stroke="#d6d0c3" strokeWidth={14} />
          <rect x={-14} y={-232} width={28} height={70} rx={10} fill={over > 0.5 ? RED : AMB} /></g>
        {crack > 0 && <path d={`M 40 -150 L 70 -80 L 50 -20 L 110 60 L 90 140`} stroke="#1a1a1a" strokeWidth={8} fill="none" pathLength={1} strokeDasharray={`${crack} 1`} />}
        {crack > 0.4 && Array.from({ length: 8 }, (_, i) => <rect key={i} x={110 + 90 * crack * rn(i)} y={-40 + 160 * rn(i, 2) + 80 * crack} width={14} height={10} fill="#efe9db" transform={`rotate(${rn(i, 3) * 90})`} />)}
      </g>
    </svg>
    <Tag tt={tt} at={2.2} x={1260} y={420} txt="¼ TURN" col={AMB} size={64} anchor="l" />
    <Tag tt={tt} at={4.6} x={1260} y={760} txt="TOO FAR = CRACK" col={RED} size={48} anchor="l" />
  </>;
}}</Stage>;

// ---- 10:30 · DONDE SE ENFRÍA: el agua corre caliente por el brazo hacia la pared; en la curva de adentro se frena, pasa a azul y la grasa blanca se pega y achica el paso ----
export const HSlowCool: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const g = eio(tt, 1.8, 5.6), path = "M 220 520 L 1180 520 Q 1330 520 1330 670 L 1330 1080";
  return <>
    <Head tt={tt} kick="INSIDE THE WALL" title="IT SLOWS. IT COOLS." col={ICE} />
    <svg width={1920} height={1080} style={FULL}><Defs />
      {/* la pared en corte: yeso + montante */}
      <rect x={1180} y={230} width={40} height={850} fill="#ece8de" /><rect x={1480} y={230} width={40} height={850} fill="#d9d3c4" /><rect x={1220} y={230} width={260} height={850} fill="#1c1b19" />
      <rect x={1380} y={230} width={60} height={850} fill="url(#woodH)" opacity={0.8} />
      <Tube d={path} w={160} />
      {/* la grasa: crece en la curva de adentro y estrecha el paso */}
      <path d="M 1180 470 Q 1380 470 1380 670 L 1380 900" stroke="url(#greaseV)" strokeWidth={30 + 60 * g} fill="none" opacity={cl(g * 3)} />
      {Array.from({ length: 70 }, (_, i) => {
        const ph = ((tt * 0.45 + rn(i)) % 1), slow = ph < 0.62 ? ph / 0.62 : 1 + (ph - 0.62) * 0.4, k = Math.min(1, slow);
        const x = k < 0.86 ? 240 + k / 0.86 * 940 : 1180 + 150 * Math.sin((k - 0.86) / 0.14 * Math.PI / 2), y = k < 0.86 ? 520 : 520 + 150 * (1 - Math.cos((k - 0.86) / 0.14 * Math.PI / 2)) + (slow - 1) * 900;
        const cold = cl((x - 900) / 400);
        return <circle key={i} cx={x} cy={y + (rn(i, 2) - 0.5) * 70} r={9} fill={`rgb(${Math.round(255 - 140 * cold)},${Math.round(170 + 40 * cold)},${Math.round(94 + 160 * cold)})`} opacity={0.9} />;
      })}
    </svg>
    <Tag tt={tt} at={0.8} x={540} y={380} txt="WARM · FAST" col="#ffab5e" size={46} />
    <Tag tt={tt} at={2.6} x={1560} y={900} txt="COLD · SLOW" col={ICE} size={46} anchor="l" />
  </>;
}}</Stage>;

// ---- 11:19 · GIRAR Y EMPUJAR: la manivela roja gira, el cable helicoidal avanza girando por el brazo, dobla en la pared, engancha el tapón de pelo y lo trae de vuelta ----
export const HAugerPath: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const go = eio(tt, 0.6, 3.6), back = eio(tt, 4.4, 6.2), L = go - 0.55 * back, crank = tt * 380 * (1 - back * 0.5);
  const pt = (s: number): [number, number] => s < 0.7 ? [420 + s / 0.7 * 840, 560] : [1260 + 120 * Math.sin((s - 0.7) / 0.3 * Math.PI / 2), 560 + 220 * (1 - Math.cos((s - 0.7) / 0.3 * Math.PI / 2)) + 200 * (s - 0.7)];
  const tip = pt(Math.max(0.02, L * 0.98)), plug = back > 0 ? tip : pt(0.98);
  return <>
    <Head tt={tt} kick="NEVER JUST PUSH" title="TURN AND PUSH" col={AMB} />
    <svg width={1920} height={1080} style={FULL}><Defs />
      <rect x={1240} y={240} width={300} height={840} fill="#1c1b19" /><rect x={1240} y={240} width={26} height={840} fill="#ece8de" />
      <Tube d="M 420 560 L 1260 560 Q 1380 560 1380 780 L 1380 1080" w={130} />
      {/* el cable: tramitos inclinados que corren (gira) */}
      {Array.from({ length: 90 }, (_, i) => { const s = (i / 90) * L; if (s < 0.01) return null; const [x, y] = pt(s); const ph = (i * 0.7 + crank * 0.02) % 1;
        return <line key={i} x1={x - 10} y1={y - 16 + 4 * ph} x2={x + 10} y2={y + 16 - 4 * ph} stroke="url(#chromeV)" strokeWidth={7} strokeLinecap="round" />; })}
      {/* el tapón de pelo: espera en la curva; al volver, viene pegado a la punta */}
      <g transform={`translate(${plug[0]} ${plug[1]})`} opacity={cl(phys(tt, 0.3, 5, 0.6))}><Lump x={0} y={0} s={48} seed={9} /></g>
      {/* la manivela: tambor rojo con manija que gira */}
      <g transform="translate(300 700)"><Shadow x={0} y={150} w={320} /><circle r={130} fill="url(#rubberR)" /><circle r={40} fill="url(#ironR)" />
        <g transform={`rotate(${crank})`}><rect x={-12} y={-130} width={24} height={120} fill="url(#ironH)" /><circle cy={-130} r={22} fill="url(#woodR)" /></g></g>
    </svg>
    <Tag tt={tt} at={4.6} x={1560} y={420} txt="GOT IT" col={AMB} size={58} anchor="l" />
  </>;
}}</Stage>;

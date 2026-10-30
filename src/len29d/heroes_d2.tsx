// len29d · componentes únicos 17-31 (8:25 → 21:12). Mismo Stage: foto del momento desenfocada, entrada con transición,
// elementos de a uno con resorte, cámara curva, salida fundida.
import React from "react";
import { AMB, DIM, H, HAND, Head, ICE, MARK, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

const PORC = "#f3f2ee", CHROME = "#d7dce0", WATER = "#7fbde0", PAPER = "#f1ede2", WIPE = "#e9eef2";
const rn = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

// ---- 8:25 · LA PRUEBA CON SALIDA: una hoja de examen con «FLUSH = TEST»; al lado se abre una puerta de emergencia (la llave) ----
export const HTestExit: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const paper = phys(tt, 0.4, 5, 0.45), door = eio(tt, 2.4, 3.8);
  return <>
    <Head tt={tt} kick="STAN'S RULE" title="NEVER WITHOUT A WAY OUT" col={AMB} />
    <div style={{ position: "absolute", left: 620, top: 560, width: 520, height: 640, background: "#f7f4ea", transform: `translate(-50%,-50%) rotate(${-5 + (1 - paper) * 30}deg) translateY(${(1 - paper) * 300}px)`, opacity: cl(paper * 2), boxShadow: "0 30px 60px rgba(0,0,0,.5)", padding: 40 }}>
      <div style={{ fontFamily: MARK, fontSize: 52, color: "#222" }}>THE FLUSH</div><div style={{ fontFamily: HAND, fontSize: 46, color: "#555", marginTop: 6 }}>is a test</div>
      {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ height: 4, background: "#c9d6e6", marginTop: 54 }} />)}
      <div style={{ position: "absolute", right: 40, top: 40, width: 110, height: 110, border: `8px solid ${RED}`, borderRadius: "50%", fontFamily: HAND, fontSize: 56, color: RED, textAlign: "center", lineHeight: "94px", opacity: eio(tt, 4.4, 5.0) }}>A+</div></div>
    <div style={{ position: "absolute", left: 1180, top: 300, width: 360, height: 540, background: "#141516", border: "12px solid #4a7a3a" }}>
      <svg width={336} height={516}><path d="M 168 300 L 168 420 M 120 420 L 216 420" stroke={CHROME} strokeWidth={14} /><ellipse cx={168} cy={290} rx={46} ry={28} fill={CHROME} /></svg>
      <div style={{ position: "absolute", inset: 0, background: "#3d6a30", transformOrigin: "left center", transform: `perspective(1400px) rotateY(${-95 * door}deg)` }}><div style={{ fontFamily: MARK, fontSize: 52, color: "#e9f5e0", textAlign: "center", marginTop: 40 }}>EXIT</div></div></div>
    <Tag tt={tt} at={3.8} x={1360} y={920} txt="HAND ON THE VALVE" col={ICE} size={32} />
  </>;
}}</Stage>;

// ---- 9:02 · DE GOLPE O DE A POCO: dos relojes de arena; uno se vacía de golpe (algo cayó), el otro gota a gota (se fue armando) ----
export const HSuddenSlow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const a = eio(tt, 1.0, 1.6), b = eio(tt, 1.0, 6.0);
  const Glass = (x: number, f: number, col: string) => <g transform={`translate(${x} 600)`}>
    <path d="M -150 -280 L 150 -280 L 20 0 L 150 280 L -150 280 L -20 0 Z" fill="rgba(220,240,250,.08)" stroke="rgba(230,245,252,.7)" strokeWidth={6} />
    <path d={`M ${-130 * (1 - f)} ${-260 + 250 * f} L ${130 * (1 - f)} ${-260 + 250 * f} L 0 -10 Z`} fill={col} />
    <path d={`M -130 260 L 130 260 L ${130 * (1 - f)} ${260 - 240 * f} L ${-130 * (1 - f)} ${260 - 240 * f} Z`} fill={col} />
    {f > 0.02 && f < 0.98 && <line x1={0} y1={0} x2={0} y2={250} stroke={col} strokeWidth={4} />}
    <rect x={-170} y={-300} width={340} height={24} rx={8} fill="#8a6a3a" /><rect x={-170} y={278} width={340} height={24} rx={8} fill="#8a6a3a" /></g>;
  return <>
    <Head tt={tt} kick="ASK YOURSELF ONE THING" title="ALL AT ONCE · OR SLOW?" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{Glass(620, a, "#d9b36a")}{Glass(1300, b, PAPER)}</svg>
    <Tag tt={tt} at={1.8} x={620} y={950} txt="SOMETHING WENT IN" col={RED} size={32} />
    <Tag tt={tt} at={2.8} x={1300} y={950} txt="SOFT · SOAP WORKS" col={ICE} size={32} />
  </>;
}}</Stage>;

// ---- 9:34 · EL DESFILE: auto, pato de goma, animales de granja, cepillo, llaves salen del sifón en fila, como un desfile ----
export const HToyParade: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const T: React.ReactNode[] = [
    <g><rect x={-60} y={-30} width={120} height={40} rx={10} fill="#d23b2f" /><rect x={-34} y={-56} width={64} height={30} rx={8} fill="#d23b2f" /><circle cx={-34} cy={14} r={16} fill="#222" /><circle cx={34} cy={14} r={16} fill="#222" /></g>,
    <g><ellipse cy={0} rx={60} ry={40} fill="#f2c230" /><circle cx={40} cy={-40} r={28} fill="#f2c230" /><path d="M 64 -40 l 26 6 l -26 8 Z" fill="#e47a1c" /><circle cx={46} cy={-46} r={5} fill="#222" /></g>,
    <g><ellipse rx={64} ry={36} fill="#f4f1ea" /><circle cx={-30} cy={-6} r={14} fill="#222" /><circle cx={20} cy={10} r={12} fill="#222" /><circle cx={70} cy={-24} r={26} fill="#f4f1ea" />{[-40, -10, 20, 46].map((x) => <rect key={x} x={x} y={28} width={10} height={34} fill="#f4f1ea" />)}</g>,
    <g><rect x={-80} y={-8} width={160} height={16} rx={8} fill="#3a8fd8" /><rect x={60} y={-22} width={40} height={44} rx={6} fill="#f2f2f2" /></g>,
    <g><circle cx={-40} r={30} fill="none" stroke="#c9a24a" strokeWidth={10} /><rect x={-10} y={-8} width={90} height={16} fill="#c9a24a" /><rect x={60} y={8} width={10} height={18} fill="#c9a24a" /></g>,
  ];
  return <>
    <Head tt={tt} kick="THINGS I'VE PULLED OUT" title="SOAP WON'T FIX A DUCK" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d="M 120 760 Q 300 700 360 560 Q 400 470 470 520" stroke={PORC} strokeWidth={90} fill="none" strokeLinecap="round" />
      <path d="M 120 760 Q 300 700 360 560 Q 400 470 470 520" stroke="#1a1c1e" strokeWidth={64} fill="none" strokeLinecap="round" />
      <line x1={480} y1={800} x2={1800} y2={800} stroke="rgba(255,255,255,.25)" strokeWidth={4} strokeDasharray="20 18" />
      {T.map((g, i) => { const s = eio(tt, 0.6 + i * 0.55, 2.4 + i * 0.55), x = 470 + s * (1260 - i * 230), y = 520 + 220 * Math.min(1, s * 3) - Math.abs(Math.sin(s * 12)) * 30 * (1 - s);
        return <g key={i} transform={`translate(${x} ${y}) rotate(${(1 - s) * 90})`} opacity={cl(s * 4)}>{g}</g>; })}
    </svg>
  </>;
}}</Stage>;

// ---- 10:07 · EL SELLO: dos sopapas bajan sobre el agujero curvo; la plana deja escapar burbujas, la de manga entra y sella ----
export const HSealFit: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const a = eio(tt, 0.6, 2.0), b = eio(tt, 2.2, 3.6);
  const Hole = (x: number) => <g transform={`translate(${x} 700)`}><path d="M -260 -60 Q 0 120 260 -60 L 260 260 L -260 260 Z" fill={PORC} /><path d="M -60 40 Q 0 70 60 40 L 60 260 L -60 260 Z" fill="#141516" /></g>;
  return <>
    <Head tt={tt} kick="A TOILET HOLE IS CURVED" title="FLAT CUP · NO SEAL" col={RED} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {Hole(600)}{Hole(1320)}
      <g transform={`translate(600 ${220 + 440 * a})`}><rect x={-10} y={-260} width={20} height={260} fill="#a0733c" /><path d="M -130 0 Q 0 -90 130 0 Z" fill="#c2302a" /></g>
      {a > 0.95 && Array.from({ length: 8 }, (_, i) => { const y = 700 - ((tt * 220 + i * 60) % 360); return <circle key={i} cx={600 + (i % 2 ? 140 : -140)} cy={y} r={10 + 6 * rn(i)} fill="none" stroke="#e6f3fb" strokeWidth={4} />; })}
      <g transform={`translate(1320 ${220 + 450 * b})`}><rect x={-10} y={-260} width={20} height={260} fill="#a0733c" /><path d="M -130 0 Q 0 -90 130 0 Z" fill="#222" /><rect x={-50} y={0} width={100} height={90 * b} rx={20} fill="#222" /></g>
    </svg>
    <Tag tt={tt} at={2.2} x={600} y={1000} txt="PUSHES AIR" col={RED} size={32} />
    <Tag tt={tt} at={3.8} x={1320} y={1000} txt="FLANGE · SEALS" col={ICE} size={32} />
  </>;
}}</Stage>;

// ---- 11:18 · LA SALPICADURA: el sopapo baja en un tazón con químico; las gotas saltan en cámara lenta hacia un brazo ----
export const HChemSplash: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const hit = eio(tt, 1.0, 1.6), fly = eio(tt, 1.6, 4.6);
  return <>
    <Head tt={tt} kick="MISTAKE NUMBER TWO" title="NO CHEMICALS · EVER" col={RED} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d="M 520 640 L 1400 640 Q 1340 980 960 980 Q 580 980 520 640 Z" fill={PORC} />
      <ellipse cx={960} cy={660} rx={420} ry={40} fill="#c9d23a" opacity={0.7} />
      <g transform={`translate(960 ${320 + 300 * hit})`}><rect x={-12} y={-300} width={24} height={300} fill="#a0733c" /><path d="M -130 0 Q 0 -90 130 0 Z" fill="#222" /></g>
      {Array.from({ length: 22 }, (_, i) => { const a = -Math.PI * (0.15 + 0.7 * rn(i)), v = 300 + 400 * rn(i, 2), x = 960 + Math.cos(a) * v * fly, y = 640 + Math.sin(a) * v * fly + 500 * fly * fly;
        return <circle key={i} cx={x} cy={y} r={8 + 10 * rn(i, 3)} fill="#d7e04a" opacity={fly > 0 ? cl(1.2 - fly) : 0} />; })}
      <g opacity={cl(phys(tt, 0.4, 6, 0.6))}><path d="M 1500 300 Q 1600 280 1760 320 L 1760 420 Q 1600 400 1500 420 Z" fill="#d8a888" /><circle cx={1580} cy={360} r={18 * eio(tt, 3.6, 4.4)} fill="#a8443a" opacity={0.8} /></g>
    </svg>
    <Tag tt={tt} at={4.0} x={1630} y={500} txt="I STILL HAVE THE MARK" col={RED} size={30} />
  </>;
}}</Stage>;

// ---- 12:58 · LOS DOS FRASCOS: dos frascos se agitan; el papel se deshace en copos, la toallita queda entera ----
export const HJarTest: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const sh = eio(tt, 0.8, 3.4), shake = Math.sin(tt * 22) * 10 * sh * (1 - eio(tt, 3.4, 3.8));
  const Jar = (x: number, kids: React.ReactNode) => <g transform={`translate(${x + shake} 620) rotate(${shake * 0.5})`}>
    <rect x={-170} y={-260} width={340} height={480} rx={40} fill="rgba(200,230,245,.12)" stroke="rgba(230,245,252,.7)" strokeWidth={7} />
    <rect x={-180} y={-300} width={360} height={56} rx={12} fill="#8d949a" /><rect x={-158} y={-200} width={316} height={404} rx={30} fill={WATER} opacity={0.3} />{kids}</g>;
  return <>
    <Head tt={tt} kick="TRY IT YOURSELF" title="SHAKE THEM BOTH" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {Jar(620, Array.from({ length: 24 }, (_, i) => <rect key={i} x={-80 + rn(i) * 160 - 60 * (1 - sh)} y={-60 + rn(i, 2) * 200 * sh} width={70 - 50 * sh} height={50 - 36 * sh} fill={PAPER} transform={`rotate(${rn(i, 3) * 90 * sh})`} opacity={i < 4 || sh > 0.1 ? 0.9 : 0} />))}
      {Jar(1300, <g transform={`rotate(${20 * Math.sin(tt * 2) * sh})`}><rect x={-100} y={-70} width={200} height={140} rx={6} fill={WIPE} stroke="#c7d3dc" strokeWidth={4} />{[0, 1, 2, 3].map((k) => <line key={k} x1={-90} y1={-50 + k * 34} x2={90} y2={-50 + k * 34} stroke="#d6e0e6" strokeWidth={3} />)}</g>)}
    </svg>
    <Tag tt={tt} at={3.8} x={620} y={960} txt="PAPER: MUSH" col={ICE} size={34} />
    <Tag tt={tt} at={4.2} x={1300} y={960} txt="WIPE: BRAND NEW" col={RED} size={34} />
  </>;
}}</Stage>;

// ---- 13:10 · CUARENTA CASAS: una cuadra de 40 casitas; bajo la calle la soga de toallitas crece y las casas se apagan una a una ----
export const HFortyHouses: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const rope = eio(tt, 1.0, 4.4), n = Math.floor(rope * 40);
  return <>
    <Head tt={tt} kick="HUMBOLDT PARK · 2009" title="A WHOLE BLOCK" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: 40 }, (_, i) => { const r = Math.floor(i / 20), c = i % 20, x = 180 + c * 80, y = 330 + r * 150, s = phys(tt, 0.2 + i * 0.015, 6, 0.6), dark = i < n;
        return <g key={i} transform={`translate(${x} ${y + (1 - s) * 60})`} opacity={cl(s * 2)}><path d="M 0 40 L 30 10 L 60 40 L 60 100 L 0 100 Z" fill={dark ? "#3a3f46" : "#d9cdb4"} /><rect x={22} y={56} width={16} height={16} fill={dark ? "#1b1d20" : "#ffd88a"} /></g>; })}
      <rect x={140} y={720} width={1640} height={120} fill="#3c3a36" />
      <rect x={140} y={880} width={1640} height={90} rx={45} fill="#2a2724" /><rect x={160} y={895} width={1600 * rope} height={60} rx={30} fill={WIPE} opacity={0.9} />
      {Array.from({ length: 30 }, (_, i) => <path key={i} d={`M ${200 + i * 52} 900 q 20 ${30} 0 ${50}`} stroke="#c3ccd3" strokeWidth={4} fill="none" opacity={(200 + i * 52) < 160 + 1600 * rope ? 1 : 0} />)}
    </svg>
    <Tag tt={tt} at={3.8} x={960} y={1020} txt="AS THICK AS YOUR LEG" col={RED} size={32} />
  </>;
}}</Stage>;

// ---- 14:34 · LOS 90: un dial de galones por descarga baja de 3,5 a 1,6; el inodoro de los 90 se queda corto y el nuevo empuja ----
export const HLowFlow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const d = eio(tt, 0.8, 3.0), g = (3.5 - 1.9 * d).toFixed(1);
  return <>
    <Head tt={tt} kick="IN THE 90s THE RULES CHANGED" title="LESS WATER PER FLUSH" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <g transform="translate(560 640)"><path d="M -240 0 A 240 240 0 0 1 240 0" stroke="rgba(255,255,255,.2)" strokeWidth={30} fill="none" />
        <path d="M -240 0 A 240 240 0 0 1 240 0" stroke={ICE} strokeWidth={30} fill="none" pathLength={1} strokeDasharray={`${1 - 0.55 * d} 1`} />
        <g transform={`rotate(${90 - 100 * d})`}><rect x={-6} y={-210} width={12} height={210} fill={TX} /></g><circle r={20} fill={TX} />
        <text y={100} textAnchor="middle" fontFamily={MARK} fontSize={90} fill={TX}>{g}</text><text y={150} textAnchor="middle" fontFamily={MARK} fontSize={30} fill={DIM}>GALLONS</text></g>
      {[["1995", 1360, 0.35, RED], ["TODAY", 1660, 1, ICE]].map(([y, x, p, c], i) => { const s = phys(tt, 2.6 + i * 0.8, 6, 0.5);
        return <g key={String(y)} transform={`translate(${x} 700) scale(${s})`} opacity={cl(s * 2)}><path d="M -110 -80 L 110 -80 L 100 -40 Q 70 60 10 80 L -10 80 Q -70 50 -110 -40 Z" fill={PORC} /><path d={`M 0 80 L 0 ${80 + 200 * Number(p)}`} stroke={String(c)} strokeWidth={18} /><text y={-110} textAnchor="middle" fontFamily={MARK} fontSize={40} fill={TX}>{y}</text></g>; })}
    </svg>
  </>;
}}</Stage>;

// ---- 15:27 · LA LÍNEA DEL TANQUE: el tanque con su marca; el agua dos pulgadas abajo, el empuje sale a la mitad; el tornillo la sube ----
export const HTankLine: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const fix = eio(tt, 3.4, 5.2), lv = 0.55 + 0.25 * fix;
  return <>
    <Head tt={tt} kick="TAKE THE LID OFF" title="HALF THE PUSH" col={RED} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <rect x={560} y={260} width={620} height={640} rx={24} fill="rgba(240,240,236,.1)" stroke={PORC} strokeWidth={10} />
      <rect x={570} y={890 - 620 * lv} width={600} height={620 * lv} fill={WATER} opacity={0.55} />
      <line x1={570} y1={890 - 620 * 0.8} x2={1170} y2={890 - 620 * 0.8} stroke={AMB} strokeWidth={6} strokeDasharray="18 12" />
      <rect x={840} y={330} width={44} height={560} fill="#cfd3d6" />
      <rect x={1080} y={890 - 620 * lv - 30} width={90} height={60} rx={20} fill="#e2e2dc" />
      <g transform={`translate(1240 ${420}) rotate(${-720 * fix})`}><circle r={30} fill="#9aa1a7" /><rect x={-24} y={-5} width={48} height={10} fill="#3a3e42" /></g>
      <path d={`M 1380 900 L 1380 ${900 - 340 * (0.5 + 0.5 * fix)}`} stroke={fix > 0.5 ? ICE : RED} strokeWidth={40} strokeLinecap="round" />
    </svg>
    <Tag tt={tt} at={1.4} x={870} y={200} txt="THE LINE" col={AMB} size={32} />
    <Tag tt={tt} at={2.4} x={1560} y={760} txt="FLUSH POWER" col={TX} size={30} />
  </>;
}}</Stage>;

// ---- 16:44 · LOS AGUJEROS DEL BORDE: la corona de agujeritos bajo el borde, vista desde abajo; se tapan de sarro y los chorros se apagan ----
export const HRimHoles: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const crust = eio(tt, 1.6, 4.2), spin = tt * 8;
  return <>
    <Head tt={tt} kick="UNDER THE RIM" title="A ROW OF LITTLE HOLES" col={ICE} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <g transform="translate(960 620)">
        <ellipse rx={560} ry={300} fill={PORC} /><ellipse rx={470} ry={240} fill="#1a1c1e" />
        {Array.from({ length: 36 }, (_, i) => { const a = (i / 36) * Math.PI * 2 + spin * 0.002, x = Math.cos(a) * 515, y = Math.sin(a) * 270, s = phys(tt, 0.3 + i * 0.03, 6, 0.6), shut = rn(i) < crust * 0.85;
          return <g key={i} opacity={cl(s * 2)}><circle cx={x} cy={y} r={14} fill={shut ? "#e8dcc0" : "#2a2c2e"} />
            {!shut && <line x1={x} y1={y} x2={x * 0.86} y2={y * 0.86 + 30} stroke="#bfe4f5" strokeWidth={5} opacity={0.8} />}</g>; })}
      </g>
    </svg>
    <Tag tt={tt} at={4.2} x={960} y={980} txt="WHITE AND CRUSTY" col={AMB} size={34} />
  </>;
}}</Stage>;

// ---- 17:51 · ONCE BUDINES: una latita de budín por Navidad; caen once y se apilan en una torre que tambalea ----
export const HFruitcake11: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const n = Math.min(11, Math.floor(eio(tt, 0.4, 4.4) * 11.99));
  return <>
    <Head tt={tt} kick="EVERY CHRISTMAS · 11 YEARS" title="I ATE EVERY ONE" col={AMB} />
    {Array.from({ length: n }, (_, i) => { const s = phys(tt, 0.4 + i * 0.36, 7, 0.45), wob = 6 * Math.sin(tt * 2 + i) * (i / 11);
      return <div key={i} style={{ position: "absolute", left: 960 + wob + (i % 2 ? 10 : -10), top: 940 - i * 58 - (1 - s) * 400, width: 260, height: 54, transform: "translateX(-50%)", opacity: cl(s * 2), borderRadius: 10,
        background: "linear-gradient(180deg,#b5323a,#7e1c24)", boxShadow: "0 6px 12px rgba(0,0,0,.5)", border: "4px solid #d8b26a" }} />; })}
    <div style={{ position: "absolute", left: 1340, top: 460, fontFamily: MARK, fontSize: 140, color: TX }}>{n}</div>
    <Tag tt={tt} at={4.4} x={600} y={500} txt="I DON'T LIKE FRUITCAKE" col={ICE} size={32} />
  </>;
}}</Stage>;

// ---- 18:49 · LA LLAVE DE CERCA: la llave cromada gira hacia cámara en primer plano; la manija ovalada, el caño y la flecha a la derecha ----
export const HOvalKnob: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const s = phys(tt, 0.4, 5, 0.45), turn = eio(tt, 2.8, 4.4), spin = 30 * Math.sin(tt * 0.6) * (1 - turn);
  return <>
    <Head tt={tt} kick="THE SHUT-OFF VALVE" title="TWO SECONDS" col={ICE} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(960 600) scale(${s}) rotate(${spin})`} opacity={cl(s * 2)}>
        <rect x={-600} y={-40} width={420} height={80} fill={CHROME} /><rect x={-200} y={-90} width={240} height={180} rx={30} fill="#c3c8cc" />
        <rect x={-10} y={-300} width={40} height={220} fill="#bfc4c8" />
        <g transform={`translate(-80 -60) rotate(${90 * turn})`}><ellipse rx={170} ry={90} fill={CHROME} stroke="#8a9096" strokeWidth={10} /><circle r={30} fill="#8a9096" /></g></g>
      <path d="M 1340 460 A 160 160 0 0 1 1340 760" stroke={AMB} strokeWidth={14} fill="none" opacity={cl(phys(tt, 2.0, 6, 0.6))} /><path d="M 1310 740 l 30 24 l 18 -34" stroke={AMB} strokeWidth={14} fill="none" opacity={cl(phys(tt, 2.0, 6, 0.6))} />
    </svg>
    <Tag tt={tt} at={2.4} x={1560} y={610} txt="CLOCKWISE" col={AMB} size={36} />
  </>;
}}</Stage>;

// ---- 19:26 · VEINTE AÑOS QUIETA: el sarro crece sobre la llave año a año; la mano tira y no se mueve ----
export const HStuckValve: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const yr = Math.round(20 * eio(tt, 0.6, 3.6)), crust = yr / 20, tug = Math.sin(tt * 18) * 4 * eio(tt, 3.8, 4.2) * (1 - eio(tt, 5.6, 6.0));
  return <>
    <Head tt={tt} kick="NOT TURNED IN YEARS" title="FROZEN WITH MINERALS" col={RED} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(860 600) rotate(${tug})`}><rect x={-500} y={-40} width={420} height={80} fill={CHROME} /><rect x={-100} y={-90} width={240} height={180} rx={30} fill="#c3c8cc" />
        <ellipse cx={20} cy={-60} rx={170} ry={90} fill={CHROME} stroke="#8a9096" strokeWidth={10} />
        {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={-180 + rn(i) * 360} cy={-140 + rn(i, 2) * 220} r={(8 + 18 * rn(i, 3)) * crust} fill="#e7e0cd" opacity={0.92} />)}</g>
      <g opacity={eio(tt, 3.6, 4.0)} transform={`translate(${880 + tug * 3} 420)`}><path d="M 0 0 Q 60 -50 140 -20 L 200 40 L 170 70 L 100 30 Q 50 40 0 40 Z" fill="#d8a888" /></g>
    </svg>
    <div style={{ position: "absolute", left: 1380, top: 470, fontFamily: MARK, fontSize: 120, color: TX }}>{yr} YRS</div>
    <Tag tt={tt} at={4.6} x={1500} y={720} txt="IT WON'T BUDGE" col={RED} size={32} />
  </>;
}}</Stage>;

// ---- 20:19 · MARTES O 6 A.M.: dos hojas de agenda; el martes a la tarde con sol y calma, las 6 de la mañana con agua subiendo ----
export const HTuesday: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const Card = (x: number, at: number, day: string, hr: string, warm: boolean) => { const s = phys(tt, at, 6, 0.45);
    return <div style={{ position: "absolute", left: x, top: 560, width: 440, height: 520, transform: `translate(-50%,-50%) rotate(${warm ? -4 : 4}deg) translateY(${(1 - s) * 300}px)`, opacity: cl(s * 2), borderRadius: 16, overflow: "hidden", background: "#f5f1e8", boxShadow: "0 30px 60px rgba(0,0,0,.5)" }}>
      <div style={{ height: 110, background: warm ? "#e8a23a" : "#26324a", fontFamily: MARK, fontSize: 54, color: "#fff", textAlign: "center", lineHeight: "110px" }}>{day}</div>
      <div style={{ fontFamily: MARK, fontSize: 110, color: "#222", textAlign: "center", marginTop: 60 }}>{hr}</div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: warm ? 0 : 160 * eio(tt, at + 1.0, at + 3.0), background: WATER, opacity: 0.7 }} /></div>; };
  return <>
    <Head tt={tt} kick="FIND OUT NOW" title="NOT IN AN EMERGENCY" col={AMB} />
    {Card(640, 0.4, "TUESDAY", "2 PM", true)}{Card(1280, 1.0, "COMPANY", "6 AM", false)}
  </>;
}}</Stage>;

// ---- 21:12 · SÓLO DOS COSAS: la puerta del inodoro con un cartelito de dos renglones; todo lo demás rebota y cae al tacho ----
export const HOnlyTwo: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const items = ["#e9eef2", "#f7f7f7", "#fbe3ea", "#d9cdb4", "#cfe3f2"];
  return <>
    <Head tt={tt} kick="THE WHOLE LIST" title="WASTE AND PAPER" col={ICE} />
    <div style={{ position: "absolute", left: 680, top: 300, width: 560, height: 160, background: "#f5f1e8", borderRadius: 14, boxShadow: "0 20px 40px rgba(0,0,0,.5)", padding: "20px 34px", transform: `scale(${phys(tt, 0.4, 5, 0.45)})` }}>
      <div style={{ fontFamily: HAND, fontSize: 48, color: "#222" }}>1. what comes out of you</div><div style={{ fontFamily: HAND, fontSize: 48, color: "#222" }}>2. toilet paper</div></div>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d="M 700 620 L 1220 620 L 1200 660 Q 1160 820 1000 840 L 920 840 Q 760 820 720 660 Z" fill={PORC} />
      <rect x={1460} y={720} width={180} height={220} rx={12} fill="#e8e6e0" /><rect x={1440} y={700} width={220} height={30} rx={10} fill="#cfcdc6" />
      {items.map((c, i) => { const s = eio(tt, 1.4 + i * 0.5, 2.6 + i * 0.5), x = 400 + (1550 - 400) * s, y = 520 - 260 * Math.sin(s * Math.PI) + 200 * s;
        return <rect key={i} x={x - 40} y={y - 30} width={80} height={60} rx={8} fill={c} transform={`rotate(${360 * s} ${x} ${y})`} opacity={s > 0 && s < 1 ? 1 : 0} />; })}
    </svg>
    <Tag tt={tt} at={3.8} x={1550} y={990} txt="EVERYTHING ELSE" col={AMB} size={32} />
  </>;
}}</Stage>;

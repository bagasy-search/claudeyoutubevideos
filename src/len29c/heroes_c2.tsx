// len29c · componentes únicos 16-30 (9:50 → 20:30). Mismo Stage: foto del momento desenfocada, entrada con transición,
// elementos de a uno con resorte, cámara curva, salida fundida.
import React from "react";
import { AMB, DIM, H, HAND, Head, ICE, MARK, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

const HAIR = "#3b2f27", SCUM = "#b9b2a0", CHROME = "#d7dce0", BRASS = "#c9a24a";
const rn = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const hairPath = (x: number, y: number, len: number, i: number, t = 0) => `M ${x} ${y} C ${x + 20 * Math.sin(i + t)} ${y + len * 0.33} ${x - 24 * Math.cos(i * 2 + t)} ${y + len * 0.66} ${x + 10 * Math.sin(i * 3)} ${y + len}`;

// ---- EL PELO NO SE DISUELVE: un vaso con químico burbujea; la mata adentro sigue entera mientras el esmalte del costado se mancha ----
export const HNoDissolve: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const pour = eio(tt, 0.5, 2.2), stain = eio(tt, 3.0, 5.0);
  return <>
    <Head tt={tt} kick="THE BOTTLE SAYS IT WILL" title="HAIR DOESN'T DISSOLVE" col={RED} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d="M 700 360 L 700 900 Q 700 940 740 940 L 1180 940 Q 1220 940 1220 900 L 1220 360" fill="rgba(200,230,240,.12)" stroke="rgba(220,240,250,.6)" strokeWidth={6} />
      <rect x={706} y={940 - 520 * pour} width={508} height={520 * pour} fill="#6e8f3a" opacity={0.55} />
      {Array.from({ length: 18 }, (_, i) => { const y = 900 - ((tt * 120 + rn(i) * 500) % (520 * pour + 1)); return <circle key={i} cx={740 + rn(i, 2) * 440} cy={y} r={4 + 6 * rn(i, 3)} fill="none" stroke="#c9e08a" strokeWidth={2} opacity={pour} />; })}
      <g transform="translate(960 760)">{Array.from({ length: 30 }, (_, i) => <path key={i} d={hairPath(-60 + i * 4, -60, 140, i, tt * 0.3)} stroke={HAIR} strokeWidth={4} fill="none" />)}</g>
      <rect x={1300} y={360} width={260} height={580} rx={30} fill="#f3f1ec" /><ellipse cx={1430} cy={700} rx={90 * stain} ry={130 * stain} fill="#a3893f" opacity={0.5} />
    </svg>
    <Tag tt={tt} at={2.6} x={960} y={300} txt="STILL THERE" col={TX} size={38} />
    <Tag tt={tt} at={4.4} x={1430} y={300} txt="EATS THE ENAMEL" col={RED} size={32} />
  </>;
}}</Stage>;

// ---- TRES TAPONES: tres tapones de bañera suben del agua uno tras otro: perilla, pie, palanca ----
export const HStoppers3: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const S: [string, React.ReactNode][] = [
    ["LIFT AND TURN", <g><ellipse rx={130} ry={40} fill={CHROME} /><rect x={-14} y={-90} width={28} height={60} rx={8} fill="#aeb4b9" /><circle cy={-96} r={24} fill={CHROME} /></g>],
    ["TOE TOUCH", <g><ellipse rx={130} ry={40} fill={CHROME} /><ellipse cy={-50} rx={110} ry={46} fill="#c5cbd0" /><ellipse cy={-60} rx={60} ry={20} fill="#e8ecef" /></g>],
    ["TRIP LEVER", <g><circle r={120} fill={CHROME} /><circle r={18} cx={-60} cy={-40} fill="#8a9096" /><circle r={18} cx={60} cy={60} fill="#8a9096" /><rect x={-14} y={-20} width={28} height={110} rx={10} fill="#9aa1a7" transform="rotate(-20)" /></g>],
  ];
  return <>
    <Head tt={tt} kick="IN THE TUB" title="THREE KINDS OF STOPPERS" col={ICE} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 700, height: 380, background: "linear-gradient(180deg,rgba(120,170,200,.35),rgba(40,70,90,.6))" }} />
    {S.map(([n, g], i) => { const s = phys(tt, 0.5 + i * 0.8, 5, 0.4);
      return <div key={n} style={{ position: "absolute", left: 480 + i * 480, top: 620 + (1 - s) * 260, transform: `translate(-50%,-50%) rotate(${6 * Math.sin(tt + i)}deg)`, opacity: cl(s * 2) }}>
        <svg width={320} height={320} viewBox="-160 -160 320 320" style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,.6))" }}>{g}</svg></div>; })}
    {S.map(([n], i) => <Tag key={n} tt={tt} at={1.0 + i * 0.8} x={480 + i * 480} y={380} txt={n} col={i === 2 ? AMB : TX} size={30} />)}
  </>;
}}</Stage>;

// ---- DETRÁS DE LA PLACA: la placa se abre como una puerta; adentro baja la varilla con tapón y resorte forrados de pelo ----
export const HBehindPlate: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const open = eio(tt, 0.6, 2.0), rod = eio(tt, 2.0, 4.2), fur = eio(tt, 3.6, 5.4);
  return <>
    <Head tt={tt} kick="UNSCREW TWO SCREWS" title="WHAT'S BEHIND THE PLATE" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <rect x={520} y={300} width={880} height={700} rx={40} fill="#ecebe6" /><rect x={880} y={300} width={160} height={700} fill="#141516" />
      <g transform={`translate(960 340) translate(${-220 * open} 0) rotate(${-50 * open})`}><circle r={110} fill={CHROME} /><circle cx={-50} cy={-30} r={14} fill="#8a9096" /><circle cx={50} cy={40} r={14} fill="#8a9096" /></g>
      <g transform={`translate(960 ${340 + 120 * rod})`} opacity={cl(rod * 3)}>
        <rect x={-6} y={0} width={12} height={360} fill="#9aa1a7" />
        <path d={Array.from({ length: 12 }, (_, i) => `M -26 ${380 + i * 14} L 26 ${387 + i * 14}`).join(" ")} stroke="#b7bcc1" strokeWidth={6} />
        <rect x={-34} y={560} width={68} height={70} rx={14} fill="#7d848a" />
        {Array.from({ length: 30 }, (_, i) => <path key={i} d={hairPath(-30 + (i % 10) * 6, 360 + Math.floor(i / 10) * 90, 110, i, tt)} stroke={i % 3 ? HAIR : SCUM} strokeWidth={4} fill="none" opacity={fur} />)}
      </g>
    </svg>
    <Tag tt={tt} at={4.2} x={1400} y={760} txt="HAIR ON THE SPRING" col={RED} size={34} />
  </>;
}}</Stage>;

// ---- LA RUTA DEL REBALSE: el agua entra también por el agujero de arriba y baja por un segundo caño hasta el mismo sifón ----
export const HOverflowRoute: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const a = eio(tt, 0.6, 3.0), b = eio(tt, 1.6, 4.0);
  const P1 = "M 700 420 L 700 820 Q 700 900 780 900 L 1060 900", P2 = "M 1060 300 L 1060 900 Q 1060 980 1140 980 L 1500 980";
  return <>
    <Head tt={tt} kick="THE HOLE UP TOP" title="TWO WAYS DOWN" col={ICE} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d="M 420 420 L 1180 420 L 1180 640 Q 1180 700 1120 700 L 480 700 Q 420 700 420 640 Z" fill="#f2f1ec" opacity={0.92} />
      {[P1, P2].map((p, i) => <g key={i}><path d={p} stroke="#cfd3d6" strokeWidth={60} fill="none" /><path d={p} stroke="#141516" strokeWidth={44} fill="none" /></g>)}
      <path d={P1} stroke="#6fb3d6" strokeWidth={30} fill="none" pathLength={1} strokeDasharray={`${a} 1`} />
      <path d={P2} stroke="#6fb3d6" strokeWidth={30} fill="none" pathLength={1} strokeDasharray={`${b} 1`} />
      <circle cx={1060} cy={460} r={30} fill="#141516" stroke={CHROME} strokeWidth={8} />
    </svg>
    <Tag tt={tt} at={1.2} x={560} y={360} txt="THE DRAIN" col={TX} size={30} />
    <Tag tt={tt} at={2.2} x={1300} y={460} txt="THE OVERFLOW" col={AMB} size={30} />
  </>;
}}</Stage>;

// ---- LA PUERTA SECRETA: un pasillo de placard; el panel cuadrado en la pared se abre y la linterna barre el caño de atrás ----
export const HSecretDoor: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const open = eio(tt, 0.8, 2.4), sweep = eio(tt, 2.6, 5.0);
  return <>
    <Head tt={tt} kick="CLOSET OR HALLWAY" title="A LITTLE SQUARE DOOR" col={AMB} />
    <div style={{ position: "absolute", left: 660, top: 320, width: 600, height: 600, background: "#0c0d0e", boxShadow: "inset 0 0 80px #000" }}>
      <svg width={600} height={600}><path d="M 300 0 L 300 380 Q 300 460 380 460 L 600 460" stroke="#cfd3d6" strokeWidth={70} fill="none" /><circle cx={300} cy={460} r={60} fill={BRASS} opacity={0.8} /></svg>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at ${120 + 360 * sweep}px ${200 + 200 * sweep}px, transparent 90px, rgba(0,0,0,.92) 220px)` }} />
    </div>
    <div style={{ position: "absolute", left: 660, top: 320, width: 600, height: 600, background: "#e3ddd2", border: "10px solid #cfc6b6", transformOrigin: "left center", transform: `perspective(1400px) rotateY(${-100 * open}deg)` }} />
    <Tag tt={tt} at={3.0} x={1500} y={600} txt="AN ACCESS PANEL" col={ICE} size={36} />
  </>;
}}</Stage>;

// ---- LA LATA DEL FONDO: un trampa de tambor en corte; arena, pelo y un soldadito bajan y se asientan en el fondo ----
export const HDrumCan: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const fall = (i: number) => eio(tt, 0.6 + i * 0.12, 2.6 + i * 0.12);
  return <>
    <Head tt={tt} kick="OLD BUILDINGS" title="A DRUM TRAP" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <rect x={760} y={360} width={400} height={560} rx={30} fill={BRASS} opacity={0.35} stroke={BRASS} strokeWidth={14} />
      <ellipse cx={960} cy={360} rx={200} ry={30} fill={BRASS} />
      {Array.from({ length: 26 }, (_, i) => { const f = fall(i); return <circle key={i} cx={800 + rn(i) * 320} cy={420 + f * (440 + rn(i, 2) * 40)} r={6 + 6 * rn(i, 3)} fill={i % 3 ? "#7a6a52" : SCUM} />; })}
      <g transform={`translate(${900} ${420 + 420 * fall(9)})`}>{Array.from({ length: 14 }, (_, i) => <path key={i} d={hairPath(i * 6, 0, 60, i)} stroke={HAIR} strokeWidth={4} fill="none" />)}</g>
      <g transform={`translate(1060 ${400 + 450 * fall(14)}) rotate(${80 * fall(14)})`} opacity={cl(phys(tt, 1.6, 6, 0.5))}><rect x={-10} y={-40} width={20} height={50} fill="#5f7a3a" /><circle cy={-52} r={12} fill="#5f7a3a" /><rect x={-10} y={10} width={8} height={30} fill="#5f7a3a" /><rect x={2} y={10} width={8} height={30} fill="#5f7a3a" /></g>
    </svg>
    <Tag tt={tt} at={3.0} x={1440} y={860} txt="HEAVY SINKS TO THE BOTTOM" col={TX} size={30} />
  </>;
}}</Stage>;

// ---- BAJO LA ALFOMBRA: la alfombrita del baño se levanta como una tapa y abajo aparece la tapa de bronce olvidada ----
export const HUnderTheMat: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const lift = eio(tt, 1.0, 2.8), dust = eio(tt, 2.8, 4.4);
  return <>
    <Head tt={tt} kick="AVONDALE · 40 YEARS" title="NOBODY LIFTED THE MAT" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <rect x={360} y={560} width={1200} height={420} fill="#e7e3da" />{Array.from({ length: 10 }, (_, i) => <line key={i} x1={360 + i * 120} y1={560} x2={360 + i * 120} y2={980} stroke="#cfc9bc" strokeWidth={3} />)}
      <circle cx={960} cy={780} r={90} fill={BRASS} /><circle cx={960} cy={780} r={66} fill="none" stroke="#8f6f2b" strokeWidth={6} /><rect x={940} y={770} width={40} height={20} fill="#8f6f2b" />
      {Array.from({ length: 16 }, (_, i) => <circle key={i} cx={900 + rn(i) * 120} cy={760 - dust * 120 * rn(i, 2)} r={3} fill="#d9d1bf" opacity={1 - dust} />)}
      <g transform={`translate(560 600) rotate(${-70 * lift} 0 0)`} style={{ transformOrigin: "560px 600px" }}><rect x={0} y={0} width={800} height={340} rx={30} fill="#5a7a8c" /><rect x={30} y={30} width={740} height={280} rx={20} fill="none" stroke="#7d9cab" strokeWidth={8} strokeDasharray="4 12" /></g>
    </svg>
    <Tag tt={tt} at={3.0} x={1360} y={460} txt="THE LID WAS UNDER IT" col={ICE} size={32} />
  </>;
}}</Stage>;

// ---- AGUA DURA: las piedritas de mineral y las burbujas de jabón se juntan en el aire y forman una costra gris ----
export const HHardWater: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const m = eio(tt, 1.2, 3.6);
  return <>
    <Head tt={tt} kick="MINERALS + SOAP" title="A SCUM LIKE GLUE" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: 24 }, (_, i) => { const x0 = 360 + rn(i) * 300, y0 = 340 + rn(i, 2) * 500; return <rect key={i} x={x0 + (960 - x0) * m * 0.9} y={y0 + (620 - y0) * m * 0.9} width={14} height={14} transform={`rotate(${45 + i * 13} ${x0 + (960 - x0) * m * 0.9} ${y0 + (620 - y0) * m * 0.9})`} fill="#d9d6cc" opacity={cl(phys(tt, 0.3 + i * 0.03, 6, 0.6))} />; })}
      {Array.from({ length: 24 }, (_, i) => { const x0 = 1260 + rn(i, 4) * 300, y0 = 340 + rn(i, 5) * 500; return <circle key={i} cx={x0 + (960 - x0) * m * 0.9} cy={y0 + (620 - y0) * m * 0.9} r={10 + 8 * rn(i, 6)} fill="none" stroke="#e8f1f6" strokeWidth={3} opacity={cl(phys(tt, 0.5 + i * 0.03, 6, 0.6))} />; })}
      <ellipse cx={960} cy={620} rx={180 * m} ry={120 * m} fill={SCUM} opacity={0.85 * m} />
    </svg>
    <Tag tt={tt} at={0.8} x={500} y={280} txt="MINERALS" col={TX} size={30} />
    <Tag tt={tt} at={1.0} x={1420} y={280} txt="SOAP" col={TX} size={30} />
  </>;
}}</Stage>;

// ---- UN AÑO DE PELO: un calendario pasa los meses y el pelo se apila en la balanza junto al desagüe ----
export const HHairYear: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const p = eio(tt, 0.6, 5.0), mo = Math.min(12, 1 + Math.floor(p * 12)), n = Math.floor(p * 70);
  const M = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  return <>
    <Head tt={tt} kick="50 TO 100 A DAY" title="ONE YEAR IN THE DRAIN" col={AMB} />
    <div style={{ position: "absolute", left: 360, top: 340, width: 360, height: 420, background: "#f4f1ea", borderRadius: 14, boxShadow: "0 30px 50px rgba(0,0,0,.5)", textAlign: "center" }}>
      <div style={{ background: RED, height: 90, borderRadius: "14px 14px 0 0" }} /><div style={{ fontFamily: MARK, fontSize: 130, color: "#222", marginTop: 50 }}>{M[mo - 1]}</div></div>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <g transform="translate(1200 560)">{Array.from({ length: n }, (_, i) => <path key={i} d={hairPath(-120 + rn(i) * 240, 220 - (i / 70) * 260 * rn(i, 2), 90, i)} stroke={HAIR} strokeWidth={3} fill="none" />)}</g>
      <rect x={1020} y={800} width={360} height={30} rx={10} fill="#5b6166" />
    </svg>
    <Tag tt={tt} at={4.0} x={1200} y={300} txt="THOUSANDS OF HAIRS" col={TX} size={34} />
  </>;
}}</Stage>;

// ---- EL CALOR Y EL ACRÍLICO: la pava vierte agua hirviendo y el piso acrílico se deforma con ondas de calor ----
export const HAcrylicHeat: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const pour = eio(tt, 0.8, 2.4), warp = eio(tt, 2.2, 4.4);
  return <>
    <Head tt={tt} kick="ACRYLIC OR FIBERGLASS" title="NO BOILING WATER" col={RED} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d={`M 400 800 Q 960 ${800 + 90 * warp * Math.sin(tt * 3)} 1520 800 L 1520 900 L 400 900 Z`} fill="#f5f4f0" />
      <g transform={`translate(760 ${360 - 60 * (1 - pour)}) rotate(${40 * pour})`}><path d="M -90 -60 L 90 -60 L 110 80 L -110 80 Z" fill="#4a4f55" /><path d="M 90 -40 L 180 -90" stroke="#4a4f55" strokeWidth={24} /></g>
      <path d={`M 900 330 Q 920 ${560} 960 ${560 + 220 * pour}`} stroke="#9fd0ea" strokeWidth={14} fill="none" opacity={pour > 0.05 ? 0.8 : 0} />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${860 + i * 60} 760 q 14 -40 0 -80 q -14 -40 0 -80`} stroke="#f0b28a" strokeWidth={5} fill="none" opacity={warp * (0.5 + 0.5 * Math.sin(tt * 5 + i))} />)}
    </svg>
    <Tag tt={tt} at={3.6} x={1400} y={560} txt="IT CAN WARP" col={RED} size={40} />
  </>;
}}</Stage>;

// ---- MOSTRAR LA BOLSA: la bolsa transparente gira hacia cámara con la mata adentro; tres caras de familia la miran ----
export const HShowBag: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const bag = phys(tt, 0.5, 5, 0.45), spin = 30 * Math.sin(tt * 0.8);
  return <>
    <Head tt={tt} kick="STAN'S HABIT" title="SHOW THEM THE BAG" col={AMB} />
    <div style={{ position: "absolute", left: 960, top: 560, transform: `translate(-50%,-50%) rotateY(${spin}deg) scale(${bag})`, opacity: cl(bag * 2) }}>
      <svg width={420} height={520} viewBox="-210 -260 420 520"><path d="M -160 -200 L 160 -200 L 180 240 L -180 240 Z" fill="rgba(230,240,245,.18)" stroke="rgba(240,248,252,.7)" strokeWidth={5} />
        <path d="M -160 -200 q 40 -40 80 0 q 40 -40 80 0 q 40 -40 80 0 q 40 -40 80 0" stroke="rgba(240,248,252,.7)" strokeWidth={5} fill="none" />
        {Array.from({ length: 36 }, (_, i) => <path key={i} d={hairPath(-80 + (i % 12) * 14, -20 + Math.floor(i / 12) * 60, 140, i, tt * 0.2)} stroke={i % 4 ? HAIR : SCUM} strokeWidth={5} fill="none" />)}</svg></div>
    {[0, 1, 2].map((i) => { const s = phys(tt, 2.2 + i * 0.4, 6, 0.5); return <div key={i} style={{ position: "absolute", left: [380, 1540, 1380][i], top: [620, 600, 860][i], width: 120, height: 120, borderRadius: "50%", background: "#d8b49a", opacity: cl(s * 2), transform: `scale(${s})`, boxShadow: "0 10px 30px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 30, top: 44, width: 14, height: 14, borderRadius: "50%", background: "#222" }} /><div style={{ position: "absolute", left: 76, top: 44, width: 14, height: 14, borderRadius: "50%", background: "#222" }} /><div style={{ position: "absolute", left: 46, top: 78, width: 28, height: 22, borderRadius: "50%", background: "#3a1f1a" }} /></div>; })}
    <Tag tt={tt} at={3.6} x={960} y={900} txt="THEY WON'T DO IT AGAIN" col={ICE} size={32} />
  </>;
}}</Stage>;

// ---- LA RUTINA: cuatro herramientas caen sobre una toalla en orden, cada una con su número escrito a mano ----
export const HRoutine: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const T: [string, React.ReactNode][] = [
    ["STRIP", <g><rect x={-6} y={-140} width={12} height={280} fill="#f4f2ec" />{Array.from({ length: 8 }, (_, k) => <path key={k} d={`M 6 ${-120 + k * 34} l 18 -18`} stroke="#f4f2ec" strokeWidth={5} />)}</g>],
    ["TWIST", <g>{[0, 1, 2].map((k) => <path key={k} d={`M -90 ${-40 + k * 40} A 90 22 0 0 0 90 ${-40 + k * 40}`} stroke={ICE} strokeWidth={8} fill="none" />)}</g>],
    ["PULL", <g><path d="M 0 120 L 0 -120 M -40 -80 L 0 -120 L 40 -80" stroke={AMB} strokeWidth={12} fill="none" /></g>],
    ["BAG", <g><path d="M -90 -90 L 90 -90 L 104 120 L -104 120 Z" fill="rgba(230,240,245,.2)" stroke="rgba(240,248,252,.8)" strokeWidth={5} /></g>],
  ];
  return <>
    <Head tt={tt} kick="EVERY MONTH" title="THE WHOLE ROUTINE" col={ICE} />
    <div style={{ position: "absolute", left: 260, right: 260, top: 380, height: 520, background: "repeating-linear-gradient(90deg,#e9e4da 0 30px,#ded8cc 30px 60px)", borderRadius: 16, transform: "perspective(1400px) rotateX(18deg)" }} />
    {T.map(([n, g], i) => { const s = phys(tt, 0.5 + i * 0.7, 6, 0.45);
      return <div key={n} style={{ position: "absolute", left: 470 + i * 330, top: 640 - (1 - s) * 500, transform: `translate(-50%,-50%) rotate(${(1 - s) * 40 - 6 + i * 4}deg)`, opacity: cl(s * 2) }}>
        <svg width={260} height={300} viewBox="-130 -150 260 300">{g}</svg>
        <div style={{ textAlign: "center", fontFamily: HAND, fontSize: 52, color: "#2a2a2a" }}>{i + 1}. {n}</div></div>; })}
  </>;
}}</Stage>;

// ---- EL COLADOR: corte de un atrapapelos; las gotas pasan por los agujeros y los pelos quedan arriba ----
export const HCatcherSieve: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const set = phys(tt, 0.4, 5, 0.45), n = Math.floor(eio(tt, 1.6, 5.0) * 24);
  return <>
    <Head tt={tt} kick="THE $2 THING" title="A HAIR CATCHER" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <rect x={880} y={620} width={160} height={460} fill="#cfd3d6" /><rect x={896} y={620} width={128} height={460} fill="#141516" />
      <g transform={`translate(960 ${620 - (1 - set) * 400})`} opacity={cl(set * 2)}><path d="M -200 -10 L 200 -10 L 120 80 L -120 80 Z" fill="#7aa2b8" opacity={0.85} />{Array.from({ length: 9 }, (_, k) => <circle key={k} cx={-80 + k * 20} cy={70} r={6} fill="#141516" />)}</g>
      {Array.from({ length: 16 }, (_, i) => { const y = ((tt * 260 + rn(i) * 700) % 900) + 120; return <ellipse key={i} cx={900 + rn(i, 2) * 120} cy={y} rx={6} ry={12} fill="#9fd0ea" opacity={set} />; })}
      {Array.from({ length: n }, (_, i) => <path key={i} d={hairPath(-100 + rn(i) * 200 + 960, 600, 50, i)} stroke={HAIR} strokeWidth={3} fill="none" />)}
    </svg>
    <Tag tt={tt} at={2.0} x={1400} y={520} txt="WATER GOES THROUGH" col={ICE} size={32} />
    <Tag tt={tt} at={3.2} x={1400} y={600} txt="HAIR STAYS ON TOP" col={TX} size={32} />
  </>;
}}</Stage>;

// ---- CINCO SEGUNDOS: un cronómetro de cocina gira cinco clics mientras un papel levanta la mata de arriba del colador ----
export const HFiveSec: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const s = Math.min(5, Math.floor(eio(tt, 0.8, 4.4) * 5.99)), lift = eio(tt, 2.0, 4.0);
  return <>
    <Head tt={tt} kick="ONCE A MONTH" title="FIVE SECONDS" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <g transform="translate(560 600)"><circle r={200} fill="#f2efe8" stroke="#c9c2b4" strokeWidth={12} />
        {Array.from({ length: 5 }, (_, k) => <path key={k} d={`M 0 0 L ${Math.sin(k / 5 * 6.28) * 180} ${-Math.cos(k / 5 * 6.28) * 180} A 180 180 0 0 1 ${Math.sin((k + 1) / 5 * 6.28) * 180} ${-Math.cos((k + 1) / 5 * 6.28) * 180} Z`} fill={k < s ? AMB : "transparent"} opacity={0.6} />)}
        <line x1={0} y1={0} x2={Math.sin(s / 5 * 6.28) * 160} y2={-Math.cos(s / 5 * 6.28) * 160} stroke={RED} strokeWidth={10} strokeLinecap="round" /></g>
      <path d="M 1120 760 L 1520 760 L 1440 840 L 1200 840 Z" fill="#7aa2b8" />
      <g transform={`translate(1320 ${740 - 260 * lift})`}><rect x={-90} y={-30} width={180} height={50} fill="#fbfbf8" />{Array.from({ length: 14 }, (_, i) => <path key={i} d={hairPath(-60 + i * 9, 20, 40, i)} stroke={HAIR} strokeWidth={3} fill="none" />)}</g>
    </svg>
    <div style={{ position: "absolute", left: 500, top: 840, fontFamily: MARK, fontSize: 110, color: TX }}>{s}</div>
  </>;
}}</Stage>;

// ---- AFUERA, NO ABAJO: dos flechas enormes; la que baja se tacha y la que sube saca la mata del desagüe ----
export const HOutNotDown: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const down = phys(tt, 0.5, 6, 0.5), cross = eio(tt, 1.6, 2.4), up = eio(tt, 2.6, 4.6);
  return <>
    <Head tt={tt} kick="THE WHOLE IDEA" title="OUT · NOT DOWN" col={ICE} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <g opacity={cl(down * 2)} transform={`translate(600 ${300 + (1 - down) * -200})`}><path d="M 0 0 L 0 420 M -80 340 L 0 420 L 80 340" stroke={DIM} strokeWidth={30} fill="none" strokeLinecap="round" /></g>
      <path d={`M ${460} ${400} L ${460 + 280 * cross} ${400 + 280 * cross}`} stroke={RED} strokeWidth={18} strokeLinecap="round" />
      <ellipse cx={1320} cy={900} rx={140} ry={26} fill={CHROME} />
      <g transform={`translate(1320 ${880 - 420 * up})`}>{Array.from({ length: 24 }, (_, i) => <path key={i} d={hairPath(-40 + i * 3, 0, 120 + 60 * up, i, tt)} stroke={HAIR} strokeWidth={4} fill="none" />)}</g>
      <g opacity={up}><path d={`M 1540 ${820} L 1540 ${820 - 420 * up} M 1460 ${900 - 420 * up} L 1540 ${820 - 420 * up} L 1620 ${900 - 420 * up}`} stroke={ICE} strokeWidth={30} fill="none" strokeLinecap="round" /></g>
    </svg>
  </>;
}}</Stage>;

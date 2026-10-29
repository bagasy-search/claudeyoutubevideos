// rk29b · componentes únicos 1-23 (cada uno UNA vez en toda la tanda; registro en D:/rtmp/rk29_COMPONENTES.md).
// La cerradura inteligente: escucha toda la noche, cree que el teléfono está cerca, el sillón a 8 pies, el reloj de las 11 aperturas…
import React from "react";
import { H, Stage, Tag, phys, cl, eio, TX, DIM } from "./hkit";
import { Waves } from "./rkdraw";
import { AMB, RED, ICE, GRN, BRASS, rnd, At, Keypad, Phone, Row, Door, Screw, Strike, Person, House } from "./lockdraw";

type P = { t: number; h: H };
const A = (s: number) => cl(s);
const sp = (tt: number, a: number) => A(phys(tt, a));

// 1 · toda la noche: la puerta escucha, el reloj corre de 11 pm a 5 am, el teléfono duerme en la mesa de luz
export const HNightwatch: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const hr = 23 + 6 * eio(tt, 0.8, 7.5), hh = Math.floor(hr) % 12 || 12, mm = Math.floor((hr % 1) * 60);
  return <>
    <At x={560} y={560} s={0.82 * sp(tt, 0.1)}><Door w={360} night={1} lock={<Keypad w={70} ledOn={0.5 + 0.5 * Math.sin(tt * 2)} led={ICE} />} /></At>
    <Waves x={640} y={500} k={tt * 0.45} n={4} r={620} col={ICE} ang={0} spread={50} op={0.8} />
    <At x={1360} y={640} s={sp(tt, 0.5)}><div style={{ width: 420, height: 150, borderRadius: 14, background: "linear-gradient(180deg,#6b4a32,#4a3222)", boxShadow: "0 30px 50px rgba(0,0,0,.6)" }} /></At>
    <At x={1300} y={545} s={sp(tt, 0.8)} rot={-6}><div style={{ transform: "rotateX(60deg)" }}><Phone w={110} glow={0.25} dark /></div></At>
    <At x={1470} y={510} s={sp(tt, 1)}><div style={{ fontFamily: "monospace", fontWeight: 900, fontSize: 64, color: RED, padding: "10px 22px", borderRadius: 12, background: "#120a0a", textShadow: `0 0 18px ${RED}` }}>{hh}:{String(mm).padStart(2, "0")}</div></At>
    <Tag tt={tt} at={1.4} x={600} y={150} txt="LISTENING ALL NIGHT" col={ICE} size={60} />
  </>;
}}</Stage>;

// 2 · radar: la cerradura sólo sabe si el teléfono está DENTRO del círculo; el teléfono entra y la cerradura se abre
export const HRadar: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const px = 1560 - 640 * eio(tt, 1.5, 4.2), inside = px < 1300, sweep = (tt * 90) % 360;
  return <div style={{ position: "absolute", inset: 0, transform: "perspective(1700px) rotateX(48deg)", transformOrigin: "50% 62%" }}>
    <div style={{ position: "absolute", left: 960 - 380, top: 560 - 380, width: 760, height: 760, borderRadius: "50%", border: `4px solid ${inside ? GRN : ICE}`, background: `conic-gradient(from ${sweep}deg, rgba(143,214,255,.28), transparent 60deg)`, opacity: sp(tt, 0.2) }} />
    {[0.33, 0.66].map((k, i) => <div key={i} style={{ position: "absolute", left: 960 - 380 * k, top: 560 - 380 * k, width: 760 * k, height: 760 * k, borderRadius: "50%", border: "2px solid rgba(143,214,255,.35)" }} />)}
    <At x={960} y={560} s={sp(tt, 0.3)}><Keypad w={100} ledOn={inside ? 1 : 0.3} led={inside ? GRN : ICE} /></At>
    <At x={px} y={600} s={sp(tt, 0.9)} rot={-10}><Phone w={120} dark glow={0.6} /></At>
    <Tag tt={tt} at={4.4} x={960} y={150} txt="CLOSE ENOUGH? IT OPENS." col={inside ? GRN : TX} size={58} />
  </div>;
}}</Stage>;

// 3 · fantasmas: siluetas translúcidas de los que alguna vez tuvieron código siguen pasando por la puerta
export const HGhosts: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => <>
  <At x={960} y={560} s={0.8 * sp(tt, 0.1)}><Door w={380} open={0.55 + 0.05 * Math.sin(tt)} lock={<Keypad w={72} ledOn={1} />} /></At>
  {["PAINTER", "DOG WALKER", "OLD CLEANER"].map((n, i) => {
    const k = cl((tt - 1 - i * 1.6) / 3.2); if (k <= 0) return null;
    const x = 380 + 600 * k + i * 30;
    return <React.Fragment key={i}><At x={x} y={620} o={0.55 * Math.sin(Math.PI * k)}><Person s={1.6} col="#cfe6ff" /></At>
      <Tag tt={tt} at={1.2 + i * 1.6} x={x} y={300 - i * 10} txt={n} col={ICE} size={44} /></React.Fragment>;
  })}
  <Tag tt={tt} at={0.6} x={960} y={130} txt="PEOPLE YOU FORGOT" col={TX} size={60} />
</>}</Stage>;

// 4 · el anuncio: la cerradura repite «HERE I AM» en pulsos; el teléfono, las auriculares y el auto lo oyen
export const HBeacon: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const beat = (tt % 1.4) / 1.4;
  return <>
    <At x={960} y={560} s={sp(tt, 0.1)}><Keypad w={150} ledOn={beat < 0.2 ? 1 : 0.2} led={ICE} /></At>
    <Waves x={960} y={560} k={tt / 1.4} n={3} r={760} col={ICE} op={0.9} />
    <At x={960} y={250} s={beat < 0.5 ? 1 + 0.05 * Math.sin(beat * Math.PI) : 1} o={sp(tt, 0.6)}><div style={{ padding: "14px 34px", borderRadius: 40, background: "#f4f2ee", color: "#1d1f24", fontWeight: 900, fontSize: 54 }}>HERE I AM. I'M A LOCK.</div></At>
    {[[360, 700, "PHONE"], [1560, 720, "CAR"], [1520, 330, "EARBUDS"]].map(([x, y, n], i) => <React.Fragment key={i}>
      <At x={x as number} y={y as number} s={sp(tt, 1.2 + i * 0.5)}><div style={{ width: 120, height: 120, borderRadius: 28, background: "#23262c", boxShadow: `0 0 ${tt > 1.6 + i * 0.5 ? 30 : 0}px ${ICE}`, border: `3px solid ${ICE}` }} /></At>
      <Tag tt={tt} at={1.5 + i * 0.5} x={x as number} y={(y as number) + 110} txt={n as string} col={TX} size={44} /></React.Fragment>)}
  </>;
}}</Stage>;

// 5 · creer: la aguja «¿TELÉFONO CERCA?» se va a SÍ aunque el teléfono sigue lejos, en la mesa de luz
export const HBelieve: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const fool = eio(tt, 2.4, 4), ang = -60 + 120 * fool + 3 * Math.sin(tt * 3);
  return <>
    <At x={700} y={580} s={sp(tt, 0.2)}><svg width={620} height={380} viewBox="0 0 620 380" style={{ overflow: "visible" }}>
      <path d="M40 330 A270 270 0 0 1 580 330" fill="none" stroke="#2b2e34" strokeWidth={60} strokeLinecap="round" />
      <path d="M40 330 A270 270 0 0 1 310 60" fill="none" stroke={RED} strokeWidth={60} strokeLinecap="round" opacity={0.7} />
      <path d="M310 60 A270 270 0 0 1 580 330" fill="none" stroke={GRN} strokeWidth={60} strokeLinecap="round" opacity={0.7} />
      <g transform={`rotate(${ang} 310 330)`}><path d="M300 330 L310 90 L320 330 Z" fill="#f4f2ee" /></g><circle cx={310} cy={330} r={26} fill="#f4f2ee" />
      <text x={70} y={375} fill={TX} fontSize={40} fontWeight={900} fontFamily="sans-serif">FAR</text><text x={480} y={375} fill={TX} fontSize={40} fontWeight={900} fontFamily="sans-serif">NEAR</text>
    </svg></At>
    <At x={1450} y={600} s={sp(tt, 0.6)}><House w={420} win={0.3} /></At>
    <At x={1520} y={640} s={sp(tt, 1)}><Phone w={60} dark glow={0.3} /></At>
    <Tag tt={tt} at={1} x={1450} y={330} txt="PHONE IS UPSTAIRS" col={DIM} size={44} />
    <Tag tt={tt} at={4.2} x={700} y={190} txt="THE LOCK BELIEVES IT" col={RED} size={60} />
  </>;
}}</Stage>;

// 6 · mayo de 2022: la hoja del calendario cae, el informe se abre, el sello «HANDS-FREE CAN BE FOOLED»
export const HPaper2022: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const st = phys(tt, 4, 9, 0.35);
  return <>
    <At x={600} y={560} s={sp(tt, 0.1)} rot={-6 + 6 * (1 - sp(tt, 0.1))}><div style={{ width: 380, height: 420, borderRadius: 14, background: "#f4f0e6", boxShadow: "0 40px 70px rgba(0,0,0,.6)", overflow: "hidden", textAlign: "center", color: "#222" }}>
      <div style={{ background: RED, color: "#fff", fontWeight: 900, fontSize: 64, padding: 18 }}>MAY</div><div style={{ fontWeight: 900, fontSize: 170, marginTop: 20 }}>2022</div></div></At>
    <At x={1280} y={580} s={sp(tt, 1.2)} rot={4}><div style={{ width: 560, height: 700, borderRadius: 8, background: "#fbfaf6", boxShadow: "0 50px 90px rgba(0,0,0,.6)", padding: 46, color: "#333" }}>
      <div style={{ fontWeight: 900, fontSize: 40, color: "#111" }}>SECURITY RESEARCH</div>
      {Array.from({ length: 11 }, (_, i) => <div key={i} style={{ height: 14, width: `${60 + rnd(i) * 38}%`, background: "#d9d6cf", borderRadius: 7, marginTop: 26 * cl((tt - 1.6 - i * 0.08) * 3) }} />)}
      <svg width={460} height={140} style={{ marginTop: 30 }}><polyline points={Array.from({ length: 12 }, (_, i) => `${i * 40},${120 - (rnd(i + 5) * 60 + i * 5) * cl((tt - 2.2) / 1.5)}`).join(" ")} fill="none" stroke={ICE} strokeWidth={6} /></svg>
    </div></At>
    {st > 0.01 && <At x={1280} y={600} s={2.2 - 1.2 * cl(st)} rot={-12} o={cl(st * 2)}><div style={{ border: `8px solid ${RED}`, color: RED, fontWeight: 900, fontSize: 56, padding: "10px 26px", borderRadius: 12, background: "rgba(255,255,255,.85)" }}>CAN BE FOOLED</div></At>}
  </>;
}}</Stage>;

// 7 · reloj de arena de 30 s: la arena cae y la palanca del interruptor baja sola al final
export const HSandglass: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const s = eio(tt, 0.6, 5.2);
  return <>
    <At x={760} y={560} s={sp(tt, 0.1)} rot={2 * Math.sin(tt)}><svg width={300} height={460} viewBox="0 0 300 460">
      <rect x={10} y={0} width={280} height={26} rx={10} fill={BRASS} /><rect x={10} y={434} width={280} height={26} rx={10} fill={BRASS} />
      <path d="M40 26 L260 26 L160 226 L160 234 L260 434 L40 434 L140 234 L140 226 Z" fill="rgba(200,230,255,.18)" stroke="rgba(220,240,255,.6)" strokeWidth={4} />
      <path d={`M${40 + 100 * s} ${26 + 200 * s} L${260 - 100 * s} ${26 + 200 * s} L160 226 L140 226 Z`} fill={AMB} />
      <path d={`M${150 - 110 * s} 434 L${150 + 110 * s} 434 L150 ${434 - 150 * s} Z`} fill={AMB} />
      {s < 1 && <rect x={148} y={226} width={4} height={208 - 150 * s} fill={AMB} />}
    </svg></At>
    <At x={1250} y={560} s={1.3 * sp(tt, 0.5)}><Phone w={260}><div style={{ paddingTop: 200 }}><Row w={260} txt="Auto-unlock" on={1 - eio(tt, 5.2, 5.6)} /></div></Phone></At>
    <Tag tt={tt} at={0.4} x={760} y={200} txt="30 SECONDS" col={AMB} size={64} />
  </>;
}}</Stage>;

// 8 · la planta del living: sillón a 8 pies de la puerta; el hijo se da vuelta, el teléfono se mueve, la puerta se abre
export const HCouchplan: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const roll = [3, 5.5, 8].map((a) => cl((tt - a) / 0.5) * (1 - cl((tt - a - 1.2) / 0.5))), open = Math.max(...roll);
  return <div style={{ position: "absolute", inset: 0, transform: "perspective(1800px) rotateX(46deg)", transformOrigin: "50% 66%" }}>
    <div style={{ position: "absolute", left: 360, top: 140, width: 1200, height: 800, background: "#d9cfbd", borderRadius: 10, boxShadow: "inset 0 0 0 22px #3b3029, 0 40px 80px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 460, top: 520, width: 380, height: 160, borderRadius: 24, background: "#5a6b7d", boxShadow: "0 16px 0 #3c4855" }} />
    <At x={650} y={590} rot={open * 12}><Person s={0.8} lying={1} col="#e8ddcb" /></At>
    <At x={720} y={570} rot={open * 25}><div style={{ width: 28, height: 50, borderRadius: 6, background: "#111", boxShadow: `0 0 ${20 + 30 * open}px ${ICE}` }} /></At>
    <div style={{ position: "absolute", left: 1380, top: 360, width: 26, height: 300, background: "#3b3029" }} />
    <div style={{ position: "absolute", left: 1380, top: 360, width: 200, height: 22, background: "#7a2f25", transformOrigin: "0 50%", transform: `rotate(${90 - 70 * open}deg)` }} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><line x1={860} y1={600} x2={1370} y2={600} stroke={AMB} strokeWidth={6} strokeDasharray="22 16" strokeDashoffset={-tt * 40} opacity={sp(tt, 1)} /></svg>
    <Tag tt={tt} at={1.2} x={1110} y={540} txt="8 FEET" col={AMB} size={70} />
    {open > 0.3 && <Tag tt={tt} at={3.2} x={1450} y={300} txt="UNLOCKED" col={RED} size={56} />}
  </div>;
}}</Stage>;

// 9 · el reloj de las 11: una esfera de 12 a 5 de la mañana y 11 marcas que caen con peso, cada una con el nombre del hijo
export const HClock11: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => <>
  <At x={760} y={560} s={sp(tt, 0.1)}><svg width={620} height={620} viewBox="-310 -310 620 620">
    <circle r={300} fill="#f4f0e6" /><circle r={300} fill="none" stroke="#2c2620" strokeWidth={14} />
    <path d={`M0 0 L0 -280 A280 280 0 0 1 ${280 * Math.sin(150 * Math.PI / 180)} ${-280 * Math.cos(150 * Math.PI / 180)} Z`} fill="rgba(255,90,74,.22)" />
    {Array.from({ length: 12 }, (_, i) => <text key={i} x={240 * Math.sin(i * Math.PI / 6)} y={-240 * Math.cos(i * Math.PI / 6) + 16} textAnchor="middle" fontSize={46} fontWeight={900} fill="#2c2620" fontFamily="sans-serif">{i || 12}</text>)}
    {Array.from({ length: 11 }, (_, i) => { const a = (0.2 + (i / 11) * 4.6) * Math.PI / 6, k = cl(phys(tt, 0.8 + i * 0.42, 9, 0.4)); return <circle key={i} cx={170 * Math.sin(a)} cy={-170 * Math.cos(a) - 60 * (1 - k)} r={20} fill={RED} opacity={cl(k * 2)} />; })}
  </svg></At>
  <At x={1380} y={480} s={sp(tt, 5.6)}><div style={{ fontWeight: 900, fontSize: 260, color: RED, lineHeight: 1 }}>11</div></At>
  <Tag tt={tt} at={6} x={1380} y={680} txt="MIDNIGHT TO 5 AM" col={TX} size={48} />
</>}</Stage>;

// 10 · tres teléfonos sobre la mesa: el dedo apaga uno, otro, otro
export const HThreephones: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => <>
  {["SON", "MOM", "DAD"].map((n, i) => {
    const off = eio(tt, 1.6 + i * 1.8, 2.0 + i * 1.8);
    return <React.Fragment key={i}><At x={520 + i * 440} y={580} s={sp(tt, 0.2 + i * 0.25)} rot={-4 + i * 4}><Phone w={250}><div style={{ paddingTop: 190 }}><Row w={250} txt="Auto-unlock" on={1 - off} /></div></Phone></At>
      <Tag tt={tt} at={0.5 + i * 0.25} x={520 + i * 440} y={200} txt={n} col={off > 0.5 ? GRN : TX} size={52} /></React.Fragment>;
  })}
  <Tag tt={tt} at={7.6} x={960} y={970} txt="COST: NOTHING" col={AMB} size={56} />
</>}</Stage>;

// 11 · la lupa recorre el menú y prende cada palabra peligrosa: auto, proximity, touch to open, hands-free, geofence
export const HScanner: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const W = ["Notifications", "Auto-unlock", "Proximity", "Sound", "Touch to open", "Hands-free", "Battery", "Geofence"], bad = [1, 2, 4, 5, 7];
  const yS = 270 + 75 * Math.min(7, Math.max(0, (tt - 1) * 1.05));
  return <>
    <At x={960} y={560} s={1.45 * sp(tt, 0.1)}><Phone w={300}><div style={{ paddingTop: 80 }}>{W.map((w, i) => <Row key={i} w={300} txt={w} hl={bad.includes(i) ? cl((tt - 1 - i / 1.05) * 3) : 0} />)}</div></Phone></At>
    <At x={1300} y={yS} s={sp(tt, 0.8)}><div style={{ width: 170, height: 170, borderRadius: "50%", border: "14px solid #2d2a26", background: "rgba(200,230,255,.15)", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}><div style={{ position: "absolute", left: 140, top: 140, width: 26, height: 110, background: "#2d2a26", borderRadius: 12, transform: "rotate(-45deg)" }} /></div></At>
    <Tag tt={tt} at={7.6} x={960} y={140} txt="ANY OF THESE: OFF" col={AMB} size={58} />
  </>;
}}</Stage>;

// 12 · el raro: cuatro teléfonos, tres apagados en verde; uno sigue prendido y una línea lo une a la puerta abierta
export const HOddone: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const hl = eio(tt, 2.8, 3.6);
  return <>
    {[0, 1, 2, 3].map((i) => <At key={i} x={340 + i * 330} y={600 - (i === 3 ? 40 * hl : 0)} s={sp(tt, 0.2 + i * 0.2) * (i === 3 ? 1 + 0.15 * hl : 1)} o={i === 3 ? 1 : 1 - 0.45 * hl}>
      <Phone w={200}><div style={{ paddingTop: 150 }}><Row w={200} txt="Auto" on={i === 3 ? 1 : 0} col={RED} /></div></Phone></At>)}
    <At x={1640} y={560} s={0.55 * sp(tt, 1.6)}><Door w={360} open={0.4 * hl} /></At>
    {hl > 0 && <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={`M1330 520 Q1480 380 ${1330 + 250 * hl} 470`} fill="none" stroke={RED} strokeWidth={8} strokeDasharray="20 14" strokeDashoffset={-tt * 60} /></svg>}
    <Tag tt={tt} at={3.6} x={1000} y={170} txt="ONE PHONE IS ENOUGH" col={RED} size={60} />
  </>;
}}</Stage>;

// 13 · el dial del auto-lock: entre 30 s y 3 min (zona verde); la puerta se cierra y el pestillo sale solo al llegar
export const HAutolockdial: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const knob = -120 + 150 * eio(tt, 0.8, 2.6), bolt = eio(tt, 6, 6.5);
  return <>
    <At x={640} y={560} s={sp(tt, 0.1)}><svg width={520} height={520} viewBox="-260 -260 520 520">
      <circle r={240} fill="#1e2126" stroke="#3b3f47" strokeWidth={10} />
      <path d={`M${200 * Math.sin(-80 * Math.PI / 180)} ${-200 * Math.cos(-80 * Math.PI / 180)} A200 200 0 0 1 ${200 * Math.sin(40 * Math.PI / 180)} ${-200 * Math.cos(40 * Math.PI / 180)}`} fill="none" stroke={GRN} strokeWidth={34} />
      <g transform={`rotate(${knob})`}><rect x={-12} y={-200} width={24} height={110} rx={12} fill={AMB} /></g><circle r={70} fill="#2c3036" />
      <text x={-215} y={60} fill={DIM} fontSize={36} fontWeight={900} fontFamily="sans-serif">0 s</text><text x={120} y={150} fill={DIM} fontSize={36} fontWeight={900} fontFamily="sans-serif">10 min</text>
    </svg></At>
    <At x={1340} y={560} s={sp(tt, 0.6)}><div style={{ position: "relative", width: 360, height: 520, background: "#d8d1c3", borderRadius: 8, boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 30, top: 30, width: 200, height: 460, background: "#7a2f25", transformOrigin: "0 50%", transform: `perspective(900px) rotateY(${-60 * (1 - eio(tt, 3, 4.6))}deg)` }} />
      <div style={{ position: "absolute", left: 210, top: 250, width: 30 + 60 * bolt, height: 26, background: BRASS, borderRadius: 4 }} /></div></At>
    <Tag tt={tt} at={2.8} x={640} y={180} txt="30 SEC TO 3 MIN" col={GRN} size={58} />
    {bolt > 0.5 && <Tag tt={tt} at={6.2} x={1340} y={180} txt="LOCKS ITSELF" col={AMB} size={52} />}
  </>;
}}</Stage>;

// 14 · cartel verde de la ruta: LEE'S SUMMIT · 2019 entra girando como visto desde el auto
export const HCitysign: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const pass = eio(tt, 0, 6.5);
  return <div style={{ position: "absolute", inset: 0, perspective: 1400 }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 760, height: 320, background: "linear-gradient(180deg,#3a3c40,#232427)" }}>
      {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ position: "absolute", left: ((i * 300 - tt * 420) % 2400 + 2400) % 2400 - 240, top: 140, width: 160, height: 16, background: "#e8d36a" }} />)}</div>
    <div style={{ position: "absolute", left: 960 - 380 + 260 * pass, top: 210, transform: `rotateY(${-34 + 30 * pass}deg) scale(${0.85 + 0.25 * pass})`, transformOrigin: "50% 100%" }}>
      <div style={{ width: 760, padding: "40px 50px", borderRadius: 24, background: "#0f6b3a", border: "10px solid #f4f2ee", boxShadow: "0 50px 90px rgba(0,0,0,.6)", textAlign: "center", color: "#f4f2ee" }}>
        <div style={{ fontWeight: 900, fontSize: 96, letterSpacing: 2 }}>LEE'S SUMMIT</div><div style={{ fontWeight: 800, fontSize: 52, marginTop: 6 }}>MISSOURI · 2019</div></div>
      <div style={{ margin: "0 auto", width: 36, height: 300, background: "#8b8f96" }} />
    </div>
  </div>;
}}</Stage>;

// 15 · el pestillo pega en el marco: la puerta no cierra del todo y el bolt choca contra la madera en vez de entrar
export const HBolthit: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const gap = 46, bolt = eio(tt, 2, 2.6) * (1 - 0.1 * cl((tt - 2.6) * 8) * (1 - cl((tt - 2.9) * 6))), hit = tt > 2.55 && tt < 3.1;
  return <div style={{ position: "absolute", inset: 0, transform: `translateX(${hit ? 6 * Math.sin(tt * 90) : 0}px)` }}>
    <div style={{ position: "absolute", left: 1040, top: 220, width: 420, height: 640, background: "linear-gradient(90deg,#c9a77a,#b08b5e)", boxShadow: "0 40px 70px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 0, top: 240, width: 18, height: 150, background: BRASS }} /><div style={{ position: "absolute", left: 0, top: 285, width: 120, height: 60, background: "#141210", marginLeft: 18 }} /></div>
    <div style={{ position: "absolute", left: 1040 - gap - 520, top: 220, width: 520, height: 640, background: "linear-gradient(90deg,#6e2a21,#7a2f25)", boxShadow: "0 40px 70px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 1040 - gap, top: 292 + (tt > 2.4 ? 22 : 0), width: 10 + (gap + 70) * bolt, height: 46, background: `linear-gradient(180deg,#f0d88f,${BRASS})`, borderRadius: 4, transform: `translateY(${tt > 2.4 ? 0 : 0}px)` }} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><line x1={1040 - gap} y1={900} x2={1040} y2={900} stroke={AMB} strokeWidth={6} /><line x1={1040 - gap} y1={880} x2={1040 - gap} y2={920} stroke={AMB} strokeWidth={6} /><line x1={1040} y1={880} x2={1040} y2={920} stroke={AMB} strokeWidth={6} /></svg>
    <Tag tt={tt} at={0.8} x={1020} y={970} txt="DOOR NOT ALL THE WAY" col={AMB} size={48} />
    <Tag tt={tt} at={3.2} x={760} y={150} txt="BOLT HITS THE WOOD" col={RED} size={60} />
  </div>;
}}</Stage>;

// 16 · la balanza: la cerradura cara de un lado, la tira de pino blando del otro; la madera pesa más… para mal
export const HPricescale: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const tilt = -14 * eio(tt, 1.6, 3.2) + 1.5 * Math.sin(tt * 1.4);
  return <>
    <At x={960} y={760} s={sp(tt, 0.1)}><div style={{ width: 40, height: 380, background: `linear-gradient(90deg,#8a6f2c,${BRASS},#8a6f2c)`, borderRadius: 10 }} /></At>
    <div style={{ position: "absolute", left: 960, top: 560, transform: `translate(-50%,-50%) rotate(${tilt}deg)`, width: 1100, height: 26, background: BRASS, borderRadius: 13 }}>
      <div style={{ position: "absolute", left: 40, top: 26, transform: `rotate(${-tilt}deg)`, transformOrigin: "50% 0" }}><div style={{ width: 2, height: 120, background: "#999", margin: "0 auto" }} /><div style={{ marginTop: -40 }}><Keypad w={110} ledOn={1} /></div></div>
      <div style={{ position: "absolute", right: 40, top: 26, transform: `rotate(${-tilt}deg)`, transformOrigin: "50% 0" }}><div style={{ width: 2, height: 120, background: "#999", margin: "0 auto" }} /><div style={{ width: 300, height: 60, background: "linear-gradient(180deg,#e2c895,#c8a56b)", borderRadius: 4, boxShadow: "0 10px 20px rgba(0,0,0,.5)", marginLeft: -150 }}>
        {[40, 120, 210].map((x, i) => <div key={i} style={{ position: "absolute", left: x - 150, top: 20, width: 50, height: 6, borderRadius: 3, background: "rgba(120,80,30,.4)" }} />)}</div></div>
    </div>
    <Tag tt={tt} at={0.8} x={470} y={290} txt="$250 LOCK" col={TX} size={52} />
    <Tag tt={tt} at={1.2} x={1450} y={290} txt="SOFT PINE" col={AMB} size={52} />
  </>;
}}</Stage>;

// 17 · la patada: flecha de fuerza, el pestillo queda entero, el marco se parte en astillas
export const HKick: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const f = eio(tt, 1.6, 2.1), split = cl((tt - 2.05) / 0.5);
  return <div style={{ position: "absolute", inset: 0, transform: `translateX(${tt > 2 && tt < 2.4 ? 10 * Math.sin(tt * 80) : 0}px)` }}>
    <div style={{ position: "absolute", left: 420, top: 240, width: 560, height: 620, background: "linear-gradient(90deg,#6e2a21,#7a2f25)", transform: `rotate(${4 * split}deg)`, transformOrigin: "0 100%", boxShadow: "0 40px 70px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", right: -80, top: 290, width: 110, height: 44, background: BRASS, borderRadius: 4 }} /></div>
    {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: "absolute", left: 1060 + rnd(i) * 40 + split * (40 + rnd(i + 3) * 260), top: 270 + i * 60 + split * (rnd(i + 7) * 200 - 60), width: 60 + rnd(i + 1) * 60, height: 18, background: "#d9b884", borderRadius: 3, transform: `rotate(${split * (rnd(i + 2) * 200 - 100)}deg)` }} />)}
    <div style={{ position: "absolute", left: 1060, top: 240, width: 60, height: 620, background: "#d9b884", clipPath: split > 0 ? "polygon(0 0,100% 0,100% 40%,30% 47%,100% 54%,100% 100%,0 100%)" : undefined }} />
    {f < 1 && <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={`M${120 + 200 * f} 560 L${330 + 200 * f} 560`} stroke={RED} strokeWidth={30} /><path d={`M${330 + 200 * f} 520 L${400 + 200 * f} 560 L${330 + 200 * f} 600 Z`} fill={RED} /></svg>}
    <Tag tt={tt} at={2.6} x={700} y={150} txt="LOCK: FINE" col={GRN} size={56} />
    <Tag tt={tt} at={3.4} x={1240} y={960} txt="FRAME: GONE" col={RED} size={56} />
  </div>;
}}</Stage>;

// 18 · vista explotada del cerradero: la placa se separa del marco, salen los dos tornillos de 3/4" y se ven lo cortos que son
export const HStrikeexplode: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const ex = eio(tt, 1.2, 2.6);
  return <div style={{ position: "absolute", inset: 0, transform: "perspective(1600px) rotateY(-24deg)", transformOrigin: "50% 50%" }}>
    <div style={{ position: "absolute", left: 600, top: 140, width: 220, height: 820, background: "linear-gradient(90deg,#e2c895,#c8a56b)", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }} />
    <At x={710 + 260 * ex} y={540} s={1.2 * sp(tt, 0.2)}><Strike w={130} /></At>
    {[0, 1].map((i) => <At key={i} x={760 + 620 * ex} y={410 + i * 270} s={sp(tt, 0.4)} o={cl(ex * 2)}><Screw len={68} w={22} /></At>)}
    <Tag tt={tt} at={2.8} x={1400} y={260} txt='3/4" SCREWS' col={AMB} size={56} />
    <Tag tt={tt} at={3.6} x={1400} y={860} txt="ONLY INTO TRIM" col={RED} size={52} />
  </div>;
}}</Stage>;

// 19 · el tornillo largo: corte del marco (trim + hueco + montante); el de 3" atraviesa y muerde la madera de la casa
export const HDeepscrew: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const d = eio(tt, 1, 4.2), rot = d * 1800;
  return <>
    <div style={{ position: "absolute", left: 760, top: 220, width: 110, height: 640, background: "linear-gradient(90deg,#e2c895,#c8a56b)" }} />
    <div style={{ position: "absolute", left: 870, top: 220, width: 70, height: 640, background: "rgba(0,0,0,.35)" }} />
    <div style={{ position: "absolute", left: 940, top: 220, width: 300, height: 640, background: "linear-gradient(90deg,#b88b52,#9c7140)" }}>{Array.from({ length: 10 }, (_, i) => <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 30 + i * 62, height: 4, background: "rgba(80,50,20,.3)", borderRadius: 2 }} />)}</div>
    <At x={420 + 470 * d} y={450} s={sp(tt, 0.2)}><div style={{ transform: `rotateX(${rot}deg)` }}><Screw len={270} w={30} /></div></At>
    <At x={420 + 160 * cl((tt - 5) / 1)} y={690} s={sp(tt, 0.4)} o={0.55}><Screw len={68} w={30} col="#c9a24a" /></At>
    <Tag tt={tt} at={0.5} x={815} y={160} txt="TRIM" col={DIM} size={44} /><Tag tt={tt} at={0.7} x={1090} y={160} txt="HOUSE FRAME" col={TX} size={44} />
    <Tag tt={tt} at={4.4} x={960} y={960} txt='3" BITES IN' col={GRN} size={60} />
  </>;
}}</Stage>;

// 20 · huellas en el teclado: con la luz rasante aparecen 4 botones gastados y brillosos
export const HSmudge: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const L = eio(tt, 1, 3.4), lx = 300 + 1300 * L;
  const wear = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => ([0, 3, 6, 8].includes(i) ? eio(tt, 1.6 + i * 0.12, 2.6 + i * 0.12) : 0));
  return <>
    <At x={960} y={560} s={1.25 * sp(tt, 0.1)} rot={-4}><Keypad w={260} wear={wear} /></At>
    <div style={{ position: "absolute", left: lx - 200, top: 0, width: 400, height: 1080, background: "linear-gradient(90deg, transparent, rgba(255,240,200,.18), transparent)", transform: "skewX(-18deg)", mixBlendMode: "screen" }} />
    <Tag tt={tt} at={3.6} x={1420} y={320} txt="4 WORN BUTTONS" col={AMB} size={56} />
    <Tag tt={tt} at={4.6} x={1420} y={420} txt="1 · 4 · 7 · 9" col={TX} size={52} />
  </>;
}}</Stage>;

// 21 · los códigos malos: torta (cumpleaños), el número de la casa, el año y 1-2-3-4 caen uno por uno a un tacho
export const HBadcodes: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const items = [["6/14", "BIRTHDAY"], ["412", "ADDRESS"], ["1952", "YEAR"], ["1234", "1234"]];
  return <>
    <At x={1460} y={780} s={sp(tt, 0.2)}><div style={{ width: 300, height: 320, background: "linear-gradient(90deg,#4a4d52,#6b6f75,#4a4d52)", borderRadius: "10px 10px 40px 40px", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}><div style={{ height: 36, background: "#33363b", borderRadius: 10, margin: "-18px -20px 0" }} /></div></At>
    {items.map(([ic, n], i) => {
      const a = 1 + i * 1.6, fly = eio(tt, a + 0.8, a + 1.5), x = 380 + i * 230 + (1460 - 380 - i * 230) * fly, y = 460 - 260 * Math.sin(Math.PI * fly) + 220 * fly;
      return <At key={i} x={x} y={y} s={sp(tt, a - 0.6) * (1 - 0.5 * fly)} rot={fly * 200} o={1 - cl((fly - 0.85) * 7)}>
        <div style={{ padding: "18px 26px", borderRadius: 18, background: "#f4f0e6", color: "#2a2620", fontWeight: 900, fontSize: 64, textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>{ic}<div style={{ fontSize: 30, color: RED }}>{n}</div></div></At>;
    })}
    <Tag tt={tt} at={0.4} x={760} y={170} txt="NEVER THESE" col={RED} size={62} />
  </>;
}}</Stage>;

// 22 · el PIN hablado: la orden de voz entra al parlante y choca con una reja de 4 casilleros que sólo se abre con el PIN
export const HVoicepin: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const blocked = tt > 1.8 && tt < 3.6, fill = Math.floor(cl((tt - 4) / 2.2) * 4.99);
  return <>
    <At x={460} y={560} s={sp(tt, 0.1)}><div style={{ width: 230, height: 230, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #4a4e57, #1c1e22)", boxShadow: `0 0 0 10px ${blocked ? RED : ICE}, 0 30px 60px rgba(0,0,0,.6)` }} /></At>
    <Waves x={560} y={560} k={tt * 0.8} n={3} r={460} col={blocked ? RED : ICE} ang={0} spread={40} op={tt < 3.8 ? 1 : 0.3} />
    <At x={1100} y={560} s={sp(tt, 0.8)}><div style={{ display: "flex", gap: 22, padding: 30, borderRadius: 26, background: "#1e2126", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ width: 110, height: 140, borderRadius: 16, background: i < fill ? AMB : "#2c3036", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 80, color: "#1e2126" }}>{i < fill ? "•" : ""}</div>)}</div></At>
    <At x={1640} y={560} s={sp(tt, 1)}><Door w={170} open={fill >= 4 ? 0.4 * cl((tt - 6.3) * 3) : 0} /></At>
    <Tag tt={tt} at={0.6} x={600} y={250} txt='"UNLOCK THE DOOR"' col={TX} size={52} />
    <Tag tt={tt} at={4} x={1100} y={790} txt="SPOKEN PIN: KEEP ON" col={GRN} size={50} />
  </>;
}}</Stage>;

// 23 · la llave adentro: corte de la casa, ella afuera en el frío con la cerradura muerta, la llave de metal en el cajón de la cocina
export const HKeyinside: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const xr = eio(tt, 1.6, 2.8);
  return <>
    <div style={{ position: "absolute", left: 640, top: 200, width: 1040, height: 680, background: "#2a2622", boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 0 0 18px #4a3a30", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 18, background: `rgba(230,220,200,${0.12 + 0.6 * xr})` }} />
      <div style={{ position: "absolute", left: 600, top: 380, width: 300, height: 120, background: "#7b5a3c", borderRadius: 6, opacity: 0.4 + 0.6 * xr }}><div style={{ position: "absolute", left: 30, top: 20, width: 240, height: 50, background: "#5a4029", borderRadius: 4, boxShadow: `0 0 ${40 * xr}px ${AMB}` }} /></div>
      <div style={{ position: "absolute", left: 690, top: 395, width: 110, height: 24, borderRadius: 12, background: BRASS, opacity: xr, boxShadow: `0 0 30px ${AMB}` }} />
    </div>
    <At x={640} y={560} s={sp(tt, 0.3)}><Keypad w={80} ledOn={0} /></At>
    <At x={380} y={660} s={sp(tt, 0.5)}><Person s={1.5} col="#d4dbe6" /></At>
    {Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: "absolute", left: 120 + rnd(i) * 440, top: ((rnd(i + 4) * 1080 + tt * 60 * (1 + rnd(i))) % 1080), width: 8, height: 8, borderRadius: "50%", background: "#fff", opacity: 0.6 }} />)}
    <Tag tt={tt} at={0.8} x={380} y={300} txt="9 PM · COLD" col={ICE} size={50} />
    <Tag tt={tt} at={3} x={1290} y={150} txt="THE KEY: INSIDE" col={AMB} size={58} />
  </>;
}}</Stage>;

export const HEROES_A = { nightwatch: HNightwatch, radar: HRadar, ghosts: HGhosts, beacon: HBeacon, believe: HBelieve, paper2022: HPaper2022, sandglass: HSandglass, couchplan: HCouchplan, clock11: HClock11, threephones: HThreephones, scanner: HScanner, oddone: HOddone, autolockdial: HAutolockdial, citysign: HCitysign, bolthit: HBolthit, pricescale: HPricescale, kick: HKick, strikeexplode: HStrikeexplode, deepscrew: HDeepscrew, smudge: HSmudge, badcodes: HBadcodes, voicepin: HVoicepin, keyinside: HKeyinside };

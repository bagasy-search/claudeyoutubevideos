// rk29b · componentes únicos 24-45 (cada uno UNA vez en toda la tanda; registro en D:/rtmp/rk29_COMPONENTES.md).
// Pilas, actualizaciones, la lista de gente, el historial, la cuenta, el vidrio, el garage, el domingo de 10 minutos…
import React from "react";
import { H, Stage, Tag, phys, cl, eio, TX, DIM } from "./hkit";
import { Waves } from "./rkdraw";
import { AMB, RED, ICE, GRN, BRASS, rnd, At, Keypad, Phone, Toggle, Door, Person } from "./lockdraw";

type P = { t: number; h: H };
const sp = (tt: number, a: number) => cl(phys(tt, a));

// 24 · semanas de aviso: una tira de 6 semanas, cada una con su parpadeo ámbar ignorado (el dedo lo barre), la última se apaga
export const HWarnweeks: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => <>
  {Array.from({ length: 6 }, (_, i) => {
    const a = 0.6 + i * 0.9, s = sp(tt, a), dead = i === 5 && tt > a + 1.2, swipe = eio(tt, a + 0.5, a + 0.8);
    return <At key={i} x={300 + i * 264} y={560} s={s}><div style={{ width: 220, height: 300, borderRadius: 20, background: "#1e2126", boxShadow: "0 30px 50px rgba(0,0,0,.55)", textAlign: "center", paddingTop: 26 }}>
      <div style={{ fontWeight: 900, fontSize: 34, color: DIM }}>WEEK {i + 1}</div>
      <div style={{ width: 70, height: 70, margin: "40px auto 0", borderRadius: "50%", background: dead ? "#2a2c30" : AMB, boxShadow: dead ? "none" : `0 0 ${20 + 20 * Math.sin(tt * 5 + i)}px ${AMB}` }} />
      {!dead && <div style={{ margin: "34px auto 0", width: 150, height: 40, borderRadius: 10, background: "#f4f2ee", transform: `translateX(${260 * swipe}px)`, opacity: 1 - swipe }} />}
      {dead && <div style={{ marginTop: 40, fontWeight: 900, fontSize: 44, color: RED }}>DEAD</div>}</div></At>;
  })}
  <Tag tt={tt} at={6.6} x={960} y={200} txt="FIRST WARNING: CHANGE ALL" col={AMB} size={56} />
</>}</Stage>;

// 25 · el puente de 9 V: la pila se apoya en los dos puntos de abajo del teclado y el teclado revive
export const HJump9v: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const up = eio(tt, 1.4, 2.6), on = tt > 2.7 ? 1 : 0;
  return <>
    <At x={960} y={470} s={1.15 * sp(tt, 0.1)}><Keypad w={230} lit={on} ledOn={on} led={GRN} /></At>
    {[-30, 30].map((dx, i) => <div key={i} style={{ position: "absolute", left: 960 + dx * 1.15 - 10, top: 470 + 253 * 1.15 - 4, width: 20, height: 12, borderRadius: 4, background: "#d6d8dc", boxShadow: on ? `0 0 16px ${AMB}` : "none" }} />)}
    <At x={960} y={1050 - 280 * up} s={sp(tt, 0.6)}><div style={{ width: 150, height: 240, borderRadius: 14, background: "linear-gradient(180deg,#2b2b2b 30%,#d9a43a 30%)", boxShadow: "0 20px 40px rgba(0,0,0,.6)", position: "relative" }}>
      {[30, 90].map((x, i) => <div key={i} style={{ position: "absolute", left: x, top: -22, width: 32, height: 26, borderRadius: 6, background: "#c9ccd1" }} />)}
      <div style={{ position: "absolute", top: 110, width: "100%", textAlign: "center", fontWeight: 900, fontSize: 56, color: "#2b2b2b" }}>9V</div></div></At>
    {on > 0 && <Waves x={960} y={760} k={tt * 0.9} n={2} r={120} col={AMB} op={0.8} />}
    <Tag tt={tt} at={3} x={1450} y={460} txt="ENOUGH TO TYPE" col={GRN} size={54} />
    <Tag tt={tt} at={3.4} x={1450} y={540} txt="YOUR CODE" col={GRN} size={54} />
  </>;
}}</Stage>;

// 26 · el parche: la cerradura tiene una grieta (el problema viejo); la actualización viaja por el cable y la cose
export const HPatch: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const flow = cl((tt - 3) / 3), seal = eio(tt, 6, 7.4);
  return <>
    <At x={1320} y={540} s={1.2 * sp(tt, 0.1)}><div style={{ position: "relative" }}><Keypad w={200} ledOn={seal} led={GRN} />
      <svg width={200} height={440} style={{ position: "absolute", inset: 0 }}><path d="M70 0 L95 90 L70 160 L110 240 L85 330" fill="none" stroke={RED} strokeWidth={8} opacity={1 - seal} />
        <path d="M70 0 L95 90 L70 160 L110 240 L85 330" fill="none" stroke={GRN} strokeWidth={10} strokeDasharray="400" strokeDashoffset={400 * (1 - seal)} /></svg></div></At>
    <At x={460} y={560} s={sp(tt, 0.6)}><Phone w={220}><div style={{ textAlign: "center", paddingTop: 150, fontWeight: 900, fontSize: 30, color: "#24262b" }}>UPDATE<div style={{ fontSize: 60, color: GRN }}>FREE</div></div></Phone></At>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d="M600 560 C850 420 1000 700 1200 540" fill="none" stroke="#3a3d44" strokeWidth={10} />
      {flow > 0 && flow < 1 && [0, 0.33, 0.66].map((o, i) => { const q = (flow * 3 + o) % 1, x = 600 + 600 * q, y = 560 - 140 * Math.sin(Math.PI * q) + 160 * q * q - 140 * q; return <circle key={i} cx={x} cy={y} r={16} fill={GRN} />; })}</svg>
    <Tag tt={tt} at={0.8} x={1320} y={130} txt="THE OLD PROBLEM" col={RED} size={52} />
    <Tag tt={tt} at={7.4} x={960} y={970} txt="FIXED IN 4 MINUTES" col={GRN} size={56} />
  </>;
}}</Stage>;

// 27 · el rolodex: las tarjetas de la lista giran una tras otra (pintor, paseador, limpiadora vieja, «guest», ex yerno)
export const HRolodex: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const N = ["THE PAINTER", "THE DOG WALKER", "OLD CLEANER", "GUEST", "EX SON-IN-LAW"], pos = Math.min(N.length - 1, Math.max(0, (tt - 1) / 2.2));
  return <>
    <At x={960} y={860} s={sp(tt, 0.1)}><div style={{ width: 700, height: 70, borderRadius: 20, background: "#2c2f35", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }} /></At>
    {N.map((n, i) => {
      const d = i - pos; if (d < -1 || d > 2.5) return null;
      return <div key={i} style={{ position: "absolute", left: 960, top: 520, transform: `translate(-50%,-50%) perspective(1400px) translateZ(${-140 * Math.max(0, d)}px) rotateX(${Math.max(-90, -95 * Math.min(0, d) * 1.0 + 0) * (d < 0 ? 1 : 0) + (d > 0 ? 6 * d : 0)}deg) translateY(${-40 * Math.max(0, d)}px)`, transformOrigin: "50% 100%", opacity: d < -0.9 ? 0 : 1, zIndex: 10 - Math.round(d * 2) }}>
        <div style={{ width: 760, height: 400, borderRadius: 18, background: "#f6f2e8", boxShadow: "0 30px 60px rgba(0,0,0,.45)", padding: "50px 60px", color: "#2a2620" }}>
          <div style={{ fontWeight: 800, fontSize: 30, color: "#8a8378", letterSpacing: 4 }}>STILL HAS A CODE</div>
          <div style={{ fontWeight: 900, fontSize: 84, marginTop: 30 }}>{n}</div>
          <div style={{ marginTop: 30, height: 10, width: 300, background: "#e0d9cb", borderRadius: 5 }} /></div></div>;
    })}
    <Tag tt={tt} at={11.5} x={960} y={140} txt="ALL STILL GET IN" col={RED} size={60} />
  </>;
}}</Stage>;

// 28 · los martes: la grilla del mes se arma; cada martes a la 1 pm se prende con «MIKE»
export const HTuesdays: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => <>
  <At x={960} y={580} s={sp(tt, 0.1)}><div style={{ width: 1120, padding: 34, borderRadius: 22, background: "#f4f0e6", boxShadow: "0 40px 80px rgba(0,0,0,.6)", color: "#2a2620" }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 12, fontWeight: 900, fontSize: 30, textAlign: "center", color: "#8a8378" }}>{["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => <div key={d} style={{ color: d === "TUE" ? RED : undefined }}>{d}</div>)}</div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 12, marginTop: 14 }}>{Array.from({ length: 28 }, (_, i) => {
      const tue = i % 7 === 2, w = Math.floor(i / 7), lit = tue ? eio(tt, 2 + w * 1.1, 2.4 + w * 1.1) : 0;
      return <div key={i} style={{ height: 120, borderRadius: 12, background: lit > 0.05 ? `rgba(255,90,74,${0.2 + 0.6 * lit})` : "#e6dfd1", opacity: sp(tt, 0.3 + i * 0.03), padding: 10, fontWeight: 800, fontSize: 26 }}>{i + 1}
        {lit > 0.3 && <div style={{ fontWeight: 900, fontSize: 30, color: "#fff", marginTop: 4 }}>1 PM · MIKE</div>}</div>;
    })}</div></div></At>
  <Tag tt={tt} at={6.8} x={960} y={110} txt="SHE DIDN'T KNOW A MIKE" col={TX} size={56} />
</>}</Stage>;

// 29 · el código que vence: un boleto con fecha; al llegar el día la parte del código se corta sola y cae
export const HExpire: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const cut = eio(tt, 3.6, 4.3), fall = cl((tt - 4.3) / 1.4);
  return <>
    <At x={960} y={540} s={1.3 * sp(tt, 0.1)} rot={-3}><div style={{ position: "relative", width: 900, height: 300 }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 560, height: 300, borderRadius: "18px 0 0 18px", background: "#f4f0e6", padding: 40, color: "#2a2620" }}>
        <div style={{ fontWeight: 800, fontSize: 30, color: "#8a8378", letterSpacing: 4 }}>WORKER CODE</div><div style={{ fontWeight: 900, fontSize: 110, letterSpacing: 16 }}>5 8 2 0</div></div>
      <div style={{ position: "absolute", left: 560, top: 0, width: 340, height: 300, borderRadius: "0 18px 18px 0", background: AMB, padding: 40, color: "#2a2620", borderLeft: "6px dashed #2a2620", transformOrigin: "0 100%", transform: `translate(${40 * cut}px, ${600 * fall * fall}px) rotate(${50 * fall}deg)` }}>
        <div style={{ fontWeight: 800, fontSize: 30, letterSpacing: 4 }}>ENDS</div><div style={{ fontWeight: 900, fontSize: 80 }}>FRI</div></div></div></At>
    <Tag tt={tt} at={4.6} x={760} y={830} txt="JOB ENDS, CODE ENDS" col={GRN} size={58} />
  </>;
}}</Stage>;

// 30 · rayos X a la maceta: la maceta del porche se vuelve transparente y adentro está la llave
export const HPotxray: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const xr = eio(tt, 1.4, 2.6), scan = 300 + 520 * eio(tt, 1.2, 3);
  return <>
    <At x={960} y={600} s={1.2 * sp(tt, 0.1)}><svg width={520} height={520} viewBox="0 0 260 260" style={{ overflow: "visible" }}>
      <path d="M50 40 L210 40 L190 240 L70 240 Z" fill={`rgba(196,98,52,${1 - 0.75 * xr})`} stroke={xr > 0.1 ? ICE : "none"} strokeWidth={3} />
      <rect x={40} y={26} width={180} height={28} rx={6} fill={`rgba(176,84,42,${1 - 0.7 * xr})`} />
      <path d="M90 26 Q100 -30 130 -10 Q150 -40 170 26" fill="#3f7a3a" opacity={1 - 0.6 * xr} />
      <g opacity={xr} transform="translate(130 222) rotate(-8)"><circle r={18} fill="none" stroke={BRASS} strokeWidth={8} /><rect x={16} y={-5} width={70} height={10} fill={BRASS} /><rect x={60} y={5} width={8} height={12} fill={BRASS} /><rect x={74} y={5} width={8} height={9} fill={BRASS} /></g>
    </svg></At>
    <div style={{ position: "absolute", left: 600, top: scan, width: 720, height: 6, background: ICE, boxShadow: `0 0 30px ${ICE}`, opacity: tt < 3.1 ? 1 : 0 }} />
    <Tag tt={tt} at={3.2} x={960} y={150} txt="FIRST PLACE THEY LOOK" col={RED} size={58} />
  </>;
}}</Stage>;

// 31 · dominó: la contraseña repetida de un sitio filtrado tumba fichas hasta la puerta de casa
export const HDomino: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const L = ["OLD SHOP", "EMAIL", "BANK", "LOCK APP"];
  return <div style={{ position: "absolute", inset: 0, transform: "perspective(1600px) rotateX(18deg)" }}>
    {L.map((n, i) => {
      const f = eio(tt, 1.8 + i * 0.7, 2.4 + i * 0.7);
      return <React.Fragment key={i}><div style={{ position: "absolute", left: 300 + i * 300, top: 380, width: 110, height: 320, borderRadius: 12, background: i === 0 ? RED : "#f4f0e6", boxShadow: "0 20px 30px rgba(0,0,0,.5)", transformOrigin: "100% 100%", transform: `rotate(${75 * f}deg)`, opacity: sp(tt, 0.2 + i * 0.15), display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: "rotate(-90deg)", fontWeight: 900, fontSize: 38, color: i === 0 ? "#fff" : "#2a2620", whiteSpace: "nowrap" }}>{n}</div></div></React.Fragment>;
    })}
    <At x={1580} y={520} s={0.5 * sp(tt, 0.8)}><Door w={360} open={0.45 * eio(tt, 4.4, 5)} /></At>
    <Tag tt={tt} at={0.6} x={360} y={300} txt="LEAKED" col={RED} size={50} />
    <Tag tt={tt} at={5.2} x={960} y={880} txt="ONE PASSWORD, EVERY DOOR" col={AMB} size={54} />
  </div>;
}}</Stage>;

// 32 · el candado sobre el candado: un segundo candado chico baja y cierra encima del primero
export const HNested: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const d = cl(phys(tt, 1.6, 8, 0.4)), sh = eio(tt, 2.6, 3);
  const Pad: React.FC<{ w: number; col: string; sh: number }> = ({ w, col, sh }) => <svg width={w} height={w * 1.2} viewBox="0 0 100 120"><path d={`M28 ${54 - 14 * (1 - sh)} V36 a22 22 0 0 1 44 0 V54`} fill="none" stroke="#c9ccd1" strokeWidth={12} /><rect x={10} y={50} width={80} height={66} rx={14} fill={col} /><circle cx={50} cy={80} r={8} fill="#1b1b1b" /></svg>;
  return <>
    <At x={960} y={620} s={sp(tt, 0.1)}><Pad w={360} col={BRASS} sh={1} /></At>
    <At x={960} y={760 - 1000 * (1 - d)} s={1}><Pad w={160} col={GRN} sh={sh} /></At>
    <At x={1500} y={620} s={sp(tt, 2.8)}><Phone w={200}><div style={{ textAlign: "center", paddingTop: 140, fontWeight: 900, fontSize: 52, color: "#24262b", letterSpacing: 6 }}>482 913</div></Phone></At>
    <Tag tt={tt} at={3.2} x={960} y={170} txt="ONE MORE LOCK" col={GRN} size={62} />
  </>;
}}</Stage>;

// 33 · el router: se da vuelta y la etiqueta de fábrica se despega mostrando la clave impresa
export const HRouter: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const flip = eio(tt, 1, 2.4), peel = eio(tt, 4.4, 5.6);
  return <>
    <At x={960} y={560} s={1.2 * sp(tt, 0.1)}><div style={{ perspective: 1400 }}><div style={{ width: 700, height: 160, borderRadius: 30, background: flip < 0.5 ? "linear-gradient(180deg,#f2f2f0,#cfcfcb)" : "#2d3035", transform: `rotateX(${180 * flip}deg)`, boxShadow: "0 40px 70px rgba(0,0,0,.55)", position: "relative" }}>
      {flip < 0.5 && [0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 220 + i * 70, top: 66, width: 22, height: 22, borderRadius: "50%", background: GRN, opacity: 0.5 + 0.5 * Math.sin(tt * 8 + i * 2) }} />)}
      {flip >= 0.5 && <div style={{ position: "absolute", left: 160, top: 22, width: 380, height: 116, background: "#f4f0e6", borderRadius: 8, transform: `rotateX(180deg) rotate(${-8 * peel}deg) translateY(${-40 * peel}px)`, transformOrigin: "0 0", padding: "16px 24px", color: "#222", fontFamily: "monospace", fontWeight: 900, fontSize: 30 }}>WIFI KEY<div style={{ fontSize: 40 }}>admin1234</div></div>}
    </div></div></At>
    <Tag tt={tt} at={2.8} x={960} y={190} txt="THE FACTORY PASSWORD" col={AMB} size={58} />
    <Tag tt={tt} at={6} x={960} y={900} txt="CHANGE IT" col={GRN} size={58} />
  </>;
}}</Stage>;

// 34 · lámina en el vidrio: a la izquierda el vidrio común se cae en pedazos; a la derecha con lámina queda en telaraña
export const HFilmglass: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const hit = tt > 2, f = cl((tt - 2) / 1.6);
  const Pane: React.FC<{ x: number; film: boolean }> = ({ x, film }) => <div style={{ position: "absolute", left: x, top: 240, width: 520, height: 620, boxShadow: "inset 0 0 0 18px #cfc7b8, 0 30px 60px rgba(0,0,0,.5)" }}>
    {!hit && <div style={{ position: "absolute", inset: 18, background: "linear-gradient(160deg, rgba(190,220,240,.55), rgba(90,120,150,.4))" }} />}
    {hit && Array.from({ length: 16 }, (_, i) => { const cx = (i % 4) * 121 + 18, cy = Math.floor(i / 4) * 146 + 18, fall = film ? 0 : f * f * (600 + rnd(i) * 400);
      return <div key={i} style={{ position: "absolute", left: cx, top: cy + fall, width: 121, height: 146, background: "linear-gradient(160deg, rgba(190,220,240,.55), rgba(90,120,150,.4))", clipPath: `polygon(${rnd(i) * 30}% 0, 100% ${rnd(i + 2) * 30}%, ${70 + rnd(i + 3) * 30}% 100%, 0 ${70 + rnd(i + 4) * 30}%)`, transform: `rotate(${film ? 0 : f * (rnd(i + 5) * 120 - 60)}deg)`, opacity: film ? 1 : 1 - f * 0.6 }} />; })}
    {hit && film && <svg width={520} height={620} style={{ position: "absolute", inset: 0 }}>{Array.from({ length: 10 }, (_, i) => <line key={i} x1={260} y1={300} x2={260 + 400 * Math.cos(i * 0.63)} y2={300 + 400 * Math.sin(i * 0.63)} stroke="rgba(255,255,255,.7)" strokeWidth={3} />)}
      {[60, 130, 200].map((r, i) => <circle key={i} cx={260} cy={300} r={r} fill="none" stroke="rgba(255,255,255,.5)" strokeWidth={2} />)}</svg>}
  </div>;
  return <>
    <Pane x={300} film={false} /><Pane x={1100} film={true} />
    <Tag tt={tt} at={0.4} x={560} y={170} txt="PLAIN GLASS" col={DIM} size={50} /><Tag tt={tt} at={0.6} x={1360} y={170} txt="WITH FILM" col={GRN} size={50} />
    <Tag tt={tt} at={4} x={1360} y={950} txt="STILL IN ONE PIECE" col={GRN} size={50} />
  </>;
}}</Stage>;

// 35 · el brazo: desde el vidrio lateral se dibuja el arco de alcance; si toca el pestillo, rojo
export const HArmreach: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const a = eio(tt, 1.4, 3.4);
  return <>
    <At x={900} y={560} s={0.95 * sp(tt, 0.1)}><Door w={380} glass="side" /></At>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d={`M${612} ${520} A300 300 0 0 1 ${612 + 300 * Math.sin(a * 1.6)} ${520 - 300 * Math.cos(a * 1.6) + 300}`} fill="none" stroke={a > 0.8 ? RED : AMB} strokeWidth={10} strokeDasharray="24 14" />
      <line x1={612} y1={520} x2={612 + 300 * Math.sin(a * 1.6)} y2={520 - 300 * Math.cos(a * 1.6) + 300} stroke={a > 0.8 ? RED : AMB} strokeWidth={34} strokeLinecap="round" opacity={0.75} />
    </svg>
    <Tag tt={tt} at={0.8} x={520} y={220} txt="THE GLASS" col={ICE} size={48} />
    <Tag tt={tt} at={3.6} x={1420} y={300} txt="CAN YOU REACH IT?" col={RED} size={56} />
  </>;
}}</Stage>;

// 36 · el garage: el portón grande sube con un botón y detrás está la puerta a la cocina con un pomo de 1986, sin cerrojo
export const HGaragepanel: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const up = eio(tt, 1.6, 4), zoom = eio(tt, 5, 7);
  return <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + 0.5 * zoom}) translate(${-160 * zoom}px, ${-40 * zoom}px)`, transformOrigin: "60% 50%" }}>
    <div style={{ position: "absolute", left: 420, top: 220, width: 1080, height: 660, background: "#1a1816", boxShadow: "inset 0 0 0 20px #8c4b3a" }}>
      <div style={{ position: "absolute", left: 640, top: 160, width: 230, height: 480, background: "#b59a76", boxShadow: "0 0 0 10px #d8d1c3" }}><div style={{ position: "absolute", right: 24, top: 230, width: 40, height: 40, borderRadius: "50%", background: `radial-gradient(circle at 35% 35%, #f3d98a, ${BRASS})` }} /></div>
    </div>
    <div style={{ position: "absolute", left: 440, top: 240, width: 1040, height: 620 * (1 - up), overflow: "hidden" }}>{Array.from({ length: 5 }, (_, i) => <div key={i} style={{ height: 124, background: "linear-gradient(180deg,#efeee9,#d6d4cd)", borderBottom: "4px solid #b9b6ae" }} />)}</div>
    <At x={300} y={560} s={sp(tt, 0.4)}><div style={{ width: 90, height: 140, borderRadius: 16, background: "#2b2e34", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 50, height: 50, borderRadius: "50%", background: tt > 1.3 && tt < 1.8 ? AMB : "#4a4d54" }} /></div></At>
    <Tag tt={tt} at={5.4} x={1000} y={300} txt="KNOB FROM 1986" col={RED} size={50} />
    <Tag tt={tt} at={6.2} x={1000} y={980} txt="NO DEADBOLT" col={RED} size={50} />
  </div>;
}}</Stage>;

// 37 · los grados: tres cerraduras en un podio; el 1 en lo más alto, el 3 «light duty» abajo
export const HGrades: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => <>
  {[[1, 960, 330, GRN], [2, 600, 450, AMB], [3, 1320, 570, DIM]].map(([g, x, top, c], i) => <React.Fragment key={i}>
    <div style={{ position: "absolute", left: (x as number) - 170, top: (top as number) + 200, width: 340, height: 900 - (top as number), background: "linear-gradient(180deg,#3a3d44,#24262b)", borderRadius: "12px 12px 0 0", transform: `translateY(${(1 - sp(tt, 0.2 + i * 0.3)) * 500}px)`, textAlign: "center", fontWeight: 900, fontSize: 120, color: c as string, paddingTop: 20 }}>{g}</div>
    <At x={x as number} y={(top as number) + 60} s={sp(tt, 0.9 + i * 0.3)}><Keypad w={80} ledOn={1} led={c as string} /></At></React.Fragment>)}
  <Tag tt={tt} at={2.4} x={960} y={120} txt="FRONT DOOR: GRADE 1 OR 2" col={TX} size={54} />
  <Tag tt={tt} at={3.4} x={1320} y={740} txt="LIGHT DUTY" col={DIM} size={44} />
</>}</Stage>;

// 38 · el pasillo de los cinco errores: cinco puertas; cada una se cierra (y prende verde) al nombrar su arreglo
export const HHallfive: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => <div style={{ position: "absolute", inset: 0, perspective: 1300 }}>
  {Array.from({ length: 5 }, (_, i) => {
    const sh = eio(tt, 1.2 + i * 2.2, 1.8 + i * 2.2), side = i % 2 ? 1 : -1, z = -i * 520;
    return <div key={i} style={{ position: "absolute", left: 960 + side * 360, top: 540, transform: `translate(-50%,-50%) translateZ(${z + 700 * eio(tt, 0, 12)}px) rotateY(${side * -70}deg)` }}>
      <div style={{ width: 300, height: 620, background: "#1a1816", boxShadow: `0 0 0 12px ${sh > 0.5 ? GRN : "#d8d1c3"}`, position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "#7a2f25", transformOrigin: "0 50%", transform: `rotateY(${-75 * (1 - sh)}deg)` }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: -110, textAlign: "center", fontWeight: 900, fontSize: 80, color: sh > 0.5 ? GRN : TX }}>{i + 1}</div></div></div>;
  })}
  <Tag tt={tt} at={0.4} x={960} y={110} txt="FIVE MISTAKES" col={TX} size={60} />
</div>}</Stage>;

// 39 · la cerradura que se deja ver por dentro: la carcasa se vuelve vidrio y adentro giran el motor y el pestillo
export const HGlasslock: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const g = eio(tt, 1.4, 3), rot = tt * 140, bolt = 0.5 + 0.5 * Math.sin(tt * 1.4);
  return <>
    <At x={960} y={540} s={1.3 * sp(tt, 0.1)}><div style={{ position: "relative", width: 460, height: 560 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 60, background: `rgba(40,42,48,${1 - 0.8 * g})`, border: `4px solid rgba(143,214,255,${g})`, boxShadow: "0 40px 80px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: 80, top: 90, width: 140, height: 140, borderRadius: "50%", border: `16px dashed ${AMB}`, transform: `rotate(${rot}deg)`, opacity: g }} />
      <div style={{ position: "absolute", left: 230, top: 130, width: 120, height: 60, borderRadius: 10, background: "#8a8d93", opacity: g }} />
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 90 + i * 42, top: 330, width: 34, height: 70, borderRadius: 8, background: GRN, opacity: g * 0.9 }} />)}
      <div style={{ position: "absolute", left: 340, top: 400, width: 60 + 140 * bolt, height: 50, borderRadius: 6, background: BRASS, opacity: 0.4 + 0.6 * g }} /></div></At>
    <Tag tt={tt} at={3.2} x={960} y={120} txt="SEE INSIDE IT" col={ICE} size={60} />
  </>;
}}</Stage>;

// 40 · la combinación escrita en la caja fuerte: la perilla gira y al costado está la combinación a marcador
export const HSafecombo: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const w = eio(tt, 2.2, 3.4);
  return <>
    <At x={900} y={560} s={sp(tt, 0.1)}><div style={{ width: 560, height: 600, borderRadius: 30, background: "linear-gradient(150deg,#4a4e57,#25272c)", boxShadow: "0 50px 90px rgba(0,0,0,.6), inset 0 0 0 16px #33363c", position: "relative" }}>
      <div style={{ position: "absolute", left: 160, top: 180, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(#9ea3ab,#5c6068)", transform: `rotate(${Math.sin(tt * 0.9) * 120}deg)`, boxShadow: "0 10px 20px rgba(0,0,0,.6)" }}>
        {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: 117, top: 6, width: 6, height: 24, background: "#222", transformOrigin: "3px 114px", transform: `rotate(${i * 30}deg)` }} />)}</div>
      <div style={{ position: "absolute", left: 360, top: 470, fontFamily: "'Permanent Marker', sans-serif", fontSize: 54, color: "#ffd60a", transform: "rotate(-8deg)", clipPath: `inset(0 ${100 - 100 * w}% 0 0)` }}>12-34-56</div></div></At>
    <Tag tt={tt} at={3.8} x={1500} y={420} txt="THEN IT'S" col={TX} size={56} />
    <Tag tt={tt} at={4.2} x={1500} y={510} txt="NOT A SAFE" col={RED} size={64} />
  </>;
}}</Stage>;

// 41 · cada uno su llave: cuatro ganchos con tarjetas de color; la de la limpiadora se va en una valija
export const HOwncodes: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const go = eio(tt, 5, 7.5), C = [["CLEANER", AMB], ["BROTHER-IN-LAW", ICE], ["NEIGHBOR", GRN], ["GRANDSON", "#d59cff"]];
  return <>
    <div style={{ position: "absolute", left: 300, top: 280, width: 1320, height: 30, borderRadius: 15, background: "#6b4a32" }} />
    {C.map(([n, c], i) => <At key={i} x={420 + i * 360 + (i === 0 ? 1400 * go : 0)} y={460 + (i === 0 ? -60 * Math.sin(Math.PI * go) : 0)} s={sp(tt, 0.3 + i * 0.3)} rot={3 * Math.sin(tt * 1.6 + i)}>
      <div style={{ width: 280, height: 220, borderRadius: 18, background: c as string, color: "#1d1f24", padding: 24, boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}><div style={{ fontWeight: 900, fontSize: 34 }}>{n}</div><div style={{ fontWeight: 900, fontSize: 70, marginTop: 30, letterSpacing: 8 }}>{["4071", "9316", "2258", "7704"][i]}</div></div></At>)}
    <Tag tt={tt} at={1.8} x={960} y={790} txt="EVERY PERSON, THEIR OWN" col={TX} size={56} />
    <Tag tt={tt} at={6} x={1500} y={170} txt="MOVED? CODE GONE" col={AMB} size={50} />
  </>;
}}</Stage>;

// 42 · la cuña: corte de la puerta y el piso; la puerta empuja y la cuña la frena (y la barra bajo el pomo)
export const HWedge: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const push = [2, 4, 6].map((a) => Math.sin(Math.PI * cl((tt - a) / 0.6))).reduce((x, y) => Math.max(x, y), 0);
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 860, height: 220, background: "linear-gradient(180deg,#6b4a32,#3e2a1c)" }} />
    <div style={{ position: "absolute", left: 820 + 14 * push, top: 200, width: 60, height: 660, background: "linear-gradient(90deg,#6e2a21,#7a2f25)", transform: `rotate(${-1.5 * push}deg)`, transformOrigin: "50% 100%" }} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d="M890 860 L1090 860 L890 800 Z" fill="#2b2b2b" /><line x1={890} y1={470} x2={1150} y2={860} stroke="#9ea3ab" strokeWidth={22} strokeLinecap="round" opacity={sp(tt, 3)} />
      {push > 0.1 && <path d={`M${560 - 40 * push} 560 L${780} 560`} stroke={RED} strokeWidth={22} />}</svg>
    <Tag tt={tt} at={0.8} x={1260} y={760} txt="DOOR WEDGE" col={AMB} size={50} />
    <Tag tt={tt} at={3.2} x={1360} y={440} txt="DOOR BAR" col={AMB} size={50} />
    <Tag tt={tt} at={6.8} x={600} y={160} txt="NO HOLES NEEDED" col={GRN} size={56} />
  </>;
}}</Stage>;

// 43 · la cámara mira, el interruptor cierra: pantalla partida, la cámara graba la puerta abierta; el interruptor la cierra
export const HCamvsswitch: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const off = eio(tt, 4, 4.5);
  return <>
    <At x={560} y={540} s={sp(tt, 0.2)}><div style={{ width: 640, height: 400, borderRadius: 20, background: "#0e1116", border: "6px solid #33363c", overflow: "hidden", position: "relative" }}>
      <div style={{ position: "absolute", left: 220, top: 60, width: 200, height: 340, background: "#3a1a16" }}><div style={{ position: "absolute", inset: 0, background: "#7a2f25", transformOrigin: "0 50%", transform: `perspective(700px) rotateY(${-55 * (1 - off)}deg)` }} /></div>
      <div style={{ position: "absolute", left: 20, top: 16, color: RED, fontWeight: 900, fontSize: 30 }}>● REC</div></div></At>
    <At x={1380} y={540} s={1.2 * sp(tt, 0.6)}><Toggle w={240} on={1 - off} col={RED} /></At>
    <Tag tt={tt} at={0.8} x={560} y={240} txt="CAMERA: SEES IT" col={TX} size={50} />
    <Tag tt={tt} at={4.6} x={1380} y={780} txt="SWITCH: STOPS IT" col={GRN} size={50} />
  </>;
}}</Stage>;

// 44 · el dueño: el llavero de la app pasa de la mano del que la instaló a la mano del abuelo
export const HOwner: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const p = eio(tt, 2, 4.2);
  return <>
    <At x={420} y={600} s={sp(tt, 0.2)}><Person s={2} col="#cfe0f0" /></At>
    <At x={1500} y={600} s={sp(tt, 0.4)}><Person s={2} col="#e8ddcb" /></At>
    <At x={560 + 800 * p} y={520 - 160 * Math.sin(Math.PI * p)} s={sp(tt, 0.8)} rot={20 * Math.sin(tt * 2)}><div style={{ position: "relative" }}><Phone w={150}><div style={{ textAlign: "center", paddingTop: 120, fontSize: 90 }}><div style={{ width: 80, height: 80, margin: "0 auto", borderRadius: 18, background: GRN }} /></div></Phone>
      <div style={{ position: "absolute", left: -40, top: -50, width: 70, height: 70, borderRadius: "50%", border: `10px solid ${BRASS}` }} /></div></At>
    <Tag tt={tt} at={0.6} x={420} y={240} txt="WHO SET IT UP" col={DIM} size={46} />
    <Tag tt={tt} at={4.4} x={1500} y={240} txt="YOU HOLD THE KEYS" col={GRN} size={54} />
  </>;
}}</Stage>;

// 45 · el domingo de 10 minutos: una esfera de 10 porciones; cada minuto se prende la suya con su objeto
export const HSunday10: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const its: { at: number }[] = h.items ?? [], L = ["AUTO-UNLOCK OFF", "AUTO-LOCK ON", "DELETE NAMES", "READ HISTORY", "WIPE KEYPAD", "SPOKEN PIN", "STRIKE PLATE"];
  const ats = L.map((_, i) => (its[i]?.at ?? h.at + 1 + i * 3.5) - h.at), cur = ats.filter((a) => tt >= a).length;
  return <>
    <At x={760} y={560} s={sp(tt, 0.1)}><svg width={640} height={640} viewBox="-320 -320 640 640">
      {Array.from({ length: 10 }, (_, i) => { const a0 = i * 36 * Math.PI / 180, a1 = (i + 1) * 36 * Math.PI / 180, on = i < Math.min(10, cur + (cur >= 7 ? Math.floor(cl((tt - ats[6] - 4) / 3) * 3) : 0));
        return <path key={i} d={`M0 0 L${300 * Math.sin(a0)} ${-300 * Math.cos(a0)} A300 300 0 0 1 ${300 * Math.sin(a1)} ${-300 * Math.cos(a1)} Z`} fill={on ? GRN : "#2a2d33"} stroke="#141518" strokeWidth={8} opacity={on ? 0.9 : 0.8} />; })}
      <circle r={120} fill="#141518" /><text y={24} textAnchor="middle" fill={TX} fontSize={70} fontWeight={900} fontFamily="sans-serif">{Math.min(10, Math.max(1, cur))}</text>
    </svg></At>
    {L.map((n, i) => tt >= ats[i] && <div key={i} style={{ position: "absolute", left: 1180, top: 210 + i * 96, opacity: cl((tt - ats[i]) * 3), transform: `translateX(${(1 - sp(tt, ats[i])) * 60}px)`, fontWeight: 900, fontSize: 46, color: i === cur - 1 ? GRN : DIM }}>{n}</div>)}
    <Tag tt={tt} at={0.6} x={760} y={120} txt="10 MINUTES ON SUNDAY" col={AMB} size={56} />
  </>;
}}</Stage>;

export const HEROES_B = { warnweeks: HWarnweeks, jump9v: HJump9v, patch: HPatch, rolodex: HRolodex, tuesdays: HTuesdays, expire: HExpire, potxray: HPotxray, domino: HDomino, nested: HNested, router: HRouter, filmglass: HFilmglass, armreach: HArmreach, garagepanel: HGaragepanel, grades: HGrades, hallfive: HHallfive, glasslock: HGlasslock, safecombo: HSafecombo, owncodes: HOwncodes, wedge: HWedge, camvsswitch: HCamvsswitch, owner: HOwner, sunday10: HSunday10 };

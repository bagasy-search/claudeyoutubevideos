// mar29b · componentes únicos 17-31. Mecanismos que no están en mar29a (ver D:/rtmp/mar29_COMPONENTES.md).
import React from "react";
import { AMB, DIM, GRN, H, HAND, Head, ICE, MARK, Photo, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

const C: React.FC<{ x?: number; y?: number; children: React.ReactNode }> = ({ x = 960, y = 560, children }) =>
  <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)" }}>{children}</div>;
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const rnd = (i: number) => { const x = Math.sin(i * 91.7 + 17.3) * 43758.5453; return x - Math.floor(x); };
const shadow = "0 50px 100px rgba(0,0,0,.65), 0 8px 18px rgba(0,0,0,.4)";

// 17 · la rueda de fecha: la alarma gira y en el dorso se lee el año; el contador de años corre hasta "10"
export const HDatewheel: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const r = eio(tt, 0.5, 2.0) * 180, yrs = Math.floor(10 * eio(tt, 2.4, 4.6));
  return <>
    <Head tt={tt} kick="TURN IT OVER" title="THE DATE ON THE BACK" col={AMB} />
    <C x={760} y={600}><div style={{ perspective: 1400 }}><div style={{ width: 420, height: 420, position: "relative", transformStyle: "preserve-3d", transform: `rotateY(${r}deg)` }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", backfaceVisibility: "hidden", background: "radial-gradient(circle at 40% 35%,#ffffff,#d9d9d4)", boxShadow: shadow, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: GRN, boxShadow: `0 0 30px ${GRN}` }} /></div>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "radial-gradient(circle,#efeee8,#c9c8c1)", boxShadow: shadow, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#2a2620", fontFamily: "Courier New, monospace" }}>
        <div style={{ fontSize: 26, fontWeight: 700 }}>MFG DATE</div><div style={{ fontSize: 72, fontWeight: 900 }}>2014</div><div style={{ fontSize: 22 }}>REPLACE BY 2021</div></div>
    </div></div></C>
    <div style={{ position: "absolute", left: 1180, top: 420, fontFamily: HAND, fontSize: 60, color: DIM }}>sensor life</div>
    <div style={{ position: "absolute", left: 1180, top: 490, fontWeight: 900, fontSize: 180, color: yrs >= 7 ? RED : TX }}>{yrs}<span style={{ fontSize: 60 }}> YRS</span></div>
    <div style={{ position: "absolute", left: 1180, top: 720, width: 520, height: 20, borderRadius: 10, background: "rgba(255,255,255,.12)" }}>
      <div style={{ width: `${Math.min(1, yrs / 10) * 100}%`, height: "100%", borderRadius: 10, background: yrs >= 7 ? RED : GRN }} />
      <div style={{ position: "absolute", left: "70%", top: -18, width: 4, height: 56, background: TX }} /></div>
    <Tag tt={tt} at={4.4} x={1540} y={830} txt="7-10 YEARS, THEN NEW" col={RED} size={40} />
  </>;
}}</Stage>;

// 18 · el cajón de la cocina: se abre de frente y adentro hay alarmas desenchufadas entre menús y gomitas
export const HDrawer: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const o = eio(tt, 0.5, 1.6);
  return <>
    <Head tt={tt} kick="WHERE THEY END UP" title="THE KITCHEN DRAWER" col={RED} />
    <div style={{ position: "absolute", left: 460, top: 300, width: 1000, height: 560, perspective: 1200 }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, bottom: 0, background: "linear-gradient(180deg,#3a2a1c,#22180f)", borderRadius: 12, transform: "rotateX(48deg)", transformOrigin: "bottom", overflow: "hidden", opacity: o }}>
        {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 120 + i * 280, top: 140 + (i % 2) * 70, width: 190, height: 190, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#fff,#cfcfc8)", transform: `rotate(${i * 40 - 30}deg) translateY(${(1 - phys(tt, 1.2 + i * 0.4, 6, 0.5)) * -200}px)` }}>
          <div style={{ position: "absolute", left: 80, top: 80, width: 30, height: 30, borderRadius: "50%", background: "#555" }} /></div>)}
        <div style={{ position: "absolute", left: 40, top: 40, width: 260, height: 70, background: "#f1e3b8", transform: "rotate(-8deg)" }} />
        <div style={{ position: "absolute", left: 700, top: 360, width: 120, height: 120, border: "8px solid #c8a35a", borderRadius: "50%" }} />
      </div>
      <div style={{ position: "absolute", left: -40, right: -40, bottom: -120 * o, height: 130, background: "linear-gradient(180deg,#8a6a48,#5e4630)", borderRadius: 10, boxShadow: shadow }}>
        <div style={{ position: "absolute", left: "45%", top: 50, width: 140, height: 24, borderRadius: 12, background: "#c9c2b5" }} /></div>
    </div>
    <Tag tt={tt} at={2.8} x={1580} y={360} txt="UNPLUGGED = USELESS" col={RED} size={42} />
  </>;
}}</Stage>;

// 19 · por debajo de la puerta: el humo gris del caño de escape se filtra por la rendija hacia la cocina
export const HUnderdoor: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => <>
  <Head tt={tt} kick="THE ATTACHED GARAGE" title="UNDER THE DOOR" col={RED} />
  <div style={{ position: "absolute", left: 900, top: 220, width: 60, height: 720, background: "linear-gradient(90deg,#4a3826,#7a5e40)" }} />
  <div style={{ position: "absolute", left: 300, top: 940, width: 600, height: 20, background: "#555" }} /><div style={{ position: "absolute", left: 960, top: 940, width: 700, height: 20, background: "#b8a98a" }} />
  <div style={{ position: "absolute", left: 340, top: 760, width: 420, height: 160, borderRadius: "60px 80px 20px 20px", background: "linear-gradient(180deg,#5b6878,#2e3742)", boxShadow: shadow }}>
    <div style={{ position: "absolute", right: -40, bottom: 20, width: 60, height: 22, borderRadius: 8, background: "#333" }} /></div>
  {Array.from({ length: 70 }, (_, i) => { const ph = (tt * 0.35 + rnd(i)) % 1, x = 820 + ph * 760, under = x > 880 && x < 980, y = under ? 920 : 920 - (x > 980 ? (x - 980) * 0.5 * rnd(i + 2) : 40 * rnd(i + 5));
    return <div key={i} style={{ position: "absolute", left: x, top: y, width: 60, height: 40, borderRadius: "50%", background: "rgba(170,170,175,.32)", filter: "blur(10px)", opacity: cl((tt - 0.8) * 1.5) }} />; })}
  <Tag tt={tt} at={1.4} x={600} y={300} txt="GARAGE" col={DIM} size={46} />
  <Tag tt={tt} at={2.0} x={1320} y={300} txt="YOUR KITCHEN" col={AMB} size={46} />
</>}</Stage>;

// 20 · el radio: desde el generador, anillos concéntricos hasta 20 ft; la casa queda afuera del último
export const HRadius: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const r = eio(tt, 0.6, 3.2);
  return <>
    <Head tt={tt} kick="THE GENERATOR" title="20 FEET OUT" col={AMB} />
    <div style={{ position: "absolute", left: 260, top: 360, width: 360, height: 420, background: "linear-gradient(180deg,#e9e3d5,#b9b1a1)", clipPath: "polygon(50% 0,100% 30%,100% 100%,0 100%,0 30%)", boxShadow: shadow }} />
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      {[1, 2, 3, 4].map((i) => <circle key={i} cx={1380} cy={640} r={i * 150 * r} fill="none" stroke={i === 4 ? GRN : "rgba(240,236,226,.35)"} strokeWidth={i === 4 ? 8 : 4} strokeDasharray={i === 4 ? "0" : "14 14"} />)}
      <line x1={1380} y1={640} x2={1380 - 600 * r} y2={640} stroke={GRN} strokeWidth={6} />
    </svg>
    <div style={{ position: "absolute", left: 1320, top: 590, width: 120, height: 100, borderRadius: 14, background: "linear-gradient(180deg,#e2a400,#a77700)", boxShadow: shadow }} />
    <div style={{ position: "absolute", left: 1380 - 300 * r, top: 590, transform: "translateX(-50%)", fontWeight: 900, fontSize: 64, color: GRN, opacity: cl((tt - 2.4) * 2) }}>{Math.round(20 * r)} FT</div>
    <Tag tt={tt} at={3.4} x={440} y={860} txt="WINDOWS SHUT" col={DIM} size={40} />
  </>;
}}</Stage>;

// 21 · el cable caliente: la regleta enchufada con la estufa; el cable pasa de gris a rojo desde el enchufe
export const HHotcord: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const heat = eio(tt, 0.8, 4.4);
  const d = "M 1500 520 C 1300 520, 1300 800, 1050 800 S 700 640, 520 760";
  return <>
    <Head tt={tt} kick="NUMBER EIGHT" title="NEVER A POWER STRIP" col={RED} />
    <div style={{ position: "absolute", left: 1460, top: 360, width: 260, height: 360, borderRadius: 30, background: "linear-gradient(180deg,#e9e7e0,#b9b6ad)", boxShadow: shadow }}>
      {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ position: "absolute", left: 30, right: 30, top: 50 + i * 54, height: 26, borderRadius: 13, background: `rgba(255,${120 - 80 * heat},40,${0.4 + 0.6 * heat})` }} />)}</div>
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <defs><linearGradient id="hc" x1="0" x2="1"><stop offset="0" stopColor="#3a3a3a" /><stop offset={1 - heat} stopColor="#3a3a3a" /><stop offset={Math.min(1, 1.15 - heat)} stopColor="#ff4a2a" /><stop offset="1" stopColor="#ff7a2a" /></linearGradient></defs>
      <path d={d} stroke="url(#hc)" strokeWidth={18} fill="none" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 ${20 * heat}px rgba(255,90,40,.9))` }} />
    </svg>
    <div style={{ position: "absolute", left: 380, top: 640, width: 220, height: 240, borderRadius: 18, background: "linear-gradient(180deg,#d9d6cd,#9e9a90)", boxShadow: shadow }} />
    <div style={{ position: "absolute", left: 1060, top: 560, width: 180, height: 120, borderRadius: 14, background: "#f1ead6", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 44, color: RED, opacity: cl(phys(tt, 3.6, 6, 0.6)) }}>1500 W</div>
    <Tag tt={tt} at={4.4} x={960} y={950} txt="STRAIGHT INTO THE WALL" col={GRN} size={44} />
  </>;
}}</Stage>;

// 22 · el anillo libre: un círculo de 3 ft se expande desde la estufa y empuja la manta, el diario y la cortina hacia afuera
export const HClearring: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const r = 120 + 230 * eio(tt, 0.8, 2.8);
  const obj = [{ a: -0.6, w: 180, hh: 120, c: "#8f3b3b", n: "BLANKET" }, { a: 2.1, w: 150, hh: 110, c: "#e8e3d4", n: "PAPERS" }, { a: 3.6, w: 80, hh: 260, c: "#7a8fa8", n: "CURTAIN" }];
  return <>
    <Head tt={tt} kick="THE SPACE HEATER" title="3 FEET CLEAR" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute" }}><ellipse cx={960} cy={680} rx={r * 1.3} ry={r * 0.55} fill="rgba(111,227,154,.08)" stroke={GRN} strokeWidth={6} strokeDasharray="20 14" /></svg>
    <div style={{ position: "absolute", left: 880, top: 520, width: 160, height: 200, borderRadius: 16, background: "linear-gradient(180deg,#ece6d8,#a8a090)", boxShadow: `${shadow}, 0 0 60px rgba(255,120,40,.35)` }}>
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 20, right: 20, top: 30 + i * 36, height: 12, borderRadius: 6, background: "#ff7a2a", boxShadow: "0 0 14px #ff7a2a" }} />)}</div>
    {obj.map((o, i) => { const R = Math.max(r + 70, 260); const x = 960 + Math.cos(o.a) * R * 1.3, y = 680 + Math.sin(o.a) * R * 0.55;
      return <div key={i} style={{ position: "absolute", left: x - o.w / 2, top: y - o.hh, width: o.w, height: o.hh, borderRadius: 10, background: o.c, boxShadow: shadow, display: "flex", alignItems: "flex-end", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "#1b1b1b", paddingBottom: 8, boxSizing: "border-box" }}>{o.n}</div>; })}
    <Tag tt={tt} at={3.0} x={960} y={960} txt="NOTHING ON TOP" col={GRN} size={44} />
  </>;
}}</Stage>;

// 23 · la nieve: el banco de nieve sube y tapa los dos caños blancos; una mano los despeja
export const HSnowdrift: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const up = eio(tt, 0.4, 2.4), clear = eio(tt, 3.2, 4.6), lvl = 440 * up * (1 - 0.75 * clear);
  return <>
    <Head tt={tt} kick="NUMBER NINE" title="THE PIPES OUTSIDE" col={ICE} />
    <div style={{ position: "absolute", left: 300, top: 220, width: 1320, height: 740, background: "repeating-linear-gradient(180deg,#9a8f80 0 58px,#86796a 58px 62px)" }} />
    {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 820 + i * 220, top: 620, width: 90, height: 90, borderRadius: "50%", background: "radial-gradient(circle,#1d1d1d 45%,#f4f4f2 48%)", boxShadow: shadow }} />)}
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <path d={`M 300 ${960 - lvl} C 700 ${900 - lvl}, 900 ${980 - lvl}, 1200 ${930 - lvl} S 1500 ${900 - lvl}, 1620 ${950 - lvl} L 1620 960 L 300 960 Z`} fill="#f4f8fb" />
    </svg>
    {Array.from({ length: 80 }, (_, i) => <div key={i} style={{ position: "absolute", left: 300 + rnd(i) * 1320, top: 220 + ((tt * 120 + rnd(i + 9) * 740) % 740), width: 8, height: 8, borderRadius: "50%", background: "#fff", opacity: 0.8 }} />)}
    <Tag tt={tt} at={2.2} x={1520} y={320} txt="BLOCKED = SHUTS OFF" col={RED} size={40} />
    <Tag tt={tt} at={4.4} x={480} y={320} txt="CLEAR THEM" col={GRN} size={44} />
  </>;
}}</Stage>;

// 24 · el tubito de drenaje: el lodo marrón lo llena y el flotante sube hasta cortar el furnace
export const HSlimetube: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const fill = eio(tt, 0.6, 3.6), flo = eio(tt, 3.0, 4.0);
  const d = "M 420 380 C 700 380, 700 700, 980 700 S 1300 520, 1480 520";
  return <>
    <Head tt={tt} kick="NUMBER TEN" title="THE LITTLE DRAIN TUBE" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <path d={d} stroke="rgba(220,240,255,.35)" strokeWidth={70} fill="none" strokeLinecap="round" />
      <path d={d} stroke="#7a5326" strokeWidth={50} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${fill} 1`} />
      {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={460 + i * 100} cy={380 + Math.sin(i) * 140 + 160} r={6} fill="#c79a5e" opacity={fill * 0.6} />)}
    </svg>
    <div style={{ position: "absolute", left: 1440, top: 330, width: 220, height: 380, borderRadius: 20, border: "6px solid rgba(220,240,255,.5)", background: "rgba(255,255,255,.05)", overflow: "hidden" }}>
      <div style={{ position: "absolute", bottom: 0, width: "100%", height: `${30 + 60 * flo}%`, background: "rgba(122,83,38,.8)" }} />
      <div style={{ position: "absolute", left: 60, bottom: `${26 + 60 * flo}%`, width: 100, height: 50, borderRadius: 25, background: "#f0f0ea" }} /></div>
    <div style={{ position: "absolute", left: 1550, top: 270, transform: "translateX(-50%)", fontWeight: 900, fontSize: 40, color: flo > 0.9 ? RED : DIM }}>{flo > 0.9 ? "SWITCH: OFF" : "FLOAT SWITCH"}</div>
    <Tag tt={tt} at={4.2} x={700} y={900} txt="VINEGAR · ONCE A YEAR" col={GRN} size={42} />
  </>;
}}</Stage>;

// 25 · la niebla de humedad: el aire se llena de gotas; el número sube de 30 a 45 % y "68 feels like 70"
export const HMist: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const p = eio(tt, 0.6, 3.6), hum = Math.round(lerp(30, 45, p));
  return <>
    <Head tt={tt} kick="NUMBER ELEVEN" title="DRY AIR FEELS COLD" col={ICE} />
    {Array.from({ length: Math.round(220 * p) }, (_, i) => <div key={i} style={{ position: "absolute", left: 200 + rnd(i) * 1520, top: 260 + ((rnd(i + 4) * 700 + tt * 18 * (1 + rnd(i))) % 700), width: 10 + rnd(i + 7) * 12, height: 10 + rnd(i + 7) * 12, borderRadius: "50%", background: "rgba(186,226,255,.35)", filter: "blur(2px)" }} />)}
    <C x={760} y={600}><div style={{ width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#fbfaf6,#d6d3ca)", boxShadow: shadow, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#2a2620" }}>
      <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 2 }}>HUMIDITY</div><div style={{ fontWeight: 900, fontSize: 120, color: hum >= 40 ? "#1f8a4c" : "#b3261e" }}>{hum}%</div></div></C>
    <div style={{ position: "absolute", left: 1160, top: 470, fontWeight: 900, fontSize: 110, color: TX }}>68°</div>
    <div style={{ position: "absolute", left: 1160, top: 610, fontFamily: HAND, fontSize: 60, color: GRN, opacity: cl((tt - 3.2) * 2) }}>feels like 70°</div>
  </>;
}}</Stage>;

// 26 · el árbol de conductos: el aire corre por las ramas; dos rejillas se cierran y la presión se escapa por las uniones
export const HDucts: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const shut = eio(tt, 2.0, 3.0);
  const br = [[960, 860, 960, 600], [960, 600, 560, 420], [960, 600, 960, 360], [960, 600, 1360, 420], [560, 420, 420, 300], [1360, 420, 1500, 300]];
  return <>
    <Head tt={tt} kick="NUMBER TWELVE" title="KEEP THE VENTS OPEN" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      {br.map(([a, b, c, d], i) => <line key={i} x1={a} y1={b} x2={c} y2={d} stroke="#9aa0a8" strokeWidth={40} strokeLinecap="round" />)}
      {br.map(([a, b, c, d], i) => { const blocked = (i === 4 || i === 5) && shut > 0.5; return Array.from({ length: 5 }, (_, j) => { const ph = (tt * 0.8 + j / 5) % 1; return <circle key={`${i}${j}`} cx={lerp(a, c, blocked ? ph * 0.5 : ph)} cy={lerp(b, d, blocked ? ph * 0.5 : ph)} r={8} fill={ICE} />; }); })}
      {[[560, 420], [1360, 420]].map(([x, y], i) => Array.from({ length: 8 }, (_, j) => { const ph = (tt * 1.2 + j / 8) % 1, a = j * 0.8; return <circle key={`l${i}${j}`} cx={x + Math.cos(a) * ph * 120} cy={y + Math.sin(a) * ph * 120} r={6} fill={RED} opacity={shut * (1 - ph)} />; }))}
    </svg>
    {[[420, 300], [1500, 300]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x - 70, top: y - 50, width: 140, height: 70, background: "#cfd3d8", borderRadius: 6, display: "flex", flexDirection: "column", justifyContent: "space-around", padding: 6, boxSizing: "border-box" }}>
      {[0, 1, 2].map((j) => <div key={j} style={{ height: lerp(4, 16, shut), background: "#555", borderRadius: 2 }} />)}</div>)}
    <Tag tt={tt} at={3.2} x={960} y={960} txt="LEAKS AT THE SEAMS" col={RED} size={42} />
  </>;
}}</Stage>;

// 27 · la escalera de Earl (1984): foto vieja que se tiñe sepia y la cita escrita a mano debajo
export const HLadder: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const q = "You don't fix furnaces. You keep families warm.", n = Math.floor(q.length * eio(tt, 1.6, 4.6));
  return <>
    <C x={700} y={540}><div style={{ background: "#efe6cf", padding: "22px 22px 70px", boxShadow: shadow, transform: `rotate(${-4 + 2 * phys(tt, 0.2, 5, 0.5)}deg)` }}>
      <Photo id="f_b_earl_escalera" w={560} h={640} r={2} z={1.04} style={{ filter: `sepia(${0.2 + 0.5 * eio(tt, 0.4, 1.6)}) contrast(.95)` }} />
      <div style={{ fontFamily: HAND, fontSize: 40, color: "#5a4a32", marginTop: 14, textAlign: "center" }}>Earl · 1984</div></div></C>
    <div style={{ position: "absolute", left: 1120, top: 380, width: 640, fontFamily: HAND, fontSize: 64, lineHeight: 1.25, color: TX }}>"{q.slice(0, n)}{n < q.length ? "▍" : "\""}</div>
  </>;
}}</Stage>;

// 28 · el teléfono: suena, vibra, y el tubo se cuelga solo sobre la palabra URGENT
export const HPhone: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const ring = tt < 2.6, hang = eio(tt, 2.6, 3.2);
  return <>
    <Head tt={tt} kick="THE PHONE SCAM" title="HANG UP" col={RED} />
    <C x={960} y={620}><div style={{ position: "relative", width: 520, height: 420, transform: ring ? `rotate(${Math.sin(tt * 40) * 3}deg)` : "none" }}>
      <div style={{ position: "absolute", left: 40, top: 140, width: 440, height: 260, borderRadius: "40px 40px 30px 30px", background: "linear-gradient(180deg,#d8cdb6,#a49778)", boxShadow: shadow }}>
        <div style={{ position: "absolute", left: 120, top: 60, width: 200, height: 70, borderRadius: 10, background: "#21291c", color: "#9fe08a", fontFamily: "Courier New, monospace", fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>UNKNOWN</div></div>
      <div style={{ position: "absolute", left: 20, top: lerp(-120, 100, hang), width: 480, height: 90, borderRadius: 45, background: "linear-gradient(180deg,#e6dcc5,#b3a687)", boxShadow: shadow, transform: `rotate(${lerp(-14, 0, hang)}deg)` }} />
    </div></C>
    {ring && [0, 1, 2].map((i) => { const ph = (tt * 1.6 + i / 3) % 1; return <div key={i} style={{ position: "absolute", left: 960 - 300 - ph * 120, top: 300, fontSize: 60, color: AMB, opacity: 1 - ph }}>(</div>; })}
    <div style={{ position: "absolute", left: 1360, top: 380, fontWeight: 900, fontSize: 64, color: RED, textDecoration: hang > 0.5 ? "line-through" : "none", opacity: 0.9 }}>"URGENT"</div>
    <Tag tt={tt} at={3.4} x={1460} y={500} txt="CALL YOUR OWN TECH" col={GRN} size={40} />
  </>;
}}</Stage>;

// 29 · el certificado falso: se rompe en dos mitades que caen con peso
export const HCertificate: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const tr = phys(tt, 2.2, 3, 0.2), fall = Math.max(0, tt - 2.2) ** 2 * 120;
  const half = (side: number) => <div style={{ position: "absolute", left: 560, top: 300, width: 800, height: 520, clipPath: side < 0 ? "polygon(0 0,52% 0,47% 30%,53% 55%,46% 80%,50% 100%,0 100%)" : "polygon(52% 0,100% 0,100% 100%,50% 100%,46% 80%,53% 55%,47% 30%)", transform: `translate(${side * 60 * tr}px, ${fall}px) rotate(${side * 8 * tr}deg)`, background: "#f6efd9", border: "14px double #b08a3a", boxSizing: "border-box", boxShadow: shadow, textAlign: "center", color: "#3a2f1c", paddingTop: 70 }}>
    <div style={{ fontFamily: MARK, fontSize: 64 }}>Certified</div><div style={{ fontWeight: 900, fontSize: 40, letterSpacing: 4, marginTop: 16 }}>"MASTER TECHNICIAN"</div>
    <div style={{ marginTop: 70, fontSize: 26 }}>Printed at home · no license no.</div></div>;
  return <>
    <Head tt={tt} kick="ASK FOR THE LICENSE" title="NOT A PRINTOUT" col={RED} />
    {half(-1)}{half(1)}
    <Tag tt={tt} at={3.2} x={960} y={960} txt="CHECK THE STATE NUMBER" col={GRN} size={42} />
  </>;
}}</Stage>;

// 30 · los quemadores: se encienden en fila uno por uno, llamas azules parejas
export const HBurners: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => <>
  <Head tt={tt} kick="WHAT HEALTHY LOOKS LIKE" title="EVEN BLUE FLAMES" col={ICE} />
  <div style={{ position: "absolute", left: 420, top: 700, width: 1080, height: 70, borderRadius: 14, background: "linear-gradient(180deg,#7d8188,#3e4147)", boxShadow: shadow }} />
  {Array.from({ length: 6 }, (_, i) => { const on = cl((tt - 0.8 - i * 0.45) * 3); return <div key={i} style={{ position: "absolute", left: 480 + i * 175, top: 700 - 220 * on, width: 90, height: 220 * on, borderRadius: "50% 50% 40% 40% / 70% 70% 30% 30%", background: "radial-gradient(ellipse at 50% 80%, #e8f6ff 0%, #5fb8ff 35%, rgba(40,90,255,.4) 70%, transparent 80%)", transform: `scaleX(${1 + 0.05 * Math.sin(tt * 12 + i)})`, filter: "blur(1px)" }} />; })}
  <Tag tt={tt} at={3.8} x={1500} y={420} txt="YELLOW = CALL" col={AMB} size={42} />
</>}</Stage>;

// 31 · el imán de la heladera: cae y deja pegada la tarjeta del técnico entre los dibujos
export const HMagnet: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const d = phys(tt, 0.6, 7, 0.45);
  return <>
    <Head tt={tt} kick="ONE NUMBER" title="ON THE FRIDGE" col={GRN} />
    <div style={{ position: "absolute", left: 560, top: 180, width: 800, height: 860, borderRadius: 30, background: "linear-gradient(90deg,#d9dcdf,#f3f5f6 50%,#c9ccd0)", boxShadow: shadow }}>
      {[[60, 80, -8, "#ffd23a"], [480, 120, 6, "#8fd3ff"], [90, 520, 4, "#ff9fb2"], [520, 560, -5, "#b8f0a0"]].map(([x, y, r, c], i) => <div key={i} style={{ position: "absolute", left: x as number, top: y as number, width: 220, height: 180, background: c as string, transform: `rotate(${r}deg)`, borderRadius: 6, opacity: 0.85 }} />)}
      <div style={{ position: "absolute", left: 250, top: 300 - (1 - d) * 500, width: 320, height: 190, background: "#fbfaf6", boxShadow: "0 12px 26px rgba(0,0,0,.35)", transform: `rotate(${(1 - d) * 20 - 2}deg)`, padding: 22, boxSizing: "border-box", color: "#2a2620" }}>
        <div style={{ fontWeight: 900, fontSize: 30 }}>YOUR HVAC TECH</div><div style={{ fontFamily: "Courier New, monospace", fontSize: 30, marginTop: 20 }}>(937) ···-····</div>
        <div style={{ position: "absolute", left: 130, top: -30, width: 60, height: 60, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#ff6a5a,#b3261e)", boxShadow: "0 8px 14px rgba(0,0,0,.4)" }} /></div>
    </div>
  </>;
}}</Stage>;

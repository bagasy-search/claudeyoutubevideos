// rk29a · componentes únicos 24-45 (cada uno UNA vez en toda la tanda; registro en D:/rtmp/rk29_COMPONENTES.md).
import React from "react";
import { H, Stage, Tag, phys, cl, eio, MARK, HAND, TX, DIM } from "./hkit";
import { Fob, Waves, Pouch, Coin, CarTop, Plan, AMB, RED, ICE, GRN } from "./rkdraw";

type P = { t: number; h: H };
const rnd = (i: number) => { const x = Math.sin(i * 91.7 + 17.3) * 43758.5453; return x - Math.floor(x); };
const At: React.FC<{ x: number; y: number; s?: number; rot?: number; o?: number; z?: number; children: React.ReactNode }> = ({ x, y, s = 1, rot = 0, o = 1, z, children }) => (
  <div style={{ position: "absolute", left: x, top: y, zIndex: z, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, opacity: o }}>{children}</div>
);
const pop = (tt: number, a: number) => cl(phys(tt, a));

// 24 · dos maneras de hablar: el botón manda UN golpe y se calla; la escucha late todo el tiempo
export const HChannels: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const press = tt > 1.2 && tt < 1.5, burst = cl((tt - 1.3) / 1.4);
  return <>
    <div style={{ position: "absolute", left: 958, top: 120, width: 4, height: 840, background: "rgba(247,244,238,.25)" }} />
    <At x={480} y={520} s={pop(tt, 0.1)}><div style={{ position: "relative" }}><Fob w={200} led={press ? 1 : 0} />
      <div style={{ position: "absolute", left: 64, top: 74, width: 72, height: 36, borderRadius: 18, background: press ? AMB : "transparent", opacity: 0.7 }} /></div></At>
    {burst > 0 && burst < 1 && <div style={{ position: "absolute", left: 480, top: 420, width: 60 + 700 * burst, height: 60 + 700 * burst, borderRadius: "50%", border: `8px solid ${AMB}`, transform: "translate(-50%,-50%)", opacity: 1 - burst }} />}
    <At x={1440} y={520} s={pop(tt, 0.4)}><Fob w={200} led={0.4 + 0.4 * Math.sin(tt * 5)} /></At>
    <Waves x={1440} y={430} k={tt * 0.6} n={5} r={360} col={ICE} op={0.85} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d={Array.from({ length: 60 }, (_, i) => { const x = 160 + i * 10.6, y = 900 - (i > 10 && i < 16 && tt > 1.3 ? 110 : 0); return `${i ? "L" : "M"}${x} ${y}`; }).join(" ")} fill="none" stroke={AMB} strokeWidth={6} opacity={0.9} />
      <path d={Array.from({ length: 60 }, (_, i) => `${i ? "L" : "M"}${1120 + i * 10.6} ${900 - 60 * Math.abs(Math.sin(i * 0.5 - tt * 4))}`).join(" ")} fill="none" stroke={ICE} strokeWidth={6} />
    </svg>
    <Tag tt={tt} at={0.4} x={480} y={170} txt="BUTTON: ONE BURST" col={AMB} size={46} />
    <Tag tt={tt} at={0.8} x={1440} y={170} txt="LISTENING: ALWAYS ON" col={ICE} size={46} />
  </>;
}}</Stage>;

// 25 · la manija no abre: la mano tira, la puerta queda trabada y el tablero dice que no encuentra la llave
export const HHandle: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const pulls = [2.0, 4.2, 6.4].map((a) => Math.max(0, Math.sin(cl((tt - a) / 0.6) * Math.PI))), pull = Math.max(...pulls), msg = cl((tt - 2.6) / 0.4);
  return <>
    <div style={{ position: "absolute", left: 240, top: 300, width: 1100, height: 520, borderRadius: "40px 120px 30px 30px", background: "linear-gradient(170deg,#d5d8dc,#9aa0a8 60%,#7d838a)", boxShadow: "0 50px 90px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 60, top: 40, width: 980, height: 200, borderRadius: "20px 100px 10px 10px", background: "linear-gradient(#1c2430,#2a3442)" }} />
      <div style={{ position: "absolute", left: 640, top: 320, width: 260, height: 70, borderRadius: 35, background: "#6d7178", boxShadow: "inset 0 6px 12px rgba(0,0,0,.4)" }} />
      <div style={{ position: "absolute", left: 650, top: 326, width: 240, height: 58, borderRadius: 29, background: "linear-gradient(#e6e8eb,#a4a9b0)", transformOrigin: "0 50%", transform: `perspective(600px) rotateY(${-22 * pull}deg)` }} />
    </div>
    <div style={{ position: "absolute", left: 700 + 30 * pull, top: 640, width: 220, height: 170, borderRadius: "80px 60px 50px 70px", background: "linear-gradient(#e7b994,#c88b66)", boxShadow: "0 20px 30px rgba(0,0,0,.4)", opacity: eio(tt, 0.6, 1.4) }} />
    <div style={{ position: "absolute", left: 1400, top: 340, width: 400, height: 230, borderRadius: 26, background: "#07090d", border: "6px solid #2a2c31", boxShadow: "0 30px 60px rgba(0,0,0,.6)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: msg }}>
      <div style={{ fontFamily: MARK, fontSize: 52, color: AMB, lineHeight: 1 }}>KEY NOT</div><div style={{ fontFamily: MARK, fontSize: 52, color: AMB }}>DETECTED</div>
    </div>
    <Tag tt={tt} at={2.4} x={790} y={220} txt="STAYS LOCKED" col={GRN} size={56} />
  </>;
}}</Stage>;

// 26 · la costura: una lupa pasa por la bolsa barata, en la costura hay un hueco y por ahí se escapa la señal
export const HSeamLeak: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const lx = 700 + 360 * eio(tt, 0.6, 2.6), found = cl((tt - 2.7) / 0.4);
  return <>
    <At x={960} y={560} s={2.2}><Pouch w={300} lining={1} /></At>
    <div style={{ position: "absolute", left: 1060, top: 300, width: 6, height: 560, background: "repeating-linear-gradient(#c9ced4 0 18px, transparent 18px 30px)" }} />
    <div style={{ position: "absolute", left: 1052, top: 600, width: 24, height: 60, background: "#000", opacity: found }} />
    {found > 0 && <Waves x={1064} y={630} k={tt * 0.8} n={3} r={620} col={ICE} ang={0} spread={30} />}
    <div style={{ position: "absolute", left: lx, top: 630, width: 300, height: 300, borderRadius: "50%", border: "18px solid #2b2b2f", background: "rgba(220,235,255,.12)", transform: "translate(-50%,-50%)", boxShadow: "0 30px 60px rgba(0,0,0,.6), inset 0 0 40px rgba(255,255,255,.25)" }}>
      <div style={{ position: "absolute", left: 230, top: 230, width: 40, height: 200, background: "#2b2b2f", borderRadius: 20, transform: "rotate(-45deg)", transformOrigin: "50% 0" }} /></div>
    <div style={{ position: "absolute", left: 420, top: 260, transform: `rotate(-8deg) scale(${pop(tt, 3.4)})`, padding: "14px 30px", background: "#f1e7c8", color: "#3a2f25", fontFamily: MARK, fontSize: 70, borderRadius: 8, boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>$15</div>
    <Tag tt={tt} at={2.9} x={1300} y={900} txt="A GAP IN THE SEAM" col={RED} size={50} />
  </>;
}}</Stage>;

// 27 · cuatro guiños: LOCK sostenido, UNLOCK dos veces, la luz cuenta 1-2-3-4 y la llave se duerme
export const HBlink4: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const hold = tt > 0.8 && tt < 3.4, u1 = tt > 3.8 && tt < 4.1, u2 = tt > 4.5 && tt < 4.8;
  const blinks = [5.6, 6.3, 7.0, 7.7], n = blinks.filter((b) => tt > b).length, on = blinks.some((b) => tt > b && tt < b + 0.3);
  const sleep = cl((tt - 8.4) / 1.2);
  return <>
    <At x={960} y={520} s={2.1 * pop(tt, 0.1)}><div style={{ position: "relative" }}><Fob w={220} led={on ? 1 : 0} dim={sleep * 0.5} />
      <div style={{ position: "absolute", left: 70, top: 79, width: 80, height: 40, borderRadius: 20, background: AMB, opacity: hold ? 0.75 : 0 }} />
      <div style={{ position: "absolute", left: 70, top: 123, width: 80, height: 40, borderRadius: 20, background: ICE, opacity: u1 || u2 ? 0.75 : 0 }} /></div></At>
    {hold && <svg width={300} height={300} style={{ position: "absolute", left: 1300, top: 300 }}><circle cx={150} cy={150} r={110} fill="none" stroke="rgba(247,244,238,.2)" strokeWidth={16} /><circle cx={150} cy={150} r={110} fill="none" stroke={AMB} strokeWidth={16} strokeDasharray={691} strokeDashoffset={691 * (1 - cl((tt - 0.8) / 2.6))} transform="rotate(-90 150 150)" strokeLinecap="round" /></svg>}
    <div style={{ position: "absolute", left: 360, top: 820, display: "flex", gap: 40 }}>
      {[1, 2, 3, 4].map((i) => <div key={i} style={{ width: 110, height: 110, borderRadius: "50%", background: n >= i ? RED : "rgba(247,244,238,.1)", boxShadow: n >= i ? `0 0 40px ${RED}` : "none", fontFamily: MARK, fontSize: 64, color: TX, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${n >= i ? 1 + 0.2 * cl(1 - (tt - blinks[i - 1]) * 3) : 0.8})` }}>{i}</div>)}
    </div>
    <Tag tt={tt} at={0.9} x={1450} y={250} txt="HOLD LOCK" col={AMB} size={44} />
    <Tag tt={tt} at={3.8} x={1450} y={700} txt="UNLOCK TWICE" col={ICE} size={44} />
    <Tag tt={tt} at={8.5} x={1450} y={880} txt="ASLEEP" col={GRN} size={60} />
  </>;
}}</Stage>;

// 28 · la llave quieta se duerme: un reloj de quietud da la vuelta; cada vez que se mueve, vuelve a cero
export const HStill: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const bump = tt > 2.6 && tt < 3.0, base = tt < 3.0 ? cl(tt / 4) : cl((tt - 3.0) / 5), sleep = cl((tt - 8.0) / 0.8);
  return <>
    <div style={{ position: "absolute", left: 360, top: 700, width: 1200, height: 40, background: "linear-gradient(#8a5f33,#5e3f20)", borderRadius: 8, boxShadow: "0 30px 50px rgba(0,0,0,.5)" }} />
    <At x={960 + (bump ? 18 * Math.sin(tt * 60) : 0)} y={590} rot={90}><Fob w={170} led={sleep > 0 ? 0 : 0.35} dim={sleep * 0.45} /></At>
    <svg width={520} height={520} style={{ position: "absolute", left: 700, top: 70 }}><circle cx={260} cy={260} r={200} fill="none" stroke="rgba(247,244,238,.15)" strokeWidth={22} />
      <circle cx={260} cy={260} r={200} fill="none" stroke={sleep > 0 ? GRN : ICE} strokeWidth={22} strokeDasharray={1257} strokeDashoffset={1257 * (1 - base)} transform="rotate(-90 260 260)" strokeLinecap="round" /></svg>
    {sleep > 0 && [0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 1040 + i * 50, top: 470 - i * 60 - 30 * ((tt * 0.6 + i * 0.3) % 1), fontFamily: HAND, fontSize: 50 + i * 16, color: GRN, opacity: sleep * (1 - ((tt * 0.6 + i * 0.3) % 1)) }}>z</div>)}
    {bump && <Tag tt={tt} at={2.6} x={960} y={860} txt="MOVED: BACK TO ZERO" col={RED} size={44} />}
    <Tag tt={tt} at={8.2} x={960} y={860} txt="STILL KEY SLEEPS" col={GRN} size={56} />
  </>;
}}</Stage>;

// 29 · los comentarios: las tarjetas de ustedes caen sobre la mesa y la respuesta de Ray se apoya encima
export const HComments: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const cards: [string, string, number, number, number, number][] = [["@dale_in_tulsa", "Didn't work on my Honda.", 0.4, 520, 360, -5], ["@marcy.k", "Mine still opens the car!", 1.4, 1320, 330, 4], ["@ok_grandpa", "Which button do I hold?", 2.4, 760, 640, 3]];
  const rep = pop(tt, 4.4);
  return <>
    {cards.map(([u, m, a, x, y, r], i) => { const s = pop(tt, a); return <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) translateY(${(1 - s) * -300}px) rotate(${r * s}deg)`, opacity: cl(s * 2), width: 560, padding: "26px 32px", background: "#fbfaf6", borderRadius: 18, boxShadow: "0 30px 60px rgba(0,0,0,.5)", fontFamily: HAND }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}><div style={{ width: 54, height: 54, borderRadius: "50%", background: ["#d9644a", "#3f6fb6", "#6b8f3a"][i] }} /><div style={{ fontWeight: 700, fontSize: 30, color: "#555" }}>{u}</div></div>
      <div style={{ fontSize: 44, color: "#1d1d1f", marginTop: 12, fontWeight: 700 }}>{m}</div></div>; })}
    <div style={{ position: "absolute", left: 1300, top: 720, transform: `translate(-50%,-50%) scale(${rep}) rotate(-2deg)`, width: 600, padding: "26px 32px", background: "#fff4d6", borderRadius: 18, border: `5px solid ${AMB}`, boxShadow: "0 40px 70px rgba(0,0,0,.55)", fontFamily: HAND }}>
      <div style={{ fontWeight: 700, fontSize: 30, color: "#8a5a10" }}>Ray Kessler · reply</div>
      <div style={{ fontSize: 44, color: "#1d1d1f", marginTop: 10, fontWeight: 700 }}>Honda wants a different sleep. Here it is.</div></div>
  </>;
}}</Stage>;

// 30 · el microondas: la llave adentro, la puerta cierra; el botón de encender queda tachado y la junta pierde
export const HMicrowave: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const door = eio(tt, 0.8, 1.8), cross = eio(tt, 2.6, 3.2), leak = cl((tt - 4.4) / 0.4);
  return <>
    <div style={{ position: "absolute", left: 460, top: 260, width: 1000, height: 580, borderRadius: 30, background: "linear-gradient(#e6e8eb,#b9bec5)", boxShadow: "0 50px 90px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 50, top: 50, width: 640, height: 480, borderRadius: 16, background: "#1a1d22", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 220, top: 220, transform: "rotate(80deg) scale(.6)" }}><Fob w={200} /></div>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle, transparent 2px, rgba(10,12,16,.55) 3px)", backgroundSize: "14px 14px", opacity: door }} /></div>
      <div style={{ position: "absolute", left: 50, top: 50, width: 640, height: 480, borderRadius: 16, border: "14px solid #9aa0a8", transformOrigin: "0 50%", transform: `perspective(1200px) rotateY(${-75 * (1 - door)}deg)`, background: door < 0.9 ? "rgba(200,220,240,.08)" : "transparent" }} />
      <div style={{ position: "absolute", left: 750, top: 60, width: 200, height: 460, borderRadius: 14, background: "#2a2c31" }}>
        <div style={{ margin: "40px auto 0", width: 150, height: 70, borderRadius: 10, background: "#081a10", fontFamily: MARK, fontSize: 46, color: GRN, textAlign: "center", lineHeight: "70px" }}>0:00</div>
        <div style={{ position: "relative", margin: "60px auto 0", width: 130, height: 130, borderRadius: "50%", background: "#3d4148", border: "6px solid #60646c" }}>
          <div style={{ position: "absolute", left: -20, top: 60, width: 170 * cross, height: 14, background: RED, transform: "rotate(45deg)", transformOrigin: "0 50%", boxShadow: `0 0 20px ${RED}` }} />
          <div style={{ position: "absolute", left: -20, top: 60, width: 170 * cross, height: 14, background: RED, transform: "rotate(-45deg) translateY(0)", transformOrigin: "100% 50%", marginLeft: -0 }} /></div></div>
    </div>
    {leak > 0 && <Waves x={1150} y={300} k={tt * 0.8} n={3} r={340} col={ICE} ang={-60} spread={40} op={leak} />}
    <Tag tt={tt} at={3.0} x={1310} y={180} txt="NEVER TURN IT ON" col={RED} size={56} />
    <Tag tt={tt} at={4.6} x={480} y={920} txt="AND THE SEAL LEAKS" col={TX} size={44} />
  </>;
}}</Stage>;

// 31 · la escalera de lo que bloquea: papel aluminio, lata con tapa, bolsa probada, sin pila; cuánto se escapa por escalón
export const HLadder: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const st: [string, number, string][] = [["FOIL", 0.75, "#c9ced4"], ["TIN, TIGHT LID", 0.42, "#9aa0a8"], ["TESTED POUCH", 0.12, "#2a2b30"], ["NO BATTERY", 0, GRN]];
  return <>
    {st.map(([n, leak, col], i) => { const s = pop(tt, 0.4 + i * 0.9), x = 300 + i * 400, y = 860 - i * 150;
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: 360, transform: `translateY(${(1 - s) * 300}px)`, opacity: cl(s * 2) }}>
        <div style={{ height: 1080 - y, background: "linear-gradient(#5e3f20,#3a2716)", borderTop: "14px solid #8a5f33", borderRadius: 8 }} />
        <div style={{ position: "absolute", left: 90, top: -170, width: 180, height: 150, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          {i < 2 ? <div style={{ width: 150, height: i ? 130 : 70, borderRadius: i ? 14 : "50% 40% 45% 55%", background: `linear-gradient(135deg,#fff,${col})`, boxShadow: "0 12px 20px rgba(0,0,0,.5)" }} /> : i === 2 ? <div style={{ transform: "scale(.5)", transformOrigin: "50% 100%" }}><Pouch w={260} /></div> : <Coin d={110} label="OFF" />}</div>
        {leak > 0 && <Waves x={180} y={-90} k={tt * 0.7 + i * 0.2} n={3} r={60 + 380 * leak} col={ICE} op={0.75} />}
        <div style={{ position: "absolute", left: 0, right: 0, top: 30, textAlign: "center", fontWeight: 900, fontSize: 32, color: TX, letterSpacing: 2 }}>{n}</div>
      </div>; })}
    <Tag tt={tt} at={4.4} x={480} y={160} txt="LESS LEAKS, HIGHER UP" col={GRN} size={48} />
  </>;
}}</Stage>;

// 32 · las paredes no son iguales: ladrillo, madera, durlock; la onda atraviesa cada una y sale más o menos fuerte
export const HWalls: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const w: [string, string, number][] = [["BRICK", "repeating-linear-gradient(0deg,#9a3e2a 0 40px,#d8cbb8 40px 46px)", 0.35], ["WOOD", "repeating-linear-gradient(90deg,#b98a55 0 30px,#9a6c3c 30px 34px)", 0.7], ["DRYWALL", "linear-gradient(90deg,#efeae0,#d9d3c6)", 0.92]];
  return <>{w.map(([n, bg, keep], i) => { const y = 200 + i * 280, s = pop(tt, 0.3 + i * 0.5);
    return <div key={i} style={{ opacity: cl(s * 2) }}>
      <div style={{ position: "absolute", left: 300, top: y, width: 140, height: 50, borderRadius: 25, background: "#15161a", display: "none", transform: `scale(${s})` }} />
      <div style={{ position: "absolute", left: 900, top: y - 90, width: 90, height: 230, background: bg, boxShadow: "0 20px 40px rgba(0,0,0,.5)" }} />
      <svg width={1920} height={260} style={{ position: "absolute", left: 0, top: y - 105 }}>
        {Array.from({ length: 4 }, (_, j) => { const f = ((tt * 0.5 + j / 4) % 1), x = 460 + f * 1300, a = x < 900 ? 1 : keep, amp = x < 900 ? 70 : 70 * keep;
          return <path key={j} d={`M${x} ${130 - amp} Q${x + 40} 130 ${x} ${130 + amp}`} fill="none" stroke={ICE} strokeWidth={8 * a} opacity={(1 - f) * a + 0.15} />; })}
      </svg>
      <div style={{ position: "absolute", right: 1920 - 870, top: y + 2, fontWeight: 900, fontSize: 46, color: TX, letterSpacing: 3 }}>{n}</div>
      <div style={{ position: "absolute", left: 1600, top: y - 20, fontFamily: MARK, fontSize: 70, color: keep > 0.8 ? RED : keep > 0.5 ? AMB : GRN }}>{Math.round(keep * 100)}</div>
    </div>; })}
    <Tag tt={tt} at={2.2} x={1640} y={150} txt="SIGNAL LEFT" col={TX} size={44} />
  </>;
}}</Stage>;

// 33 · siguen casadas: un hilo de luz va del cajón hasta la camioneta lejos; se estira, se curva, nunca se corta
export const HMarried: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const suvX = 1500 + 200 * eio(tt, 2, 7), suvY = 640 - 120 * eio(tt, 2, 7), sag = 160 + 80 * Math.sin(tt * 1.3), drawn = eio(tt, 0.6, 2.0);
  const d = `M430 700 Q${(430 + suvX) / 2} ${700 + sag} ${suvX} ${suvY}`;
  return <>
    <div style={{ position: "absolute", left: 230, top: 680, width: 400, height: 170, background: "linear-gradient(#c79a63,#9a6c3c)", borderRadius: 10, boxShadow: "inset 0 0 0 16px #7a522b, 0 30px 60px rgba(0,0,0,.6)" }} />
    <At x={430} y={700} rot={70}><Fob w={130} led={0.5 + 0.5 * Math.sin(tt * 4)} /></At>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={d} fill="none" stroke={AMB} strokeWidth={8} strokeDasharray={2400} strokeDashoffset={2400 * (1 - drawn)} style={{ filter: `drop-shadow(0 0 14px ${AMB})` }} />
      {drawn >= 1 && <path d={d} fill="none" stroke="#fff" strokeWidth={3} strokeDasharray="10 90" strokeDashoffset={-tt * 200} />}</svg>
    <At x={suvX} y={suvY} s={0.9 - 0.25 * eio(tt, 2, 7)} rot={90}><CarTop w={170} col="#3a3d44" /></At>
    <Tag tt={tt} at={2.4} x={960} y={200} txt="STILL PAIRED" col={AMB} size={70} />
  </>;
}}</Stage>;

// 34 · borrar la perdida: la memoria del auto tiene casilleros de llaves; uno se tacha y se vacía
export const HErase: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const sweep = eio(tt, 2.4, 3.4), gone = cl((tt - 3.4) / 0.6);
  return <>
    <div style={{ position: "absolute", left: 360, top: 240, width: 1200, height: 600, borderRadius: 30, background: "#0b0f15", border: "8px solid #2a2f38", boxShadow: "0 50px 90px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 50, top: 30, fontFamily: MARK, fontSize: 48, color: ICE, letterSpacing: 4 }}>KEY MEMORY</div>
      {[0, 1, 2, 3].map((i) => { const lost = i === 2, s = pop(tt, 0.3 + i * 0.3);
        return <div key={i} style={{ position: "absolute", left: 50 + i * 280, top: 140, width: 250, height: 380, borderRadius: 20, border: `4px solid ${lost && gone > 0 ? RED : "#3a4250"}`, background: "#121924", transform: `scale(${s})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {i < 3 && <div style={{ transform: "scale(.55)", opacity: lost ? 1 - gone : 1 }}><Fob w={200} /></div>}
          {i === 3 && <div style={{ fontFamily: MARK, fontSize: 70, color: "#3a4250" }}>+</div>}
          {lost && <div style={{ position: "absolute", left: 20, top: 180, width: 210 * sweep, height: 16, background: RED, transform: "rotate(-40deg)", boxShadow: `0 0 20px ${RED}` }} />}
          {lost && gone > 0 && <div style={{ position: "absolute", bottom: 20, fontWeight: 900, fontSize: 30, color: RED, opacity: gone }}>ERASED</div>}
        </div>; })}
    </div>
    <Tag tt={tt} at={3.8} x={960} y={930} txt="THE CAR FORGETS IT" col={TX} size={50} />
  </>;
}}</Stage>;

// 35 · vaciar todos los cajones: las llaves caen en montón y vuelan a tres bandejas: auto, casa, ni idea
export const HSort: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const trays: [string, string][] = [["CAR", AMB], ["HOUSE", ICE], ["NO IDEA", RED]];
  return <>
    {trays.map(([n, c], i) => <div key={i} style={{ position: "absolute", left: 380 + i * 440, top: 800, width: 380, height: 150, borderRadius: "0 0 30px 30px", background: "linear-gradient(#4a4c52,#2f3136)", borderTop: `10px solid ${c}`, boxShadow: "0 30px 50px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", bottom: -60, left: 0, right: 0, textAlign: "center", fontWeight: 900, fontSize: 36, color: c, letterSpacing: 3 }}>{n}</div></div>)}
    {Array.from({ length: 12 }, (_, i) => {
      const fall = phys(tt, 0.2 + i * 0.05, 6, 0.5), tray = i % 3, fly = eio(tt, 2.2 + i * 0.35, 3.0 + i * 0.35);
      const x0 = 860 + (rnd(i) - 0.5) * 340, y0 = 380 + (rnd(i + 7) - 0.5) * 140, x1 = 570 + tray * 440 + (rnd(i + 3) - 0.5) * 160, y1 = 830;
      const x = x0 + (x1 - x0) * fly, y = y0 * fall + (y1 - y0 * fall) * fly - 160 * Math.sin(fly * Math.PI);
      return <At key={i} x={x} y={y - (1 - fall) * 500} rot={rnd(i + 2) * 360 * (1 - fly) + fly * 90} s={0.42} z={fly > 0.98 ? 1 : 3}>{i % 4 === 3 ? <svg width={60} height={200} viewBox="0 0 30 100"><circle cx="15" cy="14" r="12" fill="none" stroke="#c9a24a" strokeWidth="6" /><rect x="11" y="26" width="8" height="70" fill="#c9a24a" /></svg> : <Fob w={150} />}</At>;
    })}
  </>;
}}</Stage>;

// 36 · la etiqueta es un mapa: ganchos rotulados; de cada rótulo sale una línea al auto, a la casa, a la camioneta
export const HHookMap: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const hooks: [string, number, number][] = [["CAMRY", 520, 1.0], ["FRONT DOOR", 820, 2.2], ["F-150", 1120, 3.4]];
  const dest: [number, number][] = [[1500, 300], [1600, 560], [1500, 820]];
  return <>
    <div style={{ position: "absolute", left: 380, top: 200, width: 900, height: 90, background: "linear-gradient(#8a5f33,#5e3f20)", borderRadius: 10, boxShadow: "0 24px 40px rgba(0,0,0,.5)" }} />
    {hooks.map(([n, x, a], i) => { const ln = eio(tt, a + 0.6, a + 1.8), [dx, dy] = dest[i];
      return <React.Fragment key={i}>
        <div style={{ position: "absolute", left: x - 30, top: 290, transformOrigin: "50% 0", transform: `rotate(${4 * Math.sin(tt * 1.6 + i)}deg)` }}>
          <svg width={60} height={90} viewBox="0 0 30 45"><path d="M15 0 L15 22 Q15 32 5 32" fill="none" stroke="#b8bec6" strokeWidth="4" strokeLinecap="round" /></svg>
          <div style={{ marginLeft: -50, transform: "scale(.5)", transformOrigin: "50% 0" }}><Fob w={160} /></div></div>
        <div style={{ position: "absolute", left: x, top: 640, transform: `translateX(-50%) rotate(${-3 + i * 3}deg) scale(${pop(tt, a)})`, padding: "10px 22px", background: "#f1e7c8", fontFamily: HAND, fontWeight: 700, fontSize: 40, color: "#3a2f25", borderRadius: 6, boxShadow: "0 10px 20px rgba(0,0,0,.5)" }}>{n}</div>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={`M${x} 700 C${x + 200} ${760 + i * 40} ${dx - 300} ${dy} ${dx - 80} ${dy}`} fill="none" stroke={RED} strokeWidth={5} strokeDasharray="1400" strokeDashoffset={1400 * (1 - ln)} /></svg>
        <At x={dx} y={dy} s={0.6 * pop(tt, a + 1.8)} rot={i === 1 ? 0 : 90}>{i === 1 ? <svg width={170} height={160} viewBox="0 0 85 80"><path d="M5 38 L42 6 L80 38 L80 76 L5 76 Z" fill="#e9e1d1" /><rect x="34" y="48" width="18" height="28" fill="#6b4a2e" /></svg> : <CarTop w={130} col={i ? "#3a3d44" : "#c94a3a"} />}</At>
      </React.Fragment>; })}
    <Tag tt={tt} at={5.2} x={830} y={900} txt="A LABEL IS A MAP" col={RED} size={60} />
  </>;
}}</Stage>;

// 37 · la linterna del ladrón: el haz barre debajo del paragolpes y encuentra la cajita imantada
export const HFlashlight: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  // la linterna del ladrón: un cono de luz visible barre el bajo del paragolpes y se queda en la cajita imantada
  const bx = 420 + 980 * eio(tt, 0.3, 2.8) - 160 * eio(tt, 2.8, 3.4), found = cl((tt - 3.2) / 0.5), lx = 960, ly = 1060;
  const scene = <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, height: 300, background: "linear-gradient(#a8adb4,#6d7178)", borderRadius: "0 0 70px 70px" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 600, height: 480, background: "linear-gradient(#26282c,#141518)" }} />
    {[250, 640, 1560].map((x, i) => <div key={i} style={{ position: "absolute", left: x, top: 610, width: 140, height: 22, background: "#3a3d44", borderRadius: 4 }} />)}
    <div style={{ position: "absolute", left: 1160, top: 604, width: 200, height: 104, borderRadius: 12, background: "linear-gradient(#34373d,#121316)", border: "4px solid #5a5e66", transform: `scale(${1 + 0.12 * found})` }}><div style={{ margin: "36px auto", width: 120, height: 12, borderRadius: 6, background: "#7a7f88" }} /></div>
  </>;
  return <>
    <div style={{ position: "absolute", inset: 0, background: "#05060a" }} />
    <div style={{ position: "absolute", inset: 0, opacity: 0.16 }}>{scene}</div>
    <div style={{ position: "absolute", inset: 0, WebkitMaskImage: `radial-gradient(ellipse 330px 230px at ${bx}px 650px, #000 45%, transparent 75%)`, maskImage: `radial-gradient(ellipse 330px 230px at ${bx}px 650px, #000 45%, transparent 75%)` }}>{scene}</div>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <defs><linearGradient id="fl_beam" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#fff6d8" stopOpacity="0.55" /><stop offset="1" stopColor="#fff6d8" stopOpacity="0.04" /></linearGradient></defs>
      <path d={`M${lx - 30} ${ly} L${bx - 300} 650 L${bx + 300} 650 L${lx + 30} ${ly} Z`} fill="url(#fl_beam)" />
    </svg>
    <div style={{ position: "absolute", left: lx - 45, top: ly - 40, width: 90, height: 200, borderRadius: 16, background: "linear-gradient(90deg,#1c1d21,#3a3d44,#1c1d21)", transform: `rotate(${Math.atan2(bx - lx, ly - 650) * 57.3}deg)`, transformOrigin: "50% 100%" }}><div style={{ height: 22, borderRadius: "16px 16px 4px 4px", background: "#fff6d8", boxShadow: "0 0 30px #fff6d8" }} /></div>
    {found > 0 && <div style={{ position: "absolute", left: 1260, top: 656, width: 330, height: 330, borderRadius: "50%", border: `10px solid ${RED}`, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * found})`, opacity: found }} />}
    <Tag tt={tt} at={3.6} x={1260} y={250} txt="FIRST PLACE THEY LOOK" col={RED} size={50} />
  </>;
}}</Stage>;

// 38 · el llavero pesado: dos llaves en el mismo aro; el aro se levanta y se van las dos juntas
export const HRing: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const lift = eio(tt, 3.0, 4.6), sw = 8 * Math.sin(tt * 2.4) * (1 - lift * 0.5);
  return <>
    <div style={{ position: "absolute", left: 360, top: 780, width: 1200, height: 36, background: "linear-gradient(#8a5f33,#5e3f20)", borderRadius: 8 }} />
    <div style={{ position: "absolute", left: 960, top: 360 - 520 * lift, transform: `translateX(-50%) rotate(${sw}deg)`, transformOrigin: "50% 0" }}>
      <div style={{ width: 200, height: 200, borderRadius: "50%", border: "18px solid #c9ced4", margin: "0 auto", boxShadow: "0 10px 20px rgba(0,0,0,.4)" }} />
      <div style={{ display: "flex", gap: 10, marginTop: -60, justifyContent: "center" }}>
        <div style={{ transform: "rotate(14deg) scale(1.15)" }}><Fob w={200} /></div><div style={{ transform: "rotate(-12deg) scale(1.15)", marginLeft: 20 }}><Fob w={200} led={0.4} /></div></div>
    </div>
    <Tag tt={tt} at={0.8} x={540} y={300} txt="CAR" col={AMB} size={50} />
    <Tag tt={tt} at={1.4} x={1380} y={300} txt="SPARE" col={AMB} size={50} />
    <Tag tt={tt} at={4.6} x={960} y={880} txt="GONE TOGETHER" col={RED} size={64} />
  </>;
}}</Stage>;

// 39 · la lata de café: la llave cae dentro, la lata vuelve atrás del diluyente en el estante del garaje
export const HCan: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const fall = eio(tt, 0.6, 1.4), back = eio(tt, 2.4, 3.8);
  return <>
    <div style={{ position: "absolute", left: 280, top: 820, width: 1360, height: 40, background: "linear-gradient(#8a5f33,#5e3f20)", borderRadius: 6, boxShadow: "0 30px 50px rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", left: 860 + 120 * back, top: 820 - 340 + 40 * back, width: 240, height: 340, transform: `scale(${1 - 0.25 * back})`, transformOrigin: "50% 100%", zIndex: 1 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "16px 16px 20px 20px", background: "linear-gradient(90deg,#4f3424,#7a5236 45%,#4f3424)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, height: 110, background: "#e9e1d1" }}><div style={{ textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 44, color: "#4f3424", marginTop: 26 }}>COFFEE</div></div>
      <div style={{ position: "absolute", left: -6, right: -6, top: -14, height: 30, borderRadius: "50%", background: "#b8bec6" }} />
    </div>
    {fall < 1 && <At x={980} y={200 + 260 * fall} rot={fall * 300} s={0.5}><Fob w={160} /></At>}
    <div style={{ position: "absolute", left: 1050, top: 820 - 440, width: 200, height: 440, borderRadius: "40px 40px 16px 16px", background: "linear-gradient(90deg,#b52d22,#e04a3a 45%,#b52d22)", zIndex: 2, opacity: back, transform: `translateX(${(1 - back) * 300}px)` }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 160, textAlign: "center", fontWeight: 900, fontSize: 30, color: "#fff", letterSpacing: 2 }}>PAINT<br />THINNER</div></div>
    <Tag tt={tt} at={4.0} x={600} y={300} txt="BEHIND THE THINNER" col={TX} size={50} />
  </>;
}}</Stage>;

// 40 · nunca juntas: dos cuartos separados; en uno la llave duerme en la bolsa, en el otro la llave sin pila
export const HApart: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const wall = eio(tt, 0.4, 1.4);
  return <>
    <div style={{ position: "absolute", left: 300, top: 220, width: 1320, height: 660, opacity: wall, transform: `scale(${0.9 + 0.1 * wall})`, background: "#e9e1d1", borderRadius: 10, boxShadow: "inset 0 0 0 18px #3a2f25, 0 40px 80px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 952, top: 220, width: 16, height: 660 * wall, background: "#3a2f25" }} />
    <At x={620} y={560} s={1.3 * pop(tt, 0.7)}><div style={{ position: "relative" }}><Pouch w={240} /><div style={{ position: "absolute", left: 160, top: -60, fontFamily: HAND, fontSize: 60, color: "#3f6fb6" }}>z</div></div></At>
    <At x={1300} y={540} s={1.4 * pop(tt, 1.1)}><div style={{ position: "relative" }}><Fob w={180} open={0.7} dim={0.2} /></div></At>
    <At x={1500} y={400} s={1.3 * pop(tt, 1.6)}><Coin d={90} label="OFF" /></At>
    <Tag tt={tt} at={1.8} x={620} y={820} txt="ROOM ONE" col="#3a2f25" size={40} />
    <Tag tt={tt} at={2.4} x={1300} y={820} txt="ROOM TWO" col="#3a2f25" size={40} />
    <Tag tt={tt} at={3.4} x={960} y={140} txt="NEVER IN ONE PLACE" col={AMB} size={54} />
  </>;
}}</Stage>;

// 41 · la línea del tiempo: 2000 → hoy; los autos con botón de arranque se van multiplicando
export const HEra: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const k = eio(tt, 0.6, 6.0), yrs = [2000, 2005, 2010, 2015, 2020, 2026];
  return <>
    <div style={{ position: "absolute", left: 200, top: 760, width: 1520 * k, height: 8, background: TX, borderRadius: 4 }} />
    {yrs.map((y, i) => { const x = 200 + i * 304, on = k * 5 >= i;
      return <React.Fragment key={i}>
        <div style={{ position: "absolute", left: x, top: 790, transform: "translateX(-50%)", fontFamily: MARK, fontSize: 46, color: on ? TX : "transparent" }}>{y}</div>
        <div style={{ position: "absolute", left: x - 12, top: 752, width: 24, height: 24, borderRadius: "50%", background: on ? AMB : "transparent" }} />
        {on && Array.from({ length: [1, 2, 4, 7, 10, 13][i] }, (_, j) => <div key={j} style={{ position: "absolute", left: x - 50 + (j % 3) * 36, top: 690 - Math.floor(j / 3) * 70, transform: `scale(${pop(tt, 0.6 + i * 1.07 + j * 0.05) * 0.7})`, transformOrigin: "50% 100%" }}>
          <div style={{ width: 54, height: 54, borderRadius: "50%", background: "#15161a", border: `5px solid ${j % 2 ? GRN : "#8f949b"}`, boxShadow: "0 8px 14px rgba(0,0,0,.5)" }} /></div>)}
      </React.Fragment>; })}
    <Tag tt={tt} at={1.0} x={960} y={160} txt="PUSH-START, EVERYWHERE" col={GRN} size={54} />
  </>;
}}</Stage>;

// 42 · la pila es la llave de luz: una perilla grande ON/OFF con la pila dentro; se baja con peso a OFF
export const HSwitch: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const flip = phys(tt, 2.0, 7, 0.4), ang = -28 + 56 * flip, off = flip > 0.5;
  return <>
    <div style={{ position: "absolute", left: 760, top: 200, width: 400, height: 680, borderRadius: 40, background: "linear-gradient(#f4efe6,#d9d3c6)", boxShadow: "0 50px 90px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 50, top: 30, right: 50, textAlign: "center", fontWeight: 900, fontSize: 52, color: off ? "#c9c2b2" : GRN }}>ON</div>
      <div style={{ position: "absolute", left: 50, bottom: 30, right: 50, textAlign: "center", fontWeight: 900, fontSize: 52, color: off ? RED : "#c9c2b2" }}>OFF</div>
      <div style={{ position: "absolute", left: 110, top: 150, width: 180, height: 380, borderRadius: 30, background: "#cfc8bb", boxShadow: "inset 0 10px 20px rgba(0,0,0,.25)", perspective: 700 }}>
        <div style={{ position: "absolute", inset: 10, borderRadius: 24, background: "linear-gradient(#ffffff,#e3ddd1)", transform: `rotateX(${ang}deg)`, boxShadow: "0 20px 30px rgba(0,0,0,.3)", display: "flex", alignItems: "center", justifyContent: "center" }}><Coin d={110} label="CR" /></div></div>
    </div>
    <At x={1460} y={540} s={pop(tt, 0.4)}><Fob w={180} led={off ? 0 : 0.5 + 0.5 * Math.sin(tt * 6)} dim={off ? 0.4 : 0} /></At>
    {!off && <Waves x={1460} y={460} k={tt * 0.7} n={3} r={280} col={AMB} />}
    <Tag tt={tt} at={2.6} x={1460} y={790} txt="BATTERY OUT = OFF" col={RED} size={44} />
  </>;
}}</Stage>;

// 43 · la rutina de la noche: un reloj marca las 10; cinco cosas aparecen en orden alrededor de la esfera
export const HRoutine: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const hand = eio(tt, 0, 10) * 300, its = ["POUCH", "SPARE: NO BATTERY", "BATTERY UP HIGH", "BLADE IN THE CAR", "LIGHTS OFF"];
  return <>
    <div style={{ position: "absolute", left: 960, top: 540, width: 460, height: 460, borderRadius: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(#fbfaf6,#e3ddd1)", boxShadow: "0 0 0 18px #2a2c31, 0 50px 90px rgba(0,0,0,.6)" }}>
      {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: 226, top: 14, width: 8, height: 30, background: "#2a2c31", transformOrigin: "4px 216px", transform: `rotate(${i * 30}deg)` }} />)}
      <div style={{ position: "absolute", left: 224, top: 90, width: 12, height: 140, background: "#2a2c31", transformOrigin: "6px 140px", transform: `rotate(${300 + hand / 12}deg)`, borderRadius: 6 }} />
      <div style={{ position: "absolute", left: 226, top: 40, width: 8, height: 190, background: RED, transformOrigin: "4px 190px", transform: `rotate(${hand}deg)`, borderRadius: 4 }} />
    </div>
    {its.map((n, i) => { const a = (-90 + i * 72) * Math.PI / 180, x = 960 + 440 * Math.cos(a), y = 540 + 380 * Math.sin(a), s = pop(tt, 0.8 + i * 1.8);
      return <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`, padding: "14px 26px", borderRadius: 14, background: "#1d2026", border: `3px solid ${AMB}`, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ fontFamily: MARK, fontSize: 44, color: AMB }}>{i + 1}</div><div style={{ fontWeight: 900, fontSize: 30, color: TX, letterSpacing: 1 }}>{n}</div></div>; })}
  </>;
}}</Stage>;

// 44 · el plano dibujado a mano: una caja por cuarto; cada lugar se marca con X roja o círculo verde cuando lo nombra
export const HXMap: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const its: { at: number }[] = h.items ?? [], ats = its.map((x) => x.at - h.at), dr = eio(tt, 0.3, 3.0);
  const rooms: [number, number, number, number, string][] = [[360, 200, 520, 330, "KITCHEN"], [880, 200, 360, 330, "LIVING"], [1240, 200, 320, 330, "BEDROOM"], [360, 530, 420, 330, "GARAGE"], [780, 530, 780, 330, "BACK BEDROOM"]];
  const marks: [number, number, boolean][] = [[560, 380, false], [1060, 400, false], [1400, 410, true], [1300, 720, true]];
  return <div style={{ position: "absolute", inset: 0, transform: `perspective(2000px) rotateX(${18 - 6 * eio(tt, 0, 20)}deg) scale(${1 + 0.04 * Math.sin(tt * 0.2)})`, transformOrigin: "50% 55%" }}>
    <div style={{ position: "absolute", left: 300, top: 150, width: 1320, height: 770, background: "#f6f1e4", borderRadius: 6, boxShadow: "0 50px 90px rgba(0,0,0,.6)", transform: "rotate(-1deg)" }} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {rooms.map(([x, y, w, hh], i) => { const L = 2 * (w + hh); return <rect key={i} x={x} y={y} width={w} height={hh} fill="none" stroke="#3a3f4a" strokeWidth={6} strokeLinejoin="round" strokeDasharray={L} strokeDashoffset={L * (1 - cl(dr * 5 - i))} />; })}
      {marks.map(([x, y, ok], i) => { const k = cl(((ats[i] ?? 99) > 0 ? tt - ats[i] : -1) / 0.5); if (k <= 0) return null;
        return ok ? <circle key={i} cx={x} cy={y} r={70} fill="none" stroke="#2f8a4e" strokeWidth={12} strokeDasharray={440} strokeDashoffset={440 * (1 - k)} transform={`rotate(-80 ${x} ${y})`} />
          : <g key={i} stroke="#d0342a" strokeWidth={16} strokeLinecap="round"><line x1={x - 60} y1={y - 60} x2={x - 60 + 120 * cl(k * 2)} y2={y - 60 + 120 * cl(k * 2)} /><line x1={x + 60} y1={y - 60} x2={x + 60 - 120 * cl(k * 2 - 1)} y2={y - 60 + 120 * cl(k * 2 - 1)} /></g>; })}
    </svg>
    {rooms.map(([x, y, w, , n], i) => <div key={i} style={{ position: "absolute", left: x + 20, top: y + 16, fontFamily: HAND, fontWeight: 700, fontSize: 42, color: "#3a3f4a", opacity: cl(dr * 5 - i) }}>{n}</div>)}
    {[["DRAWER", 560, 460], ["BOWL", 1060, 480], ["NIGHTSTAND", 1400, 490], ["CLOSET", 1300, 800]].map(([n, x, y], i) => <div key={i} style={{ position: "absolute", left: x as number, top: y as number, transform: "translateX(-50%)", fontFamily: HAND, fontWeight: 700, fontSize: 30, color: "#5a5f6a", opacity: cl(((ats[i] ?? 99) - 0.6 < tt ? 1 : 0)) }}>{n}</div>)}
  </div>;
}}</Stage>;

// 45 · la entrada de al lado: una fila de casas; el ladrón camina, frena frente a la tuya, sigue de largo
export const HNextDrive: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  // vista lateral de la cuadra de noche: el ladrón (silueta con capucha y su caja de relé) camina, frena en cada entrada, en la tuya nada contesta y sigue
  const walk = tt < 2.6 ? eio(tt, 0.2, 2.6) * 0.45 : tt < 4.8 ? 0.45 : 0.45 + 0.55 * eio(tt, 4.8, 8.5), px = 120 + 1680 * walk, moving = tt < 2.6 || tt > 4.8;
  const step = moving ? Math.sin(tt * 7) : 0, scan = tt > 2.6 && tt < 4.8;
  return <>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#0b1020,#1b2238 60%,#23283a)" }} />
    {[0, 1, 2].map((i) => { const x = 330 + i * 630, mine = i === 1;
      return <React.Fragment key={i}>
        <div style={{ position: "absolute", left: x - 250, top: 300, width: 500, height: 420, background: mine ? "#3b3428" : "#2d2a26", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>
          <div style={{ position: "absolute", left: -30, top: -150, width: 0, height: 0, borderLeft: "280px solid transparent", borderRight: "280px solid transparent", borderBottom: `150px solid ${mine ? "#4a3f30" : "#383430"}` }} />
          <div style={{ position: "absolute", left: 60, top: 90, width: 120, height: 110, background: i === 0 ? "#f3c76a" : "#1a1d26", boxShadow: i === 0 ? "0 0 40px rgba(243,199,106,.5)" : "none" }} />
          <div style={{ position: "absolute", left: 320, top: 90, width: 120, height: 110, background: "#1a1d26" }} />
          <div style={{ position: "absolute", left: 205, top: 250, width: 90, height: 170, background: "#5a3d24" }} />
        </div>
        <At x={x + 90} y={780}><CarTop w={150} col={["#c94a3a", "#2f5d3a", "#6d7178"][i]} /></At>
        {mine && <div style={{ position: "absolute", left: x, top: 190, transform: "translateX(-50%)", fontWeight: 900, fontSize: 54, color: GRN, letterSpacing: 6, textShadow: "0 6px 20px #000" }}>YOURS</div>}
      </React.Fragment>; })}
    <div style={{ position: "absolute", left: 0, right: 0, top: 860, height: 220, background: "linear-gradient(#3d3f44,#26282c)" }} />
    <svg width={220} height={360} viewBox="0 0 220 360" style={{ position: "absolute", left: px - 110, top: 560, overflow: "visible", filter: "drop-shadow(0 20px 20px rgba(0,0,0,.7))" }}>
      <path d={`M110 30 a42 46 0 1 1 -1 0 Z`} fill="#0d0e12" />
      <path d="M58 92 Q110 70 162 92 L172 210 Q110 226 48 210 Z" fill="#14161c" />
      <path d={`M80 206 L${80 - 26 * step} 330 M140 206 L${140 + 26 * step} 330`} stroke="#0d0e12" strokeWidth={30} strokeLinecap="round" />
      <path d={`M150 110 L${scan ? 214 : 190} ${scan ? 120 : 190}`} stroke="#14161c" strokeWidth={24} strokeLinecap="round" />
      <rect x={scan ? 196 : 176} y={scan ? 96 : 178} width={44} height={30} rx={6} fill="#2b2e36" stroke="#55585f" strokeWidth={3} />
    </svg>
    {scan && <Waves x={px + 210} y={670} k={tt * 0.9} n={3} r={300} col={ICE} ang={-60} spread={70} />}
    <Tag tt={tt} at={3.2} x={960} y={120} txt="NOTHING ANSWERS" col={TX} size={50} />
  </>;
}}</Stage>;

export const HEROES_B: Record<string, React.FC<P>> = { channels: HChannels, handle: HHandle, seamleak: HSeamLeak, blink4: HBlink4, still: HStill, comments: HComments, microwave: HMicrowave, ladder: HLadder,
  walls: HWalls, married: HMarried, erase: HErase, sort: HSort, hookmap: HHookMap, flashlight: HFlashlight, ring: HRing, can: HCan, apart: HApart, era: HEra, switch: HSwitch, routine: HRoutine, xmap: HXMap, nextdrive: HNextDrive };
void Plan; void DIM;

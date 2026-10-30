// swl29d · los componentes únicos del video (uno por minuto, ninguno repetido en la tanda: D:/rtmp/swl29_COMPONENTES.md).
// Cada uno es el OBJETO que la idea es, dentro del Stage. h.b = segundos (absolutos) de las palabras que lo disparan.
import React from "react";
import { Img } from "remotion";
import { Stage, Tag, Shadow, H, K, cl, phys, eio, eIn, eOut, lerp, rnd, img, SERIF, HAND, MARK, SANS } from "./kit";

const r = (h: H, i: number, d = 0) => (h.b[i] ?? h.at + d) - h.at;   // beat i relativo a la entrada
const D = (h: H) => h.out - h.at;
type CP = { t: number; h: H };
const HAM = "radial-gradient(ellipse at 38% 30%,#f7b4a8,#e0877a 40%,#b85a52 75%,#8a3c36)";
const GLAZE = "radial-gradient(ellipse at 40% 25%,#e8a24a,#b8641c 55%,#7a3a0e)";
// cubito de jamón en 3D (6 caras)
const Cube: React.FC<{ s: number; rx: number; ry: number; col?: string }> = ({ s, rx, ry, col = "#e79a8c" }) => (
  <div style={{ position: "relative", width: s, height: s, transformStyle: "preserve-3d", transform: `rotateX(${rx}deg) rotateY(${ry}deg)` }}>
    {[[0, 0], [0, 90], [0, 180], [0, -90], [90, 0], [-90, 0]].map(([a, b], i) => <div key={i} style={{ position: "absolute", inset: 0, transform: `rotateX(${a}deg) rotateY(${b}deg) translateZ(${s / 2}px)`, background: i === 4 ? "#f6c4b8" : col, filter: `brightness(${[1, 0.85, 0.7, 0.8, 1.1, 0.6][i]})`, boxShadow: "inset 0 0 8px rgba(120,40,30,.35)" }}>
      {i < 4 && <div style={{ position: "absolute", left: "12%", top: "30%", width: "40%", height: "8%", borderRadius: 4, background: "rgba(255,230,220,.6)" }} />}
    </div>)}
  </div>
);

// D01 · la bola de bowling rueda por la mesada y al frenar se vuelve el jamón entero; debajo «7 SUPPERS»
export const D01Bowling: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const roll = eOut(tt, 0.2, 1.8), x = lerp(-200, 960, roll), sw = eio(tt, r(h, 0) + 0.4, r(h, 0) + 1.3), br = 1 + 0.015 * Math.sin(tt * 2);
  return <>
    <Shadow x={x} y={850} w={lerp(300, 520, sw)} k={1} />
    <div style={{ position: "absolute", left: x - 180, top: 490, width: 360, height: 360, borderRadius: "50%", transform: `rotate(${roll * 720}deg)`, opacity: 1 - sw, background: "radial-gradient(circle at 34% 28%,#6a7bd8,#2a3590 45%,#0d1240 85%)", boxShadow: "inset -30px -30px 60px rgba(0,0,0,.55)" }}>
      {[[120, 90], [170, 70], [160, 130]].map(([a, b], i) => <div key={i} style={{ position: "absolute", left: a, top: b, width: 34, height: 34, borderRadius: "50%", background: "radial-gradient(circle at 40% 40%,#000,#111 60%,#333)" }} />)}
    </div>
    {/* el jamón glaseado con su hueso */}
    <div style={{ position: "absolute", left: 960 - 270, top: 470, width: 540, height: 400, transform: `scale(${lerp(0.6, 1, sw) * br})`, opacity: sw, transformOrigin: "50% 100%" }}>
      <div style={{ position: "absolute", left: 0, top: 40, width: 470, height: 350, borderRadius: "48% 52% 44% 50%", background: GLAZE, boxShadow: "inset -24px -30px 50px rgba(60,20,0,.55), 0 30px 50px rgba(0,0,0,.5)" }}>
        {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: "absolute", left: 40 + i * 44, top: 30, width: 6, height: 290, borderRadius: 3, background: "rgba(90,40,10,.45)", transform: `rotate(${18 - i * 2}deg)` }} />)}
        <div style={{ position: "absolute", left: 300, top: 90, width: 150, height: 220, borderRadius: "40%", background: HAM }} />
      </div>
      <div style={{ position: "absolute", left: 430, top: 120, width: 120, height: 46, borderRadius: 23, background: "linear-gradient(180deg,#fffaf0,#e0d4bc)", transform: "rotate(-24deg)" }} />
    </div>
    <Tag tt={tt} at={r(h, 0) + 1.2} x={960} y={950} txt="7 SUPPERS · NOT ONE SANDWICH" size={56} col={K.goldL} />
  </>;
}}</Stage>;

// D02 · la campana de vidrio de museo: se levanta y adentro, sobre terciopelo, el hueso con su cartelito «THE BEST PART»
export const D02Cloche: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="night">{(tt) => {
  const up = eio(tt, r(h, 0) - 0.2, r(h, 0) + 1.0), glow = 0.5 + 0.5 * Math.sin(tt * 2.2);
  return <>
    <div style={{ position: "absolute", left: 960 - 260, top: 740, width: 520, height: 150, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 35%,#a8243a,#5a0e1c 70%)", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 960 - 300, top: 790, width: 600, height: 90, borderRadius: 12, background: "linear-gradient(180deg,#3a2414,#1e120a)" }} />
    {/* el hueso */}
    <div style={{ position: "absolute", left: 960 - 190, top: 660, width: 380, height: 120, transform: `rotate(-6deg) translateY(${-6 * Math.sin(tt * 1.6)}px)`, filter: `drop-shadow(0 0 ${20 * glow * up}px rgba(255,220,150,.7))` }}>
      <div style={{ position: "absolute", left: 50, top: 38, width: 280, height: 44, borderRadius: 22, background: "linear-gradient(180deg,#fffaf0,#d8ccb0)" }} />
      {[0, 1].map((s) => <div key={s} style={{ position: "absolute", left: s ? 300 : 0, top: 10, width: 80, height: 100, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#fffdf6,#d6c8a8)" }} />)}
      <div style={{ position: "absolute", left: 110, top: 22, width: 150, height: 50, borderRadius: "45%", background: HAM, opacity: 0.9 }} />
    </div>
    {/* campana de vidrio */}
    <div style={{ position: "absolute", left: 960 - 230, top: 420 - 420 * up, width: 460, height: 380, borderRadius: "230px 230px 20px 20px", background: "linear-gradient(110deg,rgba(255,255,255,.04),rgba(255,255,255,.22) 30%,rgba(255,255,255,.05) 45%,rgba(255,255,255,.14) 80%)", border: "3px solid rgba(255,255,255,.35)", boxShadow: "inset 0 0 40px rgba(255,255,255,.15)" }}>
      <div style={{ position: "absolute", left: 200, top: -40, width: 60, height: 50, borderRadius: "50% 50% 10px 10px", background: "linear-gradient(90deg,#9a7a30,#f4d68a,#8a6a20)" }} />
    </div>
    <div style={{ position: "absolute", left: 1280, top: 700, transform: `rotate(-4deg) scale(${0.6 + 0.4 * cl(phys(tt, r(h, 0) + 0.8, 6, 0.5))})`, background: "#fbf3e4", padding: "16px 26px", borderRadius: 6, boxShadow: "0 14px 28px rgba(0,0,0,.5)", fontFamily: SERIF, fontSize: 46, color: K.ink, opacity: cl((tt - r(h, 0) - 0.7) * 3) }}>The best part</div>
    <Tag tt={tt} at={r(h, 0) + 1.6} x={960} y={300} txt="EVERYBODY THROWS IT AWAY" size={50} col={K.dim} />
  </>;
}}</Stage>;

// D03 · el papel de aluminio no cierra: el aire entra en flechas por las rendijas y la cara cortada se seca y se agrieta
export const D03Foil: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="cold">{(tt) => {
  const dry = eio(tt, 1.4, D(h) - 0.6);
  return <>
    <Shadow x={940} y={870} w={640} k={1} />
    <div style={{ position: "absolute", left: 640, top: 520, width: 520, height: 330, borderRadius: "46% 54% 40% 50%", background: `radial-gradient(ellipse at 35% 30%,${dry > 0.5 ? "#c98a80" : "#f2a89a"},${dry > 0.5 ? "#9a5a52" : "#d47a6c"} 55%,#7a3a34)`, filter: `saturate(${1 - 0.6 * dry})` }}>
      {Array.from({ length: 7 }, (_, i) => <div key={i} style={{ position: "absolute", left: 80 + rnd(i) * 300, top: 80 + rnd(i + 9) * 160, width: 70 * cl(dry * 2 - rnd(i)), height: 4, background: "rgba(80,30,20,.7)", transform: `rotate(${rnd(i + 3) * 160}deg)`, borderRadius: 2 }} />)}
    </div>
    {/* aluminio arrugado, abierto arriba */}
    <div style={{ position: "absolute", left: 600, top: 600, width: 620, height: 270, clipPath: "polygon(0 18%,8% 0,22% 14%,30% 4%,44% 20%,52% 6%,66% 22%,74% 8%,88% 16%,100% 4%,100% 100%,0 100%)", background: "linear-gradient(100deg,#8e959c,#eef1f4 18%,#b2b9c0 30%,#f8fafc 44%,#9aa1a8 60%,#e4e8ec 78%,#7c838a)" }} />
    {/* flechas de aire entrando */}
    {Array.from({ length: 6 }, (_, i) => { const ph = ((tt * 0.55 + i / 6) % 1), x0 = 1500 - ph * 520, y0 = 420 + i * 40 + 30 * Math.sin(ph * 6 + i);
      return <svg key={i} width={180} height={40} style={{ position: "absolute", left: x0, top: y0, opacity: Math.sin(ph * Math.PI) * cl(tt - 0.6) }}><path d="M170,20 C130,4 90,36 50,20 C30,12 18,18 10,20" stroke="#cfe8ff" strokeWidth={5} fill="none" strokeLinecap="round" /><path d="M10,20 L24,10 M10,20 L24,30" stroke="#cfe8ff" strokeWidth={5} strokeLinecap="round" /></svg>; })}
    {/* olores de la heladera */}
    {[["onion", 1.6, 1500, 300], ["old milk", 2.4, 1560, 380]].map(([s, a, x, y], i) => <div key={i} style={{ position: "absolute", left: (x as number) - 340 * eio(tt, a as number, (a as number) + 2.4), top: y as number, fontFamily: HAND, fontSize: 50, color: "rgba(220,240,200,.9)", opacity: cl((tt - (a as number)) * 2) * (1 - eIn(tt, (a as number) + 2.0, (a as number) + 2.6)) }}>~ {s} ~</div>)}
    <Tag tt={tt} at={r(h, 0) + 0.4} x={600} y={330} txt="FOIL DOESN'T SEAL" size={60} col={K.ice} />
  </>;
}}</Stage>;

// D04 · tres boles: SLICES · CUBES · SCRAPS — los pedazos del jamón saltan con física a cada bol
export const D04ThreeBowls: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="rise">{(tt) => {
  const B: [string, number][] = [["SLICES", 560], ["CUBES", 960], ["SCRAPS", 1360]];
  return <>
    {B.map(([n, x], i) => <React.Fragment key={n}>
      <Shadow x={x} y={880} w={320} k={1} />
      <div style={{ position: "absolute", left: x - 170, top: 720, width: 340, height: 150, borderRadius: "0 0 170px 170px", background: ["linear-gradient(90deg,#d9e6ee,#ffffff 40%,#b9c8d2)", "linear-gradient(90deg,#f2d9a8,#fff2d2 40%,#d2b47e)", "linear-gradient(90deg,#c9dcc4,#f1fbef 40%,#a6bea0)"][i], boxShadow: "inset 0 18px 30px rgba(0,0,0,.18)" }} />
      <div style={{ position: "absolute", left: x - 170, top: 700, width: 340, height: 50, borderRadius: "50%", background: "radial-gradient(ellipse,#5a4636,#2e2218)" }} />
      <div style={{ position: "absolute", left: x, top: 950, transform: `translateX(-50%) scale(${0.7 + 0.3 * cl(phys(tt, 0.3 + i * 0.3, 6, 0.5))})`, fontFamily: SANS, fontWeight: 900, fontSize: 54, letterSpacing: 3, color: K.goldL, opacity: cl((tt - 0.3 - i * 0.3) * 3) }}>{n}</div>
    </React.Fragment>)}
    {Array.from({ length: 15 }, (_, i) => {
      const bi = i % 3, a = 0.9 + i * 0.22, k = cl((tt - a) / 0.7), x0 = 960, y0 = 360, x1 = B[bi][1] + (rnd(i) - 0.5) * 140, y1 = 700 + rnd(i + 4) * 20;
      if (tt < a) return null;
      const x = lerp(x0, x1, k), y = lerp(y0, y1, k) - Math.sin(k * Math.PI) * 220, sp = (1 - k) * 540;
      const sz = bi === 0 ? [130, 34] : bi === 1 ? [46, 46] : [24, 18];
      return <div key={i} style={{ position: "absolute", left: x - sz[0] / 2, top: y - sz[1] / 2, width: sz[0], height: sz[1], borderRadius: bi === 0 ? "40%" : bi === 1 ? 6 : "50%", background: HAM, transform: `rotate(${sp + rnd(i) * 90}deg)`, boxShadow: "0 8px 12px rgba(0,0,0,.35)" }} />;
    })}
    {/* el trozo de jamón arriba, que se va achicando */}
    <div style={{ position: "absolute", left: 960 - 160, top: 290, width: 320, height: 160, borderRadius: "46%", background: HAM, transform: `scale(${1 - 0.6 * eio(tt, 0.9, 4.2)})`, boxShadow: "0 20px 40px rgba(0,0,0,.45)" }} />
  </>;
}}</Stage>;

// D05 · dos hielos en el agua: el bulto se derrite lento («ALL DAY») y la bolsa chata desaparece en 15 min
export const D05Thaw: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="cold">{(tt) => {
  const k = eio(tt, 0.8, D(h) - 0.6), flat = cl(k * 1.4), lump = k * 0.35;
  return <>
    {[0, 1].map((i) => { const x = i ? 1330 : 590, m = i ? flat : lump;
      return <React.Fragment key={i}>
        <div style={{ position: "absolute", left: x - 260, top: 560, width: 520, height: 300, borderRadius: "0 0 60px 60px", background: "linear-gradient(180deg,rgba(170,215,240,.35),rgba(110,170,210,.55))", boxShadow: "inset 0 0 0 6px rgba(255,255,255,.35), 0 30px 60px rgba(0,0,0,.45)", overflow: "hidden" }}>
          {Array.from({ length: 8 }, (_, j) => <div key={j} style={{ position: "absolute", left: 30 + j * 60, top: 290 - ((tt * 50 + j * 37) % 280), width: 10, height: 10, borderRadius: "50%", border: "2px solid rgba(255,255,255,.6)" }} />)}
        </div>
        <div style={{ position: "absolute", left: x - (i ? 190 : 120) * (1 - m * 0.5), top: (i ? 690 : 600) + m * 60, width: (i ? 380 : 240) * (1 - m * 0.5), height: (i ? 24 : 200) * (1 - m * 0.6), borderRadius: i ? 6 : 40, background: `linear-gradient(135deg,rgba(255,255,255,${0.9 * (1 - m)}),rgba(240,160,150,.9))`, boxShadow: `0 0 ${30 * (1 - m)}px rgba(220,245,255,.8)`, opacity: i ? 1 - eIn(tt, D(h) * 0.7, D(h) - 0.4) * 0.8 : 1 }} />
        <div style={{ position: "absolute", left: x, top: 920, transform: "translateX(-50%)", fontFamily: SANS, fontWeight: 900, fontSize: 64, color: i ? K.green : K.red, whiteSpace: "nowrap" }}>{i ? `${Math.round(lerp(0, 15, flat))} MIN` : "ALL DAY"}</div>
        <div style={{ position: "absolute", left: x, top: 470, transform: "translateX(-50%)", fontFamily: HAND, fontSize: 50, color: K.tx, whiteSpace: "nowrap" }}>{i ? "a flat bag" : "a lump"}</div>
      </React.Fragment>; })}
  </>;
}}</Stage>;

// D06 · el tensiómetro de brazo: cada sacudida del salero empuja la aguja a la zona roja — «TASTE FIRST»
export const D06Gauge: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const shakes = [0.8, 1.5, 2.2, 2.9], n = shakes.filter((s) => tt > s).length, ng = lerp(-110, 70, cl(n / 4 * 0.85 + 0.05 * Math.sin(tt * 9) * cl(n)));
  const sh = shakes.reduce((a, s) => a + Math.max(0, 1 - Math.abs(tt - s) * 5), 0), stop = eio(tt, 3.4, 3.9);
  return <>
    <Shadow x={760} y={880} w={480} k={1} />
    <div style={{ position: "absolute", left: 760 - 240, top: 400, width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle at 40% 32%,#ffffff,#e8e6e0 60%,#b8b4aa)", boxShadow: "0 0 0 18px #2c2c30, 0 0 0 24px #9aa0a6, 0 40px 80px rgba(0,0,0,.6)" }}>
      <svg width={480} height={480} style={{ position: "absolute", inset: 0 }}><path d="M80,330 A190,190 0 0 1 400,330" stroke="url(#gz)" strokeWidth={34} fill="none" /><defs><linearGradient id="gz"><stop offset="0" stopColor="#5cb85c" /><stop offset=".55" stopColor="#e8c84a" /><stop offset="1" stopColor="#d9362a" /></linearGradient></defs></svg>
      {[80, 120, 160, 200].map((v, i) => <div key={v} style={{ position: "absolute", left: "50%", top: "50%", width: 80, marginLeft: -40, marginTop: -20, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 34, color: "#2a2a2a", transform: `rotate(${-80 + i * 53}deg) translateY(-130px) rotate(${80 - i * 53}deg)` }}>{v}</div>)}
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 10, height: 190, marginLeft: -5, marginTop: -190, borderRadius: 5, background: K.red, transformOrigin: "50% 100%", transform: `rotate(${ng}deg)` }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 44, height: 44, margin: -22, borderRadius: "50%", background: "#2c2c30" }} />
    </div>
    {/* salero que se sacude, y la puerta del aparador que lo guarda */}
    <div style={{ position: "absolute", left: 1330, top: 380 + sh * 30 + stop * 60, width: 110, height: 190, transform: `rotate(${150 - 150 * stop + sh * 12}deg)`, transformOrigin: "50% 50%" }}>
      <div style={{ width: 110, height: 40, borderRadius: "50% 50% 8px 8px", background: "linear-gradient(90deg,#8a9096,#f4f6f8,#7c8288)" }} />
      <div style={{ width: 110, height: 150, borderRadius: "8px 8px 30px 30px", background: "linear-gradient(90deg,rgba(255,255,255,.35),rgba(255,255,255,.75) 40%,rgba(255,255,255,.3))", boxShadow: "inset 0 -60px 0 rgba(250,250,250,.85)" }} />
    </div>
    {sh > 0.2 && stop < 0.1 && Array.from({ length: 10 }, (_, i) => <div key={i} style={{ position: "absolute", left: 1370 + (rnd(i) - 0.5) * 60, top: 340 - rnd(i + tt) * 80, width: 6, height: 6, borderRadius: 2, background: "#fff" }} />)}
    <div style={{ position: "absolute", left: 1230, top: 300, width: 320, height: 420, transformOrigin: "0 50%", transform: `perspective(900px) rotateY(${lerp(-100, 0, stop)}deg)`, background: "linear-gradient(90deg,#c9a46a,#e8cc96 40%,#b08a50)", borderRadius: 8, boxShadow: "0 20px 40px rgba(0,0,0,.5)", opacity: cl(stop * 4) }}>
      <div style={{ position: "absolute", right: 24, top: 200, width: 24, height: 24, borderRadius: "50%", background: "#6a4a1c" }} />
    </div>
    <Tag tt={tt} at={3.9} x={1390} y={800} txt="TASTE FIRST" size={64} col={K.goldL} />
    <Tag tt={tt} at={1.0} x={760} y={330} txt="HAM IS ALREADY SALTY" size={48} col={K.dim} />
  </>;
}}</Stage>;

// D07 · el anillo de casamiento gira en 3D sobre el pañuelo; al lado entra el hueso: «she'd sooner toss the ring»
export const D07Ring: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="night">{(tt) => {
  const bone = phys(tt, r(h, 0) - 0.6, 5.5, 0.5);
  return <>
    <div style={{ position: "absolute", left: 960 - 520, top: 640, width: 1040, height: 260, transform: "rotateX(60deg) rotate(4deg)", background: "repeating-linear-gradient(45deg,#fbf6ea 0 26px,#f1e8d4 26px 30px)", borderRadius: 10, boxShadow: "0 30px 60px rgba(0,0,0,.5)" }} />
    <Shadow x={700} y={810} w={220} k={1} />
    <div style={{ position: "absolute", left: 700 - 110, top: 560 + 10 * Math.sin(tt * 1.4), width: 220, height: 220, transform: `rotateY(${tt * 90}deg) rotateX(12deg)` }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "30px solid transparent", background: "conic-gradient(from 0deg,#8a6a1c,#ffe9a8,#b8902e,#fff4c8,#8a6a1c) border-box", WebkitMask: "radial-gradient(circle, transparent 79px, #000 80px)", mask: "radial-gradient(circle, transparent 79px, #000 80px)", boxShadow: "0 0 40px rgba(255,220,140,.35)" }} />
    </div>
    <Shadow x={1240} y={820} w={420 * cl(bone)} k={1} />
    <div style={{ position: "absolute", left: 1240 - 200, top: 700 - (1 - cl(bone)) * 500, width: 400, height: 120, transform: `rotate(${-8 + (1 - cl(bone)) * 30}deg)` }}>
      <div style={{ position: "absolute", left: 55, top: 38, width: 290, height: 44, borderRadius: 22, background: "linear-gradient(180deg,#fffaf0,#d8ccb0)" }} />
      {[0, 1].map((s) => <div key={s} style={{ position: "absolute", left: s ? 320 : 0, top: 10, width: 80, height: 100, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#fffdf6,#d6c8a8)" }} />)}
      <div style={{ position: "absolute", left: 120, top: 22, width: 150, height: 50, borderRadius: "45%", background: HAM }} />
    </div>
    <Tag tt={tt} at={r(h, 0) + 0.4} x={960} y={330} txt="she'd sooner toss the ring" size={64} font={HAND} col={K.goldL} />
  </>;
}}</Stage>;

// D08 · la rueda de tareas de la iglesia: un disco de cartulina gira y cada cuarto se pinta — BONE · SLICE · CUBE · LABEL = 1 HOUR
export const D08Wheel: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const L = [["BONE", "#c9a46a"], ["SLICE", "#e0877a"], ["CUBE", "#f2b45a"], ["LABEL", "#7fb0d8"]], dur = D(h) - 1.2;
  const p = cl((tt - 0.6) / dur), rot = -p * 360, cur = Math.min(3, Math.floor(p * 4));
  return <>
    <Shadow x={960} y={900} w={560} k={1} />
    <div style={{ position: "absolute", left: 960 - 300, top: 300, width: 600, height: 600, borderRadius: "50%", transform: `rotate(${rot}deg)`, background: `conic-gradient(${L.map(([, c], i) => `${p * 4 > i ? c : "#efe6d2"} ${i * 90}deg ${i * 90 + 90}deg`).join(",")})`, boxShadow: "0 30px 70px rgba(0,0,0,.55), inset 0 0 0 10px #fbf3e4" }}>
      {L.map(([n], i) => <div key={n} style={{ position: "absolute", left: "50%", top: "50%", width: 240, marginLeft: -120, marginTop: -30, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 50, color: K.ink, transform: `rotate(${i * 90 + 45}deg) translateY(-170px)` }}>{n}</div>)}
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: "50%", top: 0, width: 4, height: 300, marginLeft: -2, background: "#7a5a3a", transformOrigin: "50% 100%", transform: `rotate(${i * 90}deg)` }} />)}
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 70, height: 70, margin: -35, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#fff,#b8a888)", boxShadow: "0 6px 12px rgba(0,0,0,.4)" }} />
    </div>
    <div style={{ position: "absolute", left: 960 - 22, top: 262, width: 0, height: 0, borderLeft: "22px solid transparent", borderRight: "22px solid transparent", borderTop: `44px solid ${K.red}` }} />
    <div style={{ position: "absolute", left: 1330, top: 460, fontFamily: SANS, fontWeight: 900, fontSize: 130, color: K.goldL }}>{Math.round(p * 60)}<span style={{ fontSize: 50 }}> min</span></div>
    <div key={cur} style={{ position: "absolute", left: 1340, top: 620, fontFamily: HAND, fontSize: 58, color: K.tx, opacity: cl((p * 4 - cur) * 6) }}>{["pull the bone", "a few slices", "a pile of cubes", "date every bag"][cur]}</div>
  </>;
}}</Stage>;

// D09 · el terrón de azúcar y el cubito de jamón giran en 3D lado a lado: mismo tamaño, ½ inch
export const D09Cubes: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="rise">{(tt) => {
  const k = phys(tt, 0.4, 6, 0.5), k2 = phys(tt, 1.0, 6, 0.5), ry = tt * 50, ms = eio(tt, 2.0, 2.8);
  return <>
    {[[760, k, "#e79a8c", "HAM"], [1160, k2, "#fbfbf6", "SUGAR"]].map(([x, kk, c, n], i) => <React.Fragment key={i}>
      <Shadow x={x as number} y={820} w={240 * cl(kk as number)} k={1} />
      <div style={{ position: "absolute", left: (x as number) - 90, top: 560 - (1 - cl(kk as number)) * 400, perspective: 900 }}>
        <Cube s={180} rx={-22} ry={ry + i * 30} col={c as string} />
      </div>
      <div style={{ position: "absolute", left: x as number, top: 880, transform: "translateX(-50%)", fontFamily: SANS, fontWeight: 900, fontSize: 52, letterSpacing: 4, color: K.tx, opacity: cl(((kk as number) - 0.5) * 3) }}>{n}</div>
    </React.Fragment>)}
    {/* regla que mide los dos */}
    <div style={{ position: "absolute", left: 640, top: 450, width: 640 * ms, height: 60, background: "linear-gradient(180deg,#f4e2a8,#d8bc72)", borderRadius: 4, boxShadow: "0 8px 16px rgba(0,0,0,.4)", overflow: "hidden" }}>
      {Array.from({ length: 33 }, (_, i) => <div key={i} style={{ position: "absolute", left: i * 20, top: 0, width: 2, height: i % 4 ? 18 : 32, background: "#3a2a10" }} />)}
    </div>
    <Tag tt={tt} at={2.8} x={960} y={380} txt="½ INCH · ONE BITE" size={56} col={K.goldL} />
  </>;
}}</Stage>;

// D10 · la taza medidora de vidrio se llena de cubitos hasta la raya de ½ y se vuelca en la bolsa: «1 SUPPER»
export const D10Cup: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const fill = eio(tt, 0.4, 2.2), pour = eio(tt, 2.6, 3.4), bag = eio(tt, 3.1, 3.8);
  return <>
    <Shadow x={760} y={880} w={340} k={1} />
    <div style={{ position: "absolute", left: 760 - 150, top: 480, width: 300, height: 380, transformOrigin: "100% 20%", transform: `rotate(${60 * pour}deg) translateX(${120 * pour}px)` }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "10px 10px 40px 40px", background: "linear-gradient(90deg,rgba(255,255,255,.18),rgba(255,255,255,.45) 30%,rgba(255,255,255,.12) 60%,rgba(255,255,255,.3))", border: "4px solid rgba(255,255,255,.55)", overflow: "hidden" }}>
        {Array.from({ length: 26 }, (_, i) => { const row = Math.floor(i / 5), vis = fill * 6 > row; return vis && (pour < 0.6 || rnd(i) > pour) ? <div key={i} style={{ position: "absolute", left: 22 + (i % 5) * 52 + rnd(i) * 8, bottom: 14 + row * 30, width: 44, height: 40, borderRadius: 6, background: HAM, transform: `rotate(${rnd(i) * 40 - 20}deg)`, boxShadow: "0 3px 5px rgba(0,0,0,.3)" }} /> : null; })}
      </div>
      {[["1 CUP", 60], ["¾", 140], ["½", 220], ["¼", 300]].map(([s, y]) => <div key={s} style={{ position: "absolute", left: 200, top: y as number, display: "flex", alignItems: "center", gap: 8, fontFamily: SANS, fontWeight: 900, fontSize: s === "½" ? 46 : 30, color: s === "½" ? K.red : "#d8e8f0" }}><div style={{ width: 40, height: 4, background: s === "½" ? K.red : "#d8e8f0" }} />{s}</div>)}
      <div style={{ position: "absolute", left: -60, top: 120, width: 70, height: 170, borderRadius: "40px 0 0 40px", border: "14px solid rgba(255,255,255,.5)", borderRight: "none" }} />
    </div>
    {/* la bolsa plana con su rótulo */}
    <div style={{ position: "absolute", left: 1180, top: 600, width: 440, height: 300, borderRadius: 10, background: "linear-gradient(160deg,rgba(255,255,255,.55),rgba(230,240,248,.25))", border: "3px solid rgba(255,255,255,.6)", boxShadow: "0 20px 40px rgba(0,0,0,.35)", transform: `scale(${0.85 + 0.15 * bag})`, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 18, height: 12, background: "#5a8ad8" }} />
      {bag > 0.1 && Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: "absolute", left: 30 + (i % 7) * 56, top: 150 + Math.floor(i / 7) * 46 + (1 - bag) * -100, width: 44, height: 36, borderRadius: 6, background: HAM }} />)}
      <div style={{ position: "absolute", left: 30, top: 50, fontFamily: MARK, fontSize: 52, color: "#141418", clipPath: `inset(0 ${(1 - eio(tt, 3.8, 4.6)) * 100}% 0 0)` }}>HAM ½ CUP</div>
    </div>
    <Tag tt={tt} at={4.4} x={1400} y={970} txt="= 1 SUPPER" size={64} col={K.goldL} />
  </>;
}}</Stage>;

// D11 · la cinta métrica de costura se estira: corta para la heladera (3-5 DAYS), larga para el freezer (1-2 MONTHS)
export const D11Tape: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const a = eOut(tt, 0.5, 1.4), b = eOut(tt, r(h, 0) - 0.4, r(h, 0) + 1.2);
  const tape = (y: number, w: number, col: string, lab: string, ic: string, k: number) => <>
    <div style={{ position: "absolute", left: 330, top: y - 70, width: 140, height: 140, borderRadius: 26, background: "linear-gradient(160deg,#d9362a,#8e1d1a)", boxShadow: "0 20px 40px rgba(0,0,0,.5)", transform: `rotate(${-k * 160}deg)` }}><div style={{ position: "absolute", inset: 40, borderRadius: "50%", background: "#3a0e0a" }} /></div>
    <div style={{ position: "absolute", left: 450, top: y - 32, width: w * k, height: 64, background: `linear-gradient(180deg,#fff6c8,${col})`, boxShadow: "0 8px 16px rgba(0,0,0,.4)", overflow: "hidden" }}>
      {Array.from({ length: Math.ceil(w / 30) }, (_, i) => <div key={i} style={{ position: "absolute", left: i * 30, top: 0, width: 2, height: i % 5 ? 20 : 36, background: "#2a2010" }} />)}
    </div>
    <div style={{ position: "absolute", left: 450 + w * k + 10, top: y - 40, fontSize: 70, opacity: cl(k * 3) }}>{ic}</div>
    <div style={{ position: "absolute", left: 470, top: y + 46, fontFamily: SANS, fontWeight: 900, fontSize: 58, color: K.tx, opacity: cl(k * 2), whiteSpace: "nowrap" }}>{lab}</div>
  </>;
  return <>
    {tape(430, 300, "#f2d470", "FRIDGE · 3–5 DAYS", "🧊", a)}
    {tape(700, 1050, "#bfe2f8", "FREEZER · 1–2 MONTHS", "❄", b)}
  </>;
}}</Stage>;

// D12 · la cazuelita en corte: caen capas papa / cebolla / jamón ×3 y la salsa de leche baja y llena los huecos
export const D12Layers: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const L = ["#f6e7b4", "#f4f0e2", "#e8907e", "#f6e7b4", "#f4f0e2", "#e8907e", "#f6e7b4"], sauce = eio(tt, 3.4, 4.6);
  return <>
    <Shadow x={960} y={900} w={800} k={1} />
    <div style={{ position: "absolute", left: 960 - 380, top: 470, width: 760, height: 420, borderRadius: "20px 20px 120px 120px", background: "linear-gradient(180deg,#f7f3ea,#d8cfbe)", boxShadow: "0 40px 80px rgba(0,0,0,.6)", padding: 26 }}>
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: "10px 10px 100px 100px", overflow: "hidden", background: "#3a2a1a" }}>
        {L.map((c, i) => { const a = 0.4 + i * 0.4, k = phys(tt, a, 7, 0.5); if (tt < a) return null;
          return <div key={i} style={{ position: "absolute", left: 0, right: 0, bottom: i * 50, height: 44, transform: `translateY(${(1 - cl(k)) * -500}px)`, background: c, borderRadius: 8, boxShadow: "inset 0 -8px 10px rgba(0,0,0,.18)" }}>
            {c === "#f6e7b4" && Array.from({ length: 8 }, (_, j) => <div key={j} style={{ position: "absolute", left: 10 + j * 88, top: 6, width: 80, height: 32, borderRadius: "50%", border: "2px solid rgba(190,160,90,.6)" }} />)}
          </div>; })}
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: `${sauce * 100}%`, background: "linear-gradient(180deg,rgba(255,250,235,.85),rgba(255,250,235,.4))", mixBlendMode: "screen" }} />
      </div>
    </div>
    {sauce > 0 && sauce < 0.98 && <div style={{ position: "absolute", left: 950, top: 200, width: 22, height: 290, borderRadius: 11, background: "linear-gradient(180deg,#fffdf4,#f2ead6)" }} />}
    <div style={{ position: "absolute", left: 1400, top: 470, fontFamily: HAND, fontSize: 46, color: K.goldL, lineHeight: 1.4 }}>{["potato", "onion", "ham"].map((s, i) => <div key={s} style={{ opacity: cl((tt - 0.4 - i * 0.4) * 3) }}>{s}</div>)}<div style={{ opacity: sauce, color: K.tx }}>+ ½ cup milk</div></div>
    <Tag tt={tt} at={3.0} x={960} y={360} txt="×3 · NO SALT" size={56} col={K.tx} />
  </>;
}}</Stage>;

// D13 · el boletín de la iglesia de 1989 se despliega: «WELCOME, LYNN» y el año rueda
export const D13Bulletin: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const op = eio(tt, 0.4, 1.4), yr = Math.round(lerp(2026, 1989, eOut(tt, 0.6, 2.2)));
  return <>
    <Shadow x={960} y={900} w={900} k={1} />
    <div style={{ position: "absolute", left: 960 - 440, top: 300, width: 880, height: 600, perspective: 1600 }}>
      <div style={{ position: "absolute", left: 440, top: 0, width: 440, height: 600, background: "linear-gradient(90deg,#efe6d0,#fbf6ea)", boxShadow: "0 20px 40px rgba(0,0,0,.4)", padding: 34, fontFamily: SERIF, color: K.ink }}>
        <div style={{ fontSize: 34 }}>Fellowship News</div>
        <div style={{ height: 3, background: K.ink, margin: "12px 0 22px" }} />
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 52, lineHeight: 1.05, clipPath: `inset(0 ${(1 - eio(tt, 1.6, 2.6)) * 100}% 0 0)` }}>WELCOME, LYNN!</div>
        <div style={{ marginTop: 20, fontSize: 30, lineHeight: 1.35, opacity: eio(tt, 2.4, 3.0) }}>She brought fried rice to Wednesday supper. Everybody went back for seconds.</div>
        <div style={{ position: "absolute", right: 34, bottom: 30, width: 170, height: 130, overflow: "hidden", border: "6px solid #fff", boxShadow: "0 6px 12px rgba(0,0,0,.3)", opacity: eio(tt, 2.8, 3.4) }}><Img src={img(h.bg ?? "f24")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(.4) sepia(.3)" }} /></div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 440, height: 600, transformOrigin: "100% 50%", transform: `rotateY(${180 - 180 * op}deg)`, background: "linear-gradient(90deg,#fbf6ea,#e8dcc0)", boxShadow: "0 20px 40px rgba(0,0,0,.4)", padding: 40, fontFamily: SERIF, color: K.ink, backfaceVisibility: "hidden" }}>
        <div style={{ fontSize: 40 }}>First Lutheran</div>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 120, marginTop: 120 }}>{yr}</div>
        <div style={{ fontSize: 34 }}>Wednesday bulletin</div>
      </div>
    </div>
  </>;
}}</Stage>;

// D14 · la cajita de comida para llevar se abre: el ticket $12.95 se tacha y queda «10 MIN · ABOUT $1»
export const D14Takeout: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="rise">{(tt) => {
  const op = eio(tt, 0.5, 1.3), tick = phys(tt, 1.4, 6, 0.5), x = eio(tt, 2.4, 2.9), steam = cl(op * 2);
  return <>
    <Shadow x={820} y={880} w={420} k={1} />
    <div style={{ position: "absolute", left: 820 - 200, top: 520, width: 400, height: 340, perspective: 900 }}>
      <div style={{ position: "absolute", left: 0, top: 100, width: 400, height: 240, clipPath: "polygon(0 0,100% 0,86% 100%,14% 100%)", background: "linear-gradient(90deg,#e8e4dc,#ffffff 40%,#d6d0c4)" }}>
        <div style={{ position: "absolute", left: 120, top: 70, width: 160, height: 120, border: `8px solid ${K.red}`, borderRadius: 8, transform: "rotate(45deg) scale(.6)" }} />
      </div>
      {[0, 1].map((s) => <div key={s} style={{ position: "absolute", left: s ? 200 : 0, top: 100, width: 200, height: 110, transformOrigin: `${s ? 100 : 0}% 0`, transform: `rotateX(${-160 * op}deg) rotateY(${(s ? -1 : 1) * 30 * op}deg)`, background: "linear-gradient(180deg,#f4f1ea,#d8d2c6)", clipPath: s ? "polygon(0 0,100% 0,80% 100%,0 100%)" : "polygon(0 0,100% 0,100% 100%,20% 100%)" }} />)}
      <div style={{ position: "absolute", left: 60, top: 40, width: 280, height: 110, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 40%,#f2d48a,#d8a64a 60%,#a8762a)", opacity: op }}>
        {Array.from({ length: 20 }, (_, i) => <div key={i} style={{ position: "absolute", left: 20 + rnd(i) * 230, top: 14 + rnd(i + 5) * 70, width: 14, height: 12, borderRadius: i % 3 ? 3 : "50%", background: i % 3 ? "#e08a7c" : "#6ab04a" }} />)}
      </div>
      {Array.from({ length: 4 }, (_, i) => <div key={i} style={{ position: "absolute", left: 100 + i * 50, top: -40 - ((tt * 50 + i * 30) % 120), width: 34, height: 80, borderRadius: "50%", background: "rgba(255,255,255,.2)", filter: "blur(10px)", opacity: steam }} />)}
    </div>
    {/* el ticket de delivery */}
    <div style={{ position: "absolute", left: 1220, top: 360, width: 360, padding: "26px 30px", background: "#fdfcf6", boxShadow: "0 16px 30px rgba(0,0,0,.45)", fontFamily: "monospace", fontSize: 34, color: "#222", transform: `rotate(4deg) translateY(${(1 - cl(tick)) * -600}px)` }}>
      <div>TAKE-OUT</div><div>Fried rice ....</div>
      <div style={{ position: "relative", fontSize: 64, fontWeight: 900, marginTop: 10 }}>$12.95<div style={{ position: "absolute", left: -10, top: 36, height: 10, width: 300 * x, background: K.red, transform: "rotate(-8deg)", borderRadius: 5 }} /></div>
    </div>
    <Tag tt={tt} at={3.0} x={1400} y={760} txt="10 MIN · ABOUT $1" size={62} col={K.goldL} />
  </>;
}}</Stage>;

// D15 · el repollo entero se abre en 4 gajos: uno se queda en la tabla, tres se envuelven en film y se van
export const D15Cabbage: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const sp = eio(tt, 1.0, 1.8), wrap = eio(tt, 2.4, 3.2), go = eio(tt, 3.4, 4.2);
  return <>
    <Shadow x={960} y={860} w={560} k={1} />
    <div style={{ position: "absolute", left: 960 - 330, top: 760, width: 660, height: 110, borderRadius: 14, background: "linear-gradient(180deg,#c89a5a,#8a6030)", boxShadow: "0 20px 40px rgba(0,0,0,.45)" }} />
    {[0, 1, 2, 3].map((i) => { const ang = i * 90 + 45, dx = Math.cos((ang - 90) * Math.PI / 180) * 90 * sp, dy = Math.sin((ang - 90) * Math.PI / 180) * 60 * sp, keep = i === 3;
      const fx = keep ? 0 : (i - 1) * 260 * go, fy = keep ? 0 : -600 * go;
      return <div key={i} style={{ position: "absolute", left: 960 - 200 + dx + fx, top: 420 + dy + fy, width: 400, height: 380, clipPath: `polygon(50% 50%, ${["50% 0,100% 0,100% 50%", "100% 50%,100% 100%,50% 100%", "50% 100%,0 100%,0 50%", "0 50%,0 0,50% 0"][i]})`, transform: `rotate(${keep ? 0 : 20 * go}deg)`, opacity: keep ? 1 : 1 - go * 0.9 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 45% 40%,#f4f8e0,#cfe6a0 30%,#8ec05a 60%,#4a8a2a)", boxShadow: "inset -20px -20px 40px rgba(20,60,10,.4)" }}>
          {Array.from({ length: 8 }, (_, j) => <div key={j} style={{ position: "absolute", left: "50%", top: "50%", width: 150 + j * 20, height: 150 + j * 20, margin: -(75 + j * 10), borderRadius: "50%", border: "3px solid rgba(250,255,230,.55)" }} />)}
        </div>
        {!keep && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg,rgba(255,255,255,0),rgba(255,255,255,.55) 40%,rgba(255,255,255,.1) 60%)", opacity: wrap }} />}
      </div>; })}
    <div style={{ position: "absolute", left: 1380, top: 400, background: "#fff6d0", padding: "12px 22px", borderRadius: 8, fontFamily: SANS, fontWeight: 900, fontSize: 64, color: K.ink, transform: `rotate(6deg) scale(${cl(phys(tt, 0.4, 6, 0.5))})` }}>99¢</div>
    <Tag tt={tt} at={2.4} x={1460} y={600} txt="¼ TONIGHT" size={54} col={K.green} />
    <Tag tt={tt} at={3.2} x={1460} y={680} txt="KEEPS 3 WEEKS" size={48} col={K.dim} />
  </>;
}}</Stage>;

// D16 · la montaña de repollo en la sartén (de perfil) baja con la tapa puesta; la regla de altura cae de 9" a 1"
export const D16Mountain: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const lid = eio(tt, 0.9, 1.4) * (1 - eio(tt, D(h) - 1.4, D(h) - 0.9)), cook = eio(tt, 1.4, D(h) - 1.2), hh = lerp(360, 50, cook);
  return <>
    <Shadow x={900} y={900} w={760} k={1} />
    <div style={{ position: "absolute", left: 900 - 360, top: 800, width: 720, height: 90, borderRadius: "0 0 40px 40px", background: "linear-gradient(180deg,#3a3734,#0e0d0c)" }} />
    <div style={{ position: "absolute", left: 900 + 340, top: 815, width: 360, height: 40, borderRadius: 20, background: "linear-gradient(180deg,#3a3734,#0e0d0c)" }} />
    <div style={{ position: "absolute", left: 900 - 330, top: 800 - hh, width: 660, height: hh + 10, borderRadius: `${330}px ${330}px 10px 10px / ${hh}px ${hh}px 10px 10px`, overflow: "hidden", background: "linear-gradient(180deg,#e4f2b8,#a8d070 60%,#7aa84a)" }}>
      {Array.from({ length: 40 }, (_, i) => <div key={i} style={{ position: "absolute", left: rnd(i) * 640, top: rnd(i + 3) * hh, width: 90, height: 10, borderRadius: 5, background: cook > 0.6 && i % 4 === 0 ? "#b8823a" : "rgba(250,255,220,.7)", transform: `rotate(${rnd(i + 7) * 180}deg)` }} />)}
    </div>
    {/* la tapa de vidrio */}
    <div style={{ position: "absolute", left: 900 - 370, top: 800 - Math.max(hh, 60) - 40 - (1 - lid) * 400, width: 740, height: 70, borderRadius: "50% 50% 10px 10px", background: "linear-gradient(180deg,rgba(255,255,255,.35),rgba(255,255,255,.08))", border: "4px solid rgba(220,230,240,.6)", opacity: lid }}>
      <div style={{ position: "absolute", left: 330, top: -34, width: 80, height: 36, borderRadius: 12, background: "#222" }} />
    </div>
    {lid > 0.5 && Array.from({ length: 5 }, (_, i) => <div key={i} style={{ position: "absolute", left: 700 + i * 80, top: 600 - Math.max(hh, 60) - ((tt * 60 + i * 40) % 160), width: 40, height: 90, borderRadius: "50%", background: "rgba(255,255,255,.22)", filter: "blur(10px)" }} />)}
    {/* regla de altura */}
    <div style={{ position: "absolute", left: 1420, top: 440, width: 60, height: 360, background: "linear-gradient(90deg,#f4e2a8,#d8bc72)", borderRadius: 4 }}>{Array.from({ length: 10 }, (_, i) => <div key={i} style={{ position: "absolute", right: 0, top: i * 40, width: i % 2 ? 20 : 36, height: 3, background: "#3a2a10" }} />)}</div>
    <div style={{ position: "absolute", left: 1400, top: 800 - hh - 3, width: 100, height: 6, background: K.red }} />
    <div style={{ position: "absolute", left: 1520, top: 800 - hh - 50, fontFamily: SANS, fontWeight: 900, fontSize: 90, color: K.goldL }}>{Math.max(1, Math.round(lerp(9, 1, cook)))}"</div>
    <Tag tt={tt} at={1.5} x={900} y={330} txt="LID ON · 5 MINUTES" size={52} col={K.tx} />
  </>;
}}</Stage>;

// D17 · el cubito de papa en corte: primero el microondas cocina el CENTRO (ondas, blanco→amarillo), después la sartén dora el BORDE
export const D17Cutaway: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const inn = eio(tt, 0.6, 2.4), out = eio(tt, 2.8, 4.4), S2 = 420;
  return <>
    <Shadow x={820} y={900} w={500} k={1} />
    <div style={{ position: "absolute", left: 820 - S2 / 2, top: 420, width: S2, height: S2, borderRadius: 40, background: `rgb(${lerp(250, 168, out)},${lerp(244, 98, out)},${lerp(220, 34, out)})`, boxShadow: "0 30px 60px rgba(0,0,0,.55)", padding: 40 }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 24, background: `radial-gradient(circle,rgb(${lerp(252, 248, inn)},${lerp(250, 214, inn)},${lerp(238, 120, inn)}) ${inn * 70}%,rgb(250,246,228))`, boxShadow: "inset 0 0 30px rgba(140,110,40,.25)" }} />
    </div>
    {inn > 0 && inn < 1 && [0, 1, 2].map((i) => { const ph = (tt * 0.9 + i / 3) % 1; return <div key={i} style={{ position: "absolute", left: 820 - 260 * ph, top: 630 - 260 * ph, width: 520 * ph, height: 520 * ph, borderRadius: "50%", border: "5px solid rgba(255,200,120,.55)", opacity: 1 - ph }} />; })}
    <div style={{ position: "absolute", left: 1220, top: 420, fontFamily: SANS, fontWeight: 900, fontSize: 56, color: K.goldL, opacity: cl(inn * 3), lineHeight: 1.1 }}>INSIDE<div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 50, color: K.tx }}>microwave · 3 min</div></div>
    <div style={{ position: "absolute", left: 1220, top: 620, fontFamily: SANS, fontWeight: 900, fontSize: 56, color: "#e0a050", opacity: cl(out * 3), lineHeight: 1.1 }}>OUTSIDE<div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 50, color: K.tx }}>skillet · crispy</div></div>
  </>;
}}</Stage>;

// D18 · la tarjeta de muestras de pintura de la ferretería: 5 tonos de dorado, la marca avanza mientras la espátula espera
export const D18Swatch: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const C = ["#f7ecc8", "#ecd08a", "#d9a650", "#b8772c", "#8a4e18"], N = ["Raw", "Pale", "Golden", "Diner", "Saturday"], p = eio(tt, 0.6, D(h) - 1.0) * 4.6, cur = Math.min(4, Math.floor(p));
  return <>
    <div style={{ position: "absolute", left: 960 - 330, top: 230, width: 660, height: 720, background: "#fdfbf4", borderRadius: 10, boxShadow: "0 30px 60px rgba(0,0,0,.5)", transform: "rotate(-3deg)", padding: 30 }}>
      <div style={{ fontFamily: SERIF, fontSize: 40, color: K.ink, marginBottom: 16 }}>Hash Crust · Shades</div>
      {C.map((c, i) => <div key={i} style={{ height: 112, marginBottom: 10, background: c, borderRadius: 4, display: "flex", alignItems: "center", paddingLeft: 26, fontFamily: SANS, fontWeight: 800, fontSize: 40, color: i > 2 ? "#fff6e0" : K.ink, opacity: p > i - 0.2 ? 1 : 0.35, transform: `scale(${i === cur ? 1.04 : 1})` }}>{N[i]}</div>)}
      <div style={{ position: "absolute", left: -46, top: 102 + Math.min(4, p) * 122, width: 0, height: 0, borderTop: "28px solid transparent", borderBottom: "28px solid transparent", borderLeft: `40px solid ${K.red}` }} />
    </div>
    {/* la espátula que quiere meterse y espera */}
    <div style={{ position: "absolute", left: 1360, top: 380 + 14 * Math.sin(tt * 3), width: 360, height: 90, transform: "rotate(-24deg)" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 150, height: 90, borderRadius: 10, background: "linear-gradient(90deg,#8d939a,#eef1f3,#9aa0a6)" }} />
      <div style={{ position: "absolute", left: 140, top: 32, width: 220, height: 26, borderRadius: 13, background: "linear-gradient(180deg,#3a2414,#6b4426)" }} />
    </div>
    <Tag tt={tt} at={0.8} x={1520} y={600} txt="DON'T STIR" size={64} col={K.red} rot={-4} />
    <Tag tt={tt} at={2.0} x={1520} y={690} txt="let it sit" size={50} font={HAND} col={K.goldL} />
  </>;
}}</Stage>;

// D19 · desde arriba: el tenedor rompe la yema y el oro corre en ríos por los cubitos de papa y jamón
export const D19Yolk: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="rise">{(tt) => {
  const br = r(h, 0) + 0.1, fl = eOut(tt, br, br + 2.6), fork = eio(tt, br - 0.7, br);
  return <>
    <Shadow x={960} y={900} w={840} k={1} />
    <div style={{ position: "absolute", left: 960 - 400, top: 260, width: 800, height: 640, borderRadius: "50%", background: "radial-gradient(ellipse at 45% 40%,#ffffff,#f1ece2 60%,#d8cfbe)", boxShadow: "0 40px 80px rgba(0,0,0,.55), inset 0 0 0 30px #f7f3ec, inset 0 0 0 34px #c8a850" }}>
      {Array.from({ length: 46 }, (_, i) => <div key={i} style={{ position: "absolute", left: 140 + rnd(i) * 500, top: 120 + rnd(i + 7) * 380, width: 48, height: 44, borderRadius: 8, background: i % 3 ? "radial-gradient(circle at 35% 30%,#f2c878,#c8862c 70%,#8a5a18)" : HAM, transform: `rotate(${rnd(i + 2) * 60}deg)`, boxShadow: "0 4px 6px rgba(0,0,0,.3)" }} />)}
      <svg width={800} height={640} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 6 }, (_, i) => { const a = i * 1.05 + 0.3, L2 = 60 + 170 * fl * (0.6 + rnd(i) * 0.6); return <path key={i} d={`M400,320 Q${400 + Math.cos(a + 0.4) * L2 * 0.6},${320 + Math.sin(a + 0.4) * L2 * 0.6} ${400 + Math.cos(a) * L2},${320 + Math.sin(a) * L2}`} stroke="#f2a614" strokeWidth={26 - 10 * fl} strokeLinecap="round" fill="none" opacity={tt > br ? 0.95 : 0} />; })}
      </svg>
      <div style={{ position: "absolute", left: 400 - 150, top: 320 - 120, width: 300, height: 240, borderRadius: "50%", background: "radial-gradient(ellipse at 45% 40%,#ffffff,#f6f3ea 70%)", boxShadow: "0 6px 14px rgba(0,0,0,.2)" }}>
        <div style={{ position: "absolute", left: 90, top: 60, width: 120 * (1 - 0.3 * fl), height: 120 * (1 - 0.3 * fl), borderRadius: "50%", background: "radial-gradient(circle at 38% 32%,#ffe08a,#f2a614 60%,#d07a0a)", boxShadow: "inset -8px -10px 16px rgba(160,70,0,.4)" }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: lerp(1500, 1010, fork), top: lerp(160, 520, fork) - 40 * eio(tt, br + 0.3, br + 1.0), width: 70, height: 420, transform: "rotate(36deg)", transformOrigin: "50% 0" }}>
      <div style={{ display: "flex", gap: 8 }}>{[0, 1, 2, 3].map((j) => <div key={j} style={{ width: 9, height: 110, borderRadius: 5, background: "linear-gradient(90deg,#9aa0a6,#f5f7f9,#80868c)" }} />)}</div>
      <div style={{ width: 66, height: 290, borderRadius: 20, marginTop: -6, background: "linear-gradient(90deg,#8a9096,#eef1f3,#767c82)" }} />
    </div>
    <Tag tt={tt} at={br + 1.4} x={960} y={970} txt="a supper I'd serve the pastor" size={56} font={HAND} col={K.goldL} />
  </>;
}}</Stage>;

// D20 · «como arena mojada»: la manteca y la harina hacen un castillito con su baldecito; entra la leche y se alisa en salsa
export const D20Sand: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const cas = phys(tt, 0.5, 6, 0.5), milk = eio(tt, 2.4, 3.6), sm = eio(tt, 3.0, 4.4);
  return <>
    <Shadow x={900} y={890} w={720} k={1} />
    <div style={{ position: "absolute", left: 900 - 340, top: 640, width: 680, height: 250, borderRadius: "0 0 60px 60px", background: "linear-gradient(90deg,#6f757b,#e4e8ec 35%,#9aa0a6 60%,#5e646a)", boxShadow: "0 30px 60px rgba(0,0,0,.55)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 20, right: 20, bottom: 20, height: 150, borderRadius: "0 0 50px 50px", background: `linear-gradient(180deg,${sm > 0.5 ? "#fbf3dc" : "#e8c888"},${sm > 0.5 ? "#efe0b8" : "#c8a060"})` }} />
    </div>
    {/* el castillito de arena */}
    <div style={{ position: "absolute", left: 900 - 150, top: 470 + (1 - cl(cas)) * -300 + sm * 200, width: 300, height: 220, opacity: 1 - sm, transform: `scaleY(${1 - 0.6 * sm})`, transformOrigin: "50% 100%" }}>
      <div style={{ position: "absolute", left: 30, top: 80, width: 240, height: 140, background: "radial-gradient(circle at 40% 30%,#f2d28a,#c8a05a)", clipPath: "polygon(0 100%,0 30%,12% 30%,12% 10%,24% 10%,24% 30%,40% 30%,40% 0,60% 0,60% 30%,76% 30%,76% 10%,88% 10%,88% 30%,100% 30%,100% 100%)" }} />
      {Array.from({ length: 30 }, (_, i) => <div key={i} style={{ position: "absolute", left: 40 + rnd(i) * 220, top: 100 + rnd(i + 4) * 110, width: 4, height: 4, borderRadius: "50%", background: "rgba(120,80,20,.5)" }} />)}
    </div>
    <div style={{ position: "absolute", left: 1210, top: 560, width: 150, height: 130, transform: `rotate(${-20 + 8 * Math.sin(tt * 2)}deg)`, opacity: 1 - sm }}>
      <div style={{ position: "absolute", left: 0, top: 20, width: 150, height: 110, clipPath: "polygon(0 0,100% 0,86% 100%,14% 100%)", background: "linear-gradient(90deg,#d8362a,#ff6a4a,#b8261a)" }} />
      <div style={{ position: "absolute", left: 10, top: -30, width: 130, height: 70, borderRadius: "50%", border: "6px solid #2a2a2a", borderBottom: "none" }} />
    </div>
    {milk > 0 && milk < 1 && <div style={{ position: "absolute", left: 880, top: 220, width: 26, height: 440, borderRadius: 13, background: "linear-gradient(180deg,#ffffff,#f4f0e6)" }} />}
    <div style={{ position: "absolute", left: 1100, top: 300, fontFamily: HAND, fontSize: 60, color: K.goldL, opacity: cl((tt - 0.9) * 3) * (1 - sm) }}>like wet sand</div>
    <div style={{ position: "absolute", left: 1100, top: 380, fontFamily: HAND, fontSize: 60, color: K.tx, opacity: sm }}>…then smooth</div>
    <Tag tt={tt} at={2.4} x={560} y={400} txt="¾ CUP MILK, SLOWLY" size={50} col={K.tx} />
  </>;
}}</Stage>;

// D21 · cinco galletitas saladas: el puño las aprieta, se quiebran en migas que llueven doradas sobre la cazuela vista desde arriba
export const D21Crackers: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const fist = eio(tt, 1.2, 1.7), crush = cl((tt - 1.7) / 0.3), rain = cl((tt - 1.8) / 2.0);
  return <>
    <Shadow x={960} y={900} w={700} k={1} />
    <div style={{ position: "absolute", left: 960 - 330, top: 520, width: 660, height: 380, borderRadius: 60, background: "linear-gradient(180deg,#ffffff,#d8d0c2)", padding: 26, boxShadow: "0 30px 60px rgba(0,0,0,.5)" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 40, overflow: "hidden", background: "radial-gradient(ellipse at 40% 35%,#fff6da,#f0d89a 60%,#d8b468)" }}>
        {Array.from({ length: 160 }, (_, i) => rnd(i + 0.5) < rain ? <div key={i} style={{ position: "absolute", left: rnd(i) * 600, top: rnd(i + 2) * 320, width: 10 + rnd(i + 8) * 16, height: 8 + rnd(i + 9) * 12, background: `rgb(${230 - rnd(i) * 30},${190 - rnd(i) * 40},${110 - rnd(i) * 40})`, clipPath: "polygon(10% 0,90% 20%,100% 80%,30% 100%,0 60%)" }} /> : null)}
        {Array.from({ length: 8 }, (_, i) => <div key={"p" + i} style={{ position: "absolute", left: 60 + i * 70, top: 120 + rnd(i) * 140, width: 30, height: 30, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#a8e08a,#4a9a2a)" }} />)}
      </div>
    </div>
    {/* las galletitas y el puño */}
    {Array.from({ length: 5 }, (_, i) => { const k = phys(tt, 0.2 + i * 0.12, 6, 0.5); return crush < 1 ? <div key={i} style={{ position: "absolute", left: 800 + i * 34 - 30 * fist, top: 280 + i * 8 - (1 - cl(k)) * 300, width: 150, height: 150, transform: `rotate(${i * 9 - 18}deg) scale(${1 - 0.4 * crush})`, background: "linear-gradient(135deg,#f6dc9a,#e0b868)", borderRadius: 8, boxShadow: "0 6px 12px rgba(0,0,0,.35)", opacity: 1 - crush }}>
      {Array.from({ length: 9 }, (_, j) => <div key={j} style={{ position: "absolute", left: 24 + (j % 3) * 46, top: 24 + Math.floor(j / 3) * 46, width: 8, height: 8, borderRadius: "50%", background: "#b88a3a" }} />)}
    </div> : null; })}
    <div style={{ position: "absolute", left: 830 + 40 * (1 - fist), top: 200 - 200 * (1 - fist) + 30 * crush, width: 240, height: 200, borderRadius: "90px 90px 70px 70px", background: "radial-gradient(ellipse at 40% 35%,#f4cdb4,#d8a488 60%,#b07a5e)", boxShadow: "0 20px 40px rgba(0,0,0,.4)", opacity: fist * (1 - eIn(tt, 2.4, 2.9)) }}>
      {[0, 1, 2, 3].map((j) => <div key={j} style={{ position: "absolute", left: 30 + j * 46, top: 30, width: 40, height: 70, borderRadius: 20, borderBottom: "4px solid rgba(140,80,60,.4)" }} />)}
    </div>
    <Tag tt={tt} at={2.2} x={1480} y={560} txt="4 OR 5 SALTINES" size={54} col={K.goldL} />
    <Tag tt={tt} at={2.8} x={1480} y={640} txt="350°F · 20 MIN" size={48} col={K.dim} />
  </>;
}}</Stage>;

// D22 · la fila de la cena a la canasta: siluetas de feligreses se encolan ante el pastel de Dorothy, el contador LINE sube
export const D22Line: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="rise" tone="night">{(tt) => {
  const n = Math.round(lerp(0, 37, eIn(tt, 0.4, D(h) - 0.8)));
  return <>
    <div style={{ position: "absolute", left: 1320, top: 560, width: 420, height: 60, background: "linear-gradient(180deg,#f4efe2,#cfc6b4)", borderRadius: 6 }} />
    <div style={{ position: "absolute", left: 1400, top: 470, width: 260, height: 100, borderRadius: "50% 50% 20px 20px", background: "radial-gradient(ellipse at 45% 30%,#f2c878,#c8862c 70%)", boxShadow: `0 0 ${40 + 10 * Math.sin(tt * 3)}px rgba(255,200,120,.6)` }} />
    {Array.from({ length: Math.min(14, n) }, (_, i) => { const x = 1260 - i * 82, bob = Math.sin(tt * 3 + i) * 4, k = cl((tt - 0.4 - i * 0.18) * 3), hgt = 300 + rnd(i) * 70;
      return <div key={i} style={{ position: "absolute", left: x - 30 - (1 - k) * 120, top: 880 - hgt + bob, width: 64, height: hgt, opacity: k }}>
        <div style={{ position: "absolute", left: 10, top: 0, width: 44, height: 50, borderRadius: "50%", background: "#1c1410" }} />
        <div style={{ position: "absolute", left: 0, top: 54, width: 64, height: hgt - 54, borderRadius: "28px 28px 8px 8px", background: ["#2a1d16", "#3a2a1e", "#22160f"][i % 3] }} />
        {i % 2 === 0 && <div style={{ position: "absolute", left: 50, top: 130, width: 50, height: 14, borderRadius: 7, background: "#f4efe2" }} />}
      </div>; })}
    <div style={{ position: "absolute", left: 230, top: 300, fontFamily: SANS, fontWeight: 900, fontSize: 70, color: K.goldL }}>LINE: {n}</div>
    <Tag tt={tt} at={1.4} x={1530} y={380} txt="DOROTHY'S POT PIE" size={50} col={K.tx} />
    <Tag tt={tt} at={2.6} x={560} y={420} txt="before the prayer was over" size={46} font={HAND} col={K.dim} />
  </>;
}}</Stage>;

// D23 · la masa baja como sábana sobre el ramekin, el cuchillo corta la X y por la X salen dos chorritos de vapor
export const D23CrustX: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const drape = eOut(tt, 0.4, 1.4), c1 = eio(tt, r(h, 0) - 0.2, r(h, 0) + 0.3), c2 = eio(tt, r(h, 0) + 0.4, r(h, 0) + 0.9), puff = cl((tt - r(h, 0) - 1.0) / 0.6), gold = eio(tt, r(h, 0) + 1.6, D(h) - 0.6);
  return <>
    <Shadow x={960} y={900} w={520} k={1} />
    <div style={{ position: "absolute", left: 960 - 230, top: 640, width: 460, height: 250, borderRadius: "10px 10px 40px 40px", background: "repeating-linear-gradient(90deg,#ffffff 0 18px,#ece8e0 18px 22px)", boxShadow: "0 30px 60px rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", left: 960 - 270, top: 470 + 180 * drape, width: 540, height: 230 - 60 * drape, borderRadius: "50%", background: `radial-gradient(ellipse at 45% 35%,rgb(${lerp(250, 232, gold)},${lerp(232, 168, gold)},${lerp(196, 80, gold)}),rgb(${lerp(230, 196, gold)},${lerp(204, 128, gold)},${lerp(160, 50, gold)}))`, boxShadow: "inset 0 -14px 24px rgba(120,70,20,.35), 0 14px 24px rgba(0,0,0,.35)", transform: `scale(${1 + 0.04 * Math.sin(tt * 2) * puff})` }}>
      {[c1, c2].map((c, i) => <div key={i} style={{ position: "absolute", left: 270 - 70, top: 110 - 6 - 40 * drape, width: 140 * c, height: 10, borderRadius: 5, background: "#7a4a1a", transform: `rotate(${i ? -35 : 35}deg)`, transformOrigin: "0 50%" }} />)}
      {Array.from({ length: 24 }, (_, i) => <div key={"c" + i} style={{ position: "absolute", left: `${50 + 47 * Math.cos(i / 24 * Math.PI * 2)}%`, top: `${50 + 44 * Math.sin(i / 24 * Math.PI * 2)}%`, width: 30, height: 18, margin: -9, borderRadius: "50%", background: "rgba(180,110,40,.35)" }} />)}
    </div>
    {puff > 0 && [0, 1].map((i) => Array.from({ length: 3 }, (_, j) => { const ph = (tt * 0.8 + j / 3 + i * 0.5) % 1; return <div key={`${i}${j}`} style={{ position: "absolute", left: 940 + (i ? 30 : -30) + ph * (i ? 50 : -50), top: 560 - ph * 300, width: 50 + ph * 40, height: 90, borderRadius: "50%", background: "rgba(255,255,255,.3)", filter: "blur(12px)", opacity: (1 - ph) * puff }} />; }))}
    <div style={{ position: "absolute", left: 960 + 120 * (c2 > 0 ? c2 : c1) - 40, top: 420 - 200 * (1 - Math.max(c1 > 0 ? 1 : 0, 0)) + 60 * (c1 + c2) / 2, width: 50, height: 260, transform: "rotate(30deg)", opacity: cl((tt - r(h, 0) + 0.8) * 3) * (1 - eIn(tt, r(h, 0) + 1.0, r(h, 0) + 1.4)) }}>
      <div style={{ width: 50, height: 160, borderRadius: "30px 30px 4px 4px", background: "linear-gradient(90deg,#8d939a,#f4f6f8 45%,#b7bdc3)" }} />
      <div style={{ width: 36, height: 100, marginLeft: 7, borderRadius: 8, background: "linear-gradient(90deg,#3a2414,#6b4426,#2e1c10)" }} />
    </div>
    <Tag tt={tt} at={r(h, 0) + 1.2} x={1480} y={560} txt="400°F · 20–25 MIN" size={52} col={K.goldL} />
    <Tag tt={tt} at={0.8} x={480} y={420} txt="store-bought crust" size={48} font={HAND} col={K.dim} />
  </>;
}}</Stage>;

// D24 · el reloj pulsera de Mildred: el arco de 2 horas se completa y la fuente de jamón se desliza fuera de la mesa
export const D24Watch: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const p = eio(tt, 0.5, D(h) - 1.6), go = eio(tt, D(h) - 1.6, D(h) - 0.6), deg = p * 60;
  return <>
    <div style={{ position: "absolute", left: 360, top: 360, width: 160, height: 560, borderRadius: 30, background: "linear-gradient(90deg,#5a3418,#8a5a2c 50%,#4a2a10)" }} />
    <Shadow x={440} y={900} w={300} k={1} />
    <div style={{ position: "absolute", left: 440 - 190, top: 450, width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle at 40% 32%,#fffdf6,#efe6d0 60%,#cbb98e)", boxShadow: "0 0 0 16px #c9a24a, 0 0 0 22px #7a5a1a, 0 30px 60px rgba(0,0,0,.55)" }}>
      <svg width={380} height={380} style={{ position: "absolute", inset: 0 }}><circle cx={190} cy={190} r={150} stroke={K.red} strokeWidth={22} fill="none" strokeDasharray={`${p * 2 * Math.PI * 150 / 6} 2000`} transform="rotate(-90 190 190)" opacity={0.85} /></svg>
      {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: "50%", top: 14, width: 4, height: 22, marginLeft: -2, background: "#3a2a1a", transformOrigin: "50% 176px", transform: `rotate(${i * 30}deg)` }} />)}
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 10, height: 110, marginLeft: -5, marginTop: -110, borderRadius: 5, background: K.ink, transformOrigin: "50% 100%", transform: `rotate(${deg}deg)` }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 6, height: 150, marginLeft: -3, marginTop: -150, borderRadius: 3, background: K.wine, transformOrigin: "50% 100%", transform: `rotate(${p * 720}deg)` }} />
    </div>
    <div style={{ position: "absolute", left: 300, top: 260, fontFamily: SANS, fontWeight: 900, fontSize: 80, color: p > 0.98 ? K.red : K.goldL }}>{Math.floor(p * 2)}:{String(Math.floor((p * 120) % 60)).padStart(2, "0")}</div>
    {/* la mesa del buffet y el jamón que se va */}
    <div style={{ position: "absolute", left: 900, top: 720, width: 900, height: 40, borderRadius: 6, background: "linear-gradient(180deg,#f4efe2,#cfc6b4)" }} />
    <div style={{ position: "absolute", left: 1150 + 700 * go, top: 590 + 60 * go, width: 380, height: 140, opacity: 1 - go }}>
      <div style={{ position: "absolute", left: 0, top: 90, width: 380, height: 40, borderRadius: "50%", background: "linear-gradient(180deg,#f4f6f8,#9aa0a6)" }} />
      <div style={{ position: "absolute", left: 60, top: 0, width: 260, height: 120, borderRadius: "50% 50% 30% 30%", background: GLAZE }} />
    </div>
    <Tag tt={tt} at={D(h) - 1.4} x={1350} y={430} txt="BACK DOWNSTAIRS" size={58} col={K.red} />
    <Tag tt={tt} at={1.0} x={1350} y={340} txt="TWO HOURS. THAT'S ALL." size={50} col={K.tx} />
  </>;
}}</Stage>;

// D25 · el glaseado se despega como una calcomanía y cae en un platito; en la sartén, el que quedó se quema: «BITTER»
export const D25Glaze: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const peel = eio(tt, 0.6, 2.0), drop = eIn(tt, 2.0, 2.6), burn = eio(tt, 2.8, 4.2);
  return <>
    <Shadow x={720} y={880} w={520} k={1} />
    <div style={{ position: "absolute", left: 720 - 250, top: 500, width: 500, height: 360, borderRadius: "48% 52% 44% 50%", background: HAM, boxShadow: "inset -24px -30px 50px rgba(120,40,30,.45)" }} />
    {/* la capa de glaseado que se levanta desde la esquina */}
    <div style={{ position: "absolute", left: 720 - 250 + 200 * drop, top: 500 + 340 * drop, width: 500, height: 360, borderRadius: "48% 52% 44% 50%", background: GLAZE, transformOrigin: "100% 0", transform: `perspective(1200px) rotateY(${-70 * peel}deg) rotateX(${20 * peel}deg) scale(${1 - 0.6 * drop})`, boxShadow: "0 20px 40px rgba(0,0,0,.45)", opacity: 1 - eIn(tt, 2.5, 2.7) * 0.2 }}>
      {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: "absolute", left: 40 + i * 48, top: 30, width: 6, height: 290, borderRadius: 3, background: "rgba(90,40,10,.45)", transform: `rotate(${18 - i * 2}deg)` }} />)}
      <div style={{ position: "absolute", inset: 0, borderRadius: "inherit", background: "linear-gradient(120deg,rgba(255,240,200,.0),rgba(255,240,200,.45) 40%,rgba(255,240,200,0) 60%)", transform: `translateX(${(tt * 200) % 600 - 300}px)` }} />
    </div>
    <div style={{ position: "absolute", left: 900, top: 840, width: 260, height: 50, borderRadius: "50%", background: "radial-gradient(ellipse,#ffffff,#d8d2c6)", opacity: cl(drop * 3) }} />
    <div style={{ position: "absolute", left: 930, top: 910, fontFamily: HAND, fontSize: 46, color: K.goldL, opacity: cl((tt - 2.4) * 3) }}>for snacking</div>
    {/* la sartén donde se quema */}
    <div style={{ position: "absolute", left: 1270, top: 540, width: 420, height: 280, borderRadius: "50%", background: "radial-gradient(ellipse,#2c2a29,#050505)", boxShadow: "0 30px 60px rgba(0,0,0,.6)", padding: 40, opacity: cl((tt - 2.4) * 3) }}>
      <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: `radial-gradient(ellipse,rgb(${lerp(200, 40, burn)},${lerp(110, 20, burn)},${lerp(30, 10, burn)}),#1a0e06)` }} />
    </div>
    {burn > 0.3 && Array.from({ length: 5 }, (_, i) => { const ph = (tt * 0.6 + i / 5) % 1; return <div key={i} style={{ position: "absolute", left: 1400 + i * 40, top: 520 - ph * 260, width: 40, height: 90, borderRadius: "50%", background: "rgba(60,50,45,.55)", filter: "blur(12px)", opacity: (1 - ph) * burn }} />; })}
    <Tag tt={tt} at={3.6} x={1480} y={900} txt="BURNS · BITTER" size={56} col={K.red} />
  </>;
}}</Stage>;

// D26 · la noche en el bol: una taza de porotos secos bajo el agua, la luna cruza la ventana y amanecen al doble de tamaño
export const D26Soak: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="night">{(tt) => {
  const p = eio(tt, 0.6, D(h) - 0.8), sun = cl((p - 0.6) * 2.5);
  return <>
    <div style={{ position: "absolute", left: 1220, top: 200, width: 520, height: 360, borderRadius: 10, overflow: "hidden", background: `linear-gradient(180deg,rgb(${lerp(14, 140, sun)},${lerp(20, 190, sun)},${lerp(50, 240, sun)}),rgb(${lerp(30, 250, sun)},${lerp(30, 210, sun)},${lerp(60, 160, sun)}))`, boxShadow: "inset 0 0 0 18px #f4efe2, 0 20px 40px rgba(0,0,0,.4)" }}>
      <div style={{ position: "absolute", left: lerp(40, 420, p), top: 200 - Math.sin(p * Math.PI) * 150, width: 70, height: 70, borderRadius: "50%", background: sun > 0.3 ? "radial-gradient(circle,#fff6b0,#ffc040)" : "radial-gradient(circle at 35% 35%,#fffdf0,#d8d4c0)", boxShadow: `0 0 40px ${sun > 0.3 ? "rgba(255,200,80,.8)" : "rgba(255,255,230,.5)"}` }} />
      <div style={{ position: "absolute", left: 251, top: 0, width: 18, height: "100%", background: "#f4efe2" }} />
      <div style={{ position: "absolute", top: 171, left: 0, width: "100%", height: 18, background: "#f4efe2" }} />
    </div>
    <Shadow x={760} y={890} w={680} k={1} />
    <div style={{ position: "absolute", left: 760 - 330, top: 560, width: 660, height: 320, borderRadius: "0 0 330px 330px", background: "linear-gradient(90deg,rgba(255,255,255,.25),rgba(255,255,255,.5) 30%,rgba(255,255,255,.18))", border: "4px solid rgba(255,255,255,.5)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 50, bottom: 0, background: "rgba(150,190,220,.35)" }} />
      {Array.from({ length: 34 }, (_, i) => { const s = lerp(1, 1.9, p); return <div key={i} style={{ position: "absolute", left: 90 + rnd(i) * 440, top: 200 + rnd(i + 5) * 80 - p * 60 * rnd(i + 9), width: 34 * s, height: 22 * s, borderRadius: "50%", background: "radial-gradient(ellipse at 35% 30%,#ffffff,#ece6d4 60%,#cfc6ae)", boxShadow: "0 3px 4px rgba(0,0,0,.2)", transform: `rotate(${rnd(i + 2) * 180}deg)` }} />; })}
    </div>
    <div style={{ position: "absolute", left: 440, top: 380, fontFamily: SANS, fontWeight: 900, fontSize: 80, color: K.goldL }}>{p < 0.6 ? "OVERNIGHT" : "×2"}</div>
    <Tag tt={tt} at={0.8} x={760} y={980} txt="1 CUP DRIED NAVY BEANS" size={50} col={K.tx} />
  </>;
}}</Stage>;

// D27 · la casita en corte (casa de muñecas): el olor de los porotos sale de la olla y sube por los cuartos de a uno
export const D27House: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="rise">{(tt) => {
  const R = [[0, 2, "KITCHEN"], [1, 2, "PARLOR"], [0, 1, "BEDROOM"], [1, 1, "SEWING ROOM"], [0, 0, "ATTIC"]], p = eio(tt, 0.6, D(h) - 0.8) * 5;
  return <>
    <div style={{ position: "absolute", left: 960 - 420, top: 180, width: 840, height: 140, clipPath: "polygon(50% 0,100% 100%,0 100%)", background: "linear-gradient(180deg,#8e1d2b,#5a0e1c)" }} />
    <div style={{ position: "absolute", left: 960 - 380, top: 320, width: 760, height: 600, background: "#f4ead4", boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 0 0 14px #c8b48a" }}>
      {R.map(([cx, cy, n], i) => { const lit = cl(p - i); return <div key={i} style={{ position: "absolute", left: 14 + (cx as number) * 366, top: 14 + (2 - (cy as number)) * 190 - (i === 4 ? 0 : 0), width: i === 4 ? 732 : 366, height: 190, border: "4px solid #c8b48a", background: `rgba(255,${lerp(240, 210, lit)},${lerp(220, 150, lit)},${0.3 + 0.5 * lit})`, display: "flex", alignItems: "flex-end", padding: 14, fontFamily: SANS, fontWeight: 900, fontSize: 30, color: "#5a3e22", ...(i === 4 ? { top: 14 - 190 + 190 } : {}) }}>{n}</div>; })}
      {/* la olla en la cocina */}
      <div style={{ position: "absolute", left: 120, top: 470, width: 130, height: 90, borderRadius: "0 0 30px 30px", background: "linear-gradient(90deg,#6f757b,#e4e8ec,#5e646a)" }} />
      {/* la estela del olor */}
      <svg width={760} height={600} style={{ position: "absolute", inset: 0 }}>{[0, 1, 2].map((j) => <path key={j} d={`M185,460 C${300 + j * 30},380 ${120 - j * 20},300 ${420 + j * 40},250 S${200},120 ${520 - j * 60},60`} stroke="rgba(240,200,120,.75)" strokeWidth={10 - j * 2} fill="none" strokeLinecap="round" strokeDasharray="1400" strokeDashoffset={1400 - 1400 * cl(p / 5 + j * 0.05)} />)}</svg>
    </div>
    <Tag tt={tt} at={1.0} x={1560} y={500} txt="2 HOURS" size={70} col={K.goldL} />
    <Tag tt={tt} at={2.0} x={1560} y={590} txt="lid a little crooked" size={46} font={HAND} col={K.dim} />
  </>;
}}</Stage>;

// D28 · la olla de porotos se reparte en tres táperes que se rotulan: TONIGHT · TOMORROW · FREEZER (este se escarcha)
export const D28Three: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const N2 = ["TONIGHT", "TOMORROW", "FREEZER"];
  return <>
    {N2.map((n, i) => { const a = 0.5 + i * 0.9, f = eio(tt, a, a + 0.6), x = 560 + i * 400, fr = i === 2 ? eio(tt, a + 0.9, a + 2.0) : 0;
      return <React.Fragment key={n}>
        <Shadow x={x} y={880} w={320} k={1} />
        <div style={{ position: "absolute", left: x - 150, top: 640, width: 300, height: 230, borderRadius: 24, background: "linear-gradient(90deg,rgba(255,255,255,.3),rgba(255,255,255,.55) 40%,rgba(255,255,255,.25))", border: "4px solid rgba(255,255,255,.6)", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${f * 75}%`, background: "radial-gradient(ellipse at 40% 20%,#e8d2a0,#b8905a 70%)" }}>{Array.from({ length: 14 }, (_, j) => <div key={j} style={{ position: "absolute", left: 20 + rnd(j + i * 20) * 240, top: 10 + rnd(j + 7) * 100, width: 20, height: 13, borderRadius: "50%", background: "#f4ecd8" }} />)}</div>
          <div style={{ position: "absolute", inset: 0, background: `rgba(220,240,255,${0.6 * fr})`, boxShadow: `inset 0 0 40px rgba(255,255,255,${fr})` }} />
        </div>
        {f > 0 && f < 1 && <div style={{ position: "absolute", left: x - 20, top: 400, width: 40, height: 260, borderRadius: 20, background: "linear-gradient(180deg,#d8b480,#b8905a)" }} />}
        <div style={{ position: "absolute", left: x, top: 590, transform: `translateX(-50%) rotate(${(i - 1) * 3}deg)`, background: "#fff7d6", padding: "6px 16px", borderRadius: 6, fontFamily: MARK, fontSize: 44, color: "#1b1b22", clipPath: `inset(0 ${(1 - eio(tt, a + 0.5, a + 1.0)) * 100}% 0 0)` }}>{n}</div>
      </React.Fragment>; })}
    {/* el cucharón que va de uno a otro */}
    {(() => { const i = Math.min(2, Math.floor(cl((tt - 0.5) / 2.7) * 3)); const x = 560 + i * 400; return tt < 3.4 ? <div style={{ position: "absolute", left: x - 60, top: 300 + 10 * Math.sin(tt * 4), width: 360, height: 120, transform: "rotate(30deg)" }}>
      <div style={{ width: 130, height: 90, borderRadius: "0 0 65px 65px", background: "linear-gradient(90deg,#8d939a,#f4f6f8,#9aa0a6)" }} />
      <div style={{ position: "absolute", left: 120, top: 0, width: 240, height: 18, borderRadius: 9, background: "#c8ccd0" }} />
    </div> : null; })()}
    <Tag tt={tt} at={3.6} x={960} y={380} txt="1 POT = 3 SUPPERS" size={64} col={K.goldL} />
  </>;
}}</Stage>;

// D29 · la tijera de cocina corta la feta en tiras y las tiras en cubitos, snip snip snip, que caen al bol
export const D29Scissors: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const snips = Math.floor(cl((tt - 0.6) / 3.2) * 10), op = Math.abs(Math.sin(tt * 7)) * 22;
  return <>
    <Shadow x={960} y={900} w={520} k={1} />
    <div style={{ position: "absolute", left: 960 - 240, top: 720, width: 480, height: 170, borderRadius: "0 0 240px 240px", background: "linear-gradient(90deg,#d9e6ee,#ffffff 40%,#b9c8d2)" }} />
    {Array.from({ length: snips }, (_, i) => { const k = cl((tt - 0.6 - (i + 1) * 0.32) / 0.5); return <div key={i} style={{ position: "absolute", left: 830 + (i % 5) * 48 + (rnd(i) - 0.5) * 20, top: lerp(470, 730 - Math.floor(i / 5) * 18, k), width: 42, height: 38, borderRadius: 6, background: HAM, transform: `rotate(${k * 180 + rnd(i) * 40}deg)`, boxShadow: "0 3px 5px rgba(0,0,0,.3)" }} />; })}
    <div style={{ position: "absolute", left: 700 + snips * 24, top: 420, width: 520 - snips * 24, height: 70, borderRadius: 10, background: HAM, boxShadow: "0 8px 14px rgba(0,0,0,.35)" }} />
    {/* la tijera */}
    <div style={{ position: "absolute", left: 640 + snips * 24, top: 330, width: 400, height: 260, transform: "rotate(-90deg)", transformOrigin: "30% 50%" }}>
      {[1, -1].map((s) => <div key={s} style={{ position: "absolute", left: 0, top: 100, width: 400, height: 60, transformOrigin: "120px 30px", transform: `rotate(${s * op}deg)` }}>
        <div style={{ position: "absolute", left: 120, top: 18, width: 280, height: 24, clipPath: s > 0 ? "polygon(0 0,100% 50%,0 100%)" : "polygon(0 0,100% 50%,0 100%)", background: "linear-gradient(180deg,#f4f6f8,#8a9096)" }} />
        <div style={{ position: "absolute", left: 0, top: s > 0 ? -40 : 40, width: 120, height: 80, borderRadius: "50%", border: "18px solid #d9362a" }} />
      </div>)}
      <div style={{ position: "absolute", left: 110, top: 120, width: 20, height: 20, borderRadius: "50%", background: "#444" }} />
    </div>
    <Tag tt={tt} at={1.0} x={1480} y={420} txt="SNIP · SNIP · SNIP" size={56} col={K.goldL} />
    <Tag tt={tt} at={2.0} x={1480} y={510} txt="no big knife" size={50} font={HAND} col={K.tx} />
  </>;
}}</Stage>;

// D30 · la tarjeta de cliente de un diner: 7 agujeros que se perforan de a uno con el nombre de cada cena
export const D30Punch: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="rise">{(tt) => {
  const N3 = ["SCALLOPED", "FRIED RICE", "CABBAGE", "HASH", "NOODLE BAKE", "POT PIE", "HAM & BEANS"], st = Math.max(0.7, (D(h) - 1.4) / 7), cur = Math.min(6, Math.floor(cl((tt - 0.5) / (st * 7)) * 7));
  return <>
    <Shadow x={960} y={860} w={1100} k={1} />
    <div style={{ position: "absolute", left: 960 - 560, top: 330, width: 1120, height: 500, borderRadius: 20, background: "linear-gradient(160deg,#fbf3e4,#efe0c0)", boxShadow: "0 30px 60px rgba(0,0,0,.5)", transform: `rotate(-2deg) rotateX(${8 * Math.sin(tt * 0.6)}deg)`, padding: 34 }}>
      <div style={{ fontFamily: SERIF, fontSize: 52, color: K.wine }}>Loretta's Ham Week</div>
      <div style={{ fontFamily: HAND, fontSize: 38, color: "#6a5a40" }}>one ham · seven suppers · nothing in the trash</div>
      {N3.map((n, i) => { const k = cl((tt - 0.5 - i * st) / 0.25), x = 40 + i * 148;
        return <div key={n} style={{ position: "absolute", left: x, top: 220, width: 130, textAlign: "center" }}>
          <div style={{ width: 92, height: 92, margin: "0 auto", borderRadius: "50%", border: "4px dashed #b8a070", background: k > 0.5 ? "radial-gradient(circle,#1a1410 60%,#3a2a1a)" : "transparent", transform: `scale(${1 + 0.2 * Math.sin(k * Math.PI)})`, boxShadow: k > 0.5 ? "inset 0 6px 10px rgba(0,0,0,.6)" : "none" }} />
          <div style={{ marginTop: 14, fontFamily: SANS, fontWeight: 900, fontSize: 24, color: i === cur ? K.wine : K.ink, lineHeight: 1.1 }}>{i + 1}<br />{n}</div>
        </div>; })}
    </div>
    {/* la perforadora */}
    <div style={{ position: "absolute", left: 960 - 560 + 40 + cur * 148 + 20, top: 340 - 40 * Math.abs(Math.sin(((tt - 0.5) / st) * Math.PI)), width: 110, height: 200, opacity: tt > 0.4 ? 1 : 0 }}>
      <div style={{ width: 110, height: 60, borderRadius: 16, background: "linear-gradient(180deg,#d8dde2,#8a9096)" }} />
      <div style={{ width: 30, height: 140, marginLeft: 40, background: "linear-gradient(90deg,#9aa0a6,#eef1f3,#7c8288)" }} />
    </div>
  </>;
}}</Stage>;

import { Odo as OdoK, Stage as StageK, H as HK } from "./kit";
import { Img as ImgK } from "remotion";
type CPk = { t: number; h: HK };

// ───────────── v6 (ronda 3 del evaluador): el OBJETO es una foto real de la cocina de Loretta; la cámara viaja en curva hacia él,
// un elemento físico en código actúa sobre la foto y una sola palabra grande vive dentro de la escena (nunca arriba a la izquierda).
const FA: React.CSSProperties = { position: "absolute" };
type Fx = (tt: number, d: number) => React.ReactNode;   // d = duración del componente
const Foto: React.FC<CPk & { id: string; fx: number; fy: number; z?: number; word: string; wx?: number; wy?: number; wa?: number; mode?: "iris" | "wipe" | "blinds" | "split" | "drop" | "rise"; fx2?: Fx }> = ({ t, h, id, fy, word, wa = 1.4, mode = "iris", fx2 }) => <StageK t={t} h={h} mode={mode} table={false}>{(tt) => {
  const d = h.out - h.at, k = eio(tt, 0, d), s = lerp(1.0, 1.1, k), pan = 0.6 * 960 * (s - 1) * (1 - 2 * k), oy = fy * 1080;
  const ca = phys(tt, 0.05, 6, 0.55), sweep = cl((tt - 0.6) / 2.2), CW = 1540, CH = 866, CX = (1920 - CW) / 2, CY = 34;
  const fs = Math.min(104, 1640 / (word.length * 0.6));
  return <>
    <ImgK src={img(id)} style={{ ...FA, left: -160, top: -90, width: 2240, height: 1260, objectFit: "cover", filter: "blur(34px) brightness(.42) saturate(1.15)", transform: `scale(${lerp(1.06, 1.0, k)})` }} />
    <div style={{ ...FA, left: CX, top: CY, width: CW, height: CH, transform: `translateY(${(1 - ca) * 60}px) rotate(${lerp(-1.1, 0, ca) + lerp(0, 0.35, k)}deg)`, borderRadius: 14, overflow: "hidden", boxShadow: "0 30px 70px rgba(0,0,0,.6), 0 6px 14px rgba(0,0,0,.45)", outline: "6px solid rgba(250,244,230,.92)" }}>
      <div style={{ ...FA, left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 540px", transform: `translate(${(CW - 1920) / 2 + pan}px, ${(CH - 1080) / 2}px) scale(${s * CW / 1920 * 1.0})`, }}>
        <ImgK src={img(id)} style={{ width: 1920, height: 1080, objectFit: "cover" }} />
        {fx2 && fx2(tt, d)}
      </div>
      <div style={{ ...FA, inset: 0, background: `linear-gradient(105deg, transparent ${sweep * 140 - 40}%, rgba(255,246,220,.16) ${sweep * 140 - 25}%, transparent ${sweep * 140 - 10}%)` }} />
    </div>
    <div style={{ ...FA, left: 960, top: CY + CH + (1080 - CY - CH) / 2 + 4, transform: `translate(-50%,-50%) translateY(${(1 - phys(tt, wa, 7, 0.5)) * 40}px) scale(${0.88 + 0.12 * phys(tt, wa, 7, 0.5)})`, opacity: cl((tt - wa) * 4), fontFamily: SERIF, fontWeight: 900, fontSize: fs, color: K.goldL, letterSpacing: 2, whiteSpace: "nowrap", textShadow: "0 5px 0 rgba(60,30,0,.55), 0 12px 30px rgba(0,0,0,.8)" }}>{word}</div>
  </>;
}}</StageK>;
// monedas que caen con rebote y se apilan
const Coins = (tt: number, a: number, x: number, y: number, n = 6): React.ReactNode => tt < -1e9 && Array.from({ length: n }, (_, i) => {
  const st = a + i * 0.18, dd = tt - st; if (dd < 0) return null;
  const T = 0.42, yy = dd < T ? lerp(-500, 0, (dd / T) ** 2) : -Math.abs(Math.sin((dd - T) * 12)) * 26 * Math.exp(-(dd - T) * 6);
  return <div key={i} style={{ ...FA, left: x + (i % 3) * 22 - 30, top: y + yy - i * 9, width: 118, height: 40, borderRadius: "50%", background: "linear-gradient(180deg,#f4f0e8,#a8a49a 60%,#6a665e)", boxShadow: "0 3px 0 #5a564e, 0 8px 10px rgba(0,0,0,.4)" }} />;
});
// vapor en volutas sobre la foto
const Vapor = (tt: number, x: number, y: number, w = 220, k = 1): React.ReactNode => Array.from({ length: 6 }, (_, i) => {
  const p = (tt * 0.42 + i / 6) % 1, sz = 70 + 120 * p;
  return <div key={i} style={{ ...FA, left: x - w / 2 + rnd(i) * w + Math.sin(tt * 1.3 + i) * 34 * p - sz / 2, top: y - p * 380 - sz / 2, width: sz, height: sz * 1.3, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,255,255,.4),transparent 68%)", filter: "blur(9px)", opacity: k * Math.sin(p * Math.PI) }} />;
});
// granos / partículas que caen desde un punto
const Lluvia = (tt: number, a: number, x: number, y: number, h0: number, col: string, n = 40, sz = 9): React.ReactNode => Array.from({ length: n }, (_, i) => {
  if (tt < a) return null;
  const p = ((tt - a) * 1.1 + rnd(i)) % 1;
  return <div key={i} style={{ ...FA, left: x + (rnd(i + 5) - 0.5) * 40 * (1 + p), top: y + p * p * h0, width: sz, height: sz, borderRadius: "40%", background: col, transform: `rotate(${i * 50}deg)`, opacity: 1 - p * 0.6 }} />;
});
// aro de cuenta regresiva alrededor de un objeto de la foto
const Aro = (tt: number, a: number, b: number, x: number, y: number, r0: number, col = "#f8dda4"): React.ReactNode => { if (tt > -1) return null;
  const p = 1 - eio(tt, a, b), C = 2 * Math.PI * r0;
  return <svg width={r0 * 2 + 40} height={r0 * 2 + 40} style={{ ...FA, left: x - r0 - 20, top: y - r0 - 20, transform: "rotate(-90deg)", opacity: cl((tt - a + 0.3) * 4) }}><circle cx={r0 + 20} cy={r0 + 20} r={r0} fill="none" stroke="rgba(0,0,0,.35)" strokeWidth={16} /><circle cx={r0 + 20} cy={r0 + 20} r={r0} fill="none" stroke={col} strokeWidth={12} strokeDasharray={`${C * p} ${C}`} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px ${col})` }} /></svg>;
};
// destello que pulsa sobre un punto de la foto
const Pulso = (tt: number, a: number, x: number, y: number, col = "rgba(255,240,190,.9)"): React.ReactNode => tt < -1e9 && tt > a && [0, 1].map((i) => { const p = ((tt - a) * 0.8 + i * 0.5) % 1; return <div key={i} style={{ ...FA, left: x - 30 - p * 120, top: y - 30 - p * 120, width: 60 + p * 240, height: 60 + p * 240, borderRadius: "50%", border: `6px solid ${col}`, opacity: 1 - p }} />; });
// contador de rodillos dentro de la escena
const Rodillo: React.FC<{ tt: number; d: number; a: number; b: number; v: number; x: number; y: number; pre?: string; dec?: number; size?: number }> = ({ tt, d, a, b, v, x, y, pre, dec = 0, size = 120 }) => tt < -1e9 && <div style={{ ...FA, left: x, top: y, opacity: 1 - cl((tt - d + 0.45) * 3), transform: `translate(-50%,-50%) scale(${phys(tt, a - 0.3, 7, 0.5)})` }}><OdoK tt={tt} a={a} b={b} v={v} pre={pre} dec={dec} size={size} /></div>;


export const K01: React.FC<CPk> = (p) => <Foto {...p} id="k01" fx={0.5} fy={0.55} z={1.32} word="AND IT'S JUST YOU" wx={960} wy={950} mode="iris"  />;
export const K02: React.FC<CPk> = (p) => <Foto {...p} id="k02" fx={0.5} fy={0.55} z={1.45} word="BEST SUPPER OF THE WEEK" wx={960} wy={180} mode="wipe" fx2={(tt) => Vapor(tt, 960, 520, 420, 0.9)} />;
export const K03: React.FC<CPk> = (p) => <Foto {...p} id="k03" fx={0.5} fy={0.55} z={1.38} word="FOIL DOESN'T SEAL" wx={960} wy={950} mode="rise"  />;
export const K04: React.FC<CPk> = (p) => <Foto {...p} id="k04" fx={0.5} fy={0.55} z={1.32} word="NOT A SLICE" wx={960} wy={180} mode="blinds"  />;
export const K05: React.FC<CPk> = (p) => <Foto {...p} id="k05" fx={0.5} fy={0.55} z={1.45} word="FLAT AS PAPER" wx={960} wy={950} mode="drop" fx2={(tt) => Lluvia(tt, 0.3, 960, 100, 760, "rgba(230,245,255,.85)", 46, 7)} />;
export const K06: React.FC<CPk> = (p) => <Foto {...p} id="k06" fx={0.5} fy={0.55} z={1.38} word="SALT GOES LAST" wx={960} wy={180} mode="split" fx2={(tt) => Lluvia(tt, 0.6, 960, 260, 420, "rgba(250,248,240,.9)", 40, 7)} />;
export const K07: React.FC<CPk> = (p) => <Foto {...p} id="k07" fx={0.5} fy={0.55} z={1.32} word="FREEZE IT" wx={960} wy={950} mode="iris" fx2={(tt) => Lluvia(tt, 0.3, 960, 100, 760, "rgba(230,245,255,.85)", 46, 7)} />;
export const K08: React.FC<CPk> = (p) => <Foto {...p} id="k08" fx={0.5} fy={0.55} z={1.45} word="JUST ONE HOUR" wx={960} wy={180} mode="wipe"  />;
export const K09: React.FC<CPk> = (p) => <Foto {...p} id="k09" fx={0.5} fy={0.55} z={1.38} word="SUGAR-CUBE SIZE" wx={960} wy={950} mode="rise"  />;
export const K10: React.FC<CPk> = (p) => <Foto {...p} id="k10" fx={0.5} fy={0.55} z={1.32} word="HALF A CUP" wx={960} wy={180} mode="blinds"  />;
export const K11: React.FC<CPk> = (p) => <><Foto {...p} id="k11" fx={0.5} fy={0.55} z={1.45} word="WRITE THE DATE" wx={960} wy={950} mode="drop"  /><Rodillo tt={p.t - p.h.at} d={p.h.out - p.h.at} a={0.7} b={3.2} v={7} x={1500} y={300} size={150} /></>;
export const K12: React.FC<CPk> = (p) => <Foto {...p} id="k12" fx={0.5} fy={0.55} z={1.38} word="BUTTER, THEN POTATOES" wx={960} wy={180} mode="split"  />;
export const K13: React.FC<CPk> = (p) => <><Foto {...p} id="k13" fx={0.5} fy={0.55} z={1.32} word="LYNN · 1989" wx={960} wy={950} mode="iris"  /><Rodillo tt={p.t - p.h.at} d={p.h.out - p.h.at} a={0.7} b={3.2} v={1989} x={1500} y={300} size={150} /></>;
export const K14: React.FC<CPk> = (p) => <Foto {...p} id="k14" fx={0.5} fy={0.55} z={1.45} word="BETTER THAN TAKEOUT" wx={960} wy={180} mode="wipe" fx2={(tt) => Vapor(tt, 960, 520, 420, 0.9)} />;
export const K15: React.FC<CPk> = (p) => <Foto {...p} id="k15" fx={0.5} fy={0.55} z={1.38} word="A QUARTER HEAD" wx={960} wy={950} mode="rise"  />;
export const K16: React.FC<CPk> = (p) => <Foto {...p} id="k16" fx={0.5} fy={0.55} z={1.32} word="COOKS DOWN" wx={960} wy={180} mode="blinds" fx2={(tt) => Vapor(tt, 960, 520, 420, 0.9)} />;
export const K17: React.FC<CPk> = (p) => <><Foto {...p} id="k17" fx={0.5} fy={0.55} z={1.45} word="3 MINUTES" wx={960} wy={950} mode="drop"  /><Rodillo tt={p.t - p.h.at} d={p.h.out - p.h.at} a={0.7} b={3.2} v={3} x={1500} y={300} size={150} /></>;
export const K18: React.FC<CPk> = (p) => <Foto {...p} id="k18" fx={0.5} fy={0.55} z={1.38} word="LEAVE THEM ALONE" wx={960} wy={180} mode="split" fx2={(tt) => Vapor(tt, 960, 520, 420, 0.9)} />;
export const K19: React.FC<CPk> = (p) => <Foto {...p} id="k19" fx={0.5} fy={0.55} z={1.32} word="THE YOLK RUNS" wx={960} wy={950} mode="iris"  />;
export const K20: React.FC<CPk> = (p) => <Foto {...p} id="k20" fx={0.5} fy={0.55} z={1.45} word="LIKE WET SAND" wx={960} wy={180} mode="wipe" fx2={(tt) => Vapor(tt, 960, 520, 420, 0.9)} />;
export const K21: React.FC<CPk> = (p) => <Foto {...p} id="k21" fx={0.5} fy={0.55} z={1.38} word="CRUSHED SALTINES" wx={960} wy={950} mode="rise" fx2={(tt) => Lluvia(tt, 0.8, 960, 420, 300, "#c8902e", 26, 10)} />;
export const K22: React.FC<CPk> = (p) => <Foto {...p} id="k22" fx={0.5} fy={0.55} z={1.32} word="A LINE BEFORE THE PRAYER" wx={960} wy={180} mode="blinds"  />;
export const K23: React.FC<CPk> = (p) => <Foto {...p} id="k23" fx={0.5} fy={0.55} z={1.45} word="CUT A LITTLE X" wx={960} wy={950} mode="drop" fx2={(tt) => Vapor(tt, 960, 520, 420, 0.9)} />;
export const K24: React.FC<CPk> = (p) => <Foto {...p} id="k24" fx={0.5} fy={0.55} z={1.38} word="TWO HOURS, TOPS" wx={960} wy={180} mode="split"  />;
export const K25: React.FC<CPk> = (p) => <Foto {...p} id="k25" fx={0.5} fy={0.55} z={1.32} word="SAVE IT FOR SNACKS" wx={960} wy={950} mode="iris"  />;
export const K26: React.FC<CPk> = (p) => <Foto {...p} id="k26" fx={0.5} fy={0.55} z={1.45} word="ONE CUP OF BEANS" wx={960} wy={180} mode="wipe" fx2={(tt) => Lluvia(tt, 0.4, 960, 300, 380, "rgba(200,225,255,.85)", 30, 9)} />;
export const K27: React.FC<CPk> = (p) => <Foto {...p} id="k27" fx={0.5} fy={0.55} z={1.38} word="MY MOTHER'S KITCHEN" wx={960} wy={950} mode="rise" fx2={(tt) => Vapor(tt, 960, 520, 420, 0.9)} />;
export const K28: React.FC<CPk> = (p) => <><Foto {...p} id="k28" fx={0.5} fy={0.55} z={1.32} word="3 SUPPERS" wx={960} wy={180} mode="blinds"  /><Rodillo tt={p.t - p.h.at} d={p.h.out - p.h.at} a={0.7} b={3.2} v={3} x={1500} y={800} size={150} /></>;
export const K29: React.FC<CPk> = (p) => <Foto {...p} id="k29" fx={0.5} fy={0.55} z={1.45} word="USE SCISSORS" wx={960} wy={950} mode="drop"  />;
export const K30: React.FC<CPk> = (p) => <Foto {...p} id="k30" fx={0.5} fy={0.55} z={1.38} word="SEVEN SUPPERS" wx={960} wy={180} mode="split"  />;

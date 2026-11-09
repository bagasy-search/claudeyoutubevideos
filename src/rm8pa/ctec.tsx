// c8pa · componentes únicos de rm8pa (Ramón: 7 cars that never come back). Inglés. Objetos en código.
import React from "react";
import { DIM, eio, H, MZ, RED, Stage, Tag, TX, VER } from "./ckit";
import { ab, Box, Car, Card, CHROME, cl, F, Finger, Hand, HAND, lerp, phys, rnd, RUBBER, Scene, SHAD, Slip, STEEL, txt } from "./r8";
type C = React.FC<{ t: number; h: H }>;

// 1 · la caja: se le abre el fondo y caen 37 años de órdenes
const CajaRota: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#241e18" mesa={false}>{(tt) => {
  const fl = phys(tt, 0.7, 5, 0.32), floor = 930;
  return <>
    <div style={ab(0, 900, { width: 1920, height: 200, background: "linear-gradient(#5b5a58,#35332f)" })} />
    {Array.from({ length: 46 }, (_, i) => { const ti = 0.75 + (i % 23) * 0.075 + rnd(i) * 0.25, d = Math.max(0, tt - ti), yf = floor - rnd(i + 3) * 70, y = Math.min(yf, 470 + 900 * d * d), lnd = y >= yf; const dx = (rnd(i + 9) - 0.5) * 1500 * Math.min(0.42, d * 0.55); return tt > ti ? <Slip key={i} x={960 + (rnd(i) - 0.5) * 260 + dx} y={y} w={170} r={lnd ? (rnd(i + 5) - 0.5) * 70 : d * 300 * (rnd(i + 2) - 0.5)} /> : null; })}
    <div style={ab(620, 140, { width: 680, height: 340, background: "linear-gradient(#c49a63,#94703f)", boxShadow: SHAD, borderRadius: 4 })}>
      <div style={ab(300, 0, { width: 80, height: 340, background: "rgba(214,190,140,.7)" })} /><div style={{ ...txt(50, 130, 62, "rgba(50,30,10,.75)", 1, HAND) }}>1988 – '95</div>
    </div>
    <div style={ab(620, 478, { width: 680, height: 170, background: "linear-gradient(#8a6738,#6b4c26)", transformOrigin: "0 0", transform: `perspective(900px) rotateX(${-fl * 86}deg)`, boxShadow: "0 16px 30px rgba(0,0,0,.5)" })} />
    <Tag tt={tt} at={3.0} x={1560} y={220} txt="37 YEARS" col={MZ} size={76} />
  </>;
}}</Stage>;

// 2 · la campana de plata: la cena que apostó
const Cloche: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#2a2018">{(tt) => {
  const up = eio(tt, 1.1, 2.1), f = cl((tt - 1.9) * 3);
  return <>
    <div style={ab(460, 610, { width: 1000, height: 150, borderRadius: "50%", background: "radial-gradient(ellipse,#f3f1ea 50%,#c7c4ba 72%,#8c8a80)", boxShadow: "0 40px 60px rgba(0,0,0,.6)" })} />
    <Card x={960} y={560} w={430} h={270} r={-3} glow={f}><div style={{ ...txt(0, 66, 150, RED, f, HAND), width: 430, textAlign: "center" }}>#1 ?</div></Card>
    <div style={{ ...ab(590, 180, { width: 740, height: 470, transform: `translateY(${-up * 640}px) rotate(${up * 9}deg)` }) }}>
      <div style={{ width: 740, height: 450, borderRadius: "370px 370px 0 0", background: "linear-gradient(100deg,#6e767e,#eef2f6 30%,#a3abb3 56%,#e6ebf0 76%,#6e767e)", boxShadow: SHAD }} />
      <div style={ab(330, -46, { width: 80, height: 60, borderRadius: "50%", background: CHROME })} /><div style={ab(-14, 440, { width: 768, height: 30, borderRadius: 12, background: CHROME })} />
    </div>
    <Tag tt={tt} at={2.5} x={1540} y={420} txt="ONE DINNER" col={MZ} />
  </>;
}}</Stage>;

// 3 · caja de zapatos: las fichas pasan solas como un fichero
const Zapatera: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#1f2329">{(tt) => {
  const lid = eio(tt, 0.5, 1.4);
  return <Scene x={960} y={560} rx={-24} ry={-22} s={1.32}>
    {Array.from({ length: 15 }, (_, i) => { const z = -190 + i * 27, w = Math.sin(tt * 3.2 - i * 0.5); const a = lid * (i % 4 === 0 ? 0 : 0) + cl(tt - 1.2) * Math.max(0, w) * 30; return <div key={i} style={{ position: "absolute", left: -180, top: -222, width: 360, height: 212, transformOrigin: "50% 100%", transform: `translateZ(${z}px) rotateX(${-a}deg)`, background: "repeating-linear-gradient(180deg,#fbf8ee 0 26px,#bcd0e6 26px 28px)", boxShadow: "0 -4px 10px rgba(0,0,0,.25)" }}>{i % 5 === 2 && <div style={ab(250, -24, { width: 90, height: 28, borderRadius: "8px 8px 0 0", background: i % 2 ? "#e0b93c" : "#b84a3c" })} />}</div>; })}
    <Box w={420} h={150} d={470} c="linear-gradient(#b23a31,#7c2520)" y={-40} top="transparent" side="linear-gradient(#a33029,#6e201b)" />
    <div style={{ position: "absolute", transformStyle: "preserve-3d", transform: `translate3d(0,${-115 - lid * 240}px,${-lid * 150}px) rotateX(${-lid * 55}deg)` }}><Box w={442} h={46} d={492} c="#c34339" top="linear-gradient(120deg,#d04c41,#94302a)" /></div>
  </Scene>;
}}</Stage>;

// 4 · la ficha se da vuelta y la columna derecha sigue atrás
const Reverso: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#20262b">{(tt) => {
  const fl = eio(tt, 1.6, 2.5) * 180, fr = fl < 90, line = cl((tt - 0.3) / 1.2), line2 = cl((tt - 2.5) / 1.3);
  return <div style={{ position: "absolute", inset: 0, transform: fl <= 0 || fl >= 180 ? "none" : `scaleX(${Math.max(0.002, Math.abs(Math.cos(fl * Math.PI / 180)))}) skewY(${Math.sin(fl * Math.PI / 90) * 4}deg)`, transformOrigin: "960px 540px" }}>
    {fr ? <Card x={960} y={540} w={1000} h={640}>
      <div style={ab(498, 0, { width: 4, height: 640, background: "#333a56" })} />
      <Hand x={40} y={60} s={58} rot={0}>oil</Hand><Hand x={40} y={140} s={58} rot={0}>tires</Hand><Hand x={40} y={222} s={58} rot={0}>battery</Hand>
      {["transmission", "head gasket", "timing chain", "tow truck", "transmission", "water pump", "tow truck"].map((s, i) => <Hand key={i} x={530} y={60 + i * 80} s={58} rot={0} c="#a42c25" k={cl(line * 7 - i)}>{s}</Hand>)}
      <div style={{ ...txt(800, 590, 40, "#a42c25", cl(line * 7 - 6), HAND) }}>over →</div>
    </Card> : <div style={{ position: "absolute", inset: 0 }}><Card x={960} y={540} w={1000} h={640}>{["clutch pack", "intake", "wiring", "tow truck", "head gasket", "transmission", "tow truck"].map((s, i) => <Hand key={i} x={80} y={60 + i * 80} s={58} rot={0} c="#a42c25" k={cl(line2 * 7 - i)}>{s}</Hand>)}<div style={{ ...txt(540, 280, 56, RED, cl(line2 * 3 - 2)) }}>SAME BADGE</div></Card></div>}
  </div>;
}}</Stage>;

// 5 · la carrocería se levanta como una tapa: lo que importa está abajo
const Carroceria: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#1a2028">{(tt) => {
  const up = eio(tt, 0.7, 1.9), g = cl((tt - 1.8) * 2);
  return <>
    <div style={ab(330, 780, { width: 1260, height: 26, borderRadius: 13, background: STEEL })} />
    {[520, 1400].map((x) => <div key={x} style={ab(x - 95, 700, { width: 190, height: 190, borderRadius: "50%", background: "radial-gradient(#a7adb5 36%,#101114 38%)" })} />)}
    <div style={ab(480, 560, { width: 370, height: 220, borderRadius: 24, background: "linear-gradient(#7d858e,#3b4047)", boxShadow: `0 20px 40px rgba(0,0,0,.6), 0 0 ${g * 80}px rgba(255,200,90,${g * .75})` })}>{[0, 1, 2, 3].map((i) => <div key={i} style={ab(30 + i * 82, 26, { width: 62, height: 62, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#2d3137,#0f1114)" })} />)}</div>
    <div style={ab(850, 620, { width: 400, height: 150, borderRadius: "16px 80px 80px 16px", background: "linear-gradient(#a2682f,#5c3a17)", boxShadow: `0 16px 30px rgba(0,0,0,.6), 0 0 ${g * 70}px rgba(255,200,90,${g * .7})` })} />
    <div style={{ position: "absolute", inset: 0, transform: `translateY(${-up * 470}px)` }}><Car x={960} y={840} w={1500} c="#8d3030" /></div>
    {[560, 1360].map((x) => <div key={x} style={ab(x, -20, { width: 5, height: 370 - up * 340 + 40, background: "#30343a" })} />)}
    <Tag tt={tt} at={2.2} x={665} y={500} txt="ENGINE" col={MZ} /><Tag tt={tt} at={2.6} x={1240} y={640} txt="TRANSMISSION" col={MZ} />
  </>;
}}</Stage>;

// 6 · varillas y balancines: el motor viejo trabajando despacio
const Varillas: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#1d1f24">{(tt) => {
  const Rod: React.FC<{ x: number; ph: number }> = ({ x, ph }) => { const k = Math.max(0, Math.sin(tt * 2.6 + ph)), a = k * 11; return <>
    <div style={ab(x - 13, 360 - k * 40, { width: 26, height: 500, borderRadius: 13, background: "linear-gradient(90deg,#6b737b,#e9edf1 40%,#6d757c)" })} />
    <div style={ab(x - 30, 280, { width: 360, height: 60, borderRadius: 30, background: "linear-gradient(#b9bfc6,#60676f)", transformOrigin: "180px 30px", transform: `rotate(${-a}deg)`, boxShadow: "0 12px 24px rgba(0,0,0,.6)" })}><div style={ab(150, 10, { width: 40, height: 40, borderRadius: "50%", background: "#1c1e22" })} /></div>
    <div style={ab(x + 298, 350 + k * 60, { width: 32, height: 330, background: "linear-gradient(90deg,#747c84,#e0e5ea,#747c84)" })}><div style={ab(-44, 318, { width: 120, height: 26, borderRadius: 13, background: CHROME })} /></div>
    <div style={ab(x + 272, 480 + k * 60, { width: 84, height: 80, background: "repeating-linear-gradient(0deg,#3c4148 0 9px,#b8bfc6 9px 18px)" })} />
  </>; };
  return <><Rod x={420} ph={0} /><Rod x={1120} ph={2.1} />
    <div style={ab(250, 760, { width: 1420, height: 200, background: "linear-gradient(#4a4e54,#26282c)", borderRadius: 14 })} /><Tag tt={tt} at={1.6} x={960} y={860} txt="PUSHRODS" col={MZ} size={88} /></>;
}}</Stage>;

// 7 · mecedora: el motor al ralentí de un viejo en el porche
const Mecedora: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#2a2118">{(tt) => {
  const r = 9 * Math.sin(tt * 1.5), nd = -120 + 96 + 1.2 * Math.sin(tt * 3);
  return <>
    <div style={ab(1090, 210, { width: 620, height: 620, borderRadius: "50%", background: "radial-gradient(#23272d,#0d0f12)", boxShadow: "0 0 0 16px #5f666e, " + SHAD })}>
      {Array.from({ length: 9 }, (_, i) => { const a = -120 + i * 30; return <div key={i} style={{ ...txt(0, 0, 50, i >= 7 ? RED : TX), width: 90, textAlign: "center", transform: `translate(${265 + 232 * Math.sin(a * Math.PI / 180)}px,${286 - 232 * Math.cos(a * Math.PI / 180)}px)` }}>{i}</div>; })}
      <div style={ab(304, 90, { width: 12, height: 228, background: RED, transformOrigin: "50% 100%", transform: `rotate(${nd}deg)`, borderRadius: 6 })} /><div style={ab(278, 278, { width: 64, height: 64, borderRadius: "50%", background: CHROME })} />
    </div>
    <svg width="760" height="800" viewBox="0 0 760 800" style={{ position: "absolute", left: 200, top: 190, transform: `rotate(${r}deg)`, transformOrigin: "340px 800px", overflow: "visible" }}>
      <g fill="none" stroke="#7a4a24" strokeWidth="26" strokeLinecap="round"><path d="M60 770 Q370 860 690 760" stroke="#5c3518" strokeWidth="30" /><path d="M170 790 L210 470 L170 110" /><path d="M520 790 L500 470" /><path d="M210 470 L520 470" strokeWidth="44" /><path d="M170 110 L330 110" />{[0, 1, 2].map((i) => <path key={i} d={`M${210 + i * 0} ${190 + i * 90} L350 ${190 + i * 90}`} strokeWidth="18" />)}<path d="M200 340 L520 340 L510 470" strokeWidth="20" /></g>
    </svg>
    <Tag tt={tt} at={2.0} x={1400} y={900} txt="2,000 RPM" col={MZ} />
  </>;
}}</Stage>;

// 8 · pizarra: 31 palitos de aceite contra 2 de lo otro
const Palitos: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#16201c">{(tt) => {
  const n = Math.round(cl((tt - 0.4) / 2.8) * 31);
  const mark = (i: number) => { const g = Math.floor(i / 5), p = i % 5, x = 110 + (g % 3) * 300, y = 90 + Math.floor(g / 3) * 200; return p < 4 ? <line key={i} x1={x + p * 48} y1={y} x2={x + p * 48 - 8} y2={y + 140} stroke="#f2efe2" strokeWidth={12} strokeLinecap="round" /> : <line key={i} x1={x - 30} y1={y + 124} x2={x + 176} y2={y + 26} stroke="#f2efe2" strokeWidth={12} strokeLinecap="round" />; };
  return <div style={ab(190, 140, { width: 1540, height: 780, background: "radial-gradient(#27423a,#14241f)", border: "28px solid #6d4526", boxShadow: SHAD, borderRadius: 8 })}>
    <svg width="1000" height="700" style={{ position: "absolute", left: 10, top: 30 }}>{Array.from({ length: n }, (_, i) => mark(i))}</svg>
    <div style={ab(1010, 40, { width: 6, height: 680, background: "rgba(242,239,226,.45)" })} />
    <svg width="400" height="300" style={{ position: "absolute", left: 1050, top: 150, opacity: cl((tt - 3.3) * 3) }}><line x1="90" y1="20" x2="82" y2="220" stroke="#ff8a6a" strokeWidth="16" strokeLinecap="round" /><line x1="190" y1="20" x2="182" y2="220" stroke="#ff8a6a" strokeWidth="16" strokeLinecap="round" /></svg>
    <div style={{ ...txt(1050, 450, 62, "#ff8a6a", cl((tt - 3.5) * 3)) }}>19 YEARS</div>
  </div>;
}}</Stage>;

// 9 · el codo de plástico se raja y gotea rosa
const Codo: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#20242a">{(tt) => {
  const c = cl((tt - 0.7) / 1.3), pool = cl((tt - 1.6) / 2.4);
  return <>
    <svg width="1000" height="720" viewBox="0 0 1000 720" style={{ position: "absolute", left: 420, top: 70, overflow: "visible" }}>
      <path d="M0 200 L420 200 Q640 200 640 420 L640 640" fill="none" stroke="#2b2d30" strokeWidth="178" /><path d="M0 200 L420 200 Q640 200 640 420 L640 640" fill="none" stroke="#d8d2c2" strokeWidth="150" /><path d="M0 164 L420 164 Q676 164 676 420 L676 640" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="18" />
      <path d="M560 262 L602 306 L580 344 L632 392" fill="none" stroke="#3a1a16" strokeWidth="9" strokeLinecap="round" pathLength={1} strokeDasharray={`${c} 1`} />
      <ellipse cx="596" cy="372" rx={60 * c} ry={32 * c} fill="#e88fa8" opacity=".85" /><ellipse cx="610" cy="418" rx={26 * c} ry={40 * c} fill="#f3a9bd" opacity=".7" />
    </svg>
    {[0, 1, 2, 3, 4].map((i) => { const k = ((tt - 1.3 + i * 0.5) % 2.5) / 2.5; return tt > 1.3 && <div key={i} style={ab(1018, 500 + k * k * 360, { width: 28, height: 40, borderRadius: "50% 50% 50% 50% / 62% 62% 38% 38%", background: "#ee96ad", opacity: k < 0.96 ? 0.95 : 0 })} />; })}
    <div style={ab(1018 - 290 * pool, 880 - 8 * pool, { width: 28 + 580 * pool, height: 16 + 44 * pool, borderRadius: "50%", background: "radial-gradient(#f0a7bb,#c76f8a)" })} />
    <Tag tt={tt} at={2.6} x={520} y={700} txt="FEW DOLLARS" col={MZ} />
  </>;
}}</Stage>;

// 10 · tablero de llaves: la V6 se suelta y cae; queda la de 4
const Ganchos: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#22262c" mesa={false}>{(tt) => {
  const f = Math.max(0, tt - 1.8), y2 = 900 * f * f, sw = 16 * Math.exp(-tt * 0.7) * Math.sin(tt * 4.2), lit = cl((tt - 2.1) * 2);
  const K: React.FC<{ x: number; dy: number; rot: number; tag: string; c: string; g?: number }> = ({ x, dy, rot, tag, c, g = 0 }) => <div style={{ position: "absolute", left: x, top: 280 + dy, transformOrigin: "50% 0", transform: `rotate(${rot}deg)` }}>
    <div style={ab(-46, 20, { width: 92, height: 92, borderRadius: "50%", border: "24px solid #c9b264", boxSizing: "border-box", boxShadow: `0 0 ${g * 80}px rgba(255,214,120,${g})` })} /><div style={ab(-13, 104, { width: 26, height: 230, background: "linear-gradient(90deg,#8b7b42,#efe0a0,#8b7b42)", clipPath: "polygon(0 0,100% 0,100% 72%,60% 76%,100% 82%,60% 88%,100% 94%,0 100%)" })} />
    <div style={ab(-170, 332, { width: 340, height: 170, borderRadius: 14, background: c, transform: "rotate(-4deg)", boxShadow: "0 18px 30px rgba(0,0,0,.5)" })}><div style={{ ...txt(0, 44, 84, "#1c1208"), width: 340, textAlign: "center" }}>{tag}</div></div>
  </div>;
  return <>
    <div style={ab(280, 120, { width: 1360, height: 860, background: "radial-gradient(circle at 6px 6px,#10120f 5px,transparent 6px) 0 0/44px 44px, linear-gradient(#b9a06f,#8e7649)", boxShadow: SHAD, borderRadius: 8 })} />
    {[660, 1260].map((x) => <div key={x} style={ab(x - 14, 256, { width: 28, height: 56, borderRadius: 12, background: CHROME })} />)}
    <K x={660} dy={0} rot={sw} tag="4 CYL" c="#e9c75f" g={lit} /><K x={1260} dy={y2} rot={f * 90} tag="V6" c="#c9c3b4" />
  </>;
}}</Stage>;

// 11 · cerilla que se apaga: olor a transmisión quemada
const Cerilla: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#14161a">{(tt) => {
  const f = 1 - eio(tt, 1.1, 1.5), sm = cl(tt - 1.4);
  return <>
    <div style={ab(948, 470, { width: 24, height: 540, background: "linear-gradient(90deg,#c79a5f,#e9c78e,#b08449)", transform: "rotate(6deg)", transformOrigin: "50% 100%" })} /><div style={ab(934, 410, { width: 56, height: 96, borderRadius: "48%", background: f > 0.1 ? "#7d2a1b" : "#1d1a19", transform: "rotate(6deg)" })} />
    {f > 0.02 && <svg width="400" height="500" viewBox="-200 -500 400 500" style={{ position: "absolute", left: 770, top: -36, opacity: f, transform: `scale(${f})`, transformOrigin: "50% 100%" }}><defs><radialGradient id="fl"><stop offset="0" stopColor="#fff4c0" /><stop offset=".55" stopColor="#ffac2e" /><stop offset="1" stopColor="#f0491a" /></radialGradient></defs><path d={`M-70 -40 Q-90 -210 ${8 * Math.sin(tt * 18)} -360 Q90 -210 70 -40 Q0 20 -70 -40 Z`} fill="url(#fl)" /></svg>}
    {sm > 0 && [0, 1, 2].map((i) => <path key={i} />) && <svg width="700" height="620" viewBox="0 0 700 620" style={{ position: "absolute", left: 620, top: -60, opacity: sm * 0.75 }}>{[0, 1, 2].map((i) => <path key={i} d="M350 620 C 240 500, 460 420, 340 300 C 240 200, 440 120, 330 0" fill="none" stroke="rgba(230,230,235,.55)" strokeWidth={26 - i * 6} strokeLinecap="round" pathLength={1} strokeDasharray=".42 .58" strokeDashoffset={-(tt * 0.32 + i * 0.3)} style={{ filter: "blur(7px)" }} />)}</svg>}
    <Tag tt={tt} at={2.5} x={1480} y={560} txt="WALK AWAY" col={RED} size={84} />
  </>;
}}</Stage>;

// 12 · el enganche: baja el ahumador y el pickup se sienta atrás
const Remolque: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#2b2219" mesa={false}>{(tt) => {
  const d = phys(tt, 1.2, 5, 0.4), sq = -2.6 * d, y = (1 - d) * -560;
  return <>
    <div style={ab(0, 860, { width: 1920, height: 240, background: "linear-gradient(#454139,#26231e)" })} />
    <Car x={560} y={895} w={1120} c="#4d5d78" pick rot={sq} o2="96% 80%" />
    <div style={{ position: "absolute", inset: 0, transform: `translateY(${y}px)` }}>
      <div style={ab(1210, 520, { width: 560, height: 230, borderRadius: 115, background: "linear-gradient(#3a3d41,#141517)", boxShadow: SHAD })}><div style={ab(220, -130, { width: 80, height: 150, background: "#25272a" })} /><div style={ab(120, 92, { width: 320, height: 12, background: "#7a7e84" })} /></div>
      <div style={ab(1090, 760 + d * 0, { width: 760, height: 28, background: STEEL })} /><div style={ab(1400 - 75, 760, { width: 150, height: 150, borderRadius: "50%", background: "radial-gradient(#9299a1 40%,#0f1012 42%)" })} />
      <div style={ab(1000, 764, { width: 100, height: 18, background: "#1b1c1f" })} />
    </div>
    <Tag tt={tt} at={2.5} x={1480} y={280} txt="HEAVY" col={MZ} size={96} />
  </>;
}}</Stage>;

// 13 · la estrellita de Marta en la ficha
const Estrella: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#23201a">{(tt) => {
  const s = eio(tt, 0.5, 1.7), w = eio(tt, 1.9, 3.3);
  return <Card x={960} y={530} w={1140} h={640} r={-2}>
    <Hand x={60} y={60} s={72} rot={0}>03 Silverado</Hand><Hand x={60} y={164} s={60} c="#a42c25" rot={0}>head gasket — Rosie</Hand><Hand x={60} y={250} s={60} c="#a42c25" rot={0}>hose — Rosie</Hand><Hand x={60} y={336} s={60} c="#a42c25" rot={0}>tape on light — Rosie</Hand>
    <svg width="340" height="340" viewBox="-170 -170 340 340" style={{ position: "absolute", right: 40, top: 40 }}><path d="M0 -140 L38 -40 L142 -40 L58 24 L90 128 L0 66 L-90 128 L-58 24 L-142 -40 L-38 -40 Z" fill={`rgba(230,190,70,${cl(s * 2 - 1) * 0.5})`} stroke="#b0861c" strokeWidth={12} strokeLinejoin="round" pathLength={1} strokeDasharray={`${s} 1`} /></svg>
    <Hand x={120} y={470} s={118} c="#1e2b63" k={w}>not the truck's fault</Hand>
  </Card>;
}}</Stage>;

// 14 · mojones en la ruta: 318 mil, 327 mil, 400 mil
const Hitos: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#1b2632" mesa={false}>{(tt) => {
  const road = (tt * 340) % 200;
  const P: React.FC<{ at: number; n: string; side: number }> = ({ at, n, side }) => { const k = (tt - at) * 0.75; if (k < -1 || k > 1.0) return null; const u = cl((k + 1) / 2), p = u * u, s = 0.1 + p * 1.0, x = 960 + side * (70 + p * 690), y = 470 + p * 540; return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-100%) scale(${s})`, transformOrigin: "50% 100%", opacity: cl((k + 1) * 3) * cl((1 - k) * 8), width: 460, height: 640 }}><div style={ab(100, 80, { width: 260, height: 560, background: "linear-gradient(90deg,#ded9cc,#a6a194)", borderRadius: "130px 130px 0 0", boxShadow: "0 30px 40px rgba(0,0,0,.5)" })}><div style={{ ...txt(0, 150, 76, "#1c1c1c"), width: 260, textAlign: "center" }}>{n}</div><div style={{ ...txt(0, 270, 40, "#3a3a3a"), width: 260, textAlign: "center" }}>MILES</div></div></div>; };
  return <>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 470, background: "linear-gradient(#59718a,#c6b18a)" }} />
    <div style={ab(0, 460, { width: 1920, height: 620, background: "linear-gradient(#5e5a3a,#2d2c1d)" })} />
    <div style={ab(0, 460, { width: 1920, height: 620, clipPath: "polygon(48% 0,52% 0,100% 100%,0 100%)", background: "linear-gradient(#3a3b3f,#191a1c)" })} />
    <div style={{ position: "absolute", left: 930, top: 460, width: 60, height: 620, clipPath: "polygon(46% 0,54% 0,100% 100%,0 100%)", backgroundImage: "repeating-linear-gradient(180deg,#e9c75f 0 90px,transparent 90px 200px)", backgroundPosition: `0 ${road}px` }} />
    <P at={0.5} n="318K" side={1} /><P at={1.7} n="327K" side={-1} /><P at={3.0} n="400K" side={1} />
  </>;
}}</Stage>;

// 15 · la bujía se parte: la mitad queda adentro de la tapa
const BujiaRota: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#1e2227">{(tt) => {
  const tw = eio(tt, 0.6, 1.5), snap = tt > 1.5, up = snap ? eio(tt, 1.5, 2.5) : 0, fl = snap ? Math.max(0, 1 - (tt - 1.5) * 4) : 0;
  return <>
    <div style={ab(280, 590, { width: 1360, height: 420, background: "linear-gradient(135deg,#a5abb1,#6d737a)", boxShadow: SHAD })}><div style={ab(620, 0, { width: 120, height: 330, background: "#2a2c30" })} />{Array.from({ length: 14 }, (_, i) => <div key={i} style={ab(620, 20 + i * 22, { width: 120, height: 6, background: "rgba(200,205,212,.55)" })} />)}</div>
    <div style={{ position: "absolute", left: 960, top: 0, width: 0, height: 0, transform: `translateY(${-up * 330}px)` }}>
      <div style={{ ...ab(-70, 90, { width: 140, height: 400, borderRadius: 16, background: "linear-gradient(90deg,#d8dbde,#fff,#c6c9cc)" }) }} />
      <div style={ab(-96, 380 + 0, { width: 192, height: 120, background: "linear-gradient(90deg,#5b6168,#c9ced4 45%,#5b6168)", clipPath: "polygon(16% 0,84% 0,100% 50%,84% 100%,16% 100%,0 50%)", transform: `rotateY(${tw * 50}deg)` })} />
      <div style={ab(-46, 500, { width: 92, height: 106, background: "repeating-linear-gradient(0deg,#6b7178 0 9px,#d5d9de 9px 16px)" })} />
    </div>
    <div style={ab(960 - 46, 614, { width: 92, height: 210, background: "repeating-linear-gradient(0deg,#6b7178 0 9px,#d5d9de 9px 16px)", clipPath: "polygon(0 8%,20% 0,46% 7%,70% 1%,100% 8%,100% 100%,0 100%)" })} />
    {fl > 0 && <div style={ab(860, 510, { width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(rgba(255,240,170,${fl}),transparent 70%)` })} />}
    <Tag tt={tt} at={2.5} x={1480} y={350} txt="SNAPS OFF" col={RED} size={84} />
  </>;
}}</Stage>;

// 16 · gato de recibos: la pila levanta la camioneta y el precio
const Gato: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#26221b" mesa={false}>{(tt) => {
  const n = Math.round(cl((tt - 0.4) / 2.5) * 22), lift = n * 15;
  return <>
    <div style={ab(0, 910, { width: 1920, height: 170, background: "linear-gradient(#4b473f,#26241f)" })} />
    {Array.from({ length: n }, (_, i) => <div key={i} style={ab(720 + (rnd(i) - 0.5) * 34, 898 - i * 15, { width: 460, height: 15, background: i % 3 ? "#efe7ce" : "#e6d58e", boxShadow: "0 2px 3px rgba(0,0,0,.35)", transform: `rotate(${(rnd(i + 8) - 0.5) * 1.6}deg)` })} />)}
    <div style={{ position: "absolute", inset: 0, transform: `translateY(${-lift}px)` }}><Car x={960} y={930} w={1280} c="#e8e8e4" pick /></div>
    <div style={ab(1380, 110, { width: 480, height: 170, transform: `rotate(${6 * Math.sin(tt * 2.4)}deg)`, background: "linear-gradient(#f4d264,#d7a92e)", clipPath: "polygon(16% 0,100% 0,100% 100%,16% 100%,0 50%)", opacity: cl(tt - 2.2) })}><div style={{ ...txt(84, 44, 88, "#231a07") }}>+$2,000</div></div>
  </>;
}}</Stage>;

// 17 · el fluido de transmisión sale como café en la taza
const Taza: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#22201c">{(tt) => {
  const lvl = cl((tt - 0.9) / 2.2), w = 16 * Math.sin(tt * 3);
  return <>
    <div style={ab(150, 120, { width: 1000, height: 170, background: "linear-gradient(#7a5a2c,#46301a)", borderRadius: "16px 16px 60px 60px", boxShadow: SHAD })}><div style={ab(460, 170, { width: 84, height: 24, background: "#c8ccd2" })} /></div>
    {tt > 0.7 && <div style={ab(636, 300, { width: 28, height: 390 - lvl * 200, background: "linear-gradient(90deg,#2a1608,#5e3a1c,#2a1608)" })} />}
    <div style={ab(420, 490, { width: 480, height: 430, borderRadius: "0 0 110px 110px", background: "linear-gradient(90deg,#d9d6cd,#fbfaf5 40%,#c4c0b4)", boxShadow: SHAD, overflow: "hidden" })} />
    <div style={ab(880, 560, { width: 150, height: 240, borderRadius: "0 90px 90px 0", border: "34px solid #e8e5dc", borderLeft: "none", boxSizing: "border-box" })} />
    <div style={ab(452, 490 + 60 + (1 - lvl) * 170, { width: 416, height: 18 + lvl * 2, borderRadius: "50%", background: "#6e4522", opacity: lvl > 0 ? 1 : 0 })} />
    <div style={ab(452, 490, { width: 416, height: 60 + (1 - lvl) * 170, background: "#2b2622", borderRadius: "10px 10px 0 0" })} />
    {[560, 660, 760].map((x, i) => <div key={x} style={ab(x + w * (i % 2 ? 1 : -1), 330, { width: 20, height: 150, borderRadius: 10, background: "rgba(255,255,255,.2)", filter: "blur(10px)", opacity: lvl })} />)}
    <Tag tt={tt} at={2.8} x={1480} y={620} txt="140,000 MI" col={MZ} size={84} />
  </>;
}}</Stage>;

// 18 · las mangueras cociéndose como tamales en la olla
const Tamalera: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#2b1d17">{(tt) => {
  const j = Math.sin(tt * 16) * 2.4 * cl(tt - 1), red = cl(tt / 3.5);
  return <>
    {[0, 1, 2, 3].map((i) => <div key={i} style={ab(640 + i * 170 + 18 * Math.sin(tt + i), 130 - 40 * ((tt * 0.8 + i * 0.3) % 1), { width: 34, height: 210, borderRadius: 17, background: "rgba(255,255,255,.28)", filter: "blur(16px)", opacity: 0.5 + 0.4 * Math.sin(tt * 2 + i) })} />)}
    {[[640, -32], [920, 8], [1190, 34]].map(([x, r], i) => <div key={i} style={ab(x as number, 270, { width: 92, height: 380, borderRadius: 46, background: `linear-gradient(90deg,hsl(10 ${20 + red * 60}% 12%),hsl(12 ${20 + red * 60}% ${22 + red * 12}%),hsl(10 ${20 + red * 60}% 12%))`, transform: `rotate(${r as number}deg)`, transformOrigin: "50% 100%" })} />)}
    <div style={ab(430, 480, { width: 1060, height: 460, borderRadius: "0 0 60px 60px", background: "linear-gradient(90deg,#6c7178,#d8dce0 30%,#8d9299 58%,#c8ccd0 80%,#5e6369)", boxShadow: SHAD })} />
    <div style={ab(400, 452 + j, { width: 1120, height: 58, borderRadius: 26, background: CHROME, transform: `rotate(${j * 0.6}deg)` })} />
    <div style={{ ...txt(0, 660, 150, RED, cl(tt - 1.5)), width: 1920, textAlign: "center", textShadow: "0 8px 24px rgba(0,0,0,.45)" }}>104°</div>
  </>;
}}</Stage>;

// 19 · dos dedos aprietan la manguera y se desarma como pan viejo
const PanViejo: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#1f2124">{(tt) => {
  const p = eio(tt, 0.9, 1.9), cr = cl((tt - 1.8) * 1.5), gap = 220 - p * 90;
  return <>
    <div style={ab(0, 370 + p * 26, { width: 1920, height: gap * 1.25 - p * 32, background: "linear-gradient(#3b3d41,#17181a 45%,#2e3034)", boxShadow: "0 30px 50px rgba(0,0,0,.6)" })}>{Array.from({ length: 30 }, (_, i) => <div key={i} style={ab(120 + i * 58, 10 + rnd(i) * 150, { width: 34 + rnd(i + 2) * 52, height: 4, background: "rgba(205,205,205,.3)", transform: `rotate(${(rnd(i + 5) - 0.5) * 80}deg)` })} />)}</div>
    {Array.from({ length: 20 }, (_, i) => { const d = Math.max(0, tt - 1.9 - i * 0.03); return d > 0 && <div key={i} style={ab(830 + rnd(i) * 270 + (rnd(i + 2) - 0.5) * 240 * d, 620 + 760 * d * d, { width: 20 + rnd(i + 3) * 26, height: 14 + rnd(i + 4) * 20, background: "#25272a", borderRadius: 5, transform: `rotate(${d * 300}deg)`, opacity: cr })} />; })}
    <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - eio(tt, 0, 0.9)) * -500 + p * 34}px)` }}><Finger x={960} y={410} w={150} /></div>
    <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - eio(tt, 0, 0.9)) * 500 - p * 34}px) rotate(180deg)`, transformOrigin: "960px 540px" }}><Finger x={960} y={360} w={150} /></div>
    <Tag tt={tt} at={2.5} x={1540} y={880} txt="CHANGE IT" col={MZ} />
  </>;
}}</Stage>;

// 20 · rodamiento: una bolita mala y la cuenta crece
const Rodamiento: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#191c20">{(tt) => {
  const a = tt * 90, wob = cl((tt - 1.5) / 2) * 16, v = Math.round(lerp(180, 1100, eio(tt, 1.7, 3.8)));
  return <>
    <div style={ab(250 + wob * Math.sin(tt * 26), 160 + wob * Math.cos(tt * 23), { width: 760, height: 760, borderRadius: "50%", background: "conic-gradient(#6d757d,#e4e8ec,#7a828a,#dfe3e7,#6d757d)", boxShadow: SHAD })}>
      <div style={ab(70, 70, { width: 620, height: 620, borderRadius: "50%", background: "#14161a" })} /><div style={ab(190, 190, { width: 380, height: 380, borderRadius: "50%", background: "conic-gradient(#747c84,#eceff2,#858d95,#e4e8ec,#747c84)" })}><div style={ab(90, 90, { width: 200, height: 200, borderRadius: "50%", background: "#14161a" })} /></div>
      {Array.from({ length: 11 }, (_, i) => { const b = (i * 360 / 11 + a) * Math.PI / 180, bad = i === 3; return <div key={i} style={ab(380 + 248 * Math.cos(b) - 54, 380 + 248 * Math.sin(b) - 54, { width: 108, height: 108, borderRadius: "50%", background: bad ? "radial-gradient(circle at 40% 34%,#9a6a3a,#3f2610)" : "radial-gradient(circle at 36% 32%,#fff,#99a1a9 44%,#3c4147)" })} />; })}
    </div>
    <div style={{ ...txt(1110, 380, 210, v > 700 ? RED : MZ), textShadow: "0 12px 30px rgba(0,0,0,.6)" }}>${v}</div>
    <div style={{ ...txt(1120, 610, 62, DIM) }}>{v > 700 ? "WITH THE HUB" : "WHEN IT HUMS"}</div>
  </>;
}}</Stage>;

// 21 · tragamonedas aburrida: aceite, aceite, aceite
const Reel: React.FC<{ tt: number; stop: number; x: number; off: number }> = ({ tt, stop, x, off }) => {
  const Ic = (k: number) => k === 0 ? <svg width="170" height="210" viewBox="0 0 170 210"><path d="M85 10 C 40 90 20 110 20 142 A65 65 0 0 0 150 142 C150 110 130 90 85 10Z" fill="#c2902a" /><ellipse cx="60" cy="130" rx="14" ry="26" fill="#f2d48a" /></svg> : k === 1 ? <svg width="190" height="170" viewBox="0 0 190 170"><rect x="10" y="40" width="170" height="120" rx="12" fill="#30343a" /><rect x="34" y="20" width="36" height="24" fill="#d7dade" /><rect x="120" y="20" width="36" height="24" fill="#d0473f" /></svg> : <svg width="190" height="190" viewBox="0 0 190 190"><circle cx="95" cy="95" r="90" fill="#17181b" /><circle cx="95" cy="95" r="44" fill="#a7adb5" /></svg>;
  const sp = tt < stop ? (tt * 1500) % 760 : 0, k = tt >= stop ? phys(tt, stop, 12, 0.34) : 1;
  return <div style={ab(x, 280, { width: 300, height: 400, background: "linear-gradient(#e9e6da,#fff 40%,#d6d2c4)", overflow: "hidden", boxShadow: "inset 0 26px 30px rgba(0,0,0,.3), inset 0 -26px 30px rgba(0,0,0,.3)" })}>
    <div style={{ position: "absolute", left: 0, top: tt < stop ? -sp : (k - 1) * 90, width: 300, transform: tt < stop ? "none" : undefined, filter: tt < stop ? "blur(7px)" : undefined }}>{[off, 1, 2, off, 2, 1, off].map((q, i) => <div key={i} style={{ height: tt < stop ? 380 : 400, display: "flex", alignItems: "center", justifyContent: "center" }}>{Ic(tt >= stop ? 0 : q % 3)}</div>)}</div>
  </div>;
};
const Tragamonedas: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#2a1c1e">{(tt) => {
  const lev = eio(tt, 0.4, 0.8) * (1 - eio(tt, 0.9, 1.5)) * 58;
  return <>
    <div style={ab(420, 130, { width: 1040, height: 760, borderRadius: 40, background: "linear-gradient(#a92f2b,#5e1713)", boxShadow: SHAD })}><div style={ab(60, 120, { width: 920, height: 440, borderRadius: 22, background: "#1a1616" })} /></div>
    <Reel tt={tt} stop={1.5} x={490} off={0} /><Reel tt={tt} stop={2.1} x={810} off={1} /><Reel tt={tt} stop={2.8} x={1130} off={2} />
    <div style={ab(1500, 480, { width: 44, height: 330, background: CHROME, transformOrigin: "50% 100%", transform: `rotateX(0deg) rotate(${lev}deg) translateY(-290px)` })}><div style={ab(-34, -60, { width: 112, height: 112, borderRadius: "50%", background: "radial-gradient(circle at 38% 34%,#ff8c7a,#a21a14)" })} /></div>
    <Tag tt={tt} at={3.2} x={960} y={790} txt="JUST OIL" col={MZ} size={100} />
  </>;
}}</Stage>;

// 22 · tapa de aceite dada vuelta: barro de maní
const Sludge: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#1a1d21">{(tt) => {
  const fl = eio(tt, 0.7, 1.7), wob = Math.sin(tt * 4) * 3;
  return <div style={ab(960, 540, { perspective: 1500 })}><div style={{ transform: `rotateX(${(1 - fl) * 180 + 18}deg) scale(1.05)`, transformStyle: "preserve-3d" }}>
    <div style={ab(-400, -400, { width: 800, height: 800, borderRadius: "50%", background: "conic-gradient(#25272b,#42464c,#25272b,#42464c,#25272b)", backfaceVisibility: "hidden", transform: "rotateX(180deg)", boxShadow: SHAD })}><div style={{ ...txt(0, 345, 100, "#b8bcc4"), width: 800, textAlign: "center" }}>OIL</div></div>
    <div style={ab(-400, -400, { width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(#3b3e43,#141518)", backfaceVisibility: "hidden" })}>
      <svg width="800" height="800" viewBox="0 0 800 800" style={{ transform: `rotate(${wob}deg)` }}><defs><radialGradient id="sg" cx=".4" cy=".35"><stop offset="0" stopColor="#ecd6a0" /><stop offset=".7" stopColor="#b98f50" /><stop offset="1" stopColor="#7a5a2c" /></radialGradient></defs><path d="M170 340 C 210 180 390 130 520 200 C 660 260 680 450 590 560 C 500 690 280 680 190 560 C 130 480 140 410 170 340Z" fill="url(#sg)" />{[[300, 310, 66], [470, 380, 84], [350, 500, 54], [530, 520, 36]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#d8bc7f" opacity=".62" />)}</svg>
    </div>
  </div>
  <div style={{ ...txt(-880, -56, 76, RED, cl(tt - 2.4)), width: 400 }}>WALK AWAY</div></div>;
}}</Stage>;

// 23 · tarjeta de navidad: «I bought a roof»
const Navidad: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#1f2a22">{(tt) => {
  const op = eio(tt, 0.8, 1.9) * 158, wr = eio(tt, 1.8, 3.3);
  return <div style={ab(960, 530, { perspective: 1700 })}>
    <div style={ab(-20, -360, { width: 620, height: 730, background: "linear-gradient(135deg,#f8f4e8,#e7e0cf)", boxShadow: SHAD })}><Hand x={46} y={240} s={118} k={wr} rot={-3}>I bought</Hand><Hand x={46} y={380} s={118} k={wr * 1.8 - 0.8} rot={-3}>a roof.</Hand></div>
    <div style={{ ...ab(-20, -360, { width: 620, height: 730, transformOrigin: "0 50%", transform: `rotateY(${-op}deg)`, background: "linear-gradient(135deg,#a52a2a,#6b1616)", boxShadow: "0 24px 50px rgba(0,0,0,.55)" }) }}>
      <svg width="620" height="730" viewBox="0 0 620 730"><path d="M310 130 L420 340 L366 340 L470 520 L150 520 L254 340 L200 340 Z" fill="#1f6a3a" /><rect x="282" y="520" width="56" height="70" fill="#6b4422" /></svg>
    </div>
  </div>;
}}</Stage>;

// 24 · aguja a 4.000 y las ruedas no empujan; marcha atrás sí
const Palanca: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#1b1e24" mesa={false}>{(tt) => {
  const rev = tt > 2.2, x = rev ? 1040 + eio(tt, 2.4, 3.8) * 420 : 1040, sp = tt * 900, needle = rev ? -60 : -120 + cl((tt - 0.5) * 2) * 150;
  return <>
    <div style={ab(0, 800, { width: 1920, height: 280, background: "linear-gradient(#45433e,#201f1c)" })} />
    <Car x={x} y={880} w={1040} c="#4a6a50" spin={rev ? -(tt - 2.2) * 200 : sp} />
    <div style={ab(640, 70, { width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(#22262b,#0d0e11)", boxShadow: "0 0 0 12px #5f666e," + SHAD })}><div style={ab(182, 70, { width: 14, height: 126, background: RED, transformOrigin: "50% 100%", transform: `rotate(${needle}deg)` })} /><div style={{ ...txt(0, 256, 62, TX), width: 380, textAlign: "center" }}>x1000</div></div>
    <div style={ab(1110, 150, { width: 240, height: 230, borderRadius: 18, background: "#1b1d21", boxShadow: SHAD })}><div style={{ ...txt(40, 44, 118, rev ? VER : "#6c7076") }}>R</div><div style={{ ...txt(130, 44, 118, rev ? "#6c7076" : RED) }}>D</div></div>
  </>;
}}</Stage>;

// 25 · la suspensión de aire se desinfla y el auto se arrodilla
const Suspension: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#1c2028" mesa={false}>{(tt) => {
  const k = eio(tt, 1.1, 2.9);
  return <>
    <div style={ab(0, 880, { width: 1920, height: 200, background: "linear-gradient(#3e3f43,#1c1c1f)" })} />
    <Car x={960} y={940 + k * 40} w={1300} c="#202a3a" rot={k * 3.1} o2="4% 86%" />
    <div style={ab(1420, 720, { width: 200, height: 200 - k * 120, borderRadius: 60, background: "linear-gradient(90deg,#17181b,#4d5158,#17181b)", marginTop: k * 120, boxShadow: "0 14px 20px rgba(0,0,0,.5)" })} />
    {Array.from({ length: 10 }, (_, i) => { const p = (tt * 1.2 + i * 0.1) % 1; return tt > 1 && tt < 3.2 && <div key={i} style={ab(1620 + p * 240, 790 + (i - 5) * 16 * p, { width: 16, height: 16, borderRadius: "50%", background: "rgba(255,255,255,.5)", opacity: 1 - p, filter: "blur(3px)" })} />; })}
    <Tag tt={tt} at={2.7} x={960} y={230} txt="3 MONTHS" col={RED} size={110} />
  </>;
}}</Stage>;

// 26 · vitrina de museo: el 4Runner tras el cordón
const Vitrina: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#231f2b" mesa={false}>{(tt) => {
  const gl = phys(tt, 0.6, 5.5, 0.5), sw = (Math.sin(tt * 1.7) * 8);
  return <>
    <div style={ab(0, 860, { width: 1920, height: 220, background: "linear-gradient(#6b1f2b,#2b0d13)" })} />
    <div style={ab(240, 810, { width: 1440, height: 70, background: "linear-gradient(#e7e2d2,#a7a18f)", boxShadow: SHAD })} />
    <Car x={960} y={824} w={1120} c="#4c5a3a" pick />
    <div style={ab(300, 140 - (1 - gl) * 700, { width: 1320, height: 680, background: "linear-gradient(115deg,rgba(255,255,255,.22),rgba(255,255,255,.03) 40%,rgba(255,255,255,.16))", boxShadow: "inset 0 0 0 5px rgba(240,240,245,.45)" })} />
    {[150, 1770].map((x) => <div key={x} style={ab(x - 14, 650, { width: 28, height: 260, background: CHROME, borderRadius: 12 })} />)}
    <svg width="1700" height="240" style={{ position: "absolute", left: 110, top: 640 }}><path d={`M40 20 Q850 ${190 + sw * 2} 1660 20`} fill="none" stroke="#a81f2f" strokeWidth="24" /></svg>
    <div style={ab(1440, 300, { width: 370, height: 200, transform: `rotate(${sw * .6}deg)`, background: "linear-gradient(#f4d264,#d7a92e)", clipPath: "polygon(16% 0,100% 0,100% 100%,16% 100%,0 50%)", opacity: cl(tt - 1.8) })}><div style={{ ...txt(66, 60, 72, "#231a07") }}>$$$$$</div></div>
  </>;
}}</Stage>;

// 27 · birrete: el Camry que fue a la universidad
const Birrete: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#20242c" mesa={false}>{(tt) => {
  const d = phys(tt, 0.7, 7, 0.34), sw = 20 * Math.exp(-(tt - 1.2) * 0.7) * Math.sin(tt * 5), y = 280 + (1 - d) * -620;
  return <>
    <div style={ab(0, 860, { width: 1920, height: 220, background: "linear-gradient(#45474a,#1e1f22)" })} />
    <Car x={960} y={910} w={1320} c="#d8d1be" />
    <div style={ab(960, y, { transform: "rotate(-5deg)" })}>
      <div style={ab(-340, -86, { width: 680, height: 170, background: "#121316", clipPath: "polygon(50% 0,100% 50%,50% 100%,0 50%)", boxShadow: SHAD })} /><div style={ab(-170, 0, { width: 340, height: 120, background: "#1c1d21", borderRadius: "0 0 40px 40px", zIndex: -1 })} />
      <div style={{ ...ab(-6, -8, { width: 10, height: 230, background: MZ, transformOrigin: "50% 0", transform: `rotate(${-60 + sw}deg)` }) }}><div style={ab(-18, 228, { width: 46, height: 92, background: MZ, borderRadius: 6 })} /></div>
    </div>
    <Tag tt={tt} at={2.5} x={1560} y={260} txt="NICE MANNERS" col={MZ} />
  </>;
}}</Stage>;

// 28 · la bomba de agua: el rotor gira y llora rosa por el sello
const Bomba: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#1d2126">{(tt) => {
  const a = tt * 200, w = cl((tt - 1) / 2.5);
  return <>
    <div style={ab(530, 150, { width: 760, height: 760, borderRadius: "50%", background: "conic-gradient(#8e959c,#d4d9de,#8a9198,#c8cdd2,#8e959c)", boxShadow: SHAD })}>
      <div style={ab(60, 60, { width: 640, height: 640, borderRadius: "50%", background: "radial-gradient(#223a4b,#0d1a24)" })} />
      <div style={{ position: "absolute", left: 380, top: 380, transform: `rotate(${a}deg)` }}>{Array.from({ length: 8 }, (_, i) => <div key={i} style={{ position: "absolute", left: 0, top: -30, width: 270, height: 60, borderRadius: "30px 0 80% 30px", background: "linear-gradient(#d6dade,#7c848c)", transformOrigin: "0 30px", transform: `rotate(${i * 45}deg)` }} />)}<div style={ab(-70, -70, { width: 140, height: 140, borderRadius: "50%", background: CHROME })} /></div>
    </div>
    {[[820, 840, 66], [880, 882, 94], [980, 860, 46], [760, 802, 40]].map(([x, y, r], i) => <div key={i} style={ab(x - r * w, y - r * w * 0.7, { width: r * 2 * w, height: r * 1.4 * w, borderRadius: "48%", background: "radial-gradient(circle at 40% 30%,#f5bcc9,#c36a84)" })} />)}
    <Tag tt={tt} at={2.5} x={1590} y={500} txt="LOOK HERE" col={MZ} size={70} />
  </>;
}}</Stage>;

// 29 · repartir: las fichas vuelan como en Las Vegas
const Repartir: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#132017" mesa={false}>{(tt) => {
  return <>
    <div style={ab(-200, 300, { width: 2320, height: 900, background: "radial-gradient(ellipse,#2b6a42,#123621)", transform: "perspective(1400px) rotateX(48deg)", transformOrigin: "50% 40%" })} />
    {Array.from({ length: 12 }, (_, i) => { const a = 0.4 + i * 0.25, k = eio(tt, a, a + 0.5), col = i % 6, row = i < 6 ? 0 : 1, fx = 330 + col * 252, fy = 500 + row * 320; return <div key={i} style={ab(lerp(1730, fx, k), lerp(170, fy, k), { width: 210, height: 290, marginLeft: -105, marginTop: -145, borderRadius: 12, background: k > 0.6 ? "repeating-linear-gradient(180deg,#fbf8ee 0 26px,#bcd0e6 26px 28px)" : "linear-gradient(#a32d2d,#5a1616)", boxShadow: "0 18px 30px rgba(0,0,0,.5)", transform: `rotate(${(1 - k) * 520 + (rnd(i) - 0.5) * 6}deg)` })}>{k > 0.6 && <div style={{ ...txt(0, 110, 46, "#a42c25", 1, HAND), width: 210, textAlign: "center" }}>{["oil", "tires", "brakes", "battery"][i % 4]}</div>}</div>; })}
    <div style={ab(1620, 70, { width: 220, height: 300, borderRadius: 12, background: "linear-gradient(#a32d2d,#5a1616)", boxShadow: "0 18px 30px rgba(0,0,0,.5), 4px 4px 0 #e9e2cd, 8px 8px 0 #cfc7b1, 12px 12px 0 #b9b19c" })} />
  </>;
}}</Stage>;

// 30 · cartel de la puerta que se da vuelta: «gone fishing»
const Pesca: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#1c2a33" mesa={false}>{(tt) => {
  const fl = eio(tt, 1.2, 1.9), sw = 8 * Math.exp(-Math.max(0, tt - 1.9) * 0.9) * Math.sin(tt * 6);
  return <>
    <div style={ab(330, 40, { width: 1260, height: 1000, background: "linear-gradient(#54402a,#2d2115)", boxShadow: SHAD })}><div style={ab(170, 60, { width: 920, height: 520, background: "linear-gradient(#a2c8d8,#d7e4dc)", boxShadow: "inset 0 0 0 16px #3b2c1b" })} /></div>
    <svg width="900" height="210" style={{ position: "absolute", left: 500, top: 60 }}><path d="M450 10 L170 170 M450 10 L730 170" stroke="#2e2e2e" strokeWidth="7" /><circle cx="450" cy="12" r="14" fill="#aaa" /></svg>
    <div style={{ position: "absolute", left: 960, top: 230, transform: `rotate(${sw}deg)`, transformOrigin: "0 -160px" }}><div style={{ transform: `perspective(1500px) rotateX(${fl < 0.5 ? fl * 180 : (fl - 1) * 180}deg)` }}>
      <div style={ab(-460, 0, { width: 920, height: 330, borderRadius: 14, background: fl < 0.5 ? "#e6dfcd" : "#b13a2a", boxShadow: "0 24px 44px rgba(0,0,0,.55)" })}><div style={{ ...txt(0, fl < 0.5 ? 92 : 58, fl < 0.5 ? 150 : 118, fl < 0.5 ? "#2c2a24" : "#fff4dc"), width: 920, textAlign: "center" }}>{fl < 0.5 ? "OPEN" : "GONE"}</div>{fl >= 0.5 && <div style={{ ...txt(0, 186, 118, "#fff4dc"), width: 920, textAlign: "center" }}>FISHING</div>}</div>
    </div></div>
    <div style={ab(630, 660 + 12 * Math.sin(tt * 2.2), { width: 660, height: 300, opacity: cl(tt - 2.2) })}><svg width="660" height="320"><path d="M60 40 Q330 -30 600 40" stroke="#c4c0b4" strokeWidth="5" fill="none" /><circle cx="330" cy="210" r="46" fill="#ee4a35" /><rect x="284" y="212" width="92" height="46" rx="20" fill="#f5f2e6" /></svg></div>
  </>;
}}</Stage>;

// 31 · la mesa de los siete
const Mesa7: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#2a2118">{(tt) => {
  const N = ["LESABRE", "ACCORD 4", "SILVERADO", "F-150 4.6", "COROLLA", "ES 350", "CAMRY 2.5"];
  const on = Math.floor(cl(tt / 4.2) * 7);
  return <>{N.map((n, i) => { const a = -21 + i * 7, x = 960 + (i - 3) * 248, y = 520 + Math.abs(i - 3) * 30, k = phys(tt, 0.1 + i * 0.09, 7, 0.5), lit = i === Math.min(6, on) ? 1 : i < on ? 0.3 : 0; return <div key={i} style={ab(x - 150, y - 240 - (1 - k) * 700, { width: 300, height: 430, borderRadius: 12, transform: `rotate(${a * 0.6}deg) translateY(${lit === 1 ? -44 : 0}px) scale(${lit === 1 ? 1.1 : 1})`, background: "repeating-linear-gradient(180deg,#fbf8ee 0 34px,#bcd0e6 34px 36px)", boxShadow: lit === 1 ? "0 0 70px rgba(255,214,120,.75), 0 30px 50px rgba(0,0,0,.5)" : "0 24px 40px rgba(0,0,0,.55)" })}><div style={{ ...txt(0, 60, 124, "#a42c25", 1, HAND), width: 300, textAlign: "center" }}>{7 - i}</div><div style={{ ...txt(-20, 250, 35, "#1e2b63"), width: 300, textAlign: "center" }}>{n}</div></div>; })}</>;
}}</Stage>;

// 32 · la lluvia tapa los golpes; el limpiaparabrisas los descubre
const Lluvia: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#10161d" mesa={false}>{(tt) => {
  const sw = eio(tt, 1.2, 2.2) * (1 - eio(tt, 2.3, 3.2)), a = -70 + sw * 118, stop = sw;
  return <>
    <div style={ab(0, 0, { width: 1920, height: 1080, background: "linear-gradient(115deg,#5b2c2e,#964b4c 45%,#4a2325)" })}>
      <svg width="1920" height="1080" style={{ position: "absolute" }}><path d="M500 300 C 720 340 860 420 1040 410" stroke="#d8d4cc" strokeWidth="9" fill="none" /><path d="M1090 620 q 110 -70 240 -10 q 70 90 -60 130 q -170 40 -210 -60 z" fill="#7a5a35" /><circle cx="1180" cy="660" r="26" fill="#3e2a18" /><circle cx="1290" cy="690" r="20" fill="#3e2a18" /></svg>
    </div>
    <div style={{ position: "absolute", inset: 0, background: "rgba(30,45,60,.55)", clipPath: `polygon(${(1 - stop) * 100 < 3 ? 100 : 0}% 0,100% 0,100% 100%,0 100%)`, opacity: 1 - stop * 0.9 }} />
    {Array.from({ length: 80 }, (_, i) => { const y = ((tt * 1800 + i * 137) % 1300) - 110, x = (i * 271) % 1920; return <div key={i} style={ab(x, y, { width: 3, height: 62, background: "rgba(220,235,250,.55)", transform: "rotate(9deg)" })} />; })}
    <div style={{ position: "absolute", left: 960, top: 1120, width: 20, height: 1100, marginTop: -1100, background: "#111", transformOrigin: "50% 100%", transform: `rotate(${a}deg)` }}><div style={ab(-8, 0, { width: 36, height: 1100, background: "#17181b", borderRadius: 10 })} /></div>
    <Tag tt={tt} at={2.5} x={520} y={190} txt="RAIN HIDES" col={TX} />
  </>;
}}</Stage>;

// 33 · la mano en el capó: mapa de calor
const CapoTibio: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#191d24" mesa={false}>{(tt) => {
  const hd = eio(tt, 0.3, 1.1), g = cl((tt - 1.1) / 1.8);
  return <>
    <div style={ab(0, 0, { width: 1920, height: 1080, background: "linear-gradient(115deg,#22354f,#4f6c8f 45%,#1d2d43)" })} />
    <div style={ab(960 - 720 * g, 620 - 460 * g, { width: 1440 * g, height: 920 * g, borderRadius: "50%", background: "radial-gradient(rgba(255,70,30,.95),rgba(255,140,30,.65) 42%,rgba(255,200,60,.28) 68%,transparent 74%)", mixBlendMode: "screen" })} />
    <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - hd) * 900}px)` }}>
      <svg width="760" height="1000" viewBox="0 0 760 1000" style={{ position: "absolute", left: 590, top: 300 }}><g fill="#cc9a73" stroke="#7f5535" strokeWidth="4"><rect x="130" y="140" width="96" height="300" rx="48" transform="rotate(-14 178 300)" /><rect x="262" y="72" width="98" height="360" rx="49" transform="rotate(-4 310 250)" /><rect x="396" y="82" width="98" height="350" rx="49" transform="rotate(5 445 250)" /><rect x="526" y="150" width="90" height="290" rx="45" transform="rotate(15 570 300)" /><rect x="150" y="380" width="470" height="620" rx="110" /></g></svg>
    </div>
    <Tag tt={tt} at={2.5} x={1540} y={180} txt="ALREADY WARM" col={MZ} />
  </>;
}}</Stage>;

// 34 · la caja de pañuelos sigue atrás: el auto que sobrevive
const Tissue: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#23262e" mesa={false}>{(tt) => {
  const sc = (tt * 420) % 1200, boxy = 3 * Math.sin(tt * 7);
  return <>
    <div style={ab(0, 0, { width: 1920, height: 720, background: "linear-gradient(#a8bfd3,#e0d7be)" })} />
    {[0, 1, 2, 3].map((i) => <div key={i} style={ab(((i * 500 + sc) % 2200) - 260, 330 - (i % 2) * 60, { width: 240, height: 340, borderRadius: "48% 48% 40% 40%", background: "linear-gradient(#5e7c4e,#3a5433)" })} />)}
    <div style={ab(0, 620, { width: 1920, height: 120, background: "linear-gradient(#49484a,#2d2c2f)" })} />
    <div style={ab(0, 0, { width: 1920, height: 1080, boxShadow: "inset 0 0 0 110px #b49a4e, inset 0 0 90px 120px rgba(0,0,0,.45)", borderRadius: 60 })} />
    <div style={ab(0, 740, { width: 1920, height: 340, background: "linear-gradient(#caa45a,#8a6a2c)" })} />
    <div style={ab(700, 500 + boxy, { width: 520, height: 260 })}><div style={ab(0, 40, { width: 520, height: 220, background: "linear-gradient(#e7a7a7,#b96d6d)", boxShadow: "0 16px 26px rgba(0,0,0,.45)" })}><div style={ab(150, 0, { width: 220, height: 24, background: "#7d4648", borderRadius: 12 })} /></div><div style={ab(190, -58, { width: 140, height: 120, background: "#fbf8f1", clipPath: "polygon(10% 100%,0 40%,30% 55%,50% 0,70% 55%,100% 40%,90% 100%)" })} /></div>
    <Tag tt={tt} at={2.3} x={960} y={150} txt="SAME BOX" col={MZ} size={96} />
  </>;
}}</Stage>;

// E1 · vidriera de empeño: el teléfono usado sale más que el auto
const Empeno: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#241d14" mesa={false}>{(tt) => {
  const a = phys(tt, 0.3, 7, 0.45), b = phys(tt, 1.2, 6, 0.42), sw = (d: number) => 7 * Math.exp(-Math.max(0, tt - d) * 1.1) * Math.sin(tt * 5);
  const Etq: React.FC<{ x: number; y: number; n: string; d: number; k: number; c: string }> = ({ x, y, n, d, k, c }) => <div style={{ position: "absolute", left: x, top: y - (1 - k) * 720, transformOrigin: "50% -70px", transform: `rotate(${sw(d)}deg)` }}><div style={ab(-1, -70, { width: 3, height: 74, background: "#d9d2bd" })} /><div style={ab(-170, 0, { width: 340, height: 150, background: c, clipPath: "polygon(50% 0,100% 18%,100% 100%,0 100%,0 18%)", boxShadow: SHAD })}><div style={{ ...txt(0, 46, 80, "#20180a"), width: 340, textAlign: "center" }}>{n}</div></div></div>;
  return <>
    <div style={ab(0, 0, { width: 1920, height: 1080, background: "linear-gradient(#3a2d1d,#1a140c)" })} />
    <div style={ab(100, 820, { width: 1720, height: 70, background: "linear-gradient(#87613a,#4a3119)", boxShadow: SHAD })} />
    <div style={ab(330 + 0, 820 - 520 - (1 - a) * 900, { width: 290, height: 520, borderRadius: 40, background: "linear-gradient(#2b2e33,#0f1012)", boxShadow: SHAD, transform: "rotate(-3deg)" })}><div style={ab(18, 22, { width: 254, height: 476, borderRadius: 26, background: "linear-gradient(145deg,#26475f,#111e2b)" })}><svg width="254" height="476"><path d="M36 40 L126 190 L88 260 L170 430 M126 190 L216 150" stroke="rgba(255,255,255,.75)" strokeWidth="3" fill="none" /></svg></div></div>
    <Car x={1290} y={820} w={830} c="#b9b3a2" o={b} />
    <Etq x={475} y={120} n="$2,400" d={0.9} k={a} c="linear-gradient(#f4d264,#d7a92e)" /><Etq x={1290} y={240} n="$1,900" d={1.8} k={b} c="linear-gradient(#f4d264,#d7a92e)" />
    <Tag tt={tt} at={2.6} x={1290} y={960} txt="60,000 MILES" col={MZ} size={78} />
  </>;
}}</Stage>;

// E2 · estetoscopio contra el block: el golpe crece con el pedal
const Estetoscopio: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#191c21" mesa={false}>{(tt) => {
  const d = phys(tt, 0.3, 6, 0.45), g = eio(tt, 1.7, 2.6), beat = (tt * (1.4 + g * 2.4)) % 1;
  return <>
    <div style={ab(330, 500, { width: 900, height: 520, borderRadius: 34, background: "linear-gradient(#7a7f86,#33363b)", boxShadow: SHAD })}>{[0, 1, 2, 3].map((i) => <div key={i} style={ab(60 + i * 205, 120, { width: 170, height: 170, borderRadius: "50%", background: "radial-gradient(#24262a,#0b0c0e)" })} />)}{Array.from({ length: 12 }, (_, i) => <div key={i} style={ab(40 + i * 70, 350, { width: 36, height: 130, borderRadius: 8, background: "rgba(0,0,0,.22)" })} />)}</div>
    {[0, 1, 2].map((i) => { const k = (beat + i / 3) % 1, big = 200 + g * 460; return <div key={i} style={ab(780 - k * big / 2 - 40, 500 - k * big / 2 - 40, { width: 80 + k * big, height: 80 + k * big, borderRadius: "50%", border: `${5 + g * 7}px solid rgba(255,${130 - g * 90},70,${(1 - k) * (0.4 + g * 0.6)})` })} />; })}
    <svg width="1920" height="1080" style={{ position: "absolute", left: 0, top: (1 - d) * -640 }}><path d="M780 460 C 780 240 1010 280 1010 40" fill="none" stroke="#1b1c1f" strokeWidth="24" /></svg>
    <div style={ab(700, 400 + (1 - d) * -640, { width: 160, height: 110, borderRadius: "50% 50% 24px 24px", background: CHROME, boxShadow: SHAD })} />
    <div style={{ position: "absolute", left: 1550, top: 790, transformOrigin: "50% 100%", transform: `rotate(${-34 + g * 30}deg)` }}><div style={ab(-110, -300, { width: 220, height: 320, borderRadius: 20, background: "linear-gradient(#3a3c41,#141518)", boxShadow: SHAD })}>{[0, 1, 2, 3, 4].map((i) => <div key={i} style={ab(26, 26 + i * 58, { width: 168, height: 22, borderRadius: 11, background: "#5f6268" })} />)}</div></div>
    <div style={ab(1320, 800, { width: 470, height: 60, borderRadius: 30, background: "#26282c" })} />
    <Tag tt={tt} at={2.7} x={1520} y={200} txt="LOUDER?" col={RED} size={110} />
  </>;
}}</Stage>;

// E3 · cae el cárter y brilla la limadura
const Carter: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#1d1b18" mesa={false}>{(tt) => {
  const f = eio(tt, 0.6, 1.5), b = f >= 1 ? 8 * Math.exp(-(tt - 1.5) * 5) * Math.sin((tt - 1.5) * 26) : 0, sp = cl((tt - 1.7) / 1.3);
  return <>
    <div style={ab(360, -40, { width: 1200, height: 340, borderRadius: "0 0 50px 50px", background: "linear-gradient(#83878e,#3a3d42)", boxShadow: SHAD })}>{Array.from({ length: 11 }, (_, i) => <div key={i} style={ab(40 + i * 106, 266, { width: 34, height: 34, borderRadius: "50%", background: CHROME })} />)}</div>
    <div style={ab(410, 300 + f * 420 + b, { width: 1100, height: 240, borderRadius: "22px 22px 90px 90px", background: "linear-gradient(#54575c,#26282c)", boxShadow: SHAD, transform: "perspective(900px) rotateX(-46deg)", transformOrigin: "50% 100%", overflow: "hidden" })}>
      <div style={ab(36, 22, { width: 1028, height: 186, borderRadius: 60, background: "linear-gradient(#8d2f1e,#4f190f)" })}>{Array.from({ length: 90 }, (_, i) => { const on = cl(sp * 90 - i), g = 0.5 + 0.5 * Math.sin(tt * 8 + i * 1.3); return <div key={i} style={ab(30 + rnd(i) * 960, 16 + rnd(i + 5) * 150, { width: 30 + rnd(i + 2) * 40, height: 7, borderRadius: 3, opacity: on, transform: `rotate(${rnd(i + 3) * 180}deg)`, background: `rgba(${210 + g * 45},${220 + g * 35},${235},1)`, boxShadow: g > 0.75 ? "0 0 16px #fff" : undefined })} />; })}</div>
    </div>
    <Tag tt={tt} at={2.8} x={960} y={1000} txt="READ THE PAN" col={MZ} size={78} />
  </>;
}}</Stage>;

// E4 · registradora: se abre y sale una polilla
const Registradora: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#201c15" mesa={false}>{(tt) => {
  const o = eio(tt, 1.0, 1.6), m = cl((tt - 1.7) / 2.6), yb = 8 * Math.exp(-Math.max(0, tt - 1.6) * 4) * Math.sin(tt * 26);
  return <>
    <div style={ab(0, 950, { width: 1920, height: 130, background: "linear-gradient(#70512e,#3b2813)" })} />
    <div style={ab(540, 320 + yb, { width: 840, height: 480, borderRadius: "34px 34px 6px 6px", background: "linear-gradient(#b3ab93,#6f6853)", boxShadow: SHAD })}>{Array.from({ length: 24 }, (_, i) => <div key={i} style={ab(70 + (i % 8) * 90, 180 + Math.floor(i / 8) * 90, { width: 70, height: 70, borderRadius: "50%", background: "radial-gradient(circle at 40% 30%,#f7f4ea,#a29a82)", boxShadow: "0 7px 0 #3c382c" })} />)}</div>
    <div style={ab(700, 110 + yb, { width: 520, height: 230, borderRadius: "18px 18px 0 0", background: "linear-gradient(#6f6853,#4e4839)" })}><div style={ab(40, 40, { width: 440, height: 150, borderRadius: 8, background: "#0a0c0a" })}><div style={{ position: "absolute", width: 440, textAlign: "center", top: 26, fontFamily: "'Courier New', monospace", fontWeight: 900, fontSize: 96, color: "#8dff9e" }}>$0.00</div></div></div>
    <div style={ab(540 - o * 46, 800, { width: 840 + o * 92, height: 110 + o * 130, background: "linear-gradient(#8f8872,#57513f)", boxShadow: SHAD, borderRadius: 8 })}>{o > 0.25 && <div style={ab(50, 16, { width: 830, height: 70 + o * 90, background: "linear-gradient(#17140f,#2b2519)", borderRadius: 6 })} />}</div>
    {m > 0 && <svg width="180" height="130" viewBox="0 0 18 13" style={{ position: "absolute", left: 960 + Math.sin(m * 11) * (70 + m * 260), top: 830 - m * 720, transform: `scaleY(${0.55 + 0.45 * Math.abs(Math.sin(tt * 24))})` }}><path d="M9 6 C5 0 0 1 1 6 C1 11 6 11 9 7 C12 11 17 11 17 6 C18 1 13 0 9 6Z" fill="#c9bfa6" /><rect x="8.3" y="3" width="1.4" height="8" rx=".7" fill="#5c5240" /></svg>}
  </>;
}}</Stage>;

// E5 · varilla y botella: un cuarto cada dos mil millas
const Cuarto: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#1e1c17" mesa={false}>{(tt) => {
  const pul = eio(tt, 0.4, 1.4), add = cl((tt - 1.8) / 2.0), tilt = eio(tt, 1.5, 2.0) * (1 - eio(tt, 4.0, 4.6)), mi = Math.round(lerp(142300, 144300, cl((tt - 0.4) / 3.6)));
  return <>
    <div style={ab(260, 150 - pul * 90, { width: 56, height: 780, background: CHROME, borderRadius: 20, boxShadow: SHAD })}><div style={ab(-24, -30, { width: 104, height: 70, borderRadius: "50%", border: "16px solid #e7b23a", boxSizing: "border-box" })} /><div style={ab(4, 580, { width: 48, height: 140, background: "repeating-linear-gradient(45deg,#6f747b 0 6px,#3e4247 6px 12px)" })} /><div style={ab(0, lerp(690, 620, add), { width: 56, height: lerp(90, 160, add), background: "linear-gradient(#d3a43d,#8a621a)" })} /></div>
    <div style={{ position: "absolute", left: 1180, top: 520, transform: `rotate(${-tilt * 78}deg)`, transformOrigin: "120px 120px" }}><div style={ab(-120, -280, { width: 340, height: 560, borderRadius: "30px 30px 26px 26px", background: "linear-gradient(90deg,#c9a02d,#f4d264 45%,#a98222)", boxShadow: SHAD })}><div style={ab(190, -70, { width: 110, height: 90, background: "#a98222" })} /><div style={{ ...txt(0, 240, 80, "#2a1c04"), width: 340, textAlign: "center" }}>1 QT</div></div></div>
    {tilt > 0.93 && <div style={ab(832, 575, { width: 26, height: 240, borderRadius: 13, background: "linear-gradient(#e0b04a,#a87a22)" })} />}
    <div style={ab(700, 790, { width: 290, height: 190, background: "linear-gradient(#3b3e44,#17181b)", clipPath: "polygon(0 0,100% 0,62% 100%,38% 100%)", boxShadow: SHAD })} />
    <div style={ab(640, 40, { width: 640, height: 150, borderRadius: 16, background: "#0c0d10", boxShadow: "inset 0 0 0 6px #3a3d43" })}><div style={{ position: "absolute", width: 640, textAlign: "center", top: 30, fontFamily: "'Courier New', monospace", fontWeight: 900, fontSize: 92, color: "#ffd27a" }}>{mi.toLocaleString("en-US")}</div></div>
  </>;
}}</Stage>;

export const TEC: Record<string, C> = { cuarto: Cuarto, empeno: Empeno, estetoscopio: Estetoscopio, carter: Carter, registradora: Registradora, cajarota: CajaRota, cloche: Cloche, zapatera: Zapatera, reverso: Reverso, carroceria: Carroceria, varillas: Varillas, mecedora: Mecedora, palitos: Palitos, codo: Codo, ganchos: Ganchos, cerilla: Cerilla, remolque: Remolque, estrella: Estrella, hitos: Hitos, bujiarota: BujiaRota, gato: Gato, taza: Taza, tamalera: Tamalera, panviejo: PanViejo, rodamiento: Rodamiento, tragamonedas: Tragamonedas, sludge: Sludge, navidad: Navidad, palanca: Palanca, suspension: Suspension, vitrina: Vitrina, birrete: Birrete, bomba: Bomba, repartir: Repartir, pesca: Pesca, mesa7: Mesa7, lluvia: Lluvia, capotibio: CapoTibio, tissue: Tissue };

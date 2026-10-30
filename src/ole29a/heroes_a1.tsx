// ole29a · componentes únicos 1-12 (bean-hole beans). Cada uno: escenario hkit (foto del momento desenfocada, piso cálido, polvo),
// entrada con resorte, cámara curva; texto ≤5 palabras por rótulo; nada de barras de %, tildes verdes ni paneles de texto.
import React from "react";
import { AMB, DIM, H, HAND, Head, ICE, Photo, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const deg = (a: number) => (a * Math.PI) / 180;

// 1 · 0:06 · EL TERMÓMETRO DE LA PUERTA: la aguja cae a −40, la escarcha crece en el vidrio; abajo, el parche de nieve que humea
export const ACold: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse at 50% 40%, #16202e, #04070c 75%)">{(tt) => {
  const drop = eio(tt, 0.5, 2.6), v = 20 - 60 * drop, a = -130 + ((v + 60) / 120) * 260, frost = eio(tt, 0.8, 4);
  const patch = phys(tt, 3.6, 5, 0.6);
  return <>
    <div style={{ position: "absolute", left: 640, top: 430, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * phys(tt, 0.1, 5, 0.55)})` }}>
      <div style={{ width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle at 38% 32%, #f4f1e8, #c9c3b2)", boxShadow: "0 50px 110px rgba(0,0,0,.7), inset 0 0 0 22px #6d6f75, inset 0 0 0 28px #3a3b40", position: "relative" }}>
        <svg width={560} height={560} viewBox="-280 -280 560 560" style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: 13 }, (_, i) => { const an = deg(-130 + i * (260 / 12) - 90), big = i % 2 === 0; return <g key={i}><line x1={Math.cos(an) * (big ? 190 : 205)} y1={Math.sin(an) * (big ? 190 : 205)} x2={Math.cos(an) * 225} y2={Math.sin(an) * 225} stroke="#222" strokeWidth={big ? 7 : 3} />
            {big && <text x={Math.cos(an) * 150} y={Math.sin(an) * 150 + 14} textAnchor="middle" fontWeight={900} fontSize={38} fill={i * 10 - 60 < 0 ? "#2a5fa0" : "#222"}>{i * 10 - 60}</text>}</g>; })}
          <g transform={`rotate(${a})`}><path d="M -9 20 L 0 -215 L 9 20 Z" fill="#c22a1e" /></g><circle r={22} fill="#222" />
          {/* escarcha: helechos de hielo que avanzan desde el borde */}
          {Array.from({ length: 18 }, (_, i) => { const an = deg(i * 20 + rnd(i) * 10), r0 = 250, len = 40 + 110 * frost * (0.5 + rnd(i, 2) * 0.5);
            const x0 = Math.cos(an) * r0, y0 = Math.sin(an) * r0, x1 = Math.cos(an) * (r0 - len), y1 = Math.sin(an) * (r0 - len);
            return <g key={"f" + i} stroke="rgba(230,244,255,.8)" strokeWidth={2.5} opacity={frost}><line x1={x0} y1={y0} x2={x1} y2={y1} />
              {[0.3, 0.55, 0.8].map((k, j) => { const px = x0 + (x1 - x0) * k, py = y0 + (y1 - y0) * k, l = len * 0.25; return <g key={j}><line x1={px} y1={py} x2={px + Math.cos(an + 2.4) * l} y2={py + Math.sin(an + 2.4) * l} /><line x1={px} y1={py} x2={px + Math.cos(an - 2.4) * l} y2={py + Math.sin(an - 2.4) * l} /></g>; })}</g>; })}
        </svg>
      </div>
    </div>
    <div style={{ position: "absolute", left: 1010, top: 300, fontWeight: 900, fontSize: 230, lineHeight: 1, color: v < -30 ? ICE : TX, textShadow: `0 0 ${50 * drop}px rgba(120,190,255,.5)` }}>{Math.round(v)}°</div>
    <Tag tt={tt} at={2.4} x={1020} y={560} txt="MINNESOTA NIGHT" col={DIM} size={40} anchor="l" />
    {/* el parche de nieve que humea */}
    <div style={{ position: "absolute", left: 1330, top: 830, width: 440 * patch, height: 120 * patch, transform: "translate(-50%,-50%)", borderRadius: "50%", background: "radial-gradient(ellipse, #6b5440 0%, #8c7a68 45%, #e3ebf4 75%, transparent 76%)", boxShadow: "0 0 60px rgba(255,170,90,.25)" }} />
    {patch > 0.05 && Array.from({ length: 9 }, (_, i) => { const ph = ((tt - 3.6) * (0.28 + rnd(i, 3) * 0.12) + rnd(i, 4)) % 1; return <div key={i} style={{ position: "absolute", left: 1220 + i * 26 + Math.sin(ph * 6 + i) * 18, top: 800 - ph * 330, width: 70, height: 70, borderRadius: "50%", background: "rgba(240,244,250,.5)", filter: "blur(18px)", opacity: Math.sin(ph * Math.PI) * patch }} />; })}
    <Tag tt={tt} at={4.4} x={1330} y={930} txt="NOTHING FREEZES HERE" col={AMB} size={38} />
  </>;
}}</Stage>;

// 2 · 0:21 · LA TIERRA EN CORTE: nieve, tierra, piedras y la olla con brasas a 3 pies; arriba, 40 platos salen de esa olla
export const AGround: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="linear-gradient(180deg,#0e1620 0%,#141c26 32%,#2a1d14 33%,#120c08 100%)">{(tt) => {
  const cut = eio(tt, 0.2, 1.6), glow = 0.6 + 0.4 * Math.sin(tt * 1.4);
  return <>
    {/* capas de la tierra que se abren como una torta cortada */}
    <div style={{ position: "absolute", left: 960 - 760 * cut, top: 360, width: 1520 * cut, height: 640, overflow: "hidden", borderRadius: 12, boxShadow: "0 40px 100px rgba(0,0,0,.7)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 60, background: "linear-gradient(180deg,#f1f5fb,#c9d4e4)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 60, height: 230, background: "repeating-linear-gradient(170deg,#4a3424 0 22px,#553c2a 22px 40px)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 290, bottom: 0, background: "repeating-linear-gradient(10deg,#3a281b 0 30px,#433022 30px 52px)" }} />
      {Array.from({ length: 26 }, (_, i) => <div key={i} style={{ position: "absolute", left: rnd(i, 1) * 1500, top: 90 + rnd(i, 2) * 520, width: 18 + rnd(i, 3) * 30, height: 12 + rnd(i, 4) * 18, borderRadius: "50%", background: "#6b5b4e" }} />)}
      {/* el pozo con piedras, brasas y la olla */}
      <div style={{ position: "absolute", left: 760 - 220, top: 330, width: 440, height: 290, borderRadius: "30px 30px 60px 60px", background: `radial-gradient(ellipse at 50% 90%, rgba(255,120,40,${0.9 * glow}), #4a2010 60%)`, boxShadow: `0 0 ${90 * glow}px rgba(255,120,40,.6)` }} />
      <div style={{ position: "absolute", left: 760 - 120, top: 380 + (1 - phys(tt, 1.0, 5, 0.5)) * -300, width: 240, height: 170, borderRadius: "20px 20px 50px 50px", background: "linear-gradient(180deg,#2b2b30,#0e0e10)", boxShadow: "inset 0 10px 0 #444" }} />
    </div>
    {/* la regla de 3 pies al costado */}
    <div style={{ position: "absolute", left: 1330, top: 420, width: 14, height: 470 * eio(tt, 1.6, 2.6), background: AMB, borderRadius: 7 }} />
    <Tag tt={tt} at={2.4} x={1370} y={650} txt="3 FEET DOWN" col={AMB} size={46} anchor="l" />
    {/* los 40 platos que salen de una olla */}
    {Array.from({ length: 40 }, (_, i) => { const s = phys(tt, 3.0 + i * 0.05, 7, 0.5), x = 300 + (i % 20) * 68, y = 200 + Math.floor(i / 20) * 70;
      return <div key={i} style={{ position: "absolute", left: x, top: y - (1 - cl(s)) * 60, width: 54, height: 54, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #e9edf1, #8b9299)", boxShadow: "inset 0 0 0 9px #b8bec5, 0 10px 20px rgba(0,0,0,.5)", opacity: cl(s * 2), transform: `scale(${0.6 + 0.4 * s})` }} />; })}
    <Tag tt={tt} at={4.6} x={960} y={130} txt="ONE POT · 40 MEN" size={52} />
  </>;
}}</Stage>;

// 3 · 1:42 · EL CUENTAKILÓMETROS DE CALORÍAS: tambores de bronce que giran hasta 7.500 mientras el hacha golpea
export const AOdo: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const val = 7500 * eio(tt, 0.8, 5.5), ds = String(Math.floor(val)).padStart(4, "0").split("");
  const chop = (tt * 0.9) % 1, axe = chop < 0.3 ? -60 + 120 * eio(chop, 0, 0.3) : 60 - 120 * ((chop - 0.3) / 0.7);
  return <>
    <div style={{ position: "absolute", left: 960, top: 520, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * phys(tt, 0.2, 5, 0.55)})`, display: "flex", gap: 16, padding: "30px 40px", borderRadius: 30, background: "linear-gradient(180deg,#3a2a1c,#1b130c)", boxShadow: "0 50px 110px rgba(0,0,0,.7), inset 0 0 0 6px #8a6a3a" }}>
      {ds.map((d, i) => { const frac = i === 3 ? (val % 1) : 0; const n = +d;
        return <div key={i} style={{ width: 170, height: 240, overflow: "hidden", borderRadius: 16, background: "linear-gradient(180deg,#111 0%,#2a2a2a 18%,#f0e6d2 30%,#f0e6d2 70%,#2a2a2a 82%,#111 100%)", position: "relative" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: -(n + frac) * 240, }}>{Array.from({ length: 11 }, (_, k) => <div key={k} style={{ height: 240, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 190, color: "#1b130c" }}>{k % 10}</div>)}</div>
        </div>; })}
    </div>
    <div style={{ position: "absolute", left: 960, top: 740, transform: "translateX(-50%)", fontWeight: 900, fontSize: 48, letterSpacing: 10, color: AMB, opacity: cl(tt - 1.2) }}>CALORIES</div>
    {/* el hacha que golpea el tronco al costado (cada golpe empuja los tambores) */}
    <div style={{ position: "absolute", left: 1640, top: 640, transformOrigin: "50% 100%", transform: `rotate(${axe}deg)` }}>
      <div style={{ width: 16, height: 300, background: "linear-gradient(90deg,#8a6236,#c39a62)", borderRadius: 8 }} />
      <div style={{ position: "absolute", left: -50, top: -10, width: 110, height: 70, background: "linear-gradient(90deg,#9aa0a8,#e4e8ec)", clipPath: "polygon(0 20%,100% 0,100% 100%,0 80%)" }} />
    </div>
    <div style={{ position: "absolute", left: 1560, top: 900, width: 220, height: 80, borderRadius: "50%", background: "radial-gradient(ellipse,#c9a070,#7a5434)" }} />
    <Tag tt={tt} at={5.8} x={960} y={880} txt="AT 20 BELOW" col={ICE} size={40} />
  </>;
}}</Stage>;

// 4 · 1:59 · LA BALANZA DE CAMPAMENTO: un jamón caro y pesado contra la bolsa de 100 lb; la balanza se vuelca a favor de los porotos
export const ABalance: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const tilt = -12 * eio(tt, 0.8, 2) + 26 * eio(tt, 3.6, 5.2) * (1 + 0.04 * Math.sin(tt * 4) * Math.exp(-(tt - 5.2)));
  const L = { x: -380 * Math.cos(deg(tilt)), y: -380 * Math.sin(deg(tilt)) }, R = { x: 380 * Math.cos(deg(tilt)), y: 380 * Math.sin(deg(tilt)) };
  return <>
    <div style={{ position: "absolute", left: 960, top: 420 }}>
      <div style={{ position: "absolute", left: -20, top: 0, width: 40, height: 520, background: "linear-gradient(90deg,#5a3f26,#8a6a44)", borderRadius: 10 }} />
      <div style={{ position: "absolute", left: -200, top: 500, width: 400, height: 40, background: "#4a3424", borderRadius: 10 }} />
      <div style={{ position: "absolute", left: -400, top: -10, width: 800, height: 22, borderRadius: 11, background: "linear-gradient(180deg,#b8a27a,#7a6644)", transform: `rotate(${tilt}deg)` }} />
      {[L, R].map((p, i) => <div key={i} style={{ position: "absolute", left: p.x, top: p.y }}>
        <div style={{ position: "absolute", left: -2, top: 0, width: 4, height: 150, background: "#333" }} />
        <div style={{ position: "absolute", left: -150, top: 150, width: 300, height: 30, borderRadius: "0 0 150px 150px", background: "linear-gradient(180deg,#9aa0a8,#5a6068)" }} />
        {i === 0 ? <div style={{ position: "absolute", left: -110, top: 40 + 70 * (1 - phys(tt, 0.4, 6, 0.5)), width: 220, height: 120, borderRadius: "60% 40% 50% 50%", background: "radial-gradient(ellipse at 40% 40%, #d98a7a, #8a3a2a)", boxShadow: "inset 0 0 0 10px #f2d2b8" }} />
          : <div style={{ position: "absolute", left: -120, top: -60 + 190 * (1 - phys(tt, 3.4, 5, 0.45)) * -1 + 0, width: 240, height: 210, borderRadius: "40% 40% 20% 20%", background: "repeating-linear-gradient(90deg,#c2a576 0 6px,#b39566 6px 12px)", boxShadow: "inset 0 -20px 30px rgba(0,0,0,.3)", opacity: cl((tt - 3.2) * 3) }}>
            <div style={{ position: "absolute", top: 70, width: "100%", textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 48, color: "#3a2a18" }}>100 lb</div></div>}
      </div>)}
    </div>
    <Tag tt={tt} at={1.2} x={560} y={300} txt="MEAT · HEAVY · DEAR" col={RED} size={38} />
    <Tag tt={tt} at={4.8} x={1360} y={300} txt="DRY BEANS" col={AMB} size={46} />
  </>;
}}</Stage>;

// 5 · 2:29 · «TRATALO COMO PLATA»: la bolsa se abre, los porotos caen y al tocar la mesa se vuelven monedas que se apilan
export const ACoins: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const N = 30;
  return <>
    <div style={{ position: "absolute", left: 520, top: 360, transform: `translate(-50%,-50%) scale(${phys(tt, 0.1, 5, 0.6)}) rotate(${-14 * eio(tt, 0.8, 1.6)}deg)` }}>
      <div style={{ width: 330, height: 400, borderRadius: "36% 36% 18% 18%", background: "repeating-linear-gradient(90deg,#c2a576 0 6px,#b39566 6px 12px)", boxShadow: "0 40px 90px rgba(0,0,0,.6), inset 0 -30px 40px rgba(0,0,0,.25)" }} />
    </div>
    {Array.from({ length: N }, (_, i) => {
      const st = 1.0 + i * 0.12, f = cl((tt - st) / 0.7); if (f <= 0) return null;
      const x = 620 + f * (480 + (i % 6) * 90), y = 420 + f * f * 300, coin = tt > st + 0.7, stack = Math.floor(i / 6), k = i % 6;
      const cx = 1050 + k * 120, cy = 760 - stack * 22;
      return coin ? <div key={i} style={{ position: "absolute", left: cx, top: cy, width: 100, height: 30, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 30%, #ffe3a0, #c08a2a)", boxShadow: "0 4px 0 #8a5a1a, 0 10px 20px rgba(0,0,0,.4)", transform: `translateY(${(1 - phys(tt, st + 0.7, 9, 0.4)) * -30}px)` }} />
        : <div key={i} style={{ position: "absolute", left: x, top: y, width: 26, height: 18, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 30%, #fff8ec, #d9c9a8)", transform: `rotate(${i * 47 + f * 300}deg)` }} />;
    })}
    <div style={{ position: "absolute", left: 980, top: 820, width: 840, height: 30, borderRadius: 8, background: "linear-gradient(180deg,#8a6a44,#4a3424)" }} />
    <div style={{ position: "absolute", left: 1400, top: 300, transform: "translate(-50%,-50%)", fontFamily: HAND, fontWeight: 700, fontSize: 92, color: AMB, opacity: cl(phys(tt, 4.4, 5, 0.6)), whiteSpace: "nowrap" }}>"treat it like money"</div>
    <Tag tt={tt} at={6.6} x={1400} y={420} txt="40 MEN TILL SPRING" size={40} />
  </>;
}}</Stage>;

// 6 · 3:19 · LA NOCHE ENTERA: arco de 12 h sobre el horizonte nevado; la luna cruza y el pozo brilla parejo abajo todo el tiempo
export const AMoon: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="linear-gradient(180deg,#05080f 0%,#0d1830 60%,#1a2640 100%)">{(tt) => {
  const p = eio(tt, 0.6, 8.2), an = deg(180 - 180 * p), mx = 960 + Math.cos(an) * 640, my = 760 - Math.sin(an) * 520;
  const hr = 18 + 12 * p;
  return <>
    {Array.from({ length: 60 }, (_, i) => <div key={i} style={{ position: "absolute", left: rnd(i, 1) * 1920, top: rnd(i, 2) * 620, width: 3, height: 3, borderRadius: 2, background: "#fff", opacity: 0.3 + 0.5 * rnd(i, 3) }} />)}
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d="M 320 760 A 640 520 0 0 1 1600 760" stroke="rgba(255,255,255,.16)" strokeWidth={4} strokeDasharray="10 14" fill="none" /></svg>
    <div style={{ position: "absolute", left: mx - 60, top: my - 60, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle at 40% 40%, #fffbe8, #d8d2b8)", boxShadow: "0 0 80px rgba(240,240,220,.5)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 760, bottom: 0, background: "linear-gradient(180deg,#d9e2ef,#8a98ad)" }} />
    {/* el pozo bajo la nieve: brilla parejo, sin subir ni bajar */}
    <div style={{ position: "absolute", left: 960, top: 900, width: 520, height: 150, transform: "translate(-50%,-50%)", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,140,60,.85), rgba(160,60,20,.55) 50%, transparent 72%)", filter: "blur(4px)" }} />
    <div style={{ position: "absolute", left: 960, top: 250, transform: "translateX(-50%)", fontWeight: 900, fontSize: 120, color: TX, textShadow: "0 10px 40px rgba(0,0,0,.6)" }}>{String(Math.floor(hr) % 24).padStart(2, "0")}:{String(Math.floor((hr % 1) * 60)).padStart(2, "0")}</div>
    <Tag tt={tt} at={1.6} x={960} y={400} txt="SLOWER THAN ANY STOVE" col={AMB} size={40} />
  </>;
}}</Stage>;

// 7 · 3:36 · LA VARA DE MEDIR: una vara de carpintero se despliega hasta 3 pies; la olla de 1 pie y el pozo de 2 pies se dibujan con tiza
export const AYard: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const seg = [0, 1, 2].map((i) => phys(tt, 0.4 + i * 0.6, 6, 0.55));
  const chalk = eio(tt, 3.2, 5.2);
  return <>
    {/* la vara plegable: tres tramos que se abren uno tras otro */}
    <div style={{ position: "absolute", left: 300, top: 260 }}>
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 0, top: i * 200 * seg[i] + (i > 0 ? 200 * (seg[i - 1] - 1) * 0 : 0), width: 80, height: 200, transformOrigin: "50% 0", transform: `rotate(${(1 - cl(seg[i])) * -90}deg)`, background: "linear-gradient(90deg,#e8c470,#d4a84a)", borderRadius: 6, boxShadow: "0 10px 30px rgba(0,0,0,.5)" }}>
        {Array.from({ length: 12 }, (_, k) => <div key={k} style={{ position: "absolute", left: 0, top: k * 16.6, width: k % 3 === 0 ? 40 : 22, height: 3, background: "#3a2a18" }} />)}
        <div style={{ position: "absolute", right: 6, bottom: 4, fontWeight: 900, fontSize: 30, color: "#3a2a18" }}>{i + 1}</div>
      </div>)}
    </div>
    <Tag tt={tt} at={2.2} x={420} y={890} txt="3 FEET, NOT 2" col={AMB} size={44} anchor="l" />
    {/* plano visto de arriba en tiza: la olla de 1 pie y el pozo del doble */}
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <rect x={760} y={240} width={880} height={620} rx={20} fill="#1d2420" stroke="#4a3a28" strokeWidth={18} />
      <circle cx={1200} cy={550} r={250} fill="none" stroke="#f1efe6" strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray={`${chalk} 1`} opacity={0.9} />
      <circle cx={1200} cy={550} r={125} fill="rgba(30,30,32,.9)" stroke="#f1efe6" strokeWidth={6} opacity={cl(phys(tt, 2.8, 6, 0.6))} />
      <line x1={1075} y1={550} x2={1325} y2={550} stroke={AMB} strokeWidth={5} opacity={cl(tt - 3.0)} />
      <line x1={950} y1={830} x2={1450} y2={830} stroke={AMB} strokeWidth={5} opacity={cl(tt - 4.6)} />
    </svg>
    <div style={{ position: "absolute", left: 1200, top: 505, transform: "translateX(-50%)", fontFamily: HAND, fontWeight: 700, fontSize: 46, color: AMB, opacity: cl(tt - 3.2) }}>pot · 1 ft</div>
    <div style={{ position: "absolute", left: 1200, top: 772, transform: "translateX(-50%)", fontFamily: HAND, fontWeight: 700, fontSize: 46, color: AMB, opacity: cl(tt - 4.8) }}>hole · 2 ft</div>
  </>;
}}</Stage>;

// 8 · 3:53 · CÁMARA TÉRMICA: el pozo justo deja los costados fríos (azules) y el centro crudo; el pozo ancho calienta pareja la olla
export const AHoles: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="#05050a">{(tt) => {
  const heat = eio(tt, 0.8, 3.6);
  const pot = (x: number, even: boolean, s: number) => <div style={{ position: "absolute", left: x, top: 560, transform: `translate(-50%,-50%) scale(${s})` }}>
    <div style={{ width: even ? 560 : 330, height: 420, borderRadius: "16px 16px 80px 80px", background: `radial-gradient(ellipse at 50% 100%, rgba(255,${even ? 150 : 90},40,${heat}), rgba(80,20,120,${0.6}) 70%)`, boxShadow: "inset 0 0 0 6px rgba(255,255,255,.15)" }} />
    <div style={{ position: "absolute", left: even ? 140 : 30, top: 40, width: 270, height: 200, borderRadius: "14px 14px 60px 60px", background: even ? `linear-gradient(90deg, rgb(255,${Math.round(110 + 90 * heat)},60), rgb(255,${Math.round(150 + 80 * heat)},80), rgb(255,${Math.round(110 + 90 * heat)},60))` : `linear-gradient(90deg, rgb(60,90,${Math.round(200)}), rgb(${Math.round(120 + 135 * heat)},120,80), rgb(60,90,200))`, boxShadow: "0 0 50px rgba(0,0,0,.6)" }} />
  </div>;
  return <>
    {pot(560, false, phys(tt, 0.2, 5, 0.6))}
    {pot(1360, true, phys(tt, 0.6, 5, 0.6))}
    <Tag tt={tt} at={1.4} x={560} y={240} txt="TOO SNUG" col={ICE} size={46} />
    <Tag tt={tt} at={1.8} x={1360} y={240} txt="ROOM ALL AROUND" col={AMB} size={46} />
    <Tag tt={tt} at={3.4} x={560} y={860} txt="COLD SIDES" col={ICE} size={34} />
    <Tag tt={tt} at={3.8} x={1360} y={860} txt="EVEN HEAT" col={AMB} size={34} />
  </>;
}}</Stage>;

// 9 · 4:05 · PIEDRA CONTRA TIERRA: dos curvas de calor que se dibujan a lo largo de la noche; la tierra se apaga, la piedra sigue
export const AGlow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const p = eio(tt, 2.0, 9.5), hrs = 12 * p;
  const stone = (x: number) => Math.exp(-x / 30), dirt = (x: number) => Math.exp(-x / 2.5);
  const X = (x: number) => 380 + x * 100, Y = (v: number) => 820 - v * 500;
  const path = (f: (x: number) => number) => Array.from({ length: 61 }, (_, i) => { const x = (i / 60) * hrs; return `${i ? "L" : "M"} ${X(x)} ${Y(f(x))}`; }).join(" ");
  return <>
    {/* las dos muestras: una piedra plana y un terrón, que se van apagando según su curva */}
    <div style={{ position: "absolute", left: 1640, top: 360, transform: `translate(-50%,-50%) scale(${phys(tt, 0.3, 6, 0.5)})`, width: 220, height: 120, borderRadius: "48% 52% 44% 56%", background: `radial-gradient(ellipse at 45% 40%, rgb(255,${Math.round(90 + 80 * stone(hrs))},40), #5a5048)`, boxShadow: `0 0 ${90 * stone(hrs)}px rgba(255,120,40,.7)` }} />
    <div style={{ position: "absolute", left: 1640, top: 640, transform: `translate(-50%,-50%) scale(${phys(tt, 0.7, 6, 0.5)})`, width: 200, height: 120, borderRadius: "30% 50% 40% 60%", background: `radial-gradient(ellipse at 45% 40%, rgb(${Math.round(80 + 170 * dirt(hrs))},${Math.round(50 + 50 * dirt(hrs))},30), #3a281b)`, boxShadow: `0 0 ${80 * dirt(hrs)}px rgba(255,120,40,.6)` }} />
    <Tag tt={tt} at={1.0} x={1640} y={470} txt="STONE" col={AMB} size={34} />
    <Tag tt={tt} at={1.3} x={1640} y={750} txt="DIRT" col={DIM} size={34} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <line x1={X(0)} y1={Y(0)} x2={X(12)} y2={Y(0)} stroke="rgba(255,255,255,.25)" strokeWidth={3} />
      {[0, 3, 6, 9, 12].map((k) => <text key={k} x={X(k)} y={Y(0) + 46} textAnchor="middle" fill="rgba(255,255,255,.5)" fontWeight={800} fontSize={28}>{k}h</text>)}
      <path d={path(dirt)} stroke="#a08868" strokeWidth={8} fill="none" />
      <path d={path(stone)} stroke={AMB} strokeWidth={10} fill="none" style={{ filter: `drop-shadow(0 0 12px ${AMB})` }} />
    </svg>
  </>;
}}</Stage>;

// 10 · 4:56 · LA PIEDRA DE ARROYO: el agua de adentro se vuelve vapor, la grieta corre y la piedra estalla en pedazos
export const ACrack: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse at 50% 60%, #2a1408, #050302 72%)">{(tt) => {
  const hot = eio(tt, 0.2, 2.0), crk = eio(tt, 1.6, 2.6), boom = cl((tt - 2.8) / 1.4);
  const pcs = 9;
  return <>
    {boom <= 0 ? <div style={{ position: "absolute", left: 960, top: 560, transform: `translate(-50%,-50%) scale(${phys(tt, 0, 5, 0.6)}) translateX(${crk > 0.6 ? Math.sin(tt * 70) * 4 * crk : 0}px)`, width: 520, height: 330, borderRadius: "48% 52% 46% 54%", background: `radial-gradient(ellipse at 40% 35%, #8a96a0, #3e4850)`, boxShadow: `0 0 ${120 * hot}px rgba(255,110,40,${0.6 * hot}), inset 0 -40px 60px rgba(0,0,0,.4)` }}>
      <svg width={520} height={330} style={{ position: "absolute", inset: 0 }}><path d="M 80 60 L 190 140 L 170 200 L 300 230 L 330 300 M 190 140 L 330 110 L 440 170" stroke="#ff8a3a" strokeWidth={7} fill="none" pathLength={1} strokeDasharray={`${crk} 1`} style={{ filter: "drop-shadow(0 0 10px #ff6a1a)" }} /></svg>
      {/* gotitas de agua atrapadas que hierven */}
      {Array.from({ length: 7 }, (_, i) => <div key={i} style={{ position: "absolute", left: 90 + rnd(i, 1) * 340, top: 70 + rnd(i, 2) * 190, width: 22, height: 22, borderRadius: "50%", background: "rgba(140,200,255,.8)", transform: `scale(${1 + 0.5 * hot * Math.sin(tt * 3 + i)})`, opacity: 1 - crk * 0.5 }} />)}
    </div> : Array.from({ length: pcs }, (_, i) => { const a = (i / pcs) * Math.PI * 2 + rnd(i) * 0.5, d = 700 * boom * (0.6 + rnd(i, 2) * 0.6);
      return <div key={i} style={{ position: "absolute", left: 960 + Math.cos(a) * d, top: 560 + Math.sin(a) * d * 0.7 + 400 * boom * boom, width: 120 + rnd(i, 3) * 90, height: 80 + rnd(i, 4) * 60, transform: `translate(-50%,-50%) rotate(${i * 80 * boom}deg)`, clipPath: "polygon(10% 0,100% 20%,80% 100%,0 70%)", background: "linear-gradient(135deg,#8a96a0,#3e4850)", opacity: 1 - boom * 0.6 }} />; })}
    {boom > 0 && <div style={{ position: "absolute", left: 960, top: 560, width: 900 * boom, height: 900 * boom, transform: "translate(-50%,-50%)", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,240,220,.5), transparent 60%)", opacity: 1 - boom }} />}
    <Tag tt={tt} at={0.8} x={960} y={200} txt="WATER INSIDE → STEAM" col={ICE} size={44} />
    <Tag tt={tt} at={3.2} x={960} y={930} txt="CREEK STONES · NEVER" col={RED} size={46} />
  </>;
}}</Stage>;

// 11 · 5:31 · EL ABANICO DE LEÑAS: cinco troncos en abanico; arce, abedul, roble y fresno quedan en brasa; el pino arde y se vuelve ceniza
export const AFan: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const W = [["MAPLE", "#c49a6a", 1], ["BIRCH", "#e8e2d4", 1], ["OAK", "#9a6a3a", 1], ["ASH", "#b8a080", 1], ["PINE", "#d9b77a", 0]] as [string, string, number][];
  const burn = eio(tt, 3.4, 7.5);
  return <>{W.map(([n, c, hard], i) => {
    const s = phys(tt, 0.3 + i * 0.35, 6, 0.5), a = -36 + i * 18, ash = !hard ? burn : 0, ember = hard ? burn : cl(burn * 3) * (1 - burn);
    return <div key={i} style={{ position: "absolute", left: 960, top: 880, transformOrigin: "50% 100%", transform: `rotate(${a * cl(s)}deg) translateY(${(1 - cl(s)) * 200}px)` }}>
      <div style={{ position: "absolute", left: -55, top: -600, width: 110, height: 560, borderRadius: 50, background: ash > 0.5 ? `linear-gradient(180deg, #9a9a98, #5a5a58)` : `linear-gradient(90deg, ${c}, #fff4 45%, ${c})`, boxShadow: `inset 0 0 0 6px rgba(0,0,0,.25), 0 0 ${90 * ember}px rgba(255,110,30,${ember})`, opacity: 1 - 0.55 * ash, transform: `scaleY(${1 - 0.5 * ash})`, transformOrigin: "50% 100%" }}>
        <div style={{ position: "absolute", left: 6, right: 6, top: 8, height: 94, borderRadius: "50%", background: `radial-gradient(circle, ${ember > 0.1 ? `rgba(255,${Math.round(120 + 60 * ember)},40,${0.4 + 0.6 * ember})` : "#e8d4a8"} 30%, #7a5434 32%, ${c} 70%)` }} />
      </div>
      <div style={{ position: "absolute", left: 0, top: -650, transform: `translateX(-50%) rotate(${-a * cl(s)}deg)`, fontWeight: 900, fontSize: 32, letterSpacing: 3, color: hard ? AMB : (burn > 0.5 ? RED : TX), whiteSpace: "nowrap", opacity: cl(s * 2) }}>{n}</div>
    </div>;
  })}
    <Tag tt={tt} at={5.2} x={960} y={140} txt="HARDWOOD HOLDS ITS COALS" col={AMB} size={44} />
  </>;
}}</Stage>;

// 12 · 6:10 · EL RELOJ DE ARENA DE BRASAS: en vez de arena caen brasas encendidas hasta la marca de 1 pie
export const ASand: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="radial-gradient(ellipse at 50% 55%, #24150c, #060403 72%)">{(tt) => {
  const p = eio(tt, 0.6, 4.6), turn = phys(tt, 0.1, 4, 0.6);
  return <>
    <div style={{ position: "absolute", left: 960, top: 540, transform: `translate(-50%,-50%) rotate(${180 - 180 * cl(turn)}deg)` }}>
      <svg width={520} height={760} viewBox="0 0 520 760">
        <defs><clipPath id="hgA"><path d="M 60 40 L 460 40 Q 460 260 290 370 L 290 390 Q 460 500 460 720 L 60 720 Q 60 500 230 390 L 230 370 Q 60 260 60 40 Z" /></clipPath></defs>
        <path d="M 60 40 L 460 40 Q 460 260 290 370 L 290 390 Q 460 500 460 720 L 60 720 Q 60 500 230 390 L 230 370 Q 60 260 60 40 Z" fill="rgba(200,230,255,.08)" stroke="rgba(220,240,255,.5)" strokeWidth={6} />
        <g clipPath="url(#hgA)">
          <rect x={0} y={40 + 320 * p} width={520} height={330 - 320 * p} fill="url(#emb)" />
          <rect x={0} y={720 - 300 * p} width={520} height={300 * p} fill="url(#emb)" />
          <rect x={254} y={370} width={12} height={350 - 300 * p} fill="#ffb060" opacity={p < 0.99 ? 1 : 0} />
        </g>
        <defs><radialGradient id="emb" cx="50%" cy="80%" r="80%"><stop offset="0%" stopColor="#ffd27a" /><stop offset="45%" stopColor="#ff7a1a" /><stop offset="100%" stopColor="#6a1a06" /></radialGradient></defs>
        <rect x={20} y={0} width={480} height={40} rx={10} fill="#6e4e30" /><rect x={20} y={720} width={480} height={40} rx={10} fill="#6e4e30" />
        <line x1={40} y1={420} x2={480} y2={420} stroke={AMB} strokeWidth={5} strokeDasharray="14 10" />
      </svg>
    </div>
    <Tag tt={tt} at={1.4} x={1440} y={420} txt="A FOOT OF COALS" col={AMB} size={50} anchor="l" />
    <Tag tt={tt} at={3.0} x={1440} y={520} txt="GLOWING ORANGE" col={TX} size={36} anchor="l" />
    <div style={{ position: "absolute", left: 320, top: 480, fontWeight: 900, fontSize: 150, color: TX }}>{(3 + p).toFixed(0)}<span style={{ fontSize: 60, color: DIM }}> h</span></div>
  </>;
}}</Stage>;

// stan29d · componentes únicos 19-36 (min 9-22).
import React from "react";
import { AMB, DIM, GRN, H, HAND, Head, ICE, MARK, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

const PINK = [226, 140, 140], BROWN = [150, 82, 40];
const mix = (a: number[], b: number[], k: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * cl(k))).join(",")})`;
const sh = (d = 40) => `0 ${d}px ${d * 2}px rgba(0,0,0,.6)`;
const SV: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>{children}</svg>;
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const Link: React.FC<{ w: number; h?: number; k?: number; style?: React.CSSProperties }> = ({ w, h = 110, k = 0, style }) => <div style={{ width: w, height: h, borderRadius: h / 2, background: `linear-gradient(180deg, ${mix([240, 170, 160], [196, 120, 70], k)}, ${mix(PINK, BROWN, k)})`, boxShadow: "inset 0 10px 16px rgba(255,255,255,.3), 0 14px 30px rgba(0,0,0,.4)", ...style }} />;

// ---- 8:56 · EL IMÁN: la tarjeta con la receta vuela a la puerta de la heladera y un imán la clava con un golpe ----
export const HMagnet: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const c = phys(tt, 0.3, 7, 0.45), m = phys(tt, 1.4, 10, 0.35);
  return <>
    <div style={{ position: "absolute", left: 560, top: 120, width: 800, height: 900, borderRadius: 30, background: "linear-gradient(90deg,#dfe3e6,#f4f6f7 40%,#cfd4d8)", boxShadow: sh(40) }}>
      <div style={{ position: "absolute", right: 40, top: 300, width: 24, height: 260, borderRadius: 12, background: "#9aa3ab" }} />
    </div>
    <div style={{ position: "absolute", left: 700, top: 300 + (1 - cl(c)) * 600, transform: `rotate(${-4 + (1 - cl(c)) * 40}deg)`, width: 460, height: 300, background: "#fffbea", boxShadow: "0 10px 20px rgba(0,0,0,.3)", padding: 30, boxSizing: "border-box", fontFamily: HAND, fontSize: 52, color: "#2b241c", lineHeight: 1.25 }}>
      1¾ tsp kosher<br />per lb of meat<br /><span style={{ color: "#b33a2a" }}>4 lb = 7 tsp</span>
    </div>
    <div style={{ position: "absolute", left: 910, top: 270 - (1 - cl(m)) * 300, width: 90, height: 90, borderRadius: 45, background: "radial-gradient(circle at 35% 35%,#ff8a7a,#b8281c)", boxShadow: "0 8px 0 #7a1810", opacity: cl(m * 4) }} />
    <Tag tt={tt} at={2.2} x={1560} y={540} txt="ON THE FRIDGE" col={AMB} size={44} />
  </>;
}}</Stage>;

// ---- 9:07 · EL POMO DE PEGAMENTO: el pomo aprieta y los granos sueltos se unen con hilos ----
export const HGlue: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const sq = eio(tt, 0.3, 1.0), j = eio(tt, 1.2, 3.6);
  const pts = Array.from({ length: 14 }, (_, i) => ({ x: 860 + (rnd(i) - 0.5) * 560 * (1 - j * 0.55), y: 640 + (rnd(i + 5) - 0.5) * 300 * (1 - j * 0.55) }));
  return <>
    <div style={{ position: "absolute", left: 320, top: 300, width: 180, height: 360 - 60 * sq, borderRadius: "40px 40px 30px 30px", background: "linear-gradient(90deg,#f3f3f0,#fff,#dcdcd6)", boxShadow: sh(20), transform: `scaleX(${1 + 0.15 * sq})` }}>
      <div style={{ position: "absolute", left: 20, right: 20, top: 120, height: 100, background: "#f0a640", borderRadius: 8, display: "grid", placeItems: "center", fontWeight: 900, fontSize: 30 }}>SALT</div>
      <div style={{ position: "absolute", left: 70, top: -70, width: 40, height: 80, background: "#f0a640", clipPath: "polygon(30% 0,70% 0,100% 100%,0 100%)" }} />
    </div>
    <SV>{pts.map((a, i) => pts.slice(i + 1).filter((b) => Math.hypot(a.x - b.x, a.y - b.y) < 240).map((b, k) => <line key={i + "-" + k} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#fff6e6" strokeWidth={4} opacity={j * 0.8} />))}</SV>
    {pts.map((p, i) => <div key={i} style={{ position: "absolute", left: p.x - 34, top: p.y - 26, width: 68, height: 52, borderRadius: 16, background: i % 4 ? `rgb(${PINK.join(",")})` : "#fbf5ea" }} />)}
    <Tag tt={tt} at={2.6} x={1440} y={300} txt="PROTEIN = GLUE" col={AMB} size={54} />
  </>;
}}</Stage>;

// ---- 10:16 · EL VITRAL: mitad sol de verano, mitad vitral de iglesia; la mejorana flota en el medio ----
export const HStained: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="#0c0a08">{(tt) => {
  const o = eio(tt, 0.2, 1.4);
  const cols = ["#d23b3b", "#2f6fd6", "#e7b53a", "#3aa86b", "#8b46c9", "#e57b2f"];
  return <>
    <div style={{ position: "absolute", left: 0, top: 0, width: 960, height: 1080, background: `radial-gradient(circle at 50% 40%, rgba(255,214,110,${o}), rgba(240,140,40,${o * 0.6}) 40%, #1a0f05 80%)` }} />
    <div style={{ position: "absolute", left: 480 - 130, top: 300, width: 260, height: 260, borderRadius: "50%", background: "#ffd86e", boxShadow: "0 0 120px #ffb02e", transform: `scale(${o}) rotate(${tt * 20}deg)` }} />
    <div style={{ position: "absolute", left: 1180, top: 160, width: 520, height: 760, borderRadius: "260px 260px 10px 10px", overflow: "hidden", border: "16px solid #2a2a2a", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, background: "#2a2a2a" }}>
      {Array.from({ length: 24 }, (_, i) => <div key={i} style={{ background: cols[(i * 7) % 6], opacity: cl((tt - 0.4 - i * 0.04) * 3) * (0.75 + 0.25 * Math.sin(tt * 2 + i)) }} />)}
    </div>
    {Array.from({ length: 10 }, (_, i) => <div key={i} style={{ position: "absolute", left: 900 + Math.sin(tt * 1.5 + i) * 60, top: 820 - ((tt * 80 + i * 70) % 700), width: 26, height: 14, borderRadius: "50%", background: "#7aa04a", transform: `rotate(${i * 40 + tt * 60}deg)` }} />)}
    <Tag tt={tt} at={1.6} x={960} y={980} txt="MARJORAM · SUMMER + CHURCH" col={AMB} size={44} />
  </>;
}}</Stage>;

// ---- 10:34 · EL CARRUSEL DE FRASCOS: gira y cada frasco que pasa al frente cambia el nombre de la salchicha ----
export const HCarousel: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const jars = [["POLISH", "MARJORAM", "#7aa04a"], ["ITALIAN", "FENNEL", "#c9a44a"], ["BREAKFAST", "SAGE", "#8fb38f"]];
  const rot = eio(tt, 0.6, 1.8) * 120 + eio(tt, 2.6, 3.8) * 120, front = Math.round(rot / 120) % 3;
  return <>
    {jars.map(([n, s, c], i) => { const a = ((i * 120 - rot) * Math.PI) / 180, z = Math.cos(a); return <div key={i} style={{ position: "absolute", left: 960 + Math.sin(a) * 420 - 130, top: 380 - z * 30, transform: `scale(${0.7 + 0.3 * (z + 1) / 2})`, zIndex: Math.round(z * 10) + 10, opacity: 0.5 + 0.5 * (z + 1) / 2 }}>
      <div style={{ width: 260, height: 50, background: "#2a2a2a", borderRadius: 12 }} />
      <div style={{ width: 260, height: 300, borderRadius: "0 0 30px 30px", background: `linear-gradient(90deg,rgba(255,255,255,.15),rgba(255,255,255,.35),rgba(255,255,255,.1)), ${c}`, display: "grid", placeItems: "center", fontWeight: 900, fontSize: 34, color: "#1a1410" }}>{s}</div>
    </div>; })}
    <div style={{ position: "absolute", left: 0, right: 0, top: 820, textAlign: "center", fontWeight: 900, fontSize: 80, color: TX }}>{jars[front][0]} SAUSAGE</div>
    <Tag tt={tt} at={1.0} x={960} y={200} txt="SAME METHOD · SAME SALT" col={AMB} size={44} />
  </>;
}}</Stage>;

// ---- 10:49 · LA TELARAÑA: un frasco de ajo en polvo cubierto de polvo y telarañas, con la etiqueta 1979 ----
export const HCobweb: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(circle at 50% 50%,#2a2218,#0a0805 70%)">{(tt) => {
  const w = eio(tt, 0.3, 2.0);
  return <>
    <div style={{ position: "absolute", left: 820, top: 340, width: 280, height: 60, background: "#5a4a35", borderRadius: 10 }} />
    <div style={{ position: "absolute", left: 820, top: 400, width: 280, height: 380, borderRadius: "0 0 40px 40px", background: "linear-gradient(90deg,#c9b996,#e6d8b6,#b8a682)", filter: "saturate(.5)" }}>
      <div style={{ position: "absolute", left: 30, right: 30, top: 110, height: 150, background: "#d9c9a0", border: "3px solid #8a7a5a", display: "grid", placeItems: "center", textAlign: "center", fontWeight: 900, fontSize: 30, color: "#5a4a35" }}>GARLIC<br />POWDER<br /><span style={{ fontSize: 22 }}>BEST BY 1979</span></div>
      <div style={{ position: "absolute", inset: 0, background: "rgba(180,170,150,.35)", borderRadius: "0 0 40px 40px" }} />
    </div>
    <SV>{Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return <line key={i} x1={1100} y1={340} x2={1100 + Math.cos(a) * 240 * w} y2={340 + Math.sin(a) * 240 * w} stroke="rgba(240,240,240,.55)" strokeWidth={2} />; })}
      {[60, 120, 180, 240].map((r, i) => <circle key={i} cx={1100} cy={340} r={r * w} fill="none" stroke="rgba(240,240,240,.45)" strokeWidth={2} strokeDasharray="10 6" />)}</SV>
    <Tag tt={tt} at={2.4} x={480} y={500} txt="FRESH GARLIC" col={GRN} size={50} />
    <Tag tt={tt} at={2.8} x={480} y={580} txt="FRESH PEPPER" col={GRN} size={50} />
  </>;
}}</Stage>;

// ---- 11:44 · LA PALMA DADA VUELTA: la mano gira 180° y la bola de carne queda pegada sin caerse ----
export const HPalm: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const r = 180 * eio(tt, 0.8, 2.0), wob = Math.sin(tt * 9) * 4 * cl(tt - 2.0) * (1 - cl(tt - 3.2));
  return <>
    <div style={{ position: "absolute", left: 960, top: 540, transform: `translate(-50%,-50%) rotate(${r}deg)` }}>
      <div style={{ width: 380, height: 300, borderRadius: "40% 40% 50% 50%", background: "#e7c3a6", boxShadow: "inset 0 -20px 30px rgba(0,0,0,.15)" }} />
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 20 + i * 92, top: -150 + Math.abs(i - 1.5) * 20, width: 70, height: 180, borderRadius: 35, background: "#e7c3a6" }} />)}
      <div style={{ position: "absolute", left: 120, top: 40, width: 140, height: 120, borderRadius: "50%", background: `radial-gradient(circle at 40% 30%, #f6b5b8, rgb(${PINK.join(",")}))`, transform: `translateY(${-wob}px)`, boxShadow: "0 -6px 0 rgba(0,0,0,.1)" }} />
    </div>
    <Tag tt={tt} at={2.4} x={960} y={950} txt="IT STICKS = THE BIND" col={GRN} size={56} />
  </>;
}}</Stage>;

// ---- 11:55 · EL CARAMELO MASTICABLE: dos manos estiran la pasta y aparecen hilos finos entre los dos pedazos ----
export const HTaffy: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const s = eio(tt, 0.4, 2.6), gap = 40 + 460 * s;
  return <>
    {[-1, 1].map((d) => <div key={d} style={{ position: "absolute", left: 960 + d * gap / 2 - 110, top: 430, width: 220, height: 200, borderRadius: "45%", background: `radial-gradient(circle at 40% 30%,#f6b5b8,rgb(${PINK.join(",")}))`, transform: `rotate(${d * 10 * s}deg)` }} />)}
    <SV>{Array.from({ length: 9 }, (_, i) => { const y = 470 + i * 16, sag = 30 * s * (1 + rnd(i)); return <path key={i} d={`M${960 - gap / 2 + 90} ${y} Q960 ${y + sag} ${960 + gap / 2 - 90} ${y}`} stroke="#f2a9b0" strokeWidth={5 - s * 3} fill="none" opacity={s > 0.05 ? 0.9 : 0} />; })}</SV>
    <Tag tt={tt} at={1.4} x={960} y={300} txt="LITTLE STRINGS · LIKE TAFFY" col={AMB} size={50} />
    <Tag tt={tt} at={2.8} x={960} y={820} txt="YOU'RE THERE" col={GRN} size={56} />
  </>;
}}</Stage>;

// ---- 12:28 · NO TOCAR vs AMASAR: la hamburguesa con un cartel «no tocar»; la salchicha con dos puños que la trabajan ----
export const HVersus: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const k = Math.abs(Math.sin(tt * 6)) * cl(tt - 1.4);
  return <>
    <div style={{ position: "absolute", left: 958, top: 120, width: 4, height: 840, background: "rgba(255,255,255,.3)" }} />
    <div style={{ position: "absolute", left: 300, top: 560, width: 360, height: 110, borderRadius: "50%", background: "linear-gradient(180deg,#b06a48,#7a3c22)" }} />
    <div style={{ position: "absolute", left: 360, top: 300, width: 240, height: 160, borderRadius: 20, border: `10px solid ${RED}`, display: "grid", placeItems: "center", fontWeight: 900, fontSize: 40, color: RED, transform: `rotate(-8deg) scale(${cl(phys(tt, 0.6, 8, 0.4))})` }}>DON'T<br />TOUCH</div>
    <div style={{ position: "absolute", left: 1220, top: 560 + 20 * k, width: 400, height: 130 - 30 * k, borderRadius: 65, background: `rgb(${PINK.join(",")})`, transform: `scaleX(${1 + 0.12 * k})` }} />
    {[-1, 1].map((d) => <div key={d} style={{ position: "absolute", left: 1420 + d * 120 - 60, top: 400 + 120 * (d > 0 ? k : 1 - k), width: 120, height: 140, borderRadius: 40, background: "#e7c3a6" }} />)}
    <Tag tt={tt} at={0.4} x={480} y={820} txt="BURGER" col={TX} size={56} />
    <Tag tt={tt} at={0.8} x={1420} y={820} txt="SAUSAGE · WORK IT" col={AMB} size={56} />
  </>;
}}</Stage>;

// ---- 13:40 · LA NUEZ: la cáscara se parte en dos y de adentro sale la bolita que se aplasta en hamburguesita ----
export const HWalnut: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const op = eio(tt, 0.7, 1.4), fl = eio(tt, 1.8, 2.8), fry = eio(tt, 3.0, 4.6);
  return <>
    {[-1, 1].map((d) => <div key={d} style={{ position: "absolute", left: 960 - 110 + d * 260 * op, top: 380 + 120 * op, width: 220, height: 260, borderRadius: d < 0 ? "110px 0 0 110px / 130px 0 0 130px" : "0 110px 110px 0 / 0 130px 130px 0", background: "repeating-radial-gradient(circle at 50% 50%,#9a6a3a 0 10px,#7a4e26 10px 20px)", transform: `rotate(${d * 30 * op}deg)`, clipPath: d < 0 ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)", opacity: 1 - fry }} />)}
    <div style={{ position: "absolute", left: 960, top: 520, transform: `translate(-50%,-50%) scale(${0.3 + 0.7 * op}, ${(0.3 + 0.7 * op) * (1 - 0.6 * fl)})`, width: 200 + 140 * fl, height: 200, borderRadius: "50%", background: `radial-gradient(circle at 40% 30%, ${mix([246, 181, 184], [214, 150, 90], fry)}, ${mix(PINK, BROWN, fry)})` }} />
    <Tag tt={tt} at={1.6} x={960} y={240} txt="WALNUT-SIZED TEST PATTY" col={AMB} size={50} />
    <Tag tt={tt} at={3.4} x={960} y={860} txt="FRY · COOL · TASTE" col={TX} size={46} />
  </>;
}}</Stage>;

// ---- 14:47 · LA CEJA: en la pantalla sólo un par de ojos; una ceja sube lentamente y queda ahí ----
export const HEyebrow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" bg="#0b0a09">{(tt) => {
  const up = eio(tt, 1.2, 2.4), blink = Math.abs(tt - 0.8) < 0.08 ? 0.1 : 1;
  return <>
    {[-1, 1].map((d) => <div key={d}>
      <div style={{ position: "absolute", left: 960 + d * 230 - 120, top: 470, width: 240, height: 130 * blink, transform: `translateY(${65 * (1 - blink)}px)`, borderRadius: "50%", background: "#f4efe6", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 80 + 10 * d, top: 25, width: 80, height: 80, borderRadius: 40, background: "#3a2a1a" }} />
      </div>
      <div style={{ position: "absolute", left: 960 + d * 230 - 140, top: 390 - (d > 0 ? 110 * up : 0), width: 280, height: 40, borderRadius: 20, background: "#cfcac0", transform: `rotate(${d > 0 ? -8 * up : 4}deg)` }} />
    </div>)}
    <Tag tt={tt} at={2.6} x={960} y={780} txt="1988 · ONE EYEBROW" col={AMB} size={50} />
    <Tag tt={tt} at={3.4} x={960} y={860} txt="NEVER SKIPPED THE TEST AGAIN" col={TX} size={42} />
  </>;
}}</Stage>;

// ---- 16:03 · EL ENVOLTORIO DE CARAMELO: el film se enrolla y las dos puntas giran hasta dejar el cilindro firme ----
export const HCandy: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const tw = eio(tt, 0.8, 3.2), turns = tw * 6;
  return <>
    <div style={{ position: "absolute", left: 660, top: 470, width: 600, height: 140 - 20 * tw, borderRadius: 70, background: `linear-gradient(180deg,rgba(255,255,255,.55),rgba(255,255,255,.1) 40%,rgba(255,255,255,.4)), rgb(${PINK.join(",")})`, transform: `translateY(${10 * tw}px)` }} />
    {[-1, 1].map((d) => <div key={d} style={{ position: "absolute", left: d < 0 ? 520 : 1260, top: 480, width: 140, height: 120, clipPath: d < 0 ? "polygon(0 0,100% 30%,100% 70%,0 100%)" : "polygon(0 30%,100% 0,100% 100%,0 70%)", background: `repeating-linear-gradient(${60 + turns * 30 * d}deg, rgba(255,255,255,.75) 0 10px, rgba(220,230,240,.35) 10px 20px)` }} />)}
    {[-1, 1].map((d) => <div key={"a" + d} style={{ position: "absolute", left: d < 0 ? 520 : 1300, top: 380, fontSize: 70, color: AMB, transform: `rotate(${tt * 360 * d}deg)`, opacity: cl(tt - 0.8) * (1 - cl(tt - 3.4)) }}>↻</div>)}
    <Tag tt={tt} at={1.0} x={960} y={250} txt="NO CASINGS · PLASTIC WRAP" col={AMB} size={48} />
    <Tag tt={tt} at={3.4} x={960} y={820} txt="CHILL OVERNIGHT" col={ICE} size={46} />
  </>;
}}</Stage>;

// ---- 17:32 · EL AGUA QUE SE EVAPORA: la sartén con tapa, el nivel baja, se va el vapor y empiezan a dorar ----
export const HEvap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const lid = eio(tt, 0.2, 0.9), w = eio(tt, 0.8, 3.2), br = eio(tt, 2.8, 4.4);
  return <>
    <div style={{ position: "absolute", left: 500, top: 520, width: 920, height: 220, borderRadius: "0 0 160px 160px", background: "linear-gradient(180deg,#2c2c2e,#121213)", boxShadow: sh(30), overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${70 * (1 - w)}%`, background: "rgba(140,190,220,.55)" }} />
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 140 + i * 230, top: 70, width: 200, height: 80, borderRadius: 40, background: `linear-gradient(180deg, ${mix([240, 170, 160], [214, 140, 70], br)}, ${mix(PINK, BROWN, br)})` }} />)}
    </div>
    <div style={{ position: "absolute", left: 1420, top: 600, width: 320, height: 40, borderRadius: 20, background: "#2c2c2e" }} />
    <div style={{ position: "absolute", left: 520 + 900 * lid, top: 430 - 200 * lid, width: 880, height: 80, borderRadius: "440px 440px 10px 10px", background: "linear-gradient(180deg,#c9d0d8,#8a939c)", transform: `rotate(${25 * lid}deg)`, opacity: 1 - lid * 0.8 }} />
    {Array.from({ length: 12 }, (_, i) => { const k = (tt * 0.6 + rnd(i)) % 1; return <div key={i} style={{ position: "absolute", left: 560 + rnd(i + 3) * 800, top: 520 - k * 320, width: 80, height: 80, borderRadius: 40, background: "rgba(230,240,250,.5)", filter: "blur(10px)", opacity: (1 - k) * (1 - w) }} />; })}
    <Tag tt={tt} at={0.6} x={960} y={200} txt="WATER · LID · THEN BROWN" col={AMB} size={48} />
    <Tag tt={tt} at={3.4} x={960} y={860} txt="160 °F IN THE CENTER" col={GRN} size={46} />
  </>;
}}</Stage>;

// ---- 18:04 · LAS FUENTES: un tenedor pincha y cada agujero larga un chorrito en arco ----
export const HFountain: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const holes = [0.9, 1.5, 2.1, 2.7].filter((a) => tt > a);
  return <>
    <div style={{ position: "absolute", left: 560, top: 560, width: 800, height: 160, borderRadius: 80, background: `linear-gradient(180deg,#d68a4a,rgb(${BROWN.join(",")}))`, boxShadow: sh(30) }} />
    {[0.9, 1.5, 2.1, 2.7].map((a, i) => { const k = cl((tt - a + 0.3) / 0.3), back = cl((tt - a) * 4); return k > 0 && back < 1 && <div key={"f" + i} style={{ position: "absolute", left: 680 + i * 170, top: 300 + 240 * (k < 1 ? k : 1 - back), width: 60, height: 260 }}>{[0, 1, 2, 3].map((p) => <div key={p} style={{ position: "absolute", left: p * 16, top: 0, width: 6, height: 240, background: "#cfd4d8", borderRadius: 3 }} />)}</div>; })}
    <SV>{holes.map((a, i) => { const x = 700 + i * 170; return Array.from({ length: 10 }, (_, j) => { const k = ((tt - a) * 1.4 + j / 10) % 1; const dx = (j % 2 ? 1 : -1) * 160 * k, y = 560 - 260 * 4 * k * (1 - k) + 100 * k; return <circle key={i + "-" + j} cx={x + dx} cy={y} r={9 - 4 * k} fill="#f2c46b" opacity={1 - k} />; }); })}</SV>
    <Tag tt={tt} at={1.0} x={960} y={200} txt="EVERY HOLE = A FOUNTAIN" col={RED} size={52} />
    <Tag tt={tt} at={3.2} x={960} y={880} txt="NO FORK" col={TX} size={60} />
  </>;
}}</Stage>;

// ---- 19:37 · LA LUNA: el sol baja detrás de la vidriera, sale la luna y la carne queda esperando el fresco ----
export const HMoon: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const n = eio(tt, 0.4, 2.6);
  return <>
    <div style={{ position: "absolute", left: 460, top: 160, width: 1000, height: 600, borderRadius: 12, overflow: "hidden", border: "14px solid #3a2a1a", background: `linear-gradient(180deg, ${mix([255, 170, 90], [12, 20, 48], n)}, ${mix([255, 214, 150], [30, 40, 80], n)})` }}>
      <div style={{ position: "absolute", left: 300, top: 120 + 500 * n, width: 160, height: 160, borderRadius: 80, background: "#ffd06a", boxShadow: "0 0 80px #ffb030" }} />
      <div style={{ position: "absolute", left: 640, top: 600 - 480 * n, width: 140, height: 140, borderRadius: 70, background: "#f2efe2", boxShadow: "0 0 60px rgba(240,240,220,.7)" }} />
      {Array.from({ length: 20 }, (_, i) => <div key={i} style={{ position: "absolute", left: rnd(i) * 970, top: rnd(i + 4) * 300, width: 4, height: 4, borderRadius: 2, background: "#fff", opacity: n * (0.5 + 0.5 * Math.sin(tt * 3 + i)) }} />)}
    </div>
    <div style={{ position: "absolute", left: 1500, top: 240, width: 90, height: 380, borderRadius: 45, background: "#1a1b1e", border: "5px solid #444", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${80 - 50 * n}%`, background: mix([255, 90, 74], [143, 214, 255], n) }} />
    </div>
    <Tag tt={tt} at={2.6} x={960} y={880} txt="WARM ROOM? HE WAITED FOR NIGHT" col={AMB} size={44} />
  </>;
}}</Stage>;

// ---- 20:09 · LA PLUMA Y LA BALANZA DE GRASA: plumas que caen livianas; se agregan cubitos de manteca hasta 20 % ----
export const HFeather: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const add = eio(tt, 2.0, 3.8);
  return <>
    {Array.from({ length: 6 }, (_, i) => { const y = ((tt * 90 + i * 140) % 820) + 80; return <div key={i} style={{ position: "absolute", left: 300 + i * 90 + Math.sin(tt * 2 + i) * 60, top: y, width: 40, height: 140, borderRadius: "50% 50% 50% 50% / 80% 80% 20% 20%", background: "linear-gradient(90deg,#efe9df,#fff)", transform: `rotate(${Math.sin(tt * 2 + i) * 30}deg)`, opacity: 0.8 }} />; })}
    <div style={{ position: "absolute", left: 1040, top: 240, width: 140, height: 600, borderRadius: 20, border: "6px solid #555", background: "#1a1b1e", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${8 + 12 * add}%`, background: "#fbf5ea" }} />
      <div style={{ position: "absolute", left: -10, right: -10, bottom: "20%", height: 4, background: GRN }} />
    </div>
    {Array.from({ length: 5 }, (_, i) => { const d = cl((tt - 2.0 - i * 0.3) * 2.5); return <div key={i} style={{ position: "absolute", left: 1090, top: 120 + d * 640, width: 40, height: 40, background: "#f6e6a8", borderRadius: 6, opacity: d > 0.95 ? 0 : cl(d * 4) }} />; })}
    <Tag tt={tt} at={0.5} x={600} y={200} txt="CHICKEN · TURKEY = LEAN" col={TX} size={44} />
    <Tag tt={tt} at={2.4} x={1260} y={560} txt="+ COLD BUTTER → 20 %" col={AMB} size={40} anchor="l" />
  </>;
}}</Stage>;

// ---- 20:59 · LOS VECINOS DEL ESTANTE: el frasco de orégano se corre y aparece la mejorana al lado ----
export const HNeighbors: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const s = eio(tt, 0.8, 1.8), glow = eio(tt, 1.8, 2.4);
  const jar = (x: number, lbl: string, col: string, g = 0) => <div style={{ position: "absolute", left: x, top: 420, width: 200, height: 300 }}>
    <div style={{ width: 200, height: 50, background: "#c43a2a", borderRadius: 10 }} />
    <div style={{ width: 200, height: 250, borderRadius: "0 0 20px 20px", background: `linear-gradient(90deg,rgba(255,255,255,.2),rgba(255,255,255,.4),rgba(255,255,255,.1)), ${col}`, display: "grid", placeItems: "center", fontWeight: 900, fontSize: 30, color: "#1a1410", boxShadow: g ? `0 0 ${60 * g}px rgba(255,214,110,.9)` : "none" }}>{lbl}</div>
  </div>;
  return <>
    <div style={{ position: "absolute", left: 300, top: 720, width: 1320, height: 30, background: "linear-gradient(180deg,#d8d2c6,#9a948a)" }} />
    {jar(420, "BASIL", "#6a8a3a")}{jar(660, "THYME", "#7a8a5a")}
    {jar(900 + 240 * s, "OREGANO", "#8a9a4a")}
    {jar(900, "MARJORAM", "#7aa04a", glow)}
    <Tag tt={tt} at={2.2} x={1000} y={300} txt="SPICE AISLE · NEXT TO OREGANO" col={AMB} size={44} />
  </>;
}}</Stage>;

// ---- 21:21 · EL REPASO RELÁMPAGO: las cifras 1-10 pasan como hojas de un contador mecánico ----
export const HRapid: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const n = Math.min(10, 1 + Math.floor(eio(tt, 0.3, 4.2) * 9.99)), f = (eio(tt, 0.3, 4.2) * 9.99) % 1;
  const lbl = ["SHOULDER", "25-30 % FAT", "FREEZE 30", "COARSE", "1¾ TSP SALT", "GARLIC · MARJORAM", "MIX 2 MIN", "TEST PATTY", "PLASTIC WRAP", "WATER · LID"][n - 1];
  return <>
    <div style={{ position: "absolute", left: 960, top: 460, transform: "translate(-50%,-50%) perspective(1400px)", width: 440, height: 400, borderRadius: 30, background: "#1e1f22", boxShadow: sh(40), overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontWeight: 900, fontSize: 280, color: TX, fontVariantNumeric: "tabular-nums" }}>{n}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 200, background: "#26272b", transformOrigin: "50% 100%", transform: `rotateX(${-180 * f}deg)`, opacity: n < 10 && f < 0.5 ? 0.5 : 0 }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 198, height: 4, background: "#0a0a0b" }} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 720, textAlign: "center", fontWeight: 900, fontSize: 64, color: AMB }}>{lbl}</div>
  </>;
}}</Stage>;

// ---- 22:13 · LAS MONEDAS: se apilan cinco dólares de un lado y en el otro el plato de restaurante a 25 ----
export const HCoins: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => <>
  {Array.from({ length: 5 }, (_, i) => { const d = phys(tt, 0.3 + i * 0.25, 10, 0.4); return <div key={i} style={{ position: "absolute", left: 480, top: 760 - i * 46 - (1 - cl(d)) * 500, width: 240, height: 60, borderRadius: "50%", background: "linear-gradient(180deg,#f2d27a,#b58a2a)", boxShadow: "0 8px 0 #7a5a14", opacity: cl(d * 4) }} />; })}
  <Tag tt={tt} at={1.8} x={600} y={900} txt="$5 OF PORK SHOULDER" col={GRN} size={44} />
  <div style={{ position: "absolute", left: 1200, top: 560, width: 420, height: 240, borderRadius: "50%", background: "#f4f2ec", boxShadow: sh(20), opacity: cl((tt - 1.0) * 3) }}>
    {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 90 + i * 30, top: 70 + i * 50, width: 240, height: 56, borderRadius: 28, background: `linear-gradient(180deg,#d68a4a,rgb(${BROWN.join(",")}))`, transform: `rotate(${-8 + i * 10}deg)` }} />)}
  </div>
  <div style={{ position: "absolute", left: 1410, top: 400, transform: `translate(-50%,-50%) scale(${cl(phys(tt, 2.4, 8, 0.4))})`, fontFamily: MARK, fontSize: 120, color: RED }}>$25</div>
  <Tag tt={tt} at={3.2} x={960} y={200} txt="+ THE PATIENCE OF AN OLD BUTCHER" col={AMB} size={44} />
</>}</Stage>;

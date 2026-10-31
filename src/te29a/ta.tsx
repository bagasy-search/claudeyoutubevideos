// te29a · NAURU · 26 componentes únicos (uno por minuto). Cada uno es el OBJETO de la idea dentro del escenario Stage (foto del momento atrás).
// Ninguno se repite en la tanda (registro D:/rtmp/te29_COMPONENTES.md). Sin rótulos arriba a la izquierda.
import React from "react";
import { AMB, GRN, H, HAND, ICE, PhotoObj, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";
import { HC2 } from "./ta2";
import { HC3 } from "./ta3";
import { HC4 } from "./ta4";
import { HC5 } from "./ta5";

const SEA = "#16455e", SEA2 = "#0d2c3d", ISL = "#4f8a52", ROCK = "#a7a59c", ROCKD = "#77756d", SAND = "#e2d3a8", PAPER = "#f1ead9", INK = "#2b2620";
const sh = (d = 40) => `0 ${d}px ${d * 2}px rgba(0,0,0,.6)`;
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const at = (x: number, y: number): React.CSSProperties => ({ position: "absolute", left: x, top: y });
const BIG: React.FC<{ tt: number; d: number; x: number; y: number; txt: string; col?: string; size?: number }> = ({ tt, d, x, y, txt, col = "#fff7ea", size = 120 }) => {
  const s = phys(tt, d, 6.5, 0.5);
  if (s <= 0.01) return null;
  return <div style={{ ...at(x, y), transform: `translate(-50%,-50%) translateY(${(1 - s) * -90}px) scale(${0.85 + 0.15 * s})`, opacity: cl(s * 2.2), fontWeight: 900, fontSize: size, color: col, whiteSpace: "nowrap", textShadow: "0 10px 0 rgba(0,0,0,.25), 0 22px 44px rgba(0,0,0,.65)" }}>{txt}</div>;
};
// isla vista desde arriba: anillo verde + meseta gris (grey 0..1 = cuánto de la meseta está minado)
const IslandTop: React.FC<{ r: number; grey?: number; sweep?: number }> = ({ r, grey = 1, sweep }) => {
  const g = sweep === undefined ? `rgba(167,165,156,${grey})` : `conic-gradient(from -90deg, ${ROCK} 0deg, ${ROCK} ${sweep * 360}deg, #3f6d3e ${sweep * 360 + 0.5}deg)`;
  return <div style={{ width: r * 2, height: r * 2, borderRadius: "47% 53% 50% 50% / 52% 46% 54% 48%", background: `radial-gradient(circle at 50% 50%, ${ISL} 70%, ${SAND} 72%, rgba(226,211,168,0) 76%)`, position: "relative", boxShadow: "0 0 0 18px rgba(120,210,220,.18), 0 30px 60px rgba(0,0,0,.5)" }}>
    <div style={{ position: "absolute", inset: "17%", borderRadius: "50% 46% 52% 48%", background: g, boxShadow: "inset 0 0 30px rgba(0,0,0,.35)" }} />
  </div>;
};
// océano esquemático (para los mapas)
const Ocean: React.FC<{ children?: React.ReactNode }> = ({ children }) => <div style={{ ...at(160, 120), width: 1600, height: 820, transform: "perspective(2600px) rotateX(20deg) rotateZ(-1.5deg)", transformOrigin: "50% 75%" }}>
  {/* canto de la carta náutica (espesor) + sombra de contacto sobre la mesa */}
  <div style={{ position: "absolute", left: 30, right: 30, bottom: -60, height: 90, background: "radial-gradient(ellipse at 50% 0%, rgba(0,0,0,.65), transparent 70%)", filter: "blur(12px)" }} />
  <div style={{ position: "absolute", inset: 0, transform: "translateY(16px)", borderRadius: 26, background: "#081a24" }} />
  <div style={{ position: "absolute", inset: 0, borderRadius: 26, overflow: "hidden", background: `radial-gradient(ellipse at 40% 30%, #1d5672, ${SEA} 45%, ${SEA2})`, boxShadow: "inset 0 0 0 3px rgba(240,220,170,.35), inset 0 0 120px rgba(0,0,0,.45)" }}>
    <svg width={1600} height={820} style={{ position: "absolute", inset: 0, opacity: 0.16 }}>{Array.from({ length: 16 }, (_, i) => <line key={i} x1={i * 100} y1={0} x2={i * 100} y2={820} stroke="#f3e6c4" />)}{Array.from({ length: 9 }, (_, i) => <line key={"h" + i} x1={0} y1={i * 100} x2={1600} y2={i * 100} stroke="#f3e6c4" />)}</svg>
    {/* rosa de los vientos y ondas: la carta se lee como objeto, no como plantilla */}
    <svg width={220} height={220} style={{ position: "absolute", right: 40, bottom: 30, opacity: 0.35 }}><circle cx={110} cy={110} r={90} fill="none" stroke="#f3e6c4" strokeWidth={2} /><path d="M110 10 L124 110 L110 210 L96 110 Z M10 110 L110 96 L210 110 L110 124 Z" fill="#f3e6c4" /></svg>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,.10), transparent 40%)" }} />
    {children}
  </div>
</div>;
const AUS = "M140 300 C150 220 230 170 300 175 C330 120 390 110 420 150 C470 130 520 170 540 230 C600 260 620 330 590 390 C560 470 470 520 400 500 C350 540 280 520 250 480 C190 470 120 420 140 300 Z";
const Pin: React.FC<{ x: number; y: number; s: number; col?: string; label?: string }> = ({ x, y, s, col = RED, label }) => s <= 0.01 ? null : <div style={{ ...at(x, y), transform: `translate(-50%,-100%) scale(${s})`, transformOrigin: "50% 100%" }}>
  <div style={{ width: 34, height: 34, borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)", background: col, boxShadow: "0 6px 14px rgba(0,0,0,.5)" }} />
  {label && <div style={{ position: "absolute", left: 46, top: -6, whiteSpace: "nowrap", fontWeight: 900, fontSize: 40, color: TX, textShadow: "0 4px 14px #000" }}>{label}</div>}
</div>;
const arcPt = (x1: number, y1: number, x2: number, y2: number, hgt: number, k: number) => [lerp(x1, x2, k), lerp(y1, y2, k) - Math.sin(Math.PI * k) * hgt];
const ArcPath: React.FC<{ x1: number; y1: number; x2: number; y2: number; hgt: number; k: number; col?: string; dash?: boolean }> = ({ x1, y1, x2, y2, hgt, k, col = AMB, dash }) => {
  const pts = Array.from({ length: 41 }, (_, i) => arcPt(x1, y1, x2, y2, hgt, (i / 40) * k));
  return <svg width={1600} height={820} style={{ position: "absolute", inset: 0, overflow: "visible" }}><polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke={col} strokeWidth={6} strokeDasharray={dash ? "14 12" : undefined} strokeLinecap="round" /></svg>;
};

// ---- 0:37 · DEL TAMAÑO DE UN BARRIO: la isla cae sobre una cuadrícula de manzanas y apenas tapa unas pocas; el reloj de la vuelta llega a 30 min ----
export const TIslaSize: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const d = phys(tt, 0.5, 5, 0.5), lap = eio(tt, 2.4, 5.6), min = Math.round(30 * lap);
  return <>
    <div style={{ ...at(360, 140), width: 1200, height: 760, transform: "perspective(1800px) rotateX(38deg)", transformOrigin: "50% 80%" }}>
      <svg width={1200} height={760}>{Array.from({ length: 12 * 8 }, (_, i) => <rect key={i} x={(i % 12) * 100 + 8} y={Math.floor(i / 12) * 95 + 8} width={84} height={78} rx={6} fill="#2a2d33" stroke="#3b3f47" />)}</svg>
      <div style={{ ...at(600 - 150, 380 - 150), transform: `translateY(${(1 - d) * -900}px) scale(${1.4 - 0.4 * d})`, opacity: cl(d * 3) }}>
        <IslandTop r={150} />
        <svg width={300} height={300} style={{ position: "absolute", inset: 0 }}><circle cx={150} cy={150} r={128} fill="none" stroke={AMB} strokeWidth={7} strokeDasharray={`${804 * lap} 900`} transform="rotate(-90 150 150)" strokeLinecap="round" /></svg>
      </div>
    </div>
    <BIG tt={tt} d={1.0} x={960} y={150} txt={h.kw ?? "21 km²"} size={150} />
    <div style={{ ...at(1440, 760), opacity: cl((tt - 2.3) * 2), fontWeight: 900, fontSize: 96, color: AMB, textShadow: "0 8px 30px #000" }}>{min} MIN</div>
    <Tag tt={tt} at={2.6} x={1530} y={890} txt="UNA VUELTA EN AUTO" size={30} />
  </>;
}}</Stage>;

// ---- 1:00 · EL MORDISCO: la meseta gris se come el verde de la isla en un barrido hasta el 80 % ----
export const TBite: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const k = eio(tt, 0.4, 3.2), pc = Math.round(80 * k);
  return <>
    <div style={{ ...at(560, 170), transform: `rotate(${-8 + 4 * k}deg) scale(${0.96 + 0.06 * k})` }}><IslandTop r={340} sweep={0.8 * k} /></div>
    <div style={{ ...at(1340, 420), fontWeight: 900, fontSize: 210, color: "#fff7ea", textShadow: "0 12px 40px #000", lineHeight: 1 }}>{pc}%</div>
    <Tag tt={tt} at={3.0} x={1500} y={660} txt="DE LA ISLA, MINADO" col={AMB} size={40} />
  </>;
}}</Stage>;

// ---- 2:37 · EL TOPE DE PUERTA: la puerta de la oficina de Sydney se cierra con el viento y rebota contra LA piedra ----
export const TDoor: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const sw = tt < 1.2 ? -70 * (1 - eio(tt, 0.2, 1.2)) : -14 * Math.exp(-(tt - 1.2) * 2.2) * Math.cos((tt - 1.2) * 7);
  const lit = cl((tt - 2.4) * 1.5);
  return <>
    <div style={{ ...at(560, 860), width: 900, height: 30, background: "linear-gradient(90deg,#5b4128,#3e2c1b)", borderRadius: 4 }} />
    <div style={{ ...at(600, 170), width: 380, height: 690, perspective: 1400 }}>
      <div style={{ position: "absolute", inset: 0, transformOrigin: "0% 50%", transform: `rotateY(${sw - 25}deg)`, background: "linear-gradient(90deg,#7a5634,#5e4025)", borderRadius: 6, boxShadow: sh(30), border: "10px solid #4a321d" }}>
        {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 40, right: 40, top: 50 + i * 320, height: 260, border: "6px solid rgba(0,0,0,.25)", borderRadius: 4 }} />)}
        <div style={{ position: "absolute", right: 30, top: 350, width: 28, height: 28, borderRadius: "50%", background: "#c9a35a" }} />
      </div>
    </div>
    <svg width={260} height={150} style={{ ...at(1030, 730), filter: `drop-shadow(0 0 ${30 * lit}px rgba(255,200,120,${0.7 * lit}))` }}><path d="M20 140 C10 80 60 30 120 25 C190 20 245 70 240 140 Z" fill={ROCK} stroke={ROCKD} strokeWidth={4} />{Array.from({ length: 14 }, (_, i) => <circle key={i} cx={50 + (i * 37) % 170} cy={70 + (i * 23) % 60} r={4} fill={ROCKD} />)}</svg>
    {Array.from({ length: 5 }, (_, i) => { const x = ((tt * 600 + i * 260) % 1400) + 300; return <div key={i} style={{ ...at(x, 300 + i * 90), width: 160, height: 4, borderRadius: 2, background: "rgba(255,255,255,.18)", opacity: 1 - lit }} />; })}
    <Tag tt={tt} at={2.5} x={1160} y={660} txt="SYDNEY · 1899" col={AMB} size={36} />
    <Tag tt={tt} at={3.4} x={1440} y={420} txt="«UN TOPE DE PUERTA»" size={34} />
  </>;
}}</Stage>;

// ---- 2:59 · EL MATRAZ: la piedra cae en el ácido, el líquido vira y aparece la palabra en la etiqueta ----
export const TFlask: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const fall = eio(tt, 0.3, 1.1), vir = eio(tt, 1.2, 3.4), lab = phys(tt, 3.2, 6, 0.5);
  const liq = `rgb(${Math.round(lerp(200, 240, vir))},${Math.round(lerp(225, 170, vir))},${Math.round(lerp(235, 60, vir))})`;
  return <>
    <svg width={520} height={640} style={at(700, 230)}>
      <path d="M200 20 L320 20 L320 230 L490 590 C500 615 485 630 460 630 L60 630 C35 630 20 615 30 590 L200 230 Z" fill="rgba(220,240,255,.08)" stroke="rgba(230,245,255,.8)" strokeWidth={6} />
      <path d="M118 420 L402 420 L470 590 C478 610 468 620 450 620 L70 620 C52 620 42 610 50 590 Z" fill={liq} opacity={0.85} />
      {Array.from({ length: 9 }, (_, i) => { const y = 600 - ((tt * 70 + i * 47) % 180); return tt > 1.2 ? <circle key={i} cx={160 + (i * 41) % 200} cy={y} r={6 + (i % 3) * 3} fill="rgba(255,255,255,.55)" /> : null; })}
      <path d="M180 20 L340 20" stroke="rgba(230,245,255,.9)" strokeWidth={14} strokeLinecap="round" />
      <ellipse cx={260} cy={lerp(-80, 560, fall)} rx={44} ry={32} fill={ROCK} stroke={ROCKD} strokeWidth={3} />
      {Array.from({ length: 8 }, (_, i) => { const k = cl((tt - 1.1) * 2.2); return k > 0 && k < 1 ? <circle key={"s" + i} cx={260 + Math.cos(i * 0.8 - 2.6) * 120 * k} cy={420 - Math.sin(Math.PI * k) * 110 - (i % 3) * 10} r={10 - 6 * k} fill={liq} /> : null; })}
    </svg>
    <div style={{ ...at(1250, 540), transform: `translateX(${(1 - lab) * 300}px) rotate(${-4 * lab}deg)`, opacity: cl(lab * 2), background: PAPER, color: INK, padding: "24px 40px", borderRadius: 8, boxShadow: sh(24), fontFamily: "Courier New, monospace" }}>
      <div style={{ fontWeight: 900, fontSize: 86, color: "#a2410f" }}>{h.kw ?? "FOSFATO"}</div>
    </div>
  </>;
}}</Stage>;

// ---- 3:08 · DOS CAMPOS: el mismo trigo sin fósforo se queda chico; con fósforo crece y se dora ----
const Stalk: React.FC<{ x: number; hgt: number; gold: number }> = ({ x, hgt, gold }) => <g transform={`translate(${x},500)`}>
  <line x1={0} y1={0} x2={0} y2={-hgt} stroke="#6f8a3a" strokeWidth={5} />
  {hgt > 120 && Array.from({ length: 6 }, (_, i) => <ellipse key={i} cx={(i % 2 ? 9 : -9)} cy={-hgt + 12 + i * 14} rx={8} ry={14} fill={`rgb(${Math.round(lerp(140, 226, gold))},${Math.round(lerp(170, 180, gold))},${Math.round(lerp(70, 70, gold))})`} />)}
</g>;
export const TWheat: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const gL = eio(tt, 0.4, 2.4), gR = eio(tt, 2.2, 4.6);
  return <>
    {[0, 1].map((side) => <div key={side} style={{ ...at(side ? 1000 : 260, 300), width: 660, height: 560, borderRadius: 24, background: side ? "linear-gradient(180deg,#1d2a35,#3a2b1a)" : "linear-gradient(180deg,#1d2a35,#3b2f22)", boxShadow: sh(30), overflow: "hidden" }}>
      <svg width={660} height={560}>{Array.from({ length: 14 }, (_, i) => <Stalk key={i} x={30 + i * 45} hgt={side ? 120 + 300 * gR + (i % 3) * 18 : 50 + 70 * gL + (i % 3) * 8} gold={side ? gR : 0.1} />)}<rect x={0} y={500} width={660} height={60} fill={side ? "#4a3420" : "#5c4a35"} /></svg>
    </div>)}
    <Tag tt={tt} at={0.5} x={590} y={240} txt="SIN FÓSFORO" col={RED} size={44} />
    <Tag tt={tt} at={2.3} x={1330} y={240} txt="CON FÓSFORO" col={GRN} size={44} />
  </>;
}}</Stage>;

// ---- 3:34 · LA ISLA HECHA DE ABONO: una columna de vidrio se llena capa por capa mientras pasan las aves; el contador de siglos rueda ----
export const TStrata: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const f = eio(tt, 0.4, 6.0), n = Math.floor(f * 14);
  return <>
    <div style={{ ...at(820, 160), width: 280, height: 740, borderRadius: 30, border: "6px solid rgba(220,240,255,.7)", background: "rgba(220,240,255,.06)", overflow: "hidden", display: "flex", flexDirection: "column-reverse", boxShadow: sh(30) }}>
      {Array.from({ length: n }, (_, i) => <div key={i} style={{ height: 50, background: i % 2 ? "#b9b4a5" : "#d8d2bf", borderTop: "2px solid rgba(0,0,0,.12)" }} />)}
      <div style={{ height: 50 * (f * 14 - n), background: "#cfc8b4" }} />
    </div>
    {Array.from({ length: 7 }, (_, i) => { const x = ((tt * 260 + i * 300) % 1900) - 100, y = 160 + (i * 67) % 200 + 18 * Math.sin(tt * 2 + i);
      return <svg key={i} width={70} height={30} style={at(x, y)}><path d={`M5 20 Q20 ${8 + 6 * Math.sin(tt * 6 + i)} 35 18 Q50 ${8 + 6 * Math.sin(tt * 6 + i)} 65 20`} fill="none" stroke="#f4efe6" strokeWidth={4} strokeLinecap="round" /></svg>; })}
    <div style={{ ...at(1180, 470), fontWeight: 900, fontSize: 110, color: "#fff7ea", textShadow: "0 10px 30px #000" }}>{Math.round(f * 100)}.000</div>
    <Tag tt={tt} at={0.8} x={1380} y={630} txt="AÑOS DE AVES MARINAS" col={AMB} size={38} />
  </>;
}}</Stage>;

// ---- 4:22 · TRES PAÍSES: la isla se parte en tres gajos y cada uno se desliza hacia su bandera ----
export const TSplit3: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const sp = eio(tt, 1.2, 3.2), names: string[] = h.names ?? ["", "", ""], cols = ["#c8102e", "#ffcd00", "#5aa0e0"];
  return <>
    {[0, 1, 2].map((i) => { const ang = -90 + i * 120 + 60, dx = Math.cos((ang * Math.PI) / 180) * 260 * sp, dy = Math.sin((ang * Math.PI) / 180) * 220 * sp;
      return <div key={i} style={{ ...at(960 - 260, 520 - 260), width: 520, height: 520, transform: `translate(${dx}px,${dy}px)` }}>
        <div style={{ width: 520, height: 520, borderRadius: "50%", background: `conic-gradient(from ${i * 120}deg, ${ROCK} 0deg 118deg, transparent 118deg)`, boxShadow: `0 0 0 ${10 * sp}px ${cols[i]}55`, filter: "drop-shadow(0 20px 30px rgba(0,0,0,.5))" }} />
      </div>; })}
    {names.map((n, i) => { const ang = -90 + i * 120 + 60, x = 960 + Math.cos((ang * Math.PI) / 180) * 610, y = 520 + Math.sin((ang * Math.PI) / 180) * 380;
      return <Tag key={n} tt={tt} at={1.8 + i * 0.5} x={x} y={y} txt={n} col={cols[i] === "#ffcd00" ? AMB : cols[i] === "#c8102e" ? RED : ICE} size={40} />; })}
  </>;
}}</Stage>;

// ---- 5:16 · CENTAVOS POR TONELADA: la balanza se va al piso con una montaña de fosfato contra tres monedas ----
export const TCents: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const pile = eio(tt, 0.3, 1.8), tilt = 16 * phys(tt, 1.6, 4, 0.35) + 1.5 * Math.sin(tt * 2.2) * cl(tt - 3), c = phys(tt, 2.4, 6, 0.45);
  return <div style={{ position: "absolute", inset: 0, transform: "scale(1.3)", transformOrigin: "50% 62%" }}>
    <div style={{ ...at(940, 360), width: 40, height: 520, background: "linear-gradient(90deg,#8a6a2c,#c9a35a,#8a6a2c)", borderRadius: 8 }} />
    <div style={{ ...at(960 - 520, 340), width: 1040, height: 24, background: "linear-gradient(180deg,#d6b46a,#8a6a2c)", borderRadius: 12, transform: `rotate(${-tilt}deg)`, transformOrigin: "50% 50%" }}>
      {[0, 1].map((s) => <div key={s} style={{ position: "absolute", left: s ? 900 : -40, top: 12, width: 180, transform: `rotate(${tilt}deg)`, transformOrigin: "50% 0" }}>
        <svg width={180} height={300}><line x1={90} y1={0} x2={20} y2={220} stroke="#c9a35a" strokeWidth={3} /><line x1={90} y1={0} x2={160} y2={220} stroke="#c9a35a" strokeWidth={3} /><path d="M0 220 Q90 270 180 220 Z" fill="#b8954f" />
          {s === 0 && <path d={`M6 222 Q90 ${222 - 230 * pile} 174 222 Z`} fill={ROCK} />}
          {s === 1 && [0, 1, 2].map((k) => <ellipse key={k} cx={70 + k * 22} cy={226 - (1 - cl(c - k * 0.2)) * 200} rx={30} ry={10} fill="#b87333" stroke="#7a4a1f" strokeWidth={2} opacity={cl(c * 3 - k * 0.5)} />)}
        </svg></div>)}
    </div>
    <Tag tt={tt} at={1.0} x={560} y={830} txt="1 TONELADA" size={40} />
    <Tag tt={tt} at={2.6} x={1380} y={830} txt="CENTAVOS" col={AMB} size={44} />
  </div>;
}}</Stage>;

// ---- 5:27 · CÓMO SE MINA UNA ISLA (corte): árboles, tierra y fosfato se van capa por capa y quedan los dientes de coral ----
export const TCutaway: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{() => {
  const st: [number, string][] = (h.steps ?? []).filter((s: [number, string]) => s[0] < h.out - 0.5);
  const done = (i: number) => (st[i] ? eio(t, st[i][0] + 0.2, st[i][0] + 1.6) : 0);
  const cur = st.reduce((a, s, i) => (t >= s[0] ? i : a), -1);
  const teeth = Array.from({ length: 12 }, (_, i) => `M${120 + i * 110} 760 L${150 + i * 110} ${520 + (i * 37) % 90} L${190 + i * 110} 760 Z`).join(" ");
  return <>
    <svg width={1600} height={800} style={at(160, 140)}>
      <rect x={0} y={760} width={1600} height={40} fill="#5c574d" />
      <path d={teeth} fill="#d9d6cc" stroke="#9a978e" strokeWidth={3} />
      <rect x={60} y={500 + 200 * done(2)} width={1480} height={260 - 260 * done(2)} fill="#8f8b80" opacity={0.95} />
      <rect x={60} y={430} width={1480} height={70} fill="#5a3f26" opacity={1 - done(1)} transform={`translate(0 ${-120 * done(1)})`} />
      {Array.from({ length: 14 }, (_, i) => <g key={i} transform={`translate(${110 + i * 105} 430) rotate(${-80 * done(0) * (i % 2 ? 1 : -1)})`} opacity={1 - done(0)}><rect x={-6} y={-120} width={12} height={120} fill="#5e4025" /><circle cx={0} cy={-140} r={46} fill="#3f7a3a" /></g>)}
    </svg>
    {cur >= 0 && <div key={cur} style={{ ...at(960, 960), transform: "translate(-50%,-50%)", fontWeight: 900, fontSize: 58, color: AMB, textShadow: "0 6px 24px #000", opacity: cl((t - st[cur][0]) * 3) }}>{cur + 1} · {st[cur][1]}</div>}
  </>;
}}</Stage>;

// ---- 5:58 · EL BRAZO DE HIERRO: el cantilever gira sobre el mar, el fosfato corre por la cinta y el barco se hunde de a poco ----
export const TCantilever: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const sw = eio(tt, 0.3, 2.0), load = eio(tt, 2.0, 7.0);
  return <>
    <svg width={1700} height={800} style={at(110, 160)}>
      <rect x={0} y={560} width={1700} height={240} fill={SEA} /><path d="M0 560 L520 560 L560 520 L0 520 Z" fill="#cfc8b0" />
      <rect x={430} y={260} width={40} height={300} fill="#6e4a2a" />
      <g transform={`rotate(${lerp(-70, 0, sw)} 450 270)`}><rect x={450} y={258} width={620} height={26} fill="#7b4b2a" stroke="#4a2b14" strokeWidth={3} />
        {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={460 + ((tt * 160 + i * 62) % 600)} cy={250} r={10} fill={ROCK} opacity={sw > 0.9 ? 1 : 0} />)}</g>
      <g transform={`translate(0 ${30 * load})`}><path d="M900 520 L1400 520 L1360 600 L940 600 Z" fill="#3a3f46" /><rect x={960} y={470} width={120} height={50} fill="#565c64" /><path d={`M980 520 Q1150 ${520 - 70 * load} 1320 520 Z`} fill={ROCK} /></g>
      <path d="M0 600 Q200 590 400 600 T800 600 T1200 600 T1700 600" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth={4} transform={`translate(${-(tt * 40) % 400} 0)`} />
    </svg>
    <Tag tt={tt} at={1.4} x={760} y={300} txt="EL BRAZO DE CARGA" col={AMB} size={36} />
  </>;
}}</Stage>;

// ---- 7:14 · LA DEPORTACIÓN: 40 puntos (≈1.200 personas) cruzan a Chuuk; vuelven menos ----
export const TDeport: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const go = eio(tt, 0.4, 2.6), back = eio(tt, 3.0, 5.0);
  const A = [1150, 560], B = [430, 250];
  return <>
    <Ocean>
      <ArcPath x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} hgt={140} k={go} col={RED} dash />
      <div style={{ ...at(A[0] - 30, A[1] - 30) }}><IslandTop r={30} /></div>
      <div style={{ ...at(B[0] - 50, B[1] - 26), width: 100, height: 52, borderRadius: "50%", background: ISL, boxShadow: "0 0 0 10px rgba(120,210,220,.2)" }} />
      {Array.from({ length: 40 }, (_, i) => { const k = cl(go * 1.4 - (i % 10) * 0.04), kb = cl(back * 1.4 - (i % 10) * 0.04), lost = i % 3 === 0;
        const [x, y] = back > 0 && !lost ? arcPt(B[0], B[1], A[0], A[1], -120, kb) : arcPt(A[0], A[1], B[0], B[1], 140, k);
        return <div key={i} style={{ ...at(x + ((i * 13) % 30) - 15, y + ((i * 7) % 24) - 12), width: 12, height: 12, borderRadius: "50%", background: lost && back > 0.3 ? "rgba(255,90,74,.25)" : TX }} />; })}
      <Pin x={B[0]} y={B[1] - 30} s={phys(tt, 0.8, 6, 0.5)} label="CHUUK · 1943" />
      <Pin x={A[0]} y={A[1] - 30} s={phys(tt, 0.3, 6, 0.5)} col={AMB} label="NAURU" />
    </Ocean>
    <Tag tt={tt} at={3.4} x={960} y={1000} txt="VOLVIERON EN 1946 · FALTABAN CIENTOS" col={RED} size={36} />
  </>;
}}</Stage>;

// ---- 8:02 · EL RELOJ DE ARENA: la isla está en la ampolla de arriba y se escurre hacia abajo ----
export const THourglass: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const k = eio(tt, 0.3, 4.2), yr = Math.round(1964 + 30 * k);
  return <>
    <svg width={460} height={720} style={at(730, 170)}>
      <path d="M40 20 L420 20 L420 60 C420 200 250 300 250 360 C250 420 420 520 420 660 L420 700 L40 700 L40 660 C40 520 210 420 210 360 C210 300 40 200 40 60 Z" fill="rgba(220,240,255,.07)" stroke="#d9c79c" strokeWidth={8} />
      <clipPath id="tg"><path d="M50 60 L410 60 C410 200 245 300 236 352 L224 352 C215 300 50 200 50 60 Z" /></clipPath>
      <g clipPath="url(#tg)"><rect x={40} y={60 + 290 * k} width={380} height={300} fill={ROCK} /><rect x={40} y={60 + 290 * k} width={380} height={30} fill={ISL} /></g>
      <path d={`M230 360 L230 ${360 + 300 * (k < 0.98 ? 1 : 0)}`} stroke={ROCK} strokeWidth={6} />
      <path d={`M60 690 Q230 ${690 - 260 * k} 400 690 Z`} fill={ROCK} />
    </svg>
    <div style={{ ...at(1280, 420), fontWeight: 900, fontSize: 150, color: "#fff7ea", textShadow: "0 10px 30px #000" }}>{yr}</div>
    <Tag tt={tt} at={1.2} x={1440} y={620} txt="INHABITABLE" col={TX} size={50} />
    <Tag tt={tt} at={1.6} x={1440} y={710} txt="EN 30 AÑOS" col={RED} size={50} />
  </>;
}}</Stage>;

// ---- 8:29 · LA MUDANZA: el pueblo entra en una caja, vuela a Curtis Island… y el sello NO la devuelve ----
export const TMoveBox: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const fly = eio(tt, 1.0, 3.6), no = phys(tt, 4.4, 7, 0.35), ret = eio(tt, 5.4, 7.6);
  const A = [1300, 230], B = [640, 470], k = fly - ret;
  const [x, y] = arcPt(A[0], A[1], B[0], B[1], 160, cl(k));
  return <>
    <Ocean>
      <svg width={1600} height={820} style={{ position: "absolute", inset: 0 }}><path d={AUS} transform="translate(80 200) scale(1.25)" fill="#8b6f45" stroke="#c9a35a" strokeWidth={3} /></svg>
      <div style={at(A[0] - 30, A[1] - 30)}><IslandTop r={30} /></div>
      <Pin x={B[0]} y={B[1] - 10} s={phys(tt, 0.6, 6, 0.5)} col={ICE} label="CURTIS ISLAND" />
      <div style={{ ...at(x - 70, y - 60), width: 140, height: 110, background: "#b98a52", border: "4px solid #7a5530", borderRadius: 6, boxShadow: sh(14), transform: `rotate(${8 * Math.sin(tt * 2)}deg)` }}>
        <svg width={132} height={102}>{[0, 1, 2].map((i) => <path key={i} d={`M${16 + i * 38} 70 l16 -18 l16 18 v22 h-32 Z`} fill="#f1ead9" />)}</svg>
      </div>
      {no > 0.01 && <div style={{ ...at(560, 280), transform: `scale(${2.2 - 1.2 * no}) rotate(-12deg)`, opacity: cl(no * 2) * (1 - ret * 0.6), border: "12px solid #e0352b", color: "#e0352b", padding: "6px 40px", fontWeight: 900, fontSize: 150, borderRadius: 16 }}>NO</div>}
    </Ocean>
    <Tag tt={tt} at={0.6} x={1500} y={1010} txt="1964" col={AMB} size={40} />
  </>;
}}</Stage>;

// ---- 9:19 · LA BANDERA SUBE: el mástil, la bandera de Nauru que trepa y la hoja del almanaque que cae en 1968 ----
export const TFlag68: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const up = eio(tt, 0.4, 3.4), cal = phys(tt, 2.6, 6, 0.4);
  const wave = (i: number) => 10 * Math.sin(tt * 2.2 + i * 0.6);
  return <>
    <div style={{ ...at(700, 120), width: 16, height: 820, background: "linear-gradient(90deg,#888,#eee,#888)", borderRadius: 8 }} />
    <svg width={460} height={280} style={at(716, lerp(760, 140, up))}>
      <path d={`M0 0 Q115 ${wave(0)} 230 ${wave(1)} T460 ${wave(3)} L460 ${260 + wave(3)} Q345 ${260 + wave(2)} 230 ${260 + wave(1)} T0 260 Z`} fill="#0b2a7a" />
      <path d={`M0 122 Q115 ${122 + wave(0)} 230 ${122 + wave(1)} T460 ${122 + wave(3)} L460 ${138 + wave(3)} Q230 ${138 + wave(1)} 0 138 Z`} fill="#ffc72c" />
      <polygon points="110,190 118,212 140,212 122,225 129,247 110,234 91,247 98,225 80,212 102,212" fill="#fff" />
    </svg>
    <div style={{ ...at(1300, 300), width: 340, transform: `perspective(900px) rotateX(${(1 - cal) * 80}deg)`, transformOrigin: "50% 0", background: PAPER, borderRadius: 10, boxShadow: sh(26), overflow: "hidden", opacity: cl(cal * 3) }}>
      <div style={{ background: "#c7342a", color: "#fff", fontWeight: 900, fontSize: 40, textAlign: "center", padding: 10 }}>ENERO</div>
      <div style={{ fontWeight: 900, fontSize: 180, color: INK, textAlign: "center", lineHeight: 1.1 }}>31</div>
      <div style={{ fontWeight: 900, fontSize: 56, color: INK, textAlign: "center", paddingBottom: 18 }}>1968</div>
    </div>
  </>;
}}</Stage>;

// ---- 9:44 · LA CATARATA: monedas que caen del cielo sobre la isla, el montón crece y el contador se dispara ----
export const TCascade: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const k = eio(tt, 0.2, 4.0);
  return <>
    <div style={at(800, 560)}><IslandTop r={160} grey={0.6} /></div>
    {Array.from({ length: 60 }, (_, i) => { const st = (i * 0.07) % 3.6, y = ((tt - st) * 900) % 1200 - 200, x = 860 + ((i * 53) % 200);
      return tt > st ? <div key={i} style={{ ...at(x, y), width: 40, height: 14, borderRadius: "50%", background: "linear-gradient(180deg,#f3d77a,#b8902f)", transform: `rotate(${(i * 47 + tt * 200) % 360}deg)`, opacity: y > 640 ? 0 : 1 }} /> : null; })}
    <svg width={400} height={200} style={at(760, 520)}><path d={`M40 180 Q200 ${180 - 160 * k} 360 180 Z`} fill="#d9b44a" stroke="#9a7a2a" strokeWidth={3} /></svg>
    <BIG tt={tt} d={0.5} x={1460} y={420} txt={`US$ ${Math.round(k * 100)} M`} col={AMB} size={110} />
    <Tag tt={tt} at={1.2} x={1460} y={560} txt="AÑOS 70 · FOSFATO CARO" size={32} />
  </>;
}}</Stage>;

// ---- 10:31 · LAS VUELTAS: el auto da vueltas a la isla y la huella se engrosa; el contador de vueltas no para ----
export const TLaps: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const ang = tt * 2.4, laps = Math.floor(tt * 2.4 / (Math.PI * 2)) + 1, cx = 960, cy = 540, R = 330;
  return <>
    <div style={at(cx - 360, cy - 360)}><IslandTop r={360} /></div>
    <svg width={760} height={760} style={at(cx - 380, cy - 380)}><circle cx={380} cy={380} r={R} fill="none" stroke="#2e2e2e" strokeWidth={34} /><circle cx={380} cy={380} r={R} fill="none" stroke={`rgba(255,178,87,${0.15 + 0.12 * laps})`} strokeWidth={4 + laps * 2} /></svg>
    <div style={{ ...at(cx + Math.cos(ang) * R - 30, cy + Math.sin(ang) * R - 16), width: 60, height: 32, borderRadius: 10, background: "#d23a2b", transform: `rotate(${(ang * 180) / Math.PI + 90}deg)`, boxShadow: "0 6px 12px rgba(0,0,0,.5)" }} />
    <div style={{ ...at(1440, 420), fontWeight: 900, fontSize: 160, color: "#fff7ea", textShadow: "0 10px 30px #000" }}>×{laps}</div>
    <Tag tt={tt} at={0.6} x={1500} y={620} txt="19 KM DE RUTA" col={AMB} size={36} />
  </>;
}}</Stage>;

// ---- 12:05 · EL EDIFICIO: la torre de Melbourne sube piso por piso con la plata del fosfato ----
export const TTower: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const f = eio(tt, 0.2, 4.6), n = Math.floor(f * 26);
  return <>
    <div style={{ ...at(780, 930 - n * 28), width: 360, height: n * 28, background: "repeating-linear-gradient(0deg,#d8dde3 0 22px,#5a6b7c 22px 28px)", boxShadow: sh(30) }} />
    <div style={{ ...at(1120, 930 - n * 28 - 160), width: 8, height: 160, background: AMB }} />
    <div style={{ ...at(860, 930 - n * 28 - 160), width: 280, height: 8, background: AMB }} />
    <PhotoObj tt={tt} id="n_torre_melbourne" x={1240} y={300} w={420} h={300} at={1.8} rot={4} />
    <Tag tt={tt} at={2.4} x={1450} y={680} txt="CASA NAURU · MELBOURNE" col={AMB} size={34} />
  </>;
}}</Stage>;

// ---- 12:22 · EL TELÓN: se abre el musical de Londres… y a las pocas semanas se cierra de golpe ----
export const TCurtain: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const op = eio(tt, 0.4, 2.0) * (1 - eio(tt, 4.4, 5.2)), tk = phys(tt, 5.4, 6, 0.4);
  return <>
    <div style={{ ...at(360, 160), width: 1200, height: 720, background: "radial-gradient(ellipse at 50% 30%, rgba(255,230,170,.35), #120c08 70%)", borderRadius: 10, overflow: "hidden", boxShadow: sh(40) }}>
      <div style={{ ...at(0, 600), width: 1200, height: 120, background: "linear-gradient(180deg,#5b3a1e,#2e1d0f)" }} />
      {[0, 1].map((s) => <div key={s} style={{ position: "absolute", top: 0, [s ? "right" : "left"]: 0, width: 600 * (1 - 0.82 * op), height: 720, background: "repeating-linear-gradient(90deg,#8c0d14 0 40px,#b5141d 40px 70px,#7a0b11 70px 100px)", boxShadow: "inset 0 0 60px rgba(0,0,0,.5)" } as React.CSSProperties} />)}
      <div style={{ ...at(0, 0), width: 1200, height: 70, background: "linear-gradient(180deg,#d4a637,#8a6517)" }} />
    </div>
    <div style={{ ...at(1380, 760), transform: `translateY(${(1 - tk) * -300}px) rotate(${-8 * tk}deg)`, opacity: cl(tk * 3), background: PAPER, color: INK, padding: "16px 28px", fontFamily: "Courier New, monospace", border: "3px dashed #8a7f6a", boxShadow: sh(20) }}>
      <div style={{ fontSize: 24 }}>LONDRES · 1993</div><div style={{ fontWeight: 900, fontSize: 40, color: "#c7342a" }}>BAJÓ DE CARTEL</div>
    </div>
  </>;
}}</Stage>;

// ---- 13:49 · LA DEMANDA: el sobre lacrado vuela de la isla a La Haya y aterriza sobre el estrado ----
export const TEnvelope: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const f = eio(tt, 0.4, 3.0), A = [1380, 620], B = [420, 200], [x, y] = arcPt(A[0], A[1], B[0], B[1], 220, f), seal = phys(tt, 3.0, 6, 0.4);
  return <>
    <Ocean>
      <ArcPath x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} hgt={220} k={f} col={AMB} dash />
      <div style={at(A[0] - 30, A[1] - 30)}><IslandTop r={30} /></div>
      <Pin x={B[0]} y={B[1] - 20} s={phys(tt, 0.2, 6, 0.5)} col={ICE} label="LA HAYA" />
      <div style={{ ...at(x - 90, y - 60), width: 180, height: 120, background: PAPER, boxShadow: sh(14), transform: `rotate(${-14 + 14 * f}deg) scale(${1 + 0.3 * (1 - f)})` }}>
        <svg width={180} height={120}><path d="M0 0 L90 70 L180 0" fill="none" stroke="#bfb39a" strokeWidth={4} /></svg>
        <div style={{ ...at(68, 46), width: 44 * (0.6 + 0.4 * seal), height: 44 * (0.6 + 0.4 * seal), borderRadius: "50%", background: "#a8261e", boxShadow: "0 3px 6px rgba(0,0,0,.4)" }} />
      </div>
    </Ocean>
    <Tag tt={tt} at={2.8} x={960} y={1000} txt="NAURU CONTRA AUSTRALIA" col={AMB} size={38} />
  </>;
}}</Stage>;

// ---- 14:20 · EN CUOTAS: el cheque grande se corta en tiras que caen una por año sobre la línea del tiempo ----
export const TInstall: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const ch = phys(tt, 0.2, 6, 0.45), cut = eio(tt, 1.6, 2.4);
  return <>
    <div style={{ ...at(560, 860), width: 800, height: 6, background: TX, opacity: 0.7 }} />
    {Array.from({ length: 10 }, (_, i) => { const fall = eio(tt, 2.4 + i * 0.35, 3.2 + i * 0.35), x = lerp(560 + i * 60, 560 + i * 82, fall), y = lerp(260, 800, fall);
      return <div key={i} style={{ ...at(x, y), width: 60, height: 160 * (1 - 0.6 * fall), background: "linear-gradient(180deg,#e9f1e2,#c9d8bf)", border: "2px solid #7f9673", transform: `rotate(${fall * (i % 2 ? 12 : -12)}deg) scaleY(${cut > 0.5 ? 1 : 0})`, opacity: cut > 0.5 ? 1 : 0 }} />; })}
    <div style={{ ...at(560, 260), width: 800, height: 220, transform: `translateY(${(1 - ch) * -400}px)`, opacity: cl(ch * 3) * (1 - cut), background: "linear-gradient(180deg,#eef4e8,#d3e0c8)", border: "4px solid #7f9673", borderRadius: 8, boxShadow: sh(26), color: INK, fontFamily: "Courier New, monospace", padding: 24 }}>
      <div style={{ fontSize: 28 }}>COMMONWEALTH OF AUSTRALIA</div>
      <div style={{ fontWeight: 900, fontSize: 96, color: "#2d5a27", marginTop: 14 }}>A$ 107 M</div>
    </div>
    <Tag tt={tt} at={3.0} x={960} y={950} txt="EN CUOTAS, AÑO TRAS AÑO" col={AMB} size={36} />
  </>;
}}</Stage>;

// ---- 15:07 · SIN COMBUSTIBLE: la aguja del tanque de la planta de agua cae a E y la canilla deja de gotear ----
export const TGauge: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const k = eio(tt, 0.4, 4.0), ang = lerp(60, -60, k), drip = 1 - eio(tt, 3.0, 4.6);
  return <>
    <div style={{ ...at(560, 230), width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle,#2a2a2e,#111)", border: "14px solid #b9b9bd", boxShadow: sh(30) }}>
      <svg width={492} height={492} style={at(0, 0)}>
        <path d="M70 330 A190 190 0 0 1 422 330" fill="none" stroke="#444" strokeWidth={22} /><path d="M70 330 A190 190 0 0 1 130 190" fill="none" stroke={RED} strokeWidth={22} />
        <text x={70} y={395} fill={RED} fontSize={52} fontWeight={900}>E</text><text x={392} y={395} fill="#ddd" fontSize={52} fontWeight={900}>F</text>
        <g transform={`rotate(${ang} 246 300)`}><rect x={240} y={110} width={12} height={196} rx={6} fill="#ffb257" /></g><circle cx={246} cy={300} r={22} fill="#ddd" />
      </svg>
    </div>
    <svg width={320} height={520} style={at(1260, 260)}><path d="M40 60 H220 V120 H180 V160 H140 V120 H40 Z" fill="#9aa0a8" stroke="#5e636a" strokeWidth={4} />
      {drip > 0.05 && Array.from({ length: 3 }, (_, i) => { const y = 170 + (((tt * 1.2 + i * 0.33) % 1) * 300); return <ellipse key={i} cx={160} cy={y} rx={10} ry={16} fill={ICE} opacity={drip} />; })}
    </svg>
    <Tag tt={tt} at={3.4} x={1420} y={820} txt="SIN AGUA" col={RED} size={44} />
  </>;
}}</Stage>;

// ---- 15:39 · LA GÓNDOLA: el estante se llena de latas una por una y el pescado y la fruta se apagan al costado ----
export const TShelf: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const n = Math.floor(eio(tt, 0.3, 5.0) * 24), fade = eio(tt, 1.0, 4.5), cols = ["#c7342a", "#2a6db0", "#e0a02b", "#3a8a4a"];
  return <>
    <div style={{ ...at(820, 200), width: 860, height: 660, background: "#2b2622", borderRadius: 8, boxShadow: sh(30) }}>
      {[0, 1, 2].map((r) => <div key={r} style={{ ...at(0, 200 + r * 210), width: 860, height: 14, background: "#8a7a64" }} />)}
      {Array.from({ length: n }, (_, i) => { const r = Math.floor(i / 8), c = i % 8, s = phys(tt, 0.3 + i * 0.19, 7, 0.45);
        return <div key={i} style={{ ...at(30 + c * 104, 70 + r * 210 + (1 - s) * -80), width: 84, height: 128, borderRadius: 8, background: `linear-gradient(90deg,#9a9a9a,#e8e8e8 40%,#8a8a8a)`, overflow: "hidden" }}><div style={{ marginTop: 34, height: 60, background: cols[(i * 3) % 4], display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 15, color: "#fff", letterSpacing: 1 }}>{["HARINA", "AZÚCAR", "COLA", "ARROZ"][(i * 3) % 4]}</div></div>; })}
    </div>
    <div style={{ ...at(240, 380), filter: `grayscale(${fade}) brightness(${1 - 0.5 * fade})`, opacity: 1 - 0.6 * fade }}><PhotoObj tt={tt} id="n_pescado_fruta" x={0} y={0} w={480} h={340} at={0.1} rot={-4} /></div>
    <Tag tt={tt} at={4.2} x={1250} y={930} txt="DE PESCADO A LATA" col={AMB} size={52} />
  </>;
}}</Stage>;

// ---- 16:48 · EL DESVÍO: el barco va hacia Australia, la barrera roja lo frena y la ruta punteada lo manda al Pacífico ----
export const TReroute: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const go = eio(tt, 0.3, 1.8), bar = phys(tt, 1.6, 7, 0.4), rr = eio(tt, 2.4, 4.4);
  const P0 = [240, 300], P1 = [560, 460];
  const [sx, sy] = rr > 0 ? arcPt(P1[0], P1[1], 1400, 280, 200, rr) : [lerp(P0[0], P1[0], go), lerp(P0[1], P1[1], go)];
  return <>
    <Ocean>
      <svg width={1600} height={820} style={{ position: "absolute", inset: 0 }}><path d={AUS} transform="translate(380 330) scale(1.05)" fill="#8b6f45" stroke="#c9a35a" strokeWidth={3} /></svg>
      <svg width={1600} height={820} style={{ position: "absolute", inset: 0 }}><line x1={500} y1={530 - 120 * cl(bar)} x2={680} y2={420 + 120 * cl(bar)} stroke={RED} strokeWidth={12} strokeLinecap="round" opacity={cl(bar * 2)} /></svg>
      {rr > 0 && <ArcPath x1={P1[0]} y1={P1[1]} x2={1400} y2={280} hgt={200} k={rr} col={AMB} dash />}
      <div style={at(1370, 250)}><IslandTop r={30} /></div>
      <div style={{ ...at(sx - 34, sy - 16), width: 68, height: 32, background: "#c7342a", borderRadius: "4px 20px 20px 4px", boxShadow: sh(10) }} />
      <Pin x={1400} y={250} s={phys(tt, 3.6, 6, 0.5)} col={AMB} label="NAURU" />
    </Ocean>
    <Tag tt={tt} at={0.6} x={500} y={1000} txt="TAMPA · 2001" col={AMB} size={38} />
  </>;
}}</Stage>;

// ---- 19:30 · LA PILA: los billetes se apilan hasta pasar la altura de una puerta: 3 millones por persona por año ----
export const TBillStack: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const k = eio(tt, 0.3, 4.6), n = Math.floor(k * 60);
  return <>
    <div style={{ ...at(640, 330), width: 220, height: 560, border: "10px solid #6d4a2b", borderBottom: "none", borderRadius: "6px 6px 0 0" }} />
    <svg width={120} height={420} style={at(700, 470)}><circle cx={60} cy={50} r={40} fill="#cfc6b4" /><path d="M10 420 L20 120 Q60 95 100 120 L110 420 Z" fill="#cfc6b4" /></svg>
    {Array.from({ length: n }, (_, i) => <div key={i} style={{ ...at(1020 + ((i * 7) % 9) - 4, 880 - i * 11), width: 300, height: 10, background: i % 2 ? "#6aa36a" : "#5b935b", border: "1px solid #2f5a2f", borderRadius: 2 }} />)}
    <div style={{ ...at(1380, 380), fontWeight: 900, fontSize: 110, color: "#fff7ea", textShadow: "0 10px 30px #000" }}>A$ {(3 * k).toFixed(1).replace(".", ",")} M</div>
    <Tag tt={tt} at={1.4} x={1560} y={530} txt="POR PERSONA · POR AÑO" col={AMB} size={36} />
  </>;
}}</Stage>;

// ---- 20:59 · LA PESCA DE NOCHE: el farol en el mar oscuro y los peces voladores que saltan dentro de la luz ----
export const TLantern: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const glow = eio(tt, 0.2, 1.6), net = eio(tt, 3.6, 5.0);
  return <>
    <div style={{ ...at(560, 560), width: 800, height: 420, background: `radial-gradient(ellipse at 50% 20%, rgba(255,190,110,${0.45 * glow}), transparent 65%)` }} />
    <svg width={1920} height={1080} style={at(0, 0)}>
      <path d="M760 690 Q960 740 1160 690 L1120 730 Q960 760 800 730 Z" fill="#3a2a1a" />
      <line x1={960} y1={690} x2={960} y2={560} stroke="#6b5233" strokeWidth={6} /><rect x={940} y={530} width={40} height={50} rx={8} fill={`rgba(255,200,120,${0.6 + 0.4 * glow})`} />
      {Array.from({ length: 5 }, (_, i) => { const st = 0.8 + i * 0.6, k = cl((tt - st) / 1.1); if (k <= 0 || k >= 1) return null;
        const x = lerp(700 + i * 60, 1150 - i * 40, k), y = 690 - Math.sin(Math.PI * k) * 260;
        return <g key={i} transform={`translate(${x} ${y}) rotate(${lerp(-30, 30, k)})`}><ellipse rx={30} ry={9} fill="#c9d6e0" /><path d="M-6 -4 L18 -30 L22 -2 Z" fill="#a9bccc" opacity={0.8} /></g>; })}
      <path d={`M${lerp(1250, 980, net)} 720 Q${lerp(1250, 980, net) + 60} ${720 - 140 * net} ${lerp(1250, 980, net) + 160} 700`} fill="none" stroke="#d9c79c" strokeWidth={5} opacity={net > 0 ? 1 : 0} />
    </svg>
    <Tag tt={tt} at={2.0} x={1450} y={300} txt="PECES VOLADORES" col={AMB} size={38} />
  </>;
}}</Stage>;

// ---- 23:01 · EL MAR SUBE: corte de la isla; el anillo verde donde vive la gente se inunda y la meseta minada queda arriba ----
export const TSeaLevel: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const w = eio(tt, 0.4, 4.4);
  return <>
    <svg width={1600} height={760} style={at(160, 160)}>
      <path d="M100 620 L260 560 L420 540 L480 380 L560 330 L1040 330 L1120 380 L1180 540 L1340 560 L1500 620 Z" fill="#8f8b80" />
      {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${560 + i * 50} 330 l20 -60 l20 60 Z`} fill="#d9d6cc" />)}
      <path d="M180 590 L420 540 L470 420 M1130 420 L1180 540 L1420 590" fill="none" stroke={ISL} strokeWidth={26} strokeLinecap="round" />
      {[300, 380, 1220, 1300].map((x, i) => <path key={i} d={`M${x - 20} ${560 + (x > 900 ? 0 : 0)} l20 -24 l20 24 v24 h-40 Z`} fill="#f1ead9" />)}
      <rect x={0} y={lerp(620, 520, w)} width={1600} height={300} fill="rgba(40,110,150,.82)" />
      <path d={`M0 ${lerp(620, 520, w)} Q200 ${lerp(620, 520, w) - 12} 400 ${lerp(620, 520, w)} T800 ${lerp(620, 520, w)} T1200 ${lerp(620, 520, w)} T1600 ${lerp(620, 520, w)}`} fill="none" stroke="rgba(255,255,255,.35)" strokeWidth={4} transform={`translate(${-(tt * 60) % 400} 0)`} />
    </svg>
    <Tag tt={tt} at={1.0} x={960} y={260} txt="LA MESETA: INHABITABLE" size={34} />
    <Tag tt={tt} at={2.8} x={960} y={920} txt="LA COSTA: DONDE VIVE LA GENTE" col={RED} size={36} />
  </>;
}}</Stage>;

export const HC: Record<string, React.FC<{ t: number; h: H }>> = { islasize: TIslaSize, bite: TBite, door: TDoor, flask: TFlask, wheat: TWheat, strata: TStrata, split3: TSplit3,
  cents: TCents, cutaway: TCutaway, cantilever: TCantilever, deport: TDeport, hourglass: THourglass, movebox: TMoveBox, flag68: TFlag68, cascade: TCascade, laps: TLaps,
  tower: TTower, curtain: TCurtain, envelope: TEnvelope, installments: TInstall, gauge: TGauge, shelf: TShelf, reroute: TReroute, billstack: TBillStack, lantern: TLantern, sealevel: TSeaLevel, ...HC2, ...HC3, ...HC4, ...HC5 };
export const COMMENTS: { n: string; from: string; txt: string }[] = [];

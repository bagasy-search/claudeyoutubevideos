// keikoen01 · piezas NUEVAS del resto (minutos 2-17). Mismo idioma visual que el minuto 1 (washi, hanko, escarcha, madera),
// pero cada regla tiene la suya. Todas reciben t y sus tiempos ya clavados a la voz desde Rest.tsx.
import React from "react";
import { AbsoluteFill } from "remotion";
import { e, ei, extrude, FONT, HAND, KK, SERIF, spr } from "./lib";

const pop = (t: number, a: number, k = 1.1) => Math.min(1.12, spr(t, a, k));
const vis = (t: number, a: number, out: number, fi = 0.1) => e(t, a, a + fi) * (1 - e(t, out, out + 0.3));
const paper = "linear-gradient(180deg,#fbf6ea,#ece2c9)";
const dark = "linear-gradient(180deg, rgba(20,30,46,.92), rgba(10,15,24,.92))";

// ---------- EMA: la tablilla de madera de cada regla; entra grande, se cuelga en la esquina y queda como índice ----------
export const Ema: React.FC<{ t: number; at: number; n: number; title: string; next: number }> = ({ t, at: a0, n, title, next }) => {
  if (t < a0 - 0.05 || t >= next) return null;
  const k = pop(t, a0, 0.9), go = ei(t, a0 + 3.0, a0 + 3.7), sw = 6 * Math.sin((t - a0) * 2.4) * Math.exp(-(t - a0) * 0.8);
  const x = 960 + (270 - 960) * go, y = 470 + (150 - 470) * go, sc = (0.55 + 0.45 * Math.min(1, k)) * (1 - 0.62 * go);
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${sw * (1 - go)}deg) scale(${sc})`, opacity: e(t, a0, a0 + 0.1) * (1 - e(t, next - 0.25, next)) }}>
    <svg width={760} height={360} viewBox="0 0 760 360" style={{ position: "absolute", left: 0, top: 0, filter: "drop-shadow(0 30px 40px rgba(0,0,0,.55))" }}>
      <path d="M 40 110 L 380 20 L 720 110 L 720 340 L 40 340 Z" fill="#c99a5c" stroke="#7a5228" strokeWidth={8} />
      <path d="M 40 110 L 380 20 L 720 110" fill="none" stroke="#5a3a1a" strokeWidth={22} strokeLinejoin="round" />
      {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M 60 ${150 + i * 32} Q 380 ${140 + i * 32 + (i % 2 ? 8 : -6)} 700 ${150 + i * 32}`} stroke="rgba(110,70,30,.18)" strokeWidth={3} fill="none" />)}
      <circle cx={380} cy={66} r={9} fill="#3a2410" /><path d="M 380 66 L 380 -60" stroke={KK.hanko} strokeWidth={6} />
    </svg>
    <div style={{ position: "relative", width: 760, height: 360, textAlign: "center" }}>
      <div style={{ paddingTop: 102, fontFamily: SERIF, fontWeight: 900, fontSize: 44, letterSpacing: 12, color: KK.hanko }}>RULE {n} <span style={{ color: "rgba(36,30,27,.55)", fontSize: 30, letterSpacing: 4 }}>/ 25</span></div>
      <div style={{ marginTop: 8, fontFamily: HAND, fontWeight: 700, fontSize: title.length > 18 ? 76 : 88, lineHeight: 1, color: KK.sumi, whiteSpace: "nowrap" }}>{title}</div>
      <div style={{ display: "flex", justifyContent: "center", gap: 7, marginTop: 18 }}>{Array.from({ length: 25 }, (_, i) => <div key={i} style={{ width: 14, height: 14, borderRadius: 7, background: i < n ? KK.hanko : "rgba(60,40,20,.25)" }} />)}</div>
    </div>
  </div>;
};

// ---------- CAPÍTULO: cortina noren que baja con el nombre de la parte ----------
export const Noren: React.FC<{ t: number; at: number; out: number; text: string; sub?: string }> = ({ t, at: a0, out, text, sub }) => {
  const d = ei(t, a0, a0 + 0.6), u = ei(t, out - 0.5, out);
  if (d <= 0.001 || u >= 0.999) return null;
  const drop = d * (1 - u);
  return <AbsoluteFill style={{ pointerEvents: "none" }}>
    {[0, 1, 2].map((i) => {
      const sw = Math.sin(t * 1.6 + i) * 2 * drop;
      return <div key={i} style={{ position: "absolute", left: 960 - 330 + i * 220, top: -10, width: 210, height: 430 * drop, transformOrigin: "50% 0", transform: `rotate(${sw}deg)`, overflow: "hidden",
        background: `linear-gradient(180deg, ${KK.indigo}, #172c49)`, boxShadow: "0 30px 50px rgba(0,0,0,.5), inset 0 -20px 30px rgba(0,0,0,.25)" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 92, color: KK.cream, lineHeight: 1.05 }}>{text.split(" ")[i] ?? ""}</div>
      </div>;
    })}
    {sub && <div style={{ position: "absolute", left: 0, right: 0, top: 455 * drop, textAlign: "center", opacity: e(t, a0 + 0.5, a0 + 0.8) * (1 - u), fontFamily: HAND, fontWeight: 700, fontSize: 66, color: KK.cream, textShadow: "0 6px 20px rgba(0,0,0,.85)" }}>{sub}</div>}
  </AbsoluteFill>;
};

// ---------- SUSCRIBIRSE: botón de madera que se hunde + campanita de templo que suena ----------
export const SubBell: React.FC<{ t: number; at: number; bell: number; q: number; out: number }> = ({ t, at: a0, bell, q, out }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  const press = e(t, a0 + 0.9, a0 + 1.05) * (1 - e(t, a0 + 1.15, a0 + 1.4)), done = t > a0 + 1.05;
  const ring = t > bell ? Math.sin((t - bell) * 22) * 18 * Math.exp(-(t - bell) * 1.6) : 0;
  return <div style={{ position: "absolute", left: 0, right: 0, top: 690, display: "flex", justifyContent: "center", alignItems: "center", gap: 40, opacity: o }}>
    <div style={{ transform: `scale(${pop(t, a0)}) translateY(${press * 12}px)`, padding: "26px 60px", borderRadius: 22, background: done ? `linear-gradient(180deg,#8a8178,#5f574f)` : `linear-gradient(180deg,#d9443a,${KK.hanko})`,
      boxShadow: `0 ${16 - press * 12}px 0 ${done ? "#3e3833" : "#7d1e17"}, 0 40px 60px rgba(0,0,0,.5)`, fontFamily: FONT, fontWeight: 900, fontSize: 64, letterSpacing: 4, color: "#fff" }}>{done ? "SUBSCRIBED ✓" : "SUBSCRIBE"}</div>
    {t >= bell - 0.4 && <svg width={190} height={210} viewBox="-95 -20 190 210" style={{ opacity: e(t, bell - 0.4, bell - 0.2), transformOrigin: "50% 0", transform: `rotate(${ring}deg) scale(${pop(t, bell - 0.4)})`, filter: "drop-shadow(0 20px 30px rgba(0,0,0,.6))" }}>
      <line x1={0} y1={-20} x2={0} y2={20} stroke="#d9c7a0" strokeWidth={5} />
      <path d="M -60 140 Q -60 30 0 24 Q 60 30 60 140 L 74 158 L -74 158 Z" fill="#e0a840" stroke="#8a5a14" strokeWidth={5} />
      <circle cx={0} cy={174} r={14} fill="#8a5a14" />
      {t > bell && [1, 2].map((i) => <path key={i} d={`M ${80 + i * 14} 60 q 14 30 0 60 M ${-80 - i * 14} 60 q -14 30 0 60`} stroke={KK.cream} strokeWidth={5} fill="none" opacity={Math.max(0, 1 - (t - bell) * 0.6)} />)}
    </svg>}
    {t >= q && <div style={{ opacity: e(t, q, q + 0.2), transform: `scale(${pop(t, q)}) rotate(-3deg)`, padding: "16px 32px", background: paper, borderRadius: 8, boxShadow: "0 24px 40px rgba(0,0,0,.5)", fontFamily: HAND, fontWeight: 700, fontSize: 58, color: KK.sumi }}>
      + one question <span style={{ color: KK.hanko }}>at the end</span>
    </div>}
  </div>;
};

// ---------- 25 REGLAS ↓: rollo de papel que se desenrolla hacia abajo ----------
export const Rollo: React.FC<{ t: number; at: number; out: number }> = ({ t, at: a0, out }) => {
  const o = vis(t, a0, out), u = ei(t, a0 + 0.2, a0 + 1.4);
  if (o <= 0.01) return null;
  const lines = ["1. freeze rice hot", "2. one bowl, one package", "3. flat, not round", "4. one month", "5. a spoon of water", "6. miso…", "…", "25. cook once"];
  return <div style={{ position: "absolute", left: 1480, top: 140, opacity: o, transform: "translateX(-50%) rotate(2deg)" }}>
    <div style={{ width: 470, height: 26, borderRadius: 13, background: "linear-gradient(180deg,#a87a44,#6e4a22)", boxShadow: "0 10px 20px rgba(0,0,0,.5)" }} />
    <div style={{ width: 430, margin: "0 auto", height: 600 * u, overflow: "hidden", background: paper, boxShadow: "0 30px 50px rgba(0,0,0,.5)", padding: "0 24px" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 46, color: KK.hanko, marginTop: 20 }}>25 RULES</div>
      {lines.map((l, i) => <div key={i} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, lineHeight: "58px", color: KK.sumi }}>{l}</div>)}
    </div>
    <div style={{ marginTop: 18, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 34, letterSpacing: 3, color: KK.cream, textShadow: extrude(3, "#000"), opacity: e(t, a0 + 1.2, a0 + 1.5) }}>BELOW THE VIDEO ↓</div>
  </div>;
};

// ---------- ALMIDÓN: un grano de arroz con gotitas de agua; al enfriarse el agua se escapa y el grano se agrieta ----------
export const Almidon: React.FC<{ t: number; at: number; cool: number; wrap: number; soft: number; out: number; x?: number; y?: number }> = ({ t, at: a0, cool, wrap, soft, out, x = 1400, y = 520 }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  const leave = ei(t, cool, cool + 2.5) * (1 - ei(t, wrap, wrap + 1.2)), hard = leave, film = e(t, wrap, wrap + 0.6), back = e(t, soft, soft + 1);
  const drops = Array.from({ length: 14 }, (_, i) => { const a = i * 2.4, r = 40 + (i % 3) * 22; const out2 = leave * (120 + (i % 4) * 30); return { x: Math.cos(a) * (r + out2), y: Math.sin(a) * (r * 0.5 + out2 * 0.6) }; });
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${pop(t, a0, 0.9)})` }}>
    <svg width={620} height={460} viewBox="-310 -230 620 460" style={{ overflow: "visible", filter: "drop-shadow(0 26px 40px rgba(0,0,0,.6))" }}>
      <ellipse cx={0} cy={0} rx={190} ry={96} fill={`rgb(${250 - hard * 30},${248 - hard * 40},${236 - hard * 50})`} stroke="#d7cfbd" strokeWidth={6} />
      {hard > 0.2 && [[-90, -40, -40, 10], [-10, -70, 40, 20], [60, -50, 120, 30]].map(([a, b, c, d], i) => <path key={i} d={`M ${a} ${b} L ${(a + c) / 2 + 10} ${(b + d) / 2} L ${c} ${d}`} stroke="#a89d86" strokeWidth={4} fill="none" opacity={hard} />)}
      {drops.map((d, i) => <path key={i} d={`M ${d.x} ${d.y - 16} q 12 16 0 24 q -12 -8 0 -24`} fill="#8fd3ff" opacity={0.9 - 0.4 * leave} />)}
      {film > 0.01 && <ellipse cx={0} cy={0} rx={250} ry={150} fill="rgba(220,240,255,.12)" stroke="rgba(255,255,255,.8)" strokeWidth={5} strokeDasharray="20 10" opacity={film} />}
    </svg>
    <div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 52, letterSpacing: 3, color: back > 0.5 ? KK.cream : hard > 0.5 ? "#c9b48a" : KK.ice, textShadow: extrude(5, "#000") }}>
      {back > 0.5 ? "SOFT AGAIN" : film > 0.5 ? "STEAM STAYS IN" : hard > 0.5 ? "HARD & DRY" : "STARCH + WATER"}
    </div>
  </div>;
};

// ---------- 10 MINUTOS: platito con reloj de arena de vapor ----------
export const Plato10: React.FC<{ t: number; at: number; out: number; x?: number; y?: number }> = ({ t, at: a0, out, x = 1380, y = 430 }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  const k = e(t, a0 + 0.3, out), ang = k * 360;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${pop(t, a0)})`, textAlign: "center" }}>
    <svg width={340} height={340} viewBox="-170 -170 340 340" style={{ filter: "drop-shadow(0 20px 30px rgba(0,0,0,.6))" }}>
      <circle r={150} fill="#fbfaf6" stroke={KK.indigo} strokeWidth={10} />
      <path d={`M 0 0 L 0 -130 A 130 130 0 ${ang > 180 ? 1 : 0} 1 ${130 * Math.sin(ang * Math.PI / 180)} ${-130 * Math.cos(ang * Math.PI / 180)} Z`} fill="rgba(31,58,95,.25)" />
      {Array.from({ length: 10 }, (_, i) => <line key={i} x1={0} y1={-140} x2={0} y2={-120} stroke={KK.sumi} strokeWidth={6} transform={`rotate(${i * 36})`} />)}
      <line x1={0} y1={0} x2={0} y2={-110} stroke={KK.hanko} strokeWidth={8} strokeLinecap="round" transform={`rotate(${ang})`} />
    </svg>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: KK.cream, textShadow: extrude(6, "#000") }}>10 MIN → <span style={{ color: KK.ice }}>FREEZER</span></div>
  </div>;
};

// ---------- BALANZA: aguja que sube a 150 g, con el puño dibujado al lado ----------
export const Balanza: React.FC<{ t: number; at: number; fist: number; out: number; x?: number; y?: number }> = ({ t, at: a0, fist, out, x = 1420, y = 520 }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  const g = Math.round(150 * ei(t, a0 + 0.2, a0 + 1.4)), ang = -120 + 240 * (g / 300);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${pop(t, a0)})`, display: "flex", alignItems: "center", gap: 30 }}>
    <svg width={360} height={360} viewBox="-180 -180 360 360" style={{ filter: "drop-shadow(0 24px 34px rgba(0,0,0,.6))" }}>
      <rect x={-170} y={-170} width={340} height={340} rx={50} fill="#eae6dd" />
      <circle r={130} fill="#fbfaf6" stroke="#9aa0a8" strokeWidth={8} />
      {Array.from({ length: 13 }, (_, i) => <line key={i} x1={0} y1={-122} x2={0} y2={i % 2 ? -110 : -98} stroke={KK.sumi} strokeWidth={5} transform={`rotate(${-120 + i * 20})`} />)}
      <line x1={0} y1={10} x2={0} y2={-112} stroke={KK.hanko} strokeWidth={7} strokeLinecap="round" transform={`rotate(${ang})`} />
      <circle r={12} fill={KK.sumi} />
      <text y={80} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill={KK.sumi}>{g} g</text>
    </svg>
    <div style={{ opacity: e(t, fist, fist + 0.2), transform: `scale(${pop(t, fist)})`, textAlign: "center" }}>
      <svg width={200} height={200} viewBox="0 0 200 200"><path d="M 50 70 Q 50 40 80 40 L 150 40 Q 175 40 175 70 L 175 140 Q 175 175 140 175 L 80 175 Q 50 175 50 140 Z" fill="#f0c9a0" stroke="#a07050" strokeWidth={6} />
        {[0, 1, 2].map((i) => <line key={i} x1={80 + i * 30} y1={40} x2={80 + i * 30} y2={95} stroke="#a07050" strokeWidth={5} />)}<path d="M 50 100 Q 20 110 30 140" stroke="#a07050" strokeWidth={6} fill="none" /></svg>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: KK.cream, textShadow: "0 4px 14px #000" }}>= your fist</div>
    </div>
  </div>;
};

// ---------- BLOQUE: un bloque grande tachado vs. 7 paquetitos ----------
export const Bloque: React.FC<{ t: number; at: number; waste: number; out: number }> = ({ t, at: a0, waste, out }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  const x = e(t, waste + 0.4, waste + 0.7);
  return <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 90, opacity: o }}>
    <div style={{ position: "relative", transform: `scale(${pop(t, a0)})` }}>
      <div style={{ width: 360, height: 200, borderRadius: 20, background: "linear-gradient(135deg,#f6f3ea,#d9d3c4)", boxShadow: "inset 0 0 0 5px #fff, 0 30px 50px rgba(0,0,0,.55)" }} />
      <svg width={360} height={200} style={{ position: "absolute", inset: 0 }}><line x1={20} y1={20} x2={20 + 320 * x} y2={20 + 160 * x} stroke={KK.hanko} strokeWidth={18} strokeLinecap="round" /><line x1={340} y1={20} x2={340 - 320 * x} y2={20 + 160 * x} stroke={KK.hanko} strokeWidth={18} strokeLinecap="round" /></svg>
      <div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 34, color: KK.cream, marginTop: 14, textShadow: extrude(3, "#000") }}>ONE BIG BLOCK</div>
    </div>
    <div>
      <div style={{ display: "flex", gap: 12 }}>{Array.from({ length: 7 }, (_, i) => { const a = waste + 0.8 + i * 0.12; return <div key={i} style={{ width: 92, height: 92, borderRadius: 12, opacity: e(t, a, a + 0.1), transform: `translateY(${(1 - Math.min(1, pop(t, a))) * -120}px)`, background: "linear-gradient(135deg,#fbfaf6,#e6e0d0)", boxShadow: "inset 0 0 0 4px #fff, 0 16px 26px rgba(0,0,0,.5)" }} />; })}</div>
      <div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 34, color: KK.ice, marginTop: 14, textShadow: extrude(3, "#000"), opacity: e(t, waste + 1.4, waste + 1.6) }}>ONE BOWL · ONE PACKAGE</div>
    </div>
  </div>;
};

// ---------- REGLA de 2 cm: regla de madera que mide la bolsa plana ----------
export const Regla2: React.FC<{ t: number; at: number; out: number; x?: number; y?: number }> = ({ t, at: a0, out, x = 1380, y = 820 }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  const m = ei(t, a0 + 0.3, a0 + 1.0);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(-4deg) scale(${pop(t, a0)})` }}>
    <div style={{ position: "relative", width: 640, height: 90, borderRadius: 8, background: "linear-gradient(180deg,#e8c48a,#c99a5c)", boxShadow: "0 20px 34px rgba(0,0,0,.55)" }}>
      {Array.from({ length: 21 }, (_, i) => <div key={i} style={{ position: "absolute", left: 20 + i * 30, top: 0, width: 3, height: i % 5 ? 22 : 40, background: KK.sumi }} />)}
      <div style={{ position: "absolute", left: 20, top: 46, width: 60 * m, height: 30, background: KK.hanko, borderRadius: 4 }} />
      <div style={{ position: "absolute", left: 100, top: 34, fontFamily: FONT, fontWeight: 900, fontSize: 46, color: KK.sumi, opacity: m }}>2 cm</div>
      <div style={{ position: "absolute", right: 24, top: 30, fontFamily: HAND, fontWeight: 700, fontSize: 52, color: KK.indigo, opacity: e(t, a0 + 0.9, a0 + 1.2) }}>like a little book</div>
    </div>
  </div>;
};

// ---------- CORTE FRÍO: bola vs. tableta en corte; el frío (azul) avanza de afuera hacia adentro ----------
export const CorteFrio: React.FC<{ t: number; at: number; out: number; flat: number; x?: number; y?: number }> = ({ t, at: a0, out, flat, x = 1400, y = 480 }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  const c = e(t, a0 + 0.3, a0 + 5), f = e(t, flat, flat + 1.4);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${pop(t, a0, 0.9)})`, padding: "26px 34px", borderRadius: 26, background: dark, boxShadow: "0 30px 60px rgba(0,0,0,.5)" }}>
    <svg width={660} height={310} viewBox="-30 0 660 310">
      <defs><radialGradient id="cfb"><stop offset={`${Math.max(0, 70 - 70 * c)}%`} stopColor="#e9a35a" /><stop offset={`${Math.max(5, 75 - 60 * c)}%`} stopColor="#8fd3ff" /><stop offset="100%" stopColor="#d9f3ff" /></radialGradient>
        <linearGradient id="cfs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d9f3ff" /><stop offset={`${Math.max(1, 50 - 50 * f)}%`} stopColor="#8fd3ff" /><stop offset="50%" stopColor={f > 0.95 ? "#8fd3ff" : "#e9a35a"} /><stop offset={`${Math.min(99, 50 + 50 * f)}%`} stopColor="#8fd3ff" /><stop offset="1" stopColor="#d9f3ff" /></linearGradient></defs>
      <circle cx={140} cy={150} r={115} fill="url(#cfb)" stroke="#fff" strokeWidth={5} />
      <rect x={330} y={118} width={270} height={64} rx={14} fill="url(#cfs)" stroke="#fff" strokeWidth={5} />
      <text x={150} y={296} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={27} fill="#f2b06a">ROUND: warm core</text>
      <text x={465} y={240} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={KK.ice} opacity={f}>FLAT: fast, even</text>
    </svg>
  </div>;
};

// ---------- MICROONDAS 2:00: display verde que cuenta ----------
export const Micro: React.FC<{ t: number; at: number; out: number; x?: number; y?: number }> = ({ t, at: a0, out, x = 1420, y = 470 }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  const left = Math.max(0, 120 - Math.floor((t - a0 - 0.3) * 40));
  const mm = Math.floor(left / 60), ss = left % 60;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(900px) rotateY(-14deg) scale(${pop(t, a0)})` }}>
    <div style={{ width: 520, height: 300, borderRadius: 26, background: "linear-gradient(180deg,#f1efea,#cfcac0)", boxShadow: "0 30px 50px rgba(0,0,0,.6)", display: "flex", alignItems: "center", padding: 24, gap: 20 }}>
      <div style={{ flex: 1, height: "100%", borderRadius: 14, background: "radial-gradient(circle at 50% 60%, rgba(255,214,140,.55), #2a2a2a 70%)" }} />
      <div style={{ width: 170, textAlign: "center" }}><div style={{ background: "#0f1a12", borderRadius: 8, padding: "10px 0", fontFamily: "'Courier New', monospace", fontWeight: 900, fontSize: 56, color: "#7dff9a", textShadow: "0 0 12px #3dff6a" }}>{mm}:{String(ss).padStart(2, "0")}</div>
        <div style={{ marginTop: 16, fontFamily: HAND, fontWeight: 700, fontSize: 42, color: KK.sumi }}>evenly</div></div>
    </div>
  </div>;
};

// ---------- 1 MES, NO 6: hojas de calendario; la sexta se tacha ----------
export const MesNoSeis: React.FC<{ t: number; at: number; six: number; out: number; x?: number; y?: number }> = ({ t, at: a0, six, out, x = 1440, y = 500 }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  const sx = e(t, six, six + 0.3);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", gap: 30, alignItems: "center" }}>
    <div style={{ transform: `scale(${pop(t, a0)}) rotate(-4deg)`, width: 230, borderRadius: 10, overflow: "hidden", boxShadow: "0 24px 40px rgba(0,0,0,.55)" }}>
      <div style={{ background: KK.indigo, color: KK.cream, fontFamily: FONT, fontWeight: 900, fontSize: 30, textAlign: "center", padding: 8 }}>1 MONTH</div>
      <div style={{ background: paper, display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, padding: 12 }}>{Array.from({ length: 28 }, (_, i) => <div key={i} style={{ height: 22, borderRadius: 4, background: i % 7 === 0 ? KK.hanko : "rgba(31,58,95,.18)" }} />)}</div>
    </div>
    <div style={{ position: "relative", opacity: e(t, six - 0.3, six), transform: `scale(${pop(t, six - 0.3)})`, display: "flex" }}>
      {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ width: 70, height: 100, marginLeft: i ? -40 : 0, borderRadius: 8, background: paper, boxShadow: "0 12px 20px rgba(0,0,0,.45)", transform: `rotate(${(i - 3) * 4}deg)`, fontFamily: FONT, fontWeight: 900, fontSize: 30, color: KK.indigo, textAlign: "center", paddingTop: 30 }}>{i + 1}</div>)}
      <svg width={280} height={120} style={{ position: "absolute", left: -10, top: -10 }}><line x1={10} y1={10} x2={10 + 260 * sx} y2={10 + 100 * sx} stroke={KK.hanko} strokeWidth={16} strokeLinecap="round" /><line x1={270} y1={10} x2={270 - 260 * sx} y2={10 + 100 * sx} stroke={KK.hanko} strokeWidth={16} strokeLinecap="round" /></svg>
    </div>
  </div>;
};

// ---------- RELOJ DE ARROZ: siete paquetitos alrededor de un reloj; la aguja los recorre ----------
export const RelojArroz: React.FC<{ t: number; at: number; out: number; x?: number; y?: number }> = ({ t, at: a0, out, x = 1400, y = 500 }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  const ang = (t - a0) * 70;
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${pop(t, a0, 0.9)})` }}>
    <svg width={460} height={460} viewBox="-230 -230 460 460" style={{ filter: "drop-shadow(0 24px 40px rgba(0,0,0,.6))" }}>
      <circle r={200} fill="rgba(251,246,234,.95)" stroke={KK.hinoki} strokeWidth={14} />
      {days.map((d, i) => { const a = (i / 7) * Math.PI * 2 - Math.PI / 2, used = ((ang % 360) / 360) * 7 > i; return <g key={i} transform={`translate(${Math.cos(a) * 140} ${Math.sin(a) * 140})`}>
        <rect x={-34} y={-26} width={68} height={52} rx={10} fill={used ? "rgba(200,200,190,.4)" : "#f4f1e8"} stroke="#c9c2b0" strokeWidth={4} /><text y={12} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={KK.indigo}>{d}</text></g>; })}
      <line x1={0} y1={0} x2={0} y2={-120} stroke={KK.hanko} strokeWidth={10} strokeLinecap="round" transform={`rotate(${ang})`} /><circle r={16} fill={KK.sumi} />
    </svg>
    <div style={{ textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 62, color: KK.cream, textShadow: "0 4px 16px #000" }}>the clock of my freezer</div>
  </div>;
};

// ---------- ARROZ vs GRAVA: una cuchara de agua parte la pantalla en dos ----------
export const ArrozGrava: React.FC<{ t: number; at: number; out: number }> = ({ t, at: a0, out }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  const grain = (soft: boolean, i: number) => <ellipse key={i} cx={(i % 6) * 46 + 30 + (Math.floor(i / 6) % 2) * 20} cy={Math.floor(i / 6) * 34 + 30} rx={soft ? 20 : 16} ry={soft ? 10 : 9} fill={soft ? "#fbfaf4" : "#b9b3a6"} stroke={soft ? "#e2dccb" : "#7c766a"} strokeWidth={3} transform={soft ? "" : `rotate(${i * 37 % 60 - 30} ${(i % 6) * 46 + 30} ${Math.floor(i / 6) * 34 + 30})`} />;
  return <div style={{ position: "absolute", left: 0, right: 0, top: 650, display: "flex", justifyContent: "center", gap: 60, opacity: o }}>
    {[true, false].map((soft, j) => { const a = a0 + j * 0.35; return <div key={j} style={{ opacity: e(t, a, a + 0.1), transform: `scale(${pop(t, a)})`, padding: 20, borderRadius: 20, background: dark, textAlign: "center" }}>
      <svg width={300} height={160}>{Array.from({ length: 24 }, (_, i) => grain(soft, i))}</svg>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, color: soft ? KK.cream : "#b9b3a6" }}>{soft ? "+1 SPOON = RICE" : "NO WATER = GRAVEL"}</div></div>; })}
  </div>;
};

// ---------- TRES AGUAS: tres cuencos, el agua pasa de blanca a clara ----------
export const TresAguas: React.FC<{ t: number; at: number; out: number }> = ({ t, at: a0, out }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: 0, right: 0, top: 700, display: "flex", justifyContent: "center", gap: 50, opacity: o }}>
    {[0, 1, 2].map((i) => { const a = a0 + i * 0.6; return <div key={i} style={{ opacity: e(t, a, a + 0.15), transform: `translateY(${(1 - Math.min(1, pop(t, a))) * 80}px)`, textAlign: "center" }}>
      <svg width={220} height={130} viewBox="0 0 220 130" style={{ filter: "drop-shadow(0 16px 20px rgba(0,0,0,.5))" }}><ellipse cx={110} cy={36} rx={100} ry={28} fill={["rgba(250,250,245,.95)", "rgba(220,235,240,.75)", "rgba(160,210,240,.45)"][i]} stroke="#7a5228" strokeWidth={6} /><path d="M 10 38 Q 110 150 210 38" fill="#9a6a3a" /></svg>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 50, color: KK.cream, textShadow: "0 4px 12px #000" }}>{["white", "cloudy", "clear"][i]}</div></div>; })}
  </div>;
};

// ---------- SAL-TERMÓMETRO: -18 °C y la miso sigue blanda ----------
export const SalBlanda: React.FC<{ t: number; at: number; out: number; x?: number; y?: number }> = ({ t, at: a0, out, x = 1460, y = 520 }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  const v = Math.round(-18 * ei(t, a0 + 0.2, a0 + 1.4)), dent = e(t, a0 + 1.6, a0 + 2.2);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${pop(t, a0)})`, display: "flex", alignItems: "center", gap: 26 }}>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 110, color: KK.ice, textShadow: extrude(8, "#0a2a40") }}>{v}°C</div>
    <div style={{ textAlign: "center" }}>
      <svg width={220} height={170} viewBox="0 0 220 170"><path d={`M 20 120 Q 20 40 110 40 Q 200 40 200 120 Z`} fill="#b07a3e" /><path d={`M 70 ${60 + dent * 6} Q 110 ${60 + dent * 40} 150 ${60 + dent * 6}`} stroke="#7a5022" strokeWidth={dent * 10} fill="none" />
        <rect x={10} y={118} width={200} height={34} rx={10} fill="#e9eef0" /><path d={`M 150 ${20 - dent * 6} l 50 -30`} stroke="#c9ced3" strokeWidth={14} strokeLinecap="round" opacity={dent} /></svg>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, letterSpacing: 2, color: KK.cream, textShadow: extrude(3, "#000"), opacity: dent }}>STILL SOFT</div>
    </div>
  </div>;
};

// ---------- ENERO = MAYO: dos muestras de color de miso que no cambian ----------
export const EneroMayo: React.FC<{ t: number; at: number; may: number; out: number; x?: number; y?: number }> = ({ t, at: a0, may, out, x = 1420, y = 470 }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  const sw = (lab: string, a: number) => <div style={{ opacity: e(t, a, a + 0.12), transform: `rotate(${lab === "MAY" ? 4 : -4}deg) scale(${pop(t, a)})`, background: "#fff", padding: "14px 14px 20px", borderRadius: 6, boxShadow: "0 20px 30px rgba(0,0,0,.5)" }}>
    <div style={{ width: 200, height: 160, borderRadius: 4, background: "radial-gradient(circle at 40% 35%, #c69050, #a06a32)" }} />
    <div style={{ textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 40, color: KK.sumi, marginTop: 8 }}>{lab}</div></div>;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", alignItems: "center", gap: 24 }}>
    {sw("JANUARY", a0)}<div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 100, color: KK.cream, opacity: e(t, may, may + 0.2), textShadow: extrude(6, "#000") }}>=</div>{sw("MAY", may)}
  </div>;
};

// ---------- CUCHARAS: mojada (gota → hielo → moho) vs seca ----------
export const Cucharas: React.FC<{ t: number; at: number; dry: number; out: number }> = ({ t, at: a0, dry, out }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  const spoon = (wet: boolean) => <svg width={300} height={140} viewBox="0 0 300 140"><ellipse cx={70} cy={70} rx={60} ry={42} fill="#d8dcdf" stroke="#9aa0a8" strokeWidth={5} /><rect x={120} y={60} width={170} height={20} rx={10} fill="#d8dcdf" stroke="#9aa0a8" strokeWidth={5} />
    {wet && [0, 1, 2].map((i) => <path key={i} d={`M ${50 + i * 22} ${88 + (t * 40 + i * 20) % 40} q 8 10 0 16 q -8 -6 0 -16`} fill="#8fd3ff" />)}</svg>;
  const chain = ["WATER", "ICE", "MOLD"];
  return <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", justifyContent: "center", gap: 70, opacity: o }}>
    <div style={{ textAlign: "center", transform: `scale(${pop(t, a0)})` }}>{spoon(true)}
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>{chain.map((c, i) => <div key={c} style={{ opacity: e(t, a0 + 0.5 + i * 0.5, a0 + 0.7 + i * 0.5), fontFamily: FONT, fontWeight: 900, fontSize: 36, color: ["#8fd3ff", "#d9f3ff", "#9ab86a"][i], textShadow: extrude(3, "#000") }}>{c}{i < 2 ? " →" : ""}</div>)}</div></div>
    <div style={{ textAlign: "center", opacity: e(t, dry, dry + 0.15), transform: `scale(${pop(t, dry)})` }}>{spoon(false)}
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 60, color: KK.cream, textShadow: "0 4px 12px #000" }}>dry spoon, always ✓</div></div>
  </div>;
};

// ---------- RECETA: cuatro pellizcos que vuelan y forman la bolita ----------
export const Receta: React.FC<{ t: number; ats: number[]; ball: number; out: number; x?: number; y?: number }> = ({ t, ats, ball, out, x = 1420, y = 520 }) => {
  const o = vis(t, ats[0], out);
  if (o <= 0.01) return null;
  const names = ["1 spoon miso", "wakame", "green onion", "fish flakes"], cols = ["#b07a3e", "#3e5a32", "#7fae4c", "#e6b98a"];
  const m = ei(t, ball, ball + 0.6);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", width: 560, height: 520 }}>
    {names.map((n, i) => { const a = (i / 4) * Math.PI * 2 - Math.PI / 2, r = 200 * (1 - m), v = e(t, ats[i], ats[i] + 0.12);
      return <div key={n} style={{ position: "absolute", left: 280 + Math.cos(a) * r, top: 230 + Math.sin(a) * r * 0.8, transform: `translate(-50%,-50%) scale(${pop(t, ats[i]) * (1 - 0.6 * m)})`, opacity: v * (1 - e(t, ball + 0.4, ball + 0.6)), textAlign: "center" }}>
        <div style={{ width: 90, height: 90, borderRadius: 45, margin: "0 auto", background: `radial-gradient(circle at 35% 30%, #fff8, ${cols[i]})`, boxShadow: "0 14px 24px rgba(0,0,0,.5)" }} />
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, color: KK.cream, whiteSpace: "nowrap", textShadow: "0 4px 12px #000" }}>{n}</div></div>; })}
    {m > 0.3 && <div style={{ position: "absolute", left: 280, top: 230, transform: `translate(-50%,-50%) scale(${pop(t, ball + 0.4)})`, textAlign: "center" }}>
      <div style={{ width: 170, height: 170, borderRadius: 85, margin: "0 auto", background: "radial-gradient(circle at 35% 30%, #e9c08a, #a9733a 60%, #6e4a22)", boxShadow: "0 24px 40px rgba(0,0,0,.6), inset 0 0 0 6px rgba(255,255,255,.25)" }} />
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 46, color: KK.cream, textShadow: extrude(4, "#000"), whiteSpace: "nowrap" }}>WALNUT SIZE</div></div>}
  </div>;
};

// ---------- 10 BOLITAS = 10 SOPAS ----------
export const DiezDiez: React.FC<{ t: number; at: number; out: number }> = ({ t, at: a0, out }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", opacity: o }}>
    <div style={{ display: "inline-grid", gridTemplateColumns: "repeat(10, 120px)", rowGap: 18 }}>
      {Array.from({ length: 10 }, (_, i) => { const a = a0 + i * 0.08; return <div key={i} style={{ opacity: e(t, a, a + 0.08), transform: `scale(${pop(t, a)})` }}><div style={{ width: 70, height: 70, margin: "0 auto", borderRadius: 35, background: "radial-gradient(circle at 35% 30%, #e9c08a, #a9733a)" }} /></div>; })}
      {Array.from({ length: 10 }, (_, i) => { const a = a0 + 1.0 + i * 0.08; return <div key={"c" + i} style={{ opacity: e(t, a, a + 0.08), transform: `translateY(${(1 - Math.min(1, pop(t, a))) * -40}px)` }}>
        <svg width={100} height={80} viewBox="0 0 100 80"><path d="M 10 20 L 90 20 L 80 74 L 20 74 Z" fill="#fbfaf6" stroke={KK.indigo} strokeWidth={5} /><ellipse cx={50} cy={22} rx={38} ry={6} fill="#c69050" />{[0, 1].map((k) => <path key={k} d={`M ${40 + k * 20} 14 q 6 -8 0 -14`} stroke="#fff" strokeWidth={4} fill="none" opacity={0.7} />)}</svg></div>; })}
    </div>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 70, color: KK.cream, textShadow: extrude(6, "#000"), opacity: e(t, a0 + 1.6, a0 + 1.9) }}>10 BALLS = 10 SOUPS</div>
  </div>;
};

// ---------- 30 SEGUNDOS: anillo que se llena (sopa de miso / verdura) ----------
export const Anillo30: React.FC<{ t: number; at: number; out: number; label: string; x?: number; y?: number; col?: string }> = ({ t, at: a0, out, label, x = 1450, y = 500, col = "#7dd36a" }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  const k = Math.min(1, Math.max(0, (t - a0 - 0.2) / 3)), sec = Math.round(30 * k), C = 2 * Math.PI * 120;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${pop(t, a0)})`, textAlign: "center" }}>
    <svg width={300} height={300} viewBox="-150 -150 300 300"><circle r={120} fill="rgba(10,16,26,.8)" stroke="rgba(255,255,255,.15)" strokeWidth={22} /><circle r={120} fill="none" stroke={col} strokeWidth={22} strokeDasharray={C} strokeDashoffset={C * (1 - k)} transform="rotate(-90)" strokeLinecap="round" />
      <text y={26} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={90} fill={KK.cream}>{sec}s</text></svg>
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 58, color: KK.cream, textShadow: "0 4px 14px #000" }}>{label}</div>
  </div>;
};

// ---------- CUBOS DE DASHI: 1 · 2 · 4 cubitos por plato ----------
export const CubosUso: React.FC<{ t: number; ats: number[]; out: number }> = ({ t, ats, out }) => {
  const o = vis(t, ats[0], out);
  if (o <= 0.01) return null;
  const rows: [number, string][] = [[1, "stir-fry"], [2, "noodles"], [4, "small soup"]];
  return <div style={{ position: "absolute", left: 1180, top: 300, opacity: o, padding: "26px 36px", borderRadius: 24, background: dark, boxShadow: "0 30px 60px rgba(0,0,0,.5)" }}>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, letterSpacing: 4, color: KK.hinoki, marginBottom: 14 }}>1 CUBE ≈ 2 SPOONS</div>
    {rows.map(([n, lab], i) => <div key={lab} style={{ display: "flex", alignItems: "center", gap: 16, height: 96, opacity: e(t, ats[i + 1] ?? ats[0], (ats[i + 1] ?? ats[0]) + 0.12) }}>
      <div style={{ display: "flex", gap: 8, width: 300 }}>{Array.from({ length: n }, (_, k) => <div key={k} style={{ width: 60, height: 60, borderRadius: 10, transform: `scale(${pop(t, (ats[i + 1] ?? ats[0]) + k * 0.08)})`, background: "linear-gradient(135deg, rgba(240,210,150,.95), rgba(200,150,80,.85))", boxShadow: "inset 0 0 0 3px rgba(255,255,255,.6), 0 8px 14px rgba(0,0,0,.4)" }} />)}</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: KK.cream }}>{lab}</div></div>)}
  </div>;
};

// ---------- BOLSA QUE GIRA: parada en el vaso → acostada en la bandeja → parada como libro ----------
export const BolsaGiro: React.FC<{ t: number; ats: number[]; out: number; x?: number; y?: number }> = ({ t, ats, out, x = 1420, y = 520 }) => {
  const o = vis(t, ats[0], out);
  if (o <= 0.01) return null;
  const step = ats.filter((a) => t >= a).length - 1, rot = [0, 90, 0][Math.max(0, step)], r = ei(t, ats[Math.max(0, step)], ats[Math.max(0, step)] + 0.5);
  const prev = [0, 0, 90][Math.max(0, step)], ang = prev + (rot - prev) * r;
  const lab = ["STANDING UP (in a cup)", "LYING DOWN (to freeze)", "LIKE A BOOK (on a shelf)"][Math.max(0, step)];
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", textAlign: "center" }}>
    <svg width={460} height={400} viewBox="-230 -200 460 400">
      {step === 0 && <path d="M -90 40 L 90 40 L 76 190 L -76 190 Z" fill="rgba(240,240,235,.6)" stroke="#fff" strokeWidth={5} />}
      {step === 1 && <rect x={-200} y={110} width={400} height={18} rx={6} fill="#9aa0a8" />}
      {step === 2 && [-120, -80, 80, 120].map((xx) => <rect key={xx} x={xx - 14} y={-60} width={26} height={190} rx={6} fill={["#f4f1e8", "#6f9a45", "#e8916a", "#e9d2b0"][Math.abs(xx) % 4]} opacity={0.8} />)}
      <g transform={`rotate(${ang}) translate(0 ${step === 1 ? -40 : 0})`}><rect x={-70} y={-130} width={140} height={250} rx={18} fill="#d9a25a" stroke="#fff" strokeWidth={6} /><rect x={-70} y={-130} width={140} height={34} rx={10} fill="#e9eef0" /></g>
    </svg>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, color: KK.cream, textShadow: extrude(4, "#000"), whiteSpace: "nowrap" }}>{lab}</div>
  </div>;
};

// ---------- ALIENTO: nubecita de vapor que sale de una boca dibujada ----------
export const Aliento: React.FC<{ t: number; at: number; out: number; x?: number; y?: number }> = ({ t, at: a0, out, x = 1460, y = 380 }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  const p = (t - a0) % 1.6 / 1.6;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)" }}>
    {[0, 1, 2].map((i) => { const q = (p + i * 0.33) % 1; return <div key={i} style={{ position: "absolute", left: q * 260, top: -q * 60, width: 120 + q * 200, height: 80 + q * 120, borderRadius: "50%", background: `rgba(235,246,255,${0.55 * (1 - q)})`, filter: "blur(14px)", transform: "translate(-50%,-50%)" }} />; })}
    <div style={{ position: "absolute", left: 120, top: 120, fontFamily: HAND, fontWeight: 700, fontSize: 64, color: KK.cream, whiteSpace: "nowrap", textShadow: "0 4px 14px #000" }}>so cold your breath made clouds</div>
  </div>;
};

// ---------- MANO A CIEGAS: contorno de mano que entra y "sabe" (ojos cerrados) ----------
export const ManoCiega: React.FC<{ t: number; at: number; out: number }> = ({ t, at: a0, out }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  const k = ei(t, a0 + 0.2, a0 + 1.6);
  return <AbsoluteFill style={{ opacity: o, pointerEvents: "none" }}>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(${1500 - 300 * k} ${1180 - 520 * k}) rotate(-25)`} stroke={KK.cream} strokeWidth={8} fill="rgba(251,243,226,.12)" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 14px rgba(255,240,200,.6))" }}>
        <path d="M 0 0 L 0 -140 Q 0 -160 18 -160 Q 36 -160 36 -140 L 36 -60 L 40 -190 Q 40 -210 58 -210 Q 76 -210 76 -190 L 76 -60 L 80 -200 Q 80 -220 98 -220 Q 116 -220 116 -200 L 116 -60 L 122 -170 Q 122 -190 140 -190 Q 158 -190 158 -170 L 158 -20 Q 158 80 80 100 Q 10 110 -20 60 L -70 -20 Q -80 -40 -62 -48 Q -44 -54 -30 -36 Z" />
      </g>
    </svg>
    <div style={{ position: "absolute", left: 160, top: 220, fontFamily: HAND, fontWeight: 700, fontSize: 84, color: KK.cream, textShadow: "0 6px 20px #000", opacity: e(t, a0 + 1, a0 + 1.4) }}>without looking…<br /><span style={{ color: KK.hinoki }}>you know.</span></div>
  </AbsoluteFill>;
};

// ---------- VERDE → MARRÓN: barra de hoja que se pone marrón si va cruda ----------
export const HojaMarron: React.FC<{ t: number; at: number; out: number; x?: number; y?: number }> = ({ t, at: a0, out, x = 1420, y = 860 }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  const k = e(t, a0 + 0.3, a0 + 2);
  const c = `rgb(${Math.round(90 + 60 * k)},${Math.round(160 - 60 * k)},${Math.round(70 - 30 * k)})`;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${pop(t, a0)})`, display: "flex", alignItems: "center", gap: 24, padding: "18px 30px", borderRadius: 20, background: dark }}>
    <svg width={160} height={110} viewBox="0 0 160 110"><path d="M 10 90 Q 20 10 150 14 Q 140 100 10 90 Z" fill={c} /><path d="M 14 88 Q 70 50 146 16" stroke="rgba(255,255,255,.5)" strokeWidth={4} fill="none" /></svg>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 48, color: k > 0.6 ? "#c9a46a" : "#9adf7a", textShadow: extrude(4, "#000") }}>{k > 0.6 ? "RAW = BROWN, GRASSY" : "RAW…"}</div>
  </div>;
};

// ---------- OBRERITOS: las enzimas como trabajadores con casco que siguen cambiando la hoja; el agua hirviendo los para ----------
export const Obreritos: React.FC<{ t: number; at: number; stop: number; out: number; x?: number; y?: number }> = ({ t, at: a0, stop, out, x = 1400, y = 520 }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  const st = e(t, stop, stop + 0.5);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${pop(t, a0, 0.9)})` }}>
    <svg width={600} height={380} viewBox="0 0 600 380" style={{ filter: "drop-shadow(0 24px 40px rgba(0,0,0,.55))" }}>
      <path d="M 30 330 Q 60 30 570 40 Q 540 360 30 330 Z" fill={st > 0.5 ? "#4fa64a" : "#6aa84a"} />
      <path d="M 40 325 Q 260 200 560 46" stroke="rgba(255,255,255,.4)" strokeWidth={6} fill="none" />
      {Array.from({ length: 7 }, (_, i) => { const bx = 120 + i * 60, by = 250 - i * 26 + Math.sin(t * 8 + i) * 8 * (1 - st);
        return <g key={i} transform={`translate(${bx} ${by})`}><circle r={18} fill="#f0c9a0" /><path d="M -20 -6 Q 0 -32 20 -6 Z" fill="#f2c230" /><rect x={-12} y={16} width={24} height={26} rx={6} fill={KK.indigo} />
          <line x1={14} y1={24} x2={30 + 6 * Math.sin(t * 12 + i) * (1 - st)} y2={10} stroke="#888" strokeWidth={5} />
          {st > 0.5 && <text x={-14} y={-38} fontFamily={FONT} fontWeight={900} fontSize={22} fill={KK.cream}>zz</text>}</g>; })}
    </svg>
    <div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 50, color: st > 0.5 ? KK.ice : KK.cream, textShadow: extrude(4, "#000") }}>{st > 0.5 ? "30 s BOILING = THEY STOP" : "ENZYMES · LITTLE WORKERS"}</div>
  </div>;
};

// ---------- PASOS en fichas de papel washi (cold water · squeeze · cut · freeze) ----------
export const Pasos: React.FC<{ t: number; items: [string, number][]; out: number; y?: number }> = ({ t, items, out, y = 800 }) => {
  if (t < items[0][1] - 0.05) return null;
  const o = 1 - e(t, out, out + 0.3);
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 26, opacity: o }}>
    {items.map(([s0, a], i) => <div key={s0} style={{ opacity: e(t, a, a + 0.1), transform: `rotate(${(i % 2 ? 3 : -3)}deg) translateY(${(1 - Math.min(1, pop(t, a))) * 60}px)`, padding: "12px 30px 16px", background: paper, boxShadow: "0 16px 28px rgba(0,0,0,.5)", clipPath: "polygon(2% 6%, 98% 0, 100% 94%, 0 100%)", fontFamily: HAND, fontWeight: 700, fontSize: 56, color: KK.sumi }}>
      <span style={{ color: KK.hanko }}>{i + 1}.</span> {s0}</div>)}
  </div>;
};

// ---------- CÉLULAS: paredes de celda que el hielo quiebra → ola de sabor ----------
export const Celulas: React.FC<{ t: number; at: number; crack: number; taste: number; out: number; x?: number; y?: number }> = ({ t, at: a0, crack, taste, out, x = 1400, y = 500 }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  const c = e(t, crack, crack + 0.8), tz = e(t, taste, taste + 0.6);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${pop(t, a0, 0.9)})`, textAlign: "center" }}>
    <svg width={560} height={360} viewBox="0 0 560 360" style={{ borderRadius: 30, background: "rgba(40,28,18,.85)" }}>
      {Array.from({ length: 12 }, (_, i) => { const cx = 70 + (i % 4) * 140, cy = 70 + Math.floor(i / 4) * 110;
        return <g key={i}><rect x={cx - 60} y={cy - 48} width={120} height={96} rx={26} fill="#c9a77e" stroke="#7a5a3a" strokeWidth={6} strokeDasharray={c > 0.3 ? `${30 - c * 20} ${c * 20}` : undefined} />
          <path d={`M ${cx - 20} ${cy - 10} l 12 -14 l 8 18 l 14 -10`} stroke="#e9f8ff" strokeWidth={5} fill="none" opacity={c} />
          {tz > 0.01 && <circle cx={cx + 40} cy={cy - 40} r={6 + 18 * tz * ((t * 2 + i) % 1)} fill="none" stroke="#ffcf6a" strokeWidth={3} opacity={1 - ((t * 2 + i) % 1)} />}</g>; })}
    </svg>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 48, color: tz > 0.5 ? "#ffcf6a" : KK.ice, textShadow: extrude(4, "#000") }}>{tz > 0.5 ? "MORE DEEP, SAVORY TASTE" : "ICE BREAKS THE CELL WALLS"}</div>
  </div>;
};

// ---------- TRES USOS: sopa · arroz · fideos (un puñado a cada uno) ----------
export const TresUsos: React.FC<{ t: number; ats: number[]; out: number; labels: string[]; y?: number }> = ({ t, ats, out, labels, y = 720 }) => {
  if (t < ats[0] - 0.05) return null;
  const o = 1 - e(t, out, out + 0.3);
  const icon = (i: number) => <svg width={170} height={130} viewBox="0 0 170 130"><path d="M 15 40 Q 85 150 155 40 Z" fill={["#fbfaf6", KK.indigo, "#c8352b"][i % 3]} /><ellipse cx={85} cy={40} rx={70} ry={16} fill={["#c69050", "#fbfaf6", "#e9c08a"][i % 3]} />
    {i === 2 && [0, 1, 2].map((k) => <path key={k} d={`M ${60 + k * 20} 40 q 10 -20 0 -40`} stroke="#f3e2b0" strokeWidth={5} fill="none" />)}</svg>;
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 60, opacity: o }}>
    {labels.map((l, i) => <div key={l} style={{ textAlign: "center", opacity: e(t, ats[i], ats[i] + 0.1), transform: `scale(${pop(t, ats[i])})`, filter: "drop-shadow(0 16px 24px rgba(0,0,0,.55))" }}>{icon(i)}
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: KK.cream, textShadow: "0 4px 12px #000" }}>{l}</div></div>)}
  </div>;
};

// ---------- NIEVE DE JENGIBRE: copos que caen + barra 2 semanas vs meses ----------
export const NieveJengibre: React.FC<{ t: number; at: number; out: number }> = ({ t, at: a0, out }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  return <AbsoluteFill style={{ opacity: o, pointerEvents: "none" }}>
    {Array.from({ length: 60 }, (_, i) => { const x = (i * 97) % 1920, sp = 120 + (i % 5) * 40, y = ((t - a0) * sp + i * 53) % 1180 - 60;
      return <div key={i} style={{ position: "absolute", left: x + Math.sin(t * 1.5 + i) * 20, top: y, width: 8 + (i % 3) * 4, height: 8 + (i % 3) * 4, borderRadius: "50%", background: "#fff6dc", boxShadow: "0 0 8px rgba(255,240,200,.9)" }} />; })}
    <div style={{ position: "absolute", left: 1150, top: 160, padding: "22px 34px", borderRadius: 22, background: dark, transform: `scale(${pop(t, a0 + 0.3)})` }}>
      {[["FRIDGE", "2 weeks", 0.18, "#9ab86a"], ["FREEZER", "months", 1, KK.ice]].map(([a, b, w, c], i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, height: 70 }}>
        <div style={{ width: 170, fontFamily: FONT, fontWeight: 900, fontSize: 32, color: KK.cream }}>{a}</div>
        <div style={{ width: 360 * (w as number) * e(t, a0 + 0.5 + i * 0.4, a0 + 1.3 + i * 0.4), height: 30, borderRadius: 15, background: c as string }} />
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, color: c as string }}>{b}</div></div>)}
    </div>
  </AbsoluteFill>;
};

// ---------- DIENTES DE AJO: uno por uno, pelados ----------
export const Ajos: React.FC<{ t: number; at: number; out: number; x?: number; y?: number }> = ({ t, at: a0, out, x = 1440, y = 760 }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", gap: 14, alignItems: "flex-end" }}>
    {Array.from({ length: 5 }, (_, i) => { const a = a0 + i * 0.25; return <svg key={i} width={90} height={120} viewBox="0 0 90 120" style={{ opacity: e(t, a, a + 0.1), transform: `translateY(${(1 - Math.min(1, pop(t, a))) * -100}px)`, filter: "drop-shadow(0 12px 16px rgba(0,0,0,.5))" }}><path d="M 45 6 Q 86 60 70 104 Q 45 118 20 104 Q 4 60 45 6 Z" fill="#f6efd8" stroke="#d7c79a" strokeWidth={4} /></svg>; })}
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: KK.cream, marginLeft: 16, textShadow: "0 4px 12px #000" }}>one clove at a time</div>
  </div>;
};

// ---------- PIZCAS: un pote de cebolla de verdeo que se vacía en pizcas sobre 3 platos ----------
export const Pizcas: React.FC<{ t: number; ats: number[]; out: number }> = ({ t, ats, out }) => {
  const o = vis(t, ats[0], out);
  if (o <= 0.01) return null;
  const labs = ["noodles", "soup", "egg"];
  return <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", justifyContent: "center", gap: 70, opacity: o }}>
    {labs.map((l, i) => { const a = ats[i] ?? ats[0]; return <div key={l} style={{ textAlign: "center", opacity: e(t, a, a + 0.1), transform: `scale(${pop(t, a)})` }}>
      <svg width={200} height={170} viewBox="0 0 200 170">{Array.from({ length: 10 }, (_, k) => { const f = Math.min(1, Math.max(0, (t - a - k * 0.05) * 2)); return <rect key={k} x={80 + (k * 13) % 40} y={-10 + f * 90 + (k % 3) * 6} width={10} height={6} rx={2} fill="#7fae4c" opacity={f > 0 ? 1 : 0} />; })}
        <ellipse cx={100} cy={120} rx={90} ry={26} fill="#fbfaf6" stroke={KK.indigo} strokeWidth={6} /><ellipse cx={100} cy={116} rx={60} ry={14} fill={["#e9c08a", "#c69050", "#f2c230"][i]} /></svg>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 54, color: KK.cream, textShadow: "0 4px 12px #000" }}>+ a pinch · {l}</div></div>; })}
  </div>;
};

// ---------- PROHIBIDOS: cinco cosas que se tachan con pincelada sumi ----------
export const Prohibidos: React.FC<{ t: number; items: [string, number][]; out: number; x?: number; y?: number }> = ({ t, items, out, x = 1430, y = 250 }) => {
  if (t < items[0][1] - 0.05) return null;
  const o = 1 - e(t, out, out + 0.3);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translateX(-50%) rotate(-2deg)", padding: "26px 40px", background: paper, boxShadow: "0 30px 60px rgba(0,0,0,.55)", borderRadius: 6 }}>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 40, letterSpacing: 4, color: KK.hanko, marginBottom: 8 }}>NEVER IN THE FREEZER</div>
    {items.map(([s0, a]) => { const x2 = e(t, a + 0.35, a + 0.6); return <div key={s0} style={{ position: "relative", opacity: e(t, a, a + 0.1), fontFamily: HAND, fontWeight: 700, fontSize: 58, lineHeight: "70px", color: KK.sumi }}>{s0}
      <div style={{ position: "absolute", left: -10, top: 32, width: `${(s0.length * 26 + 30) * x2}px`, height: 12, borderRadius: 6, background: "rgba(36,30,27,.85)", transform: "rotate(-2deg)" }} /></div>; })}
  </div>;
};

// ---------- MARINADA: corte de pescado; la sal (puntitos) entra despacio mientras espera ----------
export const Marinada: React.FC<{ t: number; at: number; salt: number; out: number; x?: number; y?: number }> = ({ t, at: a0, salt, out, x = 1420, y = 500 }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  const d = e(t, salt, salt + 3);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${pop(t, a0, 0.9)})`, textAlign: "center" }}>
    <svg width={560} height={300} viewBox="0 0 560 300" style={{ filter: "drop-shadow(0 24px 40px rgba(0,0,0,.6))" }}>
      <path d="M 30 150 Q 120 40 300 50 Q 480 60 530 150 Q 480 240 300 250 Q 120 260 30 150 Z" fill="#f29a74" stroke="#c96a48" strokeWidth={6} />
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${120 + i * 70} 70 Q ${150 + i * 70} 150 ${120 + i * 70} 230`} stroke="rgba(255,255,255,.55)" strokeWidth={6} fill="none" />)}
      <path d="M 30 150 Q 120 40 300 50 Q 480 60 530 150" fill="none" stroke="#b07a3e" strokeWidth={14} opacity={e(t, a0 + 0.3, a0 + 0.8)} />
      {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={60 + (i * 53) % 440} cy={70 + d * ((i * 37) % 150)} r={4} fill="#fff" opacity={0.85} />)}
    </svg>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 46, color: KK.cream, textShadow: extrude(4, "#000") }}>{d > 0.3 ? "THE FREEZER BECOMES THE MARINADE" : "MISO + SWEET RICE WINE"}</div>
  </div>;
};

// ---------- AIRE: burbujas que se secan la comida; las manos las empujan afuera ----------
export const Aire: React.FC<{ t: number; at: number; push: number; out: number; x?: number; y?: number }> = ({ t, at: a0, push, out, x = 1420, y = 520 }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  const p = ei(t, push, push + 1.4);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${pop(t, a0, 0.9)})`, textAlign: "center" }}>
    <svg width={520} height={360} viewBox="0 0 520 360">
      <rect x={60} y={40} width={400} height={290} rx={30} fill="rgba(220,240,250,.25)" stroke="#fff" strokeWidth={6} />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={100 + (i % 2) * 170} y={80 + Math.floor(i / 2) * 120} width={150} height={90} rx={14} fill="#e9d2b0" stroke="#fff" strokeWidth={5} />)}
      {Array.from({ length: 12 }, (_, i) => { const by = 300 - ((t * 60 + i * 30) % 260) - p * 320; return <circle key={i} cx={90 + (i * 31) % 340} cy={by} r={10 + (i % 3) * 5} fill="none" stroke="#bfe8ff" strokeWidth={4} opacity={by > 30 ? 0.9 : 0} />; })}
      <path d={`M 60 ${330 - p * 260} L 460 ${330 - p * 260}`} stroke={KK.hanko} strokeWidth={8} strokeDasharray="16 10" opacity={p > 0.02 ? 1 : 0} />
    </svg>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 48, color: p > 0.5 ? KK.cream : "#bfe8ff", textShadow: extrude(4, "#000") }}>{p > 0.5 ? "PUSH THE AIR OUT" : "AIR IS THE ENEMY"}</div>
  </div>;
};

// ---------- BANDEJA: la bandeja grande se corta en 8 porciones; comparación 8 vs 2 cenas ----------
export const Bandeja: React.FC<{ t: number; at: number; cut: number; cmp: number; out: number; x?: number; y?: number }> = ({ t, at: a0, cut, cmp, out, x = 1400, y = 470 }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  const c = e(t, cut, cut + 1), m = e(t, cmp, cmp + 0.4);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${pop(t, a0, 0.9)})`, textAlign: "center" }}>
    <svg width={560} height={330} viewBox="0 0 560 330" style={{ filter: "drop-shadow(0 24px 40px rgba(0,0,0,.55))" }}>
      <rect x={20} y={20} width={520} height={290} rx={26} fill="#f4f4f0" stroke="#cfd3d6" strokeWidth={8} />
      {Array.from({ length: 8 }, (_, i) => { const gx = 50 + (i % 4) * 120 + (i % 4) * c * 8, gy = 50 + Math.floor(i / 4) * 125 + Math.floor(i / 4) * c * 10; return <rect key={i} x={gx} y={gy} width={110} height={110} rx={20} fill="#efc8a6" stroke="#d99f7a" strokeWidth={4} />; })}
      {c > 0.01 && [1, 2, 3].map((i) => <line key={i} x1={40 + i * 128} y1={40} x2={40 + i * 128} y2={40 + 250 * c} stroke={KK.sumi} strokeWidth={5} strokeDasharray="12 8" />)}
    </svg>
    <div style={{ display: "flex", justifyContent: "center", gap: 40, opacity: m, marginTop: 10 }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: KK.ice, textShadow: extrude(5, "#000") }}>BIG TRAY = 8</div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: "#c9b48a", textShadow: extrude(5, "#000"), opacity: e(t, cmp + 1.6, cmp + 1.9) }}>small = 2</div>
    </div>
  </div>;
};

// ---------- PALMA = 100 g ----------
export const Palma: React.FC<{ t: number; at: number; out: number; x?: number; y?: number }> = ({ t, at: a0, out, x = 1460, y = 420 }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${pop(t, a0)}) rotate(-6deg)`, textAlign: "center" }}>
    <svg width={260} height={280} viewBox="0 0 260 280"><path d="M 70 270 L 60 150 Q 30 120 40 90 L 44 30 Q 46 14 60 16 Q 72 18 72 34 L 76 100 L 84 16 Q 86 0 100 2 Q 114 4 112 20 L 108 100 L 124 22 Q 128 8 142 10 Q 156 14 152 30 L 140 106 L 168 46 Q 176 32 190 38 Q 202 46 194 62 L 176 140 Q 220 130 236 150 Q 200 190 170 270 Z" fill="#f0c9a0" stroke="#a07050" strokeWidth={6} />
      <rect x={70} y={150} width={110} height={70} rx={18} fill="#efc8a6" stroke="#d99f7a" strokeWidth={4} /></svg>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 70, color: KK.cream, textShadow: extrude(6, "#000") }}>100 g</div>
  </div>;
};

// ---------- TABLETA 4×4: líneas de palillo que dibujan 16 cuadraditos; uno se quiebra ----------
export const Tableta: React.FC<{ t: number; at: number; snap: number; out: number; x?: number; y?: number }> = ({ t, at: a0, snap, out, x = 1440, y = 500 }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  const sn = ei(t, snap, snap + 0.6);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(900px) rotateX(28deg) scale(${pop(t, a0, 0.9)})` }}>
    <svg width={460} height={460} viewBox="0 0 460 460" style={{ overflow: "visible", filter: "drop-shadow(0 30px 40px rgba(0,0,0,.6))" }}>
      <rect x={20} y={20} width={420} height={420} rx={30} fill="#c98a72" stroke="rgba(255,255,255,.7)" strokeWidth={8} />
      {[1, 2, 3].map((i) => { const a = a0 + 0.4 + i * 0.25, b = a0 + 1.4 + i * 0.25; return <g key={i} stroke="#7a4a36" strokeWidth={9} strokeLinecap="round">
        <line x1={20 + i * 105} y1={20} x2={20 + i * 105} y2={20 + 420 * e(t, a, a + 0.3)} /><line x1={20} y1={20 + i * 105} x2={20 + 420 * e(t, b, b + 0.3)} y2={20 + i * 105} /></g>; })}
      {sn > 0 && <rect x={335 + sn * 80} y={335 + sn * 40} width={105} height={105} rx={12} fill="#c98a72" stroke="#fff" strokeWidth={5} transform={`rotate(${sn * 20} 387 387)`} />}
    </svg>
    <div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 56, color: KK.cream, textShadow: extrude(5, "#000"), marginTop: 10 }}>{sn > 0.3 ? "16 LITTLE PORTIONS" : "4 × 4"}</div>
  </div>;
};

// ---------- ZONA DE PELIGRO: termómetro horizontal; la superficie se queda horas en la franja roja ----------
export const ZonaPeligro: React.FC<{ t: number; at: number; out: number; x?: number; y?: number }> = ({ t, at: a0, out, x = 960, y = 820 }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  const k = e(t, a0 + 0.4, a0 + 3), h = Math.round(1 + 4 * k);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${pop(t, a0)})`, padding: "20px 34px", borderRadius: 24, background: dark }}>
    <div style={{ position: "relative", width: 900, height: 60, borderRadius: 30, background: "linear-gradient(90deg,#8fd3ff 0%,#8fd3ff 22%,#ff6a4a 30%,#ff6a4a 78%,#ffb257 100%)" }}>
      <div style={{ position: "absolute", left: `${22 + 40 * k}%`, top: -20, width: 6, height: 100, background: "#fff", boxShadow: "0 0 12px #fff" }} />
      <div style={{ position: "absolute", left: "33%", top: 12, fontFamily: FONT, fontWeight: 900, fontSize: 28, color: "#fff", letterSpacing: 2, whiteSpace: "nowrap" }}>WHERE GERMS GROW FASTEST</div>
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontFamily: FONT, fontWeight: 900, fontSize: 36, color: KK.cream }}><span>FROZEN INSIDE</span><span style={{ color: "#ff8a6a" }}>OUTSIDE: {h} HOURS</span></div>
  </div>;
};

// ---------- LUNA → SOL: esta noche a la heladera, mañana a la noche listo ----------
export const NocheManana: React.FC<{ t: number; at: number; ready: number; out: number; x?: number; y?: number }> = ({ t, at: a0, ready, out, x = 1460, y = 400 }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  const r = ei(t, ready, ready + 0.8);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${pop(t, a0)})`, padding: "26px 40px", borderRadius: 26, background: dark, textAlign: "center" }}>
    <svg width={460} height={170} viewBox="0 0 460 170">
      <path d="M 40 150 A 190 120 0 0 1 420 150" stroke="rgba(255,255,255,.3)" strokeWidth={4} fill="none" strokeDasharray="10 10" />
      <g transform={`translate(${40 + 380 * r} ${150 - Math.sin(r * Math.PI) * 120})`}><circle r={30} fill={r > 0.5 ? "#ffd27a" : "#e6ecff"} style={{ filter: `drop-shadow(0 0 16px ${r > 0.5 ? "#ffb257" : "#bcd0ff"})` }} /></g>
    </svg>
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 58, color: KK.cream }}>{r > 0.5 ? "tomorrow evening: ready" : "tonight → into the fridge"}</div>
  </div>;
};

// ---------- ESPONJA: tofu blanco → amarillo con agujeritos que beben el caldo ----------
export const Esponja: React.FC<{ t: number; at: number; drink: number; out: number; x?: number; y?: number }> = ({ t, at: a0, drink, out, x = 1430, y = 480 }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  const y2 = e(t, a0 + 0.4, a0 + 1.6), d = e(t, drink, drink + 1.5);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(900px) rotateY(-20deg) rotateX(14deg) scale(${pop(t, a0, 0.9)})`, textAlign: "center" }}>
    <div style={{ position: "relative", width: 420, height: 280, borderRadius: 24, background: `rgb(${250 - y2 * 10},${248 - y2 * 30},${238 - y2 * 110})`, boxShadow: "0 30px 50px rgba(0,0,0,.6), inset 0 0 40px rgba(160,120,40,.25)", overflow: "hidden" }}>
      {Array.from({ length: 40 }, (_, i) => <div key={i} style={{ position: "absolute", left: (i * 71) % 400, top: (i * 43) % 260, width: (8 + (i % 4) * 6) * y2, height: (6 + (i % 3) * 5) * y2, borderRadius: "50%", background: d > (i % 10) / 10 ? "#8a5a2a" : "rgba(120,90,40,.55)" }} />)}
    </div>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 48, color: d > 0.4 ? "#e9b46a" : KK.cream, textShadow: extrude(4, "#000"), marginTop: 18 }}>{d > 0.4 ? "THE HOLES DRINK THE BROTH" : "LIKE A SPONGE"}</div>
  </div>;
};

// ---------- CINTA ROTULADA: cinta de pintor con la letra que se escribe ----------
export const CintaFecha: React.FC<{ t: number; at: number; lie: number; out: number; x?: number; y?: number }> = ({ t, at: a0, lie, out, x = 1380, y = 300 }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  const w = e(t, a0 + 0.2, a0 + 1.6), lz = e(t, lie, lie + 0.4);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)" }}>
    <div style={{ transform: `rotate(-3deg) scale(${pop(t, a0)})`, padding: "18px 44px", background: "linear-gradient(180deg,#f3e4b8,#e2cf98)", boxShadow: "0 20px 34px rgba(0,0,0,.5)", clipPath: "polygon(1% 10%, 99% 0, 100% 90%, 0 100%)" }}>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 84, color: KK.sumi, whiteSpace: "nowrap", clipPath: `inset(-30% ${100 - 100 * w}% -30% 0)` }}>Chicken, miso · Oct 20</div>
    </div>
    <div style={{ marginTop: 40, textAlign: "center", opacity: lz, transform: `scale(${pop(t, lie)})`, fontFamily: HAND, fontWeight: 700, fontSize: 70, color: KK.cream, textShadow: "0 4px 14px #000" }}>
      your memory: <span style={{ color: KK.hanko, textDecoration: "line-through" }}>"I'll remember"</span></div>
  </div>;
};

// ---------- ROTACIÓN: viejo al frente, nuevo atrás (flechas que giran) ----------
export const Rotacion: React.FC<{ t: number; at: number; out: number; x?: number; y?: number }> = ({ t, at: a0, out, x = 1430, y = 500 }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  const k = ei(t, a0 + 0.6, a0 + 2.2);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${pop(t, a0, 0.9)})`, padding: "26px 34px", borderRadius: 26, background: dark }}>
    <div style={{ position: "relative", width: 520, height: 300 }}>
      <div style={{ position: "absolute", left: 30 + 300 * k, top: 60, width: 170, height: 170, borderRadius: 20, background: "#cfdbe0", boxShadow: "inset 0 0 0 5px #fff", fontFamily: FONT, fontWeight: 900, fontSize: 40, textAlign: "center", lineHeight: "170px", color: KK.sumi }}>OLD</div>
      <div style={{ position: "absolute", left: 330 - 300 * k, top: 60, width: 170, height: 170, borderRadius: 20, background: "#f4f1e8", boxShadow: "inset 0 0 0 5px #fff", fontFamily: FONT, fontWeight: 900, fontSize: 40, textAlign: "center", lineHeight: "170px", color: KK.indigo }}>NEW</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "space-between", fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 3, color: KK.hinoki }}><span>← BACK</span><span>FRONT →</span></div>
    </div>
  </div>;
};

// ---------- CUPÓN: un cupón que se rompe al lado de la listita ----------
export const Cupon: React.FC<{ t: number; at: number; tear: number; out: number; x?: number; y?: number }> = ({ t, at: a0, tear, out, x = 1460, y = 500 }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  const r = ei(t, tear, tear + 0.6);
  const half = (s: number) => <div style={{ position: "absolute", left: 0, top: 0, width: 440, height: 220, clipPath: s < 0 ? "polygon(0 0, 52% 0, 46% 30%, 54% 55%, 47% 100%, 0 100%)" : "polygon(52% 0, 100% 0, 100% 100%, 47% 100%, 54% 55%, 46% 30%)", transform: `translate(${s * r * 90}px, ${r * r * 200}px) rotate(${s * r * 16}deg)`,
    background: "#fff6c8", border: "6px dashed #c9a43a", borderRadius: 10, fontFamily: FONT, fontWeight: 900, fontSize: 52, color: "#9a7a1a", textAlign: "center", lineHeight: "208px" }}>COUPON</div>;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o * (1 - e(t, tear + 0.8, tear + 1.2)), transform: `translate(-50%,-50%) rotate(-5deg) scale(${pop(t, a0)})`, width: 440, height: 220 }}>{half(-1)}{half(1)}</div>;
};

// ---------- BATERÍA DE FRÍO: freezer lleno vs. medio; si se corta la luz: 2 días vs 1 ----------
export const Bateria: React.FC<{ t: number; at: number; power: number; out: number; x?: number; y?: number }> = ({ t, at: a0, power, out, x = 1420, y = 520 }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  const p = e(t, power, power + 0.5);
  const col = (fill: number, days: number, lab: string, i: number) => <div style={{ textAlign: "center", opacity: e(t, a0 + i * 0.3, a0 + i * 0.3 + 0.1), transform: `scale(${pop(t, a0 + i * 0.3)})` }}>
    <div style={{ position: "relative", width: 170, height: 300, borderRadius: 22, background: "#f6f6f2", boxShadow: "0 24px 40px rgba(0,0,0,.55)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 14, right: 14, bottom: 14, height: 272 * fill, borderRadius: 12, background: "linear-gradient(180deg,#bfe8ff,#6fbbe8)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, fontFamily: FONT, fontWeight: 900, fontSize: 64, color: KK.indigo, opacity: p }}>{days}d</div>
    </div>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, color: KK.cream, marginTop: 10, textShadow: extrude(3, "#000") }}>{lab}</div></div>;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", gap: 46, alignItems: "flex-end" }}>
    {col(0.95, 2, "FULL", 0)}{col(0.45, 1, "HALF", 1)}
    <div style={{ position: "absolute", left: "50%", top: -90, transform: "translateX(-50%)", opacity: p, fontFamily: FONT, fontWeight: 900, fontSize: 38, letterSpacing: 3, color: "#ffd27a", whiteSpace: "nowrap", textShadow: extrude(3, "#000") }}>⚡ POWER OUT</div>
  </div>;
};

// ---------- DIAL -18 °C / 0 °F ----------
export const Dial18: React.FC<{ t: number; at: number; f: number; out: number; x?: number; y?: number }> = ({ t, at: a0, f, out, x = 1440, y = 500 }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  const v = -18 * ei(t, a0 + 0.2, a0 + 1.6), ang = -130 + ((v + 30) / 40) * 260, fz = e(t, f, f + 0.3);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${pop(t, a0)})`, textAlign: "center" }}>
    <svg width={400} height={400} viewBox="-200 -200 400 400" style={{ filter: "drop-shadow(0 24px 40px rgba(0,0,0,.6))" }}>
      <circle r={180} fill="#e9eef0" stroke="#9aa0a8" strokeWidth={14} /><circle r={150} fill="#fbfcfd" />
      <path d={`M ${150 * Math.sin(-130 * Math.PI / 180)} ${-150 * Math.cos(-130 * Math.PI / 180)} A 150 150 0 0 1 ${150 * Math.sin(-40 * Math.PI / 180)} ${-150 * Math.cos(-40 * Math.PI / 180)}`} stroke="#6fbbe8" strokeWidth={18} fill="none" />
      {Array.from({ length: 9 }, (_, i) => <line key={i} x1={0} y1={-148} x2={0} y2={-124} stroke={KK.sumi} strokeWidth={5} transform={`rotate(${-130 + i * 32.5})`} />)}
      <line x1={0} y1={14} x2={0} y2={-128} stroke={KK.hanko} strokeWidth={9} strokeLinecap="round" transform={`rotate(${ang})`} /><circle r={16} fill={KK.sumi} />
      <text y={90} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={66} fill={KK.indigo}>{Math.round(v)}°C</text>
    </svg>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 60, color: KK.ice, opacity: fz, textShadow: extrude(5, "#0a2a40") }}>= 0°F</div>
  </div>;
};

// ---------- HELADO BLANDO: la bocha se ablanda arriba (alarma) ----------
export const Helado: React.FC<{ t: number; at: number; out: number; x?: number; y?: number }> = ({ t, at: a0, out, x = 1460, y = 470 }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  const m = e(t, a0 + 0.3, a0 + 2);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${pop(t, a0)})`, textAlign: "center" }}>
    <svg width={300} height={300} viewBox="0 0 300 300"><path d="M 40 120 L 260 120 L 240 280 L 60 280 Z" fill="#f4f1e8" stroke="#cfd3d6" strokeWidth={6} />
      <path d={`M 60 120 Q 150 ${40 - m * 10} 240 120 Q 230 ${150 + m * 50} 200 ${130 + m * 30} Q 170 ${150 + m * 70} 140 ${130 + m * 40} Q 100 ${150 + m * 40} 60 120 Z`} fill="#f7e2c0" /></svg>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, color: m > 0.5 ? "#ff9a7a" : KK.cream, textShadow: extrude(4, "#000") }}>{m > 0.5 ? "SOFT ON TOP = TOO WARM" : "THE ICE CREAM TEST"}</div>
  </div>;
};

// ---------- DOMINGO: la lista del día de cocina con los números que caen ----------
export const Domingo: React.FC<{ t: number; items: [string, string, number][]; out: number; x?: number; y?: number }> = ({ t, items, out, x = 1440, y = 210 }) => {
  if (t < items[0][2] - 0.2) return null;
  const o = e(t, items[0][2] - 0.2, items[0][2]) * (1 - e(t, out, out + 0.3));
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translateX(-50%) rotate(2deg)", width: 560, padding: "24px 36px", background: paper, boxShadow: "0 30px 60px rgba(0,0,0,.55)", borderRadius: 6 }}>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 42, color: KK.hanko, letterSpacing: 3 }}>SUNDAY · 2 HOURS</div>
    {items.map(([n, l, a]) => <div key={l} style={{ display: "flex", gap: 18, alignItems: "baseline", opacity: e(t, a, a + 0.12) }}>
      <div style={{ width: 70, textAlign: "right", fontFamily: FONT, fontWeight: 900, fontSize: 54, color: KK.indigo, transform: `scale(${pop(t, a)})` }}>{n}</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 54, color: KK.sumi }}>{l}</div></div>)}
  </div>;
};

// ---------- DIAGNÓSTICO: ficha "problema → arreglo" que se da vuelta ----------
export const Diagnostico: React.FC<{ t: number; at: number; flip: number; out: number; n: number; prob: string; fix: string; x?: number; y?: number }> = ({ t, at: a0, flip, out, n, prob, fix, x = 1420, y = 500 }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  const f = ei(t, flip, flip + 0.6), front = f < 0.5;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1300, transform: `translate(-50%,-50%) scale(${pop(t, a0)})` }}>
    <div style={{ width: 620, minHeight: 330, padding: "30px 40px", borderRadius: 24, transform: `rotateY(${f * 180 + (front ? 0 : 180)}deg)`, background: front ? "linear-gradient(180deg,#3a2430,#24151d)" : paper, boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 32, letterSpacing: 5, color: front ? "#ff9a7a" : KK.matcha }}>{front ? `PROBLEM ${n}` : "THE FIX"}</div>
      <div style={{ fontFamily: front ? FONT : HAND, fontWeight: front ? 900 : 700, fontSize: front ? 56 : 62, lineHeight: 1.15, color: front ? KK.cream : KK.sumi, marginTop: 12 }}>{front ? prob : fix}</div>
    </div>
  </div>;
};

// ---------- ÁBACO SOROBAN: las cuentas suben con la plata tirada por semana → por año ----------
export const Soroban: React.FC<{ t: number; at: number; year: number; out: number; x?: number; y?: number }> = ({ t, at: a0, year, out, x = 1400, y = 470 }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  const v = t < year ? Math.round(4 * e(t, a0 + 0.2, a0 + 1.4)) : Math.round(4 + 146 * e(t, year, year + 1.6));
  const digits = String(v).padStart(3, "0").split("").map(Number);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${pop(t, a0, 0.9)})`, textAlign: "center" }}>
    <svg width={500} height={330} viewBox="0 0 500 330" style={{ filter: "drop-shadow(0 26px 40px rgba(0,0,0,.6))" }}>
      <rect x={10} y={10} width={480} height={310} rx={20} fill="#5a3a1a" /><rect x={30} y={30} width={440} height={270} rx={10} fill="#e8d4b0" />
      <rect x={30} y={110} width={440} height={12} fill="#5a3a1a" />
      {digits.map((d, i) => { const cx = 120 + i * 130; const five = d >= 5 ? 1 : 0, ones = d % 5;
        return <g key={i}><line x1={cx} y1={30} x2={cx} y2={300} stroke="#3a2410" strokeWidth={6} />
          <ellipse cx={cx} cy={five ? 92 : 56} rx={46} ry={20} fill="#8a4a20" />
          {[0, 1, 2, 3].map((k) => <ellipse key={k} cx={cx} cy={k < ones ? 146 + k * 40 : 186 + k * 40} rx={46} ry={20} fill="#8a4a20" />)}</g>; })}
    </svg>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: t < year ? KK.cream : "#ff9a7a", textShadow: extrude(6, "#000") }}>{t < year ? `${v} DOLLARS / WEEK` : `${v}+ DOLLARS / YEAR`}</div>
  </div>;
};

// ---------- DOS TILDES: la tarea (sólo dos cambios) ----------
export const Tarea: React.FC<{ t: number; ats: number[]; out: number; x?: number; y?: number }> = ({ t, ats, out, x = 1420, y = 300 }) => {
  if (t < ats[0] - 0.05) return null;
  const o = 1 - e(t, out, out + 0.3), lines = ["Freeze rice hot & flat", "A little list on the door"];
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translateX(-50%) rotate(-2deg)", width: 640, padding: "28px 40px", background: paper, boxShadow: "0 30px 60px rgba(0,0,0,.55)" }}>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 40, color: KK.hanko, letterSpacing: 3 }}>HOMEWORK · ONLY 2</div>
    {lines.map((l, i) => { const a = ats[i + 1] ?? ats[0]; const ck = e(t, a + 0.3, a + 0.6); return <div key={l} style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 14, opacity: e(t, a, a + 0.1) }}>
      <svg width={64} height={64} viewBox="0 0 64 64"><rect x={4} y={4} width={56} height={56} rx={8} fill="none" stroke={KK.sumi} strokeWidth={5} /><path d="M 14 34 L 28 48 L 54 14" stroke={KK.hanko} strokeWidth={8} fill="none" strokeLinecap="round" strokeDasharray={70} strokeDashoffset={70 * (1 - ck)} /></svg>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 58, color: KK.sumi }}>{l}</div></div>; })}
  </div>;
};

// ---------- LA PREGUNTA: tarjeta grande con globo de comentario ----------
export const Pregunta: React.FC<{ t: number; at: number; out: number; x?: number; y?: number }> = ({ t, at: a0, out, x = 1430, y = 470 }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  const typ = Math.round(48 * e(t, a0 + 0.4, a0 + 2.6)), q = "What is the oldest thing in YOUR freezer?";
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(-2deg) scale(${pop(t, a0, 0.9)})` }}>
    <div style={{ position: "relative", width: 640, padding: "34px 44px 44px", borderRadius: 40, background: "#fbf6ea", boxShadow: `0 30px 60px rgba(0,0,0,.6), inset 0 0 0 6px ${KK.hanko}` }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 32, letterSpacing: 5, color: KK.hanko }}>💬 TELL ME IN THE COMMENTS</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 78, lineHeight: 1.05, color: KK.sumi, marginTop: 10, minHeight: 250 }}>{q.slice(0, typ)}</div>
      <div style={{ position: "absolute", left: 90, bottom: -46, width: 0, height: 0, borderLeft: "30px solid transparent", borderRight: "30px solid transparent", borderTop: "50px solid #fbf6ea" }} />
    </div>
  </div>;
};

// ---------- PRÓXIMA SEMANA: ficha del próximo video (zanahoria + toalla de papel) ----------
export const Proximo: React.FC<{ t: number; at: number; towel: number; out: number; x?: number; y?: number }> = ({ t, at: a0, towel, out, x = 1440, y = 470 }) => {
  const o = vis(t, a0, out);
  if (o <= 0.01) return null;
  const w = ei(t, towel, towel + 0.8);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1000px) rotateY(-12deg) scale(${pop(t, a0, 0.9)})`, width: 560, padding: "30px 40px", borderRadius: 26, background: dark, textAlign: "center" }}>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, letterSpacing: 6, color: KK.hinoki }}>NEXT WEEK</div>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 56, color: KK.cream, lineHeight: 1.1, margin: "8px 0 14px" }}>The Refrigerator Rules</div>
    <svg width={360} height={160} viewBox="0 0 360 160"><path d="M 40 80 L 300 60 Q 330 80 300 100 Z" fill="#f08a3a" /><path d="M 300 70 l 40 -30 M 304 80 l 46 -6 M 300 92 l 40 26" stroke="#5a9a3a" strokeWidth={8} strokeLinecap="round" />
      <rect x={60 + (1 - w) * 260} y={40} width={250 * w} height={84} rx={8} fill="rgba(250,250,245,.9)" stroke="#d9d6cc" strokeWidth={3} strokeDasharray="6 6" /></svg>
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 50, color: KK.cream, opacity: e(t, towel, towel + 0.3) }}>what a paper towel can do…</div>
  </div>;
};

// ---------- EL TRABAJO DE ALGUIEN: tres sellitos (granjero · pescador · vos) ----------
export const Trabajo: React.FC<{ t: number; ats: number[]; out: number; y?: number }> = ({ t, ats, out, y = 760 }) => {
  if (t < ats[0] - 0.05) return null;
  const o = 1 - e(t, out, out + 0.3), labs = ["THE FARMER", "THE FISHERMAN", "YOU"];
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 40, opacity: o }}>
    {labs.map((l, i) => { const a = ats[i] ?? ats[0]; return <div key={l} style={{ opacity: e(t, a, a + 0.06), transform: `rotate(${(i - 1) * 4}deg) scale(${2 - Math.min(1, spr(t, a, 1.3))})`, padding: "16px 34px", border: `8px solid ${KK.hanko}`, borderRadius: 18, background: "rgba(251,243,226,.85)", fontFamily: SERIF, fontWeight: 900, fontSize: 50, color: KK.hanko }}>{l}</div>; })}
  </div>;
};

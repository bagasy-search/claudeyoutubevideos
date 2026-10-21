// donlupe01 · PIEZAS NUEVAS del resto (minuto 2 al final). Mismo idioma visual que el minuto 1 (barro, maíz, crema, gis, papel de estraza)
// pero cada minuto con piezas propias: letrero de madera, mapa vectorial, campanita, sellos, calendario, recados, cortes, diagramas, tickets…
import React from "react";
import { CH, FONT, HAND, SERIF, e, ei, extrude, spr } from "./lib";

const vis = (t: number, a: number, out: number, fi = 0.12, fo = 0.25) => e(t, a, a + fi) * (1 - e(t, out, out + fo));
const k1 = (t: number, a: number, s = 1) => Math.min(1.1, spr(t, a, s));
const PAPEL = "linear-gradient(180deg,#f3e6c6,#e6d3a8)";
const sombra = "0 30px 60px rgba(0,0,0,.6)";
type B = { t: number; at: number; out: number; x: number; y: number };

// LETRERO de madera que cuelga de dos mecates y se mece (presentación de Don Lupe)
export const Letrero: React.FC<B & { l1: string; l2: string; l2at: number }> = ({ t, at, out, x, y, l1, l2, l2at }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = k1(t, at, 0.8), sw = Math.sin((t - at) * 2.4) * 6 * Math.exp(-(t - at) * 0.9);
  const n2 = Math.round(l2.length * e(t, l2at, l2at + 0.8));
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,0) translateY(${(1 - Math.min(1, k)) * -500}px) rotate(${sw}deg)`, transformOrigin: "50% -120px" }}>
    <svg width={760} height={130} style={{ position: "absolute", left: 0, top: -120 }}><path d="M 120 130 L 380 0 L 640 130" stroke="#7a6040" strokeWidth={6} fill="none" /></svg>
    <div style={{ width: 760, padding: "22px 0 18px", borderRadius: 14, textAlign: "center", background: "repeating-linear-gradient(0deg,#7a4a26 0 18px,#6c4020 18px 22px,#835030 22px 40px)", boxShadow: `${sombra}, inset 0 0 0 6px #4a2a14, inset 0 4px 0 10px rgba(255,220,170,.12)` }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 92, color: CH.maiz, letterSpacing: 4, textShadow: "0 -2px 0 rgba(0,0,0,.6), 0 3px 0 rgba(255,230,180,.25)" }}>{l1}</div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: CH.crema, letterSpacing: 6, minHeight: 40 }}>{l2.slice(0, n2)}</div>
    </div>
  </div>;
};

// MAPA vectorial de México con Michoacán que se enciende y el alfiler del rancho
const MX: [number, number][] = [[-117.1, 32.5], [-114.7, 32.7], [-111, 31.3], [-108.2, 31.3], [-106.5, 31.8], [-104.5, 29.6], [-103, 29], [-101.4, 29.8], [-99.5, 27.5], [-97.1, 25.9], [-97.7, 24], [-97.2, 21.5], [-96, 19.5], [-94.5, 18.2], [-92.5, 18.6], [-90.5, 19.8], [-90.4, 21], [-87.1, 21.5], [-87.5, 19.5], [-88.3, 18.5], [-89.1, 17.8], [-91.4, 17.3], [-90.4, 16.1], [-92.2, 15.2], [-93.9, 16], [-96.5, 15.7], [-98.8, 16.6], [-101.5, 17.6], [-103.5, 18.3], [-105.4, 20.3], [-105.2, 21.5], [-106, 22.8], [-108, 25], [-109.4, 26.3], [-111.2, 28.4], [-112.8, 30.5], [-114.8, 31.7], [-113.5, 29.5], [-112.1, 27.5], [-110.4, 24.2], [-109.4, 23.0], [-110.3, 23.5], [-112.2, 26], [-114.2, 28], [-115.8, 30.4]];
const MICH: [number, number][] = [[-103.7, 18.3], [-102.2, 17.9], [-101.0, 18.0], [-100.1, 18.9], [-100.4, 19.9], [-101.5, 20.2], [-102.6, 20.0], [-103.4, 19.4]];
const pj = ([lo, la]: [number, number]) => [(lo + 118) * 40, (33 - la) * 42] as [number, number];
const pathOf = (pts: [number, number][]) => "M " + pts.map((q) => pj(q).map((v) => v.toFixed(1)).join(" ")).join(" L ") + " Z";
export const Mapa: React.FC<B & { lit: number; pin: number; label: string }> = ({ t, at, out, x, y, lit, pin, label }) => {
  const o = vis(t, at, out, 0.3); if (o <= 0.01) return null;
  const L = 3200, d = e(t, at, at + 1.2), m = e(t, lit, lit + 0.5), pk = k1(t, pin), c = pj([-101.9, 19.1]);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1400px) rotateX(${18 - 8 * d}deg) scale(${0.92 + 0.08 * d})` }}>
    <svg width={1280} height={800} viewBox="0 0 1280 800" style={{ overflow: "visible", filter: "drop-shadow(0 24px 30px rgba(0,0,0,.55))" }}>
      <path d={pathOf(MX)} fill={`rgba(239,224,191,${0.92 * d})`} stroke={CH.tinta} strokeWidth={5} strokeDasharray={L} strokeDashoffset={L * (1 - d)} strokeLinejoin="round" />
      <path d={pathOf(MICH)} fill={CH.barro} opacity={m} stroke={CH.guinda} strokeWidth={4} />
      {m > 0.02 && <circle cx={c[0]} cy={c[1]} r={40 + 120 * e(t, lit, lit + 1.2)} fill="none" stroke={CH.barro} strokeWidth={4} opacity={1 - e(t, lit, lit + 1.2)} />}
      {pk > 0.02 && <g transform={`translate(${c[0]} ${c[1] - (1 - Math.min(1, pk)) * 160})`}>
        <path d="M 0 0 C -10 -18 -26 -30 -26 -50 A 26 26 0 1 1 26 -50 C 26 -30 10 -18 0 0 Z" fill={CH.guinda} stroke="#fff" strokeWidth={4} />
        <circle cx={0} cy={-50} r={9} fill="#fff" />
        <text x={40} y={-60} fontFamily={SERIF} fontWeight={900} fontSize={46} fill={CH.tinta} opacity={e(t, pin + 0.2, pin + 0.5)}>{label}</text>
      </g>}
    </svg>
  </div>;
};

// CAMPANITA: botón SUSCRÍBETE que se aprieta (mano) y la campana suena
export const Campanita: React.FC<B & { click: number; bell: number }> = ({ t, at, out, x, y, click, bell }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = k1(t, at), pr = e(t, click - 0.08, click) * (1 - e(t, click, click + 0.15)), sub = t >= click;
  const ring = t > bell ? Math.sin((t - bell) * 22) * 18 * Math.exp(-(t - bell) * 2.2) : 0, hand = e(t, click - 0.6, click - 0.1) * (1 - e(t, click + 0.3, click + 0.7));
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.5 + 0.5 * Math.min(1, k)})`, display: "flex", alignItems: "center", gap: 34 }}>
    <div style={{ position: "relative", padding: "26px 54px", borderRadius: 16, background: sub ? "linear-gradient(180deg,#6a6a6a,#4a4a4a)" : "linear-gradient(180deg,#e0332a,#b3221a)", transform: `translateY(${pr * 8}px)`, boxShadow: `0 ${18 - pr * 12}px 0 ${sub ? "#2e2e2e" : "#7a140e"}, ${sombra}`, fontFamily: FONT, fontWeight: 900, fontSize: 58, color: "#fff", letterSpacing: 3 }}>
      {sub ? "SUSCRITO ✓" : "SUSCRÍBETE"}
      {hand > 0.01 && <svg width={120} height={140} viewBox="0 0 60 70" style={{ position: "absolute", right: -40, bottom: -110 + (1 - hand) * -60, opacity: hand }}><path d="M 22 4 Q 28 0 30 8 L 30 30 L 40 30 Q 48 32 48 42 L 46 60 Q 42 68 30 68 L 22 68 Q 12 64 8 52 L 4 40 Q 4 34 12 36 L 18 42 L 18 8 Q 18 4 22 4 Z" fill="#f6dcc0" stroke="#3b2414" strokeWidth={2.5} /></svg>}
    </div>
    <svg width={150} height={160} viewBox="0 0 60 64" style={{ transform: `rotate(${ring}deg)`, transformOrigin: "50% 8%", filter: "drop-shadow(0 12px 18px rgba(0,0,0,.6))" }}>
      <path d="M 30 4 Q 34 4 34 8 Q 48 12 48 30 L 48 42 L 54 50 L 6 50 L 12 42 L 12 30 Q 12 12 26 8 Q 26 4 30 4 Z" fill={t > bell ? CH.maiz : CH.crema} stroke={CH.tinta} strokeWidth={3} />
      <circle cx={30} cy={56} r={6} fill={CH.maiz} stroke={CH.tinta} strokeWidth={3} />
      {t > bell && [0, 1].map((i) => <path key={i} d={i ? "M 54 14 Q 60 24 56 34" : "M 6 14 Q 0 24 4 34"} stroke={CH.maiz} strokeWidth={3} fill="none" opacity={1 - e(t, bell + 0.6, bell + 1)} />)}
    </svg>
  </div>;
};

// LISTA a mano en papel de estraza con palomitas que se dibujan
export const Lista: React.FC<B & { title?: string; rows: { at: number; text: string; sub?: string }[]; w?: number; tick?: boolean }> = ({ t, at, out, x, y, title, rows, w = 620, tick = true }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = k1(t, at, 0.9);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1300 }}>
    <div style={{ width: w, padding: "26px 34px 30px", background: PAPEL, borderRadius: 6, boxShadow: sombra, transform: `rotateY(${(1 - Math.min(1, k)) * -60 - 6}deg) rotateZ(-1.5deg)`, transformOrigin: "0 50%" }}>
      {title && <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 40, color: CH.guinda, letterSpacing: 3, borderBottom: `3px solid ${CH.tinta}33`, paddingBottom: 8, marginBottom: 10 }}>{title}</div>}
      {rows.map((r, i) => { const a = e(t, r.at, r.at + 0.2); const L = 60; const d = e(t, r.at + 0.1, r.at + 0.35);
        return <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, opacity: 0.15 + 0.85 * a, transform: `translateX(${(1 - a) * 30}px)`, minHeight: 66 }}>
          {tick && <svg width={46} height={46} viewBox="0 0 46 46"><rect x={3} y={3} width={40} height={40} rx={6} fill="none" stroke={CH.tinta} strokeWidth={3} /><path d="M 10 24 L 20 34 L 38 10" fill="none" stroke={CH.guinda} strokeWidth={6} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - d)} /></svg>}
          <div><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 50, color: CH.tinta, lineHeight: 1 }}>{r.text}</div>{r.sub && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, color: CH.guinda, letterSpacing: 2 }}>{r.sub}</div>}</div>
        </div>; })}
    </div>
  </div>;
};

// SELLO de goma que cae y golpea (tinta guinda, borde irregular)
export const Sello: React.FC<B & { text: string; rot?: number; col?: string; size?: number }> = ({ t, at, out, x, y, text, rot = -8, col = CH.guinda, size = 64 }) => {
  const o = vis(t, at, out, 0.06); if (o <= 0.01) return null;
  const k = e(t, at, at + 0.12), sq = t > at + 0.12 ? 1 + 0.06 * Math.exp(-(t - at - 0.12) * 12) : 1;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${(2.2 - 1.2 * k) * sq})` }}>
    <div style={{ padding: "10px 30px", border: `7px solid ${col}`, borderRadius: 12, fontFamily: SERIF, fontWeight: 900, fontSize: size, color: col, letterSpacing: 5, background: "rgba(246,231,200,.12)", whiteSpace: "nowrap",
      WebkitMaskImage: "radial-gradient(circle at 30% 40%, #000 60%, rgba(0,0,0,.75) 61%, #000 75%)", textShadow: "0 0 1px rgba(0,0,0,.2)", boxShadow: "0 0 0 2px rgba(0,0,0,.05)" } as React.CSSProperties}>{text}</div>
  </div>;
};

// CALENDARIO de pared: hojas por día; cada día se tacha con gis a su segundo
export const Calendario: React.FC<B & { days: { at: number; d: string; n?: string }[]; hi?: number }> = ({ t, at, out, x, y, days, hi = -1 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = k1(t, at);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * Math.min(1, k)})`, display: "flex", gap: 22 }}>
    {days.map((d, i) => { const on = e(t, d.at, d.at + 0.2), L = 120;
      return <div key={i} style={{ width: 180, borderRadius: 10, overflow: "hidden", background: "#fbf4e4", boxShadow: sombra, transform: `translateY(${(1 - on) * 30}px) rotate(${(i - 1) * 2}deg)`, opacity: 0.35 + 0.65 * on, outline: i === hi ? `6px solid ${CH.maiz}` : undefined }}>
        <div style={{ background: CH.guinda, color: CH.crema, fontFamily: FONT, fontWeight: 900, fontSize: 34, letterSpacing: 4, textAlign: "center", padding: "8px 0" }}>{d.d}</div>
        <div style={{ position: "relative", height: 130, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HAND, fontWeight: 700, fontSize: 44, color: CH.tinta, textAlign: "center", lineHeight: 1 }}>{d.n}
          {i !== hi && <svg width={180} height={130} style={{ position: "absolute", inset: 0 }}><path d="M 30 20 L 150 110" stroke={CH.barro} strokeWidth={8} strokeLinecap="round" strokeDasharray={L * 1.4} strokeDashoffset={L * 1.4 * (1 - e(t, d.at + 0.35, d.at + 0.6))} opacity={0.8} /></svg>}
        </div>
      </div>; })}
  </div>;
};

// RECADO del abuelo: tarjeta vieja con comillas grandes; la frase aparece palabra por palabra
export const Dicho: React.FC<B & { text: string; firma: string; dur?: number; w?: number }> = ({ t, at, out, x, y, text, firma, dur = 2.5, w = 980 }) => {
  const o = vis(t, at, out, 0.2); if (o <= 0.01) return null;
  const ws = text.split(" "), n = Math.ceil(ws.length * e(t, at + 0.2, at + 0.2 + dur));
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(-1deg) translateY(${(1 - e(t, at, at + 0.4)) * 40}px)` }}>
    <div style={{ position: "relative", width: w, padding: "50px 70px 40px", background: PAPEL, borderRadius: 4, boxShadow: `${sombra}, inset 0 0 80px rgba(120,80,30,.35)` }}>
      <div style={{ position: "absolute", left: 22, top: -40, fontFamily: SERIF, fontWeight: 900, fontSize: 200, color: CH.barro, lineHeight: 1 }}>“</div>
      <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 56, color: CH.tinta, lineHeight: 1.25 }}>{ws.map((x, i) => <span key={i} style={{ opacity: i < n ? 1 : 0 }}>{x} </span>)}</div>
      <div style={{ marginTop: 18, textAlign: "right", fontFamily: HAND, fontWeight: 700, fontSize: 50, color: CH.guinda, opacity: e(t, at + dur, at + dur + 0.4) }}>— {firma}</div>
    </div>
  </div>;
};

// PLACA del secreto: tabla tallada que baja girando con polvito; número enorme y el nombre
export const PlacaSecreto: React.FC<B & { n: number; name: string; sub?: string; subAt?: number }> = ({ t, at, out, x, y, n, name, sub, subAt = 1e9 }) => {
  const o = vis(t, at, out, 0.1); if (o <= 0.01) return null;
  const k = k1(t, at, 0.85), dust = e(t, at + 0.15, at + 0.9);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1400 }}>
    <div style={{ transform: `translate(-50%,-50%) rotateX(${(1 - Math.min(1, k)) * 85}deg) translateZ(${(1 - Math.min(1, k)) * 300}px)`, transformOrigin: "50% 0", textAlign: "center" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 30, padding: "24px 50px", borderRadius: 18, background: "repeating-linear-gradient(90deg,#7a4a26 0 26px,#6c4020 26px 30px,#835030 30px 60px)", boxShadow: `${sombra}, inset 0 0 0 7px #4a2a14` }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 40, color: CH.crema, letterSpacing: 8, writingMode: "vertical-rl", transform: "rotate(180deg)" }}>SECRETO</div>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 200, color: CH.maiz, lineHeight: 0.9, textShadow: extrude(10, "#3a1e0c") }}>{n}</div>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 78, color: CH.crema, letterSpacing: 2, textShadow: extrude(5, "#2a140a"), textAlign: "left", maxWidth: 760, lineHeight: 1 }}>{name}</div>
      </div>
      {sub && <div style={{ marginTop: 22, fontFamily: HAND, fontWeight: 700, fontSize: 58, color: CH.crema, textShadow: "0 3px 12px #000", opacity: e(t, subAt, subAt + 0.3) }}>{sub}</div>}
      {dust > 0 && dust < 1 && Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: "absolute", left: `${(i * 37) % 100}%`, top: "92%", width: 12, height: 12, borderRadius: 6, background: "rgba(220,200,170,.6)", transform: `translate(${(i % 2 ? 1 : -1) * dust * 90}px, ${dust * 60 - dust * dust * 30}px)`, opacity: 1 - dust }} />)}
    </div>
  </div>;
};

// CORTES del animal: silueta vectorial con zonas que se encienden a su segundo (borrego o res)
const BORREGO = "M 120 170 Q 90 120 130 95 Q 150 60 200 70 Q 260 50 330 62 Q 420 50 500 70 Q 560 60 600 95 Q 640 90 660 70 Q 690 60 700 85 Q 712 110 690 130 Q 680 160 650 170 L 640 260 L 612 260 L 600 190 Q 520 205 420 200 Q 320 210 240 195 L 220 262 L 192 262 L 180 190 Q 140 195 120 170 Z";
export const Cortes: React.FC<B & { kind: "borrego" | "res"; zones: { at: number; label: string; d: string; lx: number; ly: number }[] }> = ({ t, at, out, x, y, kind, zones }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = k1(t, at);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * Math.min(1, k)})` }}>
    <svg width={820} height={420} viewBox="40 20 740 300" style={{ overflow: "visible", filter: "drop-shadow(0 20px 26px rgba(0,0,0,.6))" }}>
      <path d={kind === "borrego" ? BORREGO : BORREGO} fill={kind === "borrego" ? "#efe4cf" : "#8a4a30"} stroke={CH.tinta} strokeWidth={5} />
      {zones.map((z, i) => { const on = e(t, z.at, z.at + 0.25); return <g key={i} opacity={on}>
        <path d={z.d} fill={CH.barro} opacity={0.85} stroke={CH.guinda} strokeWidth={4} />
        <text x={z.lx} y={z.ly} fontFamily={SERIF} fontWeight={900} fontSize={34} fill={CH.crema} stroke="#2a120c" strokeWidth={6} paintOrder="stroke" textAnchor="middle">{z.label}</text>
      </g>; })}
    </svg>
  </div>;
};

// DE DURO A GELATINA: barra con el cubo de nervio que se ablanda (tiembla) mientras corren las horas de vapor
export const Gelatina: React.FC<B & { soft: number; dur?: number }> = ({ t, at, out, x, y, soft, dur = 3 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const s = ei(t, soft, soft + dur), wob = s > 0.05 ? Math.sin(t * 14) * 0.06 * s : 0;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * Math.min(1, k1(t, at))})`, textAlign: "center" }}>
    <div style={{ width: 220, height: 200, margin: "0 auto 30px", borderRadius: 18 + 40 * s, background: `linear-gradient(160deg, rgba(${200 - 20 * s},${120 + 60 * s},${90 + 60 * s},${1 - 0.35 * s}), rgba(${150},${60 + 40 * s},${40 + 40 * s},${1 - 0.3 * s}))`, transform: `scale(${1 + wob}, ${1 - wob})`, transformOrigin: "50% 100%", boxShadow: `inset 0 10px 30px rgba(255,255,255,${0.15 + 0.45 * s}), ${sombra}` }} />
    <div style={{ position: "relative", width: 640, height: 26, borderRadius: 13, background: "rgba(0,0,0,.45)", boxShadow: "inset 0 0 0 3px rgba(255,255,255,.3)" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${s * 100}%`, borderRadius: 13, background: `linear-gradient(90deg,${CH.barro},${CH.maiz})` }} />
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", width: 640, marginTop: 10, fontFamily: FONT, fontWeight: 900, fontSize: 36, letterSpacing: 3, textShadow: "0 3px 10px #000" }}>
      <span style={{ color: s < 0.5 ? "#ff6a4a" : "rgba(246,231,200,.5)" }}>NERVIO DURO</span><span style={{ color: s > 0.5 ? CH.maiz : "rgba(246,231,200,.5)" }}>GELATINA</span>
    </div>
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 48, color: CH.crema, marginTop: 6, textShadow: "0 3px 10px #000" }}>{Math.round(s * 5)} horas de vapor</div>
  </div>;
};

// CORTE de la carne con la grasa como COBIJA arriba: gotas que bajan bañándola
export const Cobija: React.FC<B & { melt: number }> = ({ t, at, out, x, y, melt }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const m = e(t, melt, melt + 0.6);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * Math.min(1, k1(t, at))})` }}>
    <svg width={700} height={460} viewBox="0 0 700 460" style={{ filter: "drop-shadow(0 22px 26px rgba(0,0,0,.6))", overflow: "visible" }}>
      <path d="M 80 200 Q 90 150 160 140 L 540 140 Q 620 150 620 200 L 610 380 Q 600 420 540 420 L 160 420 Q 96 420 90 380 Z" fill="#9a3a24" stroke="#4a1a10" strokeWidth={5} />
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M ${110 + i * 55} 190 Q ${130 + i * 55} 300 ${105 + i * 55} 400`} stroke="#6a2414" strokeWidth={4} fill="none" opacity={0.5} />)}
      <path d="M 70 170 Q 80 100 170 96 L 530 96 Q 630 100 632 170 Q 600 150 540 152 L 160 152 Q 100 150 70 170 Z" fill="#f4ead8" stroke="#bfae90" strokeWidth={4} />
      <text x={350} y={80} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={44} fill={CH.crema} stroke="#2a120c" strokeWidth={7} paintOrder="stroke">LA GRASA = COBIJA</text>
      {m > 0 && Array.from({ length: 7 }, (_, i) => { const ph = ((t - melt) * 0.8 + i * 0.37) % 1; return <ellipse key={i} cx={140 + i * 70} cy={160 + ph * 230} rx={9} ry={13} fill="#ffe9a8" opacity={m * Math.sin(ph * Math.PI) * 0.95} />; })}
    </svg>
  </div>;
};

// CORTE: cubito (todo orilla, se seca) contra el pedazo grande (centro jugoso)
export const CuboCorte: React.FC<B & { big: number }> = ({ t, at, out, x, y, big }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const b = k1(t, big), sl = (sz: number, crust: number, lab: string, col: string, s: number) => <div style={{ textAlign: "center", transform: `scale(${s})`, opacity: s > 0.02 ? 1 : 0 }}>
    <div style={{ width: sz, height: sz, borderRadius: sz * 0.12, margin: "0 auto", background: `radial-gradient(circle, #e0766a 0%, #c9584a ${Math.max(0, 100 - crust * 2 - 20)}%, #6a2a16 ${100 - crust * 2}%, #4a1a0c 100%)`, boxShadow: sombra }} />
    <div style={{ marginTop: 16, fontFamily: FONT, fontWeight: 900, fontSize: 34, color: col, letterSpacing: 3, textShadow: "0 3px 10px #000" }}>{lab}</div>
  </div>;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", alignItems: "flex-end", gap: 90 }}>
    {sl(150, 34, "MUCHA ORILLA · SE SECA", "#ff6a4a", Math.min(1, k1(t, at)))}
    {sl(380, 9, "CENTRO JUGOSO", CH.maiz, Math.min(1, b))}
  </div>;
};

// TICKET de la carnicería: renglones de texto libre con precio y un total
export const Ticket: React.FC<B & { title: string; rows: { at: number; l: string; r: string }[]; total?: { at: number; l: string; r: string }; sc?: number }> = ({ t, at, out, x, y, title, rows, total, sc = 1 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const shown = rows.filter((r) => t >= r.at - 0.05), H = 110 + shown.length * 58 + (total && t >= total.at ? 96 : 0);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1300, transform: `scale(${sc})`, transformOrigin: "0 0" }}>
    <div style={{ transform: `rotateY(-14deg) rotateZ(1.5deg) translateY(${(1 - e(t, at, at + 0.3)) * -60}px)`, width: 520, height: H, background: "linear-gradient(180deg,#fbfaf6,#efece3)", borderRadius: 4, boxShadow: sombra, padding: "26px 30px", fontFamily: "'Courier New', monospace", color: "#222", overflow: "hidden",
      WebkitMaskImage: "linear-gradient(180deg, #000 calc(100% - 14px), transparent)" } as React.CSSProperties}>
      <div style={{ fontWeight: 900, fontSize: 30, letterSpacing: 3, textAlign: "center", borderBottom: "2px dashed #999", paddingBottom: 10, marginBottom: 10 }}>{title}</div>
      {shown.map((r, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 30, fontWeight: 700, lineHeight: "58px", opacity: e(t, r.at, r.at + 0.15) }}><span>{r.l}</span><span>{r.r}</span></div>)}
      {total && t >= total.at && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 40, fontWeight: 900, borderTop: "2px dashed #999", marginTop: 10, paddingTop: 14, color: "#b3261e", transform: `scale(${Math.min(1.06, spr(t, total.at))})`, transformOrigin: "0 50%" }}><span>{total.l}</span><span>{total.r}</span></div>}
    </div>
  </div>;
};

// BLOQUE CONGELADO tachado → "2 días en el refri"
export const Congelada: React.FC<B & { fix: number }> = ({ t, at, out, x, y, fix }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const f = e(t, fix, fix + 0.4), L = 300, cr = e(t, at + 0.5, at + 0.75);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * Math.min(1, k1(t, at))})`, textAlign: "center" }}>
    <div style={{ position: "relative", width: 300, height: 240, margin: "0 auto" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 22, background: `linear-gradient(150deg, rgba(220,240,255,${0.95 - 0.6 * f}), rgba(150,190,220,${0.9 - 0.6 * f}))`, boxShadow: `inset 0 0 40px rgba(255,255,255,.8), ${sombra}` }} />
      <div style={{ position: "absolute", left: 50, top: 50, width: 200, height: 140, borderRadius: 30, background: `rgb(${150 + 50 * f},${70 + 20 * f},${70 + 10 * f})`, opacity: 0.7 + 0.3 * f }} />
      <svg width={300} height={240} style={{ position: "absolute", inset: 0 }}><path d="M 20 20 L 280 220 M 280 20 L 20 220" stroke="#e0332a" strokeWidth={18} strokeLinecap="round" strokeDasharray={L * 2} strokeDashoffset={L * 2 * (1 - cr)} opacity={1 - f} /></svg>
    </div>
    <div style={{ marginTop: 20, fontFamily: FONT, fontWeight: 900, fontSize: 44, letterSpacing: 3, color: f > 0.5 ? CH.maiz : "#ff6a4a", textShadow: "0 3px 12px #000" }}>{f > 0.5 ? "2 DÍAS ANTES · EN EL REFRI" : "CONGELADA AL FUEGO"}</div>
  </div>;
};

// SAL Y JUGO (ósmosis contada a lo ranchero): primero el jugo SALE, con las horas VUELVE a entrar con la sal
export const SalJugo: React.FC<B & { a1: number; a2: number; a3: number }> = ({ t, at, out, x, y, a1, a2, a3 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const s1 = e(t, a1, a1 + 0.5), s2 = e(t, a2, a2 + 0.6), s3 = e(t, a3, a3 + 1.2);
  const dirIn = t >= a2 + 0.6;
  const grains = Array.from({ length: 26 }, (_, i) => { const ang = (i / 26) * Math.PI * 2, r = 200 - 170 * s3 * ((i % 3) / 3 + 0.4); return [300 + Math.cos(ang) * r * 1.3, 210 + Math.sin(ang) * r * 0.75] as [number, number]; });
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * Math.min(1, k1(t, at))})` }}>
    <svg width={600} height={420} viewBox="0 0 600 420" style={{ overflow: "visible", filter: "drop-shadow(0 22px 26px rgba(0,0,0,.6))" }}>
      <ellipse cx={300} cy={210} rx={270} ry={165} fill="#b2432c" stroke="#4a1a10" strokeWidth={6} />
      <ellipse cx={300} cy={210} rx={200} ry={115} fill="#c9584a" opacity={0.6 + 0.4 * s3} />
      {grains.map(([gx, gy], i) => <rect key={i} x={gx - 6} y={gy - 6} width={12} height={12} rx={2} fill="#fff" opacity={0.9 * s1} transform={`rotate(${i * 37} ${gx} ${gy})`} />)}
      {Array.from({ length: 8 }, (_, i) => { const ang = (i / 8) * Math.PI * 2, ph = ((t * 0.9 + i * 0.13) % 1); const r0 = dirIn ? 330 - ph * 160 : 190 + ph * 140;
        return <g key={i} opacity={(dirIn ? s2 : s1 * (1 - s2 * 0.0)) * Math.sin(ph * Math.PI)}><circle cx={300 + Math.cos(ang) * r0 * 1.0} cy={210 + Math.sin(ang) * r0 * 0.62} r={11} fill={dirIn ? CH.maiz : "#ffd0b0"} /></g>; })}
      <text x={300} y={-14} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={46} fill={dirIn ? CH.maiz : "#ff8a6a"} stroke="#2a120c" strokeWidth={7} paintOrder="stroke">{t < a2 ? "EL JUGO SALE" : t < a3 ? "TODA LA NOCHE…" : "VUELVE CON LA SAL"}</text>
    </svg>
  </div>;
};

// CUCHARADAS de sal de grano: una por kilo
export const Cucharas: React.FC<B & { hits: number[]; label: string; labAt: number }> = ({ t, at, out, x, y, hits, label, labAt }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", textAlign: "center" }}>
    <div style={{ display: "flex", gap: 30, justifyContent: "center" }}>{hits.map((h, i) => { const k = Math.min(1, k1(t, h)); return <svg key={i} width={200} height={300} viewBox="0 0 100 150" style={{ opacity: k > 0.02 ? 1 : 0, transform: `translateY(${(1 - k) * -200}px) rotate(${-12 + i * 12}deg)`, filter: "drop-shadow(0 16px 18px rgba(0,0,0,.6))" }}>
      <rect x={44} y={60} width={12} height={88} rx={6} fill="#6a4a2a" /><ellipse cx={50} cy={36} rx={34} ry={30} fill="#8a6a44" stroke="#3b2414" strokeWidth={3} />
      {Array.from({ length: 12 }, (_, g) => <rect key={g} x={28 + (g % 4) * 12} y={22 + Math.floor(g / 4) * 10} width={8} height={8} rx={1.5} fill="#fff" transform={`rotate(${g * 29} ${32 + (g % 4) * 12} ${26 + Math.floor(g / 4) * 10})`} />)}
    </svg>; })}</div>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: CH.maiz, textShadow: extrude(6, "#3a1e0c"), opacity: e(t, labAt, labAt + 0.3) }}>{label}</div>
  </div>;
};

// RELOJ de pared: la manecilla corre de una hora a otra; noche/día en la carátula
export const Reloj: React.FC<B & { h0: number; h1: number; run: number; dur?: number; label: string; labAt?: number; noche?: boolean }> = ({ t, at, out, x, y, h0, h1, run, dur = 2.2, label, labAt = run, noche = true }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = ei(t, run, run + dur), h = h0 + (((h1 - h0 + 24) % 24) || 24) * k, ang = (h % 12) * 30;
  const hh = Math.floor(h % 24), lab = `${((hh + 11) % 12) + 1}:00 ${hh < 12 ? "AM" : "PM"}`;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * Math.min(1, k1(t, at))})`, textAlign: "center" }}>
    <svg width={380} height={380} viewBox="0 0 200 200" style={{ filter: "drop-shadow(0 22px 26px rgba(0,0,0,.6))" }}>
      <circle cx={100} cy={100} r={94} fill={noche ? "#1a2238" : "#f3e6c6"} stroke={CH.barro} strokeWidth={10} />
      <path d={`M 100 100 L 100 10 A 90 90 0 ${((h - h0 + 24) % 24) * 30 > 180 ? 1 : 0} 1 ${100 + 90 * Math.sin(((h - h0) * 30 * Math.PI) / 180 + (h0 % 12) * Math.PI / 6)} ${100 - 90 * Math.cos(((h - h0) * 30 * Math.PI) / 180 + (h0 % 12) * Math.PI / 6)} Z`} fill={CH.maiz} opacity={0} />
      {Array.from({ length: 12 }, (_, i) => <rect key={i} x={98} y={14} width={4} height={i % 3 ? 10 : 18} fill={noche ? CH.crema : CH.tinta} transform={`rotate(${i * 30} 100 100)`} />)}
      <line x1={100} y1={100} x2={100} y2={46} stroke={CH.maiz} strokeWidth={8} strokeLinecap="round" transform={`rotate(${ang} 100 100)`} />
      <line x1={100} y1={100} x2={100} y2={24} stroke={noche ? CH.crema : CH.tinta} strokeWidth={4} strokeLinecap="round" transform={`rotate(${(h % 1) * 360} 100 100)`} />
      <circle cx={100} cy={100} r={8} fill={CH.barro} />
    </svg>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 56, color: CH.crema, textShadow: extrude(5, "#000"), marginTop: -6 }}>{lab}</div>
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: CH.maiz, textShadow: "0 3px 12px #000", opacity: e(t, labAt, labAt + 0.3) }}>{label}</div>
  </div>;
};

// CHILES contados: guajillos largos y anchos anchos, caen en fila
const Chile: React.FC<{ kind: "g" | "a" }> = ({ kind }) => kind === "g"
  ? <svg width={60} height={150} viewBox="0 0 30 75"><path d="M 15 4 Q 24 20 22 44 Q 20 66 13 72 Q 8 60 8 40 Q 8 18 15 4 Z" fill="#8a1a14" stroke="#3a0a06" strokeWidth={1.5} /><path d="M 15 4 L 15 -2" stroke="#5a7a2a" strokeWidth={3} /></svg>
  : <svg width={90} height={120} viewBox="0 0 45 60"><path d="M 22 4 Q 42 10 40 32 Q 36 54 22 58 Q 6 52 5 30 Q 5 10 22 4 Z" fill="#3a0e0a" stroke="#1a0402" strokeWidth={1.5} /><path d="M 22 4 L 22 -2" stroke="#5a7a2a" strokeWidth={3} /></svg>;
export const Chiles: React.FC<B & { gAt: number; aAt: number }> = ({ t, at, out, x, y, gAt, aAt }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const row = (n: number, a0: number, kind: "g" | "a", lab: string) => <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 18 }}>
    {Array.from({ length: n }, (_, i) => { const k = Math.min(1, k1(t, a0 + i * 0.07)); return <div key={i} style={{ opacity: k > 0.02 ? 1 : 0, transform: `translateY(${(1 - k) * -120}px) rotate(${(i % 3 - 1) * 8}deg)`, filter: "drop-shadow(0 8px 10px rgba(0,0,0,.6))" }}><Chile kind={kind} /></div>; })}
    <div style={{ marginLeft: 22, fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: CH.crema, textShadow: extrude(6, "#2a120c"), opacity: e(t, a0 + n * 0.07, a0 + n * 0.07 + 0.3) }}>{n} {lab}</div>
  </div>;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o }}>{row(8, gAt, "g", "GUAJILLO")}{row(3, aAt, "a", "ANCHO")}</div>;
};

// COMAL: cronómetro de arco que marca la zona buena 10–20 s por lado
export const Comal: React.FC<B & { run: number }> = ({ t, at, out, x, y, run }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const sec = Math.min(25, Math.max(0, (t - run) * 6)), ang = (sec / 25) * 300 - 150, R = 150;
  const arc = (a0: number, a1: number) => { const p = (a: number) => [180 + R * Math.sin((a * Math.PI) / 180), 190 - R * Math.cos((a * Math.PI) / 180)]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return `M ${x0} ${y0} A ${R} ${R} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`; };
  const good = sec >= 10 && sec <= 20;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * Math.min(1, k1(t, at))})`, textAlign: "center" }}>
    <svg width={360} height={300} viewBox="0 0 360 300" style={{ filter: "drop-shadow(0 18px 22px rgba(0,0,0,.6))" }}>
      <path d={arc(-150, 150)} stroke="rgba(0,0,0,.5)" strokeWidth={30} fill="none" strokeLinecap="round" />
      <path d={arc(-150 + 120, -150 + 240)} stroke={CH.nopal} strokeWidth={30} fill="none" />
      <path d={arc(-150 + 240, 150)} stroke="#e0332a" strokeWidth={30} fill="none" strokeLinecap="round" />
      <line x1={180} y1={190} x2={180 + 130 * Math.sin((ang * Math.PI) / 180)} y2={190 - 130 * Math.cos((ang * Math.PI) / 180)} stroke={CH.crema} strokeWidth={8} strokeLinecap="round" />
      <circle cx={180} cy={190} r={14} fill={CH.crema} />
      <text x={180} y={270} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill={good ? "#a8d86a" : sec > 20 ? "#ff6a4a" : CH.crema}>{Math.floor(sec)} s</text>
    </svg>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 38, color: CH.maiz, letterSpacing: 3, textShadow: "0 3px 10px #000" }}>10 A 20 SEGUNDOS POR LADO</div>
  </div>;
};

// RECETA en tarjeta de cocina (renglones con cantidad a mano); se escribe al ritmo de la voz
export const Receta: React.FC<B & { title: string; rows: { at: number; q: string; i: string }[]; w?: number }> = ({ t, at, out, x, y, title, rows, w = 640 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = k1(t, at, 0.9);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1300 }}>
    <div style={{ width: w, padding: "22px 30px 26px", borderRadius: 8, boxShadow: sombra, transform: `rotateX(${(1 - Math.min(1, k)) * 70}deg) rotateZ(1deg)`, transformOrigin: "50% 0",
      background: `repeating-linear-gradient(180deg, #fbf6ea 0 55px, #c9d6e8 55px 57px)`, borderTop: `14px solid ${CH.barro}` }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 38, color: CH.guinda, letterSpacing: 2, marginBottom: 6 }}>{title}</div>
      {rows.map((r, i) => <div key={i} style={{ display: "flex", gap: 18, alignItems: "baseline", height: 57, opacity: e(t, r.at, r.at + 0.2), transform: `translateX(${(1 - e(t, r.at, r.at + 0.2)) * 20}px)` }}>
        <span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 50, color: CH.guinda, minWidth: 120, textAlign: "right" }}>{r.q}</span>
        <span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 48, color: CH.tinta }}>{r.i}</span></div>)}
    </div>
  </div>;
};

// MEDIDOR de aguja: AGUADO ↔ ESPESO, se clava en "como pasta"
export const Medidor: React.FC<B & { run: number; l: string; r: string; lab: string }> = ({ t, at, out, x, y, run, l, r, lab }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = ei(t, run, run + 1.2), ang = -70 + 130 * k + Math.sin(t * 30) * 3 * (1 - e(t, run + 1.2, run + 1.6));
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * Math.min(1, k1(t, at))})`, textAlign: "center" }}>
    <svg width={460} height={280} viewBox="0 0 460 280" style={{ filter: "drop-shadow(0 18px 22px rgba(0,0,0,.6))" }}>
      <path d="M 30 250 A 200 200 0 0 1 430 250 Z" fill={CH.papel} stroke={CH.tinta} strokeWidth={6} />
      <path d="M 70 250 A 160 160 0 0 1 150 112" stroke="#6aa7d8" strokeWidth={26} fill="none" /><path d="M 310 112 A 160 160 0 0 1 390 250" stroke={CH.barro} strokeWidth={26} fill="none" />
      <text x={74} y={150} fontFamily={FONT} fontWeight={900} fontSize={26} fill="#3a6a98">{l}</text><text x={386} y={150} textAnchor="end" fontFamily={FONT} fontWeight={900} fontSize={26} fill={CH.guinda}>{r}</text>
      <line x1={230} y1={250} x2={230} y2={80} stroke={CH.tinta} strokeWidth={8} strokeLinecap="round" transform={`rotate(${ang} 230 250)`} /><circle cx={230} cy={250} r={16} fill={CH.tinta} />
    </svg>
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 60, color: CH.maiz, textShadow: "0 3px 12px #000", opacity: e(t, run + 1, run + 1.3) }}>{lab}</div>
  </div>;
};

// MAGUEY vectorial: una penca se separa del resto (la hoja carnosa), con sus espinas en la orilla
export const Maguey2D: React.FC<B & { pick: number; esp: number }> = ({ t, at, out, x, y, pick, esp }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const p = ei(t, pick, pick + 0.9), s = e(t, esp, esp + 0.3);
  const leaf = (a: number, L: number, i: number, sel = false) => <path key={i} d={`M 0 0 Q ${-30} ${-L * 0.5} 0 ${-L} Q ${30} ${-L * 0.5} 0 0 Z`} fill={sel ? "#7aa05a" : "#5a8a6a"} stroke="#2a4a34" strokeWidth={3} transform={`rotate(${a})`} />;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * Math.min(1, k1(t, at))})` }}>
    <svg width={700} height={520} viewBox="-350 -480 700 520" style={{ overflow: "visible", filter: "drop-shadow(0 20px 24px rgba(0,0,0,.6))" }}>
      {[-70, -50, -30, -12, 12, 30, 50, 70].map((a, i) => leaf(a, 300 + (i % 3) * 60, i))}
      <g transform={`translate(${p * 220} ${-p * 60}) rotate(${-40 + p * 40})`}>{leaf(0, 380, 99, true)}
        {s > 0 && Array.from({ length: 8 }, (_, i) => { const yy = -40 - i * 42, xx = 14 + 6 * Math.sin((i / 8) * Math.PI); return <g key={i} opacity={s}><path d={`M ${xx} ${yy} l 14 -6 l -10 12 Z`} fill="#e0332a" /><path d={`M ${-xx} ${yy} l -14 -6 l 10 12 Z`} fill="#e0332a" /></g>; })}
      </g>
      <text x={250} y={-420} fontFamily={SERIF} fontWeight={900} fontSize={54} fill={CH.crema} stroke="#2a120c" strokeWidth={7} paintOrder="stroke" opacity={p}>LA PENCA</text>
      <text x={250} y={-360} fontFamily={FONT} fontWeight={900} fontSize={30} fill="#ff6a4a" stroke="#2a120c" strokeWidth={6} paintOrder="stroke" opacity={s}>FUERA ESPINAS</text>
    </svg>
  </div>;
};

// CRUDA ✕ / ASADA ✓ (dos hojas lado a lado)
export const CrudaAsada: React.FC<B & { a2: number }> = ({ t, at, out, x, y, a2 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const card = (lab: string, col: string, ok: boolean, a: number, fill: string) => { const k = Math.min(1, k1(t, a)); return <div style={{ textAlign: "center", opacity: k > 0.02 ? 1 : 0, transform: `scale(${0.5 + 0.5 * k})` }}>
    <svg width={260} height={300} viewBox="0 0 100 120" style={{ filter: "drop-shadow(0 16px 20px rgba(0,0,0,.6))" }}><path d="M 50 4 Q 80 50 60 116 L 40 116 Q 20 50 50 4 Z" fill={fill} stroke="#1a2a1a" strokeWidth={2} />
      {ok ? <path d="M 22 66 L 42 86 L 82 40" stroke="#a8d86a" strokeWidth={10} fill="none" strokeLinecap="round" /> : <path d="M 24 40 L 76 92 M 76 40 L 24 92" stroke="#e0332a" strokeWidth={10} strokeLinecap="round" />}</svg>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 46, color: col, letterSpacing: 4, textShadow: "0 3px 10px #000" }}>{lab}</div></div>; };
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", gap: 80 }}>
    {card("CRUDA", "#ff6a4a", false, at, "#6aa080")}{card("ASADA", CH.maiz, true, a2, "#4a5a2a")}
  </div>;
};

// MUESTRARIO de color: la penca pasa de verde azulado a olivo oscuro; marca "LISTA"
export const Muestrario: React.FC<B & { run: number; dur?: number }> = ({ t, at, out, x, y, run, dur = 3 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = ei(t, run, run + dur);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * Math.min(1, k1(t, at))})`, textAlign: "center" }}>
    <div style={{ position: "relative", width: 560, height: 70, borderRadius: 35, background: "linear-gradient(90deg,#7fb3a0,#5a8a5a,#4a5a26,#3a4218)", boxShadow: `${sombra}, inset 0 0 0 4px rgba(255,255,255,.4)` }}>
      <div style={{ position: "absolute", left: `calc(${k * 100}% - 22px)`, top: -18, width: 44, height: 106, borderRadius: 12, border: "6px solid #fff", boxShadow: "0 6px 16px rgba(0,0,0,.6)" }} />
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", width: 560, marginTop: 14, fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 3, color: CH.crema, textShadow: "0 3px 10px #000" }}><span>CRUDA</span><span style={{ color: k > 0.9 ? CH.maiz : CH.crema }}>LISTA ✓</span></div>
  </div>;
};

// FILA de íconos que llegan uno por palabra (tres cosas, tres señales…)
export const Iconos: React.FC<B & { items: { at: number; ic: React.ReactNode; text: string }[]; gap?: number }> = ({ t, at, out, x, y, items, gap = 40 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", gap, perspective: 1200 }}>
    {items.map((it, i) => { const k = Math.min(1.08, k1(t, it.at)); return <div key={i} style={{ width: 300, padding: "26px 10px 20px", borderRadius: 22, textAlign: "center", opacity: k > 0.02 ? 1 : 0, transform: `translateY(${(1 - Math.min(1, k)) * 120}px) rotateX(${(1 - Math.min(1, k)) * 60}deg) scale(${k})`,
      background: "linear-gradient(180deg,#a3502a,#7a3418)", boxShadow: `${sombra}, inset 0 3px 0 rgba(255,220,180,.35)` }}>
      <svg width={110} height={110} viewBox="0 0 80 80">{it.ic}</svg>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 36, color: CH.crema, letterSpacing: 1, lineHeight: 1.1, marginTop: 8 }}>{it.text}</div>
    </div>; })}
  </div>;
};
export const IC = {
  envuelve: <g fill="none" stroke={CH.crema} strokeWidth={6} strokeLinecap="round"><path d="M 10 50 Q 40 10 70 50" /><path d="M 10 50 Q 40 80 70 50" /><ellipse cx={40} cy={50} rx={14} ry={10} fill="#c0281a" stroke="none" /></g>,
  sabor: <g fill="none" stroke={CH.crema} strokeWidth={6} strokeLinecap="round"><path d="M 26 66 Q 18 50 30 40 Q 22 26 34 14" /><path d="M 46 66 Q 38 50 50 40 Q 42 26 54 14" /></g>,
  calor: <g><path d="M 40 8 Q 64 34 54 58 Q 48 74 40 74 Q 22 72 22 54 Q 22 40 32 30 Q 32 44 40 46 Q 34 26 40 8 Z" fill={CH.maiz} /></g>,
  hueso: <g fill={CH.crema}><rect x={22} y={34} width={36} height={12} rx={6} /><circle cx={20} cy={32} r={8} /><circle cx={20} cy={48} r={8} /><circle cx={60} cy={32} r={8} /><circle cx={60} cy={48} r={8} /></g>,
  tenedor: <g stroke={CH.crema} strokeWidth={6} strokeLinecap="round" fill="none"><path d="M 30 8 L 30 34 M 40 8 L 40 34 M 50 8 L 50 34 M 28 34 Q 40 44 52 34 M 40 40 L 40 74" /></g>,
  vidrio: <g><path d="M 14 50 Q 40 20 66 50 Q 40 66 14 50 Z" fill="rgba(255,240,200,.75)" stroke={CH.crema} strokeWidth={4} /><path d="M 26 46 Q 34 38 42 40" stroke="#fff" strokeWidth={4} fill="none" /></g>,
};

// ETIQUETAS de precio colgando de un hilo (se mecen)
export const Etiquetas: React.FC<B & { tags: { at: number; t1: string; t2: string }[] }> = ({ t, at, out, x, y, tags }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, display: "flex", gap: 60 }}>
    {tags.map((g, i) => { const k = Math.min(1, k1(t, g.at)), sw = Math.sin((t - g.at) * 3 + i) * 8 * Math.exp(-(t - g.at) * 0.8);
      return <div key={i} style={{ opacity: k > 0.02 ? 1 : 0, transform: `translateY(${(1 - k) * -300}px) rotate(${sw}deg)`, transformOrigin: "50% -60px", position: "relative" }}>
        <div style={{ position: "absolute", left: "50%", top: -60, width: 3, height: 60, background: "#d8c8a8" }} />
        <div style={{ width: 280, padding: "18px 0", borderRadius: "14px 14px 14px 14px", background: "#fbf4e4", boxShadow: sombra, textAlign: "center", clipPath: "polygon(15% 0,85% 0,100% 20%,100% 100%,0 100%,0 20%)" }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, color: CH.tinta, letterSpacing: 3 }}>{g.t1}</div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: CH.guinda, lineHeight: 1 }}>{g.t2}</div>
        </div>
      </div>; })}
  </div>;
};

// CORTE de la vaporera: agua abajo, parrilla, carne arriba; el vapor sube y la raya roja "el agua NUNCA toca"
export const VaporCorte: React.FC<B & { nunca: number; dedos?: number }> = ({ t, at, out, x, y, nunca, dedos = 1e9 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const n = e(t, nunca, nunca + 0.3), d = e(t, dedos, dedos + 0.4);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * Math.min(1, k1(t, at))})` }}>
    <svg width={560} height={600} viewBox="0 0 560 600" style={{ overflow: "visible", filter: "drop-shadow(0 22px 26px rgba(0,0,0,.6))" }}>
      <path d="M 60 80 L 60 560 Q 60 580 80 580 L 480 580 Q 500 580 500 560 L 500 80" fill="rgba(200,205,210,.18)" stroke="#c4c7c9" strokeWidth={12} />
      <rect x={66} y={470} width={428} height={104} fill="#5aa0d8" opacity={0.75} />
      {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={110 + i * 66} cy={520 - (((t * 0.8 + i * 0.3) % 1) * 40)} r={6} fill="#fff" opacity={0.6} />)}
      <line x1={66} y1={380} x2={494} y2={380} stroke="#888" strokeWidth={8} strokeDasharray="20 10" />
      <path d="M 120 380 Q 110 300 180 290 L 380 290 Q 450 300 440 380 Z" fill="#9a2a14" stroke="#4a1a10" strokeWidth={4} />
      <path d="M 100 380 Q 100 250 280 240 Q 460 250 460 380" fill="none" stroke="#4a5a26" strokeWidth={14} />
      {Array.from({ length: 7 }, (_, i) => { const ph = (t * 0.7 + i * 0.15) % 1; return <path key={i} d={`M ${100 + i * 60} ${460 - ph * 380} q 12 -20 0 -40 q -12 -20 0 -40`} stroke="#fff" strokeWidth={5} fill="none" opacity={0.55 * Math.sin(ph * Math.PI)} />; })}
      <g opacity={n}><line x1={20} y1={430} x2={540} y2={430} stroke="#e0332a" strokeWidth={8} strokeDasharray="24 14" />
        <text x={280} y={420} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill="#ff6a4a" stroke="#1a0a06" strokeWidth={7} paintOrder="stroke">EL AGUA NUNCA TOCA</text></g>
      <g opacity={d}>{Array.from({ length: 4 }, (_, i) => <rect key={i} x={505} y={386 + i * 20} width={46} height={17} rx={8} fill="#f0c8a8" stroke="#6a4a2a" strokeWidth={2} />)}
        <text x={560} y={470} fontFamily={HAND} fontWeight={700} fontSize={44} fill={CH.maiz} stroke="#1a0a06" strokeWidth={5} paintOrder="stroke">4 dedos</text></g>
    </svg>
  </div>;
};

// CORTE del hoyo: 1 m de hondo × 80 cm de ancho, forrado de piedras de río; capas que bajan a su palabra
export const HoyoCorte: React.FC<B & { med: number; piedras: number; capas?: { at: number; l: string; c: string }[] }> = ({ t, at, out, x, y, med, piedras, capas = [] }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const m = e(t, med, med + 0.5), p = e(t, piedras, piedras + 0.8);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * Math.min(1, k1(t, at))})` }}>
    <svg width={720} height={620} viewBox="0 0 720 620" style={{ overflow: "visible", filter: "drop-shadow(0 22px 26px rgba(0,0,0,.6))" }}>
      <rect x={0} y={60} width={720} height={560} fill="#7a5a3a" /><rect x={0} y={60} width={720} height={14} fill="#5a7a2a" />
      <path d="M 180 60 L 200 560 L 520 560 L 540 60 Z" fill="#2a1a10" />
      {Array.from({ length: 30 }, (_, i) => { const side = i % 3, yy = 90 + ((i * 53) % 460); const xx = side === 0 ? 192 + yy * 0.04 : side === 1 ? 528 - yy * 0.04 : 220 + ((i * 97) % 280); const y2 = side === 2 ? 535 : yy;
        return <ellipse key={i} cx={xx} cy={y2} rx={20} ry={14} fill={`rgb(${120 + (i % 4) * 20},${110 + (i % 3) * 10},${100})`} opacity={p} stroke="#3a2a1a" strokeWidth={2} />; })}
      {capas.map((c, i) => { const k = e(t, c.at, c.at + 0.4); const yy = 500 - i * 62; return <g key={i} opacity={k} transform={`translate(0 ${(1 - k) * -400})`}><rect x={230} y={yy} width={260} height={48} rx={10} fill={c.c} stroke="#1a0a06" strokeWidth={3} /><text x={360} y={yy + 35} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={28} fill={CH.crema} stroke="#1a0a06" strokeWidth={5} paintOrder="stroke">{c.l}</text></g>; })}
      <g opacity={m} stroke={CH.maiz} strokeWidth={5} fill={CH.maiz}>
        <line x1={600} y1={70} x2={600} y2={555} /><path d="M 590 86 L 600 66 L 610 86 Z M 590 540 L 600 560 L 610 540 Z" />
        <line x1={186} y1={30} x2={534} y2={30} /><path d="M 202 20 L 182 30 L 202 40 Z M 518 20 L 538 30 L 518 40 Z" />
        <text x={620} y={320} fontFamily={SERIF} fontWeight={900} fontSize={56} stroke="#1a0a06" strokeWidth={6} paintOrder="stroke">1 m</text>
        <text x={360} y={16} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={50} stroke="#1a0a06" strokeWidth={6} paintOrder="stroke">80 cm</text>
      </g>
    </svg>
  </div>;
};

// MONEDA en el agua: brinca y suena (ondas) mientras hay agua; se calla cuando se seca
export const Moneda: React.FC<B & { calla: number }> = ({ t, at, out, x, y, calla }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const quiet = e(t, calla, calla + 0.4), hop = Math.abs(Math.sin((t - at) * 9)) * 26 * (1 - quiet), wob = Math.sin((t - at) * 18) * 14 * (1 - quiet);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * Math.min(1, k1(t, at))})`, textAlign: "center" }}>
    <svg width={420} height={300} viewBox="0 0 420 300" style={{ overflow: "visible" }}>
      <ellipse cx={210} cy={230} rx={190} ry={44} fill={`rgba(90,160,216,${0.7 * (1 - quiet)})`} stroke="#c4c7c9" strokeWidth={6} />
      <g transform={`translate(210 ${200 - hop}) rotate(${wob})`}><ellipse cx={0} cy={0} rx={56} ry={22} fill="#d8b04a" stroke="#7a5a1a" strokeWidth={4} /><ellipse cx={0} cy={-3} rx={40} ry={14} fill="none" stroke="#7a5a1a" strokeWidth={2} /></g>
      {quiet < 0.9 && [0, 1, 2].map((i) => { const ph = ((t - at) * 1.6 + i / 3) % 1; return <g key={i} opacity={(1 - ph) * (1 - quiet)}><path d={`M ${270 + ph * 90} ${120 - ph * 40} q 20 40 0 80`} stroke={CH.maiz} strokeWidth={6} fill="none" /><path d={`M ${150 - ph * 90} ${120 - ph * 40} q -20 40 0 80`} stroke={CH.maiz} strokeWidth={6} fill="none" /></g>; })}
    </svg>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 46, letterSpacing: 3, color: quiet > 0.5 ? "#ff6a4a" : CH.maiz, textShadow: "0 3px 12px #000" }}>{quiet > 0.5 ? "SE CALLÓ: ECHA AGUA CALIENTE" : "SI BAILA, HAY AGUA"}</div>
  </div>;
};

// GOTEO a la olla escondida: cada gota con su nombre (jugo, grasa, adobo)
export const Goteo: React.FC<B & { names: { at: number; l: string; c: string }[] }> = ({ t, at, out, x, y, names }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const fill = e(t, at, out);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * Math.min(1, k1(t, at))})` }}>
    <svg width={600} height={620} viewBox="0 0 600 620" style={{ overflow: "visible", filter: "drop-shadow(0 22px 26px rgba(0,0,0,.6))" }}>
      <path d="M 120 80 Q 100 20 300 20 Q 500 20 480 80 L 470 110 L 130 110 Z" fill="#9a2a14" stroke="#4a1a10" strokeWidth={4} />
      <path d="M 90 110 Q 300 140 510 110" stroke="#4a5a26" strokeWidth={14} fill="none" />
      {names.map((n, i) => { const ph = ((t - n.at) * 0.8) % 1; const on = t >= n.at; return on ? <g key={i}><path d={`M ${220 + i * 80} ${140 + ph * 300} q 10 18 0 26 q -10 -8 0 -26 Z`} fill={n.c} transform={`scale(1.4) translate(${-(220 + i * 80) * 0.285} ${-(140 + ph * 300) * 0.285})`} opacity={Math.sin(ph * Math.PI)} />
        <text x={220 + i * 80} y={130 - 20 * i} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={44} fill={CH.crema} stroke="#1a0a06" strokeWidth={5} paintOrder="stroke" opacity={e(t, n.at, n.at + 0.3)} transform={`rotate(${-8 + i * 8} ${220 + i * 80} ${130 - 20 * i})`}>{n.l}</text></g> : null; })}
      <path d="M 150 470 Q 130 600 300 610 Q 470 600 450 470 Q 470 450 440 440 L 160 440 Q 130 450 150 470 Z" fill="#6a3a22" stroke="#3a1a0a" strokeWidth={5} />
      <ellipse cx={300} cy={448} rx={140} ry={16} fill="#c0281a" opacity={0.3 + 0.6 * fill} />
    </svg>
  </div>;
};

// ORDEN en la mesa: 1º el consomé, 2º el taco (podio de jarritos)
export const Orden: React.FC<B & { a2: number }> = ({ t, at, out, x, y, a2 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const col = (n: string, l: string, h: number, a: number, c: string) => { const k = Math.min(1, k1(t, a)); return <div style={{ textAlign: "center", opacity: k > 0.02 ? 1 : 0 }}>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 44, color: CH.crema, textShadow: "0 3px 10px #000", transform: `translateY(${(1 - k) * 60}px)` }}>{l}</div>
    <div style={{ width: 240, height: h * k, background: c, borderRadius: "14px 14px 0 0", boxShadow: sombra, display: "flex", alignItems: "flex-start", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 110, color: CH.crema, textShadow: extrude(6, "#2a120c"), overflow: "hidden" }}>{n}</div></div>; };
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-100%)", display: "flex", alignItems: "flex-end", gap: 20 }}>
    {col("1º", "EL CONSOMÉ", 300, at, `linear-gradient(180deg,${CH.barro},#7a3418)`)}{col("2º", "EL TACO", 200, a2, "linear-gradient(180deg,#8a7a5a,#5a4a32)")}
  </div>;
};

// BARRAS de tiempo por carne (borrego 4 h, res 5 h)
export const Barras: React.FC<B & { rows: { at: number; l: string; v: number; txt: string }[]; max: number }> = ({ t, at, out, x, y, rows, max }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, padding: "26px 34px", borderRadius: 18, background: "rgba(20,10,6,.72)", boxShadow: sombra }}>
    {rows.map((r, i) => { const k = ei(t, r.at, r.at + 0.9); return <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, margin: "12px 0", opacity: e(t, r.at - 0.2, r.at) }}>
      <div style={{ width: 200, fontFamily: FONT, fontWeight: 900, fontSize: 38, color: CH.crema, letterSpacing: 2 }}>{r.l}</div>
      <div style={{ width: 560 * (r.v / max) * k, height: 56, borderRadius: 10, background: `repeating-linear-gradient(90deg,${CH.barro} 0 ${560 / max - 6}px, transparent ${560 / max - 6}px ${560 / max}px)` }} />
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 52, color: CH.maiz, opacity: e(t, r.at + 0.8, r.at + 1) }}>{r.txt}</div>
    </div>; })}
  </div>;
};

// CADA DESTAPADA SUMA: contador "+15 min" que crece con cada tapa que se abre
export const Destapa: React.FC<B & { hits: number[] }> = ({ t, at, out, x, y, hits }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const n = hits.filter((h) => t >= h).length, last = hits[Math.max(0, n - 1)] ?? at;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%)`, textAlign: "center" }}>
    <svg width={260} height={160} viewBox="0 0 130 80" style={{ transform: `rotate(${n > 0 ? -18 * Math.exp(-(t - last) * 4) : 0}deg) translateY(${n > 0 ? -20 * Math.exp(-(t - last) * 4) : 0}px)`, transformOrigin: "10% 90%" }}>
      <path d="M 10 60 Q 65 20 120 60 Z" fill="#c4c7c9" stroke="#5a5d60" strokeWidth={3} /><rect x={55} y={30} width={20} height={10} rx={5} fill="#2a2624" /></svg>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 120, color: "#ff6a4a", textShadow: extrude(8, "#3a0a06"), transform: `scale(${n > 0 ? 1 + 0.25 * Math.exp(-(t - last) * 6) : 1})` }}>+{n * 15} MIN</div>
  </div>;
};

// TARJETA de problema → arreglo (síntoma tachado, remedio en verde)
export const Arreglo: React.FC<B & { mal: string; bien: string; fixAt: number; rot?: number }> = ({ t, at, out, x, y, mal, bien, fixAt, rot = -2 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = Math.min(1, k1(t, at)), f = e(t, fixAt, fixAt + 0.3);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${0.5 + 0.5 * k})`, width: 640, padding: "26px 34px", background: PAPEL, borderRadius: 6, boxShadow: sombra }}>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 24, letterSpacing: 4, color: CH.guinda }}>SI TE SALIÓ…</div>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: CH.tinta, lineHeight: 1.05 }}>{mal}</div>
    <div style={{ marginTop: 10, fontFamily: HAND, fontWeight: 700, fontSize: 50, color: "#3a7a2a", opacity: f, transform: `translateX(${(1 - f) * 30}px)` }}>→ {bien}</div>
  </div>;
};

// LA CUENTA: dos columnas (taquería vs tu casa) con números que corren
export const Cuenta: React.FC<B & { izq: { at: number; l: string; v: number }; der: { at: number; l: string; v: number }; extra?: { at: number; l: string } }> = ({ t, at, out, x, y, izq, der, extra }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const colm = (c: { at: number; l: string; v: number }, bg: string, col: string) => { const k = Math.min(1, k1(t, c.at)), v = Math.round(c.v * ei(t, c.at, c.at + 1.2)); return <div style={{ width: 520, padding: "26px 0 30px", borderRadius: 22, background: bg, textAlign: "center", boxShadow: sombra, opacity: k > 0.02 ? 1 : 0, transform: `translateY(${(1 - k) * 80}px)` }}>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, letterSpacing: 4, color: CH.crema }}>{c.l}</div>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 150, color: col, lineHeight: 1, textShadow: extrude(8, "rgba(0,0,0,.5)") }}>${v}</div></div>; };
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", textAlign: "center" }}>
    <div style={{ display: "flex", gap: 60 }}>{colm(izq, "linear-gradient(180deg,#5a5d60,#3a3c3e)", "#ff8a6a")}{colm(der, `linear-gradient(180deg,${CH.barro},#7a3418)`, CH.maiz)}</div>
    {extra && <div style={{ marginTop: 26, marginLeft: 580, width: 520, fontFamily: HAND, fontWeight: 700, fontSize: 58, color: CH.maiz, textShadow: "0 3px 12px #000", opacity: e(t, extra.at, extra.at + 0.3), transform: `scale(${Math.min(1.1, spr(t, extra.at))})` }}>{extra.l}</div>}
  </div>;
};

// GARRAFA de consomé que se llena hasta 5 litros
export const Garrafa: React.FC<B & { run: number }> = ({ t, at, out, x, y, run }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const f = ei(t, run, run + 1.6);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * Math.min(1, k1(t, at))})`, textAlign: "center" }}>
    <svg width={260} height={340} viewBox="0 0 130 170" style={{ filter: "drop-shadow(0 18px 22px rgba(0,0,0,.6))" }}>
      <defs><clipPath id="gf"><path d="M 45 10 L 85 10 L 85 30 Q 120 40 120 80 L 120 150 Q 120 165 105 165 L 25 165 Q 10 165 10 150 L 10 80 Q 10 40 45 30 Z" /></clipPath></defs>
      <g clipPath="url(#gf)"><rect x={0} y={0} width={130} height={170} fill="rgba(255,255,255,.12)" /><rect x={0} y={165 - 140 * f} width={130} height={170} fill="#b8361e" /></g>
      <path d="M 45 10 L 85 10 L 85 30 Q 120 40 120 80 L 120 150 Q 120 165 105 165 L 25 165 Q 10 165 10 150 L 10 80 Q 10 40 45 30 Z" fill="none" stroke="#e8e0d0" strokeWidth={4} />
      {[1, 2, 3, 4, 5].map((l) => <g key={l}><line x1={92} y1={165 - l * 27} x2={112} y2={165 - l * 27} stroke="#fff" strokeWidth={2} /></g>)}
    </svg>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 80, color: CH.maiz, textShadow: extrude(6, "#3a1e0c") }}>{(5 * f).toFixed(0)} L</div>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, color: CH.crema, letterSpacing: 3, textShadow: "0 3px 10px #000" }}>DE CONSOMÉ DE REGALO</div>
  </div>;
};

// SEMANA: la barbacoa que rinde (domingo a miércoles), cada día con su plato
export const Semana: React.FC<B & { days: { at: number; d: string; p: string }[] }> = ({ t, at, out, x, y, days }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", gap: 24, perspective: 1300 }}>
    {days.map((d, i) => { const k = Math.min(1, k1(t, d.at)); return <div key={i} style={{ width: 300, borderRadius: 14, overflow: "hidden", boxShadow: sombra, opacity: k > 0.02 ? 1 : 0, transform: `rotateY(${(1 - k) * -90}deg)`, transformOrigin: "0 50%", background: "#fbf4e4" }}>
      <div style={{ background: i === 0 ? CH.guinda : CH.barro, color: CH.crema, fontFamily: FONT, fontWeight: 900, fontSize: 34, letterSpacing: 4, textAlign: "center", padding: "10px 0" }}>{d.d}</div>
      <div style={{ height: 150, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 50, color: CH.tinta, lineHeight: 1, padding: "0 12px" }}>{d.p}</div></div>; })}
  </div>;
};

// ENCUESTA en burbuja de comentario: opciones que se prenden una por una
export const Encuesta: React.FC<B & { q: string; opts: { at: number; l: string }[] }> = ({ t, at, out, x, y, q, opts }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = Math.min(1, k1(t, at));
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.5 + 0.5 * k})`, transformOrigin: "10% 100%" }}>
    <div style={{ position: "relative", width: 720, padding: "28px 34px 30px", borderRadius: 30, background: "#fbf4e4", boxShadow: sombra }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 46, color: CH.tinta, lineHeight: 1.1, marginBottom: 16 }}>{q}</div>
      {opts.map((p, i) => { const a = e(t, p.at, p.at + 0.25); return <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, margin: "10px 0", padding: "12px 20px", borderRadius: 16, background: `rgba(194,85,45,${0.12 + 0.75 * a})`, transform: `translateX(${(1 - a) * 40}px)`, opacity: 0.3 + 0.7 * a }}>
        <div style={{ width: 36, height: 36, borderRadius: 18, border: `5px solid ${CH.tinta}`, background: a > 0.5 ? CH.maiz : "transparent" }} />
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 42, color: a > 0.5 ? "#fff" : CH.tinta, letterSpacing: 3 }}>{p.l}</div></div>; })}
      <svg width={80} height={60} style={{ position: "absolute", left: 60, bottom: -54 }}><path d="M 0 0 L 70 0 L 10 58 Z" fill="#fbf4e4" /></svg>
    </div>
  </div>;
};

// LETRAS GRANDES de rancho: frase corta que entra golpeando, palabra por palabra
export const Golpe: React.FC<B & { words: { at: number; w: string; col?: string }[]; size?: number }> = ({ t, at, out, x, y, words, size = 130 }) => {
  const o = vis(t, at, out, 0.05); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", gap: size * 0.25, whiteSpace: "nowrap" }}>
    {words.map((w, i) => { const k = e(t, w.at, w.at + 0.1), sq = t > w.at + 0.1 ? 1 + 0.08 * Math.exp(-(t - w.at - 0.1) * 10) : 1; return <span key={i} style={{ fontFamily: SERIF, fontWeight: 900, fontSize: size, color: w.col ?? CH.crema, textShadow: extrude(10, "#2a120c"), opacity: k, transform: `scale(${(1.8 - 0.8 * k) * sq})`, display: "inline-block" }}>{w.w}</span>; })}
  </div>;
};

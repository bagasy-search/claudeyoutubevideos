// cmehel3d · piezas 2.5D del resto del video (las de cme3d01 se reusan; acá van las propias de esta prueba).
// Ninguna muestra un enlace en pantalla: el CTA dice el nombre y "1ª línea de la descripción".
import React from "react";
import { COL, FONT, e, spr, extrude } from "../cme3d01/lib";

const panel: React.CSSProperties = { background: "linear-gradient(180deg, rgba(14,20,30,.92), rgba(6,9,14,.94))", borderRadius: 26, boxShadow: "0 40px 90px rgba(0,0,0,.7), inset 0 0 0 2px rgba(244,239,230,.12)" };
const vis = (t: number, at: number, out: number, k = 0.25) => e(t, at, at + k) * (1 - e(t, out, out + 0.3));

// gráfico del tester en reposo a lo largo de la prueba: cada punto cae cuando la voz lo dice; la línea roja de 12,0 V
export const VoltChart: React.FC<{ t: number; at: number; out: number; pts: { at: number; v: number; lab: string }[]; redAt?: number; x?: number; y?: number; w?: number; h?: number }> = ({ t, at, out, pts, redAt = 1e9, x = 1040, y = 210, w = 800, h = 520 }) => {
  const o = vis(t, at, out);
  if (o <= 0.01) return null;
  const lo = 11.8, hi = 12.75, X = (i: number) => 70 + (i / Math.max(1, pts.length - 1)) * (w - 140), Y = (v: number) => 40 + (1 - (v - lo) / (hi - lo)) * (h - 120);
  const shown = pts.filter((p) => t >= p.at);
  const path = shown.map((p, i) => `${i ? "L" : "M"}${X(i)},${Y(p.v)}`).join(" ");
  const rk = e(t, redAt, redAt + 0.6);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: o, transform: `scale(${0.9 + 0.1 * Math.min(1, spr(t, at))})`, transformOrigin: "50% 50%", ...panel }}>
      <div style={{ position: "absolute", left: 30, top: 16, fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 4, color: COL.dim }}>TESTER EN REPOSO · VOLTIOS</div>
      <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
        {[12.0, 12.2, 12.4, 12.6].map((v) => <g key={v}><line x1={60} x2={w - 40} y1={Y(v)} y2={Y(v)} stroke="rgba(244,239,230,.1)" strokeWidth={2} /><text x={14} y={Y(v) + 8} fill="rgba(244,239,230,.45)" fontFamily={FONT} fontWeight={800} fontSize={22}>{v.toFixed(1).replace(".", ",")}</text></g>)}
        {rk > 0 && <><line x1={60} x2={60 + (w - 100) * rk} y1={Y(12.0)} y2={Y(12.0)} stroke={COL.red} strokeWidth={6} strokeDasharray="18 10" /><text x={w - 250} y={Y(12.0) + 44} fill={COL.red} opacity={rk} fontFamily={FONT} fontWeight={900} fontSize={30} letterSpacing={3}>LÍNEA ROJA</text></>}
        {shown.length > 1 && <path d={path} fill="none" stroke="#b6ff7a" strokeWidth={6} strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 8px #b6ff7a88)" }} />}
        {shown.map((p, i) => {
          const k = Math.min(1.15, spr(t, p.at, 1.2)), col = p.v < 12.05 ? COL.red : p.v < 12.3 ? COL.amber : "#b6ff7a";
          return <g key={i} transform={`translate(${X(i)},${Y(p.v)}) scale(${k})`}><circle r={13} fill={col} /><text y={-26} textAnchor="middle" fill={COL.ink} fontFamily="'Courier New', monospace" fontWeight={900} fontSize={34}>{p.v.toFixed(2).replace(".", ",")}</text><text y={52} textAnchor="middle" fill={COL.dim} fontFamily={FONT} fontWeight={800} fontSize={20} letterSpacing={2}>{p.lab}</text></g>;
        })}
      </svg>
    </div>
  );
};

// las 24 horas en una tira: los bloques de 1 h en que el refrigerador va enchufado
export const BlockStrip: React.FC<{ t: number; out: number; blocks: { at: number; h: number; lab: string; len?: number }[]; y?: number; title?: string }> = ({ t, out, blocks, y = 800, title = "ENCHUFADO SÓLO EN BLOQUES" }) => {
  const a0 = blocks[0].at - 0.3, o = vis(t, a0, out);
  if (o <= 0.01) return null;
  const W0 = 1500, X = (h: number) => (h / 24) * W0;
  return (
    <div style={{ position: "absolute", left: 210, top: y, width: W0, opacity: o, transform: `translateY(${(1 - Math.min(1, spr(t, a0))) * 60}px)` }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 4, color: COL.ice, marginBottom: 10, textShadow: extrude(3, "#000") }}>{title}</div>
      <div style={{ position: "relative", height: 70, borderRadius: 14, background: "rgba(10,14,22,.85)", boxShadow: "inset 0 0 0 2px rgba(244,239,230,.15), 0 20px 50px rgba(0,0,0,.6)" }}>
        {[0, 6, 12, 18, 24].map((h) => <div key={h} style={{ position: "absolute", left: X(h) - 20, top: 78, width: 40, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 22, color: COL.dim }}>{h}h</div>)}
        {blocks.map((b, i) => { const k = e(t, b.at, b.at + 0.5); return k > 0 ? <div key={i} style={{ position: "absolute", left: X(b.h), top: 6, height: 58, width: X(b.len ?? 1) * k, borderRadius: 10, background: "linear-gradient(180deg,#8fd6ff,#3f8fe0)", boxShadow: "0 0 24px #8fd6ff99" }}><div style={{ position: "absolute", top: -54, left: -40, width: 160, fontFamily: FONT, fontWeight: 900, fontSize: 32, color: COL.ink, opacity: k, textShadow: extrude(3, "#000") }}>{b.lab}</div></div> : null; })}
      </div>
    </div>
  );
};

// el cuaderno de la prueba: renglones que se escriben solos
export const Notebook: React.FC<{ t: number; at: number; out: number; title: string; rows: { at: number; txt: string; col?: string }[]; x?: number; y?: number; rot?: number }> = ({ t, at, out, title, rows, x = 1180, y = 170, rot = 3 }) => {
  const o = vis(t, at, out);
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 600, opacity: o, transform: `rotate(${rot}deg) translateY(${(1 - Math.min(1, spr(t, at))) * 80}px)`, background: "repeating-linear-gradient(180deg, #f3ecd8 0 58px, #a9c3dd 58px 60px)", borderRadius: 8, padding: "26px 30px 30px 70px", boxShadow: "0 40px 80px rgba(0,0,0,.7)", borderLeft: "4px solid #d9534f" }}>
      <div style={{ fontFamily: "'Comic Sans MS', 'Segoe Print', cursive", fontWeight: 700, fontSize: 38, color: "#1d3a6b", height: 60 }}>{title}</div>
      {rows.map((r, i) => { const k = e(t, r.at, r.at + 0.7); const n = Math.round(r.txt.length * k); return <div key={i} style={{ fontFamily: "'Comic Sans MS', 'Segoe Print', cursive", fontWeight: 700, fontSize: 36, color: r.col ?? "#1d2a4a", height: 60, whiteSpace: "nowrap" }}>{r.txt.slice(0, n)}</div>; })}
    </div>
  );
};

// el CTA: la descripción del video con la 1ª línea marcada. SIN enlace en pantalla: sólo el nombre.
export const DescCard: React.FC<{ t: number; at: number; out: number; name?: string; sub?: string; x?: number; y?: number }> = ({ t, at, out, name = "PLAN APAGÓN · SISTEMA LUZ CERO", sub = "EL ENLACE ESTÁ EN LA 1ª LÍNEA DE LA DESCRIPCIÓN", x = 960, y = 760 }) => {
  const o = vis(t, at, out), k = Math.min(1.05, spr(t, at, 0.9)), hl = e(t, at + 0.5, at + 0.9);
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.8 + 0.2 * k})` }}>
      <div style={{ ...panel, width: 1060, padding: "22px 30px", background: "rgba(250,250,250,.97)" }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, color: "#606060", letterSpacing: 2, marginBottom: 10 }}>DESCRIPCIÓN</div>
        <div style={{ position: "relative", fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "#0f0f0f", padding: "8px 14px", borderRadius: 10, background: `rgba(255,214,90,${0.85 * hl})` }}>
          <span style={{ color: "#c62828", marginRight: 14 }}>➜</span>{name}
        </div>
        <div style={{ height: 14, margin: "16px 14px 8px", borderRadius: 7, background: "#e2e2e2", width: "78%" }} />
        <div style={{ height: 14, margin: "0 14px", borderRadius: 7, background: "#e8e8e8", width: "56%" }} />
      </div>
      <div style={{ marginTop: 18, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 40, letterSpacing: 3, color: COL.amber, opacity: e(t, at + 0.6, at + 0.9), textShadow: extrude(4, "#000") }}>{sub}</div>
    </div>
  );
};

// tarjeta de regla (las 5 reglas)
export const Regla: React.FC<{ t: number; at: number; out: number; n: number; txt: string; sub?: string; subAt?: number; col?: string; x?: number; y?: number }> = ({ t, at, out, n, txt, sub, subAt = at + 0.6, col = COL.amber, x = 960, y = 540 }) => {
  const o = vis(t, at, out), k = Math.min(1.08, spr(t, at, 0.9));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1400px) rotateX(${(1 - Math.min(1, k)) * 50}deg) scale(${0.75 + 0.25 * k})` }}>
      <div style={{ ...panel, padding: "26px 54px 30px", textAlign: "center", minWidth: 900, borderTop: `8px solid ${col}` }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, letterSpacing: 10, color: col }}>REGLA {n}</div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 76, color: COL.ink, lineHeight: 1.05, marginTop: 8, textShadow: extrude(4, "#000") }}>{txt}</div>
        {sub && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: COL.dim, marginTop: 14, opacity: e(t, subAt, subAt + 0.3) }}>{sub}</div>}
      </div>
    </div>
  );
};

// "el trato": lo que esto NO es (cada renglón se tacha)
export const Trato: React.FC<{ t: number; at: number; out: number; rows: { at: number; txt: string }[]; x?: number; y?: number; title?: string }> = ({ t, at, out, rows, x = 960, y = 540, title = "EL TRATO" }) => {
  const o = vis(t, at, out);
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.85 + 0.15 * Math.min(1, spr(t, at))})` }}>
      <div style={{ ...panel, padding: "26px 50px 30px", minWidth: 940 }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 38, letterSpacing: 8, color: COL.amber, marginBottom: 10 }}>{title}</div>
        {rows.map((r, i) => { const k = e(t, r.at, r.at + 0.3); return k > 0 ? <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, opacity: k, transform: `translateX(${(1 - k) * 60}px)`, padding: "8px 0" }}><span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: COL.red }}>✗</span><span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 60, color: COL.ink }}>{r.txt}</span></div> : null; })}
      </div>
    </div>
  );
};

// cierre: las dos preguntas para los comentarios, y después suscribirse + campanita
export const Ask: React.FC<{ t: number; out: number; qs: { at: number; txt: string }[]; y?: number }> = ({ t, out, qs, y = 300 }) => {
  const o = vis(t, qs[0].at - 0.2, out);
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, opacity: o }}>
      {qs.map((q, i) => { const k = Math.min(1.06, spr(t, q.at, 0.9)); return t >= q.at ? <div key={i} style={{ ...panel, padding: "18px 40px", transform: `scale(${0.7 + 0.3 * k}) rotate(${i ? 1.2 : -1.2}deg)`, display: "flex", alignItems: "center", gap: 22 }}><svg width={60} height={56} viewBox="0 0 60 56"><path d="M6 4h48a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4H24L10 52V40H6a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4z" fill={COL.amber} /></svg><span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 58, color: COL.ink }}>{q.txt}</span></div> : null; })}
    </div>
  );
};
export const Subscribe: React.FC<{ t: number; at: number; bellAt: number; out: number; y?: number }> = ({ t, at, bellAt, out, y = 860 }) => {
  const o = vis(t, at, out), k = Math.min(1.06, spr(t, at)), pressed = t > at + 0.7, ring = t > bellAt ? Math.sin((t - bellAt) * 28) * 18 * (1 - e(t, bellAt + 0.4, bellAt + 1.2)) : 0;
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 960, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.8 + 0.2 * k})`, display: "flex", alignItems: "center", gap: 26 }}>
      <div style={{ padding: "18px 46px", borderRadius: 40, background: pressed ? "#3a3a3a" : "#cc1f1f", fontFamily: FONT, fontWeight: 900, fontSize: 50, color: "#fff", letterSpacing: 2, boxShadow: "0 20px 50px rgba(0,0,0,.6)", transform: `scale(${t > at + 0.6 && t < at + 0.8 ? 0.93 : 1})` }}>{pressed ? "SUSCRITO" : "SUSCRÍBETE"}</div>
      <div style={{ width: 96, height: 96, borderRadius: 48, background: t > bellAt ? COL.amber : "#2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${ring}deg)`, boxShadow: "0 20px 50px rgba(0,0,0,.6)" }}><svg width={54} height={58} viewBox="0 0 54 58"><path d="M27 4c-10 0-17 8-17 18v12L4 42v4h46v-4l-6-8V22C44 12 37 4 27 4z" fill="#fff" /><circle cx={27} cy={51} r={6} fill="#fff" /></svg></div>
    </div>
  );
};

// rhmoldtest · piezas NUEVAS del resto del video (cada minuto las suyas, mismo estilo: tarjetas 3D con canto, resorte, extrusión)
import React from "react";
import { COL, FONT, e, ei, extrude, spr } from "./lib";

const k1 = (t: number, at: number, f = 1) => Math.min(1.1, spr(t, at, f));
const op = (t: number, at: number, out: number) => e(t, at, at + 0.12) * (1 - e(t, out, out + 0.3));
const CARD = "linear-gradient(180deg, rgba(250,248,242,.97), rgba(226,222,212,.97))";
const DARK = "linear-gradient(180deg, rgba(20,32,52,.95), rgba(10,16,28,.95))";

// ===== min 2 · el pizarrón MOHO / HONGO / MUGRE: cada columna se arma con su frase =====
export type Col3 = { at: number; head: string; c: string; rows: { at: number; tx: string }[] };
export const Board3: React.FC<{ t: number; cols: Col3[]; vis: number; x?: number; y?: number; sc?: number; mark?: { at: number; i: number } }> = ({ t, cols, vis, x = 1290, y = 120, sc = 1, mark }) => {
  if (vis <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: vis, perspective: 1500, transform: `scale(${sc})`, transformOrigin: "0 0" }}>
      <div style={{ display: "flex", gap: 14, transform: `rotateY(-14deg) rotateX(4deg) translateX(${(1 - vis) * 200}px)` }}>
        {cols.map((c, i) => {
          const k = k1(t, c.at), o = e(t, c.at, c.at + 0.12), hot = mark && t >= mark.at && mark.i === i;
          return (
            <div key={i} style={{ width: 190, opacity: o, transform: `translateY(${(1 - Math.min(1, k)) * 120}px)`, borderRadius: 18, padding: "14px 12px 16px", background: DARK,
              boxShadow: `0 26px 50px rgba(0,0,0,.6), 0 0 0 ${hot ? 6 : 3}px ${c.c}${hot ? "" : "88"}`, fontFamily: FONT }}>
              <div style={{ fontWeight: 900, fontSize: 34, color: c.c, textAlign: "center", letterSpacing: 2, textShadow: extrude(4, "#0a2a40") }}>{c.head}</div>
              {c.rows.map((r, j) => { const w = e(t, r.at, r.at + 0.35); return (
                <div key={j} style={{ marginTop: 10, padding: "8px 8px", borderRadius: 10, background: "rgba(255,255,255,.08)", clipPath: `inset(0 ${100 - 100 * w}% 0 0)`, fontWeight: 800, fontSize: 22, color: COL.ink, textAlign: "center", lineHeight: 1.15 }}>{r.tx}</div>); })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ===== min 3 · la lista de lo que necesitás: casillas que se tildan con la voz =====
export const Kit: React.FC<{ t: number; at: number; out: number; items: { at: number; tx: string; ic: string }[]; x?: number; y?: number }> = ({ t, at, out, items, x = 1240, y = 170 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = k1(t, at, 0.9);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1400 }}>
      <div style={{ width: 600, padding: "26px 30px", borderRadius: 22, background: CARD, boxShadow: "0 50px 90px rgba(0,0,0,.6)", transform: `rotateY(${-16 + (1 - Math.min(1, k)) * -50}deg) rotateZ(1.5deg)`, fontFamily: FONT }}>
        <div style={{ fontWeight: 900, fontSize: 30, letterSpacing: 5, color: "#6b5f45" }}>WHAT YOU NEED</div>
        {items.map((it, i) => { const c = e(t, it.at, it.at + 0.25); return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 16, opacity: 0.35 + 0.65 * c }}>
            <div style={{ width: 52, height: 52, borderRadius: 10, border: "5px solid #2d6cdf", display: "grid", placeItems: "center", fontSize: 40, color: "#1c9b4a", fontWeight: 900 }}>{c > 0.5 ? "✓" : ""}</div>
            <div style={{ fontSize: 44 }}>{it.ic}</div>
            <div style={{ fontWeight: 900, fontSize: 44, color: "#1d2733" }}>{it.tx}</div>
          </div>); })}
      </div>
    </div>
  );
};

// ===== min 3 · tres botellas: la común sí, las "especiales" no =====
export const Bottles: React.FC<{ t: number; out: number; items: { at: number; tx: string; ok: boolean }[]; y?: number }> = ({ t, out, items, y = 640 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 40, perspective: 1300 }}>
    {items.map((it, i) => {
      const k = k1(t, it.at), o = op(t, it.at, out);
      return (
        <div key={i} style={{ opacity: o, transform: `translateY(${(1 - Math.min(1, k)) * 160}px) rotateX(${(1 - Math.min(1, k)) * 60}deg) rotateZ(${(i - 1) * 2}deg)`, width: 400, padding: "18px 0", borderRadius: 20, textAlign: "center",
          background: it.ok ? "linear-gradient(180deg,#1f5a34,#0f3a20)" : "linear-gradient(180deg,#6a1c18,#3e0d0b)", boxShadow: "0 30px 60px rgba(0,0,0,.6)", fontFamily: FONT }}>
          <div style={{ fontSize: 70, lineHeight: 1 }}>{it.ok ? "✅" : "❌"}</div>
          <div style={{ fontWeight: 900, fontSize: 40, color: "#fff", letterSpacing: 2, marginTop: 8 }}>{it.tx}</div>
        </div>
      );
    })}
  </div>
);

// ===== min 3 · la taza medidora: primero el agua, después la cucharada; 1 : 16 =====
export const Ratio: React.FC<{ t: number; at: number; water: number; tbsp: number; ratio: number; out: number; x?: number; y?: number }> = ({ t, at, water, tbsp, ratio, out, x = 1330, y = 150 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const lv = ei(t, water, water + 1.2), drop = e(t, tbsp, tbsp + 0.5), rk = k1(t, ratio);
  const dy = drop < 1 ? -120 + 200 * drop : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, fontFamily: FONT }}>
      <svg width={460} height={520}>
        <defs><linearGradient id="gl" x1="0" x2="1"><stop offset="0" stopColor="rgba(255,255,255,.35)" /><stop offset=".5" stopColor="rgba(255,255,255,.06)" /><stop offset="1" stopColor="rgba(255,255,255,.3)" /></linearGradient></defs>
        <path d="M90 120 L110 470 Q112 500 140 500 L320 500 Q348 500 350 470 L370 120 Z" fill="url(#gl)" stroke="rgba(255,255,255,.85)" strokeWidth={5} />
        <clipPath id="cup"><path d="M92 120 L112 470 Q114 498 140 498 L320 498 Q346 498 348 470 L368 120 Z" /></clipPath>
        <rect x={80} y={500 - 340 * lv} width={300} height={340} clipPath="url(#cup)" fill="rgba(120,190,255,.55)" />
        {[0.25, 0.5, 0.75, 1].map((q, i) => <line key={i} x1={300} x2={340} y1={500 - 340 * q} y2={500 - 340 * q} stroke="#fff" strokeWidth={4} />)}
        {drop > 0 && drop < 1 && <ellipse cx={230} cy={160 + dy} rx={16} ry={22} fill="#fff6c8" stroke="#e6d38a" strokeWidth={3} />}
        <path d="M370 150 Q440 160 430 260 Q420 330 360 330" fill="none" stroke="rgba(255,255,255,.85)" strokeWidth={14} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", left: 20, top: 520, width: 420, textAlign: "center", padding: "10px 0", borderRadius: 16, background: "rgba(8,12,18,.78)", textShadow: "0 3px 8px #000" }}>
        <div style={{ fontWeight: 900, fontSize: 40, color: COL.ice, opacity: e(t, water, water + 0.2) }}>1 CUP WATER</div>
        <div style={{ fontWeight: 900, fontSize: 40, color: "#ffd60a", opacity: e(t, tbsp, tbsp + 0.2) }}>+ 1 TBSP BLEACH</div>
      </div>
      <div style={{ position: "absolute", left: -560, top: 200, opacity: e(t, ratio, ratio + 0.1), transform: `perspective(900px) rotateY(${(1 - Math.min(1, rk)) * -70}deg)`, fontWeight: 900, fontSize: 170, color: COL.ink, textShadow: extrude(14, "#5a4a36"), whiteSpace: "nowrap" }}>1 : 16</div>
    </div>
  );
};

// ===== min 3 · cronómetro circular (10 s del hisopo / 1-2 min de espera) =====
export const Ring: React.FC<{ t: number; at: number; dur: number; out: number; label: string; sub: string; x: number; y: number; col?: string; r?: number }> = ({ t, at, dur, out, label, sub, x, y, col = "#ffd60a", r = 120 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const q = Math.min(1, Math.max(0, (t - at) / dur)), C = 2 * Math.PI * r, k = k1(t, at, 0.9);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.5 + 0.5 * Math.min(1, k)})`, fontFamily: FONT, textAlign: "center" }}>
      <svg width={2 * r + 40} height={2 * r + 40} style={{ filter: "drop-shadow(0 20px 30px rgba(0,0,0,.6))" }}>
        <circle cx={r + 20} cy={r + 20} r={r} fill="rgba(10,16,28,.88)" stroke="rgba(255,255,255,.15)" strokeWidth={18} />
        <circle cx={r + 20} cy={r + 20} r={r} fill="none" stroke={col} strokeWidth={18} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - q)} transform={`rotate(-90 ${r + 20} ${r + 20})`} />
        <text x={r + 20} y={r + 34} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={r * 0.5} fill="#fff">{label}</text>
      </svg>
      <div style={{ fontWeight: 900, fontSize: 34, letterSpacing: 4, color: col, textShadow: "0 3px 10px #000" }}>{sub}</div>
    </div>
  );
};

// ===== min 3-4 · el veredicto: qué significa cada respuesta =====
export const Verdict: React.FC<{ t: number; vis: number; rows: { at: number; a: string; b: string; c: string }[]; x?: number; y?: number }> = ({ t, vis, rows, x = 70, y = 160 }) => {
  if (vis <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: vis, perspective: 1400, fontFamily: FONT }}>
      <div style={{ transform: `rotateY(14deg) translateX(${(1 - vis) * -200}px)` }}>
        {rows.map((r, i) => { const k = k1(t, r.at), o = e(t, r.at, r.at + 0.12); return (
          <div key={i} style={{ opacity: o, display: "flex", alignItems: "center", gap: 18, marginBottom: 20, transform: `translateX(${(1 - Math.min(1, k)) * -240}px)` }}>
            <div style={{ width: 300, padding: "14px 18px", borderRadius: 16, background: CARD, fontWeight: 900, fontSize: 36, color: "#1d2733", textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>{r.a}</div>
            <div style={{ fontSize: 50, color: "#fff", textShadow: "0 3px 10px #000" }}>➜</div>
            <div style={{ width: 260, padding: "14px 18px", borderRadius: 16, background: r.c, fontWeight: 900, fontSize: 38, color: "#fff", textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>{r.b}</div>
          </div>); })}
      </div>
    </div>
  );
};

// ===== min 4 · NUNCA mezclar la lejía: tres renglones que se tachan con la voz =====
export const NoMix: React.FC<{ t: number; at: number; out: number; rows: { at: number; tx: string }[] }> = ({ t, at, out, rows }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = k1(t, at, 0.9);
  return (
    <div style={{ position: "absolute", left: 960, top: 520, opacity: o, transform: `translate(-50%,-50%) perspective(1500px) rotateX(${(1 - Math.min(1, k)) * 50}deg)`, fontFamily: FONT }}>
      <div style={{ width: 1000, padding: "30px 44px 36px", borderRadius: 26, background: "linear-gradient(180deg, rgba(40,10,8,.95), rgba(20,5,4,.95))", boxShadow: "0 0 0 6px #ff4a3d, 0 60px 110px rgba(0,0,0,.7)" }}>
        <div style={{ fontWeight: 900, fontSize: 64, color: "#ff4a3d", textAlign: "center", textShadow: extrude(6, "#300") }}>⚠ BLEACH + ANYTHING = NO</div>
        {rows.map((r, i) => { const s = e(t, r.at, r.at + 0.3); return (
          <div key={i} style={{ position: "relative", marginTop: 18, fontWeight: 900, fontSize: 52, color: COL.ink, textAlign: "center", opacity: e(t, r.at - 0.1, r.at + 0.05) }}>
            {r.tx}<div style={{ position: "absolute", left: "12%", top: "52%", height: 8, width: `${76 * s}%`, background: "#ff4a3d", borderRadius: 4 }} /></div>); })}
      </div>
    </div>
  );
};

// ===== min 4-5 · contador de "lugares" o "errores": casilleros que se encienden =====
export const Meter: React.FC<{ t: number; at: number; out: number; title: string; marks: number[]; col?: string; x?: number; y?: number }> = ({ t, at, out, title, marks, col = "#ffd60a", x = 70, y = 56 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, display: "flex", alignItems: "center", gap: 14, fontFamily: FONT, padding: "10px 18px", borderRadius: 16, background: "rgba(10,16,28,.82)", boxShadow: "0 16px 40px rgba(0,0,0,.5)" }}>
      <div style={{ fontWeight: 900, fontSize: 28, letterSpacing: 4, color: COL.ink, marginRight: 6 }}>{title}</div>
      {marks.map((m, i) => { const on = e(t, m, m + 0.2), k = k1(t, m); return (
        <div key={i} style={{ width: 54, height: 54, borderRadius: 12, display: "grid", placeItems: "center", fontWeight: 900, fontSize: 32, color: on > 0.5 ? "#141414" : "rgba(255,255,255,.45)",
          background: on > 0.5 ? col : "rgba(255,255,255,.08)", boxShadow: on > 0.5 ? `0 0 24px ${col}` : "inset 0 0 0 3px rgba(255,255,255,.2)", transform: `scale(${t >= m ? 0.8 + 0.2 * Math.min(1.1, k) : 1})` }}>{i + 1}</div>); })}
    </div>
  );
};

// ===== min 4 · pin numerado clavado en el mundo 3D =====
export const Pin: React.FC<{ t: number; at: number; out: number; x: number; y: number; n: number; tx: string; col?: string; dx?: number }> = ({ t, at, out, x, y, n, tx, col = "#ffd60a", dx = 1 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = k1(t, at, 1.1), drop = (1 - Math.min(1, k)) * -160;
  y = Math.min(1060, Math.max(140, y)); x = Math.min(1880, Math.max(50, x)); // el alfiler nunca queda cortado por el borde
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, fontFamily: FONT }}>
      <svg width={80} height={120} style={{ position: "absolute", left: -40, top: -116 + drop, overflow: "visible", filter: "drop-shadow(0 14px 14px rgba(0,0,0,.6))" }}>
        <path d="M40 116 L14 56 A32 32 0 1 1 66 56 Z" fill={col} stroke="#fff" strokeWidth={4} />
        <text x={40} y={60} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill="#141414">{n}</text>
      </svg>
      {tx && <div style={{ position: "absolute", top: -110 + drop, left: dx > 0 ? 40 : undefined, right: dx < 0 ? 40 : undefined, padding: "8px 18px", borderRadius: 12, background: "rgba(10,16,28,.88)", whiteSpace: "nowrap", fontWeight: 900, fontSize: 34, color: COL.ink, opacity: e(t, at + 0.2, at + 0.4) }}>{tx}</div>}
      <div style={{ position: "absolute", left: -30, top: -8, width: 60, height: 16, borderRadius: "50%", background: "rgba(0,0,0,.35)", transform: `scale(${Math.min(1, k)})` }} />
    </div>
  );
};

// ===== min 5-9 · la cinta del ERROR #N que entra barriendo =====
export const Mistake: React.FC<{ t: number; at: number; out: number; n: number; tx: string }> = ({ t, at, out, n, tx }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = ei(t, at, at + 0.45);
  return (
    <div style={{ position: "absolute", left: 0, top: 820, width: 1920, opacity: o, perspective: 1500, fontFamily: FONT }}>
      <div style={{ margin: "0 auto", width: 1400, transform: `translateX(${(1 - k) * -1800}px) rotateZ(-2deg) rotateY(-6deg)`, display: "flex", alignItems: "stretch", boxShadow: "0 40px 80px rgba(0,0,0,.6)" }}>
        <div style={{ background: "#ff4a3d", padding: "18px 34px", fontWeight: 900, fontSize: 64, color: "#fff", whiteSpace: "nowrap", textShadow: extrude(5, "#7a1610") }}>MISTAKE #{n}</div>
        <div style={{ flex: 1, background: "linear-gradient(180deg,#fbf8f0,#e4dfd2)", padding: "18px 34px", fontWeight: 900, fontSize: 64, color: "#1d2733", whiteSpace: "nowrap" }}>{tx}</div>
      </div>
    </div>
  );
};

// ===== min 6 · la ruta de la esponja: ducha → pileta → ventana (va "sembrando") =====
export const Route: React.FC<{ t: number; out: number; nodes: { at: number; tx: string; ic: string }[]; y?: number }> = ({ t, out, nodes, y = 170 }) => {
  const o = op(t, nodes[0].at, out); if (o <= 0.01) return null;
  const X = (i: number) => 360 + i * 600;
  const last = nodes.filter((n) => t >= n.at).length - 1;
  const seg = last < 0 ? 0 : last + Math.min(1, (t - nodes[last].at) / 0.8) * (last < nodes.length - 1 ? 0 : 0);
  const sx = X(Math.max(0, last)) + (last < nodes.length - 1 && last >= 0 ? (ei(t, nodes[last].at, (nodes[last + 1]?.at ?? 1e9)) * 600) : 0);
  void seg;
  return (
    <div style={{ position: "absolute", left: 0, top: y, width: 1920, height: 300, opacity: o, fontFamily: FONT }}>
      <svg width={1920} height={300} style={{ position: "absolute" }}><line x1={X(0)} x2={X(nodes.length - 1)} y1={120} y2={120} stroke="rgba(255,255,255,.7)" strokeWidth={8} strokeDasharray="4 22" strokeLinecap="round" /></svg>
      {nodes.map((n, i) => { const k = k1(t, n.at); return (
        <div key={i} style={{ position: "absolute", left: X(i), top: 120, transform: `translate(-50%,-50%) scale(${t >= n.at ? 0.6 + 0.4 * k : 0.6})`, opacity: t >= n.at ? 1 : 0.35, textAlign: "center" }}>
          <div style={{ width: 150, height: 150, borderRadius: 75, display: "grid", placeItems: "center", fontSize: 76, background: i === 0 ? "#2b3b2a" : "rgba(10,16,28,.9)", boxShadow: `0 0 0 6px ${t >= n.at && i > 0 ? "#ff4a3d" : "#9fd0ff"}, 0 24px 50px rgba(0,0,0,.6)` }}>{n.ic}</div>
          <div style={{ marginTop: 10, fontWeight: 900, fontSize: 38, color: COL.ink, textShadow: "0 3px 10px #000", whiteSpace: "nowrap" }}>{n.tx}</div>
        </div>); })}
      <div style={{ position: "absolute", left: sx, top: 30, transform: "translate(-50%,-50%) rotate(-12deg)", fontSize: 64 }}>🧽</div>
    </div>
  );
};

// ===== min 6 · reglas con tilde verde / cruz roja (tarjetas que caen apiladas) =====
export const Rules: React.FC<{ t: number; out: number; rows: { at: number; tx: string; ok: boolean }[]; x?: number; y?: number; w?: number }> = ({ t, out, rows, x = 1180, y = 200, w = 660 }) => (
  <div style={{ position: "absolute", left: x, top: y, perspective: 1300, fontFamily: FONT }}>
    {rows.map((r, i) => { const k = k1(t, r.at), o = op(t, r.at, out); if (o <= 0.01) return null; return (
      <div key={i} style={{ opacity: o, width: w, display: "flex", alignItems: "center", gap: 18, marginBottom: 20, padding: "16px 24px", borderRadius: 18, background: r.ok ? CARD : "linear-gradient(180deg,#6a1c18,#3e0d0b)",
        transform: `translateY(${(1 - Math.min(1, k)) * -120}px) rotateX(${(1 - Math.min(1, k)) * -60}deg) rotateY(-12deg) rotateZ(${(i % 2 ? 1 : -1) * 1.2}deg)`, boxShadow: "0 26px 50px rgba(0,0,0,.55)" }}>
        <div style={{ fontSize: 52 }}>{r.ok ? "✅" : "❌"}</div>
        <div style={{ fontWeight: 900, fontSize: 40, color: r.ok ? "#1d2733" : "#fff", lineHeight: 1.1 }}>{r.tx}</div>
      </div>); })}
  </div>
);

// ===== min 7 · corte del cordón: hasta dónde llega la lejía y hasta dónde llegan las raíces =====
export const Depth: React.FC<{ t: number; at: number; deep: number; out: number; x?: number; y?: number }> = ({ t, at, deep, out, x = 1420, y = 170 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const b = e(t, at + 0.2, at + 1.0), d = e(t, deep, deep + 0.8), pulse = 0.7 + 0.3 * Math.sin(t * 6);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, fontFamily: FONT, perspective: 1200 }}>
      <div style={{ transform: "rotateY(-14deg)", width: 420, height: 560, borderRadius: 22, background: "linear-gradient(180deg,#e9efee,#c8d2d1)", boxShadow: "0 40px 80px rgba(0,0,0,.6)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 90 * b, background: "rgba(255,255,255,.95)", borderBottom: "6px dashed #ffd60a" }} />
        {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: "absolute", left: 30 + i * 42, top: 70, width: 8, height: 60 + (i * 37 % 300) * d + 120 * d, borderRadius: 4, background: `rgba(60,140,40,${pulse})`, boxShadow: "0 0 14px rgba(110,220,80,.8)" }} />)}
        <div style={{ position: "absolute", left: 16, top: 98 * b + 10, fontWeight: 900, fontSize: 26, color: "#7a6200", opacity: b }}>BLEACH STOPS HERE</div>
        <div style={{ position: "absolute", left: 16, bottom: 16, fontWeight: 900, fontSize: 34, color: "#1f6b12", opacity: d }}>THREADS STILL ALIVE</div>
      </div>
    </div>
  );
};

// ===== min 8 · el círculo vicioso: flecha que gira por 4 estaciones =====
export const Cycle: React.FC<{ t: number; at: number; out: number; nodes: { at: number; tx: string }[]; x?: number; y?: number }> = ({ t, at, out, nodes, x = 1450, y = 520 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const R = 260, rot = (t - at) * 40;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, fontFamily: FONT }}>
      <svg width={2 * R + 60} height={2 * R + 60} style={{ position: "absolute", left: -R - 30, top: -R - 30, transform: `rotate(${rot}deg)` }}>
        <circle cx={R + 30} cy={R + 30} r={R} fill="none" stroke="rgba(255,74,61,.85)" strokeWidth={10} strokeDasharray="60 30" />
        <polygon points={`${2 * R + 30},${R + 10} ${2 * R + 52},${R + 52} ${2 * R + 8},${R + 52}`} fill="#ff4a3d" />
      </svg>
      {nodes.map((n, i) => { const a = -Math.PI / 2 + i * Math.PI / 2, k = k1(t, n.at); return (
        <div key={i} style={{ position: "absolute", left: Math.cos(a) * R, top: Math.sin(a) * R, transform: `translate(-50%,-50%) scale(${t >= n.at ? 0.5 + 0.5 * Math.min(1.1, k) : 0})`, padding: "12px 20px", borderRadius: 14, background: CARD, fontWeight: 900, fontSize: 32, color: "#1d2733", whiteSpace: "nowrap", boxShadow: "0 20px 40px rgba(0,0,0,.55)" }}>{n.tx}</div>); })}
    </div>
  );
};

// ===== min 8 · pintar encima: el rodillo tapa la mancha… y la mancha vuelve en ampollas =====
export const PaintOver: React.FC<{ t: number; at: number; back: number; out: number; x?: number; y?: number }> = ({ t, at, back, out, x = 1340, y = 170 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const p = ei(t, at + 0.3, at + 1.6), b = e(t, back, back + 1.2);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1200, fontFamily: FONT }}>
      <div style={{ transform: "rotateY(-16deg)", width: 480, height: 400, borderRadius: 18, background: "#e9e4da", boxShadow: "0 40px 80px rgba(0,0,0,.6)", position: "relative", overflow: "hidden" }}>
        {Array.from({ length: 70 }, (_, i) => { const a = i * 2.39, r = Math.sqrt(i) * 17; return <div key={i} style={{ position: "absolute", left: 240 + Math.cos(a) * r, top: 200 + Math.sin(a) * r * 0.8, width: 10 + (i % 5) * 4, height: 10 + (i % 5) * 4, borderRadius: "50%", background: i % 4 ? "#141613" : "#2e3b27" }} />; })}
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${100 * p}%`, background: "linear-gradient(90deg,#fbfaf6,#f1eee6)" }} />
        {Array.from({ length: 16 }, (_, i) => { const a = i * 2.39, r = Math.sqrt(i) * 34; return <div key={i} style={{ position: "absolute", left: 240 + Math.cos(a) * r, top: 200 + Math.sin(a) * r * 0.8, width: 26 * b, height: 26 * b, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #fff, #d9d3c6 55%, #2a2f26 80%)", boxShadow: "0 4px 8px rgba(0,0,0,.35)" }} />; })}
        <div style={{ position: "absolute", left: 0, right: 0, top: 168, textAlign: "center", fontWeight: 900, fontSize: 52, color: "#8a8478", opacity: e(t, at + 1.4, at + 1.8) * (1 - b) }}>LOOKS CLEAN…</div>
        <div style={{ position: "absolute", left: `${100 * p}%`, top: -10, width: 70, height: 420, transform: "translateX(-50%)", background: "linear-gradient(90deg,#c9c4b8,#fff,#c9c4b8)", borderRadius: 30, opacity: p < 1 ? 1 : 0, boxShadow: "0 0 20px rgba(0,0,0,.4)" }} />
      </div>
      <div style={{ marginTop: 16, fontWeight: 900, fontSize: 40, color: "#ff8a7a", textShadow: "0 3px 10px #000", opacity: b }}>STILL GROWING UNDER IT</div>
    </div>
  );
};

// ===== min 9 · las pestañas del método según lo que dio el test =====
export const Tabs: React.FC<{ t: number; at: number; out: number; tabs: { at: number; tx: string }[] }> = ({ t, at, out, tabs }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const cur = tabs.filter((x) => t >= x.at).length - 1;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 44, display: "flex", justifyContent: "center", gap: 14, opacity: o, fontFamily: FONT }}>
      {tabs.map((x, i) => { const on = i === cur; return (
        <div key={i} style={{ padding: "12px 28px", borderRadius: 14, fontWeight: 900, fontSize: on ? 38 : 30, letterSpacing: 2, color: on ? "#141414" : "rgba(255,255,255,.7)", background: on ? "#ffd60a" : "rgba(10,16,28,.82)",
          boxShadow: on ? "0 0 30px rgba(255,214,10,.6), 0 16px 30px rgba(0,0,0,.5)" : "0 12px 24px rgba(0,0,0,.4)", transform: `translateY(${on ? 6 : 0}px)` }}>IF IT WAS {x.tx}</div>); })}
    </div>
  );
};

// ===== min 9 · pasos numerados que se tildan (las tiras de la noche) =====
export const Steps: React.FC<{ t: number; at: number; out: number; steps: { at: number; tx: string }[]; x?: number; y?: number }> = ({ t, at, out, steps, x = 70, y = 200 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1300, fontFamily: FONT }}>
      <div style={{ transform: "rotateY(14deg)", width: 560, padding: "22px 26px", borderRadius: 22, background: DARK, boxShadow: "0 40px 80px rgba(0,0,0,.6), 0 0 0 3px #9fd0ff88" }}>
        {steps.map((s, i) => { const on = t >= s.at, k = k1(t, s.at); return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, margin: "8px 0", opacity: on ? 1 : 0.35 }}>
            <div style={{ width: 52, height: 52, borderRadius: 26, display: "grid", placeItems: "center", fontWeight: 900, fontSize: 30, background: on ? "#9fd0ff" : "rgba(255,255,255,.12)", color: "#0b1424", transform: `scale(${on ? 0.8 + 0.2 * Math.min(1.1, k) : 1})` }}>{i + 1}</div>
            <div style={{ fontWeight: 900, fontSize: 38, color: COL.ink }}>{s.tx}</div>
          </div>); })}
      </div>
    </div>
  );
};

// ===== min 9 · el reloj de la noche: 8 horas en 3 segundos =====
export const Clock: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const h = ei(t, at + 0.2, at + 3.2) * 8, k = k1(t, at, 0.9);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.5 + 0.5 * Math.min(1, k)})`, textAlign: "center", fontFamily: FONT }}>
      <svg width={300} height={300} style={{ filter: "drop-shadow(0 20px 30px rgba(0,0,0,.6))" }}>
        <circle cx={150} cy={150} r={130} fill="#f7f3e8" stroke="#2b3240" strokeWidth={14} />
        {Array.from({ length: 12 }, (_, i) => <line key={i} x1={150} y1={30} x2={150} y2={48} stroke="#2b3240" strokeWidth={6} transform={`rotate(${i * 30} 150 150)`} />)}
        <line x1={150} y1={150} x2={150} y2={80} stroke="#2b3240" strokeWidth={12} strokeLinecap="round" transform={`rotate(${(22 + h) * 30} 150 150)`} />
        <line x1={150} y1={150} x2={150} y2={50} stroke="#d7261e" strokeWidth={7} strokeLinecap="round" transform={`rotate(${h * 360} 150 150)`} />
        <circle cx={150} cy={150} r={10} fill="#2b3240" />
      </svg>
      <div style={{ fontWeight: 900, fontSize: 64, color: "#ffd60a", textShadow: extrude(6, "#5a4500") }}>{Math.round(h)} HOURS</div>
    </div>
  );
};

// ===== min 10 · la química: agua oxigenada → agua + oxígeno (las burbujas) =====
export const Chem: React.FC<{ t: number; at: number; o2: number; water: number; out: number }> = ({ t, at, o2, water, out }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = k1(t, at, 0.9), a = e(t, o2, o2 + 0.4), w = e(t, water, water + 0.4);
  const B = ({ c, l }: { c: string; l: string }) => <div style={{ padding: "16px 30px", borderRadius: 20, background: c, fontWeight: 900, fontSize: 70, color: "#fff", textShadow: extrude(5, "rgba(0,0,0,.4)"), boxShadow: "0 26px 50px rgba(0,0,0,.55)" }}>{l}</div>;
  return (
    <div style={{ position: "absolute", left: 960, top: 210, opacity: o, transform: `translate(-50%,-50%) perspective(1400px) rotateX(${(1 - Math.min(1, k)) * 60}deg)`, display: "flex", alignItems: "center", gap: 26, fontFamily: FONT }}>
      <B c="#5a3216" l="H₂O₂" />
      <div style={{ fontSize: 80, color: "#fff" }}>➜</div>
      <div style={{ opacity: w, transform: `scale(${0.6 + 0.4 * w})` }}><B c="#2d6cdf" l="H₂O" /></div>
      <div style={{ fontSize: 70, color: "#fff", opacity: a }}>+</div>
      <div style={{ opacity: a, transform: `scale(${0.6 + 0.4 * a})` }}><B c="#1c9b4a" l="O₂ 🫧" /></div>
    </div>
  );
};

// ===== min 10 · la botella marrón frena la luz =====
export const BottleLight: React.FC<{ t: number; at: number; out: number; x?: number; y?: number }> = ({ t, at, out, x = 1380, y = 160 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const r = e(t, at + 0.2, at + 1.0);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, fontFamily: FONT }}>
      <svg width={460} height={520}>
        {Array.from({ length: 6 }, (_, i) => <line key={i} x1={0} y1={60 + i * 60} x2={150 * r} y2={60 + i * 60} stroke="#ffe27a" strokeWidth={10} strokeLinecap="round" opacity={0.9} />)}
        <rect x={170} y={110} width={180} height={360} rx={40} fill="#5a3216" stroke="#2b1708" strokeWidth={6} />
        <rect x={225} y={50} width={70} height={70} rx={10} fill="#f2f2ee" />
        <rect x={190} y={140} width={30} height={290} rx={14} fill="rgba(255,255,255,.18)" />
      </svg>
      <div style={{ fontWeight: 900, fontSize: 40, color: "#ffd60a", textShadow: "0 3px 10px #000", textAlign: "center", width: 460 }}>LIGHT BREAKS IT DOWN</div>
    </div>
  );
};

// ===== min 11 · 10 pies²: el cuadrado de 3 x 3 pies contra un plato =====
export const SqPlate: React.FC<{ t: number; at: number; plate: number; out: number; x?: number; y?: number }> = ({ t, at, plate, out, x = 1340, y = 150 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const d = ei(t, at + 0.1, at + 1.2), p = k1(t, plate);
  const S = 420, L = 4 * S * d;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, fontFamily: FONT, perspective: 1200 }}>
      <div style={{ transform: "rotateY(-12deg) rotateX(8deg)", position: "relative", width: S + 40, height: S + 90 }}>
        <svg width={S + 40} height={S + 40} style={{ position: "absolute", left: 0, top: 0 }}>
          <rect x={20} y={20} width={S} height={S} fill="rgba(255,214,10,.08)" stroke="#ffd60a" strokeWidth={8} strokeDasharray={`${L} ${4 * S}`} />
          {t >= plate && <circle cx={20 + S / 2} cy={20 + S / 2} r={70 * Math.min(1.1, p)} fill="#f4f1ea" stroke="#c9c2b2" strokeWidth={8} />}
          {t >= plate && <circle cx={20 + S / 2} cy={20 + S / 2} r={44 * Math.min(1.1, p)} fill="none" stroke="#d9d2c3" strokeWidth={4} />}
        </svg>
        <div style={{ position: "absolute", left: 0, top: S + 46, width: S + 40, textAlign: "center", fontWeight: 900, fontSize: 40, color: "#ffd60a", textShadow: "0 3px 10px #000", opacity: d }}>3 FT × 3 FT = 10 SQ FT</div>
        <div style={{ position: "absolute", left: 0, top: S / 2 + 100, width: S + 40, textAlign: "center", fontWeight: 900, fontSize: 30, color: "#fff", textShadow: "0 3px 10px #000", opacity: e(t, plate + 0.3, plate + 0.6) }}>DINNER PLATE</div>
      </div>
    </div>
  );
};

// ===== min 11 · la balanza: US$27 una vez contra US$3.000 =====
export const Scale: React.FC<{ t: number; at: number; heavy: number; out: number }> = ({ t, at, heavy, out }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const tilt = 14 * ei(t, heavy, heavy + 0.9), k = k1(t, at, 0.9);
  const Pan = ({ l, c, dy }: { l: string; c: string; dy: number }) => (
    <div style={{ position: "absolute", top: 40 + dy, transform: "translateX(-50%)", textAlign: "center" }}>
      <div style={{ width: 4, height: 90, background: "#d9d2c3", margin: "0 auto" }} />
      <div style={{ padding: "14px 30px", borderRadius: 18, background: c, fontWeight: 900, fontSize: 66, color: "#fff", textShadow: extrude(5, "rgba(0,0,0,.4)"), boxShadow: "0 24px 50px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>{l}</div>
    </div>);
  return (
    <div style={{ position: "absolute", left: 960, top: 600, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * Math.min(1, k)})`, fontFamily: FONT, width: 1100, height: 420 }}>
      <div style={{ position: "absolute", left: 540, top: 40, width: 20, height: 360, background: "linear-gradient(90deg,#8a7a5a,#d9c9a0,#8a7a5a)", borderRadius: 8 }} />
      <div style={{ position: "absolute", left: 100, top: 30, width: 900, height: 16, background: "#d9c9a0", borderRadius: 8, transform: `rotate(${tilt}deg)`, transformOrigin: "50% 50%" }}>
        <div style={{ position: "absolute", left: 0 }}><Pan l="$27 · ONCE" c="#1c9b4a" dy={-tilt * 7.5} /></div>
        <div style={{ position: "absolute", left: 900 }}><Pan l="$3,000" c="#b3261e" dy={tilt * 7.5} /></div>
      </div>
    </div>
  );
};

// ===== min 12 · checklist de "llamá a un profesional" (casillas rojas) =====
export const ProList: React.FC<{ t: number; at: number; out: number; rows: { at: number; tx: string }[]; x?: number; y?: number }> = ({ t, at, out, rows, x = 70, y = 150 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = k1(t, at, 0.9);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1400, fontFamily: FONT }}>
      <div style={{ width: 760, padding: "24px 30px", borderRadius: 22, background: CARD, transform: `rotateY(${14 + (1 - Math.min(1, k)) * 50}deg)`, boxShadow: "0 50px 90px rgba(0,0,0,.6)" }}>
        <div style={{ fontWeight: 900, fontSize: 40, color: "#b3261e", letterSpacing: 2 }}>📞 CALL A PRO IF…</div>
        {rows.map((r, i) => { const c = e(t, r.at, r.at + 0.25); return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 14, opacity: 0.3 + 0.7 * c }}>
            <div style={{ width: 46, height: 46, borderRadius: 10, border: "5px solid #b3261e", display: "grid", placeItems: "center", fontWeight: 900, fontSize: 34, color: "#b3261e" }}>{c > 0.5 ? "✓" : ""}</div>
            <div style={{ fontWeight: 900, fontSize: 36, color: "#1d2733" }}>{r.tx}</div>
          </div>); })}
      </div>
    </div>
  );
};

// ===== min 12 · la gota: "el agua es el problema" =====
export const Drop: React.FC<{ t: number; at: number; out: number; x: number; y: number; tx: string }> = ({ t, at, out, x, y, tx }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = k1(t, at, 0.8), wob = 1 + 0.03 * Math.sin(t * 5);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) translateY(${(1 - Math.min(1, k)) * -400}px)`, textAlign: "center", fontFamily: FONT }}>
      <svg width={260} height={340} style={{ transform: `scale(${wob}, ${2 - wob})`, filter: "drop-shadow(0 26px 30px rgba(0,0,0,.6))" }}>
        <defs><radialGradient id="dg" cx=".35" cy=".6" r=".7"><stop offset="0" stopColor="#d9f3ff" /><stop offset=".5" stopColor="#5fb2ff" /><stop offset="1" stopColor="#1d5fb8" /></radialGradient></defs>
        <path d="M130 10 C130 10 30 160 30 220 A100 100 0 0 0 230 220 C230 160 130 10 130 10 Z" fill="url(#dg)" />
        <ellipse cx={95} cy={210} rx={22} ry={36} fill="rgba(255,255,255,.55)" />
      </svg>
      <div style={{ fontWeight: 900, fontSize: 56, color: COL.ink, textShadow: extrude(6, "#0a2a40"), whiteSpace: "nowrap" }}>{tx}</div>
    </div>
  );
};

// ===== min 13 · el almanaque de los sábados: cada sábado el cepillo y una mancha nueva =====
export const Saturdays: React.FC<{ t: number; at: number; out: number; y?: number }> = ({ t, at, out, y = 760 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 18, opacity: o, fontFamily: FONT, perspective: 1200 }}>
      {Array.from({ length: 6 }, (_, i) => { const a = at + i * 0.55, k = k1(t, a); return (
        <div key={i} style={{ width: 210, borderRadius: 16, overflow: "hidden", background: CARD, boxShadow: "0 24px 44px rgba(0,0,0,.55)", opacity: e(t, a, a + 0.1), transform: `rotateX(${(1 - Math.min(1, k)) * 80}deg)`, transformOrigin: "50% 0" }}>
          <div style={{ background: "#b3261e", color: "#fff", fontWeight: 900, fontSize: 30, textAlign: "center", padding: "6px 0" }}>SAT</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 6, padding: "12px 0", fontSize: 44 }}>🪥{"⚫".repeat(Math.min(3, 1 + Math.floor(i / 2)))}</div>
        </div>); })}
    </div>
  );
};

// ===== min 14 · el repaso: tarjetas que se tildan con cada frase =====
export const Recap: React.FC<{ t: number; at: number; out: number; groups: { head: string; c: string; rows: { at: number; tx: string }[] }[]; x?: number; y?: number }> = ({ t, at, out, groups, x = 60, y = 110 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const all = groups.flatMap((g) => g.rows.map((r) => ({ ...r, c: g.c, head: g.head })));
  const shown = all.filter((r) => t >= r.at - 0.05);
  const vis = shown.slice(-6);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1400, fontFamily: FONT }}>
      <div style={{ transform: "rotateY(12deg)", width: 700 }}>
        {vis.map((r, i) => { const k = k1(t, r.at), last = i === vis.length - 1; return (
          <div key={r.at} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14, padding: "12px 20px", borderRadius: 16, background: last ? "linear-gradient(180deg,#fbf8f0,#e4dfd2)" : "rgba(10,16,28,.85)",
            boxShadow: `0 20px 40px rgba(0,0,0,.5), 0 0 0 3px ${r.c}`, transform: `translateX(${(1 - Math.min(1, k)) * -300}px)`, opacity: 0.55 + 0.45 * (last ? 1 : 0.6) }}>
            <div style={{ padding: "4px 12px", borderRadius: 8, background: r.c, fontWeight: 900, fontSize: 22, color: "#141414", letterSpacing: 2 }}>{r.head}</div>
            <div style={{ fontWeight: 900, fontSize: 36, color: last ? "#1d2733" : COL.ink, whiteSpace: "nowrap" }}>{r.tx}</div>
          </div>); })}
      </div>
    </div>
  );
};

// ===== cierre · el comentario de YouTube que escribe la gente =====
export const Comment: React.FC<{ t: number; at: number; out: number; x?: number; y?: number }> = ({ t, at, out, x = 1150, y = 640 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = k1(t, at, 0.9), tx = "Mold. It got lighter in 2 minutes!", n = Math.round(tx.length * e(t, at + 0.3, at + 2.2));
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1200, fontFamily: FONT }}>
      <div style={{ width: 680, padding: "22px 26px", borderRadius: 22, background: "#fff", boxShadow: "0 40px 80px rgba(0,0,0,.6)", transform: `rotateY(-12deg) translateY(${(1 - Math.min(1, k)) * 200}px)` }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 28, background: "#d6a77a", display: "grid", placeItems: "center", fontSize: 30 }}>🙂</div>
          <div style={{ fontWeight: 800, fontSize: 26, color: "#606060" }}>@you · just now</div>
        </div>
        <div style={{ marginTop: 12, fontWeight: 800, fontSize: 36, color: "#0f0f0f", minHeight: 46 }}>{tx.slice(0, n)}<span style={{ opacity: Math.sin(t * 8) > 0 ? 1 : 0 }}>|</span></div>
        <div style={{ marginTop: 10, display: "flex", gap: 26, fontSize: 30, color: "#606060" }}><span>👍 1</span><span style={{ opacity: e(t, at + 2.6, at + 2.9) }}>❤️ Rhonda</span></div>
      </div>
    </div>
  );
};

// ===== cierre · garantía de 7 días (sello) =====
export const Guarantee: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = k1(t, at, 1.2), r = (t - at) * 20;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${2 - Math.min(1, k)}) rotate(${-12 + (1 - Math.min(1, k)) * 30}deg)`, fontFamily: FONT }}>
      <div style={{ width: 280, height: 280, borderRadius: "50%", display: "grid", placeItems: "center", background: "radial-gradient(circle,#ffe27a,#d9a400)", boxShadow: "0 30px 60px rgba(0,0,0,.6), inset 0 0 0 10px #fff3", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 14, borderRadius: "50%", border: "5px dashed #7a5a00", transform: `rotate(${r}deg)` }} />
        <div><div style={{ fontWeight: 900, fontSize: 92, color: "#3d2a00", lineHeight: 0.9 }}>7</div><div style={{ fontWeight: 900, fontSize: 28, color: "#3d2a00", letterSpacing: 2 }}>DAY MONEY-BACK</div></div>
      </div>
    </div>
  );
};

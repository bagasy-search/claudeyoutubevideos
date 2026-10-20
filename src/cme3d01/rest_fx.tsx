// cme3d01 · piezas 2.5D NUEVAS del resto del video (1:39 → final). Misma familia que lib.tsx (texto extruido,
// perspectiva real, resortes) pero hechas para ESTE video: la batería que se vacía, la cuenta 15 W × 24 h,
// los errores, los "nunca", los pasos del orden, la fórmula batería ÷ consumo y la fila de focos.
import React from "react";
import { COL, FONT, e, ei, extrude, spr } from "./lib";

const op = (t: number, a: number, out: number, fi = 0.18, fo = 0.3) => e(t, a - 0.02, a + fi) * (1 - e(t, out, out + fo));
const k1 = (t: number, a: number, f = 1) => Math.min(1, spr(t, a, f));
const GREEN = "#38ff7a";

// ---------- batería 2.5D con % que baja/sube: pasos [{at, v}] ----------
export const SocBadge: React.FC<{ t: number; at: number; out: number; steps: { at: number; v: number; note?: string }[]; x?: number; y?: number }> = ({ t, at, out, steps, x = 1480, y = 430 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  let v = steps[0].v, note: string | undefined;
  for (let i = 1; i < steps.length; i++) { const s = steps[i]; const k = ei(t, s.at, s.at + 0.7); v = v + (s.v - v) * k; if (t >= s.at) note = s.note ?? note; }
  if (t < steps[1]?.at) note = steps[0].note;
  const col = v < 15 ? (Math.sin(t * 9) > 0 ? COL.red : "#8f1a12") : v < 45 ? COL.amber : GREEN;
  const k = k1(t, at, 0.9);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1200 }}>
      <div style={{ transform: `translate(-50%,-50%) translateZ(${(1 - k) * -500}px) rotateY(${-14 + 3 * Math.sin(t * 0.8)}deg) rotateX(6deg)`, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: FONT }}>
        <div style={{ position: "relative", width: 300, height: 470 }}>
          <div style={{ position: "absolute", left: 105, top: 0, width: 90, height: 34, borderRadius: "10px 10px 0 0", background: "#2a2f36" }} />
          <div style={{ position: "absolute", left: 0, top: 30, width: 300, height: 440, borderRadius: 34, background: "linear-gradient(90deg,#1b1f25,#2c323a 50%,#171a1f)", boxShadow: "0 50px 100px rgba(0,0,0,.7), inset 0 0 0 6px #3b424c" }} />
          <div style={{ position: "absolute", left: 22, bottom: 22, width: 256, height: 396 * Math.max(0.03, v / 100), borderRadius: 20, background: `linear-gradient(180deg, ${col}, ${col}aa)`, boxShadow: `0 0 40px ${col}88` }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", fontWeight: 900, fontSize: 120, color: COL.ink, textShadow: extrude(8, "rgba(0,0,0,.85)") }}>{Math.round(v)}%</div>
        </div>
        {note && <div style={{ marginTop: 22, fontWeight: 900, fontSize: 50, letterSpacing: 2, color: col, textShadow: extrude(5, "rgba(0,0,0,.8)"), whiteSpace: "nowrap" }}>{note}</div>}
      </div>
    </div>
  );
};

// ---------- la cuenta: términos que caen uno por uno ("15 W" × "24 h" = "360 Wh") ----------
export const Eq: React.FC<{ t: number; out: number; terms: { at: number; txt: string; col?: string; op?: string }[]; y?: number; size?: number; sub?: { at: number; txt: string } }> = ({ t, out, terms, y = 470, size = 150, sub }) => {
  const o = op(t, terms[0].at - 0.05, out); if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 960, top: y, opacity: o, perspective: 1400 }}>
      <div style={{ transform: `translate(-50%,-50%) rotateX(8deg) rotateY(${-5 + 2 * Math.sin(t * 0.6)}deg)`, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: FONT, padding: "34px 60px", borderRadius: 30, background: "rgba(10,14,20,.86)", boxShadow: "0 60px 120px rgba(0,0,0,.7), inset 0 0 0 3px rgba(255,178,87,.35)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 34, whiteSpace: "nowrap" }}>
          {terms.map((x, i) => {
            const k = k1(t, x.at, 1.1), v = e(t, x.at, x.at + 0.1);
            return <React.Fragment key={i}>
              {i > 0 && <span style={{ fontWeight: 800, fontSize: size * 0.55, color: COL.dim, opacity: v }}>{x.op ?? "×"}</span>}
              <span style={{ fontWeight: 900, fontSize: size, color: x.col ?? COL.ink, opacity: v, display: "inline-block", transform: `translateY(${(1 - k) * -160}px) scale(${0.6 + 0.4 * k})`, textShadow: extrude(9, "rgba(0,0,0,.8)") }}>{x.txt}</span>
            </React.Fragment>;
          })}
        </div>
        {sub && t > sub.at && <div style={{ marginTop: 14, fontWeight: 800, fontSize: 46, letterSpacing: 3, color: COL.amber, opacity: e(t, sub.at, sub.at + 0.2) }}>{sub.txt}</div>}
      </div>
    </div>
  );
};

// ---------- ERROR #n / NUNCA #n: losa roja numerada que cae y se apoya ----------
export const ErrCard: React.FC<{ t: number; at: number; n: number; txt: string; out: number; kind?: "ERROR" | "NUNCA"; x?: number; y?: number }> = ({ t, at, n, txt, out, kind = "ERROR", x = 960, y = 860 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = k1(t, at, 1.1);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1300px) rotateX(${(1 - k) * -80 + 6}deg) scale(${0.8 + 0.2 * k})`, transformOrigin: "50% 0", display: "flex", alignItems: "center", fontFamily: FONT, whiteSpace: "nowrap" }}>
      <div style={{ width: 160, height: 160, borderRadius: 26, background: `linear-gradient(180deg, ${COL.red}, #8f1a12)`, color: "#fff", fontWeight: 900, fontSize: kind === "NUNCA" ? 120 : 100, lineHeight: "160px", textAlign: "center", boxShadow: "0 30px 60px rgba(0,0,0,.6)", textShadow: extrude(6, "#5a0d08"), zIndex: 1 }}>{kind === "NUNCA" ? "✕" : n}</div>
      <div style={{ marginLeft: -14, padding: "24px 44px 24px 50px", borderRadius: "0 22px 22px 0", background: "rgba(12,8,8,.9)", boxShadow: "0 30px 60px rgba(0,0,0,.6), inset 0 0 0 2px rgba(255,74,61,.5)" }}>
        <div style={{ fontWeight: 800, fontSize: 26, letterSpacing: 8, color: COL.red }}>{kind === "NUNCA" ? `NUNCA · ${n}` : `ERROR Nº ${n}`}</div>
        <div style={{ fontWeight: 900, fontSize: 60, color: COL.ink, textShadow: extrude(5, "rgba(0,0,0,.8)") }}>{txt}</div>
      </div>
    </div>
  );
};

// ---------- PASO n del orden: número gigante + aparato + consumo ----------
export const Paso: React.FC<{ t: number; at: number; n: number; name: string; val?: string; valAt?: number; out: number; x?: number; y?: number }> = ({ t, at, n, name, val, valAt = at, out, x = 70, y = 200 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = k1(t, at, 0.9), sw = e(t, at + 0.15, at + 0.75);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1200 }}>
      <div style={{ transform: `translate(0,-50%) translateZ(${(1 - k) * -700}px) rotateY(${16 - 4 * Math.sin(t * 0.7)}deg)`, transformOrigin: "0 50%", display: "flex", alignItems: "center", gap: 26, fontFamily: FONT, whiteSpace: "nowrap", position: "relative", overflow: "hidden", padding: "10px 34px 10px 10px", borderRadius: 26, background: "rgba(10,14,20,.82)", boxShadow: "0 40px 80px rgba(0,0,0,.6)" }}>
        <div style={{ fontWeight: 900, fontSize: 190, lineHeight: 1, color: COL.amber, textShadow: extrude(12, "#5a3200") }}>{n}</div>
        <div>
          <div style={{ fontWeight: 900, fontSize: 70, color: COL.ink, textShadow: extrude(5, "#000") }}>{name}</div>
          {val && <div style={{ fontWeight: 800, fontSize: 46, color: GREEN, opacity: e(t, valAt, valAt + 0.2), letterSpacing: 2 }}>{val}</div>}
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(100deg, transparent 30%, rgba(255,240,210,.35) 50%, transparent 70%)", transform: `translateX(${(sw * 2 - 1) * 120}%)` }} />
      </div>
    </div>
  );
};

// ---------- fila de N focos que se prenden en cascada (y se apagan juntos) ----------
export const BulbRow: React.FC<{ t: number; at: number; off: number; out: number; n?: number; y?: number; label?: string }> = ({ t, at, off, out, n = 12, y = 120, label }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const W = 120;
  return (
    <div style={{ position: "absolute", left: 960 - (n * W) / 2, top: y, opacity: o, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: FONT }}>
      <div style={{ display: "flex" }}>
        {Array.from({ length: n }, (_, i) => {
          const lit = e(t, at + i * 0.08, at + i * 0.08 + 0.12) * (1 - e(t, off, off + 0.25)), k = k1(t, at + i * 0.08, 1.2);
          return <div key={i} style={{ width: W, display: "flex", flexDirection: "column", alignItems: "center", transform: `translateY(${(1 - k) * -120}px) rotate(${Math.sin(t * 2 + i) * 3}deg)`, transformOrigin: "50% 0" }}>
            <div style={{ width: 4, height: 50, background: "#222" }} />
            <div style={{ width: 26, height: 22, background: "#8d9198", borderRadius: 4 }} />
            <div style={{ width: 74, height: 86, borderRadius: "50% 50% 44% 44%", background: lit > 0.05 ? `radial-gradient(circle at 50% 45%, rgba(255,246,210,${lit}), rgba(255,190,90,${0.7 * lit}) 60%, rgba(255,250,235,.25))` : "rgba(255,250,235,.22)", border: "3px solid rgba(255,255,255,.7)", boxShadow: lit > 0.05 ? `0 0 ${60 * lit}px rgba(255,200,110,${0.9 * lit})` : "none" }} />
          </div>;
        })}
      </div>
      {label && <div style={{ marginTop: 18, fontWeight: 900, fontSize: 54, color: COL.ink, textShadow: extrude(5, "#000"), opacity: e(t, at + 0.5, at + 0.8), whiteSpace: "nowrap" }}>{label}</div>}
    </div>
  );
};

// ---------- la fórmula: BATERÍA ÷ CONSUMO = DÍAS, con el ejemplo propio que cae abajo ----------
export const Formula: React.FC<{ t: number; at: number; ex: number; exAt: number; out: number }> = ({ t, at, ex, exAt, out }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = k1(t, at, 0.9);
  const cell = (txt: string, a: number, col: string) => <span style={{ display: "inline-block", fontWeight: 900, fontSize: 92, color: col, opacity: e(t, a, a + 0.12), transform: `translateZ(${(1 - k1(t, a, 1.2)) * -400}px)`, textShadow: extrude(7, "rgba(0,0,0,.85)") }}>{txt}</span>;
  return (
    <div style={{ position: "absolute", left: 960, top: 420, opacity: o, perspective: 1400 }}>
      <div style={{ transform: `translate(-50%,-50%) translateZ(${(1 - k) * -600}px) rotateX(10deg) rotateY(${-6 + 2 * Math.sin(t * 0.7)}deg)`, transformStyle: "preserve-3d", padding: "34px 56px", borderRadius: 28, background: "rgba(10,14,20,.9)", boxShadow: "0 60px 120px rgba(0,0,0,.7), inset 0 0 0 3px rgba(56,255,122,.35)", fontFamily: FONT, textAlign: "center", whiteSpace: "nowrap" }}>
        <div style={{ display: "flex", gap: 30, alignItems: "center", justifyContent: "center" }}>
          {cell("TU BATERÍA", at, COL.ink)}{cell("÷", at + 0.4, COL.dim)}{cell("TU CONSUMO", at + 0.6, COL.amber)}{cell("=", at + 1.2, COL.dim)}{cell("DÍAS", at + 1.5, GREEN)}
        </div>
        <div style={{ marginTop: 16, fontWeight: 800, fontSize: 52, color: COL.dim, opacity: e(t, exAt, exAt + 0.25) }}>
          1280 Wh ÷ 330 Wh/día ≈ <span style={{ color: GREEN, fontWeight: 900 }}>{(ex * e(t, exAt + 0.2, exAt + 1.0)).toFixed(1).replace(".", ",")} DÍAS</span>
        </div>
      </div>
    </div>
  );
};

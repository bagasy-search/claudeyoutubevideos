// piezas 2.5D base (copiadas del kit de gary01; acá sólo se usan Versus, Words y CheckList con textos propios). Misma familia que lib.tsx: texto extruido,
// perspectiva real, resortes, todo anclado a la palabra. Cada una entra y sale sola (o = entrada × salida).
import React from "react";
import { AbsoluteFill } from "remotion";
import { COL, FONT, e, ei, extrude, spr } from "./lib";

const op = (t: number, a: number, out: number, fi = 0.18, fo = 0.3) => e(t, a - 0.02, a + fi) * (1 - e(t, out, out + fo));
const k1 = (t: number, a: number, f = 1) => Math.min(1, spr(t, a, f));

// ---------- PASO N: tarjeta de capítulo que cae del fondo, número gigante extruido + nombre, barrido de luz ----------
export const StepTitle: React.FC<{ t: number; at: number; n: number; name: string; out: number; col?: string; y?: number }> = ({ t, at, n, name, out, col = COL.amber, y = 520 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = k1(t, at, 0.85), k2 = k1(t, at + 0.22, 1);
  const sweep = e(t, at + 0.3, at + 1.1);
  return (
    <AbsoluteFill style={{ opacity: o, perspective: 1400 }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 55% at 50% ${(y / 1080) * 100}%, rgba(0,0,0,.55), transparent 75%)` }} />
      <div style={{ position: "absolute", left: 960, top: y, transform: `translate(-50%,-50%) translateZ(${(1 - k) * -1400}px) rotateX(${(1 - k) * 50 + 8}deg) rotateY(${Math.sin((t - at) * 0.8) * 5}deg)`, textAlign: "center", fontFamily: FONT, whiteSpace: "nowrap" }}>
        <div style={{ fontWeight: 900, fontSize: 64, letterSpacing: 26, color: COL.ink, textShadow: extrude(5, "rgba(0,0,0,.7)"), marginBottom: -20 }}>SECRETO</div>
        <div style={{ position: "relative", display: "inline-block", fontWeight: 900, fontSize: 360, lineHeight: 1, color: col, textShadow: extrude(22, "#5a3410") }}>
          {n}
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(105deg, transparent ${sweep * 140 - 40}%, rgba(255,255,255,.75) ${sweep * 140 - 25}%, transparent ${sweep * 140 - 10}%)`, WebkitBackgroundClip: "text", color: "transparent", mixBlendMode: "screen" } as React.CSSProperties}>{n}</div>
        </div>
        <div style={{ transform: `translateY(${(1 - k2) * 60}px)`, opacity: k2, fontWeight: 900, fontSize: 92, letterSpacing: 10, color: COL.ink, textShadow: extrude(8, "#3a2a18") }}>{name}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- barras de "cuánto aguanta": se llenan como columnas de hielo con su etiqueta ----------
export const TimeBars: React.FC<{ t: number; rows: { at: number; label: string; val: string; frac: number; col?: string }[]; out: number; x?: number; y?: number }> = ({ t, rows, out, x = 260, y = 300 }) => {
  const o = op(t, rows[0].at - 0.2, out); if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1500 }}>
      <div style={{ transform: "rotateY(10deg) rotateX(4deg)", transformOrigin: "0 50%" }}>
        {rows.map((r, i) => {
          const k = k1(t, r.at), g = ei(t, r.at + 0.1, r.at + 0.9), c = r.col ?? COL.ice;
          return (
            <div key={i} style={{ opacity: e(t, r.at, r.at + 0.15), transform: `translateX(${(1 - k) * -80}px)`, marginBottom: 46, fontFamily: FONT }}>
              <div style={{ fontWeight: 800, fontSize: 34, letterSpacing: 5, color: COL.ink, textShadow: "0 3px 12px #000", marginBottom: 10 }}>{r.label}</div>
              <div style={{ position: "relative", width: 1200, height: 74, borderRadius: 40, background: "rgba(10,18,30,.72)", boxShadow: "inset 0 3px 10px rgba(0,0,0,.6), 0 0 0 2px rgba(255,255,255,.12)" }}>
                <div style={{ position: "absolute", left: 6, top: 6, bottom: 6, width: Math.max(0, (1200 - 12) * r.frac * g), borderRadius: 34, background: `linear-gradient(180deg, ${c}, ${c}99)`, boxShadow: `0 0 30px ${c}88, inset 0 2px 0 rgba(255,255,255,.6)` }} />
                <div style={{ position: "absolute", left: Math.max(30, (1200 - 12) * r.frac * g) + 24, top: 2, fontWeight: 900, fontSize: 60, color: COL.ink, textShadow: extrude(5, "rgba(0,0,0,.7)"), whiteSpace: "nowrap" }}>{r.val}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------- dos columnas que se comparan (aire vs agua, antes vs durante, $60 vs $500) ----------
export const Versus: React.FC<{ t: number; at: number; out: number; L: { label: string; val: string; h: number; col: string; mark?: "ok" | "x" }; R: { label: string; val: string; h: number; col: string; mark?: "ok" | "x" }; title?: string; y?: number }> = ({ t, at, out, L, R, title, y = 540 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const col = (c: typeof L, i: number) => {
    const a = at + 0.15 + i * 0.35, g = ei(t, a, a + 0.8), k = k1(t, a);
    const mk = c.mark && t > a + 0.7 ? k1(t, a + 0.7, 1.2) : 0;
    return (
      <div key={i} style={{ width: 380, textAlign: "center", fontFamily: FONT, transform: `rotateY(${(i ? -1 : 1) * 14}deg) translateY(${(1 - k) * 80}px)`, opacity: e(t, a, a + 0.15) }}>
        <div style={{ height: 460, display: "flex", alignItems: "flex-end", justifyContent: "center", position: "relative" }}>
          <div style={{ width: 230, height: 460 * c.h * g, borderRadius: "22px 22px 8px 8px", background: `linear-gradient(90deg, ${c.col}cc, ${c.col}, ${c.col}aa)`, boxShadow: `0 0 50px ${c.col}66, inset 0 3px 0 rgba(255,255,255,.55), 0 30px 60px rgba(0,0,0,.6)` }} />
          <div style={{ position: "absolute", bottom: 460 * c.h * g + 18, left: 0, right: 0, fontWeight: 900, fontSize: 84, color: COL.ink, textShadow: extrude(8, "rgba(0,0,0,.7)") }}>{c.val}</div>
          {mk > 0 && <div style={{ position: "absolute", top: 20, right: 10, width: 110, height: 110, borderRadius: "50%", background: c.mark === "ok" ? "#2fbf71" : COL.red, color: "#fff", fontSize: 76, fontWeight: 900, lineHeight: "110px", transform: `scale(${mk}) rotate(${(1 - mk) * -40}deg)`, boxShadow: "0 16px 30px rgba(0,0,0,.5)" }}>{c.mark === "ok" ? "✓" : "✕"}</div>}
        </div>
        <div style={{ marginTop: 22, fontWeight: 900, fontSize: 44, letterSpacing: 6, color: c.col, textShadow: extrude(5, "rgba(0,0,0,.75)") }}>{c.label}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 70% at 50% 55%, rgba(4,8,14,.72), rgba(4,8,14,.35))" }} />
      {title && <div style={{ position: "absolute", top: y - 420, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 58, letterSpacing: 8, color: COL.ink, textShadow: extrude(6, "rgba(0,0,0,.7)"), opacity: e(t, at, at + 0.3) }}>{title}</div>}
      <div style={{ position: "absolute", left: 0, right: 0, top: y - 300, display: "flex", justifyContent: "center", gap: 160, perspective: 1600 }}>{col(L, 0)}{col(R, 1)}</div>
    </AbsoluteFill>
  );
};

// ---------- pila "batería térmica": las jarras se cargan como una pila (barras que se encienden) ----------
export const ColdBattery: React.FC<{ t: number; at: number; out: number; x?: number; y?: number; label?: string; full?: number }> = ({ t, at, out, x = 1460, y = 520, label = "COLD STORED", full = 1 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = k1(t, at), lvl = ei(t, at + 0.2, at + 2.6) * full;
  const cells = 6;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1200px) rotateY(-18deg) rotateX(6deg) scale(${0.7 + 0.3 * k})`, fontFamily: FONT, textAlign: "center" }}>
      <div style={{ width: 60, height: 26, margin: "0 auto", borderRadius: "10px 10px 0 0", background: "#cfd8e2" }} />
      <div style={{ width: 280, padding: 16, borderRadius: 30, background: "linear-gradient(90deg,#1a2230,#0c121b)", boxShadow: "0 40px 80px rgba(0,0,0,.7), 0 0 0 5px #cfd8e2, inset 0 0 30px rgba(0,0,0,.6)" }}>
        {Array.from({ length: cells }, (_, i) => {
          const on = lvl * cells > cells - 1 - i ? 1 : 0;
          return <div key={i} style={{ height: 58, marginBottom: i < cells - 1 ? 10 : 0, borderRadius: 12, background: on ? `linear-gradient(180deg, ${COL.ice2}, ${COL.ice})` : "rgba(143,214,255,.08)", boxShadow: on ? `0 0 26px ${COL.ice}` : "none" }} />;
        })}
      </div>
      <div style={{ marginTop: 22, fontWeight: 900, fontSize: 40, letterSpacing: 5, color: COL.ice, textShadow: extrude(5, "rgba(0,0,0,.7)") }}>{label}</div>
    </div>
  );
};

// ---------- jarra en línea que se llena hasta 9/10 y marca el espacio libre ----------
export const JugFill: React.FC<{ t: number; at: number; out: number; x?: number; y?: number }> = ({ t, at, out, x = 1500, y = 540 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const f = ei(t, at + 0.15, at + 1.6) * 0.9, k = k1(t, at);
  const H = 420, W = 280;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1200px) rotateY(-14deg) scale(${0.75 + 0.25 * k})`, fontFamily: FONT }}>
      <svg width={W + 220} height={H + 120} style={{ overflow: "visible", filter: "drop-shadow(0 30px 40px rgba(0,0,0,.6))" }}>
        <defs><clipPath id="jugc"><path d={`M60 120 Q60 70 110 60 L110 20 L170 20 L170 60 Q${W - 20} 70 ${W - 20} 140 L${W - 20} ${H} Q${W - 20} ${H + 30} ${W - 50} ${H + 30} L90 ${H + 30} Q60 ${H + 30} 60 ${H} Z`} /></clipPath></defs>
        <rect x={0} y={0} width={W + 40} height={H + 60} fill="rgba(255,255,255,.06)" clipPath="url(#jugc)" />
        <rect x={0} y={H + 30 - (H + 10) * f} width={W + 40} height={H + 60} fill="url(#wg)" clipPath="url(#jugc)" />
        <linearGradient id="wg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={COL.ice2} /><stop offset="1" stopColor={COL.ice} /></linearGradient>
        <path d={`M60 120 Q60 70 110 60 L110 20 L170 20 L170 60 Q${W - 20} 70 ${W - 20} 140 L${W - 20} ${H} Q${W - 20} ${H + 30} ${W - 50} ${H + 30} L90 ${H + 30} Q60 ${H + 30} 60 ${H} Z`} fill="none" stroke="#e8f4ff" strokeWidth={8} />
        {f > 0.85 && <>
          <line x1={W} y1={H + 30 - (H + 10) * 0.9} x2={W + 60} y2={H + 30 - (H + 10) * 0.9} stroke={COL.amber} strokeWidth={5} />
          <line x1={W} y1={60} x2={W + 60} y2={60} stroke={COL.amber} strokeWidth={5} />
          <line x1={W + 50} y1={60} x2={W + 50} y2={H + 30 - (H + 10) * 0.9} stroke={COL.amber} strokeWidth={4} strokeDasharray="10 8" />
        </>}
      </svg>
      <div style={{ position: "absolute", left: W + 80, top: 80, opacity: e(t, at + 1.5, at + 1.8), fontWeight: 900, fontSize: 40, color: COL.amber, textShadow: extrude(4, "rgba(0,0,0,.7)"), whiteSpace: "nowrap" }}>ROOM TO GROW</div>
      <div style={{ textAlign: "center", marginTop: 10, fontWeight: 900, fontSize: 64, color: COL.ink, textShadow: extrude(7, "rgba(0,0,0,.7)") }}>9/10 FULL</div>
    </div>
  );
};

// ---------- interruptor gigante 3D: POWER OUT → JACKET ON / POWER BACK → JACKET OFF ----------
export const Toggle: React.FC<{ t: number; at: number; flipAt: number; out: number; a: [string, string]; b: [string, string]; x?: number; y?: number }> = ({ t, at, flipAt, out, a, b, x = 1400, y = 520 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = k1(t, at), f = ei(t, flipAt, flipAt + 0.35), on = f < 0.5;
  const [l1, l2] = on ? a : b;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1300px) rotateY(-16deg) scale(${0.7 + 0.3 * k})`, fontFamily: FONT, textAlign: "center" }}>
      <div style={{ width: 230, height: 360, margin: "0 auto", borderRadius: 34, background: "linear-gradient(180deg,#f2efe8,#cfcac0)", boxShadow: "0 40px 80px rgba(0,0,0,.65), inset 0 2px 0 #fff", position: "relative" }}>
        <div style={{ position: "absolute", left: 60, right: 60, top: 70, bottom: 70, borderRadius: 18, background: "#2b2d31", boxShadow: "inset 0 6px 14px rgba(0,0,0,.7)" }} />
        <div style={{ position: "absolute", left: 70, right: 70, height: 120, top: 70 + (1 - (1 - f)) * 100 + 10 * 0, borderRadius: 14, background: f < 0.5 ? `linear-gradient(180deg, ${COL.red}, #9a1d14)` : "linear-gradient(180deg,#45d17f,#1d7a46)", transform: `rotateX(${(f - 0.5) * 70}deg)`, boxShadow: "0 14px 24px rgba(0,0,0,.6), inset 0 2px 0 rgba(255,255,255,.4)" }} />
      </div>
      <div style={{ marginTop: 26, fontWeight: 900, fontSize: 46, letterSpacing: 6, color: on ? COL.red : "#45d17f", textShadow: extrude(5, "rgba(0,0,0,.75)"), whiteSpace: "nowrap" }}>{l1}</div>
      <div style={{ fontWeight: 900, fontSize: 70, letterSpacing: 4, color: COL.ink, textShadow: extrude(7, "rgba(0,0,0,.75)"), whiteSpace: "nowrap", transform: `rotateX(${Math.abs(f - 0.5) < 0.5 ? (0.5 - Math.abs(f - 0.5)) * 160 : 0}deg)` }}>{l2}</div>
    </div>
  );
};

// ---------- contador de aperturas: puertitas que se abren y el frío que se vacía ----------
export const DoorCounter: React.FC<{ t: number; at: number; out: number; n?: number; y?: number }> = ({ t, at, out, n = 10, y = 760 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const per = 0.16, done = Math.min(n, Math.max(0, Math.floor((t - at) / per) + 1));
  const cold = 1 - done / n;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, opacity: o, fontFamily: FONT, textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 18, perspective: 900 }}>
        {Array.from({ length: n }, (_, i) => {
          const op_ = i < done ? 1 : 0, ang = op_ ? Math.min(1, (t - at - i * per) / 0.18) * -70 : 0;
          return (
            <div key={i} style={{ width: 70, height: 120, borderRadius: 10, background: "#0c1c2c", boxShadow: `0 0 0 3px ${op_ ? COL.ice : "rgba(255,255,255,.2)"}`, position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: 10, background: "linear-gradient(90deg,#eef0f2,#c9ced4)", transformOrigin: "100% 50%", transform: `rotateY(${ang}deg)`, boxShadow: "0 8px 16px rgba(0,0,0,.5)" }}>
                <div style={{ position: "absolute", left: 8, top: 34, width: 6, height: 40, borderRadius: 3, background: "#8a9099" }} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ margin: "26px auto 0", width: 880, height: 26, borderRadius: 14, background: "rgba(0,0,0,.55)", boxShadow: "0 0 0 2px rgba(255,255,255,.15)" }}>
        <div style={{ width: `${cold * 100}%`, height: "100%", borderRadius: 14, background: `linear-gradient(90deg, ${COL.ice}, ${COL.ice2})`, boxShadow: `0 0 20px ${COL.ice}` }} />
      </div>
      <div style={{ marginTop: 14, fontWeight: 900, fontSize: 54, letterSpacing: 6, color: COL.ink, textShadow: extrude(6, "rgba(0,0,0,.75)") }}>{done} OPENINGS <span style={{ color: cold < 0.35 ? COL.red : COL.ice }}>· COLD {Math.round(cold * 100)}%</span></div>
    </div>
  );
};

// ---------- reloj de 10 segundos (aro que se cierra) ----------
export const Timer: React.FC<{ t: number; at: number; out: number; secs?: number; label: string; x?: number; y?: number }> = ({ t, at, out, secs = 10, label, x = 1500, y = 480 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = k1(t, at), f = ei(t, at + 0.1, at + 1.4), n = Math.round(f * secs);
  const R = 150, C = 2 * Math.PI * R;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1200px) rotateY(-14deg) scale(${0.7 + 0.3 * k})`, fontFamily: FONT, textAlign: "center" }}>
      <svg width={360} height={360} style={{ filter: `drop-shadow(0 0 20px ${COL.ice}88) drop-shadow(0 30px 40px rgba(0,0,0,.6))` }}>
        <circle cx={180} cy={180} r={R} fill="rgba(6,12,20,.8)" stroke="rgba(255,255,255,.15)" strokeWidth={18} />
        <circle cx={180} cy={180} r={R} fill="none" stroke={COL.ice} strokeWidth={18} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - f)} transform="rotate(-90 180 180)" />
        <text x={180} y={215} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={110} fill={COL.ink}>{n}s</text>
      </svg>
      <div style={{ marginTop: 10, fontWeight: 900, fontSize: 48, letterSpacing: 5, color: COL.ink, textShadow: extrude(6, "rgba(0,0,0,.75)"), whiteSpace: "nowrap" }}>{label}</div>
    </div>
  );
};

// ---------- lista que se va tildando (lo que sale de la heladera) ----------
export const CheckList: React.FC<{ t: number; title: string; rows: { at: number; txt: string }[]; out: number; x?: number; y?: number }> = ({ t, title, rows, out, x = 1340, y = 230 }) => {
  const o = op(t, rows[0].at - 0.3, out); if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1300 }}>
      <div style={{ transform: "rotateY(-14deg) rotateZ(-1.5deg)", width: 470, padding: "28px 34px 18px", borderRadius: 10, background: "linear-gradient(180deg,#fdf8e8,#f1e7c8)", boxShadow: "0 40px 80px rgba(0,0,0,.6)", fontFamily: FONT, color: "#2a2316" }}>
        <div style={{ fontWeight: 900, fontSize: 34, letterSpacing: 4, borderBottom: "3px solid #c9b98f", paddingBottom: 10, marginBottom: 8 }}>{title}</div>
        {rows.filter((r) => t >= r.at - 0.05).map((r, i) => {
          const k = k1(t, r.at, 1.2);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, fontWeight: 800, fontSize: 40, lineHeight: "64px", transform: `translateX(${(1 - k) * 40}px)`, opacity: Math.min(1, k * 1.4) }}>
              <span style={{ display: "inline-block", width: 40, height: 40, borderRadius: 8, border: "4px solid #2a2316", position: "relative" }}>
                <span style={{ position: "absolute", left: 2, top: -16, fontSize: 48, color: "#2f9a5c", transform: `scale(${k})` }}>✓</span>
              </span>{r.txt}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------- gráfico de temperaturas real (37→40 con la línea de 40°F) + la del vecino que se dispara ----------
export const TempChart: React.FC<{ t: number; at: number; pts: { at: number; v: number; lab: string }[]; nb?: { at: number; v: number }; out: number }> = ({ t, at, pts, nb, out }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const X0 = 300, X1 = 1500, Y0 = 900, vy = (v: number) => Y0 - v * 30; // 0 °C abajo, 22 °C arriba
  const xs = pts.map((_, i) => X0 + (i / (pts.length - 1)) * (X1 - X0));
  const shown = pts.map((p, i) => ({ ...p, x: xs[i], y: vy(p.v), k: k1(t, p.at, 1.2), on: t >= p.at }));
  const path = shown.filter((p) => p.on).map((p, i) => `${i ? "L" : "M"}${p.x},${p.y}`).join(" ");
  const nbk = nb ? ei(t, nb.at - 0.6, nb.at + 0.2) : 0;
  const pulse = t > pts[pts.length - 1].at ? 0.5 + 0.5 * Math.sin((t - pts[pts.length - 1].at) * 9) : 0;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(4,8,14,.84), rgba(4,8,14,.66))", backdropFilter: "blur(16px) saturate(.7)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 60, letterSpacing: 10, color: COL.ink, textShadow: extrude(6, "rgba(0,0,0,.7)") }}>MIS NÚMEROS REALES</div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {nb && nbk > 0 && <>
          <path d={`M${xs[0]},${vy(pts[0].v)} L${xs[0] + (xs[1] - xs[0]) * nbk},${vy(pts[0].v + (nb.v - pts[0].v) * nbk)}`} stroke={COL.red} strokeWidth={10} fill="none" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 14px ${COL.red})` }} />
          <text x={xs[1] + 30} y={vy(nb.v) + 18} fontFamily={FONT} fontWeight={900} fontSize={70} fill={COL.red} opacity={e(t, nb.at, nb.at + 0.2)}>{nb.v} °C</text>
          <text x={xs[1] + 30} y={vy(nb.v) + 64} fontFamily={FONT} fontWeight={800} fontSize={30} fill={COL.dim} letterSpacing={4} opacity={e(t, nb.at, nb.at + 0.2)}>SIN LADRILLOS</text>
        </>}
        <path d={path} stroke={COL.ice} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 16px ${COL.ice})` }} />
        {shown.map((p, i) => p.on && (
          <g key={i} transform={`translate(${p.x} ${p.y}) scale(${p.k})`}>
            <circle r={20} fill={COL.ice2} stroke="#fff" strokeWidth={5} />
            <text y={-46} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={68} fill={p.v >= 12 ? COL.amber : COL.ink}>{p.v} °C</text>
            <text y={84} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} letterSpacing={4} fill={COL.dim}>{p.lab}</text>
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};

// ---------- ERROR #n: losa roja que cae con el número y el error escrito ----------
export const Mistake: React.FC<{ t: number; at: number; n: number; txt: string; out: number; x?: number; y?: number }> = ({ t, at, n, txt, out, x = 960, y = 860 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = k1(t, at, 1.1);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1300px) rotateX(${(1 - k) * -80 + 6}deg) scale(${0.8 + 0.2 * k})`, transformOrigin: "50% 0", display: "flex", alignItems: "center", fontFamily: FONT, whiteSpace: "nowrap" }}>
      <div style={{ width: 170, height: 170, borderRadius: 26, background: `linear-gradient(180deg, ${COL.red}, #8f1a12)`, color: "#fff", fontWeight: 900, fontSize: 110, lineHeight: "170px", textAlign: "center", boxShadow: "0 30px 60px rgba(0,0,0,.6), inset 0 3px 0 rgba(255,255,255,.35)", textShadow: extrude(6, "#5a0d08") }}>{n}</div>
      <div style={{ marginLeft: -14, padding: "26px 44px 26px 50px", borderRadius: "0 22px 22px 0", background: "rgba(12,8,8,.88)", boxShadow: "0 30px 60px rgba(0,0,0,.6), inset 0 0 0 2px rgba(255,74,61,.5)" }}>
        <div style={{ fontWeight: 800, fontSize: 26, letterSpacing: 8, color: COL.red }}>ERROR</div>
        <div style={{ fontWeight: 900, fontSize: 66, color: COL.ink, textShadow: extrude(5, "rgba(0,0,0,.8)") }}>{txt}</div>
      </div>
    </div>
  );
};

// ---------- título "5 MISTAKES": cinco losas que se reparten como cartas ----------
export const MistakesDeal: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const kt = k1(t, at, 0.9);
  return (
    <AbsoluteFill style={{ opacity: o, background: "radial-gradient(ellipse at 50% 40%, #2a0f0c, #070505 75%)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 220, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 170, letterSpacing: 8, color: COL.ink, textShadow: extrude(18, "#4a0d08"), transform: `perspective(1200px) translateZ(${(1 - kt) * -900}px) rotateX(10deg)` }}>THE MISTAKES</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", gap: 36, perspective: 1200 }}>
        {[1, 2, 3, 4, 5].map((n, i) => {
          const a = at + 0.35 + i * 0.12, k = k1(t, a, 1.2);
          return <div key={n} style={{ width: 190, height: 250, borderRadius: 22, background: `linear-gradient(180deg, ${COL.red}, #7d150e)`, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 150, lineHeight: "250px", textAlign: "center", textShadow: extrude(8, "#4a0905"), boxShadow: "0 40px 70px rgba(0,0,0,.7), inset 0 3px 0 rgba(255,255,255,.3)", opacity: e(t, a, a + 0.08), transform: `translateY(${(1 - k) * 500}px) rotateZ(${(1 - k) * (i - 2) * 25 + (i - 2) * 3}deg) rotateX(${(1 - k) * 60}deg)` }}>{n}</div>;
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- LA REGLA: placa de advertencia 40°F + 2 HRS = TRASH ----------
export const RuleCard: React.FC<{ t: number; at: number; at2: number; at3: number; out: number }> = ({ t, at, at2, at3, out }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const a = k1(t, at), b = k1(t, at2), c = k1(t, at3, 1.3);
  const big = (txt: string, k: number, col: string) => <div style={{ display: "inline-block", fontWeight: 900, fontSize: 150, color: col, textShadow: extrude(14, "rgba(0,0,0,.75)"), transform: `perspective(900px) translateZ(${(1 - k) * -800}px) rotateY(${(1 - k) * 40}deg)`, opacity: Math.min(1, k * 1.5) }}>{txt}</div>;
  return (
    <AbsoluteFill style={{ opacity: o, background: "repeating-linear-gradient(-45deg, #1a0d06 0 60px, #120905 60px 120px)" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(255,120,40,.18), transparent 60%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center", fontFamily: FONT, whiteSpace: "nowrap" }}>
        {big("40°F", a, COL.amber)}<span style={{ display: "inline-block", width: 60 }} />{t >= at2 - 0.05 && big("+ 2 HRS", b, COL.ink)}
      </div>
      {t >= at3 - 0.05 && <div style={{ position: "absolute", left: 960, top: 720, transform: `translate(-50%,-50%) rotate(-6deg) scale(${2.2 - 1.2 * c})`, opacity: Math.min(1, c * 2), border: `14px solid ${COL.red}`, borderRadius: 18, padding: "4px 40px", fontFamily: FONT, fontWeight: 900, fontSize: 140, letterSpacing: 6, color: COL.red, background: "rgba(30,0,0,.4)", boxShadow: "0 0 40px rgba(255,60,40,.5)" }}>= TRASH</div>}
    </AbsoluteFill>
  );
};

// ---------- tarjeta "PRÓXIMO VIDEO" + botón suscribirse que se aprieta ----------
export const NextCard: React.FC<{ t: number; at: number; subAt: number; out: number; children: React.ReactNode }> = ({ t, at, subAt, out, children }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = k1(t, at, 0.9), s1 = k1(t, subAt, 1.2), press = t > subAt + 0.5 && t < subAt + 0.75 ? 0.92 : 1, done = t > subAt + 0.62;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: 1010, top: 170, width: 780, height: 440, perspective: 1600 }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 22, overflow: "hidden", border: "6px solid rgba(255,255,255,.94)", boxShadow: "0 50px 100px rgba(0,0,0,.7)", transform: `rotateY(${(1 - k) * -60 - 12}deg) translateZ(${(1 - k) * -600}px)`, position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 70% at 50% 45%, #5a2a10, #140a05)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, textAlign: "center", paddingTop: 30 }}>{children}</div>
          <div style={{ position: "absolute", left: 0, top: 0, padding: "12px 22px", background: COL.amber, fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 5, color: "#2a1806" }}>PRÓXIMO VIDEO</div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "18px 24px", background: "linear-gradient(0deg, rgba(0,0,0,.9), transparent)", fontFamily: FONT, fontWeight: 900, fontSize: 46, color: COL.ink }}>PARTE 4 · MUY PRONTO</div>
        </div>
      </div>
      {s1 > 0.01 && <div style={{ position: "absolute", left: 1400, top: 760, transform: `translate(-50%,-50%) scale(${s1 * press})`, whiteSpace: "nowrap", padding: "26px 60px", borderRadius: 60, background: done ? "#2b2b2b" : "#e62117", fontFamily: FONT, fontWeight: 900, fontSize: 56, letterSpacing: 4, color: "#fff", boxShadow: "0 24px 50px rgba(0,0,0,.6)" }}>{done ? "SUSCRITO ✓" : "SUSCRÍBETE"}</div>}
    </AbsoluteFill>
  );
};

// ---------- palabras grandes que entran por palabra (kinetic) ----------
export const Words: React.FC<{ t: number; items: { at: number; txt: string; col?: string }[]; out: number; y?: number; size?: number }> = ({ t, items, out, y = 540, size = 120 }) => {
  const o = op(t, items[0].at - 0.05, out); if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, transform: "translateY(-50%)", display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "10px 42px", opacity: o, perspective: 1200, fontFamily: FONT }}>
      {items.map((w, i) => {
        const k = k1(t, w.at, 1.1);
        return <div key={i} style={{ fontWeight: 900, fontSize: size, color: w.col ?? COL.ink, textShadow: extrude(12, "rgba(0,0,0,.72)"), opacity: t >= w.at ? Math.min(1, k * 1.6) : 0, transform: `translateY(${(1 - k) * 90}px) rotateX(${(1 - k) * -70}deg)`, whiteSpace: "nowrap" }}>{w.txt}</div>;
      })}
    </div>
  );
};

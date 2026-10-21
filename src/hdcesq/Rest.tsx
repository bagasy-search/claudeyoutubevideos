// hdcesq · EL RESTO DEL VIDEO (101,4-991 s): el mismo patio y la misma cámara del minuto 1.
// Las tomas salen de plan.ts (mundo / toma real / foto / flashback / avatar), cada pieza entra con at("frase") en la palabra que se dice.
// Mundo → mundo = la cámara VUELA (sin corte); toma real ↔ mundo = deslizamiento con blur; avatar = zoom a través; portales para salir del 3D.
// Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { screenOf, VASO } from "./patio3d";
import { Avatar, World, Stamp, Desc, Calendar, Min1, MIN1_FRAMES } from "./Min1";
import CLIPS from "./clips.json";
import { BigNum, COL, Card3D, DrawX, Flash, FONT, HeatHaze, P, Portal, Tag, Thermo, e, ei, extrude, s, spr } from "./lib";
import { SHOTS, Shot, T, at, fin, REST0 } from "./plan";
import { RQ } from "./rest3d";

type XY = { x: number; y: number };
const CL = CLIPS as Record<string, boolean | number>;
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));

// ---------------- tomas ----------------
const Clip: React.FC<{ k: string; a: number; b: number; t: number }> = ({ k, a, b, t }) => {
  const sc = 1.03 + 0.07 * e(t, a, b);
  const st: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };
  const v = CL[k];
  // si la toma real es más corta que el plano, va en cámara lenta (nunca se congela ni se repite)
  const rate = typeof v === "number" ? clamp(v / (b - a + 0.4), 0.5, 1) : 1;
  return <AbsoluteFill style={{ transform: `scale(${sc})`, background: "#000" }}>
    {v ? <Sequence from={s(a)} layout="none"><OffthreadVideo src={staticFile(P + k + ".mp4")} muted playbackRate={rate} style={st} /></Sequence> : <Img src={staticFile(P + k + ".jpg")} style={st} />}
  </AbsoluteFill>;
};
const Photo: React.FC<{ k: string; a: number; b: number; t: number; i: number }> = ({ k, a, b, t, i }) => {
  const u = e(t, a, b), dir = i % 2 ? 1 : -1;
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    <Img src={staticFile(P + k + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.06 + 0.08 * u}) translateX(${dir * (u - 0.5) * 40}px)` }} />
  </AbsoluteFill>;
};
const ShotView: React.FC<{ sh: Shot; t: number; i: number }> = ({ sh, t, i }) => {
  if (sh.k === "W") return <World t={t} />;
  if (sh.k === "C") return <Clip k={sh.id!} a={sh.a} b={sh.b} t={t} />;
  if (sh.k === "P") return <Photo k={sh.id!} a={sh.a} b={sh.b} t={t} i={i} />;
  if (sh.k === "F") return <AbsoluteFill style={{ transform: `scale(${1.02 + 0.06 * e(t, sh.a, sh.b)})` }}><World t={sh.ft!} /></AbsoluteFill>;
  return <Avatar t={Math.min(t, sh.b - 0.04)} edge={0.6} />;
};
const idxAt = (t: number) => { let lo = 0, hi = SHOTS.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (SHOTS[m].a <= t) lo = m; else hi = m - 1; } return lo; };
const TR = 0.38;

// ---------------- piezas nuevas de estos minutos ----------------
const Panel: React.FC<{ x: number; y: number; o: number; k: number; w?: number; children: React.ReactNode; ry?: number }> = ({ x, y, o, k, w, children, ry = -10 }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1400 }}>
    <div style={{ transform: `translate(-50%,-50%) translateZ(${(1 - Math.min(1, k)) * -600}px) rotateY(${ry + (1 - Math.min(1, k)) * -40}deg) rotateX(6deg)`, width: w, padding: "24px 30px", borderRadius: 24,
      background: "linear-gradient(180deg, rgba(24,30,22,.94), rgba(12,16,11,.94))", boxShadow: "0 50px 100px rgba(0,0,0,.65), inset 0 1px 0 rgba(255,255,255,.14)", fontFamily: FONT, color: COL.ink }}>{children}</div>
  </div>
);
const vis = (t: number, a: number, b: number, fi = 0.15, fo = 0.3) => e(t, a, a + fi) * (1 - e(t, b, b + fo));

// píldoras de texto que caen una por una (sí / no)
const Pills: React.FC<{ t: number; items: { at: number; tx: string; col?: string; bad?: boolean }[]; out: number; y?: number }> = ({ t, items, out, y = 860 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 26, perspective: 1200 }}>
    {items.map((it, i) => { const k = Math.min(1.1, spr(t, it.at)), o = e(t, it.at, it.at + 0.1) * (1 - e(t, out + i * 0.04, out + i * 0.04 + 0.25)); const c = it.col ?? (it.bad ? COL.red : COL.leaf);
      return <div key={i} style={{ opacity: o, transform: `translateY(${(1 - Math.min(1, k)) * 110}px) rotateX(${(1 - Math.min(1, k)) * 70}deg)`, padding: "14px 30px", borderRadius: 999, background: "linear-gradient(180deg, rgba(20,24,18,.95), rgba(10,12,9,.95))",
        boxShadow: `0 22px 44px rgba(0,0,0,.6), 0 0 0 3px ${c}99, inset 0 1px 0 rgba(255,255,255,.15)`, fontFamily: FONT, fontWeight: 900, fontSize: 46, color: c, letterSpacing: 2, textShadow: extrude(4, "#000"), whiteSpace: "nowrap" }}>{it.tx}</div>; })}
  </div>
);

// los conductos del tallo: el agua azul sube; la tijera mocha APLASTA y el flujo se corta
const Conductos: React.FC<{ t: number; at: number; crush: number; stop: number; out: number }> = ({ t, at, crush, stop, out }) => {
  const o = vis(t, at, out), k = spr(t, at, 0.8);
  if (o <= 0.01) return null;
  const c = e(t, crush, crush + 0.4), st = e(t, stop, stop + 0.6);
  const pinch = (x: number) => 1 - 0.8 * c * Math.exp(-((x - 160) ** 2) / 900);
  const tube = (y0: number) => { const pts = Array.from({ length: 31 }, (_, i) => { const x = i * 30; return [x, y0 * pinch(x)] as const; }); return "M" + pts.map(([x, y]) => `${x},${170 + y}`).join(" L"); };
  return <Panel x={1360} y={330} o={o} k={k} w={900}>
    <div style={{ fontWeight: 900, fontSize: 34, letterSpacing: 4, color: COL.ice, marginBottom: 8 }}>LOS CONDUCTOS DEL TALLO</div>
    <svg width={840} height={340} viewBox="0 0 900 340">
      <rect x={0} y={60} width={900} height={220} rx={110} fill="#5d7f34" opacity={0.9} />
      {[-70, -25, 25, 70].map((y0, i) => <g key={i}>
        <path d={tube(y0)} stroke="#2f4a1a" strokeWidth={34} fill="none" strokeLinecap="round" />
        <path d={tube(y0)} stroke="#8fd6ff" strokeWidth={14} fill="none" strokeLinecap="round" strokeDasharray="26 22" strokeDashoffset={-(t * 160 * (1 - st)) - i * 13} opacity={1 - 0.85 * st} />
      </g>)}
      <g transform={`translate(160, ${-30 + 70 * c})`} opacity={e(t, crush - 0.3, crush)}><rect x={-60} y={0} width={120} height={36} rx={8} fill="#9aa3aa" /><rect x={-60} y={296 - 140 * c} width={120} height={36} rx={8} fill="#9aa3aa" /></g>
      <text x={560} y={330} fill={st > 0.5 ? COL.red : COL.ice} fontFamily={FONT} fontWeight={900} fontSize={40}>{st > 0.5 ? "EL AGUA YA NO SUBE ✕" : "EL AGUA SUBE →"}</text>
    </svg>
  </Panel>;
};

// tanque de la rama: con 10 hojas se vacía en un día
const Tanque: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = vis(t, at, out), k = spr(t, at);
  if (o <= 0.01) return null;
  const lvl = 1 - ei(t, at + 0.3, out - 0.4);
  return <Panel x={x} y={y} o={o} k={k} w={440} ry={12}>
    <div style={{ fontWeight: 900, fontSize: 30, letterSpacing: 3, color: COL.ice, textAlign: "center" }}>AGUA DE LA RAMA</div>
    <div style={{ position: "relative", margin: "14px auto 6px", width: 200, height: 300, borderRadius: 26, border: "6px solid rgba(255,255,255,.75)", overflow: "hidden", background: "rgba(255,255,255,.05)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${lvl * 100}%`, background: "linear-gradient(180deg,#8fd6ff,#2f7fc0)", boxShadow: "0 -4px 20px rgba(143,214,255,.7)" }} />
      {Array.from({ length: 10 }, (_, i) => { const ph = ((t * 1.3 + i * 0.37) % 1); return <div key={i} style={{ position: "absolute", left: 14 + (i % 5) * 36, top: 8 + Math.floor(i / 5) * 30 - ph * 10, fontSize: 26, opacity: 0.9 }}>🍃</div>; })}
    </div>
    <div style={{ fontWeight: 900, fontSize: 64, textAlign: "center", color: lvl < 0.2 ? COL.red : COL.ink, textShadow: extrude(5, "#000") }}>{lvl < 0.15 ? "VACÍA" : `${Math.round(lvl * 100)} %`}</div>
    <div style={{ fontWeight: 800, fontSize: 26, letterSpacing: 3, textAlign: "center", color: COL.dim }}>10 HOJAS · 1 DÍA</div>
  </Panel>;
};

// reloj: temprano ✓ / mediodía ✗
const Reloj: React.FC<{ t: number; at: number; out: number; x: number; y: number; h0: number; h1: number; ok: string; bad: string; badAt: number }> = ({ t, at, out, x, y, h0, h1, ok, bad, badAt }) => {
  const o = vis(t, at, out), k = spr(t, at);
  if (o <= 0.01) return null;
  const hr = h0 + (h1 - h0) * ei(t, at + 0.3, badAt), isBad = t >= badAt;
  const ha = (hr % 12) / 12 * 360, ma = (hr % 1) * 360;
  return <Panel x={x} y={y} o={o} k={k} w={420} ry={-14}>
    <svg width={360} height={360} viewBox="-180 -180 360 360" style={{ display: "block", margin: "0 auto" }}>
      <circle r={168} fill="#f6f1e6" stroke={isBad ? COL.red : COL.leaf} strokeWidth={12} />
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={-150} x2={0} y2={-130} stroke="#3a332a" strokeWidth={i % 3 ? 4 : 9} transform={`rotate(${i * 30})`} />)}
      <line x1={0} y1={0} x2={0} y2={-88} stroke="#2b2620" strokeWidth={14} strokeLinecap="round" transform={`rotate(${ha})`} />
      <line x1={0} y1={0} x2={0} y2={-130} stroke="#2b2620" strokeWidth={8} strokeLinecap="round" transform={`rotate(${ma})`} />
      <circle r={12} fill="#2b2620" />
      {isBad && <circle cx={0} cy={-60} r={30 + 6 * Math.sin(t * 8)} fill="#ffcf40" opacity={0.85} />}
    </svg>
    <div style={{ fontWeight: 900, fontSize: 50, textAlign: "center", color: isBad ? COL.red : COL.leaf, textShadow: extrude(5, "#000") }}>{isBad ? bad : ok}</div>
  </Panel>;
};

// cronómetro "de la tijera al vaso"
const Timer: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = vis(t, at, out), k = spr(t, at);
  if (o <= 0.01) return null;
  const m = Math.min(29, Math.floor(ei(t, at + 0.2, at + 2.2) * 29)), sec = Math.floor(((t - at) * 37) % 60);
  return <Panel x={x} y={y} o={o} k={k} w={520} ry={12}>
    <div style={{ fontWeight: 800, fontSize: 28, letterSpacing: 4, color: COL.dim, textAlign: "center" }}>DE LA TIJERA AL VASO</div>
    <div style={{ fontWeight: 900, fontSize: 130, textAlign: "center", color: COL.leaf, fontVariantNumeric: "tabular-nums", textShadow: extrude(8, "#123010") }}>{String(m).padStart(2, "0")}:{String(sec).padStart(2, "0")}</div>
    <div style={{ fontWeight: 900, fontSize: 46, textAlign: "center", color: COL.amber, letterSpacing: 3 }}>MENOS DE 30 MIN</div>
  </Panel>;
};

// rueda de las estaciones: cuál sí / cuál no
const SEAS = ["INVIERNO", "PRIMAVERA", "VERANO", "OTOÑO"], SC = ["#8fd6ff", "#9be27a", "#ffcf40", "#ff9a4a"];
const Rueda: React.FC<{ t: number; at: number; out: number; x: number; y: number; marks: { at: number; i: number; ok: boolean; tx?: string }[] }> = ({ t, at, out, x, y, marks }) => {
  const o = vis(t, at, out), k = spr(t, at, 0.8);
  if (o <= 0.01) return null;
  const R = 190;
  const arc = (i: number) => { const a0 = (i * 90 - 135) * Math.PI / 180, a1 = ((i + 1) * 90 - 135) * Math.PI / 180; return `M0,0 L${R * Math.cos(a0)},${R * Math.sin(a0)} A${R},${R} 0 0 1 ${R * Math.cos(a1)},${R * Math.sin(a1)} Z`; };
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1300 }}>
    <div style={{ transform: `translate(-50%,-50%) rotateX(${(1 - Math.min(1, k)) * 60 + 8}deg) rotateZ(${(1 - Math.min(1, k)) * -90}deg)` }}>
      <svg width={460} height={460} viewBox="-230 -230 460 460" style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,.6))" }}>
        {SEAS.map((n, i) => { const m = marks.filter((q) => q.i === i && t >= q.at).pop(); const hl = m ? e(t, m.at, m.at + 0.3) : 0; const mid = (i * 90 - 90) * Math.PI / 180;
          return <g key={i}>
            <path d={arc(i)} fill={SC[i]} opacity={0.35 + 0.6 * hl} stroke="#0b0d08" strokeWidth={6} transform={hl > 0 ? `translate(${Math.cos(mid) * 14 * hl},${Math.sin(mid) * 14 * hl})` : undefined} />
            <text x={Math.cos(mid) * 118} y={Math.sin(mid) * 118 + 10} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill="#10140c">{n}</text>
            {m && <text x={Math.cos(mid) * 118} y={Math.sin(mid) * 118 + 64} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill={m.ok ? "#1d5a12" : "#9a1a10"} opacity={hl}>{m.ok ? "✓" : "✕"}</text>}
          </g>; })}
        <circle r={46} fill="#0b0d08" /><text y={12} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={COL.ink}>ÉPOCA</text>
      </svg>
    </div>
  </div>;
};

// la regla de los 2/3 bajo tierra
const Tercios: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = vis(t, at, out), k = spr(t, at);
  if (o <= 0.01) return null;
  const f = ei(t, at + 0.3, at + 1.3);
  return <Panel x={x} y={y} o={o} k={k} w={360} ry={14}>
    <svg width={300} height={460} viewBox="0 0 300 460">
      <rect x={0} y={150} width={300} height={310} fill="#5a3e28" opacity={f} rx={14} />
      <line x1={0} y1={150} x2={300} y2={150} stroke="#e8d2a8" strokeWidth={4} strokeDasharray="12 10" />
      <rect x={130} y={10} width={40} height={430} rx={18} fill="#6f6a33" />
      {[90, 230, 370].map((yy, i) => <ellipse key={i} cx={150} cy={yy} rx={30} ry={14} fill="#5d5a28" />)}
      <text x={200} y={320} fontFamily={FONT} fontWeight={900} fontSize={64} fill="#ffd60a" opacity={f}>⅔</text>
      <text x={196} y={80} fontFamily={FONT} fontWeight={900} fontSize={44} fill={COL.leaf}>⅓</text>
    </svg>
    <div style={{ fontWeight: 900, fontSize: 36, textAlign: "center", color: "#ffd60a", letterSpacing: 2 }}>BAJO TIERRA</div>
  </Panel>;
};

// contador de semanas (las celdas se llenan; la regla "no la tires antes de la 8")
const Semanas: React.FC<{ t: number; at: number; out: number; to: number; stop?: number; y?: number; title: string }> = ({ t, at, out, to, stop, y = 230, title }) => {
  const o = vis(t, at, out), k = spr(t, at, 0.8);
  if (o <= 0.01) return null;
  const n = Math.floor(ei(t, at + 0.3, at + 0.3 + 0.18 * to) * to + 0.001);
  return <div style={{ position: "absolute", left: 960, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * Math.min(1, k)})`, fontFamily: FONT, textAlign: "center" }}>
    <div style={{ fontWeight: 900, fontSize: 40, color: COL.ink, letterSpacing: 4, textShadow: extrude(4, "#000"), marginBottom: 12 }}>{title}</div>
    <div style={{ display: "flex", gap: 14 }}>
      {Array.from({ length: 8 }, (_, i) => { const on = i < n, cut = stop !== undefined && i === stop - 1 && on;
        return <div key={i} style={{ width: 120, height: 120, borderRadius: 18, background: on ? (cut ? "rgba(255,74,61,.9)" : "rgba(155,226,122,.92)") : "rgba(255,255,255,.08)", border: "3px solid rgba(255,255,255,.6)", boxShadow: on ? "0 18px 30px rgba(0,0,0,.5)" : undefined,
          transform: on ? `translateY(${-8 * (1 - e(t, at + 0.3 + i * 0.18, at + 0.5 + i * 0.18))}px)` : undefined, display: "flex", flexDirection: "column", justifyContent: "center", color: on ? "#0f1a0b" : COL.dim }}>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 2 }}>SEM</div><div style={{ fontSize: 56, fontWeight: 900, lineHeight: 1 }}>{cut ? "✕" : i + 1}</div></div>; })}
    </div>
  </div>;
};

// la cuenta (sin precios): cada planta que NO compras en el vivero → la guía ya se pagó
const Cuenta: React.FC<{ t: number; at: number; paid: number; out: number }> = ({ t, at, paid, out }) => {
  const o = vis(t, at, out);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: 960, top: 720, opacity: o, transform: "translate(-50%,-50%)", fontFamily: FONT, textAlign: "center" }}>
    <div style={{ display: "flex", gap: 30, justifyContent: "center" }}>
      {[0, 1, 2, 3].map((i) => { const a = at + i * 0.45, k = Math.min(1.1, spr(t, a));
        return <div key={i} style={{ opacity: e(t, a, a + 0.1), transform: `scale(${k}) rotate(${(i - 1.5) * 4}deg)`, width: 190, padding: "14px 0", borderRadius: 22, background: "linear-gradient(180deg, rgba(24,30,22,.95), rgba(12,16,11,.95))", boxShadow: "0 26px 50px rgba(0,0,0,.6), 0 0 0 3px #9be27a88" }}>
          <div style={{ fontSize: 92 }}>🪴</div>
          <div style={{ fontWeight: 900, fontSize: 30, color: COL.leaf, letterSpacing: 2 }}>+1 PLANTA</div>
          <div style={{ fontWeight: 800, fontSize: 22, color: COL.red, letterSpacing: 2, textDecoration: "line-through" }}>DEL VIVERO</div>
        </div>; })}
    </div>
    <div style={{ marginTop: 30, opacity: e(t, paid, paid + 0.15), transform: `scale(${2.2 - 1.2 * Math.min(1, spr(t, paid, 1.2))}) rotate(-3deg)`, display: "inline-block", border: `10px solid ${COL.leaf}`, borderRadius: 16, padding: "8px 34px",
      fontWeight: 900, fontSize: 76, color: COL.leaf, background: "rgba(10,30,8,.55)", boxShadow: `0 0 40px ${COL.leaf}66`, textShadow: "0 4px 10px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>LA GUÍA YA SE PAGÓ ✓</div>
  </div>;
};

// aroma: ondas verdes que suben de la ramita apretada
const Aroma: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = vis(t, at, out);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o }}>
    <svg width={500} height={520} viewBox="0 0 500 520" style={{ position: "absolute", left: -250, top: -480, overflow: "visible" }}>
      {[0, 1, 2, 3, 4].map((i) => { const ph = ((t - at) * 0.6 + i * 0.2) % 1; const y0 = 480 - ph * 420;
        return <path key={i} d={`M${170 + i * 40},${y0} q 26,-40 0,-80 q -26,-40 0,-80`} stroke="#9be27a" strokeWidth={12} fill="none" strokeLinecap="round" opacity={(1 - ph) * 0.9} style={{ filter: "drop-shadow(0 0 10px #9be27a)" }} />; })}
    </svg>
    <div style={{ position: "absolute", left: 120, top: -260, transform: `scale(${Math.min(1.1, spr(t, at + 0.4))})`, fontFamily: FONT, fontWeight: 900, fontSize: 64, color: COL.leaf, textShadow: extrude(6, "#0f2a08"), whiteSpace: "nowrap" }}>HUELE FUERTE ✓</div>
  </div>;
};

// mezcla mitad y mitad
const Mezcla: React.FC<{ t: number; at: number; out: number; b: string }> = ({ t, at, out, b }) => {
  const o = vis(t, at, out), k = ei(t, at, at + 0.7);
  if (o <= 0.01) return null;
  const half = (bg: string, tx: string, d: number) => <div style={{ flex: 1, height: 170, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 44, letterSpacing: 2, color: "#fff", textShadow: extrude(5, "rgba(0,0,0,.6)"), transform: `translateX(${(1 - k) * d}px)` }}>{tx}</div>;
  return <div style={{ position: "absolute", left: 960, top: 190, opacity: o, transform: "translate(-50%,-50%) perspective(1200px) rotateX(10deg)", width: 980, fontFamily: FONT }}>
    <div style={{ display: "flex", borderRadius: 24, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,.6)", border: "5px solid rgba(255,255,255,.8)" }}>
      {half("radial-gradient(circle at 30% 30%, #5a3e28, #2e1d10)", "½ TIERRA", -300)}
      {half("radial-gradient(circle at 30% 30%, #d6b98a, #9c8058)", b, 300)}
    </div>
  </div>;
};

// checklist del repaso (se va tildando con la voz)
const Checklist: React.FC<{ t: number; items: { at: number; tx: string }[]; out: number }> = ({ t, items, out }) => {
  const o = vis(t, items[0].at - 0.3, out);
  if (o <= 0.01) return null;
  const on = items.filter((q) => t >= q.at);
  const shown = on.slice(-5);
  return <div style={{ position: "absolute", left: 70, top: 120, opacity: o, perspective: 1400 }}>
    <div style={{ transform: "rotateY(14deg)", transformOrigin: "0 50%", width: 640, padding: "26px 30px", borderRadius: 24, background: "linear-gradient(180deg, rgba(252,248,238,.97), rgba(236,228,210,.97))", boxShadow: "0 50px 100px rgba(0,0,0,.6)", fontFamily: FONT }}>
      <div style={{ fontWeight: 900, fontSize: 34, color: "#c8402f", letterSpacing: 5, borderBottom: "3px solid #c8402f", paddingBottom: 8, marginBottom: 10 }}>REPASO · {on.length}/{items.length}</div>
      {shown.map((q) => { const k = e(t, q.at, q.at + 0.3);
        return <div key={q.tx} style={{ display: "flex", alignItems: "center", gap: 16, fontWeight: 800, fontSize: 34, color: "#2b2620", lineHeight: "62px", opacity: 0.3 + 0.7 * k, transform: `translateX(${(1 - k) * -40}px)` }}>
          <span style={{ display: "inline-flex", width: 46, height: 46, borderRadius: 10, border: "4px solid #3d7a2a", alignItems: "center", justifyContent: "center", color: "#3d7a2a", fontWeight: 900, fontSize: 38, transform: `scale(${Math.min(1.2, spr(t, q.at + 0.1))})` }}>✓</span>{q.tx}</div>; })}
    </div>
  </div>;
};

// tarjeta 3D con una foto (cae desde el fondo girando)
const CardPh: React.FC<{ t: number; id: string; at: number; out: number; x: number; y: number; w?: number; h?: number; label?: string; col?: string; side?: number }> = ({ t, id, at, out, x, y, w = 640, h = 400, label, col = COL.leaf, side = 1 }) => {
  const k = spr(t, at, 0.9), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return <Card3D id={"img_" + id} x={x} y={y} w={w} h={h} ry={side * ((1 - Math.min(1, k)) * -70 - 12)} rx={4} z={(1 - Math.min(1, k)) * -900} o={o} label={label} labelCol={col} />;
};

// X roja grande sobre la toma
const BigX: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => t > at && t < out + 0.3 ? <div style={{ opacity: 1 - e(t, out, out + 0.3) }}><DrawX t={t} at={at} x={1260} y={300} w={360} h={300} /></div> : null;

// ---------------- la composición del resto ----------------
const S = (q: [number, number, number]) => q;
export const Rest: React.FC = () => {
  const f = useCurrentFrame(), t = Math.max(REST0, f / 30);
  const i = idxAt(t), sh = SHOTS[i], pv = i > 0 ? SHOTS[i - 1] : null;
  const L: React.ReactNode[] = [];
  const isW = (x: Shot | null) => !!x && x.k === "W";

  // --- tomas + transición ---
  const u = ei(t, sh.a, sh.a + TR);
  if (pv && u < 1 && !(isW(pv) && isW(sh))) {
    const av = sh.k === "A" || pv.k === "A";
    if (av) {
      // zoom a través: la toma vieja crece y se desenfoca, la nueva entra
      L.push(<AbsoluteFill key={"o" + (i - 1)} style={{ transformOrigin: "960px 560px", transform: `scale(${1 + u * u * 4})`, filter: `blur(${u * 18}px)` }}><ShotView sh={pv} t={t} i={i - 1} /></AbsoluteFill>);
      L.push(<AbsoluteFill key={"n" + i} style={{ opacity: clamp((u - 0.25) / 0.6), transform: `scale(${1.15 - 0.15 * u})` }}><ShotView sh={sh} t={t} i={i} /></AbsoluteFill>);
    } else {
      const mb = Math.sin(u * Math.PI) * 38, dir = i % 2 ? 1 : -1;
      L.push(<AbsoluteFill key={"o" + (i - 1)} style={{ transform: `translateX(${-dir * u * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><ShotView sh={pv} t={t} i={i - 1} /></AbsoluteFill>);
      L.push(<AbsoluteFill key={"n" + i} style={{ transform: `translateX(${dir * (1 - u) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><ShotView sh={sh} t={t} i={i} /></AbsoluteFill>);
    }
  } else L.push(<AbsoluteFill key={"n" + i}><ShotView sh={sh} t={t} i={i} /></AbsoluteFill>);

  const onW = sh.k === "W" && u >= 1;          // el mundo está quieto en pantalla (los rótulos 3D se anclan)
  const P3 = (q: [number, number, number]): XY => screenOf(t, q);
  const tag = (k: string, a: number, q: [number, number, number] | XY, text: string, o: { dx?: number; dy?: number; sub?: string; col?: string; out?: number; size?: number } = {}) => {
    if (!(t >= a - 0.05 && t < (o.out ?? a + 2.4) + 0.3)) return;
    const p = Array.isArray(q) ? P3(q) : q;
    L.push(<Tag key={k} t={t} at={a} x={p.x} y={p.y} dx={o.dx ?? 200} dy={o.dy ?? -130} text={text} sub={o.sub} col={o.col} out={o.out ?? a + 2.4} size={o.size ?? 50} />);
  };
  const W3 = (a: number, b: number) => onW && t >= a && t < b; // sólo si el mundo está en pantalla
  const stamp = (k: string, a: number, text: string, o: { x?: number; y?: number; out?: number; rot?: number; size?: number; col?: string } = {}) => {
    if (t >= a - 0.05 && t < (o.out ?? a + 2) + 0.3) L.push(<Stamp key={k} t={t} at={a} text={text} x={o.x ?? 960} y={o.y ?? 860} out={o.out ?? a + 2} rot={o.rot ?? -4} size={o.size ?? 80} col={o.col ?? COL.red} />);
  };
  const big = (k: string, a: number, text: string, o: { x?: number; y?: number; out?: number; size?: number; col?: string; edge?: string; sub?: string } = {}) => {
    if (t >= a - 0.05 && t < (o.out ?? a + 2.2) + 0.35) L.push(<BigNum key={k} t={t} at={a} text={text} x={o.x ?? 1450} y={o.y ?? 260} out={o.out ?? a + 2.2} size={o.size ?? 150} col={o.col ?? COL.ink} edge={o.edge ?? "#4a3a22"} sub={o.sub} />);
  };

  // ======== 1 · EL NUDO (101-135) ========
  if (W3(103, 113)) { tag("nu", T.nodo, RQ.nodo, "NUDO", { dx: -220, dy: -150, col: "#d6ff7a", out: 112.6 }); tag("ye", T.bolita, RQ.yema, "LA YEMA", { dx: 240, dy: -120, col: COL.rose, out: 112.6, size: 44 }); }
  stamp("nud", at("eso se llama nudo", 112), "NUDO = RAÍZ", { y: 850, out: 116.8, col: COL.leaf, size: 90 });
  if (W3(117.2, 130)) {
    tag("rn", T.raizNudo + 0.4, RQ.nodo, "LA RAÍZ SALE DEL NUDO", { dx: -260, dy: 140, col: "#fff3d6", out: T.cinco - 0.2, size: 46 });
    tag("5c", T.cinco + 0.3, RQ.stub, "5 CM ✕", { dx: 200, dy: -170, col: COL.red, out: T.ablanda + 3, size: 60 });
    tag("pu", T.ablanda + 0.5, RQ.stub, "SE PUDRE", { dx: 220, dy: 130, col: "#c9a77a", out: 129.8, size: 46 });
  }
  big("1cm", at("a un centimetro debajo del nudo", 130), "1 CM", { sub: "DEBAJO DEL NUDO", col: COL.leaf, edge: "#1d3a12", out: 134.8 });
  // ======== 2 · EL CORTE (135-160) ========
  stamp("dg", at("diagonal de un solo tajo", 134), "EN DIAGONAL", { y: 160, out: 137.6, col: COL.amber, size: 70 });
  stamp("mo", at("si la tijera esta mocha", 138), "TIJERA MOCHA ✕", { y: 160, out: T.conductos - 0.2, size: 70 });
  L.push(<Conductos key="cd" t={t} at={T.conductos} crush={T.conductos + 0.3} stop={at("y el agua ya no sube", 140)} out={at("y la tijera limpia", 141) + 0.6} />);
  stamp("al", at("un algodon con alcohol", 146), "ALCOHOL", { y: 850, out: 149.6, col: COL.ice, size: 80 });
  tag("cp", at("cuando cambio de planta", 149), { x: 1400, y: 620 }, "Y OTRA VEZ", { sub: "AL CAMBIAR DE PLANTA", out: 153.5, col: COL.ice, dx: 140, dy: -120 });
  if (W3(153, 160.3)) tag("hr", T.herida + 0.2, RQ.corte, "EL HONGO ENTRA", { sub: "POR LA HERIDA", col: "#e6e2d6", dx: 220, dy: -150, out: 160.1 });
  // ======== 3 · EL LARGO Y LAS HOJAS (160-213) ========
  big("lap", at("10 a 15 centimetros del grosor", 159), "10-15 CM", { x: 560, y: 230, sub: "GROSOR DE UN LÁPIZ", col: COL.leaf, edge: "#1d3a12", out: 163.5, size: 130 });
  L.push(<CardPh key="cl" t={t} id="c_lapiz" at={at("del grosor de un lapiz", 160) - 0.1} out={163.5} x={1080} y={320} w={700} h={440} label="COMO UN LÁPIZ" />);
  if (W3(163.7, 172)) {
    tag("cor", at("mas corta", 163), RQ.b1, "CORTA ✕", { dx: -220, dy: -140, col: COL.red, sub: "SIN RESERVA", out: 171.4 });
    tag("bie", at("mas larga se seca", 163) - 0.3, RQ.b2, "JUSTA ✓", { dx: 220, dy: -170, col: COL.leaf, out: 171.4 });
    tag("lar", at("mas larga se seca", 163), RQ.b3, "LARGA ✕", { dx: 230, dy: 140, col: COL.red, sub: "SE SECA", out: 171.4 });
  }
  stamp("mal", at("lo que casi todos hacen mal", 168), "LAS HOJAS", { y: 180, out: at("a la rama le quitas", 170) + 0.3, col: COL.amber, size: 90 });
  big("234", at("arriba le dejas dos", 176), "2 · 3 · 4", { sub: "HOJAS ARRIBA, NO MÁS", col: COL.leaf, edge: "#1d3a12", out: 182, x: 1400 });
  if (W3(185, 193.5)) tag("ca", T.canilla + 0.6, RQ.glass, "CANILLA ABIERTA", { dx: 240, dy: -150, col: COL.ice, out: 193.3, size: 54 });
  L.push(<Tanque key="tq" t={t} at={at("con 10 hojas grandes", 193)} out={197.4} x={1480} y={520} />);
  if (W3(197.6, 204)) tag("dh", T.dosHojas + 0.2, RQ.glass, "½ HOJA", { dx: -240, dy: -140, col: COL.leaf, sub: "AGUANTA SEMANAS", out: 203.6 });
  L.push(<Reloj key="rl" t={t} at={at("yo corto temprano", 203)} out={213} x={1520} y={430} h0={7} h1={12} ok="TEMPRANO ✓" bad="MEDIODÍA ✕" badAt={at("nunca al mediodia", 208)} />);
  // ======== 4 · DEL CORTE AL VASO, CORTA DE MÁS (213-247) ========
  tag("tr", at("con un trapo mojado", 214), { x: 1150, y: 560 }, "TRAPO MOJADO", { sub: "A LA SOMBRA", col: COL.ice, out: 221, dx: 160, dy: -160 });
  L.push(<Timer key="tm" t={t} at={at("de la tijera al vaso", 220)} out={225.4} x={1450} y={330} />);
  big("310", at("si quiero tres plantas", 225), "3 → 10", { x: 520, y: 230, sub: "QUIERES 3, CORTA 10", col: COL.amber, edge: "#5a3a00", out: 230 });
  L.push(<CardPh key="cdz" t={t} id="c_diez" at={at("corto diez ramas", 226)} out={230} x={1100} y={330} w={680} h={420} label="DIEZ RAMAS" side={-1} />);
  big("67", T.diez + 0.6, "6-7 DE 10", { sub: "PRENDEN", col: COL.leaf, edge: "#1d3a12", out: at("si cortas uno solo", 233) + 1.6, y: 200, x: 960 });
  stamp("ap", at("estas apostando todo", 234), "TODO A UNA RAMA ✕", { y: 880, out: 238, size: 64 });
  // ======== 5 · CANELA (241-281) ========
  stamp("cn", at("la canela en polvo", 241), "CANELA EN POLVO", { y: 850, out: 244.4, col: "#e0a46a", size: 84 });
  stamp("nh", at("la canela no hace raices", 246), "NO HACE RAÍCES", { y: 170, out: at("lo que hace la canela", 250) - 0.1, size: 76 });
  stamp("fh", T.canela + 0.5, "FRENA EL HONGO ✓", { y: 170, out: 256.6, col: COL.leaf, size: 76 });
  if (W3(256, 260)) tag("cu", T.plato + 0.3, RQ.plate, "1 CUCHARADITA", { dx: 220, dy: -150, col: "#e0a46a", sub: "PLATO LIMPIO", out: 259.6 });
  L.push(<Pills key="pc" t={t} items={[{ at: at("mojas el centimetro", 259), tx: "MOJAS 1 CM", col: COL.ice }, { at: at("y lo pasas por la canela", 260), tx: "CANELA", col: "#e0a46a" }, { at: at("sacudes", 264), tx: "SACUDES", col: COL.ink }]} out={267} y={880} />);
  if (W3(268, 272)) tag("pm", at("como polvo en un mueble", 268) + 0.2, RQ.plate, "CAPA FINITA ✓", { dx: -230, dy: -150, col: COL.leaf, sub: "NO UNA PASTA", out: 271.9 });
  L.push(<Calendar key="c10" t={t} x={150} y={150} inAt={at("cada 10 dias miras", 272)} out={276} days={[{ at: at("cada 10 dias miras", 272), d: 1 }, { at: at("cada 10 dias miras", 272) + 0.5, d: 10 }]} />);
  L.push(<CardPh key="cmh" t={t} id="c_moho" at={at("si ves algo de mojo", 274) + 0.1} out={280.8} x={1100} y={300} w={700} h={430} label="RASPAS Y CANELA OTRA VEZ" col="#e0a46a" />);
  // ======== 6 · MIEL (281-313) ========
  big("mi2", at("la segunda cosa", 280), "2ª", { sub: "MIEL DE ABEJA · PURA", col: "#ffc23d", edge: "#5a3a00", out: at("la miel es como una curita", 285) - 0.1, x: 480, y: 250 });
  if (W3(286, 291.3)) tag("cur", T.curita + 0.4, RQ.corte, "UNA CURITA", { dx: 220, dy: -150, col: "#ffc23d", sub: "SIN BACTERIAS NI HONGO", out: 291.1 });
  stamp("rg", at("sirve sobre todo para ramas gruesas", 291), "RAMAS GRUESAS", { y: 850, out: 294.6, col: "#ffc23d", size: 80 });
  if (W3(298, 301)) tag("ll", T.llorar + 0.5, RQ.corte, "LA BASE LLORA", { dx: -230, dy: -140, col: "#e9efc8", out: 300.8 });
  stamp("er", T.mielMucha + 0.2, "MUCHA MIEL ✕", { y: 180, out: 307, size: 76 });
  L.push(<CardPh key="cmm" t={t} id="c_miel_mucha" at={at("junta hormigas", 307)} out={312.7} x={1090} y={300} w={700} h={430} label="HORMIGAS + MOHO PEGAJOSO" col={COL.red} />);
  L.push(<BigX key="bx" t={t} at={at("se hace un moho pegajoso", 309)} out={312.6} />);
  // ======== 7 · SÁBILA (313-361) ========
  big("sa3", at("la tercera cosa es la sabila", 315), "3ª", { sub: "LA SÁBILA", col: COL.leaf, edge: "#1d3a12", out: 320.2, x: 480, y: 250 });
  big("pe", at("15 a 20 centimetros verde y gorda", 324), "15-20 CM", { col: COL.leaf, edge: "#1d3a12", out: 328.5, x: 560, y: 230 });
  L.push(<Pills key="ps" t={t} items={[{ at: at("verde y gorda", 325), tx: "VERDE Y GORDA ✓" }, { at: at("no la amarilla", 326), tx: "AMARILLA ✕", bad: true }]} out={328.5} />);
  if (W3(335, 338.8)) tag("ml", T.gel + 0.3, RQ.jar, "½ LITRO DE AGUA", { dx: 230, dy: -150, col: COL.ice, out: 338.6 });
  stamp("cue", at("lo cuelas", 338), "CUÉLALO", { y: 850, out: 342.6, col: COL.ice, size: 90 });
  if (W3(348, 355.6)) tag("rm", T.remojo + 0.3, RQ.jar, "12 A 24 H", { dx: -240, dy: -150, col: COL.amber, sub: "A LA SOMBRA", out: 355.4 });
  big("s4", at("y la cuarta", 358), "4ª", { sub: "EL SAUCE DEL RÍO", col: COL.leaf, edge: "#1d3a12", out: 361.5, x: 1450, y: 250 });
  // ======== 8 · SAUCE (361-427) ========
  // ventana del avatar "un palo de sauce clavado en el barro termina siendo un árbol": portal al palo que brota
  { const w0 = at("un palo de sauce", 372), w1 = at("y esas sustancias", 376) ;
    if (t >= w0 - 0.1 && t < w1 + 0.1) { const r = ei(t, w0 + 0.6, w0 + 1.2) * (1 - ei(t, w1 - 0.5, w1)); const a = screenOf(t, RQ.stick); if (r > 0) L.push(<Portal key="pps" x={1380} y={480} r={r * 0.42} ring={0.8}><AbsoluteFill style={{ transform: `translate(${1380 - a.x}px, ${480 - a.y}px) scale(1.15)`, transformOrigin: `${a.x}px ${a.y}px` }}><World t={t} /></AbsoluteFill></Portal>);
      if (r > 0.3) L.push(<Tag key="pal" t={t} at={w0 + 1.2} x={1380} y={700} dx={-200} dy={150} text="TERMINA SIENDO UN ÁRBOL" col={COL.leaf} out={w1 - 0.5} size={44} />); } }
  big("10r", at("cortas unas 10 ramitas", 380), "10 RAMITAS", { sub: "VERDES · 20-30 CM", col: COL.leaf, edge: "#1d3a12", out: at("las cortas en pedacitos", 383) - 0.1, size: 120 });
  L.push(<Pills key="pl" t={t} items={[{ at: at("en un litro de agua", 389), tx: "1 LITRO", col: COL.ice }, { at: at("en un frasco tapado", 390), tx: "TAPADO", col: COL.ink }, { at: at("a la sombra un", 391), tx: "SOMBRA", col: COL.leaf }, { at: at("dia entero", 393), tx: "1 DÍA", col: COL.amber }]} out={396} />);
  stamp("enr", at("ese es tu enraizante", 396), "TU ENRAIZANTE", { y: 180, out: 400, col: COL.leaf, size: 84 });
  if (W3(404, 408)) tag("ri", T.riegaS + 0.2, RQ.potTop, "1 VEZ POR SEMANA", { dx: 230, dy: -150, col: COL.ice, sub: "3 SEMANAS", out: 412.9 });
  big("2d", at("dura 2 dias", 410), "DURA 2 DÍAS", { col: COL.amber, edge: "#5a3a00", out: 413.4, size: 120, x: 960, y: 220 });
  stamp("ref", at("al refri", 413), "AL REFRI", { y: 180, x: 1400, out: 416, col: COL.ice, size: 70 });
  stamp("emp", at("es un empujon suave", 415), "UN EMPUJÓN SUAVE", { y: 870, out: 418.5, col: COL.amber, size: 70 });
  if (W3(418, 423)) { tag("sol", T.sol + 0.2, RQ.potTop, "SOL ✕", { dx: -220, dy: -150, col: COL.red, out: 422.8, size: 60 }); tag("ch", T.charco + 0.2, RQ.pot, "CHARCO ✕", { dx: 230, dy: -100, col: COL.red, out: 422.8, size: 60 }); }
  stamp("dif", at("para lo que cuesta", 423), "PARA LAS QUE CUESTAN", { y: 850, out: 426.3, col: COL.leaf, size: 70 });
  // ======== 9 · ¿AGUA O TIERRA? (427-497) ========
  stamp("aot", T.aguaTierra, "¿AGUA O TIERRA?", { y: 170, out: 435, col: COL.ice, size: 90, rot: -2 });
  L.push(<Pills key="pa" t={t} items={[{ at: at("como el potos", 441), tx: "POTOS" }, { at: at("el geranio", 442), tx: "GERANIO" }, { at: at("la albahaca", 443), tx: "ALBAHACA" }, { at: at("o el coleo", 443), tx: "COLEO" }]} out={445.1} y={880} />);
  stamp("ev", at("esas si van en el vaso", 445), "VAN EN EL VASO", { y: 170, out: 448.6, col: COL.ice, size: 76 });
  if (W3(448, 457.5)) tag("23", at("2 o 3 centimetros de agua", 447) + 0.2, RQ.glassW, "2-3 CM DE AGUA", { dx: 230, dy: -150, col: COL.ice, sub: "NINGUNA HOJA EN EL AGUA", out: 452.6 });
  L.push(<Pills key="pt" t={t} items={[{ at: at("la rosa la bugambilia", 457), tx: "ROSA", col: COL.rose }, { at: at("la bugambilia el romero", 458), tx: "BUGAMBILIA", col: "#f04aa8" }, { at: at("el romero el jazmin", 459), tx: "ROMERO", col: "#b9a8ff" }, { at: at("el jazmin", 460), tx: "JAZMÍN", col: COL.ink }, { at: at("la lavanda", 460), tx: "LAVANDA", col: "#b9a8ff" }]} out={462.3} y={880} />);
  stamp("tt", T.terminan + 0.3, "TERMINAN EN TIERRA", { y: 170, out: 469, col: "#c9a77a", size: 76 });
  stamp("sp", at("se pudren antes de echar raiz", 473), "SE PUDREN", { y: 850, out: 477, size: 90 });
  L.push(<Pills key="d2" t={t} items={[{ at: T.dos + 0.6, tx: "1 EN AGUA", col: COL.ice }, { at: T.dos + 1.4, tx: "1 EN TIERRA", col: "#c9a77a" }]} out={T.prende + 2} y={880} />);
  stamp("an", at("y anotalo", 484), "ANÓTALO ✍", { y: 170, out: 488.5, col: COL.amber, size: 76 });
  // ======== 10 · LA ROSA (491-597) ========
  stamp("rq", at("la que mas gente quiere", 491), "LA MÁS QUERIDA… Y LA QUE MÁS SE PIERDE", { y: 860, out: 495.6, col: COL.rose, size: 54 });
  L.push(<Rueda key="r1" t={t} at={at("primero la epoca", 495)} out={502.5} x={1500} y={420} marks={[{ at: at("a fines del invierno", 497), i: 0, ok: true }, { at: at("o en el otono", 498), i: 3, ok: true }]} />);
  stamp("sf", at("le cortas la flor", 509), "SIN FLOR", { y: 860, out: 512.3, col: COL.rose, size: 90 });
  L.push(<Pills key="pr" t={t} items={[{ at: at("eliges ramas del ano", 511), tx: "DEL AÑO", col: COL.leaf }, { at: at("de 15 a 20 centimetros del grosor", 512), tx: "15-20 CM", col: COL.ink }, { at: at("con tres o cuatro nudos", 517), tx: "3-4 NUDOS", col: "#d6ff7a" }]} out={520} y={880} />);
  L.push(<CardPh key="cgu" t={t} id="c_rosa_guantes" at={at("ponte guantes", 525)} out={530.3} x={1100} y={300} w={700} h={430} label="GUANTES: ESPINAS Y SAVIA" col={COL.amber} />);
  L.push(<Pills key="pq" t={t} items={[{ at: T.remojaR, tx: "SAUCE", col: COL.leaf }, { at: T.canelaR + 0.4, tx: "CANELA", col: "#e0a46a" }, { at: at("y la entierras bien hondo", 532), tx: "HONDO", col: "#c9a77a" }]} out={T.hondo - 0.2} y={880} />);
  L.push(<Tercios key="tc" t={t} at={T.hondo} out={542.2} x={1560} y={480} />);
  L.push(<Mezcla key="mz" t={t} at={at("mitad tierra para macetas", 542)} out={546.2} b="½ ARENA HÚMEDA" />);
  big("12", T.arena + 0.4, "12 CM", { sub: "MACETA", col: COL.ink, out: 551, x: 1450, y: 250 });
  big("34", T.tres + 0.3, "3 O 4 JUNTAS", { col: COL.rose, edge: "#5a1030", out: 556.4, x: 960, y: 200, size: 120 });
  stamp("np", at("no pierdes todo por una rama", 558), "NO PIERDES TODO", { y: 860, out: 561, col: COL.leaf, size: 76 });
  if (W3(568, 579)) { tag("inj", T.bola + 0.3, RQ.graft, "EL INJERTO", { dx: 230, dy: -150, col: COL.amber, out: 574.4 }); tag("chu", T.debajo + 0.8, RQ.sucker, "ESTA NO ✕", { dx: 230, dy: -100, col: COL.red, sub: "SALE DE ABAJO DEL NUDO", out: 574.4 }); }
  stamp("ntr", at("la del pie no tu rosa", 576), "NO ES TU ROSA", { y: 860, out: 578.8, size: 84 });
  L.push(<Semanas key="s8" t={t} at={T.semanas8} out={596.3} to={8} title="LA ROSA TARDA 6 A 8 SEMANAS" />);
  big("57", at("de 5 a 7", 591), "5-7 DE 10", { sub: "PRENDEN", col: COL.leaf, edge: "#1d3a12", out: 594, x: 960, y: 560, size: 130 });
  stamp("nt8", at("no la tires antes de la semana 8", 592), "NO LA TIRES ANTES DE LA 8", { y: 880, out: 596.3, col: COL.amber, size: 60 });
  // ======== 11 · CTA2: LA PÁGINA 30 + LA CUENTA (597-640) ========
  if (W3(600, 612)) { tag("p30", T.pag30 + 0.4, [1.39, 0.99, -2.2], "PÁG. 30", { dx: 230, dy: -170, col: "#ffd60a", sub: "LA LÁMINA DE LOS DÍAS", out: 607.6, size: 64 }); }
  L.push(<CardPh key="c30" t={t} id="p030" at={at("el coleo una o dos semanas", 607) - 0.1} out={611.3} x={1080} y={180} w={760} h={560} label="COLEO · 1-2 SEMANAS" col="#ffd60a" />);
  L.push(<Pills key="pd" t={t} items={[{ at: at("dos a tres la rosa", 611), tx: "POTOS 2-3", col: COL.leaf }, { at: at("la rosa y la bugambilia hasta", 612), tx: "ROSA Y BUGAMBILIA 8", col: COL.rose }, { at: at("la lavanda hasta diez", 614), tx: "LAVANDA 10", col: "#b9a8ff" }]} out={T.cuenta - 0.3} y={880} />);
  L.push(<Cuenta key="cu" t={t} at={T.cuenta + 0.8} paid={at("la guia ya se pago", 626)} out={629.3} />);
  stamp("pms", T.masPlantas + 0.4, "+1 PLANTA, PARA SIEMPRE", { y: 860, out: 633, col: COL.leaf, size: 70 });
  { const d0 = at("el link en la primera linea", 632); L.push(<Desc key="desc" t={t} at={d0} out={d0 + 4} />); }
  // ======== 12 · BUGAMBILIA (636-713) ========
  stamp("trc", at("es traicionera", 637), "TRAICIONERA", { y: 170, out: 640.3, col: "#f04aa8", size: 80 });
  stamp("vrd", at("la rama verde parece facil", 640), "VERDE ✕ SE SECA", { y: 860, out: 643.4, size: 70 });
  if (W3(643.4, 656)) { tag("vj", T.bugaVerde + 0.4, RQ.b3, "VIEJA ✕", { dx: 220, dy: 120, col: COL.red, out: 655.5 }); tag("sm", T.semi + 0.2, RQ.b2, "SEMILEÑOSA ✓", { dx: 220, dy: -160, col: COL.leaf, out: 655.5, size: 54 }); tag("vd", T.semi + 0.4, RQ.b1, "VERDE ✕", { dx: -220, dy: -150, col: COL.red, out: 655.5 }); }
  stamp("chq", at("con un chasquido", 653) + 0.2, "¡CRAC! ESA ES", { y: 180, out: 659, col: COL.leaf, size: 84 });
  big("bg15", at("de 15 a 20 centimetros corte debajo", 656), "15-20 CM", { col: COL.leaf, edge: "#1d3a12", out: 660.6, x: 520, y: 230 });
  L.push(<Rueda key="r2" t={t} at={T.primavera - 0.2} out={676.8} x={1500} y={430} marks={[{ at: T.primavera + 0.4, i: 1, ok: true }, { at: at("o al final del verano", 668), i: 2, ok: true }, { at: at("en pleno invierno", 672), i: 0, ok: false }]} />);
  if (W3(677, 688)) tag("10m", T.remojaB + 0.4, RQ.glass, "10 MIN EN AGUA", { dx: 230, dy: -150, col: COL.ice, out: 682 });
  big("10mb", T.canelaB + 1.4, "10 MIN", { sub: "SECAR AL AIRE", col: "#e0a46a", edge: "#5a3a00", out: 687.7, x: 1450, y: 240 });
  L.push(<Mezcla key="mz2" t={t} at={at("mitad tierra y mitad arena gruesa", 689)} out={692.9} b="½ ARENA GRUESA" />);
  stamp("pm2", at("odia los pies mojados", 693), "ODIA LOS PIES MOJADOS", { y: 170, out: 697, col: COL.ice, size: 66 });
  if (W3(697, 707.5)) tag("ab", T.arenaB + 0.3, RQ.pot, "EL AGUA BAJA ✓", { dx: 240, dy: -130, col: COL.ice, out: 700.8 });
  big("bg1520", at("en una maceta de 15 o 20", 700), "10 CM", { sub: "HONDO · MACETA DE 15-20", col: COL.ink, out: 704, x: 1450, y: 240 });
  big("b56", at("5 o 6", 712), "5-6 DE 10", { sub: "4 A 8 SEMANAS", col: COL.leaf, edge: "#1d3a12", out: 715.6, x: 960, y: 220 });
  // ======== 13 · ROMERO (713-776) ========
  stamp("agr", at("el mas agradecido", 714), "EL MÁS AGRADECIDO", { y: 170, out: 718.4, col: "#b9a8ff", size: 76 });
  if (W3(718, 724.2)) tag("gr", T.romBase + 0.3, [3.4, 0.25, -1.0], "GRIS Y LEÑOSA", { dx: 220, dy: -120, col: "#c9a77a", out: 724 });
  stamp("ab2", at("cortar la parte de abajo", 725), "ABAJO ✕", { y: 860, out: 728.4, size: 90 });
  if (W3(733, 738.8)) tag("pnt", T.puntas + 0.3, [3.4, 0.95, -1.0], "LAS PUNTAS ✓", { dx: -230, dy: -150, col: COL.leaf, sub: "10-12 CM", out: 738.6 });
  L.push(<Aroma key="ar" t={t} at={at("las aprietas y huelen", 738)} out={742.4} x={760} y={900} />);
  L.push(<Pills key="pro" t={t} items={[{ at: at("los 4 centimetros de abajo", 744), tx: "4 CM PELADOS", col: COL.ink }, { at: T.deshoja + 0.3, tx: "3 PARES ARRIBA", col: COL.leaf }, { at: at("lo pasas por canela y lo entierras", 750), tx: "CANELA", col: "#e0a46a" }, { at: T.romEnt + 0.3, tx: "4 CM HONDO", col: "#c9a77a" }]} out={756.4} y={880} />);
  L.push(<Reloj key="rl2" t={t} at={at("sol de la manana", 756)} out={759.8} x={1520} y={430} h0={8} h1={12.5} ok="SOL DE MAÑANA ✓" bad="MEDIODÍA: SOMBRA" badAt={at("y sombra al mediodia", 757)} />);
  big("r68", at("de 6 a 8 y cuando", 762), "6-8 DE 10", { sub: "3 A 6 SEMANAS", col: COL.leaf, edge: "#1d3a12", out: 765.5, x: 1450, y: 240 });
  big("x2", at("te da el doble de hojas", 771), "×2", { sub: "HOJAS PARA LA COCINA", col: COL.leaf, edge: "#1d3a12", out: 775.6, size: 220, x: 1450 });
  // ======== 14 · LA BOLSA (776-862) ========
  stamp("sec", at("y ahora el secreto", 771), "EL SECRETO", { y: 170, out: 778.5, col: COL.amber, size: 90 });
  if (W3(783, 788.5)) tag("inv", T.invernadero + 0.3, RQ.bag, "UN INVERNADERO", { dx: 230, dy: -150, col: COL.ice, out: 788.2 });
  big("20c", at("clavas un palito de 20", 791), "20 CM", { sub: "EL PALITO", col: COL.ink, out: 793.1, x: 520 });
  L.push(<Pills key="pb" t={t} items={[{ at: at("para que la bolsa no toque", 792), tx: "NO TOCA LAS HOJAS", col: COL.leaf }, { at: at("con una liga", 798), tx: "LIGA", col: COL.red }]} out={801} />);
  if (W3(801, 805)) tag("nb", T.nube + 0.6, RQ.bag, "NUBECITA DE HUMEDAD", { dx: -240, dy: -150, col: "#e8f4ff", out: 804.8 });
  stamp("bt", at("corta una botella", 806), "BOTELLA = TAPA", { y: 860, out: 809.3, col: COL.ice, size: 76 });
  { const h0 = T.horno, h1 = at("luz clara pero sombra", 821);
    if (t >= h0 - 0.2 && t < h1 + 0.4 && sh.k === "W") { const amt = e(t, h0, h0 + 1) * (1 - e(t, h1 - 0.3, h1)); L.length && L.splice(0, 1, <HeatHaze key="hh" t={t} amt={amt}><ShotView sh={sh} t={t} i={i} /></HeatHaze>); }
    L.push(<Thermo key="th" t={t} at={h0 + 0.2} x={1500} y={240} from={24} to={52} dur={2} out={h1 - 0.2} />);
    stamp("hr", h0 + 0.2, "UN HORNO", { y: 860, out: T.cocina + 1.5, size: 90 }); }
  L.push(<Pills key="pag" t={t} items={[{ at: at("luz clara pero sombra", 821), tx: "LUZ CLARA, SOMBRA", col: COL.ice }, { at: at("tres o cuatro agujeritos", 823), tx: "3-4 AGUJERITOS", col: COL.leaf }]} out={827.3} />);
  stamp("pel", at("es el dia mas peligroso", 834), "EL DÍA MÁS PELIGROSO", { y: 170, out: 837.6, size: 70 });
  big("25", T.raices25 + 0.6, "2-5 CM", { sub: "Y QUE SEAN VARIAS", col: "#fff3d6", edge: "#4a3a22", out: 841.4, x: 1450 });
  big("1012", at("una maceta chica de 10 o 12", 843), "10-12 CM", { sub: "MACETA CHICA", col: COL.ink, out: 846.9, x: 1450 });
  stamp("ncho", at("no tiene que chorrear", 851), "NO CHORREA ✓", { y: 860, out: 853.8, col: COL.leaf, size: 76 });
  L.push(<Pills key="pt2" t={t} items={[{ at: at("riegas con un vaso", 857), tx: "UN VASO DE AGUA", col: COL.ice }, { at: at("en sombra clara una semana", 859), tx: "SOMBRA 1 SEMANA", col: COL.leaf }]} out={861.4} />);
  stamp("qm", T.quema + 0.5, "EL PRIMER SOL LA QUEMA", { y: 170, out: 869, size: 66 });
  // ======== 15 · EL ERROR QUE MATA 7 DE 10 (869-923) ========
  big("7d", at("el error que mata 7", 870), "7 DE 10", { sub: "EL ERROR QUE LOS MATA", col: COL.red, edge: "#4a0f0a", out: 874.4, x: 960, y: 260 });
  stamp("cb", T.cierra + 0.2, "BOLSA CERRADA SIEMPRE ✕", { y: 170, out: 880, size: 66 });
  if (W3(879, 887)) tag("hg", T.hongoB + 0.2, RQ.bag, "HONGO", { dx: 230, dy: -150, col: "#e6e2d6", sub: "EN UNA SEMANA", out: 886.7, size: 60 });
  // ventana "es exactamente lo mismo que le pasó a la rama de tu vecina en el vaso": portal al vaso podrido del minuto 1
  { const w0 = at("es exactamente lo mismo", 886), w1 = at("bolsa se abre una hora", 889);
    if (t >= w0 - 0.1 && t < w1 + 0.1) { const r = ei(t, w0 + 0.5, w0 + 1.1) * (1 - ei(t, w1 - 0.45, w1)); const a = screenOf(26, VASO); if (r > 0) L.push(<Portal key="pv" x={1400} y={470} r={r * 0.42} ring={0.8}><AbsoluteFill style={{ transform: `translate(${1400 - a.x}px, ${470 - a.y}px) scale(1.15)`, transformOrigin: `${a.x}px ${a.y}px` }}><World t={26} /></AbsoluteFill></Portal>);
      if (r > 0.3) L.push(<Tag key="vv" t={t} at={w0 + 1.1} x={1400} y={700} dx={-200} dy={150} text="LA RAMA DE TU VECINA" col={COL.rose} out={w1 - 0.45} size={44} />); } }
  big("1h", T.abreB + 0.3, "1 HORA", { sub: "CADA 2 DÍAS", col: COL.ice, edge: "#0a2a40", out: 895, x: 1450 });
  if (W3(895, 901.5)) tag("gt", T.gotas + 0.4, RQ.bag, "GOTAS GRANDES", { dx: -230, dy: -150, col: COL.ice, sub: "ABRIR MÁS SEGUIDO", out: 899 });
  stamp("pac", at("uno es la paciencia", 899), "PACIENCIA", { y: 860, out: 901.4, col: COL.amber, size: 84 });
  L.push(<Semanas key="s3" t={t} at={at("la gente tira el esqueje", 901)} out={905.5} to={3} stop={3} title="LA TIRAN EN LA SEMANA 3…" />);
  if (W3(905.6, 910)) tag("pdb", T.porDebajo + 0.4, RQ.pot, "…Y ESTABA ECHANDO RAÍZ", { dx: 240, dy: -100, col: "#fff3d6", out: 909.6, size: 46 });
  stamp("res", at("y si resiste ya tiene raiz", 910), "SI RESISTE: TIENE RAÍZ ✓", { y: 170, out: 916.5, col: COL.leaf, size: 64 });
  stamp("gan", at("ganaste", 917), "¡GANASTE!", { y: 860, out: 919.6, col: COL.leaf, size: 100 });
  stamp("as", at("y el otro es el agua sucia", 918), "EL AGUA SUCIA", { y: 170, out: 922.8, col: "#c9a77a", size: 80 });
  // ======== 16 · AGUA SUCIA + REPASO + CIERRE (923-991) ========
  if (W3(923, 931)) { tag("c3", T.sucia + 0.4, RQ.glass, "CADA 3 DÍAS", { dx: 230, dy: -150, col: COL.ice, out: 926.5 }); tag("hn", T.negra + 0.5, RQ.glass, "HOJA NEGRA FUERA", { dx: -230, dy: -150, col: COL.red, out: 929.3 }); }
  stamp("sop", T.sopa + 0.2, "SOPA DE HONGOS", { y: 860, out: 931.6, size: 80 });
  L.push(<Checklist key="ck" t={t} out={967.3} items={[
    { at: at("corte a un centimetro debajo del nudo", 930), tx: "1 CM DEBAJO DEL NUDO" }, { at: at("en diagonal", 932), tx: "EN DIAGONAL" }, { at: at("con la tijera limpia", 934), tx: "TIJERA LIMPIA" },
    { at: at("dos a cuatro hojas arriba", 935), tx: "2 A 4 HOJAS ARRIBA" }, { at: at("corta temprano", 939), tx: "TEMPRANO, PLANTA REGADA" }, { at: at("canela para frenar", 943), tx: "CANELA: FRENA EL HONGO" },
    { at: at("miel para las ramas gruesas", 945), tx: "MIEL: RAMAS GRUESAS" }, { at: at("sabila para las tiernas", 944), tx: "SÁBILA: LAS TIERNAS" }, { at: at("y agua de sauce para las que cuestan", 948), tx: "SAUCE: LAS QUE CUESTAN" },
    { at: at("lo tierno en agua", 950), tx: "LO TIERNO EN AGUA" }, { at: at("terminan en tierra", 954), tx: "DURAS: TERMINAN EN TIERRA" }, { at: at("bolsa con agujeritos", 957), tx: "BOLSA CON AGUJERITOS" },
    { at: at("y abierta cada dos dias", 957), tx: "ABIERTA CADA 2 DÍAS" }, { at: at("y paciencia hasta la semana 8", 961), tx: "PACIENCIA: SEMANA 8" },
  ]} />);
  stamp("nf", at("no le pidas una rama con flor", 968), "SIN FLOR", { y: 860, out: 971.4, col: COL.rose, size: 90 });
  L.push(<Pills key="pf" t={t} items={[{ at: at("tres ramas del ano", 969), tx: "3 RAMAS DEL AÑO", col: COL.leaf }, { at: at("temprano en la manana y si", 974), tx: "TEMPRANO", col: COL.amber }, { at: at("que te de 10", 974), tx: "MEJOR 10", col: COL.ink }]} out={979} />);
  stamp("dev", T.devuelves + 0.3, "LE DEVUELVES UNA PLANTA 🪴", { y: 170, out: 982.6, col: COL.leaf, size: 64 });
  stamp("prx", at("en el proximo video", 981), "PRÓXIMO VIDEO: QUÉ ECHARLE AL PIE", { y: 860, out: 988.6, col: COL.rose, size: 56 });
  if (t > 989) L.push(<Flash key="fin" t={t} at={991.0} peak={0.25} />);

  return <AbsoluteFill style={{ background: "#0b0d08" }}>{L}</AbsoluteFill>;
};

// ---------------- el video entero ----------------
export const HDCESQ_FRAMES = s(991.8);
export const Hdcesq: React.FC = () => { const f = useCurrentFrame(); return f < MIN1_FRAMES ? <Min1 /> : <Rest />; };
void fin; void S;

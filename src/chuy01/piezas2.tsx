// chuy01 · piezas NUEVAS de los minutos 2 a 11 (HTML/SVG 2.5D con perspectiva real), encima del mundo 3D, de las tomas y del avatar.
// Cada una entra con resorte y sale sola (a = entra, out = sale). Todas reciben segundos anclados con at("frase").
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { COL, FONT, P, e, ei, extrude, spr } from "./lib";

const op = (t: number, a: number, out: number, fi = 0.15, fo = 0.3) => e(t, a - fi, a) * (1 - e(t, out, out + fo));
const pop = (t: number, a: number, k = 1) => Math.min(1.12, spr(t, a, k));
const ink = "rgba(0,0,0,.6)";
const glass = { background: "linear-gradient(180deg, rgba(16,24,38,.93), rgba(8,12,20,.93))", boxShadow: "0 36px 80px rgba(0,0,0,.65), inset 0 1px 0 rgba(255,255,255,.16)", borderRadius: 18 } as const;
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

// ---- sello de goma (tinta con poros) que cae de golpe y queda torcido
export const Sello: React.FC<{ t: number; a: number; out: number; text: string; x: number; y: number; col?: string; rot?: number; size?: number; sub?: string }> = ({ t, a, out, text, x, y, col = COL.red, rot = -7, size = 86, sub }) => {
  const o = op(t, a, out, 0.04);
  if (o <= 0.01) return null;
  const k = ei(t, a - 0.04, a + 0.14), sc = 2.3 - 1.3 * k + 0.06 * Math.exp(-(t - a - 0.14) * 9) * (t > a + 0.14 ? 1 : 0);
  const id = "porous" + Math.round(a * 100);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${sc})` }}>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={7} /><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 1.7" /><feComposite in="SourceGraphic" operator="in" /></filter></svg>
      <div style={{ filter: `url(#${id}) drop-shadow(0 8px 14px rgba(0,0,0,.5))`, border: `9px solid ${col}`, outline: `3px solid ${col}`, outlineOffset: 7, borderRadius: 12, padding: "10px 34px", fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, letterSpacing: 5, whiteSpace: "nowrap", textAlign: "center", lineHeight: 1.05 }}>
        {text}
        {sub && <div style={{ fontSize: size * 0.32, letterSpacing: 6 }}>{sub}</div>}
      </div>
    </div>
  );
};

// ---- foto vieja (polaroid) que se apoya girando, con leyenda escrita
export const Polaroid: React.FC<{ t: number; a: number; out: number; img: string; cap: string; x: number; y: number; w?: number; rot?: number }> = ({ t, a, out, img, cap, x, y, w = 620, rot = -5 }) => {
  const o = op(t, a, out);
  if (o <= 0.01) return null;
  const k = pop(t, a, 0.7), n = Math.round(cap.length * e(t, a + 0.5, a + 1.6));
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1400 }}>
      <div style={{ transform: `translate(-50%,-50%) rotateX(${(1 - Math.min(1, k)) * 50}deg) rotateZ(${rot + (1 - Math.min(1, k)) * 14}deg) translateZ(${(1 - Math.min(1, k)) * 300}px)`, background: "#f6f2e8", padding: "22px 22px 90px", boxShadow: "0 50px 90px rgba(0,0,0,.6)", borderRadius: 4 }}>
        <Img src={staticFile(P + "img_" + img + ".jpg")} style={{ width: w, height: w * 0.62, objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", left: 30, bottom: 22, fontFamily: "'Segoe Script','Brush Script MT',cursive", fontSize: 44, color: "#27313f" }}>{cap.slice(0, n)}</div>
      </div>
    </div>
  );
};

// ---- insignia "aquí no me paga nadie": moneda con $0 que gira + franja
export const NoSponsor: React.FC<{ t: number; a: number; b: number; out: number; x: number; y: number }> = ({ t, a, b, out, x, y }) => {
  const o = op(t, a, out);
  if (o <= 0.01) return null;
  const k = pop(t, a), ry = (1 - Math.min(1, k)) * 180 + Math.sin((t - a) * 1.4) * 10;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1000, transform: "translate(-50%,-50%)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
        <div style={{ width: 210, height: 210, borderRadius: "50%", transform: `rotateY(${ry}deg)`, background: "radial-gradient(circle at 35% 30%, #fff2c2, #e2b247 55%, #9a6d18)", boxShadow: "0 26px 50px rgba(0,0,0,.6), inset 0 0 0 10px rgba(120,80,10,.55)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 96, color: "#6b4a0e", textShadow: "0 2px 0 #ffe9a8" }}>$0</div>
        <div style={{ ...glass, padding: "18px 28px", fontFamily: FONT, transform: `translateX(${(1 - e(t, b, b + 0.3)) * 40}px)`, opacity: e(t, b, b + 0.3) }}>
          <div style={{ fontWeight: 900, fontSize: 52, color: COL.ink, letterSpacing: 3 }}>NINGUNA MARCA</div>
          <div style={{ fontWeight: 800, fontSize: 30, color: COL.amber, letterSpacing: 5 }}>LO QUE VE ES LO QUE HAY</div>
        </div>
      </div>
    </div>
  );
};

// ---- anillos de golpe (nudillos sobre la lámina) + palabra
export const Knock: React.FC<{ t: number; a: number; out: number; x: number; y: number; text: string }> = ({ t, a, out, x, y, text }) => {
  const o = op(t, a, out);
  if (o <= 0.01) return null;
  const hits = [a, a + 0.35, a + 0.7];
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {hits.map((h, i) => { const u = (t - h) / 0.8; return u > 0 && u < 1 ? <circle key={i} cx={x} cy={y} r={30 + u * 170} fill="none" stroke="#fff" strokeWidth={6 * (1 - u)} opacity={1 - u} /> : null; })}
      </svg>
      <div style={{ position: "absolute", left: x + 120, top: y - 170, fontFamily: FONT, fontWeight: 900, fontSize: 70, color: COL.ink, letterSpacing: 6, textShadow: extrude(6, ink), transform: `scale(${pop(t, a)}) rotate(-4deg)` }}>{text}</div>
    </div>
  );
};

// ---- texto que chorrea (chapopote): letras negras brillantes con gotas que caen
export const Drip: React.FC<{ t: number; a: number; out: number; text: string; x: number; y: number; size?: number }> = ({ t, a, out, text, x, y, size = 150 }) => {
  const o = op(t, a, out);
  if (o <= 0.01) return null;
  const k = pop(t, a, 0.8);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * Math.min(1, k)})` }}>
      <div style={{ position: "relative", fontFamily: FONT, fontWeight: 900, fontSize: size, letterSpacing: 4, color: "#0b0907", WebkitTextStroke: "3px rgba(255,220,170,.55)", textShadow: "0 2px 0 rgba(255,255,255,.25), 0 26px 40px rgba(0,0,0,.75)", whiteSpace: "nowrap" }}>
        {text}
        {Array.from({ length: text.length }, (_, i) => {
          const u = Math.max(0, ((t - a - 0.2 - (i % 3) * 0.25) * 0.55) % 1.4);
          return <div key={i} style={{ position: "absolute", left: `${((i + 0.5) / text.length) * 100}%`, top: size * 0.86, width: 16, height: 18 + u * 120, borderRadius: "0 0 10px 10px", background: "linear-gradient(180deg,#0b0907,#1d1610)", boxShadow: "inset -3px 0 0 rgba(255,220,170,.3)", opacity: i % 2 ? 1 : 0.8 }} />;
        })}
      </div>
    </div>
  );
};

// ---- bayoneta: varilla con marcas MIN/MAX, la mancha de aceite muy abajo, flecha "-1 L"
export const Dipstick: React.FC<{ t: number; a: number; out: number; x: number; y: number }> = ({ t, a, out, x, y }) => {
  const o = op(t, a, out);
  if (o <= 0.01) return null;
  const k = ei(t, a, a + 0.6), lvl = ei(t, a + 0.4, a + 1.4);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translateX(${(1 - k) * -300}px) perspective(1000px) rotateY(12deg)` }}>
      <svg width={900} height={260} viewBox="0 0 900 260">
        <rect x={0} y={110} width={820} height={26} rx={13} fill="url(#steel)" />
        <defs><linearGradient id="steel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f1f3f5" /><stop offset=".5" stopColor="#9aa1a8" /><stop offset="1" stopColor="#5d646b" /></linearGradient></defs>
        <circle cx={850} cy={123} r={44} fill="#f2b01e" stroke="#9b6c06" strokeWidth={6} />
        <rect x={120} y={104} width={170} height={38} fill="none" stroke="#fff" strokeWidth={3} strokeDasharray="8 6" />
        {Array.from({ length: 9 }, (_, i) => <line key={i} x1={130 + i * 19} y1={106} x2={130 + i * 19 - 14} y2={140} stroke="#fff" strokeWidth={2} opacity={0.6} />)}
        <text x={120} y={92} fill="#fff" fontFamily={FONT} fontWeight={900} fontSize={30}>MIN</text>
        <text x={250} y={92} fill="#fff" fontFamily={FONT} fontWeight={900} fontSize={30}>MAX</text>
        <rect x={0} y={108} width={60 * lvl} height={30} rx={8} fill="#0a0806" />
        <path d={`M ${60 * lvl + 10} 190 L 205 190`} stroke={COL.red} strokeWidth={8} markerEnd="url(#ar)" opacity={e(t, a + 1.2, a + 1.5)} />
        <defs><marker id="ar" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={COL.red} /></marker></defs>
        <text x={70} y={245} fill={COL.red} fontFamily={FONT} fontWeight={900} fontSize={52} opacity={e(t, a + 1.3, a + 1.6)}>FALTA CASI 1 LITRO</text>
      </svg>
    </div>
  );
};

// ---- globo de diálogo 3D (lo que dijo el dueño)
export const Bubble: React.FC<{ t: number; a: number; out: number; text: string; x: number; y: number; who?: string; tail?: "l" | "r" }> = ({ t, a, out, text, x, y, who, tail = "l" }) => {
  const o = op(t, a, out);
  if (o <= 0.01) return null;
  const k = pop(t, a), n = Math.round(text.length * e(t, a + 0.1, a + 0.6));
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `scale(${0.5 + 0.5 * Math.min(1.05, k)}) rotate(${tail === "l" ? -3 : 3}deg)`, transformOrigin: tail === "l" ? "0 100%" : "100% 100%" }}>
      <div style={{ position: "relative", background: "#fffdf6", borderRadius: 34, padding: "26px 44px", boxShadow: "0 30px 60px rgba(0,0,0,.55)", fontFamily: FONT }}>
        {who && <div style={{ fontWeight: 800, fontSize: 24, color: "#7a7468", letterSpacing: 4 }}>{who}</div>}
        <div style={{ fontWeight: 900, fontSize: 76, color: "#141414", whiteSpace: "nowrap" }}>{text.slice(0, n)}</div>
        <div style={{ position: "absolute", [tail === "l" ? "left" : "right"]: 50, bottom: -34, width: 0, height: 0, borderLeft: "26px solid transparent", borderRight: "26px solid transparent", borderTop: "40px solid #fffdf6" } as React.CSSProperties} />
      </div>
    </div>
  );
};

// ---- placa de especificaciones remachada (se graban los renglones)
export const SpecPlate: React.FC<{ t: number; rows: { at: number; txt: string }[]; out: number; x: number; y: number }> = ({ t, rows, out, x, y }) => {
  const a = rows[0].at, o = op(t, a, out);
  if (o <= 0.01) return null;
  const k = pop(t, a, 0.8);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1200 }}>
      <div style={{ transform: `rotateY(${-18 + (1 - Math.min(1, k)) * -60}deg) rotateX(6deg)`, width: 520, padding: "34px 40px", borderRadius: 10, background: "linear-gradient(135deg,#d9dde1,#9097a0 45%,#c9ced3 60%,#7d848c)", boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 2px 0 rgba(255,255,255,.7), inset 0 -3px 0 rgba(0,0,0,.35)", position: "relative" }}>
        {[[14, 14], [490, 14], [14, 230], [490, 230]].map(([px, py], i) => <div key={i} style={{ position: "absolute", left: px, top: Math.min(py, 18 + rows.length * 64), width: 16, height: 16, borderRadius: 8, background: "radial-gradient(circle at 35% 35%,#fff,#6b7178)" }} />)}
        {rows.map((r, i) => <div key={i} style={{ fontFamily: FONT, fontWeight: 900, fontSize: 46, color: "#2a2f35", letterSpacing: 3, lineHeight: "64px", textShadow: "0 1px 0 rgba(255,255,255,.7), 0 -1px 0 rgba(0,0,0,.35)", opacity: e(t, r.at, r.at + 0.2), transform: `translateX(${(1 - e(t, r.at, r.at + 0.25)) * 30}px)` }}>{r.txt}</div>)}
      </div>
    </div>
  );
};

// ---- medidor de aguja semicircular (tacómetro / severidad / estiramiento): zonas de color, aguja con rebote, lectura
export const Dial: React.FC<{ t: number; a: number; out: number; x: number; y: number; to: number; max: number; label: string; read?: (v: number) => string; zones?: [number, number, string][]; ticks?: string[]; size?: number; dur?: number }> = ({ t, a, out, x, y, to, max, label, read, zones = [[0, 0.7, "#2ee86a"], [0.7, 0.88, "#ffcf3a"], [0.88, 1, COL.red]], ticks, size = 420, dur = 1.4 }) => {
  const o = op(t, a, out);
  if (o <= 0.01) return null;
  const k = Math.min(1.04, spr(t, a + 0.15, 0.55)), v = to * k * (1 + 0.004 * Math.sin(t * 40));
  const ang = (q: number) => Math.PI * (1 - q);
  const R = size / 2 - 30, cx = size / 2, cy = size / 2 + 10;
  const arc = (q0: number, q1: number) => `M ${cx + R * Math.cos(ang(q0))} ${cy - R * Math.sin(ang(q0))} A ${R} ${R} 0 0 1 ${cx + R * Math.cos(ang(q1))} ${cy - R * Math.sin(ang(q1))}`;
  const q = Math.min(1, v / max);
  void dur;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1100px) rotateX(${(1 - e(t, a, a + 0.4)) * 60 + 10}deg)` }}>
      <div style={{ ...glass, borderRadius: size, padding: "20px 20px 0", width: size, height: size / 2 + 120 }}>
        <svg width={size} height={size / 2 + 40}>
          {zones.map(([z0, z1, c], i) => <path key={i} d={arc(z0, z1)} stroke={c} strokeWidth={22} fill="none" opacity={0.9} />)}
          {Array.from({ length: 11 }, (_, i) => { const g = ang(i / 10); return <line key={i} x1={cx + (R - 26) * Math.cos(g)} y1={cy - (R - 26) * Math.sin(g)} x2={cx + (R - 44) * Math.cos(g)} y2={cy - (R - 44) * Math.sin(g)} stroke="#fff" strokeWidth={i % 5 ? 2 : 5} />; })}
          {ticks && ticks.map((tk, i) => { const g = ang(i / (ticks.length - 1)); return <text key={i} x={cx + (R - 74) * Math.cos(g)} y={cy - (R - 74) * Math.sin(g) + 10} fill={COL.dim} fontFamily={FONT} fontWeight={800} fontSize={24} textAnchor="middle">{tk}</text>; })}
          <line x1={cx} y1={cy} x2={cx + (R - 10) * Math.cos(ang(q))} y2={cy - (R - 10) * Math.sin(ang(q))} stroke={COL.red} strokeWidth={9} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 8px rgba(255,60,40,.8))" }} />
          <circle cx={cx} cy={cy} r={20} fill="#1b1f26" stroke="#fff" strokeWidth={4} />
        </svg>
        <div style={{ textAlign: "center", fontFamily: FONT, marginTop: -6 }}>
          <div style={{ fontWeight: 900, fontSize: 54, color: COL.ink, textShadow: extrude(4, "#000") }}>{read ? read(v) : fmt(v)}</div>
          <div style={{ fontWeight: 800, fontSize: 24, color: COL.amber, letterSpacing: 5 }}>{label}</div>
        </div>
      </div>
    </div>
  );
};

// ---- fichas de condición que caen una por una (calor, tráfico…)
export const DropChips: React.FC<{ t: number; items: { at: number; txt: string; col?: string }[]; out: number; x: number; y: number }> = ({ t, items, out, x, y }) => (
  <div style={{ position: "absolute", left: x, top: y, display: "flex", flexDirection: "column", gap: 18 }}>
    {items.map((it, i) => {
      const o = op(t, it.at, out + i * 0.06), k = pop(t, it.at);
      return o > 0.01 ? <div key={i} style={{ opacity: o, transform: `translateY(${(1 - Math.min(1, k)) * -160}px) rotate(${(i % 2 ? 2 : -2) * (1 - Math.min(1, k)) * 6 + (i % 2 ? 1.5 : -1.5)}deg)`, ...glass, padding: "16px 34px", borderLeft: `10px solid ${it.col ?? COL.amber}`, fontFamily: FONT, fontWeight: 900, fontSize: 58, color: COL.ink, letterSpacing: 4, whiteSpace: "nowrap" }}>{it.txt}</div> : null;
    })}
  </div>
);

// ---- regla de kilómetros: el marcador baja de 15,000 a 7,500 ("a la mitad")
export const KmRuler: React.FC<{ t: number; a: number; half: number; out: number; x: number; y: number; from?: number; to?: number }> = ({ t, a, half, out, x, y, from = 15000, to = 7500 }) => {
  const o = op(t, a, out);
  if (o <= 0.01) return null;
  const W = 1000, v = from + (to - from) * ei(t, half, half + 0.9), px = (v / 16000) * W;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `perspective(1200px) rotateX(${(1 - e(t, a, a + 0.4)) * 70 + 14}deg)` }}>
      <div style={{ position: "relative", width: W, height: 150, background: "linear-gradient(180deg,#ffd24a,#e9a908)", borderRadius: 10, boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>
        {Array.from({ length: 33 }, (_, i) => <div key={i} style={{ position: "absolute", left: (i / 32) * W, top: 0, width: 3, height: i % 4 ? 26 : 50, background: "#2a2008" }} />)}
        {[0, 4000, 8000, 12000, 16000].map((n) => <div key={n} style={{ position: "absolute", left: (n / 16000) * W, top: 56, transform: "translateX(-50%)", fontFamily: FONT, fontWeight: 800, fontSize: 24, color: "#2a2008" }}>{n / 1000}K</div>)}
        <div style={{ position: "absolute", left: px, top: -70, transform: "translateX(-50%)", textAlign: "center" }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 56, color: t > half + 0.5 ? COL.ink : COL.red, textShadow: extrude(5, "#000"), whiteSpace: "nowrap" }}>{fmt(v)} KM</div>
          <div style={{ width: 8, height: 170, margin: "0 auto", background: t > half + 0.5 ? "#2ee86a" : COL.red, borderRadius: 4, boxShadow: "0 0 18px rgba(0,0,0,.5)" }} />
        </div>
        <div style={{ position: "absolute", right: 20, bottom: 12, fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "#2a2008", opacity: e(t, half + 0.6, half + 0.9) }}>A LA MITAD</div>
      </div>
    </div>
  );
};

// ---- placa de latón grabada (regla de taller)
export const Brass: React.FC<{ t: number; a: number; out: number; title: string; rows: { at: number; txt: string }[]; x: number; y: number }> = ({ t, a, out, title, rows, x, y }) => {
  const o = op(t, a, out);
  if (o <= 0.01) return null;
  const k = pop(t, a, 0.7), sh = ((t - a) * 0.35) % 1.6;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1300 }}>
      <div style={{ position: "relative", overflow: "hidden", transform: `rotateY(${(1 - Math.min(1, k)) * 80 - 12}deg)`, padding: "28px 44px", borderRadius: 14, background: "linear-gradient(135deg,#f5d98a,#b8862b 40%,#e7c46c 60%,#8a5f17)", boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 0 0 6px rgba(90,60,10,.45)" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, letterSpacing: 8, color: "#4a320a", textShadow: "0 1px 0 rgba(255,240,200,.7)" }}>{title}</div>
        {rows.map((r, i) => <div key={i} style={{ fontFamily: FONT, fontWeight: 900, fontSize: 60, color: "#3a2706", textShadow: "0 2px 0 rgba(255,240,200,.6), 0 -1px 0 rgba(0,0,0,.4)", opacity: e(t, r.at, r.at + 0.2), whiteSpace: "nowrap" }}>{r.txt}</div>)}
        <div style={{ position: "absolute", top: 0, bottom: 0, left: `${sh * 100 - 30}%`, width: "20%", background: "linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent)", transform: "skewX(-20deg)" }} />
      </div>
    </div>
  );
};

// ---- duelo de precios: dos barras que crecen con contador (barato vs caro)
export const PriceDuel: React.FC<{ t: number; a: number; b: number; out: number; x: number; y: number; l: { txt: string; v: number; lab: string }; r: { txt: string; v: number; lab: string } }> = ({ t, a, b, out, x, y, l, r }) => {
  const o = op(t, a, out);
  if (o <= 0.01) return null;
  const max = Math.max(l.v, r.v), H = 420;
  const bar = (it: { txt: string; v: number; lab: string }, at0: number, col: string) => {
    const k = Math.min(1.03, spr(t, at0, 0.6)), h = Math.max(8, (it.v / max) * H * k);
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 300, opacity: e(t, at0 - 0.1, at0 + 0.1) }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: col, textShadow: extrude(5, "#000"), whiteSpace: "nowrap" }}>{it.txt}</div>
        <div style={{ width: 180, height: h, marginTop: 10, borderRadius: "12px 12px 0 0", background: `linear-gradient(90deg, ${col}, ${col}aa)`, boxShadow: `0 0 30px ${col}66, inset -12px 0 0 rgba(0,0,0,.2)` }} />
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: COL.ink, letterSpacing: 4, marginTop: 14 }}>{it.lab}</div>
      </div>
    );
  };
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, display: "flex", alignItems: "flex-end", gap: 40, ...glass, padding: "30px 46px", transform: `translate(-50%,-100%) perspective(1200px) rotateY(-8deg)` }}>
      {bar(l, a, "#2ee86a")}
      {bar(r, b, COL.red)}
    </div>
  );
};

// ---- lo que esperaba vs lo que encontré (pantalla partida con cortina)
export const Expect: React.FC<{ t: number; a: number; out: number; x: number; y: number }> = ({ t, a, out, x, y }) => {
  const o = op(t, a, out);
  if (o <= 0.01) return null;
  const k = pop(t, a, 0.8);
  const items = ["LODO", "BARNIZ CAFÉ", "LEVAS RAYADAS"];
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1300, transform: "translate(-50%,-50%)" }}>
      <div style={{ transform: `rotateY(${(1 - Math.min(1, k)) * -70 + 8}deg)`, width: 760, padding: "30px 40px", borderRadius: 20, background: "repeating-linear-gradient(135deg,#3b2a14 0 22px,#2c1f0e 22px 44px)", boxShadow: "0 40px 90px rgba(0,0,0,.65), inset 0 0 0 4px #6b4b20" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "#e9c88a", letterSpacing: 8 }}>LO QUE YO ESPERABA</div>
        {items.map((it, i) => <div key={i} style={{ fontFamily: FONT, fontWeight: 900, fontSize: 72, color: "#f4e4c4", opacity: e(t, a + 0.5 + i * 0.9, a + 0.7 + i * 0.9), textShadow: extrude(5, "#120b03") }}>· {it}</div>)}
      </div>
    </div>
  );
};

// ---- lista con palomitas que se DIBUJAN
export const CheckList: React.FC<{ t: number; items: { at: number; txt: string; bad?: boolean }[]; out: number; x: number; y: number; title?: string; size?: number }> = ({ t, items, out, x, y, title, size = 54 }) => {
  const a = items[0].at, o = op(t, a, out);
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, ...glass, padding: "24px 38px", transform: `perspective(1200px) rotateY(${(1 - e(t, a - 0.2, a + 0.3)) * 60 - 10}deg)` }}>
      {title && <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, color: COL.amber, letterSpacing: 6, marginBottom: 8 }}>{title}</div>}
      {items.map((it, i) => {
        const d = e(t, it.at, it.at + 0.3), c = it.bad ? COL.red : "#2ee86a";
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, opacity: e(t, it.at - 0.1, it.at + 0.1), lineHeight: 1.35 }}>
            <svg width={size} height={size} viewBox="0 0 50 50"><rect x={3} y={3} width={44} height={44} rx={10} fill="none" stroke={c} strokeWidth={4} />
              {it.bad ? <path d="M14 14 L36 36 M36 14 L14 36" stroke={c} strokeWidth={7} strokeLinecap="round" strokeDasharray={70} strokeDashoffset={70 * (1 - d)} />
                : <path d="M12 26 L22 36 L39 14" stroke={c} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={45} strokeDashoffset={45 * (1 - d)} />}</svg>
            <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: size, color: COL.ink, letterSpacing: 2, textShadow: extrude(4, "#000"), whiteSpace: "nowrap" }}>{it.txt}</span>
          </div>
        );
      })}
    </div>
  );
};

// ---- visor de boroscopio: la foto dentro de un lente redondo con HUD (REC, profundidad, anillo de LEDs)
export const Borescope: React.FC<{ t: number; a: number; img: string; label: string; depth?: number }> = ({ t, a, img, label, depth = 92 }) => {
  const k = ei(t, a, a + 0.6), R = 470 * (0.4 + 0.6 * k);
  return (
    <AbsoluteFill style={{ background: "#020304" }}>
      <AbsoluteFill style={{ clipPath: `circle(${R}px at 960px 540px)`, transform: `scale(${1.08 + 0.05 * Math.sin((t - a) * 0.4)}) rotate(${(t - a) * 1.5}deg)` }}>
        <Img src={staticFile(P + "img_" + img + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <circle cx={960} cy={540} r={R} fill="none" stroke="#c9d6e2" strokeWidth={10} />
        {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={960 + (R + 22) * Math.cos(i * 1.047)} cy={540 + (R + 22) * Math.sin(i * 1.047)} r={10} fill="#f6fbff" style={{ filter: "drop-shadow(0 0 10px #bfe4ff)" }} />)}
        <line x1={930} y1={540} x2={990} y2={540} stroke="#8fd6ff" strokeWidth={3} /><line x1={960} y1={510} x2={960} y2={570} stroke="#8fd6ff" strokeWidth={3} />
      </svg>
      <div style={{ position: "absolute", left: 110, top: 90, fontFamily: "'Courier New',monospace", fontWeight: 700, fontSize: 36, color: "#8fd6ff" }}>
        <span style={{ color: COL.red, opacity: Math.sin(t * 6) > 0 ? 1 : 0.2 }}>● </span>REC  CIL 2
        <div>PROF. {Math.round(depth * k)} MM</div>
      </div>
      <div style={{ position: "absolute", right: 120, bottom: 110, fontFamily: FONT, fontWeight: 900, fontSize: 58, color: COL.ink, letterSpacing: 4, textShadow: extrude(5, "#000"), opacity: e(t, a + 0.8, a + 1.1) }}>{label}</div>
    </AbsoluteFill>
  );
};

// ---- 4 manómetros de compresión que marcan uno por uno
export const PressureRow: React.FC<{ t: number; vals: { at: number; v: number }[]; out: number; x: number; y: number }> = ({ t, vals, out, x, y }) => (
  <div style={{ position: "absolute", left: x, top: y, display: "flex", gap: 22, transform: "translate(-50%,0)" }}>
    {vals.map((g, i) => {
      const o = op(t, g.at - 0.1, out), k = Math.min(1.03, spr(t, g.at, 0.6)), v = g.v * k, ang = -120 + (v / 250) * 240;
      return o > 0.01 ? (
        <div key={i} style={{ opacity: o, width: 200, height: 230, ...glass, borderRadius: 110, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 16, transform: `translateY(${(1 - e(t, g.at - 0.2, g.at + 0.1)) * 80}px)` }}>
          <svg width={170} height={140} viewBox="-85 -85 170 140">
            <circle r={78} fill="#f2f0ea" stroke="#30353c" strokeWidth={6} />
            {Array.from({ length: 11 }, (_, j) => { const g2 = ((-120 + j * 24 - 90) * Math.PI) / 180; return <line key={j} x1={66 * Math.cos(g2)} y1={66 * Math.sin(g2)} x2={56 * Math.cos(g2)} y2={56 * Math.sin(g2)} stroke="#222" strokeWidth={j % 5 ? 2 : 4} />; })}
            <line x1={0} y1={0} x2={60 * Math.cos(((ang - 90) * Math.PI) / 180)} y2={60 * Math.sin(((ang - 90) * Math.PI) / 180)} stroke={COL.red} strokeWidth={5} strokeLinecap="round" />
            <circle r={8} fill="#222" />
          </svg>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 46, color: COL.ink, marginTop: -8 }}>{Math.round(v)}</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 18, color: COL.dim, letterSpacing: 3 }}>CIL {i + 1} · PSI</div>
        </div>
      ) : null;
    })}
  </div>
);

// ---- roseta de certificado (sello de calidad con listones)
export const Rosette: React.FC<{ t: number; a: number; out: number; x: number; y: number; l1: string; l2: string }> = ({ t, a, out, x, y, l1, l2 }) => {
  const o = op(t, a, out);
  if (o <= 0.01) return null;
  const k = pop(t, a, 0.8), rot = (1 - Math.min(1, k)) * -200 + Math.sin((t - a) * 1.2) * 3;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.4 + 0.6 * Math.min(1.05, k)})` }}>
      <svg width={380} height={470} viewBox="-190 -190 380 470">
        <path d="M-70 120 L-110 270 L-60 240 L-30 285 L0 140 Z" fill="#b3261e" /><path d="M70 120 L110 270 L60 240 L30 285 L0 140 Z" fill="#8e1d17" />
        <g transform={`rotate(${rot})`}>{Array.from({ length: 24 }, (_, i) => <path key={i} d="M0 -170 L18 -140 L-18 -140 Z" fill="#e2b247" transform={`rotate(${i * 15})`} />)}</g>
        <circle r={145} fill="url(#gold)" /><defs><radialGradient id="gold" cx="35%" cy="30%"><stop offset="0" stopColor="#fff1c0" /><stop offset=".6" stopColor="#d9a73a" /><stop offset="1" stopColor="#8f6514" /></radialGradient></defs>
        <circle r={120} fill="none" stroke="#7a560f" strokeWidth={4} strokeDasharray="6 8" />
        <text y={-12} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill="#4a320a">{l1}</text>
        <text y={42} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill="#4a320a">{l2}</text>
      </svg>
    </div>
  );
};

// ---- dos tarjetas enfrentadas con íconos dibujados (cadena vs banda, sano vs quemado…)
export const VersusCards: React.FC<{ t: number; a: number; b: number; out: number; y?: number; L: { icon: "chain" | "belt" | "red" | "brown"; t1: string; t2: string; ok: boolean }; R: { icon: "chain" | "belt" | "red" | "brown"; t1: string; t2: string; ok: boolean } }> = ({ t, a, b, out, y = 540, L, R }) => {
  const icon = (k: string) => k === "chain"
    ? <svg width={220} height={120}>{Array.from({ length: 9 }, (_, i) => <rect key={i} x={10 + i * 23} y={i % 2 ? 44 : 36} width={30} height={i % 2 ? 32 : 48} rx={10} fill="none" stroke="#cfd5db" strokeWidth={7} />)}</svg>
    : k === "belt" ? <svg width={220} height={120}><rect x={10} y={40} width={200} height={40} rx={8} fill="#1a1a1a" stroke="#555" strokeWidth={3} />{Array.from({ length: 16 }, (_, i) => <rect key={i} x={16 + i * 12} y={70} width={6} height={12} fill="#333" />)}<path d="M120 40 L112 60 L124 64 L116 80" stroke={COL.red} strokeWidth={4} fill="none" /></svg>
    : <svg width={220} height={140}><path d="M80 10 L140 10 L140 30 L150 40 L150 130 L70 130 L70 40 L80 30 Z" fill="none" stroke="#dfe6ee" strokeWidth={5} /><rect x={74} y={60} width={72} height={66} fill={k === "red" ? "#c0392b" : "#3a2412"} /></svg>;
  const card = (it: typeof L, at0: number, side: number) => {
    const k = pop(t, at0, 0.8), o = op(t, at0, out);
    return o > 0.01 ? (
      <div style={{ opacity: o, transform: `perspective(1200px) rotateY(${side * (-14 + (1 - Math.min(1, k)) * -60)}deg) translateY(${(1 - Math.min(1, k)) * 60}px)`, width: 520, ...glass, padding: "28px 30px", textAlign: "center", boxShadow: `0 36px 80px rgba(0,0,0,.65), 0 0 0 3px ${it.ok ? "#2ee86a" : COL.red}` }}>
        {icon(it.icon)}
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 62, color: it.ok ? "#2ee86a" : COL.red, textShadow: extrude(4, "#000") }}>{it.t1}</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: COL.ink, letterSpacing: 3 }}>{it.t2}</div>
      </div>
    ) : <div style={{ width: 520 }} />;
  };
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, transform: "translateY(-50%)", display: "flex", justifyContent: "center", gap: 90 }}>{card(L, a, 1)}{card(R, b, -1)}</div>;
};

// ---- barra de zonas con marcador (estiramiento de la cadena, nivel del depósito…)
export const ZoneBar: React.FC<{ t: number; a: number; out: number; x: number; y: number; to: number; title: string; read: string; left?: string; right?: string }> = ({ t, a, out, x, y, to, title, read, left = "NUEVA", right = "LÍMITE" }) => {
  const o = op(t, a, out);
  if (o <= 0.01) return null;
  const v = to * Math.min(1.02, spr(t, a + 0.2, 0.5)), W = 900;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, ...glass, padding: "26px 40px 30px", transform: `translate(-50%,0) perspective(1200px) rotateX(${(1 - e(t, a, a + 0.4)) * 50 + 8}deg)` }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color: COL.amber, letterSpacing: 6 }}>{title}</div>
      <div style={{ position: "relative", width: W, height: 60, marginTop: 26, borderRadius: 30, background: "linear-gradient(90deg,#2ee86a 0%,#2ee86a 60%,#ffcf3a 80%,#ff4a3d 100%)", boxShadow: "inset 0 4px 10px rgba(0,0,0,.4)" }}>
        <div style={{ position: "absolute", left: v * W, top: -24, width: 10, height: 108, marginLeft: -5, borderRadius: 5, background: "#fff", boxShadow: "0 0 18px #fff" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT, fontWeight: 800, fontSize: 24, color: COL.dim, letterSpacing: 4, marginTop: 12 }}><span>{left}</span><span>{right}</span></div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 56, color: COL.ink, textAlign: "center", marginTop: 8, opacity: e(t, a + 1, a + 1.3), textShadow: extrude(4, "#000") }}>{read}</div>
    </div>
  );
};

// ---- onda de sonido con picos (el cascabeleo) + onomatopeya
export const SoundWave: React.FC<{ t: number; a: number; out: number; y: number; word: string; burst?: number }> = ({ t, a, out, y, word, burst = 2 }) => {
  const o = op(t, a, out);
  if (o <= 0.01) return null;
  const W = 1500, N = 150, rev = e(t, a, a + 0.8);
  const pts = Array.from({ length: N }, (_, i) => {
    const u = i / N, hot = u < 0.32 ? 1 : 0.18;
    const amp = (Math.sin(i * 1.7 + t * 30) * 0.5 + Math.sin(i * 0.37) * 0.5) * 120 * hot * (u <= rev ? 1 : 0) * (burst > 1 && i % 6 === 0 ? 1.5 : 1);
    return `${(u * W).toFixed(1)},${(150 + amp).toFixed(1)}`;
  }).join(" ");
  return (
    <div style={{ position: "absolute", left: 210, top: y, opacity: o }}>
      <svg width={W} height={300}><polyline points={pts} fill="none" stroke={COL.amber} strokeWidth={5} style={{ filter: "drop-shadow(0 0 10px rgba(255,178,87,.8))" }} />
        <rect x={0} y={20} width={W * 0.32} height={260} fill="rgba(255,74,61,.12)" stroke={COL.red} strokeDasharray="10 8" strokeWidth={3} />
        <text x={14} y={14} fill={COL.red} fontFamily={FONT} fontWeight={900} fontSize={30}>LOS PRIMEROS 2 SEGUNDOS</text></svg>
      <div style={{ position: "absolute", left: 120, top: -40, fontFamily: FONT, fontWeight: 900, fontSize: 120, color: COL.ink, letterSpacing: 10, transform: `rotate(-5deg) translate(${Math.sin(t * 50) * 4}px, ${Math.cos(t * 43) * 3}px) scale(${pop(t, a + 0.3)})`, textShadow: extrude(8, "#5a3a10") }}>{word}</div>
    </div>
  );
};

// ---- etiqueta de precio colgando de un hilo (se balancea)
export const HangTag: React.FC<{ t: number; a: number; out: number; x: number; y: number; price: string; sub?: string }> = ({ t, a, out, x, y, price, sub }) => {
  const o = op(t, a, out);
  if (o <= 0.01) return null;
  const sw = Math.sin((t - a) * 3.4) * 14 * Math.exp(-(t - a) * 0.8), drop = (1 - Math.min(1, spr(t, a, 0.7))) * -400;
  return (
    <div style={{ position: "absolute", left: x, top: y + drop, opacity: o, transform: `rotate(${sw}deg)`, transformOrigin: "50% 0" }}>
      <div style={{ width: 4, height: 150, margin: "0 auto", background: "#d8d2c4" }} />
      <div style={{ position: "relative", padding: "24px 40px 24px 70px", background: "linear-gradient(180deg,#fff6dc,#f0dfb0)", clipPath: "polygon(40px 0,100% 0,100% 100%,40px 100%,0 50%)", boxShadow: "0 20px 40px rgba(0,0,0,.5)", fontFamily: FONT }}>
        <div style={{ position: "absolute", left: 22, top: "50%", width: 18, height: 18, marginTop: -9, borderRadius: 9, background: "#7d6a3f" }} />
        <div style={{ fontWeight: 900, fontSize: 70, color: "#3b2a08", whiteSpace: "nowrap" }}>{price}</div>
        {sub && <div style={{ fontWeight: 800, fontSize: 26, color: "#6d5520", letterSpacing: 4 }}>{sub}</div>}
      </div>
    </div>
  );
};

// ---- lupa que agranda un pedazo de la foto de abajo
export const Loupe: React.FC<{ t: number; a: number; out: number; img: string; x: number; y: number; zoom?: number; label: string }> = ({ t, a, out, img, x, y, zoom = 2.4, label }) => {
  const o = op(t, a, out);
  if (o <= 0.01) return null;
  const k = pop(t, a, 0.8), R = 230 * Math.min(1, k);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <div style={{ position: "absolute", left: x - R, top: y - R, width: 2 * R, height: 2 * R, borderRadius: "50%", overflow: "hidden", boxShadow: "0 0 0 16px #1b1d20, 0 0 0 20px #4a4e54, 0 30px 70px rgba(0,0,0,.7)" }}>
        <Img src={staticFile(P + "img_" + img + ".jpg")} style={{ position: "absolute", width: 1920 * zoom, height: 1080 * zoom, left: -x * zoom + R, top: -y * zoom + R, objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,.28), transparent 40%)" }} />
      </div>
      <div style={{ position: "absolute", left: x + R * 0.62, top: y + R * 0.62, width: 50, height: 230, borderRadius: 20, background: "linear-gradient(90deg,#2a2c30,#55595f,#2a2c30)", transform: "rotate(-45deg)", transformOrigin: "50% 0" }} />
      <div style={{ position: "absolute", left: x - 300, top: y + R + 40, width: 600, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 62, color: COL.ink, textShadow: extrude(5, "#000"), opacity: e(t, a + 0.4, a + 0.7) }}>{label}</div>
    </div>
  );
};

// ---- mosaico de orígenes (sin marcas): se van encendiendo y al final "TODOS"
export const Origins: React.FC<{ t: number; items: { at: number; txt: string }[]; all: number; out: number; y: number }> = ({ t, items, all, out, y }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
    <div style={{ display: "flex", gap: 22 }}>
      {items.map((it, i) => { const o = op(t, it.at, out), k = pop(t, it.at); return <div key={i} style={{ opacity: o, transform: `perspective(900px) rotateX(${(1 - Math.min(1, k)) * 90}deg)`, ...glass, padding: "22px 30px", fontFamily: FONT, fontWeight: 900, fontSize: 48, color: COL.ink, letterSpacing: 3, boxShadow: `0 30px 60px rgba(0,0,0,.6), 0 0 0 3px ${COL.amber}${t > all ? "ff" : "44"}` }}>{it.txt}</div>; })}
    </div>
    <div style={{ opacity: op(t, all, out), transform: `scale(${pop(t, all)})`, fontFamily: FONT, fontWeight: 900, fontSize: 130, color: COL.amber, letterSpacing: 14, textShadow: extrude(10, "#5a3a10") }}>A TODOS</div>
  </div>
);

// ---- osciloscopio de encendido: 4 trazos, el cilindro 3 falla (falta el pico) + foquito
export const Misfire: React.FC<{ t: number; a: number; out: number; x: number; y: number }> = ({ t, a, out, x, y }) => {
  const o = op(t, a, out);
  if (o <= 0.01) return null;
  const W = 1100, sc = (t - a) * 260;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, ...glass, padding: 24, background: "#04140c", boxShadow: "0 40px 90px rgba(0,0,0,.7), inset 0 0 0 3px #1e5a3a", transform: `translate(-50%,-50%) perspective(1300px) rotateY(-10deg) rotateX(${(1 - e(t, a, a + 0.4)) * 40}deg)` }}>
      <svg width={W} height={460}>
        {Array.from({ length: 12 }, (_, i) => <line key={i} x1={i * 100} y1={0} x2={i * 100} y2={460} stroke="#0f3a24" />)}
        {[0, 1, 2, 3].map((c) => {
          const y0 = 60 + c * 110, pts: string[] = [];
          for (let px = 0; px <= W; px += 6) { const ph = (px + sc + c * 70) % 280; const miss = c === 2 && Math.floor((px + sc + c * 70) / 280) % 2 === 1; const v = ph < 14 && !miss ? -70 : ph < 26 && !miss ? 22 : 0; pts.push(`${px},${y0 + v}`); }
          return <g key={c}><polyline points={pts.join(" ")} fill="none" stroke={c === 2 ? COL.red : "#39ff8f"} strokeWidth={3} /><text x={8} y={y0 - 30} fill={c === 2 ? COL.red : "#39ff8f"} fontFamily="'Courier New',monospace" fontWeight={700} fontSize={22}>CIL {c + 1}{c === 2 ? "  FALLA" : ""}</text></g>;
        })}
      </svg>
    </div>
  );
};

// ---- receta del doctor (se escribe a mano)
export const Rx: React.FC<{ t: number; items: { at: number; txt: string }[]; out: number; x: number; y: number }> = ({ t, items, out, x, y }) => {
  const a = items[0].at, o = op(t, a - 0.2, out);
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1200 }}>
      <div style={{ transform: `rotateZ(3deg) rotateY(${(1 - e(t, a - 0.3, a + 0.2)) * -70 - 8}deg)`, width: 600, padding: "30px 40px", background: "linear-gradient(180deg,#fbfbf7,#ecebe4)", borderTop: "18px solid #2b6cb0", boxShadow: "0 40px 80px rgba(0,0,0,.6)" }}>
        <div style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 70, color: "#2b6cb0" }}>℞</div>
        {items.map((it, i) => { const n = Math.round(it.txt.length * e(t, it.at, it.at + 0.6)); return <div key={i} style={{ fontFamily: "'Segoe Script','Brush Script MT',cursive", fontSize: 50, color: "#1d2a44", lineHeight: 1.5, borderBottom: "2px solid #c9d3e3", minHeight: 75 }}>{it.txt.slice(0, n)}</div>; })}
      </div>
    </div>
  );
};

// ---- contador grande que rueda (40 y tantos conectores, 11 días…)
export const Count: React.FC<{ t: number; a: number; out: number; to: number; x: number; y: number; label: string; suffix?: string; col?: string; dur?: number }> = ({ t, a, out, to, x, y, label, suffix = "", col = COL.ink, dur = 1.2 }) => {
  const o = op(t, a, out);
  if (o <= 0.01) return null;
  const v = to * ei(t, a, a + dur);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${pop(t, a, 0.8)})`, textAlign: "center", fontFamily: FONT }}>
      <div style={{ fontWeight: 900, fontSize: 210, color: col, lineHeight: 1, textShadow: extrude(14, "#3a2a14") }}>{Math.round(v)}{suffix}</div>
      <div style={{ fontWeight: 900, fontSize: 44, color: COL.amber, letterSpacing: 8, textShadow: extrude(4, "#000") }}>{label}</div>
    </div>
  );
};

// ---- moneda que gira y cae (diez pesos)
export const Coin: React.FC<{ t: number; a: number; out: number; x: number; y: number; txt: string; label: string }> = ({ t, a, out, x, y, txt, label }) => {
  const o = op(t, a, out);
  if (o <= 0.01) return null;
  const fall = ei(t, a, a + 0.7), ry = (t - a) * 540 * (1 - e(t, a + 0.6, a + 1.4));
  return (
    <div style={{ position: "absolute", left: x, top: y - (1 - fall) * 500, opacity: o, perspective: 900, transform: "translate(-50%,-50%)", textAlign: "center" }}>
      <div style={{ width: 260, height: 260, borderRadius: "50%", margin: "0 auto", transform: `rotateY(${ry}deg)`, background: "radial-gradient(circle at 35% 30%,#fff7d6,#d6b25a 50%,#8d6d22)", boxShadow: "inset 0 0 0 16px #b48f38, inset 0 0 0 22px #e8cf84, 0 30px 60px rgba(0,0,0,.6)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 110, color: "#5f4510" }}>{txt}</div>
      <div style={{ marginTop: 24, fontFamily: FONT, fontWeight: 900, fontSize: 56, color: COL.ink, textShadow: extrude(5, "#000"), opacity: e(t, a + 0.7, a + 1) }}>{label}</div>
    </div>
  );
};

// ---- tres testigos del tablero que se prenden en cascada
export const DashTrio: React.FC<{ t: number; a: number; out: number; x: number; y: number }> = ({ t, a, out, x, y }) => {
  const o = op(t, a, out);
  if (o <= 0.01) return null;
  const cols = ["#ffb000", COL.red, "#ffb000"], labs = ["MOTOR", "BATERÍA", "ABS"];
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", gap: 40, padding: "36px 50px", borderRadius: 30, background: "radial-gradient(ellipse at 50% 0%,#1c2026,#06080b)", boxShadow: "0 40px 90px rgba(0,0,0,.7), inset 0 0 0 4px #2a2f36" }}>
      {labs.map((l, i) => {
        const on = t > a + i * 0.3 ? (Math.sin((t - a) * 9 + i) > -0.4 ? 1 : 0.4) : 0.06;
        return (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ width: 140, height: 140, borderRadius: 24, background: cols[i], opacity: on, boxShadow: on > 0.5 ? `0 0 50px ${cols[i]}` : "none", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 80, color: "#1b1205" }}>!</div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: COL.dim, letterSpacing: 4, marginTop: 12 }}>{l}</div>
          </div>
        );
      })}
    </div>
  );
};

// ---- comparación de grosor: un cabello vs la grieta (líneas a escala ampliada)
export const Hair: React.FC<{ t: number; a: number; out: number; x: number; y: number }> = ({ t, a, out, x, y }) => {
  const o = op(t, a, out);
  if (o <= 0.01) return null;
  const d = e(t, a, a + 0.9);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, ...glass, padding: "26px 40px", transform: "translate(-50%,0)" }}>
      <svg width={760} height={170}>
        <path d={`M 10 50 C 200 30, 400 70, ${10 + 740 * d} 48`} stroke="#3a2a1a" strokeWidth={5} fill="none" />
        <path d={`M 10 120 L 120 116 L 180 126 L 300 114 L 420 124 L 560 116 L ${10 + 740 * d} 122`} stroke={COL.red} strokeWidth={5} fill="none" strokeDasharray={900} strokeDashoffset={900 * (1 - d)} />
        <text x={10} y={26} fill={COL.dim} fontFamily={FONT} fontWeight={800} fontSize={24}>UN CABELLO</text>
        <text x={10} y={160} fill={COL.red} fontFamily={FONT} fontWeight={800} fontSize={24}>LA GRIETA</text>
      </svg>
    </div>
  );
};

// ---- depósito de anticongelante: el nivel baja poco a poco por debajo del MÍN
export const Tank: React.FC<{ t: number; a: number; out: number; x: number; y: number }> = ({ t, a, out, x, y }) => {
  const o = op(t, a, out);
  if (o <= 0.01) return null;
  const lvl = 0.72 - 0.5 * ei(t, a + 0.3, a + 3.5);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `perspective(1000px) rotateY(-16deg) scale(${pop(t, a, 0.8)})` }}>
      <div style={{ position: "relative", width: 260, height: 380, borderRadius: "40px 40px 30px 30px", background: "rgba(255,255,255,.14)", boxShadow: "inset 0 0 0 5px rgba(255,255,255,.7), 0 30px 60px rgba(0,0,0,.6)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${lvl * 100}%`, background: "linear-gradient(180deg,#ff8ac0,#e0408a)", boxShadow: "0 -4px 0 rgba(255,255,255,.5)" }} />
        {[["MÁX", 0.66], ["MÍN", 0.36]].map(([l, h]) => <div key={l as string} style={{ position: "absolute", left: 0, right: 0, bottom: `${(h as number) * 100}%`, borderTop: "4px dashed #fff", fontFamily: FONT, fontWeight: 900, fontSize: 26, color: "#fff", paddingLeft: 10 }}>{l}</div>)}
      </div>
      <div style={{ marginTop: 18, fontFamily: FONT, fontWeight: 900, fontSize: 44, color: lvl < 0.36 ? COL.red : COL.ink, textAlign: "center", textShadow: extrude(4, "#000") }}>POQUITO A POQUITO</div>
    </div>
  );
};

// ---- calendario: los días se van tachando hasta N
export const Calendar: React.FC<{ t: number; a: number; out: number; days: number; x: number; y: number; label: string }> = ({ t, a, out, days, x, y, label }) => {
  const o = op(t, a, out);
  if (o <= 0.01) return null;
  const n = Math.floor(days * ei(t, a + 0.2, a + 2.2) + 0.001);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `perspective(1200px) rotateY(14deg) rotateX(4deg) scale(${pop(t, a, 0.7)})`, width: 640, background: "#fbfaf6", borderRadius: 12, overflow: "hidden", boxShadow: "0 40px 90px rgba(0,0,0,.65)" }}>
      <div style={{ background: COL.red, padding: "14px 26px", fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "#fff", letterSpacing: 6 }}>{label}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, padding: 20 }}>
        {Array.from({ length: 21 }, (_, i) => (
          <div key={i} style={{ position: "relative", height: 66, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: "#333", display: "flex", alignItems: "center", justifyContent: "center", background: i < days ? "#f1ece0" : "transparent", borderRadius: 6 }}>
            {i + 1}
            {i < n && <svg width={60} height={60} style={{ position: "absolute" }}><path d="M8 8 L52 52 M52 8 L8 52" stroke={COL.red} strokeWidth={6} strokeLinecap="round" /></svg>}
          </div>
        ))}
      </div>
      <div style={{ padding: "0 26px 20px", fontFamily: FONT, fontWeight: 900, fontSize: 64, color: COL.red }}>{n} DÍAS</div>
    </div>
  );
};

// ---- balanza: dos platillos; el peso cae del lado de "mal cuidado"
export const Balance: React.FC<{ t: number; a: number; out: number; tip: number; items: { at: number; txt: string }[]; x: number; y: number }> = ({ t, a, out, tip, items, x, y }) => {
  const o = op(t, a, out);
  if (o <= 0.01) return null;
  const n = items.filter((it) => t >= it.at).length;
  const ang = Math.sin((t - a) * 2) * 2 * (1 - e(t, a, a + 2)) + 16 * Math.min(1.04, spr(t, tip, 0.5)) * (t > tip ? 1 : 0) + n * 1.5;
  const L = 330, rad = (ang * Math.PI) / 180;
  const pan = (side: number) => ({ x: side * L * Math.cos(rad), y: side * L * Math.sin(rad) });
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o }}>
      <div style={{ position: "absolute", left: -10, top: 0, width: 20, height: 380, background: "linear-gradient(90deg,#8a6a2c,#e2c070,#8a6a2c)" }} />
      <div style={{ position: "absolute", left: -110, top: 370, width: 220, height: 30, borderRadius: 8, background: "#7a5a22" }} />
      <div style={{ position: "absolute", left: -L, top: -6, width: 2 * L, height: 14, borderRadius: 7, background: "linear-gradient(180deg,#f1d68c,#9a7430)", transform: `rotate(${ang}deg)` }} />
      {[-1, 1].map((sd) => {
        const p = pan(sd);
        return (
          <div key={sd} style={{ position: "absolute", left: p.x - 150, top: p.y, width: 300 }}>
            <svg width={300} height={160} style={{ position: "absolute", top: 0 }}><path d="M150 0 L30 140 M150 0 L270 140" stroke="#c9a44e" strokeWidth={3} /></svg>
            <div style={{ position: "absolute", top: 140, width: 300, height: 26, borderRadius: "0 0 150px 150px", background: "linear-gradient(180deg,#e9c977,#9a7430)" }} />
            <div style={{ position: "absolute", top: 190, width: 300, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 46, color: sd > 0 ? COL.red : "#2ee86a", textShadow: extrude(4, "#000") }}>{sd < 0 ? "MAL HECHO" : "MAL CUIDADO"}</div>
            {sd > 0 && items.map((it, i) => t >= it.at ? <div key={i} style={{ position: "absolute", left: 20 + (i % 2) * 40, top: 96 - i * 44 - (1 - Math.min(1, spr(t, it.at, 0.8))) * 300, ...glass, borderRadius: 10, padding: "6px 16px", fontFamily: FONT, fontWeight: 900, fontSize: 28, color: COL.ink, whiteSpace: "nowrap" }}>{it.txt}</div> : null)}
          </div>
        );
      })}
    </div>
  );
};

// ---- pantallita LCD del escáner (escribe el código)
export const Lcd: React.FC<{ t: number; a: number; out: number; x: number; y: number; lines: string[] }> = ({ t, a, out, x, y, lines }) => {
  const o = op(t, a, out);
  if (o <= 0.01) return null;
  const all = lines.join("\n"), n = Math.round(all.length * e(t, a + 0.2, a + 2));
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `perspective(1100px) rotateY(-12deg) scale(${pop(t, a, 0.8)})`, padding: 22, borderRadius: 20, background: "#20242a", boxShadow: "0 40px 80px rgba(0,0,0,.65), inset 0 0 0 4px #3a4048" }}>
      <div style={{ width: 640, minHeight: 250, padding: "20px 26px", borderRadius: 8, background: "#9fc29a", boxShadow: "inset 0 6px 16px rgba(0,0,0,.35)", fontFamily: "'Courier New',monospace", fontWeight: 700, fontSize: 40, color: "#1c2a18", whiteSpace: "pre" }}>{all.slice(0, n)}<span style={{ opacity: Math.sin(t * 8) > 0 ? 1 : 0 }}>█</span></div>
    </div>
  );
};

// ---- llamada en curso (teléfono) con lo que hay que preguntar
export const Call: React.FC<{ t: number; a: number; out: number; x: number; y: number; who: string; rows: { at: number; txt: string }[] }> = ({ t, a, out, x, y, who, rows }) => {
  const o = op(t, a, out);
  if (o <= 0.01) return null;
  const sec = Math.max(0, Math.floor(t - a));
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `perspective(1200px) rotateY(-14deg) translateY(${(1 - Math.min(1, spr(t, a, 0.7))) * 300}px)`, width: 420, height: 760, borderRadius: 60, background: "linear-gradient(180deg,#1b2433,#0b0f17)", boxShadow: "0 40px 90px rgba(0,0,0,.7), inset 0 0 0 10px #2b3240", padding: "70px 34px", fontFamily: FONT, textAlign: "center" }}>
      <div style={{ fontWeight: 800, fontSize: 26, color: COL.dim, letterSpacing: 4 }}>LLAMANDO…</div>
      <div style={{ fontWeight: 900, fontSize: 44, color: COL.ink, marginTop: 10 }}>{who}</div>
      <div style={{ fontWeight: 700, fontSize: 30, color: "#2ee86a", marginTop: 6 }}>0:{String(sec).padStart(2, "0")}</div>
      <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 18 }}>
        {rows.map((r, i) => <div key={i} style={{ opacity: e(t, r.at, r.at + 0.2), transform: `scale(${t > r.at ? Math.min(1.05, spr(t, r.at)) : 0.6})`, padding: "16px 10px", borderRadius: 20, background: "rgba(255,255,255,.1)", fontWeight: 900, fontSize: 40, color: COL.ink }}>{r.txt}</div>)}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 60, display: "flex", justifyContent: "center" }}><div style={{ width: 110, height: 110, borderRadius: 55, background: COL.red, boxShadow: `0 0 0 ${10 + 10 * Math.abs(Math.sin(t * 3))}px rgba(255,74,61,.25)` }} /></div>
    </div>
  );
};

// ---- candado que se abre (el secreto número 5)
export const Padlock: React.FC<{ t: number; a: number; open: number; out: number; x: number; y: number; n: string }> = ({ t, a, open, out, x, y, n }) => {
  const o = op(t, a, out);
  if (o <= 0.01) return null;
  const up = ei(t, open, open + 0.35), sh = t < open ? Math.sin(t * 40) * 6 * e(t, open - 0.5, open) : 0;
  return (
    <div style={{ position: "absolute", left: x + sh, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${pop(t, a, 0.8)})` }}>
      <svg width={320} height={400} viewBox="0 0 320 400">
        <g transform={`translate(${up * 60} ${-up * 50}) rotate(${up * 25} 230 150)`}><path d="M80 170 L80 110 A80 80 0 0 1 240 110 L240 170" fill="none" stroke="#c9ced4" strokeWidth={30} /></g>
        <rect x={40} y={160} width={240} height={210} rx={30} fill="url(#lockg)" />
        <defs><linearGradient id="lockg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f5d78a" /><stop offset="1" stopColor="#9a7024" /></linearGradient></defs>
        <text x={160} y={310} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={130} fill="#4a320a">{n}</text>
      </svg>
    </div>
  );
};

// ---- orden de reparación: renglones con palomita verde y sello PAGADO / ENTREGADO
export const RepairOrder: React.FC<{ t: number; rows: { at: number; txt: string }[]; done: number; out: number; x: number; y: number }> = ({ t, rows, done, out, x, y }) => {
  const a = rows[0].at, o = op(t, a - 0.2, out);
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1300 }}>
      <div style={{ position: "relative", transform: `rotateY(${(1 - e(t, a - 0.3, a + 0.2)) * 70 + 12}deg) rotateZ(-1.5deg)`, width: 560, padding: "26px 36px", background: "linear-gradient(180deg,#fdfcf7,#efede4)", boxShadow: "0 40px 90px rgba(0,0,0,.65)", fontFamily: FONT }}>
        <div style={{ fontWeight: 900, fontSize: 34, letterSpacing: 6, color: "#1d2a44", borderBottom: "3px solid #1d2a44", paddingBottom: 8, marginBottom: 10 }}>ORDEN DE SERVICIO</div>
        {rows.map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, fontWeight: 800, fontSize: 40, color: "#222", lineHeight: "62px", opacity: e(t, r.at - 0.1, r.at + 0.1) }}>
            <svg width={40} height={40}><path d="M6 22 L16 32 L34 8" stroke="#1e9e4f" strokeWidth={6} fill="none" strokeLinecap="round" strokeDasharray={45} strokeDashoffset={45 * (1 - e(t, r.at, r.at + 0.3))} /></svg>{r.txt}
          </div>
        ))}
        {t > done && <div style={{ position: "absolute", right: 20, bottom: 30, transform: `rotate(-14deg) scale(${2 - Math.min(1, ei(t, done, done + 0.15))})`, border: "7px solid #1e9e4f", color: "#1e9e4f", fontWeight: 900, fontSize: 52, padding: "4px 18px", borderRadius: 10, opacity: 0.9 }}>ENTREGADO</div>}
      </div>
    </div>
  );
};

// ---- botón de suscribirse + campanita (sin links: sólo la acción)
export const SubBell: React.FC<{ t: number; a: number; bell: number; out: number; x: number; y: number }> = ({ t, a, bell, out, x, y }) => {
  const o = op(t, a, out);
  if (o <= 0.01) return null;
  const pressed = e(t, a + 0.5, a + 0.62) * (1 - e(t, a + 0.62, a + 0.8)), subbed = t > a + 0.62;
  const ring = t > bell ? Math.sin((t - bell) * 22) * 22 * Math.exp(-(t - bell) * 1.6) : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${pop(t, a, 0.8)})`, display: "flex", alignItems: "center", gap: 30 }}>
      <div style={{ transform: `scale(${1 - pressed * 0.08})`, padding: "26px 60px", borderRadius: 18, background: subbed ? "#2c2f35" : "#e62117", boxShadow: "0 26px 60px rgba(0,0,0,.6)", fontFamily: FONT, fontWeight: 900, fontSize: 60, color: "#fff", letterSpacing: 3 }}>{subbed ? "SUSCRITO ✓" : "SUSCRÍBASE"}</div>
      <div style={{ opacity: e(t, bell - 0.2, bell), transform: `rotate(${ring}deg)`, transformOrigin: "50% 10%" }}>
        <svg width={150} height={150} viewBox="0 0 100 100"><path d="M50 12 C 30 12, 24 30, 24 46 L 24 62 L 14 74 L 86 74 L 76 62 L 76 46 C 76 30, 70 12, 50 12 Z" fill="#ffd34a" stroke="#a87a06" strokeWidth={3} /><circle cx={50} cy={82} r={8} fill="#ffd34a" stroke="#a87a06" strokeWidth={3} />
          {t > bell && [0, 1].map((i) => <path key={i} d={i ? "M88 30 Q 96 46 88 62" : "M12 30 Q 4 46 12 62"} stroke="#ffd34a" strokeWidth={4} fill="none" opacity={Math.abs(Math.sin((t - bell) * 8))} />)}</svg>
      </div>
    </div>
  );
};

// ---- la pregunta para comentar: tarjeta grande con cursor de comentario
export const Question: React.FC<{ t: number; a: number; out: number; text: string; x?: number; y?: number; size?: number }> = ({ t, a, out, text, x = 960, y = 540, size = 92 }) => {
  const o = op(t, a, out);
  if (o <= 0.01) return null;
  const k = pop(t, a, 0.7), n = Math.round(text.length * e(t, a + 0.15, a + 1.1));
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1300px) rotateX(${(1 - Math.min(1, k)) * 60}deg) scale(${0.7 + 0.3 * Math.min(1.04, k)})` }}>
      <div style={{ background: "#fffdf6", borderRadius: 30, padding: "34px 54px 40px", boxShadow: "0 50px 100px rgba(0,0,0,.65), 0 0 0 6px " + COL.amber, maxWidth: 1400 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: "#7a7468", letterSpacing: 4 }}>
          <div style={{ width: 54, height: 54, borderRadius: 27, background: COL.amber }} />CUÉNTEME EN LOS COMENTARIOS
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: size, color: "#141414", marginTop: 14, lineHeight: 1.1 }}>{text.slice(0, n)}<span style={{ opacity: Math.sin(t * 7) > 0 ? 1 : 0, color: COL.amber }}>|</span></div>
      </div>
    </div>
  );
};

// ---- próximo video: tarjeta tipo "carpeta" que se abre con el tema
export const NextUp: React.FC<{ t: number; a: number; out: number; title: string; sub: string; x?: number; y?: number }> = ({ t, a, out, title, sub, x = 1340, y = 300 }) => {
  const o = op(t, a, out);
  if (o <= 0.01) return null;
  const k = pop(t, a, 0.7);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1300, transform: "translate(-50%,0)" }}>
      <div style={{ transform: `rotateY(${(1 - Math.min(1, k)) * -80 - 10}deg)`, width: 760, ...glass, padding: "30px 40px", borderTop: `10px solid ${COL.amber}` }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 8, color: COL.amber }}>EN EL PRÓXIMO VIDEO</div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 70, color: COL.ink, lineHeight: 1.05, marginTop: 10, textShadow: extrude(5, "#000") }}>{title}</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: COL.dim, marginTop: 14, opacity: e(t, a + 1.2, a + 1.6) }}>{sub}</div>
      </div>
    </div>
  );
};

// ---- firma: frase que se escribe con trazo y un subrayado
export const Signature: React.FC<{ t: number; a: number; b: number; out: number; l1: string; l2: string }> = ({ t, a, b, out, l1, l2 }) => {
  const o = op(t, a, out);
  if (o <= 0.01) return null;
  const n1 = Math.round(l1.length * e(t, a, a + 1)), n2 = Math.round(l2.length * e(t, b, b + 1));
  return (
    <div style={{ position: "absolute", left: 1000, top: 170, opacity: o, fontFamily: "'Segoe Script','Brush Script MT',cursive", color: COL.ink, textShadow: "0 4px 18px rgba(0,0,0,.8)" }}>
      <div style={{ fontSize: 78 }}>{l1.slice(0, n1)}</div>
      <div style={{ fontSize: 78, color: COL.amber, marginLeft: 60 }}>{l2.slice(0, n2)}</div>
      <svg width={760} height={40}><path d="M10 25 C 200 5, 400 40, 740 14" stroke={COL.amber} strokeWidth={5} fill="none" strokeDasharray={760} strokeDashoffset={760 * (1 - e(t, b + 0.8, b + 1.5))} /></svg>
    </div>
  );
};

// ---- cita tachada («es de por vida» → rayón rojo)
export const StrikeQuote: React.FC<{ t: number; a: number; hit: number; out: number; text: string; x: number; y: number; fix?: string }> = ({ t, a, hit, out, text, x, y, fix }) => {
  const o = op(t, a, out);
  if (o <= 0.01) return null;
  const d = e(t, hit, hit + 0.3);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${pop(t, a, 0.8)})`, textAlign: "center" }}>
      <div style={{ position: "relative", display: "inline-block", fontFamily: "Georgia,serif", fontStyle: "italic", fontWeight: 700, fontSize: 110, color: COL.ink, textShadow: "0 8px 30px rgba(0,0,0,.8)", whiteSpace: "nowrap" }}>
        «{text}»
        <svg width="100%" height={60} style={{ position: "absolute", left: 0, top: "42%" }} viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 6 L 100 3" stroke={COL.red} strokeWidth={2.4} strokeDasharray={102} strokeDashoffset={102 * (1 - d)} /></svg>
      </div>
      {fix && <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 70, color: COL.amber, textShadow: extrude(6, "#000"), opacity: e(t, hit + 0.4, hit + 0.7) }}>{fix}</div>}
    </div>
  );
};

// ---- fajos de billetes: el pequeño vs la torre
export const Bills: React.FC<{ t: number; a: number; b: number; out: number; x: number; y: number; l: [number, string]; r: [number, string] }> = ({ t, a, b, out, x, y, l, r }) => {
  const o = op(t, a, out);
  if (o <= 0.01) return null;
  const stack = (n: number, at0: number, lab: string, col: string) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{ position: "relative", width: 260, height: 520 }}>
        {Array.from({ length: n }, (_, i) => { const k = Math.min(1, spr(t, at0 + i * 0.05, 1.1)); return k > 0 ? <div key={i} style={{ position: "absolute", left: 0, bottom: i * 30 + (1 - k) * 200, width: 260, height: 26, borderRadius: 4, opacity: k, background: "linear-gradient(90deg,#5f8f55,#9ccf86,#5f8f55)", boxShadow: "0 3px 0 #2f4a2a" }} /> : null; })}
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 60, color: col, textShadow: extrude(5, "#000"), opacity: e(t, at0 + 0.3, at0 + 0.5) }}>{lab}</div>
    </div>
  );
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, display: "flex", gap: 120, alignItems: "flex-end", transform: "translate(-50%,-100%)" }}>{stack(l[0], a, l[1], "#2ee86a")}{stack(r[0], b, r[1], COL.red)}</div>;
};

// ---- marcador del veredicto (tablero de taller con focos)
export const Score: React.FC<{ t: number; rows: { at: number; txt: string; ok: boolean }[]; out: number; x: number; y: number; title: string }> = ({ t, rows, out, x, y, title }) => {
  const a = rows[0].at, o = op(t, a - 0.3, out);
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `perspective(1300px) rotateY(-10deg) translateX(${(1 - e(t, a - 0.4, a)) * 200}px)`, padding: "26px 34px", borderRadius: 16, background: "#0d0f12", boxShadow: "0 40px 90px rgba(0,0,0,.7), inset 0 0 0 5px #3a3f46" }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, letterSpacing: 8, color: COL.amber, marginBottom: 12 }}>{title}</div>
      {rows.map((r, i) => {
        const on = t >= r.at;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, lineHeight: "70px" }}>
            <div style={{ width: 34, height: 34, borderRadius: 17, background: on ? (r.ok ? "#2ee86a" : COL.red) : "#222", boxShadow: on ? `0 0 22px ${r.ok ? "#2ee86a" : COL.red}` : "none" }} />
            <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 50, color: on ? COL.ink : "#3a3f46", whiteSpace: "nowrap" }}>{r.txt}</span>
          </div>
        );
      })}
    </div>
  );
};

// ---- lista de los 7 (cuaderno del taller): el número que toca se ilumina
export const SevenBook: React.FC<{ t: number; a: number; out: number; hi: number; x: number; y: number; sc?: number }> = ({ t, a, out, hi, x, y, sc = 1 }) => {
  const o = op(t, a, out);
  if (o <= 0.01) return null;
  const items = ["HISTORIAL", "EN FRÍO", "ESCÁNER", "CARCASA Y MANGUERAS", "ACEITE DE LA TRANSMISIÓN", "ELEVADOR", "REFACCIONES"];
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `scale(${sc}) perspective(1300px) rotateY(${(1 - e(t, a - 0.2, a + 0.3)) * -70 + 10}deg) rotateX(5deg)`, transformOrigin: "0 0", width: 640, padding: "28px 36px 28px 70px", background: "repeating-linear-gradient(180deg,#fbf8ee 0 58px,#cfd8e6 58px 60px)", borderLeft: "10px solid #c0392b", boxShadow: "0 40px 90px rgba(0,0,0,.65)" }}>
      {items.map((it, i) => {
        const on = i + 1 === hi, vis = e(t, a + i * 0.12, a + i * 0.12 + 0.2);
        return <div key={i} style={{ opacity: vis, display: "flex", gap: 18, alignItems: "center", height: 60, fontFamily: FONT, fontWeight: 900, fontSize: on ? 40 : 32, color: on ? "#b3261e" : "#2a3446", transform: `translateX(${on ? 14 : 0}px)` }}><span style={{ width: 40 }}>{i + 1}.</span>{i === 4 && hi < 5 ? "— SECRETO —" : it}</div>;
      })}
    </div>
  );
};

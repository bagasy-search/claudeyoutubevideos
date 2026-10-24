// sgardensquirrel · piezas NUEVAS del jardín (receta, pelota de golf, rueda del año, cuenta de días, regla de pies, prohibido, error N°…).
// Todas reciben segundos globales anclados con at("frase"). Papel crema + tinta + bermellón, como el resto del kit.
import React from "react";
import { BRUSH, COL, FONT, e, ei, extrude, spr } from "./lib";

const vis = (t: number, a: number, out: number) => e(t, a, a + 0.15) * (1 - e(t, out, out + 0.3));
const PAPER: React.CSSProperties = { background: `linear-gradient(180deg, ${COL.cream}, ${COL.paper})`, boxShadow: "0 26px 54px rgba(0,0,0,.5)", borderRadius: 6 };
const Abs: React.FC<{ x: number; y: number; o: number; tr?: string; children: React.ReactNode }> = ({ x, y, o, tr = "", children }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) ${tr}` }}>{children}</div>
);
const pop = (t: number, a: number) => 0.6 + 0.4 * Math.min(1.08, spr(t, a));

// ficha de receta: título + renglones que se escriben solos (cada uno con su palabra)
export const RecipeCard: React.FC<{ t: number; out: number; title: string; items: { at: number; text: string; n?: string }[]; x?: number; y?: number; col?: string; w?: number }> = ({ t, out, title, items, x = 1400, y = 520, col = COL.red, w = 720 }) => {
  const a0 = items[0].at - 0.4, o = vis(t, a0, out); if (o <= 0.01) return null;
  return <Abs x={x} y={y} o={o} tr={`perspective(1100px) rotateY(${(1 - Math.min(1, spr(t, a0))) * -40}deg) rotate(-1.5deg)`}>
    <div style={{ ...PAPER, width: w, padding: "26px 40px 30px", backgroundImage: `repeating-linear-gradient(180deg, transparent 0 63px, rgba(43,63,99,.22) 63px 65px), linear-gradient(180deg, ${COL.cream}, ${COL.paper})` }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 6, color: col, borderBottom: `4px solid ${col}`, paddingBottom: 8, marginBottom: 6 }}>{title}</div>
      {items.map((it, i) => { const r = e(t, it.at - 0.05, it.at + 0.5);
        return <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 18, height: 65, opacity: r > 0 ? 1 : 0.0 }}>
          {it.n && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 46, color: col, minWidth: 110, textAlign: "right", transform: `scale(${pop(t, it.at)})` }}>{it.n}</div>}
          <div style={{ fontFamily: BRUSH, fontSize: 52, color: COL.ink, whiteSpace: "nowrap", clipPath: `inset(-20% ${100 - r * 100}% -20% -2%)` }}>{it.text}</div>
        </div>; })}
    </div>
  </Abs>;
};

// el agujero de la ardilla al lado de una pelota de golf (mismo tamaño)
export const GolfHole: React.FC<{ t: number; at: number; out: number; x?: number; y?: number }> = ({ t, at, out, x = 1440, y = 520 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = Math.min(1.1, spr(t, at)), b = ei(t, at + 0.5, at + 1.2);
  return <Abs x={x} y={y} o={o}>
    <div style={{ ...PAPER, padding: "30px 46px", display: "flex", gap: 40, alignItems: "center" }}>
      <svg width={220} height={220}><circle cx={110} cy={110} r={92 * k} fill="#e9e1cf" stroke="#9a7650" strokeWidth={14} strokeDasharray="10 7" /><circle cx={110} cy={110} r={74 * k} fill="#120e0b" /></svg>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 70, color: COL.red }}>=</div>
      <svg width={220} height={220} style={{ transform: `translateX(${(1 - b) * 160}px) rotate(${(1 - b) * 260}deg)`, opacity: b }}>
        <circle cx={110} cy={110} r={74} fill="#fbfbf7" stroke="#cfcfc8" strokeWidth={3} />
        {Array.from({ length: 22 }, (_, i) => <circle key={i} cx={110 + Math.cos(i * 2.4) * (i % 3) * 22} cy={110 + Math.sin(i * 2.4) * (i % 3) * 22} r={6} fill="#e3e3dc" />)}
      </svg>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: COL.ink, lineHeight: 1.1 }}>A GOLF<br />BALL<div style={{ fontSize: 26, color: COL.red, letterSpacing: 3 }}>≈ 1.7 IN</div></div>
    </div>
  </Abs>;
};

// rueda del año: 4 cuartos que se encienden (otoño, invierno, primavera, verano)
export const SeasonWheel: React.FC<{ t: number; at: number; out: number; hi: number[]; x?: number; y?: number; R?: number }> = ({ t, at, out, hi, x = 1500, y = 520, R = 250 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const L = [["FALL", "#c9562f", "SEP–NOV"], ["WINTER", "#6f8ca6", "DEC–FEB"], ["SPRING", "#7fae4c", "MAR–MAY"], ["SUMMER", "#d9a441", "JUN–AUG"]];
  const cur = hi.reduce((m, a, i) => (t >= a ? i : m), -1);
  const rot = (1 - Math.min(1, spr(t, at))) * -120;
  return <Abs x={x} y={y} o={o} tr={`rotate(${rot}deg) scale(${pop(t, at)})`}>
    <svg width={R * 2 + 40} height={R * 2 + 40} viewBox={`${-R - 20} ${-R - 20} ${R * 2 + 40} ${R * 2 + 40}`} style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,.5))" }}>
      {L.map(([n, c, m], i) => { const a0 = -Math.PI / 2 + i * Math.PI / 2, a1 = a0 + Math.PI / 2, on = i === cur ? 1 : 0, rr = R * (on ? 1.06 : 0.96);
        const p = `M0 0 L ${Math.cos(a0) * rr} ${Math.sin(a0) * rr} A ${rr} ${rr} 0 0 1 ${Math.cos(a1) * rr} ${Math.sin(a1) * rr} Z`, am = (a0 + a1) / 2;
        return <g key={i}><path d={p} fill={c} opacity={on ? 1 : 0.42} stroke={COL.cream} strokeWidth={6} />
          <text x={Math.cos(am) * R * 0.58} y={Math.sin(am) * R * 0.58} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={on ? 40 : 32} fill={COL.cream} style={{ textShadow: "0 2px 6px rgba(0,0,0,.6)" }}>{n}</text>
          <text x={Math.cos(am) * R * 0.58} y={Math.sin(am) * R * 0.58 + 34} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={22} fill={COL.cream}>{m}</text></g>; })}
      <circle r={R * 0.2} fill={COL.cream} stroke={COL.ink} strokeWidth={5} />
      <text y={12} textAnchor="middle" fontFamily={BRUSH} fontSize={38} fill={COL.ink}>year</text>
    </svg>
  </Abs>;
};

// cuenta de días: N puntos que se encienden y una etiqueta (cambiar algodones cada 3 días, puerta 2-3 días…)
export const DayDots: React.FC<{ t: number; at: number; out: number; n: number; label: string; every?: number; x?: number; y?: number; col?: string }> = ({ t, at, out, n, label, every = 0.28, x = 960, y = 900, col = COL.red }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  return <Abs x={x} y={y} o={o}>
    <div style={{ ...PAPER, padding: "18px 34px", display: "flex", alignItems: "center", gap: 26 }}>
      <div style={{ display: "flex", gap: 14 }}>{Array.from({ length: n }, (_, i) => { const k = e(t, at + i * every, at + i * every + 0.2);
        return <div key={i} style={{ width: 54, height: 54, borderRadius: 27, border: `5px solid ${COL.ink}`, background: k > 0.5 ? col : "transparent", transform: `scale(${0.8 + 0.2 * k})`, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: COL.cream, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>; })}</div>
      <div style={{ fontFamily: BRUSH, fontSize: 56, color: COL.ink, whiteSpace: "nowrap" }}>{label}</div>
    </div>
  </Abs>;
};

// regla de distancia entre dos puntos de pantalla (8 pies del árbol al techo, 10 pies del comedero…)
export const Ruler: React.FC<{ t: number; at: number; out: number; a: { x: number; y: number }; b: { x: number; y: number }; label: string; col?: string }> = ({ t, at, out, a, b, label, col = COL.gold }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = ei(t, at, at + 0.7), ex = a.x + (b.x - a.x) * k, ey = a.y + (b.y - a.y) * k, mx = (a.x + ex) / 2, my = (a.y + ey) / 2;
  const ang = Math.atan2(b.y - a.y, b.x - a.x), nx = -Math.sin(ang) * 18, ny = Math.cos(ang) * 18;
  return <div style={{ position: "absolute", inset: 0, opacity: o }}>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 3px 6px rgba(0,0,0,.7))" }}>
      <line x1={a.x} y1={a.y} x2={ex} y2={ey} stroke={col} strokeWidth={7} strokeDasharray="22 12" strokeLinecap="round" />
      <line x1={a.x - nx} y1={a.y - ny} x2={a.x + nx} y2={a.y + ny} stroke={col} strokeWidth={7} />
      {k > 0.98 && <line x1={b.x - nx} y1={b.y - ny} x2={b.x + nx} y2={b.y + ny} stroke={col} strokeWidth={7} />}
    </svg>
    <div style={{ position: "absolute", left: mx, top: my, transform: `translate(-50%,-140%) scale(${pop(t, at + 0.5)})`, fontFamily: FONT, fontWeight: 800, fontSize: 64, color: COL.cream, textShadow: extrude(6, "#3a2a18"), whiteSpace: "nowrap" }}>{label}</div>
  </div>;
};

// prohibido: círculo rojo que se tacha sobre una palabra (POISON, TRAPS, FOAM…)
export const NoSign: React.FC<{ t: number; at: number; out: number; text: string; x?: number; y?: number; size?: number }> = ({ t, at, out, text, x = 1440, y = 460, size = 300 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const c = ei(t, at + 0.15, at + 0.5), d = ei(t, at + 0.45, at + 0.75), R = size / 2 - 14;
  return <Abs x={x} y={y} o={o} tr={`scale(${pop(t, at)})`}>
    <div style={{ position: "relative", width: size, height: size }}>
      <div style={{ position: "absolute", inset: 30, borderRadius: "50%", background: COL.cream, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size * 0.16, color: COL.ink, letterSpacing: 2, boxShadow: "0 20px 40px rgba(0,0,0,.45)" }}>{text}</div>
      <svg width={size} height={size} style={{ position: "absolute", inset: 0 }}>
        <circle cx={size / 2} cy={size / 2} r={R} fill="none" stroke={COL.red} strokeWidth={26} strokeDasharray={2 * Math.PI * R} strokeDashoffset={2 * Math.PI * R * (1 - c)} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
        <line x1={size / 2 - R * 0.7} y1={size / 2 - R * 0.7} x2={size / 2 - R * 0.7 + R * 1.4 * d} y2={size / 2 - R * 0.7 + R * 1.4 * d} stroke={COL.red} strokeWidth={26} strokeLinecap="round" />
      </svg>
    </div>
  </Abs>;
};

// el error N°: tarjeta grande con el número que se estampa y la frase
export const MistakeCard: React.FC<{ t: number; at: number; out: number; n: number; text: string; x?: number; y?: number }> = ({ t, at, out, n, text, x = 560, y = 900 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = Math.min(1.1, spr(t, at, 1.2));
  return <Abs x={x} y={y} o={o} tr={`perspective(1000px) rotateX(${(1 - Math.min(1, k)) * 80}deg) rotate(-2deg)`}>
    <div style={{ ...PAPER, display: "flex", alignItems: "center", gap: 26, padding: "20px 44px 24px 26px", borderLeft: `16px solid ${COL.red}` }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 130, color: COL.red, lineHeight: 0.9, textShadow: extrude(5, "#7a1d12") }}>{n}</div>
      <div><div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, letterSpacing: 8, color: COL.red }}>MISTAKE</div>
        <div style={{ fontFamily: BRUSH, fontSize: 64, color: COL.ink, whiteSpace: "nowrap" }}>{text}</div></div>
    </div>
  </Abs>;
};

// cucharas: cucharadita vs cucharada (y la cantidad)
export const Spoon: React.FC<{ t: number; at: number; out: number; big?: boolean; n: string; label: string; x?: number; y?: number }> = ({ t, at, out, big, n, label, x = 1450, y = 520 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const s = big ? 1.25 : 0.85, tilt = Math.sin((t - at) * 2) * 4;
  return <Abs x={x} y={y} o={o} tr={`scale(${pop(t, at)})`}>
    <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
      <svg width={360} height={140} style={{ transform: `rotate(${-12 + tilt}deg)`, filter: "drop-shadow(0 14px 22px rgba(0,0,0,.5))" }}>
        <ellipse cx={80} cy={70} rx={62 * s} ry={42 * s} fill="#d6d9dc" stroke="#8d9296" strokeWidth={4} />
        <ellipse cx={80} cy={70} rx={46 * s} ry={28 * s} fill="#c0391b" />
        <rect x={130 * Math.min(1.1, s)} y={62} width={210} height={16} rx={8} fill="#c8ccd0" stroke="#8d9296" strokeWidth={3} />
      </svg>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 96, color: COL.cream, textShadow: extrude(8, "#3a2a18"), lineHeight: 1 }}>{n}
        <div style={{ fontSize: 34, letterSpacing: 6, textShadow: extrude(3, "#000") }}>{label}</div></div>
    </div>
  </Abs>;
};

// carta de avión azul (la de la madre) que se abre con las 3 palabras y la línea final
export const AirLetter: React.FC<{ t: number; at: number; out: number; words: { at: number; jp: string; en: string }[]; line?: { at: number; text: string }; x?: number; y?: number }> = ({ t, at, out, words, line, x = 1380, y = 520 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const op = ei(t, at, at + 0.9);
  return <Abs x={x} y={y} o={o} tr={`perspective(1200px) rotateX(${(1 - op) * 70}deg) rotate(2deg)`}>
    <div style={{ width: 760, padding: "34px 44px 40px", background: "linear-gradient(180deg,#cfe0f0,#b8cde4)", boxShadow: "0 30px 60px rgba(0,0,0,.5)",
      border: "14px solid transparent", borderImage: "repeating-linear-gradient(45deg,#c8321e 0 18px,#f3ead8 18px 30px,#2b3f63 30px 48px,#f3ead8 48px 60px) 14" }}>
      <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 22, letterSpacing: 6, color: "#2b3f63", marginBottom: 14 }}>PAR AVION · OSAKA → USA · 1970</div>
      {words.map((w, i) => { const k = e(t, w.at, w.at + 0.4);
        return <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 20, opacity: k, transform: `translateX(${(1 - k) * 30}px)` }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: COL.red, minWidth: 50 }}>{i + 1}.</div>
          <div style={{ fontFamily: BRUSH, fontSize: 70, color: "#1d2c4a" }}>{w.jp}</div>
          <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 30, color: "#2b3f63" }}>— {w.en}</div>
        </div>; })}
      {line && <div style={{ fontFamily: BRUSH, fontSize: 58, color: COL.red, marginTop: 16, clipPath: `inset(-20% ${100 - 100 * e(t, line.at, line.at + 1.2)}% -20% -2%)`, whiteSpace: "nowrap" }}>{line.text}</div>}
    </div>
  </Abs>;
};

// reloj del día: la ardilla trabaja de día (sol/luna y quién hace ruido a qué hora)
export const DayClock: React.FC<{ t: number; at: number; out: number; marks: { at: number; h: number; text: string }[]; x?: number; y?: number }> = ({ t, at, out, marks, x = 1460, y = 500 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const cur = marks.reduce((m, k) => (t >= k.at ? k : m), marks[0]);
  const ang = (cur.h / 24) * 360 - 90;
  return <Abs x={x} y={y} o={o} tr={`scale(${pop(t, at)})`}>
    <svg width={460} height={460} viewBox="-230 -230 460 460" style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,.5))" }}>
      <circle r={210} fill={COL.cream} stroke={COL.ink} strokeWidth={8} />
      <path d="M -210 0 A 210 210 0 0 1 210 0 Z" fill="#f2d48a" opacity={0.6} transform="rotate(180)" />
      <path d="M -210 0 A 210 210 0 0 1 210 0 Z" fill="#2b3f63" opacity={0.25} />
      {Array.from({ length: 24 }, (_, i) => <line key={i} x1={0} y1={-198} x2={0} y2={i % 6 ? -186 : -170} stroke={COL.ink} strokeWidth={i % 6 ? 3 : 6} transform={`rotate(${i * 15})`} />)}
      <text y={-130} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={COL.ink}>NOON</text>
      <text y={150} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={COL.ink}>MIDNIGHT</text>
      <line x1={0} y1={0} x2={Math.cos((ang * Math.PI) / 180) * 160} y2={Math.sin((ang * Math.PI) / 180) * 160} stroke={COL.red} strokeWidth={12} strokeLinecap="round" />
      <circle r={16} fill={COL.red} />
    </svg>
    <div style={{ position: "absolute", left: "50%", top: 470, transform: "translateX(-50%)", ...PAPER, padding: "10px 26px", fontFamily: BRUSH, fontSize: 52, color: COL.ink, whiteSpace: "nowrap" }}>{cur.text}</div>
  </Abs>;
};

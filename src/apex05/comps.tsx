// comps.tsx — gráficos de apex05 (osos). Todo por código, siempre encima de video que se mueve.
// Marca Apex Files: rojo expediente, papel, máquina de escribir (Special Elite), Oswald para golpes.
import React from "react";
import { Img, staticFile } from "remotion";
import { COND, SERIF, TYPE, SANS, RED, RED2, PAPER, INK, GOLD, W, H, k01, lerp, ease, easeOut, easeIn, rnd, shadow, interp } from "./lib";
export { interp, easeIn };

const vis = (t: number, a: number, b: number, fi = 0.35, fo = 0.3) => Math.min(easeOut(k01(t, a, a + fi)), 1 - k01(t, b - fo, b));

// ---------- palabra del tráiler (máx 4 palabras, sobre un golpe) ----------
export const BigWord: React.FC<{ t: number; a: number; b: number; text: string; sub?: string; red?: boolean; y?: number; size?: number }> = ({ t, a, b, text, sub, red, y = 540, size = 230 }) => {
  if (t < a - 0.05 || t > b + 0.05) return null;
  const inn = easeOut(k01(t, a, a + 0.45)), out = k01(t, b - 0.22, b);
  const sc = lerp(1.25, 1, inn) * (1 + 0.03 * k01(t, a, b));
  const fs = Math.min(size, 1700 / (text.length * 0.56));
  const bar = easeOut(k01(t, a + 0.15, a + 0.55));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, transform: `translateY(-50%) scale(${sc})`, textAlign: "center", opacity: (1 - out) * Math.min(1, inn * 1.8), filter: `blur(${(1 - inn) * 8 + out * 6}px)` }}>
      <div style={{ fontFamily: COND, fontWeight: 700, fontSize: fs, lineHeight: 1, letterSpacing: 6, color: red ? RED2 : "#fff", textTransform: "uppercase", textShadow: `0 0 50px ${red ? "rgba(255,40,30,.5)" : "rgba(0,0,0,.7)"}, ${shadow}` }}>{text}</div>
      <div style={{ margin: "16px auto 0", width: 520 * bar, height: 8, background: RED, boxShadow: `0 0 20px ${RED}` }} />
      {sub && <div style={{ fontFamily: TYPE, fontSize: 40, letterSpacing: 6, color: PAPER, marginTop: 16, textShadow: shadow }}>{sub}</div>}
    </div>
  );
};

// ---------- rótulo de lugar / fecha (máquina de escribir) ----------
export const Place: React.FC<{ t: number; a: number; b: number; text: string; sub?: string; x?: number; y?: number }> = ({ t, a, b, text, sub, x = 120, y = 800 }) => {
  if (t < a || t > b) return null;
  const k = easeOut(k01(t, a, a + 0.5)), o = 1 - k01(t, b - 0.3, b);
  const n = Math.round(text.length * k01(t, a + 0.1, a + 0.1 + text.length * 0.035));
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, color: "#fff", textShadow: shadow }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 16, height: 16, background: RED, boxShadow: `0 0 12px ${RED}`, transform: `scale(${k})` }} />
        <div style={{ width: 240 * k, height: 3, background: RED }} />
      </div>
      <div style={{ fontFamily: COND, fontWeight: 700, fontSize: 58, letterSpacing: 6, marginTop: 10, textTransform: "uppercase" }}>{text.slice(0, n)}<span style={{ opacity: n < text.length ? 1 : 0, color: RED2 }}>▍</span></div>
      {sub && <div style={{ fontFamily: TYPE, fontSize: 32, letterSpacing: 2, opacity: 0.92 * k01(t, a + 0.5, a + 0.8), marginTop: 2, color: PAPER }}>{sub}</div>}
    </div>
  );
};

// ---------- odómetro ----------
const Digit: React.FC<{ v: number; size: number; color: string }> = ({ v, size, color }) => {
  const h = size * 1.05;
  return (
    <div style={{ display: "inline-block", height: h, overflow: "hidden", verticalAlign: "top" }}>
      <div style={{ transform: `translateY(${-((v % 10) + 10) % 10 * h}px)` }}>
        {Array.from({ length: 11 }, (_, i) => <div key={i} style={{ height: h, lineHeight: `${h}px`, color }}>{i % 10}</div>)}
      </div>
    </div>
  );
};
export const Odo: React.FC<{ value: number; digits?: number; size: number; color?: string; comma?: boolean }> = ({ value, digits = 3, size, color = "#fff", comma }) => {
  const s: React.ReactNode[] = [];
  for (let d = digits - 1; d >= 0; d--) {
    const place = Math.pow(10, d), raw = value / place;
    const lower = (value % place) / place, base = Math.floor(raw), frac = d === 0 ? raw - base : Math.max(0, (lower - 0.85) / 0.15);
    s.push(<Digit key={d} v={base + frac} size={size} color={color} />);
    if (comma && d === 3) s.push(<span key="c" style={{ color }}>,</span>);
  }
  return <span style={{ fontFamily: COND, fontWeight: 700, fontSize: size, lineHeight: 1.05, display: "inline-flex", fontVariantNumeric: "tabular-nums" }}>{s}</span>;
};
export const Counter: React.FC<{ t: number; a: number; b: number; to: number; from?: number; dur?: number; digits?: number; kicker?: string; unit?: string; x?: number; y?: number; size?: number; red?: boolean; comma?: boolean; center?: boolean }> =
  ({ t, a, b, to, from = 0, dur = 1.1, digits = 3, kicker, unit, x = 120, y = 600, size = 200, red, comma, center }) => {
    if (t < a || t > b) return null;
    const k = easeOut(k01(t, a, a + dur)), o = 1 - k01(t, b - 0.3, b), v = lerp(from, to, k);
    return (
      <div style={{ position: "absolute", left: center ? 0 : x, right: center ? 0 : undefined, top: y, opacity: o * k01(t, a, a + 0.15), color: "#fff", textShadow: shadow, display: "flex", flexDirection: "column", alignItems: center ? "center" : "flex-start",
        transform: `translateY(${(1 - easeOut(k01(t, a, a + 0.45))) * 40}px)` }}>
        {kicker && <div style={{ fontFamily: TYPE, fontSize: 36, letterSpacing: 6, marginBottom: 4, color: PAPER }}>{kicker}</div>}
        <div style={{ display: "flex", alignItems: "flex-start", filter: `drop-shadow(0 4px 24px rgba(0,0,0,.7))` }}>
          <Odo value={v} digits={digits} size={size} color={red ? RED2 : "#fff"} comma={comma} />
          {unit && <span style={{ fontFamily: COND, fontWeight: 700, fontSize: size * 0.38, marginLeft: 18, marginTop: size * 0.14, color: red ? RED2 : "#fff" }}>{unit}</span>}
        </div>
      </div>
    );
  };

// ---------- sello de goma que golpea ----------
export const Stamp: React.FC<{ t: number; a: number; b: number; text: string; x?: number; y?: number; rot?: number; size?: number; sub?: string }> = ({ t, a, b, text, x = W / 2, y = H / 2, rot = -8, size = 120, sub }) => {
  if (t < a || t > b) return null;
  const k = k01(t, a, a + 0.16), sc = lerp(2.6, 1, easeIn(k)), shake = k >= 1 ? Math.sin((t - a) * 90) * 6 * (1 - k01(t, a + 0.16, a + 0.45)) : 0;
  const o = Math.min(k * 2, 1) * (1 - k01(t, b - 0.25, b));
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) translate(${shake}px,${shake * 0.6}px) rotate(${rot}deg) scale(${sc})`, opacity: o }}>
      <div style={{ border: `${size * 0.07}px solid ${RED2}`, borderRadius: 14, padding: `${size * 0.08}px ${size * 0.3}px`, color: RED2, fontFamily: COND, fontWeight: 700, fontSize: size, letterSpacing: size * 0.08, lineHeight: 1.05,
        textTransform: "uppercase", boxShadow: `0 0 30px rgba(255,59,48,.25), inset 0 0 30px rgba(255,59,48,.2)`, background: "rgba(20,4,4,.25)", whiteSpace: "nowrap",
        maskImage: "radial-gradient(circle at 30% 40%, black 60%, rgba(0,0,0,.75) 75%, black 90%)", WebkitMaskImage: "radial-gradient(circle at 30% 40%, black 60%, rgba(0,0,0,.75) 75%, black 90%)" }}>
        {text}
        {sub && <div style={{ fontFamily: TYPE, fontSize: size * 0.28, letterSpacing: 4, textAlign: "center" }}>{sub}</div>}
      </div>
    </div>
  );
};

// ---------- ficha del expediente (papel que entra sobre el video, campos que se tipean) ----------
export const CaseCard: React.FC<{ t: number; a: number; b: number; title: string; rows: { at: number; k: string; v: string; red?: boolean }[]; stamp?: { at: number; text: string }; x?: number; y?: number; photo?: React.ReactNode }> =
  ({ t, a, b, title, rows, stamp, x = 1060, y = 150, photo }) => {
    if (t < a || t > b) return null;
    const k = easeOut(k01(t, a, a + 0.55)), o = 1 - k01(t, b - 0.3, b);
    return (
      <div style={{ position: "absolute", left: x, top: y, width: 720, opacity: o, transform: `translateX(${(1 - k) * 260}px) rotate(${lerp(6, -1.5, k)}deg)`, filter: "drop-shadow(0 30px 40px rgba(0,0,0,.6))" }}>
        <div style={{ background: `linear-gradient(160deg, ${PAPER}, #d9cfbb)`, padding: "34px 40px 40px", position: "relative", borderTop: `14px solid ${RED}` }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.18, background: "repeating-linear-gradient(0deg, transparent 0 46px, #7a6a50 46px 47px)" }} />
          <div style={{ fontFamily: TYPE, fontSize: 26, color: "#5a5040", letterSpacing: 4 }}>APEX FILES · CASE FILE</div>
          <div style={{ fontFamily: COND, fontWeight: 700, fontSize: 76, color: INK, letterSpacing: 2, lineHeight: 1.05, marginTop: 6 }}>{title}</div>
          {photo && <div style={{ position: "absolute", right: 36, top: 36, width: 190, height: 140, overflow: "hidden", border: "6px solid #fff", transform: "rotate(4deg)", boxShadow: "0 6px 14px rgba(0,0,0,.4)" }}>{photo}</div>}
          <div style={{ marginTop: 18 }}>
            {rows.map((r, i) => {
              const n = Math.round(r.v.length * k01(t, r.at, r.at + 0.04 * r.v.length + 0.1));
              if (t < r.at - 0.1) return <div key={i} style={{ height: 52 }} />;
              return (
                <div key={i} style={{ display: "flex", alignItems: "baseline", height: 52, borderBottom: "1px dashed rgba(60,50,30,.35)" }}>
                  <div style={{ width: 240, fontFamily: TYPE, fontSize: 24, color: "#6b5f4a", letterSpacing: 2 }}>{r.k}</div>
                  <div style={{ fontFamily: TYPE, fontSize: 34, color: r.red ? RED : INK }}>{r.v.slice(0, n)}</div>
                </div>
              );
            })}
          </div>
          {stamp && <Stamp t={t} a={stamp.at} b={b} text={stamp.text} x={470} y={250} size={84} rot={-12} />}
        </div>
      </div>
    );
  };

// ---------- regla de medir dibujada sobre el objeto (el dato vive en el plano) ----------
export const SpanMark: React.FC<{ t: number; a: number; b: number; x1: number; y1: number; x2: number; y2: number; label: string; sub?: string; ticks?: number; color?: string }> =
  ({ t, a, b, x1, y1, x2, y2, label, sub, ticks = 20, color = "#fff" }) => {
    if (t < a || t > b) return null;
    const p = ease(k01(t, a, a + 0.9)), o = 1 - k01(t, b - 0.3, b);
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), ang = Math.atan2(dy, dx), nx = -dy / L, ny = dx / L;
    const xe = x1 + dx * p, ye = y1 + dy * p;
    return (
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, opacity: o, filter: "drop-shadow(0 0 6px rgba(0,0,0,.9))" }}>
        <line x1={x1} y1={y1} x2={xe} y2={ye} stroke={color} strokeWidth={4} />
        {[0, 1].map((e) => e <= p && <line key={e} x1={x1 + dx * e - nx * 26} y1={y1 + dy * e - ny * 26} x2={x1 + dx * e + nx * 26} y2={y1 + dy * e + ny * 26} stroke={RED2} strokeWidth={6} />)}
        {Array.from({ length: ticks + 1 }, (_, i) => i / ticks <= p && <line key={i} x1={x1 + dx * i / ticks} y1={y1 + dy * i / ticks} x2={x1 + dx * i / ticks + nx * (i % 5 ? 10 : 18)} y2={y1 + dy * i / ticks + ny * (i % 5 ? 10 : 18)} stroke={color} strokeWidth={2} />)}
        <g transform={`translate(${(x1 + x2) / 2 - nx * 70},${(y1 + y2) / 2 - ny * 70}) rotate(${(ang * 180) / Math.PI})`} opacity={k01(t, a + 0.6, a + 0.9)}>
          <text textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={86} fill="#fff" letterSpacing={4}>{label}</text>
          {sub && <text textAnchor="middle" y={44} fontFamily={TYPE} fontSize={32} fill={PAPER}>{sub}</text>}
        </g>
      </svg>
    );
  };

// ---------- anillos/marcas sobre un punto del plano ----------
export const Mark: React.FC<{ t: number; a: number; b: number; x: number; y: number; r?: number; label?: string; n?: string; side?: "r" | "l" }> = ({ t, a, b, x, y, r = 60, label, n, side = "r" }) => {
  if (t < a || t > b) return null;
  const p = easeOut(k01(t, a, a + 0.5)), o = 1 - k01(t, b - 0.3, b), C = 2 * Math.PI * r;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, opacity: o }}>
      <svg width={W} height={H} style={{ position: "absolute", filter: `drop-shadow(0 0 8px ${RED})` }}>
        <circle cx={x} cy={y} r={r} fill="none" stroke={RED2} strokeWidth={6} strokeDasharray={`${C * p} ${C}`} transform={`rotate(-90 ${x} ${y})`} />
        <circle cx={x} cy={y} r={r * lerp(1.6, 1.15, p)} fill="none" stroke="rgba(255,80,70,.5)" strokeWidth={2} opacity={1 - p * 0.5} />
        {label && <line x1={x + (side === "r" ? r : -r)} y1={y} x2={x + (side === "r" ? r + 90 * p : -r - 90 * p)} y2={y - 60 * p} stroke="#fff" strokeWidth={3} />}
      </svg>
      {n && <div style={{ position: "absolute", left: x - 24, top: y - r - 70, width: 48, height: 48, borderRadius: 24, background: RED, color: "#fff", fontFamily: COND, fontWeight: 700, fontSize: 34, textAlign: "center", lineHeight: "48px", transform: `scale(${p})` }}>{n}</div>}
      {label && <div style={{ position: "absolute", top: y - 60 - 46, left: side === "r" ? x + r + 100 : undefined, right: side === "l" ? W - (x - r - 100) : undefined, fontFamily: COND, fontWeight: 700, fontSize: 46, color: "#fff", letterSpacing: 3, textShadow: shadow, opacity: k01(t, a + 0.35, a + 0.6), whiteSpace: "nowrap", textTransform: "uppercase" }}>{label}</div>}
    </div>
  );
};

// ---------- línea sobre el agua (ojos, oídos y nariz en una sola línea) ----------
export const WaterLine: React.FC<{ t: number; a: number; b: number; y: number; x1?: number; x2?: number; pts: { at: number; x: number; label: string }[] }> = ({ t, a, b, y, x1 = 120, x2 = 1800, pts }) => {
  if (t < a || t > b) return null;
  const p = ease(k01(t, a, a + 0.8)), o = 1 - k01(t, b - 0.3, b);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <svg width={W} height={H} style={{ position: "absolute", filter: "drop-shadow(0 0 8px rgba(120,220,255,.8))" }}>
        <line x1={x1} y1={y} x2={lerp(x1, x2, p)} y2={y} stroke="#bfefff" strokeWidth={4} strokeDasharray="22 12" />
        {pts.map((q, i) => { const e = easeOut(k01(t, q.at, q.at + 0.4)); return e > 0 && <g key={i}>
          <circle cx={q.x} cy={y} r={20 * e} fill="none" stroke="#fff" strokeWidth={5} />
          <line x1={q.x} y1={y - 26} x2={q.x} y2={y - 26 - 80 * e} stroke="#fff" strokeWidth={3} />
        </g>; })}
      </svg>
      {pts.map((q, i) => <div key={i} style={{ position: "absolute", left: q.x - 200, width: 400, top: y - 160, textAlign: "center", fontFamily: COND, fontWeight: 700, fontSize: 48, letterSpacing: 4, color: "#fff", textShadow: shadow, opacity: k01(t, q.at + 0.15, q.at + 0.4) }}>{q.label}</div>)}
      <div style={{ position: "absolute", left: x1, top: y + 24, fontFamily: TYPE, fontSize: 30, color: "#cfefff", textShadow: shadow, opacity: k01(t, a + 0.6, a + 1) }}>WATERLINE</div>
    </div>
  );
};

// ---------- gotas sobre el agua + sensores que se encienden ----------
export const Sensors: React.FC<{ t: number; a: number; b: number; cx: number; cy: number; rx: number; ry: number; n?: number; dropAt?: number; dx?: number; dy?: number; label?: string }> =
  ({ t, a, b, cx, cy, rx, ry, n = 90, dropAt, dx = 0, dy = 0, label }) => {
    if (t < a || t > b) return null;
    const o = 1 - k01(t, b - 0.3, b);
    return (
      <div style={{ position: "absolute", inset: 0, opacity: o }}>
        <svg width={W} height={H} style={{ position: "absolute" }}>
          {Array.from({ length: n }, (_, i) => {
            const u = rnd(i, 3), v = rnd(i, 7), x = cx + (u - 0.5) * 2 * rx, y = cy + (v - 0.5) * 2 * ry * (1 - Math.abs(u - 0.5));
            const on = easeOut(k01(t, a + 0.2 + u * 0.8, a + 0.5 + u * 0.8));
            const hit = dropAt != null ? Math.max(0, 1 - Math.abs(t - dropAt - 0.15 - Math.hypot(x - cx - dx, y - cy - dy) / 900) * 6) : 0;
            return <circle key={i} cx={x} cy={y} r={7 + 5 * hit} fill={hit > 0.1 ? "#fff" : "#ffd36b"} opacity={on * (0.8 + 0.2 * hit)} style={{ filter: `drop-shadow(0 0 ${6 + 10 * hit}px #ffb020)` }} />;
          })}
          {dropAt != null && [0, 0.25, 0.5].map((d, i) => { const e = k01(t, dropAt + d, dropAt + d + 1.2); return e > 0 && e < 1 && <ellipse key={i} cx={cx + dx} cy={cy + dy} rx={30 + 420 * e} ry={(30 + 420 * e) * 0.32} fill="none" stroke="#e8fbff" strokeWidth={4 * (1 - e)} opacity={1 - e} />; })}
        </svg>
        {label && <div style={{ position: "absolute", left: 120, top: 150, fontFamily: COND, fontWeight: 700, fontSize: 56, letterSpacing: 4, color: "#fff", textShadow: shadow, opacity: vis(t, a + 0.4, b) }}>{label}</div>}
      </div>
    );
  };

// ---------- cámara infrarroja (overlay sobre el plano) ----------
export const IRCam: React.FC<{ t: number; a: number; b: number; cam?: string; date?: string; lostAt?: number }> = ({ t, a, b, cam = "CAM 01 · IR", date = "2004", lostAt }) => {
  if (t < a || t > b) return null;
  const lost = lostAt != null ? k01(t, lostAt, lostAt + 0.25) : 0;
  const sec = Math.floor((t - a) * 30) % 30, s = Math.floor(t - a);
  const glitch = lostAt != null && t > lostAt - 0.4 && t < lostAt + 0.3 ? Math.sin(t * 140) * 18 : 0;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, rgba(0,0,0,.18) 0 2px, transparent 2px 4px)", transform: `translateX(${glitch}px)` }} />
      <div style={{ position: "absolute", left: 70, top: 60, fontFamily: TYPE, fontSize: 40, color: "#e8ffe8", textShadow: "0 0 8px #000", display: "flex", gap: 18, alignItems: "center" }}>
        <div style={{ width: 26, height: 26, borderRadius: 13, background: lost ? "#555" : RED2, opacity: Math.sin(t * 6) > 0 ? 1 : 0.2 }} />{lost ? "NO SIGNAL" : "REC"}
      </div>
      <div style={{ position: "absolute", right: 70, top: 60, fontFamily: TYPE, fontSize: 36, color: "#e8ffe8", textShadow: "0 0 8px #000" }}>{cam}</div>
      <div style={{ position: "absolute", right: 70, bottom: 60, fontFamily: TYPE, fontSize: 36, color: "#e8ffe8", textShadow: "0 0 8px #000" }}>{date} · 02:{String(14 + Math.floor(s / 60)).padStart(2, "0")}:{String(s % 60).padStart(2, "0")}:{String(sec).padStart(2, "0")}</div>
      {[[60, 50], [W - 60, 50], [60, H - 50], [W - 60, H - 50]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x - (i % 2 ? 60 : 0), top: y - (i > 1 ? 60 : 0), width: 60, height: 60,
        borderLeft: i % 2 ? undefined : "4px solid #e8ffe8", borderRight: i % 2 ? "4px solid #e8ffe8" : undefined, borderTop: i < 2 ? "4px solid #e8ffe8" : undefined, borderBottom: i > 1 ? "4px solid #e8ffe8" : undefined }} />)}
      {lost > 0 && <div style={{ position: "absolute", inset: 0, opacity: lost, background: `repeating-radial-gradient(circle at ${50 + 30 * rnd(Math.floor(t * 24), 2)}% ${50 + 30 * rnd(Math.floor(t * 24), 5)}%, #222 0 2px, #9a9a9a 2px 3px, #444 3px 5px)` }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: H / 2 - 60, textAlign: "center", fontFamily: COND, fontWeight: 700, fontSize: 110, letterSpacing: 10, color: "#fff", textShadow: "0 0 20px #000" }}>SIGNAL LOST</div>
      </div>}
    </div>
  );
};

// ---------- lista que se tacha ----------
export const StrikeList: React.FC<{ t: number; b: number; items: { at: number; text: string; strike?: number }[]; x?: number; y?: number; size?: number }> = ({ t, b, items, x = 130, y = 320, size = 88 }) => {
  if (t < items[0].at || t > b) return null;
  const o = 1 - k01(t, b - 0.3, b);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o }}>
      {items.map((it, i) => {
        const k = easeOut(k01(t, it.at, it.at + 0.4)); if (k <= 0) return null;
        const s = it.strike != null ? ease(k01(t, it.strike, it.strike + 0.3)) : 0;
        return (
          <div key={i} style={{ position: "relative", fontFamily: COND, fontWeight: 700, fontSize: size, lineHeight: 1.12, letterSpacing: 4, color: "#fff", textShadow: shadow, opacity: k, transform: `translateX(${(1 - k) * -60}px)`, textTransform: "uppercase" }}>
            {it.text}
            {s > 0 && <div style={{ position: "absolute", left: -10, top: "52%", height: 12, width: `calc(${s * 100}% + 20px)`, background: RED2, boxShadow: `0 0 14px ${RED}` }} />}
          </div>
        );
      })}
    </div>
  );
};

// ---------- 300 figuras humanas que se apagan hasta quedar N (el número vive en la gente) ----------
const Fig: React.FC<{ x: number; y: number; s: number; c: string; o: number }> = ({ x, y, s, c, o }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={o}><circle cx={0} cy={-15} r={5} fill={c} /><path d="M-6,-8 L6,-8 L5,8 L2,8 L1,20 L-1,20 L-2,8 L-5,8 Z" fill={c} /></g>
);
// ZARPAZOS (19-oct, reemplaza la fila de muñequitos): la cifra rueda mientras garras de 4 uñas rasgan la foto; cada zarpazo = un tramo
// de los casos. keepAt: los zarpazos se apagan menos la fracción `keep` (quedan rojo vivo) y la cifra baja a `keep` con keepLabel.
export const Crowd: React.FC<{ t: number; a: number; b: number; n: number; keepAt?: number; keep?: number; label?: string; keepLabel?: string; cols?: number }> = ({ t, a, b, n, keepAt, keep = n, label, keepLabel }) => {
  if (t < a || t > b) return null;
  const o = 1 - k01(t, b - 0.3, b), G = 5, dur = Math.min(1.6, (b - a) * 0.5);
  const kept = keepAt != null ? ease(k01(t, keepAt, keepAt + 1.1)) : 0, nk = Math.max(1, Math.round(G * keep / n));
  const shown = Math.round(n * easeOut(k01(t, a, a + dur))), cnt = Math.round(lerp(n, keep, kept));
  // tajo afinado: 4 uñas, cada una un huso que se abre y se cierra a lo largo de una curva
  const claw = (x0: number, y0: number, ang: number, len: number, bend: number, wid: number, p: number) => {
    const N = 26, L: string[] = [], R: string[] = [], ca = Math.cos(ang), sa = Math.sin(ang);
    for (let i = 0; i <= N; i++) {
      const s = (i / N) * p, x = x0 + ca * len * s - sa * bend * Math.sin(Math.PI * s), y = y0 + sa * len * s + ca * bend * Math.sin(Math.PI * s);
      const w = wid * Math.pow(Math.sin(Math.PI * Math.min(1, s / Math.max(p, 0.001) * p + 0.0001)), 0.6) * (0.55 + 0.45 * Math.sin(Math.PI * s));
      L.push(`${(x - sa * w).toFixed(1)},${(y + ca * w).toFixed(1)}`); R.unshift(`${(x + sa * w).toFixed(1)},${(y - ca * w).toFixed(1)}`);
    }
    return "M" + L.join("L") + "L" + R.join("L") + "Z";
  };
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,.1), rgba(0,0,0,.65))" }} />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <defs><filter id="clawglow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14" /></filter>
          <linearGradient id="clawin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#2a0503" /><stop offset=".5" stopColor="#6e0f08" /><stop offset="1" stopColor="#1a0302" /></linearGradient></defs>
        {Array.from({ length: G }, (_, i) => {
          const at = a + 0.05 + (dur * i) / G, p = easeOut(k01(t, at, at + 0.14)); if (p <= 0) return null;
          const ang = (i % 2 ? 2.2 : 0.95) + (rnd(i, 7) - 0.5) * 0.5, len = 700 + rnd(i, 11) * 420, cx = 300 + rnd(i, 3) * 1300, cy = 140 + rnd(i, 5) * 300;
          const x0 = cx - Math.cos(ang) * len * 0.3, y0 = cy - Math.sin(ang) * len * 0.3, bend = (rnd(i, 13) - 0.5) * 140, live = i < nk, off = live || kept === 0 ? 1 : 1 - kept * 0.85;
          return <g key={i} opacity={off}>
            {[0, 1, 2, 3].map((u) => {
              const sh = (u - 1.5) * 52, ox = -Math.sin(ang) * sh, oy = Math.cos(ang) * sh, l = len * (u === 0 || u === 3 ? 0.78 : 1), st = (u === 0 || u === 3 ? 0.11 : 0) * len;
              const d = claw(x0 + ox + Math.cos(ang) * st, y0 + oy + Math.sin(ang) * st, ang, l, bend, u === 0 || u === 3 ? 11 : 15, p);
              return <g key={u}>
                <path d={d} fill={live && kept > 0 ? "#ff2a1a" : "#ff3b24"} opacity={0.5} filter="url(#clawglow)" />
                <path d={d} fill="url(#clawin)" stroke="#f3d6c4" strokeOpacity={0.85} strokeWidth={2} />
              </g>;
            })}
          </g>;
        })}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 110, textAlign: "center", color: kept > 0.5 ? RED2 : "#fff", textShadow: `0 0 40px rgba(0,0,0,.9), ${shadow}` }}>
        <div style={{ fontFamily: COND, fontWeight: 700, fontSize: 230, lineHeight: 0.9, letterSpacing: 4 }}>{(kept > 0 ? cnt : shown).toLocaleString("en-US")}</div>
        <div style={{ fontFamily: TYPE, fontSize: 42, color: PAPER, letterSpacing: 3, marginTop: 10 }}>{kept > 0.5 ? keepLabel : label}</div>
      </div>
    </div>
  );
};

// ---------- profundidad: regla que baja dentro del agua ----------
export const DepthRule: React.FC<{ t: number; a: number; b: number; max: number; unit?: string; marks?: { at: number; d: number; label: string }[]; x?: number }> = ({ t, a, b, max, unit = "M", marks = [], x = 1460 }) => {
  if (t < a || t > b) return null;
  const p = ease(k01(t, a + 0.2, a + 2.2)), o = 1 - k01(t, b - 0.3, b), top = 140, hh = 820, cur = Math.round(max * p);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o * k01(t, a, a + 0.3) }}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(0,20,30,0) 0%, rgba(0,10,16,${0.75 * p}) 100%)` }} />
      <svg width={W} height={H} style={{ position: "absolute", filter: "drop-shadow(0 0 6px #000)" }}>
        <line x1={x} y1={top} x2={x} y2={top + hh * p} stroke="#fff" strokeWidth={4} />
        {Array.from({ length: 31 }, (_, i) => i / 30 <= p && <line key={i} x1={x} y1={top + (hh * i) / 30} x2={x - (i % 5 ? 16 : 34)} y2={top + (hh * i) / 30} stroke="#fff" strokeWidth={2} />)}
        <circle cx={x} cy={top + hh * p} r={11} fill={RED2} />
      </svg>
      <div style={{ position: "absolute", left: x + 30, top: top + hh * p - 52, fontFamily: COND, fontWeight: 700, fontSize: 92, color: "#fff", textShadow: shadow }}>{cur.toLocaleString("en-US")}<span style={{ fontSize: 44, marginLeft: 10 }}>{unit}</span></div>
      {marks.map((m, i) => { const y = top + (hh * m.d) / max, k = easeOut(k01(t, m.at, m.at + 0.4)); return k > 0 && <div key={i} style={{ position: "absolute", right: W - x + 50, top: y - 22, fontFamily: TYPE, fontSize: 32, color: PAPER, textShadow: shadow, opacity: k, whiteSpace: "nowrap" }}>{m.label} ─</div>; })}
    </div>
  );
};

// ---------- reloj de 24 h: la misma hora, día tras día ----------
export const Routine: React.FC<{ t: number; a: number; b: number; hour?: number; days?: number; x?: number; y?: number; label?: string }> = ({ t, a, b, hour = 7, days = 12, x = 1420, y = 520, label = "SAME PLACE · SAME TIME" }) => {
  if (t < a || t > b) return null;
  const o = vis(t, a, b), r = 230, u = (t - a) / Math.max(0.5, b - a - 0.4), d = Math.floor(u * days), ang = ((hour / 24) * 360 - 90) * Math.PI / 180;
  const hand = (u * days * 360) % 360;
  return (
    <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2 + 120, opacity: o }}>
      <svg width={r * 2} height={r * 2} style={{ filter: "drop-shadow(0 0 10px rgba(0,0,0,.8))" }}>
        <circle cx={r} cy={r} r={r - 6} fill="rgba(8,9,10,.55)" stroke="#fff" strokeWidth={4} />
        {Array.from({ length: 24 }, (_, i) => { const q = (i / 24) * 2 * Math.PI - Math.PI / 2; return <line key={i} x1={r + Math.cos(q) * (r - 20)} y1={r + Math.sin(q) * (r - 20)} x2={r + Math.cos(q) * (r - (i % 6 ? 34 : 50))} y2={r + Math.sin(q) * (r - (i % 6 ? 34 : 50))} stroke="#fff" strokeWidth={i % 6 ? 2 : 4} />; })}
        {Array.from({ length: Math.min(d + 1, days) }, (_, i) => <circle key={i} cx={r + Math.cos(ang) * (r - 80 - i * 9)} cy={r + Math.sin(ang) * (r - 80 - i * 9)} r={7} fill={RED2} opacity={0.5 + 0.5 * (i === d ? 1 : 0)} />)}
        <line x1={r} y1={r} x2={r + Math.cos((hand - 90) * Math.PI / 180) * (r - 60)} y2={r + Math.sin((hand - 90) * Math.PI / 180) * (r - 60)} stroke={PAPER} strokeWidth={5} strokeLinecap="round" />
        <circle cx={r} cy={r} r={10} fill={PAPER} />
      </svg>
      <div style={{ textAlign: "center", fontFamily: COND, fontWeight: 700, fontSize: 52, color: "#fff", textShadow: shadow, marginTop: 10 }}>DAY {Math.min(d + 1, days)}</div>
      <div style={{ textAlign: "center", fontFamily: TYPE, fontSize: 30, color: PAPER, textShadow: shadow, whiteSpace: "nowrap" }}>{label}</div>
    </div>
  );
};

// ---------- medidor (fuerza de mordida) ----------
export const Gauge: React.FC<{ t: number; a: number; b: number; value: number; max: number; unit: string; caption?: string; x?: number; y?: number }> = ({ t, a, b, value, max, unit, caption, x = 1400, y = 560 }) => {
  if (t < a || t > b) return null;
  const o = vis(t, a, b), p = easeOut(k01(t, a + 0.2, a + 1.6)), v = value * p, r = 250;
  const A0 = 200, A1 = 340, ang = (A0 + (A1 - A0) * (v / max)) * Math.PI / 180;
  const arc = (from: number, to: number, rr: number) => { const a1 = from * Math.PI / 180, a2 = to * Math.PI / 180; return `M${r + Math.cos(a1) * rr},${r + Math.sin(a1) * rr} A${rr},${rr} 0 ${to - from > 180 ? 1 : 0} 1 ${r + Math.cos(a2) * rr},${r + Math.sin(a2) * rr}`; };
  return (
    <div style={{ position: "absolute", left: x - r, top: y - r, opacity: o }}>
      <svg width={r * 2} height={r * 1.35} style={{ overflow: "visible", filter: "drop-shadow(0 0 10px rgba(0,0,0,.9))" }}>
        <path d={arc(A0, A1, r - 20)} stroke="rgba(255,255,255,.25)" strokeWidth={26} fill="none" />
        <path d={arc(A0, A0 + (A1 - A0) * (v / max) + 0.01, r - 20)} stroke={RED2} strokeWidth={26} fill="none" style={{ filter: `drop-shadow(0 0 14px ${RED})` }} />
        <line x1={r} y1={r} x2={r + Math.cos(ang) * (r - 40)} y2={r + Math.sin(ang) * (r - 40)} stroke="#fff" strokeWidth={6} strokeLinecap="round" />
        <circle cx={r} cy={r} r={14} fill="#fff" />
      </svg>
      <div style={{ position: "absolute", left: 0, width: r * 2, top: r * 0.6, textAlign: "center", fontFamily: COND, fontWeight: 700, fontSize: 110, color: "#fff", textShadow: shadow }}>{Math.round(v).toLocaleString("en-US")}</div>
      <div style={{ position: "absolute", left: 0, width: r * 2, top: r * 1.08, textAlign: "center", fontFamily: TYPE, fontSize: 34, color: PAPER, textShadow: shadow }}>{unit}</div>
      {caption && <div style={{ position: "absolute", left: -100, width: r * 2 + 200, top: r * 1.3, textAlign: "center", fontFamily: TYPE, fontSize: 26, color: "#ddd", textShadow: shadow }}>{caption}</div>}
    </div>
  );
};

// ---------- 3 figuras, 2 en rojo (fracción que se pinta) ----------
export const Fraction: React.FC<{ t: number; a: number; b: number; n: number; red: number; label: string; x?: number; y?: number }> = ({ t, a, b, n, red, label, x = 1180, y = 330 }) => {
  if (t < a || t > b) return null;
  const o = vis(t, a, b);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o }}>
      <svg width={600} height={360} style={{ filter: "drop-shadow(0 0 12px rgba(0,0,0,.9))" }}>
        {Array.from({ length: n }, (_, i) => { const k = easeOut(k01(t, a + 0.15 * i, a + 0.15 * i + 0.4)), r = i < red ? k01(t, a + 0.9 + 0.3 * i, a + 1.1 + 0.3 * i) : 0;
          return <Fig key={i} x={100 + i * 200} y={210} s={7.2 * k} c={r > 0.5 ? RED2 : PAPER} o={k} />; })}
      </svg>
      <div style={{ fontFamily: COND, fontWeight: 700, fontSize: 64, color: "#fff", textShadow: shadow, textAlign: "center", width: 600, opacity: k01(t, a + 1.2, a + 1.5) }}>{label}</div>
    </div>
  );
};

// ---------- línea de tiempo que la cámara recorre (perspectiva) ----------
export const TimeRail: React.FC<{ t: number; a: number; b: number; ev: { at: number; y: string; text: string }[] }> = ({ t, a, b, ev }) => {
  if (t < a || t > b) return null;
  const o = vis(t, a, b);
  let i = 0; while (i < ev.length - 1 && t >= ev[i + 1].at) i++;
  const f = i < ev.length - 1 ? ease(k01(t, ev[i + 1].at - 0.5, ev[i + 1].at)) : 0, pos = i + f;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, perspective: 1100 }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,.15), rgba(0,0,0,.65))" }} />
      <div style={{ position: "absolute", left: W / 2, top: 640, transformStyle: "preserve-3d", transform: `rotateX(62deg) translateX(${-pos * 620}px)` }}>
        <div style={{ position: "absolute", left: -2000, top: -4, width: 8000, height: 8, background: `linear-gradient(90deg, transparent, ${PAPER} 20%, ${PAPER} 80%, transparent)` }} />
        {ev.map((e, n) => <div key={n} style={{ position: "absolute", left: n * 620 - 20, top: -20, width: 40, height: 40, borderRadius: 20, background: n <= i ? RED2 : PAPER, boxShadow: n <= i ? `0 0 26px ${RED}` : undefined }} />)}
      </div>
      {ev.map((e, n) => {
        const d = n - pos, k = 1 - Math.min(1, Math.abs(d) / 1.4); if (k <= 0) return null;
        return <div key={n} style={{ position: "absolute", left: W / 2 + d * 520 - 400, width: 800, top: 300 - 30 * (1 - k), textAlign: "center", opacity: k, transform: `scale(${0.75 + 0.25 * k})` }}>
          <div style={{ fontFamily: COND, fontWeight: 700, fontSize: 150, color: Math.abs(d) < 0.3 ? "#fff" : PAPER, textShadow: shadow, lineHeight: 1 }}>{e.y}</div>
          <div style={{ fontFamily: TYPE, fontSize: 40, color: PAPER, textShadow: shadow, marginTop: 10 }}>{e.text}</div>
        </div>;
      })}
    </div>
  );
};

// ---------- plano de la jaula-trampa (isométrico, se dibuja y la puerta cae) ----------
export const CageBlueprint: React.FC<{ t: number; a: number; b: number; drawAt?: number; dimAt?: number; camAt?: number; baitAt?: number; doorAt?: number }> = ({ t, a, b, drawAt = a + 0.2, dimAt, camAt, baitAt, doorAt }) => {
  if (t < a || t > b) return null;
  const o = vis(t, a, b), p = ease(k01(t, drawAt, drawAt + 1.4));
  // caja isométrica: largo 9 (eje x), ancho 1,6, alto 1,4 en "metros"; proyección simple
  const S = 120, ox = 330, oy = 690;
  const P = (x: number, y: number, z: number): [number, number] => [ox + x * S * 0.95 + y * S * 0.55, oy - z * S - y * S * 0.32 + x * S * -0.12];
  const L = 9.1, Wd = 1.7, Ht = 1.5;
  const edges: [number[], number[]][] = [];
  const c = [[0, 0, 0], [L, 0, 0], [L, Wd, 0], [0, Wd, 0], [0, 0, Ht], [L, 0, Ht], [L, Wd, Ht], [0, Wd, Ht]];
  [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]].forEach(([i, j]) => edges.push([c[i], c[j]]));
  const bars: [number[], number[]][] = [];
  for (let x = 0.6; x < L; x += 0.6) { bars.push([[x, 0, 0], [x, 0, Ht]]); bars.push([[x, 0, Ht], [x, Wd, Ht]]); }
  const door = doorAt != null ? easeIn(k01(t, doorAt, doorAt + 0.35)) : 0;
  const line = (e: [number[], number[]], k: number, key: string, col = "#9fd8ff", w = 3) => { const [x1, y1] = P(e[0][0], e[0][1], e[0][2]), [x2, y2] = P(e[1][0], e[1][1], e[1][2]); return <line key={key} x1={x1} y1={y1} x2={lerp(x1, x2, k)} y2={lerp(y1, y2, k)} stroke={col} strokeWidth={w} />; };
  const dz = Ht * (1 - door);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(4,18,34,.72)", backgroundImage: "linear-gradient(rgba(159,216,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(159,216,255,.12) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <svg width={W} height={H} style={{ position: "absolute", filter: "drop-shadow(0 0 6px rgba(159,216,255,.7))" }}>
        {edges.map((e, i) => line(e, k01(p, i / 14, i / 14 + 0.3), "e" + i))}
        {bars.map((e, i) => line(e, k01(p, 0.4 + i / bars.length * 0.5, 0.5 + i / bars.length * 0.5), "b" + i, "rgba(159,216,255,.6)", 2))}
        {/* puerta en la boca (x = 0): cae cuando entra el animal */}
        {p > 0.9 && <g>{[0.25, 0.5, 0.75, 1, 1.25, 1.5].map((y, i) => line([[0, y, dz], [0, y, dz + Ht * 0.98]], 1, "d" + i, door > 0.95 ? RED2 : "#ffffff", 4))}</g>}
        {dimAt != null && (() => { const k = ease(k01(t, dimAt, dimAt + 0.7)); const [x1, y1] = P(0, 0, -0.45), [x2, y2] = P(L, 0, -0.45);
          return <g opacity={k}><line x1={x1} y1={y1} x2={lerp(x1, x2, k)} y2={lerp(y1, y2, k)} stroke="#fff" strokeWidth={3} /><line x1={x1} y1={y1 - 16} x2={x1} y2={y1 + 16} stroke="#fff" strokeWidth={3} /><line x1={x2} y1={y2 - 16} x2={x2} y2={y2 + 16} stroke="#fff" strokeWidth={3} opacity={k > 0.95 ? 1 : 0} /></g>; })()}
        {baitAt != null && (() => { const [x, y] = P(L - 0.7, Wd / 2, 0.35), k = easeOut(k01(t, baitAt, baitAt + 0.4)); return <g opacity={k}><circle cx={x} cy={y} r={26} fill="none" stroke={RED2} strokeWidth={5} /><text x={x} y={y - 46} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={40} fill="#fff">BAIT</text></g>; })()}
        {camAt != null && (() => { const [x, y] = P(L - 0.2, 0.1, Ht + 0.15), k = easeOut(k01(t, camAt, camAt + 0.4)); return <g opacity={k}><rect x={x - 26} y={y - 18} width={52} height={36} rx={6} fill="#fff" /><circle cx={x - 26} cy={y} r={12} fill={RED2} /><text x={x + 40} y={y - 30} fontFamily={COND} fontWeight={700} fontSize={40} fill="#fff">INFRARED CAMERA</text></g>; })()}
      </svg>
      {dimAt != null && <div style={{ position: "absolute", left: 640, top: 830, fontFamily: COND, fontWeight: 700, fontSize: 92, color: "#fff", textShadow: shadow, opacity: k01(t, dimAt + 0.4, dimAt + 0.7) }}>≈ 30 FT <span style={{ fontFamily: TYPE, fontSize: 44, color: "#cfe9ff" }}>· 2,000 LB OF STEEL</span></div>}
      <div style={{ position: "absolute", left: 120, top: 90, fontFamily: TYPE, fontSize: 34, letterSpacing: 4, color: "#cfe9ff" }}>CAPTURE PLAN · RUZIZI RIVER · 2004</div>
      {door > 0.95 && <div style={{ position: "absolute", left: 190, top: 330, fontFamily: COND, fontWeight: 700, fontSize: 64, color: RED2, textShadow: shadow }}>DOOR DROPS</div>}
    </div>
  );
};

// ---------- barra de vida (edad de un cocodrilo del Nilo) ----------
export const LifeBar: React.FC<{ t: number; a: number; b: number; marks: { at: number; v: number; label: string; red?: boolean }[]; max?: number; range?: [number, number]; rangeAt?: number }> = ({ t, a, b, marks, max = 100, range, rangeAt }) => {
  if (t < a || t > b) return null;
  const o = vis(t, a, b), x0 = 200, w = 1520, y = 560, p = ease(k01(t, a, a + 0.8));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,.1), rgba(0,0,0,.6))" }} />
      <div style={{ position: "absolute", left: x0, top: y, width: w * p, height: 14, background: PAPER, boxShadow: "0 0 18px rgba(0,0,0,.8)" }} />
      {Array.from({ length: 11 }, (_, i) => i / 10 <= p && <div key={i} style={{ position: "absolute", left: x0 + (w * i) / 10 - 30, width: 60, top: y + 34, textAlign: "center", fontFamily: TYPE, fontSize: 28, color: PAPER, textShadow: shadow }}>{(max * i) / 10}</div>)}
      {range && rangeAt != null && <div style={{ position: "absolute", left: x0 + (w * range[0]) / max, top: y - 16, height: 46, width: ((w * (range[1] - range[0])) / max) * ease(k01(t, rangeAt, rangeAt + 0.7)), background: "rgba(255,59,48,.35)", border: `3px solid ${RED2}` }} />}
      {marks.map((m, i) => { const k = easeOut(k01(t, m.at, m.at + 0.45)); return k > 0 && <div key={i} style={{ position: "absolute", left: x0 + (w * m.v) / max - 200, width: 400, top: y - 190 + (1 - k) * 30, textAlign: "center", opacity: k }}>
        <div style={{ fontFamily: COND, fontWeight: 700, fontSize: 64, color: m.red ? RED2 : "#fff", textShadow: shadow, lineHeight: 1.05, whiteSpace: "pre-line" }}>{m.label}</div>
        <div style={{ margin: "8px auto 0", width: 4, height: 70, background: m.red ? RED2 : "#fff" }} />
      </div>; })}
      <div style={{ position: "absolute", left: x0, top: y + 90, fontFamily: TYPE, fontSize: 30, color: "#ddd", textShadow: shadow, opacity: p }}>AGE IN YEARS · NILE CROCODILE</div>
    </div>
  );
};

// ---------- tarjeta de fuente (libro / artículo) ----------
export const SourceCard: React.FC<{ t: number; a: number; b: number; kicker: string; title: string; sub?: string; quote?: string; x?: number; y?: number }> = ({ t, a, b, kicker, title, sub, quote, x = 1080, y = 260 }) => {
  if (t < a || t > b) return null;
  const k = easeOut(k01(t, a, a + 0.5)), o = 1 - k01(t, b - 0.3, b);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 680, opacity: o, transform: `translateY(${(1 - k) * 80}px) rotate(${lerp(-4, 1.5, k)}deg)`, filter: "drop-shadow(0 26px 34px rgba(0,0,0,.6))" }}>
      <div style={{ background: `linear-gradient(170deg, ${PAPER}, #d8ccb4)`, padding: "30px 38px", borderLeft: `14px solid ${RED}` }}>
        <div style={{ fontFamily: TYPE, fontSize: 26, color: "#6b5f4a", letterSpacing: 3 }}>{kicker}</div>
        <div style={{ fontFamily: SERIF, fontSize: 64, color: INK, lineHeight: 1.08, marginTop: 6 }}>{title}</div>
        {sub && <div style={{ fontFamily: TYPE, fontSize: 28, color: "#4a4234", marginTop: 8 }}>{sub}</div>}
        {quote && <div style={{ fontFamily: SERIF, fontSize: 40, color: RED, marginTop: 18, lineHeight: 1.2, opacity: k01(t, a + 0.5, a + 0.8) }}>“{quote}”</div>}
      </div>
    </div>
  );
};

// ---------- barras de letterbox (golpe de tráiler) ----------
export const Letterbox: React.FC<{ open: number }> = ({ open }) => {
  const h = 70 * (1 - open);
  return h <= 0 ? null : (<><div style={{ position: "absolute", left: 0, right: 0, top: 0, height: h, background: "#000" }} /><div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: h, background: "#000" }} /></>);
};

// ---------- crédito de foto/clip (chico, abajo a la derecha) ----------
export const Credit: React.FC<{ text: string; o: number }> = ({ text, o }) =>
  o <= 0 ? null : <div style={{ position: "absolute", right: 40, bottom: 28, fontFamily: SANS, fontSize: 18, color: "rgba(255,255,255,.75)", textShadow: "0 1px 4px #000", opacity: o }}>{text}</div>;

// ---------- lluvia sobre el plano ----------
export const Rain: React.FC<{ t: number; n?: number; op?: number }> = ({ t, n = 160, op = 0.55 }) => (
  <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, opacity: op }}>
    {Array.from({ length: n }, (_, i) => { const x = (rnd(i, 1) * W * 1.2 + t * 260) % (W * 1.2) - 100, y = ((rnd(i, 2) * H + t * (1400 + 600 * rnd(i, 3))) % (H + 200)) - 100;
      return <line key={i} x1={x} y1={y} x2={x - 14} y2={y + 46} stroke="#dfe9f0" strokeWidth={1.6} />; })}
  </svg>
);
// ---------- relámpago (destello) ----------
export const Flash: React.FC<{ t: number; at: number[] }> = ({ t, at }) => {
  const v = Math.max(0, ...at.map((a) => (t >= a && t < a + 0.35 ? (1 - (t - a) / 0.35) * (Math.sin((t - a) * 60) > -0.3 ? 1 : 0.3) : 0)));
  return v <= 0 ? null : <div style={{ position: "absolute", inset: 0, background: `rgba(230,240,255,${0.7 * v})`, mixBlendMode: "screen" }} />;
};

// ================= apex05 (osos) =================
// silueta de oso de perfil (mira a la derecha), caja 0..100 x 0..60, patas en y=60
const BEAR = "M6,34 C4,22 14,14 30,14 C40,12 50,8 58,10 C64,11 68,14 72,16 L75,11 L80,14 C85,16 91,20 97,25 C99,27 98,30 95,30 L86,31 C84,34 82,37 80,40 L82,60 L73,60 L70,45 C62,46 52,46 44,45 L43,60 L34,60 L31,46 C26,46 22,44 20,42 L22,60 L13,60 L11,44 C7,42 6,38 6,34 Z";
export const BearSil: React.FC<{ x: number; y: number; w: number; c: string; o?: number; flip?: boolean }> = ({ x, y, w, c, o = 1, flip }) => (
  <g transform={`translate(${x},${y}) scale(${(flip ? -1 : 1) * w / 100},${w / 100}) translate(0,-60)`} opacity={o}><path d={BEAR} fill={c} /></g>
);
export const BEARS = [
  { n: 8, name: "GIANT PANDA", kg: 100, c: "#EFE8DA" },
  { n: 7, name: "ANDEAN BEAR", kg: 140, c: "#EFE8DA" },
  { n: 6, name: "SUN BEAR", kg: 45, c: "#EFE8DA" },
  { n: 5, name: "POLAR BEAR", kg: 500, c: "#EFE8DA" },
  { n: 4, name: "AMERICAN BLACK BEAR", kg: 140, c: "#EFE8DA" },
  { n: 3, name: "BROWN BEAR", kg: 400, c: "#EFE8DA" },
  { n: 2, name: "ASIATIC BLACK BEAR", kg: 120, c: "#EFE8DA" },
  { n: 1, name: "SLOTH BEAR", kg: 110, c: "#EFE8DA" },
];
// las 8 especies en FILA REAL 2.5D (19-oct, v2): osos recortados de fotos reales, a escala de su alto verdadero, al lado de una
// persona de 1,75 m; piso en perspectiva, sombra y reflejo; el número del ranking va DETRÁS de cada oso (texto entre capas).
// mv = movimiento de cámara: "truck" recorre la fila · "push" plano entero que se acerca · "focus" viaja al/los resaltados · "back" recorre al revés
const CUT: Record<number, { f: string; h: number; iw: number; ih: number; flip?: boolean }> = {
  8: { f: "panda_a6546ceb", h: 0.95, iw: 223, ih: 287 }, 7: { f: "andean_c86b6f0e", h: 1.05, iw: 438, ih: 614 }, 6: { f: "sun_459602fb", h: 0.75, iw: 266, ih: 272 },
  5: { f: "polar_c93f8ae8", h: 1.55, iw: 272, ih: 197 }, 4: { f: "black_51e22c09", h: 0.95, iw: 213, ih: 125 }, 3: { f: "brown_cf754b45", h: 1.4, iw: 448, ih: 331, flip: true },
  2: { f: "moon_2337c1f6", h: 0.95, iw: 377, ih: 221 }, 1: { f: "sloth_8344d240", h: 0.95, iw: 346, ih: 236 },
};
const short = (n: string) => n.replace(" BEAR", "").replace("AMERICAN BLACK", "AM. BLACK").replace("ASIATIC BLACK", "MOON");
export const BearLineup: React.FC<{ t: number; a: number; b: number; hi?: number; set?: number[]; setAt?: number; showRank?: boolean; mystery?: number; title?: string; mv?: "truck" | "push" | "focus" | "back" }> = ({ t, a, b, hi, set, setAt = a, showRank, mystery, title, mv }) => {
  if (t < a || t > b) return null;
  const o = vis(t, a, b, 0.25, 0.25), PX = 330, base = 0, gap = 70;
  // mundo: persona primero, después los 8 (de #8 a #1)
  let x = 0; const man = { x: 0, w: 0.5 * PX, h: 1.75 * PX }; x += man.w + gap * 1.6;
  const L = BEARS.map((B) => { const c = CUT[B.n], h = c.h * PX, w = h * c.iw / c.ih, it = { B, c, x, w, h }; x += w + gap; return it; });
  const total = x - gap, kl = k01(t, a, b), k = ease(kl);
  const tgt = L.filter((l) => l.B.n === hi || (set ?? []).includes(l.B.n));
  const mode = mv ?? (tgt.length ? "focus" : "truck");
  const fitZ = (W - 160) / total;
  let cx: number, z: number;
  if (mode === "truck" || mode === "back") { const q = mode === "back" ? 1 - k : k; z = lerp(0.95, 1.05, k); cx = lerp(W / 2 / z - 40, total - W / 2 / z + 40, q); }
  else if (mode === "push") { z = lerp(fitZ, fitZ * 1.18, k); cx = total / 2; }
  else { const fx = tgt.length ? tgt.reduce((s, l) => s + l.x + l.w / 2, 0) / tgt.length : total / 2; const q = ease(k01(kl, 0.25, 1)); z = lerp(fitZ, Math.max(fitZ * 1.25, 1.05), q); cx = lerp(total / 2, fx, q); }
  const gy = 820; // línea del piso en pantalla
  const sx = (wx: number) => W / 2 + (wx - cx) * z;
  const horizon = 470, vx = W / 2 - (cx - total / 2) * z * 0.25;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(4,6,8,.78) 0%, rgba(4,6,8,.55) 42%, rgba(10,12,12,.92) 76%, rgba(4,5,6,.98) 100%)" }} />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <defs><linearGradient id="blfl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#fff" stopOpacity=".16" /></linearGradient></defs>
        {Array.from({ length: 31 }, (_, i) => { const u = (i - 15) * 260 - ((cx * z * 0.6) % 260); return <line key={i} x1={vx + u * 0.08} y1={horizon} x2={vx + u * 2.4} y2={H} stroke="url(#blfl)" strokeWidth={1.5} />; })}
        {[0, 1, 2, 3, 4, 5].map((i) => { const y = horizon + (H - horizon) * Math.pow(i / 5, 1.8); return <line key={"h" + i} x1={0} y1={y} x2={W} y2={y} stroke="#fff" strokeOpacity={0.05 + i * 0.02} strokeWidth={1} />; })}
        <line x1={0} y1={gy} x2={W} y2={gy} stroke={PAPER} strokeOpacity={0.35} strokeWidth={2} />
      </svg>
      {/* números del ranking DETRÁS de los osos */}
      {showRank && L.map((l, i) => { const ap = easeOut(k01(t, a + 0.25 + i * 0.1, a + 0.75 + i * 0.1)), isT = tgt.includes(l) || l.B.n === 1;
        return <div key={"n" + i} style={{ position: "absolute", left: sx(l.x + l.w / 2) - 300, width: 600, top: gy - l.h * z - 250 * z + (1 - ap) * 120, textAlign: "center", fontFamily: COND, fontWeight: 700,
          fontSize: 330 * z, lineHeight: 1, color: "transparent", WebkitTextStroke: `${3 * z}px ${isT ? RED2 : "rgba(239,232,218,.55)"}`, opacity: ap * (dimOf(l.B.n, t) ? 0.35 : 0.95) }}>{l.B.n}</div>; })}
      {/* persona de referencia */}
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <g transform={`translate(${sx(man.x + man.w / 2)},${gy}) scale(${(man.h * z) / 44})`} opacity={0.9}><circle cx={0} cy={-39} r={4.5} fill="#cfc8bb" /><path d="M-6,-33 L6,-33 L5,-16 L2,-16 L1,0 L-1,0 L-2,-16 L-5,-16 Z" fill="#cfc8bb" /></g>
      </svg>
      <div style={{ position: "absolute", left: sx(man.x + man.w / 2) - 100, width: 200, top: gy + 18, textAlign: "center", fontFamily: TYPE, fontSize: 24 * Math.min(1.2, z + 0.2), color: PAPER }}>YOU · 5'9"</div>
      {L.map((l, i) => {
        const ap = easeOut(k01(t, a + 0.1 + i * 0.09, a + 0.5 + i * 0.09)), X = sx(l.x), w = l.w * z, h = l.h * z, isMy = mystery === l.B.n, dim = dimOf(l.B.n, t), isT = tgt.includes(l);
        const flt = isMy ? "brightness(0) drop-shadow(0 0 2px rgba(255,255,255,.5))" : dim ? "grayscale(1) brightness(.45)" : isT ? `drop-shadow(0 0 14px ${RED2}) drop-shadow(0 0 3px ${RED2})` : "drop-shadow(0 10px 18px rgba(0,0,0,.6))";
        const img = { position: "absolute" as const, left: X, width: w, height: h, transform: l.c.flip ? "scaleX(-1)" : undefined };
        return <div key={i} style={{ position: "absolute", inset: 0, opacity: ap, transform: `translateY(${(1 - ap) * 50}px)` }}>
          <div style={{ position: "absolute", left: X - w * 0.05, top: gy - h * 0.06, width: w * 1.1, height: h * 0.12, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,0,0,.75), rgba(0,0,0,0) 70%)" }} />
          <Img src={staticFile(`apex05/cut/${l.c.f}.png`)} style={{ ...img, top: gy, transform: `${l.c.flip ? "scaleX(-1) " : ""}scaleY(-1)`, opacity: 0.16, filter: (isMy ? "brightness(0) " : "") + "blur(2px)", maskImage: "linear-gradient(to bottom, black, transparent 45%)", WebkitMaskImage: "linear-gradient(to bottom, black, transparent 45%)" }} />
          <Img src={staticFile(`apex05/cut/${l.c.f}.png`)} style={{ ...img, top: gy - h + 4, filter: flt }} />
          {isMy && <div style={{ position: "absolute", left: X, width: w, top: gy - h * 0.85, textAlign: "center", fontFamily: COND, fontWeight: 700, fontSize: h * 0.6, color: RED2, textShadow: shadow }}>?</div>}
          <div style={{ position: "absolute", left: X + w / 2 - 160, width: 320, top: gy + 18, textAlign: "center", fontFamily: TYPE, fontSize: 25 * Math.min(1.25, z + 0.25), letterSpacing: 2, color: isT ? RED2 : PAPER, opacity: dim ? 0.45 : 1, textShadow: shadow }}>{isMy ? "???" : short(l.B.name)}</div>
        </div>;
      })}
      {title && <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: COND, fontWeight: 700, fontSize: 84, letterSpacing: 6, color: "#fff", textShadow: shadow, transform: `translateY(${(1 - easeOut(k01(t, a, a + 0.5))) * -30}px)` }}>{title}</div>}
    </div>
  );
  function dimOf(n: number, tt: number) { return (hi != null && hi !== n) || (!!set && tt >= setAt && !set.includes(n)); }
};

// tarjeta de ranking: "#5 POLAR BEAR" + medidor de peligro que se llena hasta `danger` (0-10)
export const RankCard: React.FC<{ t: number; a: number; b: number; n: number; name: string; latin?: string; danger: number; note?: string; x?: number; y?: number }> = (p) => {
  const v = p.n % 3;  // 3 diseños que rotan con el puesto: nunca dos tarjetas seguidas iguales
  return v === 0 ? <RankA {...p} /> : v === 1 ? <RankB {...p} /> : <RankC {...p} />;
};
type RK = { t: number; a: number; b: number; n: number; name: string; latin?: string; danger: number; note?: string; x?: number; y?: number };
// B · centro: el número gigante calado (se ve el video a través), el nombre se escribe encima y el peligro es una barra que corre abajo
const RankB: React.FC<RK> = ({ t, a, b, n, name, latin, danger, note }) => {
  if (t < a || t > b) return null;
  const o = vis(t, a, b, 0.3, 0.3), k = easeOut(k01(t, a, a + 0.6)), fill = ease(k01(t, a + 0.5, a + 1.7)) * danger / 10, hot = n <= 2 ? RED2 : "#fff";
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,.55), rgba(0,0,0,.15) 70%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 40, textAlign: "center", fontFamily: COND, fontWeight: 700, fontSize: 620, lineHeight: 1, color: "transparent",
        WebkitTextStroke: `6px ${hot}`, opacity: 0.85, transform: `scale(${lerp(1.25, 1, k)})`, textShadow: "0 0 60px rgba(0,0,0,.5)" }}>{n}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", fontFamily: COND, fontWeight: 700, fontSize: 104, letterSpacing: 10, color: "#fff", textShadow: shadow }}>
        {name.slice(0, Math.ceil(name.length * k01(t, a + 0.2, a + 0.8)))}</div>
      {latin && <div style={{ position: "absolute", left: 0, right: 0, top: 690, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 40, color: PAPER, textShadow: shadow, opacity: k01(t, a + 0.6, a + 1) }}>{latin}</div>}
      <div style={{ position: "absolute", left: 460, width: 1000, top: 800, height: 14, background: "rgba(255,255,255,.18)" }}>
        <div style={{ width: `${fill * 100}%`, height: "100%", background: `linear-gradient(90deg, ${PAPER}, ${GOLD} 50%, ${RED2})`, boxShadow: `0 0 18px ${fill > 0.6 ? RED2 : GOLD}` }} />
      </div>
      <div style={{ position: "absolute", left: 460, width: 1000, top: 826, display: "flex", justifyContent: "space-between", fontFamily: TYPE, fontSize: 26, letterSpacing: 4, color: PAPER, textShadow: shadow }}>
        <span>HARMLESS</span><span>DANGER TO PEOPLE {Math.round(fill * 10)}/10</span><span style={{ color: RED2 }}>DEADLY</span></div>
      {note && <div style={{ position: "absolute", left: 0, right: 0, top: 890, textAlign: "center", fontFamily: TYPE, fontSize: 32, color: "#fff", textShadow: shadow, opacity: k01(t, a + 1.6, a + 2.0) }}>{note}</div>}
    </div>
  );
};
// C · expediente a la derecha: ficha que entra de costado con sello del puesto y medidor vertical de 10 garras
const RankC: React.FC<RK> = ({ t, a, b, n, name, latin, danger, note }) => {
  if (t < a || t > b) return null;
  const o = vis(t, a, b, 0.3, 0.3), k = easeOut(k01(t, a, a + 0.55)), fill = ease(k01(t, a + 0.5, a + 1.7)) * danger, st = easeOut(k01(t, a + 0.35, a + 0.6));
  return (
    <div style={{ position: "absolute", right: 110, top: 150, width: 720, opacity: o, transform: `translateX(${(1 - k) * 160}px)` }}>
      <div style={{ background: "rgba(10,8,6,.72)", border: `2px solid ${PAPER}`, padding: "34px 40px", boxShadow: "0 20px 60px rgba(0,0,0,.6)", position: "relative" }}>
        <div style={{ fontFamily: TYPE, fontSize: 26, letterSpacing: 6, color: PAPER }}>APEX FILES · RANK</div>
        <div style={{ fontFamily: COND, fontWeight: 700, fontSize: 92, lineHeight: 1.05, letterSpacing: 3, color: "#fff", marginTop: 10, paddingRight: 170 }}>{name}</div>
        {latin && <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 36, color: PAPER }}>{latin}</div>}
        <div style={{ display: "flex", gap: 10, marginTop: 30, alignItems: "flex-end", height: 120 }}>
          {Array.from({ length: 10 }, (_, i) => { const f = Math.min(1, Math.max(0, fill - i)); return (
            <div key={i} style={{ width: 44, height: 50 + i * 7, position: "relative", borderBottom: `2px solid ${PAPER}` }}>
              <div style={{ position: "absolute", left: 18, bottom: 0, width: 8, height: `${f * 100}%`, borderRadius: "8px 8px 2px 2px", background: i >= 7 ? RED2 : i >= 4 ? GOLD : PAPER, boxShadow: f > 0 && i >= 7 ? `0 0 14px ${RED2}` : undefined }} />
            </div>); })}
        </div>
        {note && <div style={{ marginTop: 18, fontFamily: TYPE, fontSize: 28, color: "#fff", opacity: k01(t, a + 1.6, a + 2.0) }}>{note}</div>}
        <div style={{ position: "absolute", right: -30, top: -60, width: 210, height: 210, borderRadius: 105, border: `8px solid ${n <= 2 ? RED2 : PAPER}`, display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: COND, fontWeight: 700, fontSize: 130, color: n <= 2 ? RED2 : PAPER, transform: `rotate(-12deg) scale(${lerp(2.2, 1, st)})`, opacity: st, background: "rgba(10,8,6,.6)" }}>#{n}</div>
      </div>
    </div>
  );
};
const RankA: React.FC<RK> = ({ t, a, b, n, name, latin, danger, note, x = 110, y = 180 }) => {
  if (t < a || t > b) return null;
  const o = vis(t, a, b, 0.3, 0.3), k = easeOut(k01(t, a, a + 0.5)), fill = ease(k01(t, a + 0.5, a + 1.8)) * danger;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translateX(${(1 - k) * -60}px)` }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 26 }}>
        <div style={{ fontFamily: COND, fontWeight: 700, fontSize: 260, lineHeight: 0.8, color: n <= 2 ? RED2 : "#fff", textShadow: `0 0 40px rgba(0,0,0,.7), ${shadow}` }}>#{n}</div>
        <div style={{ paddingBottom: 10 }}>
          <div style={{ fontFamily: COND, fontWeight: 700, fontSize: 84, lineHeight: 1, letterSpacing: 4, color: "#fff", textShadow: shadow }}>{name}</div>
          {latin && <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 38, color: PAPER, textShadow: shadow, marginTop: 6 }}>{latin}</div>}
        </div>
      </div>
      <div style={{ marginTop: 34, fontFamily: TYPE, fontSize: 28, letterSpacing: 4, color: PAPER, textShadow: shadow }}>DANGER TO PEOPLE</div>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        {Array.from({ length: 10 }, (_, i) => { const f = Math.min(1, Math.max(0, fill - i)); return (
          <div key={i} style={{ width: 54, height: 30, border: `2px solid ${PAPER}`, background: "rgba(0,0,0,.35)", position: "relative", boxShadow: "0 0 10px rgba(0,0,0,.6)" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${f * 100}%`, background: i >= 7 ? RED2 : i >= 4 ? GOLD : PAPER }} />
          </div>); })}
      </div>
      {note && <div style={{ marginTop: 16, fontFamily: TYPE, fontSize: 30, color: "#fff", textShadow: shadow, opacity: k01(t, a + 1.6, a + 2.0) }}>{note}</div>}
    </div>
  );
};

// comparación de tamaño: oso (de perfil) junto a una persona de 1,75 m; heightM = alto del oso parado
export const SizeVs: React.FC<{ t: number; a: number; b: number; heightM: number; label: string; standAt?: number; x?: number; cut?: string; flip?: boolean; ar?: number }> = ({ t, a, b, heightM, label, standAt, x = 1180, cut, flip, ar = 1.4 }) => {
  if (t < a || t > b) return null;
  const o = vis(t, a, b), base = 900, px = Math.min(260, 640 / Math.max(heightM, 1.75)); // px por metro (el más alto entra en 640 px)
  const st = standAt != null ? ease(k01(t, standAt, standAt + 0.8)) : 0;
  const bh = heightM * px * (0.45 + 0.55 * st), bw = Math.min(heightM * px * (1.2 - 0.75 * st), W - (x + 160) - 60);
  const g = easeOut(k01(t, a + 0.2, a + 0.9));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,0) 40%, rgba(0,0,0,.6) 100%)" }} />
      <svg width={W} height={H} style={{ position: "absolute", filter: "drop-shadow(0 0 8px rgba(0,0,0,.8))" }}>
        {Array.from({ length: Math.ceil(heightM) + 1 }, (_, m) => m).map((m) => <g key={m} opacity={0.5}><line x1={x - 60} y1={base - m * px} x2={x + 640} y2={base - m * px} stroke={PAPER} strokeWidth={1} strokeDasharray="6 8" /><text x={x + 650} y={base - m * px + 8} fontFamily={TYPE} fontSize={22} fill={PAPER}>{m} m</text></g>)}
        <g transform={`translate(${x},${base}) scale(${(1.75 * px) / 44})`}><circle cx={10} cy={-39} r={4.5} fill={PAPER} /><path d="M4,-33 L16,-33 L15,-16 L12,-16 L11,0 L9,0 L8,-16 L5,-16 Z" fill={PAPER} /></g>
        {!cut && <rect x={x + 160} y={base - bh * g} width={bw} height={bh * g} rx={bw * 0.18} fill={RED2} opacity={0.88} />}
      </svg>
      {cut && <><div style={{ position: "absolute", left: x + 140, top: base - 14, width: heightM * px * ar + 40, height: 30, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,0,0,.8), rgba(0,0,0,0) 70%)" }} />
        <Img src={staticFile(`apex05/cut/${cut}.png`)} style={{ position: "absolute", left: x + 160, top: base - heightM * px + 4, height: heightM * px, width: heightM * px * ar, opacity: g,
          transform: `${flip ? "scaleX(-1) " : ""}translateY(${(1 - g) * 40}px)`, filter: `drop-shadow(0 0 3px ${RED2}) drop-shadow(0 12px 20px rgba(0,0,0,.7))` }} /></>}
      <div style={{ position: "absolute", left: x + 160, top: (cut ? base - Math.max(heightM, 1.75) * px - 30 : base - bh * g) - 80, fontFamily: COND, fontWeight: 700, fontSize: 56, color: "#fff", textShadow: shadow, whiteSpace: "nowrap" }}>{label}</div>
    </div>
  );
};

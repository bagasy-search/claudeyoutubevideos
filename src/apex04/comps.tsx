// comps.tsx — gráficos de apex04 (Gustave). Todo por código, siempre encima de video que se mueve.
// Marca Apex Files: rojo expediente, papel, máquina de escribir (Special Elite), Oswald para golpes.
import React from "react";
import { Img, staticFile } from "remotion";
import { COND, SERIF, TYPE, SANS, RED, RED2, PAPER, INK, GOLD, W, H, k01, lerp, ease, easeOut, easeIn, rnd, shadow, interp } from "./lib";
export { interp, easeIn };

const vis = (t: number, a: number, b: number, fi = 0.35, fo = 0.3) => Math.min(easeOut(k01(t, a, a + fi)), 1 - k01(t, b - fo, b));

// ---------- palabra del tráiler (máx 4 palabras, sobre un golpe) ----------
type BW = { t: number; a: number; b: number; text: string; sub?: string; red?: boolean; y?: number; size?: number };
const BigWordA: React.FC<BW> = ({ t, a, b, text, sub, red, y = 540, size = 230 }) => {
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
type PL = { t: number; a: number; b: number; text: string; sub?: string; x?: number; y?: number };
const PlaceA: React.FC<PL> = ({ t, a, b, text, sub, x = 120, y = 800 }) => {
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

// ---------- v2: la palabra del tráiler rota entre 4 diseños (nunca el mismo look en bucle) ----------
const pick = (a: number, n: number) => Math.floor(rnd(Math.round(a * 10), 77) * n);
// B: golpe palabra por palabra, la última sobre un bloque rojo
const BigWordB: React.FC<BW> = ({ t, a, b, text, sub, red, y = 540, size = 230 }) => {
  if (t < a - 0.05 || t > b + 0.05) return null;
  const ws = text.split(" "), out = k01(t, b - 0.22, b), fs = Math.min(size * 0.9, 1650 / (text.length * 0.56));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, transform: "translateY(-50%)", textAlign: "center", opacity: 1 - out }}>
      <div style={{ display: "inline-flex", gap: fs * 0.22, alignItems: "center" }}>
        {ws.map((w, i) => {
          const k = easeOut(k01(t, a + i * 0.14, a + i * 0.14 + 0.32)), last = i === ws.length - 1 && ws.length > 1;
          const blk = easeOut(k01(t, a + i * 0.14 + 0.15, a + i * 0.14 + 0.45));
          return <div key={i} style={{ position: "relative", transform: `translateY(${(1 - k) * -70}px) scale(${lerp(1.6, 1, k)}) rotate(${(1 - k) * (i % 2 ? 6 : -6)}deg)`, opacity: Math.min(1, k * 2) }}>
            {last && <div style={{ position: "absolute", left: -16, right: -16, top: "8%", bottom: "4%", background: RED, transformOrigin: "left", transform: `scaleX(${blk}) skewX(-8deg)`, boxShadow: "0 0 40px rgba(196,22,28,.6)" }} />}
            <div style={{ position: "relative", fontFamily: COND, fontWeight: 700, fontSize: fs, lineHeight: 1.05, letterSpacing: 3, color: !last && red ? RED2 : "#fff", textTransform: "uppercase", textShadow: last ? "none" : shadow }}>{w}</div>
          </div>;
        })}
      </div>
      {sub && <div style={{ fontFamily: TYPE, fontSize: 38, letterSpacing: 5, color: PAPER, marginTop: 22, textShadow: shadow, opacity: k01(t, a + 0.5, a + 0.8) }}>{sub}</div>}
    </div>
  );
};
// C: letra hueca gigante que se llena de izquierda a derecha, corchetes de mira
const BigWordC: React.FC<BW> = ({ t, a, b, text, sub, red, y = 540, size = 230 }) => {
  if (t < a - 0.05 || t > b + 0.05) return null;
  const inn = easeOut(k01(t, a, a + 0.35)), fill = ease(k01(t, a + 0.15, a + 0.9)), out = k01(t, b - 0.22, b);
  const fs = Math.min(size * 1.05, 1650 / (text.length * 0.6)), col = red ? RED2 : "#fff", br = lerp(160, 0, inn);
  const st: React.CSSProperties = { fontFamily: COND, fontWeight: 700, fontSize: fs, lineHeight: 1, letterSpacing: lerp(30, 8, inn), textTransform: "uppercase", whiteSpace: "nowrap" };
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, transform: "translateY(-50%)", display: "flex", flexDirection: "column", alignItems: "center", opacity: (1 - out) * inn }}>
      <div style={{ position: "relative", padding: "24px 48px" }}>
        {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([px, py], i) => <div key={i} style={{ position: "absolute", width: 46, height: 46, [px ? "right" : "left"]: -br, [py ? "bottom" : "top"]: -br * 0.4, borderColor: RED2, borderStyle: "solid", borderWidth: `${py ? 0 : 6}px ${px ? 6 : 0}px ${py ? 6 : 0}px ${px ? 0 : 6}px` }} />)}
        <div style={{ ...st, color: "transparent", WebkitTextStroke: `3px ${col}`, filter: "drop-shadow(0 4px 18px rgba(0,0,0,.8))" }}>{text}</div>
        <div style={{ ...st, position: "absolute", left: 48, top: 24, color: col, clipPath: `inset(0 ${100 - fill * 100}% 0 0)`, textShadow: shadow }}>{text}</div>
      </div>
      {sub && <div style={{ fontFamily: TYPE, fontSize: 38, letterSpacing: 4, color: PAPER, background: "rgba(8,9,10,.72)", padding: "8px 22px", marginTop: 10, clipPath: `inset(0 ${100 - k01(t, a + 0.5, a + 1.0) * 100}% 0 0)` }}>{sub}</div>}
    </div>
  );
};
// D: dos mitades que se cierran sobre un tajo rojo
const BigWordD: React.FC<BW> = ({ t, a, b, text, sub, red, y = 540, size = 230 }) => {
  if (t < a - 0.05 || t > b + 0.05) return null;
  const k = easeOut(k01(t, a, a + 0.5)), cut = easeOut(k01(t, a, a + 0.3)), out = k01(t, b - 0.22, b);
  const fs = Math.min(size, 1700 / (text.length * 0.56)), col = red ? RED2 : "#fff", sl = (1 - k) * 260;
  const st: React.CSSProperties = { fontFamily: COND, fontWeight: 700, fontSize: fs, lineHeight: 1, letterSpacing: 6, color: col, textTransform: "uppercase", whiteSpace: "nowrap", textShadow: shadow, textAlign: "center" };
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, transform: "translateY(-50%)", opacity: 1 - out }}>
      <div style={{ position: "relative", height: fs }}>
        <div style={{ ...st, position: "absolute", left: 0, right: 0, clipPath: "inset(0 0 50% 0)", transform: `translateX(${-sl}px)`, opacity: k }}>{text}</div>
        <div style={{ ...st, position: "absolute", left: 0, right: 0, clipPath: "inset(50% 0 0 0)", transform: `translateX(${sl}px)`, opacity: k }}>{text}</div>
        <div style={{ position: "absolute", left: "50%", top: fs * 0.5 - 3, width: 1500 * cut, height: 6, transform: "translateX(-50%)", background: RED2, boxShadow: `0 0 24px ${RED2}`, opacity: 1 - k01(t, a + 0.3, a + 0.6) }} />
      </div>
      {sub && <div style={{ fontFamily: TYPE, fontSize: 38, letterSpacing: 6, color: PAPER, marginTop: 26, textAlign: "center", textShadow: shadow, opacity: k01(t, a + 0.45, a + 0.8) }}>{sub}</div>}
    </div>
  );
};
export const BigWord: React.FC<BW> = (p) => { const C = [BigWordA, BigWordB, BigWordC, BigWordD][pick(p.a, 4)]; return <C {...p} />; };

// ---------- v2: rótulo de lugar en 3 diseños ----------
// B: placa de expediente (fondo oscuro, pestaña roja, se revela por máscara)
const PlaceB: React.FC<PL> = ({ t, a, b, text, sub, x = 120, y = 800 }) => {
  if (t < a || t > b) return null;
  const k = easeOut(k01(t, a, a + 0.45)), r = ease(k01(t, a + 0.15, a + 0.7)), o = 1 - k01(t, b - 0.3, b);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translateX(${(1 - k) * -40}px)` }}>
      <div style={{ display: "flex", alignItems: "stretch", background: "rgba(10,10,11,.78)", boxShadow: "0 10px 40px rgba(0,0,0,.6)", clipPath: `inset(0 ${100 - r * 100}% 0 0)` }}>
        <div style={{ width: 14, background: RED }} />
        <div style={{ padding: "14px 30px 16px 22px" }}>
          <div style={{ fontFamily: TYPE, fontSize: 22, letterSpacing: 5, color: RED2 }}>CASE FILE · GUSTAVE</div>
          <div style={{ fontFamily: COND, fontWeight: 700, fontSize: 56, letterSpacing: 5, color: "#fff", textTransform: "uppercase", lineHeight: 1.05 }}>{text}</div>
          {sub && <div style={{ fontFamily: TYPE, fontSize: 28, color: PAPER, opacity: 0.9 }}>{sub}</div>}
        </div>
      </div>
    </div>
  );
};
// C: línea vertical que crece y el texto sube letra por letra
const PlaceC: React.FC<PL> = ({ t, a, b, text, sub, x = 120, y = 800 }) => {
  if (t < a || t > b) return null;
  const k = easeOut(k01(t, a, a + 0.4)), o = 1 - k01(t, b - 0.3, b);
  return (
    <div style={{ position: "absolute", left: x, top: y - 20, opacity: o, display: "flex", gap: 22, textShadow: shadow }}>
      <div style={{ width: 5, height: 150 * k, background: RED2, boxShadow: `0 0 14px ${RED2}` }} />
      <div>
        <div style={{ display: "flex", fontFamily: COND, fontWeight: 700, fontSize: 64, letterSpacing: 7, color: "#fff", textTransform: "uppercase", overflow: "hidden" }}>
          {text.split("").map((ch, i) => { const q = easeOut(k01(t, a + 0.1 + i * 0.025, a + 0.4 + i * 0.025)); return <span key={i} style={{ display: "inline-block", transform: `translateY(${(1 - q) * 80}px)`, opacity: q, whiteSpace: "pre" }}>{ch}</span>; })}
        </div>
        {sub && <div style={{ fontFamily: TYPE, fontSize: 30, letterSpacing: 3, color: PAPER, opacity: k01(t, a + 0.55, a + 0.9) }}>{sub}</div>}
      </div>
    </div>
  );
};
export const Place: React.FC<PL> = (p) => { const C = [PlaceA, PlaceB, PlaceC][pick(p.a + 0.3, 3)]; return <C {...p} />; };

// ---------- v2: Crowd = MURO DE MARCAS rayadas de a 5 (cada raya un muerto que le adjudican) ----------
const tally = (i: number, x: number, y: number, h: number) => {
  // 4 verticales y la 5ª cruzada; temblor de tiza
  const j = (s: number) => (rnd(i * 7 + s, 31) - 0.5) * h * 0.08;
  const g = i % 5, gx = x + g * h * 0.22;
  return g < 4 ? `M${gx + j(1)},${y + j(2)} L${gx + j(3)},${y + h + j(4)}` : `M${x - h * 0.12 + j(1)},${y + h * 0.78 + j(2)} L${x + h * 0.8 + j(3)},${y + h * 0.18 + j(4)}`;
};
export const Crowd: React.FC<{ t: number; a: number; b: number; n: number; keepAt?: number; keep?: number; label?: string; keepLabel?: string; cols?: number }> = ({ t, a, b, n, keepAt, keep = n, label, keepLabel }) => {
  if (t < a || t > b) return null;
  const o = 1 - k01(t, b - 0.3, b), groups = Math.ceil(n / 5), gc = 15, gr = Math.ceil(groups / gc);
  const gh = Math.min(84, 600 / gr), gw = 1440 / gc, x0 = (W - gw * gc) / 2 + 18, y0 = 270;
  const drawn = Math.floor(n * easeOut(k01(t, a + 0.1, a + Math.min(1.6, (keepAt ?? b) - a - 0.2))));
  const kept = keepAt != null ? k01(t, keepAt, keepAt + 1.2) : 0, cnt = Math.round(lerp(n, keep, ease(kept)));
  const dead = (i: number) => keepAt != null && i >= keep;
  const paths = (f: (i: number) => boolean) => Array.from({ length: Math.min(drawn, n) }, (_, i) => i).filter(f)
    .map((i) => tally(i, x0 + (Math.floor(i / 5) % gc) * gw, y0 + Math.floor(i / 5 / gc) * (gh + 22), gh)).join(" ");
  const head = drawn < n ? drawn : -1;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 55%, rgba(0,0,0,.82), rgba(0,0,0,.55))" }} />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <defs><filter id="chalk"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={3} /><feDisplacementMap in="SourceGraphic" scale={3} /></filter></defs>
        <g filter="url(#chalk)" strokeLinecap="round" fill="none">
          <path d={paths((i) => !dead(i))} stroke={kept > 0.3 ? RED2 : PAPER} strokeWidth={5} style={{ filter: kept > 0.3 ? `drop-shadow(0 0 8px ${RED})` : undefined }} />
          <path d={paths(dead)} stroke={PAPER} strokeWidth={5} strokeOpacity={lerp(1, 0.13, ease(kept))} />
        </g>
        {head >= 0 && (() => { const gx = x0 + (Math.floor(head / 5) % gc) * gw + (head % 5) * gh * 0.22, gy = y0 + Math.floor(head / 5 / gc) * (gh + 22); return <circle cx={gx} cy={gy + gh} r={9} fill={RED2} style={{ filter: `drop-shadow(0 0 10px ${RED2})` }} />; })()}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 80, textAlign: "center", fontFamily: COND, fontWeight: 700, fontSize: 120, color: kept > 0.5 ? RED2 : "#fff", textShadow: shadow, letterSpacing: 4 }}>
        {kept > 0 ? cnt : Math.min(drawn, n)}<span style={{ fontFamily: TYPE, fontSize: 40, color: PAPER, marginLeft: 22, letterSpacing: 2 }}>{kept > 0.5 ? keepLabel : label}</span>
      </div>
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
export const CrowdV1: React.FC<{ t: number; a: number; b: number; n: number; keepAt?: number; keep?: number; label?: string; keepLabel?: string; cols?: number }> = ({ t, a, b, n, keepAt, keep = n, label, keepLabel, cols = 25 }) => {
  if (t < a || t > b) return null;
  const o = 1 - k01(t, b - 0.3, b), rows = Math.ceil(n / cols), cw = 1280 / cols, ch = Math.min(64, 680 / rows);
  const shown = Math.floor(n * easeOut(k01(t, a, a + 1.4)));
  const order = Array.from({ length: n }, (_, i) => i).sort((p, q) => rnd(p, 9) - rnd(q, 9));
  const rank = new Map(order.map((v, i) => [v, i]));
  const kept = keepAt != null ? k01(t, keepAt, keepAt + 1.4) : 0;
  const cnt = Math.round(lerp(n, keep, ease(kept)));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 55%, rgba(0,0,0,.55), rgba(0,0,0,.2))" }} />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        {Array.from({ length: n }, (_, i) => {
          if (i >= shown) return null;
          const r = rank.get(i)!, dead = keepAt != null && r >= keep && r < keep + (n - keep) * ease(kept);
          return <Fig key={i} x={320 + (i % cols) * cw + cw / 2} y={250 + Math.floor(i / cols) * ch + ch / 2} s={ch / 44} c={dead ? "#555" : r < keep && kept > 0 ? RED2 : PAPER} o={dead ? 0.25 : 1} />;
        })}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: COND, fontWeight: 700, fontSize: 110, color: kept > 0.5 ? RED2 : "#fff", textShadow: shadow, letterSpacing: 4 }}>
        {kept > 0 ? cnt : shown}<span style={{ fontFamily: TYPE, fontSize: 40, color: PAPER, marginLeft: 22, letterSpacing: 2 }}>{kept > 0.5 ? keepLabel : label}</span>
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

// ---------- v2: ESCALA REAL — cocodrilo recortado (foto real) que crece de 4 m (Nilo típico) a 6 m (Gustave) junto a una persona ----------
export const CrocScale: React.FC<{ t: number; a: number; b: number; growAt: number }> = ({ t, a, b, growAt }) => {
  if (t < a || t > b) return null;
  const o = vis(t, a, b, 0.4, 0.3), PX = 245, base = 790, x0 = 150, ar = 463 / 107;
  const g = ease(k01(t, growAt, growAt + 1.1)), len = lerp(4, 6.1, g), cw = len * PX, ch = cw / ar;
  const enter = easeOut(k01(t, a, a + 0.7)), hu = easeOut(k01(t, a + 0.3, a + 0.9));
  const hh = 1.75 * PX, hx = x0 + 6.1 * PX + 90;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(5,8,9,.55), rgba(5,8,9,.85) 70%, rgba(5,8,9,.95))" }} />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <defs><linearGradient id="flr" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#C4161C" stopOpacity=".35" /><stop offset="1" stopColor="#C4161C" stopOpacity="0" /></linearGradient></defs>
        <rect x={0} y={base} width={W} height={H - base} fill="url(#flr)" opacity={0.5} />
        <line x1={x0} x2={x0 + 7 * PX * enter} y1={base + 40} y2={base + 40} stroke={PAPER} strokeWidth={3} />
        {Array.from({ length: 8 }, (_, m) => { const q = k01(t, a + 0.1 + m * 0.07, a + 0.3 + m * 0.07); return <g key={m} opacity={q}>
          <line x1={x0 + m * PX} x2={x0 + m * PX} y1={base + 28} y2={base + 58} stroke={PAPER} strokeWidth={3} />
          <text x={x0 + m * PX} y={base + 100} fill={PAPER} fontFamily={TYPE} fontSize={30} textAnchor="middle">{m} m</text></g>; })}
        <line x1={x0 + len * PX} x2={x0 + len * PX} y1={base - ch - 60} y2={base + 58} stroke={g > 0.02 ? RED2 : PAPER} strokeWidth={4} strokeDasharray="10 8" opacity={enter} />
        {g > 0 && <rect x={x0 + 4 * PX} y={base + 30} width={(len - 4) * PX} height={20} fill={RED2} opacity={0.85} />}
      </svg>
      <div style={{ position: "absolute", left: x0, top: base - ch + 6, width: cw, height: ch, transform: `translateX(${(1 - enter) * -300}px)`, opacity: enter,
        filter: `drop-shadow(0 18px 20px rgba(0,0,0,.7)) ${g > 0.3 ? `drop-shadow(0 0 ${14 * g}px rgba(255,59,48,.75))` : ""}` }}>
        <Img src={staticFile("apex04/cut/croc_07d46510.png")} style={{ width: "100%", height: "100%", transform: "scaleX(-1)" }} />
      </div>
      <svg width={W} height={H} style={{ position: "absolute", opacity: hu }}>
        <g transform={`translate(${hx},${base}) scale(${hh / 180})`} fill={PAPER} opacity={0.92}>
          <circle cx={0} cy={-166} r={14} /><path d="M-22,-148 L22,-148 L26,-80 L16,-80 L14,0 L3,0 L0,-70 L-3,0 L-14,0 L-16,-80 L-26,-80 Z" />
        </g>
        <text x={hx} y={base - hh - 24} fill={PAPER} fontFamily={TYPE} fontSize={28} textAnchor="middle">YOU · 1.75 m</text>
      </svg>
      <div style={{ position: "absolute", left: x0, top: 120, textShadow: shadow }}>
        <div style={{ fontFamily: TYPE, fontSize: 30, letterSpacing: 5, color: g > 0.5 ? RED2 : PAPER }}>{g > 0.5 ? "GUSTAVE · ESTIMATED" : "TYPICAL ADULT NILE CROCODILE"}</div>
        <div style={{ fontFamily: COND, fontWeight: 700, fontSize: 150, lineHeight: 1, color: g > 0.5 ? RED2 : "#fff" }}>{len.toFixed(1)} M<span style={{ fontSize: 64, color: PAPER, marginLeft: 26 }}>{Math.round(len * 3.281)} FT</span></div>
      </div>
    </div>
  );
};

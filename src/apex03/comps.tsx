// comps.tsx — gráficos de apex03 (todo por código, nada de IA).
import React from "react";
import { SANS, ROMAN, MONO, EMBER, EMBER2, ICE, RED, W, H, k01, lerp, ease, easeOut, easeIn, rnd, shadow, interp } from "./lib";

// ---------- palabra del tráiler (máx 4 palabras, sobre un golpe) ----------
export const BigWord: React.FC<{ t: number; a: number; b: number; text: string; sub?: string; hot?: boolean; y?: number }> = ({ t, a, b, text, sub, hot, y = 540 }) => {
  if (t < a - 0.05 || t > b + 0.05) return null;
  const inn = easeOut(k01(t, a, a + 0.5)), out = k01(t, b - 0.25, b);
  const track = lerp(60, 18, inn), sc = lerp(1.18, 1, inn) * (1 + 0.025 * k01(t, a, b));
  // una sola palabra larga no entra en 1920 a 210 px: achicar para que no se corte
  const fs = /\s/.test(text) ? (text.length > 36 ? 115 : text.length > 26 ? 128 : text.length > 20 ? 150 : 210) : Math.min(210, (1640 / text.length - 18) / 0.8);  // >20 letras: 2 renglones, no 3 cortados
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, transform: `translateY(-50%) scale(${sc})`, textAlign: "center", opacity: (1 - out) * Math.min(1, inn * 1.6), filter: `blur(${(1 - inn) * 10 + out * 6}px)` }}>
      <div style={{ fontFamily: ROMAN, fontWeight: 700, fontSize: fs * 1.15, letterSpacing: track * 0.5, color: hot ? RED : "#fff", textShadow: `0 0 40px ${hot ? "rgba(227,32,46,.45)" : "rgba(0,0,0,.6)"}, ${shadow}`, paddingLeft: track }}>{text}</div>
      {sub && <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 34, letterSpacing: 14, color: "#fff", opacity: 0.92, marginTop: 6, textShadow: shadow, paddingLeft: 14 }}>{sub}</div>}
    </div>
  );
};

// ---------- rótulo de lugar / fecha ----------
export const Place: React.FC<{ t: number; a: number; b: number; text: string; sub?: string; y?: number }> = ({ t, a, b, text, sub, y = 820 }) => {
  if (t < a || t > b) return null;
  const k = easeOut(k01(t, a, a + 0.6)), o = 1 - k01(t, b - 0.3, b);
  const n = Math.round(text.length * k01(t, a + 0.15, a + 0.75));
  return (
    <div style={{ position: "absolute", left: 120, top: y, opacity: o, color: "#fff", textShadow: shadow }}>
      <div style={{ width: 8, height: 120 * k, background: RED, position: "absolute", left: -26, top: 6 }} />
      <div style={{ fontFamily: ROMAN, fontWeight: 700, fontSize: 64, letterSpacing: 3, lineHeight: 1.05 }}>{text.slice(0, n)}<span style={{ opacity: n < text.length ? 1 : 0 }}>▍</span></div>
      {sub && <div style={{ fontFamily: SANS, fontWeight: 400, fontSize: 30, letterSpacing: 4, opacity: 0.9 * k01(t, a + 0.6, a + 0.9), marginTop: 4 }}>{sub}</div>}
    </div>
  );
};

// ---------- odómetro (dígitos que ruedan) ----------
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
export const Odo: React.FC<{ value: number; digits?: number; size: number; color?: string; comma?: boolean }> = ({ value, digits = 4, size, color = "#fff", comma }) => {
  const s: React.ReactNode[] = [];
  for (let d = digits - 1; d >= 0; d--) {
    const place = Math.pow(10, d), raw = value / place;
    // el dígito sigue al valor continuo, pero sólo gira cuando el de abajo pasa por 9 (como un odómetro real)
    const lower = (value % place) / place, base = Math.floor(raw), frac = d === 0 ? raw - base : Math.max(0, (lower - 0.85) / 0.15);
    s.push(<Digit key={d} v={base + frac} size={size} color={color} />);
    if (comma && d === 3) s.push(<span key="c" style={{ color }}>,</span>);
  }
  return <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: size, lineHeight: 1.05, letterSpacing: -2, display: "inline-flex", fontVariantNumeric: "tabular-nums" }}>{s}</span>;
};
export const Counter: React.FC<{ t: number; a: number; b: number; to: number; from?: number; dur?: number; digits?: number; kicker?: string; unit?: string; x?: number; y?: number; size?: number; hot?: boolean; comma?: boolean }> =
  ({ t, a, b, to, from = 0, dur = 1.1, digits = 4, kicker, unit, x = 120, y = 640, size = 190, hot, comma }) => {
    if (t < a || t > b) return null;
    const k = easeOut(k01(t, a, a + dur)), o = 1 - k01(t, b - 0.3, b);
    const v = lerp(from, to, k);
    return (
      <div style={{ position: "absolute", left: x, top: y, opacity: o * k01(t, a, a + 0.15), color: "#fff", textShadow: shadow, transform: `translateY(${(1 - easeOut(k01(t, a, a + 0.45))) * 40}px)` }}>
        {kicker && <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: 10, marginBottom: 6 }}>{kicker}</div>}
        <div style={{ display: "flex", alignItems: "flex-start", filter: `drop-shadow(0 4px 24px rgba(0,0,0,.6))` }}>
          <Odo value={v} digits={digits} size={size} color={hot ? EMBER2 : "#fff"} comma={comma} />
          {unit && <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: size * 0.42, marginLeft: 18, marginTop: size * 0.12, color: hot ? EMBER2 : "#fff" }}>{unit}</span>}
        </div>
      </div>
    );
  };

// ---------- filtro térmico (se aplica al plano) ----------
// luminancia → paleta de cámara térmica (negro, violeta, rojo, naranja, amarillo, blanco)
export const ThermalDefs: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <filter id="thermal" colorInterpolationFilters="sRGB">
      <feColorMatrix type="matrix" values="0.30 0.59 0.11 0 0  0.30 0.59 0.11 0 0  0.30 0.59 0.11 0 0  0 0 0 1 0" />
      <feComponentTransfer>
        <feFuncR type="table" tableValues="0.02 0.25 0.55 0.85 1 1 1" />
        <feFuncG type="table" tableValues="0.0 0.02 0.08 0.28 0.55 0.85 1" />
        <feFuncB type="table" tableValues="0.12 0.45 0.55 0.25 0.05 0.25 0.9" />
      </feComponentTransfer>
    </filter>
  </svg>
);
// lectura de temperatura con mira, pegada a un punto de la imagen
export const Readout: React.FC<{ t: number; a: number; b: number; x: number; y: number; label: string; value: string; hot?: boolean }> = ({ t, a, b, x, y, label, value, hot = true }) => {
  if (t < a || t > b) return null;
  const k = easeOut(k01(t, a, a + 0.4)), o = 1 - k01(t, b - 0.25, b), s = lerp(1.6, 1, k);
  const c = hot ? EMBER2 : ICE;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o * k }}>
      <div style={{ position: "absolute", left: -46 * s, top: -46 * s, width: 92 * s, height: 92 * s, border: `3px solid ${c}`, borderRadius: 6, boxShadow: `0 0 18px ${c}` }} />
      <div style={{ position: "absolute", left: -2, top: -16, width: 4, height: 32, background: c }} /><div style={{ position: "absolute", left: -16, top: -2, width: 32, height: 4, background: c }} />
      <div style={{ position: "absolute", left: 70, top: -58, whiteSpace: "nowrap", textShadow: shadow }}>
        <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 26, letterSpacing: 4, color: "#fff" }}>{label}</div>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 86, color: c, lineHeight: 1 }}>{value}</div>
      </div>
    </div>
  );
};
// barrido de la cámara térmica: línea que cruza la pantalla (lo de atrás de la línea ya es térmico)
export const ThermalScan: React.FC<{ t: number; a: number; d?: number }> = ({ t, a, d = 0.55 }) => {
  const k = k01(t, a, a + d); if (k <= 0 || k >= 1) return null;
  return <div style={{ position: "absolute", top: 0, bottom: 0, left: ease(k) * W - 3, width: 6, background: "#fff", boxShadow: `0 0 40px 12px ${EMBER}` }} />;
};

// ---------- partículas (nieve / brasas) ----------
export const Snow: React.FC<{ t: number; n?: number; wind?: number; op?: number; big?: boolean }> = ({ t, n = 140, wind = 0.35, op = 0.85, big }) => (
  <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
    {Array.from({ length: n }, (_, i) => {
      const z = rnd(i, 1), sp = 0.18 + z * 0.5, r = (big ? 3 : 1.5) + z * (big ? 7 : 4);
      const y = ((rnd(i, 2) + t * sp) % 1) * (H + 40) - 20, x = ((rnd(i, 3) + t * sp * wind + 0.02 * Math.sin(t * 2 + i)) % 1) * (W + 80) - 40;
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: r, height: r, borderRadius: r, background: "#fff", opacity: op * (0.35 + z * 0.65), filter: z < 0.3 ? "blur(1.5px)" : undefined }} />;
    })}
  </div>
);
export const Embers: React.FC<{ t: number; n?: number; op?: number }> = ({ t, n = 70, op = 1 }) => (
  <div style={{ position: "absolute", inset: 0, pointerEvents: "none", mixBlendMode: "screen" }}>
    {Array.from({ length: n }, (_, i) => {
      const z = rnd(i, 4), sp = 0.12 + z * 0.35, life = (rnd(i, 5) + t * sp) % 1;
      const x = rnd(i, 6) * W + 60 * Math.sin(t * 1.3 + i), y = H + 20 - life * (H + 60), r = 2 + z * 4;
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: r, height: r, borderRadius: r, background: z > 0.6 ? EMBER2 : EMBER, boxShadow: `0 0 ${6 + r * 2}px ${EMBER}`, opacity: op * Math.sin(Math.PI * life) }} />;
    })}
  </div>
);

// ---------- dentro vs afuera (pantalla partida en diagonal) ----------
export const TempSplit: React.FC<{ t: number; a: number; b: number; left: React.ReactNode; right: React.ReactNode }> = ({ t, a, b, left, right }) => {
  const k = ease(k01(t, a, a + 0.7)), o = k01(t, b - 0.3, b);
  const cut = lerp(110, 50, k);       // % donde corta la diagonal
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", inset: 0 }}>{left}</div>
      <div style={{ position: "absolute", inset: 0, clipPath: `polygon(${cut + 8 + o * 60}% 0, 100% 0, 100% 100%, ${cut - 8 + o * 60}% 100%)` }}>{right}</div>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <svg width={W} height={H}><line x1={(cut + 8 + o * 60) / 100 * W} y1={0} x2={(cut - 8 + o * 60) / 100 * W} y2={H} stroke="#fff" strokeWidth={4} style={{ filter: `drop-shadow(0 0 12px ${EMBER})` }} /></svg>
      </div>
    </div>
  );
};
export const TempTag: React.FC<{ t: number; a: number; b: number; x: number; y: number; kicker: string; value: number | string; unit?: string; cold?: boolean; to?: number }> = ({ t, a, b, x, y, kicker, value, unit = "°C", cold, to }) => {
  if (t < a || t > b) return null;
  const k = easeOut(k01(t, a, a + 0.5)), o = 1 - k01(t, b - 0.3, b), c = cold ? ICE : EMBER2;
  const shown = typeof value === "number" ? Math.round(lerp(to ?? 0, value, easeOut(k01(t, a, a + 1.2)))) : value;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o * k, color: "#fff", textShadow: shadow, transform: `translateX(${(1 - k) * (cold ? 60 : -60)}px)` }}>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 32, letterSpacing: 12 }}>{kicker}</div>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 200, lineHeight: 1, letterSpacing: -4, color: c, textShadow: `0 0 50px ${cold ? "rgba(159,216,255,.5)" : "rgba(255,138,43,.55)"}, ${shadow}` }}>{shown}<span style={{ fontSize: 90 }}>{unit}</span></div>
    </div>
  );
};

// ---------- termostato moderno (tramo "hoy") ----------
export const Thermostat: React.FC<{ t: number; a: number; b: number; value?: number }> = ({ t, a, b, value = 22 }) => {
  if (t < a || t > b) return null;
  const k = easeOut(k01(t, a, a + 0.6)), o = 1 - k01(t, b - 0.3, b);
  const arc = easeOut(k01(t, a + 0.2, a + 1.2)) * (value - 10) / 20;   // 10..30 °C
  const R = 210, C = 2 * Math.PI * R, sweep = 0.75;
  return (
    <div style={{ position: "absolute", left: W / 2 - 300, top: H / 2 - 300, width: 600, height: 600, opacity: o, transform: `scale(${lerp(0.7, 1, k)}) rotateX(${(1 - k) * 25}deg)`, filter: "drop-shadow(0 30px 60px rgba(0,0,0,.7))" }}>
      <div style={{ position: "absolute", inset: 40, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #3a3a40, #121216 70%)", border: "2px solid rgba(255,255,255,.12)" }} />
      <svg width={600} height={600} style={{ position: "absolute", inset: 0, transform: "rotate(135deg)" }}>
        <circle cx={300} cy={300} r={R} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth={14} strokeDasharray={`${C * sweep} ${C}`} strokeLinecap="round" />
        <circle cx={300} cy={300} r={R} fill="none" stroke={EMBER} strokeWidth={14} strokeDasharray={`${C * sweep * arc} ${C}`} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px ${EMBER})` }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff" }}>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 24, letterSpacing: 8, opacity: 0.7 }}>HEATING</div>
        <div style={{ fontFamily: SANS, fontWeight: 400, fontSize: 170, lineHeight: 1, letterSpacing: -6 }}>{(lerp(10, value, easeOut(k01(t, a + 0.2, a + 1.2)))).toFixed(1)}<span style={{ fontSize: 60, verticalAlign: "top" }}>°</span></div>
      </div>
    </div>
  );
};

// ---------- años que pasan ----------
export const YearRoll: React.FC<{ t: number; a: number; b: number; from: number; to: number; dur?: number; label?: string }> = ({ t, a, b, from, to, dur = 3.2, label }) => {
  if (t < a || t > b) return null;
  const k = ease(k01(t, a + 0.15, a + dur)), o = 1 - k01(t, b - 0.3, b), v = lerp(from, to, k);
  return (
    <div style={{ position: "absolute", right: 140, top: 250, textAlign: "right", opacity: o * k01(t, a, a + 0.2), color: "#fff", textShadow: shadow }}>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: 12, color: ICE }}>{label}</div>
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-start" }}>
        <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 60, marginRight: 18, marginTop: 30 }}>AD</span>
        <Odo value={v} digits={4} size={170} />
      </div>
      <div style={{ marginLeft: "auto", marginTop: 10, width: 520, height: 6, background: "rgba(255,255,255,.2)" }}><div style={{ width: `${k * 100}%`, height: 6, background: ICE, boxShadow: `0 0 12px ${ICE}` }} /></div>
    </div>
  );
};

// ---------- calor que se va por la chimenea ----------
export const HeatUp: React.FC<{ t: number; a: number; b: number; x?: number; label?: string }> = ({ t, a, b, x = W * 0.5, label }) => {
  if (t < a || t > b) return null;
  const o = k01(t, a, a + 0.3) * (1 - k01(t, b - 0.3, b));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      {[0, 1, 2, 3, 4].map((i) => {
        const life = ((t - a) * 0.9 + i / 5) % 1, y = H * 0.85 - life * H * 0.85;
        return <svg key={i} width={200} height={90} style={{ position: "absolute", left: x - 100, top: y, opacity: Math.sin(Math.PI * life) }}>
          <polyline points="20,80 100,15 180,80" fill="none" stroke={EMBER2} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 14px ${EMBER})` }} /></svg>;
      })}
      {label && <div style={{ position: "absolute", left: x + 130, top: H * 0.42, fontFamily: SANS, fontWeight: 800, fontSize: 52, letterSpacing: 8, color: "#fff", textShadow: shadow }}>{label}</div>}
    </div>
  );
};

export const Credit: React.FC<{ text: string; o: number }> = ({ text, o }) =>
  <div style={{ position: "absolute", right: 40, bottom: 150, opacity: o * 0.8, fontFamily: SANS, fontWeight: 400, fontSize: 18, color: "#fff", textShadow: shadow }}>{text}</div>;

// franjas de cine 2,39:1 del tráiler; `open` 0→1 las abre
export const Letterbox: React.FC<{ open: number }> = ({ open }) => {
  const h = 132 * (1 - easeIn(open));
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: h, background: "#000" }} />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: h, background: "#000" }} />
  </>;
};
export { interp, easeIn };

// ---------- lista "NO FIRE · NO FLAME · NO SMOKE · NO CHIMNEY": cada renglón entra en su palabra y se tacha ----------
export const NoList: React.FC<{ t: number; items: { at: number; text: string }[]; b: number; x?: number; y?: number }> = ({ t, items, b, x = 130, y = 330 }) => {
  if (t < items[0].at - 0.05 || t > b + 0.05) return null;
  const out = k01(t, b - 0.3, b);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: 1 - out }}>
      {items.map((it, n) => {
        const k = easeOut(k01(t, it.at, it.at + 0.35)), st = easeOut(k01(t, it.at + 0.3, it.at + 0.55));
        return <div key={n} style={{ position: "relative", height: 118, opacity: k, transform: `translateX(${(1 - k) * -40}px)` }}>
          <span style={{ fontFamily: ROMAN, fontWeight: 800, fontSize: 96, letterSpacing: 10, color: "#fff", textShadow: `0 0 30px rgba(0,0,0,.6), ${shadow}` }}>{it.text}</span>
          <div style={{ position: "absolute", left: -10, top: 58, height: 8, width: `calc(${st * 100}% + 20px)`, maxWidth: 900, background: EMBER, boxShadow: `0 0 18px ${EMBER}` }} />
        </div>;
      })}
    </div>
  );
};

// ---------- anillo que marca algo dentro del clip y lo tacha (p. ej. el brasero del rincón) ----------
export const StrikeRing: React.FC<{ t: number; a: number; b: number; x: number; y: number; r?: number; label?: string }> = ({ t, a, b, x, y, r = 110, label }) => {
  if (t < a || t > b) return null;
  const g = easeOut(k01(t, a, a + 0.4)), s = easeOut(k01(t, a + 0.45, a + 0.8)), o = 1 - k01(t, b - 0.25, b);
  const d = r * 0.62;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <circle cx={x} cy={y} r={r * g} fill="none" stroke="#fff" strokeWidth={5} style={{ filter: `drop-shadow(0 0 10px ${EMBER})` }} />
        <circle cx={x} cy={y} r={r * 1.22 * g} fill="none" stroke="rgba(255,255,255,.45)" strokeWidth={2} strokeDasharray="10 12" />
        <line x1={x - d} y1={y - d} x2={x - d + 2 * d * s} y2={y - d + 2 * d * s} stroke={EMBER} strokeWidth={10} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 12px ${EMBER})` }} />
      </svg>
      {label && <div style={{ position: "absolute", left: x + r * 1.35 + 16, top: y - 26, fontFamily: SANS, fontWeight: 800, fontSize: 40, letterSpacing: 6, color: "#fff", textShadow: shadow, opacity: k01(t, a + 0.3, a + 0.6) }}>{label}</div>}
    </div>
  );
};

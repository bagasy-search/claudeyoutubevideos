// c23 · "23 Arreglos de $2" — MINUTO 1 coreografiado a mano (0 → 62,6 s de la voz Fish claudio_definitiva).
// Gramática del minuto 1 de Fortune: un solo plano-secuencia, cámara que nunca se queda quieta sobre un mundo
// persistente (La Casa de $2), cada frase = un movimiento nuevo, piezas que saltan ancladas al mundo, sin subtítulos.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, interpolate, spring, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadSerif } from "@remotion/google-fonts/PlayfairDisplay";
import words from "./words.json";
import { WW, WH, GROUND, C, Sky, Ground, House, Front } from "./house";
import { PINS, FLIPS, FLIP_T, SFX } from "./sfx";

const { fontFamily: SANS } = loadFont("normal", { weights: ["700", "800", "900"] });
const { fontFamily: SERIF } = loadSerif("normal", { weights: ["700", "900"] });
const FPS = 30;
const ease = Easing.bezier(0.65, 0, 0.35, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pop = (f: number, t0: number, damping = 11) => spring({ frame: f - t0 * FPS, fps: FPS, config: { damping, stiffness: 180, mass: 0.6 } });
const fadeOut = (t: number, t1: number, d = 0.3) => interpolate(t, [t1 - d, t1], [1, 0], clamp);
const vis = (t: number, t0: number, t1: number) => t >= t0 - 0.05 && t <= t1 + 0.05;
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

// ───────────── puntos del mundo ─────────────
const P = {
  gotera: [1900, 900], cano: [2840, 1905], hormigas: [2480, 1984], moho: [1395, 1190], oxido: [4030, 1770], grieta: [1745, 1715],
  claudio1: [905, 1740], claudio2: [3640, 1700], bench: [3800, 1812], techo: [2300, 800], garaje: [3720, 1720],
} as const;


// ───────────── CÁMARA: [t, x, y, zoom] — entre llaves cercanas siempre hay deriva ─────────────
const KEYS: [number, number, number, number][] = [
  [0.0, 905, 1735, 2.55], [1.3, 925, 1718, 2.4],
  [2.15, 1900, 975, 1.55], [4.85, 1930, 960, 1.72], // gotera + albañil
  [5.6, 2790, 1880, 1.95], [8.75, 2770, 1890, 2.12], // caño + plomero
  [9.2, 2480, 1945, 2.3], [10.0, 2530, 1940, 2.4], // hormigas
  [10.35, 1440, 1240, 2.2], [10.62, 1450, 1250, 2.32], // moho
  [10.95, 3990, 1760, 1.95], [11.25, 3985, 1755, 2.05], // óxido
  [11.6, 1720, 1720, 1.95], [13.35, 1700, 1715, 2.15], // grieta + invierno
  [14.45, 2300, 1330, 0.42], [16.0, 2280, 1320, 0.44], [19.5, 2290, 1330, 0.46], [21.9, 2270, 1320, 0.43], // la casa entera
  [22.9, 2280, 1350, 0.48], [25.4, 2360, 1350, 0.51], // los 23
  [26.05, 2300, 900, 1.05], [26.95, 3700, 1700, 1.05], // techo → garaje
  [28.1, 3150, 1480, 0.62], [32.6, 3200, 1500, 0.66], [36.5, 3420, 1640, 1.15], // el número
  [37.45, 3650, 1705, 2.45], [44.35, 3665, 1710, 2.65], // Claudio en el taller
  [45.25, 3790, 1795, 3.2], [57.1, 3795, 1795, 3.35], // el manual sobre el banco
  [58.2, 3520, 1620, 1.25], [59.85, 3300, 1480, 0.8], // "mi propio taller"
  [61.0, 2020, 930, 1.5], [62.75, 2000, 925, 1.62], // la página vuela al techo
];
function cam(t: number) {
  let i = 0;
  while (i < KEYS.length - 2 && t > KEYS[i + 1][0]) i++;
  const a = KEYS[i], b = KEYS[i + 1];
  const k = ease(Math.min(1, Math.max(0, (t - a[0]) / (b[0] - a[0]))));
  const z = Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), k));
  const dist = Math.hypot(b[1] - a[1], b[2] - a[2]) * Math.min(a[3], b[3]);
  const arc = dist > 1200 ? 1 - 0.32 * Math.sin(Math.PI * k) : 1; // en vuelos largos se aleja a mitad de camino
  return { x: lerp(a[1], b[1], k), y: lerp(a[2], b[2], k), z: z * arc };
}
type Cam = ReturnType<typeof cam>;
const proj = (c: Cam, wx: number, wy: number): [number, number] => [(wx - c.x) * c.z + 960, (wy - c.y) * c.z + 540];

// ───────────── problemas (dentro del mundo) ─────────────
const Drips: React.FC<{ t: number; x: number; y0: number; y1: number; t0: number; period?: number; color?: string }> = ({ t, x, y0, y1, t0, period = 0.85, color = "#3f8fd4" }) => {
  if (t < t0) return null;
  return (
    <g>
      {[0, 1, 2].map((i) => {
        const p = ((t - t0) / period + i / 3) % 1;
        const y = y0 + (y1 - y0) * p * p;
        return <path key={i} d={`M ${x} ${y - 22} Q ${x + 13} ${y} ${x} ${y + 10} Q ${x - 13} ${y} ${x} ${y - 22} Z`} fill={color} opacity={p < 0.95 ? 1 : 0} />;
      })}
      <ellipse cx={x} cy={y1 + 6} rx={20 + 14 * Math.abs(Math.sin((t - t0) * 7))} ry={5} fill={color} opacity={0.35} />
    </g>
  );
};
const Ants: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  if (t < t0) return null;
  const k = interpolate(t, [t0, t0 + 0.5], [0, 1], clamp);
  return (
    <g>
      {Array.from({ length: 16 }).map((_, i) => {
        const x = 2330 + (((t - t0) * 70 + i * 26) % 420);
        const y = 1988 - Math.sin(i * 1.7) * 3;
        const leg = Math.sin((t * 20 + i) * 2) * 3;
        return (
          <g key={i} transform={`translate(${x},${y})`} opacity={k}>
            <ellipse cx={-9} cy={0} rx={7} ry={5} fill="#2a1a12" /><ellipse cx={1} cy={0} rx={5} ry={4} fill="#2a1a12" /><circle cx={9} cy={-1} r={4.5} fill="#2a1a12" />
            <path d={`M -4 2 l ${-4 + leg} 6 M 1 2 l ${leg} 6 M 5 2 l ${4 - leg} 6`} stroke="#2a1a12" strokeWidth={2} />
          </g>
        );
      })}
    </g>
  );
};
const Mold: React.FC<{ t: number; t0: number; fixed: number }> = ({ t, t0, fixed }) => {
  if (t < t0) return null;
  const k = interpolate(t, [t0, t0 + 0.7], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) }) * (1 - fixed);
  return (
    <g opacity={0.85}>
      {Array.from({ length: 34 }).map((_, i) => {
        const a = i * 2.4, r = 14 + (i * 23) % 120;
        return <circle key={i} cx={1320 + Math.abs(Math.cos(a)) * r} cy={1115 + Math.abs(Math.sin(a)) * r * 0.8} r={(6 + (i % 5) * 4) * k} fill={i % 3 ? "#26321f" : "#3c4a2a"} />;
      })}
    </g>
  );
};
const Rust: React.FC<{ t: number; t0: number; fixed: number }> = ({ t, t0, fixed }) => {
  if (t < t0) return null;
  const k = interpolate(t, [t0, t0 + 0.6], [0, 1], clamp) * (1 - fixed);
  return (
    <g>
      {[[3970, 1700, 60], [4060, 1820, 80], [3990, 1900, 55], [4090, 1640, 40], [4020, 1960, 70]].map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx={r * k} ry={r * 0.7 * k} fill={i % 2 ? "#a4521f" : "#c06a2a"} opacity={0.85} />
      ))}
    </g>
  );
};
const CRACK = "M 1745 1600 L 1730 1640 L 1758 1672 L 1737 1712 L 1764 1748 L 1744 1790 L 1760 1830";
const Crack: React.FC<{ t: number; fixed: number }> = ({ t, fixed }) => {
  if (t < 11.3) return null;
  // se abre, se tapa (11,95) y vuelve a abrirse con el invierno (12,45)
  const open = interpolate(t, [11.3, 11.75], [0, 1], clamp) * (t < 11.95 ? 1 : 0) + interpolate(t, [12.45, 13.0], [0, 1], clamp);
  const patch = interpolate(t, [11.95, 12.15], [0, 1], clamp) * (t < 12.45 ? 1 : interpolate(t, [12.45, 12.7], [1, 0], clamp));
  const L = 260;
  return (
    <g>
      <path d={CRACK} fill="none" stroke="#fff6e4" strokeWidth={26} strokeOpacity={patch} strokeLinecap="round" />
      <path d={CRACK} fill="none" stroke="#3b2a1d" strokeWidth={9} strokeDasharray={L} strokeDashoffset={L * (1 - Math.min(1, open))} strokeLinejoin="round" opacity={1 - fixed} />
    </g>
  );
};

// ───────────── capa de pantalla ─────────────
const Tag: React.FC<{ c: Cam; f: number; t: number; at: readonly number[]; t0: number; t1: number; text: string; dx?: number; dy?: number; bg?: string; size?: number }> = ({ c, f, t, at, t0, t1, text, dx = 0, dy = 0, bg = "#111", size = 32 }) => {
  if (!vis(t, t0, t1)) return null;
  const [x, y] = proj(c, at[0], at[1]);
  const s = pop(f, t0) * fadeOut(t, t1);
  return (
    <div style={{ position: "absolute", left: x + dx, top: y + dy, transform: `translate(-50%,-50%) scale(${s})`, background: bg, color: "#fff", fontFamily: SANS, fontWeight: 900, fontSize: size, letterSpacing: 1, padding: "7px 18px 8px", borderRadius: 8, border: "3px solid rgba(255,255,255,.9)", boxShadow: "0 8px 20px rgba(0,0,0,.4)", whiteSpace: "nowrap", textTransform: "uppercase" }}>
      {text}
    </div>
  );
};
// etiqueta de precio (ticket) colgada del mundo
const PriceTicket: React.FC<{ c: Cam; f: number; t: number; at: readonly number[]; t0: number; t1: number; who: string; price: string; note: string; dx?: number; dy?: number }> = ({ c, f, t, at, t0, t1, who, price, note, dx = 0, dy = 0 }) => {
  if (!vis(t, t0, t1)) return null;
  const [x, y] = proj(c, at[0], at[1]);
  const s = pop(f, t0, 9) * fadeOut(t, t1);
  const sw = Math.sin((f - t0 * FPS) / 9) * 2.5 * Math.exp(-(t - t0) * 1.2);
  return (
    <div style={{ position: "absolute", left: x + dx, top: y + dy, transform: `translate(-50%,-50%) rotate(${-5 + sw}deg) scale(${s})`, transformOrigin: "50% 0", fontFamily: SANS }}>
      <div style={{ background: C.paper, border: `4px solid ${C.ink}`, borderRadius: 14, padding: "16px 30px 18px", boxShadow: "0 16px 34px rgba(0,0,0,.45)", textAlign: "center", minWidth: 270 }}>
        <div style={{ fontWeight: 800, fontSize: 24, letterSpacing: 3, color: C.ink, opacity: 0.8 }}>{who}</div>
        <div style={{ fontWeight: 900, fontSize: 86, lineHeight: 1, color: C.accent, margin: "4px 0 2px" }}>{price}</div>
        <div style={{ fontWeight: 800, fontSize: 24, color: C.ink, borderTop: `2px dashed ${C.ink}55`, paddingTop: 8 }}>{note}</div>
      </div>
    </div>
  );
};
const BigWord: React.FC<{ f: number; t: number; t0: number; t1: number; children: React.ReactNode; y?: number; size?: number }> = ({ f, t, t0, t1, children, y = 160, size = 130 }) => {
  if (!vis(t, t0, t1)) return null;
  const s = pop(f, t0, 8) * fadeOut(t, t1, 0.25);
  return (
    <div style={{ position: "absolute", left: 960, top: y, transform: `translate(-50%,-50%) scale(${s})`, fontFamily: SANS, fontWeight: 900, fontSize: size, color: "#fff", letterSpacing: 2, whiteSpace: "nowrap", textShadow: "0 5px 0 #1b1b1b, 0 10px 26px rgba(0,0,0,.55)" }}>{children}</div>
  );
};
// anillo que marca un problema: rojo pulsando → verde con tilde cuando aparece el $2
const Ring: React.FC<{ c: Cam; f: number; t: number; at: readonly number[]; t0: number; t1: number; fixAt: number }> = ({ c, f, t, at, t0, t1, fixAt }) => {
  if (!vis(t, t0, t1)) return null;
  const [x, y] = proj(c, at[0], at[1]);
  const s = pop(f, t0, 10) * fadeOut(t, t1);
  const ok = t >= fixAt;
  const r = 46 + (ok ? 0 : 6 * Math.sin(f / 4));
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${s * (ok ? pop(f, fixAt, 8) * 0.25 + 0.85 : 1)})` }}>
      <div style={{ width: r * 2, height: r * 2, borderRadius: "50%", border: `7px solid ${ok ? "#3bbf5a" : "#e3261c"}`, background: ok ? "#3bbf5a" : "rgba(227,38,28,.18)", boxShadow: `0 0 22px ${ok ? "#3bbf5a" : "#e3261c"}`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: SANS, fontWeight: 900, fontSize: 56 }}>
        {ok ? "✓" : "!"}
      </div>
    </div>
  );
};
// la moneda de $2 → $1 → $0
const Coin: React.FC<{ f: number; t: number }> = ({ f, t }) => {
  if (!vis(t, 16.1, 19.75)) return null;
  const s = pop(f, 16.1, 9) * fadeOut(t, 19.75, 0.35);
  const val = t < 17.5 ? "2" : t < 18.65 ? "1" : "0";
  const flipT = t < 17.5 ? 16.1 : t < 18.65 ? 17.5 : 18.65;
  const spin = interpolate(t - flipT, [0, 0.35], [180, 0], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  return (
    <div style={{ position: "absolute", left: 960, top: 520, transform: `translate(-50%,-50%) scale(${s})`, perspective: 900 }}>
      <div style={{ width: 380, height: 380, borderRadius: "50%", transform: `rotateY(${spin}deg)`, background: "radial-gradient(circle at 35% 30%, #fff2b0 0%, #f2c845 35%, #c89a1c 75%, #8f6a0e 100%)", border: "14px solid #a67c12", boxShadow: "0 30px 60px rgba(0,0,0,.5), inset 0 0 0 10px rgba(255,255,255,.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 210, color: "#6e4e05", textShadow: "0 3px 0 #ffe9a0", marginTop: -10 }}><span style={{ fontSize: 120, verticalAlign: "60%" }}>$</span>{val}</div>
      </div>
      {t > 18.65 && <div style={{ position: "absolute", left: 300, top: -10, transform: `rotate(10deg) scale(${pop(f, 18.75, 7)})`, background: "#3bbf5a", color: "#fff", fontFamily: SANS, fontWeight: 900, fontSize: 52, padding: "6px 22px", borderRadius: 10, border: "5px solid #fff", whiteSpace: "nowrap", boxShadow: "0 10px 24px rgba(0,0,0,.4)" }}>GRATIS</div>}
    </div>
  );
};
// alfiler numerado (los 23 arreglos)
const Pin: React.FC<{ c: Cam; f: number; t: number; n: number; at: readonly number[]; t0: number; lit: number }> = ({ c, f, t, n, at, t0, lit }) => {
  if (t < t0 - 0.05) return null;
  const [x, y] = proj(c, at[0], at[1]);
  const drop = interpolate(t, [t0, t0 + 0.28], [-90, 0], { ...clamp, easing: Easing.out(Easing.bounce) });
  const sz = Math.max(30, Math.min(64, 64 * Math.sqrt(c.z / 1.0)));
  const on = lit > 0;
  return (
    <div style={{ position: "absolute", left: x, top: y + drop, transform: `translate(-50%,-100%) scale(${pop(f, t0, 9) * (on ? 1.15 : 1)})`, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: sz, height: sz, borderRadius: "50%", background: on ? C.gold : C.accent, border: `${Math.max(3, sz / 12)}px solid #fff`, color: "#fff", fontFamily: SANS, fontWeight: 900, fontSize: sz * 0.48, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: on ? `0 0 ${18 * lit}px #ffd85a, 0 6px 12px rgba(0,0,0,.45)` : "0 6px 12px rgba(0,0,0,.45)" }}>{n}</div>
      <div style={{ width: 0, height: 0, borderLeft: `${sz / 5}px solid transparent`, borderRight: `${sz / 5}px solid transparent`, borderTop: `${sz / 3}px solid #fff`, marginTop: -2 }} />
    </div>
  );
};
// contador de ahorro (arriba, se queda todo el video)
const Saver: React.FC<{ f: number; t: number }> = ({ f, t }) => {
  if (t < 28.0) return null;
  const s = interpolate(t, [28.0, 28.45], [-160, 0], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
  const spinning = t > 32.85 && t < 35.3;
  const mystery = t >= 35.3 && t < 37.6;
  const glow = interpolate(t, [28.8, 29.1, 29.6], [0, 1, 0.25], clamp);
  const digits = spinning ? String(1000 + Math.floor(((f * 7919) % 8999))).replace(/\B(?=(\d{3})+(?!\d))/g, ".") : mystery ? "?.???" : "0";
  return (
    <div style={{ position: "absolute", left: 960, top: 64 + s, transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 18, background: "rgba(24,18,12,.9)", border: `3px solid ${C.gold}`, borderRadius: 18, padding: "10px 28px 12px", boxShadow: `0 12px 30px rgba(0,0,0,.45), 0 0 ${30 * glow}px #ffd85a`, fontFamily: SANS }}>
      <div style={{ fontWeight: 800, fontSize: 22, letterSpacing: 3, color: "#f3e7cf", lineHeight: 1.1 }}>TE<br />AHORRASTE</div>
      <div style={{ fontWeight: 900, fontSize: 58, color: "#ffd85a", minWidth: 250, textAlign: "right", filter: spinning ? "blur(1.4px)" : undefined, transform: mystery ? `scale(${1 + 0.04 * Math.sin(f / 3)})` : undefined }}>US$ {digits}</div>
    </div>
  );
};
// "no llamas a nadie": teléfono tachado
const NoCall: React.FC<{ f: number; t: number }> = ({ f, t }) => {
  if (!vis(t, 31.3, 32.7)) return null;
  const s = pop(f, 31.3, 8) * fadeOut(t, 32.7);
  return (
    <div style={{ position: "absolute", left: 1330, top: 110, transform: `translate(-50%,-50%) scale(${s}) rotate(-6deg)`, width: 120, height: 120, borderRadius: "50%", background: "#fff", border: "7px solid #e3261c", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 24px rgba(0,0,0,.4)" }}>
      <svg width={70} height={70} viewBox="0 0 24 24"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.6a1 1 0 0 1-.25 1z" fill={C.ink} /></svg>
      <div style={{ position: "absolute", width: 120, height: 9, background: "#e3261c", transform: "rotate(-45deg)" }} />
    </div>
  );
};

// ───────────── el MANUAL (sale del banco, se abre, pasan páginas) ─────────────
const BookFX: React.FC<{ c: Cam; f: number; t: number }> = ({ c, f, t }) => {
  if (!vis(t, 45.0, 58.05)) return null;
  const [bx, by] = proj(c, P.bench[0], P.bench[1] - 20);
  const up = interpolate(t, [45.0, 46.1], [0, 1], { ...clamp, easing: ease }) * interpolate(t, [57.15, 58.0], [1, 0], { ...clamp, easing: ease });
  const PW = 520, PH = 736;
  const cx = lerp(bx, 960 + (t > 49.2 ? PW / 2 * interpolate(t, [49.2, 49.8], [0, 1], clamp) * up : 0), up), cy = lerp(by, 560, up);
  const sc = lerp(0.12, 1, up);
  const rotY = lerp(-55, -14, up) + interpolate(t, [46.1, 48.4], [0, 12], clamp);
  const cover = interpolate(t, [49.2, 49.85], [0, -180], { ...clamp, easing: ease }); // la tapa se abre
  const flipK = FLIP_T.map((t0) => interpolate(t, [t0, t0 + 0.42], [0, 1], { ...clamp, easing: ease }));
  const done = flipK.filter((k) => k >= 1).length;
  const page = (src: string) => <Img src={staticFile(`c23m1/pages/${src}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />;
  const sheet: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: PW, height: PH, background: C.paper, backfaceVisibility: "hidden", boxShadow: "inset 10px 0 18px rgba(0,0,0,.12)" };
  return (
    <AbsoluteFill style={{ perspective: 1800 }}>
      <AbsoluteFill style={{ background: `rgba(20,14,8,${0.55 * up})` }} />
      <div style={{ position: "absolute", left: cx, top: cy, width: PW, height: PH, transform: `translate(-50%,-50%) scale(${sc}) rotateY(${rotY * (1 - interpolate(t, [49.2, 49.8], [0, 1], clamp))}deg)`, transformStyle: "preserve-3d" }}>
        {/* pila de la derecha */}
        <div style={{ ...sheet, boxShadow: "inset 14px 0 22px rgba(0,0,0,.18), 0 30px 60px rgba(0,0,0,.45)" }}>{page(FLIPS[Math.min(FLIPS.length - 1, done + (flipK[done] > 0 ? 1 : 0))])}</div>
        {/* hoja que se está dando vuelta */}
        {done < FLIP_T.length && flipK[done] > 0 && (
          <div style={{ ...sheet, transformOrigin: "0 50%", transform: `rotateY(${-180 * flipK[done]}deg)`, transformStyle: "preserve-3d" }}>
            <div style={{ ...sheet }}>{page(FLIPS[done])}</div>
            <div style={{ ...sheet, transform: "rotateY(180deg)", background: "#efe6d2" }} />
          </div>
        )}
        {/* tapa */}
        <div style={{ position: "absolute", left: 0, top: 0, width: PW, height: PH, transformOrigin: "0 50%", transform: `rotateY(${cover}deg)`, transformStyle: "preserve-3d" }}>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: "4px 12px 12px 4px", overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,.55)" }}>
            <Img src={staticFile("c23m1/cover76.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            {/* brillo que recorre la tapa al nombrarla */}
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(105deg, transparent ${interpolate(t, [47.1, 48.3], [-30, 120], clamp)}%, rgba(255,255,255,.45) ${interpolate(t, [47.1, 48.3], [-20, 130], clamp)}%, transparent ${interpolate(t, [47.1, 48.3], [-10, 140], clamp)}%)` }} />
          </div>
          <div style={{ position: "absolute", inset: 0, transform: "rotateY(180deg)", backfaceVisibility: "hidden", background: C.paper, overflow: "hidden", boxShadow: "inset -14px 0 22px rgba(0,0,0,.18)" }}>{page(done > 0 ? FLIPS[done - 1] : "p011")}</div>
        </div>
      </div>
      {/* de dónde salió: albañiles viejos · plomeros · mi taller */}
      <SideNote f={f} t={t} t0={53.95} t1={57.1} x={300} y={330} icon="🧱" text="Albañiles viejos" />
      <SideNote f={f} t={t} t0={55.5} t1={57.1} x={300} y={540} icon="🔧" text="Plomeros de toda la vida" />
      <SideNote f={f} t={t} t0={57.2} t1={58.6} x={300} y={750} icon="🪚" text="Mi propio taller" />
    </AbsoluteFill>
  );
};
const SideNote: React.FC<{ f: number; t: number; t0: number; t1: number; x: number; y: number; icon: string; text: string }> = ({ f, t, t0, t1, x, y, icon, text }) => {
  if (!vis(t, t0, t1)) return null;
  const s = pop(f, t0, 10) * fadeOut(t, t1);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${s}) rotate(-3deg)`, display: "flex", alignItems: "center", gap: 14, background: C.paper, border: `4px solid ${C.ink}`, borderRadius: 14, padding: "12px 22px", boxShadow: "0 14px 30px rgba(0,0,0,.45)", fontFamily: SANS, fontWeight: 900, fontSize: 30, color: C.ink, whiteSpace: "nowrap", textTransform: "uppercase" }}>
      <span style={{ fontSize: 44 }}>{icon}</span>{text}
    </div>
  );
};
// la página exacta vuela del banco al techo y queda clavada ahí (pág. 32 = gotera)
const PageFly: React.FC<{ c: Cam; f: number; t: number }> = ({ c, f, t }) => {
  if (!vis(t, 59.85, 61.05)) return null;
  const k = interpolate(t, [59.85, 61.0], [0, 1], { ...clamp, easing: ease });
  const [ax, ay] = proj(c, P.bench[0], P.bench[1] - 30), [bx, by] = proj(c, 2085, 930);
  const x = lerp(ax, bx, k), y = lerp(ay, by, k) - Math.sin(Math.PI * k) * 260;
  const w = lerp(40, 160 * c.z, k);
  return <Img src={staticFile("c23m1/pages/p034.jpg")} style={{ position: "absolute", left: x, top: y, width: w, transform: `translate(-50%,-50%) rotate(${lerp(-30, 6, k) + Math.sin(k * 9) * 8}deg)`, boxShadow: "0 18px 30px rgba(0,0,0,.45)", border: "3px solid #fff" }} />;
};

// ───────────── Claudio recortado dentro de la casa (provisorio: la foto; después el reel con keying) ─────────────
const CLAUDIO: { at: readonly number[]; t0: number; t1: number; cut: number }[] = [
  { at: P.claudio1, t0: 0, t1: 5.3, cut: 1880 },
  { at: P.claudio2, t0: 36.4, t1: 63, cut: 1845 },
];
const Claudio: React.FC<{ t: number; f: number }> = ({ t, f }) => (
  <>
    {CLAUDIO.filter((w) => t >= w.t0 && t <= w.t1).map((w, i) => {
      const H = 340, Wd = H * (1088 / 608);
      const breathe = 1 + 0.006 * Math.sin(f / 22);
      const top = w.at[1] - H * 0.42;
      return (
        <div key={i} style={{ position: "absolute", left: w.at[0] - Wd / 2, top, width: Wd, height: w.cut - top, overflow: "hidden" }}>
          <Img src={staticFile("c23m1/claudio_cut.png")} style={{ position: "absolute", left: 0, top: 0, width: Wd, height: H, transformOrigin: "50% 100%", transform: `scale(${breathe})` }} />
        </div>
      );
    })}
  </>
);
// página que quedó clavada en el techo (en el mundo)
const PinnedPage: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  if (t < 61.0) return null;
  return (
    <div style={{ position: "absolute", left: 2085, top: 930, transform: `translate(-50%,-50%) rotate(6deg) scale(${pop(f, 61.0, 8) * 0.15 + 0.85})` }}>
      <Img src={staticFile("c23m1/pages/p034.jpg")} style={{ width: 160, border: "3px solid #fff", boxShadow: "0 8px 14px rgba(0,0,0,.4)", display: "block" }} />
      <div style={{ position: "absolute", left: 80, top: -12, width: 14, height: 14, borderRadius: "50%", background: C.accent, border: "2px solid #fff", transform: "translateX(-50%)" }} />
    </div>
  );
};

// ───────────── SFX bajos con ducking (la voz manda) ─────────────

const W_ = words as number[][];
const duck = (frame: number) => { const x = frame / FPS; for (const [a, b] of W_) { if (x < a - 0.05) break; if (x <= b + 0.08) return 0.5; } return 1; };
const SfxTrack: React.FC = () => (
  <>
    {SFX.map(([t0, file, vol, dur], i) => {
      const n = Math.max(4, Math.round(dur * FPS)), s0 = Math.max(0, Math.round(t0 * FPS));
      return (
        <Sequence key={i} from={s0} durationInFrames={n} layout="none">
          <Audio src={staticFile(`sfx/${file}.wav`)} volume={(fr) => vol * duck(s0 + fr) * interpolate(fr, [n - 6, n], [1, 0], clamp)} />
        </Sequence>
      );
    })}
  </>
);

// ───────────── composición ─────────────
export const Min1: React.FC<{ farm?: boolean }> = ({ farm }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS, f = frame;
  const c = cam(t);
  const c0 = cam(Math.max(0, t - 1 / FPS));
  // blur direccional proporcional a la velocidad de la cámara
  const vx = Math.abs(c.x - c0.x) * c.z, vy = Math.abs(c.y - c0.y) * c.z, vz = Math.abs(Math.log(c.z / c0.z)) * 900;
  const bz = Math.min(5, vz * 0.25), bx = Math.min(18, vx * 0.3) + bz, by = Math.min(18, vy * 0.3) + bz;
  const blurOn = bx + by > 0.6;
  const fixed = interpolate(t, [16.3, 17.0], [0, 1], clamp);
  const snow = interpolate(t, [12.3, 12.6], [0, 1], clamp);
  const pinsT0 = 20.0;
  const tour = interpolate(t, [22.8, 25.4], [0, 23], clamp);
  return (
    <AbsoluteFill style={{ background: "#dff0ec", overflow: "hidden" }}>
      {!farm && <Audio src={staticFile("c23m1/voz_min1.wav")} />}
      {!farm && <SfxTrack />}
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id="mb" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation={`${bx.toFixed(2)} ${by.toFixed(2)}`} /></filter></svg>
      {/* ── mundo con cámara ── */}
      <AbsoluteFill style={{ filter: blurOn ? "url(#mb)" : undefined }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: WW, height: WH, transformOrigin: "0 0", transform: `translate(960px,540px) scale(${c.z}) translate(${-c.x}px,${-c.y}px)` }}>
          <svg width={WW} height={WH} viewBox={`0 0 ${WW} ${WH}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <Sky t={t} />
            <Ground />
            <House t={t} snow={snow} />
            {/* gotera: se abre la grieta del techo y cae al balde */}
            <path d="M 1880 790 L 1895 812 L 1884 826 L 1902 846" fill="none" stroke="#2a1a12" strokeWidth={7} opacity={interpolate(t, [0.3, 0.6], [0, 1], clamp) * (1 - fixed)} />
            <path d="M 1858 1040 L 1942 1040 L 1932 1098 L 1868 1098 Z" fill="#7d8a93" stroke={C.ink} strokeOpacity={0.55} strokeWidth={4} />
            {fixed < 1 && <Drips t={t} x={1900} y0={850} y1={1036} t0={0.4} />}
            {/* caño que pierde bajo la pileta */}
            <path d="M 2810 1810 L 2810 1885 Q 2810 1925 2850 1925 Q 2890 1925 2890 1885 L 2890 1870 L 3020 1870" fill="none" stroke="#b9c2c8" strokeWidth={22} strokeLinecap="round" />
            {fixed < 1 && <Drips t={t} x={2850} y0={1935} y1={1990} t0={5.2} period={0.55} />}
            <Ants t={t} t0={8.95} />
            <Mold t={t} t0={10.1} fixed={fixed} />
            <Rust t={t} t0={10.6} fixed={fixed} />
            <Crack t={t} fixed={fixed} />
            {/* recorrido de los 23 (línea punteada dorada) */}
            {t > 22.75 && <polyline points={PINS.slice(0, Math.max(1, Math.ceil(tour))).map((p) => p.join(",")).join(" ")} fill="none" stroke={C.gold} strokeWidth={10} strokeDasharray="4 22" strokeLinecap="round" opacity={fadeOut(t, 28.2, 0.6)} />}
            {/* el manual sobre el banco del taller */}
            {!(t > 45.0 && t < 58.0) && <image href={staticFile("c23m1/cover76.jpg")} x={3755} y={1745} width={50} height={87} transform="rotate(-8 3780 1790)" />}
          </svg>
          <Claudio t={t} f={f} />
          <svg width={WW} height={WH} viewBox={`0 0 ${WW} ${WH}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <Front />
          </svg>
          <PinnedPage t={t} f={f} />
        </div>
      </AbsoluteFill>

      {/* ── capa de pantalla (sigue a la cámara por proyección) ── */}
      <PriceTicket c={c} f={f} t={t} at={P.gotera} t0={2.95} t1={4.9} who="ALBAÑIL" price="US$100" note="sólo por mirar" dx={330} dy={-60} />
      <Tag c={c} f={f} t={t} at={P.gotera} t0={0.4} t1={4.9} text="Gotera" dx={-210} dy={-150} bg={C.accent} />
      <PriceTicket c={c} f={f} t={t} at={P.cano} t0={7.4} t1={8.85} who="PLOMERO" price="US$70" note="sólo por venir" dx={-360} dy={-250} />
      <Tag c={c} f={f} t={t} at={P.cano} t0={5.35} t1={8.85} text="Caño que pierde" dx={250} dy={-190} bg={C.accent} />
      <Tag c={c} f={f} t={t} at={P.hormigas} t0={9.05} t1={10.1} text="Hormigas" dy={-120} bg="#111" />
      <Tag c={c} f={f} t={t} at={P.moho} t0={10.12} t1={10.6} text="Moho" dx={170} dy={70} bg="#111" />
      <Tag c={c} f={f} t={t} at={P.oxido} t0={10.6} t1={11.25} text="Óxido" dx={-190} dy={-80} bg="#111" />
      <Tag c={c} f={f} t={t} at={P.grieta} t0={11.4} t1={13.4} text="Grieta" dx={200} dy={-150} bg="#111" />
      <Tag c={c} f={f} t={t} at={P.grieta} t0={12.35} t1={13.4} text="❄ cada invierno" dx={-300} dy={60} bg="#2f6fb8" size={28} />
      {/* la casa entera: los problemas se marcan en rojo y el $2 los pone en verde */}
      {(["gotera", "cano", "hormigas", "moho", "oxido", "grieta"] as const).map((k, i) => (
        <Ring key={k} c={c} f={f} t={t} at={P[k]} t0={13.9 + i * 0.09} t1={19.7} fixAt={16.35 + i * 0.12} />
      ))}
      <Coin f={f} t={t} />
      {PINS.map((p, i) => (
        <Pin key={i} c={c} f={f} t={t} n={i + 1} at={p} t0={pinsT0 + i * 0.075} lit={Math.max(0, 1 - Math.abs(tour - (i + 1)) / 2)} />
      )).filter((_, i) => t < 28.4 || t > 1e9 || i < 0)}
      <BigWord f={f} t={t} t0={20.65} t1={22.6} y={150}><span style={{ color: "#ffd85a" }}>23</span> ARREGLOS</BigWord>
      <Tag c={c} f={f} t={t} at={P.techo} t0={25.88} t1={26.7} text="Techo" dy={-120} bg={C.accent} size={40} />
      <Tag c={c} f={f} t={t} at={P.garaje} t0={26.8} t1={27.9} text="Garaje" dy={-260} bg={C.accent} size={40} />
      <Saver f={f} t={t} />
      <NoCall f={f} t={t} />
      {vis(t, 34.7, 36.5) && <BigWord f={f} t={t} t0={34.7} t1={36.5} y={300} size={150}><span style={{ color: "#ffd85a" }}>?</span></BigWord>}
      <Tag c={c} f={f} t={t} at={P.claudio2} t0={42.9} t1={44.4} text="No son inventados" dx={360} dy={-40} bg={C.green} size={30} />
      <BookFX c={c} f={f} t={t} />
      <PageFly c={c} f={f} t={t} />
      <Tag c={c} f={f} t={t} at={[2085, 930]} t0={61.05} t1={63} text="Página 32" dy={-225} bg={C.accent} size={34} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,.22) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

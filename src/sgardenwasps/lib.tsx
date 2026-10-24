// sgardenwasps · base 2.5D (HTML/SVG con perspectiva real) que vive ENCIMA del mundo 3D, de las tomas y del avatar.
// Todo se ancla a la PALABRA con at("frase") (ASR Groq de la voz final → words.json): cero desfase.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile } from "remotion";
import { loadFont as loadMincho } from "@remotion/google-fonts/ShipporiMincho";
import { loadFont as loadBrush } from "@remotion/google-fonts/CaveatBrush";
import WORDS from "./words.json";

export const { fontFamily: FONT } = loadMincho("normal", { weights: ["600", "800"], subsets: ["latin"] });
export const { fontFamily: BRUSH } = loadBrush("normal", { weights: ["400"], subsets: ["latin"] });
export const FPS = 30;
export const s = (t: number) => Math.round(t * FPS);
export const P = "sgardenwasps/";
const clamp = (x: number) => Math.max(0, Math.min(1, x));
export const cl = clamp;
export const sm = (x: number) => { const c = clamp(x); return c * c * (3 - 2 * c); };
export const e = (t: number, a: number, b: number) => sm((t - a) / (b - a));
export const easeIO = (x: number) => { const c = clamp(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const ei = (t: number, a: number, b: number) => easeIO((t - a) / (b - a));
// resorte determinista: sube con sobrepico y se asienta
export const spr = (t: number, a: number, k = 1) => { const x = Math.max(0, (t - a) * 6 * k); return x <= 0 ? 0 : 1 - Math.exp(-x) * Math.cos(x * 1.9); };
export const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

// ---------- at("frase") ----------
type Wd = { text: string; startMs: number; endMs: number };
const TOK = (WORDS as Wd[]).map((w) => ({ k: w.text.toLowerCase().replace(/[^a-z0-9']/g, ""), a: w.startMs / 1000, b: w.endMs / 1000 }));
const find = (phrase: string, after: number) => {
  const p = phrase.toLowerCase().split(/\s+/).map((x) => x.replace(/[^a-z0-9']/g, "")).filter(Boolean);
  for (let i = 0; i < TOK.length - p.length + 1; i++) {
    if (TOK[i].a < after - 0.001) continue;
    let ok = true;
    for (let j = 0; j < p.length; j++) if (TOK[i + j].k !== p[j]) { ok = false; break; }
    if (ok) return i;
  }
  throw new Error(`at(): no está "${phrase}" después de ${after}`);
};
/** segundo en que EMPIEZA la frase (primera vez después de `after`) */
export const at = (phrase: string, after = 0) => TOK[find(phrase, after)].a;
/** segundo en que TERMINA la frase */
export const atEnd = (phrase: string, after = 0) => { const p = phrase.trim().split(/\s+/).length; return TOK[find(phrase, after) + p - 1].b; };

// paleta: washi, sumi, bermellón del sello, índigo, oro viejo
export const COL = { paper: "#f3ead8", paper2: "#e7dcc4", ink: "#1b1712", red: "#c8321e", indigo: "#2b3f63", gold: "#d9a441", cream: "#fbf6ea", dim: "rgba(251,246,234,.78)", leaf: "#b8442a" };

export const extrude = (n: number, col: string, dx = 0.6, dy = 1) =>
  Array.from({ length: n }, (_, i) => `${(i + 1) * dx}px ${(i + 1) * dy}px 0 ${col}`).join(", ") + `, ${n * dx + 6}px ${n * dy + 16}px 34px rgba(0,0,0,.55)`;

// toma (LTX mp4) o foto a cuadro completo; `at` = segundo de la composición en que arranca la toma
export const Vid: React.FC<{ id: string; from?: number; at?: number; style?: React.CSSProperties; vol?: number }> = ({ id, from = 0, at: a, style, vol = 0 }) => {
  if (id.startsWith("img_")) return <Img src={staticFile(P + id + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", ...style }} />;
  const v = <OffthreadVideo src={staticFile(P + id + ".mp4")} startFrom={s(from)} muted={vol === 0} volume={vol} style={{ width: "100%", height: "100%", objectFit: "cover", ...style }} />;
  return a === undefined ? v : <Sequence from={s(a)} layout="none">{v}</Sequence>;
};

export const Flash: React.FC<{ t: number; at: number; peak?: number; col?: string; w?: number }> = ({ t, at: a, peak = 0.7, col = "#fff8e8", w = 0.25 }) => {
  const o = t < a ? e(t, a - 0.07, a) * peak : (1 - e(t, a, a + w)) * peak;
  return o > 0.005 ? <AbsoluteFill style={{ background: col, opacity: o, mixBlendMode: "screen", pointerEvents: "none" }} /> : null;
};

// rótulo anclado a un punto: hilo de tinta + gota + texto en mincho sobre tira de washi
export const Tag: React.FC<{ t: number; at: number; x: number; y: number; dx?: number; dy?: number; text: string; sub?: string; col?: string; out?: number; size?: number }> = ({ t, at: a, x, y, dx = 120, dy = -90, text, sub, col = COL.ink, out = 1e9, size = 44 }) => {
  const k = Math.min(1.15, spr(t, a)), o = e(t, a, a + 0.12) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const L = e(t, a, a + 0.3);
  const ex = x + dx * L, ey = y + dy * L;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line x1={x} y1={y} x2={ex} y2={ey} stroke={COL.cream} strokeWidth={3} strokeLinecap="round" style={{ filter: "drop-shadow(0 2px 5px rgba(0,0,0,.8))" }} />
        <circle cx={x} cy={y} r={9 * k} fill={COL.red} stroke={COL.cream} strokeWidth={2.5} />
        <circle cx={x} cy={y} r={18 + 26 * e(t, a, a + 0.6)} fill="none" stroke={COL.cream} strokeWidth={2} opacity={1 - e(t, a, a + 0.6)} />
      </svg>
      <div style={{ position: "absolute", left: ex + (dx >= 0 ? 12 : -12), top: ey, transform: `translate(${dx >= 0 ? 0 : -100}%, -50%) perspective(900px) rotateY(${(1 - Math.min(1, k)) * (dx >= 0 ? 50 : -50)}deg) scale(${0.6 + 0.4 * k})`, transformOrigin: dx >= 0 ? "0 50%" : "100% 50%", whiteSpace: "nowrap",
        background: `linear-gradient(180deg, ${COL.cream}, ${COL.paper})`, padding: "10px 22px 12px", borderRadius: 4, boxShadow: "0 14px 30px rgba(0,0,0,.45)", borderLeft: `8px solid ${COL.red}` }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color: col, letterSpacing: 1, lineHeight: 1.05 }}>{text}</div>
        {sub && <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: size * 0.5, color: COL.red, letterSpacing: 3, marginTop: 3 }}>{sub}</div>}
      </div>
    </div>
  );
};

// tarjeta 3D con canto, reflejo y brillo que barre con el giro (video o foto adentro)
type C3 = { id: string; from?: number; at?: number; x: number; y: number; w: number; h: number; ry?: number; rx?: number; rz?: number; z?: number; o?: number; label?: string; frame?: string; children?: React.ReactNode };
export const Card3D: React.FC<C3> = ({ id, from, at: a, x, y, w, h, ry = 0, rx = 0, rz = 0, z = 0, o = 1, label, frame = COL.cream, children }) => {
  const T = 14;
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, perspective: 1700, opacity: o }}>
      <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transformStyle: "preserve-3d", transform: `translateZ(${z}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)` }}>
        <div style={{ position: "absolute", right: -T / 2, top: 10, width: T, height: h - 20, background: "linear-gradient(90deg,#d8cfbd,#8a7f6c)", transform: "rotateY(90deg)" }} />
        <div style={{ position: "absolute", left: -T / 2, top: 10, width: T, height: h - 20, background: "linear-gradient(90deg,#8a7f6c,#d8cfbd)", transform: "rotateY(-90deg)" }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: 6, overflow: "hidden", transform: `translateZ(${T / 2}px)`,
          border: `14px solid ${frame}`, borderBottomWidth: label ? 64 : 14, boxShadow: "0 40px 90px rgba(0,0,0,.6)", background: "#111" } as React.CSSProperties}>
          <Vid id={id} from={from} at={a} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${105 + ry * 2}deg, transparent 35%, rgba(255,255,255,.13) 50%, transparent 65%)` }} />
          {children}
        </div>
        {label && <div style={{ position: "absolute", left: 0, right: 0, bottom: 10, transform: `translateZ(${T / 2 + 1}px)`, textAlign: "center", fontFamily: BRUSH, fontSize: 40, color: COL.ink }}>{label}</div>}
      </div>
    </div>
  );
};

// número grande en sumi extruido que gira en Y y nace desde el fondo
export const BigNum: React.FC<{ t: number; at: number; text: string; x?: number; y?: number; size?: number; col?: string; edge?: string; out?: number; sub?: string; font?: string }> = ({ t, at: a, text, x = 960, y = 520, size = 260, col = COL.cream, edge = "#5a4632", out = 1e9, sub, font = FONT }) => {
  const k = spr(t, a, 0.9), o = e(t, a, a + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const ry = (1 - Math.min(1, k)) * -70 + Math.sin((t - a) * 0.9) * 5;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", perspective: 1200, opacity: o }}>
      <div style={{ transform: `translateZ(${(1 - Math.min(1, k)) * -900}px) rotateY(${ry}deg) rotateX(6deg)`, fontFamily: font, fontWeight: 800, fontSize: size, color: col, lineHeight: 1, textShadow: extrude(16, edge), textAlign: "center", whiteSpace: "nowrap" }}>
        {text}
        {sub && <div style={{ fontSize: size * 0.17, fontWeight: 800, letterSpacing: 8, color: COL.paper, textShadow: extrude(4, "#000"), marginTop: 10 }}>{sub}</div>}
      </div>
    </div>
  );
};

// sello rojo japonés (hanko) que cae y se estampa: tinta bermellón con borde gastado
export const Hanko: React.FC<{ t: number; at: number; text: string; x: number; y: number; out?: number; rot?: number; size?: number; sub?: string }> = ({ t, at: a, text, x, y, out = 1e9, rot = -6, size = 64, sub }) => {
  const k = spr(t, a, 1.4), o = e(t, a, a + 0.05) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const sc = 2.2 - 1.2 * Math.min(1, k);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${sc})` }}>
      <div style={{ border: `8px solid ${COL.red}`, borderRadius: 10, padding: "4px 22px 6px", fontFamily: FONT, fontWeight: 800, fontSize: size, color: COL.red, letterSpacing: 4, whiteSpace: "nowrap", textAlign: "center",
        background: "rgba(251,246,234,.92)", boxShadow: "0 6px 18px rgba(0,0,0,.28)" }}>
        {text}
        {sub && <div style={{ fontSize: size * 0.38, letterSpacing: 5, marginTop: -2 }}>{sub}</div>}
      </div>
    </div>
  );
};

// filtros SVG comunes (montar UNA vez por cuadro): bordes gastados del sello, pincel áspero
export const SvgDefs: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <filter id="hankoRough" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={7} result="n" />
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.3 1.45" result="holes" />
      <feComposite in="SourceGraphic" in2="holes" operator="in" />
    </filter>
    <filter id="brushRough" x="-5%" y="-30%" width="110%" height="160%">
      <feTurbulence type="fractalNoise" baseFrequency="0.035 0.6" numOctaves={2} seed={3} result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale={9} xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </svg>
);

/** palabras de la voz entre a y b (para escribirlas al ritmo exacto) */
export const wordsIn = (a: number, b: number) => (WORDS as Wd[]).filter((w) => w.startMs / 1000 >= a - 0.01 && w.startMs / 1000 < b).map((w) => ({ text: w.text.trim(), a: w.startMs / 1000, b: w.endMs / 1000 }));

// marcelloen01 · base (de gary01): tiempo anclado a la PALABRA, piezas 2.5D que viven encima del mundo 3D, tomas y avatar.
// Paleta cálida de cocina italiana vieja: crema, terracota, oliva, tomate, oro de fuego.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadSerif } from "@remotion/google-fonts/PlayfairDisplay";
import wordsRaw from "./words.json";

export const { fontFamily: FONT } = loadFont("normal", { weights: ["600", "800", "900"], subsets: ["latin"] });
export const { fontFamily: SERIF } = loadSerif("italic", { weights: ["700", "900"], subsets: ["latin"] });
export const FPS = 30;
export const s = (t: number) => Math.round(t * FPS);
export const P = "marcelloen01/";
const clamp = (x: number) => Math.max(0, Math.min(1, x));
export const sm = (x: number) => { const c = clamp(x); return c * c * (3 - 2 * c); };
export const e = (t: number, a: number, b: number) => sm((t - a) / (b - a));
export const easeIO = (x: number) => { const c = clamp(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const ei = (t: number, a: number, b: number) => easeIO((t - a) / (b - a));
export const spr = (t: number, a: number, k = 1) => { const x = Math.max(0, (t - a) * 6 * k); return x <= 0 ? 0 : 1 - Math.exp(-x) * Math.cos(x * 1.9); };
export const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

export const COL = { ink: "#fbf3e4", cream: "#f3e2c0", terra: "#d9673a", tomato: "#e8432e", olive: "#a3b46a", gold: "#ffc15e", ice: "#9fd2ff", dim: "rgba(251,243,228,.72)", night: "#0a0f18", wood: "#3a2414" };

// ───────── tiempo anclado a la palabra (words.json de Groq) ─────────
type Wd = { text: string; startMs: number; endMs: number };
const WORDS = (wordsRaw as Wd[]).map((w) => ({ n: w.text.toLowerCase().replace(/[^a-z0-9]/g, ""), s: w.startMs / 1000, e: w.endMs / 1000 }));
const memo = new Map<string, number>();
// at("frase", desde) → segundo en que EMPIEZA esa frase (primera aparición después de `desde`). Si no está, rompe el still.
export const at = (phrase: string, after = 0): number => {
  const k = phrase + "@" + after;
  const m = memo.get(k); if (m !== undefined) return m;
  const toks = phrase.toLowerCase().split(/\s+/).map((x) => x.replace(/[^a-z0-9]/g, "")).filter(Boolean);
  for (let i = 0; i < WORDS.length; i++) {
    if (WORDS[i].s < after) continue;
    let ok = true;
    for (let j = 0; j < toks.length; j++) if (WORDS[i + j]?.n !== toks[j]) { ok = false; break; }
    if (ok) { memo.set(k, WORDS[i].s); return WORDS[i].s; }
  }
  throw new Error(`frase no encontrada en words.json: "${phrase}" después de ${after}`);
};
export const atEnd = (phrase: string, after = 0): number => {
  const st = at(phrase, after); const n = phrase.trim().split(/\s+/).length;
  const i = WORDS.findIndex((w) => w.s === st); return WORDS[Math.min(WORDS.length - 1, i + n - 1)].e;
};

export const extrude = (n: number, col: string, dx = 0.6, dy = 1) =>
  Array.from({ length: n }, (_, i) => `${(i + 1) * dx}px ${(i + 1) * dy}px 0 ${col}`).join(", ") + `, ${n * dx + 6}px ${n * dy + 16}px 34px rgba(0,0,0,.6)`;

// toma (LTX mp4 o foto) a cuadro completo
export const Vid: React.FC<{ id: string; from?: number; at?: number; style?: React.CSSProperties; vol?: number }> = ({ id, from = 0, at: a, style, vol = 0 }) => {
  if (id.startsWith("img_")) return <Img src={staticFile(P + id + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", ...style }} />;
  const v = <OffthreadVideo src={staticFile(P + id + ".mp4")} startFrom={s(from)} muted={vol === 0} volume={vol} style={{ width: "100%", height: "100%", objectFit: "cover", ...style }} />;
  return a === undefined ? v : <Sequence from={s(a)} layout="none">{v}</Sequence>;
};

export const Flash: React.FC<{ t: number; at: number; peak?: number; col?: string; w?: number }> = ({ t, at: a, peak = 0.85, col = "#fff", w = 0.25 }) => {
  const o = t < a ? e(t, a - 0.07, a) * peak : (1 - e(t, a, a + w)) * peak;
  return o > 0.005 ? <AbsoluteFill style={{ background: col, opacity: o, mixBlendMode: "screen", pointerEvents: "none" }} /> : null;
};

// portal circular centrado en un punto de pantalla (sigue a la cámara): r 0..1 = 0..cubrir pantalla. Borde de luz cálida, nítido.
export const Portal: React.FC<{ x: number; y: number; r: number; ring?: number; col?: string; children: React.ReactNode }> = ({ x, y, r, ring = 1, col = "255,200,130", children }) => {
  if (r <= 0.001) return null;
  const R = r * Math.hypot(Math.max(x, 1920 - x), Math.max(y, 1080 - y)) * 1.02;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `circle(${R}px at ${x}px ${y}px)` }}>{children}</AbsoluteFill>
      {ring > 0 && r < 0.995 && <div style={{ position: "absolute", left: x - R, top: y - R, width: 2 * R, height: 2 * R, borderRadius: "50%",
        boxShadow: `0 0 0 ${3 + 3 * (1 - r)}px rgba(255,248,235,${0.8 * ring * (1 - r * r)}), 0 0 60px 10px rgba(${col},${0.4 * ring * (1 - r)})` }} />}
    </AbsoluteFill>
  );
};

// rótulo anclado a un punto (línea guía + punto + texto extruido); pop con resorte
export const Tag: React.FC<{ t: number; at: number; x: number; y: number; dx?: number; dy?: number; text: string; sub?: string; col?: string; out?: number; size?: number }> = ({ t, at: a, x, y, dx = 120, dy = -90, text, sub, col = COL.ink, out = 1e9, size = 64 }) => {
  const k = Math.min(1.15, spr(t, a)), o = e(t, a, a + 0.12) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const L = e(t, a, a + 0.3);
  const ex = x + dx * L, ey = y + dy * L;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line x1={x} y1={y} x2={ex} y2={ey} stroke={col} strokeWidth={3} strokeLinecap="round" style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.8))" }} />
        <circle cx={x} cy={y} r={8 * k} fill={col} style={{ filter: `drop-shadow(0 0 10px ${col})` }} />
        <circle cx={x} cy={y} r={18 + 26 * e(t, a, a + 0.6)} fill="none" stroke={col} strokeWidth={2} opacity={1 - e(t, a, a + 0.6)} />
      </svg>
      <div style={{ position: "absolute", left: ex + (dx >= 0 ? 14 : -14), top: ey, transform: `translate(${dx >= 0 ? 0 : -100}%, -50%) perspective(900px) rotateY(${(1 - Math.min(1, k)) * (dx >= 0 ? 50 : -50)}deg) scale(${0.6 + 0.4 * k})`, transformOrigin: dx >= 0 ? "0 50%" : "100% 50%", fontFamily: FONT, whiteSpace: "nowrap" }}>
        <div style={{ fontWeight: 900, fontSize: size, color: col, letterSpacing: 2, textShadow: extrude(6, "rgba(0,0,0,.55)") }}>{text}</div>
        {sub && <div style={{ fontWeight: 800, fontSize: size * 0.5, color: COL.dim, letterSpacing: 3, marginTop: 2, textShadow: "0 2px 10px #000" }}>{sub}</div>}
      </div>
    </div>
  );
};

// tarjeta 3D con canto, reflejo y brillo especular (video o foto adentro)
type C3 = { id: string; from?: number; at?: number; x: number; y: number; w: number; h: number; ry?: number; rx?: number; rz?: number; z?: number; o?: number; label?: string; labelCol?: string; children?: React.ReactNode };
export const Card3D: React.FC<C3> = ({ id, from, at: a, x, y, w, h, ry = 0, rx = 0, rz = 0, z = 0, o = 1, label, labelCol = COL.ink, children }) => {
  const T = 16;
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, perspective: 1700, opacity: o }}>
      <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transformStyle: "preserve-3d", transform: `translateZ(${z}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)` }}>
        <div style={{ position: "absolute", right: -T / 2, top: 16, width: T, height: h - 32, background: "linear-gradient(90deg,#e6d6b8,#9c8564)", transform: "rotateY(90deg)" }} />
        <div style={{ position: "absolute", left: -T / 2, top: 16, width: T, height: h - 32, background: "linear-gradient(90deg,#9c8564,#e6d6b8)", transform: "rotateY(-90deg)" }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: 16, overflow: "hidden", transform: `translateZ(${T / 2}px)`,
          border: "6px solid rgba(255,248,235,.95)", boxShadow: "0 40px 90px rgba(0,0,0,.7)", background: "#111",
          WebkitBoxReflect: "below 26px linear-gradient(transparent 62%, rgba(255,255,255,.2))" } as React.CSSProperties}>
          <Vid id={id} from={from} at={a} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${105 + ry * 2}deg, transparent 35%, rgba(255,255,255,.12) 50%, transparent 65%)` }} />
          {label && <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "14px 20px", background: "linear-gradient(0deg, rgba(0,0,0,.85), transparent)", fontFamily: FONT, fontWeight: 900, fontSize: 40, letterSpacing: 4, color: labelCol }}>{label}</div>}
          {children}
        </div>
      </div>
    </div>
  );
};

// número grande extruido que gira en Y y nace desde el fondo
export const BigNum: React.FC<{ t: number; at: number; text: string; x?: number; y?: number; size?: number; col?: string; edge?: string; out?: number; sub?: string }> = ({ t, at: a, text, x = 960, y = 520, size = 260, col = COL.ink, edge = "#5a3a22", out = 1e9, sub }) => {
  const k = spr(t, a, 0.9), o = e(t, a, a + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const ry = (1 - Math.min(1, k)) * -70 + Math.sin((t - a) * 0.9) * 6;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", perspective: 1200, opacity: o }}>
      <div style={{ transform: `translateZ(${(1 - Math.min(1, k)) * -900}px) rotateY(${ry}deg) rotateX(6deg)`, fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, lineHeight: 1, textShadow: extrude(16, edge), textAlign: "center", whiteSpace: "nowrap" }}>
        {text}
        {sub && <div style={{ fontSize: size * 0.2, fontWeight: 800, letterSpacing: 8, color: COL.dim, textShadow: extrude(4, "#000") }}>{sub}</div>}
      </div>
    </div>
  );
};

// sello que cae girando
export const Stamp: React.FC<{ t: number; at: number; text: string; x: number; y: number; out?: number; rot?: number; size?: number; col?: string }> = ({ t, at: a, text, x, y, out = 1e9, rot = -9, size = 110, col = COL.tomato }) => {
  const k = spr(t, a, 1.3), o = e(t, a, a + 0.06) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.4 - 1.4 * Math.min(1, k)})` }}>
      <div style={{ border: `10px solid ${col}`, borderRadius: 14, padding: "6px 30px", fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, letterSpacing: 4, background: "rgba(20,4,0,.3)", boxShadow: `0 0 30px ${col}77`, textShadow: "0 4px 10px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>{text}</div>
    </div>
  );
};

// rótulo inferior 3D (placa de madera con canto y filo dorado) que se escribe
export const LowerThird: React.FC<{ t: number; at: number; out: number; name: string; l2: string; l2at: number }> = ({ t, at: a, out, name, l2, l2at }) => {
  const k = spr(t, a, 0.8), o = e(t, a, a + 0.15) * (1 - e(t, out, out + 0.35));
  if (o <= 0.01) return null;
  const n2 = Math.round(l2.length * e(t, l2at, l2at + 0.9));
  return (
    <div style={{ position: "absolute", left: 110, bottom: 120, perspective: 1100, opacity: o }}>
      <div style={{ transformOrigin: "0 50%", transform: `rotateY(${(1 - Math.min(1, k)) * 70 + 10}deg) translateZ(${(1 - Math.min(1, k)) * -200}px)`, transformStyle: "preserve-3d" }}>
        <div style={{ display: "inline-block", padding: "16px 34px 18px 28px", background: "linear-gradient(180deg, rgba(58,34,18,.95), rgba(32,18,9,.95))", borderLeft: `10px solid ${COL.terra}`, borderRadius: 10, boxShadow: "0 30px 60px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,220,170,.25)" }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontStyle: "italic", fontSize: 72, color: COL.ink, letterSpacing: 1, textShadow: extrude(5, "#120802") }}>{name}</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: COL.gold, letterSpacing: 5, minHeight: 36 }}>{l2.slice(0, n2)}<span style={{ opacity: n2 < l2.length && n2 > 0 ? 1 : 0 }}>▌</span></div>
        </div>
      </div>
    </div>
  );
};

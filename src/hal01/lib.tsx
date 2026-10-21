// hal01 · kit base (copiado de gary01): piezas 2.5D (HTML/SVG con perspectiva real) que viven ENCIMA del mundo 3D, de las tomas y del avatar borroneado.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";

export const { fontFamily: FONT } = loadFont("normal", { weights: ["600", "800", "900"], subsets: ["latin"] });
export const FPS = 30;
export const s = (t: number) => Math.round(t * FPS);
export const P = "hal01/";
const clamp = (x: number) => Math.max(0, Math.min(1, x));
export const sm = (x: number) => { const c = clamp(x); return c * c * (3 - 2 * c); };
export const e = (t: number, a: number, b: number) => sm((t - a) / (b - a));
export const easeIO = (x: number) => { const c = clamp(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const ei = (t: number, a: number, b: number) => easeIO((t - a) / (b - a));
// resorte determinista (sin depender del fps del contexto): sube con sobrepico y se asienta
export const spr = (t: number, a: number, k = 1) => { const x = Math.max(0, (t - a) * 6 * k); return x <= 0 ? 0 : 1 - Math.exp(-x) * Math.cos(x * 1.9); };

export const COL = { ink: "#f4efe6", ice: "#8fd6ff", ice2: "#d9f3ff", amber: "#ffb257", red: "#ff4a3d", dim: "rgba(244,239,230,.7)", navy: "#0b1424", manila: "#ecd59e", blue: "#7fb2ff", green: "#6fe39a" };

// extrusión: capas de sombra dura (el canto de la letra) + sombra suave al piso
export const extrude = (n: number, col: string, dx = 0.6, dy = 1) =>
  Array.from({ length: n }, (_, i) => `${(i + 1) * dx}px ${(i + 1) * dy}px 0 ${col}`).join(", ") + `, ${n * dx + 6}px ${n * dy + 16}px 34px rgba(0,0,0,.6)`;

// toma (LTX mp4 o foto) a cuadro completo
export const Vid: React.FC<{ id: string; from?: number; at?: number; style?: React.CSSProperties; vol?: number }> = ({ id, from = 0, at, style, vol = 0 }) => {
  if (id.startsWith("img_")) return <Img src={staticFile(P + id + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", ...style }} />;
  const v = <OffthreadVideo src={staticFile(P + id + ".mp4")} startFrom={s(from)} muted={vol === 0} volume={vol} style={{ width: "100%", height: "100%", objectFit: "cover", ...style }} />;
  // at = segundo de la composición en que arranca la toma (la toma corre desde su cuadro `from`)
  return at === undefined ? v : <Sequence from={s(at)} layout="none">{v}</Sequence>;
};

export const Flash: React.FC<{ t: number; at: number; peak?: number; col?: string; w?: number }> = ({ t, at, peak = 0.85, col = "#fff", w = 0.25 }) => {
  const o = t < at ? e(t, at - 0.07, at) * peak : (1 - e(t, at, at + w)) * peak;
  return o > 0.005 ? <AbsoluteFill style={{ background: col, opacity: o, mixBlendMode: "screen", pointerEvents: "none" }} /> : null;
};

// portal circular centrado en un punto de pantalla (que sigue a la cámara): r 0..1 = 0..cubrir pantalla
export const Portal: React.FC<{ x: number; y: number; r: number; ring?: number; children: React.ReactNode }> = ({ x, y, r, ring = 1, children }) => {
  if (r <= 0.001) return null;
  const R = r * Math.hypot(Math.max(x, 1920 - x), Math.max(y, 1080 - y)) * 1.02;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `circle(${R}px at ${x}px ${y}px)` }}>{children}</AbsoluteFill>
      {ring > 0 && r < 0.995 && <div style={{ position: "absolute", left: x - R, top: y - R, width: 2 * R, height: 2 * R, borderRadius: "50%",
        boxShadow: `0 0 0 ${3 + 3 * (1 - r)}px rgba(255,255,255,${0.75 * ring * (1 - r * r)}), 0 0 60px 10px rgba(160,210,255,${0.35 * ring * (1 - r)})` }} />}
    </AbsoluteFill>
  );
};

// rótulo anclado a un punto (línea guía + punto + texto extruido); pop con resorte
export const Tag: React.FC<{ t: number; at: number; x: number; y: number; dx?: number; dy?: number; text: string; sub?: string; col?: string; out?: number; size?: number }> = ({ t, at, x, y, dx = 120, dy = -90, text, sub, col = COL.ink, out = 1e9, size = 46 }) => {
  const k = Math.min(1.15, spr(t, at)), o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const L = e(t, at, at + 0.3);
  const ex = x + dx * L, ey = y + dy * L;
  // si el texto se sale del cuadro, se pone del otro lado del punto (nunca cortado en el borde)
  const wEst = Math.max(text.length, (sub || "").length * 0.5) * size * 0.68;
  const R = dx >= 0 ? ex + 14 + wEst <= 1880 : ex - 14 - wEst < 40;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line x1={x} y1={y} x2={ex} y2={ey} stroke={col} strokeWidth={3} strokeLinecap="round" style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.8))" }} />
        <circle cx={x} cy={y} r={8 * k} fill={col} style={{ filter: `drop-shadow(0 0 10px ${col})` }} />
        <circle cx={x} cy={y} r={18 + 26 * e(t, at, at + 0.6)} fill="none" stroke={col} strokeWidth={2} opacity={1 - e(t, at, at + 0.6)} />
      </svg>
      <div style={{ position: "absolute", left: ex + (R ? 14 : -14), top: ey, transform: `translate(${R ? 0 : -100}%, -50%) perspective(900px) rotateY(${(1 - Math.min(1, k)) * (R ? 50 : -50)}deg) scale(${0.6 + 0.4 * k})`, transformOrigin: R ? "0 50%" : "100% 50%", textAlign: R ? "left" : "right", fontFamily: FONT, whiteSpace: "nowrap" }}>
        <div style={{ fontWeight: 900, fontSize: size, color: col, letterSpacing: 2, textShadow: extrude(6, "rgba(0,0,0,.55)") }}>{text}</div>
        {sub && <div style={{ fontWeight: 800, fontSize: size * 0.5, color: COL.dim, letterSpacing: 3, marginTop: 2, textShadow: "0 2px 10px #000" }}>{sub}</div>}
      </div>
    </div>
  );
};

// tarjeta 3D con canto, reflejo y brillo especular que barre con el giro (video o foto adentro)
type C3 = { id: string; from?: number; at?: number; x: number; y: number; w: number; h: number; ry?: number; rx?: number; rz?: number; z?: number; o?: number; label?: string; labelCol?: string; blur?: number; children?: React.ReactNode };
export const Card3D: React.FC<C3> = ({ id, from, at, x, y, w, h, ry = 0, rx = 0, rz = 0, z = 0, o = 1, label, labelCol = COL.ink, blur = 0, children }) => {
  const T = 16;
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, perspective: 1700, opacity: o, filter: blur > 0.2 ? `blur(${blur}px)` : undefined }}>
      <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transformStyle: "preserve-3d", transform: `translateZ(${z}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)` }}>
        <div style={{ position: "absolute", right: -T / 2, top: 16, width: T, height: h - 32, background: "linear-gradient(90deg,#d8d4cc,#8c877e)", transform: "rotateY(90deg)" }} />
        <div style={{ position: "absolute", left: -T / 2, top: 16, width: T, height: h - 32, background: "linear-gradient(90deg,#8c877e,#d8d4cc)", transform: "rotateY(-90deg)" }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: 16, overflow: "hidden", transform: `translateZ(${T / 2}px)`,
          border: "6px solid rgba(255,255,255,.94)", boxShadow: "0 40px 90px rgba(0,0,0,.7)", background: "#111",
          WebkitBoxReflect: "below 26px linear-gradient(transparent 62%, rgba(255,255,255,.2))" } as React.CSSProperties}>
          <Vid id={id} from={from} at={at} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${105 + ry * 2}deg, transparent 35%, rgba(255,255,255,.12) 50%, transparent 65%)` }} />
          {label && <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "14px 20px", background: "linear-gradient(0deg, rgba(0,0,0,.85), transparent)", fontFamily: FONT, fontWeight: 900, fontSize: 40, letterSpacing: 4, color: labelCol }}>{label}</div>}
          {children}
        </div>
      </div>
    </div>
  );
};

// X roja que se DIBUJA (dos trazos) sobre una tarjeta
export const DrawX: React.FC<{ t: number; at: number; x: number; y: number; w: number; h: number }> = ({ t, at, x, y, w, h }) => {
  const a = e(t, at, at + 0.16), b = e(t, at + 0.12, at + 0.28);
  if (a <= 0) return null;
  const L = Math.hypot(w, h);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 0 12px rgba(255,60,40,.7)) drop-shadow(0 6px 10px rgba(0,0,0,.6))" }}>
      <line x1={x} y1={y} x2={x + w} y2={y + h} stroke={COL.red} strokeWidth={22} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - a)} />
      <line x1={x + w} y1={y} x2={x} y2={y + h} stroke={COL.red} strokeWidth={22} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - b)} />
    </svg>
  );
};

// número grande extruido que gira en Y y nace desde el fondo
export const BigNum: React.FC<{ t: number; at: number; text: string; x?: number; y?: number; size?: number; col?: string; edge?: string; out?: number; sub?: string }> = ({ t, at, text, x = 960, y = 520, size = 260, col = COL.ink, edge = "#5a4a36", out = 1e9, sub }) => {
  const k = spr(t, at, 0.9), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const ry = (1 - Math.min(1, k)) * -70 + Math.sin((t - at) * 0.9) * 6;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", perspective: 1200, opacity: o }}>
      <div style={{ transform: `translateZ(${(1 - Math.min(1, k)) * -900}px) rotateY(${ry}deg) rotateX(6deg)`, fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, lineHeight: 1, textShadow: extrude(16, edge), textAlign: "center", whiteSpace: "nowrap" }}>
        {text}
        {sub && <div style={{ fontSize: size * 0.2, fontWeight: 800, letterSpacing: 8, color: COL.dim, textShadow: extrude(4, "#000") }}>{sub}</div>}
      </div>
    </div>
  );
};

// rótulo inferior 3D (placa con canto) que sobrevive al corte (motivo que une la toma con el avatar)
export const LowerThird: React.FC<{ t: number; at: number; out: number; name: string; l2: string; l2at: number }> = ({ t, at, out, name, l2, l2at }) => {
  const k = spr(t, at, 0.8), o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.35));
  if (o <= 0.01) return null;
  const n2 = Math.round(l2.length * e(t, l2at, l2at + 0.9));
  return (
    <div style={{ position: "absolute", left: 110, bottom: 120, perspective: 1100, opacity: o }}>
      <div style={{ transformOrigin: "0 50%", transform: `rotateY(${(1 - Math.min(1, k)) * 70 + 10}deg) translateZ(${(1 - Math.min(1, k)) * -200}px)`, transformStyle: "preserve-3d" }}>
        <div style={{ display: "inline-block", padding: "16px 30px 16px 26px", background: "linear-gradient(180deg, rgba(14,22,36,.92), rgba(8,12,20,.92))", borderLeft: `10px solid ${COL.amber}`, borderRadius: 10, boxShadow: "0 30px 60px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.15)" }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: COL.ink, letterSpacing: 3, textShadow: extrude(5, "#000") }}>{name}</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: COL.amber, letterSpacing: 5, minHeight: 38 }}>{l2.slice(0, n2)}<span style={{ opacity: n2 < l2.length && n2 > 0 ? 1 : 0 }}>▌</span></div>
        </div>
      </div>
    </div>
  );
};

// fichas numeradas 3D (los pasos que vienen)
export const Chips: React.FC<{ t: number; at: number; items: string[]; out: number; y?: number }> = ({ t, at, items, out, y = 760 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 34, perspective: 1200 }}>
    {items.map((it, i) => {
      const a = at + i * 0.17, k = Math.min(1.1, spr(t, a)), o = e(t, a, a + 0.1) * (1 - e(t, out + i * 0.05, out + i * 0.05 + 0.25));
      return (
        <div key={i} style={{ opacity: o, transform: `translateY(${(1 - Math.min(1, k)) * 120}px) rotateX(${(1 - Math.min(1, k)) * 70}deg) rotateY(${(i - 1.5) * -6}deg)`, width: 210, padding: "18px 0 14px", borderRadius: 18,
          background: "linear-gradient(180deg, rgba(20,32,52,.95), rgba(10,16,28,.95))", boxShadow: `0 26px 50px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.18), 0 0 0 2px ${COL.ice}55`, textAlign: "center", fontFamily: FONT }}>
          <div style={{ fontWeight: 900, fontSize: 84, color: COL.ice, lineHeight: 1, textShadow: extrude(6, "#0a2a40") }}>{i + 1}</div>
          <div style={{ fontWeight: 800, fontSize: 24, color: COL.ink, letterSpacing: 4, marginTop: 6 }}>{it}</div>
        </div>
      );
    })}
  </div>
);


// ---------- at("frase", después_de): segundo exacto en que la voz dice la frase (Groq → caps.json [palabra, ms]) ----------
import CAPS from "./caps.json";
const norm = (w: string) => w.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9%$]/g, "");
const WORDS = (CAPS as [string, number][]).flatMap(([w, ms]) => w.split(/\s+/).map((x, j) => ({ w: norm(x), t: ms / 1000 + j * 0.3 }))).filter((x) => x.w);
export const at = (phrase: string, after = 0): number => {
  const ws = phrase.split(/\s+/).map(norm).filter(Boolean);
  for (let i = 0; i < WORDS.length; i++) {
    if (WORDS[i].t < after - 0.01) continue;
    let ok = true;
    for (let j = 0; j < ws.length; j++) if (!WORDS[i + j] || WORDS[i + j].w !== ws[j]) { ok = false; break; }
    if (ok) return WORDS[i].t;
  }
  throw new Error(`at(): no encuentro "${phrase}" después de ${after}`);
};
// fin de la frase (cuando termina la última palabra ≈ arranque de la siguiente)
export const atEnd = (phrase: string, after = 0): number => {
  const a = at(phrase, after), n = phrase.split(/\s+/).filter(Boolean).length;
  const i = WORDS.findIndex((x) => x.t >= a - 0.001);
  return WORDS[Math.min(WORDS.length - 1, i + n)].t;
};

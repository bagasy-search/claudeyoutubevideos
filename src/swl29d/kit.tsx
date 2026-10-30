// swl29d · kit de los componentes únicos (1 por minuto). Escenario = el Stage de tdc28a/hkit.tsx (lo que le gustó al creador):
// foto del momento desenfocada atrás con paralaje, piso con charco de luz, haz que respira, polvo delante, entrada por máscara
// con resorte y salida hacia atrás fundida. Paleta Loretta (crema / vino / dorado). Todo sale de t: nada de estado entre cuadros.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont as loadHand } from "@remotion/google-fonts/Caveat";
import { loadFont as loadMark } from "@remotion/google-fonts/PermanentMarker";
import { loadFont as loadSerif } from "@remotion/google-fonts/DMSerifDisplay";
import { loadFont as loadSans } from "@remotion/google-fonts/Inter";
import { P } from "../kits/yanqui3d/lib";

export const { fontFamily: HAND } = loadHand("normal", { weights: ["600", "700"], subsets: ["latin"] });
export const { fontFamily: MARK } = loadMark("normal", { weights: ["400"], subsets: ["latin"] });
export const { fontFamily: SERIF } = loadSerif("normal", { weights: ["400"], subsets: ["latin"] });
export const { fontFamily: SANS } = loadSans("normal", { weights: ["600", "800", "900"], subsets: ["latin"] });

export const K = { cream: "#fbf3e4", paper: "#f3e5cb", ink: "#22150d", wine: "#8e1d2b", wineD: "#4d0c16", gold: "#e3b25c", goldL: "#f8dda4", red: "#e04a36", green: "#7fd69a", ice: "#9fd8ff", tx: "#f7f1e6", dim: "rgba(247,241,230,.62)" };

export const cl = (x: number) => Math.max(0, Math.min(1, x));
// resorte con masa: llega, se pasa un poco y asienta
export const phys = (t: number, a: number, w = 7, z = 0.42) => {
  const x = t - a; if (x <= 0) return 0;
  const wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * x) * (Math.cos(wd * x) + (z * w / wd) * Math.sin(wd * x));
};
export const eio = (t: number, a: number, b: number) => { const c = cl((t - a) / (b - a)); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const eIn = (t: number, a: number, b: number) => { const c = cl((t - a) / (b - a)); return c * c * c; };
export const eOut = (t: number, a: number, b: number) => { const c = cl((t - a) / (b - a)); return 1 - Math.pow(1 - c, 3); };
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
// ruido determinístico (semilla fija)
export const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const img = (id: string) => staticFile(P + "img_" + id + ".jpg");

export type H = { k: string; at: number; out: number; bg?: string; b: number[]; [x: string]: any };
export type Mode = "iris" | "wipe" | "blinds" | "split" | "drop" | "rise";
const maskOf = (m: Mode, p: number): string => {
  if (p > 0.985) return "linear-gradient(#000,#000)";
  if (m === "iris") return `radial-gradient(circle at 50% 52%, #000 ${p * 1500}px, transparent ${p * 1500 + 480}px)`;
  if (m === "wipe") return `linear-gradient(105deg, #000 ${p * 150 - 30}%, transparent ${p * 150}%)`;
  if (m === "split") { const a = 50 - p * 62, b = 50 + p * 62; return `linear-gradient(90deg, transparent ${a}%, #000 ${a + 10}%, #000 ${b - 10}%, transparent ${b}%)`; }
  if (m === "blinds") return `linear-gradient(120deg, #000 ${p * 170 - 60}%, transparent ${p * 170 - 10}%)`;
  if (m === "rise") return `linear-gradient(0deg, #000 ${p * 150 - 30}%, transparent ${p * 150}%)`;
  return `linear-gradient(180deg, #000 ${p * 150 - 30}%, transparent ${p * 150}%)`;
};

// la mesa: tabla de madera en perspectiva con veta, luz cálida que la barre y borde gastado (los objetos apoyan acá)
const Table: React.FC<{ tt: number; tone: string }> = ({ tt, tone }) => {
  const c1 = tone === "cold" ? "#3a4652" : "#5a3a22", c2 = tone === "cold" ? "#2a333c" : "#40281a";
  return <AbsoluteFill style={{ perspective: 1100, perspectiveOrigin: "50% 18%", pointerEvents: "none" }}>
    <div style={{ position: "absolute", left: -900, right: -900, top: 640, height: 1500, transformOrigin: "50% 0", transform: `rotateX(74deg) translateY(${-tt * 6}px)`,
      background: `repeating-linear-gradient(90deg, rgba(0,0,0,.18) 0 2px, transparent 2px 230px), repeating-linear-gradient(90deg, transparent 0 37px, rgba(255,220,170,.035) 37px 39px, transparent 39px 83px), linear-gradient(180deg, ${c1}, ${c2})` }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 52%, rgba(0,0,0,.55) 60%, transparent 66%)" }} />
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 34% 16% at ${50 + 6 * Math.sin(tt * 0.25)}% 80%, rgba(255,214,160,.16), transparent 70%)`, mixBlendMode: "screen" }} />
  </AbsoluteFill>;
};

// escenario. children(tt) con tt = segundos desde h.at. warm = tinte del piso (cocina) o frío (heladera)
export const Stage: React.FC<{ t: number; h: H; mode: Mode; tone?: "warm" | "cold" | "night"; cam?: number; table?: boolean; children: (tt: number) => React.ReactNode }> = ({ t, h, mode, tone = "warm", cam = 1, table = true, children }) => {
  const { at, out } = h;
  if (t < at - 0.05 || t > out + 0.85) return null;
  const inn = phys(t, at, 3.8, 0.72), xo = eIn(t, out - 0.25, out + 0.75), p = cl(inn) * (1 - xo);
  if (p <= 0.004) return null;
  const tt = t - at, mk = maskOf(mode, p);
  const base = tone === "cold" ? "radial-gradient(ellipse 75% 65% at 50% 46%, #17202a, #06080b 72%)" : tone === "night" ? "radial-gradient(ellipse 75% 65% at 50% 46%, #1a1420, #070609 72%)" : "radial-gradient(ellipse 75% 65% at 50% 46%, #241a12, #080605 72%)";
  const pool = tone === "cold" ? "rgba(160,210,255,.12)" : "rgba(255,196,130,.14)";
  return <AbsoluteFill style={{ WebkitMaskImage: mk, maskImage: mk, fontFamily: SANS, color: K.tx } as React.CSSProperties}>
    <AbsoluteFill style={{ background: base }} />
    {h.bg && <AbsoluteFill style={{ opacity: 0.38 }}><Img src={img(h.bg)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(26px) saturate(.8) brightness(.55)", transform: `scale(${1.18 + 0.03 * Math.sin(tt * 0.2)}) translateX(${-14 * tt / Math.max(4, out - at)}px)` }} /></AbsoluteFill>}
    <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 62%, rgba(255,190,120,.05) 74%, rgba(0,0,0,.35) 100%)" }} />
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 42% 14% at 50% 84%, ${pool}, transparent 70%)` }} />
    <AbsoluteFill style={{ background: `conic-gradient(from 168deg at 50% -12%, transparent 0deg, rgba(255,226,180,${0.05 + 0.015 * Math.sin(tt * 0.5)}) 12deg, transparent 24deg)`, mixBlendMode: "screen" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 120% 90% at 50% 50%, transparent 55%, rgba(0,0,0,.55))" }} />
    {table && <Table tt={tt} tone={tone} />}
    {!table ? (() => {
      // (30-oct) sin mesa (Foto): cámara 2D equivalente. Con perspective/preserve-3d la tarjeta era una capa aparte y con swangle
      // a veces la captura salía ANTES de dibujarla (la tarjeta desaparecía 1 cuadro: ~100 destellos por video)
      const Z = (-300 * (1 - inn) - 650 * xo + 18 * Math.sin(tt * 0.35) + 110 * cl(tt / Math.max(4, out - at))) * cam, sc = 2200 / (2200 - Z);
      return <AbsoluteFill style={{ opacity: cl(inn * 1.6) * (1 - xo * 0.7), transform: `translateX(${-26 * Math.sin(tt * 0.3) * cam}px) scale(${sc}) rotate(${(0.25 * Math.sin(tt * 0.22 + 0.5) - 1.2 * xo) * cam}deg)` }}>{children(tt)}</AbsoluteFill>;
    })() :
    <AbsoluteFill style={{ perspective: 2200, opacity: cl(inn * 1.6) * (1 - xo * 0.7) }}>
      <AbsoluteFill style={{ transformStyle: "preserve-3d", transform: `translateZ(${(-300 * (1 - inn) - 650 * xo + 18 * Math.sin(tt * 0.35) + 110 * cl(tt / Math.max(4, out - at))) * cam}px) translateX(${-26 * Math.sin(tt * 0.3) * cam}px) rotateY(${(7 * (1 - inn) + 1.8 * Math.sin(tt * 0.22 + 0.5) - 6 * xo - 2.4 * cl(tt / Math.max(4, out - at))) * cam}deg) rotateX(${(1.2 * Math.sin(tt * 0.18) + 6 * xo) * cam}deg)` }}>
        {children(tt)}
      </AbsoluteFill>
    </AbsoluteFill>}
    <AbsoluteFill style={{ pointerEvents: "none" }}>{Array.from({ length: 14 }, (_, i) => {
      const s = 6 + (i * 37) % 22, x = ((i * 271 + tt * (8 + i % 5) * 4) % 2100) - 90, y = 80 + (i * 163) % 920 + 30 * Math.sin(tt * 0.4 + i);
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", background: "rgba(255,230,190,.5)", filter: `blur(${s / 3}px)`, opacity: 0.25 + 0.2 * Math.sin(tt * 0.7 + i * 1.3) }} />;
    })}</AbsoluteFill>
  </AbsoluteFill>;
};

// encabezado del sistema arriba a la izquierda (kicker + título que se descubre)
// (creador 29-oct) PROHIBIDO el rótulo de esquina arriba a la izquierda: Head queda mudo; la palabra, si hace falta, va DENTRO de la escena (Tag)
export const Head: React.FC<{ tt: number; kick: string; title: string; col?: string; d?: number }> = () => null;

// rótulo que cae con peso
export const Tag: React.FC<{ tt: number; at: number; x: number; y: number; txt: string; col?: string; size?: number; font?: string; rot?: number }> = ({ tt, at, x, y, txt, col = K.tx, size: size0 = 44, font, rot = 0 }) => {
  const size = Math.max(size0, font ? 46 : 38);   // nada chico: se mira en el celular
  const s = phys(tt, at, 7, 0.45);
  if (s <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) translateY(${(1 - s) * -40}px) scale(${0.8 + 0.2 * s}) rotate(${rot * (2 - s)}deg)`, opacity: cl(s * 2), fontFamily: font ?? SANS, fontWeight: 900, fontSize: size, letterSpacing: font ? 0 : 2, color: col, whiteSpace: "nowrap", textShadow: "0 6px 24px rgba(0,0,0,.65)" }}>{txt}</div>;
};

// foto con marco
export const Photo: React.FC<{ id?: string; w: number; h: number; r?: number; z?: number; style?: React.CSSProperties; dim?: number; border?: number }> = ({ id, w, h, r = 18, z = 1.08, style, dim = 0, border = 0 }) => (
  <div style={{ width: w, height: h, borderRadius: r, overflow: "hidden", background: "#1a1a1d", boxShadow: "0 40px 90px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.1)", border: border ? `${border}px solid #f6efe2` : undefined, position: "relative", ...style }}>
    {id && <Img src={img(id)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})` }} />}
    {dim > 0 && <div style={{ position: "absolute", inset: 0, background: "#000", opacity: dim }} />}
  </div>
);

// sombra de contacto que se aprieta al apoyar (k = 0 en el aire, 1 apoyado)
export const Shadow: React.FC<{ x: number; y: number; w: number; k: number; o?: number }> = ({ x, y, w, k, o = 0.55 }) => (
  <div style={{ position: "absolute", left: x - (w * (1.4 - 0.4 * k)) / 2, top: y - 14, width: w * (1.4 - 0.4 * k), height: 28, borderRadius: "50%", background: `radial-gradient(ellipse, rgba(0,0,0,${o * (0.3 + 0.7 * k)}), transparent 70%)`, filter: `blur(${10 - 6 * k}px)` }} />
);

// odómetro de rodillos: rueda hasta v (con decimales fijos) y clava
export const Odo: React.FC<{ tt: number; a: number; b: number; v: number; pre?: string; dec?: number; size?: number; col?: string }> = ({ tt, a, b, v, pre = "", dec = 2, size = 120, col = K.goldL }) => {
  const k = eOut(tt, a, b), cur = v * k, txt = cur.toFixed(dec);
  const digits = txt.split("");
  return <div style={{ display: "flex", alignItems: "center", fontFamily: SANS, fontWeight: 900, fontSize: size, color: col, textShadow: "0 8px 30px rgba(0,0,0,.6)" }}>
    {pre && <span style={{ marginRight: 6 }}>{pre}</span>}
    {digits.map((d, i) => d === "." ? <span key={i}>.</span> : (
      <span key={i} style={{ display: "inline-block", width: size * 0.7, height: size * 1.12, lineHeight: `${size * 1.0}px`, overflow: "hidden", position: "relative", background: "linear-gradient(180deg,#120c08,#2a1d14 50%,#120c08)", borderRadius: 10, margin: "0 3px", boxShadow: "inset 0 10px 18px rgba(0,0,0,.7), inset 0 -10px 18px rgba(0,0,0,.7)" }}>
        <span style={{ position: "absolute", left: 0, right: 0, top: size * 0.06, textAlign: "center", transform: `translateY(${(k < 1 ? -((tt * 40 + i * 3) % 1) * size * 0.4 : 0)}px)` }}>{d}</span>
      </span>
    ))}
  </div>;
};

// KIT de los componentes únicos (1 por minuto, pedido del creador 28-oct: «que se sienta adictivo, que no se repitan»).
// Escenario común: entra con una transición distinta por pieza (iris, barrido, persianas, partido, caída) con resorte,
// cámara viva en curvas y salida hacia atrás fundida. Cada componente sólo dibuja su objeto adentro.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont as loadHand } from "@remotion/google-fonts/Caveat";
import { loadFont as loadMark } from "@remotion/google-fonts/PermanentMarker";
import { COL, FONT, P } from "./lib";

export const { fontFamily: HAND } = loadHand("normal", { weights: ["600", "700"], subsets: ["latin"] });
export const { fontFamily: MARK } = loadMark("normal", { weights: ["400"], subsets: ["latin"] });
export { FONT, COL };

export const phys = (t: number, a: number, w = 7, z = 0.42) => {
  const x = t - a; if (x <= 0) return 0;
  const wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * x) * (Math.cos(wd * x) + (z * w / wd) * Math.sin(wd * x));
};
export const cl = (x: number) => Math.max(0, Math.min(1, x));
export const eIn = (t: number, a: number, b: number) => { const c = cl((t - a) / (b - a)); return c * c * c; };
export const eio = (t: number, a: number, b: number) => { const c = cl((t - a) / (b - a)); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const img = (id: string) => staticFile("img/" + P + id + ".jpg");
export const TX = "#f7f4ee", DIM = "rgba(247,244,238,.58)", AMB = COL.amber, RED = "#ff5a4a", ICE = COL.ice, GRN = "#6fe39a";

export type H = { k: string; at: number; out: number; img?: string; imgs?: (string | undefined)[]; [x: string]: any };
export type Mode = "iris" | "wipe" | "blinds" | "split" | "drop";

const maskOf = (m: Mode, p: number): string => {
  if (m === "iris") return `radial-gradient(circle at 50% 52%, #000 ${p * 1500}px, transparent ${p * 1500 + 480}px)`;
  if (m === "wipe") return `linear-gradient(105deg, #000 ${p * 150 - 30}%, transparent ${p * 150}%)`;
  if (m === "split") { const a = 50 - p * 62, b = 50 + p * 62; return `linear-gradient(90deg, transparent ${a}%, #000 ${a + 10}%, #000 ${b - 10}%, transparent ${b}%)`; }
  // persianas: con la pantalla llena la máscara pasa a sólida (con rendijas de 0 px Chrome dejaba cuadros sueltos oscuros = destellos, tdc28a 25:33)
  if (m === "blinds") { if (p > 0.9) return "linear-gradient(#000,#000)"; const w = p * 178; return `repeating-linear-gradient(90deg, #000 0px, #000 ${w}px, transparent ${w}px, transparent 160px)`; }
  return `linear-gradient(180deg, #000 ${p * 150 - 30}%, transparent ${p * 150}%)`;
};

// escenario: fondo + máscara de entrada/salida + cámara curva. children recibe tt (segundos desde at).
export const Stage: React.FC<{ t: number; h: H; mode: Mode; bg?: string; cam?: number; children: (tt: number) => React.ReactNode }> = ({ t, h, mode, bg, cam = 1, children }) => {
  const { at, out } = h;
  if (t < at - 0.05 || t > out + 0.85) return null;
  const inn = phys(t, at, 3.8, 0.72), xo = eIn(t, out - 0.25, out + 0.75), p = cl(inn) * (1 - xo);
  if (p <= 0.004) return null;
  const tt = t - at, mk = maskOf(mode, p);
  return <AbsoluteFill style={{ WebkitMaskImage: mk, maskImage: mk, fontFamily: FONT, color: TX } as React.CSSProperties}>
    <AbsoluteFill style={{ background: bg ?? "radial-gradient(ellipse 75% 65% at 50% 46%, #1d1a16, #070708 72%)" }} />
    {/* la foto del momento, desenfocada y oscura, con paralaje lento: el componente vive DENTRO de la escena, no sobre un fondo vacío */}
    {h.bg && !bg && <AbsoluteFill style={{ opacity: 0.38 }}><Img src={img(h.bg)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(26px) saturate(.8) brightness(.55)", transform: `scale(${1.18 + 0.03 * Math.sin(tt * 0.2)}) translateX(${-14 * tt / Math.max(4, out - at)}px)` }} /></AbsoluteFill>}
    {/* piso: charco de luz cálida y reflejo, para que los objetos apoyen en algo */}
    <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 62%, rgba(255,190,120,.05) 74%, rgba(0,0,0,.35) 100%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 42% 14% at 50% 86%, rgba(255,196,130,.13), transparent 70%)" }} />
    {/* haz de luz de arriba que respira muy lento */}
    <AbsoluteFill style={{ background: `conic-gradient(from 168deg at 50% -12%, transparent 0deg, rgba(255,226,180,${0.05 + 0.015 * Math.sin(tt * 0.5)}) 12deg, transparent 24deg)`, mixBlendMode: "screen" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 120% 90% at 50% 50%, transparent 55%, rgba(0,0,0,.55))" }} />
    <AbsoluteFill style={{ perspective: 2200, opacity: cl(inn * 1.6) * (1 - xo * 0.7) }}>
      <AbsoluteFill style={{ transformStyle: "preserve-3d", transform: `translateZ(${(-300 * (1 - inn) - 650 * xo + 18 * Math.sin(tt * 0.35)) * cam}px) rotateY(${(7 * (1 - inn) + 1.8 * Math.sin(tt * 0.22 + 0.5) - 6 * xo) * cam}deg) rotateX(${(1.2 * Math.sin(tt * 0.18) + 6 * xo) * cam}deg)` }}>
        {children(tt)}
      </AbsoluteFill>
    </AbsoluteFill>
    {/* polvo en primer plano, desenfocado, por delante de la cámara: da profundidad real */}
    <AbsoluteFill style={{ pointerEvents: "none" }}>{Array.from({ length: 14 }, (_, i) => {
      const s = 6 + (i * 37) % 22, x = ((i * 271 + tt * (8 + i % 5) * 4) % 2100) - 90, y = 80 + (i * 163) % 920 + 30 * Math.sin(tt * 0.4 + i);
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", background: "rgba(255,230,190,.5)", filter: `blur(${s / 3}px)`, opacity: 0.25 + 0.2 * Math.sin(tt * 0.7 + i * 1.3) }} />;
    })}</AbsoluteFill>
  </AbsoluteFill>;
};

// encabezado del sistema (filete + kicker + título que se descubre); arriba a la izquierda
export const Head: React.FC<{ tt: number; kick: string; title: string; col?: string; d?: number }> = ({ tt, kick, title, col = AMB, d = 0.3 }) => {
  const s = cl(phys(tt, d, 6, 0.7));
  return <div style={{ position: "absolute", left: 110, top: 80, opacity: s, transform: `translateX(${(1 - s) * -40}px)` }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14, fontWeight: 800, fontSize: 24, letterSpacing: 5, color: DIM }}><div style={{ width: 34 * s, height: 3, borderRadius: 2, background: col }} />{kick}</div>
    <div style={{ fontWeight: 900, fontSize: 60, marginTop: 6, clipPath: `inset(0 ${(1 - s) * 100}% 0 0)`, whiteSpace: "nowrap" }}>{title}</div>
  </div>;
};

// rótulo que cae con peso
export const Tag: React.FC<{ tt: number; at: number; x: number; y: number; txt: string; col?: string; size?: number; anchor?: "c" | "l" }> = ({ tt, at, x, y, txt, col = TX, size = 34, anchor = "c" }) => {
  const s = phys(tt, at, 7, 0.45);
  if (s <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(${anchor === "c" ? "-50%" : "0"}, -50%) translateY(${(1 - s) * -40}px) scale(${0.8 + 0.2 * s})`, opacity: cl(s * 2), fontWeight: 900, fontSize: size, letterSpacing: 2, color: col, whiteSpace: "nowrap", textShadow: "0 6px 24px rgba(0,0,0,.6)" }}>{txt}</div>;
};

// foto con marco (tarjeta) reutilizable
export const Photo: React.FC<{ id?: string; w: number; h: number; r?: number; z?: number; style?: React.CSSProperties; dim?: number }> = ({ id, w, h, r = 18, z = 1.08, style, dim = 0 }) => (
  <div style={{ width: w, height: h, borderRadius: r, overflow: "hidden", background: "#1a1a1d", boxShadow: "0 40px 90px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.1)", position: "relative", ...style }}>
    {id && <Img src={img(id)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})` }} />}
    {dim > 0 && <div style={{ position: "absolute", inset: 0, background: "#000", opacity: dim }} />}
  </div>
);

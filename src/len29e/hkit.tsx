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
  // persianas DESCARTADAS (29-oct: las 21 hojas del evaluador las leen como glitch de barras negras con el título roto) → iris
  if (m === "blinds") return maskOf("iris", p);
  if (false) { if (p > 0.9) return "linear-gradient(#000,#000)"; const w = p * 178; return `repeating-linear-gradient(90deg, #000 0px, #000 ${w}px, transparent ${w}px, transparent 160px)`; }
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
      <AbsoluteFill style={{ transformStyle: "flat", perspective: 2200, transform: `translateZ(${(-300 * (1 - inn) - 650 * xo + 18 * Math.sin(tt * 0.35) + 150 * Math.pow(cl(tt / Math.max(3, out - at)), 1.4)) * cam}px) translateX(${-26 * Math.sin(Math.PI * cl(tt / Math.max(3, out - at))) * cam}px) rotateY(${(7 * (1 - inn) + 1.8 * Math.sin(tt * 0.22 + 0.5) - 3.2 * cl(tt / Math.max(3, out - at)) - 6 * xo) * cam}deg) rotateX(${(1.2 * Math.sin(tt * 0.18) + 6 * xo) * cam}deg)`, filter: "drop-shadow(0 26px 22px rgba(0,0,0,.5)) drop-shadow(0 4px 4px rgba(0,0,0,.35))" }}>
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
// regla del creador (29-oct): nada de rótulos arriba a la izquierda; Head queda mudo
export const Head: React.FC<{ tt: number; kick: string; title: string; col?: string; d?: number }> = () => null;
export const HeadViejo: React.FC<{ tt: number; kick: string; title: string; col?: string; d?: number }> = ({ tt, kick, title, col = AMB, d = 0.3 }) => {
  const s = cl(phys(tt, d, 6, 0.7));
  return <div style={{ position: "absolute", left: 110, top: 80, opacity: s, transform: `translateX(${(1 - s) * -40}px)` }}>
    {/* sin kicker (29-oct: ilegible en celular); queda el filete de color */}<div style={{ width: 54 * s, height: 4, borderRadius: 2, background: col }} />
    <div style={{ fontWeight: 900, fontSize: 62, marginTop: 6, whiteSpace: "nowrap", transform: `translateY(${(1 - s) * 26}px)`, textShadow: "0 8px 30px rgba(0,0,0,.7)" }}>{title}</div>
  </div>;
};

// rótulo que cae con peso
export const Tag: React.FC<{ tt: number; at: number; x: number; y: number; txt: string; col?: string; size?: number; anchor?: "c" | "l" }> = ({ tt, at, x, y, txt, col = TX, size = 34, anchor = "c" }) => {
  const s = phys(tt, at, 7, 0.45);
  if (s <= 0.01) return null;
  const fs = Math.max(40, Math.round(size * 1.2)), half = (txt.length * fs * 0.72 + 8) / (anchor === "c" ? 2 : 1);
  // cuadro seguro con margen para el acercamiento de cámara del Stage (29-oct: rótulos cortados al borde derecho)
  x = anchor === "c" ? Math.min(1740 - half, Math.max(180 + half, x)) : Math.min(1740 - half, Math.max(180, x));
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(${anchor === "c" ? "-50%" : "0"}, -50%) translateY(${(1 - s) * -40}px) scale(${0.8 + 0.2 * s})`, opacity: cl(s * 2), fontWeight: 900, fontSize: fs, letterSpacing: 2, color: col, whiteSpace: "nowrap", textShadow: "0 6px 24px rgba(0,0,0,.6)" }}>{txt}</div>;
};

// foto con marco (tarjeta) reutilizable
export const Photo: React.FC<{ id?: string; w: number; h: number; r?: number; z?: number; style?: React.CSSProperties; dim?: number }> = ({ id, w, h, r = 18, z = 1.08, style, dim = 0 }) => (
  <div style={{ width: w, height: h, borderRadius: r, overflow: "hidden", background: "#1a1a1d", boxShadow: "0 40px 90px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.1)", position: "relative", ...style }}>
    {id && <Img src={img(id)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})` }} />}
    {dim > 0 && <div style={{ position: "absolute", inset: 0, background: "#000", opacity: dim }} />}
  </div>
);

// ---- volumen: degradés de material para los SVG (caño de PVC, cromo, bronce, vidrio, agua, madera, goma) ----
// uso: <svg><Defs />…<rect fill="url(#pvcV)" /></svg>  (V = cilindro acostado: luz arriba; H = parado: luz a la izquierda)
export const Defs: React.FC = () => <defs>
  {([["pvc", "#ffffff", "#e9e5dc", "#b9b3a6"], ["chrome", "#ffffff", "#c3cad0", "#5d656c"], ["brass", "#fff0b8", "#d6aa4a", "#7a5417"], ["iron", "#9aa0a6", "#5f656b", "#2c3034"],
    ["rubber", "#ff7a62", "#c2302a", "#6e1410"], ["wood", "#e8b980", "#b07c46", "#6b4421"], ["grease", "#fff4c8", "#e3cf8e", "#a48a3e"], ["yellow", "#fff3a8", "#f2c230", "#a77d06"]] as const).map(([k, a, b, c]) => <React.Fragment key={k}>
    <linearGradient id={k + "V"} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={b} /><stop offset="0.22" stopColor={a} /><stop offset="0.55" stopColor={b} /><stop offset="1" stopColor={c} /></linearGradient>
    <linearGradient id={k + "H"} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={b} /><stop offset="0.22" stopColor={a} /><stop offset="0.55" stopColor={b} /><stop offset="1" stopColor={c} /></linearGradient>
    <radialGradient id={k + "R"} cx="0.35" cy="0.3" r="0.75"><stop offset="0" stopColor={a} /><stop offset="0.5" stopColor={b} /><stop offset="1" stopColor={c} /></radialGradient>
  </React.Fragment>)}
  <linearGradient id="waterV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#bfe8ff" stopOpacity="0.95" /><stop offset="0.12" stopColor="#7fc4ea" stopOpacity="0.85" /><stop offset="1" stopColor="#2f6f9a" stopOpacity="0.9" /></linearGradient>
  <linearGradient id="glassH" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#ffffff" stopOpacity="0.35" /><stop offset="0.12" stopColor="#ffffff" stopOpacity="0.08" /><stop offset="0.8" stopColor="#ffffff" stopOpacity="0.04" /><stop offset="0.92" stopColor="#ffffff" stopOpacity="0.3" /><stop offset="1" stopColor="#ffffff" stopOpacity="0.08" /></linearGradient>
  <radialGradient id="shadowR" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#000" stopOpacity="0.6" /><stop offset="1" stopColor="#000" stopOpacity="0" /></radialGradient>
  <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6" /></filter>
</defs>;
// sombra de contacto (elipse difusa bajo un objeto apoyado)
export const Shadow: React.FC<{ x: number; y: number; w: number; o?: number }> = ({ x, y, w, o = 1 }) => <ellipse cx={x} cy={y} rx={w / 2} ry={w / 9} fill="url(#shadowR)" opacity={o} />;
// la FOTO real del momento como objeto en el espacio: llega con resorte desde atrás, inclinada, con brillo que la barre y sombra en el piso
export const Card3D: React.FC<{ tt: number; at: number; id?: string; x: number; y: number; w: number; h: number; ry?: number; rz?: number; z?: number; children?: React.ReactNode }> = ({ tt, at, id, x, y, w, h, ry = -14, rz = -2, z = 1.12, children }) => {
  const s = phys(tt, at, 4.6, 0.5); if (s <= 0.005) return null;
  const sweep = cl((tt - at - 0.5) / 1.1);
  return <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transform: `translate(-50%,-50%) perspective(1800px) translateZ(${(1 - s) * -900}px) translateY(${(1 - s) * 160}px) rotateY(${ry * (0.6 + 0.4 * s) + 2 * Math.sin(tt * 0.4)}deg) rotateZ(${rz}deg) rotateX(${(1 - s) * 30}deg)`, opacity: cl(s * 2.2) }}>
    <div style={{ position: "absolute", left: "8%", right: "8%", bottom: -h * 0.12, height: h * 0.16, background: "radial-gradient(ellipse at center, rgba(0,0,0,.65), transparent 70%)", filter: "blur(10px)" }} />
    <div style={{ position: "absolute", inset: 0, borderRadius: 16, overflow: "hidden", background: "#1a1a1d", boxShadow: "0 40px 90px rgba(0,0,0,.65), 0 0 0 2px rgba(255,255,255,.12)" }}>
      {id && <Img src={img(id)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z + 0.04 * cl((tt - at) / 6)})` }} />}
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, transparent ${sweep * 140 - 40}%, rgba(255,255,255,.22) ${sweep * 140 - 25}%, transparent ${sweep * 140 - 10}%)` }} />
      {children}
    </div>
  </div>;
};

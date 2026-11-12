// ck11c · look 242 «cookbook de iglesia»: papel crema, tinta marrón, sello FROM MY CHURCH COOKBOOK.
// Mecanismos propios de este video (distintos de ck11a/ck11b): la receta se escribe a MÁQUINA en la página del recetario (tecla por tecla,
// el carro avanza), el tablero de corcho del salón de la iglesia (tarjetas y fotos pinchadas con chinches), la planilla de anotación
// del potluck en tabla con clip, y la etiqueta de cartón con el nombre atada a la tapa de la fuente. Sin filtros, grano, viñeta ni temblor.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont as loadType } from "@remotion/google-fonts/SpecialElite";
import { loadFont as loadSerif } from "@remotion/google-fonts/Lora";
import { loadFont as loadHand } from "@remotion/google-fonts/PatrickHand";

export const { fontFamily: TYPE } = loadType("normal", { weights: ["400"], subsets: ["latin"] });
export const { fontFamily: SERIF } = loadSerif("normal", { weights: ["400", "700"], subsets: ["latin"] });
export const { fontFamily: HAND } = loadHand("normal", { weights: ["400"], subsets: ["latin"] });

export const K = {
  cream: "#f4ead2", cream2: "#eadcbc", ink: "#5a3a22", ink2: "#7a5236", stamp: "#9b3b2a", cork1: "#b98a58", cork2: "#a77a4b",
  pin: "#c43d32", pin2: "#2f6aa8", pin3: "#d9b13b", wall: "#e8e1cf", shadow: "rgba(30,18,6,.45)", board: "#8a6a45", clip: "#b9bcc0",
};
export const cl = (x: number) => Math.max(0, Math.min(1, x));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const eOut = (t: number, a: number, b: number) => { const c = cl((t - a) / (b - a)); return 1 - Math.pow(1 - c, 3); };
export const eIO = (t: number, a: number, b: number) => { const c = cl((t - a) / (b - a)); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const spr = (t: number, a: number, w = 8, z = 0.5) => {
  const x = t - a; if (x <= 0) return 0;
  const wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * x) * (Math.cos(wd * x) + (z * w / wd) * Math.sin(wd * x));
};
export const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const hash = (s: string) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); };
export const sf = (p: string) => staticFile(p);
// balanceo lento de cámara en mano (permitido): sólo deriva suave, nunca temblor
export const drift = (t: number, seed: number, amp = 1) => ({
  x: amp * (5 * Math.sin(t * 0.25 + seed) + 2 * Math.sin(t * 0.57 + seed * 2)),
  y: amp * (4 * Math.sin(t * 0.19 + seed * 3) + 2 * Math.sin(t * 0.49 + seed)),
});

// tablero de corcho del salón de la iglesia, con marco de madera; luz de los tubos del techo de arriba
export const Cork: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ background: K.board }}>
    <div style={{ position: "absolute", inset: 22, background: `linear-gradient(160deg, ${K.cork1}, ${K.cork2})`, boxShadow: "inset 0 0 0 3px rgba(60,35,10,.35), inset 0 10px 30px rgba(0,0,0,.25)" }}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 20% 30%, rgba(80,45,15,.18) 0 1.5px, transparent 2px), radial-gradient(circle at 70% 60%, rgba(255,230,190,.16) 0 1px, transparent 1.6px)", backgroundSize: "9px 11px, 13px 7px" }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 60% at ${45 + 3 * Math.sin(t * 0.08)}% 8%, rgba(255,250,235,.32), transparent 70%)` }} />
    </div>
  </AbsoluteFill>
);

// mesa larga del salón con mantel blanco de papel (fondo de las piezas «de mesa»)
export const Hall: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg,#f3efe6,#e2dccd)" }}>
    <AbsoluteFill style={{ background: "repeating-linear-gradient(90deg, rgba(0,0,0,.025) 0 2px, transparent 2px 160px), repeating-linear-gradient(0deg, rgba(0,0,0,.02) 0 1px, transparent 1px 90px)" }} />
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 55% at ${50 + 2 * Math.sin(t * 0.1)}% 0%, rgba(255,255,255,.6), transparent 70%)` }} />
  </AbsoluteFill>
);

export const BlurBg: React.FC<{ src?: string | null; t: number; dim?: number }> = ({ src, t, dim = 0.3 }) => (
  <AbsoluteFill style={{ background: "#2b241b", overflow: "hidden" }}>
    {src && <Img src={sf(src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(26px)", transform: `scale(${1.15 + 0.01 * t})` }} />}
    <AbsoluteFill style={{ background: "#16110b", opacity: dim }} />
  </AbsoluteFill>
);

// chinche (vista de arriba, con brillo y sombra)
export const Pin: React.FC<{ x: number; y: number; c?: string; k?: number }> = ({ x, y, c = K.pin, k = 1 }) => (
  <div style={{ position: "absolute", left: x - 16, top: y - 16, width: 32, height: 32, borderRadius: 16, background: `radial-gradient(circle at 35% 30%, #fff8 0 4px, ${c} 6px, ${c} 60%, rgba(0,0,0,.35))`,
    boxShadow: `${5 * k}px ${8 * k}px 6px rgba(0,0,0,.35)`, transform: `scale(${lerp(1.8, 1, k)})`, opacity: cl(k * 3) }} />
);

// sello de goma «FROM MY CHURCH COOKBOOK» (marca del canal), cae y deja la tinta
export const Stamp: React.FC<{ k: number; x: number; y: number; rot?: number; size?: number }> = ({ k, x, y, rot = -8, size = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `rotate(${rot}deg) scale(${size * lerp(1.6, 1, cl(k))})`, opacity: k > 0 ? 0.82 : 0, border: `5px solid ${K.stamp}`, borderRadius: 10, padding: "8px 20px",
    fontFamily: TYPE, fontSize: 30, letterSpacing: 4, color: K.stamp, lineHeight: "36px", textAlign: "center", mixBlendMode: "multiply" }}>
    FROM MY<br />CHURCH COOKBOOK
  </div>
);

// página del recetario de la iglesia (papel crema con margen y número de página)
export const Page: React.FC<{ w: number; h: number; children?: React.ReactNode; style?: React.CSSProperties; folio?: string }> = ({ w, h, children, style, folio }) => (
  <div style={{ position: "relative", width: w, height: h, background: K.cream, boxShadow: `0 30px 60px ${K.shadow}, 0 2px 0 ${K.cream2}`, overflow: "hidden", ...style }}>
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 90% 80% at 30% 20%, rgba(255,255,255,.4), transparent 70%), radial-gradient(ellipse 60% 40% at 90% 100%, rgba(170,130,70,.18), transparent 70%)" }} />
    <div style={{ position: "absolute", left: 60, right: 60, top: 54, height: 2, background: "rgba(90,58,34,.35)" }} />
    {folio && <div style={{ position: "absolute", bottom: 26, width: "100%", textAlign: "center", fontFamily: SERIF, fontSize: 24, color: K.ink2 }}>{folio}</div>}
    {children}
  </div>
);

// ScrapStage.tsx — ESCENARIO del canal "The Scrap Workshop" (EN/US, handyman de taller).
//
// ⛔ LA VARA DEL CANAL ES *VLOG CRUDO* (feedback_edicion_vlog_casero_claudio):
// planos reales a sangre, cortes secos, CERO cine. Este archivo es deliberadamente pobre:
// dos primitivas (Clip / Foto) + la cama de foto + tipografía. Todo lo demás que viva en
// `src/tswcement/` tiene que ser un PANEL LATERAL sobrio que deja ver el plano de abajo,
// nunca una tarjeta a pantalla completa que congele la imagen.
//
// ⛔ OffthreadVideo SIEMPRE, NUNCA <Video>: en el render <Video> busca por tiempo, no acierta
// el cuadro exacto, y repite/saltea de forma irregular = TIRÓN en todo el metraje.
import React from "react";
import {
  AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame,
} from "remotion";
import { F_OSWALD, F_INTER } from "../VideoEdit/kit/premium/theme";

// ── PALETA: hormigón + acento ROJO (la flecha de la miniatura) + AZUL de la llama ────────────
export const V = {
  ink0: "#0D0F0D",        // negro del canal (fondo garantizado bajo todo)
  ink1: "#171A16",
  concrete: "#B9B5AC",    // el cuerpo de cemento
  concreteDim: "#6E6B63",
  red: "#C8392B",         // el acento del canal — alerta y subrayado
  redDeep: "#8E2318",
  flame: "#2F86F0",       // el AZUL de la llama buena
  warn: "#E0A32B",        // el naranja de la llama sucia = advertencia
  white: "#F4F1EA",
  bone: "#CFC8B8",
};
export const F_DISPLAY = F_OSWALD;
export const F_BODY = F_INTER;

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
/** hash determinístico. ⛔ Nunca Math.random: el farm rinde en 60 chunks separados y cada uno
 *  tiene que dar exactamente el mismo cuadro. */
export const rnd = (k: number) => {
  const x = Math.sin(k * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
export const rgba = (hex: string, a: number) => {
  let h = (hex || "#000").replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const x = parseInt(h, 16);
  if (!Number.isFinite(x)) return `rgba(0,0,0,${a})`;
  return `rgba(${(x >> 16) & 255},${(x >> 8) & 255},${x & 255},${a})`;
};

export const enter = (frame: number, frames = 8) => interpolate(frame, [0, frames], [0, 1], {
  extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad),
});
/** salida: se va sola en los últimos 8 cuadros, así el panel nunca corta en seco. */
export const leave = (frame: number, dur: number, frames = 8) =>
  interpolate(frame, [Math.max(0, dur - frames), dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// ── PRIMITIVAS DEL VLOG ──────────────────────────────────────────────────────────────────────

/** CLIP a sangre. Empuje mínimo por CSS: sin él, un clip que el i2v dejó casi quieto se lee
 *  como cuadro CONGELADO, que es peor que una foto (a la foto el Ken-Burns sí la mueve). */
export const Clip: React.FC<{ src: string; rate?: number }> = ({ src, rate = 1 }) => {
  const frame = useCurrentFrame();
  const a = enter(frame, 6);
  const z = interpolate(frame, [0, 180], [1.012, 1.032], { extrapolateLeft: "clamp", extrapolateRight: "extend", easing: Easing.linear });
  const x = interpolate(frame, [0, 180], [-0.3, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "extend", easing: Easing.linear });
  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(src)} muted playbackRate={rate}
        style={{ width: "100%", height: "100%", objectFit: "cover", opacity: a, transform: `scale(${z.toFixed(4)}) translateX(${x.toFixed(3)}%)` }} />
    </AbsoluteFill>
  );
};

/** FOTO con Ken-Burns lento y determinista por `seed`. */
export const Foto: React.FC<{ src: string; seed?: number }> = ({ src, seed = 1 }) => {
  const frame = useCurrentFrame();
  const dir = rnd(seed) > 0.5 ? 1 : -1;
  const z = interpolate(frame, [0, 260], [1.02, 1.08], { extrapolateLeft: "clamp", extrapolateRight: "extend", easing: Easing.bezier(0.22, 0.61, 0.28, 1) });
  const x = interpolate(frame, [0, 260], [dir * -0.75, dir * 0.95], { extrapolateLeft: "clamp", extrapolateRight: "extend", easing: Easing.linear });
  const y = Math.sin((frame + (seed % 91)) / 99) * 0.15;
  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z.toFixed(4)}) translate(${x.toFixed(3)}%, ${y.toFixed(3)}%)` }} />
    </AbsoluteFill>
  );
};

/** CAMA DE FOTO — va debajo de TODO panel que la acepte, para que el margen del panel nunca
 *  muestre el fondo plano. Si no se pasa `src`, cae a un degradado oscuro (nunca negro puro). */
export const PhotoBed: React.FC<{ src?: string; dim?: number }> = ({ src, dim = 0.55 }) => {
  const frame = useCurrentFrame();
  const z = 1.04 + Math.sin(frame / 240) * 0.012;
  if (!src) return <AbsoluteFill style={{ background: `radial-gradient(120% 100% at 50% 0%, ${V.ink1} 0%, ${V.ink0} 72%)` }} />;
  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `brightness(${(1 - dim).toFixed(2)}) saturate(0.85)`, transform: `scale(${z.toFixed(4)})` }} />
      <AbsoluteFill style={{ background: `linear-gradient(90deg, ${rgba(V.ink0, 0.86)} 0%, ${rgba(V.ink0, 0.38)} 58%, ${rgba(V.ink0, 0.2)} 100%)` }} />
    </AbsoluteFill>
  );
};

// ── TIPOGRAFÍA ───────────────────────────────────────────────────────────────────────────────
export const Kick: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = V.red }) => (
  <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 25, letterSpacing: 3.6, textTransform: "uppercase", color }}>{children}</div>
);
export const Head: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({ children, size = 62, color = V.white }) => (
  <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: size, lineHeight: 1.04, color, letterSpacing: "0.004em", textShadow: "0 5px 26px rgba(0,0,0,0.9), 0 2px 5px rgba(0,0,0,0.85)" }}>{children}</div>
);
export const Body: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({ children, size = 31, color = V.bone }) => (
  <div style={{ fontFamily: F_BODY, fontWeight: 500, fontSize: size, lineHeight: 1.32, color, textShadow: "0 3px 15px rgba(0,0,0,0.85)" }}>{children}</div>
);

/** PANEL LATERAL — el único envase que usa este canal. Ocupa una franja a la izquierda y deja
 *  el plano de abajo CORRIENDO a la derecha.
 *
 *  ⛔⛔ NO LLEVA CAMA DE FOTO, y es a propósito. La cama es una imagen QUIETA: puesta encima de
 *  un clip vivo lo tapa y congela la pantalla los 8-13 s que dura el panel — que es exactamente
 *  el defecto que el creador de este canal marca siempre ("se congela", "parece una diapositiva").
 *  El contraste del texto lo da un degradado oscuro pegado al borde izquierdo, que se disuelve
 *  antes de la mitad del cuadro. Así el panel se lee Y el plano sigue vivo.
 *  (La regla de "cama de foto bajo todo componente" viene de canales donde el componente ocupa
 *  la pantalla entera; acá no la ocupa, y la cama haría daño en vez de bien.)
 *  ⛔ Y NUNCA a pantalla completa. */
export const Panel: React.FC<{
  children: React.ReactNode; durationInFrames: number; bed?: string; width?: number;
}> = ({ children, durationInFrames, width = 830 }) => {
  const frame = useCurrentFrame();
  const a = enter(frame, 9) * leave(frame, durationInFrames, 9);
  const dx = interpolate(frame, [0, 14], [-26, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ opacity: a }}>
      <AbsoluteFill style={{ background: `linear-gradient(90deg, ${rgba(V.ink0, 0.88)} 0%, ${rgba(V.ink0, 0.7)} 34%, ${rgba(V.ink0, 0)} 62%)` }} />
      <AbsoluteFill style={{ justifyContent: "center", padding: "0 0 0 76px" }}>
        <div style={{
          width, transform: `translateX(${dx.toFixed(2)}px)`,
          background: `linear-gradient(180deg, ${rgba(V.ink0, 0.9)} 0%, ${rgba(V.ink0, 0.95)} 100%)`,
          borderLeft: `7px solid ${V.red}`,
          padding: "40px 46px 42px 40px",
          boxShadow: `0 24px 70px ${rgba(V.ink0, 0.8)}`,
        }}>{children}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

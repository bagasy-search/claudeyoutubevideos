// RingStage.tsx — ESCENARIO COMPARTIDO del video `mdring` (canal Mike Dalton, EN).
//
// Se escribe UNA vez, ANTES de lanzar los subagentes de movimientos, y TODOS lo consumen. Es lo que
// hace que siete movimientos escritos por siete agentes distintos se lean como UN video: la misma
// perspectiva, el mismo suelo, la misma atmósfera, el mismo grade y las mismas primitivas de material.
//
// ⛔ LA REGLA QUE MANDA ACÁ: **una tarjeta que es sólo una forma con texto se lee como CÓDIGO EN
// PANTALLA.** Adentro de cada tarjeta va MATERIAL REAL — un clip corriendo (`MediaCard kind="video"`)
// o una foto (`kind="photo"`) — con su marco, su sombra de contacto y su profundidad. Los vectores
// quedan para lo que ES un gráfico (una curva, un eje, una flecha), NUNCA para hacer de objeto real.
//
// Lo que exporta, y para qué:
//   · `RING` / `F_SANS` / `F_SERIF` — paleta y tipografías del canal (rojo/negro/blanco).
//   · `gcam(f, o)`   — LA CÁMARA. Función del frame GLOBAL del movimiento; nunca vuelve a 0.
//   · `RingAtmos`    — la atmósfera: se monta UNA vez por movimiento y no se remonta entre actos.
//   · `Layers`       — 6 planos de profundidad con parallax propio (`preserve-3d` + `translateZ`).
//   · `MediaCard`    — TARJETA FLOTANTE CON VIDEO O FOTO ADENTRO. El caballo de batalla.
//   · `Carousel3D`   — carrusel 3D real de MediaCards (no un fan 2D con rotate).
//   · `PhotoPlane`   — foto a sangre como plano de fondo, con parallax y grade del canal.
//   · `IconPng`      — logo/ícono PNG sin fondo como OBJETO de la escena (opcional).
//   · `Seam*`        — las costuras: Occlude, WipeMatter, ZoomThrough. ⛔ no hay fade.
//   · `Kick/Head/Em/Bed` — tipografía con cama oscura (legibilidad +60).
//
// CONTRATO TÉCNICO (cada punto costó un render, no lo toques):
//   ⛔ nada de Math.random()/Date.now(): el farm rinde en chunks paralelos → todo función pura del frame.
//   ⛔ nada de backdrop-filter (×5 el tiempo de render): el vidrio se hace con gradientes + inset shadow.
//   ⛔ Easing.quint NO EXISTE → Easing.poly(5).
//   ⛔ safe area 60px; los planos con translateZ alto se AGRANDAN por perspectiva.
import React from "react";
import {
  AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame, interpolate, Easing,
} from "remotion";

// ── PALETA / TIPOGRAFÍA ─────────────────────────────────────────────────────────────────────
export const RING = {
  ink0: "#08080A",
  ink1: "#131418",
  ink2: "#1D1F24",
  red: "#E4322A",
  redHot: "#FF5A4E",
  white: "#FFFFFF",
  bone: "#EDE9E2",
  cold: "#9FB6C8",   // la luz fría de la ventanita del baño
  warm: "#C89B6A",   // el rebote cálido del pasillo
  porcelain: "#F2F0EC",
};
export const F_SANS = "Inter, system-ui, sans-serif";
export const F_SERIF = "'Playfair Display', Georgia, serif";

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const eio = (a: number, b: number, t: number) =>
  lerp(a, b, interpolate(clamp01(t), [0, 1], [0, 1], { easing: Easing.bezier(0.22, 0.61, 0.28, 1) }));
// hash determinístico: reemplaza a Math.random() (obligatorio, el farm rinde en paralelo)
export const rnd = (k: number) => {
  const x = Math.sin(k * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
export const rgba = (hex: string, a: number) => {
  if (hex.startsWith("rgb")) return hex.replace(/rgb\(([^)]+)\)/, `rgba($1,${a})`);
  const x = parseInt(hex.replace("#", ""), 16);
  return `rgba(${(x >> 16) & 255},${(x >> 8) & 255},${x & 255},${a})`;
};

// ── LA CÁMARA ───────────────────────────────────────────────────────────────────────────────
// Función del frame GLOBAL del movimiento. El acto 3 hereda la posición y la inercia del acto 2
// porque LA MISMA llamada sigue avanzando: ningún acto la reinicia.
// `dur` es el tramo sobre el que viaja; después de `dur` queda en su destino (con deriva viva).
export const gcam = (
  frame: number,
  o: { z0?: number; z1?: number; panX?: number; panY?: number; ry?: number; rx?: number; dur?: number } = {},
) => {
  const { z0 = 0, z1 = 160, panX = 0, panY = 0, ry = 0, rx = 0, dur = 900 } = o;
  const t = clamp01(frame / dur);
  const e = interpolate(t, [0, 1], [0, 1], { easing: Easing.bezier(0.19, 0.63, 0.26, 1) });
  // deriva viva: nunca hay un frame perfectamente quieto (regla del hold VIVO)
  const bx = Math.sin(frame / 49) * 2.1 + Math.sin(frame / 113) * 1.3;
  const by = Math.cos(frame / 63) * 1.7;
  const z = lerp(z0, z1, e);
  return {
    z, e,
    transform:
      `perspective(1500px) translateZ(${z.toFixed(2)}px) ` +
      `translate3d(${(panX * e + bx).toFixed(2)}px, ${(panY * e + by).toFixed(2)}px, 0) ` +
      `rotateY(${(ry * e).toFixed(3)}deg) rotateX(${(rx * e).toFixed(3)}deg)`,
  };
};

// ── LA LUZ ──────────────────────────────────────────────────────────────────────────────────
export const light = (t: number, from: "cold" | "warm" | "red" = "cold", to: "cold" | "warm" | "red" = "cold") => {
  const C = { cold: RING.cold, warm: RING.warm, red: RING.red } as const;
  const p = (h: string) => { const x = parseInt(h.replace("#", ""), 16); return [(x >> 16) & 255, (x >> 8) & 255, x & 255]; };
  const [r1, g1, b1] = p(C[from]), [r2, g2, b2] = p(C[to]);
  const k = clamp01(t);
  return `rgb(${Math.round(lerp(r1, r2, k))},${Math.round(lerp(g1, g2, k))},${Math.round(lerp(b1, b2, k))})`;
};

// ── LA ATMÓSFERA ────────────────────────────────────────────────────────────────────────────
// Se monta UNA vez por movimiento, al fondo, y NUNCA se remonta entre actos.
export const RingAtmos: React.FC<{ tint?: string; keyFrom?: number; intensity?: number }> = ({
  tint = RING.cold, keyFrom = 0.24, intensity = 1,
}) => {
  const frame = useCurrentFrame();
  const kx = (16 + keyFrom * 66).toFixed(1);
  const breathe = 0.93 + Math.sin(frame / 87) * 0.055;
  return (
    <AbsoluteFill style={{ backgroundColor: RING.ink0, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(120% 92% at ${kx}% -8%, ${rgba(tint, 0.20 * intensity * breathe)} 0%, ${rgba(tint, 0.06 * intensity)} 34%, rgba(0,0,0,0) 66%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(90% 70% at 88% 108%, ${rgba(RING.warm, 0.10 * intensity)} 0%, rgba(0,0,0,0) 62%)` }} />
      {/* suelo: la sombra de contacto de todo lo que flota aterriza acá */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 52%, rgba(0,0,0,0.55) 100%)" }} />
      {/* grano constante: la misma piel de imagen en todos los actos */}
      <AbsoluteFill style={{ opacity: 0.05, backgroundImage: "repeating-conic-gradient(rgba(255,255,255,.5) 0% 25%, rgba(0,0,0,.5) 0% 50%)", backgroundSize: "3px 3px", mixBlendMode: "overlay" }} />
    </AbsoluteFill>
  );
};

// ── PROFUNDIDAD REAL: 6 planos con parallax propio ──────────────────────────────────────────
export const Layers: React.FC<{ children: React.ReactNode; cam: string }> = ({ children, cam }) => (
  <AbsoluteFill style={{ transform: cam, transformStyle: "preserve-3d", transformOrigin: "50% 50%" }}>
    {children}
  </AbsoluteFill>
);
export const Plane: React.FC<{ z: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ z, children, style }) => (
  <AbsoluteFill style={{ transform: `translateZ(${z}px)`, transformStyle: "preserve-3d", ...style }}>{children}</AbsoluteFill>
);

// ── ⭐ MEDIA CARD — LA TARJETA FLOTANTE CON MATERIAL REAL ADENTRO ────────────────────────────
// Ésta es la primitiva que separa "premium" de "código en pantalla". Adentro va un CLIP o una FOTO.
// Trae: marco de vidrio, bisel, reflejo superior, barrido especular, sombra de contacto que aterriza
// en el suelo de la atmósfera, y micro-deriva (hold vivo).
export const MediaCard: React.FC<{
  src: string;                      // "broll/mdring_h27_headinbowl.mp4" | "img/mdring_h27_headinbowl.jpg"
  kind?: "video" | "photo";
  w?: number; h?: number;
  x?: number; y?: number;           // % de pantalla (centro de la tarjeta)
  z?: number;                       // profundidad en el espacio 3D
  ry?: number; rx?: number; rot?: number;
  radius?: number;
  startFrom?: number;               // frame de entrada dentro del clip
  lit?: number;                     // 0..1 cuánto la ilumina la key
  label?: string;                   // rótulo bajo la tarjeta (opcional)
  sheenAt?: number;                 // frame del barrido especular
  grade?: boolean;                  // grade del canal encima del material
  opacity?: number;
}> = ({
  src, kind = "video", w = 520, h = 300, x = 50, y = 50, z = 0,
  ry = 0, rx = 0, rot = 0, radius = 14, startFrom = 0, lit = 1, label,
  sheenAt = -999, grade = true, opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 41 + x) * 2.4;         // hold VIVO: nunca perfectamente quieta
  const driftR = Math.sin(frame / 67 + y) * 0.5;
  const sheen = sheenAt > -900 ? clamp01((frame - sheenAt) / 26) : -1;
  return (
    <div
      style={{
        position: "absolute", left: `${x}%`, top: `${y}%`,
        width: w, height: h, marginLeft: -w / 2, marginTop: -h / 2,
        transform: `translateZ(${z}px) rotateY(${(ry + driftR).toFixed(2)}deg) rotateX(${rx}deg) rotate(${rot}deg) translateY(${drift.toFixed(2)}px)`,
        transformStyle: "preserve-3d",
        borderRadius: radius,
        opacity,
        // sombra de contacto que ATERRIZA (iluminación de producto) + sombra ambiental
        boxShadow: `0 ${Math.round(h * 0.16)}px ${Math.round(h * 0.22)}px ${rgba(RING.ink0, 0.72)}, 0 4px 16px ${rgba(RING.ink0, 0.6)}`,
        overflow: "hidden",
        // el marco de vidrio: bisel por inset, NUNCA backdrop-filter
        border: `1px solid ${rgba(RING.white, 0.22 * lit)}`,
      }}
    >
      {kind === "video" ? (
        <OffthreadVideo src={staticFile(src)} muted startFrom={startFrom}
          style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      )}
      {grade && <AbsoluteFill style={{ background: rgba(RING.red, 0.05), mixBlendMode: "soft-light" }} />}
      {/* bisel + reflejo superior del vidrio */}
      <AbsoluteFill style={{ boxShadow: `inset 0 1px 0 ${rgba(RING.white, 0.32 * lit)}, inset 0 0 ${Math.round(h * 0.2)}px ${rgba(RING.ink0, 0.5)}` }} />
      <AbsoluteFill style={{ background: `linear-gradient(178deg, ${rgba(RING.white, 0.14 * lit)} 0%, rgba(255,255,255,0) 26%)` }} />
      {/* barrido especular: la tarjeta se lee como VIDRIO, no como recorte */}
      {sheen >= 0 && sheen <= 1 && (
        <AbsoluteFill style={{
          background: `linear-gradient(104deg, rgba(255,255,255,0) 38%, ${rgba(RING.white, 0.26)} 50%, rgba(255,255,255,0) 62%)`,
          transform: `translateX(${lerp(-130, 130, sheen).toFixed(1)}%)`, mixBlendMode: "screen",
        }} />
      )}
      {label && (
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 0, padding: "26px 16px 10px",
          background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(6,6,8,0.86) 60%)",
          fontFamily: F_SANS, fontWeight: 800, fontSize: 22, letterSpacing: 1.6,
          color: RING.white, textTransform: "uppercase",
        }}>{label}</div>
      )}
    </div>
  );
};

// ── CARRUSEL 3D REAL de MediaCards ──────────────────────────────────────────────────────────
// Las tarjetas orbitan en un cilindro real (rotateY + translateZ), no un abanico 2D.
export const Carousel3D: React.FC<{
  items: { src: string; kind?: "video" | "photo"; label?: string }[];
  spin: number;        // 0..1 → vuelta completa
  radius?: number;
  cardW?: number; cardH?: number;
  y?: number;
  focus?: number;      // índice que recibe la key
}> = ({ items, spin, radius = 620, cardW = 420, cardH = 250, y = 50, focus = 0 }) => {
  const n = Math.max(1, items.length);
  return (
    <AbsoluteFill style={{ transformStyle: "preserve-3d" }}>
      {items.map((it, i) => {
        const a = (i / n) * 360 + spin * 360;
        const rad = (a * Math.PI) / 180;
        const zz = Math.cos(rad) * radius;
        const xx = Math.sin(rad) * radius;
        const depth = (zz + radius) / (2 * radius);       // 0 atrás · 1 adelante
        return (
          <MediaCard
            key={i}
            src={it.src} kind={it.kind} label={it.label}
            w={cardW} h={cardH}
            x={50 + (xx / 1920) * 100} y={y}
            z={zz}
            ry={-a}
            lit={0.35 + 0.65 * depth}
            opacity={0.28 + 0.72 * depth}
            sheenAt={i === focus ? 0 : -999}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ── FOTO A SANGRE como plano de fondo (con parallax y grade del canal) ──────────────────────
export const PhotoPlane: React.FC<{ src: string; z?: number; scale?: number; dim?: number; kind?: "video" | "photo"; startFrom?: number }> = ({
  src, z = -400, scale = 1.18, dim = 0.42, kind = "photo", startFrom = 0,
}) => {
  const frame = useCurrentFrame();
  const px = Math.sin(frame / 121) * 8;
  return (
    <AbsoluteFill style={{ transform: `translateZ(${z}px) translateX(${px.toFixed(1)}px) scale(${scale})`, overflow: "hidden" }}>
      {kind === "video"
        ? <OffthreadVideo src={staticFile(src)} muted startFrom={startFrom} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
      <AbsoluteFill style={{ background: `rgba(8,8,10,${dim})` }} />
      <AbsoluteFill style={{ background: rgba(RING.red, 0.045), mixBlendMode: "soft-light" }} />
    </AbsoluteFill>
  );
};

// ── ÍCONO/LOGO PNG SIN FONDO como objeto de la escena (opcional) ─────────────────────────────
export const IconPng: React.FC<{ src: string; x: number; y: number; size?: number; z?: number; opacity?: number }> = ({
  src, x, y, size = 120, z = 0, opacity = 1,
}) => {
  const frame = useCurrentFrame();
  return (
    <Img src={staticFile(src)} style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: size, height: "auto",
      marginLeft: -size / 2, opacity,
      transform: `translateZ(${z}px) translateY(${(Math.sin(frame / 53) * 3).toFixed(2)}px)`,
      filter: `drop-shadow(0 12px 26px ${rgba(RING.ink0, 0.8)})`,
    }} />
  );
};

// ── COSTURAS (⛔ NUNCA un fade) ──────────────────────────────────────────────────────────────
// OCLUSIÓN: algo grande cruza y tapa el 100% durante 3-6 frames. Ahí se cambia de acto.
export const SeamOcclude: React.FC<{ at: number; dur?: number; color?: string; angle?: number }> = ({
  at, dur = 14, color = RING.ink1, angle = 8,
}) => {
  const frame = useCurrentFrame();
  const p = clamp01((frame - at) / dur);
  if (p <= 0 || p >= 1) return null;
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div style={{
        position: "absolute", top: "-60%", left: `${lerp(-160, 160, p).toFixed(1)}%`,
        width: "300%", height: "220%",
        background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${color} 12%, ${color} 88%, rgba(0,0,0,0) 100%)`,
        transform: `rotate(${angle}deg)`,
      }} />
    </AbsoluteFill>
  );
};
// WIPE POR MATERIA: vapor/agua cruza y detrás ya está lo nuevo.
export const SeamWipeMatter: React.FC<{ at: number; dur?: number; tint?: string }> = ({ at, dur = 20, tint = RING.cold }) => {
  const frame = useCurrentFrame();
  const p = clamp01((frame - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const puffs = 14;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: puffs }, (_, i) => {
        const o = rnd(i * 3.1);
        const yy = 12 + rnd(i * 7.7) * 76;
        return (
          <div key={i} style={{
            position: "absolute", top: `${yy}%`, left: `${lerp(-30, 130, clamp01(p * 1.5 - o * 0.4)).toFixed(1)}%`,
            width: 240 + o * 260, height: 240 + o * 260, borderRadius: "50%",
            background: `radial-gradient(circle, ${rgba(tint, 0.20 * Math.sin(p * Math.PI))}, rgba(0,0,0,0) 68%)`,
            filter: "blur(14px)",
          }} />
        );
      })}
    </AbsoluteFill>
  );
};
// FLASH ÓPTICO corto (corte por beat). No es un fade: dura 3-6 frames.
export const SeamFlash: React.FC<{ at: number; color?: string; dur?: number }> = ({ at, color = RING.redHot, dur = 8 }) => {
  const frame = useCurrentFrame();
  const p = clamp01(1 - Math.abs(frame - at) / dur);
  if (p <= 0) return null;
  return <AbsoluteFill style={{ background: rgba(color, 0.3 * p), mixBlendMode: "screen", pointerEvents: "none" }} />;
};

// ── TIPOGRAFÍA (legibilidad +60: titular ≥48px, cama oscura obligatoria) ─────────────────────
export const Kick: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = RING.red }) => (
  <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 27, letterSpacing: 3.4, textTransform: "uppercase", color }}>{children}</div>
);
export const Head: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({ children, size = 74, color = RING.white }) => (
  <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: size, lineHeight: 1.04, color, textShadow: "0 6px 30px rgba(0,0,0,0.92), 0 2px 6px rgba(0,0,0,0.85)" }}>{children}</div>
);
export const Em: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = RING.redHot }) => (
  <span style={{ fontFamily: F_SERIF, fontStyle: "italic", fontWeight: 500, color }}>{children}</span>
);
export const Bed: React.FC<{ children: React.ReactNode; pad?: number; w?: number | string }> = ({ children, pad = 26, w = "auto" }) => (
  <div style={{
    width: w, padding: pad, borderRadius: 14,
    background: "linear-gradient(180deg, rgba(6,6,8,0.88) 0%, rgba(6,6,8,0.68) 100%)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.62)",
  }}>{children}</div>
);

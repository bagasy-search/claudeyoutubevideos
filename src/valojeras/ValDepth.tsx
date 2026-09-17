// RoweDepth.tsx — primitivas de PROFUNDIDAD para los set-pieces del canal Dr. Emmett Rowe.
//
// Idioma: navy de tinta (#0A1220) + TEAL clínico (#4AA8E0) + ÁMBAR (números / oro del nombre) + ROJO
// sólo para la alerta. Todo set-piece se arma con los mismos 5 planos:
//   0 atmósfera (foto real desenfocada + grade)  1 bokeh lejano  2 plano medio (secundarios con blur)
//   3 hero (tarjeta de vidrio con FOTO adentro)   4 texto / sellos   + luz que barre + grano + viñeta
// ⛔ Sin backdrop-filter (x5 el render en el farm): el vidrio es gradiente + canto + sombra.
// ⛔ Sin Math.random (el farm rinde en paralelo): todo sale de rnd(k).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile } from "remotion";
import { VAL, FONT_DISPLAY, FONT_SERIF, FONT_SANS } from "../valeria/theme";

// Paleta de los set-pieces re-pieleada a la marca Valeria (papel crema, tinta espresso, latón, terracota).
// Mismos NOMBRES que el kit Rowe: ink0/1/2 = papeles (fondo) · white = TINTA (texto) · brass = latón · danger = terracota
export const V = {
  ink0: VAL.paper, ink1: VAL.paperWarm, ink2: VAL.paperDeep,
  brass: VAL.gold, brassSoft: VAL.goldDark, amber: VAL.goldDark,
  danger: VAL.terracotta, dangerSoft: "#B8664C",
  white: VAL.ink, bone: VAL.ink2, steel: VAL.inkSoft, ok: VAL.sage,
};
export const F_DISPLAY = FONT_DISPLAY;
export const F_BODY = FONT_SERIF;
export const F_SANS = FONT_SANS;
export const rnd = (k: number) => { const x = Math.sin(k * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const rgba = (hex: string, a: number) => {
  let h = (hex || "#000").replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const x = parseInt(h, 16);
  return `rgba(${(x >> 16) & 255},${(x >> 8) & 255},${x & 255},${a})`;
};
export const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const eOut = Easing.out(Easing.cubic);
export const eIO = Easing.bezier(0.4, 0, 0.2, 1);
export const ramp = (f: number, a: number, b: number, ease = eOut) => interpolate(f, [a, b], [0, 1], { ...CL, easing: ease });
export const spr = (f: number, fps: number, delay: number, damping = 120, mass = 0.85) =>
  spring({ frame: f - delay, fps, config: { damping, mass } });
export const GOLD = "linear-gradient(100deg, #8C6A2A 0%, #E9C46E 32%, #FFF0C4 50%, #E9C46E 68%, #8C6A2A 100%)";
export const src = (p: string) => (p.startsWith("http") ? p : staticFile(p));

/** Plano 0 + 1: foto real desenfocada con parallax lento, grade navy, bokeh que deriva, haz de luz, grano y viñeta. */
export const Atmosphere: React.FC<{
  frame: number; img?: string; blur?: number; dim?: number; tint?: string; bokeh?: number; seed?: number; camX?: number;
}> = ({ frame, img, blur = 14, dim = 0.55, tint = V.brass, bokeh = 9, seed = 3, camX = 0 }) => {
  const z = 1.14 + Math.sin(frame / 260) * 0.02;
  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {img ? (
        <Img src={src(img)} style={{
          position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
          filter: `blur(${blur}px) brightness(1.04) saturate(0.8) sepia(0.12)`,
          transform: `scale(${z.toFixed(4)}) translateX(${(camX * -0.35).toFixed(2)}px)`,
        }} />
      ) : null}
      <AbsoluteFill style={{ background: `radial-gradient(90% 80% at 50% 45%, ${rgba(V.ink0, 0.35 + dim * 0.45)} 0%, ${rgba(V.ink1, 0.6 + dim * 0.35)} 100%)` }} />
      {Array.from({ length: bokeh }).map((_, i) => {
        const s = 120 + rnd(seed * 31 + i) * 300;
        const x = rnd(seed * 17 + i * 3) * 100, y = rnd(seed * 13 + i * 7) * 100;
        const dy = Math.sin(frame / (90 + i * 13) + i) * 26;
        const dx = camX * (0.15 + rnd(i + seed) * 0.35);
        const col = i % 3 === 0 ? VAL.goldLite : tint;
        return (
          <div key={i} style={{
            position: "absolute", left: `${x}%`, top: `${y}%`, width: s, height: s, borderRadius: "50%",
            background: `radial-gradient(circle, ${rgba(col, 0.22 + rnd(i * 9 + seed) * 0.16)} 0%, ${rgba(col, 0)} 68%)`,
            transform: `translate(-50%,-50%) translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`,
          }} />
        );
      })}
      {/* haz de luz diagonal que cruza lento */}
      <AbsoluteFill style={{
        background: `linear-gradient(115deg, transparent ${(frame * 0.35) % 160 - 40}%, ${rgba("#ffffff", 0.18)} ${(frame * 0.35) % 160 - 25}%, transparent ${(frame * 0.35) % 160 - 10}%)`,
      }} />
    </AbsoluteFill>
  );
};

/** Capas de acabado: polvo en suspensión (delante), grano y viñeta. Va ÚLTIMA. */
export const Finish: React.FC<{ frame: number; motes?: number; seed?: number; camX?: number }> = ({ frame, motes = 22, seed = 5, camX = 0 }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    {Array.from({ length: motes }).map((_, i) => {
      const x = (rnd(seed + i * 5) * 100 + frame * (0.01 + rnd(i) * 0.03)) % 100;
      const y = (rnd(seed * 3 + i) * 100 - frame * (0.02 + rnd(i * 2) * 0.04) + 200) % 100;
      const s = 2 + rnd(i * 11) * 5;
      return <div key={i} style={{
        position: "absolute", left: `${x}%`, top: `${y}%`, width: s, height: s, borderRadius: "50%",
        background: rgba(VAL.goldLite, 0.25 + rnd(i * 7) * 0.35), filter: `blur(${(rnd(i * 13) * 2).toFixed(1)}px)`,
        transform: `translateX(${(camX * 1.4).toFixed(1)}px)`,
      }} />;
    })}
    <AbsoluteFill style={{ opacity: 0.05, backgroundImage: "repeating-conic-gradient(rgba(255,250,240,.5) 0% 25%, rgba(90,60,30,.35) 0% 50%)", backgroundSize: "3px 3px", mixBlendMode: "overlay" }} />
    <AbsoluteFill style={{ background: `radial-gradient(120% 110% at 50% 46%, transparent 55%, ${rgba(VAL.paperEdge, 0.55)} 100%)` }} />
  </AbsoluteFill>
);

/** Plano parallax: se desplaza con la cámara según su profundidad (0 lejos · 1 cerca). */
export const Plane: React.FC<{ depth: number; camX: number; camY?: number; z?: number; children: React.ReactNode }> = ({ depth, camX, camY = 0, z = 0, children }) => (
  <AbsoluteFill style={{ zIndex: z, transform: `translate(${(camX * (depth - 0.4) * 2.2).toFixed(2)}px, ${(camY * (depth - 0.4) * 2.2).toFixed(2)}px)` }}>{children}</AbsoluteFill>
);

/** Tarjeta de VIDRIO con FOTO adentro: canto con espesor, specular, sombra de objeto sólido, etiqueta opcional. */
export const GlassPhoto: React.FC<{
  img?: string; w: number; h: number; blur?: number; label?: string; sub?: string; dim?: number; glow?: string; glowK?: number;
  radius?: number; push?: number; desat?: number; children?: React.ReactNode; labelSize?: number;
}> = ({ img, w, h, blur = 0, label, sub, dim = 0, glow, glowK = 0, radius = 26, push = 0, desat = 0, children, labelSize = 38 }) => (
  <div style={{
    width: w, height: h, borderRadius: radius, position: "relative", overflow: "hidden",
    border: `6px solid ${VAL.card}`, outline: `1px solid ${rgba(VAL.gold, 0.55)}`,
    boxShadow: [
      `0 2px 0 ${rgba("#ffffff", 0.08)} inset`,
      `0 ${Math.round(h * 0.07)}px ${Math.round(h * 0.16)}px ${rgba(VAL.ink, 0.28)}`,
      `0 8px 18px ${rgba(VAL.ink, 0.18)}`,
      glow && glowK > 0 ? `0 0 0 3px ${rgba(glow, 0.9 * glowK)}, 0 0 ${Math.round(70 * glowK)}px ${rgba(glow, 0.55 * glowK)}` : "",
    ].filter(Boolean).join(", "),
    filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : undefined,
    background: V.ink1,
  }}>
    {img ? <Img src={src(img)} style={{
      position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
      transform: `scale(${(1.04 + push).toFixed(4)})`,
      filter: `saturate(${(1 - desat * 0.85).toFixed(2)}) brightness(${(1 - dim * 0.45).toFixed(2)})`,
    }} /> : null}
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg, ${rgba("#ffffff", 0.2)} 0%, transparent 34%, transparent 70%, ${rgba("#ffffff", 0.18)} 100%)` }} />
    {label ? (
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "56px 22px 20px", background: `linear-gradient(transparent, ${rgba(VAL.card, 0.96)} 55%)` }}>
        <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: labelSize, lineHeight: 1.05, color: V.white, letterSpacing: 0.2 }}>{label}</div>
        {sub ? <div style={{ fontFamily: F_BODY, fontWeight: 600, fontSize: 24, color: V.brassSoft, marginTop: 6 }}>{sub}</div> : null}
      </div>
    ) : null}
    {children}
  </div>
);

/** Cámara viva: push-in lento + deriva + temblor de impacto en los golpes. */
export const useCam = (frame: number, fps: number, hits: number[] = [], push = 0.05, len = 150) => {
  const p = interpolate(frame, [0, len], [1, 1 + push], { ...CL, easing: eOut });
  const drift = Math.sin(frame / fps * 0.45) * 9;
  const driftY = Math.cos(frame / fps * 0.33) * 5;
  let shake = 0, punch = 0;
  for (const h of hits) {
    const t = frame - h;
    if (t >= 0 && t < 8) { shake += Math.sin(t * 2.4) * 4 * (1 - t / 8); punch += Math.sin((t / 8) * Math.PI) * 0.012; }
  }
  return { scale: p + punch, camX: drift + shake, camY: driftY };
};

/** Trazo de tachado con oclusión (se dibuja en `u` 0..1). */
export const SlashLine: React.FC<{ d: string; u: number; width?: number; color?: string }> = ({ d, u, width = 20, color = V.danger }) => (
  <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }} viewBox="0 0 1920 1080" preserveAspectRatio="none">
    <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - u}
      style={{ filter: `drop-shadow(0 4px 8px rgba(60,40,20,0.3))` }} />
  </svg>
);

/** Kicker con regla teal (tipografía del canal). */
export const KickerRule: React.FC<{ text: string; a: number; color?: string; center?: boolean }> = ({ text, a, color = V.brass, center }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: center ? "center" : "flex-start", opacity: a }}>
    <div style={{ width: 60 * a, height: 3, background: color, boxShadow: "none" }} />
    <div style={{ fontFamily: F_SANS, fontWeight: 700, fontSize: 28, letterSpacing: 5, textTransform: "uppercase", color }}>{text}</div>
  </div>
);

/** Envoltura de SEGMENTO para set-pieces que vuelven varias veces (carrusel, autotest): entra por
 *  zoom-through con motion-blur y sale igual, sin fundido a negro. */
export const SegmentShell: React.FC<{ frame: number; dur: number; children: React.ReactNode; inF?: number; outF?: number }> = ({ frame, dur, children, inF = 9, outF = 8 }) => {
  const a = ramp(frame, 0, inF);
  const b = 1 - ramp(frame, dur - outF, dur, Easing.in(Easing.cubic));
  const k = Math.min(a, b);
  const s = frame < dur / 2 ? 1.12 - 0.12 * a : 1 + 0.08 * (1 - b);
  return (
    <AbsoluteFill style={{ opacity: Math.min(1, k * 1.6), transform: `scale(${s.toFixed(4)})`, filter: k < 0.999 ? `blur(${((1 - k) * 14).toFixed(2)}px)` : undefined }}>
      {children}
    </AbsoluteFill>
  );
};

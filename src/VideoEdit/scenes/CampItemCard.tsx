import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { COLORS, FONT_STACK } from "../theme";

// CampItemCard — revelación de cada ítem de una LISTA LARGA (hecho para "25 breakfasts", sirve
// para cualquier top de 10-30). Fondo de cook-shack en penumbra, foto-héroe enmarcada CON
// PROFUNDIDAD (la misma foto blureada detrás, inclinación 3D que se endereza), número grande
// con numerales old-style + "of 25", nombre en serif, una línea corta, y un riel COMPACTO de
// casilleros (25 entran en 760 px: el riel de Top7Card no escala a más de ~10).
// Brasas que suben y un resplandor cálido que late: la escena nunca está quieta.
// ⛔ Sólo IMÁGENES en `image` (jpg/png): nada de <Video> en render (tirón).
export const CampItemCard: React.FC<{
  durationInFrames: number;
  rank: number;
  total?: number;
  name: string;
  note?: string;
  image: string;
  eyebrow?: string;
  numPrefix?: string;
  ofWord?: string;
  side?: "left" | "right";
}> = ({ durationInFrames, rank, total = 25, name, note, image, eyebrow = "Breakfast", numPrefix = "No.", ofWord = "of", side = "left" }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const D = Math.max(20, durationInFrames);
  const inO = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const outO = interpolate(frame, [D - 10, D], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = inO * outO;
  const flip = side === "right";

  const card = spring({ frame: frame - 2, fps, config: { damping: 15, mass: 0.9, stiffness: 120 } });
  const rotY = interpolate(card, [0, 1], [flip ? 24 : -24, flip ? 5 : -5]);
  const rotZ = interpolate(card, [0, 1], [flip ? 4 : -4, flip ? 1.2 : -1.2]);
  const tx = interpolate(card, [0, 1], [flip ? 260 : -260, 0]);
  const float = Math.sin(frame / 28) * 6;
  const kb = interpolate(frame, [0, D], [1.04, 1.14]);

  const numIn = spring({ frame: frame - 9, fps, config: { damping: 13, stiffness: 160 } });
  const nameIn = spring({ frame: frame - 16, fps, config: { damping: 18 } });
  const noteIn = spring({ frame: frame - 24, fps, config: { damping: 18 } });
  const railIn = interpolate(frame, [12, 12 + Math.min(40, D * 0.4)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const glow = 0.55 + Math.sin(frame / 11) * 0.12;

  const HERO_W = 780, HERO_H = 860;
  const heroLeft = flip ? width - 150 - HERO_W : 150;
  const colLeft = flip ? 150 : 1010;
  const acc = COLORS.amber;

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK, opacity: op, background: "radial-gradient(120% 110% at 50% 45%, #2E2419 0%, #1C1610 58%, #0E0B07 100%)" }}>
      {/* resplandor de estufa detrás de la foto */}
      <div style={{ position: "absolute", left: heroLeft - 120, top: 60, width: HERO_W + 240, height: HERO_H + 120, borderRadius: "50%", background: `radial-gradient(closest-side, rgba(214,140,60,${0.32 * glow}), transparent)`, filter: "blur(30px)" }} />
      {/* brasas */}
      {Array.from({ length: 14 }).map((_, i) => {
        const t = ((frame / fps) * (0.18 + (i % 5) * 0.035) + i * 0.137) % 1;
        const x = ((i * 137) % 100) / 100 * width;
        const y = height * (1.02 - t * 1.1);
        const s = 3 + (i % 4);
        return <div key={i} style={{ position: "absolute", left: x + Math.sin(t * 9 + i) * 22, top: y, width: s, height: s, borderRadius: "50%", background: "#F2A54A", boxShadow: "0 0 10px 3px rgba(242,140,50,0.8)", opacity: Math.sin(t * Math.PI) * 0.8 }} />;
      })}
      <AbsoluteFill style={{ boxShadow: "inset 0 0 300px 80px rgba(0,0,0,0.65)" }} />

      {/* foto-héroe con profundidad */}
      <div style={{ position: "absolute", left: heroLeft, top: (1080 - HERO_H) / 2, width: HERO_W, height: HERO_H, perspective: 1400 }}>
        <div style={{
          width: "100%", height: "100%", transform: `translateX(${tx}px) translateY(${float}px) rotateY(${rotY}deg) rotate(${rotZ}deg) scale(${interpolate(card, [0, 1], [0.86, 1])})`,
          borderRadius: 22, padding: 12, background: "#EFE7D3",
          boxShadow: "0 60px 120px rgba(0,0,0,0.65), 0 14px 34px rgba(0,0,0,0.5)",
        }}>
          <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 14, overflow: "hidden", background: "#1C1610" }}>
            <Img src={staticFile(image)} style={{ position: "absolute", inset: -40, width: "calc(100% + 80px)", height: "calc(100% + 80px)", objectFit: "cover", filter: "blur(24px) brightness(0.65)" }} />
            <Img src={staticFile(image)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${kb})` }} />
            <AbsoluteFill style={{ background: "radial-gradient(75% 80% at 50% 40%, transparent 55%, rgba(20,14,8,0.45) 100%)" }} />
            <div style={{ position: "absolute", left: 0, bottom: 0, width: "100%", height: 7, background: acc }} />
          </div>
        </div>
      </div>

      {/* columna de texto */}
      <div style={{ position: "absolute", left: colLeft, top: 140, width: 760, height: 800, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: 9, textTransform: "uppercase", color: acc, opacity: numIn }}>{eyebrow}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginTop: 4, opacity: numIn, transform: `translateY(${interpolate(numIn, [0, 1], [30, 0])}px) scale(${interpolate(numIn, [0, 1], [1.25, 1])})`, transformOrigin: "left bottom" }}>
          <span style={{ fontSize: 62, fontWeight: 600, color: acc, fontStyle: "italic" }}>{numPrefix}</span>
          <span style={{ fontSize: 250, fontWeight: 800, lineHeight: 0.86, color: "#F3EAD6", textShadow: "0 8px 30px rgba(0,0,0,0.6)" }}>{rank}</span>
          <span style={{ fontSize: 48, fontWeight: 600, color: "rgba(243,234,214,0.55)" }}>{ofWord} {total}</span>
        </div>
        <div style={{ fontSize: name.length > 26 ? 66 : 80, fontWeight: 700, fontStyle: "italic", color: "#F3EAD6", lineHeight: 1.04, marginTop: 10, opacity: nameIn, transform: `translateY(${interpolate(nameIn, [0, 1], [26, 0])}px)`, textShadow: "0 4px 18px rgba(0,0,0,0.55)" }}>{name}</div>
        {note ? (
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 24, opacity: noteIn, transform: `translateY(${interpolate(noteIn, [0, 1], [18, 0])}px)` }}>
            <div style={{ width: 6, height: 44, background: acc, borderRadius: 3 }} />
            <div style={{ fontSize: 38, fontWeight: 500, color: "rgba(243,234,214,0.82)" }}>{note}</div>
          </div>
        ) : null}
        {/* riel compacto */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginTop: 54 }}>
          {Array.from({ length: total }, (_, i) => {
            const n = i + 1, done = n < rank, cur = n === rank;
            const vis = interpolate(railIn * total, [i, i + 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const h = cur ? 44 + Math.sin(frame / 6) * 3 : done ? 26 : 18;
            return <div key={n} style={{ width: cur ? 18 : 12, height: h, borderRadius: 4, opacity: vis, background: cur ? acc : done ? "rgba(214,160,90,0.55)" : "rgba(243,234,214,0.16)", boxShadow: cur ? `0 0 18px ${acc}` : "none" }} />;
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

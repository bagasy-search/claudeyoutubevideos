// LorSnapshot — una foto de época (Instamatic/Kodachrome desvaída) que cae como copia de papel con borde blanco sobre
// la mesa de madera, encima de otras copias; push lento. LorEraTimeline — 1955→1978: las copias caen a lo largo de una
// línea de tiempo y entran "los intrusos" (la caja de mezcla, el tub) que las empujan y las apagan.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { LOR, SERIF, HAND, rnd } from "./LorTheme";

const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
export const Wood: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg,#8C6239 0%,#7A5431 100%)" }}>
    <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0 3px, transparent 3px 90px), repeating-linear-gradient(90deg, rgba(255,230,190,0.05) 0 1px, transparent 1px 37px)", opacity: 0.9 }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 40% 30%, rgba(255,240,210,0.25), transparent 60%)" }} />
  </AbsoluteFill>
);

export const Print: React.FC<{ src?: string; w: number; rot: number; faded?: number; blank?: boolean }> = ({ src, w, rot, faded = 0, blank }) => (
  <div style={{ width: w, padding: w * 0.028, paddingBottom: w * 0.07, background: "#FBF7EE", rotate: `${rot}deg`, boxShadow: "0 18px 40px rgba(0,0,0,0.45), 0 2px 4px rgba(0,0,0,0.3)" }}>
    {blank ? <div style={{ width: "100%", aspectRatio: "1088/608", background: "#D9CDB5" }} /> : (
      <Img src={staticFile(src!)} style={{ width: "100%", aspectRatio: "1088/608", objectFit: "cover", display: "block", filter: `saturate(${0.92 - faded * 0.8}) sepia(${faded * 0.6}) brightness(${1 - faded * 0.15})` }} />
    )}
  </div>
);

export const LorSnapshot: React.FC<{ src: string; seed?: number; caption?: string }> = ({ src, seed = 1, caption }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 16, stiffness: 120, mass: 0.9 } });
  const rot = (rnd(seed) - 0.5) * 7; const push = interpolate(f, [0, durationInFrames], [1, 1.07], cl);
  const ox = (rnd(seed + 3) - 0.5) * 60;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Wood />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", scale: String(push) }}>
        <div style={{ position: "absolute", translate: "-60px 30px" }}><Print blank w={1450} rot={rot - 6} /></div>
        <div style={{ position: "absolute", translate: `${ox}px ${(1 - s) * -900}px`, scale: String(1.15 - 0.15 * s) }}><Print src={src} w={1560} rot={rot * s} /></div>
      </AbsoluteFill>
      {caption ? <div style={{ position: "absolute", right: 110, bottom: 70, fontFamily: HAND, fontWeight: 700, fontSize: 60, color: "#FBF7EE", rotate: "-3deg", textShadow: "0 3px 10px rgba(0,0,0,0.6)" }}>{caption}</div> : null}
    </AbsoluteFill>
  );
};

export const LorEraTimeline: React.FC<{ from: number; to: number; photos: string[]; intruders: string[]; caption?: string }> = ({ from, to, photos, intruders, caption }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const tIn = durationInFrames * 0.5; // mitad: caen las fotos · mitad: entran los intrusos
  const yearP = interpolate(f, [0, durationInFrames - 10], [0, 1], cl);
  const year = Math.round(from + (to - from) * yearP);
  const fade = interpolate(f, [tIn, durationInFrames - 6], [0, 1], cl);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Wood />
      {photos.map((p, i) => {
        const t0 = 6 + i * ((tIn - 20) / photos.length);
        const s = spring({ frame: f - t0, fps, config: { damping: 15, stiffness: 120 } });
        if (f < t0) return null;
        const x = 120 + i * ((1920 - 700) / Math.max(1, photos.length - 1)), y = 170 + (i % 2) * 150;
        const push = interpolate(f, [tIn, durationInFrames], [0, 1], { ...cl, easing: Easing.in(Easing.quad) });
        return <div key={i} style={{ position: "absolute", left: x, top: y, translate: `${-push * (300 + i * 120)}px ${(1 - s) * -700 + push * 160}px` }}><Print src={p} w={560} rot={(rnd(i + 9) - 0.5) * 14} faded={fade} /></div>;
      })}
      {intruders.map((p, i) => {
        const t0 = tIn + i * 12; const s = spring({ frame: f - t0, fps, config: { damping: 13, stiffness: 150 } });
        if (f < t0) return null;
        return <div key={"i" + i} style={{ position: "absolute", left: 520 + i * 420, top: 330 + (i % 2) * 90, translate: `${(1 - s) * 1400}px 0`, rotate: `${(i - 1) * 5}deg` }}>
          <Img src={staticFile(p)} style={{ width: 620, aspectRatio: "1088/608", objectFit: "cover", borderRadius: 10, border: "8px solid #fff", boxShadow: "0 24px 50px rgba(0,0,0,0.5)", filter: "saturate(1.15)" }} />
        </div>;
      })}
      {/* línea de tiempo */}
      <div style={{ position: "absolute", left: 100, right: 100, bottom: 110, height: 6, background: "rgba(251,247,238,0.85)", borderRadius: 3 }} />
      <div style={{ position: "absolute", left: 100 + (1720 * yearP) - 14, bottom: 100, width: 28, height: 28, borderRadius: 14, background: LOR.butter, boxShadow: "0 0 0 6px rgba(242,201,76,0.35)" }} />
      <div style={{ position: "absolute", left: 100, bottom: 40, fontFamily: SERIF, fontWeight: 800, fontSize: 40, color: "#FBF7EE" }}>{from}</div>
      <div style={{ position: "absolute", right: 100, bottom: 40, fontFamily: SERIF, fontWeight: 800, fontSize: 40, color: "#FBF7EE" }}>{to}</div>
      <div style={{ position: "absolute", right: 80, top: 40, fontFamily: SERIF, fontWeight: 900, fontSize: 130, color: fade > 0 ? LOR.butter : "#FBF7EE", textShadow: "0 6px 18px rgba(0,0,0,0.5)", fontVariantNumeric: "tabular-nums" }}>{year}</div>
      {caption ? <div style={{ position: "absolute", left: 90, top: 60, fontFamily: HAND, fontWeight: 700, fontSize: 80, color: "#FBF7EE", textShadow: "0 4px 14px rgba(0,0,0,0.6)", opacity: interpolate(f, [tIn, tIn + 12], [0, 1], cl) }}>{caption}</div> : null}
    </AbsoluteFill>
  );
};

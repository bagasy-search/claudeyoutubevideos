// Apex Files — kit del canal (depredadores). Negro + rojo sangre + hueso, Oswald condensada.
// Todo va ENCIMA del metraje (overlays) salvo ApexNumber, que es la tarjeta de cada ítem del ranking.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadSans } from "@remotion/google-fonts/Oswald";
import { loadFont as loadBody } from "@remotion/google-fonts/Inter";
import { Media } from "./Media";

export const SANS = loadSans().fontFamily;
export const BODY = loadBody().fontFamily;
export const AX = { ink: "#08090A", red: "#C4161C", redDeep: "#7A0B0F", bone: "#EFE8DA", dim: "#A39C8F" };
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (t: number) => 1 - Math.pow(1 - clamp(t), 3);

// entrada/salida común: a = opacidad, f = cuadro, D = duración
const useLife = (fin = 8, fout = 10) => {
  const f = useCurrentFrame();
  const { durationInFrames: D, fps } = useVideoConfig();
  const a = clamp(f / fin) * clamp((D - f) / fout);
  return { f, D, fps, a };
};

// ─── TARJETA DE ÍTEM: "#4" gigante + nombre que se escribe, sobre el metraje oscurecido ───
export const ApexNumber: React.FC<{ n: number; title: string; bed?: string; bedStart?: number; side?: "left" | "right" }> =
  ({ n, title, bed, bedStart = 0, side = "left" }) => {
  const { f, D, fps } = useLife();
  const s = spring({ frame: f, fps, config: { damping: 16, stiffness: 90 } });
  const out = clamp((f - (D - 10)) / 10);
  const chars = Math.floor(clamp((f - 10) / 26) * title.length);
  const left = side === "left";
  return (
    <AbsoluteFill style={{ background: AX.ink, opacity: 1 - out }}>
      {bed ? <AbsoluteFill style={{ filter: "brightness(0.42) saturate(0.8)" }}><Media src={bed} start={bedStart} kb="in" zoom={1.15} /></AbsoluteFill> : null}
      <AbsoluteFill style={{ background: `linear-gradient(${left ? 90 : 270}deg, rgba(8,9,10,0.92) 0%, rgba(8,9,10,0.55) 55%, rgba(8,9,10,0.2) 100%)` }} />
      <div style={{ position: "absolute", top: 250, [left ? "left" : "right"]: 130, textAlign: left ? "left" : "right",
        transform: `translateY(${interpolate(s, [0, 1], [80, 0])}px) scale(${interpolate(s, [0, 1], [1.25, 1]) + out * 0.2})` } as React.CSSProperties}>
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 46, letterSpacing: 14, color: AX.dim }}>APEX FILE</div>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 400, lineHeight: 0.95, color: AX.red, textShadow: "0 20px 60px rgba(0,0,0,0.8)" }}>#{n}</div>
        <div style={{ width: ease((f - 6) / 18) * 760, height: 8, background: AX.bone, margin: left ? "10px 0 26px" : "10px 0 26px auto" }} />
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 104, color: AX.bone, letterSpacing: 3, whiteSpace: "nowrap" }}>
          {title.slice(0, chars)}<span style={{ color: AX.red, opacity: f % 16 < 8 ? 1 : 0 }}>▌</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── LUGAR: rótulo abajo a la izquierda con pin y barra roja ───
export const ApexTag: React.FC<{ place: string; sub?: string }> = ({ place, sub }) => {
  const { f, a } = useLife(10, 12);
  const w = ease(f / 16);
  const n = Math.floor(clamp((f - 6) / 20) * place.length);
  return (
    <AbsoluteFill style={{ opacity: a, pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 32%)" }} />
      <div style={{ position: "absolute", left: 96, bottom: 92, display: "flex", alignItems: "stretch" }}>
        <div style={{ width: 10, background: AX.red, transform: `scaleY(${w})`, transformOrigin: "bottom" }} />
        <div style={{ paddingLeft: 26 }}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 74, color: AX.bone, letterSpacing: 2, lineHeight: 1.05, textShadow: "0 4px 18px rgba(0,0,0,0.9)", whiteSpace: "nowrap" }}>{place.slice(0, n)}</div>
          {sub ? <div style={{ fontFamily: SANS, fontWeight: 400, fontSize: 36, color: AX.dim, letterSpacing: 6, marginTop: 6, opacity: clamp((f - 22) / 10), textShadow: "0 3px 12px rgba(0,0,0,0.9)", whiteSpace: "nowrap" }}>{sub}</div> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── CIFRA: contador grande a la derecha con etiqueta ───
export const ApexCount: React.FC<{ to: number; suffix?: string; label: string; sep?: boolean }> = ({ to, suffix = "", label, sep = false }) => {
  const { f, a } = useLife(8, 12);
  const t = 1 - Math.pow(1 - clamp((f - 4) / 36), 4);
  const v = Math.round(to * t);
  const txt = sep ? v.toLocaleString("en-US") : String(v);
  return (
    <AbsoluteFill style={{ opacity: a, pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "linear-gradient(270deg, rgba(8,9,10,0.85) 0%, rgba(8,9,10,0.45) 40%, rgba(8,9,10,0) 68%)" }} />
      <div style={{ position: "absolute", right: 110, top: 540, transform: "translateY(-50%)", textAlign: "right", maxWidth: 820 }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 230, lineHeight: 1, color: AX.bone, textShadow: "0 12px 40px rgba(0,0,0,0.9)", whiteSpace: "nowrap" }}>
          {txt}<span style={{ color: AX.red, fontSize: 130 }}>{suffix}</span>
        </div>
        <div style={{ height: 6, background: AX.red, width: ease((f - 10) / 16) * 100 + "%", margin: "14px 0 18px auto" }} />
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 46, letterSpacing: 4, color: AX.bone, textShadow: "0 3px 14px rgba(0,0,0,0.95)" }}>{label}</div>
      </div>
    </AbsoluteFill>
  );
};

// ─── NOTA DE CAMPO: 2-3 renglones que entran uno a uno a la izquierda ───
export const ApexNote: React.FC<{ lines: string[]; kicker?: string }> = ({ lines, kicker = "FIELD NOTES" }) => {
  const { f, a } = useLife(8, 12);
  return (
    <AbsoluteFill style={{ opacity: a, pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(8,9,10,0.88) 0%, rgba(8,9,10,0.5) 42%, rgba(8,9,10,0) 66%)" }} />
      <div style={{ position: "absolute", left: 110, top: 300, width: 900 }}>
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 40, letterSpacing: 12, color: AX.red }}>{kicker}</div>
        {lines.map((l, i) => {
          const t = ease((f - 10 - i * 22) / 14);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", marginTop: 34, opacity: t, transform: `translateX(${(1 - t) * -60}px)` }}>
              <div style={{ width: 22, height: 22, background: i === lines.length - 1 ? AX.red : AX.bone, marginRight: 28, flex: "none" }} />
              <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 64, lineHeight: 1.1, color: AX.bone, textShadow: "0 4px 16px rgba(0,0,0,0.9)" }}>{l}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─── FICHA DE LA ESPECIE: nombre, latín y 3 datos en columna a la derecha ───
export const ApexFile: React.FC<{ common: string; latin: string; facts: { k: string; v: string }[] }> = ({ common, latin, facts }) => {
  const { f, a } = useLife(8, 12);
  return (
    <AbsoluteFill style={{ opacity: a, pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "linear-gradient(270deg, rgba(8,9,10,0.9) 0%, rgba(8,9,10,0.55) 36%, rgba(8,9,10,0) 62%)" }} />
      <div style={{ position: "absolute", right: 110, top: 220, width: 660 }}>
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 34, letterSpacing: 10, color: AX.red }}>SPECIES FILE</div>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 84, lineHeight: 1.05, color: AX.bone, marginTop: 8 }}>{common}</div>
        <div style={{ fontFamily: BODY, fontStyle: "italic", fontSize: 36, color: AX.dim, marginTop: 4 }}>{latin}</div>
        <div style={{ height: 4, background: AX.red, width: ease((f - 6) / 16) * 660, margin: "26px 0 10px" }} />
        {facts.map((x, i) => {
          const t = ease((f - 14 - i * 12) / 12);
          return (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(239,232,218,0.25)", padding: "18px 0", opacity: t }}>
              <div style={{ fontFamily: SANS, fontSize: 36, letterSpacing: 4, color: AX.dim }}>{x.k}</div>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 44, color: AX.bone }}>{x.v}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const APEX_COMPS: Record<string, React.FC<any>> = { ApexNumber, ApexTag, ApexCount, ApexNote, ApexFile };

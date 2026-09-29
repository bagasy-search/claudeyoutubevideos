// NumberCard3D — el sello de cada ítem del conteo: número gigante EXTRUIDO en 3D real (capas en Z),
// girando en el espacio sobre el metraje del propio ítem (desenfocado), polvo en profundidad,
// barrido de luz sobre la cara y título que se tipea con subrayado amarillo. Sale ATRAVESANDO la cámara.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Media } from "./Media";
import { SERIF, TYPE, SANS, YC, clamp, ease, easeInOut, rnd } from "./theme";

const WORDS = ["", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN", "SIXTEEN", "SEVENTEEN", "EIGHTEEN", "NINETEEN", "TWENTY"];

export const NumberCard3D: React.FC<{
  n: number; title: string; bed?: string; bedStart?: number; side?: "left" | "right"; exitPush?: boolean;
}> = ({ n, title, bed, bedStart = 0, side = "left", exitPush = true }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames: D } = useVideoConfig();
  const inS = spring({ frame: f, fps, config: { damping: 18, stiffness: 70, mass: 1.1 } });
  const t = f / D;
  const exitT = exitPush ? clamp((f - (D - 14)) / 14) : 0;
  const ex = ease(exitT);

  // cámara / número
  const dir = side === "left" ? 1 : -1;
  const rotY = interpolate(inS, [0, 1], [-78 * dir, -22 * dir]) + t * 10 * dir;
  const rotX = interpolate(inS, [0, 1], [18, 6]) - t * 3;
  const z = interpolate(inS, [0, 1], [-900, 0]) + t * 120 + ex * 1600;
  const layers = 28;
  const txt = String(n);
  const numX = side === "left" ? 470 : 1450;

  // título tipeado
  const tStart = 14, cps = 26;
  const shown = Math.max(0, Math.floor(((f - tStart) / fps) * cps));
  const typed = title.slice(0, shown);
  const typedFrac = clamp(shown / Math.max(1, title.length));
  const titleX = side === "left" ? 900 : 120;

  const sweep = interpolate(f, [8, 40], [-60, 160], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fade = 1 - clamp((f - (D - 8)) / 8);

  // polvo en profundidad
  const motes = Array.from({ length: 46 }, (_, i) => {
    const zz = -1400 + rnd(i + 3) * 1700 + t * 260;
    const x = (rnd(i) - 0.5) * 2600, y = (rnd(i + 1) - 0.5) * 1500 - t * 40 * (0.5 + rnd(i + 9));
    const r = 2 + rnd(i + 2) * 5;
    const near = clamp((zz + 1400) / 1700);
    return <div key={i} style={{ position: "absolute", left: 960, top: 540, width: r, height: r, borderRadius: r, background: YC.paper,
      opacity: 0.12 + near * 0.45, filter: `blur(${(1 - near) * 2 + (near > 0.85 ? 3 : 0)}px)`, transform: `translate3d(${x}px, ${y}px, ${zz}px)` }} />;
  });

  return (
    <AbsoluteFill style={{ background: YC.ink, opacity: fade }}>
      {bed ? (
        <AbsoluteFill style={{ filter: "blur(9px) brightness(0.58) saturate(0.75) sepia(0.3)", transform: `scale(${1.15 + t * 0.08})` }}>
          <Media src={bed} start={bedStart} kb="none" />
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at ${side === "left" ? 28 : 72}% 50%, rgba(242,183,5,0.16), rgba(0,0,0,0) 55%), linear-gradient(90deg, rgba(0,0,0,${side === "left" ? 0.1 : 0.55}), rgba(0,0,0,${side === "left" ? 0.55 : 0.1}))` }} />
      {/* haz de proyector */}
      <AbsoluteFill style={{ mixBlendMode: "screen", opacity: 0.55 * clamp(f / 20),
        background: `conic-gradient(from ${side === "left" ? 200 : 160}deg at ${side === "left" ? 95 : 5}% -10%, rgba(0,0,0,0) 0deg, rgba(255,214,140,0.28) 12deg, rgba(255,214,140,0.05) 26deg, rgba(0,0,0,0) 34deg)` }} />
      <AbsoluteFill style={{ perspective: 1400, perspectiveOrigin: "50% 45%" }}>
        <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>{motes}</div>
        <div style={{ position: "absolute", left: numX, top: 540, transformStyle: "preserve-3d",
          transform: `translate3d(-50%, -50%, ${z}px) rotateX(${rotX}deg) rotateY(${rotY}deg)` }}>
          {Array.from({ length: layers }, (_, i) => {
            const k = layers - 1 - i; // de atrás hacia adelante
            const depth = k * 3.2;
            const shade = 1 - k / layers;
            const isFront = k === 0;
            return (
              <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `translate(-50%, -50%) translateZ(${-depth}px)`,
                fontFamily: SERIF, fontSize: 620, lineHeight: 1, whiteSpace: "nowrap", letterSpacing: -10,
                color: isFront ? "transparent" : `rgb(${Math.round(120 * shade + 40)}, ${Math.round(82 * shade + 22)}, ${Math.round(18 * shade + 8)})`,
                backgroundImage: isFront ? `linear-gradient(115deg, #FFF3CF 0%, ${YC.bus} 38%, #D98E00 70%, #FFE8A3 100%)` : undefined,
                WebkitBackgroundClip: isFront ? "text" : undefined, backgroundClip: isFront ? "text" : undefined,
                textShadow: k === layers - 1 ? "0 40px 80px rgba(0,0,0,0.8)" : undefined }}>
                {txt}
              </div>
            );
          })}
          {/* barrido especular */}
          <div style={{ position: "absolute", left: 0, top: 0, transform: "translate(-50%, -50%) translateZ(1px)", fontFamily: SERIF, fontSize: 620, lineHeight: 1, letterSpacing: -10, whiteSpace: "nowrap",
            color: "transparent", backgroundImage: `linear-gradient(115deg, rgba(255,255,255,0) ${sweep - 12}%, rgba(255,255,255,0.85) ${sweep}%, rgba(255,255,255,0) ${sweep + 12}%)`,
            WebkitBackgroundClip: "text", backgroundClip: "text" }}>{txt}</div>
        </div>
      </AbsoluteFill>
      {/* título */}
      <div style={{ position: "absolute", left: titleX, top: 400, width: 900, opacity: 1 - ex }}>
        <div style={{ fontFamily: SANS, fontSize: 30, letterSpacing: 12, color: YC.bus, opacity: ease((f - 6) / 12), transform: `translateY(${(1 - ease((f - 6) / 12)) * 14}px)` }}>
          NUMBER {WORDS[n] ?? n}
        </div>
        <div style={{ fontFamily: TYPE, fontSize: 64, lineHeight: 1.18, color: YC.paper, marginTop: 18, textShadow: "0 4px 24px rgba(0,0,0,0.8)", minHeight: 160 }}>
          {typed}<span style={{ opacity: f % 16 < 8 && typedFrac < 1 ? 1 : 0, color: YC.bus }}>▌</span>
        </div>
        <div style={{ height: 6, marginTop: 22, width: `${typedFrac * 100}%`, maxWidth: 820, background: YC.bus, boxShadow: "0 0 18px rgba(242,183,5,0.6)" }} />
      </div>
      {exitPush ? <AbsoluteFill style={{ background: "#FFF6DC", opacity: Math.sin(ex * Math.PI) * 0.35, mixBlendMode: "screen" }} /> : null}
    </AbsoluteFill>
  );
};

// transición de luz de proyector (flash cálido + fuga de luz) — para fundir cortes de sección
export const LightLeak: React.FC<{ peak?: number }> = ({ peak = 0.75 }) => {
  const f = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const a = Math.sin(clamp(f / D) * Math.PI) * peak;
  const x = interpolate(f, [0, D], [-20, 120]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen", opacity: a,
      background: `radial-gradient(ellipse 60% 90% at ${x}% 40%, rgba(255,170,60,0.95), rgba(255,90,20,0.5) 35%, rgba(0,0,0,0) 70%)` }} />
  );
};
export { easeInOut };

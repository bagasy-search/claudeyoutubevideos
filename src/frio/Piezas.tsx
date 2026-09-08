// Piezas del canal "Archivos del Frío" — look documental frío, registro archivo en sepia.
// ⛔ NADA de <Video> acá: el minuto 1 es todo imagen fija. El movimiento va por transform de
//    Remotion (SUBPÍXEL). Nunca hornear movimiento con ffmpeg: cuantiza a píxel entero = tirón.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

export const FRIO = {
  ink: "#E8E2D4",
  paper: "#0C0E12",
  amber: "#C8791F",
  cold: "#7C93A6",
  serif: "'Georgia','Times New Roman',serif",
};

// ── movimiento: cuatro familias, se alternan para que nunca haya dos seguidas iguales ──
export type Mov = "in" | "out" | "left" | "right" | "still";

const ease = Easing.bezier(0.33, 0, 0.15, 1); // arranca con velocidad y desacelera

function kb(mov: Mov, p: number) {
  // p = progreso 0..1 ya suavizado
  const Z = 0.085; // amplitud del push
  const P = 2.4; // amplitud del paneo en %
  switch (mov) {
    case "in": return { s: 1 + Z * p, x: 0, y: -0.5 * p };
    case "out": return { s: 1 + Z * (1 - p), x: 0, y: 0.5 * p };
    case "left": return { s: 1 + Z * 0.55, x: -P * p + P * 0.5, y: 0 };
    case "right": return { s: 1 + Z * 0.55, x: P * p - P * 0.5, y: 0 };
    default: return { s: 1.012 + 0.012 * p, x: 0, y: 0 };
  }
}

// ── grano de 35 mm, CONSTANTE en todo el metraje: es lo que unifica material de orígenes distintos ──
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.055 }) => {
  const f = useCurrentFrame();
  const seed = (f % 7) + 1; // el grano tiene que MOVERSE o se lee como suciedad de lente
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity, mixBlendMode: "overlay" }}>
      <svg width="100%" height="100%">
        <filter id={`gr${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#gr${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

// ── viñeta + curva fría. Una sola para todo el video: es la marca. ──
export const Grade: React.FC<{ archivo?: boolean }> = ({ archivo }) => (
  <>
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        background: archivo
          ? "radial-gradient(120% 100% at 50% 45%, rgba(0,0,0,0) 38%, rgba(24,16,6,0.42) 78%, rgba(14,9,3,0.72) 100%)"
          : "radial-gradient(125% 105% at 50% 46%, rgba(0,0,0,0) 42%, rgba(6,12,20,0.34) 80%, rgba(3,7,13,0.62) 100%)",
      }}
    />
    {!archivo && (
      <AbsoluteFill
        style={{ pointerEvents: "none", background: "linear-gradient(180deg, rgba(28,54,78,0.16) 0%, rgba(0,0,0,0) 45%, rgba(38,30,16,0.10) 100%)" }}
      />
    )}
  </>
);

// ── el plano: dos capas (fondo desenfocado + sujeto nítido) a distinta velocidad = parallax ──
export const Plate: React.FC<{
  src: string;
  mov: Mov;
  archivo?: boolean;
  dur: number;      // frames
  fadeIn?: number;  // frames de disolvencia de entrada (0 = corte seco)
}> = ({ src, mov, archivo, dur, fadeIn = 0 }) => {
  const f = useCurrentFrame();
  const p = ease(Math.min(1, Math.max(0, f / Math.max(1, dur - 1))));
  const A = kb(mov, p);
  const B = kb(mov, p * 0.42); // el fondo se mueve MENOS: eso es lo que da profundidad
  const op = fadeIn > 0 ? interpolate(f, [0, fadeIn], [0, 1], { extrapolateRight: "clamp" }) : 1;
  const url = staticFile(src);
  const filt = archivo
    ? "sepia(0.86) contrast(1.16) saturate(0.75) brightness(0.98)"
    : "saturate(0.86) contrast(1.06)";
  return (
    <AbsoluteFill style={{ opacity: op, backgroundColor: "#05070B" }}>
      <AbsoluteFill style={{ transform: `scale(${B.s * 1.16}) translate(${B.x}%, ${B.y}%)`, filter: `${filt} blur(18px) brightness(0.72)` }}>
        <Img src={url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${A.s}) translate(${A.x}%, ${A.y}%)`, filter: filt }}>
        <Img src={url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <Grade archivo={archivo} />
    </AbsoluteFill>
  );
};

// ── ficha de archivo: los datos duros NO son un cartelito, son una ficha del expediente ──
export const FichaDato: React.FC<{
  cifra: string;
  unidad?: string;
  pie: string;
  bed: string;      // cama de foto obligatoria: nunca un componente sobre fondo plano
  dur: number;
}> = ({ cifra, unidad, pie, bed, dur }) => {
  const f = useCurrentFrame();
  const inn = interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const drift = interpolate(f, [0, dur], [8, 0], { extrapolateRight: "clamp", easing: ease });
  const rule = interpolate(f, [6, 26], [0, 1], { extrapolateRight: "clamp", easing: ease });
  return (
    <AbsoluteFill>
      <Plate src={bed} mov="still" dur={dur} />
      <AbsoluteFill style={{ background: "rgba(5,8,13,0.55)" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", opacity: inn, transform: `translateY(${drift}px)` }}>
          <div style={{ fontFamily: FRIO.serif, fontSize: 168, lineHeight: 1, color: FRIO.ink, letterSpacing: -2, textShadow: "0 8px 40px rgba(0,0,0,0.7)" }}>
            {cifra}
            {unidad ? <span style={{ fontSize: 74, marginLeft: 14, color: FRIO.cold }}>{unidad}</span> : null}
          </div>
          <div style={{ height: 2, width: 340 * rule, margin: "26px auto 0", background: FRIO.amber, opacity: 0.85 }} />
          <div style={{ fontFamily: FRIO.serif, fontSize: 30, letterSpacing: 7, textTransform: "uppercase", color: FRIO.cold, marginTop: 22 }}>
            {pie}
          </div>
        </div>
      </AbsoluteFill>
      <Grade />
    </AbsoluteFill>
  );
};

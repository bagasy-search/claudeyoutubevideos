// Piezas del canal "Archivos del Frío".
// Corregido tras el veredicto v3 + el pedido del creador ("parece muy filtrado, documental real"):
//  · el parallax FALSO se fue: la capa nítida iba a objectFit:cover y tapaba el 100% de la lenta,
//    así que nunca se vio. El dinamismo real lo dan los CLIPS de agnes, no una cama borrosa.
//  · el grano era invisible (0,16/255 medido): baseFrequency 0.85 + overlay sobre gris medio es
//    identidad matemática. Va a frecuencia baja y soft-light, y se MIDE.
//  · el grade frío de encima se fue. Queda una viñeta suave y nada más. Foto, no filtro.
// ⛔ Los videos van SIEMPRE con OffthreadVideo, nunca <Video>: en el render <Video> busca por
//    tiempo y devuelve cuadros equivocados = el "se ve lageado".
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";

export const FRIO = {
  ink: "#EFE9DA",
  amber: "#C8791F",
  cold: "#8DA3B4",
  serif: "'Georgia','Times New Roman',serif",
};

export type Mov = "in" | "out" | "left" | "right" | "still";
const ease = Easing.bezier(0.33, 0, 0.15, 1);

function kb(mov: Mov, p: number) {
  const Z = 0.06, P = 1.8;
  switch (mov) {
    case "in": return { s: 1.005 + Z * p, x: 0, y: -0.35 * p };
    case "out": return { s: 1.005 + Z * (1 - p), x: 0, y: 0.35 * p };
    case "left": return { s: 1.04, x: -P * p + P * 0.5, y: 0 };
    case "right": return { s: 1.04, x: P * p - P * 0.5, y: 0 };
    default: return { s: 1.008 + 0.008 * p, x: 0, y: 0 };
  }
}

// ── grano: sutil pero MEDIBLE. Unifica material de orígenes distintos, que con IA es el problema.
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.13 }) => {
  const f = useCurrentFrame();
  const seed = (f % 5) + 1;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity, mixBlendMode: "soft-light" }}>
      <svg width="100%" height="100%">
        <filter id={`g${seed}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.42" numOctaves={3} seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="2.4" intercept="-0.55" />
          </feComponentTransfer>
        </filter>
        <rect width="100%" height="100%" filter={`url(#g${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

// ── viñeta suave y NADA más. Sin curva de color encima: el creador pidió foto, no filtro.
export const Vineta: React.FC<{ fuerza?: number }> = ({ fuerza = 0.30 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(135% 115% at 50% 48%, rgba(0,0,0,0) 55%, rgba(0,0,0,${fuerza * 0.55}) 84%, rgba(0,0,0,${fuerza}) 100%)`,
    }}
  />
);

const sepia = "sepia(0.80) contrast(1.12) saturate(0.80)";

// ── CLIP animado por agnes (ya viene ralentizado a 4 s / 30 CFR). Es el 95% del video.
export const Clip: React.FC<{ src: string; archivo?: boolean; fadeIn?: number }> = ({ src, archivo, fadeIn = 0 }) => {
  const f = useCurrentFrame();
  const op = fadeIn > 0 ? interpolate(f, [0, fadeIn], [0, 1], { extrapolateRight: "clamp" }) : 1;
  return (
    <AbsoluteFill style={{ opacity: op, backgroundColor: "#07090D" }}>
      <OffthreadVideo
        src={staticFile(src)}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover", filter: archivo ? sepia : undefined }}
      />
      <Vineta />
    </AbsoluteFill>
  );
};

// ── FOTO: sólo donde el clip no llegó o lo rechazó la auditoría. Movimiento suave, sin cama falsa.
export const Plate: React.FC<{ src: string; mov: Mov; archivo?: boolean; dur: number; fadeIn?: number }> = ({
  src, mov, archivo, dur, fadeIn = 0,
}) => {
  const f = useCurrentFrame();
  const p = ease(Math.min(1, Math.max(0, f / Math.max(1, dur - 1))));
  const A = kb(mov, p);
  const op = fadeIn > 0 ? interpolate(f, [0, fadeIn], [0, 1], { extrapolateRight: "clamp" }) : 1;
  return (
    <AbsoluteFill style={{ opacity: op, backgroundColor: "#07090D" }}>
      <AbsoluteFill style={{ transform: `scale(${A.s}) translate(${A.x}%, ${A.y}%)`, filter: archivo ? sepia : undefined }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <Vineta />
    </AbsoluteFill>
  );
};

// ── EL AVATAR a pantalla completa, con push lento. Nunca estático.
export const Avatar: React.FC<{ src: string; desde: number; dur: number }> = ({ src, desde, dur }) => {
  const f = useCurrentFrame();
  const p = ease(Math.min(1, Math.max(0, f / Math.max(1, dur - 1))));
  return (
    <AbsoluteFill style={{ backgroundColor: "#07090D" }}>
      <AbsoluteFill style={{ transform: `scale(${1.02 + 0.05 * p})` }}>
        <OffthreadVideo
          src={staticFile(src)}
          muted
          startFrom={desde}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
      <Vineta fuerza={0.22} />
    </AbsoluteFill>
  );
};

// ── ficha de dato: el número como pieza de expediente, sobre cama de imagen (nunca fondo plano)
export const FichaDato: React.FC<{
  cifra: string; unidad?: string; pie: string; bed: string; bedEsClip?: boolean; dur: number;
}> = ({ cifra, unidad, pie, bed, bedEsClip, dur }) => {
  const f = useCurrentFrame();
  const inn = interpolate(f, [0, 14], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const drift = interpolate(f, [0, dur], [10, 0], { extrapolateRight: "clamp", easing: ease });
  const rule = interpolate(f, [8, 30], [0, 1], { extrapolateRight: "clamp", easing: ease });
  return (
    <AbsoluteFill>
      {bedEsClip ? <Clip src={bed} /> : <Plate src={bed} mov="still" dur={dur} />}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,8,13,0.30) 0%, rgba(5,8,13,0.62) 55%, rgba(5,8,13,0.34) 100%)" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", opacity: inn, transform: `translateY(${drift}px)` }}>
          <div style={{ fontFamily: FRIO.serif, fontSize: 176, lineHeight: 1, color: FRIO.ink, letterSpacing: -3, textShadow: "0 10px 46px rgba(0,0,0,0.78)" }}>
            {cifra}
            {unidad ? <span style={{ fontSize: 76, marginLeft: 16, color: FRIO.cold }}>{unidad}</span> : null}
          </div>
          <div style={{ height: 2, width: 360 * rule, margin: "28px auto 0", background: FRIO.amber, opacity: 0.9 }} />
          <div style={{ fontFamily: FRIO.serif, fontSize: 31, letterSpacing: 8, textTransform: "uppercase", color: FRIO.cold, marginTop: 24 }}>
            {pie}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

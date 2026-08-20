import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";
import {
  useKeyLight, slabShadow, tilt3d, specular, mblur, useDrift, Bokeh, Grain, Halation, LensVignette, THEME_EARTH,
} from "../kit/premium";

// ── CineShot — tratamiento CINEMATOGRÁFICO con PROFUNDIDAD para las fotos de b-roll.
// Reemplazo drop-in de RawShot (mismas props) para el look "editado en After Effects":
// la foto no va full-bleed plana, sino que FLOTA sobre su propia versión desenfocada,
// con luz/sombra/parallax/tilt reales, grain + halación + viñeta, y entrada con
// motion-blur que decae (el tell nº1 de AE). Nada de placa/marco crema.
//
// ★ OPACIDAD 1 SIEMPRE (corte duro, sin fade): con el fix anti-destello el avatar
//   solapa el borde con corte duro; si la foto hiciera fade asomaría el fondo. La
//   vida viene del MOVIMIENTO, no de la opacidad. En la variante tarjeta el fondo
//   desenfocado cubre toda la pantalla desde el frame 0 → la tarjeta vuela encima
//   sin dejar hueco jamás.
//
// 3 variantes seeded (por filename → estable): bleed (full-bleed cine) · card
// (tarjeta flotante centrada) · cardOff (tarjeta editorial descentrada). Variación
// controlada para que no canse.

const ORIGINS = ["50% 46%", "36% 34%", "66% 40%", "42% 64%", "60% 58%", "34% 52%"];
const blurSibling = (src: string) => src.replace(/\.(png|jpe?g|jpeg)$/i, "_blur.jpg");

export const CineShot: React.FC<{
  durationInFrames: number;
  src: string;
  hue?: string;
  darken?: number;
  focus?: string;
  trans?: number;
  kbPhase?: number;
  variant?: "bleed" | "card" | "cardOff";
}> = ({ durationInFrames, src, focus, kbPhase, variant }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = durationInFrames;
  const t = THEME_EARTH;

  let seed = 0;
  for (let i = 0; i < src.length; i++) seed = (seed * 31 + src.charCodeAt(i)) >>> 0;
  if (kbPhase != null) seed = (seed + kbPhase * 7919) >>> 0;

  const r20 = seed % 20;
  const V: "bleed" | "card" | "cardOff" =
    variant ?? (r20 < 9 ? "card" : r20 < 14 ? "cardOff" : "bleed"); // ~45% tarjeta / 25% editorial / 30% full-bleed
  const light = useKeyLight(V === "bleed" ? "center" : (seed & 1) ? "left" : "top");

  // entrada (spring 0→1) → motion-blur + rise + scale, SIN tocar opacidad
  const s = spring({ frame, fps, config: { damping: 17, mass: 0.85, stiffness: 150 }, durationInFrames: 16 });
  const durSec = D / fps;
  const kbMag = Math.min(0.10, Math.max(0.03, 0.008 * durSec)); // cámara ~constante
  const dirIn = (seed >> 4) % 2 === 0;
  const camOrigin = focus || ORIGINS[(seed >> 3) % ORIGINS.length];

  // ken-burns compartido (background y foreground a distinta velocidad = parallax)
  const kbFront = interpolate(frame, [0, D], dirIn ? [1.0, 1.0 + kbMag] : [1.0 + kbMag, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const kbBack = interpolate(frame, [0, D], dirIn ? [1.12, 1.12 + kbMag * 0.5] : [1.12 + kbMag * 0.5, 1.12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const driftF = useDrift(0.85, seed);
  const driftB = useDrift(0.18, seed + 3);

  const blurSrc = staticFile(blurSibling(src));
  const sharp = staticFile(src);

  // ── capa de FONDO desenfocado (la propia foto, hundida y fuera de foco) ──
  const Backdrop = (dark: number) => (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: t.color.bg }}>
      <Img
        src={blurSrc}
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
          transform: `translate(${driftB.x}px, ${driftB.y}px) scale(${kbBack})`,
          transformOrigin: camOrigin, filter: "saturate(0.82) brightness(0.9)",
        }}
      />
      {/* grade cálido + hundido para separar del primer plano */}
      <AbsoluteFill style={{ background: `radial-gradient(120% 100% at ${light.x * 100}% 12%, rgba(60,44,26,0) 0%, rgba(20,15,10,${dark}) 100%)` }} />
    </AbsoluteFill>
  );

  // atmósfera común (grain + halación + viñeta) — barata, sobre todo
  const Atmos = (
    <>
      <Halation theme={t} x={light.x} y={light.y} size={1} />
      <LensVignette theme={t} strength={V === "bleed" ? 0.85 : 1.05} />
      <Grain theme={t} amount={0.5} />
    </>
  );

  // ── BLEED — full-bleed cinematográfico (nítida, con grade + parallax + atmósfera) ──
  if (V === "bleed") {
    return (
      <AbsoluteFill style={{ overflow: "hidden", backgroundColor: t.color.bg }}>
        <Img
          src={sharp}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
            transform: `translate(${driftF.x * 0.5}px, ${driftF.y * 0.5}px) scale(${kbFront})`,
            transformOrigin: camOrigin,
            filter: mblur(s, 8),
          }}
        />
        {/* grade de teal-naranja sutil: sombras frías, luces cálidas */}
        <AbsoluteFill style={{ background: `linear-gradient(${light.angle + 90}deg, rgba(10,20,30,0.16) 0%, rgba(0,0,0,0) 45%, rgba(70,48,22,0.14) 100%)`, mixBlendMode: "soft-light" }} />
        {Atmos}
      </AbsoluteFill>
    );
  }

  // ── CARD / CARDOFF — tarjeta flotante con profundidad ──
  const off = V === "cardOff";
  const cardW = off ? 1180 : 1500;
  const cardH = Math.round(cardW * 9 / 16);
  const cx = off ? ((seed & 1) ? 1920 - cardW - 120 : 120) : (1920 - cardW) / 2;
  const cy = off ? (1080 - cardH) / 2 - 20 : (1080 - cardH) / 2;
  const rise = (1 - s) * 46;
  const scaleIn = 0.965 + s * 0.035;
  const sweepX = interpolate(frame, [2, 22], [-1.3, 1.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sweepOp = interpolate(frame, [2, 12, 24], [0, 0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: t.color.bg }}>
      {Backdrop(off ? 0.5 : 0.42)}
      <Bokeh theme={t} count={7} opacity={0.4} seed={seed} />
      {/* tarjeta */}
      <div
        style={{
          position: "absolute", left: cx, top: cy + rise, width: cardW, height: cardH,
          transform: `${tilt3d({ amount: 0.32, seed, frame })} scale(${scaleIn})`,
          transformOrigin: "center 60%",
          filter: mblur(s, 9),
          willChange: "transform, filter",
        }}
      >
        {/* sombra sólida del canto + contacto + difusas (del lado contrario a la luz) */}
        <div style={{ position: "absolute", inset: 0, borderRadius: 18, boxShadow: slabShadow(light, { lift: 1.4 }) }} />
        {/* recorte de la foto con ken-burns interno */}
        <div style={{ position: "absolute", inset: 0, borderRadius: 18, overflow: "hidden", border: "1px solid rgba(255,247,232,0.14)" }}>
          <Img
            src={sharp}
            style={{
              position: "absolute", inset: "-6%", width: "112%", height: "112%", objectFit: "cover",
              transform: `translate(${driftF.x * 0.3}px, ${driftF.y * 0.3}px) scale(${kbFront})`,
              transformOrigin: camOrigin,
            }}
          />
          {/* brillo especular que sigue la luz de escena */}
          <div style={{ position: "absolute", inset: 0, background: specular(light, 0.6), mixBlendMode: "soft-light" }} />
          {/* viñeta interna para hundir los bordes de la foto */}
          <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 120px rgba(0,0,0,0.4)" }} />
          {/* barrido de luz de entrada (una sola pasada) */}
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${sweepX * 100}%) rotate(8deg)`, background: "linear-gradient(100deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 60%)", opacity: sweepOp }} />
        </div>
        {/* hairline de luz en el canto superior */}
        <div style={{ position: "absolute", inset: 0, borderRadius: 18, boxShadow: "inset 0 1px 0 rgba(255,247,232,0.35)" }} />
      </div>
      {Atmos}
    </AbsoluteFill>
  );
};

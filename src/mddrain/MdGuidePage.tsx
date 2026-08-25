// MdGuidePage.tsx — la lámina se presenta como una PÁGINA DE LA GUÍA de la descripción.
//
// Por qué existe (feedback_laminas_como_paginas_de_la_guia): el espectador está mirando un
// diagrama lindo que le explica justo lo que quiere entender, y en ese momento lee que eso es
// material de la guía. El deseo nace del valor que YA está viendo, no de una promesa.
//
// Detalles que impone el pipeline:
//   · CAMA DE FOTO debajo (regla 2.quater): la propia lámina desenfocada y oscurecida llena el
//     marco, así el componente no deja ver fondo plano con el avatar oculto.
//   · La página entra levantándose del papel y hace un dolly muy leve — no aparece y se queda.
//   · El tag de esquina es HTML de verdad (tipografía real, sin riesgo de errata del generador).
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";

const RED = "#E4322A";

export const MdGuidePage: React.FC<{
  durationInFrames: number;
  src: string;    // "img/mdtank_lam_fizztest.jpg"
  tag?: string;   // "PAGE 01 · THE COMPLETE METHOD"
  title?: string; // rótulo bajo el tag
}> = ({ durationInFrames, src, tag = "FROM THE GUIDE", title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = durationInFrames;

  const rise = spring({ frame, fps, config: { damping: 200, mass: 0.7 }, durationInFrames: Math.min(28, D) });
  const out = interpolate(frame, [D - 8, D], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // dolly lentísimo: la página nunca queda clavada
  const push = 1 + 0.035 * interpolate(frame, [0, D], [0, 1], { extrapolateRight: "clamp", easing: Easing.bezier(0.3, 0, 0.2, 1) });
  const lift = interpolate(rise, [0, 1], [46, 0]);
  const tilt = interpolate(rise, [0, 1], [3.2, 0]);

  const tagIn = interpolate(frame, [10, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sweepX = interpolate(frame, [14, 40], [-40, 140], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0A0C", opacity: out }}>
      {/* cama: la misma lámina, borrosa y hundida — nunca se ve fondo plano */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={staticFile(src)}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(34px) brightness(0.32) saturate(0.6)", transform: "scale(1.16)" }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(78% 70% at 50% 46%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.72) 100%)" }} />

      {/* la página */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            position: "relative",
            height: "82%",
            transform: `translateY(${lift.toFixed(2)}px) perspective(1400px) rotateX(${tilt.toFixed(2)}deg) scale(${push.toFixed(4)})`,
            opacity: interpolate(rise, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
            boxShadow: "0 40px 90px rgba(0,0,0,0.62), 0 4px 14px rgba(0,0,0,0.5)",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <Img src={staticFile(src)} style={{ height: "100%", width: "auto", display: "block" }} />
          {/* barrido especular: el papel tiene brillo, no es un PNG pegado */}
          <div
            style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: `linear-gradient(104deg, rgba(255,255,255,0) ${sweepX - 26}%, rgba(255,255,255,0.30) ${sweepX}%, rgba(255,255,255,0) ${sweepX + 26}%)`,
            }}
          />
        </div>
      </AbsoluteFill>

      {/* tag de pertenencia — discreto, arriba a la izquierda */}
      <div style={{ position: "absolute", left: 62, top: 54, opacity: tagIn, transform: `translateX(${interpolate(tagIn, [0, 1], [-16, 0]).toFixed(1)}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 34, height: 3, background: RED, borderRadius: 2 }} />
          <div style={{ font: "700 19px/1 Inter, system-ui, sans-serif", letterSpacing: 2.4, color: "#FFFFFF", textTransform: "uppercase", textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>
            {tag}
          </div>
        </div>
        {title ? (
          <div style={{ marginTop: 10, marginLeft: 46, font: "italic 600 26px/1.1 'Playfair Display', Georgia, serif", color: "rgba(255,255,255,0.86)", textShadow: "0 2px 12px rgba(0,0,0,0.85)" }}>
            {title}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

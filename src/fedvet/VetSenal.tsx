// VetSenal.tsx — EL SELLO DE SEÑAL del canal Federer Veterinario (listicle: uno por ítem).
//
// Reemplaza al `StatBug` genérico, que se leía como un bug de esquina de cualquier canal.
// Es la FICHA de la libreta del veterinario: regla ámbar que baja, el número grande, y el título
// que se ESCRIBE letra por letra con cursor.
//
// ⛔ VA SIEMPRE EN `overlays[]`, nunca como cue base: no dibuja fondo completo, sólo un scrim
//    detrás de su propio texto. Como plano base dejaría el fondo de marca en pantalla.
// ⛔ `titulo` y `n` NO tienen default con contenido: si alguien se olvida de pasarlos, el
//    componente sale VACÍO (se nota) en vez de salir con el texto de otro video (no se nota).
//    Es la doctrina de `src/fedvet1/VetPieces.tsx`.
// ⭐ El tipeo reusa `useTypewriter`/`Caret` de `src/VideoEdit/kit/premium/typewriter.tsx`
//    (el repo tiene ~190 componentes: buscar antes de crear). Va SIN sfx: este canal no usa
//    golpes de audio y meterlos debajo de la locución es otra decisión, no un detalle.
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from "remotion";
import { V, F_DISPLAY, F_BODY, Keyring, rgba, clamp01 } from "./RayStage";
import { useTypewriter, Caret } from "../VideoEdit/kit/premium/typewriter";

export const VetSenal: React.FC<{
  n?: string;
  title?: string;
  tone?: "brass" | "danger";
  durationInFrames?: number;
}> = ({ n = "", title = "", tone = "brass" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const color = tone === "danger" ? V.danger : V.brass;

  // entrada: la regla BAJA, el numero entra con peso, el titulo se escribe
  const rule = clamp01(interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  }));
  const numPop = spring({ frame: frame - 4, fps, config: { damping: 14, mass: 0.6 } });
  const a = clamp01(interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  const START = 16;                                   // el titulo arranca cuando la regla ya bajo
  const CPS = 30;                                     // ~26 caracteres -> 0,9 s
  const { shown, done } = useTypewriter(title, START, CPS);
  // el subrayado avanza con el tipeo, no por su cuenta
  const prog = title.length ? shown.length / title.length : 0;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{
        position: "absolute", left: "5%", bottom: "8.5%", maxWidth: "64%",
        display: "flex", alignItems: "stretch", gap: 22, opacity: a,
        transform: `translateY(${((1 - a) * 14).toFixed(1)}px)`,
      }}>
        {/* la regla ámbar que baja */}
        <div style={{
          width: 7, borderRadius: 4, background: `linear-gradient(180deg, ${color}, ${rgba(color, 0.25)})`,
          transformOrigin: "top center", transform: `scaleY(${rule.toFixed(3)})`,
          boxShadow: `0 0 22px ${rgba(color, 0.5)}`,
        }} />

        <div>
          {/* SEÑAL + la marca de la libreta */}
          <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 2 }}>
            <Keyring size={27} />
            <div style={{
              fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 25, letterSpacing: 4.2,
              textTransform: "uppercase", color, textShadow: `0 2px 12px ${rgba(V.ink0, 0.9)}`,
            }}>
              Señal
            </div>
          </div>

          {/* el número, con peso */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 18 }}>
            <div style={{
              fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 128, lineHeight: 0.82, color,
              transform: `scale(${(0.72 + 0.28 * numPop).toFixed(3)})`, transformOrigin: "left bottom",
              textShadow: `0 0 46px ${rgba(color, 0.42)}, 0 6px 26px rgba(0,0,0,0.94)`,
            }}>
              {n}
            </div>
            <div style={{ paddingBottom: 12 }}>
              {/* el título, escribiéndose sobre su propio scrim */}
              <div style={{
                display: "inline-flex", alignItems: "baseline",
                background: `linear-gradient(90deg, ${rgba(V.ink0, 0.86)}, ${rgba(V.ink0, 0.62)})`,
                borderRadius: 4, padding: "8px 16px 10px",
              }}>
                <span style={{
                  fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 50, lineHeight: 1.04,
                  color: V.white, letterSpacing: "0.004em",
                  textShadow: "0 3px 16px rgba(0,0,0,0.92)",
                }}>
                  {shown}
                </span>
                <Caret color={color} done={done} height={0.78} />
              </div>
              {/* el subrayado avanza CON el tipeo */}
              <div style={{
                height: 3, marginTop: 9, borderRadius: 2, maxWidth: 520,
                width: `${(prog * 100).toFixed(0)}%`,
                background: `linear-gradient(90deg, ${color}, ${rgba(color, 0.2)})`,
                boxShadow: `0 0 14px ${rgba(color, 0.45)}`,
              }} />
            </div>
          </div>

          {/* firma de la serie, chiquita */}
          <div style={{
            marginTop: 10, fontFamily: F_BODY, fontWeight: 600, fontSize: 17, letterSpacing: 1.4,
            textTransform: "uppercase", color: rgba(V.bone, 0.75),
            textShadow: `0 2px 10px ${rgba(V.ink0, 0.9)}`,
          }}>
            Federer Veterinario
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import type { Theme } from "../kit/premium/theme";
import { Backdrop, OnFootage, StageCtx, ZONE_INFO, type StageZone } from "../kit/premium/stagecraft";

// ═══════════════════════════════════════════════════════════════════════════
// PREMIUM OVERLAY (_fed6) — monta un componente del kit sobre el b-roll vivo.
//
// Port del de `src/VideoEdit/scenes/PremiumOverlay.tsx` al árbol _fed6, que
// tiene su propio `kit/premium/stagecraft`. Hasta ahora _fed6 no lo tenía
// porque TODOS sus componentes se montan full-bleed (cada uno se pinta su
// propio fondo con el `Panel`/`Cinema` del core).
//
// ⛔ El que NO se pinta fondo es `LowerThirdId`: es un overlay puro (un `Stage`
//    transparente con la placa abajo-izquierda). Montado como cue suelta quedan
//    5 s de PANTALLA NEGRA y, peor, `SurfaceCtx` sigue en su default "paper",
//    así que `useInk` devuelve tinta OSCURA y el nombre sale negro sobre negro.
//    Ver `_BUGS_fed6_integracion.md` #6. Este overlay arregla las dos mitades:
//    pone footage REAL detrás y marca la superficie como "footage" (`OnFootage`)
//    para que la tinta salga clara.
//
// Igual que el original: escala 1:1, SIN fondo propio, y NO toca la opacidad
// (los componentes ya entran y salen con `useBeat`; dos fades encimados dejan
// el último medio segundo fantasma). `zone` viaja por contexto como pista de
// composición. `managed: true` le avisa al `Panel` que el fondo ya está tratado.
// ═══════════════════════════════════════════════════════════════════════════

export const PremiumOverlay: React.FC<{
  durationInFrames: number;
  zone?: StageZone;
  theme?: Theme;
  /** desenfoque del fondo. El default del `Backdrop` (30) borra al b-roll:
   *  para una placa de identificación queremos SEGUIR VIENDO a la persona. */
  blur?: number;
  /** 0..1 cuánto se hunde el plate */
  grade?: number;
  children: React.ReactNode;
}> = ({ durationInFrames, zone = "topLeft", theme, blur, grade, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const info = ZONE_INFO[zone] ?? ZONE_INFO.topLeft;
  const enter = spring({ frame, fps, config: { damping: 22, mass: 0.85, stiffness: 120 } });
  const scale = 1.012 - enter * 0.012;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <Backdrop theme={theme} durationInFrames={durationInFrames} zone={zone} blur={blur} grade={grade} />
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <StageCtx.Provider value={{ ...info, managed: true }}>
          <OnFootage>{children}</OnFootage>
        </StageCtx.Provider>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

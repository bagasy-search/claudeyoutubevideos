import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import type { Theme } from "../kit/premium/theme";
import { Backdrop, OnFootage, StageCtx, ZONE_INFO, type StageZone } from "../kit/premium/stagecraft";

// ═══════════════════════════════════════════════════════════════════════════
// PREMIUM OVERLAY — monta un componente del kit premium sobre el b-roll.
//
// ★ REESCRITO (jul 2026). La versión vieja hacía DOS cosas que arruinaban todos
//   los componentes del canal:
//
//   1) ESCALABA el componente a 0.61–0.69 para dejar la esquina inferior-derecha
//      libre "para el avatar cornerBR". Ese PiP ya NO EXISTE: la regla del canal
//      es avatar FULL o HIDDEN (feedback_video_avatar_full_or_fullvisual), así
//      que se estaba encogiendo todo para esquivar algo que no está. Resultado:
//      títulos de 58px que aterrizaban a 36px y subtítulos a 16px (ilegibles en
//      celular), más letterbox: hasta 650px de crema vacío por fitear un diseño
//      16:9 dentro de una zona que no lo es.
//   2) PINTABA SU PROPIA TARJETA crema, encima de la que ya pinta el Panel del
//      componente → dos rectángulos casi del mismo color, uno adentro del otro,
//      y el b-roll TAPADO. Cero compositing: se leía como diapositiva pegada.
//
//   Ahora: escala 1:1, SIN fondo propio. El componente compone sobre el b-roll
//   vivo (el Cinema del kit lo hunde, lo desenfoca y le apoya el papel encima).
//   `zone` sobrevive como PISTA DE COMPOSICIÓN — de qué lado se apoya el texto
//   y por dónde respira la imagen — y viaja por contexto a los componentes.
// ═══════════════════════════════════════════════════════════════════════════

export const PremiumOverlay: React.FC<{
  durationInFrames: number;
  zone?: StageZone;
  theme?: Theme;
  children: React.ReactNode;
}> = ({ durationInFrames, zone = "topLeft", theme, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const info = ZONE_INFO[zone] ?? ZONE_INFO.topLeft;
  // ★ El overlay NO toca la opacidad. Todos los componentes del kit ya hacen su
  //   entrada y salida con `useBeat` (spring de entrada + fade de 12 frames al
  //   final). Cuando el overlay ADEMÁS fundía, los dos fades se multiplicaban y
  //   el último medio segundo del plano quedaba fantasma (se veía el b-roll a
  //   través del texto). Acá sólo queda un asentamiento de escala imperceptible.
  const enter = spring({ frame, fps, config: { damping: 22, mass: 0.85, stiffness: 120 } });
  const scale = 1.012 - enter * 0.012;
  void interpolate;

  // ★ El TRATAMIENTO DEL FONDO lo monta ACÁ el overlay, no el componente: el
  //   `backdrop-filter` se anula si algún ancestro tiene `opacity < 1`, y los
  //   componentes se funden con `useBeat`. Montado acá (opacidad siempre 1) el
  //   desenfoque puede ANIMARSE: el fondo se va de foco, aparecen las piezas
  //   encima, y al final el fondo vuelve. `managed:true` le avisa al `Panel`
  //   que no lo pinte de nuevo.
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <Backdrop theme={theme} durationInFrames={durationInFrames} zone={zone} />
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <StageCtx.Provider value={{ ...info, managed: true }}>
          <OnFootage>{children}</OnFootage>
        </StageCtx.Provider>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

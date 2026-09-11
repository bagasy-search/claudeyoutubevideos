import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { AvatarLayerSal } from "./scenes/AvatarLayerSal";
import { CUES, OVERLAYS } from "./cues_vslcurso.gen";
import { AVATAR_WINDOWS, TOTAL_VSLCURSO } from "./avatar_vslcurso.gen";
import { INK } from "../vslcurso/Piezas";

// ── VSL de la landing constructorlibre.com/curso ──────────────────────────────────────────────
// Curso "De $3 a $180 por Pared". Presentador Tomás. Máster 277,632 s.
//
// ⛔⛔ 0 → 6,00 s el avatar va FULL y HABLANDO: ese tramo del máster es su audio ORIGINAL
//    ("Quiero que mires este comentario…"), así que el lipsync es REAL. Es la regla dura del
//    creador: el video abre con su cara.
// ⛔⛔ 6,00 → 17,4026 s el avatar va SIEMPRE `hidden`: ahí el audio es voz Fish (el hook se
//    regrabó sobre comentarios REALES de YouTube) y la boca no coincide. El build lo impone.
// ⛔ `sinMovimiento`: el push Ken-Burns del avatar RECORTA el encuadre (arranca ampliado al 6 %
//    en las ventanas impares) y el creador lo rechazó — "un movimiento horrendo que hace que se
//    desencuadre". Con esta prop el avatar queda 1:1.
// ⛔ El avatar va MUTEADO: el audio sale de UN solo <Audio> con el máster empalmado.
// ⛔ Cero <Sequence> escrita a mano: todo sale del build, que es lo que miran las compuertas.
export const TOTAL_FRAMES_VSLCURSO = Math.round(TOTAL_VSLCURSO * 30);

export const MainVslcurso: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: INK }}>
    {/* el avatar es el FONDO GARANTIZADO: base `full`, se oculta sólo donde hay b-roll */}
    <AvatarLayerSal
      src="vslcurso_opt.mp4"
      wav="vslcurso.wav"
      muted
      sinMovimiento
      windows={AVATAR_WINDOWS}
      accent="#E0922C"
    />
    {CUES.map((c) => (
      <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
        <AbsoluteFill>{c.el()}</AbsoluteFill>
      </Sequence>
    ))}
    {OVERLAYS.map((c) => (
      <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
        <AbsoluteFill>{c.el()}</AbsoluteFill>
      </Sequence>
    ))}
    <Audio src={staticFile("vslcurso.wav")} />
  </AbsoluteFill>
);

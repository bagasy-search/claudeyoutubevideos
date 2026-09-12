import React from "react";
import { Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// ═══════════════════════════════════════════════════════════════════════════
// TYPEWRITER — revelado de texto letra por letra, con sonido de tipeo suave.
//
// Por qué existe: el kit revelaba los textos con fade/slide, y el usuario pidió
// (ago-2026) que los textos que acompañan una foto se ESCRIBAN en pantalla, con
// un sonidito de teclado agradable. `DateStampCorner` tenía un typewriter propio
// hardcodeado; esto lo generaliza para cualquier componente.
//
// Es ADITIVO: ningún componente lo usa salvo que le pasen `typewriter`. Los
// canales que no lo pidan siguen renderizando exactamente igual que antes.
//
// SFX: rota entre las 8 tomas de `sfx/lib/key_soft_N.mp3` (CC0) para que no
// suene el mismo click repetido. Un cue cada `sfxEvery` caracteres — uno por
// letra serían 60 <Audio> por plano y el render se arrastra.
// ═══════════════════════════════════════════════════════════════════════════

export const TYPE_POOL = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `sfx/lib/key_soft_${n}.mp3`);

/** Cuántos frames tarda en escribirse un texto (para calcular la duración del plano). */
export const typeFrames = (text: string, fps: number, cps = 26) =>
  Math.ceil((text.length / cps) * fps);

/** Devuelve el texto revelado hasta el frame actual. */
export const useTypewriter = (text: string, startFrame = 0, cps = 26) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chars = Math.round(((frame - startFrame) / fps) * cps);
  const n = Math.max(0, Math.min(text.length, chars));
  return { shown: text.slice(0, n), done: n >= text.length, started: frame >= startFrame };
};

/** Los cues de teclado sincronizados con las letras. Montalo UNA vez por texto. */
export const TypeSfx: React.FC<{
  text: string;
  startFrame?: number;
  cps?: number;
  every?: number;
  volume?: number;
  pool?: string[];
}> = ({ text, startFrame = 0, cps = 26, every = 3, volume = 0.22, pool = TYPE_POOL }) => {
  const { fps } = useVideoConfig();
  const cues: React.ReactNode[] = [];
  for (let i = 0; i < text.length; i += every) {
    if (text[i] === " ") continue; // el espacio no suena
    const at = Math.round(startFrame + (i / cps) * fps);
    if (at < 0) continue;
    cues.push(
      <Sequence key={i} from={at} durationInFrames={12} layout="none">
        <Audio src={staticFile(pool[(i / every) % pool.length])} volume={volume} />
      </Sequence>,
    );
    if (cues.length >= 26) break; // techo: no inundar el render de <Audio>
  }
  return <>{cues}</>;
};

/** Cursor que parpadea mientras se escribe y desaparece al terminar. */
export const Caret: React.FC<{ color?: string; done?: boolean; height?: number }> = ({
  color = "currentColor",
  done = false,
  height = 0.9,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (done) return null;
  const on = Math.floor((frame / fps) * 2) % 2 === 0;
  return (
    <span
      style={{
        display: "inline-block",
        width: "0.07em",
        height: `${height}em`,
        background: color,
        opacity: on ? 0.85 : 0,
        marginLeft: "0.06em",
        verticalAlign: "-0.08em",
        borderRadius: 1,
      }}
    />
  );
};

/** Texto que se escribe solo. Usalo dentro de cualquier componente del kit. */
export const Typed: React.FC<{
  text: string;
  startFrame?: number;
  cps?: number;
  sfx?: boolean;
  caret?: boolean;
  volume?: number;
}> = ({ text, startFrame = 0, cps = 26, sfx = true, caret = true, volume = 0.22 }) => {
  const { shown, done } = useTypewriter(text, startFrame, cps);
  return (
    <>
      {shown}
      {caret && <Caret done={done} />}
      {sfx && <TypeSfx text={text} startFrame={startFrame} cps={cps} volume={volume} />}
    </>
  );
};

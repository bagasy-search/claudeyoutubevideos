import { Audio, staticFile, useVideoConfig } from "remotion";

// ── AudioBed — cama de música + DUCKING bajo la narración ─────────────────────
// El "audio plano" (solo voz) era uno de los déficits más amateur del pipeline.
// Este componente pone una pista de música a volumen bajo y la DUCKEA (baja más)
// exactamente cuando el narrador habla, usando los intervalos de habla derivados
// de los timestamps de Whisper (los calcula beatsheet.mjs → AUDIO_BED en el .gen).
//
// Determinista y prop-driven: el envelope es una función pura del frame.
//   · base:   volumen de música en silencios (respiraciones, pausas) — se "asoma"
//   · duck:   volumen bajo la voz (cama sutil, nunca compite)
//   · attack 0.15s antes de cada frase / release 0.8s después → sin bombeo brusco
//   · fade-in 1.5s al arrancar, fade-out 3s al final
// La pista va en public/music/ (loop si es más corta que el video: prop loop).
export type SpeechSpan = [number, number]; // [startSec, endSec] de habla continua

const ATTACK = 0.15; // s antes de la frase para llegar al duck
const RELEASE = 0.8; // s después de la frase para volver a base

export const AudioBed: React.FC<{
  src: string; // p.ej. "music/bed_rustic.mp3"
  activity: SpeechSpan[]; // intervalos de habla (ordenados, merged)
  base?: number;
  duck?: number;
  totalSec: number; // duración del video (para el fade-out)
  loop?: boolean;
}> = ({ src, activity, base = 0.13, duck = 0.05, totalSec, loop = true }) => {
  const { fps } = useVideoConfig();
  const volumeAt = (f: number) => {
    const t = f / fps;
    // speechness 0..1: 1 dentro de una frase, rampas en attack/release
    let s = 0;
    for (const [a, b] of activity) {
      if (t < a - ATTACK) break; // ordenados: nada más adelante puede aplicar
      if (t >= a - ATTACK && t < a) s = Math.max(s, (t - (a - ATTACK)) / ATTACK);
      else if (t >= a && t <= b) { s = 1; break; }
      else if (t > b && t <= b + RELEASE) s = Math.max(s, 1 - (t - b) / RELEASE);
    }
    const v = base - (base - duck) * s;
    const fadeIn = Math.min(1, t / 1.5);
    const fadeOut = Math.min(1, Math.max(0, (totalSec - t) / 3));
    return Math.max(0, v * fadeIn * fadeOut);
  };
  return <Audio src={staticFile(src)} volume={volumeAt} loop={loop} />;
};

// ── SfxRail — riel de SFX data-driven ────────────────────────────────────────
// beatsheet.mjs emite SFX_CUES = [{at, role, vol?}] (at en SEGUNDOS, rol del pack
// suave de Sfx.tsx). Acá se renderizan todos — un solo componente en el Main.
import { SfxCue, SFX } from "./Sfx";

export type SfxCueData = { at: number; role: keyof typeof SFX; vol?: number };

export const SfxRail: React.FC<{ cues: SfxCueData[] }> = ({ cues }) => {
  const { fps } = useVideoConfig();
  return (
    <>
      {cues.map((c, i) =>
        SFX[c.role] ? (
          <SfxCue key={`${c.role}_${i}_${c.at}`} at={Math.round(c.at * fps)} src={SFX[c.role]} volume={c.vol ?? 0.35} />
        ) : null,
      )}
    </>
  );
};

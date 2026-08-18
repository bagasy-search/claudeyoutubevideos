import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { sec, COLORS } from "./theme_ben";
import { CinematicWrap } from "./components/CinematicWrap";
import { SfxCue, SFX } from "./components/Sfx";
import { CUES, SFX_CUES } from "./cues_retire5countries.gen";

// ── CANAL "RETIRE ABROAD" · "5 Countries Practically Begging Americans to Retire" ──
// Look finance-avatar (theme_ben) SESGADO CÁLIDO: los accents por componente llevan el
// tono (ámbar/oro/verde en los países, ROJO en los avisos). Motor anti-hueco: L0 = avatar
// persistente FULL (un solo <OffthreadVideo>, audio continuo) + cues OPACOS encima que
// cubren SU slot; en los huecos se ve el avatar full → nunca fondo muerto.
// Ambiente de mar bajo todo el video (nota del creador: sonido ambiental donde está el avatar).

// max(fin de beats, largo del wav del avatar 1426.6s) + pad → nunca corta la última frase.
const VIDEO_END = Math.max(Math.max(...CUES.map((c) => c.start + c.dur)), 1427.2) + 1.3;
export const TOTAL_FRAMES_RA = Math.round(VIDEO_END * 30);
const AVATAR = staticFile("retire5countries_opt.mp4");

/* ── L0: avatar persistente full, ken-burns lento, sin handheld ── */
const AvatarLayer: React.FC = () => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const push = interpolate(f, [0, durationInFrames], [1, 1.05], { extrapolateRight: "clamp" });
  const x = Math.sin(f * 0.0011) * 7;
  const y = Math.cos(f * 0.0009) * 5;
  return (
    <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px) scale(${push})`, willChange: "transform" }}>
      <OffthreadVideo src={AVATAR} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <AbsoluteFill style={{ pointerEvents: "none", background: `linear-gradient(180deg, transparent 55%, ${COLORS.bg0}22 100%)` }} />
    </AbsoluteFill>
  );
};

export const MainRetire5: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <CinematicWrap handheld={0} grain={0.05}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <AvatarLayer />
          {CUES.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={Math.max(1, sec(cue.dur))} premountFor={20} name={`${cue.kind} · ${cue.key}`}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
        </AbsoluteFill>
      </CinematicWrap>
      {/* ambiente de mar CONTINUO y sin cortes (loop seamless, fits la playa donde está el avatar) */}
      <Audio src={staticFile("sfx/ra_ambient_ocean.mp3")} volume={0.11} loop />
      {/* SFX suaves en los reveals de componentes (bajos, que no tapen la voz ni el mar) */}
      {SFX_CUES.map((s, i) => (
        <SfxCue key={"sfx" + i} at={s.at} src={(SFX as Record<string, string>)[s.role] || SFX.popUp} volume={Math.min(s.vol ?? 0.16, 0.16)} durationInFrames={sec(1.2)} />
      ))}
    </AbsoluteFill>
  );
};

export const TOTAL_FRAMES = TOTAL_FRAMES_RA;
export default MainRetire5;

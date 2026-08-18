import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { sec, COLORS } from "./theme_ben";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES } from "./cues_retire7rich.gen";

// ── CANAL "RETIRE ABROAD" · "7 Countries Where Your Social Security Check Makes You Rich" ──
// Look finance-avatar (theme_ben) SESGADO CÁLIDO: accents por componente (ámbar/oro/verde en
// los países, ROJO en los avisos). Motor anti-hueco: L0 = avatar persistente FULL (un solo
// <OffthreadVideo>, audio continuo) + cues OPACOS encima que cubren SU slot; en los huecos se
// ve el avatar full → nunca fondo muerto. Ambiente de mar bajo todo el video (nota del creador).

// max(fin de beats, largo del wav del avatar 1501.8s) + pad → nunca corta la última frase.
const VIDEO_END = Math.max(Math.max(...CUES.map((c) => c.start + c.dur)), 1502.0) + 1.3;
export const TOTAL_FRAMES_R7 = Math.round(VIDEO_END * 30);
const AVATAR = staticFile("retire7rich_opt.mp4");

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

export const MainRetire7: React.FC = () => {
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
      {/* ambiente REAL del creador (loop 16s, normalizado), fits la playa donde está el avatar */}
      <Audio src={staticFile("sfx/ra_ambient_ocean.mp3")} volume={0.22} loop />
    </AbsoluteFill>
  );
};

export const TOTAL_FRAMES = TOTAL_FRAMES_R7;
export default MainRetire7;

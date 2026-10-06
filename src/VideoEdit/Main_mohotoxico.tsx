import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_mohotoxico.gen";
import { AVATAR_WINDOWS, TOTAL_MOHOTOXICO, SEAM_MOHOTOXICO } from "./avatar_mohotoxico.gen";

export const TOTAL_FRAMES_MOHOTOXICO = Math.round(TOTAL_MOHOTOXICO * 30);

// AVATAR PARCIAL + BUCLE: el creador grabó hasta SEAM. De ahí en adelante el <Video> se repite,
// así que va SIEMPRE muteado y el audio lo ponen dos pistas separadas:
//   tramo 1 = el audio del propio MP4 (extraído tal cual, así el lipsync no puede desincronizarse)
//   tramo 2 = la cola locutada con Fish, desde SEAM
export const MainMohotoxico: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
    <CinematicWrap grain={0} vignette={0}>
      <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
        <TechBackground glowX={50} glowY={46} hue="amber" drift={0.4} />
        {CUES.map((cue) => (
          <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
            {cue.el(sec(cue.dur))}
          </Sequence>
        ))}
        <AvatarLayer
          src="mohotoxico_opt.mp4"
          windows={AVATAR_WINDOWS}
          accent={COLORS.accent}
          wav="mohotoxico.wav"
          loop
          muted
        />
        {OVERLAYS.map((cue) => (
          <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
            {cue.el(sec(cue.dur))}
          </Sequence>
        ))}
        <Audio src={staticFile("mohotoxico_tramo1.wav")} />
        <Sequence from={sec(SEAM_MOHOTOXICO)}>
          <Audio src={staticFile("mohotoxico_cola.wav")} />
        </Sequence>
      </AbsoluteFill>
    </CinematicWrap>
  </AbsoluteFill>
);

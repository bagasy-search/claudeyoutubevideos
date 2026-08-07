import { AbsoluteFill, Sequence, Audio, staticFile, useCurrentFrame, interpolate } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_ollabarro.gen";
import { AVATAR_WINDOWS, TOTAL_OLLABARRO } from "./avatar_ollabarro.gen";

// ── "Truco Amish de la OLLA DE BARRO de $5 — Mejor Huerta del Vecindario" — Levi Lapp Jardín ──
// STOCK/foto real (Pexels + web) + IA solo del presentador Levi + AVATAR full en tramos retóricos
// + kit premium THEME_EARTH. Música de fondo calma en loop, bien abajo, swell suave en el hook.
export const TOTAL_FRAMES_OLLABARRO = Math.round(TOTAL_OLLABARRO * 30);

const MusicBed: React.FC = () => {
  const f = useCurrentFrame();
  const s = f / 30;
  const vol = interpolate(
    s,
    [0, 4, 10, 24, 30, TOTAL_OLLABARRO - 6, TOTAL_OLLABARRO],
    [0.06, 0.12, 0.16, 0.16, 0.11, 0.11, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return <Audio src={staticFile("ollabarro_music.mp3")} loop volume={vol} />;
};

export const MainOllabarro: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <CinematicWrap grain={0} vignette={0}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={46} hue="amber" drift={0.4} />
          {CUES.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          <AvatarLayer src="ollabarro_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
          {OVERLAYS.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          <MusicBed />
        </AbsoluteFill>
      </CinematicWrap>
    </AbsoluteFill>
  );
};

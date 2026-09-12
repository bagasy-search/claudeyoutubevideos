import { AbsoluteFill, Sequence, Audio, staticFile, interpolate } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES } from "./cues_hielo.gen";
import { AVATAR_WINDOWS, TOTAL_HIELO } from "./avatar_hielo.gen";

export const TOTAL_FRAMES_HIELO = Math.round(TOTAL_HIELO * 30);

// SFX sincronizado [segundo, archivo, volumen] — acentos atados a cada evento visual.
const SFX: [number, string, number][] = [
  [4.4, "sfx_thump.mp3", 0.28],            // entra el bloque de hielo
  [8.33, "node_pop.mp3", 0.34], [8.9, "sfx_text_thud.mp3", 0.4],   // card 1 + tachado
  [9.55, "node_pop.mp3", 0.34], [10.12, "sfx_text_thud.mp3", 0.4], // card 2 + tachado
  [10.77, "node_pop.mp3", 0.34], [11.34, "sfx_text_thud.mp3", 0.4],// card 3 + tachado
  [16.3, "sfx_whoosh_soft.mp3", 0.3], [17.6, "keyboard_type.mp3", 0.2], // blur + tipeo
  [34.86, "sfx_chime.mp3", 0.3],           // keyphrase July/August
  [50.7, "node_pop.mp3", 0.3], [52.4, "node_pop.mp3", 0.3], [54.6, "node_pop.mp3", 0.3], [55.8, "winner_chime.mp3", 0.28], // ecuación
  [75.0, "number_slam.mp3", 0.34],         // "9 MONTHS" reveal
  [76.5, "stinger_hit.mp3", 0.34],         // "one mistake" redacted
  [96.5, "number_roll.mp3", 0.3], [98.8, "layer_drop.mp3", 0.3],   // salt plunge
  [107.15, "text_slam.mp3", 0.42],         // sello IMPOSSIBLE
  [116.93, "section_swell.mp3", 0.32],     // radsky clímax
  [131.57, "cam_zoom_punch.mp3", 0.3], [133.8, "node_land.mp3", 0.3], // map zoom + pin
];

export const MainHielo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <CinematicWrap handheld={0} grain={0} vignette={0}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={46} hue="cold" drift={0.4} />
          {CUES.filter((c) => c.kind !== "float").map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          <AvatarLayer src="hielo_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
          {/* floats (micro-inserts) van ENCIMA del avatar */}
          {CUES.filter((c) => c.kind === "float").map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
        </AbsoluteFill>
      </CinematicWrap>
      {/* música de fondo "Elmwood Ledger" — volumen MUY bajo, con fade in/out */}
      <Audio
        src={staticFile("hielo_music.mp3")}
        volume={(f) =>
          interpolate(
            f,
            [0, 40, TOTAL_FRAMES_HIELO - 75, TOTAL_FRAMES_HIELO],
            [0, 0.06, 0.06, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {/* SFX sincronizado a cada evento */}
      {SFX.map(([at, file, vol], i) => (
        <Sequence key={`sfx${i}`} from={Math.round(at * 30)} durationInFrames={120}>
          <Audio src={staticFile(`sfx/${file}`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// Main_mdsmell.tsx — GENERADO. NO editar a mano.
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { CUES, OVERLAYS } from "./cues_mdsmell.gen";

export const TOTAL_FRAMES_MDSMELL = 45731;

export const MainMdSmell: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0A0C" }}>
    {/* AVATAR POR VENTANAS: los clips de talking-head van como CUES (MdsAvatar), no como piso. El
        b-roll cubre el resto. Un solo <Audio> con el master. */}
    <Audio src={staticFile("mdsmell.m4a")} />
    {CUES.map((cue) => (
      <Sequence key={cue.key} from={cue.from} durationInFrames={Math.max(1, cue.dur)}>
        {cue.el(Math.max(1, cue.dur))}
      </Sequence>
    ))}
    {OVERLAYS.map((o) => (
      <Sequence key={o.key} from={o.from} durationInFrames={Math.max(1, o.dur)}>
        {o.el(Math.max(1, o.dur))}
      </Sequence>
    ))}
  </AbsoluteFill>
);

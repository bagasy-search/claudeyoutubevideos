// Main_mdgrout.tsx — GENERADO por build_mdgrout.mjs. NO editar a mano.
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CUES, OVERLAYS } from "./cues_mdgrout.gen";
import { AVATAR_WINDOWS, TOTAL_FRAMES_MDGROUT } from "./avatar_mdgrout.gen";

export const MainMdGrout: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0A0C" }}>
    {/* AVATAR PARCIAL: grabado hasta 901s y en BUCLE después. Va MUTEADO: el audio
        sale del máster (avatar + cola de Fish). `wav` explícito a 8 kHz para el borde
        audio-reactivo — sin él, AvatarLayer DERIVA "mdgrout.wav" del nombre del video y ese wav
        de 153 MB viaja en el tar 60 veces. */}
    <AvatarLayer src="mdgrout_opt.mp4" windows={AVATAR_WINDOWS} accent="#E4322A" loop muted wav="mdgrout_amp.wav" />

    <Audio src={staticFile("mdgrout.m4a")} />

    {CUES.map((cue) => (
      <Sequence key={cue.key} from={cue.from} durationInFrames={Math.max(1, cue.dur)}>
        {cue.el(Math.max(1, cue.dur))}
      </Sequence>
    ))}

    {/* OVERLAYS: van ENCIMA de lo que haya (avatar o b-roll). No ocultan nada. */}
    {OVERLAYS.map((o) => (
      <Sequence key={o.key} from={o.from} durationInFrames={Math.max(1, o.dur)}>
        {o.el(Math.max(1, o.dur))}
      </Sequence>
    ))}
  </AbsoluteFill>
);

export { TOTAL_FRAMES_MDGROUT };

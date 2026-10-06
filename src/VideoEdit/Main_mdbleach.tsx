// Main_mdbleach.tsx — "Never Pour BLEACH Down THIS" (canal Mike Dalton, EN).
//
// Cuatro capas y nada más. Todo lo que cambia entre corridas vive en los .gen que escribe
// `build_mdbleach.mjs`; este archivo NO tiene ni un `<Sequence>` escrito a mano (ni HOOK ni
// ENDCARD): al clonar un Main de otro video esas dos son las que se quedan con el texto —
// y el idioma — del video anterior.
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CUES, OVERLAYS, SFXCUES } from "./cues_mdbleach.gen";
import { AVATAR_WINDOWS, TOTAL_FRAMES_MDBLEACH } from "./avatar_mdbleach.gen";

const F = (s: number) => Math.round(s * 30);

export const MainMdBleach: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0A0C" }}>
    {/* el avatar es el FONDO GARANTIZADO: UN solo <Video> montado los 1191 s (si se dibujara en
        dos ramas oculto/visible, el audio glitchearía en cada cambio de escena), siempre con
        push lento Ken-Burns cuando está full, y nunca deja hueco negro. */}
    <AvatarLayer src="mdbleach_opt.mp4" windows={AVATAR_WINDOWS} accent="#E4322A" />

    {/* B-ROLL: clips i2v, fotos PHOTO_ONLY y los 6 movimientos. Estos SÍ tapan al avatar. */}
    {CUES.map((cue) => (
      <Sequence key={cue.key} from={F(cue.start)} durationInFrames={Math.max(1, F(cue.dur))}>
        {cue.el(Math.max(1, F(cue.dur)))}
      </Sequence>
    ))}

    {/* IDEAS: van ENCIMA y NO ocultan el avatar (si lo ocultaran, un overlay sin b-roll debajo
        dejaría segundos de negro). */}
    {OVERLAYS.map((o) => (
      <Sequence key={o.key} from={F(o.start)} durationInFrames={Math.max(1, F(o.dur))}>
        {o.el(Math.max(1, F(o.dur)))}
      </Sequence>
    ))}

    {SFXCUES.map((s, i) => (
      <Sequence key={"sfx" + i} from={F(s.start)}>
        <Audio src={staticFile(s.src)} volume={s.vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

export { TOTAL_FRAMES_MDBLEACH };

// Main_ohfstinkbug.tsx — GENERADO por build_ohfstinkbug.mjs. NO editar a mano.
import { AbsoluteFill, Img, Sequence, staticFile } from "remotion";
import { AvatarLayerOhf } from "../ohfstinkbug/AvatarLayerOhf";
import { CUES } from "./cues_ohfstinkbug.gen";
import { AVATAR_WINDOWS, TOTAL_FRAMES_OHFSTINKBUG } from "./avatar_ohfstinkbug.gen";

const F = (s: number) => Math.round(s * 30);
const QR_IN = 1835.5, QR_DUR = 10;

// El audio máster lo muxea el FARM en el stitch, por eso acá no hay <Audio>. `wav` apunta al de
// 8 kHz: el borde audio-reactivo sólo necesita 16 bandas, y el máster no se baja entero en cada chunk.
export const MainOhfStinkbug: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0A0C" }}>
    <AvatarLayerOhf src="ohfstinkbug_opt.mp4" wav="ohfstinkbug_vis.wav" windows={AVATAR_WINDOWS} accent="#E0A32E" loop muted />

    {CUES.map((cue) => (
      <Sequence key={cue.key} from={F(cue.start)} durationInFrames={Math.max(1, F(cue.dur))}>
        {cue.el(Math.max(1, F(cue.dur)))}
      </Sequence>
    ))}

    {/* QR del CTA: el guion promete "a code on the screen". Tamano EXACTO del PNG (480x480),
        sin objectFit, para que no se estire y siga decodificando. */}
    <Sequence from={F(QR_IN)} durationInFrames={F(QR_DUR)}>
      <AbsoluteFill>
        <Img src={staticFile("ohfstinkbug_qr.png")}
             style={{ position: "absolute", right: 96, bottom: 96, width: 480, height: 480,
                      borderRadius: 12, boxShadow: "0 18px 60px rgba(0,0,0,0.55)" }} />
      </AbsoluteFill>
    </Sequence>
  </AbsoluteFill>
);

export { TOTAL_FRAMES_OHFSTINKBUG };

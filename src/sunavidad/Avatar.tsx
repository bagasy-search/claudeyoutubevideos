// sunavidad · ventanas de avatar sobre el reel de RunPod (public/av/sunavidad_reel0.mp4).
// Cada ventana usa su offset (segundos dentro del reel) — lo escribe avbuild_sunavidad.py en avwin.json.
import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile } from "remotion";
import { fr } from "./Base";
import AVW from "./avwin.json";

export const AvatarWins: React.FC = () => (
  <>
    {AVW.win.map((w: any, i: number) => (
      <Sequence key={i} from={Math.max(0, fr(w.ms) - 2)} durationInFrames={fr(w.me - w.ms) + 2}>
        <AbsoluteFill style={{ backgroundColor: "#000" }}>
          <OffthreadVideo src={staticFile("av/sunavidad_reel0.mp4")} startFrom={Math.max(0, fr(w.off) - 2)} muted style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </AbsoluteFill>
      </Sequence>
    ))}
  </>
);
export const AvWin: React.FC = () => null;

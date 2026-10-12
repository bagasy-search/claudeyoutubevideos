// suengano · avatar (reel RunPod). Cada ventana de avwin.json entra en su tiempo de la linea final
// y arranca en su startFrom (xcorr de audio contra el reel, ver avwin.json). El reel va MUTEADO:
// la voz es la pista maestra de la composicion. El lead de labios es una recta de 5 puntos
// (40/120/200/250/300 s del reel) aplicada por ventana (modelo sucarne/Avatar.tsx).
import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile } from "remotion";
import avwin from "./avwin.json";

type Win = { n: string; ms: number; me: number; startFrom: number };
const WINS: Win[] = (avwin as unknown as { win: Win[] }).win;
const REEL = staticFile("avatar/suengano_reel0_cfr.mp4");
const FPS = 30;
const fr = (s: number) => Math.round(s * FPS);

// Monta las ventanas que se cruzan con [from, to) en tiempo de la composicion.
// `base` = segundo absoluto del video que corresponde al frame 0 de la composicion.
export const AvatarWins: React.FC<{ from: number; to: number; base: number }> = ({ from, to, base }) => (
  <>
    {WINS.filter((w) => w.me > from + base && w.ms < to + base).map((w) => (
      <Sequence key={w.n} from={fr(w.ms - base)} durationInFrames={fr(w.me) - fr(w.ms)}>
        <AbsoluteFill style={{ backgroundColor: "#000" }}>
          <OffthreadVideo
            src={REEL}
            startFrom={Math.round(w.startFrom * FPS)}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      </Sequence>
    ))}
  </>
);

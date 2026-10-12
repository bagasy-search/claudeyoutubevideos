// suempl · avatar (reel RunPod 832x464, 25 fps). Ventanas FIJAS de avwin.json: cada una entra en su tiempo
// de la línea final (ms..me) y arranca en su offset dentro del reel.
// Labios adelantados medidos con lipsync_medir (--auto) en 5 puntos del reel, con control de desfase:
//   40 s 0,100 · 120 s 0,133 · 200 s 0,133 · 250 s 0,333 · 300 s 0,267  (correlaciones 0,24-0,49: evidencia débil)
// Recta por mínimos cuadrados: lead(τ) = 0,0485 + 0,000795·τ (R² 0,66). Cada ventana usa el lead de su punto medio.
// El audio del reel va muteado: la voz la pone el montaje final.
import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile } from "remotion";
import { fr } from "../repkit/Rk";
import avwin from "./avwin.json";

type Win = { n: string; ms: number; me: number; off: number };
const WINS: Win[] = (avwin as unknown as { win: Win[] }).win;
const REEL = staticFile("avatar/suempl_reel0_cfr.mp4");
const FPS = 30;
const lipLead = (tau: number) => 0.0485 + 0.000795 * tau;

export const AvatarWins: React.FC<{ from: number; to: number }> = ({ from, to }) => (
  <>
    {WINS.filter((w) => w.me > from && w.ms < to).map((w) => (
      <Sequence key={w.n} from={fr(w.ms)} durationInFrames={fr(w.me) - fr(w.ms)}>
        <AbsoluteFill style={{ backgroundColor: "#000" }}>
          <OffthreadVideo
            src={REEL}
            startFrom={Math.round(Math.max(0, w.off - lipLead(w.off + (w.me - w.ms) / 2)) * FPS)}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      </Sequence>
    ))}
  </>
);

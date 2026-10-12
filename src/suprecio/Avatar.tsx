// suprecio · avatar (reel RunPod). Cada ventana de avwin.json entra en su tiempo de la línea final (ms..me)
// y arranca en su offset dentro del reel. El audio del reel va muteado: la voz la pone el montaje final.
// Labios: recta medida en 5 puntos del reel (40, 110, 180, 250, 310 s), R² 0,36 (débil; revisar en R5).
import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile } from "remotion";
import { fr } from "../ckeggs/Base";
import avwin from "./avwin.json";

type Win = { n: string; ms: number; me: number; off: number };
const WINS: Win[] = (avwin as unknown as { win: Win[] }).win;
const REEL = staticFile("avatar/suprecio_reel0.mp4");
const FPS = 30;
const lipLead = (tau: number) => 0.2408 + 0.000445 * tau;

export const AvatarWins: React.FC<{ from: number; to: number; shrink?: [number, number][] }> = ({ from, to, shrink = [] }) => (
  <>
    {WINS.filter((w) => w.me > from && w.ms < to).map((w) => {
      const sh = shrink.some(([a, b]) => w.me > a && w.ms < b);
      return (
      <Sequence key={w.n} from={fr(w.ms)} durationInFrames={fr(w.me) - fr(w.ms)}>
        <AbsoluteFill style={{ backgroundColor: "#000" }}>
          <OffthreadVideo
            src={REEL}
            startFrom={Math.round(Math.max(0, w.off - lipLead(w.off + (w.me - w.ms) / 2)) * FPS)}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover", ...(sh ? { transform: "translateX(-18%) scale(1.4)", transformOrigin: "50% 50%" } : {}) }}
          />
        </AbsoluteFill>
      </Sequence>
      );
    })}
  </>
);

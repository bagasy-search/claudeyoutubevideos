// sucarne · avatar (reel RunPod). Cada ventana de avwin.json entra en su tiempo de la línea final
// (ms..me) y arranca en su offset dentro del reel. Las ventanas son FIJAS (ver avbuild_sucarne.py).
// El audio del reel va muteado: la voz la pone el montaje final (sucarnecut.wav).
import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile } from "remotion";
import { fr } from "./Base";
import avwin from "./avwin.json";

type Win = { n: string; ms: number; me: number; off: number };
const WINS: Win[] = (avwin as unknown as { win: Win[] }).win;
const REEL = staticFile("avatar/sucarne_reel0.mp4");
const FPS = 30;
// Labios adelantados medidos en el reel con lipsync_medir (control +200 ms validado):
//   40 s 0,067 · 120 s 0,167 · 200 s 0,133 · 250 s 0,367 · 280 s 0,300
// InfiniteTalk deriva casi lineal a lo largo del reel: recta por mínimos cuadrados (R² 0,72),
// lead(τ) con τ = tiempo dentro del reel. Cada ventana usa el lead de su punto medio.
const lipLead = (tau: number) => 0.0171 + 0.001066 * tau;

// Monta las ventanas que se cruzan con [from, to) en tiempo absoluto de la línea final.
export const AvatarWins: React.FC<{ from: number; to: number; skip?: string[] }> = ({ from, to, skip = [] }) => (
  <>
    {WINS.filter((w) => w.me > from && w.ms < to && !skip.includes(w.n)).map((w) => (
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

// Ventana n en un costado (izquierda, achicada al 46 % del ancho) para dejar el otro lado a un componente.
export const AvatarWinSide: React.FC<{ n: string }> = ({ n }) => {
  const w = WINS.find((x) => x.n === n);
  if (!w) return null;
  return (
    <Sequence from={fr(w.ms)} durationInFrames={fr(w.me) - fr(w.ms)}>
      <div style={{ position: "absolute", left: 0, top: 291, width: 883, height: 497, overflow: "hidden", background: "#000" }}>
        <OffthreadVideo
          src={REEL}
          startFrom={Math.round(Math.max(0, w.off - lipLead(w.off + (w.me - w.ms) / 2)) * FPS)}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </Sequence>
  );
};

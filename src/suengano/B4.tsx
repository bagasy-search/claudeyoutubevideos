// suengano · bloque 820-974 s. Lee public/suengano_820_974.json (tiempos absolutos del video).
// AV: cada pieza toma su startFrom desplazado desde la ventana de avwin.json que la contiene.
import React from "react";
import { Audio, AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile } from "remotion";
import { CountCard } from "../repkit/Kit";
import avwin from "./avwin.json";
import shots from "../../public/suengano_820_974.json";

type Shot = { from: number; to: number; kind: string; file: string | null; zoom: number; motive: string; clip?: number };
type Win = { n: string; ms: number; me: number; startFrom: number };
const WINS: Win[] = (avwin as unknown as { win: Win[] }).win;
const REEL = staticFile("avatar/suengano_reel0_cfr.mp4");
const FPS = 30;
const BASE = 820;
const fr = (s: number) => Math.round(s * FPS);
const rel = (s: number) => s - BASE;

const avStart = (t: number): number => {
  const w = WINS.find((x) => x.ms - 0.01 <= t && x.me >= t);
  if (!w) throw new Error("sin ventana AV para " + t);
  return w.startFrom + (t - w.ms);
};

export const SuenganoB4: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Audio src={staticFile("suenganocut.wav")} trimBefore={fr(BASE)} />
    {(shots as Shot[]).map((s, i) => {
      const from = fr(rel(s.from));
      const dur = fr(s.to) - fr(s.from);
      const d = s.to - s.from;
      if (s.kind === "AV") {
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            <AbsoluteFill style={{ backgroundColor: "#000" }}>
              <OffthreadVideo src={REEL} startFrom={Math.round(avStart(s.from) * FPS)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </AbsoluteFill>
          </Sequence>
        );
      }
      if (s.kind === "C") {
        const cfg =
          Math.abs(s.from - 914.81) < 0.1 ? { n: 1, bg: "img/suengano/ticket_blank.png" }
          : Math.abs(s.from - 930.0) < 0.1 ? { n: 2, bg: "img/suengano/caja_b.png" }
          : { n: 3, bg: "img/suengano/lista_recap.png" };
        const title = cfg.n === 1 ? "antes de salir mira el ticket" : cfg.n === 2 ? "busca el producto y compara" : "pide que lo verifiquen";
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            <AbsoluteFill style={{ overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: "scale(0.6667)", transformOrigin: "0 0" }}>
                <CountCard from={0} dur={d} n={cfg.n} of={3} word="TRUCO" title={title} bg={cfg.bg} t={1.5} />
              </div>
            </AbsoluteFill>
          </Sequence>
        );
      }
      if (!s.file) return null;
      const isVideo = s.file.endsWith(".mp4");
      const src = isVideo ? s.file.replace("broll/suengano/", "broll/suengano_cfr/") : s.file;
      const rate = isVideo ? Math.min(1, (s.clip ?? d) / d) : 1;
      return (
        <Sequence key={i} from={from} durationInFrames={dur}>
          <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, transform: `scale(${s.zoom})`, transformOrigin: "50% 50%" }}>
              {isVideo
                ? <OffthreadVideo src={staticFile(src)} muted playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
            </div>
          </AbsoluteFill>
        </Sequence>
      );
    })}
  </AbsoluteFill>
);

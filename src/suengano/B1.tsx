// suengano · bloque 400-540 s. Lee public/suengano_400_540.json. Tiempos del JSON en segundos absolutos del video;
// la composicion arranca en 400 s (base). El avatar sale de src/suengano/Avatar.tsx (reel muteado),
// la voz maestra es una sola pista (suenganocut.wav).
import React from "react";
import { Audio, AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile } from "remotion";
import { CountCard, Clipboard } from "../repkit/Kit";
import { AvatarWins } from "./Avatar";
import shots from "../../public/suengano_400_540.json";

type Shot = { from: number; to: number; kind: string; file: string | null; zoom: number; motive: string; clip?: number };
const FPS = 30;
const BASE = 400;
const fr = (s: number) => Math.round(s * FPS);
const rel = (s: number) => s - BASE;

export const SuenganoB1: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Audio src={staticFile("suenganocut.wav")} trimBefore={fr(BASE)} />
    <AvatarWins from={0} to={140} base={BASE} />
    {(shots as Shot[]).map((s, i) => {
      if (s.kind === "AV") return null;
      const from = fr(rel(s.from));
      const dur = fr(s.to) - fr(s.from);
      const d = s.to - s.from;
      if (s.kind === "C") {
        const comp =
          Math.abs(s.from - 468.23) < 0.1
            ? <CountCard from={0} dur={d} n={1} of={2} word="TRUCO" title="la primera cifra engaña" bg="img/suengano/caja_a.png" t={1.5} />
            : <Clipboard from={0} dur={d} title="Cuenta corta" bg="img/suengano/N574.png" lines={[{ txt: "2.999", t: 1 }, { txt: "3.000", t: 3 }, { txt: "suma uno", t: 5 }]} />;
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            <AbsoluteFill style={{ overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: "scale(0.6667)", transformOrigin: "0 0" }}>{comp}</div>
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

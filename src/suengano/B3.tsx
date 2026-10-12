// suengano · bloque 400-540 s. Lee public/suengano_680_820.json. Tiempos del JSON en segundos absolutos del video;
// la composicion arranca en 400 s (base). El avatar sale de src/suengano/Avatar.tsx (reel muteado),
// la voz maestra es una sola pista (suenganocut.wav).
import React from "react";
import { Audio, AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile } from "remotion";
import { CountCard, Clipboard, ShelfTag } from "../repkit/Kit";
import { AvatarWins } from "./Avatar";
import shots from "../../public/suengano_680_820.json";

type Shot = { from: number; to: number; kind: string; file: string | null; zoom: number; motive: string; clip?: number };
const FPS = 30;
const BASE = 680;
const fr = (s: number) => Math.round(s * FPS);
const rel = (s: number) => s - BASE;

export const SuenganoB3: React.FC = () => (
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
          Math.abs(s.from - 771.81) < 0.1
            ? <ShelfTag from={0} dur={d} bg="img/suengano/N145.png" at={[960, 470]} product="Chocolates" price={1500} unitLine="$ 1.500 el kg" tPrint={0.8} tLupa={3.2} tCircle={5.5} />
            : <Clipboard from={0} dur={d} title="Golosinas" bg="img/suengano/N574.png" lines={[{ txt: "a la altura del chico", t: 1 }, { txt: "pon el carrito lejos", t: 3 }, { txt: "avisa antes de comprar", t: 5 }]} />;
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

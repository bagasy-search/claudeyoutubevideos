// suengano · 65-400 s (Remotion). Lee public/suengano_65_400.json (CSV R5). AV = placeholder hasta el avatar.
import React from "react";
import { Audio, AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile } from "remotion";
import shots from "../../public/suengano_65_400.json";
import { CountCard, Clipboard, ShelfTag } from "../repkit/Kit";
import { AvatarWins } from "./Avatar";

type Shot = { from: number; to: number; kind: string; file: string | null; motive: string };
const FPS = 30;
const fr = (s: number) => Math.round(s * FPS);
// duracion real de cada clip (ffprobe). Si el plano es mas largo, el clip hace loop.
const CLIP_S: Record<string, number> = {
  "broll/suengano/s265.mp4": 9.4667, "broll/suengano/s087.mp4": 10.8, "broll/suengano/s236.mp4": 7.5409,
  "broll/suengano/s295.mp4": 9.84, "broll/suengano/s339.mp4": 7.8, "broll/suengano/s373.mp4": 7.72,
  "broll/suengano/s127.mp4": 9.133, "broll/suengano/s165.mp4": 10.44, "broll/suengano/s409.mp4": 10.32,
  "broll/suengano/w072.mp4": 5.5055, "broll/suengano/s155.mp4": 10.16, "broll/suengano/z098.mp4": 11.4667,
};

export const SuenganoRest: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Audio src={staticFile("suenganocut.wav")} trimBefore={fr(65)} />
    <AvatarWins from={0} to={335} base={65} />
    {(shots as Shot[]).map((s, i) => {
      const from = fr(s.from - 65);
      const dur = fr(s.to) - fr(s.from);
      if (s.kind === "AV") return null; // avatar lo monta AvatarWins
      if (!s.file && s.kind !== "C") {
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            <AbsoluteFill style={{ backgroundColor: "#6b6b6b" }} />
          </Sequence>
        );
      }
      if (s.kind === "C") {
        // componentes del kit repkit (bg propio obligatorio). Tiempos relativos al inicio del plano.
        const d = s.to - s.from;
        const comp =
          Math.abs(s.from - 184.72) < 0.1 ? <CountCard from={0} dur={d} n={1} of={3} word="TRAMPA" title="pan recién horneado en la entrada" bg="img/suengano/c_bg_s339.png" t={2} />
          : Math.abs(s.from - 250.55) < 0.1 ? <Clipboard from={0} dur={d} title="Lista de compras" bg="img/suengano/N574.png" lines={[{ txt: "Leche", t: 1 }, { txt: "Pan", t: 4 }, { txt: "Arroz", t: 7 }]} />
          : <ShelfTag from={0} dur={d} bg="img/suengano/c_bg_s409.png" at={[960, 470]} product="Arroz blanco" price={1240} unitLine="$ 1.240 el kg" tPrint={1.2} tLupa={4} tCircle={7} />;
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: "scale(0.6667)", transformOrigin: "0 0" }}>{comp}</div>
            </AbsoluteFill>
          </Sequence>
        );
      }
      const isVideo = s.file.endsWith(".mp4");
      return (
        <Sequence key={i} from={from} durationInFrames={dur}>
          <AbsoluteFill style={{ backgroundColor: "#000" }}>
            {isVideo
              ? <OffthreadVideo src={staticFile(s.file.replace("broll/suengano/", "broll/suengano_cfr/"))} muted playbackRate={Math.min(1, (CLIP_S[s.file] ?? s.to - s.from) / (s.to - s.from))} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <Img src={staticFile(s.file)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
          </AbsoluteFill>
        </Sequence>
      );
    })}
  </AbsoluteFill>
);

// suencargado: video completo 937,31 s. Todo sale de edl_full.json (segundos absolutos de la voz final).
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { CountCard, ShelfTag, OfferPoster } from "../repkit/Kit";
import EDL from "./edl_full.json";

const FPS = 30;
export const FULL_SECS = (EDL as any).total as number;

// Foto fija con empuje lento y deriva distinta por plano (no queda quieta).
const Still: React.FC<{ src: string; dur: number; dir: number }> = ({ src, dur, dir }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const k = interpolate(t, [0, dur], dir > 0 ? [1.0, 1.12] : [1.12, 1.02], { extrapolateRight: "clamp" });
  const dx = interpolate(t, [0, dur], dir > 0 ? [-1.2, 1.2] : [1.2, -1.2], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${k}) translateX(${dx}%)`, transformOrigin: "50% 50%" }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Full: React.FC<{ audioSrc?: string }> = ({ audioSrc }) => {
  const shots = (EDL as any).shots as { t0: number; t1: number; kind: string; src: string; ss?: number }[];
  const cc = (EDL as any).countcard as { n: number; from: number; dur: number; bg: string }[];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {shots.map((s, i) => {
        const from = Math.round(s.t0 * FPS);
        const dur = Math.max(1, Math.round((s.t1 - s.t0) * FPS));
        const dsec = s.t1 - s.t0;
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            {s.kind === "av" ? (
              <AbsoluteFill>
                <OffthreadVideo src={staticFile(s.src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </AbsoluteFill>
            ) : s.kind === "real" ? (
              <AbsoluteFill>
                <OffthreadVideo src={staticFile(s.src)} startFrom={Math.round((s.ss || 0) * FPS)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </AbsoluteFill>
            ) : (
              <Still src={s.src} dur={dsec} dir={i % 2 === 0 ? 1 : -1} />
            )}
          </Sequence>
        );
      })}
      {cc.map((c, i) => (
        <CountCard key={"cc" + i} from={c.from} dur={c.dur} n={c.n} of={12} word="SECRETO" title="LO QUE SABE EL ENCARGADO" bg={c.bg} t={c.from + 0.5} />
      ))}
      {(((EDL as any).small as any[]) || []).map((c, i) => (
        <div key={"sm" + i} style={{ position: "absolute", left: 40, bottom: 40, width: 672, height: 378, overflow: "hidden", zIndex: 10 }}>
          <div style={{ transform: "scale(0.35)", transformOrigin: "0 0", width: 1920, height: 1080 }}>
            <CountCard from={c.from} dur={c.dur} n={c.n} of={12} word="SECRETO" title="LO QUE SABE EL ENCARGADO" bg="img/suencargado/n03_frenteo.png" t={c.from + 0.3} />
          </div>
        </div>
      ))}
      {((EDL as any).comps as any[]).map((c, i) =>
        c.kind === "ShelfTag" ? (
          <ShelfTag key={"st" + i} from={c.from} dur={c.dur} bg={c.bg} at={c.at} product={c.product} price={c.price} unitLine={c.unitLine} tPrint={c.tPrint} tLupa={c.tLupa} tCircle={c.tCircle} ejemplo />
        ) : (
          <OfferPoster key={"op" + i} from={c.from} dur={c.dur} bg={c.bg} big={c.big} small={c.small} tIn={c.tIn} tPeel={c.tPeel} under={c.under} />
        ))}
      <Audio src={staticFile(audioSrc || "suencargadocut.wav")} />
    </AbsoluteFill>
  );
};

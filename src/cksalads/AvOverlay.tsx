// cksalads · Loretta a cámara: el reel de RunPod se ve SOLO en las piezas de avwin.json (fab), dentro de [from, to] del bloque.
import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile } from "remotion";
import { fr } from "./Base";
import AVW from "./avwin.json";

export const AvOverlay: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const pcs: { a: number; b: number; rt: number }[] = [];
  for (const w of (AVW as any).win as { ms: number; off: number; pieces: [number, number][] }[]) {
    for (const [a, b] of w.pieces) {
      if (b > from && a < to) pcs.push({ a: Math.max(a, from), b: Math.min(b, to), rt: w.off + (Math.max(a, from) - w.ms) });
    }
  }
  return (
    <>
      {pcs.map((p, i) => (
        <Sequence key={i} from={fr(p.a)} durationInFrames={Math.max(1, fr(p.b) - fr(p.a))}>
          <AbsoluteFill>
            <OffthreadVideo src={staticFile("av/reel0.mp4")} startFrom={fr(p.rt)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </AbsoluteFill>
        </Sequence>
      ))}
    </>
  );
};

// Entry GENÉRICO de la fábrica (rama fab-render y las de cada video): vlog mudo + capa de avatar + componentes del kit.
// Los datos los escribe vlog/fab/fab.py en src/fab/data/ (meta.json, ov.json, avwin.json). Mudo: la mezcla la pone encfin.
// ENTRY=src/index_fab.tsx  ·  composición "Fab"
import React from "react";
import { registerRoot, Composition, AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ClBookPage, ClQRCard, ClCheck } from "./claudio/ClCards";
import { ClVideoRef } from "./claudio/ClSarro";
import { FAB } from "./fab/Kit";
import META from "./fab/data/meta.json";
import OV from "./fab/data/ov.json";
import AV from "./fab/data/avwin.json";
const S: string = (META as any).slug;
const TOTAL: number = (META as any).total || 300;
const C: Record<string, React.FC<any>> = { ...FAB, ClBookPage, ClQRCard, ClCheck, ClVideoRef };
const Av: React.FC<{ sf: number }> = ({ sf }) => {
  const f = useCurrentFrame(); const { durationInFrames: d } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#EFEBE0" }}>
      <OffthreadVideo src={staticFile(`avatar_clips/${S}/reel30.mp4`)} startFrom={sf} muted
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1 + 0.035 * (f / Math.max(1, d))})`, transformOrigin: "50% 38%" }} />
    </AbsoluteFill>
  );
};
const Main: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <OffthreadVideo src={staticFile(`vid/${S}/vlog.mp4`)} muted />
    {(((AV as any).win || []) as { n: string; ms: number; pieces: [number, number][]; off: number; lag?: number }[])
      .flatMap((w, i) => (w.pieces || []).map((p, j) => ({ k: "av" + i + "_" + j, a: p[0], b: p[1], sf: w.off + (p[0] - w.ms) + (w.lag || 0) })))
      .map((p) => (
        <Sequence key={p.k} from={Math.round(p.a * 30)} durationInFrames={Math.max(1, Math.round((p.b - p.a) * 30))}>
          <Av sf={Math.max(0, Math.round(p.sf * 30))} />
        </Sequence>
      ))}
    {(OV as any[]).map((o, i) => { const K = C[o.c]; return K ? <Sequence key={i} from={o.from} durationInFrames={o.dur}><K {...o.props} /></Sequence> : null; })}
  </AbsoluteFill>
);
registerRoot(() => <Composition id="Fab" component={Main} durationInFrames={TOTAL} fps={30} width={1920} height={1080} />);

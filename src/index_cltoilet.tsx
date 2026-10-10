// Entry PROPIO de `cltoilet` (Loretta's Clean Home, EN) — 10-oct-2026.
// Reemplaza al entry genérico de la fábrica (`src/index_fab.tsx`) y al kit plano `src/fab/Kit.tsx`.
// · vlog mudo (`public/vid/cltoilet/vlog.mp4`) — el mismo, no se rehace.
// · capa de avatar = el reel YA PAGADO (`public/avatar_clips/cltoilet/reel30.mp4` + avwin.json): idéntica al entry viejo.
// · componentes = el kit propio de este video (`src/cltoilet/LKit.tsx`), con la cámara continua del momento.
//   Cada componente recibe `st` (su fotograma congelado en `public/img/cltoilet/_st/sNN.jpg`) y `f0` (frame global
//   del inicio), así todos los actos de un mismo momento comparten una única cámara.
// ENTRY=src/index_cltoilet.tsx  ·  composición "Fab"
import React from "react";
import { registerRoot, Composition, AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import * as LK from "./cltoilet/LKit";
import META from "./fab/data/meta.json";
import AV from "./fab/data/avwin.json";
import OV from "./cltoilet/ov.json";
const S: string = (META as any).slug;
const TOTAL: number = (META as any).total || 300;
const C: Record<string, React.FC<any>> = {
  LSpots: LK.LSpots, LPage: LK.LPage, LSplit: LK.LSplit, LSteps: LK.LSteps, LBeforeAfter: LK.LBeforeAfter,
  LNumber: LK.LNumber, LCalendar: LK.LCalendar, LQr: LK.LQr, LChannel: LK.LChannel, LList: LK.LList,
};
// avatar: alterna plano abierto / plano cerrado (punch-in) en cada pieza, como un editor con dos cámaras
const Av: React.FC<{ sf: number; k: number }> = ({ sf, k }) => {
  const f = useCurrentFrame(); const { durationInFrames: d } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#EFEBE0" }}>
      <OffthreadVideo src={staticFile(`avatar_clips/${S}/reel30.mp4`)} startFrom={sf} muted
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${(k % 2 ? 1.22 : 1) + 0.035 * (f / Math.max(1, d))})`, transformOrigin: k % 2 ? "50% 30%" : "50% 38%" }} />
    </AbsoluteFill>
  );
};
const Main: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <OffthreadVideo src={staticFile(`vid/${S}/vlog.mp4`)} muted />
    {(((AV as any).win || []) as { n: string; ms: number; pieces: [number, number][]; off: number; lag?: number }[])
      .flatMap((w, i) => (w.pieces || []).map((p, j) => ({ k: "av" + i + "_" + j, n: j, a: p[0], b: p[1], sf: w.off + (p[0] - w.ms) + (w.lag || 0) })))
      .map((p) => (
        <Sequence key={p.k} from={Math.round(p.a * 30)} durationInFrames={Math.max(1, Math.round((p.b - p.a) * 30))}>
          <Av sf={Math.max(0, Math.round(p.sf * 30))} k={(p as any).n} />
        </Sequence>
      ))}
    {(OV as any[]).map((o, i) => { const K = C[o.c]; return K ? <Sequence key={i} from={o.from} durationInFrames={o.dur}><K {...o.props} st={i} f0={o.from} /></Sequence> : null; })}
  </AbsoluteFill>
);
registerRoot(() => <Composition id="Fab" component={Main} durationInFrames={TOTAL} fps={30} width={1920} height={1080} />);

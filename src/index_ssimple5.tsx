// ssimple5 · entry Remotion (Sachiko). Kit lkit + edl del plan.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./ssimple5/edl.json";
import AV from "./ssimple5/avwin.json";

setKit({ nofx: true, imgDir: "img/ssimple5", grain: "img/ssimple5/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "clips/ssimple5", av: (AV as any).win });
export const Full = makePlayer(EDL as any, {} as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

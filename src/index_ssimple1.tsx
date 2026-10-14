// ssimple1 · entry Remotion (Sachiko's Simple Life). Kit lkit sin filtros (nofx) + edl del plan; sin héroes.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./ssimple1/edl.json";
import AV from "./ssimple1/avwin.json";

setKit({ imgDir: "img/ssimple1", nofx: true, qr: "qr.jpg", cover: "book_cover.png", clipDir: "clips/ssimple1", av: (AV as any).win });
export const Full = makePlayer(EDL as any, {} as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

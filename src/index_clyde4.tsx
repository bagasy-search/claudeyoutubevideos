// clyde4 · entry Remotion (Clyde's Smokehouse, collards + hock ahumado). Fotos/clips/avatar con el Player de lkit + componentes PROPIOS (src/clyde4/comps.tsx).
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./clyde4/edl.json";
import AV from "./clyde4/avwin.json";
import * as BK from "./clyde4/comps";

setKit({ imgDir: "img/clyde4", grain: "img/clyde4/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "clips/clyde4", avDir: "av/clyde4", av: (AV as any).win });
export const Full = makePlayer(EDL as any, BK as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

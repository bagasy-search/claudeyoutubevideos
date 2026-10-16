// clyde7 · entry Remotion (Clyde's Smokehouse, chuck roast ahumado). Fotos/clips/avatar con el Player de lkit + componentes PROPIOS (src/clyde7/comps.tsx).
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./clyde7/edl.json";
import AV from "./clyde7/avwin.json";
import * as CH from "./clyde7/comps";

setKit({ imgDir: "img/clyde7", grain: "img/clyde7/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "clips/clyde7", avDir: "av/clyde7", av: (AV as any).win });
export const Full = makePlayer(EDL as any, CH as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

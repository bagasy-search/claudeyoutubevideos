// clyde6 · entry Remotion (Clyde's Smokehouse, salchicha de desayuno casera, 8 trucos). Fotos/clips/avatar con el Player de lkit + componentes PROPIOS (src/clyde6/comps.tsx).
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./clyde6/edl.json";
import AV from "./clyde6/avwin.json";
import * as BK from "./clyde6/comps";

setKit({ imgDir: "img/clyde6", grain: "img/clyde6/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "clips/clyde6", avDir: "av/clyde6", av: (AV as any).win });
export const Full = makePlayer(EDL as any, BK as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

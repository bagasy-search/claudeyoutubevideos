// clyde5 · entry Remotion (Clyde's Smokehouse, tocino frito, 9 trucos). Fotos/clips/avatar con el Player de lkit + componentes PROPIOS (src/clyde5/comps.tsx).
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./clyde5/edl.json";
import AV from "./clyde5/avwin.json";
import * as BK from "./clyde5/comps";

setKit({ imgDir: "img/clyde5", grain: "img/clyde5/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "clips/clyde5", avDir: "av/clyde5", av: (AV as any).win });
export const Full = makePlayer(EDL as any, BK as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

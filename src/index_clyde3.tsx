// clyde3 · entry Remotion (Clyde's Smokehouse, brisket sin papel aluminio). Fotos/clips/avatar con el Player de lkit + componentes PROPIOS (src/clyde3/comps.tsx).
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./clyde3/edl.json";
import AV from "./clyde3/avwin.json";
import * as BK from "./clyde3/comps";

setKit({ imgDir: "img/clyde3", grain: "img/clyde3/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "clips/clyde3", avDir: "av/clyde3", av: (AV as any).win });
export const Full = makePlayer(EDL as any, BK as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

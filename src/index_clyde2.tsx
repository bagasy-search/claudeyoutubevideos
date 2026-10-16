// clyde2 · entry Remotion (Clyde's Smokehouse, tocino casero). Fotos/clips/avatar con el Player de lkit + componentes PROPIOS (src/clyde2/comps.tsx).
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./clyde2/edl.json";
import AV from "./clyde2/avwin.json";
import * as BC from "./clyde2/comps";

setKit({ imgDir: "img/clyde2", grain: "img/clyde2/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "clips/clyde2", avDir: "av/clyde2", av: (AV as any).win });
export const Full = makePlayer(EDL as any, BC as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

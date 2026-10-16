// gus1 · entry Remotion (Gus the Hotel Janitor, manchas marrones del inodoro). Fotos/clips/avatar con el Player de lkit + componentes PROPIOS (src/gus1/comps.tsx).
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./gus1/edl.json";
import AV from "./gus1/avwin.json";
import * as BC from "./gus1/comps";

setKit({ imgDir: "img/gus1", grain: "img/gus1/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "clips/gus1", avDir: "av/gus1", av: (AV as any).win });
export const Full = makePlayer(EDL as any, BC as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

// gus2 · entry Remotion (Gus the Hotel Janitor, moho de la ducha). Fotos/clips/avatar con el Player de lkit + componentes PROPIOS (src/gus2/comps.tsx).
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./gus2/edl.json";
import AV from "./gus2/avwin.json";
import * as BC from "./gus2/comps";

setKit({ imgDir: "img/gus2", grain: "img/gus2/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "clips/gus2", avDir: "av/gus2", av: (AV as any).win });
export const Full = makePlayer(EDL as any, BC as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

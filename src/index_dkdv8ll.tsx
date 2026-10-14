// dkdv8ll · entry Remotion (Dale Kessler). Kit lkit + edl del plan + héroes propios.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./dkdv8ll/edl.json";
import AV from "./dkdv8ll/avwin.json";
import * as H from "./dkdv8ll/heroes";

setKit({ imgDir: "img/dkdv8ll", grain: "img/dkdv8ll/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "clips/dkdv8ll", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

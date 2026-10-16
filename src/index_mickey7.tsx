// mickey7 · entry Remotion (Mickey's Butcher Shop, video 7: el chuck eye, el steak escondido en un roast de $5). Kit lkit + edl del plan + héroes propios.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./mickey7/edl.json";
import AV from "./mickey7/avwin.json";
import * as H from "./mickey7/heroes";

setKit({ imgDir: "img/mickey7", ext: "png", clipDir: "broll/mickey7", avDir: "av/mickey7", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

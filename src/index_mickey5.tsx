// mickey5 · entry Remotion (Mickey's Butcher Shop, video 5: el pavo de Thanksgiving). Kit lkit + edl del plan + héroes propios.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./mickey5/edl.json";
import AV from "./mickey5/avwin.json";
import * as H from "./mickey5/heroes";

setKit({ imgDir: "img/mickey5", ext: "png", clipDir: "clips/mickey5", avDir: "av/mickey5", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

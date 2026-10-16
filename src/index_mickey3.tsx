// mickey3 · entry Remotion (Mickey's Butcher Shop, video 2: la carne para guiso). Kit lkit + edl del plan + héroes propios.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./mickey3/edl.json";
import AV from "./mickey3/avwin.json";
import * as H from "./mickey3/heroes";

setKit({ imgDir: "img/mickey3", ext: "png", clipDir: "clips/mickey3", avDir: "av/mickey3", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

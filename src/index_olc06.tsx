// olc06 · entry Remotion (Ole's Camp Kitchen, plan6). Kit lkit + edl del plan + héroes propios.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./olc06/edl.json";
import AV from "./olc06/avwin.json";
import * as H from "./olc06/heroes";

setKit({ imgDir: "img/olc06", ext: "png", clipDir: "broll/olc06", avDir: "av/olc06", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

// olice · entry Remotion (Ole's Winter Larder, prueba plan6). Kit lkit + edl del plan + héroes propios.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./olice/edl.json";
import AV from "./olice/avwin.json";
import * as H from "./olice/heroes";

setKit({ imgDir: "img/olice", ext: "png", clipDir: "broll/olice", avDir: "av/olice", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

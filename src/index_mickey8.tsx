// mickey8 · entry Remotion (Mickey's Butcher Shop, video 6: el pastel de carne que nunca sale seco). Kit lkit + edl del plan + héroes propios.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./mickey8/edl.json";
import AV from "./mickey8/avwin.json";
import * as H from "./mickey8/heroes";

setKit({ imgDir: "img/mickey8", ext: "png", clipDir: "broll/mickey8", avDir: "av/mickey8", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

// opalscraps · entry Remotion (Opal's Hen House). Kit lkit + edl del plan + héroes propios PURO CSS.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./opalscraps/edl.json";
import AV from "./opalscraps/avwin.json";
import * as H from "./opalscraps/heroes";

setKit({ imgDir: "img/opalscraps", ext: "png", clipDir: "broll/opalscraps", avDir: "av/opalscraps", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

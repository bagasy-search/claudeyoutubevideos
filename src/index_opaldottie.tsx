// opaldottie · entry Remotion (Opal's Hen House). Kit lkit + edl del plan + héroes propios PURO CSS.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./opaldottie/edl.json";
import AV from "./opaldottie/avwin.json";
import * as H from "./opaldottie/heroes";

setKit({ imgDir: "img/opaldottie", ext: "png", clipDir: "broll/opaldottie", avDir: "av/opaldottie", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

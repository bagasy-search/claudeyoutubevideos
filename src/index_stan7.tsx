// stan7 · entry Remotion (Stan the Butcher, video 7: la kielbasa no se fríe, se baña). Kit lkit + edl del plan + héroes propios.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./stan7/edl.json";
import AV from "./stan7/avwin.json";
import * as H from "./stan7/heroes";

setKit({ imgDir: "img/stan7", ext: "png", clipDir: "broll/stan7", avDir: "av/stan7", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

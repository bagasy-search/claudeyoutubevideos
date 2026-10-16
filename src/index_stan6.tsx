// stan6 · entry Remotion (Stan the Butcher, video 6: la chuleta de cerdo jugosa, 9 trucos). Kit lkit + edl del plan + héroes propios.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./stan6/edl.json";
import AV from "./stan6/avwin.json";
import * as H from "./stan6/heroes";

setKit({ imgDir: "img/stan6", ext: "png", clipDir: "broll/stan6", avDir: "av/stan6", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

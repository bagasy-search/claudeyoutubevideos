// opalcoop · entry Remotion (Opal's Hen House). Kit lkit + edl del plan + héroes propios PURO CSS.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./opalcoop/edl.json";
import AV from "./opalcoop/avwin.json";
import * as H from "./opalcoop/heroes";

setKit({ imgDir: "img/opalcoop", ext: "png", clipDir: "broll/opalcoop", avDir: "av/opalcoop", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

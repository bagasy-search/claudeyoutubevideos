// mickey6 · entry Remotion (Mickey's Butcher Shop, video 6: la paleta de cerdo que se deshace sola). Kit lkit + edl del plan + héroes propios.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./mickey6/edl.json";
import AV from "./mickey6/avwin.json";
import * as H from "./mickey6/heroes";

setKit({ imgDir: "img/mickey6", ext: "png", clipDir: "broll/mickey6", avDir: "av/mickey6", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

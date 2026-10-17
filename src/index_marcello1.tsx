// marcello1 · entry Remotion (Chef Marcello, video 1: frijoles sin gases). Kit lkit + edl del plan + héroes propios.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./marcello1/edl.json";
import AV from "./marcello1/avwin.json";
import * as H from "./marcello1/heroes";

setKit({ imgDir: "img/marcello1", ext: "png", clipDir: "broll/marcello1", avDir: "av/marcello1", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

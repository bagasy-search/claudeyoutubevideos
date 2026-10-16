// helen6 · entry Remotion (Helen's Meat Market, 8 trucos, piel crocante de muslo a 80 centavos). Kit lkit + componentes propios (src/helen6/heroes).
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import * as H from "./helen6/heroes";
import EDL from "./helen6/edl.json";
import AV from "./helen6/avwin.json";

setKit({ imgDir: "img/helen6", grain: "", clipDir: "clips/helen6", avDir: "av/helen6", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

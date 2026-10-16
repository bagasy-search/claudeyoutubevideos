// helen4 · entry Remotion (Helen's Meat Market, porotos + garrón de 2 dólares). Kit lkit + componentes propios (src/helen4/heroes).
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import * as H from "./helen4/heroes";
import EDL from "./helen4/edl.json";
import AV from "./helen4/avwin.json";

setKit({ imgDir: "img/helen4", grain: "", clipDir: "clips/helen4", avDir: "av/helen4", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

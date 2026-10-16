// helen2 · entry Remotion (Helen's Meat Market, repollo + cerdo de 2 dólares). Kit lkit + componentes propios (src/helen2/heroes).
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import * as H from "./helen2/heroes";
import EDL from "./helen2/edl.json";
import AV from "./helen2/avwin.json";

setKit({ imgDir: "img/helen2", grain: "", clipDir: "clips/helen2", avDir: "av/helen2", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

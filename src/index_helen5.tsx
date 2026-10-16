// helen5 · entry Remotion (Helen's Meat Market, 25 trucos, 20 dólares de carne la semana). Kit lkit + componentes propios (src/helen5/heroes).
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import * as H from "./helen5/heroes";
import EDL from "./helen5/edl.json";
import AV from "./helen5/avwin.json";

setKit({ imgDir: "img/helen5", grain: "", clipDir: "clips/helen5", avDir: "av/helen5", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

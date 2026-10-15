// helen1 · entry Remotion (Helen's Meat Market, 25 freezer tricks). Kit lkit + edl del plan.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./helen1/edl.json";
import AV from "./helen1/avwin.json";

setKit({ imgDir: "img/helen1", grain: "", clipDir: "clips/helen1", avDir: "av/helen1", av: (AV as any).win });
export const Full = makePlayer(EDL as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

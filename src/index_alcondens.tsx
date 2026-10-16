// alcondens · entry Remotion (Claudio el Albañil). Kit lkit + edl del plan (sin héroes).
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./alcondens/edl.json";
import AV from "./alcondens/avwin.json";

setKit({ imgDir: "img/alcondens", ext: "png", grain: "img/alcondens/grain.png", clipDir: "clips/alcondens", avDir: "av/alcondens", av: (AV as any).win });
export const Full = makePlayer(EDL as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

// alagujero · entry Remotion (Claudio el Albañil). Kit lkit + edl del plan (sin héroes).
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./alagujero/edl.json";
import AV from "./alagujero/avwin.json";

setKit({ imgDir: "img/alagujero", ext: "png", grain: "img/alagujero/grain.png", clipDir: "clips/alagujero", avDir: "av/alagujero", av: (AV as any).win });
export const Full = makePlayer(EDL as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

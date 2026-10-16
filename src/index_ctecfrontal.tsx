// ctecfrontal · entry Remotion (Claudio el Técnico). Kit lkit + edl del plan (sin héroes).
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./ctecfrontal/edl.json";
import AV from "./ctecfrontal/avwin.json";

setKit({ imgDir: "img/ctecfrontal", ext: "png", grain: "img/ctecfrontal/grain.png", clipDir: "broll/ctecfrontal", avDir: "av/ctecfrontal", av: (AV as any).win });
export const Full = makePlayer(EDL as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

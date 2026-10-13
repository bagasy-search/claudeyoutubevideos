// clguest · entry Remotion (Loretta's Clean Home, 9 things Thanksgiving guests notice). Kit lkit + edl del plan.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./clguest/edl.json";
import AV from "./clguest/avwin.json";

setKit({ imgDir: "img/clguest", grain: "img/clguest/grain.png", qr: "qr.jpg", cover: "book_cover.png", av: (AV as any).win });
export const Full = makePlayer(EDL as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

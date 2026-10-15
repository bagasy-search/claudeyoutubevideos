// wby3 · entry Remotion (Walt's Backyard, baking soda yard tricks). Kit lkit + edl del plan + héroes propios.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./wby3/edl.json";
import AV from "./wby3/avwin.json";
import * as H from "./wby3/heroes";

setKit({ imgDir: "img/wby3", grain: "img/wby3/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "clips/wby3", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

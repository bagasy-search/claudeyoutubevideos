// dkdv8l7 · entry Remotion (Dale Kessler, 9 ways homeowners insurance pays zero). Kit lkit + edl del plan + héroes propios.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./dkdv8l7/edl.json";
import AV from "./dkdv8l7/avwin.json";
import * as H from "./dkdv8l7/heroes";

setKit({ imgDir: "img/dkdv8l7", grain: "img/dkdv8l7/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "clips/dkdv8l7", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

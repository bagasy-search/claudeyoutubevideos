// dkdv8le · entry Remotion (Dale Kessler, renewal after 60). Kit lkit + edl del plan + héroes propios.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./dkdv8le/edl.json";
import AV from "./dkdv8le/avwin.json";
import * as H from "./dkdv8le/heroes";

setKit({ imgDir: "img/dkdv8le", grain: "img/dkdv8le/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "clips/dkdv8le", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

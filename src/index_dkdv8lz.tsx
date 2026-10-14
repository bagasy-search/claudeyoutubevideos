// dkdv8lz · entry Remotion (Dale Kessler, 15 cheap Walmart items). Kit lkit + edl del plan + héroes propios.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./dkdv8lz/edl.json";
import AV from "./dkdv8lz/avwin.json";
import * as H from "./dkdv8lz/heroes";

setKit({ imgDir: "img/dkdv8lz", grain: "img/dkdv8lz/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "clips/dkdv8lz", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

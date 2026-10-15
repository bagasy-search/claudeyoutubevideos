// skhsick · entry Remotion (Claudio el Plomero, 5 cosas que tiras por el fregadero). Kit lkit + edl del plan + héroes propios.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./skhsick/edl.json";
import AV from "./skhsick/avwin.json";
import * as H from "./skhsick/heroes";

setKit({ nofx: true, imgDir: "img/skhsick", grain: "img/skhsick/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "clips/skhsick", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

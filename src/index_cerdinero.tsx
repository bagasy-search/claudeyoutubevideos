// cerdinero · entry Remotion (Claudio el Cerrajero). Kit lkit + edl del plan + héroes propios.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./cerdinero/edl.json";
import AV from "./cerdinero/avwin.json";
import * as H from "./cerdinero/heroes";

setKit({ imgDir: "img/cerdinero", grain: "img/cerdinero/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "clips/cerdinero", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

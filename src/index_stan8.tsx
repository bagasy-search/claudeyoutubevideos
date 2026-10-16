// stan8 · entry Remotion (Stan the Butcher, video 2: el truco de la costra y los 17 trucos). Kit lkit + edl del plan + héroes propios.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./stan8/edl.json";
import AV from "./stan8/avwin.json";
import * as H from "./stan8/heroes";

setKit({ imgDir: "img/stan8", grain: "img/stan8/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "broll/stan8", avDir: "av/stan8", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

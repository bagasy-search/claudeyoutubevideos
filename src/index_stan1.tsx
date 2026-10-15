// stan1 · entry Remotion (Stan the Butcher, video 1: el bife de restaurante en casa). Kit lkit + edl del plan + héroes propios.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./stan1/edl.json";
import AV from "./stan1/avwin.json";
import * as H from "./stan1/heroes";

setKit({ imgDir: "img/stan1", grain: "img/stan1/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "clips/stan1", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

// stan5 · entry Remotion (Stan the Butcher, video 5: 200 libras de albóndigas). Kit lkit + edl del plan + héroes propios.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./stan5/edl.json";
import AV from "./stan5/avwin.json";
import * as H from "./stan5/heroes";

setKit({ imgDir: "img/stan5", grain: "img/stan5/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "clips/stan5", avDir: "av/stan5", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

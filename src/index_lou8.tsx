// lou8 · entry Remotion (Lou's Diner Secrets, tanda próximos 6). Kit lkit + edl de plan6 + héroes de Lou.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./lou8/edl.json";
import AV from "./lou8/avwin.json";
import * as H from "./lou8/heroes";

setKit({ imgDir: "img/lou8", grain: "img/lou8/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "broll/lou8", avDir: "av/lou8", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

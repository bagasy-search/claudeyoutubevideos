// tswdrip · entry Remotion (The Scrap WorkShop: tswdrip). Kit lkit + edl del plan + héroes propios. Sin grano ni grade.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./tswdrip/edl.json";
import AV from "./tswdrip/avwin.json";
import * as H from "./tswdrip/heroes";

setKit({ imgDir: "img/tswdrip", ext: "jpg", grain: "img/tswdrip/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "broll/tswdrip", avDir: "av/tswdrip", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

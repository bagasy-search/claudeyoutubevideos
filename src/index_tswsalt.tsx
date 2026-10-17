// tswsalt · entry Remotion (The Scrap WorkShop: tswsalt). Kit lkit + edl del plan + héroes propios. Sin grano ni grade.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./tswsalt/edl.json";
import AV from "./tswsalt/avwin.json";
import * as H from "./tswsalt/heroes";

setKit({ imgDir: "img/tswsalt", ext: "jpg", grain: "img/tswsalt/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "broll/tswsalt", avDir: "av/tswsalt", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

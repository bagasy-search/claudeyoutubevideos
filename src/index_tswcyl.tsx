// tswcyl · entry Remotion (The Scrap WorkShop: tswcyl). Kit lkit + edl del plan + héroes propios. Sin grano ni grade.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./tswcyl/edl.json";
import AV from "./tswcyl/avwin.json";
import * as H from "./tswcyl/heroes";

setKit({ imgDir: "img/tswcyl", ext: "jpg", grain: "img/tswcyl/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "broll/tswcyl", avDir: "av/tswcyl", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

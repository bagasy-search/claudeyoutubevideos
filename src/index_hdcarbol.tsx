// hdcarbol · entry Remotion (El Huerto de Claudio). Kit lkit + edl del plan + héroes propios.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./hdcarbol/edl.json";
import AV from "./hdcarbol/avwin.json";
import * as H from "./hdcarbol/heroes";

setKit({ imgDir: "img/hdcarbol", grain: "img/hdcarbol/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "clips/hdcarbol", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

// tdcvirales · entry Remotion (El Taller de Claudio). Kit lkit + edl del plan + héroes propios.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./tdcvirales/edl.json";
import AV from "./tdcvirales/avwin.json";
import * as H from "./tdcvirales/heroes";

setKit({ imgDir: "img/tdcvirales", grain: "img/tdcvirales/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "clips/tdcvirales", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

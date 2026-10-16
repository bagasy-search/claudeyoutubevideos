// chayo2 · entry Remotion (La Cocina de Doña Chayo, video 2: 25 desayunos de rancho). Kit lkit + edl del plan + héroes propios del rancho.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./chayo2/edl.json";
import AV from "./chayo2/avwin.json";
import * as H from "./chayo2/heroes";

setKit({ imgDir: "img/chayo2", grain: "img/chayo2/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "clips/chayo2", avDir: "av/chayo2", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

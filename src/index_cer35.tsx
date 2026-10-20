// cer35 · entry Remotion (Claudio el Cerrajero). Kit lkit + edl del plan + héroes propios.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./cer35/edl.json";
import AV from "./cer35/avwin.json";
import * as H from "./cer35/heroes";

setKit({ imgDir: "img/cer35", grain: "img/cer35/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "clips/cer35", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

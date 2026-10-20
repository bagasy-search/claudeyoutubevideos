// skhcloset · entry Remotion (Sachiko). Kit lkit + edl del plan.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./skhcloset/edl.json";
import AV from "./skhcloset/avwin.json";

setKit({ nofx: true, imgDir: "img/skhcloset", grain: "img/skhcloset/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "clips/skhcloset", av: (AV as any).win });
export const Full = makePlayer(EDL as any, {} as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

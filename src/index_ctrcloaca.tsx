// ctrcloaca · entry Remotion (Los Trucos de Claudio) · estilo cheapfix: clips multishot + kit de texto TheCheapFix.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./ctrcloaca/edl.json";
import AV from "./ctrcloaca/avwin.json";

setKit({ imgDir: "img/ctrcloaca", grain: "img/ctrcloaca/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "broll/ctrcloaca", av: (AV as any).win });
export const Full = makePlayer(EDL as any, {} as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));

// cmekitvs · entry Remotion (Claudio Mendoza Constructor). Kit lkit + edl del plan (sin héroes).
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./cmekitvs/edl.json";
import AV from "./cmekitvs/avwin.json";

setKit({ imgDir: "img/cmekitvs", ext: "png", grain: "img/cmekitvs/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "broll/cmekitvs", avDir: "av/cmekitvs", av: (AV as any).win });
export const Full = makePlayer(EDL as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));
